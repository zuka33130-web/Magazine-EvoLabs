// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — DIGITAL TWIN DATA CONTRACTS
// Philosophy: "NO SE ADIVINA. SE MODELA CON DATOS. SE CALCULA. SE CALIBRA."
// ============================================================================

import { EpistemicProvenance, SubsystemType, Machine } from '../../types';

export type WorkloadCategory =
  | 'GAME_AAA'
  | 'GAME_ESPORTS'
  | 'GAME_SIMULATION'
  | 'STREAMING_OBS'
  | 'VOICE_CHAT'
  | 'WEB_BROWSER'
  | 'MUSIC_MEDIA'
  | 'VIDEO_EDITING'
  | '3D_RENDER'
  | 'COMPILATION'
  | 'BACKGROUND_SERVICE'
  | 'SYNTHETIC_STRESS';

export type LimitingFactorKind =
  | 'NONE_DETECTED'
  | 'HEALTHY_GPU_BOUND'
  | 'GPU_PERFORMANCE_LIMIT'
  | 'GPU_THERMAL_LIMIT'
  | 'GPU_POWER_LIMIT'
  | 'CPU_MAIN_THREAD_PRESSURE'
  | 'CPU_MULTITHREAD_LIMIT'
  | 'CPU_THERMAL_THROTTLING'
  | 'VRAM_PRESSURE'
  | 'RAM_CAPACITY_LIMIT'
  | 'RAM_BANDWIDTH_LIMIT'
  | 'STORAGE_STREAMING_LIMIT'
  | 'PSU_HEADROOM_REDUCED'
  | 'UNKNOWN';

export interface WorkloadDemandDimension<T = number> {
  value: T;
  source: string;
  confidencePct: number; // 0 - 100
  provenance: EpistemicProvenance; // MEASURED | DERIVED | CALIBRATED | ESTIMATED | SIMULATED | UNKNOWN
}

export interface WorkloadDemandProfile {
  cpuSingleThreadDemand: WorkloadDemandDimension<number>; // 0 to 100 index
  cpuMultiThreadDemand: WorkloadDemandDimension<number>;  // 0 to 100 index
  recommendedCpuCores: number;
  gpuRasterDemand: WorkloadDemandDimension<number>;       // 0 to 100 index
  gpuComputeDemand: WorkloadDemandDimension<number>;      // 0 to 100 index
  vramDemandGb: WorkloadDemandDimension<number>;          // GB required for active textures/shaders
  ramDemandGb: WorkloadDemandDimension<number>;           // GB RAM working set
  ramBandwidthSensitivity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  storageReadMBps: WorkloadDemandDimension<number>;       // Asset loading / streaming MB/s
  storageWriteMBps: WorkloadDemandDimension<number>;      // Recording / temp buffer MB/s
  networkBandwidthMbps: WorkloadDemandDimension<number>;  // Network packet flow
  encoderDemandPct: WorkloadDemandDimension<number>;      // Hardware video encoder (NVENC / QuickSync / AV1)
  decoderDemandPct: WorkloadDemandDimension<number>;      // Hardware video decoder
  supportsRayTracing?: boolean;
}

export interface OfficialGameRequirements {
  minimumCpu: string;
  recommendedCpu: string;
  minimumGpu: string;
  recommendedGpu: string;
  minimumRamGb: number;
  recommendedRamGb: number;
  minimumVramGb?: number;
  storageRequiredGb: number;
  directX: string;
  officialSourceUrl: string;
  lastVerifiedAt: string;
}

export interface GameWorkloadItem {
  id: string;
  title: string;
  publisher: string;
  category: WorkloadCategory;
  engine: string;
  executableNames: string[];
  launcher?: 'Steam' | 'EA App' | 'Epic Games' | 'Riot Client' | 'Battle.net' | 'Standalone' | 'Xbox App';
  officialRequirements?: OfficialGameRequirements;
  demandProfile: WorkloadDemandProfile;
  resolutionScaleFactors: {
    '1080p': number; // 1.0
    '1440p': number; // ~1.55x GPU demand
    '4K': number;    // ~2.8x GPU demand
  };
  qualityScaleFactors: {
    'LOW_COMPETITIVE': number;
    'MEDIUM': number;
    'HIGH': number;
    'ULTRA_RAYTRACING': number;
  };
  notes?: string;
}

export interface ActiveWorkloadInstance {
  instanceId: string;
  workload: GameWorkloadItem;
  role: 'PRIMARY' | 'SECONDARY' | 'BACKGROUND';
  addedAtSeconds: number;
  resolution?: '1080p' | '1440p' | '4K';
  quality?: 'LOW_COMPETITIVE' | 'MEDIUM' | 'HIGH' | 'ULTRA_RAYTRACING';
  targetFps?: number;
  isStreamingObs?: boolean;
  isRecording?: boolean;
}

export interface WorkloadStack {
  primary: ActiveWorkloadInstance | null;
  secondaries: ActiveWorkloadInstance[];
  backgrounds: ActiveWorkloadInstance[];
  isSyntheticCombined: boolean;
}

