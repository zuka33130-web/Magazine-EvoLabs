import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Database,
  FileCode,
  FileText,
  Folder,
  HardDrive,
  Key,
  Layers,
  Lock,
  Play,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
  Sliders,
  Settings,
  HelpCircle,
  ExternalLink,
  Laptop,
  Check,
  Search,
} from 'lucide-react';

interface VisualDiagramProps {
  code: string;
}

export const Sector03VisualDiagram: React.FC<VisualDiagramProps> = ({ code }) => {
  switch (code) {
    case 'MAP':
    case '03.00':
      return <WindowsControlRoomMapDiagram />;
    case '03.01':
      return <Diagram0301 />;
    case '03.02':
      return <Diagram0302 />;
    case '03.03':
      return <Diagram0303 />;
    case '03.04':
      return <Diagram0304 />;
    case '03.05':
      return <Diagram0305 />;
    case '03.06':
      return <Diagram0306 />;
    case '03.07':
      return <Diagram0307 />;
    case '03.08':
      return <Diagram0308 />;
    case '03.09':
      return <Diagram0309 />;
    case '03.10':
      return <Diagram0310 />;
    case '03.11':
      return <Diagram0311 />;
    case '03.12':
      return <Diagram0312 />;
    case '03.13':
      return <Diagram0313 />;
    case '03.14':
      return <Diagram0314 />;
    case '03.15':
      return <Diagram0315 />;
    case '03.16':
      return <Diagram0316 />;
    case '03.17':
      return <Diagram0317 />;
    case '03.18':
      return <Diagram0318 />;
    case '03.19':
      return <Diagram0319 />;
    case '03.20':
      return <Diagram0320 />;
    case '03.21':
      return <Diagram0321 />;
    default:
      return <GenericSector03Diagram code={code} />;
  }
};

