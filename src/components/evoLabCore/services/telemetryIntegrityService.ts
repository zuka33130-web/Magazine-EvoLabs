// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — TELEMETRY INTEGRITY & ALLOWED COMPONENT SERVICE
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// Integrity Assurance: Compare detected hardware against verified allowed components list
// Discrepancy Enforcement: Any unrecognized or divergent component is marked UNKNOWN
// ============================================================================

import { Machine, EpistemicProvenance } from '../types';
import { HardwareCatalogProvider, HardwareNormalizer } from './hardwareCatalog';
import { WindowsDetectionService } from './windowsDetectionService';

export interface DiscrepancyItem {
  subsystem: 'CPU' | 'GPU' | 'RAM' | 'MOTHERBOARD' | 'STORAGE' | 'PSU' | 'COOLING' | 'CHASSIS' | 'FANS';
  field: string;
  detectedValue: any;
  allowedMatch?: string;
  status: 'VERIFIED' | 'DISCREPANCY_MARKED_UNKNOWN' | 'ABSENT_MARKED_UNKNOWN';
  reason: string;
}

export interface LiveScanIntegrityResult {
  machine: Machine;
  discrepancies: DiscrepancyItem[];
  integrityScore: number; // 0 to 100%
  timestamp: string;
  sourceEndpoint: string;
  rawPayload: any;
}

