import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { AlertTriangle, Layers, Zap, Gauge, Monitor, Activity } from 'lucide-react';
import { MAGAZINE_IMAGES } from '../../data/magazineImages';

export const Page07Chapter01Trampas: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-11"
      pageNumber={11}
      totalPages={46}
      sectionTitle="0x03 MITOS VS. REALIDAD"
      subSlug="DESMONTE DE MARKETING // VRAM, 720P & BUS PCIE"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        {/* Header Strip */}
        <div className="border-b border-zinc-800 pb-2 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
              0x03 // MITOS VS. REALIDAD (FASCÍCULO // BLOQUE 23)
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Destrucción Quirúrgica del Marketing Comercial
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            EVIDENCIA DE BANCO // EVO LABS
          </span>
        </div>

        {/* Narrative Lead */}
        <div className="text-[11px] sm:text-xs text-zinc-300 font-sans-editorial leading-relaxed">
          <p>
            El marketing de hardware se nutre de números inflados y métricas superficiales que ocultan los verdaderos cuellos de botella del sistema. En este bloque desmantelamos tres de las trampas más costosas de los foros de tecnología.
          </p>
        </div>

        {/* Real Forensic Probe Photo Banner */}
        <div className="relative rounded-lg overflow-hidden border border-yellow-400/40 bg-black/60 shadow-lg">
          <img
            src={MAGAZINE_IMAGES.pcieGpuBusForensic}
            alt="Peritaje de enlace de bus PCIe con osciloscopio y multímetro"
            className="w-full h-20 sm:h-24 object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-black/85 px-2.5 py-0.5 text-[8.5px] font-mono-tech text-yellow-300 flex items-center justify-between border-t border-zinc-800">
            <span>BANCO FORENSE // MEDICIÓN DIRECTA EN CARRILES PCIE (NEGOCIACIÓN REAL x8 VS x16)</span>
            <span className="text-zinc-400 hidden sm:inline">ANÁLISIS DE ANCHO DE BANDA REAL</span>
          </div>
        </div>

        {/* The 3 Major Commercial Traps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 items-stretch">
          
          {/* Trap 1: VRAM 128-bit vs 256-bit */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 hover:border-yellow-400/50 transition-colors rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1.5">
                <span className="text-[10px] font-mono-tech font-bold text-yellow-400 uppercase">01 // ANCHO DE BUS VRAM</span>
                <Gauge className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wide mb-1">
                Tanque de 16 GB con Manguera de 128 Bits
              </h4>
              <p className="text-[10.5px] font-sans-editorial text-zinc-300 leading-snug">
                Tener 16 GB no sirve si la tubería está estrangulada a 128 bits. En resoluciones altas, las texturas desbordan el bus y provocan caídas drásticas de fluidez por falta de ancho de banda efectivo.
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/80 bg-black/40 -mx-3 -mb-3 p-2 rounded-b-xl">
              <span className="text-[9px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                VEREDICTO PERICIAL:
              </span>
              <p className="text-[10px] font-mono-tech text-zinc-300 leading-tight">
                El bus de memoria es el multiplicador real del ancho de banda.
              </p>
            </div>
          </div>

          {/* Trap 2: Falso Mito de 720p */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 hover:border-yellow-400/50 transition-colors rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1.5">
                <span className="text-[10px] font-mono-tech font-bold text-zinc-400 uppercase">02 // EL MITO DE 720P</span>
                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wide mb-1">
                Bajar Resolución No "Alivia" Toda la PC
              </h4>
              <p className="text-[10.5px] font-sans-editorial text-zinc-300 leading-snug">
                Reducir la resolución de 1080p a 720p alivia la carga de rasterizado en la GPU, pero traslada de golpe una avalancha de cuadros por segundo al hilo principal del CPU, colapsándolo si el procesador es el cuello de botella.
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/80 bg-black/40 -mx-3 -mb-3 p-2 rounded-b-xl">
              <span className="text-[9px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                VEREDICTO PERICIAL:
              </span>
              <p className="text-[10px] font-mono-tech text-zinc-300 leading-tight">
                Bajar resolución aumenta la dependencia del procesador.
              </p>
            </div>
          </div>

          {/* Trap 3: Falacia del Promedio de FPS */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 hover:border-yellow-400/50 transition-colors rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-1.5">
                <span className="text-[10px] font-mono-tech font-bold text-zinc-400 uppercase">03 // PROMEDIO ARITMÉTICO</span>
                <Activity className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <h4 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wide mb-1">
                La Falacia de los 120 FPS Promedio
              </h4>
              <p className="text-[10.5px] font-sans-editorial text-zinc-300 leading-snug">
                Un contador que marca 120 FPS promedio puede enmascarar caídas bruscas a 15 FPS durante 100 milisegundos críticos. El ojo percibe el tirón; la estadística promedio lo maquilla. La métrica real es el Percentil 1% Low.
              </p>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/80 bg-black/40 -mx-3 -mb-3 p-2 rounded-b-xl">
              <span className="text-[9px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                VEREDICTO PERICIAL:
              </span>
              <p className="text-[10px] font-mono-tech text-zinc-300 leading-tight">
                El 1% Low define la suavidad motriz real, nunca el promedio.
              </p>
            </div>
          </div>

        </div>

        {/* Closing Metrology Rule */}
        <div className="p-2.5 bg-[#111520] border-l-3 border-yellow-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span className="text-[10.5px]">
            <strong className="text-yellow-400 font-bold">REGLA FORENSE EVO:</strong> Nunca compres hardware ni evalúes fluidez por una cifra aislada. Verificá la relación entre ancho de bus, carga de render queue y percentiles de caída.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden md:inline shrink-0">
            SIGUIENTE: AUDITORÍA POWERSHELL →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
