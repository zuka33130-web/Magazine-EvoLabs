import React, { useState, useEffect, useRef, useCallback } from 'react';
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
const Chapter01View = React.lazy(() => import('./components/Chapter01View').then(m => ({ default: m.Chapter01View })));
const Chapter02View = React.lazy(() => import('./components/Chapter02View').then(m => ({ default: m.Chapter02View })));
const Chapter03View = React.lazy(() => import('./components/Chapter03View').then(m => ({ default: m.Chapter03View })));
const Chapter04View = React.lazy(() => import('./components/Chapter04View').then(m => ({ default: m.Chapter04View })));
const Chapter05View = React.lazy(() => import('./components/Chapter05View').then(m => ({ default: m.Chapter05View })));
const Chapter06View = React.lazy(() => import('./components/Chapter06View').then(m => ({ default: m.Chapter06View })));
const Chapter07View = React.lazy(() => import('./components/Chapter07View').then(m => ({ default: m.Chapter07View })));
import { LockedChapterModal } from './components/LockedChapterModal';
import { ChapterUnlockedCelebrationModal } from './components/ChapterUnlockedCelebrationModal';
import { getChapterRequirements, ChapterRequirementInfo } from './utils/chapterPrerequisites';
import { ChapterItem, EvoNarrativeProfile, EvoLabZone, UserHardwarePassport, Tome01DossierSummary } from './types';import { Chapter02Station } from './components/Chapter02View';
import { EvoWorldMap } from './components/world/EvoWorldMap';
import { PublicShell, PublicNavigationTarget } from './components/public/PublicShell';
import { EvoPaymentSuccessView } from './components/commerce/EvoPaymentSuccessView';
import { executeToolById, executeTomoById } from './utils/evoToolRouter';
import { EVO_MASTER_TOOLS_CATALOG } from './data/evoToolsData';
import { EvoIntroExperience } from './components/world/EvoIntroExperience';
import { EvoArchiveEntrance } from './components/world/EvoArchiveEntrance';
import { EvoMagazineView } from './components/magazine/EvoMagazineView';
const Tomo01LabsAndToolsView = React.lazy(() => import('./components/tomo01/Tomo01LabsAndToolsView').then(m => ({ default: m.Tomo01LabsAndToolsView })));
const Tomo02MagazineView = React.lazy(() => import('./components/tomo02/Tomo02MagazineView').then(m => ({ default: m.Tomo02MagazineView })));
const Tomo03MagazineView = React.lazy(() => import('./components/tomo03/Tomo03MagazineView').then(m => ({ default: m.Tomo03MagazineView })));
const Tomo04MagazineView = React.lazy(() => import('./components/tomo04/Tomo04MagazineView').then(m => ({ default: m.Tomo04MagazineView })));
const Tomo05MagazineView = React.lazy(() => import('./components/tomo05/Tomo05MagazineView').then(m => ({ default: m.Tomo05MagazineView })));
const Tomo06MagazineView = React.lazy(() => import('./components/tomo06/Tomo06MagazineView').then(m => ({ default: m.Tomo06MagazineView })));
const Tomo07MagazineView = React.lazy(() => import('./components/tomo07/Tomo07MagazineView').then(m => ({ default: m.Tomo07MagazineView })));
const Tomo08MagazineView = React.lazy(() => import('./components/tomo08/Tomo08MagazineView').then(m => ({ default: m.Tomo08MagazineView })));
const Tomo09MagazineView = React.lazy(() => import('./components/tomo09/Tomo09MagazineView').then(m => ({ default: m.Tomo09MagazineView })));
const Tomo10MagazineView = React.lazy(() => import('./components/tomo10/Tomo10MagazineView').then(m => ({ default: m.Tomo10MagazineView })));
const Tomo11MagazineView = React.lazy(() => import('./components/tomo11/Tomo11MagazineView').then(m => ({ default: m.Tomo11MagazineView })));
const Tomo12MagazineView = React.lazy(() => import('./components/tomo12/Tomo12MagazineView').then(m => ({ default: m.Tomo12MagazineView })));
const EvoBootLab = React.lazy(() => import('./components/tomo08/EvoBootLab').then(m => ({ default: m.EvoBootLab })));
const EvoMasterLabSuite = React.lazy(() => import('./components/world/labs/EvoMasterLabSuite').then(m => ({ default: m.EvoMasterLabSuite })));
const EvoWindowsMatrixLab = React.lazy(() => import('./components/world/labs/windowsMatrix/EvoWindowsMatrixLab').then(m => ({ default: m.EvoWindowsMatrixLab })));
const EvoWindowsXRayLab = React.lazy(() => import('./components/world/labs/windowsMatrix/EvoWindowsXRayLab').then(m => ({ default: m.EvoWindowsXRayLab })));
const EvoLabCore = React.lazy(() => import('./components/evoLabCore/EvoLabCore').then(m => ({ default: m.EvoLabCore })));
const EvoBsodRepairView = React.lazy(() => import('./components/tools/EvoBsodRepairView').then(m => ({ default: m.EvoBsodRepairView })));
const EvoWindowsErrorAnalyzerView = React.lazy(() => import('./components/tools/EvoWindowsErrorAnalyzerView').then(m => ({ default: m.EvoWindowsErrorAnalyzerView })));
const EvoBottleneckSimulatorView = React.lazy(() => import('./components/tools/EvoBottleneckSimulatorView').then(m => ({ default: m.EvoBottleneckSimulatorView })));
import { ForensicBenchTarget } from './components/common/EvoTomoDossierModal';
import { EvoHardwareDiscoveryModal } from './components/evoLabCore/components/EvoHardwareDiscoveryModal';
import { CatalogCoverageDashboard } from './components/evoLabCore/components/CatalogCoverageDashboard';
import { EvoTelemetryIntegrityModal } from './components/evoLabCore/components/EvoTelemetryIntegrityModal';
import { TelemetryIntegrityService, LiveScanIntegrityResult } from './components/evoLabCore/services/telemetryIntegrityService';
import { EvoCaseRepository } from './components/evoLabCore/services/caseRepository';
import { EvoCase } from './components/evoLabCore/types';
import { EvoTomo01FinalExam } from './components/tomo01/EvoTomo01FinalExam';
import { EvoTomo01CompletionScreen } from './components/tomo01/EvoTomo01CompletionScreen';
import { CheckCircle2, X, History, ArrowLeft } from 'lucide-react';
import { useEvoAuth } from './auth/EvoAuthProvider';
import { EvoAuthModal } from './components/auth/EvoAuthModal';
import { useEvoAccess, EvoAccessProvider } from './auth/EvoAccessContext';
import { EvoContentGate } from './components/common/EvoContentGate';
import {
  TutorEvoProvider,
  useTutorEvo,
} from './components/tutor/TutorEvoContext';
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

// Safe LocalStorage Helper for sandboxed iframe compatibility
const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },
};

