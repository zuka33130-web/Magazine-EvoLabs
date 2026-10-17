import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Clock,
  Shield,
  HardDrive,
  Globe,
} from 'lucide-react';

interface Tomo02Sector23MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector23MissionView: React.FC<Tomo02Sector23MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'MAINTENANCE_STATUS' | 'DEFENDER_IDLE' | 'TRIM_SSD_VERIFY' | 'NCSI_PROBING'
  >('MAINTENANCE_STATUS');

  const [copied, setCopied] = useState(false);

  const modules = {
    MAINTENANCE_STATUS: {
      query: 'Get-ScheduledTask -TaskName "Automatic Maintenance" | Get-ScheduledTaskInfo',
      targetComponent: 'Task Scheduler Engine & Automatic Maintenance',
      data: `LastRunTime        : 14/10/2026 02:00:15
LastTaskResult     : 0
NextRunTime        : 15/10/2026 02:00:00
NumberOfMissedRuns : 0
TaskName           : Automatic Maintenance
TaskPath           : \\Microsoft\\Windows\\TaskScheduler\\
State              : Ready`,
    },
    DEFENDER_IDLE: {
      query: 'Get-MpPreference | Select-Object ScanAvgCPULoadFactor, ScanScheduleTime, DisableScanningNetworkFiles',
      targetComponent: 'Windows Defender Scheduled Scan Engine',
      data: `ScanAvgCPULoadFactor         : 50
ScanScheduleTime             : 02:00:00
DisableScanningNetworkFiles : True`,
    },
    TRIM_SSD_VERIFY: {
      query: 'fsutil behavior query DisableDeleteNotify ; Optimize-Volume -DriveLetter C -ReTrim -Verbose',
      targetComponent: 'NTFS File System & NVMe/AHCI Storage Controller',
      data: `NTFS DisableDeleteNotify = 0  (TRIM is ENABLED)
ReTrim on C: 100% complete.
Volume C: (NVMe SSD) re-trimmed successfully in 1.42 seconds.`,
    },
    NCSI_PROBING: {
      query: 'Get-NetConnectionProfile ; Test-NetConnection -ComputerName msftconnecttest.com -Port 80',
      targetComponent: 'Network Location Awareness (NLA) & NCSI Active Probing',
      data: `Name             : Red Doméstica 5G
InterfaceAlias   : Wi-Fi
IPv4Address      : 192.168.1.45
NetworkCategory  : Private
IPv4Connectivity : Internet

ComputerName     : msftconnecttest.com
RemoteAddress    : 13.107.42.14
TcpTestSucceeded : True`,
    },
  };

  const current = modules[activeModule];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToReader}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Consola Misión // Sector 23
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Laboratorio de Auditoría de Procesos e Inactividad
            </h1>
          </div>
        </div>

        <button
          onClick={onBackToReader}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-xl font-bold transition-all"
        >
          Volver a Investigaciones
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <button
            onClick={() => setActiveModule('MAINTENANCE_STATUS')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'MAINTENANCE_STATUS'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">1. Automatic Maintenance</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Estado del Programador de Tareas</div>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('DEFENDER_IDLE')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'DEFENDER_IDLE'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">2. Defender Idle Config</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Cuota de CPU y Escaneos Programados</div>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('TRIM_SSD_VERIFY')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'TRIM_SSD_VERIFY'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">3. TRIM & SSD ReTrim</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Verificación de descarte NAND</div>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('NCSI_PROBING')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'NCSI_PROBING'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">4. NCSI Active Probe</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sondeo de conectividad msftconnecttest</div>
            </div>
          </button>
        </div>

        {/* Terminal Screen */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>{current.targetComponent}</span>
            </div>
            <button
              onClick={() => handleCopy(current.query)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded-lg flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copiado' : 'Copiar Comando'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
            <span className="text-slate-500">PS C:\Windows\system32&gt; </span>
            {current.query}
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
            {current.data}
          </div>
        </div>
      </div>
    </div>
  );
};
