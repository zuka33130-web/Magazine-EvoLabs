// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — MACHINE COMPLETENESS ENGINE
// Principle: "LA COMPUTADORA ENTRA PRIMERO AL LABORATORIO. NO SE ADIVINA. SE MIDE."
// ============================================================================

import {
  BuildComponentItem,
  Machine,
  MachineArchetype,
  MachineCompletenessReport,
  CompletenessItemAudit,
  WorkloadTarget,
  CompatibilityReport,
  MachineReadyState,
} from '../types';

export class MachineCompletenessEngine {
  /**
   * Evaluates if a given machine configuration satisfies all physical, electrical,
   * firmware, and workload prerequisites to be considered complete and safe to ignite.
   */
  static evaluateCompleteness(
    components: {
      motherboard?: BuildComponentItem;
      cpu?: BuildComponentItem;
      ram?: BuildComponentItem;
      gpu?: BuildComponentItem;
      storage?: BuildComponentItem;
      psu?: BuildComponentItem;
      cooling?: BuildComponentItem;
      case?: BuildComponentItem;
      fans?: BuildComponentItem;
      expansion?: BuildComponentItem;
      peripherals?: Record<string, BuildComponentItem>;
    },
    archetype: MachineArchetype = 'CUSTOM_DESKTOP',
    workloads?: WorkloadTarget[],
    compatibilityReport?: CompatibilityReport
  ): MachineCompletenessReport {
    const audits: CompletenessItemAudit[] = [];
    const ignitionBlockers: string[] = [];

    const { motherboard, cpu, ram, gpu, storage, psu, cooling } = components;
    const caseItem = components.case;

    const isLaptopOrMiniPc = archetype === 'LAPTOP' || archetype === 'MINI_PC';

    // 1. MOTHERBOARD (Required for Desktop / Custom / Workstation / Server)
    if (motherboard) {
      audits.push({
        subsystem: 'motherboard',
        label: 'Placa Base / Motherboard',
        severity: 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalada: ${motherboard.model} (${motherboard.specsSummary.match(/Socket\s*:\s*([\w\d-]+)/i)?.[1] || 'Socket Definido'}).`,
      });
    } else {
      audits.push({
        subsystem: 'motherboard',
        label: 'Placa Base / Motherboard',
        severity: 'REQUIRED',
        status: 'MISSING',
        rationale: 'Falta Placa Base. Es la columna vertebral de buses y energía de todo el sistema.',
      });
      ignitionBlockers.push('Falta seleccionar la Placa Base.');
    }

    // 2. CPU (Always Required)
    let cpuHasIGpu = false;
    let cpuModelName = '';
    if (cpu) {
      cpuModelName = cpu.model;
      // Evaluate if CPU has integrated graphics
      // In our catalog, 'hasIGPU: true' or check model name / specsSummary
      const specsSummary = cpu.specsSummary.toLowerCase();
      const hasIGpuKeyword = specsSummary.includes('igpu') || specsSummary.includes('uhd') || specsSummary.includes('iris') || specsSummary.includes('integrada');
      const isWithoutIGpu = specsSummary.includes('requiere gpu') || specsSummary.includes('sin gráficos') || /f$|kf$|5700x3d|5600x|5800x|3600/i.test(cpu.model);
      cpuHasIGpu = hasIGpuKeyword && !isWithoutIGpu;

      audits.push({
        subsystem: 'cpu',
        label: 'Procesador (CPU)',
        severity: 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalado: ${cpu.model}. ${cpuHasIGpu ? 'Posee gráficos integrados (iGPU).' : 'Carece de iGPU nativa.'}`,
      });
    } else {
      audits.push({
        subsystem: 'cpu',
        label: 'Procesador (CPU)',
        severity: 'REQUIRED',
        status: 'MISSING',
        rationale: 'Falta Procesador (CPU). El sistema no puede inicializar el ciclo POST ni ejecutar instrucciones.',
      });
      ignitionBlockers.push('Falta seleccionar el Procesador (CPU).');
    }

    // 3. RAM (Always Required)
    if (ram) {
      audits.push({
        subsystem: 'ram',
        label: 'Memoria RAM',
        severity: 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalada: ${ram.model} (${ram.specsSummary.match(/(\d+)\s*GB/i)?.[1] || 'Capacidad'} GB).`,
      });
    } else {
      audits.push({
        subsystem: 'ram',
        label: 'Memoria RAM',
        severity: 'REQUIRED',
        status: 'MISSING',
        rationale: 'Falta Memoria RAM. Sin memoria volátil principal la máquina detendrá la inicialización en código de error de DRAM.',
      });
      ignitionBlockers.push('Falta seleccionar Memoria RAM.');
    }

    // 4. GPU (CONDITIONAL: REQUIRED if CPU has no iGPU, or if workload mandates dedicated graphics)
    const heavyWorkloadMandatesGpu = workloads?.some((w) =>
      w.category === 'AAA_GAMING' ||
      w.category === '3D_CAD' ||
      w.category === 'VIDEO_EDITING' ||
      w.gpuPerformanceIndexRequired >= 40
    );

    if (gpu) {
      audits.push({
        subsystem: 'gpu',
        label: 'Placa de Video (GPU)',
        severity: cpuHasIGpu ? 'OPTIONAL' : 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalada: ${gpu.model} (${gpu.specsSummary.match(/(\d+)\s*GB/i)?.[1] || 'VRAM'} GB VRAM).`,
      });
    } else {
      if (!cpu && !gpu) {
        audits.push({
          subsystem: 'gpu',
          label: 'Aceleración Gráfica (GPU)',
          severity: 'REQUIRED',
          status: 'MISSING',
          rationale: 'Falta salida de video. Sin CPU definida ni GPU discreta, la máquina no puede entregar señal a un display.',
        });
        ignitionBlockers.push('Falta subsistema de video (GPU o CPU con iGPU).');
      } else if (cpu && !cpuHasIGpu) {
        audits.push({
          subsystem: 'gpu',
          label: 'Placa de Video (GPU Dedicada)',
          severity: 'REQUIRED',
          status: 'MISSING',
          rationale: `GPU REQUERIDA OBLIGATORIAMENTE: El procesador seleccionado (${cpuModelName}) no dispone de gráficos integrados (iGPU). La máquina no emitirá señal de video sin una tarjeta gráfica dedicada.`,
        });
        ignitionBlockers.push(`La CPU ${cpuModelName} carece de iGPU; requiere GPU dedicada para dar señal de video.`);
      } else if (heavyWorkloadMandatesGpu) {
        audits.push({
          subsystem: 'gpu',
          label: 'Placa de Video (GPU)',
          severity: 'REQUIRED',
          status: 'MISSING',
          rationale: 'Los objetivos de carga seleccionados (Gaming AAA / 3D / Render) requieren aceleración gráfica dedicada por encima de una iGPU básica.',
        });
        ignitionBlockers.push('El objetivo de carga seleccionado exige GPU dedicada.');
      } else {
        audits.push({
          subsystem: 'gpu',
          label: 'Placa de Video (GPU Dedicada)',
          severity: 'OPTIONAL',
          status: 'NOT_APPLICABLE',
          rationale: 'Opcional: El procesador posee gráficos integrados suficientes para video básico, ofimática y multimedia.',
        });
      }
    }

    // 5. STORAGE (Required)
    if (storage) {
      audits.push({
        subsystem: 'storage',
        label: 'Unidad de Almacenamiento',
        severity: 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalada: ${storage.model}.`,
      });
    } else {
      audits.push({
        subsystem: 'storage',
        label: 'Unidad de Almacenamiento',
        severity: 'REQUIRED',
        status: 'MISSING',
        rationale: 'Falta Almacenamiento (SSD / NVMe / SATA). La máquina no tendrá medio de booteo para el sistema operativo.',
      });
      ignitionBlockers.push('Falta unidad de almacenamiento principal (SSD/NVMe).');
    }

    // 6. PSU (Required for Desktop; integrated on laptop)
    if (psu) {
      audits.push({
        subsystem: 'psu',
        label: 'Fuente de Poder (PSU)',
        severity: isLaptopOrMiniPc ? 'OPTIONAL' : 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalada: ${psu.model} (${psu.specsSummary.match(/(\d+)\s*W/i)?.[1] || 'Watts'}W).`,
      });
    } else {
      if (isLaptopOrMiniPc) {
        audits.push({
          subsystem: 'psu',
          label: 'Alimentación Eléctrica',
          severity: 'OPTIONAL',
          status: 'NOT_APPLICABLE',
          rationale: 'Alimentación integrada mediante cargador OEM / USB-C PD.',
        });
      } else {
        audits.push({
          subsystem: 'psu',
          label: 'Fuente de Poder (PSU)',
          severity: 'REQUIRED',
          status: 'MISSING',
          rationale: 'Falta Fuente de Poder (PSU). El banco no puede suministrar voltajes de rieles +12V, +5V ni +3.3V.',
        });
        ignitionBlockers.push('Falta seleccionar Fuente de Poder (PSU).');
      }
    }

    // 7. COOLING (Required for Desktop; integrated on laptop)
    if (cooling) {
      audits.push({
        subsystem: 'cooling',
        label: 'Sistema de Refrigeración (Cooler)',
        severity: isLaptopOrMiniPc ? 'OPTIONAL' : 'REQUIRED',
        status: 'PRESENT',
        rationale: `Instalado: ${cooling.model}.`,
      });
    } else {
      if (isLaptopOrMiniPc) {
        audits.push({
          subsystem: 'cooling',
          label: 'Disipación Térmica',
          severity: 'OPTIONAL',
          status: 'NOT_APPLICABLE',
          rationale: 'Cámara de vapor / heatpipes integrados de fábrica.',
        });
      } else {
        audits.push({
          subsystem: 'cooling',
          label: 'Sistema de Refrigeración (Cooler)',
          severity: 'REQUIRED',
          status: 'MISSING',
          rationale: 'Falta Disipador de CPU. Encender un procesador moderno sin disipación térmica provoca apagado de emergencia inmediato por PROCHOT (thermal trip a 105°C).',
        });
        ignitionBlockers.push('Falta seleccionar Disipador de CPU (Cooler).');
      }
    }

    // 8. CASE / CHASSIS (Recommended for physical build, optional for technical open-bench test)
    if (caseItem) {
      audits.push({
        subsystem: 'case',
        label: 'Gabinete / Chasis',
        severity: 'RECOMMENDED',
        status: 'PRESENT',
        rationale: `Instalado: ${caseItem.model}. Protege componentes y canaliza flujo de aire.`,
      });
    } else {
      audits.push({
        subsystem: 'case',
        label: 'Gabinete / Chasis',
        severity: 'RECOMMENDED',
        status: 'MISSING',
        rationale: 'Recomendado para armado físico definitivo (Clearance y flujo de aire). En banco de pruebas abierto es optativo.',
      });
    }

    // 9. CASE FANS
    if (components.fans) {
      audits.push({
        subsystem: 'fans',
        label: 'Ventiladores de Chasis',
        severity: 'RECOMMENDED',
        status: 'PRESENT',
        rationale: `Instalados: ${components.fans.model || 'Ventiladores PWM'}.`,
      });
    }

    // 10. PERIPHERALS (Optional)
    const periphCount = components.peripherals ? Object.keys(components.peripherals).length : 0;
    audits.push({
      subsystem: 'peripherals',
      label: 'Periféricos de Estación',
      severity: 'OPTIONAL',
      status: periphCount > 0 ? 'PRESENT' : 'NOT_APPLICABLE',
      rationale: periphCount > 0 ? `${periphCount} periférico(s) configurado(s).` : 'Opcional: No bloquea el encendido del silicio.',
    });

    // Check compatibility blockers
    if (compatibilityReport) {
      const incompatibleChecks = compatibilityReport.checks.filter((c) => c.status === 'INCOMPATIBLE');
      for (const inc of incompatibleChecks) {
        ignitionBlockers.push(inc.detail);
      }
    }

    const missingRequired = audits.filter((a) => a.severity === 'REQUIRED' && a.status === 'MISSING');
    const missingRecommended = audits.filter((a) => a.severity === 'RECOMMENDED' && a.status === 'MISSING');

    const status =
      missingRequired.length > 0 || ignitionBlockers.length > 0
        ? 'MISSING_REQUIRED'
        : missingRecommended.length > 0
        ? 'MISSING_RECOMMENDED'
        : 'COMPLETE';

    const isIgnitionAllowed = missingRequired.length === 0 && ignitionBlockers.length === 0;

    return {
      status,
      missingRequired,
      missingRecommended,
      allAudits: audits,
      isIgnitionAllowed,
      ignitionBlockers,
    };
  }

  /**
   * Computes the MachineReadyState based on completeness and compatibility
   */
  static determineReadyState(
    completeness: MachineCompletenessReport,
    compatibility?: CompatibilityReport,
    isLabActive?: boolean
  ): MachineReadyState {
    if (isLabActive) return 'LAB_ACTIVE';
    if (!completeness.isIgnitionAllowed) {
      return completeness.missingRequired.length > 0 ? 'INCOMPLETE' : 'DRAFT';
    }
    if (compatibility?.overallStatus === 'COMPATIBLE_AFTER_BIOS_UPDATE') {
      return 'COMPATIBILITY_WARNING';
    }
    if (compatibility?.overallStatus === 'INCOMPATIBLE') {
      return 'DRAFT';
    }
    return 'READY';
  }
}
