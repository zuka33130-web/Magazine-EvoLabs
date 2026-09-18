import React, { useState } from 'react';
import {
  GitCompare,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Undo2,
  FileCheck2,
  HelpCircle,
  Repeat,
} from 'lucide-react';
import {
  AbMetricSnapshot,
  AbPerception,
  AbControlledVariable,
  AbOutcomeResult,
  AbUserDecision,
  AbMetricDelta,
  AbExperimentTrial,
} from '../../types';
import { AVAILABLE_METRICS, calculateMetricDeltas } from './abExperimentKnowledge';

interface Phase07ComparisonStationProps {
  selectedMetricKeys: string[];
  metricsA: AbMetricSnapshot;
  metricsB: AbMetricSnapshot;
  perceptionA?: AbPerception;
  perceptionB?: AbPerception;
  controlledVariable: AbControlledVariable;
  outcomeResult?: AbOutcomeResult;
  userDecision?: AbUserDecision;
  userConclusion: string;
  interpretation: {
    whatChanged: string;
    whatDidNotChange: string;
    whatWeStillDoNotKnow: string;
  };
  isReverted: boolean;
  trials: AbExperimentTrial[];
  onChangeOutcomeResult: (res: AbOutcomeResult) => void;
  onChangeUserDecision: (dec: AbUserDecision) => void;
  onChangeUserConclusion: (val: string) => void;
  onChangeInterpretation: (key: 'whatChanged' | 'whatDidNotChange' | 'whatWeStillDoNotKnow', val: string) => void;
  onToggleRevert: () => void;
  onAddTrial: (trial: AbExperimentTrial) => void;
  onBack: () => void;
  onGenerateReport: () => void;
  isComparisonValid: boolean;
  missingComparisonItems: string[];
  onGoToIncompleteStep: () => void;
}

const OUTCOME_OPTIONS: Array<{ value: AbOutcomeResult; label: string; desc: string }> = [
  { value: 'MEJORÓ', label: 'MEJORÓ', desc: 'Las métricas clave y la fluidez mostraron una ganancia tangible sin comprometer la estabilidad.' },
  { value: 'MEJORÓ_PARCIALMENTE', label: 'MEJORÓ PARCIALMENTE', desc: 'Algunos números progresaron pero el beneficio perceptible es acotado o condicional.' },
  { value: 'SIN_CAMBIOS_SIGNIFICATIVOS', label: 'SIN CAMBIOS SIGNIFICATIVOS', desc: 'La diferencia numérica está dentro del margen de error o varianza natural del sistema.' },
  { value: 'EMPEORÓ', label: 'EMPEORÓ', desc: 'El cambio perjudicó la tasa de cuadros, frametime, consumo o estabilidad percibida.' },
  { value: 'RESULTADO_MIXTO', label: 'RESULTADO MIXTO', desc: 'Una métrica mejoró (ej. FPS promedio) pero otra empeoró drásticamente (ej. 1% Low o latencia).' },
  { value: 'NO_CONCLUYENTE', label: 'NO CONCLUYENTE', desc: 'Varianza excesiva o ruido de fondo que no permite asegurar el efecto de la variable.' },
];

const DECISION_OPTIONS: Array<{ value: AbUserDecision; label: string; desc: string }> = [
  { value: 'CONSERVAR', label: 'SÍ, LO CONSERVO', desc: 'La ganancia demostrada justifica mantener este ajuste permanentemente.' },
  { value: 'REVERTIR', label: 'NO, LO REVIERTO', desc: 'El costo, riesgo o empeoramiento hace preferible volver al estado A.' },
  { value: 'NECESITO_MAS_PRUEBAS', label: 'NECESITO MÁS PRUEBAS', desc: 'Requiere más pasadas o probar en otros mapas/aplicaciones antes de decidir.' },
];

