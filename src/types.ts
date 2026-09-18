export interface EditorialHeadline {
  title: string;
  subtitle: string;
}

export interface VolumeItem {
  id: string;
  number: string;
  volumeLabel: string;
  editionLabel: string;
  title: string;
  tagline: string;
  description: string;
  isLocked: boolean;
  unlockCondition?: string;
  themeColor: string;
  coverImage: string;
}

export type ChapterStatus = 'DISPONIBLE' | 'BLOQUEADO' | 'COMPLETADO';

export interface ChapterItem {
  number: string;
  title: string;
  subtitle: string;
  aprende: string;
  hace: string;
  desbloquea: string;
  status: ChapterStatus;
  visualImage: string;
  categoryTag?: string;
  accentColor?: string;
}

export type EvidenceState = 'DECLARADO' | 'OBSERVADO' | 'DETECTADO' | 'CONFIRMADO' | 'NO DISPONIBLE';
export type EvidenceSource =
  | 'USUARIO'
  | 'ADMINISTRADOR DE TAREAS'
  | 'MSINFO32'
  | 'INFORMACIÓN DEL SISTEMA'
  | 'WINVER'
  | 'CONFIGURACIÓN DE PANTALLA'
  | 'OBSERVACIÓN'
  | 'WINDOWS / CIM'
  | 'MANUAL';

export interface SpecFieldEvidence {
  value: string;
  source: EvidenceSource;
  state: EvidenceState;
  detectedRaw?: string;
  details?: Record<string, string | number | undefined>;
}

export interface UserPcSpec {
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
  motherboard: string;
  os: string;
  monitor: string;
  peripherals: string;
}

export interface UserPcEvidenceMap {
  cpu: SpecFieldEvidence;
  ram: SpecFieldEvidence;
  gpu: SpecFieldEvidence;
  storage: SpecFieldEvidence;
  motherboard: SpecFieldEvidence;
  os: SpecFieldEvidence;
  monitor: SpecFieldEvidence;
  peripherals: SpecFieldEvidence;
}

export interface HypothesisGuess {
  cpu: string;
  ram: string;
  gpu: string;
}

export interface PassportJsonSchema {
  schemaVersion: number;
  generatedAt: string;
  source: string;
  cpu?: {
    name?: string;
    cores?: number;
    logicalProcessors?: number;
    maxClockMHz?: number;
  };
  memory?: {
    totalGB?: number;
    modulesCount?: number;
    configuredSpeedMHz?: number;
    manufacturer?: string;
    channelMode?: string;
  };
  gpu?: Array<{
    name?: string;
    driverVersion?: string;
  }>;
  storage?: Array<{
    model?: string;
    approxGB?: number;
    mediaType?: string;
    interface?: string;
  }>;
  baseboard?: {
    manufacturer?: string;
    product?: string;
  };
  windows?: {
    caption?: string;
    version?: string;
    buildNumber?: string;
  };
}

export type Lab02InputMode = 'NIVELES' | 'NUMEROS';
export type MetricLevel = 'BAJO' | 'MEDIO' | 'ALTO' | '';

export interface ComponentPhaseMetrics {
  cpu: string;
  ram: string;
  gpu: string;
  disco: string;
}

export interface Lab02ExperimentData {
  loadCategory: string;
  loadCustomName: string;
  inputMode: Lab02InputMode;
  reposo: ComponentPhaseMetrics;
  carga: ComponentPhaseMetrics;
  actividad: ComponentPhaseMetrics;
  notes?: string;
  completedAt?: string;
}

export interface FlowMapExportSchema {
  schemaVersion: number;
  generatedAt: string;
  artifact: string;
  inheritedSpecs: Partial<UserPcSpec>;
  experiment: Lab02ExperimentData;
  interpretations: string[];
}

