import React, { useState, useEffect } from 'react';
import {
  TOMO_01_HEADLINES,
  VOLUMES_COLLECTION,
  TOMO_01_CHAPTERS,
  TOMO_01_OUTCOMES,
} from './data/collections';
import { Header } from './components/Header';
import { MagazineCover } from './components/MagazineCover';
import { HorizontalCollection } from './components/HorizontalCollection';
import { EditorialIndex } from './components/EditorialIndex';
import { Chapter01View } from './components/Chapter01View';
import { Chapter02View, Chapter02Station } from './components/Chapter02View';
import { Chapter03View } from './components/Chapter03View';
import { Chapter04View } from './components/Chapter04View';
import { Chapter05View } from './components/Chapter05View';
import { Chapter06View } from './components/Chapter06View';
import { Chapter07View } from './components/Chapter07View';
import { LockedChapterModal } from './components/LockedChapterModal';
import { ChapterUnlockedCelebrationModal } from './components/ChapterUnlockedCelebrationModal';
import { getChapterRequirements, ChapterRequirementInfo } from './utils/chapterPrerequisites';
import { ChapterItem, EvoNarrativeProfile, EvoLabZone, UserHardwarePassport, Tome01DossierSummary } from './types';
import { EvoWorldMap } from './components/world/EvoWorldMap';
import { EvoIntroExperience } from './components/world/EvoIntroExperience';
import { EvoArchiveEntrance } from './components/world/EvoArchiveEntrance';
import { EvoMagazineView } from './components/magazine/EvoMagazineView';
import { Tomo02MagazineView } from './components/tomo02/Tomo02MagazineView';
import { Tomo03MagazineView } from './components/tomo03/Tomo03MagazineView';
import { Tomo04MagazineView } from './components/tomo04/Tomo04MagazineView';
import { Tomo08MagazineView } from './components/tomo08/Tomo08MagazineView';
import { EvoBootLab } from './components/tomo08/EvoBootLab';
import { EvoMasterLabSuite } from './components/world/labs/EvoMasterLabSuite';
import { EvoWindowsMatrixLab } from './components/world/labs/windowsMatrix/EvoWindowsMatrixLab';
import { EvoLabCore } from './components/evoLabCore/EvoLabCore';
import { ForensicBenchTarget } from './components/common/EvoTomoDossierModal';
import { EvoHardwareDiscoveryModal } from './components/evoLabCore/components/EvoHardwareDiscoveryModal';
import { CatalogCoverageDashboard } from './components/evoLabCore/components/CatalogCoverageDashboard';
import { EvoTelemetryIntegrityModal } from './components/evoLabCore/components/EvoTelemetryIntegrityModal';
import { TelemetryIntegrityService, LiveScanIntegrityResult } from './components/evoLabCore/services/telemetryIntegrityService';
import { EvoCaseRepository } from './components/evoLabCore/services/caseRepository';
import { EvoCase } from './components/evoLabCore/types';
import { EvoTomo01FinalExam } from './components/tomo01/EvoTomo01FinalExam';
import { EvoTomo01CompletionScreen } from './components/tomo01/EvoTomo01CompletionScreen';
import { CheckCircle2, X, History } from 'lucide-react';
import {
  TutorEvoProvider,
  useTutorEvo,
} from './components/tutor/TutorEvoContext';
import { TutorBreadcrumbBar } from './components/tutor/TutorBreadcrumbBar';
import { TutorEvoFloatingButton } from './components/tutor/TutorEvoFloatingButton';
import { TutorEvoDrawer } from './components/tutor/TutorEvoDrawer';
import { TutorOnboardingModal } from './components/tutor/TutorOnboardingModal';
import {
  isChapter01Complete,
  isChapter02Complete,
  isChapter03Complete,
  isChapter04Complete,
  isChapter05Complete,
  isChapter06Complete,
  isChapter07Complete,
  areAllTomo01ChaptersComplete,
  isTomo01ExamPassed,
  isTomo01Complete,
} from './utils/tomo01Progress';

