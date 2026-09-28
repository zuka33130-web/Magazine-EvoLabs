import React, { useState } from 'react';
import { EvoNarrativeProfile, UserHardwarePassport } from '../types';
import { Menu, Zap, RotateCcw, Activity } from 'lucide-react';
import { EvoOperatingModeSelector } from './common/EvoOperatingModeSelector';
import { EvoAutoDetectPcModal } from './common/EvoAutoDetectPcModal';
import { EvoTomoDossierModal, ForensicBenchTarget } from './common/EvoTomoDossierModal';
import { EvoLabAestheticToggle } from './common/EvoLabAestheticToggle';

interface HeaderProps {
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
  onNavigateHotSwapLab?: () => void;
  onNavigateWindowsMatrixLab?: () => void;
  onNavigateLabCore?: () => void;
  onOpenForensicBench?: (target: ForensicBenchTarget) => void;
  activeProfile?: EvoNarrativeProfile;
  onReplayIntro?: () => void;
  onHardwareDetected?: (hardware: UserHardwarePassport) => void;
  onToggleMobileNav?: () => void;
  dossierModalTomoId?: string | null;
  onCloseDossierModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'lab-core',
  activeLabPanel,
  onNavigateHome,
  onNavigateTomo01,
  onNavigateTomo02,
  onNavigateTomo03,
  onNavigateTomo04,
  onNavigateTomo05,
  onNavigateTomo06,
  onNavigateMagazine,
  onOpenForensicBench,
  onReplayIntro,
  onHardwareDetected,
  onToggleMobileNav,
  dossierModalTomoId = null,
  onCloseDossierModal,
}) => {
  const [isAutoDetectOpen, setIsAutoDetectOpen] = useState(false);
  const [internalDossierTomoId, setInternalDossierTomoId] = useState<string | null>(null);

  const activeDossierId = dossierModalTomoId || internalDossierTomoId;

  // Compute readable module category and name for contextual header breadcrumb
  const getModuleInfo = (): { category: string; name: string; tag: string; accentColor: string } => {
    switch (currentView) {
      case 'lab-core':
        return {
          category: 'SOFTWARE',
          name: 'EVO CORE DIGITAL COMPUTER LAB',
          tag: 'V1 CORE',
          accentColor: '#fbbf24',
        };
      case 'hotswap-lab':
        if (activeLabPanel === 'sandbox') {
          return {
            category: 'LABORATORIOS',
            name: 'SIMULADOR DEFINITIVO EVO',
            tag: 'SANDBOX',
            accentColor: '#fbbf24',
          };
        }
        if (activeLabPanel === 'hardware') {
          return {
            category: 'LABORATORIOS',
            name: 'HOT-SWAP DE HARDWARE & LATENCIA',
            tag: 'SILICON',
            accentColor: '#fbbf24',
          };
        }
        if (activeLabPanel === 'software') {
          return {
            category: 'LABORATORIOS',
            name: 'HOT-SWAP DE SOFTWARE & DPC µs',
            tag: 'KERNEL',
            accentColor: '#22d3ee',
          };
        }
        if (activeLabPanel === 'telemetry') {
          return {
            category: 'LABORATORIOS',
            name: 'PARSER REACTIVO DE TELEMETRÍA',
            tag: 'CIM/WMI',
            accentColor: '#34d399',
          };
        }
        return {
          category: 'LABORATORIOS',
          name: 'TALLER METROLÓGICO INTEGRAL',
          tag: 'SUITE',
          accentColor: '#34d399',
        };
      case 'windows-matrix-lab':
        return {
          category: 'LABORATORIOS',
          name: 'MATRIZ DE VERSIONES & KERNEL NT',
          tag: 'NT MATRIX',
          accentColor: '#22d3ee',
        };
      case 'magazine':
        return {
          category: 'REVISTAS',
          name: 'REVISTA A4 // EDICIÓN DIGITAL & IMPRESIÓN',
          tag: 'PDF PRESS',
          accentColor: '#fbbf24',
        };
      case 'cover':
      case 'index':
      case 'chapter-01':
      case 'chapter-02':
      case 'chapter-03':
      case 'chapter-04':
      case 'chapter-05':
      case 'chapter-06':
      case 'chapter-07':
        return {
          category: 'REVISTAS',
          name: 'TOMO 01: CONOCÉ TU PC // HARDWARE',
          tag: '7 CAPÍTULOS',
          accentColor: '#fbbf24',
        };
      case 'tomo-02':
        return {
          category: 'REVISTAS',
          name: 'TOMO 02: LA BIBLIA NEGRA DE WINDOWS',
          tag: '26 ÁREAS',
          accentColor: '#22d3ee',
        };
      case 'tomo-03':
        return {
          category: 'REVISTAS',
          name: 'TOMO 03: REPARÁ TU PC // MANUAL DE TALLER',
          tag: '35 MÓDULOS',
          accentColor: '#34d399',
        };
      case 'tomo-04':
        return {
          category: 'REVISTAS',
          name: 'TOMO 04: REPARÁ TU NOTEBOOK // MICROELECTRÓNICA',
          tag: '28 MÓDULOS',
          accentColor: '#c084fc',
        };
      case 'world-map':
        return {
          category: 'INVESTIGACIÓN',
          name: 'MUNDO EVO // MAPA INTERACTIVO',
          tag: 'COMMAND CENTER',
          accentColor: '#fbbf24',
        };
      case 'archivo':
        return {
          category: 'INVESTIGACIÓN',
          name: 'ARCHIVO EVO // EXPEDIENTES & INFORMES',
          tag: 'DOSSIERS',
          accentColor: '#c084fc',
        };
      default:
        return {
          category: 'EVO LABS',
          name: 'PLATAFORMA DE INGENIERÍA & METROLOGÍA',
          tag: 'SYSTEM',
          accentColor: '#fbbf24',
        };
    }
  };

  const moduleInfo = getModuleInfo();

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

  return (
    <>
      <header className="border-b border-white/[0.06] bg-[#07090e]/85 backdrop-blur-2xl sticky top-0 z-40 select-none">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* Zone 1: Mobile Hamburger + Brand Anchor + Contextual Breadcrumb & Active Module */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors cursor-pointer"
              aria-label="Abrir navegación de laboratorio"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Brand Anchor */}
            <div
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
              title="Ir al Centro de Operaciones Mundo EVO"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] group-hover:scale-125 transition-transform" />
              <span className="font-display font-black text-lg sm:text-xl text-white tracking-tight uppercase leading-none">
                EVO LABS
              </span>
            </div>

            {/* Breadcrumb Hierarchy */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/[0.08] min-w-0">
              <span className="text-[10px] font-mono-tech uppercase font-bold text-zinc-500 tracking-wider">
                {moduleInfo.category}
              </span>
              <span className="text-zinc-600 text-xs">/</span>
              <span className="text-xs font-mono-tech font-bold text-zinc-200 uppercase tracking-tight truncate max-w-[200px] md:max-w-[320px] lg:max-w-[420px]">
                {moduleInfo.name}
              </span>
              <span
                className="hidden md:inline text-[9px] font-mono-tech font-bold px-2 py-0.5 rounded-full border ml-1 shrink-0"
                style={{
                  color: moduleInfo.accentColor,
                  borderColor: `${moduleInfo.accentColor}33`,
                  backgroundColor: `${moduleInfo.accentColor}12`,
                }}
              >
                {moduleInfo.tag}
              </span>
            </div>
          </div>

          {/* Zone 2: Global Control Deck (Auto-Detect, Mode Switcher) */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono-tech text-xs shrink-0">
            
            {/* Auto-Detect My PC Telemetry Trigger - Pill Capsule Style with Technical Pulse */}
            <button
              type="button"
              onClick={() => setIsAutoDetectOpen(true)}
              className="px-4 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/30 hover:border-amber-400 font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_0_14px_rgba(251,191,36,0.12)] group"
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
