import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface TelemetryMetric {
  label: string;
  beforeVal: string;
  afterVal: string;
  delta: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface AntesDespuesCompareProps {
  title: string;
  subtitle?: string;
  testCase: string;
  beforeLabel?: string;
  afterLabel?: string;
  metrics: TelemetryMetric[];
  verdictNote: string;
  graphType?: 'frametime' | 'bar' | 'table';
}

export const AntesDespuesCompare: React.FC<AntesDespuesCompareProps> = ({
  title,
  subtitle = 'LABORATORIO PERICIAL EVO // BANCO DE ENSAYO EMPÍRICO',
  testCase,
  beforeLabel = 'ESTADO INICIAL (ANTES)',
  afterLabel = 'INTERVENCIÓN CONTROLADA (DESPUÉS)',
  metrics,
  verdictNote,
}) => {
  return (
    <div className="bg-[#0c0f16] border border-zinc-700/80 rounded-lg p-3 my-2 shadow-lg text-xs font-mono-tech">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-400 inline-block" />
          <span className="font-bold text-white uppercase text-[11px] tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[9px] text-zinc-500 uppercase tracking-widest hidden sm:inline">
          {subtitle}
        </span>
      </div>

      {/* Test Case Context */}
      <div className="text-[10px] text-zinc-400 mb-2 font-sans-editorial italic">
        Caso de prueba: <strong className="text-zinc-200">{testCase}</strong>
      </div>

      {/* Two columns: Before vs After metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
        {/* BEFORE CARD */}
        <div className="p-2 bg-[#121620] border border-zinc-800 rounded">
          <div className="flex justify-between items-center text-[9px] text-zinc-400 border-b border-zinc-800/80 pb-1 mb-1.5">
            <span className="font-bold uppercase text-rose-300/90">{beforeLabel}</span>
            <span className="text-zinc-500">BASELINE</span>
          </div>
          <div className="space-y-1 text-[11px]">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <span className="text-zinc-400 text-[10px]">{m.label}:</span>
                <span className="text-zinc-200 font-bold">{m.beforeVal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="p-2 bg-[#121620] border border-yellow-400/30 rounded">
          <div className="flex justify-between items-center text-[9px] text-zinc-400 border-b border-zinc-800/80 pb-1 mb-1.5">
            <span className="font-bold uppercase text-yellow-400">{afterLabel}</span>
            <span className="text-yellow-400/80">MEDICIÓN</span>
          </div>
          <div className="space-y-1 text-[11px]">
            {metrics.map((m, idx) => {
              const deltaColor =
                m.type === 'positive'
                  ? 'text-emerald-400'
                  : m.type === 'negative'
                  ? 'text-rose-400'
                  : 'text-zinc-400';
              return (
                <div key={idx} className="flex justify-between items-baseline">
                  <span className="text-zinc-400 text-[10px]">{m.label}:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{m.afterVal}</span>
                    <span className={`text-[10px] font-bold ${deltaColor}`}>
                      ({m.delta})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visual Frametime/Jitter comparison bar simulation */}
      <div className="p-2 bg-black/40 border border-zinc-800/80 rounded mb-2 text-[9px]">
        <div className="flex justify-between text-zinc-400 mb-1">
          <span>CURVA DE LATENCIA & VARIANZA DE CUADROS</span>
          <span className="text-zinc-500">FRECUENCIA DE PICOS DE STUTTER</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-12 text-zinc-400 text-right shrink-0">ANTES:</span>
            <div className="flex-1 h-3 bg-zinc-900 rounded overflow-hidden flex items-center gap-0.5 px-0.5">
              <span className="h-full bg-emerald-500/70 w-8 inline-block" />
              <span className="h-full bg-rose-500 w-2 inline-block" title="Stutter 42ms" />
              <span className="h-full bg-emerald-500/70 w-12 inline-block" />
              <span className="h-full bg-rose-500 w-3 inline-block" title="Stutter 58ms" />
              <span className="h-full bg-emerald-500/70 w-10 inline-block" />
              <span className="h-full bg-amber-400 w-2 inline-block" />
              <span className="h-full bg-emerald-500/70 flex-1 inline-block" />
            </div>
            <span className="text-rose-400 font-bold shrink-0">PICOS FRECUENTES</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 text-yellow-400 text-right shrink-0 font-bold">DESPUÉS:</span>
            <div className="flex-1 h-3 bg-zinc-900 rounded overflow-hidden flex items-center gap-0.5 px-0.5">
              <span className="h-full bg-emerald-400 flex-1 inline-block" />
            </div>
            <span className="text-emerald-400 font-bold shrink-0">LÍNEA PLANA (FLUIDEZ)</span>
          </div>
        </div>
      </div>

      {/* Footer Verdict */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-900">
        <span className="font-sans-editorial text-zinc-300">
          <strong className="text-yellow-400 font-mono-tech">Conclusión pericial:</strong> {verdictNote}
        </span>
        <span className="text-[9px] text-zinc-500 uppercase tracking-wider hidden md:inline">
          1 VARIABLE AISLADA // REPRODUCIBLE
        </span>
      </div>
    </div>
  );
};
