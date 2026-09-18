import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, ArrowDown, RotateCcw, Activity, ShieldAlert, Cpu } from 'lucide-react';

export type EvoMideResultado = 'mejoro' | 'no-cambio' | 'empeoro' | 'condicional' | 'pendiente';

export interface InternetDiceEvoMideProps {
  idMito?: string;
  consejoPopular: string;
  fuentePopular?: string;
  realidadTecnica: string;
  experimento: string;
  herramientaMedicion: string;
  resultado: EvoMideResultado;
  resultadoDetalle: string;
  riesgo: string;
  comoRevertirlo: string;
  fullPage?: boolean;
}

export const InternetDiceEvoMide: React.FC<InternetDiceEvoMideProps> = ({
  idMito = 'MITO-01',
  consejoPopular,
  fuentePopular = 'Consejo recurrente en foros y redes',
  realidadTecnica,
  experimento,
  herramientaMedicion,
  resultado,
  resultadoDetalle,
  riesgo,
  comoRevertirlo,
  fullPage = false,
}) => {
  const getVerdict = () => {
    switch (resultado) {
      case 'empeoro':
        return {
          bg: 'bg-rose-500/10 border-rose-500/40 text-rose-300',
          badgeBg: 'bg-rose-500 text-black',
          icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          title: 'VEREDICTO EVO: EMPEORÓ O INTRODUCE INESTABILIDAD',
          summary: 'La recomendación degrada el rendimiento, genera micro-tirones o rompe la protección del sistema operativo.',
        };
      case 'no-cambio':
        return {
          bg: 'bg-zinc-800/40 border-zinc-700/60 text-zinc-300',
          badgeBg: 'bg-zinc-300 text-black',
          icon: <Activity className="w-5 h-5 text-zinc-400 shrink-0" />,
          title: 'VEREDICTO EVO: NO CAMBIÓ (PLACEBO MEDIDO)',
          summary: 'Diferencia de 0.0% a 0.5% en métricas reales. No existe ninguna ganancia más allá de la sugestión psicológica.',
        };
      case 'mejoro':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
          badgeBg: 'bg-emerald-400 text-black',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          title: 'VEREDICTO EVO: MEJORA MEDIBLE COMPROBADA',
          summary: 'El ensayo metrológico demuestra ganancia real de percentiles, latencia o temperaturas estables.',
        };
      case 'condicional':
        return {
          bg: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
          badgeBg: 'bg-amber-400 text-black',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          title: 'VEREDICTO EVO: CONDICIONAL (DEPENDE DEL ESCENARIO)',
          summary: 'Funciona exclusivamente bajo condiciones validadas por el fabricante; en el resto empeora la estabilidad.',
        };
      default:
        return {
          bg: 'bg-sky-500/10 border-sky-500/40 text-sky-300',
          badgeBg: 'bg-sky-400 text-black',
          icon: <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />,
          title: 'VEREDICTO EVO: PENDIENTE DE ENSAYO',
          summary: 'Requiere ejecución del protocolo A/B en tu configuración específica.',
        };
    }
  };

  const verdict = getVerdict();

  if (fullPage) {
    return (
      <div className="flex-1 flex flex-col justify-between space-y-4 py-2 font-sans-editorial">
        {/* Full-Page Dedicated Header */}
        <div className="border-b border-zinc-800 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-yellow-400 inline-block shadow-[0_0_10px_#facc15]" />
            <h2 className="font-mono-tech font-black text-sm sm:text-base text-white uppercase tracking-wider">
              INTERNET DICE // EVO MIDE
            </h2>
            <span className="px-2 py-0.5 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-mono-tech font-bold rounded">
              EXPEDIENTE {idMito}
            </span>
          </div>

          <div className="text-[11px] font-mono-tech text-zinc-500 uppercase tracking-wider">
            METROLOGÍA PERICIAL INDEPENDIENTE
          </div>
        </div>

        {/* Step 1: Internet Dice (El Consejo Popular) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400">
            <span className="text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>01.</span> EL CONSEJO POPULAR EN LA RED
            </span>
            <span className="text-[10px] text-zinc-500 italic">{fuentePopular}</span>
          </div>
          <div className="p-4 bg-[#10131c] border-l-4 border-yellow-400 rounded-r shadow-md">
            <p className="text-white text-sm sm:text-base leading-snug font-medium italic">
              "{consejoPopular}"
            </p>
          </div>
        </div>

        {/* Arrow Sequence */}
        <div className="flex justify-center text-zinc-600">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Step 2: Qué Pasa Realmente (Arquitectura de Silicio / OS) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-sky-400 font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>02. QUÉ PASA REALMENTE EN EL HARDWARE Y EN EL KERNEL</span>
          </div>
          <div className="p-4 bg-[#0a101b] border-l-4 border-sky-400 rounded-r text-zinc-200 text-xs sm:text-[13px] leading-relaxed">
            {realidadTecnica}
          </div>
        </div>

        {/* Arrow Sequence */}
        <div className="flex justify-center text-zinc-600">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Step 3: El Experimento & Medición A/B */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono-tech text-zinc-400 font-bold uppercase tracking-wider block">
            03. EL PROTOCOLO DE MEDICIÓN A/B
          </span>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono-tech">
            <div className="md:col-span-7 p-3 bg-[#0d0f17] border border-zinc-800 rounded">
              <span className="text-zinc-500 uppercase block text-[9px] mb-1">ENSAYO METROLÓGICO (1 VARIABLE AISLADA):</span>
              <p className="text-zinc-200 font-sans-editorial text-xs leading-relaxed">
                {experimento}
              </p>
            </div>
            <div className="md:col-span-5 p-3 bg-[#0d0f17] border border-zinc-800 rounded flex flex-col justify-between">
              <div>
                <span className="text-yellow-400 uppercase block text-[9px] mb-1">HERRAMIENTA FORENSE:</span>
                <span className="text-white font-bold block">{herramientaMedicion}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-800">
                <span className="text-zinc-500 uppercase block text-[9px]">RESULTADO NUMÉRICO:</span>
                <span className="text-zinc-200 font-bold text-xs">{resultadoDetalle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Veredicto Oficial EVO */}
        <div className={`p-4 rounded-lg border-2 ${verdict.bg} shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-black/40 rounded mt-0.5 sm:mt-0">
              {verdict.icon}
            </div>
            <div>
              <h4 className="font-mono-tech font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                {verdict.title}
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-200 mt-0.5 leading-snug">
                {verdict.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Safety & Rollback Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px] font-mono-tech border-t border-zinc-800">
          <div className="flex items-start gap-2 text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[10px] uppercase text-rose-300">RIESGO LATENTE:</strong>
              <span className="text-zinc-400 font-sans-editorial">{riesgo}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-yellow-400">
            <RotateCcw className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[10px] uppercase text-yellow-300">CÓMO VOLVER ATRÁS:</strong>
              <span className="text-zinc-300 font-sans-editorial">{comoRevertirlo}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard / Half-Page View
  return (
    <div className="bg-[#0b0e14] border-2 border-yellow-400/40 rounded-xl p-3.5 sm:p-4 my-2 shadow-xl text-xs font-sans-editorial relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/90 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_#facc15]" />
          <span className="font-mono-tech font-black text-xs text-white uppercase tracking-wider">
            INTERNET DICE // EVO MIDE
          </span>
          <span className="text-[10px] font-mono-tech px-1.5 py-0.2 bg-zinc-800 text-yellow-300 rounded font-bold">
            {idMito}
          </span>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono-tech font-bold uppercase tracking-wider ${verdict.bg}`}>
          {verdict.icon}
          <span>{verdict.title}</span>
        </div>
      </div>

      {/* Main Grid: Internet vs Realidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2.5">
        <div className="p-3 bg-[#12151d] border-l-2 border-yellow-400 rounded-r">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1">
            <span className="text-yellow-400 font-bold uppercase">EL CONSEJO POPULAR</span>
            <span className="text-[9px] text-zinc-500 italic">{fuentePopular}</span>
          </div>
          <p className="text-white text-[11px] leading-snug italic font-medium">
            "{consejoPopular}"
          </p>
        </div>

        <div className="p-3 bg-[#0e1624] border-l-2 border-sky-400 rounded-r">
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-sky-400 mb-1">
            <span className="font-bold uppercase">QUÉ HACE REALMENTE EL SISTEMA</span>
            <span className="text-[9px] text-zinc-500 font-mono-tech">ARQUITECTURA</span>
          </div>
          <p className="text-zinc-300 text-[11px] leading-snug">
            {realidadTecnica}
          </p>
        </div>
      </div>

      {/* Experiment and Measurement data */}
      <div className="bg-black/50 border border-zinc-800 rounded p-2.5 mb-2.5 font-mono-tech text-[10px]">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-7">
            <span className="text-zinc-400 uppercase font-bold block mb-0.5">
              EXPERIMENTO PERICIAL:
            </span>
            <span className="text-zinc-200 block font-sans-editorial text-[11px] leading-tight">
              {experimento}
            </span>
          </div>
          <div className="sm:col-span-5 sm:border-l sm:border-zinc-800 sm:pl-2.5">
            <span className="text-yellow-400 uppercase font-bold block mb-0.5">
              MEDICIÓN ({herramientaMedicion}):
            </span>
            <span className="text-zinc-100 font-bold block text-[11px]">
              {resultadoDetalle}
            </span>
          </div>
        </div>
      </div>

      {/* Reversal / Risk */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-tech pt-2 border-t border-zinc-800/80">
        <span className="text-rose-400">
          <strong className="text-rose-300 font-bold">RIESGO:</strong> {riesgo}
        </span>
        <span className="text-yellow-400">
          <strong className="text-yellow-300 font-bold">REVERSIÓN:</strong> {comoRevertirlo}
        </span>
      </div>
    </div>
  );
};
