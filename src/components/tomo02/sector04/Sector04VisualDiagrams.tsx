import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Database,
  FileCode,
  FileText,
  Folder,
  HardDrive,
  Layers,
  Search,
  Server,
  ShieldAlert,
  Terminal,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface VisualDiagramProps {
  code: string;
}

export const Sector04VisualDiagram: React.FC<VisualDiagramProps> = ({ code }) => {
  switch (code) {
    case 'CENTRAL':
    case '04.00':
      return <TaskManagerCentralDiagram />;
    case '04.08':
    case '04.09':
      return <DiagramProcessTreePID />;
    case '04.10':
      return <DiagramThreadSaturation />;
    case '04.15':
    case '04.16':
    case '04.17':
      return <DiagramMemoryComparison />;
    case '04.18':
      return <DiagramCPUThreadVsGlobal />;
    case '04.19':
      return <DiagramDiskActiveVsSpeed />;
    case '04.20':
    case '04.21':
      return <DiagramGPUEnginesAndVRAM />;
    case '04.23':
      return <DiagramDefensiveMethodology />;
    default:
      return <GenericSector04Diagram code={code} />;
  }
};

// CENTRAL TASK MANAGER DIAGRAM WITH CALLOUTS AND DIAGNOSTIC ESCALATION
export const TaskManagerCentralDiagram: React.FC = () => {
  const [activeCallout, setActiveCallout] = useState<number | null>(null);

  const callouts = [
    { id: 1, title: '① Process Name', desc: 'Nombre comercial y categoría (App, Fondo, Windows).' },
    { id: 2, title: '② CPU %', desc: 'Porcentaje de ciclos de procesador usados en la ventana Muestra.' },
    { id: 3, title: '③ Memory (MB/GB)', desc: 'Conjunto de trabajo (Working Set) en RAM física.' },
    { id: 4, title: '④ Disk (MB/s & %)', desc: 'Tiempo activo % e I/O de lectura/escritura.' },
    { id: 5, title: '⑤ Network (Mbps)', desc: 'Tráfico de red transmitido por el proceso.' },
    { id: 6, title: '⑥ GPU % & Engine', desc: 'Motor activo (3D, Video, Compute).' },
    { id: 7, title: '⑦ PID', desc: 'Process Identifier número único de kernel.' },
    { id: 8, title: '⑧ Command Line', desc: 'Ruta física y argumentos de inicio exactos.' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 font-mono text-xs space-y-4 shadow-[0_0_30px_rgba(0,164,239,0.1)]">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-3">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Activity className="w-5 h-5 text-[#00A4EF]" />
          <span className="text-sm tracking-wide">MAPA CENTRAL // TASK MANAGER INTERNALS</span>
        </div>
        <span className="text-[10px] bg-[#11161D] text-zinc-400 px-2.5 py-1 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_UI_REPRESENTATION
        </span>
      </div>

      {/* Interactive Callouts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {callouts.map((c) => {
          const isSelected = activeCallout === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setActiveCallout(isSelected ? null : c.id)}
              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#0078D4]/20 border-[#00A4EF] text-white shadow-[0_0_15px_rgba(0,164,239,0.3)]'
                  : 'bg-[#11161D] border-sky-500/10 text-zinc-300 hover:border-sky-500/30'
              }`}
            >
              <div className="font-bold text-[#60CDFF] text-xs">{c.title}</div>
              <div className="text-[10px] text-zinc-400 mt-1 font-sans">{c.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Escalation Flow Diagram */}
      <div className="p-3.5 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-2">
        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          FLUJO DE ESCALAMIENTO TÉCNICO DE HERRAMIENTAS:
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-[11px] font-bold">
          <div className="p-2 rounded bg-[#11161D] border border-sky-500/30 text-[#60CDFF] w-full">
            TASK MANAGER (Panorama)
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0 hidden sm:block" />
          <ArrowDown className="w-4 h-4 text-zinc-500 shrink-0 sm:hidden" />
          <div className="p-2 rounded bg-[#11161D] border border-emerald-500/30 text-emerald-400 w-full">
            RESOURCE MONITOR (Rutas/IPs)
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0 hidden sm:block" />
          <ArrowDown className="w-4 h-4 text-zinc-500 shrink-0 sm:hidden" />
          <div className="p-2 rounded bg-[#11161D] border border-red-500/30 text-red-400 w-full">
            EVENT VIEWER (Logs/Error)
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0 hidden sm:block" />
          <ArrowDown className="w-4 h-4 text-zinc-500 shrink-0 sm:hidden" />
          <div className="p-2 rounded bg-[#11161D] border border-purple-500/30 text-purple-300 w-full">
            PROCESS EXPLORER (Deep NT)
          </div>
        </div>
      </div>
    </div>
  );
};

// 04.08 / 04.09 PID / PPID Process Tree
const DiagramProcessTreePID: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Terminal className="w-4 h-4 text-[#00A4EF]" />
          <span>ÁRBOLES DE PROCESOS (PID / PPID GENEALOGÍA)</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_DIAGRAM
        </span>
      </div>
      <div className="p-3.5 rounded bg-[#11161D] border border-sky-500/30 space-y-1.5 font-mono text-xs">
        <div className="text-emerald-400 font-bold">
          explorer.exe <span className="text-zinc-500 text-[10px]">(PID: 3400 | PPID: 1024)</span>
        </div>
        <div className="text-zinc-300 pl-4 font-bold">
          ├── cmd.exe <span className="text-zinc-500 text-[10px]">(PID: 4512 | PPID: 3400)</span>
        </div>
        <div className="text-[#60CDFF] pl-8 font-bold">
          │   └── powershell.exe <span className="text-zinc-500 text-[10px]">(PID: 5890 | PPID: 4512)</span>
        </div>
        <div className="text-zinc-300 pl-4 font-bold">
          └── chrome.exe <span className="text-zinc-500 text-[10px]">(PID: 6120 | PPID: 3400)</span>
        </div>
        <div className="text-amber-400 pl-8 font-bold">
          ├── chrome.exe (Tab GPU) <span className="text-zinc-500 text-[10px]">(PID: 6200 | PPID: 6120)</span>
        </div>
        <div className="text-amber-400 pl-8 font-bold">
          └── chrome.exe (Tab Render) <span className="text-zinc-500 text-[10px]">(PID: 6240 | PPID: 6120)</span>
        </div>
      </div>
    </div>
  );
};

