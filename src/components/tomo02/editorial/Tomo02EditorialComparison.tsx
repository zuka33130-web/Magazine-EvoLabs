import React from 'react';
import { AlertTriangle, CheckCircle2, GitFork } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';
import { Tomo02ModuleVisual } from '../Tomo02VisualEngine';

interface Tomo02EditorialComparisonProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
  isSectionOpener?: boolean;
}

export const Tomo02EditorialComparison: React.FC<Tomo02EditorialComparisonProps> = ({
  module,
  richData,
  isSectionOpener = false,
}) => {
  const myth = richData?.mythVsReality?.myth || module.falsePositive || 'Consejo popular desinformado de internet.';
  const reality = richData?.mythVsReality?.reality || module.scientificFact || module.summary;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 font-sans-editorial">
      {/* Top Section Header */}
      <div className="border-b border-cyan-950/80 pb-1.5 flex items-baseline justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-0.5">
            <span className="text-amber-400 font-bold">EXPEDIENTE MITO VS REALIDAD</span>
            <span className="text-zinc-600">/</span>
            <span>MÓDULO [{module.moduleNumber}]</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
            {module.title}
          </h2>
        </div>
        <span className="text-xs font-mono-tech text-cyan-400 font-bold hidden sm:inline">
          CONTRASTE FORENSE EVO
        </span>
      </div>

      {/* Main Contrast Grid: Internet Myth vs Kernel Reality - Natural Heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs items-start">
        {/* Left Card: El Mito de Internet */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/20 via-zinc-950/90 to-black border-l-2 border-amber-500 border-t border-r border-b border-amber-900/40 flex flex-col space-y-2.5 h-auto">
          <div>
            <div className="flex items-center justify-between text-amber-400 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-amber-950/60">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                LO QUE DICE INTERNET // EL MITO POPULAR
              </span>
              <span className="text-[9px] text-amber-500/80 font-mono-tech">CREENCIA COMÚN</span>
            </div>
            <blockquote className="text-xs sm:text-[12px] text-zinc-200 font-sans-editorial italic leading-relaxed my-1.5">
              “{myth}”
            </blockquote>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-amber-950/60 text-[10.5px] font-mono-tech text-amber-300/90 h-auto">
            <strong className="block mb-0.5 text-amber-400">Riesgo o Daño Colateral:</strong>
            <span className="text-zinc-300 font-sans-editorial leading-snug block">
              {module.warningNotice || 'Rompe dependencias del sistema operativo o genera inestabilidad latente.'}
            </span>
          </div>
        </div>

        {/* Right Card: La Realidad Científica del Kernel */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/30 via-zinc-950/90 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-900/40 flex flex-col space-y-2.5 h-auto">
          <div>
            <div className="flex items-center justify-between text-cyan-400 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-cyan-950/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                LO QUE MIDE EL PERITO // EVIDENCIA DEL KERNEL
              </span>
              <span className="text-[9px] text-cyan-500/80 font-mono-tech">TELEMETRÍA REAL</span>
            </div>
            <p className="text-xs sm:text-[12px] text-zinc-200 font-sans-editorial leading-relaxed my-1.5">
              {reality}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950/60 text-[10.5px] font-mono-tech text-cyan-300 h-auto">
            <strong className="block mb-0.5 text-cyan-400">Herramienta Pericial:</strong>
            <span className="text-zinc-300 font-sans-editorial leading-snug block">
              {module.sysinternalsTool || 'Sysinternals Suite & Resource Monitor'}
            </span>
          </div>
        </div>
      </div>

      {/* Decision Tree if present (h-auto) */}
      {module.decisionTree && (
        <div className="p-3 rounded-xl bg-black/80 border border-cyan-900/60 font-mono-tech text-xs space-y-2 h-auto">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-wider">
            <GitFork className="w-3.5 h-3.5" />
            <span>ÁRBOL DEDUCTIVO // CRITERIO TÉCNICO DE DECISIÓN</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] items-start">
            <div className="p-2 rounded-lg bg-zinc-950 border border-cyan-950 space-y-0.5 h-auto">
              <span className="text-zinc-400 text-[10px] block font-bold">1. PREGUNTA PERICIAL:</span>
              <span className="text-white font-semibold leading-tight block">{module.decisionTree.question}</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/40 space-y-0.5 h-auto">
              <span className="text-emerald-400 text-[10px] block font-bold">✔ SI SE CUMPLE:</span>
              <span className="text-emerald-200 leading-tight block">{module.decisionTree.yesAction}</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/40 space-y-0.5 h-auto">
              <span className="text-amber-400 text-[10px] block font-bold">✖ SI NO SE CUMPLE:</span>
              <span className="text-amber-200 leading-tight block">{module.decisionTree.noAction}</span>
            </div>
          </div>
        </div>
      )}

      {/* Subsystem Visual Stage - Absorbs Remaining Space when NOT in Section Opener */}
      {!isSectionOpener && (
        <div className="flex-1 min-h-[160px] max-h-[230px] rounded-xl overflow-hidden border border-cyan-900/60 bg-[#040812] shadow-xl relative shrink-0">
          <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
        </div>
      )}

      {/* Bottom Metrological Rule - Content Driven */}
      <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-cyan-950 text-xs font-mono-tech flex items-center justify-between text-zinc-300 h-auto shrink-0">
        <div>
          <strong className="text-cyan-400 font-bold mr-1">REGLA DE VERACIDAD EVO:</strong>
          <span className="text-zinc-300">{module.reversibility || 'Ningún optimizador puede sustituir al conocimiento determinístico del sistema.'}</span>
        </div>
        <span className="text-zinc-600 text-[10px] uppercase hidden sm:inline shrink-0 font-bold">
          EVO LABS SCIENCE
        </span>
      </div>
    </div>
  );
};
