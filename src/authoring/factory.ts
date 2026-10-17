// ============================================================================
// EVO LABS // CONTENT FACTORY (FASE 07)
// Central registry, builder methods, and validation runner for all educational
// and technical content across Tomos, Labs, Cases, and Skills.
// ============================================================================

import {
  AuthoringRegistry,
  TomoSchema,
  ChapterSchema,
  LabSchema,
  CaseSchema,
  SkillSchema,
  CheckSchema,
  EvidenceSchema,
} from './schema';
import { ContentValidator, ValidationReport } from './validator';

export class EvoContentFactory {
  private static registry: AuthoringRegistry = {
    tomos: [
      {
        id: 'tomo-01',
        tomoNumber: '01',
        title: 'Conocé tu PC: Arquitectura y Silicio',
        subtitle: 'De la física de semiconductores a la telemetría empírica de hardware.',
        description: 'Compendio fundacional sobre silicio, zócalos, IMC, memorias DDR y flujo de datos.',
        coverTheme: 'emerald',
        estimatedHours: 12,
        prerequisiteTomoIds: [],
        targetSkills: ['IDENTIFICAR_HARDWARE', 'MEDIR_RENDIMIENTO', 'ANALIZAR_ARRANQUE'],
        chapters: [],
        labs: [],
        cases: [],
        version: '1.2.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'tomo-02',
        tomoNumber: '02',
        title: 'La Biblia Negra de Windows: Kernel NT y Servicios',
        subtitle: 'Frontera de Ring 0 vs Ring 3, arquitectura de hilos y depuración de DPC.',
        description: 'Exploración profunda del subsistema de Windows, interrupciones ISR y servicios críticos.',
        coverTheme: 'purple',
        estimatedHours: 16,
        prerequisiteTomoIds: ['tomo-01'],
        targetSkills: ['INTERPRETAR_WINDOWS', 'ANALIZAR_KERNEL_NT', 'MEDIR_DPC_LATENCY'],
        chapters: [],
        labs: [],
        cases: [],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'tomo-03',
        tomoNumber: '03',
        title: 'Manual de Fallas: Diagnóstico de Silicio y Señales',
        subtitle: 'Secuencia POST, multímetro digital, rieles de voltaje y descarte metrológico.',
        description: 'Guía de laboratorio para diagnosticar placas madre, fuentes de poder y GPU.',
        coverTheme: 'amber',
        estimatedHours: 18,
        prerequisiteTomoIds: ['tomo-01'],
        targetSkills: ['DIAGNOSTICAR_ARRANQUE', 'MEDICION_MULTIMETRO'],
        chapters: [],
        labs: [],
        cases: [],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'REVIEW',
      },
      {
        id: 'tomo-04',
        tomoNumber: '04',
        title: 'Ingeniería de Rendimiento: Frametimes y Latencia',
        subtitle: 'PresentMon, variabilidad entre fotogramas y micro-stuttering bajo carga.',
        description: 'Metrología aplicada a videojuegos, pipelines de renderizado y tiempos de cuadro.',
        coverTheme: 'cyan',
        estimatedHours: 14,
        prerequisiteTomoIds: ['tomo-01', 'tomo-02'],
        targetSkills: ['MEDIR_RENDIMIENTO', 'ANALISIS_FRAMETIMES'],
        chapters: [],
        labs: [],
        cases: [],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'REVIEW',
      },
    ],
    chapters: [
      {
        id: 't01-c01',
        tomoId: 'tomo-01',
        chapterNumber: 1,
        title: 'Anatomía del Silicio y la Placa Madre',
        subtitle: 'Fundamentos de CPU, zócalos, VRM y chipset.',
        type: 'EDITORIAL',
        sections: [
          {
            id: 't01-c01-s01',
            title: '1. El Procesador y el Zócalo (LGA vs PGA)',
            layout: 'NARRATIVE',
            contentText: 'El zócalo no es solo un soporte mecánico: define el bus de interconexión eléctrica directa entre los pines de la CPU y las pistas de cobre de la placa madre.',
            technicalCallout: {
              type: 'KEY_CONCEPT',
              title: 'Diferencia Metrológica LGA vs PGA',
              text: 'En LGA los pines flexibles están en el zócalo de la placa madre; en PGA los pines están en el encapsulado del procesador.',
            },
          },
          {
            id: 't01-c01-s02',
            title: '2. Módulo Regulador de Voltaje (VRM)',
            layout: 'CODE_TERMINAL',
            contentText: 'Los MOSFETs y fases de poder convierten los 12V de la fuente de poder en ~1.2V altamente estables requeridos por el silicio.',
            codeSnippet: {
              language: 'powershell',
              code: 'Get-CimInstance Win32_Processor | Select-Object Name, CurrentClockSpeed, MaxClockSpeed, VoltageCaps',
              caption: 'Consulta WMI de voltaje y frecuencia de CPU',
            },
          },
        ],
        readingTimeMin: 12,
        checkpoints: [
          {
            id: 'chk-t01-c01-01',
            label: 'Comprobación de Zócalos y Pines',
            question: '¿Por qué un pin doblado en un zócalo LGA puede causar pérdida de canales de memoria RAM?',
            checkType: 'KNOWLEDGE_CHECK',
            options: [
              {
                id: 'opt-1',
                text: 'Porque las pistas del IMC (Controlador Integrado de Memoria) van directo del zócalo a las ranuras DIMM sin intermediarios.',
                isCorrect: true,
                feedbackText: 'Correcto. El IMC reside directamente en el silicio de la CPU y se conecta vía pistas dedicadas.',
              },
              {
                id: 'opt-2',
                text: 'Porque el chipset se encarga de redireccionar toda la memoria RAM.',
                isCorrect: false,
                feedbackText: 'Incorrecto. En arquitecturas modernas el controlador de RAM está en la CPU, no en el chipset.',
              },
            ],
            explanation: 'Las pistas del IMC viajan directamente a los slots DIMM. Un pin de datos o tierra desconectado anula el canal.',
            failureFeedback: 'Revisa la topología de conexión del IMC en el procesador.',
            weight: 8,
            targetSkillId: 'IDENTIFICAR_HARDWARE',
            version: '1.0.0',
            updatedAt: '2026-10-04T00:00:00.000Z',
            status: 'STABLE',
          },
        ],
        targetSkills: ['IDENTIFICAR_HARDWARE'],
        evidenceGenerated: [
          {
            id: 'ev-fact-c01',
            sourceId: 't01-c01',
            sourceType: 'CHAPTER',
            skillId: 'IDENTIFICAR_HARDWARE',
            title: 'Dominio de Arquitectura de Zócalos e IMC',
            description: 'Comprensión verificada de la conexión eléctrica directa entre CPU y canales de memoria.',
            provenance: 'MEASURED',
            expectedArtifacts: ['Checkpoint de Zócalos Superado'],
            whyExplanation: 'Superaste la comprobación técnica de topología de silicio.',
            version: '1.0.0',
            updatedAt: '2026-10-04T00:00:00.000Z',
            status: 'STABLE',
          },
        ],
        version: '1.2.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
    ],
    labs: [
      {
        id: 'lab-boot-reference',
        tomoId: 'tomo-01',
        title: 'Laboratorio de Secuencia POST y Arranque',
        objective: 'Comprobar el flujo ordenado de inicialización desde EPS 12V hasta entrega a UEFI.',
        labType: 'STEP_BY_STEP',
        difficulty: 'INTERMEDIO',
        steps: [
          {
            id: 'step-01',
            stepNumber: 1,
            title: 'Verificación de Entrada de Alimentación 24 Pines',
            instruction: 'Medir la línea de 5VSB (Standby) con multímetro digital.',
            targetComponent: 'PSU / Conector 24 pines',
            expectedOutcome: '5.05V estables en el pin 9 (Cable Púrpura).',
            provenance: 'MEASURED',
          },
          {
            id: 'step-02',
            stepNumber: 2,
            title: 'Puenteado de Power Switch y Activación de PS_ON#',
            instruction: 'Cerrar el circuito de encendido y auditar señal PWR_OK.',
            targetComponent: 'Header Panel Frontal',
            expectedOutcome: 'Señal PWR_OK a 5V en menos de 500ms.',
            provenance: 'MEASURED',
          },
        ],
        validationCriteria: [
          '5VSB dentro del rango 4.75V - 5.25V',
          'PWR_OK activo antes de soltar la línea RESET#',
        ],
        toolsRequired: ['Multímetro Digital', 'Tester de Fuentes', 'Sonda Lógica'],
        initialSystemState: { powerState: 'STANDBY', vCoreVolt: 0, postCode: '00' },
        evidenceGenerated: [
          {
            id: 'ev-lab-post',
            sourceId: 'lab-boot-reference',
            sourceType: 'LAB',
            skillId: 'DIAGNOSTICAR_ARRANQUE',
            title: 'Certificación de Medición de Secuencia POST',
            description: 'Validación práctica de voltajes de rieles principales de placa madre.',
            provenance: 'MEASURED',
            expectedArtifacts: ['Reporte Metrológico de Arranque'],
            whyExplanation: 'Mediste directamente con instrumental los tiempos de estabilización eléctrica.',
            version: '1.0.0',
            updatedAt: '2026-10-04T00:00:00.000Z',
            status: 'STABLE',
          },
        ],
        version: '1.1.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
    ],
    cases: [
      {
        id: 'case-ref-01',
        title: 'PC Enciende pero Windows no Arranca (0xc0000098)',
        difficulty: 'INTERMEDIO',
        scenario: 'El equipo completa el POST pero entra en bucle de recuperación automática con error BCD.',
        symptoms: [
          'LEDs de placa madre encienden normalmente.',
          'Pantalla azul con código de error 0xc0000098.',
          'Archivo mencionado: \\Boot\\BCD.',
        ],
        context: 'Ocurrió tras un corte de suministro eléctrico durante una actualización de Windows.',
        availableEvidence: [
          {
            id: 'ev-bcd-01',
            label: 'Consulta de Almacén BCD con bcdedit',
            category: 'WinRE Terminal',
            value: 'Error al abrir el almacén de datos de la configuración de arranque: Archivo corrupto',
            provenance: 'SYSTEM_REPORTED',
          },
          {
            id: 'ev-smart-01',
            label: 'Auditoría SMART de Unidad NVMe',
            category: 'Storage Health',
            value: 'Salud 100% | 0 Sectores Reubicados | Temperatura 42°C',
            provenance: 'MEASURED',
          },
        ],
        possibleActions: [
          {
            id: 'act-smart',
            label: 'Auditar Estado SMART del SSD',
            toolRequired: 'CrystalDiskInfo / SMART CLI',
            unlockedEvidenceId: 'ev-smart-01',
          },
          {
            id: 'act-bcd',
            label: 'Ejecutar bcdedit /enum en WinRE',
            toolRequired: 'Consola WinRE',
            unlockedEvidenceId: 'ev-bcd-01',
          },
        ],
        hypotheses: [
          {
            id: 'hyp-ssd-dead',
            title: 'Falla Física de Almacenamiento SSD',
            description: 'El SSD sufrió daño irreversible en sus celdas NAND.',
            isCorrectCause: false,
            refutationExplanation: 'La lectura SMART muestra 100% de salud y cero sectores defectuosos.',
            supportingEvidenceIds: [],
          },
          {
            id: 'hyp-bcd-corrupt',
            title: 'Corrupción Lógica del Almacén BCD',
            description: 'El archivo \\Boot\\BCD se truncó por corte de energía.',
            isCorrectCause: true,
            refutationExplanation: '',
            supportingEvidenceIds: ['ev-bcd-01'],
          },
        ],
        resolutionDiagnosis: {
          rootCause: 'Corrupción del BCD Store provocada por apagado abrupto en escritura de actualización.',
          technicalJustification: 'La auditoría SMART descarta daño físico en el SSD; la consola WinRE confirma que el almacén BCD no puede ser interpretado.',
          remediationGuide: 'Ejecutar bootrec /rebuildbcd o reconstruir la partición EFI con bcdboot C:\\Windows.',
        },
        demonstratedSkills: ['DIAGNOSTICAR_ARRANQUE', 'INTERPRETAR_WINDOWS'],
        evidenceGenerated: [
          {
            id: 'ev-case-bcd',
            sourceId: 'case-ref-01',
            sourceType: 'CASE',
            skillId: 'DIAGNOSTICAR_ARRANQUE',
            title: 'Resolución Pericial de BCD Corrupto',
            description: 'Aislamiento y descarte certero sin formateo destructivo.',
            provenance: 'MEASURED',
            expectedArtifacts: ['Expediente Pericial Cerrado'],
            whyExplanation: 'Demostraste capacidad de descarte entre falla física y lógica.',
            version: '1.0.0',
            updatedAt: '2026-10-04T00:00:00.000Z',
            status: 'STABLE',
          },
        ],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
    ],
    skills: [
      {
        id: 'IDENTIFICAR_HARDWARE',
        name: 'Identificar Silicio y Arquitectura',
        domain: 'HARDWARE',
        description: 'Capacidad de reconocer componentes, topología de memoria, zócalos y buses PCIe.',
        prerequisites: [],
        supports: ['MEDIR_RENDIMIENTO', 'DIAGNOSTICAR_ARRANQUE'],
        unlocks: ['Pasaporte de Hardware WMI'],
        demonstratedBy: ['t01-c01', 't01-c02'],
        verifiedBy: ['EXAM-TOMO-01'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'MEDIR_RENDIMIENTO',
        name: 'Medir Rendimiento y Frametimes',
        domain: 'RENDIMIENTO',
        description: 'Capacidad de medir percentiles 1% low, latencias DPC y variabilidad de renderizado.',
        prerequisites: ['IDENTIFICAR_HARDWARE'],
        supports: ['ANALISIS_FRAMETIMES'],
        unlocks: ['Banco de Telemetría PresentMon'],
        demonstratedBy: ['t01-c03', 't01-c04'],
        verifiedBy: ['EXAM-TOMO-01'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'DIAGNOSTICAR_ARRANQUE',
        name: 'Diagnosticar Secuencia POST y Arranque',
        domain: 'DIAGNOSTICO',
        description: 'Capacidad de aislar fallas de inicialización eléctrica y lógica en placa madre.',
        prerequisites: ['IDENTIFICAR_HARDWARE'],
        supports: ['REPARAR_WINDOWS'],
        unlocks: ['Laboratorio de Multímetro Digital'],
        demonstratedBy: ['lab-boot-reference', 'case-ref-01'],
        verifiedBy: ['EXAM-TOMO-01'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'INTERPRETAR_WINDOWS',
        name: 'Interpretar Kernel NT y Servicios',
        domain: 'WINDOWS',
        description: 'Capacidad de auditar servicios, llamadas de sistema Ring 0 y controladores.',
        prerequisites: ['IDENTIFICAR_HARDWARE'],
        supports: ['ANALIZAR_KERNEL_NT'],
        unlocks: ['Consola WinRE y Matriz de Fallas'],
        demonstratedBy: ['t01-c05', 't01-c06'],
        verifiedBy: ['EXAM-TOMO-01'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'ANALIZAR_KERNEL_NT',
        name: 'Analizar Kernel NT y DPC Latency',
        domain: 'WINDOWS',
        description: 'Auditoría de ISR, Deferred Procedure Calls y depuración de controladores.',
        prerequisites: ['INTERPRETAR_WINDOWS'],
        supports: [],
        unlocks: ['Herramienta LatencyMon'],
        demonstratedBy: ['tomo-02'],
        verifiedBy: ['EXAM-TOMO-02'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'ANALISIS_FRAMETIMES',
        name: 'Análisis Pericial de Tiempos de Cuadro',
        domain: 'RENDIMIENTO',
        description: 'Diagnóstico avanzado de micro-stuttering y cuellos de botella en GPU/CPU.',
        prerequisites: ['MEDIR_RENDIMIENTO'],
        supports: [],
        unlocks: ['Suite de Benchmark'],
        demonstratedBy: ['tomo-04'],
        verifiedBy: ['EXAM-TOMO-04'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'REVIEW',
      },
      {
        id: 'MEDICION_MULTIMETRO',
        name: 'Medición de Rieles con Multímetro',
        domain: 'HARDWARE',
        description: 'Uso de multímetro en rangos de voltaje DC, continuidad y resistencia.',
        prerequisites: ['DIAGNOSTICAR_ARRANQUE'],
        supports: [],
        unlocks: ['Simulador de Multímetro'],
        demonstratedBy: ['tomo-03'],
        verifiedBy: ['EXAM-TOMO-03'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'REVIEW',
      },
      {
        id: 'MEDIR_DPC_LATENCY',
        name: 'Medir Latencias DPC e ISR',
        domain: 'RENDIMIENTO',
        description: 'Detección de controladores que bloquean el pipeline de renderizado en tiempo real.',
        prerequisites: ['INTERPRETAR_WINDOWS'],
        supports: [],
        unlocks: ['Auditor DPC en Tiempo Real'],
        demonstratedBy: ['tomo-02'],
        verifiedBy: ['EXAM-TOMO-02'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
      {
        id: 'REPARAR_WINDOWS',
        name: 'Reparar Fallas de Inicio de Windows',
        domain: 'WINDOWS',
        description: 'Reconstrucción de almacenes BCD, particiones EFI y reparación de arranque WinRE.',
        prerequisites: ['INTERPRETAR_WINDOWS'],
        supports: [],
        unlocks: ['Taller de WinRE'],
        demonstratedBy: ['case-ref-01'],
        verifiedBy: ['EXAM-TOMO-01'],
        version: '1.0.0',
        updatedAt: '2026-10-04T00:00:00.000Z',
        status: 'STABLE',
      },
    ],
    checks: [],
    evidences: [],
  };

  /**
   * Retrieves the current registered content
   */
  static getRegistry(): AuthoringRegistry {
    return this.registry;
  }

  /**
   * Validates all content registered in the factory
   */
  static validateAll(): ValidationReport {
    return ContentValidator.validateRegistry(this.registry);
  }

  /**
   * Registers a new Tomo
   */
  static registerTomo(tomo: TomoSchema): void {
    const idx = this.registry.tomos.findIndex((t) => t.id === tomo.id);
    if (idx >= 0) {
      this.registry.tomos[idx] = tomo;
    } else {
      this.registry.tomos.push(tomo);
    }
  }

  /**
   * Registers a new Chapter
   */
  static registerChapter(chapter: ChapterSchema): void {
    const idx = this.registry.chapters.findIndex((c) => c.id === chapter.id);
    if (idx >= 0) {
      this.registry.chapters[idx] = chapter;
    } else {
      this.registry.chapters.push(chapter);
    }
  }

  /**
   * Registers a new Lab
   */
  static registerLab(lab: LabSchema): void {
    const idx = this.registry.labs.findIndex((l) => l.id === lab.id);
    if (idx >= 0) {
      this.registry.labs[idx] = lab;
    } else {
      this.registry.labs.push(lab);
    }
  }

  /**
   * Registers a new Case
   */
  static registerCase(caseObj: CaseSchema): void {
    const idx = this.registry.cases.findIndex((c) => c.id === caseObj.id);
    if (idx >= 0) {
      this.registry.cases[idx] = caseObj;
    } else {
      this.registry.cases.push(caseObj);
    }
  }

  /**
   * Registers a new Skill
   */
  static registerSkill(skill: SkillSchema): void {
    const idx = this.registry.skills.findIndex((s) => s.id === skill.id);
    if (idx >= 0) {
      this.registry.skills[idx] = skill;
    } else {
      this.registry.skills.push(skill);
    }
  }
}
