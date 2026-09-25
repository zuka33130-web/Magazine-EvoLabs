// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — THERMAL SIMULATION ENGINE
// Real-world Differential Heat Physics & Progressive Thermal Soak Model
// Formula: T(t+dt) = T(t) + (HeatGenerated - HeatDissipated) * dt / ThermalMass
// ============================================================================

import { Machine } from '../../types';

export interface ThermalSimulationState {
  cpuTemperatureC: number;
  gpuTemperatureC: number;
  ssdTemperatureC: number;
  ambientTemperatureC: number;
  caseInternalTemperatureC: number;
  cpuThermalHeadroomC: number;
  gpuThermalHeadroomC: number;
  cpuTjMaxC: number;
  gpuThermalLimitC: number;
  isCpuThrottling: boolean;
  isGpuThrottling: boolean;
  cpuEffectiveClockMhz: number;
  gpuEffectiveClockMhz: number;
  fanSpeedPct: number;
  cpuFanRpm: number;
  gpuFanRpm: number;
  thermalSoakFactorPct: number;
}

export class ThermalSimulationEngine {
  private static readonly DEFAULT_AMBIENT_C = 22.0;

  // Thermal Mass constants (Joules per degree Celsius)
  private static readonly CPU_COOLER_THERMAL_MASS = 180.0;  // Copper/Aluminum mass
  private static readonly GPU_COOLER_THERMAL_MASS = 240.0;  // Triple-fan heatsink mass
  private static readonly CHASSIS_AIR_THERMAL_MASS = 600.0; // Air volume inside case

