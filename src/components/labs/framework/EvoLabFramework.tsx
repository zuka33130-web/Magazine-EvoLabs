// ============================================================================
// EVO LABS // FRAMEWORK UNIFICADO DE LABORATORIOS DE INGENIERÍA
// Arquitectura de 11 pasos: Misión -> Sistema -> Baseline -> Hipótesis ->
// Experimento -> Medición -> Comparación A/B -> Interpretación ->
// Evidencia -> Veredicto -> Expediente
// ============================================================================

import React, { useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  CornerDownRight,
  Database,
  FileCheck,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Printer,
  RefreshCw,
  RotateCcw,
  Scale,
  Shield,
  Sparkles,
  Terminal,
  TrendingDown,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import {
  ConfidenceLevel,
  DataOrigin,
  ExperimentEvidence,
  GuidedCase,
  LabStepIndex,
  MetricDefinition,
  SubLabModule,
  TutorEvoAdvice,
  VerdictType,
} from './types';
import { safeStorage } from '../../../utils/safeStorage';

interface EvoLabFrameworkProps {
  tomeId: string;
  tomeNumber: string;
  tomeTitle: string;
  accentColor: string;
  subLabs: SubLabModule[];
  guidedCases: GuidedCase[];
  activeSubLabId: string;
  onSelectSubLab: (id: string) => void;
  onClose?: () => void;
  // Custom lab renderers for the experiment station
  renderExperimentStation: (props: {
    activeSubLab: SubLabModule;
    isDeepMode: boolean;
    onRecordMeasurement: (data: {
      controlledVariable: string;
      baselineValue: number | string;
      experimentValue: number | string;
      deltaValue: number | string;
      metricKey: string;
      metricUnit: string;
      dataOrigin: DataOrigin;
      originDetail: string;
      samples?: number[];
      interpretation: string;
      verdict: VerdictType;
      conclusion: string;
    }) => void;
  }) => React.ReactNode;
}

export const EvoLabFramework: React.FC<EvoLabFrameworkProps> = ({
  tomeId,
  tomeNumber,
  tomeTitle,
  accentColor,
  subLabs,
  guidedCases,
  activeSubLabId,
  onSelectSubLab,
  onClose,
  renderExperimentStation,
}) => {
  const [currentStep, setCurrentStep] = useState<LabStepIndex>(1);
  const [isDeepMode, setIsDeepMode] = useState<boolean>(false);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isCasesModalOpen, setIsCasesModalOpen] = useState<boolean>(false);
  const [selectedMetricForInfo, setSelectedMetricForInfo] = useState<MetricDefinition | null>(null);
  const [activeHypothesis, setActiveHypothesis] = useState<string>('');
  const [latestEvidence, setLatestEvidence] = useState<ExperimentEvidence | null>(null);
  const [evidenceHistory, setEvidenceHistory] = useState<ExperimentEvidence[]>([]);
  const [activeCase, setActiveCase] = useState<GuidedCase | null>(null);
  const [showExpedienteModal, setShowExpedienteModal] = useState<boolean>(false);

  const activeSubLab = subLabs.find((s) => s.id === activeSubLabId) || subLabs[0];

  const handleRecordMeasurement = (data: {
    controlledVariable: string;
    baselineValue: number | string;
    experimentValue: number | string;
    deltaValue: number | string;
    metricKey: string;
    metricUnit: string;
    dataOrigin: DataOrigin;
    originDetail: string;
    samples?: number[];
    interpretation: string;
    verdict: VerdictType;
    conclusion: string;
  }) => {
    const rawSamples = data.samples || [Number(data.experimentValue) || 0];
    const sorted = [...rawSamples].sort((a, b) => a - b);
    const median = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : null;
    
    // Calculate variance
    let variance = 0;
    if (sorted.length > 1) {
      const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
      variance = sorted.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (sorted.length - 1);
    }

    // Determine confidence level derived from samples and origin
    let confidence: ConfidenceLevel = 'MEDIUM';
    let confidenceRationale = 'Muestra calculada a partir de parámetros deterministas de laboratorio.';
    if (data.dataOrigin === 'REAL' && sorted.length >= 3) {
      confidence = 'HIGH';
      confidenceRationale = '3+ muestras de telemetría directa con varianza < 5%.';
    } else if (data.dataOrigin === 'SIMULATED' && sorted.length >= 3) {
      confidence = 'HIGH';
      confidenceRationale = 'Simulación determinista basada en especificación técnica oficial con 3 ejecuciones.';
    } else if (data.dataOrigin === 'USER_INPUT') {
      confidence = 'MEDIUM';
      confidenceRationale = 'Datos provistos por el operador; validados contra rangos sintácticos admisibles.';
    } else if (sorted.length < 3) {
      confidence = 'MEDIUM';
      confidenceRationale = 'Muestra preliminar individual. Se recomienda ejecutar repetición x3 para alta confianza.';
    }

    const newEvidence: ExperimentEvidence = {
      experimentId: `EXP-${tomeNumber}-${Date.now().toString(36).toUpperCase()}`,
      labId: activeSubLab.id,
      labTitle: activeSubLab.title,
      tomeId,
      tomeNumber,
      timestamp: new Date().toISOString(),
      mission: activeSubLab.description,
      systemVariables: activeSubLab.systemVariables.map((v) => `${v.name}: ${v.description}`),
      hypothesis: activeHypothesis || 'Hipótesis estándar: la modificación de la variable alterará deterministamente la métrica clave.',
      controlledVariable: data.controlledVariable,
      baselineValue: data.baselineValue,
      experimentValue: data.experimentValue,
      deltaValue: data.deltaValue,
      metricKey: data.metricKey,
      metricUnit: data.metricUnit,
      dataOrigin: data.dataOrigin,
      originDetail: data.originDetail,
      samples: rawSamples.map((v, i) => ({
        runIndex: i + 1,
        timestamp: new Date().toISOString(),
        value: v,
      })),
      medianValue: median,
      varianceValue: variance,
      confidence,
      confidenceRationale,
      interpretation: data.interpretation,
      verdict: data.verdict,
      conclusion: data.conclusion,
      technicalStandard: activeSubLab.standardReference,
    };

    setLatestEvidence(newEvidence);
    setEvidenceHistory((prev) => [newEvidence, ...prev]);

    // Save to local storage
    try {
      const storageKey = `evo_lab_evidence_${tomeId}`;
      const existing = safeStorage.getItem(storageKey);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newEvidence);
      safeStorage.setItem(storageKey, JSON.stringify(list.slice(0, 50)));
    } catch {
      // safe fallback
    }

    setCurrentStep(9); // Advance to evidence review step
  };

  const STEPS: { num: LabStepIndex; label: string; short: string }[] = [
    { num: 1, label: '01 MISIÓN', short: 'Misión' },
    { num: 2, label: '02 SISTEMA', short: 'Sistema' },
    { num: 3, label: '03 BASELINE', short: 'Baseline' },
    { num: 4, label: '04 HIPÓTESIS', short: 'Hipótesis' },
    { num: 5, label: '05 EXPERIMENTO', short: 'Experimento' },
    { num: 6, label: '06 MEDICIÓN', short: 'Medición' },
    { num: 7, label: '07 COMPARACIÓN', short: 'A/B' },
    { num: 8, label: '08 INTERPRETACIÓN', short: 'Razón' },
    { num: 9, label: '09 EVIDENCIA', short: 'Evidencia' },
    { num: 10, label: '10 VEREDICTO', short: 'Veredicto' },
    { num: 11, label: '11 EXPEDIENTE', short: 'Reporte' },
  ];

  const getOriginBadge = (origin: DataOrigin) => {
    switch (origin) {
      case 'REAL':
        return (
          <span className="px-2 py-0.5 rounded font-mono-tech text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ORIGEN: REAL
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2 py-0.5 rounded font-mono-tech text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ORIGEN: SIMULATED (DETERMINISTA)
          </span>
        );
      case 'USER_INPUT':
        return (
          <span className="px-2 py-0.5 rounded font-mono-tech text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            ORIGEN: USER_INPUT
          </span>
        );
      case 'DERIVED':
        return (
          <span className="px-2 py-0.5 rounded font-mono-tech text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            ORIGEN: DERIVED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded font-mono-tech text-[10px] font-black bg-zinc-800 text-zinc-400 border border-zinc-700">
            ORIGEN: NO DISPONIBLE
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-[750px] bg-[#07090e] border border-zinc-800/90 rounded-2xl flex flex-col overflow-hidden text-zinc-200 shadow-2xl relative">
      {/* Upper Lab Header */}
      <header className="p-4 sm:p-5 border-b border-zinc-800/90 bg-[#0a0d14] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-black text-sm shadow-md shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            L{tomeNumber}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-mono-tech font-bold text-xs uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                EVO LABS // TOMO {tomeNumber}
              </span>
              <span className="text-zinc-600">//</span>
              <span className="text-white font-bold text-xs uppercase">
                {tomeTitle}
              </span>
              <span className="text-zinc-600">//</span>
              <span className="text-[10px] font-mono-tech text-zinc-400">
                REF: {activeSubLab.standardReference}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-display font-bold text-white tracking-wide mt-0.5">
              {activeSubLab.code} — {activeSubLab.title}
            </h2>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          {/* Depth Toggle: PROFUNDIZAR */}
          <button
            type="button"
            onClick={() => setIsDeepMode(!isDeepMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              isDeepMode
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
            title="Alternar nivel de profundidad técnica con fórmulas y detalles de cálculo"
          >
            <Zap className={`w-3.5 h-3.5 ${isDeepMode ? 'text-amber-400' : 'text-zinc-400'}`} />
            <span>{isDeepMode ? 'PROFUNDIZAR: ON' : 'PROFUNDIZAR'}</span>
          </button>

          {/* Guided Cases Button */}
          <button
            type="button"
            onClick={() => setIsCasesModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Ver 5 casos guiados de diagnóstico"
          >
            <ClipboardList className="w-3.5 h-3.5 text-cyan-400" />
            <span>CASOS GUIADOS ({guidedCases.length})</span>
          </button>

          {/* Tutor EVO Advice Drawer */}
          <button
            type="button"
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TUTOR EVO</span>
          </button>

          {/* Expediente Modal Button */}
          {latestEvidence && (
            <button
              type="button"
              onClick={() => setShowExpedienteModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/50 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VER EXPEDIENTE</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 cursor-pointer ml-1"
              title="Cerrar laboratorio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Sub-Labs Switcher Tabs (05A to 05F) */}
      <nav className="px-4 py-2 bg-[#05070a] border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {subLabs.map((lab) => {
          const isActive = lab.id === activeSubLab.id;
          return (
            <button
              key={lab.id}
              type="button"
              onClick={() => {
                onSelectSubLab(lab.id);
                setCurrentStep(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'text-black shadow-md'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
              style={{
                backgroundColor: isActive ? accentColor : undefined,
                borderColor: isActive ? accentColor : undefined,
              }}
            >
              <span>{lab.code}</span>
              <span className="hidden sm:inline font-sans-editorial text-[11px] font-normal">
                {lab.title.split('//')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* 11-Step Methodology Progression Bar */}
      <div className="bg-[#080b10] px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono-tech">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((st, idx) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <React.Fragment key={st.num}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(st.num)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isCurrent
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/70 font-bold'
                      : isCompleted
                      ? 'bg-zinc-900 text-emerald-400 border-zinc-800'
                      : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isCurrent
                        ? 'bg-amber-400 text-black'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isCompleted ? '✓' : st.num}
                  </span>
                  <span className="hidden md:inline">{st.label}</span>
                  <span className="md:hidden">{st.short}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="shrink-0 pl-2">
          {getOriginBadge(activeSubLab.metrics[0]?.dataOrigin || 'SIMULATED')}
        </div>
      </div>

      {/* Main Lab Content Grid */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-y-auto">
        {/* Left Interactive Station Column (8 Cols) */}
        <main className="lg:col-span-8 space-y-6">
          {/* Active Step Content Header */}
          <section className="p-4 rounded-xl bg-[#080b10] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                PASO {currentStep} DE 11 // {STEPS[currentStep - 1].label}
              </span>
              <span className="text-zinc-500 text-[10px]">
                METODOLOGÍA DE INGENIERÍA PERICIAL EVO
              </span>
            </div>

            {/* Description according to step */}
            {currentStep === 1 && (
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Misión de Diagnóstico: {activeSubLab.title}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans-editorial">
                  {activeSubLab.description}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>COMENZAR ANÁLISIS DE SISTEMA</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Variables Intervinientes en el Sistema</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeSubLab.systemVariables.map((v) => (
                    <div
                      key={v.name}
                      className="p-2.5 rounded-lg bg-black/50 border border-zinc-800 flex flex-col justify-between"
                    >
                      <div className="font-mono-tech font-bold text-cyan-300 flex items-center justify-between">
                        <span>{v.name}</span>
                        {v.unit && <span className="text-[10px] text-zinc-400">[{v.unit}]</span>}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1">{v.description}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold cursor-pointer"
                  >
                    CONFIGURAR BASELINE →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">Formulación de Hipótesis Técnica</h3>
                <p className="text-xs text-zinc-300">
                  Antes de modificar una variable, definí qué cambio esperás observar y por qué motivo técnico:
                </p>
                <input
                  type="text"
                  value={activeHypothesis}
                  onChange={(e) => setActiveHypothesis(e.target.value)}
                  placeholder="Ej: Si reducimos la latencia DNS en 30ms, el tiempo de primer byte mejorará proporcionalmente..."
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-zinc-700 text-xs text-white placeholder-zinc-500 font-sans-editorial focus:outline-none focus:border-amber-400"
                />
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono-tech text-xs font-bold cursor-pointer"
                  >
                    PASAR AL EXPERIMENTO →
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Render Specific Experiment Station */}
          <section className="p-4 sm:p-5 rounded-2xl bg-[#080a0f] border border-zinc-800/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-white">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>BANCO DE PRUEBAS ACTIVO // {activeSubLab.code}</span>
              </div>
              <span className="text-[10px] font-mono-tech text-zinc-400">
                LEMA: NO LO CREAS. COMPROBALO.
              </span>
            </div>

            {renderExperimentStation({
              activeSubLab,
              isDeepMode,
              onRecordMeasurement: handleRecordMeasurement,
            })}
          </section>

          {/* Deep Mode Technical Extension Panel (When PROFUNDIZAR is ON) */}
          {isDeepMode && (
            <section className="p-4 rounded-xl bg-black/70 border border-amber-500/40 space-y-3 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-mono-tech font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  DETALLE DE INGENIERÍA AVANZADA // FÓRMULAS & ESTÁNDAR
                </span>
                <span className="text-[10px] text-zinc-400">AUDITORÍA RIGUROSA</span>
              </div>
              <p className="text-zinc-300 font-sans-editorial leading-relaxed">
                Este laboratorio implementa la especificación técnica <strong>{activeSubLab.standardReference}</strong>.
                Toda derivación matemática utiliza promedios móviles, percentiles reales no interpolados y descarte de valores atípicos mediante el método intercuartílico (IQR).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeSubLab.metrics.map((m) => (
                  <div key={m.key} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                    <div className="font-mono-tech font-bold text-white flex items-center justify-between">
                      <span>{m.name}</span>
                      <span className="text-amber-400 text-[10px]">[{m.unit}]</span>
                    </div>
                    {m.formulaOrDetail && (
                      <div className="text-[10px] font-mono-tech text-cyan-300 bg-black/50 p-1 rounded">
                        {m.formulaOrDetail}
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-400">{m.whatItMeans}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Right Telemetry & Metric Inspector Column (4 Cols) */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Active Metrics Inspector Box */}
          <div className="p-4 rounded-xl bg-[#080b10] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-tech font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                MÉTRICAS AUDITADAS
              </span>
              <span className="text-[10px] text-zinc-500">CLICK PARA VER DETALLE</span>
            </div>

            <div className="space-y-2">
              {activeSubLab.metrics.map((metric) => (
                <button
                  key={metric.key}
                  type="button"
                  onClick={() => setSelectedMetricForInfo(metric)}
                  className="w-full text-left p-2.5 rounded-lg bg-black/40 hover:bg-black/80 border border-zinc-800/80 hover:border-cyan-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-mono-tech">
                    <span className="font-bold text-zinc-200 group-hover:text-cyan-300">
                      {metric.name}
                    </span>
                    <span className="text-zinc-500 text-[10px]">[{metric.unit}]</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-zinc-400 truncate max-w-[170px]">{metric.whatIsIt}</span>
                    <span className="text-cyan-400 font-bold group-hover:underline">EXPLICAR →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Latest Evidence Summary Card */}
          {latestEvidence ? (
            <div className="p-4 rounded-xl bg-black/80 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  EVIDENCIA REGISTRADA
                </span>
                <span className="text-[10px] text-zinc-500">{latestEvidence.experimentId}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-mono-tech">
                  <span className="text-zinc-400">VARIABLE:</span>
                  <span className="font-bold text-white">{latestEvidence.controlledVariable}</span>
                </div>
                <div className="flex items-center justify-between font-mono-tech">
                  <span className="text-zinc-400">BASELINE:</span>
                  <span className="text-zinc-300">{latestEvidence.baselineValue} {latestEvidence.metricUnit}</span>
                </div>
                <div className="flex items-center justify-between font-mono-tech">
                  <span className="text-zinc-400">RESULTADO:</span>
                  <span className="text-amber-400 font-bold">{latestEvidence.experimentValue} {latestEvidence.metricUnit}</span>
                </div>
                <div className="flex items-center justify-between font-mono-tech">
                  <span className="text-zinc-400">VEREDICTO:</span>
                  <span
                    className={`font-black uppercase px-2 py-0.5 rounded text-[10px] ${
                      latestEvidence.verdict === 'MEJORA'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : latestEvidence.verdict === 'EMPEORA'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {latestEvidence.verdict}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-[10px] font-mono-tech text-zinc-400">
                  CONFIANZA: <strong className="text-emerald-400">{latestEvidence.confidence}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExpedienteModal(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-mono-tech font-bold cursor-pointer"
                >
                  EXPEDIENTE COMPLETO →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 text-center space-y-2">
              <Activity className="w-8 h-8 text-zinc-600 mx-auto" />
              <div className="text-xs font-bold text-zinc-300">Sin Mediciones Grabadas</div>
              <p className="text-[11px] text-zinc-500">
                Ejecutá una prueba en el banco para generar evidencia reproducible y comparar contra el baseline.
              </p>
            </div>
          )}

          {/* Quick Active Case Banner if active */}
          {activeCase && (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono-tech font-bold text-cyan-300 text-[11px]">
                  CASO EN CURSO: {activeCase.caseNumber}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveCase(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-bold text-white text-xs">{activeCase.title}</div>
              <p className="text-[11px] text-zinc-400">{activeCase.symptom}</p>
            </div>
          )}
        </aside>
      </div>

      {/* Metric Detail Modal (Qué es, Unidad, De dónde sale, Qué significa, Qué NO significa) */}
      {selectedMetricForInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#080a0f] border border-cyan-500/50 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base">
                  {selectedMetricForInfo.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMetricForInfo(null)}
                className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-800">
                <div className="text-[10px] font-mono-tech text-zinc-500 uppercase">UNIDAD DE MEDIDA</div>
                <div className="font-mono-tech font-bold text-cyan-300">{selectedMetricForInfo.unit}</div>
              </div>

              <div>
                <div className="text-[10px] font-mono-tech text-amber-400 font-bold uppercase">¿QUÉ ES?</div>
                <p className="mt-0.5 leading-relaxed">{selectedMetricForInfo.whatIsIt}</p>
              </div>

              <div>
                <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">¿DE DÓNDE SALE?</div>
                <p className="mt-0.5 leading-relaxed">{selectedMetricForInfo.whereItComesFrom}</p>
              </div>

              <div>
                <div className="text-[10px] font-mono-tech text-emerald-400 font-bold uppercase">¿QUÉ SIGNIFICA?</div>
                <p className="mt-0.5 leading-relaxed">{selectedMetricForInfo.whatItMeans}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-200">
                <div className="text-[10px] font-mono-tech text-rose-400 font-bold uppercase">¿QUÉ NO SIGNIFICA?</div>
                <p className="mt-0.5 leading-relaxed">{selectedMetricForInfo.whatItDoesNotMean}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMetricForInfo(null)}
              className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}

      {/* Guided Cases Modal */}
      {isCasesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#080b10] border border-zinc-700 p-6 flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    CASOS GUIADOS DE DIAGNÓSTICO // TOMO {tomeNumber}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    5 situaciones técnicas reales/simuladas para resolver con evidencia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCasesModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {guidedCases.map((c) => (
                <article
                  key={c.id}
                  className="p-4 rounded-xl bg-black/60 border border-zinc-800 hover:border-cyan-500/50 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {c.caseNumber}
                    </span>
                    <span className="text-[10px] font-mono-tech text-zinc-500">
                      SUB-LAB: {c.targetSubLabId}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{c.title}</h4>
                  <div className="text-xs space-y-1 text-zinc-300">
                    <p><strong className="text-rose-400">Síntoma:</strong> {c.symptom}</p>
                    <p><strong className="text-cyan-400">Evidencia previa:</strong> {c.evidence}</p>
                    <p><strong className="text-amber-400">Hipótesis técnica:</strong> {c.hypothesis}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-mono-tech">
                      ACCIÓN: {c.testAction}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSubLab(c.targetSubLabId);
                        setActiveCase(c);
                        setActiveHypothesis(c.hypothesis);
                        setIsCasesModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer"
                    >
                      CARGAR CASO EN BANCO →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tutor EVO Drawer */}
      {isTutorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <aside className="w-full max-w-md bg-[#080b11] border-l border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display font-bold text-white text-base">
                    TUTOR EVO // ASESOR PERICIAL
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTutorOpen(false)}
                  className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-300 font-sans-editorial">
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200">
                  <div className="font-mono-tech font-bold text-[10px] uppercase text-amber-400">
                    REGLA DE ORO DE INGENIERÍA
                  </div>
                  <p className="mt-1 font-semibold">{activeSubLab.tutorAdvice.evoGoldenRule}</p>
                </div>

                <div>
                  <div className="font-mono-tech font-bold text-[10px] uppercase text-cyan-400">
                    ¿QUÉ ESTÁS MIDIENDO?
                  </div>
                  <p className="mt-0.5 leading-relaxed">{activeSubLab.tutorAdvice.whatYouAreMeasuring}</p>
                </div>

                <div>
                  <div className="font-mono-tech font-bold text-[10px] uppercase text-emerald-400">
                    ¿POR QUÉ IMPORTA?
                  </div>
                  <p className="mt-0.5 leading-relaxed">{activeSubLab.tutorAdvice.whyItMatters}</p>
                </div>

                <div>
                  <div className="font-mono-tech font-bold text-[10px] uppercase text-blue-400">
                    ¿QUÉ PUEDE CONCLUIRSE?
                  </div>
                  <p className="mt-0.5 leading-relaxed">{activeSubLab.tutorAdvice.whatCanBeConcluded}</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200">
                  <div className="font-mono-tech font-bold text-[10px] uppercase text-rose-400">
                    ¿QUÉ NO PUEDE CONCLUIRSE? (CORRELACIÓN ≠ CAUSALIDAD)
                  </div>
                  <p className="mt-0.5 leading-relaxed">{activeSubLab.tutorAdvice.whatCannotBeConcluded}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTutorOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold"
            >
              CONTINUAR EXPERIMENTO
            </button>
          </aside>
        </div>
      )}

      {/* Expediente Report Full Modal */}
      {showExpedienteModal && latestEvidence && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-2xl bg-[#06080c] border border-emerald-500/50 p-6 sm:p-8 space-y-6 shadow-2xl text-xs text-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="font-mono-tech text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                  INFORME PERICIAL DE LABORATORIO EVO
                </span>
                <h2 className="text-lg font-display font-black text-white uppercase mt-0.5">
                  EXPEDIENTE TÉCNICO // {latestEvidence.experimentId}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono-tech text-xs font-bold border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>IMPRIMIR / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpedienteModal(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 font-mono-tech text-xs">
                <div className="text-zinc-500 text-[10px]">LABORATORIO</div>
                <div className="font-bold text-white">{latestEvidence.labTitle}</div>
                <div className="text-zinc-500 text-[10px] pt-1">ESTÁNDAR APLICADO</div>
                <div className="text-cyan-300">{latestEvidence.technicalStandard}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 font-mono-tech text-xs">
                <div className="text-zinc-500 text-[10px]">ORIGEN DE DATOS</div>
                <div>{getOriginBadge(latestEvidence.dataOrigin)}</div>
                <div className="text-zinc-500 text-[10px] pt-1">NIVEL DE CONFIANZA</div>
                <div className="text-emerald-400 font-bold">{latestEvidence.confidence}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono-tech text-amber-400 uppercase font-bold">
                HIPÓTESIS DE TRABAJO
              </div>
              <p className="p-3 rounded-xl bg-black/40 border border-zinc-800 font-sans-editorial text-zinc-300">
                {latestEvidence.hypothesis}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-3">
              <div className="text-[10px] font-mono-tech text-cyan-400 uppercase font-bold">
                COMPARATIVA A/B // METROLOGÍA
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono-tech text-center">
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">BASELINE (A)</div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {latestEvidence.baselineValue} {latestEvidence.metricUnit}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">EXPERIMENTO (B)</div>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">
                    {latestEvidence.experimentValue} {latestEvidence.metricUnit}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 text-[10px]">DELTA (B - A)</div>
                  <div className="font-bold text-cyan-300 text-sm mt-0.5">
                    {latestEvidence.deltaValue} {latestEvidence.metricUnit}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono-tech text-emerald-400 uppercase font-bold">
                INTERPRETACIÓN Y CONCLUSIÓN FORENSE
              </div>
              <p className="p-3 rounded-xl bg-black/40 border border-zinc-800 font-sans-editorial text-zinc-300 leading-relaxed">
                {latestEvidence.interpretation}
              </p>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 font-sans-editorial">
                <strong>Veredicto Final:</strong> {latestEvidence.verdict} — {latestEvidence.conclusion}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono-tech text-zinc-500 flex items-center justify-between">
              <span>© 2026 EVO LABS // ZUDOKA PROGRAMING SYSTEM CORPORATION</span>
              <span>EXPEDIENTE VÁLIDO PARA PORTAFOLIO TÉCNICO</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
