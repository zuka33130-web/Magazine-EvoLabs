// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — EVO LOCAL AGENT CLIENT
// Direct HTTP client for http://127.0.0.1:43921
// Protocol: EVO_LOCAL_AGENT_V1
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// ============================================================================

import { Machine } from '../types';
import { MachineAdapter } from './machineAdapter';

export interface AgentHealth {
  status: 'OK' | 'DEGRADED';
  agent: string;
  version: string;
  protocol: string;
  platform: string;
  isWindows: boolean;
  pid: number;
  uptimeSeconds: number;
  address: string;
  port: number;
  sessionToken: string;
  timestamp: string;
}

export interface AgentLiveTelemetry {
  timestamp: string;
  cpu: {
    utilizationPercent: number;
    clockSpeedMhz?: number;
    provenance: string;
  };
  memory: {
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    utilizationPercent: number;
    provenance: string;
  };
  process: {
    agentRssBytes: number;
    agentHeapUsedBytes: number;
    agentUptimeSeconds: number;
  };
  isSamplingActive: boolean;
}

export interface AgentMachineImportResult {
  success: boolean;
  machine?: Machine;
  rawPayload?: any;
  health?: AgentHealth;
  error?: string;
  errorCode?: 'AGENT_NOT_CONNECTED' | 'HANDSHAKE_FAILED' | 'INVENTORY_QUERY_FAILED' | 'INVALID_PAYLOAD';
  stage?: 'HEALTH_CHECK' | 'HANDSHAKE' | 'MACHINE_QUERY' | 'VALIDATION' | 'ADAPTATION' | 'PERSISTENCE' | 'COMPLETED';
}

export class EvoAgentClient {
  public static readonly AGENT_BASE_URL = 'http://127.0.0.1:43921';
  private static cachedSessionToken: string | null = null;

