import React from 'react';
import {
  Activity, ArrowRight, Boxes, ChevronDown, CircuitBoard, Cpu, FlaskConical,
  Gamepad2, Gauge, GitCompareArrows, Microscope, ScanLine, SearchCheck, Waypoints,
} from 'lucide-react';
import type { CanonicalPracticeLab } from '../../data/evoCatalog';

const icons: Record<string, typeof Cpu> = {
  'chapter-04': SearchCheck,
  'chapter-06': Microscope,
  'lab-hardware-latency': Activity,
  'lab-cpu-architecture': Cpu,
  'lab-gaming-simulator': Gamepad2,
  'lab-pc-builder': Boxes,
  'lab-digital-twin': ScanLine,
  'pcb-canvas': CircuitBoard,
  'chapter-02': Waypoints,
  'live-bench': Gauge,
  'chapter-03': Activity,
  'chapter-07': GitCompareArrows,
};
const kindLabels = { SIMULADOR: 'Simulador', GUIADO: 'Laboratorio guiado', CASO: 'Caso', CAMPUS: 'Zona del campus' };

interface Props {
  lab: CanonicalPracticeLab;
  expanded: boolean;
  onToggleDetail: () => void;
  onOpen: (id: string) => void;
}

/** Presentation only: the canonical record and catalog callbacks remain authoritative. */
export const EvoLabEditorialCard: React.FC<Props> = ({ lab, expanded, onToggleDetail, onOpen }) => {
  const Icon = icons[lab.id] || FlaskConical;
  const available = lab.status === 'DISPONIBLE' && lab.target !== null;
  const details = [
    ['Problema', lab.problem], ['Experimento', lab.experiment],
    ['Aprendizaje', lab.outcome], ['Evidencia', lab.evidence],
  ].filter(([, text]) => Boolean(text));

  return (
    <article data-lab-id={lab.id} data-editorial-lab className="flex h-full min-h-[23rem] min-w-0 flex-col rounded-xl border border-[#303841] bg-[#11161c] p-5 sm:p-6 text-zinc-100 transition-colors hover:border-[#596e78] focus-within:border-[#8bbac3]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#35424b] bg-[#19222a] text-[#a0c9d0]">
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded border border-[#34414a] px-2 py-1 text-[10px] font-medium tracking-wide text-[#b1cdd0]">
          <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-[#93bfc5]' : 'bg-zinc-500'}`} aria-hidden="true" />
          {lab.status}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <p className="break-words font-mono-tech text-[10px] tracking-wide text-zinc-400">{lab.id}</p>
        <h4 className="break-words font-display text-lg font-semibold leading-snug tracking-tight text-[#f0f2f4]">{lab.title}</h4>
        <p className="break-words text-sm leading-relaxed text-[#b2bac3]">{lab.description}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[11px] leading-relaxed">
        <span className="font-medium text-[#bdd3d8]">{kindLabels[lab.kind]}</span>
        <span className="text-zinc-400">{lab.category}</span>
      </div>

      <div className="mt-auto pt-6">
        <div className="space-y-4 border-t border-[#303841] pt-4">
          {details.length > 0 && (
            <button type="button" aria-expanded={expanded} aria-controls={`detail-${lab.id}`} onClick={onToggleDetail} className="flex min-h-8 items-center gap-2 rounded text-left text-xs font-medium text-[#b6c7cf] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8bbac3]">
              {expanded ? 'Ocultar detalle' : 'Ver detalle'}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          )}
          {details.length > 0 && expanded && (
            <div id={`detail-${lab.id}`} className="space-y-4 rounded-lg border border-[#35424b] bg-[#0c1116] p-4">
              {details.map(([label, text]) => (
                <p key={label} className="break-words text-xs leading-relaxed text-[#b2bac3]">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#9fc6cf]">{label}</span>
                  {text}
                </p>
              ))}
            </div>
          )}
          <button type="button" disabled={!available} onClick={() => onOpen(lab.id)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg bg-[#c6ad7d] px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#15191e] transition-colors hover:bg-[#d4bd91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a7cdd4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#11161c] disabled:cursor-not-allowed disabled:bg-[#242a31] disabled:text-zinc-500">
            Abrir laboratorio<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};
