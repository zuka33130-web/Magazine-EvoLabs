import React from 'react';
import { EvoFanSvg } from '../../assets/evo-world/LabIllustrations';

export const EvoWorldAmbientLayer: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Blueprint Grid Lines */}
      <div className="absolute inset-0 bg-tech-grid opacity-25" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#09090b]/40 to-[#09090b]" />

      {/* Industrial Floor Markings & Perimeter Axes */}
      <div className="absolute top-4 left-6 font-mono-tech text-[10px] text-zinc-600 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        <span>PLANTA GENERAL // INSTALACIONES EVO LABS [V1.0]</span>
      </div>

      <div className="absolute top-4 right-6 font-mono-tech text-[10px] text-zinc-600">
        LAT: -34.6037 // LON: -58.3816 // ESTADO: ACTIVO
      </div>

      {/* Perimeter Fans & Intake Vents */}
      <div className="absolute top-12 left-8 opacity-20 hidden lg:block">
        <EvoFanSvg size={70} speed="slow" />
      </div>
      <div className="absolute top-12 right-8 opacity-20 hidden lg:block">
        <EvoFanSvg size={70} speed="slow" />
      </div>
      <div className="absolute bottom-16 left-8 opacity-20 hidden lg:block">
        <EvoFanSvg size={60} speed="slow" />
      </div>
      <div className="absolute bottom-16 right-8 opacity-20 hidden lg:block">
        <EvoFanSvg size={60} speed="slow" />
      </div>

      {/* SVG Network Vector Conduits Radiating from Center (50%, 50%) */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3f3f46" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Central Concentric Architectural Orbits */}
        <circle cx="50%" cy="50%" r="180" stroke="#27272a" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" fill="none" />
        <circle cx="50%" cy="50%" r="300" stroke="#27272a" strokeWidth="1" strokeDasharray="2 8" opacity="0.4" fill="none" />
        <circle cx="50%" cy="50%" r="420" stroke="#27272a" strokeWidth="1" strokeDasharray="6 6" opacity="0.2" fill="none" />

        {/* Crosshair coordinate axes */}
        <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="#27272a" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.4" />
        <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#27272a" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.4" />
      </svg>
    </div>
  );
};
