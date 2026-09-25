// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — CORE V1 DATA CONTRACTS & INTERFACES
// Philosophy: "NO SE ADIVINA. SE MIDE."
// ============================================================================

export type EpistemicProvenance =
  | 'MEASURED'        // Medición física directa durante sesión (sensores/WMI/ETW/PresentMon/contadores)
  | 'SYSTEM_REPORTED' // Reportado por el sistema operativo o SMBIOS/APIs del sistema (cores, RAM instalada, specs)
  | 'DETECTED'        // Detectado automáticamente por SO o APIs del navegador
  | 'DERIVED'         // Calculado matemáticamente a partir de datos medidos
  | 'CALIBRATED'      // Datos empíricos contrastados con muestras empíricas verificadas y telemetría
  | 'ESTIMATED'       // Modelo analítico o proyección empírica
  | 'SIMULATED'       // Simulación virtual de componentes no presentes
  | 'USER_ENTERED'    // Ingresado manualmente por el usuario
  | 'AI_DISCOVERED'   // Extraído e indexado por EVO AI desde fuentes oficiales
  | 'UNKNOWN';        // Sin evidencia suficiente (nunca se inventa)

// Subsystem identifiers
export type SubsystemType =
  | 'cpu'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'motherboard'
  | 'psu'
  | 'cooling'
  | 'case'
  | 'fans'
  | 'expansion'
  | 'peripherals'
  | 'kernel'
  | 'display'
  | 'network';

// Epistemic field wrapper for metrics
export interface EpistemicMetric<T> {
  value: T;
  provenance: EpistemicProvenance;
  source: string;
  unit?: string;
  confidencePct?: number; // 0-100
  measuredAt?: string;
}

// ----------------------------------------------------------------------------
// MACHINE ENTITY (The core object of the Digital Lab)
// ----------------------------------------------------------------------------
export interface MachineMotherboard {
  model: string;
  socket: string;
  chipset?: string;
  ramSlots: number;
  ramType: 'DDR4' | 'DDR5' | 'UNKNOWN';
  pcieGen: string; // ej: "PCIe 4.0", "PCIe 5.0"
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'Laptop' | 'UNKNOWN';
  provenance: EpistemicProvenance;
}

export interface MachineCPU {
  model: string;
  socket: string;
  cores: number;
  threads: number;
  pCores?: number;
  eCores?: number;
  baseClockGhz?: number;
  boostClockGhz?: number;
  tdpW: number;
  hasIGPU: boolean;
  provenance: EpistemicProvenance;
}

export interface MachineRAM {
  sizeGb: number;
  configuredSpeedMts: number;
  spdSpeedMts?: number;
  type: 'DDR4' | 'DDR5' | 'UNKNOWN';
  channels: number; // 1 = Single, 2 = Dual
  slotsUsed?: number;
  totalSlots?: number;
  provenance: EpistemicProvenance;
}

export interface MachineGPU {
  model: string;
  vramGb: number;
  isDedicated: boolean;
  pcieGen?: string;
  powerW: number;
  provenance: EpistemicProvenance;
}

export interface MachineStorage {
  type: 'NVMe M.2' | 'SATA SSD' | 'HDD' | 'UNKNOWN';
  capacityGb: number;
  model?: string;
  healthPct?: number;
  provenance: EpistemicProvenance;
}

export interface MachinePSU {
  wattageW: number;
  rating?: string; // ej: "80+ Bronze", "80+ Gold", "OEM Laptop"
  provenance: EpistemicProvenance;
}

export interface MachineCooling {
  type: 'Stock Fan' | 'Air Tower' | 'AIO Liquid 240mm' | 'AIO Liquid 360mm' | 'Laptop Vapor Chamber' | 'UNKNOWN';
  tdpCapacityW: number;
  provenance: EpistemicProvenance;
}

export interface MachineDisplay {
  resolution: string; // ej: "1920x1080", "2560x1440"
  refreshHz: number;
  provenance: EpistemicProvenance;
}

export interface MachineCase {
  model: string;
  manufacturer?: string;
  formFactor: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'E-ATX' | 'Laptop' | 'UNKNOWN';
  gpuClearanceMm?: number;
  coolerClearanceMm?: number;
  radiatorSupportMm?: number;
  provenance: EpistemicProvenance;
}

