/** Contract fixtures below are synthetic TEST data, never evidence of real Windows capture. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { writeFileSync } from 'node:fs';
import os from 'node:os';
import http from 'node:http';
import { AgentSecurityManager } from '../evo-agent/src/security';
import { AgentTelemetryManager } from '../evo-agent/src/telemetry';
import { averageTimerMs } from '../evo-agent/src/windowsTelemetry';
import { EOE_LIMITS, METRICS, safeInterval, type ObservabilityFrame } from '../evo-agent/src/observabilityProtocol';
import { BoundedSeries, normalizeFrame, missingFrame, statistics, exportCsv } from '../src/observability/series';
import { ObservabilityEngine } from '../src/observability/engine';
const turn = () => new Promise<void>(r => setImmediate(r));
function fixture(at = Date.now(), sequence = 1): { observability: ObservabilityFrame } {
  const timestampUtc = new Date(at).toISOString();
  return { observability: { sessionId: 'TEST-AGENT', schemaVersion: '1.0', agentVersion: '1.1.0', sequence, timestampUtc, platform: 'win32', processes: [], processError: 'TEST_NO_PROCESSES',
    samples: Object.entries(METRICS).map(([metricId, d]) => ({ ...(metricId.includes('Latency') ? { counterEvidence: { startTicks: '1000000', endTicks: '1500000', startBase: '2', endBase: '22', frequencyHz: '1000000' } } : {}), sessionId: 'TEST-AGENT', metricId, timestampUtc, value: 25, unit: d.unit, source: d.source, sampleIntervalMs: 2000, validity: 'VALID', captureError: null, lost: false, late: false, agentVersion: '1.1.0', schemaVersion: '1.0' })) } };
}
const request = (origin: string | undefined, token: string) => ({ headers: { ...(origin ? { origin } : {}), 'x-evo-agent-token': token } }) as any;
test('secure pairing: origin-bound, one use, expiry, bounded attempts, Unicode-safe comparison', () => {
  let now = Date.now(), code = '';
  const security = new AgentSecurityManager(value => { code = value; }, () => now);
  assert.equal(security.isOriginAllowed('https://evil.run.app').allowed, false);
  assert.equal(security.isOriginAllowed('http://localhost/path').allowed, false);
  assert.equal(security.isOriginAllowed('file://localhost').allowed, false);
  assert.equal(security.isOriginAllowed('http://localhost:3000').allowed, true);
  assert.equal(security.isOriginAllowed('https://ais-dev-ozfhvuxwnhwwzmlhkvf4sw-135361764474.us-east1.run.app').allowed, true);
  const used = code;
  const { sessionToken } = security.pair(code, 'http://localhost:3000');
  assert.match(sessionToken, /^[a-f0-9]{64}$/);
  assert.equal(security.validateToken(request('http://localhost:3000', sessionToken)), true);
  assert.equal(security.validateToken(request('http://localhost:4000', sessionToken)), false);
  assert.equal(security.validateToken(request(undefined, sessionToken)), false);
  assert.equal(security.validateToken(request('http://localhost:3000', 'é'.repeat(64))), false);
  assert.throws(() => security.pair(used, 'http://localhost:3000'), /INVALID/);
  security.revoke('http://localhost:3000'); assert.equal(security.validateToken(request('http://localhost:3000', sessionToken)), false);
  const renewed = security.pair(code, 'http://localhost:3000');
  now += 8 * 3600000 + 1; assert.equal(security.validateToken(request('http://localhost:3000', renewed.sessionToken)), false);
  assert.throws(() => security.pair(code, undefined), /EXPIRED/);
  for (let i = 0; i < 4; i++) assert.throws(() => security.pair('000000', undefined), /INVALID/);
  assert.throws(() => security.pair('000000', undefined), /RATE_LIMITED/);
  assert.throws(() => security.pair(code, undefined), /RATE_LIMITED/);
  now += 60001; assert.ok(security.pair(code, undefined).sessionToken);
});
test('normalization: identity, UTC, units, unknowns, invalid values, unsupported platform and missing metrics', () => {
  const now = Date.now(), input = fixture(now);
  const frame = normalizeFrame(input, 'TEST-SESSION', 2000, now);
  assert.equal(frame.samples.length, Object.keys(METRICS).length);
  assert.ok(frame.samples.every(s => s.sessionId === 'TEST-SESSION' && s.validity === 'VALID'));
  input.observability.samples[0].value = null;
  input.observability.samples[0].validity = 'UNKNOWN';
  assert.equal(normalizeFrame(input, 's', 2000, now).samples[0].value, null);
  input.observability.samples[0].value = NaN;
  assert.equal(normalizeFrame(input, 's', 2000, now).samples[0].captureError, 'INVALID_METRIC_VALUE');
  input.observability.samples[0].value = 25; input.observability.samples[0].unit = 'bytes';
  assert.equal(normalizeFrame(input, 's', 2000, now).samples[0].captureError, 'UNIT_MISMATCH');
  input.observability.samples.shift();
  assert.equal(normalizeFrame(input, 's', 2000, now).samples.find(s => s.metricId === 'cpu.total')!.captureError, 'METRIC_NOT_PROVIDED');
  input.observability.samples.push(input.observability.samples[0]);
  assert.throws(() => normalizeFrame(input, 's', 2000, now), /DUPLICATE/);
  const prototypeId = fixture(now); prototypeId.observability.samples[0].metricId = '__proto__';
  assert.throws(() => normalizeFrame(prototypeId, 's', 2000, now), /UNREGISTERED_METRIC/);
  input.observability.platform = 'linux'; assert.throws(() => normalizeFrame(input, 's', 2000, now), /PLATFORM_NOT_SUPPORTED/);
  assert.throws(() => normalizeFrame({}, 's', 2000, now), /UPDATE_REQUIRED/);
  const stale = normalizeFrame(fixture(now - 20000), 's', 2000, now);
  assert.ok(stale.samples.every(s => s.value === null && s.lost && s.late));
  const invalidLatency = fixture(now); invalidLatency.observability.samples.find(s => s.metricId === 'disk.readLatency')!.counterEvidence!.endTicks = '1';
  assert.equal(normalizeFrame(invalidLatency, 's', 2000, now).samples.find(s => s.metricId === 'disk.readLatency')!.captureError, 'LATENCY_EVIDENCE_MISMATCH');
  const badSource = fixture(now); badSource.observability.samples[0].source = 'SIMULATED';
  assert.equal(normalizeFrame(badSource, 's', 2000, now).samples[0].captureError, 'UNVERIFIED_SOURCE');
});
test('statistics exclude absent/error/lost values; genuine zero remains valid; nearest-rank percentiles', () => {
  const s = normalizeFrame(fixture(), 's', 2000).samples[0];
  const samples = [0, 10, 20, 30, 40].map(value => ({ ...s, value }));
  samples.push({ ...s, value: null, validity: 'UNKNOWN' }, { ...s, value: 999, lost: true });
  assert.deepEqual(statistics(samples), { count: 5, missing: 2, min: 0, max: 40, mean: 20, p50: 20, p95: 40 });
  assert.equal(statistics([]).mean, null);
  assert.equal(statistics([{ ...s, value: Number.MAX_VALUE }, { ...s, value: Number.MAX_VALUE }]).mean, Number.MAX_VALUE);
});
test('storage bounds: frame count, UTF-8 bytes, retention and clear', () => {
  const series = new BoundedSeries(), now = Date.now();
  for (let i = 0; i < 301; i++) series.append(normalizeFrame(fixture(now + i * 1000, i + 1), 's', 1000, now + i * 1000));
  assert.equal(series.frames().length, 300); assert.equal(series.evicted, 1); assert.ok(series.bytes <= EOE_LIMITS.maxBytes);
  series.append(normalizeFrame(fixture(now + 2000000, 400), 's', 1000, now + 2000000));
  assert.equal(series.frames().length, 1);
  const big = normalizeFrame(fixture(), 's', 2000); big.samples.forEach(s => { s.captureError = 'é'.repeat(100000); });
  series.append(big); series.append(big); assert.ok(series.bytes <= EOE_LIMITS.maxBytes); assert.ok(series.frames().length <= 3); // Entries stay within the exact byte budget
  series.clear(); assert.equal(series.bytes, 0); assert.equal(series.frames().length, 0);
});
test('latency formula: two raw counters, units, no I/O, resets and unsafe precision', () => {
  assert.equal(averageTimerMs('12000', '22', '10000', '20', '1000000'), 1);
  assert.equal(averageTimerMs('12000', '20', '10000', '20', '1000000'), null);
  assert.equal(averageTimerMs('1', '22', '10000', '20', '1000000'), null);
  assert.equal(averageTimerMs(null, '22', '10000', '20', '1000000'), null);
  assert.equal(averageTimerMs('', '22', '10000', '20', '1000000'), null);
  assert.equal(averageTimerMs('9999999999999999999999', '22', '1', '20', '1'), null);
  assert.equal(safeInterval(0), 1000); assert.equal(safeInterval(Infinity), 2000); assert.equal(safeInterval(90000), 10000);
});
test('CSV/JSON exports retain provenance, nulls and UTC; guard spreadsheet injection; never transport credentials', async () => {
  const engine = new ObservabilityEngine(async () => ({ ...fixture(), sessionToken: 'SHOULD_NOT_BE_EXPORTED', pairingCode: 'SECRET' }));
  engine.start(); await turn(); engine.pause();
  const json = engine.export('json'), parsed = JSON.parse(json);
  assert.equal(parsed.frames.length, 1); assert.equal(parsed.frames[0].samples[0].unit, '%');
  assert.ok(!json.includes('SHOULD_NOT_BE_EXPORTED') && !json.includes('SECRET'));
  const frame = missingFrame('s', '=HYPERLINK("test")', 2000);
  assert.ok(exportCsv([frame]).includes('"\'=HYPERLINK(""test"")"'));
  assert.ok(engine.export('csv').includes('timestampUtc'));
  engine.clear();
});
test('single collection, pause abort, stale-response rejection, resume, disconnect gaps and cleanup', async () => {
  let calls = 0, active = 0, peak = 0;
  const engine = new ObservabilityEngine(signal => new Promise(resolve => {
    calls++; active++; peak = Math.max(peak, active);
    signal.addEventListener('abort', () => { active--; resolve(fixture()); }, { once: true });
  }));
  const unsubscribe = engine.subscribe(() => {});
  engine.start(); engine.configure(1000, 500); await turn(); assert.equal(calls, 2); assert.equal(peak, 1);
  engine.pause(); await turn(); assert.equal(JSON.parse(engine.export('json')).frames.length, 0);
  engine.resume(); await turn(); unsubscribe(); assert.equal(engine.snapshot().running, false); assert.equal(active, 0);
  let fail = true, seq = 0;
  const reconnect = new ObservabilityEngine(async () => { if (fail) throw new Error('TEST_OFFLINE'); return fixture(Date.now(), ++seq); });
  reconnect.start(); await turn(); assert.equal(reconnect.snapshot().phase, 'disconnected');
  assert.equal(JSON.parse(reconnect.export('json')).frames[0].samples[0].value, null);
  fail = false; reconnect.pause(); reconnect.resume(); await turn(); reconnect.pause();
  const frames = JSON.parse(reconnect.export('json')).frames; assert.equal(frames.length, 2); assert.equal(frames[1].samples[0].value, 25);
  reconnect.clear(); engine.clear();
});
test('collector coalesces concurrent reads and does not invent initial CPU zero', async () => {
  const manager = new AgentTelemetryManager();
  const first = manager.getLiveMetrics(), concurrent = manager.getLiveMetrics(); assert.equal(first, concurrent);
  const result = await first; assert.equal(result.cpu.utilizationPercent, null); assert.equal(result.cpu.provenance, 'UNKNOWN');
  assert.equal((await manager.getLiveMetrics()).observability.sequence, result.observability.sequence);
  if (process.platform !== 'win32') assert.ok(result.observability.samples.every(s => s.value === null));
  manager.stopSampling();
});
test('real HTTP agent: health has no credential, origin/host/token/pairing protection, legacy paths, Linux UNKNOWN', async t => {
  const child = spawn(process.execPath, ['--import', 'tsx', 'evo-agent/src/index.ts'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '', errors = '';
  child.stdout.on('data', chunk => { output += chunk.toString(); }); child.stderr.on('data', chunk => { errors += chunk.toString(); });
  t.after(async () => { if (child.exitCode !== null || child.signalCode !== null) return; const closed = once(child, 'close'); child.kill('SIGTERM'); await closed; });
  for (let i = 0; i < 80 && !output.includes('Servidor escuchando') && child.exitCode === null; i++) await new Promise(r => setTimeout(r, 50));
  assert.ok(output.includes('Servidor escuchando'), errors.includes('EADDRINUSE') ? 'Port 43921 occupied: no existing process was stopped' : `Agent failed to start: ${errors.includes('EPERM') ? 'EPERM socket permission' : 'see process exit status'}`);
  const code = output.match(/\[PAIRING\].*?: (\d{6})/)?.[1]; assert.ok(code);
  const base = 'http://127.0.0.1:43921', origin = 'http://localhost:3000';
  for (const endpoint of ['/health', '/health/handshake', '/v1/handshake']) {
    const response = await fetch(base + endpoint, { headers: { Origin: origin } }); const body = await response.json();
    assert.equal(response.status, 200); assert.equal(body.pid, child.pid); assert.equal(body.sessionToken, undefined); assert.equal(body.code, undefined); assert.equal(body.pairingRequired, true);
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
  assert.equal((await fetch(base + '/health', { headers: { Origin: 'https://evil.example' } })).status, 403);
  const badHostStatus = await new Promise<number>(resolve => { const req = http.get({ hostname: '127.0.0.1', port: 43921, path: '/health', headers: { Host: 'evil.example' } }, res => { res.resume(); resolve(res.statusCode!); }); req.on('error', () => resolve(0)); });
  assert.equal(badHostStatus, 403);
  const preflight = await fetch(base + '/v1/pair', { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Private-Network': 'true' } });
  assert.equal(preflight.status, 204); assert.equal(preflight.headers.get('access-control-allow-private-network'), 'true');
  const deniedPreflight = await fetch(base + '/v1/pair', { method: 'OPTIONS', headers: { Origin: 'https://evil.example', 'Access-Control-Request-Private-Network': 'true' } });
  assert.equal(deniedPreflight.status, 403); assert.equal(deniedPreflight.headers.get('access-control-allow-private-network'), null);
  for (const [method, endpoint] of [['GET', '/v1/machine'], ['GET', '/v1/telemetry'], ['GET', '/v1/services'], ['POST', '/v1/services/experiment'], ['POST', '/v1/telemetry/start'], ['POST', '/v1/telemetry/stop'], ['POST', '/v1/pair/revoke']]) assert.equal((await fetch(base + endpoint, { method, headers: { Origin: origin } })).status, 401);
  const paired = await fetch(base + '/v1/pair', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
  assert.equal(paired.status, 200); const credential = await paired.json(); assert.match(credential.sessionToken, /^[a-f0-9]{64}$/);
  const headers = { Origin: origin, 'X-Evo-Agent-Token': credential.sessionToken };
  assert.equal((await fetch(base + '/v1/telemetry', { headers: { ...headers, Origin: 'http://localhost:4000' } })).status, 401);
  assert.equal((await fetch(base + '/v1/telemetry', { headers: { 'X-Evo-Agent-Token': credential.sessionToken } })).status, 401);
  const response = await fetch(base + '/v1/telemetry', { headers }); assert.equal(response.status, 200); const payload = await response.json();
  assert.equal(payload.observability.schemaVersion, '1.0'); assert.equal(payload.cpu.utilizationPercent, null);
  if (process.platform !== 'win32') { assert.ok(payload.observability.samples.every((s: any) => s.value === null && s.captureError.includes('PLATFORM_NOT_SUPPORTED'))); assert.equal((await fetch(base + '/v1/machine', { headers })).status, 503); }
  for (const endpoint of ['/exec', '/shell', '/cmd', '/run', '/eval']) assert.equal((await fetch(base + endpoint, { method: 'POST', headers })).status, 403);
  assert.equal((await fetch(base + '/v1/pair/revoke', { method: 'POST', headers })).status, 200);
  assert.equal((await fetch(base + '/v1/telemetry', { headers })).status, 401);
});
test('measured engine harness cost, explicitly not a Windows workload benchmark', () => {
  const count = 1000, series = new BoundedSeries(), startMemory = process.memoryUsage(), startCpu = process.cpuUsage(), start = performance.now(), at = Date.now();
  for (let i = 0; i < count; i++) series.append(normalizeFrame(fixture(at + i * 1000, i + 1), 'BENCH-TEST', 1000, at + i * 1000));
  const stats = statistics(series.frames().map(f => f.samples[0])); const wallMs = performance.now() - start, cpu = process.cpuUsage(startCpu), memory = process.memoryUsage();
  assert.equal(stats.count, 300);
  const result = { scope: 'Synthetic contract normalization + bounded storage only; not real Windows capture or browser total CPU', platform: process.platform, arch: process.arch, node: process.version, logicalProcessors: os.cpus().length, iterations: count, wallMs, cpuMs: (cpu.user + cpu.system) / 1000, rssBeforeBytes: startMemory.rss, rssAfterBytes: memory.rss, heapUsedAfterBytes: memory.heapUsed, retainedJsonBytes: series.bytes, retainedFrames: series.frames().length, evictedFrames: series.evicted };
  writeFileSync('/tmp/eoe-engine-benchmark.json', JSON.stringify(result, null, 2));
  console.log('Harness benchmark saved: /tmp/eoe-engine-benchmark.json (synthetic contract workload)');
});
test('shared client: coalesced legacy/EOE readers, independent cancellation and final-reader abort', async () => {
  const { EvoAgentClient } = await import('../src/components/evoLabCore/services/evoAgentClient');
  const originalFetch = globalThis.fetch;
  let calls = 0, aborted = false, respond: (value: Response) => void = () => {};
  globalThis.fetch = (async (input: any, init: any) => {
    if (String(input).endsWith('/v1/pair')) return new Response(JSON.stringify({ sessionToken: 'b'.repeat(64), expiresAt: new Date(Date.now() + 10000).toISOString() }));
    calls++;
    return new Promise<Response>((resolve, reject) => {
      respond = resolve;
      init.signal.addEventListener('abort', () => { aborted = true; reject(new DOMException('Cancelled', 'AbortError')); });
    });
  }) as typeof fetch;
  try {
    await EvoAgentClient.pair('123456');
    const a = new AbortController(), b = new AbortController();
    const first = EvoAgentClient.fetchTelemetryStrict(a.signal), second = EvoAgentClient.fetchTelemetryStrict(b.signal);
    await turn(); assert.equal(calls, 1);
    const cancelled = assert.rejects(first, { name: 'AbortError' }); a.abort(); await cancelled;
    assert.equal(aborted, false, 'One subscriber must not abort another');
    respond(new Response(JSON.stringify(fixture()))); assert.ok((await second).observability);
    const last = new AbortController(), pending = EvoAgentClient.fetchTelemetryStrict(last.signal);
    await turn(); const finalCancellation = assert.rejects(pending, { name: 'AbortError' }); last.abort(); await finalCancellation; await turn();
    assert.equal(aborted, true); assert.equal(calls, 2);
  } finally { globalThis.fetch = originalFetch; EvoAgentClient.resetSessionToken(); }
});
test('shared sequence advances do not invent losses; stale/out-of-order frames fail closed', async () => {
  let step = 0; const start = Date.now();
  const frames = [fixture(start, 1), fixture(start + 1000, 4), fixture(start + 2000, 3)];
  const engine = new ObservabilityEngine(async () => frames[step++]);
  engine.configure(1000, 500); engine.start(); await turn();
  engine.configure(1000, 500); await turn();
  let recorded = JSON.parse(engine.export('json')).frames;
  assert.equal(recorded.length, 2); assert.ok(recorded.every((f: any) => f.samples[0].value !== null));
  engine.configure(1000, 500); await turn(); engine.pause();
  recorded = JSON.parse(engine.export('json')).frames;
  assert.equal(recorded.length, 3); assert.equal(recorded.at(-1).samples[0].value, null);
  assert.match(recorded.at(-1).samples[0].captureError, /OUT_OF_ORDER_FRAME/);
  engine.clear();
});
