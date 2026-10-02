import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';

interface TutorConceptTriggerProps {
  termKey: string;
  label?: string;
  variant?: 'pill' | 'inline' | 'button';
  className?: string;
}

export const TutorConceptTrigger: React.FC<TutorConceptTriggerProps> = ({
  termKey,
  label,
  variant = 'pill',
  className = '',
}) => {
  const { openTutorWithTerm } = useTutorEvo();

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={() => openTutorWithTerm(termKey)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[11px] font-mono font-bold transition-all cursor-pointer shadow-sm ${className}`}
        title={`Explicación de Tutor EVO sobre ${label || termKey}`}
      >
        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
        <span>{label || '¿QUÉ ES ESTO?'}</span>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={() => openTutorWithTerm(termKey)}
        className={`inline-flex items-baseline gap-1 text-amber-400 hover:text-amber-300 underline underline-offset-2 decoration-amber-500/50 hover:decoration-amber-400 font-medium transition-all cursor-pointer ${className}`}
        title={`Ver qué significa ${label || termKey} en Tutor EVO`}
      >
        <span>{label || termKey}</span>
        <HelpCircle className="w-3 h-3 inline text-amber-400" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openTutorWithTerm(termKey)}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold transition-all cursor-pointer ${className}`}
      title={`Consultar a Tutor EVO: ${label || termKey}`}
    >
      <HelpCircle className="w-3 h-3 text-amber-400" />
      <span>{label || '¿QUÉ ES?'}</span>
    </button>
  );
};
