import React, { useState } from 'react';
import {
  X,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  BookmarkPlus,
  HelpCircle,
  Database,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  EvoForensicEngine,
  EvoForensicReport,
  TelemetryProvenance,
  DEFAULT_FORENSIC_CASE_INPUTS,
} from '../../services/evoForensicEngine';

interface EvoForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvoForensicReportModal: React.FC<EvoForensicReportModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<EvoForensicReport>(() => EvoForensicEngine.createFullReport());
  const [activeTab, setActiveTab] = useState<'EVIDENCIA' | 'HIPOTESIS' | 'COMPARACION' | 'INFORME'>('EVIDENCIA');
  const [isSaved, setIsSaved] = useState<boolean>(report.isSavedToMiEvo);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveReport = () => {
    EvoForensicEngine.saveForensicReportToMiEvo(report);
    setIsSaved(true);
    setSaveSuccessMessage('Expediente Pericial guardado exitosamente en MI EVO.');
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const getProvenanceBadge = (provenance: TelemetryProvenance) => {
    switch (provenance) {
      case 'MEASURED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            MEASURED
          </span>
        );
      case 'SYSTEM_REPORTED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            SYSTEM_REPORTED
          </span>
        );
      case 'CALCULATED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            CALCULATED
          </span>
        );
      case 'ESTIMATED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
            ESTIMATED
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            SIMULATED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-zinc-700 text-zinc-300">
            UNKNOWN
          </span>
        );
    }
  };

  const getHypothesisStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMADA
          </span>
        );
      case 'SOSTENIDA':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> SOSTENIDA
          </span>
        );
      case 'DEBILITADA':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> DEBILITADA
          </span>
        );
      case 'DESCARTADA':
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> DESCARTADA
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0e14] border border-cyan-500/30 rounded-2xl shadow-2xl text-zinc-100 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-950/60 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FASE 05 // FORENSIC ENGINE
                </span>
                <span className="text-xs font-mono text-zinc-400">{report.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-wide">{report.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccessMessage && (
          <div className="px-6 py-2 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {saveSuccessMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#080b10] px-6">
          <button
            onClick={() => setActiveTab('EVIDENCIA')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'EVIDENCIA'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4" /> 1. EVIDENCIA Y PROVENANCE
          </button>
          <button
            onClick={() => setActiveTab('HIPOTESIS')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'HIPOTESIS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4" /> 2. MATRIZ DE HIPÓTESIS
          </button>
          <button
            onClick={() => setActiveTab('COMPARACION')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'COMPARACION'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> 3. COMPARACIÓN A/B (ANTES/DESPUÉS)
          </button>
          <button
            onClick={() => setActiveTab('INFORME')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'INFORME'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 4. EXPEDIENTE FINAL
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: EVIDENCIA Y PROVENANCE */}
          {activeTab === 'EVIDENCIA' && (
            <div className="space-y-5">
              {/* Symptom Context Card */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" /> SÍNTOMA REPORTADO
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed font-sans">{report.sintoma.descripcion}</p>
                <div className="text-xs font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <span className="text-zinc-500">Entorno:</span> {report.sintoma.entorno}
                </div>
              </div>

              {/* Evidence Table with Provenance */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Evidencia Técnica Recabada</span>
                  <span className="text-xs text-zinc-400 font-normal">Nivel de Procedencia (Provenance) Requerido</span>
                </h3>

                <div className="space-y-3">
                  {report.evidencia.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-400">{ev.id}</span>
                          <span className="text-xs font-semibold text-zinc-300">{ev.category}</span>
                        </div>
                        {getProvenanceBadge(ev.provenance)}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                        <div className="text-sm font-bold text-white">{ev.label}</div>
                        <div className="text-xs font-mono text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40">
                          {ev.value}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-800/60">
                        {ev.interpretation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MATRIZ DE HIPÓTESIS */}
          {activeTab === 'HIPOTESIS' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>
                  El Motor Forense no declara causas directamente. Evalúa simultáneamente múltiples hipótesis en paralelo,
                  midiendo evidencia a favor y en contra.
                </span>
              </div>

              <div className="space-y-4">
                {report.hipotesis.map((hyp) => (
                  <div
                    key={hyp.id}
                    className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono font-bold text-cyan-400">{hyp.id} // {hyp.domain}</div>
                        <h4 className="text-sm font-bold text-white">{hyp.title}</h4>
                      </div>
                      {getHypothesisStatusBadge(hyp.status)}
                    </div>

                    <p className="text-xs text-zinc-300">{hyp.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Supporting Evidence */}
                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Evidencia a Favor (Sostiene)
                        </div>
                        <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc">
                          {hyp.supportingEvidence.map((ev, i) => (
                            <li key={i}>{ev}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Weakening Evidence */}
                      <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 space-y-1.5">
                        <div className="text-[11px] font-bold text-red-400 uppercase flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5" /> Evidencia en Contra (Debilita)
                        </div>
                        <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc">
                          {hyp.weakeningEvidence.map((ev, i) => (
                            <li key={i}>{ev}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMPARACIÓN A/B (ANTES / DESPUÉS) */}
          {activeTab === 'COMPARACION' && (
            <div className="space-y-6">
              {/* Intervention Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-950 border border-purple-500/30 space-y-2">
                <div className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" /> Intervención Aplicada (Acción Correctiva)
                </div>
                <p className="text-sm text-zinc-100 font-medium">{report.abComparison.queSeCambio}</p>
              </div>

              {/* Baseline vs Post Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase">1% Low FPS</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-mono text-red-400 line-through">
                      {report.abComparison.baselineMetrics.fps1PctLow} FPS
                    </span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {report.abComparison.postInterventionMetrics.fps1PctLow} FPS
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">+300% Fluidez</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase">Latencia DPC</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-mono text-red-400 line-through">
                      {report.abComparison.baselineMetrics.dpcLatencyUs} µs
                    </span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {report.abComparison.postInterventionMetrics.dpcLatencyUs} µs
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">-95% Latencia</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase">Temp CPU (Carga)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-mono text-red-400 line-through">
                      {report.abComparison.baselineMetrics.cpuTempC}°C
                    </span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {report.abComparison.postInterventionMetrics.cpuTempC}°C
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">-21.3°C Térmicos</div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase">Tiempo Arranque</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-mono text-amber-400 line-through">
                      {report.abComparison.baselineMetrics.bootTimeSec}s
                    </span>
                    <ArrowRight className="w-3 h-3 text-zinc-500" />
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {report.abComparison.postInterventionMetrics.bootTimeSec}s
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold">-10.2s Boot</div>
                </div>
              </div>

              {/* Qualitative Categories: Que mejoró, Que empeoró, Que quedó igual */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Qué Mejoró
                  </div>
                  <ul className="text-xs text-zinc-200 space-y-1 pl-4 list-disc">
                    {report.abComparison.queMejoro.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Qué Quedó Igual (Variables Constantes)
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1 pl-4 list-disc">
                    {report.abComparison.queQuedoIgual.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPEDIENTE FINAL */}
          {activeTab === 'INFORME' && (
            <div className="space-y-6">
              {/* Confidence Score Badge */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-zinc-900 to-zinc-950 border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase">Nivel de Confianza Pericial</div>
                  <h3 className="text-xl font-bold text-white">Causa Raíz Verificada al {report.confidenceScore}%</h3>
                  <p className="text-xs text-zinc-400">Basado en datos medidos directamente e intervenciones A/B reproducibles.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-mono font-extrabold text-cyan-400">{report.confidenceScore}%</span>
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
              </div>

              {/* Conclusion & Technical Diagnosis */}
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Causa Raíz y Diagnóstico Técnico
                </h4>
                <div className="text-sm font-bold text-amber-300">{report.conclusion.causaRaizIdentificada}</div>
                <p className="text-xs text-zinc-200 leading-relaxed">{report.conclusion.diagnosticoTecnico}</p>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 italic">
                  "{report.conclusion.justificacionPericial}"
                </div>
              </div>

              {/* Remediation & Future Prevention */}
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Recomendación de Remediación e Ingeniería
                </h4>
                <div className="text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
                  {report.recomendacion.accionRemediacion}
                </div>
                <div className="pt-2 border-t border-zinc-800/80 text-xs text-zinc-400">
                  <span className="font-bold text-zinc-300">Prevención Futura:</span> {report.recomendacion.prevencionFutura}
                </div>
              </div>

              {/* Unknown Variables List */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-2">
                <div className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-zinc-500" /> Variables No Observadas / Inciertas (UNKNOWN)
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 pl-4 list-disc">
                  {report.unknownVariables.map((unk, idx) => (
                    <li key={idx}>{unk}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Save to MI EVO CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#080b10] border-t border-zinc-800">
          <div className="text-xs text-zinc-400">
            Estado de Expediente: {isSaved ? (
              <span className="text-emerald-400 font-bold">REGISTRADO EN MI EVO</span>
            ) : (
              <span className="text-amber-400 font-bold">PENDIENTE DE GUARDAR</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Cerrar
            </button>

            <button
              onClick={handleSaveReport}
              disabled={isSaved}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/20'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              {isSaved ? 'EXPEDIENTE GUARDADO EN MI EVO' : 'GUARDAR EN MI EVO (REGISTRAR EXPEDIENTE)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
