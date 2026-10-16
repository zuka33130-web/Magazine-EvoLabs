import React, { useState } from 'react';
import { useTomo02LegacySectorProgress, type LegacySectorStatus } from '../shared/useTomo02LegacySectorProgress';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Award,
  ArrowLeft,
  Search,
  AlertTriangle,
  Lightbulb,
  FileText,
  Terminal,
  Activity,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

import {
  SECTOR_05_INVESTIGATIONS,
  Sector05Investigation,
} from '../../../data/tomo02Sector05Data';
import { Sector05VisualDiagrams } from './Sector05VisualDiagrams';
import { Tomo02Sector05MiniCasesModal } from './Tomo02Sector05MiniCasesModal';
import { Tomo02Sector05TestView } from './Tomo02Sector05TestView';
import { Tomo02Sector05MissionView } from './Tomo02Sector05MissionView';

interface Tomo02Sector05ViewProps {
  onSectorProgress?: (id: string, status: LegacySectorStatus) => void;
  onBackToMagazine: () => void;
  onOpenSector00?: () => void;
  onOpenSector01?: () => void;
  onOpenSector02?: () => void;
  onOpenSector03?: () => void;
  onOpenSector04?: () => void;
}

export const Tomo02Sector05View: React.FC<Tomo02Sector05ViewProps> = ({
  onSectorProgress,
  onBackToMagazine,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvCode, setSelectedInvCode] = useState<string>('05.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isMiniCasesOpen, setIsMiniCasesOpen] = useState<boolean>(false);
  const recorder = useTomo02LegacySectorProgress('05', SECTOR_05_INVESTIGATIONS.map(inv => inv.code), 80, onSectorProgress);
  const completedInvs = recorder.completedCodes;
  const setCompletedInvs = recorder.setCompletedCodes;

  const investigations = SECTOR_05_INVESTIGATIONS;

  const currentInv: Sector05Investigation =
    investigations.find((i) => i.code === selectedInvCode) || investigations[0];

  const filteredInvs = investigations.filter(
    (i) =>
      i.code.includes(searchQuery) ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
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
    return <Tomo02Sector05MissionView onBack={() => setActiveTab('reader')} onPracticeCompleted={() => recorder.setMissionPassed(true)} />;
  }

  if (activeTab === 'test') {
    return <Tomo02Sector05TestView onBack={() => setActiveTab('reader')} onPassTest={recorder.setTestScore} />;
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

            <div>
              <span className="text-[10px] font-mono font-bold text-[#60CDFF] tracking-wider uppercase block">
                EVO LABS // TOMO 02
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>SECTOR 05 // PROCESOS QUE NO VES</span>
                <span className="hidden md:inline px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] border border-[#00A4EF]/30 font-mono text-[10px]">
                  21 INVESTIGACIONES
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMiniCasesOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#0078D4]/20 hover:bg-[#0078D4]/30 border border-[#00A4EF]/40 text-[#60CDFF] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CASOS (5)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mission')}
              className="px-3 py-1.5 rounded-lg bg-[#0078D4]/20 hover:bg-[#0078D4]/30 border border-[#00A4EF]/40 text-[#60CDFF] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>LAB: IDLE WATCH</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_12px_rgba(0,164,239,0.3)] hover:brightness-110"
            >
              <Award className="w-3.5 h-3.5" />
              <span>EXAMEN</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Index */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#090D14] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400 font-bold uppercase">TEMARIO CANÓNICO</span>
              <span className="text-[#60CDFF] font-bold">
                {completedInvs.length} / {investigations.length}
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar investigación 05.xx..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0F1420] border border-zinc-800 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#00A4EF]"
              />
            </div>

            {/* List */}
            <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredInvs.map((inv) => {
                const isSelected = inv.code === selectedInvCode;
                const isDone = completedInvs.includes(inv.code);

                return (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => setSelectedInvCode(inv.code)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${isSelected ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white font-bold shadow-[0_0_15px_rgba(0,164,239,0.2)]' : 'bg-[#0B0F17] border-zinc-800/80 text-zinc-400 hover:bg-[#101622] hover:text-zinc-200'}`}
                  >
                    <span
                      className={`font-mono text-[11px] font-bold shrink-0 mt-0.5 ${isSelected ? 'text-[#60CDFF]' : 'text-zinc-500'}`}
                    >
                      {inv.code}
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs truncate leading-snug">{inv.title}</p>
                      <p className="text-[10px] text-zinc-500 line-clamp-1 font-mono">
                        {inv.tabOrMetric}
                      </p>
                    </div>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content Column */}
        <section className="lg:col-span-8 space-y-6">
          {/* Active Investigation Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 space-y-6 shadow-[0_0_30px_rgba(0,164,239,0.12)]">
            {/* Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#0078D4]/30 text-[#60CDFF] border border-[#00A4EF]/40 font-bold">
                    INVESTIGACIÓN {currentInv.code}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400 font-mono text-[11px]">{currentInv.tabOrMetric}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {currentInv.title}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">{currentInv.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleInvCompletion(currentInv.code)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto ${completedInvs.includes(currentInv.code) ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{completedInvs.includes(currentInv.code) ? 'COMPLETADO' : 'MARCAR VISTO'}</span>
              </button>
            </div>

            {/* Central Visual Component */}
            <Sector05VisualDiagrams code={currentInv.code} />

            {/* DESCUBRÍ (Myth vs Truth) */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#60CDFF]" />
                <span>1 // DESCUBRÍ (MITO VS VERDAD)</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#0D121C] border border-sky-500/20 space-y-3 text-xs">
                <p className="text-zinc-300 leading-relaxed italic">{currentInv.descubri.hook}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 space-y-1">
                    <span className="text-red-400 font-mono font-bold text-[10px] uppercase block">
                      MITO COMÚN:
                    </span>
                    <p className="text-red-200 text-[11px]">{currentInv.descubri.mythVsTruth.mentira}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <span className="text-emerald-400 font-mono font-bold text-[10px] uppercase block">
                      VERDAD CANÓNICA:
                    </span>
                    <p className="text-emerald-200 text-[11px]">{currentInv.descubri.mythVsTruth.verdad}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-black/40 border border-zinc-800 text-zinc-300 font-mono text-[11px] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#60CDFF] shrink-0" />
                  <span>COMPRÓBALO: {currentInv.descubri.mythVsTruth.comprobalo}</span>
                </div>
              </div>
            </div>

            {/* ENTENDÉ */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#60CDFF]" />
                <span>2 // ENTENDÉ (FUNDAMENTOS PERICIALES)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <div className="p-3.5 rounded-xl bg-[#0D121C] border border-zinc-800 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#60CDFF] uppercase block">
                    ¿QUÉ ES?
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">{currentInv.entende.queEs}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D121C] border border-zinc-800 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#60CDFF] uppercase block">
                    ¿PARA QUÉ SIRVE?
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">{currentInv.entende.paraQueSirve}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D121C] border border-zinc-800 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase block">
                    ¿QUÉ PASA SI FALTA?
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">{currentInv.entende.quePasaSiFalta}</p>
                </div>
              </div>
            </div>

            {/* INTERACTUÁ (PowerShell & Command) */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#60CDFF]" />
                <span>3 // INTERACTUÁ (COMANDOS Y RUTA)</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#0C1017] border border-zinc-800 space-y-3 font-mono text-xs">
                {currentInv.interactua.powershellCommand && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span>POWERSHELL COMMAND:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentInv.interactua.powershellCommand!, 'ps')}
                        className="text-[#60CDFF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCmd === 'ps' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCmd === 'ps' ? 'COPIADO' : 'COPIAR'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded bg-black/60 border border-zinc-800/80 text-emerald-300 overflow-x-auto text-[11px]">
                      <code>{currentInv.interactua.powershellCommand}</code>
                    </pre>
                  </div>
                )}

                <div className="p-2.5 rounded bg-[#121824] text-zinc-300 text-[11px] flex items-center justify-between">
                  <span>QUÉ BUSCAR: {currentInv.interactua.whatToLookFor}</span>
                </div>
              </div>
            </div>

            {/* ALERTA EVO */}
            <div className="p-4 rounded-xl bg-[#090D14] border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>ALERTA DE SEGURIDAD EVO LABS</span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {currentInv.alertaEVO.falsePositiveWarning}
              </p>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-200 font-mono text-[10px]">
                REGLA DE REVERSIBILIDAD: {currentInv.alertaEVO.reversibilityRule}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mini Cases Modal */}
      <Tomo02Sector05MiniCasesModal
        isOpen={isMiniCasesOpen}
        onClose={() => setIsMiniCasesOpen(false)}
      />
    </div>
  );
};
