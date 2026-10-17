import React, { useState } from 'react';
import { X, Check, ShieldCheck, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { CANONICAL_TOMES, CanonicalTomo } from '../../data/evoCatalog';
import { EvoPriceItem } from '../../data/evoPricing';

interface EvoPlanConfiguratorModalProps {
  product: EvoPriceItem;
  isOpen: boolean;
  onClose: () => void;
  onProceedToSummary: (selectedTomeIds: string[]) => void;
}

export const EvoPlanConfiguratorModal: React.FC<EvoPlanConfiguratorModalProps> = ({
  product,
  isOpen,
  onClose,
  onProceedToSummary,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const exactCount = product.selectionRule?.exact || 3;

  const handleToggleTomo = (tomeId: string) => {
    setWarningMessage(null);
    if (selectedIds.includes(tomeId)) {
      setSelectedIds(selectedIds.filter((id) => id !== tomeId));
    } else {
      if (selectedIds.length >= exactCount) {
        setWarningMessage(`Este plan incluye exactamente ${exactCount} Tomos. Desmarcá uno para elegir otro.`);
        return;
      }
      setSelectedIds([...selectedIds, tomeId]);
    }
  };

  const isReady = selectedIds.length === exactCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono-tech select-none animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest uppercase font-black">
              <BookOpen className="w-4 h-4" />
              <span>CONFIGURAR TU PLAN // SELECCIÓN DE TOMOS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mt-1">
              {product.name}
            </h2>
            <p className="text-xs text-zinc-400 font-sans-editorial mt-1">
              Seleccioná exactamente {exactCount} Tomos canónicos de nuestro índice pericial.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter & Warning */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl font-black text-sm tracking-wider border ${
              selectedIds.length === exactCount
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
            }`}>
              {selectedIds.length} / {exactCount} ELEGIDOS
            </div>
            <span className="text-xs text-zinc-300">
              {selectedIds.length === exactCount
                ? '¡Selección completa lista para continuar!'
                : `Faltan ${exactCount - selectedIds.length} tomos por seleccionar.`}
            </span>
          </div>

          {warningMessage && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}
        </div>

        {/* Tomos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1">
          {CANONICAL_TOMES.map((tome) => {
            const isSelected = selectedIds.includes(tome.id);
            return (
              <div
                key={tome.id}
                onClick={() => handleToggleTomo(tome.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 border-amber-400 text-black'
                    : 'bg-zinc-950 border-zinc-700 text-transparent group-hover:border-zinc-500'
                }`}>
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      TOMO {tome.id}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Nivel {tome.levelNumber}
                    </span>
                  </div>
                  <h4 className="text-sm font-display font-bold text-white truncate mt-0.5">
                    {tome.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial line-clamp-1 mt-0.5">
                    {tome.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            VOLVER
          </button>
          
          <button
            type="button"
            disabled={!isReady}
            onClick={() => {
              if (isReady) {
                onProceedToSummary(selectedIds);
              }
            }}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              isReady
                ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
            }`}
          >
            <span>CONTINUAR AL PAGO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
