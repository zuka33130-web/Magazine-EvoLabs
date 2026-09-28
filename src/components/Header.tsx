import React, { useState, useRef, useEffect } from 'react';
import { EvoNarrativeProfile, UserHardwarePassport } from '../types';
import {
  Menu,
  Zap,
  Globe,
  Map,
  BookOpen,
  Cpu,
  Sparkles,
  Layers,
  Database,
  Library,
  ChevronDown,
  History,
  X,
  Sliders,
  Terminal,
  Activity,
  Wrench,
  Server,
  Shield,
} from 'lucide-react';
import { EvoOperatingModeSelector } from './common/EvoOperatingModeSelector';
import { EvoAutoDetectPcModal } from './common/EvoAutoDetectPcModal';
import { EvoTomoDossierModal, ForensicBenchTarget } from './common/EvoTomoDossierModal';

export interface HeaderProps {
  currentView?: string;
  activeLabPanel?: string;
  activeLabMission?: string;
  onNavigateHome?: () => void;
  onNavigateArchive?: () => void;
  onNavigateTomo01?: () => void;
  onNavigateTomo02?: () => void;
  onNavigateTomo03?: () => void;
  onNavigateTomo04?: () => void;
  onNavigateTomo05?: () => void;
  onNavigateTomo06?: () => void;
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
  currentView = 'lab-core',
  activeLabPanel,
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
  onNavigateLabCore,
  onOpenDiscoveryModal,
  onOpenCoverageDashboard,
  onOpenCaseHistory,
  onOpenLiveScanAudit,
  onOpenForensicBench,
  onHardwareDetected,
  dossierModalTomoId = null,
  onCloseDossierModal,
}) => {
  const [isAutoDetectOpen, setIsAutoDetectOpen] = useState(false);
  const [internalDossierTomoId, setInternalDossierTomoId] = useState<string | null>(null);

  // Dropdown states for header navigation
  const [openDropdown, setOpenDropdown] = useState<'tomos' | 'labs' | 'investigacion' | null>(null);
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
    }
  };

  const isTomosActive =
    currentView === 'cover' ||
    currentView === 'index' ||
    currentView.startsWith('chapter-') ||
    currentView.startsWith('tomo-');

  const isLabsActive =
    currentView === 'lab-core' ||
    currentView === 'hotswap-lab' ||
    currentView === 'windows-matrix-lab';

  const isInvestigacionActive = currentView === 'archivo';

  return (
    <>
      <header className="border-b border-white/[0.08] bg-[#07090e]/95 backdrop-blur-2xl sticky top-0 z-50 select-none font-mono-tech">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* ========================================================================= */}
          {/* ZONA IZQUIERDA: BRAND LOGO "EVO LABS"                                     */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-4 shrink-0">
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
              title="Ir al Centro de Operaciones Mundo EVO"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                <span className="font-display text-xs font-black">EVO</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg text-white tracking-tight uppercase leading-none">
                  EVO LABS
                </span>
                <span className="text-[9px] text-zinc-400 font-mono-tech tracking-wider uppercase mt-0.5">
                  METROLOGÍA & SILICIO
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ZONA CENTRAL: NAVEGACIÓN SUPERIOR PRINCIPAL (DESKTOP)                      */}
          {/* ========================================================================= */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
            
            {/* 1. MUNDO EVO */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                if (onNavigateHome) onNavigateHome();
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                currentView === 'world-map'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 font-bold shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-amber-400" />
              <span>Mundo EVO</span>
            </button>

            {/* 2. EVO CORE */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                if (onNavigateLabCore) onNavigateLabCore('LAB_ACTIVE');
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                currentView === 'lab-core'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 font-bold shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>EVO CORE</span>
            </button>

            {/* 3. TOMOS (DESPLEGABLE) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'tomos' ? null : 'tomos')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                  isTomosActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_10px_rgba(34,211,238,0.15)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tomos</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'tomos' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'tomos' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#0c0f17]/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                    BIBLIOTECA DE EDITORIAL & MANUALE
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo01) onNavigateTomo01();
                      else if (onNavigateMagazine) onNavigateMagazine();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold text-white">Tomo 01: Hardware</div>
                      <div className="text-[10px] text-zinc-400">Conocé tu PC // Silicio & Topología</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo02) onNavigateTomo02();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white">Tomo 02: Windows NT</div>
                      <div className="text-[10px] text-zinc-400">La Biblia Negra de Windows</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo03) onNavigateTomo03();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">Tomo 03: Reparación</div>
                      <div className="text-[10px] text-zinc-400">Repará tu PC // Manual de Taller</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo04) onNavigateTomo04();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <div className="font-bold text-white">Tomo 04: Notebooks</div>
                      <div className="text-[10px] text-zinc-400">Microelectrónica Portátil</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo05) onNavigateTomo05();
                      else setInternalDossierTomoId('tomo-05');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Server className="w-3.5 h-3.5 text-sky-400" />
                    <div>
                      <div className="font-bold text-white">Tomo 05: Redes & Linux</div>
                      <div className="text-[10px] text-zinc-400">Virtualización & Hipervisores</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateTomo06) onNavigateTomo06();
                      else setInternalDossierTomoId('tomo-06');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    <div>
                      <div className="font-bold text-white">Tomo 06: Ciberseguridad</div>
                      <div className="text-[10px] text-zinc-400">Kernel Forensics & Amenazas</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. REVISTA A4 */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                if (onNavigateMagazine) onNavigateMagazine();
              }}
              className={`px-3 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                currentView === 'magazine'
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 font-bold shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Revista A4</span>
            </button>

            {/* 5. LABORATORIOS (DESPLEGABLE) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'labs' ? null : 'labs')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                  isLabsActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/40 font-bold shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Laboratorios</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'labs' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'labs' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#0c0f17]/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                    SUITE METROLÓGICA Y SIMULACIÓN
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateHotSwapLab) onNavigateHotSwapLab('sandbox');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold text-white">Simulador & Lab</div>
                      <div className="text-[10px] text-zinc-400">Ultimate Silicon Sandbox</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateLabCore) onNavigateLabCore('LAB_ACTIVE');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">Nuevo Laboratorio</div>
                      <div className="text-[10px] text-zinc-400">EVO Core Metrology V1</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <div className="font-bold text-white">Hot-Swap Hardware</div>
                      <div className="text-[10px] text-zinc-400">Buses PCIe & Latencias RAM</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateHotSwapLab) onNavigateHotSwapLab('software');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white">Hot-Swap Software</div>
                      <div className="text-[10px] text-zinc-400">Interrupciones & DPC µs</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <div className="font-bold text-white">Matriz de Versiones</div>
                      <div className="text-[10px] text-zinc-400">Línea de tiempo Kernel NT</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 6. INVESTIGACIÓN Y HERRAMIENTAS (DESPLEGABLE) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'investigacion' ? null : 'investigacion')}
                className={`px-3 py-1.5 rounded-full flex items-center gap-2 transition-all cursor-pointer ${
                  isInvestigacionActive
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-400/40 font-bold shadow-[0_0_10px_rgba(192,132,252,0.15)]'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Investigación</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'investigacion' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'investigacion' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#0c0f17]/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                    RECURSOS & HERRAMIENTAS DE ANÁLISIS
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      if (onNavigateArchive) onNavigateArchive();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                  >
                    <Library className="w-3.5 h-3.5 text-purple-400" />
                    <div>
                      <div className="font-bold text-white">Expedientes & Archivo</div>
                      <div className="text-[10px] text-zinc-400">Informes & Historiales de Casos</div>
                    </div>
                  </button>

                  {onOpenDiscoveryModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onOpenDiscoveryModal();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <div className="font-bold text-white">Discovery Engine</div>
                        <div className="text-[10px] text-zinc-400">Catálogo e Indexación de Silicio</div>
                      </div>
                    </button>
                  )}

                  {onOpenCoverageDashboard && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onOpenCoverageDashboard();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <Database className="w-3.5 h-3.5 text-purple-400" />
                      <div>
                        <div className="font-bold text-white">Fuentes Tier 1</div>
                        <div className="text-[10px] text-zinc-400">Ingesta Oficial de Fabricantes</div>
                      </div>
                    </button>
                  )}

                  {onOpenCaseHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onOpenCaseHistory();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-white/[0.08] text-zinc-200 hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <div className="font-bold text-white">Historial de Casos</div>
                        <div className="text-[10px] text-zinc-400">Casos Registrados & Peritajes</div>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

          </nav>

          {/* ========================================================================= */}
          {/* ZONA DERECHA: ACCIONES RÁPIDAS (AUTO-DETECTAR PC, MODO OPERATIVO)        */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Auto-Detect PC Telemetry Trigger Button */}
            <button
              type="button"
              onClick={() => setIsAutoDetectOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/30 hover:border-amber-400 font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(251,191,36,0.12)] group text-xs"
              title="Escanear y auto-detectar silicio real con PowerShell de solo lectura"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-black animate-pulse shadow-[0_0_6px_#fbbf24] shrink-0" />
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:text-black transition-colors" />
              <span className="hidden md:inline tracking-tight">AUTO-DETECTAR PC</span>
              <span className="md:hidden">DETECTAR</span>
            </button>

            {/* Operating Mode Switcher (Esencial / Pericial) */}
            <div className="flex items-center shrink-0">
              <EvoOperatingModeSelector compact />
            </div>

            {/* Mobile Navigation Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVEGACIÓN MÓVIL (MENÚ DESPLEGABLE COMPLETO)                               */}
        {/* ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#07090e]/98 border-b border-white/10 px-4 py-4 space-y-3 font-mono-tech animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 pb-1 border-b border-white/[0.06]">
              NAVEGACIÓN EVO LABS
            </div>

            <div className="grid grid-cols-1 gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHome) onNavigateHome();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <Map className="w-4 h-4 text-amber-400" />
                <span>Mundo EVO (Mapa Central)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateLabCore) onNavigateLabCore('LAB_ACTIVE');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>EVO CORE (Digital Computer Lab)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHotSwapLab) onNavigateHotSwapLab('sandbox');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Simulador & Lab (Sandbox)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHotSwapLab) onNavigateHotSwapLab('hardware');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Hot-Swap Hardware</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHotSwapLab) onNavigateHotSwapLab('software');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Hot-Swap Software</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateWindowsMatrixLab) onNavigateWindowsMatrixLab();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Matriz de Versiones (Kernel NT)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateMagazine) onNavigateMagazine();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.06] text-white"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Revista A4 (Edición & PDF)</span>
              </button>

              <div className="pt-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest px-2 pb-1 border-b border-white/[0.06]">
                TOMOS EDITORIALES
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo01) onNavigateTomo01();
                  else if (onNavigateMagazine) onNavigateMagazine();
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Tomo 01: Hardware & Silicio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo02) onNavigateTomo02();
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tomo 02: Windows NT</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo03) onNavigateTomo03();
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tomo 03: Reparación</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateTomo04) onNavigateTomo04();
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>Tomo 04: Notebooks</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setInternalDossierTomoId('tomo-05');
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <Server className="w-3.5 h-3.5 text-sky-400" />
                <span>Tomo 05: Redes & Linux</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setInternalDossierTomoId('tomo-06');
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Tomo 06: Ciberseguridad</span>
              </button>

              <div className="pt-2 text-[10px] font-bold text-purple-400 uppercase tracking-widest px-2 pb-1 border-b border-white/[0.06]">
                INVESTIGACIÓN
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateArchive) onNavigateArchive();
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
              >
                <Library className="w-3.5 h-3.5 text-purple-400" />
                <span>Expedientes & Archivo</span>
              </button>

              {onOpenDiscoveryModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenDiscoveryModal();
                  }}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Discovery Engine</span>
                </button>
              )}

              {onOpenCoverageDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCoverageDashboard();
                  }}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Fuentes Tier 1</span>
                </button>
              )}

              {onOpenCaseHistory && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCaseHistory();
                  }}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.06] text-zinc-300"
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Historial de Casos</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auto-Detect PC Modal */}
      <EvoAutoDetectPcModal
        isOpen={isAutoDetectOpen}
        onClose={() => setIsAutoDetectOpen(false)}
        onHardwareDetected={(hw) => {
          if (onHardwareDetected) onHardwareDetected(hw);
        }}
      />

      {/* Tomo Dossier Modal for T01 to T06: Apertura en Portada */}
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
