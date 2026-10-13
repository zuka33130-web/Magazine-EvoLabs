import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
  FileText,
  Search,
  Check,
} from 'lucide-react';
import {
  Machine,
  DiagnosticHypothesis,
  DiagnosticQuestion,
  DiagnosticStep,
  EvoCase,
  HypothesisStatus,
  TechnicalEvidence,
  LearnMoreReference,
} from '../types';
import { EvoCaseRepository } from '../services/caseRepository';
import { EvoMachinePreparedCard } from '../components/EvoMachinePreparedCard';
import { EvoTechnicalEvidenceModal } from '../components/EvoTechnicalEvidenceModal';
import { EvoLearnMoreCallout } from '../components/EvoLearnMoreCallout';
import { EvoTechnicianReportModal } from '../components/EvoTechnicianReportModal';
import { FileCheck, Printer } from 'lucide-react';

interface EvoLabCoreRepairViewProps {
  machine: Machine;
  onNavigateHome: () => void;
  onNavigateToTomo?: (tomoId: '01' | '02' | '03' | '04') => void;
  onChangeMachineRequested?: () => void;
}

const COMMON_SYMPTOMS = [
  'No enciende en absoluto',
  'Enciende pero no da video',
  'Se apaga a los pocos segundos',
  'Se reinicia inesperadamente',
  'Se congela / Freezes aleatorios',
  'Pantalla Azul (BSOD / Bugcheck)',
  'Funciona extremadamente lenta',
  'Uso de disco al 100%',
  'Uso excesivo de memoria RAM',
  'Temperatura alta / Throttling',
  'Ventiladores al 100% ruidosos',
  'Tirones y stuttering en juegos',
  'Bajo rendimiento de FPS',
  'Problemas de red / Latencia alta',
  'Juego se cierra sin mensaje de error',
  'Falla eléctrica o olor a quemado',
];

