import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Wrench,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  RotateCcw,
  Plus,
  Trash2,
  Award,
  ChevronRight,
  BookOpen,
  FolderOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import {
  UserPcSpec,
  FluidezProfileData,
  AbExperimentData,
  ActivityMapData,
  OptimizationLogData,
  DiagnosticCase,
  DiagnosticHypothesis,
  DiagnosticOutcomeStatus,
  DiagnosticFinalOutcomeStatus,
  DiagnosticInterventionProposal,
} from '../types';
import {
  FREQUENT_SYMPTOM_PRESETS,
  analyzeSymptom,
  detectSafetyHalt,
  getInitialHypotheses,
  getAdaptiveQuestions,
  getRecommendedTests,
  generateInterventionProposal,
} from './chapter06/diagnosticKnowledge';
import { SafetyHaltModal } from './chapter06/SafetyHaltModal';
import { InheritedEvidenceModal } from './chapter06/InheritedEvidenceModal';
import { HypothesisMap } from './chapter06/HypothesisMap';
import { DiagnosticTestStation } from './chapter06/DiagnosticTestStation';
import { InterventionStation } from './chapter06/InterventionStation';
import { CloseInvestigationStation } from './chapter06/CloseInvestigationStation';
import { WorkshopCasesLibrary } from './chapter06/WorkshopCasesLibrary';
import { DiagnosticExpedienteModal } from './chapter06/DiagnosticExpedienteModal';

interface Chapter06ViewProps {
  onBackToIndex: () => void;
  onOpenChapter07?: () => void;
  onChapterCompleted?: () => void;
}

