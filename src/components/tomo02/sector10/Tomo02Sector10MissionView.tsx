import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  FileText,
  Activity,
  Layers,
  Database,
  Search,
} from 'lucide-react';

interface Tomo02Sector10MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector10MissionView: React.FC<Tomo02Sector10MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<'SYSTEM' | 'PROCESS' | 'SERVICES' | 'NETWORK' | 'STORAGE' | 'EVENTS'>('SYSTEM');
  const [psCommand, setPsCommand] = useState<string>('Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime');
  const [useWhatIf, setUseWhatIf] = useState<boolean>(true);
  const [consoleOutput, setConsoleOutput] = useState<{
    cmdlet: string;
    objectType: string;
    data: string;
    timestamp: string;
  }>({
    cmdlet: 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime',
    objectType: 'Microsoft.Management.Infrastructure.CimInstance#root/cimv2/Win32_OperatingSystem',
    data: `Caption            : Microsoft Windows 11 Pro
Version            : 10.0.22631
LastBootUpTime     : 06/10/2026 08:30:12 AM
CSName             : EVO-WORKSTATION-01
SystemDirectory    : C:\\Windows\\system32`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const handleSelectModule = (mod: 'SYSTEM' | 'PROCESS' | 'SERVICES' | 'NETWORK' | 'STORAGE' | 'EVENTS') => {
    setActiveModule(mod);
    let cmd = '';
    let objType = '';
    let resData = '';

    if (mod === 'SYSTEM') {
      cmd = 'Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime';
      objType = 'CimInstance#Win32_OperatingSystem';
      resData = `Caption            : Microsoft Windows 11 Pro
Version            : 10.0.22631
LastBootUpTime     : 06/10/2026 08:30:12 AM
Uptime(Days)       : 1.4 Days`;
    } else if (mod === 'PROCESS') {
      cmd = 'Get-Process | Where-Object WorkingSet64 -gt 100MB | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, Id, @{N="RAM(MB)";E={[math]::Round($_.WorkingSet64/1MB,1)}}';
      objType = 'PSCustomObject[] (Collection of Process Objects)';
      resData = `Name          Id RAM(MB)
----          -- -------
chrome      4328   345.1
explorer    2104   180.9
svchost     1044   112.4
dwmapi       892    48.2
powershell  6112    42.1`;
    } else if (mod === 'SERVICES') {
      cmd = 'Get-Service | Where-Object Status -eq "Running" | Select-Object -First 5 Name, DisplayName, StartType';
      objType = 'System.ServiceProcess.ServiceController[]';
      resData = `Name        DisplayName                           StartType
----        -----------                           ---------
wuauserv    Windows Update                        Automatic
WinDefend   Microsoft Defender Antivirus Service  Automatic
Dhcp        Cliente DHCP                          Automatic
Dnscache    Cliente DNS                           Automatic
EventLog    Registro de eventos de Windows        Automatic`;
    } else if (mod === 'NETWORK') {
      cmd = 'Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, InterfaceOperationalStatus';
      objType = 'Microsoft.Management.Infrastructure.CimInstance#MSFT_NetIPConfiguration';
      resData = `InterfaceAlias            IPv4Address     InterfaceOperationalStatus
--------------            -----------     --------------------------
Ethernet 1                192.168.1.105   Up
Wi-Fi                     192.168.1.120   Disconnected`;
    } else if (mod === 'STORAGE') {
      cmd = 'Get-Disk | Select-Object Number, FriendlyName, BusType, PartitionStyle, @{N="Size(GB)";E={[math]::Round($_.Size/1GB,1)}}';
      objType = 'Microsoft.Management.Infrastructure.CimInstance#MSFT_Disk';
      resData = `Number FriendlyName          BusType PartitionStyle Size(GB)
------ ------------          ------- -------------- --------
     0 Samsung SSD 980 PRO   NVMe    GPT               931.5
     1 Kingston DataTraveler USB     GPT                28.8`;
    } else if (mod === 'EVENTS') {
      cmd = 'Get-WinEvent -FilterHashtable @{LogName="System"; Level=2} -MaxEvents 3 | Select-Object TimeCreated, Id, ProviderName';
      objType = 'System.Diagnostics.Eventing.Reader.EventLogRecord[]';
      resData = `TimeCreated           Id ProviderName
-----------           -- ------------
06/10/2026 21:40:12 1001 BugCheck
06/10/2026 18:22:05 7001 Service Control Manager
06/10/2026 12:05:44 41   Kernel-Power`;
    }

    setPsCommand(cmd);
    setConsoleOutput({
      cmdlet: cmd,
      objectType: objType,
      data: resData,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const executeCustomPs = () => {
    let output = `[POWERSHELL OBJECT PIPELINE EXECUTION]
Comando: ${psCommand}
Tipo de Objeto Retornado: System.Management.Automation.PSCustomObject
Simulación Read-Only: ${useWhatIf ? '-WhatIf Mode Activo (0 Cambios reales)' : 'Lectura de telemetría pura'}

Resultado:
${consoleOutput.data}`;

    setConsoleOutput((prev) => ({ ...prev, data: output, timestamp: new Date().toLocaleTimeString() }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="text-xs font-mono text-slate-400 hover:text-blue-400 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Investigaciones
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
            <Terminal className="w-4 h-4" />
            <span>LAB CANÓNICO & PROYECTO // SECTOR 10</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            POWERSHELL FORENSIC CONSOLE & EVO WINDOWS TOOLKIT
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Plataforma pericial de consulta de objetos .NET, filtrado, proyección y auditoría con garantías Read-Only
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-blue-400">
          ENITORNO: <span className="font-bold text-slate-200">POWERSHELL 7.4 (NET 8.0)</span>
        </div>
      </div>

      {/* Toolkit Modules Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          MÓDULOS DE EVO WINDOWS TOOLKIT
        </span>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {(['SYSTEM', 'PROCESS', 'SERVICES', 'NETWORK', 'STORAGE', 'EVENTS'] as const).map((mod) => (
            <button
              key={mod}
              onClick={() => handleSelectModule(mod)}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                activeModule === mod
                  ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-lg shadow-blue-900/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              Módulo {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-[11px] ml-2">pwsh.exe — PowerShell Forensic Console</span>
          </div>

          <label className="flex items-center gap-1.5 text-[11px] text-blue-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useWhatIf}
              onChange={(e) => setUseWhatIf(e.target.checked)}
              className="accent-blue-500"
            />
            <span>-WhatIf Simulación</span>
          </label>
        </div>

        {/* Output Screen */}
        <div className="p-5 space-y-4 bg-black/90 max-h-[450px] overflow-y-auto leading-relaxed">
          <div className="text-blue-400 text-[11px]">
            PowerShell 7.4.1 — EVO Forensic Suite<br />
            Tipo de Objeto en Pipeline: <span className="text-slate-200 font-bold">{consoleOutput.objectType}</span><br />
            Marca de Tiempo: <span className="text-slate-400">{consoleOutput.timestamp}</span>
          </div>

          <div className="pt-2 border-t border-slate-900 space-y-2">
            <div className="text-slate-400 flex items-center gap-2">
              <span className="text-blue-400 font-bold">PS C:\EvoToolkit&gt;</span>
              <span className="text-slate-100">{consoleOutput.cmdlet}</span>
            </div>

            <pre className="p-3 bg-slate-950 rounded border border-slate-800/80 text-slate-200 font-mono text-[11px] whitespace-pre-wrap">
              {consoleOutput.data}
            </pre>
          </div>
        </div>

        {/* Command Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-blue-400 font-bold pl-2">PS&gt;</span>
          <input
            type="text"
            value={psCommand}
            onChange={(e) => setPsCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') executeCustomPs();
            }}
            placeholder="Escribe un cmdlet de consulta .NET..."
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs placeholder-slate-600"
          />
          <button
            onClick={executeCustomPs}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-blue-900/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Consultar Objeto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
