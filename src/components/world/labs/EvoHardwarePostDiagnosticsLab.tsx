import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Wrench,
  Gauge,
  Activity,
  Cpu,
  Zap,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  Terminal,
  ShieldAlert,
  Flame,
  Radio,
  Clock,
  Sparkles,
  Maximize2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Monitor,
  HardDrive,
  Info,
} from 'lucide-react';
import {
  VOLTAGE_RAILS,
  CONTROL_SIGNALS,
  POST_CODES_DICTIONARY,
  REALTIME_BOOT_PHASES,
  FAULT_SCENARIOS,
  RailId,
  VoltageRail,
  FaultScenario,
  BootPhaseData,
} from '../../../data/hardwarePostSimData';
import { ProvenanceBadge } from '../../common/ProvenanceBadge';

interface EvoHardwarePostDiagnosticsLabProps {
  onClose?: () => void;
  initialMode?: 'physical' | 'post' | 'split';
  initialScenarioId?: string;
}

export const EvoHardwarePostDiagnosticsLab: React.FC<EvoHardwarePostDiagnosticsLabProps> = ({
  onClose,
  initialMode = 'split',
  initialScenarioId = 'none',
}) => {
  // Primary Navigation: Alternar entre Diagnóstico Físico y Códigos POST en Tiempo Real
  const [activeTab, setActiveTab] = useState<'physical' | 'post' | 'split'>(initialMode);

  // Simulation Machine State
  const [isACOn, setIsACOn] = useState<boolean>(true);
  const [isPowerOn, setIsPowerOn] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 0.5, 1, 2
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(initialScenarioId);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [bootTimeMs, setBootTimeMs] = useState<number>(0);
  const [isFrozenByFault, setIsFrozenByFault] = useState<boolean>(false);
  const [postSearchQuery, setPostSearchQuery] = useState<string>('');
  const [showUsageGuide, setShowUsageGuide] = useState<boolean>(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('vrm');

  // POST Event Stream History
  const [postHistory, setPostHistory] = useState<
    { timestampMs: number; code: string; stage: string; meaning: string; status: 'OK' | 'BUSY' | 'FAULT' }[]
  >([]);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active Scenario
  const activeScenario: FaultScenario = useMemo(() => {
    return FAULT_SCENARIOS.find((s) => s.id === selectedScenarioId) || FAULT_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Current Phase
  const currentPhase: BootPhaseData = useMemo(() => {
    if (!isACOn) {
      return {
        ...REALTIME_BOOT_PHASES[0],
        postCode: '--',
        targetVoltages: { v5sb: 0, v12: 0, v5: 0, v33: 0, vcore: 0, vccsa: 0, vddq: 0, pch: 0 },
        targetSignals: { ps_on: 'HIGH', pwr_ok: 'LOW', rsmrst: 'LOW', slp_s3: 'LOW', vr_ready: 'LOW', cpu_rst: 'LOW', pltrst: 'LOW', prochot: 'HIGH' },
        activeComponents: [],
      };
    }
    return REALTIME_BOOT_PHASES[Math.min(currentPhaseIndex, REALTIME_BOOT_PHASES.length - 1)];
  }, [isACOn, currentPhaseIndex]);

  // Effective POST Code
  const displayPostCode = useMemo(() => {
    if (!isACOn) return '--';
    if (!isPowerOn) return '--';
    if (isFrozenByFault && activeScenario.freezePostCode) {
      return activeScenario.freezePostCode;
    }
    return currentPhase.postCode;
  }, [isACOn, isPowerOn, isFrozenByFault, activeScenario, currentPhase]);

  // Effective Q-LED status
  const activeQLED = useMemo(() => {
    if (!isACOn || !isPowerOn) return null;
    if (isFrozenByFault && activeScenario.affectedQLED) {
      return activeScenario.affectedQLED;
    }
    return currentPhase.activeQLED;
  }, [isACOn, isPowerOn, isFrozenByFault, activeScenario, currentPhase]);

  // Web Audio Synthesizer for Motherboard Piezo Buzzer
  const playBuzzer = (pattern: number[]) => {
    if (!soundEnabled || pattern.length === 0 || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      let offset = 0.05;
      pattern.forEach((ms) => {
        const dur = ms / 1000;
        const osc = audioCtxRef.current!.createOscillator();
        const gain = audioCtxRef.current!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, audioCtxRef.current!.currentTime + offset); // 880 Hz piezo tone
        gain.gain.setValueAtTime(0.001, audioCtxRef.current!.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.08, audioCtxRef.current!.currentTime + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current!.currentTime + offset + dur);
        osc.connect(gain);
        gain.connect(audioCtxRef.current!.destination);
        osc.start(audioCtxRef.current!.currentTime + offset);
        osc.stop(audioCtxRef.current!.currentTime + offset + dur + 0.02);
        offset += dur + 0.18;
      });
    } catch {
      // Audio autoplay policy handled gracefully
    }
  };

  // Main Simulation State Machine Loop
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isACOn || !isPowerOn || isPaused || isFrozenByFault) {
      return;
    }

    const intervalStepMs = Math.round(currentPhase.durationMs / (10 * simSpeed));

    timerRef.current = setInterval(() => {
      setBootTimeMs((prev) => prev + 50);

      // Check if we hit the fault phase for this scenario
      if (activeScenario.id !== 'none' && currentPhaseIndex === activeScenario.freezePhaseIndex) {
        setIsFrozenByFault(true);
        if (timerRef.current) clearInterval(timerRef.current);
        playBuzzer(activeScenario.beepPattern);
        setPostHistory((prev) => [
          ...prev,
          {
            timestampMs: bootTimeMs,
            code: activeScenario.freezePostCode,
            stage: 'FAULT',
            meaning: `PARADA POR FALLA: ${activeScenario.name}`,
            status: 'FAULT',
          },
        ]);
        return;
      }

      // Normal progression to next phase
      if (currentPhaseIndex < REALTIME_BOOT_PHASES.length - 1) {
        const nextIdx = currentPhaseIndex + 1;
        setCurrentPhaseIndex(nextIdx);

        const nextPhase = REALTIME_BOOT_PHASES[nextIdx];
        if (nextPhase.postCode !== '--') {
          const dictEntry = POST_CODES_DICTIONARY[nextPhase.postCode];
          setPostHistory((prev) => [
            ...prev,
            {
              timestampMs: bootTimeMs + 50,
              code: nextPhase.postCode,
              stage: dictEntry?.stage || 'UEFI',
              meaning: dictEntry?.meaning || nextPhase.name,
              status: 'OK',
            },
          ]);
        }
      } else {
        // Reached OS nominal handoff
        if (timerRef.current) clearInterval(timerRef.current);
        playBuzzer([120]); // 1 single short beep: POST OK
      }
    }, intervalStepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isACOn, isPowerOn, isPaused, isFrozenByFault, currentPhaseIndex, simSpeed, activeScenario, currentPhase]);

  // Actions
  const handleToggleAC = () => {
    setIsACOn((prev) => {
      const next = !prev;
      if (!next) {
        setIsPowerOn(false);
        setCurrentPhaseIndex(0);
        setIsFrozenByFault(false);
        setBootTimeMs(0);
        setPostHistory([]);
      }
      return next;
    });
  };

  const handleTogglePower = () => {
    if (!isACOn) return;
    if (isPowerOn) {
      // Power off
      setIsPowerOn(false);
      setCurrentPhaseIndex(0);
      setIsFrozenByFault(false);
      setBootTimeMs(0);
    } else {
      // Power on
      setIsPowerOn(true);
      setCurrentPhaseIndex(1);
      setIsFrozenByFault(false);
      setBootTimeMs(150);
      setPostHistory([
        {
          timestampMs: 150,
          code: '--',
          stage: 'STANDBY',
          meaning: 'Power button triggered / PS_ON# Low',
          status: 'BUSY',
        },
      ]);
    }
  };

  const handleStepForward = () => {
    if (!isACOn || !isPowerOn || isFrozenByFault) return;
    if (currentPhaseIndex < REALTIME_BOOT_PHASES.length - 1) {
      const nextIdx = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextIdx);
      const nextPhase = REALTIME_BOOT_PHASES[nextIdx];
      if (nextPhase.postCode !== '--') {
        const dictEntry = POST_CODES_DICTIONARY[nextPhase.postCode];
        setPostHistory((prev) => [
          ...prev,
          {
            timestampMs: bootTimeMs + 200,
            code: nextPhase.postCode,
            stage: dictEntry?.stage || 'UEFI',
            meaning: dictEntry?.meaning || nextPhase.name,
            status: 'OK',
          },
        ]);
      }
    }
  };

  const handleResetClearCMOS = () => {
    setCurrentPhaseIndex(isPowerOn ? 1 : 0);
    setIsFrozenByFault(false);
    setBootTimeMs(0);
    setPostHistory([]);
    setSelectedScenarioId('none');
  };

  // Search in POST Code Dictionary
  const filteredDictionary = useMemo(() => {
    const q = postSearchQuery.trim().toUpperCase();
    if (!q) return Object.values(POST_CODES_DICTIONARY);
    return Object.values(POST_CODES_DICTIONARY).filter(
      (entry) =>
        entry.code.toUpperCase().includes(q) ||
        entry.meaning.toUpperCase().includes(q) ||
        entry.component.toUpperCase().includes(q) ||
        entry.description.toUpperCase().includes(q)
    );
  }, [postSearchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#07090E] text-zinc-100 p-4 sm:p-6 lg:p-8 font-sans-editorial select-none space-y-6">
      
      {/* =========================================================================
          1. HEADER & CANONICAL NAVIGATION
      ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech">
            <span className="text-zinc-400">LABORATORIO METROLÓGICO</span>
            <span className="text-zinc-600">/</span>
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              BANCO DE PRUEBAS DE INICIALIZACIÓN
            </span>
            <span className="text-zinc-600">/</span>
            <ProvenanceBadge provenance="CALCULADO" sourceOrFormula="ATX12V v3.0 & UEFI AMI Aptio" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Radio className="w-7 h-7 text-amber-400 animate-pulse" />
            <span>DIAGNÓSTICO FÍSICO & CÓDIGOS POST EN TIEMPO REAL</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-3xl leading-relaxed">
            Alterná en vivo entre la medición multimetrológica de hardware físico (raíles ATX, tolerancias ±5% y señales de placa) y la visualización de los códigos POST en el bus digital de arranque con display de 7 segmentos.
          </p>
        </div>

        {/* Action Controls Top Right */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setShowUsageGuide(!showUsageGuide)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{showUsageGuide ? 'OCULTAR GUÍA' : 'GUÍA DE USO TÉCNICA'}</span>
            {showUsageGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono-tech font-bold transition-all cursor-pointer"
            >
              VOLVER
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. GUÍA DE USO TÉCNICA DESPLEGABLE (Requisito "CÓMO USARLOS")
      ========================================================================= */}
      {showUsageGuide && (
        <div className="p-5 rounded-2xl bg-[#0B0F1A] border border-amber-400/40 shadow-xl space-y-4 font-sans animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="font-mono-tech text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              PROTOCOLO DE LABORATORIO: DIAGNÓSTICO METROLÓGICO PASO A PASO
            </span>
            <span className="text-[10px] font-mono-tech text-zinc-500 uppercase">
              NORMA IEEE / ATX12V / JEDEC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono-tech">
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5">
              <span className="text-amber-400 font-bold block">1. OBJETIVO EXPERIMENTAL</span>
              <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                Comprender la relación causal directa entre las tensiones eléctricas que entrega la fuente de poder y los códigos hexadecimales emitidos por la CPU a través del bus LPC/eSPI durante la inicialización.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5">
              <span className="text-cyan-400 font-bold block">2. CONTROLES DEL BANCO</span>
              <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                Conectá el interruptor <strong>AC</strong> (+5VSB standby activo) → Pulsá <strong>POWER</strong> (PS_ON# baja a masa) → Usá <strong>PAUSA</strong> o <strong>PASO</strong> para congelar y examinar cada código POST y riel.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5">
              <span className="text-yellow-400 font-bold block">3. PRINCIPIO FÍSICO</span>
              <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                Si los rieles principales (+12V, +5V, +3.3V) caen fuera del margen ±5% estipulado por ATX12V, la fuente no afirma PWR_OK (+5V) y la CPU se mantiene en estado de reset inmóvil con código <code>00</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800 space-y-1.5">
              <span className="text-emerald-400 font-bold block">4. VEREDICTO DE BANCO</span>
              <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                El código <code>AA</code> certifica que el 100% de los subsistemas superaron la autocomprobación y el Kernel del SO tomó control. Códigos como <code>55</code> o <code>99</code> aíslan el componente culpable sin cambiar piezas al azar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. SELECTOR PRINCIPAL DE MODO: FÍSICO vs CÓDIGOS POST vs DUAL
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B0F1C] border border-zinc-800 p-2.5 rounded-2xl shadow-lg">
        {/* Toggle Mode Buttons (Anti-Slop Clean Segmented Control) */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-zinc-800 font-mono-tech text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('physical')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'physical'
                ? 'bg-amber-400 text-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>DIAGNÓSTICO DE HARDWARE FÍSICO</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'post'
                ? 'bg-cyan-400 text-black shadow-[0_0_14px_rgba(6,182,212,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>CÓDIGOS POST EN TIEMPO REAL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'split'
                ? 'bg-emerald-400 text-black shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span>BANCO DUAL INTEGRADO</span>
          </button>
        </div>

        {/* Global Hardware Clock & ACPI Badge */}
        <div className="flex items-center gap-2 font-mono-tech text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-zinc-800 text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>TIEMPO T+ {bootTimeMs} ms</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold ${
            isFrozenByFault
              ? 'bg-red-500/15 border-red-500/50 text-red-400 animate-pulse'
              : currentPhase.acpiState.includes('OS')
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-300'
          }`}>
            <span>ACPI: {isACOn ? currentPhase.acpiState : 'G3 (POWER OFF)'}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. CONSOLA DE MANDOS EN BANCO (CONTROLS BAR)
      ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D18] border border-zinc-800/90 shadow-xl space-y-4 font-mono-tech text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Power & Run Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* AC Switch */}
            <button
              type="button"
              onClick={handleToggleAC}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isACOn
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
              title="Conecta o desconecta el cable de alimentación AC (Standby 5VSB)"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>AC INTERRUPTOR: {isACOn ? 'ON (+5VSB)' : 'OFF (0V)'}</span>
            </button>

            {/* POWER Button */}
            <button
              type="button"
              onClick={handleTogglePower}
              disabled={!isACOn}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                !isACOn
                  ? 'bg-zinc-900/50 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : isPowerOn
                  ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border-amber-400/50 hover:border-amber-400'
              }`}
              title="Pulsa el botón de encendido frontal (conmuta PS_ON# a GND)"
            >
              <Activity className="w-4 h-4" />
              <span>{isPowerOn ? 'APAGAR SISTEMA' : 'ENCENDER (POWER BTN)'}</span>
            </button>

            {/* Pause / Resume */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isPowerOn || isFrozenByFault}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                !isPowerOn || isFrozenByFault
                  ? 'bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : isPaused
                  ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
              title={isPaused ? 'Reanudar secuencia' : 'Pausar secuencia'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Step Forward */}
            <button
              type="button"
              onClick={handleStepForward}
              disabled={!isPowerOn || isFrozenByFault}
              className={`px-3 py-2 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isPowerOn || isFrozenByFault
                  ? 'bg-zinc-900/40 text-zinc-600 border-zinc-800 cursor-not-allowed'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border-zinc-700 hover:border-cyan-500/50'
              }`}
              title="Avanza manualmente una sola fase de arranque"
            >
              <ArrowRight className="w-4 h-4" />
              <span>PASO A PASO</span>
            </button>

            {/* Reset / Clear CMOS */}
            <button
              type="button"
              onClick={handleResetClearCMOS}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reinicia la secuencia de inicio y limpia fallas inyectadas"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET / CLEAR CMOS</span>
            </button>
          </div>

          {/* Speed & Audio controls */}
          <div className="flex items-center gap-3">
            {/* Speed Toggle */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 px-1">VELOCIDAD:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    simSpeed === s ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Audio Buzzer Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
              title={soundEnabled ? 'Buzzer piezo activo' : 'Buzzer silenciado'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Inyector de Fallas de Taller */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-zinc-400 text-xs">INYECTOR DE FALLAS FÍSICAS DE BANCO:</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <select
              value={selectedScenarioId}
              onChange={(e) => {
                setSelectedScenarioId(e.target.value);
                // Restart execution to demonstrate the fault
                setCurrentPhaseIndex(isPowerOn ? 1 : 0);
                setIsFrozenByFault(false);
                setBootTimeMs(0);
                setPostHistory([]);
              }}
              className="w-full bg-black/70 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              {FAULT_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-zinc-950 text-zinc-200">
                  [{sc.category}] {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. CONTENEDOR PRINCIPAL: SEGÚN TAB ACTIVO ('physical', 'post', 'split')
      ========================================================================= */}
      <div className={`grid gap-6 items-start ${
        activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
      }`}>

        {/* ---------------------------------------------------------------------
            MÓDULO A: DIAGNÓSTICO DE HARDWARE FÍSICO (Tensiones, Señales, Pistas)
        --------------------------------------------------------------------- */}
        {(activeTab === 'physical' || activeTab === 'split') && (
          <div className={`space-y-6 ${activeTab === 'split' ? 'lg:col-span-6' : 'w-full'}`}>
            
            {/* Header Módulo Físico */}
            <div className="flex items-center justify-between border-b border-amber-500/40 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-black text-base text-white uppercase tracking-tight">
                    DIAGNÓSTICO METROLÓGICO DE HARDWARE FÍSICO
                  </h2>
                  <span className="font-mono-tech text-[10px] text-zinc-400">
                    Multímetro en rieles ATX12V, señales lógicas y componentes
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-mono-tech text-[10px] text-amber-300 font-bold uppercase">
                TOLERANCIA ±5% ATX
              </span>
            </div>

            {/* Panel de Multímetro Digital (Rieles de Voltaje) */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-mono-tech text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>MEDICIÓN DE RIELES DE ALIMENTACIÓN EN BANCO</span>
                </span>
                <span className="font-mono-tech text-[10px] text-zinc-500">
                  SENSOR AD/DA 12-BIT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {VOLTAGE_RAILS.map((rail) => {
                  const targetVal = isACOn
                    ? currentPhase.targetVoltages[rail.id] ?? 0
                    : 0;

                  const isNominal =
                    targetVal >= rail.min && targetVal <= rail.max;
                  const isOff = targetVal === 0;

                  return (
                    <div
                      key={rail.id}
                      className={`p-3 rounded-xl border font-mono-tech transition-all ${
                        isOff
                          ? 'bg-black/40 border-zinc-800/80 text-zinc-500'
                          : isNominal
                          ? 'bg-[#0E1524] border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/30 border-red-500/60 text-red-300 animate-pulse'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs pb-1">
                        <span className="font-bold text-white">{rail.label}</span>
                        <span className={`text-sm font-black ${
                          isOff ? 'text-zinc-600' : isNominal ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {targetVal.toFixed(rail.id === 'vcore' ? 3 : 2)} {rail.unit}
                        </span>
                      </div>

                      {/* Tolerance Bar */}
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden my-1.5 flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isOff
                              ? 'bg-zinc-800 w-0'
                              : isNominal
                              ? 'bg-emerald-400'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(0, (targetVal / (rail.nominal * 1.3)) * 100))}%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Min: {rail.min}V</span>
                        <span>Nom: {rail.nominal}V</span>
                        <span>Max: {rail.max}V</span>
                      </div>

                      <div className="text-[10px] text-zinc-400 pt-1 truncate" title={rail.testPoint}>
                        📍 {rail.testPoint}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analizador Lógico de Señales de Secuencia */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-mono-tech text-xs text-cyan-400 font-bold uppercase flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>ANALIZADOR LÓGICO DE SEÑALES DIGITALES (BUS SECUENCIA)</span>
                </span>
                <span className="font-mono-tech text-[10px] text-zinc-500">
                  LÓGICA TTL / CMOS
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-tech text-xs">
                {CONTROL_SIGNALS.map((sig) => {
                  const currentLevel = isACOn
                    ? currentPhase.targetSignals[sig.id] ?? 'LOW'
                    : 'LOW';

                  const isAsserted =
                    (sig.activeLevel === 'LOW' && currentLevel === 'LOW') ||
                    (sig.activeLevel === 'HIGH' && currentLevel === 'HIGH');

                  return (
                    <div
                      key={sig.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isAsserted
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-black/40 border-zinc-800 text-zinc-500'
                      }`}
                      title={`${sig.name}: ${sig.description} (Punto: ${sig.testPoint})`}
                    >
                      <span className="block text-[11px] font-bold text-white truncate">
                        {sig.name}
                      </span>
                      <div className="flex items-center justify-between pt-1">
                        <span className={`text-[10px] font-black ${
                          isAsserted ? 'text-cyan-400' : 'text-zinc-600'
                        }`}>
                          {currentLevel}
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase">
                          {isAsserted ? 'ACTIVA' : 'INACTIVA'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mapa Interactivo de Componentes de Placa Madre */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-mono-tech text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>TOPOLOGÍA DE SILICIO & PUNTOS DE PRUEBA EN BANCO</span>
                </span>
                <span className="font-mono-tech text-[10px] text-zinc-500">
                  LGA1700 / CHIPSET / VRM
                </span>
              </div>

              {/* Schematic Component Selector */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono-tech text-xs">
                {[
                  { id: 'vrm', name: 'VRM 12V', icon: '⚡' },
                  { id: 'cpu', name: 'CPU Socket', icon: '🔲' },
                  { id: 'ram', name: 'Slots RAM', icon: '📊' },
                  { id: 'gpu', name: 'PCIe x16', icon: '🖥️' },
                  { id: 'pch', name: 'Chipset PCH', icon: '⚙️' },
                  { id: 'flash', name: 'BIOS SPI', icon: '💾' },
                ].map((comp) => {
                  const isCompActive = currentPhase.activeComponents.includes(comp.id);
                  const isSelected = selectedComponentId === comp.id;

                  return (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : isCompActive
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-black/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{comp.icon}</span>
                      <span className="text-[10px] block font-semibold truncate">{comp.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Component Physical Details Drawer */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 text-xs font-mono-tech space-y-1.5">
                <span className="text-amber-400 font-bold block">
                  📍 CONSEJO PERICIAL DE BANCO PARA ESTA FASE:
                </span>
                <p className="text-zinc-300 font-sans text-xs leading-relaxed">
                  {currentPhase.physicalInspectionTip}
                </p>
              </div>
            </div>

            {/* Panel de Resolución de Falla Física si se dispara escenario */}
            {isFrozenByFault && activeScenario.id !== 'none' && (
              <div className="rounded-2xl border border-red-500/60 bg-red-950/20 p-5 space-y-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-red-400 font-mono-tech text-xs font-bold uppercase">
                  <Flame className="w-5 h-5 text-red-400 animate-bounce" />
                  <span>FALLA FÍSICA DETECTADA: {activeScenario.name}</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <strong className="text-white font-mono-tech block">ANÁLISIS CAUSA-RAÍZ:</strong>
                  <p className="text-zinc-300 leading-relaxed bg-black/50 p-3 rounded-xl border border-red-500/30">
                    {activeScenario.rootCauseAnalysis}
                  </p>
                </div>

                <div className="space-y-2">
                  <strong className="text-white font-mono-tech text-xs block">HALLAZGOS MULTIMETROLÓGICOS:</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono-tech text-[11px]">
                    {activeScenario.multimeterFindings.map((f, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
                        <span className="text-zinc-400 block truncate">{f.testPoint}</span>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-zinc-500">Esp: {f.expected}</span>
                          <span className="text-red-400 font-bold">{f.measured}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <strong className="text-white font-mono-tech text-xs block">PROTOCOLO DE REPARACIÓN EN TALLER:</strong>
                  <ul className="space-y-1 text-xs text-zinc-300 font-sans list-disc list-inside">
                    {activeScenario.troubleshootingChecklist.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------------
            MÓDULO B: VISUALIZACIÓN DE CÓDIGOS POST EN TIEMPO REAL
        --------------------------------------------------------------------- */}
        {(activeTab === 'post' || activeTab === 'split') && (
          <div className={`space-y-6 ${activeTab === 'split' ? 'lg:col-span-6' : 'w-full'}`}>
            
            {/* Header Módulo POST */}
            <div className="flex items-center justify-between border-b border-cyan-500/40 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-black text-base text-white uppercase tracking-tight">
                    CÓDIGOS POST Y BUS DIGITAL EN TIEMPO REAL
                  </h2>
                  <span className="font-mono-tech text-[10px] text-zinc-400">
                    Display 7 segmentos, bus eSPI/LPC, Q-LEDs y log UEFI
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-mono-tech text-[10px] text-cyan-300 font-bold uppercase">
                AMI APTIO V / PHOENIX
              </span>
            </div>

            {/* Display 7 Segmentos de 2 Dígitos & Q-LEDs */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              
              {/* 7-Segment Dual LED Display */}
              <div className="flex flex-col items-center gap-2">
                <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                  DISPLAY POST 2 DÍGITOS
                </span>

                <div className="relative px-6 py-4 rounded-2xl bg-black border-2 border-zinc-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex items-center justify-center">
                  <span
                    className={`font-mono text-6xl sm:text-7xl font-black tracking-widest transition-all ${
                      displayPostCode === '--'
                        ? 'text-zinc-800'
                        : isFrozenByFault
                        ? 'text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)] animate-pulse'
                        : displayPostCode === 'AA'
                        ? 'text-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.8)]'
                        : 'text-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]'
                    }`}
                  >
                    {displayPostCode}
                  </span>
                </div>

                <span className="font-mono-tech text-[11px] text-zinc-400 font-bold uppercase">
                  {POST_CODES_DICTIONARY[displayPostCode]?.stage || 'ESTADO'}: {displayPostCode}
                </span>
              </div>

              {/* 4 Q-LEDs Debug (CPU, DRAM, VGA, BOOT) */}
              <div className="flex-1 w-full sm:w-auto p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-3 font-mono-tech text-xs">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
                  INDICADORES DE DIAGNÓSTICO RÁPIDO (Q-LEDS)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* CPU Q-LED */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    activeQLED === 'CPU'
                      ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full mx-auto block mb-1 ${
                      activeQLED === 'CPU' ? 'bg-red-500 animate-pulse' : 'bg-zinc-800'
                    }`} />
                    <span className="font-bold text-[10px]">CPU</span>
                  </div>

                  {/* DRAM Q-LED */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    activeQLED === 'DRAM'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full mx-auto block mb-1 ${
                      activeQLED === 'DRAM' ? 'bg-yellow-400 animate-pulse' : 'bg-zinc-800'
                    }`} />
                    <span className="font-bold text-[10px]">DRAM</span>
                  </div>

                  {/* VGA Q-LED */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    activeQLED === 'VGA'
                      ? 'bg-white/20 border-white text-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full mx-auto block mb-1 ${
                      activeQLED === 'VGA' ? 'bg-white animate-pulse' : 'bg-zinc-800'
                    }`} />
                    <span className="font-bold text-[10px]">VGA</span>
                  </div>

                  {/* BOOT Q-LED */}
                  <div className={`p-2.5 rounded-lg border text-center transition-all ${
                    activeQLED === 'BOOT'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full mx-auto block mb-1 ${
                      activeQLED === 'BOOT' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-800'
                    }`} />
                    <span className="font-bold text-[10px]">BOOT</span>
                  </div>
                </div>

                {/* Speaker Audio Beeper status */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>BUZZER SPEAKER:</span>
                  </span>
                  <span className="text-zinc-300 font-bold">
                    {isFrozenByFault ? activeScenario.beepDescription : displayPostCode === 'AA' ? '1 Beep corto (POST OK)' : 'Silencioso (Muestreo)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Decodificador Oficial en Vivo del Código POST Activo */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-3 font-mono-tech">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs text-cyan-400 font-bold uppercase flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DECODIFICADOR TÉCNICO OFICIAL AMI / UEFI</span>
                </span>
                <span className="text-[10px] text-zinc-500">HEX: 0x{displayPostCode}</span>
              </div>

              {POST_CODES_DICTIONARY[displayPostCode] ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      {POST_CODES_DICTIONARY[displayPostCode].meaning}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase">
                      FASE: {POST_CODES_DICTIONARY[displayPostCode].stage}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                    {POST_CODES_DICTIONARY[displayPostCode].description}
                  </p>

                  <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 text-[11px] space-y-1">
                    <span className="text-amber-400 font-bold block">ACCIÓN PERICIAL RECOMENDADA:</span>
                    <span className="text-zinc-300 font-sans">{POST_CODES_DICTIONARY[displayPostCode].recommendedAction}</span>
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 text-xs font-sans">
                  Código de transición o display en standby.
                </div>
              )}
            </div>

            {/* Secuencia Cronológica de Fases UEFI (Stepper) */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-3 font-mono-tech">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs text-amber-400 font-bold uppercase flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>CRONOLOGÍA DE FASES UEFI EN BANCO ({currentPhaseIndex + 1}/11)</span>
                </span>
                <span className="text-[10px] text-zinc-500">{currentPhase.name}</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto scroll-slim pr-1 text-xs">
                {REALTIME_BOOT_PHASES.map((p, idx) => {
                  const isPast = idx < currentPhaseIndex;
                  const isCurrent = idx === currentPhaseIndex;

                  return (
                    <div
                      key={p.id}
                      className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold'
                          : isPast
                          ? 'bg-black/40 border-zinc-850 text-zinc-400'
                          : 'bg-black/20 border-transparent text-zinc-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full ${
                          isCurrent ? 'bg-amber-400 animate-pulse' : isPast ? 'bg-emerald-500' : 'bg-zinc-800'
                        }`} />
                        <span className="truncate">{p.name}</span>
                      </div>
                      <span className="font-mono text-[10px] shrink-0 text-zinc-500">
                        POST: {p.postCode}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registro de Eventos POST en Vivo (Event Stream) */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-3 font-mono-tech">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs text-emerald-400 font-bold uppercase flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>STREAM DE EVENTOS DEL BUS LPC / ESPI (HISTORIAL EN VIVO)</span>
                </span>
                <span className="text-[10px] text-zinc-500">{postHistory.length} EVENTOS</span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto scroll-slim pr-1 text-[11px]">
                {postHistory.length === 0 ? (
                  <div className="text-zinc-600 text-center py-4 font-sans">
                    Pulsá POWER para iniciar el registro de códigos POST.
                  </div>
                ) : (
                  postHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-3 ${
                        item.status === 'FAULT'
                          ? 'bg-red-950/40 border-red-500/50 text-red-300'
                          : item.code === 'AA'
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-black/40 border-zinc-850 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-zinc-500 font-mono">T+{item.timestampMs}ms</span>
                        <span className="px-1.5 py-0.2 rounded bg-black/60 font-mono font-bold text-amber-400">
                          0x{item.code}
                        </span>
                        <span className="truncate text-zinc-300">{item.meaning}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 uppercase shrink-0">
                        {item.stage}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Buscador & Diccionario de Códigos POST de Referencia */}
            <div className="rounded-2xl border border-zinc-800 bg-[#090D17] p-5 space-y-3 font-mono-tech">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <span className="text-xs text-white font-bold uppercase flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>ENCICLOPEDIA Y DICCIONARIO DE CÓDIGOS POST</span>
                </span>
                <div className="relative">
                  <input
                    type="text"
                    value={postSearchQuery}
                    onChange={(e) => setPostSearchQuery(e.target.value)}
                    placeholder="Buscar código (ej: 55, 99, 00)..."
                    className="bg-black/70 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-zinc-600 focus:border-cyan-400 focus:outline-none w-48 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto scroll-slim pr-1">
                {filteredDictionary.map((entry) => (
                  <div
                    key={entry.code}
                    className="p-3 rounded-xl bg-black/40 border border-zinc-850 hover:border-zinc-700 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between font-mono pb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/40 text-amber-400 font-bold">
                        CÓDIGO 0x{entry.code}
                      </span>
                      <span className="text-zinc-500 uppercase text-[10px]">
                        [{entry.stage}] · COMPONENTE: {entry.component}
                      </span>
                    </div>
                    <span className="font-bold text-white block mt-1">{entry.meaning}</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5 leading-relaxed">
                      {entry.description}
                    </p>
                    <div className="mt-1 text-[10px] text-cyan-300 font-mono">
                      🔧 {entry.recommendedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          6. FOOTER DE SALIDA Y LEMA EVO LABS
      ========================================================================= */}
      <footer className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 font-mono-tech text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
          <span className="font-bold text-zinc-300">
            EVO LABS // BANCO DE DIAGNÓSTICO FÍSICO & CÓDIGOS POST EN TIEMPO REAL
          </span>
        </div>
        <div className="text-amber-400 font-bold uppercase tracking-wider">
          NO LO CREAS. COMPROBALO.
        </div>
      </footer>
    </div>
  );
};