export interface MachineFans {
  model?: string;
  count: number;
  sizeMm: number;
  rgb?: boolean;
  provenance: EpistemicProvenance;
}

export interface MachineExpansionCard {
  id: string;
  model: string;
  type: 'Capture Card' | 'Sound Card' | 'Wi-Fi / BT' | 'Storage Controller' | 'Other';
  pcieGen?: string;
  provenance: EpistemicProvenance;
}

export interface MachinePeripherals {
  monitor?: string;
  keyboard?: string;
  mouse?: string;
  headset?: string;
  microphone?: string;
  speakers?: string;
  webcam?: string;
  networkAdapter?: string;
  wifiBluetooth?: string;
  controller?: string;
  captureCard?: string;
  printerScanner?: string;
  externalStorage?: string;
  ups?: string;
  gamepad?: string;
  printer?: string;
  scanner?: string;
  usbHub?: string;
  dock?: string;
  bluetoothAdapter?: string;
  [key: string]: string | undefined;
}

export type MachineArchetype =
  | 'CUSTOM_DESKTOP'
  | 'OEM_DESKTOP'
  | 'LAPTOP'
  | 'MINI_PC'
  | 'WORKSTATION'
  | 'SERVER'
  | 'DESKTOP'
  | 'CUSTOM';

export type SubsystemReplaceability = 'REPLACEABLE' | 'SOLDERED' | 'PROPRIETARY' | 'UNKNOWN';

export type ComponentOwnershipState = 'OWNED' | 'PLANNED' | 'SELECTED' | 'TO_BUY';

export type HardwareLifecycleState = 'CURRENT' | 'LEGACY' | 'DISCONTINUED' | 'UNKNOWN';

export type HardwareGranularityKind = 'EXACT_SKU' | 'BASE_MODEL';

export type DataVerificationStatus =
  | 'MANUFACTURER_VERIFIED'
  | 'SECONDARY_VERIFIED'
  | 'USER_ENTERED'
  | 'UNVERIFIED'
  | 'CONFLICTING_DATA';

export type MachineReadyState =
  | 'DRAFT'
  | 'INCOMPLETE'
  | 'COMPATIBILITY_WARNING'
  | 'READY'
  | 'LAB_ACTIVE';

export interface MachineDisplayDetailed {
  model?: string;
  resolution: string;
  refreshHz: number;
  adaptiveSync?: 'G-SYNC' | 'FreeSync' | 'None';
  connectionType?: 'DisplayPort 1.4' | 'DisplayPort 2.1' | 'HDMI 2.0' | 'HDMI 2.1' | 'USB-C';
  panelType?: 'IPS' | 'OLED' | 'VA' | 'TN';
  provenance: EpistemicProvenance;
}

export interface BudgetProfile {
  currency: 'USD' | 'ARS' | 'EUR' | 'BRL';
  maxBudget?: number;
  alreadyOwnedValueExcluded: boolean;
  region?: string;
}

export interface WorkloadTarget {
  id: string;
  name: string;
  category: 'ESPORTS_GAMING' | 'AAA_GAMING' | 'VIDEO_EDITING' | '3D_CAD' | 'PROGRAMMING' | 'OFFICE_MULTITASK';
  targetResolution: '1080p' | '1440p' | '4K';
  targetFps: number;
  qualityPreset: 'LOW_COMPETITIVE' | 'MEDIUM' | 'HIGH' | 'ULTRA_RAYTRACING';
  workloadSize?: 'CASUAL' | 'PROFESSIONAL' | 'STUDIO_HEAVY';
  multitaskingDemands: 'SINGLE_APP' | 'STREAMING_OBS' | 'BACKGROUND_VMS_CONTAINERS';
  minimumCpuCores: number;
  minimumRamGb: number;
  minimumVramGb: number;
  gpuPerformanceIndexRequired: number; // 0 to 100
  storageTypeRequired: 'NVMe M.2' | 'ANY_SSD' | 'HDD_ALLOWED';
}

export type MachineCompletenessStatus = 'MISSING_REQUIRED' | 'MISSING_RECOMMENDED' | 'COMPLETE';

export interface CompletenessItemAudit {
  subsystem: SubsystemType;
  label: string;
  severity: 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL';
  status: 'PRESENT' | 'MISSING' | 'NOT_APPLICABLE';
  rationale: string;
}

