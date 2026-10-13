import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Terminal,
  Activity,
  Layers,
  Search,
  FileText,
  Cpu,
  Sparkles,
  Sliders,
  Settings,
  Folder,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Wrench,
  HelpCircle,
  Database,
  ExternalLink,
} from 'lucide-react';
import {
  TOMO_02_MASTER_SECTORS,
  MasterSectorMeta,
  getAllSearchableItems,
} from '../../data/tomo02MasterSectors';
import { Tomo02MasterExpedienteModal } from './Tomo02MasterExpedienteModal';

export interface ModuleProgressStatus {
  [moduleId: string]: 'not_started' | 'in_progress' | 'completed';
}

interface Tomo02EditorialIndexProps {
  onBackToCover: () => void;
  onBackToApp?: () => void;
  onOpenA4Magazine?: () => void;
  onOpenSector00?: () => void;
  onOpenSector01?: () => void;
  onOpenSector02?: () => void;
  onOpenSector03?: () => void;
  onOpenSector04?: () => void;
  onOpenSector05?: () => void;
  onOpenSector06?: () => void;
  onOpenSector07?: () => void;
  onOpenSector08?: () => void;
  onOpenSector09?: () => void;
  onOpenSector10?: () => void;
  onSelectModule?: (moduleIndex: number) => void;
  onStartFinalExam?: () => void;
  onOpenCompletionScreen?: () => void;
  onOpenWindowsMatrixLab?: () => void;
  moduleProgress?: ModuleProgressStatus;
  completedCount?: number;
  hasPassedFinalExam?: boolean;
}

export interface SectorLevelGroup {
  id: string;
  name: string;
  subtitle: string;
  startSector: number;
  endSector: number;
}

export const SECTOR_LEVEL_GROUPS: SectorLevelGroup[] = [
  {
    id: 'all',
    name: 'TODOS LOS SECTORES',
    subtitle: 'Recorrido canónico 00 → 39',
    startSector: 0,
    endSector: 39,
  },
  {
    id: 'lvl-1',
    name: 'NIVEL I // ENTENDER WINDOWS',
    subtitle: 'Fundamentos, Boot y Núcleo del Sistema (00–07)',
    startSector: 0,
    endSector: 7,
  },
  {
    id: 'lvl-2',
    name: 'NIVEL II // ADMINISTRAR WINDOWS',
    subtitle: 'Memoria, Terminales, Registro y Drivers (08–15)',
    startSector: 8,
    endSector: 15,
  },
  {
    id: 'lvl-3',
    name: 'NIVEL III // DOMINAR WINDOWS',
    subtitle: 'Hardware, Redes, Energía, Seguridad y Telemetría (16–23)',
    startSector: 16,
    endSector: 23,
  },
  {
    id: 'lvl-4',
    name: 'NIVEL IV // DIAGNOSTICAR WINDOWS',
    subtitle: 'Virtualización, WinRE, BSODs, Latencias y Sysinternals (24–31)',
    startSector: 24,
    endSector: 31,
  },
  {
    id: 'lvl-5',
    name: 'NIVEL V // DESMANTELAR WINDOWS',
    subtitle: 'Zona Negra, NTFS, WinSxS, Casos y Juicio Final (32–39)',
    startSector: 32,
    endSector: 39,
  },
];

