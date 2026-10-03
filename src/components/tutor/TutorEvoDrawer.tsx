import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Compass,
  BookOpen,
  Map,
  Layers,
  Search,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Info,
  Terminal,
  Cpu,
  RotateCcw,
} from 'lucide-react';
import { useTutorEvo } from './TutorEvoContext';
import { TUTOR_GLOSSARY_TERMS } from './data/tutorGlossary';
import { TUTOR_ACADEMY_SECTORS } from './data/tutorAcademyData';
import { TutorLevel } from './types';

export const TutorEvoDrawer: React.FC = () => {
  const {
    isTutorOpen,
    setIsTutorOpen,
    activeTutorTab,
    setActiveTutorTab,
    selectedGlossaryKey,
    setSelectedGlossaryKey,
    currentLocation,
    mode,
    setMode,
  } = useTutorEvo();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [activeLevel, setActiveLevel] = useState<TutorLevel>('simple');
  const [activeTourStep, setActiveTourStep] = useState<number>(0);

  // Filter glossary terms
  const allTerms = useMemo(() => Object.values(TUTOR_GLOSSARY_TERMS), []);

  const filteredTerms = useMemo(() => {
    return allTerms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.shortDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.key.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'TODOS' || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allTerms, searchQuery, selectedCategory]);

  const activeTerm = useMemo(() => {
    if (selectedGlossaryKey && TUTOR_GLOSSARY_TERMS[selectedGlossaryKey]) {
      return TUTOR_GLOSSARY_TERMS[selectedGlossaryKey];
    }
    return filteredTerms[0] || allTerms[0];
  }, [selectedGlossaryKey, filteredTerms, allTerms]);

  const categories = useMemo(() => {
    const set = new Set(allTerms.map((t) => t.category));
    return ['TODOS', ...Array.from(set)];
  }, [allTerms]);

  if (!isTutorOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tutor EVO"
      className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 print:hidden no-print"
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setIsTutorOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#090d16] border-l border-zinc-800 h-full flex flex-col shadow-2xl text-zinc-100 font-sans-editorial overflow-hidden z-10 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-[#0c111d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-sm shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-base tracking-tight">TUTOR EVO</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">
                  ACADEMIA AVANZADA
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans-editorial">
                Guía de orientación, glosario interactivo y método pericial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode switch */}
            <div className="hidden sm:flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setMode('guiado')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  mode === 'guiado'
                    ? 'bg-amber-400 text-black font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                GUIADO
              </button>
              <button
                type="button"
                onClick={() => setMode('libre')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  mode === 'libre'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                LIBRE
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsTutorOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Cerrar Tutor EVO"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-4 pt-2 gap-2 text-xs font-mono shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTutorTab('explain')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTutorTab === 'explain'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>ESTÁS ACÁ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTutorTab('glossary')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTutorTab === 'glossary'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>GLOSARIO (? QUÉ ES ESTO)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTutorTab('tour')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTutorTab === 'tour'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SECTORES DE LA ACADEMIA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTutorTab('map')}
            className={`pb-2.5 px-3 border-b-2 font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTutorTab === 'map'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>MÉTODO EVO</span>
          </button>
        </div>

        {/* Tab 1: ESTÁS ACÁ (Orientación Contextual) */}
        {activeTutorTab === 'explain' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Location Breadcrumb Card */}
            <div className="p-4 rounded-2xl bg-[#111624] border border-amber-500/30 space-y-2">
              <div className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>UBICACIÓN ACTUAL</span>
              </div>
              <div className="text-lg font-bold text-white">
                {currentLocation.academySection}
                {currentLocation.tomoNumber && (
                  <span className="text-zinc-400 font-normal">
                    {' '}
                    — Tomo {currentLocation.tomoNumber}: {currentLocation.tomoTitle}
                  </span>
                )}
              </div>
              {currentLocation.chapterTitle && (
                <div className="text-xs text-cyan-300 font-medium bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/50 inline-block">
                  Capítulo: {currentLocation.chapterTitle}
                </div>
              )}
            </div>

            {/* 4 Steps of Permanent Guidance */}
            <div className="space-y-3">
              {/* QUÉ ES */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>1. QUÉ ES</span>
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {currentLocation.whatIs}
                </p>
              </div>

              {/* PARA QUÉ SIRVE */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold tracking-wider uppercase flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span>2. PARA QUÉ SIRVE</span>
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {currentLocation.whatFor}
                </p>
              </div>

              {/* AHORA: Acción Concreta */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                <span className="text-[10px] font-mono text-amber-300 font-bold tracking-wider uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>3. QUÉ HAY QUE HACER AHORA</span>
                </span>
                <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                  {currentLocation.currentAction}
                </p>
              </div>

              {/* QUÉ HAY QUE OBSERVAR */}
              {currentLocation.whatToLookFor && (
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>4. QUÉ HAY QUE OBSERVAR</span>
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    {currentLocation.whatToLookFor}
                  </p>
                </div>
              )}

              {/* POR QUÉ */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-wider uppercase">
                  5. POR QUÉ IMPORTA
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentLocation.whyItMatters}
                </p>
              </div>

              {/* DESPUÉS: Próximo Paso */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  <span>6. PRÓXIMO PASO</span>
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentLocation.nextStep}
                </p>
              </div>
            </div>

            {/* Quick Helper for Unknown Concepts */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">¿Encontraste una palabra que no conocés?</div>
                <div className="text-[11px] text-zinc-400">Abrí el glosario pericial con explicaciones en 4 niveles.</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTutorTab('glossary')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold border border-cyan-500/40 cursor-pointer"
              >
                Abrir Glosario
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: GLOSARIO PERICIAL CON 4 NIVELES DE EXPLICACIÓN */}
        {activeTutorTab === 'glossary' && (
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Left Column: Search & Term List */}
            <div className="w-full sm:w-60 border-b sm:border-b-0 sm:border-r border-zinc-800 flex flex-col bg-zinc-950/60 shrink-0">
              {/* Search Box */}
              <div className="p-3 border-b border-zinc-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar concepto..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="px-3 py-2 border-b border-zinc-800 flex gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-mono">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded cursor-pointer shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-zinc-400 hover:text-white bg-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Term List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredTerms.map((term) => (
                  <button
                    key={term.key}
                    type="button"
                    onClick={() => setSelectedGlossaryKey(term.key)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex flex-col cursor-pointer ${
                      activeTerm?.key === term.key
                        ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200'
                        : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="font-bold">{term.term}</span>
                    <span className="text-[10px] text-zinc-500 truncate">{term.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Term Explainer in 4 Levels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeTerm ? (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 font-bold">
                        {activeTerm.category}
                      </span>
                      {activeTerm.relatedTomoNumber && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          Tomo {activeTerm.relatedTomoNumber}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-white">{activeTerm.term}</h3>
                    <p className="text-xs text-zinc-300 font-medium">{activeTerm.shortDef}</p>
                  </div>

                  {/* 4 Levels Switcher */}
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveLevel('simple')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                        activeLevel === 'simple'
                          ? 'bg-amber-400 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      1. SIMPLE
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLevel('entender')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                        activeLevel === 'entender'
                          ? 'bg-cyan-500 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      2. ENTENDER
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLevel('pro')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                        activeLevel === 'pro'
                          ? 'bg-purple-500 text-white shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      3. PRO
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLevel('taller')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center ${
                        activeLevel === 'taller'
                          ? 'bg-emerald-500 text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      4. TALLER
                    </button>
                  </div>

                  {/* Active Level Content */}
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                      {activeLevel === 'simple' && 'Nivel 1 — Explicación sin tecnicismos:'}
                      {activeLevel === 'entender' && 'Nivel 2 — Cómo funciona y por qué es indispensable:'}
                      {activeLevel === 'pro' && 'Nivel 3 — Detalle pericial de silicio y arquitectura:'}
                      {activeLevel === 'taller' && 'Nivel 4 — Aplicación en banco y método de medición:'}
                    </div>
                    <p className="text-sm text-zinc-100 leading-relaxed">
                      {activeLevel === 'simple' && activeTerm.simple}
                      {activeLevel === 'entender' && activeTerm.entender}
                      {activeLevel === 'pro' && activeTerm.pro}
                      {activeLevel === 'taller' && activeTerm.taller}
                    </p>
                  </div>

                  {/* Real Example Box */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      Ejemplo Real:
                    </span>
                    <p className="text-xs text-zinc-300">{activeTerm.example}</p>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No se encontraron conceptos para la búsqueda actual.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: SECTORES DE LA ACADEMIA */}
        {activeTutorTab === 'tour' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">
                Los 9 Sectores de la Academia EVO LABS
              </h3>
              <p className="text-xs text-zinc-400">
                Cada área cumple un rol pedagógico específico. No des nada por entendido.
              </p>
            </div>

            <div className="grid gap-3">
              {TUTOR_ACADEMY_SECTORS.map((sector, idx) => (
                <div
                  key={sector.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-amber-400 text-black font-black text-[10px] flex items-center justify-center font-mono">
                        {sector.number}
                      </span>
                      <span className="font-extrabold text-white text-sm">{sector.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{sector.subtitle}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-zinc-300 pt-1">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                      <strong className="text-amber-400 font-mono text-[10px] block">¿QUÉ ES?</strong>
                      <p>{sector.whatIs}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                      <strong className="text-cyan-400 font-mono text-[10px] block">¿PARA QUÉ SIRVE?</strong>
                      <p>{sector.whatFor}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                      <strong className="text-purple-400 font-mono text-[10px] block">¿CUÁNDO USARLO?</strong>
                      <p>{sector.whenToUse}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                      <strong className="text-emerald-400 font-mono text-[10px] block">¿QUÉ HACÉS AHÍ?</strong>
                      <p>{sector.whatToDo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: MÉTODO EVO */}
        {activeTutorTab === 'map' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">El Método EVO LABS Único</h3>
              <p className="text-xs text-zinc-400">
                La cadena pedagógica obligatoria para convertir la teoría en habilidad pericial real.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  step: '01',
                  name: 'ENTENDER',
                  desc: 'Leer la teoría en el Magazine sin apuros. Saber qué ocurre a nivel físico y lógico antes de tocar nada.',
                  color: 'text-amber-400',
                  bg: 'border-amber-500/30 bg-amber-950/20',
                },
                {
                  step: '02',
                  name: 'OBSERVAR',
                  desc: 'Analizar esquemas, diagramas, esquemáticos y telemetría real (frecuencia, voltajes, frametimes).',
                  color: 'text-cyan-400',
                  bg: 'border-cyan-500/30 bg-cyan-950/20',
                },
                {
                  step: '03',
                  name: 'PRACTICAR',
                  desc: 'Seguir las prácticas guiadas paso a paso con comandos y mediciones reales en un entorno seguro.',
                  color: 'text-purple-400',
                  bg: 'border-purple-500/30 bg-purple-950/20',
                },
                {
                  step: '04',
                  name: 'DIAGNOSTICAR',
                  desc: 'Enfrentar síntomas reales, plantear hipótesis basadas en evidencia y descartar causas.',
                  color: 'text-rose-400',
                  bg: 'border-rose-500/30 bg-rose-950/20',
                },
                {
                  step: '05',
                  name: 'COMPROBAR',
                  desc: 'Rendir el Examen Final Interactivo de 15 preguntas y obtener el estado "TEORÍA COMPROBADA".',
                  color: 'text-emerald-400',
                  bg: 'border-emerald-500/30 bg-emerald-950/20',
                },
                {
                  step: '06',
                  name: 'AVANZAR',
                  desc: 'Desbloquear el siguiente Tomo o pasar al Laboratorio Asociado para experimentación libre.',
                  color: 'text-yellow-400',
                  bg: 'border-yellow-500/30 bg-yellow-950/20',
                },
              ].map((m) => (
                <div
                  key={m.step}
                  className={`p-3.5 rounded-xl border ${m.bg} flex items-start gap-3`}
                >
                  <span className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {m.step}
                  </span>
                  <div>
                    <h4 className={`text-xs font-bold font-mono tracking-wider ${m.color}`}>
                      {m.name}
                    </h4>
                    <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed mt-0.5">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-[#0c111d] flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">TUTOR EVO // ASISTENTE ACTIVO</span>
          </div>

          <button
            type="button"
            onClick={() => setIsTutorOpen(false)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Continuar Aprendiendo
          </button>
        </div>
      </div>
    </div>
  );
};
