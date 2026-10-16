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
  Terminal,
  Activity,
  Copy,
  Check,
  Play,
  Compass,
  FileText,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  SECTOR_01_MYTHS_AND_TRUTHS,
  SECTOR_01_TUTOR_ADVICE,
  Sector01Investigation,
} from '../../../data/tomo02Sector01Data';
import { SECTOR_01_INVESTIGATIONS } from '../../../data/tomo02Sector01Investigations';
import { Tomo02Sector01ExpedienteModal, Sector01BootDossier } from './Tomo02Sector01ExpedienteModal';
import { Tomo02Sector01MiniCasesModal } from './Tomo02Sector01MiniCasesModal';
import { Tomo02Sector01LabModal } from './Tomo02Sector01LabModal';
import { Tomo02Sector01MapModal } from './Tomo02Sector01MapModal';
import { Tomo02Sector01TestView } from './Tomo02Sector01TestView';
import { Tomo02Sector01MissionView } from './Tomo02Sector01MissionView';

interface Tomo02Sector01ViewProps {
  onSectorProgress?: (id: string, status: LegacySectorStatus) => void;
  onBackToMagazine?: () => void;
  onOpenSector00?: () => void;
}

export const Tomo02Sector01View: React.FC<Tomo02Sector01ViewProps> = ({
  onSectorProgress,
  onBackToMagazine,
  onOpenSector00,
}) => {
  // Navigation & Subviews
  const [activeTab, setActiveTab] = useState<'reader' | 'mission' | 'test'>('reader');
  const [selectedInvIndex, setSelectedInvIndex] = useState(0);
  const [showExpedienteModal, setShowExpedienteModal] = useState(false);
  const [showCasesModal, setShowCasesModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Progress state
  const recorder = useTomo02LegacySectorProgress('01', SECTOR_01_INVESTIGATIONS.map(inv => inv.id), 70, onSectorProgress);
  const completedInvestigations = recorder.completedRecords;
  const setCompletedInvestigations = recorder.setCompletedRecords;
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, any>>({});

  // Expediente state
  const [dossierData, setDossierData] = useState<Sector01BootDossier | undefined>(undefined);

  // Copy helper
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentInv: Sector01Investigation =
    SECTOR_01_INVESTIGATIONS[selectedInvIndex] || SECTOR_01_INVESTIGATIONS[0];

  const currentTutorTip =
    selectedInvIndex < 5
      ? SECTOR_01_TUTOR_ADVICE[0].tip
      : selectedInvIndex < 12
      ? SECTOR_01_TUTOR_ADVICE[1].tip
      : selectedInvIndex < 18
      ? SECTOR_01_TUTOR_ADVICE[2].tip
      : selectedInvIndex < 24
      ? SECTOR_01_TUTOR_ADVICE[3].tip
      : SECTOR_01_TUTOR_ADVICE[4].tip;

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
  const progressPercent = Math.round((completedCount / SECTOR_01_INVESTIGATIONS.length) * 100);

  return (
    <div className="min-h-screen bg-[#05070A] text-zinc-100 flex flex-col font-sans selection:bg-[#0078D4] selection:text-white">
      {/* Modals on Demand */}
      {showExpedienteModal && (
        <Tomo02Sector01ExpedienteModal
          onClose={() => setShowExpedienteModal(false)}
          dossierData={dossierData}
        />
      )}
      {showCasesModal && (
        <Tomo02Sector01MiniCasesModal onClose={() => setShowCasesModal(false)} />
      )}
      {showLabModal && (
        <Tomo02Sector01LabModal onClose={() => setShowLabModal(false)} />
      )}
      {showMapModal && (
        <Tomo02Sector01MapModal onClose={() => setShowMapModal(false)} />
      )}

      {/* TOP COMMAND BAR (Windows Electric Blue) */}
      <header className="sticky top-0 z-40 bg-[#080B10]/95 backdrop-blur-md border-b border-sky-500/20 px-4 sm:px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Sector Identity & Back Button */}
          <div className="flex items-center gap-3">
            {onBackToMagazine && (
              <button
                onClick={onBackToMagazine}
                className="px-3 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] border border-sky-500/20 text-zinc-300 hover:text-[#60CDFF] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#00A4EF]" />
                <span>ÍNDICE</span>
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] border border-[#00A4EF]/40">
                  SECTOR 01
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  ANTES DEL LOGO // PRE-BOOT
                </span>
              </div>
            </div>
          </div>

          {/* Right: Command Bar Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View switcher */}
            <div className="flex items-center bg-[#11161D] p-1 rounded-xl border border-sky-500/20 text-xs font-mono">
              <button
                onClick={() => setActiveTab('reader')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reader'
                    ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Investigaciones</span>
              </button>
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'mission'
                    ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Misión</span>
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'test'
                    ? 'bg-gradient-to-r from-[#0078D4] to-[#00A4EF] text-white font-bold shadow-[0_0_12px_rgba(0,164,239,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Test</span>
              </button>
            </div>

            {/* Dedicated Modal Triggers */}
            <button
              onClick={() => setShowLabModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_18px_rgba(0,164,239,0.25)]"
              title="Abrir Boot Lab interactivo"
            >
              <Play className="w-3.5 h-3.5" />
              <span>BOOT LAB</span>
            </button>

            <button
              onClick={() => setShowMapModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-[#60CDFF] border border-sky-500/20 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer hidden md:flex"
              title="Abrir Mapa Visual de Fases"
            >
              <Compass className="w-3.5 h-3.5 text-[#00A4EF]" />
              <span>MAPA</span>
            </button>

            <button
              onClick={() => setShowCasesModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#11161D] hover:bg-[#151B23] text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ver 8 Casos Forenses"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>CASOS</span>
            </button>

            <button
              onClick={() => setShowExpedienteModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#0078D4]/15 hover:bg-[#0078D4]/25 text-[#60CDFF] border border-[#00A4EF]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Ver Artefacto Oficial 002"
            >
              <FileText className="w-3.5 h-3.5 text-[#00A4EF]" />
              <span>EXPEDIENTE 002</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'mission' ? (
          <Tomo02Sector01MissionView
            onBackToReader={() => setActiveTab('reader')}
            onOpenExpediente={() => setShowExpedienteModal(true)}
            onSaveDossier={(dossier) => {
              setDossierData(dossier);
              recorder.setMissionPassed(true);
            }}
          />
        ) : activeTab === 'test' ? (
          <Tomo02Sector01TestView
            onPassTest={recorder.setTestScore}
            onBackToReader={() => setActiveTab('reader')}
            onOpenExpediente={() => setShowExpedienteModal(true)}
          />
        ) : (
          /* Reader View: Left Drawer (Windows 11 Style) + Clean Central Canvas */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: 27 Investigations */}
            <aside className="lg:col-span-4 space-y-3 bg-[#080B10] p-3 rounded-2xl border border-sky-500/20 shadow-xl">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-mono text-zinc-400">
                <span className="font-bold text-[#60CDFF] uppercase">INVESTIGACIONES (27)</span>
                <span className="text-white font-bold">{completedCount} / 27</span>
              </div>

              {/* Progress bar inside sidebar */}
              <div className="w-full h-1.5 rounded-full bg-[#151B23] overflow-hidden border border-sky-500/20">
                <div
                  className="h-full bg-gradient-to-r from-[#0078D4] to-[#00A4EF] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Tutor Tip Box */}
              <div className="p-3 rounded-xl bg-[#11161D] border border-sky-500/20 text-xs text-zinc-300 leading-relaxed space-y-1">
                <div className="font-mono text-[10px] text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-[#00A4EF]" />
                  <span>TUTOR EVO // GUÍA DE BANCO</span>
                </div>
                <p className="italic text-[11px] text-zinc-300">{currentTutorTip}</p>
              </div>

              {/* Investigations List */}
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {SECTOR_01_INVESTIGATIONS.map((inv, idx) => {
                  const isSelected = idx === selectedInvIndex;
                  const isDone = completedInvestigations[inv.id];

                  return (
                    <button
                      key={inv.id}
                      onClick={() => setSelectedInvIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0078D4]/15 border border-[#00A4EF]/60 text-white shadow-[0_0_15px_rgba(0,164,239,0.15)]'
                          : 'hover:bg-[#11161D] text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}
                      style={{
                        borderLeft: isSelected ? '3px solid #00A4EF' : undefined,
                      }}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#0078D4] to-[#00A4EF] text-white font-bold'
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                            : 'bg-[#151B23] text-zinc-400'
                        }`}
                      >
                        {isDone ? '✓' : inv.code}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-semibold truncate ${
                            isSelected ? 'text-white' : 'text-zinc-300'
                          }`}
                        >
                          {inv.title}
                        </div>
                        <div
                          className={`text-[10px] font-mono truncate ${
                            isSelected ? 'text-[#60CDFF]' : 'text-zinc-500'
                          }`}
                        >
                          {inv.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Central Reading Canvas */}
            <article className="lg:col-span-8 space-y-6">
              {/* Header */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#080B10] border border-sky-500/20 shadow-xl space-y-2">
                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] font-bold border border-[#00A4EF]/40">
                    INVESTIGACIÓN {currentInv.code}
                  </span>
                  <span className="text-zinc-400">{selectedInvIndex + 1} de {SECTOR_01_INVESTIGATIONS.length}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display">
                  {currentInv.title}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-[#60CDFF]">{currentInv.subtitle}</p>
              </div>

              {/* 1. DESCUBRÍ: Hook + Myth vs Technical Truth */}
              <section className="p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-4">
                <div className="font-mono text-xs text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00A4EF]" />
                  <span>1 // DESCUBRÍ (EL GANCHO PERICIAL)</span>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed italic">
                  {currentInv.descubri.hook}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* MITO COMÚN (Rojo Oscuro) */}
                  <div className="p-4 rounded-xl bg-red-950/25 border border-red-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#FF4D5A] uppercase tracking-wider block">
                      EL MITO COMÚN
                    </span>
                    <p className="text-xs text-zinc-300">{currentInv.descubri.mythVsTruth.mentira}</p>
                  </div>

                  {/* VERDAD TÉCNICA (Azul Windows Electric) */}
                  <div className="p-4 rounded-xl bg-[#0078D4]/15 border border-[#00A4EF]/50 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#00A4EF] uppercase tracking-wider block">
                      LA VERDAD TÉCNICA
                    </span>
                    <p className="text-xs text-white">{currentInv.descubri.mythVsTruth.verdad}</p>
                  </div>
                </div>
              </section>

              {/* 2. ENTENDÉ: Architecture & Flow */}
              <section className="p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-4">
                <div className="font-mono text-xs text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00A4EF]" />
                  <span>2 // ENTENDÉ ({currentInv.entende.title})</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentInv.entende.explanation.map((par, i) => (
                    <p key={i}>{par}</p>
                  ))}
                </div>

                {currentInv.entende.diagramItems && (
                  <div className="p-4 rounded-xl bg-[#11161D] border border-sky-500/20 space-y-2">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      {currentInv.entende.diagramLabel || 'FLUJO DE ARQUITECTURA'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentInv.entende.diagramItems.map((item, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#080B10] border border-sky-500/15 text-xs">
                          <div className="font-bold text-[#60CDFF] font-mono text-[11px]">{item.label}</div>
                          <div className="text-zinc-400 text-[11px] mt-0.5">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 3. PROFUNDIZÁ: Low-Level Engine */}
              <section className="p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-3">
                <div className="font-mono text-xs text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#00A4EF]" />
                  <span>3 // PROFUNDIZÁ ({currentInv.profundiza.title})</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentInv.profundiza.technicalDetails.map((det, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#00A4EF] font-bold">›</span>
                      <span>{det}</span>
                    </div>
                  ))}
                </div>

                {currentInv.profundiza.lowLevelNote && (
                  <div className="p-3 rounded-xl bg-[#0078D4]/10 border border-[#00A4EF]/30 text-xs text-[#60CDFF] italic mt-2">
                    <strong>Nota de Bajo Nivel:</strong> {currentInv.profundiza.lowLevelNote}
                  </div>
                )}
              </section>

              {/* 4. MIRALO EN TU PC: Step-by-Step Terminal */}
              <section className="p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-4">
                <div className="font-mono text-xs text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00A4EF]" />
                  <span>4 // MIRALO EN TU PC ({currentInv.miraloEnTuPc.actionName})</span>
                </div>

                <div className="space-y-2 text-xs text-zinc-300">
                  {currentInv.miraloEnTuPc.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#151B23] border border-sky-500/20 font-mono text-[10px] flex items-center justify-center text-[#60CDFF] shrink-0">
                        {i + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>

                {currentInv.miraloEnTuPc.commandOrPath && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#11161D] border border-sky-500/20 font-mono text-xs shadow-inner">
                    <span className="text-[#60CDFF] truncate mr-2 font-bold">
                      {currentInv.miraloEnTuPc.commandOrPath}
                    </span>
                    <button
                      onClick={() => handleCopyText(currentInv.miraloEnTuPc.commandOrPath || '')}
                      className="px-2.5 py-1 rounded bg-[#151B23] hover:bg-[#1A2029] text-zinc-200 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer border border-sky-500/20"
                    >
                      {copiedCode === currentInv.miraloEnTuPc.commandOrPath ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#00A4EF]" />
                      )}
                      <span>{copiedCode === currentInv.miraloEnTuPc.commandOrPath ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                )}

                <div className="text-[11px] text-zinc-400 bg-[#11161D] p-3 rounded-xl border border-sky-500/15">
                  <strong className="text-zinc-200">Resultado esperado:</strong> {currentInv.miraloEnTuPc.expectedVisual}
                </div>
              </section>

              {/* 5. COMPROBALO: Real Action */}
              <section className="p-6 rounded-2xl bg-[#080B10]/90 border border-sky-500/20 space-y-3">
                <div className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>5 // COMPROBALO (EL LEMA EVO)</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 font-semibold">{currentInv.comprobalo.instruction}</p>
                <div className="p-3.5 rounded-xl bg-[#11161D] border border-emerald-500/30 text-xs text-emerald-300 font-mono">
                  {currentInv.comprobalo.actionPrompt}
                </div>
              </section>

              {/* 6. MICRODESAFÍO: Interactive Challenge */}
              <section className="p-6 rounded-2xl bg-gradient-to-r from-[#080B10] via-[#0078D4]/10 to-[#080B10] border border-[#00A4EF]/40 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-xs text-[#60CDFF] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#00A4EF]" />
                    <span>6 // MICRODESAFÍO INTERACTIVO</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11161D] border border-sky-500/20 text-[#60CDFF]">
                    TIPO: {currentInv.microdesafio.type}
                  </span>
                </div>

                <div className="text-sm font-bold text-white">{currentInv.microdesafio.question}</div>
                <div className="text-xs text-zinc-400">{currentInv.microdesafio.instruction}</div>

                {currentInv.microdesafio.options && (
                  <div className="space-y-2.5 pt-2">
                    {currentInv.microdesafio.options.map((opt) => {
                      const userSelected = challengeAnswers[currentInv.id] === opt.id;
                      const isRevealed = challengeAnswers[currentInv.id] !== undefined;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setChallengeAnswers((prev) => ({ ...prev, [currentInv.id]: opt.id }));
                            if (opt.isCorrect) {
                              handleCompleteInvestigation(currentInv.id);
                            }
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 cursor-pointer ${
                            isRevealed
                              ? opt.isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                                : userSelected
                                ? 'bg-red-950/40 border-red-500/60 text-red-200'
                                : 'bg-[#11161D]/50 border-zinc-800 text-zinc-500 opacity-60'
                              : userSelected
                              ? 'bg-[#0078D4]/25 border-[#00A4EF] text-white'
                              : 'bg-[#11161D] border-sky-500/20 text-zinc-300 hover:bg-[#151B23] hover:border-sky-500/40'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 ${
                              isRevealed
                                ? opt.isCorrect
                                  ? 'bg-emerald-500 text-black font-bold'
                                  : userSelected
                                  ? 'bg-red-500 text-white font-bold'
                                  : 'bg-[#151B23] text-zinc-400'
                                : 'bg-[#151B23] text-[#60CDFF]'
                            }`}
                          >
                            {isRevealed && opt.isCorrect ? '✓' : isRevealed && userSelected ? '✗' : opt.id.toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div>{opt.text}</div>
                            {isRevealed && userSelected && (
                              <div
                                className={`text-[11px] font-mono mt-1 ${
                                  opt.isCorrect ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {opt.feedback}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 7. EVIDENCIA & NAVIGATION FOOTER */}
              <section className="p-6 rounded-2xl bg-[#080B10] border border-sky-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    EVIDENCIA PARA EXPEDIENTE 002
                  </div>
                  <div className="text-xs font-bold text-[#60CDFF] flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-[#16C784]" />
                    <span>{currentInv.evidencia.fieldName} [{currentInv.evidencia.defaultProvenance}]</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvIndex((prev) => Math.max(0, prev - 1))}
                    disabled={selectedInvIndex === 0}
                    className="px-4 py-2 rounded-xl bg-[#11161D] hover:bg-[#151B23] disabled:opacity-30 text-zinc-300 text-xs font-mono font-semibold transition-colors cursor-pointer border border-sky-500/20"
                  >
                    Anterior
                  </button>

                  <button
                    onClick={() => {
                      handleCompleteInvestigation(currentInv.id);
                      if (selectedInvIndex < SECTOR_01_INVESTIGATIONS.length - 1) {
                        setSelectedInvIndex((prev) => prev + 1);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(0,164,239,0.30)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {selectedInvIndex < SECTOR_01_INVESTIGATIONS.length - 1
                        ? 'Siguiente Investigación'
                        : 'Finalizar Sector 01'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </section>
            </article>
          </div>
        )}
      </main>
    </div>
  );
};
