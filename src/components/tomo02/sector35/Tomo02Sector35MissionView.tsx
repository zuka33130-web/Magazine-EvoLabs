import React, { useState } from "react";
import {
  Zap,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Activity,
  Terminal,
  Layers,
  Database,
  Sliders,
} from "lucide-react";

interface Tomo02Sector35MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector35MissionView: React.FC<Tomo02Sector35MissionViewProps> = ({
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
      title: "Misión 1: Auditoría de Huella Parasitaria de Servicios y Tareas",
      badge: "AUDITORÍA DE PROCESOS",
      difficulty: "Intermedio",
      description:
        "Rastrea y enumera todos los servicios en segundo plano y tareas programadas instaladas por utilitarios que corren fuera del espacio oficial de Microsoft.",
      steps: [
        {
          step: 1,
          label: "Filtrar servicios de terceros en ejecución",
          cmd: "Get-Service | Where-Object { $_.Status -eq 'Running' -and $_.DisplayName -notmatch 'Windows|Microsoft' } | Select-Object Name, DisplayName",
          explanation: "Expone los daemons persistentes del SCM registrados por suites comerciales.",
        },
        {
          step: 2,
          label: "Auditar tareas del Programador de Tareas",
          cmd: "Get-ScheduledTask | Where-Object { $_.TaskPath -notmatch '\\\\Microsoft\\\\' -and $_.State -ne 'Disabled' } | Select-Object TaskName, TaskPath",
          explanation: "Identifica tareas periódicas de telemetría o escaneo publicitario.",
        },
        {
          step: 3,
          label: "Inspeccionar las ramas de inicio automático (ASEPs)",
          cmd: "Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location | Format-Table -AutoSize",
          explanation: "Revela ejecutables auxiliares que se inyectan en el login del usuario.",
        },
      ],
    },
    {
      id: 2,
      title: "Misión 2: Diagnóstico y Restauración de la Pila de Red TCP/IP",
      badge: "RESTAURACIÓN WINSOCK",
      difficulty: "Avanzado",
      description:
        "Detecta modificaciones nocivas en los buffers de TCP y restaura la configuración nativa del catálogo Winsock y del Autotuning.",
      steps: [
        {
          step: 1,
          label: "Inspeccionar el estado global de TCP",
          cmd: "netsh int tcp show global",
          explanation: "Comprueba si el nivel de autotuning fue deshabilitado por un 'acelerador de internet'.",
        },
        {
          step: 2,
          label: "Restaurar el autotuning a nivel normal",
          cmd: "netsh int tcp set global autotuninglevel=normal",
          explanation: "Habilita la escala dinámica de ventana TCP (hasta 16 MB) para máxima velocidad de descarga.",
        },
        {
          step: 3,
          label: "Restablecer el catálogo de Winsock",
          cmd: "netsh winsock reset",
          explanation: "Purga filtros de paquetes huérfanos que impiden el tráfico de red tras desinstalar software.",
        },
      ],
    },
    {
      id: 3,
      title: "Misión 3: Protocolo de Purga y Eliminación de Controladores Residuales",
      badge: "PURGA FORENSE",
      difficulty: "Experto (Modifica Estado)",
      description:
        "Elimina servicios zombi y controladores en Ring 0 que los desinstaladores de optimizadores dejan abandonados en el sistema.",
      steps: [
        {
          step: 1,
          label: "Listar controladores que no pertenecen a Microsoft",
          cmd: "driverquery /v /fo TABLE | findstr /i /v \"Microsoft\"",
          explanation: "Verifica qué archivos .sys cargados en memoria corresponden a herramientas utilitarias.",
        },
        {
          step: 2,
          label: "Eliminar servicio de monitoreo huérfano",
          cmd: "sc delete \"LiveUpdateSvc\"",
          explanation: "Desregistra de forma atómica y permanente el servicio del Service Control Manager.",
        },
        {
          step: 3,
          label: "Restaurar el plan de energía balanceado oficial",
          cmd: "powercfg /restoredefaultschemes",
          explanation: "Elimina planes de energía corruptos creados por 'Game Boosters' que impiden el reposo de la CPU.",
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
                LABORATORIO PRÁCTICO · SECTOR 35
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              Software Footprint & Anti-Booster Bench
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
              Tras restablecer Winsock o borrar servicios huérfanos, reinicia siempre la computadora.
              La memoria del kernel consolidará la liberación de controladores y la pila de red volverá
              a operar con la latencia mínima garantizada por los drivers certificados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
