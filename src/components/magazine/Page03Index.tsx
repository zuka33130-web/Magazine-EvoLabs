import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';

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
    page: '04-05',
    title: 'ANATOMÍA DEL SILICIO & MITO RAM',
    subtitle: 'Topología de placa madre, buses directos al CPU y Mito 01: slots 1-3 vs 2-4.',
    category: 'INFOGRAFÍA',
    image: '/src/assets/images/evo_silicon_hero_1789530430709.jpg',
    accent: '#EAB308',
    pageIndex: 3, // 0-based page 4
  },
  {
    page: '06-10',
    chapterNumber: '01',
    title: '¿QUÉ PC TENÉS REALMENTE?',
    subtitle: 'Desmonte comercial: VRAM recortada, auditoría PowerShell, Mito 02 y Ficha Forense.',
    category: 'CAPÍTULO 01',
    image: '/src/assets/images/cap_01_silicon_1789531835511.jpg',
    accent: '#EAB308',
    pageIndex: 5, // page 6
  },
  {
    page: '11-13',
    chapterNumber: '02',
    title: 'CÓMO TRABAJAN JUNTOS',
    subtitle: 'La ilusión del ancho de banda: DDR5 CL30 vs CL40, jerarquía en nanosegundos y Mito 03 ReBAR.',
    category: 'CAPÍTULO 02',
    image: '/src/assets/images/cap_02_interconnect_1789531847526.jpg',
    accent: '#F59E0B',
    pageIndex: 10, // page 11
  },
  {
    page: '14-16',
    chapterNumber: '03',
    title: 'CUANDO LOS FPS MIENTEN',
    subtitle: 'La falacia del promedio: cola de GPU al 99%, medición LDAT y Mito 04 V-Sync/Reflex.',
    category: 'CAPÍTULO 03',
    image: '/src/assets/images/cap_03_frametime_1789531858625.jpg',
    accent: '#EF4444',
    pageIndex: 13, // page 14
  },
  {
    page: '17-19',
    chapterNumber: '04',
    title: 'ENCONTRÁ EL LÍMITE',
    subtitle: 'Los tres muros del silicio (TjMax, PL1, VRM), presión de aire y Mito 05 curvas histéricas.',
    category: 'CAPÍTULO 04',
    image: '/src/assets/images/cap_04_thermal_1789531872467.jpg',
    accent: '#F97316',
    pageIndex: 16, // page 17
  },
  {
    page: '20-22',
    chapterNumber: '05',
    title: 'WINDOWS TAMBIÉN ES HARDWARE',
    subtitle: 'Ring 0 vs Ring 3, diagnóstico DPC Latency con LatencyMon y Mito 06 Debloaters.',
    category: 'CAPÍTULO 05',
    image: '/src/assets/images/cap_05_kernel_1789531884339.jpg',
    accent: '#3B82F6',
    pageIndex: 19, // page 20
  },
  {
    page: '23-34',
    title: 'DOSSIER: PUESTA A PUNTO DE WINDOWS',
    subtitle: '12 páginas completas: Checkpoint basal, 4 Puertas de arranque, Servicios, SysMain y DISM.',
    category: 'DOSSIER CENTRAL',
    image: '/src/assets/images/cap_06_workshop_1789531894578.jpg',
    accent: '#EAB308',
    pageIndex: 22, // page 23
  },
  {
    page: '35-37',
    chapterNumber: '06',
    title: 'EL MÉTODO DEDUCTIVO',
    subtitle: 'Diagnóstico forense en 4 pasos, patrones BSOD y Mito 07 DDU de rutina.',
    category: 'CAPÍTULO 06',
    image: '/src/assets/images/hardware_sculpture_hero_1789530888503.jpg',
    accent: '#10B981',
    pageIndex: 34, // page 35
  },
  {
    page: '38-40',
    chapterNumber: '07',
    title: 'EL MÉTODO CIENTÍFICO EN TU PC',
    subtitle: 'Los 3 mandamientos del ensayo A/B y Mito 08 Plan Máximo Rendimiento desmentido.',
    category: 'CAPÍTULO 07',
    image: '/src/assets/images/cap_07_lab_1789531904106.jpg',
    accent: '#06B6D4',
    pageIndex: 37, // page 38
  },
  {
    page: '41',
    title: 'CONTRATAPA & MANIFIESTO FINAL',
    subtitle: 'Metrología, rigor y la transformación de usuario pasivo a perito de tu propia máquina.',
    category: 'CONTRATAPA',
    image: '/src/assets/images/pcb_traces_detail_1789530447414.jpg',
    accent: '#EAB308',
    pageIndex: 40, // page 41
  },
];

export const Page03Index: React.FC<{ onSelectPage?: (pageIndex: number) => void }> = ({ onSelectPage }) => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-03"
      pageNumber={3}
      totalPages={41}
      sectionTitle="ÍNDICE VISUAL"
      subSlug="SUMARIO DE CONTENIDOS // MAPA EDITORIAL"
      accentColor="#EAB308"
    >
      {/* Top Title */}
      <div className="mb-3 pb-2 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-yellow-400 uppercase font-bold">
            SUMARIO GENERAL // TOMO 01
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight mt-0.5">
            Índice de Contenidos
          </h2>
        </div>
        <div className="font-mono-tech text-[10px] text-zinc-400 hidden sm:block text-right">
          <span className="text-zinc-500">FORMATO EDITORIAL A4 // 41 PÁGINAS</span>
          <span className="block text-yellow-400 font-bold">10 EXPEDIENTES PERICIALES</span>
        </div>
      </div>

      {/* Index Grid - 2 columns of rich editorial article entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-1">
        {INDEX_SECTIONS.map((sec, i) => (
          <div
            key={i}
            onClick={() => onSelectPage && onSelectPage(sec.pageIndex)}
            className="flex items-center gap-3 p-2.5 bg-[#0e1118] hover:bg-[#151923] border border-zinc-800 hover:border-yellow-400/60 rounded-lg cursor-pointer transition-all duration-200 group shadow-md"
          >
            {/* Small Article Thumbnail */}
            <div className="w-14 h-14 shrink-0 rounded overflow-hidden border border-zinc-800 relative bg-black">
              <img
                src={sec.image}
                alt={sec.title}
                className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: sec.accent }}
              />
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span
                  className="text-[9px] font-mono-tech font-bold uppercase tracking-wider"
                  style={{ color: sec.accent }}
                >
                  {sec.category}
                </span>
                <span className="text-[10px] font-mono-tech text-yellow-400 font-black px-1.5 py-0.2 bg-yellow-400/10 rounded border border-yellow-400/20">
                  PÁG {sec.page}
                </span>
              </div>
              <h4 className="font-display font-black text-xs text-white uppercase tracking-tight truncate group-hover:text-yellow-300 transition-colors">
                {sec.title}
              </h4>
              <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight line-clamp-2 mt-0.5">
                {sec.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Note */}
      <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono-tech text-zinc-400">
        <span>Hacé clic en cualquier sección para saltar directamente a su lectura pericial.</span>
        <span className="text-yellow-400 font-semibold hidden sm:inline">EVO LABS // COLECCIÓN 2026</span>
      </div>
    </MagazineMasterPage>
  );
};
