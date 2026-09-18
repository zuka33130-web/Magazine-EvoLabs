import React from 'react';
import { EvoProfileBadge } from './EvoProfileBadge';
import { EvoNarrativeProfile } from '../../types';
import { Map, FolderKanban, Library, RotateCcw } from 'lucide-react';

interface EvoWorldNavigationProps {
  activeTab: 'mapa' | 'archivo' | 'milaboratorio';
  onTabChange: (tab: 'mapa' | 'archivo' | 'milaboratorio') => void;
  onReplayIntro: () => void;
  currentProfile: EvoNarrativeProfile;
  onProfileChange: (profile: EvoNarrativeProfile) => void;
}

export const EvoWorldNavigation: React.FC<EvoWorldNavigationProps> = ({
  activeTab,
  onTabChange,
  onReplayIntro,
  currentProfile,
  onProfileChange,
}) => {
  return (
    <nav className="relative z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-4 sm:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Active Facility Tag */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onTabChange('mapa')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-display font-black text-amber-400 group-hover:border-amber-400 transition-colors">
              EVO
            </div>
            <div>
              <div className="font-display font-black text-sm tracking-tight text-white group-hover:text-amber-300 transition-colors uppercase">
                EVO LABS
              </div>
              <div className="font-mono-tech text-[9px] tracking-widest text-amber-400 uppercase font-semibold">
                MUNDO EVO V1 // PLANTA GENERAL
              </div>
            </div>
          </button>
        </div>

        {/* Center: Discrete Lab Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-lg border border-zinc-800 bg-zinc-900/60 font-mono-tech text-xs">
          <button
            onClick={() => onTabChange('mapa')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'mapa'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>MAPA DEL MUNDO</span>
          </button>

          <button
            onClick={() => onTabChange('archivo')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'archivo'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>ARCHIVO EVO</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-amber-400">ACTIVO</span>
          </button>

          <button
            onClick={() => onTabChange('milaboratorio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'milaboratorio'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>MI LABORATORIO</span>
          </button>
        </div>

        {/* Right: Discrete Profile Badge & Replay Intro Action */}
        <div className="flex items-center gap-3">
          <EvoProfileBadge
            currentProfile={currentProfile}
            onProfileChange={onProfileChange}
          />

          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-xs font-mono-tech text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
            title="Repetir la presentación cinemática inicial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REPETIR INTRO</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
