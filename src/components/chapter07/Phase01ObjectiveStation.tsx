import React from 'react';
import { Target, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { AbExperimentObjective } from '../../types';
import { OBJECTIVE_PRESETS, ObjectivePreset } from './abExperimentKnowledge';

interface Phase01ObjectiveStationProps {
  selectedObjective: AbExperimentObjective;
  customObjectiveText: string;
  onSelectObjective: (obj: AbExperimentObjective) => void;
  onChangeCustomText: (text: string) => void;
  onNextPhase: () => void;
}

export const Phase01ObjectiveStation: React.FC<Phase01ObjectiveStationProps> = ({
  selectedObjective,
  customObjectiveText,
  onSelectObjective,
  onChangeCustomText,
  onNextPhase,
}) => {
  const currentPreset = OBJECTIVE_PRESETS.find((p) => p.id === selectedObjective);

  const isFormValid =
    selectedObjective !== 'OTRO' || (selectedObjective === 'OTRO' && customObjectiveText.trim().length > 3);

  return (
    <section
      id="fase-01-objetivo-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <Target className="w-4 h-4 text-yellow-400" />
          <span>FASE 01 // ELEGÍ QUÉ QUERÉS DEMOSTRAR</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          DEFINÍ EL OBJETIVO DEL ENSAYO
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          No cambiamos cosas al azar con la esperanza de que algo funcione. Un experimento riguroso parte de una meta clara y medible.
        </p>
      </div>

      {/* Regla de Laboratorio EVO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-widest block">
            REGLA DE ORO DE LABORATORIO: UNA PRUEBA. UNA VARIABLE.
          </span>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
            Si cambiás cinco cosas al mismo tiempo y el resultado mejora, <strong>no sabés cuál funcionó</strong> ni cuál empeoró otra cosa en silencio. En este laboratorio vamos a aislar una sola variable.
          </p>
        </div>
      </div>

      {/* Grid de 8 Objetivos */}
      <div className="space-y-3">
        <span className="font-mono-tech text-xs text-zinc-400 uppercase tracking-wider block font-bold">
          SELECCIONÁ UN OBJETIVO A PONER A PRUEBA:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OBJECTIVE_PRESETS.map((preset) => {
            const isSelected = selectedObjective === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectObjective(preset.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-yellow-400/15 border-yellow-400 shadow-md'
                    : 'bg-black/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono-tech font-bold text-xs uppercase ${
                        isSelected ? 'text-yellow-400' : 'text-white'
                      }`}
                    >
                      {preset.title}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />}
                  </div>
                  <p className="font-sans-editorial text-xs text-zinc-400 leading-snug">
                    {preset.shortDesc}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 font-mono-tech text-[10px] text-zinc-500">
                  <span>MÉTRICAS CLAVE:</span>
                  <span className="text-zinc-300 font-semibold">{preset.defaultMetrics.join(', ')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campo de Texto Libre si eligió OTRO */}
      {selectedObjective === 'OTRO' && (
        <div className="p-5 rounded-2xl bg-black/60 border border-zinc-800 space-y-2 animate-fadeIn">
          <label className="font-mono-tech text-xs text-yellow-400 uppercase font-bold block">
            ESCRIBÍ TU OBJETIVO PERSONALIZADO:
          </label>
          <input
            type="text"
            value={customObjectiveText}
            onChange={(e) => onChangeCustomText(e.target.value)}
            placeholder="ej. Medir si activar XMP/DOCP reduce los micro-tirones en simuladores de vuelo"
            className="w-full px-4 py-3 rounded-xl bg-[#141620] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
      )}

      {/* Ficha Guía Especializada según el Objetivo Seleccionado */}
      {currentPreset && currentPreset.specialGuideTitle && (
        <div className="p-5 rounded-2xl bg-[#13151f] border border-zinc-800 space-y-2 text-xs font-mono-tech text-zinc-300">
          <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            <span>{currentPreset.specialGuideTitle}</span>
          </div>
          <p className="font-sans-editorial text-zinc-300 leading-relaxed text-xs sm:text-sm">
            {currentPreset.specialGuideText}
          </p>
        </div>
      )}

      {/* Footer / Avanzar a Fase 02 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="font-mono-tech text-xs text-zinc-400">
          <span>OBJETIVO VIGENTE: </span>
          <strong className="text-white">
            {selectedObjective === 'OTRO' ? customObjectiveText || 'Personalizado' : currentPreset?.title}
          </strong>
        </div>

        <button
          type="button"
          onClick={onNextPhase}
          disabled={!isFormValid}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isFormValid
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg hover:shadow-yellow-400/20'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          <span>CONTINUAR A FASE 02: HIPÓTESIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
