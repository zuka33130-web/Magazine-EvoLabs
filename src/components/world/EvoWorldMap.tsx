import React, { useState, useMemo, useEffect } from 'react';
import {
  EvoLabZone,
  UserHardwarePassport,
  EvoNarrativeProfile,
} from '../../types';
import { ForensicBenchTarget } from '../common/EvoTomoDossierModal';
import { EVO_WORLD_ZONES } from '../../data/evoWorldData';
import { VOLUMES_COLLECTION } from '../../data/collections';
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
  ExternalLink,
  ShieldCheck,
  Zap,
  Laptop,
  Network,
  Shield,
  Gamepad2,
  Binary,
  Lock,
  RefreshCw,
  ChevronRight,
  CornerDownRight,
  FolderGit2,
  HardDrive,
  Filter,
  X,
  Grid,
  Play,
  RotateCcw,
  Compass,
  Trophy,
  Award,
  AlertTriangle,
  History,
  FileText,
  Boxes,
  Microchip,
  ChevronDown,
} from 'lucide-react';

export interface EvoWorldMapProps {
  passport: UserHardwarePassport | null;
  completedChaptersCount: number;
  onEnterZone: (zone: EvoLabZone) => void;
  onInspectCore?: () => void;
  activeProfile?: EvoNarrativeProfile;
  onChangeProfile?: (profile: EvoNarrativeProfile) => void;
  onOpenTomo?: (tomoId: '01' | '02' | '03' | '04' | '08') => void;
  onNavigateBootLab?: () => void;
  onNavigateHotSwapLab?: (panel?: 'hardware' | 'memory' | 'storage' | 'expansion' | 'silicon') => void;
  onNavigateWindowsMatrixLab?: (scenario?: string) => void;
  onNavigateLabCore?: () => void;
  onOpenForensicBench?: (target: ForensicBenchTarget) => void;
  onOpenDossier?: (tomoId: string) => void;
  onNavigateMagazine?: () => void;
  onNavigateTomo01?: () => void;
  onOpenCaseHistory?: () => void;
}

type MainIntention = 'campus' | 'aprender' | 'practicar' | 'diagnosticar' | 'progreso';
type LearnTab = 'rutas' | 'biblioteca';
type PracticeTab = 'todos' | 'guiados' | 'tecnicos';
type DiagnoseTab = 'expedientes' | 'pcb' | 'sectores' | 'consola' | 'simuladores';

