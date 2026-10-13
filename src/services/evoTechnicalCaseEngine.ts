// ============================================================================
// EVO LABS // TECHNICAL CASE ENGINE (FASE 03)
// Investigative technical cases with hypothesis testing, progressive evidence,
// consequence feedback, and pericial closing report.
// ============================================================================

import { EvoCaseRepository } from '../components/evoLabCore/services/caseRepository';
import { EvoCase } from '../components/evoLabCore/types';

export type CaseDifficulty = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO' | 'PERICIAL';

export type ProgressiveEvidenceCategory =
  | 'EVENTO'
  | 'SMART'
  | 'BOOT_LOG'
  | 'SERVICIO'
  | 'DRIVER'
  | 'ESTADO_DISCO'
  | 'REGISTRO_WMI';

export interface ProgressiveEvidenceItem {
  id: string;
  category: ProgressiveEvidenceCategory;
  title: string;
  shortSnippet: string;
  detailedData: string;
  provenance: 'SYSTEM_REPORTED' | 'MEASURED' | 'SIMULATED' | 'VERIFIED';
  unlockedByActionId: string;
  isUnlocked: boolean;
  unlockedAtTimestamp?: string;
}

export interface CaseInvestigationAction {
  id: string;
  label: string;
  description: string;
  category: 'AUDITORÍA_DISCO' | 'ANÁLISIS_LOGS' | 'INSPECCIÓN_ARRANQUE' | 'AUDITORÍA_HARDWARE' | 'REVISIÓN_DRIVERS';
  costMinutes: number;
  unlocksEvidenceId: string;
  isExecuted: boolean;
}

export interface CaseHypothesisOption {
  id: string;
  title: string;
  category: 'FUENTE' | 'ALMACENAMIENTO' | 'BCD' | 'DRIVER' | 'HARDWARE' | 'SISTEMA';
  description: string;
  isCorrect: boolean;
  explanationIfIncorrect: string;
  explanationIfCorrect: string;
  requiredEvidenceIds: string[];
}

export interface CasePericialDiagnosis {
  diagnosisTitle: string;
  conclusionNotes: string;
  technicalJustification: string;
  remediationStepsExecuted: string[];
  demonstratedSkills: string[];
  artifactsGenerated: string[];
  resolvedAtISO: string;
}

export interface TechnicalCaseDefinition {
  id: string;
  title: string;
  difficulty: CaseDifficulty;
  scenario: string;
  symptoms: string[];
  context: string;
  availableEvidence: ProgressiveEvidenceItem[];
  possibleActions: CaseInvestigationAction[];
  hypotheses: CaseHypothesisOption[];
  systemState: 'INITIAL_ANOMALY' | 'INVESTIGATING' | 'HYPOTHESIS_TESTING' | 'RESOLVED' | 'FAILED';
  selectedHypothesisId?: string;
  hypothesisFeedback?: string;
  diagnosis?: CasePericialDiagnosis;
  skills: string[];
}

