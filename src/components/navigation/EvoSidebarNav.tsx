import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Sparkles,
  Layers,
  Activity,
  Terminal,
  Sliders,
  Database,
  Globe,
  Map,
  Library,
  BookOpen,
  Server,
  Shield,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Gauge,
  Compass,
  Wrench,
  X,
} from 'lucide-react';
import { EvoNarrativeProfile } from '../../types';
import { EVO_NARRATIVE_PROFILES } from '../../data/evoWorldData';

export interface NavActionTarget {
  view:
    | 'lab-core'
    | 'hotswap-lab'
    | 'windows-matrix-lab'
    | 'magazine'
    | 'tomo-02'
    | 'tomo-03'
    | 'tomo-04'
    | 'world-map'
    | 'archivo'
    | 'cover'
    | 'index'
    | 'chapter-01'
    | 'chapter-02'
    | 'chapter-03'
    | 'chapter-04'
    | 'chapter-05'
    | 'chapter-06'
    | 'chapter-07';
  subPanel?: 'sandbox' | 'hardware' | 'software' | 'telemetry' | 'matrix' | 'all';
  labMission?: 'IDLE' | 'REPAIR' | 'TEST' | 'BOTTLENECK' | 'OPTIMIZE' | 'UPGRADE';
  corePhase?: 'SELECT_PC' | 'BUILD_PC' | 'LAB_ACTIVE';
  tomoId?: 'tomo-01' | 'tomo-02' | 'tomo-03' | 'tomo-04' | 'tomo-05' | 'tomo-06';
  modalAction?: 'autodetect' | 'discovery' | 'coverage' | 'history' | 'livescan' | 'tomo-dossier';
}

interface EvoSidebarNavProps {
  currentView: string;
  activeLabPanel?: string;
  activeLabMission?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigate: (target: NavActionTarget) => void;
  onOpenAutoDetectModal: () => void;
  onOpenDiscoveryModal: () => void;
  onOpenCoverageDashboard: () => void;
  onOpenCaseHistory: () => void;
  onOpenLiveScanAudit: () => void;
  onOpenTomoDossier: (tomoId: string) => void;
  activeProfile?: EvoNarrativeProfile;
  onChangeProfile?: (p: EvoNarrativeProfile) => void;
}

interface NavItemConfig {
  id: string;
  label: string;
  tooltip?: string;
  icon: React.ElementType;
  accentColor: string;
  isActive: boolean;
  onClick: () => void;
}

type NavCategory = 'software' | 'laboratorios' | 'revistas' | 'investigacion';

