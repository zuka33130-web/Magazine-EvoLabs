import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Search,
  AlertTriangle,
  FileText,
  Terminal,
  Activity,
  Copy,
  Check,
  Wrench,
} from 'lucide-react';
import {
  SECTOR_27_INVESTIGATIONS,
  Sector27Investigation,
} from '../../../data/tomo02Sector27Data';
import { Sector27VisualDiagrams } from './Sector27VisualDiagrams';
import { Tomo02Sector27MiniCasesModal } from './Tomo02Sector27MiniCasesModal';
import { Tomo02Sector27MissionView } from './Tomo02Sector27MissionView';
import { Tomo02Sector27TestView } from './Tomo02Sector27TestView';

interface Tomo02Sector27ViewProps {
  initialInvCode?: string;
  onBackToMagazine: () => void;
  onOpenSector26?: () => void;
  onOpenSector28?: () => void;
}

export const Tomo02Sector27View: React.FC<Tomo02Sector27ViewProps> = ({
  initialInvCode,
  onBackToMagazine,
  onOpenSector26,
  onOpenSector28,
}) => {
  const [selectedInvCode, setSelectedInvCode] = useState<string>(initialInvCode || '27.01');

  useEffect(() => {
    if (initialInvCode) {
      setSelectedInvCode(initialInvCode);
    }
  }, [initialInvCode]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'LAB' | 'TEST'>('CONTENT');
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const selectedInv: Sector27Investigation =
    SECTOR_27_INVESTIGATIONS.find((i) => i.code === selectedInvCode) ||
    SECTOR_27_INVESTIGATIONS[0];

  const filteredInvestigations = SECTOR_27_INVESTIGATIONS.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.code.toLowerCase().includes(term) ||
      inv.title.toLowerCase().includes(term) ||
      inv.summary.toLowerCase().includes(term)
    );
  });

  const handleCopyCmd = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (activeTab === 'LAB') {
    return <Tomo02Sector27MissionView onBackToReader={() => setActiveTab('CONTENT')} />;
  }

  if (activeTab === 'TEST') {
    return <Tomo02Sector27TestView onBackToReader={() => setActiveTab('CONTENT')} />;
  }

  return (
    <div className="space-y-6 font-sans-editorial text-zinc-100 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#080B10] border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMagazine}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
            title="Volver al Índice de Tomo 02"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-bold">[SECTOR 27]</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 font-bold text-[10px]">
                GOLD MASTER · ACTIVO
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-0.5">
              DIAGNÓSTICO Y REPARACIÓN
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Protocolo Pericial de Descarte y Reparación del Sistema Operativo
            </p>
          </div>
        </div>

        {/* Tab switcher & Cases button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsMiniCasesOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Casos Prácticos</span>
          </button>

          <div className="flex items-center bg-[#030508] p-1 rounded-xl border border-cyan-500/30 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('CONTENT')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                activeTab === 'CONTENT'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Temario
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LAB')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                activeTab === 'LAB'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Consola / Misiones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TEST')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                activeTab === 'TEST'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Evaluación
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Sub-menu / Investigations List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar en Sector 27..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#080B10] border border-cyan-500/20 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="bg-[#080B10] border border-cyan-500/20 rounded-2xl p-2 space-y-1 max-h-[600px] overflow-y-auto">
            <div className="p-2 border-b border-cyan-500/10 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>TEMARIO OFICIAL (16 SUBMENÚS)</span>
              <span>{filteredInvestigations.length} ITEMS</span>
            </div>

            {filteredInvestigations.map((inv) => {
              const isSelected = inv.code === selectedInvCode;
              return (
                <button
                  key={inv.code}
                  type="button"
                  onClick={() => setSelectedInvCode(inv.code)}
                  className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer font-mono text-xs flex items-center justify-between gap-2 border ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] font-bold'
                      : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-[11px] shrink-0 font-bold ${
                        isSelected ? 'text-cyan-300' : 'text-zinc-500'
                      }`}
                    >
                      {inv.code}
                    </span>
                    <span className="truncate">{inv.title}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-[#080B10] border border-cyan-500/30 space-y-5">
            {/* Investigation Title Header */}
            <div className="border-b border-cyan-500/20 pb-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  SUB-MENÚ {selectedInv.code}
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px]">
                  CATEGORÍA: {selectedInv.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  RIESGO: {selectedInv.riskLevel}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                {selectedInv.title}
              </h2>
              <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                {selectedInv.summary}
              </p>
            </div>

            {/* Visual Diagrams for 27.01 or 27.08 */}
            {(selectedInv.code === '27.01' || selectedInv.code === '27.08') && (
              <Sector27VisualDiagrams />
            )}

            {/* Markdown Body Content */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm font-sans space-y-3 leading-relaxed text-zinc-200">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedInv.contentMarkdown
                    .replace(/### (.*)/g, '<h3 class="text-sm font-bold text-cyan-300 font-mono mt-4 mb-2 uppercase">$1</h3>')
                    .replace(/#### (.*)/g, '<h4 class="text-xs font-bold text-zinc-200 font-mono mt-3 mb-1">$1</h4>')
                    .replace(/```cmd\n([\s\S]*?)```/g, '<pre class="p-3 rounded-xl bg-[#030508] border border-cyan-500/30 font-mono text-cyan-300 text-xs overflow-x-auto my-2">$1</pre>')
                    .replace(/```powershell\n([\s\S]*?)```/g, '<pre class="p-3 rounded-xl bg-[#030508] border border-cyan-500/30 font-mono text-cyan-300 text-xs overflow-x-auto my-2">$1</pre>')
                    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-300 font-mono text-[11px]">$1</code>'),
                }}
              />
            </div>

            {/* Command Examples Box */}
            {(selectedInv.cmdExample || selectedInv.psExample) && (
              <div className="p-4 rounded-xl bg-[#030508] border border-cyan-500/20 space-y-3 font-mono text-xs">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  EJECUCIÓN PERICIAL RECOMENDADA
                </span>

                {selectedInv.cmdExample && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase">CMD (Símbolo del sistema - Admin):</span>
                    <div className="p-2.5 rounded-lg bg-black border border-cyan-500/30 flex items-center justify-between gap-2">
                      <span className="text-cyan-300 select-all">{selectedInv.cmdExample}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCmd(selectedInv.cmdExample!, 1)}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedIndex === 1 ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {selectedInv.psExample && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase">PowerShell 7 (Elevado):</span>
                    <div className="p-2.5 rounded-lg bg-black border border-cyan-500/30 flex items-center justify-between gap-2">
                      <span className="text-cyan-300 select-all">{selectedInv.psExample}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCmd(selectedInv.psExample!, 2)}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedIndex === 2 ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Previous Sector / Back Navigation Footer */}
          <div className="p-4 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex items-center justify-between font-mono text-xs">
            {onOpenSector26 ? (
              <button
                type="button"
                onClick={onOpenSector26}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sector 26: Compatibilidad</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onBackToMagazine}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Volver al Índice
            </button>
            {onOpenSector28 ? (
              <button
                type="button"
                onClick={onOpenSector28}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>Sector 28: BSOD</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* Mini-cases modal */}
      <Tomo02Sector27MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
