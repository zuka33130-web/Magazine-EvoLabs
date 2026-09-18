import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Award,
  CheckCircle2,
  FileCheck2,
  RotateCcw,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import {
  UserPcSpec,
  AbExperimentObjective,
  AbPerception,
  AbControlledVariable,
  AbOutcomeResult,
  AbUserDecision,
  AbMetricSnapshot,
  AbExperimentTrial,
  AbLaboratoryReport,
  Tome01DossierSummary,
  AbExperimentConditions,
} from '../types';
import { OBJECTIVE_PRESETS, calculateMetricDeltas } from './chapter07/abExperimentKnowledge';
import { InheritedEvidenceTracker } from './chapter07/InheritedEvidenceTracker';
import { Phase01ObjectiveStation } from './chapter07/Phase01ObjectiveStation';
import { Phase02HypothesisStation } from './chapter07/Phase02HypothesisStation';
import { Phase03ConditionsStation } from './chapter07/Phase03ConditionsStation';
import { Phase04MeasurementAStation } from './chapter07/Phase04MeasurementAStation';
import { Phase05ControlledChangeStation } from './chapter07/Phase05ControlledChangeStation';
import { Phase06MeasurementBStation } from './chapter07/Phase06MeasurementBStation';
import { Phase07ComparisonStation } from './chapter07/Phase07ComparisonStation';
import { LaboratoryReportModal } from './chapter07/LaboratoryReportModal';
import { Tome01DossierView } from './chapter07/Tome01DossierView';
import { AVAILABLE_METRICS } from './chapter07/abExperimentKnowledge';

interface Chapter07ViewProps {
  onBackToIndex: () => void;
  onChapterCompleted?: () => void;
}

