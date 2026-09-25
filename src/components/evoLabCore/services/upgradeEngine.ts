// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — UPGRADE SCENARIO COMPARATOR
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import { Machine, SubsystemType } from '../types';

export interface MachineScenario {
  id: string;
  originalMachineId: string;
  name: string;
  modifiedMachine: Machine;
  replacedSubsystems: SubsystemType[];
  changesDescription: string[];
  estimatedCostUsd: number;
}

export interface UpgradeComparisonResult {
  scenario: MachineScenario;
  expectedBenefits: string[];
  risksOrLimitations: string[];
  costPerceivedValue: 'EXCELENTE_INVERSION' | 'EQUILIBRADO' | 'POCO_BENEFICIO_PARA_COSTO';
  summaryEs: string;
}

export class UpgradeEngine {
  /**
   * Compares the original physical machine against a virtual upgrade scenario
   * Keeps the original Machine untouched and produces a clear delta report
   */
  static compareScenario(original: Machine, scenario: MachineScenario): UpgradeComparisonResult {
    const benefits: string[] = [];
    const limitations: string[] = [];

    // RAM comparison
    if (scenario.replacedSubsystems.includes('ram')) {
      const origRam = original.ram.sizeGb;
      const newRam = scenario.modifiedMachine.ram.sizeGb;
      if (newRam > origRam) {
        benefits.push(`Capacidad de memoria ampliada de ${origRam} GB a ${newRam} GB (+${newRam - origRam} GB para multitarea y edición pesada).`);
      }
      if (original.ram.channels === 1 && scenario.modifiedMachine.ram.channels === 2) {
        benefits.push('Habilitación de Dual Channel (128-bit): Duplica el ancho de banda efectivo y estabiliza el 1% Low FPS.');
      }
    }

    // GPU comparison
    if (scenario.replacedSubsystems.includes('gpu')) {
      const origGpu = original.gpu;
      const newGpu = scenario.modifiedMachine.gpu;
      if (!origGpu.isDedicated && newGpu.isDedicated) {
        benefits.push(`Transición de gráficos integrados a GPU dedicada (${newGpu.model}): Incremento exponencial en tasa de fill-rate y rendimiento 3D.`);
      } else {
        benefits.push(`GPU actualizada a ${newGpu.model} (${newGpu.vramGb} GB VRAM).`);
      }

      // Check PSU requirement
      const totalEstimatedPower = scenario.modifiedMachine.cpu.tdpW + newGpu.powerW + 75;
      if (totalEstimatedPower > original.psu.wattageW) {
        limitations.push(`¡ADVERTENCIA DE ALIMENTACIÓN! La nueva GPU eleva el consumo del sistema a ~${totalEstimatedPower}W, superando la fuente actual de ${original.psu.wattageW}W. Es obligatorio cambiar también la PSU.`);
      }
    }

    // Value evaluation
    let costPerceivedValue: UpgradeComparisonResult['costPerceivedValue'] = 'EQUILIBRADO';
    if (benefits.length >= 2 && limitations.length === 0) {
      costPerceivedValue = 'EXCELENTE_INVERSION';
    } else if (limitations.length > 0) {
      costPerceivedValue = 'POCO_BENEFICIO_PARA_COSTO';
    }

    return {
      scenario,
      expectedBenefits: benefits,
      risksOrLimitations: limitations,
      costPerceivedValue,
      summaryEs: `La actualización virtual reemplaza [${scenario.replacedSubsystems.join(', ').toUpperCase()}]. Aporta ${benefits.length} mejoras verificables sobre la plataforma actual.`,
    };
  }
}
