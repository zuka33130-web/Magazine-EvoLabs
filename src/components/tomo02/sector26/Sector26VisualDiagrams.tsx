import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  HardDrive,
  Terminal,
  Activity,
  Box,
  Server,
  Zap,
  Shield,
  Monitor,
} from 'lucide-react';

export const Sector26VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'X86_VS_X64_MEMORY_ADDRESS_SPACE' | 'WOW64_SUBSYSTEM_REDIRECTION' | 'SHIM_ENGINE_COMPATIBILITY_LAYERS'
  >('X86_VS_X64_MEMORY_ADDRESS_SPACE');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Box className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 26</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE COMPATIBILIDAD, WOW64 Y MOTOR DE SHIMS
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Direccionamiento 32-bit vs 64-bit, Redirección SysWOW64 y Gancho de APIs AppHelp
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveDiagram('X86_VS_X64_MEMORY_ADDRESS_SPACE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeDiagram === 'X86_VS_X64_MEMORY_ADDRESS_SPACE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              1. x86 vs x64 Memory
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('WOW64_SUBSYSTEM_REDIRECTION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeDiagram === 'WOW64_SUBSYSTEM_REDIRECTION'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              2. Subsistema WOW64
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('SHIM_ENGINE_COMPATIBILITY_LAYERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeDiagram === 'SHIM_ENGINE_COMPATIBILITY_LAYERS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              3. Motor de Shims
            </button>
          </div>
        </div>

        <div className="pt-6">
          {activeDiagram === 'X86_VS_X64_MEMORY_ADDRESS_SPACE' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/80 p-5 rounded-xl border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-bold">ARQUITECTURA 32-BIT (x86)</span>
                    <Cpu className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded border border-rose-500/20">
                      <div className="font-mono text-rose-300 font-bold">Límite Virtual: 2 GB (User Space)</div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Punteros de 32 bits = 2^32 estados = 4,29 GB de direccionamiento total (2 GB asignables a procesos).
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded border border-slate-800 text-[11px] font-mono text-slate-400">
                      • Riesgo: Error 'Out of Memory' en juegos o software pesado.
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold">ARQUITECTURA 64-BIT (x64)</span>
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded border border-cyan-500/20">
                      <div className="font-mono text-cyan-300 font-bold">Límite Virtual: 128 Terabytes</div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Punteros de 64 bits = Espacio masivo de RAM virtual, eliminado los cuellos de botella de memoria.
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded border border-slate-800 text-[11px] font-mono text-cyan-300">
                      • Ventaja: 16 Registros de CPU de propósito general + Instrucciones AVX2/512.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDiagram === 'WOW64_SUBSYSTEM_REDIRECTION' && (
            <div className="space-y-6">
              <div className="bg-slate-950/90 p-5 rounded-xl border border-cyan-500/30 space-y-4">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Flujo de Redirección Transparente WOW64
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold">Proceso 32-bit (.exe x86)</span>
                    <p className="text-slate-400 font-sans text-[11px]">
                      Solicita cargar 'C:\Windows\System32\kernel32.dll' o la clave HKLM\Software.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-cyan-500/40 space-y-2 text-center flex flex-col justify-center">
                    <span className="text-cyan-300 font-bold">wow64.dll / wow64win.dll</span>
                    <p className="text-slate-400 font-sans text-[11px]">
                      Aísla la llamada y la redirige sin que la app lo note.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-emerald-500/40 space-y-2">
                    <span className="text-emerald-400 font-bold">SysWOW64 & WOW6432Node</span>
                    <p className="text-slate-400 font-sans text-[11px]">
                      Redirigido a C:\Windows\SysWOW64 y HKLM\Software\WOW6432Node.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDiagram === 'SHIM_ENGINE_COMPATIBILITY_LAYERS' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Mecanismo de Inyección de Shims (Apphelp.dll)
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/20 text-xs text-slate-300 leading-relaxed font-mono">
                  <div>1. Ejecución de Aplicación Legada -&gt; Carga Apphelp.dll</div>
                  <div>2. Consulta Base de Datos sysmain.sdb (AppCompatFlags en Registro)</div>
                  <div>3. Inyección de Shims: Intercepta GetVersionEx() -&gt; Devuelve "Windows XP SP3"</div>
                  <div>4. Inyección de Shim UAC: Eleva token de privilegios (~ RUNASADMIN)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
