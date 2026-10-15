import React, { useState } from 'react';
import {
  RotateCcw,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  Cpu,
  HardDrive,
  FileCode,
  FileCheck,
} from 'lucide-react';

export const Sector13VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'MATRIX' | 'VSS_ENGINE' | 'WINRE_FLOW' | 'OOBE_BYPASS'
  >('MATRIX');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <RotateCcw className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 13</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              INSTALACIÓN, RECUPERACIÓN WINRE Y ARQUITECTURA DE SNAPSHOTS VSS
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Matriz comparativa de reinstalación, ciclo de vida de Push-Button Reset y copias en sombra de bajo nivel
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('MATRIX')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'MATRIX'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Matriz de Reinstalación
            </button>
            <button
              onClick={() => setActiveDiagram('VSS_ENGINE')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'VSS_ENGINE'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. Motor VSS y Snapshots
            </button>
            <button
              onClick={() => setActiveDiagram('WINRE_FLOW')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'WINRE_FLOW'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Flujo WinRE & Auto-Repair
            </button>
            <button
              onClick={() => setActiveDiagram('OOBE_BYPASS')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'OOBE_BYPASS'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. OOBE y Bypass de Red
            </button>
          </div>
        </div>

        {/* DIAGRAM 1: REINSTALLATION MATRIX */}
        {activeDiagram === 'MATRIX' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 overflow-x-auto">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-4">
                MATRIZ COMPARATIVA DE PRESERVACIÓN DE COMPONENTES
              </span>

              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Método de Restauración</th>
                    <th className="py-2.5 px-3">Archivos C:\Users</th>
                    <th className="py-2.5 px-3">Programas (x86/x64)</th>
                    <th className="py-2.5 px-3">Hives del Registro</th>
                    <th className="py-2.5 px-3">Drivers de Terceros</th>
                    <th className="py-2.5 px-3">Invasividad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-cyan-300">In-place Repair (ISO Setup)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Conserva 100%</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Conserva 100%</td>
                    <td className="py-3 px-3 text-cyan-400">Repara & Migra</td>
                    <td className="py-3 px-3 text-emerald-400">Conserva</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Mínima (Cero pérdida)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-amber-300">Keep My Files (Reset PBR)</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">Conserva 100%</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">Elimina todo</td>
                    <td className="py-3 px-3 text-amber-400">Hives nuevos</td>
                    <td className="py-3 px-3 text-amber-400">Preserva seleccionados</td>
                    <td className="py-3 px-3 text-amber-400">Media</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-rose-300">Remove Everything (Reset)</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">Elimina todo</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">Elimina todo</td>
                    <td className="py-3 px-3 text-rose-400">Nuevos de fábrica</td>
                    <td className="py-3 px-3 text-rose-400">Solo genéricos OEM</td>
                    <td className="py-3 px-3 text-rose-400">Alta</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-3 font-bold text-red-400">Clean Install (USB DiskPart)</td>
                    <td className="py-3 px-3 text-red-500 font-bold">Partición borrada</td>
                    <td className="py-3 px-3 text-red-500 font-bold">Partición borrada</td>
                    <td className="py-3 px-3 text-red-500">Nuevo WIM inicial</td>
                    <td className="py-3 px-3 text-red-500">Purga absoluta</td>
                    <td className="py-3 px-3 text-red-400 font-bold">Total (Estado Cero)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DIAGRAM 2: VSS ENGINE */}
        {activeDiagram === 'VSS_ENGINE' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                VOLUME SHADOW COPY SERVICE (VSS) // COPY-ON-WRITE ARCHITECTURE
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-cyan-300 font-bold">1. Fase de Quiescencia</div>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    El servicio VSS solicita a los <code className="text-cyan-300">VSS Writers</code> (Registro, SQL, Active Directory) que completen transacciones pendientes y congelen escrituras por unos milisegundos.
                  </p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-cyan-300 font-bold">2. Snapshot en volsnap.sys</div>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    El driver de kernel <code className="text-cyan-300">volsnap.sys</code> crea una tabla diferencial. Las lecturas hacia la instantánea ven el volumen exactamente como estaba congelado.
                  </p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-cyan-300 font-bold">3. Copy-on-Write (CoW)</div>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    Cuando el sistema vuelve a escribir en un bloque de disco modificado, el bloque antiguo se copia previamente al espacio reservado en <code className="text-cyan-300">System Volume Information</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 3: WINRE FLOW */}
        {activeDiagram === 'WINRE_FLOW' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                MECANISMO DE DISPARO Y REPARACIÓN AUTOMÁTICA EN WINRE
              </span>

              <div className="flex flex-col md:flex-row gap-3 text-xs font-mono text-center">
                <div className="flex-1 bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <div className="text-rose-400 font-bold">Falla Consecutiva x2</div>
                  <div className="text-[10px] text-slate-400 font-sans">Boot Manager detecta 2 arranques fallidos con BSOD</div>
                </div>
                <div className="flex items-center justify-center text-slate-600 font-bold">➔</div>
                <div className="flex-1 bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <div className="text-amber-400 font-bold">Boot to WinRE RAMDisk</div>
                  <div className="text-[10px] text-slate-400 font-sans">Carga de winre.wim en memoria a través de boot.sdi</div>
                </div>
                <div className="flex items-center justify-center text-slate-600 font-bold">➔</div>
                <div className="flex-1 bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <div className="text-cyan-400 font-bold">StartRep.exe</div>
                  <div className="text-[10px] text-slate-400 font-sans">Verifica BCD, integridad de kernel y drivers boot-start</div>
                </div>
                <div className="flex items-center justify-center text-slate-600 font-bold">➔</div>
                <div className="flex-1 bg-slate-900 border border-slate-800 p-3.5 rounded-lg space-y-1">
                  <div className="text-emerald-400 font-bold">SrtTrail.txt Log</div>
                  <div className="text-[10px] text-slate-400 font-sans">Dictamen técnico del fallo registrado en disco</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 4: OOBE BYPASS */}
        {activeDiagram === 'OOBE_BYPASS' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                ARQUITECTURA DEL BYPASS OFFLINE EN WINDOWS SETUP (OOBE)
              </span>

              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-cyan-300 font-bold">Paso 1: Interrupción en pantalla "Vamos a conectarte a una red"</div>
                <div className="p-2.5 bg-black/60 rounded border border-slate-800 text-slate-300">
                  Presionar: <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">Shift</kbd> + <kbd className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">F10</kbd> (Abre CMD en modo NT AUTHORITY\SYSTEM)
                </div>
                <div className="text-cyan-300 font-bold">Paso 2: Ejecución del script nativo de bypass</div>
                <div className="p-2.5 bg-black/60 rounded border border-slate-800 text-cyan-300">
                  X:\Sources&gt; oobe\bypassnro
                </div>
                <div className="text-slate-400 font-sans text-xs leading-relaxed">
                  El script inyecta el valor de registro <code className="text-cyan-300">HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\OOBE\BypassNRO = 1</code> y reinicia inmediatamente el subsistema OOBE. Al volver a cargar, se habilita la opción: <strong className="text-slate-200">"No tengo internet"</strong> para crear un usuario local seguro sin forzar cuenta Microsoft.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
