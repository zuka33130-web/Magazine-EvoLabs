// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — REAL MACHINE ADAPTER
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// Rules: Zero fabricated hardware defaults. No fallback to mock machines.
// ============================================================================

import { Machine, EpistemicProvenance } from '../types';
import { WindowsDetectionService } from './windowsDetectionService';

export class MachineAdapter {
  /**
   * Builds an empty machine where every unproven field is strictly UNKNOWN
   */
  static createBlankMachine(alias = 'PC Sin Detectar'): Machine {
    return {
      id: `MCH-${Date.now()}`,
      alias,
      isDetected: false,
      overallProvenance: 'UNKNOWN',
      readyState: 'INCOMPLETE',
      notes: 'Hardware no detectado todavía. Pendiente de autodetección o carga manual.',
      motherboard: {
        model: 'UNKNOWN',
        socket: 'UNKNOWN',
        ramSlots: 0,
        ramType: 'UNKNOWN',
        pcieGen: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      cpu: {
        model: 'UNKNOWN',
        socket: 'UNKNOWN',
        cores: 0,
        threads: 0,
        tdpW: 0,
        hasIGPU: false,
        provenance: 'UNKNOWN',
      },
      ram: {
        sizeGb: 0,
        configuredSpeedMts: 0,
        type: 'UNKNOWN',
        channels: 0,
        provenance: 'UNKNOWN',
      },
      gpu: {
        model: 'UNKNOWN',
        vramGb: 0,
        isDedicated: false,
        powerW: 0,
        provenance: 'UNKNOWN',
      },
      storage: {
        model: 'UNKNOWN',
        type: 'UNKNOWN',
        capacityGb: 0,
        provenance: 'UNKNOWN',
      },
      psu: {
        wattageW: 0,
        rating: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      cooling: {
        type: 'UNKNOWN',
        tdpCapacityW: 0,
        provenance: 'UNKNOWN',
      },
      chassis: {
        model: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      fans: {
        count: 0,
        sizeMm: 0,
        provenance: 'UNKNOWN',
      },
      display: {
        resolution: 'UNKNOWN',
        refreshHz: 0,
        provenance: 'UNKNOWN',
      },
    };
  }

  /**
   * Adapts detected telemetry from Windows CIM/WMI or browser detection
   * Strictly respects: no invented PSU, cooler, case, fans, channels, or VRAM.
   */
  static fromDetectedHardware(rawTelemetry: any): Machine {
    if (!rawTelemetry) {
      return this.createBlankMachine();
    }
    return WindowsDetectionService.buildMachineFromTelemetry(rawTelemetry);
  }

  /**
   * Attempts to load any already detected machine from localStorage.
   * RULE 8: If autodetection has not run, NEVER load a demo machine.
   * Returns a blank incomplete machine with status UNKNOWN.
   */
  static loadExistingMachine(): Machine {
    try {
      const active = localStorage.getItem('evo_lab_core_active_machine_v1');
      if (active) {
        const parsed = JSON.parse(active);
        if (parsed && parsed.id && parsed.cpu) return parsed;
      }

      const autodetected = localStorage.getItem('evo_autodetected_hardware');
      if (autodetected) {
        return this.fromDetectedHardware(JSON.parse(autodetected));
      }

      const c01Specs = localStorage.getItem('evo_c01_specs');
      if (c01Specs) {
        return this.fromDetectedHardware(JSON.parse(c01Specs));
      }
    } catch (err) {
      console.warn('[MachineAdapter] Error loading stored machine:', err);
    }

    // STRICT: Never load demo benchmark machine. Return uninitialized blank machine.
    return this.createBlankMachine('PC Sin Detectar (Pendiente de Detección)');
  }
}
