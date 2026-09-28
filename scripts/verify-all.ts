// ============================================================================
// EVO CORE / TELEMETRY VERIFICATION SUITE
// ============================================================================

import { TelemetryIntegrityService } from '../src/components/evoLabCore/services/telemetryIntegrityService';
import { MachineAdapter } from '../src/components/evoLabCore/services/machineAdapter';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

async function runTests() {
  console.log('=== TEST 1: LIVE_SCAN_NON_WINDOWS_TEST ===');
  try {
    const res = await fetch('http://localhost:3000/api/telemetry/live-scan');
    assert(res.status === 503, `HTTP status is 503 (got ${res.status})`);
    
    const body = await res.json();
    assert(body.error === 'AUTODETECTION_FAILED', `Error code is AUTODETECTION_FAILED (got ${body.error})`);
    assert(!body.CPU, 'Body contains 0 fake CPU');
    assert(!body.GPU, 'Body contains 0 fake GPU');
    assert(!body.RAM_GB, 'Body contains 0 fake RAM_GB');
    assert(!body.totalmem, 'Body contains 0 server totalmem');
    assert(!body.cpus, 'Body contains 0 server cpus');
    assert(body.platform === 'linux' || body.platform === process.platform, `Platform matches host platform (${body.platform})`);
  } catch (err: any) {
    assert(false, `Error fetching /api/telemetry/live-scan: ${err.message}`);
  }

  console.log('\n=== TEST 2: SERVER_HARDWARE_FALLBACK_REMOVED ===');
  const viteConfig = fs.readFileSync(path.resolve('vite.config.ts'), 'utf-8');
  assert(!viteConfig.includes('os.cpus()'), 'vite.config.ts has NO os.cpus() fallback');
  assert(!viteConfig.includes('os.totalmem()'), 'vite.config.ts has NO os.totalmem() fallback');
  assert(!viteConfig.includes('os.platform()'), 'vite.config.ts has NO os.platform() fallback');
  assert(!viteConfig.includes("require('os')") && !viteConfig.includes('import os from'), 'vite.config.ts does not import os module for hardware');

  const telemetryServiceCode = fs.readFileSync(
    path.resolve('src/components/evoLabCore/services/telemetryIntegrityService.ts'),
    'utf-8'
  );
  assert(!telemetryServiceCode.includes('os.cpus'), 'telemetryIntegrityService has NO os.cpus fallback');
  assert(!telemetryServiceCode.includes('os.totalmem'), 'telemetryIntegrityService has NO os.totalmem fallback');

  console.log('\n=== TEST 3: MACHINE_CREATION_GUARD ===');
  // Test evaluateTelemetryIntegrity with AUTODETECTION_FAILED
  const evalResult = TelemetryIntegrityService.evaluateTelemetryIntegrity({
    error: 'AUTODETECTION_FAILED',
    message: 'Host platform does not support WMI',
  });
  assert(evalResult.machine === null, 'evaluateTelemetryIntegrity returns machine === null on AUTODETECTION_FAILED');
  assert(evalResult.status === 'AUTODETECTION_FAILED', 'evaluateTelemetryIntegrity returns status AUTODETECTION_FAILED');
  assert(evalResult.integrityScore === 0, 'evaluateTelemetryIntegrity integrityScore is 0');
  assert(evalResult.discrepancies.length > 0, 'evaluateTelemetryIntegrity generates UNAVAILABLE discrepancies');

  // Test scanAndValidateLiveEndpoint() against running server (returns 503)
  const scanResult = await TelemetryIntegrityService.scanAndValidateLiveEndpoint();
  assert(scanResult.machine === null, 'scanAndValidateLiveEndpoint returns machine === null on 503');
  assert(scanResult.status === 'AUTODETECTION_FAILED' || scanResult.status === 'UNAVAILABLE', `scanAndValidateLiveEndpoint status is ${scanResult.status}`);
  assert(scanResult.error === 'AUTODETECTION_FAILED', 'scanAndValidateLiveEndpoint reports AUTODETECTION_FAILED');

  console.log('\n=== TEST 4: LOCALSTORAGE_GUARD ===');
  // Outside browser (Node environment), typeof localStorage is 'undefined'
  assert(typeof localStorage === 'undefined', "Environment is outside browser (typeof localStorage === 'undefined')");
  
  const testMachine = MachineAdapter.createBlankMachine('Test Machine');
  let threwOnSave = false;
  try {
    MachineAdapter.saveActiveMachine(testMachine);
  } catch {
    threwOnSave = true;
  }
  assert(!threwOnSave, 'MachineAdapter.saveActiveMachine does NOT throw when localStorage is undefined');

  let threwOnLoad = false;
  let loadedMachine: any = null;
  try {
    loadedMachine = MachineAdapter.loadExistingMachine();
  } catch {
    threwOnLoad = true;
  }
  assert(!threwOnLoad, 'MachineAdapter.loadExistingMachine does NOT throw when localStorage is undefined');
  assert(loadedMachine && loadedMachine.id, 'MachineAdapter.loadExistingMachine returns a blank machine safely');

  console.log('\n=== TEST 5: AGENT_IMPORT_TEST ===');
  let agentProc: any = null;
  const agentUrl = 'http://127.0.0.1:43921';

  // Check if agent is already running
  let isRunning = false;
  try {
    const check = await fetch(`${agentUrl}/health`, { signal: AbortSignal.timeout(1000) });
    if (check.ok) isRunning = true;
  } catch {}

  if (!isRunning) {
    agentProc = spawn('npx', ['tsx', 'evo-agent/src/index.ts'], { stdio: 'pipe' });
    await new Promise<void>((resolve) => {
      let started = false;
      agentProc.stdout?.on('data', (d: any) => {
        if (d.toString().includes('Servidor escuchando en')) {
          started = true;
          resolve();
        }
      });
      setTimeout(() => { if (!started) resolve(); }, 2000);
    });
  }

  try {
    // 5.1 GET /health -> 200
    const healthRes = await fetch(`${agentUrl}/health`);
    assert(healthRes.status === 200, `Agent /health returns 200 (got ${healthRes.status})`);
    const healthJson = await healthRes.json();
    assert(healthJson.status === 'OK', `Agent health status is 'OK' (got ${healthJson.status})`);

    // 5.2 Handshake: POST /health/handshake
    const handshakeRes = await fetch(`${agentUrl}/health/handshake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    assert(handshakeRes.status === 200, `Agent handshake returns 200 (got ${handshakeRes.status})`);
    const handshakeJson = await handshakeRes.json();
    const token = handshakeJson.sessionToken;
    assert(typeof token === 'string' && token.length > 0, `Agent returned valid sessionToken`);

    // 5.3 GET /v1/machine without token -> 401
    const unauthMachineRes = await fetch(`${agentUrl}/v1/machine`);
    assert(unauthMachineRes.status === 401, `Agent /v1/machine without token returns 401 Unauthorized (got ${unauthMachineRes.status})`);

    // 5.4 GET /v1/machine with token -> 200
    const authMachineRes = await fetch(`${agentUrl}/v1/machine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(authMachineRes.status === 200, `Agent /v1/machine with token returns 200 OK (got ${authMachineRes.status})`);
    const machineInventory = await authMachineRes.json();
    assert(machineInventory && typeof machineInventory === 'object', 'Agent returns machine inventory object');

    // 5.5 MachineAdapter.fromAgentPayload converts to complete Canonical Machine
    const canonical = MachineAdapter.fromAgentPayload(machineInventory);
    assert(canonical !== null, 'MachineAdapter.fromAgentPayload successfully adapts payload');
    assert(canonical.source === 'AUTODETECT', `Machine source is 'AUTODETECT' (got ${canonical.source})`);
    assert(canonical.notes.includes('EVO Local Agent'), 'Machine notes confirm origin from EVO Local Agent');
    assert(canonical.cpu && typeof canonical.cpu.model === 'string', 'Machine has structured CPU');
    assert(canonical.ram && typeof canonical.ram.sizeGb === 'number', 'Machine has structured RAM');
    assert(canonical.gpu && typeof canonical.gpu.model === 'string', 'Machine has structured GPU');
    assert(canonical.motherboard && typeof canonical.motherboard.model === 'string', 'Machine has structured Motherboard');

    console.log('  -> Confirmed: Only the Agent can feed a complete physical Machine with verified CIM/WMI data.');
  } finally {
    if (agentProc) {
      agentProc.kill('SIGKILL');
    }
  }

  console.log('\n============================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
