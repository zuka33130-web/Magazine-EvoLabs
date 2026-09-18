import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { 
  Cpu, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Scale, 
  FileSpreadsheet, 
  QrCode, 
  Video, 
  FolderDown, 
  Users, 
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const Page12BackCover: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-41"
      pageNumber={41}
      totalPages={41}
      hideHeaderFooter={true}
      isBackCover={true}
    >
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-9 bg-gradient-to-b from-[#0a0c10] via-[#07080b] to-[#040507] text-white select-none overflow-hidden font-sans-editorial">
        
        {/* Background Subtle Technical Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid z-0" />

        {/* ========================================================================= */}
        {/* 1. TOP HEADER STRIP: BRAND & ISSUE SUMMARY                                */}
        {/* ========================================================================= */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-yellow-400 pb-2.5 text-[10px] font-mono-tech tracking-wider text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 inline-block shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
            <span className="font-black text-white tracking-widest uppercase">
              EVO LABS MAGAZINE // TOMO 01
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-zinc-400 text-[10px]">
            <span>INVESTIGACIÓN DE TU PROPIA PC</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold">REVISTA-LABORATORIO</span>
          </div>

          <div className="font-mono-tech font-bold text-yellow-400 text-[10px] tracking-widest">
            AÑO 2026 // TOMO 01
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN MANIFESTO / EDITORIAL PITCH (CONTRATAPA COMERCIAL)                 */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-2.5 p-3.5 sm:p-4 bg-[#0d1017] border border-zinc-800 rounded-lg shadow-xl">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight mb-2">
            TU PC TIENE MUCHO MÁS PARA CONTARTE.
          </h2>

          <div className="text-[11px] sm:text-xs text-zinc-300 font-sans-editorial leading-relaxed space-y-1.5">
            <p>
              La usás todos los días. Pero ¿sabés realmente qué tiene adentro, qué está haciendo Windows mientras no mirás, qué está frenando su rendimiento o por qué un juego puede marcar muchos FPS y aun así sentirse mal?
            </p>
            <p>
              <strong className="text-white">EVO LABS MAGAZINE nació para investigar esas preguntas.</strong> No es un catálogo de componentes ni una colección de “trucos mágicos”. <strong className="text-yellow-400 font-bold">Es una revista-laboratorio.</strong>
            </p>
            <p className="text-zinc-400 text-[10.5px]">
              En este primer tomo vas a abrir la investigación de tu propia computadora: conocer su hardware, entender cómo trabajan juntos sus componentes, medir fluidez, encontrar limitaciones, revisar Windows y realizar una puesta a punto controlada.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. QUÉ INCLUYE // EN ESTE TOMO (8 MODULAR BENTO CARDS)                    */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-1">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-zinc-800/80">
            <span className="text-[10px] font-mono-tech font-black text-yellow-400 tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 inline-block" />
              EN ESTE TOMO // INVESTIGACIÓN COMPLETA
            </span>
            <span className="text-[9px] font-mono-tech text-zinc-500 uppercase hidden sm:inline">
              8 BLOQUES TÉCNICOS & PRÁCTICOS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono-tech">
            
            {/* Card 1 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Cpu className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>01 // CONOCÉ TU HARDWARE</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                CPU, RAM, GPU, almacenamiento y los datos que realmente importan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Layers className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>02 // DESCUBRÍ CÓMO TRABAJA</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Buses, memoria, latencia y movimiento de datos explicado visualmente.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Activity className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>03 // INVESTIGÁ LOS FPS</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Frametime, 1% Low, stuttering y estabilidad.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>04 // AUDITÁ WINDOWS</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Inicio, servicios, procesos, tareas programadas y programas en segundo plano.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>05 // LIMPIEZA PROFUNDA</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Sin programas milagrosos: Temporales, almacenamiento, DISM, WinSxS y nativos.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Sliders className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>06 // PROBÁ MICRO-TWEAKS</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Ajustes pequeños, explicados y 100% reversibles.
              </p>
            </div>

            {/* Card 7 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Scale className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>07 // INTERNET DICE // EVO MIDE</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Consejos populares enfrentados con funcionamiento real y experimentación.
              </p>
            </div>

            {/* Card 8 */}
            <div className="p-2 bg-[#0c0f16] border border-zinc-800 rounded hover:border-yellow-400/40 transition-colors">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <FileSpreadsheet className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>08 // ARMÁ TU EXPEDIENTE</span>
              </div>
              <p className="text-[9.5px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Registrá qué cambiaste, qué ocurrió y qué aprendiste de tu propia máquina.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CIERRE CONTRATAPA: MANIFIESTO EVO LABS                                  */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-2 p-3 bg-gradient-to-r from-yellow-400/10 via-[#0d1017] to-black/80 border-l-4 border-yellow-400 rounded-r-lg">
          <p className="font-mono-tech text-xs sm:text-sm font-black text-white uppercase tracking-widest">
            OBSERVÁ. ENTENDÉ. CAMBIÁ. MEDÍ. DECIDÍ.
          </p>
          <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-display font-black text-base sm:text-lg text-yellow-400 uppercase tracking-tight">
              EVO LABS
            </span>
            <span className="font-sans-editorial text-[11px] sm:text-xs text-zinc-300 italic">
              "Hacemos milagros. Y después los demostramos."
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. ECOSISTEMA Y PLACEHOLDER QR                                             */}
        {/* ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-2.5 p-2.5 bg-[#0a0d14] border border-zinc-800 rounded-lg">
          
          {/* Ecosystem Links */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-1.5">
            <span className="text-[9px] font-mono-tech font-bold text-zinc-400 uppercase tracking-wider">
              ECOSISTEMA EVO LABS // CONTENIDO EXPANDIDO
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] font-mono-tech">
              <div className="p-1.5 bg-black/60 rounded border border-zinc-800/80 flex items-center gap-1 text-zinc-300">
                <Video className="w-3 h-3 text-yellow-400 shrink-0" />
                <span className="truncate">VIDEOS</span>
              </div>
              <div className="p-1.5 bg-black/60 rounded border border-zinc-800/80 flex items-center gap-1 text-zinc-300">
                <FolderDown className="w-3 h-3 text-yellow-400 shrink-0" />
                <span className="truncate">RECURSOS</span>
              </div>
              <div className="p-1.5 bg-black/60 rounded border border-zinc-800/80 flex items-center gap-1 text-zinc-300">
                <Users className="w-3 h-3 text-yellow-400 shrink-0" />
                <span className="truncate">COMUNIDAD</span>
              </div>
              <div className="p-1.5 bg-black/60 rounded border border-zinc-800/80 flex items-center gap-1 text-zinc-300">
                <BookOpen className="w-3 h-3 text-yellow-400 shrink-0" />
                <span className="truncate">PRÓXIMOS TOMOS</span>
              </div>
            </div>

            <p className="text-[8.5px] text-zinc-500 font-sans-editorial">
              Accedé a guías en video, planillas de cálculo de frametimes y actualizaciones de laboratorio.
            </p>
          </div>

          {/* QR Code Placeholder Box */}
          <div className="md:col-span-4 p-2 bg-black/70 border border-yellow-500/30 rounded flex items-center gap-2.5">
            <div className="w-12 h-12 bg-white p-1 rounded-xs shrink-0 flex items-center justify-center">
              {/* Crisp SVG QR Graphic */}
              <svg viewBox="0 0 24 24" className="w-full h-full fill-black">
                <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm9-2h7v7h-7V2zm2 2v3h3V4h-3zM2 13h7v7H2v-7zm2 2v3h3v-3H4zm11 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zM11 2h2v4h-2V2zm0 6h2v2h-2V8zm-6 3h2v2H5v-2zm6 0h2v2h-2v-2zm4 0h4v2h-4v-2z" />
              </svg>
            </div>
            <div className="font-mono-tech leading-tight">
              <span className="text-[8.5px] font-black text-yellow-400 uppercase tracking-wider block">
                QR // CONTENIDO COMPLEMENTARIO
              </span>
              <span className="text-[7.5px] text-zinc-400 block mt-0.5">
                Escaneá para acceder a telemetría y scripts
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. BACK COVER COLOPHON / OFFICIAL IMPRINT & BARCODE                        */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
          <div className="space-y-0.5">
            <p className="font-bold text-white uppercase tracking-wider">
              EVO LABS // DIVISIÓN EDITORIAL Y METROLOGÍA DE HARDWARE
            </p>
            <p className="text-zinc-500 text-[8px]">
              EDICIÓN COLECCIONABLE // 2026 // DISTRIBUCIÓN OFICIAL
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-[8px] text-zinc-500">ISSN 2953-4828</span>
              <span className="block text-[9px] font-bold text-yellow-400">TOMO 01 FINAL</span>
            </div>
            {/* Real vector-style EAN-13 barcode */}
            <div className="bg-white px-2 py-1 rounded-xs flex items-center gap-[2px] h-6">
              {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 1, 3].map((w, i) => (
                <span key={i} className="bg-black h-full inline-block" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};