export type FluidezGameOption = 'VALORANT' | 'COUNTER-STRIKE 2' | 'FORTNITE' | 'OTRO';
export type FluidezResolution = '1920×1080' | '1600×900' | '1280×960' | '1280×720' | 'PERSONALIZADA';
export type FluidezQuality = 'BAJA' | 'MEDIA' | 'ALTA' | 'PERSONALIZADA';
export type FluidezFpsLimit = 'SIN LÍMITE' | '60' | '120' | '144' | '165' | '180' | '200' | '240' | 'PERSONALIZADO';
export type FluidezVsync = 'ACTIVO' | 'DESACTIVADO' | 'NO LO SÉ';
export type FluidezSensacion = 'MUY FLUIDA' | 'FLUIDA' | 'IRREGULAR' | 'MICRO-TIRONES' | 'TIRONES NOTORIOS';
export type FluidezSintoma =
  | 'micro-stuttering'
  | 'tirón al girar'
  | 'tirón al entrar en combate'
  | 'congelamiento breve'
  | 'tirón al cargar zona'
  | 'ninguno';

export interface FluidezProfileData {
  game: FluidezGameOption;
  customGameName?: string;
  resolution: FluidezResolution;
  customResolution?: string;
  quality: FluidezQuality;
  fpsLimit: FluidezFpsLimit;
  customFpsLimit?: string;
  vsync: FluidezVsync;
  monitor: string;
  fpsHabituales: number | null;
  caidaObservada: number | null;
  sensacion: FluidezSensacion;
  sintomas: FluidezSintoma[];
  frametimeTeoricoMs: number | null;
  hasTelemetry: boolean;
  avgFps: number | null;
  onePercentLow: number | null;
  zeroPointOnePercentLow: number | null;
  frametimeAvgMs: number | null;
  frametimePeakMs: number | null;
  captureDurationSeconds: number | null;
  method: 'OBSERVADO EN CONTADOR' | 'CAPTURADO POR TELEMETRÍA';
  registeredAt: string;
}

export interface FluidezProfileExportSchema {
  schemaVersion: number;
  generatedAt: string;
  artifact: string;
  hardwareSpecs: Partial<UserPcSpec>;
  fluidezProfile: FluidezProfileData;
  interpretacion: {
    loQueSabemos: string[];
    loQueTodaviaNoSabemos: string[];
    clasificacionEstabilidad: string;
    hipotesisAbiertas: string[];
  };
}

export type LimitationType =
  | 'GPU-BOUND'
  | 'CPU-SINGLE-THREAD'
  | 'CPU-MULTI-THREAD'
  | 'MEMORY-BANDWIDTH'
  | 'THERMAL-THROTTLED'
  | 'BALANCED';

export type ObservedAbBehavior =
  | 'SUBIERON_FPS_PROPORCIONAL'
  | 'FPS_CASI_IDENTICOS'
  | 'FPS_ALTOS_CON_TIRONES'
  | 'CAIDA_POR_TEMPERATURA';

export interface AbScenarioPoint {
  label: string;
  resolution: string;
  quality: string;
  fps: number;
  gpuUsagePct: number;
  cpuUsagePct: number;
  tempC?: number;
  notes?: string;
}

export interface AbExperimentData {
  game: string;
  variableChanged: string;
  scenarioA: AbScenarioPoint;
  scenarioB: AbScenarioPoint;
  fpsDeltaPct: number;
  observedBehavior: ObservedAbBehavior;
  notes?: string;
}

export interface LimitationMatrixData {
  primaryLimiter: LimitationType;
  secondaryLimiter: string;
  confidenceScore: 'ALTA' | 'MEDIA' | 'SUJETA_A_MÁS_PRUEBAS';
  contextSentence: string;
  scientificEvidence: string[];
  debunkedMyths: string[];
  recommendedActions: string[];
  counterproductiveActions: string[];
  registeredAt: string;
}

export interface LimitationMatrixExportSchema {
  schemaVersion: number;
  generatedAt: string;
  artifact: string;
  hardwareSpecs: Partial<UserPcSpec>;
  inheritedFluidez?: Partial<FluidezProfileData>;
  experiment: AbExperimentData;
  matrix: LimitationMatrixData;
}

// ==========================================
// CAPÍTULO 05 // WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO
// ==========================================

export interface BaselineMetrics {
  cpuPct: number;
  ramUsedGb: number;
  diskPct: number;
  gpuPct: number;
  processCount: number;
  topConsumer: string;
  topCpu: string[];
  topRam: string[];
  topDisk: string[];
  status: 'OBSERVADO';
  observedDurationSeconds: number;
}

