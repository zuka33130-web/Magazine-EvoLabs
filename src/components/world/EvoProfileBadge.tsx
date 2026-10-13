import React, { useState } from 'react';
import { EvoNarrativeProfile, EvoProfileDetail } from '../../types';
import { EVO_NARRATIVE_PROFILES } from '../../data/evoWorldData';
import { UserCheck, Shield, ChevronDown, Sparkles } from 'lucide-react';

interface EvoProfileBadgeProps {
  currentProfile: EvoNarrativeProfile;
  onProfileChange: (newProfile: EvoNarrativeProfile) => void;
}

export const EvoProfileBadge: React.FC<EvoProfileBadgeProps> = ({
  currentProfile,
  onProfileChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const profile: EvoProfileDetail = EVO_NARRATIVE_PROFILES[currentProfile] || EVO_NARRATIVE_PROFILES.investigador;

  return (
    <div className="relative select-none font-mono-tech">
      {/* Discrete Top Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded border border-zinc-800 hover:border-amber-400/50 bg-zinc-900/90 text-left transition-all cursor-pointer group"
      >
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <div className="flex flex-col">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none">
            PERFIL INICIAL:
          </div>
          <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>{profile.title.toUpperCase()}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Discrete Dropdown Panel with explanation */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 p-4 rounded-xl border border-zinc-700 bg-zinc-950/95 backdrop-blur-md shadow-2xl z-50">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-amber-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {profile.badge}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">OPERADOR EVO</span>
          </div>

          <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed mb-3">
            {profile.description}
          </p>

          <div className="p-2.5 rounded bg-zinc-900/90 border border-zinc-800 mb-3">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>EVOLUCIÓN DE PERFIL</span>
            </div>
            <p className="font-sans-editorial text-[11px] text-zinc-400 italic">
              "Esto puede cambiar a medida que descubramos cómo trabajás en el laboratorio."
            </p>
          </div>

          {/* Calibrate alternative profiles */}
          <div className="space-y-1 pt-1">
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1">
              Alternar estilo operativo:
            </div>
            {(Object.keys(EVO_NARRATIVE_PROFILES) as EvoNarrativeProfile[]).map((pKey) => {
              const p = EVO_NARRATIVE_PROFILES[pKey];
              const isSelected = pKey === currentProfile;
              return (
                <button
                  key={pKey}
                  onClick={() => {
                    onProfileChange(pKey);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <span>{p.title}</span>
                  {isSelected && <UserCheck className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