export const Tomo02EditorialIndex: React.FC<Tomo02EditorialIndexProps> = ({
  onBackToCover,
  onBackToApp,
  onOpenSector00,
  onOpenSector01,
  onOpenSector02,
  onOpenSector03,
  onOpenSector04,
  onOpenSector05,
  onOpenSector06,
  onOpenSector07,
  onOpenSector08,
  onOpenSector09,
  onOpenSector10,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [showMasterExpedienteModal, setShowMasterExpedienteModal] = useState(false);
  const [expandedSectorId, setExpandedSectorId] = useState<string | null>(null);

  const toggleSectorDetails = (sectorId: string) => {
    setExpandedSectorId((prev) => (prev === sectorId ? null : sectorId));
  };

  // Active sectors metrics: 2 / 40
  const activeSectorsCount = TOMO_02_MASTER_SECTORS.filter((s) => s.status === 'ACTIVE' || s.status === 'COMPLETED').length;
  const totalSectorsCount = TOMO_02_MASTER_SECTORS.length;
  const progressPercent = Math.round((activeSectorsCount / totalSectorsCount) * 100);

  const currentGroup = SECTOR_LEVEL_GROUPS.find((g) => g.id === selectedGroup) || SECTOR_LEVEL_GROUPS[0];

  // Global comprehensive search
  const filteredSectors = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();

    return TOMO_02_MASTER_SECTORS.filter((sector) => {
      const secNum = parseInt(sector.sectorNumber, 10);
      const inRange = secNum >= currentGroup.startSector && secNum <= currentGroup.endSector;
      if (!inRange) return false;

      if (!q) return true;

      // Match sector meta
      if (
        sector.sectorNumber.includes(q) ||
        sector.title.toLowerCase().includes(q) ||
        sector.subtitle.toLowerCase().includes(q) ||
        sector.levelTitle.toLowerCase().includes(q) ||
        (sector.artefactOrLab && sector.artefactOrLab.toLowerCase().includes(q)) ||
        (sector.methodology && sector.methodology.toLowerCase().includes(q)) ||
        (sector.finalOutput && sector.finalOutput.toLowerCase().includes(q))
      ) {
        return true;
      }

      // Match categories (Sector 37)
      if (sector.categories && sector.categories.some((c) => c.toLowerCase().includes(q))) {
        return true;
      }

      // Match in any investigation
      if (
        sector.investigationsList.some(
          (inv) => inv.id.toLowerCase().includes(q) || inv.title.toLowerCase().includes(q)
        )
      ) {
        return true;
      }

      return false;
    });
  }, [searchFilter, currentGroup]);

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto w-full space-y-6 animate-fadeIn text-zinc-100 font-sans">
      {/* Master Expediente Modal */}
      {showMasterExpedienteModal && (
        <Tomo02MasterExpedienteModal
          onClose={() => setShowMasterExpedienteModal(false)}
          onOpenSector00={onOpenSector00}
          onOpenSector01={onOpenSector01}
        />
      )}

      {/* Top System Nav Bar */}
      <nav className="flex items-center justify-between pb-4 border-b border-sky-500/20 text-xs font-mono">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToCover}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#60CDFF] uppercase tracking-widest transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#00A4EF] group-hover:-translate-x-1 transition-transform" />
            <span>← PORTADA TOMO 02</span>
          </button>

          {onBackToApp && (
            <>
              <span className="text-zinc-700">•</span>
              <button
                type="button"
                onClick={onBackToApp}
                className="text-zinc-400 hover:text-[#60CDFF] uppercase tracking-widest transition-colors cursor-pointer"
              >
                MAPA EVO
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMasterExpedienteModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0078D4]/15 hover:bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,164,239,0.15)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A4EF]" />
            <span>EXPEDIENTE WINDOWS EVO 001</span>
          </button>

          <span className="text-zinc-600 hidden sm:inline">|</span>

          <span className="text-[#60CDFF] font-bold hidden sm:inline">
            {activeSectorsCount} / {totalSectorsCount} SECTORES ACTIVOS
          </span>
        </div>
      </nav>

      {/* Header with Windows Electric Blue + EVO Lab Fluent Identity */}
      <header className="p-6 sm:p-8 rounded-2xl bg-[#080B10]/95 backdrop-blur-xl border border-sky-500/20 shadow-2xl relative overflow-hidden space-y-4">
        {/* Subtle Ambient Electric Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0078D4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#00A4EF]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            {/* Hierarchy Line 1: EVO LABS // TOMO 02 */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#60CDFF] uppercase tracking-widest font-bold">
              <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px]">
                EVO LABS
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-white">TOMO 02</span>
              <span className="text-zinc-500">•</span>
              <span className="text-[#00A4EF]">GUÍA DE PERITAJE DE KERNEL & SISTEMA OPERATIVO</span>
            </div>

            {/* Hierarchy Line 2: LA BIBLIA NEGRA DE WINDOWS */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display">
              LA BIBLIA NEGRA DE WINDOWS
            </h1>

            {/* Hierarchy Line 3 & 4: MENTIRA Y VERDAD // EL LADO OSCURO DE WINDOWS */}
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <div className="text-base sm:text-xl font-black font-mono tracking-widest uppercase text-[#00A4EF] flex items-center gap-2">
                <span className="text-[#60CDFF]">MENTIRA</span>
                <span className="text-zinc-600">Y</span>
                <span className="text-[#00A4EF]">VERDAD</span>
              </div>
              <span className="text-zinc-600 text-xs hidden sm:inline">|</span>
              <span className="text-xs sm:text-sm font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                EL LADO OSCURO DE WINDOWS
              </span>
            </div>

            {/* Bajada Editorial Coherente con EVO */}
            <p className="text-xs sm:text-sm text-zinc-300/90 italic pt-1 max-w-3xl leading-relaxed">
              Entender Windows, administrarlo, diagnosticarlo, repararlo y comprobar cada cambio con evidencia. Lema: “Si no podés revertirlo, no lo toques.”
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-[#11161D]/90 border border-sky-500/20 text-right shadow-md">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">ESTRUCTURA CANÓNICA</div>
              <div className="text-lg font-bold font-mono text-[#60CDFF]">
                40 Sectores // 766 Temas
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar (Windows Gradient) */}
        <div className="space-y-1.5 relative z-10 pt-3 border-t border-sky-500/15">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="text-[#60CDFF]">SECTOR 00 (DÍA CERO) & SECTOR 01 (ANTES DEL LOGO)</span>
            <span className="font-bold text-white">{progressPercent}% HABILITADO</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#151B23] border border-sky-500/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0078D4] via-[#00A4EF] to-[#60CDFF] shadow-[0_0_12px_rgba(0,164,239,0.5)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Settings/Explorer-Style 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Levels / Capas (Windows 11 Fluent Settings Style) */}
        <aside className="lg:col-span-4 space-y-2 p-3 bg-[#080B10]/95 border border-sky-500/20 rounded-2xl shadow-xl">
          <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00A4EF]" />
            <span>CAPAS DE INGENIERÍA</span>
          </div>

          <div className="space-y-1">
            {SECTOR_LEVEL_GROUPS.map((group) => {
              const isSelected = selectedGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0078D4]/20 border border-[#00A4EF]/75 text-white shadow-[0_0_20px_rgba(0,164,239,0.18)]'
                      : 'hover:bg-[#11161D] text-zinc-400 hover:text-zinc-200 border border-transparent'
                  }`}
                  style={{
                    borderLeft: isSelected ? '3px solid #00A4EF' : undefined,
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#0078D4] to-[#00A4EF] text-white font-bold shadow-sm'
                        : 'bg-[#151B23] text-zinc-400'
                    }`}
                  >
                    {group.id === 'all' ? '★' : group.id.replace('lvl-', '')}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono truncate">{group.name}</div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">{group.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expediente Master Shortcut */}
          <div className="pt-3 mt-3 border-t border-sky-500/15">
            <button
              onClick={() => setShowMasterExpedienteModal(true)}
              className="w-full p-3 rounded-xl bg-[#11161D] hover:bg-[#151B23] border border-sky-500/25 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#60CDFF] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#00A4EF]" />
                <span>EXPEDIENTE MASTER</span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-snug">
                Consultar el repositorio central de artefactos y evidencias emitidas.
              </div>
            </button>
          </div>
        </aside>

        {/* Right Panel: Compact Sectors List with Full Search & Expandable Syllabus */}
        <main className="lg:col-span-8 space-y-4">
          {/* Search bar inside right pane */}
          <div className="p-3.5 bg-[#080B10]/95 border border-sky-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="font-bold text-white">{currentGroup.name}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#60CDFF]">{filteredSectors.length} Sectores</span>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#00A4EF] absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar 766 temas, comandos, labs..."
                className="w-full bg-[#11161D] border border-sky-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-[#00A4EF] font-mono focus:shadow-[0_0_12px_rgba(0,164,239,0.2)]"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 top-2.5 text-[10px] text-zinc-400 hover:text-white font-mono"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sectors Compact Rows */}
          <div className="space-y-3">
            {filteredSectors.map((sector) => {
              const isSector00 = sector.sectorId === 'sector-00';
              const isSector01 = sector.sectorId === 'sector-01';
              const isSector02 = sector.sectorId === 'sector-02';
              const isSector03 = sector.sectorId === 'sector-03';
              const isSector04 = sector.sectorId === 'sector-04';
              const isSector05 = sector.sectorId === 'sector-05';
              const isSector06 = sector.sectorId === 'sector-06';
              const isSector07 = sector.sectorId === 'sector-07';
              const isSector08 = sector.sectorId === 'sector-08';
              const isSector09 = sector.sectorId === 'sector-09';
              const isSector10 = sector.sectorId === 'sector-10';
              const isSector37 = sector.sectorId === 'sector-37';
              const isSector39 = sector.sectorId === 'sector-39';
              const isExpanded = expandedSectorId === sector.sectorId || (Boolean(searchFilter.trim()) && filteredSectors.length <= 4);

              // SECTOR 00 (COMPLETED)
              if (isSector00) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/10 via-[#080B10] to-[#080B10] border border-[#00A4EF]/30 hover:border-[#00A4EF]/60 transition-all shadow-[0_0_20px_rgba(0,120,212,0.08)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2 h-2 rounded-full bg-[#16C784]" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 00]</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-[#16C784] border border-emerald-500/40 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#16C784]" />
                            GOLD MASTER · COMPLETADO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-400 text-[10px]">15 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector00}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,164,239,0.20)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/10 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 15 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#16C784] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 01 (ACTIVE)
              if (isSector01) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 01]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">27 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector01}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 27 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 02 (ACTIVE)
              if (isSector02) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 02]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">30 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector02}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 30 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 03 (ACTIVE)
              if (isSector03) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 03]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">21 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector03}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 21 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 04 (ACTIVE - ADMINISTRADOR DE TAREAS DE VERDAD)
              if (isSector04) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 04]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">23 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector04}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 23 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 05 (ACTIVE)
              if (isSector05) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 05]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">21 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector05}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 21 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 06 (ACTIVE)
              if (isSector06) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 06]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">32 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector06}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 32 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 07 (ACTIVE)
              if (isSector07) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 07]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">11 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector07}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#00A4EF]" />
                          <span>TEMARIO CANÓNICO // 11 INVESTIGACIONES PERICIALES</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                            >
                              <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                              <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 08 (ACTIVE)
              if (isSector08) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 08]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">25 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector08}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Terminal className="w-3 h-3" />
                          <span>TEMARIO OFICIAL {sector.investigationsCount} INVESTIGACIONES</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#0A0E17] border border-sky-500/10 flex items-center gap-2 text-xs"
                            >
                              <span className="font-mono text-[#60CDFF] text-[11px] font-bold shrink-0">
                                {item.id}
                              </span>
                              <span className="text-zinc-300 font-medium truncate">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 09 (ACTIVE)
              if (isSector09) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#080B10] to-[#080B10] border-2 border-amber-500 hover:border-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="font-bold text-amber-400">[SECTOR 09]</span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/25 text-amber-300 border border-amber-500/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">30 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-amber-400/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-amber-500/20 text-zinc-400 hover:text-amber-300 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector09}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(245,158,11,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-amber-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Terminal className="w-3 h-3" />
                          <span>TEMARIO OFICIAL {sector.investigationsCount} INVESTIGACIONES</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#0A0E17] border border-amber-500/10 flex items-center gap-2 text-xs"
                            >
                              <span className="font-mono text-amber-400 text-[11px] font-bold shrink-0">
                                {item.id}
                              </span>
                              <span className="text-zinc-300 font-medium truncate">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTOR 10 (ACTIVE)
              if (isSector10) {
                return (
                  <div
                    key={sector.sectorId}
                    className="rounded-2xl bg-gradient-to-r from-[#0078D4]/20 via-[#080B10] to-[#080B10] border-2 border-[#00A4EF] hover:border-[#60CDFF] transition-all shadow-[0_0_30px_rgba(0,164,239,0.22)] group"
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00A4EF] animate-pulse" />
                          <span className="font-bold text-[#60CDFF]">[SECTOR 10]</span>
                          <span className="px-2 py-0.5 rounded bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/60 font-bold text-[10px]">
                            GOLD MASTER · ACTIVO
                          </span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-zinc-300 text-[10px]">30 INVESTIGACIONES</span>
                          {sector.artefactOrLab && (
                            <>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                                {sector.artefactOrLab}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                          {sector.title}
                        </h3>

                        <p className="text-xs text-zinc-300 line-clamp-1">{sector.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSectorDetails(sector.sectorId)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={onOpenSector10}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] flex items-center gap-1.5"
                        >
                          <span>INGRESAR</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && sector.investigationsList && (
                      <div className="px-5 pb-5 pt-2 border-t border-sky-500/15 bg-[#05070A]/90 space-y-2 animate-fadeIn rounded-b-2xl">
                        <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Terminal className="w-3 h-3" />
                          <span>TEMARIO OFICIAL {sector.investigationsCount} INVESTIGACIONES</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {sector.investigationsList.map((item) => (
                            <div
                              key={item.id}
                              className="p-2 rounded bg-[#0A0E17] border border-sky-500/10 flex items-center gap-2 text-xs"
                            >
                              <span className="font-mono text-[#60CDFF] text-[11px] font-bold shrink-0">
                                {item.id}
                              </span>
                              <span className="text-zinc-300 font-medium truncate">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // SECTORS 04 TO 39 (LOCKED WITH FULL CANONICAL TEMARIO)
              return (
                <div
                  key={sector.sectorId}
                  className={`rounded-xl bg-[#080B10]/80 border transition-all ${
                    isExpanded
                      ? 'border-[#00A4EF]/50 shadow-[0_0_15px_rgba(0,164,239,0.12)]'
                      : 'border-sky-500/10 hover:border-sky-500/25 opacity-75 hover:opacity-95'
                  }`}
                >
                  <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-[#60CDFF]">[SECTOR {sector.sectorNumber}]</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#11161D] border border-zinc-800 text-zinc-400 font-bold text-[9px] flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-zinc-400" />
                          BLOQUEADO
                        </span>
                        <span className="text-zinc-600 text-[10px]">•</span>
                        <span className="text-zinc-400 text-[10px]">
                          {isSector37
                            ? '22 CATEGORÍAS FORENSES'
                            : isSector39
                            ? 'PROTOCOLO FINAL'
                            : `${sector.investigationsCount} INVESTIGACIONES`}
                        </span>
                        {sector.artefactOrLab && (
                          <>
                            <span className="text-zinc-600 text-[10px]">•</span>
                            <span className="text-[#60CDFF]/90 text-[10px] font-bold">
                              {sector.artefactOrLab}
                            </span>
                          </>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-zinc-200 uppercase truncate">
                        {sector.title}
                      </h4>

                      <p className="text-[11px] text-zinc-400 line-clamp-1">{sector.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSectorDetails(sector.sectorId)}
                        className="px-2.5 py-1 rounded bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-400 hover:text-[#60CDFF] text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{isExpanded ? 'Ocultar Temario' : 'Ver Temario'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-zinc-500" />
                        Bloqueado
                      </span>
                    </div>
                  </div>

                  {/* Expanded Syllabus for Standard Sectors */}
                  {isExpanded && sector.investigationsList && sector.investigationsList.length > 0 && (
                    <div className="px-4 pb-4 pt-2 border-t border-sky-500/10 bg-[#05070A]/90 space-y-2 animate-fadeIn">
                      <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-[#00A4EF]" />
                        <span>TEMARIO CANÓNICO // {sector.investigationsCount} INVESTIGACIONES PERICIALES</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                        {sector.investigationsList.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-start gap-2"
                          >
                            <span className="text-[#60CDFF] font-bold shrink-0">{item.id}</span>
                            <span className="text-zinc-300 line-clamp-1">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expanded Syllabus for Sector 37 (Categories + Methodology) */}
                  {isExpanded && isSector37 && (
                    <div className="px-4 pb-4 pt-2 border-t border-sky-500/10 bg-[#05070A]/90 space-y-3 animate-fadeIn">
                      <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-[#00A4EF]" />
                        <span>CATEGORÍAS DEL REPOSITORIO FORENSE EVO // 22 ÁREAS DE PERITAJE</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 pt-1">
                        {sector.categories?.map((cat) => (
                          <div
                            key={cat}
                            className="p-2 rounded bg-[#11161D]/70 border border-sky-500/10 text-xs font-mono text-zinc-300 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A4EF]" />
                            <span className="truncate">{cat}</span>
                          </div>
                        ))}
                      </div>
                      {sector.methodology && (
                        <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/20 text-xs font-mono text-zinc-300">
                          <span className="text-[#60CDFF] font-bold block mb-1">PROTOCOLO DE EXPEDIENTE:</span>
                          <span className="text-zinc-400">{sector.methodology}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expanded Syllabus for Sector 39 (Final Laboratory Workflow) */}
                  {isExpanded && isSector39 && (
                    <div className="px-4 pb-4 pt-2 border-t border-sky-500/10 bg-[#05070A]/90 space-y-3 animate-fadeIn">
                      <div className="text-[10px] font-mono text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FlaskConical className="w-3 h-3 text-[#00A4EF]" />
                        <span>PROTOCOLO DEL LABORATORIO FINAL</span>
                      </div>
                      {sector.methodology && (
                        <div className="p-3 rounded-lg bg-[#11161D] border border-sky-500/20 text-xs font-mono text-zinc-300">
                          <span className="text-[#60CDFF] font-bold block mb-1">FLUJO DE CERTIFICACIÓN:</span>
                          <span className="text-[#00A4EF] font-bold">{sector.methodology}</span>
                        </div>
                      )}
                      {sector.finalOutput && (
                        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16C784] shrink-0" />
                          <span>{sector.finalOutput}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
