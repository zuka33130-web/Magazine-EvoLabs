import React, { useState } from 'react';
import {
  DiagnosticCase,
  DiagnosticFinalOutcomeStatus,
} from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface CloseInvestigationStationProps {
  diagnosticCase: DiagnosticCase;
  onCloseInvestigation: (
    finalOutcome: DiagnosticFinalOutcomeStatus,
    interventionData?: {
      hadIntervention: boolean;
      beforeState?: string;
      changeApplied?: string;
      afterState?: string;
      retestResult?: string;
      closingReason?: string;
    }
  ) => void;
  hasRecordedAtLeastOneTest: boolean;
}

export const VALID_FINAL_OUTCOMES: Array<{
  value: DiagnosticFinalOutcomeStatus;
  label: string;
  badge: string;
  desc: string;
}> = [
  {
    value: 'RESUELTO',
    label: 'RESUELTO',
    badge: 'Falla solucionada',
    desc: 'La anomalía desapareció por completo tras verificar y resolver la causa raíz.',
  },
  {
    value: 'MEJORÓ',
    label: 'MEJORÓ',
    badge: 'Mejora parcial',
    desc: 'Disminuyó la frecuencia o gravedad del síntoma de manera medible.',
  },
  {
    value: 'SIN_CAMBIOS',
    label: 'SIN CAMBIOS',
    badge: 'Causa descartada',
    desc: 'El síntoma persiste idéntico. La hipótesis testeada no era la causa primaria.',
  },
  {
    value: 'EMPEORÓ',
    label: 'EMPEORÓ',
    badge: 'Inestabilidad',
    desc: 'El cambio introdujo inestabilidad y debe revertirse de inmediato según protocolo.',
  },
  {
    value: 'CAUSA_PROBABLE',
    label: 'CAUSA PROBABLE',
    badge: 'Alta correlación',
    desc: 'Se identificó con fuerte respaldo técnico el subsistema causante.',
  },
  {
    value: 'DOS_HIPOTESIS_PRINCIPALES',
    label: 'DOS HIPÓTESIS PRINCIPALES',
    badge: 'Abanico acotado',
    desc: 'Se descartaron variables secundarias y el foco quedó acotado a dos componentes específicos.',
  },
  {
    value: 'MULTIFACTORIAL',
    label: 'MULTIFACTORIAL',
    badge: 'Múltiples factores',
    desc: 'Concurrencia de varios factores simultáneos (ej. temperatura + fondo + driver).',
  },
  {
    value: 'NO_REPRODUCIDO',
    label: 'NO REPRODUCIDO',
    badge: 'Sin manifestación',
    desc: 'La condición de falla no volvió a manifestarse bajo pruebas controladas.',
  },
  {
    value: 'EVIDENCIA_INSUFICIENTE',
    label: 'EVIDENCIA INSUFICIENTE',
    badge: 'Sin datos concluyentes',
    desc: 'Los datos obtenidos no permiten aislar la causa con rigor científico suficiente.',
  },
  {
    value: 'REQUIERE_DIAGNOSTICO_ADICIONAL',
    label: 'REQUIERE DIAGNÓSTICO ADICIONAL',
    badge: 'Taller avanzado',
    desc: 'Es necesario instrumental de taller físico o pruebas de estrés prolongadas.',
  },
];

const PRESET_MOTIVES = [
  'EVIDENCIA INSUFICIENTE. No se realizó ninguna intervención.',
  'NO REPRODUCIDO. No se intervino al no manifestarse la falla en las pruebas de estrés.',
  'CAUSA PROBABLE IDENTIFICADA. Requiere reemplazo de hardware no disponible en el laboratorio.',
  'DOS HIPÓTESIS PRINCIPALES. Se requiere instrumental físico de taller antes de intervenir.',
];

