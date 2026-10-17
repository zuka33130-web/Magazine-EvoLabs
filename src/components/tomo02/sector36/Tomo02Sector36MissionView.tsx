import React, { useState } from "react";
import {
  Cpu,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Activity,
  Terminal,
  HardDrive,
  Database,
  TrendingUp,
} from "lucide-react";

interface Tomo02Sector36MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector36MissionView: React.FC<Tomo02Sector36MissionViewProps> = ({
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
      title: "Misión 1: Diagnóstico Forense de la Saturación de Disco al 100%",
      badge: "AUDITORÍA DE I/O",
      difficulty: "Intermedio",
      description:
        "Determina de forma cuantitativa si el almacenamiento C: está saturado por IOPS aleatorias o si presenta sectores reasignados con latencia destructiva.",
      steps: [
        {
          step: 1,
          label: "Medir tiempo de respuesta y longitud de cola",
          cmd: "typeperf \"\\PhysicalDisk(_Total)\\Avg. Disk sec/Transfer\" \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" -sc 5",
          explanation: "Obtiene la latencia física por transferencia en segundos y el número de peticiones esperando en cola.",
        },
        {
          step: 2,
          label: "Filtrar procesos con mayor consumo de I/O en disco",
          cmd: "Get-Process | Sort-Object ReadOperationCount -Descending | Select-Object -First 5 ProcessName, ReadOperationCount, WriteOperationCount",
          explanation: "Identifica qué binario exacto está generando el bombardeo de lecturas sobre el almacenamiento.",
        },
        {
          step: 3,
          label: "Verificar eventos de advertencia física del controlador",
          cmd: "wevtutil qe System /q:\"*[System[Provider[@Name='disk'] and (Level=2 or Level=3)]]\" /c:3 /rd:true /f:text",
          explanation: "Comprueba si existen eventos 7 u 11 que señalen bloques defectuosos en el disco.",
        },
      ],
    },
    {
      id: 2,
      title: "Misión 2: Detección y Aislamiento de Thermal Throttling de CPU",
      badge: "AUDITORÍA TÉRMICA",
      difficulty: "Avanzado",
      description:
        "Comprueba si el procesador se encuentra limitado por frecuencia de reloj debido a sobrecalentamiento o falla de ventilación.",
      steps: [
        {
          step: 1,
          label: "Comparar velocidad actual de reloj con la nominal",
          cmd: "wmic cpu get currentclockspeed,maxclockspeed",
          explanation: "Si CurrentClockSpeed está en 798 u 800 MHz mientras MaxClockSpeed supera los 2.5 GHz, hay estrangulamiento activo.",
        },
        {
          step: 2,
          label: "Leer sensores de temperatura ACPI de la placa base",
          cmd: "Get-CimInstance -Namespace root/wmi -ClassName MSAcpi_ThermalZoneTemperature | ForEach-Object { [PSCustomObject]@{ Zona=$_.InstanceName; TempC=($_.CurrentTemperature - 2732)/10 } }",
          explanation: "Convierte las lecturas de temperatura WMI en grados Celsius para verificar si superan los 85°C o 95°C.",
        },
        {
          step: 3,
          label: "Restaurar el esquema de energía estándar balanceado",
          cmd: "powercfg /restoredefaultschemes",
          explanation: "Elimina planes de energía corruptos que impiden a la CPU escalar sus multiplicadores Turbo.",
        },
      ],
    },
    {
      id: 3,
      title: "Misión 3: Generación del Informe de Decisión de Hardware (ROI)",
      badge: "ANÁLISIS DE HARDWARE",
      difficulty: "Experto (Auditoría Integral)",
      description:
        "Extrae la topología completa de canales de memoria, tipo de unidad de almacenamiento y estado de núcleos para emitir el dictamen pericial de actualización.",
      steps: [
        {
          step: 1,
          label: "Verificar población de canales de memoria (Single vs Dual)",
          cmd: "wmic memorychip get banklabel,capacity,devicelocator,speed",
          explanation: "Comprueba cuántos zócalos de memoria física están ocupados y a qué frecuencia operan.",
        },
        {
          step: 2,
          label: "Identificar medio físico y velocidad de rotación",
          cmd: "Get-PhysicalDisk | Select-Object FriendlyName, MediaType, SpindleSpeed, Size",
          explanation: "Determina sin abrir la máquina si el disco principal es un HDD de 5400 RPM o un SSD SATA/NVMe.",
        },
        {
          step: 3,
          label: "Comprobar el estado de compresión Compact OS en discos pequeños",
          cmd: "compact.exe /compactos:query",
          explanation: "Indica si Windows tiene habilitada la compresión binaria para mitigar falta de espacio en SSDs pequeños.",
        },
      ],
    },
  ];

  const currentMission = missions.find((m) => m.id === selectedMission) || missions[0];

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-xs">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToReader}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                LABORATORIO PRÁCTICO · SECTOR 36
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              Slow PC Diagnostic Engine & Decision Matrix Bench
            </h2>
          </div>
        </div>

        {/* Mission selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {missions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMission(m.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedMission === m.id
                  ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              Misión {m.id}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Details */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080B10] border border-cyan-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                {currentMission.badge}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 text-[11px]">Nivel: {currentMission.difficulty}</span>
            </div>
            <h3 className="text-base font-bold text-white uppercase">{currentMission.title}</h3>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed">{currentMission.description}</p>

        {/* Steps */}
        <div className="space-y-4">
          <span className="text-white font-bold uppercase text-[11px] block tracking-wider">
            Protocolo de Ejecución Paso a Paso:
          </span>
          <div className="space-y-3">
            {currentMission.steps.map((s) => (
              <div
                key={s.step}
                className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/20 space-y-2 relative group hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-xs">
                    PASO {s.step}: {s.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(s.cmd)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                  >
                    {copiedCmd === s.cmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Comando</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/80 border border-zinc-800 text-cyan-300 font-mono text-xs overflow-x-auto">
                  <code>{s.cmd}</code>
                </div>
                <p className="text-[11px] text-zinc-400">{s.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Directives */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start gap-3">
          <Shield className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold uppercase block mb-1">Directiva Forense EVO:</span>
            <p className="text-xs leading-relaxed text-amber-200/90">
              Nunca dictamines un reemplazo de placa madre o procesador antes de descartar pasta térmica seca
              (Thermal Throttling) y latencia destructiva de almacenamiento mecánico. El 90% de las computadoras
              lentas se transforman en máquinas ágiles con un simple SSD de calidad y mantenimiento térmico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
