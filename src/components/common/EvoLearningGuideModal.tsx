import React from 'react';
import { EvoLabPedagogicalGuide } from '../../data/evoLearningPaths';
import {
  X,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Activity,
  Layers,
  CheckCircle2,
  Eye,
  Sliders,
  Sparkles,
  Info,
  Terminal,
} from 'lucide-react';

interface EvoLearningGuideModalProps {
  guide: EvoLabPedagogicalGuide | null;
  isOpen: boolean;
  onClose: () => void;
  onEnterLab: () => void;
  onReadRelatedTomo?: () => void;
}

export const EvoLearningGuideModal: React.FC<EvoLearningGuideModalProps> = ({
  guide,
  isOpen,
  onClose,
  onEnterLab,
  onReadRelatedTomo,
}) => {
  if (!isOpen || !guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#090c14] border border-zinc-700/80 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col overflow-hidden font-mono-tech select-none">
        
        {/* Header de la Ficha Pedagógica */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl border shrink-0"
              style={{
                backgroundColor: `${guide.accentColor}15`,
                borderColor: `${guide.accentColor}40`,
                color: guide.accentColor,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  GUÍA UNIVERSAL ANTES DE INGRESAR AL LABORATORIO
                </span>
                <span
                  className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${guide.accentColor}20`,
                    borderColor: `${guide.accentColor}40`,
                    color: guide.accentColor,
                  }}
                >
                  {guide.status}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-display tracking-tight uppercase">
                {guide.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Cerrar guía pedagógica"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido: Las 8 Preguntas Pedagógicas */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          
          {/* Banner de Orientación */}
          <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
              <strong className="text-amber-300 font-mono-tech">Principio Pedagógico EVO:</strong> Este laboratorio no es un ejercicio al azar. Cada práctica responde a una hipótesis técnica y a una comprobación objetiva con herramientas periciales.
            </div>
          </div>

          {/* Bloque 1: ¿QUÉ ES ESTE LABORATORIO? */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. ¿QUÉ ES ESTE LABORATORIO?</span>
            </div>
            <p className="text-zinc-200 font-sans-editorial text-xs sm:text-sm leading-relaxed pl-5.5">
              {guide.whatIsThisLab}
            </p>
          </div>

          {/* Bloque 2: ¿QUÉ VOY A PRACTICAR? */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. ¿QUÉ VOY A PRACTICAR?</span>
            </div>
            <p className="text-zinc-200 font-sans-editorial text-xs sm:text-sm leading-relaxed pl-5.5">
              {guide.whatYouWillPractice}
            </p>
          </div>

          {/* Bloque 3: ¿CON QUÉ TOMO SE RELACIONA? */}
          {guide.relatedTomoTitle && (
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>3. ¿CON QUÉ TOMO SE RELACIONA?</span>
              </div>
              <p className="text-amber-200 font-sans-editorial text-xs sm:text-sm font-semibold leading-relaxed pl-5.5">
                {guide.relatedTomoTitle}
              </p>
            </div>
          )}

          {/* Bloque 4: ¿QUÉ DEBERÍA SABER ANTES? */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>4. ¿QUÉ DEBERÍA SABER ANTES?</span>
            </div>
            <p className="text-zinc-300 font-sans-editorial text-xs sm:text-sm leading-relaxed pl-5.5">
              {guide.whatToKnowBefore}
            </p>
          </div>

          {/* Grid de 2 columnas para 5, 6, 7 y 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Bloque 5: ¿CÓMO SE USA? */}
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>5. ¿CÓMO SE USA?</span>
              </div>
              <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                {guide.howToUse}
              </p>
            </div>

            {/* Bloque 6: ¿QUÉ DEBO OBSERVAR? */}
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>6. ¿QUÉ DEBO OBSERVAR?</span>
              </div>
              <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                {guide.whatToObserve}
              </p>
            </div>

            {/* Bloque 7: ¿QUÉ DEBO INTENTAR COMPROBAR? */}
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>7. ¿QUÉ DEBO INTENTAR COMPROBAR?</span>
              </div>
              <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                {guide.whatToProve}
              </p>
            </div>

            {/* Bloque 8: ¿QUÉ HAGO CUANDO TERMINO? */}
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <Terminal className="w-3.5 h-3.5 text-rose-400" />
                <span>8. ¿QUÉ HAGO CUANDO TERMINO?</span>
              </div>
              <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                {guide.whatToDoWhenFinished}
              </p>
            </div>
          </div>

          {/* Información complementaria de herramientas transversales */}
          {guide.whenToUse && (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div>
                <span className="text-zinc-500 font-bold uppercase">Cuándo usarlo: </span>
                <span className="text-zinc-300 font-sans-editorial">{guide.whenToUse}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold uppercase">Resultado: </span>
                <span className="text-emerald-400">{guide.whatOutputDelivers}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer con los Dos Botones Principales */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            {guide.relatedTomoTitle && onReadRelatedTomo ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReadRelatedTomo();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>LEER CONTENIDO RELACIONADO</span>
              </button>
            ) : (
              <span className="text-[11px] text-zinc-500 font-sans-editorial">
                Ficha previa obligatoria del método EVO LABS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 font-bold text-xs transition-colors cursor-pointer"
            >
              CANCELAR
            </button>

            {guide.status === 'EN DESARROLLO' ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800/60 text-zinc-500 border border-zinc-700/50 font-bold text-xs uppercase tracking-wider cursor-not-allowed"
              >
                LABORATORIO EN DESARROLLO
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnterLab();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <span>ENTRAR AL LABORATORIO</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
