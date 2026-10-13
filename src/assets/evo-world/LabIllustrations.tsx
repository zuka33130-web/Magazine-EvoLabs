import React from 'react';

/**
 * EVO LABS // Vector Asset Library
 * Aesthetic: Industrial, Editorial, Hardware-Engineering, High-contrast, Graphite & EVO Yellow (#EAB308)
 */

export const EvoFanSvg: React.FC<{ size?: number; className?: string; speed?: 'normal' | 'slow' }> = ({
  size = 40,
  className = '',
  speed = 'normal',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${speed === 'slow' ? 'animate-evo-fan-slow' : 'animate-evo-fan'} ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="50" cy="50" r="16" fill="#18181b" stroke="#eab308" strokeWidth="2" />
    {/* 7 Curved aerodynamic blades */}
    {[0, 51.4, 102.8, 154.2, 205.6, 257, 308.4].map((angle, i) => (
      <path
        key={i}
        d="M50 50 C40 30, 42 12, 50 4 C58 12, 52 30, 50 50 Z"
        fill="#27272a"
        stroke="#52525b"
        strokeWidth="1.2"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    <circle cx="50" cy="50" r="6" fill="#eab308" />
  </svg>
);

export const EvoOpenPcWorkstationSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 400 260" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#27272a" />
        <stop offset="100%" stopColor="#121214" />
      </linearGradient>
      <linearGradient id="glowPcb" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#18181b" />
        <stop offset="100%" stopColor="#09090b" />
      </linearGradient>
      <linearGradient id="yellowBeam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(234, 179, 8, 0.8)" />
        <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
      </linearGradient>
    </defs>

    {/* Workbench Surface */}
    <rect x="20" y="220" width="360" height="24" rx="2" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />
    <line x1="40" y1="244" x2="40" y2="260" stroke="#3f3f46" strokeWidth="4" />
    <line x1="360" y1="244" x2="360" y2="260" stroke="#3f3f46" strokeWidth="4" />
    <line x1="20" y1="228" x2="380" y2="228" stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="3 3" />

    {/* Open Bench PC Chassis (Left/Center) */}
    <rect x="50" y="70" width="170" height="150" rx="4" fill="url(#glowPcb)" stroke="#3f3f46" strokeWidth="1.5" />
    <rect x="58" y="78" width="154" height="134" rx="2" fill="#111114" stroke="#27272a" strokeWidth="1" />

    {/* Motherboard Details & PCB traces */}
    <path d="M70 90 L120 90 L130 100 L130 130" stroke="#eab308" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
    <path d="M150 170 L190 170 L200 180" stroke="#eab308" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />

    {/* CPU Socket & Dual Heatpipe Cooler */}
    <rect x="85" y="100" width="46" height="46" rx="2" fill="#1f1f23" stroke="#eab308" strokeWidth="1.5" />
    <circle cx="108" cy="123" r="16" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
    {/* Inner spinning fan indicator */}
    <g transform="translate(108, 123)">
      <circle cx="0" cy="0" r="14" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="-10" y1="0" x2="10" y2="0" stroke="#eab308" strokeWidth="1.5" />
      <line x1="0" y1="-10" x2="0" y2="10" stroke="#eab308" strokeWidth="1.5" />
    </g>

    {/* RAM Slots (2 DIMMs with gold pins) */}
    <rect x="142" y="94" width="6" height="58" rx="1" fill="#27272a" stroke="#71717a" strokeWidth="1" />
    <rect x="152" y="94" width="6" height="58" rx="1" fill="#27272a" stroke="#eab308" strokeWidth="1" />
    <line x1="152" y1="120" x2="158" y2="120" stroke="#eab308" strokeWidth="1.5" />

    {/* PCIe Graphics Card with Backplate */}
    <rect x="70" y="160" width="130" height="28" rx="2" fill="url(#metalGrad)" stroke="#52525b" strokeWidth="1.2" />
    <line x1="80" y1="174" x2="180" y2="174" stroke="#eab308" strokeWidth="1" opacity="0.8" />
    <circle cx="100" cy="174" r="8" fill="#18181b" stroke="#71717a" strokeWidth="1" />
    <circle cx="150" cy="174" r="8" fill="#18181b" stroke="#71717a" strokeWidth="1" />

    {/* Power Cables braided with combs */}
    <path d="M190 140 C210 140, 220 180, 210 200" stroke="#eab308" strokeWidth="2.5" fill="none" opacity="0.9" />
    <path d="M186 144 C204 144, 214 180, 204 200" stroke="#71717a" strokeWidth="2" fill="none" />
    <path d="M182 148 C198 148, 208 180, 198 200" stroke="#3f3f46" strokeWidth="2" fill="none" />

    {/* Oscilloscope / Telemetry Monitor (Right) */}
    <rect x="238" y="50" width="136" height="120" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
    <rect x="246" y="58" width="120" height="84" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1" />
    
    {/* Oscilloscope grid & frametime waveform */}
    <line x1="246" y1="80" x2="366" y2="80" stroke="#27272a" strokeWidth="0.8" />
    <line x1="246" y1="100" x2="366" y2="100" stroke="#27272a" strokeWidth="0.8" />
    <line x1="246" y1="120" x2="366" y2="120" stroke="#27272a" strokeWidth="0.8" />
    <line x1="286" y1="58" x2="286" y2="142" stroke="#27272a" strokeWidth="0.8" />
    <line x1="326" y1="58" x2="326" y2="142" stroke="#27272a" strokeWidth="0.8" />

    {/* Oscilloscope wave trace */}
    <path
      d="M248 110 Q260 110, 268 76 T288 120 T308 95 T328 102 T348 70 T364 105"
      stroke="#eab308"
      strokeWidth="1.8"
      fill="none"
    />
    <circle cx="348" cy="70" r="2.5" fill="#eab308" />

    {/* Monitor buttons & knobs */}
    <circle cx="260" cy="154" r="4" fill="#27272a" stroke="#52525b" strokeWidth="1" />
    <circle cx="280" cy="154" r="4" fill="#27272a" stroke="#52525b" strokeWidth="1" />
    <rect x="306" y="152" width="20" height="5" rx="1" fill="#eab308" opacity="0.8" />
    <rect x="334" y="152" width="20" height="5" rx="1" fill="#3f3f46" />

    {/* Cable linking PC to Monitor */}
    <path d="M200 170 C220 170, 230 110, 246 110" stroke="#52525b" strokeWidth="2" strokeDasharray="3 2" fill="none" />

    {/* Screwdriver and Multimeter probe on the bench */}
    <line x1="70" y1="224" x2="110" y2="224" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="62" y="222" width="12" height="4" rx="1" fill="#eab308" />

    {/* Atmospheric lighting indicator */}
    <circle cx="356" cy="68" r="2" fill="#22c55e" />
    <text x="250" y="70" fill="#71717a" fontSize="6" fontFamily="monospace">EVO_CH1 16.6ms</text>
  </svg>
);

export const RestrictedDoorSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 240" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Heavy Industrial Frame */}
    <rect x="15" y="15" width="170" height="215" rx="4" fill="#141417" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="2.5" />
    
    {/* Outer Bolted Flange */}
    {[30, 70, 110, 150, 190].map((y, i) => (
      <React.Fragment key={i}>
        <circle cx="22" cy={y} r="2.5" fill="#27272a" stroke="#71717a" strokeWidth="1" />
        <circle cx="178" cy={y} r="2.5" fill="#27272a" stroke="#71717a" strokeWidth="1" />
      </React.Fragment>
    ))}

    {/* Double Blast Door Panels */}
    <rect x="28" y="28" width="68" height="190" fill="#1a1a1e" stroke="#27272a" strokeWidth="1.5" />
    <rect x="104" y="28" width="68" height="190" fill="#1a1a1e" stroke="#27272a" strokeWidth="1.5" />

    {/* Center High-Pressure Locking Seam */}
    <line x1="100" y1="28" x2="100" y2="218" stroke={isHovered ? '#eab308' : '#52525b'} strokeWidth="3" />

    {/* Hazard Warning Diagonal Stripes Header */}
    <rect x="36" y="38" width="128" height="18" fill="#111114" stroke="#3f3f46" strokeWidth="1" />
    <path
      d="M40 56 L48 38 M54 56 L62 38 M68 56 L76 38 M82 56 L90 38 M96 56 L104 38 M110 56 L118 38 M124 56 L132 38 M138 56 L146 38 M152 56 L160 38"
      stroke="#eab308"
      strokeWidth="2.5"
    />

    {/* Heavy Rotating Locking Wheel (Center) */}
    <circle cx="100" cy="120" r="28" fill="#18181b" stroke={isHovered ? '#eab308' : '#71717a'} strokeWidth="2.5" />
    <circle cx="100" cy="120" r="14" fill="#09090b" stroke="#eab308" strokeWidth="1.5" />
    {/* Wheel handles */}
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <line
        key={i}
        x1="100"
        y1="120"
        x2={100 + 26 * Math.cos((deg * Math.PI) / 180)}
        y2={120 + 26 * Math.sin((deg * Math.PI) / 180)}
        stroke={isHovered ? '#eab308' : '#71717a'}
        strokeWidth="2.5"
      />
    ))}

    {/* Keypad / Biometric / Status Console (Right side) */}
    <rect x="146" y="90" width="20" height="34" rx="2" fill="#09090b" stroke="#52525b" strokeWidth="1" />
    <circle cx="156" cy="100" r="4" fill="#ef4444" className={isHovered ? 'animate-pulse' : ''} />
    <rect x="150" y="110" width="12" height="2" fill="#71717a" />
    <rect x="150" y="114" width="12" height="2" fill="#71717a" />
    <rect x="150" y="118" width="12" height="2" fill="#71717a" />

    {/* Stencil Label: ZONA RESTRINGIDA */}
    <rect x="42" y="166" width="116" height="24" rx="2" fill="#121214" stroke="#27272a" strokeWidth="1" />
    <text
      x="100"
      y="178"
      textAnchor="middle"
      fill={isHovered ? '#eab308' : '#d4d4d8'}
      fontSize="7"
      fontWeight="bold"
      fontFamily="monospace"
      letterSpacing="1"
    >
      ACCESO RESTRINGIDO
    </text>
    <text
      x="100"
      y="186"
      textAnchor="middle"
      fill="#71717a"
      fontSize="6"
      fontFamily="monospace"
    >
      DESAFÍOS EVO
    </text>
  </svg>
);

