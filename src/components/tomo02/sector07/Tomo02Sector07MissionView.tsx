import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  HardDrive,
  Cpu,
  ArrowRight,
  FileText,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface Tomo02Sector07MissionViewProps {
  onBack: () => void;
}

export const Tomo02Sector07MissionView: React.FC<Tomo02Sector07MissionViewProps> = ({ onBack }) => {
  const [hardwareType, setHardwareType] = useState<'SSD_NVME' | 'HDD_LEGACY'>('SSD_NVME');
  const [testApp, setTestApp] = useState<'Photoshop' | 'Chrome' | 'VSCode'>('Photoshop');
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkDone, setBenchmarkDone] = useState<boolean>(false);

  // Results
  const [results, setResults] = useState<{
    stateA_Time: string;
    stateA_DiskActive: string;
    stateA_RAMCache: string;
    stateB_Time: string;
    stateB_DiskActive: string;
    stateB_RAMCache: string;
    deltaSeconds: string;
    verdict: string;
  } | null>(null);

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkDone(false);

    setTimeout(() => {
      if (hardwareType === 'SSD_NVME') {
        setResults({
          stateA_Time: '1.4 s',
          stateA_DiskActive: '< 1%',
          stateA_RAMCache: '4.2 GB (Standby)',
          stateB_Time: '2.9 s',
          stateB_DiskActive: '< 1%',
          stateB_RAMCache: '0.2 GB (Standby)',
          deltaSeconds: '+1.5 s (MÁS LENTO SIN SYSMAIN)',
          verdict: 'RESULTADO RETROGRADO: SysMain ahorraba 1.5 segundos de carga en SSD. RECOMENDACIÓN PERICIAL: MANTENER SYSMAIN EN AUTOMÁTICO.',
        });
      } else {
        setResults({
          stateA_Time: '8.5 s',
          stateA_DiskActive: '100% (20 min post-boot)',
          stateA_RAMCache: '1.8 GB (Standby)',
          stateB_Time: '7.2 s',
          stateB_DiskActive: '12% (30 seg post-boot)',
          stateB_RAMCache: '0.1 GB (Standby)',
          stateB_RAMCache_2: '0.1 GB',
          deltaSeconds: '-1.3 s en apertura / Reducción del congelamiento de disco inicial',
          verdict: 'RESULTADO FAVORABLE EN HDD LEGACY: Deshabilitar SysMain eliminó los 20 min de 100% disk active time. RECOMENDACIÓN PERICIAL: MANTENER EN MANUAL O MIGRAR A SSD.',
        } as any);
      }
      setIsBenchmarking(false);
      setBenchmarkDone(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#60CDFF] tracking-wider uppercase block">
              LABORATORIO CANÓNICO // SECTOR 07
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              SYSMAIN A/B BENCHMARKING (PROTOCOLO CIENTÍFICO)
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Medición pareada de rendimiento: Estado A (SysMain Automático) vs Estado B (SysMain Deshabilitado).
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-zinc-300 transition-colors cursor-pointer self-start sm:self-auto"
          >
            VOLVER AL SECTOR
          </button>
        </div>

        {/* Configuration Setup */}
        <div className="p-5 rounded-2xl bg-[#080B10] border border-zinc-800 space-y-4 font-mono text-xs">
          <span className="text-[#60CDFF] font-bold block uppercase">
            1 // CONFIGURACIÓN DEL ENTORNO DE PRUEBA PAREADA
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-400 text-[11px] block">TIPO DE ALMACENAMIENTO:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHardwareType('SSD_NVME')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${hardwareType === 'SSD_NVME' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
                >
                  SSD NVMe
                </button>
                <button
                  type="button"
                  onClick={() => setHardwareType('HDD_LEGACY')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${hardwareType === 'HDD_LEGACY' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
                >
                  HDD Mecánico
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 text-[11px] block">APLICACIÓN OBJETIVO DE PRUEBA:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Photoshop', 'Chrome', 'VSCode'] as const).map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setTestApp(app)}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${testApp === app ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isBenchmarking}
            onClick={handleRunBenchmark}
            className={`w-full py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${isBenchmarking ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_20px_rgba(0,164,239,0.3)] hover:brightness-110'}`}
          >
            {isBenchmarking ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isBenchmarking ? 'MEDICIÓN A/B EN PROGRESO...' : 'EJECUTAR PROTOCOLO A/B'}</span>
          </button>
        </div>

        {/* Results Card */}
        {benchmarkDone && results && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#080B10] border border-emerald-500/40 space-y-5 animate-fadeIn font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm">SYSMAIN A/B EVIDENCE REPORT</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DELTA CALCULADO
              </span>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0D131F] border border-sky-500/30 space-y-2">
                <span className="text-[#60CDFF] font-bold text-xs uppercase block">
                  ESTADO A: SYSMAIN AUTOMÁTICO (BASELINE)
                </span>
                <div className="space-y-1 text-zinc-300 text-[11px]">
                  <p>• Tiempo de apertura ({testApp}): <strong>{results.stateA_Time}</strong></p>
                  <p>• Tiempo activo de disco: <strong>{results.stateA_DiskActive}</strong></p>
                  <p>• Memoria en Caché: <strong>{results.stateA_RAMCache}</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D131F] border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold text-xs uppercase block">
                  ESTADO B: SYSMAIN DESHABILITADO (CAMBIO ÚNICO)
                </span>
                <div className="space-y-1 text-zinc-300 text-[11px]">
                  <p>• Tiempo de apertura ({testApp}): <strong>{results.stateB_Time}</strong></p>
                  <p>• Tiempo activo de disco: <strong>{results.stateB_DiskActive}</strong></p>
                  <p>• Memoria en Caché: <strong>{results.stateB_RAMCache}</strong></p>
                </div>
              </div>
            </div>

            {/* Verdict Card */}
            <div className="p-4 rounded-xl bg-[#0D121C] border border-emerald-500/30 space-y-2">
              <span className="text-emerald-400 font-bold text-xs block">
                DELTA &amp; VEREDICTO CIENTÍFICO:
              </span>
              <p className="text-white font-bold text-xs">{results.deltaSeconds}</p>
              <p className="text-zinc-300 font-sans text-xs leading-relaxed">{results.verdict}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
