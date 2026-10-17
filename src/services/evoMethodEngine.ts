// ============================================================================
// EVO LABS // EVO METHOD ENGINE (FASE 08)
// Universal Tech Learning Protocol across 9 Canonical Stages:
// OBSERVAR → ENTENDER → HIPOTETIZAR → INTERVENIR → MEDIR → COMPARAR → COMPROBAR → DOCUMENTAR → TRANSFERIR
// Applicable across 8 Universal Tech Domains.
// ============================================================================

export type EvoMethodStage =
  | 'OBSERVAR'
  | 'ENTENDER'
  | 'HIPOTETIZAR'
  | 'INTERVENIR'
  | 'MEDIR'
  | 'COMPARAR'
  | 'COMPROBAR'
  | 'DOCUMENTAR'
  | 'TRANSFERIR';

export type EvoTechDomain =
  | 'hardware'
  | 'windows'
  | 'redes'
  | 'ciberseguridad'
  | 'reparacion'
  | 'programacion'
  | 'ia'
  | 'electronica';

export interface EvoStageDefinition {
  stage: EvoMethodStage;
  order: number;
  label: string;
  tagline: string;
  description: string;
  keyQuestion: string;
  color: string;
}

export interface TransferChallenge {
  id: string;
  domain: EvoTechDomain;
  title: string;
  originalLearnedPrinciple: string;
  unseenScenario: string;
  transferQuestion: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  explanation: string;
  demonstratedCompetency: string;
}

export const EVO_METHOD_STAGES: EvoStageDefinition[] = [
  {
    stage: 'OBSERVAR',
    order: 1,
    label: '1. OBSERVAR',
    tagline: 'Captura empírica sin prejuicios',
    description: 'Registro riguroso de síntomas, alertas, logs y comportamiento anómalo visible del sistema.',
    keyQuestion: '¿Qué está ocurriendo exactamente y qué señales emite el sistema?',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
  },
  {
    stage: 'ENTENDER',
    order: 2,
    label: '2. ENTENDER',
    tagline: 'Modelo causal de arquitectura',
    description: 'Análisis de la topología y flujo del dato en condiciones nominales para determinar las capas involucradas.',
    keyQuestion: '¿Cuál es el modelo causal y qué componentes o capas intervienen?',
    color: 'text-blue-400 border-blue-500/30 bg-blue-950/20',
  },
  {
    stage: 'HIPOTETIZAR',
    order: 3,
    label: '3. HIPOTETIZAR',
    tagline: 'Matriz de causas plausibles',
    description: 'Formulación simultánea de hipótesis en paralelo con evidencias a favor y en contra. Cero causas directas sin prueba.',
    keyQuestion: '¿Qué posibles causas explican la evidencia observada?',
    color: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
  },
  {
    stage: 'INTERVENIR',
    order: 4,
    label: '4. INTERVENIR',
    tagline: 'Acción aislada y controlada',
    description: 'Ejecución de un cambio técnico único, documentado y reproducible sobre una sola variable.',
    keyQuestion: '¿Qué variable específica se modifica para verificar o descartar?',
    color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
  },
  {
    stage: 'MEDIR',
    order: 5,
    label: '5. MEDIR',
    tagline: 'Lectura instrumental con procedencia',
    description: 'Captura de valores numéricos directos (WMI, sensores, multímetro, latencias) con nivel de procedencia explícito.',
    keyQuestion: '¿Qué valor exacto y qué nivel de procedencia arroja la lectura?',
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
  },
  {
    stage: 'COMPARAR',
    order: 6,
    label: '6. COMPARAR',
    tagline: 'Contraste A/B (Antes vs Después)',
    description: 'Evaluación de deltas: qué mejoró, qué empeoró y qué variables permanecieron invariantes.',
    keyQuestion: '¿Cuál es el delta de cambio medido frente a la línea base?',
    color: 'text-teal-400 border-teal-500/30 bg-teal-950/20',
  },
  {
    stage: 'COMPROBAR',
    order: 7,
    label: '7. COMPROBAR',
    tagline: 'Prueba de estrés y estabilidad',
    description: 'Sometimiento del sistema a cargas reales para descartar falsos positivos y asegurar robustez.',
    keyQuestion: '¿La solución resuelve la causa raíz de forma robusta y reproducible?',
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
  },
  {
    stage: 'DOCUMENTAR',
    order: 8,
    label: '8. DOCUMENTAR',
    tagline: 'Expediente pericial auditable',
    description: 'Registro estructurado en el expediente con procedencia de datos, pasos seguidos y justificación epistémica.',
    keyQuestion: '¿Queda constancia auditable sin datos inventados ni sesgos?',
    color: 'text-rose-400 border-rose-500/30 bg-rose-950/20',
  },
  {
    stage: 'TRANSFERIR',
    order: 9,
    label: '9. TRANSFERIR',
    tagline: 'Extrapolación a un problema nuevo',
    description: 'El verdadero cierre: aplicación del principio fundamental a una arquitectura o escenario que nunca viste antes.',
    keyQuestion: '¿Podés aplicar este principio a un sistema distinto que jamás viste?',
    color: 'text-amber-300 border-amber-400/40 bg-gradient-to-r from-amber-950/40 to-yellow-950/30',
  },
];