// 04.10 Thread Saturation
const DiagramThreadSaturation: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-amber-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>HILOS DE EJECUCIÓN (THREADS) VS PROCESOS</span>
        </div>
      </div>
      <div className="p-3 rounded bg-[#11161D] border border-sky-500/20 space-y-2">
        <div className="text-xs text-zinc-300 font-bold">
          Proceso = Contenedor de memoria (e.g. `photoshop.exe`)
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
          <div className="p-2 rounded bg-red-950/60 border border-red-500 text-red-300">
            Hilo 1 (UI Thread) [100% SATURADO]
          </div>
          <div className="p-2 rounded bg-[#05070A] border border-sky-500/20 text-zinc-400">
            Hilo 2 (Render) [5%]
          </div>
          <div className="p-2 rounded bg-[#05070A] border border-sky-500/20 text-zinc-400">
            Hilo 3 (I/O Disk) [0%]
          </div>
          <div className="p-2 rounded bg-[#05070A] border border-sky-500/20 text-zinc-400">
            Hilo 4 (Network) [0%]
          </div>
        </div>
        <div className="text-[10px] text-amber-300 pt-1 font-sans">
          Resultado: La ventana dice "No responde" porque el Hilo 1 (UI) está trabado, aunque los otros hilos están libres.
        </div>
      </div>
    </div>
  );
};

// 04.15-04.17 Memory Comparison (Working Set vs Private Memory vs Commit)
const DiagramMemoryComparison: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Database className="w-4 h-4 text-[#00A4EF]" />
          <span>COMPARATIVA PERICIAL DE MÉTRICAS DE MEMORIA</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-300">
        <div className="p-2.5 rounded bg-[#11161D] border border-emerald-500/30 space-y-1">
          <span className="font-bold text-emerald-400 text-xs">Working Set</span>
          <p className="text-[10px] text-zinc-400 font-sans">
            Memoria RAM FÍSICA activa en los módulos. Se reduce al minimizar la ventana (Trimming).
          </p>
        </div>
        <div className="p-2.5 rounded bg-[#11161D] border border-purple-500/30 space-y-1">
          <span className="font-bold text-purple-300 text-xs">Private Memory</span>
          <p className="text-[10px] text-zinc-400 font-sans">
            Memoria EXCLUSIVA reservada del programa. Si sube sin parar es un Memory Leak.
          </p>
        </div>
        <div className="p-2.5 rounded bg-[#11161D] border border-sky-500/30 space-y-1">
          <span className="font-bold text-[#60CDFF] text-xs">Commit Charge</span>
          <p className="text-[10px] text-zinc-400 font-sans">
            Promesa total de memoria virtual garantizada (RAM + Archivo de paginación).
          </p>
        </div>
      </div>
    </div>
  );
};