// GRAND MAPA CENTRAL: WINDOWS CONTROL ROOM
export const WindowsControlRoomMapDiagram: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const branches = [
    {
      id: 'rendimiento',
      title: 'RENDIMIENTO',
      color: 'border-sky-500/50 text-[#60CDFF] bg-[#0078D4]/10',
      consoles: [
        { name: 'Task Manager', cmd: 'taskmgr.exe', code: '03.01' },
        { name: 'Resource Monitor', cmd: 'resmon.exe', code: '03.02' },
        { name: 'Performance Monitor', cmd: 'perfmon.msc', code: '03.03' },
      ],
    },
    {
      id: 'errores',
      title: 'ERRORES Y LOGS',
      color: 'border-red-500/50 text-red-400 bg-red-950/20',
      consoles: [
        { name: 'Event Viewer', cmd: 'eventvwr.msc', code: '03.04' },
        { name: 'Reliability Monitor', cmd: 'perfmon /rel', code: '03.05' },
      ],
    },
    {
      id: 'hardware',
      title: 'HARDWARE Y FIRMWARE',
      color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20',
      consoles: [
        { name: 'Device Manager', cmd: 'devmgmt.msc', code: '03.06' },
        { name: 'System Information', cmd: 'msinfo32.exe', code: '03.18' },
      ],
    },
    {
      id: 'servicios',
      title: 'SERVICIOS Y ARRANQUE',
      color: 'border-amber-500/50 text-amber-400 bg-amber-950/20',
      consoles: [
        { name: 'Services', cmd: 'services.msc', code: '03.07' },
        { name: 'Task Scheduler', cmd: 'taskschd.msc', code: '03.08' },
        { name: 'MSConfig', cmd: 'msconfig.exe', code: '03.09' },
      ],
    },
    {
      id: 'almacenamiento',
      title: 'ALMACENAMIENTO',
      color: 'border-purple-500/50 text-purple-400 bg-purple-950/20',
      consoles: [{ name: 'Disk Management', cmd: 'diskmgmt.msc', code: '03.10' }],
    },
    {
      id: 'configuracion',
      title: 'CONFIGURACIÓN PROFUNDA',
      color: 'border-orange-500/50 text-orange-400 bg-orange-950/20',
      consoles: [
        { name: 'Registry Editor', cmd: 'regedit.exe', code: '03.11' },
        { name: 'Advanced System Settings', cmd: 'sysdm.cpl', code: '03.13' },
        { name: 'Optional Features', cmd: 'optionalfeatures.exe', code: '03.16' },
      ],
    },
    {
      id: 'seguridad',
      title: 'SEGURIDAD Y DEFENDER',
      color: 'border-[#00A4EF]/50 text-[#60CDFF] bg-[#00A4EF]/10',
      consoles: [{ name: 'Windows Security', cmd: 'windowssecurity:', code: '03.12' }],
    },
    {
      id: 'energia_red',
      title: 'ENERGÍA Y RED',
      color: 'border-teal-500/50 text-teal-300 bg-teal-950/20',
      consoles: [
        { name: 'Power Options', cmd: 'powercfg.cpl', code: '03.14' },
        { name: 'Network Connections', cmd: 'ncpa.cpl', code: '03.15' },
      ],
    },
    {
      id: 'recuperacion',
      title: 'RECUPERACIÓN',
      color: 'border-rose-500/50 text-rose-400 bg-rose-950/20',
      consoles: [{ name: 'Windows Recovery', cmd: 'systempropertiesprotection', code: '03.17' }],
    },
    {
      id: 'administracion',
      title: 'ADMINISTRACIÓN Y PANEL EVO',
      color: 'border-indigo-500/50 text-indigo-300 bg-indigo-950/20',
      consoles: [
        { name: 'Computer Management', cmd: 'compmgmt.msc', code: '03.19' },
        { name: 'GodMode', cmd: 'shell:::{ED7BA470-8E54-465E-825C-99712043E01C}', code: '03.20' },
        { name: 'Control Panel EVO', cmd: 'EVO_PANEL_LAUNCHER', code: '03.21' },
      ],
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 font-mono text-xs space-y-4 shadow-[0_0_30px_rgba(0,164,239,0.1)]">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Settings className="w-5 h-5 text-[#00A4EF]" />
          <span className="text-sm tracking-wide">MAPA CENTRAL // WINDOWS CONTROL ROOM</span>
        </div>
        <span className="text-[10px] bg-[#11161D] text-zinc-400 px-2.5 py-1 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_DIAGRAM
        </span>
      </div>

      {/* Central Node Visual */}
      <div className="flex justify-center my-2">
        <div className="p-3.5 px-8 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(0,164,239,0.4)] flex items-center gap-2">
          <Server className="w-5 h-5" />
          <span>WINDOWS KERNEL & OPERATING SYSTEM</span>
        </div>
      </div>

      {/* Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {branches.map((b) => {
          const isSelected = selectedBranch === b.id;
          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranch(isSelected ? null : b.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${b.color} ${
                isSelected ? 'ring-2 ring-white/50 scale-[1.01]' : 'hover:border-white/40'
              }`}
            >
              <div className="font-bold text-xs flex items-center justify-between border-b border-white/10 pb-1.5">
                <span>{b.title}</span>
                <span className="text-[10px] font-normal text-zinc-400">
                  {b.consoles.length} CONSOLAS
                </span>
              </div>

              <div className="space-y-1">
                {b.consoles.map((c) => (
                  <div
                    key={c.code}
                    className="p-1.5 rounded bg-[#05070A]/80 border border-white/10 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-zinc-500 text-[10px] shrink-0">{c.code}</span>
                      <span className="font-bold text-zinc-200 truncate">{c.name}</span>
                    </div>
                    <code className="text-[10px] text-[#60CDFF] shrink-0">{c.cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 03.01 Task Manager
const Diagram0301: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Activity className="w-4 h-4 text-[#00A4EF]" />
          <span>ESTRUCTURA DE VISTAS EN TASK MANAGER (taskmgr.exe)</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_UI_REPRESENTATION
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold block">1. Processes</span>
          <span className="text-[10px] text-zinc-400">Apps, Fondo, Windows</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold block">2. Performance</span>
          <span className="text-[10px] text-zinc-400">CPU, RAM, Disk, Net, GPU</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold block">3. App History</span>
          <span className="text-[10px] text-zinc-400">Consumo acumulado UWP</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold block">4. Startup Apps</span>
          <span className="text-[10px] text-zinc-400">Impacto de inicio de sesión</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold block">5. Users</span>
          <span className="text-[10px] text-zinc-400">Sesiones y uso por cuenta</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20">
          <span className="text-[#60CDFF] font-bold block">6. Details & Services</span>
          <span className="text-[10px] text-zinc-400">PID, CommandLine, Services</span>
        </div>
      </div>
    </div>
  );
};

// 03.02 Resource Monitor
const Diagram0302: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-emerald-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Search className="w-4 h-4 text-emerald-400" />
          <span>RESOURCE MONITOR (resmon.exe) // DESGLOSE DE SUBSISTEMAS</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/30 flex items-center justify-between">
          <span className="font-bold text-[#60CDFF]">CPU &rarr; Associated Handles</span>
          <span className="text-[11px] text-zinc-300">Encuentra qué proceso tiene bloqueado un archivo en disco</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-emerald-500/30 flex items-center justify-between">
          <span className="font-bold text-emerald-400">Memory &rarr; Standby vs In Use</span>
          <span className="text-[11px] text-zinc-300">Diferencia la RAM usada de la RAM guardada en caché</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-amber-500/30 flex items-center justify-between">
          <span className="font-bold text-amber-400">Disk &rarr; File Activity (B/s &amp; Latency ms)</span>
          <span className="text-[11px] text-zinc-300">Muestra la ruta física exacta del archivo en I/O</span>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-purple-500/30 flex items-center justify-between">
          <span className="font-bold text-purple-300">Network &rarr; Network Activity &amp; Listening Ports</span>
          <span className="text-[11px] text-zinc-300">IP remota, puerto socket y transferencia por proceso</span>
        </div>
      </div>
    </div>
  );
};

// 03.03 Performance Monitor
const Diagram0303: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Activity className="w-4 h-4 text-[#00A4EF]" />
          <span>PERFORMANCE MONITOR (perfmon.msc) // ESTRUCTURA DE CONTADORES</span>
        </div>
      </div>
      <div className="p-3 rounded bg-[#11161D] border border-sky-500/30 space-y-2">
        <div className="flex items-center gap-2 text-zinc-300 font-bold">
          <span className="text-[#60CDFF]">[Performance Object]</span> LogicalDisk
        </div>
        <div className="flex items-center gap-2 text-zinc-300 font-bold pl-4">
          <span className="text-emerald-400">└── [Counter]</span> Avg. Disk sec/Read
        </div>
        <div className="flex items-center gap-2 text-zinc-300 font-bold pl-8">
          <span className="text-amber-400">└── [Instance]</span> C: (HarddiskVolume2)
        </div>
        <div className="mt-2 text-[11px] text-zinc-400 font-sans border-t border-sky-500/10 pt-2">
          Métrica: Un promedio mayor a 0.020 segundos (20 ms) indica saturación de lectura en el almacenamiento.
        </div>
      </div>
    </div>
  );
};

// 03.04 Event Viewer
const Diagram0304: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-red-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <FileText className="w-4 h-4 text-red-400" />
          <span>EVENT VIEWER (eventvwr.msc) // ANATOMÍA DE UN REGISTRO</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
        <div className="p-2 rounded bg-[#11161D] border border-red-500/30">
          <span className="text-red-400 font-bold">Event ID 41 (Kernel-Power)</span>
          <p className="text-[10px] text-zinc-400">Reinicio o apagado sucio por corte de luz o cuelgue</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-amber-500/30">
          <span className="text-amber-400 font-bold">Event ID 1074 (User32 / System)</span>
          <p className="text-[10px] text-zinc-400">Reinicio o apagado ordenado solicitado por proceso</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/30">
          <span className="text-[#60CDFF] font-bold">Event ID 1001 (BugCheck)</span>
          <p className="text-[10px] text-zinc-400">Informe de volcado de pantalla azul (BSOD)</p>
        </div>
        <div className="p-2 rounded bg-[#11161D] border border-purple-500/30">
          <span className="text-purple-300 font-bold">Event ID 7036 (Service Control)</span>
          <p className="text-[10px] text-zinc-400">Un servicio cambió de estado (Running / Stopped)</p>
        </div>
      </div>
    </div>
  );
};

// 03.05 Reliability Monitor
const Diagram0305: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-amber-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>RELIABILITY MONITOR (perfmon /rel) // LÍNEA DE TIEMPO</span>
        </div>
      </div>
      <div className="p-3 rounded bg-[#11161D] border border-sky-500/20 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-300 font-bold">
          <span>LUNES: Puntaje 10/10 (Estable)</span>
          <span className="text-emerald-400">Sin fallas</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-300 font-bold">
          <span>MARTES: Instalación de Update GPU v551.23</span>
          <span className="text-sky-400">Info Event</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-300 font-bold">
          <span>MIÉRCOLES: Fallo de dwm.exe / Caída a 2/10</span>
          <span className="text-red-400">Critical Error</span>
        </div>
        <div className="text-[10px] text-amber-300 pt-2 border-t border-sky-500/10">
          Correlación inmediata: El nuevo driver instalado el martes causó el fallo de dwm.exe el miércoles.
        </div>
      </div>
    </div>
  );
};

// 03.06 a 03.21 Genericos
const GenericSector03Diagram: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Activity className="w-4 h-4 text-[#00A4EF]" />
          <span>REPRESENTACIÓN DIDÁCTICA CONSOLA {code}</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_UI_REPRESENTATION
        </span>
      </div>
      <p className="text-zinc-300 text-xs">
        Representación didáctica y diagrama de componentes para la consola del Sector 03 ({code}).
      </p>
    </div>
  );
};

const Diagram0306 = () => <GenericSector03Diagram code="03.06 (Device Manager)" />;
const Diagram0307 = () => <GenericSector03Diagram code="03.07 (Services)" />;
const Diagram0308 = () => <GenericSector03Diagram code="03.08 (Task Scheduler)" />;
const Diagram0309 = () => <GenericSector03Diagram code="03.09 (MSConfig)" />;
const Diagram0310 = () => <GenericSector03Diagram code="03.10 (Disk Management)" />;
const Diagram0311 = () => <GenericSector03Diagram code="03.11 (Registry Editor)" />;
const Diagram0312 = () => <GenericSector03Diagram code="03.12 (Windows Security)" />;
const Diagram0313 = () => <GenericSector03Diagram code="03.13 (Advanced System Settings)" />;
const Diagram0314 = () => <GenericSector03Diagram code="03.14 (Power Options)" />;
const Diagram0315 = () => <GenericSector03Diagram code="03.15 (Network Connections)" />;
const Diagram0316 = () => <GenericSector03Diagram code="03.16 (Optional Features)" />;
const Diagram0317 = () => <GenericSector03Diagram code="03.17 (Windows Recovery)" />;
const Diagram0318 = () => <GenericSector03Diagram code="03.18 (System Information)" />;
const Diagram0319 = () => <GenericSector03Diagram code="03.19 (Computer Management)" />;
const Diagram0320 = () => <GenericSector03Diagram code="03.20 (GodMode)" />;
const Diagram0321 = () => <GenericSector03Diagram code="03.21 (Control Panel EVO)" />;
