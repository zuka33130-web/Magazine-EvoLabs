import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  EvoFanSvg,
  EvoOpenPcWorkstationSvg,
  CircuitDiagnosticSvg,
  PerformanceBenchSvg,
  MachineWorkshopSvg,
  ExperimentsBenchSvg,
} from '../../assets/evo-world/LabIllustrations';
import {
  Cpu,
  Activity,
  Terminal,
  Layers,
  Wrench,
  Search,
  ArrowRight,
  FastForward,
  Play,
  Pause,
  ChevronRight,
} from 'lucide-react';

interface EvoIntroExperienceProps {
  onComplete: () => void;
}

export const EvoIntroExperience: React.FC<EvoIntroExperienceProps> = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);

  const sceneDurations = [10000, 11000, 11000, 12000]; // ms per scene (~44s total)

  // Auto progression
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < 4) {
        setCurrentScene((prev) => prev + 1);
      } else {
        // Stay on scene 4 waiting for button click
      }
    }, sceneDurations[currentScene - 1]);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  // Scene 2 sequential verbs timing
  useEffect(() => {
    if (currentScene === 2) {
      setActiveWordIndex(0);
      const interval = setInterval(() => {
        setActiveWordIndex((prev) => (prev < 5 ? prev + 1 : prev));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [currentScene]);

  const verbs = [
    { text: 'REPARAMOS.', icon: Wrench, detail: 'Diagnóstico en circuito' },
    { text: 'OPTIMIZAMOS.', icon: Activity, detail: 'Frametimes & voltajes' },
    { text: 'EXPERIMENTAMOS.', icon: Layers, detail: 'Matrices A/B sin ruido' },
    { text: 'COMPARAMOS.', icon: Cpu, detail: 'OS & microcódigos' },
    { text: 'CONSTRUIMOS.', icon: Terminal, detail: 'Scripts livianos propios' },
    { text: 'INVESTIGAMOS.', icon: Search, detail: 'Forense causal profunda' },
  ];

  const handleNext = () => {
    if (currentScene < 4) {
      setCurrentScene((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between overflow-hidden select-none font-sans-editorial">
      {/* Background Architectural Grid & Subtle Vignette */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#09090b]/60 to-[#09090b] pointer-events-none" />

      {/* Top Header Controls */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6 border-b border-zinc-900/80 bg-zinc-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-mono-tech text-xs tracking-widest text-amber-400 font-semibold uppercase">
            EVO LABS // SECUENCIA DE INGRESO
          </span>
          <span className="hidden sm:inline-block font-mono-tech text-xs text-zinc-600">
            [ESCENA 0{currentScene}/04]
          </span>
        </div>

        {/* Progress indicators & Skip */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentScene(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentScene === idx
                    ? 'w-8 bg-amber-400'
                    : currentScene > idx
                    ? 'w-4 bg-zinc-600'
                    : 'w-4 bg-zinc-800'
                }`}
                title={`Ir a escena ${idx}`}
                aria-label={`Escena ${idx}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onComplete}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-zinc-800 hover:border-amber-400/60 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono-tech text-zinc-400 hover:text-amber-400 transition-all cursor-pointer"
          >
            <span>SALTAR INTRO</span>
            <FastForward className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* Main Cinematic Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-10 max-w-6xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* ========================================================
              ESCENA 01 // EL DESPERTAR DEL LABORATORIO
             ======================================================== */}
          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full flex flex-col items-center justify-center text-center relative"
            >
              {/* Background ambient silhouettes: fans, cables, open rig */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 filter blur-xs scale-105">
                <EvoOpenPcWorkstationSvg className="max-w-2xl text-zinc-700" />
              </div>

              {/* Slow turning fans on sides */}
              <div className="absolute -left-4 top-10 opacity-30 hidden md:block">
                <EvoFanSvg size={68} speed="slow" />
              </div>
              <div className="absolute -right-4 bottom-12 opacity-30 hidden md:block">
                <EvoFanSvg size={84} speed="slow" />
              </div>

              {/* Main Visual: Technical Workbench with low-key lighting */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 1.8, delay: 0.3 }}
                className="w-full max-w-xl mx-auto mb-8 border border-zinc-800/80 rounded-lg p-6 bg-zinc-950/60 backdrop-blur-sm shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-2 right-3 font-mono-tech text-[10px] text-zinc-600">
                  SYSTEM_STATUS: POWER_RAILS_ACTIVE
                </div>
                <EvoOpenPcWorkstationSvg className="max-w-md mx-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]" />
              </motion.div>

              {/* Titles appearing smoothly */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1 }}
                className="space-y-3"
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
                  EVO LABS
                </h1>
                <div className="h-0.5 w-16 bg-amber-400 mx-auto" />
                <div className="font-mono-tech text-sm sm:text-base md:text-lg tracking-widest text-zinc-400 uppercase font-medium space-x-2 sm:space-x-4">
                  <span>TU TÉCNICO.</span>
                  <span className="text-zinc-600">//</span>
                  <span className="text-amber-400 font-semibold">TU LABORATORIO.</span>
                  <span className="text-zinc-600">//</span>
                  <span>TU MUNDO TECNOLÓGICO.</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="mt-8 font-mono-tech text-xs text-zinc-500 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Inicializando banco de pruebas y telemetría de hardware...</span>
              </motion.div>
            </motion.div>
          )}

          {/* ========================================================
              ESCENA 02 // ACÁ NO VENÍS A MIRAR. VENÍS A HACER.
             ======================================================== */}
          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full flex flex-col items-center text-center space-y-6"
            >
              {/* Technical Situation Mosaic Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl opacity-85">
                <div className="border border-zinc-800 rounded p-2 bg-zinc-950/80 flex flex-col items-center">
                  <span className="font-mono-tech text-[10px] text-zinc-500 mb-1">TELEMETRÍA // FRAMETIMES</span>
                  <PerformanceBenchSvg className="w-24 h-24" isHovered />
                </div>
                <div className="border border-zinc-800 rounded p-2 bg-zinc-950/80 flex flex-col items-center">
                  <span className="font-mono-tech text-[10px] text-zinc-500 mb-1">FORENSE // TRIAGE BSOD</span>
                  <CircuitDiagnosticSvg className="w-24 h-24" isHovered />
                </div>
                <div className="border border-zinc-800 rounded p-2 bg-zinc-950/80 flex flex-col items-center">
                  <span className="font-mono-tech text-[10px] text-zinc-500 mb-1">MÉTODO // ENSAYO A/B</span>
                  <ExperimentsBenchSvg className="w-24 h-24" isHovered />
                </div>
                <div className="border border-zinc-800 rounded p-2 bg-zinc-950/80 flex flex-col items-center">
                  <span className="font-mono-tech text-[10px] text-zinc-500 mb-1">CÓDIGO // SCRIPTS PWSH</span>
                  <MachineWorkshopSvg className="w-24 h-24" isHovered />
                </div>
              </div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2 pt-2"
              >
                <div className="font-mono-tech text-xs tracking-widest text-zinc-500 uppercase">
                  MANIFIESTO OPERATIVO
                </div>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white">
                  ACÁ NO VENÍS A MIRAR.
                </h2>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-amber-400">
                  VENÍS A HACER.
                </h2>
              </motion.div>

              {/* Sequential Action Verbs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full max-w-5xl pt-3">
                {verbs.map((verb, idx) => {
                  const Icon = verb.icon;
                  const isActive = idx <= activeWordIndex;
                  const isCurrent = idx === activeWordIndex;

                  return (
                    <motion.div
                      key={verb.text}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{
                        opacity: isActive ? 1 : 0.25,
                        y: 0,
                        scale: isCurrent ? 1.04 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                          : isActive
                          ? 'border-zinc-700 bg-zinc-900/60'
                          : 'border-zinc-900 bg-zinc-950/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon
                          className={`w-4 h-4 ${
                            isCurrent ? 'text-amber-400' : isActive ? 'text-zinc-300' : 'text-zinc-600'
                          }`}
                        />
                        <span className="font-mono-tech text-[9px] text-zinc-500">0{idx + 1}</span>
                      </div>
                      <div className="font-display font-bold text-xs sm:text-sm tracking-tight text-white">
                        {verb.text}
                      </div>
                      <div className="font-mono-tech text-[9px] text-zinc-400 mt-1 truncate">
                        {verb.detail}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========================================================
              ESCENA 03 // EN EVO LABS HACEMOS MILAGROS
             ======================================================== */}
          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
            >
              {/* Protagonist Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 font-mono-tech text-xs text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  MÁXIMA RECTORA DEL LABORATORIO
                </div>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white">
                  EN EVO LABS
                </h2>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-amber-400">
                  HACEMOS MILAGROS.
                </h2>
                <p className="font-mono-tech text-xs sm:text-sm text-zinc-400 tracking-wider">
                  Pero nunca por fe. Siempre con telemetría.
                </p>
              </motion.div>

              {/* The Creed of Capabilities */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full text-left pt-2"
              >
                {[
                  'Revivimos máquinas.',
                  'Perseguimos FPS.',
                  'Encontramos recursos escondidos.',
                  'Investigamos problemas que nadie entiende.',
                  'Comparamos sistemas operativos, drivers y configuraciones.',
                  'Creamos herramientas.',
                  'Reparamos hardware.',
                  'Construimos experimentos.',
                  'Y después mostramos qué ocurrió.',
                ].map((statement, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                    className={`p-3.5 rounded border ${
                      idx === 8
                        ? 'border-amber-400 bg-amber-400/10 sm:col-span-2 md:col-span-1'
                        : 'border-zinc-800/90 bg-zinc-950/70'
                    }`}
                  >
                    <div className="font-mono-tech text-[10px] text-amber-400 mb-1">
                      // {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div
                      className={`text-sm sm:text-base font-semibold ${
                        idx === 8 ? 'text-amber-300 font-display' : 'text-zinc-200'
                      }`}
                    >
                      {statement}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ========================================================
              ESCENA 04 // TODO EMPIEZA CON UNA MÁQUINA. LA TUYA.
             ======================================================== */}
          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full flex flex-col items-center text-center max-w-4xl mx-auto space-y-6"
            >
              {/* Visual representation of user's PC with telemetry beams radiating to laboratory zones */}
              <div className="relative w-full max-w-md h-52 sm:h-60 mx-auto flex items-center justify-center">
                {/* Concentric telemetry circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-52 h-52 rounded-full border border-zinc-800 animate-ping opacity-20" />
                  <div className="w-40 h-40 rounded-full border border-amber-400/20" />
                  <div className="w-28 h-28 rounded-full border border-amber-400/40" />
                </div>

                {/* Core Workstation / TU PC */}
                <div className="relative z-10 p-5 rounded-xl border border-amber-400 bg-zinc-950 shadow-[0_0_30px_rgba(234,179,8,0.25)] flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg bg-amber-400/10 border border-amber-400 flex items-center justify-center mb-2 text-amber-400">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="font-display font-bold text-sm tracking-wider text-white">
                    TU PC // NÚCLEO ACTIVO
                  </span>
                  <span className="font-mono-tech text-[10px] text-amber-400">
                    SUJETO PRIMARIO DE INVESTIGACIÓN
                  </span>
                </div>

                {/* Radial data vectors radiating outward */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 240">
                  <line x1="200" y1="120" x2="60" y2="40" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 4" className="animate-evo-pulse-line" />
                  <line x1="200" y1="120" x2="340" y2="40" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 4" className="animate-evo-pulse-line" />
                  <line x1="200" y1="120" x2="50" y2="200" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 4" className="animate-evo-pulse-line" />
                  <line x1="200" y1="120" x2="350" y2="200" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 4" className="animate-evo-pulse-line" />

                  {/* Endpoint satellite nodes representing zones */}
                  <circle cx="60" cy="40" r="4" fill="#eab308" />
                  <circle cx="340" cy="40" r="4" fill="#eab308" />
                  <circle cx="50" cy="200" r="4" fill="#eab308" />
                  <circle cx="350" cy="200" r="4" fill="#eab308" />
                </svg>
              </div>

              {/* Key Headline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-2"
              >
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white uppercase">
                  TODO EMPIEZA CON UNA MÁQUINA.
                </h2>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-amber-400 uppercase">
                  LA TUYA.
                </h2>
              </motion.div>

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-xl mx-auto space-y-1 text-sm sm:text-base text-zinc-300"
              >
                <p className="font-mono-tech text-xs sm:text-sm text-zinc-400">
                  Cada prueba. Cada reparación. Cada experimento. Cada descubrimiento.
                </p>
                <p className="text-base sm:text-lg font-medium text-white">
                  va construyendo <span className="text-amber-400 font-bold uppercase">TU LABORATORIO</span>.
                </p>
              </motion.div>

              {/* Main Entrance Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-4"
              >
                <button
                  id="evo-btn-enter-world"
                  onClick={onComplete}
                  className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-black text-base sm:text-lg tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_45px_rgba(234,179,8,0.6)] cursor-pointer"
                >
                  <span>ENTRAR A EVO LABS</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Status Bar / Navigation */}
      <footer className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-4 border-t border-zinc-900/80 bg-zinc-950/40 backdrop-blur-md text-xs font-mono-tech text-zinc-500">
        <div className="flex items-center gap-4">
          <span>PLATAFORMA_VER: EVO_WORLD_V1.0</span>
          <span className="hidden sm:inline-block">//</span>
          <span className="hidden sm:inline-block text-zinc-400">TELEMETRÍA LOCAL 100% PRIVADA</span>
        </div>

        <div className="flex items-center gap-3">
          {currentScene < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span>SIGUIENTE ESCENA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-amber-400 font-semibold animate-pulse">LISTO PARA EL DESPLIEGUE</span>
          )}
        </div>
      </footer>
    </div>
  );
};
