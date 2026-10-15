import React, { useState } from "react";
import {
  Activity,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Shield,
  Layers,
} from "lucide-react";

interface Tomo02Sector29MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector29MissionView: React.FC<Tomo02Sector29MissionViewProps> = ({
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
      title: "Misión #1: Auditoría DPC de Tiempo Real con Contadores del Kernel",
      objective: "Medir las tasas de interrupción de hardware y porcentaje de tiempo DPC a nivel de subprocesador.",
      commands: [
        `typeperf "\\Processor Information(_Total)\\Interrupts/sec" -sc 5`,
        `typeperf "\\Processor Information(_Total)\\% DPC Time" -sc 5`,
        "Get-Counter -Counter '\Processor Information(*)\% DPC Time' | Select-Object -ExpandProperty CounterSamples | Format-Table InstanceName, CookedValue",
      ],
      description: "Esta prueba aísla si algún núcleo lógico de la CPU está sobrepasando el 2% de tiempo acumulado en DISPATCH_LEVEL.",
      expectedResult: "% DPC Time inferior al 1.5% en todos los núcleos; picos superiores al 5% identifican el núcleo estrangulado.",
    },
    {
      id: 2,
      title: "Misión #2: Diagnóstico de Congelamientos de Almacenamiento y Hard Page Faults",
      objective: "Verificar si los tirones coinciden con páginas leídas físicamente de disco o timeouts de la controladora SATA/NVMe.",
      commands: [
        `typeperf "\\PhysicalDisk(_Total)\\Avg. Disk sec/Transfer" -sc 5`,
        `typeperf "\\Memory\\Pages/sec" -sc 5`,
        "Get-WinEvent -LogName System | Where-Object { $_.ProviderName -match 'storahci|stornvme|disk' -and $_.Id -eq 129 }",
      ],
      description: "Supervisa la latencia de respuesta del bus de almacenamiento en milisegundos y busca eventos de reinicio de bus (Reset to device).",
      expectedResult: "Avg. Disk sec/Transfer < 0.005 (5 ms). Cero eventos 129 de reset de controladora.",
    },
    {
      id: 3,
      title: "Misión #3: Captura de Traza ETW Quirúrgica con Windows Performance Recorder",
      objective: "Instrumentar el kernel para capturar un archivo .ETL circular durante el segundo exacto en que ocurre el micro-stuttering.",
      commands: [
        "wpr -start GeneralProfile -start Audio -filemode",
        "echo [Reproducir el micro-stuttering durante 10 segundos]",
        "wpr -stop C:\\Temp\\StutterTrace.etl",
        "wpr -status",
      ],
      description: "Registra cambios de contexto de hilos, llamadas a funciones de drivers y transiciones de DPC con resolución de microsegundos.",
      expectedResult: "Archivo StutterTrace.etl generado listo para abrir en WPA (Windows Performance Analyzer) e inspeccionar el gráfico DPC/ISR Execution.",
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
              <span>SECTOR 29: DPC / ISR / STUTTERING</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Stutter & DPC Latency Investigation Lab</span>
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          Volver a Investigaciones
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Mission selector tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {missions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMission(m.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                selectedMission === m.id
                  ? "bg-cyan-950/30 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  : "bg-[#080B10] border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                FASE FORENSE #{m.id}
              </div>
              <div className="text-xs font-bold text-white font-mono">{m.title}</div>
            </button>
          ))}
        </div>

        {/* Selected Mission Card */}
        <div className="rounded-2xl bg-[#080B10] border border-cyan-500/30 p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
              <Shield className="w-4 h-4" />
              Objetivo Forense
            </div>
            <h2 className="text-lg font-bold text-white font-mono">{current.title}</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">{current.objective}</p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold block">
              Comandos de Ejecución Forense:
            </span>
            <div className="space-y-2">
              {current.commands.map((cmd, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-cyan-500 font-bold select-none">&gt;</span>
                    <span className="text-cyan-200 truncate">{cmd}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(cmd)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    {copiedCmd === cmd ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold block">
                Mecánica Técnica:
              </span>
              <p className="text-zinc-400 leading-relaxed">{current.description}</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block">
                Resultado Esperado en Consola:
              </span>
              <p className="text-emerald-300/90 leading-relaxed font-mono text-[11px]">
                {current.expectedResult}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
