// Matrix Experience Engine Core Types
// Conforms to EVO LABS standard: All simulated values strictly marked as SIMULATED

export type MatrixEngineMode = 'xray' | 'boot' | 'install' | 'services' | 'repair' | 'silicon-matrix';

export type SimulationScreenState =
  | 'power-off'
  | 'uefi-bios'
  | 'boot-order'
  | 'boot-spinner'
  | 'login'
  | 'desktop'
  | 'startup'
  | 'services-loading'
  | 'stable'
  | 'windows-setup'
  | 'winre'
  | 'safe-mode'
  | 'bsod'
  | 'black-screen-cursor'
  | 'services-msc'
  | 'task-manager'
  | 'device-manager'
  | 'event-viewer'
  | 'powershell-console'
  | 'cmd-console';

export type NodeExecutionState = 'waiting' | 'active' | 'completed' | 'failed' | 'blocked' | 'idle' | 'running' | 'bypassed';

export interface InternalArchitectureNode {
  id: string;
  name: string;
  category: 'hardware' | 'firmware' | 'kernel' | 'subsystem' | 'session0-service' | 'session1-user';
  tier: 'ring0' | 'syscall' | 'ring3-session0' | 'ring3-session1';
  branchId?: string; // e.g. 'audio', 'network', 'security', 'shell', 'startup'
  state: NodeExecutionState;
  pid?: number;
  cpuPercent?: number;
  memoryMb?: number;
  description: string;
  fileOrBinary: string;
}

export interface BootStepDefinition {
  id: string;
  sequenceNumber: number;
  name: string;
  phase: 'FIRMWARE' | 'BOOT_LOADER' | 'KERNEL_INIT' | 'SESSION_INIT' | 'USER_SHELL' | 'PARALLEL_STABILIZATION';
  screenState: SimulationScreenState;
  simpleExplanation: string;
  deepArchitecture: string;
  rightNowAction: string;
  processOrFile: string;
  inputRequirements: string;
  outputArtifact: string;
  failureSymptom: string;
  verificationCommand: string;
  verificationExpected: string;
  analogicQuestion: string;
  activeNodes: string[];
  simulatedTimestamp?: string;
  simulatedPid?: number;
  simulatedCpu?: number;
  simulatedRamMb?: number;
  simulatedDiskIo?: number;
  parallelBranches?: {
    name: string;
    items: string[];
  }[];
  injectableFailure?: {
    failureId: string;
    title: string;
    stopScreenState: SimulationScreenState;
    bsodCode?: string;
    symptom: string;
    blockedLayer: string;
    investigationPrompt: string;
    solutionSteps: string[];
    rollbackMethod: string;
  };
}

export type HypothesisStatus = 'pending' | 'confirmed' | 'weakened' | 'discarded';

export interface DiagnosticHypothesis {
  id: string;
  label: string;
  description: string;
  status: HypothesisStatus;
  evidenceNotes?: string;
}

export interface DiagnosticTestOption {
  id: string;
  tool: 'Task Manager' | 'Services.msc' | 'Event Viewer' | 'PowerShell' | 'CMD' | 'Reliability Monitor';
  actionLabel: string;
  commandSnippet?: string;
  expectedObservation: string;
  simulatedOutput: string;
  affectsHypothesisId: string;
  newStatus: HypothesisStatus;
  pedagogicalInterpretation: string;
}

export interface RepairScenarioDefinition {
  id: string;
  title: string;
  category: string;
  difficulty: 'BÁSICO' | 'INTERMEDIO' | 'TÉCNICO' | 'INVESTIGADOR';
  userReportedSymptom: string;
  whatNotToAssume: string;
  initialScreenState: SimulationScreenState;
  hypotheses: DiagnosticHypothesis[];
  availableTests: DiagnosticTestOption[];
  rootCause: string;
  verifiedSolution: {
    title: string;
    actionDescription: string;
    commandOrGuiStep: string;
    riskLevel: 'VERDE' | 'AMARILLO' | 'ROJO';
    requiresReboot: boolean;
    rollbackCommand: string;
  };
  howToProveFixed: string;
}

export interface DiskPartitionItem {
  id: string;
  name: string;
  sizeMb: number;
  type: 'ESP' | 'MSR' | 'WINDOWS' | 'RECOVERY' | 'UNALLOCATED';
  fileSystem: 'FAT32' | 'NTFS' | 'RAW';
  purpose: string;
  isBootable: boolean;
  canDelete: boolean;
  canFormat: boolean;
  explanation: {
    simple: string;
    detailed: string;
    whyNeeded: string;
  };
}

export type WindowsServiceCategory =
  | 'sistema-critico'
  | 'seguridad-permisos'
  | 'redes-internet'
  | 'hardware-dispositivos'
  | 'audio-multimedia'
  | 'interfaz-experiencia'
  | 'update-mantenimiento'
  | 'diagnostico-telemetria'
  | 'opcionales-usuario';

export type WindowsServiceKind = 'NATIVO' | 'OPCIONAL' | 'POR_USUARIO' | 'TERCEROS';

export interface WindowsServiceItem {
  id: string;
  serviceName: string;
  displayName: string;
  category?: WindowsServiceCategory;
  serviceKind?: WindowsServiceKind;
  state: 'RUNNING' | 'STOPPED' | 'START_PENDING' | 'STOP_PENDING';
  startupType: 'Automatic' | 'Automatic (Delayed)' | 'Manual' | 'Disabled';
  pid?: number;
  account: 'LocalSystem' | 'NetworkService' | 'LocalService' | 'User';
  binaryPath: string;
  dependencies: string[];
  dependents: string[];
  subsystemRole: string;
  simpleExplanation: string;
  functionalRisk: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  functionalTestType?: 'audio' | 'network' | 'print' | 'search' | 'update' | 'security' | 'system' | 'hardware' | 'ui' | 'optional';
  windows11Scope?: {
    editions?: string[];
    versions?: string[];
    requiredFeature?: string;
  };
  restoration?: {
    canRestoreDirectly: boolean;
    rollbackCommand: string;
    requiresReboot: boolean;
    restorationNotes: string;
  };
  criticalRecommendation?: string;
  telemetryImpact: {
    ramDeltaMb: number; // e.g. -42 MB
    cpuDeltaPercent: number; // e.g. -0.8%
    lostFunctionality: string;
    potentialSideEffect: string;
  };
}

export interface TelemetryDeltaResult {
  metricType: 'SIMULATED' | 'SYSTEM_REPORTED' | 'MEASURED';
  serviceName: string;
  before: {
    ramUsedMb: number;
    cpuIdlePercent: number;
    runningProcesses: number;
    runningServices: number;
    diskQueueLength: number;
  };
  after: {
    ramUsedMb: number;
    cpuIdlePercent: number;
    runningProcesses: number;
    runningServices: number;
    diskQueueLength: number;
  };
  delta: {
    ramMb: number;
    cpuPercent: number;
    processes: number;
    services: number;
  };
  whatYouGained: string;
  whatYouLost: string;
  whatBroke: string;
  riskEvaluation: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
  scientificConclusion: 'MEJORÓ' | 'SIN CAMBIO SIGNIFICATIVO' | 'EMPEORÓ' | 'NO HAY DATOS SUFICIENTES (INCONCLUSO)';
  rollbackCommand: string;
}
