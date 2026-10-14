// EVO LABS // PORTADAS TÉCNICAS OFICIALES 01 - 12
// Totalmente originales, sin marcas externas, con temática visual pericial única para cada Tomo.

function createCoverSvg({
  tomoNum,
  title,
  subtitle,
  themeColor,
  accentColor,
  secondaryColor,
  graphicSvg,
  specTag,
  categoryBadge,
}: {
  tomoNum: string;
  title: string;
  subtitle: string;
  themeColor: string;
  accentColor: string;
  secondaryColor: string;
  graphicSvg: string;
  specTag: string;
  categoryBadge: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 600" width="420" height="600">
  <defs>
    <linearGradient id="bgGrad_${tomoNum}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07090e" />
      <stop offset="50%" stop-color="#0c111a" />
      <stop offset="100%" stop-color="#05070a" />
    </linearGradient>
    <linearGradient id="accentGrad_${tomoNum}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${themeColor}" />
      <stop offset="100%" stop-color="${accentColor}" />
    </linearGradient>
    <radialGradient id="glow_${tomoNum}" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${themeColor}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="${themeColor}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid_${tomoNum}" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${themeColor}" stroke-width="0.5" stroke-opacity="0.12" />
    </pattern>
  </defs>

  <!-- Background Layer -->
  <rect width="420" height="600" fill="url(#bgGrad_${tomoNum})" />
  <rect width="420" height="600" fill="url(#grid_${tomoNum})" />
  <circle cx="210" cy="240" r="180" fill="url(#glow_${tomoNum})" />

  <!-- Outer Frame & Corner Brackets -->
  <rect x="14" y="14" width="392" height="572" fill="none" stroke="${themeColor}" stroke-width="1.2" stroke-opacity="0.35" rx="6" />
  <rect x="18" y="18" width="384" height="564" fill="none" stroke="#27272a" stroke-width="0.75" rx="4" />
  
  <!-- Corner Tech Accents -->
  <path d="M 14 34 L 14 14 L 34 14" fill="none" stroke="${themeColor}" stroke-width="3" />
  <path d="M 406 34 L 406 14 L 386 14" fill="none" stroke="${themeColor}" stroke-width="3" />
  <path d="M 14 566 L 14 586 L 34 586" fill="none" stroke="${themeColor}" stroke-width="3" />
  <path d="M 406 566 L 406 586 L 386 586" fill="none" stroke="${themeColor}" stroke-width="3" />

  <!-- Top Header Band -->
  <rect x="30" y="30" width="360" height="24" fill="#090d14" rx="3" stroke="${themeColor}" stroke-width="0.8" stroke-opacity="0.3" />
  <text x="42" y="46" fill="${themeColor}" font-family="monospace, monospace" font-size="10" font-weight="900" letter-spacing="2">EVO LABS // DOSSIER PERICIAL</text>
  <text x="378" y="46" text-anchor="end" fill="#71717a" font-family="monospace, monospace" font-size="9" letter-spacing="1">EDICIÓN 2026</text>

  <!-- Large Tomo Number Watermark -->
  <text x="375" y="150" text-anchor="end" fill="${themeColor}" font-family="sans-serif" font-weight="900" font-size="76" fill-opacity="0.12">${tomoNum}</text>

  <!-- Volume Badge & Category -->
  <rect x="30" y="66" width="76" height="20" fill="${themeColor}" rx="2" />
  <text x="68" y="80" text-anchor="middle" fill="#05070a" font-family="monospace, monospace" font-size="11" font-weight="900" letter-spacing="1">TOMO ${tomoNum}</text>

  <rect x="112" y="66" width="200" height="20" fill="#18181b" rx="2" stroke="#27272a" stroke-width="1" />
  <text x="122" y="80" fill="${secondaryColor}" font-family="monospace, monospace" font-size="9.5" font-weight="700" letter-spacing="1">${categoryBadge}</text>

  <!-- Center Artwork -->
  <g transform="translate(30, 105)">
    ${graphicSvg}
  </g>

  <!-- Title & Subtitle Container -->
  <rect x="30" y="410" width="360" height="120" fill="#0b0f17" fill-opacity="0.95" rx="4" stroke="${themeColor}" stroke-width="1" stroke-opacity="0.4" />
  <line x1="30" y1="410" x2="390" y2="410" stroke="url(#accentGrad_${tomoNum})" stroke-width="2.5" />
  
  <text x="44" y="442" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="900" letter-spacing="0.5">${title}</text>
  <text x="44" y="468" fill="${themeColor}" font-family="sans-serif" font-size="10.5" font-weight="700" letter-spacing="0.5">${subtitle}</text>
  <text x="44" y="502" fill="#a1a1aa" font-family="sans-serif" font-size="8.5" font-weight="400">METROLOGÍA DETERMINISTA · RIGOR FORENSE · LAB INTERACTIVO</text>

  <!-- Bottom Spec & Status Bar -->
  <line x1="30" y1="540" x2="390" y2="540" stroke="#27272a" stroke-width="1" />
  <circle cx="42" cy="558" r="3.5" fill="${themeColor}" />
  <text x="52" y="562" fill="#e4e4e7" font-family="monospace, monospace" font-size="9" font-weight="700">${specTag}</text>
  <text x="378" y="562" text-anchor="end" fill="${themeColor}" font-family="monospace, monospace" font-size="9" font-weight="700">EVO CERTIFIED</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Artwork for each Tomo
export const TOMO_01_COVER = '/covers/tomo-01-final.png';

export const TOMO_02_COVER = '/covers/tomo-02.jpg';

export const TOMO_03_COVER = createCoverSvg({
  tomoNum: '03',
  title: 'REPARACIÓN DE PC',
  subtitle: 'DIAGNÓSTICO DEDUCTIVO & LÍNEAS DE PODER ATX',
  themeColor: '#10b981',
  accentColor: '#34d399',
  secondaryColor: '#a7f3d0',
  categoryBadge: 'BANCO DE TALLER & DESCARTE',
  specTag: 'MULTÍMETRO ATX // +12V +5V +3.3V',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#10b981" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Multimeter Dial & Power Rail Meter -->
    <rect x="90" y="30" width="180" height="150" fill="#06281e" stroke="#10b981" stroke-width="2" rx="10" />
    <rect x="110" y="48" width="140" height="60" fill="#021a13" stroke="#059669" stroke-width="1.5" rx="4" />
    <text x="180" y="86" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="24" font-weight="bold">12.08 V</text>
    <text x="180" y="102" text-anchor="middle" fill="#10b981" font-family="monospace" font-size="9">ATX 12V RAIL — OK</text>
    
    <!-- Probes & Connectors -->
    <circle cx="140" cy="145" r="10" fill="#111827" stroke="#ef4444" stroke-width="2" />
    <circle cx="140" cy="145" r="4" fill="#ef4444" />
    <circle cx="220" cy="145" r="10" fill="#111827" stroke="#111827" stroke-width="2" />
    <circle cx="220" cy="145" r="4" fill="#6b7280" />
    
    <!-- Motherboard 24-Pin ATX Schematic at bottom -->
    <rect x="50" y="205" width="260" height="65" fill="#061f18" stroke="#10b981" stroke-width="1.2" rx="4" />
    <text x="60" y="222" fill="#34d399" font-family="monospace" font-size="9" font-weight="bold">24-PIN ATX MAIN CONNECTOR</text>
    <path d="M 60 235 H 300" stroke="#047857" stroke-width="1" stroke-dasharray="2,2" />
    <text x="60" y="255" fill="#a7f3d0" font-family="monospace" font-size="8">PIN 9: +5VSB | PIN 14: PS_ON# | PIN 8: PWR_OK</text>
  `,
});

export const TOMO_04_COVER = createCoverSvg({
  tomoNum: '04',
  title: 'REPARACIÓN DE NOTEBOOKS',
  subtitle: 'DESMONTAJE SEGURO, POWER RAILS & BUS eDP',
  themeColor: '#a855f7',
  accentColor: '#c084fc',
  secondaryColor: '#e9d5ff',
  categoryBadge: 'MICRO-ELECTRÓNICA PORTÁTIL',
  specTag: 'DC-JACK 19.5V // eDP 30/40-PIN // BATT',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Laptop Chassis Wireframe Isometric -->
    <path d="M 60 120 L 180 50 L 300 120 L 180 190 Z" fill="#1e1035" stroke="#a855f7" stroke-width="2" />
    <path d="M 60 120 L 60 135 L 180 205 L 300 135 L 300 120" fill="none" stroke="#a855f7" stroke-width="1.5" />
    <path d="M 180 190 L 180 205" stroke="#a855f7" stroke-width="1.5" />
    
    <!-- Open Screen Angle -->
    <path d="M 60 120 L 60 30 L 180 -10 L 180 50" fill="#2e1055" fill-opacity="0.5" stroke="#c084fc" stroke-width="1.5" />
    
    <!-- Power Rail Traces -->
    <rect x="50" y="220" width="260" height="55" fill="#150a26" stroke="#a855f7" stroke-width="1" rx="4" />
    <text x="60" y="238" fill="#c084fc" font-family="monospace" font-size="9" font-weight="bold">POWER STAGE SEQUENCE</text>
    <text x="60" y="258" fill="#e9d5ff" font-family="monospace" font-size="8">VIN (19V) → 3.3V/5V ALWAYS → S5 → S3 → S0</text>
  `,
});

export const TOMO_05_COVER = createCoverSvg({
  tomoNum: '05',
  title: 'REDES & TELECOMUNICACIONES',
  subtitle: 'TCP/UDP, ENRUTAMIENTO, WIRESHARK & BUFFERBLOAT',
  themeColor: '#0ea5e9',
  accentColor: '#38bdf8',
  secondaryColor: '#bae6fd',
  categoryBadge: 'INFRAESTRUCTURA & TRÁFICO',
  specTag: 'WIRESHARK FORENSIC // RTT & JITTER',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#0ea5e9" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Network Topology Nodes -->
    <circle cx="180" cy="70" r="22" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" />
    <text x="180" y="74" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold">WAN</text>
    
    <circle cx="90" cy="160" r="18" fill="#082f49" stroke="#0ea5e9" stroke-width="1.5" />
    <text x="90" y="164" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="8" font-weight="bold">ROUTER</text>
    
    <circle cx="270" cy="160" r="18" fill="#082f49" stroke="#0ea5e9" stroke-width="1.5" />
    <text x="270" y="164" text-anchor="middle" fill="#bae6fd" font-family="monospace" font-size="8" font-weight="bold">GATEWAY</text>
    
    <circle cx="180" cy="220" r="20" fill="#075985" stroke="#38bdf8" stroke-width="2" />
    <text x="180" y="224" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">LOCAL PC</text>
    
    <!-- Linking Lines -->
    <line x1="180" y1="92" x2="90" y2="142" stroke="#0ea5e9" stroke-width="2" />
    <line x1="180" y1="92" x2="270" y2="142" stroke="#0ea5e9" stroke-width="2" />
    <line x1="90" y1="178" x2="180" y2="200" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />
    <line x1="270" y1="178" x2="180" y2="200" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />
    
    <!-- Packet Bar -->
    <rect x="50" y="255" width="260" height="24" fill="#082f49" rx="3" stroke="#0ea5e9" stroke-width="1" />
    <text x="60" y="271" fill="#7dd3fc" font-family="monospace" font-size="8">FRAME: ETH → IPv4 → TCP [SYN, ACK] → PAYLOAD</text>
  `,
});

export const TOMO_06_COVER = createCoverSvg({
  tomoNum: '06',
  title: 'CIBERSEGURIDAD',
  subtitle: 'RING 0 DEFENSE, SANDBOXING & AUDITORÍA',
  themeColor: '#ef4444',
  accentColor: '#f87171',
  secondaryColor: '#fecaca',
  categoryBadge: 'HARDENING & DEFENSA ACTIVA',
  specTag: 'MEM INTEGRITY // SANDBOX ISOLATION',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#ef4444" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Security Shield Emblem -->
    <path d="M 180 40 L 260 75 V 150 C 260 205 180 240 180 240 C 180 240 100 205 100 150 V 75 Z" fill="#2a0a0e" stroke="#ef4444" stroke-width="2.5" />
    <path d="M 180 60 L 240 85 V 145 C 240 185 180 215 180 215 C 180 215 120 185 120 145 V 85 Z" fill="#450a0a" stroke="#f87171" stroke-width="1.5" />
    
    <!-- Lock / Keyhole in Center -->
    <circle cx="180" cy="125" r="14" fill="#ef4444" />
    <rect x="175" y="125" width="10" height="22" fill="#ef4444" rx="2" />
    
    <text x="180" y="180" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="10" font-weight="bold">DEFENSE ACTIVE</text>
    
    <!-- Matrix of Security Checks at Bottom -->
    <rect x="50" y="255" width="260" height="24" fill="#1c0a0c" rx="3" stroke="#ef4444" stroke-width="1" />
    <text x="60" y="271" fill="#fca5a5" font-family="monospace" font-size="8">VBS / HVCI: ENABLED | PROCESS ACL: ENFORCED</text>
  `,
});

export const TOMO_07_COVER = createCoverSvg({
  tomoNum: '07',
  title: 'GAMING PRO / RENDIMIENTO',
  subtitle: 'METROLOGÍA DE FRAMETIMES, 1% LOW & INPUT LAG',
  themeColor: '#f97316',
  accentColor: '#fb923c',
  secondaryColor: '#ffedd5',
  categoryBadge: 'METROLOGÍA & COMPETICIÓN',
  specTag: 'FRAMETIME 0.01ms // 1% LOW PERCENTILES',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Frametime Graph Axis -->
    <line x1="50" y1="40" x2="50" y2="210" stroke="#7c2d12" stroke-width="1.5" />
    <line x1="50" y1="210" x2="320" y2="210" stroke="#7c2d12" stroke-width="1.5" />
    
    <!-- Grid Marks -->
    <line x1="50" y1="90" x2="320" y2="90" stroke="#431407" stroke-width="1" stroke-dasharray="2,2" />
    <text x="35" y="93" fill="#ea580c" font-family="monospace" font-size="7">16.6ms</text>
    <line x1="50" y1="150" x2="320" y2="150" stroke="#431407" stroke-width="1" stroke-dasharray="2,2" />
    <text x="35" y="153" fill="#ea580c" font-family="monospace" font-size="7">6.94ms</text>
    
    <!-- Consistent Frametime Curve vs Stutter Spike -->
    <path d="M 50 150 Q 100 148 140 150 T 200 150 L 210 70 L 220 150 Q 260 152 320 150" fill="none" stroke="#f97316" stroke-width="2.5" />
    
    <text x="210" y="58" text-anchor="middle" fill="#ef4444" font-family="monospace" font-size="8" font-weight="bold">STUTTER SPIKE</text>
    <circle cx="210" cy="70" r="4" fill="#ef4444" />
    
    <!-- Metrics Readout at Bottom -->
    <rect x="50" y="235" width="260" height="44" fill="#1c0d06" rx="4" stroke="#f97316" stroke-width="1" />
    <text x="60" y="252" fill="#fb923c" font-family="monospace" font-size="9" font-weight="bold">AVG: 144.2 FPS | 1% LOW: 118.6 FPS</text>
    <text x="60" y="268" fill="#ffedd5" font-family="monospace" font-size="8">STUTTER INDEX: 0.12% | INPUT LAG: 4.8 ms</text>
  `,
});

export const TOMO_08_COVER = createCoverSvg({
  tomoNum: '08',
  title: 'ARRANQUE Y DIAGNÓSTICO',
  subtitle: 'DEL BOTÓN POWER A WINDOWS // 9 FASES BOOT',
  themeColor: '#059669',
  accentColor: '#10b981',
  secondaryColor: '#a7f3d0',
  categoryBadge: 'SECUENCIA DE ENCENDIDO & BOOT',
  specTag: 'POST // UEFI NVRAM // WINLOAD.EFI',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#059669" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- 9 Step Timeline Diagram -->
    <path d="M 60 60 H 300 V 130 H 60 V 200 H 300" fill="none" stroke="#047857" stroke-width="2" />
    
    <!-- Stage Nodes -->
    <circle cx="60" cy="60" r="10" fill="#065f46" stroke="#10b981" stroke-width="2" />
    <text x="60" y="64" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">1</text>
    <text x="80" y="64" fill="#34d399" font-family="monospace" font-size="8">PWR_OK</text>
    
    <circle cx="180" cy="60" r="10" fill="#065f46" stroke="#10b981" stroke-width="2" />
    <text x="180" y="64" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">2</text>
    <text x="200" y="64" fill="#34d399" font-family="monospace" font-size="8">RESET#</text>
    
    <circle cx="300" cy="60" r="10" fill="#065f46" stroke="#10b981" stroke-width="2" />
    <text x="300" y="64" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">3</text>
    
    <circle cx="180" cy="130" r="10" fill="#065f46" stroke="#10b981" stroke-width="2" />
    <text x="180" y="134" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">5</text>
    <text x="200" y="134" fill="#34d399" font-family="monospace" font-size="8">UEFI INIT</text>
    
    <circle cx="300" cy="200" r="12" fill="#10b981" stroke="#a7f3d0" stroke-width="2" />
    <text x="300" y="204" text-anchor="middle" fill="#052e16" font-family="monospace" font-size="8" font-weight="bold">9</text>
    <text x="230" y="204" fill="#a7f3d0" font-family="monospace" font-size="8" font-weight="bold">KERNEL RUN</text>
    
    <!-- Diagnostic Box -->
    <rect x="50" y="235" width="260" height="44" fill="#052e16" rx="4" stroke="#059669" stroke-width="1" />
    <text x="60" y="252" fill="#34d399" font-family="monospace" font-size="9" font-weight="bold">SECURE BOOT &amp; BCD PARSING</text>
    <text x="60" y="268" fill="#d1fae5" font-family="monospace" font-size="8">NVRAM HANDOFF → HAL INIT → NT EXECUTIVE</text>
  `,
});

export const TOMO_09_COVER = createCoverSvg({
  tomoNum: '09',
  title: 'PROGRAMACIÓN DESDE CERO',
  subtitle: 'LÓGICA COMPUTACIONAL, TYPESCRIPT & AUTOMATIZACIÓN',
  themeColor: '#22c55e',
  accentColor: '#4ade80',
  secondaryColor: '#bbf7d0',
  categoryBadge: 'INGENIERÍA DE SOFTWARE & SCRIPTS',
  specTag: 'TYPESCRIPT // PYTHON // AST & APIs',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#22c55e" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Code Editor Terminal Mockup -->
    <rect x="40" y="30" width="280" height="190" fill="#091811" stroke="#22c55e" stroke-width="1.5" rx="6" />
    
    <!-- Window controls -->
    <circle cx="56" cy="45" r="4" fill="#ef4444" />
    <circle cx="70" cy="45" r="4" fill="#eab308" />
    <circle cx="84" cy="45" r="4" fill="#22c55e" />
    <text x="180" y="48" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="8">evo-forensics.ts</text>
    <line x1="40" y1="58" x2="320" y2="58" stroke="#14532d" stroke-width="1" />
    
    <!-- Code Lines -->
    <text x="55" y="80" fill="#4ade80" font-family="monospace" font-size="8.5"><tspan fill="#38bdf8">const</tspan> sample = <tspan fill="#facc15">await</tspan> telemetry.<tspan fill="#60a5fa">capture</tspan>();</text>
    <text x="55" y="100" fill="#4ade80" font-family="monospace" font-size="8.5"><tspan fill="#38bdf8">if</tspan> (sample.dpcLatencyUs &gt; <tspan fill="#f87171">15.0</tspan>) {</text>
    <text x="70" y="120" fill="#4ade80" font-family="monospace" font-size="8.5">logger.<tspan fill="#fbbf24">warn</tspan>(<tspan fill="#a3e635">'DPC Spike detected'</tspan>);</text>
    <text x="70" y="140" fill="#4ade80" font-family="monospace" font-size="8.5">engine.<tspan fill="#60a5fa">isolateThread</tspan>(sample.culprit);</text>
    <text x="55" y="160" fill="#4ade80" font-family="monospace" font-size="8.5">}</text>
    <text x="55" y="185" fill="#86efac" font-family="monospace" font-size="8.5"><tspan fill="#38bdf8">return</tspan> engine.<tspan fill="#60a5fa">generateReport</tspan>();</text>
    
    <!-- Status readout -->
    <rect x="50" y="240" width="260" height="38" fill="#052e16" rx="4" stroke="#22c55e" stroke-width="1" />
    <text x="60" y="256" fill="#86efac" font-family="monospace" font-size="9" font-weight="bold">TSC COMPILATION: 0 ERRORS</text>
    <text x="60" y="270" fill="#bbf7d0" font-family="monospace" font-size="8">STRICT TYPE CHECKING · DETERMINISTIC EXECUTION</text>
  `,
});

export const TOMO_10_COVER = createCoverSvg({
  tomoNum: '10',
  title: 'PROMPT E IA AVANZADA',
  subtitle: 'INGENIERÍA DE CONTEXTO, RAG & AGENTES',
  themeColor: '#8b5cf6',
  accentColor: '#a78bfa',
  secondaryColor: '#ddd6fe',
  categoryBadge: 'INTELIGENCIA ARTIFICIAL PERICIAL',
  specTag: 'ZERO-SLOP PROMPT // DETERMINISTIC RAG',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#8b5cf6" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Neural Network Node Grid -->
    <g stroke="#6d28d9" stroke-width="1.2" stroke-opacity="0.6">
      <line x1="70" y1="80" x2="180" y2="60" />
      <line x1="70" y1="140" x2="180" y2="140" />
      <line x1="70" y1="200" x2="180" y2="220" />
      <line x1="180" y1="60" x2="290" y2="100" />
      <line x1="180" y1="140" x2="290" y2="140" />
      <line x1="180" y1="220" x2="290" y2="180" />
    </g>
    
    <!-- Input Layer -->
    <circle cx="70" cy="80" r="10" fill="#2e1065" stroke="#a78bfa" stroke-width="2" />
    <circle cx="70" cy="140" r="10" fill="#2e1065" stroke="#a78bfa" stroke-width="2" />
    <circle cx="70" cy="200" r="10" fill="#2e1065" stroke="#a78bfa" stroke-width="2" />
    <text x="40" y="144" fill="#a78bfa" font-family="monospace" font-size="8">PROMPT</text>
    
    <!-- Hidden / Context Layer -->
    <circle cx="180" cy="60" r="14" fill="#4c1d95" stroke="#c084fc" stroke-width="2" />
    <circle cx="180" cy="140" r="16" fill="#581c87" stroke="#c084fc" stroke-width="2.5" />
    <text x="180" y="144" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">RAG</text>
    <circle cx="180" cy="220" r="14" fill="#4c1d95" stroke="#c084fc" stroke-width="2" />
    
    <!-- Output / Agent Layer -->
    <circle cx="290" cy="100" r="12" fill="#6d28d9" stroke="#ddd6fe" stroke-width="2" />
    <circle cx="290" cy="140" r="14" fill="#7c3aed" stroke="#ffffff" stroke-width="2.5" />
    <text x="290" y="144" text-anchor="middle" fill="#ffffff" font-family="monospace" font-size="8" font-weight="bold">ACT</text>
    <circle cx="290" cy="180" r="12" fill="#6d28d9" stroke="#ddd6fe" stroke-width="2" />
    
    <!-- Agent Metric Readout -->
    <rect x="50" y="245" width="260" height="36" fill="#1e113a" rx="4" stroke="#8b5cf6" stroke-width="1" />
    <text x="60" y="260" fill="#c084fc" font-family="monospace" font-size="9" font-weight="bold">TEMPERATURE: 0.0 // CONTEXT: 128K</text>
    <text x="60" y="273" fill="#ddd6fe" font-family="monospace" font-size="8">STRUCTURED OUTPUT JSON SCHEMA VERIFIED</text>
  `,
});

export const TOMO_11_COVER = createCoverSvg({
  tomoNum: '11',
  title: 'ELECTRÓNICA APLICADA',
  subtitle: 'VRM, BUCK CONVERTERS, MOSFETs & OSCILOSCOPIO',
  themeColor: '#eab308',
  accentColor: '#facc15',
  secondaryColor: '#fef08a',
  categoryBadge: 'MICRO-ELECTRÓNICA & POTENCIA',
  specTag: 'VRM DrMOS // LEY DE OHM // 0.001Ω',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#eab308" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- Buck Converter Circuit Diagram -->
    <rect x="60" y="50" width="70" height="60" fill="#1c1917" stroke="#eab308" stroke-width="1.5" rx="4" />
    <text x="95" y="75" text-anchor="middle" fill="#facc15" font-family="monospace" font-size="8" font-weight="bold">HIGH-SIDE</text>
    <text x="95" y="92" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="8">MOSFET</text>
    
    <rect x="60" y="140" width="70" height="60" fill="#1c1917" stroke="#eab308" stroke-width="1.5" rx="4" />
    <text x="95" y="165" text-anchor="middle" fill="#facc15" font-family="monospace" font-size="8" font-weight="bold">LOW-SIDE</text>
    <text x="95" y="182" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="8">MOSFET</text>
    
    <!-- Inductor Choke -->
    <path d="M 160 125 Q 175 105 190 125 Q 205 105 220 125 Q 235 105 250 125" fill="none" stroke="#eab308" stroke-width="3" />
    <text x="205" y="98" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="8">CHOKE (L1)</text>
    
    <!-- Output Capacitor -->
    <line x1="280" y1="105" x2="280" y2="145" stroke="#facc15" stroke-width="3" />
    <line x1="290" y1="105" x2="290" y2="145" stroke="#facc15" stroke-width="3" />
    <text x="285" y="95" text-anchor="middle" fill="#fef08a" font-family="monospace" font-size="8">CAP (C1)</text>
    
    <!-- Wiring -->
    <line x1="130" y1="80" x2="160" y2="125" stroke="#eab308" stroke-width="2" />
    <line x1="130" y1="170" x2="160" y2="125" stroke="#eab308" stroke-width="2" />
    <line x1="250" y1="125" x2="330" y2="125" stroke="#eab308" stroke-width="2" />
    <text x="310" y="115" fill="#facc15" font-family="monospace" font-size="8">VCORE 1.2V</text>
    
    <!-- Readout -->
    <rect x="50" y="240" width="260" height="38" fill="#1c1917" rx="4" stroke="#eab308" stroke-width="1" />
    <text x="60" y="256" fill="#facc15" font-family="monospace" font-size="9" font-weight="bold">SWITCHING FREQ: 600 kHz</text>
    <text x="60" y="270" fill="#fef08a" font-family="monospace" font-size="8">PHASE CURRENT: 45A // VDROOP COMPENSATED</text>
  `,
});

export const TOMO_12_COVER = createCoverSvg({
  tomoNum: '12',
  title: 'INGENIERÍA DE VIDEOJUEGOS',
  subtitle: 'EVO GAME FORGE // DELTA TIME, SHADERS & MUNDO MAX',
  themeColor: '#ec4899',
  accentColor: '#f472b6',
  secondaryColor: '#fbcfe8',
  categoryBadge: 'MOTORES 3D & PROYECTO MUNDO MAX',
  specTag: 'FIXED TIMESTEP 60Hz // SAT COLLISION',
  graphicSvg: `
    <rect width="360" height="295" fill="#070a0f" rx="6" stroke="#ec4899" stroke-width="0.8" stroke-opacity="0.3" />
    <!-- 3D Wireframe Cube Isometric Projection -->
    <g transform="translate(180, 125)">
      <!-- Top Face -->
      <polygon points="0,-60 60,-30 0,0 -60,-30" fill="#500724" fill-opacity="0.7" stroke="#ec4899" stroke-width="2" />
      <!-- Left Face -->
      <polygon points="-60,-30 0,0 0,60 -60,30" fill="#831843" fill-opacity="0.7" stroke="#f472b6" stroke-width="2" />
      <!-- Right Face -->
      <polygon points="0,0 60,-30 60,30 0,60" fill="#9d174d" fill-opacity="0.7" stroke="#ec4899" stroke-width="2" />
      
      <!-- Coordinate Axes -->
      <line x1="0" y1="0" x2="0" y2="-90" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,2" />
      <text x="5" y="-85" fill="#38bdf8" font-family="monospace" font-size="8">+Y (UP)</text>
      
      <line x1="0" y1="0" x2="90" y2="45" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2" />
      <text x="85" y="40" fill="#ef4444" font-family="monospace" font-size="8">+X</text>
      
      <line x1="0" y1="0" x2="-90" y2="45" stroke="#22c55e" stroke-width="2" stroke-dasharray="3,2" />
      <text x="-95" y="40" fill="#22c55e" font-family="monospace" font-size="8">+Z</text>
    </g>
    
    <!-- Game Loop Status -->
    <rect x="50" y="240" width="260" height="38" fill="#1c0612" rx="4" stroke="#ec4899" stroke-width="1" />
    <text x="60" y="256" fill="#f472b6" font-family="monospace" font-size="9" font-weight="bold">GAME LOOP: dt = 0.01666s (60 FPS)</text>
    <text x="60" y="270" fill="#fbcfe8" font-family="monospace" font-size="8">MUNDO MAX ENGINE // GLSL SHADERS ACTIVE</text>
  `,
});

export const ALL_TOMO_COVERS: Record<string, string> = {
  'tomo-01': TOMO_01_COVER,
  '01': TOMO_01_COVER,
  'tomo-02': TOMO_02_COVER,
  '02': TOMO_02_COVER,
  'tomo-03': TOMO_03_COVER,
  '03': TOMO_03_COVER,
  'tomo-04': TOMO_04_COVER,
  '04': TOMO_04_COVER,
  'tomo-05': TOMO_05_COVER,
  '05': TOMO_05_COVER,
  'tomo-06': TOMO_06_COVER,
  '06': TOMO_06_COVER,
  'tomo-07': TOMO_07_COVER,
  '07': TOMO_07_COVER,
  'tomo-08': TOMO_08_COVER,
  '08': TOMO_08_COVER,
  'tomo-09': TOMO_09_COVER,
  '09': TOMO_09_COVER,
  'tomo-10': TOMO_10_COVER,
  '10': TOMO_10_COVER,
  'tomo-11': TOMO_11_COVER,
  '11': TOMO_11_COVER,
  'tomo-12': TOMO_12_COVER,
  '12': TOMO_12_COVER,
};
