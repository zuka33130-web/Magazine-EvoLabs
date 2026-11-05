import React, { useState } from 'react';
import { Activity, Cpu, Layers, HelpCircle, Info, Check, ShieldCheck, Sliders } from 'lucide-react';
import { MetricProvenance, PROVENANCE_DEFINITIONS, EPISTEMOLOGICAL_CATEGORIES, normalizeProvenance, EpistemologicalCategory } from '../../utils/provenance';

interface ProvenanceBadgeProps {
  provenance: MetricProvenance | string;
  categoryOverride?: EpistemologicalCategory;
  sourceOrFormula?: string;
  assumptions?: string[];
  confidencePct?: number;
  compact?: boolean;
  onManualOverride?: (newValue: string) => void;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  categoryOverride,
  sourceOrFormula,
  assumptions,
  confidencePct,
  compact = false,
  onManualOverride,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showOverrideInput, setShowOverrideInput] = useState(false);

  const normalized = normalizeProvenance(provenance);
  const def = PROVENANCE_DEFINITIONS[normalized];
  const categoryKey = categoryOverride || def.epistemicCategory;
  const categoryDef = EPISTEMOLOGICAL_CATEGORIES[categoryKey];

  const getIcon = () => {
    switch (categoryKey) {
      case 'CATEGORIA_A':
        return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
      case 'CATEGORIA_B':
        return <Layers className="w-3 h-3 text-amber-400" />;
      case 'CATEGORIA_C':
      default:
        return <Sliders className="w-3 h-3 text-cyan-400" />;
    }
  };

  const handleApplyOverride = () => {
    if (manualInput.trim() && onManualOverride) {
      onManualOverride(manualInput.trim());
      setShowOverrideInput(false);
      setManualInput('');
    }
  };

  if (compact) {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer font-bold"
          style={{
            backgroundColor: categoryDef.bgColor,
            borderColor: categoryDef.borderColor,
            color: categoryDef.textColor,
          }}
          title={`${categoryDef.title}: ${categoryDef.description}`}
        >
          {getIcon()}
          <span>{categoryDef.shortTag} • {normalized}</span>
        </button>

        {showDetails && (
          <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-[#0d1017]/95 backdrop-blur-md border border-zinc-700 rounded-xl shadow-2xl text-left text-xs text-zinc-300 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
              <span className="font-bold text-white flex items-center gap-1.5 font-mono text-[11px]" style={{ color: categoryDef.textColor }}>
                {getIcon()} {categoryDef.title}
              </span>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">{categoryDef.description}</p>
            
            <div className="pt-1 border-t border-zinc-800/80 text-[10px] space-y-1">
              <span className="text-zinc-400 block font-bold uppercase">{def.label}</span>
              <p className="text-zinc-400">{def.description}</p>
            </div>

            {sourceOrFormula && (
              <div className="bg-black/60 p-2 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-300 space-y-0.5">
                <span className="text-zinc-400 block text-[9px] uppercase font-bold">Origen / Fuente Técnica:</span>
                <div>{sourceOrFormula}</div>
              </div>
            )}
            {assumptions && assumptions.length > 0 && (
              <div className="text-[10px] space-y-1">
                <span className="text-amber-400 font-bold block text-[9px] uppercase">Supuestos Declarados:</span>
                <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {confidencePct !== undefined && (
              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Certeza Metrológica:</span>
                <span className="font-bold text-white">{confidencePct}%</span>
              </div>
            )}
            {onManualOverride && (
              <div className="pt-1.5 border-t border-zinc-800">
                {!showOverrideInput ? (
                  <button
                    type="button"
                    onClick={() => setShowOverrideInput(true)}
                    className="w-full text-center text-[10px] font-mono text-cyan-400 hover:underline py-0.5 cursor-pointer"
                  >
                    ✏️ Ingresar medición manual verificada
                  </button>
                ) : (
                  <div className="flex gap-1 mt-1">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Valor medido..."
                      className="flex-1 bg-black/60 border border-zinc-700 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyOverride}
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-black text-[10px] font-bold rounded cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono uppercase tracking-wider border transition-all ${className}`}
      style={{
        backgroundColor: categoryDef.bgColor,
        borderColor: categoryDef.borderColor,
        color: categoryDef.textColor,
      }}
    >
      {getIcon()}
      <span className="font-bold">{categoryDef.shortTag}</span>
      <span className="text-zinc-400">•</span>
      <span>{normalized}</span>
      {sourceOrFormula && (
        <span className="hidden sm:inline text-[10px] opacity-80 font-sans lowercase truncate max-w-[150px]">
          ({sourceOrFormula})
        </span>
      )}
    </div>
  );
};
