import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Search,
  AlertTriangle,
  FileText,
  Terminal,
  Activity,
  Copy,
  Check,
  Shield,
  RotateCcw,
  RefreshCw,
  Layers,
  Code,
  FolderTree,
  Package,
} from 'lucide-react';
import {
  SECTOR_20_INVESTIGATIONS,
  Sector20Investigation,
} from '../../../data/tomo02Sector20Data';
import { Sector20VisualDiagrams } from './Sector20VisualDiagrams';
import { Tomo02Sector20MiniCasesModal } from './Tomo02Sector20MiniCasesModal';
import { Tomo02Sector20TestView } from './Tomo02Sector20TestView';
import { Tomo02Sector20MissionView } from './Tomo02Sector20MissionView';

interface Tomo02Sector20ViewProps {
  onBackToMagazine: () => void;
  onOpenSector19?: () => void;
  onOpenSector21?: () => void;
}

export const Tomo02Sector20View: React.FC<Tomo02Sector20ViewProps> = ({
  onBackToMagazine,
  onOpenSector19,
  onOpenSector21,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvCode, setSelectedInvCode] = useState<string>('20.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState<boolean>(false);
  const [completedInvs, setCompletedInvs] = useState<string[]>([]);

  const investigations = SECTOR_20_INVESTIGATIONS;
  const currentInv: Sector20Investigation =
    investigations.find((i) => i.code === selectedInvCode) || investigations[0];

  const filteredInvs = investigations.filter(
    (i) =>
      i.code.includes(searchQuery) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.targetComponent && i.targetComponent.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleInvCompletion = (code: string) => {
    setCompletedInvs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (activeTab === 'mission') {
    return <Tomo02Sector20MissionView onBackToReader={() => setActiveTab('reader')} />;
  }

  if (activeTab === 'test') {
    return <Tomo02Sector20TestView onBackToReader={() => setActiveTab('reader')} />;
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans pb-16">
      {/* Top Header Nav */}
      <header className="sticky top-0 z-30 bg-[#080B10]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToMagazine}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VOLVER AL ÍNDICE</span>
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-mono text-[10px] font-bold">
                SECTOR 20
              </span>
              <span className="text-xs font-bold text-zinc-200 hidden md:inline uppercase tracking-tight">
                WINDOWS UPDATE, SERVICING &amp; CBS
              </span>
            </div>
          </div>

          {/* Quick tab switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>TEORÍA ({investigations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('mission')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mission'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>LAB: SERVICING &amp; CBS</span>
            </button>

            <button
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'test'
                  ? 'bg-cyan-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>TEST DE CERTIFICACIÓN</span>
            </button>

            <button
              onClick={() => setIsMiniCasesOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer border border-cyan-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CASOS PRÁCTICOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Sector Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/90 to-[#0A0D14] border border-cyan-800/40 p-6 md:p-8 mb-8">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold uppercase tracking-wider">
                  NIVEL III: DOMINAR WINDOWS
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">GOLD MASTER · CERTIFICACIÓN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                SECTOR 20: WINDOWS UPDATE
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl">
                El sistema se modifica mientras vos dormís: dominá Servicing Stack (SSU), paquetes LCU, el almacén canónico WinSxS, bitácora forense CBS.log, SoftwareDistribution, rollback y la exclusión de drivers por directiva.
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col items-start sm:items-end gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-cyan-500/30 text-xs font-mono space-y-0.5">
                <div className="text-zinc-500 text-[10px] uppercase">Progreso del sector</div>
                <div className="text-cyan-300 font-bold text-sm">
                  {completedInvs.length} / {investigations.length} INVESTIGACIONES
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMiniCasesOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>VER CASOS PRÁCTICOS DE UPDATE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Architecture Diagrams */}
        <Sector20VisualDiagrams />

        {/* Reader Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Subindex & Search */}
          <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>SUBÍNDICE DEL SECTOR ({investigations.length})</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                {Math.round((completedInvs.length / investigations.length) * 100)}%
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por código, SSU, WinSxS, CBS..."
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* List of investigations */}
            <div className="space-y-1.5">
              {filteredInvs.map((inv) => {
                const isSelected = inv.code === selectedInvCode;
                const isDone = completedInvs.includes(inv.code);

                return (
                  <button
                    key={inv.code}
                    onClick={() => {
                      setSelectedInvCode(inv.code);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span
                          className={`font-bold ${
                            isSelected ? 'text-cyan-300' : 'text-zinc-500'
                          }`}
                        >
                          {inv.code}
                        </span>
                        <span className="text-zinc-600">//</span>
                        <span className="text-zinc-500 truncate">
                          {inv.targetComponent || inv.targetMechanism}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-zinc-200 truncate mt-0.5">
                        {inv.title}
                      </div>
                    </div>
                    {isDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Investigation Details */}
          <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Investigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 font-mono mb-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
                    INVESTIGACIÓN {currentInv.code}
                  </span>
                  <span className="text-zinc-500">//</span>
                  <span className="text-xs font-mono text-zinc-400">
                    {currentInv.targetComponent || currentInv.targetMechanism}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 font-sans">{currentInv.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 font-mono">{currentInv.subtitle}</p>
              </div>

              <button
                onClick={() => toggleInvCompletion(currentInv.code)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  completedInvs.includes(currentInv.code)
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedInvs.includes(currentInv.code) ? 'COMPLETADO' : 'MARCAR COMPLETADO'}
                </span>
              </button>
            </div>

            {/* Hook */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                HOOK // PUNTO DE PARTIDA
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">{currentInv.descubri.hook}</p>
            </div>

            {/* Myth vs Truth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">
                  MITO / CREENCIA COMÚN
                </span>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {currentInv.descubri.mythVsTruth.mentira}
                </p>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                  VERDAD TÉCNICA
                </span>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  {currentInv.descubri.mythVsTruth.verdad}
                </p>
              </div>
            </div>

            {/* Technical explanation blocks */}
            <div className="p-5 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-400 font-mono mb-1 uppercase tracking-wider">
                  ¿QUÉ ES EXACTAMENTE?
                </h4>
                <p className="text-zinc-300">{currentInv.entende.queEs}</p>
              </div>
              <div className="pt-3 border-t border-zinc-800/60">
                <h4 className="font-bold text-cyan-400 font-mono mb-1 uppercase tracking-wider">
                  ¿PARA QUÉ SIRVE EN WINDOWS?
                </h4>
                <p className="text-zinc-300">{currentInv.entende.paraQueSirve}</p>
              </div>
              <div className="pt-3 border-t border-zinc-800/60">
                <h4 className="font-bold text-cyan-400 font-mono mb-1 uppercase tracking-wider">
                  ¿QUÉ PASA SI FALTA O FALLA?
                </h4>
                <p className="text-zinc-300">{currentInv.entende.quePasaSiFalta}</p>
              </div>
            </div>

            {/* Commands section */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                INTERACCIÓN DE LÍNEA DE COMANDOS Y POWERSHELL
              </span>

              <div className="space-y-1">
                <span className="text-[11px] text-cyan-400 block">Comando Nativo CLI:</span>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-200">
                  <code className="text-xs truncate pr-2">{currentInv.interactua.cliExample}</code>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.cliExample, 'cli')}
                    className="p-1 hover:text-cyan-400 text-zinc-500 transition-colors cursor-pointer"
                  >
                    {copiedCmd === 'cli' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-cyan-400 block">Alternativa PowerShell:</span>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-200">
                  <code className="text-xs truncate pr-2">{currentInv.interactua.psExample}</code>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.psExample, 'ps')}
                    className="p-1 hover:text-cyan-400 text-zinc-500 transition-colors cursor-pointer"
                  >
                    {copiedCmd === 'ps' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
                <strong className="text-zinc-300">Métricas Técnicas:</strong>{' '}
                <span className="text-cyan-300 font-mono">{currentInv.interactua.technicalMetrics}</span>
              </div>
              <div className="text-[11px] text-zinc-400">
                <strong className="text-zinc-300">Qué mirar:</strong> {currentInv.interactua.whatToLookFor}
              </div>
            </div>

            {/* Warnings */}
            <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>CLASIFICACIÓN DE RIESGO: {currentInv.riskLevel}</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed">{currentInv.alertaEVO.safetyWarning}</p>
              <div className="text-[11px] text-zinc-400 font-mono pt-1">
                Regla de reversibilidad: {currentInv.alertaEVO.reversibilityRule}
              </div>
            </div>

            {/* Sector Navigation footer */}
            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
              {onOpenSector19 ? (
                <button
                  onClick={onOpenSector19}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>SECTOR ANTERIOR: 19. ENERGÍA</span>
                </button>
              ) : <div />}
              {onOpenSector21 && (
                <button
                  onClick={onOpenSector21}
                  className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>SIGUIENTE SECTOR: 21</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mini Cases Modal */}
      <Tomo02Sector20MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