export interface MachineCompletenessReport {
  status: MachineCompletenessStatus;
  missingRequired: CompletenessItemAudit[];
  missingRecommended: CompletenessItemAudit[];
  allAudits: CompletenessItemAudit[];
  isIgnitionAllowed: boolean;
  ignitionBlockers: string[];
}

export interface ComponentImpactAssessment {
  incomingComponent: BuildComponentItem;
  targetSubsystem: SubsystemType;
  affectedSubsystems: {
    subsystem: SubsystemType;
    label: string;
    impactDescription: string;
    severity: 'BREAKING_INCOMPATIBLE' | 'REQUIRES_REVALIDATION' | 'BENIGN';
  }[];
  warningMessage: string;
}

export interface Machine {
  id: string;
  alias: string;
  machineType?: MachineArchetype;
  manufacturer?: string;
  model?: string;
  serial?: string;
  source?: 'AUTODETECT' | 'MANUAL_BUILD' | 'PROFILE' | 'IMPORTED';
  createdAt?: string;
  updatedAt?: string;
  isDetected: boolean;
  detectedAt?: string;
  overallProvenance: EpistemicProvenance;
  readyState?: MachineReadyState;
  budget?: BudgetProfile;
  workloadTargets?: WorkloadTarget[];
  motherboard: MachineMotherboard & { replaceability?: SubsystemReplaceability };
  cpu: MachineCPU & { replaceability?: SubsystemReplaceability };
  ram: MachineRAM & { replaceability?: SubsystemReplaceability };
  gpu: MachineGPU & { replaceability?: SubsystemReplaceability };
  storage: MachineStorage & { replaceability?: SubsystemReplaceability };
  psu: MachinePSU & { replaceability?: SubsystemReplaceability };
  cooling: MachineCooling & { replaceability?: SubsystemReplaceability };
  chassis?: MachineCase;
  fans?: MachineFans;
  expansionCards?: MachineExpansionCard[];
  peripherals?: MachinePeripherals;
  display?: MachineDisplay;
  displayDetailed?: MachineDisplayDetailed;
  bios?: {
    manufacturer?: string;
    motherboardModel?: string;
    version: string;
    releaseDate?: string;
    uefiMode?: boolean;
    provenance: EpistemicProvenance;
  };
  network?: {
    ethernet?: string[];
    wifi?: string;
    bluetooth?: string;
    provenance: EpistemicProvenance;
  };
  audio?: {
    integrated?: string;
    dedicatedSoundCard?: string;
    usbDacInterface?: string;
    provenance: EpistemicProvenance;
  };
  ramModules?: {
    model: string;
    sizeGb: number;
    speedMts: number;
    type: 'DDR4' | 'DDR5' | 'UNKNOWN';
    partNumber?: string;
    quantity?: number;
  }[];
  storageDrives?: {
    model: string;
    capacityGb: number;
    type: 'NVMe M.2' | 'SATA SSD' | 'HDD' | 'UNKNOWN';
    interface?: string;
    partNumber?: string;
  }[];
  monitors?: {
    model: string;
    resolution: string;
    refreshHz: number;
    adaptiveSync?: string;
    connectionType?: string;
  }[];
  gpus?: MachineGPU[];
  os?: {
    name: string;
    version?: string;
    build?: string;
    provenance: EpistemicProvenance;
  };
  notes?: string;
}

// ----------------------------------------------------------------------------
// LEARN MORE CONTEXTUAL REFERENCE (Integration with EVO Tomos)
// ----------------------------------------------------------------------------
export interface LearnMoreReference {
  tomoId: '01' | '02' | '03' | '04';
  tomoTitle: string;
  chapterNumber: string;
  chapterTitle: string;
  concept: string;
  pedagogicalSummary: string;
  actionPrompt: string;
}

// ----------------------------------------------------------------------------
// TECHNICAL EVIDENCE UNIT
// ----------------------------------------------------------------------------
export interface TechnicalEvidence {
  id: string;
  subsystem: SubsystemType;
  metricName: string;
  value: string | number;
  unit: string;
  provenance: EpistemicProvenance;
  source: string;
  timestamp: string;
  confidencePct: number;
  verdictNote: string;
  rawDetails?: Record<string, any>;
}

