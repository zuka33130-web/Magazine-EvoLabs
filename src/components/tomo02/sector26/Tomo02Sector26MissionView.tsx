import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Cpu,
  Shield,
  Layers,
} from 'lucide-react';

interface Tomo02Sector26MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector26MissionView: React.FC<Tomo02Sector26MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeTab, setActiveTab] = useState<'ARCH_CHECK' | 'SHIMS_INSPECT' | 'DISM_NETFX'>('ARCH_CHECK');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const missions = [
    {
      id: 'ARCH_CHECK',
      title: '1. Diagnóstico de Arquitectura de S.O. y Procesos',
      description: 'Verifica si el sistema operativo y el proceso actual corren en entorno nativo x64.',
      psCommand: "[Environment]::Is64BitOperatingSystem; [Environment]::Is64BitProcess",
      output: `True
True

[EVO AUDIT]: Sistema Operativo de 64 bits nativo y proceso PowerShell en contexto x64.`,
    },
    {
      id: 'SHIMS_INSPECT',
      title: '2. Inspección de Banderas de Compatibilidad (Shims)',
      description: 'Consulta las aplicaciones con modos de compatibilidad y elevación UAC asignadas en el Registro.',
      psCommand: "Get-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers'",
      output: `C:\\Program Files\\LegacyApp\\app.exe : ~ WINXPSP3 RUNASADMIN
C:\\Games\\RetroGame\\game.exe      : ~ DISABLEDXMAXIMIZEDWINDOWEDMODE`,
    },
    {
      id: 'DISM_NETFX',
      title: '3. Verificación de Características Runtimes .NET 3.5',
      description: 'Consulta el estado de instalación de la biblioteca heredada .NET Framework 3.5 mediante DISM.',
      psCommand: "dism /online /get-featureinfo /featurename:NetFx3",
      output: `Deployment Image Servicing and Management tool
Version: 10.0.22621.1

Feature Name : NetFx3
Display Name : .NET Framework 3.5 (includes .NET 2.0 and 3.0)
State : Enabled`,
    },
  ];

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentMission = missions.find((m) => m.id === activeTab) || missions[0];

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          type="button"
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Lector de Investigación</span>
        </button>

        <div className="flex items-center gap-3 bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/30">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
              MISIONES PRÁCTICAS & CONSOLA // SECTOR 26
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Laboratorio de Auditoría de Compatibilidad & WOW64
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('ARCH_CHECK')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'ARCH_CHECK'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Arquitectura S.O.
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SHIMS_INSPECT')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'SHIMS_INSPECT'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Capas de Shims
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DISM_NETFX')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'DISM_NETFX'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Runtimes .NET 3.5
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-base font-bold text-slate-200">{currentMission.title}</h3>
            <p className="text-xs text-slate-400">{currentMission.description}</p>
          </div>

          <div className="rounded-2xl bg-[#030508] border border-cyan-500/30 overflow-hidden shadow-2xl font-mono">
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>PowerShell Console // Administrator</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(currentMission.psCommand, 0)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 0 ? 'Copiado' : 'Copiar Comando'}</span>
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="text-cyan-300 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">PS C:\Windows\System32&gt;</span>
                <span>{currentMission.psCommand}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">
                {currentMission.output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
