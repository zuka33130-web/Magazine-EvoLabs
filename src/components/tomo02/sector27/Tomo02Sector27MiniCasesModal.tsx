import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Lightbulb,
} from 'lucide-react';
import { SECTOR_27_MINICASES } from '../../../data/tomo02Sector27Data';

interface Tomo02Sector27MiniCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tomo02Sector27MiniCasesModal: React.FC<Tomo02Sector27MiniCasesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  if (!isOpen) return null;

  const currentCase = SECTOR_27_MINICASES[selectedCaseIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#080B10] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-[#0B0F17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                EXPEDIENTES Y CASOS PRÁCTICOS // SECTOR 27
              </h2>
              <p className="text-xs text-zinc-400">
                Diagnóstico Pericial y Reparación de Sistemas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Selection Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-cyan-500/10 bg-[#05070A] overflow-x-auto">
          {SECTOR_27_MINICASES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCaseIndex(idx)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCaseIndex === idx
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Caso #{idx + 1}
            </button>
          ))}
        </div>

        {/* Case Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto font-sans-editorial text-sm">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
              {currentCase.id}
            </span>
            <h3 className="text-lg font-bold text-white">{currentCase.title}</h3>
          </div>

          <div className="p-4 rounded-xl bg-[#0D121B] border border-cyan-500/20 space-y-3 font-mono text-xs">
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">Escenario:</span>
              <p className="text-zinc-200 mt-0.5">{currentCase.scenario}</p>
            </div>
            <div>
              <span className="text-amber-400 uppercase text-[10px] block font-bold">Síntoma Identificado:</span>
              <p className="text-amber-200 mt-0.5">{currentCase.symptom}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Acción Correctiva Pericial Recomendada:</span>
            </div>
            <p className="text-emerald-100 font-sans">{currentCase.correctAction}</p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Fundamentación Técnica:</span>
            </div>
            <p className="text-zinc-300 font-sans">{currentCase.explanation}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#0B0F17] flex justify-between items-center">
          <span className="text-xs font-mono text-zinc-500">
            Expediente {selectedCaseIndex + 1} de {SECTOR_27_MINICASES.length}
          </span>
          <button
            type="button"
            onClick={() =>
              setSelectedCaseIndex((prev) => (prev + 1) % SECTOR_27_MINICASES.length)
            }
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            Siguiente Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