export const ArchiveShelvesSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Archive Steel Cabinet Frame */}
    <rect x="20" y="20" width="160" height="160" rx="3" fill="#141417" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    
    {/* Shelf Dividers */}
    <line x1="20" y1="70" x2="180" y2="70" stroke="#3f3f46" strokeWidth="2" />
    <line x1="20" y1="120" x2="180" y2="120" stroke="#3f3f46" strokeWidth="2" />

    {/* Top Shelf: Tomos & Research Dossiers */}
    {/* Tomo 01: Golden highlight */}
    <rect x="30" y="28" width="16" height="40" rx="1" fill="#1f1f23" stroke="#eab308" strokeWidth="1.8" />
    <line x1="34" y1="36" x2="42" y2="36" stroke="#eab308" strokeWidth="2" />
    <text x="38" y="58" textAnchor="middle" fill="#eab308" fontSize="8" fontWeight="bold" fontFamily="monospace">01</text>

    {/* Other Tomos (02, 03, blueprints) */}
    <rect x="49" y="32" width="14" height="36" rx="1" fill="#18181b" stroke="#52525b" strokeWidth="1" />
    <text x="56" y="58" textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">02</text>

    <rect x="65" y="34" width="14" height="34" rx="1" fill="#18181b" stroke="#52525b" strokeWidth="1" />
    <text x="72" y="58" textAnchor="middle" fill="#71717a" fontSize="7" fontFamily="monospace">03</text>

    {/* Technical Binder Folders */}
    <path d="M84 66 L98 66 L104 38 L90 38 Z" fill="#27272a" stroke="#52525b" strokeWidth="1" />
    <path d="M106 66 L120 66 L124 34 L110 34 Z" fill="#222226" stroke="#3f3f46" strokeWidth="1" />
    <rect x="130" y="30" width="38" height="38" rx="2" fill="#121214" stroke="#3f3f46" strokeWidth="1" />
    <circle cx="149" cy="49" r="8" stroke="#eab308" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />

    {/* Middle Shelf: Hardware Blueprint Rolls & Microfilm Cases */}
    <rect x="30" y="78" width="80" height="38" rx="2" fill="#111114" stroke="#27272a" strokeWidth="1" />
    <path d="M36 86 L60 86 M36 94 L80 94 M36 102 L70 102" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
    {/* Blueprint roll */}
    <ellipse cx="130" cy="98" rx="6" ry="14" fill="#27272a" stroke="#eab308" strokeWidth="1" />
    <rect x="130" y="84" width="36" height="28" fill="#1a1a1e" stroke="#52525b" strokeWidth="1" />
    <ellipse cx="166" cy="98" rx="6" ry="14" fill="#1f1f23" stroke="#eab308" strokeWidth="1" />

    {/* Bottom Shelf: Forensic Evidence Dossiers */}
    <rect x="30" y="128" width="40" height="46" rx="2" fill="#1a1a1e" stroke="#52525b" strokeWidth="1" />
    <rect x="36" y="136" width="28" height="6" fill="#eab308" opacity="0.8" />
    <line x1="36" y1="150" x2="62" y2="150" stroke="#71717a" strokeWidth="1" />
    <line x1="36" y1="158" x2="56" y2="158" stroke="#71717a" strokeWidth="1" />

    <rect x="76" y="128" width="40" height="46" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
    <line x1="82" y1="140" x2="108" y2="140" stroke="#52525b" strokeWidth="1" />
    <line x1="82" y1="148" x2="102" y2="148" stroke="#52525b" strokeWidth="1" />

    <rect x="122" y="128" width="46" height="46" rx="2" fill="#111114" stroke="#27272a" strokeWidth="1" />
    <circle cx="145" cy="151" r="10" stroke="#22c55e" strokeWidth="1.2" />
    <path d="M141 151 L144 154 L150 148" stroke="#22c55e" strokeWidth="1.5" />
  </svg>
);

