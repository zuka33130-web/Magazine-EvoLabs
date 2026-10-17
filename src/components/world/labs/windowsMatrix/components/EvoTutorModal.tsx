// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// EVO TUTOR MODAL — INSTANT SIMPLE EXPLANATION (NO JARGON)
// Activated by the permanent [ NO ENTIENDO ] button
// ============================================================================

import React from 'react';
import { HelpCircle, X, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

interface EvoTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepName: string;
  simpleExplanation: string;
  realWorldAnalogy?: string;
}

export const EvoTutorModal: React.FC<EvoTutorModalProps> = ({
  isOpen,
  onClose,
  stepName,
  simpleExplanation,
  realWorldAnalogy
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="max-w-lg w-full rounded-2xl bg-[#0c1017] border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,210,255,0.25)] p-5 sm:p-6 space-y-4 font-sans-editorial text-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-cyan-950 pb-3">
          <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase tracking-widest block">
              TUTOR EVO // EXPLICACIÓN EN PALABRAS SIMPLES
            </span>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              {stepName}
            </h3>
          </div>
        </div>

        {/* The Simple Core */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
          <strong className="text-cyan-300 font-mono-tech text-xs uppercase block font-bold">
            EN POCAS PALABRAS:
          </strong>
          <p className="text-zinc-100 text-sm sm:text-base leading-relaxed">
            {simpleExplanation}
          </p>
        </div>

        {/* Real World Analogy or Question */}
        {(() => {
          let headerText = "ANALOGÍA DE LA VIDA REAL:";
          if (realWorldAnalogy) {
            const trimmed = realWorldAnalogy.trim();
            if (trimmed.startsWith('¿') || trimmed.endsWith('?')) {
              headerText = "PREGUNTA DE INVESTIGACIÓN / GUÍA:";
            } else if (trimmed.toLowerCase().includes('explicación') || trimmed.toLowerCase().includes('explicar')) {
              headerText = "EXPLICACIÓN SIMPLE:";
            } else if (trimmed.toLowerCase().includes('ejemplo')) {
              headerText = "EJEMPLO REAL:";
            }
          }
          return (
            <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-1.5 text-xs">
              <strong className="text-amber-400 font-mono-tech text-xs uppercase block font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {headerText}
              </strong>
              <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                {realWorldAnalogy ||
                  'Pensá en Windows como un edificio de oficinas: este componente es como el conserje que verifica qué llaves tenés antes de dejarte pasar al ascensor.'}
              </p>
            </div>
          );
        })()}

        {/* Bottom Acknowledgment Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs font-mono-tech transition-colors cursor-pointer shadow-md"
          >
            ¡ENTENDIDO, VOLVER AL LABORATORIO!
          </button>
        </div>
      </div>
    </div>
  );
};
