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
  Eye,
  RefreshCw,
  Database,
  Layers,
} from 'lucide-react';

interface Tomo02Sector08MissionViewProps {
  onPracticeCompleted?: () => void;
  onBackToReader: () => void;
}

export const Tomo02Sector08MissionView: React.FC<Tomo02Sector08MissionViewProps> = ({
  onBackToReader,
  onPracticeCompleted,
}) => {
  const [pagefileMode, setPagefileMode] = useState<'AUTO' | 'DISABLED' | 'FIXED_SMALL'>('AUTO');
  const [allocatedGb, setAllocatedGb] = useState<number>(12);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [simResults, setSimResults] = useState<{
    commitLimit: number;
    committedMemory: number;
    hardFaultsPerSec: number;
    status: 'NORMAL' | 'WARNING' | 'CRASH_OOM';
    log: string[];
  } | null>(null);

  const ramPhysical = 16; // 16 GB

  const runPressureSimulation = () => {
    setIsRunningSim(true);
    let commitLimit = 16;
    if (pagefileMode === 'AUTO') commitLimit = 32;
    if (pagefileMode === 'FIXED_SMALL') commitLimit = 18;
    if (pagefileMode === 'DISABLED') commitLimit = 16;

    const committed = allocatedGb + 2.5; // base system commit
    let status: 'NORMAL' | 'WARNING' | 'CRASH_OOM' = 'NORMAL';
    let hardFaults = 5;
    const log: string[] = [];

    log.push(`[SIM] Iniciando simulación de presión de memoria con ${allocatedGb} GB de Commit solicitado...`);
    log.push(`[SIM] RAM Física: ${ramPhysical} GB | Modo Pagefile: ${pagefileMode}`);
    log.push(`[SIM] Commit Limit calculado: ${commitLimit} GB`);

    if (committed > commitLimit) {
      status = 'CRASH_OOM';
      hardFaults = 1250;
      log.push(`[CRITICAL] ERROR 0x0000001A: COMMIT LIMIT EXCEEDED (${committed.toFixed(1)} GB / ${commitLimit} GB)`);
      log.push(`[CRITICAL] Windows no pudo otorgar memoria virtual. El proceso solicitante fue terminado (OOM).`);
    } else if (committed > ramPhysical) {
      status = 'WARNING';
      hardFaults = 480;
      log.push(`[WARN] Committed Memory (${committed.toFixed(1)} GB) supera la RAM física (${ramPhysical} GB).`);
      log.push(`[WARN] Páginas enviadas a C:\\pagefile.sys. Se detecta pico de Hard Page Faults (${hardFaults}/sec).`);
    } else {
      status = 'NORMAL';
      hardFaults = 12;
      log.push(`[OK] Asignación completada dentro de RAM física. Hard faults en rango óptimo (${hardFaults}/sec).`);
    }

    setTimeout(() => {
      setSimResults({
        commitLimit,
        committedMemory: parseFloat(committed.toFixed(1)),
        hardFaultsPerSec: hardFaults,
        status,
        log,
      });
      setIsRunningSim(false);
      onPracticeCompleted?.();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="text-xs font-mono text-slate-400 hover:text-blue-400 flex items-center gap-1.5 mb-2 transition-colors"
          >
            ← Volver a Investigaciones
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
            <Database className="w-4 h-4" />
            <span>LAB CANÓNICO // SECTOR 08</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 font-sans">
            MEMORY PRESSURE LAB
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Laboratorio de Simulación de Presión de Memoria, Paginación, Hard Faults y Commit Limit
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
          ENTORNO: <span className="text-blue-400 font-bold">16 GB DDR4-3200</span>
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Parámetros de Laboratorio</span>
          </h3>

          {/* Pagefile config */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block">
              Configuración de Archivo de Paginación (Pagefile)
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setPagefileMode('AUTO')}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                  pagefileMode === 'AUTO'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold">Administrado por el Sistema</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Commit Limit Dinámico (~32 GB)</div>
              </button>

              <button
                onClick={() => setPagefileMode('FIXED_SMALL')}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                  pagefileMode === 'FIXED_SMALL'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold">Pagefile Pequeño (2 GB)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Commit Limit Restringido (~18 GB)</div>
              </button>

              <button
                onClick={() => setPagefileMode('DISABLED')}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                  pagefileMode === 'DISABLED'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold">Pagefile Desactivado (Sin swap)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Commit Limit Fijo a RAM (16 GB)</div>
              </button>
            </div>
          </div>

          {/* RAM Allocation Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Solicitud Commit de Apps:</span>
              <span className="text-blue-400 font-bold">{allocatedGb} GB</span>
            </div>
            <input
              type="range"
              min={4}
              max={30}
              step={2}
              value={allocatedGb}
              onChange={(e) => setAllocatedGb(parseInt(e.target.value))}
              className="w-full accent-blue-500 bg-slate-950 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>4 GB</span>
              <span>16 GB (RAM)</span>
              <span>30 GB</span>
            </div>
          </div>

          {/* Action button */}
          <button
            disabled={isRunningSim}
            onClick={runPressureSimulation}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isRunningSim ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Ejecutar Presión de Memoria
          </button>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Telemetría de la Presión</span>
          </h3>

          {simResults ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">COMMIT LIMIT</span>
                  <span className="text-sm font-bold text-blue-400">{simResults.commitLimit} GB</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">COMMITTED</span>
                  <span className="text-sm font-bold text-slate-200">{simResults.committedMemory} GB</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">HARD FAULTS</span>
                  <span className={`text-sm font-bold ${
                    simResults.hardFaultsPerSec > 100 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{simResults.hardFaultsPerSec}/s</span>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                simResults.status === 'NORMAL'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : simResults.status === 'WARNING'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}>
                {simResults.status === 'NORMAL' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                {simResults.status === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                {simResults.status === 'CRASH_OOM' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}

                <div className="text-xs space-y-1">
                  <div className="font-bold uppercase tracking-wider font-mono">
                    {simResults.status === 'NORMAL' && 'SISTEMA ESTABLE // RAM FÍSICA ACEPTANDO CARGA'}
                    {simResults.status === 'WARNING' && 'PAGINACIÓN ACTIVA // SWAP A DISCO C: GENERANDO LATENCIA'}
                    {simResults.status === 'CRASH_OOM' && 'COLAPSO OUT OF MEMORY // COMMIT LIMIT EXCEDIDO'}
                  </div>
                  <p className="opacity-90 leading-relaxed">
                    {simResults.status === 'NORMAL' && 'Todas las páginas de memoria residen en RAM de alta velocidad. Rendimiento óptimo.'}
                    {simResults.status === 'WARNING' && 'El sistema superó la RAM física y utiliza el pagefile.sys. El juego o app experimentará micro-tirones por I/O de almacenamiento.'}
                    {simResults.status === 'CRASH_OOM' && 'Al no existir suficiente espacio de Commit en Pagefile ni RAM, Windows deniega la asignación. La aplicación se cerró abruptamente.'}
                  </p>
                </div>
              </div>

              {/* Console log */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-[11px] space-y-1 text-slate-400">
                {simResults.log.map((entry, idx) => (
                  <div key={idx} className={entry.includes('CRITICAL') ? 'text-rose-400' : entry.includes('WARN') ? 'text-amber-300' : ''}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-slate-500 bg-slate-950 rounded-lg border border-slate-800/60">
              Presiona "Ejecutar Presión de Memoria" para iniciar la simulación de paginación y prueba de colapso de Commit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
