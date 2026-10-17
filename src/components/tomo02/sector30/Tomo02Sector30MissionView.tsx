import React, { useState } from "react";
import {
  Activity,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Shield,
  Layers,
  Cpu,
  HardDrive,
  BarChart3,
  FileText,
  Clock,
  Terminal,
} from "lucide-react";

interface Tomo02Sector30MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector30MissionView: React.FC<Tomo02Sector30MissionViewProps> = ({
  onBackToReader,
}) => {
  const [selectedMission, setSelectedMission] = useState<number>(1);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const missions = [
    {
      id: 1,
      title: "Misión #1: Data Collector Set Desatendido con Logman",
      objective: "Crear y ejecutar una sesión de contadores nativos en segundo plano sin la sobrecarga visual de PerfMon GUI.",
      commands: [
        `logman create counter WinForensics -f bin -si 00:00:01 -o "C:\\PerfLogs\\ForensicsTrace.blg" -c "\\Processor Information(_Total)\\% Processor Time" "\\Processor Information(_Total)\\% Privileged Time" "\\Memory\\Available MBytes" "\\Memory\\Pool Nonpaged Bytes" "\\PhysicalDisk(_Total)\\Avg. Disk sec/Transfer"`,
        `logman start WinForensics`,
        `echo [Ejecutar la carga de trabajo o reproducir el incidente durante 60 segundos]`,
        `logman stop WinForensics`,
        `relog "C:\\PerfLogs\\ForensicsTrace.blg" -f csv -o "C:\\PerfLogs\\ForensicsReport.csv"`,
      ],
      description: "Genera una recolección binaria (.BLG) a 1Hz de muestreo de alta precisión. La conversión a CSV permite auditar percentiles 99 (p99) de latencia y saturación de kernel.",
      expectedResult: "Archivo .BLG y .CSV generados. % Privileged Time promedio < 15%, y Avg. Disk sec/Transfer < 0.015 (15 ms).",
    },
    {
      id: 2,
      title: "Misión #2: Captura Forense de Traza ETW Quirúrgica con WPR",
      objective: "Instrumentar el kernel de Windows para grabar llamadas a funciones, cambios de contexto de hilos y DPCs con resolución de nanosegundos.",
      commands: [
        `wpr -start GeneralProfile -start CPU -filemode`,
        `typeperf "\\Processor Information(_Total)\\% Processor Time" -sc 5`,
        `echo [Reproducir la anomalía o el freeze del sistema]`,
        `wpr -stop "C:\\PerfLogs\\SystemFreezeTrace.etl"`,
        `wpr -status`,
      ],
      description: "Windows Performance Recorder activa los proveedores del kernel de NT en modo circular en memoria no paginada. Al detener la sesión, vuelca la traza completa con símbolos para abrir en WPA.",
      expectedResult: "Archivo SystemFreezeTrace.etl exportado. Abre en WPA y despliega el gráfico 'CPU Usage (Sampled)' y 'Computation (Thread by Process)' para aislar la función exacta causante.",
    },
    {
      id: 3,
      title: "Misión #3: Aislamiento de Stuttering de Frame Pacing con PresentMon",
      objective: "Auditar la latencia de presentación de DirectX/Vulkan y desacoplar el tiempo de CPU, GPU y composición de DWM.",
      commands: [
        `PresentMon.exe -process_name game.exe -output_file "C:\\PerfLogs\\FramePacing.csv" -timed 30`,
        `Get-Content "C:\\PerfLogs\\FramePacing.csv" -Head 10`,
        `Get-Counter -Counter "\\GPU Engine(*engtype_3D*)\\Utilization Percentage" | Select-Object -ExpandProperty CounterSamples | Format-Table InstanceName, CookedValue`,
      ],
      description: "Mide el tiempo exacto que transcurre desde que el hilo de juego llama a IDXGISwapChain::Present() hasta que el frame se muestra físicamente en el panel del monitor.",
      expectedResult: "Diferencia consistente entre MsBetweenPresents y MsUntilDisplayed. Varianza de frame pacing < 2 ms para 60Hz/144Hz libres de micro-stuttering.",
    },
  ];

  const current = missions.find((m) => m.id === selectedMission) || missions[0];

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToReader}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              <span>NIVEL IV // DIAGNOSTICAR WINDOWS</span>
              <span>•</span>
              <span>LABORATORIO PRÁCTICO</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Sector 30: Windows Performance Forensics Bench</span>
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase font-mono transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          Volver a Investigaciones
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        {/* Mission selector pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {missions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMission(m.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedMission === m.id
                  ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                  : "bg-[#080B10] border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-1">
                <Terminal className="w-4 h-4" />
                <span>MISIÓN {m.id}</span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{m.title}</h3>
            </button>
          ))}
        </div>

        {/* Selected Mission Card */}
        <div className="p-6 rounded-2xl bg-[#080B10] border border-cyan-500/30 space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase mb-1">
              <Zap className="w-4 h-4" />
              <span>Objetivo de la Misión Forense</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{current.title}</h2>
            <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{current.objective}</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase block">
              Fundamento de Kernel & Metodología:
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">{current.description}</p>
          </div>

          {/* Commands block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Secuencia de Comandos en Consola Elevada:
              </span>
              <span className="text-[10px] font-mono text-zinc-500">PowerShell 7 / CMD Admin</span>
            </div>

            <div className="space-y-2">
              {current.commands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-black border border-cyan-500/20 flex items-center justify-between gap-3 font-mono text-xs group hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-cyan-300 select-all overflow-x-auto whitespace-pre-wrap">
                    {cmd}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(cmd)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copiar comando"
                  >
                    {copiedCmd === cmd ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Results */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Shield className="w-4 h-4" />
              <span>Criterio de Aprobación Forense (Resultado Esperado)</span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed font-mono">
              {current.expectedResult}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