export const Phase07ComparisonStation: React.FC<Phase07ComparisonStationProps> = ({
  selectedMetricKeys,
  metricsA,
  metricsB,
  perceptionA,
  perceptionB,
  controlledVariable,
  outcomeResult,
  userDecision,
  userConclusion,
  interpretation,
  isReverted,
  trials,
  onChangeOutcomeResult,
  onChangeUserDecision,
  onChangeUserConclusion,
  onChangeInterpretation,
  onToggleRevert,
  onAddTrial,
  onBack,
  onGenerateReport,
  isComparisonValid,
  missingComparisonItems,
  onGoToIncompleteStep,
}) => {
  const [showTrialsAccordion, setShowTrialsAccordion] = useState(false);

  const activeDefs = AVAILABLE_METRICS.filter((m) => selectedMetricKeys.includes(m.key));
  const deltas: AbMetricDelta[] = calculateMetricDeltas(metricsA, metricsB, activeDefs);

  // Conclusion is strictly blocked if there are no valid delta pairs or if comparison requirements are missing
  const isConclusionBlocked = deltas.length === 0 || !isComparisonValid;

  const isFormValid =
    !isConclusionBlocked &&
    deltas.length >= 1 &&
    Boolean(outcomeResult) &&
    Boolean(userDecision) &&
    userConclusion.trim().length >= 10;

  return (
    <section
      id="fase-07-comparacion-station"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1016] border-2 border-yellow-400/40 shadow-2xl space-y-8 text-white"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
          <GitCompare className="w-4 h-4 text-yellow-400" />
          <span>FASE 07 // COMPARACIÓN A vs B & CONCLUSIÓN</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
          TABLA COMPARATIVA Y ANÁLISIS DE IMPACTO
        </h2>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Acá confrontamos la hipótesis con la realidad. Los deltas matemáticos reflejan únicamente las mediciones que registraste con tu propia máquina.
        </p>
      </div>

      {/* Alerta si faltan datos para comparación válida */}
      {isConclusionBlocked && (
        <div
          id="alerta-comparacion-no-disponible"
          className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 space-y-4 font-mono-tech animate-fadeIn"
        >
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm tracking-wider uppercase">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>COMPARACIÓN TODAVÍA NO DISPONIBLE</span>
          </div>
          <p className="text-zinc-200 font-sans-editorial text-sm sm:text-base leading-relaxed font-semibold">
            “Necesitamos al menos una métrica medida antes y después del cambio para comparar.”
          </p>

          <div className="space-y-2 pt-2 border-t border-amber-500/20">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
              REQUISITOS PENDIENTES DETECTADOS:
            </span>
            <div className="flex flex-wrap gap-2">
              {missingComparisonItems.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs uppercase inline-flex items-center gap-1.5"
                >
                  <span>✕</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onGoToIncompleteStep}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs uppercase inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>IR AL PASO INCOMPLETO PARA REGISTRAR EVIDENCIA</span>
            </button>
          </div>
        </div>
      )}

      {/* Regla Crítica: No festejar un número aislado */}
      <div className="p-4 sm:p-5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-start gap-3.5 font-mono-tech text-xs">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-yellow-400 uppercase tracking-widest block">
            REGLA DE JUICIO TÉCNICO:
          </span>
          <p className="text-zinc-200 font-sans-editorial text-xs sm:text-sm leading-relaxed">
            <strong>No declarar "optimización exitosa" solamente porque un número mejoró.</strong>
            <br />
            Si el FPS promedio subió un 3% pero el 1% Low cayó un 20%, el juego ahora es más inestable. Si la RAM libre aumentó pero el disco está al 100%, tu sistema perdió fluidez. Mirá el cuadro completo.
          </p>
        </div>
      </div>

      {/* Tabla Matemática A vs B o Estado 0 Deltas */}
      <div className="space-y-3">
        <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
          DELTAS MATEMÁTICOS REGISTRADOS ({deltas.length}):
        </span>

        {deltas.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-zinc-800 bg-[#12131b]/60 text-center space-y-3 font-mono-tech">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-amber-400 font-bold uppercase text-xs tracking-wider block">
                DELTAS MATEMÁTICOS REGISTRADOS: 0
              </span>
              <p className="font-sans-editorial text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                No existen pares de métricas comparables entre el Estado A y el Estado B. Se requiere haber medido la misma variable cuantitativa en ambos estados para calcular la diferencia matemática.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#12131b]">
            <table className="w-full text-left font-mono-tech text-xs">
              <thead className="bg-black/50 border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4 font-bold">MÉTRICA AUDITADA</th>
                  <th className="p-4 font-bold">ESTADO A (ANTES)</th>
                  <th className="p-4 font-bold">ESTADO B (DESPUÉS)</th>
                  <th className="p-4 font-bold">DELTA ABSOLUTO</th>
                  <th className="p-4 font-bold">DELTA RELATIVO</th>
                  <th className="p-4 font-bold">EVALUACIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {deltas.map((d) => {
                  const isImproved = d.evaluation === 'MEJORÓ';
                  const isWorse = d.evaluation === 'EMPEORÓ';
                  const sign = d.deltaAbsolute > 0 ? '+' : '';

                  return (
                    <tr key={d.key} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span>{d.label}</span>
                        <span className="text-[10px] text-zinc-500 font-normal">({d.unit})</span>
                      </td>
                      <td className="p-4 text-zinc-300">
                        {d.valueA} {d.unit}
                      </td>
                      <td className="p-4 text-white font-bold">
                        {d.valueB} {d.unit}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isImproved ? 'text-emerald-400' : isWorse ? 'text-rose-400' : 'text-zinc-400'
                          }`}
                        >
                          {isImproved && <TrendingUp className="w-3.5 h-3.5" />}
                          {isWorse && <TrendingDown className="w-3.5 h-3.5" />}
                          {!isImproved && !isWorse && <Minus className="w-3.5 h-3.5" />}
                          <span>
                            {sign}
                            {d.deltaAbsolute} {d.unit}
                          </span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            isImproved ? 'text-emerald-400' : isWorse ? 'text-rose-400' : 'text-zinc-400'
                          }`}
                        >
                          {d.deltaPercent !== null ? `${d.deltaPercent > 0 ? '+' : ''}${d.deltaPercent}%` : '—'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isImproved
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isWorse
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {d.evaluation}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Percepción Comparada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
        <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
          <span className="text-zinc-500 uppercase font-bold text-[10px] block">PERCEPCIÓN ESTADO A:</span>
          <span className="text-white font-bold text-sm block">{perceptionA || 'Sin registro'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
          <span className="text-yellow-400 uppercase font-bold text-[10px] block">PERCEPCIÓN ESTADO B:</span>
          <span className={`font-bold text-sm block ${perceptionB ? 'text-white' : 'text-red-400'}`}>
            {perceptionB || 'SIN REGISTRO'}
          </span>
        </div>
      </div>

      {/* Interpretación Técnica Multidimensional */}
      <div className="p-5 rounded-2xl bg-[#11131c] border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <span className="text-yellow-400 uppercase font-bold tracking-wider block">
          INTERPRETACIÓN TÉCNICA DEL EXPERIMENTO:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-emerald-400 font-bold uppercase block">1. LO QUE CAMBIÓ:</label>
            <textarea
              rows={3}
              value={interpretation.whatChanged}
              disabled={isConclusionBlocked}
              onChange={(e) => onChangeInterpretation('whatChanged', e.target.value)}
              placeholder="ej. El 1% Low subió de 85 a 112 FPS (+31%) y los tirones en combate desaparecieron..."
              className="w-full p-2.5 rounded-xl bg-black/50 border border-zinc-700 text-white font-sans-editorial text-xs focus:outline-none focus:border-yellow-400 resize-none disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300 font-bold uppercase block">2. LO QUE NO CAMBIÓ:</label>
            <textarea
              rows={3}
              value={interpretation.whatDidNotChange}
              disabled={isConclusionBlocked}
              onChange={(e) => onChangeInterpretation('whatDidNotChange', e.target.value)}
              placeholder="ej. El FPS promedio se mantuvo casi idéntico (160 vs 163 FPS)..."
              className="w-full p-2.5 rounded-xl bg-black/50 border border-zinc-700 text-white font-sans-editorial text-xs focus:outline-none focus:border-yellow-400 resize-none disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-amber-400 font-bold uppercase block">3. LO QUE AÚN NO SABEMOS:</label>
            <textarea
              rows={3}
              value={interpretation.whatWeStillDoNotKnow}
              disabled={isConclusionBlocked}
              onChange={(e) => onChangeInterpretation('whatWeStillDoNotKnow', e.target.value)}
              placeholder="ej. Si en partidas de 64 jugadores el comportamiento será el mismo que en el mapa de prueba..."
              className="w-full p-2.5 rounded-xl bg-black/50 border border-zinc-700 text-white font-sans-editorial text-xs focus:outline-none focus:border-yellow-400 resize-none disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Selección del Resultado del Experimento */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
            RESULTADO FORMAL DEL ENSAYO: *
          </span>
          {isConclusionBlocked && (
            <span className="text-[11px] font-mono-tech text-red-400 font-bold uppercase tracking-wider">
              [SELECCIÓN BLOQUEADA SIN COMPARACIÓN VÁLIDA]
            </span>
          )}
        </div>

        {isConclusionBlocked && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-mono-tech text-xs">
            ⚠️ No se permite seleccionar ningún resultado formal (Mejoró, Empeoró, etc.) porque no existen pares de métricas cuantitativas válidas o falta la percepción del Estado B.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech">
          {OUTCOME_OPTIONS.map((opt) => {
            const isSelected = outcomeResult === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isConclusionBlocked}
                onClick={() => {
                  if (!isConclusionBlocked) {
                    onChangeOutcomeResult(opt.value);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isConclusionBlocked
                    ? 'opacity-40 cursor-not-allowed bg-zinc-900/30 border-zinc-800/80 text-zinc-600'
                    : isSelected
                    ? 'bg-yellow-400/20 border-yellow-400 text-white shadow-md cursor-pointer'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected && !isConclusionBlocked ? 'text-yellow-400' : 'text-white'}`}>
                    {opt.label}
                  </span>
                  {isSelected && !isConclusionBlocked && <CheckCircle2 className="w-4 h-4 text-yellow-400" />}
                </div>
                <p className="font-sans-editorial text-[11px] text-zinc-400 leading-snug">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pregunta EVO: ¿Valió la pena el cambio? */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-mono-tech text-xs text-yellow-400 uppercase font-bold tracking-wider block">
            PREGUNTA EVO: ¿VALIÓ LA PENA EL CAMBIO? *
          </span>
          {isConclusionBlocked && (
            <span className="text-[11px] font-mono-tech text-zinc-500 uppercase tracking-wider">
              [BLOQUEADO]
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech">
          {DECISION_OPTIONS.map((opt) => {
            const isSelected = userDecision === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isConclusionBlocked}
                onClick={() => {
                  if (!isConclusionBlocked) {
                    onChangeUserDecision(opt.value);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isConclusionBlocked
                    ? 'opacity-40 cursor-not-allowed bg-zinc-900/30 border-zinc-800/80 text-zinc-600'
                    : isSelected
                    ? 'bg-yellow-400/20 border-yellow-400 text-white shadow-md cursor-pointer'
                    : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected && !isConclusionBlocked ? 'text-yellow-400' : 'text-white'}`}>
                    {opt.label}
                  </span>
                  {isSelected && !isConclusionBlocked && <CheckCircle2 className="w-4 h-4 text-yellow-400" />}
                </div>
                <p className="font-sans-editorial text-[11px] text-zinc-400 leading-snug">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manejo de Empeoró o Revertir Cambio */}
      {!isConclusionBlocked && (outcomeResult === 'EMPEORÓ' || userDecision === 'REVERTIR') && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 font-mono-tech text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
            <Undo2 className="w-4 h-4" />
            <span>EL EXPERIMENTO CUMPLIÓ SU PROPÓSITO CIENTÍFICO</span>
          </div>
          <p className="font-sans-editorial text-xs sm:text-sm text-zinc-200 leading-relaxed">
            “Perfecto. El experimento también funcionó. Acabamos de demostrar con evidencia empírica que este cambio no nos conviene en estas condiciones.”
          </p>
          <div className="pt-1 flex items-center justify-between">
            <span className="text-zinc-400 text-[11px]">
              Instrucciones de reversión registradas: <strong>{controlledVariable.howToRevert}</strong>
            </span>
            <button
              type="button"
              onClick={onToggleRevert}
              className={`px-4 py-2 rounded-xl font-bold uppercase cursor-pointer transition-all ${
                isReverted
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700'
              }`}
            >
              {isReverted ? '✓ CAMBIO REVERTIDO Y ASENTADO' : 'CONFIRMAR REVERSIÓN DEL CAMBIO'}
            </button>
          </div>
        </div>
      )}

      {/* Conclusión del Usuario */}
      <div className="space-y-2">
        <label className="font-mono-tech text-xs text-yellow-400 uppercase font-bold block">
          CONCLUSIÓN REFLEXIVA DEL OPERADOR: *
        </label>
        <textarea
          rows={3}
          value={userConclusion}
          disabled={isConclusionBlocked}
          onChange={(e) => onChangeUserConclusion(e.target.value)}
          placeholder={
            isConclusionBlocked
              ? 'Conclusión bloqueada. Se requiere una comparación válida entre A y B para concluir el ensayo.'
              : 'ej. Demostramos que fijar un cap de 144 FPS estabiliza el frametime sin sacrificar respuesta. La mejora real estuvo en el 1% Low y no en el promedio máximo...'
          }
          className="w-full p-4 rounded-xl bg-[#11121a] border border-zinc-700 text-white font-sans-editorial text-sm focus:outline-none focus:border-yellow-400 leading-relaxed resize-none disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <span className="text-[11px] font-mono-tech text-zinc-500 block">
          Redactá tu conclusión basada en evidencia. ({userConclusion.length} caracteres)
        </span>
      </div>

      {/* Accordion Opcional: Registrar Pasadas / Repeticiones Adicionales */}
      <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 font-mono-tech text-xs space-y-2">
        <button
          type="button"
          disabled={isConclusionBlocked}
          onClick={() => setShowTrialsAccordion(!showTrialsAccordion)}
          className="w-full flex items-center justify-between text-zinc-400 hover:text-yellow-400 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2 font-bold uppercase">
            <Repeat className="w-4 h-4" />
            <span>REPETICIONES Y PASADAS ADICIONALES (OPCIONAL)</span>
          </span>
          <span className="text-zinc-500 text-[11px]">
            {showTrialsAccordion ? 'OCULTAR' : `${trials.length} pasadas adicionales`}
          </span>
        </button>

        {showTrialsAccordion && (
          <div className="pt-3 border-t border-zinc-800 space-y-3 font-sans-editorial text-xs text-zinc-400">
            <p>
              En pruebas de alta variabilidad (como partidas online con otros jugadores), realizar 3 pasadas permite calcular una media más robusta. Si tus pruebas fueron sobre un benchmark estático o reposo cerrado, una pasada rigurosa es suficiente.
            </p>
            {trials.length > 0 && (
              <div className="space-y-2 font-mono-tech">
                {trials.map((t) => (
                  <div key={t.trialNumber} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                    Pasada #{t.trialNumber} registrada.
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER A MEDICIÓN B</span>
        </button>

        <button
          type="button"
          onClick={onGenerateReport}
          disabled={!isFormValid || isConclusionBlocked}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${
            isFormValid && !isConclusionBlocked
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-xl hover:shadow-yellow-400/25 cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>GENERAR INFORME DE LABORATORIO EVO 001</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