// Explicit Tool Target Map mapping all 34 tools to exact app state destinations
const TOOL_TARGET_MAP: Record<string, (actions: {
  setCurrentView: (view: any) => void;
  setCampusSection: (sec: any) => void;
  setActiveLabPanel: (panel: any) => void;
  setActiveLabMission: (mission: any) => void;
  setLabCorePhase: (phase: any) => void;
  setMatrixInitialScenario: (scenario: any) => void;
  setShowDiscoveryModal: (val: boolean) => void;
  setShowCoverageDashboard: (val: boolean) => void;
  setShowIntegrityModal: (val: boolean) => void;
}) => void> = {
  'diag-boot-seq': ({ setCurrentView }) => {
    setCurrentView('boot-lab');
  },
  'diag-bsod-decoder': ({ setCurrentView }) => {
    setCurrentView('bsod-repair-view');
  },
  'diag-incident-events': ({ setCurrentView, setMatrixInitialScenario }) => {
    setMatrixInitialScenario('services');
    setCurrentView('windows-matrix-lab');
  },
  'diag-bottleneck-calc': ({ setCurrentView, setLabCorePhase, setActiveLabMission }) => {
    setLabCorePhase('SELECT_PC');
    setActiveLabMission('BOTTLENECK');
    setCurrentView('lab-core');
  },
  'diag-autodetect-pc': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_autodetect'));
    }, 150);
  },
  'diag-telemetry-integrity': ({ setShowIntegrityModal }) => {
    setShowIntegrityModal(true);
  },
  'diag-atx-power-bench': ({ setCurrentView, setLabCorePhase, setActiveLabMission }) => {
    setLabCorePhase('SELECT_PC');
    setActiveLabMission('REPAIR');
    setCurrentView('lab-core');
  },
  'diag-case-resolver': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_case_resolver'));
    }, 150);
  },
  'med-latency-calc': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('hardware');
    setCurrentView('hotswap-lab');
  },
  'med-frametime-analyzer': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('telemetry');
    setCurrentView('hotswap-lab');
  },
  'med-sensors-telemetry': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('telemetry');
    setCurrentView('hotswap-lab');
  },
  'med-dpc-latency': ({ setCurrentView, setMatrixInitialScenario }) => {
    setMatrixInitialScenario('services');
    setCurrentView('windows-matrix-lab');
  },
  'med-stress-stability': ({ setCurrentView, setLabCorePhase, setActiveLabMission }) => {
    setLabCorePhase('SELECT_PC');
    setActiveLabMission('TEST');
    setCurrentView('lab-core');
  },
  'med-thermal-history': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('telemetry');
    setCurrentView('hotswap-lab');
  },
  'inv-pcb-schematic': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('hardware');
    setCurrentView('hotswap-lab');
  },
  'inv-xray-kernel': ({ setCurrentView, setMatrixInitialScenario }) => {
    setMatrixInitialScenario('xray');
    setCurrentView('windows-xray-lab');
  },
  'inv-cache-imc-flow': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('hardware');
    setCurrentView('hotswap-lab');
  },
  'inv-digital-twin': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_digital_twin'));
    }, 150);
  },
  'inv-workstations-sectors': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('all');
    setCurrentView('hotswap-lab');
  },
  'inv-coverage-matrix': ({ setShowCoverageDashboard }) => {
    setShowCoverageDashboard(true);
  },
  'rep-windows-repair': ({ setCurrentView, setMatrixInitialScenario }) => {
    setMatrixInitialScenario('repair');
    setCurrentView('windows-matrix-lab');
  },
  'rep-windows-install': ({ setCurrentView, setMatrixInitialScenario }) => {
    setMatrixInitialScenario('install');
    setCurrentView('windows-matrix-lab');
  },
  'rep-hotswap-bench': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('sandbox');
    setCurrentView('hotswap-lab');
  },
  'rep-core-repair-view': ({ setCurrentView, setLabCorePhase, setActiveLabMission }) => {
    setLabCorePhase('SELECT_PC');
    setActiveLabMission('REPAIR');
    setCurrentView('lab-core');
  },
  'opt-nt-services': ({ setCurrentView, setMatrixInitialScenario }) => {
    setMatrixInitialScenario('services');
    setCurrentView('windows-matrix-lab');
  },
  'opt-core-optimization': ({ setCurrentView, setLabCorePhase, setActiveLabMission }) => {
    setLabCorePhase('SELECT_PC');
    setActiveLabMission('OPTIMIZE');
    setCurrentView('lab-core');
  },
  'opt-ab-comparison': ({ setCurrentView, setActiveLabPanel }) => {
    setActiveLabPanel('sandbox');
    setCurrentView('hotswap-lab');
  },
  'opt-upgrade-simulator': ({ setCurrentView, setLabCorePhase, setActiveLabMission }) => {
    setLabCorePhase('SELECT_PC');
    setActiveLabMission('UPGRADE');
    setCurrentView('lab-core');
  },
  'opt-build-architect': ({ setCurrentView, setLabCorePhase }) => {
    setLabCorePhase('BUILD_PC');
    setCurrentView('lab-core');
  },
  'doc-forensic-dossier': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_forensic_report'));
    }, 150);
  },
  'doc-evidence-passport': ({ setShowDiscoveryModal }) => {
    setShowDiscoveryModal(true);
  },
  'doc-technical-dossier': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_forensic_report'));
    }, 150);
  },
  'doc-content-factory': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_content_factory'));
    }, 150);
  },
  'doc-transfer-challenge': ({ setCurrentView, setCampusSection }) => {
    setCurrentView('world-map');
    setCampusSection('diagnosticar');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('evo_open_transfer_challenge'));
    }, 150);
  },
};

import {
  getTomeNumberFromTarget,
  resolveTomeViewOrDossier,
  ResolvedTomeTarget,
} from './utils/evoTomeTargetRouter';

export { getTomeNumberFromTarget, resolveTomeViewOrDossier };
export type { ResolvedTomeTarget };

