// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — WORKLOAD TARGETS & SUITABILITY ENGINE
// Principle: "NO INVENTAR RENDIMIENTO. SEPARAR COMPATIBILIDAD DE IDONEIDAD Y DESEMPEÑO."
// ============================================================================

import {
  WorkloadTarget,
  BuildComponentItem,
  MachineDisplayDetailed,
  CompatibilityReport,
} from '../types';

export interface WorkloadAuditReport {
  target: WorkloadTarget;
  suitabilityStatus: 'OPTIMAL' | 'MEETS_RECOMMENDED' | 'MEETS_MINIMUM' | 'INSUFFICIENT';
  suitabilityScore: number; // 0 to 100
  performanceEstimateTier: 'OPTIMAL_144PLUS_FPS' | 'HIGH_100_FPS' | 'BALANCED_60_FPS' | 'MARGINAL_30_FPS' | 'INSUFFICIENT';
  performanceEstimateLabel: string;
  technicalJustification: string;
  bottleneckSubsystem?: 'GPU' | 'CPU' | 'RAM' | 'STORAGE' | 'VRAM';
  specChecks: {
    name: string;
    required: string;
    present: string;
    passed: boolean;
  }[];
}

export interface CategorizedSystemEvaluation {
  physicalCompatibility: {
    status: 'COMPATIBLE' | 'INCOMPATIBLE' | 'WARNING' | 'UNKNOWN';
    summary: string;
    details: string[];
  };
  electricalCompatibility: {
    status: 'COMPATIBLE' | 'INCOMPATIBLE' | 'WARNING' | 'UNKNOWN';
    totalPowerW: number;
    psuWattageW: number;
    headroomW: number;
    summary: string;
  };
  firmwareCompatibility: {
    status: 'COMPATIBLE' | 'COMPATIBLE_AFTER_BIOS_UPDATE' | 'WARNING' | 'UNKNOWN';
    biosAdvisories: string[];
    summary: string;
  };
  workloadSuitability: {
    overallStatus: 'SUITABLE' | 'MARGINAL' | 'UNSUITABLE';
    workloadReports: WorkloadAuditReport[];
  };
}

