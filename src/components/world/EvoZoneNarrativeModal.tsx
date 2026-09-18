import React from 'react';
import { EvoLabZone, EvoNarrativeProfile } from '../../types';
import { EVO_NARRATIVE_PROFILES } from '../../data/evoWorldData';
import {
  X,
  BookOpen,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  Terminal,
  Clock,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface EvoZoneNarrativeModalProps {
  zone: EvoLabZone | null;
  onClose: () => void;
  onExploreTomo01: () => void;
  activeProfile: EvoNarrativeProfile;
  onChangeProfile: (profile: EvoNarrativeProfile) => void;
  onReopenIntro?: () => void;
}

export const EvoZoneNarrativeModal: React.FC<EvoZoneNarrativeModalProps> = ({
  zone,
  onClose,
  onExploreTomo01,
  activeProfile,
  onChangeProfile,
  onReopenIntro,
}) => {
  if (!zone) return null;

  const isArchivoEvo = zone.id === 'zona-3';
  const isMiLaboratorio = zone.id === 'zona-7';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e1017] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#151722] border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 font-mono-tech text-xs font-bold uppercase">
              ZONA {zone.number}
            </span>
            <span className="font-mono-tech text-xs text-zinc-400 uppercase tracking-wider">
              {zone.statusBadge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Main Title and Subtitle */}
          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              {zone.title}
            </h2>
            <p className="font-mono-tech text-yellow-400 text-sm font-semibold tracking-wide uppercase">
              “{zone.subtitle}”
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-zinc-300 font-sans-editorial text-sm sm:text-base leading-relaxed">
            {zone.description}
          </div>

          {/* Deep Narrative Context */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-yellow-400" />
              <span>Bitácora y Contexto de Ingeniería</span>
            </div>
            <p className="text-zinc-300 font-sans-editorial text-sm leading-relaxed bg-[#12141d] p-4 rounded-xl border border-zinc-800/80">
              {zone.narrativeDetail}
            </p>
          </div>

          {/* Special view for Zona 3 (Archivo EVO) */}
          {isArchivoEvo && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-yellow-400/10 to-transparent border-2 border-yellow-400/70 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono-tech text-yellow-400 font-bold tracking-wider uppercase block">
                    Publicación Disponible
                  </span>
                  <h4 className="font-display font-bold text-lg text-white">
                    Tomo 01 // Arquitectura, Métricas y Diagnóstico Real
                  </h4>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                Dentro del Archivo EVO podés explorar los 7 capítulos completos con tu propia PC:
                Pasaporte de Hardware, Flujo de Recursos, Perfil de Fluidez, Matriz de Limitación,
                Mapa de Actividad de Windows, Taller de Diagnóstico y Experimento A/B de Cierre.
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreTomo01();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-display font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(250,204,21,0.25)] cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>QUIERO EXPLORAR TOMO 01</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Special view for Zona 7 (Mi Laboratorio - Perfil y Reversibilidad) */}
          {isMiLaboratorio && (
            <div className="space-y-4 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 uppercase font-bold">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Tu Perfil Narrativo Activo</span>
                </div>
                {onReopenIntro && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onReopenIntro();
                    }}
                    className="text-[11px] font-mono-tech text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Repetir intro completa
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(EVO_NARRATIVE_PROFILES) as EvoNarrativeProfile[]).map((profKey) => {
                  const p = EVO_NARRATIVE_PROFILES[profKey];
                  const isCurrent = activeProfile === profKey;
                  return (
                    <button
                      key={profKey}
                      type="button"
                      onClick={() => onChangeProfile(profKey)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-yellow-400/10 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                          : 'bg-[#12141c] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'bg-yellow-400 border-yellow-400 text-black'
                            : 'border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        {isCurrent && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="font-display font-bold text-xs text-white uppercase">
                          {p.title}
                        </div>
                        <div className="text-[10px] font-mono-tech text-zinc-400 truncate max-w-[180px]">
                          {p.badge}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Features Checklist (con narrativa) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Desarrollos en Progreso para esta Zona</span>
            </div>

            <ul className="space-y-2 font-sans-editorial text-xs text-zinc-300">
              {zone.upcomingFeatures.map((feat, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-black/30 border border-zinc-800/80 flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/80 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#12141d] border-t border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-zinc-400">
            <Radio className="w-3 h-3 text-yellow-400 animate-pulse" />
            <span>EVO LABS // SECTOR {zone.number}</span>
          </div>

          <div className="flex items-center gap-3">
            {isArchivoEvo ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreTomo01();
                }}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-display font-bold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>QUIERO EXPLORAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono-tech text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                Entendido // Volver al Mapa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
