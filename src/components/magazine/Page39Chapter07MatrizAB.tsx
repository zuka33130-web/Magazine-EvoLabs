import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Beaker, CheckCircle2, ShieldCheck, Scale, Flame } from 'lucide-react';

export const Page39Chapter07MatrizAB: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-43"
      pageNumber={43}
      totalPages={46}
      sectionTitle="CAPÍTULO 07"
      subSlug="PROTOCOLO EXPERIMENTAL // METROLOGÍA A/B"
      accentColor="#06B6D4"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-cyan-400 uppercase font-bold">
              ESTÁNDAR DE LABORATORIO // CAPÍTULO 07
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Los Tres Mandamientos del Ensayo A/B
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            REPRODUCIBILIDAD CIENTÍFICA
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            Cualquier modificación que le hagas a tu PC (un cambio en el BIOS, una curva de ventiladores, un ajuste de Windows o un overclock) debe someterse a este protocolo antes de considerarla un éxito:
          </p>
        </div>

        {/* 3 Core Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          
          {/* Rule 1 */}
          <div className="p-4 bg-[#081216] border border-cyan-500/30 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-cyan-400 uppercase">MANDAMIENTO 01</span>
                <Scale className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="font-display font-bold text-base text-white uppercase mb-1">
                Una Sola Variable Aislada
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Si tocás dos ajustes a la vez, tu ensayo queda invalidado de inmediato. Para saber si el ajuste X funciona, la condición de prueba A (antes) y la condición B (después) deben ser rigurosamente idénticas en todas las demás variables: misma temperatura ambiente, mismos programas en segundo plano y mismo mapa de juego.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-cyan-300">
              REGLA: DELTA PURA DE 1 FACTOR.
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-4 bg-[#081216] border border-cyan-500/30 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-cyan-400 uppercase">MANDAMIENTO 02</span>
                <Flame className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="font-display font-bold text-base text-white uppercase mb-1">
                Descarte del "Run Frío"
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                La primera corrida tras encender la máquina siempre da un resultado artificialmente alto porque el cobre del disipador está a temperatura ambiente. Calentá el sistema 5 minutos antes de medir, ejecutá al menos 3 pasadas continuas y descartá los extremos. El promedio de las tres es tu dato real.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-cyan-300">
              REGLA: TEMPERATURA DE EQUILIBRIO TÉRMICO.
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-4 bg-[#081216] border border-cyan-500/30 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="font-mono-tech font-bold text-xs text-cyan-400 uppercase">MANDAMIENTO 03</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="font-display font-bold text-base text-white uppercase mb-1">
                Mirar Siempre el 1% Low
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Nunca tomes una decisión basada en los FPS promedio. El ojo y la mano solo detectan las caídas bruscas. Si una optimización sube el promedio en 10 FPS pero empeora el 1% Low en 15 FPS, la fluidez general empeoró y el ajuste debe ser revertido de inmediato.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-cyan-300">
              REGLA: LA CONSISTENCIA DERROTA A LA POTENCIA BRUTA.
            </div>
          </div>

        </div>

        {/* Bottom Rule */}
        <div className="p-3 bg-[#081418] border-l-3 border-cyan-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-cyan-400 font-bold">FILOSOFÍA EVO:</strong> "Si no podés medirlo con números precisos y reproducirlo tres veces seguidas, no es optimización: es fe religiosa."
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 08 // PLAN MÁXIMO RENDIMIENTO →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
