import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Terminal,
  Activity,
  Layers,
  Cpu,
  HardDrive,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { BOOT_LAB_SCENARIOS, BootLabScenario } from '../../../data/tomo02Sector01CasesAndTests';

interface Tomo02Sector01LabModalProps {
  onClose: () => void;
  onScenarioCompleted?: (scenarioId: string) => void;
}

export const Tomo02Sector01LabModal: React.FC<Tomo02Sector01LabModalProps> = ({
  onClose,
  onScenarioCompleted,
}) => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [selectedHypothesis, setSelectedHypothesis] = useState<Record<string, string>>({});
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, boolean>>({});

  const scenario: BootLabScenario = BOOT_LAB_SCENARIOS[activeScenarioIndex];
  const selectedHypId = selectedHypothesis[scenario.id];
  const isDone = completedScenarios[scenario.id];

  const handleSelectHypothesis = (optId: string) => {
    setSelectedHypothesis((prev) => ({ ...prev, [scenario.id]: optId }));
    const opt = scenario.options.find((o) => o.id === optId);
    if (opt && opt.isCorrect) {
      setCompletedScenarios((prev) => ({ ...prev, [scenario.id]: true }));
      onScenarioCompleted?.(scenario.id);
    }
  };

  const renderSimulatedScreen = (visualType: BootLabScenario['simulatedVisual']) => {
    switch (visualType) {
      case 'NO_BOOT_DEVICE_SCREEN':
        return (
          <div className="w-full h-44 bg-black p-4 font-mono text-xs text-zinc-300 flex flex-col justify-between border border-zinc-800 rounded-xl">
            <div>
              <div className="text-zinc-500">American Megatrends BIOS Setup Utility v2.20</div>
              <div className="mt-3 text-white font-bold">
                Reboot and Select proper Boot device
              </div>
              <div className="text-zinc-400">
                or Insert Boot Media in selected Boot device and press a key...
              </div>
            </div>
            <div className="text-[10px] text-zinc-600 animate-pulse">_</div>
          </div>
        );

      case 'UEFI_SETUP_LOOP':
        return (
          <div className="w-full h-44 bg-[#005A9E]/30 border border-[#00A4EF]/50 p-4 font-mono text-xs text-white flex flex-col justify-between rounded-xl shadow-inner">
            <div className="space-y-2">
              <div className="text-sm font-bold text-[#60CDFF]">UEFI BIOS UTILITY - EZ MODE</div>
              <div className="text-xs text-zinc-300">
                Boot Priority: [ No Bootable Device Detected in Storage Hierarchy ]
              </div>
              <div className="p-2 bg-black/50 border border-sky-500/30 rounded font-mono text-xs text-amber-400">
                NVMe M.2 (Slot 1): Samsung 980 PRO 1TB — [ ESP Fat32 Partition Missing ]
              </div>
            </div>
            <div className="text-[10px] text-zinc-400">
              Press F7 for Advanced Mode · F10 to Save & Exit
            </div>
          </div>
        );

      case 'BCD_RECOVERY_BLUE':
        return (
          <div className="w-full h-44 bg-[#0078D4] p-4 font-mono text-xs text-white flex flex-col justify-between rounded-xl shadow-inner">
            <div className="space-y-1.5">
              <div className="text-sm font-bold">Recovery</div>
              <div className="text-[11px] text-blue-100">
                Your PC/Device needs to be repaired.
              </div>
              <div className="text-[11px] text-blue-100">
                The Boot Configuration Data for your PC is missing or contains errors.
              </div>
              <div className="text-[11px] font-bold text-white mt-1">
                File: \EFI\Microsoft\Boot\BCD · Error code: 0xc000000e
              </div>
            </div>
            <div className="text-[10px] text-blue-200">
              Press Enter to try again · Press F8 for Startup Settings
            </div>
          </div>
        );

      case 'INACCESSIBLE_BSOD':
        return (
          <div className="w-full h-44 bg-[#0078D4] p-4 font-sans text-xs text-white flex flex-col justify-between rounded-xl shadow-inner">
            <div className="space-y-2">
              <div className="text-2xl">:(</div>
              <div className="text-xs text-blue-100">
                Your PC ran into a problem and needs to restart. We're just collecting some error info...
              </div>
              <div className="text-xs font-mono font-bold text-white">
                Stop Code: INACCESSIBLE_BOOT_DEVICE
              </div>
            </div>
            <div className="text-[10px] font-mono text-blue-200">
              For more information visit: https://windows.com/stopcode
            </div>
          </div>
        );

      case 'BLACK_SCREEN_CURSOR':
        return (
          <div className="w-full h-44 bg-black p-4 font-mono text-xs relative border border-zinc-800 rounded-xl flex items-center justify-center">
            <div className="text-zinc-600 text-[11px] select-none text-center">
              [ Pantalla negra sin interfaz de escritorio ]
            </div>
            <div className="absolute top-10 left-16 flex items-center gap-1">
              <div className="w-3 h-3 border-l-2 border-t-2 border-white rotate-[-45deg] shadow-[0_0_8px_#fff]" />
              <span className="text-[9px] text-white bg-zinc-900 px-1 rounded border border-zinc-700">Cursor Activo</span>
            </div>
          </div>
        );

      case 'BLACK_SCREEN_FAN':
      default:
        return (
          <div className="w-full h-44 bg-black p-4 font-mono text-xs text-zinc-500 flex flex-col items-center justify-center border border-zinc-800 rounded-xl">
            <div className="text-zinc-500 text-xs">[ Pantalla completamente negra · Ventiladores al 100% ]</div>
            <div className="text-[10px] text-zinc-600 mt-1">Sin señal de video en HDMI / DisplayPort</div>
          </div>
        );
    }
  };

  const totalDone = Object.values(completedScenarios).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl bg-[#080B10] border border-sky-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,164,239,0.18)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-sky-500/20 bg-[#080B10] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0078D4]/20 border border-[#00A4EF]/40 flex items-center justify-center text-[#60CDFF] font-mono font-bold text-sm">
              {totalDone}/{BOOT_LAB_SCENARIOS.length}
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-widest">
                LABORATORIO PERICIAL // SIMULADOR DE ARRANQUE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight font-display">
                UEFI + BOOT SEQUENCE LAB // AISLAMIENTO DE RUPTURA
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Scenario Selector */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0C1118] border-b border-sky-500/15 overflow-x-auto shrink-0">
          {BOOT_LAB_SCENARIOS.map((s, idx) => {
            const isScenDone = completedScenarios[s.id];
            const isActive = idx === activeScenarioIndex;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScenarioIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                    : isScenDone
                    ? 'bg-emerald-950/60 text-[#16C784] border border-emerald-500/40'
                    : 'bg-[#11161D] text-zinc-400 hover:text-white border border-sky-500/20'
                }`}
              >
                <span>{s.code}</span>
                {isScenDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#16C784]" />}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Scenario Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#0078D4]/20 border border-[#00A4EF]/40 text-xs font-mono text-[#60CDFF] font-bold">
                {scenario.code} // {scenario.name}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#11161D] border border-sky-500/20 text-xs font-mono text-zinc-300 font-bold">
                ESTADO: {scenario.symptomText}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              {scenario.description}
            </p>

            {/* Simulated monitor visual */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-[#60CDFF] uppercase">
                MONITOR VIRTUAL DE SALIDA // TELEMETRÍA DE PANTALLA
              </div>
              {renderSimulatedScreen(scenario.simulatedVisual)}
            </div>
          </div>

          {/* Diagnostic Hypothesis Decision */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#60CDFF] font-bold uppercase flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#00A4EF]" />
              ¿EN QUÉ FASE EXACTA DE LAS ETAPAS DE ARRANQUE SE PRODUJO LA FALLA?
            </div>

            <div className="space-y-2.5">
              {scenario.options.map((opt) => {
                const isSelected = selectedHypId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectHypothesis(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-950/50 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-[#11161D] border-sky-500/20 hover:border-sky-500/40 text-zinc-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center text-xs font-mono font-bold mt-0.5 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'border-emerald-400 bg-emerald-500 text-black'
                            : 'border-red-400 bg-red-500 text-white'
                          : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {opt.id.toUpperCase()}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="text-xs sm:text-sm font-semibold">{opt.text}</div>
                      {isSelected && (
                        <div
                          className={`text-xs font-mono leading-relaxed pt-1.5 border-t ${
                            opt.isCorrect
                              ? 'border-emerald-500/40 text-[#16C784]'
                              : 'border-red-500/40 text-[#FF4D5A]'
                          }`}
                        >
                          {opt.technicalDebrief}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Correct Explanation Card */}
          {isDone && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#0078D4]/15 via-[#11161D] to-[#11161D] border border-[#00A4EF]/50 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#60CDFF] uppercase">
                <CheckCircle2 className="w-4 h-4 text-[#16C784]" />
                <span>DIAGNÓSTICO PERICIAL CONFIRMADO</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                {scenario.options.find((o) => o.isCorrect)?.technicalDebrief}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-sky-500/20 bg-[#080B10] flex items-center justify-between shrink-0">
          <button
            onClick={() => setActiveScenarioIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeScenarioIndex === 0}
            className="px-4 py-2 rounded-lg bg-[#11161D] hover:bg-[#151B23] disabled:opacity-40 text-xs font-mono font-bold text-zinc-300 border border-sky-500/20 transition-colors cursor-pointer"
          >
            ← Escenario Anterior
          </button>

          <span className="text-xs font-mono text-zinc-400">
            {activeScenarioIndex + 1} de {BOOT_LAB_SCENARIOS.length}
          </span>

          <button
            onClick={() => setActiveScenarioIndex((prev) => Math.min(BOOT_LAB_SCENARIOS.length - 1, prev + 1))}
            disabled={activeScenarioIndex === BOOT_LAB_SCENARIOS.length - 1}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] disabled:opacity-40 text-xs font-mono font-bold text-white transition-all shadow-[0_0_15px_rgba(0,164,239,0.25)] cursor-pointer"
          >
            Siguiente Escenario →
          </button>
        </div>
      </div>
    </div>
  );
};
