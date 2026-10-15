import React, { useState } from "react";
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  AlertOctagon,
  Shield,
  FileCode,
  Activity,
} from "lucide-react";

interface Tomo02Sector28MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector28MissionView: React.FC<Tomo02Sector28MissionViewProps> = ({
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
      title: "Misión #1: Aprovisionamiento de Crash Dump y Símbolos Oficiales",
      objective: "Configurar el sistema operativo para generar volcados completos y apuntar a los servidores de símbolos de Microsoft.",
      commands: [
        "wmic recoveros set DebugInfoType = 3, AutoReboot = False",
        "[Environment]::SetEnvironmentVariable('_NT_SYMBOL_PATH', 'srv*C:\\Symbols*https://msdl.microsoft.com/download/symbols', 'Machine')",
        "Get-CimInstance Win32_OSRecoveryConfiguration | Select-Object DebugInfoType, AutoReboot, CrashDumpSetting",
      ],
      description: "Esta secuencia desactiva el reinicio automático tras una BSOD (permitiendo visualizar el Stop Code) y garantiza la descarga automática de archivos .PDB para WinDbg.",
      expectedResult: "DebugInfoType = 3 (Minidump habilitado) y variable de entorno _NT_SYMBOL_PATH registrada en el registro de la máquina.",
    },
    {
      id: 2,
      title: "Misión #2: Triangulación Forense Event ID 1001 vs Event ID 41",
      objective: "Determinar matemáticamente si el último reinicio forzado fue por fallo eléctrico o por BugCheck de kernel.",
      commands: [
        "Get-WinEvent -FilterHashtable @{LogName='System'; Id=@(41, 1001)} -MaxEvents 4 | Format-List TimeCreated, Id, Message",
        `wevtutil qe System /q:"*[System[(EventID=1001)]]" /c:1 /rd:true /f:text`,
      ],
      description: "Compara las marcas de tiempo entre la queja del sistema al arrancar (Kernel-Power 41) y el volcado de ntoskrnl (BugCheck 1001).",
      expectedResult: "Si existe Evento 1001 en el mismo segundo previo al 41, se extraen Stop Code y los 4 parámetros de memoria.",
    },
    {
      id: 3,
      title: "Misión #3: Análisis Simbólico de Minidump en WinDbg",
      objective: "Abrir el volcado binario y reconstruir la pila de ejecución para aislar al driver infractor.",
      commands: [
        "windbgx -z C:\\Windows\\Minidump\\*.dmp",
        "!analyze -v",
        "kv",
        "!irql",
      ],
      description: "Ejecución del pipeline heurístico de depuración: !analyze -v busca el BUCKET_ID, kv lista los marcos de la pila y !irql reporta el estado del procesador en el crash.",
      expectedResult: "Identificación del STACK_TEXT revelando el driver de terceros que originó la desreferencia inválida.",
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
              <span>SECTOR 28: BSOD</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-cyan-400" />
              <span>BSOD Crash Forensics Lab Bench</span>
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