export interface BusState {
  utilizationEstimatePct: number; // 0 - 100
  effectiveDemandGbps: number;
  availableBandwidthGbps: number;
  status: 'IDLE' | 'NORMAL' | 'HIGH_LOAD' | 'LIMITING' | 'SATURATED' | 'UNKNOWN';
  provenance: EpistemicProvenance;
  label: string;
}

export interface ComponentLiveMetrics {
  loadPct: number;
  temperatureC: number;
  targetTempLimitC: number;
  thermalHeadroomC: number;
  isThermalLimiting: boolean;
  isPowerLimiting: boolean;
  isThrottling: boolean;
  effectiveClockMhz: number;
  baseClockMhz: number;
  boostClockMhz: number;
  clockDropMhz: number;
  powerW: number;
  ratedPowerW: number;
  status: 'IDLE' | 'NORMAL' | 'HIGH_LOAD' | 'LIMITING' | 'SATURATED' | 'FAULT' | 'UNKNOWN';
  provenance: EpistemicProvenance;
  details: Record<string, string | number | boolean>;
}

export interface DigitalTwinFrame {
  timestampSeconds: number;
  timeFormatted: string;
  fpsEstimate: {
    averageFps: number;
    low1PctFps: number;
    low01PctFps: number;
    frametimeMs: number;
    frametimeVarianceMs: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    provenance: EpistemicProvenance;
  };
  cpu: ComponentLiveMetrics & {
    singleThreadPressurePct: number;
    multiThreadLoadPct: number;
    threadsActive: number;
  };
  gpu: ComponentLiveMetrics & {
    vramUsedGb: number;
    vramTotalGb: number;
    vramPressurePct: number;
    rasterLoadPct: number;
    computeLoadPct: number;
    encoderLoadPct: number;
  };
  ram: {
    usedGb: number;
    totalGb: number;
    pressurePct: number;
    bandwidthUsagePct: number;
    configuredSpeedMts: number;
    status: 'NORMAL' | 'HIGH_LOAD' | 'LIMITING' | 'SATURATED';
    provenance: EpistemicProvenance;
  };
  storage: {
    readSpeedMBps: number;
    writeSpeedMBps: number;
    temperatureC: number;
    queuePressurePct: number;
    interfaceSpeedMBps: number;
    status: 'NORMAL' | 'HIGH_LOAD' | 'LIMITING' | 'SATURATED';
    provenance: EpistemicProvenance;
  };
  psu: {
    estimatedLoadW: number;
    ratedWattageW: number;
    headroomW: number;
    headroomPct: number;
    ageYears?: number;
    ageRiskFactor: 'NONE' | 'LOW' | 'MODERATE' | 'ELEVATED';
    stressState: 'OPTIMAL' | 'MODERATE' | 'HEAVY' | 'CRITICAL_HEADROOM';
    provenance: EpistemicProvenance;
  };
  cooling: {
    fanSpeedPct: number;
    cpuFanRpm?: number;
    gpuFanRpm?: number;
    coolerCapacityW: number;
    thermalSoakFactorPct: number; // 0 to 100 as chassis heats up
    ambientTempC: number;
  };
  buses: {
    cpuRam: BusState;
    cpuGpu: BusState;
    gpuVram: BusState;
    cpuStorage: BusState;
    chipsetNetwork: BusState;
  };
  limitingFactor: LimitingFactorKind;
  limitingFactorReasonEs: string;
  activeWorkloadsCount: number;
  activeWorkloadNames: string[];
}

export type DigitalTwinEventType =
  | 'WORKLOAD_ADDED'
  | 'WORKLOAD_REMOVED'
  | 'THERMAL_WARNING'
  | 'THERMAL_LIMIT'
  | 'POWER_WARNING'
  | 'CPU_MAIN_THREAD_SATURATION'
  | 'GPU_SATURATION'
  | 'VRAM_PRESSURE'
  | 'RAM_PRESSURE'
  | 'STORAGE_STREAMING_SPIKE'
  | 'CLOCK_DROP'
  | 'BOTTLENECK_CHANGED'
  | 'STUTTER_DETECTED';

export interface DigitalTwinEventMarker {
  id: string;
  timestampSeconds: number;
  timeFormatted: string;
  type: DigitalTwinEventType;
  title: string;
  description: string;
  affectedSubsystem: SubsystemType;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface DigitalTwinSessionReport {
  sessionId: string;
  machine: Machine;
  stack: WorkloadStack;
  plannedDurationSeconds: number;
  simulatedDurationSeconds: number;
  summaryTextNonTechnical: string;
  whatYouCanDoRecommendations: {
    actionTitle: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNNECESSARY_EXPENSE';
    justification: string;
    estimatedCostUsd?: number;
  }[];
  dominantLimitingFactor: LimitingFactorKind;
  bottleneckTimelinePercentages: {
    factor: LimitingFactorKind;
    label: string;
    durationSeconds: number;
    percentage: number;
  }[];
  peakMetrics: {
    maxCpuTempC: number;
    maxGpuTempC: number;
    maxPsuLoadW: number;
    minThermalHeadroomC: number;
    minPowerHeadroomW: number;
    averageFps: number;
    min1PctFps: number;
  };
  events: DigitalTwinEventMarker[];
  frames: DigitalTwinFrame[];
  createdAt: string;
}
