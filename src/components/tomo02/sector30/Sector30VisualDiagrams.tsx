import React, { useState } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  BarChart3,
  Clock,
  Layers,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Database,
  ArrowRight,
} from "lucide-react";

export const Sector30VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "PERF_COUNTERS_MATRIX" | "ETW_ARCHITECTURE" | "PRESENTMON_PIPELINE"
  >("PERF_COUNTERS_MATRIX");

  // Interactive slider for system load simulation in PerfMon
  const [systemLoad, setSystemLoad] = useState<number>(45);
  // Selected ETW component
  const [selectedEtwNode, setSelectedEtwNode] = useState<string>("BUFFERS");
  // Frame pacing scenario
  const [frameScenario, setFrameScenario] = useState<"NORMAL" | "CPU_STUTTER" | "GPU_BOUND" | "DWM_HITCH">("NORMAL");

  // Calculate dynamic metrics based on simulated load
  const cpuUser = Math.min(85, Math.round(systemLoad * 0.7));
  const cpuPrivileged = Math.min(95, Math.round(systemLoad * (systemLoad > 75 ? 0.65 : 0.15)));
  const diskLatencyMs = Math.round(1.5 + (systemLoad > 70 ? Math.pow((systemLoad - 65) / 5, 2) : systemLoad * 0.05));
  const commitChargePct = Math.min(98, Math.round(35 + systemLoad * 0.55));

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080B10] p-5 my-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Laboratorio Forense Visual: Métricas NT, ETW y PresentMon
          </h4>
        </div>
        <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("PERF_COUNTERS_MATRIX")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "PERF_COUNTERS_MATRIX"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            1. Matriz PerfMon & Cuellos de Botella
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ETW_ARCHITECTURE")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "ETW_ARCHITECTURE"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            2. Pipeline ETW & WPA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PRESENTMON_PIPELINE")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "PRESENTMON_PIPELINE"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3. Forense de Latencia PresentMon
          </button>
        </div>
      </div>

      {/* TAB 1: PERFMON MATRIX */}
      {activeTab === "PERF_COUNTERS_MATRIX" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Simulador de Carga de Subsistema (PerfMon Interactive Engine)
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ajusta el nivel de estrés del sistema para observar cómo reaccionan los contadores canónicos de NT.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <span className="text-xs font-mono text-zinc-400">{systemLoad}%</span>
              <input
                type="range"
                min="10"
                max="100"
                value={systemLoad}
                onChange={(e) => setSystemLoad(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-cyan-300">
                {systemLoad > 80 ? "Saturado" : systemLoad > 55 ? "Moderado" : "Óptimo"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* CPU User vs Privileged */}
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  % Privileged vs User
                </span>
                <span className={cpuPrivileged > 35 ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {cpuPrivileged > 35 ? "ALERTA KERNEL" : "NORMAL"}
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">% Privileged Time:</span>
                  <span className={cpuPrivileged > 35 ? "text-red-400 font-bold" : "text-zinc-300"}>
                    {cpuPrivileged}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cpuPrivileged > 35 ? "bg-red-500" : "bg-cyan-400"}`}
                    style={{ width: `${cpuPrivileged}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-500">% User Time:</span>
                  <span className="text-zinc-300">{cpuUser}%</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {cpuPrivileged > 35
                  ? "Cuello de botella en Ring 0: Exceso de llamadas al sistema, interrupciones de drivers o contención de bloqueos."
                  : "Uso de CPU dominado por espacio de usuario (cálculo normal de aplicaciones)."}
              </p>
            </div>

            {/* Disk Transfer Latency */}
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  Avg. Disk sec/Transfer
                </span>
                <span className={diskLatencyMs > 20 ? "text-red-400 font-bold" : "text-emerald-400"}>
                  {diskLatencyMs > 20 ? ">20ms CRÍTICO" : "<10ms NVMe"}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                <span className={diskLatencyMs > 20 ? "text-red-400" : "text-cyan-300"}>
                  {diskLatencyMs}
                </span>
                <span className="text-xs text-zinc-500">ms / I/O</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${diskLatencyMs > 20 ? "bg-red-500" : "bg-cyan-400"}`}
                  style={{ width: `${Math.min(100, diskLatencyMs * 3.5)}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {diskLatencyMs > 20
                  ? "Saturación de cola de almacenamiento: El disco es el cuello de botella absoluto del sistema."
                  : "Tiempos de respuesta excelentes típicos de SSDs PCIe NVMe bajo carga normal."}
              </p>
            </div>

            {/* Memory Commit Limit */}
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  % Committed Bytes
                </span>
                <span className={commitChargePct > 85 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                  {commitChargePct > 85 ? "OOM INMINENTE" : "ESTABLE"}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                <span className={commitChargePct > 85 ? "text-amber-400" : "text-cyan-300"}>
                  {commitChargePct}%
                </span>
                <span className="text-xs text-zinc-500">del Commit Limit</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${commitChargePct > 85 ? "bg-amber-400" : "bg-cyan-400"}`}
                  style={{ width: `${commitChargePct}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {commitChargePct > 85
                  ? "El espacio total de memoria virtual prometida se agota. Los programas fallarán con OutOfMemoryException aunque haya RAM libre."
                  : "Compromiso de memoria balanceado. Archivo de paginación y RAM física operando holgadamente."}
              </p>
            </div>

            {/* Diagnostics Rule */}
            <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Regla de Oro Forense
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "Nunca midas con el Administrador de Tareas cuando investigues problemas de milisegundos: su sondeo a 1Hz enmascara picos de I/O y ráfagas DPC."
                </p>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800 font-mono text-[10px] text-zinc-400">
                PerfMon: logman create counter WinPerf -si 00:00:01
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ETW ARCHITECTURE */}
      {activeTab === "ETW_ARCHITECTURE" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Arquitectura Interna del Bus ETW (Event Tracing for Windows)
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              ETW es el subsistema de rastreo de ultra-baja latencia integrado en el núcleo de NT. A diferencia del logging tradicional que realiza llamadas síncronas a disco, ETW escribe eventos directamente en buffers circulares en memoria no paginada utilizando operaciones atómicas lock-free, garantizando menos del 2% de overhead en producción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              {
                id: "PROVIDERS",
                title: "1. Event Providers",
                subtitle: "Kernel / User Drivers",
                desc: "Drivers (WFP, Storport, NDIS) y ejecutables llaman a EventWrite() para emitir telemetría con GUIDs únicos.",
                color: "border-blue-500/30 text-blue-400",
              },
              {
                id: "BUFFERS",
                title: "2. Lockless Ring Buffers",
                subtitle: "Memoria No Paginada",
                desc: "Buffers circulares asignados por CPU donde se graban eventos con timestamps QPC de resolución de nanosegundos.",
                color: "border-cyan-500/30 text-cyan-400",
              },
              {
                id: "SESSIONS",
                title: "3. Trace Sessions",
                subtitle: "NT Kernel Logger / Private",
                desc: "El controlador de traza (WPR o Logman) arbitra el vaciado de buffers hacia archivos .ETL o consumidores en tiempo real.",
                color: "border-emerald-500/30 text-emerald-400",
              },
              {
                id: "ANALYSIS",
                title: "4. Consumidor WPA",
                subtitle: "Windows Performance Analyzer",
                desc: "Decodifica los manifiestos de eventos, reconstruye call stacks y grafica líneas de tiempo de microsegundos.",
                color: "border-purple-500/30 text-purple-400",
              },
            ].map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedEtwNode(node.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedEtwNode === node.id
                    ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "bg-[#0A0E17] border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-mono font-bold ${node.color}`}>{node.title}</span>
                  {selectedEtwNode === node.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mb-2">{node.subtitle}</div>
                <p className="text-[11px] text-zinc-300 leading-snug">{node.desc}</p>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-cyan-500/30 font-mono text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">Comando Forense WPR:</span>
              <span className="text-zinc-300">wpr -start GeneralProfile -start CPU -filemode</span>
            </div>
            <span className="text-[10px] text-zinc-500">Captura eventos con sobrecarga mínima</span>
          </div>
        </div>
      )}

      {/* TAB 3: PRESENTMON PIPELINE */}
      {activeTab === "PRESENTMON_PIPELINE" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Diagnóstico de Stuttering Gráfico con PresentMon
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                PresentMon desacopla el trabajo de renderizado de la CPU, la GPU y la composición del DWM.
              </p>
            </div>
            <div className="flex rounded-lg bg-black p-1 border border-zinc-800 gap-1">
              {[
                { id: "NORMAL", label: "Cadencia Normal (16.6ms)" },
                { id: "CPU_STUTTER", label: "Hitch de CPU / Thread Hang" },
                { id: "GPU_BOUND", label: "Saturación GPU" },
                { id: "DWM_HITCH", label: "Desincronización DWM" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setFrameScenario(sc.id as any)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    frameScenario === sc.id
                      ? "bg-cyan-500 text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">CPU Frame Time</span>
                <span className={`text-base font-bold ${frameScenario === "CPU_STUTTER" ? "text-red-400" : "text-emerald-400"}`}>
                  {frameScenario === "CPU_STUTTER" ? "48.2 ms" : "11.4 ms"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">GPU Busy Time</span>
                <span className={`text-base font-bold ${frameScenario === "GPU_BOUND" ? "text-amber-400" : "text-cyan-300"}`}>
                  {frameScenario === "GPU_BOUND" ? "32.1 ms" : "13.2 ms"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Present to Display Latency</span>
                <span className={`text-base font-bold ${frameScenario === "DWM_HITCH" ? "text-red-400" : "text-white"}`}>
                  {frameScenario === "DWM_HITCH" ? "54.8 ms" : "16.6 ms"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">Diagnóstico Forense</span>
                <span className="text-[11px] font-bold text-cyan-300">
                  {frameScenario === "CPU_STUTTER"
                    ? "Bloqueo de hilo principal de juego"
                    : frameScenario === "GPU_BOUND"
                    ? "Cuello de shaders/relleno en GPU"
                    : frameScenario === "DWM_HITCH"
                    ? "Tirón de presentación en DWM"
                    : "Frame Pacing perfecto (60 FPS estables)"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
              <span className="text-cyan-400 font-bold">Interpretación Forense: </span>
              {frameScenario === "CPU_STUTTER" &&
                "El tiempo de CPU se disparó a 48ms mientras la GPU quedó esperando (GPU Wait > 30ms). Esto no es un problema gráfico; es compilación de shaders síncrona en CPU o recolección de basura del motor de juego."}
              {frameScenario === "GPU_BOUND" &&
                "La GPU está saturada al 100% renderizando pasadas pesadas de post-procesamiento. Bajar la resolución o reducir la calidad de oclusión ambiental aliviará el cuello de botella."}
              {frameScenario === "DWM_HITCH" &&
                "Tanto la CPU como la GPU entregaron el cuadro a tiempo, pero el Desktop Window Manager (DWM.exe) perdió la ventana de VSync debido a una ventana transparente superpuesta o captura de pantalla en curso."}
              {frameScenario === "NORMAL" &&
                "La cadencia de cuadros es regular y uniforme. No hay discordancia entre la cola de presentación de DirectX y el barrido del monitor."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
