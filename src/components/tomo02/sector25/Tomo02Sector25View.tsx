import React, { useState, useEffect } from 'react';
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
  Monitor,
} from 'lucide-react';
import {
  SECTOR_25_INVESTIGATIONS,
  Sector25Investigation,
} from '../../../data/tomo02Sector25Data';
import { Sector25VisualDiagrams } from './Sector25VisualDiagrams';
import { Tomo02Sector25MiniCasesModal } from './Tomo02Sector25MiniCasesModal';
import { Tomo02Sector25MissionView } from './Tomo02Sector25MissionView';
import { Tomo02Sector25TestView } from './Tomo02Sector25TestView';

interface Tomo02Sector25ViewProps {
  initialInvCode?: string;
  onBackToMagazine: () => void;
  onOpenSector24?: () => void;
  onOpenSector26?: () => void;
}

export const Tomo02Sector25View: React.FC<Tomo02Sector25ViewProps> = ({
  initialInvCode,
  onBackToMagazine,
  onOpenSector24,
  onOpenSector26,
}) => {
  const [selectedInvCode, setSelectedInvCode] = useState<string>(initialInvCode || '25.01');

  useEffect(() => {
    if (initialInvCode) {
      setSelectedInvCode(initialInvCode);
    }
  }, [initialInvCode]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'LAB' | 'TEST'>('CONTENT');
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedInv: Sector25Investigation =
    SECTOR_25_INVESTIGATIONS.find((i) => i.code === selectedInvCode) ||
    SECTOR_25_INVESTIGATIONS[0];

  const filteredInvestigations = SECTOR_25_INVESTIGATIONS.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.title.toLowerCase().includes(term) ||
      inv.code.toLowerCase().includes(term) ||
      inv.subtitle.toLowerCase().includes(term)
    );
  });

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (activeTab === 'LAB') {
    return <Tomo02Sector25MissionView onBackToReader={() => setActiveTab('CONTENT')} />;
  }

  if (activeTab === 'TEST') {
    return <Tomo02Sector25TestView onBackToReader={() => setActiveTab('CONTENT')} />;
  }

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMagazine}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              <span>NIVEL IV // DIAGNOSTICAR WINDOWS</span>
              <span>•</span>
              <span>SECTOR 25</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
              ESCRITORIO REMOTO
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMiniCasesOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-cyan-900/60 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Casos Prácticos</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LAB')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Laboratorio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TEST')}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:from-cyan-500 hover:to-cyan-400 transition-all cursor-pointer shadow-md"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Evaluación</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <aside className="w-full lg:w-80 bg-[#080B10] border-r border-slate-800/80 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar subíndice o tema..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredInvestigations.map((inv) => {
              const isSelected = inv.code === selectedInvCode;
              return (
                <button
                  key={inv.code}
                  type="button"
                  onClick={() => setSelectedInvCode(inv.code)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-lg'
                      : 'bg-slate-900/40 border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-cyan-400">
                      <span>{inv.code}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                    </div>
                    <div className="text-xs font-semibold truncate text-slate-200 mt-0.5">{inv.title}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-5xl">
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold">
                SUBÍNDICE {selectedInv.code}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-bold">
                {selectedInv.evidenceBadge.label}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              {selectedInv.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedInv.subtitle}</p>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Ganchos & Desmitificación EVO</span>
            </div>
            <p className="text-sm text-slate-200 font-medium italic">"{selectedInv.descubri.hook}"</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 text-rose-300">
                <span className="font-bold block text-[11px] font-mono uppercase mb-1">El Mito Habitual:</span>
                {selectedInv.descubri.mythVsTruth.mentira}
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300">
                <span className="font-bold block text-[11px] font-mono uppercase mb-1">La Verdad Pericial:</span>
                {selectedInv.descubri.mythVsTruth.verdad}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-400 font-bold block uppercase">¿Qué Es?</span>
              <p className="text-slate-300">{selectedInv.entende.queEs}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-400 font-bold block uppercase">¿Para Qué Sirve?</span>
              <p className="text-slate-300">{selectedInv.entende.paraQueSirve}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-mono text-cyan-400 font-bold block uppercase">¿Qué Pasa Si Falta?</span>
              <p className="text-slate-300">{selectedInv.entende.quePasaSiFalta}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#04060A] border border-cyan-500/30 overflow-hidden font-mono text-xs">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Interacción CLI / PowerShell
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(selectedInv.interactua.psExample, 1)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copiado' : 'Copiar PS'}</span>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Comando CMD / CLI:</span>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-cyan-300">
                  {selectedInv.interactua.cliExample}
                </div>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1">PowerShell Cmdlet:</span>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-emerald-300">
                  {selectedInv.interactua.psExample}
                </div>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">{selectedInv.interactua.syntaxBreakdown}</p>
            </div>
          </div>

          {selectedInv.code === '25.01' && <Sector25VisualDiagrams />}

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold font-mono uppercase block mb-1">Alerta & Seguridad EVO:</span>
              <p>{selectedInv.alertaEVO.safetyWarning}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {onOpenSector24 ? (
              <button
                type="button"
                onClick={onOpenSector24}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sector 24: Máquinas Virtuales</span>
              </button>
            ) : <div />}

            {onOpenSector26 && (
              <button
                type="button"
                onClick={onOpenSector26}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <span>Sector 26: Compatibilidad</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      </div>

      <Tomo02Sector25MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