export const CircuitDiagnosticSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Diagnostic Screen Frame */}
    <rect x="15" y="15" width="170" height="170" rx="4" fill="#121215" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    
    {/* Incident Triage Timeline */}
    <line x1="30" y1="50" x2="170" y2="50" stroke="#27272a" strokeWidth="2" />
    {/* Timeline nodes */}
    <circle cx="50" cy="50" r="5" fill="#22c55e" />
    <circle cx="90" cy="50" r="5" fill="#22c55e" />
    <circle cx="130" cy="50" r="6" fill="#ef4444" stroke="#fecaca" strokeWidth="1.5" className="animate-pulse" />
    <line x1="130" y1="58" x2="130" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />

    {/* Magnifying Glass / Forensic Analysis Target */}
    <circle cx="85" cy="115" r="28" stroke={isHovered ? '#eab308' : '#71717a'} strokeWidth="2" fill="#18181b" />
    <line x1="106" y1="136" x2="135" y2="165" stroke={isHovered ? '#eab308' : '#71717a'} strokeWidth="5" strokeLinecap="round" />

    {/* Inspected microchip under the glass */}
    <rect x="74" y="104" width="22" height="22" fill="#27272a" stroke="#eab308" strokeWidth="1.2" />
    <circle cx="78" cy="108" r="1.5" fill="#eab308" />
    {/* Traces */}
    <line x1="68" y1="110" x2="74" y2="110" stroke="#eab308" strokeWidth="1" />
    <line x1="68" y1="118" x2="74" y2="118" stroke="#eab308" strokeWidth="1" />
    <line x1="96" y1="110" x2="102" y2="110" stroke="#ef4444" strokeWidth="1" />
    <line x1="96" y1="118" x2="102" y2="118" stroke="#52525b" strokeWidth="1" />

    {/* Alert Banner */}
    <rect x="30" y="145" width="60" height="20" rx="2" fill="#27272a" stroke="#ef4444" strokeWidth="1" />
    <text x="36" y="158" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily="monospace">! ANOMALÍA</text>
  </svg>
);