export const EvoWorldMap: React.FC<EvoWorldMapProps> = ({
  passport,
  completedChaptersCount,
  onEnterZone,
  activeProfile = 'investigador',
  onChangeProfile = () => {},
  onOpenTomo = (_tomoId: '01' | '02' | '03' | '04' | '08') => {},
  onNavigateBootLab,
  onNavigateHotSwapLab,
  onNavigateWindowsMatrixLab,
  onNavigateLabCore,
  onOpenForensicBench,
  onOpenDossier,
  onNavigateMagazine,
  onNavigateTomo01,
  onOpenCaseHistory,
}) => {
  // Navigation State: Campus Principal (Intención inicial) o vistas específicas
  const [activeIntention, setActiveIntention] = useState<MainIntention>('campus');

  // Sub-navigation tabs
  const [learnTab, setLearnTab] = useState<LearnTab>('rutas');
  const [practiceTab, setPracticeTab] = useState<PracticeTab>('todos');
  const [diagnoseTab, setDiagnoseTab] = useState<DiagnoseTab>('expedientes');

  // Diagnostic area sub-state
  const [activeConsoleZoneId, setActiveConsoleZoneId] = useState<string>('zona-1');
  const [activeOverlay, setActiveOverlay] = useState<'default' | 'thermal' | 'signals' | 'power'>('default');
  const [inspectedComponent, setInspectedComponent] = useState<{
    id: string;
    name: string;
    detail: string;
  } | null>(null);
  const [activeWorkstationZone, setActiveWorkstationZone] = useState<EvoLabZone | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'in_construction'>('all');

  // Search filter inside practice/learn
  const [practiceSearch, setPracticeSearch] = useState<string>('');

  // -------------------------------------------------------------
  // DETECCIÓN DE PROGRESO REAL GUARDADO
  // -------------------------------------------------------------
  const realProgress = useMemo(() => {
    try {
      const hasPassport = Boolean(localStorage.getItem('evo_c01_specs')) || Boolean(passport);
      const isC01Done = localStorage.getItem('evo_c01_completed') === 'true' || hasPassport;
      const isC02Done = localStorage.getItem('evo_c02_status') === 'completed';
      const isC03Done = localStorage.getItem('evo_c03_status') === 'completed';
      const isC04Done = localStorage.getItem('evo_c04_status') === 'completed';
      const isC05Done = localStorage.getItem('evo_c05_status') === 'completed';
      const isC06Done = localStorage.getItem('evo_c06_status') === 'completed';
      const isC07Done = localStorage.getItem('evo_c07_status') === 'completed';

      // Check cases
      const savedCases = EvoCaseRepository.getAllCases();
      const resolvedCasesCount = savedCases.filter((c) => c.isClosed).length;

      // Determine last active point
      let lastActivity: {
        title: string;
        detail: string;
        tag: string;
        onContinue: () => void;
      } | null = null;

      if (isC07Done) {
        lastActivity = {
          title: 'Tomo 01 // Laboratorio Final Completado',
          detail: 'Certificación empírica de rendimiento y método A/B finalizado.',
          tag: 'TOMO 01 FINALIZADO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (isC06Done) {
        lastActivity = {
          title: 'Tomo 01 // Capítulo 07: Laboratorio Final',
          detail: 'Listo para iniciar el experimento final con método científico.',
          tag: 'EN CURSO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (isC05Done) {
        lastActivity = {
          title: 'Tomo 01 // Capítulo 06: Taller de Diagnóstico EVO',
          detail: 'Hipótesis deductiva y resolución pericial de fallas.',
          tag: 'EN CURSO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (isC04Done) {
        lastActivity = {
          title: 'Tomo 01 // Capítulo 05: Windows y Kernel',
          detail: 'Auditoría de servicios y subprocesos en segundo plano.',
          tag: 'EN CURSO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (isC03Done) {
        lastActivity = {
          title: 'Tomo 01 // Capítulo 04: Encontrá el Límite',
          detail: 'Estrés térmico, throttling y consumo de energía en watts.',
          tag: 'EN CURSO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (isC02Done) {
        lastActivity = {
          title: 'Tomo 01 // Capítulo 03: Telemetría & FPS',
          detail: 'Medición de frametimes y percentiles 1% low en tiempo real.',
          tag: 'EN CURSO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (isC01Done) {
        lastActivity = {
          title: 'Tomo 01 // Capítulo 02: Buses & Silicio',
          detail: 'Mapeo de transferencias electrónicas y líneas PCIe.',
          tag: 'EN CURSO',
          onContinue: () => {
            if (onOpenTomo) onOpenTomo('01');
            else if (onNavigateMagazine) onNavigateMagazine();
          },
        };
      } else if (savedCases.length > 0) {
        const lastCase = savedCases[0];
        lastActivity = {
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
        resolvedCasesCount: 0,
        totalCasesCount: 0,
        savedCases: [],
      };
    }
  }, [passport, onOpenTomo, onNavigateMagazine, onOpenCaseHistory]);

  // -------------------------------------------------------------
  // RUTAS DE APRENDIZAJE (Agrupación de Tomos existentes)
  // -------------------------------------------------------------
  const LEARNING_PATHS = useMemo(
    () => [
      {
        id: 'fundamentos',
        title: 'FUNDAMENTOS DE PC',
        subtitle: 'Arquitectura de hardware, buses de datos, silicio y telemetría de tu máquina.',
        tomosAssociated: [
          {
            number: '01',
            title: 'EVO LABS // CONOCÉ TU PC',
            tagline: 'Entendé tu máquina desde adentro.',
            id: 'tomo-01',
            action: () => (onOpenTomo ? onOpenTomo('01') : onOpenDossier?.('tomo-01')),
          },
        ],
        accent: '#EAB308',
        icon: Cpu,
        level: 'Nivel Inicial a Intermedio',
      },
      {
        id: 'reparacion',
        title: 'REPARACIÓN',
        subtitle: 'Diagnóstico deductivo de banco, multímetro en fuentes ATX, notebooks y secuencia de arranque.',
        tomosAssociated: [
          {
            number: '03',
            title: 'REPARACIÓN DE PC // SISTEMA EVO LABS',
            tagline: 'Nunca estuviste mejor guiado.',
            id: 'tomo-03',
            action: () => (onOpenTomo ? onOpenTomo('03') : onOpenDossier?.('tomo-03')),
          },
          {
            number: '04',
            title: 'REPARACIÓN DE NOTEBOOKS // SISTEMA EVO LABS',
            tagline: 'Diagnóstico real, paso a paso.',
            id: 'tomo-04',
            action: () => (onOpenTomo ? onOpenTomo('04') : onOpenDossier?.('tomo-04')),
          },
          {
            number: '08',
            title: 'SISTEMA EVO LABS DE ARRANQUE Y FALLAS',
            tagline: 'Del botón POWER al escritorio: arranque, diagnóstico y reparación como nunca te lo explicaron.',
            id: 'tomo-08',
            action: () => (onOpenTomo ? onOpenTomo('08') : onOpenDossier?.('tomo-08')),
          },
        ],
        accent: '#10B981',
        icon: Wrench,
        level: 'Nivel Taller & Diagnóstico',
      },
      {
        id: 'redes-ciberseguridad',
        title: 'REDES Y CIBERSEGURIDAD',
        subtitle: 'Tráfico de red, análisis de tramas con Wireshark, protocolos TCP/UDP y contramedidas defensivas.',
        tomosAssociated: [
          {
            number: '05',
            title: 'SISTEMA EVO LABS DE REDES',
            tagline: 'Entendé cómo se comunica tu PC, cómo viaja Internet y descubrí secretos PRO.',
            id: 'tomo-05',
            action: () => onOpenDossier?.('tomo-05'),
          },
          {
            number: '06',
            title: 'CIBERSEGURIDAD // SISTEMA EVO LABS',
            tagline: 'Desde cero hasta dominar tu red.',
            id: 'tomo-06',
            action: () => onOpenDossier?.('tomo-06'),
          },
        ],
        accent: '#06B6D4',
        icon: ShieldCheck,
        level: 'Nivel Infraestructura & Seguridad',
      },
      {
        id: 'gaming-performance',
        title: 'GAMING Y PERFORMANCE',
        subtitle: 'Metrología científica de frametimes, percentiles 1% low, latencias DPC y frame pacing.',
        tomosAssociated: [
          {
            number: '07',
            title: 'SISTEMA EVO LABS // GAMING PRO',
            tagline: 'Optimizamos de verdad. Sin secretos.',
            id: 'tomo-07',
            action: () => onOpenDossier?.('tomo-07'),
          },
        ],
        accent: '#F59E0B',
        icon: Gamepad2,
        level: 'Nivel Metrología Competitiva',
      },
      {
        id: 'sistemas-avanzados',
        title: 'SISTEMAS AVANZADOS',
        subtitle: 'Kernel NT y Linux, timer a 0.5ms, planificador de hilos híbridos, sysfs y cgroups.',
        tomosAssociated: [
          {
            number: '02',
            title: 'EVO LABS // LA BIBLIA NEGRA DE WINDOWS',
            tagline: 'El lado oculto de Windows. Descubrilo.',
            id: 'tomo-02',
            action: () => (onOpenTomo ? onOpenTomo('02') : onOpenDossier?.('tomo-02')),
          },
          {
            number: '09',
            title: 'SISTEMA EVO LABS DE SISTEMAS Y KERNEL',
            tagline: 'Entendé qué pasa debajo del sistema operativo.',
            id: 'tomo-09',
            action: () => onOpenDossier?.('tomo-09'),
          },
        ],
        accent: '#38BDF8',
        icon: Sliders,
        level: 'Nivel Kernel & Arquitectura OS',
      },
      {
        id: 'forense-ingenieria-inversa',
        title: 'FORENSE E INGENIERÍA INVERSA',
        subtitle: 'Desensamblado de binarios PE/ELF, volcados de memoria volátil y cadena de custodia pericial.',
        tomosAssociated: [
          {
            number: '10',
            title: 'SISTEMA EVO LABS // FORENSE E INGENIERÍA INVERSA',
            tagline: 'No mires sólo el resultado. Reconstruí lo que pasó.',
            id: 'tomo-10',
            action: () => onOpenDossier?.('tomo-10'),
          },
        ],
        accent: '#A855F7',
        icon: Binary,
        level: 'Nivel Peritaje Judicial',
      },
    ],
    [onOpenTomo, onOpenDossier]
  );

  // -------------------------------------------------------------
  // LABORATORIOS TÉCNICOS EVO (HERRAMIENTAS TRANSVERSALES)
  // Formato conciso: NOMBRE, descripción de 1 línea, estado, [ENTRAR]
  // -------------------------------------------------------------
  const TECHNICAL_LABS = useMemo(
    () => [
      {
        id: 'tech-boot',
        title: 'LABORATORIO DE ARRANQUE Y FALLAS GUIADO',
        description: 'Seguí señales, componentes y fallas paso a paso desde el botón POWER hasta Windows.',
        status: 'ACTIVO',
        accent: '#10B981',
        icon: Power,
        onEnter: () => onNavigateBootLab?.(),
      },
      {
        id: 'tech-hardware',
        title: 'LABORATORIO DE HARDWARE',
        description: 'Explorá componentes, compatibilidad y comportamiento físico de la PC en banco Hot-Swap.',
        status: 'DISPONIBLE',
        accent: '#F59E0B',
        icon: Wrench,
        onEnter: () => onNavigateHotSwapLab?.('hardware'),
      },
      {
        id: 'tech-silicon',
        title: 'LABORATORIO DE SILICIO',
        description: 'Entendé qué ocurre dentro del CPU, memoria y arquitectura interna de buses.',
        status: 'DISPONIBLE',
        accent: '#EAB308',
        icon: Sparkles,
        onEnter: () => onNavigateHotSwapLab?.('memory'),
      },
      {
        id: 'tech-metrology',
        title: 'LABORATORIO DE METROLOGÍA',
        description: 'Medí rendimiento, tiempos y diferencias reales con histogramas y percentiles 1% low.',
        status: 'DISPONIBLE',
        accent: '#EC4899',
        icon: Gauge,
        onEnter: () => {
          setActiveIntention('diagnosticar');
          setDiagnoseTab('simuladores');
        },
      },
      {
        id: 'tech-software-kernel',
        title: 'LABORATORIO DE SOFTWARE Y KERNEL',
        description: 'Observá qué ocurre debajo de Windows, subprocesos de Ring 0 y despacho DPC.',
        status: 'DISPONIBLE',
        accent: '#38BDF8',
        icon: Sliders,
        onEnter: () => onNavigateWindowsMatrixLab?.('scheduler-hybrid'),
      },
      {
        id: 'tech-telemetry',
        title: 'LABORATORIO DE TELEMETRÍA',
        description: 'Visualizá datos, voltajes, actividad y comportamiento en tiempo real del sistema.',
        status: 'ACTIVO',
        accent: '#06B6D4',
        icon: Radio,
        onEnter: () => {
          setActiveIntention('diagnosticar');
          setDiagnoseTab('consola');
        },
      },
      {
        id: 'tech-windows-kernel',
        title: 'LABORATORIO DE WINDOWS Y KERNEL',
        description: 'Investigá procesos, servicios, hive BCD, resolución de timer a 0.5ms y bootloader.',
        status: 'DISPONIBLE',
        accent: '#00D2FF',
        icon: Layers,
        onEnter: () => onNavigateWindowsMatrixLab?.(),
      },
    ],
    [onNavigateBootLab, onNavigateHotSwapLab, onNavigateWindowsMatrixLab]
  );

  // -------------------------------------------------------------
  // LABORATORIOS GUIADOS (ASOCIADOS A LOS 10 TOMOS)
  // Formato conciso: NOMBRE, descripción de 1 línea, estado, [ENTRAR]
  // -------------------------------------------------------------
  const TOMO_GUIDED_LABS = useMemo(
    () => [
      {
        id: 'lab-tomo-01',
        title: 'TOMO 01 // LABORATORIO DE SILICIO Y PERITAJE',
        description: 'Auditoría pericial de hardware, mapa de silicio y diálogo entre CPU y buses.',
        status: 'DISPONIBLE',
        accent: '#EAB308',
        icon: Cpu,
        onEnter: () => {
          if (onOpenForensicBench) {
            onOpenForensicBench({
              tomoId: 'tomo-01',
              moduleNumber: 'Cap 01',
              labView: 'hotswap-lab',
              station: 'station-ram',
            });
          } else if (onNavigateHotSwapLab) {
            onNavigateHotSwapLab('memory');
          }
        },
      },
      {
        id: 'lab-tomo-02',
        title: 'TOMO 02 // LABORATORIO DE WINDOWS Y KERNEL NT',
        description: 'Latencias DPC, timer resolution 0.5ms, planificador híbrido y servicios.',
        status: 'DISPONIBLE',
        accent: '#00D2FF',
        icon: Layers,
        onEnter: () => onNavigateWindowsMatrixLab?.(),
      },
      {
        id: 'lab-tomo-03',
        title: 'TOMO 03 // BANCO DE REPARACIÓN Y MULTÍMETRO ATX',
        description: 'Medición de rieles de 12V, cortocircuitos en VRM, buzzer BIOS y bucles de reinicio.',
        status: 'DISPONIBLE',
        accent: '#10B981',
        icon: Wrench,
        onEnter: () => {
          if (onOpenForensicBench) {
            onOpenForensicBench({
              tomoId: 'tomo-03',
              moduleNumber: 'Cap 36',
              labView: 'hotswap-lab',
              scenario: 'vrm-short',
            });
          } else if (onNavigateHotSwapLab) {
            onNavigateHotSwapLab('hardware');
          }
        },
      },
      {
        id: 'lab-tomo-04',
        title: 'TOMO 04 // BANCO DE MICROMECÁNICA PORTÁTIL',
        description: 'DC Jack, líneas de carga con osciloscopio, flex eDP, baterías Li-Po y térmico.',
        status: 'DISPONIBLE',
        accent: '#A855F7',
        icon: Laptop,
        onEnter: () => {
          if (onOpenForensicBench) {
            onOpenForensicBench({
              tomoId: 'tomo-04',
              moduleNumber: 'Cap 01',
              labView: 'hotswap-lab',
              scenario: 'ab-bench',
            });
          } else if (onNavigateHotSwapLab) {
            onNavigateHotSwapLab('hardware');
          }
        },
      },
      {
        id: 'lab-tomo-05',
        title: 'TOMO 05 // LABORATORIO FORENSE DE REDES Y PAQUETES',
        description: 'Captura de tramas Ethernet, handshakes TCP/UDP y diagnóstico con Wireshark.',
        status: 'DISPONIBLE',
        accent: '#06B6D4',
        icon: Network,
        onEnter: () => onOpenDossier?.('tomo-05'),
      },
      {
        id: 'lab-tomo-06',
        title: 'TOMO 06 // LABORATORIO DE CIBERSEGURIDAD',
        description: 'Superficie de ataque, escaneo de puertos y análisis dinámico de mitigación.',
        status: 'DISPONIBLE',
        accent: '#EF4444',
        icon: Shield,
        onEnter: () => onOpenDossier?.('tomo-06'),
      },
      {
        id: 'lab-tomo-07',
        title: 'TOMO 07 // BANCO METROLÓGICO DE GAMING Y LATENCIAS',
        description: 'Frametimes microsegundo a microsegundo, degradación térmica e input lag.',
        status: 'DISPONIBLE',
        accent: '#F59E0B',
        icon: Gamepad2,
        onEnter: () => {
          setActiveIntention('diagnosticar');
          setDiagnoseTab('simuladores');
        },
      },
      {
        id: 'lab-tomo-08',
        title: 'TOMO 08 // LABORATORIO DE ARRANQUE Y FALLAS GUIADO',
        description: 'Recorrido físico de 11 etapas desde +5VSB, PWR_SW, SPI, POST hasta el kernel NT.',
        status: 'ACTIVO',
        accent: '#10B981',
        icon: Power,
        onEnter: () => onNavigateBootLab?.(),
      },
      {
        id: 'lab-tomo-09',
        title: 'TOMO 09 // LABORATORIO DE KERNEL LINUX Y SISTEMAS',
        description: 'Subsistemas del kernel monolítico, sysfs, procfs, cgroups v2 y namespaces.',
        status: 'DISPONIBLE',
        accent: '#38BDF8',
        icon: Terminal,
        onEnter: () => onOpenDossier?.('tomo-09'),
      },
      {
        id: 'lab-tomo-10',
        title: 'TOMO 10 // LABORATORIO FORENSE E INGENIERÍA INVERSA',
        description: 'Análisis estático de binarios PE/ELF con Ghidra y volcados RAM con Volatility 3.',
        status: 'DISPONIBLE',
        accent: '#A855F7',
        icon: Binary,
        onEnter: () => onOpenDossier?.('tomo-10'),
      },
    ],
    [
      onNavigateBootLab,
      onNavigateHotSwapLab,
      onNavigateWindowsMatrixLab,
      onOpenForensicBench,
      onOpenDossier,
    ]
  );

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#07080d] text-[#f4f4f5] overflow-x-hidden font-sans-editorial flex flex-col justify-between select-none">
      {/* Dynamic Background Ambient Layer */}
      <EvoWorldAmbientLayer />

      {/* Persistent Breadcrumb / Back button when deep in intention */}
      {activeIntention !== 'campus' && (
        <div className="relative z-30 px-4 sm:px-8 py-2.5 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between font-mono-tech text-xs">
          <button
            onClick={() => setActiveIntention('campus')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 text-amber-300 font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md group"
          >
            <CornerDownRight className="w-3.5 h-3.5 rotate-180 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>← VOLVER AL CAMPUS PRINCIPAL (MUNDO EVO)</span>
          </button>

          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span className="hidden sm:inline">SECCIÓN ACTIVA:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400 font-bold uppercase">
              {activeIntention === 'aprender' && 'QUIERO APRENDER'}
              {activeIntention === 'practicar' && 'QUIERO PRACTICAR'}
              {activeIntention === 'diagnosticar' && 'TALLER DE CASOS Y EXPEDIENTES'}
              {activeIntention === 'progreso' && 'MI PROGRESO REAL'}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CAMPUS PRINCIPAL: PRIMERO INTENCIÓN, DESPUÉS CONTENIDO                */}
      {/* ========================================================================= */}
      {activeIntention === 'campus' && (
        <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center space-y-8">
          {/* Header principal */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-mono-tech uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CAMPUS CENTRAL EVO LABS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase">
              MUNDO EVO
            </h1>

            <p className="text-lg sm:text-xl text-zinc-300 font-sans-editorial italic font-medium">
              “Elegí qué querés hacer.”
            </p>
          </div>

          {/* 4 Grandes Accesos Principales (Desktop & Mobile First) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Card 1: CONTINUAR DONDE QUEDÉ */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c121e] to-[#080b12] border border-blue-500/40 hover:border-blue-400/80 transition-all duration-200 shadow-xl flex flex-col justify-between gap-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
                    ESTADO DE SESIÓN
                  </span>
                  <RotateCcw className="w-4 h-4 text-blue-400 group-hover:rotate-45 transition-transform" />
                </div>

                <h3 className="font-display font-black text-xl text-white group-hover:text-blue-300 transition-colors">
                  CONTINUAR DONDE QUEDÉ
                </h3>

                {realProgress.hasProgress && realProgress.lastActivity ? (
                  <div className="space-y-1.5 p-3 rounded-xl bg-blue-950/20 border border-blue-900/40">
                    <div className="text-xs font-bold text-white font-mono-tech truncate">
                      {realProgress.lastActivity.title}
                    </div>
                    <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed line-clamp-2">
                      {realProgress.lastActivity.detail}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 font-sans-editorial">
                    Todavía no comenzaste una ruta.
                  </div>
                )}
              </div>

              <div>
                {realProgress.hasProgress && realProgress.lastActivity ? (
                  <button
                    type="button"
                    onClick={realProgress.lastActivity.onContinue}
                    className="w-full py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>CONTINUAR</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveIntention('aprender');
                      setLearnTab('rutas');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ELEGIR QUÉ APRENDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: QUIERO APRENDER */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#14120a] to-[#090b10] border border-amber-400/40 hover:border-amber-400/80 transition-all duration-200 shadow-xl flex flex-col justify-between gap-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                    TEORÍA Y EDITORIAL
                  </span>
                  <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-white group-hover:text-amber-300 transition-colors">
                    QUIERO APRENDER
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    “Empezá desde cero o seguí una ruta de aprendizaje.”
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono-tech text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    6 Rutas Temáticas
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    10 Tomos Maestros
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveIntention('aprender');
                  setLearnTab('rutas');
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.35)]"
              >
                <span>ENTRAR A RUTAS Y TOMOS</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Card 3: QUIERO PRACTICAR */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a1512] to-[#080b10] border border-emerald-500/40 hover:border-emerald-400/80 transition-all duration-200 shadow-xl flex flex-col justify-between gap-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                    BANCOS INTERACTIVOS
                  </span>
                  <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-white group-hover:text-emerald-300 transition-colors">
                    QUIERO PRACTICAR
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    “Entrá a laboratorios y comprobá lo aprendido.”
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono-tech text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    Laboratorio de Arranque
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    Bancos Hot-Swap & NT
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveIntention('practicar');
                  setPracticeTab('todos');
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <span>ABRIR LABORATORIOS</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Card 4: QUIERO DIAGNOSTICAR */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#160e18] to-[#080b10] border border-purple-500/40 hover:border-purple-400/80 transition-all duration-200 shadow-xl flex flex-col justify-between gap-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                    PERITAJE & TALLER
                  </span>
                  <FolderGit2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-white group-hover:text-purple-300 transition-colors">
                    QUIERO DIAGNOSTICAR
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    “Resolvé fallas, casos y expedientes técnicos.”
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono-tech text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    Esquemático PCB
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    8 Sectores de Taller
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveIntention('diagnosticar');
                  setDiagnoseTab('expedientes');
                }}
                className="w-full py-3 px-4 rounded-xl bg-purple-400 hover:bg-purple-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              >
                <span>TALLER DE EXPEDIENTES</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Acceso Simple a MI PROGRESO */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setActiveIntention('progreso')}
              className="px-5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono-tech text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>CONSULTAR MI PROGRESO TÉCNICO</span>
              <span className="text-zinc-500 font-normal">
                ({completedChaptersCount}/7 Hitos Registrados)
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SECCIÓN: QUIERO APRENDER                                               */}
      {/* ========================================================================= */}
      {activeIntention === 'aprender' && (
        <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          {/* Header y Selector de Sub-pestañas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase">
                QUIERO APRENDER
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial">
                Empezá desde cero o seguí una ruta de aprendizaje estructurada con la colección oficial.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 font-mono-tech text-xs shrink-0">
              <button
                type="button"
                onClick={() => setLearnTab('rutas')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  learnTab === 'rutas'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                RUTAS DE APRENDIZAJE
              </button>
              <button
                type="button"
                onClick={() => setLearnTab('biblioteca')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  learnTab === 'biblioteca'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                BIBLIOTECA / 10 TOMOS
              </button>
            </div>
          </div>

          {/* Sub-vista A: RUTAS DE APRENDIZAJE */}
          {learnTab === 'rutas' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 font-mono-tech">
                6 RUTAS CURATORIALES BASADAS EN LA COLECCIÓN MAESTRA:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LEARNING_PATHS.map((path) => {
                  const Icon = path.icon;
                  return (
                    <div
                      key={path.id}
                      className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase border"
                            style={{
                              color: path.accent,
                              backgroundColor: `${path.accent}15`,
                              borderColor: `${path.accent}40`,
                            }}
                          >
                            {path.level}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono-tech">
                            {path.tomosAssociated.length} TOMO(S)
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: `${path.accent}20`,
                              borderColor: `${path.accent}40`,
                              color: path.accent,
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-display font-black text-base text-white group-hover:text-amber-300 transition-colors">
                              {path.title}
                            </h3>
                            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                              {path.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Tomos de referencia asociados */}
                        <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                          <div className="text-[10px] text-zinc-500 font-mono-tech uppercase font-bold">
                            Tomos de Estudio:
                          </div>
                          {path.tomosAssociated.map((t) => (
                            <button
                              key={t.number}
                              type="button"
                              onClick={t.action}
                              className="w-full text-left p-2 rounded-lg bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all flex items-center justify-between gap-2 cursor-pointer text-xs"
                            >
                              <div className="truncate">
                                <span
                                  className="font-mono-tech font-bold mr-2 text-[10.5px]"
                                  style={{ color: path.accent }}
                                >
                                  TOMO {t.number}
                                </span>
                                <span className="text-zinc-300 font-sans-editorial truncate">
                                  {t.title}
                                </span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-vista B: BIBLIOTECA EVO / 10 TOMOS */}
          {learnTab === 'biblioteca' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 font-mono-tech">
                COLECCIÓN EDITORIAL COMPLETA (REVISTAS TÉCNICAS A4):
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {VOLUMES_COLLECTION.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold"
                          style={{
                            color: v.themeColor,
                            backgroundColor: `${v.themeColor}15`,
                            border: `1px solid ${v.themeColor}40`,
                          }}
                        >
                          TOMO {v.number}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono-tech">
                          {v.editionLabel}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {v.title}
                      </h4>

                      <p className="text-xs text-zinc-400 font-sans-editorial line-clamp-2 leading-relaxed">
                        {v.tagline}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => {
                          if (v.id === 'tomo-01' && onOpenTomo) onOpenTomo('01');
                          else if (v.id === 'tomo-02' && onOpenTomo) onOpenTomo('02');
                          else if (v.id === 'tomo-03' && onOpenTomo) onOpenTomo('03');
                          else if (v.id === 'tomo-04' && onOpenTomo) onOpenTomo('04');
                          else if (v.id === 'tomo-08' && onOpenTomo) onOpenTomo('08');
                          else if (onOpenDossier) onOpenDossier(v.id);
                        }}
                        className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-mono-tech text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" style={{ color: v.themeColor }} />
                        <span>VER REVISTA / DOSSIER</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SECCIÓN: QUIERO PRACTICAR                                              */}
      {/* ========================================================================= */}
      {activeIntention === 'practicar' && (
        <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          {/* Header y Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase">
                QUIERO PRACTICAR
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial">
                Entrá a laboratorios y comprobá lo aprendido en bancos interactivos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 font-mono-tech text-xs">
              <button
                type="button"
                onClick={() => setPracticeTab('todos')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  practiceTab === 'todos'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                TODOS
              </button>
              <button
                type="button"
                onClick={() => setPracticeTab('tecnicos')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  practiceTab === 'tecnicos'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                LABS TÉCNICOS EVO
              </button>
              <button
                type="button"
                onClick={() => setPracticeTab('guiados')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  practiceTab === 'guiados'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                LABS GUIADOS (TOMOS)
              </button>
            </div>
          </div>

          {/* Bloque 1: LABORATORIOS TÉCNICOS EVO (Herramientas Transversales) */}
          {(practiceTab === 'todos' || practiceTab === 'tecnicos') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="font-mono-tech text-xs font-bold text-white uppercase flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  LABORATORIOS TÉCNICOS EVO // HERRAMIENTAS TRANSVERSALES
                </span>
                <span className="text-[10px] text-zinc-500 font-mono-tech">
                  {TECHNICAL_LABS.length} BANCOS
                </span>
              </div>

              {/* Formato estricto: NOMBRE / descripción 1 línea / estado / [ENTRAR] */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TECHNICAL_LABS.map((lab) => {
                  const Icon = lab.icon;
                  return (
                    <div
                      key={lab.id}
                      className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border mt-0.5"
                          style={{
                            backgroundColor: `${lab.accent}15`,
                            borderColor: `${lab.accent}40`,
                            color: lab.accent,
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                              {lab.title}
                            </h4>
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] font-mono-tech font-bold uppercase shrink-0"
                              style={{
                                color: lab.accent,
                                backgroundColor: `${lab.accent}15`,
                              }}
                            >
                              {lab.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-sans-editorial truncate">
                            {lab.description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={lab.onEnter}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold uppercase transition-all shrink-0 cursor-pointer shadow-md hover:brightness-110 flex items-center gap-1.5"
                        style={{
                          backgroundColor: lab.accent,
                          color: '#000',
                        }}
                      >
                        <span>ENTRAR</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bloque 2: LABORATORIOS GUIADOS DE LOS TOMOS */}
          {(practiceTab === 'todos' || practiceTab === 'guiados') && (
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="font-mono-tech text-xs font-bold text-white uppercase flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  LABORATORIOS GUIADOS ASOCIADOS A TOMOS (1..10)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono-tech">
                  {TOMO_GUIDED_LABS.length} PRÁCTICAS
                </span>
              </div>

              {/* Formato estricto: NOMBRE / descripción 1 línea / estado / [ENTRAR] */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TOMO_GUIDED_LABS.map((lab) => {
                  const Icon = lab.icon;
                  return (
                    <div
                      key={lab.id}
                      className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border mt-0.5"
                          style={{
                            backgroundColor: `${lab.accent}15`,
                            borderColor: `${lab.accent}40`,
                            color: lab.accent,
                          }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-amber-300 transition-colors">
                              {lab.title}
                            </h4>
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] font-mono-tech font-bold uppercase shrink-0"
                              style={{
                                color: lab.accent,
                                backgroundColor: `${lab.accent}15`,
                              }}
                            >
                              {lab.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-sans-editorial truncate">
                            {lab.description}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={lab.onEnter}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold uppercase transition-all shrink-0 cursor-pointer shadow-md hover:brightness-110 flex items-center gap-1.5"
                        style={{
                          backgroundColor: `${lab.accent}20`,
                          color: lab.accent,
                          border: `1px solid ${lab.accent}60`,
                        }}
                      >
                        <span>ENTRAR</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SECCIÓN: QUIERO DIAGNOSTICAR (TALLER DE CASOS Y EXPEDIENTES EVO)       */}
      {/* ========================================================================= */}
      {activeIntention === 'diagnosticar' && (
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
          {/* Header oficial del área */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase">
                  TALLER DE CASOS Y EXPEDIENTES EVO
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial italic">
                “Recibí una falla, investigá la evidencia y llegá a un diagnóstico comprobable.”
              </p>
            </div>

            {/* Pestañas de herramientas de diagnóstico preservadas */}
            <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 font-mono-tech text-xs">
              <button
                type="button"
                onClick={() => setDiagnoseTab('expedientes')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  diagnoseTab === 'expedientes'
                    ? 'bg-purple-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                CASOS GUARDADOS
              </button>
              <button
                type="button"
                onClick={() => setDiagnoseTab('pcb')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  diagnoseTab === 'pcb'
                    ? 'bg-purple-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ESQUEMÁTICO PCB
              </button>
              <button
                type="button"
                onClick={() => setDiagnoseTab('sectores')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  diagnoseTab === 'sectores'
                    ? 'bg-purple-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                8 SECTORES LAB
              </button>
              <button
                type="button"
                onClick={() => setDiagnoseTab('consola')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  diagnoseTab === 'consola'
                    ? 'bg-purple-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                CONSOLA INCIDENTES
              </button>
              <button
                type="button"
                onClick={() => setDiagnoseTab('simuladores')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  diagnoseTab === 'simuladores'
                    ? 'bg-purple-400 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                SIMULADORES
              </button>
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
                      Podés iniciar un nuevo peritaje en el Taller de Diagnóstico (Capítulo 06) o en el Laboratorio de Arranque y Fallas Guiado.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {onNavigateBootLab && (
                      <button
                        type="button"
                        onClick={onNavigateBootLab}
                        className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer"
                      >
                        SIMULAR FALLA EN LABORATORIO DE ARRANQUE
                      </button>
                    )}
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
                      className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-2"
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
                  overlayMode={activeOverlay}
                  onSelectComponent={(c) => setInspectedComponent(c)}
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
                activeZoneId={activeConsoleZoneId}
                onSelectZone={(zoneId) => setActiveConsoleZoneId(zoneId)}
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
      {/* 5. SECCIÓN: MI PROGRESO REAL                                              */}
      {/* ========================================================================= */}
      {activeIntention === 'progreso' && (
        <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
          <div className="space-y-1 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>MI PROGRESO TÉCNICO</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial">
              Métricas reales y fidedignas registradas en tu estación de trabajo local.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Ruta Actual</div>
              <div className="text-sm font-bold text-amber-400 font-mono-tech truncate">
                {realProgress.hasProgress ? 'Fundamentos de PC' : 'Sin ruta activa'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Capítulos Tomo 01</div>
              <div className="text-sm font-bold text-white font-mono-tech">
                {completedChaptersCount} de 7 completados
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Casos Resueltos</div>
              <div className="text-sm font-bold text-white font-mono-tech">
                {realProgress.resolvedCasesCount} expedientes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090c13] border border-zinc-800 space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono-tech uppercase">Ficha de Silicio</div>
              <div className="text-sm font-bold text-white font-mono-tech truncate">
                {passport?.cpuModel || (realProgress.isC01Done ? 'Auditada' : 'No registrada')}
              </div>
            </div>
          </div>

          {/* Hitos y Logros Existentes */}
          <div className="p-5 rounded-2xl bg-[#090c13] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="font-mono-tech font-bold text-white text-xs uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                LOGROS Y CERTIFICACIONES EMPÍRICAS (DATOS REALES)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono-tech">100% AUDITADO</span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'ach-c01',
                  label: 'Pasaporte de Hardware y Ficha de Silicio',
                  unlocked: realProgress.isC01Done,
                },
                {
                  id: 'ach-c02',
                  label: 'Mapeo de Transferencias y Líneas PCIe',
                  unlocked: realProgress.isC02Done,
                },
                {
                  id: 'ach-c03',
                  label: 'Perfil Metrológico de Frametimes & Percentiles 1% Low',
                  unlocked: realProgress.isC03Done,
                },
                {
                  id: 'ach-c04',
                  label: 'Matriz de Estrés Térmico y Consumo Eléctrico',
                  unlocked: realProgress.isC04Done,
                },
                {
                  id: 'ach-c05',
                  label: 'Depuración de Servicios y Gobernanza de Kernel NT',
                  unlocked: realProgress.isC05Done,
                },
                {
                  id: 'ach-c06',
                  label: 'Resolución Deductiva en Taller de Diagnóstico',
                  unlocked: realProgress.isC06Done,
                },
                {
                  id: 'ach-c07',
                  label: 'Certificación Empírica Final con Método Científico',
                  unlocked: realProgress.isC07Done,
                },
              ].map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono-tech ${
                    ach.unlocked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {ach.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                    <span className={ach.unlocked ? 'text-zinc-200' : 'text-zinc-500'}>
                      {ach.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase shrink-0">
                    {ach.unlocked ? 'DESBLOQUEADO' : 'PENDIENTE'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Persistent Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-zinc-900 bg-zinc-950/70 flex items-center justify-between text-xs font-mono-tech text-zinc-500">
        <div>
          EVO LABS // <span className="text-zinc-300">"Hacemos milagros, pero los medimos."</span>
        </div>
        <div className="hidden sm:block text-zinc-600">
          CAMPUS CENTRAL MUNDO EVO // V3.0
        </div>
      </footer>
    </div>
  );
};
