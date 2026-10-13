// ============================================================================
// EVO LABS // CORE DIFFERENTIATOR: EVIDENCE & EVOLUTION ENGINE
// Adapter over existing local state: Tomo 01, Boot Lab, Cases, WMI PC Passport
// ============================================================================

import {
  isChapter01Complete,
  isChapter02Complete,
  isChapter03Complete,
  isChapter04Complete,
  isChapter05Complete,
  isChapter06Complete,
  isChapter07Complete,
  isTomo01ExamPassed,
  isTomo01Complete,
} from '../utils/tomo01Progress';
import { EvoCaseRepository } from '../components/evoLabCore/services/caseRepository';

export type ProvenanceType =
  | 'SYSTEM_REPORTED'
  | 'MEASURED'
  | 'USER_REPORTED'
  | 'CALCULATED'
  | 'SIMULATED'
  | 'ESTIMATED'
  | 'VERIFIED'
  | 'UNKNOWN';

export type CapabilityStatus = 'NO_OBSERVADA' | 'EN_DESARROLLO' | 'DEMOSTRADA' | 'VERIFIED';

export type EvidenceType =
  | 'KNOWLEDGE_CHECK'
  | 'LAB_RESULT'
  | 'DIAGNOSIS'
  | 'COMPARISON'
  | 'EXAM_RESULT'
  | 'TECHNICAL_REPORT'
  | 'SYSTEM_OBSERVATION'
  | 'USER_DOCUMENTED';

export interface EvoEvidenceItem {
  id: string;
  source: string;
  type: EvidenceType;
  title: string;
  description: string;
  tomoId?: string;
  chapterNumber?: number;
  labId?: string;
  skillId: string;
  status: CapabilityStatus;
  timestamp: string;
  provenance: ProvenanceType;
  result?: string;
  evidenceReference?: string;
  whyExplanation: string;
}

export interface EvoCapability {
  id: string;
  name: string;
  description: string;
  status: CapabilityStatus;
  statusLabel: string;
  evidenceCount: number;
  evidences: EvoEvidenceItem[];
  whyExplanation: string;
  nextStepRequirement: string;
}

export interface NextBestAction {
  title: string;
  description: string;
  whyExplanation: string;
  ctaText: string;
  actionKey: 'start_tomo01' | 'continue_chapter' | 'take_exam' | 'start_lab' | 'view_dossier';
  chapterId?: string;
}

export interface EvoEvolutionTraceNode {
  id: 'APRENDER' | 'PRACTICAR' | 'COMPROBAR' | 'DEMOSTRAR';
  title: string;
  isUnlocked: boolean;
  activeCount: number;
  description: string;
}

