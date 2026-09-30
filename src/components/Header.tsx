import React, { useState, useRef, useEffect } from 'react';
import { EvoNarrativeProfile, UserHardwarePassport } from '../types';
import {
  Menu,
  Zap,
  Map,
  BookOpen,
  Cpu,
  Layers,
  ChevronDown,
  X,
  Terminal,
  Shield,
  Network,
  Gauge,
  Power,
  FileSearch,
  Compass,
  FolderGit2,
  Trophy,
} from 'lucide-react';
import { EvoOperatingModeSelector } from './common/EvoOperatingModeSelector';
import { EvoAutoDetectPcModal } from './common/EvoAutoDetectPcModal';
import { EvoTomoDossierModal, ForensicBenchTarget } from './common/EvoTomoDossierModal';

export interface HeaderProps {
  currentView?: string;
  activeLabPanel?: string;
  activeLabMission?: string;
  campusSection?: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso';
  onNavigateHome?: () => void;
  onNavigateCampusSection?: (section: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso') => void;
  onNavigateArchive?: () => void;
  onNavigateTomo01?: () => void;
  onNavigateTomo02?: () => void;
  onNavigateTomo03?: () => void;
  onNavigateTomo04?: () => void;
  onNavigateTomo05?: () => void;
  onNavigateTomo06?: () => void;
  onNavigateTomo08?: () => void;
  onNavigateBootLab?: () => void;
  onNavigateMagazine?: () => void;
  onNavigateHotSwapLab?: (subPanel?: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'all') => void;
  onNavigateWindowsMatrixLab?: () => void;
  onNavigateLabCore?: (phase?: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE') => void;
  onOpenDiscoveryModal?: () => void;
  onOpenCoverageDashboard?: () => void;
  onOpenCaseHistory?: () => void;
  onOpenLiveScanAudit?: () => void;
  onOpenForensicBench?: (target: ForensicBenchTarget) => void;
  activeProfile?: EvoNarrativeProfile;
  onReplayIntro?: () => void;
  onHardwareDetected?: (hardware: UserHardwarePassport) => void;
  dossierModalTomoId?: string | null;
  onCloseDossierModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'world-map',
  campusSection = 'campus',
  onNavigateHome,
  onNavigateCampusSection,
  onNavigateTomo01,
  onNavigateTomo02,
  onNavigateTomo03,
  onNavigateTomo04,
  onNavigateTomo05,
  onNavigateTomo06,
  onNavigateTomo08,
  onNavigateBootLab,
  onNavigateMagazine,
  onNavigateHotSwapLab,
  onNavigateWindowsMatrixLab,
  onNavigateLabCore,
  onOpenForensicBench,
  onHardwareDetected,
  dossierModalTomoId = null,
  onCloseDossierModal,
}) => {
  const [isAutoDetectOpen, setIsAutoDetectOpen] = useState(false);
  const [internalDossierTomoId, setInternalDossierTomoId] = useState<string | null>(null);

  // Dropdown states for header navigation
  const [openDropdown, setOpenDropdown] = useState<'tomos' | 'labs' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeDossierId = dossierModalTomoId || internalDossierTomoId;

  const handleProceedToTomoView = (id: string) => {
    setInternalDossierTomoId(null);
    if (onCloseDossierModal) onCloseDossierModal();

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
    } else if (id === 'tomo-08' && onNavigateTomo08) {
      onNavigateTomo08();
    }
  };

  const isMundoEvoActive = currentView === 'world-map' && campusSection === 'campus';
  const isEscuelaActive = currentView === 'world-map' && campusSection === 'escuela';
  const isCasosActive = currentView === 'world-map' && campusSection === 'diagnosticar';
  const isProgresoActive = currentView === 'world-map' && campusSection === 'progreso';

  const isTomosActive =
    currentView === 'magazine' ||
    currentView === 'cover' ||
    currentView === 'index' ||
    currentView.startsWith('chapter-') ||
    currentView.startsWith('tomo-');