export const EvoLabCoreRepairView: React.FC<EvoLabCoreRepairViewProps> = ({
  machine,
  onNavigateHome,
  onNavigateToTomo,
  onChangeMachineRequested,
}) => {
  const [symptomInput, setSymptomInput] = useState('');
  const [investigationStarted, setInvestigationStarted] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showTechnicianReportModal, setShowTechnicianReportModal] = useState(false);

  // Hypotheses and status
  const [hypotheses, setHypotheses] = useState<DiagnosticHypothesis[]>([]);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [diagnosticSteps, setDiagnosticSteps] = useState<DiagnosticStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [evidenceLog, setEvidenceLog] = useState<TechnicalEvidence[]>([]);
  const [probableDiagnosis, setProbableDiagnosis] = useState<string | null>(null);
  const [recommendedSolution, setRecommendedSolution] = useState<{
    action: string;
    riskLevel: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
    isReversible: boolean;
    howToRevert: string;
  } | null>(null);

  // Handle symptom submission and rule-based diagnostic hypothesis instantiation
  const handleStartInvestigation = (symptomText: string) => {
    const symptom = symptomText.trim();
    if (!symptom) return;
    setSymptomInput(symptom);

    const sLower = symptom.toLowerCase();

    // Deterministic diagnostic rule engine for typical hardware patterns
    let generatedHypotheses: DiagnosticHypothesis[] = [];
    let generatedQuestions: DiagnosticQuestion[] = [];
    let initialSteps: DiagnosticStep[] = [];

    if (sLower.includes('5 segundo') || sLower.includes('apaga') || sLower.includes('enciende y se apaga')) {
      generatedHypotheses = [
        {
          id: 'hyp-thermal-cut',
          title: 'Protección Térmica Instantánea (PROCHOT / TjMax)',
          subsystem: 'cooling',
          status: 'PROBABLE',
          rationale: 'Si la bomba de líquido no funciona o el bloque del disipador no hace contacto, la CPU alcanza 100°C en 3-5 segundos y la placa corta por hardware.',
          suggestedTest: 'Verificar si el disipador toma calor al tacto o entrar al BIOS para leer temperatura de arranque.',
        },
        {
          id: 'hyp-psu-ocp',
          title: 'Protección de Sobrecorriente en Fuente (OCP / OPP) o Corto en VRM',
          subsystem: 'psu',
          status: 'POSSIBLE',
          rationale: 'Un cortocircuito en los MOSFETs del riel EPS 12V de la CPU hace que la fuente detecte el pico y corte de inmediato.',
          suggestedTest: 'Desconectar el conector EPS de 8 pines de la CPU y ver si la placa se mantiene encendida sin apagarse.',
        },
        {
          id: 'hyp-ram-train',
          title: 'Falla en Entrenamiento de Memoria (RAM Memory Training Loop)',
          subsystem: 'ram',
          status: 'POSSIBLE',
          rationale: 'Si la RAM no logra sincronizar voltajes o perfiles XMP/JEDEC, la placa cicla el encendido.',
          suggestedTest: 'Probar con un solo módulo en el slot secundario (A2/B2) o limpiar contactos.',
        },
      ];

      generatedQuestions = [
        {
          id: 'q1',
          prompt: '¿Alcanza a dar imagen o mostrar el logo de la placa/fabricante antes de apagarse?',
          options: [
            { label: 'Sí, muestra el logo y se apaga de inmediato', value: 'yes_logo', impactDescription: 'Descarta falla en inicialización de video temprana; apunta fuertemente a térmico o carga de periféricos.' },
            { label: 'No, no llega a dar ninguna imagen en pantalla', value: 'no_logo', impactDescription: 'Indica fallo en fase POST previa a inicialización de GPU.' },
          ],
        },
        {
          id: 'q2',
          prompt: 'Si intentás encenderla inmediatamente después de que se apagó, ¿qué sucede?',
          options: [
            { label: 'No responde al botón hasta desenchufarla y esperar unos minutos', value: 'latched_psu', impactDescription: 'Típico comportamiento de protección latching en la fuente de poder (OCP/SCP).' },
            { label: 'Vuelve a encender al instante y se vuelve a apagar a los 5 segundos', value: 'thermal_or_loop', impactDescription: 'Apunta a protección térmica en procesador o ciclo de entrenamiento de RAM.' },
          ],
        },
        {
          id: 'q3',
          prompt: '¿La computadora tiene placa de video dedicada o gráficos integrados?',
          options: [
            { label: 'Placa de video dedicada conectada por cable PCIe', value: 'dedicated_gpu' },
            { label: 'Usa los gráficos del procesador (HDMI a la placa base)', value: 'integrated_gpu' },
          ],
        },
      ];

      initialSteps = [
        {
          stepNumber: 1,
          testName: 'Comprobación de Bomba / Bloque de Refrigeración',
          instructions: [
            'Apagá la PC y desenchufala de la pared.',
            'Verificá que el cable del cooler o bomba AIO esté conectado a CPU_FAN o PUMP_FAN.',
            'Al presionar encendido, tocá la manguera o base del disipador para sentir vibración de fluido o disipación de calor.',
          ],
          expectedObservation: 'Si el cooler no gira o el bloque está helado mientras el CPU corta, el disipador no hace contacto térmico.',
          whatItProves: 'Descarta o confirma desconexión del ventilador o falla en la bomba.',
          whatItDoesNotProve: 'No descarta cortocircuito en placa madre.',
          completed: false,
        },
      ];
    } else if (sLower.includes('video') || sLower.includes('negra') || sLower.includes('no da imagen')) {
      generatedHypotheses = [
        {
          id: 'hyp-ram-contact',
          title: 'Memoria RAM con contacto sucio o desajuste de canal',
          subsystem: 'ram',
          status: 'PROBABLE',
          rationale: 'La causa número 1 de "enciende sin video" es estática o suciedad en pines DDR.',
          suggestedTest: 'Retirar módulos, limpiar contactos dorados con goma o alcohol isopropílico y probar uno solo.',
        },
        {
          id: 'hyp-cable-display',
          title: 'Cable de video conectado a la placa madre en vez de la GPU',
          subsystem: 'display',
          status: 'POSSIBLE',
          rationale: 'Si la CPU no tiene gráficos integrados y el cable HDMI está en el mother, jamás dará video.',
          suggestedTest: 'Asegurar que el cable monitor vaya a las salidas horizontales de la placa de video dedicada.',
        },
      ];

      generatedQuestions = [
        {
          id: 'q1',
          prompt: '¿El cable del monitor está conectado a la placa de video dedicada o a la placa madre?',
          options: [
            { label: 'A la placa de video dedicada (abajo en horizontal)', value: 'gpu_port' },
            { label: 'A la placa madre (arriba cerca de los USBs)', value: 'mb_port' },
          ],
        },
      ];
    } else {
      // General Diagnostic Fallback
      generatedHypotheses = [
        {
          id: 'hyp-general-driver',
          title: 'Conflicto de Controladores o Corrupción de Subsistema',
          subsystem: 'kernel',
          status: 'POSSIBLE',
          rationale: 'Frecuente tras actualizaciones automáticas o fallas de driver de video.',
          suggestedTest: 'Comprobar visor de eventos de Windows y modo seguro.',
        },
        {
          id: 'hyp-general-temp',
          title: 'Límite Térmico o Disipador Obstruido',
          subsystem: 'cooling',
          status: 'POSSIBLE',
          rationale: 'La degradación de pasta térmica incrementa latencias y tirones.',
          suggestedTest: 'Monitorizar temperaturas con prueba de estrés.',
        },
      ];

      generatedQuestions = [
        {
          id: 'q1',
          prompt: '¿Este problema comenzó de forma repentina o fue empeorando gradualmente?',
          options: [
            { label: 'Repentino: De un momento a otro tras un reinicio o corte', value: 'sudden' },
            { label: 'Gradual: Viene empeorando hace semanas o meses', value: 'gradual' },
          ],
        },
      ];
    }

    setHypotheses(generatedHypotheses);
    setQuestions(generatedQuestions);
    setDiagnosticSteps(initialSteps);
    setCurrentQuestionIndex(0);
    setInvestigationStarted(true);

    // Save EvoCase in repository
    const newCase: EvoCase = {
      id: `EVO-REP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      caseType: 'REPAIR',
      title: `Reparación: ${symptom.substring(0, 40)}`,
      machine,
      isClosed: false,
      repairSession: {
        symptomRaw: symptom,
        symptomCategory: 'DIAGNOSTICO_HARDWARE',
        questions: generatedQuestions,
        currentQuestionIndex: 0,
        hypotheses: generatedHypotheses,
        diagnosticSteps: initialSteps,
        currentStepIndex: 0,
        learnMoreRef: {
          tomoId: '03',
          tomoTitle: 'Repará tu PC // Taller de Escritorio',
          chapterNumber: '02',
          chapterTitle: 'Diagnóstico Eléctrico y Rieles de Protección',
          concept: 'Mecanismos de protección por hardware OCP/TjMax',
          pedagogicalSummary: 'Cuando la CPU o la fuente detectan un parámetro crítico, se activan los circuitos lógicos de corte automático en microsegundos para salvar el silicio.',
          actionPrompt: 'ESTUDIAR EN TOMO 03 // FALLAS DE CORTE',
        },
      },
    };

    EvoCaseRepository.saveCase(newCase);
  };

  // Answer a question and recalculate hypotheses (Testimony updates PROBABLE / DISCARDED, never CONFIRMED without physical test)
  const handleAnswerQuestion = (questionId: string, value: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, answeredValue: value } : q
    );
    setQuestions(updatedQuestions);

    // Update hypotheses based on answer
    const updatedHypotheses = hypotheses.map((h) => {
      if (value === 'yes_logo' && h.id === 'hyp-thermal-cut') {
        return {
          ...h,
          status: 'PROBABLE' as HypothesisStatus,
          rationale: 'El procesador arranca y entrega señal de video; el apagado a los ~5 segundos es fuertemente compatible con disparo de protección térmica (TjMax / PROCHOT), pero requiere confirmación física en banco.',
        };
      }
      if (value === 'yes_logo' && h.id === 'hyp-psu-ocp') {
        return {
          ...h,
          status: 'DISCARDED' as HypothesisStatus,
          rationale: 'Descartado: Un cortocircuito franco en rieles de la fuente apaga el equipo en microsegundos, antes de que el monitor reciba señal de sincronismo y muestre logo.',
        };
      }
      if (value === 'yes_logo' && h.id === 'hyp-ram-train') {
        return {
          ...h,
          status: 'DISCARDED' as HypothesisStatus,
          rationale: 'Descartado: La inicialización de video confirma que la placa madre superó la secuencia POST de sincronización y entrenamiento de memoria.',
        };
      }
      if (value === 'latched_psu' && h.id === 'hyp-psu-ocp') {
        return {
          ...h,
          status: 'PROBABLE' as HypothesisStatus,
          rationale: 'Comportamiento compatible con protección latching en la fuente de poder (OCP/SCP), pendiente de medición con multímetro o fuente de prueba.',
        };
      }
      return h;
    });

    setHypotheses(updatedHypotheses);

    // If answer indicates thermal cut
    if (value === 'yes_logo') {
      setProbableDiagnosis('Disipador Térmico sin contacto o Bomba de Refrigeración no operativa (Hipótesis más probable).');
      setRecommendedSolution({
        action: 'Revisar anclaje mecánico del cooler, verificar película plástica protectora en base de cobre y constatar giro de ventilador / bomba en cabezal CPU_FAN.',
        riskLevel: 'MINIMAL',
        isReversible: true,
        howToRevert: 'El montaje mecánico no altera software ni firmware.',
      });

      // Add empirical observation note
      setEvidenceLog((prev) => [
        ...prev,
        {
          id: `ev-${Date.now()}`,
          subsystem: 'cooling',
          metricName: 'Patrón de Tiempo hasta Apagado POST',
          value: '~5s tras imagen de BIOS',
          unit: 'segundos',
          provenance: 'ESTIMATED',
          source: 'Observación Testimonial de Ciclo POST',
          timestamp: new Date().toISOString(),
          confidencePct: 88,
          verdictNote: 'Tiempo concordante con saturación de masa térmica en die sin refrigeración activa.',
        },
      ]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Perform physical bench test to reach CONFIRMED state with measured evidence
  const handleConfirmPhysicalStep = (stepNumber: number) => {
    setDiagnosticSteps((prev) =>
      prev.map((s) => (s.stepNumber === stepNumber ? { ...s, completed: true } : s))
    );

    // Transition hyp-thermal-cut to CONFIRMED with physical evidence
    setHypotheses((prev) =>
      prev.map((h) =>
        h.id === 'hyp-thermal-cut'
          ? {
              ...h,
              status: 'CONFIRMED' as HypothesisStatus,
              rationale: 'CONFIRMADO POR PRUEBA FÍSICA EN BANCO: Disipador desanclado sin contacto térmico con el IHS / Bomba sin flujo.',
            }
          : h
      )
    );

    setEvidenceLog((prev) => [
      ...prev,
      {
        id: `ev-bench-${Date.now()}`,
        subsystem: 'cooling',
        metricName: 'Inspección Mecánica / Sensor Térmico en Banco',
        value: 'Base fría / Disipador sin presión de contacto',
        unit: 'Inspección Física',
        provenance: 'MEASURED',
        source: 'Verificación Física Directa en Banco de Pruebas',
        timestamp: new Date().toISOString(),
        confidencePct: 99,
        verdictNote: 'El IHS del procesador no transfería calor a la masa del disipador.',
      },
    ]);

    setProbableDiagnosis('CONFIRMADO: Falla de refrigeración física (disipador desanclado / sin pasta o contacto).');
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none font-mono-tech">
      {/* Top Breadcrumb & Machine Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            EVO LABS
          </button>
          <span className="text-zinc-600">/</span>
          <span className="text-amber-400 font-bold">MODO 1: REPARAR</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] text-zinc-300 font-bold">
            MOTOR DE INVESTIGACIÓN CAUSAL
          </span>
        </div>
      </div>

      {/* Machine Prepared Card */}
      <EvoMachinePreparedCard
        machine={machine}
        compact
        onChangeMachineRequested={onChangeMachineRequested}
      />

      {/* STEP 1: Symptom Definition */}
      {!investigationStarted ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#0d1017] p-6 space-y-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                PASO 1 // ENTRADA DE SÍNTOMAS
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
                ¿QUÉ LE PASA A ESTA COMPUTADORA?
              </h2>
              <p className="text-xs text-zinc-400 font-sans-editorial">
                Describí lo que experimentás o seleccioná un síntoma frecuente. No asumas la causa todavía: contanos qué observás.
              </p>
            </div>
          </div>

          {/* Quick Frequent Symptoms Grid */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
              SÍNTOMAS FRECUENTES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {COMMON_SYMPTOMS.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStartInvestigation(sym)}
                  className="p-2.5 rounded-xl bg-zinc-900/70 hover:bg-amber-400/10 border border-zinc-800 hover:border-amber-400/40 text-left text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{sym}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Free-text input */}
          <div className="pt-2 space-y-2.5">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
              O ESCRIBÍ TU PROPIA OBSERVACIÓN LIBRE:
            </span>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartInvestigation(symptomInput);
                }}
                placeholder="Ejemplo: Se apaga a los 5 segundos, los coolers giran y da video..."
                className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => handleStartInvestigation(symptomInput)}
                disabled={!symptomInput.trim()}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0"
              >
                <span>INICIAR INVESTIGACIÓN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2: Investigation Pipeline (Questions, Hypotheses & Diagnostic Engine) */
        <div className="space-y-6">
          {/* Active Symptom Bar */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                  SÍNTOMA EN OBSERVACIÓN:
                </span>
                <span className="text-sm font-bold text-white">
                  "{symptomInput}"
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setInvestigationStarted(false);
                setProbableDiagnosis(null);
                setRecommendedSolution(null);
              }}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cambiar Síntoma</span>
            </button>
          </div>

          {/* Diagnostic Question Box */}
          {currentQ && !probableDiagnosis && (
            <div className="rounded-2xl border border-amber-500/40 bg-[#0e131d] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  PREGUNTA DE DIAGNÓSTICO {currentQuestionIndex + 1} DE {questions.length}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  ACTUALIZA EXPEDIENTE CAUSAL
                </span>
              </div>

              <h3 className="font-display font-bold text-white text-base sm:text-lg">
                {currentQ.prompt}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleAnswerQuestion(currentQ.id, opt.value)}
                    className="p-4 rounded-xl bg-zinc-900/80 hover:bg-amber-400/10 border border-zinc-700 hover:border-amber-400 text-left transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="font-bold text-white text-xs group-hover:text-amber-300 flex items-center justify-between">
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                    </div>
                    {opt.impactDescription && (
                      <p className="text-[11px] text-zinc-400 font-sans-editorial leading-relaxed">
                        {opt.impactDescription}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Probable Diagnosis Banner & Recommended Solution */}
          {probableDiagnosis && (
            <div className="rounded-2xl border border-emerald-500/50 bg-[#091512] p-5 sm:p-6 space-y-4 shadow-2xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  DIAGNÓSTICO CAUSAL ALCANZADO
                </span>
              </div>

              <h3 className="font-display font-black text-white text-lg sm:text-xl">
                {probableDiagnosis}
              </h3>

              {recommendedSolution && (
                <div className="p-4 rounded-xl bg-zinc-950/70 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-300 uppercase">
                      ACCIÓN DE REMEDIACIÓN RECOMENDADA:
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      NIVEL DE RIESGO: {recommendedSolution.riskLevel}
                    </span>
                  </div>
                  <p className="text-zinc-200 text-xs font-sans-editorial leading-relaxed">
                    {recommendedSolution.action}
                  </p>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Reversibilidad: {recommendedSolution.howToRevert}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Activity className="w-4 h-4" />
                  <span>VER EVIDENCIA TÉCNICA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTechnicianReportModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-black font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>GENERAR INFORME EVO</span>
                </button>
              </div>
            </div>
          )}

          {/* NEXT TEST / PROTOCOLO DE VERIFICACIÓN FÍSICA EN BANCO */}
          {diagnosticSteps.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-[#0d121c] p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  PROTOCOLO DE COMPROBACIÓN FÍSICA EN BANCO (SIGUIENTE PASO)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  SOLO LA PRUEBA FÍSICA CONFIRMA LA CAUSA
                </span>
              </div>

              {diagnosticSteps.map((step) => (
                <div key={step.stepNumber} className="space-y-3 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-cyan-400/20 text-cyan-400 flex items-center justify-center text-xs">
                        {step.stepNumber}
                      </span>
                      <span>{step.testName}</span>
                    </h4>
                    {step.completed ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        COMPROBACIÓN FÍSICA EJECUTADA
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        PENDIENTE DE ENSAYO FÍSICO
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-300 font-sans-editorial">
                    {step.instructions.map((inst, iIdx) => (
                      <li key={iIdx}>{inst}</li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <span className="text-cyan-400 font-bold block mb-0.5">Qué demuestra:</span>
                      {step.whatItProves}
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                      <span className="text-amber-400 font-bold block mb-0.5">Qué NO demuestra:</span>
                      {step.whatItDoesNotProve}
                    </div>
                  </div>

                  {!step.completed && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleConfirmPhysicalStep(step.stepNumber)}
                        className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>REGISTRAR RESULTADO DE ENSAYO FÍSICO (CONFIRMAR CON EVIDENCIA)</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Hypotheses Matrix */}
          <div className="rounded-2xl border border-zinc-800 bg-[#0d1017] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="font-display font-bold text-white text-sm uppercase">
                  ESTADO DE HIPÓTESIS // INVESTIGACIÓN VIVA
                </h4>
              </div>
              <span className="text-[11px] text-zinc-400">
                {hypotheses.filter((h) => h.status === 'CONFIRMED').length} Confirmadas •{' '}
                {hypotheses.filter((h) => h.status === 'DISCARDED').length} Descartadas
              </span>
            </div>

            <div className="space-y-3">
              {hypotheses.map((hyp) => (
                <div
                  key={hyp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    hyp.status === 'CONFIRMED'
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : hyp.status === 'DISCARDED'
                      ? 'border-zinc-800/80 bg-zinc-950/40 opacity-60'
                      : 'border-zinc-800 bg-zinc-900/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{hyp.title}</span>
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-zinc-800 text-zinc-400">
                        {hyp.subsystem}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold self-start sm:self-auto ${
                        hyp.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : hyp.status === 'PROBABLE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : hyp.status === 'DISCARDED'
                          ? 'bg-red-500/20 text-red-400 line-through border border-red-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {hyp.status}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-xs font-sans-editorial pt-2 leading-relaxed">
                    {hyp.rationale}
                  </p>

                  <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5 bg-black/40 p-2 rounded-lg">
                    <span className="text-amber-400 font-bold">Prueba sugerida:</span>
                    <span>{hyp.suggestedTest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learn More Callout */}
          <EvoLearnMoreCallout
            reference={{
              tomoId: '03',
              tomoTitle: 'Repará tu PC // Taller de Escritorio',
              chapterNumber: '02',
              chapterTitle: 'Diagnóstico de Fallas de Alimentación y Rieles de Corte',
              concept: 'Lógica de protección térmica y sobrecorriente',
              pedagogicalSummary:
                'Los sistemas modernos integran controladores que apagan el sistema en nanosegundos para evitar daños al silicio. El tiempo transcurrido antes del corte es la firma física del problema.',
              actionPrompt: 'ESTUDIAR EN TOMO 03 // FALLAS DE CORTE',
            }}
            onNavigateToTomo={onNavigateToTomo}
          />
        </div>
      )}

      {/* Technical Evidence Modal */}
      <EvoTechnicalEvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        evidenceList={evidenceLog}
      />

      {/* Professional Technician Printable Report Modal */}
      <EvoTechnicianReportModal
        isOpen={showTechnicianReportModal}
        onClose={() => setShowTechnicianReportModal(false)}
        evoCase={{
          id: `EVO-REP-${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          caseType: 'REPAIR',
          title: `Diagnóstico: ${symptomInput || 'Incidente de Silicio'}`,
          machine,
          isClosed: Boolean(probableDiagnosis),
          repairSession: {
            symptomRaw: symptomInput,
            hypotheses,
            questions,
            diagnosticSteps,
            evidenceLog,
            finalDiagnosis: probableDiagnosis || undefined,
            solutionRecommended: recommendedSolution?.action,
          },
        }}
      />
    </div>
  );
};
