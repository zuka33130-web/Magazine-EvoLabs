import React, { useState } from 'react';
import { BOOT_SEQUENCE_STEPS, BootStep } from './bootSequenceData';
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
  HelpCircle,
  Activity,
  Cpu,
} from 'lucide-react';

interface EvoBootLabProps {
  onClose?: () => void;
}

export const EvoBootLab: React.FC<EvoBootLabProps> = ({ onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);

  const currentStep: BootStep = BOOT_SEQUENCE_STEPS[currentStepIndex];
  const totalSteps = BOOT_SEQUENCE_STEPS.length - 1; // 0 to 34 (34 steps)

  const handlePowerOn = () => {
    setIsPoweredOn(true);
    setCurrentStepIndex(1);
  };

  const handlePowerOff = () => {
    setIsPoweredOn(false);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (!isPoweredOn) {
      handlePowerOn();
      return;
    }
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
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
    if (index === 0) {
      handlePowerOff();
    } else {
      setIsPoweredOn(true);
      setCurrentStepIndex(index);
    }
  };

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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Top Control & Progress Section */}
        <section className="bg-[#0b0e14] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          {/* Step Counter and Power Switch */}
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
                title="Apagar y reiniciar secuencia de arranque"
              >
                <RotateCcw className="w-4 h-4" />
                <span>APAGAR / REINICIAR</span>
              </button>
            )}

            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                PROGRESO DEL ARRANQUE
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
                PASO {currentStep.stepNumber.toString().padStart(2, '0')} /{' '}
                <span className="text-zinc-500">{totalSteps}</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
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
        </section>

        {/* Machine Visual Display Component */}
        <EvoBootMachineVisual
          currentStep={currentStep}
          isPoweredOn={isPoweredOn}
        />

        {/* Pedagogical Step Deep-Dive Dossier */}
        <section className="bg-[#0b0e14] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden">
          {/* Layer and Step Header */}
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

            {/* Ideology Badge */}
            <div className="px-3 py-1 rounded-full bg-black/60 border border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-2 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>EVO: OBSERVAR → ENTENDER → COMPROBAR</span>
            </div>
          </div>

          {/* Explanation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-5">
            {/* Left Column: Mecánica Operativa */}
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

            {/* Right Column: Diagnóstico Forense y Pruebas Seguras */}
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

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>PRUEBA SEGURA SUGERIDA (COMPROBACIÓN METÓDICA)</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-200/90 font-sans-editorial leading-relaxed">
                  {currentStep.suggestedSafeTest}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-blue-400" />
                  <span>SIGUIENTE ESLABÓN DE LA CADENA</span>
                </div>
                <p className="text-xs text-blue-200/90 font-sans-editorial">
                  {currentStep.nextStep}
                </p>
              </div>

              {/* EVO Philosophy Quote Card */}
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
              <span>LÍNEA TEMPORAL COMPLETA DE ARRANQUE (35 ESTADOS)</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono-tech">
              CLICK EN CUALQUIER PASO PARA NAVEGACIÓN MANUAL
            </span>
          </div>

          {/* Timeline scroll container */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-zinc-700">
            {BOOT_SEQUENCE_STEPS.map((step, idx) => {
              const isSelected = currentStepIndex === idx;
              const isPassed = isPoweredOn && currentStepIndex >= idx;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleSelectStep(idx)}
                  className={`shrink-0 w-8 h-8 rounded-lg font-mono-tech text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-black scale-110 shadow-[0_0_12px_#f59e0b]'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                  title={`${step.stepNumber.toString().padStart(2, '0')}: ${step.name} (${step.layer})`}
                >
                  {step.stepNumber}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
