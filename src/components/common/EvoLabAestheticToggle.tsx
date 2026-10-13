import React from 'react';
import { useLabAestheticMode } from '../../utils/labAestheticMode';
import { Sparkles, RotateCcw } from 'lucide-react';

interface EvoLabAestheticToggleProps {
  compact?: boolean;
  className?: string;
}

export const EvoLabAestheticToggle: React.FC<EvoLabAestheticToggleProps> = ({
  compact = false,
  className = '',
}) => {
  const { mode, isElite, toggle } = useLabAestheticMode();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggle}
        className={`group relative overflow-hidden transition-all duration-200 cursor-pointer rounded-full font-mono-tech ${
          isElite
            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.18)]'
            : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.1] hover:border-white/20'
        } ${
          compact
            ? 'px-3 py-1 text-[11px]'
            : 'px-3.5 py-1.5 text-xs font-bold'
        }`}
        title={
          isElite
            ? 'Modo activo: Estética de Ingeniería Élite. Hacé clic para volver a la versión clásica.'
            : 'Modo activo: Versión Clásica. Hacé clic para activar la Estética de Ingeniería Élite.'
        }
      >
        <div className="flex items-center gap-1.5">
          {isElite ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24] shrink-0" />
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="tracking-tight uppercase font-extrabold flex items-center gap-1">
                <span>ÉLITE</span>
              </span>
            </>
          ) : (
            <>
              <RotateCcw className="w-3 h-3 text-zinc-400 group-hover:text-amber-400 shrink-0" />
              <span className="tracking-tight uppercase font-medium">
                CLÁSICO
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
