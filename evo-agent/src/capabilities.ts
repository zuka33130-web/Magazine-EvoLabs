// ============================================================================
// EVO LOCAL AGENT — CAPABILITIES METADATA
// Protocol: EVO_LOCAL_AGENT_V1
// ============================================================================

import { EOE_AGENT_VERSION } from './observabilityProtocol.js';
import { AgentCapabilitiesResponse } from './types.js';

export class AgentCapabilitiesProvider {
  public static getCapabilities(): AgentCapabilitiesResponse {
    return {
      agentVersion: EOE_AGENT_VERSION,
      protocol: 'EVO_LOCAL_AGENT_V1',
      platform: process.platform,
      hostName: 'LOCAL_PC', // Public capabilities must not disclose the machine hostname.
      supportedCimClasses: [
        'Win32_Processor',
        'Win32_BaseBoard',
        'Win32_BIOS',
        'Win32_PhysicalMemory',
        'Win32_VideoController',
        'Win32_DiskDrive',
        'Win32_NetworkAdapter',
        'Win32_OperatingSystem',
      ],
      features: {
        hardwareInventory: process.platform === 'win32',
        realTimeTelemetry: process.platform === 'win32',
        telemetryStreaming: false,
        secureSessionToken: true,
        originValidation: true,
        shellExecutionDisabled: true,
      },
      allowedEndpoints: [
        'GET /health',
        'POST /v1/pair',
        'POST /v1/pair/revoke',
        'GET /v1/machine',
        'GET /v1/capabilities',
        'GET /v1/telemetry',
        'POST /v1/telemetry/start',
        'POST /v1/telemetry/stop',
      ],
      prohibitedActions: [
        'Arbitrary shell execution (FORBIDDEN)',
        'Command injection / eval (FORBIDDEN)',
        'Remote code execution (FORBIDDEN)',
        'Listening on public 0.0.0.0 (FORBIDDEN)',
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
