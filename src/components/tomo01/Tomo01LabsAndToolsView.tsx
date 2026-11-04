import React, { useState, Suspense } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Wrench,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Terminal,
  Gauge,
  Sparkles,
  Zap,
  Box,
  Gamepad2,
  Binary,
  Flame,
  Scale,
  Microchip,
  Waves,
  Timer,
  Network,
  Stethoscope,
  Maximize2,
  Radio,
} from 'lucide-react';
import { UserHardwarePassport, Tome01DossierSummary } from '../../types';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { LabCardWithUsageGuide } from './LabCardWithUsageGuide';
import { InfoRepresentationLab } from './fundamentals/InfoRepresentationLab';
import { BinaryArithmeticLab } from './fundamentals/BinaryArithmeticLab';
import { ElectricCircuitsLab } from './fundamentals/ElectricCircuitsLab';
import { DigitalSignalsLab } from './fundamentals/DigitalSignalsLab';
import { BasicCpuSimulatorLab } from './fundamentals/BasicCpuSimulatorLab';
import { RamLatencyExplorerLab } from './fundamentals/RamLatencyExplorerLab';
import { PcieBandwidthLab } from './fundamentals/PcieBandwidthLab';
import { BinaryQuestGame } from './games/BinaryQuestGame';
import { LogicFactoryGame } from './games/LogicFactoryGame';
import { CpuMissionGame } from './games/CpuMissionGame';
import { HardwareRescueGame } from './games/HardwareRescueGame';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { VrmStressGame } from './games/VrmStressGame';
import { EvoHardwarePostDiagnosticsLab } from '../world/labs/EvoHardwarePostDiagnosticsLab';

const EvoMotherboardCanvas = React.lazy(() => import('../world/EvoMotherboardCanvas'));
const EvoLiveBenchSuite = React.lazy(() =>
  import('../world/EvoLiveBenchSuite').then((m) => ({ default: m.EvoLiveBenchSuite }))
);

