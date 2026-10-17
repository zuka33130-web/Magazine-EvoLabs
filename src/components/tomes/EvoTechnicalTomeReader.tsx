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
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  Sliders,
  Maximize2
} from 'lucide-react';
import { EvoTomeExamEngine } from '../exam/EvoTomeExamEngine';

export interface GenericTomeChapter {
  id: string;
  moduleNumber?: string;
  chapterNumber?: string;
  title: string;
  subtitle?: string;
  readTime?: string;
  topicsCovered?: string[];
  capa1Explicacion: string;
  capa2DetalleTecnico: string;
  capa3PracticaMedicion: string;
  microformatos?: {
    mito?: string;
    errorComun?: string;
    comprobalo?: string;
    paraTecnicos?: string;
    conclusionEvo?: string;
  };
  decisionRule?: string;
  benchTarget?: {
    labView: string;
    scenario: string;
    badgeLabel: string;
  };
}

export interface GenericCaseStudy {
  id: string;
  title: string;
  symptom: string;
  diagnosticLayer: string;
  telemetryMeasured: string;
  discardedHypothesis: string;
  rootCause: string;
  fixAction: string;
  verificationCmd?: string;
}

export interface GenericGlossaryItem {
  term: string;
  rfcOrStandard?: string;
  definition: string;
  practicalTip?: string;
}

export interface GenericSourceItem {
  name?: string;
  title?: string;
  url?: string;
  description?: string;
}

export interface GenericTomeMeta {
  number: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  themeColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  badge?: string;
  edition?: string;
  totalPages?: number;
  totalChapters?: number;
  systemStandard?: string;
  manifestoPhrase?: string;
  description?: string;
}