export type StartupCategory =
  | 'WINDOWS_SISTEMA'
  | 'DRIVER_HARDWARE'
  | 'SEGURIDAD'
  | 'APLICACION_USUARIO'
  | 'LAUNCHER'
  | 'SINCRONIZACION'
  | 'ACTUALIZADOR'
  | 'DESCONOCIDO';

export interface StartupAppItem {
  id: string;
  name: string;
  publisher: string;
  impact: 'ALTO' | 'MEDIO' | 'BAJO' | 'NO_MEDIDO';
  state: 'HABILITADO' | 'DESHABILITADO';
  userUsageOnBoot: 'SI' | 'NO' | 'NO_SE' | 'PRESCINDIBLE';
  category: StartupCategory;
  isPrescindibleCandidate?: boolean;
}

export interface StartupAuditSummary {
  total: number;
  enabled: number;
  disabled?: number;
  auditedApps: StartupAppItem[];
}

export interface ProcessIdentityCard {
  name: string;
  pid: string;
  observedConsumption: string;
  path: string;
  publisher: string;
  signature: 'VALID' | 'NOTSIGNED' | 'UNKNOWN' | 'HASHMISMATCH' | 'NO_DETERMINADA';
  observation: string;
  identificationResult: 'IDENTIFICADO' | 'PARCIALMENTE_IDENTIFICADO' | 'NO_DETERMINADO';
}

export interface ServiceInvestigation {
  visibleName: string;
  serviceName: string;
  state: 'RUNNING' | 'STOPPED' | 'PAUSED' | 'DESCONOCIDO';
  startType: 'AUTOMATICO' | 'MANUAL' | 'DESHABILITADO' | 'DESCONOCIDO';
  description: string;
  pathName?: string;
  isCriticalWindowsService?: boolean;
}

export interface ScheduledTaskInvestigation {
  taskName: string;
  taskPath: string;
  state: 'READY' | 'RUNNING' | 'DISABLED' | 'UNKNOWN';
  apparentOrigin: string;
  functionDesc: string;
  twoMinWatchResult: 'ACTIVIDAD_DETECTADA' | 'NO_SE_OBSERVO_ACTIVIDAD' | 'NO_DETERMINADO';
  detectedProcessOrActivity?: string;
}

export interface NetworkInvestigation {
  evaluated: boolean;
  processName: string;
  owningPid: string;
  localAddress: string;
  remoteAddress: string;
  remotePort: string;
  state: 'ESTABLISHED' | 'CLOSE_WAIT' | 'TIME_WAIT' | 'LISTEN' | 'NO_DETERMINADO';
  status: 'IDENTIFICADO' | 'NO_DETERMINADO' | 'NO_EVALUADA';
  contextNotes: string;
}

export interface ActivityMapData {
  baseline: BaselineMetrics;
  startup: {
    total: number;
    enabled: number;
    auditedApps: StartupAppItem[];
  };
  investigatedProcess: ProcessIdentityCard;
  investigatedService: ServiceInvestigation;
  investigatedTask: ScheduledTaskInvestigation;
  investigatedNetwork: NetworkInvestigation;
  registeredAt: string;
}

export interface ActivityMapExportSchema {
  schemaVersion: number;
  generatedAt: string;
  artifact: string;
  hardwareSpecs: Partial<UserPcSpec>;
  activityMap: ActivityMapData;
}

export type OptimizationInterventionType =
  | 'CERRAR_APP_USUARIO'
  | 'DESHABILITAR_INICIO'
  | 'PAUSAR_SINCRONIZACION'
  | 'CERRAR_LAUNCHER_SECUNDARIO'
  | 'CERRAR_NAVEGADOR'
  | 'DESACTIVAR_OVERLAY'
  | 'DETENER_DESCARGA'
  | 'CERRAR_CAPTURA';

export interface OptimizationMetricsSnapshot {
  processes: number;
  ramGb: number;
  cpuPct?: number;
  diskPct?: number;
  gpuPct?: number;
  fps?: number;
  onePctLow?: number;
  frametimeMs?: number;
  symptoms?: string[];
}

