import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Shield,
  Layers,
  HelpCircle,
  X,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

interface TutorTomo01WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartZeroKnowledge: () => void;
  onExploreFreely: () => void;
  onStartChapter01?: () => void;
}

export const TutorTomo01WelcomeModal: React.FC<TutorTomo01WelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartZeroKnowledge,
  onExploreFreely,
  onStartChapter01,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida a Tomo 01 - Tutor EVO"
      className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 font-sans-editorial select-none"
    >
      <div className="bg-[#0b0f19] border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Cerrar bienvenida"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>TUTOR EVO TE GUÍA // TOMO 01</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
          No necesitás conocimientos previos.
        </h2>

        <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
          Voy a mostrarte cómo funciona este <strong className="text-amber-400 font-semibold">Tomo 01 (Conocé tu PC)</strong> y te voy a acompañar paso a paso: desde saber qué procesador tenés hasta entender la telemetría de tu máquina como un profesional.
        </p>

        {/* 3 Core Guarantees for Zero Knowledge */}
        <div className="space-y-2.5 mb-8 text-xs text-zinc-300">
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Sin dar nada por entendido:</strong> cada botón, término y diagrama tiene un botón <span className="text-amber-400 font-mono">[? ¿QUÉ ES?]</span> para explicarlo al instante.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Nunca te vas a quedar varado:</strong> siempre verás claramente <strong className="text-white">DÓNDE ESTÁS</strong>, <strong className="text-white">QUÉ HACER AHORA</strong> y <strong className="text-white">QUÉ VIENE DESPUÉS</strong>.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Prácticas 100% seguras:</strong> las actividades guiadas miden y leen telemetría sin ningún riesgo para tu computadora.
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onStartZeroKnowledge}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-xl font-extrabold text-sm text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>EMPEZAR DESDE CERO</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            type="button"
            onClick={onExploreFreely}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 transition-all text-center cursor-pointer"
          >
            EXPLORAR LIBREMENTE
          </button>
        </div>
      </div>
    </div>
  );
};
