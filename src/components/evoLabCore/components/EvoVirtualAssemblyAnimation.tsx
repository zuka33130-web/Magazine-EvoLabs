// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — VIRTUAL ASSEMBLY ANIMATION
// Principle: "LA PC SE ARMA SOLA VISUALMENTE: SECUENCIA DETERMINISTA ANTES DEL LABORATORIO"
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Cpu,
  Fan,
  Sliders,
  HardDrive,
  Tv,
  Zap,
  Wifi,
  Monitor,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Machine } from '../types';

interface EvoVirtualAssemblyAnimationProps {
  machine: Machine;
  onComplete: () => void;
}

interface AssemblyStep {
  label: string;
  subsystem: string;
  icon: React.ReactNode;
  detail: string;
}

export const EvoVirtualAssemblyAnimation: React.FC<EvoVirtualAssemblyAnimationProps> = ({
  machine,
  onComplete,
}) => {
  const steps: AssemblyStep[] = [
    {
      label: 'Placa Base (Motherboard)',
      subsystem: 'motherboard',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      detail: `${machine.motherboard.model} fijada en chasis con espaciadores de cobre.`,
    },
    {
      label: 'Procesador (CPU)',
      subsystem: 'cpu',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      detail: `${machine.cpu.model} insertado en socket ${machine.cpu.socket} y asegurado por palanca ILM.`,
    },
    {
      label: 'Refrigeración (Cooling)',
      subsystem: 'cooling',
      icon: <Fan className="w-5 h-5 text-blue-400" />,
      detail: `${machine.cooling.type} montado con compuesto térmico de alta conductividad.`,
    },
    {
      label: 'Memoria RAM',
      subsystem: 'ram',
      icon: <Sliders className="w-5 h-5 text-emerald-400" />,
      detail: `${machine.ram.sizeGb}GB ${machine.ram.type} en ranuras DIMM primarias (Dual Channel).`,
    },
    {
      label: 'Almacenamiento (Storage)',
      subsystem: 'storage',
      icon: <HardDrive className="w-5 h-5 text-amber-400" />,
      detail: `${machine.storage.model || machine.storage.type} instalado con disipador M.2.`,
    },
    {
      label: 'Placa de Video (GPU)',
      subsystem: 'gpu',
      icon: <Tv className="w-5 h-5 text-pink-400" />,
      detail: `${machine.gpu.model} calzada en ranura PCIe 16x con traba mecánica.`,
    },
    {
      label: 'Fuente de Poder (PSU)',
      subsystem: 'psu',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      detail: `Líneas ATX 24 pines, EPS 12V y PCIe de ${machine.psu.wattageW}W conectadas.`,
    },
    {
      label: 'Ventilación de Chasis',
      subsystem: 'fans',
      icon: <Fan className="w-5 h-5 text-teal-400" />,
      detail: `Ventiladores configurados para presión positiva y flujo frontal-trasero.`,
    },
    {
      label: 'Red & Audio',
      subsystem: 'network',
      icon: <Wifi className="w-5 h-5 text-indigo-400" />,
      detail: `Interfaces Ethernet, Wi-Fi y códec de audio inicializados en bus PCIe/USB.`,
    },
    {
      label: 'Periféricos & Monitor',
      subsystem: 'peripherals',
      icon: <Monitor className="w-5 h-5 text-cyan-300" />,
      detail: `Salida de video DisplayPort/HDMI y periféricos HID sincronizados.`,
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      const doneTimer = setTimeout(() => {
        onComplete();
      }, 900);
      return () => clearTimeout(doneTimer);
    }
  }, [currentStepIndex, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 font-mono-tech select-none animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0b0e14] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/30">
                ENSAMBLADO VIRTUAL DETERMINISTA
              </span>
            </div>
            <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
              {isFinished ? 'MACHINE READY // LISTA PARA EL LABORATORIO' : 'ARMANDO COMPUTADORA EN BANCO'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            SALTAR ANIMACIÓN
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
            <span>
              Etapa {Math.min(currentStepIndex + 1, steps.length)} de {steps.length}
            </span>
            <span className="text-cyan-300 font-bold">
              {Math.round((Math.min(currentStepIndex, steps.length) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-200"
              style={{ width: `${(Math.min(currentStepIndex, steps.length) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Sequence Checklist */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin text-xs">
          {steps.map((st, idx) => {
            const isInstalled = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isInstalled
                    ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-200'
                    : isCurrent
                    ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-200 shadow-md animate-pulse'
                    : 'border-zinc-800/60 bg-zinc-950/30 text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">{st.icon}</div>
                  <div>
                    <span className="font-bold text-xs block">{st.label}</span>
                    <span className="text-[10px] text-zinc-400 font-sans-editorial block truncate max-w-sm sm:max-w-md">
                      {st.detail}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isInstalled ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>INSTALADO</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      INSTALANDO...
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-700 font-mono">PENDIENTE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {isFinished && (
          <div className="pt-2 text-center animate-in zoom-in-95">
            <span className="text-emerald-400 text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>CIRCUITO Y BUSES VERIFICADOS. INICIALIZANDO ENTORNO PERICIAL...</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
