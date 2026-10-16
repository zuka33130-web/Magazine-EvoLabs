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
} from 'lucide-react';

interface Tomo02Sector05MissionViewProps {
  onPracticeCompleted?: () => void;
  onBack: () => void;
}

export const Tomo02Sector05MissionView: React.FC<Tomo02Sector05MissionViewProps> = ({ onBack, onPracticeCompleted }) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simTimeSeconds, setSimTimeSeconds] = useState<number>(0);
  const [logs, setLogs] = useState<
    {
      timestamp: string;
      cpu: string;
      ram: string;
      disk: string;
      net: string;
      event: string;
      type: 'NORMAL' | 'SOSPECHOSO' | 'REQUERIDO_EVIDENCIA';
    }[]
  >([]);
  const [isReportReady, setIsReportReady] = useState<boolean>(false);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimTimeSeconds(0);
    setLogs([]);
    setIsReportReady(false);

    const simulationSteps = [
      {
        timestamp: '00:00:15',
        cpu: '1.2%',
        ram: '4.2 GB',
        disk: '0.1 MB/s',
        net: '0 KB/s',
        event: 'Usuario inactivo. Detección de estado Idle.',
        type: 'NORMAL' as const,
      },
      {
        timestamp: '00:02:30',
        cpu: '18.4%',
        ram: '4.5 GB',
        disk: '24.5 MB/s',
        net: '12 KB/s',
        event: 'Activación de Mantenimiento Automático: TiWorker.exe / MsMpEng.exe escaneando sectores.',
        type: 'NORMAL' as const,
      },
      {
        timestamp: '00:05:00',
        cpu: '28.0%',
        ram: '4.8 GB',
        disk: '85.2 MB/s',
        net: '0 KB/s',
        event: 'Comando TRIM en SSD (defrag.exe / retrim) iniciado en background.',
        type: 'NORMAL' as const,
      },
      {
        timestamp: '00:07:45',
        cpu: '12.1%',
        ram: '4.6 GB',
        disk: '2.1 MB/s',
        net: '340 KB/s',
        event: 'Cliente Cloud Sync (OneDrive) verificando hashes de archivos modificados.',
        type: 'NORMAL' as const,
      },
      {
        timestamp: '00:10:00',
        cpu: '0.8%',
        ram: '4.1 GB',
        disk: '0.0 MB/s',
        net: '0 KB/s',
        event: 'Mantenimiento finalizado exitosamente. Retorno a estado de reposo baseline.',
        type: 'NORMAL' as const,
      },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < simulationSteps.length) {
        const step = simulationSteps[currentStep];
        setLogs((prev) => [...prev, step]);
        setSimTimeSeconds((currentStep + 1) * 120);
        currentStep += 1;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setIsReportReady(true);
        onPracticeCompleted?.();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#60CDFF] tracking-wider uppercase block">
              LABORATORIO CANÓNICO // SECTOR 05
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              IDLE ACTIVITY WATCH (MONITOREO DE ACTIVIDAD EN REPOSO)
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Registro pericial de métricas de CPU, RAM, Disco y Red durante 10 minutos simulados de inactividad de usuario.
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

        {/* Methodology Card */}
        <div className="p-4 rounded-xl bg-[#0D121C] border border-sky-500/20 font-mono text-xs space-y-2">
          <span className="text-[#60CDFF] font-bold block uppercase">
            METODOLOGÍA PERICIAL EVO LABS:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 rounded bg-black/40 border border-zinc-800 text-zinc-300">1. OBSERVAR</div>
            <div className="p-2 rounded bg-black/40 border border-zinc-800 text-zinc-300">2. IDENTIFICAR</div>
            <div className="p-2 rounded bg-black/40 border border-zinc-800 text-zinc-300">3. CORRELACIONAR</div>
            <div className="p-2 rounded bg-black/40 border border-zinc-800 text-emerald-400 font-bold">
              4. NO CONCLUIR SIN EVIDENCIA
            </div>
          </div>
        </div>

        {/* Control & Live Simulation Monitor */}
        <div className="p-5 rounded-2xl bg-[#080B10] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#60CDFF]" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                MONITOR DE REPOSO (IDLE SIMULATOR)
              </span>
            </div>

            <button
              type="button"
              disabled={isSimulating}
              onClick={handleStartSimulation}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${isSimulating ? 'bg-zinc-800 text-zinc-500' : 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_15px_rgba(0,164,239,0.3)] hover:brightness-110'}`}
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'REGISTRANDO...' : 'INICIAR REGISTRO DE 10 MIN'}</span>
            </button>
          </div>

          {/* Log Stream */}
          <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 font-mono text-xs space-y-2 min-h-[180px]">
            {logs.length === 0 ? (
              <p className="text-zinc-600 italic">Haz clic en &quot;INICIAR REGISTRO DE 10 MIN&quot; para iniciar la recolección de telemetría.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded bg-[#0D121B] border border-zinc-800/80 text-[11px] animate-fadeIn">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-[#60CDFF]" />
                    <span className="text-white font-bold">[{log.timestamp}]</span>
                    <span className="text-zinc-300">{log.event}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-400 self-end sm:self-auto">
                    <span>CPU: <strong className="text-sky-300">{log.cpu}</strong></span>
                    <span>RAM: <strong className="text-sky-300">{log.ram}</strong></span>
                    <span>DISC: <strong className="text-amber-300">{log.disk}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Generated Report Card */}
        {isReportReady && (
          <div className="p-5 rounded-2xl bg-[#090D14] border border-emerald-500/40 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs uppercase">
              <ShieldCheck className="w-5 h-5" />
              <span>IDLE ACTIVITY REPORT EVO // EMISIÓN CONCLUYENTE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0D131F] border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px]">EVENTOS ANALIZADOS</span>
                <p className="text-white font-bold text-sm">{logs.length} FASES</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0D131F] border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px]">ANOMALÍAS DE SEGURIDAD</span>
                <p className="text-emerald-400 font-bold text-sm">0 ANOMALÍAS</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0D131F] border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px]">VERDICTO PERICIAL</span>
                <p className="text-[#60CDFF] font-bold text-sm">NORMAL IDLE BEHAVIOR</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              El análisis concluye que toda la actividad observada en segundo plano responde a subsistemas legítimos del Mantenimiento Automático de Windows (TiWorker, Defender, TRIM y Cloud Sync), los cuales liberan recursos de forma inmediata ante cualquier evento de entrada de usuario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