// ----------------------------------------------------------------------------
// MODE 1: REPAIR (Investigation Engine & Hypotheses)
// ----------------------------------------------------------------------------
export type HypothesisStatus =
  | 'CONFIRMED'   // Evidencia contundente verificada
  | 'HIGHLY_PROBABLE' // Evidencia converge fuertemente
  | 'PROBABLE'    // Alta correlación con pruebas ejecutadas
  | 'POSSIBLE'    // Pendiente de test o evidencia parcial
  | 'NOT_SUPPORTED' // Sin datos suficientes
  | 'NOT TESTED'  // Aún no testeada
  | 'DISCARDED';  // Refutada por prueba empírica

export type ThermalCertaintyLevel =
  | 'CONFIRMED'
  | 'HIGHLY_PROBABLE'
  | 'PROBABLE'
  | 'POSSIBLE'
  | 'NOT_SUPPORTED'
  | 'DISCARDED';

export type CausalNodeKind = 'ROOT_CAUSE' | 'CONTRIBUTING_FACTOR' | 'CONSEQUENCE';

export interface ThermalCausalNode {
  id: string;
  kind: CausalNodeKind;
  subsystem: SubsystemType;
  title: string;
  description: string;
  certainty: ThermalCertaintyLevel;
  evidence: string[];
  metricsMeasured?: Record<string, string | number>;
}

export interface GuidedThermalQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    causalWeight: {
      factorId: string;
      certaintyDelta: number; // positive or negative
      note: string;
    };
  }[];
  selectedAnswer?: string;
}

export interface DirectedThermalTest {
  id: string;
  title: string;
  targetSubsystem: SubsystemType;
  durationSeconds: number;
  instructions: string;
  expectedMetric: string;
  observedResult?: {
    peakTempC: number;
    ambientTempC: number;
    throttlingDetected: boolean;
    fanSaturationPct: number;
    clockRetentionPct: number;
    vrmTempEstimateC: number;
  };
  hypothesisImpact: {
    targetNodeId: string;
    newCertainty: ThermalCertaintyLevel;
    verdict: string;
  };
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
}

export interface ThermalCausalReport {
  machineId: string;
  overallVerdict: string;
  overallCertainty: ThermalCertaintyLevel;
  primaryRootCause: ThermalCausalNode;
  contributingFactors: ThermalCausalNode[];
  consequences: ThermalCausalNode[];
  causalChain: {
    step: number;
    stage: string;
    description: string;
    nodeKind: CausalNodeKind;
  }[];
  historicalTelemetryStatus: 'AVAILABLE' | 'NOT_AVAILABLE_RECONSTRUCTED';
  reconstructionBasis: string[];
  guidedInquiry: GuidedThermalQuestion[];
  directedTests: DirectedThermalTest[];
  preventionRoadmap: {
    action: string;
    priority: 'CRITICAL' | 'HIGH' | 'RECOMMENDED';
    expectedDeltaC: string;
    estimatedCostUsd: number;
    rationale: string;
  }[];
  healthModel: {
    currentHealthScore: number; // 0-100
    thermalHealthScore: number; // 0-100
    powerHealthScore: number; // 0-100
    coolingHeadroomW: number; // in watts
    upgradeHeadroom: 'HIGH' | 'MODERATE' | 'RESTRICTED' | 'EXHAUSTED';
    workloadSuitability: 'OPTIMAL' | 'ACCEPTABLE' | 'THERMALLY_CHOKED';
    longTermRisk: 'CRITICAL_DEGRADATION' | 'ELEVATED' | 'BALANCED_STABLE' | 'EXCELLENT';
    riskAnalysisNote: string;
  };
}

export interface ValueOptimizationAdvice {
  id: string;
  title: string;
  category: 'REALLOCATE_BUDGET' | 'AIRFLOW_REVISION' | 'COOLER_SIZING' | 'POWER_MARGIN';
  currentObservation: string;
  concreteAlternative: {
    subsystem: SubsystemType;
    currentModel: string;
    suggestedModel: string;
    priceDeltaUsd: number; // negative means saving
    performanceImpact: string;
    thermalImpact: string;
  };
  objectiveRationale: string; // Zero brand bias, pure engineering & price
}

export interface DiagnosticHypothesis {
  id: string;
  title: string;
  subsystem: SubsystemType;
  status: HypothesisStatus;
  rationale: string;
  suggestedTest: string;
  evidenceRefId?: string;
}

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  options: Array<{
    label: string;
    value: string;
    impactDescription?: string;
  }>;
  answeredValue?: string;
}