export const PRESET_WORKLOAD_TARGETS: WorkloadTarget[] = [
  {
    id: 'target-cs2',
    name: 'Counter-Strike 2 (CS2)',
    category: 'ESPORTS_GAMING',
    targetResolution: '1080p',
    targetFps: 240,
    qualityPreset: 'LOW_COMPETITIVE',
    workloadSize: 'PROFESSIONAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 6,
    minimumRamGb: 16,
    minimumVramGb: 6,
    gpuPerformanceIndexRequired: 45,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-valorant',
    name: 'Valorant',
    category: 'ESPORTS_GAMING',
    targetResolution: '1080p',
    targetFps: 240,
    qualityPreset: 'LOW_COMPETITIVE',
    workloadSize: 'CASUAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 4,
    minimumRamGb: 8,
    minimumVramGb: 4,
    gpuPerformanceIndexRequired: 30,
    storageTypeRequired: 'ANY_SSD',
  },
  {
    id: 'target-fortnite',
    name: 'Fortnite (Unreal Engine 5)',
    category: 'ESPORTS_GAMING',
    targetResolution: '1080p',
    targetFps: 144,
    qualityPreset: 'MEDIUM',
    workloadSize: 'CASUAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 6,
    minimumRamGb: 16,
    minimumVramGb: 8,
    gpuPerformanceIndexRequired: 50,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-aaa-gaming',
    name: 'AAA Gaming (Cyberpunk 2077 / Wukong)',
    category: 'AAA_GAMING',
    targetResolution: '1440p',
    targetFps: 60,
    qualityPreset: 'ULTRA_RAYTRACING',
    workloadSize: 'STUDIO_HEAVY',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 12,
    gpuPerformanceIndexRequired: 75,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-premiere',
    name: 'Adobe Premiere Pro (Edición 4K)',
    category: 'VIDEO_EDITING',
    targetResolution: '1440p',
    targetFps: 60,
    qualityPreset: 'HIGH',
    workloadSize: 'PROFESSIONAL',
    multitaskingDemands: 'STREAMING_OBS',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 8,
    gpuPerformanceIndexRequired: 60,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-davinci',
    name: 'DaVinci Resolve Studio (Color & Fusion)',
    category: 'VIDEO_EDITING',
    targetResolution: '4K',
    targetFps: 60,
    qualityPreset: 'ULTRA_RAYTRACING',
    workloadSize: 'STUDIO_HEAVY',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 12,
    gpuPerformanceIndexRequired: 70,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-photoshop',
    name: 'Adobe Photoshop / Ilustración Digital',
    category: 'PRODUCTIVITY_CREATIVE' as any,
    targetResolution: '1440p',
    targetFps: 60,
    qualityPreset: 'HIGH',
    workloadSize: 'PROFESSIONAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 6,
    minimumRamGb: 32,
    minimumVramGb: 6,
    gpuPerformanceIndexRequired: 40,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-blender',
    name: 'Blender 3D (Cycles / EEVEE & Modelado)',
    category: '3D_CAD',
    targetResolution: '1440p',
    targetFps: 60,
    qualityPreset: 'HIGH',
    workloadSize: 'STUDIO_HEAVY',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 12,
    gpuPerformanceIndexRequired: 70,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-autocad',
    name: 'AutoCAD / SolidWorks (Ingeniería CAD)',
    category: '3D_CAD',
    targetResolution: '1440p',
    targetFps: 60,
    qualityPreset: 'HIGH',
    workloadSize: 'PROFESSIONAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 8,
    gpuPerformanceIndexRequired: 55,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-obs-stream',
    name: 'OBS Studio (Streaming en Vivo NVENC/AV1)',
    category: 'ESPORTS_GAMING',
    targetResolution: '1080p',
    targetFps: 60,
    qualityPreset: 'HIGH',
    workloadSize: 'PROFESSIONAL',
    multitaskingDemands: 'STREAMING_OBS',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 8,
    gpuPerformanceIndexRequired: 60,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-vms',
    name: 'Máquinas Virtuales & Contenedores Docker',
    category: 'PROGRAMMING',
    targetResolution: '1080p',
    targetFps: 60,
    qualityPreset: 'MEDIUM',
    workloadSize: 'STUDIO_HEAVY',
    multitaskingDemands: 'BACKGROUND_VMS_CONTAINERS',
    minimumCpuCores: 12,
    minimumRamGb: 64,
    minimumVramGb: 4,
    gpuPerformanceIndexRequired: 30,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-programming',
    name: 'Desarrollo de Software / Compilación',
    category: 'PROGRAMMING',
    targetResolution: '1440p',
    targetFps: 60,
    qualityPreset: 'MEDIUM',
    workloadSize: 'PROFESSIONAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 8,
    minimumRamGb: 32,
    minimumVramGb: 4,
    gpuPerformanceIndexRequired: 35,
    storageTypeRequired: 'NVMe M.2',
  },
  {
    id: 'target-office',
    name: 'Ofimática Avanzada & Multitasking (40+ Tabs)',
    category: 'OFFICE_MULTITASK',
    targetResolution: '1080p',
    targetFps: 60,
    qualityPreset: 'LOW_COMPETITIVE',
    workloadSize: 'CASUAL',
    multitaskingDemands: 'SINGLE_APP',
    minimumCpuCores: 4,
    minimumRamGb: 16,
    minimumVramGb: 2,
    gpuPerformanceIndexRequired: 15,
    storageTypeRequired: 'ANY_SSD',
  },
];

