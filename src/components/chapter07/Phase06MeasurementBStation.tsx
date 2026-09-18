import React from 'react';
import { Gauge, ArrowRight, ArrowLeft, Check, HelpCircle, ArrowDownRight } from 'lucide-react';
import {
  AbMetricSnapshot,
  AbPerception,
  AbControlledVariable,
} from '../../types';
import { AVAILABLE_METRICS } from './abExperimentKnowledge';

interface Phase06MeasurementBStationProps {
  selectedMetricKeys: string[];
  metricsA: AbMetricSnapshot;
  metricsB: AbMetricSnapshot;
  perceptionB?: AbPerception;
  controlledVariable: AbControlledVariable;
  onChangeMetricB: (key: string, val: number | null) => void;
  onChangePerceptionB: (val: AbPerception) => void;
  onBack: () => void;
  onNext: () => void;
}

const PERCEPTION_OPTIONS: Array<{ value: AbPerception; label: string; desc: string }> = [
  { value: 'FLUIDO', label: 'FLUIDO', desc: 'Respuesta suave y predecible sin interrupciones notorias.' },
  { value: 'MICRO-STUTTERING', label: 'MICRO-STUTTERING', desc: 'Breves enganches rápidos apenas perceptibles que rompen la continuidad.' },
  { value: 'TIRONES', label: 'TIRONES NOTORIOS', desc: 'Saltos claros de imagen o frenazos evidentes al jugar o trabajar.' },
  { value: 'CONGELAMIENTOS', label: 'CONGELAMIENTOS (HITCHES)', desc: 'Pausas completas de más de medio segundo.' },
  { value: 'RESPUESTA_LENTA', label: 'RESPUESTA LENTA (INPUT LAG)', desc: 'Arrastre o retardo molesto entre el mouse/teclado y la acción en pantalla.' },
  { value: 'SIN_CAMBIO_PERCIBIDO', label: 'NORMAL / REGULAR', desc: 'Comportamiento típico sin eventos destacados.' },
];

export const Phase06MeasurementBStation: React.FC<Phase06MeasurementBStationProps> = ({
  selectedMetricKeys,
  metricsA,
  metricsB,
  perceptionB,
  controlledVariable,
  onChangeMetricB,
  onChangePerceptionB,
  onBack,
  onNext,
}) => {
  const activeDefs = AVAILABLE_METRICS.filter((m) => selectedMetricKeys.includes(m.key));

  // Count metrics where BOTH A and B have valid numbers
  const pairsCount = activeDefs.filter((def) => {
    const a = metricsA[def.key];
    const b = metricsB[def.key];
    return typeof a === 'number' && !isNaN(a) && typeof b === 'number' && !isNaN(b);
  }).length;

  const hasMeasurementB = Object.values(metricsB).some(
    (v) => typeof v === 'number' && !isNaN(v)
  );

  const isFormValid = hasMeasurementB && pairsCount >= 1 && Boolean(perceptionB);

  return (
    <section
      id="fase-06-medicion-b-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <Gauge className="w-4 h-4 text-yellow-400" />
          <span>FASE 06 // MEDICIÓN B: DESPUÉS DEL CAMBIO</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          ESTADO B // IMPACTO DE LA VARIABLE MODIFICADA
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Con el cambio aplicado (<strong>{controlledVariable.changeApplied}</strong>) y manteniendo todas las demás condiciones idénticas, repetí la misma prueba y registrá la telemetría real.
        </p>
      </div>

      {/* Recordatorio de rigor */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-3 text-xs font-mono-tech">
        <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-zinc-300 leading-relaxed font-sans-editorial">
          <strong>Regla empírica:</strong> Registrá los datos reales observados. Si un número bajó o se mantuvo igual, anotalo tal cual. Los resultados inesperados son los que más enseñan en arquitectura de sistemas.
        </p>
      </div>

      {/* Inputs de Mediciones B (Comparativa en línea con A) */}
      <div className="space-y-4">
        <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
          COMPLETÁ LOS VALORES OBTENIDOS EN EL ESTADO B:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDefs.map((def) => {
            const valA = metricsA[def.key];
            const currentValB = metricsB[def.key];
            const hasValB = currentValB !== null && currentValB !== undefined && !isNaN(currentValB);

            return (
              <div
                key={def.key}
                className={`p-4 rounded-2xl border transition-all ${
                  hasValB ? 'bg-zinc-900/90 border-emerald-500/60' : 'bg-black/50 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono-tech font-bold text-xs uppercase text-white">
                    {def.label}
                  </span>
                  <span className="font-mono-tech text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-bold">
                    {def.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono-tech text-xs text-zinc-400 mb-2.5 pb-2 border-b border-zinc-800/80">
                  <span className="text-[11px] uppercase">VALOR EN A:</span>
                  <strong className="text-zinc-200">
                    {valA !== null && valA !== undefined && !isNaN(valA)
                      ? `${valA} ${def.unit}`
                      : 'No medido en A'}
                  </strong>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono-tech uppercase text-zinc-400 block font-bold flex items-center gap-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-yellow-400" />
                    <span>NUEVO VALOR EN B:</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={currentValB === null || currentValB === undefined ? '' : currentValB}
                    onChange={(e) => {
                      const val = e.target.value.trim() === '' ? null : parseFloat(e.target.value);
                      onChangeMetricB(def.key, val);
                    }}
                    placeholder={def.placeholder}
                    className="w-full px-3 py-2 rounded-xl bg-[#141622] border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Percepción en Estado B */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <div className="space-y-1">
          <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
            PERCEPCIÓN EN ESTADO B (SENSACIÓN TRAS EL CAMBIO): *
          </span>
          <p className="font-sans-editorial text-xs text-zinc-400">
            ¿Notaste alguna diferencia al interactuar directamente con la pantalla?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PERCEPTION_OPTIONS.map((opt) => {
            const isSelected = perceptionB === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangePerceptionB(opt.value)}
                className={`p-3.5 rounded-xl border text-left font-mono-tech transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-400/20 border-yellow-400 text-white'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
                    {opt.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-yellow-400" />}
                </div>
                <p className="font-sans-editorial text-[11px] text-zinc-400 leading-snug">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        {!isFormValid && (
          <div className="flex flex-wrap items-center gap-2 font-mono-tech text-[11px] text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
            <span className="font-bold uppercase tracking-wider">Pendiente para comparar:</span>
            {!hasMeasurementB && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-300">
                Falta Medición B
              </span>
            )}
            {hasMeasurementB && pairsCount === 0 && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-300">
                No hay métricas coincidentes con Estado A
              </span>
            )}
            {!perceptionB && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-300">
                Falta Percepción del Estado B
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>VOLVER A CAMBIO CONTROLADO</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!isFormValid}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isFormValid
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg hover:shadow-yellow-400/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
            }`}
          >
            <span>CONTINUAR A COMPARACIÓN A vs B</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
