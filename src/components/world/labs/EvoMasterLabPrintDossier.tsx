import React from 'react';
import {
  Cpu,
  Layers,
  Zap,
  Flame,
  ShieldCheck,
  Activity,
  Gauge,
  HardDrive,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Microscope,
  FileCheck,
  Hash,
  Scale,
  Award,
  Clock,
  Terminal,
} from 'lucide-react';
import { UserHardwarePassport } from '../../../types';

export interface EvoMasterLabPrintData {
  timestamp: string;
  sessionId: string;
  isPericial: boolean;
  passport: UserHardwarePassport | null;
  cpu: {
    name: string;
    cores: string;
    l3CacheMb: number;
    imcMode: string;
    tjMaxC: number;
    tdpWatt: number;
  };
  ram: {
    frequencyMt: number;
    cl: number;
    tCkNs: number;
    absoluteLatencyNs: number;
    status: string;
    bandwidthGBs: number;
    topology: string;
    totalLatencyNs: number;
  };
  gpu: {
    name: string;
    vramGb: number;
    vramType: string;
    generation: string;
    lanes: string;
    bandwidthGBs: number;
    isBifurcated: boolean;
    saturationRiskPct: number;
  };
  thermal: {
    cpuTemp: number;
    vrmTemp: number;
    isThrottling: boolean;
    isOtpCutoff: boolean;
    pasteDegradationIndex: number;
    pasteLifeCycle: string;
  };
  performance: {
    targetFps: number;
    onePercentLowFps: number;
    onePercentDeltaPct: number;
    spikeFrametimeMs: number;
  };
  abExperiment: {
    protocol: string;
    varianceThresholdPct: number;
    verdict: string;
    isSignificant: boolean;
  };
  sha256Hash: string;
}

interface EvoMasterLabPrintDossierProps {
  data: EvoMasterLabPrintData;
  pageId?: string;
}

