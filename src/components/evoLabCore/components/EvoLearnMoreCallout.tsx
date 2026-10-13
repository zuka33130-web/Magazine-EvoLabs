import React from 'react';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { LearnMoreReference } from '../types';

interface EvoLearnMoreCalloutProps {
  reference: LearnMoreReference;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
}

export const EvoLearnMoreCallout: React.FC<EvoLearnMoreCalloutProps> = ({
  reference,
  onNavigateToTomo,
}) => {
  const getTomoBadgeColor = (tomoId: string) => {
    switch (tomoId) {
      case '01':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/40';
      case '02':
        return 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40';
      case '03':
        return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40';
      case '04':
        return 'bg-purple-400/20 text-purple-300 border-purple-400/40';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#0b0e14] p-4 sm:p-5 font-mono-tech relative overflow-hidden shadow-lg transition-all hover:border-zinc-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                ¿QUERÉS ENTENDER POR QUÉ?
              </span>
              <span
                className={`px-2 py-0.2 rounded text-[10px] font-bold border ${getTomoBadgeColor(
                  reference.tomoId
                )}`}
              >
                TOMO {reference.tomoId} // {reference.tomoTitle}
              </span>
            </div>

            <h4 className="font-display font-bold text-white text-sm sm:text-base">
              {reference.chapterNumber ? `Capítulo ${reference.chapterNumber}: ` : ''}
              {reference.chapterTitle}
            </h4>

            <p className="text-zinc-300 text-xs font-sans-editorial leading-relaxed max-w-2xl">
              {reference.pedagogicalSummary}
            </p>
          </div>
        </div>

        {onNavigateToTomo && (
          <button
            type="button"
            onClick={() => onNavigateToTomo(reference.tomoId)}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
          >
            <span>{reference.actionPrompt || 'APRENDER CON EVO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
