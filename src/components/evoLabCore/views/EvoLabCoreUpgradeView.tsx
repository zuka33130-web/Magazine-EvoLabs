// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — UPGRADE SCENARIOS VIEW
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, BookOpen, Layers, Zap } from 'lucide-react';
import { Machine } from '../types';
import { UpgradeEngine, MachineScenario, UpgradeComparisonResult } from '../services/upgradeEngine';
import { EvoMachinePreparedCard } from '../components/EvoMachinePreparedCard';

interface EvoLabCoreUpgradeViewProps {
  machine: Machine;
  onNavigateHome: () => void;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onChangeMachineRequested?: () => void;
}

export const EvoLabCoreUpgradeView: React.FC<EvoLabCoreUpgradeViewProps> = ({
  machine,
  onNavigateHome,
  onNavigateToTomo,
  onChangeMachineRequested,
}) => {
  // Preset scenarios to experiment with
  const scenarios: MachineScenario[] = [
    {
      id: 'scen-ram-32gb',
      originalMachineId: machine.id,
      name: 'Escenario 1: Actualización a 32GB RAM Dual Channel',
      modifiedMachine: {
        ...machine,
        ram: {
          ...machine.ram,
          sizeGb: 32,
          channels: 2,
          provenance: 'SIMULATED',
        },
      },
      replacedSubsystems: ['ram'],
      changesDescription: ['Kit 2x16GB DDR4/DDR5 en Dual Channel 128-bit simétrico.'],
      estimatedCostUsd: 75,
    },
    {
      id: 'scen-gpu-rtx4060',
      originalMachineId: machine.id,
      name: 'Escenario 2: GPU Dedicada NVIDIA GeForce RTX 4060 8GB',
      modifiedMachine: {
        ...machine,
        gpu: {
          model: 'NVIDIA GeForce RTX 4060 8GB',
          vramGb: 8,
          isDedicated: true,
          powerW: 115,
          provenance: 'SIMULATED',
        },
      },
      replacedSubsystems: ['gpu'],
      changesDescription: ['Placa de video dedicada PCIe 4.0 x8 con 8GB GDDR6 y aceleración DLSS3.'],
      estimatedCostUsd: 299,
    },
    {
      id: 'scen-gpu-rtx4070-super',
      originalMachineId: machine.id,
      name: 'Escenario 3: GPU Gama Alta RTX 4070 SUPER + Fuente 750W',
      modifiedMachine: {
        ...machine,
        gpu: {
          model: 'NVIDIA GeForce RTX 4070 SUPER 12GB',
          vramGb: 12,
          isDedicated: true,
          powerW: 220,
          provenance: 'SIMULATED',
        },
        psu: {
          wattageW: 750,
          rating: '80+ Gold',
          provenance: 'SIMULATED',
        },
      },
      replacedSubsystems: ['gpu', 'psu'],
      changesDescription: [
        'GPU RTX 4070 SUPER 12GB GDDR6X (220W TDP con conector 12V-2x6).',
        'Fuente de poder modular 750W 80+ Gold ATX 3.0.',
      ],
      estimatedCostUsd: 699,
    },
  ];

  const [selectedScenario, setSelectedScenario] = useState<MachineScenario>(scenarios[0]);
  const comparison: UpgradeComparisonResult = UpgradeEngine.compareScenario(machine, selectedScenario);

  return (
    <div className="space-y-6 font-mono-tech select-none animate-in fade-in duration-200">
      {/* Top Breadcrumb & Return */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER AL LABORATORIO</span>
        </button>
        <span className="text-xs font-bold text-purple-400">
          SIMULADOR DE UPGRADES // ESCENARIOS VIRTUALES
        </span>
      </div>

      {/* Machine Card */}
      <EvoMachinePreparedCard
        machine={machine}
        onChangeMachineRequested={onChangeMachineRequested}
        compact
      />

      {/* Scenario Selector */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d1017] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="font-display font-black text-white text-base uppercase">
            SELECCIONÁ UN ESCENARIO DE ACTUALIZACIÓN
          </h3>
        </div>
        <p className="text-xs text-zinc-400 font-sans-editorial">
          La máquina física original nunca se altera. EVO crea un <code>MachineScenario</code> virtual para calcular beneficios esperados, compatibilidad eléctrica y gasto evitable antes de comprar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSelectedScenario(sc)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-400 bg-purple-400/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400'
                }`}
              >
                <div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase mb-1">
                    COSTO ESTIMADO: ~${sc.estimatedCostUsd} USD
                  </div>
                  <div className="font-bold text-white text-xs">{sc.name}</div>
                </div>
                <div className="mt-3 text-[10px] text-zinc-500 font-mono">
                  Reemplaza: [{sc.replacedSubsystems.join(', ').toUpperCase()}]
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Result */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0d121c] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-0.5">
              DICTAMEN DE RENTABILIDAD & COMPATIBILIDAD
            </span>
            <h3 className="font-display font-black text-white text-base sm:text-lg">
              {comparison.summaryEs}
            </h3>
          </div>

          <span className={`px-3 py-1 rounded-xl text-xs font-black self-start sm:self-auto ${
            comparison.costPerceivedValue === 'EXCELENTE_INVERSION'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : comparison.costPerceivedValue === 'EQUILIBRADO'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          }`}>
            {comparison.costPerceivedValue.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Benefits list */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> BENEFICIOS TÉCNICOS VERIFICADOS
          </h4>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-300 font-sans-editorial">
            {comparison.expectedBenefits.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Limitations / warnings */}
        {comparison.risksOrLimitations.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> RIESGOS / LIMITACIONES ELÉCTRICAS DETECTADAS
            </h4>
            <ul className="space-y-1.5 pl-4 list-disc text-xs text-amber-300 font-sans-editorial">
              {comparison.risksOrLimitations.map((l, idx) => (
                <li key={idx}>{l}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between border-t border-zinc-800 text-xs text-zinc-500">
          <span>Procedencia de esta evaluación: <strong>SIMULATED</strong> (No presentar como benchmark medido).</span>
          {onNavigateToTomo && (
            <button
              type="button"
              onClick={() => onNavigateToTomo('01')}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>APRENDER EN TOMO 01</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
