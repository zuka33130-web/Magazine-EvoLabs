import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Copy, 
  Check, 
  Zap, 
  Gauge, 
  Microscope,
  Info,
  Clock,
  ShieldCheck,
  Cpu,
  Lock,
  Unlock,
  Layers
} from 'lucide-react';
import { useEvoOperatingMode } from '../../../../hooks/useEvoOperatingMode';

interface DriverPreset {
  id: string;
  name: string;
  branch: string;
  category: 'whql' | 'oem' | 'debloated' | 'conflicto';
  baseDpcLatencyUs: number;
  maxDpcSpikeUs: number;
  ramFootprintMb: number;
  onePercentLowDispersionPct: number;
  description: string;
  primaryModule: string;
}

const DRIVER_PRESETS: DriverPreset[] = [
  {
    id: 'whql_official',
    name: 'Driver WHQL Oficial Certificado',
    branch: 'Microsoft WHQL Certified Driver Matrix',
    category: 'whql',
    baseDpcLatencyUs: 52,
    maxDpcSpikeUs: 110,
    ramFootprintMb: 420,
    onePercentLowDispersionPct: 2.1,
    description: 'Valores nominales de latencia DPC (≤ 120 µs). Firma digital de Microsoft, estabilidad validada en WDDM 3.2.',
    primaryModule: 'nvlddmkm.sys / amdkmdag.sys (WHQL Clean)',
  },
  {
    id: 'oem_manufacturer',
    name: 'Driver de Fabricante OEM (Dell / ASUS / Lenovo)',
    branch: 'OEM Validated Branch // Soporte de Chasis',
    category: 'oem',
    baseDpcLatencyUs: 118,
    maxDpcSpikeUs: 260,
    ramFootprintMb: 580,
    onePercentLowDispersionPct: 5.4,
    description: 'Parámetros promedio de estabilidad. Incluye hooks adicionales para perfiles de energía térmicos y control de ventiladores del fabricante.',
    primaryModule: 'nvlddmkm.sys + OEM_PowerService.sys',
  },
  {
    id: 'debloated_custom',
    name: 'Perfil Modificado / Debloated (NVCleanstall)',
    branch: 'Stripped Bare-Metal // Sin Telemetría',
    category: 'debloated',
    baseDpcLatencyUs: 38,
    maxDpcSpikeUs: 195,
    ramFootprintMb: 180,
    onePercentLowDispersionPct: 14.8,
    description: 'Menor huella en RAM (-60%), pero con dispersión en el percentil 1% Low si se recortaron dependencias críticas de kernel (nvlddmkm.sys / HD Audio).',
    primaryModule: 'nvlddmkm.sys (Stripped Core)',
  },
  {
    id: 'conflict_leak',
    name: 'Driver con Fuga de Memoria / Conflicto de IRQ',
    branch: 'Conflicto de Controladores / Instalación Sucia',
    category: 'conflicto',
    baseDpcLatencyUs: 420,
    maxDpcSpikeUs: 890,
    ramFootprintMb: 890,
    onePercentLowDispersionPct: 42.0,
    description: 'Disparo de latencias elevadas (> 800 µs) e inyección de micro-stuttering visible en el osciloscopio y chasquidos continuos en buffers de audio.',
    primaryModule: 'nvlddmkm.sys + Wdf01000.sys (ISR Stall)',
  },
];

interface TimerPreset {
  id: string;
  label: string;
  resolutionMs: number;
  tickRateHz: number;
  jitterImpactFactor: number;
  description: string;
  kernelNote: string;
}

const TIMER_PRESETS: TimerPreset[] = [
  {
    id: 'timer_high_precision',
    label: 'Alta Precisión EVO (0.500 ms / 2,000 Hz)',
    resolutionMs: 0.5,
    tickRateHz: 2000,
    jitterImpactFactor: 0.65,
    description: 'Resolución forzada por API NtSetTimerResolution(5000). Despacho rápido de interrupciones sin jitter.',
    kernelNote: 'Despierta el planificador de Windows cada 500µs. Máxima regularidad en el despacho de frames.',
  },
  {
    id: 'timer_standard',
    label: 'Temporizador Estándar (1.000 ms / 1,000 Hz)',
    resolutionMs: 1.0,
    tickRateHz: 1000,
    jitterImpactFactor: 1.0,
    description: 'Resolución estándar multimedia activada por Chromium, Discord o reproductores de video (timeBeginPeriod).',
    kernelNote: 'Despacho de hilos equilibrado con consumo térmico moderado.',
  },
  {
    id: 'timer_default',
    label: 'Default Windows Ahorro (15.625 ms / 64 Hz)',
    resolutionMs: 15.625,
    tickRateHz: 64,
    jitterImpactFactor: 1.45,
    description: 'Reloj estándar de conservación energética de Windows cuando no hay aplicaciones multimedia en primer plano.',
    kernelNote: 'Gran espaciamiento entre ticks que puede inducir saltos en el frametime a 144Hz o 240Hz.',
  },
];

