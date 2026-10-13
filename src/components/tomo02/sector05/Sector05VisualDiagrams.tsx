import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Folder,
  RefreshCw,
  Clock,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  GitCommit,
  HardDrive,
  Globe,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Sector05VisualDiagramsProps {
  code: string;
}

export const Sector05VisualDiagrams: React.FC<Sector05VisualDiagramsProps> = ({ code }) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('system');
  const [selectedProcessNode, setSelectedProcessNode] = useState<string>('explorer');
  const [idleActiveStep, setIdleActiveStep] = useState<number>(0);

  // 05.01 FOREGROUND VS BACKGROUND
  if (code === '05.01') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 05.01 // FOREGROUND VS BACKGROUND
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            GUI VS WINDOWLESS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#0F1520] border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Eye className="w-4 h-4" />
              <span>FOREGROUND PROCESS (APLICACIÓN)</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Tiene ventana visible en el escritorio, entrada de teclado/mouse activa y presencia en la barra de tareas.
            </p>
            <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-zinc-300 flex items-center justify-between">
              <span>Word.exe / Chrome.exe</span>
              <span className="text-emerald-400 font-bold">HWND &gt; 0 (GUI)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0F1520] border border-[#00A4EF]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#60CDFF]">
              <Layers className="w-4 h-4" />
              <span>BACKGROUND PROCESS (SEGUNDO PLANO)</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Sin marco de ventana ni icono. Corre en RAM asignada atendiendo eventos, sockets o tareas en segundo plano.
            </p>
            <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-zinc-300 flex items-center justify-between">
              <span>Helper.exe / Service</span>
              <span className="text-[#60CDFF] font-bold">HWND = 0 (WINDOWLESS)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 05.02 SYSTEM (PID 4)
  if (code === '05.02') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 05.02 // ARCHITECTURA PID 4 (SYSTEM)
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            KERNEL MODE CONTAINER
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1017] border border-zinc-800 space-y-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-between">
            <span>PID 4: SYSTEM (ntoskrnl.exe)</span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">MODO KERNEL (RING 0)</span>
          </div>

          <div className="pl-4 border-l-2 border-amber-500/40 space-y-2">
            <div className="p-2 rounded bg-[#131A26] border border-zinc-800 text-zinc-300 flex items-center justify-between text-[11px]">
              <span>├── Kernel Threads (Hilos de Núcleo)</span>
              <span className="text-zinc-500">I/O Scheduling</span>
            </div>
            <div className="p-2 rounded bg-[#131A26] border border-zinc-800 text-zinc-300 flex items-center justify-between text-[11px]">
              <span>├── Hardware Drivers (.sys)</span>
              <span className="text-amber-400">Interrupciones de Hardware</span>
            </div>
            <div className="p-2 rounded bg-[#131A26] border border-zinc-800 text-zinc-300 flex items-center justify-between text-[11px]">
              <span>└── Memory &amp; Cache Manager</span>
              <span className="text-zinc-500">System Paged Pool</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 05.04 SVCHOST CONTAINER TREE
  if (code === '05.04') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 05.04 // ESTRUCTURA SVCHOST.EXE
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            SERVICE HOST CONTAINERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#0E141F] border border-sky-500/20 space-y-2">
            <div className="text-[#60CDFF] font-bold text-[11px]">svchost.exe (netsvcs)</div>
            <div className="text-[10px] text-zinc-400 space-y-1">
              <div className="p-1 rounded bg-black/40 text-zinc-300">├── Dhcp (Cliente DHCP)</div>
              <div className="p-1 rounded bg-black/40 text-zinc-300">├── Dnscache (Caché DNS)</div>
              <div className="p-1 rounded bg-black/40 text-zinc-300">└── AudioSrv (Audio)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0E141F] border border-sky-500/20 space-y-2">
            <div className="text-[#60CDFF] font-bold text-[11px]">svchost.exe (LocalSystem)</div>
            <div className="text-[10px] text-zinc-400 space-y-1">
              <div className="p-1 rounded bg-black/40 text-zinc-300">├── wuauserv (Windows Update)</div>
              <div className="p-1 rounded bg-black/40 text-zinc-300">└── PlugPlay (Plug and Play)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0E141F] border border-sky-500/20 space-y-2">
            <div className="text-[#60CDFF] font-bold text-[11px]">svchost.exe (NetworkService)</div>
            <div className="text-[10px] text-zinc-400 space-y-1">
              <div className="p-1 rounded bg-black/40 text-zinc-300">├── CryptSvc (Criptografía)</div>
              <div className="p-1 rounded bg-black/40 text-zinc-300">└── NlaSvc (Ubicación de Red)</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 05.06 - 05.10 MAPA DE PROCESOS CRÍTICOS
  if (['05.06', '05.07', '05.08', '05.09', '05.10'].includes(code)) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-red-500/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              MAPA DE PROCESOS CRÍTICOS DEL SISTEMA (SYSTEM32)
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
            INTOCABLES (BSOD IF TERMINATED)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
          <div className={`p-2.5 rounded-xl border transition-all ${code === '05.10' ? 'bg-red-500/20 border-red-400 text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}>
            <div className="text-red-400 font-bold">smss.exe</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">Session Manager</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${code === '05.06' ? 'bg-red-500/20 border-red-400 text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}>
            <div className="text-red-400 font-bold">csrss.exe</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">Win32 Subsystem</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${code === '05.08' ? 'bg-red-500/20 border-red-400 text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}>
            <div className="text-red-400 font-bold">wininit.exe</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">Sys Init</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${code === '05.09' ? 'bg-red-500/20 border-red-400 text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}>
            <div className="text-red-400 font-bold">winlogon.exe</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">Logon Manager</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${code === '05.07' ? 'bg-red-500/20 border-red-400 text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}>
            <div className="text-red-400 font-bold">lsass.exe</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">Local Security</div>
          </div>
        </div>
      </div>
    );
  }

  // 05.11 / 05.14 PROCESS TREE NAVIGATOR
  if (code === '05.11' || code === '05.14') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              Navegador de Árbol de Procesos (Parent / Child)
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Clic para inspeccionar nodo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-[#0C1017] border border-zinc-800 font-mono text-xs space-y-1.5">
            <button
              type="button"
              onClick={() => setSelectedProcessNode('explorer')}
              className={`w-full text-left p-2 rounded transition-all cursor-pointer flex items-center justify-between ${selectedProcessNode === 'explorer' ? 'bg-[#0078D4]/30 border border-[#00A4EF] text-white font-bold' : 'bg-[#121824] text-zinc-300 hover:bg-[#182030]'}`}
            >
              <span>explorer.exe (PID 4120) [PADRE]</span>
              <span className="text-[10px] text-zinc-400">PPID 1080</span>
            </button>

            <div className="pl-4 border-l-2 border-sky-500/30 space-y-1.5">
              <button
                type="button"
                onClick={() => setSelectedProcessNode('chrome')}
                className={`w-full text-left p-2 rounded transition-all cursor-pointer flex items-center justify-between ${selectedProcessNode === 'chrome' ? 'bg-[#0078D4]/30 border border-[#00A4EF] text-white font-bold' : 'bg-[#121824] text-zinc-300 hover:bg-[#182030]'}`}
              >
                <span>├── chrome.exe (PID 6200) [HIJO]</span>
                <span className="text-[10px] text-zinc-400">PPID 4120</span>
              </button>

              <div className="pl-4 border-l-2 border-emerald-500/30 space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedProcessNode('chrome_render')}
                  className={`w-full text-left p-1.5 rounded transition-all cursor-pointer flex items-center justify-between text-[11px] ${selectedProcessNode === 'chrome_render' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold' : 'bg-[#101520] text-zinc-400 hover:bg-[#161D2B]'}`}
                >
                  <span>└── chrome.exe --type=renderer [NIETO]</span>
                  <span className="text-[9px] text-zinc-500">PID 7810</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProcessNode('cmd')}
                className={`w-full text-left p-2 rounded transition-all cursor-pointer flex items-center justify-between ${selectedProcessNode === 'cmd' ? 'bg-[#0078D4]/30 border border-[#00A4EF] text-white font-bold' : 'bg-[#121824] text-zinc-300 hover:bg-[#182030]'}`}
              >
                <span>└── cmd.exe (PID 8900) [HIJO]</span>
                <span className="text-[10px] text-zinc-400">PPID 4120</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0C1017] border border-sky-500/20 text-xs font-mono space-y-2">
            <div className="text-[#60CDFF] font-bold border-b border-zinc-800 pb-1.5 uppercase">
              DETALLES DE FORENSIA DE PROCESO
            </div>
            {selectedProcessNode === 'explorer' && (
              <div className="space-y-1.5 text-zinc-300 text-[11px]">
                <p><strong className="text-white">Nombre:</strong> explorer.exe</p>
                <p><strong className="text-white">Ruta:</strong> C:\Windows\explorer.exe</p>
                <p><strong className="text-white">Rol:</strong> Shell interactivo del escritorio.</p>
                <p><strong className="text-emerald-400">Evaluación:</strong> NORMAL. Es el padre legítimo de todas las apps lanzadas manualmente.</p>
              </div>
            )}
            {selectedProcessNode === 'chrome' && (
              <div className="space-y-1.5 text-zinc-300 text-[11px]">
                <p><strong className="text-white">Nombre:</strong> chrome.exe</p>
                <p><strong className="text-white">Parent ID:</strong> 4120 (explorer.exe)</p>
                <p><strong className="text-white">Rol:</strong> Proceso navegador principal de usuario.</p>
                <p><strong className="text-emerald-400">Evaluación:</strong> NORMAL. Iniciado por el usuario desde el escritorio.</p>
              </div>
            )}
            {selectedProcessNode === 'chrome_render' && (
              <div className="space-y-1.5 text-zinc-300 text-[11px]">
                <p><strong className="text-white">Nombre:</strong> chrome.exe (Renderer)</p>
                <p><strong className="text-white">Parent ID:</strong> 6200 (chrome.exe)</p>
                <p><strong className="text-white">Rol:</strong> Subproceso aislado (sandbox) para renderizar una pestaña web.</p>
                <p><strong className="text-emerald-400">Evaluación:</strong> NORMAL. Arquitectura multi-proceso estándar.</p>
              </div>
            )}
            {selectedProcessNode === 'cmd' && (
              <div className="space-y-1.5 text-zinc-300 text-[11px]">
                <p><strong className="text-white">Nombre:</strong> cmd.exe</p>
                <p><strong className="text-white">Parent ID:</strong> 4120 (explorer.exe)</p>
                <p><strong className="text-white">Rol:</strong> Consola de comandos Win32.</p>
                <p><strong className="text-amber-400">Evaluación:</strong> NORMAL si lo abriste tú. Si no lo abriste tú, investigar qué script lo invocó.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 05.21 / GENERAL CENTRAL VISUAL: WHAT WINDOWS DOES IN THE BACKGROUND
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 font-sans space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#60CDFF]" />
            <h4 className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              VISUAL CENTRAL // WHAT WINDOWS DOES IN THE BACKGROUND
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400">
            El flujo continuo de subsistemas activos cuando el usuario no ejecuta aplicaciones abiertas
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] border border-[#00A4EF]/40 self-start sm:self-auto">
          INTERACTIVE BACKGROUND MAP
        </span>
      </div>

      {/* Main Flow Banner */}
      <div className="p-3 rounded-xl bg-[#0E131C] border border-zinc-800 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-center">
        <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 font-bold">
          USUARIO CIERRA PROGRAMAS
        </span>
        <ChevronRight className="w-4 h-4 text-[#60CDFF]" />
        <span className="px-2.5 py-1 rounded bg-[#0078D4]/30 text-[#60CDFF] font-bold border border-[#00A4EF]/50">
          WINDOWS SIGUE ACTIVO EN BACKGROUND
        </span>
      </div>

      {/* Interactive Branches */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setSelectedBranch('system')}
          className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${selectedBranch === 'system' ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white font-bold shadow-[0_0_15px_rgba(0,164,239,0.2)]' : 'bg-[#0D121B] border-zinc-800 text-zinc-400 hover:bg-[#121926]'}`}
        >
          <div className="text-[10px] text-[#60CDFF] font-bold">[01] KERNEL</div>
          <div className="text-xs truncate">Procesos Sistema</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedBranch('services')}
          className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${selectedBranch === 'services' ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white font-bold shadow-[0_0_15px_rgba(0,164,239,0.2)]' : 'bg-[#0D121B] border-zinc-800 text-zinc-400 hover:bg-[#121926]'}`}
        >
          <div className="text-[10px] text-[#60CDFF] font-bold">[02] SCM</div>
          <div className="text-xs truncate">Servicios svchost</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedBranch('tasks')}
          className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${selectedBranch === 'tasks' ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white font-bold shadow-[0_0_15px_rgba(0,164,239,0.2)]' : 'bg-[#0D121B] border-zinc-800 text-zinc-400 hover:bg-[#121926]'}`}
        >
          <div className="text-[10px] text-[#60CDFF] font-bold">[03] TASKS</div>
          <div className="text-xs truncate">Tareas Programadas</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedBranch('maintenance')}
          className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${selectedBranch === 'maintenance' ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white font-bold shadow-[0_0_15px_rgba(0,164,239,0.2)]' : 'bg-[#0D121B] border-zinc-800 text-zinc-400 hover:bg-[#121926]'}`}
        >
          <div className="text-[10px] text-[#60CDFF] font-bold">[04] IDLE</div>
          <div className="text-xs truncate">Defender &amp; TRIM</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedBranch('cloud')}
          className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${selectedBranch === 'cloud' ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white font-bold shadow-[0_0_15px_rgba(0,164,239,0.2)]' : 'bg-[#0D121B] border-zinc-800 text-zinc-400 hover:bg-[#121926]'}`}
        >
          <div className="text-[10px] text-[#60CDFF] font-bold">[05] SYNC</div>
          <div className="text-xs truncate">Cloud &amp; Updaters</div>
        </button>
      </div>

      {/* Selected Branch Details */}
      <div className="p-4 rounded-xl bg-[#0D121C] border border-[#00A4EF]/20 text-xs font-mono space-y-2">
        {selectedBranch === 'system' && (
          <div className="space-y-2">
            <div className="text-[#60CDFF] font-bold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#60CDFF]" />
              <span>RAMAMA 01: PROCESOS ESENCIALES DEL SISTEMA</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              System (PID 4), csrss.exe, lsass.exe, dwm.exe, winlogon.exe. Administran la memoria, renderizado gráfico, autenticación y llamadas al kernel.
            </p>
            <div className="p-2.5 rounded bg-black/40 border border-zinc-800 text-emerald-400 text-[11px]">
              ESTADO: SIEMPRE ACTIVOS // CRÍTICOS PARA LA ESTABILIDAD DEL SO.
            </div>
          </div>
        )}

        {selectedBranch === 'services' && (
          <div className="space-y-2">
            <div className="text-[#60CDFF] font-bold text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#60CDFF]" />
              <span>RAMAMA 02: SERVICIOS Y HOSTS SVCHOST.EXE</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              Decenas de instancias de svchost.exe alojando servicios de red, audio, criptografía y diagnóstico en la Sesión 0 aislada.
            </p>
            <div className="p-2.5 rounded bg-black/40 border border-zinc-800 text-emerald-400 text-[11px]">
              ESTADO: EJECUCIÓN SIN VENTANA (HEADLESS) ATENDIENDO EVENTOS.
            </div>
          </div>
        )}

        {selectedBranch === 'tasks' && (
          <div className="space-y-2">
            <div className="text-[#60CDFF] font-bold text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#60CDFF]" />
              <span>RAMAMA 03: PROGRAMADOR DE TAREAS (TASKSCHD)</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              Tareas automatizadas activadas por disparadores de tiempo, arranque o inicio de sesión para realizar reportes y verificaciones.
            </p>
            <div className="p-2.5 rounded bg-black/40 border border-zinc-800 text-amber-300 text-[11px]">
              ESTADO: SE ACTIVAN POR TRIGGERS TEMPORALES O DE EVENTO.
            </div>
          </div>
        )}

        {selectedBranch === 'maintenance' && (
          <div className="space-y-2">
            <div className="text-[#60CDFF] font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#60CDFF]" />
              <span>RAMAMA 04: MANTENIMIENTO EN ESTADO REPOSO (IDLE)</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              MsMpEng.exe (Defender scan), reindexación de búsquedas y comandos TRIM en discos SSD cuando la PC detecta inactividad humana.
            </p>
            <div className="p-2.5 rounded bg-black/40 border border-zinc-800 text-emerald-400 text-[11px]">
              ESTADO: PAUSA AUTOMÁTICAMENTE AL MOVER EL MOUSE O TECLADO.
            </div>
          </div>
        )}

        {selectedBranch === 'cloud' && (
          <div className="space-y-2">
            <div className="text-[#60CDFF] font-bold text-sm flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#60CDFF]" />
              <span>RAMAMA 05: AGENTES CLOUD, UPDATERS Y OEM</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              Clientes de almacenamiento (OneDrive), verificadores de parches (GoogleUpdate) y utilidades de hardware (ASUS/Dell/Lenovo).
            </p>
            <div className="p-2.5 rounded bg-black/40 border border-zinc-800 text-sky-300 text-[11px]">
              ESTADO: MONITOREAN CAMBIOS LOCALES Y SERVIDORES REMOTOS.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
