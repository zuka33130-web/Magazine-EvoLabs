import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ArrowUpRight, BookOpen, Layers } from 'lucide-react';

interface IndexItem {
  page: string;
  chapterNumber?: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  accent: string;
  pageIndex: number;
}

const INDEX_SECTIONS: IndexItem[] = [
  {
    page: '08-09',
    title: 'ANATOMÍA DEL SILICIO & MITO RAM',
    subtitle: 'Topología de placa madre, buses directos al CPU y Mito 01: slots 1-3 vs 2-4.',
    category: 'INFOGRAFÍA',
    image: '/src/assets/images/evo_silicon_hero_1789530430709.jpg',
    accent: '#EAB308',
    pageIndex: 7, // 0-based page 8
  },
  {
    page: '10-14',
    chapterNumber: '01',
    title: '¿QUÉ PC TENÉS REALMENTE?',
    subtitle: 'Desmonte comercial: VRAM recortada, auditoría PowerShell, Mito 02 y Ficha Forense.',
    category: 'CAPÍTULO 01',
    image: '/src/assets/images/cap_01_silicon_1789531835511.jpg',
    accent: '#EAB308',
    pageIndex: 9, // page 10
  },
  {
    page: '15-17',
    chapterNumber: '02',
    title: 'CÓMO TRABAJAN JUNTOS',
    subtitle: 'La ilusión del ancho de banda: DDR5 CL30 vs CL40, jerarquía en nanosegundos y Mito 03 ReBAR.',
    category: 'CAPÍTULO 02',
    image: '/src/assets/images/cap_02_interconnect_1789531847526.jpg',
    accent: '#F59E0B',
    pageIndex: 14, // page 15
  },
  {
    page: '18-20',
    chapterNumber: '03',
    title: 'CUANDO LOS FPS MIENTEN',
    subtitle: 'La falacia del promedio: cola de GPU al 99%, medición LDAT y Mito 04 V-Sync/Reflex.',
    category: 'CAPÍTULO 03',
    image: '/src/assets/images/cap_03_frametime_1789531858625.jpg',
    accent: '#EF4444',
    pageIndex: 17, // page 18
  },
  {
    page: '21-23',
    chapterNumber: '04',
    title: 'ENCONTRÁ EL LÍMITE',
    subtitle: 'Los tres muros del silicio (TjMax, PL1, VRM), presión de aire y Mito 05 curvas histéricas.',
    category: 'CAPÍTULO 04',
    image: '/src/assets/images/cap_04_thermal_1789531872467.jpg',
    accent: '#F97316',
    pageIndex: 20, // page 21
  },
  {
    page: '24-26',
    chapterNumber: '05',
    title: 'WINDOWS TAMBIÉN ES HARDWARE',
    subtitle: 'Ring 0 vs Ring 3, diagnóstico DPC Latency con LatencyMon y Mito 06 Debloaters.',
    category: 'CAPÍTULO 05',
    image: '/src/assets/images/cap_05_kernel_1789531884339.jpg',
    accent: '#3B82F6',
    pageIndex: 23, // page 24
  },
  {
    page: '27-38',
    title: 'DOSSIER: PUESTA A PUNTO DE WINDOWS',
    subtitle: '12 páginas completas: Checkpoint basal, 4 Puertas de arranque, Servicios, SysMain y DISM.',
    category: 'DOSSIER CENTRAL',
    image: '/src/assets/images/cap_06_workshop_1789531894578.jpg',
    accent: '#EAB308',
    pageIndex: 26, // page 27
  },
  {
    page: '39-41',
    chapterNumber: '06',
    title: 'EL MÉTODO DEDUCTIVO',
    subtitle: 'Diagnóstico forense en 4 pasos, patrones BSOD y Mito 07 DDU de rutina.',
    category: 'CAPÍTULO 06',
    image: '/src/assets/images/hardware_sculpture_hero_1789530888503.jpg',
    accent: '#10B981',
    pageIndex: 38, // page 39
  },
  {
    page: '42-44',
    chapterNumber: '07',
    title: 'EL MÉTODO CIENTÍFICO EN TU PC',
    subtitle: 'Los 3 mandamientos del ensayo A/B y Mito 08 Plan Máximo Rendimiento desmentido.',
    category: 'CAPÍTULO 07',
    image: '/src/assets/images/cap_07_lab_1789531904106.jpg',
    accent: '#06B6D4',
    pageIndex: 41, // page 42
  },
  {
    page: '45-46',
    title: 'FUENTES & CONTRATAPA METROLÓGICA',
    subtitle: 'Documentación técnica oficial (Microsoft, Intel, AMD, NVIDIA, JEDEC) y cierre pericial.',
    category: 'CIERRE EDITORIAL',
    image: '/src/assets/images/pcb_traces_detail_1789530447414.jpg',
    accent: '#EAB308',
    pageIndex: 44, // page 45
  },
];

