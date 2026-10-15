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
  Clock,
} from 'lucide-react';
import {
  SECTOR_23_INVESTIGATIONS,
  Sector23Investigation,
} from '../../../data/tomo02Sector23Data';
import { Sector23VisualDiagrams } from './Sector23VisualDiagrams';
import { Tomo02Sector23MiniCasesModal } from './Tomo02Sector23MiniCasesModal';
import { Tomo02Sector23TestView } from './Tomo02Sector23TestView';
import { Tomo02Sector23MissionView } from './Tomo02Sector23MissionView';

interface Tomo02Sector23ViewProps {
  onBackToMagazine: () => void;
  onOpenSector22?: () => void;
  onOpenSector24?: () => void;
}

export const Tomo02Sector23View: React.FC<Tomo02Sector23ViewProps> = ({
  onBackToMagazine,
  onOpenSector22,
  onOpenSector24,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvCode, setSelectedInvCode] = useState<string>('23.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState<boolean>(false);
  const [completedInvs, setCompletedInvs] = useState<string[]>([]);

  const investigations = SECTOR_23_INVESTIGATIONS;
  const currentInv: Sector23Investigation =
    investigations.find((i) => i.code === selectedInvCode) || investigations[0];

  const filteredInvs = investigations.filter(
    (i) =>
      i.code.includes(searchQuery) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.targetComponent && i.targetComponent.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleComplete = (code: string) => {
    setCompletedInvs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  if (activeTab === 'mission') {
    return <Tomo02Sector23MissionView onBackToReader={() => setActiveTab('reader')} />;
  }

  if (activeTab === 'test') {
    return <Tomo02Sector23TestView onBackToReader={() => setActiveTab('reader')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMagazine}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
              title="Volver al índice del Tomo 02"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                <span>SECTOR 23</span>
                <span>•</span>
                <span>NIVEL III // DOMINAR WINDOWS</span>
              </div>
              <h1 className="text-base font-bold text-slate-100 leading-tight">
                LO QUE WINDOWS HACE CUANDO NO ESTÁS MIRANDO
              </h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Investigaciones</span>
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'mission'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Consola Misión</span>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'test'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Examen ({SECTOR_23_INVESTIGATIONS.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Subindices List */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Action Modals Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMiniCasesOpen(true)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-500/60 rounded-xl font-mono text-xs text-cyan-300 font-bold flex items-center justify-between transition-all group shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Casos Reales en Idle</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar subíndice (ej: 23.01, Defender, TRIM)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
            />
          </div>

          {/* Subindex List */}
          <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredInvs.map((inv) => {
              const isSelected = inv.code === selectedInvCode;
              const isDone = completedInvs.includes(inv.code);

              return (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvCode(inv.code)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-slate-100 shadow-md'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-cyan-400'
                      }`}
                    >
                      {inv.code}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate leading-snug">
                        {inv.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {inv.targetMechanism}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(inv.code);
                    }}
                    className={`p-1 rounded-lg shrink-0 transition-colors ${
                      isDone
                        ? 'text-emerald-400 bg-emerald-950/50'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={isDone ? 'Marcado como visto' : 'Marcar como visto'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Section: Deep Investigation Content */}
        <section className="lg:col-span-8 space-y-6">
          {/* Active Subindex Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-cyan-500 text-slate-950 font-mono font-bold text-xs rounded-lg">
                  {currentInv.code}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{currentInv.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{currentInv.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg">
                  {currentInv.evidenceBadge.code}
                </span>
                <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg">
                  {currentInv.riskLevel}
                </span>
              </div>
            </div>

            {/* TAB 1: DESCUBRÍ */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>1. DESCUBRÍ // El Gancho y la Verdad Técnica</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {currentInv.descubri.hook}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
                  <div className="text-rose-400 font-mono font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Mito Común</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentInv.descubri.mythVsTruth.mentira}
                  </p>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="text-emerald-400 font-mono font-bold uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verdad Empírica EVO</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentInv.descubri.mythVsTruth.verdad}
                  </p>
                </div>
              </div>
            </div>

            {/* TAB 2: ENTENDÉ */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>2. ENTENDÉ // Análisis del Mecanismo</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-mono font-bold text-cyan-400">¿Qué Es?</div>
                  <p className="text-slate-300 leading-relaxed">{currentInv.entende.queEs}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-mono font-bold text-cyan-400">¿Para Qué Sirve?</div>
                  <p className="text-slate-300 leading-relaxed">{currentInv.entende.paraQueSirve}</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-mono font-bold text-cyan-400">¿Qué pasa si falta?</div>
                  <p className="text-slate-300 leading-relaxed">{currentInv.entende.quePasaSiFalta}</p>
                </div>
              </div>
            </div>

            {/* TAB 3: INTERACTUÁ */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4" />
                <span>3. INTERACTUÁ // Inspección por Consola</span>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold">Comando de Diagnóstico</span>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.psExample)}
                    className="hover:text-slate-100 flex items-center gap-1 transition-colors"
                  >
                    {copiedCmd === currentInv.interactua.psExample ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCmd === currentInv.interactua.psExample ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="text-cyan-300 overflow-x-auto">
                  <span className="text-slate-500">PS C:\&gt; </span>
                  {currentInv.interactua.psExample}
                </div>

                <p className="text-slate-400 font-sans text-xs pt-2 border-t border-slate-800/60">
                  {currentInv.interactua.syntaxBreakdown}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Diagrams Section */}
          <Sector23VisualDiagrams />

          {/* Safety & Alert Banner */}
          <div className="p-5 bg-slate-900 border border-amber-500/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Advertencia Pericial y Regla de Reversibilidad</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentInv.alertaEVO.safetyWarning}
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-400">
              <span className="text-cyan-400 font-bold">Regla de Reversibilidad: </span>
              {currentInv.alertaEVO.reversibilityRule}
            </div>
          </div>

          {/* Sector Navigation Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
            {onOpenSector22 ? (
              <button
                onClick={onOpenSector22}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Sector 22: Privacidad</span>
              </button>
            ) : <div />}

            <button
              onClick={onBackToMagazine}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              <span>Volver al Índice General</span>
            </button>

            {onOpenSector24 ? (
              <button
                onClick={onOpenSector24}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition-all"
              >
                <span>Sector 24: Máquinas Virtuales</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </section>
      </main>

      {/* Mini Cases Modal */}
      <Tomo02Sector23MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
