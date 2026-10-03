import React from 'react';
import { Search, CheckCircle2, AlertOctagon, Wrench, Shield, AlertTriangle } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';

interface Tomo02EditorialCaseProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
}

export const Tomo02EditorialCase: React.FC<Tomo02EditorialCaseProps> = ({
  module,
  richData,
}) => {
  const evoCase = richData?.evoCase;

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Bar */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-0.5">
            <span className="text-rose-400 font-bold">EXPEDIENTE DE TALLER</span>
            <span className="text-zinc-600">/</span>
            <span>CASO REAL #{module.moduleNumber}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
            {evoCase?.title || `Expediente Forense — ${module.title}`}
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 font-mono-tech text-[10px] font-bold hidden sm:inline">
          CASO RESUELTO // SIN FORMATEAR
        </span>
      </div>

      {/* Case Dossier Grid: 5-Stage Scientific Investigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs flex-1 items-stretch min-h-0">
        {/* Left Column: Victim, Symptom, & False Hypothesis */}
        <div className="space-y-2.5 flex flex-col justify-between">
          {/* Victim Profile */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/80 space-y-1">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              PERFIL DEL EQUIPO // ESCENARIO DE CAMPO:
            </span>
            <p className="text-zinc-300 text-[11px] leading-snug font-sans-editorial">
              {evoCase?.victim || 'Estación de trabajo de alto rendimiento / Servidor de control con Windows 10/11 Enterprise.'}
            </p>
          </div>

          {/* Symptom */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-950/20 via-zinc-950/90 to-black border-l-2 border-rose-500 border-t border-r border-b border-rose-950/50 space-y-1 flex-1">
            <span className="text-[10px] font-mono-tech text-rose-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              SÍNTOMA VISIBLE REPORTADO:
            </span>
            <blockquote className="text-zinc-200 text-[11px] leading-relaxed italic my-1 font-sans-editorial">
              “{evoCase?.symptom || module.summary}”
            </blockquote>
          </div>

          {/* False Hypothesis from Internet */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/20 via-zinc-950/90 to-black border-l-2 border-amber-500 border-t border-r border-b border-amber-950/50 space-y-1">
            <span className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              HIPÓTESIS FALSA (FOROS O TÉCNICOS SIN MÉTODO):
            </span>
            <p className="text-amber-200/90 text-[11px] leading-snug font-sans-editorial">
              {evoCase?.initialHypothesis || module.falsePositive || 'Reinstalar Windows desde cero, formatear la unidad o desactivar servicios a ciegas.'}
            </p>
          </div>
        </div>

        {/* Right Column: Root Cause & Definitive Resolution */}
        <div className="space-y-2.5 flex flex-col justify-between">
          {/* Real Root Cause */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/20 via-zinc-950/90 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/50 space-y-1">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              CAUSA RAÍZ AISLADA POR TELEMETRÍA KERNEL:
            </span>
            <p className="text-zinc-200 text-[11px] leading-relaxed font-sans-editorial">
              {evoCase?.rootCause || module.scientificFact || 'Incompatibilidad en el despachador de interrupciones o controlador con latencia DPC elevada.'}
            </p>
          </div>

          {/* Resolution */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/20 via-zinc-950/90 to-black border-l-2 border-emerald-400 border-t border-r border-b border-emerald-950/50 space-y-1 flex-1">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              RESOLUCIÓN PERICIAL DEFINITIVA:
            </span>
            <p className="text-zinc-300 text-[11px] font-sans-editorial leading-relaxed">
              {evoCase?.resolution || module.reversibility || 'Aplicación del protocolo nativo con restablecimiento de dependencias y validación con LatencyMon.'}
            </p>
          </div>

          {/* Sysinternals Tool Badge */}
          <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-zinc-900 font-mono-tech text-[10px] text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              INSTRUMENTAL DE ANÁLISIS:
            </span>
            <span className="text-cyan-300 font-bold">{module.sysinternalsTool || 'Process Explorer & LatencyMon'}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
        <span>BANCO DE PRUEBAS DE TALLER // MÉTODO FORENSE DETERMINÍSTICO</span>
        <span className="text-cyan-400 font-bold">CASO #{module.moduleNumber} RESUELTO</span>
      </div>
    </div>
  );
};