export class EvoTechnicalCaseEngine {
  /**
   * Reference Case REF-01: "PC ENCIENDE PERO WINDOWS NO ARRANCA"
   */
  public static getReferenceCase(): TechnicalCaseDefinition {
    return {
      id: 'case-ref-01',
      title: 'CASO REF-01: PC ENCIENDE PERO WINDOWS NO ARRANCA',
      difficulty: 'INTERMEDIO',
      scenario:
        'Un cliente reporta que su computadora enciende la pantalla, muestra el logotipo de la tarjeta madre y emite sonido de ventiladores, pero inmediatamente queda congelada en un bucle con pantalla negra y el mensaje "An operating system wasn\'t found" o "Error de inicio BCD". El usuario indica que la noche anterior la PC se apagó repentinamente por un corte de energía mientras instalaba una actualización.',
      symptoms: [
        'Equipo enciende luz de encendido y ventiladores sin ruidos extraños',
        'Pantalla negra tras pantalla POST con error: "An operating system wasn\'t found"',
        'Imposibilidad de ingresar al escritorio de Windows',
        'Corte de energía repentino reportado durante actualización previa',
      ],
      context:
        'Computadora de escritorio con motherboard B550, procesador Ryzen 5, 16GB RAM DDR4 y almacenamiento SSD NVMe M.2 de 512GB. El firmware UEFI detecta el dispositivo SSD en la lista de almacenamiento SATA/NVMe.',
      skills: ['ANALIZAR_ARRANQUE', 'INTERPRETAR_EVENTOS', 'DOCUMENTAR_EVIDENCIA', 'VALIDAR_HIPOTESIS'],
      systemState: 'INITIAL_ANOMALY',
      availableEvidence: [
        {
          id: 'ev-smart-01',
          category: 'SMART',
          title: 'ESTADO DE SALUD SMART (SSD NVMe M.2)',
          shortSnippet: 'Salud 98%, 0 sectores reubicados, Temperatura 34°C.',
          detailedData:
            'NVMe SMART Health Report:\n- Critical Warning: 0x00 (Normal)\n- Temperature: 34 °C\n- Available Spare: 100%\n- Percentage Used: 2%\n- Data Units Read: 4.2 TB\n- Data Units Written: 3.8 TB\n- Media and Data Integrity Errors: 0\n- Error Information Log Entries: 0',
          provenance: 'MEASURED',
          unlockedByActionId: 'act-smart-check',
          isUnlocked: false,
        },
        {
          id: 'ev-bootlog-01',
          category: 'BOOT_LOG',
          title: 'REGISTRO DE ARRANQUE FORENSE (SrtTrail.txt)',
          shortSnippet: 'Error de entrada en almacén BCD en \\EFI\\Microsoft\\Boot\\BCD.',
          detailedData:
            'Windows Startup Repair Log (SrtTrail.txt):\n- Root cause found:\n  Boot configuration file (BCD) contains invalid entries or partition signature is corrupt.\n  Repair action: Boot configuration file repair\n  Result: Failed. Error code = 0x3f\n  Time taken = 120 ms',
          provenance: 'SYSTEM_REPORTED',
          unlockedByActionId: 'act-bootlog-check',
          isUnlocked: false,
        },
        {
          id: 'ev-event-01',
          category: 'EVENTO',
          title: 'REGISTRO DE EVENTOS KERNEL-POWER (Event ID 41)',
          shortSnippet: 'Apagado no programado en T-10h por interrupción de energía.',
          detailedData:
            'Event Viewer Kernel-Power (Event ID 41, Task Category 63):\n- The system has rebooted without cleanly shutting down first.\n- Timestamp: 2026-10-04T18:42:10Z\n- BugcheckCode: 0\n- PowerButtonTimestamp: 0\n- Active update session interrupted during component store commit.',
          provenance: 'SYSTEM_REPORTED',
          unlockedByActionId: 'act-event-check',
          isUnlocked: false,
        },
        {
          id: 'ev-disk-01',
          category: 'ESTADO_DISCO',
          title: 'AUDITORÍA DE PARTICIONES (DISKPART & BCDEDIT)',
          shortSnippet: 'Partición EFI Fat32 presente; BCD store reporta error de apertura.',
          detailedData:
            'DISKPART > list partition\n  Partition 1    System       100 MB   FAT32 (Healthy, EFI System)\n  Partition 2    Reserved      16 MB   RAW\n  Partition 3    Primary      475 GB   NTFS (Healthy, Windows)\n\nBCDEDIT > bcdedit /enum\n  The boot configuration data store could not be opened.\n  The system cannot find the file specified.',
          provenance: 'VERIFIED',
          unlockedByActionId: 'act-diskpart-check',
          isUnlocked: false,
        },
        {
          id: 'ev-driver-01',
          category: 'DRIVER',
          title: 'AUDITORÍA DE CONTROLADOR STORNVME.SYS',
          shortSnippet: 'Controlador estándar NVMe firmado y en estado válido en DriverStore.',
          detailedData:
            'DriverStore Repository Audit:\n- stornvme.sys Version: 10.0.19041.1\n- Digital Signer: Microsoft Windows Component Publisher\n- Status: OK. No driver corruption detected.',
          provenance: 'SIMULATED',
          unlockedByActionId: 'act-driver-check',
          isUnlocked: false,
        },
      ],
      possibleActions: [
        {
          id: 'act-smart-check',
          label: '1. Auditar salud SMART y temperatura del SSD',
          description: 'Consultar los registros SMART del bus NVMe para verificar si hay daño físico o de celdas NAND.',
          category: 'AUDITORÍA_DISCO',
          costMinutes: 3,
          unlocksEvidenceId: 'ev-smart-01',
          isExecuted: false,
        },
        {
          id: 'act-bootlog-check',
          label: '2. Inspeccionar SrtTrail.txt de la partición de recuperación',
          description: 'Revisar el registro de diagnóstico del cargador de arranque de Windows.',
          category: 'ANÁLISIS_LOGS',
          costMinutes: 5,
          unlocksEvidenceId: 'ev-bootlog-01',
          isExecuted: false,
        },
        {
          id: 'act-event-check',
          label: '3. Consultar Visor de Eventos por Kernel-Power',
          description: 'Revisar los eventos críticos antes del fallo de inicio.',
          category: 'ANÁLISIS_LOGS',
          costMinutes: 4,
          unlocksEvidenceId: 'ev-event-01',
          isExecuted: false,
        },
        {
          id: 'act-diskpart-check',
          label: '4. Ejecutar Diskpart y bcdedit en consola WinRE',
          description: 'Verificar si la partición EFI FAT32 está montada y si la base BCD responde.',
          category: 'INSPECCIÓN_ARRANQUE',
          costMinutes: 6,
          unlocksEvidenceId: 'ev-disk-01',
          isExecuted: false,
        },
        {
          id: 'act-driver-check',
          label: '5. Verificar firma del controlador de almacenamiento (stornvme.sys)',
          description: 'Comprobar si el controlador de almacenamiento fue reemplazado o dañado.',
          category: 'REVISIÓN_DRIVERS',
          costMinutes: 4,
          unlocksEvidenceId: 'ev-driver-01',
          isExecuted: false,
        },
      ],
      hypotheses: [
        {
          id: 'hyp-fuente',
          title: 'HIPÓTESIS A: Falla de la Fuente de Alimentación',
          category: 'FUENTE',
          description: 'La fuente de alimentación no entrega voltaje suficiente en el raíl de 12V durante el arranque de Windows.',
          isCorrect: false,
          requiredEvidenceIds: ['ev-smart-01'],
          explanationIfIncorrect:
            'La hipótesis de Falla de Fuente NO explica la evidencia disponible. El equipo enciende de forma continua, mantiene encendidos los ventiladores e ilumina el panel de la motherboard sin caídas ni reinicios espontáneos en el firmware UEFI.',
          explanationIfCorrect: '',
        },
        {
          id: 'hyp-almacenamiento-fisico',
          title: 'HIPÓTESIS B: Fallo Físico de SSD NVMe (Daño Hardware)',
          category: 'ALMACENAMIENTO',
          description: 'El SSD NVMe sufrió un daño permanente en las celdas de almacenamiento debido al apagado repentino.',
          isCorrect: false,
          requiredEvidenceIds: ['ev-smart-01'],
          explanationIfIncorrect:
            'La hipótesis de Fallo Físico de SSD NO explica la evidencia disponible. La auditoría SMART confirma 98% de salud restante, 0 sectores dañados, 0 errores de integridad de medios y presencia normal en la tabla de dispositivos de la motherboard.',
          explanationIfCorrect: '',
        },
        {
          id: 'hyp-bcd-corrupto',
          title: 'HIPÓTESIS C: Corrupción Lógica del Almacén BCD en Partición EFI',
          category: 'BCD',
          description: 'El apagado repentino interrumpió la escritura en la base de datos BCD de la partición EFI, corruptiendo el almacén de arranque pero manteniendo intacto el hardware.',
          isCorrect: true,
          requiredEvidenceIds: ['ev-bootlog-01', 'ev-disk-01'],
          explanationIfIncorrect: '',
          explanationIfCorrect:
            '¡Hipótesis Validada! La evidencia en SrtTrail.txt ("invalid entries in BCD store") y Diskpart/bcdedit ("data store could not be opened") demuestra que la falla es una corrupción lógica en la base BCD de la partición EFI, con hardware de disco totalmente sano.',
        },
        {
          id: 'hyp-driver',
          title: 'HIPÓTESIS D: Controlador de Almacenamiento Incompatible',
          category: 'DRIVER',
          description: 'Windows Update reemplazó stornvme.sys por un controlador incompatible que no puede montar el volumen C:.',
          isCorrect: false,
          requiredEvidenceIds: ['ev-driver-01'],
          explanationIfIncorrect:
            'La hipótesis de Controlador Incompatible NO explica la evidencia disponible. La auditoría de DriverStore demuestra que stornvme.sys mantiene la firma digital válida de Microsoft sin alteraciones.',
          explanationIfCorrect: '',
        },
      ],
    };
  }

