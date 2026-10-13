import React, { useState } from 'react';
import {
  Terminal,
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
  ArrowRight,
  Zap,
} from 'lucide-react';

export const Sector10VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'OBJECT_VS_TEXT' | 'PIPELINE' | 'CIM' | 'STORAGE' | 'TOOLKIT'
  >('OBJECT_VS_TEXT');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      {/* Central Visual Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
              <Terminal className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 10</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              TEXT PIPELINE VS OBJECT PIPELINE ARCHITECTURE
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              La diferencia fundamental de diseño: CMD procesa texto plano; PowerShell procesa objetos .NET fuertemente tipados
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('OBJECT_VS_TEXT')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'OBJECT_VS_TEXT'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Text vs Objects
            </button>
            <button
              onClick={() => setActiveDiagram('PIPELINE')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'PIPELINE'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. Object Pipeline Stream
            </button>
            <button
              onClick={() => setActiveDiagram('CIM')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'CIM'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. CIM / WMI Architecture
            </button>
            <button
              onClick={() => setActiveDiagram('STORAGE')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'STORAGE'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. Jerarquía de Storage
            </button>
            <button
              onClick={() => setActiveDiagram('TOOLKIT')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'TOOLKIT'
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              05. EVO Windows Toolkit
            </button>
          </div>
        </div>

        {/* Diagram 1: Text vs Object Pipeline */}
        {activeDiagram === 'OBJECT_VS_TEXT' && (
          <div className="mt-6 space-y-6">
            <h4 className="text-sm font-bold text-blue-400 font-mono">
              COMPARATIVA TÉCNICA: PIPELINE DE TEXTO (CMD) VS PIPELINE DE OBJETOS (POWERSHELL)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CMD Text Pipeline */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
                <span className="text-amber-400 font-bold block">// CMD.EXE (TEXT PIPELINE)</span>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-slate-300">
                  <div className="text-amber-300">COMMAND (tasklist)</div>
                  <ArrowRight className="w-4 h-4 text-slate-500 mx-auto" />
                  <div className="text-slate-400 text-[10px]">Cadena de caracteres (String Stream)</div>
                  <ArrowRight className="w-4 h-4 text-slate-500 mx-auto" />
                  <div className="text-slate-300">FILTER (findstr /i "chrome")</div>
                  <ArrowRight className="w-4 h-4 text-slate-500 mx-auto" />
                  <div className="text-slate-400 text-[10px]">Texto filtrado por caracteres</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Desventaja: Si cambia el idioma o el ancho de columna, los scripts que cortan texto se rompen inmediatamente.
                </p>
              </div>

              {/* PowerShell Object Pipeline */}
              <div className="bg-slate-950 p-4 rounded-lg border border-blue-900/40 space-y-3 font-mono text-xs">
                <span className="text-blue-400 font-bold block">// POWERSHELL (OBJECT PIPELINE)</span>
                <div className="p-3 bg-slate-900 rounded border border-blue-800/40 space-y-2 text-slate-200">
                  <div className="text-blue-300 font-bold">CMDLET (Get-Process)</div>
                  <ArrowRight className="w-4 h-4 text-blue-400 mx-auto" />
                  <div className="p-2 bg-blue-950/60 border border-blue-800/60 rounded text-[11px]">
                    <span className="text-blue-400 block font-bold">System.Diagnostics.Process</span>
                    <span className="text-slate-300 text-[10px]">├── Name: "chrome"</span><br />
                    <span className="text-slate-300 text-[10px]">├── Id: 4328</span><br />
                    <span className="text-slate-300 text-[10px]">└── WorkingSet64: 353386496</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400 mx-auto" />
                  <div className="text-emerald-400 font-bold">WHERE-OBJECT ($_.WorkingSet64 -gt 100MB)</div>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  Ventaja: Acceso instantáneo y tipado a propiedades en la memoria RAM sin parsear cadenas de texto.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: Object Pipeline Stream */}
        {activeDiagram === 'PIPELINE' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-blue-400 font-mono">
              10.05 / 10.20 / 10.21 / 10.23 — SECUENCIA DE TRANSMISIÓN DE OBJETOS
            </h4>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/4">
                  <span className="text-blue-400 font-bold block">1. Get-Service</span>
                  <span className="text-slate-400 text-[10px] font-sans">Emitir colección de ServiceController</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/4">
                  <span className="text-blue-400 font-bold block">2. Where-Object</span>
                  <span className="text-slate-400 text-[10px] font-sans">Filtrar Status -eq "Running"</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <div className="p-3 bg-slate-900 rounded border border-slate-800 w-full md:w-1/4">
                  <span className="text-blue-400 font-bold block">3. Select-Object</span>
                  <span className="text-slate-400 text-[10px] font-sans">Proyectar Name, StartType</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <div className="p-3 bg-slate-900 rounded border border-emerald-500/50 w-full md:w-1/4">
                  <span className="text-emerald-400 font-bold block">4. Export-Csv</span>
                  <span className="text-slate-400 text-[10px] font-sans">Serializar a services.csv</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: CIM/WMI Architecture */}
        {activeDiagram === 'CIM' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-blue-400 font-mono">
              10.10 / 10.11 — ARQUITECTURA CIM (WS-MAN) VS WMI (DCOM)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold block">// Get-WmiObject (LEGACY DEPRECATED)</span>
                <div className="text-slate-300">Protocolo: DCOM / RPC (Puerto 135)</div>
                <div className="text-slate-400 text-[11px] font-sans">Problema: Bloqueado por firewalls modernos, incompatible con PowerShell 7+.</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-blue-800/60 space-y-2">
                <span className="text-blue-400 font-bold block">// Get-CimInstance (ESTÁNDAR MODERNO)</span>
                <div className="text-slate-200">Protocolo: WS-Management (HTTP 5985 / HTTPS 5986)</div>
                <div className="text-slate-300 text-[11px] font-sans">Ventaja: Estándar abierto, rápido, atraviesa firewalls y compatible con PowerShell Core.</div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: Storage Hierarchy */}
        {activeDiagram === 'STORAGE' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-blue-400 font-mono">
              10.17 / 10.18 / 10.19 — JERARQUÍA DEL SUBSISTEMA DE ALMACENAMIENTO
            </h4>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
                <div className="p-3 bg-slate-900 rounded border border-blue-500/50 w-full md:w-1/3">
                  <span className="text-blue-400 font-bold block">1. Get-Disk</span>
                  <span className="text-slate-400 text-[10px] font-sans">Physical Disk (NVMe/SATA)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <div className="p-3 bg-slate-900 rounded border border-blue-500/50 w-full md:w-1/3">
                  <span className="text-blue-400 font-bold block">2. Get-Partition</span>
                  <span className="text-slate-400 text-[10px] font-sans">GPT / MBR Partition</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400" />
                <div className="p-3 bg-slate-900 rounded border border-emerald-500/50 w-full md:w-1/3">
                  <span className="text-emerald-400 font-bold block">3. Get-Volume</span>
                  <span className="text-slate-400 text-[10px] font-sans">NTFS Volume (C:)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 5: EVO Windows Toolkit Architecture */}
        {activeDiagram === 'TOOLKIT' && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-bold text-blue-400 font-mono">
              10.30 — ARQUITECTURA DEL PROYECTO CANÓNICO EVO WINDOWS TOOLKIT
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded border border-blue-900/40">
                <span className="text-blue-400 font-bold block">System</span>
                <span className="text-slate-400 text-[10px]">Win32_OperatingSystem</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-blue-900/40">
                <span className="text-blue-400 font-bold block">Processes</span>
                <span className="text-slate-400 text-[10px]">Get-Process + WorkingSet</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-blue-900/40">
                <span className="text-blue-400 font-bold block">Network</span>
                <span className="text-slate-400 text-[10px]">Get-NetIPConfiguration</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-blue-900/40">
                <span className="text-blue-400 font-bold block">Storage</span>
                <span className="text-slate-400 text-[10px]">Get-Disk + Get-Volume</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
