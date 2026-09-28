// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — PASO 1 A PASO 7 MACHINE FIRST WORKFLOW
// Principle: "LA COMPUTADORA ENTRA PRIMERO AL LABORATORIO. NO SE ADIVINA. SE MIDE."
// ============================================================================

import React, { useState } from 'react';
import {
  Zap,
  Wrench,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Edit3,
  HardDrive,
  Sliders,
  RotateCcw,
  BookOpen,
  FileText,
  Monitor,
  Box,
  CornerDownRight,
  Loader2,
} from 'lucide-react';
import { Machine, EpistemicProvenance } from '../types';
import { BaselineSnapshot, BaselineEngine } from '../services/baselineEngine';
import { EvoAgentClient } from '../services/evoAgentClient';
import { EvoLiveMachineBusDiagram } from '../components/EvoLiveMachineBusDiagram';

interface EvoMachineFirstWorkflowProps {
  machine: Machine;
  onImportThisPc: () => void;
  onBuildOrLoadPc: () => void;
  onCompleteUnknownRequested: () => void;
  onSelectAction: (
    action:
      | 'REPAIR'
      | 'TEST'
      | 'BUILD'
      | 'BOTTLENECK'
      | 'OPTIMIZE'
      | 'UPGRADE'
      | 'COMPATIBILITY'
      | 'LEARN'
      | 'DOSSIER'
  ) => void;
}