export const TRANSFER_CHALLENGES: TransferChallenge[] = [
  {
    id: 'trans-hw-01',
    domain: 'hardware',
    title: 'Transferencia de Principio Térmico a Workstation Industrial',
    originalLearnedPrinciple: 'El Thermal Throttling de CPU reduce la frecuencia de boost al sobrepasar la temperatura límite TJMax para proteger el silicio.',
    unseenScenario: 'Una máquina de control numérico (CNC) industrial con procesador embebido se apaga aleatoriamente tras 40 minutos de fresado continuo. El técnico anterior reemplazó la fuente de poder pero el fallo persiste.',
    transferQuestion: '¿Cuál es la primera acción metrológica que deberías ejecutar aplicando el principio aprendido en el Tomo 01?',
    options: [
      {
        id: 'opt-hw-1',
        text: 'Auditar la curva de temperatura del disipador del procesador embebido bajo carga y verificar si la pasta térmica se degradó por calor acumulado.',
        isCorrect: true,
        feedback: 'Correcto. Trasladaste el principio de disipación y thermal throttling a un entorno industrial no estándar.',
      },
      {
        id: 'opt-hw-2',
        text: 'Formatear el sistema operativo del controlador CNC inmediatamente.',
        isCorrect: false,
        feedback: 'Incorrecto. No podés asumir un fallo de software cuando el síntoma depende del tiempo de carga térmica.',
      },
      {
        id: 'opt-hw-3',
        text: 'Cambiar el cable de red de la máquina CNC.',
        isCorrect: false,
        feedback: 'Incorrecto. La red no guarda relación causal con el apagado por acumulación de tiempo de mecanizado.',
      },
    ],
    explanation: 'El apagado dependiente del tiempo bajo carga de trabajo es el síntoma clásico de saturación térmica por falla en la transferencia de calor.',
    demonstratedCompetency: 'TRANSFERENCIA_METROLOGIA_TERMICA',
  },
  {
    id: 'trans-win-01',
    domain: 'windows',
    title: 'Transferencia de DPC Latency a Audio Profesional en Linux',
    originalLearnedPrinciple: 'Los controladores que ejecutan rutinas DPC/ISR prolongadas en Ring 0 bloquean el pipeline de audio y renderizado en tiempo real.',
    unseenScenario: 'Estás configurando una estación de grabación de audio profesional sobre Linux (Ubuntu Studio / JACK Server) y experimentas chasquidos (xruns) cada vez que conectas un adaptador Wi-Fi USB.',
    transferQuestion: '¿Cómo explicarías causalmente este fallo basándote en la teoría de interrupciones de kernel aprendida en EVO LABS?',
    options: [
      {
        id: 'opt-win-1',
        text: 'El controlador del adaptador Wi-Fi USB está monopolizando la atención del kernel mediante interrupciones de alta prioridad, retrasando el buffer de audio en tiempo real.',
        isCorrect: true,
        feedback: 'Excelente. El principio de congestión por interrupciones es universal e independiente del sistema operativo.',
      },
      {
        id: 'opt-win-2',
        text: 'El formato de los archivos de audio MP3 no es compatible con la tarjeta Wi-Fi.',
        isCorrect: false,
        feedback: 'Incorrecto. La capa de formato de archivo no interactúa a nivel de interrupciones de hardware.',
      },
    ],
    explanation: 'Tanto en Windows (DPC) como en Linux (softirq), un driver mal optimizado acapara los hilos de interrupción de baja latencia requeridos por el audio digital.',
    demonstratedCompetency: 'TRANSFERENCIA_KERNEL_INTERRUPCIONES',
  },
  {
    id: 'trans-sec-01',
    domain: 'ciberseguridad',
    title: 'Transferencia de Descarte Forense a Detección de Anomalías en Red',
    originalLearnedPrinciple: 'No se concluye causa sin comparar la línea base (baseline) nominal con las lecturas medidas en el incidente.',
    unseenScenario: 'Un firewall corporativo reporta un pico inusual de tráfico saliente de 4GB a una IP desconocida. El analista junior quiere bloquear el servidor web de inmediato.',
    transferQuestion: '¿Qué paso del EVO METHOD se está omitiendo y qué deberías hacer primero?',
    options: [
      {
        id: 'opt-sec-1',
        text: 'Se está omitiendo ENTENDER y MEDIR: Debes comparar contra la línea base de copias de seguridad programadas antes de interrumpir un servicio crítico.',
        isCorrect: true,
        feedback: 'Exacto. Nunca se interviene a ciegas sin verificar la procedencia y el cronograma nominal de operaciones.',
      },
      {
        id: 'opt-sec-2',
        text: 'Apagar el edificio desconectando la llave general eléctrica.',
        isCorrect: false,
        feedback: 'Absurdo y destructivo. La metodología pericial exige aislamiento y trazabilidad.',
      },
    ],
    explanation: 'La comparación contra el baseline nominal evita falsos positivos causados por tareas legítimas de mantenimiento o backup.',
    demonstratedCompetency: 'TRANSFERENCIA_ANALISIS_FORENSE',
  },
];

export class EvoMethodEngine {
  /**
   * Retrieves all 9 stages of the EVO METHOD
   */
  static getStages(): EvoStageDefinition[] {
    return EVO_METHOD_STAGES;
  }

  /**
   * Retrieves a specific stage by ID
   */
  static getStage(stage: EvoMethodStage): EvoStageDefinition {
    return EVO_METHOD_STAGES.find((s) => s.stage === stage) || EVO_METHOD_STAGES[0];
  }

  /**
   * Retrieves all transfer challenges
   */
  static getTransferChallenges(): TransferChallenge[] {
    return TRANSFER_CHALLENGES;
  }

  /**
   * Evaluates a transfer challenge answer
   */
  static evaluateTransferAnswer(challengeId: string, optionId: string): {
    isCorrect: boolean;
    feedback: string;
    explanation: string;
  } {
    const challenge = TRANSFER_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return { isCorrect: false, feedback: 'Desafío no encontrado', explanation: '' };
    }
    const option = challenge.options.find((o) => o.id === optionId);
    const isCorrect = option?.isCorrect ?? false;
    return {
      isCorrect,
      feedback: option?.feedback || 'Opción no registrada',
      explanation: challenge.explanation,
    };
  }
}
