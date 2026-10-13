import React from 'react';
import {
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export const TutorBreadcrumbBar: React.FC = () => {
  const {
    mode,
    setMode,
    setIsTutorOpen,
  } = useTutorEvo();

  return (
    <aside aria-label="Lema Editorial y Orientación Tutor EVO" className="w-full bg-[#07090f]/90 border-b border-zinc-850 px-4 py-2 text-xs font-sans-editorial select-none transition-all print:hidden no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Single Discreet Canonical Editorial Line */}
        <div className="flex items-center gap-2.5 font-mono-tech text-[11px] tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] shrink-0" />
          <span className="text-zinc-300 font-bold">
            NO LO CREAS. <span className="text-amber-300">COMPROBALO.</span>
          </span>
          <span className="hidden md:inline text-zinc-700">//</span>
          <span className="hidden md:inline text-zinc-500 font-normal">
            EVIDENCIA EMPÍRICA Y TELEMETRÍA TÉCNICA
          </span>
        </div>

        {/* Right side: Subordinate Mode & [ ? TUTOR EVO ] */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Subtle Mode Switcher */}
          <div className="flex items-center bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/80 text-[10px] font-mono-tech">
            <button
              type="button"
              onClick={() => setMode('guiado')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                mode === 'guiado'
                  ? 'bg-amber-400 text-black font-extrabold shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Modo Guiado: Tutor EVO asiste con orientación estructurada"
            >
              GUIADO
            </button>
            <button
              type="button"
              onClick={() => setMode('libre')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                mode === 'libre'
                  ? 'bg-zinc-800 text-zinc-200 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
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
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 text-[11px] font-mono-tech font-bold flex items-center gap-1.5 transition-all cursor-pointer"
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
