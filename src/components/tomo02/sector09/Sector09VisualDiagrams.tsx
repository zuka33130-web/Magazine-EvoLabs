import React, { useState } from 'react';
import {
  Terminal,
  Folder,
  ArrowRight,
  HardDrive,
  Cpu,
  Layers,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Code,
  FileText,
  Search,
  Database,
  RefreshCw,
} from 'lucide-react';

export const Sector09VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'NAV' | 'REDIR' | 'PIPE' | 'ASSOC' | 'REPAIR' | 'MENU'
  >('NAV');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      {/* Central Visual Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <Terminal className="w-4 h-4" />
              <span>Diagramas Didácticos de Consola // Sector 09</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              CMD ARCHITECTURE & COMMAND FLOW MAPS
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Visualización de flujos I/O, tuberías de procesos, resolución de extensiones y flujo de reparación
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('NAV')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'NAV'
                  ? 'bg-amber-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Navegación & Tree
            </button>
            <button
              onClick={() => setActiveDiagram('REDIR')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'REDIR'
                  ? 'bg-amber-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. STDOUT vs STDERR
            </button>
            <button
              onClick={() => setActiveDiagram('PIPE')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'PIPE'
                  ? 'bg-amber-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Pipe Stream (|)
            </button>
            <button
              onClick={() => setActiveDiagram('ASSOC')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'ASSOC'
                  ? 'bg-amber-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. ASSOC ↔ FTYPE
            </button>
            <button
              onClick={() => setActiveDiagram('REPAIR')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'REPAIR'
                  ? 'bg-amber-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              05. Flujo SFC ↔ DISM
            </button>
            <button
              onClick={() => setActiveDiagram('MENU')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'MENU'
                  ? 'bg-amber-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              06. Menú EVO Diagnostic
            </button>
          </div>
        </div>

        {/* Diagram 1: Navigation & Folder Tree */}
        {activeDiagram === 'NAV' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 font-mono">
              09.01 — JERARQUÍA DE DIRECTORIOS Y NAVEGACIÓN PROMPT
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs">
                <span className="text-slate-500 block mb-2">// Estructura de Rutas NTFS</span>
                <div className="text-amber-300 font-bold">C:\</div>
                <div className="pl-4 text-slate-400">└── Users</div>
                <div className="pl-8 text-slate-300">└── Alumno</div>
                <div className="pl-12 text-emerald-400">├── Documents</div>
                <div className="pl-12 text-slate-400">└── AppData</div>
                <div className="pl-4 text-slate-400">└── Windows</div>
                <div className="pl-8 text-slate-300">└── System32</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-3">
                <div>
                  <span className="text-slate-400 font-mono block mb-1">Comandos de Cambio de Ruta:</span>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-amber-300">
                    cd /d "C:\Program Files\Windows NT"
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  El parámetro <code className="font-mono text-amber-400">/d</code> asegura que Windows cambie de unidad y carpeta de manera simultánea. Las comillas aíslan espacios en nombres de directorio.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: STDOUT vs STDERR Redirection */}
        {activeDiagram === 'REDIR' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 font-mono">
              09.04 — FLUJOS ESTÁNDAR: STDOUT (1) VS STDERR (2)
            </h4>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/4">
                  <span className="text-amber-400 font-bold block">COMANDO CMD</span>
                  <span className="text-slate-400 text-[11px]">ej. dir C:\Inexistente</span>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-2/4">
                  <div className="p-2 bg-emerald-950/40 border border-emerald-800/60 rounded flex justify-between items-center text-emerald-300">
                    <span>STDOUT (Canal 1)</span>
                    <span className="text-[10px] font-sans">Salida normal → log.txt</span>
                  </div>
                  <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded flex justify-between items-center text-rose-300">
                    <span>STDERR (Canal 2)</span>
                    <span className="text-[10px] font-sans">Mensaje de error → 2&gt;&amp;1</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/4">
                  <span className="text-blue-400 font-bold block">ARCHIVO REPORTE</span>
                  <span className="text-slate-400 text-[11px]">reporte.log</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-300 font-sans text-xs">
                Sintaxis Canónica: <code className="font-mono text-amber-300">ipconfig /all &gt; %TEMP%\net.txt 2&gt;&amp;1</code> une ambos flujos en un único archivo.
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: Anonymous Pipe Stream */}
        {activeDiagram === 'PIPE' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 font-mono">
              09.05 — TUBERÍA EN MEMORIA: OPERADOR PIPE (|)
            </h4>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-center gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PROCESO EMISOR</span>
                  <span className="text-amber-300 font-bold">tasklist</span>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400" />
                <div className="p-3 bg-slate-900 rounded border border-amber-500/50 text-amber-400 font-bold">
                  PIPE (|)
                </div>
                <ArrowRight className="w-5 h-5 text-amber-400" />
                <div className="p-3 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PROCESO FILTRO</span>
                  <span className="text-emerald-400 font-bold">findstr /i "svchost"</span>
                </div>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed text-center pt-2 border-t border-slate-800">
                La transferencia de texto se realiza directamente en la memoria RAM mediante un búfer anónimo del Kernel sin tocar almacenamiento físico SSD/HDD.
              </p>
            </div>
          </div>
        )}

        {/* Diagram 4: ASSOC & FTYPE Mapping */}
        {activeDiagram === 'ASSOC' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 font-mono">
              09.16 / 09.17 — MAPEO DUAL: EXTENSIÓN ↔ FILE TYPE ↔ EJECUTABLE
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px] uppercase">1. Extensión</span>
                <span className="text-amber-400 font-bold text-sm">.TXT</span>
                <span className="text-slate-500 block text-[10px] mt-1">assoc .txt</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px] uppercase">2. File Type (Clase)</span>
                <span className="text-emerald-400 font-bold text-sm">txtfile</span>
                <span className="text-slate-500 block text-[10px] mt-1">ftype txtfile</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px] uppercase">3. Ejecutable Final</span>
                <span className="text-blue-400 font-bold text-sm">NOTEPAD.EXE "%1"</span>
                <span className="text-slate-500 block text-[10px] mt-1">Línea de comando activa</span>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 5: SFC vs DISM Repair Flow */}
        {activeDiagram === 'REPAIR' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 font-mono">
              09.26 / 09.27 — PROTOCOLO CANÓNICO DE REPARACIÓN DE WINDOWS
            </h4>
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/3">
                  <span className="text-amber-400 font-bold block">1. DISM /CheckHealth</span>
                  <span className="text-slate-400 text-[10px] font-sans">Comprobar almacén WinSxS</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/3">
                  <span className="text-amber-400 font-bold block">2. DISM /RestoreHealth</span>
                  <span className="text-slate-400 text-[10px] font-sans">Reparar WinSxS desde Update</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 hidden md:block" />
                <div className="p-3 bg-slate-900 rounded border border-emerald-500/50 w-full md:w-1/3">
                  <span className="text-emerald-400 font-bold block">3. sfc /scannow</span>
                  <span className="text-slate-400 text-[10px] font-sans">Reparar DLLs con WinSxS limpio</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 6: EVO Diagnostic Menu Architecture */}
        {activeDiagram === 'MENU' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 font-mono">
              09.30 — ARQUITECTURA DEL MENÚ DIAGNÓSTICO EVO (.CMD)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-amber-400 font-bold block">1. Sistema</span>
                <span className="text-slate-400 text-[10px]">systeminfo / whoami</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-amber-400 font-bold block">2. Red</span>
                <span className="text-slate-400 text-[10px]">ipconfig / netstat</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-amber-400 font-bold block">3. Procesos</span>
                <span className="text-slate-400 text-[10px]">tasklist /fi</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-amber-400 font-bold block">4. Almacén</span>
                <span className="text-slate-400 text-[10px]">chkdsk / sfc</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
