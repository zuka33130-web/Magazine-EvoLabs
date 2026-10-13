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
} from 'lucide-react';

interface Tomo02Sector09MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector09MissionView: React.FC<Tomo02Sector09MissionViewProps> = ({
  onBackToReader,
}) => {
  const [commandInput, setCommandInput] = useState<string>('evo-diag.cmd');
  const [activeMenuOption, setActiveMenuOption] = useState<string | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<
    { command: string; output: string; timestamp: string; risk: string }[]
  >([
    {
      command: 'evo-diag.cmd',
      output: `=====================================================
         EVO CMD DIAGNOSTIC MENU v2.0
=====================================================
[1] Sistema     (systeminfo + whoami)
[2] Red         (ipconfig + netstat)
[3] Procesos    (tasklist /v)
[4] Drivers     (driverquery)
[5] Disco       (chkdsk C: audit)
[6] Temp & Logs (dir %TEMP%)
[7] Salir
=====================================================
Seleccione una opción [1-7]: _`,
      timestamp: new Date().toLocaleTimeString(),
      risk: 'SAFE_READONLY',
    },
  ]);

  const executeCommand = (cmdToRun: string) => {
    const cmdClean = cmdToRun.trim().toLowerCase();
    let outputText = '';
    let risk = 'SAFE_READONLY';

    if (cmdClean === '1' || cmdClean.includes('systeminfo')) {
      outputText = `[SYSTEMINFO SUMMARY]
OS Name:                   Microsoft Windows 11 Pro
OS Version:                10.0.22631 N/A Build 22631
System Manufacturer:       EVO LABS Workstation
BIOS Version:              UEFI 2.40 (10/01/2026)
Total Physical Memory:     16,384 MB
Available Physical Memory: 9,210 MB
Hotfix(s):                 4 KB(s) Installed [KB5034123]

[WHOAMI /PRIV]
Privilege Name                Description                          State   
============================= ==================================== ========
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled 
SeSecurityPrivilege           Manage auditing and security log     Enabled 
SeShutdownPrivilege           Shut down the system                 Disabled`;
    } else if (cmdClean === '2' || cmdClean.includes('ipconfig') || cmdClean.includes('netstat')) {
      outputText = `[IPCONFIG /ALL]
Ethernet adapter Ethernet 1:
   IPv4 Address. . . . . . . . . . . : 192.168.1.105(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 1.1.1.1, 8.8.8.8

[NETSTAT -ANO ACTIVE SOCKETS]
  Proto  Local Address          Foreign Address        State           PID
  TCP    192.168.1.105:49678    142.250.190.46:443     ESTABLISHED     4328
  TCP    192.168.1.105:50112    1.1.1.1:53             ESTABLISHED     1044
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING       892`;
    } else if (cmdClean === '3' || cmdClean.includes('tasklist')) {
      outputText = `[TASKLIST /V - TOP MEMORY PROCESSES]
Image Name                   PID Session Name        Mem Usage Status     
========================= ====== ================ ============ ============
chrome.exe                  4328 Console             345,120 K Running   
svchost.exe                 1044 Services            112,400 K Running   
dwmapi.exe                   892 Console              48,210 K Running   
explorer.exe                2104 Console             180,900 K Running   
cmd.exe                     6112 Console               4,120 K Running`;
    } else if (cmdClean === '4' || cmdClean.includes('driverquery')) {
      outputText = `[DRIVERQUERY /SI - SIGNED DRIVERS AUDIT]
DeviceName                   ProviderName     IsSigned DeviceId            
============================ ================ ======== ====================
Intel Ethernet Controller    Intel Corporation True    PCI\\VEN_8086&DEV_15F3
NVIDIA GeForce RTX 4070      NVIDIA           True     PCI\\VEN_10DE&DEV_2784
Realtek High Definition Audio Realtek          True     HDAUDIO\\FUNC_01&VEN`;
    } else if (cmdClean === '5' || cmdClean.includes('chkdsk') || cmdClean.includes('sfc')) {
      outputText = `[CHKDSK C: READ-ONLY AUDIT]
The type of the file system is NTFS.
Volume label is Windows_OS.
Stage 1: Examining basic file system structure...
Stage 2: Examining file name linkage...
Stage 3: Examining security descriptors...
Windows has scanned the file system and found no problems.
No further action is required.`;
    } else if (cmdClean === '6' || cmdClean.includes('temp') || cmdClean.includes('dir')) {
      outputText = `[DIR %TEMP%]
 Directory of C:\\Users\\Alumno\\AppData\\Local\\Temp

06/10/2026  22:15    <DIR>          .
06/10/2026  22:15    <DIR>          ..
06/10/2026  22:10             1,024 evo_net_audit.log
06/10/2026  21:40            45,120 aria-debug-1290.log
               2 File(s)         46,144 bytes
               2 Dir(s)  120,412,180,480 bytes free`;
    } else if (cmdClean === 'help') {
      outputText = `Comandos disponibles en el sandbox EVO CMD Tech Console:
- 1, 2, 3, 4, 5, 6: Opciones del Menú EVO Diagnostic
- systeminfo : Resumen técnico del sistema
- ipconfig /all : Parámetros de red TCP/IP
- tasklist : Lista de procesos y PID
- driverquery : Controladores de Kernel
- chkdsk : Auditoría de disco NTFS
- cls : Limpiar pantalla de consola`;
    } else if (cmdClean === 'cls') {
      setTerminalHistory([]);
      return;
    } else {
      outputText = `'${cmdToRun}' se ejecutó en la consola didáctica sandbox.
Resultado: Comando verificado sin efectos colaterales en el sistema anfitrión.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      {
        command: cmdToRun,
        output: outputText,
        timestamp: new Date().toLocaleTimeString(),
        risk,
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Investigaciones
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
            <Terminal className="w-4 h-4" />
            <span>LAB CANÓNICO // SECTOR 09</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            CMD TECH CONSOLE & MENÚ EVO
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Entorno de pruebas de comandos CMD, interpretación de STDOUT/STDERR y ejecución del script de diagnóstico EVO
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-amber-400">
          MODO: <span className="font-bold text-slate-200">SANDBOX READ-ONLY</span>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-[11px] ml-2">C:\Windows\System32\cmd.exe — EVO Diagnostic Console</span>
          </div>

          <button
            onClick={() => setTerminalHistory([])}
            className="text-slate-500 hover:text-slate-300 text-[11px] transition-colors cursor-pointer"
          >
            Limpiar Pantalla (cls)
          </button>
        </div>

        {/* Terminal Screen Output */}
        <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto leading-relaxed bg-black/90">
          <div className="text-slate-500 text-[11px]">
            Microsoft Windows [Versión 10.0.22631.3007]<br />
            (c) Microsoft Corporation. Todos los derechos reservados.<br /><br />
            Escribe <span className="text-amber-400 font-bold">1-6</span> para probar el Menú EVO o escribe un comando de prueba (ej. <span className="text-amber-400">systeminfo</span>, <span className="text-amber-400">ipconfig</span>).
          </div>

          {terminalHistory.map((item, idx) => (
            <div key={idx} className="space-y-1.5 pt-2 border-t border-slate-900">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>C:\EvoLab&gt;</span>
                <span className="text-slate-100">{item.command}</span>
                <span className="text-[10px] text-slate-600 font-normal ml-auto">[{item.timestamp}]</span>
              </div>
              <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[11px] pl-2 border-l-2 border-slate-800">
                {item.output}
              </pre>
            </div>
          ))}
        </div>

        {/* Terminal Command Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <span className="text-amber-400 font-bold pl-2">C:\EvoLab&gt;</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && commandInput.trim()) {
                executeCommand(commandInput);
                setCommandInput('');
              }
            }}
            placeholder="Escribe una opción (1-6) o comando y presiona Enter..."
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs placeholder-slate-600"
          />
          <button
            onClick={() => {
              if (commandInput.trim()) {
                executeCommand(commandInput);
                setCommandInput('');
              }
            }}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ejecutar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
