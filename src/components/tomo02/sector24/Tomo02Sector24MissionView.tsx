import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Box,
  Cpu,
  Network,
  Server,
} from 'lucide-react';

interface Tomo02Sector24MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector24MissionView: React.FC<Tomo02Sector24MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'HYPERV_STATUS' | 'WSL_STATUS' | 'VSWITCH_AUDIT' | 'VHD_INSPECT'
  >('HYPERV_STATUS');

  const [copied, setCopied] = useState(false);

  const modules = {
    HYPERV_STATUS: {
      query: 'Get-VM | Select-Object Name, State, CpuUsage, MemoryAssigned, Uptime',
      targetComponent: 'Hyper-V Virtual Machine Management Service (vmms)',
      data: `Name       State   CpuUsage MemoryAssigned Uptime
----       -----   -------- -------------- ------
Win11_Dev  Running 2%       4294967296     02:14:10
Ubuntu_Srv Running 1%       2147483648     05:40:12
Test_Lab   Off     0%       0              00:00:00`,
    },
    WSL_STATUS: {
      query: 'wsl --list --verbose ; wsl --status',
      targetComponent: 'Windows Subsystem for Linux (WSL2 Architecture)',
      data: `  NAME      STATE   VERSION
* Ubuntu    Running 2
  docker-desktop Running 2

Default Distribution: Ubuntu
Default Version: 2
Linux kernel version: 5.15.153.1-microsoft-standard-WSL2`,
    },
    VSWITCH_AUDIT: {
      query: 'Get-VMSwitch | Select-Object Name, SwitchType, NetAdapterInterfaceDescription',
      targetComponent: 'Hyper-V Virtual Switch Module (vmswitch.sys)',
      data: `Name           SwitchType NetAdapterInterfaceDescription
----           ---------- ------------------------------
Default Switch Internal   Hyper-V Virtual Ethernet Adapter
BridgeLAN      External   Realtek PCIe GbE Family Controller`,
    },
    VHD_INSPECT: {
      query: 'Get-VHD -Path "C:\\Hyper-V\\Virtual Hard Disks\\Win11_Dev.vhdx"',
      targetComponent: 'Virtual Hard Disk Storage Provider (vhdmp.sys)',
      data: `ComputerName font-mono : LOCALHOST
Path                   : C:\\Hyper-V\\Virtual Hard Disks\\Win11_Dev.vhdx
VhdFormat              : VHDX
VhdType                : Dynamic
FileSize               : 24696061952 (23 GB)
Size                   : 107374182400 (100 GB)
BlockSize              : 33554432`,
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
              Consola Misión // Sector 24
            </div>
            <h1 className="text-lg font-bold text-slate-100">
              Laboratorio de Virtualización, Hipervisores y WSL2
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
            onClick={() => setActiveModule('HYPERV_STATUS')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'HYPERV_STATUS'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">1. Hyper-V Instances</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Estado de VMs y asignación de RAM</div>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('WSL_STATUS')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'WSL_STATUS'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">2. WSL2 Linux Subsystem</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Distribuciones y Kernel activo</div>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('VSWITCH_AUDIT')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'VSWITCH_AUDIT'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">3. Virtual Switches (vSwitch)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Auditoría de conmutadores de red</div>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('VHD_INSPECT')}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              activeModule === 'VHD_INSPECT'
                ? 'bg-cyan-950/40 border-cyan-500 text-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="font-mono text-xs font-bold">4. VHDX Disk Inspector</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Inspección de almacenamiento dinámico</div>
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
