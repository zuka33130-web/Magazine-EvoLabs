import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Flame, Zap, ShieldAlert, Wind, ArrowRight } from 'lucide-react';

export const Page18Chapter04MurosTermicos: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-22"
      pageNumber={22}
      totalPages={46}
      sectionTitle="CAPÍTULO 04"
      subSlug="TERMODINÁMICA // LÍMITES FÍSICOS DEL SILICIO"
      accentColor="#F97316"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-orange-400 uppercase font-bold">
              LÍMITES FÍSICOS // CAPÍTULO 04
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Los Tres Muros del Silicio
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            DISIPACIÓN EN WATTS (W) // TJUNCTION
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            Cuando tu computadora pierde rendimiento o se congela bajo carga, casi siempre colisionó contra uno de estos tres mecanismos de protección por hardware. Entender cuál de ellos se disparó es la diferencia entre gastar dinero a ciegas o resolver la causa raíz.
          </p>
        </div>

        {/* The 3 Physical Walls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Wall 1: Thermal Throttling */}
          <div className="p-4 bg-[#14100c] border border-orange-500/40 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-orange-400 font-bold uppercase">MURO 01</span>
                <span className="text-zinc-500">~ 95°C - 105°C</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                Thermal Throttling
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Mecanismo de protección intrínseco del silicio. Al alcanzar la temperatura máxima de unión (TjMax definida por el fabricante de la CPU), el procesador modula dinámicamente frecuencias y voltajes para evitar superar el límite térmico seguro.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-orange-400 uppercase font-bold block mb-0.5">
                SÍNTOMA VISIBLE:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Reducción progresiva o escalonada de las frecuencias boost bajo carga pesada.
              </p>
            </div>
          </div>

          {/* Wall 2: Power Limit Throttling */}
          <div className="p-4 bg-[#14100c] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400 font-bold uppercase">MURO 02</span>
                <span className="text-zinc-500">PL1 / PL2 / TDP / PPT</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                Power Limit Throttling
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Incluso con temperaturas bajas bajo un disipador eficiente, el procesador ajusta su reloj si alcanza el límite de potencia asignado (PL1/PL2 en Intel, PPT/EDC en AMD) o expira la ventana temporal (Tau) configurada en UEFI.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold block mb-0.5">
                SÍNTOMA VISIBLE:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Frecuencia estabilizada en el límite de potencia pese a disponer de margen térmico.
              </p>
            </div>
          </div>

          {/* Wall 3: VRM Thermal Throttling */}
          <div className="p-4 bg-[#14100c] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400 font-bold uppercase">MURO 03</span>
                <span className="text-zinc-500">LÍMITES DE VRM / MOBO</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                VRM Thermal Throttling
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Las etapas de potencia (MOSFETs/Power Stages) poseen sus propios límites térmicos. Si carecen de ventilación adecuada o se exige una CPU demandante en una placa base básica, el circuito activa alertas (como PROCHOT externo) forzando al procesador a frecuencias mínimas de resguardo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                SÍNTOMA VISIBLE:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Caída severa de la frecuencia de CPU con pérdida marcada de fluidez bajo carga.
              </p>
            </div>
          </div>

        </div>

        {/* Airflow Section (Clean, spacious) */}
        <div className="p-4 bg-[#0d0f17] border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-mono-tech font-bold text-xs sm:text-sm uppercase text-white">
                FLUJO DE AIRE EQUILIBRADO EN EL GABINETE
              </h5>
              <p className="text-xs font-sans-editorial text-zinc-400 mt-0.5 max-w-2xl leading-relaxed">
                Configurar una presión ligeramente positiva con entradas filtradas ayuda a mantener aire fresco continuo hacia el disipador de la CPU, las etapas VRM y las unidades M.2, reduciendo a la vez el ingreso pasivo de polvo por intersticios.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="p-3 bg-[#140f0c] border-l-3 border-orange-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-orange-400 font-bold">REGLA TERMODINÁMICA:</strong> Cada componente tiene sus propios límites de ingeniería: el TjMax de la CPU no equivale a la temperatura de unión de la VRAM ni a los umbrales de las etapas VRM.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 05 // VENTILADORES AL 100% →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
