import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { AlertTriangle, Layers, Zap, Gauge } from 'lucide-react';

export const Page07Chapter01Trampas: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-11"
      pageNumber={11}
      totalPages={46}
      sectionTitle="CAPÍTULO 01"
      subSlug="TRAMPAS COMERCIALES // LA FICHA TÉCNICA REAL"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header Strip */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
              PERITAJE DE MERCADO // CAPÍTULO 01
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Lo que dice la caja vs. Lo que realmente tenés
            </h3>
          </div>
          <span className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-wider hidden sm:inline">
            TRES DISCREPANCIAS CLAVE
          </span>
        </div>

        {/* Narrative Concept */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            Dos componentes con la misma cifra en gigabytes o watts pueden tener arquitecturas internas opuestas. Cuando un fabricante promociona un número grande en el envoltorio, suele compensar el costo recortando silenciosamente el ancho de banda del bus, la memoria caché o la calidad de los reguladores de voltaje.
          </p>
        </div>

        {/* The 3 Major Commercial Traps (Generous Editorial Blocks) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-stretch">
          
          {/* Trap 1: VRAM & Bus */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 hover:border-yellow-400/50 transition-colors rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <span className="text-xs font-mono-tech font-bold text-yellow-400 uppercase">TRAMPA 01</span>
                <Gauge className="w-4 h-4 text-yellow-400" />
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                La VRAM de 8 GB Recortada
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                El folleto destaca con orgullo "8 GB de VRAM". Sin embargo, si la placa utiliza un bus de memoria estrangulado a 128 bits en lugar de 256 bits, el ancho de banda efectivo cae drásticamente.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                CONSECUENCIA EN EL JUEGO:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Hasta un 35% menos de rendimiento en resoluciones altas cuando las texturas desbordan el bus.
              </p>
            </div>
          </div>

          {/* Trap 2: SSDs QLC without DRAM */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 hover:border-yellow-400/50 transition-colors rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <span className="text-xs font-mono-tech font-bold text-zinc-400 uppercase">TRAMPA 02</span>
                <Layers className="w-4 h-4 text-zinc-400" />
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                SSDs QLC Sin Memoria DRAM
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                La caja promete lecturas de "3500 MB/s". Pero al carecer de chip DRAM dedicado y usar celdas QLC lentas, esa velocidad solo se sostiene durante los primeros gigas de caché pseudo-SLC.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                CONSECUENCIA EN EL JUEGO:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Al agotarse la caché en descargas pesadas, la escritura cae a 70 MB/s: más lento que un disco de hace diez años.
              </p>
            </div>
          </div>

          {/* Trap 3: Watts Pico vs Continuos */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 hover:border-yellow-400/50 transition-colors rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <span className="text-xs font-mono-tech font-bold text-zinc-400 uppercase">TRAMPA 03</span>
                <Zap className="w-4 h-4 text-zinc-400" />
              </div>
              <h4 className="font-display font-black text-base text-white uppercase tracking-wide mb-1">
                Watts Pico vs. Watts Continuos
              </h4>
              <p className="text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                Fuentes genéricas etiquetadas con números atractivos como "650W" que en la letra chica entregan apenas 320W en el riel crucial de +12V, el único que alimenta al microprocesador y a la placa de video.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 bg-black/40 -mx-4 -mb-4 p-3 rounded-b-xl">
              <span className="text-[10px] font-mono-tech text-rose-400 uppercase font-bold block mb-0.5">
                CONSECUENCIA EN EL JUEGO:
              </span>
              <p className="text-[11px] font-mono-tech text-zinc-300 leading-tight">
                Reinicios espontáneos en seco apenas la tarjeta gráfica solicita un micro-pico de energía transitoria.
              </p>
            </div>
          </div>

        </div>

        {/* Closing Metrology Rule */}
        <div className="p-3 bg-[#111520] border-l-3 border-yellow-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-yellow-400 font-bold">REGLA FORENSE:</strong> Nunca compres hardware por una cifra aislada. Verificá siempre la topología del bus, la presencia de caché DRAM y el amperaje en el riel de +12V.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden md:inline shrink-0">
            SIGUIENTE: AUDITORÍA POWERSHELL →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
