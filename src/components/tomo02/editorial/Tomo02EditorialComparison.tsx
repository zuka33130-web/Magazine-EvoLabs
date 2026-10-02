import React from 'react';
import { AlertTriangle, CheckCircle2, Waves, ArrowRight, GitFork } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';
import { Tomo02ModuleVisual } from '../Tomo02VisualEngine';

interface Tomo02EditorialComparisonProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
}

export const Tomo02EditorialComparison: React.FC<Tomo02EditorialComparisonProps> = ({
  module,
  richData,
}) => {
  const myth = richData?.mythVsReality?.myth || module.falsePositive || 'Consejo popular desinformado de internet.';
  const reality = richData?.mythVsReality?.reality || module.scientificFact || module.summary;

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Section Header */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
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

      {/* Main Contrast Grid: Internet Myth vs Kernel Reality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Left Card: El Mito de Internet */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/20 via-zinc-950 to-black border-l-2 border-amber-500 border-t border-r border-b border-amber-900/40 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between text-amber-400 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-amber-950/60">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                LO QUE DICE INTERNET // EL MITO POPULAR
              </span>
              <span className="text-[9px] text-amber-500/80">CREENCIA COMÚN</span>
            </div>
            <blockquote className="text-xs sm:text-[13px] text-zinc-200 font-sans-editorial italic leading-relaxed my-2">
              “{myth}”
            </blockquote>
          </div>
          <div className="p-2 rounded bg-black/60 border border-amber-950/60 text-[10px] font-mono-tech text-amber-300/90">
            <strong>Riesgo o Daño Colateral:</strong> {module.warningNotice || 'Rompe dependencias del sistema operativo o genera inestabilidad latente.'}
          </div>
        </div>

        {/* Right Card: La Realidad Científica del Kernel */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/30 via-zinc-950 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-900/40 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between text-cyan-400 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-cyan-950/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                LO QUE MIDE EL PERITO // EVIDENCIA DEL KERNEL
              </span>
              <span className="text-[9px] text-cyan-500/80">TELEMETRÍA REAL</span>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-200 font-sans-editorial leading-relaxed my-2">
              {reality}
            </p>
          </div>
          <div className="p-2 rounded bg-black/60 border border-cyan-950/60 text-[10px] font-mono-tech text-cyan-300">
            <strong>Herramienta Pericial:</strong> {module.sysinternalsTool || 'Sysinternals Suite & Resource Monitor'}
          </div>
        </div>
      </div>

      {/* Decision Tree / Deductive Flow Stage */}
      {module.decisionTree ? (
        <div className="p-3 rounded-xl bg-black/80 border border-cyan-900/60 font-mono-tech text-xs space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-wider">
            <GitFork className="w-3.5 h-3.5" />
            <span>ÁRBOL DEDUCTIVO // CRITERIO TÉCNICO DE DECISIÓN</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded bg-zinc-950 border border-cyan-950">
              <span className="text-zinc-400 text-[10px] block">1. PREGUNTA PERICIAL:</span>
              <span className="text-white font-semibold">{module.decisionTree.question}</span>
            </div>
            <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/40">
              <span className="text-emerald-400 text-[10px] block font-bold">✔ SI SE CUMPLE:</span>
              <span className="text-emerald-200">{module.decisionTree.yesAction}</span>
            </div>
            <div className="p-2 rounded bg-amber-950/20 border border-amber-500/40">
              <span className="text-amber-400 text-[10px] block font-bold">✖ SI NO SE CUMPLE:</span>
              <span className="text-amber-200">{module.decisionTree.noAction}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-[160px] max-h-[240px] rounded-xl overflow-hidden border border-cyan-900/60 bg-black/90 shadow-xl relative">
          <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
        </div>
      )}

      {/* Bottom Metrological Rule */}
      <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-cyan-950 text-xs font-mono-tech flex items-center justify-between text-zinc-300">
        <div>
          <strong className="text-cyan-400 font-bold mr-1">REGLA DE VERACIDAD EVO:</strong>
          <span>{module.reversibility || 'Ningún optimizador puede sustituir al conocimiento determinístico del sistema.'}</span>
        </div>
        <span className="text-zinc-600 text-[10px] uppercase hidden sm:inline shrink-0">
          EVO LABS SCIENCE
        </span>
      </div>
    </div>
  );
};
