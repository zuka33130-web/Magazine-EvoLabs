import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Shield,
  Layers,
  Zap,
  X,
  Compass,
  Cpu,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

export const TutorOnboardingModal: React.FC = () => {
  const { isOnboardingOpen, startZeroKnowledgeTour, dismissOnboarding } = useTutorEvo();

  if (!isOnboardingOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[140] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div className="bg-[#0b0f19] border border-zinc-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden font-sans-editorial">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={dismissOnboarding}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Cerrar bienvenida"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>EVO LABS // BIENVENIDO</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
          No necesitás saber informática para empezar.
        </h2>

        <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
          <strong className="text-white font-semibold">Tutor EVO</strong> te va a enseñar cómo funciona EVO LABS y te va a acompañar durante todo el recorrido: desde entender qué es un procesador hasta diagnosticar tu propia computadora como un perito.
        </p>

        {/* 3 Pillars of Zero Knowledge UX */}
        <div className="space-y-2.5 mb-8 text-xs text-zinc-300">
          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Sin dar nada por entendido:</strong> cada concepto, botón, imagen y medición tiene su explicación simple y paso a paso.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-3">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Orientación permanente:</strong> en cada pantalla vas a saber qué estás haciendo, por qué importa y cuál es el próximo paso.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Prácticas reales seguras:</strong> vas a experimentar y comprobar sin ningún riesgo de desconfigurar tu máquina.
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={startZeroKnowledgeTour}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-xl font-extrabold text-sm text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>EMPEZAR DESDE CERO</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={dismissOnboarding}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs border border-zinc-700 transition-all text-center cursor-pointer"
          >
            YA CONOZCO EVO LABS
          </button>
        </div>
      </div>
    </div>
  );
};
