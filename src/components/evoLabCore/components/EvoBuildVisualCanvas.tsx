import React from 'react';
import {
  Layers,
  Cpu,
  Tv,
  HardDrive,
  Zap,
  Fan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import {
  BuildComponentItem,
  CompatibilityReport,
  ComponentValueRating,
} from '../types';

interface EvoBuildVisualCanvasProps {
  motherboard?: BuildComponentItem;
  cpu?: BuildComponentItem;
  ram?: BuildComponentItem;
  gpu?: BuildComponentItem;
  storage?: BuildComponentItem;
  psu?: BuildComponentItem;
  cooling?: BuildComponentItem;
  compatibility: CompatibilityReport;
  cpuRating?: ComponentValueRating;
  gpuRating?: ComponentValueRating;
  ramRating?: ComponentValueRating;
}

export const EvoBuildVisualCanvas: React.FC<EvoBuildVisualCanvasProps> = ({
  motherboard,
  cpu,
  ram,
  gpu,
  storage,
  psu,
  cooling,
  compatibility,
  cpuRating = 'UNKNOWN',
  gpuRating = 'UNKNOWN',
  ramRating = 'UNKNOWN',
}) => {
  const isMbAm5 = motherboard?.model.includes('AM5') || motherboard?.specsSummary.includes('AM5');
  const isCpuAm5 = cpu?.specsSummary.includes('AM5');
  const socketCompatible =
    (!motherboard || !cpu) ? true : (isMbAm5 && isCpuAm5) || (!isMbAm5 && !isCpuAm5);

  const isDdr5Mb = motherboard?.specsSummary.includes('DDR5');
  const isDdr5Ram = ram?.specsSummary.includes('DDR5');
  const ramCompatible =
    (!motherboard || !ram) ? true : (isDdr5Mb && isDdr5Ram) || (!isDdr5Mb && !isDdr5Ram);

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#080b11] p-5 sm:p-6 font-mono-tech relative overflow-hidden space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              TOPOLOGÍA DE ENSAMBLE VISUAL
            </span>
            <h4 className="font-display font-black text-white text-sm sm:text-base">
              CHASIS Y PLACA MADRE EN BANCO
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-bold">Consumo Total:</span>
          <span className="px-2 py-0.5 rounded font-black text-amber-400 bg-amber-400/10 border border-amber-400/30">
            ~{compatibility.totalPowerDrawW}W
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500 font-bold">Holgura Fuente:</span>
          <span
            className={`px-2 py-0.5 rounded font-black ${
              compatibility.psuMarginW >= 100
                ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/30'
                : 'text-rose-400 bg-rose-400/10 border border-rose-400/30'
            }`}
          >
            {compatibility.psuMarginW > 0 ? `+${compatibility.psuMarginW}W` : `${compatibility.psuMarginW}W`}
          </span>
        </div>
      </div>

      {/* Schematic Motherboard Representation */}
      <div className="rounded-xl border border-blue-500/30 bg-[#0c121f]/90 p-4 sm:p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-2 right-3 text-[10px] font-bold text-blue-400/60 uppercase">
          PCB LAYER: {motherboard?.model || 'Placa Base ATX'}
        </div>

        {/* Board Components Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Left Column: CPU Socket + Cooler */}
          <div className="md:col-span-6 space-y-3">
            {/* CPU Socket Node */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                socketCompatible
                  ? 'border-amber-500/50 bg-amber-950/20'
                  : 'border-red-500/80 bg-red-950/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> SOCKET DE PROCESADOR
                </span>
                <span
                  className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                    socketCompatible
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {socketCompatible ? 'SOCKET COMPATIBLE' : 'ERROR: SOCKET DISCREPANTE'}
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {cpu?.model || 'Sin procesador'}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                {cpu?.specsSummary || 'Seleccione CPU'}
              </div>
              {cpuRating === 'EXCESSIVE' && (
                <div className="mt-2 text-[10px] text-amber-300 bg-amber-950/50 p-1.5 rounded border border-amber-500/30">
                  ⚠️ Esta CPU supera ampliamente tu objetivo. Podrías ahorrar aquí sin pérdida observable.
                </div>
              )}
            </div>

            {/* Cooler Node */}
            <div className="p-3.5 rounded-xl border border-sky-500/30 bg-sky-950/20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Fan className="w-4 h-4" /> DISIPADOR / REFRIGERACIÓN
                </span>
                <span className="text-[9px] text-zinc-400">Montaje en Socket</span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {cooling?.model || 'Disipador Stock'}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {cooling?.specsSummary}
              </div>
            </div>
          </div>

          {/* Right Column: RAM Slots & Storage */}
          <div className="md:col-span-6 space-y-3">
            {/* RAM Slots Node */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                ramCompatible
                  ? 'border-cyan-500/50 bg-cyan-950/20'
                  : 'border-red-500/80 bg-red-950/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> SLOTS DE MEMORIA DDR
                </span>
                <span
                  className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                    ramCompatible
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {ramCompatible ? 'BANCO DDR COMPATIBLE' : 'ERROR: GENERACIÓN DDR INCOMPATIBLE'}
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {ram?.model || 'Sin módulos'}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                {ram?.specsSummary || 'Seleccione memoria'}
              </div>
              {ramRating === 'EXCESSIVE' && (
                <div className="mt-2 text-[10px] text-amber-300 bg-amber-950/50 p-1.5 rounded border border-amber-500/30">
                  ⚠️ Capacidad sobredimensionada para el uso seleccionado.
                </div>
              )}
            </div>

            {/* M.2 NVMe Storage Node */}
            <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4" /> PUERTO M.2 NVME (PCIe 4.0 x4)
                </span>
                <span className="text-[9px] text-emerald-400 font-bold">LÍNEA DIRECTA</span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {storage?.model || 'Sin unidad de disco'}
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                {storage?.specsSummary}
              </div>
            </div>
          </div>

          {/* Full Width Bottom: PCIe x16 GPU Slot & PSU Connection */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* GPU Slot */}
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Tv className="w-4 h-4" /> RANURA PCIe x16 (GPU DEDICADA)
                </span>
                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ANCHO COMPLETO
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {gpu?.model || 'Gráficos del procesador'}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                {gpu?.specsSummary}
              </div>
              {gpuRating === 'EXCESSIVE' && (
                <div className="mt-2 text-[10px] text-amber-300 bg-amber-950/50 p-1.5 rounded border border-amber-500/30">
                  ⚠️ Gasto desproporcionado respecto a la resolución fijada.
                </div>
              )}
            </div>

            {/* PSU Power Rail Node */}
            <div className="p-4 rounded-xl border border-yellow-500/40 bg-yellow-950/20">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> ALIMENTACIÓN ELÉCTRICA (PSU)
                </span>
                <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  ATX 24P + EPS 8P
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {psu?.model || 'Fuente básica'}
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                {psu?.specsSummary}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