  /**
   * Pings the local agent to check if it is running on 127.0.0.1:43921
   */
  public static async pingAgent(timeoutMs: number = 1800): Promise<AgentHealth | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.AGENT_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(this.cachedSessionToken ? { 'X-Evo-Agent-Token': this.cachedSessionToken } : {}),
        },
        signal: controller.signal,
      });

      if (!response.ok) return null;
      const data: AgentHealth = await response.json();
      if (data && data.sessionToken) {
        this.cachedSessionToken = data.sessionToken;
      }
      return data;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Performs handshake if session token does not exist yet.
   * If Agent does not respond: throws or returns error with code AGENT_NOT_CONNECTED.
   * NO fallback demo.
   */
  public static async ensureHandshake(timeoutMs: number = 2000): Promise<string> {
    if (this.cachedSessionToken) {
      return this.cachedSessionToken;
    }

    const health = await this.pingAgent(timeoutMs);
    if (!health || health.status !== 'OK' || !health.sessionToken) {
      const err: any = new Error('AGENT_NOT_CONNECTED: No se pudo conectar con el agente local EVO en http://127.0.0.1:43921.');
      err.code = 'AGENT_NOT_CONNECTED';
      throw err;
    }

    this.cachedSessionToken = health.sessionToken;
    return this.cachedSessionToken;
  }

  /**
   * Clears the cached session token (used for re-handshake testing or re-connection)
   */
  public static resetSessionToken(): void {
    this.cachedSessionToken = null;
  }

  /**
   * Performs the mandatory 7-step hardware intake flow from EVO Local Agent:
   * IMPORTAR ESTA PC
   * → comprobar http://127.0.0.1:43921/health
   * → handshake (token & origin)
   * → /v1/machine
   * → validar respuesta
   * → MachineAdapter
   * → Canonical Machine
   * → guardar Active Machine
   * → mostrar Machine detectada.
   *
   * If Agent does not respond: STRICTLY NO BROWSER COMPLETE FALLBACK, NO DEMO, NO FIXTURE.
   */
  public static async importThisPc(timeoutMs: number = 6000): Promise<AgentMachineImportResult> {
    // Step 1 & 2: Comprobar health y handshake (guardar token de sesión)
    let token = '';
    let health: AgentHealth | null = null;
    try {
      health = await this.pingAgent(2000);
      if (!health || health.status !== 'OK' || !health.sessionToken) {
        return {
          success: false,
          error: 'AGENT_NOT_CONNECTED: No se pudo establecer conexión con http://127.0.0.1:43921. Verificá que el agente local esté iniciado ejecutando START-EVO-AGENT.cmd.',
          errorCode: 'AGENT_NOT_CONNECTED',
          stage: 'HEALTH_CHECK',
        };
      }
      this.cachedSessionToken = health.sessionToken;
      token = health.sessionToken;
    } catch {
      return {
        success: false,
        error: 'AGENT_NOT_CONNECTED: El agente local de EVO no responde en 127.0.0.1:43921.',
        errorCode: 'AGENT_NOT_CONNECTED',
        stage: 'HEALTH_CHECK',
      };
    }

    // Step 3: GET /v1/machine
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let rawPayload: any = null;
    try {
      const response = await fetch(`${this.AGENT_BASE_URL}/v1/machine`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Evo-Agent-Token': token,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `ERROR EN /v1/machine: HTTP ${response.status} en EVO Local Agent.`,
          errorCode: 'INVENTORY_QUERY_FAILED',
          stage: 'MACHINE_QUERY',
          health,
        };
      }

      rawPayload = await response.json();
    } catch (err: any) {
      return {
        success: false,
        error: `ERROR EN CONSULTA DE INVENTARIO: ${err?.message || 'Tiempo de espera agotado al consultar CIM/WMI.'}`,
        errorCode: 'INVENTORY_QUERY_FAILED',
        stage: 'MACHINE_QUERY',
        health,
      };
    } finally {
      clearTimeout(timeout);
    }

    // Step 4: Validar respuesta
    if (!rawPayload || typeof rawPayload !== 'object' || (!rawPayload.cpu && !rawPayload.CPU)) {
      return {
        success: false,
        error: 'RESPUESTA DE AGENTE INVÁLIDA: La telemetría de hardware no contiene datos válidos de procesador o memoria.',
        errorCode: 'INVALID_PAYLOAD',
        stage: 'VALIDATION',
        rawPayload,
        health,
      };
    }

    // Step 5 & 6: MachineAdapter → Canonical Machine
    let canonicalMachine: Machine;
    try {
      canonicalMachine = MachineAdapter.fromAgentPayload(rawPayload);
    } catch (adapterErr: any) {
      return {
        success: false,
        error: `ERROR EN MACHINE ADAPTER: ${adapterErr?.message || 'Fallo en la construcción canónica.'}`,
        errorCode: 'INVALID_PAYLOAD',
        stage: 'ADAPTATION',
        rawPayload,
        health,
      };
    }

    // Step 7: Guardar Active Machine
    try {
      MachineAdapter.saveActiveMachine(canonicalMachine);
    } catch (saveErr) {
      console.warn('[EvoAgentClient] Warning saving active machine:', saveErr);
    }

    return {
      success: true,
      machine: canonicalMachine,
      rawPayload,
      health,
      stage: 'COMPLETED',
    };
  }

  /**
   * Direct fetch of machine inventory payload
   */
  public static async fetchMachineInventory(timeoutMs: number = 6000): Promise<{
    machine: Machine;
    rawPayload: any;
  }> {
    const result = await this.importThisPc(timeoutMs);
    if (!result.success || !result.machine) {
      throw new Error(result.error || 'AUTODETECTION_FAILED');
    }
    return { machine: result.machine, rawPayload: result.rawPayload };
  }

  /**
   * Fetches real-time telemetry metrics
   */
  public static async fetchLiveTelemetry(): Promise<AgentLiveTelemetry | null> {
    try {
      const token = await this.ensureHandshake(1500);
      const response = await fetch(`${this.AGENT_BASE_URL}/v1/telemetry`, {
        headers: {
          Accept: 'application/json',
          'X-Evo-Agent-Token': token,
        },
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Starts background telemetry sampling on agent
   */
  public static async startTelemetrySampling(): Promise<boolean> {
    try {
      const token = await this.ensureHandshake(1500);
      const response = await fetch(`${this.AGENT_BASE_URL}/v1/telemetry/start`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Evo-Agent-Token': token,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Stops background telemetry sampling on agent
   */
  public static async stopTelemetrySampling(): Promise<boolean> {
    try {
      const token = await this.ensureHandshake(1500);
      const response = await fetch(`${this.AGENT_BASE_URL}/v1/telemetry/stop`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Evo-Agent-Token': token,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
