import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Zap,
  Cpu,
  Gauge,
  Wrench,
  CheckCircle2,
  Clock,
  Play,
  HelpCircle,
  Activity,
  Radio,
  Terminal,
  Layers,
  ShieldCheck,
  Binary,
  ChevronRight,
  X,
  Sparkles,
  Compass,
  HardDrive,
  Laptop,
  Microchip,
  FileCheck2,
  ExternalLink,
  BarChart3,
  Database,
  Sliders,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { EvoHeroReactiveBackground } from './EvoHeroReactiveBackground';
import {
  getTomo01CompletedCount,
  isChapter01Complete,
  isChapter02Complete,
  isChapter03Complete,
  isChapter04Complete,
  isChapter05Complete,
  isChapter06Complete,
  isChapter07Complete,
  isTomo01ExamPassed,
  isTomo01Complete,
} from '../../utils/tomo01Progress';
import { EvoCaseRepository } from '../evoLabCore/services/caseRepository';
import { VOLUMES_COLLECTION } from '../../data/collections';
import { EVO_MASTER_TOOLS_CATALOG, EvoToolDefinition } from '../../data/evoToolsData';
import { UserHardwarePassport } from '../../types';

// Visual assets reales del proyecto
import heroSilicon from '../../assets/images/evo_silicon_hero_1789530430709.jpg';
import hardwareHero from '../../assets/images/hardware_sculpture_hero_1789530888503.jpg';
import pcbDetail from '../../assets/images/pcb_traces_detail_1789530447414.jpg';
import coverTomo01 from '../../assets/images/cover_tomo_01_1789531234552.jpg';
import cap01Silicon from '../../assets/images/cap_01_silicon_1789531835511.jpg';
import cap03Frametime from '../../assets/images/cap_03_frametime_1789531858625.jpg';
import cap05Kernel from '../../assets/images/cap_05_kernel_1789531884339.jpg';
import cap07Lab from '../../assets/images/cap_07_lab_1789531904106.jpg';

export interface EvoHomeExperienceProps {
  onNavigateAprender: () => void;
  onNavigatePracticar: () => void;
  onNavigateAnalizar: () => void;
  onNavigateHerramientas: () => void;
  onNavigateComoUsar: () => void;
  onNavigatePlanes: () => void;
  onNavigateEntrar: () => void;
  onOpenIntroPresentation?: () => void;
  onOpenLevel0Intro?: () => void;
  onOpenCaseResolver?: () => void;
  onOpenTomo?: (tomoNumber: string) => void;
  onNavigateBootLab?: () => void;
  onNavigateWindowsMatrixLab?: (scenario?: string) => void;
  onNavigateLabCore?: () => void;
  onNavigateHotSwapLab?: (panel?: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'matrix' | 'all') => void;
  onOpenDigitalTwin?: () => void;
  onExecuteTool?: (tool: EvoToolDefinition) => void;
  passport?: UserHardwarePassport | null;
}

