/**
 * LEGACY / INACTIVO: Modal de perfil narrativo conservado como referencia histórica.
 * La única intro operativa activa del sistema es EvoIntroExperience.tsx.
 */
import React, { useState } from 'react';
import {
  EVO_IDENTITY,
  EVO_INTRO_QUIZ_SCENARIO,
  EVO_NARRATIVE_PROFILES,
} from '../../data/evoWorldData';
import { EvoNarrativeProfile } from '../../types';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Compass,
  Wrench,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

interface EvoIntroModalProps {
  isOpen: boolean;
  onClose: (chosenProfile: EvoNarrativeProfile) => void;
  initialProfile?: EvoNarrativeProfile;
}

export const EvoIntroModal: React.FC<EvoIntroModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
}) => {
  const [step, setStep] = useState<'manifesto' | 'situation' | 'profile'>(
    initialProfile ? 'profile' : 'manifesto'
  );
  const [selectedProfile, setSelectedProfile] = useState<EvoNarrativeProfile>(
    initialProfile || 'investigador'
  );

  if (!isOpen) return null;

  const profileData = EVO_NARRATIVE_PROFILES[selectedProfile];

  const getProfileIcon = (id: EvoNarrativeProfile) => {
    switch (id) {
      case 'investigador':
        return <Search className="w-6 h-6 text-yellow-400" />;
      case 'constructor':
        return <Wrench className="w-6 h-6 text-amber-400" />;
      case 'explorador':
        return <Compass className="w-6 h-6 text-cyan-400" />;
      case 'tecnico':
        return <SlidersHorizontal className="w-6 h-6 text-emerald-400" />;
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem('evo_narrative_profile', selectedProfile);
      localStorage.setItem('evo_intro_seen', 'true');
    } catch {
      // ignore
    }
    onClose(selectedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-[#0d0e13] border-2 border-yellow-400/80 rounded-2xl shadow-[0_0_80px_rgba(250,204,21,0.18)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Strip */}
        <div className="bg-[#14161f] border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-yellow-400 inline-block shadow-[0_0_12px_#facc15]" />
            <span className="font-display font-black text-xl text-white tracking-wider uppercase">
              {EVO_IDENTITY.title}
            </span>
            <span className="text-zinc-600 text-xs font-mono-tech">•</span>
            <span className="text-yellow-400 font-mono-tech text-xs tracking-wider uppercase font-semibold">
              EVO LABS // INGRESO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-xs font-mono-tech uppercase">
              Paso {step === 'manifesto' ? '1/3' : step === 'situation' ? '2/3' : '3/3'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: MANIFIESTO */}
          {step === 'manifesto' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono-tech uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primer Contacto // 45 Segundos</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  Esto no es una clase. <br />
                  <span className="text-yellow-400 underline decoration-yellow-400/40 decoration-4">
                    Es un laboratorio.
                  </span>
                </h1>
                <p className="text-zinc-300 font-sans-editorial text-base sm:text-lg leading-relaxed max-w-2xl">
                  Acá no venís a memorizar diagramas de silicio ni a repetir frases hechas de
                  internet. Tu propia computadora es el sujeto de estudio, el banco de pruebas y la
                  fuente de datos.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#13151e] border-l-4 border-yellow-400 border-y border-r border-zinc-800 space-y-2">
                <span className="text-xs font-mono-tech font-bold uppercase text-yellow-400 tracking-wider block">
                  Regla Fundamental EVO LABS
                </span>
                <p className="font-display font-bold text-xl sm:text-2xl text-white italic tracking-tight">
                  “{EVO_IDENTITY.identityPhrase}”
                </p>
                <p className="text-zinc-400 text-xs font-sans-editorial">
                  Si tocaste tres cosas juntas, no sabés cuál funcionó. Si no mediste antes y
                  después, fue un acto de fe, no de ingeniería.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep('situation')}
                  className="px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-display font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Continuar a la situación de prueba</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MINI SITUACIÓN DIVERTIDA */}
          {step === 'situation' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono-tech uppercase">
                <Cpu className="w-3.5 h-3.5 text-yellow-400" />
                <span>Calibración de Operador // Reacción Instintiva</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-bold text-2xl text-white">
                  Mini Situación: La Anomalía Inesperada
                </h2>
                <p className="text-zinc-300 font-sans-editorial text-sm sm:text-base leading-relaxed bg-[#14161f] p-4 rounded-xl border border-zinc-800">
                  {EVO_INTRO_QUIZ_SCENARIO.question}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono-tech text-zinc-400 uppercase tracking-wider block">
                  Elegí tu respuesta espontánea (no hay respuesta incorrecta):
                </span>

                <div className="grid grid-cols-1 gap-3">
                  {EVO_INTRO_QUIZ_SCENARIO.options.map((opt) => {
                    const isSelected = selectedProfile === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedProfile(opt.id)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                          isSelected
                            ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-[0_0_20px_rgba(250,204,21,0.15)]'
                            : 'bg-[#11131a] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-[#151722]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-yellow-400 bg-yellow-400 text-black'
                              : 'border-zinc-600 bg-zinc-900'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1 flex-1">
                          <p className="font-sans-editorial text-sm text-white font-medium leading-snug">
                            {opt.label}
                          </p>
                          <span className="text-xs font-mono-tech text-zinc-400 block">
                            {opt.hint}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('manifesto')}
                  className="text-xs font-mono-tech text-zinc-400 hover:text-white uppercase transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Volver</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="px-6 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-display font-bold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Descubrir mi Perfil</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PERFIL NARRATIVO */}
          {step === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-mono-tech uppercase font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Perfil Inicial Asignado</span>
                </div>
                <span className="text-xs font-mono-tech text-zinc-400">
                  Totalmente reversible luego desde Mi Laboratorio
                </span>
              </div>

              {/* Profile Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#161824] to-[#101119] border-2 border-yellow-400/60 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black border border-yellow-400/40 flex items-center justify-center shrink-0 shadow-inner">
                      {getProfileIcon(profileData.id)}
                    </div>
                    <div>
                      <span className="text-[11px] font-mono-tech text-yellow-400 uppercase tracking-widest block font-bold">
                        {profileData.badge}
                      </span>
                      <h3 className="font-display font-black text-2xl text-white tracking-tight">
                        {profileData.title}
                      </h3>
                      <p className="text-xs font-mono-tech text-zinc-400">{profileData.tagline}</p>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-200 font-sans-editorial text-sm sm:text-base leading-relaxed">
                  {profileData.description}
                </p>

                <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
                  <div className="bg-black/40 p-3 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block mb-1 uppercase text-[10px]">
                      Estilo de Operación
                    </span>
                    <span className="text-zinc-200 font-sans-editorial leading-snug block">
                      {profileData.workstyle}
                    </span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-zinc-800">
                    <span className="text-zinc-400 block mb-1 uppercase text-[10px]">
                      Lema de Trabajo
                    </span>
                    <span className="text-yellow-400 font-sans-editorial italic leading-snug block">
                      “{profileData.motto}”
                    </span>
                  </div>
                </div>
              </div>

              {/* Reversibility notice */}
              <p className="text-xs text-zinc-400 font-sans-editorial text-center leading-relaxed">
                Este perfil define tu tono y punto de partida narrativo. No te restringe ningún
                acceso: podés cambiarlo cuando quieras desde la Zona 7 (Mi Laboratorio).
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('situation')}
                  className="text-xs font-mono-tech text-zinc-400 hover:text-white uppercase transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Probar otra opción</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-7 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-display font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                >
                  <span>INGRESAR AL MAPA DEL LABORATORIO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