export interface DiagnosticStep {
  stepNumber: number;
  testName: string;
  instructions: string[];
  expectedObservation: string;
  whatItProves: string;
  whatItDoesNotProve: string;
  completed: boolean;
  resultNotes?: string;
  observedEvidence?: TechnicalEvidence;
}

export interface RepairSessionData {
  symptomRaw: string;
  symptomCategory: string;
  questions: DiagnosticQuestion[];
  currentQuestionIndex: number;
  hypotheses: DiagnosticHypothesis[];
  diagnosticSteps: DiagnosticStep[];
  currentStepIndex: number;
  probableDiagnosis?: string;
  recommendedSolution?: {
    action: string;
    riskLevel: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
    isReversible: boolean;
    howToRevert: string;
  };
  retestVerificationCompleted?: boolean;
  learnMoreRef?: LearnMoreReference;
}

// ----------------------------------------------------------------------------
// MODE 2: TEST (Performance & Workload Lab)
// ----------------------------------------------------------------------------
export type WorkloadDomain = 'GAMING' | 'PRODUCTIVITY_CREATIVE' | 'HARDWARE_SUBSYSTEMS';

export interface GamingTargetGoal {
  gameId: string;
  gameName: string;
  resolution: '1080p' | '1440p' | '4K';
  quality: 'Bajo Competitivo' | 'Medio Equilibrado' | 'Alto / Ultra';
  targetFps: number;
  withSimultaneousStreaming: boolean;
}

export interface ProductivityTargetGoal {
  categoryId: 'video_editing' | '3d_render' | 'cad' | 'development' | 'multitasking_office';
  categoryName: string;
  resolutionOrProjectScale: string;
  targetTimelineFluidity: 'Fluido 60 FPS' | 'Tiempo Real sin Proxies' | 'Render Rápido';
}

export interface WorkloadPlan {
  relevantSubsystems: SubsystemType[];
  criticalMetrics: string[];
  rationale: string;
}

export interface ExperimentOutcome {
  objectiveSummary: string;
  observedResultSummary: string;
  fpsProjectedOrMeasured?: number;
  low1PctFps?: number;
  primaryLimiter: 'GPU' | 'RAM' | 'CPU' | 'STORAGE' | 'THERMAL' | 'UNKNOWN';
  primaryLimiterReasonEs: string;
  provenance: EpistemicProvenance;
  technicalEvidence: TechnicalEvidence[];
  learnMoreRef?: LearnMoreReference;
}

export interface TestSessionData {
  domain: WorkloadDomain;
  gamingGoal?: GamingTargetGoal;
  productivityGoal?: ProductivityTargetGoal;
  plan: WorkloadPlan;
  experimentStarted: boolean;
  outcome?: ExperimentOutcome;
}

// ----------------------------------------------------------------------------
// MODE 3: BUILD (Purpose-Driven PC Designer)
// ----------------------------------------------------------------------------
export type BuildPurpose =
  | 'GAMING_COMPETITIVE'
  | 'GAMING_TRIPLE_A'
  | 'CONTENT_CREATION_VIDEO'
  | '3D_CAD_ENGINEERING'
  | 'SOFTWARE_DEVELOPMENT'
  | 'OFFICE_STUDY_MULTITASK'
  | 'BALANCED_ALL_ROUNDER';

export interface BuildRequirements {
  purpose: BuildPurpose;
  resolution: '1080p' | '1440p' | '4K';
  targetFps: number;
  budgetUsdEstimate?: number;
  priority: 'MAX_PERFORMANCE' | 'MAX_LONGEVITY_UPGRADE' | 'MAX_EFFICIENCY';
}

export type ComponentValueRating =
  | 'NECESSARY'   // Indispensable para cumplir el objetivo
  | 'BALANCED'    // Relación costo-rendimiento óptima
  | 'EXCESSIVE'   // Gasto innecesario que no aporta beneficio real al objetivo
  | 'INSUFFICIENT'// Cuello de botella evidente
  | 'UNKNOWN';    // Sin datos suficientes de precio/demanda

export interface CompatibilityCheck {
  id: string;
  title: string;
  subsystems: [SubsystemType, SubsystemType];
  status: 'COMPATIBLE' | 'COMPATIBLE_AFTER_BIOS_UPDATE' | 'WARNING' | 'INCOMPATIBLE' | 'UNKNOWN';
  detail: string;
}

