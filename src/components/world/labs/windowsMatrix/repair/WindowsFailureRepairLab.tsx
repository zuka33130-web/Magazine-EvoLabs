import React, { useState, useMemo } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Save,
  FileText,
  Clock,
  Layers,
  HelpCircle,
  Eye,
  Zap,
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
  const [hasAppliedSolution, setHasAppliedSolution] = useState<boolean>(false);
  const [hasVerifiedSolution, setHasVerifiedSolution] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

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

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return FAILURE_SCENARIOS.filter((s) => {
      const matchCat = selectedCategory === 'TODAS' || s.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'TODAS' || s.difficulty === selectedDifficulty;
      const matchSearch =
        searchQuery === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.userSymptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.badgeCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setActiveStep(1);
    setSelectedHypothesisId(null);
    setHasRunFirstTest(false);
    setHasRunNextTest(false);
    setHasAppliedSolution(false);
    setHasVerifiedSolution(false);
    setSavedSuccess(false);
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
      status: 'VERIFICADO_RESUELTO',
      risk: scenario.riskLevel,
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

  return (
    <div className="w-full space-y-6 font-mono-tech select-none">
      {/* Top Banner / Philosophy */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#060D1A] via-[#09101F] to-[#040810] border border-cyan-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-cyan-400 text-black uppercase tracking-wider">
              LABORATORIO DIAGNÓSTICO EVO
            </span>
            <span className="text-[10px] text-zinc-400 font-mono-tech">
              EXPEDIENTES ACTIVOS: {FAILURE_SCENARIOS.length} CASOS DOCUMENTADOS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight uppercase">
            FALLAS & REPARACIÓN DETERMINISTA DE WINDOWS
          </h2>
          <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed max-w-3xl">
            No es un listado de soluciones mágicas. Es una estación pericial de diagnóstico guiado: aislar el síntoma, descartar prejuicios, levantar telemetría real, formular hipótesis y reparar con reversibilidad absoluta.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-lg bg-black/60 border border-cyan-950 text-cyan-300 text-xs font-bold">
            MÉTODO DETERMINISTA
          </span>
        </div>
      </div>

      {/* Main Layout: Left Scenarios Selector (4 cols) + Right Diagnostic Stage (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: FILTERS & INCIDENT EXPLORER (4 COLS)                        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* Search Box */}
          <div className="p-3 rounded-xl bg-[#090C14] border border-cyan-950/80 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por síntoma, código o error..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black border border-cyan-950 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-1">
              <span className="text-[9.5px] text-zinc-400 uppercase tracking-wider block font-bold">
                CATEGORÍA DE FALLA:
              </span>
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 rounded text-[9.5px] font-mono-tech transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-400 text-black font-bold'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-1 pt-1 border-t border-zinc-900">
              <span className="text-[9.5px] text-zinc-400 uppercase tracking-wider block font-bold">
                NIVEL DE COMPLEJIDAD:
              </span>
              <div className="flex flex-wrap gap-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono-tech transition-all cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-amber-400 text-black font-bold'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scenarios List (Scrollable clean cards) */}
          <div className="p-2 rounded-xl bg-[#070A10] border border-cyan-950/80 space-y-1.5 max-h-[620px] overflow-y-auto scrollbar-thin">
            <div className="px-2 py-1 text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>EXPEDIENTES DISPONIBLES</span>
              <span>{filteredScenarios.length}</span>
            </div>

            {filteredScenarios.map((sc) => {
              const isSelected = sc.id === scenario.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,210,255,0.2)]'
                      : 'bg-zinc-950/70 border-zinc-900/90 text-zinc-300 hover:border-cyan-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[9.5px]">
                    <span className="font-bold text-cyan-400">{sc.badgeCode}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold text-[8.5px] ${
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
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 text-xs font-black">
                  {scenario.badgeCode}
                </span>
                <span className="text-xs text-zinc-400 uppercase font-bold">
                  {scenario.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-amber-400 text-xs font-bold">NIVEL: {scenario.difficulty}</span>
              </div>

              <div className="flex items-center gap-2">
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
              </div>
            </div>

            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
                {scenario.title}
              </h3>
            </div>

            {/* 1. QUÉ VE EL USUARIO (SÍNTOMA REAL) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-black border-l-3 border-cyan-400 border border-cyan-950 space-y-1">
              <span className="text-[10.5px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                1. QUÉ VE EL USUARIO // SÍNTOMA OBSERVABLE EN PANTALLA:
              </span>
              <p className="text-xs sm:text-[13px] text-zinc-100 font-sans-editorial leading-relaxed italic">
                “{scenario.userSymptom}”
              </p>
            </div>

            {/* 2. TIMELINE FORENSE DEL INCIDENTE (T-60s -> T-30s -> T-10s -> FALLA -> T+10s) */}
            <div className="p-3.5 rounded-xl bg-black/80 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                <span className="text-[10.5px] font-bold text-cyan-300 uppercase font-mono-tech flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  CRONOLOGÍA PERICIAL // TIMELINE DEL INCIDENTE (SIMULATED)
                </span>
                <span className="text-[9.5px] text-zinc-500 font-mono-tech">EVENT SEQUENCE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[10px] font-mono-tech">
                {/* T-60s */}
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 space-y-1">
                  <span className="text-cyan-400 font-bold block">T-60s // ESTABLE</span>
                  <p className="text-zinc-400 font-sans-editorial leading-tight">
                    Carga inicial de drivers y servicios en Sesión 0.
                  </p>
                </div>

                {/* T-30s */}
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-950/60 space-y-1">
                  <span className="text-amber-400 font-bold block">T-30s // ANOMALÍA</span>
                  <p className="text-zinc-400 font-sans-editorial leading-tight">
                    Intento de llamada a API no soportada o puntero nulo.
                  </p>
                </div>

                {/* T-10s */}
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-900 space-y-1">
                  <span className="text-amber-300 font-bold block">T-10s // DEGRADACIÓN</span>
                  <p className="text-zinc-400 font-sans-editorial leading-tight">
                    Colapso de buffer o bloqueo en cola de dispatch.
                  </p>
                </div>

                {/* FALLA (T=0) */}
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/60 space-y-1 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                  <span className="text-rose-400 font-black block">FALLA // T=0</span>
                  <p className="text-rose-200 font-sans-editorial leading-tight font-bold">
                    {scenario.badgeCode}: Bloqueo del subsistema.
                  </p>
                </div>

                {/* T+10s */}
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-purple-950 space-y-1">
                  <span className="text-purple-400 font-bold block">T+10s // MINIDUMP</span>
                  <p className="text-zinc-400 font-sans-editorial leading-tight">
                    Registro de Event ID y volcado de memoria.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. QUÉ NO DEBEMOS ASUMIR (ANTI-PREJUICIO) */}
            <div className="p-3 rounded-xl bg-amber-950/25 border-l-3 border-amber-500 border border-amber-900/40 space-y-1">
              <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                2. QUÉ NO DEBEMOS ASUMIR // PREJUICIO TÉCNICO HABITUAL:
              </span>
              <p className="text-xs text-zinc-200 font-sans-editorial leading-relaxed">
                {scenario.whatNotToAssume}
              </p>
            </div>
          </div>

          {/* Diagnostic Steps Progression */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#080B12] border border-cyan-950 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                FLUJO DE INVESTIGACIÓN DETERMINISTA // HIPÓTESIS ➔ PRUEBA ➔ EVIDENCIA ➔ CONCLUSIÓN
              </span>
              <span className="text-[10px] text-zinc-500">FASE ACTIVA: PASO {activeStep} DE 4</span>
            </div>

            {/* STEP 1: PRIMERA PRUEBA & TELEMETRÍA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs text-white uppercase flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  PRUEBA FORENSE // COMANDO DE AUDITORÍA Y OBTENCIÓN DE EVIDENCIA
                </strong>
                <span className="text-[10px] text-zinc-400 font-mono-tech">
                  HERRAMIENTA: {scenario.firstTestTool}
                </span>
              </div>

              {/* Terminal Execution Box */}
              <div className="p-3 rounded-xl bg-black border border-cyan-900/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-cyan-400 border-b border-zinc-900 pb-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    CONSOLA FORENSE
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(scenario.firstTestCommand)}
                      className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedCommand === scenario.firstTestCommand ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">COPIADO</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPIAR</span>
                        </>
                      )}
                    </button>
                    {!hasRunFirstTest ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHasRunFirstTest(true);
                          setActiveStep(2);
                        }}
                        className="px-3 py-1 rounded bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-[10.5px] cursor-pointer shadow-[0_0_10px_rgba(0,210,255,0.4)]"
                      >
                        [ EJECUTAR PRUEBA Y RECABAR EVIDENCIA ]
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9.5px] font-bold">
                        ✔ EVIDENCIA RECABADA
                      </span>
                    )}
                  </div>
                </div>

                <pre className="text-cyan-300 text-xs font-mono-tech select-all overflow-x-auto py-1">
                  <code>{scenario.firstTestCommand}</code>
                </pre>

                {/* Simulated Output (Revealed after execution) */}
                {hasRunFirstTest && (
                  <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1.5 animate-fadeIn">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold block">
                      SALIDA DEVUELTA POR WINDOWS:
                    </span>
                    <pre className="p-2.5 rounded bg-[#050811] border border-cyan-950 text-[11px] text-emerald-300 font-mono-tech whitespace-pre-wrap leading-relaxed">
                      {scenario.testResultOutput}
                    </pre>

                    {/* New Evidence Callout */}
                    <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/60 text-xs font-sans-editorial text-zinc-200 mt-2">
                      <strong className="text-cyan-300 block font-mono-tech text-[10.5px] uppercase mb-0.5 font-bold">
                        EVIDENCIA DETERMINISTA RECABADA:
                      </strong>
                      <p>{scenario.newEvidence}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: HIPÓTESIS DISPONIBLES & CONTRASTACIÓN */}
            {hasRunFirstTest && (
              <div className="space-y-3 pt-3 border-t border-cyan-950 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    CONTRASTACIÓN DE HIPÓTESIS // CONFIRMA, DEBILITA O DESCARTA
                  </strong>
                  <span className="text-[10px] text-zinc-400">EVALUACIÓN BASADA EN EVIDENCIA</span>
                </div>

                <div className="space-y-2">
                  {scenario.hypotheses.map((h, hIdx) => {
                    const isSelected = selectedHypothesisId === h.id;
                    let stateBadge = { label: 'PENDIENTE', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' };

                    if (selectedHypothesisId) {
                      if (isSelected) {
                        stateBadge = h.isCorrect
                          ? { label: '✔ CONFIRMADA POR EVIDENCIA', color: 'bg-emerald-500 text-black border-emerald-400' }
                          : { label: '✖ DESCARTADA (REFUTADA)', color: 'bg-rose-500 text-white border-rose-400' };
                      } else {
                        stateBadge = h.isCorrect
                          ? { label: 'CONFIRMABLE', color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' }
                          : { label: 'DEBILITADA', color: 'bg-zinc-900 text-zinc-500 border-zinc-800' };
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
                        className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? h.isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                              : 'bg-rose-950/40 border-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                            : 'bg-zinc-950/80 border-zinc-900 text-zinc-300 hover:border-cyan-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-cyan-300 font-mono-tech">
                            HIPÓTESIS {String.fromCharCode(65 + hIdx)}:
                          </span>
                          <span
                            className={`text-[9.5px] px-2 py-0.5 rounded font-bold uppercase border ${stateBadge.color}`}
                          >
                            {stateBadge.label}
                          </span>
                        </div>

                        <p className="text-xs font-sans-editorial leading-snug">{h.text}</p>

                        {/* Technical explanation on selection */}
                        {isSelected && (
                          <div
                            className={`p-2 rounded text-[11px] font-sans-editorial mt-1 leading-snug ${
                              h.isCorrect
                                ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200'
                                : 'bg-rose-950/60 border border-rose-800/80 text-rose-200'
                            }`}
                          >
                            <strong>{h.isCorrect ? '✔ Evidencia confirmatoria: ' : '✖ Razón de descarte: '}</strong>
                            {h.isCorrect ? h.confirmationReason : h.rejectionReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: PRÓXIMA PRUEBA DE AISLAMIENTO & CAUSA RAÍZ */}
            {selectedHypothesis?.isCorrect && (
              <div className="space-y-3 pt-3 border-t border-cyan-950 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    PRÓXIMA PRUEBA // AISLAMIENTO DE CAUSA RAÍZ
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-[#060A14] border border-cyan-900 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="font-bold">ORDEN DE AISLAMIENTO:</span>
                    {!hasRunNextTest ? (
                      <button
                        type="button"
                        onClick={() => {
                          setHasRunNextTest(true);
                          setActiveStep(4);
                        }}
                        className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[10px] cursor-pointer"
                      >
                        [ CONFIRMAR AISLAMIENTO ]
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold">✔ CAUSA RAÍZ AISLADA</span>
                    )}
                  </div>

                  <code className="p-2 rounded bg-black block text-cyan-300 font-mono-tech text-xs border border-zinc-900">
                    {scenario.nextTestCommand}
                  </code>

                  <p className="text-[11px] text-zinc-300 font-sans-editorial">
                    {scenario.nextTestExplanation}
                  </p>

                  {hasRunNextTest && (
                    <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/40 text-purple-200 mt-2">
                      <strong className="text-purple-300 uppercase block text-[10px] font-mono-tech mb-0.5">
                        CAUSA RAÍZ FORMALMENTE AISLADA:
                      </strong>
                      <p className="font-sans-editorial text-xs leading-snug">{scenario.rootCause}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: REPARACIÓN DETERMINISTA & COMPROBACIÓN */}
            {hasRunNextTest && (
              <div className="space-y-3 pt-3 border-t border-cyan-950 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white uppercase flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                      4
                    </span>
                    REPARACIÓN & COMPROBACIÓN DEFINITIVA
                  </strong>
                  <span className="text-[10px] text-emerald-400 font-bold">PROTOCOLO LISTO</span>
                </div>

                {/* Steps and Commands */}
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-950 space-y-3 text-xs">
                  <div className="space-y-1.5 font-sans-editorial text-zinc-200">
                    <strong className="text-cyan-400 font-mono-tech uppercase text-[10.5px] block font-bold">
                      PROCEDIMIENTO DE RESOLUCIÓN:
                    </strong>
                    {scenario.solutionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-mono-tech font-bold">0{sIdx + 1}.</span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Solution Commands */}
                  {scenario.solutionCommands.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-900">
                      <span className="text-[10px] text-zinc-400 font-mono-tech uppercase font-bold block">
                        COMANDOS DE CORRECCIÓN:
                      </span>
                      <div className="space-y-1.5">
                        {scenario.solutionCommands.map((cmd, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2 rounded bg-black border border-cyan-950 flex items-center justify-between gap-2 text-xs font-mono-tech text-cyan-300"
                          >
                            <code className="select-all overflow-x-auto">{cmd}</code>
                            <button
                              type="button"
                              onClick={() => handleCopy(cmd)}
                              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] shrink-0 cursor-pointer"
                            >
                              {copiedCommand === cmd ? '✔' : 'COPIAR'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verification Protocol */}
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-1">
                    <strong className="text-emerald-400 font-mono-tech uppercase text-[10.5px] block font-bold">
                      CÓMO COMPROBAR QUE REALMENTE SE ARREGLÓ:
                    </strong>
                    <p className="font-sans-editorial text-xs leading-relaxed">
                      {scenario.verificationProtocol}
                    </p>
                    {scenario.verificationCommand && (
                      <code className="p-1.5 rounded bg-black/80 text-emerald-300 font-mono-tech text-[11px] block mt-1">
                        {scenario.verificationCommand}
                      </code>
                    )}
                  </div>

                  {/* Rollback & Safety */}
                  <div className="p-2.5 rounded-lg bg-black/70 border border-zinc-900 text-xs font-mono-tech text-zinc-400 flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300 block text-[10.5px] uppercase">
                        PROTOCOLO DE REVERSIBILIDAD (ROLLBACK):
                      </strong>
                      <span className="text-[11px] font-sans-editorial text-zinc-400">
                        {scenario.rollbackProtocol}
                      </span>
                    </div>
                  </div>

                  {/* Save to Expediente EVO Button */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-900">
                    <span className="text-[10px] text-zinc-500">
                      ESTÁNDAR EDITORIAL // EXPEDIENTE PERICIAL
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveExpediente}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-black" />
                          <span>¡GUARDADO EN EXPEDIENTE!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-black" />
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
