import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export interface GameForgeStage {
  step: number;
  name: string;
  desc: string;
  status: 'completed' | 'current' | 'pending';
}

export const MUNDO_MAX_STAGES: GameForgeStage[] = [
  { step: 1, name: 'PERSONAJE', desc: 'Sprite, coordenadas (x,y), spawn y físicas básicas', status: 'completed' },
  { step: 2, name: 'MOVIMIENTO', desc: 'Input WASD, aceleración, velocidad y Delta Time (dt)', status: 'completed' },
  { step: 3, name: 'CÁMARA', desc: 'Cámara suave con interpolación Lerp y deadzone', status: 'completed' },
  { step: 4, name: 'MUNDO', desc: 'Tilemap, capas de fondo (Parallax) y límites del nivel', status: 'current' },
  { step: 5, name: 'INTERACCIÓN', desc: 'Triggers, cofres, monedas y colisiones con el entorno', status: 'pending' },
  { step: 6, name: 'ENEMIGOS', desc: 'Patrullaje, detección por distancia y spawn dinámico', status: 'pending' },
  { step: 7, name: 'IA & COMPORTAMIENTO', desc: 'Máquina de estados finitos (FSM) y persecución', status: 'pending' },
  { step: 8, name: 'COMBATE', desc: 'Hitboxes, Hurtboxes, invulnerabilidad (i-frames) y daño', status: 'pending' },
  { step: 9, name: 'UI & HUD', desc: 'Barra de vida, puntuación, inventario y menús', status: 'pending' },
  { step: 10, name: 'AUDIO', desc: 'Audio espacial, efectos SFX y música dinámica', status: 'pending' },
  { step: 11, name: 'OPTIMIZACIÓN', desc: 'Object Pooling, reducción de draw calls y profiling', status: 'pending' },
  { step: 12, name: 'BUILD & RELEASE', desc: 'Compilación ejecutable, empaquetado y distribución', status: 'pending' },
];

interface GameForgeProgressProps {
  currentStep?: number;
  onSelectStep?: (step: number) => void;
}

export const GameForgeProgress: React.FC<GameForgeProgressProps> = ({ currentStep = 4, onSelectStep }) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0a0d14] border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
          PROGRESIÓN MUNDO MAX // 12 HITOS DE INGENIERÍA
        </h3>
        <span className="text-[11px] font-mono text-pink-400 font-bold">
          FASE {currentStep} DE 12
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {MUNDO_MAX_STAGES.map((st) => {
          const isDone = st.step < currentStep;
          const isCurrent = st.step === currentStep;

          return (
            <div
              key={st.step}
              onClick={() => onSelectStep && onSelectStep(st.step)}
              className={`p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-pink-950/40 border-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[10px]">#{st.step.toString().padStart(2, '0')}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                ) : (
                  <Circle className="w-3 h-3 text-zinc-700" />
                )}
              </div>
              <div className="font-bold text-[11px] truncate">{st.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
