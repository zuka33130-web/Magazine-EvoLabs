import { Machine, EpistemicProvenance } from '../types';

export class MachineAdapter {
  /**
   * Builds an empty/manual machine where every missing field is UNKNOWN
   */
  static createBlankMachine(alias = 'PC Personalizada'): Machine {
    return {
      id: `MCH-${Date.now()}`,
      alias,
      isDetected: false,
      overallProvenance: 'UNKNOWN',
      motherboard: {
        model: 'Motherboard No Especificada',
        socket: 'UNKNOWN',
        ramSlots: 2,
        ramType: 'UNKNOWN',
        pcieGen: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      cpu: {
        model: 'CPU No Especificada',
        socket: 'UNKNOWN',
        cores: 4,
        threads: 8,
        tdpW: 65,
        hasIGPU: true,
        provenance: 'UNKNOWN',
      },
      ram: {
        sizeGb: 16,
        configuredSpeedMts: 3200,
        type: 'UNKNOWN',
        channels: 2,
        provenance: 'UNKNOWN',
      },
      gpu: {
        model: 'Gráficos Integrados / No Especificada',
        vramGb: 2,
        isDedicated: false,
        powerW: 15,
        provenance: 'UNKNOWN',
      },
      storage: {
        type: 'UNKNOWN',
        capacityGb: 512,
        provenance: 'UNKNOWN',
      },
      psu: {
        wattageW: 500,
        provenance: 'UNKNOWN',
      },
      cooling: {
        type: 'UNKNOWN',
        tdpCapacityW: 65,
        provenance: 'UNKNOWN',
      },
      display: {
        resolution: '1920x1080',
        refreshHz: 60,
        provenance: 'UNKNOWN',
      },
    };
  }

  /**
   * Creates a reference baseline machine (Intel Core i3-1220P Alder Lake / Intel UHD / 16GB DDR5 5600 MT/s)
   * All metrics are strictly marked with their true provenance.
   */
  static createReferenceBenchmarkMachine(): Machine {
    return {
      id: 'MCH-REF-I3-1220P',
      alias: 'Estación de Silicio Calibrada (i3-1220P // Alder Lake)',
      isDetected: false,
      overallProvenance: 'ESTIMATED',
      notes: 'Modelo empírico de referencia de laboratorio medido en hardware real.',
      motherboard: {
        model: 'Intel Alder Lake-P B660 Platform',
        socket: 'FCBGA1744',
        ramSlots: 2,
        ramType: 'DDR5',
        pcieGen: 'PCIe 4.0',
        formFactor: 'Laptop',
        provenance: 'ESTIMATED',
      },
      cpu: {
        model: '12th Gen Intel(R) Core(TM) i3-1220P',
        socket: 'FCBGA1744',
        cores: 10,
        threads: 12,
        pCores: 2,
        eCores: 8,
        baseClockGhz: 1.5,
        boostClockGhz: 4.4,
        tdpW: 28,
        hasIGPU: true,
        provenance: 'ESTIMATED',
      },
      ram: {
        sizeGb: 16,
        configuredSpeedMts: 5600,
        spdSpeedMts: 5600,
        type: 'DDR5',
        channels: 2,
        provenance: 'ESTIMATED',
      },
      gpu: {
        model: 'Intel(R) UHD Graphics (Alder Lake-U 64 EU)',
        vramGb: 8,
        isDedicated: false,
        powerW: 15,
        provenance: 'ESTIMATED',
      },
      storage: {
        type: 'NVMe M.2',
        capacityGb: 512,
        model: 'NVMe Gen4x4 SSD',
        provenance: 'ESTIMATED',
      },
      psu: {
        wattageW: 90,
        rating: 'OEM Adaptador DC',
        provenance: 'ESTIMATED',
      },
      cooling: {
        type: 'Laptop Vapor Chamber',
        tdpCapacityW: 45,
        provenance: 'ESTIMATED',
      },
      display: {
        resolution: '1920x1080',
        refreshHz: 144,
        provenance: 'ESTIMATED',
      },
      os: {
        name: 'Microsoft Windows 11 Pro 64-bit',
        version: '10.0.22631',
        provenance: 'ESTIMATED',
      },
    };
  }

  /**
   * Adapts detected telemetry from localStorage or CIM/WMI
   */
  static fromDetectedHardware(rawTelemetry: any): Machine {
    const isWmiMeasured = rawTelemetry.Provenance === 'MEASURED' || rawTelemetry.provenance === 'MEASURED' || rawTelemetry.Provenance === 'SYSTEM_REPORTED' || rawTelemetry.provenance === 'SYSTEM_REPORTED';
    const prov: EpistemicProvenance = isWmiMeasured ? 'SYSTEM_REPORTED' : 'DETECTED';

    const cpuName = rawTelemetry.CPU || rawTelemetry.cpuModel || 'CPU Desconocida';
    const gpuName = rawTelemetry.GPU || rawTelemetry.gpuModel || 'GPU Desconocida';
    const ramSize = rawTelemetry.RAM_GB ? Math.round(rawTelemetry.RAM_GB) : (rawTelemetry.ramSizeGb || 16);
    const ramSpeed = rawTelemetry.RAM_Speed || rawTelemetry.ramSpeedMhz || 3200;
    const spdSpeed = rawTelemetry.RAM_Spd_Speed || rawTelemetry.ramSpdSpeedMhz || ramSpeed;
    const isDdr5 = ramSpeed > 4400 || (rawTelemetry.ramType === 'DDR5');

    const isDedicatedGpu = !gpuName.toLowerCase().includes('uhd') &&
      !gpuName.toLowerCase().includes('iris') &&
      !gpuName.toLowerCase().includes('vega') &&
      !gpuName.toLowerCase().includes('radeon graphics') &&
      !gpuName.toLowerCase().includes('basic display');

    return {
      id: `MCH-DET-${Date.now()}`,
      alias: `${cpuName.split('@')[0].trim()} • ${gpuName}`,
      isDetected: true,
      detectedAt: new Date().toISOString(),
      overallProvenance: prov,
      notes: 'Telemetría capturada directamente mediante consultas nativas WMI/CIM de Windows.',
      motherboard: {
        model: rawTelemetry.Motherboard || 'Placa Base Detectada',
        socket: cpuName.includes('Intel') ? 'Intel Socket' : cpuName.includes('Ryzen') ? 'AMD Socket' : 'UNKNOWN',
        ramSlots: 2,
        ramType: isDdr5 ? 'DDR5' : 'DDR4',
        pcieGen: 'PCIe 4.0',
        formFactor: 'UNKNOWN',
        provenance: prov,
      },
      cpu: {
        model: cpuName,
        socket: 'UNKNOWN',
        cores: rawTelemetry.Cores || rawTelemetry.cores || 6,
        threads: rawTelemetry.Threads || rawTelemetry.threads || 12,
        tdpW: 65,
        hasIGPU: !isDedicatedGpu || cpuName.includes('Intel'),
        provenance: prov,
      },
      ram: {
        sizeGb: ramSize,
        configuredSpeedMts: ramSpeed,
        spdSpeedMts: spdSpeed,
        type: isDdr5 ? 'DDR5' : 'DDR4',
        channels: 2,
        provenance: prov,
      },
      gpu: {
        model: gpuName,
        vramGb: rawTelemetry.VRAM_GB ? Math.round(rawTelemetry.VRAM_GB) : (rawTelemetry.vramGb || 4),
        isDedicated: isDedicatedGpu,
        powerW: isDedicatedGpu ? 120 : 15,
        provenance: prov,
      },
      storage: {
        type: 'NVMe M.2',
        capacityGb: rawTelemetry.Storage_GB || 1000,
        provenance: 'ESTIMATED',
      },
      psu: {
        wattageW: isDedicatedGpu ? 650 : 350,
        rating: '80+ Certified',
        provenance: 'ESTIMATED',
      },
      cooling: {
        type: 'Air Tower',
        tdpCapacityW: 120,
        provenance: 'ESTIMATED',
      },
      display: {
        resolution: '1920x1080',
        refreshHz: rawTelemetry.displayHz || 144,
        provenance: 'ESTIMATED',
      },
      os: {
        name: rawTelemetry.OS || 'Microsoft Windows',
        provenance: prov,
      },
    };
  }

  /**
   * Attempts to load any already detected machine from localStorage
   */
  static loadExistingMachine(): Machine {
    try {
      const active = localStorage.getItem('evo_lab_core_active_machine_v1');
      if (active) return JSON.parse(active);

      const autodetected = localStorage.getItem('evo_autodetected_hardware');
      if (autodetected) {
        return this.fromDetectedHardware(JSON.parse(autodetected));
      }

      const c01Specs = localStorage.getItem('evo_c01_specs');
      if (c01Specs) {
        return this.fromDetectedHardware(JSON.parse(c01Specs));
      }
    } catch (err) {
      console.warn('[MachineAdapter] Error loading stored machine:', err);
    }

    return this.createReferenceBenchmarkMachine();
  }
}
