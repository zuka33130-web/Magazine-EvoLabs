import React, { useState } from 'react';
import { ArrowRight, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Info } from 'lucide-react';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { MetricProvenance } from '../../utils/provenance';

export interface LabCardUsageData {
  objective: string;
  steps: string[];
  formulaOrPhysics: string;
  benchVerdict: string;
}

interface LabCardWithUsageGuideProps {
  escalonNumber: number;
  itemOrder: string;
  id: string;
  title: string;
  icon: React.ReactNode;
  provenance: MetricProvenance | string;
  provenanceSource?: string;
  summary: string;
  usageData: LabCardUsageData;
  actionText?: string;
  onAction: () => void;
  accent?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'yellow' | 'orange';
  isCompleted?: boolean;
}

export const LabCardWithUsageGuide: React.FC<LabCardWithUsageGuideProps> = ({
  escalonNumber,
  itemOrder,
  id,
  title,
  icon,
  provenance,
  provenanceSource,
  summary,
  usageData,
  actionText = 'ABRIR LABORATORIO',
  onAction,
  accent = 'cyan',
  isCompleted = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Border & Accent Styles
  const accentStyles = {
    cyan: {
      borderHover: 'hover:border-cyan-500/60',
      tagBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      btnBg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
      badgeColor: 'text-cyan-400',
    },
    emerald: {
      borderHover: 'hover:border-emerald-500/60',
      tagBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      btnBg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      badgeColor: 'text-emerald-400',
    },
    amber: {
      borderHover: 'hover:border-amber-500/60',
      tagBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      btnBg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-amber-300',
      badgeColor: 'text-amber-400',
    },
    purple: {
      borderHover: 'hover:border-purple-500/60',
      tagBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      btnBg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/40 text-purple-300',
      badgeColor: 'text-purple-400',
    },
    yellow: {
      borderHover: 'hover:border-yellow-500/60',
      tagBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      btnBg: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
      badgeColor: 'text-yellow-400',
    },
    orange: {
      borderHover: 'hover:border-orange-500/60',
      tagBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      btnBg: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/40 text-orange-300',
      badgeColor: 'text-orange-400',
    },
  };

  const style = accentStyles[accent] || accentStyles.cyan;

  return (
    <div className={`rounded-2xl border border-zinc-800 bg-[#0A0E1A] p-5 flex flex-col justify-between space-y-4 transition-all ${style.borderHover}`}>
      <div className="space-y-3">
        {/* Top Meta Header */}
        <div className="flex items-center justify-between font-mono-tech text-[10px]">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded border font-bold uppercase ${style.tagBg}`}>
              ESCALÓN {escalonNumber} · {itemOrder}
            </span>
            <ProvenanceBadge provenance={provenance} compact sourceOrFormula={provenanceSource} />
          </div>
          <span className="text-zinc-500 font-mono text-[10px]">ID: {id}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="shrink-0">{icon}</span>
          <span>{title}</span>
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          {summary}
        </p>

        {/* Interactive Guide Toggle Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/40 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-[11px] transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-zinc-300">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isOpen ? 'OCULTAR GUÍA DE USO' : '¿CÓMO USAR ESTE LABORATORIO?'}</span>
            </span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
        </div>

        {/* Collapsible Usage Guide Details */}
        {isOpen && (
          <div className="p-3.5 bg-black/70 border border-zinc-800 rounded-xl space-y-2.5 text-xs font-sans text-zinc-300 animate-fadeIn">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-0.5">
                🎯 Objetivo Técnico:
              </span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {usageData.objective}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block mb-0.5">
                ⚙️ Pasos de Uso y Controles:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-zinc-300">
                {usageData.steps.map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block mb-0.5">
                📐 Principio Físico / Fórmula:
              </span>
              <p className="text-[11px] font-mono text-zinc-200 bg-zinc-950 p-1.5 rounded border border-zinc-800/80">
                {usageData.formulaOrPhysics}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block mb-0.5">
                🔬 Aplicación en Banco de Trabajo:
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {usageData.benchVerdict}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-zinc-800/80">
        <div>
          {isCompleted ? (
            <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> VALIDADO
            </span>
          ) : (
            <span className="text-zinc-500 font-mono text-[10px] uppercase">
              DISPONIBLE
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onAction}
          className={`py-2 px-4 rounded-xl border font-mono-tech font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${style.btnBg}`}
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
