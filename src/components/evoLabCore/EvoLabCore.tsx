import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Zap,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  History,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FolderOpen,
  Globe,
  RotateCcw,
  Monitor,
  Box,
  HardDrive,
  Database,
} from 'lucide-react';
import { Machine, EvoCase } from './types';
import { MachineAdapter } from './services/machineAdapter';
import { EvoCaseRepository } from './services/caseRepository';
import { HardwareComponent, HardwareCatalogProvider } from './services/hardwareCatalog';
import { EvoHardwareDiscoveryModal } from './components/EvoHardwareDiscoveryModal';
import { CatalogCoverageDashboard } from './components/CatalogCoverageDashboard';
import { EvoMachinePreparedCard } from './components/EvoMachinePreparedCard';
import { EvoMachineSelectorModal } from './components/EvoMachineSelectorModal';
import { EvoCompleteUnknownModal } from './components/EvoCompleteUnknownModal';
import { EvoMachineIntakeScreen } from './components/EvoMachineIntakeScreen';
import { EvoUniversalPcBuilder } from './components/EvoUniversalPcBuilder';
import { EvoVirtualAssemblyAnimation } from './components/EvoVirtualAssemblyAnimation';
import { EvoLiveMachineBusDiagram } from './components/EvoLiveMachineBusDiagram';
import { BaselineEngine, BaselineSnapshot } from './services/baselineEngine';
import { TelemetryIntegrityService, LiveScanIntegrityResult } from './services/telemetryIntegrityService';
import { EvoTelemetryIntegrityModal } from './components/EvoTelemetryIntegrityModal';
import { EvoLabCoreRepairView } from './views/EvoLabCoreRepairView';
import { EvoLabCoreTestView } from './views/EvoLabCoreTestView';
import { EvoLabCoreBuildView } from './views/EvoLabCoreBuildView';
import { EvoLabCoreBottleneckView } from './views/EvoLabCoreBottleneckView';
import { EvoLabCoreOptimizationView } from './views/EvoLabCoreOptimizationView';
import { EvoLabCoreUpgradeView } from './views/EvoLabCoreUpgradeView';
import { useLabAestheticMode } from '../../utils/labAestheticMode';

interface EvoLabCoreProps {
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onOpenGlobalAutoDetectModal?: () => void;
  onExitToWorld?: () => void;
  initialPhase?: CorePhase;
  initialMission?: LabMission;
}

type CorePhase = 'SELECT_PC' | 'BUILD_PC' | 'ASSEMBLING' | 'LAB_ACTIVE';

type LabMission =
  | 'IDLE'
  | 'REPAIR'
  | 'TEST'
  | 'BOTTLENECK'
  | 'OPTIMIZE'
  | 'UPGRADE'
  | 'COMPATIBILITY'
  | 'LEARN'
  | 'DOSSIER';

