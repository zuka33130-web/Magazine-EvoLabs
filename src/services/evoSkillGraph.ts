// ============================================================================
// EVO LABS // SKILL GRAPH ENGINE
// Real capability map backed exclusively by verifiable evidence (NO XP/FAKES)
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

export type SkillStatus = 'NO_OBSERVADA' | 'EN_DESARROLLO' | 'DEMOSTRADA' | 'VERIFICADA';

export interface TraceabilityCheckItem {
  id: string;
  label: string;
  isDone: boolean;
  requiredFor: 'EN_DESARROLLO' | 'DEMOSTRADA' | 'VERIFICADA';
}

export interface SkillGraphNode {
  id: string;
  name: string;
  description: string;
  status: SkillStatus;
  statusLabel: string;
  prerequisites: string[]; // Skill IDs
  supports: string[]; // Skill IDs
  demonstratedBy: string[]; // Sources (Capítulos, Labs, Casos)
  verifiedBy: string[]; // Verifiers (Examen, Instrumentos, Cert)
  unlocks: string[]; // Capabilities or tools
  relations: {
    tomo?: string;
    chapters?: string[];
    labs?: string[];
    cases?: string[];
    exam?: string;
    evidences?: string[];
    tools?: string[];
  };
  traceability: {
    whyState: string;
    checklist: TraceabilityCheckItem[];
  };
  associatedEvidencesCount: number;
  whatIsMissing: string;
  nextAction: {
    label: string;
    actionKey: 'start_tomo01' | 'continue_chapter' | 'start_lab' | 'take_exam' | 'open_cases' | 'view_dossier';
    targetId?: string;
  };
}

