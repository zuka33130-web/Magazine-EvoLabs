import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { Microscope, ArrowUpRight } from 'lucide-react';

export const Page01Cover: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-01"
      pageNumber={1}
      totalPages={46}
      hideHeaderFooter={true}
      isCover={true}
    >
      <div className="relative w-full h-full flex flex-col justify-between p-7 sm:p-9 md:p-10 bg-gradient-to-b from-[#0a0c10] via-[#07080b] to-[#040507] text-white select-none overflow-hidden font-sans-editorial">
        
        {/* Background Subtle Technical Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid z-0" />

        {/* ========================================================================= */}
        {/* 1. TOP HEADER STRIP: COLLECTIBLE SYSTEM BRANDING                          */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-yellow-400 pb-3 text-[10px] font-mono-tech tracking-wider text-zinc-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_10px_rgba(234,179,8,0.75)]" />
            <span className="font-black text-white tracking-widest uppercase">
              COLECCIÓN EDITORIAL // TOMO 01
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-zinc-400 text-[10px]">
            <span className="uppercase tracking-widest">INGENIERÍA, TELEMETRÍA & METROLOGÍA DE HARDWARE</span>
            <span className="text-zinc-600">•</span>
            <span className="text-yellow-400 font-bold uppercase tracking-wider">EDICIÓN COLECCIONABLE // 2026</span>
          </div>

          <div className="font-mono-tech font-bold text-yellow-400 text-[10px] tracking-widest">
            A4 210×297 MM
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BIG MAGAZINE MASTHEAD (EVO LABS)                                       */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-4 mb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-[0.82] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                EVO LABS
              </h1>
            </div>

            <div className="flex items-center gap-2.5 mt-2.5">
              <span className="bg-yellow-400 text-black text-[11px] font-mono-tech font-black tracking-widest uppercase px-2 py-0.5 rounded-xs shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                MAGAZINE // TOMO 01
              </span>
              <span className="font-mono-tech text-[10px] sm:text-[11px] tracking-wider text-zinc-400 uppercase font-semibold">
                AUDITORÍA FORENSE DE HARDWARE & SISTEMAS
              </span>
            </div>
          </div>

          {/* Sello Editorial: DE CERO A LABORATORIO */}
          <div className="flex items-center gap-2.5 bg-[#12151e] border border-yellow-400/40 rounded-md px-3.5 py-2 shadow-lg shrink-0">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-yellow-400/10 text-yellow-400 shrink-0">
              <Microscope className="w-4 h-4" />
            </div>
            <div className="font-mono-tech leading-tight">
              <span className="block text-[9.5px] font-black text-yellow-400 tracking-wider uppercase">
                DE CERO A LABORATORIO
              </span>
              <span className="block text-[8.5px] text-zinc-400">
                Una ruta. Dos velocidades.
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. HERO SECTION: REALISTIC BENCH PC + HEADLINES                           */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-2 rounded-xl overflow-hidden border border-zinc-800 bg-[#0d1017] shadow-2xl flex-1 flex flex-col justify-between min-h-[310px]">
          {/* Background Photography of Real PC Hardware Benchmark */}
          <img
            src="/src/assets/images/cover_tomo1_pc_1789531488077.jpg"
            alt="PC de laboratorio - EVO LABS"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.18]"
          />

          {/* Cinematic Vignette Overlays for High Contrast & Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090d]/95 via-[#07090d]/60 to-[#07090d]/80" />

          {/* Top Stamp Tag in Image */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-yellow-400/60 rounded text-yellow-400 text-[10px] font-mono-tech font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              INVESTIGACIÓN FUNDACIONAL // TOMO 01
            </span>

            <span className="hidden sm:inline-block font-mono-tech text-[9.5px] text-zinc-300 bg-black/70 px-2.5 py-1 rounded border border-zinc-800">
              PROTOCOLOS DE MEDICIÓN // ANÁLISIS GUIADO
            </span>
          </div>

          {/* Central Commercial Core: CONOCÉ TU PC + PROMESA CENTRAL */}
          <div className="relative z-10 px-5 sm:px-7 md:px-8 pb-5 sm:pb-6 space-y-2.5">
            
            {/* Título Principal */}
            <div>
              <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[0.88] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                CONOCÉ TU PC
              </h2>
              <p className="font-display font-bold text-sm sm:text-base md:text-lg text-yellow-300 mt-1.5 tracking-wide drop-shadow">
                “ANTES DE OPTIMIZARLA, DESCUBRÍ QUÉ MÁQUINA TENÉS REALMENTE.”
              </p>
            </div>

            {/* Gancho Editorial de Alto Impacto */}
            <div className="p-3 sm:p-3.5 bg-gradient-to-r from-yellow-400/20 via-black/85 to-black/90 border-l-4 border-yellow-400 rounded-r-lg backdrop-blur-md max-w-2xl">
              <h3 className="font-display font-black text-sm sm:text-base md:text-lg text-white uppercase tracking-tight leading-tight">
                ¿TU COMPUTADORA ESTÁ RINDIENDO LO QUE DEBERÍA?
              </h3>
              <p className="font-sans-editorial text-[11px] sm:text-xs text-zinc-300 mt-1 leading-relaxed">
                Silicio, buses de datos, FPS reales, DPC latency, límites térmicos y auditoría limpia de Windows explicados desde cero, pero con la profundidad de un peritaje de laboratorio.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DOSSIER CENTRAL BANNER (PUESTA A PUNTO DE WINDOWS)                      */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-1 p-2.5 sm:p-3 bg-[#0d1017] border-2 border-yellow-500/60 rounded-lg shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-yellow-400 text-black text-[9.5px] font-mono-tech font-black tracking-wider uppercase rounded-xs">
                DOSSIER CENTRAL
              </span>
              <h4 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-tight">
                PUESTA A PUNTO DE WINDOWS
              </h4>
            </div>
            <p className="text-[10.5px] sm:text-[11.5px] text-zinc-300 font-sans-editorial leading-snug">
              Las 4 puertas de arranque, procesos en segundo plano, servicios y limpieza profunda sin scripts destructivos ni placebo.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[9.5px] font-mono-tech text-yellow-400 font-bold bg-yellow-400/10 px-2.5 py-1 rounded border border-yellow-400/30 shrink-0">
            <span>12 PÁGINAS METROLÓGICAS</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. EDITORIAL HIGHLIGHTS (LOS CUATRO PILARES)                               */}
        {/* ========================================================================= */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono-tech">
          
          <div className="p-2.5 bg-[#0d1017]/90 border border-zinc-800 rounded-md flex flex-col justify-between">
            <span className="text-[9.5px] text-yellow-400 font-black uppercase tracking-wider block">
              INTERNET DICE // EVO MIDE
            </span>
            <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
              8 mitos populares analizados bajo protocolos metrológicos y análisis técnico.
            </p>
          </div>

          <div className="p-2.5 bg-[#0d1017]/90 border border-zinc-800 rounded-md flex flex-col justify-between">
            <span className="text-[9.5px] text-yellow-400 font-black uppercase tracking-wider block">
              CUANDO LOS FPS MIENTEN
            </span>
            <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
              Promedio vs 1% Low, cola de render y por qué los FPS no garantizan fluidez.
            </p>
          </div>

          <div className="p-2.5 bg-[#0d1017]/90 border border-zinc-800 rounded-md flex flex-col justify-between">
            <span className="text-[9.5px] text-yellow-400 font-black uppercase tracking-wider block">
              ENCONTRÁ EL LÍMITE
            </span>
            <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
              Descubrí qué componente frena tu equipo: CPU, GPU, RAM o muros térmicos.
            </p>
          </div>

          <div className="p-2.5 bg-[#0d1017]/90 border border-zinc-800 rounded-md flex flex-col justify-between">
            <span className="text-[9.5px] text-yellow-400 font-black uppercase tracking-wider block">
              EXPEDIENTE BASAL CERO
            </span>
            <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
              Ficha forense para registrar el estado inicial de tu máquina antes de tocarla.
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. PIE / FOOTER: ACREDITACIÓN EDITORIAL LIMPIA Y REAL                     */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-2.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[9.5px] font-mono-tech text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase tracking-wider">
              EDICIÓN OFICIAL 2026
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400">
              EVO LABS MAGAZINE // TOMO 01
            </span>
          </div>

          <div className="flex items-center gap-3 text-right">
            <span className="text-zinc-400 uppercase tracking-wider text-[9px] hidden sm:inline">
              PUBLICACIÓN TÉCNICA DE REFERENCIA
            </span>
            <span className="px-2 py-0.5 rounded bg-yellow-400 text-black font-black uppercase tracking-widest text-[9px]">
              46 PÁGINAS A4
            </span>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
