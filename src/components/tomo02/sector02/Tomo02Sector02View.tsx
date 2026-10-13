import React, { useState } from 'react';
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
  ShieldAlert,
  FolderCheck,
  HelpCircle,
  Folder,
} from 'lucide-react';
import {
  SECTOR_02_INVESTIGATIONS,
  Sector02Investigation,
} from '../../../data/tomo02Sector02Data';
import { TOMO_02_MASTER_SECTORS } from '../../../data/tomo02MasterSectors';
import { Tomo02Sector02MiniCasesModal } from './Tomo02Sector02MiniCasesModal';
import { Tomo02Sector02TestView } from './Tomo02Sector02TestView';
import { Tomo02Sector02MissionView } from './Tomo02Sector02MissionView';
import { Sector02VisualDiagram } from './Sector02VisualDiagrams';

interface Tomo02Sector02ViewProps {
  onBackToMagazine?: () => void;
  onOpenSector00?: () => void;
  onOpenSector01?: () => void;
}

export const Tomo02Sector02View: React.FC<Tomo02Sector02ViewProps> = ({
  onBackToMagazine,
  onOpenSector00,
  onOpenSector01,
}) => {
  // Navigation & Subviews
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvIndex, setSelectedInvIndex] = useState(0);
  const [showCasesModal, setShowCasesModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Progress state
  const [completedInvestigations, setCompletedInvestigations] = useState<Record<string, boolean>>({});
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, any>>({});
  const [challengeSuccess, setChallengeSuccess] = useState<Record<string, boolean>>({});

  // Copy helper
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentInv: Sector02Investigation =
    SECTOR_02_INVESTIGATIONS[selectedInvIndex] || SECTOR_02_INVESTIGATIONS[0];

  const handleCompleteInvestigation = (invId: string) => {
    setCompletedInvestigations((prev) => ({
      ...prev,
      [invId]: true,
    }));
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const completedCount = Object.keys(completedInvestigations).length;
  const progressPercent = Math.round((completedCount / SECTOR_02_INVESTIGATIONS.length) * 100);

  const filteredInvestigations = SECTOR_02_INVESTIGATIONS.filter(
    (inv) =>
      inv.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inv.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      inv.subtitle.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05070A] text-zinc-100 flex flex-col font-sans selection:bg-[#0078D4] selection:text-white">
      {/* Modals */}
      {showCasesModal && (
        <Tomo02Sector02MiniCasesModal
          onClose={() => setShowCasesModal(false)}
        />
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur-md border-b border-[#00A4EF]/30 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,120,212,0.15)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToMagazine}
            className="p-2 rounded-xl bg-[#11161D] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5 font-mono text-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#00A4EF]" />
            <span className="hidden sm:inline">ÍNDICE MAESTRO</span>
          </button>

          <div className="h-5 w-px bg-zinc-800 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00A4EF] animate-pulse" />
              <span className="font-bold text-[#60CDFF]">[SECTOR 02]</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                EL MAPA DE WINDOWS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono hidden sm:block">
              Dónde está cada cosa · 30 Investigaciones
            </p>
          </div>
        </div>

        {/* Global Controls & Progress */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 bg-[#11161D] border border-sky-500/20 rounded-xl px-3 py-1.5">
            <span className="text-zinc-400">PROGRESO:</span>
            <span className="text-[#60CDFF] font-bold">{completedCount}/30</span>
            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-[#0078D4] to-[#00A4EF] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCasesModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#0078D4]/20 hover:bg-[#0078D4]/30 border border-[#00A4EF]/50 text-[#60CDFF] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5 CASOS</span>
          </button>
        </div>
      </header>

      {/* Mode Sub-Header Tabs */}
      <div className="bg-[#080B10] border-b border-zinc-800/80 px-4 sm:px-8 py-2 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('reader')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reader'
                ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#11161D]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>30 INVESTIGACIONES</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mission')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mission'
                ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#11161D]'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>MISIÓN PRÁCTICA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('test')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'test'
                ? 'bg-[#0078D4] text-white shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#11161D]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>EXAMEN TEST</span>
          </button>
        </div>

        {activeTab === 'reader' && (
          <div className="hidden md:flex items-center gap-2 bg-[#11161D] border border-sky-500/20 rounded-lg px-2.5 py-1 w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar tema o código..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none w-full"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'test' ? (
          <Tomo02Sector02TestView
            onBack={() => setActiveTab('reader')}
            onPassTest={() => {
              setActiveTab('reader');
            }}
          />
        ) : activeTab === 'mission' ? (
          <Tomo02Sector02MissionView
            onBack={() => setActiveTab('reader')}
            onMissionComplete={() => {
              setActiveTab('reader');
            }}
          />
        ) : (
          /* Reader Mode: Split View (Sidebar list + Reader Pane) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar List (30 Investigations) */}
            <div className="lg:col-span-4 bg-[#080B10] border border-sky-500/20 rounded-2xl overflow-hidden flex flex-col max-h-[82vh] sticky top-24 font-mono text-xs">
              <div className="p-3.5 bg-[#05070A] border-b border-zinc-800 flex items-center justify-between">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#00A4EF]" />
                  TEMARIO SECTOR 02
                </span>
                <span className="text-[10px] text-zinc-400">
                  {filteredInvestigations.length} TEMAS
                </span>
              </div>

              <div className="overflow-y-auto p-2 space-y-1 divide-y divide-zinc-900">
                {filteredInvestigations.map((inv) => {
                  const actualIdx = SECTOR_02_INVESTIGATIONS.findIndex((i) => i.id === inv.id);
                  const isSelected = actualIdx === selectedInvIndex;
                  const isDone = completedInvestigations[inv.id];

                  return (
                    <button
                      key={inv.id}
                      type="button"
                      onClick={() => setSelectedInvIndex(actualIdx)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0078D4]/20 border border-[#00A4EF] text-white shadow-[0_0_15px_rgba(0,164,239,0.15)]'
                          : 'hover:bg-[#11161D] text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className={`text-[11px] font-bold ${isSelected ? 'text-[#60CDFF]' : 'text-zinc-500'}`}>
                            {inv.code}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className={`font-bold line-clamp-1 text-xs ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {inv.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 line-clamp-1 font-sans">
                          {inv.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reader Pane (Current Selected Investigation) */}
            <div className="lg:col-span-8 bg-[#080B10] border border-sky-500/20 rounded-2xl p-6 space-y-8 shadow-[0_0_30px_rgba(0,120,212,0.08)]">
              {/* 1. Header & Risk Level */}
              <div className="border-b border-zinc-800 pb-5 space-y-3 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0078D4]/20 border border-[#00A4EF]/40 text-[#60CDFF] font-bold text-xs">
                      {currentInv.code}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 text-xs font-bold uppercase">
                      SECTOR 02 · EL MAPA DE WINDOWS
                    </span>
                  </div>

                  {/* Risk Badge */}
                  <div className="shrink-0">
                    {currentInv.riskLevel === 'SAFE_TO_CLEAN' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                        SAFE TO CLEAN
                      </span>
                    )}
                    {currentInv.riskLevel === 'SPECIFIC_PROCEDURE' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
                        PROCEDIMIENTO ESPECÍFICO
                      </span>
                    )}
                    {currentInv.riskLevel === 'NEVER_DELETE_MANUALLY' && (
                      <span className="px-2.5 py-1 rounded-full bg-red-950/60 text-red-400 border border-red-500/40 text-[10px] font-bold">
                        JAMÁS BORRAR MANUALMENTE
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight font-sans">
                  {currentInv.title}
                </h1>
                <p className="text-sm text-[#60CDFF] font-sans italic">
                  {currentInv.subtitle}
                </p>
              </div>

              {/* 2. DESCUBRÍ: Hook + Mito vs Verdad */}
              <div className="space-y-4 font-sans">
                <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/20 text-xs text-zinc-200 leading-relaxed italic">
                  "{currentInv.descubri.hook}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Mentira */}
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>MENTIRA COMÚN</span>
                    </div>
                    <p className="text-zinc-300 font-sans text-xs">
                      {currentInv.descubri.mythVsTruth.mentira}
                    </p>
                  </div>

                  {/* Verdad */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>VERDAD TÉCNICA</span>
                    </div>
                    <p className="text-zinc-300 font-sans text-xs">
                      {currentInv.descubri.mythVsTruth.verdad}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. ENTENDÉ: Explicación teórica */}
              <div className="space-y-3 font-sans">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                  <BookOpen className="w-4 h-4 text-[#00A4EF]" />
                  <span>ENTENDÉ EL FUNCIONAMIENTO</span>
                </div>
                <div className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                  {currentInv.entende.explanation.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* 4. VISUAL REPRESENTATION DIAGRAM */}
              <div className="space-y-2">
                <Sector02VisualDiagram code={currentInv.code} />
              </div>

              {/* 5. PROFUNDIZÁ: Detalles técnicos de bajo nivel */}
              <div className="p-4 rounded-xl bg-[#05070A] border border-sky-500/20 space-y-3 font-sans text-xs">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#60CDFF]">
                  <Terminal className="w-4 h-4 text-[#00A4EF]" />
                  <span>PROFUNDIZACIÓN DE BAJO NIVEL</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-zinc-300">
                  {currentInv.profundiza.technicalDetails.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
                {currentInv.profundiza.lowLevelNote && (
                  <div className="mt-2 p-2.5 rounded bg-[#11161D] border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                    <span className="font-bold">NOTA DE BAJO NIVEL: </span>
                    {currentInv.profundiza.lowLevelNote}
                  </div>
                )}
              </div>

              {/* 6. MÍRALO EN TU PC: Acción y comandos copiables */}
              <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Activity className="w-4 h-4 text-[#00A4EF]" />
                    <span>MÍRALO EN TU PC: {currentInv.miraloEnTuPc.actionName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-zinc-300 text-xs font-sans">
                    <span className="font-bold font-mono text-[#60CDFF]">Pasos de verificación:</span>
                    <ol className="list-decimal list-inside mt-1 space-y-1 text-zinc-300">
                      {currentInv.miraloEnTuPc.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {currentInv.miraloEnTuPc.commandOrPath && (
                    <div className="flex items-center justify-between p-2.5 rounded bg-[#05070A] border border-sky-500/20 text-[#60CDFF]">
                      <code>{currentInv.miraloEnTuPc.commandOrPath}</code>
                      <button
                        type="button"
                        onClick={() => handleCopyText(currentInv.miraloEnTuPc.commandOrPath || '')}
                        className="p-1 rounded bg-[#11161D] hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer transition-colors"
                      >
                        {copiedCode === currentInv.miraloEnTuPc.commandOrPath ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400 font-sans">
                    <span className="font-bold font-mono text-zinc-300">Resultado esperado: </span>
                    {currentInv.miraloEnTuPc.expectedVisual}
                  </p>
                </div>
              </div>

              {/* 7. MICRODESAFÍO PRÁCTICO */}
              <div className="p-5 rounded-xl bg-[#080B10] border border-[#00A4EF]/30 space-y-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-white font-bold border-b border-zinc-800 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>MICRODESAFÍO PRÁCTICO</span>
                </div>

                <p className="font-sans text-sm text-zinc-200 font-bold">
                  {currentInv.microdesafio.question}
                </p>

                {currentInv.microdesafio.options && (
                  <div className="space-y-2">
                    {currentInv.microdesafio.options.map((opt) => {
                      const ansKey = `${currentInv.id}`;
                      const isSelected = challengeAnswers[ansKey] === opt.id;
                      const isSuccess = challengeSuccess[ansKey];

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setChallengeAnswers((prev) => ({ ...prev, [ansKey]: opt.id }));
                            if (opt.isCorrect) {
                              setChallengeSuccess((prev) => ({ ...prev, [ansKey]: true }));
                              handleCompleteInvestigation(currentInv.id);
                            }
                          }}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                : 'bg-red-950/60 border-red-500 text-red-200'
                              : 'bg-[#11161D] border-sky-500/10 text-zinc-300 hover:border-sky-500/30'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected && opt.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isSelected && !opt.isCorrect ? (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-zinc-600" />
                            )}
                          </div>
                          <div>
                            <div>{opt.text}</div>
                            {isSelected && (
                              <p className="text-[11px] text-zinc-300 font-sans mt-1">
                                {opt.feedback}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 8. Footer & Next Investigation Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedInvIndex > 0) setSelectedInvIndex((prev) => prev - 1);
                  }}
                  disabled={selectedInvIndex === 0}
                  className="px-4 py-2 rounded-xl bg-[#11161D] disabled:opacity-40 text-zinc-300 font-bold border border-sky-500/20 cursor-pointer"
                >
                  ANTERIOR
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleCompleteInvestigation(currentInv.id);
                    if (selectedInvIndex < SECTOR_02_INVESTIGATIONS.length - 1) {
                      setSelectedInvIndex((prev) => prev + 1);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,164,239,0.2)]"
                >
                  <span>
                    {selectedInvIndex < SECTOR_02_INVESTIGATIONS.length - 1
                      ? 'COMPLETAR Y SIGUIENTE'
                      : 'FINALIZAR SECTOR 02'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