export interface CompatibilityReport {
  overallStatus: 'COMPATIBLE' | 'COMPATIBLE_AFTER_BIOS_UPDATE' | 'INCOMPATIBLE' | 'UNKNOWN';
  checks: CompatibilityCheck[];
  totalPowerDrawW: number;
  psuMarginW: number;
  psuSufficient: boolean | 'UNKNOWN';
  coolingSufficient: boolean | 'UNKNOWN';
}

export interface BuildComponentItem {
  id: string;
  subsystem: SubsystemType;
  model: string;
  manufacturer?: string;
  family?: string;
  partNumber?: string;
  sku?: string;
  revision?: string;
  kind?: HardwareGranularityKind; // 'EXACT_SKU' | 'BASE_MODEL'
  lifecycle?: HardwareLifecycleState; // 'CURRENT' | 'LEGACY' | 'DISCONTINUED' | 'UNKNOWN'
  specsSummary: string;
  specifications?: Record<string, any>;
  estimatedPriceUsd?: number;
  ownershipState?: ComponentOwnershipState; // 'OWNED' | 'PLANNED' | 'SELECTED' | 'TO_BUY'
  verificationStatus?: DataVerificationStatus;
  replaceability?: SubsystemReplaceability;
  valueRating: ComponentValueRating;
  valueRationale: string;
  sources?: string[];
  lastVerifiedAt?: string;
  variantRequiredForPhysicalCompatibility?: boolean;
  conflictingSources?: { source: string; claim: string }[];
}

export interface BuildSessionData {
  requirements: BuildRequirements;
  budget?: BudgetProfile;
  workloadTargets?: WorkloadTarget[];
  selectedComponents: {
    motherboard?: BuildComponentItem;
    cpu?: BuildComponentItem;
    ram?: BuildComponentItem;
    gpu?: BuildComponentItem;
    storage?: BuildComponentItem;
    psu?: BuildComponentItem;
    cooling?: BuildComponentItem;
    case?: BuildComponentItem;
    fans?: BuildComponentItem;
    expansion?: BuildComponentItem;
    peripherals?: Record<string, BuildComponentItem>;
  };
  completeness?: MachineCompletenessReport;
  compatibility: CompatibilityReport;
  summaryRecommendation: string;
  learnMoreRef?: LearnMoreReference;
}

// ----------------------------------------------------------------------------
// EVO CASE (Universal Session Dossier)
// ----------------------------------------------------------------------------
export type EvoCaseType = 'REPAIR' | 'TEST' | 'BUILD';

export interface EvoCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  caseType: EvoCaseType;
  title: string;
  machine: Machine;
  repairSession?: RepairSessionData;
  testSession?: TestSessionData;
  buildSession?: BuildSessionData;
  isClosed: boolean;
  conclusionNotes?: string;
}

// ----------------------------------------------------------------------------
// EXTENSIBILITY INTERFACES (For Future AI / Catalog / Cloud Providers)
// ----------------------------------------------------------------------------
export interface DiagnosticReasoningProvider {
  analyzeSymptom(symptom: string, machine: Machine): Promise<{
    hypotheses: DiagnosticHypothesis[];
    questions: DiagnosticQuestion[];
  }>;
  evaluateAnswer(
    questionId: string,
    answer: string,
    currentHypotheses: DiagnosticHypothesis[],
    machine: Machine
  ): Promise<{
    updatedHypotheses: DiagnosticHypothesis[];
    nextQuestions?: DiagnosticQuestion[];
    probableDiagnosis?: string;
  }>;
}

export interface CompatibilityEngineProvider {
  evaluateCompatibility(components: BuildSessionData['selectedComponents']): CompatibilityReport;
  evaluateValueRating(
    component: BuildComponentItem,
    requirements: BuildRequirements,
    selectedSoFar: BuildSessionData['selectedComponents']
  ): ComponentValueRating;
}

export interface WorkloadKnowledgeProvider {
  computeWorkloadPlan(goal: GamingTargetGoal | ProductivityTargetGoal): WorkloadPlan;
  simulateOrMeasurePerformance(machine: Machine, goal: GamingTargetGoal | ProductivityTargetGoal): ExperimentOutcome;
}