export const EvoMachineFirstWorkflow: React.FC<EvoMachineFirstWorkflowProps> = ({
  machine,
  onImportThisPc,
  onBuildOrLoadPc,
  onCompleteUnknownRequested,
  onSelectAction,
}) => {
  // Machine Intake State: if false, ONLY the initial intake screen is shown
  const [hasEnteredBench, setHasEnteredBench] = useState<boolean>(() => {
    return machine.isDetected || machine.source === 'MANUAL_BUILD';
  });

  // Native live detection loading state
  const [isSamplingLiveSensor, setIsSamplingLiveSensor] = useState(false);

  // Lab Power and Baseline State
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
  const [baselineSnapshot, setBaselineSnapshot] = useState<BaselineSnapshot | null>(null);
  const [showBusDiagram, setShowBusDiagram] = useState<boolean>(false);
  const [isRunningBaseline, setIsRunningBaseline] = useState<boolean>(false);

  const handleLiveHardwareImport = async () => {
    setIsSamplingLiveSensor(true);
    try {
      const result = await EvoAgentClient.importThisPc();
      if (result.success && result.machine) {
        setHasEnteredBench(true);
      } else {
        onImportThisPc();
      }
    } catch {
      onImportThisPc();
    } finally {
      setIsSamplingLiveSensor(false);
    }
  };

  const handlePowerOnAndRunBaseline = () => {
    setIsPoweredOn(true);
    setIsRunningBaseline(true);

    setTimeout(() => {
      const snap = BaselineEngine.captureBaseline(machine);
      setBaselineSnapshot(snap);
      setIsRunningBaseline(false);
    }, 600);
  };

  const getProvBadge = (prov: EpistemicProvenance) => {
    switch (prov) {
      case 'MEASURED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            MEASURED
          </span>
        );
      case 'SYSTEM_REPORTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            SYSTEM_REPORTED
          </span>
        );
      case 'DETECTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            DETECTED
          </span>
        );
      case 'CALIBRATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CALIBRATED
          </span>
        );
      case 'DERIVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            DERIVED
          </span>
        );
      case 'ESTIMATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            ESTIMATED
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            SIMULATED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-mono-tech select-none animate-in fade-in duration-300">
      {/* ==================================================================== */}
      {/* PASO 1: ¿QUÉ PC VAMOS A PONER EN EL LABORATORIO?                     */}
      {/* ==================================================================== */}
      {!hasEnteredBench ? (
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#0f1420] to-[#0a0d14] p-6 sm:p-10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3 mb-8">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/40 text-xs font-black tracking-wider uppercase">
                PASO 1 // ENTRADA AL LABORATORIO
              </span>
              <span className="text-xs text-zinc-400 font-mono">REGLA Nº 1: MACHINE FIRST</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
              ¿QUÉ PC VAMOS A PONER EN EL LABORATORIO?
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm font-sans-editorial leading-relaxed">
              En EVO LABS la computadora entra primero. No adivinamos componentes: o detectamos la telemetría física de este equipo o construimos manualmente la especificación exacta para someterla a examen pericial.
            </p>
          </div>

          {/* The 2 Primary Ingestion Doors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Action 1: Import this PC */}
            <button
              type="button"
              onClick={handleLiveHardwareImport}
              disabled={isSamplingLiveSensor}
              className="p-6 rounded-3xl border border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xl relative overflow-hidden disabled:opacity-50"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  {isSamplingLiveSensor ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Zap className="w-6 h-6 fill-current" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block font-mono">
                    OPCIÓN A // RECOMENDADO
                  </span>
                  <h3 className="font-display font-black text-xl text-white group-hover:text-emerald-300 uppercase">
                    IMPORTAR ESTA PC AUTOMÁTICAMENTE
                  </h3>
                </div>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  EVO detecta en vivo todo lo que pueda conocer realmente de este equipo físico: GPU dedicada (WebGL unmasked), hilos concurrentes de CPU, memoria RAM, monitor y sistema operativo.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>{isSamplingLiveSensor ? 'SONDEANDO SILICIO...' : 'DETECTAR & PONER EN LABORATORIO'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Action 2: Build / Load PC */}
            <button
              type="button"
              onClick={onBuildOrLoadPc}
              className="p-6 rounded-3xl border border-purple-500/50 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-950/40 text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase block font-mono">
                    OPCIÓN B // CREADOR & CLIENTES
                  </span>
                  <h3 className="font-display font-black text-xl text-white group-hover:text-purple-300 uppercase">
                    ARMAR / CARGAR UNA PC
                  </h3>
                </div>
                <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                  Construí manualmente tu equipo, una PC futura a presupuestar, una notebook de un cliente, un mini PC o una workstation de trabajo componente a componente.
                </p>
              </div>
              <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>CONFIGURAR ESPECIFICACIÓN EN TALLER</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Quick Bench Reference fallback */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-zinc-500 font-sans-editorial">
              ¿Querés explorar el laboratorio directamente con la estación de silicio calibrada de fábrica?
            </span>
            <button
              type="button"
              onClick={() => setHasEnteredBench(true)}
              className="text-amber-400 hover:text-amber-300 font-bold font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <span>CONTINUAR CON {machine.alias}</span>
              <CornerDownRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ==================================================================== */
        /* BENCH ACTIVE: SILICON STATE -> BASELINE -> 8 LAB MISSIONS           */
        /* ==================================================================== */
        <>
          {/* PASO 2 & 3: ESTADO DEL SILICIO EN BANCO */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0d1017] p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 uppercase font-mono">
                    ESTADO DEL SILICIO EN BANCO
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    PROCEDENCIA: {machine.overallProvenance}
                  </span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight mt-1">
                  TU PC EN EL LABORATORIO: {machine.alias}
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setHasEnteredBench(false)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>CAMBIAR DE PC</span>
                </button>

                <button
                  type="button"
                  onClick={onCompleteUnknownRequested}
                  className="px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Completar fuente, cooler o datos mecánicos"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>COMPLETAR UNKNOWN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBusDiagram(!showBusDiagram)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-4 h-4" />
                  <span>{showBusDiagram ? 'OCULTAR BUSES' : 'VER BUSES DE DATOS'}</span>
                </button>
              </div>
            </div>

            {/* Subsystems Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              {/* CPU */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" /> CPU
                  </span>
                  {getProvBadge(machine.cpu.provenance)}
                </div>
                <div className="font-bold text-white text-xs truncate" title={machine.cpu.model}>
                  {machine.cpu.model.split('@')[0]}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {machine.cpu.cores}c / {machine.cpu.threads}t • {machine.cpu.tdpW}W TDP
                </div>
              </div>

              {/* RAM */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-cyan-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> RAM
                  </span>
                  {getProvBadge(machine.ram.provenance)}
                </div>
                <div className="font-bold text-white text-xs">
                  {machine.ram.sizeGb} GB {machine.ram.type !== 'UNKNOWN' ? machine.ram.type : ''}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {machine.ram.configuredSpeedMts} MT/s
                </div>
              </div>

              {/* GPU */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> GPU
                  </span>
                  {getProvBadge(machine.gpu.provenance)}
                </div>
                <div className="font-bold text-white text-xs truncate" title={machine.gpu.model}>
                  {machine.gpu.model}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {machine.gpu.vramGb} GB VRAM • {machine.gpu.powerW}W
                </div>
              </div>

              {/* STORAGE */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-purple-400 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" /> DISCO
                  </span>
                  {getProvBadge(machine.storage.provenance)}
                </div>
                <div className="font-bold text-white text-xs truncate">
                  {machine.storage.capacityGb} GB
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {machine.storage.type}
                </div>
              </div>

              {/* MOTHERBOARD */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-blue-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> PLACA
                  </span>
                  {getProvBadge(machine.motherboard.provenance)}
                </div>
                <div className="font-bold text-white text-xs truncate" title={machine.motherboard.model}>
                  {machine.motherboard.model}
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {machine.motherboard.socket}
                </div>
              </div>

              {/* PSU */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-yellow-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> FUENTE
                  </span>
                  {getProvBadge(machine.psu.provenance)}
                </div>
                <div className="font-bold text-white text-xs">
                  {machine.psu.wattageW}W
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {machine.psu.rating || '80+ Certified'}
                </div>
              </div>

              {/* COOLING */}
              <div className="p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-sky-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> COOLER
                  </span>
                  {getProvBadge(machine.cooling.provenance)}
                </div>
                <div className="font-bold text-white text-xs truncate" title={machine.cooling.type}>
                  {machine.cooling.type}
                </div>
                <div className="text-[10px] text-zinc-400">
                  Cap: {machine.cooling.tdpCapacityW}W
                </div>
              </div>
            </div>

            {/* Live Bus Interconnect Diagram */}
            {showBusDiagram && (
              <div className="pt-2 animate-in fade-in duration-200">
                <EvoLiveMachineBusDiagram
                  machine={machine}
                  isPoweredOn={isPoweredOn}
                  onTogglePower={() => setIsPoweredOn(!isPoweredOn)}
                />
              </div>
            )}
          </div>

          {/* PASO 4, 5 & 6: ENCENDER EN LABORATORIO + BASELINE AUTOMÁTICO */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0c0f16] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black tracking-wider uppercase font-mono">
                  BASELINE OBLIGATORIO DE BANCO
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                  ENCENDER EN LABORATORIO & CAPTURA DE BASELINE
                </h2>
                <p className="text-zinc-400 text-xs font-sans-editorial leading-relaxed max-w-2xl">
                  Regla fundamental de EVO: <strong>Nunca se diagnostica, prueba u optimiza a ciegas</strong>. Antes de abrir cualquier investigación, EVO recopila un Baseline Snapshot del estado de silicio, memoria y holgura eléctrica.
                </p>
              </div>

              <div>
                {!baselineSnapshot ? (
                  <button
                    type="button"
                    onClick={handlePowerOnAndRunBaseline}
                    disabled={isRunningBaseline}
                    className="px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    <span>{isRunningBaseline ? 'MIDIENDO EN BANCO...' : 'ENCENDER EN LABORATORIO'}</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>BASELINE REGISTRADA</span>
                  </div>
                )}
              </div>
            </div>

            {/* Display Baseline Snapshot Readings if captured */}
            {baselineSnapshot && (
              <div className="space-y-4 pt-4 border-t border-zinc-800/80 animate-in fade-in duration-300">
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">
                      DICTAMEN GENERAL DE SILICIO
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 font-sans-editorial">
                      {baselineSnapshot.summaryEs}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                    baselineSnapshot.overallHealthStatus === 'READY'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {baselineSnapshot.overallHealthStatus}
                  </span>
                </div>

                {/* Metric readings list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {baselineSnapshot.readings.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-zinc-300">{r.label}</span>
                        {getProvBadge(r.provenance)}
                      </div>
                      <div className="text-sm font-bold text-white font-mono">
                        {r.value}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-sans-editorial leading-tight">
                        {r.notes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PASO 7: ¿QUÉ QUERÉS INVESTIGAR CON ESTA PC? (SOLO SE DESBLOQUEA TRAS ENCENDER O BASELINE) */}
          {isPoweredOn ? (
            <div className="space-y-4 pt-2 animate-in fade-in duration-300">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">
                  ELECCIÓN DE MISIÓN PERICIAL
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  ¿QUÉ QUERÉS INVESTIGAR CON ESTA PC?
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-sans-editorial">
                  La máquina ya está identificada y encendida con telemetría pericial. Seleccioná el área de trabajo en el laboratorio:
                </p>
              </div>

              {/* 8 Laboratory Doors Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {/* 1. DIAGNOSTICAR / REPARAR */}
                <div
                  onClick={() => onSelectAction('REPAIR')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-amber-400/80 bg-[#0d1017] hover:bg-[#121622] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-amber-300 uppercase">
                      1. REPARACIÓN // FALLAS
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Apagados repentinos, no da video, pantallas azules o reinicios. Árbol de hipótesis pericial.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>INICIAR DESCARTE</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 2. CUELLOS DE BOTELLA */}
                <div
                  onClick={() => onSelectAction('BOTTLENECK')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-red-400/80 bg-[#0d1017] hover:bg-[#171015] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-red-400/10 border border-red-400/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-red-300 uppercase">
                      2. CUELLOS DE BOTELLA
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Análisis determinista frente a una carga concreta (CS2, Premiere, Blender). Sin porcentajes inventados.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-red-400">
                    <span>ANALIZAR LIMITANTES</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 3. ARMAR / MODIFICAR */}
                <div
                  onClick={() => onSelectAction('BUILD')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-purple-400/80 bg-[#0d1017] hover:bg-[#161020] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-400/10 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-purple-300 uppercase">
                      3. TALLER DE ARMADO
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Modificá componentes, cambiá placa, fuente, cooler o tarjeta con validación de compatibilidad en vivo.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>MODIFICAR EN TALLER</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 4. PRUEBA DE CARGA */}
                <div
                  onClick={() => onSelectAction('TEST')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-cyan-400/80 bg-[#0d1017] hover:bg-[#0c1620] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-cyan-300 uppercase">
                      4. ENSAYO // BENCHMARKS
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Simulá rendimiento en juegos competitivos 1080p, AAA 1440p o render 4K con evidencia pericial.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>PROBAR EN BANCO</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 5. OPTIMIZACIÓN */}
                <div
                  onClick={() => onSelectAction('OPTIMIZE')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-emerald-400/80 bg-[#0d1017] hover:bg-[#0c1a14] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-emerald-300 uppercase">
                      5. OPTIMIZACIÓN REAL
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Auditoría de latencia DPC, XMP/EXPO apagado, perfiles energéticos y limpieza sin scripts riesgosos.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>OPTIMIZAR SILICIO</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 6. UPGRADE */}
                <div
                  onClick={() => onSelectAction('UPGRADE')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-blue-400/80 bg-[#0d1017] hover:bg-[#0d1525] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-blue-300 uppercase">
                      6. CAMINO DE UPGRADE
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Qué conviene actualizar primero para maximizar FPS por peso invertido en esta plataforma concreta.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>VER UPGRADES</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 7. EXPEDIENTE */}
                <div
                  onClick={() => onSelectAction('DOSSIER')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-zinc-500 bg-[#0d1017] hover:bg-[#141720] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-zinc-200 uppercase">
                      7. EXPEDIENTE PERICIAL
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Generá el informe técnico firmado para el cliente, taller o archivo pericial con procedencia de datos.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-zinc-400 group-hover:text-white">
                    <span>EMITIR DICTAMEN</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 8. APRENDER */}
                <div
                  onClick={() => onSelectAction('LEARN')}
                  className="p-5 rounded-2xl border border-zinc-800 hover:border-indigo-400/80 bg-[#0d1017] hover:bg-[#121326] transition-all cursor-pointer flex flex-col justify-between group shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-400/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-base text-white group-hover:text-indigo-300 uppercase">
                      8. APRENDER // TOMOS
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Conocé las bases físicas del silicio, buses PCIe, VRM y arquitectura en la enciclopedia didáctica.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span>LEER ENCICLOPEDIA</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/40 text-center space-y-2">
              <Zap className="w-6 h-6 text-zinc-500 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-400 uppercase">
                Laboratorio en espera de ignición
              </h3>
              <p className="text-xs text-zinc-500 font-sans-editorial max-w-md mx-auto">
                Presioná <strong>ENCENDER EN LABORATORIO</strong> arriba para capturar el baseline pericial y desbloquear las 8 misiones de diagnóstico, reparación, benchmarks y taller.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