  const isLabsActive =
    currentView === 'lab-core' ||
    currentView === 'hotswap-lab' ||
    currentView === 'windows-matrix-lab' ||
    currentView === 'boot-lab';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/95 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.85)] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* ========================================================================= */}
          {/* ZONA IZQUIERDA: LOGOTIPO EVO LABS (VUELVE A MUNDO EVO)                   */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else if (onNavigateCampusSection) onNavigateCampusSection('campus');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (onNavigateHome) onNavigateHome();
                  else if (onNavigateCampusSection) onNavigateCampusSection('campus');
                }
              }}
              className="group flex items-center gap-2.5 sm:gap-3 py-1 cursor-pointer select-none focus:outline-none"
              title="Volver a Mundo EVO // Campus Central"
            >
              {/* Emblema EVO */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_22px_rgba(245,158,11,0.55)] transition-all duration-300">
                <div className="w-full h-full bg-[#080a11] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 6L7.5 8.5V13.5L12 16L16.5 13.5V8.5L12 6Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="12" cy="11" r="1.5" fill="#fef08a" />
                  </svg>
                </div>
              </div>

              {/* Logotipo Tipográfico EVO LABS */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-display font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]">
                    EVO
                  </span>
                  <span className="font-display font-extrabold text-lg tracking-wider text-white">
                    LABS
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono-tech font-bold uppercase tracking-wider ml-0.5 hidden sm:inline-block">
                    ACADEMIA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-amber-400/80 animate-pulse" />
                  <span className="text-[9px] text-zinc-400 font-mono-tech tracking-widest uppercase font-medium">
                    SISTEMA DE APRENDIZAJE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ZONA CENTRAL: NAVEGACIÓN SUPERIOR PRINCIPAL (DESKTOP)                      */}
          {/* REGLA: [ MUNDO EVO ] [ ESCUELA ] [ TOMOS EVO ] [ LABORATORIOS ] [ CASOS ] */}
          {/* ========================================================================= */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[#0b0e17]/85 border border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.4)] text-xs font-semibold">
            
            {/* 1. MUNDO EVO */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                if (onNavigateCampusSection) onNavigateCampusSection('campus');
                else if (onNavigateHome) onNavigateHome();
              }}
              title="Campus Principal EVO LABS"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer select-none group relative ${
                isMundoEvoActive
                  ? 'bg-gradient-to-b from-amber-400/20 via-amber-500/12 to-amber-500/5 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              <span>Mundo EVO</span>
              {isMundoEvoActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse" />
              )}
            </button>

            {/* 2. ESCUELA */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                if (onNavigateCampusSection) onNavigateCampusSection('escuela');
                else if (onNavigateHome) onNavigateHome();
              }}
              title="Escuela EVO // Ruta de formación recomendada por niveles"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer select-none group relative ${
                isEscuelaActive
                  ? 'bg-gradient-to-b from-amber-400/20 via-amber-500/12 to-amber-500/5 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
              <span>Escuela</span>
              {isEscuelaActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse" />
              )}
            </button>

            {/* 3. TOMOS EVO (DESPLEGABLE UNIFICADO - 10 TOMOS) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'tomos' ? null : 'tomos')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer select-none group relative ${
                  isTomosActive
                    ? 'bg-gradient-to-b from-cyan-400/20 via-cyan-500/12 to-cyan-500/5 text-cyan-200 border border-cyan-400/40 font-bold shadow-[0_0_16px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : openDropdown === 'tomos'
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform duration-200" />
                <span>Tomos EVO</span>
                {isTomosActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                )}
                <ChevronDown className={`w-3 h-3 text-zinc-400 group-hover:text-cyan-300 transition-transform duration-200 ${openDropdown === 'tomos' ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>

              {openDropdown === 'tomos' && (
                <div className="absolute top-full left-0 mt-2.5 w-88 bg-[#080b12]/98 border border-white/[0.12] rounded-2xl p-2.5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 max-h-[82vh] overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] font-bold uppercase text-cyan-400/90 tracking-wider flex items-center justify-between">
                    <span>TOMOS EVO LABS // CATÁLOGO OFICIAL</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-mono-tech">10 TOMOS</span>
                  </div>
                  
                  {/* TOMO 01 — Conocé tu PC (Revista Interactiva) */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo01) onNavigateTomo01();
                      else if (onNavigateMagazine) onNavigateMagazine();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between gap-1.5">
                        <span className="truncate">TOMO 01 — Conocé tu PC</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                          REVISTA INTERACTIVA
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">“Entendé tu máquina desde adentro.”</div>
                    </div>
                  </button>

                  {/* TOMO 02 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo02) onNavigateTomo02();
                      else setInternalDossierTomoId('tomo-02');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">TOMO 02 — La Biblia Negra de Windows</div>
                      <div className="text-[10px] text-zinc-400 truncate">“El lado oculto de Windows. Descubrilo.”</div>
                    </div>
                  </button>

                  {/* TOMO 03 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo03) onNavigateTomo03();
                      else setInternalDossierTomoId('tomo-03');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">TOMO 03 — Reparación de PC</div>
                      <div className="text-[10px] text-zinc-400 truncate">“Nunca estuviste mejor guiado.”</div>
                    </div>
                  </button>

                  {/* TOMO 04 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo04) onNavigateTomo04();
                      else setInternalDossierTomoId('tomo-04');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-400/10 border border-purple-400/20 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-purple-300 transition-colors">TOMO 04 — Reparación de Notebooks</div>
                      <div className="text-[10px] text-zinc-400 truncate">“Diagnóstico real, paso a paso.”</div>
                    </div>
                  </button>

                  {/* TOMO 05 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo05) onNavigateTomo05();
                      else setInternalDossierTomoId('tomo-05');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Network className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">TOMO 05 — Redes // Sistema EVO Labs</div>
                      <div className="text-[10px] text-zinc-400 truncate">“Entendé cómo se comunica tu PC y viaja Internet.”</div>
                    </div>
                  </button>

                  {/* TOMO 06 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo06) onNavigateTomo06();
                      else setInternalDossierTomoId('tomo-06');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-400/10 border border-rose-400/20 text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-rose-300 transition-colors">TOMO 06 — Ciberseguridad</div>
                      <div className="text-[10px] text-zinc-400 truncate">“Desde cero hasta dominar tu red.”</div>
                    </div>
                  </button>

                  {/* TOMO 07 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      setInternalDossierTomoId('tomo-07');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Gauge className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-amber-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">TOMO 07 — Gaming & Performance PRO</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 shrink-0">
                          EN DESARROLLO
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">“Optimizamos de verdad. Sin secretos.”</div>
                    </div>
                  </button>

                  {/* TOMO 08 — Reparación de PC (Con Lab Activo) */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo08) onNavigateTomo08();
                      else setInternalDossierTomoId('tomo-08');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400/60 text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 shrink-0 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-emerald-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">TOMO 08 — Reparación de PC (Con Lab Activo)</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 shrink-0">
                          LAB ACTIVO
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">“Del botón POWER a Windows, paso a paso.”</div>
                    </div>
                  </button>

                  {/* TOMO 09 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      setInternalDossierTomoId('tomo-09');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-400/10 border border-sky-400/20 text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-sky-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">TOMO 09 — Sistemas y Kernel NT</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-300 border border-sky-400/30 shrink-0">
                          EN DESARROLLO
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">“Entendé qué pasa debajo del sistema operativo.”</div>
                    </div>
                  </button>

                  {/* TOMO 10 */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      setInternalDossierTomoId('tomo-10');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-400/10 border border-purple-400/20 text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                      <FileSearch className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-purple-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">TOMO 10 — Forense e Ingeniería Inversa</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-300 border border-purple-400/30 shrink-0">
                          EN DESARROLLO
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">“No mires sólo el resultado. Reconstruí lo que pasó.”</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. LABORATORIOS (DESPLEGABLE: 4 ENTRADAS OFICIALES) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'labs' ? null : 'labs')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer select-none group relative ${
                  isLabsActive
                    ? 'bg-gradient-to-b from-emerald-400/20 via-emerald-500/12 to-emerald-500/5 text-emerald-200 border border-emerald-400/40 font-bold shadow-[0_0_16px_rgba(16,185,129,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : openDropdown === 'labs'
                    ? 'bg-white/[0.08] text-white border border-white/[0.12]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                <span>Laboratorios</span>
                {isLabsActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                )}
                <ChevronDown className={`w-3 h-3 text-zinc-400 group-hover:text-emerald-300 transition-transform duration-200 ${openDropdown === 'labs' ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>

              {openDropdown === 'labs' && (
                <div className="absolute top-full left-0 mt-2.5 w-88 bg-[#080b12]/98 border border-white/[0.12] rounded-2xl p-2.5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] font-bold uppercase text-emerald-400/90 tracking-wider flex items-center justify-between">
                    <span>SUITE DE LABORATORIOS TÉCNICOS</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-mono-tech">4 ESPACIOS</span>
                  </div>

                  {/* 1. Laboratorio de Arranque y Fallas (Tomo 08) */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateBootLab) onNavigateBootLab();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 shrink-0 group-hover:scale-105 transition-transform">
                      <Power className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-emerald-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">Laboratorio de Arranque y Fallas</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 shrink-0">
                          TOMO 08
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">Diagnóstico físico de arranque, 35 estados, gabinete y multímetro.</div>
                    </div>
                  </button>

                  {/* 2. Banco de Pruebas Windows Matrix */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 shrink-0 group-hover:scale-105 transition-transform">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-cyan-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">Banco de Pruebas Windows Matrix</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 shrink-0">
                          KERNEL NT
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">Scheduler de Kernel, mitigaciones, drivers y latencias de sistema.</div>
                    </div>
                  </button>

                  {/* 3. Banco Hot-Swap de Hardware */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-amber-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">Banco Hot-Swap de Hardware</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200 border border-amber-400/40 shrink-0">
                          HARDWARE
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">Intercambio de componentes, medición de telemetría y cuellos de botella.</div>
                    </div>
                  </button>

                  {/* 4. Laboratorio de Operaciones EVO */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateLabCore) onNavigateLabCore('LAB_ACTIVE');
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs hover:bg-white/[0.08] hover:border-white/[0.08] border border-transparent text-zinc-200 hover:text-white flex items-center gap-2.5 transition-all group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-400/20 border border-purple-400/40 text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white group-hover:text-purple-300 flex items-center justify-between gap-1.5">
                        <span className="truncate">Laboratorio de Operaciones EVO</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-200 border border-purple-400/40 shrink-0">
                          CENTRAL
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">Entorno central de simulación, telemetría y metrología de PC.</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 5. CASOS */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                if (onNavigateCampusSection) onNavigateCampusSection('diagnosticar');
                else if (onNavigateHome) onNavigateHome();
              }}
              title="Taller de Casos y Expedientes Técnicos"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer select-none group relative ${
                isCasosActive
                  ? 'bg-gradient-to-b from-purple-400/20 via-purple-500/12 to-purple-500/5 text-purple-200 border border-purple-400/40 font-bold shadow-[0_0_16px_rgba(168,85,247,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
              <span>Casos</span>
              {isCasosActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc] animate-pulse" />
              )}
            </button>
          </nav>

          {/* ========================================================================= */}
          {/* ZONA DERECHA: [ MI PROGRESO ] [ MODO / PERFIL ] + MENÚ MÓVIL             */}
          {/* (ESCÁNER EVO RETIRADO DE LA NAVEGACIÓN VISIBLE)                           */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* MI PROGRESO (Acceso directo limpio) */}
            <button
              type="button"
              onClick={() => {
                if (onNavigateCampusSection) onNavigateCampusSection('progreso');
                else if (onNavigateHome) onNavigateHome();
              }}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all duration-200 cursor-pointer text-xs font-semibold select-none ${
                isProgresoActive
                  ? 'bg-amber-400/20 text-amber-200 border-amber-400/50 shadow-[0_0_14px_rgba(245,158,11,0.25)]'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08] hover:border-white/[0.15]'
              }`}
              title="Consultar Mi Progreso y Expediente Académico"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Mi Progreso</span>
            </button>

            {/* Selector de Modo Operativo (Esencial / Pericial) */}
            <div className="flex items-center shrink-0">
              <EvoOperatingModeSelector compact />
            </div>

            {/* Mobile Navigation Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/10 transition-all cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVEGACIÓN MÓVIL (MENÚ DESPLEGABLE COMPLETO CON ARQUITECTURA OFICIAL)      */}
        {/* ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#07090e]/98 border-b border-white/10 px-4 py-4 space-y-3 font-mono-tech animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 pb-1 border-b border-white/[0.06] flex items-center justify-between">
              <span>ACADEMIA EVO LABS // CAMPUS</span>
            </div>

            <div className="grid grid-cols-1 gap-1 text-xs">
              {/* 1. Mundo EVO */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateCampusSection) onNavigateCampusSection('campus');
                  else if (onNavigateHome) onNavigateHome();
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isMundoEvoActive
                    ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
                    : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent hover:border-white/[0.08]'
                }`}
              >
                <div className="p-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                  <Map className="w-4 h-4" />
                </div>
                <span>Mundo EVO (Campus Principal)</span>
              </button>

              {/* 2. Escuela EVO */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateCampusSection) onNavigateCampusSection('escuela');
                  else if (onNavigateHome) onNavigateHome();
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isEscuelaActive
                    ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
                    : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent hover:border-white/[0.08]'
                }`}
              >
                <div className="p-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <span>Escuela EVO (Ruta por Niveles)</span>
              </button>

              {/* 3. Casos */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateCampusSection) onNavigateCampusSection('diagnosticar');
                  else if (onNavigateHome) onNavigateHome();
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isCasosActive
                    ? 'bg-purple-400/15 text-purple-200 border border-purple-400/40 font-bold'
                    : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent hover:border-white/[0.08]'
                }`}
              >
                <div className="p-1 rounded-lg bg-purple-400/10 border border-purple-400/20 text-purple-400 shrink-0">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <span>Taller de Casos y Expedientes</span>
              </button>

              {/* 4. Mi Progreso */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateCampusSection) onNavigateCampusSection('progreso');
                  else if (onNavigateHome) onNavigateHome();
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isProgresoActive
                    ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
                    : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent hover:border-white/[0.08]'
                }`}
              >
                <div className="p-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <span>Mi Progreso Académico</span>
              </button>

              {/* Sección TOMOS EVO */}
              <div className="pt-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2 pb-1 border-b border-white/[0.06] flex items-center justify-between">
                <span>TOMOS EVO LABS</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300 font-mono-tech">10 TOMOS</span>
              </div>

              {/* Tomo 01 */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo01) onNavigateTomo01();
                  else if (onNavigateMagazine) onNavigateMagazine();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">TOMO 01 — Conocé tu PC</span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
                  REVISTA INTERACTIVA
                </span>
              </button>

              {/* Tomo 02 */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo02) onNavigateTomo02();
                  else setInternalDossierTomoId('tomo-02');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">TOMO 02 — La Biblia Negra de Windows</span>
              </button>

              {/* Tomo 03 */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo03) onNavigateTomo03();
                  else setInternalDossierTomoId('tomo-03');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">TOMO 03 — Reparación de PC</span>
              </button>

              {/* Tomo 04 */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo04) onNavigateTomo04();
                  else setInternalDossierTomoId('tomo-04');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">TOMO 04 — Reparación de Notebooks</span>
              </button>

              {/* Tomo 08 */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo08) onNavigateTomo08();
                  else setInternalDossierTomoId('tomo-08');
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">TOMO 08 — Reparación de PC</span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 shrink-0">
                  LAB ACTIVO
                </span>
              </button>

              {/* Sección LABORATORIOS */}
              <div className="pt-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 pb-1 border-b border-white/[0.06] flex items-center justify-between">
                <span>LABORATORIOS TÉCNICOS</span>
              </div>

              {/* Lab Arranque Tomo 08 */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateBootLab) onNavigateBootLab();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <Power className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Lab de Arranque y Fallas</span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 shrink-0">
                  TOMO 08
                </span>
              </button>

              {/* Windows Matrix */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Banco Windows Matrix</span>
              </button>

              {/* Hot-Swap */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Banco Hot-Swap de Hardware</span>
              </button>

              {/* Lab Operaciones */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateLabCore) onNavigateLabCore('LAB_ACTIVE');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-zinc-200 hover:text-white transition-all text-left"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Laboratorio de Operaciones EVO</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auto-Detect PC Modal (Conservado para funcionalidad interna / diagnóstico) */}
      <EvoAutoDetectPcModal
        isOpen={isAutoDetectOpen}
        onClose={() => setIsAutoDetectOpen(false)}
        onHardwareDetected={(hw) => {
          if (onHardwareDetected) onHardwareDetected(hw);
        }}
      />

      {/* Tomo Dossier Modal for T01 to T10 */}
      <EvoTomoDossierModal
        isOpen={!!activeDossierId}
        tomoId={activeDossierId}
        onClose={() => {
          setInternalDossierTomoId(null);
          if (onCloseDossierModal) onCloseDossierModal();
        }}
        onOpenTomoView={handleProceedToTomoView}
        onOpenForensicBench={(target) => {
          setInternalDossierTomoId(null);
          if (onCloseDossierModal) onCloseDossierModal();
          if (onOpenForensicBench) onOpenForensicBench(target);
        }}
      />
    </>
  );
};
