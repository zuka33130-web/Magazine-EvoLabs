import React, { useState } from 'react';
import { Sliders, BookOpen, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Layers, Zap } from 'lucide-react';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

type PcieGen = 'GEN_1' | 'GEN_2' | 'GEN_3' | 'GEN_4' | 'GEN_5' | 'GEN_6';
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
  const [assetSizeGb, setAssetSizeGb] = useState<number>(10); // 10 GB texture asset pack
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Bandwidth in GB/s per lane (effective payload after line encoding)
  // Gen 1: 2.5 GT/s (8b/10b => 20% loss) = 0.25 GB/s
  // Gen 2: 5.0 GT/s (8b/10b => 20% loss) = 0.50 GB/s
  // Gen 3: 8.0 GT/s (128b/130b => 1.5% loss) = 0.985 GB/s
  // Gen 4: 16.0 GT/s (128b/130b => 1.5% loss) = 1.969 GB/s
  // Gen 5: 32.0 GT/s (128b/130b => 1.5% loss) = 3.938 GB/s
  // Gen 6: 64.0 GT/s (PAM4 + 242b/256b) = 7.563 GB/s
  const perLaneBandwidth: Record<PcieGen, { gbs: number; encoding: string; gts: string }> = {
    GEN_1: { gbs: 0.25, encoding: '8b/10b (20% overhead)', gts: '2.5 GT/s' },
    GEN_2: { gbs: 0.50, encoding: '8b/10b (20% overhead)', gts: '5.0 GT/s' },
    GEN_3: { gbs: 0.985, encoding: '128b/130b (1.5% overhead)', gts: '8.0 GT/s' },
    GEN_4: { gbs: 1.969, encoding: '128b/130b (1.5% overhead)', gts: '16.0 GT/s' },
    GEN_5: { gbs: 3.938, encoding: '128b/130b (1.5% overhead)', gts: '32.0 GT/s' },
    GEN_6: { gbs: 7.563, encoding: '242b/256b + PAM4', gts: '64.0 GT/s' },
  };

  const laneInfo = perLaneBandwidth[gen];
  const totalBusBandwidthGbs = laneInfo.gbs * lanes;

  // Transfer duration calculator for asset pack
  const transferDurationSec = (assetSizeGb / totalBusBandwidthGbs).toFixed(2);
  const sataSsdDurationSec = (assetSizeGb / 0.55).toFixed(2); // 550 MB/s SATA
  const hddDurationSec = (assetSizeGb / 0.15).toFixed(2); // 150 MB/s HDD

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
              <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="PCI-SIG: GT/s × Eficiencia de Codificación / 8" />
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
            <span>{showGuide ? 'OCULTAR GUÍA' : 'GUÍA DE USO'}</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guía de Uso Paso a Paso */}
      {showGuide && (
        <div className="border border-cyan-500/30 bg-cyan-950/20 rounded-xl p-5 space-y-3 font-sans text-xs text-zinc-300">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-cyan-400">
            <Layers className="w-4 h-4" />
            <span>GUÍA DE USO METROLÓGICO // PROCEDIMIENTO PASO A PASO</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-zinc-300">
            <li>
              <strong className="text-white font-mono">Paso 1 (Configurar el Bus Físico):</strong> Seleccioná la generación PCIe (Gen 1 a Gen 6) y el número de líneas (x1 a x16).
            </li>
            <li>
              <strong className="text-white font-mono">Paso 2 (Inyectar Tráfico Real):</strong> Probá cargas de trabajo (NVMe DirectStorage, GPU 4K Ray Tracing o Inferencia de IA).
            </li>
            <li>
              <strong className="text-white font-mono">Paso 3 (Simulador de Carga de Archivos):</strong> Ajustá el tamaño de archivo (GB) y compará el tiempo de transferencia PCIe vs SSD SATA vs Disco Rígido HDD.
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
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {(['GEN_1', 'GEN_2', 'GEN_3', 'GEN_4', 'GEN_5', 'GEN_6'] as PcieGen[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGen(g)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    gen === g
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <div>{g.replace('_', ' ')}</div>
                  <div className="text-[9px] text-zinc-500">{perLaneBandwidth[g].gts}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Lanes Count */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">Número de Líneas (Lanes):</label>
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {([1, 4, 8, 16] as LaneCount[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanes(l)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    lanes === l
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-bold">x{l}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Workload Preset */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block uppercase">Carga de Trabajo Probadora:</label>
            <div className="space-y-1.5 font-mono">
              {WORKLOADS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorkload(w)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedWorkload.id === w.id
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                      : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span>{w.name}</span>
                    <span className="text-cyan-400 font-bold">{w.bandwidthDemandGbs} GB/s</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset Size Slider */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Tamaño Paquete de Texturas:</span>
              <span className="text-amber-400 font-bold">{assetSizeGb} GB</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={assetSizeGb}
              onChange={(e) => setAssetSizeGb(parseInt(e.target.value, 10))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 space-y-1">
            <div className="text-zinc-300 font-bold text-[10px] uppercase">Codificación de Línea:</div>
            <div>Esquema: <strong className="text-white">{laneInfo.encoding}</strong></div>
            <div>Tasa por línea: <strong className="text-cyan-300">{laneInfo.gbs.toFixed(3)} GB/s</strong></div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Bus Bandwidth */}
            <div className="bg-black/60 border border-cyan-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                ANCHO DE BANDA SLOT
              </span>
              <span className="text-3xl font-black text-cyan-400">
                {totalBusBandwidthGbs.toFixed(2)} <span className="text-sm text-cyan-300">GB/s</span>
              </span>
              <p className="text-[10px] text-zinc-400">
                {lanes} líneas × {laneInfo.gbs.toFixed(2)} GB/s
              </p>
            </div>

            {/* Demanded Bandwidth */}
            <div className="bg-black/60 border border-purple-500/40 rounded-xl p-4 space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                TIEMPO CARGA PAQUETE ({assetSizeGb} GB)
              </span>
              <span className="text-3xl font-black text-amber-400">
                {transferDurationSec} <span className="text-sm text-amber-300">seg</span>
              </span>
              <p className="text-[10px] text-zinc-400">
                DirectStorage sobre PCIe
              </p>
            </div>

            {/* Saturation Verdict */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              isBottlenecked
                ? 'bg-red-950/40 border-red-500/50 text-red-200'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <span className="text-[10px] uppercase block font-bold">
                OCUPACIÓN DE LÍNEAS
              </span>
              <div className="text-xl font-black">
                {saturationPct}% DE CARGA
              </div>
              <p className="text-[10px]">
                {isBottlenecked ? `Pérdida: -${performanceLossPct}%` : 'Flujo óptimo'}
              </p>
            </div>
          </div>

          {/* Transfer Comparison Table */}
          <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-5 space-y-4">
            <span className="text-xs uppercase font-bold text-zinc-300 block">
              TIEMPO DE TRANSFERENCIA COMPARATIVO DE PAQUETE DE {assetSizeGb} GB:
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Tu Bus PCIe ({gen.replace('_', ' ')} x{lanes})</span>
                  <span className="font-bold text-cyan-400">{transferDurationSec} segundos</span>
                </div>
                <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: '15%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>SSD SATA III Clásico (550 MB/s)</span>
                  <span className="text-zinc-300">{sataSsdDurationSec} segundos</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Disco Rígido Mecánico HDD (150 MB/s)</span>
                  <span className="text-zinc-300">{hddDurationSec} segundos</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