export class EvoEvidenceEngine {
  /**
   * Generates the entire normalized evidence graph from real user progress without duplicating state
   */
  public static getEvidenceGraph(): {
    evidences: EvoEvidenceItem[];
    capabilities: EvoCapability[];
    nextAction: NextBestAction;
    traceNodes: EvoEvolutionTraceNode[];
  } {
    const isC01Done = isChapter01Complete();
    const isC02Done = isChapter02Complete();
    const isC03Done = isChapter03Complete();
    const isC04Done = isChapter04Complete();
    const isC05Done = isChapter05Complete();
    const isC06Done = isChapter06Complete();
    const isC07Done = isChapter07Complete();
    const isExamPassed = isTomo01ExamPassed();
    const isTomoFullyDone = isTomo01Complete();
    const isBootLabDone = localStorage.getItem('evo_boot_lab_completed') === 'true';

    // Cases
    const savedCases = EvoCaseRepository.getAllCases();
    const resolvedCases = savedCases.filter((c) => c.isClosed);

    const evidences: EvoEvidenceItem[] = [];

    // 1. Chapter 01
    if (isC01Done) {
      evidences.push({
        id: 'ev-c01',
        source: 'Tomo 01 · Capítulo 01',
        type: 'KNOWLEDGE_CHECK',
        title: 'Arquitectura de Silicio & Componentes',
        description: 'Comprensión comprobada de semiconductores, zócalos de microprocesador e interconexión.',
        tomoId: '01',
        chapterNumber: 1,
        skillId: 'IDENTIFICAR_HARDWARE',
        status: 'DEMOSTRADA',
        timestamp: 'Fecha local registrada',
        provenance: 'VERIFIED',
        result: 'Comprobación de lectura 100% aprobada',
        whyExplanation: 'Completaste la lectura interactiva y los puntos de verificación del Capítulo 01 del Tomo 01.',
      });
    }

    // 2. Chapter 02
    if (isC02Done) {
      evidences.push({
        id: 'ev-c02',
        source: 'Tomo 01 · Capítulo 02',
        type: 'KNOWLEDGE_CHECK',
        title: 'Pasaporte de Hardware & Diagnóstico WMI',
        description: 'Identificación de procesador, placas y memoria RAM sin suposiciones.',
        tomoId: '01',
        chapterNumber: 2,
        skillId: 'IDENTIFICAR_HARDWARE',
        status: 'DEMOSTRADA',
        timestamp: 'Fecha local registrada',
        provenance: 'SYSTEM_REPORTED',
        result: 'Pasaporte generado en el sistema',
        whyExplanation: 'Auditaste las especificaciones reales de hardware mediante llamadas WMI / pasaporte de componentes.',
      });
    }

    // 3. Chapter 03
    if (isC03Done) {
      evidences.push({
        id: 'ev-c03',
        source: 'Tomo 01 · Capítulo 03',
        type: 'COMPARISON',
        title: 'Captura de Telemetría & Frametimes',
        description: 'Análisis de percentiles 1% low y variabilidad entre fotogramas.',
        tomoId: '01',
        chapterNumber: 3,
        skillId: 'COMPARAR_RENDIMIENTO',
        status: 'DEMOSTRADA',
        timestamp: 'Fecha local registrada',
        provenance: 'MEASURED',
        result: 'Perfil de fluidez verificado',
        whyExplanation: 'Analizaste frametimes empíricos en lugar de promedios de FPS superficiales.',
      });
    }

    // 4. Chapter 04
    if (isC04Done) {
      evidences.push({
        id: 'ev-c04',
        source: 'Tomo 01 · Capítulo 04',
        type: 'SYSTEM_OBSERVATION',
        title: 'Aislamiento de Cuello de Botella',
        description: 'Detección de límites en saturación de CPU, GPU, VRAM y límites térmicos.',
        tomoId: '01',
        chapterNumber: 4,
        skillId: 'DIAGNOSTICAR_FALLAS',
        status: 'DEMOSTRADA',
        timestamp: 'Fecha local registrada',
        provenance: 'CALCULATED',
        result: 'Límite operativo identificado',
        whyExplanation: 'Aislaste cuál es el componente limitante bajo carga máxima en el Capítulo 04.',
      });
    }

    // 5. Chapter 05
    if (isC05Done) {
      evidences.push({
        id: 'ev-c05',
        source: 'Tomo 01 · Capítulo 05',
        type: 'KNOWLEDGE_CHECK',
        title: 'Frontera de Kernel NT & Servicios',
        description: 'Diferenciación de Ring 0 vs Ring 3 y análisis de llamadas de sistema.',
        tomoId: '01',
        chapterNumber: 5,
        skillId: 'INTERPRETAR_WINDOWS',
        status: 'DEMOSTRADA',
        timestamp: 'Fecha local registrada',
        provenance: 'SIMULATED',
        result: 'Mapa de servicios verificado',
        whyExplanation: 'Auditarás la estructura de procesos, servicios e hilos de Windows NT.',
      });
    }

    // 6. Chapter 06
    if (isC06Done) {
      evidences.push({
        id: 'ev-c06',
        source: 'Tomo 01 · Capítulo 06',
        type: 'DIAGNOSIS',
        title: 'Taller de Diagnóstico & Árbol de Descarte',
        description: 'Método pericial deductivo para aislar fallas sin cambiar piezas al azar.',
        tomoId: '01',
        chapterNumber: 6,
        skillId: 'DIAGNOSTICAR_FALLAS',
        status: 'VERIFIED',
        timestamp: 'Fecha local registrada',
        provenance: 'VERIFIED',
        result: 'Árbol de descarte completado',
        whyExplanation: 'Ejecutaste el árbol de descarte ordenado sobre síntomas de fallas en el Capítulo 06.',
      });
    }

    // 7. Chapter 07 & Boot Lab
    if (isC07Done || isBootLabDone) {
      evidences.push({
        id: 'ev-boot-lab',
        source: 'Pipeline Forense de Arranque (Tomo 08)',
        type: 'LAB_RESULT',
        title: 'Análisis Pericial de Secuencia POST & BCD',
        description: 'Evaluación de los 35 estados cronológicos desde el botón POWER hasta Windows.',
        labId: 'boot-lab',
        skillId: 'ANALIZAR_ARRANQUE',
        status: isBootLabDone ? 'VERIFIED' : 'DEMOSTRADA',
        timestamp: 'Fecha local registrada',
        provenance: 'MEASURED',
        result: isBootLabDone ? 'Laboratorio completado con éxito' : 'Laboratorio en progreso',
        whyExplanation: 'Ejecutaste mediciones con multímetro virtual sobre el reloj de bus y bootloader BCD.',
      });
    }

    // 8. Exam Result
    if (isExamPassed) {
      evidences.push({
        id: 'ev-exam-t01',
        source: 'Evaluación Final Tomo 01',
        type: 'EXAM_RESULT',
        title: 'Examen de Acreditación Pericial Tomo 01',
        description: 'Aprobación de la prueba teórica y metrológica con puntaje ≥ 70%.',
        tomoId: '01',
        skillId: 'VALIDAR_HIPOTESIS',
        status: 'VERIFIED',
        timestamp: 'Fecha local registrada',
        provenance: 'VERIFIED',
        result: 'Examen Oficial Aprobado (≥70%)',
        whyExplanation: 'Rendiste y aprobaste la prueba de evaluación teórica de 15 consignas con ponderación pericial.',
      });
    }

    // 9. Resolved Cases
    resolvedCases.forEach((c) => {
      evidences.push({
        id: `ev-case-${c.id}`,
        source: `Central de Incidentes // Caso ${c.id}`,
        type: 'TECHNICAL_REPORT',
        title: `Caso Pericial Resuelto: ${c.title}`,
        description: c.summary || c.title,
        skillId: 'DOCUMENTAR_EVIDENCIA',
        status: 'VERIFIED',
        timestamp: c.updatedAt || 'Reciente',
        provenance: 'USER_REPORTED',
        result: `Dictamen: ${c.conclusionNotes || 'Resuelto y Cerrado'}`,
        whyExplanation: `Inspeccionaste el equipo, registraste mediciones y cerraste el expediente pericial de la falla.`,
      });
    });

    // =========================================================
    // CAPACIDADES RECONOCIDAS Y DEMOSTRABLES
    // =========================================================
    const capabilities: EvoCapability[] = [
      {
        id: 'IDENTIFICAR_HARDWARE',
        name: 'IDENTIFICACIÓN DE HARDWARE',
        description: 'Reconocer físicamente semiconductores, zócalos, topología de memoria y pasaporte WMI sin mitos.',
        status: isC02Done ? 'DEMOSTRADA' : isC01Done ? 'EN_DESARROLLO' : 'NO_OBSERVADA',
        statusLabel: isC02Done ? 'DEMOSTRADA' : isC01Done ? 'EN DESARROLLO' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'IDENTIFICAR_HARDWARE').length,
        evidences: evidences.filter((e) => e.skillId === 'IDENTIFICAR_HARDWARE'),
        whyExplanation: isC02Done
          ? 'Completaste los Capítulos 01 y 02 auditando especificaciones reales de silicio.'
          : 'Se requiere completar el Capítulo 01 y auditar componentes en el Capítulo 02.',
        nextStepRequirement: 'Completá Capítulo 02 (Pasaporte de PC) para verificar.',
      },
      {
        id: 'COMPARAR_RENDIMIENTO',
        name: 'COMPARACIÓN DE RENDIMIENTO',
        description: 'Medir fluidez real con frametimes y percentiles 1% low en lugar de FPS promedio.',
        status: isC03Done ? 'DEMOSTRADA' : 'NO_OBSERVADA',
        statusLabel: isC03Done ? 'DEMOSTRADA' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'COMPARAR_RENDIMIENTO').length,
        evidences: evidences.filter((e) => e.skillId === 'COMPARAR_RENDIMIENTO'),
        whyExplanation: isC03Done
          ? 'Registraste análisis de frametimes y percentiles 1% low en el Capítulo 03.'
          : 'Requiere analizar telemetría en el Capítulo 03.',
        nextStepRequirement: 'Ingresá al Capítulo 03 (Telemetría y FPS) para registrar evidencia.',
      },
      {
        id: 'DIAGNOSTICAR_FALLAS',
        name: 'DIAGNÓSTICO & ÁRBOL DE DESCARTE',
        description: 'Identificar cuellos de botella y aislar componentes defectuosos mediante descarte lógico.',
        status: isC06Done ? 'VERIFIED' : isC04Done ? 'DEMOSTRADA' : 'NO_OBSERVADA',
        statusLabel: isC06Done ? 'VERIFICADA' : isC04Done ? 'DEMOSTRADA' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'DIAGNOSTICAR_FALLAS').length,
        evidences: evidences.filter((e) => e.skillId === 'DIAGNOSTICAR_FALLAS'),
        whyExplanation: isC06Done
          ? 'Completaste el Taller de Diagnóstico y el árbol de descarte en el Capítulo 06.'
          : 'Completá los Capítulos 04 y 06 para verificar esta capacidad.',
        nextStepRequirement: 'Completá el Capítulo 06 (Taller de Diagnóstico EVO).',
      },
      {
        id: 'INTERPRETAR_WINDOWS',
        name: 'ANÁLISIS DE WINDOWS Y KERNEL NT',
        description: 'Auditar procesos, servicios de fondo, Ring 0 vs Ring 3 y latencias DPC de controladores.',
        status: isC05Done ? 'DEMOSTRADA' : 'NO_OBSERVADA',
        statusLabel: isC05Done ? 'DEMOSTRADA' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'INTERPRETAR_WINDOWS').length,
        evidences: evidences.filter((e) => e.skillId === 'INTERPRETAR_WINDOWS'),
        whyExplanation: isC05Done
          ? 'Analizaste la arquitectura del kernel NT en el Capítulo 05.'
          : 'Se requiere estudiar el Capítulo 05 del Tomo 01.',
        nextStepRequirement: 'Avancá al Capítulo 05 (Windows y Kernel).',
      },
      {
        id: 'ANALIZAR_ARRANQUE',
        name: 'ANÁLISIS DE SECUENCIA DE ARRANQUE (POST)',
        description: 'Medir los 35 estados cronológicos desde el botón Power hasta el bootloader BCD y Windows.',
        status: isBootLabDone ? 'VERIFIED' : isC07Done ? 'DEMOSTRADA' : 'NO_OBSERVADA',
        statusLabel: isBootLabDone ? 'VERIFICADA' : isC07Done ? 'DEMOSTRADA' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'ANALIZAR_ARRANQUE').length,
        evidences: evidences.filter((e) => e.skillId === 'ANALIZAR_ARRANQUE'),
        whyExplanation: isBootLabDone
          ? 'Inyectaste fallas y mediste señales en el Pipeline Forense de Arranque (Tomo 08).'
          : 'Completá el Laboratorio de Arranque en la pestaña LABORATORIOS.',
        nextStepRequirement: 'Iniciá el Laboratorio de Arranque (Tomo 08).',
      },
      {
        id: 'DOCUMENTAR_EVIDENCIA',
        name: 'DOCUMENTACIÓN Y EXPEDIENTE PERICIAL',
        description: 'Registrar diagnósticos objetivos con informe de origen de datos e hipótesis sustentada.',
        status: resolvedCases.length > 0 ? 'VERIFIED' : 'NO_OBSERVADA',
        statusLabel: resolvedCases.length > 0 ? 'VERIFICADA' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'DOCUMENTAR_EVIDENCIA').length,
        evidences: evidences.filter((e) => e.skillId === 'DOCUMENTAR_EVIDENCIA'),
        whyExplanation: resolvedCases.length > 0
          ? `Resolviste y cerraste ${resolvedCases.length} caso(s) en la Central de Incidentes.`
          : 'Resolvé al menos un expediente en el Taller de Casos para registrar evidencia.',
        nextStepRequirement: 'Resolvé un caso en la Central de Incidentes de Diagnóstico.',
      },
      {
        id: 'VALIDAR_HIPOTESIS',
        name: 'VALIDACIÓN Y EVALUACIÓN TEÓRICA',
        description: 'Rendir evaluaciones periciales oficiales demostrando dominio de fundamentos.',
        status: isExamPassed ? 'VERIFIED' : 'NO_OBSERVADA',
        statusLabel: isExamPassed ? 'VERIFICADA' : 'NO OBSERVADA',
        evidenceCount: evidences.filter((e) => e.skillId === 'VALIDAR_HIPOTESIS').length,
        evidences: evidences.filter((e) => e.skillId === 'VALIDAR_HIPOTESIS'),
        whyExplanation: isExamPassed
          ? 'Aprobaste la Prueba Final teórica del Tomo 01 con puntaje pericial (≥70%).'
          : 'Completá los 7 capítulos del Tomo 01 y rendí la Prueba Final.',
        nextStepRequirement: 'Aprobá la Prueba Final del Tomo 01.',
      },
    ];

    // =========================================================
    // SIGUIENTE MEJOR ACCIÓN RECOMENDADA CON EXPLICACIÓN
    // =========================================================
    let nextAction: NextBestAction = {
      title: 'COMENZAR TOMO 01: CONOCÉ TU PC',
      description: 'Construí la base teórica y metrológica sobre arquitectura de hardware y silicio.',
      whyExplanation: 'Te recomendamos comenzar el Tomo 01 porque aún no registrás actividad pedagógica iniciada en tu expediente.',
      ctaText: 'INICIAR TOMO 01 →',
      actionKey: 'start_tomo01',
    };

    if (isTomoFullyDone) {
      nextAction = {
        title: 'CONSULTAR TU EXPEDIENTE Y ACREDITACIÓN',
        description: 'Aprobaste el Tomo 01. Podés revisar tu diploma o continuar con las suites de laboratorio.',
        whyExplanation: 'Te recomendamos revisar tu expediente porque completaste los 7 capítulos y aprobaste la prueba final del Tomo 01.',
        ctaText: 'VER EXPEDIENTE PERICIAL →',
        actionKey: 'view_dossier',
      };
    } else if (isExamPassed) {
      nextAction = {
        title: 'COMPROBAR EN EL LABORATORIO DE ARRANQUE',
        description: 'Aprobaste el examen teórico. Ahora poné a prueba tus habilidades midiendo señales en el laboratorio.',
        whyExplanation: 'Te recomendamos ingresar al Laboratorio de Arranque porque aprobaste la teoría del Tomo 01 y es momento de generar evidencia práctica.',
        ctaText: 'INICIAR LABORATORIO →',
        actionKey: 'start_lab',
      };
    } else if (isC07Done) {
      nextAction = {
        title: 'RENDIR EXAMEN FINAL (TOMO 01)',
        description: 'Tenés los 7 capítulos didácticos completados. Requerís acreditar la teoría para cerrar el Tomo.',
        whyExplanation: 'Te recomendamos rendir la prueba final porque completaste el Capítulo 07 y todos los puntos de control didácticos del Tomo 01.',
        ctaText: 'RENDIR EXAMEN (70%) →',
        actionKey: 'take_exam',
      };
    } else if (isC06Done) {
      nextAction = {
        title: 'CONTINUAR CAPÍTULO 07: LABORATORIO FINAL',
        description: 'Medir → cambiar una variable → volver a medir → concluir con evidencia comprobable.',
        whyExplanation: 'Te recomendamos el Capítulo 07 porque completaste el taller de diagnóstico del Capítulo 06 y estás a un paso del examen.',
        ctaText: 'CONTINUAR CAPÍTULO 07 →',
        actionKey: 'continue_chapter',
        chapterId: '07',
      };
    } else if (isC05Done) {
      nextAction = {
        title: 'CONTINUAR CAPÍTULO 06: TALLER DE DIAGNÓSTICO',
        description: 'Aplica el árbol de descarte para encontrar fallas sin cambiar piezas a ciegas.',
        whyExplanation: 'Te recomendamos el Capítulo 06 porque completaste la unidad de Windows (Capítulo 05) y debés ejercitar descarte pericial.',
        ctaText: 'CONTINUAR CAPÍTULO 06 →',
        actionKey: 'continue_chapter',
        chapterId: '06',
      };
    } else if (isC04Done) {
      nextAction = {
        title: 'CONTINUAR CAPÍTULO 05: WINDOWS Y KERNEL',
        description: 'Descubrí cómo funciona la barrera Ring 0 vs Ring 3 y los servicios de fondo.',
        whyExplanation: 'Te recomendamos el Capítulo 05 porque identificaste cuellos de botella en el Capítulo 04 y es hora de auditar el sistema operativo.',
        ctaText: 'CONTINUAR CAPÍTULO 05 →',
        actionKey: 'continue_chapter',
        chapterId: '05',
      };
    } else if (isC03Done) {
      nextAction = {
        title: 'CONTINUAR CAPÍTULO 04: ENCONTRÁ EL LÍMITE',
        description: 'Aislá cuellos de botella en CPU, GPU, RAM y límites térmicos.',
        whyExplanation: 'Te recomendamos el Capítulo 04 porque analizaste telemetría en el Capítulo 03 y ahora debés determinar qué componente limita el sistema.',
        ctaText: 'CONTINUAR CAPÍTULO 04 →',
        actionKey: 'continue_chapter',
        chapterId: '04',
      };
    } else if (isC02Done) {
      nextAction = {
        title: 'CONTINUAR CAPÍTULO 03: TELEMETRÍA Y FPS',
        description: 'Entendé por qué los FPS promedios mienten y cómo medir percentiles 1% low.',
        whyExplanation: 'Te recomendamos el Capítulo 03 porque generaste tu Pasaporte de PC en el Capítulo 02 y es momento de medir fluidez empírica.',
        ctaText: 'CONTINUAR CAPÍTULO 03 →',
        actionKey: 'continue_chapter',
        chapterId: '03',
      };
    } else if (isC01Done) {
      nextAction = {
        title: 'CONTINUAR CAPÍTULO 02: PASAPORTE DE PC',
        description: 'Aprendé a auditar las especificaciones reales de tu equipo con WMI sin software opaco.',
        whyExplanation: 'Te recomendamos el Capítulo 02 porque completaste los fundamentos de silicio del Capítulo 01 y necesitás auditar tu hardware.',
        ctaText: 'CONTINUAR CAPÍTULO 02 →',
        actionKey: 'continue_chapter',
        chapterId: '02',
      };
    }

    // =========================================================
    // EVOLUTION TRACE NODES
    // =========================================================
    const traceNodes: EvoEvolutionTraceNode[] = [
      {
        id: 'APRENDER',
        title: '1. APRENDER',
        isUnlocked: isC01Done,
        activeCount: [isC01Done, isC02Done, isC03Done, isC04Done, isC05Done, isC06Done, isC07Done].filter(Boolean).length,
        description: 'Conocimiento didáctico por capas',
      },
      {
        id: 'PRACTICAR',
        title: '2. PRACTICAR',
        isUnlocked: isBootLabDone || resolvedCases.length > 0 || isC07Done,
        activeCount: isBootLabDone ? 1 : 0,
        description: 'Intervención en entorno de laboratorio',
      },
      {
        id: 'COMPROBAR',
        title: '3. COMPROBAR',
        isUnlocked: isExamPassed || resolvedCases.length > 0,
        activeCount: isExamPassed ? 1 : 0,
        description: 'Medición con instrumentos y evidencia',
      },
      {
        id: 'DEMOSTRAR',
        title: '4. DEMOSTRAR',
        isUnlocked: isTomoFullyDone,
        activeCount: isTomoFullyDone ? 1 : 0,
        description: 'Acreditación y capacidad verificada',
      },
    ];

    return {
      evidences,
      capabilities,
      nextAction,
      traceNodes,
    };
  }
}
