export interface SectorCommand {
  shell: 'CMD' | 'PowerShell' | 'REG';
  code: string;
  purpose: string;
  example: string;
  interpretation: string;
  admin?: boolean;
  simulationOnly?: boolean;
}
export interface SectorQuestion {
  question: string;
  choices: { text: string; feedback: string; correct: boolean }[];
}
export interface AdvancedSectorLesson {
  heading: string;
  text: string;
}
export interface AdvancedSectorContent {
  number: string;
  objective: string;
  prerequisites: string;
  lessons: AdvancedSectorLesson[];
  commands: SectorCommand[];
  procedure: string[];
  verification: string;
  pitfalls: string[];
  rollback: string;
  mission: string;
  scenario: string;
  decisions: SectorQuestion['choices'];
  questions: SectorQuestion[];
  lab?: { scenario: 'boot' | 'install' | 'services' | 'repair' | 'scheduler' | 'xray'; label: string };
  references: { label: string; url: string }[];
}
export interface SectorLearningEvidence {
  answers: Record<number, number>;
  decision: number | null;
  note: string;
  finalExperiment?: boolean;
}
