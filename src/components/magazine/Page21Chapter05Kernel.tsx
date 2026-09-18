import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ShieldAlert, Cpu, Activity, Clock, Layers, ArrowRight } from 'lucide-react';

export const Page21Chapter05Kernel: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-21"
      pageNumber={21}
      totalPages={41}
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
                ntoskrnl.exe + Drivers (.sys)
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Controladores de placa gráfica (nvlddmkm.sys), tarjetas de red (ndis.sys), controladores de audio y firmware de placa madre. Si una sola línea de código comete una violación de memoria aquí, la CPU no puede recuperarse: se genera una pantalla azul (BSOD) inmediata.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-blue-400 uppercase font-bold block mb-0.5">
                IMPACTO CRÍTICO:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Cualquier demora en una rutina ISR/DPC congela la ejecución del resto del equipo.
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
                Juegos, Discord, Chrome, Office
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Toda aplicación común se ejecuta aquí en una caja de arena (sandbox) de memoria virtual. No pueden comunicarse directamente con los puertos ni con el silicio: deben solicitarle respetuosamente al kernel que realice la operación mediante una llamada al sistema (syscall).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold block mb-0.5">
                AISLAMIENTO DE FALLOS:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Si un juego colapsa, Windows cierra el proceso y el resto del sistema sigue operando sin inmutarse.
              </p>
            </div>
          </div>
        </div>

        {/* DPC Latency Explainer */}
        <div className="p-4 bg-[#0b0e15] border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-mono-tech font-bold text-xs sm:text-sm uppercase text-white">
                DPC LATENCY: EL ENEMIGO OCULTO DEL RENDIMIENTO (<strong className="text-emerald-400">&lt; 500 µs</strong>)
              </h5>
              <p className="text-xs font-sans-editorial text-zinc-300 mt-0.5 max-w-2xl leading-relaxed">
                Cuando una placa Wi-Fi o tarjeta de sonido envía una interrupción (Deferred Procedure Call), si el driver tarda más de 1.000 microsegundos en responder, el procesador pospone el renderizado del fotograma siguiente. El usuario lo percibe como micro-cortes de audio o tirones inexplicables de 50 milisegundos en el juego.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="p-3 bg-[#0a101b] border-l-3 border-blue-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-blue-400 font-bold">HERRAMIENTA FORENSE:</strong> Descargá <strong className="text-white">LatencyMon</strong> (de Resplendence). Corré el diagnóstico durante 10 minutos. Si la barra verde se vuelve roja, tenés un driver en Ring 0 que está saboteando tus fotogramas.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 06 // SCRIPTS DEBLOATER →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
