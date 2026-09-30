import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  BookOpen,
  Wrench,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Activity,
  ShieldCheck,
  Terminal,
  ChevronRight,
} from 'lucide-react';

interface EvoInstitutionalIntroProps {
  onEnterApp: () => void;
  onSkip: () => void;
}

export const EvoInstitutionalIntro: React.FC<EvoInstitutionalIntroProps> = ({
  onEnterApp,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 8;

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          onEnterApp();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        onSkip();
      }
    },
    [currentStep, totalSteps, onEnterApp, onSkip]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onEnterApp();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#05070c] text-white flex flex-col justify-between overflow-hidden select-none font-mono-tech">
      
      {/* Background ambient grid and glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(rgba(245, 158, 11, 0.12) 1px, transparent 1px), radial-gradient(rgba(14, 165, 233, 0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px, 20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      {/* TOP HEADER: BRANDING & SKIP BUTTON */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4 sm:py-5 border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                ACADEMIA EVO LABS
              </span>
              <span className="text-[9px] px-1 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 hidden sm:inline-block">
                OFICIAL
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 tracking-wider">
              SISTEMA DE APRENDIZAJE TECNOLÓGICO
            </div>
          </div>
        </div>

        {/* Action: OMITIR INTRO (SIEMPRE VISIBLE) */}
        <button
          type="button"
          onClick={onSkip}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-amber-400/50 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>OMITIR INTRO</span>
          <X className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </header>

      {/* CENTER STAGE: SCENES 0 TO 7 */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 flex flex-col justify-center items-center">
        
        {/* ========================================================================= */}
        {/* SCENE 0: BIENVENIDA A LA ACADEMIA                                         */}
        {/* ========================================================================= */}
        {currentStep === 0 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SISTEMA DE APRENDIZAJE TECNOLÓGICO</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase leading-tight">
              BIENVENIDO A LA <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                ACADEMIA EVO LABS
              </span>
            </h1>

            <div className="p-4 sm:p-6 rounded-2xl bg-[#090d16]/90 border border-white/[0.1] max-w-2xl mx-auto text-left space-y-4 shadow-2xl">
              <p className="text-sm sm:text-base text-zinc-200 font-sans-editorial leading-relaxed">
                “No importa si estás dando tus primeros pasos en informática o si ya trabajás profesionalmente con computadoras.
                <br />
                <strong className="text-white font-semibold">EVO LABS fue creado para acompañarte durante todo el recorrido.</strong>”
              </p>

              <div className="pt-3 border-t border-white/[0.08]">
                <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                  “Acá no vas a encontrar solamente información. Vas a aprender a entender qué ocurre, observarlo, experimentarlo, diagnosticarlo y comprobarlo.”
                </p>
              </div>
            </div>

            <div className="text-xs font-bold text-amber-400/90 tracking-widest uppercase">
              LEMA INSTITUCIONAL: “NO LO CREAS. COMPROBALO.”
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 1: QUÉ ENCONTRÁS EN EVO LABS (10 TOMOS)                             */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>COLECCIÓN TÉCNICA</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              10 TOMOS EVO LABS
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial max-w-xl mx-auto">
              Revistas técnicas en formato Magazine creadas para llevarte desde los fundamentos hasta áreas técnicas avanzadas.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-3xl mx-auto text-left text-xs font-mono-tech pt-2">
              {[
                { n: '01', t: 'Hardware & Silicio', c: '#EAB308' },
                { n: '02', t: 'Windows NT', c: '#00D2FF' },
                { n: '03', t: 'Reparación PC', c: '#10B981' },
                { n: '04', t: 'Notebooks', c: '#A855F7' },
                { n: '05', t: 'Redes', c: '#06B6D4' },
                { n: '06', t: 'Ciberseguridad', c: '#EF4444' },
                { n: '07', t: 'Gaming Pro', c: '#F59E0B' },
                { n: '08', t: 'Arranque 35 Estados', c: '#10B981' },
                { n: '09', t: 'Sistemas & Kernel', c: '#38BDF8' },
                { n: '10', t: 'Forense & Reversing', c: '#A855F7' },
              ].map((item) => (
                <div
                  key={item.n}
                  className="p-2.5 rounded-xl bg-[#090d16]/90 border border-white/[0.08] flex flex-col justify-between gap-1 shadow-sm"
                >
                  <span className="text-[10px] font-bold" style={{ color: item.c }}>
                    TOMO {item.n}
                  </span>
                  <span className="text-zinc-200 text-[11px] font-sans-editorial leading-tight">
                    {item.t}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-400 font-sans-editorial italic">
              “Diez Tomos creados para llevarte desde los fundamentos hasta áreas técnicas avanzadas.”
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 2: NO SÓLO LEER (TOMOS + LABORATORIOS GUIADOS)                       */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRÁCTICA Y COMPROBACIÓN</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              10 TOMOS + 10 LABORATORIOS GUIADOS
            </h2>

            <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-[#090d16]/90 border border-white/[0.1] text-left space-y-4 shadow-xl">
              <p className="text-sm sm:text-base text-zinc-200 font-sans-editorial leading-relaxed">
                “Pero leer es solamente una parte del aprendizaje.
                <br />
                Cada área de formación EVO LABS está pensada para integrarse con <strong className="text-emerald-400">práctica guiada, simulación, diagnóstico y comprobación</strong>.”
              </p>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-300">TOMO 08 // LABORATORIO DE ARRANQUE Y FALLAS: </span>
                  <span className="text-zinc-300 font-sans-editorial">35 estados reales, multímetro y diagnóstico de gabinete abierto.</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-400 text-black font-bold uppercase text-[10px] shrink-0">
                  ACTIVO
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial">
                <strong className="text-zinc-300 font-mono-tech">Transparencia Técnica: </strong>
                Los laboratorios guiados complementarios continúan su fase de desarrollo pericial metrológico sin simulaciones falsas.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 3: MENSAJE PARA PRINCIPIANTES                                       */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>ACOMPAÑAMIENTO DESDE CERO</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              ¿NO SABÉS POR DÓNDE EMPEZAR?
            </h2>

            <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0c1424] to-[#070910] border border-blue-500/40 text-left space-y-4 shadow-2xl">
              <div className="text-base sm:text-lg font-bold text-blue-300 font-sans-editorial">
                “Está bien. EVO LABS puede guiarte desde cero.”
              </div>

              <p className="text-xs sm:text-sm text-zinc-200 font-sans-editorial leading-relaxed">
                “No necesitás conocer palabras técnicas antes de comenzar. Cada concepto puede ser explicado, observado y llevado a la práctica paso a paso.”
              </p>

              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                “EVO te indica qué estás aprendiendo, qué deberías observar, qué hacer después y cómo comprobarlo.”
              </p>

              <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-center text-xs font-bold text-white tracking-wider">
                NUNCA ESTÁS SOLO EN EL RECORRIDO. EVO TE GUÍA.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 4: MENSAJE PARA TÉCNICOS Y PROFESIONALES                            */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>PROFUNDIDAD TÉCNICA</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              ¿YA TENÉS EXPERIENCIA?
            </h2>

            <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#14120a] to-[#070910] border border-amber-400/40 text-left space-y-4 shadow-2xl">
              <div className="text-base sm:text-lg font-bold text-amber-300 font-sans-editorial">
                “EVO LABS también está diseñado para quienes necesitan ir más profundo.”
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono-tech pt-1">
                <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">Laboratorios Técnicos</span>
                <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">Telemetría Real</span>
                <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">Casos & Evidencia</span>
                <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200">Análisis Forense</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                “Podés seguir una ruta educativa recomendada o ir directamente al recurso técnico que necesitás sin bloqueos arbitrarios.”
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 5: MÉTODO PEDAGÓGICO UNIVERSAL                                      */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>METODOLOGÍA DE APRENDIZAJE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              EL MÉTODO EVO LABS
            </h2>

            {/* Ciclo secuencial de 7 etapas */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto py-2">
              {[
                'OBSERVAR',
                'ENTENDER',
                'MEDIR',
                'EXPERIMENTAR',
                'COMPARAR',
                'DIAGNOSTICAR',
                'COMPROBAR',
              ].map((step, idx) => (
                <React.Fragment key={step}>
                  <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-purple-400/40 text-purple-200 font-bold text-xs shadow-md">
                    {step}
                  </div>
                  {idx < 6 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:inline" />}
                </React.Fragment>
              ))}
            </div>

            <div className="max-w-lg mx-auto p-4 rounded-xl bg-[#090d16] border border-white/[0.08]">
              <p className="text-xs sm:text-sm text-zinc-200 font-sans-editorial leading-relaxed">
                “No buscamos que memorices respuestas.
                <br />
                <strong className="text-amber-300 font-semibold">Buscamos que aprendas a descubrirlas.</strong>”
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 6: MANIFIESTO EVO                                                   */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="w-full text-center space-y-5 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>FILOSOFÍA TÉCNICA</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              MANIFIESTO EVO
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl mx-auto text-left text-xs font-mono-tech">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 font-bold block">NO ADIVINAMOS.</span>
                <span className="text-white font-bold text-sm">OBSERVAMOS.</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 font-bold block">NO SUPONEMOS.</span>
                <span className="text-white font-bold text-sm">MEDIMOS.</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 font-bold block">NO CAMBIAMOS AL AZAR.</span>
                <span className="text-white font-bold text-sm">EXPERIMENTAMOS.</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="text-zinc-500 font-bold block">NO CONFUNDIMOS SÍNTOMA CON CAUSA.</span>
                <span className="text-white font-bold text-sm">DIAGNOSTICAMOS.</span>
              </div>
            </div>

            <div className="max-w-md mx-auto p-3 rounded-xl bg-amber-400/15 border border-amber-400/40 text-center">
              <span className="text-[11px] text-zinc-400 uppercase font-bold block">NO NOS QUEDAMOS CON UNA SENSACIÓN. COMPARAMOS.</span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-display tracking-wider">
                NO LO CREAS. COMPROBALO.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCENE 7: ESCENA FINAL (ENTRADA A MUNDO EVO)                                */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CAMPUS CENTRAL LISTO</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase leading-tight">
              BIENVENIDO A <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                EVO LABS
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-md mx-auto">
              “Desde tus primeros pasos hasta el trabajo técnico avanzado.
              <br />
              <strong className="text-white">EVO LABS te acompaña.</strong>”
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono-tech text-zinc-300">
              <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">APRENDER</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">PRACTICAR</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">DIAGNOSTICAR</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">COMPROBAR</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onEnterApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 mx-auto cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 duration-200"
              >
                <span>ENTRAR A MUNDO EVO</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM FOOTER: STEPPERS & NAVIGATION CONTROLS */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-4 border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-xl flex items-center justify-between gap-4">
        
        {/* Back button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            currentStep > 0
              ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700 cursor-pointer'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ANTERIOR</span>
        </button>

        {/* Stepper indicators (0 to 7) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentStep
                  ? 'w-7 sm:w-8 bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                  : idx < currentStep
                  ? 'w-2 bg-amber-400/40'
                  : 'w-2 bg-zinc-700'
              }`}
              aria-label={`Ir a pantalla ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Enter button */}
        {currentStep < totalSteps - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            <span>SIGUIENTE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnterApp}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.35)]"
          >
            <span>INGRESAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </footer>
    </div>
  );
};
