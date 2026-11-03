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
  BookOpen,
  ArrowRight,
  FolderArchive
} from 'lucide-react';

export const Page46BackCover: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-46"
      pageNumber={46}
      totalPages={46}
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
            <span>INVESTIGACIÓN DE TU PROPIA COMPUTADORA</span>
            <span>•</span>
            <span className="text-yellow-400 font-bold uppercase tracking-wider">REVISTA-LABORATORIO</span>
          </div>

          <div className="font-mono-tech font-bold text-yellow-400 text-[10px] tracking-widest">
            AÑO 2026 // EDICIÓN 01
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN MANIFESTO / EDITORIAL PITCH (CONTRATAPA EDITORIAL)                 */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-2 p-4 bg-[#0d1017] border border-zinc-800 rounded-lg shadow-xl">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight mb-2">
            TU COMPUTADORA YA NO ES UNA CAJA NEGRA.
          </h2>

          <div className="text-[11px] sm:text-xs text-zinc-300 font-sans-editorial leading-relaxed space-y-2">
            <p>
              Comenzaste este tomo frente a un equipo cotidiano y un mar de dudas: sabías que Windows tardaba en responder, que los juegos a veces daban tirones o que la caja prometía cifras espectaculares que no se sentían reales en el uso diario.
            </p>
            <p>
              <strong className="text-white">Al cerrar esta última página, el cambio de estado es irreversible.</strong> Ahora sabés qué piezas de silicio tenés realmente, cómo viajan sus datos por las pistas de la placa madre, cómo distinguir el promedio engañoso de FPS del tiempo de cuadro real y cómo auditar Windows sin dañar dependencias ni creer en placebos.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. QUÉ SABÉS Y QUÉ MEDISTE (LOS 4 LOGROS PERICIALES)                       */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-1">
          <div className="flex items-center justify-between pb-1 mb-2 border-b border-zinc-800/80">
            <span className="text-[10px] font-mono-tech font-black text-yellow-400 tracking-widest uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 inline-block" />
              EL EXPEDIENTE FORENSE QUE CONSTRUISTE
            </span>
            <span className="text-[9px] font-mono-tech text-zinc-500 uppercase hidden sm:inline">
              REGISTRO EN TU DISCO LOCAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono-tech">
            
            <div className="p-2.5 bg-[#0c0f16] border border-zinc-800 rounded">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Cpu className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>01 // HARDWARE AUDITADO</span>
              </div>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Sabés cuántos canales de RAM operan, la versión de PCIe real y el modelo exacto de silicio sin marketing.
              </p>
            </div>

            <div className="p-2.5 bg-[#0c0f16] border border-zinc-800 rounded">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Activity className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>02 // FLUIDEZ METROLÓGICA</span>
              </div>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Entendés por qué 90 FPS con picos de 40 ms se sienten peor que 60 FPS estables a 16.6 ms.
              </p>
            </div>

            <div className="p-2.5 bg-[#0c0f16] border border-zinc-800 rounded">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>03 // WINDOWS AUDITADO</span>
              </div>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Desactivaste las puertas de inicio innecesarias, auditaste tareas programadas y limpiaste WinSxS con DISM.
              </p>
            </div>

            <div className="p-2.5 bg-[#0c0f16] border border-zinc-800 rounded">
              <div className="flex items-center gap-1.5 text-yellow-400 text-[10px] font-bold">
                <Scale className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                <span>04 // ENSAYOS A/B VÁLIDOS</span>
              </div>
              <p className="text-[10px] text-zinc-300 font-sans-editorial mt-1 leading-snug">
                Tenés tu línea base inicial congelada y sabés cómo aislar una variable a la vez con método científico.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CIERRE CONTRATAPA: MANIFIESTO EVO LABS                                  */}
        {/* ========================================================================= */}
        <div className="relative z-10 my-2 p-3.5 bg-gradient-to-r from-yellow-400/15 via-[#0d1017] to-black/90 border-l-4 border-yellow-400 rounded-r-lg">
          <p className="font-mono-tech text-xs sm:text-sm font-black text-white uppercase tracking-widest">
            OBSERVÁ. IDENTIFICÁ. ENTENDÉ. MEDÍ. DECIDÍ. REGISTRÁ.
          </p>
          <div className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-display font-black text-lg sm:text-xl text-yellow-400 uppercase tracking-tight">
              EVO LABS
            </span>
            <span className="font-sans-editorial text-xs sm:text-sm text-zinc-200 italic font-semibold">
              “Hacemos milagros, pero los medimos.”
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. PRÓXIMOS TOMOS DE LA COLECCIÓN (ROADMAP EDITORIAL)                      */}
        {/* ========================================================================= */}
        <div className="relative z-10 p-3 bg-[#0a0d14] border border-zinc-800 rounded-lg">
          <span className="text-[9.5px] font-mono-tech font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            LA COLECCIÓN CONTINÚA // PRÓXIMAS ENTREGAS EDITORIALES
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono-tech">
            <div className="p-2 bg-black/60 rounded border border-zinc-800/80 flex flex-col justify-between">
              <span className="text-yellow-400 font-bold block text-[9.5px]">TOMO 02 // LA BIBLIA NEGRA DE WINDOWS</span>
              <p className="text-zinc-300 font-sans-editorial text-[9.5px] mt-1">“Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando.”</p>
            </div>
            <div className="p-2 bg-black/60 rounded border border-zinc-800/80 flex flex-col justify-between">
              <span className="text-yellow-400 font-bold block text-[9.5px]">TOMO 03 // REPARÁ TU PC</span>
              <p className="text-zinc-300 font-sans-editorial text-[9.5px] mt-1">“La Biblia del reparador de PC de escritorio. Síntoma → medición → descarte → solución.”</p>
            </div>
            <div className="p-2 bg-black/60 rounded border border-zinc-800/80 flex flex-col justify-between">
              <span className="text-yellow-400 font-bold block text-[9.5px]">TOMO 04 // REPARÁ TU NOTEBOOK</span>
              <p className="text-zinc-300 font-sans-editorial text-[9.5px] mt-1">“Diagnóstico y reparación de portátiles, desde el cargador hasta la placa madre.”</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. COLOPHON SOBRIO Y LIMPIO (SIN CÓDIGOS DE BARRA NI ISBN FALSOS)         */}
        {/* ========================================================================= */}
        <div className="relative z-10 mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono-tech text-zinc-400">
          <div className="space-y-0.5">
            <p className="font-bold text-white uppercase tracking-wider">
              EVO LABS // DIVISIÓN EDITORIAL Y METROLOGÍA DE HARDWARE
            </p>
            <p className="text-zinc-500 text-[8.5px]">
              EDICIÓN OFICIAL 2026 // DISTRIBUCIÓN EN FORMATO DIGITAL A4
            </p>
          </div>

          <div className="text-right">
            <span className="block text-[9.5px] font-bold text-yellow-400 uppercase tracking-widest">
              TOMO 01 FINALIZADO
            </span>
            <span className="block text-[8.5px] text-zinc-500">
              46 PÁGINAS EDITORIALES
            </span>
          </div>
        </div>

      </div>
    </MagazineMasterPage>
  );
};