export interface EvoTechnicalTomeReaderProps {
  tomeId: string;
  meta: GenericTomeMeta;
  chapters: GenericTomeChapter[];
  cases?: GenericCaseStudy[];
  glossary?: GenericGlossaryItem[];
  sources?: GenericSourceItem[] | string[];
  themeColor?: string;
  accentColor?: string;
  onBack?: () => void;
  onOpenLab?: (labTarget?: any) => void;
  customLabAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EvoTechnicalTomeReader: React.FC<EvoTechnicalTomeReaderProps> = ({
  tomeId,
  meta,
  chapters,
  cases = [],
  glossary = [],
  sources = [],
  themeColor,
  accentColor,
  onBack,
  onOpenLab,
  customLabAction,
}) => {
  const primaryColor = themeColor || meta.themeColor || meta.accentColor || '#38BDF8';
  const [activeTab, setActiveTab] = useState<'portada' | 'capitulos' | 'casos' | 'glosario' | 'fuentes' | 'examen'>('portada');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [activeChapterLayer, setActiveChapterLayer] = useState<'capa1' | 'capa2' | 'capa3'>('capa1');
  const [glossaryFilter, setGlossaryFilter] = useState('');

  const currentChapter = chapters[selectedChapterIndex] || chapters[0];

  if (activeTab === 'examen') {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 p-4">
        <EvoTomeExamEngine
          tomoId={tomeId}
          onBackToTomoCover={() => setActiveTab('portada')}
          onBackToIndex={() => setActiveTab('capitulos')}
          onContinueToLab={() => {
            if (customLabAction) {
              customLabAction.onClick();
            } else if (onOpenLab) {
              onOpenLab();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-200 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#080b12]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1 cursor-pointer border border-zinc-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>VOLVER</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
            />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              TOMO {meta.number} // {meta.title}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'portada', label: 'PORTADA' },
            { id: 'capitulos', label: `CAPÍTULOS (${chapters.length})` },
            { id: 'casos', label: `CASOS (${cases.length})` },
            { id: 'glosario', label: `GLOSARIO (${glossary.length})` },
            { id: 'fuentes', label: 'FUENTES' },
            { id: 'examen', label: 'EXAMEN FINAL' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
              style={{
                borderColor: activeTab === tab.id ? `${primaryColor}60` : undefined,
                color: activeTab === tab.id ? '#ffffff' : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}

          {customLabAction && (
            <button
              onClick={customLabAction.onClick}
              className="ml-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-[0_0_12px_rgba(251,191,36,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{customLabAction.label}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ======================================================== */}
        {/* VIEW 1: PORTADA                                          */}
        {/* ======================================================== */}
        {activeTab === 'portada' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Cover Card */}
            <div className="relative rounded-2xl p-6 sm:p-10 border border-zinc-800/80 bg-gradient-to-br from-[#0c101a] via-[#080b12] to-[#05070a] overflow-hidden shadow-2xl">
              <div
                className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: primaryColor }}
              />

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase border"
                    style={{
                      borderColor: `${primaryColor}60`,
                      background: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    TOMO {meta.number} // {meta.badge || 'INGENIERÍA APLICADA'}
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    {meta.edition || 'Edición Oficial 2026'}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white uppercase leading-none">
                  {meta.title}
                </h1>

                <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
                  {meta.subtitle || meta.description}
                </p>

                {meta.manifestoPhrase && (
                  <div className="p-4 rounded-xl bg-black/40 border-l-4 border-l-cyan-400 border border-zinc-800 text-xs font-mono text-cyan-200">
                    "{meta.manifestoPhrase}"
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('capitulos')}
                    className="px-5 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:brightness-110 shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    style={{
                      background: primaryColor,
                    }}
                  >
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>LEER CAPÍTULOS ({chapters.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('examen')}
                    className="px-4 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider uppercase text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>EXAMEN DE CERTIFICACIÓN</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Index Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  ESTRUCTURA DE CAPÍTULOS & INVESTIGACIONES
                </h2>
                <span className="text-xs font-mono text-zinc-500">
                  {chapters.length} MÓDULOS DE ESTUDIO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chap, idx) => (
                  <div
                    key={chap.id || idx}
                    onClick={() => {
                      setSelectedChapterIndex(idx);
                      setActiveTab('capitulos');
                    }}
                    className="p-4 rounded-xl bg-[#0a0d14] border border-zinc-800/80 hover:border-zinc-700 hover:bg-[#0f1420] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                        <span style={{ color: primaryColor }}>CAP 0{idx + 1}</span>
                        <span>{chap.readTime || '15 min'}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {chap.title}
                      </h3>
                      {chap.subtitle && (
                        <p className="text-xs text-zinc-400 line-clamp-2">{chap.subtitle}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>{chap.topicsCovered?.length || 3} temas clave</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: CAPÍTULOS CON 3 CAPAS TÉCNICAS                    */}
        {/* ======================================================== */}
        {activeTab === 'capitulos' && currentChapter && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            {/* Left Column: Sidebar Chapters List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
                ÍNDICE DE CAPÍTULOS
              </div>
              <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
                {chapters.map((chap, idx) => {
                  const isSelected = idx === selectedChapterIndex;
                  return (
                    <button
                      key={chap.id || idx}
                      onClick={() => setSelectedChapterIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 border ${
                        isSelected
                          ? 'bg-[#101624] border-cyan-500/50 shadow-md text-white'
                          : 'bg-[#090c12] border-zinc-800/70 hover:bg-[#0d121c] text-zinc-400'
                      }`}
                    >
                      <span
                        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
                        style={{
                          background: isSelected ? `${primaryColor}20` : '#18181b',
                          color: isSelected ? primaryColor : '#71717a',
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-zinc-200">
                          {chap.title}
                        </div>
                        {chap.subtitle && (
                          <div className="text-[11px] text-zinc-500 truncate">{chap.subtitle}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Chapter Detail with 3 Layers */}
            <div className="lg:col-span-8 space-y-6">
              {/* Chapter Header */}
              <div className="p-6 rounded-2xl bg-[#090c14] border border-zinc-800/90 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span style={{ color: primaryColor }}>
                    CAPÍTULO 0{selectedChapterIndex + 1} // {currentChapter.moduleNumber || 'MÓDULO'}
                  </span>
                  <span>{currentChapter.readTime || '15 min de lectura'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-display text-white uppercase">
                  {currentChapter.title}
                </h2>

                {currentChapter.subtitle && (
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    {currentChapter.subtitle}
                  </p>
                )}

                {/* Topics Tags */}
                {currentChapter.topicsCovered && currentChapter.topicsCovered.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {currentChapter.topicsCovered.map((topic, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* 3 Technical Layers Switcher */}
                <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-3 gap-2">
                  {[
                    { id: 'capa1', label: '1. ENTENDER (Fundamentos)' },
                    { id: 'capa2', label: '2. PROFUNDIZAR (Rigor Técnico)' },
                    { id: 'capa3', label: '3. PRACTICAR (Medición)' },
                  ].map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveChapterLayer(layer.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer text-center ${
                        activeChapterLayer === layer.id
                          ? 'bg-zinc-800 text-white border border-zinc-600 shadow-sm'
                          : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200'
                      }`}
                      style={{
                        borderColor: activeChapterLayer === layer.id ? primaryColor : undefined,
                        color: activeChapterLayer === layer.id ? primaryColor : undefined,
                      }}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer Content */}
              <div className="p-6 rounded-2xl bg-[#080b12] border border-zinc-800/80 space-y-4">
                {activeChapterLayer === 'capa1' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                      <Lightbulb className="w-4 h-4" />
                      <span>CAPA 1: EXPLICACIÓN CONCEPTUAL & MODELO MENTAL</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line">
                      {currentChapter.capa1Explicacion}
                    </div>
                  </div>
                )}

                {activeChapterLayer === 'capa2' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                      <Layers className="w-4 h-4" />
                      <span>CAPA 2: DETALLE TÉCNICO, ARQUITECTURA & ESTÁNDARES</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line bg-black/30 p-4 rounded-xl border border-zinc-800/70 font-mono">
                      {currentChapter.capa2DetalleTecnico}
                    </div>
                  </div>
                )}

                {activeChapterLayer === 'capa3' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                      <Sliders className="w-4 h-4" />
                      <span>CAPA 3: PRÁCTICA DE MEDICIÓN, INSTRUMENTOS & COMPROBACIÓN</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed whitespace-pre-line">
                      {currentChapter.capa3PracticaMedicion}
                    </div>
                  </div>
                )}

                {/* Microformatos Periciales */}
                {currentChapter.microformatos && (
                  <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentChapter.microformatos.mito && (
                      <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs">
                        <div className="font-mono font-bold text-red-400 text-[10px] uppercase mb-1">
                          MITO DESMENTIDO
                        </div>
                        <p className="text-zinc-300">{currentChapter.microformatos.mito}</p>
                      </div>
                    )}
                    {currentChapter.microformatos.errorComun && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs">
                        <div className="font-mono font-bold text-amber-400 text-[10px] uppercase mb-1">
                          ERROR COMÚN
                        </div>
                        <p className="text-zinc-300">{currentChapter.microformatos.errorComun}</p>
                      </div>
                    )}
                    {currentChapter.microformatos.comprobalo && (
                      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
                        <div className="font-mono font-bold text-cyan-400 text-[10px] uppercase mb-1">
                          COMPROBALO EN TU PC
                        </div>
                        <p className="text-zinc-300">{currentChapter.microformatos.comprobalo}</p>
                      </div>
                    )}
                    {currentChapter.microformatos.conclusionEvo && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                        <div className="font-mono font-bold text-emerald-400 text-[10px] uppercase mb-1">
                          CONCLUSIÓN EVO
                        </div>
                        <p className="text-zinc-300">{currentChapter.microformatos.conclusionEvo}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Decision Rule */}
                {currentChapter.decisionRule && (
                  <div className="p-4 rounded-xl bg-black/60 border border-zinc-700/80 text-xs font-mono text-zinc-300 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block mb-0.5">REGLA DE DECISIÓN TÉCNICA:</span>
                      {currentChapter.decisionRule}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: CASOS DE ESTUDIO PERICIALES                      */}
        {/* ======================================================== */}
        {activeTab === 'casos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-display uppercase">
                  CASOS PERICIALES & INVESTIGACIONES FORENSES
                </h2>
                <p className="text-xs text-zinc-400">
                  Diagnósticos con telemetría medida, descarte sistemático de hipótesis y verificación de raíz.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300">
                {cases.length} CASOS DOCUMENTADOS
              </span>
            </div>

            <div className="space-y-4">
              {cases.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="p-5 rounded-2xl bg-[#090c14] border border-zinc-800/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                        EXPEDIENTE 0{idx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-white">{c.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {c.diagnosticLayer}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/70 space-y-1">
                      <span className="font-mono text-[10px] text-red-400 uppercase font-bold block">
                        SÍNTOMA REPORTADO:
                      </span>
                      <p className="text-zinc-300">{c.symptom}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/70 space-y-1">
                      <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold block">
                        TELEMETRÍA MEDIDA:
                      </span>
                      <p className="text-zinc-300 font-mono text-[11px]">{c.telemetryMeasured}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/70 space-y-1">
                      <span className="font-mono text-[10px] text-amber-400 uppercase font-bold block">
                        HIPÓTESIS DESCARTADAS:
                      </span>
                      <p className="text-zinc-300">{c.discardedHypothesis}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-zinc-800/70 space-y-1">
                      <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block">
                        CAUSA RAÍZ DEMOSTRADA:
                      </span>
                      <p className="text-zinc-300">{c.rootCause}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-300 uppercase font-bold block mb-0.5">
                        ACCIÓN CORRECTIVA:
                      </span>
                      <p className="text-zinc-200">{c.fixAction}</p>
                    </div>
                    {c.verificationCmd && (
                      <div className="shrink-0 font-mono text-[10px] text-zinc-400 bg-black/60 px-3 py-1.5 rounded border border-zinc-800">
                        {c.verificationCmd}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: GLOSARIO TÉCNICO PERICIAL                         */}
        {/* ======================================================== */}
        {activeTab === 'glosario' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white font-display uppercase">
                  GLOSARIO DE TÉRMINOS & ESTÁNDARES
                </h2>
                <p className="text-xs text-zinc-400">
                  Conceptos fundamentales con su referencia a normas y recomendaciones prácticas.
                </p>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossaryFilter}
                  onChange={(e) => setGlossaryFilter(e.target.value)}
                  placeholder="Buscar término o RFC..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {glossary
                .filter(
                  (item) =>
                    item.term.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
                    item.definition.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
                    (item.rfcOrStandard && item.rfcOrStandard.toLowerCase().includes(glossaryFilter.toLowerCase()))
                )
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#090c14] border border-zinc-800/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-bold font-mono text-sm text-white" style={{ color: primaryColor }}>
                          {item.term}
                        </h3>
                        {item.rfcOrStandard && (
                          <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-900">
                            {item.rfcOrStandard}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{item.definition}</p>
                    </div>

                    {item.practicalTip && (
                      <div className="mt-2 pt-2 border-t border-zinc-900 text-[11px] font-mono text-zinc-400 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item.practicalTip}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: FUENTES TÉCNICAS & REFERENCIAS                    */}
        {/* ======================================================== */}
        {activeTab === 'fuentes' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white font-display uppercase">
                FUENTES OFICIALES & ESTÁNDARES DE INGENIERÍA
              </h2>
              <p className="text-xs text-zinc-400">
                Documentación primaria, especificaciones RFC, JEDEC, PCI-SIG, IEEE y Whitepapers de respaldo.
              </p>
            </div>

            <div className="space-y-3">
              {sources.map((src: any, idx) => {
                const title = typeof src === 'string' ? src : src.title || src.name || `Fuente ${idx + 1}`;
                const desc = typeof src === 'object' ? src.description : undefined;
                const url = typeof src === 'object' ? src.url : undefined;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#090c14] border border-zinc-800/80 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-white font-mono flex items-center gap-2">
                        <span className="text-cyan-400">[{idx + 1}]</span>
                        <span>{title}</span>
                      </div>
                      {desc && <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>}
                    </div>

                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