// 04.18 CPU Thread vs Global
const DiagramCPUThreadVsGlobal: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-amber-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>CPU GLOBAL VS NÚCLEO INDIVIDUAL SATURADO</span>
        </div>
      </div>
      <div className="p-3 rounded bg-[#11161D] border border-sky-500/20 space-y-2">
        <div className="text-xs text-zinc-200 font-bold flex justify-between">
          <span>CPU Global (16 Hilos Lógicos): 6.25%</span>
          <span className="text-amber-400 font-bold">¿PC LENTA?</span>
        </div>
        <div className="grid grid-cols-8 gap-1 text-[9px] text-center font-bold">
          <div className="p-1 rounded bg-red-950 border border-red-500 text-red-300">CORE 0: 100%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 1: 0%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 2: 0%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 3: 0%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 4: 0%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 5: 0%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 6: 0%</div>
          <div className="p-1 rounded bg-[#05070A] border border-sky-500/10 text-zinc-600">CORE 7: 0%</div>
        </div>
        <p className="text-[10px] text-zinc-400 font-sans">
          Un solo hilo monohilo trabado al 100% en Core 0 limita la aplicación aunque los otros 15 hilos estén desocupados.
        </p>
      </div>
    </div>
  );
};

// 04.19 Disk Active Time vs Speed
const DiagramDiskActiveVsSpeed: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-red-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2 text-red-400 font-bold">
          <HardDrive className="w-4 h-4 text-red-400" />
          <span>DISCO 100%: TIEMPO ACTIVO VS ANCHO DE BANDA MB/S</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
        <div className="p-3 rounded bg-red-950/30 border border-red-500/40 space-y-1">
          <span className="font-bold text-red-400 text-xs">Peticiones Aleatorias 4K (HDD)</span>
          <div className="text-xs text-white font-bold">Tiempo Activo: 100% | Latencia: 180 ms</div>
          <div className="text-[#60CDFF] font-bold text-xs">Transferencia real: 1.2 MB/s</div>
          <p className="text-[10px] text-zinc-400 font-sans">
            El disco está colapsado moviendo cabezales sin lograr velocidad de Megabytes.
          </p>
        </div>
        <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/40 space-y-1">
          <span className="font-bold text-emerald-400 text-xs">Lectura Secuencial (SSD NVMe)</span>
          <div className="text-xs text-white font-bold">Tiempo Activo: 45% | Latencia: 0.8 ms</div>
          <div className="text-[#60CDFF] font-bold text-xs">Transferencia real: 3,500 MB/s</div>
          <p className="text-[10px] text-zinc-400 font-sans">
            Soporta miles de IOPS en paralelo con respuesta inmediata.
          </p>
        </div>
      </div>
    </div>
  );
};

// 04.20 / 04.21 GPU Engines and VRAM
const DiagramGPUEnginesAndVRAM: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Layers className="w-4 h-4 text-[#00A4EF]" />
          <span>MOTORES DE GPU Y VRAM DEDICADA VS COMPARTIDA</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-bold">
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20 text-[#60CDFF]">3D Engine</div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20 text-[#60CDFF]">Video Decode</div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20 text-[#60CDFF]">Video Encode</div>
        <div className="p-2 rounded bg-[#11161D] border border-sky-500/20 text-[#60CDFF]">Compute (Cuda/AI)</div>
      </div>
      <div className="p-2.5 rounded bg-[#11161D] border border-amber-500/30 text-xs font-sans text-zinc-300">
        <span className="font-mono text-amber-400 font-bold">VRAM Dedicada (GDDR6)</span> = Rápida e integrada en placa.
        <br />
        <span className="font-mono text-purple-400 font-bold">Memoria Compartida (RAM)</span> = Préstamo de auxilio por bus PCIe con mayor latencia.
      </div>
    </div>
  );
};

// 04.23 Defensive Methodology Flow
const DiagramDefensiveMethodology: React.FC = () => {
  const steps = [
    '1. NOMBRE',
    '2. RUTA FÍSICA',
    '3. FIRMA DIGITAL',
    '4. PUBLISHER',
    '5. COMMAND LINE',
    '6. PROCESO PADRE (PPID)',
    '7. ACTIVIDAD DISCO/RED',
    '8. CONTEXTO',
  ];

  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-emerald-500/30 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>METODOLOGÍA DEFENSIVA DE AUDITORÍA EN 8 PASOS</span>
        </div>
        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
          REGLA: RARO ≠ MALWARE
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-bold">
        {steps.map((st, i) => (
          <div key={i} className="p-2 rounded bg-[#11161D] border border-emerald-500/20 text-emerald-300">
            {st}
          </div>
        ))}
      </div>
    </div>
  );
};

// Generic Fallback Diagram for Sector 04
const GenericSector04Diagram: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="p-4 rounded-xl bg-[#080B10] border border-sky-500/20 font-mono text-xs space-y-2">
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
        <div className="flex items-center gap-2 text-[#60CDFF] font-bold">
          <Activity className="w-4 h-4 text-[#00A4EF]" />
          <span>REPRESENTACIÓN DIDÁCTICA TAREA {code}</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[#11161D] px-2 py-0.5 rounded border border-sky-500/20">
          PROVENANCE: DIDACTIC_UI_REPRESENTATION
        </span>
      </div>
      <p className="text-zinc-300 text-xs">
        Diagrama técnico pericial y análisis de métricas para la investigación {code}.
      </p>
    </div>
  );
};
