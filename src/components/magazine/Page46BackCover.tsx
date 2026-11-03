import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { 
  Cpu, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { MAGAZINE_IMAGES } from '../../data/magazineImages';

export const Page46BackCover: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-46"
      pageNumber={46}
      totalPages={46}
      hideHeaderFooter={true}
      isBackCover={true}
    >
      <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-7 md:p-8 bg-gradient-to-b from-[#0a0c10] via-[#07080b] to-[#040507] text-white select-none overflow-hidden font-sans-editorial">
        
        {/* Background Subtle Technical Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid z-0" />

        {/* 1. TOP HEADER STRIP: BRAND & ISSUE SUMMARY */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-yellow-400 pb-2 text-[10px] font-mono-tech tracking-wider text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
            <span className="font-black text-white tracking-widest uppercase">
              EVO LABS EZINE // TOMO 01: CIERRE COLECCIONISTA
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-zinc-400 text-[10px]">
            <span>0x08 BITÁCORA PERICIAL</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold uppercase tracking-wider">EXPEDIENTE FINAL</span>
          </div>

          <div className="font-mono-tech font-bold text-yellow-400 text-[10px] tracking-widest">
            EDICIÓN INTEGRAL // 2026
          </div>
        </div>

        {/* 2. 0x08 FICHA DE DICTAMEN FINAL Y CONSOLIDACIÓN DE AUDITORÍA */}
        <div className="relative z-10 my-1.5 p-3 bg-[#0d1017] border border-yellow-400/40 rounded-lg shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
            <span className="font-mono-tech font-bold text-[10px] text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" />
              0x08 // FICHA DE DICTAMEN FINAL Y CONSOLIDACIÓN DE AUDITORÍA
            </span>
            <span className="text-[9px] font-mono-tech text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
              ESTADO ALCANZADO EN BANCO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono-tech">
            <div className="p-2 bg-black/50 border border-zinc-800 rounded">
              <span className="text-zinc-400 block text-[9px] uppercase">ESTABILIDAD TÉRMICA BAJO CARGA:</span>
              <span className="text-emerald-400 font-bold block mt-0.5">OPTIMIZADA (Delta &lt; 65°C)</span>
            </div>
            <div className="p-2 bg-black/50 border border-zinc-800 rounded">
              <span className="text-zinc-400 block text-[9px] uppercase">SUBSISTEMA DE MEMORIA:</span>
              <span className="text-emerald-400 font-bold block mt-0.5">VERIFICADA (Zócalos A2/B2)</span>
            </div>
            <div className="p-2 bg-black/50 border border-zinc-800 rounded">
              <span className="text-zinc-400 block text-[9px] uppercase">PERCENTIL 1% LOW CRÍTICO:</span>
              <span className="text-emerald-400 font-bold block mt-0.5">FLUIDEZ & PACE CONFIRMADOS</span>
            </div>
          </div>
        </div>

        {/* 3. EXPEDIENTE #004 // INTERRUPCIÓN EN EL ANILLO 0 (THE CLIFFHANGER) */}
        <div className="relative z-10 my-1.5 p-3 bg-[#0c1018] border-2 border-rose-500/50 rounded-lg shadow-2xl space-y-2">
          <div className="flex items-center justify-between border-b border-rose-500/30 pb-1">
            <span className="font-mono-tech font-black text-xs text-rose-400 tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              ■■■ [ EXPEDIENTE #004 // INTERRUPCIÓN EN EL ANILLO 0 ] ■■■
            </span>
            <span className="text-[9px] font-mono-tech text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40">
              NIVEL DE PRIVILEGIO INSUFICIENTE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Real Oscilloscope DPC trace photo */}
            <div className="md:col-span-5 relative rounded overflow-hidden border border-rose-500/40 bg-black">
              <img
                src={MAGAZINE_IMAGES.dpcLatencyRing0}
                alt="Traza de osciloscopio de interrupción en Anillo 0 y latencia DPC"
                className="w-full h-24 sm:h-28 object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/85 px-2 py-0.5 text-[8px] font-mono-tech text-rose-300 flex justify-between">
                <span>DPC SPIKE: 29.8ms [Wdf01000.sys]</span>
                <span>RING 0 STALL</span>
              </div>
            </div>

            {/* Narrative Cliffhanger */}
            <div className="md:col-span-7 space-y-1.5 text-zinc-300 font-sans-editorial text-[11px] leading-relaxed">
              <p>
                Llegamos al caso que la física del hardware no puede explicar: una PC con los mejores componentes, temperaturas óptimas y memorias en A2/B2 sufre congelamientos de 30 milisegundos cada dos minutos exactos. Los fierros están impecables.
              </p>
              <p className="text-zinc-200">
                <strong className="text-rose-400">El culpable no está en el silicio:</strong> está escondido en el sótano del sistema operativo, el Anillo 0 del Kernel, donde un driver corrupto está secuestrando la tabla de interrupciones DPC/ISR.
              </p>
              <div className="p-1.5 bg-rose-950/40 border border-rose-500/40 rounded font-mono-tech text-[10px] text-rose-300">
                Guardá tu Pasaporte EVO. La autopsia del Kernel recién empieza en el <strong>TOMO 02: LA BIBLIA NEGRA DE WINDOWS</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* 4. ROADMAP DE LA COLECCIÓN EDITORIAL */}
        <div className="relative z-10 p-2.5 bg-[#0a0d14] border border-zinc-800 rounded-lg">
          <div className="flex justify-between items-center mb-1.5 border-b border-zinc-800 pb-1">
            <span className="text-[9.5px] font-mono-tech font-bold text-zinc-400 uppercase tracking-wider">
              LA COLECCIÓN CONTINÚA // PRÓXIMAS ENTREGAS EDITORIALES
            </span>
            <span className="text-[9px] font-mono-tech text-yellow-400">
              SISTEMA INTEGRAL EVO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono-tech">
            <div className="p-2 bg-black/60 rounded border border-yellow-400/30 flex flex-col justify-between">
              <span className="text-yellow-400 font-bold block text-[9px]">TOMO 02 // LA BIBLIA NEGRA DE WINDOWS</span>
              <p className="text-zinc-300 font-sans-editorial text-[9px] mt-0.5">“Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando.”</p>
            </div>
            <div className="p-2 bg-black/60 rounded border border-zinc-800/80 flex flex-col justify-between">
              <span className="text-zinc-300 font-bold block text-[9px]">TOMO 03 // REPARÁ TU PC</span>
              <p className="text-zinc-400 font-sans-editorial text-[9px] mt-0.5">“La Biblia del reparador de PC de escritorio: Síntoma → medición → descarte.”</p>
            </div>
            <div className="p-2 bg-black/60 rounded border border-zinc-800/80 flex flex-col justify-between">
              <span className="text-zinc-300 font-bold block text-[9px]">TOMO 04 // REPARÁ TU NOTEBOOK</span>
              <p className="text-zinc-400 font-sans-editorial text-[9px] mt-0.5">“Diagnóstico y reparación de portátiles, desde el cargador hasta el SoC.”</p>
            </div>
          </div>
        </div>

        {/* 5. COLOPHON SOBRIO Y LIMPIO */}
        <div className="relative z-10 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
          <div className="space-y-0.5">
            <p className="font-bold text-white uppercase tracking-wider">
              EVO LABS // DIVISIÓN EDITORIAL Y METROLOGÍA FORENSE
            </p>
            <p className="text-zinc-500 text-[8.5px]">
              EDICIÓN OFICIAL 2026 // TOMO 01 CONOCÉ TU PC // 46 PÁGINAS A4
            </p>
          </div>

          <div className="text-right">
            <span className="block text-[9.5px] font-bold text-yellow-400 uppercase tracking-widest">
              NO LO CREAS. COMPROBALO.
            </span>
            <span className="block text-[8.5px] text-zinc-500">
              EXPEDIENTE CERRADO // CONTINÚA EN TOMO 02
            </span>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