export const EvoLabCore: React.FC<EvoLabCoreProps> = ({
  onNavigateToTomo,
  onOpenGlobalAutoDetectModal,
  onExitToWorld,
  initialPhase,
  initialMission,
}) => {
  const { isElite } = useLabAestheticMode();

  // Phase state: strictly starts at SELECT_PC ("¿QUÉ PC QUERÉS EVALUAR?") unless specified
  const [corePhase, setCorePhase] = useState<CorePhase>(initialPhase || 'SELECT_PC');
  const [activeMission, setActiveMission] = useState<LabMission>(initialMission || 'IDLE');

  useEffect(() => {
    if (initialPhase) setCorePhase(initialPhase);
  }, [initialPhase]);

  useEffect(() => {
    if (initialMission) setActiveMission(initialMission);
  }, [initialMission]);

  // Active Machine Entity
  const [activeMachine, setActiveMachine] = useState<Machine>(() => MachineAdapter.createBlankMachine());

  // Lab Bench Baseline State
  const [baselineSnapshot, setBaselineSnapshot] = useState<BaselineSnapshot | null>(null);
  const [isRunningBaseline, setIsRunningBaseline] = useState(false);
  const [showBusDiagram, setShowBusDiagram] = useState(false);

  // Modals state
  const [showMachineSelectorModal, setShowMachineSelectorModal] = useState<boolean>(false);
  const [showCompleteUnknownModal, setShowCompleteUnknownModal] = useState<boolean>(false);
  const [showCaseHistoryModal, setShowCaseHistoryModal] = useState<boolean>(false);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState<boolean>(false);
  const [showCoverageDashboard, setShowCoverageDashboard] = useState<boolean>(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState<boolean>(false);
  const [isScanningIntegrity, setIsScanningIntegrity] = useState<boolean>(false);
  const [liveScanResult, setLiveScanResult] = useState<LiveScanIntegrityResult | null>(null);
  const [caseHistory, setCaseHistory] = useState<EvoCase[]>([]);

  /**
   * Compares detected hardware from '/api/telemetry/live-scan' against
   * the allowed components list, marking discrepancies with 'UNKNOWN'
   * to guarantee the integrity of the active machine.
   */
  const compareLiveScanAgainstAllowedComponents = async () => {
    setIsScanningIntegrity(true);
    setShowIntegrityModal(true);
    try {
      const result = await TelemetryIntegrityService.scanAndValidateLiveEndpoint();
      setLiveScanResult(result);
    } catch (err) {
      console.error('[EvoLabCore] Error comparing telemetry against allowed components:', err);
    } finally {
      setIsScanningIntegrity(false);
    }
  };

  const handleApplyIntegrityMachine = () => {
    if (liveScanResult && liveScanResult.machine) {
      handleUpdateMachine(liveScanResult.machine);
      setShowIntegrityModal(false);
      setCorePhase('BUILD_PC');
    }
  };

  useEffect(() => {
    // Listen to global hardware detected events
    const handleHardwareUpdated = () => {
      const refreshed = MachineAdapter.loadExistingMachine();
      setActiveMachine(refreshed);
    };

    window.addEventListener('evo_hardware_updated', handleHardwareUpdated);
    return () => window.removeEventListener('evo_hardware_updated', handleHardwareUpdated);
  }, []);

  const handleOpenCaseHistory = () => {
    setCaseHistory(EvoCaseRepository.getAllCases());
    setShowCaseHistoryModal(true);
  };

  const handleUpdateMachine = (updated: Machine) => {
    setActiveMachine(updated);
    EvoCaseRepository.setActiveMachine(updated);

    // Save in multiple saved machines list
    try {
      const raw = localStorage.getItem('evo_lab_core_saved_machines_v1');
      const list: Machine[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((m) => m.id === updated.id);
      if (idx >= 0) {
        list[idx] = updated;
      } else {
        list.unshift(updated);
      }
      localStorage.setItem('evo_lab_core_saved_machines_v1', JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to save to machine list:', err);
    }
  };

  // Run Baseline Snapshot on bench ignition
  const handleRunBaseline = () => {
    setIsRunningBaseline(true);
    setTimeout(() => {
      const snap = BaselineEngine.captureBaseline(activeMachine);
      setBaselineSnapshot(snap);
      setIsRunningBaseline(false);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-[#f4f4f6] font-mono-tech select-none pb-24">
      {/* Top Studio Control Bar */}
      <div
        className="w-full border-b border-zinc-800/80 sticky top-18 z-40"
        style={{
          background: 'rgba(11, 14, 20, 0.94)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo & Facility Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-cyan-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)] shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base text-white uppercase tracking-tight">
                  EVO LABS // DIGITAL COMPUTER LAB
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CORE V1
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">
                Laboratorio pericial de arquitectura, diagnóstico, telemetría y pruebas de carga.
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">

            {/* PERMANENT "CAMBIAR PC" BUTTON */}
            {corePhase !== 'SELECT_PC' && (
              <button
                type="button"
                onClick={() => setCorePhase('SELECT_PC')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 hover:border-amber-400 text-xs font-black text-amber-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                title="Volver a la selección de PC"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CAMBIAR PC</span>
              </button>
            )}

            {/* Active Machine Pill (when in lab active) */}
            {corePhase === 'LAB_ACTIVE' && (
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[150px] sm:max-w-[200px] truncate text-white">
                  {activeMachine.alias}
                </span>
              </div>
            )}

            {/* Case History Dossier Button */}
            <button
              type="button"
              onClick={handleOpenCaseHistory}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ver expedientes y casos de diagnóstico guardados"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPEDIENTES</span>
            </button>

            {/* Telemetry Live-Scan Integrity Audit Button */}
            <button
              type="button"
              onClick={compareLiveScanAgainstAllowedComponents}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Comparar /api/telemetry/live-scan contra componentes permitidos (discrepancias marcadas como UNKNOWN)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AUDITAR SILICIO LIVE</span>
            </button>

            {/* Master Hardware Ingestion & Coverage Dashboard Button */}
            <button
              type="button"
              onClick={() => setShowCoverageDashboard(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-purple-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ver estado de ingesta de fabricantes oficiales y cobertura de catálogo"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              <span>FUENTES TIER 1</span>
            </button>

            {/* Hardware Discovery Engine Button */}
            <button
              type="button"
              onClick={() => setShowDiscoveryModal(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Investigar e indexar componentes reales en el catálogo EVO"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>DISCOVERY ENGINE</span>
            </button>

            {/* Exit to World / Map */}
            {onExitToWorld && (
              <button
                type="button"
                onClick={onExitToWorld}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
              >
                SALIR AL MAPA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA BY CORE PHASE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* ================================================================== */}
        {/* PHASE 1: SELECT_PC ("¿QUÉ PC QUERÉS EVALUAR?")                      */}
        {/* ================================================================== */}
        {corePhase === 'SELECT_PC' && (
          <EvoMachineIntakeScreen
            onImportThisPc={(detected) => {
              handleUpdateMachine(detected);
              setCorePhase('BUILD_PC');
            }}
            onCreateNewPc={() => {
              const fresh = MachineAdapter.createBlankMachine('PC en Construcción');
              handleUpdateMachine(fresh);
              setCorePhase('BUILD_PC');
            }}
            onSelectSavedMachine={(selected) => {
              handleUpdateMachine(selected);
              setCorePhase('BUILD_PC');
            }}
          />
        )}

        {/* ================================================================== */}
        {/* PHASE 2: BUILD_PC (CONSTRUCTOR UNIVERSAL DE PC)                    */}
        {/* ================================================================== */}
        {corePhase === 'BUILD_PC' && (
          <EvoUniversalPcBuilder
            initialMachine={activeMachine}
            onConfirmAndAssemble={(configured) => {
              handleUpdateMachine(configured);
              setCorePhase('ASSEMBLING');
            }}
            onCancelToSelectPc={() => setCorePhase('SELECT_PC')}
          />
        )}

        {/* ================================================================== */}
        {/* PHASE 3: ASSEMBLING (VIRTUAL ASSEMBLY ANIMATION)                    */}
        {/* ================================================================== */}
        {corePhase === 'ASSEMBLING' && (
          <EvoVirtualAssemblyAnimation
            machine={activeMachine}
            onComplete={() => {
              setCorePhase('LAB_ACTIVE');
              handleRunBaseline();
            }}
          />
        )}

        {/* ================================================================== */}
        {/* PHASE 4: LAB_ACTIVE (EVO LAB BENCH & MISSIONS)                      */}
        {/* ================================================================== */}
        {corePhase === 'LAB_ACTIVE' && (
          <>
            {activeMission === 'IDLE' ? (
              /* LAB BENCH WORKSTATION OVERVIEW */
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* ACTIVE MACHINE STATION CARD */}
                <div
                  className={`p-6 rounded-3xl transition-all duration-300 relative overflow-hidden ${
                    isElite
                      ? 'bg-gradient-to-br from-[#0c1017] via-[#080b11] to-[#06080d] border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]'
                      : 'bg-[#0d1017] border border-zinc-800 shadow-xl'
                  } space-y-4`}
                >
                  {/* Subtle Blueprint Grid Accent in Elite Mode */}
                  {isElite && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-5 -z-0"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #00e5ff 1px, transparent 1px), linear-gradient(to bottom, #00e5ff 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                        <span
                          className={`text-[10px] font-black uppercase tracking-[0.18em] font-mono ${
                            isElite ? 'text-cyan-400' : 'text-emerald-400'
                          }`}
                        >
                          {isElite
                            ? 'ESTACIÓN DE PRUEBAS DE SILICIO // REGISTRO NT ACTIVO'
                            : 'ESTACIÓN DE PRUEBAS ACTIVA // SILICIO IDENTIFICADO'}
                        </span>
                        {isElite && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                            0x7FFE0030
                          </span>
                        )}
                      </div>
                      <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                        {activeMachine.alias}
                      </h2>
                      <p className="text-xs text-zinc-400 font-sans-editorial">
                        La computadora ha superado el ensamblado determinista y se encuentra en el banco de pruebas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setCorePhase('BUILD_PC')}
                        className="px-3.5 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>MODIFICAR HARDWARE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCorePhase('SELECT_PC')}
                        className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>CAMBIAR DE PC</span>
                      </button>
                    </div>
                  </div>

                  {/* Hardware Quick Summary Chips with Lettercraft */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs font-mono relative z-10">
                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        isElite
                          ? 'bg-[#06080d]/80 border border-cyan-500/20 hover:border-cyan-500/40'
                          : 'bg-black/40 border border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-wider mb-1">
                        <span>CPU_REGISTER</span>
                        {isElite && <span className="text-cyan-500/60">x86_64</span>}
                      </div>
                      <span className="text-white font-bold truncate block" title={activeMachine.cpu.model}>
                        {activeMachine.cpu.model}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        isElite
                          ? 'bg-[#06080d]/80 border border-amber-500/20 hover:border-amber-500/40'
                          : 'bg-black/40 border border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-wider mb-1">
                        <span>GPU_VRAM</span>
                        {isElite && <span className="text-amber-500/60">PCIe_4.0</span>}
                      </div>
                      <span className="text-white font-bold truncate block" title={activeMachine.gpu.model}>
                        {activeMachine.gpu.model}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        isElite
                          ? 'bg-[#06080d]/80 border border-emerald-500/20 hover:border-emerald-500/40'
                          : 'bg-black/40 border border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-wider mb-1">
                        <span>DRAM_PHYSICAL</span>
                        {isElite && <span className="text-emerald-500/60">DIMM_REAL</span>}
                      </div>
                      <span className="text-white font-bold">
                        {activeMachine.ram.sizeGb}GB {activeMachine.ram.type}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        isElite
                          ? 'bg-[#06080d]/80 border border-purple-500/20 hover:border-purple-500/40'
                          : 'bg-black/40 border border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 uppercase tracking-wider mb-1">
                        <span>MOTHERBOARD_VRM</span>
                        {isElite && <span className="text-purple-500/60">ACPI_DSDT</span>}
                      </div>
                      <span className="text-white font-bold truncate block" title={activeMachine.motherboard.model}>
                        {activeMachine.motherboard.model}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BASELINE STATUS & BUS DIAGRAM TOGGLE */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-display font-black text-sm text-white uppercase tracking-wider">
                      LÍNEA BASE DE TELEMETRÍA (BASELINE ESTABLECIDO)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBusDiagram(!showBusDiagram)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      {showBusDiagram ? 'OCULTAR MAPA DE BUSES' : 'VER MAPA DE BUSES Y CARRILES'}
                    </button>

                    <button
                      type="button"
                      onClick={handleRunBaseline}
                      disabled={isRunningBaseline}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                    >
                      {isRunningBaseline ? 'MIDIELEMETRÍA...' : 'RE-CAPTURAR BASELINE'}
                    </button>
                  </div>
                </div>

                {/* BUS DIAGRAM (OPTIONAL EXPANDABLE) */}
                {showBusDiagram && <EvoLiveMachineBusDiagram machine={activeMachine} />}

                {/* OPERATIONAL LAB MISSIONS */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-[0.16em] font-mono">
                        HERRAMIENTAS OPERATIVAS // BANCO DE TRABAJO
                      </span>
                      {isElite && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                          6 PROTOCOLOS
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                      SELECCIONÁ LA MISIÓN PERICIAL
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* MISSION 1: REPARACIÓN */}
                    <div
                      onClick={() => setActiveMission('REPAIR')}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-md ${
                        isElite
                          ? 'border-red-500/30 bg-gradient-to-br from-[#12080a] via-[#0d0708] to-[#080506] hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                          : 'border-red-500/30 bg-red-950/10 hover:bg-red-950/20 hover:border-red-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                            <Wrench className="w-5 h-5" />
                          </div>
                          {isElite && (
                            <span className="text-[9px] font-mono text-red-400/80 px-1.5 py-0.5 rounded bg-red-950/50 border border-red-500/30">
                              OP_0x01_DIAG
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-black text-base text-white uppercase group-hover:text-red-300 transition-colors">
                          DIAGNÓSTICO & REPARACIÓN
                        </h4>
                        <p className="text-xs text-zinc-400 font-sans-editorial leading-tight">
                          Árbol de fallas, hipótesis periciales, aislamiento de causas raíz y comprobación sin adivinanzas.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-red-400 pt-2 border-t border-red-500/20">
                        <span>ABRIR TALLER DE REPARACIÓN</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* MISSION 2: TEST & BENCHMARK */}
                    <div
                      onClick={() => setActiveMission('TEST')}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-md ${
                        isElite
                          ? 'border-cyan-500/30 bg-gradient-to-br from-[#061016] via-[#050c12] to-[#04080d] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                          : 'border-cyan-500/30 bg-cyan-950/10 hover:bg-cyan-950/20 hover:border-cyan-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                            <Activity className="w-5 h-5" />
                          </div>
                          {isElite && (
                            <span className="text-[9px] font-mono text-cyan-400/80 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30">
                              OP_0x02_STRESS
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-black text-base text-white uppercase group-hover:text-cyan-300 transition-colors">
                          ENSAYOS DE CARGA & BENCHMARK
                        </h4>
                        <p className="text-xs text-zinc-400 font-sans-editorial leading-tight">
                          Someter la máquina a cargas sintéticas y reales (gaming, renderizado, multitarea pesada).
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-cyan-400 pt-2 border-t border-cyan-500/20">
                        <span>INICIAR ENSAYOS DE RENDIMIENTO</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* MISSION 3: BOTTLENECKS */}
                    <div
                      onClick={() => setActiveMission('BOTTLENECK')}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-md ${
                        isElite
                          ? 'border-amber-500/30 bg-gradient-to-br from-[#141006] via-[#0f0c05] to-[#090703] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                          : 'border-amber-500/30 bg-amber-950/10 hover:bg-amber-950/20 hover:border-amber-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          {isElite && (
                            <span className="text-[9px] font-mono text-amber-400/80 px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-500/30">
                              OP_0x03_THROUGHPUT
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-black text-base text-white uppercase group-hover:text-amber-300 transition-colors">
                          CUELLOS DE BOTELLA
                        </h4>
                        <p className="text-xs text-zinc-400 font-sans-editorial leading-tight">
                          Identificar el subsistema que estrangula el rendimiento en 1080p, 1440p o 4K.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-amber-400 pt-2 border-t border-amber-500/20">
                        <span>ANALIZAR CUELLOS DE BOTELLA</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* MISSION 4: OPTIMIZACIÓN */}
                    <div
                      onClick={() => setActiveMission('OPTIMIZE')}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-md ${
                        isElite
                          ? 'border-emerald-500/30 bg-gradient-to-br from-[#06140d] via-[#050f0a] to-[#030a07] hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                          : 'border-emerald-500/30 bg-emerald-950/10 hover:bg-emerald-950/20 hover:border-emerald-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                            <Zap className="w-5 h-5" />
                          </div>
                          {isElite && (
                            <span className="text-[9px] font-mono text-emerald-400/80 px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30">
                              OP_0x04_KERNEL_TUNE
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-black text-base text-white uppercase group-hover:text-emerald-300 transition-colors">
                          OPTIMIZACIÓN TÉCNICA
                        </h4>
                        <p className="text-xs text-zinc-400 font-sans-editorial leading-tight">
                          Curvas de ventiladores, perfiles XMP/EXPO, ajustes de latencia y estado de servicios.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-emerald-500/20">
                        <span>ENTRAR A OPTIMIZACIÓN</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* MISSION 5: UPGRADE */}
                    <div
                      onClick={() => setActiveMission('UPGRADE')}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-md ${
                        isElite
                          ? 'border-purple-500/30 bg-gradient-to-br from-[#120817] via-[#0e0612] to-[#08040a] hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                          : 'border-purple-500/30 bg-purple-950/10 hover:bg-purple-950/20 hover:border-purple-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                            <Layers className="w-5 h-5" />
                          </div>
                          {isElite && (
                            <span className="text-[9px] font-mono text-purple-400/80 px-1.5 py-0.5 rounded bg-purple-950/50 border border-purple-500/30">
                              OP_0x05_TOPOLOGY
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-black text-base text-white uppercase group-hover:text-purple-300 transition-colors">
                          PLANIFICAR UPGRADE
                        </h4>
                        <p className="text-xs text-zinc-400 font-sans-editorial leading-tight">
                          Ruta costo-efectiva de actualización de silicio sin desperdiciar presupuesto.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-purple-500/20">
                        <span>PLANIFICAR ACTUALIZACIÓN</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* MISSION 6: ARQUITECTURA / TOMOS */}
                    <div
                      onClick={() => {
                        if (onNavigateToTomo) onNavigateToTomo('01');
                      }}
                      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group shadow-md ${
                        isElite
                          ? 'border-blue-500/30 bg-gradient-to-br from-[#080d19] via-[#060a13] to-[#04060d] hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                          : 'border-blue-500/30 bg-blue-950/10 hover:bg-blue-950/20 hover:border-blue-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                            <Cpu className="w-5 h-5" />
                          </div>
                          {isElite && (
                            <span className="text-[9px] font-mono text-blue-400/80 px-1.5 py-0.5 rounded bg-blue-950/50 border border-blue-500/30">
                              OP_0x06_DEEP_SPEC
                            </span>
                          )}
                        </div>
                        <h4 className="font-display font-black text-base text-white uppercase group-hover:text-blue-300 transition-colors">
                          TOMOS DE ARQUITECTURA
                        </h4>
                        <p className="text-xs text-zinc-400 font-sans-editorial leading-tight">
                          Consultar fundamentos de buses PCIe, latencias DDR y física térmica en los tomos de EVO LABS.
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-blue-400 pt-2 border-t border-blue-500/20">
                        <span>CONSULTAR TOMOS TÉCNICOS</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeMission === 'REPAIR' ? (
              <EvoLabCoreRepairView
                machine={activeMachine}
                onNavigateHome={() => setActiveMission('IDLE')}
                onNavigateToTomo={onNavigateToTomo}
                onChangeMachineRequested={() => setCorePhase('SELECT_PC')}
              />
            ) : activeMission === 'TEST' ? (
              <EvoLabCoreTestView
                machine={activeMachine}
                onNavigateHome={() => setActiveMission('IDLE')}
                onNavigateToTomo={onNavigateToTomo}
                onChangeMachineRequested={() => setCorePhase('SELECT_PC')}
              />
            ) : activeMission === 'BOTTLENECK' ? (
              <EvoLabCoreBottleneckView
                machine={activeMachine}
                onNavigateHome={() => setActiveMission('IDLE')}
                onNavigateToTomo={onNavigateToTomo}
                onChangeMachineRequested={() => setCorePhase('SELECT_PC')}
              />
            ) : activeMission === 'OPTIMIZE' ? (
              <EvoLabCoreOptimizationView
                machine={activeMachine}
                onNavigateHome={() => setActiveMission('IDLE')}
                onNavigateToTomo={onNavigateToTomo}
                onChangeMachineRequested={() => setCorePhase('SELECT_PC')}
              />
            ) : (
              <EvoLabCoreUpgradeView
                machine={activeMachine}
                onNavigateHome={() => setActiveMission('IDLE')}
                onNavigateToTomo={onNavigateToTomo}
                onChangeMachineRequested={() => setCorePhase('SELECT_PC')}
              />
            )}
          </>
        )}
      </div>

      {/* Machine Selector Modal */}
      <EvoMachineSelectorModal
        isOpen={showMachineSelectorModal}
        onClose={() => setShowMachineSelectorModal(false)}
        onSelectMachine={(m) => {
          handleUpdateMachine(m);
          setCorePhase('BUILD_PC');
        }}
        onOpenGlobalAutoDetectModal={onOpenGlobalAutoDetectModal}
      />

      {/* Complete Unknown Modal */}
      <EvoCompleteUnknownModal
        isOpen={showCompleteUnknownModal}
        onClose={() => setShowCompleteUnknownModal(false)}
        machine={activeMachine}
        onSaveMachine={(m) => handleUpdateMachine(m)}
      />

      {/* Hardware Discovery Modal */}
      <EvoHardwareDiscoveryModal
        isOpen={showDiscoveryModal}
        onClose={() => setShowDiscoveryModal(false)}
        onComponentIncorporated={(comp) => {
          const item = HardwareCatalogProvider.toBuildItem(comp);
          const updated: Machine = { ...activeMachine };
          if (item.subsystem === 'motherboard') {
            updated.motherboard.model = item.model;
          } else if (item.subsystem === 'cpu') {
            updated.cpu.model = item.model;
          } else if (item.subsystem === 'gpu') {
            updated.gpu.model = item.model;
          }
          handleUpdateMachine(updated);
        }}
      />

      {/* Catalog Coverage & Ingestion Dashboard Modal */}
      <CatalogCoverageDashboard
        isOpen={showCoverageDashboard}
        onClose={() => setShowCoverageDashboard(false)}
      />

      {/* Telemetry Live-Scan Integrity Audit Modal */}
      <EvoTelemetryIntegrityModal
        isOpen={showIntegrityModal}
        onClose={() => setShowIntegrityModal(false)}
        integrityResult={liveScanResult}
        isLoading={isScanningIntegrity}
        onReScan={compareLiveScanAgainstAllowedComponents}
        onApplyMachine={handleApplyIntegrityMachine}
      />

      {/* Case History Dossier Modal */}
      {showCaseHistoryModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-zinc-700 bg-[#0e1219] shadow-2xl flex flex-col font-mono-tech overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#080a0d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base uppercase">
                  EXPEDIENTES Y CASOS REGISTRADOS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCaseHistoryModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {caseHistory.length === 0 ? (
                <div className="text-center p-8 text-zinc-500">
                  Aún no se han completado expedientes en esta sesión.
                </div>
              ) : (
                caseHistory.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-zinc-800 bg-[#121620] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{c.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs font-sans-editorial">{c.summary}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
