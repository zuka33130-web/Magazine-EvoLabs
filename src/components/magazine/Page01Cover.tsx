import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ShieldCheck, Cpu, Flame, Activity, Zap, CheckCircle2, Sliders, Microscope } from 'lucide-react';

export const Page01Cover: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-01"
      pageNumber={1}
      totalPages={41}
      hideHeaderFooter={true}
      isCover={true}
    >
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-9 bg-gradient-to-b from-[#0a0c10] via-[#07080b] to-[#040507] text-white select-none overflow-hidden font-sans-editorial">
        
        {/* Background Subtle Technical Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid z-0" />

        {/* ========================================================================= */}
        {/* 1. TOP HEADER STRIP: COLLECTIBLE SYSTEM BRANDING                          */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-yellow-400 pb-2.5 text-[10px] font-mono-tech tracking-wider text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
            <span className="font-black text-white tracking-widest uppercase">
              COLECCIÓN PERICIAL // TOMO 01
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-zinc-400 text-[10px]">
            <span>SERIE LABORATORIO DE HARDWARE</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">EDICIÓN COLECCIONABLE // 2026</span>
          </div>

          <div className="font-mono-tech font-bold text-yellow-400 text-[10px] tracking-widest">
            A4 210×297mm
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. BIG MAGAZINE MASTHEAD (THUMBNAIL-PROOF: "EVO LABS")                    */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-3 mb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase leading-[0.82] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                EVO LABS
              </h1>
            </div>

            <div className="flex items-center gap-2.5 mt-2">
              <span className="bg-yellow-400 text-black text-[11px] font-mono-tech font-black tracking-widest uppercase px-2 py-0.5 rounded-xs shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                MAGAZINE // TOMO 01
              </span>
              <span className="font-mono-tech text-[10px] sm:text-[11px] tracking-wider text-zinc-400 uppercase font-semibold">
                INVESTIGACIÓN DE HARDWARE & SISTEMAS
              </span>
            </div>
          </div>

          {/* Sello Pequeño: DE CERO A LABORATORIO */}
          <div className="flex items-center gap-2.5 bg-[#12151e] border border-yellow-400/40 rounded-md px-3 py-1.5 shadow-lg shrink-0">
            <div className="w-7 h-7 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-yellow-400/10 text-yellow-400 shrink-0">
              <Microscope className="w-4 h-4" />
            </div>
            <div className="font-mono-tech leading-tight">
              <span className="block text-[9px] font-black text-yellow-400 tracking-wider uppercase">
                DE CERO A LABORATORIO
              </span>
              <span className="block text-[8px] text-zinc-400">
                No necesitás ser técnico para empezar.
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. HERO SECTION: REALISTIC BENCH PC + MASSIVE THUMBNAIL HEADLINES          */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-2 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d1017] shadow-2xl flex-1 flex flex-col justify-between min-h-[300px]">
          {/* Background Photography of Real PC Hardware Benchmark */}
          <img
            src="/src/assets/images/cover_tomo1_pc_1789531488077.jpg"
            alt="PC de laboratorio - EVO LABS"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.18]"
          />

          {/* Cinematic Vignette Overlays for Extreme Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090d]/95 via-[#07090d]/60 to-[#07090d]/80" />

          {/* Top Stamp Tag in Image */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-yellow-400/50 rounded text-yellow-400 text-[10px] font-mono-tech font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              INVESTIGACIÓN PRINCIPAL // TOMO 01
            </span>

            <span className="hidden sm:inline-block font-mono-tech text-[9px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
              BANCO DE PRUEBAS // TELEMETRÍA REAL
            </span>
          </div>

          {/* Central Commercial Core (THUMBNAIL VISIBILITY: CONOCÉ TU PC + ¿TU PC ESTÁ RINDIENDO LO QUE DEBERÍA?) */}
          <div className="relative z-10 px-4 sm:px-6 md:px-7 pb-4 sm:pb-5 space-y-2">
            
            {/* Título Principal (Visible a distancia y en miniatura) */}
            <div>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.9] uppercase drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)]">
                CONOCÉ TU PC
              </h2>
              <p className="font-sans-editorial text-xs sm:text-sm font-semibold text-zinc-300 mt-1 drop-shadow">
                Antes de optimizarla, descubrí qué máquina tenés realmente.
              </p>
            </div>

            {/* Gancho de Alto Impacto Comercial (Thumbnail Eye-Catcher) */}
            <div className="p-2.5 sm:p-3 bg-gradient-to-r from-yellow-400/20 via-black/80 to-black/90 border-l-4 border-yellow-400 rounded-r-md backdrop-blur-md max-w-2xl">
              <h3 className="font-display font-black text-base sm:text-lg md:text-xl text-yellow-400 uppercase tracking-tight leading-tight">
                ¿TU PC ESTÁ RINDIENDO LO QUE DEBERÍA?
              </h3>
              <p className="font-sans-editorial text-[11px] sm:text-xs text-zinc-200 mt-1 leading-snug">
                Hardware, Windows, FPS, latencia, diagnóstico y optimización explicados desde cero, pero con profundidad real.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DOSSIER CENTRAL BANNER (PUESTA A PUNTO DE WINDOWS)                      */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-1 p-2.5 sm:p-3 bg-[#0d1017] border-2 border-yellow-500/60 rounded-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[9px] font-mono-tech font-black tracking-wider uppercase rounded-xs">
                DOSSIER CENTRAL
              </span>
              <h4 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-tight">
                PUESTA A PUNTO DE WINDOWS
              </h4>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-zinc-300 font-sans-editorial leading-snug">
              Todo lo que arranca. Todo lo que queda corriendo. Todo lo que podés limpiar y optimizar sin destruir el sistema.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono-tech text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/30 shrink-0">
            <span>12 PÁGINAS TÉCNICAS</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. EDITORIAL HIGHLIGHTS (LLAMADOS EDITORIALES)                              */}
        {/* ========================================================================= */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-mono-tech">
          
          {/* Llamado 1: INTERNET DICE // EVO MIDE */}
          <div className="p-2 bg-[#0d1017]/90 border border-zinc-800 rounded flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-wider block">
                INTERNET DICE // EVO MIDE
              </span>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-0.5 leading-snug">
                Mitos, tweaks y consejos virales puestos bajo la lupa.
              </p>
            </div>
          </div>

          {/* Llamado 2: CUANDO LOS FPS MIENTEN */}
          <div className="p-2 bg-[#0d1017]/90 border border-zinc-800 rounded flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-wider block">
                CUANDO LOS FPS MIENTEN
              </span>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-0.5 leading-snug">
                Promedio, 1% Low, frametime y por qué más FPS no siempre significa más fluidez.
              </p>
            </div>
          </div>

          {/* Llamado 3: ENCONTRÁ EL LÍMITE */}
          <div className="p-2 bg-[#0d1017]/90 border border-zinc-800 rounded flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-wider block">
                ENCONTRÁ EL LÍMITE
              </span>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-0.5 leading-snug">
                CPU · GPU · RAM · almacenamiento · temperatura · Windows
              </p>
            </div>
          </div>

          {/* Llamado 4: TRUCOS EVO */}
          <div className="p-2 bg-[#0d1017]/90 border border-zinc-800 rounded flex flex-col justify-between">
            <div>
              <span className="text-[9px] text-yellow-400 font-black uppercase tracking-wider block">
                TRUCOS EVO
              </span>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-0.5 leading-snug">
                Ajustes, limpieza, diagnóstico y experimentos que podés probar en tu propia PC.
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. PIE / FOOTER: EDICIÓN COLECCIONABLE 2026 + METADATA + BARCODE           */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white uppercase tracking-wider">
              EDICIÓN COLECCIONABLE // 2026
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="hidden sm:inline text-zinc-400">
              EVO LABS MAGAZINE // TOMO 01
            </span>
          </div>

          {/* Barcode & Price/ID */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-[8px] text-zinc-500">ISSN 2953-4828</span>
              <span className="block text-[9px] font-bold text-yellow-400">VOL. I // N° 01</span>
            </div>
            <div className="flex items-center gap-[2px] h-6 bg-white/90 px-1.5 py-0.5 rounded-xs">
              {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1].map((w, i) => (
                <span key={i} className="bg-black h-full inline-block" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};

