import React, { useState } from 'react';
import {
  BOOT_SEQUENCE_STEPS,
  BootStep,
  EVO_CASES,
  EvoCase,
  CaseHypothesis,
  HypothesisStatus,
  MYSTERY_CASES_POOL,
  MysteryCase,
  MysteryComponentKey,
  MysteryHypothesisState,
  ALL_MYSTERY_COMPONENTS,
} from './bootSequenceData';
import { EvoBootMachineVisual } from './EvoBootMachineVisual';
import {
  Power,
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
  HelpCircle as QuestionIcon,
  Compass,
  History,
  Check,
  RefreshCw,
} from 'lucide-react';

interface EvoBootLabProps {
  onClose?: () => void;
}

type LabMode = 'APRENDER' | 'FALLA_SIMULADA' | 'CASO_EVO' | 'PC_MISTERIOSA';
type MysteryTab = 'EVIDENCIAS' | 'HIPOTESIS' | 'PRUEBAS' | 'HISTORIAL';

export const EvoBootLab: React.FC<EvoBootLabProps> = ({ onClose }) => {
  // Global Mode switcher
  const [activeMode, setActiveMode] = useState<LabMode>('APRENDER');

  // APRENDER & FALLA SIMULADA Mode States
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(0);
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
  const [simulatedFailureStep, setSimulatedFailureStep] = useState<number | null>(null);

  // CASO EVO Mode States
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [caseRunning, setCaseRunning] = useState<boolean>(false);
  const [caseStepReached, setCaseStepReached] = useState<number>(0);
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

  const currentCase: EvoCase = EVO_CASES[selectedCaseIndex];
  const currentMystery: MysteryCase = MYSTERY_CASES_POOL[mysteryCaseIndex];

  // Active step for machine visual depending on mode
  let currentStep: BootStep = BOOT_SEQUENCE_STEPS[currentStepIndex];
  if (activeMode === 'CASO_EVO' && caseRunning) {
    currentStep = BOOT_SEQUENCE_STEPS[caseStepReached];
  } else if (activeMode === 'PC_MISTERIOSA' && mysteryRunning) {
    currentStep = BOOT_SEQUENCE_STEPS[currentMystery.stopStep];
  }

  const totalSteps = BOOT_SEQUENCE_STEPS.length - 1; // 0 to 34

  // Switch Case in CASO EVO
  const handleSelectCase = (caseIndex: number) => {
    setSelectedCaseIndex(caseIndex);
    const targetCase = EVO_CASES[caseIndex];
    setCaseRunning(false);
    setCaseStepReached(0);
    setExecutedTestIds([]);
    setCaseHypotheses(targetCase.hypotheses);
    setAccumulatedEvidence([]);
    setSelectedHypothesisId(null);
    setUserDiagnosticFeedback(null);
    setIsCaseResolved(false);
  };

  // Launch Diagnostic Sequence in CASO EVO
  const handleStartCaseDiagnostic = () => {
    setCaseRunning(true);
    setCaseStepReached(currentCase.stopStep);
    setCaseHypotheses(currentCase.hypotheses);
    setAccumulatedEvidence([...currentCase.evidenciaInicial]);
    setExecutedTestIds([]);
    setSelectedHypothesisId(null);
    setUserDiagnosticFeedback(null);
    setIsCaseResolved(false);
  };

  // Execute Safe Test in CASO EVO
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
          newStatus = test.esPruebaConfirmatoria ? 'CONFIRMED' : 'SUPPORTED';
        } else if (test.hipotesisDebilita.includes(hyp.id)) {
          newStatus = 'WEAKENED';
        }
        return { ...hyp, initialStatus: newStatus };
      })
    );

    setUserDiagnosticFeedback(null);
  };

  // Confirm Diagnosis in CASO EVO
  const handleConfirmHypothesis = (hypId: string) => {
    const isCorrect = hypId === currentCase.correctDiagnosis;
    const hasTested = executedTestIds.length > 0;

    if (isCorrect && hasTested) {
      setIsCaseResolved(true);
      setUserDiagnosticFeedback(null);
      setCaseHypotheses((prev) =>
        prev.map((h) =>
          h.id === hypId
            ? { ...h, initialStatus: 'CONFIRMED' }
            : { ...h, initialStatus: 'DISCARDED' }
        )
      );
    } else if (isCorrect && !hasTested) {
      setUserDiagnosticFeedback(
        'LA EVIDENCIA TODAVÍA NO SOSTIENE ESTA HIPÓTESIS: Ejecuta al menos una prueba segura para comprobar metódicamente antes de concluir.'
      );
    } else {
      setUserDiagnosticFeedback(
        'LA EVIDENCIA TODAVÍA NO SOSTIENE ESTA HIPÓTESIS: La etapa de detención y los resultados de las pruebas descartan este componente en la cadena de arranque.'
      );
    }
  };

  // =========================================================================
  // PC MISTERIOSA HANDLERS
  // =========================================================================

  const handleGenerateMysteryCase = () => {
    const nextIndex = (mysteryCaseIndex + 1) % MYSTERY_CASES_POOL.length;
    setMysteryCaseIndex(nextIndex);
    setMysteryRunning(false);
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
    setMysteryRunning(true);
    setMysteryEvidenceLog([
      `SÍNTOMA: ${currentMystery.sintomaObservado}`,
      `DETENCIÓN: La secuencia se detuvo en ${currentMystery.etapaProducida}.`,
      `OBSERVACIÓN: ${currentMystery.observacionTecnica}`,
    ]);
    setMysteryHistoryLog((prev) => [
      ...prev,
      {
        timestamp: '00:02',
        action: 'ENCENDIDO DE PC',
        note: `PC encendida. La secuencia avanzó normalmente y se detuvo en ${currentMystery.ultimoEstadoConfirmado}.`,
      },
    ]);

    // Initial deduction logic: mark components before stopStep as possible, others with no evidence or weakened
    setMysteryHypothesisStates((prev) => {
      const updated = { ...prev };
      ALL_MYSTERY_COMPONENTS.forEach((comp) => {
        updated[comp.key] = 'POSSIBLE';
      });
      return updated;
    });
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
        timestamp: '00:05',
        action: `PRUEBA EJECUTADA: ${test.nombre}`,
        note: test.resultadoObservado,
      },
    ]);

    // Update hypothesis states without fake percentages
    setMysteryHypothesisStates((prev) => {
      const updated = { ...prev };

      // Strengthen hypotheses
      test.hipotesisFortalece.forEach((key) => {
        updated[key] = test.esDecisiva ? 'CONFIRMADA' : 'SOSTENIDA';
      });

      // Weaken hypotheses
      test.hipotesisDebilita.forEach((key) => {
        if (updated[key] !== 'CONFIRMADA') {
          updated[key] = 'DEBILITADA';
        }
      });

      // Discard hypotheses
      test.hipotesisDescarta.forEach((key) => {
        if (updated[key] !== 'CONFIRMADA') {
          updated[key] = 'DESCARTADA';
        }
      });

      return updated;
    });

    setMysteryDiagnosticMessage(null);
  };

  const handleConfirmMysteryDiagnosis = (componentKey: MysteryComponentKey) => {
    const isCorrect = componentKey === currentMystery.correctComponent;
    const hasExecutedTests = mysteryExecutedTests.length > 0;

    if (!hasExecutedTests) {
      setMysteryDiagnosticMessage({
        type: 'ERROR',
        text: 'DIAGNÓSTICO NO DEMOSTRADO: No has realizado ninguna prueba segura aún. La metodología EVO exige comprobar la hipótesis antes de emitir un dictamen.',
      });
      return;
    }

    if (isCorrect) {
      setIsMysteryResolved(true);
      setMysteryDiagnosticMessage({
        type: 'SUCCESS',
        text: '¡DIAGNÓSTICO CONFIRMADO! Has localizado con éxito la causa raíz mediante deducción y evidencia concluyente.',
      });
      setMysteryHypothesisStates((prev) => {
        const updated = { ...prev };
        ALL_MYSTERY_COMPONENTS.forEach((c) => {
          updated[c.key] = c.key === componentKey ? 'CONFIRMADA' : 'DESCARTADA';
        });
        return updated;
      });
      setMysteryHistoryLog((prev) => [
        ...prev,
        {
          timestamp: '00:10',
          action: 'DICTAMEN EMITIDO',
          note: `Diagnóstico confirmado con éxito: ${currentMystery.causaRaiz}`,
        },
      ]);
    } else {
      setMysteryDiagnosticMessage({
        type: 'ERROR',
        text: 'DIAGNÓSTICO NO DEMOSTRADO: La evidencia actual no sostiene este componente como causa raíz de la falla. Revisa la etapa de detención y las pruebas realizadas.',
      });
      setMysteryHypothesisStates((prev) => ({
        ...prev,
        [componentKey]: 'DEBILITADA',
      }));
      setMysteryHistoryLog((prev) => [
        ...prev,
        {
          timestamp: '00:08',
          action: 'HIPÓTESIS RECHAZADA',
          note: `Se evaluó ${componentKey} pero la evidencia acumulada no demostró causalidad.`,
        },
      ]);
    }
  };

  // Standard Learn Mode controls
  const handlePowerOn = () => {
    setIsPoweredOn(true);
    setCurrentStepIndex(1);
    setMaxUnlockedStep((prev) => Math.max(prev, 1));
  };

  const handlePowerOff = () => {
    setIsPoweredOn(false);
    setCurrentStepIndex(0);
    setSimulatedFailureStep(null);
  };

  const handleNextStep = () => {
    if (!isPoweredOn || currentStepIndex === 0) {
      handlePowerOn();
      return;
    }
    if (currentStepIndex < totalSteps) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setMaxUnlockedStep((prev) => Math.max(prev, nextIndex));
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 1) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentStepIndex === 1) {
      handlePowerOff();
    }
  };

  const handleSelectStep = (index: number) => {
    if (activeMode === 'APRENDER') {
      if (index > maxUnlockedStep) return;
      if (index === 0) {
        handlePowerOff();
      } else {
        setIsPoweredOn(true);
        setCurrentStepIndex(index);
      }
    } else if (activeMode === 'FALLA_SIMULADA') {
      setIsPoweredOn(true);
      setCurrentStepIndex(index);
      setSimulatedFailureStep(index);
    }
  };

  const getSafetyBadge = (level: 'USUARIO' | 'TECNICO' | 'BANCO') => {
    switch (level) {
      case 'USUARIO':
        return {
          label: 'NIVEL: USUARIO',
          subtitle: 'Prueba segura / No invasiva',
          icon: <UserCheck className="w-3.5 h-3.5 text-emerald-400" />,
          badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        };
      case 'TECNICO':
        return {
          label: 'NIVEL: TÉCNICO',
          subtitle: 'Requiere conocimiento e instrumental adecuado',
          icon: <Wrench className="w-3.5 h-3.5 text-amber-400" />,
          badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        };
      case 'BANCO':
        return {
          label: 'NIVEL: BANCO DE PRUEBAS',
          subtitle: 'Requiere instrumental adecuado / Banco aislado desenergizado',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />,
          badgeClass: 'bg-orange-500/15 border-orange-500/40 text-orange-300',
        };
    }
  };

  const currentSafetyInfo = getSafetyBadge(currentStep.safetyLevel);

  return (
    <div className="w-full min-h-screen bg-[#06080b] text-zinc-100 flex flex-col font-mono-tech select-none">
      {/* Top Banner & Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-[#080b10]/95 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-black text-sm shadow-md font-display">
            T08
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                TOMO 08 // DEL BOTÓN POWER A WINDOWS
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                REV. 2026
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white uppercase font-display tracking-tight">
              LABORATORIO VIRTUAL DE ARRANQUE Y DIAGNÓSTICO EVO
            </h1>
          </div>
        </div>

        {/* Provenance and Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>SIMULATED / EXPECTED BEHAVIOR</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Cerrar Laboratorio de Arranque"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Mode Selector Navigation (4 MODES) */}
      <div className="bg-[#080b10] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold hidden md:inline">
            MODO DE LABORATORIO:
          </span>
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveMode('APRENDER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'APRENDER'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>APRENDER</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('FALLA_SIMULADA');
                setIsPoweredOn(true);
                if (currentStepIndex === 0) setCurrentStepIndex(12);
                setSimulatedFailureStep(currentStepIndex === 0 ? 12 : currentStepIndex);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'FALLA_SIMULADA'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>FALLA SIMULADA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('CASO_EVO');
                handleSelectCase(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'CASO_EVO'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>CASO EVO</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('PC_MISTERIOSA');
                handleGenerateMysteryCase();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'PC_MISTERIOSA'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-md'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>PC MISTERIOSA</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-zinc-400 font-mono-tech hidden sm:flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>EVO FORENSICS // “NO LO CREAS. COMPROBALO.”</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* ========================================================================= */}
        {/* MODE 4: PC MISTERIOSA (BLIND REALISTIC DIAGNOSTICS) */}
        {/* ========================================================================= */}
        {activeMode === 'PC_MISTERIOSA' ? (
          <div className="space-y-6">
            {/* Top Bar for Mystery Mode */}
            <section className="bg-[#0b0e14] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      MODO CIEGO // DIAGNÓSTICO EN TIEMPO REAL
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {currentMystery.codigoCaso}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-tight">
                    PC MISTERIOSA // EXPEDIENTE DESCONOCIDO
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateMysteryCase}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>GENERAR NUEVO CASO</span>
                  </button>

                  {!mysteryRunning && !isMysteryResolved && (
                    <button
                      type="button"
                      onClick={handleStartMysteryPowerOn}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer"
                    >
                      <Power className="w-4 h-4 text-black" />
                      <span>[ ENCENDER PC ]</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Patient Machine Description & Symptom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    DESCRIPCIÓN DEL EQUIPO
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial">
                    {currentMystery.descripcionPC}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>SÍNTOMA REPORTADO INICIAL</span>
                  </span>
                  <p className="text-xs sm:text-sm text-amber-200/90 font-sans-editorial">
                    {currentMystery.sintomaObservado}
                  </p>
                </div>
              </div>

              {/* Mystery Execution State */}
              {mysteryRunning && (
                <div className="space-y-6 pt-2">
                  {/* Visual Machine Representation at stop point */}
                  <EvoBootMachineVisual
                    currentStep={BOOT_SEQUENCE_STEPS[currentMystery.stopStep]}
                    isPoweredOn={true}
                  />

                  {/* Observable Forensic Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        ÚLTIMO ESTADO CONFIRMADO
                      </span>
                      <p className="text-xs font-bold text-zinc-200 font-display">
                        {currentMystery.ultimoEstadoConfirmado}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        SIGUIENTE ETAPA
                      </span>
                      <p className="text-xs font-bold text-rose-200 font-display">
                        {currentMystery.siguienteEtapa}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        OBSERVACIÓN TÉCNICA
                      </span>
                      <p className="text-xs font-bold text-blue-200 font-display">
                        {currentMystery.observacionTecnica}
                      </p>
                    </div>
                  </div>

                  {/* Investigation Panel Tabs */}
                  <div className="bg-[#07090e] border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 overflow-x-auto">
                      <div className="flex items-center gap-2">
                        {(
                          ['EVIDENCIAS', 'HIPOTESIS', 'PRUEBAS', 'HISTORIAL'] as MysteryTab[]
                        ).map((tab) => {
                          const isActive = mysteryActiveTab === tab;
                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setMysteryActiveTab(tab)}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-amber-400 text-black shadow-md'
                                  : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800'
                              }`}
                            >
                              {tab === 'HIPOTESIS' ? 'HIPÓTESIS' : tab}
                              {tab === 'EVIDENCIAS' && ` (${mysteryEvidenceLog.length})`}
                              {tab === 'PRUEBAS' &&
                                ` (${mysteryExecutedTests.length}/${currentMystery.pruebasDisponibles.length})`}
                            </button>
                          );
                        })}
                      </div>

                      <span className="text-[10px] text-zinc-500 font-mono-tech hidden sm:inline">
                        MÉTODO EVO: OBSERVAR → FORMULAR → COMPROBAR
                      </span>
                    </div>

                    {/* TAB: EVIDENCIAS */}
                    {mysteryActiveTab === 'EVIDENCIAS' && (
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                          REGISTRO DE EVIDENCIAS DESCUBIERTAS
                        </span>
                        {mysteryEvidenceLog.length === 0 ? (
                          <p className="text-xs text-zinc-500 italic">
                            Aún no se han descubierto evidencias. Enciende la PC o ejecuta pruebas.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {mysteryEvidenceLog.map((ev, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 text-xs text-zinc-200 font-sans-editorial flex items-start gap-2.5"
                              >
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                <span>{ev}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: HIPÓTESIS */}
                    {mysteryActiveTab === 'HIPOTESIS' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                            MATRIZ DE COMPONENTES E HIPÓTESIS
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            SELECCIONA UN COMPONENTE PARA EMITIR DICTAMEN
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {ALL_MYSTERY_COMPONENTS.map((comp) => {
                            const state = mysteryHypothesisStates[comp.key];
                            const isSelected = mysterySelectedComponent === comp.key;

                            return (
                              <div
                                key={comp.key}
                                onClick={() => setMysterySelectedComponent(comp.key)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                                  isSelected
                                    ? 'bg-amber-950/30 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                    : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white uppercase">
                                    {comp.label}
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                      state === 'CONFIRMADA'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                        : state === 'SOSTENIDA'
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                                        : state === 'DEBILITADA'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                        : state === 'DESCARTADA'
                                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 line-through'
                                        : state === 'POSSIBLE'
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                                    }`}
                                  >
                                    {state.replace('_', ' ')}
                                  </span>
                                </div>

                                {isSelected && !isMysteryResolved && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmMysteryDiagnosis(comp.key);
                                    }}
                                    className="w-full mt-2 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    [ EMITIR DIAGNÓSTICO: {comp.label.split('/')[0]} ]
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {mysteryDiagnosticMessage && (
                          <div
                            className={`p-3.5 rounded-xl border text-xs font-sans-editorial leading-relaxed ${
                              mysteryDiagnosticMessage.type === 'SUCCESS'
                                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                            }`}
                          >
                            {mysteryDiagnosticMessage.text}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB: PRUEBAS */}
                    {mysteryActiveTab === 'PRUEBAS' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                            PRUEBAS DE DIAGNÓSTICO Y COMPROBACIÓN
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            EVALUACIÓN METÓDICA DE HIPÓTESIS
                          </span>
                        </div>

                        <div className="space-y-3">
                          {currentMystery.pruebasDisponibles.map((test) => {
                            const isExecuted = mysteryExecutedTests.includes(test.id);
                            const isWhyOpen = mysteryExpandedWhy === test.id;
                            const sInfo = getSafetyBadge(test.nivel);

                            return (
                              <div
                                key={test.id}
                                className={`p-4 rounded-xl border space-y-3 transition-all ${
                                  isExecuted
                                    ? 'bg-zinc-950 border-emerald-500/40'
                                    : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-white">
                                    {test.nombre}
                                  </span>
                                  <div
                                    className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 self-start sm:self-auto ${sInfo.badgeClass}`}
                                  >
                                    {sInfo.icon}
                                    <span>{sInfo.label}</span>
                                  </div>
                                </div>

                                <p className="text-xs text-zinc-400 font-sans-editorial">
                                  <strong className="text-zinc-300 font-mono-tech uppercase">
                                    Qué intenta comprobar:{' '}
                                  </strong>
                                  {test.queIntentaComprobar}
                                </p>

                                {test.riesgoAdvertencia && (
                                  <div className="px-3 py-1 rounded bg-amber-950/20 border border-amber-500/30 text-[10px] text-amber-300">
                                    {test.riesgoAdvertencia}
                                  </div>
                                )}

                                {!isExecuted ? (
                                  <button
                                    type="button"
                                    onClick={() => handleExecuteMysteryTest(test)}
                                    className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                                  >
                                    [ EJECUTAR PRUEBA ]
                                  </button>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 font-sans-editorial">
                                      <strong className="text-emerald-400 font-mono-tech uppercase block">
                                        Resultado Observado:
                                      </strong>
                                      {test.resultadoObservado}
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setMysteryExpandedWhy(isWhyOpen ? null : test.id)
                                        }
                                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                                      >
                                        <QuestionIcon className="w-3.5 h-3.5" />
                                        <span>[ {isWhyOpen ? 'OCULTAR' : '¿POR QUÉ?'} ]</span>
                                      </button>
                                    </div>

                                    {isWhyOpen && (
                                      <div className="p-3 rounded-lg bg-[#070b12] border border-cyan-500/30 text-xs text-cyan-200 font-sans-editorial leading-relaxed animate-in fade-in duration-150">
                                        <strong className="text-cyan-400 font-mono-tech uppercase block">
                                          Razonamiento Técnico de Evidencia:
                                        </strong>
                                        {test.porQueExplicacion}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TAB: HISTORIAL */}
                    {mysteryActiveTab === 'HISTORIAL' && (
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block">
                          LÍNEA DE ACCIONES DE INVESTIGACIÓN
                        </span>
                        <div className="space-y-2">
                          {mysteryHistoryLog.map((h, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-amber-400">{h.action}</span>
                                <span className="text-zinc-500">{h.timestamp}</span>
                              </div>
                              <p className="text-zinc-300 font-sans-editorial">{h.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ========================================================= */}
                  {/* EXPEDIENTE FINAL RESUELTO FOR PC MISTERIOSA */}
                  {/* ========================================================= */}
                  {isMysteryResolved && (
                    <section className="bg-[#080d14] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.2)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between pb-4 border-b border-emerald-500/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-black flex items-center justify-center font-black">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                              DICTAMEN PERICIAL FINALIZADO
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-display">
                              EXPEDIENTE EVO // RESUELTO
                            </h3>
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold">
                          {currentMystery.codigoCaso}
                        </div>
                      </div>

                      {/* Expediente Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            SÍNTOMA INICIAL
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentMystery.sintomaObservado}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            PUNTO DE DETENCIÓN OBSERVADO
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentMystery.etapaProducida}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 md:col-span-2">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            CAUSA RAÍZ
                          </span>
                          <p className="text-sm font-bold text-emerald-200 font-sans-editorial">
                            {currentMystery.causaRaiz}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                            PRUEBA DECISIVA
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentMystery.pruebaDecisivaNombre}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            ACCIÓN RECOMENDADA
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentMystery.accionRecomendada}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 md:col-span-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            VERIFICACIÓN POSTERIOR DE INTEGRIDAD
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentMystery.verificacionPosterior}
                          </p>
                        </div>

                        {/* RUTA DE RAZONAMIENTO */}
                        <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 space-y-2 md:col-span-2">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                            RUTA DE RAZONAMIENTO FORENSE
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-300 font-mono-tech">
                            {currentMystery.rutaRazonamiento.map((stepTxt, sIdx) => (
                              <React.Fragment key={sIdx}>
                                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700">
                                  {stepTxt}
                                </span>
                                {sIdx < currentMystery.rutaRazonamiento.length - 1 && (
                                  <ArrowRight className="w-3 h-3 text-amber-400" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Philosophy */}
                      <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 text-center space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono-tech">
                          FILOSOFÍA EVO DE DIAGNÓSTICO
                        </span>
                        <div className="text-xs font-bold text-amber-300 tracking-wider font-mono-tech">
                          “NO LO CREAS. COMPROBALO.”
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}
            </section>
          </div>
        ) : activeMode === 'CASO_EVO' ? (
          /* ========================================================================= */
          /* MODE 3: CASO EVO */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Case Picker Strip */}
            <div className="bg-[#0b0e14] border border-zinc-800/80 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SELECCIÓN DE CASO FORENSE EVO</span>
                </span>
                <span className="text-[10px] text-zinc-500">
                  {EVO_CASES.length} CASOS DE DIAGNÓSTICO
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {EVO_CASES.map((caso, cIdx) => {
                  const isSelected = selectedCaseIndex === cIdx;
                  return (
                    <button
                      key={caso.id}
                      type="button"
                      onClick={() => handleSelectCase(cIdx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-black/40 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black ${
                            isSelected ? 'text-cyan-400' : 'text-zinc-500'
                          }`}
                        >
                          {caso.number}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                        {caso.titulo}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case Overview & Launch Section */}
            <section className="bg-[#0b0e14] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                <div>
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    {currentCase.number} // EXPEDIENTE DE DIAGNÓSTICO
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase font-display">
                    {currentCase.titulo}
                  </h2>
                </div>

                {!caseRunning && !isCaseResolved ? (
                  <button
                    type="button"
                    onClick={handleStartCaseDiagnostic}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
                  >
                    <Power className="w-4 h-4 text-black" />
                    <span>[ INICIAR DIAGNÓSTICO ]</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectCase(selectedCaseIndex)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>REINICIAR CASO</span>
                  </button>
                )}
              </div>

              {/* Initial Symptom Overview */}
              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>SÍNTOMA OBSERVADO POR EL USUARIO</span>
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 font-sans-editorial leading-relaxed">
                  {currentCase.descripcionInicial}
                </p>
              </div>

              {/* Case Diagnostic Dashboard when Running */}
              {caseRunning && (
                <div className="space-y-6 pt-2">
                  <EvoBootMachineVisual
                    currentStep={BOOT_SEQUENCE_STEPS[caseStepReached]}
                    isPoweredOn={true}
                  />

                  {/* Sequential Chain Failure Summary Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        ÚLTIMO PASO CONFIRMADO
                      </span>
                      <p className="text-xs font-bold text-zinc-200 font-display">
                        Paso {currentCase.ultimoPasoConfirmado.toString().padStart(2, '0')}:{' '}
                        {BOOT_SEQUENCE_STEPS[currentCase.ultimoPasoConfirmado]?.name}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        PRIMER PASO NO COMPLETADO
                      </span>
                      <p className="text-xs font-bold text-rose-200 font-display">
                        Paso {currentCase.primerPasoNoCompletado.toString().padStart(2, '0')}:{' '}
                        {currentCase.falloEnPasoNombre}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        ESTADO DE LA SECUENCIA
                      </span>
                      <p className="text-xs font-bold text-blue-200 font-display">
                        DETENIDO EN PASO {currentCase.stopStep.toString().padStart(2, '0')} / 34
                      </p>
                    </div>
                  </div>

                  {/* Evidence Box */}
                  <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>EVIDENCIA DISPONIBLE ({accumulatedEvidence.length} REGISTROS)</span>
                    </span>
                    <ul className="space-y-1.5">
                      {accumulatedEvidence.map((ev, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-zinc-300 font-sans-editorial flex items-start gap-2 bg-[#07090e] p-2 rounded-lg border border-zinc-800/80"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Two Column Layout: Hypotheses vs Tests */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Hypotheses Engine */}
                    <div className="bg-[#07090e] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>FORMULACIÓN DE HIPÓTESIS</span>
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          SELECCIONA PARA COMPROBAR
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {caseHypotheses.map((hyp) => {
                          const isSelected = selectedHypothesisId === hyp.id;
                          return (
                            <div
                              key={hyp.id}
                              onClick={() => setSelectedHypothesisId(hyp.id)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                                isSelected
                                  ? 'bg-cyan-950/30 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                  : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white uppercase">
                                  {hyp.component}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                    hyp.initialStatus === 'CONFIRMED'
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                                      : hyp.initialStatus === 'SUPPORTED'
                                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                                      : hyp.initialStatus === 'WEAKENED'
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                      : hyp.initialStatus === 'DISCARDED'
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 line-through'
                                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                  }`}
                                >
                                  ESTADO: {hyp.initialStatus}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300 font-sans-editorial">
                                {hyp.name}
                              </p>

                              {isSelected && !isCaseResolved && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirmHypothesis(hyp.id);
                                  }}
                                  className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  [ CONFIRMAR ESTE DIAGNÓSTICO ]
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {userDiagnosticFeedback && (
                        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs font-sans-editorial leading-relaxed">
                          {userDiagnosticFeedback}
                        </div>
                      )}
                    </div>

                    {/* Right: Diagnostic Tests */}
                    <div className="bg-[#07090e] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-400" />
                          <span>PRUEBAS DE COMPROBACIÓN SEGURA</span>
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {executedTestIds.length}/{currentCase.tests.length} EJECUTADAS
                        </span>
                      </div>

                      <div className="space-y-3">
                        {currentCase.tests.map((test) => {
                          const isExecuted = executedTestIds.includes(test.id);
                          const sInfo = getSafetyBadge(test.level);

                          return (
                            <div
                              key={test.id}
                              className={`p-3.5 rounded-xl border space-y-2.5 transition-all ${
                                isExecuted
                                  ? 'bg-zinc-950 border-emerald-500/40'
                                  : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white">
                                  {test.name}
                                </span>
                                <div
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 self-start sm:self-auto ${sInfo.badgeClass}`}
                                >
                                  {sInfo.icon}
                                  <span>{sInfo.label}</span>
                                </div>
                              </div>

                              <p className="text-xs text-zinc-400 font-sans-editorial">
                                <strong className="text-zinc-300 font-mono-tech uppercase">
                                  Qué comprueba:{' '}
                                </strong>
                                {test.queComprueba}
                              </p>

                              {!isExecuted ? (
                                <button
                                  type="button"
                                  onClick={() => handleExecuteTest(test.id)}
                                  className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  [ EJECUTAR PRUEBA SEGURA ]
                                </button>
                              ) : (
                                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 font-sans-editorial leading-relaxed">
                                  <strong className="text-emerald-400 font-mono-tech uppercase block">
                                    Resultado Obtenido:
                                  </strong>
                                  {test.resultadoObtenido}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Expediente EVO Resolved in CASO EVO */}
                  {isCaseResolved && (
                    <section className="bg-[#080d14] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.2)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between pb-4 border-b border-emerald-500/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-400 text-black flex items-center justify-center font-black">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                              DICTAMEN PERICIAL FINALIZADO
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-display">
                              EXPEDIENTE EVO // DIAGNÓSTICO CONFIRMADO
                            </h3>
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold">
                          CASO RESUELTO CON ÉXITO
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            CASO & SÍNTOMA INICIAL
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentCase.number}: {currentCase.sintomaPrincipal}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            ESLABÓN DE DETENCIÓN
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentCase.diagnosticoFinal.pasoDetencion} (Último paso OK:{' '}
                            {currentCase.ultimoPasoConfirmado})
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 md:col-span-2">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            CAUSA RAÍZ CONFIRMADA
                          </span>
                          <p className="text-sm font-bold text-emerald-200 font-sans-editorial">
                            {currentCase.diagnosticoFinal.causa}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                            PRUEBA QUE CONFIRMÓ LA HIPÓTESIS
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentCase.diagnosticoFinal.pruebaConfirmatoria}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            ACCIÓN RECOMENDADA
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentCase.diagnosticoFinal.accionRecomendada}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-1 md:col-span-2">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            VERIFICACIÓN POSTERIOR DE INTEGRIDAD
                          </span>
                          <p className="text-zinc-200 font-sans-editorial">
                            {currentCase.diagnosticoFinal.verificacionPosterior}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 text-center space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono-tech">
                          FILOSOFÍA EVO DE DIAGNÓSTICO
                        </span>
                        <div className="text-xs font-bold text-amber-300 tracking-wider font-mono-tech">
                          “NO LO CREAS. COMPROBALO.”
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}
            </section>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODES 1 & 2: APRENDER / FALLA SIMULADA */
          /* ========================================================================= */
          <>
            {/* Top Control & Progress Section */}
            <section className="bg-[#0b0e14] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3 sm:gap-4">
                {!isPoweredOn ? (
                  <button
                    type="button"
                    onClick={handlePowerOn}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Power className="w-5 h-5 text-black" />
                    <span>[ ENCENDER PC ]</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePowerOff}
                    className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/50 text-zinc-300 hover:text-red-300 font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer"
                    title="Apagar y volver a paso 00"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>APAGAR / REINICIAR</span>
                  </button>
                )}

                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                    {activeMode === 'FALLA_SIMULADA'
                      ? 'INSPECCIÓN DE FALLA'
                      : 'PROGRESO DEL ARRANQUE'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                    PASO {currentStep.stepNumber.toString().padStart(2, '0')} /{' '}
                    <span className="text-zinc-500">{totalSteps}</span>
                  </div>
                </div>
              </div>

              {activeMode === 'APRENDER' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      currentStepIndex === 0
                        ? 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200 cursor-pointer shadow'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ANTERIOR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={currentStepIndex === totalSteps}
                    className={`flex-1 md:flex-initial px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      currentStepIndex === totalSteps
                        ? 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black border-transparent font-black shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer'
                    }`}
                  >
                    <span>{currentStepIndex === 0 ? 'ENCENDER' : 'SIGUIENTE PASO'}</span>
                    <ChevronRight className="w-4 h-4 text-current" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-rose-300 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>SIMULANDO COMPORTAMIENTO DE FALLA EN PASO ACTUAL</span>
                </div>
              )}
            </section>

            {/* Machine Visual Display Component */}
            <EvoBootMachineVisual
              currentStep={currentStep}
              isPoweredOn={isPoweredOn}
            />

            {/* Deep-Dive Pedagogical Step Dossier */}
            <section className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${currentStep.layerColor}20`,
                        color: currentStep.layerColor,
                        border: `1px solid ${currentStep.layerColor}50`,
                      }}
                    >
                      CAPA: {currentStep.layer}
                    </span>
                    <span className="text-zinc-500 text-xs">
                      PASO {currentStep.stepNumber.toString().padStart(2, '0')} DE {totalSteps}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-tight">
                    {currentStep.name}
                  </h2>
                </div>

                <div className="px-3 py-1 rounded-full bg-black/60 border border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-2 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>EVO: OBSERVAR → ENTENDER → COMPROBAR</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>¿QUÉ ESTÁ PASANDO?</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 font-sans-editorial leading-relaxed bg-[#07090e] p-3.5 rounded-xl border border-zinc-800/80">
                      {currentStep.whatIsHappening}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        QUIÉN INICIA LA ACCIÓN
                      </span>
                      <p className="text-xs text-zinc-300 font-sans-editorial">
                        {currentStep.initiator}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        QUÉ COMPONENTE RESPONDE
                      </span>
                      <p className="text-xs text-zinc-300 font-sans-editorial">
                        {currentStep.responder}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>QUÉ ESPERA RECIBIR EL SISTEMA</span>
                    </span>
                    <p className="text-xs text-zinc-300 font-sans-editorial">
                      {currentStep.expectedResponse}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-zinc-400" />
                      <span>QUÉ PUEDE OBSERVAR EL USUARIO / TÉCNICO</span>
                    </span>
                    <p className="text-xs text-zinc-300 font-sans-editorial">
                      {currentStep.technicalObservation}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>SI ESTE PASO FALLA (EVIDENCIA & SÍNTOMA)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-200/90 font-sans-editorial leading-relaxed">
                      {currentStep.ifFails}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        <span>PRUEBA SEGURA SUGERIDA</span>
                      </div>

                      <div
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 self-start sm:self-auto ${currentSafetyInfo.badgeClass}`}
                      >
                        {currentSafetyInfo.icon}
                        <span>{currentSafetyInfo.label}</span>
                      </div>
                    </div>

                    {currentStep.safetyRequirement && (
                      <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-amber-500/30 text-[11px] text-amber-200/90 font-medium flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{currentStep.safetyRequirement}</span>
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-amber-200/90 font-sans-editorial leading-relaxed">
                      {currentStep.suggestedSafeTest}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                      <span>SIGUIENTE ESLABÓN DE LA CADENA</span>
                    </div>
                    <p className="text-xs text-blue-200/90 font-sans-editorial">
                      {currentStep.nextStep}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-center space-y-1">
                    <span className="text-[10px] text-zinc-500 font-mono-tech uppercase">
                      LEMA FORENSE EVO
                    </span>
                    <div className="text-xs font-bold text-amber-300 tracking-wider font-mono-tech">
                      “NO LO CREAS. COMPROBALO.”
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Timeline Step Selector */}
            <section className="bg-[#0b0e14] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    LÍNEA TEMPORAL COMPLETA DE ARRANQUE (35 ESTADOS) —{' '}
                    {activeMode === 'FALLA_SIMULADA' ? 'MODO FALLA LIBRE' : 'MODO SECUENCIAL'}
                  </span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono-tech hidden sm:inline">
                  {activeMode === 'APRENDER'
                    ? `PASOS DESBLOQUEADOS (${maxUnlockedStep + 1}/35)`
                    : 'SELECCIONA CUALQUIER PASO PARA ANALIZAR SU FALLA'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-zinc-700">
                {BOOT_SEQUENCE_STEPS.map((step, idx) => {
                  const isSelected = currentStepIndex === idx;
                  const isUnlocked = activeMode === 'FALLA_SIMULADA' || idx <= maxUnlockedStep;
                  const isPassed = isPoweredOn && currentStepIndex >= idx;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handleSelectStep(idx)}
                      disabled={!isUnlocked}
                      className={`shrink-0 w-8 h-8 rounded-lg font-mono-tech text-[10px] font-bold flex items-center justify-center transition-all ${
                        isSelected
                          ? activeMode === 'FALLA_SIMULADA'
                            ? 'bg-rose-500 text-white scale-110 shadow-[0_0_12px_#f43f5e] cursor-pointer'
                            : 'bg-amber-400 text-black scale-110 shadow-[0_0_12px_#f59e0b] cursor-pointer'
                          : !isUnlocked
                          ? 'bg-zinc-950/80 border border-zinc-900 text-zinc-700 cursor-not-allowed opacity-50'
                          : isPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer'
                      }`}
                      title={
                        isUnlocked
                          ? `${step.stepNumber.toString().padStart(2, '0')}: ${step.name} (${step.layer}) [${step.safetyLevel}]`
                          : `Paso ${step.stepNumber.toString().padStart(2, '0')} bloqueado. Avanza secuencialmente para desbloquear.`
                      }
                    >
                      {!isUnlocked ? (
                        <Lock className="w-3 h-3 text-zinc-700" />
                      ) : (
                        step.stepNumber
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
