import { ChapterItem } from '../types';

export interface StepStatus {
  id: string;
  label: string;
  completed: boolean;
}

export interface ChapterRequirementInfo {
  chapterNumber: string;
  chapterTitle: string;
  prerequisiteChapterNumber: string;
  prerequisiteChapterTitle: string;
  steps: StepStatus[];
  pendingActivities: string[];
  missingCountText: string;
  targetChapterNumber: '01' | '02' | '03' | '04' | '05' | '06' | '07';
  targetStationOrSection?: string;
}

export function getChapterRequirements(
  chapterNumber: string,
  allChapters: ChapterItem[]
): ChapterRequirementInfo {
  const currentChapter = allChapters.find((c) => c.number === chapterNumber);
  const chapterTitle = currentChapter?.title || `CAPÍTULO ${chapterNumber}`;

  // CHAPTER 02 LOCKED: Prerequisite is Chapter 01
  if (chapterNumber === '02') {
    let completedC01 = new Set<string>();
    try {
      const saved = localStorage.getItem('evo_c01_completed');
      if (saved) {
        completedC01 = new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }

    const c01Steps: StepStatus[] = [
      { id: 'cpu', label: 'CPU // Identificación de silicio', completed: completedC01.has('cpu') },
      { id: 'ram', label: 'RAM // Memoria y ancho de banda', completed: completedC01.has('ram') },
      { id: 'gpu', label: 'GPU // Gráficos dedicados o integrados', completed: completedC01.has('gpu') },
      { id: 'storage', label: 'Almacenamiento // SSD o HDD', completed: completedC01.has('storage') },
      { id: 'motherboard', label: 'Plataforma // Placa base y chipset', completed: completedC01.has('motherboard') },
      { id: 'windows', label: 'Windows // Versión y compilación', completed: completedC01.has('windows') },
      { id: 'peripherals', label: 'Periféricos // Entorno visual', completed: completedC01.has('peripherals') },
      { id: 'tu-pc', label: 'Pasaporte EVO // Consolidación', completed: completedC01.has('tu-pc') },
    ];

    const pending = c01Steps.filter((s) => !s.completed);
    const firstPending = pending[0]?.id || 'cpu';

    const pendingActivities = pending.map((s) => s.label);
    const missingCountText =
      pending.length === 1
        ? 'FALTA:'
        : `FALTAN ${pending.length} PASOS:`;

    return {
      chapterNumber: '02',
      chapterTitle: 'CÓMO TRABAJAN JUNTOS',
      prerequisiteChapterNumber: '01',
      prerequisiteChapterTitle: '¿QUÉ PC TENÉS REALMENTE?',
      steps: c01Steps,
      pendingActivities:
        pendingActivities.length > 0
          ? pendingActivities
          : ['Consolidar el Pasaporte de Hardware en TU PC'],
      missingCountText,
      targetChapterNumber: '01',
      targetStationOrSection: firstPending,
    };
  }

  // CHAPTER 03 LOCKED: Prerequisite is Chapter 02
  if (chapterNumber === '03') {
    let completedStations = new Set<string>();
    let isC02Finished = false;
    let hasLabData = false;
    let hasLabObservations = false;

    try {
      const savedStations = localStorage.getItem('evo_c02_completed_stations');
      if (savedStations) {
        completedStations = new Set(JSON.parse(savedStations));
      }
      isC02Finished = localStorage.getItem('evo_c02_status') === 'completed';

      const labDataStr = localStorage.getItem('evo_c02_lab_data');
      if (labDataStr) {
        hasLabData = true;
        const parsed = JSON.parse(labDataStr);
        // check if user recorded non-default observation or custom load
        if (parsed.loadCustomName || parsed.reposo || parsed.carga || parsed.actividad) {
          hasLabObservations = true;
        }
      }
    } catch {
      // ignore
    }

    const c02Steps: StepStatus[] = [
      { id: 'journey', label: 'El viaje', completed: completedStations.has('journey') },
      { id: 'memory', label: 'Memoria', completed: completedStations.has('memory') },
      { id: 'graphics', label: 'Gráficos', completed: completedStations.has('graphics') },
      { id: 'storage', label: 'Almacenamiento', completed: completedStations.has('storage') },
      { id: 'lab', label: 'Laboratorio 02', completed: isC02Finished || completedStations.has('lab') },
    ];

    const pending = c02Steps.filter((s) => !s.completed);
    const firstPendingStation = pending[0]?.id || 'journey';

    let pendingActivities: string[] = [];

    // If only lab is pending, break down into the specific micro-activities
    if (pending.length === 1 && pending[0].id === 'lab') {
      if (!hasLabObservations) {
        pendingActivities = [
          'Registrar observación en actividad',
          'Construir Mapa de Flujo EVO',
        ];
      } else {
        pendingActivities = [
          'Construir Mapa de Flujo EVO (Finalizar Laboratorio)',
        ];
      }
    } else if (pending.length > 0) {
      pendingActivities = pending.map((s) => {
        if (s.id === 'lab') return 'Laboratorio 02 // Seguí el flujo';
        return `Estación ${s.label}`;
      });
    } else {
      pendingActivities = ['Finalizar Laboratorio 02 y consolidar Mapa de Flujo'];
    }

    const missingCountText =
      pendingActivities.length === 1
        ? 'FALTA:'
        : `FALTAN ${pendingActivities.length} PASOS:`;

    return {
      chapterNumber: '03',
      chapterTitle: 'CUANDO LOS FPS MIENTEN',
      prerequisiteChapterNumber: '02',
      prerequisiteChapterTitle: 'CÓMO TRABAJAN JUNTOS',
      steps: c02Steps,
      pendingActivities,
      missingCountText,
      targetChapterNumber: '02',
      targetStationOrSection: firstPendingStation,
    };
  }

  // CHAPTER 04 LOCKED: Prerequisite is Chapter 03
  if (chapterNumber === '04') {
    let hasGame = false;
    let hasFps = false;
    let hasSensacion = false;
    let hasProfile = false;
    let isC03Done = false;

    try {
      isC03Done = localStorage.getItem('evo_c03_status') === 'completed';
      hasGame = Boolean(localStorage.getItem('evo_c03_game'));
      hasFps = Boolean(localStorage.getItem('evo_c03_fps_habituales'));
      hasSensacion = Boolean(localStorage.getItem('evo_c03_sensacion'));
      hasProfile = Boolean(localStorage.getItem('evo_c03_fluidez_profile')) || isC03Done;
    } catch {
      // ignore
    }

    const c03Steps: StepStatus[] = [
      { id: 'game', label: 'Elegir juego', completed: isC03Done || hasGame },
      { id: 'fps', label: 'Registrar FPS observados', completed: isC03Done || hasFps },
      { id: 'sensacion', label: 'Registrar sensación', completed: isC03Done || hasSensacion },
      { id: 'profile', label: 'Generar Perfil de Fluidez EVO 001', completed: isC03Done || hasProfile },
    ];

    const pending = c03Steps.filter((s) => !s.completed);
    const firstPendingId = pending[0]?.id || 'game';

    const pendingActivities = pending.map((s) => s.label);
    const missingCountText =
      pendingActivities.length === 1 ? 'TE FALTA:' : `TE FALTAN ${pendingActivities.length} PASOS:`;

    return {
      chapterNumber: '04',
      chapterTitle: 'ENCONTRÁ EL LÍMITE',
      prerequisiteChapterNumber: '03',
      prerequisiteChapterTitle: 'CUANDO LOS FPS MIENTEN',
      steps: c03Steps,
      pendingActivities: pendingActivities.length > 0 ? pendingActivities : ['Generar Perfil de Fluidez EVO 001'],
      missingCountText,
      targetChapterNumber: '03',
      targetStationOrSection: firstPendingId === 'profile' ? 'seccion-estacion-07' : 'seccion-estacion-05',
    };
  }

  // CHAPTER 05 LOCKED: Prerequisite is Chapter 04
  if (chapterNumber === '05') {
    let isC04Done = false;
    let hasExperiment = false;
    try {
      isC04Done = localStorage.getItem('evo_c04_status') === 'completed';
      hasExperiment = Boolean(localStorage.getItem('evo_c04_experiment_data'));
    } catch {
      // ignore
    }

    const c04Steps: StepStatus[] = [
      { id: 'sospechoso', label: 'Estación 01: El Sospechoso Equivocado (Falacia del 100%)', completed: isC04Done },
      { id: 'cpu-gpu', label: 'Estación 02: Diálogo de Cadencia CPU vs GPU', completed: isC04Done },
      { id: 'otros', label: 'Estación 03: Auditoría de otros limitadores', completed: isC04Done },
      { id: 'ab-experiment', label: 'Estación 04: Ensayo A/B de escala gráfica', completed: isC04Done || hasExperiment },
      { id: 'matriz', label: 'Estación 05: Consolidar Matriz de Limitación EVO 001', completed: isC04Done },
    ];

    const pending = c04Steps.filter((s) => !s.completed);
    const pendingActivities =
      pending.length > 0
        ? pending.map((s) => s.label)
        : ['Consolidar la Matriz de Limitación EVO 001 en Capítulo 04'];

    const missingCountText =
      pendingActivities.length === 1 ? 'FALTA:' : `FALTAN ${pendingActivities.length} PASOS:`;

    return {
      chapterNumber: '05',
      chapterTitle: 'WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO',
      prerequisiteChapterNumber: '04',
      prerequisiteChapterTitle: 'ENCONTRÁ EL LÍMITE',
      steps: c04Steps,
      pendingActivities,
      missingCountText,
      targetChapterNumber: '04',
      targetStationOrSection: 'estacion-04-experimento-controlado',
    };
  }

  // CHAPTER 06 LOCKED: Prerequisite is Chapter 05
  if (chapterNumber === '06') {
    let isC05Done = false;
    let hasOptimization = false;
    try {
      isC05Done = localStorage.getItem('evo_c05_status') === 'completed';
      hasOptimization = Boolean(localStorage.getItem('evo_c05_optimization_log'));
    } catch {
      // ignore
    }

    const c05Steps: StepStatus[] = [
      { id: 'baseline', label: 'Estación 01: Estado basal en reposo', completed: isC05Done || hasOptimization },
      { id: 'activity', label: 'Estación 02: Mapa de actividad del usuario', completed: isC05Done || hasOptimization },
      { id: 'invisible', label: 'Estaciones 03-05: Carga invisible, kernel y tareas', completed: isC05Done },
      { id: 'intervention', label: 'Estación 07: Intervención controlada y retest', completed: isC05Done },
      { id: 'artifacts', label: 'Estación 08: Expediente de optimización consolidado', completed: isC05Done },
    ];

    const pending = c05Steps.filter((s) => !s.completed);
    const pendingActivities =
      pending.length > 0
        ? pending.map((s) => s.label)
        : ['Completar Capítulo 05 // WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO'];

    const missingCountText =
      pendingActivities.length === 1 ? 'FALTA:' : `FALTAN ${pendingActivities.length} PASOS:`;

    return {
      chapterNumber: '06',
      chapterTitle: 'TALLER EVO',
      prerequisiteChapterNumber: '05',
      prerequisiteChapterTitle: 'WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO',
      steps: c05Steps,
      pendingActivities,
      missingCountText,
      targetChapterNumber: '05',
      targetStationOrSection: 'estacion-08-cierre-capitulo',
    };
  }

  // CHAPTER 07 LOCKED: Prerequisite is Chapter 06
  let isC06Done = false;
  let hasCase = false;
  try {
    isC06Done = localStorage.getItem('evo_c06_status') === 'completed';
    const savedCases = localStorage.getItem('evo_c06_cases');
    hasCase = Boolean(savedCases && JSON.parse(savedCases).length > 0);
  } catch {
    // ignore
  }

  const c06Steps: StepStatus[] = [
    { id: 'intake', label: 'Ingreso al Taller: Descripción del problema y clasificación', completed: isC06Done || hasCase },
    { id: 'hypotheses', label: 'Mapa de Hipótesis Vivo: Descartes con certeza técnica', completed: isC06Done },
    { id: 'tests', label: 'Pruebas Técnicas: Auditoría objetiva sin tocar variables al azar', completed: isC06Done },
    { id: 'intervention', label: 'Intervención Controlada: Modificación de variable única y retest', completed: isC06Done },
    { id: 'dossier', label: 'Artefacto: Expediente de Diagnóstico EVO 001 consolidado', completed: isC06Done },
  ];

  const pendingC06 = c06Steps.filter((s) => !s.completed);
  const pendingActivitiesC06 =
    pendingC06.length > 0
      ? pendingC06.map((s) => s.label)
      : ['Completar una investigación pericial en Capítulo 06 // TALLER EVO'];

  return {
    chapterNumber: '07',
    chapterTitle: 'LABORATORIO FINAL',
    prerequisiteChapterNumber: '06',
    prerequisiteChapterTitle: 'TALLER EVO',
    steps: c06Steps,
    pendingActivities: pendingActivitiesC06,
    missingCountText: pendingActivitiesC06.length === 1 ? 'FALTA:' : `FALTAN ${pendingActivitiesC06.length} PASOS:`,
    targetChapterNumber: '06',
    targetStationOrSection: 'pantalla-capitulo-06',
  };
}
