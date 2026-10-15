import React, { useState } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Key,
  Lock,
  UserCheck,
} from 'lucide-react';

interface Tomo02Sector21MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector21MissionView: React.FC<Tomo02Sector21MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'DEFENDER_STATUS' | 'FIREWALL_WFP' | 'UAC_LUA_POLICY' | 'ICACLS_NTFS_RESET'
  >('DEFENDER_STATUS');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, IsTamperProtected',
    targetComponent: 'Windows Defender Subsystem & Tamper Protection Guard',
    data: `AntivirusEnabled          : True
RealTimeProtectionEnabled : True
IsTamperProtected         : True
AntivirusSignatureAge     : 0 (Up-to-date)
BehaviorMonitorEnabled    : True
IoavProtectionEnabled     : True
AMSIEngineEnabled         : True`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const handleRunCommand = (moduleKey: typeof activeModule) => {
    setActiveModule(moduleKey);
    const ts = new Date().toLocaleTimeString();

    if (moduleKey === 'DEFENDER_STATUS') {
      setConsoleOutput({
        query: 'Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, IsTamperProtected',
        targetComponent: 'Windows Defender Subsystem & Tamper Protection Guard',
        data: `AntivirusEnabled          : True
RealTimeProtectionEnabled : True
IsTamperProtected         : True
AntivirusSignatureAge     : 0 (Up-to-date)
BehaviorMonitorEnabled    : True
IoavProtectionEnabled     : True
AMSIEngineEnabled         : True`,
        timestamp: ts,
      });
    } else if (moduleKey === 'FIREWALL_WFP') {
      setConsoleOutput({
        query: 'Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction',
        targetComponent: 'Windows Filtering Platform (WFP) Firewall Engine',
        data: `Name  Enabled DefaultInboundAction DefaultOutboundAction
----  ------- -------------------- ---------------------
Domain   True          BlockInbound          AllowOutbound
Private  True          BlockInbound          AllowOutbound
Public   True          BlockInbound          AllowOutbound`,
        timestamp: ts,
      });
    } else if (moduleKey === 'UAC_LUA_POLICY') {
      setConsoleOutput({
        query: 'Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" | Select-Object EnableLUA, ConsentPromptBehaviorAdmin',
        targetComponent: 'User Account Control (UAC) & LUA Architecture',
        data: `EnableLUA                  : 1 (Enabled - Filtered Dual Token)
ConsentPromptBehaviorAdmin : 5 (PromptForConsentOnSecureDesktop)
PromptOnSecureDesktop      : 1 (Active Isolation)`,
        timestamp: ts,
      });
    } else if (moduleKey === 'ICACLS_NTFS_RESET') {
      setConsoleOutput({
        query: 'icacls "C:\\Windows\\System32\\kernel32.dll"',
        targetComponent: 'NTFS DACL & TrustedInstaller Security Descriptor',
        data: `C:\\Windows\\System32\\kernel32.dll NT SERVICE\\TrustedInstaller:(F)
                                  NT AUTHORITY\\SYSTEM:(RX)
                                  BUILTIN\\Administrators:(RX)
                                  BUILTIN\\Users:(RX)

Successfully processed 1 files; Failed processing 0 files`,
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
            className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Lector // Sector 21</span>
          </button>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Misión Práctica: Auditoría de Seguridad y Permisos</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consola interactiva de verificación de Defender, WFP Firewall, UAC LUA y Descriptores de Seguridad NTFS
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            Módulos de Prueba Ejecutables
          </div>

          <button
            onClick={() => handleRunCommand('DEFENDER_STATUS')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'DEFENDER_STATUS'
                ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">1. Defender & Tamper Status</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Inspección WMI de la salud del motor de protección en tiempo real
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRunCommand('FIREWALL_WFP')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'FIREWALL_WFP'
                ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">2. WFP Firewall Profiles</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Verificación de políticas Inbound/Outbound en Domain, Private y Public
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRunCommand('UAC_LUA_POLICY')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'UAC_LUA_POLICY'
                ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">3. UAC LUA Architecture</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Lectura de claves HKLM de Dual Token y Escritorio Seguro
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRunCommand('ICACLS_NTFS_RESET')}
            className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-start gap-3 ${
              activeModule === 'ICACLS_NTFS_RESET'
                ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/5'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <Key className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">4. TrustedInstaller DACL</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Auditoría icacls del propietario y ACEs de archivos de System32
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
                <Terminal className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-bold">EVO Security Console v21.0</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>{consoleOutput.timestamp}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-5 font-mono text-xs space-y-4 flex-1 overflow-y-auto bg-slate-950 text-slate-300">
              <div>
                <span className="text-amber-400 font-bold">PS C:\Windows\System32&gt; </span>
                <span className="text-slate-100">{consoleOutput.query}</span>
              </div>
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded text-slate-400 text-[11px]">
                <span className="text-amber-400 font-bold">[Target Component]:</span> {consoleOutput.targetComponent}
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
