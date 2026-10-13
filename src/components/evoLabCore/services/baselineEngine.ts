// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — BASELINE & PERFORMANCE MONITOR
// Principle: "NO SE ADIVINA. SE MIDE."
// ============================================================================

import { Machine, EpistemicProvenance, TechnicalEvidence } from '../types';

export interface BaselineMetricReading {
  subsystem: 'cpu' | 'ram' | 'gpu' | 'storage' | 'network' | 'kernel' | 'thermal';
  label: string;
  value: string | number;
  unit: string;
  provenance: EpistemicProvenance;
  source: string;
  confidencePct: number;
  status: 'OPTIMAL' | 'ELEVATED' | 'LIMITING' | 'UNKNOWN';
  notes: string;
}

export interface BaselineSnapshot {
  machineId: string;
  alias: string;
  timestamp: string;
  overallHealthStatus: 'READY' | 'ATTENTION' | 'INVESTIGATION_RECOMMENDED';
  readings: BaselineMetricReading[];
  primaryLimiterCandidate?: string;
  summaryEs: string;
}

export class BaselineEngine {
  /**
   * Automatically compiles a Baseline Snapshot from the active Machine
   * Strictly respects epistemological provenance (MEASURED vs ESTIMATED vs UNKNOWN)
   */
  static captureBaseline(machine: Machine): BaselineSnapshot {
    const readings: BaselineMetricReading[] = [];
    const timestamp = new Date().toISOString();

    // 1. CPU Reading
    readings.push({
      subsystem: 'cpu',
      label: 'Frecuencia y Topología de Silicio',
      value: `${machine.cpu.cores} Cores / ${machine.cpu.threads} Threads`,
      unit: 'Cores',
      provenance: machine.cpu.provenance,
      source: machine.isDetected ? 'WMI Win32_Processor' : 'Ficha Técnica Declarada',
      confidencePct: machine.isDetected ? 100 : 90,
      status: 'OPTIMAL',
      notes: `Modelo: ${machine.cpu.model.split('@')[0].trim()} (TDP: ${machine.cpu.tdpW}W)`,
    });

    // 2. RAM Reading
    const isSingleChannel = machine.ram.channels === 1;
    readings.push({
      subsystem: 'ram',
      label: 'Capacidad y Ancho de Banda de Memoria',
      value: `${machine.ram.sizeGb} GB @ ${machine.ram.configuredSpeedMts} MT/s`,
      unit: 'GB + MT/s',
      provenance: machine.ram.provenance,
      source: machine.isDetected ? 'WMI Win32_PhysicalMemory' : 'Configuración de Silicio',
      confidencePct: machine.isDetected ? 100 : 90,
      status: isSingleChannel ? 'ELEVATED' : 'OPTIMAL',
      notes: isSingleChannel
        ? 'Canal único (Single Channel): El ancho de banda de memoria está reducido a la mitad (64-bit).'
        : `Doble Canal (Dual Channel): Interfaz de 128-bit activa con ancho de banda completo.`,
    });

    // 3. GPU Reading
    readings.push({
      subsystem: 'gpu',
      label: 'Adaptador de Video y Memoria VRAM',
      value: `${machine.gpu.vramGb} GB VRAM`,
      unit: 'GB',
      provenance: machine.gpu.provenance,
      source: machine.isDetected ? 'WMI Win32_VideoController' : 'Especificación de Video',
      confidencePct: machine.isDetected ? 95 : 90,
      status: 'OPTIMAL',
      notes: `${machine.gpu.model} (${machine.gpu.isDedicated ? 'GPU Dedicada' : 'Gráficos Integrados en CPU'})`,
    });

    // 4. STORAGE Reading
    readings.push({
      subsystem: 'storage',
      label: 'Subsistema de Almacenamiento Principal',
      value: `${machine.storage.capacityGb} GB`,
      unit: 'GB',
      provenance: machine.storage.provenance,
      source: machine.storage.model || 'Unidad de Almacenamiento',
      confidencePct: 85,
      status: 'OPTIMAL',
      notes: `Interfaz: ${machine.storage.type}`,
    });

    // 5. THERMAL / COOLING Reading
    const coolerCap = machine.cooling.tdpCapacityW;
    const cpuTdp = machine.cpu.tdpW;
    const thermalTight = coolerCap > 0 && cpuTdp > 0 && coolerCap < cpuTdp * 1.15;
    readings.push({
      subsystem: 'thermal',
      label: 'Margen de Refrigeración Térmica (Cooler vs TDP)',
      value: `${coolerCap}W vs ${cpuTdp}W`,
      unit: 'Watts TDP',
      provenance: machine.cooling.provenance,
      source: 'Balance Térmico Conductor/IHS',
      confidencePct: 88,
      status: thermalTight ? 'ELEVATED' : 'OPTIMAL',
      notes: thermalTight
        ? 'El cooler está ajustado para el TDP máximo de la CPU. Puede alcanzar TjMax bajo cargas pesadas prolongadas.'
        : 'Margen térmico adecuado para disipar la carga continua del silicio.',
    });

    // 6. POWER / PSU Margin
    const estPwrDraw = machine.cpu.tdpW + machine.gpu.powerW + 75;
    const psuW = machine.psu.wattageW;
    const psuMargin = psuW - estPwrDraw;
    readings.push({
      subsystem: 'storage', // electric / power
      label: 'Holgura de Fuente de Poder (PSU Margin)',
      value: `${psuMargin}W Margen (${psuW}W PSU / ~${estPwrDraw}W Pico)`,
      unit: 'Watts',
      provenance: 'DERIVED',
      source: 'Cálculo de Consumo Estimado de Rieles',
      confidencePct: 92,
      status: psuMargin < 50 ? 'ELEVATED' : 'OPTIMAL',
      notes: psuMargin < 50
        ? 'Holgura eléctrica reducida. Transitorios de corriente podrían disparar OCP.'
        : `Margen de ${psuMargin}W suficiente para absorber transitorios y envejecimiento de capacitores.`,
    });

    // Evaluate summary and limiter candidate
    let primaryLimiterCandidate = undefined;
    let overallHealthStatus: BaselineSnapshot['overallHealthStatus'] = 'READY';

    if (isSingleChannel) {
      primaryLimiterCandidate = 'RAM_SINGLE_CHANNEL';
      overallHealthStatus = 'ATTENTION';
    } else if (thermalTight) {
      primaryLimiterCandidate = 'COOLING_HEADROOM';
      overallHealthStatus = 'ATTENTION';
    } else if (!machine.gpu.isDedicated && machine.gpu.vramGb <= 2) {
      primaryLimiterCandidate = 'IGPU_SHARED_VRAM';
    }

    const summaryEs = overallHealthStatus === 'READY'
      ? 'La máquina se encuentra en condiciones eléctricas, de memoria y de silicio óptimas para ser sometida a diagnóstico o pruebas de carga.'
      : 'Se detectaron factores de atención en el silicio (memoria o refrigeración) que condicionarán los resultados de las pruebas.';

    return {
      machineId: machine.id,
      alias: machine.alias,
      timestamp,
      overallHealthStatus,
      readings,
      primaryLimiterCandidate,
      summaryEs,
    };
  }
}
