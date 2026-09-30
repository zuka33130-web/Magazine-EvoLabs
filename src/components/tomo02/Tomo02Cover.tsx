import React from 'react';
import {
  BookOpen,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  Terminal,
  Shield,
  Zap,
  Activity,
  Award,
  ChevronRight,
} from 'lucide-react';
import { TOMO_02_META } from '../../data/tomo02Data';

interface Tomo02CoverProps {
  onOpenIndex: () => void;
  onOpenA4Magazine: () => void;
  onOpenPrintModal: () => void;
  onBackToApp?: () => void;
  completedModulesCount?: number;
  totalModulesCount?: number;
}

export const Tomo02Cover: React.FC<Tomo02CoverProps> = ({
  onOpenIndex,
  onOpenA4Magazine,
  onOpenPrintModal,
  onBackToApp,
  completedModulesCount = 0,
  totalModulesCount = 26,
}) => {
  const isStarted = completedModulesCount > 0;
  const isAllDone = completedModulesCount >= totalModulesCount;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Main Magazine Cover Container: Rich Editorial Poster Aesthetic */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#06080E] via-[#090D17] to-[#04060A] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_0_60px_rgba(0,210,255,0.12)] overflow-hidden font-sans-editorial">
        {/* Subtle Background Circuit & Glow Matrix */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-tech-grid" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Magazine Masthead Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-cyan-950/80 text-xs font-mono-tech">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-cyan-400 inline-block shadow-[0_0_10px_#00D2FF]" />
            <span className="text-white font-extrabold tracking-widest uppercase">
              ACADEMIA EVO LABS
            </span>
            <span className="text-cyan-700">|</span>
            <span className="text-cyan-300 font-semibold tracking-wider uppercase">
              SISTEMA DE APRENDIZAJE TECNOLÓGICO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase tracking-widest text-[11px]">
              EDICIÓN PERICIAL 2026
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] font-bold">
              TOMO 02
            </span>
          </div>
        </div>

        {/* Main Cover Typography & Editorial Hook */}
        <div className="relative z-10 my-8 sm:my-12 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest text-cyan-400 uppercase font-bold">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>SISTEMA INTERNO, KERNEL NT & METROLOGÍA DE PRECISIÓN</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-[0.92]">
            LA BIBLIA NEGRA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              DE WINDOWS
            </span>
          </h1>

          <p className="font-sans-editorial text-lg sm:text-2xl text-cyan-100/90 font-medium italic max-w-2xl leading-relaxed pt-1">
            “El lado oculto de Windows. Descubrilo.”
          </p>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed pt-2">
            El sistema operativo que usás todos los días esconde mucho más de lo que imaginás.
            Sin recetas mágicas de internet ni debloaters ciegos: una inmersión rigurosa en el
            arranque UEFI, System32, el Kernel Ring 0, la memoria virtual y el diagnóstico reproducible.
          </p>
        </div>

        {/* 3 Main Magazine Teasers / Editorial Sections */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 pb-8 border-y border-cyan-950/80 font-mono-tech text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>EL DESPERTAR DEL BOOT</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              De la energía eléctrica en los pines de la CPU a bootmgfw.efi, particiones GPT y el primer píxel del shell.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>RING 0 & MEMORIA REAL</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              Por qué la RAM libre es memoria desperdiciada, cómo auditar latencias DPC y el peligro de matar svchost.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>REVERSIBILIDAD TOTAL</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans-editorial leading-snug">
              El pacto fundamental: no se toca nada sin comando de rollback, registro de baseline y evidencia medible.
            </p>
          </div>
        </div>

        {/* Reader Progress Summary Badge */}
        {isStarted && (
          <div className="relative z-10 mt-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono-tech">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="font-bold text-white uppercase block">
                  PROGRESO EN ESTE TOMO
                </span>
                <span className="text-cyan-300">
                  {completedModulesCount} de {totalModulesCount} módulos completados
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-cyan-400 text-black font-extrabold text-[11px]">
              {Math.round((completedModulesCount / totalModulesCount) * 100)}%
            </span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={onOpenIndex}
              className="px-6 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>{isStarted ? 'CONTINUAR LECTURA // ÍNDICE' : 'ENTRAR AL ÍNDICE EDITORIAL'}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onOpenA4Magazine}
              className="px-5 py-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-900/80 hover:border-cyan-400 text-cyan-200 font-mono-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>REVISTA A4 VERTICAL (36 PÁGS)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenPrintModal}
            className="px-4 py-3 rounded-xl bg-transparent hover:bg-cyan-950/40 border border-cyan-950 text-zinc-400 hover:text-cyan-300 font-mono-tech text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>EXPORTAR PDF</span>
          </button>
        </div>

        {/* Barcode & Editorial Legal Footer */}
        <div className="relative z-10 mt-8 pt-4 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono-tech text-zinc-600">
          <span>COLECCIÓN FORENSE // EDICIÓN MONOGRÁFICA // NO LO CREAS. COMPROBALO.</span>
          <span className="text-cyan-500 font-bold">ISBN-EVO-T02-NT64</span>
        </div>
      </div>
    </div>
  );
};