export const PerformanceBenchSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="170" height="170" rx="4" fill="#121215" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    
    {/* Tachometer / Clock Meter Arc */}
    <path
      d="M50 110 A45 45 0 0 1 150 110"
      stroke="#27272a"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 110 A45 45 0 0 1 130 72"
      stroke={isHovered ? '#eab308' : '#ca8a04'}
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    <text x="100" y="98" textAnchor="middle" fill="#f4f4f5" fontSize="16" fontWeight="bold" fontFamily="monospace">5.4</text>
    <text x="100" y="112" textAnchor="middle" fill="#eab308" fontSize="8" fontFamily="monospace">GHz PEAK</text>

    {/* Frametime & Latency Chart below */}
    <rect x="30" y="125" width="140" height="45" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1" />
    <path
      d="M34 155 L50 152 L65 142 L80 156 L95 138 L110 144 L125 136 L140 148 L155 132 L166 140"
      stroke="#22c55e"
      strokeWidth="1.5"
      fill="none"
    />
    <line x1="30" y1="145" x2="170" y2="145" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />
    <text x="36" y="136" fill="#71717a" fontSize="6" fontFamily="monospace">1% LOW: 142 FPS</text>
  </svg>
);

export const ExperimentsBenchSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="170" height="170" rx="4" fill="#121215" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />

    {/* Station A (Baseline) */}
    <rect x="28" y="40" width="60" height="85" rx="2" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
    <text x="58" y="55" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontWeight="bold" fontFamily="monospace">RUN A</text>
    <rect x="38" y="65" width="40" height="24" rx="1" fill="#09090b" stroke="#27272a" strokeWidth="1" />
    <text x="58" y="80" textAnchor="middle" fill="#a1a1aa" fontSize="8" fontFamily="monospace">68°C</text>
    <line x1="38" y1="102" x2="78" y2="102" stroke="#52525b" strokeWidth="3" />

    {/* VS Isolation Bridge / Delta Display */}
    <circle cx="100" cy="82" r="12" fill="#09090b" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    <text x="100" y="86" textAnchor="middle" fill="#eab308" fontSize="8" fontWeight="bold" fontFamily="monospace">Δ</text>

    {/* Station B (Modified Variable) */}
    <rect x="112" y="40" width="60" height="85" rx="2" fill="#1c1917" stroke="#eab308" strokeWidth="1.5" />
    <text x="142" y="55" textAnchor="middle" fill="#eab308" fontSize="9" fontWeight="bold" fontFamily="monospace">RUN B</text>
    <rect x="122" y="65" width="40" height="24" rx="1" fill="#09090b" stroke="#ca8a04" strokeWidth="1" />
    <text x="142" y="80" textAnchor="middle" fill="#22c55e" fontSize="8" fontFamily="monospace">59°C</text>
    <line x1="122" y1="102" x2="162" y2="102" stroke="#22c55e" strokeWidth="3" />

    {/* Delta Verdict Bar */}
    <rect x="30" y="140" width="140" height="26" rx="2" fill="#18181b" stroke="#27272a" strokeWidth="1" />
    <text x="100" y="156" textAnchor="middle" fill={isHovered ? '#eab308' : '#d4d4d8'} fontSize="8" fontWeight="bold" fontFamily="monospace">
      -9°C DELTA // 1 VARIABLE
    </text>
  </svg>
);

