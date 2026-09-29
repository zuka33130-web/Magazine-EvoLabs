// ============================================================================
// EVO LOCAL AGENT — WINDOWS NATIVE SERVICE
// Server: 127.0.0.1 : 43921 (STRICTLY LOCALHOST, NO 0.0.0.0)
// Endpoints:
//   - GET  /health
//   - GET  /v1/machine
//   - GET  /v1/capabilities
//   - GET  /v1/telemetry
//   - POST /v1/telemetry/start
//   - POST /v1/telemetry/stop
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// ============================================================================

import http from 'http';
import { AgentSecurityManager } from './security.js';
import { WindowsInventoryCollector } from './inventory.js';
import { AgentTelemetryManager } from './telemetry.js';
import { AgentCapabilitiesProvider } from './capabilities.js';
import { AgentHealthResponse } from './types.js';

const HOST: string = '127.0.0.1';
const PORT: number = 43921;

// Guard against misconfiguration: MUST NOT listen on 0.0.0.0
if (HOST.startsWith('0.0.0.0')) {
  console.error('[FATAL] EVO Local Agent is strictly forbidden from listening on 0.0.0.0');
  process.exit(1);
}

const security = new AgentSecurityManager();
const inventoryCollector = new WindowsInventoryCollector();
const telemetryManager = new AgentTelemetryManager();

const server = http.createServer(async (req, res) => {
  const method = (req.method || 'GET').toUpperCase();
  const url = req.url || '/';

  // 1. CORS & Origin Validation
  const { isPreflight, isAllowed } = security.handleCorsAndSecurity(req, res);
  if (isPreflight) return;

  if (!isAllowed) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'FORBIDDEN_ORIGIN', message: 'Origen no autorizado.' }));
    return;
  }

  // 2. Path Sanitization & Route Matching
  const cleanPath = security.sanitizePath(url);

  // Prohibited commands / Arbitrary execution prevention
  if (
    cleanPath.includes('/exec') ||
    cleanPath.includes('/shell') ||
    cleanPath.includes('/cmd') ||
    cleanPath.includes('/run') ||
    cleanPath.includes('/eval')
  ) {
    console.warn(`[SECURITY ALERT] Blocked prohibited arbitrary execution attempt on ${cleanPath}`);
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'ACTION_PROHIBITED',
        message:
          'La ejecución remota de comandos o shells está terminantemente prohibida en EVO Local Agent.',
        status: 403,
      })
    );
    return;
  }

  // 3. Security Token Check for Protected Endpoints:
  // GET /v1/machine, GET /v1/telemetry, POST /v1/telemetry/start, POST /v1/telemetry/stop
  // Require valid token. Without token -> 401.
  if (security.isProtectedEndpoint(method, cleanPath)) {
    if (!security.validateToken(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'UNAUTHORIZED_TOKEN',
          message: 'Token de sesión local no válido o ausente. Consultá GET /health para sincronizar.',
        })
      );
      return;
    }
  }

  // 4. Allowed Endpoints Router
  try {
    if ((method === 'GET' || method === 'POST') && (cleanPath === '/health' || cleanPath === '/health/handshake' || cleanPath === '/v1/handshake')) {
      const payload: AgentHealthResponse = {
        status: 'OK',
        agent: 'EVO_LOCAL_AGENT',
        version: '1.0.0',
        protocol: 'EVO_LOCAL_AGENT_V1',
        platform: process.platform,
        isWindows: process.platform === 'win32',
        pid: process.pid,
        uptimeSeconds: Math.floor(process.uptime()),
        address: HOST,
        port: PORT,
        sessionToken: security.getSessionToken(),
        timestamp: new Date().toISOString(),
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload, null, 2));
      return;
    }

    if (method === 'GET' && cleanPath === '/v1/capabilities') {
      const capabilities = AgentCapabilitiesProvider.getCapabilities();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(capabilities, null, 2));
      return;
    }

    if (method === 'GET' && cleanPath === '/v1/machine') {
      if (process.platform !== 'win32') {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify(
            {
              error: 'AUTODETECTION_FAILED',
              code: 'PLATFORM_NOT_SUPPORTED',
              message:
                'EVO Local Agent requiere Windows nativo para consultar proveedores CIM/WMI (Win32_*).',
              platform: process.platform,
              hardware: null,
            },
            null,
            2
          )
        );
        return;
      }

      try {
        const machineInventory = await inventoryCollector.collectInventory();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(machineInventory, null, 2));
      } catch (err: any) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify(
            {
              error: 'AUTODETECTION_FAILED',
              message: err?.message || 'Error al recolectar inventario.',
              hardware: null,
            },
            null,
            2
          )
        );
      }
      return;
    }

    if (method === 'GET' && cleanPath === '/v1/telemetry') {
      const telemetry = telemetryManager.getLiveMetrics();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(telemetry, null, 2));
      return;
    }

    if (method === 'POST' && cleanPath === '/v1/telemetry/start') {
      const result = telemetryManager.startSampling();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, ...result, timestamp: new Date().toISOString() }));
      return;
    }

    if (method === 'POST' && cleanPath === '/v1/telemetry/stop') {
      const result = telemetryManager.stopSampling();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, ...result, timestamp: new Date().toISOString() }));
      return;
    }

    // Prohibited commands / Arbitrary execution prevention
    if (
      cleanPath.includes('/exec') ||
      cleanPath.includes('/shell') ||
      cleanPath.includes('/cmd') ||
      cleanPath.includes('/run') ||
      cleanPath.includes('/eval')
    ) {
      console.warn(`[SECURITY ALERT] Blocked prohibited arbitrary execution attempt on ${cleanPath}`);
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: 'ACTION_PROHIBITED',
          message:
            'La ejecución remota de comandos o shells está terminantemente prohibida en EVO Local Agent.',
          status: 403,
        })
      );
      return;
    }

    // Default: Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'NOT_FOUND',
        message: `Endpoint '${cleanPath}' no existe en EVO Local Agent.`,
        allowedEndpoints: [
          'GET /health',
          'GET /v1/machine',
          'GET /v1/capabilities',
          'GET /v1/telemetry',
          'POST /v1/telemetry/start',
          'POST /v1/telemetry/stop',
        ],
      })
    );
  } catch (err: any) {
    console.error(`[EvoAgent] Error handling request ${method} ${cleanPath}:`, err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'INTERNAL_AGENT_ERROR',
        message: err?.message || 'Error interno del agente de telemetría local.',
      })
    );
  }
});

server.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log(' EVO LOCAL AGENT // SERVICIO DE TELEMETRÍA NATIVA DE WINDOWS    ');
  console.log('================================================================');
  console.log(` [OK] Servidor escuchando en: http://${HOST}:${PORT}`);
  console.log(` [OK] Plataforma detectada: ${process.platform} (${process.arch})`);
  console.log(` [OK] Token de sesión: ${security.getSessionToken().substring(0, 8)}...`);
  console.log(' [OK] Endpoints activos:');
  console.log('      - GET  /health');
  console.log('      - GET  /v1/machine');
  console.log('      - GET  /v1/capabilities');
  console.log('      - GET  /v1/telemetry');
  console.log('      - POST /v1/telemetry/start');
  console.log('      - POST /v1/telemetry/stop');
  console.log(' [OK] Seguridad: Prohibido 0.0.0.0 | Prohibido Shell / Eval');
  console.log('================================================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[EvoAgent] Deteniendo servidor local...');
  telemetryManager.stopSampling();
  server.close(() => {
    console.log('[EvoAgent] Servidor cerrado con éxito.');
    process.exit(0);
  });
});
