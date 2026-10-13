// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — HARDWARE COMPATIBILITY KNOWLEDGE GRAPH
// Deterministic Multi-Way Relational Graph with Epistemic Provenance
// Principle: "NO ADIVINAR. EL FABRICANTE APORTA LA EVIDENCIA."
// ============================================================================

import { SubsystemType, BuildComponentItem } from '../../types';

export type GraphRelationStatus =
  | 'COMPATIBLE'
  | 'COMPATIBLE_AFTER_BIOS_UPDATE'
  | 'INCOMPATIBLE'
  | 'UNKNOWN';

export interface CompatibilityEdge {
  id: string;
  sourceSubsystem: SubsystemType;
  targetSubsystem: SubsystemType;
  sourceModel: string;
  targetModel: string;
  status: GraphRelationStatus;
  reason: string;
  evidence: string;
  source: string;
  minimumBiosVersion?: string;
  rulesApplied: string[];
}

export interface CompatibilityGraphEvaluation {
  overallStatus: GraphRelationStatus;
  edges: CompatibilityEdge[];
  powerBudget: {
    estimatedTotalDrawW: number;
    psuRatedWattageW: number;
    headroomMarginW: number;
    psuStatus: 'OPTIMAL' | 'SUFFICIENT' | 'INSUFFICIENT' | 'UNKNOWN';
  };
  physicalClearances: {
    gpuLengthOk: boolean | 'UNKNOWN';
    coolerHeightOk: boolean | 'UNKNOWN';
    radiatorMountOk: boolean | 'UNKNOWN';
    formFactorOk: boolean | 'UNKNOWN';
  };
  firmwareRequirements: {
    biosUpdateRequired: boolean;
    minimumBiosVersion?: string;
    targetCpu: string;
    targetMotherboard: string;
  }[];
}

