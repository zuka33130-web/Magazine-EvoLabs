// ============================================================================
// EVO LABS // FRAMEWORK UNIFICADO DE LABORATORIOS DE INGENIERÍA
// Tipos de datos, origen pericial, metrología y motor de evidencia
// ============================================================================

export type DataOrigin = 'REAL' | 'SIMULATED' | 'USER_INPUT' | 'DERIVED' | 'NOT_AVAILABLE';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type VerdictType = 'MEJORA' | 'EMPEORA' | 'SIN CAMBIO' | 'INCONCLUSO';

export type LabStepIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface MetricDefinition {
  key: string;
  name: string;
  unit: string;
  whatIsIt: string;
  whereItComesFrom: string;
  whatItMeans: string;
  whatItDoesNotMean: string;
  formulaOrDetail?: string;
  dataOrigin: DataOrigin;
}

export interface ExperimentSample {
  runIndex: number;
  timestamp: string;
  value: number;
  meta?: Record<string, string | number | boolean>;
}

export interface ExperimentEvidence {
  experimentId: string;
  labId: string;
  labTitle: string;
  tomeId: string;
  tomeNumber: string;
  timestamp: string;
  mission: string;
  systemVariables: string[];
  hypothesis: string;
  controlledVariable: string;
  baselineValue: string | number;
  experimentValue: string | number;
  deltaValue: string | number;
  metricKey: string;
  metricUnit: string;
  dataOrigin: DataOrigin;
  originDetail: string;
  samples: ExperimentSample[];
  medianValue: number | null;
  varianceValue: number | null;
  confidence: ConfidenceLevel;
  confidenceRationale: string;
  interpretation: string;
  verdict: VerdictType;
  conclusion: string;
  technicalStandard: string;
}

export interface GuidedCase {
  id: string;
  caseNumber: string;
  title: string;
  symptom: string;
  evidence: string;
  hypothesis: string;
  testAction: string;
  resultSummary: string;
  conclusion: string;
  targetSubLabId: string;
  suggestedVariables?: Record<string, any>;
}

export interface TutorEvoAdvice {
  whatYouAreMeasuring: string;
  whyItMatters: string;
  whatCanBeConcluded: string;
  whatCannotBeConcluded: string;
  evoGoldenRule: string;
}

export interface SubLabModule {
  id: string;
  code: string; // e.g. "05A"
  title: string;
  subtitle: string;
  category: string;
  description: string;
  systemVariables: {
    name: string;
    description: string;
    unit?: string;
    isControlled?: boolean;
  }[];
  metrics: MetricDefinition[];
  tutorAdvice: TutorEvoAdvice;
  standardReference: string;
}
