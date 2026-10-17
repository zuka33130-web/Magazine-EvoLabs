import React, { useState } from 'react';
import { EvoNarrativeProfile, UserHardwarePassport } from '../types';
import {
  BookOpen,
  Zap,
  Gauge,
  Activity,
  Trophy,
} from 'lucide-react';
import { EvoAutoDetectPcModal } from './common/EvoAutoDetectPcModal';
import { EvoTomoDossierModal, ForensicBenchTarget } from './common/EvoTomoDossierModal';
import { EvoUnifiedHeaderShell } from './navigation/EvoUnifiedHeaderShell';
import { useEvoAccess } from '../auth/EvoAccessContext';
import { useEvoAuth } from '../auth/EvoAuthProvider';
import { EvoUserAccountMenu } from './auth/EvoUserAccountMenu';
import { Lock } from 'lucide-react';

export interface HeaderProps {
  currentView?: string;
  activeLabPanel?: string;
  activeLabMission?: string;
  campusSection?: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso' | 'herramientas' | 'como-usar' | 'planes';
  showBackButton?: boolean;
  onBack?: () => void;
  onNavigateHome?: () => void;
  onNavigateCampusSection?: (section: 'campus' | 'escuela' | 'biblioteca' | 'laboratorios' | 'diagnosticar' | 'progreso' | 'herramientas' | 'como-usar' | 'planes') => void;
  onNavigateArchive?: () => void;
  onNavigateTomo01?: () => void;
  onNavigateTomo02?: () => void;
  onNavigateTomo03?: () => void;
  onNavigateTomo04?: () => void;
  onNavigateTomo05?: () => void;
  onNavigateTomo06?: () => void;
  onNavigateTomo08?: () => void;
  onNavigateTomo?: (tomoNumber: string) => void;
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
  onReturnToPublic?: () => void;
  onOpenOwnerConsole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'world-map',
  campusSection = 'campus',
  showBackButton = false,
  onBack,
  onNavigateHome,
  onNavigateCampusSection,
  onNavigateTomo01,
  onNavigateTomo02,
  onNavigateTomo03,
  onNavigateTomo04,
  onNavigateTomo05,
  onNavigateTomo06,
  onNavigateTomo08,
  onNavigateTomo,
  onOpenForensicBench,
  onHardwareDetected,
  dossierModalTomoId = null,
  onCloseDossierModal,
  onReturnToPublic,
}) => {
  const [isAutoDetectOpen, setIsAutoDetectOpen] = useState(false);
  const [internalDossierTomoId, setInternalDossierTomoId] = useState<string | null>(null);
  const { user } = useEvoAuth();
  const { entitlements, isFreeUser, openUpgradeModal } = useEvoAccess();

  const activeDossierId = dossierModalTomoId || internalDossierTomoId;

  const handleProceedToTomoView = (id: string) => {
    setInternalDossierTomoId(null);
    if (onCloseDossierModal) onCloseDossierModal();

    const cleanId = id.replace('tomo-', '').padStart(2, '0');
    if (cleanId === '01') {
      if (onNavigateTomo01) onNavigateTomo01();
    } else if (cleanId === '02' && onNavigateTomo02) {
      onNavigateTomo02();
    } else if (cleanId === '03' && onNavigateTomo03) {
      onNavigateTomo03();
    } else if (cleanId === '04' && onNavigateTomo04) {
      onNavigateTomo04();
    } else if (cleanId === '08' && onNavigateTomo08) {
      onNavigateTomo08();
    } else if (onNavigateTomo) {
      onNavigateTomo(cleanId);
    } else {
      setInternalDossierTomoId(`tomo-${cleanId}`);
    }
  };

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

  const isEscuelaActive =
    (currentView === 'world-map' && (campusSection === 'escuela' || campusSection === 'biblioteca')) || isTomosActive;
  const isPracticarActive =
    (currentView === 'world-map' && campusSection === 'laboratorios') || (isLabsActive && currentView !== 'lab-core');
  const isAnalizarActive =
    (currentView === 'world-map' && campusSection === 'diagnosticar') || currentView === 'lab-core';
  const isHerramientasActive = currentView === 'world-map' && campusSection === 'herramientas';
  const isMiEvoActive = currentView === 'world-map' && campusSection === 'progreso';

  const desktopNav = (
    <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[#0b0e17]/85 border border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.4)] font-mono-tech text-[11px] uppercase tracking-wider font-bold">
      {/* 1. TOMOS */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('escuela');
          else if (onNavigateHome) onNavigateHome();
        }}
        title="Tomos // 12 Tomos Maestros y Magazines"
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none group relative ${
          isEscuelaActive
            ? 'bg-gradient-to-b from-amber-400/20 via-amber-500/12 to-amber-500/5 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
        }`}
      >
        <span>TOMOS</span>
      </button>

      {/* 2. LABORATORIOS */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('laboratorios');
          else if (onNavigateHome) onNavigateHome();
        }}
        title="Laboratorios // Suite de Laboratorios e Instrumental"
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none group relative ${
          isPracticarActive
            ? 'bg-gradient-to-b from-amber-400/20 via-amber-500/12 to-amber-500/5 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
        }`}
      >
        <span>LABORATORIOS</span>
      </button>

      {/* 3. ANALIZAR MI PC */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('diagnosticar');
          else if (onNavigateHome) onNavigateHome();
        }}
        title="Analizar mi PC // Taller de Diagnóstico y Casos"
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none group relative ${
          isAnalizarActive
            ? 'bg-gradient-to-b from-purple-500/20 via-purple-500/12 to-purple-500/5 text-purple-200 border border-purple-400/40 font-bold shadow-[0_0_16px_rgba(168,85,247,0.2)]'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
        }`}
      >
        <span>ANALIZAR MI PC</span>
      </button>

      {/* 4. HERRAMIENTAS */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('herramientas');
          else if (onNavigateHome) onNavigateHome();
        }}
        title="Herramientas // Catálogo técnico independiente"
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none group relative ${
          isHerramientasActive
            ? 'bg-gradient-to-b from-amber-400/20 via-amber-500/12 to-amber-500/5 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
        }`}
      >
        <span>HERRAMIENTAS</span>
      </button>

      {/* 5. MI EVO */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('progreso');
          else if (onNavigateHome) onNavigateHome();
        }}
        title="Mi EVO // Expediente e Identidad Técnica"
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none group relative ${
          isMiEvoActive
            ? 'bg-gradient-to-b from-amber-400/20 via-amber-500/12 to-amber-500/5 text-amber-200 border border-amber-400/40 font-bold shadow-[0_0_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.18)]'
            : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
        }`}
      >
        <span>MI EVO</span>
      </button>
    </nav>
  );

  const rightActions = (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {/* 1. Menú de Cuenta de Usuario Logueado (Avatar, Nombre, Email, Estado PLAN GRATIS / OWNER) */}
      <EvoUserAccountMenu
        onNavigatePlans={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('planes');
          else if (onReturnToPublic) onReturnToPublic();
        }}
        onLogoutSuccess={() => {
          if (onReturnToPublic) onReturnToPublic();
        }}
      />

      {/* 1b. Badge PLAN GRATIS visible para usuario anónimo o sin sesión iniciada */}
      {!user && (
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 font-mono-tech select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">
            PLAN GRATIS
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <button
            type="button"
            onClick={() => {
              if (onNavigateCampusSection) onNavigateCampusSection('planes');
              else if (onReturnToPublic) onReturnToPublic();
              else openUpgradeModal('Planes EVO LABS');
            }}
            className="text-[10px] font-bold text-amber-400 hover:text-amber-300 uppercase transition-colors cursor-pointer"
          >
            VER PLANES
          </button>
        </div>
      )}

      {/* 2. Indicador de Identidad Técnica / Pasaporte */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('progreso');
          else if (onNavigateHome) onNavigateHome();
        }}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-amber-400/30 text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer text-xs font-mono-tech select-none"
        title="Mi Identidad Técnica // Expediente y Progreso"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">PASAPORTE</span>
        <span className="text-[11px] font-bold text-amber-300">ACTIVO</span>
      </button>

      {/* 3. Botón de retorno al sitio público EVO LABS */}
      {onReturnToPublic && (
        <button
          type="button"
          onClick={onReturnToPublic}
          className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono-tech cursor-pointer"
          title="Ir al Sitio Público EVO LABS"
        >
          SITIO PÚBLICO
        </button>
      )}
    </div>
  );

  const mobileNav = (
    <div className="grid grid-cols-1 gap-1.5 text-xs font-mono-tech">
      {/* 1. TOMOS */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('escuela');
          else if (onNavigateHome) onNavigateHome();
        }}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
          isEscuelaActive
            ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
            : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent'
        }`}
      >
        <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
        <span>TOMOS</span>
      </button>

      {/* 2. LABORATORIOS */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('laboratorios');
          else if (onNavigateHome) onNavigateHome();
        }}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
          isPracticarActive
            ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
            : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent'
        }`}
      >
        <Zap className="w-4 h-4 text-amber-400 shrink-0" />
        <span>LABORATORIOS</span>
      </button>

      {/* 3. ANALIZAR MI PC */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('diagnosticar');
          else if (onNavigateHome) onNavigateHome();
        }}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
          isAnalizarActive
            ? 'bg-purple-500/15 text-purple-200 border border-purple-400/40 font-bold'
            : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent'
        }`}
      >
        <Activity className="w-4 h-4 text-purple-400 shrink-0" />
        <span>ANALIZAR MI PC</span>
      </button>

      {/* 4. HERRAMIENTAS */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('herramientas');
          else if (onNavigateHome) onNavigateHome();
        }}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
          isHerramientasActive
            ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
            : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent'
        }`}
      >
        <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
        <span>HERRAMIENTAS</span>
      </button>

      {/* 5. MI EVO */}
      <button
        type="button"
        onClick={() => {
          if (onNavigateCampusSection) onNavigateCampusSection('progreso');
          else if (onNavigateHome) onNavigateHome();
        }}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
          isMiEvoActive
            ? 'bg-amber-400/15 text-amber-200 border border-amber-400/40 font-bold'
            : 'hover:bg-white/[0.06] text-zinc-200 border border-transparent'
        }`}
      >
        <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
        <span>MI EVO</span>
      </button>
    </div>
  );

  return (
    <>
      <EvoUnifiedHeaderShell
        variant="app"
        showBackButton={showBackButton}
        onBackClick={onBack}
        onBrandClick={() => {
          if (onNavigateHome) onNavigateHome();
          else if (onNavigateCampusSection) onNavigateCampusSection('campus');
        }}
        desktopNavItems={desktopNav}
        rightActions={rightActions}
        mobileNavItems={mobileNav}
      />

      {/* Auto-Detect PC Modal */}
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