export interface ControlledInterventionData {
  interventionType: OptimizationInterventionType;
  targetName: string;
  reason: string;
  reversible: boolean;
  howToRevert: string;
  before: OptimizationMetricsSnapshot;
  after: OptimizationMetricsSnapshot;
  delta: {
    ramGb: number;
    processes: number;
    fps?: number;
    onePctLow?: number;
  };
  interpretation:
    | 'MEJORA_MEDIBLE'
    | 'MEJORA_PRINCIPALMENTE_ESTABILIDAD'
    | 'CAMBIO_PEQUEÑO'
    | 'SIN_DIFERENCIA_RELEVANTE'
    | 'EMPEORO'
    | 'EVIDENCIA_INSUFICIENTE';
  decision: 'CONSERVAR_CAMBIO' | 'REVERTIR_CAMBIO' | 'SEGUIR_INVESTIGANDO';
}

export interface FinalComparisonData {
  game: string;
  resolution: string;
  variablesControlledChecklist: {
    sameGame: boolean;
    sameResolution: boolean;
    sameQuality: boolean;
    sameFpsCap: boolean;
    sameScene: boolean;
    sameDriver: boolean;
    sameSettings: boolean;
    sameDuration: boolean;
  };
  isComparable: boolean;
  normalMode: OptimizationMetricsSnapshot;
  cleanMode: OptimizationMetricsSnapshot;
  conclusion: {
    freedResources: string;
    performance: string;
    stability: string;
    perceivedExperience: string;
  };
}

export interface OptimizationLogData {
  intervention: ControlledInterventionData;
  finalComparison?: FinalComparisonData;
  registeredAt: string;
}

export interface OptimizationLogExportSchema {
  schemaVersion: number;
  generatedAt: string;
  artifact: string;
  hardwareSpecs: Partial<UserPcSpec>;
  optimizationLog: OptimizationLogData;
}

export interface Chapter05State {
  baselineCompleted: boolean;
  startupAudited: boolean;
  processInvestigated: boolean;
  serviceInvestigated: boolean;
  scheduledTaskInvestigated: boolean;
  networkInvestigated: boolean;
  interventionCompleted: boolean;
  finalABCompleted: boolean;
  activityMapGenerated: boolean;
  optimizationLogGenerated: boolean;
  completed: boolean;
}

// ==========================================
// CAPÍTULO 06 // TALLER EVO // EVO DIAGNOSTIC
// ==========================================

export type HypothesisStatus =
  | 'PENDIENTE'
  | 'SIN_INDICIO'
  | 'INDICIO_DEBIL'
  | 'INDICIO_MODERADO'
  | 'INDICIO_FUERTE'
  | 'DESCARTADA_PARA_ESTE_CASO'
  | 'NO_EVALUABLE';

export interface DiagnosticHypothesis {
  id: string;
  label: string;
  componentCategory:
    | 'CPU'
    | 'GPU'
    | 'RAM'
    | 'ALMACENAMIENTO'
    | 'TEMPERATURA'
    | 'ENERGIA'
    | 'DRIVERS'
    | 'SISTEMA_WINDOWS'
    | 'RED'
    | 'SOFTWARE'
    | 'PERIFERICOS';
  status: HypothesisStatus;
  reasoning?: string;
}

export type DiagnosticSymptomCategory =
  | 'ENCENDIDO_SIN_VIDEO'
  | 'ARRANQUE_WINDOWS'
  | 'RENDIMIENTO_FPS_STUTTER'
  | 'REINICIOS_BSOD_APAGADOS'
  | 'DISCO_100'
  | 'RAM_NO_DETECTADA'
  | 'RED_LAG'
  | 'JUEGO_CIERRA'
  | 'FALLO_TRAS_ACTUALIZACION'
  | 'TEMPERATURA_RUIDO'
  | 'USB_PERIFERICOS'
  | 'RIESGO_ELECTRICO'
  | 'OTRO';

export interface DiagnosticTestRecord {
  id: string;
  title: string;
  goal: string;
  instructions: string[];
  whatToLookAt: string;
  technicalCommand?: string;
  whatItDoes?: string;
  whatItReturns?: string;
  whatItDoesNotProve?: string;
  outcomeAnswer?: string;
  evidenceNote?: string;
  completedAt?: string;
}