function AppContent({
  initialPendingTarget,
  onClearPendingTarget,
  onReturnToPublic,
  onNavigateToPlans,
}: {
  initialPendingTarget?: PublicNavigationTarget | null;
  onClearPendingTarget?: () => void;
  onReturnToPublic?: () => void;
  onNavigateToPlans?: () => void;
}) {
  const { updateLocation, saveCurrentLocationHistory } = useTutorEvo();
  const { canAccess, openUpgradeModal, isFreeUser } = useEvoAccess();

  useEffect(() => {
    if (initialPendingTarget) {
      setIsIntroActive(false);
      try {
        localStorage.setItem('evo_academia_intro_dismissed', 'true');
      } catch {}
      if (initialPendingTarget.type === 'PRACTICE_LAB') {
        setCampusSection('laboratorios');
        setCurrentView('world-map');
        setInitialPracticeLabId(initialPendingTarget.labId);
      } else if (initialPendingTarget.type === 'TOME') {
        const tomoNum = getTomeNumberFromTarget(initialPendingTarget);
        if (tomoNum) {
          handleNavigateTomo(tomoNum);
        } else {
          const rawDisplay =
            'tomeNumber' in initialPendingTarget
              ? String(initialPendingTarget.tomeNumber)
              : 'desconocido';
          setActiveNotice(`Error: El Tomo solicitado "${rawDisplay}" no es válido.`);
        }
      } else if (initialPendingTarget.type === 'BOOT_LAB') {
        handleNavigateBootLab();
      } else if (initialPendingTarget.type === 'HOTSWAP') {
        if (isFreeUser) {
          openUpgradeModal('Laboratorio Hot-Swap de Hardware');
          setCurrentView('world-map');
          setCampusSection('laboratorios');
        } else {
          setCurrentView('hotswap-lab');
          const sp = (initialPendingTarget as any).subPanel;
          if (sp && ['sandbox', 'gaming', 'architecture', 'hardware', 'software', 'telemetry', 'matrix', 'all'].includes(sp)) {
            setActiveLabPanel(sp);
          } else {
            setActiveLabPanel('hardware');
          }
        }
      } else if (initialPendingTarget.type === 'WINDOWS_MATRIX') {
        if (isFreeUser) {
          openUpgradeModal('Laboratorio Windows Matrix & Kernel NT');
          setCurrentView('world-map');
          setCampusSection('laboratorios');
        } else {
          setMatrixInitialScenario((initialPendingTarget as any).scenario);
          setCurrentView('windows-matrix-lab');
        }
      } else if (initialPendingTarget.type === 'WINDOWS_XRAY') {
        if (isFreeUser) {
          openUpgradeModal('Laboratorio Windows X-Ray Kernel');
          setCurrentView('world-map');
          setCampusSection('laboratorios');
        } else {
          setMatrixInitialScenario((initialPendingTarget as any).scenario || 'xray');
          setCurrentView('windows-xray-lab');
        }
      } else if (initialPendingTarget.type === 'CAMPUS_ZONE') {
        const zId = (initialPendingTarget as any).zoneId || 'zona-1';
        setActiveZoneId(zId);
        setCampusSection('diagnosticar');
        setCurrentView('world-map');
      } else if (initialPendingTarget.type === 'LAB_CORE') {
        if (isFreeUser) {
          openUpgradeModal('EVO Lab Core');
          setCurrentView('world-map');
          setCampusSection('laboratorios');
        } else {
          setCurrentView('lab-core');
          const ph = (initialPendingTarget as any).phase;
          if (ph) setLabCorePhase(ph);
          const ms = (initialPendingTarget as any).mission;
          if (ms) setActiveLabMission(ms);
        }
      } else if (initialPendingTarget.type === 'TOOL') {
        const toolId = (initialPendingTarget as any).toolId;
        const freeTools = ['med-latency-calc', 'diag-autodetect-pc', 'diag-bottleneck-calc', 'diag-bsod-decoder'];
        if (isFreeUser && !freeTools.includes(toolId)) {
          openUpgradeModal('Herramienta Técnica Premium');
          setCurrentView('world-map');
          setCampusSection('herramientas');
        } else {
          executeToolById(toolId, {
            setCurrentView,
            setCampusSection,
            setActiveLabPanel,
            setActiveLabMission,
            setLabCorePhase,
            setMatrixInitialScenario,
            setShowDiscoveryModal,
            setShowCoverageDashboard,
            setShowIntegrityModal,
            openDossierModal: (tId) => setDossierModalTomoId(tId),
          });
        }
      } else if (initialPendingTarget.type === 'APP_SECTION') {
        setCurrentView('world-map');
        setCampusSection((initialPendingTarget as any).section);
      } else if (initialPendingTarget.type === 'APP_HOME') {
        setCurrentView('world-map');
        setCampusSection('campus');
      }
      onClearPendingTarget?.();
    }
  }, [initialPendingTarget, isFreeUser]);
  const [currentView, setCurrentView] = useState<
    | 'magazine'
    | 'tomo-02'
    | 'tomo-03'
    | 'tomo-04'
    | 'tomo-05'
    | 'tomo-06'
    | 'tomo-07'
    | 'tomo-08'
    | 'tomo-09'
    | 'tomo-10'
    | 'tomo-11'
    | 'tomo-12'
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
    | 'windows-xray-lab'
    | 'lab-core'
    | 'tomo01-quiz'
    | 'tomo01-completion'
    | 'tomo-01-labs'
    | 'bsod-repair-view'
  >(() => {
    if (initialPendingTarget) {
      if (initialPendingTarget.type === 'TOME') {
        const tomoNum = getTomeNumberFromTarget(initialPendingTarget);
        if (tomoNum) {
          const resolved = resolveTomeViewOrDossier(tomoNum);
          if (resolved && resolved.kind === 'reader') {
            return resolved.view;
          }
        }
        return 'world-map';
      }
      if (initialPendingTarget.type === 'BOOT_LAB') return 'boot-lab';
      if (initialPendingTarget.type === 'HOTSWAP') return 'hotswap-lab';
      if (initialPendingTarget.type === 'WINDOWS_MATRIX') return 'windows-matrix-lab';
      if (initialPendingTarget.type === 'WINDOWS_XRAY') return 'windows-xray-lab';
      if (initialPendingTarget.type === 'LAB_CORE') return 'lab-core';
    }
    try {
      const url = new URL(window.location.href);
      const vol = url.searchParams.get('volume');
      const viewParam = url.searchParams.get('view');
      if (viewParam === 'hotswap') return 'hotswap-lab';
      if (viewParam === 'matrix') return 'windows-matrix-lab';
      if (viewParam === 'xray' || viewParam === 'windows-xray' || viewParam === 'windows-xray-lab') return 'windows-xray-lab';
      if (viewParam === 'core' || viewParam === 'lab-core') return 'lab-core';
      if (vol === '02' || vol === '2') return 'tomo-02';
      if (vol === '03' || vol === '3') return 'tomo-03';
      if (vol === '04' || vol === '4') return 'tomo-04';
      if (vol === '05' || vol === '5') return 'tomo-05';
      if (vol === '06' || vol === '6') return 'tomo-06';
      if (vol === '07' || vol === '7') return 'tomo-07';
      if (vol === '08' || vol === '8') return 'tomo-08';
      if (vol === '09' || vol === '9') return 'tomo-09';
      if (vol === '10') return 'tomo-10';
      if (vol === '11') return 'tomo-11';
      if (vol === '12') return 'tomo-12';
      if (viewParam === 'boot' || viewParam === 'boot-lab') return 'boot-lab';
      if (viewParam === 'index') return 'index';
      if (viewParam === 'world' || viewParam === 'map') return 'world-map';
      if (viewParam === 'chapter-01') return 'chapter-01';
      if (
        url.searchParams.get('print') === 'true' ||
        url.searchParams.get('mode') === 'magazine' ||
        url.searchParams.get('pdf') === 'true'
      ) {
        if (vol === '02' || vol === '2') return 'tomo-02';
        if (vol === '03' || vol === '3') return 'tomo-03';
        if (vol === '04' || vol === '4') return 'tomo-04';
        if (vol === '05' || vol === '5') return 'tomo-05';
        if (vol === '06' || vol === '6') return 'tomo-06';
        if (vol === '07' || vol === '7') return 'tomo-07';
        if (vol === '08' || vol === '8') return 'tomo-08';
        if (vol === '09' || vol === '9') return 'tomo-09';
        if (vol === '10') return 'tomo-10';
        if (vol === '11') return 'tomo-11';
        if (vol === '12') return 'tomo-12';
        return 'magazine';
      }
    } catch {
      // ignore
    }
    return 'world-map';
  });

  const [initialPracticeLabId, setInitialPracticeLabId] = useState<string | undefined>(undefined);

  // Sub-panel & Lab states
  const [activeZoneId, setActiveZoneId] = useState<string | undefined>(undefined);
  const [activeLabPanel, setActiveLabPanel] = useState<'sandbox' | 'gaming' | 'architecture' | 'hardware' | 'software' | 'telemetry' | 'matrix' | 'all'>('sandbox');
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
  const [dossierModalTomoId, setDossierModalTomoId] = useState<string | null>(() => {
    if (initialPendingTarget && initialPendingTarget.type === 'TOME') {
      const tomoNum = getTomeNumberFromTarget(initialPendingTarget);
      if (tomoNum) {
        const resolved = resolveTomeViewOrDossier(tomoNum);
        if (resolved && resolved.kind === 'dossier') {
          return resolved.dossierId;
        }
      }
    }
    return null;
  });

  const [campusSection, setCampusSection] = useState<
    'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso' | 'herramientas' | 'como-usar' | 'planes'
  >(() => {
    try {
      const url = new URL(window.location.href);
      const viewParam = url.searchParams.get('view');
      if (viewParam === 'planes' || viewParam === 'pricing' || viewParam === 'precios') return 'planes';
      if (viewParam === 'como-usar' || viewParam === 'como-funciona' || viewParam === 'how-to-use') return 'como-usar';
      if (viewParam === 'escuela' || viewParam === 'aprender') return 'escuela';
      if (viewParam === 'laboratorios' || viewParam === 'practicar') return 'laboratorios';
      if (viewParam === 'diagnosticar' || viewParam === 'analizar') return 'diagnosticar';
      if (viewParam === 'herramientas' || viewParam === 'tools') return 'herramientas';
      if (viewParam === 'progreso' || viewParam === 'mievo') return 'progreso';
    } catch {
      // ignore
    }
    return 'campus';
  });

  // Global Navigation History Stack
  const [historyStack, setHistoryStack] = useState<{
    view: string;
    campusSection: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso' | 'herramientas' | 'como-usar' | 'planes';
    activeLabPanel?: string;
    activeLabMission?: string;
    labCorePhase?: string;
    matrixInitialScenario?: string;
  }[]>([]);
  const isNavigatingBackRef = useRef(false);
  const prevLocationRef = useRef<{
    view: string;
    campusSection: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso' | 'herramientas' | 'como-usar' | 'planes';
    activeLabPanel?: string;
    activeLabMission?: string;
    labCorePhase?: string;
    matrixInitialScenario?: string;
  }>({
    view: currentView,
    campusSection,
    activeLabPanel,
    activeLabMission,
    labCorePhase,
    matrixInitialScenario,
  });
  const subViewBackHandlerRef = useRef<(() => boolean) | null>(null);
  const [hasWorldMapSubView, setHasWorldMapSubView] = useState(false);

  useEffect(() => {
    if (isNavigatingBackRef.current) {
      isNavigatingBackRef.current = false;
      prevLocationRef.current = {
        view: currentView,
        campusSection,
        activeLabPanel,
        activeLabMission,
        labCorePhase,
        matrixInitialScenario,
      };
      return;
    }
    const prev = prevLocationRef.current;
    if (prev.view !== currentView || prev.campusSection !== campusSection) {
      setHistoryStack((stack) => [...stack, prev].slice(-50));
      prevLocationRef.current = {
        view: currentView,
        campusSection,
        activeLabPanel,
        activeLabMission,
        labCorePhase,
        matrixInitialScenario,
      };
    } else {
      prevLocationRef.current = {
        view: currentView,
        campusSection,
        activeLabPanel,
        activeLabMission,
        labCorePhase,
        matrixInitialScenario,
      };
    }
  }, [currentView, campusSection, activeLabPanel, activeLabMission, labCorePhase, matrixInitialScenario]);

  const isAtHome = currentView === 'world-map' && campusSection === 'campus' && !hasWorldMapSubView;
  const showBackButton = !isAtHome;

  const handleGlobalBack = () => {
    setActiveZoneId(undefined);
    // 1. If in world-map and a sub-view/modal is open, close that first
    if (currentView === 'world-map' && subViewBackHandlerRef.current) {
      const handled = subViewBackHandlerRef.current();
      if (handled) return;
    }

    // 2. If there is history, pop previous location
    if (historyStack.length > 0) {
      const nextStack = [...historyStack];
      const prev = nextStack.pop()!;
      setHistoryStack(nextStack);
      const isDifferent = prev.view !== currentView || prev.campusSection !== campusSection;
      if (isDifferent) {
        isNavigatingBackRef.current = true;
      }
      setCurrentView(prev.view as any);
      setCampusSection(prev.campusSection as any);
      if (prev.activeLabPanel) setActiveLabPanel(prev.activeLabPanel as any);
      if (prev.activeLabMission) setActiveLabMission(prev.activeLabMission as any);
      if (prev.labCorePhase) setLabCorePhase(prev.labCorePhase as any);
      if (prev.matrixInitialScenario) setMatrixInitialScenario(prev.matrixInitialScenario);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Fallback: return to INICIO
    const isDifferent = currentView !== 'world-map' || campusSection !== 'campus';
    if (isDifferent) {
      isNavigatingBackRef.current = true;
    }
    setCurrentView('world-map');
    setCampusSection('campus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [deepLinkDest, setDeepLinkDest] = useState<{ view: any; volume?: string | null } | null>(() => {
    try {
      const url = new URL(window.location.href);
      const vol = url.searchParams.get('volume');
      const viewParam = url.searchParams.get('view');
      if (viewParam || vol) {
        let viewToSave: any = 'world-map';
        if (viewParam === 'hotswap') viewToSave = 'hotswap-lab';
        else if (viewParam === 'matrix') viewToSave = 'windows-matrix-lab';
        else if (viewParam === 'core' || viewParam === 'lab-core') viewToSave = 'lab-core';
        else if (viewParam === 'boot' || viewParam === 'boot-lab') viewToSave = 'boot-lab';
        else if (viewParam === 'index') viewToSave = 'index';
        else if (viewParam === 'world' || viewParam === 'map') viewToSave = 'world-map';
        else if (viewParam === 'chapter-01') viewToSave = 'chapter-01';
        
        if (vol === '02') viewToSave = 'tomo-02';
        else if (vol === '03') viewToSave = 'tomo-03';
        else if (vol === '04') viewToSave = 'tomo-04';
        else if (vol === '08') viewToSave = 'tomo-08';
        
        return { view: viewToSave, volume: vol };
      }
    } catch {}
    return null;
  });

  const [isIntroActive, setIsIntroActive] = useState<boolean>(() => {
    if (initialPendingTarget) {
      try {
        localStorage.setItem('evo_academia_intro_dismissed', 'true');
      } catch {}
      return false;
    }
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('intro') === 'true') {
        return true;
      }
      if (
        url.searchParams.get('volume') ||
        url.searchParams.get('view') ||
        url.searchParams.get('mode') ||
        url.searchParams.get('pdf') ||
        url.searchParams.get('print') === 'true'
      ) {
        return false;
      }
      const dismissed = localStorage.getItem('evo_academia_intro_dismissed') === 'true';
      return !dismissed;
    } catch {
      return true;
    }
  });
  const [activeProfile, setActiveProfile] = useState<EvoNarrativeProfile>('investigador');
  const [activeNotice, setActiveNotice] = useState<string | null>(() => {
    if (initialPendingTarget && initialPendingTarget.type === 'TOME') {
      const tomoNum = getTomeNumberFromTarget(initialPendingTarget);
      if (!tomoNum) {
        const rawDisplay =
          'tomeNumber' in initialPendingTarget
            ? String(initialPendingTarget.tomeNumber)
            : 'desconocido';
        return `Error: El Tomo solicitado "${rawDisplay}" no es válido.`;
      }
    }
    return null;
  });
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
      const hasDeepLink = Boolean(
        vol ||
        viewParam ||
        url.searchParams.get('print') === 'true' ||
        url.searchParams.get('mode') === 'magazine' ||
        url.searchParams.get('pdf') === 'true'
      );
      const playIntro = !hasDeepLink && localStorage.getItem('evo_academia_intro_dismissed') !== 'true';
      const playExplicitIntro = url.searchParams.get('intro') === 'true';

      if (playExplicitIntro) {
        setIsIntroActive(true);
      } else if (hasDeepLink) {
        setIsIntroActive(false);
      }

      if (viewParam === 'hotswap') {
        setCurrentView('hotswap-lab');
      } else if (viewParam === 'matrix') {
        setCurrentView('windows-matrix-lab');
      } else if (viewParam === 'core' || viewParam === 'lab-core') {
        setCurrentView('lab-core');
      } else if (vol === '02') {
        setCurrentView('tomo-02');
        if (playIntro) setIsIntroActive(true);
      } else if (vol === '03') {
        setCurrentView('tomo-03');
        if (playIntro) setIsIntroActive(true);
      } else if (vol === '04') {
        setCurrentView('tomo-04');
        if (playIntro) setIsIntroActive(true);
      } else if (vol === '08') {
        setCurrentView('tomo-08');
        if (playIntro) setIsIntroActive(true);
      } else if (viewParam === 'boot' || viewParam === 'boot-lab') {
        setCurrentView('boot-lab');
        if (playIntro) setIsIntroActive(true);
      } else if (
        url.searchParams.get('print') === 'true' ||
        url.searchParams.get('mode') === 'magazine' ||
        url.searchParams.get('pdf') === 'true'
      ) {
        if (vol === '02') {
          setCurrentView('tomo-02');
        } else if (vol === '03') {
          setCurrentView('tomo-03');
        } else if (vol === '04') {
          setCurrentView('tomo-04');
        } else if (vol === '08') {
          setCurrentView('tomo-08');
        } else {
          setCurrentView('magazine');
        }
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
          tomoTitle: 'EVO LABS',
          chapterTitle: undefined,
          activityTitle: 'Mapa Principal',
          activityType: 'mundo',
          whatIs: 'Centro principal de navegación y exploración de EVO LABS.',
          whatFor: 'Permite visualizar todos los 12 Tomos, acceder al recorrido guiado y retomar tu progreso.',
          currentAction: 'Seleccioná un Tomo de la colección o hacé clic en "Continuar mi recorrido".',
          whatToLookFor: 'Observá los 12 tomos organizados correlativamente con sus badges de estado.',
          whyItMatters: 'Comprender el mapa global de EVO LABS te ayuda a trazar tu plan de estudio sin perderte.',
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
          whyItMatters: 'Alcanzar el 75% o más otorga la distinción EVO "TEORÍA COMPROBADA".',
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
          currentAction: 'Ingresá a la Biblia Virtual del Tomo 02 y explorá sus 40 sectores, del 00 al 39.',
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
          whyItMatters: 'Es el entorno pericial donde aplicás todo lo aprendido en los 12 Tomos.',
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
    if (isFreeUser) {
      openUpgradeModal('Tomo 01 · Capítulo 03: CUANDO LOS FPS MIENTEN');
      return;
    }
    setCurrentView('chapter-03');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter04 = () => {
    if (isFreeUser) {
      openUpgradeModal('Tomo 01 · Capítulo 04: ENCONTRÁ EL LÍMITE');
      return;
    }
    setCurrentView('chapter-04');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter05 = () => {
    if (isFreeUser) {
      openUpgradeModal('Tomo 01 · Capítulo 05: PRIMERA INTERVENCIÓN');
      return;
    }
    setCurrentView('chapter-05');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter06 = () => {
    if (isFreeUser) {
      openUpgradeModal('Tomo 01 · Capítulo 06: TALLER DE DIAGNÓSTICO EVO');
      return;
    }
    setCurrentView('chapter-06');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChapter07 = () => {
    if (isFreeUser) {
      openUpgradeModal('Tomo 01 · Capítulo 07: LABORATORIO FINAL');
      return;
    }
    setCurrentView('chapter-07');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToIndex = () => {
    if (historyStack.at(-1)?.view === 'world-map' && historyStack.at(-1)?.campusSection === 'laboratorios') {
      handleGlobalBack();
      return;
    }
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
    if (isFreeUser) {
      openUpgradeModal('Examen Final y Certificación Oficial // Tomo 01');
      return;
    }
    setCurrentView('tomo01-quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompletionScreen = () => {
    setCurrentView('tomo01-completion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteExam = (score: number, total: number) => {
    setChaptersList(computeChaptersList());
    const passed = total > 0 ? score / total >= 0.7 : false;
    if (passed) {
      try {
        localStorage.setItem('evo_tomo01_completed', 'true');
        localStorage.setItem('evo_labs_tomo_theory_verified_tomo-01', 'true');
        localStorage.setItem('evo_theory_verified_01', 'true');
      } catch {
        // ignore
      }
      setCelebrationData({
        completedNumber: 'TOMO 01',
        completedTitle: 'CONOCÉ TU PC // CERTIFICACIÓN EVO',
        unlockedNumber: 'LAB',
        unlockedTitle: 'BANCO DE SILICIO & TELEMETRÍA (HOT-SWAP LAB)',
      });
      setActiveNotice(
        `¡Prueba Final superada con ${score}/${total} (${Math.round((score / total) * 100)}%)! Tomo 01 acreditado con éxito. Habilitado el entorno práctico de laboratorio.`
      );
    }
  };

  const handleEnterZone = (zone: EvoLabZone) => {
    setActiveZoneId(zone.id);
    setCampusSection('diagnosticar');
    setCurrentView('world-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVolume = (volume: (typeof VOLUMES_COLLECTION)[0]) => {
    if (volume.id === 'tomo-01') {
      handleOpenEdition();
    } else {
      const tomoCleanNum = volume.id.replace('tomo-', '').padStart(2, '0');
      if (isFreeUser) {
        openUpgradeModal(`Tomo ${tomoCleanNum} // ${volume.title}`);
        setDossierModalTomoId(volume.id);
        return;
      }
      if (volume.id === 'tomo-02') {
        setCurrentView('tomo-02');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (volume.id === 'tomo-03') {
        setCurrentView('tomo-03');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (volume.id === 'tomo-04') {
        setCurrentView('tomo-04');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleWorldIntentionChange = useCallback((intention: any) => {
    setCampusSection(current => current === intention ? current : intention);
  }, []);

  const handleNavigateHome = () => {
    setActiveZoneId(undefined);
    setCampusSection('campus');
    setCurrentView('world-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCampusSection = (
    section: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso' | 'herramientas' | 'como-usar' | 'planes'
  ) => {
    if (section === 'planes') {
      if (onNavigateToPlans) {
        onNavigateToPlans();
        return;
      }
    }
    setActiveZoneId(undefined);
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

  const handleNavigateTomo01Labs = () => {
    setCurrentView('tomo-01-labs');
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

  const handleNavigateHotSwapLab = (subPanel?: 'sandbox' | 'gaming' | 'architecture' | 'hardware' | 'software' | 'telemetry' | 'all') => {
    if (subPanel) {
      setActiveLabPanel(subPanel);
    }
    setCurrentView('hotswap-lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLabCore = (phase?: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE', mission?: 'IDLE' | 'REPAIR' | 'TEST' | 'BOTTLENECK' | 'OPTIMIZE' | 'UPGRADE') => {
    if (mission) setActiveLabMission(mission);
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
    const handleIntroFinish = () => {
      setIsIntroActive(false);
      try {
        localStorage.setItem('evo_academia_intro_dismissed', 'true');
      } catch {
        // ignore
      }
      if (deepLinkDest) {
        setCurrentView(deepLinkDest.view);
        setDeepLinkDest(null);
      } else {
        setCampusSection('campus');
        setCurrentView('world-map');
      }
    };

    return (
      <EvoIntroExperience
        onEnterCampus={handleIntroFinish}
        onStartTomo01={() => {
          setIsIntroActive(false);
          try {
            localStorage.setItem('evo_academia_intro_dismissed', 'true');
          } catch {
            // ignore
          }
          handleNavigateTomo01();
        }}
        onSkipAndRemember={() => {
          try {
            localStorage.setItem('evo_academia_intro_dismissed', 'true');
          } catch {
            // ignore
          }
          handleIntroFinish();
        }}
        onComplete={handleIntroFinish}
        onSkip={handleIntroFinish}
      />
    );
  }

  const handleNavigateTomo = (tomo: string | any) => {
    const tId = typeof tomo === 'string' ? tomo : (tomo?.tomoNumber || tomo?.id || (typeof tomo === 'object' ? '' : String(tomo || '')));
    executeTomoById(tId, {
      setCurrentView,
      openDossierModal: (tId) => setDossierModalTomoId(tId),
    });
  };

  const handleNavigateTomo08 = () => {
    setCurrentView('tomo-08');
    try { window.scrollTo(0, 0); } catch {}
  };

  const handleNavigateBootLab = () => {
    setCurrentView('boot-lab');
    try { window.scrollTo(0, 0); } catch {}
  };

  const handleOpenForensicBench = (target: ForensicBenchTarget) => {
    if (isFreeUser) {
      openUpgradeModal(`Banco Forense de Laboratorio // ${target.moduleNumber || 'Simulación'}`);
      return;
    }
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
    <div className="min-h-screen bg-[#07090e] evo-global-ambient-bg text-[#f4f4f5] flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Streamlined Clean Header with Upper Navigation Bar */}
      <Header
        currentView={currentView}
        campusSection={campusSection}
        showBackButton={showBackButton}
        onBack={handleGlobalBack}
        activeLabPanel={activeLabPanel}
        activeLabMission={activeLabMission}
        onNavigateHome={handleNavigateHome}
        onNavigateCampusSection={handleNavigateCampusSection}
        onNavigateArchive={handleNavigateArchive}
        onNavigateTomo01={handleNavigateTomo01}
        onNavigateTomo02={handleNavigateTomo02}
        onNavigateTomo03={handleNavigateTomo03}
        onNavigateTomo04={handleNavigateTomo04}
        onNavigateTomo05={() => handleNavigateTomo('05')}
        onNavigateTomo06={() => handleNavigateTomo('06')}
        onNavigateTomo08={handleNavigateTomo08}
        onNavigateTomo={handleNavigateTomo}
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
        onReturnToPublic={onReturnToPublic}
      />

      {/* Main Body Container */}
      <div className="flex-1 min-h-screen print:min-h-0 flex flex-col relative print:p-0 print:m-0">
        {/* Subtle Ambient Workspace Top Glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[380px] pointer-events-none opacity-40 -z-10 print:hidden"
          style={{
            background:
              'radial-gradient(ellipse 80% 300px at 50% 0%, rgba(251, 191, 36, 0.05), transparent 70%)',
          }}
        />

        {/* Main View Render Stage */}
        <main className="flex-1 w-full print:p-0 print:m-0 print:min-h-0">
          <React.Suspense fallback={
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#090b11] text-amber-400 font-mono-tech text-xs uppercase tracking-widest gap-3.5">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span>CARGANDO MÓDULO PERICIAL EVO...</span>
            </div>
          }>
          {currentView === 'magazine' && (
            <EvoMagazineView
              onBackToApp={handleNavigateTomo01}
              onBackToTomo01={handleNavigateTomo01}
              onOpenInteractive={handleExploreTomo01}
              onOpenLab={handleNavigateHotSwapLab}
            />
          )}

          {currentView === 'tomo-02' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 02 // La Biblia Negra de Windows"
                subtitle="La lectura integral de la Biblia Negra de Windows, arquitectura del Kernel NT y optimización de drivers requiere Plan Complete."
                requiredPlan="Tomo 02 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo02MagazineView
                onBackToApp={handleNavigateHome}
                onNavigateTomo={handleNavigateTomo}
                onOpenLab={() => {
                  setCurrentView('windows-matrix-lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          )}

          {currentView === 'tomo-03' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 03 // Reparación de PC"
                subtitle="El manual de reparación física de motherboard, VRM, fuentes ATX y osciloscopio requiere Plan Complete."
                requiredPlan="Tomo 03 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo03MagazineView
                onBackToApp={handleNavigateHome}
                onNavigateTomo={handleNavigateTomo}
              />
            )
          )}

          {currentView === 'tomo-04' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 04 // Reparación de Notebooks"
                subtitle="La ingeniería inversa de esquemáticos boardview y microsoldadura de portátiles requiere Plan Complete."
                requiredPlan="Tomo 04 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo04MagazineView
                onBackToApp={handleNavigateHome}
                onNavigateTomo={handleNavigateTomo}
              />
            )
          )}

          {currentView === 'tomo-05' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 05 // Redes y Tráfico"
                subtitle="El tratado de protocolos TCP/IP, Wireshark, switches y VLANs requiere Plan Complete."
                requiredPlan="Tomo 05 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo05MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'tomo-06' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 06 // Ciberseguridad Defensiva"
                subtitle="El mapa táctico MITRE ATT&CK, hardening y contención de incidentes requiere Plan Complete."
                requiredPlan="Tomo 06 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo06MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'tomo-07' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 07 // Optimización y Rendimiento"
                subtitle="La calibración de latencia de entrada, DPC/ISR y frametimes competitivos requiere Plan Complete."
                requiredPlan="Tomo 07 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo07MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'tomo-08' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 08 // Arquitectura de Arranque y POST"
                subtitle="El desglose de los 35 estados de inicio, Power Good y BIOS/UEFI requiere Plan Complete."
                requiredPlan="Tomo 08 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo08MagazineView
                onBackToApp={handleNavigateHome}
                onNavigateTomo={handleNavigateTomo}
                onOpenLab={handleNavigateBootLab}
              />
            )
          )}

          {currentView === 'tomo-09' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 09 // Ingeniería de Código y Software"
                subtitle="La optimización de compiladores y arquitectura de bajo nivel requiere Plan Complete."
                requiredPlan="Tomo 09 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo09MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'tomo-10' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 10 // Sistemas de Inteligencia Artificial"
                subtitle="La infraestructura de hardware para entrenamiento y aceleración por GPU requiere Plan Complete."
                requiredPlan="Tomo 10 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo10MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'tomo-11' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 11 // Electrónica Aplicada a la Informática"
                subtitle="La física del electrón, semiconductores, VRMs y diagnóstico pericial de placas madre requieren Plan Complete."
                requiredPlan="Tomo 11 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo11MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'tomo-12' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 12 // Ingeniería y Creación de Videojuegos // EVO Game Forge"
                subtitle="La arquitectura de motores lúdicos, game loop desacoplado, físicas vectoriales y shaders requieren Plan Complete."
                requiredPlan="Tomo 12 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <Tomo12MagazineView
                onBack={handleNavigateHome}
              />
            )
          )}

          {currentView === 'boot-lab' && (
            isFreeUser ? (
              <EvoContentGate
                title="Laboratorio de Arranque y POST (Tomo 08)"
                subtitle="El laboratorio interactivo de 35 estados de encendido y multímetro virtual requiere Plan Complete."
                requiredPlan="Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
                <EvoBootLab
                  onClose={handleNavigateHome}
                  onOpenTomo08={handleNavigateTomo08}
                />
              </div>
            )
          )}

          {currentView === 'lab-core' && (
            isFreeUser ? (
              <EvoContentGate
                title="EVO Lab Core // Entorno de Pruebas"
                subtitle="El simulador de estabilidad, arquitecto de hardware y banco de estrés requiere Plan Complete."
                requiredPlan="Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
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
            )
          )}

          {currentView === 'windows-matrix-lab' && (
            isFreeUser ? (
              <EvoContentGate
                title="Laboratorio de Windows Matrix & Kernel NT"
                subtitle="La matriz de análisis de BSOD, latencias DPC/ISR y controladores requiere Plan Complete."
                requiredPlan="Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
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
            )
          )}

          {currentView === 'windows-xray-lab' && (
            isFreeUser ? (
              <EvoContentGate
                title="Laboratorio de Windows X-Ray Kernel"
                subtitle="La inspección radiológica del kernel NT y subsistemas de Windows requiere Plan Complete."
                requiredPlan="Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
                <EvoWindowsXRayLab initialScenario={matrixInitialScenario} />
              </div>
            )
          )}

          {currentView === 'hotswap-lab' && (
            isFreeUser ? (
              <EvoContentGate
                title="Banco de Hardware Hot-Swap"
                subtitle="El banco de componentes y simulación eléctrica de taller requiere Plan Complete."
                requiredPlan="Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleNavigateTomo01}
              />
            ) : (
              <EvoMasterLabSuite
                initialPanel={activeLabPanel}
                onNavigateTomo={handleNavigateTomo}
                onNavigateHome={handleNavigateHome}
                passport={userPassport}
              />
            )
          )}

          {currentView === 'world-map' && (
            <EvoWorldMap
              initialIntention={campusSection}
              initialPracticeLabId={initialPracticeLabId}
              onPracticeLabConsumed={() => setInitialPracticeLabId(undefined)}
              onNavigateWindowsXRayLab={(scenario) => {
                setMatrixInitialScenario(scenario);
                setCurrentView('windows-xray-lab');
              }}
              onNavigatePracticeChapter={(chapter) => {
                if (chapter === '02') {
                  setC02TargetStation('lab');
                  setCurrentView('chapter-02');
                } else if (chapter === '03') handleStartChapter03();
                else if (chapter === '04') handleStartChapter04();
                else if (chapter === '05') handleStartChapter05();
                else if (chapter === '06') handleStartChapter06();
                else handleStartChapter07();
              }}
              initialZoneId={activeZoneId}
              subViewBackHandlerRef={subViewBackHandlerRef}
              onSubViewStateChange={setHasWorldMapSubView}
              onIntentionChange={handleWorldIntentionChange}
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
              onGoToChapter={(ch) => {
                if (ch === '01') handleStartChapter01();
                else if (ch === '02') handleStartChapter02();
                else if (ch === '03') handleStartChapter03();
                else if (ch === '04') handleStartChapter04();
                else if (ch === '05') handleStartChapter05();
                else if (ch === '06') handleStartChapter06();
                else if (ch === '07') handleStartChapter07();
                else handleStartChapter01();
              }}
              onStartFinalExam={handleStartFinalExam}
              onOpenCompletionScreen={handleOpenCompletionScreen}
              onOpenCaseHistory={handleOpenCaseHistory}
              onHardwareDetected={(passport) => setUserPassport(passport)}
            />
          )}

          {currentView === 'archivo' && (
            <EvoArchiveEntrance
              dossierSummary={dossierSummary}
              onEnterTome01={handleExploreTomo01}
              onEnterLabs={handleNavigateTomo01Labs}
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
                onOpenLabs={handleNavigateTomo01Labs}
                onOpenA4Magazine={() => setCurrentView('magazine')}
                onBackToWorldMap={handleNavigateHome}
              />
            </div>
          )}

          {currentView === 'tomo-01-labs' && (
            <Tomo01LabsAndToolsView
              onBackToCover={handleNavigateTomo01}
              onOpenInteractive={handleOpenEdition}
              onOpenMagazine={() => {
                setCurrentView('magazine');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={handleNavigateHome}
              onOpenChapter={(ch) => {
                if (ch === '01') handleStartChapter01();
                else if (ch === '02') handleStartChapter02();
                else if (ch === '03') handleStartChapter03();
                else if (ch === '04') handleStartChapter04();
                else if (ch === '05') handleStartChapter05();
                else if (ch === '06') handleStartChapter06();
                else if (ch === '07') handleStartChapter07();
                else handleStartChapter01();
              }}
              onOpenHotSwap={handleNavigateHotSwapLab}
              onOpenLabCore={handleNavigateLabCore}
              onOpenBottleneckSimulator={() => {
                setCurrentView('bottleneck-simulator-view');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenLatencyCalculator={() => {
                setActiveLabPanel('hardware');
                setCurrentView('hotswap-lab');
              }}
              onOpenDigitalTwin={() => {
                setCurrentView('world-map');
                setCampusSection('diagnosticar');
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('evo_open_digital_twin'));
                }, 150);
              }}
              passport={userPassport}
              dossierSummary={dossierSummary}
            />
          )}

          {currentView === 'index' && (
            <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12">
              <EditorialIndex
                chapters={chaptersList}
                outcomes={TOMO_01_OUTCOMES}
                onBackToCover={handleNavigateTomo01}
                onOpenA4Magazine={() => setCurrentView('magazine')}
                onOpenLab={handleNavigateTomo01Labs}
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
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 01 · Capítulo 03: CUANDO LOS FPS MIENTEN"
                subtitle="El análisis de frametimes, percentiles 1% / 0.1% Low y telemetría de micro-stuttering requiere el Tomo 01 o Plan Complete."
                requiredPlan="Tomo 01 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleBackToIndex}
              />
            ) : (
              <Chapter03View
                onBackToIndex={handleBackToIndex}
                onOpenChapter02={handleStartChapter02}
                onOpenChapter04={handleStartChapter04}
                onChapterCompleted={handleChapter03Completed}
              />
            )
          )}

          {currentView === 'chapter-04' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 01 · Capítulo 04: ENCONTRÁ EL LÍMITE"
                subtitle="La matriz de saturación y diagnóstico de componentes limitantes requiere el Tomo 01 o Plan Complete."
                requiredPlan="Tomo 01 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleBackToIndex}
              />
            ) : (
              <Chapter04View
                onBackToIndex={handleBackToIndex}
                onOpenChapter03={handleStartChapter03}
                onOpenChapter05={handleStartChapter05}
                onChapterCompleted={handleChapter04Completed}
              />
            )
          )}

          {currentView === 'chapter-05' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 01 · Capítulo 05: PRIMERA INTERVENCIÓN"
                subtitle="La optimización guiada de 8 estaciones y ajustes de latencia requiere el Tomo 01 o Plan Complete."
                requiredPlan="Tomo 01 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleBackToIndex}
              />
            ) : (
              <Chapter05View
                onBackToIndex={handleBackToIndex}
                onOpenChapter04={handleStartChapter04}
                onOpenChapter06={handleStartChapter06}
                onChapterCompleted={handleChapter05Completed}
              />
            )
          )}

          {currentView === 'chapter-06' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 01 · Capítulo 06: TALLER DE DIAGNÓSTICO EVO"
                subtitle="El taller de descarte deductivo y formulación de hipótesis periciales requiere el Tomo 01 o Plan Complete."
                requiredPlan="Tomo 01 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleBackToIndex}
              />
            ) : (
              <Chapter06View
                onBackToIndex={handleBackToIndex}
                onOpenChapter05={handleStartChapter05}
                onOpenChapter07={handleStartChapter07}
                onChapterCompleted={handleChapter06Completed}
              />
            )
          )}

          {currentView === 'chapter-07' && (
            isFreeUser ? (
              <EvoContentGate
                title="Tomo 01 · Capítulo 07: LABORATORIO FINAL"
                subtitle="El laboratorio final de optimización A/B y emisión de dictamen requiere el Tomo 01 o Plan Complete."
                requiredPlan="Tomo 01 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleBackToIndex}
              />
            ) : (
              <Chapter07View
                onBackToIndex={handleBackToIndex}
                onOpenChapter06={handleStartChapter06}
                onGoToFinalExam={handleStartFinalExam}
                onChapterCompleted={handleChapter07Completed}
              />
            )
          )}

          {currentView === 'tomo01-quiz' && (
            isFreeUser ? (
              <EvoContentGate
                title="Examen Final y Certificación Oficial // Tomo 01"
                subtitle="La rendición del examen cronometrado de 20 preguntas y expedición de certificado oficial requiere Plan Complete o Tomo 01."
                requiredPlan="Tomo 01 o Plan Complete"
                onReturnHome={handleNavigateHome}
                onReturnToDemo={handleBackToIndex}
              />
            ) : (
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <EvoTomo01FinalExam
                  onBackToIndex={handleBackToIndex}
                  onBackToTomoCover={handleNavigateTomo01}
                  onGoToChapter={(ch) => handleGoToMissing(ch)}
                  onCompleteExam={handleCompleteExam}
                  onOpenCompletionScreen={handleOpenCompletionScreen}
                  onContinueToLab={() => {
                    setActiveLabPanel('hardware');
                    setCurrentView('hotswap-lab');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )
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

          {currentView === 'bsod-repair-view' && (
            <React.Suspense fallback={<div className="p-12 text-center text-zinc-400 font-mono">Cargando herramienta de solución de pantallas azules...</div>}>
              <EvoBsodRepairView
                onReturnToTools={() => {
                  setCurrentView('world-map');
                  setCampusSection('herramientas');
                }}
              />
            </React.Suspense>
          )}

          {currentView === 'windows-error-analyzer-view' && (
            <React.Suspense fallback={<div className="p-12 text-center text-cyan-400 font-mono">Cargando analizador de errores de Windows...</div>}>
              <EvoWindowsErrorAnalyzerView
                onReturnToTools={() => {
                  setCurrentView('world-map');
                  setCampusSection('herramientas');
                }}
              />
            </React.Suspense>
          )}

          {currentView === 'bottleneck-simulator-view' && (
            <React.Suspense fallback={<div className="p-12 text-center text-amber-400 font-mono">Cargando simulador de cuellos de botella...</div>}>
              <EvoBottleneckSimulatorView
                onReturnToTools={() => {
                  setCurrentView('world-map');
                  setCampusSection('herramientas');
                }}
              />
            </React.Suspense>
          )}
          </React.Suspense>
        </main>

        {/* Minimal Footer */}
        <footer className="app-global-footer border-t border-zinc-800/60 py-6 bg-[#06070a] text-zinc-500 text-xs font-mono-tech mt-auto print:hidden no-print">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <p className="text-zinc-300 font-bold">
                © 2026 EVO LABS — ZUDOKA PROGRAMING SYSTEM CORPORATION
              </p>
              <p className="text-zinc-400 text-[11px]">
                Todos los derechos reservados.
              </p>
              <p className="text-[10px] text-zinc-500">
                Creado y dirigido por ZuKA · Denis Galperin
              </p>
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

function getTargetFriendlyLabel(target: PublicNavigationTarget | null): string | null {
  if (!target) return null;
  switch (target.type) {
    case 'TOME':
      return `Tomo ${target.tomeNumber}`;
    case 'PRACTICE_LAB':
      return 'Laboratorio de PRACTICAR';
    case 'BOOT_LAB':
      return 'Laboratorio de Arranque y POST';
    case 'HOTSWAP':
      return 'Laboratorio de Hardware y Hot-Swap';
    case 'WINDOWS_MATRIX':
      return 'Laboratorio Matriz de Windows';
    case 'WINDOWS_XRAY':
      return 'Laboratorio Windows X-Ray Kernel';
    case 'CAMPUS_ZONE':
      return `Zona del Campus (${target.zoneId})`;
    case 'LAB_CORE':
      return 'Laboratorio EVO Core';
    case 'TOOL':
      return `Herramienta (${target.toolId})`;
    case 'APP_SECTION':
      return `Sección ${target.section}`;
    case 'APP_HOME':
      return 'Campus EVO LABS';
    default:
      return null;
  }
}

export default function App() {
  const isPaymentSuccessRoute = window.location.pathname.includes('/payment/success') || window.location.search.includes('order_id');
  if (isPaymentSuccessRoute) {
    return (
      <EvoPaymentSuccessView
        onEnterApp={() => {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }}
        onReturnToPlans={() => {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }}
      />
    );
  }

  const { user, emailVerified, loading } = useEvoAuth();
  const [isAuthGateOpen, setIsAuthGateOpen] = useState<boolean>(false);

  const [isAppMode, setIsAppMode] = useState<boolean>(() => {
    try {
      const url = new URL(window.location.href);
      const vol = url.searchParams.get('volume');
      const viewParam = url.searchParams.get('view');
      const modeParam = url.searchParams.get('mode');
      if (vol || viewParam || modeParam) return true;
    } catch {}
    return false;
  });

  const [pendingPublicTarget, setPendingPublicTarget] = useState<PublicNavigationTarget | null>(null);
  const [publicSection, setPublicSection] = useState<'inicio' | 'catalogo' | 'laboratorios' | 'herramientas' | 'planes'>('inicio');

  // Universal Auth Gate check: Verified authenticated users only
  const canEnterPrivateApp = !loading && !!user && emailVerified === true;
  const showPrivateApp = isAppMode && canEnterPrivateApp;

  // Si el usuario está registrado/logueado pero no verificado, mantener el modal en vista de verificación fija
  useEffect(() => {
    if (!loading && user && !emailVerified) {
      setIsAuthGateOpen(true);
    }
  }, [loading, user, emailVerified]);

  // Al detectarse emailVerified === true: desbloquear y continuar automáticamente al target o app
  useEffect(() => {
    if (!loading && user && emailVerified && isAuthGateOpen) {
      setIsAuthGateOpen(false);
      setIsAppMode(true);
    }
  }, [loading, user, emailVerified, isAuthGateOpen]);

  const handleRequestPrivateAccess = (action?: () => void) => {
    if (canEnterPrivateApp) {
      action?.();
      setIsAppMode(true);
    } else {
      setIsAuthGateOpen(true);
    }
  };

  const handleNavigateToPlans = () => {
    setPublicSection('planes');
    setIsAppMode(false);
    setPendingPublicTarget(null);
  };

  return (
    <EvoAccessProvider onNavigateToPlans={handleNavigateToPlans}>
      {!showPrivateApp ? (
        <>
          <PublicShell
            initialSection={publicSection}
            onEnterPrivateApp={() => {
              handleRequestPrivateAccess();
            }}
            onNavigateTarget={(target) => {
              setPendingPublicTarget(target);
              handleRequestPrivateAccess();
            }}
          />
          <EvoAuthModal
            isOpen={isAuthGateOpen}
            onClose={() => {
              setIsAuthGateOpen(false);
            }}
            targetLabel={getTargetFriendlyLabel(pendingPublicTarget)}
            onVerifiedSuccess={() => {
              setIsAuthGateOpen(false);
              setIsAppMode(true);
            }}
          />
        </>
      ) : (
        <TutorEvoProvider>
          <AppContent
            initialPendingTarget={pendingPublicTarget}
            onClearPendingTarget={() => setPendingPublicTarget(null)}
            onReturnToPublic={() => {
              setPublicSection('inicio');
              setIsAppMode(false);
              setPendingPublicTarget(null);
            }}
            onNavigateToPlans={handleNavigateToPlans}
          />
        </TutorEvoProvider>
      )}
    </EvoAccessProvider>
  );
}
