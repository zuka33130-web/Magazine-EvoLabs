import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu, ShieldCheck, Activity, Eye, Zap, Compass, Layers } from 'lucide-react';

interface EvoHeroCore3DProps {
  userStateLabel?: string;
  userStateColor?: string;
  className?: string;
  onCoreClick?: () => void;
}

export const EvoHeroCore3D: React.FC<EvoHeroCore3DProps> = ({
  userStateLabel = 'ACTIVO',
  userStateColor = 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  className = '',
  onCoreClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [activeQuadrant, setActiveQuadrant] = useState<number | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Handle smooth 3D subtle tilt tracking (Solid, elegant presence: max rotateX ±2deg, rotateY ±3deg, translate ±4px)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt: rotateX ±2deg, rotateY ±3deg
      const tiltY = ((x - centerX) / centerX) * 3;
      const tiltX = -((y - centerY) / centerY) * 2;

      setTilt({ x: tiltX, y: tiltY });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setActiveQuadrant(null);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    if (onCoreClick) onCoreClick();
    setTimeout(() => setIsClicked(false), 800);
  }, [onCoreClick]);

  // Touch handlers for mobile
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltY = ((x - centerX) / centerX) * 10;
      const tiltX = -((y - centerY) / centerY) * 10;
      setTilt({ x: tiltX, y: tiltY });
    },
    [prefersReducedMotion]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      className={`relative w-full max-w-[440px] h-[400px] sm:h-[460px] mx-auto flex items-center justify-center cursor-pointer select-none ${className}`}
      style={{ perspective: '1200px' }}
      role="region"
      aria-label="Núcleo Visual 3D Interactivo de MUNDO EVO"
    >
      {/* 3D Transform Canvas Root with spatial preserve-3d */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* ========================================================================= */}
        {/* CAPA 0: Deep Substrate, Spatial Glow & Blueprint Grid (-50px Z)           */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-4 rounded-3xl pointer-events-none transition-all duration-700"
          style={{ transform: 'translateZ(-50px)' }}
        >
          {/* Radial plasma halo */}
          <div
            className={`absolute inset-0 rounded-full blur-[70px] transition-opacity duration-700 ${
              isHovered ? 'opacity-40 scale-105' : 'opacity-20'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(6,182,212,0.15) 50%, transparent 75%)',
            }}
          />

          {/* Isometric grid canvas lines */}
          <div
            className="absolute inset-0 rounded-3xl border border-zinc-800/40 opacity-30 bg-tech-grid"
            style={{
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            }}
          />
        </div>

        {/* ========================================================================= */}
        {/* CAPA 1: PCB Topology, Vector Bus Traces & 4 Method Nodes (-20px Z)       */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-8 rounded-full pointer-events-none"
          style={{ transform: 'translateZ(-20px)' }}
        >
          {/* SVG Vector Circuit Lattice */}
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="cyanBus" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Base circuit outer ring */}
            <circle cx="200" cy="200" r="170" stroke="#27272a" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="135" stroke="#3f3f46" strokeWidth="1" strokeOpacity="0.4" />

            {/* Micro-bus data paths */}
            <path
              d="M 200 30 L 200 90 M 200 310 L 200 370 M 30 200 L 90 200 M 310 200 L 370 200"
              stroke={isHovered ? '#fbbf24' : '#52525b'}
              strokeWidth="1.5"
              strokeDasharray={isHovered ? '2 4' : 'none'}
              className="transition-colors duration-500"
            />

            {/* Diagonal interconnects with solder vias */}
            <path d="M 80 80 L 120 120 M 320 80 L 280 120 M 80 320 L 120 280 M 320 320 L 280 280" stroke="#3f3f46" strokeWidth="1" />
            
            {/* Vias (solder contact points) */}
            <circle cx="80" cy="80" r="3" fill="#fbbf24" fillOpacity={isHovered ? '1' : '0.4'} />
            <circle cx="320" cy="80" r="3" fill="#22d3ee" fillOpacity={isHovered ? '1' : '0.4'} />
            <circle cx="80" cy="320" r="3" fill="#34d399" fillOpacity={isHovered ? '1' : '0.4'} />
            <circle cx="320" cy="320" r="3" fill="#a855f7" fillOpacity={isHovered ? '1' : '0.4'} />
          </svg>

          {/* 4 Cardinal Methodological Nodes */}
          {/* Node 1: OBSERVAR (Top) */}
          <div
            onMouseEnter={() => setActiveQuadrant(1)}
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#090b12] border font-mono-tech text-[9px] transition-all duration-300 ${
              activeQuadrant === 1 || isHovered
                ? 'border-amber-400/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>01 // OBSERVAR</span>
          </div>

          {/* Node 2: MEDIR (Right) */}
          <div
            onMouseEnter={() => setActiveQuadrant(2)}
            className={`absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#090b12] border font-mono-tech text-[9px] transition-all duration-300 ${
              activeQuadrant === 2 || isHovered
                ? 'border-cyan-400/80 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>02 // MEDIR</span>
          </div>

          {/* Node 3: COMPROBAR (Bottom) */}
          <div
            onMouseEnter={() => setActiveQuadrant(3)}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#090b12] border font-mono-tech text-[9px] transition-all duration-300 ${
              activeQuadrant === 3 || isHovered
                ? 'border-emerald-400/80 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>03 // COMPROBAR</span>
          </div>

          {/* Node 4: EVOLUCIONAR (Left) */}
          <div
            onMouseEnter={() => setActiveQuadrant(4)}
            className={`absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#090b12] border font-mono-tech text-[9px] transition-all duration-300 ${
              activeQuadrant === 4 || isHovered
                ? 'border-purple-400/80 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>04 // EVOLUCIONAR</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAPA 2: Orbital Rings & Quantum Gyroscope (+20px Z)                       */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-10 rounded-full pointer-events-none flex items-center justify-center"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Primary Orbital Ring: Clockwise slow rotation (Decelerates on hover) */}
          <div
            className={`absolute inset-0 rounded-full border border-amber-400/30 border-dashed ${
              prefersReducedMotion
                ? ''
                : isHovered
                ? 'animate-[spin_60s_linear_infinite]'
                : 'animate-[spin_24s_linear_infinite]'
            }`}
          >
            {/* Orbital Satellite Node A */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#080a11] border border-amber-400 flex items-center justify-center shadow-[0_0_10px_#fbbf24]">
              <div className="w-1 h-1 rounded-full bg-amber-300" />
            </div>
            {/* Orbital Satellite Node B */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#080a11] border border-cyan-400 flex items-center justify-center shadow-[0_0_8px_#22d3ee]">
              <div className="w-0.5 h-0.5 rounded-full bg-cyan-200" />
            </div>
          </div>

          {/* Secondary Counter-Rotating Orbital Ring */}
          <div
            className={`absolute inset-6 rounded-full border border-zinc-800/80 ${
              prefersReducedMotion
                ? ''
                : isHovered
                ? 'animate-[spin_90s_linear_infinite_reverse]'
                : 'animate-[spin_36s_linear_infinite_reverse]'
            }`}
          >
            {/* Counter Satellite Node C */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#080a11] border border-emerald-400 flex items-center justify-center shadow-[0_0_8px_#34d399]">
              <div className="w-0.5 h-0.5 rounded-full bg-emerald-200" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAPA 3: Monolithic Silicon Core Die (+55px Z)                             */}
        {/* ========================================================================= */}
        <div
          className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-[#090c14] border p-4 flex flex-col justify-between shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-500 ${
            isClicked
              ? 'scale-105 border-amber-400 ring-4 ring-amber-400/20'
              : isHovered
              ? 'border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
              : 'border-zinc-800'
          }`}
          style={{ transform: 'translateZ(55px)' }}
        >
          {/* Internal fine copper circuit grid */}
          <div className="absolute inset-2.5 rounded-2xl border border-zinc-900 bg-tech-grid opacity-10 pointer-events-none" />

          {/* Chamfered gold corner accents */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-amber-400/60" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-amber-400/60" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-amber-400/60" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-amber-400/60" />

          {/* Core Header Header */}
          <div className="flex justify-between items-center font-mono-tech text-[9px] text-zinc-400 z-10">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" />
              <span>EVO_CORE</span>
            </span>
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[8px]">
              {isHovered ? 'INSPECCIÓN' : 'ACTIVO'}
            </span>
          </div>

          {/* Central Holographic Aperture (Ø) & Quantum Resonator */}
          <div className="flex flex-col items-center justify-center my-auto relative z-10 py-1">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              {/* Outer Core Aura */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  isHovered ? 'bg-amber-400/20 blur-md scale-110' : 'bg-amber-400/5 blur-sm'
                }`}
              />
              
              {/* Spinning Micro-Caliper */}
              <div className="absolute inset-0 rounded-full border border-amber-400/30 border-dashed animate-[spin_16s_linear_infinite]" />

              {/* Silicon Die Monogram */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#06080e] border border-amber-400/60 flex items-center justify-center shadow-inner">
                <span className="font-display font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 leading-none select-none">
                  Ø
                </span>
              </div>
            </div>

            <div className="font-mono-tech text-[8px] sm:text-[9px] text-zinc-300 tracking-widest uppercase mt-2 text-center font-bold">
              {isHovered ? 'SISTEMA BAJO OBSERVACIÓN' : 'ARQUITECTURA DE SILICIO'}
            </div>
          </div>

          {/* Core Footer Metadata */}
          <div className="flex justify-between items-end font-mono-tech text-[8px] text-zinc-400 z-10 border-t border-zinc-900 pt-1.5">
            <span className="text-zinc-400">TELEMETRÍA: VIVA</span>
            <span className="text-amber-300 font-bold">FASE 08</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CAPA 4: Floating Focus Calipers & Precision Reticles (+85px Z)            */}
        {/* ========================================================================= */}
        <div
          className={`absolute pointer-events-none transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transform: 'translateZ(85px)' }}
        >
          {/* Floating Optical Caliper Crosshairs */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Top-left optical bracket */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            {/* Top-right optical bracket */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            {/* Bottom-left optical bracket */}
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            {/* Bottom-right optical bracket */}
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />

            {/* Inspection Callout Badge */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#080c14]/95 border border-cyan-400/60 text-cyan-300 font-mono-tech text-[9px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
              <Eye className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>MODO INSPECCIÓN EMPÍRICA ACTIVO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Honest Technical System Tag */}
      <div className="absolute bottom-1 right-2 font-mono-tech text-[8px] text-zinc-400 uppercase tracking-widest pointer-events-none flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-zinc-400" />
        <span>MODELO CONCEPTUAL 3D // EVO NUCLEUS</span>
      </div>
    </div>
  );
};
