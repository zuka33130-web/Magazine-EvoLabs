import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Clock, Zap, ArrowRight, Gauge, Cpu } from 'lucide-react';

export const Page12Chapter02Latencias: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-16"
      pageNumber={16}
      totalPages={46}
      sectionTitle="CAPÍTULO 02"
      subSlug="METROLOGÍA DE BUSES // LATENCIA VS ANCHO DE BANDA"
      accentColor="#F59E0B"
    >
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-2 flex items-baseline justify-between">
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
            El marketing de la memoria suele destacar una sola métrica: megatransferencias por segundo (MT/s). Sin embargo, ancho de banda y latencia afectan cargas de trabajo distintas. Mientras que el ancho de banda beneficia la transferencia secuencial de grandes volúmenes de datos, la latencia de acceso aleatorio resulta crucial para motores interactivos y juegos. Ambas variables deben evaluarse en equilibrio según el procesador, la plataforma y el perfil de uso.
          </p>
        </div>

        {/* The Comparison Graphic: Why CL30 beats High MT/s */}
        <div className="bg-[#0b0e15] border-2 border-zinc-800 rounded-xl p-3 sm:p-3.5 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-400 border-b border-zinc-800 pb-1.5 mb-2">
            <span className="text-amber-400 font-bold uppercase text-[11px]">EJEMPLO DIDÁCTICO: DDR5 6000 CL30 VS. DDR5 6800 CL40</span>
            <span className="text-zinc-500 text-[10px]">FÓRMULA CAS: (CL × 2000) / MT/s = LATENCIA CAS TEÓRICA (ns)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans-editorial">
            <div className="p-2.5 bg-[#121622] border-2 border-emerald-500/50 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono-tech font-bold text-white text-xs">DDR5 6000 MT/s // CL30</span>
                  <span className="text-emerald-400 font-mono-tech font-bold text-xs sm:text-sm">10.00 ns CAS TEÓRICA</span>
                </div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden my-1.5">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed mt-1">
                  <strong>Relación equilibrada:</strong> En arquitecturas donde el controlador de memoria (IMC) opera en sincronía directa 1:1 con el reloj de bus (UCLK), mantener latencias CAS bajas preserva un tiempo de respuesta óptimo en accesos aleatorios.
                </p>
              </div>
              <span className="text-[9.5px] font-mono-tech text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">
                CONSISTENCIA DE RESPUESTA EN ACCESOS ALEATORIOS
              </span>
            </div>

            <div className="p-2.5 bg-[#121622] border border-zinc-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono-tech font-bold text-white text-xs">DDR5 6800 MT/s // CL40</span>
                  <span className="text-amber-400 font-mono-tech font-bold text-xs sm:text-sm">11.76 ns CAS TEÓRICA</span>
                </div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden my-1.5">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '68%' }} />
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed mt-1">
                  <strong>Mayor ancho, mayor tiempo CAS:</strong> Ofrece mayor ancho de banda secuencial, pero con mayor latencia CAS teórica. Si la plataforma conmuta a divisor 1:2 (UCLK a la mitad), el impacto en latencia total dependerá de si la frecuencia extra compensa el divisor.
                </p>
              </div>
              <span className="text-[9.5px] font-mono-tech text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded mt-2 inline-block">
                MAYOR TASA SECUENCIAL // VERIFICAR IMPACTO EN LATENCIA
              </span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-zinc-800/80 text-[9.5px] font-mono-tech text-zinc-400">
            * NOTA METROLÓGICA: La fórmula CAS estima el tiempo de acceso de la primera palabra; la latencia total real del subsistema incluye timings secundarios, terciarios, arquitectura del IMC y topología del sistema.
          </div>
        </div>

        {/* Silicon Latency Hierarchy Table (Clean, spacious, zero dashboard clutter) */}
        <div className="p-2.5 bg-[#0e111a] border border-zinc-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>JERARQUÍA COMPLETA DE LATENCIAS EN SILICIO & CICLOS DE DETENCIÓN</span>
            </span>
            <span className="text-[10px] font-mono-tech text-zinc-500">PENALIZACIÓN DE ACCESO</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono-tech">
            <div className="p-2 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">CACHÉ L1 (CPU)</span>
              <span className="text-emerald-400 font-bold text-sm">~ 1.0 ns</span>
              <span className="text-zinc-400 block text-[9px] mt-0.5">4 ciclos // En Die</span>
            </div>

            <div className="p-2 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">CACHÉ L2 (CPU)</span>
              <span className="text-emerald-400 font-bold text-sm">~ 3.2 ns</span>
              <span className="text-zinc-400 block text-[9px] mt-0.5">14 ciclos // Núcleo</span>
            </div>

            <div className="p-2 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">CACHÉ L3 (V-CACHE)</span>
              <span className="text-yellow-400 font-bold text-sm">~ 11.5 ns</span>
              <span className="text-zinc-400 block text-[9px] mt-0.5">45 ciclos // Compartida</span>
            </div>

            <div className="p-2 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">RAM DDR5 (IMC)</span>
              <span className="text-amber-400 font-bold text-sm">~ 65 - 75 ns</span>
              <span className="text-rose-400 block text-[9px] mt-0.5">280 ciclos (CPU Stall)</span>
            </div>

            <div className="p-2 bg-black/40 border border-zinc-800 rounded">
              <span className="text-zinc-500 block text-[9px] uppercase">NVMe PCIe 4.0</span>
              <span className="text-rose-400 font-bold text-sm">~ 20.000 ns</span>
              <span className="text-zinc-400 block text-[9px] mt-0.5">20 microsegundos</span>
            </div>
          </div>

          {/* Diálogo entre subsistemas: Ancho de banda vs latencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] font-sans-editorial">
            <div className="p-2.5 bg-[#090c12] border border-zinc-800 rounded">
              <span className="font-mono-tech text-[10px] text-amber-400 font-bold block mb-1">
                EL DIÁLOGO DE TRANSFERENCIA (RAM ↔ BUS PCIE ↔ VRAM)
              </span>
              <p className="text-zinc-300 leading-relaxed text-[10.5px]">
                La GPU procesa fotogramas accediendo a su VRAM local a tasas colosales de <strong>500 a 1.000+ GB/s</strong>. Cuando un juego desborda la VRAM y debe consultar la memoria RAM del sistema, los datos se transfieren por el bus PCIe 4.0 x16 a solo <strong>31.5 GB/s</strong>. Esa caída abrupta de 30x en tasa de transferencia colapsa la cola de renderizado.
              </p>
            </div>
            <div className="p-2.5 bg-[#090c12] border border-zinc-800 rounded">
              <span className="font-mono-tech text-[10px] text-emerald-400 font-bold block mb-1">
                EL ROL DE RESIZABLE BAR & DIRECTSTORAGE
              </span>
              <p className="text-zinc-300 leading-relaxed text-[10.5px]">
                Históricamente el CPU solo podía direccionar la VRAM en bloques de 256 MB. <strong>ReBAR</strong> permite a la CPU mapear la totalidad de la memoria gráfica simultáneamente, eliminando cuellos de botella de comandos de dibujado (Draw Calls), mientras <strong>DirectStorage</strong> descomprime activos de NVMe en GPU sin sobrecargar la CPU.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="p-2.5 bg-[#111520] border-l-3 border-amber-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span className="text-[11px]">
            <strong className="text-amber-400 font-bold">REGLA DE ARQUITECTURA EVO:</strong> La memoria caché L3 apilada (3D V-Cache) y los perfiles de baja latencia existen para evitar que el microprocesador detenga su tubería de cómputo (pipeline stall) esperando los 70 ns de la memoria externa.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: MITO 03 // RESIZABLE BAR →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
