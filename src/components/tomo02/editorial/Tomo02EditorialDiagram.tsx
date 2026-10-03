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
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Header Bar */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
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
      <div className="flex-1 min-h-[290px] max-h-[440px] rounded-xl overflow-hidden border border-cyan-900/80 bg-[#040812] shadow-2xl relative">
        <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
      </div>

      {/* 4-Column Technical Pedagogical Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono-tech">
        {/* 1. Qué estás viendo */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/80 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" />
            <span>QUÉ ESTÁS VIENDO</span>
          </div>
          <p className="text-[10.5px] text-zinc-300 font-sans-editorial leading-snug">
            {meta.whatYouAreSeeing}
          </p>
        </div>

        {/* 2. Puntos clave a observar */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/80 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PUNTOS DE LECTURA</span>
          </div>
          <div className="space-y-1 text-[10px] text-zinc-300 font-sans-editorial leading-tight">
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
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/80 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>FÍSICA DEL SISTEMA</span>
          </div>
          <p className="text-[10.5px] text-zinc-300 font-sans-editorial leading-snug">
            {richData?.evoExplains
              ? richData.evoExplains.slice(0, 180) + '...'
              : module.summary}
          </p>
        </div>

        {/* 4. Por qué importa al perito */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>POR QUÉ IMPORTA</span>
          </div>
          <p className="text-[10.5px] text-zinc-200 font-sans-editorial leading-snug">
            {meta.whyItMatters}
          </p>
        </div>
      </div>

      {/* Bottom Technical Callout Bar */}
      <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950/80 text-[10px] font-mono-tech text-zinc-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">REGLA FORENSE:</span>
          <span>{module.reversibility || module.scientificFact || 'Verificar siempre con telemetría antes de modificar el estado del sistema.'}</span>
        </div>
        <span className="text-zinc-500 font-bold">EVO LABS METROLOGY</span>
      </div>
    </div>
  );
};
