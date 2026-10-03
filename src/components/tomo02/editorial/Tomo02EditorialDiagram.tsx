import React from 'react';
import { Eye, Info, Sparkles, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';
import { Tomo02ModuleVisual, getVisualPedagogicalMeta } from '../Tomo02VisualEngine';

interface Tomo02EditorialDiagramProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
}

export const Tomo02EditorialDiagram: React.FC<Tomo02EditorialDiagramProps> = ({
  module,
  richData,
}) => {
  const meta = getVisualPedagogicalMeta(module.id, module, richData);

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 font-sans-editorial">
      {/* Header Bar */}
      <div className="border-b border-cyan-950/80 pb-1.5 flex items-baseline justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-0.5">
            <span>EXPEDIENTE VISUAL [{module.moduleNumber}]</span>
            <span className="text-zinc-600">/</span>
            <span className="text-cyan-300 font-bold">{meta.badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
            {meta.title}
          </h2>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-wider block">
            ANÁLISIS PERICIAL DE SUBSISTEMA
          </span>
          <span className="text-xs font-mono-tech text-cyan-400 font-bold">
            {module.categoryTag}
          </span>
        </div>
      </div>

      {/* Center Dominant Visual Stage */}
      <div className="h-[210px] sm:h-[230px] rounded-xl overflow-hidden border border-cyan-900/80 bg-[#040812] shadow-2xl relative shrink-0">
        <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
      </div>

      {/* 4-Point Technical Pedagogical Breakdown - 2x2 Clean Spacious Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech items-start">
        {/* 1. Qué estás viendo */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5 h-auto">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>QUÉ ESTÁS VIENDO</span>
          </div>
          <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
            {meta.whatYouAreSeeing}
          </p>
        </div>

        {/* 2. Puntos clave a observar */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5 h-auto">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>PUNTOS DE LECTURA</span>
          </div>
          <div className="space-y-1 text-xs text-zinc-200 font-sans-editorial leading-relaxed">
            {meta.focalPoints?.slice(0, 2).map((fp, i) => (
              <div key={i}>
                <strong className="text-cyan-300 font-mono-tech">{fp.label}:</strong> {fp.detail}
              </div>
            )) || (
              <p>{module.scientificFact || 'Estructura de bajo nivel del kernel.'}</p>
            )}
          </div>
        </div>

        {/* 3. Qué significa en el Kernel */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-1.5 h-auto">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>FÍSICA DEL SISTEMA</span>
          </div>
          <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
            {richData?.evoExplains
              ? richData.evoExplains.slice(0, 220) + '...'
              : module.summary}
          </p>
        </div>

        {/* 4. Por qué importa al perito */}
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1.5 h-auto">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>POR QUÉ IMPORTA</span>
          </div>
          <p className="text-xs text-zinc-100 font-sans-editorial leading-relaxed">
            {meta.whyItMatters}
          </p>
        </div>
      </div>

      {/* Bottom Technical Callout Bar */}
      <div className="p-3 rounded-xl bg-black/70 border border-cyan-950/90 text-xs font-mono-tech text-zinc-300 flex flex-wrap items-center justify-between gap-2 h-auto">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">REGLA FORENSE:</span>
          <span>{module.reversibility || module.scientificFact || 'Verificar siempre con telemetría antes de modificar el estado del sistema.'}</span>
        </div>
        <span className="text-zinc-500 font-bold">EVO LABS METROLOGY</span>
      </div>
    </div>
  );
};