  /**
   * Unlocks evidence when an action is executed.
   */
  public static executeAction(
    currentCase: TechnicalCaseDefinition,
    actionId: string
  ): { updatedCase: TechnicalCaseDefinition; newEvidence?: ProgressiveEvidenceItem } {
    const actionIndex = currentCase.possibleActions.findIndex((a) => a.id === actionId);
    if (actionIndex < 0) return { updatedCase: currentCase };

    const action = currentCase.possibleActions[actionIndex];
    if (action.isExecuted) return { updatedCase: currentCase };

    // Mark action as executed
    const updatedActions = [...currentCase.possibleActions];
    updatedActions[actionIndex] = { ...action, isExecuted: true };

    // Unlock corresponding evidence
    let unlockedEvidence: ProgressiveEvidenceItem | undefined;
    const updatedEvidence = currentCase.availableEvidence.map((ev) => {
      if (ev.id === action.unlocksEvidenceId) {
        unlockedEvidence = {
          ...ev,
          isUnlocked: true,
          unlockedAtTimestamp: new Date().toLocaleTimeString(),
        };
        return unlockedEvidence;
      }
      return ev;
    });

    const updatedCase: TechnicalCaseDefinition = {
      ...currentCase,
      possibleActions: updatedActions,
      availableEvidence: updatedEvidence,
      systemState: 'INVESTIGATING',
    };

    return { updatedCase, newEvidence: unlockedEvidence };
  }

