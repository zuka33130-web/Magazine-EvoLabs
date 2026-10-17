import React, { useState } from 'react';
import { EvoLabCoreBuildView } from '../evoLabCore/views/EvoLabCoreBuildView';
import { Machine } from '../evoLabCore/types';
import { Boxes, X } from 'lucide-react';

interface EvoPcBuildArchitectProps {
  onClose?: () => void;
  isModal?: boolean;
  initialMachine?: Machine;
}

const DEFAULT_ARCHITECT_MACHINE: Machine = {
  id: 'evo-architect-machine-01',
  alias: 'ARQUITECTO // MI PROYECTO DE ARMADO',
  name: 'ARQUITECTO // MI PROYECTO DE ARMADO',
  machineType: 'CUSTOM_DESKTOP',
  isDetected: false,
  overallProvenance: 'USER_ENTERED',
  motherboard: {
    model: 'ASUS ROG Strix B650-E Gaming WiFi',
    socket: 'AM5',
    chipset: 'B650E',
    ramSlots: 4,
    ramType: 'DDR5',
    pcieGen: 'PCIe 5.0',
    formFactor: 'ATX',
    provenance: 'USER_ENTERED',
  },
  cpu: {
    model: 'AMD Ryzen 7 7800X3D',
    socket: 'AM5',
    cores: 8,
    threads: 16,
    baseClockGhz: 4.2,
    boostClockGhz: 5.0,
    tdpW: 120,
    hasIGPU: true,
    provenance: 'USER_ENTERED',
  },
  ram: {
    sizeGb: 32,
    configuredSpeedMts: 6000,
    type: 'DDR5',
    channels: 2,
    provenance: 'USER_ENTERED',
  },
  gpu: {
    model: 'NVIDIA GeForce RTX 4070 Super',
    vramGb: 12,
    isDedicated: true,
    powerW: 220,
    provenance: 'USER_ENTERED',
  },
  storage: {
    type: 'NVMe M.2',
    capacityGb: 2000,
    model: 'Samsung 990 PRO 2TB',
    provenance: 'USER_ENTERED',
  },
  psu: {
    wattageW: 850,
    rating: '80+ Gold',
    provenance: 'USER_ENTERED',
  },
  cooling: {
    model: 'DeepCool AK620 Digital',
    type: 'Air Tower',
    tdpCapacityW: 260,
    provenance: 'USER_ENTERED',
  },
  workloadTargets: [],
};

export const EvoPcBuildArchitect: React.FC<EvoPcBuildArchitectProps> = ({
  onClose,
  isModal = false,
  initialMachine,
}) => {
  const [currentMachine, setCurrentMachine] = useState<Machine>(
    initialMachine || DEFAULT_ARCHITECT_MACHINE
  );

  const content = (
    <div className="space-y-4 font-mono-tech select-none">
      {/* HEADER DE LA HERRAMIENTA INDEPENDIENTE */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 bg-zinc-950 p-4 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              HERRAMIENTA INDEPENDIENTE // ARQUITECTURA & BALANCE DE PC
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
            ARQUITECTO DE ARMADO DE PC
          </h2>
          <p className="text-xs text-zinc-400 font-sans-editorial max-w-2xl">
            Herramienta autónoma de presupuesto, compatibilidad y balance de hardware sin cuellos de botella.
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* SINGLE SOURCE OF TRUTH VIEW */}
      <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-2 sm:p-4 shadow-xl">
        <EvoLabCoreBuildView
          machine={currentMachine}
          onNavigateHome={onClose || (() => {})}
          onSaveMachine={(updated) => setCurrentMachine(updated)}
        />
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
        <div className="max-w-7xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
