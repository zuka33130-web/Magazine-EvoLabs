import React from 'react';
import { EvoEvolutionTraceNode } from '../../services/evoEvidenceEngine';
import { CheckCircle2, Circle } from 'lucide-react';

interface EvoEvolutionTraceProps {
  nodes: EvoEvolutionTraceNode[];
  className?: string;
}

export const EvoEvolutionTrace: React.FC<EvoEvolutionTraceProps> = ({ nodes, className = '' }) => {
  return (
    <div className={`p-4 rounded-2xl bg-[#080b12] border border-zinc-800 space-y-3 font-mono-tech select-none ${className}`}>
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          EVOLUTION TRACE // FIRMA DE PROGRESO PERICIAL
        </span>
        <span className="text-[9px] text-zinc-500">TRAZABILIDAD EN TIEMPO REAL</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative pt-1">
        {nodes.map((node, index) => {
          return (
            <div
              key={node.id}
              className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all duration-300 relative ${
                node.isUnlocked
                  ? 'bg-zinc-900/90 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                  : 'bg-zinc-950/40 border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    node.isUnlocked ? 'text-amber-300' : 'text-zinc-500'
                  }`}
                >
                  {node.title}
                </span>
                {node.isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                )}
              </div>

              <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                {node.description}
              </p>

              <div className="pt-1 border-t border-zinc-900/80 flex items-center justify-between text-[9px]">
                <span className="text-zinc-500 uppercase">ESTADO:</span>
                <span
                  className={`font-bold uppercase ${
                    node.isUnlocked ? 'text-emerald-400' : 'text-zinc-600'
                  }`}
                >
                  {node.isUnlocked ? 'ACTIVO' : 'BLOQUEADO'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
