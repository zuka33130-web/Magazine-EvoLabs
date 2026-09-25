import React, { useState } from 'react';
import { EvoLabZone, UserHardwarePassport, EvoNarrativeProfile } from '../../types';
import { EVO_WORLD_ZONES } from '../../data/evoWorldData';
import { EvoWorldCore } from './EvoWorldCore';
import { EvoWorldZone } from './EvoWorldZone';
import { EvoWorldAmbientLayer } from './EvoWorldAmbientLayer';
import { EvoMotherboardCanvas } from './EvoMotherboardCanvas';
import { EvoSectorWorkstationModal } from './EvoSectorWorkstationModal';
import { EvoLiveBenchSuite } from './EvoLiveBenchSuite';
import { EvoTelemetryHUD } from './labs/EvoTelemetryHUD';
import { EvoLabConsole } from './labs/EvoLabConsole';
import { EvoOperatingModeSelector } from '../common/EvoOperatingModeSelector';
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
  Map,
  Grid,
  Gauge,
  Activity,
  Crosshair,
  Info,
  Terminal,
  FlaskConical,
} from 'lucide-react';

interface EvoWorldMapProps {
  passport: UserHardwarePassport | null;
  completedChaptersCount: number;
  onEnterZone: (zone: EvoLabZone) => void;
  onInspectCore?: () => void;
  activeProfile?: EvoNarrativeProfile;
  onChangeProfile?: (profile: EvoNarrativeProfile) => void;
  onOpenTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
}