  /**
   * Advances the thermal state by dtSeconds using real differential equations
   */
  static stepThermal(
    machine: Machine,
    prevState: ThermalSimulationState | null,
    cpuLoadPct: number,
    gpuLoadPct: number,
    ssdReadMBps: number,
    elapsedSeconds: number,
    dtSeconds: number = 1.0
  ): ThermalSimulationState {
    const ambient = prevState ? prevState.ambientTemperatureC : this.DEFAULT_AMBIENT_C;
    const cpuTjMax = 100.0; // Intel/AMD TJMax
    const gpuThermalLimit = 83.0; // NVIDIA Target / AMD 85C

    // Initial state at t=0
    if (!prevState) {
      return {
        cpuTemperatureC: ambient + 12.0, // Idle ~34C
        gpuTemperatureC: ambient + 10.0, // Idle ~32C
        ssdTemperatureC: ambient + 14.0, // Idle ~36C
        ambientTemperatureC: ambient,
        caseInternalTemperatureC: ambient + 4.0,
        cpuThermalHeadroomC: cpuTjMax - (ambient + 12.0),
        gpuThermalHeadroomC: gpuThermalLimit - (ambient + 10.0),
        cpuTjMaxC: cpuTjMax,
        gpuThermalLimitC: gpuThermalLimit,
        isCpuThrottling: false,
        isGpuThrottling: false,
        cpuEffectiveClockMhz: (machine.cpu.boostClockGhz || 4.8) * 1000,
        gpuEffectiveClockMhz: 2600,
        fanSpeedPct: 30,
        cpuFanRpm: 800,
        gpuFanRpm: 0, // 0dB fan stop at idle
        thermalSoakFactorPct: 0,
      };
    }

    // 1. Power draw in Watts (Heat Generated)
    const cpuBaseTdp = machine.cpu.tdpW || 65;
    const cpuMaxPower = cpuBaseTdp > 65 ? cpuBaseTdp * 1.8 : 120; // PL2 / PPT
    const cpuInstantPowerW = 15 + (cpuMaxPower - 15) * Math.pow(cpuLoadPct / 100, 1.2);

    const isDedicatedGpu = machine.gpu.isDedicated;
    const gpuTgp = isDedicatedGpu ? (machine.gpu.powerW || 200) : 15;
    const gpuInstantPowerW = isDedicatedGpu
      ? 12 + (gpuTgp - 12) * Math.pow(gpuLoadPct / 100, 1.3)
      : 8 + 15 * (gpuLoadPct / 100);

    // 2. Cooler Dissipation Capability
    const coolerCapacityW = machine.cooling?.tdpCapacityW || 150;
    const caseFansCount = machine.fans?.count || 2;
    const airflowEfficiency = Math.min(1.2, 0.65 + caseFansCount * 0.12);

    // Dynamic Fan curve (Response to temp)
    const maxTemp = Math.max(prevState.cpuTemperatureC, prevState.gpuTemperatureC);
    const targetFanSpeedPct = Math.min(
      100,
      Math.max(30, Math.round(((maxTemp - 40) / 45) * 100))
    );
    // Smooth fan ramp-up (fans take a few seconds to reach target RPM)
    const fanSpeedPct = Math.round(prevState.fanSpeedPct + (targetFanSpeedPct - prevState.fanSpeedPct) * 0.15);
    const cpuFanRpm = Math.round(600 + (fanSpeedPct / 100) * 1400); // 600 - 2000 RPM
    const gpuFanRpm = isDedicatedGpu ? (maxTemp > 50 ? Math.round(800 + (fanSpeedPct / 100) * 1600) : 0) : 0;

    // Heat Dissipated by CPU cooler (Watts)
    const cpuCoolerEffectiveness = (coolerCapacityW / 180.0) * (fanSpeedPct / 100) * airflowEfficiency;
    const cpuDeltaT = prevState.cpuTemperatureC - prevState.caseInternalTemperatureC;
    const cpuHeatDissipatedW = Math.max(0, cpuDeltaT * 1.8 * cpuCoolerEffectiveness);

    // Heat Dissipated by GPU heatsink (Watts)
    const gpuDeltaT = prevState.gpuTemperatureC - prevState.caseInternalTemperatureC;
    const gpuHeatDissipatedW = Math.max(0, gpuDeltaT * 2.2 * (fanSpeedPct / 100) * airflowEfficiency);

    // 3. Differential Temperature Update
    // dT = (Q_in - Q_out) * dt / Mass
    const cpuTempChange = ((cpuInstantPowerW - cpuHeatDissipatedW) * dtSeconds) / this.CPU_COOLER_THERMAL_MASS;
    const gpuTempChange = ((gpuInstantPowerW - gpuHeatDissipatedW) * dtSeconds) / this.GPU_COOLER_THERMAL_MASS;

    const newCpuTemp = Math.max(ambient + 10, prevState.cpuTemperatureC + cpuTempChange);
    const newGpuTemp = Math.max(ambient + 8, prevState.gpuTemperatureC + gpuTempChange);

    // 4. Case Internal Thermal Soak
    // The internal air slowly heats up from total system heat minus case exhaust airflow
    const totalInternalHeatW = (cpuInstantPowerW + gpuInstantPowerW) * 0.45;
    const caseExhaustW = (prevState.caseInternalTemperatureC - ambient) * 6.5 * (fanSpeedPct / 100) * airflowEfficiency;
    const caseAirChange = ((totalInternalHeatW - caseExhaustW) * dtSeconds) / this.CHASSIS_AIR_THERMAL_MASS;
    const newCaseTemp = Math.max(ambient, prevState.caseInternalTemperatureC + caseAirChange);

    // SSD Temp (Passive heat + case ambient + NVMe IOPS read load)
    const ssdReadLoadFactor = Math.min(1.0, ssdReadMBps / 3000);
    const ssdTargetTemp = newCaseTemp + 8 + ssdReadLoadFactor * 24;
    const newSsdTemp = prevState.ssdTemperatureC + (ssdTargetTemp - prevState.ssdTemperatureC) * 0.05;

    // 5. Throttling and Clock Reduction Feedback Loop
    const cpuThermalHeadroom = parseFloat((cpuTjMax - newCpuTemp).toFixed(1));
    const gpuThermalHeadroom = parseFloat((gpuThermalLimit - newGpuTemp).toFixed(1));

    const isCpuThrottling = cpuThermalHeadroom <= 2.0;
    const isGpuThrottling = gpuThermalHeadroom <= 1.0;

    // Boost clock calculation with thermal rollback
    const baseBoostGhz = machine.cpu.boostClockGhz || 4.8;
    let cpuEffectiveClockMhz = baseBoostGhz * 1000;
    if (cpuThermalHeadroom < 10.0) {
      // Progressive thermal clock decay
      const penaltyMhz = Math.round((10.0 - Math.max(0, cpuThermalHeadroom)) * 45);
      cpuEffectiveClockMhz = Math.max((machine.cpu.baseClockGhz || 3.2) * 1000, cpuEffectiveClockMhz - penaltyMhz);
    }

    let gpuEffectiveClockMhz = isDedicatedGpu ? 2650 : 1500;
    if (gpuThermalHeadroom < 5.0) {
      const gpuPenaltyMhz = Math.round((5.0 - Math.max(0, gpuThermalHeadroom)) * 60);
      gpuEffectiveClockMhz = Math.max(1800, gpuEffectiveClockMhz - gpuPenaltyMhz);
    }

    const thermalSoakFactorPct = Math.min(
      100,
      Math.round(((newCaseTemp - ambient) / 20.0) * 100)
    );

    return {
      cpuTemperatureC: parseFloat(newCpuTemp.toFixed(1)),
      gpuTemperatureC: parseFloat(newGpuTemp.toFixed(1)),
      ssdTemperatureC: parseFloat(newSsdTemp.toFixed(1)),
      ambientTemperatureC: ambient,
      caseInternalTemperatureC: parseFloat(newCaseTemp.toFixed(1)),
      cpuThermalHeadroomC: cpuThermalHeadroom,
      gpuThermalHeadroomC: gpuThermalHeadroom,
      cpuTjMaxC: cpuTjMax,
      gpuThermalLimitC: gpuThermalLimit,
      isCpuThrottling,
      isGpuThrottling,
      cpuEffectiveClockMhz,
      gpuEffectiveClockMhz,
      fanSpeedPct,
      cpuFanRpm,
      gpuFanRpm,
      thermalSoakFactorPct,
    };
  }
}
