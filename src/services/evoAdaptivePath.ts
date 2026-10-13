// ============================================================================
// EVO LABS // ADAPTIVE PATH ENGINE (FASE 02)
// Deterministic, explainable Next Best Action Engine backed by real state
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

export type ActionPriorityLevel =
  | 'BLOQUEANTE'
  | 'CONTINUIDAD'
  | 'VERIFICACIÓN'
  | 'PRÁCTICA'
  | 'PROFUNDIZACIÓN'
  | 'EXPLORACIÓN';

export type AdaptiveActionKey =
  | 'start_tomo01'
  | 'continue_chapter'
  | 'take_exam'
  | 'audit_pc'
  | 'start_boot_lab'
  | 'start_repair_lab'
  | 'open_cases'
  | 'view_dossier';

export interface NextBestActionItem {
  id: string;
  actionTitle: string;
  categoryTag: string;
  priorityLevel: ActionPriorityLevel;
  whyExplanation: string;
  whatChanges: string;
  ctaText: string;
  actionKey: AdaptiveActionKey;
  targetChapterId?: string;
  targetLabId?: string;
  evidenceSourceRef?: string;
}

export class EvoAdaptivePathService {
  /**
   * Deterministically evaluates the single Next Best Action based strictly on real state.
   */
  public static getNextBestAction(): NextBestActionItem {
    try {
      const isC01Done = isChapter01Complete();
      const isC02Done = isChapter02Complete();
      const isC03Done = isChapter03Complete();
      const isC04Done = isChapter04Complete();
      const isC05Done = isChapter05Complete();
      const isC06Done = isChapter06Complete();
      const isC07Done = isChapter07Complete();
      const isExamPassed = isTomo01ExamPassed();
      const isTomoFullyDone = isTomo01Complete();

      const isBootLabDone = typeof window !== 'undefined' && localStorage.getItem('evo_boot_lab_completed') === 'true';
      const isWinRepairDone = typeof window !== 'undefined' && localStorage.getItem('evo_win_repair_completed') === 'true';

      const savedCases = EvoCaseRepository.getAllCases();
      const resolvedCases = savedCases.filter((c) => c.isClosed);
      const hasResolvedCase = resolvedCases.length > 0;

      // ------------------------------------------------------------------------
      // 1. BLOQUEANTE (Examen de acreditación pendiente tras completar teoría)
      // ------------------------------------------------------------------------
      if (isC07Done && !isExamPassed) {
        return {
          id: 'nba-exam-bloqueante',
          actionTitle: 'RENDIR EXAMEN FINAL DE ACREDITACIÓN (TOMO 01)',
          categoryTag: 'EVALUACIÓN PERICIAL',
          priorityLevel: 'BLOQUEANTE',
          whyExplanation:
            'Te recomendamos rendir la prueba final porque completaste los 7 capítulos didácticos del Tomo 01 y la evaluación de conocimientos (≥70%) es el requisito único para certificar tu acreditación teórica.',
          whatChanges:
            'Pasa la capacidad Validar Hipótesis a estado VERIFICADA y desbloquea tu certificado oficial del Tomo 01.',
          ctaText: 'RENDIR EXAMEN FINAL (≥70%) →',
          actionKey: 'take_exam',
          evidenceSourceRef: 'Tomo 01 · Capítulo 07 Completado',
        };
      }

      // ------------------------------------------------------------------------
      // 2. CONTINUIDAD (Completar la secuencia pedagógica en orden)
      // ------------------------------------------------------------------------
      if (!isC01Done) {
        return {
          id: 'nba-c01',
          actionTitle: 'COMENZAR TOMO 01: ARQUITECTURA DE SILICIO',
          categoryTag: 'FUNDAMENTOS TÉCNICOS',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos comenzar por el Capítulo 01 para construir los fundamentos de semiconductores, zócalos de CPU e interconexiones sin suposiciones ni mitos.',
          whatChanges:
            'Inicia tu expediente técnico pericial y activa la capacidad Identificar Hardware en estado En Desarrollo.',
          ctaText: 'INICIAR CAPÍTULO 01 →',
          actionKey: 'start_tomo01',
          targetChapterId: '01',
          evidenceSourceRef: 'Expediente Didáctico Inicial',
        };
      }

      if (!isC02Done) {
        return {
          id: 'nba-c02',
          actionTitle: 'CONTINUAR CAPÍTULO 02: PASAPORTE DE PC Y WMI',
          categoryTag: 'AUDITORÍA DE HARDWARE',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos el Capítulo 02 porque completaste los conceptos de silicio del Capítulo 01 y ahora debés auditar las especificaciones reales de tu sistema mediante WMI.',
          whatChanges:
            'Demuestra la capacidad de Identificar Hardware registrando el primer pasaporte metrológico de tu equipo.',
          ctaText: 'CONTINUAR CAPÍTULO 02 →',
          actionKey: 'continue_chapter',
          targetChapterId: '02',
          evidenceSourceRef: 'Capítulo 01 Completado',
        };
      }

      if (!isC03Done) {
        return {
          id: 'nba-c03',
          actionTitle: 'CONTINUAR CAPÍTULO 03: TELEMETRÍA Y FRAMETIMES',
          categoryTag: 'MEDICIÓN DE RENDIMIENTO',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos el Capítulo 03 porque registraste tu pasaporte en el Capítulo 02 y es momento de entender por qué los FPS promedios mienten midiendo percentiles 1% low.',
          whatChanges:
            'Activa la capacidad Comparar Rendimiento registrando tus primeras capturas de frametimes en el expediente.',
          ctaText: 'CONTINUAR CAPÍTULO 03 →',
          actionKey: 'continue_chapter',
          targetChapterId: '03',
          evidenceSourceRef: 'Capítulo 02 Completado',
        };
      }

      if (!isC04Done) {
        return {
          id: 'nba-c04',
          actionTitle: 'CONTINUAR CAPÍTULO 04: AISLAMIENTO DE CUELLO DE BOTELLA',
          categoryTag: 'DIAGNÓSTICO DE LIMITACIONES',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos el Capítulo 04 porque analizaste telemetría en el Capítulo 03 y ahora debés determinar si el límite del sistema está en CPU, GPU, VRAM o temperatura.',
          whatChanges:
            'Eleva tu capacidad Diagnosticar Rendimiento a estado Demostrada aislando saturación de buses.',
          ctaText: 'CONTINUAR CAPÍTULO 04 →',
          actionKey: 'continue_chapter',
          targetChapterId: '04',
          evidenceSourceRef: 'Capítulo 03 Completado',
        };
      }

      if (!isC05Done) {
        return {
          id: 'nba-c05',
          actionTitle: 'CONTINUAR CAPÍTULO 05: WINDOWS Y FRONTERA DE KERNEL',
          categoryTag: 'SISTEMA OPERATIVO NT',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos el Capítulo 05 porque identificaste cuellos de botella en el Capítulo 04 y es hora de auditar la barrera Ring 0 vs Ring 3 y los servicios de fondo.',
          whatChanges:
            'Activa la capacidad Interpretar Windows analizando el comportamiento del kernel NT.',
          ctaText: 'CONTINUAR CAPÍTULO 05 →',
          actionKey: 'continue_chapter',
          targetChapterId: '05',
          evidenceSourceRef: 'Capítulo 04 Completado',
        };
      }

      if (!isC06Done) {
        return {
          id: 'nba-c06',
          actionTitle: 'CONTINUAR CAPÍTULO 06: TALLER DE DIAGNÓSTICO EVO',
          categoryTag: 'ÁRBOL DE DESCARTE',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos el Capítulo 06 porque estudiaste el kernel en el Capítulo 05 y debés ejercitar el método pericial deductivo para encontrar fallas sin cambiar piezas al azar.',
          whatChanges:
            'Pasa la capacidad Diagnosticar y Árbol de Descarte a estado Verificada.',
          ctaText: 'CONTINUAR CAPÍTULO 06 →',
          actionKey: 'continue_chapter',
          targetChapterId: '06',
          evidenceSourceRef: 'Capítulo 05 Completado',
        };
      }

      if (!isC07Done) {
        return {
          id: 'nba-c07',
          actionTitle: 'CONTINUAR CAPÍTULO 07: LABORATORIO DIDÁCTICO FINAL',
          categoryTag: 'INTEGRACIÓN DIDÁCTICA',
          priorityLevel: 'CONTINUIDAD',
          whyExplanation:
            'Te recomendamos el Capítulo 07 porque aplicaste descarte en el Capítulo 06 y este es el paso final antes del examen de acreditación oficial.',
          whatChanges:
            'Prepara todos los puntos de verificación requeridos para habilitar la prueba de evaluación.',
          ctaText: 'CONTINUAR CAPÍTULO 07 →',
          actionKey: 'continue_chapter',
          targetChapterId: '07',
          evidenceSourceRef: 'Capítulo 06 Completado',
        };
      }

      // ------------------------------------------------------------------------
      // 3. PRÁCTICA (Teoría / Examen listos, falta evidencia en laboratorios)
      // ------------------------------------------------------------------------
      if (isExamPassed && !isBootLabDone) {
        return {
          id: 'nba-boot-lab',
          actionTitle: 'COMPLETAR LABORATORIO FORENSE DE ARRANQUE (TOMO 08)',
          categoryTag: 'PRÁCTICA EN INSTRUMENTOS',
          priorityLevel: 'PRÁCTICA',
          whyExplanation:
            'Aprobaste la teoría del Tomo 01. Te recomendamos el Laboratorio de Arranque porque ya tenés la base conceptual y aún no registrás evidencia empírica con multímetro virtual en los 35 estados del POST.',
          whatChanges:
            'Pasa la capacidad Analizar Arranque a estado VERIFICADA generando un informe metrológico en tu expediente.',
          ctaText: 'INICIAR LAB DE ARRANQUE →',
          actionKey: 'start_boot_lab',
          targetLabId: 'boot_lab',
          evidenceSourceRef: 'Examen Tomo 01 Aprobado',
        };
      }

      // ------------------------------------------------------------------------
      // 4. PROFUNDIZACIÓN (Resolver fallas en Windows RE o Central de Incidentes)
      // ------------------------------------------------------------------------
      if (isBootLabDone && !isWinRepairDone) {
        return {
          id: 'nba-repair-lab',
          actionTitle: 'RESOLVER FALLAS EN TALLER DE REPARACIONES DE WINDOWS',
          categoryTag: 'DIAGNÓSTICO AVANZADO',
          priorityLevel: 'PROFUNDIZACIÓN',
          whyExplanation:
            'Mediste señales en el Laboratorio de Arranque. Te recomendamos ingresar al Taller de Reparaciones de Windows para diagnosticar almacén BCD, Sfc/Dism y perfiles dañados.',
          whatChanges:
            'Verifica la capacidad Recuperar un Sistema con intervenciones reales en consola.',
          ctaText: 'ENTRAR AL TALLER DE REPARACIÓN →',
          actionKey: 'start_repair_lab',
          targetLabId: 'win_repair_lab',
          evidenceSourceRef: 'Laboratorio de Arranque Completado',
        };
      }

      if (!hasResolvedCase) {
        return {
          id: 'nba-open-case',
          actionTitle: 'RESOLVER CASO EN CENTRAL DE INCIDENTES',
          categoryTag: 'AUDITORÍA PERICIAL',
          priorityLevel: 'PROFUNDIZACIÓN',
          whyExplanation:
            'Completaste las bases didácticas. Te recomendamos ingresar a la Central de Incidentes para auditar un caso con síntomas reales, registrar mediciones y firmar un dictamen.',
          whatChanges:
            'Verifica la capacidad Documentar Evidencia sumando tu primer expediente pericial cerrado.',
          ctaText: 'ABRIR CENTRAL DE INCIDENTES →',
          actionKey: 'open_cases',
          evidenceSourceRef: 'Prácticas Didácticas Completadas',
        };
      }

      // ------------------------------------------------------------------------
      // 5. EXPLORACIÓN (Expediente completo y acreditado)
      // ------------------------------------------------------------------------
      if (isTomoFullyDone) {
        return {
          id: 'nba-dossier-review',
          actionTitle: 'CONSULTAR EXPEDIENTE Y PASAPORTE PERICIAL EN MI EVO',
          categoryTag: 'ACREDITACIÓN COMPLETA',
          priorityLevel: 'EXPLORACIÓN',
          whyExplanation:
            'Aprobaste el Tomo 01 y completaste las prácticas de laboratorio. Tu expediente técnico está plenamente verificado y podés auditar tu mapa de capacidades o consultar nuevas publicaciones.',
          whatChanges:
            'Mantiene tu certificación acreditada y actualiza tu pasaporte técnico para consulta pública.',
          ctaText: 'VER EXPEDIENTE EN MI EVO →',
          actionKey: 'view_dossier',
          evidenceSourceRef: 'Tomo 01 & Laboratorios Acreditados',
        };
      }

      // Default fallback when progress is initial
      return {
        id: 'nba-default',
        actionTitle: 'COMENZAR TOMO 01: CONOCÉ TU PC',
        categoryTag: 'RUTA RECOMENDADA',
        priorityLevel: 'CONTINUIDAD',
        whyExplanation:
          'Te recomendamos comenzar por el Capítulo 01 para construir los fundamentos de arquitectura de silicio.',
        whatChanges: 'Inicia tu expediente pericial.',
        ctaText: 'INICIAR TOMO 01 →',
        actionKey: 'start_tomo01',
      };
    } catch {
      // ------------------------------------------------------------------------
      // 6. FALLBACK (Si no hay contexto suficiente o excepción)
      // ------------------------------------------------------------------------
      return {
        id: 'nba-fallback',
        actionTitle: 'EVALUACIÓN DE RUTA EN CURSO',
        categoryTag: 'ESTADO INICIAL',
        priorityLevel: 'EXPLORACIÓN',
        whyExplanation:
          'Todavía no hay suficiente evidencia para recomendar una ruta específica.',
        whatChanges:
          'Inicia tu primera lección o laboratorio para que el motor adaptativo registre tus capacidades.',
        ctaText: 'EXPLORAR MUNDO EVO →',
        actionKey: 'start_tomo01',
      };
    }
  }
}
