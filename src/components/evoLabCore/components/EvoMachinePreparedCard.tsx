import React, { useState } from 'react';
import {
  Cpu,
  Tv,
  HardDrive,
  Layers,
  Zap,
  Activity,
  Fan,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Edit3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Machine, EpistemicProvenance } from '../types';
import { EvoLiveMachineBusDiagram } from './EvoLiveMachineBusDiagram';

interface EvoMachinePreparedCardProps {
  machine: Machine;
  onChangeMachineRequested?: () => void;
  compact?: boolean;
}

export const EvoMachinePreparedCard: React.FC<EvoMachinePreparedCardProps> = ({
  machine,
  onChangeMachineRequested,
  compact = false,
}) => {
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(true);
  const [showBusDiagram, setShowBusDiagram] = useState<boolean>(false);

  const getProvenanceBadge = (prov: EpistemicProvenance) => {
    switch (prov) {
      case 'MEASURED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MEASURED
          </span>
        );
      case 'SYSTEM_REPORTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
            SYSTEM_REPORTED
          </span>
        );
      case 'DETECTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            DETECTED
          </span>
        );
      case 'CALIBRATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            CALIBRATED
          </span>
        );
      case 'DERIVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            DERIVED
          </span>
        );
      case 'ESTIMATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            ESTIMATED
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            SIMULATED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-[#0d1017] p-4 sm:p-5 shadow-xl font-mono-tech relative overflow-hidden">
      {/* Subtle top indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 opacity-80" />

      {/* Header bar of the machine */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                MÁQUINA EN BANCO DE PRUEBAS
              </span>
              {getProvenanceBadge(machine.overallProvenance)}
            </div>
            <h3 className="font-display font-black text-white text-base sm:text-lg tracking-tight truncate max-w-md sm:max-w-xl">
              {machine.alias}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPoweredOn(!isPoweredOn)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isPoweredOn
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isPoweredOn ? 'text-emerald-400 fill-current' : ''}`} />
            <span>{isPoweredOn ? 'ENCENDIDA' : 'APAGADA'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBusDiagram(!showBusDiagram)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{showBusDiagram ? 'OCULTAR BUSES' : 'VER BUSES DE DATOS'}</span>
            {showBusDiagram ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onChangeMachineRequested && (
            <button
              type="button"
              onClick={onChangeMachineRequested}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>CAMBIAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Subsystems grid */}
      <div className={`pt-4 grid grid-cols-2 ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-4 lg:grid-cols-7'} gap-3 text-xs`}>
        {/* CPU */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-amber-400">
              <Cpu className="w-3.5 h-3.5" /> CPU
            </span>
            {getProvenanceBadge(machine.cpu.provenance)}
          </div>
          <div className="font-bold text-white text-xs truncate" title={machine.cpu.model}>
            {machine.cpu.model.split('@')[0]}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {machine.cpu.cores}c / {machine.cpu.threads}t • {machine.cpu.tdpW}W
          </div>
        </div>

        {/* RAM */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-cyan-400">
              <Activity className="w-3.5 h-3.5" /> RAM
            </span>
            {getProvenanceBadge(machine.ram.provenance)}
          </div>
          <div className="font-bold text-white text-xs">
            {machine.ram.sizeGb} GB {machine.ram.type !== 'UNKNOWN' ? machine.ram.type : ''}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {machine.ram.configuredSpeedMts} MT/s {machine.ram.channels === 2 ? '(Dual)' : ''}
          </div>
        </div>

        {/* GPU */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-400">
              <Tv className="w-3.5 h-3.5" /> GPU
            </span>
            {getProvenanceBadge(machine.gpu.provenance)}
          </div>
          <div className="font-bold text-white text-xs truncate" title={machine.gpu.model}>
            {machine.gpu.model}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {machine.gpu.vramGb} GB VRAM • {machine.gpu.isDedicated ? 'Dedicada' : 'Integrada'}
          </div>
        </div>

        {/* STORAGE */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-purple-400">
              <HardDrive className="w-3.5 h-3.5" /> DISCO
            </span>
            {getProvenanceBadge(machine.storage.provenance)}
          </div>
          <div className="font-bold text-white text-xs">
            {machine.storage.capacityGb} GB
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {machine.storage.type}
          </div>
        </div>

        {/* MOTHERBOARD */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-blue-400">
              <Layers className="w-3.5 h-3.5" /> PLACA
            </span>
            {getProvenanceBadge(machine.motherboard.provenance)}
          </div>
          <div className="font-bold text-white text-xs truncate" title={machine.motherboard.model}>
            {machine.motherboard.model}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {machine.motherboard.socket} • {machine.motherboard.pcieGen}
          </div>
        </div>

        {/* PSU */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-yellow-400">
              <Zap className="w-3.5 h-3.5" /> FUENTE
            </span>
            {getProvenanceBadge(machine.psu.provenance)}
          </div>
          <div className="font-bold text-white text-xs">
            {machine.psu.wattageW} Watts
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            {machine.psu.rating || 'Estándar'}
          </div>
        </div>

        {/* COOLING */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-sky-400">
              <Fan className="w-3.5 h-3.5" /> COOLER
            </span>
            {getProvenanceBadge(machine.cooling.provenance)}
          </div>
          <div className="font-bold text-white text-xs truncate" title={machine.cooling.type}>
            {machine.cooling.type}
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            Cap: {machine.cooling.tdpCapacityW}W TDP
          </div>
        </div>
      </div>

      {/* Expandable Live Bus Interconnect Diagram */}
      {showBusDiagram && (
        <div className="pt-4 border-t border-zinc-800/80 animate-in fade-in duration-200">
          <EvoLiveMachineBusDiagram
            machine={machine}
            isPoweredOn={isPoweredOn}
            onTogglePower={() => setIsPoweredOn(!isPoweredOn)}
          />
        </div>
      )}
    </div>
  );
};
