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
  Circle,
  ExternalLink,
  Sliders,
  Terminal,
  Gauge,
  Sparkles,
  Zap,
  Box,
  Compass,
} from 'lucide-react';
import { UserHardwarePassport, Tome01DossierSummary } from '../../types';

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
  | 'cap-01'
  | 'cap-02'
  | 'cap-03'
  | 'cap-04'
  | 'cap-05'
  | 'cap-06'
  | 'cap-07'
  | 'complementarios';

type EmbeddedView = 'none' | 'pcb-canvas' | 'live-bench';

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

  // Progress calculations
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-mono-tech text-xs uppercase font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← VOLVER A LABORATORIOS TOMO 01</span>
            </button>
            <span className="font-mono-tech text-xs text-zinc-400 uppercase">
              PCB CANVAS // PLACA MADRE INTERACTIVA (TOMO 01)
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 font-mono-tech text-xs uppercase font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← VOLVER A LABORATORIOS TOMO 01</span>
            </button>
            <span className="font-mono-tech text-xs text-zinc-400 uppercase">
              LIVE BENCH // SIMULADOR FÍSICO DE RENDIMIENTO (TOMO 01)
            </span>
          </div>
          <Suspense fallback={<div className="p-12 text-center text-amber-400 font-mono-tech text-sm">Cargando Live Bench...</div>}>
            <EvoLiveBenchSuite passport={passport ?? null} />
          </Suspense>
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
              LABORATORIOS Y HERRAMIENTAS
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
              <span>LABS & TOOLS</span>
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
                CENTRAL METROLÓGICA // TOMO 01
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">
                ARQUITECTURA DE COMPUTADORAS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase leading-tight">
              LABORATORIOS Y HERRAMIENTAS
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400">
                TOMO 01 — CONOCÉ TU PC
              </span>
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-3xl font-sans-editorial">
              Todos los laboratorios, simuladores físicos y herramientas técnicas del Tomo 01 reunidos en una entrada única. Organizados rigurosamente en el orden didáctico de lectura del magazine para verificar experimentalmente cada concepto de hardware y silicio.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono-tech">
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Laboratorios Canónicos</span>
                <span className="text-xl font-black text-white">12 REGISTROS</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Herramientas Vinculadas</span>
                <span className="text-xl font-black text-amber-400">6 + 2 ASOCIADAS</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Capítulos con Práctica</span>
                <span className="text-xl font-black text-cyan-400">7 SECCIONES</span>
              </div>
              <div className="p-3 rounded-xl border border-zinc-800 bg-black/40">
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Tu Progreso de Dossier</span>
                <span className="text-xl font-black text-emerald-400">{completedChaptersCount} / 7 VALIDADOS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SELECTOR DE CAPÍTULOS / FILTRO RÁPIDO
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
            TODOS LOS LABORATORIOS
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-01')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-01'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 01 · PASAPORTE
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-02')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-02'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 02 · FLUJO & CACHÉ
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-03')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-03'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 03 · FPS & FLUIDEZ
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-04')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-04'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 04 · LÍMITES & LATENCIA
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-05')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-05'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 05 · WINDOWS & PROCESOS
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-06')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-06'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 06 · DIAGNÓSTICO
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('cap-07')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'cap-07'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            CAP 07 · EXPERIMENTO A/B
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter('complementarios')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === 'complementarios'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            COMPLEMENTARIOS (ARMADO & PCB)
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. CUERPO DIDÁCTICO ORDENADO SEGÚN EL MAGAZINE
      ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

        {/* ---------------------------------------------------------------------
            CAPÍTULO 01 — IDENTIFICACIÓN Y PASAPORTE DE MI PC
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-01') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  01
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 01 — IDENTIFICACIÓN Y PASAPORTE DE MI PC
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Inspección directa de silicio y creación de la firma técnica de hardware.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-amber-400">
                PRÁCTICA INTEGRADA
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono-tech font-bold uppercase">
                      PRÁCTICA DEL CAPÍTULO · NO DUPLICADA
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      ID: chapter-01-passport
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Pasaporte Técnico de la PC & Comandos PowerShell
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Identificación real del microprocesador, zócalos de memoria RAM, controladora gráfica y almacenamiento. Incluye el script de extracción mediante PowerShell para documentar los signos vitales de tu propia computadora en el expediente del Tomo 01.
                  </p>

                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 text-xs font-mono-tech text-zinc-400 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {passport?.cpu
                        ? `Pasaporte emitido: ${passport.cpu} · ${passport.ram_gb ?? ''} GB RAM`
                        : 'El pasaporte se genera al ejecutar la prueba pericial dentro del capítulo interactivo.'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 min-w-[200px]">
                  <button
                    type="button"
                    onClick={() => onOpenChapter('01')}
                    className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                  >
                    <span>ABRIR PRÁCTICA CAP 01</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
                    {dossierSummary?.passport ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASAPORTE COMPLETADO
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        PENDIENTE DE EMISIÓN
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            CAPÍTULO 02 — CÓMO TRABAJAN LOS COMPONENTES
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-02') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  02
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 02 — CÓMO TRABAJAN LOS COMPONENTES
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Buses de datos, controlador de memoria IMC, jerarquía de caché y cuellos de botella iniciales.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-amber-400">
                2 LABORATORIOS · 1 HERRAMIENTA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lab 1: Mapa de Flujo 001 */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold uppercase">
                      LABORATORIO CANÓNICO
                    </span>
                    <span className="text-zinc-500">ID: chapter-02</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <span>Mapa de Flujo 001</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Laboratorio interactivo de cargas y flujo de datos del Capítulo 02. Analiza el recorrido de bits entre CPU, memoria y GPU para detectar saturaciones de bus en tiempo real.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-emerald-400 font-bold">
                    {dossierSummary?.flowMap ? '● COMPLETADO' : '○ DISPONIBLE'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenChapter('02')}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>EJECUTAR MAPA DE FLUJO</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              {/* Lab 2: Explorador de Microarquitectura y Caché */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold uppercase">
                      SIMULADOR DE SILICIO
                    </span>
                    <span className="text-zinc-500">ID: lab-cpu-architecture</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <span>Explorador de Microarquitectura y Caché</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Inspección visual de la jerarquía de caché L1, L2, L3, registros internos del procesador y controlador de memoria integrado (IMC). Demuestra el impacto de los nanosegundos de latencia.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                    DISPONIBLE EN BANCO
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenHotSwap('architecture')}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>ABRIR EXPLORADOR</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Herramienta Vinculada del Capítulo 02 */}
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-tech text-xs">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">
                    HERRAMIENTA VINCULADA: Simulador de flujo de caché L1/L2/L3 e IMC
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    ID: inv-cache-imc-flow · Integrada en el motor de arquitectura sin duplicación
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenHotSwap('architecture')}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold transition-all cursor-pointer text-center"
              >
                ABRIR HERRAMIENTA →
              </button>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            CAPÍTULO 03 — RENDIMIENTO Y FLUIDEZ
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-03') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  03
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 03 — RENDIMIENTO Y FLUIDEZ
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Frametimes, percentiles 1% / 0.1% Low, simulación de cargas de juego y micro-stuttering.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-amber-400">
                3 LABORATORIOS · 1 HERRAMIENTA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lab 1: Laboratorio de FPS y fluidez */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold uppercase">
                      LABORATORIO CANÓNICO
                    </span>
                    <span className="text-zinc-500">ID: chapter-03</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-amber-400" />
                    <span>Laboratorio de FPS y fluidez</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Registrá ajustes de renderizado, fluctuaciones de frametimes y descubrí por qué los FPS promedio mienten cuando hay microtirones.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-emerald-400 font-bold">
                    {dossierSummary?.fluidezProfile ? '● COMPLETADO' : '○ DISPONIBLE'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenChapter('03')}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ABRIR LAB →
                  </button>
                </div>
              </div>

              {/* Lab 2: Simulador de Juegos EVO */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold uppercase">
                      SIMULADOR
                    </span>
                    <span className="text-zinc-500">ID: lab-gaming-simulator</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span>Simulador de Juegos EVO</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Probá resolución (1080p / 1440p / 4K), carga gráfica, consumo de VRAM y consistencia de entrega en la etapa de juegos de Ultimate Sandbox.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                    DISPONIBLE
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenHotSwap('gaming')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ABRIR SIMULADOR →
                  </button>
                </div>
              </div>

              {/* Lab 3: Simuladores físicos de rendimiento (Live Bench) */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold uppercase">
                      BANCO FÍSICO
                    </span>
                    <span className="text-zinc-500">ID: live-bench</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-purple-400" />
                    <span>Simuladores físicos de rendimiento</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Experimentación en tiempo real con resolución, carga sintética, curvas térmicas y variación de latencias absolutas de memoria RAM.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-purple-400 font-bold">
                    DISPONIBLE
                  </span>
                  <button
                    type="button"
                    onClick={() => setEmbeddedView('live-bench')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ABRIR LIVE BENCH →
                  </button>
                </div>
              </div>
            </div>

            {/* Herramienta Vinculada del Capítulo 03 */}
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-tech text-xs">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-pink-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">
                    HERRAMIENTA VINCULADA: Analizador Metrológico de Frametimes (1% & 0.1% Lows)
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    ID: med-frametime-analyzer · Componente FpsLabStation · Propiedad canónica Tomo 07 preservada
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenHotSwap('telemetry')}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold transition-all cursor-pointer text-center"
              >
                ABRIR EN TELEMETRÍA →
              </button>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            CAPÍTULO 04 — LÍMITES DEL HARDWARE
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-04') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  04
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 04 — LÍMITES DEL HARDWARE
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Aislamiento de variables, cálculo de nanosegundos y diagnóstico de componentes limitantes.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-amber-400">
                2 LABORATORIOS · 4 HERRAMIENTAS VINCULADAS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lab 1: Encontrá el límite */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold uppercase">
                      LABORATORIO CANÓNICO
                    </span>
                    <span className="text-zinc-500">ID: chapter-04</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <span>Encontrá el límite: experimento controlado</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Contrastá sospechas, cadencia CPU/GPU y otros limitantes; registrá una prueba de una sola variable y su matriz de evidencia científica.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-emerald-400 font-bold">
                    {dossierSummary?.limitMatrix ? '● COMPLETADO' : '○ DISPONIBLE'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenChapter('04')}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>ABRIR EXPERIMENTO</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              {/* Lab 2: Analizador de Latencias y Cuellos de Botella */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold uppercase">
                      SIMULADOR DE HARDWARE
                    </span>
                    <span className="text-zinc-500">ID: lab-hardware-latency</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span>Analizador de Latencias y Cuellos de Botella</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Cálculo en nanosegundos (tCL / frecuencia) y topología de buses PCIe. Permite determinar el punto exacto donde el ancho de banda se congestiona.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                    DISPONIBLE
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenHotSwap('hardware')}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>ABRIR ANALIZADOR</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Herramientas vinculadas agrupadas sin duplicar motores */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 space-y-3 font-mono-tech text-xs">
              <span className="text-amber-400 font-bold uppercase tracking-wider block text-[11px]">
                HERRAMIENTAS ASOCIADAS AL CAPÍTULO 04 (SIN DUPLICACIÓN DE MOTORES)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Herramienta 1 */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/50 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-purple-400 font-bold block text-xs">
                      Detector de Cuello de Botella
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      ID: diag-bottleneck-calc
                    </span>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      Calcula si CPU, GPU o bus PCIe limitan la carga activa.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenBottleneckSimulator}
                    className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-center font-bold"
                  >
                    ABRIR CALCULADOR →
                  </button>
                </div>

                {/* Herramienta 2 */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/50 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-amber-400 font-bold block text-xs">
                      Latencias en Nanosegundos
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      ID: med-latency-calc
                    </span>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      Aplica la fórmula matemática exacta (CL / MHz) * 2000.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenLatencyCalculator}
                    className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-center font-bold"
                  >
                    CALCULAR NS →
                  </button>
                </div>

                {/* Herramienta 3 */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/50 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-cyan-400 font-bold block text-xs">
                      Monitor de Sensores
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      ID: med-sensors-telemetry
                    </span>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      Vcore, frecuencias, temperaturas y consumo en Watts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenHotSwap('telemetry')}
                    className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-center font-bold"
                  >
                    VER TELEMETRÍA →
                  </button>
                </div>

                {/* Herramienta 4 */}
                <div className="p-3.5 rounded-xl border border-zinc-800 bg-black/50 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block text-xs">
                      Banco Hot-Swap & Descarte
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      ID: rep-hotswap-bench
                    </span>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      Intercambio virtual de piezas y descarte de inestabilidad.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenHotSwap('sandbox')}
                    className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-center font-bold"
                  >
                    BANCO HOT-SWAP →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            CAPÍTULO 05 — WINDOWS Y PROCESOS (COMPARTIDO CANÓNICAMENTE)
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-05') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  05
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 05 — WINDOWS Y PROCESOS
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Procesos, servicios, telemetría y las 8 estaciones de intervención reversible.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-blue-950/70 border border-blue-500/40 font-mono-tech text-xs text-blue-300 font-bold">
                RECURSO COMPARTIDO (TOMO 01 / TOMO 02)
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 text-[10px] font-mono-tech font-bold uppercase">
                      PROPIEDAD CANÓNICA CONSERVADA
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      ID: chapter-05
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Primera intervención: procesos y carga de Windows (8 Estaciones)
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Observá procesos, carga y servicios; documentá una intervención reversible en las ocho estaciones del capítulo existente. Accesible directamente desde el recorrido pedagógico del Tomo 01 sin alterar su catálogo maestro.
                  </p>

                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 text-xs font-mono-tech text-zinc-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
                      Regla de oro: No tocar servicios críticos sin medir línea base previa y verificar reversibilidad.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 min-w-[200px]">
                  <button
                    type="button"
                    onClick={() => onOpenChapter('05')}
                    className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                  >
                    <span>ABRIR CAPÍTULO 05</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
                    {dossierSummary?.activityMap ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        8 ESTACIONES COMPLETADAS
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        ESTACIONES DISPONIBLES
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            CAPÍTULO 06 — TALLER DE DIAGNÓSTICO
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-06') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  06
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 06 — TALLER DE DIAGNÓSTICO
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Diagnóstico deductivo, formulación de hipótesis técnicas y resolución pericial de fallas.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-amber-400">
                1 LABORATORIO MAESTRO
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono-tech font-bold uppercase">
                      LABORATORIO CANÓNICO
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      ID: chapter-06
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Taller de diagnóstico deductivo de PC
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Construí hipótesis, seleccioná pruebas con instrumental, ejecutá intervenciones guiadas y documentá el cierre del caso con las estaciones completas del taller existente (Casos A, B y C).
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0 min-w-[200px]">
                  <button
                    type="button"
                    onClick={() => onOpenChapter('06')}
                    className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                  >
                    <span>ABRIR TALLER CAP 06</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
                    {dossierSummary?.diagnosticCase ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CASO DIAGNOSTICADO
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        DISPONIBLE PARA ANÁLISIS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            CAPÍTULO 07 — LABORATORIO FINAL
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'cap-07') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  07
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    CAPÍTULO 07 — LABORATORIO FINAL A/B
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Protocolo de 7 fases, comparación metrológica controlada y emisión de dictamen pericial.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-amber-400">
                1 LABORATORIO · 1 HERRAMIENTA VINCULADA
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono-tech font-bold uppercase">
                      LABORATORIO CANÓNICO
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      ID: chapter-07
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Laboratorio final A/B de hardware (7 Fases)
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Medí la línea base (Escenario A), aplicá una modificación con una sola variable controlada (Escenario B), compará métricas y redactá tu conclusión técnica final antes del Examen Oficial.
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0 min-w-[200px]">
                  <button
                    type="button"
                    onClick={() => onOpenChapter('07')}
                    className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                  >
                    <span>ABRIR LAB FINAL CAP 07</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-tech text-zinc-400">
                    {dossierSummary?.labReport ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        DICTAMEN EMITIDO
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        7 FASES LISTAS
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Herramienta Vinculada A/B */}
              <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-tech text-xs">
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-white font-bold block">
                      HERRAMIENTA VINCULADA: Cámara de comparación metrológica A/B
                    </span>
                    <span className="text-zinc-400 text-[11px]">
                      ID: opt-ab-comparison · Reutiliza el motor de contraste A/B sin duplicaciones
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenHotSwap('sandbox')}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold transition-all cursor-pointer text-center"
                >
                  ABRIR CÁMARA A/B →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            LABORATORIOS COMPLEMENTARIOS DEL TOMO 01
        --------------------------------------------------------------------- */}
        {(selectedFilter === 'all' || selectedFilter === 'complementarios') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-400 text-black font-mono-tech font-black text-sm flex items-center justify-center">
                  +
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    EXPLORACIÓN COMPLEMENTARIA DEL HARDWARE
                  </h2>
                  <p className="text-xs font-mono-tech text-zinc-400">
                    Simulación de ensamble, réplica de silicio en tiempo real y topología interactiva de pistas PCB.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono-tech text-xs text-cyan-400">
                3 SIMULADORES · 1 HERRAMIENTA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Complementario 1: Simulador de Armado y Compatibilidad de PC */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold uppercase">
                      SIMULADOR
                    </span>
                    <span className="text-zinc-500">ID: lab-pc-builder</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Box className="w-5 h-5 text-cyan-400" />
                    <span>Simulador de Armado de PC</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Verificación de zócalos de microprocesador, compatibilidad de sockets, factor de forma, equilibrio de consumo en Watts y holgura térmica.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                    DISPONIBLE
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenLabCore('BUILD_PC', 'IDLE')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ARMAR PC →
                  </button>
                </div>
              </div>

              {/* Complementario 2: Gemelo Digital e Inspección de Silicio */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-400 font-bold uppercase">
                      RÉPLICA DIGITAL
                    </span>
                    <span className="text-zinc-500">ID: lab-digital-twin</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Gemelo Digital de Silicio</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Réplica digital determinista de los 12 subsistemas de la placa madre. Herramienta global de inspección reutilizada desde su modal existente.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-amber-400 font-bold">
                    DISPONIBLE
                  </span>
                  <button
                    type="button"
                    onClick={onOpenDigitalTwin}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-amber-400/50 hover:border-amber-400 text-amber-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ABRIR GEMELO →
                  </button>
                </div>
              </div>

              {/* Complementario 3: PCB Canvas: placa madre interactiva */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono-tech text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold uppercase">
                      TOPOLOGÍA INTERACTIVA
                    </span>
                    <span className="text-zinc-500">ID: pcb-canvas</span>
                  </div>

                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <span>PCB Canvas: Placa Madre</span>
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Exploración detallada de pistas de cobre, componentes, señales eléctricas y puntos de prueba de la placa base en vista esquemática.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono-tech text-xs text-emerald-400 font-bold">
                    DISPONIBLE
                  </span>
                  <button
                    type="button"
                    onClick={() => setEmbeddedView('pcb-canvas')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    EXPLORAR PCB →
                  </button>
                </div>
              </div>
            </div>

            {/* Herramienta Vinculada Esquemático PCB */}
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-tech text-xs">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-white font-bold block">
                    HERRAMIENTA VINCULADA: Esquemático interactivo de placa madre & pistas VRM
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    ID: inv-pcb-schematic · Comparte acceso unificado con la experiencia de PCB Canvas
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmbeddedView('pcb-canvas')}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold transition-all cursor-pointer text-center"
              >
                VER ESQUEMÁTICO →
              </button>
            </div>
          </section>
        )}

      </main>

      {/* =========================================================================
          FOOTER DE SALIDA
      ========================================================================= */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>EVO LABS // COLECCIÓN TÉCNICA TOMO 01: CONOCÉ TU PC</span>
        </div>
        <div className="text-amber-400 font-bold uppercase tracking-wider">
          NO LO CREAS. COMPROBALO.
        </div>
      </footer>
    </div>
  );
};
