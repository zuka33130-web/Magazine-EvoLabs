import React from 'react';
import { useEvoOperatingMode } from '../../hooks/useEvoOperatingMode';
import { Gauge, Microscope, ShieldCheck } from 'lucide-react';

interface EvoOperatingModeSelectorProps {
  compact?: boolean;
  className?: string;
}

export const EvoOperatingModeSelector: React.FC<EvoOperatingModeSelectorProps> = ({
  compact = false,
  className = '',
}) => {
  const { mode, setMode } = useEvoOperatingMode();
  const isPericial = mode === 'pericial';

  if (compact) {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-full bg-black/60 border border-white/[0.08] backdrop-blur-xl shadow-sm font-mono-tech select-none ${className}`}
        title={`Modo de Instrumentación Activo: ${isPericial ? 'PERICIAL (Telemetría de Kernel & Nanosegundos)' : 'ESENCIAL (Diagnóstico Directo)'}`}
      >
        <button
          type="button"
          onClick={() => setMode('esencial')}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            !isPericial
              ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(251,191,36,0.35)]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              !isPericial ? 'bg-black animate-pulse shadow-[0_0_4px_rgba(0,0,0,0.5)]' : 'bg-zinc-600'
            }`}
          />
          <Gauge className="w-3 h-3" />
          <span>ESENCIAL</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('pericial')}
          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
            isPericial
              ? 'bg-cyan-400 text-black shadow-[0_0_14px_rgba(34,211,238,0.4)]'
              : 'text-zinc-400 hover:text-cyan-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              isPericial ? 'bg-black animate-pulse shadow-[0_0_4px_rgba(0,0,0,0.5)]' : 'bg-zinc-600'
            }`}
          />
          <Microscope className="w-3 h-3" />
          <span>PERICIAL</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-3xl bg-black/60 border border-white/[0.08] backdrop-blur-xl shadow-2xl font-mono-tech select-none relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
              MODO DE INSTRUMENTACIÓN & TELEMETRÍA
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              AUDIT
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-sans-editorial">
            {isPericial
              ? 'Nivel Pericial activado: Análisis de nanosegundos (ns), colas DPC en microsegundos (µs) y registros de kernel.'
              : 'Nivel Esencial activado: Lectura clara, diagnósticos directos y semáforos de optimización recomendada.'}
          </p>
        </div>

        {/* Industrial Dual-Capsule Toggle */}
        <div className="flex items-center p-0.5 rounded-full bg-black/80 border border-white/[0.08] shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => setMode('esencial')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              !isPericial
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                !isPericial ? 'bg-black animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <Gauge className="w-3.5 h-3.5" />
            <span>MODO ESENCIAL</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('pericial')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isPericial
                ? 'bg-cyan-400 text-black shadow-[0_0_14px_rgba(34,211,238,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPericial ? 'bg-black animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <Microscope className="w-3.5 h-3.5" />
            <span>MODO PERICIAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
