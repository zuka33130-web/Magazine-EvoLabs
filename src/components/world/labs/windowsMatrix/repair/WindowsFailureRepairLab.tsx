import React, { useState, useMemo } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Activity,
  Shield,
  Search,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  Save,
  Clock,
  Eye,
  Zap,
  HelpCircle,
  FileCheck,
  Layers,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';
import {
  FAILURE_SCENARIOS,
  FailureScenarioItem,
  FailureCategory,
  FailureDifficulty,
} from './failureScenariosData';

interface WindowsFailureRepairLabProps {
  onSaveToExpediente?: (entry: any) => void;
  onNavigateToInstallLab?: () => void;
}

export const WindowsFailureRepairLab: React.FC<WindowsFailureRepairLabProps> = ({
  onSaveToExpediente,
  onNavigateToInstallLab,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(FAILURE_SCENARIOS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive diagnostic wizard state
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string | null>(null);
  const [hasRunFirstTest, setHasRunFirstTest] = useState<boolean>(false);
  const [hasRunNextTest, setHasRunNextTest] = useState<boolean>(false);
  const [hasRunVerification, setHasRunVerification] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  
  // UX Toggles: Easy vs Deep
  const [showTutorHelp, setShowTutorHelp] = useState<boolean>(false);
  const [deepDetailsOpen, setDeepDetailsOpen] = useState<boolean>(false);

  // Active scenario
  const scenario = useMemo(() => {
    return FAILURE_SCENARIOS.find((s) => s.id === selectedScenarioId) || FAILURE_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Categories list
  const categories: Array<'TODAS' | FailureCategory> = [
    'TODAS',
    'Arranque & Boot',
    'Sistema & Kernel',
    'Red & Conectividad',
    'Audio & Periféricos',
    'Almacenamiento & Archivos',
    'Rendimiento & Latencias',
  ];

  // Difficulties list
  const difficulties: Array<'TODAS' | FailureDifficulty> = [
    'TODAS',
    'BÁSICO',
    'INTERMEDIO',
    'TÉCNICO',
    'INVESTIGADOR',
  ];

  // Filtered scenarios (Supports filtering by code e.g. ERR-NET-013, keywords, symptoms)
  const filteredScenarios = useMemo(() => {
    return FAILURE_SCENARIOS.filter((s) => {
      const matchCat = selectedCategory === 'TODAS' || s.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'TODAS' || s.difficulty === selectedDifficulty;
      const matchSearch =
        searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.userSymptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.badgeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setActiveStep(1);
    setSelectedHypothesisId(null);
    setHasRunFirstTest(false);
    setHasRunNextTest(false);
    setHasRunVerification(false);
    setSavedSuccess(false);
    setShowTutorHelp(false);
    setDeepDetailsOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleSaveExpediente = () => {
    const entry = {
      id: `exp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'FALLA_Y_REPARACIÓN',
      scenarioId: scenario.id,
      title: scenario.title,
      category: scenario.category,
      difficulty: scenario.difficulty,
      badgeCode: scenario.badgeCode,
      rootCause: scenario.rootCause,
      status: hasRunVerification ? 'VERIFICADO_RESUELTO' : 'EN_PROCESO',
      risk: scenario.riskLevel,
      veracity: 'SIMULATED',
    };

    try {
      const saved = localStorage.getItem('evo_matrix_expedientes');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(entry);
      localStorage.setItem('evo_matrix_expedientes', JSON.stringify(list));
    } catch {
      // ignore
    }

    if (onSaveToExpediente) {
      onSaveToExpediente(entry);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const selectedHypothesis = scenario.hypotheses.find((h) => h.id === selectedHypothesisId);
  const discardedHypotheses = scenario.hypotheses.filter((h) => !h.isCorrect);

  return (
    <div className="w-full space-y-6 font-mono-tech select-none">
      {/* Top Banner / Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#060D1A] via-[#09101F] to-[#040810] border border-cyan-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-cyan-400 text-black uppercase tracking-wider">
              LABORATORIO DIAGNÓSTICO EVO // EVIDENCIA SIMULADA
            </span>
            <span className="text-[10px] text-zinc-400 font-mono-tech">
              24 CASOS DOCUMENTADOS • SIMULATED
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight uppercase">
            FALLAS & REPARACIÓN DETERMINISTA DE WINDOWS
          </h2>
          <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
            Protocolo pericial estricto: SÍNTOMA ➔ EVIDENCIA ➔ HIPÓTESIS ➔ CAUSA RAÍZ ➔ REPARACIÓN ➔ COMPROBACIÓN. Sin revelar soluciones hasta comprobar la evidencia del escenario simulado.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-black/80 border border-cyan-950 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            SIMULATED
          </span>
        </div>
      </div>

      {/* Main Layout: Left Explorer (4 cols) + Right Diagnostic Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: BUSCADOR DESTACADO & EXPEDIENTES (4 COLS)                   */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* BUSCADOR PRINCIPAL (ACCIÓN PRINCIPAL DE EXPLORACIÓN) */}
          <div className="p-3.5 rounded-2xl bg-[#0B0F19] border-2 border-cyan-500/60 shadow-2xl space-y-3">
            <label className="text-[11px] text-cyan-300 font-black uppercase tracking-wider block font-mono-tech flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              BUSCADOR DE SÍNTOMAS & CÓDIGOS DE ERROR:
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-cyan-400 absolute left-3.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar síntoma, código (ERR-NET-013), error..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/90 border-2 border-cyan-500/60 text-xs text-white font-sans-editorial placeholder-zinc-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all shadow-inner"
              />
            </div>

            {/* Category Filter Pills (Botones Secundarios) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9.5px] text-zinc-400 uppercase tracking-wider block font-bold">
                CATEGORÍA DE FALLA:
              </span>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[9.5px] font-mono-tech transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-400 text-black font-extrabold border border-cyan-300 shadow-sm'
                        : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter (Botones Secundarios) */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-900">
              <span className="text-[9.5px] text-zinc-400 uppercase tracking-wider block font-bold">
                NIVEL DE COMPLEJIDAD:
              </span>
              <div className="flex flex-wrap gap-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-mono-tech transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-amber-400 text-black font-extrabold border border-amber-300 shadow-sm'
                        : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scenarios List (24 Scenarios) */}
          <div className="p-2 rounded-xl bg-[#070A10] border border-cyan-950/80 space-y-1.5 max-h-[580px] overflow-y-auto scrollbar-thin">
            <div className="px-2 py-1 text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>EXPEDIENTES DISPONIBLES</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono-tech font-bold text-[9.5px]">
                {filteredScenarios.length} / 24
              </span>
            </div>

            {filteredScenarios.map((sc) => {
              const isSelected = sc.id === scenario.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/70 border-2 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,210,255,0.2)]'
                      : 'bg-zinc-950/80 border border-zinc-900 text-zinc-300 hover:border-cyan-800/80 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[9.5px]">
                    <span className="font-bold text-cyan-400">{sc.badgeCode}</span>
                    <span
                      className={`px-1.5 py-0.3 rounded font-bold text-[8.5px] ${
                        sc.difficulty === 'INVESTIGADOR'
                          ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                          : sc.difficulty === 'TÉCNICO'
                          ? 'bg-purple-950 text-purple-300 border border-purple-600/40'
                          : sc.difficulty === 'INTERMEDIO'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                      }`}
                    >
                      {sc.difficulty}
                    </span>
                  </div>

                  <strong className="text-xs block font-bold leading-tight font-sans-editorial text-white">
                    {sc.title}
                  </strong>

                  <p className="text-[10px] text-zinc-400 font-sans-editorial line-clamp-2 leading-snug">
                    {sc.userSymptom}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: DIAGNOSTIC LAB STAGE & PROGRESSION (8 COLS)                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Incident Header Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#090C14] border border-cyan-500/50 shadow-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-950 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-400 text-xs font-black">
                  {scenario.badgeCode}
                </span>
                <span className="text-xs text-zinc-400 uppercase font-bold">
                  {scenario.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-amber-400 text-xs font-bold">NIVEL: {scenario.difficulty}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9.5px] px-2 py-0.5 rounded font-mono-tech bg-zinc-900 border border-zinc-700 text-cyan-300">
                  SIMULATED
                </span>
                <span
                  className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase ${
                    scenario.riskLevel === 'ROJO'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : scenario.riskLevel === 'AMARILLO'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  RIESGO {scenario.riskLevel}
                </span>

                {/* Terciario: Support / Tutor Button */}
                <button
                  type="button"
                  onClick={() => setShowTutorHelp(!showTutorHelp)}
                  className="px-2.5 py-1 rounded-lg bg-transparent hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-cyan-300 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EXPLICÁMELO SIMPLE / AYUDA</span>
                </button>
              </div>
            </div>

            {/* Support Tutor Callout (Terciario popover) */}
            {showTutorHelp && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/80 text-xs text-zinc-200 font-sans-editorial leading-relaxed space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-mono-tech font-bold text-cyan-300 text-[11px] uppercase">
                  <Info className="w-4 h-4 text-cyan-400" />
                  GUÍA PERICIAL EVO DE ATENCIÓN:
                </div>
                <p>
                  No adivines la solución. Observa el síntoma inicial y ejecuta la prueba forense para obtener evidencia del escenario simulado. Con la evidencia obtenida, evalúa las hipótesis para aislar la causa raíz real.
                </p>
              </div>
            )}

            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                {scenario.title}
              </h3>
            </div>

            {/* 1. SÍNTOMA (LO QUE VE EL USUARIO) - Clean & Simple */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-black border-l-3 border-cyan-400 border border-cyan-950 space-y-1">
              <span className="text-[10.5px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                1. SÍNTOMA OBSERVABLE // LO QUE VE EL USUARIO EN PANTALLA:
              </span>
              <p className="text-xs sm:text-[13px] text-zinc-100 font-sans-editorial leading-relaxed italic">
                “{scenario.userSymptom}”
              </p>
            </div>

            {/* 2. TIMELINE ESPECÍFICA DEL ESCENARIO (SIMULATED) */}
            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-[10.5px] font-bold text-cyan-300 uppercase font-mono-tech flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  CRONOLOGÍA DEL CASO // TIMELINE ESPECÍFICA (SIMULATED)
                </span>
                <span className="text-[9.5px] text-zinc-500 font-mono-tech">[SIMULATED]</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[10px] font-mono-tech">
                {scenario.timeline.map((step, idx) => {
                  let badgeStyle = 'border-zinc-800 text-zinc-400 bg-zinc-950';
                  if (step.type === 'FAILURE') badgeStyle = 'border-rose-500/60 text-rose-300 bg-rose-950/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
                  else if (step.type === 'DEGRADATION') badgeStyle = 'border-amber-900 text-amber-300 bg-zinc-950';
                  else if (step.type === 'ANOMALY') badgeStyle = 'border-amber-950/60 text-amber-400 bg-zinc-950';
                  else if (step.type === 'EVIDENCE') badgeStyle = 'border-purple-900 text-purple-300 bg-zinc-950';

                  return (
                    <div key={idx} className={`p-2 rounded-lg border space-y-1 ${badgeStyle}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold block text-[9px]">{step.time}</span>
                        <span className="text-[8px] opacity-70 uppercase font-bold">{step.label}</span>
                      </div>
                      <p className="font-sans-editorial text-[9.5px] leading-tight opacity-90">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. PREJUICIO HABITUAL (ANTI-PREJUICIO) */}
            <div className="p-3 rounded-xl bg-amber-950/25 border-l-3 border-amber-500 border border-amber-900/40 space-y-1">
              <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                3. PREJUICIO HABITUAL // LO QUE NO DEBEMOS ASUMIR SIN EVIDENCIA:
              </span>
              <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                {scenario.whatNotToAssume}
              </p>
            </div>
          </div>

          {/* Diagnostic Steps Progression Workspace */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080B12] border border-cyan-950 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                FLUJO DIAGNÓSTICO // SÍNTOMA ➔ EVIDENCIA ➔ HIPÓTESIS ➔ CAUSA RAÍZ ➔ REPARACIÓN
              </span>
              <span className="text-[10px] text-zinc-500 font-mono-tech">
                PASO {activeStep} DE 4
              </span>
            </div>

            {/* STEP 1: PRUEBA FORENSE & OBTENCIÓN DE EVIDENCIA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs text-white uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  PRUEBA FORENSE // OBTENCIÓN DE EVIDENCIA SIMULADA
                </strong>
                <span className="text-[10px] text-zinc-400 font-mono-tech">
                  HERRAMIENTA: {scenario.firstTestTool}
                </span>
              </div>

              {/* Terminal Execution Box */}
              <div className="p-3.5 rounded-2xl bg-black border border-cyan-900/80 space-y-2.5 shadow-md">
                <div className="flex flex-wrap items-center justify-between text-xs text-cyan-400 border-b border-zinc-900 pb-2 gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold font-mono-tech">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    CONSOLA DE TELEMETRÍA DEL ESCENARIO
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Botón Secundario: COPIAR */}
                    <button
                      type="button"
                      onClick={() => handleCopy(scenario.firstTestCommand)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500/60 text-zinc-200 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      {copiedCommand === scenario.firstTestCommand ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIADO</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>COPIAR</span>
                        </>
                      )}
                    </button>

                    {/* BOTÓN PRIMARIO: EJECUTAR PRUEBA */}
                    {!hasRunFirstTest ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHasRunFirstTest(true);
                          setActiveStep(2);
                        }}
                        className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.35)] flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4 fill-black text-black" />
                        <span>[ EJECUTAR PRUEBA Y RECABAR EVIDENCIA ]</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        EVIDENCIA OBTENIDA
                      </span>
                    )}
                  </div>
                </div>

                <pre className="text-cyan-300 text-xs font-mono-tech select-all overflow-x-auto py-1.5 px-2 bg-[#04070F] rounded-lg border border-zinc-900">
                  <code>{scenario.firstTestCommand}</code>
                </pre>

                {/* Simulated Output (Revealed after execution) */}
                {hasRunFirstTest && (
                  <div className="mt-2 pt-2 border-t border-zinc-800 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">
                        SALIDA DEVUELTA POR EL SISTEMA SIMULADO:
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-cyan-950 text-cyan-300 rounded font-mono-tech font-bold">
                        SIMULATED
                      </span>
                    </div>
                    <pre className="p-3 rounded-xl bg-[#050811] border border-cyan-950 text-[11px] text-emerald-300 font-mono-tech whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {scenario.testResultOutput}
                    </pre>

                    {/* Evidence Callout */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-700/60 text-xs font-sans-editorial text-zinc-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-cyan-300 font-mono-tech text-[10.5px] uppercase font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          EVIDENCIA DEL ESCENARIO SIMULADO:
                        </strong>
                        <span className="text-[9px] px-2 py-0.5 bg-black text-cyan-400 rounded border border-cyan-800 font-mono-tech font-bold">
                          SIMULATED EVIDENCE
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed">{scenario.newEvidence}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: HIPÓTESIS DISPONIBLES & EVALUACIÓN */}
            {hasRunFirstTest && (
              <div className="space-y-3 pt-3 border-t border-cyan-950 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    EVALUACIÓN DE HIPÓTESIS // CONFIRMAR, DEBILITAR O DESCARTAR
                  </strong>
                  <span className="text-[10px] text-zinc-400 font-mono-tech">CONTRASTACIÓN CON EVIDENCIA</span>
                </div>

                <div className="space-y-2">
                  {scenario.hypotheses.map((h, hIdx) => {
                    const isSelected = selectedHypothesisId === h.id;
                    let stateBadge = { label: 'ABIERTA', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };

                    if (selectedHypothesisId) {
                      if (isSelected) {
                        stateBadge = h.isCorrect
                          ? { label: '✔ CONFIRMADA', color: 'bg-emerald-500 text-black border-emerald-400 font-black' }
                          : { label: '✖ DESCARTADA', color: 'bg-rose-500 text-white border-rose-400 font-black' };
                      } else {
                        stateBadge = h.isCorrect
                          ? { label: 'CONFIRMABLE', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' }
                          : { label: 'DEBILITADA / DESCARTADA', color: 'bg-zinc-900 text-zinc-500 border-zinc-800' };
                      }
                    }

                    return (
                      <div
                        key={h.id}
                        onClick={() => {
                          setSelectedHypothesisId(h.id);
                          if (h.isCorrect) {
                            setActiveStep(3);
                          }
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? h.isCorrect
                              ? 'bg-emerald-950/40 border-2 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                              : 'bg-rose-950/40 border-2 border-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                            : 'bg-zinc-950/80 border border-zinc-900 text-zinc-300 hover:border-cyan-800/80 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-cyan-300 font-mono-tech">
                            HIPÓTESIS {String.fromCharCode(65 + hIdx)}:
                          </span>
                          <span
                            className={`text-[9.5px] px-2.5 py-0.5 rounded-lg font-bold uppercase border ${stateBadge.color}`}
                          >
                            {stateBadge.label}
                          </span>
                        </div>

                        <p className="text-xs font-sans-editorial leading-snug">{h.text}</p>

                        {/* Technical explanation on selection */}
                        {isSelected && (
                          <div
                            className={`p-3 rounded-lg text-[11px] font-sans-editorial mt-1 leading-snug ${
                              h.isCorrect
                                ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-100'
                                : 'bg-rose-950/70 border border-rose-800 text-rose-100'
                            }`}
                          >
                            <strong>{h.isCorrect ? '✔ Razonamiento confirmatorio: ' : '✖ Criterio de descarte: '}</strong>
                            {h.isCorrect ? h.confirmationReason : h.rejectionReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: PRUEBA DE AISLAMIENTO & CAUSA RAÍZ BLOQUEADA HASTA CONFIRMAR */}
            {selectedHypothesis?.isCorrect && (
              <div className="space-y-3 pt-3 border-t border-cyan-950 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    PRUEBA DE AISLAMIENTO // AISLAR CAUSA RAÍZ DEFINITIVA
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#060A14] border border-cyan-900 space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between text-cyan-400 gap-2">
                    <span className="font-bold font-mono-tech text-[11px]">COMANDO DE AISLAMIENTO:</span>
                    {/* BOTÓN PRIMARIO: EJECUTAR AISLAMIENTO */}
                    {!hasRunNextTest ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHasRunNextTest(true);
                          setActiveStep(4);
                        }}
                        className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4 fill-black text-black" />
                        <span>[ EJECUTAR PRUEBA DE AISLAMIENTO ]</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        CAUSA RAÍZ AISLADA
                      </span>
                    )}
                  </div>

                  <code className="p-2 rounded-lg bg-black block text-cyan-300 font-mono-tech text-xs border border-zinc-900 select-all overflow-x-auto">
                    {scenario.nextTestCommand}
                  </code>

                  <p className="text-[11px] text-zinc-300 font-sans-editorial">
                    {scenario.nextTestExplanation}
                  </p>

                  {/* Root Cause Card - Only unlocked after running isolation test */}
                  {hasRunNextTest && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 text-purple-200 mt-3 space-y-2.5 shadow-md">
                      <div className="flex items-center justify-between border-b border-purple-800/60 pb-1.5">
                        <strong className="text-purple-300 uppercase block text-[11px] font-mono-tech font-bold">
                          CAUSA RAÍZ REAL / EVIDENCIADA DEL ESCENARIO:
                        </strong>
                        <span className="text-[9px] px-2.5 py-0.5 bg-black/80 text-purple-300 rounded-md border border-purple-700 font-mono-tech font-bold">
                          SIMULATED
                        </span>
                      </div>

                      <p className="font-sans-editorial text-xs leading-relaxed font-bold text-white">
                        {scenario.rootCause}
                      </p>

                      <div className="pt-2 border-t border-purple-900/60 space-y-2 text-[11px] font-sans-editorial text-purple-200">
                        <div>
                          <strong className="text-purple-300 font-mono-tech text-[10px] uppercase block font-bold mb-0.5">
                            EVIDENCIAS QUE LA SOSTIENEN:
                          </strong>
                          <p className="text-zinc-300">• {scenario.newEvidence}</p>
                        </div>

                        <div>
                          <strong className="text-purple-300 font-mono-tech text-[10px] uppercase block font-bold mb-0.5">
                            HIPÓTESIS DESCARTADAS:
                          </strong>
                          <ul className="list-disc list-inside text-zinc-400 text-[10.5px] space-y-0.5">
                            {discardedHypotheses.map((dh) => (
                              <li key={dh.id}>{dh.text}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: REPARACIÓN DETERMINISTA & COMPROBACIÓN DEFINITIVA */}
            {hasRunNextTest && (
              <div className="space-y-3 pt-3 border-t border-cyan-950 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      4
                    </span>
                    PROCEDIMIENTO DE REPARACIÓN & COMPROBACIÓN
                  </strong>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono-tech">PROTOCOLO ACTIVO</span>
                </div>

                {/* Steps and Commands */}
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-cyan-950 space-y-3.5 text-xs">
                  <div className="space-y-2 font-sans-editorial text-zinc-200">
                    <strong className="text-cyan-400 font-mono-tech uppercase text-[10.5px] block font-bold">
                      PASOS DE RESOLUCIÓN TÉCNICA:
                    </strong>
                    {scenario.solutionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-black/60 border border-zinc-900 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono-tech">
                          <span className="text-cyan-400 font-bold">ACCIÓN 0{sIdx + 1}:</span>
                          <span className="text-[9.5px] text-amber-400 font-bold uppercase">
                            RIESGO: {scenario.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs font-sans-editorial leading-snug text-zinc-200">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* Solution Commands */}
                  {scenario.solutionCommands.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-900">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 font-mono-tech uppercase font-bold block">
                          COMANDOS DE REPARACIÓN:
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-cyan-950 text-cyan-300 rounded font-mono-tech font-bold">
                          SIMULATED / EDUCATIONAL
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {scenario.solutionCommands.map((cmd, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2.5 rounded-xl bg-black border border-cyan-950 flex items-center justify-between gap-2 text-xs font-mono-tech text-cyan-300"
                          >
                            <code className="select-all overflow-x-auto">{cmd}</code>
                            {/* Botón Secundario: COPIAR */}
                            <button
                              type="button"
                              onClick={() => handleCopy(cmd)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-cyan-500/60 text-zinc-200 text-xs font-mono-tech shrink-0 cursor-pointer transition-all"
                            >
                              {copiedCommand === cmd ? '✔ COPIADO' : 'COPIAR'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progressive Technical Details Toggle (Principiante vs Técnico) */}
                  <div className="pt-1 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => setDeepDetailsOpen(!deepDetailsOpen)}
                      className="w-full py-2 px-3 rounded-xl bg-black/80 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-800/80 text-zinc-300 hover:text-cyan-300 text-xs font-mono-tech flex items-center justify-between cursor-pointer transition-all"
                    >
                      <span className="flex items-center gap-2 font-bold text-[11px] uppercase">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        [ PROFUNDIZAR EN DETALLES TÉCNICOS E INTERNOS DE WINDOWS ]
                      </span>
                      {deepDetailsOpen ? (
                        <ChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>

                    {deepDetailsOpen && (
                      <div className="p-3.5 mt-2 rounded-xl bg-[#050810] border border-cyan-900/60 text-xs font-mono-tech text-zinc-300 space-y-2 animate-fadeIn">
                        <div className="text-[10px] text-cyan-400 font-bold uppercase border-b border-zinc-800 pb-1">
                          ESPECIFICACIÓN TÉCNICA DEL PROCESO // REFERENCIA SIMULADA:
                        </div>
                        <ul className="space-y-1 text-[11px] text-zinc-300 font-sans-editorial">
                          <li>• <strong className="font-mono-tech text-cyan-300">SUBSISTEMA AFECTADO:</strong> {scenario.category}</li>
                          <li>• <strong className="font-mono-tech text-cyan-300">NIVEL DE PRIVILEGIO:</strong> Ring 0 / Kernel Mode (WinRE/System)</li>
                          <li>• <strong className="font-mono-tech text-cyan-300">CÓDIGO DE IDENTIFICACIÓN:</strong> {scenario.badgeCode}</li>
                          <li>• <strong className="font-mono-tech text-cyan-300">REVERSIBILIDAD:</strong> {scenario.rollbackProtocol}</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Verification Protocol - Required Execution */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-emerald-400 font-mono-tech uppercase text-[10.5px] font-bold flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        COMPROBACIÓN DEL ESCENARIO SIMULADO:
                      </strong>

                      {/* BOTÓN PRIMARIO: EJECUTAR COMPROBACIÓN */}
                      {!hasRunVerification ? (
                        <button
                          type="button"
                          onClick={() => setHasRunVerification(true)}
                          className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 fill-black text-black" />
                          <span>[ EJECUTAR COMPROBACIÓN DEL ESCENARIO ]</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-[10px] flex items-center gap-1">
                          ✔ VERIFICADO Y RESUELTO [SIMULATED]
                        </span>
                      )}
                    </div>

                    <p className="font-sans-editorial text-xs leading-relaxed text-emerald-100">
                      {scenario.verificationProtocol}
                    </p>

                    {scenario.verificationCommand && (
                      <code className="p-2 rounded-lg bg-black/90 text-emerald-300 font-mono-tech text-[11px] block mt-1 overflow-x-auto border border-emerald-900/60">
                        {scenario.verificationCommand}
                      </code>
                    )}

                    {/* Comparison Card (Before vs After) */}
                    {hasRunVerification && (
                      <div className="mt-3 pt-3 border-t border-emerald-800/60 space-y-2 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans-editorial">
                          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-200 space-y-1">
                            <strong className="font-mono-tech text-[10px] text-rose-400 uppercase block font-bold">
                              ESTADO ANTES DE LA REPARACIÓN:
                            </strong>
                            <p className="text-[10.5px]">SÍNTOMA ACTIVO: {scenario.userSymptom}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-700/80 text-emerald-100 space-y-1">
                            <strong className="font-mono-tech text-[10px] text-emerald-300 uppercase block font-bold">
                              ESTADO DESPUÉS DE LA REPARACIÓN:
                            </strong>
                            <p className="text-[10.5px]">0 ERRORES • SISTEMA OPERATIVO Y SERVICIOS ESTABLES</p>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-center text-xs font-mono-tech font-black text-emerald-300 uppercase tracking-wider shadow-sm">
                          “FUNCIONALIDAD RESTAURADA EN ESTE ESCENARIO SIMULADO”
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rollback & Safety */}
                  <div className="p-3 rounded-xl bg-black/70 border border-zinc-900 text-xs font-mono-tech text-zinc-400 flex items-start gap-2.5">
                    <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300 block text-[10.5px] uppercase font-bold mb-0.5">
                        PROTOCOLO DE REVERSIBILIDAD (ROLLBACK):
                      </strong>
                      <span className="text-[11px] font-sans-editorial text-zinc-400">
                        {scenario.rollbackProtocol}
                      </span>
                    </div>
                  </div>

                  {/* BOTÓN PRIMARIO: GUARDAR EN EXPEDIENTE EVO */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-900">
                    <span className="text-[10px] text-zinc-500 font-mono-tech">
                      ESTÁNDAR PERICIAL // REGISTRO DE REPARACIÓN [SIMULATED]
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveExpediente}
                      disabled={!hasRunVerification}
                      className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                        hasRunVerification
                          ? 'bg-cyan-400 hover:bg-cyan-300 text-black cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.35)]'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      }`}
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-black" />
                          <span>¡GUARDADO EN EXPEDIENTE!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>GUARDAR EN EXPEDIENTE EVO</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
