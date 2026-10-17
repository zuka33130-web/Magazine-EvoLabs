import React from 'react';
import { EvoMethodStage } from '../../services/evoMethodEngine';

interface EvoMethodBadgeProps {
  stages: EvoMethodStage[];
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const EvoMethodBadge: React.FC<EvoMethodBadgeProps> = ({
  stages,
  size = 'sm',
  onClick,
}) => {
  if (!stages || stages.length === 0) return null;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 flex-wrap font-mono ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
      title="Etapas del EVO METHOD aplicadas en esta experiencia"
    >
      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
        MÉTODO:
      </span>
      {stages.map((st, idx) => (
        <span
          key={st}
          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border transition-all flex items-center gap-1 ${
            st === 'TRANSFERIR'
              ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
              : st === 'MEDIR' || st === 'COMPROBAR'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : st === 'OBSERVAR' || st === 'ENTENDER'
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
          }`}
        >
          {st}
          {idx < stages.length - 1 && <span className="text-zinc-600 font-normal">→</span>}
        </span>
      ))}
    </div>
  );
};