  /**
   * Evaluates user selected hypothesis against collected evidence.
   */
  public static testHypothesis(
    currentCase: TechnicalCaseDefinition,
    hypothesisId: string
  ): { updatedCase: TechnicalCaseDefinition; isSuccess: boolean; feedback: string } {
    const hyp = currentCase.hypotheses.find((h) => h.id === hypothesisId);
    if (!hyp) return { updatedCase: currentCase, isSuccess: false, feedback: 'Hipótesis no encontrada.' };

    const isSuccess = hyp.isCorrect;
    const feedback = isSuccess ? hyp.explanationIfCorrect : hyp.explanationIfIncorrect;

    if (!isSuccess) {
      const updatedCase: TechnicalCaseDefinition = {
        ...currentCase,
        selectedHypothesisId: hypothesisId,
        hypothesisFeedback: feedback,
        systemState: 'HYPOTHESIS_TESTING',
      };
      return { updatedCase, isSuccess: false, feedback };
    }

    // Success! Generate closure pericial report & persist to LocalStorage via EvoCaseRepository
    const nowISO = new Date().toISOString();
    const diagnosis: CasePericialDiagnosis = {
      diagnosisTitle: 'DICTAMEN PERICIAL: CORRUPCIÓN LÓGICA DE ALMACÉN BCD EN PARTICIÓN EFI',
      conclusionNotes:
        'Se aisló la causa raíz: el apagado repentino interrumpió el commit de Windows Update en la partición EFI Fat32. El hardware de SSD NVMe está 100% sano. Se resolvió reconstruyendo la base BCD con bootrec /rebuildbcd.',
      technicalJustification:
        'SrtTrail.txt confirma error en BCD; bcdedit/diskpart demuestra inaccesibilidad del archivo BCD; la telemetría SMART confirma 98% de salud física descartando daño mecánico o de celdas.',
      remediationStepsExecuted: [
        'Inspección de SMART NVMe (98% salud)',
        'Lectura de log forense SrtTrail.txt (Fallo en BCD)',
        'Ejecución de bcdedit /enum en consola WinRE',
        'Reconstrucción de almacén BCD con bootrec /rebuildbcd',
      ],
      demonstratedSkills: currentCase.skills,
      artifactsGenerated: ['SrtTrail.txt Audit', 'NVMe SMART Report', 'BCD Store Reconstruction Log'],
      resolvedAtISO: nowISO,
    };

    const updatedCase: TechnicalCaseDefinition = {
      ...currentCase,
      selectedHypothesisId: hypothesisId,
      hypothesisFeedback: feedback,
      systemState: 'RESOLVED',
      diagnosis,
    };

    // Save to EvoCaseRepository (LocalStorage)
    const fallbackMachine = EvoCaseRepository.getActiveMachine() || {
      id: 'mach-case-ref-01',
      name: 'Equipo de Prueba REF-01',
      motherboard: { model: 'B550 Pro', chipset: 'B550', socket: 'AM4', formFactor: 'ATX' },
      cpu: { model: 'AMD Ryzen 5 5600X', cores: 6, threads: 12, socket: 'AM4', baseGhz: 3.7 },
      ram: { totalGb: 16, moduleCount: 2, type: 'DDR4', speedMhz: 3200 },
      storage: { type: 'NVMe SSD', totalGb: 512, healthPct: 98 },
      gpu: { model: 'NVIDIA RTX 3060', vramGb: 12 },
      psu: { wattage: 650, rating: '80+ Gold' },
    };

    const repoCase: EvoCase = {
      id: currentCase.id,
      createdAt: nowISO,
      updatedAt: nowISO,
      caseType: 'REPAIR',
      title: currentCase.title,
      summary: diagnosis.conclusionNotes,
      machine: fallbackMachine as any,
      isClosed: true,
      conclusionNotes: diagnosis.conclusionNotes,
    };

    EvoCaseRepository.saveCase(repoCase);

    return { updatedCase, isSuccess: true, feedback };
  }
}
