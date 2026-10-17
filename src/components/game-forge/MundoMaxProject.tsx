import React, { useState } from 'react';
import { GameForgeProgress, MUNDO_MAX_STAGES } from './GameForgeProgress';
import { Play, Sparkles, CheckCircle2, ChevronRight, Terminal, Box, Shield, Zap } from 'lucide-react';

export const MundoMaxProject: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(4);
  const currentStage = MUNDO_MAX_STAGES.find((s) => s.step === activeStep) || MUNDO_MAX_STAGES[0];

  return (
    <div className="space-y-6">
      <GameForgeProgress currentStep={activeStep} onSelectStep={(st) => setActiveStep(st)} />

      {/* Stage Detail Card */}
      <div className="p-6 rounded-2xl bg-[#090c14] border border-pink-500/30 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center font-mono font-black text-pink-400 text-sm">
              {currentStage.step}
            </span>
            <div>
              <h3 className="font-display font-black text-lg text-white uppercase">
                FASE {currentStage.step} // {currentStage.name}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">{currentStage.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono disabled:opacity-40"
            >
              ← ANTERIOR
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(12, prev + 1))}
              disabled={activeStep === 12}
              className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs font-mono disabled:opacity-40"
            >
              SIGUIENTE →
            </button>
          </div>
        </div>

        {/* Content details for selected phase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <div className="text-pink-400 font-bold uppercase flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>CÓDIGO DE ARQUITECTURA</span>
            </div>
            <p className="text-zinc-300">
              Implementación en TypeScript con componentes modulares desacoplados de renderizado.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <div className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5" />
              <span>VALIDACIÓN DE RENDIMIENTO</span>
            </div>
            <p className="text-zinc-300">
              Verificación de framerate a 60 FPS estables con $dt$ y cero asignaciones de memoria dinámicas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
            <div className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CRITERIO DE FINALIZACIÓN</span>
            </div>
            <p className="text-zinc-300">
              Prueba pericial superada antes de desbloquear el siguiente hito de desarrollo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
