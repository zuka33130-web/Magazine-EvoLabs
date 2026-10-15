import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Network,
  HardDrive,
  Terminal,
  Activity,
  Box,
  Server,
  Zap,
} from 'lucide-react';

export const Sector24VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'HYPERVISOR_TYPE1_VS_TYPE2' | 'VIRTUAL_NETWORK_SWITCH_MODES' | 'DYNAMIC_RAM_BALLOONING' | 'WSL2_ARCHITECTURE'
  >('HYPERVISOR_TYPE1_VS_TYPE2');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Box className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 24</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              MÁQUINAS VIRTUALES, SANDBOX Y ARQUITECTURAS DE HIPERVISOR
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Hipervisores Ring -1, Modos de Conmutador Virtual, Ballooning de vRAM y Arquitectura WSL2
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('HYPERVISOR_TYPE1_VS_TYPE2')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'HYPERVISOR_TYPE1_VS_TYPE2'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Hipervisores Tipo 1 vs 2</span>
            </button>
            <button
              onClick={() => setActiveDiagram('VIRTUAL_NETWORK_SWITCH_MODES')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'VIRTUAL_NETWORK_SWITCH_MODES'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>2. Modos de vSwitch</span>
            </button>
            <button
              onClick={() => setActiveDiagram('DYNAMIC_RAM_BALLOONING')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'DYNAMIC_RAM_BALLOONING'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>3. Memoria Dinámica</span>
            </button>
            <button
              onClick={() => setActiveDiagram('WSL2_ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDiagram === 'WSL2_ARCHITECTURE'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>4. Arquitectura WSL2</span>
            </button>
          </div>
        </div>

        {/* DIAGRAM 1: HYPERVISOR TYPE 1 VS TYPE 2 */}
        {activeDiagram === 'HYPERVISOR_TYPE1_VS_TYPE2' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Capa de Ejecución: </span>
              Un hipervisor Tipo 1 (Hyper-V) se ejecuta directamente en Ring -1 sobre el hardware. El Host OS corre en la Partición Primaria. Un Tipo 2 (VirtualBox antiguo) corre como un proceso común en espacio de usuario.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-cyan-400 font-bold flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  <span>TIPO 1 (Bare-Metal / Hyper-V)</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-200">
                    Guest VMs (Particiones Secundarias) + Windows Host (Partición Primaria)
                  </div>
                  <div className="p-2.5 bg-cyan-950/50 border border-cyan-500/60 rounded text-cyan-300 font-bold text-center">
                    HIPERVISOR LAYER (Ring -1 / VT-x / AMD-V)
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-400 text-center">
                    HARDWARE FÍSICO (CPU, RAM, NVMe, GPU)
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-amber-400 font-bold flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  <span>TIPO 2 (Hosted / VirtualBox Tradicional)</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-200">
                    Guest VMs (Procesos en User-Space)
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                    APLICACIÓN HIPERVISOR (VirtualBox.exe / VMware.exe)
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                    SISTEMA OPERATIVO ANFITRIÓN (Windows / Linux Host OS)
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-400 text-center">
                    HARDWARE FÍSICO (CPU, RAM, GPU)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 2: VIRTUAL NETWORK SWITCH MODES */}
        {activeDiagram === 'VIRTUAL_NETWORK_SWITCH_MODES' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Topología de Red Virtual: </span>
              Conmutación de paquetes por software en el kernel de Windows (vmswitch.sys) determinando la visibilidad y alcance de las direcciones IP.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold">1. Default Switch / NAT</div>
                <p className="text-slate-400">
                  La VM recibe IP privada (172.x.x.x). El Host traduce puertos (NAT). Inciada para navegar a Internet sin exposición en la LAN.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold">2. External Switch / Bridged</div>
                <p className="text-slate-400">
                  La VM se conecta como un dispositivo físico en el switch LAN (192.168.1.x). Recibe IP del router físico.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-rose-400 font-bold">3. Internal / Private Switch</div>
                <p className="text-slate-400">
                  Red totalmente aislada. Comunicación exclusiva entre VMs y el Host (Internal) o solo entre VMs sin Host (Private).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 3: DYNAMIC RAM BALLOONING */}
        {activeDiagram === 'DYNAMIC_RAM_BALLOONING' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Técnica de Inflado de Balón (Ballooning): </span>
              El controlador de memoria del hipervisor dentro del Guest infla un proceso fantasma para forzar al sistema cliente a liberar páginas de RAM innecesarias.
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Secuencia de Reclamación de Memoria vRAM:</span>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1">
                <div>1. El Host necesita RAM física para otra aplicación.</div>
                <div>2. El Hipervisor instruye al 'Balloon Driver' dentro de la VM a solicitar memoria al Guest OS.</div>
                <div>3. El Guest OS descarta cachés de archivos y entrega páginas de RAM al Balloon Driver.</div>
                <div>4. El Hipervisor mapea esas páginas físicas de vuelta al pool de RAM del Host.</div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 4: WSL2 ARCHITECTURE */}
        {activeDiagram === 'WSL2_ARCHITECTURE' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-cyan-400 font-bold">Subsistema WSL2: </span>
              Instancia de hipervisor liviana con un kernel oficial de Linux que monta particiones ext4 en un archivo .vhdx dinámico e integra llamadas X11/Wayland mediante WSLg.
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-cyan-300 font-bold">
                Windows 11 User Desktop (Explorer, Windows Terminal, VS Code)
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 text-emerald-300">
                WSLg (GUI Display Server / Wayland / PulseAudio Bridge)
              </div>
              <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/60 rounded text-cyan-200 font-bold">
                Lightweight Hyper-V VM -&gt; Real Microsoft Linux Kernel (ext4.vhdx)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
