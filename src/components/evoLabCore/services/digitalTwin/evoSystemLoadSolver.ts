// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — SYSTEM LOAD SOLVER
// Mathematical Capacity vs Demand Equation Engine
// Principle: "NO USAR PORCENTAJES ALEATORIOS. CALCULAR DEMANDA / CAPACIDAD."
// ============================================================================

import { Machine } from '../../types';
import { WorkloadStack, DigitalTwinFrame, LimitingFactorKind } from './types';

export class EvoSystemLoadSolver {
  /**
   * Solves instantaneous system load for all subsystems given the Machine and the active WorkloadStack.
   */
  static solveInstantaneousLoad(
    machine: Machine,
    stack: WorkloadStack,
    currentSimulatedSeconds: number
  ): {
    cpuDemandPct: number;
    cpuSingleThreadPct: number;
    cpuMultiThreadPct: number;
    gpuRasterPct: number;
    gpuComputePct: number;
    vramUsedGb: number;
    vramTotalGb: number;
    vramPressurePct: number;
    ramUsedGb: number;
    ramTotalGb: number;
    ramPressurePct: number;
    ramBandwidthUsagePct: number;
    storageReadMBps: number;
    storageWriteMBps: number;
    storageQueuePressurePct: number;
    encoderLoadPct: number;
    fpsEstimate: number;
    low1PctFps: number;
  } {
    const activeInstances = [
      ...(stack.primary ? [stack.primary] : []),
      ...stack.secondaries,
      ...stack.backgrounds,
    ];

    if (activeInstances.length === 0) {
      // Idle system baseline
      return {
        cpuDemandPct: 3,
        cpuSingleThreadPct: 4,
        cpuMultiThreadPct: 2,
        gpuRasterPct: 1,
        gpuComputePct: 0,
        vramUsedGb: 0.4,
        vramTotalGb: machine.gpu.vramGb || 2,
        vramPressurePct: 20,
        ramUsedGb: Math.min(3.8, machine.ram.sizeGb * 0.3),
        ramTotalGb: machine.ram.sizeGb,
        ramPressurePct: (3.8 / machine.ram.sizeGb) * 100,
        ramBandwidthUsagePct: 4,
        storageReadMBps: 2,
        storageWriteMBps: 1,
        storageQueuePressurePct: 1,
        encoderLoadPct: 0,
        fpsEstimate: 0,
        low1PctFps: 0,
      };
    }

    // Accumulate total raw demands from all active workloads
    let totalCpuSingleThread = 0;
    let totalCpuMultiThread = 0;
    let totalGpuRaster = 0;
    let totalGpuCompute = 0;
    let totalVramDemand = 0.5; // Windows DWM base
    let totalRamDemand = 3.6;  // Windows OS working set
    let totalStorageRead = 5;
    let totalStorageWrite = 3;
    let totalEncoder = 0;

    for (const inst of activeInstances) {
      const p = inst.workload.demandProfile;
      const resFactor = inst.resolution
        ? inst.workload.resolutionScaleFactors[inst.resolution]
        : 1.0;
      const qualFactor = inst.quality
        ? inst.workload.qualityScaleFactors[inst.quality]
        : 1.0;

      // Primary game receives full scaling; secondary utilities scale fixed
      const isPrimary = inst.role === 'PRIMARY';
      const effectiveRes = isPrimary ? resFactor : 1.0;
      const effectiveQual = isPrimary ? qualFactor : 1.0;

      totalCpuSingleThread += p.cpuSingleThreadDemand.value * (isPrimary ? (effectiveQual > 1.2 ? 1.1 : 1.0) : 0.6);
      totalCpuMultiThread += p.cpuMultiThreadDemand.value * (isPrimary ? 1.0 : 0.7);
      totalGpuRaster += p.gpuRasterDemand.value * effectiveRes * effectiveQual;
      totalGpuCompute += p.gpuComputeDemand.value * (effectiveQual > 1.2 ? 1.4 : 1.0);
      totalVramDemand += p.vramDemandGb.value * (isPrimary ? effectiveRes * 0.9 + effectiveQual * 0.3 : 1.0);
      totalRamDemand += p.ramDemandGb.value;
      totalStorageRead += p.storageReadMBps.value;
      totalStorageWrite += p.storageWriteMBps.value;
      totalEncoder += p.encoderDemandPct.value;
    }

    // ------------------------------------------------------------------------
    // Capacity normalization against Machine capabilities
    // ------------------------------------------------------------------------
    // 1. CPU
    const cpuCores = Math.max(2, machine.cpu.cores || 6);
    const cpuThreads = Math.max(2, machine.cpu.threads || cpuCores * 2);
    const cpuClockBase = machine.cpu.baseClockGhz || 3.2;
    const cpuClockBoost = machine.cpu.boostClockGhz || 4.8;
    const cpuIpcFactor = cpuClockBoost / 4.5; // Baseline normalized to 4.5GHz modern IPC

    const normalizedSingleThread = Math.min(100, Math.round(totalCpuSingleThread / (cpuIpcFactor * 1.05)));
    const normalizedMultiThread = Math.min(100, Math.round((totalCpuMultiThread * 6) / (cpuThreads * cpuIpcFactor)));
    const cpuTotalLoad = Math.min(100, Math.round(normalizedSingleThread * 0.35 + normalizedMultiThread * 0.65));

    // 2. GPU
    const isDedicatedGpu = machine.gpu.isDedicated;
    const gpuRawPower = isDedicatedGpu ? (machine.gpu.powerW || 180) : 35;
    // GPU compute index: 400W RTX 4090 ~ 100, 200W RTX 4070 ~ 65, 75W GTX 1650 ~ 25, iGPU ~ 10
    const gpuCapacityFactor = isDedicatedGpu ? Math.max(0.2, (gpuRawPower / 220)) : 0.18;

    const gpuRasterPct = Math.min(100, Math.round(totalGpuRaster / gpuCapacityFactor));
    const gpuComputePct = Math.min(100, Math.round(totalGpuCompute / gpuCapacityFactor));

    // 3. VRAM
    const vramTotalGb = isDedicatedGpu ? (machine.gpu.vramGb || 8) : Math.min(4, machine.ram.sizeGb * 0.25);
    const vramUsedGb = Math.min(vramTotalGb * 1.15, parseFloat(totalVramDemand.toFixed(1)));
    const vramPressurePct = Math.min(100, Math.round((vramUsedGb / vramTotalGb) * 100));

    // 4. RAM
    const ramTotalGb = Math.max(4, machine.ram.sizeGb || 16);
    const ramUsedGb = Math.min(ramTotalGb, parseFloat(totalRamDemand.toFixed(1)));
    const ramPressurePct = Math.min(100, Math.round((ramUsedGb / ramTotalGb) * 100));

    // Memory Bandwidth calculation
    const ramSpeed = machine.ram.configuredSpeedMts || 3200;
    const ramChannels = machine.ram.channels || 2;
    const maxTheoreticalBandwidthGBps = (ramSpeed * 8 * ramChannels) / 1000; // ej: 6000 * 8 * 2 / 1000 = 96 GB/s
    const effectiveRamDemandGBps = (cpuTotalLoad * 0.3) + (isDedicatedGpu ? 12 : 35) + (totalStorageRead / 1000);
    const ramBandwidthUsagePct = Math.min(100, Math.round((effectiveRamDemandGBps / maxTheoreticalBandwidthGBps) * 100));

    // 5. Storage
    const storageType = machine.storage.type;
    const maxReadMBps = storageType === 'NVMe M.2' ? 5000 : storageType === 'SATA SSD' ? 540 : 160;
    const maxWriteMBps = storageType === 'NVMe M.2' ? 4200 : storageType === 'SATA SSD' ? 500 : 140;

    // DirectStorage spikes during initial asset loading
    const loadPhaseFactor = currentSimulatedSeconds < 15 ? 1.8 : 1.0;
    const storageReadMBps = Math.min(maxReadMBps, Math.round(totalStorageRead * loadPhaseFactor));
    const storageWriteMBps = Math.min(maxWriteMBps, Math.round(totalStorageWrite));
    const storageQueuePressurePct = Math.min(100, Math.round((storageReadMBps / maxReadMBps) * 100));

    // 6. FPS Projections (Calibrated mathematical model)
    let estimatedFps = 0;
    let low1Fps = 0;

    if (stack.primary) {
      const primaryItem = stack.primary.workload;
      const res = stack.primary.resolution || '1080p';
      const targetGoalFps = stack.primary.targetFps || 144;

      // Base engine potential
      const cpuLimitFps = Math.round((300 / Math.max(20, normalizedSingleThread)) * 60);
      const gpuLimitFps = Math.round((300 / Math.max(15, gpuRasterPct)) * 55);
      const vramBottleneckFactor = vramPressurePct > 98 ? 0.65 : vramPressurePct > 92 ? 0.88 : 1.0;
      const ramPressureFactor = ramPressurePct > 95 ? 0.72 : ramPressurePct > 88 ? 0.92 : 1.0;

      const rawFps = Math.min(cpuLimitFps, gpuLimitFps) * vramBottleneckFactor * ramPressureFactor;
      estimatedFps = Math.max(12, Math.round(rawFps));

      // 1% Low is heavily impacted by RAM latency, VRAM swapping, and storage streaming spikes
      const frametimeVariancePct = (vramPressurePct > 95 ? 0.45 : 0.15) + (ramPressurePct > 90 ? 0.25 : 0.08);
      low1Fps = Math.max(5, Math.round(estimatedFps * (1 - frametimeVariancePct)));
    }

    return {
      cpuDemandPct: cpuTotalLoad,
      cpuSingleThreadPct: normalizedSingleThread,
      cpuMultiThreadPct: normalizedMultiThread,
      gpuRasterPct,
      gpuComputePct,
      vramUsedGb,
      vramTotalGb,
      vramPressurePct,
      ramUsedGb,
      ramTotalGb,
      ramPressurePct,
      ramBandwidthUsagePct,
      storageReadMBps,
      storageWriteMBps,
      storageQueuePressurePct,
      encoderLoadPct: Math.min(100, totalEncoder),
      fpsEstimate: estimatedFps,
      low1PctFps: low1Fps,
    };
  }
}
