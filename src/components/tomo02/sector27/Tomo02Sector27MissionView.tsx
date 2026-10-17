import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Wrench,
  Shield,
  RefreshCw,
} from 'lucide-react';

interface Tomo02Sector27MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector27MissionView: React.FC<Tomo02Sector27MissionViewProps> = ({
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
      title: 'Misión #1: Reparación en Cadena SFC y DISM',
      objective: 'Reparar archivos corruptos en C:\\Windows\\System32 recuperando manifiestos limpios.',
      commands: [
        'sfc /scannow',
        'DISM /Online /Cleanup-Image /RestoreHealth',
        'sfc /scannow',
      ],
      description: 'Esta secuencia resuelve la corrupción persistente asegurando que el almacén WinSxS esté sano antes de restaurar las DLLs de sistema.',
    },
    {
      id: 2,
      title: 'Misión #2: Reconstrucción de Bootloader EFI en WinRE',
      objective: 'Solucionar el error INACCESSIBLE_BOOT_DEVICE en UEFI regenerando la BCD.',
      commands: [
        'reagentc /info',
        'diskpart',
        'list volume',
        'bcdboot C:\\Windows /s S: /f UEFI',
      ],
      description: 'Asigna letra de unidad a la partición EFI FAT32 y reinstala la configuración BCD limpia desde la carpeta C:\\Windows.',
    },
    {
      id: 3,
      title: 'Misión #3: Auditoría con Visor de Eventos y Reliability',
      objective: 'Filtrar volcados BugCheck e IDs 41 / 1001 / 55.',
      commands: [
        'perfmon /rel',
        'wevtutil qe System /q:"*[System[(EventID=41 or EventID=1001)]]" /c:5 /f:text',
      ],
      description: 'Aísla las fallas de alimentación e interrupciones físicas sin alterar los archivos de registro.',
    },
  ];

  const currentMission = missions.find((m) => m.id === selectedMission) || missions[0];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-[#080B10] p-4 rounded-xl border border-cyan-500/30">
        <button
          type="button"
          onClick={onBackToReader}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-400 font-bold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Temario Sector 27</span>
        </button>
        <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest hidden sm:inline">
          MISIONES PRÁCTICAS & CONSOLA // SECTOR 27
        </span>
      </div>

      {/* Mission selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {missions.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedMission(m.id)}
            className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
              selectedMission === m.id
                ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-[#05070A] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">
              OPERA EN CONSOLA
            </span>
            <p className="font-bold text-sm text-zinc-100">{m.title}</p>
          </button>
        ))}
      </div>

      {/* Mission Detail */}
      <div className="p-6 rounded-2xl bg-[#080B10] border border-cyan-500/30 space-y-5">
        <div>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block">
            Objetivo Táctico
          </span>
          <h2 className="text-base font-bold text-white mt-1">{currentMission.objective}</h2>
          <p className="text-zinc-400 font-sans mt-2">{currentMission.description}</p>
        </div>

        <div className="space-y-3">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider block">
            Comandos de Consola Aprobados:
          </span>
          {currentMission.commands.map((cmd) => (
            <div
              key={cmd}
              className="p-3 rounded-xl bg-[#020305] border border-cyan-500/20 flex items-center justify-between gap-3 text-cyan-300 font-mono"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="select-all font-bold">{cmd}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(cmd)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Copiar comando"
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
    </div>
  );
};
