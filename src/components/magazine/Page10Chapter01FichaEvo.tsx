import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ClipboardCheck, Cpu, HardDrive, Monitor, Layers, CheckSquare } from 'lucide-react';

export const Page10Chapter01FichaEvo: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-10"
      pageNumber={10}
      totalPages={41}
      sectionTitle="FICHA DE REGISTRO PERICIAL"
      subSlug="AUDITORÍA BASAL // CAPÍTULO 01"
      accentColor="#EAB308"
    >
      <div className="flex-1 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
              EXPEDIENTE FORENSE // PÁGINA DE REGISTRO
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
              Tu Ficha Forense EVO
            </h3>
          </div>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
            REGISTRO DE SILICIO REAL
          </span>
        </div>

        {/* Narrative / Instructions */}
        <div className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
          <p>
            No confíes en lo que recordás ni en lo que te dijo el vendedor. Abrí las cuatro herramientas forenses gratuitas de referencia y completá este formulario de auditoría. Este será el punto de referencia inmutable para contrastar cualquier cambio futuro.
          </p>
        </div>

        {/* 4 Clean Diagnostic Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          
          {/* 1. CPU Section */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-yellow-400" />
                  <span className="font-mono-tech font-bold text-xs text-white uppercase">1. PROCESADOR (CPU)</span>
                </div>
                <span className="text-[10px] font-mono-tech text-yellow-300/80 bg-yellow-400/10 px-2 py-0.5 rounded">
                  HWiNFO64
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-editorial mb-3">
                Identificá el stepping de silicio, los límites de potencia PL1/PL2 (TDP real) y la temperatura TjMax.
              </p>
              <div className="space-y-2 text-xs font-mono-tech">
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">MODELO EXACTO:</span>
                  <span className="text-zinc-300 font-bold">_________________________</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">STEPPING / REVISIÓN:</span>
                  <span className="text-zinc-300 font-bold">_________________________</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-[10px]">LÍMITE DE POTENCIA (PL1):</span>
                  <span className="text-zinc-300 font-bold">______ Watts</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. RAM Section */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-mono-tech font-bold text-xs text-white uppercase">2. MEMORIA RAM</span>
                </div>
                <span className="text-[10px] font-mono-tech text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded">
                  CPU-Z (TAB 'MEMORY')
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-editorial mb-3">
                Verificá si el perfil XMP/EXPO está activo, la latencia CAS (CL) y si opera en Dual-Channel (128-bit).
              </p>
              <div className="space-y-2 text-xs font-mono-tech">
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">VELOCIDAD REAL (DRAM FREQ):</span>
                  <span className="text-zinc-300 font-bold">______ MHz (x2 = ____ MT/s)</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">LATENCIA CAS (tCL):</span>
                  <span className="text-zinc-300 font-bold">CL ______</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-[10px]">CANAL (CHANNEL #):</span>
                  <span className="text-zinc-300 font-bold">2 x 64-bit / DUAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. GPU Section */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono-tech font-bold text-xs text-white uppercase">3. TARJETA GRÁFICA</span>
                </div>
                <span className="text-[10px] font-mono-tech text-emerald-300/80 bg-emerald-400/10 px-2 py-0.5 rounded">
                  GPU-Z
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-editorial mb-3">
                Presioná el signo de pregunta junto a 'Bus Interface' para ejecutar el render test y confirmar carriles reales.
              </p>
              <div className="space-y-2 text-xs font-mono-tech">
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">ENLACE BAJO CARGA 3D:</span>
                  <span className="text-zinc-300 font-bold">PCIe x16 @ x______ (3.0/4.0/5.0)</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">ANCHO DE BUS DE MEMORIA:</span>
                  <span className="text-zinc-300 font-bold">______ Bit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-[10px]">RESIZABLE BAR ACTIVO:</span>
                  <span className="text-zinc-300 font-bold">[ ] SÍ  /  [ ] NO</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Storage Section */}
          <div className="p-4 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-sky-400" />
                  <span className="font-mono-tech font-bold text-xs text-white uppercase">4. ALMACENAMIENTO NVMe</span>
                </div>
                <span className="text-[10px] font-mono-tech text-sky-300/80 bg-sky-400/10 px-2 py-0.5 rounded">
                  CRYSTALDISKINFO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-editorial mb-3">
                Comprobá si el disco opera en modo de transferencia PCIe 4.0 x4 y si mantiene el estado de salud al 100%.
              </p>
              <div className="space-y-2 text-xs font-mono-tech">
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">MODO DE TRANSFERENCIA:</span>
                  <span className="text-zinc-300 font-bold">PCIe ______ x4 / NVMe</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800/60 pb-1">
                  <span className="text-zinc-500 text-[10px]">TEMPERATURA EN REPOSO:</span>
                  <span className="text-zinc-300 font-bold">______ °C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-[10px]">PORCENTAJE DE SALUD:</span>
                  <span className="text-zinc-300 font-bold">______ %</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Checkpoint Validation Strip */}
        <div className="p-3 bg-[#111520] border-l-3 border-yellow-400 rounded-r text-xs text-zinc-300 font-mono-tech flex items-center justify-between">
          <span>
            <strong className="text-yellow-400 font-bold">CHECKPOINT FORENSE SUPERADO:</strong> Con estos datos anotados, ya conocés tu hardware real con mayor profundidad que el 90% de los usuarios.
          </span>
          <span className="text-zinc-500 text-[10px] uppercase hidden sm:inline shrink-0">
            SIGUIENTE: CAPÍTULO 02 // CÓMO TRABAJAN JUNTOS →
          </span>
        </div>
      </div>
    </MagazineMasterPage>
  );
};
