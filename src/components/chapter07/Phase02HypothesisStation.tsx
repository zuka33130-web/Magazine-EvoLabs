import React from 'react';
import { HelpCircle, ArrowRight, ArrowLeft, ShieldAlert, Check } from 'lucide-react';
import { AbExperimentObjective } from '../../types';
import { OBJECTIVE_PRESETS } from './abExperimentKnowledge';

interface Phase02HypothesisStationProps {
  objective: AbExperimentObjective;
  userHypothesis: string;
  onChangeHypothesis: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Phase02HypothesisStation: React.FC<Phase02HypothesisStationProps> = ({
  objective,
  userHypothesis,
  onChangeHypothesis,
  onBack,
  onNext,
}) => {
  const currentPreset = OBJECTIVE_PRESETS.find((p) => p.id === objective);

  const isValid = userHypothesis.trim().length >= 10;

  const handleUseExample = (exampleText: string) => {
    onChangeHypothesis(exampleText);
  };

  return (
    <section
      id="fase-02-hipotesis-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <HelpCircle className="w-4 h-4 text-yellow-400" />
          <span>FASE 02 // HIPÓTESIS DE TRABAJO</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          ¿QUÉ CREÉS QUE VA A PASAR?
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Antes de tocar una sola perilla o registrar un número, definí tu expectativa. La ciencia no adivina el pasado; predice y luego compara con la realidad.
        </p>
      </div>

      {/* Regla Crítica: Hipótesis ≠ Conclusión */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-widest block">
            ADVERTENCIA METODOLÓGICA: UNA HIPÓTESIS NO ES UNA CONCLUSIÓN
          </span>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-300 leading-relaxed">
            No intentes formular una frase para tener razón a toda costa. Si tu hipótesis resulta falsa, <strong>el experimento habrá sido un éxito rotundo</strong> porque evitó que creas un mito o mantengas una configuración inútil en tu máquina.
          </p>
        </div>
      </div>

      {/* Sugerencia Guiada basada en el Objetivo */}
      {currentPreset && (
        <div className="p-5 rounded-2xl bg-[#141622] border border-zinc-800 space-y-3 font-mono-tech text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 uppercase font-bold">EJEMPLO SUGERIDO PARA ESTE ENSAYO:</span>
            <button
              type="button"
              onClick={() => handleUseExample(currentPreset.exampleHypothesis)}
              className="text-yellow-400 hover:text-yellow-300 underline cursor-pointer font-bold inline-flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>USAR ESTE EJEMPLO</span>
            </button>
          </div>
          <p className="font-sans-editorial text-sm text-zinc-200 italic bg-black/40 p-3 rounded-xl border border-zinc-800/80">
            “{currentPreset.exampleHypothesis}”
          </p>
        </div>
      )}

      {/* Textarea para escribir la hipótesis */}
      <div className="space-y-2">
        <label className="font-mono-tech text-xs text-yellow-400 uppercase font-bold block">
          TU HIPÓTESIS DE ENSAYO:
        </label>
        <textarea
          rows={3}
          value={userHypothesis}
          onChange={(e) => onChangeHypothesis(e.target.value)}
          placeholder="ej. Creo que limitar los FPS a 144 reducirá los picos de frametime y elevará el 1% Low evitando el thermal throttling de la GPU..."
          className="w-full p-4 rounded-xl bg-[#11121a] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400 leading-relaxed resize-none"
        />
        <span className="text-[11px] font-mono-tech text-zinc-500 block">
          Mínimo 10 caracteres requeridos para un planteo formal. ({userHypothesis.length} caracteres)
        </span>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER A OBJETIVO</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isValid
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg hover:shadow-yellow-400/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          <span>CONTINUAR A CONDICIONES DE ENSAYO</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