export const Chapter06View: React.FC<Chapter06ViewProps> = ({
  onBackToIndex,
  onOpenChapter07,
  onChapterCompleted,
}) => {
  // 1. Inherited Evidence from Chapters 01-05
  const [specs] = useState<Partial<UserPcSpec>>(() => {
    try {
      const saved = localStorage.getItem('evo_c01_specs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [fluidezData] = useState<FluidezProfileData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c03_fluidez_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [limitationData] = useState<AbExperimentData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c04_experiment_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activityMap] = useState<ActivityMapData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_activity_map');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [optimizationLog] = useState<OptimizationLogData | null>(() => {
    try {
      const saved = localStorage.getItem('evo_c05_optimization_log');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals state
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showExpedienteModal, setShowExpedienteModal] = useState(false);
  const [safetyHaltReason, setSafetyHaltReason] = useState<string | null>(null);

  // Tab navigation between Active Case and Workshop Archive
  const [currentTab, setCurrentTab] = useState<'TALLER' | 'BIBLIOTECA'>('TALLER');

  // Multi-case management
  const [cases, setCases] = useState<DiagnosticCase[]>(() => {
    try {
      const saved = localStorage.getItem('evo_c06_cases');
      if (!saved) return [];
      const parsed: DiagnosticCase[] = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      // Preserve all user data (description, questions, answers, tests, hypotheses, evidence)
      // but normalize logical state: an active investigating case must have completed === false
      return parsed.map((c) => {
        const isInvestigating =
          c.status === 'INVESTIGANDO' ||
          (!c.completed && !c.closedAt) ||
          c.finalOutcome === 'INVESTIGANDO';

        if (isInvestigating) {
          return {
            ...c,
            status: 'INVESTIGANDO' as const,
            finalOutcome: 'INVESTIGANDO' as const,
            completed: false,
          };
        }

        return {
          ...c,
          status: c.status || c.finalOutcome,
          completed: true,
        };
      });
    } catch {
      return [];
    }
  });

  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('evo_c06_active_case_id') || null;
    } catch {
      return null;
    }
  });

  // Chapter 06 completion state:
  // Strictly requires at least one completed case with status !== "INVESTIGANDO"
  const [isChapterCompleted, setIsChapterCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('evo_c06_cases');
      if (!saved) return false;
      const parsed: DiagnosticCase[] = JSON.parse(saved);
      if (!Array.isArray(parsed)) return false;

      const hasCompletedCase = parsed.some(
        (c) => c && c.completed === true && c.status !== 'INVESTIGANDO'
      );

      if (!hasCompletedCase) {
        if (localStorage.getItem('evo_c06_status') === 'completed') {
          localStorage.removeItem('evo_c06_status');
        }
        if (localStorage.getItem('evo_c07_unlocked') === 'true') {
          localStorage.removeItem('evo_c07_unlocked');
        }
        return false;
      }

      return true;
    } catch {
      return false;
    }
  });

  // Text input for new case
  const [problemInput, setProblemInput] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [resumedNotice, setResumedNotice] = useState(false);

  // Active case lookup
  const activeCase = cases.find((c) => c.id === activeCaseId) || null;

  // Persist cases whenever they change
  const saveCases = (updatedCases: DiagnosticCase[]) => {
    setCases(updatedCases);
    try {
      localStorage.setItem('evo_c06_cases', JSON.stringify(updatedCases));
    } catch {}
  };

  // Initial resume notice
  useEffect(() => {
    if (activeCase && !activeCase.completed) {
      setResumedNotice(true);
      const timer = setTimeout(() => setResumedNotice(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Update active case helper
  const updateActiveCase = (updater: (prev: DiagnosticCase) => DiagnosticCase) => {
    if (!activeCaseId) return;
    const updated = cases.map((c) => (c.id === activeCaseId ? updater(c) : c));
    saveCases(updated);
  };

  // 2. Start a New Case
  const handleStartInvestigation = (customText?: string) => {
    const textToAnalyze = (customText || problemInput).trim();
    if (!textToAnalyze) return;

    // Safety check for fire / smoke / electrical hazard
    const hazard = detectSafetyHalt(textToAnalyze);
    if (hazard.isHazard) {
      setSafetyHaltReason(hazard.reason);
      return;
    }

    const analysis = analyzeSymptom(textToAnalyze);
    const initialHyp = getInitialHypotheses(analysis.category, specs);
    const initialTests = getRecommendedTests(analysis.category);
    const caseNumber = String(cases.length + 1).padStart(3, '0');
    const newCaseId = `006-${caseNumber}`;

    const timestamp = new Date().toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newCase: DiagnosticCase = {
      id: newCaseId,
      createdAt: timestamp,
      updatedAt: timestamp,
      rawDescription: textToAnalyze,
      interpreted: {
        symptom: analysis.symptom,
        context: analysis.context,
        pattern: analysis.pattern,
        cause: 'NO DETERMINADA',
        humanSummary: analysis.humanSummary,
        declaredFacts: analysis.declaredFacts,
        unknownData: analysis.unknownData,
      },
      category: analysis.category,
      currentQuestionIndex: 0,
      answers: [],
      hypotheses: initialHyp,
      tests: initialTests,
      currentTestIndex: 0,
      status: 'INVESTIGANDO',
      finalOutcome: 'INVESTIGANDO',
      completed: false,
    };

    const newCasesList = [newCase, ...cases];
    saveCases(newCasesList);
    setActiveCaseId(newCaseId);
    try {
      localStorage.setItem('evo_c06_active_case_id', newCaseId);
    } catch {}
    setProblemInput('');
    setIsEditingDescription(false);
  };

  // 3. Handle Question Option Selection
  const handleAnswerQuestion = (
    questionText: string,
    option: {
      id: string;
      text: string;
      hypothesisUpdates: Array<{ id: string; status: DiagnosticHypothesis['status']; reasoning?: string }>;
    }
  ) => {
    if (!activeCase) return;

    updateActiveCase((prev) => {
      // Update hypotheses states based on this answer
      const updatedHypotheses = prev.hypotheses.map((hyp) => {
        const update = option.hypothesisUpdates.find((u) => u.id === hyp.id);
        if (update) {
          return {
            ...hyp,
            status: update.status,
            reasoning: update.reasoning || hyp.reasoning,
          };
        }
        return hyp;
      });

      const updatedAnswers = [
        ...prev.answers,
        {
          questionId: `q-${prev.currentQuestionIndex + 1}`,
          questionText,
          answerText: option.text,
        },
      ];

      return {
        ...prev,
        answers: updatedAnswers,
        hypotheses: updatedHypotheses,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        updatedAt: new Date().toLocaleTimeString(),
      };
    });
  };

  // 4. Record Result of a Technical Test
  const handleRecordTestResult = (outcomeAnswer: string, customNote: string) => {
    if (!activeCase) return;

    updateActiveCase((prev) => {
      const currentTest = prev.tests[prev.currentTestIndex];
      const updatedTests = prev.tests.map((t, idx) => {
        if (idx === prev.currentTestIndex) {
          return {
            ...t,
            outcomeAnswer,
            evidenceNote: customNote || 'Observación técnica completada por el usuario.',
            completedAt: new Date().toLocaleTimeString(),
          };
        }
        return t;
      });

      // Update hypotheses based on outcome
      let updatedHypotheses = [...prev.hypotheses];
      if (outcomeAnswer === 'NO_SE_OBSERVARON_ANOMALIAS') {
        // Discard or weaken first active hypothesis
        const firstActive = updatedHypotheses.find(
          (h) => h.status !== 'DESCARTADA_PARA_ESTE_CASO' && h.status !== 'NO_EVALUABLE'
        );
        if (firstActive) {
          updatedHypotheses = updatedHypotheses.map((h) =>
            h.id === firstActive.id
              ? {
                  ...h,
                  status: 'DESCARTADA_PARA_ESTE_CASO' as const,
                  reasoning: 'Prueba no detectó anomalías en este subsistema.',
                }
              : h
          );
        }
      } else if (outcomeAnswer === 'SE_DETECTO_EVENTO_O_PICO') {
        // Strengthen top active hypothesis
        const firstActive = updatedHypotheses.find(
          (h) => h.status !== 'DESCARTADA_PARA_ESTE_CASO'
        );
        if (firstActive) {
          updatedHypotheses = updatedHypotheses.map((h) =>
            h.id === firstActive.id
              ? { ...h, status: 'INDICIO_FUERTE' as const, reasoning: 'Correlación temporal o métrica detectada en la prueba.' }
              : h
          );
        }
      }

      // Generate intervention proposal if not already present
      const intervention =
        prev.intervention ||
        generateInterventionProposal(prev.category, updatedHypotheses, updatedTests);

      return {
        ...prev,
        tests: updatedTests,
        hypotheses: updatedHypotheses,
        currentTestIndex: prev.currentTestIndex + 1,
        intervention,
        updatedAt: new Date().toLocaleTimeString(),
      };
    });
  };

  // 5. Close Investigation & Issue Formal Dossier
  const handleCloseInvestigation = (
    finalOutcome: DiagnosticFinalOutcomeStatus,
    interventionData?: {
      hadIntervention: boolean;
      beforeState?: string;
      changeApplied?: string;
      afterState?: string;
      retestResult?: string;
      closingReason?: string;
    }
  ) => {
    if (!activeCaseId || !activeCase) return;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-AR')} ${now.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const updatedIntervention: DiagnosticInterventionProposal | undefined = interventionData?.hadIntervention
      ? {
          whatToChange:
            interventionData.changeApplied ||
            activeCase.intervention?.whatToChange ||
            'Intervención técnica controlada',
          why:
            activeCase.intervention?.why ||
            'Fundada en la evidencia de las pruebas periciales',
          backingEvidence:
            activeCase.intervention?.backingEvidence ||
            'Observaciones y métricas recolectadas',
          riskLevel: activeCase.intervention?.riskLevel || 'BAJO',
          reversible: activeCase.intervention?.reversible ?? true,
          howToRevert:
            activeCase.intervention?.howToRevert ||
            'Revertir la variable modificada a su estado previo',
          executed: true,
          beforeState:
            interventionData.beforeState || 'Registrado en pruebas previas',
          afterState:
            interventionData.afterState ||
            'Condición verificada tras la intervención',
          retestCondition: 'Misma condición de carga y tiempo',
          retestResult: interventionData.retestResult || 'Retest verificado',
        }
      : activeCase.intervention
      ? {
          ...activeCase.intervention,
          executed: false,
        }
      : undefined;

    const updatedCase: DiagnosticCase = {
      ...activeCase,
      status: finalOutcome,
      finalOutcome: finalOutcome,
      completed: true,
      closedAt: formattedDate,
      closingReason:
        interventionData?.closingReason ||
        (interventionData?.hadIntervention
          ? undefined
          : 'EVIDENCIA INSUFICIENTE. No se realizó ninguna intervención.'),
      intervention: updatedIntervention,
      updatedAt: formattedDate,
    };

    const updatedCases = cases.map((c) => (c.id === activeCaseId ? updatedCase : c));
    saveCases(updatedCases);

    // Unlock Chapter 06 completion & Chapter 07
    localStorage.setItem('evo_c06_status', 'completed');
    localStorage.setItem('evo_c07_unlocked', 'true');
    setIsChapterCompleted(true);

    if (onChapterCompleted) {
      onChapterCompleted();
    }

    // Open the final dossier
    setShowExpedienteModal(true);

    // Smooth scroll to completion section
    setTimeout(() => {
      const completeEl = document.getElementById('seccion-cierre-capitulo-06');
      if (completeEl) {
        completeEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Legacy fallback if intervention is completed via old flow
  const handleCompleteIntervention = (
    updatedProposal: any,
    finalOutcome: DiagnosticOutcomeStatus
  ) => {
    handleCloseInvestigation(finalOutcome as DiagnosticFinalOutcomeStatus, {
      hadIntervention: true,
      beforeState: updatedProposal?.beforeState,
      changeApplied: updatedProposal?.whatToChange,
      afterState: updatedProposal?.afterState,
      retestResult: updatedProposal?.retestResult,
    });
  };

  // Delete a case
  const handleDeleteCase = (caseIdToDelete: string) => {
    const updated = cases.filter((c) => c.id !== caseIdToDelete);
    saveCases(updated);
    if (activeCaseId === caseIdToDelete) {
      const nextActive = updated.length > 0 ? updated[0].id : null;
      setActiveCaseId(nextActive);
      if (nextActive) {
        localStorage.setItem('evo_c06_active_case_id', nextActive);
      } else {
        localStorage.removeItem('evo_c06_active_case_id');
      }
    }
  };

  // Adaptive questions for active case
  const adaptiveQuestions = activeCase
    ? getAdaptiveQuestions(activeCase.category, activeCase.rawDescription, activeCase.answers, specs)
    : [];
  const currentQuestion =
    activeCase && activeCase.currentQuestionIndex < adaptiveQuestions.length
      ? adaptiveQuestions[activeCase.currentQuestionIndex]
      : null;

  const currentTest =
    activeCase &&
    !currentQuestion &&
    activeCase.currentTestIndex < activeCase.tests.length
      ? activeCase.tests[activeCase.currentTestIndex]
      : null;

  // Has completed at least 1 real technical test with user result
  const hasRecordedAtLeastOneTest = Boolean(
    activeCase &&
      activeCase.tests &&
      activeCase.tests.some((t) => Boolean(t.outcomeAnswer))
  );

  const showInterventionPhase =
    activeCase &&
    !currentQuestion &&
    activeCase.currentTestIndex >= activeCase.tests.length;

  return (
    <div id="pantalla-capitulo-06" className="w-full min-h-screen py-6 sm:py-10 text-[#f4f4f6]">
      {/* Safety Halt Modal */}
      {safetyHaltReason && (
        <SafetyHaltModal
          reason={safetyHaltReason}
          onDismiss={() => setSafetyHaltReason(null)}
        />
      )}

      {/* Inherited Evidence Modal */}
      {showEvidenceModal && (
        <InheritedEvidenceModal
          specs={specs}
          fluidezData={fluidezData}
          limitationData={limitationData}
          activityMap={activityMap}
          optimizationLog={optimizationLog}
          onClose={() => setShowEvidenceModal(false)}
        />
      )}

      {/* Dossier Modal */}
      {showExpedienteModal && activeCase && (
        <DiagnosticExpedienteModal
          diagnosticCase={activeCase}
          specs={specs}
          onClose={() => setShowExpedienteModal(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Navigation Top Bar */}
        <nav className="flex items-center justify-between pb-5 border-b border-zinc-800/60">
          <button
            type="button"
            onClick={onBackToIndex}
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer group"
            id="btn-volver-indice-c06"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 group-hover:-translate-x-1 transition-transform" />
            <span>← VOLVER A ÍNDICE DEL TOMO 01</span>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono-tech">
            <span className="w-2 h-2 bg-yellow-400 inline-block" />
            <span className="tracking-widest uppercase text-white font-bold">
              TOMO 01 // CAPÍTULO 06
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-yellow-400 font-semibold tracking-wider">
              TALLER EVO // ENCONTRÁ LA FALLA
            </span>
          </div>
        </nav>

        {/* Resumed Investigation Toast */}
        {resumedNotice && (
          <div className="p-3.5 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 font-mono-tech text-xs text-yellow-300 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-yellow-400 animate-spin" />
              <span>INVESTIGACIÓN REANUDADA // Caso activo: {activeCase?.id}</span>
            </div>
            <button
              type="button"
              onClick={() => setResumedNotice(false)}
              className="text-zinc-400 hover:text-white uppercase text-[10px]"
            >
              Cerrar aviso ✕
            </button>
          </div>
        )}

        {/* Chapter Header & Manifesto */}
        <header className="space-y-4 text-left">
          <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
            <span className="text-yellow-400 font-bold">TALLER EVO</span>
            <span>•</span>
            <span>SISTEMA CENTRAL: EVO DIAGNOSTIC</span>
            <span>•</span>
            <span
              className={
                isChapterCompleted
                  ? 'text-emerald-400 font-semibold'
                  : 'text-amber-400 font-semibold'
              }
            >
              {isChapterCompleted
                ? 'CAPÍTULO 06 COMPLETADO'
                : 'CAPÍTULO 06 EN PROGRESO'}
            </span>
            {activeCase && (
              <>
                <span>•</span>
                <span className="text-zinc-300">
                  CASO {activeCase.id}:{' '}
                  <strong
                    className={
                      activeCase.completed
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  >
                    {activeCase.completed
                      ? activeCase.status || activeCase.finalOutcome
                      : 'INVESTIGANDO'}
                  </strong>
                </span>
              </>
            )}
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            ENCONTRÁ LA FALLA
          </h1>

          <p className="font-sans-editorial text-lg sm:text-2xl text-yellow-400/90 italic max-w-3xl">
            “No adivines qué está fallando. Hagamos que la PC nos lo muestre.”
          </p>
        </header>

        {/* Inherited Evidence Compact Banner */}
        <div
          id="pistas-que-ya-tenemos-banner"
          className="p-5 rounded-3xl bg-[#0f1015] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-white uppercase tracking-wider">
              <Layers className="w-4 h-4 text-yellow-400" />
              <span>PISTAS QUE YA TENEMOS (HISTORIAL EVO C01–C05)</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono-tech text-[11px] text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                HARDWARE {specs?.cpu ? '✓' : '○'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                FLUIDEZ {fluidezData ? '✓' : '○'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                LIMITACIONES {limitationData ? '✓' : '○'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                ACTIVIDAD {activityMap ? '✓' : '○'}
              </span>
            </div>
          </div>

          <button
            type="button"
            id="btn-ver-evidencia-heredada"
            onClick={() => setShowEvidenceModal(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-yellow-400 hover:text-white font-mono-tech text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>VER EVIDENCIA ACUMULADA</span>
          </button>
        </div>

        {/* Main Workspace Navigation: TALLER vs BIBLIOTECA DE CASOS */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-2 font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => setCurrentTab('TALLER')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold uppercase flex items-center gap-2 ${
              currentTab === 'TALLER'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-black/40 text-zinc-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>MESA DE DIAGNÓSTICO EN VIVO</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('BIBLIOTECA')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold uppercase flex items-center gap-2 ${
              currentTab === 'BIBLIOTECA'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-black/40 text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>CASOS REALES DEL TALLER ({FREQUENT_SYMPTOM_PRESETS.length})</span>
          </button>
        </div>

        {/* VIEW 1: BIBLIOTECA DE CASOS */}
        {currentTab === 'BIBLIOTECA' && (
          <WorkshopCasesLibrary
            onSelectCasePrompt={(promptText) => {
              setProblemInput(promptText);
              setCurrentTab('TALLER');
            }}
          />
        )}

        {/* VIEW 2: TALLER EVO (MESA DE DIAGNÓSTICO EN VIVO) */}
        {currentTab === 'TALLER' && (
          <div className="space-y-10">
            {/* Multi-Case Manager Bar */}
            {cases.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 font-mono-tech text-xs">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-zinc-500 uppercase font-bold text-[10px]">MIS CASOS:</span>
                  {cases.map((c) => (
                    <div
                      key={c.id}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        c.id === activeCaseId
                          ? 'bg-yellow-400 text-black font-bold border-yellow-400'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                      onClick={() => setActiveCaseId(c.id)}
                    >
                      <span>{c.id}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono-tech uppercase font-bold ${
                          c.completed
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {c.completed ? c.status || c.finalOutcome : 'INVESTIGANDO'}
                      </span>
                      {c.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCase(c.id);
                        }}
                        className="p-0.5 hover:text-rose-500 transition-colors ml-1"
                        title="Eliminar caso"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCaseId(null);
                    setProblemInput('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-yellow-400" />
                  <span>NUEVO CASO</span>
                </button>
              </div>
            )}

            {/* SCREEN 1: NUEVO CASO // "¿QUÉ LE PASA A TU PC?" */}
            {(!activeCase || isEditingDescription) && (
              <section
                id="apertura-que-le-pasa-a-tu-pc"
                className="p-6 sm:p-10 rounded-3xl bg-[#0f1015] border border-zinc-700 shadow-2xl space-y-7 text-left"
              >
                <div className="space-y-2">
                  <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-widest block">
                    INGRESO AL TALLER // EXPEDIENTE INICIAL
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
                    ¿QUÉ LE PASA A TU PC?
                  </h2>
                  <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
                    “No necesitás saber el nombre técnico. Contalo como te salga.”
                  </p>
                </div>

                {/* Free Text Input Area */}
                <div className="space-y-3">
                  <textarea
                    id="input-descripcion-problema-pc"
                    rows={4}
                    value={problemInput}
                    onChange={(e) => setProblemInput(e.target.value)}
                    placeholder="Ejemplo: mi PC anda bien pero después de jugar 15 minutos empieza a dar tirones y no sé si es la temperatura o Windows..."
                    className="w-full bg-black/60 border border-zinc-700 rounded-2xl p-4 sm:p-5 text-white font-sans-editorial text-base sm:text-lg focus:outline-none focus:border-yellow-400 leading-relaxed shadow-inner placeholder:text-zinc-600"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="font-mono-tech text-xs text-zinc-500">
                      EVO LABS convertirá esta descripción en una investigación técnica deducida paso a paso.
                    </span>

                    <button
                      type="button"
                      id="btn-iniciar-investigacion-taller"
                      disabled={!problemInput.trim()}
                      onClick={() => handleStartInvestigation()}
                      className={`px-8 py-3.5 rounded-xl font-mono-tech font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        problemInput.trim()
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <span>INICIAR INVESTIGACIÓN TÉCNICA</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Optional Presets Chips */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                  <span className="font-mono-tech text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    O ELEGÍ UN CASO FRECUENTE PARA COMENZAR:
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {FREQUENT_SYMPTOM_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setProblemInput(preset.samplePrompt);
                        }}
                        className="px-3 py-2 rounded-xl bg-black/40 hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-400/60 text-zinc-300 hover:text-white font-mono-tech text-xs transition-all cursor-pointer text-left"
                      >
                        <span className="font-bold text-yellow-400/90 block text-[11px]">{preset.label}</span>
                        <span className="text-[10px] text-zinc-500 block truncate max-w-[220px]">{preset.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* SCREEN 2: ACTIVE CASE INVESTIGATION FLOW */}
            {activeCase && !isEditingDescription && (
              <div className="space-y-8">
                {/* Primer Momento EVO: Interpretación del Caso */}
                <section
                  id="primer-momento-evo-interpretacion"
                  className="p-6 sm:p-8 rounded-3xl bg-[#0e0f14] border border-yellow-400/40 shadow-2xl space-y-6 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono-tech font-bold text-xs">
                        CASO EVO // {activeCase.id}
                      </div>
                      <span className="font-mono-tech text-xs text-zinc-400 uppercase">
                        REGISTRADO: {activeCase.createdAt}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingDescription(true)}
                      className="text-xs font-mono-tech text-zinc-400 hover:text-yellow-400 transition-colors uppercase underline cursor-pointer"
                    >
                      CORREGIR DESCRIPCIÓN INICIAL
                    </button>
                  </div>

                  {/* Original Description Quote */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 italic leading-relaxed">
                    “{activeCase.rawDescription}”
                  </div>

                  {/* EVO Interpreta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono-tech text-xs">
                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">SÍNTOMA</span>
                      <span className="text-white font-bold block pt-0.5">{activeCase.interpreted.symptom}</span>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">CONTEXTO</span>
                      <span className="text-white font-bold block pt-0.5">{activeCase.interpreted.context}</span>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">PATRÓN</span>
                      <span className="text-white font-bold block pt-0.5">{activeCase.interpreted.pattern}</span>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-xl border border-amber-500/40 bg-amber-950/20">
                      <span className="text-amber-400 block text-[10px] font-bold uppercase">CAUSA</span>
                      <span className="text-amber-300 font-bold block pt-0.5 uppercase">{activeCase.interpreted.cause}</span>
                    </div>
                  </div>

                  {/* Hechos Declarados vs Datos Desconocidos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
                    {/* Hechos declarados */}
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>HECHO DECLARADO (EXTRAÍDO DEL TEXTO)</span>
                      </div>
                      <ul className="space-y-1.5 text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                        {activeCase.interpreted.declaredFacts && activeCase.interpreted.declaredFacts.length > 0 ? (
                          activeCase.interpreted.declaredFacts.map((fact, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-mono-tech select-none">•</span>
                              <span>{fact}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-500 italic">No se declararon detalles específicos en la descripción inicial.</li>
                        )}
                      </ul>
                    </div>

                    {/* Datos que todavía no sabemos */}
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>DATOS QUE TODAVÍA NO SABEMOS (INCÓGNITAS TÉCNICAS A MEDIR)</span>
                      </div>
                      <ul className="space-y-1.5 text-zinc-300 font-sans-editorial text-xs leading-relaxed">
                        {activeCase.interpreted.unknownData && activeCase.interpreted.unknownData.length > 0 ? (
                          activeCase.interpreted.unknownData.map((unknown, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500/80 font-mono-tech select-none">?</span>
                              <span>{unknown}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-500 italic">Incógnitas técnicas a dilucidar mediante pruebas.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Human Summary */}
                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs font-mono-tech text-zinc-300 space-y-1">
                    <span className="text-yellow-400 font-bold uppercase block text-[10px]">
                      ESTO ES LO QUE ENTENDIÓ EVO LABS:
                    </span>
                    <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed">
                      {activeCase.interpreted.humanSummary}
                    </p>
                  </div>
                </section>

                {/* Regla de Oro Destacada */}
                <div
                  id="regla-de-oro-sintoma-no-es-causa"
                  className="p-5 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-amber-400/5 to-transparent border-l-4 border-yellow-400 border border-zinc-800 space-y-2 font-mono-tech text-xs"
                >
                  <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span>REGLA DE ORO DE TALLER: SÍNTOMA ≠ CAUSA</span>
                  </div>
                  <p className="font-sans-editorial text-sm text-zinc-200 leading-relaxed">
                    “‘SE REINICIA’ es un síntoma. ‘ES LA FUENTE’ es una hipótesis.
                    En EVO LABS no cambiamos piezas ni tocamos 5 cosas al mismo tiempo hasta tener una razón objetiva para sospechar de ellas.”
                  </p>
                </div>

                {/* Dynamic Hypothesis Map */}
                <HypothesisMap hypotheses={activeCase.hypotheses} />

                {/* ADAPTIVE MOTOR: ONE QUESTION AT A TIME */}
                {currentQuestion && (
                  <section
                    id={`pregunta-adaptativa-${currentQuestion.id}`}
                    className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-700 shadow-2xl space-y-6"
                  >
                    <div className="space-y-2 border-b border-zinc-800 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-widest">
                          PREGUNTA {activeCase.currentQuestionIndex + 1} DE {adaptiveQuestions.length} // {currentQuestion.title}
                        </span>
                        <span className="text-[11px] font-mono-tech text-zinc-400">
                          MOTOR ADAPTATIVO EVO
                        </span>
                      </div>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                        {currentQuestion.question}
                      </h3>
                    </div>

                    <div className="space-y-3 font-mono-tech text-xs">
                      {currentQuestion.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleAnswerQuestion(currentQuestion.question, opt)}
                          className="w-full p-4 rounded-2xl bg-black/40 hover:bg-zinc-900/90 border border-zinc-800 hover:border-yellow-400 text-left transition-all space-y-1.5 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-sans-editorial text-sm font-semibold group-hover:text-yellow-400 transition-colors">
                              {opt.text}
                            </span>
                            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                          </div>
                          <span className="text-[11px] text-zinc-400 block font-mono-tech">
                            {opt.nextActionSummary}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* TECHNICAL TEST STATION (PRÓXIMA PRUEBA) */}
                {currentTest && (
                  <DiagnosticTestStation
                    test={currentTest}
                    onRecordResult={handleRecordTestResult}
                    isLastTest={activeCase.currentTestIndex === activeCase.tests.length - 1}
                  />
                )}

                {/* CLOSE INVESTIGATION STATION:
                    Disponible en cuanto exista al menos 1 prueba real completada o se hayan recorrido los pasos */}
                {!activeCase.completed && (hasRecordedAtLeastOneTest || showInterventionPhase) && (
                  <CloseInvestigationStation
                    diagnosticCase={activeCase}
                    onCloseInvestigation={handleCloseInvestigation}
                    hasRecordedAtLeastOneTest={hasRecordedAtLeastOneTest}
                  />
                )}

                {/* CASE SUMMARY CARD IF COMPLETED */}
                {activeCase.completed && (
                  <div
                    id="resumen-caso-finalizado"
                    className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-emerald-500/50 shadow-2xl space-y-6 text-white"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                        <div>
                          <span className="font-mono-tech text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                            INVESTIGACIÓN CERRADA // EXPEDIENTE LISTO
                          </span>
                          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">
                            CASO {activeCase.id} — {activeCase.status || activeCase.finalOutcome}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowExpedienteModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech text-xs font-bold uppercase transition-colors shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>VER EXPEDIENTE COMPLETO</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono-tech text-xs">
                      <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase">AL EMPEZAR</span>
                        <span className="text-zinc-300 text-xs block pt-1">{activeCase.interpreted.symptom}</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase">DESCUBRIMOS</span>
                        <span className="text-white text-xs font-bold block pt-1">
                          {activeCase.tests[0]?.outcomeAnswer || 'Datos auditados'}
                        </span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase">DESCARTAMOS</span>
                        <span className="text-emerald-400 text-xs font-bold block pt-1">
                          {activeCase.hypotheses.filter((h) => h.status === 'DESCARTADA_PARA_ESTE_CASO').length} hipótesis
                        </span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase">CAMBIAMOS</span>
                        <span className="text-yellow-400 text-xs font-bold block pt-1 truncate">
                          {activeCase.intervention?.whatToChange || 'Sin intervención física'}
                        </span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px] uppercase">RESULTADO</span>
                        <span className="text-emerald-300 text-xs font-black block pt-1">
                          {activeCase.status || activeCase.finalOutcome}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MIENTRAS EL CASO ESTÉ ABIERTO: INVESTIGACIÓN EN CURSO */}
            {!isChapterCompleted && activeCase && !activeCase.completed && (
              <section
                id="seccion-investigacion-en-curso"
                className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141622] to-black border-2 border-yellow-400/50 shadow-2xl space-y-6 text-white relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                    <Activity className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span>INVESTIGACIÓN EN CURSO // CASO {activeCase.id}</span>
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white">
                    INVESTIGACIÓN EN CURSO
                  </h2>
                  <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
                    “Todavía quedan preguntas abiertas. Podés seguir investigando o cerrar el caso cuando la evidencia permita una conclusión.”
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-tech text-xs">
                  <div className="space-y-1">
                    <span className="text-zinc-400 block uppercase text-[10px]">DOCUMENTO PERICIAL VIGENTE</span>
                    <span className="text-yellow-400 font-bold uppercase text-sm">
                      EXPEDIENTE DE DIAGNÓSTICO // ESTADO: INVESTIGANDO
                    </span>
                    <p className="text-zinc-400 font-sans-editorial text-xs">
                      Este expediente se consolidará de forma definitiva una vez que concluyas la investigación.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowExpedienteModal(true)}
                    className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-yellow-400/30 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4" />
                    <span>VER EXPEDIENTE PARCIAL (ESTADO: INVESTIGANDO)</span>
                  </button>
                </div>
              </section>
            )}

            {/* SECCIÓN FINAL // CIERRE DEFINITIVO DEL CAPÍTULO 06 */}
            {isChapterCompleted && (
              <section
                id="seccion-cierre-capitulo-06"
                className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#141622] to-black border-2 border-yellow-400/80 shadow-2xl space-y-8 text-white relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span>CAPÍTULO 06 COMPLETADO // METODOLOGÍA ADQUIRIDA</span>
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
                    YA NO ESTÁS PROBANDO COSAS AL AZAR.
                  </h2>
                  <p className="font-sans-editorial text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
                    Completaste un caso real con rigor de taller. Pasaste de la intuición a la evidencia,
                    aislaste variables, descartaste hipótesis y documentaste cada prueba.
                  </p>
                </div>

                {/* Checklist de Capacidades Adquiridas */}
                <div className="p-5 rounded-2xl bg-black/60 border border-zinc-800 space-y-4">
                  <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                    CAPACIDADES ADQUIRIDAS EN ESTE CAPÍTULO:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono-tech text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Describir correctamente un síntoma</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Separar síntoma de causa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Formular hipótesis lógicas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Elegir pruebas técnicas no invasivas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Interpretar evidencia real</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Descartar posibilidades con certeza</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Intervenir con una variable a la vez</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Repetir una prueba (retest bajo carga)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Documentar un expediente pericial</span>
                    </div>
                  </div>
                </div>

                {/* Tesoro Desbloqueado */}
                <div className="p-5 rounded-2xl bg-yellow-400/10 border border-yellow-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-widest block">
                      TESORO OBTENIDO
                    </span>
                    <h3 className="font-display font-black text-xl text-white uppercase">
                      EXPEDIENTE DE DIAGNÓSTICO EVO 001 ✓
                    </h3>
                    <p className="font-sans-editorial text-xs text-zinc-300">
                      Tu reporte pericial exportable en TXT y JSON para conservar como respaldo técnico.
                    </p>
                  </div>

                  {activeCase && (
                    <button
                      type="button"
                      onClick={() => setShowExpedienteModal(true)}
                      className="px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>ABRIR EXPEDIENTE</span>
                    </button>
                  )}
                </div>

                {/* Cliffhanger Capítulo 07 & Desbloqueo */}
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono-tech text-xs text-zinc-400 uppercase tracking-widest block">
                      PRÓXIMO PASO // EL GRAN FINAL DEL TOMO 01
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-yellow-400 uppercase">
                      CAPÍTULO 07: LABORATORIO FINAL // ¿PODÉS PROBAR QUE UNA OPTIMIZACIÓN REALMENTE MEJORÓ TU PC?
                    </h3>
                    <p className="font-sans-editorial text-sm text-zinc-300 leading-relaxed max-w-3xl">
                      Aprendiste qué piezas tenés, cómo viajan los datos, qué es fluidez, qué te limita, qué hace Windows en reposo y cómo encontrar una falla.
                      Ahora llega la prueba de fuego: demostrar científicamente si un ajuste mejoró tu máquina o fue sólo una ilusión.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={onBackToIndex}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono-tech text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      VOLVER AL ÍNDICE DEL TOMO 01
                    </button>

                    <button
                      type="button"
                      id="btn-abrir-capitulo-07"
                      onClick={() => {
                        if (onOpenChapter07) {
                          onOpenChapter07();
                        } else {
                          onBackToIndex();
                        }
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-yellow-400/20 cursor-pointer"
                    >
                      <span>CONTINUAR AL ÍNDICE // CAPÍTULO 07 DISPONIBLE</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
