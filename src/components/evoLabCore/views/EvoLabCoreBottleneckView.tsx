// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — BOTTLENECK VIEW
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import React, { useState } from 'react';
import { ArrowLeft, Target, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { Machine } from '../types';
import { BottleneckEngine, WorkloadProfile, BottleneckFinding } from '../services/bottleneckEngine';
import { EvoMachinePreparedCard } from '../components/EvoMachinePreparedCard';

interface EvoLabCoreBottleneckViewProps {
  machine: Machine;
  onNavigateHome: () => void;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onChangeMachineRequested?: () => void;
}

const PRESET_WORKLOADS: WorkloadProfile[] = [
  {
    id: 'cs2-comp',
    name: 'Counter-Strike 2 (1080p Competitivo 144+ FPS)',
    category: 'GAMING',
    resolution: '1080p',
    targetFramerate: 144,
    cpuDemands: 'HIGH',
    gpuDemands: 'MEDIUM',
    ramCapacityDemandsGb: 16,
    ramBandwidthCritical: true,
    vramDemandsGb: 6,
    storageIopsCritical: false,
  },
  {
    id: 'cyberpunk-4k',
    name: 'Cyberpunk 2077 (1440p / 4K Ray Tracing)',
    category: 'GAMING',
    resolution: '1440p',
    targetFramerate: 60,
    cpuDemands: 'HIGH',
    gpuDemands: 'EXTREME',
    ramCapacityDemandsGb: 16,
    ramBandwidthCritical: false,
    vramDemandsGb: 12,
    storageIopsCritical: true,
  },
  {
    id: 'premiere-4k',
    name: 'Adobe Premiere Pro (Línea de Tiempo 4K ProRes + Color)',
    category: 'PRODUCTIVITY',
    resolution: '4K',
    cpuDemands: 'EXTREME',
    gpuDemands: 'HIGH',
    ramCapacityDemandsGb: 32,
    ramBandwidthCritical: true,
    vramDemandsGb: 8,
    storageIopsCritical: true,
  },
  {
    id: 'blender-render',
    name: 'Blender Cycles 3D (Render OptiX / HIP)',
    category: 'PRODUCTIVITY',
    cpuDemands: 'HIGH',
    gpuDemands: 'EXTREME',
    ramCapacityDemandsGb: 32,
    ramBandwidthCritical: false,
    vramDemandsGb: 12,
    storageIopsCritical: false,
  },
];

export const EvoLabCoreBottleneckView: React.FC<EvoLabCoreBottleneckViewProps> = ({
  machine,
  onNavigateHome,
  onNavigateToTomo,
  onChangeMachineRequested,
}) => {
  const [selectedWorkload, setSelectedWorkload] = useState<WorkloadProfile>(PRESET_WORKLOADS[0]);
  const findings: BottleneckFinding[] = BottleneckEngine.analyzeBottlenecks(machine, selectedWorkload);

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
        <span className="text-xs font-bold text-amber-400">
          INVESTIGACIÓN DE CUELLOS DE BOTELLA
        </span>
      </div>

      {/* Machine Card */}
      <EvoMachinePreparedCard
        machine={machine}
        onChangeMachineRequested={onChangeMachineRequested}
        compact
      />

      {/* Workload Profile Selector */}
      <div className="p-5 rounded-2xl border border-zinc-800 bg-[#0d1017] space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          <h3 className="font-display font-black text-white text-base uppercase">
            SELECCIONÁ LA CARGA DE TRABAJO REAL (WORKLOAD PROFILE)
          </h3>
        </div>
        <p className="text-xs text-zinc-400 font-sans-editorial">
          En EVO LABS nunca se calcula un "cuello de botella del 23%" abstracto. Los cuellos de botella existen únicamente en relación con una carga de trabajo concreta.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {PRESET_WORKLOADS.map((w) => {
            const isSelected = selectedWorkload.id === w.id;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedWorkload(w)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 text-white shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                    : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400'
                }`}
              >
                <div>
                  <span className="text-[9px] font-bold text-amber-400 block mb-1">
                    {w.category}
                  </span>
                  <div className="font-bold text-white text-xs">{w.name}</div>
                </div>
                <div className="mt-3 text-[10px] text-zinc-500 font-mono">
                  Min RAM: {w.ramCapacityDemandsGb}GB • Min VRAM: {w.vramDemandsGb}GB
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-white text-base uppercase flex items-center gap-2">
            <span>DICTAMEN PERICIAL PARA ESTA CARGA</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-zinc-800 text-zinc-300">
              {findings.length} FACTORES EVALUADOS
            </span>
          </h3>
        </div>

        {findings.map((f, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all ${
              f.severity === 'CRITICAL'
                ? 'border-red-500/50 bg-red-950/15'
                : f.severity === 'MODERATE'
                ? 'border-amber-500/50 bg-amber-950/15'
                : 'border-emerald-500/50 bg-emerald-950/15'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                {f.severity === 'CRITICAL' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                ) : f.severity === 'MODERATE' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <h4 className="font-display font-bold text-white text-sm sm:text-base">
                  {f.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 border border-zinc-700 text-zinc-300">
                  {f.provenance}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  f.severity === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : f.severity === 'MODERATE'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {f.severity}
                </span>
              </div>
            </div>

            <p className="pt-3 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
              {f.explanationEs}
            </p>

            {f.recommendedActionEs && (
              <div className="mt-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-amber-300 flex items-center justify-between gap-3">
                <span><strong>Acción Recomendada:</strong> {f.recommendedActionEs}</span>
                {onNavigateToTomo && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTomo('01')}
                    className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-[10px] flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ENTENDER EN TOMO 01</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