export const MachineWorkshopSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="170" height="170" rx="4" fill="#121215" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    
    {/* PowerShell Terminal Screen */}
    <rect x="28" y="32" width="144" height="90" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1.2" />
    <rect x="28" y="32" width="144" height="14" fill="#18181b" />
    <circle cx="36" cy="39" r="2.5" fill="#ef4444" />
    <circle cx="44" cy="39" r="2.5" fill="#eab308" />
    <circle cx="52" cy="39" r="2.5" fill="#22c55e" />
    <text x="64" y="42" fill="#71717a" fontSize="6" fontFamily="monospace">pwsh // evo-collector.ps1</text>
    
    {/* Script code lines */}
    <text x="36" y="60" fill="#3b82f6" fontSize="7" fontFamily="monospace">Get-CimInstance</text>
    <text x="100" y="60" fill="#eab308" fontSize="7" fontFamily="monospace">Win32_Perf</text>
    <text x="36" y="72" fill="#a1a1aa" fontSize="7" fontFamily="monospace">| Where-Object Clock -gt 4200</text>
    <text x="36" y="84" fill="#22c55e" fontSize="7" fontFamily="monospace">&gt; telemetry.json</text>
    <rect x="106" y="77" width="5" height="9" fill="#eab308" className="animate-pulse" />

    {/* Hardware Tools Bench Below */}
    <rect x="30" y="132" width="140" height="38" rx="2" fill="#18181b" stroke="#27272a" strokeWidth="1" />
    {/* Microcontroller development board */}
    <rect x="40" y="140" width="30" height="22" rx="1" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
    <circle cx="46" cy="146" r="2" fill="#f59e0b" />
    <rect x="52" y="144" width="14" height="14" fill="#0f172a" stroke="#64748b" strokeWidth="0.8" />
    
    {/* Soldering Iron */}
    <line x1="90" y1="156" x2="135" y2="144" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
    <line x1="135" y1="144" x2="152" y2="140" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PersonalDeskSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="170" height="170" rx="4" fill="#121215" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    
    {/* Open Dossier / Passport */}
    <rect x="35" y="40" width="60" height="80" rx="2" fill="#1c1917" stroke="#ca8a04" strokeWidth="1.5" />
    <rect x="42" y="48" width="46" height="14" fill="#292524" />
    <text x="65" y="58" textAnchor="middle" fill="#eab308" fontSize="7" fontWeight="bold" fontFamily="monospace">PASAPORTE</text>
    <rect x="42" y="68" width="18" height="22" fill="#09090b" stroke="#52525b" strokeWidth="1" />
    <path d="M46 86 C46 80, 56 80, 56 86" fill="#71717a" />
    <circle cx="51" cy="76" r="4" fill="#71717a" />
    <line x1="64" y1="72" x2="84" y2="72" stroke="#a1a1aa" strokeWidth="1.5" />
    <line x1="64" y1="78" x2="80" y2="78" stroke="#71717a" strokeWidth="1" />
    <line x1="64" y1="84" x2="82" y2="84" stroke="#71717a" strokeWidth="1" />

    {/* Secondary PC / Rig Specs Card */}
    <rect x="105" y="40" width="60" height="80" rx="2" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
    <text x="135" y="54" textAnchor="middle" fill="#f4f4f5" fontSize="7" fontWeight="bold" fontFamily="monospace">RIG #01</text>
    <circle cx="135" cy="75" r="14" stroke="#eab308" strokeWidth="1.5" fill="#09090b" />
    <text x="135" y="78" textAnchor="middle" fill="#eab308" fontSize="8" fontWeight="bold" fontFamily="monospace">OK</text>
    <text x="135" y="105" textAnchor="middle" fill="#71717a" fontSize="6" fontFamily="monospace">7 CAPS LISTOS</text>

    {/* Coffee Mug & Stylus */}
    <circle cx="50" cy="148" r="8" fill="#27272a" stroke="#52525b" strokeWidth="1" />
    <circle cx="50" cy="148" r="6" fill="#18181b" />
    <rect x="75" y="142" width="70" height="14" rx="2" fill="#09090b" stroke="#27272a" strokeWidth="1" />
    <text x="110" y="152" textAnchor="middle" fill="#eab308" fontSize="7" fontFamily="monospace">OPERADOR ACTIVO</text>
  </svg>
);