type Chapter07Phase = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Helper to compute inherited evidence and progress from Chapters 01-06
const computeInheritedProgress = () => {
  let loadedSpecs: Partial<UserPcSpec> = {};
  let hwEvLevel = 'NO DISPONIBLE';
  let hasPassport = false;

  // 1. Load specs from primary and fallback storage keys
  try {
    const rawSpecs =
      localStorage.getItem('evo_c01_specs') ||
      localStorage.getItem('evo_user_specs') ||
      localStorage.getItem('evo_passport') ||
      localStorage.getItem('evo_c01_passport');
    if (rawSpecs) {
      loadedSpecs = JSON.parse(rawSpecs);
    }
  } catch {
    // ignore
  }

  // 2. Enrich specs from evo_c01_evidence if fields were left blank in specs
  try {
    const rawEv = localStorage.getItem('evo_c01_evidence');
    if (rawEv) {
      const evMap = JSON.parse(rawEv);
      if (!loadedSpecs.cpu && evMap.cpu?.value) loadedSpecs.cpu = evMap.cpu.value;
      if (!loadedSpecs.ram && evMap.ram?.value) loadedSpecs.ram = evMap.ram.value;
      if (!loadedSpecs.gpu && evMap.gpu?.value) loadedSpecs.gpu = evMap.gpu.value;
      if (!loadedSpecs.storage && evMap.storage?.value) loadedSpecs.storage = evMap.storage.value;
      if (!loadedSpecs.motherboard && evMap.motherboard?.value) loadedSpecs.motherboard = evMap.motherboard.value;
      if (!loadedSpecs.os && evMap.os?.value) loadedSpecs.os = evMap.os.value;
    }
  } catch {
    // ignore
  }

  // 3. Fallback from hypothesis if empty
  try {
    const rawHyp = localStorage.getItem('evo_c01_hypothesis');
    if (rawHyp) {
      const hypMap = JSON.parse(rawHyp);
      if (!loadedSpecs.cpu && hypMap.cpu) loadedSpecs.cpu = hypMap.cpu;
      if (!loadedSpecs.ram && hypMap.ram) loadedSpecs.ram = hypMap.ram;
      if (!loadedSpecs.gpu && hypMap.gpu) loadedSpecs.gpu = hypMap.gpu;
    }
  } catch {
    // ignore
  }

  // Check specs data presence
  const hasSpecsData = Boolean(
    (loadedSpecs.cpu && loadedSpecs.cpu.trim() !== '') ||
    (loadedSpecs.ram && loadedSpecs.ram.trim() !== '') ||
    (loadedSpecs.gpu && loadedSpecs.gpu.trim() !== '') ||
    (loadedSpecs.storage && loadedSpecs.storage.trim() !== '') ||
    (loadedSpecs.motherboard && loadedSpecs.motherboard.trim() !== '') ||
    (loadedSpecs.os && loadedSpecs.os.trim() !== '')
  );

  // Check C01 completion flags
  let isC01Done = false;
  try {
    const c01CompletedRaw = localStorage.getItem('evo_c01_completed');
    if (c01CompletedRaw) {
      const parsed = JSON.parse(c01CompletedRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        isC01Done = true;
      } else if (typeof c01CompletedRaw === 'string' && c01CompletedRaw.length > 0) {
        isC01Done = true;
      }
    }
  } catch {
    if (localStorage.getItem('evo_c01_completed')) isC01Done = true;
  }

  // If Chapter 01 is completed or any subsequent chapter was unlocked/reached, passport is available
  const isC01Finished =
    isC01Done ||
    localStorage.getItem('evo_c01_status') === 'completed' ||
    localStorage.getItem('evo_c02_unlocked') === 'true' ||
    localStorage.getItem('evo_c02_status') === 'completed' ||
    localStorage.getItem('evo_c03_status') === 'completed' ||
    localStorage.getItem('evo_c04_status') === 'completed' ||
    localStorage.getItem('evo_c05_status') === 'completed' ||
    localStorage.getItem('evo_c06_status') === 'completed' ||
    localStorage.getItem('evo_c07_unlocked') === 'true' ||
    Boolean(localStorage.getItem('evo_c01_specs')) ||
    Boolean(localStorage.getItem('evo_passport'));

  hasPassport = hasSpecsData || Boolean(isC01Finished);

  if (hasPassport) {
    // Keep genuine certainty level: default strictly to DECLARADA.
    // Do NOT convert into VERIFICADOS, CONFIRMADOS, or DETECTADOS simply because the chapter is complete.
    hwEvLevel = 'DECLARADA';

    try {
      const rawEv = localStorage.getItem('evo_c01_evidence');
      if (rawEv) {
        const evMap = JSON.parse(rawEv);
        const states: string[] = [
          evMap?.cpu?.state,
          evMap?.ram?.state,
          evMap?.gpu?.state,
          evMap?.storage?.state,
        ].filter(Boolean);

        const isAllConfirmed = states.length > 0 && states.every((s) => s === 'CONFIRMADO' || s === 'VERIFICADO');
        const isAnyConfirmed = states.some((s) => s === 'CONFIRMADO' || s === 'VERIFICADO');

        if (isAllConfirmed) {
          hwEvLevel = 'CONFIRMADA';
        } else if (isAnyConfirmed) {
          hwEvLevel = 'DECLARADA / CONFIRMADA';
        } else {
          hwEvLevel = 'DECLARADA';
        }
      }
    } catch {
      hwEvLevel = 'DECLARADA';
    }
  } else {
    hwEvLevel = 'NO DISPONIBLE';
  }

  // Check the remaining 4 areas from storage
  const hasFlow = Boolean(
    localStorage.getItem('evo_c02_lab_data') ||
    localStorage.getItem('evo_c02_flow_map') ||
    localStorage.getItem('evo_c02_status') === 'completed'
  );

  const hasFluidez = Boolean(
    localStorage.getItem('evo_c03_fluidez_profile') ||
    localStorage.getItem('evo_c03_profile') ||
    localStorage.getItem('evo_c03_status') === 'completed'
  );

  const hasLimit = Boolean(
    localStorage.getItem('evo_c04_experiment_data') ||
    localStorage.getItem('evo_c04_matrix') ||
    localStorage.getItem('evo_c04_status') === 'completed'
  );

  const hasAct = Boolean(
    localStorage.getItem('evo_c05_activity_map') ||
    localStorage.getItem('evo_c05_optimization_log') ||
    localStorage.getItem('evo_c05_baseline') ||
    localStorage.getItem('evo_c05_status') === 'completed'
  );

  const hasOpt = Boolean(
    localStorage.getItem('evo_c05_optimization_log') ||
    localStorage.getItem('evo_c05_opt_log')
  );

  let hasDiag = false;
  try {
    const rawCases = localStorage.getItem('evo_c06_cases');
    if (rawCases) {
      const parsed = JSON.parse(rawCases);
      if (Array.isArray(parsed) && parsed.some((c: any) => c.status === 'COMPLETADO' || c.completed === true)) {
        hasDiag = true;
      }
    }
    if (!hasDiag && (localStorage.getItem('evo_c06_status') === 'completed' || localStorage.getItem('evo_c07_unlocked') === 'true')) {
      hasDiag = true;
    }
  } catch {
    if (localStorage.getItem('evo_c06_status') === 'completed') hasDiag = true;
  }

  return {
    specs: loadedSpecs,
    hasPassport,
    hwEvLevel,
    hasFlow,
    hasFluidez,
    hasLimit,
    hasAct,
    hasOpt,
    hasDiag,
  };
};

