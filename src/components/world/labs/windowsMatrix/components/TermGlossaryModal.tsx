// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// TERM GLOSSARY MODAL — [ ¿QUÉ SIGNIFICA? ]
// Technical Dictionary for Windows Internals, Kernel NT & Architecture
// ============================================================================

import React, { useState } from 'react';
import { BookOpen, Search, X, Layers, Shield, Cpu, Terminal } from 'lucide-react';
import { TOMO_02_GLOSSARY } from '../../../../../data/tomo02Data';

interface TermGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export const TermGlossaryModal: React.FC<TermGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialSearch = ''
}) => {
  const [query, setQuery] = useState<string>(initialSearch);

  if (!isOpen) return null;

  const filtered = TOMO_02_GLOSSARY.filter(
    (g) =>
      g.term.toLowerCase().includes(query.toLowerCase()) ||
      g.definition.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="max-w-2xl w-full rounded-2xl bg-[#0c1017] border border-cyan-500/50 shadow-2xl p-5 sm:p-6 space-y-4 font-sans-editorial text-white relative flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-cyan-950 pb-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase tracking-widest block">
              DICCIONARIO TÉCNICO // APERTURA DE TÉRMINOS
            </span>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
              ¿Qué Significa? Glosario Forense de Windows
            </h3>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar término (ej. Ring 0, BCD, DPC, UEFI, ESP, SCM)..."
            className="w-full pl-9 pr-4 py-2 bg-black/70 border border-cyan-950 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* List of Definitions */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-cyan-500/40 transition-colors space-y-1 text-xs"
            >
              <span className="font-mono-tech font-bold text-cyan-300 text-sm block">
                {item.term}
              </span>
              <p className="text-zinc-300 font-sans-editorial leading-relaxed text-xs">
                {item.definition}
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-xs font-mono-tech">
              No se encontraron términos para "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
          <span>{TOMO_02_GLOSSARY.length} Conceptos Críticos Definidos</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