export const EvoWorldMap: React.FC<EvoWorldMapProps> = ({
  passport,
  completedChaptersCount,
  onEnterZone,
  activeProfile = 'investigador',
  onChangeProfile = () => {},
  onOpenTomo = (_tomoId: '01' | '02' | '03' | '04') => {},
}) => {
  // Main view mode: 'motherboard' (PCB Schematic), 'zones' (8 Sectors Grid), 'live-bench' (Live Simulator Suite), 'console' (8 Interactive Labs)
  const [viewMode, setViewMode] = useState<'motherboard' | 'zones' | 'live-bench' | 'console'>('motherboard');
  const [activeConsoleZoneId, setActiveConsoleZoneId] = useState<string>('zona-1');

  // Motherboard Active Overlay
  const [activeOverlay, setActiveOverlay] = useState<'default' | 'thermal' | 'signals' | 'power'>('default');

  // Selected Component for PCB inspection drawer
  const [inspectedComponent, setInspectedComponent] = useState<{
    id: string;
    name: string;
    detail: string;
  } | null>(null);

  // Active Interactive Workstation for any of the 8 zones
  const [activeWorkstationZone, setActiveWorkstationZone] = useState<EvoLabZone | null>(null);

  // Filter for 8 zones
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'in_construction'>('all');

  const filteredZones = EVO_WORLD_ZONES.filter((z) => {
    if (activeFilter === 'active') return z.statusCode === 'active';
    if (activeFilter === 'in_construction') return z.statusCode !== 'active';
    return true;
  });

  // Zones grouped into upper wing, center flanks, and lower wing
  const northWestZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-1')!;
  const northZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-2')!;
  const northEastZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-3')!;
  const eastZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-4')!;
  const southEastZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-5')!;
  const southZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-6')!;
  const southWestZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-7')!;
  const westZone = EVO_WORLD_ZONES.find((z) => z.id === 'zona-8')!;

  const handleZoneClick = (zone: EvoLabZone) => {
    setActiveWorkstationZone(zone);
  };

  const handleLaunchConsoleLab = (zoneId: string) => {
    setActiveConsoleZoneId(zoneId);
    setViewMode('console');
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-[#07080d] text-[#f4f4f5] overflow-x-hidden font-sans-editorial flex flex-col justify-between select-none">
      {/* Dynamic Background Ambient Layer */}
      <EvoWorldAmbientLayer />

      {/* Blueprint Subheader & Navigation Bar */}
      <div className="relative z-20 px-4 sm:px-8 py-3 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech">
        {/* Left: Facility Status and Active Machine Telemetry */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>MUNDO EVO // INGENIERÍA & DIAGNÓSTICO</span>
          </span>
          <span className="hidden sm:inline text-zinc-600">//</span>
          <span className="text-zinc-400 hidden sm:inline">
            SUJETO: <strong className="text-white">{passport?.cpuModel || 'ESTACIÓN DE TRABAJO LOCAL'}</strong>
          </span>
        </div>

        {/* Center: 4-Way View Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-lg">
          <button
            onClick={() => setViewMode('motherboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'motherboard'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ESQUEMÁTICO PCB</span>
          </button>

          <button
            onClick={() => setViewMode('zones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'zones'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>8 SECTORES LAB</span>
          </button>

          <button
            onClick={() => setViewMode('console')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'console'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CONSOLA 8 LABS</span>
          </button>

          <button
            onClick={() => setViewMode('live-bench')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'live-bench'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>SIMULADORES</span>
          </button>
        </div>

        {/* Right: Mode Selector & Quick Passport Specs Badge */}
        <div className="flex items-center gap-2">
          <EvoOperatingModeSelector compact />

          <span className="text-[11px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold hidden md:inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{completedChaptersCount}/7 DOSSIERS PERICIALES</span>
          </span>
        </div>
      </div>

      {/* Continuous Live Telemetry HUD Bar */}
      <EvoTelemetryHUD passport={passport} onSelectZone={handleLaunchConsoleLab} />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 flex flex-col justify-center my-auto">
        {/* ========================================================================= */}
        {/* VIEW MODE 1: INTERACTIVE CYBER-MOTHERBOARD PCB SCHEMATIC                  */}
        {/* ========================================================================= */}
        {viewMode === 'motherboard' && (
          <div className="space-y-4">
            <EvoMotherboardCanvas
              passport={passport}
              activeOverlay={activeOverlay}
              setActiveOverlay={setActiveOverlay}
            />

            {/* Quick launch cards below the schematic */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div
                onClick={() => handleLaunchConsoleLab('zona-1')}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-red-500/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                  <span className="text-red-400 font-bold">SECTOR 01</span>
                  <span className="text-zinc-500 group-hover:text-red-400 font-bold">CONSOLA →</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white">Central de Incidentes</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Triage forense de BSOD & WinDbg</p>
              </div>

              <div
                onClick={() => handleLaunchConsoleLab('zona-2')}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-400/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                  <span className="text-amber-400 font-bold">SECTOR 02</span>
                  <span className="text-zinc-500 group-hover:text-amber-400 font-bold">CONSOLA →</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white">Taller de Rendimiento</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Frametime, 1% Lows & Acústica</p>
              </div>

              <div
                onClick={() => handleLaunchConsoleLab('zona-4')}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-purple-400/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                  <span className="text-purple-400 font-bold">SECTOR 04</span>
                  <span className="text-zinc-500 group-hover:text-purple-400 font-bold">CONSOLA →</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white">Cámara de Experimentos</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Ensayos A/B de 1 sola variable</p>
              </div>

              <div
                onClick={() => handleLaunchConsoleLab('zona-5')}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-400/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
                  <span className="text-emerald-400 font-bold">SECTOR 05</span>
                  <span className="text-zinc-500 group-hover:text-emerald-400 font-bold">CONSOLA →</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white">Sala de Máquinas</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Scripts PowerShell limpios .ps1</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: 8 SECTORS ARCHITECTURAL SPATIAL FLOOR                        */}
        {/* ========================================================================= */}
        {viewMode === 'zones' && (
          <div className="relative w-full space-y-6">
            {/* Sector filter toggles */}
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-zinc-400">FACILITY DE INVESTIGACIÓN: 8 SECTORES OPERACIONALES</span>
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
                  PUBLICADOS (1)
                </button>
                <button
                  onClick={() => setActiveFilter('in_construction')}
                  className={`px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                    activeFilter === 'in_construction'
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  LABORATORIOS (7)
                </button>
              </div>
            </div>

            {/* TOP WING: Incidentes, Rendimiento, Archivo EVO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <EvoWorldZone
                zone={northWestZone}
                isSelected={false}
                onSelect={() => handleLaunchConsoleLab('zona-1')}
                onEnter={() => handleLaunchConsoleLab('zona-1')}
              />
              <EvoWorldZone
                zone={northZone}
                isSelected={false}
                onSelect={() => handleLaunchConsoleLab('zona-2')}
                onEnter={() => handleLaunchConsoleLab('zona-2')}
              />
              <EvoWorldZone
                zone={northEastZone}
                isSelected={false}
                onSelect={() => handleLaunchConsoleLab('zona-3')}
                onEnter={() => handleLaunchConsoleLab('zona-3')}
              />
            </div>

            {/* CENTER WING: West Sector, CORE (TU PC), East Sector */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-4">
                <EvoWorldZone
                  zone={westZone}
                  isSelected={false}
                  onSelect={() => handleLaunchConsoleLab('zona-8')}
                  onEnter={() => handleLaunchConsoleLab('zona-8')}
                />
              </div>

              {/* Central Workstation / Core Node */}
              <div className="md:col-span-4 flex justify-center py-2">
                <EvoWorldCore
                  passport={passport}
                  completedChaptersCount={completedChaptersCount}
                  isSelected={false}
                  onClick={() => setViewMode('motherboard')}
                />
              </div>

              <div className="md:col-span-4">
                <EvoWorldZone
                  zone={eastZone}
                  isSelected={false}
                  onSelect={() => handleLaunchConsoleLab('zona-4')}
                  onEnter={() => handleLaunchConsoleLab('zona-4')}
                />
              </div>
            </div>

            {/* BOTTOM WING: Mi Laboratorio, Zona Restringida, Sala de Máquinas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <EvoWorldZone
                zone={southWestZone}
                isSelected={false}
                onSelect={() => handleLaunchConsoleLab('zona-7')}
                onEnter={() => handleLaunchConsoleLab('zona-7')}
              />
              <EvoWorldZone
                zone={southZone}
                isSelected={false}
                onSelect={() => handleLaunchConsoleLab('zona-6')}
                onEnter={() => handleLaunchConsoleLab('zona-6')}
              />
              <EvoWorldZone
                zone={southEastZone}
                isSelected={false}
                onSelect={() => handleLaunchConsoleLab('zona-5')}
                onEnter={() => handleLaunchConsoleLab('zona-5')}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 3: FULL INTERACTIVE 8 LABS CONSOLE                              */}
        {/* ========================================================================= */}
        {viewMode === 'console' && (
          <EvoLabConsole
            initialZoneId={activeConsoleZoneId}
            passport={passport}
            onBackToMap={() => setViewMode('motherboard')}
            onEnterTomo01={() => onOpenTomo('01')}
            onEnterMagazine={() => onOpenTomo('01')}
            onEnterTomo02={() => onOpenTomo('02')}
            onEnterTomo03={() => onOpenTomo('03')}
            onEnterTomo04={() => onOpenTomo('04')}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 4: LIVE BENCHMARK & HARDWARE PHYSICS SIMULATORS                */}
        {/* ========================================================================= */}
        {viewMode === 'live-bench' && (
          <EvoLiveBenchSuite passport={passport} />
        )}
      </div>

      {/* Component Inspector Modal / Drawer */}
      {inspectedComponent && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-[#0c0f18]/95 border-t-2 border-amber-400 backdrop-blur-xl shadow-2xl p-6 transition-transform duration-300 animate-in slide-in-from-bottom-6 select-none font-mono-tech">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  COMPONENTE PCB AUDITADO
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  RECORRIDO FÍSICO
                </span>
              </div>
              <h3 className="font-display font-black text-xl text-white">
                {inspectedComponent.name}
              </h3>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
                {inspectedComponent.detail}
              </p>
            </div>

            <button
              onClick={() => setInspectedComponent(null)}
              className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              CERRAR INSPECCIÓN
            </button>
          </div>
        </div>
      )}

      {/* Full-Feature Interactive Workstation Modal */}
      {activeWorkstationZone && (
        <EvoSectorWorkstationModal
          zone={activeWorkstationZone}
          passport={passport}
          onClose={() => setActiveWorkstationZone(null)}
          onOpenTomo={onOpenTomo}
          onOpenConsoleZone={(zoneId) => {
            setActiveWorkstationZone(null);
            handleLaunchConsoleLab(zoneId);
          }}
          activeProfile={activeProfile}
          onChangeProfile={onChangeProfile}
        />
      )}

      {/* Persistent Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-zinc-900 bg-zinc-950/70 flex items-center justify-between text-xs font-mono-tech text-zinc-500">
        <div>
          EVO LABS // <span className="text-zinc-300">"Hacemos milagros, pero los medimos."</span>
        </div>
        <div className="hidden sm:block text-zinc-600">
          PLATAFORMA DE INGENIERÍA METROLÓGICA // V2.0
        </div>
      </footer>
    </div>
  );
};

