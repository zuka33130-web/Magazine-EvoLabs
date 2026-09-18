import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Flame, Zap, ShieldAlert, Wind, ArrowRight } from 'lucide-react';

export const Page18Chapter04MurosTermicos: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-18"
      pageNumber={18}
      totalPages={41}
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
                Mecanismo de protección intrínseco del silicio. Al alcanzar la temperatura máxima de unión (TjMax), el micro saltea ciclos de reloj y recorta el voltaje de forma drástica para evitar la degradación de los transistores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-orange-400 uppercase font-bold block mb-0.5">
                SÍNTOMA VISIBLE:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Caída abrupta de frecuencia de reloj (ej. de 5.2 GHz a 3.1 GHz).
              </p>
            </div>
          </div>

          {/* Wall 2: Power Limit Throttling */}
          <div className="p-4 bg-[#14100c] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400 font-bold uppercase">MURO 02</span>
                <span className="text-zinc-500">PL1 / PL2 / TDP</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                Power Limit Throttling
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Incluso con el procesador a fríos 62°C bajo un cooler masivo, el CPU se frena si agota su ventana temporal (Tau) de consumo energético autorizada por el fabricante o por el BIOS de la placa madre.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-zinc-400 uppercase font-bold block mb-0.5">
                SÍNTOMA VISIBLE:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Frecuencia estancada en un techo fijo pese a tener margen térmico.
              </p>
            </div>
          </div>

          {/* Wall 3: VRM Thermal Throttling */}
          <div className="p-4 bg-[#14100c] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2 border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-400 font-bold uppercase">MURO 03</span>
                <span className="text-zinc-500">VRM &gt; 110°C</span>
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                VRM Thermal Throttling
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Los MOSFETs de la placa madre hierven. Aunque tengas un circuito de refrigeración líquida impecable, si el disipador de las fases no recibe aire fresco, la placa madre frena la CPU a 800 MHz para no quemarse.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                SÍNTOMA VISIBLE:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Congelamiento total momentáneo o frenada brutal del micro a 0.8 GHz.
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
                PRESIÓN POSITIVA EN EL GABINETE (EL ESTÁNDAR DE LABORATORIO)
              </h5>
              <p className="text-xs font-sans-editorial text-zinc-400 mt-0.5 max-w-2xl leading-relaxed">
                Mayor caudal de aire ingresando filtrado por el frente que saliendo por atrás y arriba. Esto fuerza al polvo a ser expulsado por las ranuras del chasis y asegura aire fresco continuo sobre las fases VRM y el SSD M.2 primario.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="p-3 bg-[#140f0c] border-l-3 border-orange-500 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-orange-400 font-bold">REGLA TERMODINÁMICA:</strong> El silicio a 80°C continuo es perfectamente seguro; el verdadero veneno son las oscilaciones térmicas bruscas de 40°C a 90°C en ciclos constantes.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 05 // VENTILADORES AL 100% →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
