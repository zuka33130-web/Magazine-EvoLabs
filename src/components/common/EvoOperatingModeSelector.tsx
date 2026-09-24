import React from 'react';
import { useEvoOperatingMode } from '../../hooks/useEvoOperatingMode';
import { Gauge, Microscope, ShieldCheck, Binary, Sliders } from 'lucide-react';

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
        className={`inline-flex items-center p-1 rounded-xl bg-[#090b10] border border-zinc-800 shadow-inner font-mono-tech select-none ${className}`}
        title={`Modo de Instrumentación Activo: ${isPericial ? 'PERICIAL (Telemetría de Kernel & Nanosegundos)' : 'ESENCIAL (Diagnóstico Directo)'}`}
      >
        <button
          type="button"
          onClick={() => setMode('esencial')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            !isPericial
              ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.45)]'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              !isPericial ? 'bg-black animate-pulse' : 'bg-zinc-600'
            }`}
          />
          <Gauge className="w-3 h-3" />
          <span>ESENCIAL</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('pericial')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isPericial
              ? 'bg-cyan-400 text-black shadow-[0_0_16px_rgba(34,211,238,0.5)]'
              : 'text-zinc-400 hover:text-cyan-300'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPericial ? 'bg-black animate-ping' : 'bg-zinc-600'
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
      className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#0f131c] via-[#090b10] to-[#06070a] border-2 border-zinc-800/90 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-mono-tech select-none relative overflow-hidden ${className}`}
    >
      {/* Industrial Decorative Corner Accents */}
      <div className="absolute top-1 left-2 text-[8px] text-zinc-600 tracking-widest pointer-events-none">
        EVO-OPERATING-SWITCH // REV. 2.4
      </div>
      <div className="absolute top-1 right-2 flex items-center gap-1 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              MODO DE INSTRUMENTACIÓN & TELEMETRÍA
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-zinc-800 text-zinc-300 border border-zinc-700">
              HARDWARE AUDIT
            </span>
          </div>
          <p className="text-xs text-zinc-300 font-sans-editorial">
            {isPericial
              ? 'Nivel Pericial activado: Análisis de nanosegundos (ns), colas DPC en microsegundos (µs) y registros de kernel.'
              : 'Nivel Esencial activado: Lectura clara, diagnósticos directos y semáforos de optimización recomendada.'}
          </p>
        </div>

        {/* Industrial Dual-Capsule Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-black/80 border border-zinc-800 shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => setMode('esencial')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              !isPericial
                ? 'bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.45)] ring-1 ring-amber-300'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                !isPericial ? 'bg-black animate-pulse' : 'bg-zinc-600'
              }`}
            />
            <ShieldCheck className="w-3.5 h-3.5" />
            <div className="flex flex-col text-left leading-none">
              <span className="tracking-wide">MODO ESENCIAL</span>
              <span className="text-[8.5px] opacity-75 font-normal">SÍNTESIS CLAVE</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('pericial')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isPericial
                ? 'bg-cyan-400 text-black shadow-[0_0_18px_rgba(34,211,238,0.5)] ring-1 ring-cyan-300'
                : 'text-zinc-400 hover:text-cyan-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPericial ? 'bg-black animate-ping' : 'bg-zinc-600'
              }`}
            />
            <Microscope className="w-3.5 h-3.5" />
            <div className="flex flex-col text-left leading-none">
              <span className="tracking-wide">MODO PERICIAL</span>
              <span className="text-[8.5px] opacity-75 font-normal">DPC // SUB-NS</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