export const Page07Index: React.FC<{ onSelectPage?: (pageIndex: number) => void }> = ({ onSelectPage }) => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-07"
      pageNumber={7}
      totalPages={46}
      sectionTitle="SUMARIO EDITORIAL"
      subSlug="ESTRUCTURA DE LA INVESTIGACIÓN // TOMO 01"
      accentColor="#EAB308"
    >
      {/* Top Header */}
      <div className="mb-3 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            ESTRUCTURA EDITORIAL // TOMO 01 COMPLETO
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-0.5">
            Índice de la Edición
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono-tech text-[10px] text-zinc-400">
          <span>46 PÁGINAS A4</span>
          <span>•</span>
          <span className="text-yellow-400 font-bold">8 BLOQUES CLAVE</span>
        </div>
      </div>

      {/* Opening Flow Recap (Páginas 01-07) */}
      <div className="mb-3 p-2 bg-[#0c0f16] border border-zinc-800 rounded-lg flex flex-wrap items-center justify-between gap-2 text-[9.5px] font-mono-tech">
        <span className="text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          SECUENCIA DE APERTURA:
        </span>
        <div className="flex flex-wrap items-center gap-3 text-zinc-300">
          <span className="hover:text-yellow-400 cursor-pointer" onClick={() => onSelectPage?.(0)}>01 Portada</span>
          <span className="text-zinc-600">/</span>
          <span className="hover:text-yellow-400 cursor-pointer" onClick={() => onSelectPage?.(1)}>02 Manifiesto</span>
          <span className="text-zinc-600">/</span>
          <span className="hover:text-yellow-400 cursor-pointer" onClick={() => onSelectPage?.(2)}>03 Pacto</span>
          <span className="text-zinc-600">/</span>
          <span className="hover:text-yellow-400 cursor-pointer" onClick={() => onSelectPage?.(3)}>04 Método EVO</span>
          <span className="text-zinc-600">/</span>
          <span className="hover:text-yellow-400 cursor-pointer" onClick={() => onSelectPage?.(4)}>05 Prueba Cero</span>
          <span className="text-zinc-600">/</span>
          <span className="hover:text-yellow-400 cursor-pointer" onClick={() => onSelectPage?.(5)}>06 Sistema & Archivo</span>
          <span className="text-zinc-600">/</span>
          <span className="text-yellow-400 font-bold">07 Sumario</span>
        </div>
      </div>

      {/* Main Grid: 10 Major Index Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1">
        {INDEX_SECTIONS.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPage && onSelectPage(item.pageIndex)}
            className="group relative flex items-stretch gap-3 p-2.5 bg-[#0b0e14] border border-zinc-800 rounded-lg hover:border-yellow-400/60 hover:bg-[#11141e] transition-all cursor-pointer shadow-md overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-18 sm:h-20 shrink-0 rounded overflow-hidden bg-black/60 border border-zinc-800">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-300 scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1 font-mono-tech text-[8px] font-bold text-yellow-400 bg-black/80 px-1 py-0.2 rounded">
                PÁG {item.page}
              </div>
            </div>

            {/* Content info */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span
                    className="text-[8.5px] font-mono-tech font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                    style={{
                      backgroundColor: `${item.accent}20`,
                      color: item.accent,
                    }}
                  >
                    {item.category}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-yellow-400 transition-colors shrink-0" />
                </div>

                <h3 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-tight leading-tight group-hover:text-yellow-300 transition-colors truncate">
                  {item.title}
                </h3>

                <p className="text-[9.5px] sm:text-[10px] text-zinc-400 font-sans-editorial leading-snug line-clamp-2 mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-[8px] font-mono-tech text-zinc-500 pt-1 border-t border-zinc-800/60">
                <span>INFORME PERICIAL</span>
                <span className="text-zinc-400 group-hover:text-yellow-400 uppercase font-bold tracking-wider">
                  IR A PÁG. {item.page.split('-')[0]} →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Editorial Stamp */}
      <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono-tech text-zinc-500">
        <span className="text-zinc-400 uppercase tracking-widest">
          EVO LABS MAGAZINE // TOMO 01: CONOCÉ TU PC
        </span>
        <span className="text-yellow-400 font-bold uppercase tracking-wider">
          TOTAL: 46 PÁGINAS EDITORIALES DE ALTA DENSIDAD TÉCNICA
        </span>
      </div>
    </MagazineMasterPage>
  );
};