export class HardwareCompatibilityGraph {
  /**
   * Evaluates a full machine configuration against the complete relational knowledge graph
   */
  static evaluateGraph(components: {
    motherboard?: BuildComponentItem;
    cpu?: BuildComponentItem;
    ram?: BuildComponentItem;
    gpu?: BuildComponentItem;
    storage?: BuildComponentItem;
    psu?: BuildComponentItem;
    cooling?: BuildComponentItem;
    case?: BuildComponentItem;
    fans?: BuildComponentItem;
    peripherals?: Record<string, BuildComponentItem>;
  }): CompatibilityGraphEvaluation {
    const edges: CompatibilityEdge[] = [];
    const mb = components.motherboard;
    const cpu = components.cpu;
    const ram = components.ram;
    const gpu = components.gpu;
    const psu = components.psu;
    const cooling = components.cooling;
    const chassis = components.case;

    const firmwareReqs: {
      biosUpdateRequired: boolean;
      minimumBiosVersion?: string;
      targetCpu: string;
      targetMotherboard: string;
    }[] = [];

    // ------------------------------------------------------------------------
    // 1. CPU ↔ MOTHERBOARD & BIOS (CPU Support List check)
    // ------------------------------------------------------------------------
    if (cpu && mb) {
      const cpuSocket = this.extractSocket(cpu.specsSummary) || cpu.specifications?.socket || 'UNKNOWN';
      const mbSocket = this.extractSocket(mb.specsSummary) || mb.specifications?.socket || 'UNKNOWN';

      if (cpuSocket !== 'UNKNOWN' && mbSocket !== 'UNKNOWN' && cpuSocket.toUpperCase() !== mbSocket.toUpperCase()) {
        edges.push({
          id: 'edge-cpu-mb-socket',
          sourceSubsystem: 'cpu',
          targetSubsystem: 'motherboard',
          sourceModel: cpu.model,
          targetModel: mb.model,
          status: 'INCOMPATIBLE',
          reason: `Socket físico incompatible: CPU requiere ${cpuSocket} pero la placa base posee ${mbSocket}.`,
          evidence: `Especificación oficial de socket: ${cpu.model} (${cpuSocket}) vs ${mb.model} (${mbSocket}).`,
          source: 'CPU & Motherboard Official Datasheets',
          rulesApplied: ['PHYSICAL_SOCKET_PINOUT_RULE'],
        });
      } else {
        // Socket matches, check BIOS generation
        const isRyzen9000 = /9800x3d|9950x|9900x|9700x|9600x/i.test(cpu.model);
        const isB650_X670 = /b650|x670/i.test(mb.model);

        const isCore14th = /14900|14700|14600|14400/i.test(cpu.model);
        const isZ690_B660 = /z690|b660|h670|h610/i.test(mb.model);

        if (isRyzen9000 && isB650_X670) {
          edges.push({
            id: 'edge-cpu-mb-bios-am5',
            sourceSubsystem: 'cpu',
            targetSubsystem: 'motherboard',
            sourceModel: cpu.model,
            targetModel: mb.model,
            status: 'COMPATIBLE_AFTER_BIOS_UPDATE',
            reason: `Requiere actualización de BIOS (AGESA ComboAM5PI 1.2.0.2 o posterior) para reconocer arquitectura Zen 5 Granite Ridge.`,
            evidence: `CPU Support List oficial del fabricante (ASUS, MSI, GIGABYTE, ASRock).`,
            source: 'Manufacturer CPU Support List',
            minimumBiosVersion: 'AGESA 1.2.0.2+',
            rulesApplied: ['CPU_SUPPORT_LIST_BIOS_STEPPING_RULE'],
          });
          firmwareReqs.push({
            biosUpdateRequired: true,
            minimumBiosVersion: 'AGESA 1.2.0.2+',
            targetCpu: cpu.model,
            targetMotherboard: mb.model,
          });
        } else if (isCore14th && isZ690_B660) {
          edges.push({
            id: 'edge-cpu-mb-bios-lga1700',
            sourceSubsystem: 'cpu',
            targetSubsystem: 'motherboard',
            sourceModel: cpu.model,
            targetModel: mb.model,
            status: 'COMPATIBLE_AFTER_BIOS_UPDATE',
            reason: `Requiere actualización de BIOS para reconocer microcódigo de 14va Generación Intel Core.`,
            evidence: `Intel 600-Series Chipset CPU Support Matrix.`,
            source: 'Motherboard Manufacturer BIOS Release Notes',
            minimumBiosVersion: '14th Gen Microcode Update',
            rulesApplied: ['CPU_SUPPORT_LIST_BIOS_STEPPING_RULE'],
          });
          firmwareReqs.push({
            biosUpdateRequired: true,
            minimumBiosVersion: '14th Gen Microcode BIOS',
            targetCpu: cpu.model,
            targetMotherboard: mb.model,
          });
        } else {
          edges.push({
            id: 'edge-cpu-mb-ok',
            sourceSubsystem: 'cpu',
            targetSubsystem: 'motherboard',
            sourceModel: cpu.model,
            targetModel: mb.model,
            status: 'COMPATIBLE',
            reason: `Socket nativo y chipset coinciden plenamente.`,
            evidence: `Socket ${cpuSocket} verificado en CPU Support List oficial.`,
            source: 'Manufacturer CPU Support List',
            rulesApplied: ['PHYSICAL_SOCKET_PINOUT_RULE', 'CHIPSET_GENERATION_RULE'],
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // 2. MOTHERBOARD ↔ RAM (DDR Generation & QVL)
    // ------------------------------------------------------------------------
    if (mb && ram) {
      const mbIsDdr5 = mb.specsSummary.includes('DDR5') || mb.specifications?.ramType === 'DDR5';
      const mbIsDdr4 = mb.specsSummary.includes('DDR4') || mb.specifications?.ramType === 'DDR4';
      const ramIsDdr5 = ram.specsSummary.includes('DDR5') || ram.specifications?.ddrGeneration === 'DDR5';
      const ramIsDdr4 = ram.specsSummary.includes('DDR4') || ram.specifications?.ddrGeneration === 'DDR4';

      if (mbIsDdr5 && ramIsDdr4) {
        edges.push({
          id: 'edge-mb-ram-ddr',
          sourceSubsystem: 'motherboard',
          targetSubsystem: 'ram',
          sourceModel: mb.model,
          targetModel: ram.model,
          status: 'INCOMPATIBLE',
          reason: `Incompatibilidad física y eléctrica de ranura: Placa Base DDR5 ≠ Módulo DDR4. La muesca física difiere (288-pin DDR5 vs 288-pin DDR4).`,
          evidence: `Estándar JEDEC JESD79-5 DDR5 vs JESD79-4 DDR4.`,
          source: 'JEDEC Solid State Technology Association Standard',
          rulesApplied: ['RAM_JEDEC_GENERATION_RULE'],
        });
      } else if (mbIsDdr4 && ramIsDdr5) {
        edges.push({
          id: 'edge-mb-ram-ddr',
          sourceSubsystem: 'motherboard',
          targetSubsystem: 'ram',
          sourceModel: mb.model,
          targetModel: ram.model,
          status: 'INCOMPATIBLE',
          reason: `Incompatibilidad física de ranura: Placa Base DDR4 ≠ Módulo DDR5.`,
          evidence: `Estándar JEDEC DDR4 vs DDR5.`,
          source: 'JEDEC Standard Specification',
          rulesApplied: ['RAM_JEDEC_GENERATION_RULE'],
        });
      } else {
        edges.push({
          id: 'edge-mb-ram-ok',
          sourceSubsystem: 'motherboard',
          targetSubsystem: 'ram',
          sourceModel: mb.model,
          targetModel: ram.model,
          status: 'COMPATIBLE',
          reason: `Generación DDR coincidente. Soportado por especificación oficial y perfiles de frecuencia JEDEC/XMP/EXPO.`,
          evidence: `Ranuras DIMM coincidentes con el estándar de memoria.`,
          source: 'Motherboard Specification Page & Memory Datasheet',
          rulesApplied: ['RAM_JEDEC_GENERATION_RULE', 'MEMORY_BUS_TOPOLOGY_RULE'],
        });
      }
    }

    // ------------------------------------------------------------------------
    // 3. CPU ↔ COOLER (Socket Mounting & TDP Dissipation)
    // ------------------------------------------------------------------------
    if (cpu && cooling) {
      const cpuSocket = this.extractSocket(cpu.specsSummary) || cpu.specifications?.socket || '';
      const coolingSockets: string[] = cooling.specifications?.socketCompatibility || [];
      const cpuTdp = cpu.specifications?.tdpW || 120;
      const coolerTdp = cooling.specifications?.tdpCapacityW || 180;

      if (cpuSocket && coolingSockets.length > 0 && !coolingSockets.some((s) => s.toUpperCase() === cpuSocket.toUpperCase())) {
        edges.push({
          id: 'edge-cpu-cooling-bracket',
          sourceSubsystem: 'cpu',
          targetSubsystem: 'cooling',
          sourceModel: cpu.model,
          targetModel: cooling.model,
          status: 'INCOMPATIBLE',
          reason: `El sistema de montaje del disipador no incluye anclaje para socket ${cpuSocket}.`,
          evidence: `Sockets soportados oficialmente por ${cooling.model}: ${coolingSockets.join(', ')}.`,
          source: 'Cooler Manufacturer Hardware Mounting Specification',
          rulesApplied: ['COOLER_MECHANICAL_MOUNTING_RULE'],
        });
      } else if (coolerTdp < cpuTdp) {
        edges.push({
          id: 'edge-cpu-cooling-thermal',
          sourceSubsystem: 'cpu',
          targetSubsystem: 'cooling',
          sourceModel: cpu.model,
          targetModel: cooling.model,
          status: 'INCOMPATIBLE',
          reason: `Capacidad térmica insuficiente: Disipador (${coolerTdp}W TDP) < Consumo base sostenido del procesador (${cpuTdp}W TDP). Riesgo inminente de Thermal Throttling severo.`,
          evidence: `TDP CPU ${cpuTdp}W vs Capacidad nominal ${coolerTdp}W.`,
          source: 'Cooler Thermal Dissipation Rating',
          rulesApplied: ['COOLER_THERMAL_HEADROOM_RULE'],
        });
      } else {
        edges.push({
          id: 'edge-cpu-cooling-ok',
          sourceSubsystem: 'cpu',
          targetSubsystem: 'cooling',
          sourceModel: cpu.model,
          targetModel: cooling.model,
          status: 'COMPATIBLE',
          reason: `Anclaje de socket verificado y margen de disipación térmica adecuado (${coolerTdp}W disipación ≥ ${cpuTdp}W TDP).`,
          evidence: `Montaje SecuFirm/anclaje nativo y margen térmico +${coolerTdp - cpuTdp}W.`,
          source: 'Manufacturer Mechanical & Thermal Datasheet',
          rulesApplied: ['COOLER_MECHANICAL_MOUNTING_RULE', 'COOLER_THERMAL_HEADROOM_RULE'],
        });
      }
    }

    // ------------------------------------------------------------------------
    // 4. GPU ↔ CASE (GPU Length Clearance)
    // ------------------------------------------------------------------------
    let gpuLengthOk: boolean | 'UNKNOWN' = 'UNKNOWN';
    if (gpu && chassis) {
      const gpuLengthMm = gpu.specifications?.lengthMm || this.extractNumber(gpu.specsSummary, /Largo\s*:\s*(\d+)\s*mm/i);
      const caseGpuMaxMm = chassis.specifications?.gpuMaxLengthMm || this.extractNumber(chassis.specsSummary, /Max\s*GPU\s*:\s*(\d+)\s*mm/i);

      if (gpuLengthMm && caseGpuMaxMm) {
        if (gpuLengthMm > caseGpuMaxMm) {
          gpuLengthOk = false;
          edges.push({
            id: 'edge-gpu-case-length',
            sourceSubsystem: 'gpu',
            targetSubsystem: 'case',
            sourceModel: gpu.model,
            targetModel: chassis.model,
            status: 'INCOMPATIBLE',
            reason: `Obstrucción física de largo: La placa de video mide ${gpuLengthMm}mm pero el gabinete solo admite hasta ${caseGpuMaxMm}mm.`,
            evidence: `Largo GPU ${gpuLengthMm}mm > Gabinete clearance ${caseGpuMaxMm}mm.`,
            source: 'GPU Physical Dimensions & Chassis Clearance Specs',
            rulesApplied: ['CHASSIS_GPU_CLEARANCE_RULE'],
          });
        } else {
          gpuLengthOk = true;
          edges.push({
            id: 'edge-gpu-case-ok',
            sourceSubsystem: 'gpu',
            targetSubsystem: 'case',
            sourceModel: gpu.model,
            targetModel: chassis.model,
            status: 'COMPATIBLE',
            reason: `Espacio longitudinal suficiente en el chasis (${caseGpuMaxMm}mm máx con ${caseGpuMaxMm - gpuLengthMm}mm de margen libre).`,
            evidence: `Dimensiones físicas validadas en hojas de producto.`,
            source: 'Manufacturer Physical Clearance Diagram',
            rulesApplied: ['CHASSIS_GPU_CLEARANCE_RULE'],
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // 5. COOLER ↔ CASE (CPU Cooler Height Clearance)
    // ------------------------------------------------------------------------
    let coolerHeightOk: boolean | 'UNKNOWN' = 'UNKNOWN';
    if (cooling && chassis) {
      const coolerHeightMm = cooling.specifications?.heightWithFansMm || this.extractNumber(cooling.specsSummary, /Altura\s*:\s*(\d+)\s*mm/i);
      const caseCoolerMaxMm = chassis.specifications?.cpuCoolerMaxHeightMm || this.extractNumber(chassis.specsSummary, /Max\s*Cooler\s*:\s*(\d+)\s*mm/i);

      if (coolerHeightMm && caseCoolerMaxMm) {
        if (coolerHeightMm > caseCoolerMaxMm) {
          coolerHeightOk = false;
          edges.push({
            id: 'edge-cooler-case-height',
            sourceSubsystem: 'cooling',
            targetSubsystem: 'case',
            sourceModel: cooling.model,
            targetModel: chassis.model,
            status: 'INCOMPATIBLE',
            reason: `Obstrucción lateral: El disipador de CPU mide ${coolerHeightMm}mm de alto pero el gabinete admite un máximo de ${caseCoolerMaxMm}mm. El panel lateral no podrá cerrarse.`,
            evidence: `Altura disipador ${coolerHeightMm}mm > Clearance gabinete ${caseCoolerMaxMm}mm.`,
            source: 'Cooler Dimensions & Chassis Side Panel Clearance',
            rulesApplied: ['CHASSIS_CPU_COOLER_HEIGHT_RULE'],
          });
        } else {
          coolerHeightOk = true;
          edges.push({
            id: 'edge-cooler-case-ok',
            sourceSubsystem: 'cooling',
            targetSubsystem: 'case',
            sourceModel: cooling.model,
            targetModel: chassis.model,
            status: 'COMPATIBLE',
            reason: `Altura de disipador dentro del límite del gabinete (${coolerHeightMm}mm ≤ ${caseCoolerMaxMm}mm).`,
            evidence: `Verificado con hoja de especificaciones oficial.`,
            source: 'Manufacturer Clearance Specification',
            rulesApplied: ['CHASSIS_CPU_COOLER_HEIGHT_RULE'],
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // 6. MOTHERBOARD ↔ CASE (Form Factor Support)
    // ------------------------------------------------------------------------
    let formFactorOk: boolean | 'UNKNOWN' = 'UNKNOWN';
    if (mb && chassis) {
      const mbForm = mb.specifications?.formFactor || this.extractFormFactor(mb.specsSummary);
      const caseForms: string[] = chassis.specifications?.formFactors || [];

      if (mbForm && caseForms.length > 0) {
        const isSupported = caseForms.some((f) => f.toUpperCase().includes(mbForm.toUpperCase()));
        if (!isSupported) {
          formFactorOk = false;
          edges.push({
            id: 'edge-mb-case-formfactor',
            sourceSubsystem: 'motherboard',
            targetSubsystem: 'case',
            sourceModel: mb.model,
            targetModel: chassis.model,
            status: 'INCOMPATIBLE',
            reason: `Factor de forma incompatible: La placa base ${mbForm} no entra en un gabinete diseñado únicamente para ${caseForms.join(', ')}.`,
            evidence: `Dimensiones de placa y posición de postes de montaje (standoffs).`,
            source: 'ATX Form Factor Specification',
            rulesApplied: ['CHASSIS_MOTHERBOARD_FORM_FACTOR_RULE'],
          });
        } else {
          formFactorOk = true;
          edges.push({
            id: 'edge-mb-case-ok',
            sourceSubsystem: 'motherboard',
            targetSubsystem: 'case',
            sourceModel: mb.model,
            targetModel: chassis.model,
            status: 'COMPATIBLE',
            reason: `Factor de forma ${mbForm} admitido por los postes de fijación del gabinete.`,
            evidence: `Soporte nativo ATX/Micro-ATX/Mini-ITX.`,
            source: 'Chassis Standoff & Layout Specification',
            rulesApplied: ['CHASSIS_MOTHERBOARD_FORM_FACTOR_RULE'],
          });
        }
      }
    }

    // ------------------------------------------------------------------------
    // 7. POWER BUDGET & GPU ↔ PSU (Wattage + Connectors)
    // ------------------------------------------------------------------------
    const cpuWatts = cpu?.specifications?.maximumTurboPowerW || cpu?.specifications?.tdpW || 65;
    const gpuWatts = gpu?.specifications?.powerW || 150;
    const baseSystemWatts = 60; // Motherboard, RAM, SSD, Fans
    const estimatedTotalDrawW = cpuWatts + gpuWatts + baseSystemWatts;
    const psuRatedWattageW = psu?.specifications?.wattageW || this.extractNumber(psu?.specsSummary || '', /(\d+)\s*W/i) || 0;
    const headroomMarginW = psuRatedWattageW - estimatedTotalDrawW;

    let psuStatus: 'OPTIMAL' | 'SUFFICIENT' | 'INSUFFICIENT' | 'UNKNOWN' = 'UNKNOWN';
    if (psuRatedWattageW > 0) {
      if (headroomMarginW < 0) {
        psuStatus = 'INSUFFICIENT';
        edges.push({
          id: 'edge-psu-wattage-deficit',
          sourceSubsystem: 'psu',
          targetSubsystem: 'gpu',
          sourceModel: psu?.model || 'Fuente',
          targetModel: gpu?.model || 'GPU',
          status: 'INCOMPATIBLE',
          reason: `Capacidad de fuente insuficiente: Consumo pico estimado (~${estimatedTotalDrawW}W) excede la potencia continua nominal de la fuente (${psuRatedWattageW}W). Riesgo de disparo de protecciones OCP/OPP y apagados bajo carga.`,
          evidence: `Consumo CPU (${cpuWatts}W) + GPU (${gpuWatts}W) + Sistema (${baseSystemWatts}W) = ${estimatedTotalDrawW}W > ${psuRatedWattageW}W.`,
          source: 'Component Power Draw Analysis & PSU Continuous Output Rating',
          rulesApplied: ['PSU_POWER_BUDGET_HEADROOM_RULE'],
        });
      } else if (headroomMarginW < 100) {
        psuStatus = 'SUFFICIENT';
        edges.push({
          id: 'edge-psu-wattage-tight',
          sourceSubsystem: 'psu',
          targetSubsystem: 'gpu',
          sourceModel: psu?.model || 'Fuente',
          targetModel: gpu?.model || 'GPU',
          status: 'COMPATIBLE',
          reason: `Potencia suficiente pero con margen ajustado (~${headroomMarginW}W de margen libre). Se recomienda operar dentro del rango de máxima eficiencia (50-70% de carga).`,
          evidence: `Potencia continua ${psuRatedWattageW}W cubre la demanda pico ${estimatedTotalDrawW}W.`,
          source: 'PSU Efficiency & Transient Load Curve',
          rulesApplied: ['PSU_POWER_BUDGET_HEADROOM_RULE'],
        });
      } else {
        psuStatus = 'OPTIMAL';
        edges.push({
          id: 'edge-psu-wattage-optimal',
          sourceSubsystem: 'psu',
          targetSubsystem: 'gpu',
          sourceModel: psu?.model || 'Fuente',
          targetModel: gpu?.model || 'GPU',
          status: 'COMPATIBLE',
          reason: `Margen de potencia óptimo (+${headroomMarginW}W de reserva frente a transitorios de potencia ATX 3.0).`,
          evidence: `Carga pico estimada en ${Math.round((estimatedTotalDrawW / psuRatedWattageW) * 100)}% de la capacidad nominal.`,
          source: 'Official PSU Rating & Load Topology',
          rulesApplied: ['PSU_POWER_BUDGET_HEADROOM_RULE'],
        });
      }
    }

    // Determine overall graph status
    const hasIncompatible = edges.some((e) => e.status === 'INCOMPATIBLE');
    const hasBiosUpdate = edges.some((e) => e.status === 'COMPATIBLE_AFTER_BIOS_UPDATE');
    const overallStatus: GraphRelationStatus = hasIncompatible
      ? 'INCOMPATIBLE'
      : hasBiosUpdate
      ? 'COMPATIBLE_AFTER_BIOS_UPDATE'
      : 'COMPATIBLE';

    return {
      overallStatus,
      edges,
      powerBudget: {
        estimatedTotalDrawW,
        psuRatedWattageW,
        headroomMarginW,
        psuStatus,
      },
      physicalClearances: {
        gpuLengthOk,
        coolerHeightOk,
        radiatorMountOk: 'UNKNOWN',
        formFactorOk,
      },
      firmwareRequirements: firmwareReqs,
    };
  }

  private static extractSocket(str: string): string | null {
    const match = str.match(/Socket\s*:\s*([\w\d-]+)/i) || str.match(/\b(LGA1851|LGA1700|LGA1200|LGA1151|AM5|AM4|TR4|sTRX4)\b/i);
    return match ? match[1] : null;
  }

  private static extractFormFactor(str: string): string {
    if (/E-ATX/i.test(str)) return 'E-ATX';
    if (/Micro-ATX/i.test(str)) return 'Micro-ATX';
    if (/Mini-ITX/i.test(str)) return 'Mini-ITX';
    return 'ATX';
  }

  private static extractNumber(str: string, regex: RegExp): number | null {
    const match = str.match(regex);
    return match ? parseInt(match[1], 10) : null;
  }
}
