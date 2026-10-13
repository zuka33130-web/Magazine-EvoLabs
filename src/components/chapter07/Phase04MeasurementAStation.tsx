import React from 'react';
import { Gauge, ArrowRight, ArrowLeft, Plus, Check, HelpCircle } from 'lucide-react';
import {
  AbMetricSnapshot,
  AbPerception,
  AbMetricDefinition,
} from '../../types';
import { AVAILABLE_METRICS } from './abExperimentKnowledge';

interface Phase04MeasurementAStationProps {
  selectedMetricKeys: string[];
  metricsA: AbMetricSnapshot;
  perceptionA?: AbPerception;
  onToggleMetricKey: (key: string) => void;
  onChangeMetricA: (key: string, val: number | null) => void;
  onChangePerceptionA: (val: AbPerception) => void;
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

export const Phase04MeasurementAStation: React.FC<Phase04MeasurementAStationProps> = ({
  selectedMetricKeys,
  metricsA,
  perceptionA,
  onToggleMetricKey,
  onChangeMetricA,
  onChangePerceptionA,
  onBack,
  onNext,
}) => {
  // Count valid numbers
  const validCount = Object.values(metricsA).filter(
    (v): v is number => typeof v === 'number' && !isNaN(v)
  ).length;
  const isFormValid = validCount >= 1 && Boolean(perceptionA);

  const activeDefs = AVAILABLE_METRICS.filter((m) => selectedMetricKeys.includes(m.key));
  const otherDefs = AVAILABLE_METRICS.filter((m) => !selectedMetricKeys.includes(m.key));

  return (
    <section
      id="fase-04-medicion-a-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <Gauge className="w-4 h-4 text-yellow-400" />
          <span>FASE 04 // MEDICIÓN A: LÍNEA BASE</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          ESTADO A // ANTES DE CUALQUIER CAMBIO
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Ejecutá tu prueba en las condiciones acordadas. Registrá únicamente valores que hayas visto con tus propios ojos en el monitor de rendimiento, overlay (MSI Afterburner/RivaTuner, PresentMon, Administrador de tareas) o benchmark.
        </p>
      </div>

      {/* Regla Crítica: No inventar números */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start gap-3 text-xs font-mono-tech">
        <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-zinc-300 leading-relaxed font-sans-editorial">
          <strong>Regla de rigor EVO:</strong> Todos los campos inician vacíos. No precargamos promedios falsos. Registrá únicamente las métricas que tu software de monitoreo o tus ojos hayan capturado.
        </p>
      </div>

      {/* Selector de Métricas Activas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider">
            MÉTRICAS A MEDIR EN ESTE ENSAYO ({activeDefs.length}):
          </span>
        </div>

        {/* Inputs de Métricas Activas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDefs.map((def) => {
            const currentVal = metricsA[def.key];
            const hasVal = currentVal !== null && currentVal !== undefined && !isNaN(currentVal);

            return (
              <div
                key={def.key}
                className={`p-4 rounded-2xl border transition-all ${
                  hasVal ? 'bg-zinc-900/90 border-yellow-400/60' : 'bg-black/50 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono-tech font-bold text-xs uppercase text-white">
                    {def.label}
                  </span>
                  <span className="font-mono-tech text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-yellow-400 font-bold">
                    {def.unit}
                  </span>
                </div>

                <p className="font-sans-editorial text-[11px] text-zinc-400 mb-3 line-clamp-1">
                  {def.description}
                </p>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={currentVal === null || currentVal === undefined ? '' : currentVal}
                    onChange={(e) => {
                      const val = e.target.value.trim() === '' ? null : parseFloat(e.target.value);
                      onChangeMetricA(def.key, val);
                    }}
                    placeholder={def.placeholder}
                    className="w-full px-3 py-2 rounded-xl bg-[#141622] border border-zinc-700 text-white font-mono-tech text-sm focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Agregar más métricas si lo desea */}
        {otherDefs.length > 0 && (
          <div className="pt-2">
            <span className="font-mono-tech text-[11px] text-zinc-500 uppercase tracking-wider block mb-2">
              AGREGAR OTRAS MÉTRICAS DISPONIBLES:
            </span>
            <div className="flex flex-wrap gap-2">
              {otherDefs.map((def) => (
                <button
                  key={def.key}
                  type="button"
                  onClick={() => onToggleMetricKey(def.key)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-zinc-600 font-mono-tech text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{def.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Percepción Subjetiva (Separada formalmente de la telemetría) */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <div className="space-y-1">
          <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
            PERCEPCIÓN EN ESTADO A (SENSACIÓN SUBJETIVA): *
          </span>
          <p className="font-sans-editorial text-xs text-zinc-400">
            Los números no cuentan toda la historia. Registrá cómo se sintió la máquina durante esta primera pasada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PERCEPTION_OPTIONS.map((opt) => {
            const isSelected = perceptionA === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangePerceptionA(opt.value)}
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
            <span className="font-bold uppercase tracking-wider">Pendiente para continuar:</span>
            {validCount === 0 && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-300">
                Falta Medición A (al menos 1 valor numérico)
              </span>
            )}
            {!perceptionA && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-red-300">
                Falta Percepción del Estado A
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
            <span>VOLVER A CONDICIONES</span>
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
            <span>CONTINUAR A CAMBIO CONTROLADO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
