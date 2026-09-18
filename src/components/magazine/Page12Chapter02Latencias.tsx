import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Clock, Zap, ArrowRight, Gauge, Cpu } from 'lucide-react';

export const Page12Chapter02Latencias: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-12"
      pageNumber={12}
      totalPages={41}
      sectionTitle="CAPÍTULO 02"
      subSlug="METROLOGÍA DE BUSES // LATENCIA VS ANCHO DE BANDA"
      accentColor="#F59E0B"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-amber-400 uppercase font-bold">
              LA ILUSIÓN DEL ANCHO DE BANDA // CAPÍTULO 02
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Velocidad Bruta vs. Tiempo de Respuesta
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            MEDICIÓN EN NANOSEGUNDOS (ns)
          </span>
        </div>

        {/* Narrative Context */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            El marketing de la memoria suele vender una sola cifra: megatransferencias por segundo (MT/s o erróneamente "MHz"). Pero en el mundo real del gaming y las aplicaciones interactivas, la latencia de acceso aleatorio (el tiempo en nanosegundos que tarda el primer byte en llegar al procesador) es infinitamente más crítica que el ancho de banda secuencial continuo.
          </p>
        </div>

        {/* The Comparison Graphic: Why CL30 beats High MT/s */}
        <div className="bg-[#0b0e15] border-2 border-zinc-800 rounded-xl p-4 sm:p-5 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 border-b border-zinc-800 pb-2 mb-3">
            <span className="text-amber-400 font-bold uppercase">CASO DE ESTUDIO: DDR5 6000 CL30 VS. DDR5 6800 CL40</span>
            <span className="text-zinc-500">FÓRMULA: (CL × 2000) / MT/s = LATENCIA (ns)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans-editorial">
            <div className="p-3.5 bg-[#121622] border-2 border-emerald-500/50 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono-tech font-bold text-white text-xs">DDR5 6000 MT/s // CL30</span>
                  <span className="text-emerald-400 font-mono-tech font-bold text-sm">10.00 ns LATENCIA REAL</span>
                </div>
                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden my-2">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed mt-2">
                  <strong>El punto óptimo para gaming:</strong> El controlador de memoria interno del procesador (IMC) trabaja en sincronía perfecta 1:1 con el reloj de bus (UCLK). Cero penalización por desincronización de divisores.
                </p>
              </div>
              <span className="text-[10px] font-mono-tech text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded mt-3 inline-block">
                RESULTADO: 1% LOWS ESTABLES Y FLUIDEZ MÁXIMA
              </span>
            </div>

            <div className="p-3.5 bg-[#121622] border border-zinc-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono-tech font-bold text-white text-xs">DDR5 6800 MT/s // CL40</span>
                  <span className="text-amber-400 font-mono-tech font-bold text-sm">11.76 ns LATENCIA REAL</span>
                </div>
                <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden my-2">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '68%' }} />
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed mt-2">
                  <strong>La trampa del folleto:</strong> Mayor tasa de transferencia en papel, pero un 17% más lenta para responder ante pedidos aleatorios del motor gráfico, obligando al IMC a conmutar al divisor 1:2 (UCLK a la mitad).
                </p>
              </div>
              <span className="text-[10px] font-mono-tech text-amber-300 bg-amber-500/10 px-2 py-1 rounded mt-3 inline-block">
                RESULTADO: MAYOR BENCHMARK CONTINUO, PEOR 1% LOW
              </span>
            </div>
          </div>
        </div>

        {/* Silicon Latency Hierarchy Table (Clean, spacious, zero dashboard clutter) */}
        <div className="p-4 bg-[#0e111a] border border-zinc-800 rounded-xl flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>JERARQUÍA COMPLETA DE LATENCIAS EN SILICIO</span>
            </span>
            <span className="text-[10px] font-mono-tech text-zinc-500">ORDEN DE MAGNITUD</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono-tech py-2">
            <div className="p-2.5 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">CACHÉ L1 (CPU)</span>
              <span className="text-emerald-400 font-bold text-sm">~ 1 ns</span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">4 ciclos de reloj</span>
            </div>

            <div className="p-2.5 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">CACHÉ L2 (CPU)</span>
              <span className="text-emerald-400 font-bold text-sm">~ 3 ns</span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">12 ciclos de reloj</span>
            </div>

            <div className="p-2.5 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">CACHÉ L3 (3D V-CACHE)</span>
              <span className="text-yellow-400 font-bold text-sm">~ 10 ns</span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">40 ciclos de reloj</span>
            </div>

            <div className="p-2.5 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">RAM DDR5</span>
              <span className="text-amber-400 font-bold text-sm">~ 60 - 75 ns</span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">250+ ciclos de espera</span>
            </div>

            <div className="p-2.5 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">NVMe PCIe 4.0</span>
              <span className="text-rose-400 font-bold text-sm">~ 20.000 ns</span>
              <span className="text-zinc-400 block text-[10px] mt-0.5">20 microsegundos</span>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="p-3 bg-[#111520] border-l-3 border-amber-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-amber-400 font-bold">CONCLUSIÓN EDITORIAL:</strong> La memoria caché L3 apilada en 3D (3D V-Cache) existe precisamente para evitar que el CPU deba esperar los 70 nanosegundos que tarda la RAM tradicional.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 03 // RESIZABLE BAR →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
