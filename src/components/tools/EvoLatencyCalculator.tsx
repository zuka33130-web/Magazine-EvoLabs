import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  Gauge,
  Sparkles,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import {
  calculateRamLatency,
  COMMON_RAM_PRESETS,
} from '../../utils/ramLatencyUtils';

interface EvoLatencyCalculatorProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const EvoLatencyCalculator: React.FC<EvoLatencyCalculatorProps> = ({
  onClose,
  isModal = false,
}) => {
  const [freq, setFreq] = useState<number>(6000);
  const [cl, setCl] = useState<number>(30);
  const [trcd, setTrcd] = useState<number>(38);
  const [trp, setTrp] = useState<number>(38);
  const [tras, setTras] = useState<number>(96);
  const [topology, setTopology] = useState<'single' | 'dual' | 'quad'>('dual');
  const [copied, setCopied] = useState<boolean>(false);

  // Single source of truth calculation
  const metrics = useMemo(() => {
    return calculateRamLatency({
      frequencyMhz: freq,
      cl,
      tRcd: trcd,
      tRp: trp,
      tRas: tras,
      channelTopology: topology,
    });
  }, [freq, cl, trcd, trp, tras, topology]);

  const applyPreset = (preset: (typeof COMMON_RAM_PRESETS)[0]) => {
    setFreq(preset.freq);
    setCl(preset.cl);
    setTrcd(preset.trcd);
    setTrp(preset.trp);
    setTras(preset.tras);
  };

  const handleCopyReport = () => {
    const reportText = `[EVO LABS // HERRAMIENTA PERICIAL DE LATENCIA RAM]
--------------------------------------------------
Frecuencia Memoria: ${freq} MT/s (MHz)
Timings: CL${cl}-${trcd}-${trp}-${tras}
Topología: ${topology.toUpperCase()} CHANNEL
Latencia Real Absoluta: ${metrics.absoluteLatencyNs} ns
Tiempo de Ciclo tCK: ${metrics.tCkNs} ns
Ancho de Banda Teórico: ${metrics.bandwidthGBs} GB/s
Evaluación Metrológica: ${metrics.evaluationText}
Fórmula: Latencia (ns) = (CL * 2000) / Frecuencia(MT/s)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className="space-y-6 font-mono-tech select-none">
      {/* HEADER DE HERRAMIENTA */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              HERRAMIENTA INDEPENDIENTES // METROLOGÍA DE SILICIO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
            CALCULADOR DE LATENCIA RAM
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial max-w-2xl">
            Calcula la latencia real absoluta en nanosegundos (ns) para cualquier combinación de frecuencia (MT/s) y timing CAS Latency (CL).
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* METRIC RESULT BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LATENCIA PRINCIPAL */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            metrics.evaluation === 'OPTIMAL'
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : metrics.evaluation === 'ACCEPTABLE'
              ? 'bg-sky-950/40 border-sky-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400">
              LATENCIA REAL ABSOLUTA
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-4xl sm:text-5xl font-display font-black text-white tracking-tight">
              {metrics.absoluteLatencyNs}
            </span>
            <span className="text-lg font-bold text-zinc-400 ml-1.5">ns</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            {metrics.evaluation === 'OPTIMAL' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : metrics.evaluation === 'ACCEPTABLE' ? (
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span
              className={
                metrics.evaluation === 'OPTIMAL'
                  ? 'text-emerald-400'
                  : metrics.evaluation === 'ACCEPTABLE'
                  ? 'text-sky-400'
                  : 'text-rose-400'
              }
            >
              {metrics.evaluationText}
            </span>
          </div>
        </div>

        {/* TIEMPO DE CICLO tCK */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400">
              TIEMPO DE CICLO (tCK)
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              {metrics.tCkNs}
            </span>
            <span className="text-base font-bold text-zinc-400 ml-1.5">ns / ciclo</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-sans-editorial">
            Duración exacta de un pulso de reloj en el bus de memoria.
          </p>
        </div>

        {/* ANCHO DE BANDA TEÓRICO */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-zinc-400">
              ANCHO DE BANDA TEÓRICO
            </span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              {metrics.bandwidthGBs}
            </span>
            <span className="text-base font-bold text-zinc-400 ml-1.5">GB/s</span>
          </div>
          <div className="text-[10px] text-zinc-400 uppercase font-bold">
            TOPOLOGÍA: <span className="text-emerald-400">{topology.toUpperCase()} CHANNEL</span>
          </div>
        </div>
      </div>

      {/* CONTROLES E INPUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PARÁMETROS CONFIGURABLES */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              PARÁMETROS DE MEMORIA
            </h3>
            <span className="text-[10px] text-zinc-500">EDITAR VALORES</span>
          </div>

          <div className="space-y-4">
            {/* Frecuencia MHz */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-bold">FRECUENCIA (MT/s / MHz)</span>
                <strong className="text-emerald-400">{freq} MT/s</strong>
              </div>
              <input
                type="range"
                min="2133"
                max="8400"
                step="100"
                value={freq}
                onChange={(e) => setFreq(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-500">
                <span>2133 (DDR4)</span>
                <span>6000 (DDR5 Sweet Spot)</span>
                <span>8400 (OC)</span>
              </div>
            </div>

            {/* CAS Latency CL */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-bold">CAS LATENCY (CL / tCL)</span>
                <strong className="text-emerald-400">CL {cl}</strong>
              </div>
              <input
                type="range"
                min="10"
                max="48"
                step="1"
                value={cl}
                onChange={(e) => setCl(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-500">
                <span>CL 10</span>
                <span>CL 30 (EXPO)</span>
                <span>CL 48</span>
              </div>
            </div>

            {/* TIMINGS SECUNDARIOS (tRCD, tRP, tRAS) */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold mb-1">tRCD</label>
                <input
                  type="number"
                  value={trcd}
                  onChange={(e) => setTrcd(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold mb-1">tRP</label>
                <input
                  type="number"
                  value={trp}
                  onChange={(e) => setTrp(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold mb-1">tRAS</label>
                <input
                  type="number"
                  value={tras}
                  onChange={(e) => setTras(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* TOPOLOGÍA DE CANALES */}
            <div className="space-y-1.5 pt-2">
              <span className="block text-[10px] text-zinc-400 font-bold uppercase">
                CANALES DE MEMORIA (TOPOLOGÍA)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['single', 'dual', 'quad'] as const).map((top) => (
                  <button
                    key={top}
                    type="button"
                    onClick={() => setTopology(top)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold uppercase border transition-colors cursor-pointer ${
                      topology === top
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {top} CHANNEL
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRESETS Y EXPLICACIÓN PERICIAL */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              PRESETS RÁPIDOS DE MERCADO
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {COMMON_RAM_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {preset.label}
                  </div>
                  <div className="text-[9px] text-zinc-500">
                    {preset.freq} MT/s // CL{preset.cl}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              FÓRMULA FÍSICA APLICADA
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans-editorial">
              <strong className="font-mono text-emerald-300">Latencia Real (ns) = (CL × 2000) / Frecuencia (MT/s)</strong>
              <br />
              Una memoria DDR5 a 6000 MT/s CL30 tiene exactamente 10.0 ns de latencia, igual que una DDR4 a 3200 MT/s CL16.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">INFORME COPIADO AL PORTAPAPELES</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>COPIAR RESULTADO PERICIAL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-4xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
