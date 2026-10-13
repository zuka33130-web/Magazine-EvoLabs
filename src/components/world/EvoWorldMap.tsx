import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  EvoLabZone,
  UserHardwarePassport,
  EvoNarrativeProfile,
} from '../../types';
import { executeToolById, executeTomoById } from '../../utils/evoToolRouter';
import { ForensicBenchTarget } from '../common/EvoTomoDossierModal';
import { EVO_WORLD_ZONES } from '../../data/evoWorldData';
import { VOLUMES_COLLECTION } from '../../data/collections';
import { EVO_TOMES_EXPANDED_DATA } from '../../data/evoTomesExpandedData';
import { EvoTomeCardExpanded } from './EvoTomeCardExpanded';
import { EvoHomeExperience } from '../home/EvoHomeExperience';
import { EvoQuickSearchBar } from './EvoQuickSearchBar';
import { EvoPublicLabsCatalog } from '../public/EvoPublicLabsCatalog';
import {
  EVO_SCHOOL_LEVELS,
  EVO_TOMES_PEDAGOGY,
  EVO_LAB_GUIDES,
  EVO_NEXT_RECOMMENDATIONS,
  EVO_TOOLS_BY_INTENT,
  EvoSchoolLevel,
  EvoTomePedagogicalProfile,
  EvoLabPedagogicalGuide,
  EvoToolCardDefinition,
} from '../../data/evoLearningPaths';
import { EvoCaseRepository } from '../evoLabCore/services/caseRepository';
import { EvoWorldCore } from './EvoWorldCore';
import { EvoWorldZone } from './EvoWorldZone';
import { EvoWorldAmbientLayer } from './EvoWorldAmbientLayer';
import { EvoMotherboardCanvas } from './EvoMotherboardCanvas';
import { EvoSectorWorkstationModal } from './EvoSectorWorkstationModal';
import { EvoLiveBenchSuite } from './EvoLiveBenchSuite';
import { EvoTelemetryHUD } from './labs/EvoTelemetryHUD';
import { EvoLabConsole } from './labs/EvoLabConsole';
import { EvoOperatingModeSelector } from '../common/EvoOperatingModeSelector';
import { EvoLearningGuideModal } from '../common/EvoLearningGuideModal';
import { EvoAutoDetectPcModal } from '../common/EvoAutoDetectPcModal';
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
} from '../../utils/tomo01Progress';
import { EvoEvidenceEngine, EvoCapability } from '../../services/evoEvidenceEngine';
import { EvoSkillGraphService, SkillGraphNode } from '../../services/evoSkillGraph';
import { EvoAdaptivePathService } from '../../services/evoAdaptivePath';
import { EvoNextBestActionBanner } from '../common/EvoNextBestActionBanner';
import { EvoCaseResolverModal } from '../common/EvoCaseResolverModal';
import { EvoDigitalTwinViewerModal } from '../common/EvoDigitalTwinViewerModal';
import { EvoForensicReportModal } from '../common/EvoForensicReportModal';
import { EvoTechnicalDossierModal } from '../common/EvoTechnicalDossierModal';
import { EvoWhyThisModal } from '../common/EvoWhyThisModal';
import { EvoContentFactoryModal } from '../common/EvoContentFactoryModal';
import { EvoMethodGuideModal } from '../common/EvoMethodGuideModal';
import { useEvoAccess } from '../../auth/EvoAccessContext';
import { EvoTransferChallengeModal } from '../common/EvoTransferChallengeModal';
import { EvoMethodBadge } from '../common/EvoMethodBadge';
import { EvoMethodEngine, TransferChallenge } from '../../services/evoMethodEngine';
import { EvoTechnicalIdentityEngine, VerifiedClaim } from '../../services/evoTechnicalIdentityEngine';
import { EvoEvolutionTrace } from '../common/EvoEvolutionTrace';
import { EvoMundoWordmark } from '../common/EvoMundoWordmark';
import { EvoHeroCore3D } from './EvoHeroCore3D';
import { EvoPublicHowToUse } from '../public/EvoPublicHowToUse';
import { EvoPublicPricing } from '../public/EvoPublicPricing';
import { EvoPublicToolsCatalog } from '../public/EvoPublicToolsCatalog';
import { EvoLatencyCalculator } from '../tools/EvoLatencyCalculator';
import { EvoPcBuildArchitect } from '../tools/EvoPcBuildArchitect';
import { EvoToolDefinition } from '../../data/evoToolsData';
import { EvoPrimarySystemButton, EvoSecondaryInspectButton } from '../common/EvoSystemButtons';
import {
  Power,
  Cpu,
  Wrench,
  Sparkles,
  Gauge,
  Activity,
  Terminal,
  Radio,
  Layers,
  Sliders,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Search,
  FileSearch,
  ExternalLink,
  ShieldCheck,
  Zap,
  Laptop,
  Network,
  Shield,
  Gamepad2,
  Binary,
  Lock,
  RotateCcw,
  CornerDownRight,
  FolderGit2,
  HardDrive,
  Play,
  Compass,
  Trophy,
  Award,
  FileText,
  Boxes,
  Microchip,
  ChevronRight,
  Clock,
  X,
  Info,
  HelpCircle,
  Globe,
  Code,
} from 'lucide-react';

export interface EvoWorldMapProps {
  passport: UserHardwarePassport | null;
  completedChaptersCount: number;
  onEnterZone: (zone: EvoLabZone) => void;
  initialZoneId?: string;
  onInspectCore?: () => void;
  activeProfile?: EvoNarrativeProfile;
  onChangeProfile?: (profile: EvoNarrativeProfile) => void;
  onOpenTomo?: (tomoId: string) => void;
  onNavigateBootLab?: () => void;
  onNavigateHotSwapLab?: (panel?: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'matrix' | 'all') => void;
  onNavigateWindowsMatrixLab?: (scenario?: string) => void;
  onNavigateLabCore?: () => void;
  onOpenForensicBench?: (target: ForensicBenchTarget) => void;
  onOpenDossier?: (tomoId: string) => void;
  onNavigateMagazine?: () => void;
  onNavigateTomo01?: () => void;
  onOpenCaseHistory?: () => void;
  initialIntention?: MainIntention;
  onOpenIntroPresentation?: () => void;
  onHardwareDetected?: (hardware: UserHardwarePassport) => void;
  onGoToChapter?: (chapterNumber: string) => void;
  onStartFinalExam?: () => void;
  onOpenCompletionScreen?: () => void;
  onOpenCoverageDashboard?: () => void;
  onOpenLiveScanAudit?: () => void;
  subViewBackHandlerRef?: React.MutableRefObject<(() => boolean) | null>;
  onIntentionChange?: (intention: MainIntention) => void;
  onSubViewStateChange?: (hasSubView: boolean) => void;
}

type MainIntention =
  | 'campus'
  | 'aprender'
  | 'practicar'
  | 'analizar'
  | 'herramientas'
  | 'mievo'
  | 'escuela'
  | 'biblioteca'
  | 'laboratorios'
  | 'diagnosticar'
  | 'progreso'
  | 'como-usar'
  | 'planes';

type LabSubTab = 'todos' | 'guiados' | 'simuladores' | 'experimentos' | 'casos';
type DiagnoseSubTab = 'expedientes' | 'consola' | 'pcb' | 'sectores';

