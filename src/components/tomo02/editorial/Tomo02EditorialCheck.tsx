import React from 'react';
import { HelpCircle, CheckCircle2, ShieldCheck, Sparkles, Activity, FileCheck2 } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { CheckQuestion } from '../Tomo02ModuleReader';

interface Tomo02EditorialCheckProps {
  module: TomoModuleItem;
  questionData?: CheckQuestion;
}

export const Tomo02EditorialCheck: React.FC<Tomo02EditorialCheckProps> = ({
  module,
  questionData,
}) => {
  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Header */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-0.5">
            <span className="text-purple-400 font-bold">DESAFÍO DE COMPROBACIÓN TÉCNICA</span>
            <span className="text-zinc-600">/</span>
            <span>EVALUACIÓN PERICIAL [{module.moduleNumber}]</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
            {module.title}
          </h2>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-wider block">
            NIVEL DE EVALUACIÓN
          </span>
          <span className="text-xs font-mono-tech text-purple-300 font-bold">
            INTERPRETACIÓN TELEMÉTRICA
          </span>
        </div>
      </div>

      {/* Main Question & Options Container */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-[#060B16] via-[#04070F] to-black border border-cyan-900/60 shadow-xl space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 pb-2 border-b border-cyan-950/80">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider block font-bold mb-0.5">
                PREGUNTA METODOLÓGICA // ANÁLISIS DETERMINISTA:
              </span>
              <p className="text-sm sm:text-base font-display font-bold text-white leading-snug">
                {questionData?.question ||
                  `Al inspeccionar las estructuras del subsistema ${module.title}, ¿cuál es el factor determinante para aislar la causa raíz sin recurrir a suposiciones?`}
              </p>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-2 pt-1">
            {questionData?.options?.map((opt, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs font-sans-editorial transition-colors flex items-start gap-3 ${
                  opt.isCorrect
                    ? 'bg-emerald-950/25 border-emerald-500/50 text-emerald-200'
                    : 'bg-zinc-950/70 border-zinc-900 text-zinc-300'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {opt.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 font-mono-tech">
                      {String.fromCharCode(65 + i)}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold text-white leading-snug">{opt.label}</p>
                  <p
                    className={`text-[11px] font-mono-tech leading-tight ${
                      opt.isCorrect ? 'text-emerald-300/90' : 'text-zinc-500'
                    }`}
                  >
                    {opt.explanation}
                  </p>
                </div>
              </div>
            )) || (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-xs text-emerald-200">
                <p className="font-bold text-white">Comprobación determinística:</p>
                <p className="text-[11px] text-emerald-300">
                  La telemetría objetiva y la medición de tiempos de respuesta prevalecen sobre cualquier conjetura.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Visual Methodological Framework: fills space symmetrically */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-cyan-950/70 font-mono-tech text-[10px]">
          <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950 space-y-1">
            <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              QUÉ OBSERVAR EN TELEMETRÍA:
            </span>
            <p className="text-zinc-400 font-sans-editorial text-[10.5px] leading-tight">
              Descriptores huérfanos, contadores de fallos de página duros y delta de latencias DPC antes de formular una hipótesis.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950 space-y-1">
            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              CRITERIO DE CERTEZA FORENSE:
            </span>
            <p className="text-zinc-400 font-sans-editorial text-[10.5px] leading-tight">
              Toda afirmación técnica debe poder replicarse en consola o mediante instrumental de análisis oficial de Windows Internals.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Technical Note */}
      <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950 font-mono-tech text-[10px] text-zinc-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          ESTÁNDAR DE EVALUACIÓN // RAZONAMIENTO ANTE EVIDENCIA
        </span>
        <span className="text-cyan-400 font-bold">MÓDULO #{module.moduleNumber} DE 26</span>
      </div>
    </div>
  );
};