export const Sector02SoftwareHotSwap: React.FC = () => {
  const { isPericial } = useEvoOperatingMode();

  const [selectedDriverId, setSelectedDriverId] = useState<string>('whql_official');
  const [selectedTimerId, setSelectedTimerId] = useState<string>('timer_high_precision');
  const [hardwareMitigationsEnabled, setHardwareMitigationsEnabled] = useState<boolean>(true);
  const [isCopiedCommand, setIsCopiedCommand] = useState<boolean>(false);

  const selectedDriver = useMemo(
    () => DRIVER_PRESETS.find((d) => d.id === selectedDriverId) || DRIVER_PRESETS[0],
    [selectedDriverId]
  );

  const selectedTimer = useMemo(
    () => TIMER_PRESETS.find((t) => t.id === selectedTimerId) || TIMER_PRESETS[0],
    [selectedTimerId]
  );

  // Impact of Hardware Mitigations (Spectre, Meltdown, VBS/HVCI)
  const mitigationImpact = useMemo(() => {
    if (hardwareMitigationsEnabled) {
      return {
        cpuRenderPenaltyPct: -8.5,
        syscallOverheadPct: 14.2,
        securityStatusLabel: 'MÁXIMA SEGURIDAD // RING 0 AISLADO',
        description: 'VBS (Virtualization-Based Security), HVCI y mitigaciones de ejecución especulativa activas. Aísla el kernel pero añade overhead de render.',
      };
    } else {
      return {
        cpuRenderPenaltyPct: 0.0,
        syscallOverheadPct: 0.0,
        securityStatusLabel: 'BARE-METAL E-SPORTS // VULNERABLE',
        description: 'Mitigaciones suprimidas. Cero sobrecarga en saltos de Ring 3 a Ring 0, con ganancia directa en CPU render pero sin aislamiento de hipervisor.',
      };
    }
  }, [hardwareMitigationsEnabled]);

  // Computed Real-Time DPC Latency in Microseconds (µs)
  const computedDpcLatencyUs = useMemo(() => {
    let latency = selectedDriver.baseDpcLatencyUs;
    if (selectedTimer.id === 'timer_high_precision') {
      latency = Math.max(20, Math.round(latency * 0.88));
    } else if (selectedTimer.id === 'timer_default') {
      latency = Math.round(latency * 1.25);
    }
    return latency;
  }, [selectedDriver, selectedTimer]);

  const maxSpikeUs = useMemo(() => {
    let spike = selectedDriver.maxDpcSpikeUs;
    if (selectedDriver.id === 'conflict_leak') {
      spike = 890;
    }
    return spike;
  }, [selectedDriver]);

  // Frametime Jitter Delta in ms
  const frametimeJitterMs = useMemo(() => {
    const baseJitter = (computedDpcLatencyUs / 100) * selectedTimer.jitterImpactFactor;
    const debloatedNoise = selectedDriver.id === 'debloated_custom' ? 0.35 : 0;
    return +(baseJitter + debloatedNoise).toFixed(2);
  }, [computedDpcLatencyUs, selectedTimer, selectedDriver]);

  const handleCopyAuditCommand = () => {
    const cmd = 'powercfg -energy -duration 5; Get-WmiObject Win32_PnPSignedDriver | Where-Object { $_.DeviceName -like "*NVIDIA*" -or $_.DeviceName -like "*AMD*" } | Select-Object DeviceName, DriverVersion, Signer';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
      setIsCopiedCommand(true);
      setTimeout(() => setIsCopiedCommand(false), 2000);
    }
  };

  return (
    <div className="space-y-6 font-mono-tech select-none animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div 
        className="p-5 rounded-2xl border-2 shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(14, 18, 25, 0.95) 45%, #080a0d 100%)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-400 text-black font-black text-[10px] uppercase tracking-wider">
                MÓDULO DE METROLOGÍA 02-B
              </span>
              <span className="text-zinc-400 text-xs">
                HOT-SWAP DE SOFTWARE & KERNEL // AUDITORÍA DPC EN RING 0
              </span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
              Hot-Swap de Software: Matriz de Controladores, Temporizador & Mitigaciones VBS
            </h3>
            <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
              Simulá el comportamiento del sistema operativo sin arriesgar tu instalación. 
              Examiná cómo las ramas de drivers alteran la latencia de cola DPC (µs), optimizá la resolución del reloj del kernel y
              medí el impacto exacto en rendimiento al activar mitigaciones contra Spectre/Meltdown y VBS/HVCI.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 text-right shrink-0 min-w-[200px]">
            <span className="text-[10px] text-zinc-500 uppercase block tracking-wider font-bold">
              LATENCIA DPC ESTIMADA
            </span>
            <div className="flex items-baseline justify-end gap-1.5 my-1">
              <span
                className={`text-4xl font-black ${
                  computedDpcLatencyUs <= 120
                    ? 'text-emerald-400'
                    : computedDpcLatencyUs < 300
                    ? 'text-amber-400'
                    : 'text-rose-500 animate-pulse'
                }`}
              >
                {computedDpcLatencyUs}
              </span>
              <span className="text-xs text-zinc-400 font-bold">µs</span>
            </div>
            <span
              className={`text-[9.5px] font-bold block ${
                computedDpcLatencyUs <= 120
                  ? 'text-emerald-400'
                  : computedDpcLatencyUs < 300
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {computedDpcLatencyUs <= 120
                ? 'ESTADO ÓPTIMO (≤ 120 µs NOMINAL)'
                : computedDpcLatencyUs < 300
                ? 'VARIACIÓN MODERADA'
                : 'ALERTA: DISPARO DPC (>800µs SPIKE)'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Controls vs Metrology Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: CONTROLS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: DRIVER MATRIX SELECTOR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0e15] border border-zinc-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                1. MATRIZ DE CONTROLADOR GRÁFICO (DRIVER MATRIX)
              </span>
              <span className="text-[10px] text-zinc-500">HOOKS DE WDDM RING 0</span>
            </div>

            <div className="space-y-2.5">
              {DRIVER_PRESETS.map((driver) => {
                const isSelected = driver.id === selectedDriverId;
                const isConflict = driver.category === 'conflicto';
                const isDebloated = driver.category === 'debloated';
                return (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? isConflict
                          ? 'bg-rose-950/30 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                          : 'bg-cyan-400/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white block">{driver.name}</span>
                        {isDebloated && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            DEBLOATED
                          </span>
                        )}
                        {isConflict && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            CONFLICTO // STALL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-300 font-mono-tech">
                        DPC: <strong className={isConflict ? 'text-rose-400' : 'text-emerald-400'}>{driver.baseDpcLatencyUs} µs</strong>
                      </span>
                    </div>

                    <p className="text-[11px] font-sans-editorial text-zinc-300 mt-1 leading-relaxed">
                      {driver.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] mt-2 text-zinc-500 font-mono-tech">
                      <span>Módulo: <strong className="text-zinc-300">{driver.primaryModule}</strong></span>
                      <span>//</span>
                      <span>RAM: <strong className="text-zinc-300">{driver.ramFootprintMb} MB</strong></span>
                      <span>//</span>
                      <span>Dispersión 1% Low: <strong className={isConflict ? 'text-rose-400' : 'text-zinc-300'}>{driver.onePercentLowDispersionPct}%</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: TIMER RESOLUTION SWITCH */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0e15] border border-zinc-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-2">
                <Clock className="w-4 h-4" />
                2. CONMUTADOR DE TEMPORIZADOR DE WINDOWS (TIMER RESOLUTION)
              </span>
              <span className="text-[10px] text-zinc-500">SCHEDULER RESOLUTION</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TIMER_PRESETS.map((timer) => {
                const isSelected = timer.id === selectedTimerId;
                return (
                  <button
                    key={timer.id}
                    type="button"
                    onClick={() => setSelectedTimerId(timer.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{timer.label}</span>
                    <p className="text-[10px] font-sans-editorial text-zinc-300 mt-1 leading-snug">
                      {timer.description}
                    </p>
                    <span className="text-[9.5px] text-zinc-400 block mt-1.5 font-mono-tech">
                      Tick: <strong className="text-white">{timer.resolutionMs} ms</strong> ({timer.tickRateHz} Hz)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: HARDWARE MITIGATIONS & SECURITY SWITCH */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0e15] border border-zinc-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <span className="text-xs font-bold text-purple-400 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                3. CONMUTADOR DE SEGURIDAD // SPECTRE, MELTDOWN & VBS/HVCI
              </span>
              <span className="text-[10px] text-zinc-500">RING 0 / ISOLATION</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-black/60 border border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {hardwareMitigationsEnabled ? (
                    <Lock className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="font-bold text-white text-xs">
                    {hardwareMitigationsEnabled
                      ? 'MITIGACIONES ACTIVAS (VBS / HVCI / RETPOLINE SPECTRE)'
                      : 'MODO E-SPORTS BARE-METAL (MITIGACIONES SUPRIMIDAS)'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed max-w-xl">
                  {mitigationImpact.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHardwareMitigationsEnabled(!hardwareMitigationsEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  hardwareMitigationsEnabled
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                    : 'bg-amber-400 text-black border-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.35)]'
                }`}
              >
                {hardwareMitigationsEnabled ? 'DESACTIVAR MITIGACIONES' : 'ACTIVAR MITIGACIONES'}
              </button>
            </div>

            {/* Impact Metric Bars */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                  IMPACTO DIRECTO EN CPU RENDER:
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-xl font-black ${
                      mitigationImpact.cpuRenderPenaltyPct === 0
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {mitigationImpact.cpuRenderPenaltyPct}%
                  </span>
                  <span className="text-[10px] text-zinc-400">vs bare-metal puro</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                  SOBRECARGA EN LLAMADAS DE SISTEMA:
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-xl font-black ${
                      mitigationImpact.syscallOverheadPct === 0
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    +{mitigationImpact.syscallOverheadPct}%
                  </span>
                  <span className="text-[10px] text-zinc-400">Ring 3 &lt;-&gt; Ring 0</span>
                </div>
              </div>
            </div>
          </div>

          {/* POWERSHELL COMMAND SNIPPET */}
          <div className="p-4 rounded-xl bg-[#090b11] border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                AUDITORÍA LOCAL DE DRIVERS (POWERSHELL READ-ONLY)
              </span>
              <button
                type="button"
                onClick={handleCopyAuditCommand}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {isCopiedCommand ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>COPIADO</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>COPIAR</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-black/80 font-mono-tech text-[10.5px] text-emerald-400 border border-zinc-800/80 overflow-x-auto whitespace-pre-wrap break-all">
              Get-WmiObject Win32_PnPSignedDriver | Where-Object {'{'} $_.DeviceName -like "*NVIDIA*" -or $_.DeviceName -like "*AMD*" {'}'} | Select-Object DeviceName, DriverVersion, Signer
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DPC OSCILLOSCOPE & INSTRUMENT TELEMETRY (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-5 rounded-2xl bg-[#0e111a] border-2 border-zinc-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                OSCILOSCOPIO DPC & ISR EN TIEMPO REAL
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                KERNEL LATENCY
              </span>
            </div>

            {/* DPC Meters */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">LATENCIA DPC MEDIA</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-2xl font-black ${
                      computedDpcLatencyUs <= 120
                        ? 'text-emerald-400'
                        : computedDpcLatencyUs < 300
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {computedDpcLatencyUs}
                  </span>
                  <span className="text-xs text-zinc-400">µs</span>
                </div>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Nominal: ≤ 120 µs
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold">PICO MÁXIMO (SPIKE)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span
                    className={`text-2xl font-black ${
                      maxSpikeUs < 200 ? 'text-emerald-400' : maxSpikeUs < 500 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {maxSpikeUs}
                  </span>
                  <span className="text-xs text-zinc-400">µs</span>
                </div>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Módulo: {selectedDriver.primaryModule.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Dynamic Waveform Graph of DPC routine execution (60 Events) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-white">HISTOGRAMA DE INTERRUPCIONES (60 EVENTOS)</span>
                <span className="text-cyan-400 font-bold text-[11px]">
                  Jitter: {frametimeJitterMs} ms
                </span>
              </div>

              <div className="h-32 bg-black/90 rounded-xl border border-zinc-800 p-2.5 flex items-end gap-1 overflow-hidden relative">
                {/* Safe Threshold Line (120 µs) */}
                <div
                  className="absolute left-0 right-0 border-b border-dashed border-emerald-500/50 z-10 pointer-events-none"
                  style={{ bottom: '28%' }}
                >
                  <span className="text-[8px] text-emerald-400 ml-2 font-mono-tech">120 µs (Zona Nominal WHQL)</span>
                </div>

                {/* Critical Threshold Line (500 µs) */}
                <div
                  className="absolute left-0 right-0 border-b border-dashed border-rose-500/50 z-10 pointer-events-none"
                  style={{ bottom: '75%' }}
                >
                  <span className="text-[8px] text-rose-400 ml-2 font-mono-tech">500 µs (Zona Crítica)</span>
                </div>

                {Array.from({ length: 48 }).map((_, idx) => {
                  let heightPct = (computedDpcLatencyUs / 500) * 50;
                  const isConflictSpike = selectedDriver.id === 'conflict_leak' && idx % 4 === 0;
                  const isDebloatedJitter = selectedDriver.id === 'debloated_custom' && idx % 7 === 0;

                  if (isConflictSpike) heightPct = 92;
                  if (isDebloatedJitter) heightPct = 65;

                  heightPct = Math.min(98, Math.max(12, heightPct + (Math.sin(idx * 2) * 5)));
                  const isRed = heightPct > 70;

                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-xs transition-all duration-300 ${
                        isRed
                          ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                          : computedDpcLatencyUs <= 120
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between text-[9px] text-zinc-500">
                <span>0 µs</span>
                <span className="text-zinc-400">Verde ≤ 120µs // Amarillo &lt; 400µs // Rojo &gt; 500µs</span>
                <span>890 µs</span>
              </div>
            </div>

            {/* DUAL-LEVEL MODE-AWARE INSIGHT BLOCK */}
            {!isPericial ? (
              // MODO ESENCIAL (LENGUAJE NATURAL DIRECTO)
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-sans-editorial space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono-tech">
                  <Gauge className="w-4 h-4" />
                  <span>DIAGNÓSTICO // MODO ESENCIAL:</span>
                </div>
                <p className="text-zinc-200 leading-relaxed">
                  {selectedDriver.id === 'conflict_leak'
                    ? '⚠️ Alerta: El controlador gráfico actual presenta fugas de interrupción. Notarás chasquidos en Discord, retrasos al mover el mouse y micro-parones espontáneos en juegos.'
                    : selectedDriver.id === 'debloated_custom'
                    ? 'ℹ️ El controlador recortado ahorra memoria, pero al haber eliminado dependencias del sistema, sufrirás pequeños tirones esporádicos en los momentos más intensos.'
                    : computedDpcLatencyUs <= 120
                    ? '✅ El sistema responde con inmediatez. Los controladores procesan las señales en menos de 120 microsegundos, asegurando máxima precisión de apuntado y cero interferencias de audio.'
                    : 'Rendimiento aceptable, aunque podés mejorar la fluidez instalando el controlador WHQL certificado.'}
                </p>
              </div>
            ) : (
              // MODO PERICIAL (TELEMETRÍA DE KERNEL SYSINTERNALS)
              <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 text-xs font-mono-tech space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span className="flex items-center gap-2">
                    <Microscope className="w-4 h-4" />
                    <span>REGISTRO PERICIAL DE KERNEL // RING 0:</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">IRQL 2 DISPATCH</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-zinc-300 leading-relaxed font-sans-editorial">
                  <p>
                    • <strong>Cola DPC:</strong> Las rutinas diferidas en {selectedDriver.primaryModule} se completan en{' '}
                    <span className="text-cyan-400 font-mono-tech">{computedDpcLatencyUs} µs</span>.
                  </p>
                  <p>
                    • <strong>Reloj NtSetTimerResolution:</strong> Programado a {selectedTimer.resolutionMs}ms ({selectedTimer.tickRateHz} Hz), 
                    estabilizando la cola de Windows Graphics Kernel (dxgkrnl.sys).
                  </p>
                  <p>
                    • <strong>Seguridad Hypervisor:</strong> Mitigaciones {hardwareMitigationsEnabled ? 'ACTIVAS' : 'INACTIVAS'}. 
                    Penalidad en pipeline de CPU: <span className="text-amber-400 font-mono-tech">{mitigationImpact.cpuRenderPenaltyPct}%</span>.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