const ToolMicrovisual: React.FC<{ toolId: string; actionKey: string; simpleName: string; accentColor: string }> = ({
  toolId,
  actionKey,
  simpleName,
  accentColor,
}) => {
  const isFPS = actionKey === 'metrology' || toolId.includes('fps') || simpleName.toLowerCase().includes('fps');
  const isBSOD = actionKey === 'bsod' || simpleName.toLowerCase().includes('bsod') || simpleName.toLowerCase().includes('pantalla');
  const isDPC = actionKey === 'software-kernel' || simpleName.toLowerCase().includes('latencia');
  const isBottleneck = actionKey === 'bottleneck' || simpleName.toLowerCase().includes('cuello');
  const isPCB = actionKey === 'operaciones' || simpleName.toLowerCase().includes('motherboard');
  const isWinInstall = simpleName.toLowerCase().includes('instalar windows');
  const isWinRepair = simpleName.toLowerCase().includes('reparar windows') || actionKey === 'sfc-dism';
  const isThermal = simpleName.toLowerCase().includes('temperatura') || simpleName.toLowerCase().includes('térmic');
  const isSSD = simpleName.toLowerCase().includes('ssd') || simpleName.toLowerCase().includes('almacenamiento') || simpleName.toLowerCase().includes('disco');
  const isPower = simpleName.toLowerCase().includes('fuente') || simpleName.toLowerCase().includes('voltaje');
  const isNetwork = simpleName.toLowerCase().includes('red') || simpleName.toLowerCase().includes('ping');

  return (
    <div className="w-full h-16 rounded-xl bg-zinc-950/80 border border-zinc-800/90 p-2.5 flex items-center justify-between relative overflow-hidden font-mono-tech select-none">
      {/* Background glow */}
      <div
        className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl opacity-15 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* Simulated badge */}
      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded bg-zinc-900/90 border border-zinc-700/60 text-[8px] font-bold text-zinc-400 tracking-wider">
        SIMULADO
      </div>

      {isFPS && (
        <div className="flex items-center gap-3 w-full pr-14">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[9px] text-zinc-400 font-bold">
              <span>FRAMETIME</span>
              <span className="text-emerald-400">1% LOW: 58.4 FPS</span>
            </div>
            <svg className="w-full h-5 text-emerald-400/90" viewBox="0 0 100 20" fill="none">
              <path
                d="M 0 14 Q 15 10, 30 13 T 60 6 T 75 17 T 100 8"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="75" cy="17" r="2" fill="#ef4444" />
            </svg>
          </div>
        </div>
      )}

      {isBSOD && (
        <div className="flex items-center gap-2.5 w-full pr-14">
          <div className="w-full bg-blue-950/80 border border-blue-500/30 rounded p-1.5 text-[9px] text-blue-200 space-y-0.5">
            <div className="font-bold text-blue-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>BSOD DUMP LOG</span>
            </div>
            <div className="text-[8px] text-zinc-400 truncate">CRITICAL_PROCESS_DIED (0x000000EF)</div>
          </div>
        </div>
      )}

      {isDPC && (
        <div className="flex flex-col justify-between h-full w-full pr-14 text-[9px]">
          <div className="flex justify-between text-zinc-400 font-bold">
            <span>DPC LATENCY</span>
            <span className="text-cyan-400">42.5 µs</span>
          </div>
          <div className="grid grid-cols-6 gap-1 items-end h-5">
            <div className="bg-cyan-500/40 h-2/3 rounded-sm" />
            <div className="bg-cyan-500/60 h-1/2 rounded-sm" />
            <div className="bg-cyan-400 h-full rounded-sm" />
            <div className="bg-cyan-500/50 h-3/4 rounded-sm" />
            <div className="bg-amber-400 h-5/6 rounded-sm" />
            <div className="bg-cyan-500/40 h-1/2 rounded-sm" />
          </div>
        </div>
      )}

      {isBottleneck && (
        <div className="w-full pr-14 space-y-1 text-[9px]">
          <div className="space-y-0.5">
            <div className="flex justify-between text-zinc-400">
              <span>CPU LOAD</span>
              <span className="text-amber-400 font-bold">72%</span>
            </div>
            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[72%]" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-zinc-400">
              <span>GPU LOAD</span>
              <span className="text-emerald-400 font-bold">98%</span>
            </div>
            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[98%]" />
            </div>
          </div>
        </div>
      )}

      {isPCB && (
        <div className="w-full pr-14 flex items-center gap-3">
          <svg className="w-10 h-8 text-purple-400/80 shrink-0" viewBox="0 0 48 48" fill="none">
            <rect x="2" y="2" width="44" height="44" rx="4" stroke="currentColor" strokeWidth="1" fill="#0f091a" />
            <rect x="14" y="14" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="24" x2="14" y2="24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="34" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1" />
            <circle cx="24" cy="24" r="4" fill="currentColor" fillOpacity="0.3" />
          </svg>
          <div className="text-[9px] text-purple-300 font-bold">ESQUEMÁTICO PCB VCORE</div>
        </div>
      )}

      {isWinInstall && (
        <div className="w-full pr-14 flex items-center gap-2.5">
          <div className="p-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="text-[9px] font-bold text-sky-300">NVMe SSD // GPT</div>
            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {isWinRepair && (
        <div className="w-full pr-14 bg-zinc-900/90 border border-zinc-800 rounded p-1 text-[9px] text-zinc-300 space-y-0.5">
          <div className="font-bold text-amber-400 flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            <span>SFC / DISM REPAIR</span>
          </div>
          <div className="text-[8px] font-mono text-emerald-400">System Files: 100% OK</div>
        </div>
      )}

      {isThermal && (
        <div className="w-full pr-14 space-y-1 text-[9px]">
          <div className="flex justify-between font-bold text-zinc-300">
            <span>TEMP CPU DIODE</span>
            <span className="text-orange-400">62.8 °C</span>
          </div>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-[65%]" />
          </div>
        </div>
      )}

      {isSSD && (
        <div className="w-full pr-14 flex items-center gap-2.5">
          <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5 text-[9px]">
            <div className="text-indigo-300 font-bold">SALUD S.M.A.R.T: 98%</div>
            <div className="text-zinc-400">3,400 MB/s Lectura</div>
          </div>
        </div>
      )}

      {isPower && (
        <div className="w-full pr-14 space-y-1 text-[9px]">
          <div className="flex justify-between font-bold text-zinc-300">
            <span>RIEL +12V</span>
            <span className="text-yellow-400">+12.04 V</span>
          </div>
          <svg className="w-full h-3 text-yellow-400/80" viewBox="0 0 100 12" fill="none">
            <path d="M 0 6 L 20 6 L 25 2 L 35 10 L 40 6 L 100 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      )}

      {isNetwork && (
        <div className="w-full pr-14 space-y-0.5 text-[9px]">
          <div className="flex justify-between font-bold text-zinc-300">
            <span>PING</span>
            <span className="text-blue-400">14 ms (Jitter 0)</span>
          </div>
          <div className="text-[8px] text-zinc-400">0% Packet Loss</div>
        </div>
      )}

      {!isFPS && !isBSOD && !isDPC && !isBottleneck && !isPCB && !isWinInstall && !isWinRepair && !isThermal && !isSSD && !isPower && !isNetwork && (
        <div className="w-full pr-14 flex items-center gap-2 text-[9px] text-zinc-300 font-bold">
          <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>EVO LABS TELEMETRÍA Y CONTROL</span>
        </div>
      )}
    </div>
  );
};

export const EvoWorldMap: React.FC<EvoWorldMapProps> = ({
  passport,
  completedChaptersCount,
  onEnterZone,
  initialZoneId,
  activeProfile = 'investigador',
  onChangeProfile = () => {},
  onOpenTomo = (_tomoId: string) => {},
  onNavigateBootLab,
  onNavigateHotSwapLab,
  onNavigateWindowsMatrixLab,
  onNavigateLabCore,
  onOpenForensicBench,
  onOpenDossier,
  onNavigateMagazine,
  onNavigateTomo01,
  onOpenCaseHistory,
  initialIntention = 'campus',
  onOpenIntroPresentation,
  onHardwareDetected,
  onGoToChapter,
  onStartFinalExam,
  onOpenCompletionScreen,
  onOpenCoverageDashboard,
  onOpenLiveScanAudit,
  subViewBackHandlerRef,
  onIntentionChange,
  onSubViewStateChange,
}) => {
  // Navigation State
  const [activeIntention, setActiveIntention] = useState<MainIntention>(initialIntention);
  const { canAccess, openUpgradeModal, isFreeUser } = useEvoAccess();
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number | null>(null);
  const [selectedTomeProfile, setSelectedTomeProfile] = useState<EvoTomePedagogicalProfile | null>(null);
  const [selectedLabGuide, setSelectedLabGuide] = useState<EvoLabPedagogicalGuide | null>(null);
  const [isLevel0IntroOpen, setIsLevel0IntroOpen] = useState<boolean>(false);
  const [isAutoDetectOpen, setIsAutoDetectOpen] = useState<boolean>(false);
  const [isCaseResolverOpen, setIsCaseResolverOpen] = useState<boolean>(false);
  const [isDigitalTwinOpen, setIsDigitalTwinOpen] = useState<boolean>(false);
  const [isForensicReportOpen, setIsForensicReportOpen] = useState<boolean>(false);
  const [isTechnicalDossierOpen, setIsTechnicalDossierOpen] = useState<boolean>(false);
  const [isContentFactoryOpen, setIsContentFactoryOpen] = useState<boolean>(false);
  const [isMethodGuideOpen, setIsMethodGuideOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isLatencyCalculatorOpen, setIsLatencyCalculatorOpen] = useState<boolean>(false);
  const [isBuildArchitectOpen, setIsBuildArchitectOpen] = useState<boolean>(false);
  const [inspectingClaim, setInspectingClaim] = useState<VerifiedClaim | null>(null);
  const [tomeInDevMessage, setTomeInDevMessage] = useState<string | null>(null);

  const onIntentionChangeRef = useRef(onIntentionChange);
  onIntentionChangeRef.current = onIntentionChange;

  useEffect(() => {
    onIntentionChangeRef.current?.(activeIntention);
  }, [activeIntention]);

  const hasSubView =
    selectedTomeProfile !== null ||
    selectedLevelNumber !== null ||
    selectedLabGuide !== null ||
    isLevel0IntroOpen ||
    isAutoDetectOpen ||
    isCaseResolverOpen ||
    isDigitalTwinOpen ||
    isForensicReportOpen ||
    isTechnicalDossierOpen ||
    isContentFactoryOpen ||
    isMethodGuideOpen ||
    isTransferModalOpen ||
    isLatencyCalculatorOpen ||
    isBuildArchitectOpen;

  useEffect(() => {
    onSubViewStateChange?.(hasSubView);
  }, [hasSubView, onSubViewStateChange]);

  useEffect(() => {
    if (subViewBackHandlerRef) {
      subViewBackHandlerRef.current = () => {
        if (selectedTomeProfile !== null) {
          setSelectedTomeProfile(null);
          return true;
        }
        if (selectedLabGuide !== null) {
          setSelectedLabGuide(null);
          return true;
        }
        if (selectedLevelNumber !== null) {
          setSelectedLevelNumber(null);
          return true;
        }
        if (isLevel0IntroOpen) {
          setIsLevel0IntroOpen(false);
          return true;
        }
        if (isCaseResolverOpen) {
          setIsCaseResolverOpen(false);
          return true;
        }
        if (isDigitalTwinOpen) {
          setIsDigitalTwinOpen(false);
          return true;
        }
        if (isAutoDetectOpen) {
          setIsAutoDetectOpen(false);
          return true;
        }
        if (isForensicReportOpen) {
          setIsForensicReportOpen(false);
          return true;
        }
        if (isTechnicalDossierOpen) {
          setIsTechnicalDossierOpen(false);
          return true;
        }
        if (isContentFactoryOpen) {
          setIsContentFactoryOpen(false);
          return true;
        }
        if (isMethodGuideOpen) {
          setIsMethodGuideOpen(false);
          return true;
        }
        if (isTransferModalOpen) {
          setIsTransferModalOpen(false);
          return true;
        }
        if (isLatencyCalculatorOpen) {
          setIsLatencyCalculatorOpen(false);
          return true;
        }
        if (isBuildArchitectOpen) {
          setIsBuildArchitectOpen(false);
          return true;
        }
        return false;
      };
    }
    return () => {
      if (subViewBackHandlerRef) {
        subViewBackHandlerRef.current = null;
      }
    };
  }, [
    selectedTomeProfile,
    selectedLabGuide,
    selectedLevelNumber,
    isLevel0IntroOpen,
    isCaseResolverOpen,
    isDigitalTwinOpen,
    isAutoDetectOpen,
    isForensicReportOpen,
    isTechnicalDossierOpen,
    isContentFactoryOpen,
    isMethodGuideOpen,
    isTransferModalOpen,
    isLatencyCalculatorOpen,
    isBuildArchitectOpen,
    subViewBackHandlerRef,
  ]);

  // Event listeners para apertura canónica y herramientas técnicas desacopladas
  useEffect(() => {
    const handleOpenAutoDetect = () => setIsAutoDetectOpen(true);
    const handleOpenCaseResolver = () => setIsCaseResolverOpen(true);
    const handleOpenDigitalTwin = () => setIsDigitalTwinOpen(true);
    const handleOpenForensicReport = () => setIsForensicReportOpen(true);
    const handleOpenContentFactory = () => setIsContentFactoryOpen(true);
    const handleOpenTransferChallenge = () => setIsTransferModalOpen(true);
    const handleOpenLatencyCalc = () => setIsLatencyCalculatorOpen(true);
    const handleOpenBuildArchitect = () => setIsBuildArchitectOpen(true);
    const handleOpenTechnicalDossier = () => setIsTechnicalDossierOpen(true);
    const handleOpenMethodGuide = () => setIsMethodGuideOpen(true);

    window.addEventListener('evo_open_autodetect', handleOpenAutoDetect);
    window.addEventListener('evo_open_case_resolver', handleOpenCaseResolver);
    window.addEventListener('evo_open_digital_twin', handleOpenDigitalTwin);
    window.addEventListener('evo_open_forensic_report', handleOpenForensicReport);
    window.addEventListener('evo_open_content_factory', handleOpenContentFactory);
    window.addEventListener('evo_open_transfer_challenge', handleOpenTransferChallenge);
    window.addEventListener('evo_open_latency_calc', handleOpenLatencyCalc);
    window.addEventListener('evo_open_build_architect', handleOpenBuildArchitect);
    window.addEventListener('evo_open_technical_dossier', handleOpenTechnicalDossier);
    window.addEventListener('evo_open_method_guide', handleOpenMethodGuide);

    return () => {
      window.removeEventListener('evo_open_autodetect', handleOpenAutoDetect);
      window.removeEventListener('evo_open_case_resolver', handleOpenCaseResolver);
      window.removeEventListener('evo_open_digital_twin', handleOpenDigitalTwin);
      window.removeEventListener('evo_open_forensic_report', handleOpenForensicReport);
      window.removeEventListener('evo_open_content_factory', handleOpenContentFactory);
      window.removeEventListener('evo_open_transfer_challenge', handleOpenTransferChallenge);
      window.removeEventListener('evo_open_latency_calc', handleOpenLatencyCalc);
      window.removeEventListener('evo_open_build_architect', handleOpenBuildArchitect);
      window.removeEventListener('evo_open_technical_dossier', handleOpenTechnicalDossier);
      window.removeEventListener('evo_open_method_guide', handleOpenMethodGuide);
    };
  }, []);

  // Evidence Engine State
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);

  const evidenceGraph = useMemo(() => {
    return EvoEvidenceEngine.getEvidenceGraph();
  }, [
    isChapter01Complete(),
    isChapter02Complete(),
    isChapter03Complete(),
    isChapter04Complete(),
    isChapter05Complete(),
    isChapter06Complete(),
    isChapter07Complete(),
    isTomo01ExamPassed(),
    isTomo01Complete(),
  ]);

  const skillGraphData = useMemo(() => {
    return EvoSkillGraphService.getSkillGraph();
  }, [
    isChapter01Complete(),
    isChapter02Complete(),
    isChapter03Complete(),
    isChapter04Complete(),
    isChapter05Complete(),
    isChapter06Complete(),
    isChapter07Complete(),
    isTomo01ExamPassed(),
    isTomo01Complete(),
  ]);

  const adaptiveAction = useMemo(() => {
    return EvoAdaptivePathService.getNextBestAction();
  }, [
    isChapter01Complete(),
    isChapter02Complete(),
    isChapter03Complete(),
    isChapter04Complete(),
    isChapter05Complete(),
    isChapter06Complete(),
    isChapter07Complete(),
    isTomo01ExamPassed(),
    isTomo01Complete(),
  ]);

  const handleExecuteAdaptiveAction = (actionKey: string, targetChapterId?: string, targetLabId?: string) => {
    if (actionKey === 'take_exam' && onStartFinalExam) {
      onStartFinalExam();
    } else if (actionKey === 'start_boot_lab' || actionKey === 'start_repair_lab' || actionKey === 'start_lab') {
      setActiveIntention('laboratorios');
    } else if (actionKey === 'continue_chapter' && onGoToChapter && targetChapterId) {
      onGoToChapter(targetChapterId);
    } else if (actionKey === 'open_cases') {
      setIsCaseResolverOpen(true);
    } else if (actionKey === 'audit_pc') {
      setIsAutoDetectOpen(true);
    } else if (actionKey === 'view_dossier') {
      setActiveIntention('progreso');
    } else if (onNavigateTomo01) {
      onNavigateTomo01();
    }
  };

  // Tools Search & Category Filter State
  const [toolSearchQuery, setToolSearchQuery] = useState<string>('');
  const [activeToolCategory, setActiveToolCategory] = useState<'all' | 'windows' | 'hardware' | 'rendimiento' | 'diagnostico' | 'terminal'>('all');

  const filteredTools = useMemo(() => {
    return EVO_TOOLS_BY_INTENT.filter((tool) => {
      let matchesCategory = activeToolCategory === 'all';
      if (activeToolCategory === 'windows') matchesCategory = tool.intentCategory === 'windows';
      else if (activeToolCategory === 'hardware') matchesCategory = tool.intentCategory === 'hardware';
      else if (activeToolCategory === 'rendimiento') matchesCategory = tool.intentCategory === 'rendimiento';
      else if (activeToolCategory === 'diagnostico') matchesCategory = tool.intentCategory === 'diagnostico';
      else if (activeToolCategory === 'terminal') matchesCategory = tool.intentCategory === 'experimentos' || tool.actionKey === 'consola';

      const q = toolSearchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        tool.simpleName.toLowerCase().includes(q) ||
        tool.whatItDoes.toLowerCase().includes(q) ||
        tool.whenToUse.toLowerCase().includes(q) ||
        tool.concepts.some((c) => c.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [activeToolCategory, toolSearchQuery]);

  // Sub-navigation tabs
  const [labSubTab, setLabSubTab] = useState<LabSubTab>('todos');
  const [diagnoseTab, setDiagnoseTab] = useState<DiagnoseSubTab>(() => initialZoneId ? 'consola' : 'expedientes');

  // Diagnostic area sub-state
  const [activeConsoleZoneId, setActiveConsoleZoneId] = useState<string>(() => initialZoneId || 'zona-1');

  const prevInitialZoneIdRef = useRef(initialZoneId);

  // Sync initialIntention and initialZoneId when changed externally
  useEffect(() => {
    if (initialZoneId && initialZoneId !== prevInitialZoneIdRef.current) {
      prevInitialZoneIdRef.current = initialZoneId;
      setActiveIntention('diagnosticar');
      setDiagnoseTab('consola');
      setActiveConsoleZoneId(initialZoneId);
    } else if (!initialZoneId) {
      prevInitialZoneIdRef.current = undefined;
      if (initialIntention) {
        setActiveIntention(initialIntention);
        setSelectedLevelNumber(null);
        setSelectedTomeProfile(null);
      }
    }
  }, [initialIntention, initialZoneId]);
  const [activeOverlay, setActiveOverlay] = useState<'default' | 'thermal' | 'signals' | 'power'>('default');
  const [inspectedComponent, setInspectedComponent] = useState<{
    id: string;
    name: string;
    detail: string;
  } | null>(null);
  const [activeWorkstationZone, setActiveWorkstationZone] = useState<EvoLabZone | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'in_construction'>('all');

  // -------------------------------------------------------------
  // DETECCIÓN DE PROGRESO REAL GUARDADO
  // -------------------------------------------------------------
  const realProgress = useMemo(() => {
    try {
      const isC01Done = isChapter01Complete();
      const isC02Done = isChapter02Complete();
      const isC03Done = isChapter03Complete();
      const isC04Done = isChapter04Complete();
      const isC05Done = isChapter05Complete();
      const isC06Done = isChapter06Complete();
      const isC07Done = isChapter07Complete();
      const isExamPassed = isTomo01ExamPassed();
      const isTomo01FullyDone = isTomo01Complete();

      // Boot lab real progress
      const isBootLabDone = localStorage.getItem('evo_boot_lab_completed') === 'true';

      // Check cases
      const savedCases = EvoCaseRepository.getAllCases();
      const resolvedCasesCount = savedCases.filter((c) => c.isClosed).length;

      // Determine last active point
      let lastActivity: {
        levelNumber: number;
        levelTitle: string;
        tomoNumber: string;
        title: string;
        detail: string;
        tag: string;
        onContinue: () => void;
      } | null = null;

      if (isTomo01FullyDone) {
        lastActivity = {
          levelNumber: 2,
          levelTitle: 'NIVEL 2: WINDOWS Y KERNEL',
          tomoNumber: '02',
          title: 'Tomo 02 // La Biblia Negra de Windows',
          detail: 'Completaste el Tomo 01 con examen aprobado. Tu próximo paso es explorar el kernel NT y arquitectura de Windows.',
          tag: 'SIGUIENTE PASO RECOMENDADO',
          onContinue: () => {
            if (onOpenCompletionScreen) onOpenCompletionScreen();
            else if (onOpenTomo) onOpenTomo('02');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC07Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Examen Final // Tomo 01: Conocé tu PC',
          detail: 'Tenés un examen pendiente. Completaste los 7 capítulos y el laboratorio final.',
          tag: 'EXAMEN PENDIENTE',
          onContinue: () => {
            if (onStartFinalExam) onStartFinalExam();
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC06Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Tomo 01 · Capítulo 07: Laboratorio Final',
          detail: 'Continuá Tomo 01 · Capítulo 07. Medir → cambiar una variable → volver a medir → concluir.',
          tag: 'CAPÍTULO PENDIENTE',
          onContinue: () => {
            if (onGoToChapter) onGoToChapter('07');
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC05Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Tomo 01 · Capítulo 06: Taller de Diagnóstico EVO',
          detail: 'Continuá Tomo 01 · Capítulo 06. Encontrá la falla con hipótesis deductiva y descarte pericial.',
          tag: 'CAPÍTULO PENDIENTE',
          onContinue: () => {
            if (onGoToChapter) onGoToChapter('06');
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC04Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Tomo 01 · Capítulo 05: Windows y Kernel',
          detail: 'Continuá Tomo 01 · Capítulo 05. Procesos, servicios, tareas e hilos del sistema en movimiento.',
          tag: 'CAPÍTULO PENDIENTE',
          onContinue: () => {
            if (onGoToChapter) onGoToChapter('05');
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC03Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Tomo 01 · Capítulo 04: Encontrá el Límite',
          detail: 'Continuá Tomo 01 · Capítulo 04. Cuello de botella, carga, temperatura y suministro eléctrico.',
          tag: 'CAPÍTULO PENDIENTE',
          onContinue: () => {
            if (onGoToChapter) onGoToChapter('04');
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC02Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Tomo 01 · Capítulo 03: Telemetría & FPS',
          detail: 'Continuá Tomo 01 · Capítulo 03. Captura de percentiles 1% low y fluidez comprobable.',
          tag: 'CAPÍTULO PENDIENTE',
          onContinue: () => {
            if (onGoToChapter) onGoToChapter('03');
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isC01Done) {
        lastActivity = {
          levelNumber: 1,
          levelTitle: 'NIVEL 1: CONOCER LA PC',
          tomoNumber: '01',
          title: 'Tomo 01 · Capítulo 02: El Viaje del Byte',
          detail: 'Continuá Tomo 01 · Capítulo 02. El diálogo real entre CPU, RAM, GPU y líneas PCIe.',
          tag: 'CAPÍTULO PENDIENTE',
          onContinue: () => {
            if (onGoToChapter) onGoToChapter('02');
            else if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateTomo01) onNavigateTomo01();
          },
        };
      } else if (isBootLabDone) {
        lastActivity = {
          levelNumber: 2,
          levelTitle: 'NIVEL 2: WINDOWS Y ARRANQUE',
          tomoNumber: '08',
          title: 'Tomo 08 // Laboratorio de Arranque y Fallas Guiado',
          detail: 'Recorrido de 35 estados y diagnóstico de señales completado.',
          tag: 'PRÁCTICA COMPLETADA',
          onContinue: () => {
            if (onNavigateBootLab) onNavigateBootLab();
          },
        };
      } else if (savedCases.length > 0) {
        const lastCase = savedCases[0];
        lastActivity = {
          levelNumber: 3,
          levelTitle: 'TALLER DE PERITAJE',
          tomoNumber: '03',
          title: `Taller Forense // ${lastCase.title}`,
          detail: `Estado: ${lastCase.isClosed ? 'Cerrado' : 'En investigación'} — ${lastCase.conclusionNotes || `Expediente ${lastCase.caseType}`}`,
          tag: 'EXPEDIENTE ACTIVO',
          onContinue: () => {
            if (onOpenCaseHistory) onOpenCaseHistory();
            else setActiveIntention('diagnosticar');
          },
        };
      }

      return {
        hasProgress: Boolean(lastActivity),
        lastActivity,
        isC01Done,
        isC02Done,
        isC03Done,
        isC04Done,
        isC05Done,
        isC06Done,
        isC07Done,
        isExamPassed,
        isTomo01FullyDone,
        isBootLabDone,
        resolvedCasesCount,
        totalCasesCount: savedCases.length,
        savedCases,
      };
    } catch {
      return {
        hasProgress: false,
        lastActivity: null,
        isC01Done: false,
        isC02Done: false,
        isC03Done: false,
        isC04Done: false,
        isC05Done: false,
        isC06Done: false,
        isC07Done: false,
        isExamPassed: false,
        isTomo01FullyDone: false,
        isBootLabDone: false,
        resolvedCasesCount: 0,
        totalCasesCount: 0,
        savedCases: [],
      };
    }
  }, [passport, onOpenTomo, onNavigateMagazine, onNavigateBootLab, onOpenCaseHistory]);

  // Handler universal para abrir un tomo
  const handleOpenTomoDirectly = (tomoNumber: string) => {
    executeTomoById(tomoNumber, {
      setCurrentView: (v) => {
        if (onOpenTomo) onOpenTomo(tomoNumber as any);
      },
      openDossierModal: (tId) => {
        if (onOpenDossier) onOpenDossier(tId);
      },
    });
  };

  // Handler para ejecutar el laboratorio desde la ficha o modal
  const handleExecuteLabAction = (actionKey: string, subParam?: string) => {
    if (actionKey === 'boot-lab' && onNavigateBootLab) {
      onNavigateBootLab();
    } else if (actionKey === 'hardware' && onNavigateHotSwapLab) {
      onNavigateHotSwapLab('hardware');
    } else if (actionKey === 'silicon' && onNavigateHotSwapLab) {
      onNavigateHotSwapLab('hardware');
    } else if ((actionKey === 'software-kernel' || actionKey === 'windows-matrix') && onNavigateWindowsMatrixLab) {
      onNavigateWindowsMatrixLab(subParam || 'services');
    } else if (actionKey === 'operaciones') {
      if (subParam === 'pcb') {
        setActiveIntention('diagnosticar');
        setDiagnoseTab('pcb');
      } else if (subParam === 'sectores') {
        setActiveIntention('diagnosticar');
        setDiagnoseTab('sectores');
      } else if (onNavigateLabCore) {
        onNavigateLabCore();
      } else {
        setActiveIntention('diagnosticar');
        setDiagnoseTab('sectores');
      }
    } else if (actionKey === 'metrology') {
      setActiveIntention('diagnosticar');
      setDiagnoseTab('simuladores');
    } else if (actionKey === 'telemetry' || actionKey === 'consola') {
      setActiveIntention('diagnosticar');
      setDiagnoseTab('consola');
    } else if (actionKey === 'core' && onNavigateLabCore) {
      onNavigateLabCore();
    }
  };

  // Master Tool execution handler routing all 34 tools BY TOOL.ID using canonical router
  const handleExecuteMasterTool = (tool: EvoToolDefinition) => {
    executeToolById(tool.id, {
      setCurrentView: (view) => {
        if (view === 'boot-lab' && onNavigateBootLab) onNavigateBootLab();
        else if (view === 'hotswap-lab' && onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
        else if (view === 'windows-matrix-lab' && onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
        else if (view === 'lab-core' && onNavigateLabCore) onNavigateLabCore();
        else setActiveIntention('diagnosticar');
      },
      setCampusSection: (sec) => setActiveIntention(sec),
      setActiveLabPanel: (panel) => {
        if (onNavigateHotSwapLab) onNavigateHotSwapLab(panel);
      },
      setLabCorePhase: (phase) => {
        if (onNavigateLabCore) onNavigateLabCore(phase as any);
      },
      setMatrixInitialScenario: (scenario) => {
        if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab(scenario);
      },
      setShowDiscoveryModal: (_val) => setIsAutoDetectOpen(true),
      setShowCoverageDashboard: (_val) => {
        if (onOpenCoverageDashboard) onOpenCoverageDashboard();
        else if (onNavigateLabCore) onNavigateLabCore();
      },
      setShowIntegrityModal: (_val) => {
        if (onOpenLiveScanAudit) onOpenLiveScanAudit();
      },
      openCaseResolver: () => setIsCaseResolverOpen(true),
      openDigitalTwin: () => setIsDigitalTwinOpen(true),
      openForensicReport: () => setIsForensicReportOpen(true),
      openContentFactory: () => setIsContentFactoryOpen(true),
      openTransferChallenge: () => setIsTransferModalOpen(true),
      openLatencyCalculator: () => setIsLatencyCalculatorOpen(true),
      openBuildArchitect: () => setIsBuildArchitectOpen(true),
      openDossierModal: (tId) => {
        if (onOpenDossier) onOpenDossier(tId);
      },
    });
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] evo-global-ambient-bg text-[#f4f4f5] overflow-x-hidden font-sans-editorial flex flex-col justify-between select-none">
      {/* Fondo Global Unificado: #07090E con cuadrícula 26x26px estática compartida */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          backgroundColor: '#07090e',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '26px 26px',
        }}
      />
      {activeIntention === 'campus' && <EvoWorldAmbientLayer />}

      {/* ========================================================================= */}
      {/* BREADCRUMB SUB-NIVEL (SÓLO SI HAY UN NIVEL O TOMO INTERNO ABIERTO)        */}
      {/* ========================================================================= */}
      {activeIntention !== 'campus' && (selectedLevelNumber !== null || selectedTomeProfile !== null) && (
        <div className="relative z-30 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3">
          <div className="px-3.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between font-mono-tech text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedLevelNumber(null);
                  setSelectedTomeProfile(null);
                }}
                className="text-zinc-400 hover:text-amber-400 font-bold transition-colors cursor-pointer"
              >
                ← Volver al mapa principal
              </button>

              {selectedLevelNumber !== null && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-bold text-[11px]">
                    NIVEL {selectedLevelNumber}
                  </span>
                </>
              )}

              {selectedTomeProfile && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-bold uppercase tracking-wider text-[11px]">
                    TOMO {selectedTomeProfile.tomoNumber}
                  </span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveIntention('campus');
                setSelectedLevelNumber(null);
                setSelectedTomeProfile(null);
              }}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 font-bold transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FRANJA DE BÚSQUEDA RÁPIDA GLOBAL (TOMOS, LABS, EXPEDIENTES, HERRAMIENTAS)  */}
      {/* ========================================================================= */}
      <div className="relative z-30 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <EvoQuickSearchBar
          onOpenTomo={(tomoNum) => handleOpenTomoDirectly(tomoNum)}
          onOpenLab={(actionKey, subParam) => handleExecuteLabAction(actionKey, subParam)}
          onOpenCase={(_caseId) => setIsCaseResolverOpen(true)}
          onOpenTool={(tool) => handleExecuteMasterTool(tool)}
        />
      </div>

      {/* ========================================================================= */}
      {/* CONSOLE_OPERATIVE_HUD // FRANJA COMPACTA SECUNDARIA (NO DOMINANTE)        */}
      {/* ========================================================================= */}
      {activeIntention !== 'campus' && (
        <div className="relative z-20 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <div className="rounded-xl bg-[#090b11]/80 border border-zinc-900/90 px-3.5 py-2.5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-2.5 font-mono-tech text-xs">
            {/* Izquierda: Ubicación y Estado */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap text-[11px]">
              <div className="flex items-center gap-1.5 font-bold uppercase text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="text-[10px] text-zinc-500">SYS_HUD</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 text-[10px] uppercase font-bold">UBICACIÓN:</span>
                <span className="text-zinc-200 font-bold uppercase">
                  {activeIntention === 'escuela' || activeIntention === 'biblioteca' ? 'TOMOS // TOMOS Y PUBLICACIONES' :
                   activeIntention === 'laboratorios' ? 'LABORATORIOS // BANCOS INTERACTIVOS' :
                   activeIntention === 'diagnosticar' ? 'ANALIZAR MI PC // EVO CORE' :
                   activeIntention === 'herramientas' ? 'HERRAMIENTAS // INSTRUMENTAL' :
                   activeIntention === 'como-usar' ? 'CÓMO USAR EVO // METODOLOGÍA & GUÍA' :
                   activeIntention === 'planes' ? 'PLANES // ACCESO Y PRECIOS' :
                   'MI EVO // EXPEDIENTE'}
                </span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 text-[10px] uppercase font-bold">ESTADO:</span>
                <span className="text-emerald-400 font-bold uppercase">ACTIVO</span>
              </div>
            </div>

            {/* Derecha: Siguiente Acción */}
            <div className="flex items-center gap-2 text-[11px] pt-1.5 md:pt-0 border-t md:border-t-0 border-zinc-900/60">
              <span className="text-amber-400 font-bold text-[10px] uppercase shrink-0">SIGUIENTE ACCIÓN:</span>
              <span className="text-zinc-300 truncate max-w-[280px] sm:max-w-xs">
                {activeIntention === 'escuela' || activeIntention === 'biblioteca' ? 'Abrir Tomo o acceder a Lab' :
                 activeIntention === 'laboratorios' ? 'Medir variables en simulación' :
                 activeIntention === 'diagnosticar' ? 'Revisar hipótesis y auditar silicio' :
                 activeIntention === 'herramientas' ? 'Abrir instrumental técnico' :
                 activeIntention === 'como-usar' ? 'Explorar el método y la guía paso a paso' :
                 activeIntention === 'planes' ? 'Elegir plan o compra de tomos' :
                 'Verificar acreditaciones y pasaporte'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. MUNDO EVO = INICIO COMERCIAL (EVO HOME EXPERIENCE)                     */}
      {/* ========================================================================= */}
      {activeIntention === 'campus' && (
        <EvoHomeExperience
          onNavigateAprender={() => {
            setActiveIntention('escuela');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigatePracticar={() => {
            setActiveIntention('laboratorios');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateAnalizar={() => {
            setActiveIntention('diagnosticar');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateHerramientas={() => {
            setActiveIntention('herramientas');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateComoUsar={() => {
            setActiveIntention('como-usar');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigatePlanes={() => {
            setActiveIntention('planes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateEntrar={() => {
            setActiveIntention('progreso');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenIntroPresentation={onOpenIntroPresentation}
          onOpenLevel0Intro={() => setIsLevel0IntroOpen(true)}
          onOpenCaseResolver={() => setIsCaseResolverOpen(true)}
          onOpenTomo={handleOpenTomoDirectly}
          onNavigateBootLab={onNavigateBootLab}
          onNavigateWindowsMatrixLab={onNavigateWindowsMatrixLab}
          onNavigateLabCore={onNavigateLabCore}
          onNavigateHotSwapLab={onNavigateHotSwapLab}
          onOpenDigitalTwin={() => setIsDigitalTwinOpen(true)}
          onExecuteTool={handleExecuteMasterTool}
          passport={passport}
        />
      )}

      {/* ========================================================================= */}
      {/* 2. SECCIÓN: ESCUELA EVO (RUTA POR NIVELES 0 AL 6)                         */}
      {/* ========================================================================= */}
      {/* RUTA POR NIVELES DESACTIVADA // TOMOS MUESTRA DIRECTAMENTE LOS 12 TOMOS */}
      {false && (
        <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="evo-page-title">
                  TOMOS // RUTA FORMATIVA GUIADA
                </h2>
              </div>
              <p className="evo-body-secondary">
                Orden pedagógico recomendado por niveles (0 al 6). EVO te indica qué aprender y qué hacer después.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono-tech text-xs">
                <button
                  type="button"
                  onClick={() => setActiveIntention('biblioteca')}
                  className="px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-zinc-400 hover:text-white flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>COLECCIÓN EVO · 12 TOMOS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIntention('escuela')}
                  className="px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer bg-amber-400 text-black shadow-md flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-black" />
                  <span>RUTA POR NIVELES</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsLevel0IntroOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono-tech text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>NIVEL 0</span>
              </button>
            </div>
          </div>

          {/* Banner de la Cadena Pedagógica Oficial EVO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#14120a] via-[#0d1017] to-[#080b12] border border-amber-400/40 space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
              <span className="font-mono-tech text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                CADENA PEDAGÓGICA PRINCIPAL // MÉTODO EVO
              </span>
              <span className="font-mono-tech text-[10px] text-zinc-400">
                “NO LO CREAS. COMPROBALO.”
              </span>
            </div>

            {/* Fases secuenciales - Diseñadas como una verdadera línea de recorrido técnico */}
            <div className="relative pt-2 pb-1">
              {/* Horizontal line connector */}
              <div className="absolute top-[26px] left-6 right-6 h-[1.5px] bg-zinc-900 z-0 hidden lg:block" />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center font-mono-tech text-[10px] text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]">1</div>
                  <span className="text-[10px] font-mono-tech text-amber-400 font-bold block">ENTENDER</span>
                  <span className="text-[9px] text-zinc-400">¿Qué aprendo?</span>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center font-mono-tech text-[10px] text-cyan-300 font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]">2</div>
                  <span className="text-[10px] font-mono-tech text-cyan-400 font-bold block">OBSERVAR</span>
                  <span className="text-[9px] text-zinc-400">¿Por qué sirve?</span>
                </div>

                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 border border-emerald-400 flex items-center justify-center font-mono-tech text-[10px] text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">3</div>
                  <span className="text-[10px] font-mono-tech text-emerald-400 font-bold block">PRACTICAR</span>
                  <span className="text-[9px] text-zinc-400">Manual del Lab</span>
                </div>

                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-purple-400/20 border border-purple-400 flex items-center justify-center font-mono-tech text-[10px] text-purple-300 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">4</div>
                  <span className="text-[10px] font-mono-tech text-purple-400 font-bold block">DIAGNOSTICAR</span>
                  <span className="text-[9px] text-zinc-400">Descarte real</span>
                </div>

                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-pink-400/20 border border-pink-400 flex items-center justify-center font-mono-tech text-[10px] text-pink-300 font-bold shadow-[0_0_10px_rgba(244,114,182,0.2)]">5</div>
                  <span className="text-[10px] font-mono-tech text-pink-400 font-bold block">COMPROBAR</span>
                  <span className="text-[9px] text-zinc-400">Validá métrica</span>
                </div>

                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="w-6 h-6 rounded-full bg-blue-400/20 border border-blue-400 flex items-center justify-center font-mono-tech text-[10px] text-blue-300 font-bold shadow-[0_0_10px_rgba(96,165,250,0.2)]">6</div>
                  <span className="text-[10px] font-mono-tech text-blue-400 font-bold block">AVANZAR</span>
                  <span className="text-[9px] text-zinc-400">¿Qué hago después?</span>
                </div>
              </div>
            </div>
          </div>

          {/* LISTA DE NIVELES PEDAGÓGICOS (0 A 6) */}
          <div className="space-y-4">
            {EVO_SCHOOL_LEVELS.filter((lvl) => lvl.levelNumber > 0).map((level) => {
              const isSelected = selectedLevelNumber === level.levelNumber;
              return (
                <div
                  key={level.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#0a0d16] border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                      : 'bg-[#090b12] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2.5 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase border"
                          style={{
                            color: level.accentColor,
                            backgroundColor: `${level.accentColor}15`,
                            borderColor: `${level.accentColor}40`,
                          }}
                        >
                          NIVEL {level.levelNumber}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono-tech uppercase">
                          {level.recommendedTag}
                        </span>
                      </div>

                      <h3 className="font-display font-black text-xl text-white">
                        {level.title}
                      </h3>

                      <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                        {level.subtitle}
                      </p>

                      <div className="text-xs text-zinc-400 font-sans-editorial pt-1">
                        <strong className="text-zinc-300 font-mono-tech">Objetivo: </strong>
                        {level.objective}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-mono-tech mr-2">
                        {level.tomos.length} TOMO(S)
                      </span>
                    </div>
                  </div>

                  {/* Tomos del Nivel (Tarjetas interactivas que abren la Ficha) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 mt-4 border-t border-zinc-900">
                    {level.tomos.map((tomoNum) => {
                      const profile = EVO_TOMES_PEDAGOGY[tomoNum];
                      if (!profile) return null;
                      const hasActiveLab = profile.associatedLabStatus === 'ACTIVO';
                      return (
                        <div
                          key={tomoNum}
                          className="p-3.5 rounded-xl evo-surface-level2 border border-zinc-900 hover:border-amber-400/30 transition-all flex flex-col justify-between gap-3 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold font-mono-tech text-amber-400">
                                TOMO {profile.tomoNumber}
                              </span>
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded font-bold font-mono-tech uppercase border ${
                                  hasActiveLab
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                                }`}
                              >
                                {hasActiveLab ? 'LAB ACTIVO' : 'LAB EN DESARROLLO'}
                              </span>
                            </div>

                            <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                              {profile.title}
                            </h4>

                            <p className="text-xs text-zinc-400 font-sans-editorial line-clamp-2">
                              {profile.tagline}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-zinc-900/80 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedTomeProfile(profile)}
                              className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-300 font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                              <span>VER FICHA PEDAGÓGICA</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECCIÓN: TOMOS EVO LABS (COLECCIÓN COMPLETA DE 12 TOMOS MAESTROS)       */}
      {/* ========================================================================= */}
      {(activeIntention === 'escuela' || activeIntention === 'biblioteca') && (() => {
        const isC07Done = isChapter07Complete();
        const isExamPassed = isTomo01ExamPassed();
        const isTomo01FullyDone = isTomo01Complete();
        const hasProgress = realProgress.hasProgress;

        // Determine Tomo 01 active study state
        let tomo01State = 'NO INICIADO';
        let tomo01StateColor = 'text-zinc-400 border-zinc-800 bg-zinc-900/30';
        let tomo01CTALabel = 'COMENZAR TOMO 01 →';
        let tomo01CTAAction = () => {
          if (onNavigateTomo01) onNavigateTomo01();
          else if (onOpenTomo) onOpenTomo('01');
        };

        if (isTomo01FullyDone) {
          tomo01State = 'APROBADO';
          tomo01StateColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
          tomo01CTALabel = 'VER ACREDITACIÓN →';
          tomo01CTAAction = () => {
            setActiveIntention('progreso');
          };
        } else if (isC07Done && !isExamPassed) {
          tomo01State = 'LISTO PARA EXAMEN';
          tomo01StateColor = 'text-orange-400 border-orange-500/30 bg-orange-500/10';
          tomo01CTALabel = 'RENDIR EXAMEN →';
          tomo01CTAAction = () => {
            if (onStartFinalExam) onStartFinalExam();
            else if (onNavigateTomo01) onNavigateTomo01();
          };
        } else if (hasProgress) {
          tomo01State = 'EN CURSO';
          tomo01StateColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
          tomo01CTALabel = 'CONTINUAR TOMO 01 →';
          tomo01CTAAction = () => {
            if (realProgress.lastActivity?.onContinue) {
              realProgress.lastActivity.onContinue();
            } else {
              if (onNavigateTomo01) onNavigateTomo01();
            }
          };
        }

        return (
          <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-10 transition-all duration-300">
            
            {/* 1. HEADER EDITORIAL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                  EVO LABS // BIBLIOTECA EDITORIAL
                </span>
                <h2 className="font-display font-black text-3xl text-white uppercase tracking-tight">
                  TOMOS
                </h2>
                <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed max-w-lg">
                  Tu biblioteca técnica dentro de EVO LABS. Construí conocimiento por capas. Entendé primero. Profundizá después. Comprobalo haciendo.
                </p>
              </div>

              {/* Sub-navigation */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-900 font-mono text-[11px]">
                <div className="px-3.5 py-1.5 rounded-lg font-bold bg-amber-400 text-black shadow-md flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-black" />
                  <span>CATÁLOGO OFICIAL (12 TOMOS)</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics & Philosophy Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tech">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
                <span className="text-[9px] text-zinc-500 uppercase block">CATÁLOGO COMPLETO</span>
                <span className="font-bold text-white">12 TOMOS MAESTROS</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
                <span className="text-[9px] text-zinc-500 uppercase block">METROLOGÍA</span>
                <span className="font-bold text-cyan-400">LABS INCLUIDOS</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
                <span className="text-[9px] text-zinc-500 uppercase block">RIGOR PERICIAL</span>
                <span className="font-bold text-amber-400">0 MITOS / 0 PLACEBOS</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
                <span className="text-[9px] text-zinc-500 uppercase block">ACREDITACIÓN</span>
                <span className="font-bold text-emerald-400">EXPEDIENTE LOCAL</span>
              </div>
            </div>

            {/* 2. LISTADO COMPLETO DE LOS 10 TOMOS EXPANDIDOS */}
            <div className="space-y-6">
              {EVO_TOMES_EXPANDED_DATA.map((tomeItem) => {
                const isTomo01 = tomeItem.number === '01';
                const progressPct = isTomo01 ? Math.round((completedChaptersCount / 7) * 100) : 0;
                const progressTxt = isTomo01 ? `${completedChaptersCount} de 7 capítulos (${tomo01State})` : undefined;

                return (
                  <EvoTomeCardExpanded
                    key={tomeItem.id}
                    tome={tomeItem}
                    isActiveStudy={isTomo01}
                    studyProgressPercentage={progressPct}
                    studyProgressText={progressTxt}
                    onOpenTomo={(tomoNum) => {
                      if (tomoNum === '01') {
                        if (onNavigateTomo01) onNavigateTomo01();
                        else if (onOpenTomo) onOpenTomo('01');
                      } else {
                        if (onOpenTomo) onOpenTomo(tomoNum as any);
                      }
                    }}
                    onOpenLab={(actionKey, tomoNum) => {
                      if (actionKey === 'hotswap') {
                        if (onNavigateHotSwapLab) onNavigateHotSwapLab();
                        else if (onOpenTomo) onOpenTomo('01');
                      } else if (actionKey === 'windows-matrix') {
                        if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
                      } else if (actionKey === 'lab-core') {
                        if (onNavigateLabCore) onNavigateLabCore();
                      } else if (actionKey === 'boot-lab') {
                        if (onNavigateBootLab) onNavigateBootLab();
                      } else if (tomoNum) {
                        if (onOpenTomo) onOpenTomo(tomoNum as any);
                      } else {
                        if (onOpenDossier) onOpenDossier((tomoNum || '01') as any);
                      }
                    }}
                    onOpenDossier={(tomoNum) => {
                      if (onOpenDossier) onOpenDossier(tomoNum as any);
                    }}
                    onOpenMagazine={(tomoNum) => {
                      if (tomoNum === '01') {
                        if (onNavigateMagazine) onNavigateMagazine();
                        else if (onOpenTomo) onOpenTomo('01');
                      } else {
                        if (onOpenTomo) onOpenTomo(tomoNum as any);
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* 3. TOMO STATUS POPUP ALERT */}
            {tomeInDevMessage && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                  <span>{tomeInDevMessage}</span>
                </div>
                <button 
                  onClick={() => setTomeInDevMessage(null)}
                  className="px-2 py-1 rounded bg-purple-900/40 text-purple-200 hover:bg-purple-900/80 font-bold transition-colors cursor-pointer"
                >
                  ENTENDIDO
                </button>
              </div>
            )}

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 4. SECCIÓN: PRACTICAR // ORGANIZACIÓN POR PROPÓSITO                      */}
      {/* ========================================================================= */}
      {activeIntention === 'laboratorios' && (
        <div className="relative z-10 flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-4">
          <EvoPublicLabsCatalog
            onOpenBootLab={() => {
              if (onNavigateBootLab) onNavigateBootLab();
              else if (onOpenTomo) onOpenTomo('08');
            }}
            onOpenWindowsMatrixLab={(scenario) => {
              if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab(scenario);
            }}
            onOpenHotSwapLab={(subPanel) => {
              if (onNavigateHotSwapLab) onNavigateHotSwapLab(subPanel);
            }}
            onOpenDigitalTwin={() => setIsDigitalTwinOpen(true)}
            onOpenCaseResolver={() => {
              if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab('crash-repair');
            }}
            onOpenTomo={onOpenTomo}
            onOpenPerfMetrology={() => {
              if (onNavigateHotSwapLab) onNavigateHotSwapLab('telemetry');
            }}
            onOpenNetForensics={() => {
              if (onOpenTomo) onOpenTomo('05');
            }}
            onOpenDefensiveSec={() => {
              if (onOpenTomo) onOpenTomo('06');
            }}
            onOpenCodeEng={() => {
              if (onOpenTomo) onOpenTomo('09');
            }}
            onOpenAiSystems={() => {
              if (onOpenTomo) onOpenTomo('10');
            }}
            onOpenGameForge={() => {
              if (onOpenTomo) onOpenTomo('12');
            }}
            onOpenTransferChallenge={() => {
              if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab('services');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SECCIÓN: ANALIZAR MI PC // DIAGNÓSTICO REAL & EVO CORE                  */}
      {/* ========================================================================= */}
      {activeIntention === 'diagnosticar' && (
        <div className="relative z-10 flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 select-none font-mono-tech">
          
          {/* Header Interno Simplificado & Limpio */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tech tracking-widest text-purple-400 uppercase font-black block">
                  ANALIZAR MI PC // DIAGNÓSTICO REAL SOBRE TU HARDWARE
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-purple-200 font-bold">
                  PROPIETARIO CANÓNICO
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                ANALIZAR MI PC
              </h1>
              <p className="text-xs sm:text-sm font-mono-tech font-bold text-purple-300 uppercase tracking-wide">
                DETECCIÓN, TELEMETRÍA, EVO CORE E INFORMES TÉCNICOS.
              </p>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial max-w-2xl leading-relaxed">
                Diagnóstico técnico real basado en tu hardware detectado. Sin datos simulados ni evaluaciones didácticas.
              </p>
            </div>

            {/* Link hacia LABORATORIOS para simulaciones */}
            <button
              type="button"
              onClick={() => setActiveIntention('laboratorios')}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-300 hover:text-white font-mono-tech text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
            >
              <span>IR A LABORATORIOS (BANCOS & SIMULACIONES) →</span>
            </button>
          </div>

          {/* Banner Principal: ACÁ NO SIMULAMOS. ACÁ ANALIZAMOS TU EQUIPO. */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#170e24] via-[#0e1017] to-[#080a11] border border-purple-500/30 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[10px] font-mono-tech text-purple-300 font-black uppercase tracking-widest">
                    PRINCIPIO DE EVIDENCIA REAL EVO LABS
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-purple-200 font-bold">
                    PROCEDENCIA ESTRICTA
                  </span>
                </div>
                <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                  ACÁ NO SIMULAMOS. ACÁ ANALIZAMOS TU EQUIPO.
                </h3>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-xl">
                  Cada diagnóstico clasifica rigurosamente la procedencia de los datos: <strong className="text-purple-300 font-mono">REPORTED_SYSTEM</strong> (WMI/Driver), <strong className="text-emerald-300 font-mono">MEASURED</strong> (Telemetría live) o <strong className="text-zinc-400 font-mono">UNKNOWN</strong> si no hay medición disponible.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAutoDetectOpen(true)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-mono-tech text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    <Cpu className="w-4 h-4 text-black" />
                    <span>{passport ? 'ACTUALIZAR DETECCIÓN' : 'DETECTAR MI EQUIPO'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForensicReportOpen(true)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileSearch className="w-4 h-4 text-cyan-400" />
                    <span>INFORME PERICIAL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Pasaporte de Hardware Detectado */}
          {passport ? (
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-purple-500/30 font-mono-tech space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs text-purple-300 font-bold uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  PASAPORTE TÉCNICO REGISTRADO // PROCEDENCIA: REPORTED_SYSTEM
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  ● VERIFICADO
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#090b11] border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] uppercase block font-bold">PROCESADOR (CPU)</span>
                  <span className="text-white font-bold block truncate mt-1">{passport.cpuModel || 'Detectado'}</span>
                  <span className="text-purple-300 text-[10px]">{passport.cores ? `${passport.cores} núcleos / ${passport.logicalProcessors || passport.cores} hilos` : 'Cores reportados'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#090b11] border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] uppercase block font-bold">MEMORIA RAM</span>
                  <span className="text-emerald-400 font-bold block mt-1">{passport.ramTotalGB ? `${passport.ramTotalGB} GB` : 'RAM Detectada'}</span>
                  <span className="text-zinc-400 text-[10px]">{passport.ramConfiguredClockMhz ? `${passport.ramConfiguredClockMhz} MHz` : 'Frecuencia WMI'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#090b11] border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] uppercase block font-bold">GRÁFICOS (GPU)</span>
                  <span className="text-amber-400 font-bold block truncate mt-1">{passport.gpuModel || 'GPU del sistema'}</span>
                  <span className="text-zinc-400 text-[10px]">{passport.gpuVramGB ? `${passport.gpuVramGB} GB VRAM` : 'Driver activo'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#090b11] border border-zinc-900">
                  <span className="text-zinc-500 text-[10px] uppercase block font-bold">SISTEMA OPERATIVO</span>
                  <span className="text-cyan-400 font-bold block truncate mt-1">{passport.osCaption || 'Windows NT'}</span>
                  <span className="text-zinc-400 text-[10px]">{passport.osBuild ? `Build ${passport.osBuild}` : 'Kernel verificado'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-zinc-300">
                  Aún no registraste el pasaporte técnico de tu PC. Procedencia actual: <strong className="text-amber-400 font-mono">UNKNOWN</strong>. Podés capturarlo en 5 segundos con el comando WMI seguro.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAutoDetectOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-purple-500 text-black hover:bg-purple-400 font-bold uppercase transition-all shrink-0 cursor-pointer shadow-md"
              >
                DETECTAR AHORA
              </button>
            </div>
          )}

          {/* Grilla de las 7 Funciones Canónicas de ANALIZAR MI PC */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-mono-tech font-bold uppercase text-purple-300">
                HERRAMIENTAS DE DIAGNÓSTICO Y MISIONES EVO CORE (7 CANÓNICAS)
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">PROPIEDAD: ANALIZAR MI PC</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. diag-autodetect-pc */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      diag-autodetect-pc
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                      REPORTED_SYSTEM
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Detección Directa de Hardware
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Captura WMI sin agentes de CPU, GPU, RAM, Motherboard y Build de Windows NT.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAutoDetectOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                >
                  <span>EJECUTAR DETECCIÓN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. diag-telemetry-integrity */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      diag-telemetry-integrity
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
                      MEASURED
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Integridad y Telemetría Live Scan
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Auditoría de integridad de datos, sensores activos y estado de telemetría del sistema.
                  </p>
                </div>
                {isFreeUser ? (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal('Integridad y Telemetría Live Scan')}
                    className="w-full py-2 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>REQUIERE PLAN // VER PLANES</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenLiveScanAudit) onOpenLiveScanAudit();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <span>REVISAR INTEGRIDAD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 3. diag-bottleneck-calc */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      diag-bottleneck-calc
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                      CALCULATED
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Calculador de Cuello de Botella
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Evaluación de balance de renderizado entre CPU y GPU según resolución y perfil.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateLabCore) onNavigateLabCore();
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                >
                  <span>CALCULAR CUELLO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4. med-stress-stability */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      med-stress-stability
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-rose-400 border border-zinc-800">
                      MEASURED
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Pruebas de Estrés y Estabilidad
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Ensayo de estabilidad térmica y eléctrica de componentes bajo carga en EVO Core.
                  </p>
                </div>
                {isFreeUser ? (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal('Pruebas de Estrés y Estabilidad (EVO Core)')}
                    className="w-full py-2 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>REQUIERE PLAN // VER PLANES</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateLabCore) onNavigateLabCore();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <span>PROBAR ESTABILIDAD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 5. rep-core-repair-view */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      rep-core-repair-view
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-purple-300 border border-zinc-800">
                      DERIVED
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Reparación & Bench EVO Core
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Taller de descarte físico de fallas de arranque y rieles de tensión.
                  </p>
                </div>
                {isFreeUser ? (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal('Reparación & Bench EVO Core')}
                    className="w-full py-2 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>REQUIERE PLAN // VER PLANES</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateLabCore) onNavigateLabCore();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <span>ABRIR BENCH REPARACIÓN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 6. opt-core-optimization */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      opt-core-optimization
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                      CALCULATED
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Optimización Core de Windows
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Ajustes de latencia, servicios NT y rendimiento para el sistema del usuario.
                  </p>
                </div>
                {isFreeUser ? (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal('Optimización Core de Windows')}
                    className="w-full py-2 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>REQUIERE PLAN // VER PLANES</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateLabCore) onNavigateLabCore();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <span>OPTIMIZAR SISTEMA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 7. opt-upgrade-simulator */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between gap-3 group md:col-span-2 lg:col-span-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                      opt-upgrade-simulator
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-amber-400 border border-zinc-800">
                      ESTIMATED
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                    Simulador ROI Upgrade
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Estimación de retorno de inversión de FPS/Rendimiento por cambio de componente.
                  </p>
                </div>
                {isFreeUser ? (
                  <button
                    type="button"
                    onClick={() => openUpgradeModal('Simulador ROI Upgrade')}
                    className="w-full py-2 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>REQUIERE PLAN // VER PLANES</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateLabCore) onNavigateLabCore();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-purple-500 hover:text-black text-purple-300 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                  >
                    <span>EVALUAR UPGRADE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sub-herramienta 1: EXPEDIENTES Y CASOS */}
          {diagnoseTab === 'expedientes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 border-b border-zinc-800 pb-2">
                <span>HISTORIAL DE PERITAJES Y CASOS REGISTRADOS</span>
                <span>{realProgress.savedCases.length} EXPEDIENTES EN MEMORIA</span>
              </div>

              {realProgress.savedCases.length === 0 ? (
                <div className="p-8 rounded-2xl border border-zinc-800 bg-[#090c13] text-center space-y-4">
                  <FolderGit2 className="w-10 h-10 text-purple-400 mx-auto opacity-70" />
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-white text-base">
                      NO HAY CASOS REGISTRADOS EN ESTA SESIÓN
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial max-w-md mx-auto">
                      Podés iniciar un nuevo diagnóstico sobre tu equipo en EVO Core o practicar en los laboratorios interactivos.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveIntention('laboratorios')}
                      className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer"
                    >
                      IR A LABORATORIOS EXPERIMENTALES →
                    </button>
                    {onNavigateLabCore && (
                      <button
                        type="button"
                        onClick={() => onNavigateLabCore()}
                        className="px-4 py-2 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer"
                      >
                        ABRIR TALLER DE REPARACIÓN EVO CORE
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {realProgress.savedCases.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl evo-surface-level2 border border-zinc-900 hover:border-purple-400/30 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm font-mono-tech">{c.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans-editorial">
                        {c.conclusionNotes || `Expediente de ${c.caseType} // Máquina: ${c.machine?.name || 'Estación de prueba'}`}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono-tech border-t border-zinc-900">
                        <span className="text-purple-400 font-bold">
                          ESTADO: {c.isClosed ? 'RESUELTO' : 'EN INVESTIGACIÓN'}
                        </span>
                        {onOpenCaseHistory && (
                          <button
                            type="button"
                            onClick={onOpenCaseHistory}
                            className="text-amber-400 hover:underline cursor-pointer"
                          >
                            Ver expediente completo →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-herramienta 2: ESQUEMÁTICO PCB INTERACTIVO */}
          {diagnoseTab === 'pcb' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
                <span className="text-zinc-400">
                  TOPOLOGÍA Y CAPAS TÉRMICAS / VOLTAJES DE MOTHERBOARD
                </span>
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
                  {(['default', 'thermal', 'signals', 'power'] as const).map((overlay) => (
                    <button
                      key={overlay}
                      type="button"
                      onClick={() => setActiveOverlay(overlay)}
                      className={`px-2.5 py-1 rounded text-[11px] uppercase font-bold transition-all cursor-pointer ${
                        activeOverlay === overlay
                          ? 'bg-purple-400 text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {overlay === 'default' && 'Normal'}
                      {overlay === 'thermal' && 'Térmico'}
                      {overlay === 'signals' && 'Señales'}
                      {overlay === 'power' && 'Voltajes'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#080b11] border border-zinc-800 shadow-2xl overflow-hidden">
                <EvoMotherboardCanvas
                  activeOverlay={activeOverlay}
                  onSelectComponent={(id, name, detail) => setInspectedComponent({ id, name, detail })}
                />
              </div>
            </div>
          )}

          {/* Sub-herramienta 3: 8 SECTORES DE INSTALACIÓN */}
          {diagnoseTab === 'sectores' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
                <span>ESTACIONES DE TRABAJO // 8 SECTORES PERICIALES</span>
                <div className="flex items-center gap-2">
                  {(['all', 'active', 'in_construction'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setActiveFilter(f)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        activeFilter === f
                          ? 'bg-purple-400 text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {f === 'all' && 'Todos'}
                      {f === 'active' && 'Activos'}
                      {f === 'in_construction' && 'En Obra'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {EVO_WORLD_ZONES.filter((z) => {
                  if (activeFilter === 'active') return z.statusCode === 'active';
                  if (activeFilter === 'in_construction') return z.statusCode !== 'active';
                  return true;
                }).map((zone) => (
                  <div
                    key={zone.id}
                    className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono-tech">
                        <span className="font-bold text-purple-400">SECTOR {zone.number}</span>
                        <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {zone.statusBadge}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                        {zone.title}
                      </h4>
                      <p className="text-xs text-zinc-400 font-sans-editorial line-clamp-2 leading-relaxed">
                        {zone.subtitle || zone.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveWorkstationZone(zone)}
                      className="w-full py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-400 text-zinc-200 hover:text-white font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                    >
                      <Microchip className="w-3.5 h-3.5 text-purple-400" />
                      <span>PERITAR SECTOR</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-herramienta 4: CONSOLA DE 8 LABORATORIOS */}
          {diagnoseTab === 'consola' && (
            <div className="space-y-4">
              <EvoLabConsole
                initialZoneId={activeConsoleZoneId}
                passport={passport}
                onBackToMap={() => setDiagnoseTab('sectores')}
                onEnterTomo01={onNavigateTomo01 || (() => {})}
                onEnterMagazine={onNavigateMagazine || (() => {})}
                onEnterTomo02={() => onOpenTomo?.('02')}
                onEnterTomo03={() => onOpenTomo?.('03')}
                onEnterTomo04={() => onOpenTomo?.('04')}
                onOpenTomo={handleOpenTomoDirectly}
              />
            </div>
          )}

          {/* Sub-herramienta 5: SIMULADORES FÍSICOS */}
          {diagnoseTab === 'simuladores' && (
            <div className="space-y-4">
              <EvoLiveBenchSuite passport={passport} />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SECCIÓN: MI EVO // IDENTIDAD TÉCNICA Y EXPEDIENTE PROFESIONAL          */}
      {/* ========================================================================= */}
      {(activeIntention === 'progreso' || activeIntention === 'mievo') && (
        <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h2 className="evo-page-title">
                  MI EVO // IDENTIDAD TÉCNICA Y EXPEDIENTE PROFESIONAL
                </h2>
              </div>
              <p className="evo-body-secondary italic">
                “Tu trayectoria pericial demostrada con evidencia empírica.” Habilidades comprobadas, certificaciones y expedientes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsTechnicalDossierOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono-tech text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Award className="w-4 h-4 text-black" />
              <span>EXPEDIENTE TÉCNICO COMPLETO (FASE 06) →</span>
            </button>
          </div>

          {/* Pasaporte & Resumen Global */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Rango Pericial</div>
              <div className="text-sm font-bold text-amber-400 font-mono-tech truncate">
                {realProgress.hasProgress && realProgress.lastActivity
                  ? realProgress.lastActivity.levelTitle
                  : 'Nivel 0 // Inicial'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Tomo 01: Conocé tu PC</div>
              <div className="text-sm font-bold text-white font-mono-tech">
                {completedChaptersCount} de 7 capítulos ({Math.round((completedChaptersCount / 7) * 100)}%)
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Examen & Certificado</div>
              <div className="text-sm font-bold font-mono-tech">
                {realProgress.isExamPassed ? (
                  <span className="text-emerald-400">APROBADO (≥70%)</span>
                ) : realProgress.isC07Done ? (
                  <span className="text-amber-400">LISTO PARA RENDIR</span>
                ) : (
                  <span className="text-zinc-500">EN FORMACIÓN</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Casos Forenses Resueltos</div>
              <div className="text-sm font-bold text-white font-mono-tech">
                {realProgress.resolvedCasesCount} de {realProgress.totalCasesCount} expedientes
              </div>
            </div>
          </div>

          {/* FIRMA DE TRAZABILIDAD PERICIAL // EVOLUTION TRACE */}
          <EvoEvolutionTrace nodes={evidenceGraph.traceNodes} />

          {/* SIGUIENTE MEJOR ACCIÓN // ADAPTIVE PATH ENGINE */}
          <EvoNextBestActionBanner
            action={adaptiveAction}
            onExecuteAction={handleExecuteAdaptiveAction}
          />

          {/* MAPA DE CAPACIDADES // EVO SKILL GRAPH (MATRIZ REAL DE HABILIDADES VERIFICABLES) */}
          <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800/80 pb-4 gap-3">
              <div className="space-y-1">
                <span className="font-mono-tech font-bold text-white text-xs uppercase flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  MAPA DE CAPACIDADES // EVO SKILL GRAPH
                </span>
                <p className="text-[11px] text-zinc-400 font-sans-editorial">
                  Matriz técnica de capacidades. Un nodo solo cambia de estado si existe evidencia empírica en tu expediente. Sin XP ni niveles arbitrarios.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap font-mono-tech text-[10px]">
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  VERIFICADAS: {skillGraphData.verifiedCount}
                </span>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  DEMOSTRADAS: {skillGraphData.demonstratedCount}
                </span>
                <span className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  EN DESARROLLO: {skillGraphData.inDevelopmentCount}
                </span>
                <span className="px-2 py-1 rounded bg-zinc-900 text-zinc-500 border border-zinc-800 font-bold">
                  NO OBSERVADAS: {skillGraphData.unobservedCount}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillGraphData.nodes.map((node) => {
                const isExpanded = selectedCapabilityId === node.id;
                return (
                  <div
                    key={node.id}
                    className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 space-y-3 flex flex-col justify-between hover:border-zinc-700/80 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono-tech font-bold text-xs text-white uppercase tracking-tight leading-snug">
                          {node.name}
                        </span>
                        <span
                          className={`shrink-0 px-2.5 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase border ${
                            node.status === 'VERIFICADA'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                              : node.status === 'DEMOSTRADA'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/10'
                              : node.status === 'EN_DESARROLLO'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                              : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                          }`}
                        >
                          {node.statusLabel}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                        {node.description}
                      </p>

                      {/* GRAFO NODE CONNECTIONS */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-mono-tech">
                        {node.supports.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            SOPORTA: {node.supports.join(', ')}
                          </span>
                        )}
                        {node.unlocks.length > 0 && (
                          <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            DESBLOQUEA: {node.unlocks[0]}
                          </span>
                        )}
                      </div>

                      {/* TRAZABILIDAD & EXPLICACIÓN EXPANDIDA */}
                      {isExpanded && (
                        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono-tech space-y-3 animate-in fade-in">
                          <div className="space-y-1">
                            <span className="text-amber-400 font-bold uppercase text-[9.5px] block">
                              ¿POR QUÉ EVO EVALÚA ESTE ESTADO?
                            </span>
                            <p className="text-zinc-200 font-sans-editorial leading-normal">
                              {node.traceability.whyState}
                            </p>
                          </div>

                          {/* CHECKLIST DE REQUISITOS */}
                          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                            <span className="text-zinc-400 text-[9px] uppercase font-bold block">
                              CHECKLIST DE TRAZABILIDAD Y EVIDENCIA:
                            </span>
                            <div className="space-y-1">
                              {node.traceability.checklist.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between text-[10px] p-1.5 rounded bg-black/50 border border-zinc-800/60"
                                >
                                  <span className="flex items-center gap-1.5 text-zinc-300">
                                    <span className={item.isDone ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>
                                      {item.isDone ? '✓' : '✗'}
                                    </span>
                                    <span>{item.label}</span>
                                  </span>
                                  <span className="text-[8px] text-zinc-500 uppercase">
                                    PARA {item.requiredFor}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* QUÉ FALTA */}
                          <div className="p-2 rounded bg-amber-400/5 border border-amber-400/20 text-[10px] text-amber-200/90">
                            <strong className="text-amber-400 uppercase text-[9px] block">QUÉ FALTA:</strong>
                            <span>{node.whatIsMissing}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCapabilityId(isExpanded ? null : node.id)}
                        className="text-[10px] font-mono-tech text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? 'OCULTAR TRAZABILIDAD ▲' : 'VER TRAZABILIDAD ▼'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (node.nextAction.actionKey === 'take_exam' && onStartFinalExam) {
                            onStartFinalExam();
                          } else if (node.nextAction.actionKey === 'start_lab') {
                            setActiveIntention('laboratorios');
                          } else if (node.nextAction.actionKey === 'continue_chapter' && onGoToChapter && node.nextAction.targetId) {
                            onGoToChapter(node.nextAction.targetId);
                          } else if (node.nextAction.actionKey === 'open_cases') {
                            setActiveIntention('herramientas');
                          } else if (onNavigateTomo01) {
                            onNavigateTomo01();
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9.5px] font-mono-tech font-bold uppercase transition-colors cursor-pointer"
                      >
                        {node.nextAction.label}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LÍNEA DE TIEMPO DE EVIDENCIAS REGISTRADAS (EVIDENCE TIMELINE) */}
          <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="space-y-0.5">
                <span className="font-mono-tech font-bold text-white text-xs uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  EVIDENCE TIMELINE // REGISTRO CRONOLÓGICO AUDITABLE
                </span>
                <p className="text-[11px] text-zinc-400 font-sans-editorial">
                  Cada evento pedagógico y metrológico genera un artefacto de evidencia con procedencia explícita.
                </p>
              </div>
              <span className="text-[10px] font-mono-tech text-emerald-400 font-bold">
                {evidenceGraph.evidences.length} EVENTOS
              </span>
            </div>

            {evidenceGraph.evidences.length > 0 ? (
              <div className="space-y-3 font-mono-tech">
                {evidenceGraph.evidences.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">{ev.title}</span>
                        <span className="px-2 py-0.2 rounded text-[8px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 uppercase">
                          {ev.provenance}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {ev.source}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-sans-editorial">
                        {ev.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-0.5">
                      <span className="text-[10px] text-amber-400 font-bold block">{ev.result}</span>
                      <span className="text-[9px] text-zinc-600 block">{ev.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-950/80 border border-dashed border-zinc-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="font-mono-tech font-bold text-sm text-zinc-200 uppercase">
                    SIN EVIDENCIA REGISTRADA
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial">
                    Todavía no completaste una práctica que genere evidencia técnica en tu pasaporte pericial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIntention('laboratorios')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>INICIAR PRÁCTICA →</span>
                </button>
              </div>
            )}
          </div>

          {/* LOS 4 PILARES COGNITIVOS DE IDENTIDAD TÉCNICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. QUÉ APRENDÍ */}
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  1. QUÉ APRENDÍ
                </span>
                <span className="text-[10px] text-amber-400 font-mono-tech font-bold">BASE TEÓRICA</span>
              </div>
              <ul className="space-y-2 text-xs font-sans-editorial text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Arquitectura de silicio:</strong> Física de semiconductores, zócalos, IMC y topología de memoria RAM.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Flujo del dato:</strong> Interconexión CPU, PCIe, GPU, latencias de caché y cuellos de botella reales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Kernel NT:</strong> La frontera entre Ring 0 y Ring 3, procesos, servicios e hilos del sistema operativo.</span>
                </li>
              </ul>
            </div>

            {/* 2. QUÉ DEMOSTRÉ */}
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  2. QUÉ DEMOSTRÉ
                </span>
                <span className="text-[10px] text-emerald-400 font-mono-tech font-bold">EVIDENCIA & EVALUACIÓN</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#090c13] border border-zinc-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Evaluación Teórica Tomo 01</span>
                    <span className="text-[11px] text-zinc-400">15 preguntas ponderadas de arquitectura y descarte</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold ${realProgress.isExamPassed ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                    {realProgress.isExamPassed ? 'APROBADO' : 'PENDIENTE'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#090c13] border border-zinc-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Certificación Oficial EVO</span>
                    <span className="text-[11px] text-zinc-400">Diploma metrológico imprimible y verificable</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold ${realProgress.isTomo01FullyDone ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                    {realProgress.isTomo01FullyDone ? 'EMITIDO' : 'BLOQUEADO'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. QUÉ PUEDO HACER */}
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  3. QUÉ PUEDO HACER
                </span>
                <span className="text-[10px] text-cyan-400 font-mono-tech font-bold">HABILIDADES PRÁCTICAS</span>
              </div>
              <ul className="space-y-2 text-xs font-sans-editorial text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Capturar frametimes y percentiles 1% low para evaluar fluidez real.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Auditar servicios en segundo plano y medir latencias DPC en Windows.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Diagnosticar fallas de arranque POST paso a paso con multímetro.</span>
                </li>
              </ul>
            </div>

            {/* 4. QUÉ ME FALTA */}
            <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono-tech font-bold text-white uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  4. QUÉ ME FALTA
                </span>
                <span className="text-[10px] text-purple-400 font-mono-tech font-bold">PRÓXIMOS DESAFÍOS</span>
              </div>
              <div className="space-y-2 text-xs font-sans-editorial">
                {!realProgress.isExamPassed ? (
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200">
                    <strong>Examen Tomo 01:</strong> Completá los capítulos restantes y rendí la prueba técnica.
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                    <strong>Tomo 02:</strong> Avanzá a "La Biblia Negra de Windows" para explorar el kernel NT.
                  </div>
                )}
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                  <strong>Taller de Casos:</strong> Resolver expedientes periciales complejos en el taller de incidentes.
                </div>
              </div>
            </div>
          </div>

          {/* Estado de Niveles de la Escuela */}
          <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="font-mono-tech font-bold text-white text-xs uppercase flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                ESTADO POR NIVELES // RUTA FORMATIVA EVO
              </span>
              <span className="text-[10px] text-zinc-500 font-mono-tech">
                DATOS REALES GUARDADOS
              </span>
            </div>

            <div className="space-y-2">
              {EVO_SCHOOL_LEVELS.map((lvl) => {
                let statusLabel: 'INICIADO' | 'EN CURSO' | 'COMPLETADO' | 'EN DESARROLLO' = 'EN CURSO';
                if (lvl.levelNumber === 0) statusLabel = 'INICIADO';
                else if (lvl.levelNumber === 1) statusLabel = realProgress.isTomo01FullyDone ? 'COMPLETADO' : realProgress.isC01Done ? 'EN CURSO' : 'INICIADO';
                else if (lvl.levelNumber === 2) statusLabel = realProgress.isBootLabDone ? 'COMPLETADO' : 'EN CURSO';
                else statusLabel = 'EN DESARROLLO';

                return (
                  <div
                    key={lvl.id}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono-tech"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-bold text-white shrink-0">NIVEL {lvl.levelNumber}:</span>
                      <span className="text-zinc-300 font-sans-editorial truncate">{lvl.title}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 border ${
                        statusLabel === 'COMPLETADO'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : statusLabel === 'EN CURSO'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : statusLabel === 'INICIADO'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EVIDENCIAS Y PASAPORTE TÉCNICO REGISTRADO */}
          <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="font-mono-tech font-bold text-white text-xs uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                EVIDENCIA Y PASAPORTE TÉCNICO REGISTRADO
              </span>
              <span className="text-[10px] text-zinc-500 font-mono-tech">PASAPORTE AUDITABLE</span>
            </div>

            {realProgress.resolvedCasesCount > 0 || realProgress.isBootLabDone ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-tech text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  EVIDENCIA REGISTRADA Y VERIFICADA
                </div>
                <p className="text-zinc-300 font-sans-editorial">
                  Se registraron {realProgress.resolvedCasesCount} expedientes resueltos y prácticas periciales completadas en el Pasaporte EVO.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-950/80 border border-dashed border-zinc-800 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="font-mono-tech font-bold text-sm text-zinc-200 uppercase">
                    SIN EVIDENCIA REGISTRADA
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans-editorial">
                    Todavía no completaste una práctica que genere evidencia técnica en tu pasaporte pericial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIntention('laboratorios')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>INICIAR PRÁCTICA →</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SECCIÓN: CATÁLOGO DE HERRAMIENTAS ORGANIZADAS POR FUNCIÓN               */}
      {/* ========================================================================= */}
      {activeIntention === 'herramientas' && (
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          <EvoPublicToolsCatalog
            onExecuteToolAction={handleExecuteMasterTool}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SECCIÓN: CÓMO USAR EVO (HUB DE METODOLOGÍA & GUÍA OPERATIVA)           */}
      {/* ========================================================================= */}
      {activeIntention === 'como-usar' && (
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          <EvoPublicHowToUse
            onNavigateTomos={() => {
              setActiveIntention('escuela');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateLabs={() => {
              setActiveIntention('laboratorios');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTools={() => {
              setActiveIntention('herramientas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateAnalyze={() => {
              setActiveIntention('diagnosticar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateMiEvo={() => {
              setActiveIntention('progreso');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SECCIÓN: PLANES Y PRECIOS                                              */}
      {/* ========================================================================= */}
      {activeIntention === 'planes' && (
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          <EvoPublicPricing
            onSelectPlan={(_planId) => {
              setActiveIntention('progreso');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTomoOption={() => {
              setActiveIntention('escuela');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FICHA PEDAGÓGICA UNIVERSAL DE CADA TOMO                           */}
      {/* ========================================================================= */}
      {selectedTomeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none font-mono-tech">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#090c14] border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header Ficha */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {selectedTomeProfile.levelName}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-display uppercase tracking-tight">
                  TOMO {selectedTomeProfile.tomoNumber}: {selectedTomeProfile.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTomeProfile(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Ficha */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
              
              {/* Recorrido Metodológico Universal (Visual) */}
              <div className="space-y-2 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  MÉTODO PEDAGÓGICO UNIVERSAL EVO LABS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 pt-1 text-[10px]">
                  {selectedTomeProfile.methodSteps.map((step, idx) => (
                    <div
                      key={step.stage}
                      className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-1 text-center"
                    >
                      <span className="text-amber-400 font-bold">{idx + 1}. {step.stage}</span>
                      <span className="text-zinc-500 font-sans-editorial text-[9px] line-clamp-2">
                        {step.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qué vas a aprender */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  QUÉ VAS A APRENDER
                </h4>
                <ul className="space-y-1.5 pl-5 list-disc text-zinc-300 font-sans-editorial text-xs sm:text-sm">
                  {selectedTomeProfile.whatYouWillLearn.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Por qué importa */}
              <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 space-y-1">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  POR QUÉ IMPORTA
                </h4>
                <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                  {selectedTomeProfile.whyItMatters}
                </p>
              </div>

              {/* Prerrequisitos recomendados */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  CONOCIMIENTOS PREVIOS RECOMENDADOS (GUÍA NO OBLIGATORIA)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTomeProfile.recommendedPrerequisites.map((req, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-sans-editorial"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Revista y Laboratorio Asociado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-900">
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                    REVISTA ASOCIADA
                  </span>
                  <div className="text-xs font-bold text-white font-sans-editorial">
                    {selectedTomeProfile.associatedMagazine}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">
                      LABORATORIO ASOCIADO
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.2 rounded font-bold uppercase border ${
                        selectedTomeProfile.associatedLabStatus === 'ACTIVO'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      }`}
                    >
                      {selectedTomeProfile.associatedLabStatus}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white font-sans-editorial">
                    {selectedTomeProfile.associatedLabTitle}
                  </div>
                </div>
              </div>

              {/* Resultado esperado */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                  RESULTADO ESPERADO DE APRENDIZAJE
                </span>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  {selectedTomeProfile.expectedOutcome}
                </p>
              </div>
            </div>

            {/* Footer Ficha con Botones */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedTomeProfile(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold transition-colors cursor-pointer"
              >
                VOLVER AL NIVEL
              </button>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {selectedTomeProfile.tomoNumber === '01' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTomeProfile(null);
                        if (onNavigateTomo01) onNavigateTomo01();
                        else if (onOpenTomo) onOpenTomo('01');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                      <BookOpen className="w-4 h-4 text-black" />
                      <span>EXPERIENCIA INTERACTIVA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTomeProfile(null);
                        if (onNavigateMagazine) onNavigateMagazine();
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>REVISTA A4</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTomeProfile(null);
                        if (onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      <Zap className="w-4 h-4 text-black" />
                      <span>LABORATORIO</span>
                    </button>
                  </>
                ) : selectedTomeProfile.tomoNumber === '02' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTomeProfile(null);
                        if (onOpenTomo) onOpenTomo('02');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                    >
                      <BookOpen className="w-4 h-4 text-black" />
                      <span>LEER TOMO 02</span>
                    </button>

                    {onNavigateWindowsMatrixLab && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTomeProfile(null);
                          onNavigateWindowsMatrixLab();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <Zap className="w-4 h-4 text-black" />
                        <span>LAB: WINDOWS MATRIX</span>
                      </button>
                    )}
                  </>
                ) : selectedTomeProfile.tomoNumber === '08' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTomeProfile(null);
                        if (onOpenTomo) onOpenTomo('08');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                    >
                      <BookOpen className="w-4 h-4 text-black" />
                      <span>LEER TOMO 08</span>
                    </button>

                    {onNavigateBootLab && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTomeProfile(null);
                          onNavigateBootLab();
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        <Power className="w-4 h-4 text-black" />
                        <span>LABORATORIO DE ARRANQUE</span>
                      </button>
                    )}
                  </>
                ) : selectedTomeProfile.tomoNumber === '03' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTomeProfile(null);
                        if (onOpenTomo) onOpenTomo('03');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      <BookOpen className="w-4 h-4 text-black" />
                      <span>LEER TOMO 03</span>
                    </button>

                    {onNavigateLabCore && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTomeProfile(null);
                          onNavigateLabCore();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-300 border border-emerald-500/50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Wrench className="w-4 h-4 text-emerald-400" />
                        <span>BANCO DE REPARACIÓN</span>
                      </button>
                    )}
                  </>
                ) : selectedTomeProfile.tomoNumber === '04' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTomeProfile(null);
                      if (onOpenTomo) onOpenTomo('04');
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>LEER TOMO 04</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const num = selectedTomeProfile.tomoNumber;
                      setSelectedTomeProfile(null);
                      if (onOpenTomo) onOpenTomo(num as any);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>LEER TOMO {selectedTomeProfile.tomoNumber}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTRODUCCIÓN ANIMADA / CÓMO FUNCIONA EVO LABS (NIVEL 0)             */}
      {/* ========================================================================= */}
      {isLevel0IntroOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 select-none font-mono-tech">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#090c14] border border-amber-400/50 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_25px_rgba(245,158,11,0.2)] flex flex-col overflow-hidden">
            
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    NIVEL 0 // INTRODUCCIÓN A LA ESCUELA
                  </span>
                  <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                    CÓMO FUNCIONA EVO LABS
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLevel0IntroOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans-editorial custom-scrollbar leading-relaxed">
              
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 space-y-1">
                <h4 className="font-display font-black text-sm text-amber-300 font-mono-tech uppercase">
                  MANIFIESTO TÉCNICO EVO LABS
                </h4>
                <p className="text-zinc-200 text-xs sm:text-sm">
                  “Hacemos milagros, pero los medimos. En EVO LABS no hay mitos, no hay placebos y no hay diagnósticos al azar. Todo conocimiento se comprueba empíricamente con mediciones y evidencia inmutable.”
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-amber-400 font-bold uppercase block">1. QUÉ ES UN TOMO</span>
                  <p className="text-zinc-300 font-sans-editorial text-xs">
                    Una revista técnica en formato A4 con explicaciones de ingeniería, diagramas de silicio y fundamentos teóricos sin relleno comercial.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-emerald-400 font-bold uppercase block">2. QUÉ ES UN LABORATORIO GUIADO</span>
                  <p className="text-zinc-300 font-sans-editorial text-xs">
                    Una práctica interactiva paso a paso asociada a un tomo para comprobar en el banco lo que acabás de leer.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase block">3. QUÉ ES UN LABORATORIO TÉCNICO</span>
                  <p className="text-zinc-300 font-sans-editorial text-xs">
                    Herramientas transversales (Hardware, Silicio, Metrología, Kernel) que podés usar en cualquier momento para medir y analizar.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                  <span className="text-purple-400 font-bold uppercase block">4. QUÉ ES UN CASO EVO</span>
                  <p className="text-zinc-300 font-sans-editorial text-xs">
                    Un expediente pericial donde recibís un problema real, investigás la evidencia, formulás hipótesis y emitís una conclusión técnica comprobable.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-white font-mono-tech uppercase block">
                  LOS 7 NIVELES RECOMENDADOS
                </span>
                <div className="space-y-1 text-xs text-zinc-300">
                  <div><strong>Nivel 0:</strong> Cómo usar EVO LABS (Metodología y herramientas)</div>
                  <div><strong>Nivel 1:</strong> Conocer la PC (Tomo 01 // Hardware & Silicio)</div>
                  <div><strong>Nivel 2:</strong> Windows y Arranque (Tomo 02 & Tomo 08 // 35 estados)</div>
                  <div><strong>Nivel 3:</strong> Diagnóstico y Reparación (Tomo 03 & Tomo 04)</div>
                  <div><strong>Nivel 4:</strong> Redes y Seguridad (Tomo 05 & Tomo 06)</div>
                  <div><strong>Nivel 5:</strong> Rendimiento y Gaming (Tomo 07 // Metrología)</div>
                  <div><strong>Nivel 6:</strong> Sistemas, Kernel y Forense (Tomo 09 & Tomo 10)</div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsLevel0IntroOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold transition-colors cursor-pointer"
              >
                ENTENDIDO
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLevel0IntroOpen(false);
                  setActiveIntention('escuela');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.35)]"
              >
                <span>ENTRAR A EVO LABS // TOMOS</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GUÍA UNIVERSAL ANTES DE CADA LABORATORIO (EvoLearningGuideModal)   */}
      {/* ========================================================================= */}
      <EvoLearningGuideModal
        guide={selectedLabGuide}
        isOpen={Boolean(selectedLabGuide)}
        onClose={() => setSelectedLabGuide(null)}
        onEnterLab={() => {
          if (selectedLabGuide) {
            const key = selectedLabGuide.actionKey;
            handleExecuteLabAction(key);
          }
        }}
        onReadRelatedTomo={() => {
          if (selectedLabGuide?.relatedTomoId) {
            const num = selectedLabGuide.relatedTomoId.replace('tomo-', '');
            handleOpenTomoDirectly(num);
          }
        }}
      />

      {/* Component Inspector Modal / Drawer (PCB) */}
      {inspectedComponent && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-[#0c0f18]/95 border-t-2 border-amber-400 backdrop-blur-xl shadow-2xl p-6 transition-transform duration-300 animate-in slide-in-from-bottom-6 select-none font-mono-tech">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  COMPONENTE PCB AUDITADO
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  RECORRIDO FÍSICO
                </span>
              </div>
              <h3 className="font-display font-black text-xl text-white">
                {inspectedComponent.name}
              </h3>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
                {inspectedComponent.detail}
              </p>
            </div>

            <button
              onClick={() => setInspectedComponent(null)}
              className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              CERRAR INSPECCIÓN
            </button>
          </div>
        </div>
      )}

      {/* Full-Feature Interactive Workstation Modal */}
      {activeWorkstationZone && (
        <EvoSectorWorkstationModal
          zone={activeWorkstationZone}
          passport={passport}
          onClose={() => setActiveWorkstationZone(null)}
          onOpenTomo={onOpenTomo}
          onOpenConsoleZone={(zoneId) => {
            setActiveWorkstationZone(null);
            setActiveIntention('diagnosticar');
            setDiagnoseTab('consola');
            setActiveConsoleZoneId(zoneId);
          }}
          activeProfile={activeProfile}
          onChangeProfile={onChangeProfile}
        />
      )}

      {/* Technical Case System Modal */}
      <EvoCaseResolverModal
        isOpen={isCaseResolverOpen}
        onClose={() => setIsCaseResolverOpen(false)}
      />

      {/* Interactive Digital Twin Modal */}
      <EvoDigitalTwinViewerModal
        isOpen={isDigitalTwinOpen}
        onClose={() => setIsDigitalTwinOpen(false)}
      />

      {/* Forensic Engine Modal */}
      <EvoForensicReportModal
        isOpen={isForensicReportOpen}
        onClose={() => setIsForensicReportOpen(false)}
      />

      {/* Technical Dossier / Verified Tech Profile Modal */}
      <EvoTechnicalDossierModal
        isOpen={isTechnicalDossierOpen}
        onClose={() => setIsTechnicalDossierOpen(false)}
      />

      {/* Inspector Modal ¿Por qué EVO afirma esto? */}
      <EvoWhyThisModal
        claim={inspectingClaim}
        isOpen={!!inspectingClaim}
        onClose={() => setInspectingClaim(null)}
      />

      {/* Auto Detect PC Modal */}
      <EvoAutoDetectPcModal
        isOpen={isAutoDetectOpen}
        onClose={() => setIsAutoDetectOpen(false)}
        onHardwareDetected={(hw) => {
          if (onHardwareDetected) onHardwareDetected(hw);
        }}
      />

      {/* Content & Lab Factory Modal */}
      <EvoContentFactoryModal
        isOpen={isContentFactoryOpen}
        onClose={() => setIsContentFactoryOpen(false)}
      />

      {/* EVO METHOD Guide Modal */}
      <EvoMethodGuideModal
        isOpen={isMethodGuideOpen}
        onClose={() => setIsMethodGuideOpen(false)}
      />

      {/* Cognitive Transfer Challenge Modal */}
      <EvoTransferChallengeModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />

      {/* Standalone RAM Latency Calculator Modal */}
      {isLatencyCalculatorOpen && (
        <EvoLatencyCalculator
          isModal={true}
          onClose={() => setIsLatencyCalculatorOpen(false)}
        />
      )}

      {/* Standalone PC Build Architect Modal */}
      {isBuildArchitectOpen && (
        <EvoPcBuildArchitect
          isModal={true}
          onClose={() => setIsBuildArchitectOpen(false)}
        />
      )}

      {/* Persistent Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-zinc-900 bg-zinc-950/70 flex items-center justify-between text-xs font-mono-tech text-zinc-500">
        <div>
          EVO LABS // <span className="text-zinc-300">"Hacemos milagros, pero los medimos."</span>
        </div>
        <div className="hidden sm:block text-zinc-600">
          EVO LABS // MUNDO EVO V3.5
        </div>
      </footer>
    </div>
  );
};
