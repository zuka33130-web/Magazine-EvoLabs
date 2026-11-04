import React, { useState } from 'react';
import { Sliders, Activity, Info, BookOpen, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Layers, Zap } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type PcieGen = 'GEN_3' | 'GEN_4' | 'GEN_5';
type LaneCount = 1 | 4 | 8 | 16;

interface WorkloadPreset {
  id: string;
  name: string;
  description: string;
  bandwidthDemandGbs: number;
}

const WORKLOADS: WorkloadPreset[] = [
  { id: 'audio_net', name: 'Tarjeta de Red 2.5 GbE / Audio', description: 'Tráfico de red y paquetes PCM sin comprimir', bandwidthDemandGbs: 0.35 },
  { id: 'nvme_gen4', name: 'NVMe DirectStorage M.2 (Lectura)', description: 'Streaming de texturas 4K comprimidas desde SSD', bandwidthDemandGbs: 7.2 },
  { id: 'gpu_gaming', name: 'GPU Gaming 1440p / 4K Ray Tracing', description: 'Transferencia de mallas, búferes de vértices y VRAM swap', bandwidthDemandGbs: 14.5 },
  { id: 'ai_tensor', name: 'Inferencia de IA y Carga de Pesos LLM', description: 'Offloading de tensores masivos entre RAM de sistema y VRAM', bandwidthDemandGbs: 26.0 },
];

