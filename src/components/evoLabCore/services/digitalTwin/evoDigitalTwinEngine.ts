// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — MASTER DIGITAL TWIN ENGINE
// Orchestrator for Real-Time Load, Thermals, Power, Buses & Bottlenecks
// ============================================================================

import { Machine, EpistemicProvenance, SubsystemType } from '../../types';
import {
  WorkloadStack,
  DigitalTwinFrame,
  DigitalTwinEventMarker,
  DigitalTwinSessionReport,
  BusState,
  ComponentLiveMetrics,
} from './types';
import { EvoSystemLoadSolver } from './evoSystemLoadSolver';
import { ThermalSimulationEngine, ThermalSimulationState } from './thermalSimulationEngine';
import { PSUStressModel } from './psuStressModel';
import { DynamicBottleneckEngine } from './dynamicBottleneckEngine';

export class EvoDigitalTwinEngine {
  /**
   * Generates a single digital twin frame for a given second
   */
  static generateFrame(
    machine: Machine,
    stack: WorkloadStack,
    second: number,
    prevThermalState: ThermalSimulationState | null,
    userEnteredPsuAgeYears?: number,
    userEnteredMaintenanceMonths?: number
  ): { frame: DigitalTwinFrame; thermalState: ThermalSimulationState } {
    // 1. Solve Load across Subsystems
    const load = EvoSystemLoadSolver.solveInstantaneousLoad(machine, stack, second);

    // 2. Step Thermal Differential Physics
    const thermal = ThermalSimulationEngine.stepThermal(
      machine,
      prevThermalState,
      load.cpuDemandPct,
      load.gpuRasterPct,
      load.storageReadMBps,
      second,
      1.0
    );

    // 3. Evaluate PSU Power Draw and Margins
    const psu = PSUStressModel.evaluate(
      machine,
      load.cpuDemandPct,
      load.gpuRasterPct,
      userEnteredPsuAgeYears
    );

    // 4. Classify Bottleneck
    const bottleneck = DynamicBottleneckEngine.classifyInstantaneous({
      cpuSingleThreadPct: load.cpuSingleThreadPct,
      cpuTotalLoadPct: load.cpuDemandPct,
      cpuThermalHeadroomC: thermal.cpuThermalHeadroomC,
      isCpuThrottling: thermal.isCpuThrottling,
      gpuRasterPct: load.gpuRasterPct,
      gpuThermalHeadroomC: thermal.gpuThermalHeadroomC,
      isGpuThrottling: thermal.isGpuThrottling,
      vramPressurePct: load.vramPressurePct,
      ramPressurePct: load.ramPressurePct,
      ramBandwidthUsagePct: load.ramBandwidthUsagePct,
      storageQueuePressurePct: load.storageQueuePressurePct,
      psuHeadroomPct: psu.powerHeadroomPct,
    });

    // 5. Construct Interconnecting Bus States
    const cpuRamBusStatus =
      load.ramBandwidthUsagePct > 90 ? 'SATURATED' : load.ramBandwidthUsagePct > 75 ? 'HIGH_LOAD' : 'NORMAL';
    const cpuRamBus: BusState = {
      utilizationEstimatePct: load.ramBandwidthUsagePct,
      effectiveDemandGbps: parseFloat((load.ramBandwidthUsagePct * 0.96).toFixed(1)),
      availableBandwidthGbps: 96.0,
      status: cpuRamBusStatus,
      provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      label: `${machine.ram.configuredSpeedMts || 6000} MT/s Bus`,
    };

    const isDedicatedGpu = machine.gpu.isDedicated;
    const pcieGen = machine.gpu.pcieGen || 'PCIe 4.0 x16';
    const pcieDemand = isDedicatedGpu ? Math.min(100, Math.round(load.gpuRasterPct * 0.75 + (load.vramPressurePct > 95 ? 25 : 0))) : 90;
    const cpuGpuBusStatus = pcieDemand > 90 ? 'HIGH_LOAD' : pcieDemand > 40 ? 'NORMAL' : 'IDLE';
    const cpuGpuBus: BusState = {
      utilizationEstimatePct: pcieDemand,
      effectiveDemandGbps: parseFloat((pcieDemand * 0.315).toFixed(1)),
      availableBandwidthGbps: 31.5,
      status: cpuGpuBusStatus,
      provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      label: `${pcieGen} Link`,
    };

    const vramBusDemand = Math.min(100, Math.round(load.gpuRasterPct * 0.85 + load.vramPressurePct * 0.15));
    const gpuVramBus: BusState = {
      utilizationEstimatePct: vramBusDemand,
      effectiveDemandGbps: parseFloat((vramBusDemand * 5.04).toFixed(1)),
      availableBandwidthGbps: 504.0, // ~504 GB/s GDDR6X
      status: vramBusDemand > 90 ? 'HIGH_LOAD' : 'NORMAL',
      provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      label: isDedicatedGpu ? 'VRAM GDDR Bus' : 'Memoria Compartida',
    };

    const storageBusDemand = Math.min(100, Math.round(load.storageQueuePressurePct));
    const cpuStorageBus: BusState = {
      utilizationEstimatePct: storageBusDemand,
      effectiveDemandGbps: parseFloat((load.storageReadMBps / 125).toFixed(1)), // MB/s to Gbps
      availableBandwidthGbps: machine.storage.type === 'NVMe M.2' ? 64.0 : 6.0,
      status: storageBusDemand > 85 ? 'HIGH_LOAD' : 'NORMAL',
      provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      label: machine.storage.type === 'NVMe M.2' ? 'Direct PCIe NVMe' : 'SATA 6Gb/s',
    };

    const chipsetNetworkBus: BusState = {
      utilizationEstimatePct: 15,
      effectiveDemandGbps: 0.15,
      availableBandwidthGbps: 2.5,
      status: 'NORMAL',
      provenance: 'DERIVED',
      label: 'Intel/Realtek 2.5GbE LAN',
    };

    // 6. Assemble Component Live Metrics
    const cpuStatus =
      thermal.isCpuThrottling ? 'LIMITING' : load.cpuDemandPct > 85 ? 'HIGH_LOAD' : load.cpuDemandPct > 10 ? 'NORMAL' : 'IDLE';
    const cpuMetrics: ComponentLiveMetrics & {
      singleThreadPressurePct: number;
      multiThreadLoadPct: number;
      threadsActive: number;
    } = {
      loadPct: load.cpuDemandPct,
      temperatureC: thermal.cpuTemperatureC,
      targetTempLimitC: thermal.cpuTjMaxC,
      thermalHeadroomC: thermal.cpuThermalHeadroomC,
      isThermalLimiting: thermal.cpuThermalHeadroomC < 5.0,
      isPowerLimiting: false,
      isThrottling: thermal.isCpuThrottling,
      effectiveClockMhz: thermal.cpuEffectiveClockMhz,
      baseClockMhz: (machine.cpu.baseClockGhz || 3.2) * 1000,
      boostClockMhz: (machine.cpu.boostClockGhz || 4.8) * 1000,
      clockDropMhz: Math.max(0, (machine.cpu.boostClockGhz || 4.8) * 1000 - thermal.cpuEffectiveClockMhz),
      powerW: Math.round(15 + ((machine.cpu.tdpW || 65) * 1.5 - 15) * (load.cpuDemandPct / 100)),
      ratedPowerW: (machine.cpu.tdpW || 65) * 1.8,
      status: cpuStatus,
      provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      details: {
        cores: machine.cpu.cores,
        threads: machine.cpu.threads,
        socket: machine.cpu.socket,
      },
      singleThreadPressurePct: load.cpuSingleThreadPct,
      multiThreadLoadPct: load.cpuMultiThreadPct,
      threadsActive: Math.round(machine.cpu.threads * (load.cpuDemandPct / 100)),
    };

    const gpuStatus =
      thermal.isGpuThrottling ? 'LIMITING' : load.gpuRasterPct > 85 ? 'HIGH_LOAD' : load.gpuRasterPct > 10 ? 'NORMAL' : 'IDLE';
    const gpuMetrics: ComponentLiveMetrics & {
      vramUsedGb: number;
      vramTotalGb: number;
      vramPressurePct: number;
      rasterLoadPct: number;
      computeLoadPct: number;
      encoderLoadPct: number;
    } = {
      loadPct: load.gpuRasterPct,
      temperatureC: thermal.gpuTemperatureC,
      targetTempLimitC: thermal.gpuThermalLimitC,
      thermalHeadroomC: thermal.gpuThermalHeadroomC,
      isThermalLimiting: thermal.gpuThermalHeadroomC < 3.0,
      isPowerLimiting: load.gpuRasterPct > 98,
      isThrottling: thermal.isGpuThrottling,
      effectiveClockMhz: thermal.gpuEffectiveClockMhz,
      baseClockMhz: 2200,
      boostClockMhz: 2650,
      clockDropMhz: Math.max(0, 2650 - thermal.gpuEffectiveClockMhz),
      powerW: Math.round(14 + ((machine.gpu.powerW || 200) - 14) * (load.gpuRasterPct / 100)),
      ratedPowerW: machine.gpu.powerW || 200,
      status: gpuStatus,
      provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      details: {
        vramTotal: `${load.vramTotalGb} GB`,
        dedicated: isDedicatedGpu,
      },
      vramUsedGb: load.vramUsedGb,
      vramTotalGb: load.vramTotalGb,
      vramPressurePct: load.vramPressurePct,
      rasterLoadPct: load.gpuRasterPct,
      computeLoadPct: load.gpuComputePct,
      encoderLoadPct: load.encoderLoadPct,
    };

    const ramStatus =
      load.ramPressurePct > 92 ? 'SATURATED' : load.ramPressurePct > 78 ? 'HIGH_LOAD' : 'NORMAL';

    const storageStatus =
      load.storageQueuePressurePct > 90 ? 'SATURATED' : load.storageQueuePressurePct > 70 ? 'HIGH_LOAD' : 'NORMAL';

    // Format time (MM:SS)
    const minutes = Math.floor(second / 60);
    const secs = second % 60;
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const activeWorkloadNames = [
      ...(stack.primary ? [stack.primary.workload.title] : []),
      ...stack.secondaries.map((s) => s.workload.title),
      ...stack.backgrounds.map((b) => b.workload.title),
    ];

    const frame: DigitalTwinFrame = {
      timestampSeconds: second,
      timeFormatted,
      fpsEstimate: {
        averageFps: load.fpsEstimate,
        low1PctFps: load.low1PctFps,
        low01PctFps: Math.max(1, Math.round(load.low1PctFps * 0.75)),
        frametimeMs: load.fpsEstimate > 0 ? parseFloat((1000 / load.fpsEstimate).toFixed(1)) : 0,
        frametimeVarianceMs: load.low1PctFps > 0 && load.fpsEstimate > 0 ? parseFloat(((1000 / load.low1PctFps) - (1000 / load.fpsEstimate)).toFixed(1)) : 0,
        confidence: machine.isDetected ? 'HIGH' : 'MEDIUM',
        provenance: machine.isDetected ? 'ESTIMATED' : 'SIMULATED',
      },
      cpu: cpuMetrics,
      gpu: gpuMetrics,
      ram: {
        usedGb: load.ramUsedGb,
        totalGb: load.ramTotalGb,
        pressurePct: load.ramPressurePct,
        bandwidthUsagePct: load.ramBandwidthUsagePct,
        configuredSpeedMts: machine.ram.configuredSpeedMts || 6000,
        status: ramStatus,
        provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      },
      storage: {
        readSpeedMBps: load.storageReadMBps,
        writeSpeedMBps: load.storageWriteMBps,
        temperatureC: thermal.ssdTemperatureC,
        queuePressurePct: load.storageQueuePressurePct,
        interfaceSpeedMBps: machine.storage.type === 'NVMe M.2' ? 5000 : 540,
        status: storageStatus,
        provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      },
      psu: {
        estimatedLoadW: psu.estimatedSystemLoadW,
        ratedWattageW: psu.psuRatedPowerW,
        headroomW: psu.powerHeadroomW,
        headroomPct: psu.powerHeadroomPct,
        ageYears: psu.ageYears,
        ageRiskFactor: psu.ageRiskFactor,
        stressState: psu.stressState,
        provenance: machine.isDetected ? 'DERIVED' : 'SIMULATED',
      },
      cooling: {
        fanSpeedPct: thermal.fanSpeedPct,
        cpuFanRpm: thermal.cpuFanRpm,
        gpuFanRpm: thermal.gpuFanRpm,
        coolerCapacityW: machine.cooling?.tdpCapacityW || 150,
        thermalSoakFactorPct: thermal.thermalSoakFactorPct,
        ambientTempC: thermal.ambientTemperatureC,
      },
      buses: {
        cpuRam: cpuRamBus,
        cpuGpu: cpuGpuBus,
        gpuVram: gpuVramBus,
        cpuStorage: cpuStorageBus,
        chipsetNetwork: chipsetNetworkBus,
      },
      limitingFactor: bottleneck.factor,
      limitingFactorReasonEs: bottleneck.reasonEs,
      activeWorkloadsCount: activeWorkloadNames.length,
      activeWorkloadNames,
    };

    return { frame, thermalState: thermal };
  }

