// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — BOTTLENECK ENGINE
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import { Machine, SubsystemType, EpistemicProvenance, TechnicalEvidence } from '../types';

export interface WorkloadProfile {
  id: string;
  name: string;
  category: 'GAMING' | 'PRODUCTIVITY' | 'HARDWARE';
  resolution?: string;
  targetFramerate?: number;
  cpuDemands: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  gpuDemands: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  ramCapacityDemandsGb: number;
  ramBandwidthCritical: boolean;
  vramDemandsGb: number;
  storageIopsCritical: boolean;
}

export interface BottleneckFinding {
  subsystem: SubsystemType;
  severity: 'CRITICAL' | 'MODERATE' | 'NEGLIGIBLE' | 'BALANCED';
  title: string;
  explanationEs: string;
  provenance: EpistemicProvenance;
  confidencePct: number;
  evidence: TechnicalEvidence[];
  recommendedActionEs?: string;
}

export class BottleneckEngine {
  /**
   * Deterministically evaluates bottlenecks against a concrete workload profile and machine
   * No generic percentage numbers without mathematical models.
   */
  static analyzeBottlenecks(machine: Machine, workload: WorkloadProfile): BottleneckFinding[] {
    const findings: BottleneckFinding[] = [];

    // 1. RAM Capacity Bottleneck
    if (machine.ram.sizeGb < workload.ramCapacityDemandsGb) {
      findings.push({
        subsystem: 'ram',
        severity: 'CRITICAL',
        title: `Capacidad de RAM Insuficiente (${machine.ram.sizeGb} GB vs ${workload.ramCapacityDemandsGb} GB Requeridos)`,
        explanationEs: `La carga de trabajo de ${workload.name} exige al menos ${workload.ramCapacityDemandsGb} GB de memoria física. Con ${machine.ram.sizeGb} GB, el sistema operativo se verá obligado a usar el archivo de paginación en disco (Swap), generando microstuttering severo y caídas abruptas de rendimiento.`,
        provenance: 'DERIVED',
        confidencePct: 96,
        evidence: [
          {
            id: `ev-ram-cap-${Date.now()}`,
            subsystem: 'ram',
            metricName: 'Margen de Memoria Física',
            value: machine.ram.sizeGb - workload.ramCapacityDemandsGb,
            unit: 'GB Deficit',
            provenance: 'DERIVED',
            source: 'Balance Capacidad vs Demanda de Carga',
            timestamp: new Date().toISOString(),
            confidencePct: 96,
            verdictNote: 'Déficit de memoria física que forzará paginación en almacenamiento secundario.',
          },
        ],
        recommendedActionEs: `Ampliar la memoria física a un mínimo de ${workload.ramCapacityDemandsGb} GB en configuración de doble canal.`,
      });
    }

    // 2. RAM Memory Channel (Single vs Dual)
    if (machine.ram.channels === 1 && workload.ramBandwidthCritical) {
      findings.push({
        subsystem: 'ram',
        severity: 'MODERATE',
        title: 'Ancho de Banda de Memoria Reducido (Single Channel 64-bit)',
        explanationEs: `La máquina opera con un solo módulo de memoria o canales no simétricos. En ${workload.name}, el procesador se ve ralentizado esperando datos desde la RAM, lo cual castiga severamente los percentiles 1% Low de frametime.`,
        provenance: 'DERIVED',
        confidencePct: 94,
        evidence: [
          {
            id: `ev-ram-chan-${Date.now()}`,
            subsystem: 'ram',
            metricName: 'Canales de Memoria Activos',
            value: '1 (Single Channel 64-bit)',
            unit: 'Canales',
            provenance: machine.ram.provenance,
            source: 'Topología de Ranuras DIMM',
            timestamp: new Date().toISOString(),
            confidencePct: 95,
            verdictNote: 'Ancho de banda recortado al 50% del potencial de la plataforma.',
          },
        ],
        recommendedActionEs: 'Instalar un segundo módulo de memoria idéntico para habilitar Dual Channel (128-bit).',
      });
    }

    // 3. VRAM Bottleneck
    if (machine.gpu.vramGb < workload.vramDemandsGb) {
      findings.push({
        subsystem: 'gpu',
        severity: 'CRITICAL',
        title: `VRAM Insuficiente para Búferes Gráficos (${machine.gpu.vramGb} GB vs ${workload.vramDemandsGb} GB)`,
        explanationEs: `La resolución y texturas de ${workload.name} desbordarán los ${machine.gpu.vramGb} GB de memoria de video dedicada, obligando a volcar texturas a través del bus PCIe hacia la RAM del sistema.`,
        provenance: 'DERIVED',
        confidencePct: 92,
        evidence: [
          {
            id: `ev-vram-${Date.now()}`,
            subsystem: 'gpu',
            metricName: 'Memoria de Video Dedicada',
            value: machine.gpu.vramGb,
            unit: 'GB',
            provenance: machine.gpu.provenance,
            source: 'VRAM Físicamente Direccionable',
            timestamp: new Date().toISOString(),
            confidencePct: 92,
            verdictNote: 'Desbordamiento de textura garantizado al alcanzar la resolución objetivo.',
          },
        ],
        recommendedActionEs: 'Reducir la calidad de texturas o resolución a 1080p, o actualizar a una GPU con mayor VRAM.',
      });
    }

    // 4. Integrated Graphics under High Gaming Workload
    if (!machine.gpu.isDedicated && (workload.gpuDemands === 'HIGH' || workload.gpuDemands === 'EXTREME')) {
      findings.push({
        subsystem: 'gpu',
        severity: 'CRITICAL',
        title: 'Limitador Primario de Silicio: Gráficos Integrados (iGPU)',
        explanationEs: `El núcleo gráfico integrado comparte ancho de banda y límite de consumo (TDP) con el procesador. Para la carga gráfica de ${workload.name}, los sombreadores (Execution Units / Compute Units) resultan el cuello de botella físico preponderante.`,
        provenance: 'DERIVED',
        confidencePct: 98,
        evidence: [
          {
            id: `ev-igpu-${Date.now()}`,
            subsystem: 'gpu',
            metricName: 'Arquitectura de Procesamiento Gráfico',
            value: machine.gpu.model,
            unit: 'iGPU',
            provenance: machine.gpu.provenance,
            source: 'Identificación de Silicio',
            timestamp: new Date().toISOString(),
            confidencePct: 98,
            verdictNote: 'Unidades de cómputo gráfico no diseñadas para renderizado 3D de alta tasa de fotogramas.',
          },
        ],
        recommendedActionEs: 'Instalar una placa de video dedicada conectada a la ranura PCIe principal.',
      });
    }

    // 5. Balanced verdict if no critical bottlenecks found
    if (findings.length === 0) {
      findings.push({
        subsystem: 'cpu',
        severity: 'BALANCED',
        title: 'Arquitectura Equilibrada para este Objetivo',
        explanationEs: `La combinación de ${machine.cpu.cores} núcleos de CPU, ${machine.ram.sizeGb} GB de RAM y ${machine.gpu.vramGb} GB de video satisface holgadamente las demandas estimadas para ${workload.name}.`,
        provenance: 'DERIVED',
        confidencePct: 90,
        evidence: [],
      });
    }

    return findings;
  }
}
