// ============================================================================
// EVO LABS // TOMO 10: EVO AI SYSTEMS LAB
// 10A Prompt A/B Bench | 10B Context Engineering Lab | 10C Hallucination Check
// 10D Agent Workflow Builder | 10E RAG Visualizer | 10F Evaluation Bench
// ============================================================================

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  Eye,
  FileCheck,
  FileSearch,
  Layers,
  Play,
  RotateCcw,
  Scale,
  Search,
  Sparkles,
  Terminal,
  TrendingUp,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react';
import { EvoLabFramework } from '../framework/EvoLabFramework';
import {
  DataOrigin,
  GuidedCase,
  SubLabModule,
  VerdictType,
} from '../framework/types';

interface EvoAiSystemsLabProps {
  onClose?: () => void;
  initialSubLabId?: string;
}

const TOMO_10_SUBLABS: SubLabModule[] = [
  {
    id: '10a-prompt-bench',
    code: '10A',
    title: 'PROMPT A/B BENCH // RÚBRICA CUANTITATIVA',
    subtitle: 'Comparativa paralela contra criterios explícitos de fidelidad, estructura y concisión',
    category: 'INGENIERÍA DE INSTRUCCIONES',
    description:
      'Evaluá dos versiones de un prompt frente a la misma tarea técnica. No declares ganadores por intuición: aplicá rúbricas cuantitativas de exactitud, adherencia a formato JSON y presencia de citas verificables.',
    standardReference: 'OpenAI Prompt Engineering Guide / Anthropic Claude System Prompt Spec',
    systemVariables: [
      { name: 'Estructuración', description: 'Prompt en lenguaje natural informal vs Prompt con delimitadores XML y reglas' },
      { name: 'Temperatura', description: 'Temperature 0.0 (Determinista) vs Temperature 0.8 (Creativo estocástico)' },
      { name: 'Formato Forzado', description: 'JSON Schema estricto vs Texto conversacional libre' },
    ],
    metrics: [
      {
        key: 'rubric_score',
        name: 'Puntaje de Rúbrica Cuantitativa',
        unit: '%',
        whatIsIt: 'Evaluación agregada sobre 5 criterios: formato, veracidad, concisión, ausencia de alucinación y utilidad.',
        whereItComesFrom: 'Ponderación objetiva de cumplimiento de directivas.',
        whatItMeans: 'Nivel de preparación del prompt para entornos de producción automatizados.',
        whatItDoesNotMean: 'No mide la velocidad de generación del servidor.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La consistencia y exactitud del output del modelo frente a requisitos formales.',
      whyItMatters: 'Un prompt que responde bien 1 vez pero falla 3 veces en producción destruye la confiabilidad del sistema.',
      whatCanBeConcluded: 'Usar delimitadores XML (`<contexto>`, `<reglas>`) reduce los fallos de parseo en más de un 60%.',
      whatCannotBeConcluded: 'Escribir un prompt más largo no lo hace mejor si solo añade ruido y adjetivos innecesarios.',
      evoGoldenRule: 'REGLA EVO: Un prompt es una especificación de software; trátalo con el mismo rigor que una API.',
    },
  },
  {
    id: '10b-context-engineering',
    code: '10B',
    title: 'CONTEXT ENGINEERING // LOST IN THE MIDDLE',
    subtitle: 'Simulación de ventana de contexto: Aguja en el Pajar y dilución de atención',
    category: 'ARQUITECTURA DE CONTEXTO',
    description:
      'Experimentá con la posición de los datos críticos dentro del prompt. Observá cómo la tasa de recuperación exacta cae cuando la información se sitúa en el centro de un contexto largo (fenómeno Lost in the Middle).',
    standardReference: 'Liu et al. (Stanford / Berkeley) "Lost in the Middle: How Language Models Use Long Contexts"',
    systemVariables: [
      { name: 'Longitud de Contexto', description: '1k tokens (Corto) vs 32k tokens (Medio) vs 128k tokens (Largo)' },
      { name: 'Posición de la Aguja', description: 'Inicio (0%) vs Centro (50%) vs Final (100%)' },
    ],
    metrics: [
      {
        key: 'retrieval_accuracy',
        name: 'Exactitud de Recuperación de Datos',
        unit: '%',
        whatIsIt: 'Porcentaje de éxito al extraer un dato específico ubicado dentro del contexto masivo.',
        whereItComesFrom: 'Prueba determinista Needle-in-a-Haystack sobre el buffer de atención.',
        whatItMeans: 'Eficacia de la atención del modelo en ventanas de contexto extensas.',
        whatItDoesNotMean: 'No mide el costo de los tokens.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La degradación de la atención del modelo según la posición espacial de la información.',
      whyItMatters: 'Colocar instrucciones críticas al principio y al final garantiza que el modelo no las pase por alto.',
      whatCanBeConcluded: 'La información situada en el medio de 100k tokens sufre mayor probabilidad de ser ignorada.',
      whatCannotBeConcluded: 'Tener una ventana de 1 millón de tokens no significa que puedas volcar datos sin ordenar.',
      evoGoldenRule: 'REGLA EVO: Ubicá las restricciones e instrucciones clave al final del prompt, justo antes de la pregunta.',
    },
  },
  {
    id: '10c-hallucination-check',
    code: '10C',
    title: 'HALLUCINATION CHECK // VERIFICACIÓN DE EVIDENCIA',
    subtitle: 'Auditoría pericial de afirmaciones del modelo: SUPPORTED vs UNSUPPORTED vs UNCERTAIN',
    category: 'VERIFICACIÓN DE VERACIDAD',
    description:
      'Auditá respuestas generadas por IA contrastándolas contra el corpus técnico oficial. Clasificá cada afirmación individual para identificar alucinaciones sutiles disfrazadas de lenguaje persuasivo.',
    standardReference: 'RAG Triad of Metrics (Context Relevance, Groundedness, Answer Relevance)',
    systemVariables: [
      { name: 'Afirmación Auditada', description: 'Dato técnico, especificación de voltaje, versión de protocolo' },
      { name: 'Evidencia en Corpus', description: 'Texto explícito en documentación oficial vs ausencia total de respaldo' },
    ],
    metrics: [
      {
        key: 'grounding_fidelity',
        name: 'Fidelidad de Respaldo (Grounding)',
        unit: '%',
        whatIsIt: 'Proporción de afirmaciones respaldadas textualmente por el corpus fuente.',
        whereItComesFrom: 'Matriz de verificación fáctica.',
        whatItMeans: 'Ausencia de datos inventados o extrapolaciones no autorizadas.',
        whatItDoesNotMean: 'No evalúa el estilo literario.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La correspondencia biunívoca entre la respuesta y las fuentes de evidencia autorizadas.',
      whyItMatters: 'Un modelo puede sonar 100% seguro de sí mismo mientras inventa un comando que no existe.',
      whatCanBeConcluded: 'Toda afirmación técnica sin cita textual en el corpus debe marcarse como NO RESPALDADA.',
      whatCannotBeConcluded: 'Que una respuesta suene convincente no es evidencia de veracidad.',
      evoGoldenRule: 'REGLA EVO: No lo creas. Exigí la cita en el documento fuente y comprobalo.',
    },
  },
  {
    id: '10d-agent-builder',
    code: '10D',
    title: 'AGENT WORKFLOW BUILDER // MULTI-STEP',
    subtitle: 'Constructor de flujos autónomos: Objetivo -> Plan -> Herramientas -> Verificación',
    category: 'AGENTES AUTÓNOMOS',
    description:
      'Construí y depurá un agente de diagnóstico pericial. Controlá el ciclo de vida de planificación, invocación de herramientas reales (`ping`, `read_log`, `query_wmi`) y límites máximos de iteración para evitar bucles infinitos.',
    standardReference: 'ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al.)',
    systemVariables: [
      { name: 'Límite de Pasos (Max Iterations)', description: '3 pasos vs 5 pasos vs Bucle descontrolado' },
      { name: 'Herramientas Disponibles', description: 'Herramientas de diagnóstico seguras de solo lectura' },
    ],
    metrics: [
      {
        key: 'task_completion_rate',
        name: 'Tasa de Éxito en Misión Agéntica',
        unit: '%',
        whatIsIt: 'Porcentaje de misiones resueltas con herramientas válidas y parada determinista.',
        whereItComesFrom: 'Verificación del resultado final frente a la condición de éxito.',
        whatItMeans: 'Capacidad de orquestación autónoma segura.',
        whatItDoesNotMean: 'No significa que el agente deba tener acceso a root.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La capacidad de un modelo para alternar razonamiento lógico con ejecución de herramientas.',
      whyItMatters: 'Los agentes sin criterio de parada pueden consumir miles de dólares en llamadas a APIs en bucles infinitos.',
      whatCanBeConcluded: 'Un agente confiable valida los argumentos de cada herramienta antes de ejecutarla.',
      whatCannotBeConcluded: 'No otorgues permisos de escritura o borrado a un agente sin confirmación humana previa.',
      evoGoldenRule: 'REGLA EVO: Todo agente debe tener un límite de iteraciones duro y un mecanismo de autoreflexión.',
    },
  },
  {
    id: '10e-rag-visualizer',
    code: '10E',
    title: 'RAG VISUALIZER // EMBEDDINGS & TOP-K',
    subtitle: 'Simulador de chunking semántico, similitud coseno y re-ranking',
    category: 'RETRIEVAL-AUGMENTED GENERATION',
    description:
      'Visualizá el pipeline RAG completo. Variá el tamaño de chunk (100 vs 500 vs 2,000 tokens) y el umbral de similitud coseno para comprobar cómo se recupera la información antes de enviarla al modelo.',
    standardReference: 'Lewis et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"',
    systemVariables: [
      { name: 'Tamaño de Chunk', description: '100 tokens (fragmentado) vs 450 tokens (óptimo) vs 2,500 tokens (diluido)' },
      { name: 'Top-K Documentos', description: 'K=3 vs K=5 vs K=15' },
    ],
    metrics: [
      {
        key: 'cosine_similarity',
        name: 'Similitud Coseno de Recuperación',
        unit: 'score',
        whatIsIt: 'Medida del ángulo entre el vector de la consulta y el vector del chunk documental.',
        whereItComesFrom: 'Producto escalar normalizado $\\vec{q} \\cdot \\vec{d} / (\\|\\vec{q}\\| \\|\\vec{d}\\|)$.',
        whatItMeans: 'Afinidad semántica entre la pregunta del usuario y el texto recuperado.',
        whatItDoesNotMean: 'No garantiza que el texto contenga la respuesta si el documento estaba incompleto.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La precisión con la que el motor de búsqueda vectorial localiza los fragmentos relevantes.',
      whyItMatters: 'Chunks gigantescos diluyen el significado de especificaciones numéricas exactas.',
      whatCanBeConcluded: 'Chunks de 400-600 tokens con re-ranking ofrecen el balance óptimo entre contexto y especificidad.',
      whatCannotBeConcluded: 'No hagas fine-tuning para datos que cambian semanalmente; RAG es la solución adecuada.',
      evoGoldenRule: 'REGLA EVO: En RAG, la calidad del chunking determina el 80% del éxito de la respuesta.',
    },
  },
  {
    id: '10f-evaluation-bench',
    code: '10F',
    title: 'EVALUATION BENCH // GOLDEN SET & REGRESIÓN',
    subtitle: 'Batería automatizada de pruebas sobre prompts con cálculo de Pass Rate',
    category: 'METROLOGÍA DE MODELOS',
    description:
      'No mejores un prompt a ojo: medilo contra un Golden Dataset de 5 casos límite. Verificá si una optimización introdujo regresiones en casos que antes funcionaban.',
    standardReference: 'MMLU / HELM / MT-Bench Evaluation Frameworks',
    systemVariables: [
      { name: 'Dataset de Evaluación', description: '5 casos límite con aserciones de formato y contenido' },
      { name: 'Versión de Prompt', description: 'Prompt V1 Baseline vs Prompt V2 Optimizado' },
    ],
    metrics: [
      {
        key: 'pass_rate',
        name: 'Tasa de Éxito en Golden Set (Pass Rate)',
        unit: '%',
        whatIsIt: 'Porcentaje de casos de prueba que superaron el 100% de las aserciones automáticas.',
        whereItComesFrom: 'Evaluador automatizado sobre el dataset fijo de pruebas.',
        whatItMeans: 'Solidez empírica del prompt antes de desplegar a producción.',
        whatItDoesNotMean: 'No garantiza que no existan casos no contemplados en el dataset.',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La tasa de éxito cuantitativa sobre una batería fija de casos de prueba.',
      whyItMatters: 'Cambiar un prompt basándote en 1 sola prueba mental suele romper otros 3 casos en producción.',
      whatCanBeConcluded: 'Si el Pass Rate sube de 60% a 100% sin regresiones, el cambio de ingeniería está verificado.',
      whatCannotBeConcluded: 'La intuición no es evidencia de mejora.',
      evoGoldenRule: 'REGLA EVO: No lo creas. Medí el Pass Rate contra el Golden Dataset y comprobalo.',
    },
  },
];

const TOMO_10_GUIDED_CASES: GuidedCase[] = [
  {
    id: 'case-10-01',
    caseNumber: 'CASO 01',
    title: 'Alucinación factual en extracción técnica por falta de delimitadores de grounding',
    symptom: 'El modelo inventa un número de parte de controlador VRM que no existe en el manual adjunto.',
    evidence: 'El prompt solicita "Extraé los chips" sin especificar que solo debe usar información del bloque `<documento>`.',
    hypothesis: 'El modelo recurre a su conocimiento paramétrico previo para rellenar huecos cuando falta la restricción explícita.',
    testAction: 'Añadir la directiva "Respondé ÚNICAMENTE con los datos explícitos del `<documento>`. Si no figura, emití `null`" en el Prompt A/B Bench.',
    resultSummary: 'Tasa de alucinación cae de 38% a 0%; el modelo emite `null` en datos faltantes.',
    conclusion: 'Las restricciones negativas explícitas y los delimitadores XML eliminan la alucinación por extrapolación.',
    targetSubLabId: '10a-prompt-bench',
  },
  {
    id: 'case-10-02',
    caseNumber: 'CASO 02',
    title: 'Pérdida de instrucción crítica ubicada en el centro de un contexto de 64k tokens',
    symptom: 'El modelo omite la regla "No usar caracteres especiales" colocada en la página 35 de 70.',
    evidence: 'El fenómeno Lost in the Middle degrada la atención en la región del 40% al 60% del contexto.',
    hypothesis: 'Reubicar la directiva al final del prompt (justo antes del mensaje de usuario) restaurará la adherencia al 100%.',
    testAction: 'Mover la aguja de instrucción al final del contexto en el Context Engineering Lab.',
    resultSummary: 'Exactitud de recuperación sube de 42% a 99.4%.',
    conclusion: 'La atención de los Transformers es máxima en los extremos; las directivas de control deben situarse al final.',
    targetSubLabId: '10b-context-engineering',
  },
  {
    id: 'case-10-03',
    caseNumber: 'CASO 03',
    title: 'Recuperación de chunks irrelevantes en RAG por tamaño de fragmento de 2,500 tokens',
    symptom: 'El sistema RAG responde con generalidades y no encuentra el código de error exacto.',
    evidence: 'La similitud coseno de los chunks de 2,500 tokens es de solo 0.58 debido a la dilución semántica.',
    hypothesis: 'Reducir el tamaño de chunk a 450 tokens con solapamiento de 50 tokens aumentará la densidad del vector.',
    testAction: 'Re-indexar con chunking semántico en el RAG Visualizer.',
    resultSummary: 'Similitud coseno escala a 0.89 y el fragmento del código de error se posiciona en el Top 1.',
    conclusion: 'Chunks compactos y semánticamente densos maximizan la fidelidad de la búsqueda vectorial.',
    targetSubLabId: '10e-rag-visualizer',
  },
  {
    id: 'case-10-04',
    caseNumber: 'CASO 04',
    title: 'Bucle infinito en agente autónomo de diagnóstico por falta de criterio de parada',
    symptom: 'El agente ejecuta `ping 192.168.1.1` 20 veces consecutivas consumiendo 45,000 tokens.',
    evidence: 'La herramienta devuelve error de timeout pero el agente no tiene un contador máximo de reintentos.',
    hypothesis: 'Implementar `max_iterations = 4` y mecanismo de autoreflexión forzada tras 2 fallos.',
    testAction: 'Configurar límites en el Agent Workflow Builder.',
    resultSummary: 'El agente aborta limpiamente en el paso 3 y genera el reporte explicando la desconexión física.',
    conclusion: 'Todo flujo agéntico debe tener límites duros de pasos y manejo explícito de errores de herramientas.',
    targetSubLabId: '10d-agent-builder',
  },
  {
    id: 'case-10-05',
    caseNumber: 'CASO 05',
    title: 'Regresión oculta: un cambio en el prompt mejoró 1 caso pero rompió 2 en producción',
    symptom: 'El equipo cambió el prompt para hacerlo más conciso y los clientes reportan fallos de formato JSON.',
    evidence: 'El cambio no se evaluó contra el Golden Dataset antes de publicarlo en producción.',
    hypothesis: 'Ejecutar la suite en el Evaluation Bench revelará qué aserciones fallaron en los casos límite.',
    testAction: 'Ejecutar la batería de 5 casos en el Evaluation Bench y ajustar el prompt hasta obtener 100% de Pass Rate.',
    resultSummary: 'Pass Rate restaurado al 100% en todos los casos límite.',
    conclusion: 'La evaluación metrológica continua con datasets fijos es indispensable para evitar regresiones en ingeniería de IA.',
    targetSubLabId: '10f-evaluation-bench',
  },
];

export const EvoAiSystemsLab: React.FC<EvoAiSystemsLabProps> = ({
  onClose,
  initialSubLabId,
}) => {
  const [activeSubLabId, setActiveSubLabId] = useState<string>(() => TOMO_10_SUBLABS.some((lab) => lab.id === initialSubLabId) ? initialSubLabId! : '10a-prompt-bench');

  // 10A Prompt Bench State
  const [promptStructured, setPromptStructured] = useState<boolean>(false);

  // 10B Context State
  const [needlePosition, setNeedlePosition] = useState<'start' | 'middle' | 'end'>('middle');

  // 10C Hallucination State
  const [claimsVerified, setClaimsVerified] = useState<Record<number, string>>({});

  // 10D Agent State
  const [agentStep, setAgentStep] = useState<number>(1);

  // 10E RAG State
  const [chunkSize, setChunkSize] = useState<100 | 450 | 2500>(2500);

  // 10F Evaluation State
  const [evalRunVersion, setEvalRunVersion] = useState<'v1' | 'v2'>('v1');

  return (
    <EvoLabFramework
      tomeId="tomo-10"
      tomeNumber="10"
      tomeTitle="PROMPT E IA AVANZADA // SISTEMAS DE IA & EVALUACIÓN METROLÓGICA"
      accentColor="#8b5cf6"
      subLabs={TOMO_10_SUBLABS}
      guidedCases={TOMO_10_GUIDED_CASES}
      activeSubLabId={activeSubLabId}
      onSelectSubLab={setActiveSubLabId}
      onClose={onClose}
      renderExperimentStation={({ activeSubLab, isDeepMode, onRecordMeasurement }) => {
        // LAB 10A // PROMPT A/B BENCH
        if (activeSubLab.id === '10a-prompt-bench') {
          const score = promptStructured ? 98 : 45;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">PROMPT EN PRUEBA</div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPromptStructured(false)}
                      className={`w-full p-2.5 rounded text-left ${
                        !promptStructured ? 'bg-rose-500/20 text-rose-300 border border-rose-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Prompt A // Informal (&quot;Extraé los datos del texto y ponelos lindo en JSON&quot;)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptStructured(true)}
                      className={`w-full p-2.5 rounded text-left ${
                        promptStructured ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Prompt B // Estructurado XML + Restricción estricta de Grounding
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2 text-center flex flex-col justify-center">
                  <div className="text-[10px] text-zinc-500">PUNTAJE DE RÚBRICA CUANTITATIVA</div>
                  <div className={`text-4xl font-black ${score > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {score}%
                  </div>
                  <div className="text-xs text-zinc-300 font-sans-editorial">
                    {promptStructured
                      ? '✓ 100% conformidad de esquema JSON, 0 alucinaciones, citas textuales presentes.'
                      : '⚠️ Salida con texto conversacional preámbulo ("Here is your JSON") y 2 alucinaciones.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {promptStructured ? 'PROMPT APTO PARA PRODUCCIÓN' : 'FALLOS DE PARSEO EN CLIENTE'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Estructura de Prompt (${promptStructured ? 'Estructurado XML' : 'Informal'})`,
                      baselineValue: 45,
                      experimentValue: score,
                      deltaValue: score - 45,
                      metricKey: 'rubric_score',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Rúbrica de evaluación OpenAI / Anthropic Spec.',
                      samples: [score, score, score],
                      interpretation: promptStructured
                        ? 'El uso de delimitadores XML y modo JSON estricto elevó el cumplimiento del contrato al 98%.'
                        : 'El prompt informal produce fallos de sintaxis y alucinaciones por ambigüedad.',
                      verdict: promptStructured ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Ingeniería de prompts estructurada validada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR BENCHMARK DE PROMPT →
                </button>
              </div>
            </div>
          );
        }

        // LAB 10B // CONTEXT ENGINEERING
        if (activeSubLab.id === '10b-context-engineering') {
          const accuracy = needlePosition === 'middle' ? 42.5 : 99.1;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-purple-400 uppercase font-bold">
                    POSICIÓN DE LA INSTRUCCIÓN CRÍTICA EN 64K TOKENS
                  </div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setNeedlePosition('start')}
                      className={`w-full p-2 rounded text-left ${
                        needlePosition === 'start' ? 'bg-purple-500 text-white font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Al Principio del Contexto (0%) // Alta Atención
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedlePosition('middle')}
                      className={`w-full p-2 rounded text-left ${
                        needlePosition === 'middle' ? 'bg-rose-500/20 text-rose-300 border border-rose-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      En el Medio del Contexto (50%) // Lost in the Middle
                    </button>
                    <button
                      type="button"
                      onClick={() => setNeedlePosition('end')}
                      className={`w-full p-2 rounded text-left ${
                        needlePosition === 'end' ? 'bg-emerald-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Al Final del Contexto (100%) // Máxima Atención
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2 text-center flex flex-col justify-center">
                  <div className="text-[10px] text-zinc-500">TASA DE RECUPERACIÓN EXACTA</div>
                  <div className={`text-4xl font-black ${accuracy < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {accuracy}%
                  </div>
                  <div className="text-xs text-zinc-300 font-sans-editorial">
                    {needlePosition === 'middle'
                      ? '⚠️ La atención decae en el centro de ventanas largas. Se omiten instrucciones clave.'
                      : '✓ Ubicación óptima: la atención posicional captura el 99% de las directivas.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  FENÓMENO: {needlePosition === 'middle' ? 'LOST IN THE MIDDLE CONFIRMADO' : 'ATENCIÓN MÁXIMA EN EXTREMOS'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Posición de Instrucción (${needlePosition})`,
                      baselineValue: 42.5,
                      experimentValue: accuracy,
                      deltaValue: (accuracy - 42.5).toFixed(1),
                      metricKey: 'retrieval_accuracy',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Prueba Needle-in-a-Haystack protocolo Stanford.',
                      samples: [accuracy, accuracy, accuracy],
                      interpretation:
                        needlePosition !== 'middle'
                          ? 'Colocar las directivas en los extremos del prompt eleva la recuperación al 99.1%.'
                          : 'El centro del contexto sufre una caída del 57% en la atención efectiva.',
                      verdict: needlePosition !== 'middle' ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Ingeniería de contexto validada empíricamente.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR ATENCIÓN DE CONTEXTO →
                </button>
              </div>
            </div>
          );
        }

        // LAB 10C // HALLUCINATION CHECK
        if (activeSubLab.id === '10c-hallucination-check') {
          const claims = [
            { id: 1, text: 'El estándar PCIe 5.0 ofrece 32 GT/s por línea.', status: 'SUPPORTED', rationale: 'Presente en la especificación oficial PCI-SIG.' },
            { id: 2, text: 'Windows 11 requiere 128 GB de memoria RAM para iniciar.', status: 'UNSUPPORTED', rationale: 'Falso: el requisito oficial mínimo es 4 GB.' },
            { id: 3, text: 'La latencia de DDR5 CL30 absoluta es menor que DDR4 CL16.', status: 'SUPPORTED', rationale: 'Demostrado: 30 / 6000 * 2000 = 10.0 ns vs 16 / 3200 * 2000 = 10.0 ns.' },
          ];

          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-3 font-mono-tech">
                <div className="text-[10px] text-purple-400 uppercase font-bold">
                  AFIRMACIONES A AUDITAR CONTRA EL CORPUS
                </div>
                <div className="space-y-2">
                  {claims.map((cl) => (
                    <div key={cl.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 space-y-2">
                      <div className="text-white font-bold">{cl.text}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-zinc-500">CLASIFICACIÓN:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setClaimsVerified({ ...claimsVerified, [cl.id]: 'SUPPORTED' })}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              claimsVerified[cl.id] === 'SUPPORTED' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            SUPPORTED
                          </button>
                          <button
                            type="button"
                            onClick={() => setClaimsVerified({ ...claimsVerified, [cl.id]: 'UNSUPPORTED' })}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              claimsVerified[cl.id] === 'UNSUPPORTED' ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            UNSUPPORTED
                          </button>
                        </div>
                      </div>
                      {claimsVerified[cl.id] && (
                        <div className="text-[11px] font-sans-editorial text-zinc-400 pt-1 border-t border-zinc-900">
                          <strong>Veredicto Oficial:</strong> {cl.status} — {cl.rationale}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  AFIRMACIONES AUDITADAS: {Object.keys(claimsVerified).length} / {claims.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Auditoría Fáctica Anti-Alucinación',
                      baselineValue: 0,
                      experimentValue: 100,
                      deltaValue: 100,
                      metricKey: 'grounding_fidelity',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Matriz RAG Triad of Metrics.',
                      samples: [100, 100, 100],
                      interpretation: 'Verificación pericial contra fuentes oficiales completada sin alucinaciones admitidas.',
                      verdict: 'MEJORA',
                      conclusion: 'Fidelidad de grounding validada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR FIDELIDAD EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 10D // AGENT BUILDER
        if (activeSubLab.id === '10d-agent-builder') {
          return (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-3">
                <div className="text-[10px] text-purple-400 uppercase font-bold">
                  CICLO DE VIDA DEL AGENTE (REACT PATTERN)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-900">
                    <strong className="text-cyan-400 block text-[10px]">1. PLAN</strong>
                    <span>Analizar IP 192.168.1.1</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-900">
                    <strong className="text-amber-400 block text-[10px]">2. TOOL USE</strong>
                    <span>ping_host(&apos;192.168.1.1&apos;)</span>
                  </div>
                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-900">
                    <strong className="text-purple-400 block text-[10px]">3. OBSERVE</strong>
                    <span>RTT=0.8ms (OK)</span>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950 border border-emerald-500">
                    <strong className="text-emerald-400 block text-[10px]">4. PARADA</strong>
                    <span>Reporte pericial emitido</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO AGENTE: PARADA DETERMINISTA EN PASO 4 (0 BUCLES)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: 'Orquestación de Agente con Límite de Pasos',
                      baselineValue: 0,
                      experimentValue: 100,
                      deltaValue: 100,
                      metricKey: 'task_completion_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Patrón ReAct con límite de iteraciones.',
                      samples: [100, 100, 100],
                      interpretation: 'El agente resolvió la consulta invocando la herramienta adecuada y finalizando en 4 pasos.',
                      verdict: 'MEJORA',
                      conclusion: 'Flujo agéntico autónomo verificado.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR MISIÓN AGÉNTICA →
                </button>
              </div>
            </div>
          );
        }

        // LAB 10E // RAG VISUALIZER
        if (activeSubLab.id === '10e-rag-visualizer') {
          const simScore = chunkSize === 450 ? 0.89 : chunkSize === 100 ? 0.72 : 0.58;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-purple-400 uppercase font-bold">TAMAÑO DE CHUNK EN RAG</div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setChunkSize(100)}
                      className={`w-full p-2 rounded text-left ${
                        chunkSize === 100 ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      100 Tokens // Fragmentado (Pierde contexto global)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChunkSize(450)}
                      className={`w-full p-2 rounded text-left ${
                        chunkSize === 450 ? 'bg-emerald-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      450 Tokens // Semántico Óptimo + Solapamiento
                    </button>
                    <button
                      type="button"
                      onClick={() => setChunkSize(2500)}
                      className={`w-full p-2 rounded text-left ${
                        chunkSize === 2500 ? 'bg-rose-500/20 text-rose-300 border border-rose-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      2,500 Tokens // Diluido (Pérdida de especificidad)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2 text-center flex flex-col justify-center">
                  <div className="text-[10px] text-zinc-500">SIMILITUD COSENO (TOP 1)</div>
                  <div className={`text-4xl font-black ${simScore > 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {simScore}
                  </div>
                  <div className="text-xs text-zinc-300 font-sans-editorial">
                    {chunkSize === 450
                      ? '✓ Chunking óptimo: vector denso con alta fidelidad para el código de error exacto.'
                      : '⚠️ Chunking inadecuado: similitud diluida o contexto insuficiente.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO RAG: {chunkSize === 450 ? 'RECUPERACIÓN PRECISA' : 'DILUCIÓN VECTORIAL'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Tamaño de Chunk RAG (${chunkSize} tokens)`,
                      baselineValue: 0.58,
                      experimentValue: simScore,
                      deltaValue: +(simScore - 0.58).toFixed(2),
                      metricKey: 'cosine_similarity',
                      metricUnit: 'score',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Cálculo de similitud coseno vectorial en espacio 1536d.',
                      samples: [simScore, simScore, simScore],
                      interpretation:
                        chunkSize === 450
                          ? 'El chunking semántico de 450 tokens maximiza la similitud coseno a 0.89.'
                          : 'Chunks de 2500 tokens diluyen el vector reduciendo la relevancia a 0.58.',
                      verdict: chunkSize === 450 ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Parámetros de ingesta RAG optimizados.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR MÉTRICA RAG →
                </button>
              </div>
            </div>
          );
        }

        // LAB 10F // EVALUATION BENCH
        if (activeSubLab.id === '10f-evaluation-bench') {
          const passRate = evalRunVersion === 'v2' ? 100 : 60;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3 font-mono-tech">
                  <div className="text-[10px] text-purple-400 uppercase font-bold">VERSIÓN DE PROMPT EN EVALUACIÓN</div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setEvalRunVersion('v1')}
                      className={`w-full p-2.5 rounded text-left ${
                        evalRunVersion === 'v1' ? 'bg-amber-400/20 text-amber-300 border border-amber-400 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Prompt V1 Baseline (3 de 5 casos aprobados // 60%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEvalRunVersion('v2')}
                      className={`w-full p-2.5 rounded text-left ${
                        evalRunVersion === 'v2' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Prompt V2 Optimizado (5 de 5 casos aprobados // 100%)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2 text-center flex flex-col justify-center">
                  <div className="text-[10px] text-zinc-500">PASS RATE SOBRE GOLDEN DATASET</div>
                  <div className={`text-4xl font-black ${passRate === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {passRate}%
                  </div>
                  <div className="text-xs text-zinc-300 font-sans-editorial">
                    {passRate === 100
                      ? '✓ 100% de aserciones aprobadas en los 5 casos límite sin regresiones.'
                      : '⚠️ Fallos en caso 2 (JSON inválido) y caso 4 (alucinación de fecha).'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  BENCHMARK: {evalRunVersion === 'v2' ? 'PROMPT V2 VALIDADO SIN REGRESIONES' : 'PROMPT V1 REQUIERE CORRECCIÓN'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Evaluación de Golden Dataset (${evalRunVersion})`,
                      baselineValue: 60,
                      experimentValue: passRate,
                      deltaValue: passRate - 60,
                      metricKey: 'pass_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Batería automatizada de aserciones Golden Set.',
                      samples: [passRate, passRate, passRate],
                      interpretation:
                        evalRunVersion === 'v2'
                          ? 'El Prompt V2 alcanza el 100% de éxito en el Golden Dataset eliminando los errores de formato y alucinación.'
                          : 'El baseline V1 sufre fallos en el 40% de los casos límite.',
                      verdict: evalRunVersion === 'v2' ? 'MEJORA' : 'SIN CAMBIO',
                      conclusion: 'Evaluación metrológica continua de IA completada.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR PASS RATE EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
};
