import React, { useEffect, useRef } from 'react';

interface EvoHeroReactiveBackgroundProps {
  className?: string;
}

export const EvoHeroReactiveBackground: React.FC<EvoHeroReactiveBackgroundProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const farLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const nearLayerRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check for touch / no-hover devices
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window);

    if (prefersReducedMotion) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    let targetGlowX = 50;
    let targetGlowY = 50;
    let currentGlowX = 50;
    let currentGlowY = 50;

    let animationFrameId: number;
    let isRunning = true;
    let ambientTime = 0;

    // Smoothing animation loop using RequestAnimationFrame & Lerp
    const updateMotion = () => {
      if (!isRunning) return;

      if (isTouchDevice) {
        // Subtle organic breathing drift for mobile/touch without tracking finger
        ambientTime += 0.015;
        const driftX = Math.sin(ambientTime * 0.6) * 0.25;
        const driftY = Math.cos(ambientTime * 0.4) * 0.25;

        currentX += (driftX - currentX) * 0.05;
        currentY += (driftY - currentY) * 0.05;
      } else {
        // Lerp interpolation (0.065 smoothing factor for fluid natural inertia)
        currentX += (targetX - currentX) * 0.065;
        currentY += (targetY - currentY) * 0.065;

        currentGlowX += (targetGlowX - currentGlowX) * 0.065;
        currentGlowY += (targetGlowY - currentGlowY) * 0.065;
      }

      // CAPA C — DEPTH / PARTICLES (Far Layer): counter movement 3–6px
      if (farLayerRef.current) {
        const farX = -currentX * 6;
        const farY = -currentY * 6;
        farLayerRef.current.style.transform = `translate3d(${farX.toFixed(2)}px, ${farY.toFixed(2)}px, 0)`;
      }

      // CAPA B — TECH GRID / PATTERN (Mid Layer): movement in direction of pointer 8–14px
      if (midLayerRef.current) {
        const midX = currentX * 11;
        const midY = currentY * 11;
        midLayerRef.current.style.transform = `translate3d(${midX.toFixed(2)}px, ${midY.toFixed(2)}px, 0)`;
      }

      // CAPA A — AMBIENT / NEAR LAYER (Near Layer): dynamic depth 16–22px
      if (nearLayerRef.current) {
        const nearX = currentX * 18;
        const nearY = currentY * 18;
        nearLayerRef.current.style.transform = `translate3d(${nearX.toFixed(2)}px, ${nearY.toFixed(2)}px, 0)`;
      }

      // CAPA A — AMBIENT GLOW / SPOTLIGHT (Subtle cyan/amber ambient tracking spotlight)
      if (glowLayerRef.current && !isTouchDevice) {
        glowLayerRef.current.style.background = `radial-gradient(750px circle at ${currentGlowX.toFixed(
          1
        )}% ${currentGlowY.toFixed(
          1
        )}%, rgba(245, 158, 11, 0.065) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 75%)`;
      }

      animationFrameId = requestAnimationFrame(updateMotion);
    };

    animationFrameId = requestAnimationFrame(updateMotion);

    // Pointer move listener on window for robust viewport-wide background reaction
    const handlePointerMove = (e: PointerEvent) => {
      if (isTouchDevice || e.pointerType === 'touch') return;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;

      // Normalization: -1 to +1 (0 at center)
      const nx = (e.clientX / width - 0.5) * 2;
      const ny = (e.clientY / height - 0.5) * 2;

      targetX = Math.max(-1, Math.min(1, nx));
      targetY = Math.max(-1, Math.min(1, ny));

      targetGlowX = (e.clientX / width) * 100;
      targetGlowY = (e.clientY / height) * 100;
    };

    const handlePointerLeave = () => {
      // Return smoothly to center position when leaving window
      targetX = 0;
      targetY = 0;
      targetGlowX = 50;
      targetGlowY = 50;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none ${className}`}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* CAPA 0: Deep Ambient Background & Static Radial Halo                      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080d] via-[#080b11] to-[#040507]" />

      {/* Static Core Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] sm:h-[600px] rounded-full bg-amber-500/[0.03] blur-[130px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[550px] h-[300px] sm:h-[400px] rounded-full bg-cyan-500/[0.025] blur-[100px]" />

      {/* Dynamic Cursor Light (Radial Spotlight following cursor lerp) */}
      <div
        ref={glowLayerRef}
        className="absolute inset-0 transition-opacity duration-700 opacity-90"
        style={{
          background:
            'radial-gradient(750px circle at 50% 50%, rgba(245, 158, 11, 0.065) 0%, rgba(6, 182, 212, 0.04) 40%, transparent 75%)',
        }}
      />

      {/* ========================================================================= */}
      {/* CAPA C — DEPTH / PARTICLES (Far Layer: Grid técnico y coordenadas)        */}
      {/* ========================================================================= */}
      <div
        ref={farLayerRef}
        className="absolute -inset-16 flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      >
        {/* Isometric technical grid */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.05] stroke-zinc-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="evo-far-grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M 72 0 L 0 0 0 72" fill="none" strokeWidth="0.75" />
              <circle cx="36" cy="36" r="1" fill="#71717a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#evo-far-grid)" />
        </svg>

        {/* Deep substrate coordinate markings */}
        <div className="absolute top-8 left-8 font-mono-tech text-[8px] text-zinc-600/40 tracking-widest uppercase">
          SYS_LAYER::00_FAR // BASE_CLK 100MHz
        </div>
        <div className="absolute bottom-8 right-8 font-mono-tech text-[8px] text-zinc-600/40 tracking-widest uppercase">
          SEC_GRID::ALPHA_VREF // LAT: 0.12ns
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CAPA B — TECH GRID / PATTERN (Mid Layer: Líneas PCB, buses y pistas)       */}
      {/* ========================================================================= */}
      <div
        ref={midLayerRef}
        className="absolute -inset-20 flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      >
        <svg
          className="w-full h-full max-w-[1400px] max-h-[850px] opacity-[0.15]"
          viewBox="0 0 1200 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="amberTrace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="cyanBusLane" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Central Silicon Lattice Hex Ring */}
          <circle cx="600" cy="350" r="260" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.3" />
          <circle cx="600" cy="350" r="180" stroke="#3f3f46" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="600" cy="350" r="110" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 6" strokeOpacity="0.3" />

          {/* Micro-bus horizontal & vertical channels */}
          <path d="M 150 350 L 450 350 M 750 350 L 1050 350" stroke="url(#cyanBusLane)" strokeWidth="1.5" />
          <path d="M 600 80 L 600 230 M 600 470 L 600 620" stroke="url(#amberTrace)" strokeWidth="1.5" />

          {/* 45-degree angle PCB breakout routing lines */}
          <path d="M 220 180 L 380 180 L 480 280" stroke="#52525b" strokeWidth="1" />
          <path d="M 980 180 L 820 180 L 720 280" stroke="#52525b" strokeWidth="1" />
          <path d="M 220 520 L 380 520 L 480 420" stroke="#52525b" strokeWidth="1" />
          <path d="M 980 520 L 820 520 L 720 420" stroke="#52525b" strokeWidth="1" />

          {/* Gold solder vias */}
          <circle cx="380" cy="180" r="3" fill="#f59e0b" fillOpacity="0.6" />
          <circle cx="820" cy="180" r="3" fill="#06b6d4" fillOpacity="0.6" />
          <circle cx="380" cy="520" r="3" fill="#10b981" fillOpacity="0.6" />
          <circle cx="820" cy="520" r="3" fill="#a855f7" fillOpacity="0.6" />

          {/* Outer data bus lanes */}
          <path d="M 100 280 L 260 280 L 310 330 L 450 330" stroke="#3f3f46" strokeWidth="0.75" />
          <path d="M 1100 280 L 940 280 L 890 330 L 750 330" stroke="#3f3f46" strokeWidth="0.75" />
          <path d="M 100 420 L 260 420 L 310 370 L 450 370" stroke="#3f3f46" strokeWidth="0.75" />
          <path d="M 1100 420 L 940 420 L 890 370 L 750 370" stroke="#3f3f46" strokeWidth="0.75" />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* CAPA A — AMBIENT / NEAR LAYER (Nodos cyan, pulsos amber y retículas)       */}
      {/* ========================================================================= */}
      <div
        ref={nearLayerRef}
        className="absolute -inset-24 flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div className="relative w-full h-full max-w-[1300px] max-h-[800px]">
          {/* Node 1: Top-Left Cyan Precision Marker */}
          <div className="absolute top-[22%] left-[18%] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] animate-pulse" />
            <span className="font-mono-tech text-[8px] text-cyan-400/70 tracking-wider">
              0x01_OBS // BUS_CLK
            </span>
          </div>

          {/* Node 2: Top-Right Amber Precision Marker */}
          <div className="absolute top-[24%] right-[18%] flex items-center gap-2">
            <span className="font-mono-tech text-[8px] text-amber-400/70 tracking-wider">
              0x02_MED // V_CORE 1.05V
            </span>
            <div className="w-2 h-2 rounded-full bg-amber-400/80 shadow-[0_0_10px_#fbbf24] animate-pulse" />
          </div>

          {/* Node 3: Bottom-Left Purple Precision Marker */}
          <div className="absolute bottom-[22%] left-[20%] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/80 shadow-[0_0_8px_#c084fc]" />
            <span className="font-mono-tech text-[8px] text-purple-400/60 tracking-wider">
              0x03_EXP // LAT 8.2ns
            </span>
          </div>

          {/* Node 4: Bottom-Right Emerald Precision Marker */}
          <div className="absolute bottom-[24%] right-[20%] flex items-center gap-2">
            <span className="font-mono-tech text-[8px] text-emerald-400/60 tracking-wider">
              0x04_CMP // VERIFIED
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_#34d399]" />
          </div>

          {/* Precision Alignment Reticles (+) */}
          <div className="absolute top-[15%] left-[50%] -translate-x-1/2 font-mono-tech text-xs text-zinc-600/30 select-none">
            +
          </div>
          <div className="absolute bottom-[15%] left-[50%] -translate-x-1/2 font-mono-tech text-xs text-zinc-600/30 select-none">
            +
          </div>
          <div className="absolute top-[50%] left-[10%] -translate-y-1/2 font-mono-tech text-xs text-zinc-600/30 select-none">
            +
          </div>
          <div className="absolute top-[50%] right-[10%] -translate-y-1/2 font-mono-tech text-xs text-zinc-600/30 select-none">
            +
          </div>

          {/* Subtle floating telemetry micro-particles */}
          <div className="absolute top-[38%] left-[28%] w-1 h-1 rounded-full bg-amber-400/40 blur-[0.5px]" />
          <div className="absolute top-[42%] right-[26%] w-1 h-1 rounded-full bg-cyan-400/40 blur-[0.5px]" />
          <div className="absolute bottom-[36%] left-[32%] w-1 h-1 rounded-full bg-emerald-400/30 blur-[0.5px]" />
          <div className="absolute bottom-[40%] right-[30%] w-1 h-1 rounded-full bg-purple-400/30 blur-[0.5px]" />
        </div>
      </div>

      {/* Top & Bottom Soft Vignette Blends to guarantee seamless transition */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#06080d] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#06080d] to-transparent pointer-events-none" />
    </div>
  );
};
