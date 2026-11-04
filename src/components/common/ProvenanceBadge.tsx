import React, { useState } from 'react';
import { Activity, Cpu, Layers, HelpCircle, Info, Check } from 'lucide-react';
import { MetricProvenance, PROVENANCE_DEFINITIONS, normalizeProvenance } from '../../utils/provenance';

interface ProvenanceBadgeProps {
  provenance: MetricProvenance | string;
  sourceOrFormula?: string;
  assumptions?: string[];
  confidencePct?: number;
  compact?: boolean;
  onManualOverride?: (newValue: string) => void;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
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

  const getIcon = () => {
    switch (normalized) {
      case 'MEDIDO':
        return <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />;
      case 'CALCULADO':
        return <Cpu className="w-3 h-3 text-cyan-400" />;
      case 'SIMULADO':
        return <Layers className="w-3 h-3 text-amber-400" />;
      case 'DESCONOCIDO':
      default:
        return <HelpCircle className="w-3 h-3 text-slate-400" />;
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
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer"
          style={{
            backgroundColor: def.bgColor,
            borderColor: def.borderColor,
            color: def.textColor,
          }}
          title={`${def.label}: ${def.description}`}
        >
          {getIcon()}
          <span>{normalized}</span>
        </button>

        {showDetails && (
          <div className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-lg shadow-xl text-left text-xs text-zinc-300 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
              <span className="font-bold text-zinc-100 flex items-center gap-1.5 font-mono text-[11px]">
                {getIcon()} {def.label}
              </span>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">{def.description}</p>
            {sourceOrFormula && (
              <div className="bg-black/40 p-1.5 rounded border border-zinc-800 font-mono text-[10px] text-zinc-300">
                <span className="text-zinc-500 block text-[9px] uppercase font-bold">Origen / Fórmula:</span>
                {sourceOrFormula}
              </div>
            )}
            {assumptions && assumptions.length > 0 && (
              <div className="text-[10px] space-y-1">
                <span className="text-amber-400/90 font-bold block text-[9px] uppercase">Supuestos del Modelo:</span>
                <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {confidencePct !== undefined && (
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>Certeza Metrológica:</span>
                <span className="font-mono font-bold text-zinc-200">{confidencePct}%</span>
              </div>
            )}
            {onManualOverride && (
              <div className="pt-1 border-t border-zinc-800">
                {!showOverrideInput ? (
                  <button
                    type="button"
                    onClick={() => setShowOverrideInput(true)}
                    className="w-full text-center text-[10px] text-cyan-400 hover:underline py-0.5 cursor-pointer"
                  >
                    ✏️ Ingresar valor manual verificado
                  </button>
                ) : (
                  <div className="flex gap-1 mt-1">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="Valor medido..."
                      className="flex-1 bg-black/60 border border-zinc-700 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyOverride}
                      className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-black text-[10px] font-bold rounded cursor-pointer"
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
        backgroundColor: def.bgColor,
        borderColor: def.borderColor,
        color: def.textColor,
      }}
    >
      {getIcon()}
      <span className="font-bold">{normalized}</span>
      {sourceOrFormula && (
        <span className="hidden sm:inline text-[10px] opacity-75 font-sans lowercase truncate max-w-[140px]">
          ({sourceOrFormula})
        </span>
      )}
    </div>
  );
};