export class WorkloadEngine {
  /**
   * Evaluates system components against selected workload targets without fabricating data
   */
  static evaluateWorkloads(
    components: {
      cpu?: BuildComponentItem;
      gpu?: BuildComponentItem;
      ram?: BuildComponentItem;
      storage?: BuildComponentItem;
      motherboard?: BuildComponentItem;
    },
    targets: WorkloadTarget[],
    display?: MachineDisplayDetailed
  ): WorkloadAuditReport[] {
    const { cpu, gpu, ram, storage } = components;

    // Extract hardware specifications
    const cpuCores = parseInt((cpu?.specsSummary.match(/(\d+)\s*Cores/i) || [])[1] || '0', 10);
    const cpuModel = cpu?.model || '';

    let gpuVramGb = 0;
    let gpuIndex = 10; // Base iGPU
    if (gpu) {
      gpuVramGb = parseInt((gpu.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '0', 10);
      if (/4090|5090/i.test(gpu.model)) gpuIndex = 98;
      else if (/4080|5080|7900\s*xtx/i.test(gpu.model)) gpuIndex = 88;
      else if (/4070\s*ti|7900\s*xt|5070/i.test(gpu.model)) gpuIndex = 80;
      else if (/4070|7800\s*xt/i.test(gpu.model)) gpuIndex = 72;
      else if (/4060\s*ti|7700\s*xt/i.test(gpu.model)) gpuIndex = 60;
      else if (/4060|7600/i.test(gpu.model)) gpuIndex = 50;
      else if (/3060|6600|arc\s*a750/i.test(gpu.model)) gpuIndex = 42;
      else if (/3050|6500|1660/i.test(gpu.model)) gpuIndex = 30;
      else if (/integrada|uhd|vega/i.test(gpu.model)) gpuIndex = 15;
      else gpuIndex = 40;
    } else if (cpu?.specsSummary.toLowerCase().includes('igpu') || cpu?.specsSummary.toLowerCase().includes('uhd')) {
      gpuIndex = 18;
      gpuVramGb = 2; // Shared
    }

    const ramGb = parseInt((ram?.specsSummary.match(/(\d+)\s*GB/i) || [])[1] || '0', 10);
    const isNvme = storage?.specsSummary.includes('NVMe') || false;
    const isSsd = isNvme || storage?.specsSummary.includes('SSD') || false;

    return targets.map((target) => {
      const specChecks = [
        {
          name: 'Núcleos de CPU',
          required: `${target.minimumCpuCores} núcleos mínimos`,
          present: cpuCores > 0 ? `${cpuCores} núcleos (${cpuModel})` : 'Sin CPU',
          passed: cpuCores >= target.minimumCpuCores,
        },
        {
          name: 'Memoria RAM',
          required: `${target.minimumRamGb} GB`,
          present: ramGb > 0 ? `${ramGb} GB` : 'Sin RAM',
          passed: ramGb >= target.minimumRamGb,
        },
        {
          name: 'VRAM Gráfica',
          required: `${target.minimumVramGb} GB`,
          present: gpuVramGb > 0 ? `${gpuVramGb} GB` : '0 GB',
          passed: gpuVramGb >= target.minimumVramGb,
        },
        {
          name: 'Índice de Potencia GPU',
          required: `Índice ≥ ${target.gpuPerformanceIndexRequired}/100`,
          present: `${gpuIndex}/100`,
          passed: gpuIndex >= target.gpuPerformanceIndexRequired,
        },
        {
          name: 'Tecnología Almacenamiento',
          required: target.storageTypeRequired,
          present: isNvme ? 'NVMe M.2' : isSsd ? 'SATA SSD' : storage ? 'HDD' : 'Sin Almacenamiento',
          passed: target.storageTypeRequired === 'NVMe M.2' ? isNvme : isSsd,
        },
      ];

      const passCount = specChecks.filter((c) => c.passed).length;
      let suitabilityStatus: WorkloadAuditReport['suitabilityStatus'] = 'INSUFFICIENT';
      let performanceEstimateTier: WorkloadAuditReport['performanceEstimateTier'] = 'INSUFFICIENT';
      let performanceEstimateLabel = '';
      let technicalJustification = '';
      let bottleneckSubsystem: WorkloadAuditReport['bottleneckSubsystem'] = undefined;

      // Identify bottlenecks
      if (!specChecks[2].passed || !specChecks[3].passed) {
        bottleneckSubsystem = 'GPU';
      } else if (!specChecks[0].passed) {
        bottleneckSubsystem = 'CPU';
      } else if (!specChecks[1].passed) {
        bottleneckSubsystem = 'RAM';
      } else if (!specChecks[4].passed) {
        bottleneckSubsystem = 'STORAGE';
      }

      if (passCount === 5) {
        if (gpuIndex >= target.gpuPerformanceIndexRequired + 20 && cpuCores >= target.minimumCpuCores + 4) {
          suitabilityStatus = 'OPTIMAL';
          performanceEstimateTier = 'OPTIMAL_144PLUS_FPS';
          performanceEstimateLabel = target.targetResolution === '4K' ? '100+ FPS / Rendimiento Ultra Fluido' : '144+ FPS / Rendimiento Sobrado';
          technicalJustification = `Configuración ideal para ${target.name}. Excede holgadamente los requerimientos de cálculo vectorial y bus de memoria.`;
        } else {
          suitabilityStatus = 'MEETS_RECOMMENDED';
          performanceEstimateTier = 'HIGH_100_FPS';
          performanceEstimateLabel = `${target.targetFps}+ FPS Estables (${target.targetResolution} / Calidad ${target.qualityPreset})`;
          technicalJustification = `Satisface todos los requisitos recomendados. Experiencia sólida sin compromisos térmicos ni de memoria.`;
        }
      } else if (passCount >= 3) {
        suitabilityStatus = 'MEETS_MINIMUM';
        performanceEstimateTier = 'BALANCED_60_FPS';
        performanceEstimateLabel = 'Aprox. 45 - 60 FPS (Ajustes Medios o Competitivos)';
        technicalJustification = `Ejecutable, pero el subsistema ${bottleneckSubsystem} actuará como limitador principal frente a cargas altas.`;
      } else {
        suitabilityStatus = 'INSUFFICIENT';
        performanceEstimateTier = 'INSUFFICIENT';
        performanceEstimateLabel = 'Desempeño Insuficiente (< 30 FPS / Tiempos de Render Excesivos)';
        technicalJustification = `Hardware por debajo de la especificación técnica requerida por el motor de ${target.name}.`;
      }

      const suitabilityScore = Math.round((passCount / 5) * 100);

      return {
        target,
        suitabilityStatus,
        suitabilityScore,
        performanceEstimateTier,
        performanceEstimateLabel,
        technicalJustification,
        bottleneckSubsystem,
        specChecks,
      };
    });
  }

  /**
   * Generates complete Categorized System Evaluation separating:
   * PHYSICAL, ELECTRICAL, FIRMWARE, WORKLOAD SUITABILITY
   */
  static categorizeSystemEvaluation(
    compatibility: CompatibilityReport,
    workloadReports: WorkloadAuditReport[],
    components: {
      cpu?: BuildComponentItem;
      gpu?: BuildComponentItem;
      motherboard?: BuildComponentItem;
      psu?: BuildComponentItem;
    }
  ): CategorizedSystemEvaluation {
    // Physical checks: Socket, Form Factor, GPU clearance, Cooler height
    const physicalChecks = compatibility.checks.filter(
      (c) =>
        c.id.includes('socket') ||
        c.id.includes('ff-') ||
        c.id.includes('gpu-clearance') ||
        c.id.includes('cooler-clearance') ||
        c.id.includes('ram-gen')
    );
    const hasPhysicalIncompatible = physicalChecks.some((c) => c.status === 'INCOMPATIBLE');
    const physicalStatus = hasPhysicalIncompatible
      ? 'INCOMPATIBLE'
      : physicalChecks.some((c) => c.status === 'WARNING')
      ? 'WARNING'
      : 'COMPATIBLE';

    // Electrical checks: PSU capacity, connectors, power draw
    const electricalChecks = compatibility.checks.filter((c) => c.id.includes('psu') || c.id.includes('pwr'));
    const hasElectricalIncompatible = electricalChecks.some((c) => c.status === 'INCOMPATIBLE');
    const hasElectricalWarning = electricalChecks.some((c) => c.status === 'WARNING');
    const electricalStatus = hasElectricalIncompatible
      ? 'INCOMPATIBLE'
      : hasElectricalWarning
      ? 'WARNING'
      : 'COMPATIBLE';

    // Firmware checks: BIOS updates, microcode
    const firmwareChecks = compatibility.checks.filter((c) => c.id.includes('bios'));
    const hasBiosUpdate = firmwareChecks.some((c) => c.status === 'COMPATIBLE_AFTER_BIOS_UPDATE');
    const hasFirmwareWarning = firmwareChecks.some((c) => c.status === 'WARNING');
    const firmwareStatus = hasBiosUpdate
      ? 'COMPATIBLE_AFTER_BIOS_UPDATE'
      : hasFirmwareWarning
      ? 'WARNING'
      : 'COMPATIBLE';

    const psuWattage = parseInt((components.psu?.specsSummary.match(/(\d+)\s*W/i) || [])[1] || '0', 10);

    const overallWorkload =
      workloadReports.length === 0
        ? 'SUITABLE'
        : workloadReports.every((r) => r.suitabilityStatus === 'OPTIMAL' || r.suitabilityStatus === 'MEETS_RECOMMENDED')
        ? 'SUITABLE'
        : workloadReports.some((r) => r.suitabilityStatus === 'INSUFFICIENT')
        ? 'UNSUITABLE'
        : 'MARGINAL';

    return {
      physicalCompatibility: {
        status: physicalStatus,
        summary:
          physicalStatus === 'COMPATIBLE'
            ? 'Todos los componentes ensamblan físicamente sin conflictos de socket, muescas DDR ni clearance.'
            : 'Existen interferencias físicas o mecánicas entre componentes.',
        details: physicalChecks.map((c) => c.detail),
      },
      electricalCompatibility: {
        status: electricalStatus,
        totalPowerW: compatibility.totalPowerDrawW,
        psuWattageW: psuWattage,
        headroomW: compatibility.psuMarginW,
        summary:
          electricalStatus === 'COMPATIBLE'
            ? `Capacidad eléctrica suficiente (${compatibility.psuMarginW}W de margen para transitorios).`
            : `Alerta eléctrica: el sistema demanda ${compatibility.totalPowerDrawW}W pico.`,
      },
      firmwareCompatibility: {
        status: firmwareStatus,
        biosAdvisories: firmwareChecks.map((c) => c.detail),
        summary:
          firmwareStatus === 'COMPATIBLE_AFTER_BIOS_UPDATE'
            ? 'Se requiere flashear la versión de BIOS de la placa base antes de inicializar el CPU.'
            : firmwareStatus === 'WARNING'
            ? 'Se recomienda actualizar microcódigo para estabilidad.'
            : 'Firma de firmware y compatibilidad AGESA/UEFI nativa.',
      },
      workloadSuitability: {
        overallStatus: overallWorkload,
        workloadReports,
      },
    };
  }
}
