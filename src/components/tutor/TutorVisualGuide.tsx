import React from 'react';
import { Eye, Search, Lightbulb, Zap, Sparkles } from 'lucide-react';

interface TutorVisualGuideProps {
  lookHere: string;
  searchThis: string;
  thisMeans: string;
  nowTry?: string;
  className?: string;
}

export const TutorVisualGuide: React.FC<TutorVisualGuideProps> = ({
  lookHere,
  searchThis,
  thisMeans,
  nowTry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl bg-[#0b0f19] border border-cyan-500/30 p-4 sm:p-5 text-white font-sans-editorial shadow-lg space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-xs font-mono text-cyan-400 font-bold">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>GUÍA VISUAL // TUTOR EVO</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        {/* MIRÁ ACÁ */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>1. MIRÁ ACÁ</span>
          </span>
          <p className="text-xs text-zinc-200 leading-relaxed font-sans-editorial">
            {lookHere}
          </p>
        </div>

        {/* BUSCÁ ESTO */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. BUSCÁ ESTO</span>
          </span>
          <p className="text-xs text-zinc-200 leading-relaxed font-sans-editorial">
            {searchThis}
          </p>
        </div>

        {/* ESTO SIGNIFICA */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1 sm:col-span-2">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
            <span>3. ESTO SIGNIFICA</span>
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
            {thisMeans}
          </p>
        </div>

        {/* AHORA PROBÁ (opcional) */}
        {nowTry && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1 sm:col-span-2">
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>4. AHORA PROBÁ</span>
            </span>
            <p className="text-xs text-amber-100 font-medium leading-relaxed font-sans-editorial">
              {nowTry}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
