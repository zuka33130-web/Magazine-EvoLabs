import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldAlert, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';
import { Tomo02ModuleVisual } from '../Tomo02VisualEngine';

interface Tomo02EditorialHeroProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
  onCopySnippet?: (text: string) => void;
  copiedSnippet?: string | null;
}

export const Tomo02EditorialHero: React.FC<Tomo02EditorialHeroProps> = ({
  module,
  richData,
  onCopySnippet,
  copiedSnippet,
}) => {
  const [localCopied, setLocalCopied] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    if (onCopySnippet) {
      onCopySnippet(text);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 2000);
    }
  };

  const command = module.powershellCommand || module.forensicCommand || module.practicalCommand || '';
  const isCopied = copiedSnippet === command || localCopied;

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Editorial Kicker Bar */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs font-black tracking-widest text-cyan-400 uppercase">
            MÓDULO [{module.moduleNumber}]
          </span>
          <span className="text-zinc-600 font-mono-tech">/</span>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-zinc-400">
            {module.categoryTag}
          </span>
          <span className="text-zinc-600 font-mono-tech">·</span>
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">
            LECTURA {module.readTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[9px] font-mono-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              module.safetyBadge === 'ROJO'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : module.safetyBadge === 'AMARILLO'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            NIVEL DE RIESGO: {module.safetyBadge || 'VERDE'}
          </span>
        </div>
      </div>

      {/* Hero Headline Section with Big Number Watermark */}
      <div className="relative pt-1">
        <div className="absolute right-0 -top-4 text-7xl sm:text-8xl font-black font-mono-tech text-cyan-500/10 select-none pointer-events-none tracking-tighter">
          {module.moduleNumber}
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight leading-[1.08]">
            {module.title}
          </h2>
          <p className="mt-1 font-mono-tech text-xs sm:text-sm text-cyan-400 uppercase tracking-wide">
            {module.subtitle}
          </p>
        </div>
      </div>

      {/* Main Editorial 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 items-stretch min-h-0">
        {/* Left Column (5 cols): The Narrative Hook, Analogy, & Forensic Objective */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
          {/* Hook Question Callout */}
          {richData?.hookQuestion && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/40 via-zinc-950/70 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/50">
              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                EL GANCHO REAL // SÍNTOMA & COMPORTAMIENTO
              </span>
              <p className="text-xs text-zinc-200 font-sans-editorial leading-snug italic">
                “{richData.hookQuestion}”
              </p>
            </div>
          )}

          {/* Simple Analogy & Evo Explains */}
          <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
            {richData?.simpleAnalogy && (
              <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-900 text-[11px]">
                <strong className="text-white block font-mono-tech text-[10px] text-cyan-300 uppercase mb-0.5">
                  ANALOGÍA OPERATIVA:
                </strong>
                <p className="text-zinc-300 font-sans-editorial leading-tight">
                  {richData.simpleAnalogy}
                </p>
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-950 text-[11px]">
              <strong className="text-cyan-400 block font-mono-tech text-[10px] uppercase mb-0.5">
                OBJETIVO PERICIAL:
              </strong>
              <p className="text-zinc-300 font-sans-editorial leading-tight">
                {module.forensicGoal || module.summary}
              </p>
            </div>
          </div>

          {/* PowerShell Audit Terminal */}
          {command && (
            <div className="p-2.5 rounded-xl bg-[#070B12] border border-cyan-900/80 font-mono-tech text-[10px]">
              <div className="flex items-center justify-between text-cyan-400 mb-1">
                <span className="flex items-center gap-1 font-bold text-[9px] tracking-wider">
                  <Terminal className="w-3 h-3" />
                  ORDEN DE AUDITORÍA PERICIAL
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(command)}
                  className="px-1.5 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 text-[9px] cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-emerald-400">COPIADO</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>COPIAR</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-1.5 rounded bg-black/90 text-cyan-300 overflow-x-auto border border-cyan-950 text-[10px] leading-tight select-all">
                <code>{command}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Right Column (7 cols): The Visual Graphic Centerpiece */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
          <div className="flex-1 min-h-[260px] max-h-[420px] rounded-xl overflow-hidden border border-cyan-900/70 bg-black/80 shadow-2xl relative">
            <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
          </div>

          {/* Key Takeaways Bottom Strip */}
          <div className="p-2 rounded-lg bg-zinc-950/90 border border-cyan-950 font-mono-tech text-[10px] space-y-1">
            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block">
              3 DIRECTIVAS CLAVE DEL SISTEMA:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-400">
              {module.keyTakeaways.slice(0, 3).map((kt, i) => (
                <div key={i} className="flex items-start gap-1">
                  <span className="text-cyan-400 font-bold">0{i + 1}.</span>
                  <span className="line-clamp-2 text-[10px]">{kt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Metrology Footer */}
      <div className="pt-2 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
        <span className="text-zinc-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-none inline-block shadow-[0_0_6px_#00D2FF]" />
          ESTÁNDAR EDITORIAL EVO LABS // LEMA: “SI NO PODÉS REVERTIRLO, NO LO TOQUES.”
        </span>
        <span className="text-cyan-400 font-bold">
          EXPEDIENTE TÉCNICO #{module.moduleNumber} DE 26
        </span>
      </div>
    </div>
  );
};
