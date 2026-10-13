import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Compass, Play, Wrench } from 'lucide-react';
import { NextBestActionItem } from '../../services/evoAdaptivePath';

interface EvoNextBestActionBannerProps {
  action: NextBestActionItem;
  onExecuteAction: (actionKey: string, targetChapterId?: string, targetLabId?: string) => void;
  className?: string;
  variant?: 'prominent' | 'compact';
}

export const EvoNextBestActionBanner: React.FC<EvoNextBestActionBannerProps> = ({
  action,
  onExecuteAction,
  className = '',
  variant = 'prominent',
}) => {
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'BLOQUEANTE':
        return 'bg-red-500/15 text-red-400 border-red-500/40 shadow-red-500/10';
      case 'CONTINUIDAD':
        return 'bg-amber-400/15 text-amber-300 border-amber-400/40 shadow-amber-400/10';
      case 'VERIFICACIÓN':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10';
      case 'PRÁCTICA':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10';
      case 'PROFUNDIZACIÓN':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-purple-500/10';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'BLOQUEANTE':
        return <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />;
      case 'CONTINUIDAD':
        return <Play className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'VERIFICACIÓN':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'PRÁCTICA':
      case 'PROFUNDIZACIÓN':
        return <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />;
      default:
        return <Compass className="w-4 h-4 text-zinc-400 shrink-0" />;
    }
  };

  if (variant === 'compact') {
    return (
      <div
        className={`p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-between gap-3 text-xs ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {getPriorityIcon(action.priorityLevel)}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech font-bold text-white uppercase truncate">
                {action.actionTitle}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[8.5px] font-mono-tech font-bold uppercase border ${getPriorityBadgeStyle(
                  action.priorityLevel
                )}`}
              >
                {action.priorityLevel}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans-editorial truncate">
              {action.whyExplanation}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onExecuteAction(action.actionKey, action.targetChapterId, action.targetLabId)}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-sm shadow-amber-400/20"
        >
          <span>{action.ctaText}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-5 rounded-2xl bg-gradient-to-r from-amber-400/10 via-zinc-900 to-zinc-950 border border-amber-400/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl transition-all hover:border-amber-400/50 ${className}`}
    >
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono-tech text-[9px] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            SIGUIENTE MEJOR ACCIÓN // ADAPTIVE PATH ENGINE
          </span>
          <span
            className={`px-2.5 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase border ${getPriorityBadgeStyle(
              action.priorityLevel
            )}`}
          >
            {action.priorityLevel}
          </span>
          {action.evidenceSourceRef && (
            <span className="text-[10px] text-zinc-500 font-mono-tech">
              [ {action.evidenceSourceRef} ]
            </span>
          )}
        </div>

        {/* ACCIÓN (TÍTULO) */}
        <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight flex items-center gap-2">
          {getPriorityIcon(action.priorityLevel)}
          <span>{action.actionTitle}</span>
        </h3>

        {/* MOTIVO (¿POR QUÉ ESTO?) */}
        <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-xs font-mono-tech space-y-1">
          <div className="text-amber-400 font-bold uppercase text-[9.5px] tracking-wider">
            ¿POR QUÉ ESTA ACCIÓN?
          </div>
          <p className="font-sans-editorial text-zinc-300 text-[11.5px] leading-relaxed">
            {action.whyExplanation}
          </p>
        </div>

        {/* QUÉ CAMBIA (IMPACTO) */}
        <div className="flex items-start gap-2 text-[11px] font-mono-tech text-emerald-400/90 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <span className="font-bold shrink-0 uppercase text-[9.5px]">QUÉ CAMBIA:</span>
          <span className="text-zinc-300 font-sans-editorial">{action.whatChanges}</span>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="shrink-0 flex items-center">
        <button
          type="button"
          onClick={() => onExecuteAction(action.actionKey, action.targetChapterId, action.targetLabId)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 transition-transform active:scale-[0.98]"
        >
          <span>{action.ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