  /**
   * Generates a full session timeline simulation
   */
  static runFullSimulation(
    machine: Machine,
    stack: WorkloadStack,
    durationSeconds: number,
    userEnteredPsuAgeYears?: number,
    userEnteredMaintenanceMonths?: number
  ): DigitalTwinSessionReport {
    const frames: DigitalTwinFrame[] = [];
    const events: DigitalTwinEventMarker[] = [];
    let prevThermal: ThermalSimulationState | null = null;
    let prevBottleneck = 'NONE_DETECTED';

    let maxCpuTemp = 0;
    let maxGpuTemp = 0;
    let maxPsuLoad = 0;
    let minThermalHeadroom = 100;
    let minPowerHeadroom = 1000;
    let totalFps = 0;
    let min1PctFps = 9999;
    let fpsCount = 0;

    // Simulation steps (1s resolution)
    for (let s = 0; s <= durationSeconds; s++) {
      const { frame, thermalState } = this.generateFrame(
        machine,
        stack,
        s,
        prevThermal,
        userEnteredPsuAgeYears,
        userEnteredMaintenanceMonths
      );
      prevThermal = thermalState;
      frames.push(frame);

      // Track peaks
      if (frame.cpu.temperatureC > maxCpuTemp) maxCpuTemp = frame.cpu.temperatureC;
      if (frame.gpu.temperatureC > maxGpuTemp) maxGpuTemp = frame.gpu.temperatureC;
      if (frame.psu.estimatedLoadW > maxPsuLoad) maxPsuLoad = frame.psu.estimatedLoadW;
      if (frame.cpu.thermalHeadroomC < minThermalHeadroom) minThermalHeadroom = frame.cpu.thermalHeadroomC;
      if (frame.gpu.thermalHeadroomC < minThermalHeadroom) minThermalHeadroom = frame.gpu.thermalHeadroomC;
      if (frame.psu.headroomW < minPowerHeadroom) minPowerHeadroom = frame.psu.headroomW;

      if (frame.fpsEstimate.averageFps > 0) {
        totalFps += frame.fpsEstimate.averageFps;
        fpsCount++;
        if (frame.fpsEstimate.low1PctFps < min1PctFps) {
          min1PctFps = frame.fpsEstimate.low1PctFps;
        }
      }

      // Event detection
      if (s === 0 && stack.primary) {
        events.push({
          id: `ev-start-${s}-${events.length}`,
          timestampSeconds: s,
          timeFormatted: frame.timeFormatted,
          type: 'WORKLOAD_ADDED',
          title: `Carga Iniciada: ${stack.primary.workload.title}`,
          description: `Comienza la ejecución de ${stack.primary.workload.title} (${stack.primary.resolution || '1080p'} / ${stack.primary.quality || 'HIGH'}).`,
          affectedSubsystem: 'gpu',
          severity: 'INFO',
        });
      }

      if (frame.limitingFactor !== prevBottleneck && s > 0) {
        events.push({
          id: `ev-bottle-${s}-${events.length}`,
          timestampSeconds: s,
          timeFormatted: frame.timeFormatted,
          type: 'BOTTLENECK_CHANGED',
          title: `Cambio de Régimen: ${DynamicBottleneckEngine.getFactorLabel(frame.limitingFactor)}`,
          description: frame.limitingFactorReasonEs,
          affectedSubsystem: frame.limitingFactor.includes('GPU') ? 'gpu' : frame.limitingFactor.includes('CPU') ? 'cpu' : 'ram',
          severity: frame.limitingFactor.includes('LIMIT') || frame.limitingFactor.includes('THROTTLING') ? 'WARNING' : 'INFO',
        });
        prevBottleneck = frame.limitingFactor;
      }

      if (frame.gpu.isThermalLimiting && !events.some((e) => e.type === 'THERMAL_LIMIT' && s - e.timestampSeconds < 60)) {
        events.push({
          id: `ev-therm-gpu-${s}-${events.length}`,
          timestampSeconds: s,
          timeFormatted: frame.timeFormatted,
          type: 'THERMAL_LIMIT',
          title: 'Límite Térmico de GPU Alcanzado',
          description: `Temperatura de GPU a ${frame.gpu.temperatureC}°C (margen térmico: ${frame.gpu.thermalHeadroomC}°C).`,
          affectedSubsystem: 'gpu',
          severity: 'CRITICAL',
        });
      }

      if (frame.gpu.clockDropMhz > 150 && !events.some((e) => e.type === 'CLOCK_DROP' && s - e.timestampSeconds < 60)) {
        events.push({
          id: `ev-clock-drop-${s}-${events.length}`,
          timestampSeconds: s,
          timeFormatted: frame.timeFormatted,
          type: 'CLOCK_DROP',
          title: `Caída de Frecuencia GPU (-${frame.gpu.clockDropMhz} MHz)`,
          description: `Frecuencia reducida a ${frame.gpu.effectiveClockMhz} MHz por control térmico del silicio.`,
          affectedSubsystem: 'gpu',
          severity: 'WARNING',
        });
      }

      if (frame.gpu.vramPressurePct >= 96 && !events.some((e) => e.type === 'VRAM_PRESSURE' && s - e.timestampSeconds < 60)) {
        events.push({
          id: `ev-vram-press-${s}-${events.length}`,
          timestampSeconds: s,
          timeFormatted: frame.timeFormatted,
          type: 'VRAM_PRESSURE',
          title: 'Saturación Crítica de VRAM',
          description: `Uso de VRAM: ${frame.gpu.vramUsedGb} GB / ${frame.gpu.vramTotalGb} GB. El motor gráfico requiere paginar texturas a la RAM del sistema.`,
          affectedSubsystem: 'gpu',
          severity: 'WARNING',
        });
      }
    }

    const { dominantFactor, percentages } = DynamicBottleneckEngine.computeSessionBottleneckTimeline(frames);

    // Generate Non-Technical Summary
    let summaryTextNonTechnical = '';
    const recommendations: { actionTitle: string; impact: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNNECESSARY_EXPENSE'; justification: string; estimatedCostUsd?: number }[] = [];

    const primaryTitle = stack.primary?.workload.title || 'la carga seleccionada';
    const avgFpsFinal = fpsCount > 0 ? Math.round(totalFps / fpsCount) : 0;
    const min1PctFinal = min1PctFps === 9999 ? 0 : min1PctFps;

    if (dominantFactor === 'HEALTHY_GPU_BOUND') {
      summaryTextNonTechnical = `Tu PC ejecuta ${primaryTitle} con un comportamiento equilibrado y saludable. La placa de video trabaja a plena utilización (~${avgFpsFinal} FPS promedio con ${min1PctFinal} FPS en 1% Low), mientras el procesador y la memoria mantienen margen de seguridad disponible.`;
      recommendations.push({
        actionTitle: 'Configuración Óptima Actual',
        impact: 'LOW',
        justification: 'El sistema no requiere modificaciones de hardware para este perfil de carga.',
      });
    } else if (dominantFactor === 'GPU_THERMAL_LIMIT' || dominantFactor === 'CPU_THERMAL_THROTTLING') {
      summaryTextNonTechnical = `Tu PC puede iniciar ${primaryTitle} con buen rendimiento, pero tras unos minutos bajo carga continua el sistema satura su disipación térmica (alcanzó ${maxGpuTemp}°C en GPU y ${maxCpuTemp}°C en CPU). La placa de video reduce su velocidad de reloj para protegerse, lo que provoca caídas en los FPS mínimos.`;
      recommendations.push({
        actionTitle: 'Optimizar Curva de Ventiladores y Flujo de Aire',
        impact: 'HIGH',
        justification: 'Aumentar las RPM de ventiladores del gabinete o cambiar pasta térmica recuperará el margen térmico perdido sin costo significativo.',
        estimatedCostUsd: 15,
      });
      recommendations.push({
        actionTitle: 'Upgrade de Cooler / Gabinete con Mesh Frontal',
        impact: 'MEDIUM',
        justification: 'Permitirá disipar la carga continua sin que el silicio alcance los límites térmicos operativos.',
        estimatedCostUsd: 45,
      });
    } else if (dominantFactor === 'VRAM_PRESSURE') {
      summaryTextNonTechnical = `El juego requiere más memoria de video (${primaryTitle} exige más de ${machine.gpu.vramGb || 8} GB en este preset) de la que posee tu placa física. Cada vez que la VRAM se llena, la placa debe pedir texturas a la memoria RAM general, lo que genera tirones y micro-congelamientos.`;
      recommendations.push({
        actionTitle: 'Reducir Calidad de Texturas a Medio / Alto',
        impact: 'HIGH',
        justification: 'Ajuste inmediato sin gasto que reducirá el consumo de VRAM en ~2.5 GB, eliminando los tirones.',
      });
      recommendations.push({
        actionTitle: 'Upgrade a GPU con 12GB+ de VRAM (ej: RTX 4070 / RX 7800 XT)',
        impact: 'MEDIUM',
        justification: 'Garantizará soporte nativo de texturas Ultra en resoluciones 1440p y 4K.',
        estimatedCostUsd: 549,
      });
    } else if (dominantFactor === 'CPU_MAIN_THREAD_PRESSURE') {
      summaryTextNonTechnical = `El hilo principal de ${primaryTitle} satura un núcleo de procesamiento de tu CPU, impidiendo que la placa de video reciba los comandos de render con la suficiente rapidez.`;
      recommendations.push({
        actionTitle: 'Subir Resolución a 1440p o Aumentar Calidad Gráfica',
        impact: 'HIGH',
        justification: 'Aumentar la carga en la GPU no bajará tus FPS y aprovechará mejor el silicio gráfico sin gastar dinero.',
      });
      recommendations.push({
        actionTitle: 'Cambiar GPU actual',
        impact: 'UNNECESSARY_EXPENSE',
        justification: 'Comprar una GPU más cara no aumentará los FPS porque el limitante actual es el procesador.',
      });
    } else {
      summaryTextNonTechnical = `Ensayo completado satisfactoriamente. Todos los subsistemas operaron dentro de parámetros normales sin desbordamientos críticos.`;
      recommendations.push({
        actionTitle: 'Mantener Mantenimiento Periódico',
        impact: 'LOW',
        justification: 'Limpieza de polvo cada 6 meses para preservar el rendimiento térmico actual.',
      });
    }

    if (userEnteredPsuAgeYears && userEnteredPsuAgeYears >= 6 && minPowerHeadroom < 120) {
      recommendations.push({
        actionTitle: 'Monitorear Raíl de 12V de Fuente con Edad Declarada',
        impact: 'MEDIUM',
        justification: `La fuente tiene ${userEnteredPsuAgeYears} años declarados y opera con ${minPowerHeadroom}W de margen ante picos transitorios. No está dañada, pero conviene verificar estabilidad de voltajes.`,
      });
    }

    return {
      sessionId: `EVO-LOAD-${Date.now()}`,
      machine,
      stack,
      plannedDurationSeconds: durationSeconds,
      simulatedDurationSeconds: durationSeconds,
      summaryTextNonTechnical,
      whatYouCanDoRecommendations: recommendations,
      dominantLimitingFactor: dominantFactor,
      bottleneckTimelinePercentages: percentages,
      peakMetrics: {
        maxCpuTempC: maxCpuTemp,
        maxGpuTempC: maxGpuTemp,
        maxPsuLoadW: maxPsuLoad,
        minThermalHeadroomC: minThermalHeadroom,
        minPowerHeadroomW: minPowerHeadroom,
        averageFps: avgFpsFinal,
        min1PctFps: min1PctFinal,
      },
      events,
      frames,
      createdAt: new Date().toISOString(),
    };
  }
}
