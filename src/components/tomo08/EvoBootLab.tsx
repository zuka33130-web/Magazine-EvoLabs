import React, { useState, useEffect, useRef } from 'react';
import {
  BOOT_SEQUENCE_STEPS,
  BootStep,
  BOOT_PHASES,
  BootPhase,
  SIMPLE_STEP_TITLES,
  getPhaseForStep,
  getStepTransitionInfo,
  EVO_CASES,
  EvoCase,
  CaseHypothesis,
  HypothesisStatus,
  MYSTERY_CASES_POOL,
  MysteryCase,
  MysteryComponentKey,
  MysteryHypothesisState,
  ALL_MYSTERY_COMPONENTS,
  getStepForensicDetails,
} from './bootSequenceData';
import { EvoBootMachineVisual } from './EvoBootMachineVisual';
import {
  Power,
  Zap,
  Cpu,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  X,
  Activity,
  Lock,
  Wrench,
  ShieldAlert,
  UserCheck,
  BookOpen,
  HelpCircle,
  FileText,
  Search,
  CheckCircle,
  Sparkles,
  Compass,
  History,
  Check,
  RefreshCw,
} from 'lucide-react';

interface EvoBootLabProps {
  onClose?: () => void;
  onOpenTomo08?: () => void;
  initialStepIndex?: number;
  initialMode?: 'APRENDER' | 'FALLA_SIMULADA' | 'CASO_EVO' | 'PC_MISTERIOSA';
}

type LabMode = 'APRENDER' | 'FALLA_SIMULADA' | 'CASO_EVO' | 'PC_MISTERIOSA';
type MysteryTab = 'EVIDENCIAS' | 'HIPOTESIS' | 'PRUEBAS' | 'HISTORIAL';

