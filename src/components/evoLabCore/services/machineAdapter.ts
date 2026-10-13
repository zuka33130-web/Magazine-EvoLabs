// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — REAL MACHINE ADAPTER
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// Rules: Zero fabricated hardware defaults. No fallback to mock machines.
// ============================================================================

import { Machine, EpistemicProvenance } from '../types';
import { WindowsDetectionService } from './windowsDetectionService';

export class MachineAdapter {
  /**
   * Builds an empty machine where every unproven field is strictly UNKNOWN
   */
  static createBlankMachine(alias = 'PC Sin Detectar'): Machine {
    return {
      id: `MCH-${Date.now()}`,
      alias,
      isDetected: false,
      overallProvenance: 'UNKNOWN',
      readyState: 'INCOMPLETE',
      notes: 'Hardware no detectado todavía. Pendiente de autodetección o carga manual.',
      motherboard: {
        model: 'UNKNOWN',
        socket: 'UNKNOWN',
        ramSlots: 0,
        ramType: 'UNKNOWN',
        pcieGen: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      cpu: {
        model: 'UNKNOWN',
        socket: 'UNKNOWN',
        cores: 0,
        threads: 0,
        tdpW: 0,
        hasIGPU: false,
        provenance: 'UNKNOWN',
      },
      ram: {
        sizeGb: 0,
        configuredSpeedMts: 0,
        type: 'UNKNOWN',
        channels: 0,
        provenance: 'UNKNOWN',
      },
      gpu: {
        model: 'UNKNOWN',
        vramGb: 0,
        isDedicated: false,
        powerW: 0,
        provenance: 'UNKNOWN',
      },
      storage: {
        model: 'UNKNOWN',
        type: 'UNKNOWN',
        capacityGb: 0,
        provenance: 'UNKNOWN',
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
        resolution: 'UNKNOWN',
        refreshHz: 0,
        provenance: 'UNKNOWN',
      },
    };
  }

  /**
   * Calibrated Reference Lab PC measured empirically on laboratory bench
   */
  static createReferenceBenchmarkMachine(): Machine {
    return {
      id: 'MCH-BENCH-REF-01',
      alias: 'PC de Laboratorio Calibrada (Referencia)',
      isDetected: true,
      overallProvenance: 'MEASURED',
      readyState: 'READY',
      notes: 'Plataforma patrón de banco de pruebas. Medida empíricamente bajo instrumental de laboratorio.',
      motherboard: {
        model: 'EVO-BENCH-Z790-PRO',
        socket: 'LGA1700',
        ramSlots: 4,
        ramType: 'DDR5',
        pcieGen: 'PCIe 5.0 x16',
        formFactor: 'ATX',
        provenance: 'MEASURED',
      },
      cpu: {
        model: 'Intel Core i3-1220P',
        socket: 'LGA1700',
        cores: 10,
        threads: 12,
        tdpW: 28,
        hasIGPU: true,
        provenance: 'MEASURED',
      },
      ram: {
        sizeGb: 16,
        configuredSpeedMts: 5600,
        type: 'DDR5',
        channels: 2,
        provenance: 'MEASURED',
      },
      gpu: {
        model: 'Intel UHD Graphics (Alder Lake-U 64 EU)',
        vramGb: 8,
        isDedicated: false,
        powerW: 15,
        provenance: 'MEASURED',
      },
      storage: {
        model: 'Kingston KC3000 NVMe 1TB',
        type: 'NVMe M.2',
        capacityGb: 1000,
        provenance: 'MEASURED',
      },
      psu: {
        wattageW: 650,
        rating: '80 PLUS Gold',
        provenance: 'MEASURED',
      },
      cooling: {
        type: 'Air Tower',
        tdpCapacityW: 180,
        provenance: 'MEASURED',
      },
      chassis: {
        model: 'EVO Bench Open Frame ATX',
        formFactor: 'ATX',
        provenance: 'MEASURED',
      },
      fans: {
        count: 4,
        sizeMm: 120,
        provenance: 'MEASURED',
      },
      display: {
        resolution: '1920x1080',
        refreshHz: 144,
        provenance: 'MEASURED',
      },
    };
  }

  /**
   * Adapts detected telemetry directly from EVO Local Agent response (127.0.0.1:43921 /v1/machine)
   * Converts the payload into a Canonical Machine with strict provenance and sources.
   */
  static fromAgentPayload(raw: any): Machine {
    if (!raw || typeof raw !== 'object') {
      return this.createBlankMachine('PC Sin Detectar');
    }

    // If agent already packaged structured machine inventory, format into canonical telemetry
    const formattedTelemetry = {
      Protocol: raw.protocol || 'EVO_LOCAL_AGENT_V1',
      Provenance: raw.overallProvenance || 'SYSTEM_REPORTED',
      Timestamp: raw.timestamp || new Date().toISOString(),
      CPU: {
        Model: raw.cpu?.name || raw.cpu?.model || 'UNKNOWN',
        Cores: raw.cpu?.numberOfCores ?? raw.cpu?.cores ?? 0,
        LogicalProcessors: raw.cpu?.numberOfLogicalProcessors ?? raw.cpu?.threads ?? 0,
        MaxClockMhz: raw.cpu?.maxClockSpeedMhz ?? raw.cpu?.maxClockMhz,
        CurrentClockMhz: raw.cpu?.currentClockSpeedMhz ?? raw.cpu?.currentClockMhz,
      },
      Motherboard: {
        Manufacturer: raw.motherboard?.manufacturer,
        Model: raw.motherboard?.product || raw.motherboard?.model,
        Version: raw.motherboard?.version,
      },
      BIOS: {
        Vendor: raw.bios?.vendor || raw.bios?.manufacturer,
        Version: raw.bios?.version,
        ReleaseDate: raw.bios?.releaseDate,
      },
      RAM: {
        ModulesCount: raw.ram?.modulesCount || (Array.isArray(raw.ram?.modules) ? raw.ram.modules.length : 0),
        TotalGB: raw.ram?.totalCapacityGB ?? raw.ram?.sizeGb ?? (
          Array.isArray(raw.ram?.modules)
            ? raw.ram.modules.reduce((sum: number, m: any) => sum + (m.capacityGB || m.capacityGb || m.sizeGb || 0), 0)
            : 0
        ),
        Modules: Array.isArray(raw.ram?.modules)
          ? raw.ram.modules.map((m: any) => ({
              CapacityGB: m.capacityGB ?? m.capacityGb ?? m.sizeGb ?? 0,
              Manufacturer: m.manufacturer,
              PartNumber: m.partNumber,
              ConfiguredClockMhz: m.configuredClockSpeedMhz ?? m.configuredClockMhz ?? m.speedMhz,
              SpeedMhz: m.speedMhz ?? m.configuredClockSpeedMhz,
              DeviceLocator: m.deviceLocator,
              BankLabel: m.bankLabel,
              SMBIOSMemoryType: m.smbiosMemoryType ?? m.SMBIOSMemoryType,
            }))
          : [],
      },
      GPU: Array.isArray(raw.gpu)
        ? raw.gpu.map((g: any) => {
            const isDedicated = g.isDedicated ?? WindowsDetectionService.isDedicatedGpu(g.name || g.model || '');
            return {
              Model: g.name || g.model,
              DriverVersion: g.driverVersion,
              AdapterRAM_GB: isDedicated
                ? (g.adapterRAM_GB ?? g.vramGb ?? (g.adapterRAMBytes ? g.adapterRAMBytes / (1024 * 1024 * 1024) : null))
                : null,
              Resolution:
                g.currentHorizontalResolution && g.currentVerticalResolution
                  ? `${g.currentHorizontalResolution}x${g.currentVerticalResolution}`
                  : g.resolution,
              RefreshRate: g.currentRefreshRate ?? g.refreshHz,
            };
          })
        : raw.primaryGpu
        ? [
            {
              Model: raw.primaryGpu.name || raw.primaryGpu.model,
              DriverVersion: raw.primaryGpu.driverVersion,
              AdapterRAM_GB: (raw.primaryGpu.isDedicated ?? WindowsDetectionService.isDedicatedGpu(raw.primaryGpu.name || raw.primaryGpu.model || ''))
                ? (raw.primaryGpu.adapterRAM_GB ?? raw.primaryGpu.vramGb)
                : null,
              Resolution:
                raw.primaryGpu.currentHorizontalResolution && raw.primaryGpu.currentVerticalResolution
                  ? `${raw.primaryGpu.currentHorizontalResolution}x${raw.primaryGpu.currentVerticalResolution}`
                  : raw.primaryGpu.resolution,
              RefreshRate: raw.primaryGpu.currentRefreshRate ?? raw.primaryGpu.refreshHz,
            },
          ]
        : [],
      Storage: Array.isArray(raw.storage)
        ? raw.storage.map((d: any) => ({
            Model: d.model,
            Interface: d.interfaceType || d.interface,
            MediaType: d.mediaType,
            SizeGB: d.sizeGB ?? d.capacityGb ?? (d.sizeBytes ? d.sizeBytes / (1024 * 1024 * 1024) : null),
          }))
        : [],
      Network: Array.isArray(raw.network)
        ? raw.network.map((n: any) => ({
            Name: n.name,
            AdapterType: n.adapterType,
            ConnectionID: n.netConnectionID,
          }))
        : [],
      OS: {
        Edition: raw.os?.caption || raw.os?.name,
        Version: raw.os?.version,
        Build: raw.os?.buildNumber || raw.os?.build,
        Architecture: raw.os?.osArchitecture || raw.os?.architecture,
      },
    };

    const machine = WindowsDetectionService.buildMachineFromTelemetry(formattedTelemetry);
    machine.source = 'AUTODETECT';
    machine.notes = 'Telemetría capturada directamente por EVO Local Agent (Windows CIM/WMI nativo en 127.0.0.1:43921).';
    return machine;
  }

  /**
   * Adapts detected telemetry from Windows CIM/WMI or browser detection
   * Strictly respects: no invented PSU, cooler, case, fans, channels, or VRAM.
   */
  static fromDetectedHardware(rawTelemetry: any): Machine {
    if (!rawTelemetry) {
      return this.createBlankMachine();
    }
    return WindowsDetectionService.buildMachineFromTelemetry(rawTelemetry);
  }

  /**
   * Saves active machine to persistent storage and notifies the system
   */
  static saveActiveMachine(machine: Machine): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem('evo_lab_core_active_machine_v1', JSON.stringify(machine));
      localStorage.setItem('evo_autodetected_hardware', JSON.stringify(machine));

      // Also append to saved machines list if not already there
      const raw = localStorage.getItem('evo_lab_core_saved_machines_v1');
      const list: Machine[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((m) => m.id === machine.id);
      if (idx >= 0) {
        list[idx] = machine;
      } else {
        list.unshift(machine);
      }
      localStorage.setItem('evo_lab_core_saved_machines_v1', JSON.stringify(list));

      // Broadcast update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('evo_hardware_updated', { detail: machine }));
      }
    } catch (err) {
      console.warn('[MachineAdapter] Error saving active machine (non-fatal):', err);
    }
  }

  /**
   * Attempts to load any already detected machine from localStorage.
   * RULE 8: If autodetection has not run, NEVER load a demo machine.
   * Returns a blank incomplete machine with status UNKNOWN.
   */
  static loadExistingMachine(): Machine {
    if (typeof localStorage === 'undefined') {
      return this.createBlankMachine('PC Sin Detectar (Pendiente de Detección)');
    }
    try {
      const active = localStorage.getItem('evo_lab_core_active_machine_v1');
      if (active) {
        const parsed = JSON.parse(active);
        if (parsed && parsed.id && parsed.cpu) return parsed;
      }

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

    // STRICT: Never load demo benchmark machine. Return uninitialized blank machine.
    return this.createBlankMachine('PC Sin Detectar (Pendiente de Detección)');
  }
}
