import React, { useState } from 'react';
import { Terminal, Copy, Check, RotateCcw, ShieldAlert, CheckCircle2, Activity } from 'lucide-react';
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
    <div className="h-full flex flex-col justify-between space-y-3 font-sans-editorial">
      {/* Top Header */}
      <div className="border-b border-cyan-950/80 pb-2.5 flex items-baseline justify-between">
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

      {/* Main Grid: Protocol & Steps (Left) + Terminal & Reversibility (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 items-stretch min-h-0">
        {/* Left Column (6 cols): Practice Steps & Objectives */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-2.5">
          {/* Objective Box */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/80 space-y-1 text-xs">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              OBJETIVO METODOLÓGICO:
            </span>
            <p className="text-zinc-200 leading-snug font-sans-editorial text-[11px]">
              {practice?.objective || module.forensicGoal || module.summary}
            </p>
          </div>

          {/* Steps List */}
          <div className="p-3 rounded-xl bg-black/60 border border-cyan-950/80 space-y-2 text-xs flex-1">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block border-b border-zinc-900 pb-1">
              PASOS DE EJECUCIÓN METÓDICA:
            </span>
            <div className="space-y-1.5 font-mono-tech text-[11px] text-zinc-300">
              {practice?.steps?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-tight">{step}</span>
                </div>
              )) || (
                <>
                  <div className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">1.</span>
                    <span>Abrí PowerShell como Administrador.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">2.</span>
                    <span>Ejecutá el comando de auditoría y verificá los valores devueltos.</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* What to observe */}
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 text-xs">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold block mb-0.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              QUÉ OBSERVAR // SEÑALES CRÍTICAS:
            </span>
            <p className="text-zinc-300 text-[10.5px] leading-tight font-sans-editorial">
              {practice?.whatToObserve || 'Verificar la ausencia de errores en la consola y que los identificadores de recursos sean consistentes.'}
            </p>
          </div>
        </div>

        {/* Right Column (6 cols): Live Terminal, Interpretation & Rollback */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-2.5">
          {/* PowerShell Command Terminal */}
          <div className="p-3 rounded-xl bg-[#080B12] border border-cyan-900/90 font-mono-tech text-xs space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400 text-[10px] pb-1 border-b border-cyan-950">
              <span className="flex items-center gap-1.5 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                ORDEN DE CONSOLA POWERSHELL
              </span>
              {command && (
                <button
                  type="button"
                  onClick={() => handleCopy(command)}
                  className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
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
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950/80 text-xs space-y-1 flex-1">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider font-bold block">
              INTERPRETACIÓN DEL RESULTADO:
            </span>
            <p className="text-zinc-300 text-[11px] font-sans-editorial leading-relaxed">
              {practice?.interpretation || module.summary}
            </p>
          </div>

          {/* Rollback & Guaranteed Safety Protocol */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/20 via-zinc-950 to-black border-l-2 border-emerald-400 border-t border-r border-b border-emerald-950/50 space-y-1 text-xs">
            <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              PROTOCOLO DE REVERSIBILIDAD OBLIGATORIA:
            </span>
            <p className="text-zinc-300 text-[11px] font-sans-editorial leading-snug">
              {practice?.howToRollback || module.reversibility || 'Esta operación es de lectura o purga no destructiva. No altera claves de arranque.'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-cyan-950/60 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
        <span>LABORATORIO PERICIAL EVO // REGLA DE REVERSIBILIDAD ABSOLUTA</span>
        <span className="text-cyan-400 font-bold">PRÁCTICA #{module.moduleNumber}</span>
      </div>
    </div>
  );
};