export const PcieBandwidthLab: React.FC = () => {
  const [gen, setGen] = useState<PcieGen>('GEN_4');
  const [lanes, setLanes] = useState<LaneCount>(16);
  const [selectedWorkload, setSelectedWorkload] = useState<WorkloadPreset>(WORKLOADS[2]); // GPU gaming
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Exact Bandwidth in GB/s per lane (effective payload after 128b/130b encoding)
  // Gen 3: 8 GT/s * (128/130) / 8 = ~0.985 GB/s per lane
  // Gen 4: 16 GT/s * (128/130) / 8 = ~1.969 GB/s per lane
  // Gen 5: 32 GT/s * (128/130) / 8 = ~3.938 GB/s per lane
  const perLaneBandwidth: Record<PcieGen, number> = {
    GEN_3: 0.985,
    GEN_4: 1.969,
    GEN_5: 3.938,
  };

  const laneThroughput = perLaneBandwidth[gen];
  const totalBusBandwidthGbs = laneThroughput * lanes;

  // Saturation and bottleneck calculation
  const saturationPct = Math.min(200, Math.round((selectedWorkload.bandwidthDemandGbs / totalBusBandwidthGbs) * 100));
  const isBottlenecked = selectedWorkload.bandwidthDemandGbs > totalBusBandwidthGbs;
  const throughputDelivered = isBottlenecked ? totalBusBandwidthGbs : selectedWorkload.bandwidthDemandGbs;
  const performanceLossPct = isBottlenecked
    ? Math.round(((selectedWorkload.bandwidthDemandGbs - totalBusBandwidthGbs) / selectedWorkload.bandwidthDemandGbs) * 100)
    : 0;

  return (
    <div className="space-y-8 text-zinc-100 font-sans-editorial">
      {/* Header Banner */}
      <div className="border border-zinc-800 bg-[#0C0F17] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                ESCALÓN 4 // TOPOLOGÍA DE BUSES
              </span>
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="Especificación PCI-SIG: GT/s × (128/130) / 8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white font-sans-editorial">
              ANALIZADOR DE PISTAS PCIE Y ANCHO DE BANDA POR LÍNEA
            </h2>
            <p className="text-zinc-400 text-sm max-w-3xl">
              ¿Qué ocurre si conectás una placa de video en una ranura x8 o PCIe 3.0? Comprobá matemáticamente cómo la saturación de líneas PCIe produce microtirones y pérdida de rendimiento en streaming de texturas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showGuide ? 'OCULTAR GUÍA DE USO' : '¿CÓMO USAR ESTE LABORATORIO?'}</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guía de Uso Paso a Paso */}
      {showGuide && (
        <div className="border border-cyan-500/30 bg-cyan-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-cyan-400">
            <Info className="w-4 h-4" />
            <span>GUÍA DE USO METROLÓGICO // PROCEDIMIENTO PASO A PASO</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-zinc-300 font-sans">
            <li>
              <strong className="text-white font-mono">Paso 1 (Configurar el Bus Físico):</strong> Seleccioná la generación PCIe (Gen 3, 4 o 5) y el número de líneas físicas conectadas al socket (x1, x4, x8 o x16).
            </li>
            <li>
              <strong className="text-white font-mono">Paso 2 (Inyectar una Carga de Trabajo Real):</strong> Seleccioná qué componente estás simulando (un SSD NVMe que requiere 7.2 GB/s o una placa de video 4K con Ray Tracing que demanda 14.5 GB/s).
            </li>
            <li>
              <strong className="text-white font-mono">Paso 3 (Evaluar Saturación y Cuello de Botella):</strong> Observá el medidor de saturación del bus. Si la demanda supera el ancho de banda del bus (&gt; 100%), el sistema sufrirá estrangulamiento de datos, reflejando caídas bruscas de FPS y micro-stutters.
            </li>
            <li>
              <strong className="text-white font-mono">Conclusión de Taller:</strong> Una ranura PCIe 4.0 x8 entrega exactamente el mismo ancho de banda (~15.75 GB/s) que una ranura PCIe 3.0 x16 completa. La bifurcación y generación determinan el ancho de banda final.
            </li>
          </ol>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono-tech text-sm font-bold uppercase text-zinc-200">
              CONFIGURACIÓN DEL SLOT
            </h3>
          </div>

          {/* PCIe Generation Select */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">Generación PCIe:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['GEN_3', 'GEN_4', 'GEN_5'] as PcieGen[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGen(g)}
                  className={`p-2.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                    gen === g
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <div>{g.replace('_', ' ')}</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">
                    {g === 'GEN_3' ? '8 GT/s' : g === 'GEN_4' ? '16 GT/s' : '32 GT/s'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lanes Count */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">Número de Líneas (Lanes):</label>
            <div className="grid grid-cols-4 gap-2">
              {([1, 4, 8, 16] as LaneCount[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanes(l)}
                  className={`p-2.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                    lanes === l
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <div className="text-base font-bold">x{l}</div>
                  <div className="text-[9px] text-zinc-500">
                    {l === 1 ? 'Audio/Red' : l === 4 ? 'NVMe M.2' : l === 8 ? 'GPU x8' : 'GPU x16'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Workload Preset */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">Carga de Trabajo a Probar:</label>
            <div className="space-y-1.5">
              {WORKLOADS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorkload(w)}
                  className={`w-full p-2.5 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                    selectedWorkload.id === w.id
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span>{w.name}</span>
                    <span className="text-cyan-400 font-bold">{w.bandwidthDemandGbs} GB/s</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{w.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results & Simulation Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Bus Bandwidth */}
            <div className="bg-black/60 border border-cyan-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                ANCHO DE BANDA MÁXIMO DEL SLOT
              </span>
              <span className="text-3xl font-mono font-black text-cyan-400">
                {totalBusBandwidthGbs.toFixed(2)} <span className="text-sm font-sans text-cyan-300">GB/s</span>
              </span>
              <p className="text-[10px] font-mono text-zinc-400">
                {lanes} líneas × {laneThroughput.toFixed(3)} GB/s
              </p>
            </div>

            {/* Demanded Bandwidth */}
            <div className="bg-black/60 border border-purple-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">
                DEMANDA DE TRÁFICO
              </span>
              <span className="text-3xl font-mono font-black text-purple-400">
                {selectedWorkload.bandwidthDemandGbs.toFixed(1)} <span className="text-sm font-sans text-purple-300">GB/s</span>
              </span>
              <p className="text-[10px] font-mono text-zinc-400">
                Flujo continuo de datos
              </p>
            </div>

            {/* Saturation Verdict */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              isBottlenecked
                ? 'bg-red-950/40 border-red-500/50 text-red-200'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <span className="text-[10px] font-mono uppercase block font-bold">
                ESTADO DE SATURACIÓN
              </span>
              <div className="text-xl font-mono font-black">
                {saturationPct}% DE CARGA
              </div>
              <p className="text-[10px] font-mono">
                {isBottlenecked
                  ? `Cuello de botella: -${performanceLossPct}% de flujo`
                  : 'Bus óptimo sin restricción'}
              </p>
            </div>
          </div>

          {/* Real-time Bus Traffic Gauge */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-300 font-bold uppercase">Tasa de Ocupación de las Pistas PCIe</span>
              <span className={isBottlenecked ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {throughputDelivered.toFixed(2)} / {totalBusBandwidthGbs.toFixed(2)} GB/s
              </span>
            </div>

            <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isBottlenecked ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, saturationPct)}%` }}
              />
            </div>

            {isBottlenecked ? (
              <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-lg text-xs font-mono text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-red-200">¡Advertencia de Cuello de Botella Activo!</strong>
                  La carga seleccionada necesita {selectedWorkload.bandwidthDemandGbs} GB/s pero la ranura solo puede transportar {totalBusBandwidthGbs.toFixed(2)} GB/s. Se perderá un ~{performanceLossPct}% de rendimiento con caídas repentinas en los cuadros por segundo.
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-emerald-200">Bus Despejado y Sin Retardo</strong>
                  El canal tiene margen de sobra para absorber ráfagas de datos sin saturar los búferes de la placa madre.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