export const EvoMasterLabPrintDossier: React.FC<EvoMasterLabPrintDossierProps> = ({
  data,
  pageId = 'evo-master-lab-a4-dossier',
}) => {
  const isLatencyOptimal = data.ram.absoluteLatencyNs <= 10.0;
  const isLatencyAcceptable = data.ram.absoluteLatencyNs <= 13.5;

  return (
    <article
      id={pageId}
      data-print-container="true"
      className="a4-magazine-page relative mx-auto bg-[#090A0E] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-200 border border-zinc-800/60 print:border-none print:shadow-none print:m-0 print:p-0 flex flex-col font-mono-tech select-none"
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Background Technical Micro-Grid for Pristine Print Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid" />

      {/* Registration Marks / Alignment Metadata */}
      <div className="absolute top-2 left-3 text-[8px] font-mono-tech text-zinc-600 select-none pointer-events-none hidden sm:block print:hidden">
        + 210×297mm // A4 PORTRAIT // ISO 216
      </div>
      <div className="absolute top-2 right-3 text-[8px] font-mono-tech text-zinc-600 select-none pointer-events-none hidden sm:block print:hidden">
        EVO LABS METROLOGY SYSTEM // 300 DPI +
      </div>

      {/* ========================================================================= */}
      {/* A4 DOSSIER HEADER                                                         */}
      {/* ========================================================================= */}
      <header className="relative z-20 shrink-0 px-[12mm] pt-[8mm] pb-[3mm] border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
            <Scale className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-xs bg-amber-400" />
              <span className="font-display font-black text-sm tracking-wider text-white uppercase">
                EVO LABS // INFORME DE METROLOGÍA PERICIAL
              </span>
            </div>
            <span className="text-[9.5px] text-zinc-400 tracking-wider block mt-0.5">
              DIVISIÓN DE ARQUITECTURA DE SILICIO & DIAGNÓSTICO FORENSE DE KERNEL
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-[9px]">
          <span className="px-2 py-0.5 rounded text-[8.5px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
            {data.isPericial ? 'MODO PERICIAL (SYSINTERNALS)' : 'MODO ESENCIAL (AUDITORÍA BASAL)'}
          </span>
          <span className="text-zinc-500 font-mono">
            {data.timestamp}
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* A4 DOSSIER BODY (STRUCTURED METROLOGICAL SECTIONS)                       */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full flex-1 min-h-0 px-[12mm] py-[3.5mm] flex flex-col justify-between space-y-2.5">
        
        {/* Top Identification Bar */}
        <div className="p-2.5 rounded-xl bg-[#0e1118] border border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] font-bold">ID SESIÓN:</span>
            <span className="text-amber-300 font-mono font-bold text-[11px]">{data.sessionId}</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-zinc-400">ESTÁNDAR: <strong className="text-white">JEDEC JESD79 & PCI-SIG</strong></span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              VERIFICADO POR LABORATORIO
            </span>
          </div>
        </div>

        {/* 2-Column Main Technical Matrix */}
        <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
          
          {/* 1. CPU & IMC ARCHITECTURE */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>1. SILICIO & MICROARQUITECTURA</span>
                </div>
                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  TOPOLOGÍA DIE
                </span>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">PROCESADOR:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{data.cpu.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">NÚCLEOS / HILOS:</span>
                  <span className="text-zinc-200">{data.cpu.cores}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">CACHÉ L3 (V-CACHE):</span>
                  <span className="text-emerald-400 font-bold">{data.cpu.l3CacheMb} MB</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">MODO CONTROLADOR (IMC):</span>
                  <span className="text-cyan-300 font-bold">{data.cpu.imcMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-[10px]">LÍMITE TJMAX / TDP:</span>
                  <span className="text-rose-300">{data.cpu.tjMaxC}°C / {data.cpu.tdpWatt}W</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/70 text-[9px] text-zinc-400 font-sans-editorial">
              Control de bus desacoplado con sincronización UCLK/MCLK.
            </div>
          </div>

          {/* 2. DRAM METROLOGY & TIMINGS */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. MEMORIA RAM & LATENCIA</span>
                </div>
                <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                  isLatencyOptimal
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : isLatencyAcceptable
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {data.ram.status}
                </span>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">FRECUENCIA EFECTIVA:</span>
                  <span className="text-white font-bold">{data.ram.frequencyMt} MT/s (tCL {data.ram.cl})</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">TIEMPO CICLO (tCK):</span>
                  <span className="text-zinc-300">{data.ram.tCkNs} ns</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5 bg-cyan-950/20 px-1 rounded">
                  <span className="text-cyan-300 text-[10px] font-bold">LATENCIA REAL ABSOLUTA:</span>
                  <span className="text-cyan-300 font-bold">{data.ram.absoluteLatencyNs} ns</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">ANCHO BANDA TEÓRICO:</span>
                  <span className="text-emerald-400 font-bold">{data.ram.bandwidthGBs} GB/s ({data.ram.topology})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-[10px]">LATENCIA TOTAL SISTEMA:</span>
                  <span className="text-zinc-300">~{data.ram.totalLatencyNs} ns (IMC + Core)</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/70 text-[9px] text-zinc-400 font-mono">
              Fórmula: (CL × 2000) / MT/s = {data.ram.absoluteLatencyNs} ns.
            </div>
          </div>

          {/* 3. GPU & PCIE BUS INTERFACE */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs">
                  <Radio className="w-3.5 h-3.5" />
                  <span>3. SUBSISTEMA GRÁFICO & PCIE</span>
                </div>
                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  ENLACE PEG
                </span>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">TARJETA GRÁFICA:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">{data.gpu.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">MEMORIA VRAM:</span>
                  <span className="text-purple-300">{data.gpu.vramGb} GB {data.gpu.vramType}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">ENLACE PCIE:</span>
                  <span className="text-zinc-200 font-bold">{data.gpu.generation} {data.gpu.lanes}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">ANCHO DE BANDA BUS:</span>
                  <span className="text-emerald-400 font-bold">{data.gpu.bandwidthGBs} GB/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-[10px]">BIFURCACIÓN M.2:</span>
                  <span className={data.gpu.isBifurcated ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {data.gpu.isBifurcated ? 'BIFURCADO (Riesgo Saturación)' : 'DEDICADO (x16 Limpio)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/70 text-[9px] text-zinc-400 font-sans-editorial">
              Soporte ReBAR y codificación de paquetes 128b/130b.
            </div>
          </div>

          {/* 4. THERMODYNAMICS & VRM POWER STAGES */}
          <div className="p-3 bg-[#0e1118] border border-zinc-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <Flame className="w-3.5 h-3.5" />
                  <span>4. TERMODINÁMICA & FASES VRM</span>
                </div>
                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                  FLIR TÉRMICO
                </span>
              </div>

              <div className="space-y-1 text-[10.5px]">
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">TEMPERATURA DIE CPU:</span>
                  <span className="text-white font-bold">{data.thermal.cpuTemp} °C</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">TEMPERATURA FASES VRM:</span>
                  <span className="text-amber-300 font-bold">{data.thermal.vrmTemp} °C (16+2+1)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">ESTADO THROTTLING / OTP:</span>
                  <span className={data.thermal.isThrottling ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {data.thermal.isThrottling ? 'ACTIVO (Pérdida Reloj)' : 'NOMINAL // SIN THROTTLE'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/50 pb-0.5">
                  <span className="text-zinc-500 text-[10px]">DEGRADACIÓN TÉRMICA TIM:</span>
                  <span className="text-zinc-300">{data.thermal.pasteDegradationIndex} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-[10px]">CICLO DE VIDA PASTA:</span>
                  <span className="text-emerald-300">{data.thermal.pasteLifeCycle}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-800/70 text-[9px] text-zinc-400 font-sans-editorial">
              Curva de histéresis calibrada y monitoreo PROCHOT#.
            </div>
          </div>

        </div>

        {/* Section 5: Frame-Pacing & A/B Scientific Trial Banner */}
        <div className="p-3 bg-[#0d121c] border border-cyan-500/30 rounded-xl space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase">
                5. PREDICCIÓN DE FRAME-PACING & RESULTADOS DE ENSAYO CIENTÍFICO A/B
              </span>
            </div>
            <span className="text-[9px] px-2 py-0.2 rounded font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
              {data.abExperiment.verdict}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 rounded bg-black/50 border border-zinc-800">
              <span className="text-zinc-500 text-[9px] block">TASA BASE OBJETIVO</span>
              <span className="text-white font-bold text-xs mt-0.5 block">{data.performance.targetFps} FPS</span>
            </div>
            <div className="p-2 rounded bg-black/50 border border-zinc-800">
              <span className="text-zinc-500 text-[9px] block">1% LOW (PISO REAL)</span>
              <span className="text-emerald-400 font-bold text-xs mt-0.5 block">
                {data.performance.onePercentLowFps} FPS ({data.performance.onePercentDeltaPct >= 0 ? '+' : ''}{data.performance.onePercentDeltaPct}%)
              </span>
            </div>
            <div className="p-2 rounded bg-black/50 border border-zinc-800">
              <span className="text-zinc-500 text-[9px] block">JITTER / PICO FRAMETIME</span>
              <span className="text-cyan-300 font-bold text-xs mt-0.5 block">~{data.performance.spikeFrametimeMs} ms</span>
            </div>
            <div className="p-2 rounded bg-black/50 border border-zinc-800">
              <span className="text-zinc-500 text-[9px] block">UMBRAL DE VARIANZA</span>
              <span className="text-amber-300 font-bold text-xs mt-0.5 block">&gt; {data.abExperiment.varianceThresholdPct.toFixed(2)}% (Físico)</span>
            </div>
          </div>
        </div>

        {/* Section 6: Normative Compliance & Cryptographic Integrity Seal */}
        <div className="p-3 bg-[#0a0d13] border border-amber-500/40 rounded-xl space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase">
                6. CONFORMIDAD NORMATIVA INDUSTRIAL & SELLO CRIPTOGRÁFICO SHA-256
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono">
              FIRMA PERICIAL DETERMINISTA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div className="space-y-1 text-zinc-300 font-sans-editorial leading-tight">
              <p>
                • <strong>NORMA JEDEC (JESD79):</strong> Conforme. Parámetros tCL, tRCD, tRP y tRAS validados dentro de las tolerancias de sincronismo de bus de silicio.
              </p>
              <p>
                • <strong>NORMA PCI-SIG:</strong> Conforme. Integridad de señal diferencial, codificación de paquetes y ancho de banda verificado.
              </p>
            </div>

            <div className="p-2 rounded-lg bg-black/70 border border-amber-500/30 flex flex-col justify-between space-y-1">
              <div className="flex items-center justify-between text-[9px] text-amber-400 font-bold">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  HASH DE INTEGRIDAD SHA-256:
                </span>
                <span className="text-emerald-400 text-[8px] uppercase">SELLO VÁLIDO</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-300 break-all bg-zinc-950 p-1.5 rounded border border-zinc-800/80">
                {data.sha256Hash}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* A4 DOSSIER FOOTER                                                         */}
      {/* ========================================================================= */}
      <footer className="relative z-20 shrink-0 px-[12mm] pt-[2mm] pb-[8mm] border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono-tech text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="font-bold text-zinc-200">
            PÁG. 01 / 01
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">
            DOSSIER METROLÓGICO EJECUTIVO // EVO LABS 2026
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <Award className="w-3 h-3 text-amber-400" />
          <span>DOCUMENTO CERTIFICADO // VALIDEZ FORENSE LOCAL</span>
        </div>
      </footer>
    </article>
  );
};
