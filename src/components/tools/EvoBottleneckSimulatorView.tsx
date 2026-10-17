import React, { useState } from 'react';
import { EvoLabCoreBottleneckView } from '../evoLabCore/views/EvoLabCoreBottleneckView';
import { Machine } from '../evoLabCore/types';
import { Target, ArrowLeft } from 'lucide-react';

interface EvoBottleneckSimulatorViewProps {
  onReturnToTools: () => void;
  initialMachine?: Machine;
}

const DEFAULT_BOTTLENECK_MACHINE: Machine = {
  id: 'evo-bottleneck-machine-01',
  alias: 'ESTACIÓN DE PRUEBA // ANÁLISIS DE CUELLO DE BOTELLA',
  name: 'ESTACIÓN DE PRUEBA // ANÁLISIS DE CUELLO DE BOTELLA',
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

export const EvoBottleneckSimulatorView: React.FC<EvoBottleneckSimulatorViewProps> = ({
  onReturnToTools,
  initialMachine,
}) => {
  const [machine, setMachine] = useState<Machine>(initialMachine || DEFAULT_BOTTLENECK_MACHINE);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-mono-tech select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToTools}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-sm font-medium transition border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Volver a Herramientas</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden md:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
                  Simulador Pericial • Carga de Trabajo Real
                </span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Herramienta Independiente
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
                ENCONTRÁ EL CUELLO DE BOTELLA
              </h1>
            </div>
          </div>
        </div>

        {/* CORE SIMULATOR VIEW */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 md:p-6 shadow-xl">
          <EvoLabCoreBottleneckView
            machine={machine}
            onNavigateHome={onReturnToTools}
            onChangeMachineRequested={() => {
              // Can toggle or notify
            }}
          />
        </div>
      </div>
    </div>
  );
};