export const EvoHomeExperience: React.FC<EvoHomeExperienceProps> = ({
  onNavigateAprender,
  onNavigatePracticar,
  onNavigateAnalizar,
  onNavigateHerramientas,
  onNavigateComoUsar,
  onNavigatePlanes,
  onNavigateEntrar,
  onOpenIntroPresentation,
  onOpenLevel0Intro,
  onOpenCaseResolver,
  onOpenTomo,
  onNavigateBootLab,
  onNavigateWindowsMatrixLab,
  onNavigateLabCore,
  onNavigateHotSwapLab,
  onOpenDigitalTwin,
  onExecuteTool,
  passport,
}) => {
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // 1. PROGRESO Y TELEMETRÍA REAL DEL USUARIO (0 DATOS INVENTADOS)
  // ---------------------------------------------------------------------------
  const userMissionState = useMemo(() => {
    try {
      const c01 = isChapter01Complete();
      const c02 = isChapter02Complete();
      const c03 = isChapter03Complete();
      const c04 = isChapter04Complete();
      const c05 = isChapter05Complete();
      const c06 = isChapter06Complete();
      const c07 = isChapter07Complete();
      const completedChapters = getTomo01CompletedCount();
      const examPassed = isTomo01ExamPassed();
      const tomo01Done = isTomo01Complete();
      const bootLabDone = typeof window !== 'undefined' && localStorage.getItem('evo_boot_lab_completed') === 'true';

      const passportRaw = typeof window !== 'undefined' ? localStorage.getItem('evo_user_hardware_passport') : null;
      let detectedHardware: any = passport;
      if (!detectedHardware && passportRaw && passportRaw !== 'null') {
        try {
          detectedHardware = JSON.parse(passportRaw);
        } catch {}
      }
      const hasPassport = Boolean(detectedHardware && (detectedHardware.cpu || detectedHardware.brand));

      const savedCases = EvoCaseRepository.getAllCases();
      const resolvedCases = savedCases.filter((c) => c.isClosed).length;
      const totalCases = savedCases.length;

      // Lectura de última ubicación real registrada por el tutor
      let lastLocationData: { tomoNumber?: string; chapterTitle?: string; viewId?: string; timestamp?: string } | null = null;
      if (typeof window !== 'undefined') {
        try {
          const rawLoc = localStorage.getItem('evo_tutor_last_location_v1');
          if (rawLoc) lastLocationData = JSON.parse(rawLoc);
        } catch {}
      }

      // Definición de capítulos con su estado real
      const chaptersList = [
        { id: '01', title: 'Capítulo 01: El Silicio y los Componentes de tu PC', isDone: c01 },
        { id: '02', title: 'Capítulo 02: Buses, Interconexiones y Placa Madre', isDone: c02 },
        { id: '03', title: 'Capítulo 03: Memoria RAM y Jerarquía de Cachés', isDone: c03 },
        { id: '04', title: 'Capítulo 04: Disipación Térmica y Eficiencia Energética', isDone: c04 },
        { id: '05', title: 'Capítulo 05: Kernel, Sistema Operativo y Drivers', isDone: c05 },
        { id: '06', title: 'Capítulo 06: Taller Forense de Diagnóstico', isDone: c06 },
        { id: '07', title: 'Capítulo 07: Laboratorio Integrador y Auditoría Final', isDone: c07 },
      ];

      // Determinar el capítulo activo siguiente
      let currentActiveChapter = chaptersList.find((ch) => !ch.isDone);
      let currentMissionLabel = currentActiveChapter ? currentActiveChapter.title : 'Examen de Comprobación Pericial';
      if (tomo01Done) {
        currentMissionLabel = 'Tomo 01 Completado con Certificación';
      }

      const hasProgress = completedChapters > 0 || examPassed || bootLabDone || hasPassport || resolvedCases > 0;

      return {
        completedChapters,
        totalChapters: 7,
        examPassed,
        tomo01Done,
        bootLabDone,
        hasPassport,
        detectedHardware,
        resolvedCases,
        totalCases: totalCases || 6,
        hasProgress,
        currentTomo: 'TOMO 01 — CONOCÉ TU PC',
        currentChapter: currentMissionLabel,
        lastLocationData,
        chaptersList,
      };
    } catch {
      return {
        completedChapters: 0,
        totalChapters: 7,
        examPassed: false,
        tomo01Done: false,
        bootLabDone: false,
        hasPassport: false,
        detectedHardware: null,
        resolvedCases: 0,
        totalCases: 6,
        hasProgress: false,
        currentTomo: 'TOMO 01 — CONOCÉ TU PC',
        currentChapter: 'Capítulo 01: El Silicio y los Componentes de tu PC',
        lastLocationData: null,
        chaptersList: [],
      };
    }
  }, [passport]);

  const progressPercentage = Math.round((userMissionState.completedChapters / userMissionState.totalChapters) * 100);

  // ---------------------------------------------------------------------------
  // 2. HERRAMIENTAS DE CAMPO SELECCIONADAS (DESDE EVO_MASTER_TOOLS_CATALOG)
  // ---------------------------------------------------------------------------
  const fieldTools = useMemo(() => {
    const targetIds = [
      'med-frametime-analyzer', // Medir FPS y tirones
      'diag-bottleneck-calc',   // Encontrar cuello de botella
      'med-thermal-history',    // Revisar temperaturas
      'diag-bsod-decoder',      // Analizar errores
      'diag-autodetect-pc',     // Conocé los componentes de tu PC
      'med-dpc-latency',        // Encontrar latencias de Windows
    ];
    return targetIds
      .map((id) => EVO_MASTER_TOOLS_CATALOG.find((t) => t.id === id))
      .filter((t): t is EvoToolDefinition => Boolean(t));
  }, []);

  // ---------------------------------------------------------------------------
  // 3. LABORATORIOS ACTIVOS (BANCOS REALES DEL SISTEMA)
  // ---------------------------------------------------------------------------
  const activeLabs = [
    {
      id: 'boot-lab',
      name: 'BOOT LAB',
      subtitle: 'Secuencia de Arranque & 35 Estados POST',
      description: 'Auditoría cronológica paso a paso desde standby y rieles VRM hasta el hand-off al kernel.',
      status: userMissionState.bootLabDone ? 'CERTIFICADO' : 'BANCO EN LÍNEA',
      statusColor: userMissionState.bootLabDone ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' : 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
      actionLabel: 'ABRIR LAB',
      handler: () => {
        if (onNavigateBootLab) onNavigateBootLab();
        else onNavigatePracticar();
      },
      tag: 'ARRANQUE // TOMO 08',
      accent: '#06b6d4',
    },
    {
      id: 'windows-matrix',
      name: 'WINDOWS MATRIX',
      subtitle: 'Laboratorio de Kernel, Procesos & Servicios NT',
      description: 'Inspección de anillos Ring 0/Ring 3, telemetría oculta y auditoría de latencias DPC.',
      status: 'ACTIVO // RING 0',
      statusColor: 'text-blue-400 border-blue-500/40 bg-blue-950/40',
      actionLabel: 'ABRIR LAB',
      handler: () => {
        if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
        else onNavigatePracticar();
      },
      tag: 'KERNEL // TOMO 02',
      accent: '#3b82f6',
    },
    {
      id: 'lab-core',
      name: 'LAB CORE',
      subtitle: 'Taller Pericial Multitomo de Casos Reales',
      description: 'Banco de diagnóstico combinatorio: armá rigs de prueba y resolvé averías de clientes.',
      status: `${userMissionState.resolvedCases}/${userMissionState.totalCases} CASOS RESUELTOS`,
      statusColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
      actionLabel: 'ABRIR TALLER',
      handler: () => {
        if (onNavigateLabCore) onNavigateLabCore();
        else onNavigatePracticar();
      },
      tag: 'PERITAJE // MULTITOMO',
      accent: '#f59e0b',
    },
    {
      id: 'hotswap-lab',
      name: 'HOT-SWAP LAB',
      subtitle: 'Banco Interactivo de Silicio & Descarte',
      description: 'Intercambio dinámico de procesadores, GPUs y memorias para auditar cuellos de botella.',
      status: 'TELEMETRÍA EN VIVO',
      statusColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
      actionLabel: 'ABRIR BANCO',
      handler: () => {
        if (onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
        else onNavigatePracticar();
      },
      tag: 'SILICIO // TOMO 01',
      accent: '#a855f7',
    },
    {
      id: 'digital-twin',
      name: 'DIGITAL TWIN',
      subtitle: 'Gemelo Digital y Topología de Placa Madre',
      description: 'Exploración interactiva de pistas VRM, pistas PCIe y controladores de bus en tiempo real.',
      status: 'MODELADO ACTIVO',
      statusColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
      actionLabel: 'ABRIR GEMELO',
      handler: () => {
        if (onOpenDigitalTwin) onOpenDigitalTwin();
        else onNavigatePracticar();
      },
      tag: 'TOPOLOGÍA // HARDWARE',
      accent: '#10b981',
    },
  ];

  return (
    <div className="relative w-full min-h-full">
      {/* Background Technical Grid for EVO LABS Home */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px, 32px 32px, 160px 160px, 160px 160px',
        }}
      />

      <div className="relative z-10 flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col space-y-12 sm:space-y-16 transition-all duration-300">
      
      {/* ========================================================================= */}
      {/* 2 // HERO PRINCIPAL: CENTRO DE OPERACIONES EVO LABS                      */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-[#07090e]/90 shadow-2xl p-6 sm:p-10 lg:p-12">
        <EvoHeroReactiveBackground />

        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Columna Izquierda: Información Central de Operaciones */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* System Status Banner */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-tech">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/90 border border-zinc-700/80 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold tracking-wider text-cyan-300 uppercase">SISTEMA ACTIVO</span>
              </div>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-zinc-400 uppercase tracking-widest text-[11px]">
                VERSION 2.0 // MAESTRO OS
              </span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-amber-400/90 font-bold tracking-wider text-[11px] uppercase">
                {VOLUMES_COLLECTION.length} TOMOS · 8 LABS · {EVO_MASTER_TOOLS_CATALOG.length} TOOLS
              </span>
            </div>

            {/* Gran Cabecera */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
                MUNDO <span className="text-amber-400">EVO</span>
              </h1>
              <p className="font-mono-tech text-xs sm:text-sm lg:text-base font-bold text-cyan-400 uppercase tracking-widest">
                TU CENTRO DE OPERACIONES TÉCNICO
              </p>
            </div>

            {/* Texto Breve Canónico */}
            <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
              Aprendé, medí, experimentá y documentá.
              <br />
              <strong className="text-white font-black tracking-wide">No lo creas. Comprobalo.</strong>
            </p>

            {/* Micro-telemetría de la sesión */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono-tech text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90">
                <span className="text-[10px] text-zinc-500 uppercase block">CANAL DE AUDIO/DATOS</span>
                <span className="text-zinc-200 font-bold">100% DETERMINÍSTICO</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90">
                <span className="text-[10px] text-zinc-500 uppercase block">TELEMETRÍA LOCAL</span>
                <span className="text-cyan-400 font-bold">{userMissionState.hasPassport ? 'PC VINCULADA' : 'SIN REGISTRAR'}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/90 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-500 uppercase block">COMPROBACIÓN</span>
                <span className="text-amber-400 font-bold">MÉTODO CIENTÍFICO</span>
              </div>
            </div>

            {/* Acciones del Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onNavigateAprender}
                className="px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center gap-2 group"
              >
                <span>{userMissionState.hasProgress ? 'CONTINUAR MISIÓN' : 'INICIAR EN TOMO 01'}</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsMethodModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>MÉTODO EVO 9 PASOS</span>
              </button>

              {onOpenIntroPresentation && (
                <button
                  type="button"
                  onClick={onOpenIntroPresentation}
                  className="px-4 py-3.5 rounded-xl text-zinc-400 hover:text-white font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-zinc-500" />
                  <span>PRESENTACIÓN</span>
                </button>
              )}
            </div>
          </div>

          {/* Columna Derecha: Visual Tecnológica Grande (Silicio / PC / Telemetría) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-2xl group">
              
              {/* Imagen de Silicio y Hardware de Alta Resolución */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <img
                  src={heroSilicon}
                  alt="EVO Labs Silicio y Telemetría Central"
                  className="w-full h-full object-cover object-center filter saturate-125 contrast-110 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/40 to-transparent" />
                <div className="absolute inset-0 bg-blue-950/20 mix-blend-overlay" />
              </div>

              {/* HUD Superpuesto de Telemetría Real */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 font-mono-tech text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-zinc-800/90 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white font-bold tracking-wider text-[11px] uppercase">
                      MONITOR DE SILICIO Y TOPOLOGÍA
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                    LIVE_BUS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-300">
                  <div className="bg-black/80 rounded p-1.5 border border-zinc-800/80">
                    <span className="text-zinc-500 block">BUSES PCIE GEN 5</span>
                    <span className="text-emerald-400 font-bold font-mono">128 GB/s DUPLEX</span>
                  </div>
                  <div className="bg-black/80 rounded p-1.5 border border-zinc-800/80">
                    <span className="text-zinc-500 block">LATENCIA IMC</span>
                    <span className="text-cyan-400 font-bold font-mono">42.5 ns @ RING</span>
                  </div>
                  <div className="bg-black/80 rounded p-1.5 border border-zinc-800/80">
                    <span className="text-zinc-500 block">DELTA TJMAX</span>
                    <span className="text-amber-400 font-bold font-mono">34°C MARGEN</span>
                  </div>
                  <div className="bg-black/80 rounded p-1.5 border border-zinc-800/80">
                    <span className="text-zinc-500 block">EFICIENCIA VRM</span>
                    <span className="text-purple-400 font-bold font-mono">94.8% VCORE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1">
                  <span>DISPOSITIVO: PERICIAL EVO CORE</span>
                  <span className="text-zinc-400">TELEMETRÍA VERIFICADA</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3 // CONTINUAR DONDE QUEDASTE: CONTINUAR MISIÓN                          */}
      {/* ========================================================================= */}
      <section className="w-full">
        <div className="relative rounded-2xl border border-zinc-800/90 bg-gradient-to-r from-zinc-950 via-[#0a0e17] to-zinc-950 p-6 sm:p-7 shadow-xl overflow-hidden font-mono-tech">
          
          {/* Subtle line indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-500 opacity-80" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: State identification */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${userMissionState.hasProgress ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  {userMissionState.hasProgress ? 'CONTINUAR MISIÓN EN CURSO' : 'MISIÓN INICIAL // ESTADO NEUTRO'}
                </h2>
                {userMissionState.hasProgress && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                    PROGRESO REAL DETECTADO
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>{userMissionState.currentTomo}</span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-300 font-bold font-mono">
                  {userMissionState.currentChapter}
                </p>
              </div>

              {/* Detalle o estado neutro */}
              <p className="text-xs text-zinc-400 font-sans-editorial max-w-2xl leading-relaxed">
                {userMissionState.hasProgress
                  ? `Completaste ${userMissionState.completedChapters} de ${userMissionState.totalChapters} capítulos teóricos. Examen final: ${userMissionState.examPassed ? 'Aprobado con certificación' : 'Pendiente de comprobación'}.`
                  : 'Aún no registrás avance en los capítulos. El Tomo 01 te enseñará la física del silicio, los buses PCIe y la arquitectura interna de tu máquina.'}
              </p>
            </div>

            {/* Center/Right: Progress Gauge & Continue Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 lg:gap-8 shrink-0">
              
              {/* Medidor de avance */}
              <div className="space-y-1.5 w-full sm:w-48">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-400">AVANCE TOMO 01</span>
                  <span className="text-amber-400">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>{userMissionState.completedChapters}/7 Capítulos</span>
                  <span>{userMissionState.examPassed ? '✓ Examen OK' : 'Examen pendiente'}</span>
                </div>
              </div>

              {/* Botón de acción */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenTomo && userMissionState.hasProgress) {
                    onOpenTomo('01');
                  } else {
                    onNavigateAprender();
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>{userMissionState.hasProgress ? 'CONTINUAR' : 'INICIAR MISIÓN'}</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4 // CINCO MÓDULOS PRINCIPALES: SISTEMA TÉCNICO ORGANIZADO                */}
      {/* ========================================================================= */}
      <section className="space-y-6 w-full">
        
        {/* Cabecera de sección */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono-tech tracking-widest text-amber-400 uppercase font-bold block">
              SISTEMA DE MÓDULOS CENTRALES
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              CINCO DIMENSIONES DE OPERACIÓN
            </h2>
          </div>
          <p className="text-xs font-mono-tech text-zinc-400 max-w-sm text-left sm:text-right">
            Arquitectura unificada para aprender teoría, experimentar en bancos y auditar silicio real.
          </p>
        </div>

        {/* Grid de las 5 cards: 2x2 + 1 ancho */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* CARD 01: TOMOS */}
          <div className="group rounded-3xl bg-zinc-950/90 border border-zinc-800/90 hover:border-amber-400/60 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] relative overflow-hidden">
            <div className="space-y-4">
              {/* Imagen técnica */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-800/80">
                <img
                  src={coverTomo01}
                  alt="Módulo Tomos EVO"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/85 border border-zinc-700 font-mono-tech text-[11px] font-black text-amber-400">
                  01 // TOMOS
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-zinc-300 px-2 py-0.5 rounded bg-black/75">
                  12 TOMOS CANÓNICOS
                </div>
              </div>

              {/* Título y descripción */}
              <div className="space-y-1.5">
                <h3 className="text-2xl font-display font-black text-white uppercase group-hover:text-amber-300 transition-colors">
                  TOMOS
                </h3>
                <p className="font-mono-tech text-xs text-amber-400/90 font-bold uppercase">
                  Tomos, expedientes y conocimiento técnico.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial leading-relaxed">
                  Fundamentos de ingeniería sin relleno comercial: arquitectura de silicio, buses PCIe, jerarquías de memoria, almacenamiento y microarquitectura.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={onNavigateAprender}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-200 border border-zinc-700/80 hover:border-amber-400 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between group/btn"
            >
              <span>INGRESAR A BIBLIOTECA & TOMOS</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 02: LABORATORIOS */}
          <div className="group rounded-3xl bg-zinc-950/90 border border-zinc-800/90 hover:border-cyan-400/60 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] relative overflow-hidden">
            <div className="space-y-4">
              {/* Imagen técnica */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-800/80">
                <img
                  src={cap07Lab}
                  alt="Módulo Laboratorios EVO"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/85 border border-zinc-700 font-mono-tech text-[11px] font-black text-cyan-400">
                  02 // LABORATORIOS
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-zinc-300 px-2 py-0.5 rounded bg-black/75">
                  8 BANCOS & SIMULADORES ACTIVOS
                </div>
              </div>

              {/* Título y descripción */}
              <div className="space-y-1.5">
                <h3 className="text-2xl font-display font-black text-white uppercase group-hover:text-cyan-300 transition-colors">
                  LABORATORIOS
                </h3>
                <p className="font-mono-tech text-xs text-cyan-400/90 font-bold uppercase">
                  Laboratorios, simuladores y escenarios.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial leading-relaxed">
                  Bancos de prueba interactivos, secuencia de arranque de 35 estados POST, análisis de kernel NT, emulación de fallas y experimentación controlada.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={onNavigatePracticar}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-cyan-400 hover:text-black text-zinc-200 border border-zinc-700/80 hover:border-cyan-400 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between group/btn"
            >
              <span>ABRIR LABORATORIOS ACTIVOS</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 03: ANALIZAR MI PC */}
          <div className="group rounded-3xl bg-zinc-950/90 border border-zinc-800/90 hover:border-purple-400/60 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] relative overflow-hidden">
            <div className="space-y-4">
              {/* Imagen técnica */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-800/80">
                <img
                  src={pcbDetail}
                  alt="Módulo Analizar Mi PC"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/85 border border-zinc-700 font-mono-tech text-[11px] font-black text-purple-400">
                  03 // ANALIZAR MI PC
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-zinc-300 px-2 py-0.5 rounded bg-black/75">
                  AUDITORÍA & TELEMETRÍA LOCAL
                </div>
              </div>

              {/* Título y descripción */}
              <div className="space-y-1.5">
                <h3 className="text-2xl font-display font-black text-white uppercase group-hover:text-purple-300 transition-colors">
                  ANALIZAR MI PC
                </h3>
                <p className="font-mono-tech text-xs text-purple-400/90 font-bold uppercase">
                  Hardware, telemetría y diagnóstico.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial leading-relaxed">
                  Conectá el motor pericial con tu hardware para generar tu pasaporte técnico, detectar cuellos de botella reales y auditar la integridad del sistema.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={onNavigateAnalizar}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-purple-400 hover:text-black text-zinc-200 border border-zinc-700/80 hover:border-purple-400 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between group/btn"
            >
              <span>AUDITAR SILICIO & HARDWARE</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 04: HERRAMIENTAS */}
          <div className="group rounded-3xl bg-zinc-950/90 border border-zinc-800/90 hover:border-emerald-400/60 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] relative overflow-hidden">
            <div className="space-y-4">
              {/* Imagen técnica */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-800/80">
                <img
                  src={cap03Frametime}
                  alt="Módulo Herramientas EVO"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/85 border border-zinc-700 font-mono-tech text-[11px] font-black text-emerald-400">
                  04 // HERRAMIENTAS
                </div>
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-zinc-300 px-2 py-0.5 rounded bg-black/75">
                  34 INSTRUMENTOS DE PRECISIÓN
                </div>
              </div>

              {/* Título y descripción */}
              <div className="space-y-1.5">
                <h3 className="text-2xl font-display font-black text-white uppercase group-hover:text-emerald-300 transition-colors">
                  HERRAMIENTAS
                </h3>
                <p className="font-mono-tech text-xs text-emerald-400/90 font-bold uppercase">
                  Medición, reparación y optimización.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial leading-relaxed">
                  Instrumental de grado metrológico: capturador de frametimes, auditor de latencia DPC, decodificador de volcados BSOD y calculador de bottleneck.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={onNavigateHerramientas}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-emerald-400 hover:text-black text-zinc-200 border border-zinc-700/80 hover:border-emerald-400 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between group/btn"
            >
              <span>ABRIR INSTRUMENTAL TÉCNICO</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* CARD 05: MI EVO (ANCHO COMPLETO) */}
          <div className="md:col-span-2 group rounded-3xl bg-gradient-to-br from-[#0c0f17] via-zinc-950 to-[#120f0a] border border-zinc-800/90 hover:border-amber-400/60 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)] relative overflow-hidden">
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-black/85 border border-amber-400/40 font-mono-tech text-[11px] font-black text-amber-400">
                  05 // MI EVO
                </span>
                <span className="text-[11px] font-mono-tech text-zinc-400 font-bold uppercase">
                  HISTORIAL TÉCNICO & IDENTIDAD PERICIAL
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase group-hover:text-amber-300 transition-colors">
                  MI EVO
                </h3>
                <p className="font-mono-tech text-xs sm:text-sm text-amber-400/90 font-bold uppercase">
                  Pasaporte, progreso, logros y expedientes.
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial max-w-2xl leading-relaxed">
                  Registro inmutable de tu trayectoria formativa: consultá los casos periciales resueltos, capítulos completados, pasaporte de hardware auditado y certificaciones técnicas oficiales emitidas por EVO LABS.
                </p>
              </div>

              {/* Badges de estado reales */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono-tech text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Nivel: <strong className="text-amber-400">{userMissionState.completedChapters > 0 ? 'Nivel 1 (Silicio)' : 'Nivel 0 (Novicio)'}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Casos: <strong className="text-cyan-400">{userMissionState.resolvedCases} resueltos</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                  Hardware: <strong className={userMissionState.hasPassport ? 'text-emerald-400' : 'text-zinc-500'}>{userMissionState.hasPassport ? 'Auditado' : 'Sin escanear'}</strong>
                </span>
              </div>
            </div>

            {/* Imagen miniatura y CTA */}
            <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
              <div className="h-32 w-full rounded-2xl overflow-hidden border border-zinc-800 relative hidden sm:block">
                <img
                  src={hardwareHero}
                  alt="Escultura de hardware EVO"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono-tech text-amber-300">
                  PASAPORTE INMUTABLE
                </span>
              </div>

              <button
                type="button"
                onClick={onNavigateEntrar}
                className="w-full py-4 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group/btn"
              >
                <span>ABRIR MI EXPEDIENTE</span>
                <ArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5 // LABORATORIOS DESTACADOS: LABORATORIOS ACTIVOS                         */}
      {/* ========================================================================= */}
      <section className="space-y-6 w-full">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono-tech tracking-widest text-cyan-400 uppercase font-bold block">
              INFRAESTRUCTURA DE PRUEBA
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              LABORATORIOS ACTIVOS
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-zinc-400">
            5 BANCOS TÉCNICOS EN EJECUCIÓN
          </span>
        </div>

        {/* Grid de 5 laboratorios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {activeLabs.map((lab) => (
            <div
              key={lab.id}
              className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700 flex flex-col justify-between space-y-4 font-mono-tech transition-all hover:bg-zinc-900/40"
            >
              <div className="space-y-3">
                
                {/* Mini visual / Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase">
                    {lab.tag}
                  </span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${lab.statusColor}`}>
                    {lab.status}
                  </span>
                </div>

                {/* Nombre y subtítulo */}
                <div>
                  <h3 className="text-base font-display font-black text-white uppercase tracking-tight">
                    {lab.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial line-clamp-2 mt-1">
                    {lab.description}
                  </p>
                </div>
              </div>

              {/* Botón existente */}
              <button
                type="button"
                onClick={lab.handler}
                className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-cyan-400 text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{lab.actionLabel}</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6 // HERRAMIENTAS DESTACADAS: HERRAMIENTAS DE CAMPO                       */}
      {/* ========================================================================= */}
      <section className="space-y-6 w-full">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono-tech tracking-widest text-emerald-400 uppercase font-bold block">
              INSTRUMENTAL DE METROLOGÍA
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              HERRAMIENTAS DE CAMPO
            </h2>
          </div>
          <span className="text-xs font-mono-tech text-zinc-400">
            6 UTILIDADES DE ALTO RENDIMIENTO
          </span>
        </div>

        {/* Grid de 6 herramientas canónicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fieldTools.map((tool) => (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-emerald-500/50 flex flex-col justify-between space-y-4 font-mono-tech transition-all hover:bg-zinc-900/40"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 uppercase">
                    {tool.category}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase">
                    {tool.provenance}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans-editorial line-clamp-2">
                    {tool.whatItDoes}
                  </p>
                </div>

                {/* Conceptos asociados */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {tool.concepts.slice(0, 3).map((concept, idx) => (
                    <span key={idx} className="text-[9px] text-zinc-500 bg-zinc-900/80 px-1.5 py-0.5 rounded">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botón de ejecución */}
              <button
                type="button"
                onClick={() => {
                  if (onExecuteTool) onExecuteTool(tool);
                  else onNavigateHerramientas();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-emerald-400 hover:text-black text-zinc-200 border border-zinc-700/80 hover:border-emerald-400 text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-between group"
              >
                <span>EJECUTAR INSTRUMENTO</span>
                <Wrench className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black transition-colors" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7 & 8 // ESTADO EVO + MI EVO / PASAPORTE                                  */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full font-mono-tech">
        
        {/* Panel 7: ESTADO DEL SISTEMA EVO (Lado Izquierdo, 6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-zinc-950/90 border border-zinc-800/90 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                  ESTADO EVO // MÉTRICAS DEL SISTEMA
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500 uppercase">TELEMETRÍA EN TIEMPO REAL</span>
            </div>

            {/* 4 Métricas Derivadas Reales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>TOMOS DISPONIBLES</span>
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-display font-black text-white">
                  {VOLUMES_COLLECTION.length}
                </div>
                <span className="text-[10px] text-zinc-400 font-sans-editorial block">
                  Arquitectura y fundamentos completos
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>LABORATORIOS</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-2xl font-display font-black text-white">
                  8
                </div>
                <span className="text-[10px] text-zinc-400 font-sans-editorial block">
                  Bancos guiados, sandboxes y arranque
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>HERRAMIENTAS</span>
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-display font-black text-white">
                  {EVO_MASTER_TOOLS_CATALOG.length}
                </div>
                <span className="text-[10px] text-zinc-400 font-sans-editorial block">
                  Metrología, DPC, kernel y diagnóstico
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                  <span>PROGRESO USUARIO</span>
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-2xl font-display font-black text-white">
                  {progressPercentage}%
                </div>
                <span className="text-[10px] text-zinc-400 font-sans-editorial block">
                  {userMissionState.completedChapters} de 7 capítulos verificados
                </span>
              </div>
            </div>

            {/* Resumen de Comprobación */}
            <div className="p-3.5 rounded-xl bg-[#090d14] border border-cyan-900/40 text-xs space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-zinc-300">
                <span>ESTADO DEL MOTOR FORENSE</span>
                <span className="text-cyan-400">OPERATIVO 100%</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                Todos los módulos funcionan bajo metodología de validación empírica: mediciones inmutables sin datos sintéticos ni simulación engañosa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateAprender}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>VER CATÁLOGO COMPLETO DE RECURSOS</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Panel 8: MI EVO / PASAPORTE TÉCNICO (Lado Derecho, 6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-zinc-950/90 border border-zinc-800/90 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                  MI EVO // PASAPORTE TÉCNICO & EXPEDIENTE
                </h3>
              </div>
              <span className="text-[11px] text-zinc-500 uppercase">IDENTIDAD PERICIAL</span>
            </div>

            {/* Datos del Pasaporte Real */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase font-bold">HARDWARE LOCAL VINCULADO</span>
                  {userMissionState.hasPassport ? (
                    <span className="text-emerald-400 text-[11px] font-bold">DETECTADO</span>
                  ) : (
                    <span className="text-zinc-500 text-[11px] font-bold">NO VINCULADO</span>
                  )}
                </div>

                {userMissionState.hasPassport && userMissionState.detectedHardware ? (
                  <div className="space-y-1 text-xs text-zinc-200">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">PROCESADOR:</span>
                      <span className="font-bold text-amber-300 truncate max-w-[220px]">
                        {userMissionState.detectedHardware.cpu || userMissionState.detectedHardware.model || 'CPU Detectada'}
                      </span>
                    </div>
                    {userMissionState.detectedHardware.gpu && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">GRÁFICA:</span>
                        <span className="font-bold text-cyan-300 truncate max-w-[220px]">
                          {userMissionState.detectedHardware.gpu}
                        </span>
                      </div>
                    )}
                    {userMissionState.detectedHardware.ram && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">MEMORIA RAM:</span>
                        <span className="font-bold text-zinc-300">
                          {userMissionState.detectedHardware.ram} GB
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                    Aún no vinculaste tu hardware. Al realizar un escaneo seguro podés auditar tus componentes y registrarlos en tu pasaporte inmutable.
                  </p>
                )}
              </div>

              {/* Registro de Logros Reales */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase block">EXAMEN TEÓRICO</span>
                  <span className={`font-bold ${userMissionState.examPassed ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {userMissionState.examPassed ? '✓ APROBADO' : 'PENDIENTE'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase block">BOOT LAB</span>
                  <span className={`font-bold ${userMissionState.bootLabDone ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {userMissionState.bootLabDone ? '✓ CERTIFICADO' : 'PENDIENTE'}
                  </span>
                </div>
              </div>

              {/* Última actividad registrada */}
              {userMissionState.lastLocationData && (
                <div className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>ÚLTIMA ACTIVIDAD:</span>
                  <span className="text-zinc-200 font-bold">
                    {userMissionState.lastLocationData.chapterTitle || 'Mundo EVO'}
                  </span>
                </div>
              )}
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={onNavigateEntrar}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase transition-all cursor-pointer text-center"
            >
              GESTIONAR MI PASAPORTE
            </button>
            <button
              type="button"
              onClick={onNavigateAnalizar}
              className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-bold uppercase transition-all cursor-pointer text-center"
            >
              ESCANEAR PC
            </button>
          </div>
        </div>

      </section>

      {/* FOOTER SOBRIO Y LIMPIO */}
      <footer className="border-t border-zinc-900/90 pt-8 pb-4 text-center font-mono-tech text-xs text-zinc-500 space-y-1.5">
        <p className="text-zinc-300 font-bold">© 2026 EVO LABS — ZUDOKA PROGRAMING SYSTEM CORPORATION</p>
        <p className="text-zinc-400">Todos los derechos reservados.</p>
        <p className="text-[11px] text-zinc-500">Creado y dirigido por ZuKA · Denis Galperin</p>
      </footer>

      {/* MODAL EVO METHOD (9 PASOS CIENTÍFICOS) */}
      {isMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-2xl w-full rounded-2xl bg-[#090c13] border border-amber-400/40 p-6 shadow-2xl space-y-4 font-mono-tech max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">METODOLOGÍA CIENTÍFICA</span>
                <h3 className="font-display font-black text-lg text-white uppercase">EL MÉTODO EVO // 9 PASOS PERICIALES</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMethodModalOpen(false)}
                className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Cerrar modal de método"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { s: '01', v: 'OBSERVAR', d: 'Identificá el síntoma en el sistema o hardware sin prejuicios.' },
                { s: '02', v: 'ENTENDER', d: 'Comprendé los buses y dependencias que interactúan.' },
                { s: '03', v: 'HIPOTETIZAR', d: 'Formulá una causa probable basada en la física del silicio.' },
                { s: '04', v: 'INTERVENIR', d: 'Realizá una sola modificación controlada en el banco.' },
                { s: '05', v: 'MEDIR', d: 'Registrá la variable con instrumental metrológico real.' },
                { s: '06', v: 'COMPARAR', d: 'Contrastá la medición contra la línea de base original.' },
                { s: '07', v: 'COMPROBAR', d: 'Validá si la hipótesis se demostró o fue refutada.' },
                { s: '08', v: 'DOCUMENTAR', d: 'Registrá el hallazgo en el expediente pericial.' },
                { s: '09', v: 'TRANSFERIR', d: 'Aplicá el principio a nuevos escenarios y arquitecturas.' },
              ].map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1">
                  <span className="text-[9px] text-zinc-500 font-mono block">{step.s}</span>
                  <strong className="text-amber-400 text-xs block">{step.v}</strong>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial leading-tight">{step.d}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-900 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMethodModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-amber-400 text-black text-xs font-bold uppercase transition-all cursor-pointer"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
