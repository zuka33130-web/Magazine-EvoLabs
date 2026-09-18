import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Monitor, Layers, AlertCircle } from 'lucide-react';
import { UserPcSpec, UserPcEvidenceMap } from '../../types';

interface InheritedPassportBannerProps {
  specs: UserPcSpec;
  evidenceMap?: UserPcEvidenceMap;
  isCompact?: boolean;
}

export const InheritedPassportBanner: React.FC<InheritedPassportBannerProps> = ({
  specs,
  evidenceMap,
  isCompact = false,
}) => {
  const cpuVal = specs.cpu?.trim() || 'NO DISPONIBLE';
  const ramVal = specs.ram?.trim() || 'NO DISPONIBLE';
  const gpuVal = specs.gpu?.trim() || 'NO DISPONIBLE';
  const storageVal = specs.storage?.trim() || 'NO DISPONIBLE';
  const mbVal = specs.motherboard?.trim() || 'NO DISPONIBLE';

  // Check if multiple GPUs are reported (e.g. separated by comma or newlines or " / ")
  const rawGpu = specs.gpu || '';
  const hasMultipleGpus = rawGpu.includes('/') || rawGpu.includes('\n') || rawGpu.includes(';');
  const gpuList = hasMultipleGpus
    ? rawGpu
        .split(/[\/\n;]+/)
        .map((g) => g.trim())
        .filter(Boolean)
    : [gpuVal];

  // Check if integrated graphics might be present
  const isIntegratedSuspected =
    /intel.*(uhd|hd|iris)|radeon.*(vega|graphics)|integrated/i.test(rawGpu) ||
    /intel.*(uhd|hd|iris)|radeon.*(vega|graphics)|integrated/i.test(cpuVal);

  if (isCompact) {
    return (
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono-tech">
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>EVIDENCIA RECUPERADA:</span>
        </div>
        <div className="text-zinc-300">
          <span className="text-zinc-500">CPU:</span>{' '}
          <strong className="text-white">{cpuVal}</strong>
        </div>
        <span className="text-zinc-700">•</span>
        <div className="text-zinc-300">
          <span className="text-zinc-500">RAM:</span>{' '}
          <strong className="text-white">{ramVal}</strong>
        </div>
        <span className="text-zinc-700">•</span>
        <div className="text-zinc-300">
          <span className="text-zinc-500">GPU:</span>{' '}
          <strong className="text-white">{gpuList[0] || 'NO DISPONIBLE'}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-zinc-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-yellow-400 inline-block" />
          <span className="font-mono-tech text-xs uppercase font-bold tracking-widest text-white">
            TU MÁQUINA // EVIDENCIA RECUPERADA
          </span>
        </div>
        <span className="text-[11px] font-mono-tech text-zinc-400 uppercase tracking-wider">
          PASAPORTE EVO HEREDADO DEL CAPÍTULO 01
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono-tech">
        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
            <span>CPU</span>
            <Cpu className="w-3 h-3 text-yellow-400/80" />
          </div>
          <span className={`block font-bold truncate ${cpuVal === 'NO DISPONIBLE' ? 'text-zinc-600 font-normal italic' : 'text-white'}`}>
            {cpuVal}
          </span>
          <span className="text-[9px] text-zinc-500 block">
            {evidenceMap?.cpu.state ? `Estado: ${evidenceMap.cpu.state}` : 'Confirmado en Cap. 01'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
            <span>RAM</span>
            <Layers className="w-3 h-3 text-yellow-400/80" />
          </div>
          <span className={`block font-bold truncate ${ramVal === 'NO DISPONIBLE' ? 'text-zinc-600 font-normal italic' : 'text-white'}`}>
            {ramVal}
          </span>
          <span className="text-[9px] text-zinc-500 block">
            {evidenceMap?.ram.state ? `Estado: ${evidenceMap.ram.state}` : 'Confirmado en Cap. 01'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
            <span>GPU</span>
            <Monitor className="w-3 h-3 text-yellow-400/80" />
          </div>
          {gpuList.length > 1 ? (
            <div className="space-y-0.5">
              {gpuList.map((g, idx) => (
                <span key={idx} className="block font-bold text-white text-[11px] truncate">
                  GPU {idx}: {g}
                </span>
              ))}
            </div>
          ) : (
            <span className={`block font-bold truncate ${gpuVal === 'NO DISPONIBLE' ? 'text-zinc-600 font-normal italic' : 'text-white'}`}>
              {gpuVal}
            </span>
          )}
          <span className="text-[9px] text-zinc-500 block">
            {isIntegratedSuspected ? 'GPU integrada detectada' : 'Confirmado en Cap. 01'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
            <span>ALMACENAMIENTO</span>
            <HardDrive className="w-3 h-3 text-yellow-400/80" />
          </div>
          <span className={`block font-bold truncate ${storageVal === 'NO DISPONIBLE' ? 'text-zinc-600 font-normal italic' : 'text-white'}`}>
            {storageVal}
          </span>
          <span className="text-[9px] text-zinc-500 block">
            {evidenceMap?.storage.state ? `Estado: ${evidenceMap.storage.state}` : 'Confirmado en Cap. 01'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
            <span>PLATAFORMA</span>
            <ShieldCheck className="w-3 h-3 text-yellow-400/80" />
          </div>
          <span className={`block font-bold truncate ${mbVal === 'NO DISPONIBLE' ? 'text-zinc-600 font-normal italic' : 'text-white'}`}>
            {mbVal}
          </span>
          <span className="text-[9px] text-zinc-500 block">Interconexión base</span>
        </div>
      </div>

      {isIntegratedSuspected && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/30 text-xs font-mono-tech text-yellow-200/90">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="font-sans-editorial text-xs leading-relaxed text-zinc-300">
            <strong className="text-yellow-400 font-mono-tech">DETECCIÓN EDITORIAL:</strong> En tu máquina existe evidencia de gráficos integrados. En la Estación 02 y 03 profundizaremos en cómo tu procesador gráfico comparte el ancho de banda de la memoria del sistema.
          </p>
        </div>
      )}
    </div>
  );
};