export const CommunityHallSvg: React.FC<{ className?: string; isHovered?: boolean }> = ({
  className = '',
  isHovered = false,
}) => (
  <svg viewBox="0 0 200 200" className={`w-full h-auto ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="170" height="170" rx="4" fill="#121215" stroke={isHovered ? '#eab308' : '#3f3f46'} strokeWidth="1.5" />
    
    {/* Network Nodes Grid */}
    {/* Central Hub */}
    <circle cx="100" cy="90" r="14" fill="#18181b" stroke={isHovered ? '#eab308' : '#ca8a04'} strokeWidth="2" />
    <text x="100" y="93" textAnchor="middle" fill="#eab308" fontSize="7" fontWeight="bold" fontFamily="monospace">EVO</text>

    {/* Satellite Nodes */}
    <circle cx="50" cy="60" r="8" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
    <circle cx="150" cy="60" r="8" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
    <circle cx="45" cy="125" r="8" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
    <circle cx="155" cy="125" r="8" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />

    {/* Connection lines */}
    <line x1="88" y1="84" x2="56" y2="65" stroke="#3f3f46" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="112" y1="84" x2="144" y2="65" stroke="#3f3f46" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="88" y1="96" x2="51" y2="120" stroke="#3f3f46" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="112" y1="96" x2="149" y2="120" stroke="#3f3f46" strokeWidth="1.2" strokeDasharray="2 2" />

    {/* Live verified cases ticker */}
    <rect x="30" y="148" width="140" height="22" rx="2" fill="#18181b" stroke="#27272a" strokeWidth="1" />
    <circle cx="42" cy="159" r="3" fill="#22c55e" className="animate-pulse" />
    <text x="52" y="162" fill="#d4d4d8" fontSize="7" fontFamily="monospace">2,840 EXPEDIENTES COMPARTIDOS</text>
  </svg>
);
