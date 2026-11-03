import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Camera, CheckSquare, Shield, Terminal, HardDrive, Cpu, Activity, Monitor, AlertCircle } from 'lucide-react';

export const Page05PruebaCero: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-05"
      pageNumber={5}
      totalPages={46}
      sectionTitle="PRUEBA CERO // BASELINE"
      subSlug="EXPEDIENTE FORENSE // ESTADO INICIAL"
      accentColor="#EAB308"
    >
      {/* Top Banner / Section Header */}
      <div className="mb-3.5 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            PUNTO DE PARTIDA METROLÓGICO // LÍNEA BASE INMUTABLE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            Antes de cambiar tu PC, sacále una foto.
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          REF: EVO-BASELINE-000
        </span>
      </div>

      {/* Main Narrative Lead */}
      <div className="p-3.5 bg-gradient-to-r from-yellow-400/15 via-[#10141e] to-transparent border-l-4 border-yellow-400 rounded-r-lg mb-3.5">
        <div className="flex items-center gap-2 mb-1">
          <Camera className="w-4 h-4 text-yellow-400" />
          <span className="font-mono-tech text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
            LA REGLA DEL EXPERIMENTO CIENTÍFICO
          </span>
        </div>
        <p className="font-sans-editorial text-xs sm:text-[13px] text-zinc-200 leading-relaxed">
          No podés saber si tu PC mejoró si no sabés exactamente cómo estaba antes de empezar. El <strong className="text-white">Baseline EVO</strong> es la fotografía forense de tu sistema en su estado virgen: congelá los datos basales hoy para evaluar con números irrefutables cada paso de este tomo.
        </p>
      </div>

      {/* Ficha Forense Visual: EXPEDIENTE EVO // ESTADO INICIAL */}
      <div className="bg-[#0b0e14] border-2 border-zinc-800 rounded-xl p-4 flex-1 flex flex-col justify-between shadow-2xl space-y-3">
        
        {/* Header de la Ficha */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
            <span className="font-mono-tech font-black text-white text-xs uppercase tracking-widest">
              EXPEDIENTE EVO // ESTADO INICIAL DEL EQUIPO
            </span>
          </div>
          <span className="font-mono-tech text-[9px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
            COMPLETAR ANTES DE MODIFICAR UN SOLO AJUSTE
          </span>
        </div>

        {/* 3 Blocks of Fields: Básico, Hardware y EVO+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-tech">
          
          {/* Bloque 1: Sistema y CPU */}
          <div className="p-3 bg-[#11141d] border border-zinc-800 rounded-lg space-y-2">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block border-b border-zinc-800/80 pb-1">
              01 // SISTEMA OPERATIVO & CPU
            </span>

            <div className="space-y-1.5 text-[10.5px]">
              <div>
                <span className="text-zinc-500 block text-[9px]">SISTEMA Y EDICIÓN:</span>
                <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                  Ej: Windows 11 Pro 64-bit (Build 22631)
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block text-[9px]">PROCESADOR (CPU):</span>
                <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                  Ej: AMD Ryzen 5 5600 / Intel Core i5-12400F
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-zinc-500 block text-[9px]">NÚCLEOS / HILOS:</span>
                  <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                    6C / 12T
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px]">TEMP. REPOSO:</span>
                  <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-yellow-400/90 font-bold">
                    -- °C
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 2: RAM y Almacenamiento */}
          <div className="p-3 bg-[#11141d] border border-zinc-800 rounded-lg space-y-2">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block border-b border-zinc-800/80 pb-1">
              02 // MEMORIA & DISCOS
            </span>

            <div className="space-y-1.5 text-[10.5px]">
              <div>
                <span className="text-zinc-500 block text-[9px]">RAM TOTAL & CONFIGURACIÓN:</span>
                <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                  Ej: 16 GB (2×8 GB en Slots 2 y 4)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-zinc-500 block text-[9px]">VELOCIDAD:</span>
                  <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                    3200 MHz / CL16
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px]">CANAL:</span>
                  <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-emerald-400 font-bold">
                    Dual Channel
                  </div>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block text-[9px]">UNIDAD PRINCIPAL C:</span>
                <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                  Ej: NVMe PCIe 4.0 1 TB (Libre: 380 GB)
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 3: Gráfica y Pantalla */}
          <div className="p-3 bg-[#11141d] border border-zinc-800 rounded-lg space-y-2">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block border-b border-zinc-800/80 pb-1">
              03 // GPU & MONITOR
            </span>

            <div className="space-y-1.5 text-[10.5px]">
              <div>
                <span className="text-zinc-500 block text-[9px]">PLACA DE VIDEO (GPU):</span>
                <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                  Ej: NVIDIA GeForce RTX 3060 12 GB
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-zinc-500 block text-[9px]">DRIVER:</span>
                  <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                    Versión 551.86
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px]">ENLACE:</span>
                  <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                    PCIe x16 4.0
                  </div>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block text-[9px]">PANTALLA & TASA DE REFRESCO:</span>
                <div className="bg-black/60 border border-zinc-800 rounded px-2 py-1 text-zinc-300">
                  Ej: 1920×1080 @ 144 Hz (DisplayPort)
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Ficha de Identidad Táctica (Pasaporte Basal Inmutable) */}
        <div className="p-3 bg-[#131722] border border-yellow-400/40 rounded-lg space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="text-[10px] font-mono-tech font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 rounded-xs" />
              FICHA DE IDENTIDAD TÁCTICA // PASAPORTE BASAL INMUTABLE
            </span>
            <span className="text-[9px] font-mono-tech text-zinc-400">
              VALOR BASAL VS. POST-AUDITORÍA
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-mono-tech">
            <div className="p-2 bg-black/60 border border-zinc-800 rounded flex flex-col justify-between">
              <span className="text-zinc-400 block text-[8.5px] uppercase">FRECUENCIA BASE CPU:</span>
              <div className="flex justify-between items-baseline mt-1 text-zinc-300">
                <span className="text-[9px] text-zinc-500">INI:</span>
                <span className="text-yellow-400 font-bold">--- GHz</span>
              </div>
            </div>
            <div className="p-2 bg-black/60 border border-zinc-800 rounded flex flex-col justify-between">
              <span className="text-zinc-400 block text-[8.5px] uppercase">LATENCIA DPC REPOSO:</span>
              <div className="flex justify-between items-baseline mt-1 text-zinc-300">
                <span className="text-[9px] text-zinc-500">INI:</span>
                <span className="text-emerald-400 font-bold">&lt; 500 μs</span>
              </div>
            </div>
            <div className="p-2 bg-black/60 border border-zinc-800 rounded flex flex-col justify-between">
              <span className="text-zinc-400 block text-[8.5px] uppercase">1% LOW CRÍTICO:</span>
              <div className="flex justify-between items-baseline mt-1 text-zinc-300">
                <span className="text-[9px] text-zinc-500">INI:</span>
                <span className="text-yellow-400 font-bold">--- FPS</span>
              </div>
            </div>
            <div className="p-2 bg-black/60 border border-zinc-800 rounded flex flex-col justify-between">
              <span className="text-zinc-400 block text-[8.5px] uppercase">TEMP SOSTENIDA:</span>
              <div className="flex justify-between items-baseline mt-1 text-zinc-300">
                <span className="text-[9px] text-zinc-500">INI:</span>
                <span className="text-amber-400 font-bold">--- °C</span>
              </div>
            </div>
            <div className="p-2 bg-black/60 border border-zinc-800 rounded flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-zinc-400 block text-[8.5px] uppercase">ANCHO BANDA RAM:</span>
              <div className="flex justify-between items-baseline mt-1 text-zinc-300">
                <span className="text-[9px] text-zinc-500">INI:</span>
                <span className="text-sky-400 font-bold">--- GB/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote explicativo */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-sans-editorial text-zinc-400">
          <span>
            <strong className="text-white">Recordatorio EVO:</strong> Anotá estos valores en un bloc de notas o capturá tu pantalla. Cuando llegues al Dossier de Puesta a Punto, podrás comprobar cuántos procesos y milisegundos recuperaste.
          </span>
          <span className="font-mono-tech text-yellow-400 font-bold shrink-0 ml-4 hidden sm:inline">
            EXPEDIENTE CERO // GUARDADO
          </span>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