interface Tomo01LabsAndToolsViewProps {
  onBackToCover: () => void;
  onOpenInteractive: () => void;
  onOpenMagazine: () => void;
  onBackToHome: () => void;
  onOpenChapter: (chapterNum: string) => void;
  onOpenHotSwap: (panel?: 'sandbox' | 'gaming' | 'architecture' | 'hardware' | 'software' | 'telemetry' | 'all') => void;
  onOpenLabCore: (phase?: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE', mission?: 'IDLE' | 'REPAIR' | 'TEST' | 'BOTTLENECK' | 'OPTIMIZE' | 'UPGRADE') => void;
  onOpenBottleneckSimulator: () => void;
  onOpenLatencyCalculator: () => void;
  onOpenDigitalTwin: () => void;
  passport?: UserHardwarePassport | null;
  dossierSummary?: Tome01DossierSummary;
}

type ChapterFilter =
  | 'all'
  | 'escala-1'
  | 'escala-2'
  | 'escala-3'
  | 'escala-4'
  | 'escala-5'
  | 'escala-6';

type EmbeddedView =
  | 'none'
  | 'pcb-canvas'
  | 'live-bench'
  | 'info-rep'
  | 'binary-arithmetic'
  | 'electric-circuits'
  | 'digital-signals'
  | 'basic-cpu'
  | 'ram-latency'
  | 'pcie-bandwidth'
  | 'game-binary-quest'
  | 'game-logic-factory'
  | 'game-cpu-mission'
  | 'game-hardware-rescue'
  | 'game-memory-match'
  | 'game-vrm-stress'
  | 'post-diag';

export const Tomo01LabsAndToolsView: React.FC<Tomo01LabsAndToolsViewProps> = ({
  onBackToCover,
  onOpenInteractive,
  onOpenMagazine,
  onBackToHome,
  onOpenChapter,
  onOpenHotSwap,
  onOpenLabCore,
  onOpenBottleneckSimulator,
  onOpenLatencyCalculator,
  onOpenDigitalTwin,
  passport,
  dossierSummary,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<ChapterFilter>('all');
  const [embeddedView, setEmbeddedView] = useState<EmbeddedView>('none');

  // Progress calculations from dossier
  const completedChaptersCount = [
    dossierSummary?.passport,
    dossierSummary?.flowMap,
    dossierSummary?.fluidezProfile,
    dossierSummary?.limitMatrix,
    dossierSummary?.activityMap,
    dossierSummary?.diagnosticCase,
    dossierSummary?.labReport,
  ].filter(Boolean).length;

  if (embeddedView === 'pcb-canvas') {
    return (
      <div className="w-full min-h-screen bg-[#07090E] text-zinc-100 px-4 sm:px-6 lg:px-8 py-6 select-none font-sans-editorial">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => setEmbeddedView('none')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-mono-tech text-xs uppercase font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← VOLVER A LABORATORIOS TOMO 01</span>
            </button>
            <span className="font-mono-tech text-xs text-zinc-400 uppercase tracking-wider">
              PCB CANVAS // PLACA MADRE INTERACTIVA & PISTAS VRM (TOMO 01)
            </span>
          </div>
          <Suspense fallback={<div className="p-12 text-center text-amber-400 font-mono-tech text-sm">Cargando PCB Canvas...</div>}>
            <EvoMotherboardCanvas passport={passport ?? null} />
          </Suspense>
        </div>
      </div>
    );
  }

  if (embeddedView === 'live-bench') {
    return (
      <div className="w-full min-h-screen bg-[#07090E] text-zinc-100 px-4 sm:px-6 lg:px-8 py-6 select-none font-sans-editorial">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => setEmbeddedView('none')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-mono-tech text-xs uppercase font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← VOLVER A LABORATORIOS TOMO 01</span>
            </button>
            <span className="font-mono-tech text-xs text-zinc-400 uppercase tracking-wider">
              LIVE BENCH // SIMULADOR FÍSICO DE RENDIMIENTO EN SILICIO (TOMO 01)
            </span>
          </div>
          <Suspense fallback={<div className="p-12 text-center text-amber-400 font-mono-tech text-sm">Cargando Live Bench...</div>}>
            <EvoLiveBenchSuite passport={passport ?? null} />
          </Suspense>
        </div>
      </div>
    );
  }

  // Embedded Fundamental Labs & Technical Games
  const embeddedConfigs: Record<
    Exclude<EmbeddedView, 'none' | 'pcb-canvas' | 'live-bench'>,
    { title: string; component: React.ReactNode }
  > = {
    'info-rep': {
      title: 'CODIFICACIÓN DE INFORMACIÓN (ASCII & UTF-8 / UNIDADES SI vs IEC)',
      component: <InfoRepresentationLab />,
    },
    'binary-arithmetic': {
      title: 'ARITMÉTICA BINARIA, SUMADOR ALU & DETECTOR DE OVERFLOW',
      component: <BinaryArithmeticLab />,
    },
    'electric-circuits': {
      title: 'ELECTRICIDAD EN PC, LEY DE OHM & EFECTO JOULE EN SILICIO',
      component: <ElectricCircuitsLab />,
    },
    'digital-signals': {
      title: 'SEÑALES DIGITALES, NIVELES LÓGICOS & OSCILOSCOPIO DIGITAL',
      component: <DigitalSignalsLab />,
    },
    'basic-cpu': {
      title: 'SIMULADOR DE CPU DIDÁCTICO // CICLO FETCH-DECODE-EXECUTE',
      component: <BasicCpuSimulatorLab />,
    },
    'ram-latency': {
      title: 'CALCULADOR Y EXPLORADOR DE LATENCIAS DE MEMORIA RAM (JEDEC EN NS)',
      component: <RamLatencyExplorerLab />,
    },
    'pcie-bandwidth': {
      title: 'ANALIZADOR DE PISTAS PCIE Y ANCHO DE BANDA POR LÍNEA (SATURACIÓN)',
      component: <PcieBandwidthLab />,
    },
    'game-binary-quest': {
      title: 'BINARY QUEST // DESAFÍO DE CONVERSIÓN RÁPIDA A CONTRARRELOJ',
      component: <BinaryQuestGame />,
    },
    'game-logic-factory': {
      title: 'LOGIC FACTORY // COMPUERTAS BOOLEANAS & TABLAS DE VERDAD',
      component: <LogicFactoryGame />,
    },
    'game-cpu-mission': {
      title: 'CPU MISSION // CONTROL DE REGISTROS Y CICLOS DE RELOJ',
      component: <CpuMissionGame />,
    },
    'game-hardware-rescue': {
      title: 'HARDWARE RESCUE // DIAGNÓSTICO DEDUCTIVO CON INSTRUMENTAL',
      component: <HardwareRescueGame />,
    },
    'game-memory-match': {
      title: 'SILICON MEMORY MATCH // DESAFÍO DE SUBTIMINGS & FRECUENCIA',
      component: <MemoryMatchGame />,
    },
    'game-vrm-stress': {
      title: 'VRM THERMAL RUNAWAY // EQUILIBRIO DE FASES & PÉRDIDAS JOULE',
      component: <VrmStressGame />,
    },
    'post-diag': {
      title: 'DIAGNÓSTICO DE HARDWARE FÍSICO & CÓDIGOS POST EN TIEMPO REAL',
      component: <EvoHardwarePostDiagnosticsLab onClose={() => setEmbeddedView('none')} />,
    },
  };

  if (embeddedView !== 'none' && embeddedConfigs[embeddedView as keyof typeof embeddedConfigs]) {
    const config = embeddedConfigs[embeddedView as keyof typeof embeddedConfigs];
    return (
      <div className="w-full min-h-screen bg-[#07090E] text-zinc-100 px-4 sm:px-6 lg:px-8 py-6 select-none font-sans-editorial">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => setEmbeddedView('none')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-mono-tech text-xs uppercase font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← VOLVER A LABORATORIOS TOMO 01</span>
            </button>
            <span className="font-mono-tech text-xs text-zinc-400 uppercase tracking-wider">
              {config.title}
            </span>
          </div>
          {config.component}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#06080F] text-zinc-100 pb-20 select-none font-sans-editorial">
      {/* =========================================================================
          1. BREADCRUMB & ACCESOS PRINCIPALES DE ENTRADA AL TOMO 01
      ========================================================================= */}
      <div className="w-full border-b border-zinc-800/80 bg-[#080B14]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-zinc-400">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              EVO LABS
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={onBackToCover}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              TOMO 01
            </button>
            <span>/</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              CENTRAL METROLÓGICA ESCALONADA
            </span>
          </div>

          {/* Tres accesos principales del Tomo 01 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenInteractive}
              className="px-3 py-1.5 rounded-lg border border-zinc-700/80 hover:border-amber-400/60 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Ir a los 7 capítulos del Tomo 01 interactivo"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">TOMO 01 INTERACTIVO</span>
              <span className="sm:hidden">INTERACTIVO</span>
            </button>

            <span className="px-3 py-1.5 rounded-lg border border-amber-400 bg-amber-400/10 text-amber-300 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              <span>LABS & TOOLS ESCALONADOS</span>
            </span>

            <button
              type="button"
              onClick={onOpenMagazine}
              className="px-3 py-1.5 rounded-lg border border-zinc-700/80 hover:border-amber-400/60 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Abrir el Magazine Editorial A4 de 46 páginas"
            >
              <span>📖</span>
              <span className="hidden sm:inline">MAGAZINE A4</span>
              <span className="sm:hidden">A4</span>
            </button>

            <button
              type="button"
              onClick={onBackToCover}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Volver a la portada del Tomo 01"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. HERO SECTOR BANNER
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-b from-[#0F1424] to-[#0A0D18] p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 font-mono-tech text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
                CENTRAL METROLÓGICA ESCALONADA // TOMO 01
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">
                ORDEN DIDÁCTICO RIGUROSO · 6 ESCALONES COGNITIVOS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase leading-tight">
              LABORATORIOS, INSTRUMENTAL
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                Y JUEGOS TÉCNICOS ESCALONADOS
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl font-sans-editorial">
              Estructura didáctica escalonada desde los fundamentos atómicos del bit hasta el peritaje deductivo final en taller. Cada experiencia cuenta con su <strong className="text-amber-300">guía técnica desplegable paso a paso</strong>, indicando objetivo experimental, instrumental, fórmulas físicas exactas y veredicto de banco.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono-tech">
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Total de Módulos</span>
                <span className="text-xl font-black text-white">29 EXPERIENCIAS</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Progresión Metrológica</span>
                <span className="text-xl font-black text-amber-400">6 ESCALONES</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Juegos & Retos Técnicos</span>
                <span className="text-xl font-black text-cyan-400">6 RETOS</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Dossier Validado</span>
                <span className="text-xl font-black text-emerald-400">{completedChaptersCount} / 7 CAPÍTULOS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SELECTOR ESCALONADO / FILTRO RÁPIDO POR NIVELES METROLÓGICOS
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scroll-slim font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            TODOS LOS ESCALONES (29)
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('escala-1')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'escala-1'
                ? 'bg-cyan-400 text-black shadow-[0_0_14px_rgba(6,182,212,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-cyan-400/90 hover:text-cyan-300 hover:border-cyan-500/50'
            }`}
          >
            <span>ESCALÓN 1 · ATÓMICO & BINARIO (4)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('escala-2')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'escala-2'
                ? 'bg-yellow-400 text-black shadow-[0_0_14px_rgba(250,204,21,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-yellow-400/90 hover:text-yellow-300 hover:border-yellow-500/50'
            }`}
          >
            <span>ESCALÓN 2 · FÍSICA & ELECTRICIDAD (3)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('escala-3')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'escala-3'
                ? 'bg-purple-400 text-black shadow-[0_0_14px_rgba(168,85,247,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-purple-400/90 hover:text-purple-300 hover:border-purple-500/50'
            }`}
          >
            <span>ESCALÓN 3 · ARQUITECTURA & CPU (3)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('escala-4')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'escala-4'
                ? 'bg-emerald-400 text-black shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-emerald-400/90 hover:text-emerald-300 hover:border-emerald-500/50'
            }`}
          >
            <span>ESCALÓN 4 · BUSES & MEMORIA (6)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('escala-5')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'escala-5'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-amber-400/90 hover:text-amber-300 hover:border-amber-500/50'
            }`}
          >
            <span>ESCALÓN 5 · RENDIMIENTO & FPS (5)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('escala-6')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'escala-6'
                ? 'bg-red-400 text-black shadow-[0_0_14px_rgba(248,113,113,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-red-400/90 hover:text-red-300 hover:border-red-500/50'
            }`}
          >
            <span>ESCALÓN 6 · TALLER & PERITAJE (8)</span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. CUERPO DIDÁCTICO ORDENADO EN 6 ESCALONES METROLÓGICOS
      ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">

        {/* ---------------------------------------------------------------------
            ESCALÓN 1: ATÓMICO, BINARIO & LÓGICA DIGITAL
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'escala-1') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-800/60 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-cyan-400 text-black font-mono-tech font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  01
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                      ESCALÓN 1 · ATÓMICO & BINARIO
                    </span>
                    <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Modelos Lógicos & Álgebra Booleana" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    FÍSICA DE BITS, CODIFICACIÓN & LÓGICA DIGITAL
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Aprender cómo la materia física y los estados discretos se convierten en números, caracteres y compuertas lógicas.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800 font-mono-tech text-xs text-cyan-400 self-start sm:self-auto">
                4 EXPERIENCIAS (2 LABS + 2 JUEGOS)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {/* Lab F01: Codificación y Unidades */}
              <LabCardWithUsageGuide
                escalonNumber={1}
                itemOrder="LAB 1.1"
                id="lab-f01-encoding"
                title="Codificación y Unidades (SI vs IEC 60027-2)"
                icon={<Binary className="w-4 h-4 text-cyan-400" />}
                provenance="CALCULADO"
                provenanceSource="UTF-8 & Norma IEC 60027-2"
                summary="Inspeccioná byte por byte la conversión de caracteres en ASCII y UTF-8. Comprobá matemáticamente por qué tu disco de 1 TB muestra 931.32 GiB en Windows."
                accent="cyan"
                actionText="ABRIR CODIFICADOR"
                onAction={() => setEmbeddedView('info-rep')}
                usageData={{
                  objective: 'Comprender la diferencia formal entre el prefijo decimal comercial (SI) y el prefijo binario del sistema operativo (IEC), e inspeccionar el encuadre de bytes en texto.',
                  steps: [
                    'Escribí cualquier frase o palabra en el campo de texto interactivo.',
                    'Observá cómo cada carácter se descompone en su código hexadecimal, valor decimal y representación en 8 bits.',
                    'Probá caracteres con tildes o emojis para verificar cómo UTF-8 conmuta de 1 byte (ASCII puro) a secuencias multibyte (2 a 4 bytes).',
                    'Utilizá el deslizador de capacidad en Gigabytes para calcular la discrepancia exacta: Capacidad_GiB = Capacidad_GB * (1000^3 / 1024^3).',
                  ],
                  formulaOrPhysics: 'Factor de discrepancia: (10^9 / 2^30) ≈ 0.93132257. Windows utiliza división binaria (1024^3) denominándola erróneamente "GB" en lugar de "GiB".',
                  benchVerdict: 'El disco no tiene espacio dañado ni robado: se comprueba la discrepancia metrológica estándar entre fabricantes de discos e ingenieros de software.',
                }}
              />

              {/* Lab F02: Aritmética Binaria y Overflow */}
              <LabCardWithUsageGuide
                escalonNumber={1}
                itemOrder="LAB 1.2"
                id="lab-f02-binary-arithmetic"
                title="Aritmética Binaria, ALU y Detección de Overflow"
                icon={<Sliders className="w-4 h-4 text-cyan-400" />}
                provenance="CALCULADO"
                provenanceSource="Aritmética Booleana & Banderas ALU"
                summary="Conmutá manualmente los 8 bits de dos registros (A y B). Observá el acarreo bit a bit (Ripple Carry) y cómo la ALU activa banderas ZERO, CARRY y OVERFLOW."
                accent="cyan"
                actionText="ABRIR SUMADOR ALU"
                onAction={() => setEmbeddedView('binary-arithmetic')}
                usageData={{
                  objective: 'Demostrar el funcionamiento de una Unidad Aritmético-Lógica (ALU) de 8 bits y comprobar la saturación de enteros con y sin signo.',
                  steps: [
                    'Hacé clic en los interruptores individuales de 8 bits para configurar los operandos A y B.',
                    'Seleccioná la operación deseada: Suma (ADD), Resta (SUB), AND, OR o XOR.',
                    'Observá cómo se propagan los bits de acarreo (carry) desde la posición LSB (bit 0) hasta MSB (bit 7).',
                    'Sumá 127 + 1 en modo con signo (Signed) para forzar el desbordamiento (Overflow Flag activa) y notar cómo el resultado salta a -128.',
                  ],
                  formulaOrPhysics: 'Flag OF = C_{in, MSB} ⊕ C_{out, MSB}. Si se suman dos positivos y el bit de signo resulta 1, hay desbordamiento en complemento a dos.',
                  benchVerdict: 'Demuestra la causa raíz de bugs históricos como el desbordamiento de enteros (Integer Overflow) en motores de juegos y controladores de dispositivo.',
                }}
              />

              {/* Juego 01: Binary Quest */}
              <LabCardWithUsageGuide
                escalonNumber={1}
                itemOrder="JUEGO 1.1"
                id="game-01-binary-quest"
                title="Binary Quest // Conversión Rápida a Contrarreloj"
                icon={<Gamepad2 className="w-4 h-4 text-cyan-400" />}
                provenance="CALCULADO"
                provenanceSource="Métricas de Precisión y Cronómetro en Vivo"
                summary="Poné a prueba tu velocidad mental conmutando potencias de 2 (1, 2, 4, 8, 16, 32, 64, 128) para igualar el valor decimal solicitado antes de que se agote el tiempo."
                accent="cyan"
                actionText="JUGAR BINARY QUEST"
                onAction={() => setEmbeddedView('game-binary-quest')}
                usageData={{
                  objective: 'Entrenar el reconocimiento inmediato de pesos binarios y optimizar el cálculo mental de máscaras de bits y subredes.',
                  steps: [
                    'Presioná "INICIAR DESAFÍO" para arrancar el cronómetro de 45 segundos.',
                    'Observá el número decimal objetivo mostrado en pantalla.',
                    'Conmutá los interruptores de los bits necesarios sumando potencias de 2 hasta igualar el número.',
                    'Presioná "VALIDAR RESPUESTA" para sumar puntos y ganar segundos extra en tu racha.',
                  ],
                  formulaOrPhysics: 'Valor Decimal = ∑ (b_i * 2^i) para i = 0 hasta 7. Base de todo direccionamiento de memoria y registros de hardware.',
                  benchVerdict: 'Alcanzar una racha mayor a 10 demuestra agilidad en bajo nivel necesaria para depuración en depuradores x86/x64.',
                }}
              />

              {/* Juego 02: Logic Factory */}
              <LabCardWithUsageGuide
                escalonNumber={1}
                itemOrder="JUEGO 1.2"
                id="game-02-logic-factory"
                title="Logic Factory // Compuertas Booleanas & Tablas"
                icon={<Gamepad2 className="w-4 h-4 text-cyan-400" />}
                provenance="CALCULADO"
                provenanceSource="Lógica Determinista Booleana"
                summary="Rompecabezas de compuertas lógicas: combiná compuertas AND, OR, NOT, XOR y NAND para generar la salida esperada por el circuito de control de silicio."
                accent="cyan"
                actionText="JUGAR LOGIC FACTORY"
                onAction={() => setEmbeddedView('game-logic-factory')}
                usageData={{
                  objective: 'Resolver problemas de ingeniería lógica armando circuitos combinacionales que satisfagan tablas de verdad completas.',
                  steps: [
                    'Analizá la misión actual y la tabla de verdad requerida para las entradas A y B.',
                    'Seleccioná la compuerta lógica adecuada de la barra de herramientas (AND, OR, XOR, etc.).',
                    'Conectá las entradas y verificá si todas las filas de la tabla de verdad quedan validadas en verde.',
                    'Completá los 5 niveles progresivos desde inversión simple hasta multiplexor de 2 canales.',
                  ],
                  formulaOrPhysics: 'Álgebra de Boole elemental: Y = A · B (AND), Y = A + B (OR), Y = A ⊕ B (XOR), Teoremas de De Morgan.',
                  benchVerdict: 'Certifica la comprensión de cómo millones de transistores microscópicos se organizan en bloques lógicos funcionales dentro de la CPU.',
                }}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            ESCALÓN 2: FÍSICA, ELECTRICIDAD & SEÑALES
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'escala-2') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-yellow-800/60 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-yellow-400 text-black font-mono-tech font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)]">
                  02
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-bold">
                      ESCALÓN 2 · FÍSICA & ELECTRICIDAD
                    </span>
                    <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Leyes Electromagnéticas & Termodinámica" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    ELECTRICIDAD, SEÑALES DE RELOJ & CALOR EN SILICIO
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Comprender cómo los voltajes se convierten en señales cuadradas y por qué la disipación térmica es el límite del hardware.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-yellow-950/60 border border-yellow-800 font-mono-tech text-xs text-yellow-400 self-start sm:self-auto">
                3 EXPERIENCIAS (2 LABS + 1 JUEGO)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Lab F03: Electricidad y Ley de Ohm */}
              <LabCardWithUsageGuide
                escalonNumber={2}
                itemOrder="LAB 2.1"
                id="lab-f03-circuits"
                title="Electricidad en PC, Ley de Ohm y Efecto Joule"
                icon={<Zap className="w-4 h-4 text-yellow-400" />}
                provenance="CALCULADO"
                provenanceSource="Ley de Ohm: V = I · R | Potencia: P = I² · R"
                summary="Ajustá voltaje e impedancia de pistas y VRM. Calculá en tiempo real la corriente resultante (Amperes), potencia disipada (Watts) y calentamiento de pistas."
                accent="yellow"
                actionText="ABRIR BANCO ELÉCTRICO"
                onAction={() => setEmbeddedView('electric-circuits')}
                usageData={{
                  objective: 'Entender la relación matemática entre el voltaje que entrega la fuente o el VRM, la corriente demandada y el calor generado en las pistas de cobre.',
                  steps: [
                    'Elegí el riel a analizar: 12V (alimentación primaria), 5V/3.3V (periféricos) o 1.2V (Vcore de CPU).',
                    'Variá la resistencia interna o impedancia de carga del componente con el control deslizante.',
                    'Observá cómo a voltajes bajos (como 1.1V de CPU), entregar 200W requiere casi 180A de corriente.',
                    'Revisá la advertencia de calentamiento de pistas: el calor crece con el cuadrado de la corriente (I²).',
                  ],
                  formulaOrPhysics: 'Ley de Ohm: I = V / R. Ley de Joule: Potencia térmica P = I² · R. En una CPU a bajo voltaje, la corriente gigantesca exige múltiples fases VRM en paralelo.',
                  benchVerdict: 'Permite comprender por qué los conectores de 12V se derriten si hay resistencia parásita por falso contacto en placas de video de alto consumo.',
                }}
              />

