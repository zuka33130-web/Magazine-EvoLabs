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
  Layers,
  ArrowRight,
  BookOpen,
  Zap,
  FolderGit2,
  Compass,
  CheckCircle2,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Shield,
  Activity,
  BookmarkCheck,
  Check,
  Flame,
} from 'lucide-react';

export interface EvoIntroExperienceProps {
  onEnterCampus: () => void;
  onStartTomo01: () => void;
  onSkipAndRemember?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const EvoIntroExperience: React.FC<EvoIntroExperienceProps> = ({
  onEnterCampus,
  onStartTomo01,
  onSkipAndRemember,
  onComplete,
  onSkip,
}) => {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rememberPreference, setRememberPreference] = useState<boolean>(false);

  const sceneDurations = [14000, 16000, 16000]; // ms per scene

  // Auto progression
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < 3) {
        setCurrentScene((prev) => prev + 1);
      }
    }, sceneDurations[currentScene - 1]);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const handleEnterCampusAction = () => {
    if (rememberPreference) {
      try {
        localStorage.setItem('evo_academia_intro_dismissed', 'true');
      } catch {
        // ignore
      }
    }
    if (onEnterCampus) onEnterCampus();
    else if (onComplete) onComplete();
  };

  const handleStartTomo01Action = () => {
    if (rememberPreference) {
      try {
        localStorage.setItem('evo_academia_intro_dismissed', 'true');
      } catch {
        // ignore
      }
    }
    if (onStartTomo01) onStartTomo01();
    else if (onComplete) onComplete();
  };

  const handleSkipAndRememberAction = () => {
    try {
      localStorage.setItem('evo_academia_intro_dismissed', 'true');
    } catch {
      // ignore
    }
    if (onSkipAndRemember) onSkipAndRemember();
    else if (onSkip) onSkip();
    else if (onEnterCampus) onEnterCampus();
    else if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07090f] text-[#f4f4f5] flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-sans-editorial">
      {/* Background Architectural Grid & Subtle Vignette */}
      <div className="fixed inset-0 bg-tech-grid opacity-15 pointer-events-none" />
      <div className="fixed inset-0 bg-radial from-transparent via-[#07090f]/70 to-[#07090f] pointer-events-none" />

      {/* Top Institutional Header Controls */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-10 py-4 border-b border-zinc-900/90 bg-[#07090f]/85 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
            <div className="flex flex-col">
              <span className="font-display font-black text-sm sm:text-base tracking-wider text-white uppercase">
                ACADEMIA <span className="text-amber-400">EVO LABS</span>
              </span>
              <span className="font-mono-tech text-[10px] text-zinc-400 tracking-wider hidden sm:inline-block">
                SISTEMA DE APRENDIZAJE TECNOLÓGICO
              </span>
            </div>
          </div>
        </div>

        {/* Scene stepper & Skip controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentScene(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  currentScene === idx
                    ? 'w-7 sm:w-10 bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                    : currentScene > idx
                    ? 'w-3.5 bg-zinc-600'
                    : 'w-3.5 bg-zinc-800'
                }`}
                title={`Ir a escena ${idx}`}
                aria-label={`Escena ${idx}`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? 'Pausar auto-reproducción' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={handleSkipAndRememberAction}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-amber-400/60 bg-zinc-900/80 hover:bg-zinc-800 text-[11px] font-mono-tech text-zinc-400 hover:text-amber-300 transition-all cursor-pointer shadow-sm"
            title="Saltar intro y guardar para no volver a mostrar al iniciar"
          >
            <span className="hidden sm:inline">Saltar intro y recordar</span>
            <span className="sm:hidden">Saltar</span>
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </header>

      {/* Main Cinematic Presentation Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 max-w-6xl mx-auto w-full my-auto">
        <AnimatePresence mode="wait">
          {/* ========================================================
              ESCENA 01 // BIENVENIDO A LA ACADEMIA EVO LABS
             ======================================================== */}
          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center justify-center text-center space-y-6"
            >
              {/* Discrete Institutional Diagram & Subtle Pulses */}
              <div className="relative max-w-xl mx-auto flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 filter blur-xs">
                  <EvoOpenPcWorkstationSvg className="max-w-md text-zinc-700" />
                </div>
                <div className="absolute -left-6 top-2 opacity-35 hidden md:block">
                  <EvoFanSvg size={60} speed="slow" />
                </div>
                <div className="absolute -right-6 bottom-2 opacity-35 hidden md:block">
                  <EvoFanSvg size={70} speed="slow" />
                </div>

                <div className="relative z-10 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-mono-tech text-xs tracking-widest text-amber-300 font-bold uppercase">
                    ACADEMIA EVO LABS // SISTEMA DE APRENDIZAJE TECNOLÓGICO
                  </span>
                </div>
              </div>

              {/* Title & Official Motto */}
              <div className="space-y-3 max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
                  BIENVENIDO A LA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                    ACADEMIA EVO LABS
                  </span>
                </h1>

                {/* Motto */}
                <div className="py-1">
                  <div className="inline-block px-4 py-1 rounded-lg bg-zinc-900/90 border border-zinc-700/80 font-mono-tech text-xs sm:text-sm font-bold text-amber-400 tracking-widest uppercase shadow-md">
                    LEMA: NO LO CREAS. COMPROBALO.
                  </div>
                </div>
              </div>

              {/* Official Welcome Copy (Exact Requirements) */}
              <div className="max-w-2xl mx-auto space-y-4 text-zinc-300 font-sans-editorial text-sm sm:text-base leading-relaxed p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md">
                <p className="font-medium text-white sm:text-lg italic">
                  “No importa si estás dando tus primeros pasos en informática o si ya trabajás profesionalmente con computadoras. EVO LABS fue creado para acompañarte durante todo el recorrido.”
                </p>
                <div className="h-px w-20 bg-amber-400/40 mx-auto" />
                <p className="text-zinc-300">
                  “Acá no vas a encontrar solamente información. <br />
                  Vas a aprender a <strong className="text-amber-300 font-bold">entender qué ocurre, observarlo, experimentarlo, diagnosticarlo y comprobarlo</strong>.”
                </p>
              </div>

              {/* Primary Entrance Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={handleEnterCampusAction}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-display font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ENTRAR A LA ACADEMIA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleStartTomo01Action}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white hover:text-amber-300 border border-zinc-700 hover:border-amber-400/50 font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>COMENZAR POR EL TOMO 01</span>
                </button>
              </div>

              {/* Navigation cue */}
              <button
                onClick={() => setCurrentScene(2)}
                className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-zinc-500 hover:text-amber-400 transition-colors pt-1 cursor-pointer"
              >
                <span>Descubrí qué encontrás en EVO LABS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* ========================================================
              ESCENA 02 // QUÉ ENCONTRÁS EN EVO LABS (LOS 4 PILARES)
             ======================================================== */}
          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center text-center space-y-6"
            >
              {/* Headline */}
              <div className="space-y-1">
                <div className="font-mono-tech text-xs tracking-widest text-amber-400 font-bold uppercase">
                  CONTENIDOS & CAPACIDADES
                </div>
                <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
                  QUÉ ENCONTRÁS EN EVO LABS
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans-editorial">
                  Todo lo necesario para formarte como un técnico de clase mundial.
                </p>
              </div>

              {/* Visual Grid of the 4 Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl text-left">
                {/* 1. 10 TOMOS EVO LABS */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                        BIBLIOTECA EDITORIAL
                      </span>
                      <BookOpen className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      10 TOMOS EVO LABS
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans-editorial">
                      Revistas técnicas en formato Magazine que recorren:
                    </p>
                    {/* The 10 subjects */}
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono-tech text-zinc-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Hardware</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Windows</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Reparación de PC</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Reparación Notebooks</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Redes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Ciberseguridad</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Gaming & Optimización</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Arquitectura x86</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Diagnóstico Avanzado</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400" />
                        <span>Forense de Hardware</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. LABORATORIOS GUIADOS Y TÉCNICOS */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                        EXPERIMENTACIÓN SEGURA
                      </span>
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      LABORATORIOS GUIADOS Y TÉCNICOS
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                      Herramientas reales y simulaciones para experimentar sin miedo a romper nada.
                    </p>
                    <div className="space-y-1.5 pt-2 text-xs text-zinc-400">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-200 font-semibold">Lab de Arranque y Fallas (Tomo 08)</span>
                        <span className="text-[9px] font-mono-tech text-emerald-400 font-bold">35 ESTADOS</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-200 font-semibold">Windows Matrix & Kernel NT</span>
                        <span className="text-[9px] font-mono-tech text-emerald-400 font-bold">DPC & SCHEDULER</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-200 font-semibold">Banco Hot-Swap de Hardware</span>
                        <span className="text-[9px] font-mono-tech text-emerald-400 font-bold">TELEMETRÍA REAL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TALLER DE CASOS Y EXPEDIENTES */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-purple-500/40 hover:border-purple-400 transition-all shadow-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                        PERITAJE PROFESIONAL
                      </span>
                      <FolderGit2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      TALLER DE CASOS Y EXPEDIENTES
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                      Resolvé fallas y situaciones reales como un técnico profesional.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono-tech text-zinc-400">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-amber-400 font-bold block">// Evidencias</span>
                        Logs, voltajes y síntomas iniciales
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-purple-400 font-bold block">// Dictamen</span>
                        Causa raíz comprobable
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. UN SISTEMA PASO A PASO */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-amber-400/40 hover:border-amber-400 transition-all shadow-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                        METODOLOGÍA DIDÁCTICA
                      </span>
                      <Compass className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      UN SISTEMA PASO A PASO
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                      Diseñado pedagógicamente para avanzar a tu propio ritmo.
                    </p>
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-zinc-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ruta por 7 Niveles (0 al 6)</span>
                      </div>
                      <div className="text-zinc-400">
                        Desde "Conocé tu PC" hasta "Forense e Ingeniería Inversa". Conexión directa entre lectura, práctica en laboratorio y validación pericial.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg mx-auto">
                <button
                  type="button"
                  onClick={handleEnterCampusAction}
                  className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ENTRAR A LA ACADEMIA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleStartTomo01Action}
                  className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white hover:text-amber-300 border border-zinc-700 hover:border-amber-400/50 font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>COMENZAR POR EL TOMO 01</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              ESCENA 03 // EL VIAJE DE APRENDIZAJE EVO & INGRESO
             ======================================================== */}
          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="w-full flex flex-col items-center text-center space-y-6"
            >
              {/* Visual Bench */}
              <div className="w-full max-w-lg mx-auto relative p-6 rounded-2xl bg-zinc-950/80 border border-amber-400/40 shadow-2xl backdrop-blur-md overflow-hidden">
                <div className="absolute top-2 right-3 font-mono-tech text-[10px] text-amber-400 font-bold">
                  SISTEMA_PEDAGÓGICO: ACTIVO
                </div>
                <EvoOpenPcWorkstationSvg className="max-w-xs mx-auto drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]" />
              </div>

              {/* Headline */}
              <div className="space-y-2 max-w-xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                  TU VIAJE COMIENZA AHORA
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                  Podés explorar el Campus principal según tu propia curiosidad o iniciar la lectura interactiva del primer tomo formativo.
                </p>
              </div>

              {/* The 2 Primary Entrance Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto pt-2">
                <button
                  type="button"
                  id="evo-btn-enter-academy"
                  onClick={handleEnterCampusAction}
                  className="w-full sm:w-auto flex-1 py-4 px-8 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-display font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>ENTRAR A LA ACADEMIA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="evo-btn-start-tomo01"
                  onClick={handleStartTomo01Action}
                  className="w-full sm:w-auto flex-1 py-4 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 font-display font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>COMENZAR POR EL TOMO 01</span>
                </button>
              </div>

              {/* Subtle Remember Setting */}
              <div className="pt-2 flex items-center justify-center gap-2">
                <label className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400 hover:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberPreference}
                    onChange={(e) => setRememberPreference(e.target.checked)}
                    className="w-3.5 h-3.5 accent-amber-400 rounded bg-zinc-900 border-zinc-700 cursor-pointer"
                  />
                  <span>Recordar mi elección y no mostrar esta intro al iniciar</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Technical Status Bar */}
      <footer className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-10 py-3.5 border-t border-zinc-900/90 bg-[#07090f]/85 backdrop-blur-xl text-xs font-mono-tech text-zinc-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-bold">ACADEMIA EVO LABS // V1.0</span>
          <span className="text-zinc-700">//</span>
          <span className="text-amber-400/90 font-medium">TELEMETRÍA LOCAL 100% PRIVADA</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSkipAndRememberAction}
            className="text-[11px] text-zinc-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Saltar intro y recordar mi elección</span>
          </button>

          {currentScene < 3 ? (
            <button
              onClick={() => setCurrentScene((prev) => prev + 1)}
              className="flex items-center gap-1 text-zinc-300 hover:text-amber-400 font-bold transition-colors cursor-pointer"
            >
              <span>SIGUIENTE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleEnterCampusAction}
              className="flex items-center gap-1 text-amber-400 font-bold hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span>IR AL CAMPUS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