export const CloseInvestigationStation: React.FC<CloseInvestigationStationProps> = ({
  diagnosticCase,
  onCloseInvestigation,
  hasRecordedAtLeastOneTest,
}) => {
  const [selectedOutcome, setSelectedOutcome] = useState<DiagnosticFinalOutcomeStatus | null>(null);
  const [hadIntervention, setHadIntervention] = useState<boolean>(false);

  // Intervention fields
  const [beforeState, setBeforeState] = useState<string>(
    diagnosticCase.intervention?.beforeState || ''
  );
  const [changeApplied, setChangeApplied] = useState<string>(
    diagnosticCase.intervention?.afterState || diagnosticCase.intervention?.whatToChange || ''
  );
  const [afterState, setAfterState] = useState<string>(
    diagnosticCase.intervention?.afterState || ''
  );
  const [retestResult, setRetestResult] = useState<string>(
    diagnosticCase.intervention?.retestResult || ''
  );

  // Non-intervention reason
  const [closingReason, setClosingReason] = useState<string>(
    'EVIDENCIA INSUFICIENTE. No se realizó ninguna intervención.'
  );

  // Validation
  const isInterventionValid =
    !hadIntervention ||
    (beforeState.trim().length > 0 &&
      changeApplied.trim().length > 0 &&
      afterState.trim().length > 0 &&
      retestResult.trim().length > 0);

  const isNoInterventionValid = hadIntervention || closingReason.trim().length > 0;

  const canSubmit =
    hasRecordedAtLeastOneTest &&
    selectedOutcome !== null &&
    isInterventionValid &&
    isNoInterventionValid;

  const handleSubmit = () => {
    if (!canSubmit || !selectedOutcome) return;

    onCloseInvestigation(selectedOutcome, {
      hadIntervention,
      beforeState: hadIntervention ? beforeState.trim() : undefined,
      changeApplied: hadIntervention ? changeApplied.trim() : undefined,
      afterState: hadIntervention ? afterState.trim() : undefined,
      retestResult: hadIntervention ? retestResult.trim() : undefined,
      closingReason: hadIntervention ? undefined : closingReason.trim(),
    });
  };

  // Completed tests list
  const completedTests = diagnosticCase.tests.filter((t) => Boolean(t.outcomeAnswer));

  return (
    <section
      id="seccion-cerrar-investigacion"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border-2 border-yellow-400/70 shadow-2xl space-y-7 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">FASE FINAL // TALLER EVO</span>
          <span>•</span>
          <span>CERRAR INVESTIGACIÓN</span>
        </div>
        <h3 className="font-display font-black text-xl sm:text-3xl uppercase tracking-tight text-white">
          ¿QUÉ PODEMOS CONCLUIR CON LA EVIDENCIA ACTUAL?
        </h3>
        <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
          En EVO LABS no cerramos un caso con suposiciones ni intuiciones. Evaluá los resultados
          obtenidos en las pruebas objetivas y formalizá la conclusión técnica sustentada por los hechos.
        </p>
      </div>

      {/* Precondition Notice if no tests recorded */}
      {!hasRecordedAtLeastOneTest && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-300 font-mono-tech text-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <p className="font-sans-editorial leading-relaxed">
            <strong>Requisito pericial previo:</strong> Para poder cerrar la investigación y
            generar el expediente definitivo es obligatorio haber completado al menos 1 prueba real
            y registrado su resultado.
          </p>
        </div>
      )}

      {/* Summary of Evidence Acquired */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-3 font-mono-tech text-xs">
        <span className="text-zinc-400 font-bold uppercase tracking-wider block text-[11px]">
          EVIDENCIA RECOLECTADA HASTA EL MOMENTO:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-emerald-400 font-bold block text-[10px]">
              PRUEBAS EJECUTADAS CON RESULTADO ({completedTests.length}):
            </span>
            {completedTests.length > 0 ? (
              <ul className="space-y-1 text-zinc-300">
                {completedTests.map((t, idx) => (
                  <li key={t.id} className="p-2 rounded bg-zinc-900/60 border border-zinc-800/80">
                    <span className="text-white font-bold block">
                      {idx + 1}. {t.title}
                    </span>
                    <span className="text-emerald-400 block text-[11px]">
                      Resultado: {t.outcomeAnswer}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 italic">Sin pruebas registradas aún.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-sky-400 font-bold block text-[10px]">
              HIPÓTESIS BAJO EVALUACIÓN:
            </span>
            <ul className="space-y-1 text-zinc-300">
              {diagnosticCase.hypotheses.slice(0, 4).map((h) => (
                <li
                  key={h.id}
                  className="flex items-center justify-between p-1.5 rounded bg-zinc-900/40 border border-zinc-800 text-[11px]"
                >
                  <span className={h.status === 'DESCARTADA_PARA_ESTE_CASO' ? 'line-through text-zinc-500' : 'text-zinc-200'}>
                    {h.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      h.status === 'INDICIO_FUERTE'
                        ? 'text-amber-400'
                        : h.status === 'DESCARTADA_PARA_ESTE_CASO'
                        ? 'text-zinc-500'
                        : 'text-yellow-400'
                    }`}
                  >
                    {h.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* STEP 1: VALID FINAL OUTCOMES */}
      <div className="space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-yellow-400 uppercase tracking-wider block text-xs">
            1. SELECCIONÁ EL ESTADO FINAL DEL CASO // SÓLO DICTÁMENES VÁLIDOS:
          </span>
          <span className="text-[10px] text-zinc-400">
            * 'INVESTIGANDO' no es un estado final
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VALID_FINAL_OUTCOMES.map((opt) => {
            const isSelected = selectedOutcome === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedOutcome(opt.value)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg scale-[1.01]'
                    : 'bg-black/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs uppercase">{opt.label}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-mono-tech uppercase font-bold ${
                      isSelected
                        ? 'bg-black/20 text-black'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {opt.badge}
                  </span>
                </div>
                <p
                  className={`text-[11px] font-sans-editorial leading-tight ${
                    isSelected ? 'text-black/85' : 'text-zinc-400'
                  }`}
                >
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: INTERVENTION SELECTION */}
      <div className="space-y-4 pt-2 border-t border-zinc-800">
        <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-wider block">
          2. ¿SE REALIZÓ UNA INTERVENCIÓN EN EL EQUIPO?
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => setHadIntervention(false)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              !hadIntervention
                ? 'bg-zinc-800 border-yellow-400 text-white shadow-md'
                : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="block font-bold text-xs uppercase mb-1 text-yellow-400">
              NO HUBO INTERVENCIÓN FÍSICA / CAMBIO
            </span>
            <p className="text-[11px] font-sans-editorial text-zinc-300 leading-relaxed">
              El diagnóstico se concluye con la observación y pruebas previas (ej. evidencia
              insuficiente, no reproducido, o causa identificada para derivación).
            </p>
          </button>

          <button
            type="button"
            onClick={() => setHadIntervention(true)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              hadIntervention
                ? 'bg-zinc-800 border-yellow-400 text-white shadow-md'
                : 'bg-black/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="block font-bold text-xs uppercase mb-1 text-emerald-400">
              SÍ, REALICÉ UNA INTERVENCIÓN CONTROLADA
            </span>
            <p className="text-[11px] font-sans-editorial text-zinc-300 leading-relaxed">
              Se modificó UNA variable técnica (ej. driver, pasta, configuración) y se verificó con
              retest el método científico: ANTES → CAMBIO → DESPUÉS → RETEST.
            </p>
          </button>
        </div>

        {/* IF NO INTERVENTION: REQUIRE MOTIVE */}
        {!hadIntervention && (
          <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-3 font-mono-tech text-xs">
            <span className="text-zinc-300 font-bold uppercase text-[11px] block">
              REGISTRO DEL MOTIVO DEL CIERRE SIN INTERVENCIÓN:
            </span>

            <div className="flex flex-wrap gap-2">
              {PRESET_MOTIVES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setClosingReason(m)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] border transition-colors cursor-pointer text-left ${
                    closingReason === m
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 font-bold'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              value={closingReason}
              onChange={(e) => setClosingReason(e.target.value)}
              rows={2}
              placeholder="Describí el motivo por el cual no se ejecutó ninguna modificación técnica..."
              className="w-full bg-black/60 border border-zinc-700 rounded-xl p-3 text-white text-xs font-sans-editorial focus:outline-none focus:border-yellow-400"
            />
          </div>
        )}

        {/* IF HAD INTERVENTION: REQUIRE ANTES, CAMBIO, DESPUÉS, RETEST */}
        {hadIntervention && (
          <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/40 space-y-4 font-mono-tech text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-xs">
                MÉTODO CIENTÍFICO // ANTES → CAMBIO → DESPUÉS → RETEST:
              </span>
              <span className="text-[10px] text-zinc-400">
                Los 4 campos son obligatorios
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-zinc-400 block text-[10px] font-bold uppercase">
                  1. ANTES (SÍNTOMA O ESTADO PREVIO)
                </span>
                <input
                  type="text"
                  value={beforeState}
                  onChange={(e) => setBeforeState(e.target.value)}
                  placeholder="Ej. Tirones cada 40s a 88°C / Reinicio a los 20 min..."
                  className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-yellow-400 block text-[10px] font-bold uppercase">
                  2. CAMBIO (VARIABLE ÚNICA MODIFICADA)
                </span>
                <input
                  type="text"
                  value={changeApplied}
                  onChange={(e) => setChangeApplied(e.target.value)}
                  placeholder="Ej. Cambio de pasta térmica / Desinstalé software en segundo plano..."
                  className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-sky-400 block text-[10px] font-bold uppercase">
                  3. DESPUÉS (ESTADO INMEDIATO POST-CAMBIO)
                </span>
                <input
                  type="text"
                  value={afterState}
                  onChange={(e) => setAfterState(e.target.value)}
                  placeholder="Ej. Máquina encendió normal / Temperatura bajó a 68°C..."
                  className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1.5">
                <span className="text-emerald-400 block text-[10px] font-bold uppercase">
                  4. RETEST (VERIFICACIÓN BAJO MISMA CARGA)
                </span>
                <input
                  type="text"
                  value={retestResult}
                  onChange={(e) => setRetestResult(e.target.value)}
                  placeholder="Ej. 40 min misma partida: cadencia estable y sin reinicios..."
                  className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FINAL BUTTON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        <div className="text-zinc-400 text-xs font-mono-tech">
          {selectedOutcome ? (
            <span>
              Dictamen a registrar:{' '}
              <strong className="text-yellow-400">{selectedOutcome}</strong>
            </span>
          ) : (
            <span className="text-zinc-500">
              Seleccioná un estado final para habilitar el cierre.
            </span>
          )}
        </div>

        <button
          type="button"
          id="btn-cerrar-investigacion-y-generar-expediente"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`w-full sm:w-auto px-8 py-4 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
            canSubmit
              ? 'bg-yellow-400 hover:bg-yellow-300 text-black hover:shadow-yellow-400/20'
              : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>CERRAR INVESTIGACIÓN Y GENERAR EXPEDIENTE</span>
        </button>
      </div>
    </section>
  );
};
