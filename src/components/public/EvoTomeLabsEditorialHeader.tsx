import React from 'react';
import { ChevronDown, CircuitBoard } from 'lucide-react';
import type { CanonicalPracticeLab, CanonicalTomo } from '../../data/evoCatalog';

interface Props {
  tome: CanonicalTomo;
  labs: CanonicalPracticeLab[];
  matchingCount: number;
  expanded: boolean;
  heading?: string;
  description?: string;
  icon?: typeof CircuitBoard;
}

/** Counts and learning level always come from the canonical catalog. */
export const EvoTomeLabsEditorialHeader: React.FC<Props> = ({ tome, labs, matchingCount, expanded, heading = 'Laboratorios de hardware y simulación', description = 'Explorá componentes, arquitectura y rendimiento. Compará configuraciones y documentá tus observaciones con los bancos y prácticas existentes.', icon: Icon = CircuitBoard }) => {
  const available = labs.filter(lab => lab.status === 'DISPONIBLE' && lab.target !== null).length;
  return (
    <div className="rounded-xl border border-[#35424b] border-l-2 border-l-[#8ebdc6] bg-[#10161d] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0 flex-1 space-y-3">
          <span className="flex items-center gap-2 font-mono-tech text-[11px] tracking-wider text-[#9fc6cf]"><Icon className="h-4 w-4 shrink-0" aria-hidden="true" />TOMO {tome.tomoNumber} // {tome.title.toUpperCase()}</span>
          <h2 className="max-w-2xl font-display text-xl font-semibold uppercase leading-tight tracking-tight text-[#f0f2f4] sm:text-2xl">{heading}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[#b2bac3]">{description}</p>
        </div>
        <span className="flex min-h-9 items-center gap-2 text-xs text-[#b6c7cf]">{expanded ? 'Contraer tomo' : 'Expandir tomo'}<ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" /></span>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#303841] pt-4 text-xs text-[#b2bac3]">
        <span><strong className="mr-1 text-base font-semibold text-[#edf1f4]" data-tome-registered>{labs.length}</strong> experiencias registradas</span>
        <span><strong className="mr-1 text-base font-semibold text-[#bdd3d8]" data-tome-available>{available}</strong> disponibles</span>
        <span className="font-mono-tech text-[10px] tracking-wide text-[#c8b58f]">{tome.levelName}</span>
        {matchingCount !== labs.length && <span className="text-[#bdd3d8]">{matchingCount} resultados con estos filtros</span>}
      </div>
    </div>
  );
};
