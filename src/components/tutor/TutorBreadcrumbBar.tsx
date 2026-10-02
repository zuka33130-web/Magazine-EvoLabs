import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export const TutorBreadcrumbBar: React.FC = () => {
  const {
    mode,
    setMode,
    currentLocation,
    openTutorWithTab,
    setIsTutorOpen,
  } = useTutorEvo();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <aside aria-label="Orientación Permanente Tutor EVO" className="w-full bg-[#080c14] border-b border-zinc-800/80 px-4 py-2 text-xs font-sans-editorial select-none transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Left: ESTÁS ACÁ Path */}
        <div className="flex flex-wrap items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>ESTÁS ACÁ:</span>
          </span>

          <span className="text-zinc-300 font-semibold">{currentLocation.academySection}</span>

          {currentLocation.tomoNumber && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-white font-bold bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                TOMO {currentLocation.tomoNumber}
              </span>
            </>
          )}

          {currentLocation.chapterTitle && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-300 truncate max-w-[200px] sm:max-w-xs">
                {currentLocation.chapterTitle}
              </span>
            </>
          )}

          {currentLocation.activityTitle && (
            <>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-cyan-400 font-bold">{currentLocation.activityTitle}</span>
            </>
          )}
        </div>

        {/* Center/Right: Action + Why + Mode Toggle + Tutor EVO Button */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
          {/* Collapsible Info Drawer for Action / Why / Next */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900/60 border border-zinc-800 md:hidden"
          >
            <span>{isExpanded ? 'Ocultar guía' : 'Ver orientación'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Mode Switcher: GUIADO vs LIBRE */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setMode('guiado')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                mode === 'guiado'
                  ? 'bg-amber-400 text-black font-extrabold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Modo Guiado: Tutor EVO explica todo paso a paso con consejos contextuales"
            >
              GUIADO
            </button>
            <button
              type="button"
              onClick={() => setMode('libre')}
              className={`px-2 py-1 rounded transition-all cursor-pointer ${
                mode === 'libre'
                  ? 'bg-zinc-800 text-zinc-200 font-bold border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Modo Libre: Navegación directa para usuarios experimentados"
            >
              LIBRE
            </button>
          </div>

          {/* Persistent TUTOR EVO Button */}
          <button
            type="button"
            onClick={() => setIsTutorOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>TUTOR EVO</span>
          </button>
        </div>
      </div>

      {/* Expanded Quick Guidance Row (Visible by default in Guiado or when expanded on mobile) */}
      {(mode === 'guiado' || isExpanded) && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-zinc-800/60 grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] font-sans-editorial animate-in fade-in duration-200">
          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
              AHORA
            </span>
            <span className="text-zinc-200 font-medium">{currentLocation.currentAction}</span>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
              POR QUÉ
            </span>
            <span className="text-zinc-300">{currentLocation.whyItMatters}</span>
          </div>

          <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold text-[9px] uppercase tracking-wider shrink-0 mt-0.5">
              DESPUÉS
            </span>
            <span className="text-zinc-300">{currentLocation.nextStep}</span>
          </div>
        </div>
      )}
    </aside>
  );
};
