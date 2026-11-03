import React, { useState } from 'react';
import { Terminal, Copy, Check, Info, Search, ArrowRight } from 'lucide-react';

interface LabEvoCommandProps {
  title?: string;
  subtitle?: string;
  command: string;
  shellType?: 'POWERSHELL' | 'CMD' | 'REG';
  queHace: string;
  queDevuelve: string;
  queDatoMirar: string;
  queSignifica: string;
  outputSample?: string;
  tip?: string;
}

export const LabEvoCommand: React.FC<LabEvoCommandProps> = ({
  title = 'COMANDO DE INVESTIGACIÓN FORENSE',
  subtitle = 'AUDITORÍA DIRECTA DE SILICIO // SIN SOFTWARE DE TERCEROS',
  command,
  shellType = 'POWERSHELL',
  queHace,
  queDevuelve,
  queDatoMirar,
  queSignifica,
  outputSample,
  tip,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0e15] border-2 border-yellow-400/40 rounded-xl p-4 sm:p-5 shadow-2xl relative overflow-hidden font-sans-editorial">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-mono-tech font-black text-xs uppercase tracking-wider">
                LAB EVO // {title}
              </span>
              <span className="px-1.5 py-0.2 bg-zinc-800 text-[9px] font-mono-tech text-zinc-300 rounded uppercase">
                {shellType}
              </span>
            </div>
            <span className="text-zinc-500 font-mono-tech text-[10px] uppercase tracking-wider block">
              {subtitle}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="no-print print:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded bg-yellow-400/15 hover:bg-yellow-400/25 border border-yellow-400/50 text-yellow-300 text-[11px] font-mono-tech transition-colors cursor-pointer"
          title="Copiar comando al portapapeles"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">¡COPIADO!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-yellow-400" />
              <span>COPIAR COMANDO</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Command Line Display */}
      <div className="bg-[#05070a] border border-zinc-700/80 rounded-lg p-3 sm:p-4 mb-4 relative shadow-inner">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-500 mb-1.5 select-none">
          <span>PS C:\WINDOWS\SYSTEM32&gt;</span>
          <span className="text-zinc-600">EJECUTAR COMO ADMINISTRADOR</span>
        </div>
        <pre className="font-mono-tech text-xs sm:text-sm text-emerald-400 whitespace-pre-wrap break-all select-all font-semibold leading-relaxed">
          {command}
        </pre>
      </div>

      {/* 4 Analytical Inspection Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
        {/* Qué hace */}
        <div className="p-3 bg-[#11141e] border-l-2 border-yellow-400 rounded-r">
          <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            1. ¿QUÉ HACE ESTE COMANDO?
          </span>
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            {queHace}
          </p>
        </div>

        {/* Qué devuelve */}
        <div className="p-3 bg-[#11141e] border-l-2 border-zinc-600 rounded-r">
          <span className="text-[10px] font-mono-tech font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            2. ¿QUÉ DEVUELVE LA CONSOLA?
          </span>
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            {queDevuelve}
          </p>
        </div>

        {/* Qué dato mirar */}
        <div className="p-3 bg-[#11141e] border-l-2 border-sky-400 rounded-r">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech font-bold uppercase tracking-wider text-sky-400 mb-1">
            <Search className="w-3 h-3" />
            <span>3. ¿QUÉ DATO EXACTO DEBÉS MIRAR?</span>
          </div>
          <p className="text-zinc-200 text-[11px] leading-relaxed font-mono-tech font-medium">
            {queDatoMirar}
          </p>
        </div>

        {/* Qué significa */}
        <div className="p-3 bg-[#11141e] border-l-2 border-emerald-400 rounded-r">
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <Info className="w-3 h-3" />
            <span>4. ¿QUÉ SIGNIFICA EL RESULTADO?</span>
          </div>
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            {queSignifica}
          </p>
        </div>
      </div>

      {/* Output Sample or Pro Tip */}
      {(outputSample || tip) && (
        <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono-tech text-zinc-400">
          {outputSample && (
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">SALIDA EJEMPLO:</span>
              <span className="text-zinc-300 bg-black/40 px-2 py-0.5 rounded border border-zinc-800">
                {outputSample}
              </span>
            </div>
          )}
          {tip && (
            <div className="flex items-center gap-1.5 text-yellow-300/90 ml-auto">
              <ArrowRight className="w-3 h-3 text-yellow-400" />
              <span>{tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
