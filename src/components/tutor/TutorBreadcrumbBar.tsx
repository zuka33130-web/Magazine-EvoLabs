import React from 'react';
import {
  Compass,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export const TutorBreadcrumbBar: React.FC = () => {
  const {
    mode,
    setMode,
    currentLocation,
    setIsTutorOpen,
  } = useTutorEvo();

  return (
    <aside aria-label="Orientación Permanente Tutor EVO" className="w-full bg-[#080c14] border-b border-zinc-800/80 px-4 py-2 text-xs font-sans-editorial select-none transition-all print:hidden no-print">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
        {/* Core Orientation: ESTÁS ACÁ • AHORA • DESPUÉS */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono">
          {/* ESTÁS ACÁ */}
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>ESTÁS ACÁ:</span>
            </span>
            <span className="text-zinc-400">{currentLocation.academySection}</span>
            {currentLocation.tomoNumber && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className="text-white font-bold bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800">
                  TOMO {currentLocation.tomoNumber}
                </span>
              </>
            )}
            {currentLocation.chapterTitle && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-300 truncate max-w-[160px] sm:max-w-xs">
                  {currentLocation.chapterTitle}
                </span>
              </>
            )}
          </div>

          <span className="hidden sm:inline text-zinc-700">|</span>

          {/* AHORA */}
          {currentLocation.currentAction && (
            <div className="flex items-center gap-1">
              <span className="text-amber-300/90 font-bold text-[10px] uppercase">AHORA:</span>
              <span className="text-zinc-200 font-medium truncate max-w-[220px] sm:max-w-md">
                {currentLocation.currentAction}
              </span>
            </div>
          )}

          {/* DESPUÉS */}
          {currentLocation.nextStep && (
            <>
              <span className="hidden md:inline text-zinc-700">|</span>
              <div className="hidden md:flex items-center gap-1 text-zinc-400">
                <span className="text-emerald-400/90 font-bold text-[10px] uppercase">DESPUÉS:</span>
                <span className="truncate max-w-[180px] lg:max-w-xs">{currentLocation.nextStep}</span>
              </div>
            </>
          )}
        </div>

        {/* Right side: Subordinate Mode & [ ? TUTOR EVO ] */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {/* Subtle Mode Switcher */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setMode('guiado')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                mode === 'guiado'
                  ? 'bg-amber-400 text-black font-extrabold shadow'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Modo Guiado: Tutor EVO explica todo paso a paso"
            >
              GUIADO
            </button>
            <button
              type="button"
              onClick={() => setMode('libre')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                mode === 'libre'
                  ? 'bg-zinc-800 text-zinc-200 font-bold border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Modo Libre: Navegación directa"
            >
              LIBRE
            </button>
          </div>

          {/* Subordinate Tutor Button: [ ? TUTOR EVO ] */}
          <button
            type="button"
            onClick={() => setIsTutorOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Abrir orientación y glosario de Tutor EVO"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>? TUTOR EVO</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
