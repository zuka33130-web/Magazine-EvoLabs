import React, { useState } from 'react';
import { DiagnosticCase, UserPcSpec } from '../../types';
import { X, Download, Copy, Check, FileText, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DiagnosticExpedienteModalProps {
  diagnosticCase: DiagnosticCase;
  specs: Partial<UserPcSpec>;
  onClose: () => void;
}

export const DiagnosticExpedienteModal: React.FC<DiagnosticExpedienteModalProps> = ({
  diagnosticCase,
  specs,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Text report generation
  const isCompleted = Boolean(diagnosticCase.completed && diagnosticCase.status !== 'INVESTIGANDO');
  const caseStatus = isCompleted ? (diagnosticCase.status || diagnosticCase.finalOutcome) : 'INVESTIGANDO';

  const generateTextReport = () => {
    const activeHyp = diagnosticCase.hypotheses.filter(
      (h) => h.status !== 'DESCARTADA_PARA_ESTE_CASO' && h.status !== 'NO_EVALUABLE'
    );
    const discardedHyp = diagnosticCase.hypotheses.filter(
      (h) => h.status === 'DESCARTADA_PARA_ESTE_CASO'
    );

    const docTitle = isCompleted
      ? 'EXPEDIENTE DE DIAGNÓSTICO EVO 001'
      : 'EXPEDIENTE DE DIAGNÓSTICO (PARCIAL)';

    return `======================================================================
EVO LABS // ${docTitle}
SISTEMA CENTRAL: EVO DIAGNOSTIC // TALLER EVO
======================================================================
ID DE CASO:           ${diagnosticCase.id}
FECHA DE REGISTRO:    ${diagnosticCase.createdAt}
ÚLTIMA ACTUALIZACIÓN: ${diagnosticCase.updatedAt}
${isCompleted && diagnosticCase.closedAt ? `FECHA DE CIERRE:      ${diagnosticCase.closedAt}\n` : ''}ESTADO DEL CASO:      ${caseStatus} ${!isCompleted ? '(EN CURSO)' : ''}
${diagnosticCase.closingReason ? `MOTIVO DE CIERRE:     ${diagnosticCase.closingReason}\n` : ''}
----------------------------------------------------------------------
1. DESCRIPCIÓN ORIGINAL DEL USUARIO
----------------------------------------------------------------------
“${diagnosticCase.rawDescription}”

----------------------------------------------------------------------
2. INTERPRETACIÓN TÉCNICA EVO
----------------------------------------------------------------------
SÍNTOMA:  ${diagnosticCase.interpreted.symptom}
CONTEXTO: ${diagnosticCase.interpreted.context}
PATRÓN:   ${diagnosticCase.interpreted.pattern}
CAUSA:    ${diagnosticCase.interpreted.cause}

HECHOS DECLARADOS (EXTRAÍDOS DEL TEXTO):
${diagnosticCase.interpreted.declaredFacts?.map((f) => ` - ${f}`).join('\n') || ' - Sin hechos específicos declarados.'}

DATOS QUE TODAVÍA NO SABEMOS (INCÓGNITAS A MEDIR):
${diagnosticCase.interpreted.unknownData?.map((u) => ` - ${u}`).join('\n') || ' - Sin incógnitas adicionales.'}

REGLA DE ORO EVO: SÍNTOMA ≠ CAUSA
No cambiamos piezas sin tener razones demostradas para sospechar de ellas.

----------------------------------------------------------------------
3. HARDWARE DE BASE (PASAPORTE EVO C01)
----------------------------------------------------------------------
CPU:             ${specs.cpu || 'No registrado'}
RAM:             ${specs.ram || 'No registrado'}
GPU:             ${specs.gpu || 'No registrado'}
ALMACENAMIENTO:  ${specs.storage || 'No registrado'}

----------------------------------------------------------------------
4. RECORRIDO DE PREGUNTAS Y EVIDENCIA OBSERVADA
----------------------------------------------------------------------
${diagnosticCase.answers.length ? diagnosticCase.answers.map((a, i) => `[P${i + 1}] ${a.questionText}\n     RESPUESTA: ${a.answerText}`).join('\n\n') : ' - Sin preguntas respondidas aún.'}

----------------------------------------------------------------------
5. MAPA DE HIPÓTESIS
----------------------------------------------------------------------
HIPÓTESIS ACTIVAS:
${activeHyp.length ? activeHyp.map((h) => ` - [${h.status}] ${h.label} (${h.componentCategory})`).join('\n') : ' - Ninguna hipótesis activa.'}

HIPÓTESIS DESCARTADAS:
${discardedHyp.length ? discardedHyp.map((h) => ` - [DESCARTADA] ${h.label}`).join('\n') : ' - Ninguna descartada formalmente aún.'}

----------------------------------------------------------------------
6. PRUEBAS TÉCNICAS EJECUTADAS
----------------------------------------------------------------------
${diagnosticCase.tests.map((t, i) => `[PRUEBA ${i + 1}] ${t.title}
   OBJETIVO:  ${t.goal}
   RESULTADO: ${t.outcomeAnswer || 'Sin registro'}
   DETALLE:   ${t.evidenceNote || 'Completado sin anomalías'}
   COMANDO:   ${t.technicalCommand || 'Prueba física/visual'}`).join('\n\n')}

----------------------------------------------------------------------
7. INTERVENCIÓN CONTROLADA Y RETEST
----------------------------------------------------------------------
${diagnosticCase.intervention?.executed ? `CAMBIO PROPUESTO:   ${diagnosticCase.intervention.whatToChange || 'Aplicado'}
FUNDAMENTO:         ${diagnosticCase.intervention.why || 'N/A'}
EVIDENCIA DE APOYO: ${diagnosticCase.intervention.backingEvidence || 'N/A'}
RIESGO / REVERSIBLE:${diagnosticCase.intervention.riskLevel || 'N/A'} / ${diagnosticCase.intervention.reversible ? 'SÍ' : 'NO'}
1. ANTES:           ${diagnosticCase.intervention.beforeState || 'N/A'}
2. CAMBIO:          ${diagnosticCase.intervention.afterState || diagnosticCase.intervention.whatToChange || 'N/A'}
3. DESPUÉS/RETEST:  ${diagnosticCase.intervention.retestResult || diagnosticCase.intervention.retestCondition || 'N/A'}` : `INTERVENCIÓN: No se realizó ninguna intervención física ni cambio de configuración.
MOTIVO:       ${diagnosticCase.closingReason || (isCompleted ? 'Caso cerrado con evidencia recopilada sin intervención.' : 'Investigación técnica en curso.')}`}

----------------------------------------------------------------------
8. CONCLUSIÓN TÉCNICA DEL CASO
----------------------------------------------------------------------
- QUÉ SABÍAMOS AL EMPEZAR: El usuario reportó ${diagnosticCase.interpreted.symptom.toLowerCase()}
- QUÉ DESCUBRIMOS:         ${diagnosticCase.tests.find((t) => t.outcomeAnswer)?.outcomeAnswer || 'Comportamiento en evaluación'}
- QUÉ DESCARTAMOS:         ${discardedHyp.length} hipótesis descartadas con fundamento
- QUÉ CAMBIAMOS:           ${diagnosticCase.intervention?.executed ? diagnosticCase.intervention.whatToChange : 'Sin intervención previa'}
- QUÉ PASÓ DESPUÉS:        ${caseStatus}

======================================================================
EVO LABS V2 // METODOLOGÍA CIENTÍFICA APLICADA AL HARDWARE DE PC
======================================================================`;
  };

  const handleDownloadTxt = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isCompleted
      ? `EXPEDIENTE_DIAGNOSTICO_EVO_${diagnosticCase.id}.txt`
      : `EXPEDIENTE_PARCIAL_DIAGNOSTICO_${diagnosticCase.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonObj = {
      schemaVersion: 1,
      artifact: isCompleted ? 'EXPEDIENTE_DE_DIAGNOSTICO_EVO_001' : 'EXPEDIENTE_PARCIAL_DIAGNOSTICO',
      generatedAt: new Date().toISOString(),
      caseData: diagnosticCase,
      hardwareBase: specs,
    };
    const blob = new Blob([JSON.stringify(jsonObj, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EXPEDIENTE_DIAGNOSTICO_EVO_${diagnosticCase.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTextReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        id="modal-expediente-diagnostico-evo-001"
        className="max-w-4xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-[#0d0e14] border border-yellow-400/50 shadow-2xl overflow-hidden text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-black/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isCompleted ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' : 'bg-amber-400/10 border-amber-400/30 text-amber-400'}`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className={`font-mono-tech text-[10px] uppercase tracking-widest block font-bold ${isCompleted ? 'text-yellow-400' : 'text-amber-400'}`}>
                {isCompleted ? 'ARTEFACTO OFICIAL // TOMO 01 // CAPÍTULO 06' : 'EXPEDIENTE PARCIAL // INVESTIGACIÓN EN CURSO'}
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                {isCompleted ? 'EXPEDIENTE DE DIAGNÓSTICO EVO 001' : 'EXPEDIENTE DE DIAGNÓSTICO'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-zinc-950/80 border-b border-zinc-800/80 font-mono-tech text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 uppercase">CASO:</span>
            <span className="text-yellow-400 font-bold">{diagnosticCase.id}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 uppercase">ESTADO:</span>
            <span className={`font-bold uppercase ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
              {caseStatus}
            </span>
            {!isCompleted && (
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded ml-1">
                PARCIAL
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar TXT</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-yellow-400 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Scrollable Dossier View */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono-tech text-xs text-zinc-300">
          {/* Section: Resumen pericial */}
          <div className="p-5 rounded-2xl bg-black/60 border border-zinc-800 space-y-3">
            <span className="text-yellow-400 font-bold uppercase text-[11px] block tracking-wider">
              1. RESUMEN DEL CASO // DIAGNÓSTICO METÓDICO
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">PROBLEMA PLANTEADO</span>
                <p className="text-white italic">“{diagnosticCase.rawDescription}”</p>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">SÍNTOMA IDENTIFICADO</span>
                <p className="text-zinc-200 font-bold">{diagnosticCase.interpreted.symptom}</p>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">CONTEXTO & PATRÓN</span>
                <p className="text-zinc-300">{diagnosticCase.interpreted.context} / {diagnosticCase.interpreted.pattern}</p>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">{isCompleted ? 'ESTADO FINAL ALCANZADO' : 'ESTADO DE INVESTIGACIÓN'}</span>
                <p className={`font-black ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {caseStatus} {!isCompleted ? '(EN CURSO)' : ''}
                </p>
              </div>
            </div>

            {/* Hechos y Desconocidos en Expediente */}
            {((diagnosticCase.interpreted.declaredFacts && diagnosticCase.interpreted.declaredFacts.length > 0) ||
              (diagnosticCase.interpreted.unknownData && diagnosticCase.interpreted.unknownData.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80 text-[11px]">
                <div className="space-y-1">
                  <span className="text-emerald-400 font-bold block text-[10px] uppercase">HECHOS DECLARADOS:</span>
                  <ul className="space-y-0.5 text-zinc-300">
                    {diagnosticCase.interpreted.declaredFacts?.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <span className="text-amber-400 font-bold block text-[10px] uppercase">INCÓGNITAS TÉCNICAS A MEDIR:</span>
                  <ul className="space-y-0.5 text-zinc-300">
                    {diagnosticCase.interpreted.unknownData?.map((u, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">?</span>
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section: Pruebas y descartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
              <span className="text-emerald-400 font-bold uppercase text-[11px] block">
                PRUEBAS REALIZADAS ({diagnosticCase.tests.length})
              </span>
              <div className="space-y-2">
                {diagnosticCase.tests.map((t, i) => (
                  <div key={t.id} className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80 text-[11px] space-y-1">
                    <span className="text-white font-bold block">{i + 1}. {t.title}</span>
                    <p className="text-zinc-400">{t.outcomeAnswer || 'Observación registrada'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
              <span className="text-sky-400 font-bold uppercase text-[11px] block">
                MAPA DE HIPÓTESIS Y DESCARTES
              </span>
              <div className="space-y-1.5">
                {diagnosticCase.hypotheses.map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-800 text-[11px]">
                    <span className={h.status === 'DESCARTADA_PARA_ESTE_CASO' ? 'line-through text-zinc-500' : 'text-zinc-200'}>
                      {h.label}
                    </span>
                    <span className={`text-[10px] font-bold ${h.status === 'INDICIO_FUERTE' ? 'text-amber-400' : h.status === 'DESCARTADA_PARA_ESTE_CASO' ? 'text-zinc-500' : 'text-yellow-400'}`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Intervención */}
          <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-2 text-xs">
            <span className="text-yellow-400 font-bold uppercase text-[11px] block">
              INTERVENCIÓN CONTROLADA & RETEST
            </span>
            {diagnosticCase.intervention?.executed ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">VARIABLE MODIFICADA</span>
                  <span className="text-white font-semibold">{diagnosticCase.intervention.whatToChange}</span>
                </div>
                <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">FUNDAMENTO</span>
                  <span className="text-zinc-300">{diagnosticCase.intervention.why}</span>
                </div>
                <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">RESULTADO RETEST</span>
                  <span className="text-emerald-400 font-bold">{diagnosticCase.intervention.retestResult || 'Verificado bajo misma carga'}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                <span className="text-zinc-400 block text-[10px] font-bold uppercase">ESTADO DE INTERVENCIÓN</span>
                <p className="italic">
                  No se realizó ninguna intervención física ni cambio de configuración.
                </p>
                {diagnosticCase.closingReason && (
                  <p className="text-yellow-400 font-semibold pt-1">
                    Motivo registrado: “{diagnosticCase.closingReason}”
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-black/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            CERRAR EXPEDIENTE
          </button>
        </div>
      </div>
    </div>
  );
};
