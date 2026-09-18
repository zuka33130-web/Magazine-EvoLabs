import React from 'react';
import { EvoFanSvg } from '../../assets/evo-world/LabIllustrations';
import { Cpu, Activity, Zap, CheckCircle2, AlertTriangle } from 'lucide-react';
import { UserHardwarePassport } from '../../types';

interface EvoWorldCoreProps {
  passport: UserHardwarePassport | null;
  completedChaptersCount: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const EvoWorldCore: React.FC<EvoWorldCoreProps> = ({
  passport,
  completedChaptersCount,
  isSelected = false,
  onClick,
}) => {
  // Determine actual PC status based on data
  const hasPassport = Boolean(passport && passport.cpuModel);
  const status: 'CONECTADA' | 'INVESTIGACIÓN ACTIVA' | 'SIN DATOS' = !hasPassport
    ? 'SIN DATOS'
    : completedChaptersCount > 0
    ? 'INVESTIGACIÓN ACTIVA'
    : 'CONECTADA';

  return (
    <div
      onClick={onClick}
      className={`relative z-20 cursor-pointer group transition-all duration-500 rounded-2xl p-5 md:p-6 bg-zinc-950/90 border ${
        isSelected
          ? 'border-amber-400 shadow-[0_0_40px_rgba(234,179,8,0.35)] scale-105'
          : 'border-zinc-800 hover:border-amber-400/70 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]'
      }`}
      style={{
        width: '100%',
        maxWidth: '340px',
      }}
    >
      {/* Subtle background radar scanlines */}
      <div className="absolute inset-0 bg-tech-dots opacity-20 rounded-2xl pointer-events-none" />

      {/* Decorative corner brackets */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-amber-400/80" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-amber-400/80" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-amber-400/80" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-amber-400/80" />

      {/* Header Tag */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-mono-tech text-[10px] tracking-widest text-amber-400 font-bold uppercase">
            NÚCLEO EVO // CENTRO
          </span>
        </div>
        <div
          className={`px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1 ${
            status === 'INVESTIGACIÓN ACTIVA'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : status === 'CONECTADA'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}
        >
          {status === 'INVESTIGACIÓN ACTIVA' ? (
            <Activity className="w-3 h-3 animate-pulse" />
          ) : status === 'CONECTADA' ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <AlertTriangle className="w-3 h-3" />
          )}
          <span>{status}</span>
        </div>
      </div>

      {/* Visual Workstation Hardware Mockup */}
      <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 mb-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="font-display font-bold text-sm tracking-tight text-white">
              TU PC
            </span>
          </div>
          <EvoFanSvg size={24} speed="normal" />
        </div>

        {/* Real specs or default state */}
        <div className="space-y-1 font-mono-tech text-[11px]">
          <div className="flex items-center justify-between text-zinc-400">
            <span>CPU:</span>
            <span className="text-zinc-200 truncate max-w-[170px]">
              {passport?.cpuModel || 'ESTACIÓN DE TRABAJO LOCAL'}
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>RAM:</span>
            <span className="text-amber-400 font-semibold">
              {passport?.ramCapacityGb ? `${passport.ramCapacityGb} GB` : 'EN AUDITORÍA'}
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span>EXPEDIENTES:</span>
            <span className="text-zinc-200 font-semibold">
              {completedChaptersCount}/7 CAPÍTULOS
            </span>
          </div>
        </div>

        {/* Pulse activity bar */}
        <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[9px] font-mono-tech text-zinc-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>BUS DE TELEMETRÍA 100% LOCAL</span>
          </span>
          <span className="text-amber-400/80">IRRADIA A 8 ZONAS</span>
        </div>
      </div>

      {/* Bottom descriptor */}
      <p className="font-sans-editorial text-xs text-zinc-400 text-center leading-relaxed">
        El corazón del mapa. Todas las mediciones, ensayos y peritajes se originan desde esta máquina.
      </p>
    </div>
  );
};
