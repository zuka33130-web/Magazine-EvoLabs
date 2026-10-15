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
  Eye,
  Globe,
  Radio,
  HardDrive,
} from 'lucide-react';
import {
  SECTOR_22_INVESTIGATIONS,
  Sector22Investigation,
} from '../../../data/tomo02Sector22Data';
import { Sector22VisualDiagrams } from './Sector22VisualDiagrams';
import { Tomo02Sector22MiniCasesModal } from './Tomo02Sector22MiniCasesModal';
import { Tomo02Sector22TestView } from './Tomo02Sector22TestView';
import { Tomo02Sector22MissionView } from './Tomo02Sector22MissionView';

interface Tomo02Sector22ViewProps {
  onBackToMagazine: () => void;
  onOpenSector21?: () => void;
}

export const Tomo02Sector22View: React.FC<Tomo02Sector22ViewProps> = ({
  onBackToMagazine,
  onOpenSector21,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvCode, setSelectedInvCode] = useState<string>('22.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState<boolean>(false);
  const [completedInvs, setCompletedInvs] = useState<string[]>([]);

  const investigations = SECTOR_22_INVESTIGATIONS;
  const currentInv: Sector22Investigation =
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
    return <Tomo02Sector22MissionView onBackToReader={() => setActiveTab('reader')} />;
  }

  if (activeTab === 'test') {
    return <Tomo02Sector22TestView onBackToReader={() => setActiveTab('reader')} />;
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
                <span>SECTOR 22</span>
                <span>•</span>
                <span>NIVEL III // DOMINAR WINDOWS</span>
              </div>
              <h1 className="text-base font-bold text-slate-100 leading-tight">
                PRIVACIDAD Y TELEMETRÍA: “¿Quién me está mirando?”
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
              <span>Examen ({SECTOR_22_INVESTIGATIONS.length})</span>
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
                <Eye className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Casos de Estudio Forense</span>
              </div>
              <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
                2 CASOS
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar en el Sector 22 (DiagTrack, SRUM, Sockets...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
            />
          </div>

          {/* Subindices Item List */}
          <div className="space-y-1.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
            {filteredInvs.map((inv) => {
              const isSelected = inv.code === selectedInvCode;
              const isDone = completedInvs.includes(inv.code);

              return (
                <button
                  key={inv.id}
                  onClick={() => setSelectedInvCode(inv.code)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/60 text-slate-100 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(inv.code);
                      }}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-slate-700 hover:border-cyan-500 text-transparent'
                      }`}
                      title={isDone ? 'Marcar como no leído' : 'Marcar como leído'}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-cyan-400 font-bold">{inv.code}</span>
                        <span className="text-slate-300 font-semibold truncate">{inv.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{inv.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content: Selected Investigation Reader */}
        <section className="lg:col-span-8 space-y-8">
          {/* Current Subindex Main Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg font-bold">
                  {currentInv.code}
                </span>
                <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg">
                  {currentInv.evidenceBadge.label}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                Riesgo: <span className="text-emerald-400 font-bold">{currentInv.riskLevel}</span>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold text-slate-100">{currentInv.title}</h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">{currentInv.subtitle}</p>
            </div>

            {/* Target Component */}
            <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-500">Mecanismo Target:</span>
              <span className="text-cyan-300 font-bold">{currentInv.targetMechanism}</span>
            </div>
          </div>

          {/* Section 1: Descubrí */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
              <Activity className="w-4 h-4" />
              <span>1. Descubrí el Funcionamiento Real</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 font-serif italic">
              "{currentInv.descubri.hook}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                <div className="text-xs font-mono text-rose-400 font-bold uppercase">Mentira Frecuente</div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentInv.descubri.mythVsTruth.mentira}</p>
              </div>
              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2">
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Verdad Canónica EVO</div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentInv.descubri.mythVsTruth.verdad}</p>
              </div>
            </div>

            <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/30 rounded-xl text-xs font-mono text-cyan-200 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase text-cyan-400">Comprobalo en tu sistema: </span>
                <span>{currentInv.descubri.mythVsTruth.comprobalo}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Entendé */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
              <FileText className="w-4 h-4" />
              <span>2. Entendé la Arquitectura del Sistema</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">¿Qué es?</div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentInv.entende.queEs}</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">¿Para qué sirve?</div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentInv.entende.paraQueSirve}</p>
              </div>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">¿Qué pasa si falta?</div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentInv.entende.quePasaSiFalta}</p>
              </div>
            </div>
          </div>

          {/* Visual Diagrams Section */}
          <Sector22VisualDiagrams />

          {/* Section 3: Interactuá */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>3. Interactuá en la Consola</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>PowerShell Command</span>
                  <button
                    onClick={() => handleCopy(currentInv.interactua.psExample)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedCmd === currentInv.interactua.psExample ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCmd === currentInv.interactua.psExample ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <code className="text-cyan-300 block font-bold break-all">
                  {currentInv.interactua.psExample}
                </code>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-300 leading-relaxed space-y-2">
                <div className="text-cyan-400 font-bold text-[11px] uppercase">Desglose Sintáctico:</div>
                <p className="text-xs text-slate-300">{currentInv.interactua.syntaxBreakdown}</p>
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <span className="text-emerald-400 font-bold">Métrica / Resultado Esperado: </span>
                  {currentInv.interactua.whatToLookFor}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Alerta EVO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase font-bold tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>4. Alerta EVO & Regla de Reversibilidad</span>
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
            {onOpenSector21 ? (
              <button
                onClick={onOpenSector21}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span>Sector 21: Seguridad</span>
              </button>
            ) : <div />}

            <button
              onClick={onBackToMagazine}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs rounded-xl flex items-center gap-2 transition-all"
            >
              <span>Volver al Índice General</span>
            </button>
          </div>
        </section>
      </main>

      {/* Mini Cases Modal */}
      <Tomo02Sector22MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
