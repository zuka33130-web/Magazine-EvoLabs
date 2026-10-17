import React, { useState } from "react";
import {
  Activity,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Shield,
  Layers,
  Terminal,
} from "lucide-react";

interface Tomo02Sector31MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector31MissionView: React.FC<Tomo02Sector31MissionViewProps> = ({
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
      title: "Misión #1: Auditoría de Árbol de svchost.exe y Procesos Huérfanos",
      objective: "Identificar si existe alguna instancia de svchost.exe cuyo proceso padre no sea services.exe (PID legítimo).",
      commands: [
        `Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'svchost.exe' } | Select-Object ProcessId, ParentProcessId, CommandLine | Format-Table -AutoSize`,
        `Get-Process -Id (Get-CimInstance Win32_Process -Filter "Name='services.exe'").ProcessId`,
        `procexp.exe /s`,
      ],
      description: "En un sistema íntegro, el 100% de los svchost.exe deben reportar como ParentProcessId el PID de services.exe en Session 0.",
      expectedResult: "Todas las instancias de svchost.exe dependen de services.exe. Cero instancias huérfanas.",
    },
    {
      id: 2,
      title: "Misión #2: Captura Quirúrgica de Fallos de Acceso con ProcMon",
      objective: "Registrar exclusivamente las operaciones que devuelvan ACCESS DENIED o FILE NOT FOUND en un archivo .PML desatendido.",
      commands: [
        `procmon.exe /Quiet /Minimized /BackingFile "C:\\PerfLogs\\TraceAccess.pml"`,
        `echo [Reproducir la operación bloqueada o la app que falla]`,
        `procmon.exe /Terminate`,
        `Get-Item "C:\\PerfLogs\\TraceAccess.pml" | Select-Object Name, Length`,
      ],
      description: "Utiliza el minifiltro de Process Monitor para capturar telemetría en disco sin agotar la memoria RAM física.",
      expectedResult: "Archivo TraceAccess.pml generado listo para abrir con filtros 'Result is ACCESS DENIED' e identificar la clave o archivo culpable.",
    },
    {
      id: 3,
      title: "Misión #3: Auditoría Criptográfica de Persistencia con Autoruns",
      objective: "Escanear más de 120 puntos de inicio de Windows y exportar únicamente aquellos binarios sin firma digital de Microsoft.",
      commands: [
        `autorunsc.exe -a * -m -c -h > "C:\\PerfLogs\\autoruns_unsigned.csv"`,
        `Import-Csv "C:\\PerfLogs\\autoruns_unsigned.csv" | Where-Object { $_.Publisher -notmatch "Microsoft" -and $_.Verified -ne "(Verified)" } | Format-Table -Property Entry, ImagePath, Publisher`,
      ],
      description: "autorunsc ejecuta en modo consola sin interfaz gráfica y calcula hashes SHA256 de cada DLL o ejecutable de inicio.",
      expectedResult: "Inventario consolidado en CSV con verificación de certificados digitales y estado de firma Authenticode.",
    },
  ];

  const current = missions.find((m) => m.id === selectedMission) || missions[0];

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 font-sans flex flex-col">
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
              <span>Sector 31: Sysinternals Diagnostics Bench</span>
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

      <main className="max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
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
              Fundamento y Metodología:
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">{current.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Secuencia de Comandos en Consola Elevada:
              </span>
              <span className="text-[10px] font-mono text-zinc-500">PowerShell 7 / Sysinternals Suite</span>
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

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Shield className="w-4 h-4" />
              <span>Criterio de Aprobación Forense</span>
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
