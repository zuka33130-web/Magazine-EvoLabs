import React, { useState } from "react";
import {
  HardDrive,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Shield,
  Activity,
  Terminal,
} from "lucide-react";

interface Tomo02Sector33MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector33MissionView: React.FC<Tomo02Sector33MissionViewProps> = ({
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
      title: "Misión #1: Radiografía de la MFT y Clusters con fsutil",
      objective: "Inspeccionar los metadatos internos del volumen C:, tamaño de cluster, registro MFT y estado de holgura.",
      commands: [
        `fsutil fsinfo ntfsinfo C:`,
        `fsutil file layout C:\\Windows\\notepad.exe`,
        `fsutil dirty query C:`,
      ],
      description: "Examina los registros maestros de NTFS. Permite verificar si la partición tiene sectores dañados anotados en $BadClust o si el volumen requiere comprobación chkdsk.",
      expectedResult: "Reporte de 1024 bytes por registro MFT, 4096 bytes por cluster y confirmación de que el volumen C: no está sucio (clean).",
    },
    {
      id: 2,
      title: "Misión #2: Detección y Purga de Flujos Alternativos (ADS) Ocultos",
      objective: "Escanear una carpeta de descargas para identificar streams :Zone.Identifier:$DATA y desbloquear archivos masivamente.",
      commands: [
        `cmd.exe /c "dir /R C:\\Users\\Public\\Downloads"`,
        `Get-Item -Path "C:\\Users\\Public\\Downloads\\*" -Stream * | Select-Object FileName, Stream, Length`,
        `Unblock-File -Path "C:\\Users\\Public\\Downloads\\*"`,
      ],
      description: "Los navegadores web adjuntan metadatos de zona a cada archivo descargado. La purga del stream Zone.Identifier retira la advertencia de SmartScreen.",
      expectedResult: "Identificación de los flujos secundarios y posterior confirmación de que los archivos quedan limpios con un solo flujo de datos principal.",
    },
    {
      id: 3,
      title: "Misión #3: Creación y Verificación de Hard Links en Tiempo Real",
      objective: "Comprobar matemáticamente que dos Hard Links comparten el mismo registro MFT y ocupan exactamente cero bytes adicionales de disco.",
      commands: [
        `fsutil hardlink list C:\\Windows\\System32\\notepad.exe`,
        `cmd.exe /c "mklink /H C:\\Temp\\notepad_enlace.exe C:\\Windows\\System32\\notepad.exe"`,
        `fsutil file layout C:\\Temp\\notepad_enlace.exe`,
      ],
      description: "Crea una entrada de directorio vinculada al mismo registro MFT físico. Al modificar uno, el cambio se refleja en ambos sin duplicar espacio en el SSD.",
      expectedResult: "Ambas rutas reportan los mismos clusters LCN y el mismo número de secuencia MFT.",
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
              <span>NIVEL V // DESMANTELAR WINDOWS</span>
              <span>•</span>
              <span>LABORATORIO PRÁCTICO</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>Sector 33: NTFS Forensics & Filesystem Bench</span>
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