export const Chapter07View: React.FC<Chapter07ViewProps> = ({
  onBackToIndex,
  onChapterCompleted,
}) => {
  // Navigation & Screen Mode
  const [currentPhase, setCurrentPhase] = useState<Chapter07Phase>(1);
  const [screenMode, setScreenMode] = useState<'experiment' | 'dossier'>('experiment');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Inherited artifacts from prior chapters - synchronously initialized
  const initialInherited = computeInheritedProgress();
  const [specs, setSpecs] = useState<Partial<UserPcSpec>>(initialInherited.specs);
  const [hardwareEvidenceLevel, setHardwareEvidenceLevel] = useState<string>(initialInherited.hwEvLevel);
  const [summary, setSummary] = useState<Tome01DossierSummary>({
    passport: initialInherited.hasPassport,
    flowMap: initialInherited.hasFlow,
    fluidezProfile: initialInherited.hasFluidez,
    limitMatrix: initialInherited.hasLimit,
    activityMap: initialInherited.hasAct,
    optimizationLog: initialInherited.hasOpt,
    diagnosticCase: initialInherited.hasDiag,
    labReport: false,
    allCompleted: false,
  });

  // Experiment State
  const [selectedObjective, setSelectedObjective] = useState<AbExperimentObjective>('MEJORAR_ESTABILIDAD_FPS');
  const [customObjectiveText, setCustomObjectiveText] = useState('');
  const [userHypothesis, setUserHypothesis] = useState('');
  const [conditions, setConditions] = useState<AbExperimentConditions>({
    gameOrApp: '',
    duration: '',
    sceneOrMap: '',
    resolution: '',
    quality: '',
    fpsCap: '',
    vsync: '',
    openPrograms: '',
    windowsState: '',
    notes: '',
  });

  const [selectedMetricKeys, setSelectedMetricKeys] = useState<string[]>([
    'fpsAvg',
    'onePctLow',
    'frametimeAvg',
    'frametimeMax',
  ]);

  const [metricsA, setMetricsA] = useState<AbMetricSnapshot>({});
  const [perceptionA, setPerceptionA] = useState<AbPerception | undefined>(undefined);

  const [controlledVariable, setControlledVariable] = useState<AbControlledVariable>({
    variableType: 'FPS CAP (Limitador de cuadros)',
    customName: '',
    beforeState: '',
    changeApplied: '',
    reversible: true,
    howToRevert: '',
    revertedConfirmed: false,
  });

  const [metricsB, setMetricsB] = useState<AbMetricSnapshot>({});
  const [perceptionB, setPerceptionB] = useState<AbPerception | undefined>(undefined);

  const [interpretation, setInterpretation] = useState({
    whatChanged: '',
    whatDidNotChange: '',
    whatWeStillDoNotKnow: '',
  });

  const [outcomeResult, setOutcomeResult] = useState<AbOutcomeResult | undefined>(undefined);
  const [userDecision, setUserDecision] = useState<AbUserDecision | undefined>(undefined);
  const [userConclusion, setUserConclusion] = useState('');
  const [isReverted, setIsReverted] = useState(false);
  const [trials, setTrials] = useState<AbExperimentTrial[]>([]);

  // Generated Report
  const [finalReport, setFinalReport] = useState<AbLaboratoryReport | null>(null);

  // Load inherited evidence and prior report on mount
  useEffect(() => {
    const inherited = computeInheritedProgress();
    setSpecs(inherited.specs);
    setHardwareEvidenceLevel(inherited.hwEvLevel);

    // Chapter 07: check if genuine completed report exists
    let hasReport = false;
    try {
      const rawReport = localStorage.getItem('evo_c07_report');
      if (rawReport) {
        const parsedReport = JSON.parse(rawReport);
        const isValidStoredReport =
          parsedReport &&
          parsedReport.completed === true &&
          Array.isArray(parsedReport.deltas) &&
          parsedReport.deltas.length >= 1 &&
          Boolean(parsedReport.perceptionA) &&
          Boolean(parsedReport.perceptionB) &&
          Boolean(parsedReport.outcomeResult) &&
          Boolean(parsedReport.userDecision);

        if (isValidStoredReport) {
          setFinalReport(parsedReport);
          hasReport = true;
        } else {
          // Clean invalid state that lacked rigorous deltas or conclusion
          localStorage.removeItem('evo_c07_report');
          localStorage.removeItem('evo_c07_status');
          localStorage.removeItem('evo_tome01_status');
        }
      }
    } catch {
      // ignore
    }

    const isAll =
      inherited.hasPassport &&
      inherited.hasFlow &&
      inherited.hasFluidez &&
      inherited.hasLimit &&
      inherited.hasAct &&
      inherited.hasDiag &&
      hasReport;

    setSummary({
      passport: inherited.hasPassport,
      flowMap: inherited.hasFlow,
      fluidezProfile: inherited.hasFluidez,
      limitMatrix: inherited.hasLimit,
      activityMap: inherited.hasAct,
      optimizationLog: inherited.hasOpt,
      diagnosticCase: inherited.hasDiag,
      labReport: hasReport,
      allCompleted: isAll,
    });

    // Check draft experiment if exists
    try {
      const draft = localStorage.getItem('evo_c07_experiment_draft');
      if (draft && !hasReport) {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft.selectedObjective) setSelectedObjective(parsedDraft.selectedObjective);
        if (parsedDraft.customObjectiveText) setCustomObjectiveText(parsedDraft.customObjectiveText);
        if (parsedDraft.userHypothesis) setUserHypothesis(parsedDraft.userHypothesis);
        if (parsedDraft.conditions) setConditions(parsedDraft.conditions);
        if (parsedDraft.selectedMetricKeys) setSelectedMetricKeys(parsedDraft.selectedMetricKeys);
        if (parsedDraft.metricsA) setMetricsA(parsedDraft.metricsA);
        if (parsedDraft.perceptionA) setPerceptionA(parsedDraft.perceptionA);
        if (parsedDraft.controlledVariable) setControlledVariable(parsedDraft.controlledVariable);
        if (parsedDraft.metricsB) setMetricsB(parsedDraft.metricsB);
        if (parsedDraft.perceptionB) setPerceptionB(parsedDraft.perceptionB);
        if (parsedDraft.interpretation) setInterpretation(parsedDraft.interpretation);
        if (parsedDraft.userConclusion) setUserConclusion(parsedDraft.userConclusion);
        if (parsedDraft.isReverted !== undefined) setIsReverted(parsedDraft.isReverted);

        // Only restore outcomeResult if comparison between A and B would be valid
        const mA = parsedDraft.metricsA || {};
        const mB = parsedDraft.metricsB || {};
        const hasA = Object.values(mA).some((v) => typeof v === 'number' && !isNaN(v as number));
        const hasB = Object.values(mB).some((v) => typeof v === 'number' && !isNaN(v as number));
        const hasCommon = Object.keys(mA).some(
          (k) => typeof mA[k] === 'number' && typeof mB[k] === 'number'
        );
        const hasVar = Boolean(parsedDraft.controlledVariable?.changeApplied);

        if (hasA && hasB && hasCommon && hasVar && parsedDraft.perceptionA && parsedDraft.perceptionB) {
          if (parsedDraft.outcomeResult) setOutcomeResult(parsedDraft.outcomeResult);
          if (parsedDraft.userDecision) setUserDecision(parsedDraft.userDecision);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync draft to localStorage periodically
  useEffect(() => {
    try {
      const draftData = {
        selectedObjective,
        customObjectiveText,
        userHypothesis,
        conditions,
        selectedMetricKeys,
        metricsA,
        perceptionA,
        controlledVariable,
        metricsB,
        perceptionB,
        interpretation,
        outcomeResult,
        userDecision,
        userConclusion,
        isReverted,
      };
      localStorage.setItem('evo_c07_experiment_draft', JSON.stringify(draftData));
    } catch {
      // ignore
    }
  }, [
    selectedObjective,
    customObjectiveText,
    userHypothesis,
    conditions,
    selectedMetricKeys,
    metricsA,
    perceptionA,
    controlledVariable,
    metricsB,
    perceptionB,
    interpretation,
    outcomeResult,
    userDecision,
    userConclusion,
    isReverted,
  ]);

  // Objective change handler: also presets recommended metrics
  const handleSelectObjective = (obj: AbExperimentObjective) => {
    setSelectedObjective(obj);
    const preset = OBJECTIVE_PRESETS.find((p) => p.id === obj);
    if (preset) {
      setSelectedMetricKeys(preset.defaultMetrics);
      // Reset metrics when changing objective if empty
      if (Object.keys(metricsA).length === 0) {
        setMetricsA({});
        setMetricsB({});
      }
    }
  };

  const handleToggleMetricKey = (key: string) => {
    if (selectedMetricKeys.includes(key)) {
      if (selectedMetricKeys.length > 1) {
        setSelectedMetricKeys(selectedMetricKeys.filter((k) => k !== key));
      }
    } else {
      setSelectedMetricKeys([...selectedMetricKeys, key]);
    }
  };

  const handleChangeMetricA = (key: string, val: number | null) => {
    setMetricsA((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleChangeMetricB = (key: string, val: number | null) => {
    setMetricsB((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleAddTrial = (trial: AbExperimentTrial) => {
    setTrials((prev) => [...prev, trial]);
  };

  // Active metric defs and deltas
  const activeDefs = AVAILABLE_METRICS.filter((m) => selectedMetricKeys.includes(m.key));
  const currentDeltas = calculateMetricDeltas(metricsA, metricsB, activeDefs);

  // Phase 1: Objetivo
  const isPhase1Complete = Boolean(
    selectedObjective &&
    (selectedObjective !== 'OTRO' || customObjectiveText.trim().length >= 3)
  );

  // Phase 2: Hipótesis
  const isPhase2Complete = isPhase1Complete && userHypothesis.trim().length >= 10;

  // Phase 3: Condiciones
  const isPhase3Complete =
    isPhase2Complete &&
    conditions.gameOrApp.trim().length >= 2 &&
    (conditions.duration?.trim().length || 0) >= 2;

  // Phase 4: Medición A
  const hasMeasurementA = Object.values(metricsA).some(
    (v) => typeof v === 'number' && !isNaN(v)
  );
  const hasPerceptionA = Boolean(perceptionA);
  const isPhase4Complete = isPhase3Complete && hasMeasurementA && hasPerceptionA;

  // Phase 5: Cambio
  const hasVariableDocumented = Boolean(
    controlledVariable.variableType?.trim().length >= 2 &&
    controlledVariable.beforeState?.trim().length >= 2 &&
    controlledVariable.changeApplied?.trim().length >= 2 &&
    controlledVariable.howToRevert?.trim().length >= 2
  );
  const isPhase5Complete = isPhase4Complete && hasVariableDocumented;

  // Phase 6: Medición B
  const hasMeasurementB = Object.values(metricsB).some(
    (v) => typeof v === 'number' && !isNaN(v)
  );
  const hasComparableMetrics = currentDeltas.length >= 1;
  const hasPerceptionB = Boolean(perceptionB);
  const isPhase6Complete =
    isPhase5Complete &&
    hasMeasurementB &&
    hasComparableMetrics &&
    hasPerceptionB;

  // Strict A/B comparison criteria:
  // - Medición A registrada
  // - Medición B registrada
  // - al menos una misma métrica cuantitativa presente en A y B
  // - variable modificada documentada
  // - percepción A registrada
  // - percepción B registrada
  const isComparisonValid =
    hasMeasurementA &&
    hasMeasurementB &&
    hasComparableMetrics &&
    hasVariableDocumented &&
    hasPerceptionA &&
    hasPerceptionB;

  const missingComparisonItems: string[] = [];
  if (!hasMeasurementA) missingComparisonItems.push('FALTA MEDICIÓN A');
  if (!hasPerceptionA) missingComparisonItems.push('FALTA PERCEPCIÓN DEL ESTADO A');
  if (!hasVariableDocumented) missingComparisonItems.push('FALTA VARIABLE MODIFICADA');
  if (!hasMeasurementB) missingComparisonItems.push('FALTA MEDICIÓN B');
  if (!hasComparableMetrics) missingComparisonItems.push('NO HAY MÉTRICAS COMPARABLES ENTRE A Y B');
  if (!hasPerceptionB) missingComparisonItems.push('FALTA PERCEPCIÓN DEL ESTADO B');

  // Earliest incomplete phase
  const getFirstIncompletePhase = (): Chapter07Phase => {
    if (!isPhase1Complete) return 1;
    if (!isPhase2Complete) return 2;
    if (!isPhase3Complete) return 3;
    if (!isPhase4Complete) return 4;
    if (!isPhase5Complete) return 5;
    if (!isPhase6Complete) return 6;
    return 7;
  };

  // Max unlocked phase that can be navigated forward to
  const maxUnlockedPhase: Chapter07Phase = (() => {
    if (!isPhase1Complete) return 1;
    if (!isPhase2Complete) return 2;
    if (!isPhase3Complete) return 3;
    if (!isPhase4Complete) return 4;
    if (!isPhase5Complete) return 5;
    if (!isPhase6Complete) return 6;
    return 7;
  })();

  const canNavigateTo = (targetPhase: number): boolean => {
    if (targetPhase <= currentPhase) return true; // Se puede volver a una fase anterior
    return targetPhase <= maxUnlockedPhase; // No se puede avanzar a una fase futura bloqueada
  };

  // Retroceder lógicamente al último paso incompleto si Fase 7 no tiene comparación válida y no hay informe concluido
  useEffect(() => {
    if (currentPhase === 7 && !isComparisonValid && !finalReport) {
      const incomplete = getFirstIncompletePhase();
      if (incomplete < 7) {
        setCurrentPhase(incomplete);
      }
    }
  }, [currentPhase, isComparisonValid, finalReport]);

  // Si se invalidan las mediciones o la comparación, deseleccionar cualquier resultado formal previo
  useEffect(() => {
    if (!isComparisonValid && outcomeResult !== undefined && !finalReport) {
      setOutcomeResult(undefined);
    }
  }, [isComparisonValid, outcomeResult, finalReport]);

  // Generate Report and Finalize Chapter 07 & Tomo 01
  const handleGenerateReport = () => {
    const computedDeltas = calculateMetricDeltas(metricsA, metricsB, activeDefs);

    // Strict validation rule: no conclusion without valid A/B comparison and complete prerequisites
    if (
      !isPhase1Complete ||
      !isPhase2Complete ||
      !isPhase3Complete ||
      !isPhase4Complete ||
      !isPhase5Complete ||
      !isPhase6Complete ||
      !isComparisonValid ||
      computedDeltas.length === 0 ||
      !outcomeResult ||
      !userDecision ||
      userConclusion.trim().length < 10
    ) {
      return;
    }

    const report: AbLaboratoryReport = {
      id: `EVO-LAB-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleDateString('es-AR'),
      completedAt: new Date().toLocaleString('es-AR'),
      hardware: specs,
      objective: selectedObjective,
      objectiveCustomText: selectedObjective === 'OTRO' ? customObjectiveText : undefined,
      userHypothesis,
      conditions,
      selectedMetricKeys,
      controlledVariable,
      metricsA,
      metricsB,
      perceptionA,
      perceptionB,
      deltas: computedDeltas,
      trials,
      interpretation,
      outcomeResult,
      userDecision,
      userConclusion,
      isReverted,
      completed: true,
    };

    setFinalReport(report);

    // Save report and mark C07 completed in localStorage
    try {
      localStorage.setItem('evo_c07_report', JSON.stringify(report));
      localStorage.setItem('evo_c07_status', 'completed');
      localStorage.setItem('evo_tome01_status', 'completed');
    } catch {
      // ignore
    }

    setSummary((prev) => ({
      ...prev,
      labReport: true,
      allCompleted: true,
    }));

    if (onChapterCompleted) {
      onChapterCompleted();
    }

    setIsReportModalOpen(true);
  };

  const handleRestartExperiment = () => {
    if (window.confirm('¿Querés iniciar un nuevo ensayo A/B? Tus datos actuales se reiniciarán para una nueva prueba.')) {
      setMetricsA({});
      setMetricsB({});
      setPerceptionA(undefined);
      setPerceptionB(undefined);
      setOutcomeResult(undefined);
      setUserDecision(undefined);
      setUserConclusion('');
      setCurrentPhase(1);
      setScreenMode('experiment');
    }
  };

  // Stepper items
  const phases = [
    { num: 1, label: '01. Objetivo' },
    { num: 2, label: '02. Hipótesis' },
    { num: 3, label: '03. Condiciones' },
    { num: 4, label: '04. Medición A' },
    { num: 5, label: '05. Cambio' },
    { num: 6, label: '06. Medición B' },
    { num: 7, label: '07. Conclusión' },
  ];

  return (
    <div
      id="capitulo-07-laboratorio-final"
      className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-10"
    >
      {/* Top Editorial Bar */}
      <nav className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <button
          type="button"
          onClick={onBackToIndex}
          className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
          <span>← VOLVER AL ÍNDICE EDITORIAL</span>
        </button>

        <div className="flex items-center gap-3 font-mono-tech text-xs">
          {summary.labReport && (
            <button
              type="button"
              onClick={() => setScreenMode(screenMode === 'dossier' ? 'experiment' : 'dossier')}
              className="px-3 py-1.5 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/40 font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{screenMode === 'dossier' ? 'VER ENSAYO A/B' : 'DOSSIER TOMO 01'}</span>
            </button>
          )}

          <span className="w-2 h-2 bg-yellow-400 inline-block" />
          <span className="tracking-widest uppercase text-white font-bold">
            CAPÍTULO 07 // FINAL
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-yellow-400 font-bold tracking-wider">LABORATORIO A/B</span>
        </div>
      </nav>

      {/* Screen Mode Switch: Dossier vs Experiment */}
      {screenMode === 'dossier' ? (
        <Tome01DossierView
          specs={specs}
          summary={summary}
          labReport={finalReport}
          onBackToIndex={onBackToIndex}
          onReopenLabReport={() => setIsReportModalOpen(true)}
        />
      ) : (
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Opening Editorial Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-yellow-400 tracking-widest uppercase font-semibold">
              <FlaskConical className="w-4 h-4 text-yellow-400" />
              <span>CAPÍTULO 07 // LABORATORIO FINAL</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-[0.95]">
              NO ME DIGAS QUE MEJORÓ. DEMOSTRALO.
            </h1>

            <div className="space-y-3 font-sans-editorial text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
              <p>
                Llegaste al último laboratorio del Tomo 01. Hasta ahora investigaste tu máquina, entendiste cómo viajan los datos, mediste la consistencia de cuadros y aprendiste a aislar fallas.
              </p>
              <p className="font-bold text-white text-lg sm:text-xl">
                ¿PODEMOS DEMOSTRAR QUE UNA OPTIMIZACIÓN REALMENTE FUNCIONÓ?
              </p>
              <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 font-mono-tech text-xs text-yellow-400 font-bold tracking-wide">
                OBSERVAR → PLANTEAR HIPÓTESIS → MEDIR → CAMBIAR UNA SOLA VARIABLE → VOLVER A MEDIR → COMPARAR → CONCLUIR
              </div>
            </div>
          </header>

          {/* Banner: Tu Investigación Hasta Ahora (Evidencia Acumulada) */}
          <InheritedEvidenceTracker
            specs={specs}
            hasPassport={summary.passport}
            hardwareEvidenceLevel={hardwareEvidenceLevel}
            hasFlowMap={summary.flowMap}
            hasFluidez={summary.fluidezProfile}
            hasLimitMatrix={summary.limitMatrix}
            hasActivityMap={summary.activityMap}
            hasDiagnosticCase={summary.diagnosticCase}
          />

          {/* Stepper Navigation */}
          <div className="p-3 rounded-2xl bg-[#0f1016] border border-zinc-800 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[640px] gap-2 font-mono-tech text-xs">
              {phases.map((p) => {
                const isActive = currentPhase === p.num;
                const isPast = currentPhase > p.num;
                const isNavigable = canNavigateTo(p.num);
                const isLocked = !isNavigable;

                return (
                  <button
                    key={p.num}
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      if (isNavigable) {
                        setCurrentPhase(p.num as Chapter07Phase);
                      }
                    }}
                    title={isLocked ? 'Completá los pasos anteriores para habilitar esta fase' : undefined}
                    className={`flex-1 py-2 px-3 rounded-xl border text-center font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'bg-yellow-400 text-black border-yellow-400 shadow-md cursor-default'
                        : isLocked
                        ? 'bg-black/20 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
                        : isPast
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-yellow-400/50 cursor-pointer'
                        : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer'
                    }`}
                  >
                    {isPast && !isLocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {isLocked && <Lock className="w-3 h-3 text-zinc-600 shrink-0" />}
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Phase Content */}
          <main className="space-y-6">
            {currentPhase === 1 && (
              <Phase01ObjectiveStation
                selectedObjective={selectedObjective}
                customObjectiveText={customObjectiveText}
                onSelectObjective={handleSelectObjective}
                onChangeCustomText={setCustomObjectiveText}
                onNextPhase={() => setCurrentPhase(2)}
              />
            )}

            {currentPhase === 2 && (
              <Phase02HypothesisStation
                objective={selectedObjective}
                userHypothesis={userHypothesis}
                onChangeHypothesis={setUserHypothesis}
                onBack={() => setCurrentPhase(1)}
                onNext={() => setCurrentPhase(3)}
              />
            )}

            {currentPhase === 3 && (
              <Phase03ConditionsStation
                objective={selectedObjective}
                conditions={conditions}
                onChangeConditions={setConditions}
                onBack={() => setCurrentPhase(2)}
                onNext={() => setCurrentPhase(4)}
              />
            )}

            {currentPhase === 4 && (
              <Phase04MeasurementAStation
                selectedMetricKeys={selectedMetricKeys}
                metricsA={metricsA}
                perceptionA={perceptionA}
                onToggleMetricKey={handleToggleMetricKey}
                onChangeMetricA={handleChangeMetricA}
                onChangePerceptionA={setPerceptionA}
                onBack={() => setCurrentPhase(3)}
                onNext={() => setCurrentPhase(5)}
              />
            )}

            {currentPhase === 5 && (
              <Phase05ControlledChangeStation
                controlledVariable={controlledVariable}
                onChangeVariable={setControlledVariable}
                onBack={() => setCurrentPhase(4)}
                onNext={() => setCurrentPhase(6)}
              />
            )}

            {currentPhase === 6 && (
              <Phase06MeasurementBStation
                selectedMetricKeys={selectedMetricKeys}
                metricsA={metricsA}
                metricsB={metricsB}
                perceptionB={perceptionB}
                controlledVariable={controlledVariable}
                onChangeMetricB={handleChangeMetricB}
                onChangePerceptionB={setPerceptionB}
                onBack={() => setCurrentPhase(5)}
                onNext={() => setCurrentPhase(7)}
              />
            )}

            {currentPhase === 7 && (
              <Phase07ComparisonStation
                selectedMetricKeys={selectedMetricKeys}
                metricsA={metricsA}
                metricsB={metricsB}
                perceptionA={perceptionA}
                perceptionB={perceptionB}
                controlledVariable={controlledVariable}
                outcomeResult={outcomeResult}
                userDecision={userDecision}
                userConclusion={userConclusion}
                interpretation={interpretation}
                isReverted={isReverted}
                trials={trials}
                isComparisonValid={isComparisonValid}
                missingComparisonItems={missingComparisonItems}
                onGoToIncompleteStep={() => setCurrentPhase(getFirstIncompletePhase())}
                onChangeOutcomeResult={setOutcomeResult}
                onChangeUserDecision={setUserDecision}
                onChangeUserConclusion={setUserConclusion}
                onChangeInterpretation={(key, val) =>
                  setInterpretation((prev) => ({ ...prev, [key]: val }))
                }
                onToggleRevert={() => setIsReverted(!isReverted)}
                onAddTrial={handleAddTrial}
                onBack={() => setCurrentPhase(6)}
                onGenerateReport={handleGenerateReport}
              />
            )}
          </main>

          {/* Bottom Bar: Action options if already completed */}
          {summary.labReport && (
            <div className="p-5 rounded-2xl bg-[#0f1016] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>INFORME DE LABORATORIO EVO 001 ASENTADO Y REGISTRADO.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRestartExperiment}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>NUEVO ENSAYO A/B</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>CONSULTAR INFORME OFICIAL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScreenMode('dossier')}
                  className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Award className="w-3.5 h-3.5 text-black" />
                  <span>ABRIR DOSSIER TOMO 01</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Report Modal */}
      {finalReport && (
        <LaboratoryReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          report={finalReport}
          onOpenTomeDossier={() => {
            setIsReportModalOpen(false);
            setScreenMode('dossier');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
};
