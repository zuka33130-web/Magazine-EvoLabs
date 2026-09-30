import React, { useState } from 'react';
import { EvoLabZone, EvoNarrativeProfile, UserHardwarePassport } from '../../types';
import { EVO_NARRATIVE_PROFILES } from '../../data/evoWorldData';
import {
  X,
  BookOpen,
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Play,
  RotateCcw,
  Copy,
  Download,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Search,
  Check,
  FileCode,
  Lock,
  Unlock,
  Award,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

interface EvoSectorWorkstationModalProps {
  zone: EvoLabZone | null;
  passport: UserHardwarePassport | null;
  onClose: () => void;
  onOpenTomo: (tomoId: '01' | '02' | '03' | '04' | '08') => void;
  onOpenConsoleZone?: (zoneId: string) => void;
  activeProfile: EvoNarrativeProfile;
  onChangeProfile: (profile: EvoNarrativeProfile) => void;
}

export const EvoSectorWorkstationModal: React.FC<EvoSectorWorkstationModalProps> = ({
  zone,
  passport,
  onClose,
  onOpenTomo,
  onOpenConsoleZone,
  activeProfile,
  onChangeProfile,
}) => {
  if (!zone) return null;

  // Sector 1: Crash Incident Triage State
  const [selectedIncident, setSelectedIncident] = useState<
    'bsod_dpc' | 'whea_vcore' | 'memory_corruption' | 'thermal_cutoff'
  >('bsod_dpc');

  // Sector 2: Frametime Pacing Simulator State
  const [frametimeScenario, setFrametimeScenario] = useState<'smooth' | 'stuttery'>('smooth');
  const [simulationRunning, setSimulationRunning] = useState<boolean>(true);

  // Sector 4: A/B Hypothesis Testing Sandbox State
  const [abExperiment, setAbExperiment] = useState<'xmp' | 'undervolt' | 'power_plan'>('xmp');
  const [abRunning, setAbRunning] = useState<boolean>(false);
  const [abResult, setAbResult] = useState<boolean>(true);

  // Sector 5: PowerShell Script Lab State
  const [selectedScriptId, setSelectedScriptId] = useState<'passport' | 'dpc_trace' | 'clean_boot' | 'dism_repair'>(
    'passport'
  );
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Sector 6: Forensic Challenge Mystery State
  const [mysteryStep, setMysteryStep] = useState<number>(1);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [mysteryResolved, setMysteryResolved] = useState<boolean>(false);

  // Sector 7: Machine Hangar State
  const [activeMachineTab, setActiveMachineTab] = useState<'main' | 'laptop' | 'bench'>('main');

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Download helper
  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 select-none font-mono-tech">
      <div className="relative w-full max-w-5xl bg-[#0a0c13] border-2 border-zinc-700/80 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#111420] border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-amber-400/20 border border-amber-400/50 text-amber-400 text-xs font-bold uppercase tracking-wider">
              SECTOR {zone.number} // {zone.title.toUpperCase()}
            </span>
            <span className="hidden sm:inline text-zinc-500">//</span>
            <span className="text-zinc-400 text-xs hidden sm:inline">
              "{zone.keyPhrase}"
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ========================================================================= */}
          {/* SECTOR 01: CENTRAL DE INCIDENTES (FORENSIC BSOD & EVENT LOG TRIAGE)       */}
          {/* ========================================================================= */}
          {zone.id === 'zona-1' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-red-950/20 border border-red-900/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      CENTRO DE TRIAGE DE ACCIDENTES & MINIDUMPS
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Seleccioná un incidente crítico reportado para inspeccionar el volcado de memoria (Kernel Stack) y obtener la resolución científica.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-1 rounded font-bold uppercase">
                  SIMULADOR FORENSE ACTIVO
                </span>
              </div>

              {/* Incident Selector Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'bsod_dpc',
                    label: 'DPC_WATCHDOG_VIOLATION',
                    driver: 'nvlddmkm.sys',
                    code: '0x00000133',
                  },
                  {
                    id: 'whea_vcore',
                    label: 'WHEA_UNCORRECTABLE_ERROR',
                    driver: 'GenuineIntel / AMD',
                    code: '0x00000124',
                  },
                  {
                    id: 'memory_corruption',
                    label: 'MEMORY_MANAGEMENT',
                    driver: 'ntoskrnl.exe',
                    code: '0x0000001A',
                  },
                  {
                    id: 'thermal_cutoff',
                    label: 'APAGADO SÚBITO (PROCHOT)',
                    driver: 'Hardware Sensor',
                    code: 'THERMAL_CUTOFF',
                  },
                ].map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedIncident === inc.id
                        ? 'bg-zinc-900 border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[10px] text-amber-400 font-bold block">{inc.code}</span>
                    <span className="text-xs font-bold text-white block truncate">{inc.label}</span>
                    <span className="text-[10px] text-zinc-500">{inc.driver}</span>
                  </button>
                ))}
              </div>

              {/* Forensic Minidump Breakdown */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>VOLCADO DE MEMORIA ANALIZADO // WinDbg Kernel Output</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">RING 0 PRIVILEGED CONTEXT</span>
                </div>

                {selectedIncident === 'bsod_dpc' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-black/80 font-mono-tech text-xs text-emerald-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                      <p className="text-zinc-500"># WinDbg !analyze -v</p>
                      <p className="text-red-400 font-bold">FAULTING_IP: nvlddmkm+14b2a8</p>
                      <p>FAILURE_BUCKET_ID: DPC_WATCHDOG_VIOLATION_nvlddmkm!unknown_function</p>
                      <p className="text-zinc-400">DPC routine exceeded allowed 100μs execution slice (5400μs total hang).</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-amber-400 font-bold block mb-1">DIAGNÓSTICO CAUSAL:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          El controlador gráfico retuvo la interrupción diferida (DPC) más tiempo del permitido por el planificador de Windows. No es una rotura de la GPU, es corrupción del estado del driver tras una actualización sucia.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-emerald-400 font-bold block mb-1">PROTOCOLO DE REPARACIÓN:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          1. Desinstalación limpia en Modo Seguro con DDU (Display Driver Uninstaller).<br />
                          2. Reinstalación del driver oficial seleccionando instalación personalizada limpia.<br />
                          3. Desactivar MPO (Multiplane Overlay) si persiste en Windows 11.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedIncident === 'whea_vcore' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-black/80 font-mono-tech text-xs text-amber-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                      <p className="text-zinc-500"># WinDbg !analyze -v</p>
                      <p className="text-red-400 font-bold">WHEA_ERROR_RECORD: Machine Check Exception (MCE)</p>
                      <p>Error Source: 1 (Machine Check Exception) // APIC ID: 04</p>
                      <p className="text-zinc-400">Internal Parity Error on L2/L3 Cache due to Transient Undervoltage.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-amber-400 font-bold block mb-1">DIAGNÓSTICO CAUSAL:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          Caída de voltaje momentánea (Vdroop) en la curva de frecuencias del procesador o degradación de perfil de voltaje en la BIOS.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-emerald-400 font-bold block mb-1">PROTOCOLO DE REPARACIÓN:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          1. Actualizar el microcódigo/BIOS de la placa madre.<br />
                          2. Ajustar Load-Line Calibration (LLC) a nivel medio para compensar Vdroop.<br />
                          3. Si hay curva PBO/Undervolt activa, reducir el offset negativo en 5 puntos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedIncident === 'memory_corruption' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-black/80 font-mono-tech text-xs text-cyan-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                      <p className="text-zinc-500"># WinDbg !analyze -v</p>
                      <p className="text-red-400 font-bold">BUGCHECK_P1: 0x41792 (Page Table Corruption)</p>
                      <p>Corrupted Page Frame Number (PFN) in Physical RAM.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-amber-400 font-bold block mb-1">DIAGNÓSTICO CAUSAL:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          Inestabilidad en el perfil XMP/EXPO o voltaje VDD/VDDQ insuficiente para la velocidad de la memoria RAM.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-emerald-400 font-bold block mb-1">PROTOCOLO DE REPARACIÓN:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          1. Ejecutar MemTest86 o TestMem5 (Anta777 profile) durante 3 pasadas.<br />
                          2. Verificar que los módulos estén instalados en los slots A2 y B2.<br />
                          3. Subir el voltaje VDD en 0.02V o bajar un escalón la frecuencia (ej. 6000 a 5600 MT/s).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedIncident === 'thermal_cutoff' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-black/80 font-mono-tech text-xs text-orange-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                      <p className="text-zinc-500"># Hardware Sensor Log</p>
                      <p className="text-red-400 font-bold">CRITICAL_EVENT: TjMax 105°C reached on Package</p>
                      <p className="text-zinc-400">PROCHOT signal asserted &rarr; Emergency Hardware Shutdown to prevent silicon melting.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-amber-400 font-bold block mb-1">DIAGNÓSTICO CAUSAL:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          Bomba de refrigeración líquida detenida, plástico protector no retirado del bloque del cooler o desecación completa de la pasta térmica.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-emerald-400 font-bold block mb-1">PROTOCOLO DE REPARACIÓN:</span>
                        <p className="text-zinc-300 font-sans-editorial text-[12.5px] leading-relaxed">
                          1. Tocar las mangueras del AIO para verificar vibración de flujo líquido.<br />
                          2. Desmontar el disipador, limpiar con alcohol isopropílico al 99% y aplicar pasta de alta viscosidad (ej. PTM7950 o Arctic MX-6).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 02: TALLER DE RENDIMIENTO (LIVE FRAMETIME PACING & 1% LOWS)        */}
          {/* ========================================================================= */}
          {zone.id === 'zona-2' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      SIMULADOR DE CONSISTENCIA DE FRAMETIME (1% LOW)
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Los FPS promedio son una mentira cuando el frametime es irregular. Comprobá el impacto visual del micro-stuttering en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFrametimeScenario('smooth')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      frametimeScenario === 'smooth'
                        ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    60 FPS FLUIDO (16.6ms)
                  </button>
                  <button
                    onClick={() => setFrametimeScenario('stuttery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      frametimeScenario === 'stuttery'
                        ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    120 FPS CON PICOS (STUTTER)
                  </button>
                </div>
              </div>

              {/* Dynamic Oscilloscope Graph */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-bold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    TRAZO OSCILOSCÓPICO DE FRAMETIMES (TIEMPO DE CUADRO EN MS)
                  </span>
                  <span
                    className={`font-bold ${
                      frametimeScenario === 'smooth' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {frametimeScenario === 'smooth'
                      ? 'PAZ METROLÓGICA: VARIANZA < 0.8ms'
                      : 'STUTTER DETECTADO: PICOS DE 48.2ms'}
                  </span>
                </div>

                {/* Visual Frametime Bars */}
                <div className="h-32 w-full bg-black/80 rounded-lg border border-zinc-800/80 p-3 flex items-end gap-1 overflow-hidden relative">
                  {/* Target 16.6ms line */}
                  <div className="absolute top-[50%] left-0 right-0 border-b border-dashed border-cyan-500/40 z-10 pointer-events-none flex justify-end pr-2 text-[9px] text-cyan-400 font-mono-tech">
                    OBJETIVO 60Hz: 16.6 ms
                  </div>

                  {Array.from({ length: 48 }).map((_, i) => {
                    let height = '50%';
                    let color = 'bg-cyan-400';

                    if (frametimeScenario === 'smooth') {
                      const jitter = Math.sin(i * 0.8) * 4;
                      height = `${50 + jitter}%`;
                      color = 'bg-cyan-400';
                    } else {
                      if (i % 7 === 0) {
                        height = '95%';
                        color = 'bg-rose-500';
                      } else if (i % 4 === 0) {
                        height = '25%';
                        color = 'bg-amber-400';
                      } else {
                        height = '35%';
                        color = 'bg-emerald-400';
                      }
                    }

                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-xs transition-all duration-300 ${color}`}
                        style={{ height }}
                      />
                    );
                  })}
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">FPS PROMEDIO</span>
                    <span className="text-lg font-bold text-white">
                      {frametimeScenario === 'smooth' ? '60.0 FPS' : '118.4 FPS'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">1% LOW (PISO REAL)</span>
                    <span
                      className={`text-lg font-bold ${
                        frametimeScenario === 'smooth' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {frametimeScenario === 'smooth' ? '58.5 FPS' : '21.0 FPS'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">LATENCIA MÁXIMA</span>
                    <span
                      className={`text-lg font-bold ${
                        frametimeScenario === 'smooth' ? 'text-cyan-400' : 'text-rose-400'
                      }`}
                    >
                      {frametimeScenario === 'smooth' ? '17.2 ms' : '47.6 ms'}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">EXPERIENCIA VISUAL</span>
                    <span
                      className={`text-sm font-bold ${
                        frametimeScenario === 'smooth' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {frametimeScenario === 'smooth' ? 'SEDOSA / PERFECTA' : 'TIRONES BRUSCOS'}
                    </span>
                  </div>
                </div>

                {/* Direct Launcher to Sector 02 Full Hot-Swap Suite */}
                {onOpenConsoleZone && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono-tech">
                        <Zap className="w-4 h-4" />
                        <span>SUITE COMPLETA SECTOR 02 // HOT-SWAP HARDWARE & SOFTWARE</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 font-sans-editorial">
                        Accedé al simulador de latencia absoluta en nanosegundos (ns), topología de carriles PCIe y auditoría DPC de drivers en Ring 0.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenConsoleZone('zona-2')}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold font-mono-tech text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.35)] shrink-0 transition-all"
                    >
                      <span>ABRIR TALLER COMPLETO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 03: ARCHIVO EVO (GATEWAY A LOS TOMOS EDITORIALES)                  */}
          {/* ========================================================================= */}
          {zone.id === 'zona-3' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      BIBLIOTECA EDITORIAL & EXPEDIENTES CLASIFICADOS
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans-editorial">
                      Accedé a los Tomos oficiales de ingeniería de EVO LABS con instrumental y telemetría interactiva.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tomo 01 */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-amber-400/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-400">TOMO 01 // 46 PÁGINAS A4</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        PUBLICADO
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      CONOCÉ TU PC // ARQUITECTURA & DIAGNÓSTICO
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans-editorial mt-1 leading-relaxed">
                      El manual fundamental: Pasaporte, Flujo de Recursos, Perfil de Fluidez, Matriz de Cuello de Botella y Taller de Diagnóstico.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTomo('01');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>ABRIR TOMO 01 (EDICIÓN OFICIAL)</span>
                  </button>
                </div>

                {/* Tomo 02 */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-cyan-500/40 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-cyan-400">TOMO 02 // 46 PÁGINAS A4</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        PUBLICADO
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      LA BIBLIA NEGRA DE WINDOWS
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans-editorial mt-1 leading-relaxed">
                      Telemetría oculta, latencia DPC, servicios fantasma, kernel Ring 0 y optimizaciones con prueba de rendimiento.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTomo('02');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>ABRIR TOMO 02 (LA BIBLIA NEGRA)</span>
                  </button>
                </div>

                {/* Tomo 03 */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-500/40 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-400">TOMO 03 // 46 PÁGINAS A4</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        PUBLICADO
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      REPARÁ TU PC // GUÍA DE TALLER
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans-editorial mt-1 leading-relaxed">
                      El protocolo paso a paso para diagnosticar cualquier falla de escritorio: fuente, placa madre, BIOS corrupta y cortos.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTomo('03');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>ABRIR TOMO 03 (REPARÁ TU PC)</span>
                  </button>
                </div>

                {/* Tomo 04 */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-purple-500/40 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-purple-400">TOMO 04 // 46 PÁGINAS A4</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        PUBLICADO
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      REPARÁ TU NOTEBOOK // PORTÁTILES
                    </h4>
                    <p className="text-xs text-zinc-400 font-sans-editorial mt-1 leading-relaxed">
                      Microelectrónica, cargadores, MOSFETs de entrada, batería, bisagras y arquitectura compacta.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTomo('04');
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-purple-400 hover:bg-purple-300 text-black font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>ABRIR TOMO 04 (PORTÁTILES)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 04: CÁMARA DE EXPERIMENTOS (A/B HYPOTHESIS TESTING ENGINE)          */}
          {/* ========================================================================= */}
          {zone.id === 'zona-4' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      LABORATORIO CIENTÍFICO DE PRUEBAS A/B (1 VARIABLE)
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      El único método válido: aislar una sola variable de cambio, medir la dispersión y confirmar si el delta es estadísticamente significativo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Experiment Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'xmp',
                    label: 'HIPÓTESIS: XMP/EXPO ACTIVO VS JEDEC 4800',
                    var: 'Frecuencia de RAM & Timings',
                  },
                  {
                    id: 'undervolt',
                    label: 'HIPÓTESIS: UNDERVOLT -50mV EN CPU',
                    var: 'Curva Voltaje/Frecuencia',
                  },
                  {
                    id: 'power_plan',
                    label: 'HIPÓTESIS: PLAN MÁXIMO RENDIMIENTO VS EQUILIBRADO',
                    var: 'Estacionamiento de Núcleos (C-States)',
                  },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => {
                      setAbExperiment(exp.id as any);
                      setAbRunning(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      abExperiment === exp.id
                        ? 'bg-zinc-900 border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-[10px] text-amber-400 font-bold block">VARIABLE DE CONTROL:</span>
                    <span className="text-xs font-bold text-white block mt-0.5">{exp.label}</span>
                  </button>
                ))}
              </div>

              {/* A/B Comparison Workbench */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ESTADO A (LÍNEA DE BASE) */}
                  <div className="p-4 rounded-lg bg-zinc-900/90 border border-zinc-800">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold uppercase">
                      CONDICIÓN A // LÍNEA DE BASE
                    </span>
                    <h5 className="font-bold text-sm text-white mt-2">
                      {abExperiment === 'xmp'
                        ? 'JEDEC Stock (DDR5 4800 MT/s CL40)'
                        : abExperiment === 'undervolt'
                        ? 'Voltaje de Fábrica (Auto / Stock)'
                        : 'Plan de Energía Equilibrado de Windows'}
                    </h5>
                    <div className="mt-3 space-y-1.5 text-xs font-mono-tech text-zinc-300">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">1% Low FPS:</span>
                        <span className="font-bold text-white">
                          {abExperiment === 'xmp' ? '74.2 FPS' : abExperiment === 'undervolt' ? '82.0 FPS' : '79.5 FPS'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Temperatura Pico:</span>
                        <span className="font-bold text-rose-400">
                          {abExperiment === 'xmp' ? '68°C' : abExperiment === 'undervolt' ? '86°C' : '72°C'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Consumo Pico (Package):</span>
                        <span className="font-bold text-zinc-300">
                          {abExperiment === 'xmp' ? '125W' : abExperiment === 'undervolt' ? '185W' : '140W'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ESTADO B (MODIFICADO) */}
                  <div className="p-4 rounded-lg bg-zinc-900/90 border border-amber-400/50">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 font-bold uppercase">
                      CONDICIÓN B // VARIABLE MODIFICADA
                    </span>
                    <h5 className="font-bold text-sm text-white mt-2">
                      {abExperiment === 'xmp'
                        ? 'Perfil XMP/EXPO 1 (DDR5 6000 MT/s CL30)'
                        : abExperiment === 'undervolt'
                        ? 'Curve Optimizer -25mV Offset Estable'
                        : 'Plan Máximo Rendimiento / Ultimate'}
                    </h5>
                    <div className="mt-3 space-y-1.5 text-xs font-mono-tech text-zinc-300">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">1% Low FPS:</span>
                        <span className="font-bold text-emerald-400">
                          {abExperiment === 'xmp' ? '89.4 FPS (+20.4%)' : abExperiment === 'undervolt' ? '86.1 FPS (+5.0%)' : '79.8 FPS (+0.3%)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Temperatura Pico:</span>
                        <span className="font-bold text-emerald-400">
                          {abExperiment === 'xmp' ? '69°C (+1°C)' : abExperiment === 'undervolt' ? '74°C (-12°C)' : '78°C (+6°C)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Consumo Pico (Package):</span>
                        <span className="font-bold text-emerald-400">
                          {abExperiment === 'xmp' ? '126W' : abExperiment === 'undervolt' ? '148W (-37W)' : '155W (+15W)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistical Verdict */}
                <div className="p-3.5 rounded-lg bg-black/60 border border-zinc-800 text-xs flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-amber-400 font-bold block">VEREDICTO CIENTÍFICO EVO:</span>
                    <p className="text-zinc-300 font-sans-editorial text-[12px]">
                      {abExperiment === 'xmp'
                        ? 'Ganancia masiva confirmada en mínimos del 1% debido a la reducción de latencia de acceso en el IMC.'
                        : abExperiment === 'undervolt'
                        ? 'Éxito rotundo: mayor frecuencia sostenida por evitar estrangulamiento térmico y menor temperatura.'
                        : 'Mito desmentido: el plan de máximo rendimiento solo eleva el consumo en reposo sin ganancias reales en juegos.'}
                    </p>
                  </div>
                  <span className="shrink-0 px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-[10px] uppercase">
                    P-VALUE &lt; 0.001
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 05: SALA DE MÁQUINAS (POWERSHELL SCRIPT WORKBENCH)                  */}
          {/* ========================================================================= */}
          {zone.id === 'zona-5' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileCode className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      GENERADOR DE SCRIPTS POWERSHELL LIMPIOS (CERO SOBRECARGA)
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Scripts nativos de Windows, sin instaladores basura ni publicidad. Auditá y optimizá tu máquina de forma transparente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Script Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'passport', name: 'Pasaporte Forense', ext: 'evo_passport.ps1' },
                  { id: 'dpc_trace', name: 'Auditor DPC & Latencia', ext: 'dpc_audit.ps1' },
                  { id: 'clean_boot', name: 'Linter de Servicios', ext: 'clean_services.ps1' },
                  { id: 'dism_repair', name: 'Reparador WinSxS DISM', ext: 'dism_clean.ps1' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScriptId(s.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedScriptId === s.id
                        ? 'bg-zinc-900 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] text-emerald-400 font-bold block">{s.ext}</span>
                    <span className="text-xs font-bold block">{s.name}</span>
                  </button>
                ))}
              </div>

              {/* Live Script Viewer & Action Buttons */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs text-zinc-400 font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    CÓDIGO FUENTE TRANSPARENTE
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleCopy(
                          selectedScriptId === 'passport'
                            ? `# EVO LABS // PASAPORTE HARDWARE AUTOMATIZADO\nGet-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed\nGet-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum | ForEach-Object { [math]::Round($_.Sum / 1GB, 2) }\nGet-CimInstance Win32_VideoController | Select-Object Name, DriverVersion\nGet-CimInstance Win32_DiskDrive | Select-Object Model, Size, MediaType`
                            : `# EVO LABS // AUDITOR DE INTERRUPCIONES DPC\nGet-WmiObject Win32_PerfFormattedData_PerfOS_Processor | Select-Object Name, PercentDPCTime, PercentInterruptTime\nGet-PnpDevice -PresentOnly | Where-Object { $_.Status -ne "OK" } | Select-Object FriendlyName, Class, ProblemDescription`
                        )
                      }
                      className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'COPIADO' : 'COPIAR'}</span>
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(
                          `${selectedScriptId}.ps1`,
                          `# EVO LABS POWERSHELL DIAGNOSTIC SCRIPT\nWrite-Host "Iniciando peritaje EVO..." -ForegroundColor Yellow\nGet-CimInstance Win32_Processor | Format-List\nGet-CimInstance Win32_PhysicalMemory | Format-Table\n`
                        )
                      }
                      className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DESCARGAR .PS1</span>
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-lg bg-black/90 text-emerald-400 text-xs font-mono-tech overflow-x-auto leading-relaxed border border-zinc-800/80 max-h-56">
                  {selectedScriptId === 'passport' &&
                    `# EVO LABS // PASAPORTE HARDWARE AUTOMATIZADO\n# Ejecutar en PowerShell como Administrador\n\n$cpu = Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, MaxClockSpeed\n$ram = (Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum).Sum / 1GB\n$gpu = Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion\n\n[PSCustomObject]@{\n  "CPU" = $cpu.Name\n  "RAM_GB" = [math]::Round($ram, 2)\n  "GPU" = $gpu.Name\n  "DRIVER_VER" = $gpu.DriverVersion\n} | ConvertTo-Json -Depth 3`}

                  {selectedScriptId === 'dpc_trace' &&
                    `# EVO LABS // AUDITOR DE PICOS DPC & LATENCIA RING 0\nGet-WmiObject Win32_PerfFormattedData_PerfOS_Processor |\n  Select-Object Name, PercentDPCTime, PercentInterruptTime |\n  Format-Table -AutoSize`}

                  {selectedScriptId === 'clean_boot' &&
                    `# EVO LABS // LINTER DE SERVICIOS Y TELEMETRÍA PARÁSITA\nGet-Service | Where-Object { $_.StartType -eq "Automatic" -and $_.Status -eq "Running" } |\n  Select-Object Name, DisplayName, Status |\n  Out-GridView -Title "Servicios en Ejecución EVO Labs"`}

                  {selectedScriptId === 'dism_repair' &&
                    `# EVO LABS // REPARACIÓN DE INTEGRIDAD WINSXS DISM\nDISM.exe /Online /Cleanup-Image /AnalyzeComponentStore\nDISM.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase\nsfc /scannow`}
                </pre>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 06: ZONA RESTRINGIDA (DESAFÍO FORENSE #088)                         */}
          {/* ========================================================================= */}
          {zone.id === 'zona-6' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      EXPEDIENTE MISTERIO #088: "EL FREEZE DE LOS 42 MINUTOS"
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans-editorial">
                      Caso real de laboratorio. Una computadora de edición se congela a los 42 minutos exactos de renderizado. Encontrá al culpable.
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold uppercase">
                  NIVEL: AVANZADO
                </span>
              </div>

              {/* Detective Clue Progression Steps */}
              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-3">
                  <span className="text-amber-400 font-bold">FASE {mysteryStep} DE 3: INSPECCIÓN FORENSE</span>
                  <span className="text-zinc-500">MÉTODO DE DESCARTE EVO</span>
                </div>

                {mysteryStep === 1 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-zinc-300 font-sans-editorial leading-relaxed text-sm">
                      <strong>Paso 1:</strong> Revisás el sensor de temperatura del CPU (marca 64°C, frío) y la GPU (marca 61°C). Sin embargo, al tocar el disipador VRM superior de la placa madre, el termómetro infrarrojo salta a <strong>108°C</strong>.
                    </p>
                    <button
                      onClick={() => setMysteryStep(2)}
                      className="px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-xs uppercase cursor-pointer hover:bg-amber-300"
                    >
                      CONTINUAR AL PASO 2: INSPECCIONAR GABINETE
                    </button>
                  </div>
                )}

                {mysteryStep === 2 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-zinc-300 font-sans-editorial leading-relaxed text-sm">
                      <strong>Paso 2:</strong> Inspeccionás el gabinete. El usuario instaló refrigeración líquida frontal metiendo aire caliente al chasis y ningún ventilador superior extractor. Los MOSFETs del VRM no tienen flujo de aire directo.
                    </p>
                    <div className="space-y-2">
                      <span className="text-amber-400 font-bold block">¿CUÁL ES EL CULPABLE REAL?</span>
                      {[
                        { id: 'vrm', label: 'VRM Thermal Throttling por falta de flujo de aire en fases de poder' },
                        { id: 'ssd', label: 'El SSD NVMe se queda sin caché SLC' },
                        { id: 'gpu', label: 'VRAM de la placa de video defectuosa' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSelectedSuspect(opt.id);
                            if (opt.id === 'vrm') setMysteryResolved(true);
                          }}
                          className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            selectedSuspect === opt.id
                              ? opt.id === 'vrm'
                                ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300'
                                : 'bg-red-950/40 border-red-400 text-red-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    {mysteryResolved && (
                      <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-400 text-emerald-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          <span className="font-bold">¡CORRECTO! DESAFÍO RESUELTO CON ÉXITO.</span>
                        </div>
                        <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-bold">
                          +150 XP LAB
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 07: MI LABORATORIO (HANGAR MULTI-PC & MANTENIMIENTO)               */}
          {/* ========================================================================= */}
          {zone.id === 'zona-7' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    HANGAR PERSONAL DE HARDWARE // PERITAJES REGISTRADOS
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans-editorial">
                    Administrá tus diferentes computadoras, cronogramas de mantenimiento térmico y perfil de operador.
                  </p>
                </div>
              </div>

              {/* Machine Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-950 border-2 border-amber-400 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded font-bold">
                      PC PRINCIPAL
                    </span>
                    <span className="text-[10px] text-emerald-400">ACTIVA</span>
                  </div>
                  <h5 className="font-bold text-sm text-white">{passport?.cpuModel || 'ESTACIÓN DE TRABAJO'}</h5>
                  <p className="text-xs text-zinc-400">
                    RAM: {passport?.ramCapacityGb ? `${passport.ramCapacityGb} GB` : '32 GB DDR5'}
                  </p>
                  <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex justify-between">
                    <span>PASTA TÉRMICA:</span>
                    <span className="text-emerald-400 font-bold">PTM7950 (HACE 4 MESES)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">
                      NOTEBOOK
                    </span>
                    <span className="text-[10px] text-zinc-500">STANDBY</span>
                  </div>
                  <h5 className="font-bold text-sm text-white">LAPTOP DE TRABAJO</h5>
                  <p className="text-xs text-zinc-400">RAM: 16 GB LPDDR5</p>
                  <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex justify-between">
                    <span>PASTA TÉRMICA:</span>
                    <span className="text-amber-400 font-bold">REQUIERE CAMBIO (18 MESES)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">
                      BANCO DE PRUEBAS
                    </span>
                    <span className="text-[10px] text-zinc-500">TEST RIG</span>
                  </div>
                  <h5 className="font-bold text-sm text-white">BENCH RIG LAB</h5>
                  <p className="text-xs text-zinc-400">OPEN FRAME</p>
                  <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex justify-between">
                    <span>PASTA TÉRMICA:</span>
                    <span className="text-emerald-400 font-bold">ARCTIC MX-6 (NUEVA)</span>
                  </div>
                </div>
              </div>

              {/* Narrative Profile Recalibrator */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-xs text-amber-400 font-bold block">
                  CALIBRADOR DE PERFIL NARRATIVO // ESTILO DE OPERADOR:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['investigador', 'constructor', 'explorador', 'tecnico'] as EvoNarrativeProfile[]).map(
                    (prof) => {
                      const detail = EVO_NARRATIVE_PROFILES[prof];
                      return (
                        <button
                          key={prof}
                          onClick={() => onChangeProfile(prof)}
                          className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                            activeProfile === prof
                              ? 'bg-amber-400/20 border-amber-400 text-white'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] font-bold block text-amber-400">
                            {detail.badge}
                          </span>
                          <span className="text-xs font-bold block mt-0.5">{detail.title}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTOR 08: COMUNIDAD EVO (PEER-VERIFIED TELEMETRY REGISTRY)               */}
          {/* ========================================================================= */}
          {zone.id === 'zona-8' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    BANCO DE TELEMETRÍA VERIFICADA POR LA COMUNIDAD
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans-editorial">
                    Compará las temperaturas, voltajes y frametimes de tu máquina contra operadores con componentes idénticos.
                  </p>
                </div>
              </div>

              {/* Community Submissions Table */}
              <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#131622] border-b border-zinc-800 text-zinc-400 text-[10px] uppercase">
                      <th className="p-3">OPERADOR / ID</th>
                      <th className="p-3">HARDWARE (CPU + GPU)</th>
                      <th className="p-3">TEMP MAX</th>
                      <th className="p-3">1% LOW FPS</th>
                      <th className="p-3">ESTABILIDAD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono-tech text-zinc-300">
                    <tr className="hover:bg-zinc-900/50">
                      <td className="p-3 font-bold text-amber-400">@Fierrero99 (AR)</td>
                      <td className="p-3 text-white">Ryzen 7 7800X3D + RTX 4080</td>
                      <td className="p-3 text-emerald-400">62°C (PTM7950)</td>
                      <td className="p-3 font-bold text-emerald-400">142.5 FPS</td>
                      <td className="p-3 text-emerald-400">✓ 100% VERIFICADO</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/50">
                      <td className="p-3 font-bold text-amber-400">@LabTech_Martin</td>
                      <td className="p-3 text-white">Core i5-13600K + RTX 3070</td>
                      <td className="p-3 text-amber-400">76°C (Peerless A.)</td>
                      <td className="p-3 font-bold text-cyan-400">91.2 FPS</td>
                      <td className="p-3 text-emerald-400">✓ 100% VERIFICADO</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/50">
                      <td className="p-3 font-bold text-amber-400">@SilicioPuro</td>
                      <td className="p-3 text-white">Ryzen 5 5600 + RX 6700 XT</td>
                      <td className="p-3 text-emerald-400">67°C (Stock Wraith)</td>
                      <td className="p-3 font-bold text-cyan-400">78.0 FPS</td>
                      <td className="p-3 text-emerald-400">✓ 100% VERIFICADO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#111420] border-t border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs">
          <span className="text-zinc-500 hidden sm:inline">
            EVO LABS METROLOGY SUITE // VERIFICACIÓN EN TIEMPO REAL
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all cursor-pointer"
          >
            CERRAR ESTACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};
