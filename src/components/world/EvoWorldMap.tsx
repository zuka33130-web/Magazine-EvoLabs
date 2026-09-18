import React, { useState } from 'react';
import { EvoLabZone, UserHardwarePassport } from '../../types';
import { EVO_WORLD_ZONES } from '../../data/evoWorldData';
import { EvoWorldCore } from './EvoWorldCore';
import { EvoWorldZone } from './EvoWorldZone';
import { EvoWorldAmbientLayer } from './EvoWorldAmbientLayer';
import {
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
  Cpu,
} from 'lucide-react';

interface EvoWorldMapProps {
  passport: UserHardwarePassport | null;
  completedChaptersCount: number;
  onEnterZone: (zone: EvoLabZone) => void;
  onInspectCore?: () => void;
}

export const EvoWorldMap: React.FC<EvoWorldMapProps> = ({
  passport,
  completedChaptersCount,
  onEnterZone,
}) => {
  const [selectedZone, setSelectedZone] = useState<EvoLabZone | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'in_construction'>('all');

  const filteredZones = EVO_WORLD_ZONES.filter((z) => {
    if (activeFilter === 'active') return z.statusCode === 'active';
    if (activeFilter === 'in_construction') return z.statusCode !== 'active';
    return true;
  });

  // Zones grouped into upper wing, center flanks, and lower wing for clean architectural responsiveness
  const northWestZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-1')!;
  const northZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-2')!;
  const northEastZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-3')!;
  const eastZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-4')!;
  const southEastZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-5')!;
  const southZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-6')!;
  const southWestZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-7')!;
  const westZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-8')!;

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#09090b] text-[#f4f4f5] overflow-x-hidden font-sans-editorial flex flex-col justify-between">
      {/* Dynamic Background Ambient Layer */}
      <EvoWorldAmbientLayer />

      {/* Blueprint Subheader & Telemetry Bar */}
      <div className="relative z-20 px-4 sm:px-8 py-3 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>FACILITY STATUS: 8 SECTORES MAPEOS</span>
          </span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="text-zinc-400">
            NÚCLEO CENTRAL: <span className="text-white font-semibold">{passport?.cpuModel || 'TU PC LOCAL'}</span>
          </span>
        </div>

        {/* Map Sector Filter Toggles */}
        <div className="flex items-center gap-1 p-0.5 rounded border border-zinc-800 bg-zinc-900/80">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            TODOS (8)
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ACTIVOS (1)
          </button>
          <button
            onClick={() => setActiveFilter('in_construction')}
            className={`px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer ${
              activeFilter === 'in_construction'
                ? 'bg-amber-400 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            EN PREPARACIÓN (7)
          </button>
        </div>
      </div>

      {/* Main Floor Plan Stage */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center">
        {/* DESKTOP & TABLET: Integrated Spatial Floor Layout */}
        <div className="relative w-full space-y-6">
          {/* TOP WING: Incidentes, Rendimiento, Archivo EVO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <EvoWorldZone
              zone={northWestZone}
              isSelected={selectedZone?.id === northWestZone.id}
              onSelect={setSelectedZone}
              onEnter={onEnterZone}
            />
            <EvoWorldZone
              zone={northZone}
              isSelected={selectedZone?.id === northZone.id}
              onSelect={setSelectedZone}
              onEnter={onEnterZone}
            />
            <EvoWorldZone
              zone={northEastZone}
              isSelected={selectedZone?.id === northEastZone.id}
              onSelect={setSelectedZone}
              onEnter={onEnterZone}
            />
          </div>

          {/* CENTER WING: West Sector, CORE (TU PC), East Sector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-4">
              <EvoWorldZone
                zone={westZone}
                isSelected={selectedZone?.id === westZone.id}
                onSelect={setSelectedZone}
                onEnter={onEnterZone}
              />
            </div>

            {/* Central Workstation / Core Node */}
            <div className="md:col-span-4 flex justify-center py-2">
              <EvoWorldCore
                passport={passport}
                completedChaptersCount={completedChaptersCount}
                isSelected={selectedZone === null}
                onClick={() => setSelectedZone(null)}
              />
            </div>

            <div className="md:col-span-4">
              <EvoWorldZone
                zone={eastZone}
                isSelected={selectedZone?.id === eastZone.id}
                onSelect={setSelectedZone}
                onEnter={onEnterZone}
              />
            </div>
          </div>

          {/* BOTTOM WING: Mi Laboratorio, Zona Restringida, Sala de Máquinas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <EvoWorldZone
              zone={southWestZone}
              isSelected={selectedZone?.id === southWestZone.id}
              onSelect={setSelectedZone}
              onEnter={onEnterZone}
            />
            <EvoWorldZone
              zone={southZone}
              isSelected={selectedZone?.id === southZone.id}
              onSelect={setSelectedZone}
              onEnter={onEnterZone}
            />
            <EvoWorldZone
              zone={southEastZone}
              isSelected={selectedZone?.id === southEastZone.id}
              onSelect={setSelectedZone}
              onEnter={onEnterZone}
            />
          </div>
        </div>
      </div>

      {/* Integrated Architectural Inspector Drawer (Bottom or Lateral) */}
      {selectedZone && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-zinc-950/95 border-t-2 border-amber-400 backdrop-blur-xl shadow-2xl p-6 transition-transform duration-300 animate-in slide-in-from-bottom-8 select-none">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-mono-tech text-xs font-bold text-amber-400">
                  SECTOR {selectedZone.number} // {selectedZone.aspect.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono-tech font-bold uppercase tracking-wider ${
                    selectedZone.statusCode === 'active'
                      ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40'
                      : selectedZone.statusCode === 'restricted'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {selectedZone.statusBadge}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                  {selectedZone.title}
                </h3>
                <span className="font-mono-tech text-sm font-semibold text-amber-400">
                  "{selectedZone.keyPhrase}"
                </span>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {selectedZone.narrativeDetail}
              </p>

              {/* 3 Concrete Examples of what's inside or planned */}
              <div className="pt-2">
                <div className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {selectedZone.statusCode === 'active'
                      ? 'MÓDULOS DE INVESTIGACIÓN DISPONIBLES:'
                      : 'ESTE SECTOR ESTÁ SIENDO PREPARADO // 3 EJEMPLOS PREVISTOS:'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedZone.examples.map((example, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300 font-mono-tech flex items-start gap-1.5"
                    >
                      <span className="text-amber-400 font-bold">{i + 1}.</span>
                      <span className="leading-snug">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
              <button
                onClick={() => setSelectedZone(null)}
                className="px-4 py-2.5 rounded border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-mono-tech transition-colors cursor-pointer"
              >
                CERRAR VISTA
              </button>

              <button
                onClick={() => onEnterZone(selectedZone)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded font-display font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  selectedZone.statusCode === 'active'
                    ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-[0_0_20px_rgba(234,179,8,0.35)]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                }`}
              >
                <span>{selectedZone.statusCode === 'active' ? 'ENTRAR AL SECTOR' : 'VER DETALLES TÉCNICOS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discreet Footer Identity Quote */}
      <footer className="relative z-10 px-6 py-4 border-t border-zinc-900 bg-zinc-950/60 flex items-center justify-between text-xs font-mono-tech text-zinc-500">
        <div>
          EVO LABS // <span className="text-zinc-300">"Hacemos milagros, pero los medimos."</span>
        </div>
        <div className="hidden sm:block text-zinc-600">
          PLANTA ARQUITECTÓNICA DE INGENIERÍA // V1.0
        </div>
      </footer>
    </div>
  );
};
