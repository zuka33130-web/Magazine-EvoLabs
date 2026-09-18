import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';

export const Page06Chapter02: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-06"
      pageNumber={6}
      totalPages={24}
      sectionTitle="CAPÍTULO 02"
      subSlug="INTERCONEXIÓN // LA ILUSIÓN DEL ANCHO DE BANDA"
      accentColor="#F59E0B"
    >
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-amber-400 uppercase font-bold">
            CAPÍTULO 02 // SISTEMA INTEGRADO
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Cómo Trabajan Juntos
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          CPU + RAM + GPU + BUSES EN SINCRONÍA
        </span>
      </div>

      {/* Latency vs Bandwidth Visual Callout Header */}
      <div className="bg-[#0c0f16] border border-zinc-800 rounded-lg p-2.5 mb-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 border-b border-zinc-800/80 pb-1 mb-1.5">
          <span className="text-amber-400 font-bold uppercase">LA PARADOJA: VELOCIDAD BRUTA VS TIEMPO DE RESPUESTA</span>
          <span>MEDICIÓN EN NANOSEGUNDOS (ns)</span>
        </div>

        {/* Comparison Graphic: Why CL30 beats high MT/s */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-[#12151f] border border-amber-400/40 rounded">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="font-mono-tech font-bold text-white text-[10px]">DDR5 6000 MT/s // CL30</span>
              <span className="text-emerald-400 font-mono-tech font-bold text-[11px]">10.00 ns LATENCIA REAL</span>
            </div>
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-1 leading-tight">
              Excelente para gaming: el controlador de memoria (IMC) trabaja en sincronía 1:1 con el reloj de bus (UCLK).
            </p>
          </div>

          <div className="p-2 bg-[#12151f] border border-zinc-800 rounded">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="font-mono-tech font-bold text-white text-[10px]">DDR5 6800 MT/s // CL40</span>
              <span className="text-amber-400 font-mono-tech font-bold text-[11px]">11.76 ns LATENCIA REAL</span>
            </div>
            <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '70%' }} />
            </div>
            <p className="text-[9px] text-zinc-400 font-sans-editorial mt-1 leading-tight">
              Mayor tasa de transferencia continua en folleto, pero 17% más lenta en responder ante pedidos aleatorios.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Body: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
        
        {/* Left 7 Cols */}
        <div className="md:col-span-7 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            Un computador no es una colección estática de piezas pegadas a una placa; es una coreografía electromagnética donde ningún componente puede actuar en solitario. Cuando disparás en un juego o renderizás un fotograma, el disco NVMe le envía los datos al CPU a través del bus PCIe, el CPU los aloja en la memoria RAM, la RAM los transfiere a la GPU por las líneas de video, y la GPU los procesa en sus núcleos de sombreado.
          </p>

          <p className="text-zinc-400 text-[11px]">
            Si cualquiera de esas autopistas intermedias tiene un bache o una fila de peaje congestionada, todos los demás componentes se ven obligados a <strong>esperar</strong>. El procesador más rápido del mundo se detiene en seco cuando experimenta un <em>cache miss</em> y debe buscar información en una RAM lenta.
          </p>
        </div>

        {/* Right 5 Cols: Technical Photo & Data Spec Box */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-2 bg-[#0c0f16] border border-zinc-800 p-2.5 rounded-lg">
          <div className="space-y-1 text-[9px] font-mono-tech">
            <span className="text-zinc-400 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-0.5">
              JERARQUÍA DE LATENCIAS EN SILICIO
            </span>

            <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/60">
              <span className="text-zinc-300">CACHÉ L1 DE CPU:</span>
              <span className="text-emerald-400 font-bold">~ 1 ns // 4 ciclos</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/60">
              <span className="text-zinc-300">CACHÉ L2 DE CPU:</span>
              <span className="text-emerald-400 font-bold">~ 3 ns // 12 ciclos</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/60">
              <span className="text-zinc-300">CACHÉ L3 (3D V-CACHE):</span>
              <span className="text-yellow-400 font-bold">~ 10 ns // 40 ciclos</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/60">
              <span className="text-zinc-300">MEMORIA RAM DDR5:</span>
              <span className="text-amber-400 font-bold">~ 60 - 75 ns</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-zinc-300">DISCO NVMe PCIe 4.0:</span>
              <span className="text-rose-400 font-bold">~ 20.000 ns (20 µs)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-03) */}
      <InternetDiceEvoMide
        idMito="MITO-03"
        consejoPopular="Forzá 'Resizable BAR' (ReBAR / SAM) en todos tus juegos mediante NVIDIA Profile Inspector o BIOS: ganarás 15% de FPS gratis en cualquier título."
        fuentePopular="Guías de optimización de foros de GPU"
        realidadTecnica="El estándar PCIe tradicional limitaba los accesos de CPU a la VRAM a bloques de 256 MB. ReBAR permite al procesador mapear toda la memoria gráfica. Sin embargo, en motores DirectX 9 o DirectX 11 antiguos sin perfil oficial, forzar ReBAR satura el bus PCIe con pedidos pequeños y desordenados, provocando contención de tráfico y tartamudeo (micro-stuttering)."
        experimento="Pruebas controladas con CapFrameX en dos escenarios: A) Cyberpunk 2077 (DX12 moderno con perfil) y B) Dishonored 2 (DX11 sin perfil oficial de driver)."
        herramientaMedicion="CapFrameX + MSI Afterburner Frame Tracking"
        resultado="condicional"
        resultadoDetalle="Cyberpunk 2077: +9.4% en 1% Lows (Mejoró). Dishonored 2: -16.2% en 1% Lows con picos de frametime de 28ms (Empeoró). No es un truco universal."
        riesgo="Inestabilidad de cuadros y tirones bruscos en juegos no soportados."
        comoRevertirlo="Dejar ReBAR en 'Driver Profile Default' (NVIDIA) o activarlo únicamente en juegos donde el fabricante validó el perfil."
      />
    </MagazineMasterPage>
  );
};
