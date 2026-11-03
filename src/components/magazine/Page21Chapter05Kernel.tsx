import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ShieldAlert, Cpu, Activity, Clock, Layers, ArrowRight } from 'lucide-react';

export const Page21Chapter05Kernel: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-25"
      pageNumber={25}
      totalPages={46}
      sectionTitle="CAPÍTULO 05"
      subSlug="ARQUITECTURA // ANILLOS DE SEGURIDAD DEL CPU"
      accentColor="#3B82F6"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-blue-400 uppercase font-bold">
              ESTRUCTURA DE PRIVILEGIOS // CAPÍTULO 05
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Los Anillos de Privilegio (Ring 0 vs. Ring 3)
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            x86-64 HARDWARE PRIVILEGE LEVEL
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            La arquitectura x86 divide la ejecución del código en capas de protección de hardware. La inmensa mayoría de tus aplicaciones vive en el espacio de usuario (Ring 3), donde un fallo solo cierra la ventana. Pero los controladores de hardware y el núcleo de Windows se ejecutan en el Anillo 0 (Ring 0), con acceso ilimitado a la memoria física y a las instrucciones directas de la CPU.
          </p>
        </div>

        {/* The 2 Rings Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ring 0 */}
          <div className="p-4 bg-[#0a111e] border-2 border-blue-500/50 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-blue-400 font-bold uppercase">RING 0 // KERNEL MODE</span>
                <span className="text-zinc-400 font-mono-tech">PRIVILEGIO TOTAL</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                ntoskrnl.exe + Drivers KMDF (.sys)
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Controladores en modo kernel (KMDF): subsistemas gráficos de bajo nivel (nvlddmkm.sys), red (ndis.sys), almacenamiento y bus. Una excepción no controlada en este nivel genera un fallo de detención (BugCheck / BSOD) para preservar la integridad del hardware. No todo driver corre aquí: periféricos secundarios y software moderno emplean controladores en modo usuario (UMDF).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-blue-400 uppercase font-bold block mb-0.5">
                PRIORIDAD TEMPORAL:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Rutinas ISR y DPC prolongadas pueden postergar el procesamiento de audio o cuadros gráficos.
              </p>
            </div>
          </div>

          {/* Ring 3 */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400 font-bold uppercase">RING 3 // USER MODE</span>
                <span className="text-zinc-500 font-mono-tech">ESPACIO AISLADO</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                Juegos, Navegadores, Apps, UMDF
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Aplicaciones de usuario y servicios no privilegiados. Se ejecutan en espacios de memoria virtual aislados mediante llamadas al sistema (syscalls). Un cuelgue en Ring 3 normalmente cierra el proceso sin colapsar el sistema operativo, aunque procesos mal optimizados pueden saturar CPU, disco o memoria y degradar el rendimiento general.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold block mb-0.5">
                AISLAMIENTO Y GESTIÓN:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Si una app falla, el kernel puede terminar su hilo sin comprometer la estabilidad del equipo.
              </p>
            </div>
          </div>
        </div>

        {/* DPC Latency Explainer & Protocolo de Mantenimiento Preventivo */}
        <div className="p-3 bg-[#080d17] border border-blue-500/40 rounded-xl space-y-2 text-xs font-mono-tech shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-blue-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>DIAGNÓSTICO PREVENTIVO: PROTOCOLO LATENCYMON EN RING 0 (&lt; 500 µs)</span>
            </span>
            <span className="text-[10px] text-zinc-500">RESPLENDENCE LATENCYMON</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
              <span className="text-emerald-400 font-bold block">1. nvlddmkm.sys (GPU)</span>
              <p className="text-zinc-300 font-sans-editorial leading-tight text-[9.5px]">
                Driver de video. Si excede 1.000 µs, causa micro-parones. Solución: instalación limpia de driver WHQL y desactivar audio HDMI no utilizado.
              </p>
            </div>

            <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
              <span className="text-sky-400 font-bold block">2. ndis.sys (RED/WIFI)</span>
              <p className="text-zinc-300 font-sans-editorial leading-tight text-[9.5px]">
                Pila de red. Interrupciones diferidas excesivas. Solución: desactivar Energy Efficient Ethernet y actualizar driver directo de Intel/Realtek.
              </p>
            </div>

            <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
              <span className="text-amber-400 font-bold block">3. storahci.sys (DISCO)</span>
              <p className="text-zinc-300 font-sans-editorial leading-tight text-[9.5px]">
                Controladora de almacenamiento. Latencia por ahorro agresivo de energía. Solución: desactivar HIPM/DIPM en el plan de energía activo.
              </p>
            </div>

            <div className="p-2 bg-black/50 border border-zinc-800/80 rounded space-y-1">
              <span className="text-rose-400 font-bold block">4. wdf01000.sys (KMDF)</span>
              <p className="text-zinc-300 font-sans-editorial leading-tight text-[9.5px]">
                Framework del kernel. Aglutina fallas de puertos USB, controladores de iluminación RGB o hubs defectuosos conectados al equipo.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="p-2.5 bg-[#0a101b] border-l-3 border-blue-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span className="text-[11px]">
            <strong className="text-blue-400 font-bold">MANTENIMIENTO METÓDICO:</strong> Antes de culpar a Windows o aplicar 'tweaks' destructivos, ejecutá LatencyMon 10 minutos. Una DPC Latency menor a 500 µs garantiza que tu kernel procesa fotogramas y audio en tiempo real.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 06 // SCRIPTS DEBLOATER →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
