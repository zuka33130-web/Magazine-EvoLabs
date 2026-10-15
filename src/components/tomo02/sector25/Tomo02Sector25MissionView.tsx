import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Monitor,
  Shield,
  Network,
  Lock,
} from 'lucide-react';

interface Tomo02Sector25MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector25MissionView: React.FC<Tomo02Sector25MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeTab, setActiveTab] = useState<'RDP_STATUS' | 'NLA_CONFIG' | 'FIREWALL_RULES'>('RDP_STATUS');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const missions = [
    {
      id: 'RDP_STATUS',
      title: '1. Diagnóstico de Servicio TermService & Sesiones RDP',
      description: 'Consulta el estado del servicio Terminal Services y las sesiones activas en el equipo.',
      psCommand: "Get-Service TermService | Select-Object Name, Status, StartType; qwinsta",
      output: `Status   Name        DisplayName
------   ----        -----------
Running  TermService Remote Desktop Services

 SESSIONNAME       USERNAME              ID  STATE   TYPE        DEVICE
>services                                 0  Disc
 rdp-tcp#0         Administrador          1  Active  rdpwd`,
    },
    {
      id: 'NLA_CONFIG',
      title: '2. Verificación de Autenticación NLA (CredSSP)',
      description: 'Valida si el servidor RDP exige NLA previa antes de instanciar la interfaz gráfica.',
      psCommand: "(Get-WmiObject -class \"Win32_TSGeneralSetting\" -Namespace \"root\\cimv2\\terminalservices\" -Filter \"TerminalName='RDP-tcp'\").UserAuthenticationRequired",
      output: `1

[EVO AUDIT]: UserAuthenticationRequired = 1 (NLA Requerido - Máxima Postura de Seguridad).`,
    },
    {
      id: 'FIREWALL_RULES',
      title: '3. Auditoría de Reglas Firewall para el Puerto 3389',
      description: 'Muestra si el puerto RDP (3389 TCP/UDP) está autorizado en Windows Defender Firewall.',
      psCommand: "Get-NetFirewallRule -DisplayGroup 'Remote Desktop' | Select-Object Name, Enabled, Profile",
      output: `Name                             Enabled Profile
----                             ------- -------
RemoteDesktop-UserMode-In-TCP       True Private, Domain
RemoteDesktop-UserMode-In-UDP       True Private, Domain
RemoteDesktop-Shadow-In-TCP        False Any`,
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
            <Monitor className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest block">
              MISIONES PRÁCTICAS & CONSOLA // SECTOR 25
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Laboratorio de Auditoría RDP, NLA y Firewall
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('RDP_STATUS')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'RDP_STATUS'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Estado RDP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('NLA_CONFIG')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'NLA_CONFIG'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Autenticación NLA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('FIREWALL_RULES')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'FIREWALL_RULES'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Firewall 3389
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