function AppContent() {
  const { updateLocation, saveCurrentLocationHistory } = useTutorEvo();
  const [currentView, setCurrentView] = useState<
    | 'magazine'
    | 'tomo-02'
    | 'tomo-03'
    | 'tomo-04'
    | 'tomo-08'
    | 'boot-lab'
    | 'world-map'
    | 'archivo'
    | 'cover'
    | 'index'
    | 'chapter-01'
    | 'chapter-02'
    | 'chapter-03'
    | 'chapter-04'
    | 'chapter-05'
    | 'chapter-06'
    | 'chapter-07'
    | 'hotswap-lab'
    | 'windows-matrix-lab'
    | 'lab-core'
    | 'tomo01-quiz'
    | 'tomo01-completion'
  >('world-map');

  // Sub-panel & Lab states
  const [activeLabPanel, setActiveLabPanel] = useState<'sandbox' | 'hardware' | 'software' | 'telemetry' | 'matrix' | 'all'>('sandbox');
  const [activeLabMission, setActiveLabMission] = useState<'IDLE' | 'REPAIR' | 'TEST' | 'BOTTLENECK' | 'OPTIMIZE' | 'UPGRADE'>('IDLE');
  const [labCorePhase, setLabCorePhase] = useState<'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE'>('SELECT_PC');
  const [matrixInitialScenario, setMatrixInitialScenario] = useState<string | undefined>(undefined);

  // Modals state
  const [showDiscoveryModal, setShowDiscoveryModal] = useState<boolean>(false);
  const [showCoverageDashboard, setShowCoverageDashboard] = useState<boolean>(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState<boolean>(false);
  const [isScanningIntegrity, setIsScanningIntegrity] = useState<boolean>(false);
  const [liveScanResult, setLiveScanResult] = useState<LiveScanIntegrityResult | null>(null);
  const [showCaseHistoryModal, setShowCaseHistoryModal] = useState<boolean>(false);
  const [caseHistoryList, setCaseHistoryList] = useState<EvoCase[]>([]);
  const [dossierModalTomoId, setDossierModalTomoId] = useState<string | null>(null);

  const [campusSection, setCampusSection] = useState<
    'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso'
  >('campus');

  const [isIntroActive, setIsIntroActive] = useState<boolean>(() => {
    try {
      const url = new URL(window.location.href);
      if (
        url.searchParams.get('volume') ||
        url.searchParams.get('view') ||
        url.searchParams.get('mode') ||
        url.searchParams.get('pdf') ||
        url.searchParams.get('print') === 'true'
      ) {
        return false;
      }
      return localStorage.getItem('evo_academia_intro_dismissed') !== 'true';
    } catch {
      return false;
    }
  });
  const [activeProfile, setActiveProfile] = useState<EvoNarrativeProfile>('investigador');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [userPassport, setUserPassport] = useState<UserHardwarePassport | null>(() => {
    try {
      const raw = localStorage.getItem('evo_c01_specs');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Load saved profile & handle URL query parameters for direct PDF printing / magazine mode
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const vol = url.searchParams.get('volume');
      const viewParam = url.searchParams.get('view');
      if (viewParam === 'hotswap') {
        setCurrentView('hotswap-lab');
        setIsIntroActive(false);
      } else if (viewParam === 'matrix') {
        setCurrentView('windows-matrix-lab');
        setIsIntroActive(false);
      } else if (viewParam === 'core' || viewParam === 'lab-core') {
        setCurrentView('lab-core');
        setIsIntroActive(false);
      } else if (vol === '02') {
        setCurrentView('tomo-02');
        setIsIntroActive(false);
      } else if (vol === '03') {
        setCurrentView('tomo-03');
        setIsIntroActive(false);
      } else if (vol === '04') {
        setCurrentView('tomo-04');
      } else if (vol === '08') {
        setCurrentView('tomo-08');
        setIsIntroActive(false);
      } else if (viewParam === 'boot' || viewParam === 'boot-lab') {
        setCurrentView('boot-lab');
        setIsIntroActive(false);
      } else if (
        url.searchParams.get('print') === 'true' ||
        url.searchParams.get('mode') === 'magazine' ||
        url.searchParams.get('pdf') === 'true'
      ) {
        setCurrentView('magazine');
        setIsIntroActive(false);
      }
    } catch {
      // ignore
    }

    try {
      const savedProfile = localStorage.getItem('evo_narrative_profile') as EvoNarrativeProfile | null;
      if (savedProfile) {
        setActiveProfile(savedProfile);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync Tutor Location with currentView
  useEffect(() => {
    switch (currentView) {
      case 'world-map':
        updateLocation({
          academySection: 'MUNDO EVO',
          tomoNumber: undefined,
          tomoTitle: 'Academia EVO LABS',
          chapterTitle: undefined,
          activityTitle: 'Mapa Principal',
          activityType: 'mundo',
          whatIs: 'Centro principal de navegación y exploración de EVO LABS.',
          whatFor: 'Permite visualizar todos los 10 Tomos, acceder al recorrido guiado y retomar tu progreso.',
          currentAction: 'Seleccioná un Tomo de la colección o hacé clic en "Continuar mi recorrido".',
          whatToLookFor: 'Observá los 10 tomos organizados correlativamente con sus badges de estado.',
          whyItMatters: 'Comprender el mapa global de la Academia te ayuda a trazar tu plan de estudio sin perderte.',
          nextStep: 'Ingresá al Tomo 01 (Conocé tu PC) para aprender la base del silicio y componentes.',
        });
        saveCurrentLocationHistory('world-map', undefined, 'Mundo EVO');
        break;
      case 'cover':
        updateLocation({
          academySection: 'TOMOS EVO LABS',
          tomoNumber: '01',
          tomoTitle: 'CONOCÉ TU PC',
          chapterTitle: 'Portada',
          activityTitle: 'Tomo Interactivo',
          activityType: 'lectura',
          whatIs: 'Tomo 01: Conocé tu PC. El punto de partida de la formación.',
          whatFor: 'Aprender a identificar la arquitectura de tu máquina, procesador, memoria y métricas reales.',
          currentAction: 'Seleccioná un capítulo para comenzar o abrí el Magazine para lectura completa.',
          whatToLookFor: 'Los 7 capítulos progresivos y el Examen Final al completar el recorrido.',
          whyItMatters: 'Es la base obligatoria antes de diagnosticar fallas o reparar hardware.',
          nextStep: 'Comenzá por el Capítulo 01: ¿Qué PC tenés realmente?.',
        });
        saveCurrentLocationHistory('cover', '01', 'Portada');
        break;
      case 'index':
        updateLocation({
          academySection: 'TOMOS EVO LABS',
          tomoNumber: '01',
          tomoTitle: 'CONOCÉ TU PC',
          chapterTitle: 'Índice de Capítulos',
          activityTitle: 'Tomo Interactivo',
          activityType: 'lectura',
          whatIs: 'Tomo 01: Conocé tu PC. El punto de partida de la formación.',
          whatFor: 'Aprender a identificar la arquitectura de tu máquina, procesador, memoria y métricas reales.',
          currentAction: 'Seleccioná un capítulo para comenzar o abrí el Magazine para lectura completa.',
          whatToLookFor: 'Los 7 capítulos progresivos y el Examen Final al completar el recorrido.',
          whyItMatters: 'Es la base obligatoria antes de diagnosticar fallas o reparar hardware.',
          nextStep: 'Comenzá por el Capítulo 01: ¿Qué PC tenés realmente?.',
        });
        saveCurrentLocationHistory('index', '01', 'Índice de Capítulos');
        break;
      case 'chapter-01':
      case 'chapter-02':
      case 'chapter-03':
      case 'chapter-04':
      case 'chapter-05':
      case 'chapter-06':
      case 'chapter-07': {
        const chNum = currentView.replace('chapter-', '');
        updateLocation({
          academySection: 'TOMOS EVO LABS',
          tomoNumber: '01',
          tomoTitle: 'CONOCÉ TU PC',
          chapterTitle: `Capítulo ${chNum}`,
          activityTitle: 'Módulo Activo',
          activityType: 'practica',
          whatIs: `Capítulo ${chNum} del Tomo 01: aprendizaje guiado con teoría, prácticas y comprobaciones.`,
          whatFor: 'Dominar la materia del capítulo y generar evidencia pericial para desbloquear el siguiente.',
          currentAction: 'Leé el contenido, interactuá con las estaciones y completá la comprobación final.',
          whatToLookFor: 'Los bloques didácticos, las definiciones de conceptos y las métricas en tiempo real.',
          whyItMatters: 'Cada capítulo completado afianza tu pasaporte técnico y te prepara para el Examen Final.',
          nextStep: 'Completá la actividad para marcar el capítulo como completado.',
        });
        saveCurrentLocationHistory(currentView, '01', `Capítulo ${chNum}`);
        break;
      }
      case 'tomo01-quiz':
        updateLocation({
          academySection: 'EXAMEN FINAL INTERACTIVO',
          tomoNumber: '01',
          tomoTitle: 'CONOCÉ TU PC',
          chapterTitle: 'Examen de Comprobación Pericial',
          activityTitle: '15 Preguntas Técnicas',
          activityType: 'examen',
          whatIs: 'Examen Final interactivo y reutilizable del Tomo 01.',
          whatFor: 'Validar tu entendimiento real de hardware, telemetría y diagnósticos con 15 preguntas aleatorias.',
          currentAction: 'Respondé cada pregunta analizando las premisas y revisá tus respuestas antes de entregar.',
          whatToLookFor: 'Preguntas de elección simple, múltiple, secuencias, análisis de gráficos y casos de taller.',
          whyItMatters: 'Alcanzar el 75% o más otorga la distinción oficial "TEORÍA COMPROBADA".',
          nextStep: 'Revisá la devolución pericial y continuá al Laboratorio de Identidad y Hardware.',
        });
        saveCurrentLocationHistory('tomo01-quiz', '01', 'Examen Final Tomo 01');
        break;
      case 'tomo-02':
        updateLocation({
          academySection: 'TOMOS EVO LABS',
          tomoNumber: '02',
          tomoTitle: 'LA BIBLIA NEGRA DE WINDOWS',
          activityTitle: 'Ficha del Tomo',
          activityType: 'lectura',
          whatIs: 'Tomo 02: La Biblia Negra de Windows. El lado oscuro del sistema operativo.',
          whatFor: 'Comprender el kernel, registros, telemetría, servicios ocultos y auditoría de Windows.',
          currentAction: 'Leé el Magazine de 67 páginas, realizá las prácticas o rendí el Examen Final.',
          whyItMatters: 'Dominar Windows a nivel pericial te permite detectar cuellos de botella y fallas invisibles.',
          nextStep: 'Accedé al Laboratorio Virtual Guiado de Windows (Matrix Lab).',
        });
        saveCurrentLocationHistory('tomo-02', '02', 'La Biblia Negra de Windows');
        break;
      case 'tomo-03':
        updateLocation({
          academySection: 'TOMOS EVO LABS',
          tomoNumber: '03',
          tomoTitle: 'REPARACIÓN DE PC',
          activityTitle: 'Sistema Virtual Guiado',
          activityType: 'diagnostico',
          whatIs: 'Tomo 03: Reparación de PC. Diagnóstico metódico y resolución de averías.',
          whatFor: 'Aislar fallas de encendido, cuelgues, memorias defectuosas y fuentes de alimentación.',
          currentAction: 'Explorá los casos de taller, leé los procedimientos o rendí el Examen Final.',
          whyItMatters: 'Evita el cambio de piezas a ciegas aplicando el método de descarte pericial.',
          nextStep: 'Comprobá tu teoría en el Examen Final del Tomo 03.',
        });
        saveCurrentLocationHistory('tomo-03', '03', 'Reparación de PC');
        break;
      case 'tomo-04':
        updateLocation({
          academySection: 'TOMOS EVO LABS',
          tomoNumber: '04',
          tomoTitle: 'REPARACIÓN DE NOTEBOOKS',
          activityTitle: 'Sistema Virtual Guiado',
          activityType: 'diagnostico',
          whatIs: 'Tomo 04: Reparación de Notebooks. Diagnóstico de arquitecturas portátiles y circuitos de potencia.',
          whatFor: 'Comprender cargadores, chips EC/KBC, líneas de standby de 3.3V/5V y secuencias de encendido.',
          currentAction: 'Analizá los esquemáticos y casos de fallas en placas de notebooks.',
          whyItMatters: 'Las notebooks tienen arquitecturas compactas y fuentes conmutadas complejas.',
          nextStep: 'Rendí el Examen Final del Tomo 04.',
        });
        saveCurrentLocationHistory('tomo-04', '04', 'Reparación de Notebooks');
        break;
      case 'tomo-08':
      case 'boot-lab':
        updateLocation({
          academySection: 'LABORATORIOS EVO',
          tomoNumber: '08',
          tomoTitle: 'ARRANQUE Y DIAGNÓSTICO',
          activityTitle: 'Laboratorio de Arranque y Fallas Guiado',
          activityType: 'laboratorio',
          whatIs: 'Laboratorio del Tomo 08: Del botón POWER al escritorio de Windows paso a paso.',
          whatFor: 'Aprender la secuencia de señales de hardware, POST, inicialización UEFI y carga del kernel.',
          currentAction: 'Provocá fallas en cada etapa de arranque y observá la telemetría y códigos de error.',
          whyItMatters: 'Comprender el arranque te permite aislar en qué segundo exacto muere una máquina.',
          nextStep: 'Rendí el Examen Final del Tomo 08 para validar tus conocimientos.',
        });
        saveCurrentLocationHistory(currentView, '08', 'Laboratorio de Arranque');
        break;
      case 'hotswap-lab':
        updateLocation({
          academySection: 'LABORATORIOS EVO',
          tomoNumber: '01',
          tomoTitle: 'CONOCÉ TU PC',
          activityTitle: 'Laboratorio Virtual de Identidad y Hardware',
          activityType: 'laboratorio',
          whatIs: 'El banco interactivo de hardware del Tomo 01.',
          whatFor: 'Intercambiar CPUs, GPUs, RAMs y discos para observar en tiempo real cuellos de botella y telemetría.',
          currentAction: 'Cambiá componentes, ejecutá simulaciones de carga y analizá el frametime.',
          whyItMatters: 'Permite experimentar sin riesgo de quemar silicio real.',
          nextStep: 'Comprobá el impacto de las configuraciones en el rendimiento general.',
        });
        saveCurrentLocationHistory('hotswap-lab', '01', 'Laboratorio de Identidad y Hardware');
        break;
      case 'windows-matrix-lab':
        updateLocation({
          academySection: 'LABORATORIOS EVO',
          tomoNumber: '02',
          tomoTitle: 'LA BIBLIA NEGRA DE WINDOWS',
          activityTitle: 'Laboratorio Virtual Guiado de Windows',
          activityType: 'laboratorio',
          whatIs: 'Laboratorio de auditoría de Windows del Tomo 02.',
          whatFor: 'Inspeccionar procesos, servicios, registros y telemetría en escenarios controlados.',
          currentAction: 'Elegí un escenario de diagnóstico e investigá las anomalías de sistema.',
          whyItMatters: 'Te capacita para resolver problemas avanzados de sistema operativo.',
          nextStep: 'Validá los hallazgos periciales con los comandos recomendados.',
        });
        saveCurrentLocationHistory('windows-matrix-lab', '02', 'Matrix Lab Windows');
        break;
      case 'lab-core':
        updateLocation({
          academySection: 'TALLER DE CASOS Y EXPEDIENTES',
          activityTitle: 'Banco de Diagnóstico Multitomo',
          activityType: 'diagnostico',
          whatIs: 'Taller pericial donde se combinan hardware, sistema y telemetría en casos reales.',
          whatFor: 'Resolver expedientes complejos de clientes y auditorías de taller.',
          currentAction: 'Seleccioná un caso abierto, armá la PC de pruebas o diagnosticá la máquina cliente.',
          whyItMatters: 'Es el entorno pericial donde aplicás todo lo aprendido en los 10 Tomos.',
          nextStep: 'Completá el expediente y emití el informe pericial.',
        });
        saveCurrentLocationHistory('lab-core', undefined, 'Taller Multitomo');
        break;
      case 'magazine':
        updateLocation({
          academySection: 'MAGAZINE A4',
          tomoNumber: '01',
          tomoTitle: 'CONOCÉ TU PC',
          activityTitle: 'Edición Editorial Descargable',
          activityType: 'lectura',
          whatIs: 'Revista técnica editorial oficial del Tomo 01 en formato A4 de alta calidad.',
          whatFor: 'Lectura pausada, comprensión profunda y descarga para tu biblioteca offline.',
          currentAction: 'Navegá las páginas con las flechas, usá el índice o descargá el archivo.',
          whyItMatters: 'Leer y entender es el primer paso indispensable del Método EVO.',
          nextStep: 'Pasá al Tomo Interactivo para realizar las prácticas guiadas.',
        });
        saveCurrentLocationHistory('magazine', '01', 'Magazine Editorial A4');
        break;
      default:
        break;
    }
  }, [currentView, updateLocation, saveCurrentLocationHistory]);

  // Navigation target station for Chapter 02
  const [c02TargetStation, setC02TargetStation] = useState<Chapter02Station | undefined>(undefined);

  // Locked chapter modal state
  const [lockedRequirements, setLockedRequirements] = useState<ChapterRequirementInfo | null>(null);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  // Celebration modal state
  const [celebrationData, setCelebrationData] = useState<{
    completedNumber: string;
    completedTitle: string;
    unlockedNumber: string;
    unlockedTitle: string;
  } | null>(null);

  // Refresh chapters function
  const computeChaptersList = (): ChapterItem[] => {
    try {
      const isC01Done = isChapter01Complete();
      const isC02Unlocked = localStorage.getItem('evo_c02_unlocked') === 'true' || isC01Done;
      const isC02Completed = isChapter02Complete();
      const isC03Completed = isChapter03Complete();
      const isC03Unlocked = isC02Completed;
      const isC04Completed = isChapter04Complete();
      const isC04Unlocked = isC03Completed || localStorage.getItem('evo_c04_unlocked') === 'true';
      const isC05Completed = isChapter05Complete();
      const isC05Unlocked = isC04Completed || localStorage.getItem('evo_c05_unlocked') === 'true';
      const isC06Completed = isChapter06Complete();
      const isC06Unlocked = isC05Completed || localStorage.getItem('evo_c06_unlocked') === 'true';
      const isC07Completed = isChapter07Complete();
      const isC07Unlocked = isC06Completed;

      return TOMO_01_CHAPTERS.map((c) => {
        if (c.number === '01') {
          return { ...c, status: isC01Done ? ('COMPLETADO' as const) : ('DISPONIBLE' as const) };
        }
        if (c.number === '02') {
          if (isC02Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC02Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '03') {
          if (isC03Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC03Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '04') {
          if (isC04Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC04Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '05') {
          if (isC05Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC05Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '06') {
          if (isC06Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC06Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        if (c.number === '07') {
          if (isC07Completed) return { ...c, status: 'COMPLETADO' as const };
          if (isC07Unlocked) return { ...c, status: 'DISPONIBLE' as const };
          return { ...c, status: 'BLOQUEADO' as const };
        }
        return { ...c, status: 'BLOQUEADO' as const };
      });
    } catch {
      return TOMO_01_CHAPTERS;
    }
  };

  const [chaptersList, setChaptersList] = useState<ChapterItem[]>(computeChaptersList);

  useEffect(() => {
    const handleStorage = () => {
      setChaptersList(computeChaptersList());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const isChapter02Unlocked = chaptersList.find((c) => c.number === '02')?.status !== 'BLOQUEADO';

  const handleOpenEdition = () => {
    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter01 = () => {
    setCurrentView('chapter-01');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter02 = () => {
    setC02TargetStation(undefined);
    setCurrentView('chapter-02');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter03 = () => {
    setCurrentView('chapter-03');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter04 = () => {
    setCurrentView('chapter-04');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter05 = () => {
    setCurrentView('chapter-05');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter06 = () => {
    setCurrentView('chapter-06');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter07 = () => {
    setCurrentView('chapter-07');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToIndex = () => {
    setChaptersList(computeChaptersList());
    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLockedChapter = (chapter: ChapterItem) => {
    const req = getChapterRequirements(chapter.number, chaptersList);
    setLockedRequirements(req);
    setIsLockedModalOpen(true);
  };

  const handleGoToMissing = (targetChapterNumber: string, targetStationOrSection?: string) => {
    setIsLockedModalOpen(false);

    if (targetChapterNumber === '01') {
      setCurrentView('chapter-01');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '02') {
      if (targetStationOrSection) {
        setC02TargetStation(targetStationOrSection as Chapter02Station);
      }
      setCurrentView('chapter-02');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '03') {
      setCurrentView('chapter-03');
      if (targetStationOrSection) {
        setTimeout(() => {
          const el = document.getElementById(targetStationOrSection);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (targetChapterNumber === '04') {
      setCurrentView('chapter-04');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '05') {
      setCurrentView('chapter-05');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '06') {
      setCurrentView('chapter-06');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetChapterNumber === '07') {
      setCurrentView('chapter-07');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView('index');
  };

  const handleChapterCompleted = () => {
    try {
      localStorage.setItem('evo_c02_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '01',
      completedTitle: 'CONOCÉ TU PC',
      unlockedNumber: '02',
      unlockedTitle: 'CÓMO TRABAJAN JUNTOS',
    });

    setActiveNotice(
      '¡Capítulo 01 completado! Se ha generado tu Pasaporte EVO y desbloqueado el Capítulo 02: CÓMO TRABAJAN JUNTOS.'
    );

    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChapter02Completed = () => {
    try {
      localStorage.setItem('evo_c02_status', 'completed');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '02',
      completedTitle: 'CÓMO TRABAJAN JUNTOS',
      unlockedNumber: '03',
      unlockedTitle: 'CUANDO LOS FPS MIENTEN',
    });

    setActiveNotice(
      '¡Capítulo 02 completado! Se ha consolidado tu Mapa de Flujo 001 y desbloqueado el Capítulo 03: CUANDO LOS FPS MIENTEN.'
    );
  };

  const handleChapter03Completed = () => {
    try {
      localStorage.setItem('evo_c03_status', 'completed');
      localStorage.setItem('evo_c04_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '03',
      completedTitle: 'CUANDO LOS FPS MIENTEN',
      unlockedNumber: '04',
      unlockedTitle: 'ENCONTRÁ EL LÍMITE',
    });

    setActiveNotice(
      '¡Capítulo 03 completado! Se ha generado tu Perfil de Fluidez EVO 001 y desbloqueado el Capítulo 04: ENCONTRÁ EL LÍMITE.'
    );
  };

  const handleChapter04Completed = () => {
    try {
      localStorage.setItem('evo_c04_status', 'completed');
      localStorage.setItem('evo_c05_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '04',
      completedTitle: 'ENCONTRÁ EL LÍMITE',
      unlockedNumber: '05',
      unlockedTitle: 'WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO',
    });

    setActiveNotice(
      '¡Capítulo 04 completado! Se ha consolidado tu Matriz de Limitación EVO 001 y desbloqueado el Capítulo 05.'
    );
  };

  const handleChapter05Completed = () => {
    try {
      localStorage.setItem('evo_c05_status', 'completed');
      localStorage.setItem('evo_c06_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '05',
      completedTitle: 'WINDOWS TAMBIÉN ES HARDWARE EN MOVIMIENTO',
      unlockedNumber: '06',
      unlockedTitle: 'TALLER EVO // DIAGNÓSTICO EN PROFUNDIDAD',
    });

    setActiveNotice(
      '¡Capítulo 05 completado! Se han consolidado tus Artefactos de Optimización Controlada.'
    );
  };

  const handleChapter06Completed = () => {
    try {
      localStorage.setItem('evo_c06_status', 'completed');
      localStorage.setItem('evo_c07_unlocked', 'true');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setCelebrationData({
      completedNumber: '06',
      completedTitle: 'TALLER EVO // ENCONTRÁ LA FALLA',
      unlockedNumber: '07',
      unlockedTitle: 'LABORATORIO FINAL // OPTIMIZACIÓN A/B',
    });

    setActiveNotice(
      '¡Capítulo 06 completado! Se ha consolidado tu Expediente de Diagnóstico EVO 001 y desbloqueado el Capítulo 07.'
    );
  };

  const handleChapter07Completed = () => {
    try {
      localStorage.setItem('evo_c07_status', 'completed');
      localStorage.setItem('evo_tome01_status', 'completed');
    } catch {
      // ignore
    }

    setChaptersList(computeChaptersList());

    setActiveNotice(
      '¡Capítulo 07 completado! Se ha generado tu Informe de Laboratorio EVO 001 y el Dossier del Tomo 01.'
    );
  };

  const handleStartFinalExam = () => {
    setCurrentView('tomo01-quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompletionScreen = () => {
    setCurrentView('tomo01-completion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteExam = (score: number, total: number) => {
    setChaptersList(computeChaptersList());
    if (score >= 5) {
      setCelebrationData({
        completedNumber: 'TOMO 01',
        completedTitle: 'CONOCÉ TU PC // CERTIFICACIÓN EVO',
        unlockedNumber: 'LAB',
        unlockedTitle: 'BANCO DE SILICIO & TELEMETRÍA (HOT-SWAP LAB)',
      });
      setActiveNotice(
        `¡Prueba Final superada con ${score}/${total}! Tomo 01 acreditado con éxito. Habilitado el entorno práctico de laboratorio.`
      );
    }
  };

  const handleEnterZone = (zone: EvoLabZone) => {
    if (zone.id === 'zona-3') {
      setCurrentView('archivo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveNotice(
        `Sector ${zone.number} // ${zone.title}: Este sector está siendo preparado con 3 módulos de investigación.`
      );
    }
  };

  const handleOpenVolume = (volume: (typeof VOLUMES_COLLECTION)[0]) => {
    if (volume.id === 'tomo-01') {
      handleOpenEdition();
    } else if (volume.id === 'tomo-02') {
      setCurrentView('tomo-02');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (volume.id === 'tomo-03') {
      setCurrentView('tomo-03');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (volume.id === 'tomo-04') {
      setCurrentView('tomo-04');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateHome = () => {
    setCampusSection('campus');
    setCurrentView('world-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCampusSection = (
    section: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso'
  ) => {
    setCampusSection(section);
    setCurrentView('world-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateArchive = () => {
    setCurrentView('archivo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTomo01 = () => {
    setCurrentView('cover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTomo02 = () => {
    setCurrentView('tomo-02');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTomo03 = () => {
    setCurrentView('tomo-03');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTomo04 = () => {
    setCurrentView('tomo-04');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTomo01 = () => {
    setCurrentView('index');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeProfile = (newProfile: EvoNarrativeProfile) => {
    setActiveProfile(newProfile);
    try {
      localStorage.setItem('evo_narrative_profile', newProfile);
    } catch {
      // ignore
    }
  };

  const handleOpenLiveScanAudit = async () => {
    setIsScanningIntegrity(true);
    setShowIntegrityModal(true);
    try {
      const result = await TelemetryIntegrityService.scanAndValidateLiveEndpoint();
      setLiveScanResult(result);
    } catch (err) {
      console.error('[App] Error comparing telemetry against allowed components:', err);
    } finally {
      setIsScanningIntegrity(false);
    }
  };

  const handleOpenCaseHistory = () => {
    setCaseHistoryList(EvoCaseRepository.getAllCases());
    setShowCaseHistoryModal(true);
  };

  const handleNavigateHotSwapLab = (subPanel?: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'all') => {
    if (subPanel) {
      setActiveLabPanel(subPanel);
    }
    setCurrentView('hotswap-lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLabCore = (phase?: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE') => {
    if (phase) {
      setLabCorePhase(phase);
    }
    setCurrentView('lab-core');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedChaptersCount = chaptersList.filter((c) => c.status === 'COMPLETADO').length;

  const dossierSummary: Tome01DossierSummary = {
    passport: Boolean(localStorage.getItem('evo_c01_specs')),
    flowMap: localStorage.getItem('evo_c02_status') === 'completed',
    fluidezProfile: localStorage.getItem('evo_c03_status') === 'completed',
    limitMatrix: localStorage.getItem('evo_c04_status') === 'completed',
    activityMap: localStorage.getItem('evo_c05_status') === 'completed',
    optimizationLog: (() => {
      try {
        const rawCases = localStorage.getItem('evo_c06_cases');
        if (rawCases) {
          const parsed = JSON.parse(rawCases);
          return Array.isArray(parsed) && parsed.some((c: any) => c?.completed === true);
        }
        return false;
      } catch {
        return false;
      }
    })(),
    diagnosticCase:
      localStorage.getItem('evo_c07_status') === 'completed' ||
      Boolean(localStorage.getItem('evo_c07_report')),
    labReport:
      localStorage.getItem('evo_c07_status') === 'completed' ||
      Boolean(localStorage.getItem('evo_c07_report')),
    allCompleted: completedChaptersCount >= 7,
  };

  if (isIntroActive) {
    return (
      <EvoIntroExperience
        onEnterCampus={() => {
          setIsIntroActive(false);
          setCampusSection('campus');
          setCurrentView('world-map');
        }}
        onStartTomo01={() => {
          setIsIntroActive(false);
          setCurrentView('magazine');
        }}
        onSkipAndRemember={() => {
          try {
            localStorage.setItem('evo_academia_intro_dismissed', 'true');
          } catch {
            // ignore
          }
          setIsIntroActive(false);
          setCampusSection('campus');
          setCurrentView('world-map');
        }}
        onComplete={() => {
          setIsIntroActive(false);
          setCampusSection('campus');
          setCurrentView('world-map');
        }}
        onSkip={() => {
          setIsIntroActive(false);
          setCampusSection('campus');
          setCurrentView('world-map');
        }}
      />
    );
  }

  const handleNavigateTomo = (tomo: string) => {
    if (tomo === '01' || tomo === 'tomo-01') setCurrentView('cover');
    else if (tomo === '02' || tomo === 'tomo-02') setCurrentView('tomo-02');
    else if (tomo === '03' || tomo === 'tomo-03') setCurrentView('tomo-03');
    else if (tomo === '04' || tomo === 'tomo-04') setCurrentView('tomo-04');
    else if (tomo === '08' || tomo === 'tomo-08') setCurrentView('tomo-08');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateTomo08 = () => {
    setCurrentView('tomo-08');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateBootLab = () => {
    setCurrentView('boot-lab');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenForensicBench = (target: ForensicBenchTarget) => {
    if (target.labView === 'boot-lab') {
      setCurrentView('boot-lab');
      setActiveNotice(`Cargando Laboratorio de Arranque y Fallas: ${target.moduleNumber}`);
    } else if (target.labView === 'windows-matrix') {
      setMatrixInitialScenario(target.scenario);
      setCurrentView('windows-matrix-lab');
      setActiveNotice(`Cargando banco de pruebas de Kernel NT: ${target.moduleNumber} (${target.scenario || 'Diagnóstico'})`);
    } else if (target.labView === 'hotswap-lab') {
      setCurrentView('hotswap-lab');
      setActiveNotice(`Cargando Banco Hot-Swap de Hardware: ${target.moduleNumber} (${target.scenario || 'Diagnóstico'})`);
    } else {
      setCurrentView('hotswap-lab');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f4f4f6] flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Streamlined Clean Header with Upper Navigation Bar */}
      <Header
        currentView={currentView}
        campusSection={campusSection}
        activeLabPanel={activeLabPanel}
        activeLabMission={activeLabMission}
        onNavigateHome={handleNavigateHome}
        onNavigateCampusSection={handleNavigateCampusSection}
        onNavigateArchive={handleNavigateArchive}
        onNavigateTomo01={handleNavigateTomo01}
        onNavigateTomo02={handleNavigateTomo02}
        onNavigateTomo03={handleNavigateTomo03}
        onNavigateTomo04={handleNavigateTomo04}
        onNavigateTomo05={() => setDossierModalTomoId('tomo-05')}
        onNavigateTomo06={() => setDossierModalTomoId('tomo-06')}
        onNavigateTomo08={handleNavigateTomo08}
        onNavigateBootLab={handleNavigateBootLab}
        onNavigateMagazine={() => setCurrentView('magazine')}
        onNavigateHotSwapLab={handleNavigateHotSwapLab}
        onNavigateLabCore={handleNavigateLabCore}
        onNavigateWindowsMatrixLab={() => {
          setMatrixInitialScenario(undefined);
          setCurrentView('windows-matrix-lab');
        }}
        onOpenDiscoveryModal={() => setShowDiscoveryModal(true)}
        onOpenCoverageDashboard={() => setShowCoverageDashboard(true)}
        onOpenCaseHistory={handleOpenCaseHistory}
        onOpenLiveScanAudit={handleOpenLiveScanAudit}
        onOpenForensicBench={handleOpenForensicBench}
        activeProfile={activeProfile}
        onReplayIntro={() => setIsIntroActive(true)}
        onHardwareDetected={(passport) => setUserPassport(passport)}
        dossierModalTomoId={dossierModalTomoId}
        onCloseDossierModal={() => setDossierModalTomoId(null)}
      />

      {/* Orientación Permanente: Tutor Breadcrumb Bar */}
      <TutorBreadcrumbBar />

      {/* Main Body Container */}
      <div className="flex-1 min-h-screen flex flex-col relative">
        {/* Subtle Ambient Workspace Top Glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[380px] pointer-events-none opacity-40 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 300px at 50% 0%, rgba(251, 191, 36, 0.05), transparent 70%)',
          }}
        />

        {/* Main View Render Stage */}
        <main className="flex-1 w-full">
          {currentView === 'magazine' && (
            <EvoMagazineView
              onBackToApp={handleNavigateTomo01}
              onBackToTomo01={handleNavigateTomo01}
              onOpenInteractive={handleExploreTomo01}
              onOpenLab={handleNavigateHotSwapLab}
            />
          )}

          {currentView === 'tomo-02' && (
            <Tomo02MagazineView
              onBackToApp={handleNavigateHome}
              onNavigateTomo={handleNavigateTomo}
              onOpenLab={() => {
                setCurrentView('windows-matrix-lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentView === 'tomo-03' && (
            <Tomo03MagazineView
              onBackToApp={handleNavigateHome}
              onNavigateTomo={handleNavigateTomo}
            />
          )}

          {currentView === 'tomo-04' && (
            <Tomo04MagazineView
              onBackToApp={handleNavigateHome}
              onNavigateTomo={handleNavigateTomo}
            />
          )}

          {currentView === 'tomo-08' && (
            <Tomo08MagazineView
              onBackToApp={handleNavigateHome}
              onNavigateTomo={handleNavigateTomo}
              onOpenLab={handleNavigateBootLab}
            />
          )}

          {currentView === 'boot-lab' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
              <EvoBootLab
                onClose={handleNavigateHome}
                onOpenTomo08={handleNavigateTomo08}
              />
            </div>
          )}

          {currentView === 'lab-core' && (
            <EvoLabCore
              initialPhase={labCorePhase}
              initialMission={activeLabMission}
              onNavigateToTomo={handleNavigateTomo}
              onOpenGlobalAutoDetectModal={() => {
                const event = new CustomEvent('evo_open_autodetect');
                window.dispatchEvent(event);
              }}
              onExitToWorld={handleNavigateHome}
            />
          )}

          {currentView === 'windows-matrix-lab' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
              <EvoWindowsMatrixLab
                initialScenario={matrixInitialScenario}
                onNavigateToHardwareBench={() => {
                  setActiveLabPanel('hardware');
                  setCurrentView('hotswap-lab');
                }}
                onOpenTomo={handleNavigateTomo}
              />
            </div>
          )}

          {currentView === 'hotswap-lab' && (
            <EvoMasterLabSuite
              initialPanel={activeLabPanel}
              onNavigateTomo={handleNavigateTomo}
              onNavigateHome={handleNavigateHome}
              passport={userPassport}
            />
          )}

          {currentView === 'world-map' && (
            <EvoWorldMap
              initialIntention={campusSection}
              onOpenIntroPresentation={() => setIsIntroActive(true)}
              passport={userPassport}
              completedChaptersCount={completedChaptersCount}
              onEnterZone={handleEnterZone}
              activeProfile={activeProfile}
              onChangeProfile={handleChangeProfile}
              onOpenTomo={handleNavigateTomo}
              onNavigateBootLab={handleNavigateBootLab}
              onNavigateHotSwapLab={handleNavigateHotSwapLab}
              onNavigateWindowsMatrixLab={(scenario) => {
                setMatrixInitialScenario(scenario);
                setCurrentView('windows-matrix-lab');
              }}
              onNavigateLabCore={handleNavigateLabCore}
              onOpenForensicBench={handleOpenForensicBench}
              onOpenDossier={(tomoId) => setDossierModalTomoId(tomoId)}
              onNavigateMagazine={() => setCurrentView('magazine')}
              onNavigateTomo01={handleNavigateTomo01}
              onOpenCaseHistory={handleOpenCaseHistory}
            />
          )}

          {currentView === 'archivo' && (
            <EvoArchiveEntrance
              dossierSummary={dossierSummary}
              onEnterTome01={handleExploreTomo01}
              onEnterMagazine={() => setCurrentView('magazine')}
              onEnterTome02={handleNavigateTomo02}
              onEnterTome03={handleNavigateTomo03}
              onEnterTome04={handleNavigateTomo04}
              onEnterTome08={handleNavigateTomo08}
              onEnterBootLab={handleNavigateBootLab}
              onBackToMap={handleNavigateHome}
            />
          )}

          {currentView === 'cover' && (
            <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-6">
              <MagazineCover
                headlines={TOMO_01_HEADLINES}
                onOpenEdition={handleOpenEdition}
                onOpenA4Magazine={() => setCurrentView('magazine')}
                onBackToWorldMap={handleNavigateHome}
              />
              <HorizontalCollection
                volumes={VOLUMES_COLLECTION}
                onOpenVolume={handleOpenVolume}
              />
            </div>
          )}

          {currentView === 'index' && (
            <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12">
              <EditorialIndex
                chapters={chaptersList}
                outcomes={TOMO_01_OUTCOMES}
                onBackToCover={handleNavigateTomo01}
                onOpenA4Magazine={() => setCurrentView('magazine')}
                onOpenLab={handleNavigateHotSwapLab}
                onBackToWorldMap={handleNavigateHome}
                onStartResearch={handleStartChapter01}
                onStartChapter02={handleStartChapter02}
                onStartChapter03={handleStartChapter03}
                onStartChapter04={handleStartChapter04}
                onStartChapter05={handleStartChapter05}
                onStartChapter06={handleStartChapter06}
                onStartChapter07={handleStartChapter07}
                onSelectLockedChapter={handleSelectLockedChapter}
                onStartFinalExam={handleStartFinalExam}
                onOpenCompletionScreen={handleOpenCompletionScreen}
              />
            </div>
          )}

          {currentView === 'chapter-01' && (
            <Chapter01View
              onBackToIndex={handleBackToIndex}
              onChapterCompleted={handleChapterCompleted}
              isChapter02Unlocked={!!isChapter02Unlocked}
              onStartChapter02={handleStartChapter02}
            />
          )}

          {currentView === 'chapter-02' && (
            <Chapter02View
              onBackToIndex={handleBackToIndex}
              onChapterCompleted={handleChapter02Completed}
              initialStation={c02TargetStation}
              onOpenChapter01={handleStartChapter01}
              onOpenChapter03={handleStartChapter03}
            />
          )}

          {currentView === 'chapter-03' && (
            <Chapter03View
              onBackToIndex={handleBackToIndex}
              onOpenChapter02={handleStartChapter02}
              onOpenChapter04={handleStartChapter04}
              onChapterCompleted={handleChapter03Completed}
            />
          )}

          {currentView === 'chapter-04' && (
            <Chapter04View
              onBackToIndex={handleBackToIndex}
              onOpenChapter03={handleStartChapter03}
              onOpenChapter05={handleStartChapter05}
              onChapterCompleted={handleChapter04Completed}
            />
          )}

          {currentView === 'chapter-05' && (
            <Chapter05View
              onBackToIndex={handleBackToIndex}
              onOpenChapter04={handleStartChapter04}
              onOpenChapter06={handleStartChapter06}
              onChapterCompleted={handleChapter05Completed}
            />
          )}

          {currentView === 'chapter-06' && (
            <Chapter06View
              onBackToIndex={handleBackToIndex}
              onOpenChapter05={handleStartChapter05}
              onOpenChapter07={handleStartChapter07}
              onChapterCompleted={handleChapter06Completed}
            />
          )}

          {currentView === 'chapter-07' && (
            <Chapter07View
              onBackToIndex={handleBackToIndex}
              onOpenChapter06={handleStartChapter06}
              onGoToFinalExam={handleStartFinalExam}
              onChapterCompleted={handleChapter07Completed}
            />
          )}

          {currentView === 'tomo01-quiz' && (
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <EvoTomo01FinalExam
                onBackToIndex={handleBackToIndex}
                onBackToTomoCover={handleNavigateTomo01}
                onGoToChapter={(ch) => handleGoToMissing(ch)}
                onCompleteExam={handleCompleteExam}
                onContinueToLab={() => {
                  setActiveLabPanel('hardware');
                  setCurrentView('hotswap-lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {currentView === 'tomo01-completion' && (
            <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-6">
              <EvoTomo01CompletionScreen
                onBackToIndex={handleBackToIndex}
                onGoToLab={() => {
                  setActiveLabPanel('hardware');
                  setCurrentView('hotswap-lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToCampusFormation={() => handleNavigateCampusSection('escuela')}
                onGoToProgress={() => handleNavigateCampusSection('progreso')}
                onReviewExam={handleStartFinalExam}
              />
            </div>
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-zinc-800/60 py-6 bg-[#06070a] text-zinc-500 text-xs font-mono-tech mt-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 inline-block" />
              <span className="font-display font-bold text-white uppercase tracking-tight">
                EVO LABS
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Plataforma Editorial & Laboratorio de Silicio</span>
            </div>
            <div className="text-zinc-500 text-[11px] tracking-wider uppercase">
              METROLOGÍA EMPÍRICA // HARDWARE & KERNEL NT
            </div>
          </div>
        </footer>
      </div>

      {/* Global Modals from Navigation */}
      <EvoHardwareDiscoveryModal
        isOpen={showDiscoveryModal}
        onClose={() => setShowDiscoveryModal(false)}
        onComponentIncorporated={() => {
          setActiveNotice('Componente incorporado al catálogo de silicio con éxito.');
        }}
      />

      <CatalogCoverageDashboard
        isOpen={showCoverageDashboard}
        onClose={() => setShowCoverageDashboard(false)}
      />

      <EvoTelemetryIntegrityModal
        isOpen={showIntegrityModal}
        onClose={() => setShowIntegrityModal(false)}
        integrityResult={liveScanResult}
        isLoading={isScanningIntegrity}
        onReScan={handleOpenLiveScanAudit}
        onApplyMachine={() => {
          setShowIntegrityModal(false);
          setCurrentView('lab-core');
        }}
      />

      {/* Case History Dossier Modal */}
      {showCaseHistoryModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-zinc-700 bg-[#0e1219] shadow-2xl flex flex-col font-mono-tech overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#080a0d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base uppercase">
                  EXPEDIENTES Y CASOS REGISTRADOS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCaseHistoryModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {caseHistoryList.length === 0 ? (
                <div className="text-center p-8 text-zinc-500">
                  Aún no se han completado expedientes en esta sesión.
                </div>
              ) : (
                caseHistoryList.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-[#121620] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{c.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs font-sans-editorial">{c.summary}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Locked Chapter Modal */}
      <LockedChapterModal
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        requirements={lockedRequirements}
        onGoToMissing={handleGoToMissing}
      />

      {/* Celebration Modal */}
      {celebrationData && (
        <ChapterUnlockedCelebrationModal
          isOpen={!!celebrationData}
          onClose={() => setCelebrationData(null)}
          completedChapterNumber={celebrationData.completedNumber}
          completedChapterTitle={celebrationData.completedTitle}
          unlockedChapterNumber={celebrationData.unlockedNumber}
          unlockedChapterTitle={celebrationData.unlockedTitle}
          onOpenNextChapter={() => {
            if (celebrationData.unlockedNumber === '02') {
              handleStartChapter02();
            } else if (celebrationData.unlockedNumber === '03') {
              handleStartChapter03();
            } else if (celebrationData.unlockedNumber === '04') {
              handleStartChapter04();
            } else if (celebrationData.unlockedNumber === '05') {
              handleStartChapter05();
            } else if (celebrationData.unlockedNumber === '06') {
              handleStartChapter06();
            } else if (celebrationData.unlockedNumber === '07') {
              handleStartChapter07();
            } else {
              handleBackToIndex();
            }
          }}
        />
      )}

      {/* Subtle Toast / Notification */}
      {activeNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#16171d] border border-yellow-400 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 text-xs font-mono-tech animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-yellow-400 block mb-1">
              EVO LABS // EXPEDIENTE ACTUALIZADO
            </span>
            <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
              {activeNotice}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveNotice(null)}
            className="text-zinc-400 hover:text-white cursor-pointer p-1"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {/* TUTOR EVO: Sistema de Acompañamiento Global */}
      <TutorEvoFloatingButton />
      <TutorEvoDrawer />
      <TutorOnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <TutorEvoProvider>
      <AppContent />
    </TutorEvoProvider>
  );
}
