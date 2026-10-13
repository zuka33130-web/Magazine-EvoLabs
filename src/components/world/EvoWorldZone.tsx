import React, { useState } from 'react';
import { EvoLabZone } from '../../types';
import {
  RestrictedDoorSvg,
  ArchiveShelvesSvg,
  CircuitDiagnosticSvg,
  PerformanceBenchSvg,
  ExperimentsBenchSvg,
  MachineWorkshopSvg,
  PersonalDeskSvg,
  CommunityHallSvg,
} from '../../assets/evo-world/LabIllustrations';
import { Lock, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

interface EvoWorldZoneProps {
  zone: EvoLabZone;
  isSelected?: boolean;
  onSelect: (zone: EvoLabZone) => void;
  onEnter: (zone: EvoLabZone) => void;
}

export const EvoWorldZone: React.FC<EvoWorldZoneProps> = ({
  zone,
  isSelected = false,
  onSelect,
  onEnter,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Render specific zone architecture illustration
  const renderZoneIllustration = () => {
    switch (zone.id) {
      case 'zona-1':
        return <CircuitDiagnosticSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      case 'zona-2':
        return <PerformanceBenchSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      case 'zona-3':
        return <ArchiveShelvesSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      case 'zona-4':
        return <ExperimentsBenchSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      case 'zona-5':
        return <MachineWorkshopSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      case 'zona-6':
        return <RestrictedDoorSvg className="w-full h-32 sm:h-36" isHovered={isHovered || isSelected} />;
      case 'zona-7':
        return <PersonalDeskSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      case 'zona-8':
        return <CommunityHallSvg className="w-full h-28 sm:h-32" isHovered={isHovered || isSelected} />;
      default:
        return null;
    }
  };

  const isRestricted = zone.statusCode === 'restricted';
  const isActive = zone.statusCode === 'active';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(zone)}
      className={`relative cursor-pointer transition-all duration-300 rounded-xl p-3.5 sm:p-4 bg-zinc-950/85 border flex flex-col justify-between group select-none ${
        isSelected
          ? 'border-amber-400 bg-zinc-900/90 shadow-[0_0_30px_rgba(234,179,8,0.25)] scale-[1.03] z-30'
          : isHovered
          ? 'border-zinc-700 bg-zinc-900/60 shadow-[0_0_20px_rgba(0,0,0,0.8)] scale-[1.01] z-20'
          : 'border-zinc-850 bg-zinc-950/80 hover:border-zinc-700'
      }`}
      style={{
        minHeight: '260px',
      }}
    >
      {/* Visual State Indicators */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono-tech text-xs font-bold text-amber-400">
            {zone.number}
          </span>
          <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-widest truncate max-w-[130px]">
            {zone.aspect}
          </span>
        </div>

        {/* State Chip: ACTIVO / EN CONSTRUCCIÓN / BLOQUEADO */}
        <div
          className={`px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase tracking-wider flex items-center gap-1 ${
            isActive
              ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
              : isRestricted
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
          }`}
        >
          {isActive ? (
            <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
          ) : isRestricted ? (
            <Lock className="w-2.5 h-2.5 text-red-400" />
          ) : (
            <Clock className="w-2.5 h-2.5 text-zinc-500" />
          )}
          <span>
            {isActive ? 'ACTIVO' : isRestricted ? 'BLOQUEADO' : 'EN CONSTRUCCIÓN'}
          </span>
        </div>
      </div>

      {/* Zone Architectural Physical Silhouette Illustration */}
      <div className="my-1.5 flex items-center justify-center p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 transition-colors group-hover:border-zinc-700">
        {renderZoneIllustration()}
      </div>

      {/* Zone Name & Mandatory Key Phrase */}
      <div className="space-y-1 mt-1">
        <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-amber-300 transition-colors">
          {zone.title}
        </h3>

        {/* Mandatory Key Phrase */}
        <div className="font-mono-tech text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
          "{zone.keyPhrase}"
        </div>

        <p className="font-sans-editorial text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {zone.description}
        </p>
      </div>

      {/* Hover / Selection Action Bar */}
      <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
        <span className="font-mono-tech text-[9px] text-zinc-500">
          {isActive ? 'TOMO 01 DISPONIBLE' : isRestricted ? 'DESAFÍO BLOQUEADO' : '3 MÓDULOS EN PREPARACIÓN'}
        </span>

        {isActive ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnter(zone);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono-tech text-xs font-bold uppercase transition-all shadow-[0_0_12px_rgba(234,179,8,0.3)] cursor-pointer"
          >
            <span>ENTRAR</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(zone);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-700 hover:border-amber-400/50 text-zinc-400 hover:text-zinc-200 font-mono-tech text-[10px] transition-colors cursor-pointer"
          >
            <span>INSPECCIONAR</span>
          </button>
        )}
      </div>
    </div>
  );
};
