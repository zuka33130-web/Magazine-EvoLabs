import React, { useState } from 'react';
import { Terminal, Copy, Check, RotateCcw, CheckCircle2, Activity } from 'lucide-react';
import { TomoModuleItem } from '../../../data/tomo02Data';
import { ChapterRichContent } from '../Tomo02ModuleReader';

interface Tomo02EditorialPracticeProps {
  module: TomoModuleItem;
  richData?: ChapterRichContent;
  onCopySnippet?: (text: string) => void;
  copiedSnippet?: string | null;
}

export const Tomo02EditorialPractice: React.FC<Tomo02EditorialPracticeProps> = ({
  module,
  richData,
  onCopySnippet,
  copiedSnippet,
}) => {
  const [localCopied, setLocalCopied] = useState<boolean>(false);

  const command = module.powershellCommand || module.forensicCommand || module.practicalCommand || '';
  const isCopied = copiedSnippet === command || localCopied;

  const handleCopy = (text: string) => {
    if (onCopySnippet) {
      onCopySnippet(text);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 2000);
    }
  };

  const practice = richData?.practiceDetails;

  return (
    <div className="flex flex-col space-y-3 font-sans-editorial">
      {/* Top Header */}
      <div className="border-b border-cyan-950/80 pb-2 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-0.5">
            <span>DOSSIER DE LABORATORIO [{module.moduleNumber}]</span>
            <span className="text-zinc-600">/</span>
            <span className="text-emerald-400 font-bold">PROTOCOLO PRÁCTICO EVO</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
            {module.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono-tech text-zinc-400 uppercase hidden sm:inline">
            TIPO DE DATO:
          </span>
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono-tech text-[10px] font-bold">
            {practice?.dataType || 'MEASURED'}
          </span>
        </div>
      </div>

      {/* Main Grid: Protocol & Steps (Left) + Terminal & Validation (Right) - Natural Heights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs items-start">
        {/* Left Column: Execution Protocol & Steps */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950/80 flex flex-col space-y-2.5 h-auto">
          <div>
            <div className="flex items-center justify-between text-cyan-400 text-[10px] font-mono-tech font-bold uppercase tracking-wider mb-1.5 pb-1 border-b border-cyan-950/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                OBJETIVO Y EJECUCIÓN METÓDICA
              </span>
              <span className="text-[9px] text-zinc-500 font-mono-tech">MÉTODO AUDITADO</span>
            </div>

            <p className="text-zinc-200 leading-snug font-sans-editorial text-[11.5px] my-1.5">
              {practice?.objective || module.forensicGoal || module.summary}
            </p>

            {/* Step list */}
            <div className="space-y-1 font-mono-tech text-[10.5px] text-zinc-300 mt-2">
              {practice?.steps?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-tight">{step}</span>
                </div>
              )) || (
                <>
                  <div className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">1.</span>
                    <span>Abrí PowerShell con privilegios elevados (Administrador).</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">2.</span>
                    <span>Ejecutá el comando de auditoría y contrastá los valores devueltos.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-900 text-[10.5px] h-auto">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold block mb-0.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              QUÉ OBSERVAR // SEÑALES CRÍTICAS:
            </span>
            <p className="text-zinc-300 font-sans-editorial leading-tight">
              {practice?.whatToObserve || 'Verificar la ausencia de errores en la consola y que los identificadores de recursos sean consistentes.'}
            </p>
          </div>
        </div>

        {/* Right Column: Console Command, Interpretation & Rollback */}
        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-cyan-950/80 flex flex-col space-y-2.5 h-auto">
          <div>
            {/* PowerShell Command Terminal */}
            <div className="p-2.5 rounded-lg bg-[#080B12] border border-cyan-900/90 font-mono-tech text-xs space-y-1 h-auto">
              <div className="flex items-center justify-between text-cyan-400 text-[10px] pb-1 border-b border-cyan-950">
                <span className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  ORDEN DE AUDITORÍA POWERSHELL
                </span>
                {command && (
                  <button
                    type="button"
                    onClick={() => handleCopy(command)}
                    className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 text-[9px] cursor-pointer"
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
                )}
              </div>
              <pre className="p-2 rounded bg-black/90 text-cyan-300 overflow-x-auto border border-cyan-950 text-[11px] leading-tight select-all">
                <code>{command || 'Get-Process | Select-Object -First 10'}</code>
              </pre>
            </div>

            {/* Interpretation */}
            <div className="mt-2 text-[11px] font-sans-editorial text-zinc-300 leading-snug">
              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block mb-0.5">
                INTERPRETACIÓN PERICIAL:
              </span>
              <p>{practice?.interpretation || module.summary}</p>
            </div>
          </div>

          {/* Rollback & Safety Protocol */}
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-950/20 via-zinc-950 to-black border-l-2 border-emerald-400 border-t border-r border-b border-emerald-950/50 space-y-0.5 text-xs h-auto">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              REVERSIBILIDAD & CONDICIÓN DE SEGURIDAD:
            </span>
            <p className="text-zinc-300 font-sans-editorial text-[10.5px] leading-tight">
              {module.reversibility || 'Comando de auditoría pasivo. No altera el estado de las claves ni suspende servicios.'}
            </p>
          </div>
        </div>
      </div>

      {/* Standardized Bottom Bar - Content Driven */}
      <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-cyan-950 text-xs font-mono-tech flex items-center justify-between text-zinc-300 h-auto">
        <div>
          <strong className="text-cyan-400 font-bold mr-1">REGLA DE LABORATORIO:</strong>
          <span className="text-zinc-300">{module.reversibility ? `Protocolo verificable en consola.` : 'Toda modificación debe contar con comando de reversión inmediata.'}</span>
        </div>
        <span className="text-emerald-400 text-[10px] uppercase hidden sm:inline shrink-0 font-bold">
          AUDITORÍA VERIFICADA
        </span>
      </div>
    </div>
  );
};
