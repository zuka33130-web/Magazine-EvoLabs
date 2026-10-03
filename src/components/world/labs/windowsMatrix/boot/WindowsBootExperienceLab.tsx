// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS BOOT EXPERIENCE ENGINE — REALISTIC STEP-BY-STEP & FAILURE INJECTION
// Master 3-Panel Layout: Monitor Simulado | Windows Interno | EVO Explica
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Bug,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  Terminal,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import {
  WINDOWS_BOOT_STEPS,
  INJECTABLE_BOOT_FAILURES
} from '../data/bootPipelineData';
import { BootStepDefinition, SimulationScreenState } from '../engine/types';
import { SimulatedMonitorScreen } from '../components/SimulatedMonitorScreen';
import { InternalArchitectureGraph } from '../components/InternalArchitectureGraph';
import { EvoExplainsPanel } from '../components/EvoExplainsPanel';
import { EvoTutorModal } from '../components/EvoTutorModal';
import { TermGlossaryModal } from '../components/TermGlossaryModal';

interface WindowsBootExperienceLabProps {
  onOpenTomo?: (tomoId: string) => void;
  onNavigateToRepair?: () => void;
  className?: string;
}

export const WindowsBootExperienceLab: React.FC<WindowsBootExperienceLabProps> = ({
  onOpenTomo,
  onNavigateToRepair,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeFailureId, setActiveFailureId] = useState<string | null>(null);
  const [failureTriggered, setFailureTriggered] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Modals state
  const [tutorOpen, setTutorOpen] = useState<boolean>(false);
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [glossaryTerm, setGlossaryTerm] = useState<string>('');

  const currentStep: BootStepDefinition = WINDOWS_BOOT_STEPS[currentStepIndex];

  // Progressive completed and blocked nodes calculation
  const completedNodes = React.useMemo(() => {
    const nodes = new Set<string>();
    for (let i = 0; i < currentStepIndex; i++) {
      WINDOWS_BOOT_STEPS[i].activeNodes.forEach((n) => nodes.add(n));
    }
    return Array.from(nodes);
  }, [currentStepIndex]);

  const blockedNodes = React.useMemo(() => {
    if (!failureTriggered) return [];
    const nodes = new Set<string>();
    for (let i = currentStepIndex + 1; i < WINDOWS_BOOT_STEPS.length; i++) {
      WINDOWS_BOOT_STEPS[i].activeNodes.forEach((n) => nodes.add(n));
    }
    return Array.from(nodes);
  }, [failureTriggered, currentStepIndex]);

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (activeFailureId) {
          // Check if current step has this failure
          if (currentStep.injectableFailure?.failureId === activeFailureId) {
            setIsPlaying(false);
            setFailureTriggered(true);
            return;
          }
        }

        if (currentStepIndex < WINDOWS_BOOT_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, activeFailureId, currentStep]);

  // Compute active screen state
  const screenState: SimulationScreenState = failureTriggered && currentStep.injectableFailure
    ? currentStep.injectableFailure.stopScreenState
    : currentStep.screenState;

  // Handle next / prev
  const handleNext = () => {
    if (currentStepIndex < WINDOWS_BOOT_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setFailureTriggered(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setFailureTriggered(false);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setFailureTriggered(false);
    setActiveFailureId(null);
  };

  const handleInjectFailure = (failureId: string) => {
    setActiveFailureId(failureId);
    setFailureTriggered(false);

    // Find step that holds this failure
    const targetStepIndex = WINDOWS_BOOT_STEPS.findIndex(
      (s) => s.injectableFailure?.failureId === failureId
    );

    if (targetStepIndex === -1) return;

    if (currentStepIndex < targetStepIndex) {
      // Start auto-play to animate until target layer
      setIsPlaying(true);
    } else {
      // Already at or past target, jump directly to target
      setCurrentStepIndex(targetStepIndex);
      setIsPlaying(false);
      setFailureTriggered(true);
    }
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(text);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className={`space-y-5 font-mono-tech select-none ${className}`}>
      {/* Top Controller Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              PIPELINE FORENSE DE ARRANQUE
            </span>
            <span className="text-zinc-500 text-[10.5px]">
              PASO {currentStep.sequenceNumber} DE {WINDOWS_BOOT_STEPS.length}
            </span>
          </div>
          <h2 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
            {currentStep.name}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Inject Failure Dropdown */}
          <div className="relative">
            <select
              value={activeFailureId || ''}
              onChange={(e) => {
                if (e.target.value) {
                  handleInjectFailure(e.target.value);
                } else {
                  setActiveFailureId(null);
                  setFailureTriggered(false);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all cursor-pointer focus:outline-none"
            >
              <option value="">[ INYECTAR FALLA ]</option>
              {INJECTABLE_BOOT_FAILURES.map((f) => (
                <option key={f.failureId} value={f.failureId}>
                  ⚡ {f.title}
                </option>
              ))}
            </select>
          </div>

          {/* Play / Pause Auto Walk */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-cyan-400" />
                <span>PAUSAR</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>REPRODUCIR</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            title="Reiniciar arranque desde Power-On"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          MASTER 3-PANEL LAYOUT (MONITOR | INTERNO | EVO EXPLICA)
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* PANEL 1: MONITOR SIMULADO (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col space-y-2">
          <SimulatedMonitorScreen
            screenState={screenState}
            bsodCode={currentStep.injectableFailure?.bsodCode || '0xc000007B'}
            userAvatarName="Perito Informático"
            diskLedActive={currentStep.phase === 'KERNEL_INIT' || currentStep.phase === 'BOOT_LOADER'}
            customOverlayText={failureTriggered ? `BLOQUEO: ${currentStep.injectableFailure?.symptom}` : undefined}
          />
        </div>

        {/* PANEL 2: WINDOWS INTERNO (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col space-y-2">
          <InternalArchitectureGraph
            currentStepName={currentStep.name}
            phaseName={currentStep.phase}
            activeNodes={currentStep.activeNodes}
            completedNodes={completedNodes}
            blockedNodes={blockedNodes}
            parallelBranches={currentStep.parallelBranches}
            failedNodeId={failureTriggered ? currentStep.activeNodes[0] : undefined}
            cpuPercent={currentStep.simulatedCpu ?? (currentStep.phase === 'PARALLEL_STABILIZATION' ? 1.4 : 14.5)}
            ramUsedMb={currentStep.simulatedRamMb ?? (currentStep.sequenceNumber * 85 + 180)}
            diskActivityPercent={currentStep.simulatedDiskIo ? (currentStep.simulatedDiskIo / 10) : (currentStep.phase === 'BOOT_LOADER' ? 88.0 : 4.0)}
            simulatedTimestamp={currentStep.simulatedTimestamp ?? `T+${(currentStep.sequenceNumber * 0.28).toFixed(3)}s`}
            simulatedPid={currentStep.simulatedPid}
          />
        </div>

        {/* PANEL 3: EVO EXPLICA (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col space-y-2">
          <EvoExplainsPanel
            stepTitle={currentStep.name}
            simpleExplanation={currentStep.simpleExplanation}
            deepArchitecture={currentStep.deepArchitecture}
            rightNowAction={currentStep.rightNowAction}
            processOrFile={currentStep.processOrFile}
            inputRequirements={currentStep.inputRequirements}
            outputArtifact={currentStep.outputArtifact}
            failureSymptom={currentStep.failureSymptom}
            verificationCommand={currentStep.verificationCommand}
            verificationExpected={currentStep.verificationExpected}
            analogicQuestion={currentStep.analogicQuestion}
            onOpenGlossaryTerm={(t) => {
              setGlossaryTerm(t);
              setGlossaryOpen(true);
            }}
            onOpenSimpleTutor={() => setTutorOpen(true)}
            onCopySnippet={handleCopySnippet}
            copiedSnippet={copiedSnippet}
          />
        </div>
      </div>

      {/* Failure Investigation Banner if Triggered */}
      {failureTriggered && currentStep.injectableFailure && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-black to-zinc-950 border-2 border-rose-500 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500 text-black font-black text-[10px] uppercase">
                  FALLA INYECTADA: {currentStep.injectableFailure.title}
                </span>
                <span className="text-zinc-400 text-xs font-mono">
                  {currentStep.injectableFailure.blockedLayer}
                </span>
              </div>
              <p className="text-white font-bold text-sm font-sans-editorial">
                {currentStep.injectableFailure.investigationPrompt}
              </p>
              <p className="text-rose-200 text-xs font-sans-editorial">
                Síntoma en monitor: {currentStep.injectableFailure.symptom}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToRepair && (
              <button
                type="button"
                onClick={onNavigateToRepair}
                className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs transition-colors cursor-pointer shadow-md"
              >
                IR AL REPAIR LAB ➔
              </button>
            )}
            <button
              type="button"
              onClick={() => setFailureTriggered(false)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold border border-zinc-700 cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TIMELINE BAR & STEPPER NAVIGATION
      ======================================================== */}
      <div className="p-4 rounded-2xl bg-[#090c12] border border-cyan-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={handlePrev}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-800 text-zinc-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ANTERIOR</span>
          </button>

          <button
            type="button"
            disabled={currentStepIndex === WINDOWS_BOOT_STEPS.length - 1}
            onClick={handleNext}
            className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.3)]"
          >
            <span>SIGUIENTE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-xs font-bold transition-colors cursor-pointer"
          >
            REVERTIR
          </button>
        </div>

        {/* Step Micro-Indicators Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-xl">
          {WINDOWS_BOOT_STEPS.map((s, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            const hasFailure = Boolean(s.injectableFailure);

            let dotClass = 'bg-zinc-800 hover:bg-zinc-700';
            if (isCurrent) dotClass = 'bg-cyan-400 ring-2 ring-cyan-400 shadow-[0_0_8px_#00d2ff] w-4';
            else if (isPassed) dotClass = 'bg-cyan-900';

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setFailureTriggered(false);
                }}
                title={`${s.sequenceNumber}. ${s.name}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${dotClass} ${isCurrent ? 'w-5' : 'w-2.5'}`}
              />
            );
          })}
        </div>

        <div className="text-[10px] text-zinc-500 font-mono">
          Fase: <strong className="text-cyan-300">{currentStep.phase}</strong>
        </div>
      </div>

      {/* Tutor Modal */}
      <EvoTutorModal
        isOpen={tutorOpen}
        onClose={() => setTutorOpen(false)}
        stepName={currentStep.name}
        simpleExplanation={currentStep.simpleExplanation}
        realWorldAnalogy={currentStep.analogicQuestion}
      />

      {/* Term Glossary Modal */}
      <TermGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        initialSearch={glossaryTerm}
      />
    </div>
  );
};
