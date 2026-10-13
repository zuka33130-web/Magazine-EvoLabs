import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Zap,
  FolderGit2,
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Sparkles,
  Shield,
  Activity,
  BookmarkCheck,
  Check,
  Search,
  Wrench,
  FileText,
  Monitor,
  CheckCircle,
  Gauge,
  X,
} from 'lucide-react';
import { EvoMundoWordmark } from '../common/EvoMundoWordmark';

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

  // 4 Scenes with deliberate pedagogical duration
  const sceneDurations = [4000, 4500, 5000, 20000];

  const handleEnterCampusAction = useCallback(() => {
    try {
      localStorage.setItem('evo_academia_intro_dismissed', 'true');
    } catch {}
    if (onEnterCampus) onEnterCampus();
    else if (onComplete) onComplete();
  }, [onEnterCampus, onComplete]);

  const handleStartTomo01Action = useCallback(() => {
    try {
      localStorage.setItem('evo_academia_intro_dismissed', 'true');
    } catch {}
    if (onStartTomo01) onStartTomo01();
    else if (onEnterCampus) onEnterCampus();
  }, [onStartTomo01, onEnterCampus]);

  const handleSkipAction = useCallback(() => {
    try {
      localStorage.setItem('evo_academia_intro_dismissed', 'true');
    } catch {}
    if (onSkipAndRemember) onSkipAndRemember();
    else if (onSkip) onSkip();
    else if (onEnterCampus) onEnterCampus();
    else if (onComplete) onComplete();
  }, [onSkipAndRemember, onSkip, onEnterCampus, onComplete]);

  // Auto progression
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      if (currentScene < 4) {
        setCurrentScene((prev) => prev + 1);
      }
    }, sceneDurations[currentScene - 1]);
    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  // Keyboard navigation absorbed from Institutional Intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentScene < 4) {
          e.preventDefault();
          setCurrentScene((prev) => prev + 1);
        } else {
          handleEnterCampusAction();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentScene > 1) {
          e.preventDefault();
          setCurrentScene((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleSkipAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScene, handleEnterCampusAction, handleSkipAction]);

  const sceneTitles = [
    'QUÉ ES EVO',
    'CÓMO EVOLUCIONÁS',
    'QUÉ EXISTE DENTRO',
    'ENTRAR',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#06080d] text-[#f4f4f5] flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none font-sans">
      {/* Silicon grid patterns in background */}
      <div className="fixed inset-0 bg-tech-grid opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(251,191,36,0.06),transparent_50%)] pointer-events-none" />

      {/* Top Header Navigation controls */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-zinc-900/90 bg-[#06080d]/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm tracking-tight text-white uppercase">
                EVO LABS
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-mono-tech font-bold uppercase">
                OFICIAL
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono-tech tracking-wider uppercase">
              SISTEMA DE APRENDIZAJE TECNOLÓGICO
            </div>
          </div>
        </div>

        {/* Scene Steps Indicators (1 to 4) */}
        <div className="hidden md:flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => {
            const isActive = currentScene === step;
            const isCompleted = currentScene > step;
            return (
              <button
                key={step}
                type="button"
                onClick={() => {
                  setCurrentScene(step);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono-tech text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400/15 border-amber-400/50 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : isCompleted
                    ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <span className="text-[10px] font-bold opacity-60">0{step}</span>
                <span className="text-[11px] font-bold uppercase">{sceneTitles[step - 1]}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls: Pause/Play + OMITIR INTRO */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title={isPlaying ? 'Pausar avance automático' : 'Reanudar avance automático'}
            aria-label={isPlaying ? 'Pausar avance' : 'Reanudar avance'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={handleSkipAction}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-amber-400/50 text-zinc-300 hover:text-white text-xs font-mono-tech font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>OMITIR INTRO</span>
            <X className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-6 sm:p-8 lg:p-10 max-w-5xl mx-auto w-full my-auto space-y-6">
        <AnimatePresence mode="wait">
          {/* ========================================================
              SCENE 01: QUÉ ES EVO
             ======================================================== */}
          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center space-y-6 max-w-2xl mx-auto py-6"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-mono-tech font-black tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 uppercase inline-block">
                  SISTEMA DE APRENDIZAJE TECNOLÓGICO
                </span>

                <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white uppercase leading-none">
                  BIENVENIDO A<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">
                    EVO LABS
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed font-sans-editorial">
                  Una plataforma profesional para aprender, practicar, medir, diagnosticar y comprobar cómo funciona una PC y su sistema operativo.
                </p>
              </div>

              {/* LEMA: "NO LO CREAS. COMPROBALO." */}
              <div className="pt-4 border-t border-zinc-900 max-w-xs mx-auto">
                <blockquote className="text-xs font-mono-tech font-black tracking-widest text-amber-300 uppercase">
                  &gt; NO LO CREAS. COMPROBALO.
                </blockquote>
              </div>

              {/* Visual silicon copper trace */}
              <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 mx-auto rounded-full opacity-60 animate-pulse mt-4" />
            </motion.div>
          )}

          {/* ========================================================
              SCENE 02: CÓMO EVOLUCIONÁS
             ======================================================== */}
          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-8 max-w-3xl mx-auto py-4"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono-tech font-black text-cyan-400 tracking-wider uppercase block">
                  METODOLOGÍA DE FORMACIÓN PERICIAL
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                  CÓMO EVOLUCIONÁS EN EVO LABS
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-sans-editorial">
                  De novato a perito informático. Cada concepto se respalda con telemetría real y comprobación empírica, sin mitos ni atajos.
                </p>
              </div>

              {/* 5 Pasos Metodológicos */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 sm:gap-3 text-center font-mono-tech text-[10px] sm:text-xs">
                {/* 1. ENTENDER */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 mx-auto">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white uppercase">1. ENTENDER</div>
                  <p className="text-[10px] text-zinc-400 font-sans leading-tight">Fundamentos y arquitectura de silicio.</p>
                </div>

                {/* 2. OBSERVAR */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 hover:border-cyan-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mx-auto">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white uppercase">2. OBSERVAR</div>
                  <p className="text-[10px] text-zinc-400 font-sans leading-tight">Esquemáticos y flujo de señales reales.</p>
                </div>

                {/* 3. LABORATORIOS */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 hover:border-emerald-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white uppercase">3. LABORATORIOS</div>
                  <p className="text-[10px] text-zinc-400 font-sans leading-tight">Laboratorios guiados y bancos de prueba.</p>
                </div>

                {/* 4. DIAGNOSTICAR */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 hover:border-purple-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/40 flex items-center justify-center text-purple-400 mx-auto">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white uppercase">4. DIAGNOSTICAR</div>
                  <p className="text-[10px] text-zinc-400 font-sans leading-tight">Descarte forense de hipótesis erróneas.</p>
                </div>

                {/* 5. COMPROBAR */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 hover:border-teal-400/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-teal-400/10 border border-teal-400/40 flex items-center justify-center text-teal-400 mx-auto">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-white uppercase">5. COMPROBAR</div>
                  <p className="text-[10px] text-zinc-400 font-sans leading-tight">Evidencia con procedencia comprobada.</p>
                </div>
              </div>

              {/* Editorial Clarification Note */}
              <div className="pt-2 text-center">
                <span className="text-[10px] font-mono-tech text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Estos 5 pilares resumen el EVO METHOD completo de 9 etapas de investigación.</span>
                </span>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 03: QUÉ EXISTE DENTRO
             ======================================================== */}
          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6 max-w-4xl mx-auto py-2"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono-tech font-black text-amber-400 tracking-wider uppercase block">
                  ARQUITECTURA DEL SISTEMA
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
                  LOS 5 UNIVERSOS EVO
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-sans-editorial">
                  Todo lo que necesitás para dominar el hardware y el sistema operativo en una única consola técnica.
                </p>
              </div>

              {/* The 5 Universos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left font-sans-editorial text-xs">
                {/* 1. TOMOS */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-2 hover:border-amber-400/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-mono-tech font-bold text-xs text-white">TOMOS</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-snug">
                    Colección canónica de 12 Tomos, Tutor EVO y recorrido didáctico estructurado.
                  </p>
                </div>

                {/* 2. LABORATORIOS */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-2 hover:border-emerald-400/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono-tech font-bold text-xs text-white">LABORATORIOS</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-snug">
                    Suite de laboratorios interactivos guiados, bancos de medición y simuladores.
                  </p>
                </div>

                {/* 3. ANALIZAR MI PC */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-2 hover:border-purple-400/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-mono-tech font-bold text-xs text-white">ANALIZAR MI PC</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-snug">
                    Estación pericial de diagnóstico, consola de incidentes y banco de casos forenses.
                  </p>
                </div>

                {/* 4. HERRAMIENTAS */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-2 hover:border-cyan-400/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-mono-tech font-bold text-xs text-white">HERRAMIENTAS</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-snug">
                    Instrumental técnico independiente para hardware, Windows y rendimiento.
                  </p>
                </div>

                {/* 5. MI EVO */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-850 space-y-2 hover:border-indigo-400/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-mono-tech font-bold text-xs text-white">MI EVO</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-snug">
                    Pasaporte pericial personal, historial de casos forenses y acreditaciones.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              SCENE 04: ENTRAR
             ======================================================== */}
          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-6 max-w-2xl mx-auto py-4 text-center flex flex-col items-center"
            >
              <div className="space-y-3 flex flex-col items-center">
                <EvoMundoWordmark variant="hero" showUniverseBadge={true} className="items-center text-center" />
                <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial max-w-lg">
                  Tu consola central de operaciones técnicas en EVO LABS está lista. Elegí por dónde comenzar tu evolución.
                </p>
              </div>

              {/* Single Dominant Action + Max 1 secondary */}
              <div className="w-full max-w-md space-y-3 pt-2">
                {/* 1. Dominant CTA */}
                <button
                  type="button"
                  onClick={handleEnterCampusAction}
                  className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-black font-mono-tech font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(251,191,36,0.35)] flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>INGRESAR A EVO LABS →</span>
                </button>

                {/* 2. Secondary CTA */}
                <button
                  type="button"
                  onClick={handleStartTomo01Action}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono-tech text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>COMENZAR TOMO 01 · CONOCÉ TU PC</span>
                </button>
              </div>

              {/* Preference toggle */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 text-xs font-mono-tech text-zinc-400 hover:text-zinc-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberPreference}
                    onChange={(e) => setRememberPreference(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-amber-400 focus:ring-amber-400/40"
                  />
                  <span>Recordar mi elección y no volver a mostrar la intro</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Technical Status Bar */}
      <footer className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-3.5 border-t border-zinc-900/90 bg-[#06080d]/90 backdrop-blur-xl text-xs font-mono-tech text-zinc-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-bold">EVO LABS</span>
          <span className="text-zinc-700">//</span>
          <span className="text-amber-400/90 font-medium hidden sm:inline">TELEMETRÍA 100% NATIVA DE LABORATORIO</span>
        </div>

        {/* Scene navigation & indicators */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-zinc-400">
            Escena {currentScene} de 4
          </span>

          <div className="flex items-center gap-2">
            {currentScene > 1 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentScene((prev) => prev - 1);
                  setIsPlaying(false);
                }}
                className="flex items-center gap-1 text-zinc-400 hover:text-white font-bold transition-colors cursor-pointer px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>ANTERIOR</span>
              </button>
            )}

            {currentScene < 4 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentScene((prev) => prev + 1);
                  setIsPlaying(false);
                }}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer px-3 py-1 rounded bg-amber-400/10 border border-amber-400/30"
              >
                <span>SIGUIENTE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnterCampusAction}
                className="flex items-center gap-1 text-black bg-amber-400 hover:bg-amber-300 font-bold transition-colors cursor-pointer px-3.5 py-1 rounded shadow-sm"
              >
                <span>ENTRAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
