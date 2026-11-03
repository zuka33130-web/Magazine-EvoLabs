import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Cpu, Zap, HardDrive, ShieldCheck, ArrowRight } from 'lucide-react';
import { MAGAZINE_IMAGES } from '../../data/magazineImages';

export const Page04Topology: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-08"
      pageNumber={8}
      totalPages={46}
      sectionTitle="0x02 ATLAS DE SILICIO"
      subSlug="TOPOLOGÍA DE PISTAS & LÍNEAS DE TRANSMISIÓN"
      accentColor="#EAB308"
    >
      {/* Article Header */}
      <div className="mb-3 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            0x02 // ATLAS DE ANATOMÍA DE SILICIO (FASCÍCULO PARTE 1)
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Topología de Pistas, Buses y Física
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          IMPEDANCIA & MICROONDAS
        </span>
      </div>

      {/* Main Narrative Introduction */}
      <div className="mb-3 text-[11px] sm:text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-4xl">
        <p className="magazine-dropcap text-zinc-200">
          La placa madre es una red compleja de autopistas donde las señales viajan a velocidades cercanas a la luz. Cada pista actúa como una línea de transmisión de microondas a 6000+ MT/s: cualquier imperfección en la impedancia o un stub sin terminar genera reflexiones destructivas. Por eso la colocación en zócalos A2 y B2 es una necesidad física ineludible para evitar el eco eléctrico en los extremos libres de las trazas.
        </p>
      </div>

      {/* Main Architectural Schematic / Technical Cutaway */}
      <div className="bg-[#0b0d13] border-2 border-zinc-800 rounded-xl p-3 sm:p-4 flex-1 flex flex-col justify-between shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_#facc15]" />
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-zinc-100">
              MAPA DE BUSES DIRECTOS VS BUSES COMPARTIDOS
            </span>
          </div>
          <span className="text-[10px] font-mono-tech text-zinc-500">
            SOCKET LGA / AM5 // CHIPSET DMI 4.0 / PCIe x4
          </span>
        </div>

        {/* Visual Schematic Diagram with Generous Breathing Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch flex-1">
          
          {/* Central CPU Block (Hero) */}
          <div className="lg:col-span-5 bg-[#121622] border-2 border-yellow-400 rounded-lg p-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-tech font-black text-black bg-yellow-400 px-2 py-0.5 rounded uppercase tracking-wider">
                CORAZÓN // CPU DIE
              </span>
              <span className="text-[10px] font-mono-tech text-yellow-300 font-semibold">IMC INTEGRADO</span>
            </div>

            {/* Foto Pericial de Trazas Microondas */}
            <div className="relative rounded overflow-hidden border border-yellow-400/40 my-1.5">
              <img
                src={MAGAZINE_IMAGES.daisyChainPcb}
                alt="Trazas Daisy-Chain en PCB a 6000 MT/s"
                className="w-full h-20 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/85 px-2 py-0.5 text-[8px] font-mono-tech text-yellow-300 flex items-center justify-between">
                <span>EVIDENCIA PCB // TOPOLOGÍA DAISY-CHAIN</span>
                <span className="text-zinc-400">SLOTS A2 / B2</span>
              </div>
            </div>

            <div className="my-1.5 space-y-0.5 text-center py-1.5 bg-black/40 rounded border border-yellow-400/20">
              <h4 className="font-display font-black text-base text-white tracking-wide">
                PROCESADOR CENTRAL
              </h4>
              <p className="text-[9.5px] font-mono-tech text-zinc-300">
                Núcleos + Caché L1/L2/L3 + Controlador de Memoria
              </p>
            </div>

            <div className="p-3 bg-black/60 border border-zinc-800 rounded text-[10px] font-mono-tech space-y-1.5">
              <div className="flex justify-between items-center text-zinc-300 border-b border-zinc-800/80 pb-1">
                <span>LÍNEAS PCIE DIRECTAS:</span>
                <span className="text-yellow-400 font-bold">16x GPU + 4x NVMe M.2</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>ENLACE AL CHIPSET:</span>
                <span className="text-zinc-200">DMI 4.0 x8 / PCIe 4.0 x4</span>
              </div>
            </div>
          </div>

          {/* Right Direct Connections (Spacious 2x2 Grid) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* RAM Block */}
            <div className="p-3.5 bg-[#0e121a] border border-zinc-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-tech text-yellow-400 font-bold">CANAL A / B</span>
                  <span className="text-[9px] font-mono-tech text-zinc-500">128-BIT TOTAL</span>
                </div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-zinc-100 uppercase">MEMORIA RAM DDR5</h5>
                <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  Conexión directa punto a punto con el IMC. Si falta un módulo, se pierde la mitad del ancho de banda instantáneamente.
                </p>
              </div>
              <span className="text-[9px] font-mono-tech text-yellow-300/90 bg-yellow-400/10 border border-yellow-400/30 px-2 py-1 rounded mt-2 inline-block">
                HABITUAL (2 MÓDULOS): A2 / B2 (VER MANUAL)
              </span>
            </div>

            {/* GPU PCIe Block */}
            <div className="p-3.5 bg-[#0e121a] border border-zinc-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-tech text-emerald-400 font-bold">PCIe 5.0 / 4.0 x16</span>
                  <span className="text-[9px] font-mono-tech text-zinc-500">HASTA 64 GB/s</span>
                </div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-zinc-100 uppercase">GPU DEDICADA</h5>
                <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  Carril exclusivo al silicio del CPU. Cuidado: en varias placas, instalar un 2do M.2 bifurca este puerto a x8.
                </p>
              </div>
              <span className="text-[9px] font-mono-tech text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded mt-2 inline-block">
                ANCHO DE BANDA MÁXIMO
              </span>
            </div>

            {/* Direct NVMe Block */}
            <div className="p-3.5 bg-[#0e121a] border border-zinc-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-tech text-sky-400 font-bold">M.2_1 PRIMARIO</span>
                  <span className="text-[9px] font-mono-tech text-zinc-500">PCIe x4 CPU</span>
                </div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-zinc-100 uppercase">NVMe PRINCIPAL</h5>
                <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  El slot superior más cercano al socket va directo al microprocesador sin pasar por el cuello del chipset.
                </p>
              </div>
              <span className="text-[9px] font-mono-tech text-sky-300 bg-sky-500/10 border border-sky-500/30 px-2 py-1 rounded mt-2 inline-block">
                TRANSFERENCIA DIRECTA: 7.000+ MB/s
              </span>
            </div>

            {/* Chipset Block */}
            <div className="p-3.5 bg-[#0e121a] border border-zinc-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono-tech text-amber-500 font-bold">CHIPSET (PCH)</span>
                  <span className="text-[9px] font-mono-tech text-zinc-500">BUS COMPARTIDO</span>
                </div>
                <h5 className="font-display font-bold text-xs sm:text-sm text-zinc-100 uppercase">PERIFÉRICOS & RED</h5>
                <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed mt-1">
                  Puertos USB, audio, SATA, placa de red Ethernet y slots M.2 secundarios compiten por el mismo enlace de subida.
                </p>
              </div>
              <span className="text-[9px] font-mono-tech text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded mt-2 inline-block">
                CUELLO DE BOTELLA SI SE SATURA
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Forensic Pro-Tip */}
      <div className="mt-4 p-3 bg-[#10141f] border-l-3 border-yellow-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold uppercase tracking-wider">DESCUBRIMIENTO FORENSE:</span>
          <span>
            Verificá en GPU-Z si tu placa de video corre a <strong className="text-white">x16 4.0/5.0</strong>. Si indica <strong className="text-rose-400">x8</strong> bajo carga 3D, tu segundo NVMe está compartiendo carriles con la GPU.
          </span>
        </div>
        <span className="text-zinc-500 text-[10px] uppercase hidden md:inline shrink-0">
          SIGUIENTE: MITO 01 // SLOTS DE RAM →
        </span>
      </div>
    </MagazineMasterPage>
  );
};