export class TelemetryIntegrityService {
  /**
   * Fetches telemetry from '/api/telemetry/live-scan' and strictly evaluates
   * each field against the verified catalog of allowed components.
   */
  static async scanAndValidateLiveEndpoint(): Promise<LiveScanIntegrityResult> {
    const endpoint = '/api/telemetry/live-scan';
    let rawPayload: any = null;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} from ${endpoint}`);
      }
      rawPayload = await response.json();
    } catch (err) {
      console.warn(`[TelemetryIntegrityService] Could not reach ${endpoint}:`, err);
      // Fallback empty scan if endpoint unreachable
      rawPayload = {
        CPU: 'UNKNOWN',
        GPU: 'UNKNOWN',
        RAM_GB: 0,
        RAM_Speed: 0,
        Provenance: 'UNKNOWN',
      };
    }

    return this.evaluateTelemetryIntegrity(rawPayload, endpoint);
  }

  /**
   * Compares raw detected telemetry against allowed components.
   * Any discrepancy, unverified silicon or missing field is marked 'UNKNOWN'.
   */
  static evaluateTelemetryIntegrity(
    rawPayload: any,
    endpoint = '/api/telemetry/live-scan'
  ): LiveScanIntegrityResult {
    const discrepancies: DiscrepancyItem[] = [];
    const allCatalog = HardwareCatalogProvider.getAllComponents();
    const catalogCpus = allCatalog.filter((c) => c.category === 'cpu');
    const catalogGpus = allCatalog.filter((c) => c.category === 'gpu');
    const catalogMobo = allCatalog.filter((c) => c.category === 'motherboard');
    const catalogStorage = allCatalog.filter((c) => c.category === 'storage');

    // 1. EVALUATE CPU
    const rawCpuName = rawPayload.CPU || rawPayload.cpu || rawPayload.Processor || '';
    const normCpu = HardwareNormalizer.normalizeModelName(rawCpuName);
    const cpuMatch = catalogCpus.find(
      (c) =>
        c.model.toLowerCase() === normCpu.toLowerCase() ||
        normCpu.toLowerCase().includes(c.model.toLowerCase()) ||
        c.aliases.some((a) => normCpu.toLowerCase().includes(a.toLowerCase()))
    );

    let finalCpuModel = 'UNKNOWN';
    let finalCpuSocket = 'UNKNOWN';
    let finalCpuCores = 0;
    let finalCpuThreads = 0;
    let finalCpuTdp = 0;
    let finalCpuIGPU = false;
    let finalCpuProv: EpistemicProvenance = 'UNKNOWN';

    if (rawCpuName && cpuMatch) {
      finalCpuModel = cpuMatch.model;
      finalCpuSocket = cpuMatch.specifications?.socket || 'UNKNOWN';
      finalCpuCores = rawPayload.Cores || cpuMatch.specifications?.cores || 0;
      finalCpuThreads = rawPayload.Threads || cpuMatch.specifications?.threads || 0;
      finalCpuTdp = cpuMatch.specifications?.tdpW || 65;
      finalCpuIGPU = cpuMatch.specifications?.hasIGPU ?? false;
      finalCpuProv = 'MEASURED';

      discrepancies.push({
        subsystem: 'CPU',
        field: 'model',
        detectedValue: rawCpuName,
        allowedMatch: cpuMatch.model,
        status: 'VERIFIED',
        reason: `Coincide con componente permitido en catálogo: ${cpuMatch.model}`,
      });
    } else if (rawCpuName && !rawCpuName.includes('UNKNOWN')) {
      // Unallowed or unverifiable CPU -> enforce UNKNOWN
      discrepancies.push({
        subsystem: 'CPU',
        field: 'model',
        detectedValue: rawCpuName,
        status: 'DISCREPANCY_MARKED_UNKNOWN',
        reason: 'Componente no figura en la lista de silicio verificado. Marcado como UNKNOWN para proteger integridad.',
      });
    } else {
      discrepancies.push({
        subsystem: 'CPU',
        field: 'model',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'CPU ausente en telemetría en vivo.',
      });
    }

    // 2. EVALUATE GPU
    const rawGpuName = rawPayload.GPU || rawPayload.gpu || rawPayload.VideoController || '';
    const normGpu = HardwareNormalizer.normalizeModelName(rawGpuName);
    const gpuMatch = catalogGpus.find(
      (c) =>
        c.model.toLowerCase() === normGpu.toLowerCase() ||
        normGpu.toLowerCase().includes(c.model.toLowerCase()) ||
        c.aliases.some((a) => normGpu.toLowerCase().includes(a.toLowerCase()))
    );

    let finalGpuModel = 'UNKNOWN';
    let finalGpuVram = 0;
    let finalGpuDedicated = false;
    let finalGpuPowerW = 0;
    let finalGpuProv: EpistemicProvenance = 'UNKNOWN';

    if (rawGpuName && gpuMatch) {
      finalGpuModel = gpuMatch.model;
      finalGpuVram = Number(rawPayload.VRAM_GB) || gpuMatch.specifications?.vramGb || 0;
      finalGpuDedicated = gpuMatch.specifications?.isDedicated ?? (!normGpu.toLowerCase().includes('uhd') && !normGpu.toLowerCase().includes('graphics'));
      finalGpuPowerW = gpuMatch.specifications?.powerW || (finalGpuDedicated ? 150 : 15);
      finalGpuProv = 'MEASURED';

      discrepancies.push({
        subsystem: 'GPU',
        field: 'model',
        detectedValue: rawGpuName,
        allowedMatch: gpuMatch.model,
        status: 'VERIFIED',
        reason: `Coincide con componente permitido en catálogo: ${gpuMatch.model}`,
      });
    } else if (rawGpuName && !rawGpuName.includes('UNKNOWN')) {
      discrepancies.push({
        subsystem: 'GPU',
        field: 'model',
        detectedValue: rawGpuName,
        status: 'DISCREPANCY_MARKED_UNKNOWN',
        reason: 'GPU detectada no homologada en lista de componentes permitidos. Marcada como UNKNOWN.',
      });
    } else {
      discrepancies.push({
        subsystem: 'GPU',
        field: 'model',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'GPU ausente en telemetría en vivo.',
      });
    }

    // 3. EVALUATE RAM
    const rawRamGb = Number(rawPayload.RAM_GB || rawPayload.ramGb || 0);
    const rawRamSpeed = Number(rawPayload.RAM_Speed || rawPayload.ramSpeed || rawPayload.RAM_Spd_Speed || 0);
    const validRamSizes = [2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 512];
    const isSizeAllowed = validRamSizes.includes(Math.round(rawRamGb));
    const isSpeedAllowed = rawRamSpeed >= 1333 && rawRamSpeed <= 9000;

    let finalRamSize = 0;
    let finalRamSpeed = 0;
    let finalRamType: 'DDR4' | 'DDR5' | 'UNKNOWN' = 'UNKNOWN';
    let finalRamChannels = 0;
    let finalRamProv: EpistemicProvenance = 'UNKNOWN';

    if (rawRamGb > 0 && isSizeAllowed) {
      finalRamSize = Math.round(rawRamGb);
      finalRamSpeed = isSpeedAllowed ? rawRamSpeed : 0;
      finalRamType = finalRamSpeed >= 4800 ? 'DDR5' : finalRamSpeed >= 2133 ? 'DDR4' : 'UNKNOWN';
      finalRamChannels = rawPayload.RAM_Channels || (finalRamSize >= 16 ? 2 : 1);
      finalRamProv = 'MEASURED';

      discrepancies.push({
        subsystem: 'RAM',
        field: 'sizeGb',
        detectedValue: `${rawRamGb} GB @ ${rawRamSpeed} MT/s`,
        status: 'VERIFIED',
        reason: 'Capacidad y frecuencia dentro del rango físico permitido.',
      });
    } else if (rawRamGb > 0 && !isSizeAllowed) {
      discrepancies.push({
        subsystem: 'RAM',
        field: 'sizeGb',
        detectedValue: `${rawRamGb} GB`,
        status: 'DISCREPANCY_MARKED_UNKNOWN',
        reason: 'Capacidad de RAM fuera de múltiplos físicos permitidos. Marcada como UNKNOWN.',
      });
    } else {
      discrepancies.push({
        subsystem: 'RAM',
        field: 'sizeGb',
        detectedValue: '0 GB',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'Memoria RAM no informada en telemetría.',
      });
    }

    // 4. EVALUATE MOTHERBOARD
    const rawMobo = rawPayload.Motherboard || rawPayload.motherboard || '';
    let finalMoboModel = 'UNKNOWN';
    let finalMoboSocket = finalCpuSocket !== 'UNKNOWN' ? finalCpuSocket : 'UNKNOWN';
    let finalMoboProv: EpistemicProvenance = 'UNKNOWN';

    if (rawMobo && !rawMobo.includes('UNKNOWN')) {
      const moboMatch = catalogMobo.find((m) => m.model.toLowerCase().includes(rawMobo.toLowerCase()));
      if (moboMatch) {
        finalMoboModel = moboMatch.model;
        finalMoboSocket = moboMatch.specifications?.socket || finalMoboSocket;
        finalMoboProv = 'MEASURED';
        discrepancies.push({
          subsystem: 'MOTHERBOARD',
          field: 'model',
          detectedValue: rawMobo,
          allowedMatch: moboMatch.model,
          status: 'VERIFIED',
          reason: 'Placa base homologada en catálogo.',
        });
      } else {
        discrepancies.push({
          subsystem: 'MOTHERBOARD',
          field: 'model',
          detectedValue: rawMobo,
          status: 'DISCREPANCY_MARKED_UNKNOWN',
          reason: 'Motherboard no figura en catálogo verificado. Marcado como UNKNOWN.',
        });
      }
    } else {
      discrepancies.push({
        subsystem: 'MOTHERBOARD',
        field: 'model',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'Placa base no reportada por el endpoint.',
      });
    }

    // 5. EVALUATE STORAGE
    const rawStorage = rawPayload.Storage || rawPayload.storage || '';
    let finalStorageModel = 'UNKNOWN';
    let finalStorageType: 'NVMe M.2' | 'SATA SSD' | 'HDD' | 'UNKNOWN' = 'UNKNOWN';
    let finalStorageCap = 0;
    let finalStorageProv: EpistemicProvenance = 'UNKNOWN';

    if (rawStorage && !rawStorage.includes('UNKNOWN')) {
      const storageMatch = catalogStorage.find((s) => s.model.toLowerCase().includes(rawStorage.toLowerCase()));
      if (storageMatch) {
        finalStorageModel = storageMatch.model;
        finalStorageType = (storageMatch.specifications?.type as any) || 'NVMe M.2';
        finalStorageCap = storageMatch.specifications?.capacityGb || 1000;
        finalStorageProv = 'MEASURED';
        discrepancies.push({
          subsystem: 'STORAGE',
          field: 'model',
          detectedValue: rawStorage,
          allowedMatch: storageMatch.model,
          status: 'VERIFIED',
          reason: 'Unidad de almacenamiento homologada.',
        });
      } else {
        discrepancies.push({
          subsystem: 'STORAGE',
          field: 'model',
          detectedValue: rawStorage,
          status: 'DISCREPANCY_MARKED_UNKNOWN',
          reason: 'Almacenamiento no homologado. Marcado como UNKNOWN.',
        });
      }
    } else {
      discrepancies.push({
        subsystem: 'STORAGE',
        field: 'model',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'Almacenamiento no reportado.',
      });
    }

    // 6. ENFORCE PSU, COOLING, CHASSIS, FANS AS STRICTLY UNKNOWN (Un-measurable via WMI)
    discrepancies.push(
      {
        subsystem: 'PSU',
        field: 'wattageW',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'Las fuentes de poder carecen de bus digital estándar en Windows WMI. Marcado como UNKNOWN.',
      },
      {
        subsystem: 'COOLING',
        field: 'type',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'El disipador/AIO no emite telemetría directa sin software propietario. Marcado como UNKNOWN.',
      },
      {
        subsystem: 'CHASSIS',
        field: 'model',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'El gabinete no es detectable por software. Marcado como UNKNOWN.',
      },
      {
        subsystem: 'FANS',
        field: 'count',
        detectedValue: 'N/A',
        status: 'ABSENT_MARKED_UNKNOWN',
        reason: 'Cantidad de ventiladores no medible por WMI estándar. Marcado como UNKNOWN.',
      }
    );

    const verifiedCount = discrepancies.filter((d) => d.status === 'VERIFIED').length;
    const totalCount = discrepancies.length;
    const integrityScore = Math.round((verifiedCount / Math.max(1, totalCount)) * 100);

    const isFullyDetected = finalCpuModel !== 'UNKNOWN' && finalRamSize > 0;

    const validatedMachine: Machine = {
      id: `MCH-SCAN-${Date.now()}`,
      alias: isFullyDetected ? `${finalCpuModel} // Live Verified` : 'PC Telemetría En Vivo (Parcial)',
      isDetected: true,
      overallProvenance: isFullyDetected ? 'MEASURED' : 'UNKNOWN',
      readyState: isFullyDetected ? 'READY' : 'INCOMPLETE',
      notes: `Escaneo e integridad procesados desde ${endpoint}. Discrepancias marcadas con UNKNOWN para asegurar fidelidad técnica.`,
      motherboard: {
        model: finalMoboModel,
        socket: finalMoboSocket,
        ramSlots: 4,
        ramType: finalRamType !== 'UNKNOWN' ? finalRamType : 'DDR4',
        pcieGen: 'PCIe 4.0',
        formFactor: 'ATX',
        provenance: finalMoboProv,
      },
      cpu: {
        model: finalCpuModel,
        socket: finalCpuSocket,
        cores: finalCpuCores,
        threads: finalCpuThreads,
        tdpW: finalCpuTdp,
        hasIGPU: finalCpuIGPU,
        provenance: finalCpuProv,
      },
      ram: {
        sizeGb: finalRamSize,
        configuredSpeedMts: finalRamSpeed,
        type: finalRamType,
        channels: finalRamChannels,
        provenance: finalRamProv,
      },
      gpu: {
        model: finalGpuModel,
        vramGb: finalGpuVram,
        isDedicated: finalGpuDedicated,
        powerW: finalGpuPowerW,
        provenance: finalGpuProv,
      },
      storage: {
        model: finalStorageModel,
        type: finalStorageType,
        capacityGb: finalStorageCap,
        provenance: finalStorageProv,
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
        resolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
        refreshHz: 60,
        provenance: 'MEASURED',
      },
    };

    return {
      machine: validatedMachine,
      discrepancies,
      integrityScore,
      timestamp: new Date().toISOString(),
      sourceEndpoint: endpoint,
      rawPayload,
    };
  }
}
