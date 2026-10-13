// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — DYNAMIC BOTTLENECK ENGINE
// Temporal Window Bottleneck Analysis with Contextual Causal Classification
// Principle: "NO DETERMINAR CUELLO DE BOTELLA CON UNA ÚNICA MUESTRA. ANALIZAR VENTANAS."
// ============================================================================

import { LimitingFactorKind, DigitalTwinFrame } from './types';

export class DynamicBottleneckEngine {
  /**
   * Analyzes an instantaneous frame and determines the exact limiting factor
   */
  static classifyInstantaneous(
    frame: {
      cpuSingleThreadPct: number;
      cpuTotalLoadPct: number;
      cpuThermalHeadroomC: number;
      isCpuThrottling: boolean;
      gpuRasterPct: number;
      gpuThermalHeadroomC: number;
      isGpuThrottling: boolean;
      vramPressurePct: number;
      ramPressurePct: number;
      ramBandwidthUsagePct: number;
      storageQueuePressurePct: number;
      psuHeadroomPct: number;
    }
  ): { factor: LimitingFactorKind; reasonEs: string } {
    // 1. Thermal Throttling / Limits
    if (frame.isGpuThrottling || frame.gpuThermalHeadroomC <= 1.0) {
      return {
        factor: 'GPU_THERMAL_LIMIT',
        reasonEs: 'La GPU alcanzó su límite térmico operativo, reduciendo frecuencia para proteger el silicio.',
      };
    }
    if (frame.isCpuThrottling || frame.cpuThermalHeadroomC <= 2.0) {
      return {
        factor: 'CPU_THERMAL_THROTTLING',
        reasonEs: 'El procesador alcanzó TJMax (temperatura de unión máxima), entrando en throttling térmico.',
      };
    }

    // 2. VRAM Saturation (Asset swapping to system RAM / PCIe overhead)
    if (frame.vramPressurePct >= 96) {
      return {
        factor: 'VRAM_PRESSURE',
        reasonEs: 'La memoria de video dedicada (VRAM) está saturada; el motor gráfico debe paginar texturas a la RAM del sistema.',
      };
    }

    // 3. RAM Capacity / Bandwidth
    if (frame.ramPressurePct >= 92) {
      return {
        factor: 'RAM_CAPACITY_LIMIT',
        reasonEs: 'La memoria RAM del sistema superó el 92% de capacidad; riesgo inminente de swapping en disco y stuttering.',
      };
    }
    if (frame.ramBandwidthUsagePct >= 90) {
      return {
        factor: 'RAM_BANDWIDTH_LIMIT',
        reasonEs: 'El bus de memoria DDR está saturado por la demanda simultánea de la CPU y buffers de texturas.',
      };
    }

    // 4. CPU Single-Thread Bottleneck (Draw call saturation)
    if (frame.cpuSingleThreadPct >= 88 && frame.gpuRasterPct < 75) {
      return {
        factor: 'CPU_MAIN_THREAD_PRESSURE',
        reasonEs: 'El hilo principal del juego o aplicación satura un núcleo de CPU, limitando la tasa de despacho hacia la GPU.',
      };
    }

    // 5. CPU Multi-Thread Limit
    if (frame.cpuTotalLoadPct >= 90 && frame.gpuRasterPct < 80) {
      return {
        factor: 'CPU_MULTITHREAD_LIMIT',
        reasonEs: 'Todos los núcleos e hilos de procesamiento están saturados por tareas de física, audio y render multinúcleo.',
      };
    }

    // 6. GPU Bound (Normal Healthy Gaming State)
    if (frame.gpuRasterPct >= 88) {
      return {
        factor: 'HEALTHY_GPU_BOUND',
        reasonEs: 'La placa de video trabaja a plena utilización. Comportamiento óptimo y equilibrado para una experiencia de juego.',
      };
    }

    // 7. Storage Bottleneck (Assets streaming)
    if (frame.storageQueuePressurePct >= 92) {
      return {
        factor: 'STORAGE_STREAMING_LIMIT',
        reasonEs: 'El almacenamiento secundario está saturado transfiriendo texturas y geometría hacia la memoria.',
      };
    }

    // 8. Power Headroom Reduced
    if (frame.psuHeadroomPct < 15) {
      return {
        factor: 'PSU_HEADROOM_REDUCED',
        reasonEs: 'La fuente de poder opera con margen de seguridad muy reducido ante picos transitorios.',
      };
    }

    return {
      factor: 'NONE_DETECTED',
      reasonEs: 'Todos los subsistemas operan dentro de márgenes holgados de capacidad y temperatura.',
    };
  }

  /**
   * Evaluates the entire timeline of frames and computes duration and percentage breakdown
   */
  static computeSessionBottleneckTimeline(frames: DigitalTwinFrame[]): {
    dominantFactor: LimitingFactorKind;
    percentages: { factor: LimitingFactorKind; label: string; durationSeconds: number; percentage: number }[];
  } {
    if (frames.length === 0) {
      return {
        dominantFactor: 'NONE_DETECTED',
        percentages: [],
      };
    }

    const counts: Record<string, number> = {};
    for (const f of frames) {
      counts[f.limitingFactor] = (counts[f.limitingFactor] || 0) + 1;
    }

    const totalSeconds = frames.length;
    const percentages = Object.entries(counts).map(([factor, count]) => {
      const pct = Math.round((count / totalSeconds) * 100);
      return {
        factor: factor as LimitingFactorKind,
        label: this.getFactorLabel(factor as LimitingFactorKind),
        durationSeconds: count,
        percentage: pct,
      };
    }).sort((a, b) => b.durationSeconds - a.durationSeconds);

    const dominantFactor = percentages[0]?.factor || 'NONE_DETECTED';

    return {
      dominantFactor,
      percentages,
    };
  }

  static getFactorLabel(factor: LimitingFactorKind): string {
    switch (factor) {
      case 'HEALTHY_GPU_BOUND':
        return 'GPU Plena Carga (Óptimo)';
      case 'GPU_THERMAL_LIMIT':
        return 'Límite Térmico de GPU';
      case 'GPU_POWER_LIMIT':
        return 'Límite de Potencia de GPU';
      case 'CPU_MAIN_THREAD_PRESSURE':
        return 'Saturación Hilo Principal CPU';
      case 'CPU_MULTITHREAD_LIMIT':
        return 'Límite Multinúcleo CPU';
      case 'CPU_THERMAL_THROTTLING':
        return 'Throttling Térmico CPU (TJMax)';
      case 'VRAM_PRESSURE':
        return 'Saturación de VRAM';
      case 'RAM_CAPACITY_LIMIT':
        return 'Saturación Capacidad RAM';
      case 'RAM_BANDWIDTH_LIMIT':
        return 'Ancho de Banda de RAM';
      case 'STORAGE_STREAMING_LIMIT':
        return 'Saturación de Almacenamiento';
      case 'PSU_HEADROOM_REDUCED':
        return 'Margen Reducido de Fuente (PSU)';
      case 'NONE_DETECTED':
      default:
        return 'Sin Limitación Crítica';
    }
  }
}
