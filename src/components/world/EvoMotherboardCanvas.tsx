import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  Flame,
  Radio,
  Eye,
  Crosshair,
  Gauge,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Monitor,
  Volume2,
  ShieldAlert,
} from 'lucide-react';
import { UserHardwarePassport } from '../../types';

interface EvoMotherboardCanvasProps {
  passport: UserHardwarePassport | null;
  onSelectComponent: (componentId: string, name: string, detail: string) => void;
  activeOverlay: 'default' | 'thermal' | 'signals' | 'power';
  setActiveOverlay: (overlay: 'default' | 'thermal' | 'signals' | 'power') => void;
  activeLoadProfile?: 'idle' | 'shaders' | 'gaming' | 'torture';
  pcieConfig?: {
    generation: 'Gen 3' | 'Gen 4' | 'Gen 5';
    lanes: 'x4' | 'x8' | 'x16';
    isBifurcatedWithM2: boolean;
  };
}

export const EvoMotherboardCanvas: React.FC<EvoMotherboardCanvasProps> = ({
  passport,
  onSelectComponent,
  activeOverlay,
  setActiveOverlay,
  activeLoadProfile: externalLoadProfile,
  pcieConfig: externalPcieConfig,
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [pulseTick, setPulseTick] = useState<number>(0);

  // Dynamic simulation controls when integrated or standalone
  const [internalLoadProfile, setInternalLoadProfile] = useState<'idle' | 'shaders' | 'gaming' | 'torture'>('gaming');
  const [internalPcieGen, setInternalPcieGen] = useState<'Gen 3' | 'Gen 4' | 'Gen 5'>('Gen 4');
  const [internalPcieLanes, setInternalPcieLanes] = useState<'x4' | 'x8' | 'x16'>('x16');
  const [internalIsBifurcated, setInternalIsBifurcated] = useState<boolean>(false);

  const activeLoad = externalLoadProfile || internalLoadProfile;
  const pcieGen = externalPcieConfig?.generation || internalPcieGen;
  const pcieLanes = externalPcieConfig?.lanes || internalPcieLanes;
  const isBifurcated = externalPcieConfig?.isBifurcatedWithM2 !== undefined ? externalPcieConfig.isBifurcatedWithM2 : internalIsBifurcated;

  // Stroboscopic saturation condition: PCIe x8 or x4 with bifurcated NVMe SSD
  const isPcieSaturated = isBifurcated && (pcieLanes === 'x8' || pcieLanes === 'x4');

  // Thermal state calculations derived from physics of silicon
  const thermalProfile = {
    idle: {
      cpuTemp: 38,
      vrmTemp: 44,
      dieColor: '#10b981', // verde-azulado
      dieGlow: '#059669',
      vrmColor: '#059669',
      label: 'IDLE / REPOSO (38°C)',
      description: 'Carga básica de escritorio: Núcleos en C-States C6/C7 con consumo < 18W.'
    },
    shaders: {
      cpuTemp: 68,
      vrmTemp: 64,
      dieColor: '#f59e0b', // ámbar
      dieGlow: '#d97706',
      vrmColor: '#d97706',
      label: 'COMPILACIÓN SHADERS (68°C)',
      description: 'Carga media multihilo AVX2 en precarga de assets: Clocks a 4.8 GHz sostenidos.'
    },
    gaming: {
      cpuTemp: 76,
      vrmTemp: 72,
      dieColor: '#f97316', // naranja
      dieGlow: '#ea580c',
      vrmColor: '#ea580c',
      label: 'GAMING 144Hz (76°C)',
      description: 'Carga típica de juego competitivo con frametime < 6.9 ms y ráfagas monohilo.'
    },
    torture: {
      cpuTemp: 96,
      vrmTemp: 98,
      dieColor: '#ef4444', // rojo incandescente
      dieGlow: '#dc2626',
      vrmColor: '#b91c1c',
      label: 'TORTURA 100% AVX-512 (96°C+)',
      description: 'Carga sintética máxima: Thermal throttling inminente y fases VRM al límite de disipación.'
    }
  }[activeLoad];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const cpuName = passport?.cpuModel || 'CPU LGA1700 / AM5 CORE';
  const ramInfo = passport?.ramCapacityGb ? `${passport.ramCapacityGb} GB DDR5` : 'DDR5 DUAL-CHANNEL';
  const gpuInfo = passport?.gpuModel || `PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} DIRECT LINK`;

  return (
    <div className="relative w-full rounded-2xl bg-[#07090e] border-2 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono-tech select-none">
      {/* Top HUD Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0d1017] border-b border-zinc-800/90 text-xs z-20 relative">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs shadow-[0_0_10px_#facc15] animate-pulse" />
          <span className="font-bold text-white tracking-wider">
            ESQUEMÁTICO PCB FORENSE // RECORRIDO DE SILICIO
          </span>
          <span className="text-zinc-600 hidden sm:inline">//</span>
          <span className="text-amber-400 text-[11px] hidden sm:inline">
            CAPA DE COBRE DE 8 NIVELES (2oz COPPER PCB)
          </span>
        </div>

        {/* Diagnostic Overlay Selector & Context Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Overlay Mode */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveOverlay('default')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeOverlay === 'default'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>ESTRUCTURAL</span>
            </button>

            <button
              onClick={() => setActiveOverlay('thermal')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeOverlay === 'thermal'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-zinc-400 hover:text-rose-400'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span>TÉRMICO (FLIR)</span>
            </button>

            <button
              onClick={() => setActiveOverlay('signals')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeOverlay === 'signals'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-cyan-300'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>BUS DE SEÑALES</span>
            </button>

            <button
              onClick={() => setActiveOverlay('power')}
              className={`px-2.5 py-1 rounded text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeOverlay === 'power'
                  ? 'bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : 'text-zinc-400 hover:text-emerald-300'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>RIELES DE VOLTAJE</span>
            </button>
          </div>

          {/* Thermal Load Selector when in Thermal Overlay */}
          {activeOverlay === 'thermal' && (
            <div className="flex items-center gap-1 bg-rose-950/30 p-1 rounded-lg border border-rose-500/40 text-[10px]">
              <span className="text-rose-400 font-bold px-1.5 hidden sm:inline">CARGA:</span>
              {(['idle', 'shaders', 'gaming', 'torture'] as const).map((load) => (
                <button
                  key={load}
                  onClick={() => setInternalLoadProfile(load)}
                  className={`px-2 py-0.5 rounded font-bold uppercase transition-all cursor-pointer ${
                    activeLoad === load
                      ? 'bg-rose-500 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {load === 'idle'
                    ? '38°C Idle'
                    : load === 'shaders'
                    ? '68°C Shaders'
                    : load === 'gaming'
                    ? '76°C 144Hz'
                    : '96°C Tortura'}
                </button>
              ))}
            </div>
          )}

          {/* PCIe Bus Configurator when in Signals Overlay */}
          {activeOverlay === 'signals' && (
            <div className="flex items-center gap-1.5 bg-cyan-950/30 p-1 rounded-lg border border-cyan-500/40 text-[10px]">
              <span className="text-cyan-400 font-bold px-1 hidden sm:inline">BUS:</span>
              <select
                value={pcieGen}
                onChange={(e) => setInternalPcieGen(e.target.value as any)}
                className="bg-black/80 text-cyan-300 border border-cyan-500/30 rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-hidden"
              >
                <option value="Gen 3">Gen 3</option>
                <option value="Gen 4">Gen 4</option>
                <option value="Gen 5">Gen 5</option>
              </select>

              <select
                value={pcieLanes}
                onChange={(e) => setInternalPcieLanes(e.target.value as any)}
                className="bg-black/80 text-amber-300 border border-amber-500/30 rounded px-1.5 py-0.5 text-[10px] font-bold focus:outline-hidden"
              >
                <option value="x16">x16 Carriles</option>
                <option value="x8">x8 Carriles</option>
                <option value="x4">x4 Carriles</option>
              </select>

              <button
                type="button"
                onClick={() => setInternalIsBifurcated(!isBifurcated)}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer border ${
                  isBifurcated
                    ? 'bg-red-500/20 text-red-300 border-red-500 animate-pulse'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                }`}
                title="Simular SSD NVMe ocupando carriles bifurcados del bus PCIe principal"
              >
                {isBifurcated ? '⚡ M.2 BIFURCADO' : 'M.2 DEDICADO'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Circuit Stage */}
      <div className="relative w-full aspect-[16/10] min-h-[460px] sm:min-h-[560px] p-4 sm:p-8 bg-[#080a10] flex items-center justify-center overflow-hidden">
        {/* PCB Background Traces & Silk Screen Grid */}
        <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/10 via-transparent to-amber-950/10 pointer-events-none" />

        {/* Master SVG Circuit Board Diagram */}
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full max-h-[580px] drop-shadow-2xl z-10"
        >
          <defs>
            {/* Gradients for Motherboard Highlights */}
            <linearGradient id="vrmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2230" />
              <stop offset="100%" stopColor="#111420" />
            </linearGradient>
            <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#252a38" />
              <stop offset="100%" stopColor="#141724" />
            </linearGradient>
            <linearGradient id="goldBus" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="cyanBus" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a5f3fc" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="thermalHeat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            {/* Pulsating Filter Glow */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ========================================================================= */}
          {/* PCB BOARD BASE OUTLINE                                                    */}
          {/* ========================================================================= */}
          <rect
            x="40"
            y="20"
            width="920"
            height="580"
            rx="16"
            fill="#090c14"
            stroke="#1f293d"
            strokeWidth="3"
          />

          {/* Motherboard Corner Mounting Screws */}
          {[
            [65, 45],
            [935, 45],
            [65, 575],
            [935, 575],
            [500, 45],
            [500, 575],
          ].map(([cx, cy], idx) => (
            <g key={idx}>
              <circle cx={cx} cy={cy} r="9" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="4" fill="#090c14" />
              <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#64748b" strokeWidth="1.5" />
              <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#64748b" strokeWidth="1.5" />
            </g>
          ))}

          {/* ========================================================================= */}
          {/* BUS LINES & SIGNAL PATHWAYS (PCIE, MEMORY, POWER)                        */}
          {/* ========================================================================= */}
          {/* CPU to RAM Buses (Channels A and B) */}
          <g className="opacity-70">
            <path
              d="M 450 170 L 590 170 L 590 110 L 610 110"
              fill="none"
              stroke={activeOverlay === 'signals' ? '#06b6d4' : '#334155'}
              strokeWidth={activeOverlay === 'signals' ? '3' : '2'}
              strokeDasharray={activeOverlay === 'signals' ? '6,3' : 'none'}
            />
            <path
              d="M 450 200 L 590 200 L 590 190 L 610 190"
              fill="none"
              stroke={activeOverlay === 'signals' ? '#06b6d4' : '#334155'}
              strokeWidth={activeOverlay === 'signals' ? '3' : '2'}
              strokeDasharray={activeOverlay === 'signals' ? '6,3' : 'none'}
            />
            <path
              d="M 450 230 L 590 230 L 590 270 L 610 270"
              fill="none"
              stroke={activeOverlay === 'signals' ? '#06b6d4' : '#334155'}
              strokeWidth={activeOverlay === 'signals' ? '3' : '2'}
              strokeDasharray={activeOverlay === 'signals' ? '6,3' : 'none'}
            />
          </g>

          {/* CPU to Primary PCIe Slot 1 (Dynamic Lanes: x16, x8 or x4) */}
          <g className="opacity-85">
            {/* Lane set 0-3 (Always present in x4, x8, x16) */}
            <path
              d="M 330 320 L 330 390 L 220 390 L 220 420"
              fill="none"
              stroke={
                isPcieSaturated
                  ? '#ef4444'
                  : activeOverlay === 'signals'
                  ? pcieGen === 'Gen 5'
                    ? '#a855f7'
                    : pcieGen === 'Gen 4'
                    ? '#f59e0b'
                    : '#06b6d4'
                  : '#334155'
              }
              strokeWidth={activeOverlay === 'signals' || isPcieSaturated ? '4' : '2.5'}
              strokeDasharray={
                isPcieSaturated
                  ? '4,2'
                  : activeOverlay === 'signals'
                  ? '8,4'
                  : 'none'
              }
              filter={activeOverlay === 'signals' || isPcieSaturated ? 'url(#glow)' : undefined}
              className={isPcieSaturated ? 'animate-pulse' : undefined}
            />

            {/* Lane set 4-7 (Present in x8, x16) */}
            {(pcieLanes === 'x8' || pcieLanes === 'x16') && (
              <path
                d="M 350 320 L 350 395 L 240 395 L 240 420"
                fill="none"
                stroke={
                  isPcieSaturated
                    ? '#ef4444'
                    : activeOverlay === 'signals'
                    ? pcieGen === 'Gen 5'
                      ? '#a855f7'
                      : pcieGen === 'Gen 4'
                      ? '#f59e0b'
                      : '#06b6d4'
                    : '#334155'
                }
                strokeWidth={activeOverlay === 'signals' || isPcieSaturated ? '3.5' : '2'}
                strokeDasharray={isPcieSaturated ? '4,2' : activeOverlay === 'signals' ? '8,4' : 'none'}
                className={isPcieSaturated ? 'animate-pulse' : undefined}
              />
            )}

            {/* Lane set 8-15 (Dedicated to x16 when not bifurcated) */}
            {pcieLanes === 'x16' && !isBifurcated && (
              <path
                d="M 370 320 L 370 400 L 260 400 L 260 420"
                fill="none"
                stroke={
                  activeOverlay === 'signals'
                    ? pcieGen === 'Gen 5'
                      ? '#a855f7'
                      : pcieGen === 'Gen 4'
                      ? '#f59e0b'
                      : '#06b6d4'
                    : '#334155'
                }
                strokeWidth={activeOverlay === 'signals' ? '4' : '2.5'}
                strokeDasharray={activeOverlay === 'signals' ? '8,4' : 'none'}
              />
            )}

            {/* Bifurcation Borrowed Route from PCIe x16 slot to M.2 slot */}
            {isBifurcated && (
              <path
                d="M 370 320 L 370 345 L 340 345 L 340 355"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeDasharray="3,3"
                className="animate-pulse"
                filter="url(#glow)"
              />
            )}
          </g>

          {/* CPU to Primary NVMe M.2 Slot */}
          <path
            d="M 350 320 L 350 350 L 500 350 L 500 370"
            fill="none"
            stroke={activeOverlay === 'signals' ? '#10b981' : '#334155'}
            strokeWidth="3"
            strokeDasharray={activeOverlay === 'signals' ? '5,3' : 'none'}
          />

          {/* DMI Link: CPU to Chipset PCH */}
          <path
            d="M 420 320 L 420 460 L 680 460 L 680 470"
            fill="none"
            stroke={activeOverlay === 'signals' ? '#a855f7' : '#334155'}
            strokeWidth="3.5"
            strokeDasharray={activeOverlay === 'signals' ? '7,4' : 'none'}
          />

          {/* Power Rails from VRM to Socket */}
          {activeOverlay === 'power' && (
            <g className="animate-pulse">
              <path
                d="M 230 140 L 290 140"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 230 200 L 290 200"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 230 260 L 290 260"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 350 80 L 350 140"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ========================================================================= */}
          {/* COMPONENT: REAR I/O & AUDIO SHIELD                                       */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'io_shield',
                'Panel Trasero I/O & DPC Audio Isolation',
                'Zona de conectividad de periféricos, códec de audio aislado y latencia USB. Los controladores de audio defectuosos generan picos en Ring 0 (DPC Latency).'
              )
            }
            onMouseEnter={() => setHoveredPart('io')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer transition-all"
          >
            <rect
              x="60"
              y="40"
              width="80"
              height="300"
              rx="8"
              fill="#131722"
              stroke={hoveredPart === 'io' ? '#facc15' : '#2d3748'}
              strokeWidth="2"
            />
            <text x="75" y="70" fill="#94a3b8" fontSize="10" fontWeight="bold" transform="rotate(90, 75, 70)">
              REAR I/O SHIELD & PORTS
            </text>
            {/* Audio Isolation Line */}
            <path
              d="M 60 360 L 140 360 L 140 540 L 60 540"
              fill="#0d111a"
              stroke={activeOverlay === 'signals' ? '#ef4444' : '#f59e0b'}
              strokeWidth="2"
              strokeDasharray="4,2"
            />
            <text x="70" y="450" fill="#f59e0b" fontSize="9" fontWeight="bold">
              AUDIO DPC ISOLATION
            </text>
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: VRM POWER PHASES (16+2+1 DIGITAL HEATSINK)                    */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'vrm_phases',
                `Etapas de Potencia VRM (16+2+1 Fases) - ${thermalProfile.vrmTemp}°C`,
                `Transforma los 12V de la fuente a voltajes ultraestables para el silicio. Temperatura actual estimada: ${thermalProfile.vrmTemp}°C bajo perfil ${thermalProfile.label}. Si el disipador supera los 105°C, la placa madre activa VRM Thermal Throttling de emergencia.`
              )
            }
            onMouseEnter={() => setHoveredPart('vrm')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            {/* Top VRM Heatsink */}
            <rect
              x="280"
              y="45"
              width="180"
              height="45"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.vrmColor : 'url(#vrmGrad)'}
              stroke={hoveredPart === 'vrm' ? '#facc15' : '#3b4252'}
              strokeWidth="2"
            />
            {/* Left VRM Heatsink */}
            <rect
              x="160"
              y="100"
              width="65"
              height="200"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.vrmColor : 'url(#vrmGrad)'}
              stroke={hoveredPart === 'vrm' ? '#facc15' : '#3b4252'}
              strokeWidth="2"
            />
            <text x="175" y="190" fill="#e2e8f0" fontSize="10" fontWeight="bold" transform="rotate(90, 175, 190)">
              {activeOverlay === 'thermal' ? `VRM: ${thermalProfile.vrmTemp}°C` : 'VRM POWER STAGES'}
            </text>
            <text x="310" y="72" fill="#cbd5e1" fontSize="10" fontWeight="bold">
              {activeOverlay === 'thermal' ? `16+2+1 PHASES (${thermalProfile.vrmTemp}°C)` : '16+2+1 PHASES'}
            </text>
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: CENTRAL CPU SOCKET (AM5 / LGA1700)                            */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'cpu_socket',
                `CPU Principal: ${cpuName} (${thermalProfile.cpuTemp}°C)`,
                `Microarquitectura central bajo carga ${thermalProfile.label}. Temperatura estimada del die: ${thermalProfile.cpuTemp}°C. ${thermalProfile.description}`
              )
            }
            onMouseEnter={() => setHoveredPart('cpu')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            {/* Outer Retention Bracket */}
            <rect
              x="280"
              y="130"
              width="170"
              height="170"
              rx="8"
              fill="url(#cpuGrad)"
              stroke={hoveredPart === 'cpu' ? '#facc15' : '#4b5563'}
              strokeWidth={hoveredPart === 'cpu' ? '3' : '2'}
            />

            {/* Silicon Die Center */}
            <rect
              x="315"
              y="165"
              width="100"
              height="100"
              rx="4"
              fill={activeOverlay === 'thermal' ? thermalProfile.dieColor : '#0c0f17'}
              stroke={activeOverlay === 'thermal' ? thermalProfile.dieGlow : '#eab308'}
              strokeWidth={activeOverlay === 'thermal' ? '3' : '2'}
              filter={activeOverlay === 'thermal' ? 'url(#glow)' : undefined}
            />

            {/* Internal Micro-Capacitors */}
            <circle cx="340" cy="190" r="4" fill="#64748b" />
            <circle cx="390" cy="190" r="4" fill="#64748b" />
            <circle cx="340" cy="240" r="4" fill="#64748b" />
            <circle cx="390" cy="240" r="4" fill="#64748b" />

            <text x="330" y="215" fill="#fef08a" fontSize="11" fontWeight="bold">
              SOCKET
            </text>
            <text x="325" y="230" fill={activeOverlay === 'thermal' ? '#ffffff' : '#94a3b8'} fontSize="9" fontWeight="bold">
              {activeOverlay === 'thermal' ? `DIE: ${thermalProfile.cpuTemp}°C` : 'DIE INTEGRADO'}
            </text>
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: 4x DDR5 RAM SLOTS (A1, A2, B1, B2)                            */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'ram_slots',
                `Bancos de Memoria RAM: ${ramInfo}`,
                'Ranuras DIMM conectadas al bus de 128-bit del CPU. La colocación correcta en slots 2 y 4 (A2/B2) garantiza el modo Dual Channel y la integridad de señal a altas frecuencias XMP/EXPO.'
              )
            }
            onMouseEnter={() => setHoveredPart('ram')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            {[
              { id: 'A1', x: 610, active: false, label: 'SLOT 1 (A1)' },
              { id: 'A2', x: 635, active: true, label: 'SLOT 2 (A2) ✓' },
              { id: 'B1', x: 660, active: false, label: 'SLOT 3 (B1)' },
              { id: 'B2', x: 685, active: true, label: 'SLOT 4 (B2) ✓' },
            ].map((slot) => (
              <g key={slot.id}>
                <rect
                  x={slot.x}
                  y="70"
                  width="16"
                  height="250"
                  rx="3"
                  fill={slot.active ? (activeOverlay === 'thermal' ? '#ea580c' : '#1e2538') : '#0f121a'}
                  stroke={hoveredPart === 'ram' ? '#facc15' : slot.active ? '#3b82f6' : '#27272a'}
                  strokeWidth="1.5"
                />
                <text
                  x={slot.x + 11}
                  y="180"
                  fill={slot.active ? '#93c5fd' : '#52525b'}
                  fontSize="8"
                  fontWeight="bold"
                  transform={`rotate(90, ${slot.x + 11}, 180)`}
                >
                  {slot.label}
                </text>
              </g>
            ))}
            <text x="610" y="55" fill="#facc15" fontSize="10" fontWeight="bold">
              DDR5 CHANNELS A / B
            </text>
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: M.2 NVME PRIMARY SLOT WITH HEATSINK                           */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'm2_nvme',
                'Slot M.2 NVMe PCIe 4.0/5.0 x4 (Heatsink de Aluminio)',
                'Conectado directamente a las 4 líneas PCIe dedicadas del procesador sin pasar por el chipset. Latencia de acceso inferior a 0.05 ms.'
              )
            }
            onMouseEnter={() => setHoveredPart('m2')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            <rect
              x="260"
              y="340"
              width="240"
              height="35"
              rx="4"
              fill={activeOverlay === 'thermal' ? '#c2410c' : '#181e2b'}
              stroke={hoveredPart === 'm2' ? '#facc15' : '#334155'}
              strokeWidth="2"
            />
            <text x="280" y="362" fill="#38bdf8" fontSize="10" fontWeight="bold">
              M.2 NVMe Gen4/5 (42°C HEATSINK)
            </text>
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: PRIMARY PCIE GEN 5 x16 REINFORCED SLOT                        */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'pcie_slot',
                `Ranura Gráfica ${pcieGen} ${pcieLanes}: ${gpuInfo}`,
                isPcieSaturated
                  ? `¡ALERTA CRÍTICA DE SATURACIÓN! Ranura operando en ${pcieLanes} con SSD M.2 bifurcado activo. El bus está perdiendo hasta un 65% de ancho de banda efectivo. Mueve el SSD a un slot PCH para recuperar x16 nativo.`
                  : `Ranura operando en ${pcieGen} ${pcieLanes}. Conexión física directa al CPU con latencia ultra-baja y soporte ReBAR.`
              )
            }
            onMouseEnter={() => setHoveredPart('pcie')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            <rect
              x="180"
              y="410"
              width="340"
              height="30"
              rx="4"
              fill={
                isPcieSaturated
                  ? '#dc2626'
                  : activeOverlay === 'thermal'
                  ? '#b45309'
                  : '#182030'
              }
              stroke={
                isPcieSaturated
                  ? '#f87171'
                  : hoveredPart === 'pcie'
                  ? '#facc15'
                  : '#eab308'
              }
              strokeWidth={isPcieSaturated ? '3' : '2'}
              className={isPcieSaturated ? 'animate-pulse' : undefined}
            />
            <text x="200" y="430" fill={isPcieSaturated ? '#ffffff' : '#facc15'} fontSize="10" fontWeight="bold">
              {isPcieSaturated
                ? `⚠️ PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} // ¡SATURADO POR BIFURCACIÓN M.2!`
                : `PCIe ${pcieGen.replace('Gen ', '')}.0 ${pcieLanes} SAFE-SLOT (REBAR ACTIVO)`}
            </text>

            {/* Stroboscopic Warning Indicator Beacon for PCIe Saturation */}
            {isPcieSaturated && (
              <g className="animate-ping">
                <circle cx="505" cy="425" r="8" fill="#ef4444" opacity="0.8" />
                <circle cx="505" cy="425" r="4" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* Secondary PCIe Slot */}
          <g className="opacity-60">
            <rect x="180" y="500" width="340" height="24" rx="4" fill="#10141d" stroke="#334155" strokeWidth="1.5" />
            <text x="200" y="516" fill="#64748b" fontSize="9">
              PCIe 4.0 x4 (VÍA CHIPSET PCH)
            </text>
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: CHIPSET PCH HEATSINK (Z790 / B650 / X670)                     */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'chipset_pch',
                'Chipset PCH (Platform Controller Hub)',
                'El distribuidor secundario de la placa. Controla puertos SATA, puertos USB secundarios, interfaz de red Ethernet/WiFi y slots PCIe auxiliares vía enlace DMI.'
              )
            }
            onMouseEnter={() => setHoveredPart('pch')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            <rect
              x="620"
              y="430"
              width="140"
              height="120"
              rx="8"
              fill={activeOverlay === 'thermal' ? '#b45309' : '#1a202c'}
              stroke={hoveredPart === 'pch' ? '#facc15' : '#475569'}
              strokeWidth="2"
            />
            <text x="645" y="485" fill="#f8fafc" fontSize="11" fontWeight="bold">
              CHIPSET PCH
            </text>
            <text x="645" y="505" fill="#94a3b8" fontSize="9">
              DMI 4.0 x8 LINK
            </text>
            <circle cx="730" cy="455" r="4" fill="#eab308" />
          </g>

          {/* ========================================================================= */}
          {/* COMPONENT: 24-PIN ATX MAIN POWER CONNECTOR                               */}
          {/* ========================================================================= */}
          <g
            onClick={() =>
              onSelectComponent(
                'atx_24pin',
                'Conector Principal ATX 24 Pines',
                'Alimenta la lógica de la placa, chipset, buses de memoria y circuitos auxiliares de 12V, 5V y 3.3V.'
              )
            }
            onMouseEnter={() => setHoveredPart('atx')}
            onMouseLeave={() => setHoveredPart(null)}
            className="cursor-pointer"
          >
            <rect
              x="775"
              y="110"
              width="35"
              height="180"
              rx="4"
              fill={activeOverlay === 'power' ? '#10b981' : '#141824'}
              stroke={hoveredPart === 'atx' ? '#facc15' : '#334155'}
              strokeWidth="2"
            />
            <text x="798" y="210" fill="#10b981" fontSize="9" fontWeight="bold" transform="rotate(90, 798, 210)">
              24-PIN ATX POWER
            </text>
          </g>

          {/* SATA Ports Array */}
          <g className="opacity-70">
            <rect x="800" y="440" width="30" height="50" rx="3" fill="#111520" stroke="#334155" />
            <rect x="800" y="500" width="30" height="50" rx="3" fill="#111520" stroke="#334155" />
            <text x="840" y="475" fill="#64748b" fontSize="8">
              4x SATA 6Gb/s
            </text>
          </g>
        </svg>

        {/* Live Overlay Legend Watermark */}
        <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-zinc-800 text-[11px]">
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-zinc-400">
            MODO:{' '}
            <strong className="text-amber-400 uppercase">
              {activeOverlay === 'default'
                ? 'TOPOLOGÍA ESTRUCTURAL'
                : activeOverlay === 'thermal'
                ? 'GRADIENTE TÉRMICO FLIR'
                : activeOverlay === 'signals'
                ? 'PAQUETES DE BUS DE ALTA VELOCIDAD'
                : 'DISTRIBUCIÓN DE RIELES DE POTENCIA'}
            </strong>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 hidden sm:inline">
            HACÉ CLIC EN CUALQUIER COMPONENTE PARA ABRIR SU EXPEDIENTE FORENSE
          </span>
        </div>
      </div>
    </div>
  );
};
