// ============================================================================
// EVO LOCAL AGENT — CAPABILITIES METADATA
// Protocol: EVO_LOCAL_AGENT_V1
// ============================================================================

import os from 'os';
import { AgentCapabilitiesResponse } from './types.js';

export class AgentCapabilitiesProvider {
  public static getCapabilities(): AgentCapabilitiesResponse {
    return {
      agentVersion: '1.0.0-windows-native',
      protocol: 'EVO_LOCAL_AGENT_V1',
      platform: process.platform,
      hostName: os.hostname(),
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
        hardwareInventory: true,
        realTimeTelemetry: true,
        telemetryStreaming: true,
        secureSessionToken: true,
        originValidation: true,
        shellExecutionDisabled: true,
      },
      allowedEndpoints: [
        'GET /health',
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
