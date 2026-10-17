import React, { useState } from 'react';
import {
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  Globe,
  Radio,
  HardDrive,
} from 'lucide-react';

interface Tomo02Sector22MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector22MissionView: React.FC<Tomo02Sector22MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'DIAGTRACK_STATUS' | 'GET_NET_TCP' | 'CONSENT_STORE_AUDIT' | 'SRUM_SRUDB'
  >('GET_NET_TCP');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'Get-NetTCPConnection -State Established | Select-Object LocalPort, RemoteAddress, RemotePort, OwningProcess, @{N="ProcessName";E={(Get-Process -Id $_.OwningProcess).ProcessName}}',
    targetComponent: 'TCP/IP Stack Socket Table & Process Correlator',
    data: `LocalPort RemoteAddress RemotePort OwningProcess ProcessName
--------- ------------- ---------- ------------- -----------
    51234 13.107.42.14         443          4128 chrome
    51238 20.189.173.8         443          8912 msedge
    51240 52.182.143.21        443          2104 OneDrive
    51244 142.250.190.46       443          4128 chrome`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const handleRunCommand = (moduleKey: typeof activeModule) => {
    setActiveModule(moduleKey);
    const ts = new Date().toLocaleTimeString();

    if (moduleKey === 'DIAGTRACK_STATUS') {
      setConsoleOutput({
        query: 'Get-Service DiagTrack | Select-Object Name, Status, StartType',
        targetComponent: 'Connected User Experiences and Telemetry Service',
        data: `Name      Status StartType
----      ------ ---------
DiagTrack Running Automatic`,
        timestamp: ts,
      });
    } else if (moduleKey === 'GET_NET_TCP') {
      setConsoleOutput({
        query: 'Get-NetTCPConnection -State Established | Select-Object LocalPort, RemoteAddress, RemotePort, OwningProcess, @{N="ProcessName";E={(Get-Process -Id $_.OwningProcess).ProcessName}}',
        targetComponent: 'TCP/IP Stack Socket Table & Process Correlator',
        data: `LocalPort RemoteAddress RemotePort OwningProcess ProcessName
--------- ------------- ---------- ------------- -----------
    51234 13.107.42.14         443          4128 chrome
    51238 20.189.173.8         443          8912 msedge
    51240 52.182.143.21        443          2104 OneDrive
    51244 142.250.190.46       443          4128 chrome`,
        timestamp: ts,
      });
    } else if (moduleKey === 'CONSENT_STORE_AUDIT') {
      setConsoleOutput({
        query: 'Get-ChildItem "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam"',
        targetComponent: 'CapabilityAccessManager Registry ConsentStore',
        data: `Hive: HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam

Name                           Property
----                           --------
NonPackaged                    Value : Allow
Microsoft.WindowsCamera_8wekyb Value : Allow`,
        timestamp: ts,
      });
    } else if (moduleKey === 'SRUM_SRUDB') {
      setConsoleOutput({
        query: 'Get-Item "C:\\Windows\\System32\\SRU\\SRUDB.dat" | Select-Object Name, Length, LastWriteTime',
        targetComponent: 'System Resource Usage Monitor (SRUM) ESE Database',
        data: `Name      Length    LastWriteTime
----      ------    -------------
SRUDB.dat 34603008 10/14/2026 06:45:12 AM`,
        timestamp: ts,
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(consoleOutput.query);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToReader}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Lector // Sector 22</span>
          </button>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-400" />
            <span>Misión Práctica: Lab Communication Map & Privacy Audit</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consola interactiva de auditoría de sockets de red, DiagTrack, ConsentStore y base de datos SRUDB.dat
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            Módulos de Auditoría Ejecutables
          </div>

          <button
            onClick={() => handleRunCommand('GET_NET_TCP')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'GET_NET_TCP'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">1. Active Sockets & PIDs</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Trazabilidad Get-NetTCPConnection de puertos remotos a procesos
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRunCommand('DIAGTRACK_STATUS')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'DIAGTRACK_STATUS'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Radio className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">2. DiagTrack Service Status</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inspección del servicio central de telemetría y experiencias
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRunCommand('CONSENT_STORE_AUDIT')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'CONSENT_STORE_AUDIT'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Eye className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">3. ConsentStore Registry</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Auditoría de permisos de cámara y micrófono por ejecutable
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRunCommand('SRUM_SRUDB')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'SRUM_SRUDB'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">4. SRUDB.dat Forensics</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inspección de la base de datos ESE de registro contable de red SRUM
              </div>
            </div>
          </button>
        </div>

        {/* Console Terminal */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[460px]">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 font-bold">EVO Privacy Console v22.0</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>{consoleOutput.timestamp}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-5 font-mono text-xs space-y-4 flex-1 overflow-y-auto bg-slate-950 text-slate-300">
              <div>
                <span className="text-cyan-400 font-bold">PS C:\Windows\System32&gt; </span>
                <span className="text-slate-100">{consoleOutput.query}</span>
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded text-slate-400 text-[11px]">
                <span className="text-cyan-400 font-bold">[Target Component]:</span> {consoleOutput.targetComponent}
              </div>
              <pre className="text-emerald-400 leading-relaxed font-mono whitespace-pre-wrap bg-black/40 p-4 rounded-lg border border-slate-900">
                {consoleOutput.data}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
