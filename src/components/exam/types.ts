export type ExamQuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'SEQUENCE'
  | 'VISUAL_ANALYSIS'
  | 'EVIDENCE'
  | 'DIAGNOSTIC_CASE'
  | 'CAUSE_EFFECT'
  | 'SAFETY'
  | 'OUTPUT_INTERPRETATION';

export type ExamCompetencyArea =
  | 'FUNDAMENTOS'
  | 'INTERPRETACION'
  | 'DIAGNOSTICO_APLICACION'
  | 'SEGURIDAD'
  | 'VALIDACION_CONCLUSION';

export type VisualResourceKey =
  | 'frametime_stutter_graph'
  | 'latency_hierarchy_chart'
  | 'silicon_topology_map'
  | 'powershell_acpi_terminal'
  | 'atx_24pin_multimeter'
  | 'uefi_gpt_boot_tree'
  | 'latencymon_dpc_output'
  | 'laptop_dc_jack_rail'
  | 'winsxs_hardlinks_diagram'
  | 'ram_dual_channel_schematic'
  | 'dism_sfc_repair_flow'
  | 'boot_loop_diagnostic_tree'
  | 'heatpipe_thermal_sensor'
  | 'event_viewer_kernel_dump'
  | 'sysinternals_procexp_tree';

export interface ExamOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface SequenceStep {
  id: string;
  text: string;
  correctIndex: number;
}

export interface ExamQuestion {
  id: string;
  tomoId: string;
  questionNumber?: number;
  type: ExamQuestionType;
  category: string;
  competencyArea: ExamCompetencyArea;
  prompt: string;
  contextNote?: string;
  visualResource?: VisualResourceKey;
  visualCaption?: string;
  relatedChapterNumber?: string;
  relatedChapterTitle: string;
  relatedModuleId?: string;
  relatedModuleIndex?: number;
  // For SINGLE_CHOICE, MULTIPLE_CHOICE, VISUAL_ANALYSIS, EVIDENCE, DIAGNOSTIC_CASE, CAUSE_EFFECT, SAFETY, OUTPUT_INTERPRETATION
  options?: ExamOption[];
  // For SEQUENCE
  sequenceSteps?: SequenceStep[];
  // Technical explanation after submitting
  technicalRationale: string;
  practicalApplication?: string;
}

export interface ExamBank {
  tomoId: string;
  tomoNumber: string;
  tomoTitle: string;
  tomoTagline: string;
  accentColor: string;
  secondaryColor: string;
  passingScorePercent: number; // usually 70
  questionsPerAttempt: number; // usually 15
  isUnderDevelopment?: boolean;
  developmentNote?: string;
  questions: ExamQuestion[];
}

export interface UserExamAnswer {
  questionId: string;
  selectedOptionIds?: string[]; // for single and multiple choice
  orderedStepIds?: string[]; // for sequence
}

export interface QuestionGradingResult {
  question: ExamQuestion;
  userAnswer: UserExamAnswer;
  isCorrect: boolean;
  score: number; // 0 or 1
  maxScore: 1;
}

export type ExamResultTier =
  | 'CRITICAL_REVIEW' // 0-49%
  | 'NEAR_PASS' // 50-69%
  | 'THEORY_VERIFIED' // 70-84%
  | 'SOLID_MASTERY'; // 85-100%

export interface CategoryBreakdown {
  category: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface CompetencyBreakdown {
  area: ExamCompetencyArea;
  areaLabel: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface ExamAttemptRecord {
  id: string;
  tomoId: string;
  tomoNumber: string;
  timestamp: string; // ISO string
  formattedDate: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  tier: ExamResultTier;
  passed: boolean;
  categoryBreakdown: CategoryBreakdown[];
  incorrectQuestionIds: string[];
}

export interface EvoTomeExamEngineProps {
  tomoId: string;
  onBackToTomoCover?: () => void;
  onBackToIndex?: () => void;
  onGoToChapter?: (chapterNumber: string) => void;
  onGoToModule?: (moduleIndex: number) => void;
  onContinueToLab?: () => void;
  onOpenCompletionScreen?: () => void;
  onExamPassed?: (score: number, total: number) => void;
}