export class EvoSkillGraphService {
  /**
   * Generates the complete, deterministic skill graph from real user state.
   */
  public static getSkillGraph(): {
    nodes: SkillGraphNode[];
    totalSkillsCount: number;
    demonstratedCount: number;
    verifiedCount: number;
    inDevelopmentCount: number;
    unobservedCount: number;
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
    const isBootLabDone = typeof window !== 'undefined' && localStorage.getItem('evo_boot_lab_completed') === 'true';
    const isWinRepairDone = typeof window !== 'undefined' && localStorage.getItem('evo_win_repair_completed') === 'true';

    const savedCases = EvoCaseRepository.getAllCases();
    const resolvedCases = savedCases.filter((c) => c.isClosed);
    const hasResolvedCase = resolvedCases.length > 0;

    const nodes: SkillGraphNode[] = [];

    // ------------------------------------------------------------------------
    // 1. IDENTIFICAR HARDWARE
    // ------------------------------------------------------------------------
    let statusHw: SkillStatus = 'NO_OBSERVADA';
    if (isExamPassed) statusHw = 'VERIFICADA';
    else if (isC02Done) statusHw = 'DEMOSTRADA';
    else if (isC01Done) statusHw = 'EN_DESARROLLO';

    nodes.push({
      id: 'IDENTIFICAR_HARDWARE',
      name: 'IDENTIFICAR HARDWARE',
      description: 'Reconocer físicamente semiconductores, zócalos, topología de memoria y pasaporte WMI sin suposiciones.',
      status: statusHw,
      statusLabel: statusHw === 'VERIFICADA' ? 'VERIFICADA' : statusHw === 'DEMOSTRADA' ? 'DEMOSTRADA' : statusHw === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: [],
      supports: ['DIAGNOSTICAR_RENDIMIENTO', 'COMPARAR_CONFIGURACIONES'],
      demonstratedBy: ['Tomo 01 · Capítulo 01 (Silicio)', 'Tomo 01 · Capítulo 02 (Pasaporte WMI)'],
      verifiedBy: ['Examen Oficial Tomo 01 (≥70%)', 'Auditoría de Pasaporte de Hardware'],
      unlocks: ['Herramienta Pasaporte de Hardware', 'Monitor de Especificaciones'],
      relations: {
        tomo: '01',
        chapters: ['01', '02'],
        tools: ['hw_passport', 'specs_audit'],
        exam: 'Examen Tomo 01',
      },
      traceability: {
        whyState:
          statusHw === 'VERIFICADA'
            ? 'Completaste los capítulos 01 y 02 y verificaste tus conocimientos en la prueba final con un puntaje ≥70%.'
            : statusHw === 'DEMOSTRADA'
            ? 'Completaste los capítulos 01 y 02, registrando el pasaporte técnico WMI de tu equipo.'
            : statusHw === 'EN_DESARROLLO'
            ? 'Completaste el Capítulo 01 (Lógica de Silicio) pero aún no registraste el Pasaporte en el Capítulo 02.'
            : 'No registrás lectura interactiva ni puntos de verificación en los Capítulos 01 o 02 del Tomo 01.',
        checklist: [
          { id: 'c01', label: 'Capítulo 01: Arquitectura de Silicio', isDone: isC01Done, requiredFor: 'DEMOSTRADA' },
          { id: 'c02', label: 'Capítulo 02: Pasaporte de PC WMI', isDone: isC02Done, requiredFor: 'DEMOSTRADA' },
          { id: 'exam', label: 'Examen Tomo 01 (≥70%)', isDone: isExamPassed, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC01Done ? 1 : 0) + (isC02Done ? 1 : 0) + (isExamPassed ? 1 : 0),
      whatIsMissing:
        statusHw === 'VERIFICADA'
          ? 'Capacidad plenamente acreditada.'
          : statusHw === 'DEMOSTRADA'
          ? 'Rendir y aprobar la prueba final del Tomo 01 (≥70%).'
          : statusHw === 'EN_DESARROLLO'
          ? 'Completar el Capítulo 02 (Pasaporte de PC) auditando especificaciones.'
          : 'Iniciar el Capítulo 01 del Tomo 01.',
      nextAction:
        statusHw === 'VERIFICADA'
          ? { label: 'VER PASAPORTE WMI →', actionKey: 'view_dossier' }
          : statusHw === 'DEMOSTRADA'
          ? { label: 'RENDIR EXAMEN →', actionKey: 'take_exam' }
          : statusHw === 'EN_DESARROLLO'
          ? { label: 'CONTINUAR CAPÍTULO 02 →', actionKey: 'continue_chapter', targetId: '02' }
          : { label: 'INICIAR CAPÍTULO 01 →', actionKey: 'start_tomo01' },
    });

    // ------------------------------------------------------------------------
    // 2. INTERPRETAR WINDOWS
    // ------------------------------------------------------------------------
    let statusWin: SkillStatus = 'NO_OBSERVADA';
    if (isExamPassed && isC05Done) statusWin = 'VERIFICADA';
    else if (isC05Done) statusWin = 'DEMOSTRADA';

    nodes.push({
      id: 'INTERPRETAR_WINDOWS',
      name: 'INTERPRETAR WINDOWS',
      description: 'Auditar procesos, servicios de fondo, Ring 0 vs Ring 3 y latencias DPC de controladores.',
      status: statusWin,
      statusLabel: statusWin === 'VERIFICADA' ? 'VERIFICADA' : statusWin === 'DEMOSTRADA' ? 'DEMOSTRADA' : 'NO OBSERVADA',
      prerequisites: ['IDENTIFICAR_HARDWARE'],
      supports: ['INTERPRETAR_EVENTOS', 'RECUPERAR_SISTEMA'],
      demonstratedBy: ['Tomo 01 · Capítulo 05 (Frontera de Kernel NT)'],
      verifiedBy: ['Examen Oficial Tomo 01', 'Matriz de Diagnóstico Windows'],
      unlocks: ['Herramienta Auditor de Procesos NT', 'Inyector de Latencia DPC'],
      relations: {
        tomo: '01',
        chapters: ['05'],
        tools: ['win_matrix', 'dpc_lat'],
        exam: 'Examen Tomo 01',
      },
      traceability: {
        whyState:
          statusWin === 'VERIFICADA'
            ? 'Estudiaste el kernel NT en el Capítulo 05 y certificaste el dominio en la evaluación final.'
            : statusWin === 'DEMOSTRADA'
            ? 'Completaste el Capítulo 05 analizando procesos de sistema y capas Ring 0 / Ring 3.'
            : 'Se requiere avanzar en el Tomo 01 hasta el Capítulo 05 (Windows y Kernel).',
        checklist: [
          { id: 'c05', label: 'Capítulo 05: Frontera de Kernel NT', isDone: isC05Done, requiredFor: 'DEMOSTRADA' },
          { id: 'exam', label: 'Examen Tomo 01 Aprobado', isDone: isExamPassed, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC05Done ? 1 : 0) + (isExamPassed && isC05Done ? 1 : 0),
      whatIsMissing:
        statusWin === 'VERIFICADA'
          ? 'Capacidad verificada.'
          : statusWin === 'DEMOSTRADA'
          ? 'Rendir el examen final para verificar conocimiento del Kernel.'
          : 'Completar los capítulos precedentes hasta el Capítulo 05.',
      nextAction:
        statusWin === 'VERIFICADA'
          ? { label: 'ABRIR LAB WINDOWS →', actionKey: 'start_lab' }
          : statusWin === 'DEMOSTRADA'
          ? { label: 'RENDIR EXAMEN →', actionKey: 'take_exam' }
          : { label: 'CONTINUAR CAPÍTULO 05 →', actionKey: 'continue_chapter', targetId: '05' },
    });

    // ------------------------------------------------------------------------
    // 3. ANALIZAR ARRANQUE
    // ------------------------------------------------------------------------
    let statusBoot: SkillStatus = 'NO_OBSERVADA';
    if (isBootLabDone) statusBoot = 'VERIFICADA';
    else if (isC07Done) statusBoot = 'DEMOSTRADA';

    nodes.push({
      id: 'ANALIZAR_ARRANQUE',
      name: 'ANALIZAR ARRANQUE',
      description: 'Medir los 35 estados cronológicos desde el botón Power hasta el bootloader BCD y Windows.',
      status: statusBoot,
      statusLabel: statusBoot === 'VERIFICADA' ? 'VERIFICADA' : statusBoot === 'DEMOSTRADA' ? 'DEMOSTRADA' : 'NO OBSERVADA',
      prerequisites: ['IDENTIFICAR_HARDWARE', 'INTERPRETAR_WINDOWS'],
      supports: ['RECUPERAR_SISTEMA', 'DIAGNOSTICAR_FALLAS'],
      demonstratedBy: ['Tomo 01 · Capítulo 07 (Laboratorio Final)', 'Pipeline Forense de Arranque (Tomo 08)'],
      verifiedBy: ['Comprobación con Multímetro Virtual de Reloj/POST', 'Verificación BCD'],
      unlocks: ['Herramienta Analizador de Secuencia POST'],
      relations: {
        tomo: '08',
        chapters: ['07'],
        labs: ['boot_lab'],
        tools: ['post_analyzer'],
      },
      traceability: {
        whyState:
          statusBoot === 'VERIFICADA'
            ? 'Completaste la secuencia completa en el Laboratorio Forense de Arranque con mediciones reales.'
            : statusBoot === 'DEMOSTRADA'
            ? 'Estudiaste el protocolo de inicio en el Capítulo 07 del Tomo 01.'
            : 'Aún no ejecutaste mediciones en el Laboratorio de Arranque ni completaste el Capítulo 07.',
        checklist: [
          { id: 'c07', label: 'Capítulo 07: Laboratorio Didáctico', isDone: isC07Done, requiredFor: 'DEMOSTRADA' },
          { id: 'boot_lab', label: 'Laboratorio de Arranque (Tomo 08)', isDone: isBootLabDone, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC07Done ? 1 : 0) + (isBootLabDone ? 1 : 0),
      whatIsMissing:
        statusBoot === 'VERIFICADA'
          ? 'Capacidad comprobada en laboratorio.'
          : statusBoot === 'DEMOSTRADA'
          ? 'Ejecutar la práctica interactiva en el Laboratorio de Arranque.'
          : 'Completar el Capítulo 07 o ingresar al Laboratorio de Arranque.',
      nextAction:
        statusBoot === 'VERIFICADA'
          ? { label: 'ABRIR LAB DE ARRANQUE →', actionKey: 'start_lab' }
          : { label: 'INICIAR LAB ARRANQUE →', actionKey: 'start_lab' },
    });

    // ------------------------------------------------------------------------
    // 4. DIAGNOSTICAR RENDIMIENTO
    // ------------------------------------------------------------------------
    let statusPerf: SkillStatus = 'NO_OBSERVADA';
    if (isExamPassed && isC04Done) statusPerf = 'VERIFICADA';
    else if (isC04Done) statusPerf = 'DEMOSTRADA';
    else if (isC03Done) statusPerf = 'EN_DESARROLLO';

    nodes.push({
      id: 'DIAGNOSTICAR_RENDIMIENTO',
      name: 'DIAGNOSTICAR RENDIMIENTO',
      description: 'Medir fluidez real con frametimes y percentiles 1% low en lugar de FPS promedio.',
      status: statusPerf,
      statusLabel: statusPerf === 'VERIFICADA' ? 'VERIFICADA' : statusPerf === 'DEMOSTRADA' ? 'DEMOSTRADA' : statusPerf === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: ['IDENTIFICAR_HARDWARE'],
      supports: ['COMPARAR_CONFIGURACIONES', 'VALIDAR_HIPOTESIS'],
      demonstratedBy: ['Tomo 01 · Capítulo 03 (Telemetría)', 'Tomo 01 · Capítulo 04 (Cuello de Botella)'],
      verifiedBy: ['Prueba A/B en Cámara de Ensayo', 'Examen Oficial Tomo 01'],
      unlocks: ['Herramienta Monitor de Frametimes', 'Calculadora de Bottlenecks'],
      relations: {
        tomo: '01',
        chapters: ['03', '04'],
        tools: ['frametime_monitor'],
        exam: 'Examen Tomo 01',
      },
      traceability: {
        whyState:
          statusPerf === 'VERIFICADA'
            ? 'Aislaste límites operativos en los Capítulos 03 y 04 y aprobaste la prueba pericial.'
            : statusPerf === 'DEMOSTRADA'
            ? 'Analizaste frametimes en el Capítulo 03 y determinaste cuellos de botella en el Capítulo 04.'
            : statusPerf === 'EN_DESARROLLO'
            ? 'Mediste frametimes en el Capítulo 03 pero aún no aislaste el cuello de botella en el Capítulo 04.'
            : 'No registrás lecturas de frametimes ni experimentos de rendimiento.',
        checklist: [
          { id: 'c03', label: 'Capítulo 03: Telemetría y Frametimes', isDone: isC03Done, requiredFor: 'DEMOSTRADA' },
          { id: 'c04', label: 'Capítulo 04: Aislamiento de Bottleneck', isDone: isC04Done, requiredFor: 'DEMOSTRADA' },
          { id: 'exam', label: 'Examen Tomo 01 Aprobado', isDone: isExamPassed, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC03Done ? 1 : 0) + (isC04Done ? 1 : 0) + (isExamPassed && isC04Done ? 1 : 0),
      whatIsMissing:
        statusPerf === 'VERIFICADA'
          ? 'Capacidad plenamente acreditada.'
          : statusPerf === 'DEMOSTRADA'
          ? 'Aprobar la evaluación final para verificar la capacidad.'
          : statusPerf === 'EN_DESARROLLO'
          ? 'Completar el Capítulo 04 para aislar el cuello de botella.'
          : 'Ingresar al Capítulo 03.',
      nextAction:
        statusPerf === 'VERIFICADA'
          ? { label: 'USAR CÁMARA A/B →', actionKey: 'start_lab' }
          : statusPerf === 'DEMOSTRADA'
          ? { label: 'RENDIR EXAMEN →', actionKey: 'take_exam' }
          : statusPerf === 'EN_DESARROLLO'
          ? { label: 'CONTINUAR CAPÍTULO 04 →', actionKey: 'continue_chapter', targetId: '04' }
          : { label: 'INICIAR CAPÍTULO 03 →', actionKey: 'continue_chapter', targetId: '03' },
    });

    // ------------------------------------------------------------------------
    // 5. INTERPRETAR EVENTOS
    // ------------------------------------------------------------------------
    let statusEvt: SkillStatus = 'NO_OBSERVADA';
    if (hasResolvedCase || isWinRepairDone) statusEvt = 'VERIFICADA';
    else if (isC05Done) statusEvt = 'EN_DESARROLLO';

    nodes.push({
      id: 'INTERPRETAR_EVENTOS',
      name: 'INTERPRETAR EVENTOS',
      description: 'Inspeccionar el Visor de Eventos, Event ID, registros CBS.log, Minidump y códigos BSOD.',
      status: statusEvt,
      statusLabel: statusEvt === 'VERIFICADA' ? 'VERIFICADA' : statusEvt === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: ['INTERPRETAR_WINDOWS'],
      supports: ['RECUPERAR_SISTEMA', 'DOCUMENTAR_EVIDENCIA'],
      demonstratedBy: ['Taller de Diagnóstico', 'Laboratorio de Reparaciones'],
      verifiedBy: ['Expediente Pericial Resuelto en Central de Incidentes'],
      unlocks: ['Herramienta Auditor de Eventos y Minidumps'],
      relations: {
        chapters: ['05', '06'],
        cases: ['casos_incidentes'],
        tools: ['event_viewer'],
      },
      traceability: {
        whyState:
          statusEvt === 'VERIFICADA'
            ? 'Resolviste y cerraste expedientes periciales interpretando registros de eventos y minidumps.'
            : statusEvt === 'EN_DESARROLLO'
            ? 'Conocés la estructura de servicios de Windows (Capítulo 05) pero aún no auditaste casos reales.'
            : 'Aún no registrás resolución de incidentes ni análisis de logs de sistema.',
        checklist: [
          { id: 'c05', label: 'Capítulo 05: Kernel NT', isDone: isC05Done, requiredFor: 'DEMOSTRADA' },
          { id: 'case', label: 'Caso Resuelto en Central de Incidentes', isDone: hasResolvedCase, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC05Done ? 1 : 0) + (hasResolvedCase ? 1 : 0),
      whatIsMissing:
        statusEvt === 'VERIFICADA'
          ? 'Capacidad acreditada con expediente.'
          : statusEvt === 'EN_DESARROLLO'
          ? 'Resolver al menos 1 expediente en el Taller de Casos.'
          : 'Completar Capítulo 05 y abrir un expediente de diagnóstico.',
      nextAction:
        statusEvt === 'VERIFICADA'
          ? { label: 'IR A CENTRAL DE CASOS →', actionKey: 'open_cases' }
          : { label: 'RESOLVER CASO →', actionKey: 'open_cases' },
    });

    // ------------------------------------------------------------------------
    // 6. DOCUMENTAR EVIDENCIA
    // ------------------------------------------------------------------------
    let statusDoc: SkillStatus = 'NO_OBSERVADA';
    if (hasResolvedCase) statusDoc = 'VERIFICADA';
    else if (isC06Done) statusDoc = 'EN_DESARROLLO';

    nodes.push({
      id: 'DOCUMENTAR_EVIDENCIA',
      name: 'DOCUMENTAR EVIDENCIA',
      description: 'Registrar diagnósticos objetivos con informe de procedencia de datos e hipótesis pericial sustentada.',
      status: statusDoc,
      statusLabel: statusDoc === 'VERIFICADA' ? 'VERIFICADA' : statusDoc === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: [],
      supports: ['VALIDAR_HIPOTESIS'],
      demonstratedBy: ['Taller de Diagnóstico (Capítulo 06)', 'Central de Incidentes'],
      verifiedBy: ['Dictamen y Expediente Cerrado con Procedencia'],
      unlocks: ['Pasaporte Pericial Oficial'],
      relations: {
        chapters: ['06'],
        cases: ['casos_incidentes'],
        tools: ['evidence_logger'],
      },
      traceability: {
        whyState:
          statusDoc === 'VERIFICADA'
            ? `Registraste e integraste dictámenes de evidencia en ${resolvedCases.length} caso(s) cerrado(s).`
            : statusDoc === 'EN_DESARROLLO'
            ? 'Completaste el árbol de descarte en el Capítulo 06 pero no cerraste un expediente formal.'
            : 'No registrás dictámenes ni expedientes técnicos firmados.',
        checklist: [
          { id: 'c06', label: 'Capítulo 06: Árbol de Descarte', isDone: isC06Done, requiredFor: 'DEMOSTRADA' },
          { id: 'case_closed', label: 'Expediente Formal Cerrado', isDone: hasResolvedCase, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC06Done ? 1 : 0) + (hasResolvedCase ? 1 : 0),
      whatIsMissing:
        statusDoc === 'VERIFICADA'
          ? 'Capacidad plenamente acreditada.'
          : statusDoc === 'EN_DESARROLLO'
          ? 'Cerrar un expediente en el Taller de Casos.'
          : 'Completar el Capítulo 06 o abrir un caso.',
      nextAction:
        statusDoc === 'VERIFICADA'
          ? { label: 'VER EXPEDIENTES →', actionKey: 'open_cases' }
          : { label: 'ABRIR CASO DE PRUEBA →', actionKey: 'open_cases' },
    });

    // ------------------------------------------------------------------------
    // 7. VALIDAR HIPÓTESIS
    // ------------------------------------------------------------------------
    let statusHyp: SkillStatus = 'NO_OBSERVADA';
    if (isExamPassed) statusHyp = 'VERIFICADA';
    else if (isC07Done) statusHyp = 'DEMOSTRADA';
    else if (isC01Done) statusHyp = 'EN_DESARROLLO';

    nodes.push({
      id: 'VALIDAR_HIPOTESIS',
      name: 'VALIDAR HIPÓTESIS',
      description: 'Demostrar dominio metrológico y teórico aprobando evaluaciones oficiales y pruebas de laboratorio.',
      status: statusHyp,
      statusLabel: statusHyp === 'VERIFICADA' ? 'VERIFICADA' : statusHyp === 'DEMOSTRADA' ? 'DEMOSTRADA' : statusHyp === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: ['IDENTIFICAR_HARDWARE', 'DIAGNOSTICAR_RENDIMIENTO'],
      supports: ['Acreditación Pericial EVO'],
      demonstratedBy: ['Puntos de Verificación Didácticos', 'Capítulo 07'],
      verifiedBy: ['Examen Final Tomo 01 (≥70%)'],
      unlocks: ['Acreditación de Tomo Aprobado'],
      relations: {
        tomo: '01',
        exam: 'Examen Tomo 01',
      },
      traceability: {
        whyState:
          statusHyp === 'VERIFICADA'
            ? 'Aprobaste la evaluación final oficial con puntaje ≥70% respaldado por el sistema.'
            : statusHyp === 'DEMOSTRADA'
            ? 'Completaste los 7 capítulos didácticos respondiendo puntos de verificación.'
            : statusHyp === 'EN_DESARROLLO'
            ? 'Iniciaste comprobaciones didácticas en el Tomo 01.'
            : 'No registrás comprobaciones teóricas aprobadas.',
        checklist: [
          { id: 'c01_07', label: 'Capítulos 01 al 07 Didácticos', isDone: isC07Done, requiredFor: 'DEMOSTRADA' },
          { id: 'exam_official', label: 'Examen Final Oficial Aprobado', isDone: isExamPassed, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isC07Done ? 1 : 0) + (isExamPassed ? 1 : 0),
      whatIsMissing:
        statusHyp === 'VERIFICADA'
          ? 'Capacidad verificada.'
          : statusHyp === 'DEMOSTRADA'
          ? 'Rendir el examen final del Tomo 01.'
          : 'Completar capítulos didácticos.',
      nextAction:
        statusHyp === 'VERIFICADA'
          ? { label: 'VER CERTIFICACIÓN →', actionKey: 'view_dossier' }
          : statusHyp === 'DEMOSTRADA'
          ? { label: 'RENDIR EXAMEN →', actionKey: 'take_exam' }
          : { label: 'CONTINUAR LECCIÓN →', actionKey: 'start_tomo01' },
    });

    // ------------------------------------------------------------------------
    // 8. COMPARAR CONFIGURACIONES
    // ------------------------------------------------------------------------
    let statusCfg: SkillStatus = 'NO_OBSERVADA';
    if (isC03Done && isC04Done) statusCfg = 'DEMOSTRADA';
    else if (isC03Done) statusCfg = 'EN_DESARROLLO';

    nodes.push({
      id: 'COMPARAR_CONFIGURACIONES',
      name: 'COMPARAR CONFIGURACIONES',
      description: 'Realizar pruebas A/B diferenciales controlando una sola variable para aislar cambios de rendimiento.',
      status: statusCfg,
      statusLabel: statusCfg === 'DEMOSTRADA' ? 'DEMOSTRADA' : statusCfg === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: ['DIAGNOSTICAR_RENDIMIENTO'],
      supports: ['DIAGNOSTICAR_RENDIMIENTO'],
      demonstratedBy: ['Capítulo 03 & 04 (Experimentos A/B)'],
      verifiedBy: ['Cámara de Ensayo A/B'],
      unlocks: ['Herramienta Cámara de Ensayo A/B'],
      relations: {
        chapters: ['03', '04'],
        tools: ['ab_chamber'],
      },
      traceability: {
        whyState:
          statusCfg === 'DEMOSTRADA'
            ? 'Ejecutaste mediciones comparativas en los capítulos de telemetría y experimentos A/B.'
            : statusCfg === 'EN_DESARROLLO'
            ? 'Iniciaste capturas de telemetría en el Capítulo 03.'
            : 'No registrás ensayos comparativos con control de variables.',
        checklist: [
          { id: 'c03_ab', label: 'Capítulo 03: Telemetría', isDone: isC03Done, requiredFor: 'DEMOSTRADA' },
          { id: 'c04_ab', label: 'Capítulo 04: Experimento A/B', isDone: isC04Done, requiredFor: 'DEMOSTRADA' },
        ],
      },
      associatedEvidencesCount: (isC03Done ? 1 : 0) + (isC04Done ? 1 : 0),
      whatIsMissing:
        statusCfg === 'DEMOSTRADA'
          ? 'Registrar informe en la Cámara A/B para verificación.'
          : 'Completar los experimentos del Capítulo 03 y 04.',
      nextAction: { label: 'ABRIR CÁMARA A/B →', actionKey: 'start_lab' },
    });

    // ------------------------------------------------------------------------
    // 9. RECUPERAR UN SISTEMA
    // ------------------------------------------------------------------------
    let statusRec: SkillStatus = 'NO_OBSERVADA';
    if (isWinRepairDone) statusRec = 'VERIFICADA';
    else if (isBootLabDone) statusRec = 'DEMOSTRADA';

    nodes.push({
      id: 'RECUPERAR_SISTEMA',
      name: 'RECUPERAR UN SISTEMA',
      description: 'Reparar almacén de componentes BCD, Sfc/Dism, WinRE y reconstruir perfil dañado.',
      status: statusRec,
      statusLabel: statusRec === 'VERIFICADA' ? 'VERIFICADA' : statusRec === 'DEMOSTRADA' ? 'DEMOSTRADA' : 'NO OBSERVADA',
      prerequisites: ['INTERPRETAR_WINDOWS', 'ANALIZAR_ARRANQUE'],
      supports: ['Mantenimiento Pericial Avanzado'],
      demonstratedBy: ['Taller de Reparación de Windows (WinRE)'],
      verifiedBy: ['Restauración de Sistema en Entorno de Fallas'],
      unlocks: ['Reconstructor de BCD / WinRE'],
      relations: {
        labs: ['win_repair_lab'],
        tools: ['winre_rebuilder'],
      },
      traceability: {
        whyState:
          statusRec === 'VERIFICADA'
            ? 'Diagnosticaste y recuperaste exitosamente un sistema con fallas críticas de inicio o registro.'
            : statusRec === 'DEMOSTRADA'
            ? 'Inyectaste y analizaste fallas de inicio en el Laboratorio de Arranque.'
            : 'No registrás reparaciones ni diagnósticos de WinRE completados.',
        checklist: [
          { id: 'boot_lab_rec', label: 'Laboratorio de Arranque', isDone: isBootLabDone, requiredFor: 'DEMOSTRADA' },
          { id: 'repair_lab', label: 'Taller de Reparación de Windows', isDone: isWinRepairDone, requiredFor: 'VERIFICADA' },
        ],
      },
      associatedEvidencesCount: (isBootLabDone ? 1 : 0) + (isWinRepairDone ? 1 : 0),
      whatIsMissing:
        statusRec === 'VERIFICADA'
          ? 'Capacidad verificada.'
          : 'Ejecutar una reparación completa en el Laboratorio de Windows.',
      nextAction: { label: 'IR A LAB DE REPARACIÓN →', actionKey: 'start_lab' },
    });

    // ------------------------------------------------------------------------
    // 10. ANALIZAR RED
    // ------------------------------------------------------------------------
    let statusNet: SkillStatus = 'NO_OBSERVADA';
    if (isC02Done) statusNet = 'EN_DESARROLLO';

    nodes.push({
      id: 'ANALIZAR_RED',
      name: 'ANALIZAR RED',
      description: 'Inspeccionar latencia de red, NCSI, sockets activos y adaptador Get-NetAdapter.',
      status: statusNet,
      statusLabel: statusNet === 'EN_DESARROLLO' ? 'EN DESARROLLO' : 'NO OBSERVADA',
      prerequisites: ['INTERPRETAR_WINDOWS'],
      supports: ['Diagnóstico de Conectividad'],
      demonstratedBy: ['Auditoría de Interfaces WMI'],
      verifiedBy: ['Diagnóstico NCSI / Sockets en Laboratorio'],
      unlocks: ['Herramienta Monitor de Interfaces Network'],
      relations: {
        tools: ['network_monitor'],
      },
      traceability: {
        whyState:
          statusNet === 'EN_DESARROLLO'
            ? 'Auditaste interfaces de red mediante WMI en el Pasaporte de PC.'
            : 'No registrás auditorías de adaptadores de red o sockets.',
        checklist: [
          { id: 'net_wmi', label: 'Pasaporte WMI de Adaptador', isDone: isC02Done, requiredFor: 'EN_DESARROLLO' },
        ],
      },
      associatedEvidencesCount: isC02Done ? 1 : 0,
      whatIsMissing: 'Completar el Pasaporte de PC e inspeccionar adaptadores.',
      nextAction: { label: 'VER PASAPORTE RED →', actionKey: 'view_dossier' },
    });

    const demonstratedCount = nodes.filter((n) => n.status === 'DEMOSTRADA').length;
    const verifiedCount = nodes.filter((n) => n.status === 'VERIFICADA').length;
    const inDevelopmentCount = nodes.filter((n) => n.status === 'EN_DESARROLLO').length;
    const unobservedCount = nodes.filter((n) => n.status === 'NO_OBSERVADA').length;

    return {
      nodes,
      totalSkillsCount: nodes.length,
      demonstratedCount,
      verifiedCount,
      inDevelopmentCount,
      unobservedCount,
    };
  }
}
