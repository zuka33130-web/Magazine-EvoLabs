import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldAlert, Cpu, Sparkles, BookOpen, Activity, ShieldCheck } from 'lucide-react';
import { TOMO_02_MODULES, TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';
import { Tomo02ModuleVisual } from '../Tomo02VisualEngine';

interface Tomo02EditorialHeroProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
  onCopySnippet?: (text: string) => void;
  copiedSnippet?: string | null;
  isSectionOpener?: boolean;
}

export const Tomo02EditorialHero: React.FC<Tomo02EditorialHeroProps> = ({
  module,
  richData,
  onCopySnippet,
  copiedSnippet,
  isSectionOpener = false,
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
    <div className={`flex-1 min-h-0 flex flex-col justify-between ${isSectionOpener ? 'gap-2' : 'gap-2.5'} font-sans-editorial`}>
      {/* Top Editorial Kicker Bar */}
      <div className="border-b border-cyan-950/80 pb-1.5 flex items-baseline justify-between shrink-0">
        <div className="flex items-center gap-2.5">
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

      {/* Hero Headline Section */}
      <div className="relative pt-0.5 shrink-0">
        <div className="relative z-10 max-w-2xl">
          <h2 className={`${isSectionOpener ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl'} font-display font-black text-white uppercase tracking-tight leading-tight`}>
            {module.title}
          </h2>
          <p className="mt-0.5 font-mono-tech text-xs sm:text-sm text-cyan-400 uppercase tracking-wide font-semibold">
            {module.subtitle}
          </p>
        </div>
      </div>

      {/* Main Editorial 2-Column Split */}
      {isSectionOpener ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
          {/* Left Column (6 cols): Hook, Analogy, Objective */}
          <div className="md:col-span-6 flex flex-col space-y-2.5 h-auto">
            {richData?.hookQuestion && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-950/40 via-zinc-950/70 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/50 h-auto">
                <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  EL GANCHO REAL // SÍNTOMA & COMPORTAMIENTO
                </span>
                <p className="text-xs sm:text-[12.5px] text-zinc-100 font-sans-editorial leading-relaxed italic">
                  “{richData.hookQuestion}”
                </p>
              </div>
            )}

            {richData?.simpleAnalogy && (
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 h-auto">
                <strong className="text-cyan-300 block font-mono-tech text-xs uppercase mb-1 font-bold">
                  ANALOGÍA OPERATIVA:
                </strong>
                <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                  {richData.simpleAnalogy}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-black/60 border border-cyan-950/80 h-auto">
              <strong className="text-cyan-400 block font-mono-tech text-xs uppercase mb-1 font-bold">
                OBJETIVO METODOLÓGICO:
              </strong>
              <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                {module.forensicGoal || module.summary}
              </p>
            </div>
          </div>

          {/* Right Column (6 cols): PowerShell Terminal + 3 Directivas Clave */}
          <div className="md:col-span-6 flex flex-col space-y-2.5 h-auto">
            {command && (
              <div className="p-3 rounded-xl bg-[#070B12] border border-cyan-900/80 font-mono-tech text-xs h-auto">
                <div className="flex items-center justify-between text-cyan-400 mb-1.5">
                  <span className="flex items-center gap-1.5 font-bold text-xs tracking-wider">
                    <Terminal className="w-3.5 h-3.5" />
                    ORDEN DE AUDITORÍA PERICIAL
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(command)}
                    className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 text-[10px] cursor-pointer font-bold border border-cyan-500/40"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">COPIADO</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPIAR</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2 rounded bg-black/90 text-cyan-300 overflow-x-auto border border-cyan-950 text-xs leading-tight select-all">
                  <code>{command}</code>
                </pre>
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950/80 font-mono-tech text-xs space-y-2 h-auto">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                3 DIRECTIVAS CLAVE DEL SISTEMA:
              </span>
              <div className="space-y-1.5 text-zinc-300">
                {module.keyTakeaways.slice(0, 3).map((kt, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold text-xs shrink-0">0{i + 1}.</span>
                    <span className="text-xs font-sans-editorial leading-relaxed">{kt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
          {/* Left Column (5 cols): The Narrative Hook, Analogy, & Forensic Objective */}
          <div className="md:col-span-5 flex flex-col space-y-2.5 h-auto">
            {/* Hook Question Callout */}
            {richData?.hookQuestion && (
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-zinc-950/70 to-black border-l-2 border-cyan-400 border-t border-r border-b border-cyan-950/50 h-auto">
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  EL GANCHO REAL // SÍNTOMA & COMPORTAMIENTO
                </span>
                <p className="text-xs sm:text-[13px] text-zinc-100 font-sans-editorial leading-relaxed italic">
                  “{richData.hookQuestion}”
                </p>
              </div>
            )}

            {/* Simple Analogy & Evo Explains */}
            <div className="space-y-2 text-xs leading-relaxed text-zinc-300 flex flex-col h-auto">
              {richData?.simpleAnalogy && (
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 h-auto">
                  <strong className="text-cyan-300 block font-mono-tech text-xs uppercase mb-1 font-bold">
                    ANALOGÍA OPERATIVA:
                  </strong>
                  <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                    {richData.simpleAnalogy}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-black/60 border border-cyan-950/80 h-auto">
                <strong className="text-cyan-400 block font-mono-tech text-xs uppercase mb-1 font-bold">
                  OBJETIVO METODOLÓGICO:
                </strong>
                <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                  {module.forensicGoal || module.summary}
                </p>
              </div>
            </div>

            {/* PowerShell Audit Terminal */}
            {command && (
              <div className="p-3 rounded-xl bg-[#070B12] border border-cyan-900/80 font-mono-tech text-xs h-auto">
                <div className="flex items-center justify-between text-cyan-400 mb-1.5">
                  <span className="flex items-center gap-1.5 font-bold text-xs tracking-wider">
                    <Terminal className="w-3.5 h-3.5" />
                    ORDEN DE AUDITORÍA PERICIAL
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(command)}
                    className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 text-[10px] cursor-pointer font-bold border border-cyan-500/40"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">COPIADO</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPIAR</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2 rounded bg-black/90 text-cyan-300 overflow-x-auto border border-cyan-950 text-xs leading-tight select-all">
                  <code>{command}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): The Visual Graphic Centerpiece */}
          <div className="md:col-span-7 flex flex-col space-y-2 h-auto">
            <div className="h-[220px] sm:h-[240px] rounded-xl overflow-hidden border border-cyan-900/70 bg-[#040812] shadow-2xl relative">
              <Tomo02ModuleVisual module={module} richData={richData} compact={true} />
            </div>

            {/* Key Takeaways Bottom Strip */}
            <div className="p-3 rounded-xl bg-zinc-950/90 border border-cyan-950/80 font-mono-tech text-xs space-y-1.5 h-auto">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                3 DIRECTIVAS CLAVE DEL SISTEMA:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-zinc-300 items-start">
                {module.keyTakeaways.slice(0, 3).map((kt, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold text-xs">0{i + 1}.</span>
                    <span className="text-xs font-sans-editorial leading-relaxed">{kt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
