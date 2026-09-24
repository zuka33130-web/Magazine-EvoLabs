import React, { useState } from 'react';
import { EvoNarrativeProfile, UserHardwarePassport } from '../types';
import { EVO_NARRATIVE_PROFILES } from '../data/evoWorldData';
import { Map, Library, BookOpen, RotateCcw, Compass, Zap, Shield, Server, Activity } from 'lucide-react';
import { EvoOperatingModeSelector } from './common/EvoOperatingModeSelector';
import { EvoAutoDetectPcModal } from './common/EvoAutoDetectPcModal';
import { EvoTomoDossierModal, ForensicBenchTarget } from './common/EvoTomoDossierModal';

interface HeaderProps {
  currentView?: string;
  onNavigateHome?: () => void;
  onNavigateArchive?: () => void;
  onNavigateTomo01?: () => void;
  onNavigateTomo02?: () => void;
  onNavigateTomo03?: () => void;
  onNavigateTomo04?: () => void;
  onNavigateTomo05?: () => void;
  onNavigateTomo06?: () => void;
  onNavigateMagazine?: () => void;
  onNavigateHotSwapLab?: () => void;
  onNavigateWindowsMatrixLab?: () => void;
  onOpenForensicBench?: (target: ForensicBenchTarget) => void;
  activeProfile?: EvoNarrativeProfile;
  onReplayIntro?: () => void;
  onHardwareDetected?: (hardware: UserHardwarePassport) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onNavigateArchive,
  onNavigateTomo01,
  onNavigateTomo02,
  onNavigateTomo03,
  onNavigateTomo04,
  onNavigateTomo05,
  onNavigateTomo06,
  onNavigateMagazine,
  onNavigateHotSwapLab,
  onNavigateWindowsMatrixLab,
  onOpenForensicBench,
  activeProfile = 'investigador',
  onReplayIntro,
  onHardwareDetected,
}) => {
  const [isAutoDetectOpen, setIsAutoDetectOpen] = useState(false);
  const [dossierModalTomoId, setDossierModalTomoId] = useState<string | null>(null);

  const isHomeMap = currentView === 'world-map';
  const isArchive = currentView === 'archivo';
  const isMagazine = currentView === 'magazine';
  const isHotSwap = currentView === 'hotswap-lab';
  const isWindowsMatrix = currentView === 'windows-matrix-lab' || currentView === 'matrix-lab';
  const profileData = EVO_NARRATIVE_PROFILES[activeProfile] || EVO_NARRATIVE_PROFILES.investigador;

  const handleOpenTomoCover = (tomoId: string) => {
    setDossierModalTomoId(tomoId);
  };

  const handleOpenTomo01 = () => {
    handleOpenTomoCover('tomo-01');
  };

  const handleOpenTomo02 = () => {
    handleOpenTomoCover('tomo-02');
  };

  const handleOpenTomo03 = () => {
    handleOpenTomoCover('tomo-03');
  };

  const handleOpenTomo04 = () => {
    handleOpenTomoCover('tomo-04');
  };

  const handleOpenTomo05 = () => {
    handleOpenTomoCover('tomo-05');
  };

  const handleOpenTomo06 = () => {
    handleOpenTomoCover('tomo-06');
  };

  const handleProceedToTomoView = (id: string) => {
    setDossierModalTomoId(null);
    if (id === 'tomo-01') {
      if (onNavigateTomo01) onNavigateTomo01();
      else if (onNavigateMagazine) onNavigateMagazine();
    } else if (id === 'tomo-02' && onNavigateTomo02) {
      onNavigateTomo02();
    } else if (id === 'tomo-03' && onNavigateTomo03) {
      onNavigateTomo03();
    } else if (id === 'tomo-04' && onNavigateTomo04) {
      onNavigateTomo04();
    } else if (id === 'tomo-05' && onNavigateTomo05) {
      onNavigateTomo05();
    } else if (id === 'tomo-06' && onNavigateTomo06) {
      onNavigateTomo06();
    }
  };

  return (
    <>
      <header className="border-b border-zinc-800/80 bg-[#090a0e]/95 backdrop-blur-md sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Masthead: EVO LABS + Identity phrase */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group shrink-0"
            title="Volver al Mapa del Laboratorio"
          >
            <span className="w-3 h-3 bg-amber-400 rounded-none inline-block shadow-[0_0_12px_#facc15] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none">
                EVO LABS
              </span>
              <span className="text-[11px] font-mono-tech text-amber-400 font-semibold tracking-wide hidden sm:block">
                “Hacemos milagros, pero los medimos.”
              </span>
            </div>
          </div>

          {/* Center/Right Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono-tech text-xs overflow-x-auto py-1">
            
            {/* Auto-Detect My PC Trigger Button */}
            <button
              type="button"
              onClick={() => setIsAutoDetectOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-transparent hover:from-amber-400 hover:to-amber-300 text-amber-300 hover:text-black border border-amber-400/50 hover:border-amber-400 font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.2)] shrink-0 group"
              title="Auto-detectar especificaciones reales de mi PC con comando nativo de PowerShell (CIM/WMI de solo lectura)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:text-black transition-colors" />
              <span className="hidden lg:inline">⚡ AUTO-DETECTAR MI PC</span>
              <span className="lg:hidden">⚡ DETECTAR PC</span>
            </button>

            {/* Navigation Pill between World Map, Archive and Tomo */}
            <div className="flex items-center bg-[#13151f] p-1 rounded-xl border border-zinc-800 shrink-0">
              <button
                type="button"
                onClick={onNavigateHome}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHomeMap
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MUNDO EVO</span>
                <span className="sm:hidden">MAPA</span>
              </button>

              <button
                type="button"
                onClick={onNavigateArchive}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isArchive
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Library className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ARCHIVO EVO</span>
                <span className="sm:hidden">ARCHIVO</span>
              </button>

              {/* Tomos 01 al 06 direct selector: APERTURA OBLIGATORIA EN PORTADA */}
              <div className="flex items-center gap-1 border-l border-zinc-800 pl-1.5 ml-1">
                <button
                  type="button"
                  onClick={handleOpenTomo01}
                  className={`px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                    dossierModalTomoId === 'tomo-01' || currentView === 'magazine'
                      ? 'bg-amber-400 text-black shadow'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/40'
                  }`}
                  title="Tomo 01: Conocé tu PC // Hardware (46 páginas A4)"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>T01</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTomo02}
                  className={`px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                    dossierModalTomoId === 'tomo-02' || currentView === 'tomo-02'
                      ? 'bg-cyan-400 text-black shadow'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-400/40'
                  }`}
                  title="Tomo 02: La Biblia Negra de Windows (26 áreas / 48 páginas A4)"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>T02</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTomo03}
                  className={`px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                    dossierModalTomoId === 'tomo-03' || currentView === 'tomo-03'
                      ? 'bg-emerald-400 text-black shadow'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-400/40'
                  }`}
                  title="Tomo 03: Repará tu PC // Manual de Taller (35 módulos / 122 páginas A4)"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>T03</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTomo04}
                  className={`px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                    dossierModalTomoId === 'tomo-04' || currentView === 'tomo-04'
                      ? 'bg-purple-400 text-white shadow'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-400/40'
                  }`}
                  title="Tomo 04: Repará tu Notebook // Micromecánica (22 páginas / roadmap)"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>T04</span>
                </button>

                {/* Tomo 05 Button */}
                <button
                  type="button"
                  onClick={handleOpenTomo05}
                  className={`px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                    dossierModalTomoId === 'tomo-05'
                      ? 'bg-sky-400 text-black shadow'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-sky-400/40'
                  }`}
                  title="Tomo 05: Redes, Linux y Virtualización (12 módulos / 210 páginas A4)"
                >
                  <Server className="w-3 h-3" />
                  <span>T05</span>
                </button>

                {/* Tomo 06 Button */}
                <button
                  type="button"
                  onClick={handleOpenTomo06}
                  className={`px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                    dossierModalTomoId === 'tomo-06'
                      ? 'bg-rose-500 text-white shadow'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-400/40'
                  }`}
                  title="Tomo 06: Ciberseguridad Ofensiva y Análisis de Malware (12 módulos / 220 páginas A4)"
                >
                  <Shield className="w-3 h-3" />
                  <span>T06</span>
                </button>
              </div>

              {onNavigateMagazine && (
                <button
                  type="button"
                  onClick={onNavigateMagazine}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ml-1 ${
                    isMagazine
                      ? 'bg-yellow-400 text-black font-bold shadow'
                      : 'bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-semibold'
                  }`}
                  title="Abrir edición digital impresa A4 de EVO LABS MAGAZINE (con descargas PDF)"
                >
                  <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="hidden sm:inline">REVISTA A4</span>
                  <span className="sm:hidden">REVISTA</span>
                </button>
              )}

              {onNavigateHotSwapLab && (
                <button
                  type="button"
                  onClick={onNavigateHotSwapLab}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ml-1 ${
                    isHotSwap
                      ? 'bg-amber-400 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                      : 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 font-semibold'
                  }`}
                  title="Abrir Simulador Definitivo EVO y Banco de Ensamble de Hardware/Software"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">SIMULADOR & LAB</span>
                  <span className="sm:hidden">SIMULADOR</span>
                </button>
              )}

              {onNavigateWindowsMatrixLab && (
                <button
                  type="button"
                  onClick={onNavigateWindowsMatrixLab}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ml-1 ${
                    isWindowsMatrix
                      ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                  }`}
                  title="Abrir Matriz de Versiones Windows & Planificador de Kernel NT"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">MATRIZ DE VERSIONES & KERNEL NT</span>
                  <span className="sm:hidden">KERNEL NT</span>
                </button>
              )}
            </div>

            {/* Dark Industrial Mode Selector: MODO ESENCIAL / MODO PERICIAL */}
            <div className="flex items-center shrink-0">
              <EvoOperatingModeSelector compact />
            </div>

            {/* Top Right Master EVO LABS Button */}
            <button
              type="button"
              onClick={onNavigateHome}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer font-mono-tech font-bold text-xs uppercase tracking-wider border shadow-md shrink-0 ${
                isHomeMap
                  ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)] ring-2 ring-amber-400/30'
                  : 'bg-amber-500/10 hover:bg-amber-400 text-amber-400 hover:text-black border-amber-400/50 hover:border-amber-400 shadow-sm'
              }`}
              title="Abrir Centro de Ingeniería y Metrología Mundo EVO"
            >
              <span className={`w-2 h-2 rounded-full ${isHomeMap ? 'bg-black animate-pulse' : 'bg-amber-400 animate-ping'}`} />
              <Map className="w-3.5 h-3.5" />
              <span className="font-display font-black tracking-normal">EVO LABS</span>
              <span className="hidden xl:inline text-[10px] opacity-80">// MUNDO EVO</span>
            </button>

            {/* Active Profile Pill (Discreet) */}
            <div
              title="Perfil de Operador Narrativo Activo"
              className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-300 shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-zinc-500 uppercase leading-none">PERFIL</span>
                <span className="font-bold text-white text-[10px] uppercase tracking-wider">
                  {profileData.title}
                </span>
              </div>
            </div>

            {/* Replay Intro Button */}
            {onReplayIntro && (
              <button
                type="button"
                onClick={onReplayIntro}
                title="Volver a ver la presentación cinemática inicial"
                className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auto-Detect PC Modal */}
      <EvoAutoDetectPcModal
        isOpen={isAutoDetectOpen}
        onClose={() => setIsAutoDetectOpen(false)}
        onHardwareDetected={(hw) => {
          if (onHardwareDetected) onHardwareDetected(hw);
        }}
      />

      {/* Tomo Dossier Modal for T01 to T06: Apertura Obligatoria en Portada */}
      <EvoTomoDossierModal
        isOpen={!!dossierModalTomoId}
        tomoId={dossierModalTomoId}
        onClose={() => setDossierModalTomoId(null)}
        onOpenTomoView={handleProceedToTomoView}
        onOpenForensicBench={(target) => {
          setDossierModalTomoId(null);
          if (onOpenForensicBench) {
            onOpenForensicBench(target);
          }
        }}
      />
    </>
  );
};

