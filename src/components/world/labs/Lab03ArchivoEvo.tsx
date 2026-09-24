import React from 'react';
import { BookOpen, FileText, ArrowRight, ShieldCheck, Sparkles, Download, CheckCircle2, Bookmark } from 'lucide-react';

interface Lab03ArchivoEvoProps {
  onEnterTomo01?: () => void;
  onEnterMagazine?: () => void;
  onEnterTomo02?: () => void;
  onEnterTomo03?: () => void;
  onEnterTomo04?: () => void;
}

export const Lab03ArchivoEvo: React.FC<Lab03ArchivoEvoProps> = ({
  onEnterTomo01,
  onEnterMagazine,
  onEnterTomo02,
  onEnterTomo03,
  onEnterTomo04,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-400/15 via-[#0e1017] to-zinc-900 border-2 border-amber-400/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <BookOpen className="w-40 h-40 text-amber-400" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/50 text-amber-300 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 03 // BÓVEDA DE PUBLICACIONES & ARCHIVO MAESTRO
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// 4 VOLÚMENES EDITORIALES</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Archivo Técnico EVO & Biblioteca de Investigación
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              El repositorio oficial donde queda documentada toda la metrología, protocolos de descarte y arquitectura de computadoras. Desde el Tomo 01 fundamental hasta las guías periciales de microelectrónica.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onEnterMagazine}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>REVISTA A4 (46 PÁGS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Volumes with Direct Exploration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* TOMO 01 */}
        <div className="p-5 bg-[#0d0f17] border-2 border-amber-400 rounded-xl flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-mono-tech text-[10px] font-black uppercase">
                TOMO 01 // OFICIAL
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVO
              </span>
            </div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              Conocé tu PC
            </h3>
            <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              La base fundamental: arquitectura real, micro-stuttering, 6 puertas de arranque de Windows, cuello de botella y pasaporte pericial interactivo.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
              <span>Capítulos:</span>
              <span className="text-amber-400 font-bold">7 Interactivos</span>
            </div>
            <button
              type="button"
              onClick={onEnterTomo01}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>ABRIR TOMO 01</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TOMO 02 */}
        <div className="p-5 bg-[#0d0f17] border border-zinc-800 hover:border-yellow-400/60 rounded-xl flex flex-col justify-between space-y-4 shadow-xl transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-mono-tech text-[10px] font-bold uppercase">
                TOMO 02 // VOLUMEN
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400">EDICIÓN A4</span>
            </div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              La Biblia Negra de Windows
            </h3>
            <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
              Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando: telemetría oculta, ring 0 y descarte de mitos de optimización.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onEnterTomo02}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 border border-zinc-700 font-mono-tech text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>VER EDICIÓN TOMO 02</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TOMO 03 */}
        <div className="p-5 bg-[#0d0f17] border border-zinc-800 hover:border-yellow-400/60 rounded-xl flex flex-col justify-between space-y-4 shadow-xl transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-mono-tech text-[10px] font-bold uppercase">
                TOMO 03 // VOLUMEN
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400">EDICIÓN A4</span>
            </div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              Repará tu PC
            </h3>
            <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
              La Biblia del reparador de escritorio: Síntoma → Medición con multímetro → Descarte de variables → Solución garantizada.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onEnterTomo03}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 border border-zinc-700 font-mono-tech text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>VER EDICIÓN TOMO 03</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* TOMO 04 */}
        <div className="p-5 bg-[#0d0f17] border border-zinc-800 hover:border-yellow-400/60 rounded-xl flex flex-col justify-between space-y-4 shadow-xl transition-all group">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-mono-tech text-[10px] font-bold uppercase">
                TOMO 04 // VOLUMEN
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-400">EDICIÓN A4</span>
            </div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              Repará tu Notebook
            </h3>
            <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
              Diagnóstico y reparación de portátiles: desde el pin de carga y mosfets de entrada hasta lectura de esquemáticos y bios reprogramable.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onEnterTomo04}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 border border-zinc-700 font-mono-tech text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>VER EDICIÓN TOMO 04</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