export interface DiagnosticInterventionProposal {
  whatToChange: string;
  why: string;
  backingEvidence: string;
  riskLevel: 'MINIMO' | 'BAJO' | 'MEDIO' | 'ALTO';
  reversible: boolean;
  howToRevert: string;
  executed: boolean;
  beforeState?: string;
  afterState?: string;
  retestCondition?: string;
  retestResult?: string;
}

export type DiagnosticFinalOutcomeStatus =
  | 'RESUELTO'
  | 'MEJORO'
  | 'MEJORÓ'
  | 'SIN_CAMBIOS'
  | 'EMPEORO'
  | 'EMPEORÓ'
  | 'CAUSA_PROBABLE'
  | 'DOS_HIPOTESIS_PRINCIPALES'
  | 'MULTIFACTORIAL'
  | 'NO_REPRODUCIDO'
  | 'NO_PUDO_REPRODUCIRSE'
  | 'EVIDENCIA_INSUFICIENTE'
  | 'REQUIERE_DIAGNOSTICO_ADICIONAL';

export type DiagnosticOutcomeStatus = 'INVESTIGANDO' | DiagnosticFinalOutcomeStatus;

export interface DiagnosticCase {
  id: string; // ej. "006-001"
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  rawDescription: string;
  interpreted: {
    symptom: string;
    context: string;
    pattern: string;
    cause: string; // "NO DETERMINADA"
    humanSummary: string;
    declaredFacts?: string[];
    unknownData?: string[];
  };
  category: DiagnosticSymptomCategory;
  hasSafetyHalt?: boolean;
  safetyHaltReason?: string;
  currentQuestionIndex: number;
  answers: Array<{ questionId: string; questionText: string; answerText: string }>;
  hypotheses: DiagnosticHypothesis[];
  tests: DiagnosticTestRecord[];
  currentTestIndex: number;
  intervention?: DiagnosticInterventionProposal;
  status: DiagnosticOutcomeStatus;
  finalOutcome: DiagnosticOutcomeStatus;
  closingReason?: string;
  completed: boolean;
  retestCompleted?: boolean;
}

export interface DiagnosticDossier {
  schemaVersion: number;
  generatedAt: string;
  caseId: string;
  rawDescription: string;
  symptom: string;
  context: string;
  pattern: string;
  inheritedHardware?: Partial<UserPcSpec>;
  inheritedFindings?: {
    fluidez?: string;
    limitation?: string;
    baselineProcesses?: number;
  };
  questionTrail: Array<{ question: string; answer: string }>;
  hypothesesVigentes: DiagnosticHypothesis[];
  hypothesesDescartadas: DiagnosticHypothesis[];
  testsExecuted: DiagnosticTestRecord[];
  intervention?: DiagnosticInterventionProposal;
  finalStatus: DiagnosticOutcomeStatus;
  conclusionSummary: {
    whatWeKnewAtStart: string;
    whatWeDiscovered: string;
    whatWeDiscarded: string;
    whatWeChanged: string;
    whatHappenedAfter: string;
  };
}

// ==========================================
// CAPÍTULO 07: LABORATORIO FINAL // EXPERIMENTO A/B
// ==========================================

export type AbExperimentObjective =
  | 'MEJORAR_ESTABILIDAD_FPS'
  | 'REDUCIR_STUTTERING'
  | 'REDUCIR_CONSUMO_RAM'
  | 'REDUCIR_ACTIVIDAD_REPOSO'
  | 'MEJORAR_TIEMPO_RESPUESTA'
  | 'COMPARAR_DOS_CONFIGURACIONES'
  | 'INVESTIGAR_LIMITACION'
  | 'OTRO';

export type AbPerception =
  | 'FLUIDO'
  | 'MICRO-STUTTERING'
  | 'TIRONES'
  | 'CONGELAMIENTOS'
  | 'RESPUESTA_LENTA'
  | 'SIN_CAMBIO_PERCIBIDO';

export type AbOutcomeResult =
  | 'MEJORÓ'
  | 'MEJORÓ_PARCIALMENTE'
  | 'SIN_CAMBIOS_SIGNIFICATIVOS'
  | 'EMPEORÓ'
  | 'RESULTADO_MIXTO'
  | 'NO_CONCLUYENTE'
  | 'NO_REPRODUCIDO';

