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
  Database,
  Layers,
  Code,
} from 'lucide-react';

interface Tomo02Sector11MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector11MissionView: React.FC<Tomo02Sector11MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<'HIVELIST' | 'CURRENT_CONTROL_SET' | 'SERVICES' | 'RUN_KEYS' | 'POLICIES' | 'CONTEXT_MENU'>('HIVELIST');
  const [regCommand, setRegCommand] = useState<string>('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\hivelist"');
  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetHive: string;
    data: string;
    timestamp: string;
  }>({
    query: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\hivelist"',
    targetHive: 'HKLM\\SYSTEM (hivelist)',
    data: `HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\hivelist
    \\REGISTRY\\MACHINE\\HARDWARE    REG_SZ    
    \\REGISTRY\\MACHINE\\SYSTEM      REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SYSTEM
    \\REGISTRY\\MACHINE\\SOFTWARE    REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SOFTWARE
    \\REGISTRY\\MACHINE\\SECURITY    REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SECURITY
    \\REGISTRY\\MACHINE\\SAM         REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SAM
    \\REGISTRY\\USER\\.DEFAULT       REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\DEFAULT`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const handleSelectModule = (mod: 'HIVELIST' | 'CURRENT_CONTROL_SET' | 'SERVICES' | 'RUN_KEYS' | 'POLICIES' | 'CONTEXT_MENU') => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'HIVELIST') {
      cmd = 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\hivelist"';
      target = 'HKLM\\SYSTEM (hivelist)';
      resData = `HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\hivelist
    \\REGISTRY\\MACHINE\\SYSTEM      REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SYSTEM
    \\REGISTRY\\MACHINE\\SOFTWARE    REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SOFTWARE
    \\REGISTRY\\MACHINE\\SECURITY    REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SECURITY
    \\REGISTRY\\MACHINE\\SAM         REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SAM
    \\REGISTRY\\USER\\.DEFAULT       REG_SZ    \\Device\\HarddiskVolume3\\Windows\\System32\\config\\DEFAULT`;
    } else if (mod === 'CURRENT_CONTROL_SET') {
      cmd = 'reg query "HKLM\\SYSTEM\\Select"';
      target = 'HKLM\\SYSTEM\\Select';
      resData = `HKEY_LOCAL_MACHINE\\SYSTEM\\Select
    Current         REG_DWORD    0x1
    Default         REG_DWORD    0x1
    Failed          REG_DWORD    0x0
    LastKnownGood   REG_DWORD    0x2`;
    } else if (mod === 'SERVICES') {
      cmd = 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv" /v "Start"';
      target = 'HKLM\\SYSTEM\\CurrentControlSet\\Services\\wuauserv';
      resData = `HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\wuauserv
    Start    REG_DWORD    0x2 (Automatic)
    ImagePath REG_EXPAND_SZ %systemroot%\\system32\\svchost.exe -k netsvcs -p
    DisplayName REG_SZ Windows Update`;
    } else if (mod === 'RUN_KEYS') {
      cmd = 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"';
      target = 'HKCU\\...\\Run';
      resData = `HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
    OneDrive    REG_SZ    "C:\\Users\\EvoUser\\AppData\\Local\\Microsoft\\OneDrive\\OneDrive.exe" /background
    SecurityHealth REG_EXPAND_SZ %windir%\\system32\\SecurityHealthSystray.exe`;
    } else if (mod === 'POLICIES') {
      cmd = 'reg query "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /s';
      target = 'HKLM\\SOFTWARE\\Policies';
      resData = `HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate
    (Default)    REG_SZ    (value not set)
    SetDisableUXWUAccess    REG_DWORD    0x0
    DoNotConnectToWindowsUpdateInternetLocations    REG_DWORD    0x0`;
    } else if (mod === 'CONTEXT_MENU') {
      cmd = 'reg query "HKCR\\Directory\\Background\\shell\\EvoConsole" /s';
      target = 'HKCR\\Directory\\Background\\shell\\EvoConsole';
      resData = `HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\EvoConsole
    (Default)    REG_SZ    EVO Forensics Terminal
    Icon         REG_SZ    imageres.dll,-5324

HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\EvoConsole\\command
    (Default)    REG_SZ    powershell.exe -NoExit -Command "Write-Host 'EVO LABS // SHELL INITIALIZED' -ForegroundColor Cyan"`;
    }

    setRegCommand(cmd);
    setConsoleOutput({
      query: cmd,
      targetHive: target,
      data: resData,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const executeCustomReg = () => {
    let output = '';
    const cleanCmd = regCommand.trim().toLowerCase();

    if (cleanCmd.includes('hivelist')) {
      output = `\\REGISTRY\\MACHINE\\SYSTEM  REG_SZ  \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SYSTEM
\\REGISTRY\\MACHINE\\SOFTWARE  REG_SZ  \\Device\\HarddiskVolume3\\Windows\\System32\\config\\SOFTWARE`;
    } else if (cleanCmd.includes('hidefileext')) {
      output = `HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced
    HideFileExt    REG_DWORD    0x0 (Extensiones Visibles)`;
    } else if (cleanCmd.includes('add') || cleanCmd.includes('delete')) {
      output = `[SIMULADOR SECTOR 11] Operación analizada con seguridad.
Sintaxis atómica verificada. Reversibilidad garantizada por EVO LABS.`;
    } else {
      output = `HKEY_LOCAL_MACHINE\\... [CONSULTA FORENSE EJECUTADA]
Operación completada correctamente bajo estándares de solo lectura.`;
    }

    setConsoleOutput((prev) => ({ ...prev, query: regCommand, data: output, timestamp: new Date().toLocaleTimeString() }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Investigaciones
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Terminal className="w-4 h-4" />
            <span>LAB CANÓNICO & PROYECTO // SECTOR 11</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            REGISTRY FORENSIC SANDBOX & ARTEFACT LAB
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulador seguro de colmenas del kernel, inyección de menús contextuales y consultas atómicas reg.exe
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400">
          ENTORNO: <span className="font-bold text-slate-200">REG.EXE 10.0 / READ-ONLY</span>
        </div>
      </div>

      {/* Toolkit Modules Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
          COLMENAS Y REGISTROS DE AUDITORÍA
        </span>
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {(['HIVELIST', 'CURRENT_CONTROL_SET', 'SERVICES', 'RUN_KEYS', 'POLICIES', 'CONTEXT_MENU'] as const).map((mod) => (
            <button
              key={mod}
              onClick={() => handleSelectModule(mod)}
              className={`px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                activeModule === mod
                  ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              Módulo {mod.replace('_', ' ')}
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
            <span className="text-slate-400 text-[11px] ml-2">cmd.exe (reg.exe) — Registry Forensic Sandbox</span>
          </div>
          <span className="text-[11px] text-cyan-400 font-bold">MODO SEGURO // READ-ONLY</span>
        </div>

        {/* Output Screen */}
        <div className="p-5 space-y-4 bg-black/90 max-h-[450px] overflow-y-auto leading-relaxed">
          <div className="text-cyan-400 text-[11px]">
            EVO Registry Engine 11.0 — Forensic Triage Suite<br />
            Rama Objetivo: <span className="text-slate-200 font-bold">{consoleOutput.targetHive}</span><br />
            Timestamp: <span className="text-slate-400">{consoleOutput.timestamp}</span>
          </div>

          <div className="pt-2 border-t border-slate-900 space-y-2">
            <div className="text-slate-400 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">C:\&gt;</span>
              <span className="text-slate-100">{consoleOutput.query}</span>
            </div>

            <pre className="p-3 bg-slate-950 rounded border border-slate-800/80 text-slate-200 font-mono text-[11px] whitespace-pre-wrap">
              {consoleOutput.data}
            </pre>
          </div>
        </div>

        {/* Command Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-cyan-400 font-bold pl-2">CMD&gt;</span>
          <input
            type="text"
            value={regCommand}
            onChange={(e) => setRegCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') executeCustomReg();
            }}
            placeholder="Escribe un comando reg query..."
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs placeholder-slate-600"
          />
          <button
            onClick={executeCustomReg}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-cyan-900/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Consultar Rama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