              {/* Lab F04: Señales Digitales y Osciloscopio */}
              <LabCardWithUsageGuide
                escalonNumber={2}
                itemOrder="LAB 2.2"
                id="lab-f04-digital-signals"
                title="Señales Digitales, Reloj y Osciloscopio Digital"
                icon={<Waves className="w-4 h-4 text-yellow-400" />}
                provenance="CALCULADO"
                provenanceSource="Frecuencia f = 1/T | Niveles TTL y CMOS"
                summary="Generador de pulsos de reloj (0.5 a 5.5 GHz) con osciloscopio en pantalla CRT. Medí tiempos de subida (Rise Time), ciclo de trabajo (Duty Cycle) y jitter."
                accent="yellow"
                actionText="ABRIR OSCILOSCOPIO"
                onAction={() => setEmbeddedView('digital-signals')}
                usageData={{
                  objective: 'Inspeccionar visualmente cómo viaja la señal cuadrada de reloj a través de los buses y cómo se degrada con la frecuencia y la capacitancia parásita.',
                  steps: [
                    'Ajustá la frecuencia de reloj entre 1.0 GHz y 5.0 GHz.',
                    'Modificá el tiempo base (Time/Div) en el osciloscopio para congelar los ciclos de onda.',
                    'Cambiá el estándar de nivel lógico: TTL (5V/0V), CMOS clásico o Low-Voltage CMOS (1.2V).',
                    'Activá la simulación de ruido parásito para comprobar cómo el "Jitter" puede corromper el muestreo de datos en flanco ascendente.',
                  ],
                  formulaOrPhysics: 'Periodo T = 1 / f. A 5.0 GHz, cada ciclo dura apenas 0.20 nanosegundos (200 picosegundos). El tiempo de subida debe ser menor al 15% del ciclo.',
                  benchVerdict: 'Explica físicamente por qué no es posible subir indefinidamente los GHz de una CPU sin aumentar el voltaje o mejorar la integridad de señal del PCB.',
                }}
              />