export const EvoBootLab: React.FC<EvoBootLabProps> = ({
  onClose,
  onOpenTomo08,
  initialStepIndex = 0,
  initialMode = 'APRENDER',
}) => {
  // Global Mode switcher
  const [activeMode, setActiveMode] = useState<LabMode>(initialMode);

  // APRENDER & FALLA SIMULADA Mode States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStepIndex);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(0);
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
  const [simulatedFailureStep, setSimulatedFailureStep] = useState<number | null>(null);
  const [isSimulatingFailureRun, setIsSimulatingFailureRun] = useState<boolean>(false);

  // CASO EVO Mode States
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [caseRunning, setCaseRunning] = useState<boolean>(false);
  const [caseStepReached, setCaseStepReached] = useState<number>(0);
  const [isCaseBooting, setIsCaseBooting] = useState<boolean>(false);
  const [executedTestIds, setExecutedTestIds] = useState<string[]>([]);
  const [caseHypotheses, setCaseHypotheses] = useState<CaseHypothesis[]>(
    EVO_CASES[0].hypotheses
  );
  const [accumulatedEvidence, setAccumulatedEvidence] = useState<string[]>([]);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [userDiagnosticFeedback, setUserDiagnosticFeedback] = useState<string | null>(null);
  const [isCaseResolved, setIsCaseResolved] = useState<boolean>(false);

  // PC MISTERIOSA Mode States
  const [mysteryCaseIndex, setMysteryCaseIndex] = useState<number>(0);
  const [mysteryRunning, setMysteryRunning] = useState<boolean>(false);
  const [mysteryStepReached, setMysteryStepReached] = useState<number>(0);
  const [isMysteryBooting, setIsMysteryBooting] = useState<boolean>(false);
  const [mysteryActiveTab, setMysteryActiveTab] = useState<MysteryTab>('EVIDENCIAS');
  const [mysteryExecutedTests, setMysteryExecutedTests] = useState<string[]>([]);
  const [mysteryExpandedWhy, setMysteryExpandedWhy] = useState<string | null>(null);
  const [mysteryEvidenceLog, setMysteryEvidenceLog] = useState<string[]>([]);
  const [mysteryHistoryLog, setMysteryHistoryLog] = useState<
    { timestamp: string; action: string; note: string }[]
  >([]);
  const [mysteryHypothesisStates, setMysteryHypothesisStates] = useState<
    Record<MysteryComponentKey, MysteryHypothesisState>
  >(() => {
    const initial: Record<string, MysteryHypothesisState> = {};
    ALL_MYSTERY_COMPONENTS.forEach((c) => {
      initial[c.key] = 'SIN_EVIDENCIA';
    });
    return initial as Record<MysteryComponentKey, MysteryHypothesisState>;
  });
  const [mysterySelectedComponent, setMysterySelectedComponent] =
    useState<MysteryComponentKey | null>(null);
  const [mysteryDiagnosticMessage, setMysteryDiagnosticMessage] = useState<{
    type: 'ERROR' | 'SUCCESS';
    text: string;
  } | null>(null);
  const [isMysteryResolved, setIsMysteryResolved] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentCase: EvoCase = EVO_CASES[selectedCaseIndex] || EVO_CASES[0];
  const currentMystery: MysteryCase = MYSTERY_CASES_POOL[mysteryCaseIndex] || MYSTERY_CASES_POOL[0];

  // Active step for machine visual depending on mode
  let activeVisualStepIndex = currentStepIndex;
  if (activeMode === 'CASO_EVO') {
    activeVisualStepIndex = caseRunning ? caseStepReached : 0;
  } else if (activeMode === 'PC_MISTERIOSA') {
    activeVisualStepIndex = mysteryRunning ? mysteryStepReached : 0;
  } else if (activeMode === 'FALLA_SIMULADA') {
    activeVisualStepIndex = currentStepIndex;
  }

  const currentStep: BootStep =
    BOOT_SEQUENCE_STEPS[activeVisualStepIndex] || BOOT_SEQUENCE_STEPS[0];
  const forensicDetails = getStepForensicDetails(currentStep.stepNumber);
  const currentPhase: BootPhase = getPhaseForStep(currentStep.stepNumber);
  const transitionInfo = getStepTransitionInfo(currentStep.stepNumber);
  const simpleTitle = SIMPLE_STEP_TITLES[currentStep.stepNumber] || currentStep.name;
  const totalSteps = BOOT_SEQUENCE_STEPS.length - 1; // 0 to 34

  // =========================================================================
  // APRENDER & BASIC CONTROLS
  // =========================================================================

  const handlePowerOn = () => {
    setIsPoweredOn(true);
    setCurrentStepIndex(1);
    setMaxUnlockedStep((prev) => Math.max(prev, 1));
  };

  const handlePowerOff = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPoweredOn(false);
    setCurrentStepIndex(0);
    setIsSimulatingFailureRun(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps) {
      if (activeMode === 'FALLA_SIMULADA' && simulatedFailureStep !== null && currentStepIndex >= simulatedFailureStep) {
        return; // Locked at failure point
      }
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setMaxUnlockedStep((prev) => Math.max(prev, nextIdx));
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 1) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentStepIndex === 1) {
      handlePowerOff();
    }
  };

  const handleJumpToStep = (index: number) => {
    if (index === 0) {
      handlePowerOff();
      return;
    }
    if (index <= maxUnlockedStep) {
      if (activeMode === 'FALLA_SIMULADA' && simulatedFailureStep !== null && index > simulatedFailureStep) {
        return; // Locked beyond failure point
      }
      setIsPoweredOn(true);
      setCurrentStepIndex(index);
    }
  };

  // =========================================================================
  // FALLA SIMULADA RUNNER
  // =========================================================================

  const handleSelectSimulatedFailure = (stepNum: number) => {
    setSimulatedFailureStep(stepNum);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPoweredOn(false);
    setCurrentStepIndex(0);
    setIsSimulatingFailureRun(false);
  };

  const handleStartSimulatedFailureRun = () => {
    if (simulatedFailureStep === null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setIsPoweredOn(true);
    setIsSimulatingFailureRun(true);
    setCurrentStepIndex(0);

    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step <= simulatedFailureStep) {
        setCurrentStepIndex(step);
        setMaxUnlockedStep((prev) => Math.max(prev, step));
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsSimulatingFailureRun(false);
      }
    }, 120);
  };

  // =========================================================================
  // CASO EVO HANDLERS
  // =========================================================================

  const handleSelectCase = (caseIndex: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedCaseIndex(caseIndex);
    const targetCase = EVO_CASES[caseIndex];
    setCaseRunning(false);
    setCaseStepReached(0);
    setIsCaseBooting(false);
    setExecutedTestIds([]);
    setCaseHypotheses(targetCase.hypotheses);
    setAccumulatedEvidence([]);
    setSelectedHypothesisId(null);
    setUserDiagnosticFeedback(null);
    setIsCaseResolved(false);
  };

  const handleStartCaseDiagnostic = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCaseRunning(true);
    setIsCaseBooting(true);
    setCaseStepReached(0);
    setCaseHypotheses(currentCase.hypotheses);
    setAccumulatedEvidence([...currentCase.evidenciaInicial]);
    setExecutedTestIds([]);
    setSelectedHypothesisId(null);
    setUserDiagnosticFeedback(null);
    setIsCaseResolved(false);

    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step <= currentCase.stopStep) {
        setCaseStepReached(step);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCaseBooting(false);
      }
    }, 100);
  };

  const handleExecuteTest = (testId: string) => {
    if (executedTestIds.includes(testId)) return;

    const test = currentCase.tests.find((t) => t.id === testId);
    if (!test) return;

    const newExecuted = [...executedTestIds, testId];
    setExecutedTestIds(newExecuted);

    if (test.evidenciaGenerada && !accumulatedEvidence.includes(test.evidenciaGenerada)) {
      setAccumulatedEvidence((prev) => [...prev, test.evidenciaGenerada]);
    }

    setCaseHypotheses((prevHypotheses) =>
      prevHypotheses.map((hyp) => {
        let newStatus: HypothesisStatus = hyp.initialStatus;
        if (test.hipotesisFortalece.includes(hyp.id)) {
          newStatus = test.esPruebaConfirmatoria ? 'CONFIRMADA' : 'SOSTENIDA';
        } else if (test.hipotesisDebilita.includes(hyp.id)) {
          newStatus = 'DEBILITADA';
        }
        return { ...hyp, initialStatus: newStatus };
      })
    );

    setUserDiagnosticFeedback(null);
  };

  const handleConfirmHypothesis = (hypId: string) => {
    const isCorrect = hypId === currentCase.correctDiagnosis;
    const hasExecutedConfirmingTest = currentCase.tests.some(
      (t) => t.esPruebaConfirmatoria && executedTestIds.includes(t.id)
    );

    if (isCorrect && hasExecutedConfirmingTest) {
      setIsCaseResolved(true);
      setUserDiagnosticFeedback(null);
      setCaseHypotheses((prev) =>
        prev.map((h) =>
          h.id === hypId
            ? { ...h, initialStatus: 'CONFIRMADA' }
            : { ...h, initialStatus: 'DESCARTADA' }
        )
      );
    } else if (isCorrect && !hasExecutedConfirmingTest) {
      setUserDiagnosticFeedback(
        'DIAGNÓSTICO NO DEMOSTRADO: La hipótesis puede ser correcta, pero todavía no fue comprobada con evidencia decisiva.'
      );
    } else {
      setUserDiagnosticFeedback(
        'DIAGNÓSTICO NO DEMOSTRADO: La evidencia reunida y la etapa de detención descartan esta hipótesis como la causa raíz.'
      );
    }
  };

  // =========================================================================
  // PC MISTERIOSA HANDLERS
  // =========================================================================

  const handleGenerateMysteryCase = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const nextIndex = (mysteryCaseIndex + 1) % MYSTERY_CASES_POOL.length;
    setMysteryCaseIndex(nextIndex);
    setMysteryRunning(false);
    setMysteryStepReached(0);
    setIsMysteryBooting(false);
    setMysteryActiveTab('EVIDENCIAS');
    setMysteryExecutedTests([]);
    setMysteryExpandedWhy(null);
    setMysteryEvidenceLog([]);
    setMysteryHistoryLog([
      {
        timestamp: '00:00',
        action: 'CASO GENERADO',
        note: 'Nueva PC Misteriosa recepcionada para diagnóstico forense.',
      },
    ]);
    const initial: Record<string, MysteryHypothesisState> = {};
    ALL_MYSTERY_COMPONENTS.forEach((c) => {
      initial[c.key] = 'SIN_EVIDENCIA';
    });
    setMysteryHypothesisStates(initial as Record<MysteryComponentKey, MysteryHypothesisState>);
    setMysterySelectedComponent(null);
    setMysteryDiagnosticMessage(null);
    setIsMysteryResolved(false);
  };

  const handleStartMysteryPowerOn = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMysteryRunning(true);
    setIsMysteryBooting(true);
    setMysteryStepReached(0);
    setMysteryEvidenceLog([
      `SÍNTOMA INICIAL: ${currentMystery.sintomaObservado}`,
      `OBSERVACIÓN TÉCNICA: ${currentMystery.observacionTecnica}`,
    ]);
    setMysteryHistoryLog((prev) => [
      ...prev,
      {
        timestamp: '00:02',
        action: 'ENCENDIDO DE PC',
        note: `PC encendida. La secuencia de arranque avanzó y se detuvo en ${currentMystery.ultimoEstadoConfirmado}.`,
      },
    ]);

    setMysteryHypothesisStates((prev) => {
      const updated = { ...prev };
      ALL_MYSTERY_COMPONENTS.forEach((comp) => {
        updated[comp.key] = 'POSIBLE';
      });
      return updated;
    });

    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      if (step <= currentMystery.stopStep) {
        setMysteryStepReached(step);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsMysteryBooting(false);
      }
    }, 100);
  };

  const handleExecuteMysteryTest = (test: (typeof currentMystery.pruebasDisponibles)[0]) => {
    if (mysteryExecutedTests.includes(test.id)) return;

    setMysteryExecutedTests((prev) => [...prev, test.id]);
    setMysteryEvidenceLog((prev) => [
      ...prev,
      `PRUEBA [${test.nombre}]: ${test.resultadoObservado}`,
    ]);
    setMysteryHistoryLog((prev) => [
      ...prev,
      {
        timestamp: '00:15',
        action: `EJECUCIÓN DE PRUEBA: ${test.nombre}`,
        note: test.evidenciaDescubierta,
      },
    ]);

    setMysteryHypothesisStates((prev) => {
      const updated = { ...prev };
      test.hipotesisFortalece.forEach((key) => {
        updated[key] = test.esDecisiva ? 'CONFIRMADA' : 'SOSTENIDA';
      });
      test.hipotesisDebilita.forEach((key) => {
        if (updated[key] !== 'CONFIRMADA') updated[key] = 'DEBILITADA';
      });
      test.hipotesisDescarta.forEach((key) => {
        updated[key] = 'DESCARTADA';
      });
      return updated;
    });

    setMysteryDiagnosticMessage(null);
  };

  const handleEmitMysteryDiagnosis = () => {
    if (!mysterySelectedComponent) {
      setMysteryDiagnosticMessage({
        type: 'ERROR',
        text: 'Seleccioná un componente en la pestaña HIPÓTESIS antes de emitir diagnóstico.',
      });
      return;
    }

    const isCorrectComponent = mysterySelectedComponent === currentMystery.correctComponent;
    const hasDecisiveEvidence = currentMystery.pruebasDisponibles.some(
      (t) => t.esDecisiva && mysteryExecutedTests.includes(t.id)
    );

    if (isCorrectComponent && hasDecisiveEvidence) {
      setIsMysteryResolved(true);
      setMysteryDiagnosticMessage({
        type: 'SUCCESS',
        text: '¡DIAGNÓSTICO CONFIRMADO! Has respaldado la causa raíz con evidencia decisiva.',
      });
      setMysteryHypothesisStates((prev) => {
        const updated = { ...prev };
        ALL_MYSTERY_COMPONENTS.forEach((c) => {
          if (c.key === currentMystery.correctComponent) {
            updated[c.key] = 'CONFIRMADA';
          } else {
            updated[c.key] = 'DESCARTADA';
          }
        });
        return updated;
      });
    } else if (isCorrectComponent && !hasDecisiveEvidence) {
      setMysteryDiagnosticMessage({
        type: 'ERROR',
        text: 'DIAGNÓSTICO NO DEMOSTRADO: La hipótesis puede ser correcta, pero todavía no fue comprobada con evidencia decisiva.',
      });
    } else {
      setMysteryDiagnosticMessage({
        type: 'ERROR',
        text: 'DIAGNÓSTICO NO DEMOSTRADO: Las pruebas y la evidencia observable no respaldan a este componente como la causa raíz.',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 font-mono-tech select-none">
      {/* Top Header / Mode Switcher Tabs */}
      <div className="bg-[#0a0d14] border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span>EVO LABS</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 font-normal">RECURSO INTERACTIVO DEL TOMO 08</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white font-display uppercase tracking-tight">
              LABORATORIO DE ARRANQUE Y FALLAS GUIADO
            </h1>
            <div className="text-[11px] text-emerald-400/90 font-mono-tech">
              SISTEMA EVO LABS DE ARRANQUE Y DIAGNÓSTICO
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* 4 Mode Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveMode('APRENDER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMode === 'APRENDER'
                  ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              [ APRENDER ]
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('FALLA_SIMULADA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMode === 'FALLA_SIMULADA'
                  ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              [ FALLA SIMULADA ]
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('CASO_EVO')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMode === 'CASO_EVO'
                  ? 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              [ CASO EVO ]
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('PC_MISTERIOSA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeMode === 'PC_MISTERIOSA'
                  ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              [ PC MISTERIOSA ]
            </button>
          </div>

          {/* Action buttons: Ver Revista Tomo 08 and/or Salir */}
          {onOpenTomo08 && (
            <button
              type="button"
              onClick={onOpenTomo08}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono-tech font-bold text-emerald-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Ir a la edición editorial A4 de Tomo 08"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">REVISTA TOMO 08</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Cerrar laboratorio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODE 1: APRENDER & MODE 2: FALLA SIMULADA                               */}
      {/* ======================================================================= */}
      {(activeMode === 'APRENDER' || activeMode === 'FALLA_SIMULADA') && (
        <div className="space-y-4">
          
          {/* 1. BARRA HORIZONTAL COMPACTA DE 7 GRANDES FASES */}
          <div className="bg-[#080b12] border border-zinc-800/90 rounded-2xl p-3 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono-tech px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold text-zinc-300 uppercase tracking-wider text-[10.5px]">
                  SECUENCIA DIDÁCTICA DE ARRANQUE EN 7 FASES
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-cyan-400 font-bold uppercase text-[10.5px]">
                  FASE ACTIVA: 0{currentPhase.phaseNumber} // {currentPhase.title}
                </span>
              </div>
              <div className="text-zinc-400 text-[10.5px] font-mono font-bold">
                PASO {String(currentStep.stepNumber).padStart(2, '0')} DE {totalSteps}
              </div>
            </div>

            {/* Grilla compacta de 7 Fases */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-0.5">
              {BOOT_PHASES.map((phase) => {
                const isCurrentPhase = currentPhase.id === phase.id;
                const isPassedPhase = activeVisualStepIndex > phase.endStep;

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => handleJumpToStep(phase.startStep)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer relative overflow-hidden flex flex-col justify-between select-none ${
                      isCurrentPhase
                        ? 'bg-zinc-900 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                        : isPassedPhase
                        ? 'bg-zinc-950/90 border-emerald-500/35 hover:border-emerald-500/70 text-zinc-300'
                        : 'bg-zinc-950/40 border-zinc-850 hover:border-zinc-700 text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider"
                        style={{
                          backgroundColor: isCurrentPhase ? phase.color : isPassedPhase ? '#10b98125' : '#27272a',
                          color: isCurrentPhase ? '#000000' : isPassedPhase ? '#34d399' : '#71717a',
                        }}
                      >
                        0{phase.phaseNumber}
                      </span>
                      <span className="text-[8.5px] font-mono text-zinc-500 font-bold">
                        {String(phase.startStep).padStart(2, '0')}–{String(phase.endStep).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="mt-1">
                      <div
                        className={`text-[10.5px] font-black uppercase tracking-tight truncate ${
                          isCurrentPhase ? 'text-white' : isPassedPhase ? 'text-emerald-300' : 'text-zinc-400'
                        }`}
                      >
                        {phase.title}
                      </div>
                      <div className="text-[8.5px] text-zinc-400 truncate leading-tight">
                        {phase.subtitle}
                      </div>
                    </div>

                    {/* Resaltado inferior de fase activa */}
                    {isCurrentPhase && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: phase.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. BARRA STICKY DE NAVEGACIÓN Y CONTROLES (ANTERIOR & SIGUIENTE SIEMPRE VISIBLES) */}
          <div className="sticky top-2 z-30 bg-[#090d16]/95 backdrop-blur-md border border-zinc-800/90 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              {!isPoweredOn ? (
                <button
                  type="button"
                  onClick={activeMode === 'FALLA_SIMULADA' ? handleStartSimulatedFailureRun : handlePowerOn}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                  <span>ENCENDER PC</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handlePowerOff}
                    className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-rose-500/60 text-zinc-300 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Power className="w-3.5 h-3.5 text-rose-400" />
                    <span>APAGAR</span>
                  </button>

                  {activeMode === 'APRENDER' && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={currentStepIndex <= 0}
                        className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 disabled:opacity-30 disabled:pointer-events-none text-zinc-100 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 text-cyan-400" />
                        <span>ANTERIOR</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={currentStepIndex >= totalSteps}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.35)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                      >
                        <span>SIGUIENTE PASO</span>
                        <ChevronRight className="w-4 h-4 text-black" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* En Falla Simulada: Selector de punto de falla */}
            {activeMode === 'FALLA_SIMULADA' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-bold text-[11px]">PUNTO DE FALLA:</span>
                <select
                  aria-label="Seleccionar punto de detención de falla simulada"
                  value={simulatedFailureStep ?? 12}
                  onChange={(e) => handleSelectSimulatedFailure(Number(e.target.value))}
                  className="bg-zinc-900 border border-amber-500/40 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold outline-none cursor-pointer"
                >
                  <option value={1}>Paso 01: Fuente Standby (+5VSB)</option>
                  <option value={5}>Paso 05: Estabilización PWR_OK</option>
                  <option value={7}>Paso 07: Microcódigo SPI Firmware</option>
                  <option value={12}>Paso 12: Memory Training (RAM)</option>
                  <option value={15}>Paso 15: Inicialización GPU (GOP)</option>
                  <option value={20}>Paso 20: Boot Order / NVRAM</option>
                  <option value={22}>Paso 22: Windows Boot Manager</option>
                  <option value={26}>Paso 26: Drivers BOOT_START</option>
                  <option value={30}>Paso 30: Servicios de Windows</option>
                  <option value={33}>Paso 33: explorer.exe (Desktop)</option>
                </select>
              </div>
            )}

            {/* Selector directo de paso y contador */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">PASO:</span>
                <select
                  aria-label="Seleccionar paso directo del arranque"
                  value={currentStepIndex}
                  onChange={(e) => handleJumpToStep(Number(e.target.value))}
                  className="bg-transparent text-amber-300 font-bold outline-none cursor-pointer text-xs"
                >
                  {BOOT_SEQUENCE_STEPS.map((s) => (
                    <option key={s.stepNumber} value={s.stepNumber} className="bg-zinc-900 text-zinc-200">
                      Paso {String(s.stepNumber).padStart(2, '0')}: {SIMPLE_STEP_TITLES[s.stepNumber] || s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-[9px] text-zinc-500 font-bold uppercase">ETAPA</div>
                <div className="text-xs font-bold text-amber-400 font-mono">
                  PASO {String(currentStep.stepNumber).padStart(2, '0')} / {totalSteps}
                </div>
              </div>
            </div>
          </div>

          {/* 3. TARJETA DIDÁCTICA CON TÍTULO SIMPLE, SUBTÍTULO TÉCNICO Y TRANSICIÓN DE ESTADO */}
          <div className="bg-[#0b0e16] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            {/* Header de Metadatos del Paso */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider"
                  style={{
                    backgroundColor: `${currentPhase.color}20`,
                    color: currentPhase.color,
                    border: `1px solid ${currentPhase.color}50`,
                  }}
                >
                  FASE 0{currentPhase.phaseNumber} // {currentPhase.title}
                </span>
                <span className="text-zinc-600">•</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                  style={{
                    backgroundColor: `${currentStep.layerColor}20`,
                    color: currentStep.layerColor,
                    border: `1px solid ${currentStep.layerColor}50`,
                  }}
                >
                  CAPA {currentStep.layer}
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PASO {String(currentStep.stepNumber).padStart(2, '0')} DE {totalSteps}</span>
              </div>
            </div>

            {/* Título Simple Prominente y Subtítulo Técnico Original */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                DESCRIPCIÓN DIDÁCTICA DE LA ETAPA
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display leading-snug">
                «{simpleTitle}»
              </h2>
              <div className="text-xs text-amber-300/90 font-mono flex items-center gap-1.5 pt-0.5 flex-wrap">
                <span className="text-zinc-500 font-bold uppercase">NOMBRE TÉCNICO ORIGINAL:</span>
                <strong className="text-zinc-200">{currentStep.name}</strong>
              </div>
            </div>

            {/* EXPLICACIÓN DE TRANSICIÓN EN TRES PILARES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {/* Pilar 1: ¿Qué cambió? */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>1. ¿QUÉ CAMBIÓ EN ESTE PASO?</span>
                </div>
                <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed pt-0.5">
                  {transitionInfo.whatChanged}
                </p>
              </div>

              {/* Pilar 2: Componentes en acción */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>2. COMPONENTES EN ACCIÓN</span>
                </div>
                <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed pt-0.5">
                  {transitionInfo.interveningComponents}
                </p>
                <div className="text-[10px] text-zinc-400 font-mono pt-1">
                  Circuitos: {currentStep.activeComponents.join(', ') || 'Ninguno (Standby/Off)'}
                </div>
              </div>

              {/* Pilar 3: ¿Qué debería ocurrir después? */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3. ¿QUÉ DEBERÍA OCURRIR DESPUÉS?</span>
                </div>
                <p className="text-xs text-emerald-200 font-sans-editorial leading-relaxed pt-0.5">
                  {transitionInfo.whatShouldHappenNext}
                </p>
              </div>
            </div>
          </div>

          {/* Machine Schematic & Stage Context Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Visual Machine Cabinet (Left 7 Cols) */}
            <div className="lg:col-span-7">
              <EvoBootMachineVisual
                currentStep={currentStep}
                isPoweredOn={isPoweredOn}
                isFailed={activeMode === 'FALLA_SIMULADA' && currentStepIndex === simulatedFailureStep}
              />
            </div>

            {/* Stage Forensic Context Panel (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3.5">
                {/* Stage Header Badge with Explicit Step Info */}
                <div className="pb-2 border-b border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                      style={{
                        backgroundColor: `${currentStep.layerColor}20`,
                        color: currentStep.layerColor,
                        border: `1px solid ${currentStep.layerColor}50`,
                      }}
                    >
                      CAPA {currentStep.layer}
                    </span>
                    <span className="text-[10.5px] font-bold text-amber-400 font-mono-tech">
                      ETAPA ACTUAL: PASO {String(currentStep.stepNumber).padStart(2, '0')} / {totalSteps}
                    </span>
                  </div>

                  <div className="pt-1">
                    <div className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">
                      NOMBRE DE ETAPA:
                    </div>
                    <h2 className="text-base font-bold text-white font-display leading-tight">
                      {currentStep.name}
                    </h2>
                    <div className="text-[10.5px] text-cyan-300 font-mono-tech mt-0.5">
                      ESTA ETAPA SE LLAMA: <strong className="text-white">{currentStep.name}</strong>
                    </div>
                  </div>
                </div>

                {/* Section A: What is happening / Simple Explanation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    A. ¿QUÉ ESTÁ PASANDO? // EXPLICACIÓN SIMPLE
                  </span>
                  <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80">
                    {forensicDetails.simpleExplanation || currentStep.whatIsHappening}
                  </p>
                </div>

                {/* Section B: Technical Detail */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    B. DETALLE TÉCNICO // ARQUITECTURA & REPARADOR
                  </span>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/60">
                    {forensicDetails.technicalDetail || currentStep.technicalObservation}
                  </p>
                </div>

                {/* Section C, D, E, F: Interveners, Signal, Expected Next, Visible Symptoms */}
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] space-y-2.5">
                  {/* C. Who intervenes */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-400 uppercase">C. ¿QUIÉN INTERVIENE?</span>
                    <span className="text-zinc-300 font-semibold">{currentStep.initiator} ➔ {currentStep.responder}</span>
                  </div>
                  
                  {/* D. Tracked Signal */}
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase mb-0.5">D. ¿QUÉ SEÑAL ESTAMOS SIGUIENDO?</div>
                    <div className="text-cyan-300 font-mono text-[10.5px] bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/30">
                      ⚡ {forensicDetails.signalTraveling || forensicDetails.signalFlow || `${currentStep.initiator} → ${currentStep.responder}`}
                    </div>
                  </div>

                  {/* E. What should happen next */}
                  <div className="text-[10.5px] text-emerald-300 pt-1.5 border-t border-zinc-800/70 font-sans-editorial">
                    <strong className="text-emerald-400 uppercase text-[9.5px] block mb-0.5">E. ¿QUÉ DEBERÍA PASAR DESPUÉS?</strong>
                    {currentStep.expectedResponse}
                  </div>

                  {/* F. Observable Symptoms */}
                  <div className="text-[10.5px] text-zinc-300 font-sans-editorial pt-1.5 border-t border-zinc-800/70">
                    <strong className="text-zinc-400 uppercase text-[9.5px] block mb-0.5">F. ¿QUÉ VE EL USUARIO DESDE AFUERA?</strong>
                    {forensicDetails.visibleSymptoms || currentStep.technicalObservation}
                  </div>
                </div>

                {/* Section G: Possible Failures & Detection */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <div className="text-[10px] font-bold text-rose-400 uppercase flex items-center justify-between">
                    <span>POSIBLES FALLAS DE ESTA ETAPA:</span>
                    <span className="text-[9px] text-zinc-500 font-normal">INDICIOS DE TALLER</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-zinc-300 font-sans-editorial list-disc list-inside">
                    {(forensicDetails.possibleFailures || []).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                  {forensicDetails.detectionClues && forensicDetails.detectionClues.length > 0 && (
                    <div className="mt-1.5 p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-[10px] text-rose-200">
                      <strong>Indicios de detección:</strong> {forensicDetails.detectionClues.join(' • ')}
                    </div>
                  )}
                </div>

                {/* Section H: What to verify now (3-5 checkpoints) */}
                {forensicDetails.whatToVerify && forensicDetails.whatToVerify.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block">
                      QUÉ VERIFICAR AHORA // PUNTOS DE CONTROL:
                    </span>
                    <ul className="space-y-1 text-[11px] text-zinc-300 font-sans-editorial">
                      {forensicDetails.whatToVerify.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 bg-zinc-900/40 px-2 py-1 rounded border border-zinc-800/40">
                          <span className="text-amber-400 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section I: Truco EVO */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">TRUCO EVO:</span>
                  <p className="text-cyan-200 font-sans-editorial leading-relaxed text-[11px]">
                    {forensicDetails.evoTip || 'Comprobá siempre el último eslabón confirmado antes de sospechar de software o Windows.'}
                  </p>
                </div>
              </div>

              {/* Complete Structured Workshop Verification Card */}
              {forensicDetails.structuredVerification ? (
                <div className="pt-3 border-t border-zinc-800/80 text-xs bg-zinc-950/90 p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-bold text-white uppercase">
                        CÓMO VERIFICARLO // PRUEBA DE TALLER: {forensicDetails.structuredVerification.testName}
                      </span>
                    </div>
                    <span
                      className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold ${
                        forensicDetails.structuredVerification.safetyLevel === 'USUARIO'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : forensicDetails.structuredVerification.safetyLevel === 'TECNICO'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      NIVEL {forensicDetails.structuredVerification.safetyLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase block">OBJETIVO:</span>
                      <p className="text-zinc-300 font-sans-editorial">{forensicDetails.structuredVerification.objective}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase block">HERRAMIENTAS:</span>
                      <p className="text-zinc-300 font-sans-editorial">{forensicDetails.structuredVerification.tools}</p>
                    </div>
                  </div>

                  <div className="text-[10.5px]">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase block">PROCEDIMIENTO:</span>
                    <p className="text-zinc-300 font-sans-editorial">{forensicDetails.structuredVerification.procedure}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[10px] space-y-1.5">
                    <div>
                      <strong className="text-emerald-400">Resultado esperado:</strong>{' '}
                      <span className="text-zinc-300">{forensicDetails.structuredVerification.expectedResult}</span>
                    </div>
                    <div>
                      <strong className="text-cyan-400">Si es correcto:</strong>{' '}
                      <span className="text-zinc-300">{forensicDetails.structuredVerification.ifCorrect}</span>
                    </div>
                    <div>
                      <strong className="text-rose-400">Si es incorrecto:</strong>{' '}
                      <span className="text-zinc-300">{forensicDetails.structuredVerification.ifIncorrect}</span>
                    </div>
                    <div>
                      <strong className="text-amber-400">¿Qué demuestra?</strong>{' '}
                      <span className="text-zinc-300">{forensicDetails.structuredVerification.whatItProves}</span>
                    </div>
                    <div>
                      <strong className="text-indigo-400">Siguiente paso:</strong>{' '}
                      <span className="text-zinc-300">{forensicDetails.structuredVerification.nextStep}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* EVO Methodology Footer Motto */}
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[9.5px] text-zinc-400 text-center font-mono-tech space-y-1">
                <div className="text-cyan-300 font-bold">
                  OBSERVÁ → IDENTIFICÁ LA ETAPA → CONFIRMÁ QUÉ YA FUNCIONÓ → DETECTÁ EL PRIMER EVENTO QUE FALTA → FORMULÁ HIPÓTESIS → COMPROBÁ
                </div>
                <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  NO LO CREAS. COMPROBALO.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Timeline 00 to 34 */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-zinc-300 uppercase tracking-wider">
                LÍNEA TEMPORAL DE ARRANQUE // 35 ESTADOS SECUENCIALES
              </span>
              <span className="text-[11px] text-zinc-500">
                DESCUBIERTOS: {maxUnlockedStep + 1} / 35
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {BOOT_SEQUENCE_STEPS.map((step, idx) => {
                const isCurrent = currentStepIndex === idx;
                const isUnlocked = idx <= maxUnlockedStep;
                const isFailureLocked =
                  activeMode === 'FALLA_SIMULADA' &&
                  simulatedFailureStep !== null &&
                  idx > simulatedFailureStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleJumpToStep(idx)}
                    disabled={!isUnlocked || isFailureLocked}
                    className={`min-w-[38px] h-9 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center relative ${
                      isCurrent
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] scale-105 z-10'
                        : isUnlocked && !isFailureLocked
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-700 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span>{String(idx).padStart(2, '0')}</span>
                    {!isUnlocked || isFailureLocked ? (
                      <Lock className="w-2 h-2 text-zinc-600" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODE 3: CASO EVO (DIAGNÓSTICO GUIADO)                                  */}
      {/* ======================================================================= */}
      {activeMode === 'CASO_EVO' && (
        <div className="space-y-4">
          {/* Case Selection Bar */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              {EVO_CASES.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCase(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCaseIndex === idx
                      ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {c.number}
                </button>
              ))}
            </div>

            {!caseRunning ? (
              <button
                type="button"
                onClick={handleStartCaseDiagnostic}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:brightness-110 active:scale-95 transition-all"
              >
                <Power className="w-4 h-4" />
                <span>ENCENDER PC CASO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSelectCase(selectedCaseIndex)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REINICIAR CASO</span>
              </button>
            )}
          </div>

          {/* Case Visual + Diagnostic Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Visual (Left 6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <EvoBootMachineVisual
                currentStep={currentStep}
                isPoweredOn={caseRunning}
                isFailed={caseRunning && !isCaseBooting}
              />

              {/* Initial Case dossier */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 space-y-3">
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                  {currentCase.number} // EXPEDIENTE INICIAL
                </div>
                <h3 className="text-sm font-bold text-white font-display">
                  {currentCase.titulo}
                </h3>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  {currentCase.descripcionInicial}
                </p>
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">SÍNTOMA OBSERVADO:</span>
                  <div className="text-amber-300 font-sans-editorial">{currentCase.sintomaPrincipal}</div>
                </div>
              </div>
            </div>

            {/* Diagnostic Matrix & Tests (Right 6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Hypotheses Matrix */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>MATRIZ DE HIPÓTESIS</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">EVALUÁ CON PRUEBAS</span>
                </div>

                <div className="space-y-2">
                  {caseHypotheses.map((hyp) => (
                    <div
                      key={hyp.id}
                      onClick={() => setSelectedHypothesisId(hyp.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedHypothesisId === hyp.id
                          ? 'bg-indigo-500/15 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                          : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">{hyp.name}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            hyp.initialStatus === 'CONFIRMADA'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : hyp.initialStatus === 'SOSTENIDA'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                              : hyp.initialStatus === 'DEBILITADA'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : hyp.initialStatus === 'DESCARTADA'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {hyp.initialStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans-editorial leading-tight">
                        {hyp.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Confirm Diagnosis button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">
                    {selectedHypothesisId ? 'HIPÓTESIS SELECCIONADA' : 'SELECCIONÁ UNA HIPÓTESIS'}
                  </span>
                  <button
                    type="button"
                    disabled={!selectedHypothesisId || !caseRunning || isCaseResolved}
                    onClick={() => selectedHypothesisId && handleConfirmHypothesis(selectedHypothesisId)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>EMITIR DIAGNÓSTICO</span>
                  </button>
                </div>

                {/* Feedback message */}
                {userDiagnosticFeedback && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-sans-editorial leading-relaxed animate-in fade-in">
                    ⚠️ {userDiagnosticFeedback}
                  </div>
                )}
              </div>

              {/* Diagnostic Tests Panel */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    <span>PRUEBAS DE BANCO DISPONIBLES</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">EVALUÁ SEGURIDAD</span>
                </div>

                <div className="space-y-2.5">
                  {currentCase.tests.map((test) => {
                    const isExecuted = executedTestIds.includes(test.id);

                    return (
                      <div
                        key={test.id}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isExecuted
                            ? 'bg-emerald-950/20 border-emerald-500/40'
                            : 'bg-zinc-900/60 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white">{test.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              test.level === 'USUARIO'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : test.level === 'TECNICO'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {test.level}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 font-sans-editorial mb-2">
                          <strong>Comprueba:</strong> {test.queComprueba}
                        </p>

                        {!isExecuted ? (
                          <button
                            type="button"
                            disabled={!caseRunning}
                            onClick={() => handleExecuteTest(test.id)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-cyan-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Activity className="w-3 h-3" />
                            <span>EJECUTAR PRUEBA</span>
                          </button>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-black/50 border border-emerald-500/30 text-[11px] text-emerald-200 font-sans-editorial space-y-1">
                            <div>
                              <strong>Resultado:</strong> {test.resultadoObtenido}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              <strong>Evidencia:</strong> {test.evidenciaGenerada}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resolved Case Dossier */}
              {isCaseResolved && (
                <div className="bg-[#0b0e14] border-2 border-emerald-500/60 rounded-2xl p-5 space-y-3.5 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>EXPEDIENTE EVO // RESUELTO CON ÉXITO</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display">
                    CAUSA RAÍZ CONFIRMADA:
                  </h4>
                  <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                    {currentCase.diagnosticoFinal.causa}
                  </p>
                  <div className="space-y-1.5 text-xs text-zinc-300 font-sans-editorial">
                    <div>
                      <strong className="text-cyan-400">Acción recomendada:</strong>{' '}
                      {currentCase.diagnosticoFinal.accionRecomendada}
                    </div>
                    <div>
                      <strong className="text-emerald-400">Verificación posterior:</strong>{' '}
                      {currentCase.diagnosticoFinal.verificacionPosterior}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODE 4: PC MISTERIOSA (DIAGNÓSTICO A CIEGAS)                           */}
      {/* ======================================================================= */}
      {activeMode === 'PC_MISTERIOSA' && (
        <div className="space-y-4">
          {/* Mystery Case Bar */}
          <div className="bg-[#0b0e14] border border-purple-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/40 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                  EXPEDIENTE ANÓNIMO // {currentMystery.codigoCaso}
                </span>
                <h3 className="text-sm font-bold text-white font-display">
                  PC MISTERIOSA // AUDITORÍA A CIEGAS
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateMysteryCase}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>GENERAR NUEVO CASO</span>
              </button>

              {!mysteryRunning ? (
                <button
                  type="button"
                  onClick={handleStartMysteryPowerOn}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:brightness-110 active:scale-95 transition-all"
                >
                  <Power className="w-4 h-4" />
                  <span>ENCENDER PC</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateMysteryCase}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REINICIAR</span>
                </button>
              )}
            </div>
          </div>

          {/* Mystery Visual + 4 Tabs Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Visual on Left 6 Cols */}
            <div className="lg:col-span-6 space-y-4">
              <EvoBootMachineVisual
                currentStep={currentStep}
                isPoweredOn={mysteryRunning}
                isFailed={mysteryRunning && !isMysteryBooting}
              />

              {/* Case Symptoms overview */}
              <div className="bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 space-y-2.5">
                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                  DESCRIPCIÓN DEL EQUIPO RECEPCIONADO
                </div>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  {currentMystery.descripcionPC}
                </p>
                <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">SÍNTOMA OBSERVED:</span>
                  <div className="text-amber-300 font-sans-editorial">
                    {currentMystery.sintomaObservado}
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Tabs on Right 6 Cols */}
            <div className="lg:col-span-6 bg-[#0b0e14] border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-3">
                {/* 4 Tabs Selector */}
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                  {(['EVIDENCIAS', 'HIPOTESIS', 'PRUEBAS', 'HISTORIAL'] as MysteryTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMysteryActiveTab(tab)}
                      className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                        mysteryActiveTab === tab
                          ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* TAB 1: EVIDENCIAS */}
                {mysteryActiveTab === 'EVIDENCIAS' && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">
                      REGISTRO DE EVIDENCIAS OBSERVABLES
                    </div>
                    {mysteryEvidenceLog.length === 0 ? (
                      <p className="text-xs text-zinc-500 font-sans-editorial p-4 text-center">
                        Pulsa [ ENCENDER PC ] para observar el comportamiento y recopilar las primeras evidencias.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {mysteryEvidenceLog.map((ev, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-200 font-sans-editorial leading-relaxed"
                          >
                            {ev}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: HIPÓTESIS */}
                {mysteryActiveTab === 'HIPOTESIS' && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">
                      MATRIZ DE COMPONENTES E HIPÓTESIS
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                      {ALL_MYSTERY_COMPONENTS.map((comp) => {
                        const status = mysteryHypothesisStates[comp.key] || 'SIN_EVIDENCIA';
                        const isSelected = mysterySelectedComponent === comp.key;

                        return (
                          <div
                            key={comp.key}
                            onClick={() => setMysterySelectedComponent(comp.key)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-purple-500/15 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="font-bold text-white text-[11px] mb-1">{comp.label}</div>
                            <span
                              className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold ${
                                status === 'CONFIRMADA'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : status === 'SOSTENIDA'
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : status === 'DEBILITADA'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : status === 'DESCARTADA'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: PRUEBAS */}
                {mysteryActiveTab === 'PRUEBAS' && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">
                      PRUEBAS DE DIAGNÓSTICO FORENSE
                    </div>
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {currentMystery.pruebasDisponibles.map((test) => {
                        const isExecuted = mysteryExecutedTests.includes(test.id);
                        const isWhyOpen = mysteryExpandedWhy === test.id;

                        return (
                          <div
                            key={test.id}
                            className={`p-3 rounded-xl border text-xs transition-all ${
                              isExecuted
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : 'bg-zinc-900/60 border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-white">{test.nombre}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                  test.nivel === 'USUARIO'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : test.nivel === 'TECNICO'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                {test.nivel}
                              </span>
                            </div>

                            <p className="text-[11px] text-zinc-400 font-sans-editorial mb-2">
                              {test.queIntentaComprobar}
                            </p>

                            <div className="flex items-center gap-2">
                              {!isExecuted ? (
                                <button
                                  type="button"
                                  disabled={!mysteryRunning}
                                  onClick={() => handleExecuteMysteryTest(test)}
                                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-purple-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                                >
                                  <Activity className="w-3 h-3" />
                                  <span>EJECUTAR PRUEBA</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>EJECUTADA</span>
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  setMysteryExpandedWhy(isWhyOpen ? null : test.id)
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10.5px] flex items-center gap-1 transition-colors"
                              >
                                <HelpCircle className="w-3 h-3" />
                                <span>¿POR QUÉ?</span>
                              </button>
                            </div>

                            {/* Why explanation accordion */}
                            {isWhyOpen && (
                              <div className="mt-2 p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-[11px] text-zinc-300 font-sans-editorial leading-relaxed animate-in fade-in">
                                {test.porQueExplicacion}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 4: HISTORIAL */}
                {mysteryActiveTab === 'HISTORIAL' && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase">
                      LÍNEA DE ACCIONES FORENSES
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {mysteryHistoryLog.map((log, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs space-y-0.5 font-sans-editorial"
                        >
                          <div className="flex items-center justify-between text-[10px] text-purple-400 font-mono-tech">
                            <span>{log.action}</span>
                            <span>{log.timestamp}</span>
                          </div>
                          <div className="text-zinc-300 text-[11px]">{log.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Emit Diagnosis Area */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400">
                    {mysterySelectedComponent ? (
                      <span>
                        HIPÓTESIS SELECCIONADA:{' '}
                        <strong className="text-white">
                          {ALL_MYSTERY_COMPONENTS.find((c) => c.key === mysterySelectedComponent)?.label}
                        </strong>
                      </span>
                    ) : (
                      'SELECCIONÁ UN COMPONENTE EN LA PESTAÑA HIPÓTESIS'
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={!mysterySelectedComponent || !mysteryRunning || isMysteryResolved}
                    onClick={handleEmitMysteryDiagnosis}
                    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>EMITIR DIAGNÓSTICO</span>
                  </button>
                </div>

                {mysteryDiagnosticMessage && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-sans-editorial leading-relaxed animate-in fade-in ${
                      mysteryDiagnosticMessage.type === 'SUCCESS'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {mysteryDiagnosticMessage.text}
                  </div>
                )}

                {/* Resolved Mystery Dossier */}
                {isMysteryResolved && (
                  <div className="bg-[#0b0e14] border-2 border-purple-500/60 rounded-2xl p-5 space-y-3 shadow-[0_0_30px_rgba(168,85,247,0.2)] animate-in fade-in">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>EXPEDIENTE EVO // RESUELTO CON ÉXITO</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-display">
                      CAUSA RAÍZ: {currentMystery.causaRaiz}
                    </h4>
                    <div className="space-y-1 text-xs text-zinc-300 font-sans-editorial">
                      <div>
                        <strong className="text-purple-400">Acción:</strong> {currentMystery.accionRecomendada}
                      </div>
                      <div>
                        <strong className="text-emerald-400">Verificación:</strong> {currentMystery.verificacionPosterior}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 font-sans-editorial space-y-1">
                      <span className="font-bold text-zinc-300 block text-[10px] uppercase">RUTA DE RAZONAMIENTO:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {currentMystery.rutaRazonamiento.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
