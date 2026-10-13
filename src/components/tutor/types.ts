export type TutorMode = 'guiado' | 'libre';

export type TutorLevel = 'simple' | 'entender' | 'pro' | 'taller';

export type TutorActivityType =
  | 'lectura'
  | 'practica'
  | 'comprobacion'
  | 'examen'
  | 'laboratorio'
  | 'diagnostico'
  | 'mundo';

export interface TutorLocation {
  academySection: string; // e.g. 'MUNDO EVO', 'TOMOS EVO LABS', 'LABORATORIOS'
  tomoId?: string;
  tomoNumber?: string;
  tomoTitle?: string;
  chapterNumber?: string;
  chapterTitle?: string;
  activityTitle?: string;
  activityType?: TutorActivityType;
  whatIs: string; // QUÉ ES
  whatFor: string; // PARA QUÉ SIRVE
  currentAction: string; // AHORA: acción concreta
  whatToLookFor?: string; // QUÉ HAY QUE OBSERVAR
  whyItMatters: string; // POR QUÉ
  nextStep: string; // DESPUÉS: próximo paso
  relatedTerms?: string[];
  suggestedReview?: string;
}

export interface TutorGlossaryTerm {
  key: string;
  term: string;
  category: 'HARDWARE' | 'MEMORIA' | 'SISTEMAS' | 'METROLOGÍA' | 'REDES' | 'TALLER' | 'SEGURIDAD';
  shortDef: string;
  simple: string; // NIVEL SIMPLE: qué es sin tecnicismos
  entender: string; // ENTENDER: cómo funciona y por qué es indispensable
  pro: string; // PRO: detalle técnico pericial de silicio/kernel/latencias
  taller: string; // TALLER: aplicación práctica y método de medición
  example: string; // EJEMPLO REAL
  relatedTomoNumber?: string;
  relatedChapter?: string;
}

export interface TutorAcademySector {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  whatIs: string;
  whatFor: string;
  whenToUse: string;
  whatToDo: string;
  targetViewId?: string;
}

export interface TutorPracticeGuide {
  title: string;
  purpose: string;
  requirements: string;
  riskNotice: string;
  expectedResult: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    whatToObserve: string;
    interpretation: string;
  }[];
}

export interface TutorEvoContextValue {
  mode: TutorMode;
  setMode: (mode: TutorMode) => void;
  isTutorOpen: boolean;
  setIsTutorOpen: (open: boolean) => void;
  activeTutorTab: 'explain' | 'glossary' | 'map' | 'tour';
  setActiveTutorTab: (tab: 'explain' | 'glossary' | 'map' | 'tour') => void;
  selectedGlossaryKey: string | null;
  setSelectedGlossaryKey: (key: string | null) => void;
  currentLocation: TutorLocation;
  updateLocation: (partial: Partial<TutorLocation>) => void;
  openTutorWithTerm: (termKey: string) => void;
  openTutorWithTab: (tab: 'explain' | 'glossary' | 'map' | 'tour') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  startZeroKnowledgeTour: () => void;
  dismissOnboarding: () => void;
  isReturningUser: boolean;
  lastSavedLocation: {
    tomoNumber: string;
    tomoTitle: string;
    chapterTitle: string;
    viewId: string;
    timestamp: string;
  } | null;
  saveCurrentLocationHistory: (viewId: string, tomoNumber?: string, chapterTitle?: string) => void;
}
