import React from 'react';
import { Search, CheckCircle2, AlertOctagon, Wrench, Shield, AlertTriangle } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';
import { Tomo02ModuleVisual } from '../Tomo02VisualEngine';

interface Tomo02EditorialCaseProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
  isSectionOpener?: boolean;
}

export const Tomo02EditorialCase: React.FC<Tomo02EditorialCaseProps> = ({
  module,
  richData,
  isSectionOpener = false,
}) => {
  const evoCase = richData?.evoCase;
  const symptomText = evoCase?.symptom || module.summary;
  const falseHypothesisText =
    evoCase?.initialHypothesis ||
    module.falsePositive ||
    'Reinstalar Windows desde cero, formatear la unidad o desactivar servicios a ciegas.';
  const rootCauseText =
    evoCase?.rootCause ||
    module.scientificFact ||
    'Incompatibilidad en el despachador de interrupciones o controlador con latencia DPC elevada.';
  const resolutionText =
    evoCase?.resolution ||
    module.reversibility ||
    'Aplicación del protocolo nativo con restablecimiento de dependencias y validación con LatencyMon.';
  const toolText = module.sysinternalsTool || 'Process Explorer & LatencyMon';

  return (
    <div className={`${isSectionOpener ? 'flex-1 min-h-0' : 'h-full'} flex flex-col gap-2.5 font-sans-editorial justify-between`}>
      {/* Top Header Bar */}
      <div className="border-b border-cyan-950/80 pb-2 flex items-baseline justify-between">
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

      {/* Case Dossier Grid: 2 Primary Columns - Natural Height, No Artificial Stretch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs items-start">
        {/* Left Card: Incident & False Hypothesis */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/20 via-zinc-950/90 to-black border-l-2 border-rose-500 border-t border-r border-b border-rose-950/50 flex flex-col space-y-3 h-auto">
          <div>
            <div className="flex items-center justify-between text-rose-400 text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 pb-1.5 border-b border-rose-950/60">
              <span className="flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                SÍNTOMA VISIBLE REPORTADO
              </span>
              <span className="text-[10px] text-zinc-400 font-mono-tech flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400 inline" />
                ESTACIÓN DE CAMPO
              </span>
            </div>
            <blockquote className="text-xs sm:text-sm text-zinc-100 font-sans-editorial italic leading-relaxed my-2">
              “{symptomText}”
            </blockquote>
          </div>
          <div className="p-3 rounded-xl bg-black/70 border border-rose-950/70 text-xs font-mono-tech text-amber-300/90 h-auto">
            <strong className="flex items-center gap-1.5 text-amber-400 mb-1 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 inline" />
              Hipótesis Falsa (Mala Práctica):
            </strong>
            <span className="text-zinc-200 font-sans-editorial leading-relaxed block">{falseHypothesisText}</span>
          </div>
        </div>

        {/* Right Card: Root Cause & Resolution */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 via-zinc-950/90 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/50 flex flex-col space-y-3 h-auto">
          <div>
            <div className="flex items-center justify-between text-cyan-400 text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 pb-1.5 border-b border-cyan-950/60">
              <span className="flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                CAUSA RAÍZ AISLADA EN KERNEL
              </span>
              <span className="text-[10px] text-cyan-300 font-mono-tech flex items-center gap-1 font-bold">
                <Wrench className="w-3.5 h-3.5 inline" />
                {toolText}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-100 font-sans-editorial leading-relaxed my-2">
              {rootCauseText}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-black/70 border border-cyan-950/70 text-xs font-mono-tech text-emerald-300 h-auto">
            <strong className="flex items-center gap-1.5 text-emerald-400 mb-1 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 inline" />
              Resolución Pericial Definitiva:
            </strong>
            <span className="text-zinc-200 font-sans-editorial leading-relaxed block">{resolutionText}</span>
          </div>
        </div>
      </div>

      {/* Forensic Diagnostic Triad Bar - Content Driven */}
      <div className="p-3.5 rounded-xl bg-black/80 border border-cyan-900/60 font-mono-tech text-xs space-y-2.5 h-auto">
        <div className="flex items-center justify-between text-cyan-400 text-xs uppercase font-bold tracking-wider">
          <span className="flex items-center gap-1.5">
            <Wrench className="w-4 h-4" />
            MÉTODO DETERMINÍSTICO // AISLAMIENTO Y VERIFICACIÓN
          </span>
          <span className="text-zinc-500 hidden sm:inline text-[10px]">ESTÁNDAR DE LABORATORIO EVO</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs items-start">
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-cyan-950 space-y-1 h-auto">
            <span className="text-zinc-300 text-xs block font-bold">1. TELEMETRÍA:</span>
            <span className="text-zinc-300 font-sans-editorial leading-snug block">Captura de hilos, llamadas a sistema y descriptores en tiempo real.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 space-y-1 h-auto">
            <span className="text-cyan-300 text-xs block font-bold">2. DIAGNÓSTICO:</span>
            <span className="text-zinc-200 font-sans-editorial leading-snug block">Correlación causa-efecto sin asumir diagnósticos apresurados.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1 h-auto">
            <span className="text-emerald-300 text-xs block font-bold">3. COMPROBACIÓN:</span>
            <span className="text-emerald-100 font-sans-editorial leading-snug block">Verificación de estabilidad y reversibilidad del procedimiento.</span>
          </div>
        </div>
      </div>

      {/* Subsystem Visual Stage - Absorbs Remaining Space */}
      <div className={`flex-1 ${isSectionOpener ? 'min-h-[100px] max-h-[150px]' : 'min-h-[160px] max-h-[250px]'} rounded-xl overflow-hidden border border-cyan-900/60 bg-[#040812] shadow-xl relative`}>
        <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
      </div>

      {/* Standardized Bottom Bar - Content Driven */}
      <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950 text-xs font-mono-tech flex items-center justify-between text-zinc-300 h-auto">
        <div>
          <strong className="text-cyan-400 font-bold mr-1.5">REGLA FORENSE DE TALLER:</strong>
          <span className="text-zinc-200 font-sans-editorial">“El síntoma visible nunca es la causa raíz: medí antes de formatear.”</span>
        </div>
        <span className="text-rose-400 text-xs uppercase hidden sm:inline shrink-0 font-bold">
          CASO #{module.moduleNumber} RESUELTO
        </span>
      </div>
    </div>
  );
};
