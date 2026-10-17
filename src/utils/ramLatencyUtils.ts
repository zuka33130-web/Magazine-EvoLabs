// ============================================================================
// EVO LABS // METROLOGÍA DE MEMORIA RAM & LATENCIA FÍSICA (SINGLE SOURCE OF TRUTH)
// ============================================================================

export interface RamLatencyInput {
  frequencyMhz: number; // MT/s or MHz (e.g., 3200, 6000, 7200)
  cl: number;           // CAS Latency (e.g., 16, 18, 30, 36)
  tRcd?: number;        // RAS to CAS Delay (optional)
  tRp?: number;         // Row Precharge Delay (optional)
  tRas?: number;        // Active to Precharge Delay (optional)
  channelTopology?: 'single' | 'dual' | 'quad';
}

export interface RamLatencyResult {
  absoluteLatencyNs: number;
  tCkNs: number;
  evaluation: 'OPTIMAL' | 'ACCEPTABLE' | 'BOTTLENECK';
  evaluationText: string;
  bandwidthGBs: number;
  isBottleneck: boolean;
}

/**
 * Fórmula física canónica: Latencia Absoluta (ns) = (CL * 2000) / Frecuencia(MT/s)
 * Tiempo de ciclo tCK (ns) = 2000 / Frecuencia(MT/s)
 */
export function calculateRamLatency(input: RamLatencyInput): RamLatencyResult {
  const { frequencyMhz, cl, channelTopology = 'dual' } = input;
  
  if (!frequencyMhz || frequencyMhz <= 0) {
    return {
      absoluteLatencyNs: 0,
      tCkNs: 0,
      evaluation: 'BOTTLENECK',
      evaluationText: 'SIN FRECUENCIA VÁLIDA',
      bandwidthGBs: 0,
      isBottleneck: true,
    };
  }

  const absoluteLatencyNs = +((cl * 2000) / frequencyMhz).toFixed(2);
  const tCkNs = +(2000 / frequencyMhz).toFixed(3);
  const channelMultiplier = channelTopology === 'single' ? 1 : channelTopology === 'dual' ? 2 : 4;
  const bandwidthGBs = +((frequencyMhz * 8 * channelMultiplier) / 1000).toFixed(1);
  const isBottleneck = absoluteLatencyNs > 13.5;

  let evaluation: 'OPTIMAL' | 'ACCEPTABLE' | 'BOTTLENECK' = 'ACCEPTABLE';
  let evaluationText = 'NOMINAL ACEPTABLE (10.0 - 13.5 ns)';

  if (absoluteLatencyNs < 10.0) {
    evaluation = 'OPTIMAL';
    evaluationText = 'ÓPTIMO / SUB-10ns (LATENCIA EXCELENTE)';
  } else if (isBottleneck) {
    evaluation = 'BOTTLENECK';
    evaluationText = 'CRÍTICO / CUELLO DE BOTELLA (>13.5 ns)';
  }

  return {
    absoluteLatencyNs,
    tCkNs,
    evaluation,
    evaluationText,
    bandwidthGBs,
    isBottleneck,
  };
}

export const COMMON_RAM_PRESETS = [
  { label: 'DDR4-3200 CL16 (JEDEC/XMP)', freq: 3200, cl: 16, trcd: 18, trp: 18, tras: 38, type: 'DDR4' },
  { label: 'DDR4-3600 CL18 (Sweet Spot DDR4)', freq: 3600, cl: 18, trcd: 22, trp: 22, tras: 42, type: 'DDR4' },
  { label: 'DDR4-4000 CL19 (High Clock Gear 2)', freq: 4000, cl: 19, trcd: 23, trp: 23, tras: 45, type: 'DDR4' },
  { label: 'DDR5-4800 CL40 (DDR5 Base JEDEC)', freq: 4800, cl: 40, trcd: 40, trp: 40, tras: 77, type: 'DDR5' },
  { label: 'DDR5-5600 CL36 (DDR5 Mainstream)', freq: 5600, cl: 36, trcd: 38, trp: 38, tras: 76, type: 'DDR5' },
  { label: 'DDR5-6000 CL30 (AM5 Sweet Spot EXPO)', freq: 6000, cl: 30, trcd: 38, trp: 38, tras: 96, type: 'DDR5' },
  { label: 'DDR5-7200 CL34 (High-End Intel XMP)', freq: 7200, cl: 34, trcd: 42, trp: 42, tras: 84, type: 'DDR5' },
  { label: 'DDR5-8000 CL38 (Extreme Overclock)', freq: 8000, cl: 38, trcd: 48, trp: 48, tras: 90, type: 'DDR5' },
];
