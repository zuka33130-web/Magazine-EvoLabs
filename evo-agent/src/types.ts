// ============================================================================
// EVO LOCAL AGENT — CORE TYPE DEFINITIONS
// Protocol: EVO_LOCAL_AGENT_V1
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// ============================================================================

export type EpistemicProvenance =
  | 'SYSTEM_REPORTED'
  | 'MEASURED'
  | 'USER_ENTERED'
  | 'ESTIMATED'
  | 'REFERENCE'
  | 'SIMULATED'
  | 'UNKNOWN';

export interface AgentHealthResponse {
  status: 'OK' | 'DEGRADED';
  agent: string;
  version: string;
  protocol: 'EVO_LOCAL_AGENT_V1';
  platform: string;
  isWindows: boolean;
  pid: number;
  uptimeSeconds: number;
  address: string;
  port: number;
  sessionToken: string;
  timestamp: string;
}

export interface AgentCapabilitiesResponse {
  agentVersion: string;
  protocol: string;
  platform: string;
  hostName: string;
  supportedCimClasses: string[];
  features: {
    hardwareInventory: boolean;
    realTimeTelemetry: boolean;
    telemetryStreaming: boolean;
    secureSessionToken: boolean;
    originValidation: boolean;
    shellExecutionDisabled: boolean;
  };
  allowedEndpoints: string[];
  prohibitedActions: string[];
  timestamp: string;
}

export interface WindowsProcessorInventory {
  name: string;
  numberOfCores: number;
  numberOfLogicalProcessors: number;
  maxClockSpeedMhz: number;
  currentClockSpeedMhz: number;
  socketDesignation?: string;
  architecture?: string;
  provenance: EpistemicProvenance;
}

export interface WindowsBaseBoardInventory {
  manufacturer?: string;
  product?: string;
  version?: string;
  serialNumber?: string;
  provenance: EpistemicProvenance;
}

export interface WindowsBiosInventory {
  vendor?: string;
  version?: string;
  releaseDate?: string;
  provenance: EpistemicProvenance;
}

export interface WindowsPhysicalMemoryModule {
  capacityBytes: number;
  capacityGB: number;
  manufacturer?: string;
  partNumber?: string;
  configuredClockSpeedMhz?: number;
  speedMhz?: number;
  deviceLocator?: string;
  bankLabel?: string;
  provenance: EpistemicProvenance;
}

export interface WindowsMemoryInventory {
  totalCapacityBytes: number;
  totalCapacityGB: number;
  modulesCount: number;
  modules: WindowsPhysicalMemoryModule[];
  configuredSpeedMhz?: number;
  spdSpeedMhz?: number;
  // Strict rule: Memory channels CANNOT be derived from slot count -> UNKNOWN (0)
  channels: number;
  type: 'DDR4' | 'DDR5' | 'DDR3' | 'UNKNOWN';
  provenance: EpistemicProvenance;
}

export interface WindowsVideoControllerItem {
  name: string;
  driverVersion?: string;
  adapterRAMBytes?: number | null;
  adapterRAM_GB?: number | null;
  currentHorizontalResolution?: number | null;
  currentVerticalResolution?: number | null;
  currentRefreshRate?: number | null;
  isDedicated: boolean;
  vramReliable: boolean;
  provenance: EpistemicProvenance;
}

export interface WindowsDiskDriveItem {
  model: string;
  interfaceType?: string;
  mediaType?: string;
  sizeBytes?: number | null;
  sizeGB?: number | null;
  storageType: 'NVMe M.2' | 'SATA SSD' | 'HDD' | 'UNKNOWN';
  provenance: EpistemicProvenance;
}

export interface WindowsNetworkAdapterItem {
  name: string;
  adapterType?: string;
  netConnectionID?: string;
  speedBps?: number | null;
  provenance: EpistemicProvenance;
}

export interface WindowsOperatingSystemInventory {
  caption: string;
  version: string;
  buildNumber: string;
  osArchitecture: string;
  lastBootUpTime?: string;
  totalVisibleMemorySizeKB?: number;
  freePhysicalMemoryKB?: number;
  provenance: EpistemicProvenance;
}

export interface UnknownSubsystem {
  status: 'UNKNOWN';
  reason: string;
  provenance: 'UNKNOWN';
}

export interface AgentMachineInventoryResponse {
  protocol: 'EVO_LOCAL_AGENT_V1';
  source: 'WINDOWS_CIM_WMI_DIRECT';
  overallProvenance: 'SYSTEM_REPORTED';
  timestamp: string;
  machineId: string;
  alias: string;

  // Real detected hardware subsystems (SYSTEM_REPORTED)
  cpu: WindowsProcessorInventory;
  motherboard: WindowsBaseBoardInventory;
  bios: WindowsBiosInventory;
  ram: WindowsMemoryInventory;
  gpu: WindowsVideoControllerItem[];
  primaryGpu: WindowsVideoControllerItem;
  storage: WindowsDiskDriveItem[];
  primaryDisk?: WindowsDiskDriveItem;
  network: WindowsNetworkAdapterItem[];
  os: WindowsOperatingSystemInventory;

  // Subsystems that CANNOT be detected by software (Strictly UNKNOWN)
  psu: UnknownSubsystem & { wattageW: 0; rating: 'UNKNOWN' };
  cooling: UnknownSubsystem & { type: 'UNKNOWN'; tdpCapacityW: 0 };
  chassis: UnknownSubsystem & { model: 'UNKNOWN'; formFactor: 'UNKNOWN' };
  fans: UnknownSubsystem & { count: 0; sizeMm: 0 };

  // Verification metadata
  epistemicAudit: {
    prohibitedInventionsEnforced: boolean;
    realDetectedSubsystems: string[];
    unknownSubsystems: string[];
    rulesSummary: string[];
  };
}

export interface AgentTelemetryMetrics {
  timestamp: string;
  cpu: {
    utilizationPercent: number;
    clockSpeedMhz?: number;
    provenance: EpistemicProvenance;
  };
  memory: {
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    utilizationPercent: number;
    provenance: EpistemicProvenance;
  };
  process: {
    agentRssBytes: number;
    agentHeapUsedBytes: number;
    agentUptimeSeconds: number;
  };
  isSamplingActive: boolean;
}
