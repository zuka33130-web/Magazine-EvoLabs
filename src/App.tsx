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
import { CheckCircle2, X, History } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'magazine' | 'tomo-02' | 'tomo-03' | 'tomo-04' | 'world-map' | 'archivo' | 'cover' | 'index' | 'chapter-01' | 'chapter-02' | 'chapter-03' | 'chapter-04' | 'chapter-05' | 'chapter-06' | 'chapter-07' | 'hotswap-lab' | 'windows-matrix-lab' | 'lab-core'
  >('lab-core');

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

  const [isIntroActive, setIsIntroActive] = useState<boolean>(false);
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
      const isC01Done =
        Boolean(localStorage.getItem('evo_c01_completed')?.length) ||
        Boolean(localStorage.getItem('evo_c01_specs'));
      const isC02Unlocked = localStorage.getItem('evo_c02_unlocked') === 'true' || isC01Done;
      const isC02Completed = localStorage.getItem('evo_c02_status') === 'completed';
      const isC03Completed = localStorage.getItem('evo_c03_status') === 'completed';
      const isC03Unlocked = isC02Completed;
      const isC04Completed = localStorage.getItem('evo_c04_status') === 'completed';
      const isC04Unlocked = isC03Completed || localStorage.getItem('evo_c04_unlocked') === 'true';
      const isC05Completed = localStorage.getItem('evo_c05_status') === 'completed';
      const isC05Unlocked = isC04Completed || localStorage.getItem('evo_c05_unlocked') === 'true';

      let isC06Completed = false;
      try {
        const rawCases = localStorage.getItem('evo_c06_cases');
        if (rawCases) {
          const parsed = JSON.parse(rawCases);
          if (Array.isArray(parsed)) {
            isC06Completed = parsed.some(
              (c: any) => c && c.completed === true && c.status !== 'INVESTIGANDO'
            );
          }
        }
      } catch {
        isC06Completed = false;
      }

      if (!isC06Completed) {
        if (localStorage.getItem('evo_c06_status') === 'completed') {
          localStorage.removeItem('evo_c06_status');
        }
        if (localStorage.getItem('evo_c07_unlocked') === 'true') {
          localStorage.removeItem('evo_c07_unlocked');
        }
      }

      const isC06Unlocked = isC05Completed || localStorage.getItem('evo_c06_unlocked') === 'true';
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
          const isC07Completed =
            localStorage.getItem('evo_c07_status') === 'completed' ||
            Boolean(localStorage.getItem('evo_c07_report'));
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
        onComplete={(selectedProfile) => {
          if (selectedProfile) {
            handleChangeProfile(selectedProfile);
          }
          try {
            localStorage.setItem('evo_intro_seen', 'true');
          } catch {
            // ignore
          }
          setIsIntroActive(false);
          setCurrentView('magazine');
        }}
        onSkip={() => {
          try {
            localStorage.setItem('evo_intro_seen', 'true');
          } catch {
            // ignore
          }
          setIsIntroActive(false);
          setCurrentView('magazine');
        }}
      />
    );
  }

  const handleNavigateTomo = (tomo: '01' | '02' | '03' | '04') => {
    if (tomo === '01') setCurrentView('magazine');
    else if (tomo === '02') setCurrentView('tomo-02');
    else if (tomo === '03') setCurrentView('tomo-03');
    else if (tomo === '04') setCurrentView('tomo-04');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenForensicBench = (target: ForensicBenchTarget) => {
    if (target.labView === 'windows-matrix') {
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
        activeLabPanel={activeLabPanel}
        activeLabMission={activeLabMission}
        onNavigateHome={handleNavigateHome}
        onNavigateArchive={handleNavigateArchive}
        onNavigateTomo01={handleNavigateTomo01}
        onNavigateTomo02={handleNavigateTomo02}
        onNavigateTomo03={handleNavigateTomo03}
        onNavigateTomo04={handleNavigateTomo04}
        onNavigateTomo05={() => setDossierModalTomoId('tomo-05')}
        onNavigateTomo06={() => setDossierModalTomoId('tomo-06')}
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
            <EvoMagazineView onBackToApp={handleNavigateHome} />
          )}

          {currentView === 'tomo-02' && (
            <Tomo02MagazineView
              onBackToApp={handleNavigateHome}
              onNavigateTomo={handleNavigateTomo}
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
              passport={userPassport}
              completedChaptersCount={completedChaptersCount}
              onEnterZone={handleEnterZone}
              activeProfile={activeProfile}
              onChangeProfile={handleChangeProfile}
              onOpenTomo={handleNavigateTomo}
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
                onBackToCover={() => setCurrentView('archivo')}
                onOpenA4Magazine={() => setCurrentView('magazine')}
                onBackToWorldMap={handleNavigateHome}
                onStartResearch={handleStartChapter01}
                onStartChapter02={handleStartChapter02}
                onStartChapter03={handleStartChapter03}
                onStartChapter04={handleStartChapter04}
                onStartChapter05={handleStartChapter05}
                onStartChapter06={handleStartChapter06}
                onStartChapter07={handleStartChapter07}
                onSelectLockedChapter={handleSelectLockedChapter}
              />
            </div>
          )}

          {currentView === 'chapter-01' && (
            <Chapter01View
              onBackToIndex={handleBackToIndex}
              onChapterCompleted={handleChapterCompleted}
              isChapter02Unlocked={!!isChapter02Unlocked}
            />
          )}

          {currentView === 'chapter-02' && (
            <Chapter02View
              onBackToIndex={handleBackToIndex}
              onChapterCompleted={handleChapter02Completed}
              initialStation={c02TargetStation}
              onOpenChapter03={handleStartChapter03}
            />
          )}

          {currentView === 'chapter-03' && (
            <Chapter03View
              onBackToIndex={handleBackToIndex}
              onOpenChapter02={handleStartChapter02}
              onChapterCompleted={handleChapter03Completed}
            />
          )}

          {currentView === 'chapter-04' && (
            <Chapter04View
              onBackToIndex={handleBackToIndex}
              onOpenChapter03={handleStartChapter03}
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
              onOpenChapter07={handleStartChapter07}
              onChapterCompleted={handleChapter06Completed}
            />
          )}

          {currentView === 'chapter-07' && (
            <Chapter07View
              onBackToIndex={handleBackToIndex}
              onChapterCompleted={handleChapter07Completed}
            />
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
    </div>
  );
}
