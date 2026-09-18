import React from 'react';
import { EvoNarrativeProfile } from '../types';
import { EVO_NARRATIVE_PROFILES } from '../data/evoWorldData';
import { Map, Library, BookOpen, RotateCcw, Compass } from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onNavigateHome?: () => void;
  onNavigateArchive?: () => void;
  onNavigateTomo01?: () => void;
  onNavigateMagazine?: () => void;
  activeProfile?: EvoNarrativeProfile;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onNavigateArchive,
  onNavigateTomo01,
  onNavigateMagazine,
  activeProfile = 'investigador',
  onReplayIntro,
}) => {
  const isHomeMap = currentView === 'world-map';
  const isArchive = currentView === 'archivo';
  const isTome = currentView !== 'world-map' && currentView !== 'archivo' && currentView !== 'magazine';
  const isMagazine = currentView === 'magazine';
  const profileData = EVO_NARRATIVE_PROFILES[activeProfile] || EVO_NARRATIVE_PROFILES.investigador;

  return (
    <header className="border-b border-zinc-800/80 bg-[#090a0e]/95 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Masthead: EVO LABS + Identity phrase */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
          title="Volver al Mapa del Laboratorio"
        >
          <span className="w-3 h-3 bg-amber-400 rounded-none inline-block shadow-[0_0_12px_#facc15] group-hover:scale-110 transition-transform" />
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
              EVO LABS
            </span>
            <span className="text-[11px] font-mono-tech text-amber-400 font-semibold tracking-wide hidden sm:block">
              “Hacemos milagros, pero los medimos.”
            </span>
          </div>
        </div>

        {/* Center/Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono-tech text-xs">
          {/* Navigation Pill between World Map, Archive and Tomo */}
          <div className="flex items-center bg-[#13151f] p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={onNavigateHome}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isHomeMap
                  ? 'bg-amber-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MUNDO EVO</span>
              <span className="sm:hidden">MAPA</span>
            </button>

            <button
              type="button"
              onClick={onNavigateArchive}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                isArchive
                  ? 'bg-amber-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ARCHIVO EVO</span>
              <span className="sm:hidden">ARCHIVO</span>
            </button>

            {isTome && (
              <button
                type="button"
                onClick={onNavigateTomo01}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-amber-400 border border-amber-400/40 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>TOMO 01</span>
              </button>
            )}

            {onNavigateMagazine && (
              <button
                type="button"
                onClick={onNavigateMagazine}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isMagazine
                    ? 'bg-yellow-400 text-black font-bold shadow'
                    : 'bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-semibold'
                }`}
                title="Abrir edición digital impresa A4 de EVO LABS MAGAZINE"
              >
                <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
                <span className="hidden sm:inline">REVISTA A4</span>
                <span className="sm:hidden">REVISTA</span>
              </button>
            )}
          </div>

          {/* Active Profile Pill (Discreet) */}
          <div
            title="Perfil de Operador Narrativo Activo"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-zinc-500 uppercase leading-none">PERFIL INICIAL</span>
              <span className="font-bold text-white text-[10px] uppercase tracking-wider">
                {profileData.title}
              </span>
            </div>
          </div>

          {/* Replay Intro Button */}
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              title="Volver a ver la presentación cinemática inicial"
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