              {/* Juego 06: VRM Thermal Runaway */}
              <LabCardWithUsageGuide
                escalonNumber={2}
                itemOrder="JUEGO 2.1"
                id="game-06-vrm-stress"
                title="VRM Thermal Runaway // Estrés de Fases y Calor"
                icon={<Flame className="w-4 h-4 text-yellow-400" />}
                provenance="SIMULADO"
                provenanceSource="Dinámica Térmica de MOSFETs & Fases VRM"
                summary="Desafío de gestión térmica: balanceá fases VRM, frecuencia de conmutación PWM y flujo de ventilación para alimentar picos transitorios de 240A sin quemar los MOSFETs."
                accent="yellow"
                actionText="JUGAR VRM RUNAWAY"
                onAction={() => setEmbeddedView('game-vrm-stress')}
                usageData={{
                  objective: 'Mantener la temperatura de los MOSFETs de potencia por debajo de los 105°C durante cargas de estrés dinámicas simulando renderizado pesado.',
                  steps: [
                    'Iniciá la prueba de estrés de la CPU para ver los saltos de corriente transitoria.',
                    'Ajustá el número de fases activas y el balanceo de carga para evitar que una fase individual se caliente más que las demás.',
                    'Modificá la velocidad del ventilador del disipador de VRM para contrarrestar la inercia térmica.',
                    'Evitá el "Thermal Throttling" o apagado de emergencia del sistema (VRM OTP).',
                  ],
                  formulaOrPhysics: 'Pérdidas de conmutación: P_{sw} ∝ f_{PWM} · V_{in} · I_{out} · (t_{r} + t_{f}). Pérdidas de conducción: P_{cond} = I_{rms}² · R_{DS(on)}.',
                  benchVerdict: 'Demuestra por qué una placa madre barata con 4 fases sin disipar colapsa cuando se le instala un procesador de gama alta desbloqueado.',
                }}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            ESCALÓN 3: ARQUITECTURA DE SILICIO & CPU
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'escala-3') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-800/60 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-purple-400 text-black font-mono-tech font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                  03
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">
                      ESCALÓN 3 · ARQUITECTURA & CPU
                    </span>
                    <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Microarquitectura x86 & Modelo Von Neumann" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    MICROARQUITECTURA, REGISTROS Y JERARQUÍA DE CACHÉ
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Inspección del corazón computacional: cómo la CPU busca instrucciones, administra registros y almacena datos en SRAM ultrarrápida.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-800 font-mono-tech text-xs text-purple-400 self-start sm:self-auto">
                3 EXPERIENCIAS (2 LABS + 1 JUEGO)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Lab F05: Simulador de CPU Von Neumann */}
              <LabCardWithUsageGuide
                escalonNumber={3}
                itemOrder="LAB 3.1"
                id="lab-f05-cpu-simulator"
                title="Simulador de CPU Didáctico // Ciclo Fetch-Decode-Execute"
                icon={<Cpu className="w-4 h-4 text-purple-400" />}
                provenance="CALCULADO"
                provenanceSource="Arquitectura Von Neumann Determinista"
                summary="CPU de 8 bits transparente: visualizá el Program Counter (PC), puntero de instrucción, decodificador de código de máquina y buses de datos paso a paso."
                accent="purple"
                actionText="ABRIR SIMULADOR CPU"
                onAction={() => setEmbeddedView('basic-cpu')}
                usageData={{
                  objective: 'Comprender el ciclo de instrucción universal que ejecutan todas las CPUs modernas miles de millones de veces por segundo.',
                  steps: [
                    'Cargá un programa de ejemplo en la memoria RAM (por ejemplo, contar de 1 a 10 o sumar dos registros).',
                    'Presioná el botón "PASO A PASO (STEP)" para ejecutar una sola microoperación.',
                    'Observá cómo en la fase FETCH el PC busca la dirección, en DECODE se interpreta el código de operación, y en EXECUTE la ALU calcula el resultado.',
                    'Ajustá la velocidad del reloj automático o ejecutá a velocidad libre (RUN) para ver los registros conmutar.',
                  ],
                  formulaOrPhysics: 'Tiempo de ejecución T = N_instrucciones · CPI · T_ciclo. Todo programa de software de alto nivel termina reducido a este ciclo elemental.',
                  benchVerdict: 'Permite desmitificar qué es un "hilo" o un "proceso": no es magia, es un contador de programa apuntando a una celda de memoria.',
                }}
              />

              {/* Lab 02B: Explorador de Microarquitectura y Caché */}
              <LabCardWithUsageGuide
                escalonNumber={3}
                itemOrder="LAB 3.2"
                id="lab-cpu-architecture"
                title="Explorador de Microarquitectura y Caché L1/L2/L3"
                icon={<Microchip className="w-4 h-4 text-purple-400" />}
                provenance="CALCULADO"
                provenanceSource="Tiempos de Acceso SRAM en Silicio"
                summary="Jerarquía de memoria en el die del silicio: latencia de ~1 ns en L1, ~3 ns en L2, ~12 ns en L3 vs ~60 ns en DRAM principal. Simulación de Cache Miss."
                accent="purple"
                actionText="EXPLORAR CACHÉ"
                onAction={() => onOpenHotSwap('architecture')}
                usageData={{
                  objective: 'Medir el impacto devastador en rendimiento cuando una instrucción sufre un fallo de caché (Cache Miss) y la CPU debe frenar esperando datos de la RAM.',
                  steps: [
                    'Seleccioná el tamaño de bloque de datos a procesar (desde 32 KB hasta 64 MB).',
                    'Observá la tasa de aciertos (Cache Hits) cuando el bloque cabe en L1/L2.',
                    'Aumentá el tamaño del arreglo para forzar accesos a memoria principal DRAM.',
                    'Comprobá la caída masiva de ancho de banda y el disparo de la latencia efectiva.',
                  ],
                  formulaOrPhysics: 'Latencia Media = t_{L1} + (Miss Rate_{L1} · t_{L2}) + (Miss Rate_{L2} · t_{L3}) + (Miss Rate_{L3} · t_{DRAM}).',
                  benchVerdict: 'Evidencia por qué los procesadores con caché 3D V-Cache rinden tanto más en videojuegos: reducen drásticamente las esperas a la memoria RAM.',
                }}
              />

              {/* Juego 03: CPU Mission */}
              <LabCardWithUsageGuide
                escalonNumber={3}
                itemOrder="JUEGO 3.1"
                id="game-03-cpu-mission"
                title="CPU Mission // Control de Registros y Ciclos"
                icon={<Gamepad2 className="w-4 h-4 text-purple-400" />}
                provenance="CALCULADO"
                provenanceSource="Microcódigo & Optimización de Ciclos"
                summary="Sos el decodificador de la CPU: optimizá el pipeline de ejecución reordenando instrucciones para evitar paradas (Stalls) y obtener las 3 estrellas de eficiencia."
                accent="purple"
                actionText="JUGAR CPU MISSION"
                onAction={() => setEmbeddedView('game-cpu-mission')}
                usageData={{
                  objective: 'Aprender técnicas de optimización de ensamblador y entender la ejecución fuera de orden (Out-of-Order Execution).',
                  steps: [
                    'Leé las instrucciones pendientes en la cola de decodificación.',
                    'Identificá dependencias de datos RAW (Read After Write) entre registros A, B y C.',
                    'Reordená las instrucciones independientes en los slots de ejecución paralela.',
                    'Minimizá los ciclos totales de reloj necesarios para completar el algoritmo solicitado.',
                  ],
                  formulaOrPhysics: 'IPC = Instrucciones / Ciclos. Un IPC superior a 1.0 indica paralelismo efectivo a nivel de instrucción (ILP).',
                  benchVerdict: 'Demuestra de forma práctica por qué dos procesadores a la misma frecuencia en GHz pueden tener rendimientos enormemente distintos.',
                }}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            ESCALÓN 4: BUSES, TOPOLOGÍA & LATENCIA DE MEMORIA
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'escala-4') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-800/60 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-400 text-black font-mono-tech font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  04
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      ESCALÓN 4 · BUSES & MEMORIA
                    </span>
                    <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Estándares JEDEC & PCI-SIG Oficiales" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    BUSES DE INTERCONEXIÓN, TOPOLOGÍA, RAM & PCIE
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Cálculo metrológico de anchos de banda, tiempos de acceso en nanosegundos y reparto de líneas de la placa madre.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 font-mono-tech text-xs text-emerald-400 self-start sm:self-auto">
                6 EXPERIENCIAS (5 LABS + 1 JUEGO)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Lab 01A: Pasaporte Técnico */}
              <LabCardWithUsageGuide
                escalonNumber={4}
                itemOrder="LAB 4.1"
                id="chapter-01-passport"
                title="Pasaporte Técnico de Hardware & Detección"
                icon={<Terminal className="w-4 h-4 text-emerald-400" />}
                provenance="MEDIDO"
                provenanceSource="WMI / PowerShell & Telemetría Real"
                summary="Extracción de la ficha técnica real de tu equipo: modelo de placa, procesador, módulos de memoria instalados y ranuras ocupadas sin inventar datos."
                accent="emerald"
                actionText="ABRIR PASAPORTE"
                onAction={() => onOpenChapter('01')}
                isCompleted={Boolean(dossierSummary?.passport)}
                usageData={{
                  objective: 'Obtener la verdad material de tu computadora mediante comandos de auditoría de bajo nivel en Windows.',
                  steps: [
                    'Revisá los componentes detectados por el sistema.',
                    'Copiá el script oficial de PowerShell de una sola línea provisto en el panel.',
                    'Abrí una consola PowerShell en tu PC y pegá el comando para obtener el informe en formato JSON.',
                    'Pegá los datos en el pasaporte para validar y firmar digitalmente el Capítulo 1 en tu dossier.',
                  ],
                  formulaOrPhysics: 'Consulta directa a tablas SMBIOS/DMI mediante CIM (Common Information Model). No se permiten aproximaciones ni datos inventados.',
                  benchVerdict: 'Garantiza que cualquier diagnóstico posterior se base en las especificaciones exactas del silicio instalado.',
                }}
              />

              {/* Lab 02A: Mapa de Flujo 001 */}
              <LabCardWithUsageGuide
                escalonNumber={4}
                itemOrder="LAB 4.2"
                id="chapter-02-flow-map"
                title="Mapa de Flujo 001: Enrutamiento del Bus"
                icon={<Network className="w-4 h-4 text-emerald-400" />}
                provenance="CALCULADO"
                provenanceSource="Diagrama de Bloques de Topología Chipset/CPU"
                summary="Diagrama interactivo de carriles de datos: líneas directas a la CPU (x16 GPU, x4 NVMe) vs carriles compartidos que pasan a través del chipset por el enlace DMI."
                accent="emerald"
                actionText="ABRIR MAPA DE FLUJO"
                onAction={() => onOpenChapter('02')}
                isCompleted={Boolean(dossierSummary?.flowMap)}
                usageData={{
                  objective: 'Descubrir el cuello de botella invisible del chipset y aprender en qué ranura M.2 conectar cada disco para no saturar el bus.',
                  steps: [
                    'Explorá los nodos del diagrama: CPU, RAM, Ranura PCIe 1, Ranura PCIe 2 y Chipset.',
                    'Simulá transferencias simultáneas entre discos NVMe conectados a la CPU y al Chipset.',
                    'Observá cómo el enlace DMI / PCH se satura cuando múltiples dispositivos compiten por el mismo bus.',
                    'Completá el cuestionario de topología para registrar tu aprobación en el dossier.',
                  ],
                  formulaOrPhysics: 'Ancho de Banda Chipset = Enlace DMI 4.0 x8 (aprox. 15.75 GB/s bidireccional). Compartido entre puertos SATA, USB, audio y ranuras secundarias.',
                  benchVerdict: 'Previene caídas de rendimiento en capturadoras y discos secundarios por instalar componentes en ranuras estranguladas.',
                }}
              />

              {/* Lab F06: Calculador de Latencia RAM */}
              <LabCardWithUsageGuide
                escalonNumber={4}
                itemOrder="LAB 4.3"
                id="lab-f06-ram-latency"
                title="Calculador de Latencia RAM (JEDEC en Nanosegundos)"
                icon={<Timer className="w-4 h-4 text-emerald-400" />}
                provenance="CALCULADO"
                provenanceSource="Fórmula JEDEC Oficial: (tCL * 2000) / MT/s"
                summary="Convertidor metrológico riguroso: descubrí por qué DDR4-3200 CL16 tiene una latencia real de 10.00 ns idéntica a DDR5-6000 CL30. Ancho de banda por canal."
                accent="emerald"
                actionText="ABRIR CALCULADOR RAM"
                onAction={() => setEmbeddedView('ram-latency')}
                usageData={{
                  objective: 'Desarmar el mito comercial de que "más Megahercios siempre es más rápido" comprobando el tiempo real de acceso a la primera palabra en nanosegundos.',
                  steps: [
                    'Elegí un perfil predeterminado o ingresá manualmente la velocidad en MT/s (ej: 6000 MT/s).',
                    'Ajustá el valor de CAS Latency (tCL) (ej: 30 o 36 ciclos).',
                    'Leé el resultado en nanosegundos calculados con dos decimales de precisión.',
                    'Compará el ancho de banda teórico en configuración Single Channel vs Dual Channel.',
                  ],
                  formulaOrPhysics: 'Latencia_ns = (tCL × 2000) / Frecuencia_MTs. Ancho_de_banda_GBs = (MT/s × 8 bytes × canales) / 1000.',
                  benchVerdict: 'Permite elegir la memoria óptima para juegos y productividad sin pagar de más por perfiles con subtimings descompensados.',
                }}
              />

              {/* Lab F07: Analizador de Pistas PCIe */}
              <LabCardWithUsageGuide
                escalonNumber={4}
                itemOrder="LAB 4.4"
                id="lab-f07-pcie-bandwidth"
                title="Analizador de Pistas PCIe y Ancho de Banda por Línea"
                icon={<Gauge className="w-4 h-4 text-emerald-400" />}
                provenance="CALCULADO"
                provenanceSource="Especificación PCI-SIG (Gen 3, 4, 5 con codificación 128b/130b)"
                summary="Calculá la tasa de transferencia bruta y efectiva para configuraciones x1, x4, x8 y x16 en generaciones PCIe 3.0, 4.0 y 5.0. Comprobá saturación de GPUs modernas."
                accent="emerald"
                actionText="ABRIR ANALIZADOR PCIE"
                onAction={() => setEmbeddedView('pcie-bandwidth')}
                usageData={{
                  objective: 'Determinar con precisión matemática si una placa de video o una unidad de almacenamiento NVMe sufrirá degradación en un zócalo con menos líneas.',
                  steps: [
                    'Seleccioná la generación PCIe del bus (Gen 3.0, Gen 4.0 o Gen 5.0).',
                    'Elegí el número físico y eléctrico de líneas asignadas (x1, x4, x8 o x16).',
                    'Observá la tasa neta descontando el overhead de codificación de línea (128b/130b en Gen 3+).',
                    'Cargá la demanda típica de una GPU tope de gama para comprobar el porcentaje de saturación.',
                  ],
                  formulaOrPhysics: 'Gen 3: 985 MB/s por línea. Gen 4: 1.969 GB/s por línea. Gen 5: 3.938 GB/s por línea. Rendimiento = líneas × tasa_neta.',
                  benchVerdict: 'Demuestra experimentalmente por qué placas como la RTX 4060 en ranuras PCIe 3.0 x8 pierden rendimiento en juegos que saturan la VRAM.',
                }}
              />

              {/* Lab 04B: Analizador de Latencias y Cuellos de Botella */}
              <LabCardWithUsageGuide
                escalonNumber={4}
                itemOrder="LAB 4.5"
                id="lab-hardware-latency"
                title="Analizador de Latencias y Cuellos de Botella"
                icon={<Sliders className="w-4 h-4 text-emerald-400" />}
                provenance="CALCULADO"
                provenanceSource="Algoritmo de Interconexión y Fricción de Hardware"
                summary="Herramienta avanzada de simulación de buses: evaluá cómo interactúan la velocidad de reloj del controlador de memoria (UCLK/FCLK) con la placa base."
                accent="emerald"
                actionText="ABRIR CALCULADOR"
                onAction={onOpenLatencyCalculator}
                usageData={{
                  objective: 'Analizar la desincronización entre el reloj del bus interno (Fabric Clock) y la memoria para eliminar latencias parásitas.',
                  steps: [
                    'Configurá la frecuencia de la memoria y la relación del divisor de reloj (1:1 o 1:2).',
                    'Observá la penalización de latencia en nanosegundos generada al desacoplar el controlador.',
                    'Modificá la configuración para encontrar el punto óptimo de funcionamiento estable.',
                  ],
                  formulaOrPhysics: 'Desacoplar 1:1 a 1:2 introduce una penalización fija de ~8 a 10 ns en el controlador de memoria integrado (IMC).',
                  benchVerdict: 'Comprueba por qué en ciertas plataformas AMD Ryzen, una memoria a 6000 MT/s sincronizada 1:1 rinde más que una a 7000 MT/s desfasada.',
                }}
              />

              {/* Juego 05: Silicon Memory Match */}
              <LabCardWithUsageGuide
                escalonNumber={4}
                itemOrder="JUEGO 4.1"
                id="game-05-memory-match"
                title="Silicon Memory Match // Subtimings y Frecuencia"
                icon={<Gamepad2 className="w-4 h-4 text-emerald-400" />}
                provenance="CALCULADO"
                provenanceSource="Validación de Estabilidad de Timings de Memoria"
                summary="Desafío técnico: emparejá módulos compatibles, ajustá voltajes VDD/VDDQ seguros y sincronizá subtimings primarios (tCL-tRCD-tRP-tRAS) sin provocar pantalla azul."
                accent="emerald"
                actionText="JUGAR MEMORY MATCH"
                onAction={() => setEmbeddedView('game-memory-match')}
                usageData={{
                  objective: 'Reconocer qué perfiles de memoria pueden funcionar juntos y aprender las consecuencias de sobrevoltajes y tiempos inestables.',
                  steps: [
                    'Inspeccioná las etiquetas técnicas de los módulos de memoria en la mesa de pruebas.',
                    'Descartá módulos con voltajes incompatibles o matrices de subtimings en conflicto.',
                    'Ajustá el perfil óptimo para maximizar el ancho de banda manteniendo la estabilidad.',
                    'Ejecutá el test de memoria rápido para verificar cero errores de paridad.',
                  ],
                  formulaOrPhysics: 'Compatibilidad JEDEC SPD: El sistema siempre negociará a la velocidad del módulo más lento presente en la placa.',
                  benchVerdict: 'Previene compras erróneas de memorias dispares que degradan el sistema al perfil estándar de recuperación a 2133 o 4800 MT/s.',
                }}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            ESCALÓN 5: RENDIMIENTO FÍSICO, FLUIDEZ & CUELLOS DE BOTELLA
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'escala-5') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-800/60 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  05
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                      ESCALÓN 5 · RENDIMIENTO & FPS
                    </span>
                    <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Telemetría de Frametimes & Percentiles Estadísticos" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    RENDIMIENTO REAL, FRAMETIMES & CUELLOS DE BOTELLA
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Por qué los "FPS promedio" son un engaño: medición milisegundo a milisegundo, percentiles 1% Low y saturación de hardware.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800 font-mono-tech text-xs text-amber-400 self-start sm:self-auto">
                5 EXPERIENCIAS (4 LABS + 1 HERRAMIENTA)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Lab 03A: Laboratorio de FPS y Fluidez */}
              <LabCardWithUsageGuide
                escalonNumber={5}
                itemOrder="LAB 5.1"
                id="chapter-03-fps-lab"
                title="Laboratorio de FPS, Fluidez y Frametimes (1% Low)"
                icon={<Activity className="w-4 h-4 text-amber-400" />}
                provenance="CALCULADO"
                provenanceSource="Análisis Estadístico de Frametimes en Tiempo Real"
                summary="Comprobá por qué un juego a 60 FPS promedio puede sentirse entrecortado: compará una gráfica de frametimes plana (16.6 ms) contra una con picos de stuttering (50 ms)."
                accent="amber"
                actionText="ABRIR LAB DE FLUIDEZ"
                onAction={() => onOpenChapter('03')}
                isCompleted={Boolean(dossierSummary?.fluidezProfile)}
                usageData={{
                  objective: 'Aprender a diagnosticar la verdadera fluidez visual mediante el tiempo de cuadro (frametime) y los percentiles estadísticos 1% Low y 0.1% Low.',
                  steps: [
                    'Seleccioná un perfil de juego: Fluido Perfecto, Micro-Stuttering o Cuello de Botella de CPU.',
                    'Observá el osciloscopio de tiempos de cuadro: cada cuadro debe tardar exactamente 16.6 ms a 60 Hz.',
                    'Descubrí cómo un solo cuadro que tarde 60 ms genera un tirón evidente aunque el contador de FPS marque 59.',
                    'Completá tu análisis en el formulario interactivo para registrar tu progreso en el dossier.',
                  ],
                  formulaOrPhysics: 'Frametime T = 1000 / FPS. Percentil 1% Low = promedio del 1% de cuadros más lentos generados durante la prueba.',
                  benchVerdict: 'Demuestra por qué sincronizar la tasa de cuadros mediante FreeSync/G-Sync o limitar FPS produce mayor suavidad que tener picos erráticos.',
                }}
              />

              {/* Lab 03B: Simulador de Gaming EVO */}
              <LabCardWithUsageGuide
                escalonNumber={5}
                itemOrder="LAB 5.2"
                id="lab-gaming-simulator"
                title="Simulador de Rendimiento en Juegos (1080p / 1440p / 4K)"
                icon={<Gamepad2 className="w-4 h-4 text-amber-400" />}
                provenance="SIMULADO"
                provenanceSource="Curvas de Carga de Motores Gráficos y APIs DirectX 12 / Vulkan"
                summary="Variá la resolución y la calidad gráfica: comprobá cómo a 1080p la CPU es el límite, mientras que a 4K el cuello de botella se traslada íntegramente a la GPU."
                accent="amber"
                actionText="SIMULAR JUEGOS"
                onAction={() => onOpenHotSwap('gaming')}
                usageData={{
                  objective: 'Entender matemáticamente el balance de cargas de renderizado según la resolución y el motor gráfico del juego.',
                  steps: [
                    'Seleccioná el título a emular (Shooter competitivo, Mundo abierto o Simulación física pesada).',
                    'Alterná la resolución entre 1080p (Full HD), 1440p (QHD) y 2160p (4K UHD).',
                    'Observá cómo a 1080p la GPU puede estar al 60% de uso esperando que la CPU complete las llamadas de dibujado (Draw Calls).',
                    'Subí a 4K para verificar cómo la GPU se satura al 99% y la CPU descansa al 30%.',
                  ],
                  formulaOrPhysics: 'Carga de GPU = Resolución × Efectos de Shaders. Carga de CPU = Lógica de juego, físicas, IA de NPCs y Draw Calls por segundo.',
                  benchVerdict: 'Explica por qué comprar una placa de video más potente no sube los FPS en juegos competitivos si el procesador es antiguo.',
                }}
              />

              {/* Lab 03C: Live Bench */}
              <LabCardWithUsageGuide
                escalonNumber={5}
                itemOrder="LAB 5.3"
                id="live-bench"
                title="Live Bench // Simulador Físico de Rendimiento"
                icon={<Zap className="w-4 h-4 text-amber-400" />}
                provenance="SIMULADO"
                provenanceSource="Modelos Físicos de Potencia, Convección Térmica y Curvas V/F"
                summary="Suite metrológica completa con renderizado Canvas de partículas y silicio. Estrés térmico, disipación por aire vs líquido y throttling por temperatura."
                accent="amber"
                actionText="ABRIR LIVE BENCH"
                onAction={() => setEmbeddedView('live-bench')}
                usageData={{
                  objective: 'Monitorear la respuesta en bucle cerrado de una CPU bajo estrés: consumo en Watts, aumento de temperatura y caída de frecuencia por límite térmico.',
                  steps: [
                    'Elegí el tipo de disipador montado: Disipador de fábrica por aire, Torre doble o Refrigeración líquida 360mm.',
                    'Iniciá la carga sostenida de estrés (All-Core Stress).',
                    'Observá cómo al alcanzar los 95°C o 100°C la CPU reduce automáticamente su voltaje y frecuencia (Thermal Throttling).',
                    'Verificá el consumo sostenido (PL1) frente a los picos transitorios de arranque (PL2).',
                  ],
                  formulaOrPhysics: 'Ecuación de calor: ΔT = P · R_{th} · (1 - e^{-t/τ}). Si T_{junction} > T_{tjmax}, el hardware baja el multiplicador para salvar el silicio.',
                  benchVerdict: 'Enseña a comprobar si un equipo rinde menos de lo esperado por culpa de un mal ensamble térmico o pasta disipadora seca.',
                }}
              />

              {/* Lab 04A: Encontrá el Límite */}
              <LabCardWithUsageGuide
                escalonNumber={5}
                itemOrder="LAB 5.4"
                id="chapter-04-limits"
                title="Encontrá el Límite: Matriz de Saturación CPU vs GPU"
                icon={<Scale className="w-4 h-4 text-amber-400" />}
                provenance="CALCULADO"
                provenanceSource="Telemetría de Tasas de Cuadro y Uso de Motores"
                summary="Experimento guiado: determiná con certeza metrológica qué componente está frenando a tu equipo. Construí la matriz de correlación en tu dossier."
                accent="amber"
                actionText="ABRIR MATRIZ DE LÍMITES"
                onAction={() => onOpenChapter('04')}
                isCompleted={Boolean(dossierSummary?.limitMatrix)}
                usageData={{
                  objective: 'Clasificar inequívocamente si un sistema tiene cuello de botella por GPU, por procesador, por memoria o por almacenamiento.',
                  steps: [
                    'Ingresá los datos de uso medidos en tu equipo o seleccioná un escenario de prueba.',
                    'Revisá el gráfico de dispersión de uso: ¿GPU al 99% o CPU al 100% con GPU al 70%?',
                    'Analizá los hilos individuales: un juego puede saturar 1 solo núcleo al 100% mientras el uso global muestra apenas 25%.',
                    'Guardá la matriz en tu dossier del Tomo 01.',
                  ],
                  formulaOrPhysics: 'Ley de Amdahl: El incremento de rendimiento de un sistema está limitado por la fracción del programa que no puede paralelizarse.',
                  benchVerdict: 'Evita el error común de creer que "la CPU está al 30%, así que no es el problema", descubriendo el cuello de botella monohilo.',
                }}
              />

              {/* Herramienta 04: Calculador de Cuello de Botella */}
              <LabCardWithUsageGuide
                escalonNumber={5}
                itemOrder="TOOL 5.1"
                id="tool-bottleneck"
                title="Calculador y Detector de Cuello de Botella"
                icon={<Gauge className="w-4 h-4 text-amber-400" />}
                provenance="CALCULADO"
                provenanceSource="Índice de Balanceo Dinámico de Hardware EVO LABS"
                summary="Herramienta metrológica que reemplaza las calculadoras engañosas de internet por un análisis basado en física de motores, resolución y APIs modernas."
                accent="amber"
                actionText="CALCULAR BALANCE"
                onAction={onOpenBottleneckSimulator}
                usageData={{
                  objective: 'Obtener un porcentaje de fricción de hardware confiable y específico para cada tipo de carga sin generalizaciones comerciales absurdas.',
                  steps: [
                    'Ingresá la CPU y la GPU a comparar.',
                    'Seleccioná la resolución nativa de tu monitor.',
                    'Elegí el perfil de uso principal (Juegos eSports, Juegos AAA pesados, Renderizado o Edición de video).',
                    'Leé el veredicto técnico con el componente sugerido para una futura actualización equilibrada.',
                  ],
                  formulaOrPhysics: 'Balance_Ratio = (Potencia_Efectiva_GPU / Potencia_Efectiva_CPU) ponderada por coeficiente de carga de renderizado.',
                  benchVerdict: 'Proporciona una respuesta sensata y fundamentada antes de gastar dinero en componentes incompatibles en potencia.',
                }}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            ESCALÓN 6: TALLER DE DIAGNÓSTICO, MONTAJE & PERITAJE
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'escala-6') && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-red-800/60 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-red-400 text-black font-mono-tech font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(248,113,113,0.4)]">
                  06
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
                      ESCALÓN 6 · TALLER & PERITAJE
                    </span>
                    <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Metodología Deductiva EVO LABS & Peritaje" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    TALLER DEDUCTIVO, MONTAJE, VALIDACIÓN A/B & PERITAJE
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    La cúspide técnica: armado físico sin incompatibilidades, diagnóstico con instrumental de laboratorio y validación empírica final.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-800 font-mono-tech text-xs text-red-400 self-start sm:self-auto">
                8 EXPERIENCIAS (7 LABS + 1 JUEGO)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Lab 05A: Mapeo de Actividad */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.1"
                id="chapter-05-activity"
                title="Mapeo de Actividad de Hardware y Cargas"
                icon={<Activity className="w-4 h-4 text-red-400" />}
                provenance="MEDIDO"
                provenanceSource="Monitores de Rendimiento de Windows & ETW"
                summary="Aprender a leer el comportamiento en reposo (idle) vs carga completa: identificar procesos parásitos en segundo plano y fugas de recursos del sistema."
                accent="orange"
                actionText="ABRIR MAPEO DE ACTIVIDAD"
                onAction={() => onOpenChapter('05')}
                isCompleted={Boolean(dossierSummary?.activityMap)}
                usageData={{
                  objective: 'Diferenciar entre un problema real de hardware y un sistema operativo sobrecargado por software basura o servicios fuera de control.',
                  steps: [
                    'Ejecutá el análisis de estado de reposo para medir el consumo base de CPU y RAM.',
                    'Activá una carga sintética controlada.',
                    'Observá las curvas de recuperación térmica y consumo energético.',
                    'Registrá los valores medidos en tu dossier.',
                  ],
                  formulaOrPhysics: 'Rendimiento Neto = Capacidad Física del Hardware - Sobrecarga Parásita del Sistema Operativo.',
                  benchVerdict: 'Permite recuperar fluidez en equipos lentos sin necesidad de gastar dinero en piezas nuevas.',
                }}
              />

              {/* Lab 06A: Taller de Diagnóstico Deductivo */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.2"
                id="chapter-06-deductive"
                title="Taller de Diagnóstico Deductivo de PC"
                icon={<Stethoscope className="w-4 h-4 text-red-400" />}
                provenance="CALCULADO"
                provenanceSource="Árbol de Decisión Causa-Raíz EVO LABS"
                summary="Metodología paso a paso: falla de encendido, reinicios espontáneos, congelamientos aleatorios y pantallas azules analizados metódicamente."
                accent="orange"
                actionText="ABRIR TALLER DEDUCTIVO"
                onAction={() => onOpenChapter('06')}
                isCompleted={Boolean(dossierSummary?.diagnosticCase)}
                usageData={{
                  objective: 'Reemplazar las conjeturas de "cambiar piezas al azar" por un método de descarte lógico basado en síntomas verificables.',
                  steps: [
                    'Seleccioná uno de los casos clínicos de avería propuestos.',
                    'Analizá los síntomas iniciales (LEDs de depuración, pitidos del buzzer, registros de eventos).',
                    'Elegí qué prueba diagnóstica ejecutar primero respetando el principio de menor intervención.',
                    'Completá el informe pericial en tu dossier identificando el componente causante del fallo.',
                  ],
                  formulaOrPhysics: 'Método científico aplicado: Observación del síntoma → Formulación de hipótesis → Prueba de falsación → Conclusión demostrada.',
                  benchVerdict: 'Ahorra horas de prueba y error y evita dañar componentes sanos al reparar una computadora.',
                }}
              />

              {/* Lab 07A: Laboratorio Final A/B */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.3"
                id="chapter-07-ab-lab"
                title="Laboratorio Final A/B: Validación Empírica"
                icon={<CheckCircle2 className="w-4 h-4 text-red-400" />}
                provenance="CALCULADO"
                provenanceSource="Comparación de Hipótesis y Métricas Antes/Después"
                summary="El examen final del Tomo 01: medí una configuración base (A), aplicá una modificación fundamentada (B) y comprobá si la mejora es estadísticamente real."
                accent="orange"
                actionText="ABRIR LAB FINAL A/B"
                onAction={() => onOpenChapter('07')}
                isCompleted={Boolean(dossierSummary?.labReport)}
                usageData={{
                  objective: 'Demostrar el lema de EVO LABS ("NO LO CREAS. COMPROBALO") certificando si una optimización generó una mejora medible.',
                  steps: [
                    'Configurá el estado inicial (Escenario A) y registrá las métricas clave.',
                    'Efectuá la modificación de hardware o software bajo prueba (Escenario B).',
                    'Calculá el delta de cambio porcentual y verificá si supera el margen de error del instrumental.',
                    'Firmá y cerrá tu Dossier de Arquitectura del Tomo 01.',
                  ],
                  formulaOrPhysics: 'Delta Porcentual: Δ% = ((Métrica_B - Métrica_A) / Métrica_A) × 100. Solo variaciones > 3% son estadísticamente significativas.',
                  benchVerdict: 'Otorga la certificación del Tomo 01 validando el expediente técnico completo del usuario.',
                }}
              />

              {/* Lab C01: Simulador de Armado de PC */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.4"
                id="lab-pc-builder"
                title="Simulador de Armado y Compatibilidad de PC"
                icon={<Box className="w-4 h-4 text-red-400" />}
                provenance="CALCULADO"
                provenanceSource="Matriz de Sockets, Factor de Forma y Potencia de Fuentes"
                summary="Armá tu computadora en un entorno seguro: comprobá sockets (LGA1700, AM5), clearances de cooler, compatibilidad de RAM y cálculo de potencia de fuente."
                accent="orange"
                actionText="ABRIR SIMULADOR DE ARMADO"
                onAction={() => onOpenLabCore('BUILD_PC')}
                usageData={{
                  objective: 'Aprender a seleccionar piezas 100% compatibles física y eléctricamente antes de proceder a la compra y ensamblado real.',
                  steps: [
                    'Elegí el procesador y verificá qué placas madre coinciden en socket y chipset.',
                    'Verificá que el cooler elegido tenga capacidad de disipación (TDP en Watts) superior al consumo del chip.',
                    'Seleccioná la fuente de alimentación calculando el consumo total del sistema más un 20% de margen de seguridad.',
                    'Verificá las dimensiones del gabinete para la placa de video y radiadores.',
                  ],
                  formulaOrPhysics: 'Potencia_Recomendada_PSU = (TDP_CPU + TDP_GPU + 100W_periféricos) × 1.25 (factor de eficiencia y transitorios).',
                  benchVerdict: 'Elimina devoluciones y disgustos por comprar componentes físicamente incompatibles o fuentes con falta de potencia.',
                }}
              />

              {/* Lab C02: Gemelo Digital de Silicio */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.5"
                id="lab-digital-twin"
                title="Gemelo Digital de Silicio e Inspección"
                icon={<Sparkles className="w-4 h-4 text-red-400" />}
                provenance="SIMULADO"
                provenanceSource="Réplica Digital de los 12 Subsistemas de Placa Madre"
                summary="Representación interactiva tridimensional de los 12 subsistemas de hardware: zócalo, fases de poder, pistas de memoria, chipset, ranuras y conectores traseros."
                accent="orange"
                actionText="ABRIR GEMELO DIGITAL"
                onAction={onOpenDigitalTwin}
                usageData={{
                  objective: 'Inspeccionar visualmente cada zona crítica de la placa madre y entender qué función cumple cada circuito integrado y componente pasivo.',
                  steps: [
                    'Navegá por los 12 subsistemas interactivos de la placa madre.',
                    'Hacé foco en el VRM para ver la disposición de MOSFETs, bobinas (chokes) y capacitores.',
                    'Inspeccioná el generador de reloj, chip de audio dedicado y controlador de red Ethernet.',
                    'Consultá las especificaciones y niveles de tensión de cada circuito.',
                  ],
                  formulaOrPhysics: 'Topología electrónica ATX estándar e interconexión multicapa de cobre en placa de 6 a 8 capas (layers).',
                  benchVerdict: 'Brinda una comprensión integral de la anatomía física que sostiene al microprocesador y la memoria.',
                }}
              />

              {/* Lab C03: PCB Canvas */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.6"
                id="pcb-canvas"
                title="PCB Canvas: Placa Madre & Pistas VRM"
                icon={<Layers className="w-4 h-4 text-red-400" />}
                provenance="SIMULADO"
                provenanceSource="Visualizador Esquemático de Pistas de Cobre y Puntos de Prueba"
                summary="Explorador esquemático de alta resolución: seguí el rastro del cobre desde los conectores EPS de 12V hasta el socket, ranuras DIMM y zócalos PCIe."
                accent="orange"
                actionText="EXPLORAR PCB CANVAS"
                onAction={() => setEmbeddedView('pcb-canvas')}
                usageData={{
                  objective: 'Comprender cómo viajan las señales y corrientes masivas a través de las diferentes capas del circuito impreso (PCB).',
                  steps: [
                    'Hacé zoom sobre la placa madre interactiva con la rueda del ratón.',
                    'Seleccioná una línea de alimentación o bus de datos para resaltar las pistas correspondientes.',
                    'Observá la ubicación de los puntos de prueba (Test Points) utilizados en servicio técnico para medir voltajes con multímetro.',
                    'Identificá los condensadores de desacoplo situados debajo del socket de la CPU.',
                  ],
                  formulaOrPhysics: 'Impedancia característica de pistas: Z_0 ≈ (87 / √(ε_r + 1.41)) · ln(5.98h / (0.8w + t)). Crítica para evitar reflexiones en altas frecuencias.',
                  benchVerdict: 'Enseña la importancia de la calidad de construcción del PCB en la estabilidad de memorias a altas velocidades.',
                }}
              />

              {/* Lab C04: Diagnóstico Físico & Códigos POST en Tiempo Real */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="LAB 6.7"
                id="lab-post-hardware-diag"
                title="Diagnóstico Físico de Hardware y Códigos POST en Vivo"
                icon={<Radio className="w-4 h-4 text-amber-400" />}
                provenance="CALCULADO"
                provenanceSource="ATX12V v3.0 & Bus eSPI/LPC UEFI AMI Aptio"
                summary="Alterná en vivo entre el multímetro digital en rieles ATX, analizador de señales de control (PS_ON#, PWR_OK, RESET#) y display 7 segmentos de códigos POST."
                accent="amber"
                actionText="ABRIR BANCO DIAGNÓSTICO"
                onAction={() => setEmbeddedView('post-diag')}
                usageData={{
                  objective: 'Alternar entre la inspección multimetrológica física y la lectura sincrónica de los códigos POST en el bus digital de arranque x86/UEFI.',
                  steps: [
                    'Seleccioná la pestaña deseada: "DIAGNÓSTICO DE HARDWARE FÍSICO", "CÓDIGOS POST EN TIEMPO REAL" o "BANCO DUAL INTEGRADO".',
                    'Conectá el interruptor AC (alimenta +5VSB en pin 9) y pulsá POWER para observar la bajada de PS_ON# y elevación de rieles principales.',
                    'Pausá o avanzá paso a paso para examinar el decodificador oficial del código hexadecimal activo y los Q-LEDs.',
                    'Inyectá fallas de taller (corto en VRM EPS 12V, error 55 de RAM, o error 99 de GPU) para ver la respuesta del multímetro y el código POST de congelamiento.',
                  ],
                  formulaOrPhysics: 'Tolerancia ATX: Rieles principales dentro de ±5%. Código POST 0xAA = salida de UEFI Boot Services y handoff al Kernel NT de Windows.',
                  benchVerdict: 'Permite aislar inequívocamente si una falla se origina en la entrega de energía física o en el software de firmware UEFI.',
                }}
              />

              {/* Juego 04: Hardware Rescue */}
              <LabCardWithUsageGuide
                escalonNumber={6}
                itemOrder="JUEGO 6.1"
                id="game-04-hardware-rescue"
                title="Hardware Rescue // Peritaje con Instrumental Real"
                icon={<Gamepad2 className="w-4 h-4 text-red-400" />}
                provenance="CALCULADO"
                provenanceSource="Simulador de Taller Técnico con Multímetro y Tarjeta POST"
                summary="Sos el técnico perito de guardia: una PC no da video ni arranca. Usá el multímetro, analizador de código POST y cámara térmica para hallar el componente defectuoso."
                accent="orange"
                actionText="JUGAR HARDWARE RESCUE"
                onAction={() => setEmbeddedView('game-hardware-rescue')}
                usageData={{
                  objective: 'Aplicar todo el conocimiento de los 6 escalones para resolver casos reales de servicio técnico utilizando instrumental virtual de taller.',
                  steps: [
                    'Leé el parte de falla reportado por el cliente.',
                    'Colocá la tarjeta de depuración POST para leer el código de error hexadecimal (ej: 00, 55, D6).',
                    'Medí con las puntas del multímetro las tensiones de Standby (5VSB, 3.3V, Vcore).',
                    'Inspeccioná térmicamente la placa en busca de cortocircuitos calientes.',
                    'Emití el diagnóstico formal y reemplazá el componente averiado para reparar el equipo.',
                  ],
                  formulaOrPhysics: 'Secuencia POST (Power-On Self-Test): Fuente OK → CPU Reset liberado → Inicialización de RAM → Detección de Video → Búsqueda de Boot.',
                  benchVerdict: 'Consolida la metodología deductiva profesional: medir antes de tocar, comprobar antes de concluir.',
                }}
              />
            </div>
          </section>
        )}

      </main>

      {/* =========================================================================
          FOOTER DE SALIDA
      ========================================================================= */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          <span className="font-bold text-zinc-300">EVO LABS // CENTRAL METROLÓGICA TOMO 01: CONOCÉ TU PC</span>
        </div>
        <div className="text-amber-400 font-bold uppercase tracking-wider">
          NO LO CREAS. COMPROBALO.
        </div>
      </footer>
    </div>
  );
};