export const EvoSidebarNav: React.FC<EvoSidebarNavProps> = ({
  currentView,
  activeLabPanel,
  activeLabMission,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onNavigate,
  onOpenAutoDetectModal,
  onOpenDiscoveryModal,
  onOpenCoverageDashboard,
  onOpenTomoDossier,
  activeProfile = 'investigador',
}) => {
  // Determine active category based on current view
  const getCategoryForView = (view: string): NavCategory => {
    if (view === 'lab-core') return 'software';
    if (view === 'hotswap-lab' || view === 'windows-matrix-lab') return 'laboratorios';
    if (
      view === 'magazine' ||
      view.startsWith('tomo-') ||
      view === 'cover' ||
      view === 'index' ||
      view.startsWith('chapter-')
    ) {
      return 'revistas';
    }
    if (view === 'world-map' || view === 'archivo') return 'investigacion';
    return 'software';
  };

  // Accordion state: strictly ONE category open at a time
  const [activeCategory, setActiveCategory] = useState<NavCategory | null>(() =>
    getCategoryForView(currentView)
  );

  // Keep accordion in sync when view changes
  useEffect(() => {
    setActiveCategory(getCategoryForView(currentView));
  }, [currentView]);

  const toggleCategory = (cat: NavCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  };

  const handleItemClick = (target: NavActionTarget) => {
    onNavigate(target);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const profileData =
    EVO_NARRATIVE_PROFILES[activeProfile] || EVO_NARRATIVE_PROFILES.investigador;

  // Configuration sets for navigation items (strictly ICON + LABEL)
  const softwareItems: NavItemConfig[] = [
    {
      id: 'evo-core',
      label: 'EVO CORE',
      tooltip: 'Digital Computer Lab & Diagnóstico',
      icon: Cpu,
      accentColor: '#fbbf24',
      isActive:
        currentView === 'lab-core' &&
        (!activeLabMission || activeLabMission === 'IDLE'),
      onClick: () =>
        handleItemClick({
          view: 'lab-core',
          corePhase: 'LAB_ACTIVE',
          labMission: 'IDLE',
        }),
    },
    {
      id: 'evo-scanner',
      label: 'EVO Scanner',
      tooltip: 'Auditoría de Silicio CIM / WMI',
      icon: Zap,
      accentColor: '#fbbf24',
      isActive: false,
      onClick: () => {
        onOpenAutoDetectModal();
        if (isMobileOpen) onCloseMobile();
      },
    },
    {
      id: 'evo-competitive',
      label: 'EVO Competitive',
      tooltip: 'DPC µs & Precisión de Timers',
      icon: Gauge,
      accentColor: '#22d3ee',
      isActive: currentView === 'hotswap-lab' && activeLabPanel === 'software',
      onClick: () =>
        handleItemClick({ view: 'hotswap-lab', subPanel: 'software' }),
    },
    {
      id: 'evomax-pc',
      label: 'EvoMax PC Builder',
      tooltip: 'Constructor Universal de Silicio',
      icon: Wrench,
      accentColor: '#c084fc',
      isActive: currentView === 'lab-core' && activeLabPanel === 'BUILD_PC',
      onClick: () =>
        handleItemClick({ view: 'lab-core', corePhase: 'BUILD_PC' }),
    },
  ];

  const labItems: NavItemConfig[] = [
    {
      id: 'simulador-lab',
      label: 'Simulador & Lab',
      tooltip: 'Ultimate Silicon Sandbox',
      icon: Sparkles,
      accentColor: '#fbbf24',
      isActive: currentView === 'hotswap-lab' && activeLabPanel === 'sandbox',
      onClick: () =>
        handleItemClick({ view: 'hotswap-lab', subPanel: 'sandbox' }),
    },
    {
      id: 'nuevo-lab',
      label: 'Nuevo Laboratorio',
      tooltip: 'EVO Core Metrology V1',
      icon: Zap,
      accentColor: '#34d399',
      isActive: currentView === 'lab-core' && activeLabPanel !== 'BUILD_PC',
      onClick: () => handleItemClick({ view: 'lab-core' }),
    },
    {
      id: 'taller-metrologico',
      label: 'Taller Metrológico',
      tooltip: 'Suite Metrológica Integral',
      icon: Sliders,
      accentColor: '#34d399',
      isActive: currentView === 'hotswap-lab' && activeLabPanel === 'all',
      onClick: () => handleItemClick({ view: 'hotswap-lab', subPanel: 'all' }),
    },
    {
      id: 'hotswap-hw',
      label: 'Hot-Swap Hardware',
      tooltip: 'Banco de Buses PCIe & Latencias RAM',
      icon: Cpu,
      accentColor: '#fbbf24',
      isActive: currentView === 'hotswap-lab' && activeLabPanel === 'hardware',
      onClick: () =>
        handleItemClick({ view: 'hotswap-lab', subPanel: 'hardware' }),
    },
    {
      id: 'hotswap-sw',
      label: 'Hot-Swap Software',
      tooltip: 'Interrupciones & Latencias DPC µs',
      icon: Terminal,
      accentColor: '#22d3ee',
      isActive: currentView === 'hotswap-lab' && activeLabPanel === 'software',
      onClick: () =>
        handleItemClick({ view: 'hotswap-lab', subPanel: 'software' }),
    },
    {
      id: 'parser-telemetria',
      label: 'Parser Telemetría',
      tooltip: 'Ingesta Live PowerShell WMI',
      icon: Activity,
      accentColor: '#34d399',
      isActive: currentView === 'hotswap-lab' && activeLabPanel === 'telemetry',
      onClick: () =>
        handleItemClick({ view: 'hotswap-lab', subPanel: 'telemetry' }),
    },
    {
      id: 'kernel-matrices',
      label: 'Kernel / Matrices',
      tooltip: 'Planificador NT & Latencia de Syscalls',
      icon: Layers,
      accentColor: '#22d3ee',
      isActive: currentView === 'windows-matrix-lab',
      onClick: () => handleItemClick({ view: 'windows-matrix-lab' }),
    },
  ];

  const revistaItems: NavItemConfig[] = [
    {
      id: 'revista-a4',
      label: 'Revista A4 Digital',
      tooltip: 'Edición Editorial & Impresión PDF',
      icon: BookOpen,
      accentColor: '#fbbf24',
      isActive: currentView === 'magazine',
      onClick: () => handleItemClick({ view: 'magazine' }),
    },
    {
      id: 'tomo-01',
      label: 'Tomo 01: Hardware',
      tooltip: 'Conocé tu PC // Hardware & Silicio',
      icon: BookOpen,
      accentColor: '#fbbf24',
      isActive:
        currentView === 'cover' ||
        currentView === 'index' ||
        currentView.startsWith('chapter-'),
      onClick: () => handleItemClick({ view: 'cover' }),
    },
    {
      id: 'tomo-02',
      label: 'Tomo 02: Windows NT',
      tooltip: 'La Biblia Negra de Windows',
      icon: BookOpen,
      accentColor: '#22d3ee',
      isActive: currentView === 'tomo-02',
      onClick: () => handleItemClick({ view: 'tomo-02' }),
    },
    {
      id: 'tomo-03',
      label: 'Tomo 03: Reparación',
      tooltip: 'Repará tu PC // Manual de Taller',
      icon: BookOpen,
      accentColor: '#34d399',
      isActive: currentView === 'tomo-03',
      onClick: () => handleItemClick({ view: 'tomo-03' }),
    },
    {
      id: 'tomo-04',
      label: 'Tomo 04: Notebooks',
      tooltip: 'Microelectrónica & Térmica Portátil',
      icon: BookOpen,
      accentColor: '#c084fc',
      isActive: currentView === 'tomo-04',
      onClick: () => handleItemClick({ view: 'tomo-04' }),
    },
    {
      id: 'tomo-05',
      label: 'Tomo 05: Redes & Linux',
      tooltip: 'Virtualización, Hipervisores & Redes',
      icon: Server,
      accentColor: '#38bdf8',
      isActive: false,
      onClick: () => {
        onOpenTomoDossier('tomo-05');
        if (isMobileOpen) onCloseMobile();
      },
    },
    {
      id: 'tomo-06',
      label: 'Tomo 06: Ciberseguridad',
      tooltip: 'Forense de Amenazas & Kernel Security',
      icon: Shield,
      accentColor: '#fb7185',
      isActive: false,
      onClick: () => {
        onOpenTomoDossier('tomo-06');
        if (isMobileOpen) onCloseMobile();
      },
    },
  ];

  const investigacionItems: NavItemConfig[] = [
    {
      id: 'mundo-evo',
      label: 'Mundo EVO (Mapa)',
      tooltip: 'Mapa Central de Operaciones EVO',
      icon: Map,
      accentColor: '#fbbf24',
      isActive: currentView === 'world-map',
      onClick: () => handleItemClick({ view: 'world-map' }),
    },
    {
      id: 'discovery-engine',
      label: 'Discovery Engine',
      tooltip: 'Catálogo e Indexación de Silicio',
      icon: Globe,
      accentColor: '#22d3ee',
      isActive: false,
      onClick: () => {
        onOpenDiscoveryModal();
        if (isMobileOpen) onCloseMobile();
      },
    },
    {
      id: 'fuentes-tier1',
      label: 'Fuentes Tier 1',
      tooltip: 'Ingesta Oficial de Fabricantes',
      icon: Database,
      accentColor: '#c084fc',
      isActive: false,
      onClick: () => {
        onOpenCoverageDashboard();
        if (isMobileOpen) onCloseMobile();
      },
    },
    {
      id: 'expedientes-archivo',
      label: 'Expedientes & Archivo',
      tooltip: 'Informes & Historial de Casos',
      icon: Library,
      accentColor: '#fbbf24',
      isActive: currentView === 'archivo',
      onClick: () => handleItemClick({ view: 'archivo' }),
    },
    {
      id: 'matriz-versiones',
      label: 'Matriz de Versiones',
      tooltip: 'Línea de Tiempo de Kernel NT',
      icon: Activity,
      accentColor: '#22d3ee',
      isActive: currentView === 'windows-matrix-lab',
      onClick: () => handleItemClick({ view: 'windows-matrix-lab' }),
    },
  ];

  const categories = [
    {
      id: 'software' as NavCategory,
      label: 'SOFTWARE',
      icon: Cpu,
      accentColor: '#fbbf24',
      items: softwareItems,
    },
    {
      id: 'laboratorios' as NavCategory,
      label: 'LABORATORIOS',
      icon: Zap,
      accentColor: '#34d399',
      items: labItems,
    },
    {
      id: 'revistas' as NavCategory,
      label: 'REVISTAS & TOMOS',
      icon: BookOpen,
      accentColor: '#22d3ee',
      items: revistaItems,
    },
    {
      id: 'investigacion' as NavCategory,
      label: 'INVESTIGACIÓN',
      icon: Globe,
      accentColor: '#c084fc',
      items: investigacionItems,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Shell Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#07090e]/90 backdrop-blur-2xl border-r border-white/[0.06] transition-all duration-300 select-none ${
          isMobileOpen
            ? 'translate-x-0 w-[240px] shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[64px]' : 'lg:w-[240px]'}`}
      >
        {/* ========================================================================= */}
        {/* A. CABECERA DE SIDEBAR                                                   */}
        {/* ========================================================================= */}
        <div className="h-14 border-b border-white/[0.06] flex items-center justify-between px-3.5 shrink-0 bg-black/40 backdrop-blur-md relative">
          {!isCollapsed ? (
            <div
              onClick={() => handleItemClick({ view: 'world-map' })}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
              title="Ir al Centro de Operaciones Mundo EVO"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.25)]">
                <span className="font-display text-[10px] font-black">EVO</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-black text-xs text-white tracking-tight uppercase leading-none">
                  EVO LABS
                </span>
                <span className="text-[9px] text-zinc-500 font-mono-tech mt-0.5">
                  DIGITAL LAB OS
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleItemClick({ view: 'world-map' })}
              className="w-full flex items-center justify-center cursor-pointer group"
              title="EVO LABS"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.25)]">
                <span className="font-display text-[10px] font-black">EVO</span>
              </div>
            </div>
          )}

          {/* Collapse toggle (Desktop) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Close drawer (Mobile) */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Cerrar barra lateral"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* B. NAVEGACIÓN PRINCIPAL: ACORDEÓN DE 4 CATEGORÍAS                        */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-3 font-mono-tech scrollbar-thin">
          {categories.map((cat) => {
            const isOpen = activeCategory === cat.id;
            const Icon = cat.icon;
            const hasActiveItem = cat.items.some((it) => it.isActive);

            if (isCollapsed) {
              return (
                <div key={cat.id} className="relative group flex justify-center py-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleCollapse();
                      setActiveCategory(cat.id);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer relative ${
                      hasActiveItem
                        ? 'bg-white/[0.12] text-white border border-white/20 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] border border-transparent'
                    }`}
                    title={cat.label}
                  >
                    {hasActiveItem && (
                      <span
                        className="absolute -left-1 top-2.5 bottom-2.5 w-1 rounded-r shadow-md animate-pulse"
                        style={{ backgroundColor: cat.accentColor }}
                      />
                    )}
                    <Icon className="w-4 h-4" style={{ color: cat.accentColor }} />
                  </button>

                  {/* Floating Tooltip with Sub-items on Hover when Collapsed */}
                  <div className="absolute left-[52px] top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col z-[100] pointer-events-none">
                    <div className="bg-[#0b0e14]/95 border border-zinc-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl min-w-[180px] space-y-1">
                      <div className="flex items-center gap-1.5 pb-1 border-b border-white/[0.08]">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: cat.accentColor }}
                        />
                        <span className="font-bold text-[11px] text-white uppercase">
                          {cat.label}
                        </span>
                      </div>
                      <div className="space-y-0.5 pt-0.5">
                        {cat.items.map((it) => (
                          <div
                            key={it.id}
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              it.isActive
                                ? 'text-white font-bold bg-white/[0.08]'
                                : 'text-zinc-400'
                            }`}
                          >
                            {it.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={cat.id} className="space-y-1">
                {/* Accordion Category Header Button */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                    isOpen
                      ? 'bg-white/[0.05] text-white border border-white/[0.08]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        hasActiveItem ? 'animate-pulse shadow-[0_0_6px_currentColor]' : 'opacity-70'
                      }`}
                      style={{
                        backgroundColor: cat.accentColor,
                        color: cat.accentColor,
                      }}
                    />
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: cat.accentColor }} />
                    <span className="truncate">{cat.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 text-zinc-500">
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/[0.04]">
                      {cat.items.length}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Accordion Items List (Visible ONLY when this category is active) */}
                {isOpen && (
                  <div className="space-y-0.5 pt-1 pl-2 animate-in fade-in duration-150">
                    {cat.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={item.onClick}
                          title={item.tooltip || item.label}
                          className={`w-full group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150 text-left cursor-pointer ${
                            item.isActive
                              ? 'bg-white/[0.08] text-white border border-white/15 backdrop-blur-md shadow-sm'
                              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                          }`}
                        >
                          {item.isActive && (
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_6px_currentColor] shrink-0"
                              style={{
                                backgroundColor: item.accentColor,
                                color: item.accentColor,
                              }}
                            />
                          )}

                          <ItemIcon
                            className="w-3.5 h-3.5 shrink-0 transition-colors"
                            style={{
                              color: item.isActive ? item.accentColor : undefined,
                            }}
                          />

                          <span
                            className={`truncate tracking-tight ${
                              item.isActive ? 'font-bold text-white' : 'font-normal'
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* C. ZONA INFERIOR (COMPACT PROFILE CONTEXT)                                */}
        {/* ========================================================================= */}
        <div className="p-2.5 border-t border-white/[0.06] bg-black/40 backdrop-blur-md shrink-0 font-mono-tech">
          {!isCollapsed ? (
            <div className="px-2.5 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Compass className="w-3 h-3" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold leading-none">
                    PERFIL
                  </span>
                  <span className="text-[11px] font-bold text-white uppercase truncate mt-0.5">
                    {profileData.title}
                  </span>
                </div>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399] shrink-0" />
            </div>
          ) : (
            <div
              className="flex justify-center group relative py-1"
              title={`Perfil: ${profileData.title}`}
            >
              <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400 cursor-pointer">
                <Compass className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