export type AbUserDecision =
  | 'CONSERVAR'
  | 'REVERTIR'
  | 'NECESITO_MAS_PRUEBAS';

export interface AbMetricDefinition {
  key: string;
  label: string;
  unit: string;
  higherIsBetter: boolean;
  category: 'FPS' | 'RAM' | 'WINDOWS' | 'GENERAL';
  placeholder?: string;
  description?: string;
}

export interface AbMetricSnapshot {
  [key: string]: number | null;
}

export interface AbMetricDelta {
  key: string;
  label: string;
  unit: string;
  valueA: number;
  valueB: number;
  deltaAbsolute: number;
  deltaPercent: number | null;
  higherIsBetter: boolean;
  evaluation: 'MEJORÓ' | 'EMPEORÓ' | 'IGUAL';
}

export interface AbControlledVariable {
  variableType: string;
  customName?: string;
  beforeState: string;
  changeApplied: string;
  reversible: boolean;
  howToRevert: string;
  revertedConfirmed?: boolean;
}

export interface AbExperimentConditions {
  gameOrApp: string;
  resolution?: string;
  quality?: string;
  fpsCap?: string;
  vsync?: string;
  sceneOrMap?: string;
  duration?: string;
  loadCondition?: string;
  openPrograms?: string;
  windowsState?: string;
  notes?: string;
}

export interface AbExperimentTrial {
  trialNumber: number;
  metricsA: AbMetricSnapshot;
  metricsB: AbMetricSnapshot;
  perceptionA?: AbPerception;
  perceptionB?: AbPerception;
  notes?: string;
}

export interface AbLaboratoryReport {
  id: string; // ej. "EVO-LAB-001"
  createdAt: string;
  completedAt?: string;
  hardware: Partial<UserPcSpec>;
  objective: AbExperimentObjective;
  objectiveCustomText?: string;
  userHypothesis: string;
  conditions: AbExperimentConditions;
  selectedMetricKeys: string[];
  customMetrics?: Array<{ key: string; label: string; unit: string; higherIsBetter: boolean }>;
  controlledVariable: AbControlledVariable;
  metricsA: AbMetricSnapshot;
  metricsB: AbMetricSnapshot;
  perceptionA?: AbPerception;
  perceptionB?: AbPerception;
  deltas: AbMetricDelta[];
  trials?: AbExperimentTrial[];
  interpretation: {
    whatChanged: string;
    whatDidNotChange: string;
    whatWeStillDoNotKnow: string;
  };
  outcomeResult: AbOutcomeResult;
  userDecision: AbUserDecision;
  userConclusion: string;
  isReverted?: boolean;
  completed: boolean;
}

export interface Tome01DossierSummary {
  passport: boolean;
  flowMap: boolean;
  fluidezProfile: boolean;
  limitMatrix: boolean;
  activityMap: boolean;
  optimizationLog: boolean;
  diagnosticCase: boolean;
  labReport: boolean;
  allCompleted: boolean;
}

export type EvoNarrativeProfile = 'investigador' | 'constructor' | 'explorador' | 'tecnico';

export interface EvoProfileDetail {
  id: EvoNarrativeProfile;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  workstyle: string;
  motto: string;
}

export type EvoZoneId =
  | 'zona-1'
  | 'zona-2'
  | 'zona-3'
  | 'zona-4'
  | 'zona-5'
  | 'zona-6'
  | 'zona-7'
  | 'zona-8';

export interface UserHardwarePassport {
  cpuModel?: string;
  ramCapacityGb?: number;
  gpuModel?: string;
  storageModel?: string;
  osVersion?: string;
  isVerified?: boolean;
}

export interface EvoLabZone {
  id: EvoZoneId;
  number: string;
  title: string;
  subtitle: string;
  keyPhrase: string;
  aspect: string;
  elements: string[];
  statusCode: 'active' | 'in_construction' | 'restricted';
  statusBadge: string;
  isInteractive: boolean; // true for Zona 3 (Tomo 01)
  description: string;
  narrativeDetail: string;
  upcomingFeatures: string[];
  examples: string[];
  ctaLabel?: string;
  coordinates: {
    angleDeg: number;
    orbitDistance: 'near' | 'mid' | 'outer';
    gridArea?: string;
    positionPct?: { x: number; y: number };
  };
}



