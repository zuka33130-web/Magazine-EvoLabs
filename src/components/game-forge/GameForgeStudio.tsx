import React, { useState } from 'react';
import { Play, Sparkles, X, Activity, Box, Compass, Flame, Shield, Wrench, Layers } from 'lucide-react';
import { MundoMaxProject } from './MundoMaxProject';

interface GameForgeStudioProps {
  onClose: () => void;
  initialTab?: 'logic' | 'math' | 'mundomax';
}

export const GameForgeStudio: React.FC<GameForgeStudioProps> = ({ onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'logic' | 'math' | 'mundomax' | 'catalog'>(initialTab || 'logic');

  // LAB 1: Game Logic State
  const [targetFps, setTargetFps] = useState<number>(60);
  const [useDeltaTime, setUseDeltaTime] = useState<boolean>(true);
  const [simulatedPos, setSimulatedPos] = useState<number>(0);
  const [speedPerSecond] = useState<number>(100);

  // LAB 2: Game Math State
  const [enemyAngle, setEnemyAngle] = useState<number>(0); // degrees
  const [playerAngle, setPlayerAngle] = useState<number>(45); // degrees

  // Dot product calculation
  const radDiff = ((playerAngle - enemyAngle) * Math.PI) / 180;
  const dotProduct = Math.cos(radDiff);
  const isVisible = dotProduct > 0;

  const handleStepLogic = () => {
    const dt = 1 / targetFps;
    const move = useDeltaTime ? speedPerSecond * dt : speedPerSecond * (1 / 60);
    setSimulatedPos((prev) => (prev + move) % 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 overflow-y-auto flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="max-w-5xl w-full bg-[#090c14] border border-pink-500/40 rounded-2xl p-6 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-pink-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-white uppercase tracking-wide">
                EVO GAME FORGE STUDIO // TOMO 12
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                MOTOR DE DESARROLLO, FÍSICAS, MATEMÁTICAS & PROYECTO MUNDO MAX
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 text-xs font-mono"
          >
            CERRAR
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'logic', label: '1. GAME LOGIC & DELTA TIME LAB (ACTIVO)' },
            { id: 'math', label: '2. GAME MATH & DOT PRODUCT LAB (ACTIVO)' },
            { id: 'mundomax', label: '3. MUNDO MAX STUDIO (ACTIVO)' },
            { id: 'catalog', label: 'OTROS MÓDULOS (CATÁLOGO)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LAB 1: Game Logic & Delta Time */}
        {activeTab === 'logic' && (
          <div className="p-6 rounded-2xl bg-[#06080e] border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-pink-400 font-mono flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>BANCO 01 // EXPERIMENTO DE CONSISTENCIA TEMPORAL CON DELTA TIME ($dt$)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">
                    TASA DE REFRESCO DEL MONITOR / FPS: {targetFps} FPS (dt = {(1000 / targetFps).toFixed(2)} ms)
                  </label>
                  <div className="flex gap-2">
                    {[30, 60, 144, 240].map((fps) => (
                      <button
                        key={fps}
                        onClick={() => setTargetFps(fps)}
                        className={`px-3 py-1 rounded-lg border ${
                          targetFps === fps ? 'bg-pink-600 text-white border-pink-400 font-bold' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {fps} FPS
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={useDeltaTime}
                      onChange={(e) => setUseDeltaTime(e.target.checked)}
                      className="accent-pink-500 w-4 h-4"
                    />
                    <span>HABILITAR ESCALADO CON DELTA TIME (x = x + v · dt)</span>
                  </label>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {useDeltaTime
                      ? '✓ CORRECTO: La velocidad de desplazamiento en pantalla es idéntica a 30, 60 o 240 FPS.'
                      : '⚠ ERROR: El movimiento depende de los FPS del monitor (a 240 FPS viaja 4 veces más rápido).'}
                  </p>
                </div>

                <button
                  onClick={handleStepLogic}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>AVANZAR 1 TICK DE JUEGO</span>
                </button>
              </div>

              {/* Visual Track */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="text-[11px] font-mono text-zinc-400 uppercase">
                  POSICIÓN DEL PERSONAJE: {simulatedPos.toFixed(1)} px
                </div>

                <div className="h-12 w-full bg-zinc-900 rounded-xl relative overflow-hidden border border-zinc-800 flex items-center">
                  <div
                    className="w-8 h-8 rounded-lg bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] absolute transition-all duration-75 flex items-center justify-center text-[10px] font-bold text-white font-mono"
                    style={{ left: `${(simulatedPos % 500) / 5}%` }}
                  >
                    MAX
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAB 2: Game Math & Dot Product */}
        {activeTab === 'math' && (
          <div className="p-6 rounded-2xl bg-[#06080e] border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-pink-400 font-mono flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>BANCO 02 // ÁLGEBRA VECTORIAL: PRODUCTO ESCALAR & CAMPO DE VISIÓN (FOV)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">
                    ÁNGULO DE MIRADA DEL ENEMIGO: {enemyAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={enemyAngle}
                    onChange={(e) => setEnemyAngle(parseInt(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">
                    POSICIÓN ANGULAR DEL JUGADOR: {playerAngle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={playerAngle}
                    onChange={(e) => setPlayerAngle(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-center">
                <div className="text-[11px] text-zinc-500 uppercase">
                  PRODUCTO ESCALAR (V_look · V_target = cos(Δθ))
                </div>
                <div className={`text-3xl font-black ${isVisible ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dotProduct.toFixed(3)}
                </div>

                <div className={`p-2.5 rounded-xl border text-xs font-bold ${
                  isVisible ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-red-950/40 border-red-500/50 text-red-300'
                }`}>
                  {isVisible ? '✓ JUGADOR DENTRO DEL CONO FRONTAL DE VISIÓN' : '✗ JUGADOR FUERA DE LA VISTA (A SUS ESPALDAS)'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAB 3: Mundo Max Studio */}
        {activeTab === 'mundomax' && <MundoMaxProject />}

        {/* Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-zinc-400">
              MÓDULOS DEL MOTOR DE VIDEOJUEGOS // TOMO 12:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: '4. SHADER & PBR LIGHTING BENCH', status: 'IN DEVELOPMENT' },
                { name: '5. SAT POLYGON COLLISION SOLVER', status: 'IN DEVELOPMENT' },
                { name: '6. SPATIAL AUDIO 3D WORKBENCH', status: 'IN DEVELOPMENT' },
                { name: '7. OBJECT POOLING PROFILER', status: 'IN DEVELOPMENT' },
              ].map((lab, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-300">{lab.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-pink-400 border border-pink-500/30">
                    {lab.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
