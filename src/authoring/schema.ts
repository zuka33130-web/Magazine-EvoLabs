// ============================================================================
// EVO LABS // AUTHORING SYSTEM (FASE 07)
// Declarative Content Schemas for Tomos, Chapters, Labs, Cases, Checks,
// Skills, and Evidences. Decouples Content from State and Presentation.
// ============================================================================

export type ContentStatus = 'DRAFT' | 'REVIEW' | 'STABLE' | 'DEPRECATED';

export type EpistemicProvenance =
  | 'SYSTEM_REPORTED'
  | 'MEASURED'
  | 'CALCULATED'
  | 'ESTIMATED'
  | 'SIMULATED'
  | 'UNKNOWN';

// ----------------------------------------------------------------------------
// 1. SKILL SCHEMA
// ----------------------------------------------------------------------------
export interface SkillSchema {
  id: string;
  name: string;
  domain: 'HARDWARE' | 'WINDOWS' | 'RENDIMIENTO' | 'DIAGNOSTICO' | 'REDES' | 'SEGURIDAD' | 'GENERAL';
  description: string;
  prerequisites: string[]; // Skill IDs
  supports: string[];     // Skill IDs supported by this one
  unlocks: string[];      // Tools/Capabilities unlocked
  demonstratedBy: string[]; // Chapter/Lab/Case IDs
  verifiedBy: string[];     // Exam/Certification IDs
  version: string;        // e.g. "1.0.0"
  updatedAt: string;      // ISO Date
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 2. CHECK / ASSESSMENT SCHEMA
// ----------------------------------------------------------------------------
export type CheckType =
  | 'KNOWLEDGE_CHECK'
  | 'MEASUREMENT_INPUT'
  | 'ACTION_TRIGGER'
  | 'VERIFICATION_CHOICE';

export interface CheckSchema {
  id: string;
  label: string;
  question: string;
  checkType: CheckType;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    feedbackText: string;
  }>;
  explanation: string;
  failureFeedback: string;
  weight: number; // 1-10
  targetSkillId: string;
  version: string;
  updatedAt: string;
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 3. EVIDENCE SCHEMA
// ----------------------------------------------------------------------------
export interface EvidenceSchema {
  id: string;
  sourceId: string; // Tomo/Chapter/Lab/Case ID
  sourceType: 'CHAPTER' | 'LAB' | 'CASE' | 'EXAM' | 'AUDIT';
  skillId: string;
  title: string;
  description: string;
  provenance: EpistemicProvenance;
  expectedArtifacts: string[];
  metricThresholds?: Record<string, string | number>;
  whyExplanation: string;
  version: string;
  updatedAt: string;
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 4. EDITORIAL SECTION SCHEMA
// ----------------------------------------------------------------------------
export type EditorialLayoutType =
  | 'NARRATIVE'
  | 'COMPARISON'
  | 'DIAGRAM'
  | 'CODE_TERMINAL'
  | 'CALLOUT'
  | 'TABLE';

export interface EditorialSectionSchema {
  id: string;
  title: string;
  layout: EditorialLayoutType;
  contentText: string;
  technicalCallout?: {
    type: 'WARNING' | 'METRIC_RULE' | 'PROVENANCE_NOTE' | 'KEY_CONCEPT';
    title: string;
    text: string;
  };
  codeSnippet?: {
    language: string;
    code: string;
    caption?: string;
  };
  comparisonData?: {
    itemA: { title: string; points: string[] };
    itemB: { title: string; points: string[] };
  };
  diagramType?: string;
}

// ----------------------------------------------------------------------------
// 5. CHAPTER SCHEMA
// ----------------------------------------------------------------------------
export type ChapterType = 'EDITORIAL' | 'LAB' | 'CASE' | 'ASSESSMENT';

export interface ChapterSchema {
  id: string;
  tomoId: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  type: ChapterType;
  sections: EditorialSectionSchema[];
  readingTimeMin: number;
  checkpoints: CheckSchema[];
  targetSkills: string[]; // Skill IDs
  evidenceGenerated?: EvidenceSchema[];
  version: string;
  updatedAt: string;
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 6. LAB SCHEMA
// ----------------------------------------------------------------------------
export type LabType =
  | 'INTERACTIVE_SANDBOX'
  | 'STEP_BY_STEP'
  | 'BENCHMARK'
  | 'DIAGNOSTIC_FLOW';

export interface LabStepSchema {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  targetComponent: string;
  expectedOutcome: string;
  validationCommand?: string;
  provenance: EpistemicProvenance;
}

export interface LabSchema {
  id: string;
  tomoId: string;
  chapterId?: string;
  title: string;
  objective: string;
  labType: LabType;
  difficulty: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';
  steps: LabStepSchema[];
  validationCriteria: string[];
  toolsRequired: string[];
  initialSystemState: Record<string, any>;
  evidenceGenerated: EvidenceSchema[];
  version: string;
  updatedAt: string;
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 7. TECHNICAL CASE SCHEMA
// ----------------------------------------------------------------------------
export interface CaseHypothesisSchema {
  id: string;
  title: string;
  description: string;
  isCorrectCause: boolean;
  refutationExplanation: string;
  supportingEvidenceIds: string[];
}

export interface CaseEvidenceItemSchema {
  id: string;
  label: string;
  category: string;
  value: string;
  provenance: EpistemicProvenance;
  unlockedByActionId?: string;
}

export interface CaseActionSchema {
  id: string;
  label: string;
  toolRequired: string;
  costOrDelaySeconds?: number;
  unlockedEvidenceId: string;
}

export interface CaseSchema {
  id: string;
  title: string;
  difficulty: 'FACIL' | 'INTERMEDIO' | 'AVANZADO' | 'PERICIAL';
  scenario: string;
  symptoms: string[];
  context: string;
  availableEvidence: CaseEvidenceItemSchema[];
  possibleActions: CaseActionSchema[];
  hypotheses: CaseHypothesisSchema[];
  resolutionDiagnosis: {
    rootCause: string;
    technicalJustification: string;
    remediationGuide: string;
  };
  demonstratedSkills: string[];
  evidenceGenerated: EvidenceSchema[];
  version: string;
  updatedAt: string;
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 8. TOMO SCHEMA
// ----------------------------------------------------------------------------
export interface TomoSchema {
  id: string;
  tomoNumber: string; // e.g. "01", "02"
  title: string;
  subtitle: string;
  description: string;
  coverTheme: string;
  estimatedHours: number;
  prerequisiteTomoIds: string[];
  targetSkills: string[];
  chapters: ChapterSchema[];
  labs: LabSchema[];
  cases: CaseSchema[];
  version: string;
  updatedAt: string;
  status: ContentStatus;
}

// ----------------------------------------------------------------------------
// 9. UNIFIED AUTHORING REGISTRY
// ----------------------------------------------------------------------------
export interface AuthoringRegistry {
  tomos: TomoSchema[];
  chapters: ChapterSchema[];
  labs: LabSchema[];
  cases: CaseSchema[];
  skills: SkillSchema[];
  checks: CheckSchema[];
  evidences: EvidenceSchema[];
}
