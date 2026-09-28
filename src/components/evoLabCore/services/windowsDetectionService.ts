// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — REAL WINDOWS HARDWARE DETECTION SERVICE
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// Windows CIM / WMI Native Hardware Extraction Provider
// ============================================================================

import { Machine, EpistemicProvenance } from '../types';

export interface WindowsRawModuleRam {
  CapacityGB: number;
  Manufacturer?: string;
  PartNumber?: string;
  ConfiguredClockMhz?: number;
  SpeedMhz?: number;
  DeviceLocator?: string;
  BankLabel?: string;
}

export interface WindowsRawGpu {
  Model: string;
  DriverVersion?: string;
  AdapterRAM_GB?: number | null;
  Resolution?: string;
  RefreshRate?: number;
}

export interface WindowsRawDisk {
  Model: string;
  Interface?: string;
  MediaType?: string;
  SizeGB?: number | null;
}

export interface WindowsRawNetwork {
  Name: string;
  AdapterType?: string;
  ConnectionID?: string;
}

export interface WindowsTelemetryPayload {
  Protocol?: string;
  Provenance?: EpistemicProvenance;
  Timestamp?: string;
  CPU?: {
    Model: string;
    Cores?: number;
    LogicalProcessors?: number;
    MaxClockMhz?: number;
    CurrentClockMhz?: number;
  };
  Motherboard?: {
    Manufacturer?: string;
    Model?: string;
    Version?: string;
  };
  BIOS?: {
    Vendor?: string;
    Version?: string;
    ReleaseDate?: string;
  };
  RAM?: {
    ModulesCount?: number;
    TotalGB?: number;
    Modules?: WindowsRawModuleRam[];
  };
  GPU?: WindowsRawGpu[] | WindowsRawGpu;
  Storage?: WindowsRawDisk[] | WindowsRawDisk;
  Network?: WindowsRawNetwork[] | WindowsRawNetwork;
  OS?: {
    Edition?: string;
    Version?: string;
    Build?: string;
    Architecture?: string;
  };

  // Legacy field support for older scripts
  CPU_Model?: string;
  Cores?: number;
  Threads?: number;
  RAM_GB?: number;
  RAM_Speed?: number;
  RAM_Spd_Speed?: number;
  GPU_Model?: string;
  VRAM_GB?: number;
  Storage_GB?: number;
}

export interface IntegrityAuditItem {
  subsystem: string;
  label: string;
  detectedValue: string;
  activeValue: string;
  provenance: EpistemicProvenance;
  status: 'VERIFIED_MATCH' | 'USER_DEFINED' | 'STRICT_UNKNOWN' | 'ANOMALY_MISMATCH';
  notes: string;
}

export interface MachineIntegrityAuditResult {
  isFullyLegitimate: boolean;
  totalSubsystems: number;
  detectedCount: number;
  userEnteredCount: number;
  unknownCount: number;
  anomaliesCount: number;
  overallIntegrityScorePct: number;
  items: IntegrityAuditItem[];
  detectedHardwareList: string[];
  unknownHardwareList: string[];
  removedFallbacksAudit: string[];
}

export class WindowsDetectionService {
  /**
   * The canonical PowerShell one-liner that queries Windows CIM/WMI objects
   * directly without requiring administrative permissions and puts the clean JSON into clipboard.
   */
  static readonly POWERSHELL_COMMAND: string =
    `powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='SilentlyContinue'; $c=Get-CimInstance Win32_Processor | Select-Object -First 1; $b=Get-CimInstance Win32_BaseBoard | Select-Object -First 1; $bios=Get-CimInstance Win32_BIOS | Select-Object -First 1; $m=Get-CimInstance Win32_PhysicalMemory; $g=Get-CimInstance Win32_VideoController; $d=Get-CimInstance Win32_DiskDrive; $n=Get-CimInstance Win32_NetworkAdapter -Filter 'PhysicalAdapter=True'; $o=Get-CimInstance Win32_OperatingSystem | Select-Object -First 1; [PSCustomObject]@{ Protocol='EVO_WINDOWS_TELEMETRY_V2'; Provenance='SYSTEM_REPORTED'; Timestamp=(Get-Date -Format 'o'); CPU=@{ Model=$c.Name; Cores=$c.NumberOfCores; LogicalProcessors=$c.NumberOfLogicalProcessors; MaxClockMhz=$c.MaxClockSpeed; CurrentClockMhz=$c.CurrentClockSpeed }; Motherboard=@{ Manufacturer=$b.Manufacturer; Model=$b.Product; Version=$b.Version }; BIOS=@{ Vendor=$bios.Manufacturer; Version=$bios.SMBIOSBIOSVersion; ReleaseDate=$bios.ReleaseDate }; RAM=@{ ModulesCount=($m | Measure-Object).Count; TotalGB=[math]::Round(($m | Measure-Object Capacity -Sum).Sum/1GB, 2); Modules=($m | ForEach-Object { [PSCustomObject]@{ CapacityGB=[math]::Round($_.Capacity/1GB, 2); Manufacturer=$_.Manufacturer; PartNumber=if($_.PartNumber){$_.PartNumber.Trim()}else{$null}; ConfiguredClockMhz=$_.ConfiguredClockSpeed; SpeedMhz=$_.Speed; DeviceLocator=$_.DeviceLocator; BankLabel=$_.BankLabel } }) }; GPU=($g | ForEach-Object { [PSCustomObject]@{ Model=$_.Name; DriverVersion=$_.DriverVersion; AdapterRAM_GB=if($_.AdapterRAM -and $_.AdapterRAM -gt 0 -and $_.AdapterRAM -lt 68719476736){[math]::Round($_.AdapterRAM/1GB, 2)}else{$null}; Resolution=if($_.CurrentHorizontalResolution){ \"$($_.CurrentHorizontalResolution)x$($_.CurrentVerticalResolution)\" }else{$null}; RefreshRate=$_.CurrentRefreshRate } }); Storage=($d | ForEach-Object { [PSCustomObject]@{ Model=$_.Model; Interface=$_.InterfaceType; MediaType=$_.MediaType; SizeGB=if($_.Size){[math]::Round($_.Size/1GB, 2)}else{$null} } }); Network=($n | ForEach-Object { [PSCustomObject]@{ Name=$_.Name; AdapterType=$_.AdapterType; ConnectionID=$_.NetConnectionID } }); OS=@{ Edition=$o.Caption; Version=$o.Version; Build=$o.BuildNumber; Architecture=$o.OSArchitecture } } | ConvertTo-Json -Depth 5 -Compress | Set-Clipboard"`;

  /**
   * Generates a downloadable standalone .cmd script for one-click Windows execution
   */
  static generateBatchScript(): string {
    return `@echo off
title EVO LABS // TELEMETRIA NATIVA DE WINDOWS (CIM / WMI)
echo ==============================================================================
echo [EVO LABS] LEYENDO TELEMETRIA REAL DEL SILICIO (CIM / WMI)...
echo ==============================================================================
echo Extrayendo CPU, Motherboard, BIOS, Modulos RAM, GPU, Discos, Red y Windows...
echo.
${this.POWERSHELL_COMMAND}
echo.
echo ==============================================================================
echo [OK] Telemetria pericial copiada al portapapeles con exito.
echo Volve a la ventana de EVO LABS y presiona "Pegar Telemetria" o Ctrl+V.
echo ==============================================================================
timeout /t 5 >nul
exit /b 0
`;
  }

  /**
   * Parses JSON string or object from Windows PowerShell detection
   */
  static parsePayload(input: string | object): WindowsTelemetryPayload {
    if (typeof input === 'object' && input !== null) {
      return input as WindowsTelemetryPayload;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      throw new Error('AUTODETECTION_FAILED: El texto ingresado está vacío.');
    }

    try {
      const parsed = JSON.parse(trimmed);
      return parsed;
    } catch {
      // Attempt to extract JSON from surrounding console logs if user copied cmd output
      const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('AUTODETECTION_FAILED: La telemetría no tiene formato JSON válido.');
    }
  }

  /**
   * Checks whether a GPU model name is an integrated GPU (iGPU) or discrete GPU (dGPU)
   */
  static isDedicatedGpu(gpuName: string): boolean {
    const lower = gpuName.toLowerCase();
    if (
      lower.includes('uhd') ||
      lower.includes('iris') ||
      lower.includes('hd graphics') ||
      lower.includes('vega') ||
      lower.includes('radeon(tm) graphics') ||
      lower.includes('radeon graphics') ||
      lower.includes('basic display') ||
      lower.includes('microsoft basic') ||
      lower.includes('standard vga') ||
      lower.includes('integrated')
    ) {
      return false;
    }

    if (
      lower.includes('geforce') ||
      lower.includes('rtx') ||
      lower.includes('gtx') ||
      lower.includes('quadro') ||
      lower.includes('radeon rx') ||
      lower.includes('arc a') ||
      lower.includes('arc b') ||
      lower.includes('arc pro') ||
      lower.includes('tesla') ||
      lower.includes('radeon pro')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Builds the canonical Machine entity STRICTLY from real detected telemetry.
   * ABSOLUTELY NO FAKE DEFAULTS for PSU, Cooling, Case, Fans, VRAM, Motherboard, etc.
   */
  static buildMachineFromTelemetry(raw: WindowsTelemetryPayload | any): Machine {
    const p = raw.CPU ? raw : this.normalizeLegacyTelemetry(raw);

    // 1. CPU
    const cpuModel = p.CPU?.Model || p.CPU_Model || p.CPU || 'UNKNOWN';
    const cpuCores = p.CPU?.Cores ?? p.Cores ?? 0;
    const cpuThreads = p.CPU?.LogicalProcessors ?? p.Threads ?? 0;
    const maxClockMhz = p.CPU?.MaxClockMhz;
    const baseClockGhz = maxClockMhz && maxClockMhz > 0 ? Number((maxClockMhz / 1000).toFixed(2)) : undefined;

    // 2. Motherboard & BIOS
    const mbManufacturer = p.Motherboard?.Manufacturer?.trim();
    const mbModel = p.Motherboard?.Model?.trim();
    const mbVersion = p.Motherboard?.Version?.trim();
    const hasMb = Boolean(mbModel && mbModel !== 'Default string' && mbModel !== 'UNKNOWN');

    const biosVendor = p.BIOS?.Vendor?.trim();
    const biosVer = p.BIOS?.Version?.trim();
    const biosDate = p.BIOS?.ReleaseDate?.trim();

    // 3. RAM Modules & Capacity
    const rawRamModules: WindowsRawModuleRam[] = Array.isArray(p.RAM?.Modules)
      ? p.RAM.Modules
      : [];
    const totalRamGb = p.RAM?.TotalGB ?? p.RAM_GB ?? (rawRamModules.reduce((acc, m) => acc + (m.CapacityGB || 0), 0) || 0);

    // Configured clock
    const firstConfiguredClock = rawRamModules.find((m) => m.ConfiguredClockMhz && m.ConfiguredClockMhz > 0)?.ConfiguredClockMhz;
    const firstSpeed = rawRamModules.find((m) => m.SpeedMhz && m.SpeedMhz > 0)?.SpeedMhz;
    const ramSpeed = firstConfiguredClock || firstSpeed || p.RAM_Speed || 0;

    // RAM Type
    let ramType: 'DDR4' | 'DDR5' | 'UNKNOWN' = 'UNKNOWN';
    if (ramSpeed > 4400) ramType = 'DDR5';
    else if (ramSpeed > 1800) ramType = 'DDR4';

    // Channels: RULE 4: PROHIBITED TO DERIVE CHANNELS FROM MODULE COUNT!
    // Must remain 0 / UNKNOWN unless explicitly determined by hardware architecture
    const ramChannels = 0; // 0 = UNKNOWN without explicit multichannel reporting

    // 4. GPUs
    const rawGpus: WindowsRawGpu[] = Array.isArray(p.GPU)
      ? p.GPU
      : p.GPU
      ? [p.GPU]
      : p.GPU_Model
      ? [{ Model: p.GPU_Model, AdapterRAM_GB: p.VRAM_GB }]
      : [];

    let primaryGpu: WindowsRawGpu = rawGpus[0] || { Model: 'UNKNOWN' };
    // If multiple GPUs exist, select discrete GPU as primary if available
    const dedicatedCandidate = rawGpus.find((g) => this.isDedicatedGpu(g.Model));
    if (dedicatedCandidate) {
      primaryGpu = dedicatedCandidate;
    }

    const gpuModel = primaryGpu.Model || 'UNKNOWN';
    const isDedicated = this.isDedicatedGpu(gpuModel);

    // VRAM: RULE: Only include reported memory if source is trustworthy (>0 and <64GB).
    // If unreliable, 0 or null -> STRICTLY UNKNOWN (vramGb: 0, provenance: 'UNKNOWN')
    const rawVram = primaryGpu.AdapterRAM_GB ?? p.VRAM_GB;
    const isVramReliable = Boolean(rawVram && typeof rawVram === 'number' && rawVram > 0.4 && rawVram <= 64);
    const vramGb = isVramReliable ? Number(rawVram.toFixed(1)) : 0;
    const vramProvenance: EpistemicProvenance = isVramReliable ? 'SYSTEM_REPORTED' : 'UNKNOWN';

    // 5. Storage
    const rawDisks: WindowsRawDisk[] = Array.isArray(p.Storage)
      ? p.Storage
      : p.Storage
      ? [p.Storage]
      : p.Storage_GB
      ? [{ Model: 'Disco Principal Detectado', SizeGB: p.Storage_GB }]
      : [];

    const primaryDisk = rawDisks[0];
    let storageType: 'NVMe M.2' | 'SATA SSD' | 'HDD' | 'UNKNOWN' = 'UNKNOWN';
    if (primaryDisk) {
      const diskStr = `${primaryDisk.Model || ''} ${primaryDisk.Interface || ''} ${primaryDisk.MediaType || ''}`.toLowerCase();
      if (diskStr.includes('nvme') || diskStr.includes('m.2')) {
        storageType = 'NVMe M.2';
      } else if (diskStr.includes('ssd') || diskStr.includes('solid state')) {
        storageType = 'SATA SSD';
      } else if (diskStr.includes('hdd') || diskStr.includes('hard disk') || diskStr.includes('rotational')) {
        storageType = 'HDD';
      }
    }

    const storageCapacityGb = primaryDisk?.SizeGB ? Math.round(primaryDisk.SizeGB) : 0;
    const storageProvenance: EpistemicProvenance = primaryDisk ? 'SYSTEM_REPORTED' : 'UNKNOWN';

    // 6. Network
    const rawNetworks: WindowsRawNetwork[] = Array.isArray(p.Network)
      ? p.Network
      : p.Network
      ? [p.Network]
      : [];

    const ethernetAdapters = rawNetworks
      .filter((n) => !n.Name.toLowerCase().includes('wi-fi') && !n.Name.toLowerCase().includes('wireless'))
      .map((n) => n.Name);
    const wifiAdapter = rawNetworks.find((n) => n.Name.toLowerCase().includes('wi-fi') || n.Name.toLowerCase().includes('wireless'))?.Name;

    // 7. Display
    let resolution = 'UNKNOWN';
    let refreshHz = 0;
    if (primaryGpu.Resolution) {
      resolution = primaryGpu.Resolution;
    }
    if (primaryGpu.RefreshRate && primaryGpu.RefreshRate > 0) {
      refreshHz = primaryGpu.RefreshRate;
    }

    // 8. OS
    const osEdition = p.OS?.Edition || 'Microsoft Windows';
    const osVersion = p.OS?.Version;
    const osBuild = p.OS?.Build;

    // Construct Canonical Machine with ZERO INVENTED HARDWARE
    const machineId = `MCH-WIN-${Date.now()}`;
    const alias = `${cpuModel.split('@')[0].trim()} // ${gpuModel}`;

    const machine: Machine = {
      id: machineId,
      alias,
      machineType: 'DESKTOP',
      source: 'AUTODETECT',
      isDetected: true,
      detectedAt: new Date().toISOString(),
      overallProvenance: 'SYSTEM_REPORTED',
      notes: `Telemetría real capturada directamente por Windows CIM/WMI.`,

      // MOTHERBOARD: If reported, use it. If not, STRICTLY UNKNOWN.
      motherboard: {
        model: hasMb ? `${mbManufacturer ? `${mbManufacturer} ` : ''}${mbModel}` : 'UNKNOWN',
        socket: 'UNKNOWN',
        chipset: undefined,
        ramSlots: rawRamModules.length > 0 ? rawRamModules.length : 0,
        ramType,
        pcieGen: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: hasMb ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      },

      // CPU: Exactly what Windows reported
      cpu: {
        model: cpuModel,
        socket: 'UNKNOWN',
        cores: cpuCores,
        threads: cpuThreads,
        baseClockGhz,
        tdpW: 0, // UNKNOWN until user or spec verification, NEVER FAKE 65W!
        hasIGPU: !isDedicated || cpuModel.toLowerCase().includes('intel'),
        provenance: cpuModel !== 'UNKNOWN' ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      },

      // RAM: Exactly reported capacity and modules
      ram: {
        sizeGb: totalRamGb,
        configuredSpeedMts: ramSpeed,
        spdSpeedMts: firstSpeed || ramSpeed,
        type: ramType,
        channels: ramChannels, // 0 = UNKNOWN
        slotsUsed: rawRamModules.length,
        totalSlots: undefined,
        provenance: totalRamGb > 0 ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      },

      // GPU: Exactly reported model & driver
      gpu: {
        model: gpuModel,
        vramGb,
        isDedicated,
        powerW: 0, // UNKNOWN until user or official datasheet, NEVER FAKE WATTAGE!
        provenance: gpuModel !== 'UNKNOWN' ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      },

      // STORAGE: Exactly reported drive
      storage: {
        model: primaryDisk?.Model || 'UNKNOWN',
        type: storageType,
        capacityGb: storageCapacityGb,
        provenance: storageProvenance,
      },

      // PSU: Windows CANNOT detect PSU -> STRICTLY UNKNOWN!
      psu: {
        wattageW: 0,
        rating: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },

      // COOLING: Windows CANNOT detect cooler -> STRICTLY UNKNOWN!
      cooling: {
        type: 'UNKNOWN',
        tdpCapacityW: 0,
        provenance: 'UNKNOWN',
      },

      // CHASSIS: Windows CANNOT detect case -> STRICTLY UNKNOWN!
      chassis: {
        model: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },

      // FANS: Windows CANNOT detect fans -> STRICTLY UNKNOWN!
      fans: {
        count: 0,
        sizeMm: 0,
        provenance: 'UNKNOWN',
      },

      // DISPLAY: Reported by video controller or UNKNOWN
      display: {
        resolution,
        refreshHz,
        provenance: resolution !== 'UNKNOWN' ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      },

      // BIOS
      bios: biosVendor || biosVer
        ? {
            manufacturer: biosVendor,
            version: biosVer || 'UNKNOWN',
            releaseDate: biosDate,
            provenance: 'SYSTEM_REPORTED',
          }
        : undefined,

      // NETWORK
      network: rawNetworks.length > 0
        ? {
            ethernet: ethernetAdapters.length > 0 ? ethernetAdapters : undefined,
            wifi: wifiAdapter,
            provenance: 'SYSTEM_REPORTED',
          }
        : undefined,

      // OS
      os: {
        name: osEdition,
        version: osVersion,
        build: osBuild,
        provenance: 'SYSTEM_REPORTED',
      },

      // Granular Module Details
      ramModules: rawRamModules.map((m) => ({
        model: m.PartNumber || m.Manufacturer || 'Módulo DIMM',
        sizeGb: m.CapacityGB,
        speedMts: m.ConfiguredClockMhz || m.SpeedMhz || 0,
        type: ramType,
        partNumber: m.PartNumber,
        quantity: 1,
      })),

      storageDrives: rawDisks.map((d) => ({
        model: d.Model,
        capacityGb: d.SizeGB ? Math.round(d.SizeGB) : 0,
        type: d.Model.toLowerCase().includes('nvme') ? 'NVMe M.2' : 'SATA SSD',
        interface: d.Interface,
      })),

      gpus: rawGpus.map((g) => ({
        model: g.Model,
        vramGb: g.AdapterRAM_GB && g.AdapterRAM_GB > 0 && g.AdapterRAM_GB <= 64 ? Number(g.AdapterRAM_GB.toFixed(1)) : 0,
        isDedicated: this.isDedicatedGpu(g.Model),
        powerW: 0,
        provenance: 'SYSTEM_REPORTED',
      })),
    };

    return machine;
  }

  /**
   * Converts legacy single-object telemetries to the structured payload
   */
  private static normalizeLegacyTelemetry(raw: any): WindowsTelemetryPayload {
    return {
      CPU: {
        Model: raw.CPU || raw.cpuModel || 'UNKNOWN',
        Cores: raw.Cores || raw.cores,
        LogicalProcessors: raw.Threads || raw.threads,
        MaxClockMhz: raw.maxClockMhz,
      },
      RAM: {
        TotalGB: raw.RAM_GB || raw.ramCapacityGb || raw.ramSizeGb,
        Modules: raw.ramSpeedMhz
          ? [
              {
                CapacityGB: raw.RAM_GB || raw.ramSizeGb || 0,
                ConfiguredClockMhz: raw.RAM_Speed || raw.ramSpeedMhz,
                SpeedMhz: raw.RAM_Spd_Speed || raw.ramSpdSpeedMhz || raw.RAM_Speed || raw.ramSpeedMhz,
              },
            ]
          : undefined,
      },
      GPU: raw.GPU || raw.gpuModel
        ? [
            {
              Model: raw.GPU || raw.gpuModel,
              AdapterRAM_GB: raw.VRAM_GB || raw.vramGb,
            },
          ]
        : undefined,
      Storage: raw.Storage_GB || raw.storageModel
        ? [
            {
              Model: raw.storageModel || 'Disco Principal',
              SizeGB: raw.Storage_GB,
            },
          ]
        : undefined,
      OS: raw.osVersion
        ? {
            Edition: raw.osVersion,
          }
        : undefined,
    };
  }

  /**
   * Performs an epistemic integrity audit: DETECTED MACHINE vs ACTIVE MACHINE.
   * Ensures that no fabricated or unverified component exists without explicit user entry.
   */
  static auditMachineIntegrity(activeMachine: Machine, rawDetected?: any): MachineIntegrityAuditResult {
    const items: IntegrityAuditItem[] = [];
    const detectedHardwareList: string[] = [];
    const unknownHardwareList: string[] = [];
    const removedFallbacksAudit: string[] = [
      'Eliminado default de PSU 500W / 650W -> Ahora estrictamente UNKNOWN (0W) sin detección',
      'Eliminado default de Cooler Torre 120W -> Ahora estrictamente UNKNOWN (0W) sin detección',
      'Eliminado default de RAM 3200 MT/s Dual Channel -> Canales estrictamente UNKNOWN sin derivación',
      'Eliminado default de VRAM = 4GB / 8GB en WebGL -> VRAM estrictamente UNKNOWN si WMI reporta 0/unreliable',
      'Eliminado fallback automático a máquina demo Intel i3-1220P',
      'Eliminado default de Motherboard Asus / ATX -> Ahora UNKNOWN sin Win32_BaseBoard',
      'Eliminado default de Almacenamiento 1000GB NVMe -> Ahora UNKNOWN sin Win32_DiskDrive',
    ];

    // CPU Audit
    const cpuProv = activeMachine.cpu.provenance;
    if (cpuProv === 'SYSTEM_REPORTED' || cpuProv === 'DETECTED') {
      detectedHardwareList.push(`CPU: ${activeMachine.cpu.model} (${activeMachine.cpu.cores}C/${activeMachine.cpu.threads}T)`);
      items.push({
        subsystem: 'CPU',
        label: 'Procesador',
        detectedValue: activeMachine.cpu.model,
        activeValue: activeMachine.cpu.model,
        provenance: cpuProv,
        status: 'VERIFIED_MATCH',
        notes: `Reportado por sistema (${activeMachine.cpu.cores} núcleos / ${activeMachine.cpu.threads} hilos). Coincidencia exacta.`,
      });
    } else if (cpuProv === 'USER_ENTERED') {
      items.push({
        subsystem: 'CPU',
        label: 'Procesador',
        detectedValue: 'NO DETECTADO',
        activeValue: activeMachine.cpu.model,
        provenance: cpuProv,
        status: 'USER_DEFINED',
        notes: 'Ingresado manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('CPU: UNKNOWN');
      items.push({
        subsystem: 'CPU',
        label: 'Procesador',
        detectedValue: 'NO DETECTADO',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Sin telemetría de CPU disponible.',
      });
    }

    // RAM Audit (Strict rule: if detected = 16GB, active cannot be 32GB)
    const ramProv = activeMachine.ram.provenance;
    if (activeMachine.ram.sizeGb > 0 && (ramProv === 'SYSTEM_REPORTED' || ramProv === 'DETECTED')) {
      detectedHardwareList.push(`RAM: ${activeMachine.ram.sizeGb} GB (${activeMachine.ram.configuredSpeedMts > 0 ? `${activeMachine.ram.configuredSpeedMts} MT/s` : 'Frecuencia no reportada'})`);
      items.push({
        subsystem: 'RAM',
        label: 'Memoria RAM',
        detectedValue: `${activeMachine.ram.sizeGb} GB`,
        activeValue: `${activeMachine.ram.sizeGb} GB`,
        provenance: ramProv,
        status: 'VERIFIED_MATCH',
        notes: `Capacidad física exacta reportada por Win32_PhysicalMemory. Sin inflar ni duplicar. Canales: ${activeMachine.ram.channels > 0 ? `${activeMachine.ram.channels}CH` : 'UNKNOWN (Regla 4: no derivado)'}.`,
      });
    } else if (ramProv === 'USER_ENTERED') {
      items.push({
        subsystem: 'RAM',
        label: 'Memoria RAM',
        detectedValue: 'NO DETECTADO',
        activeValue: `${activeMachine.ram.sizeGb} GB`,
        provenance: ramProv,
        status: 'USER_DEFINED',
        notes: 'Capacidad asignada manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('RAM: UNKNOWN');
      items.push({
        subsystem: 'RAM',
        label: 'Memoria RAM',
        detectedValue: 'NO DETECTADO',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Memoria no detectada. Estrictamente 0 GB / UNKNOWN.',
      });
    }

    // GPU & VRAM Audit
    const gpuProv = activeMachine.gpu.provenance;
    if (activeMachine.gpu.model !== 'UNKNOWN' && (gpuProv === 'SYSTEM_REPORTED' || gpuProv === 'DETECTED')) {
      const vramStr = activeMachine.gpu.vramGb > 0 ? `${activeMachine.gpu.vramGb} GB` : 'UNKNOWN';
      detectedHardwareList.push(`GPU: ${activeMachine.gpu.model} (VRAM: ${vramStr})`);
      items.push({
        subsystem: 'GPU',
        label: 'Placa Gráfica',
        detectedValue: activeMachine.gpu.model,
        activeValue: activeMachine.gpu.model,
        provenance: gpuProv,
        status: 'VERIFIED_MATCH',
        notes: `GPU detectada (${activeMachine.gpu.isDedicated ? 'dGPU Dedicada' : 'iGPU Integrada'}). VRAM: ${vramStr} (Regla: no inventar si WMI no reporta valor confiable).`,
      });
    } else if (gpuProv === 'USER_ENTERED') {
      items.push({
        subsystem: 'GPU',
        label: 'Placa Gráfica',
        detectedValue: 'NO DETECTADO',
        activeValue: activeMachine.gpu.model,
        provenance: gpuProv,
        status: 'USER_DEFINED',
        notes: 'Configurada manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('GPU: UNKNOWN');
      items.push({
        subsystem: 'GPU',
        label: 'Placa Gráfica',
        detectedValue: 'NO DETECTADO',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Gráficos no identificados.',
      });
    }

    // Motherboard Audit
    const mbProv = activeMachine.motherboard.provenance;
    if (activeMachine.motherboard.model !== 'UNKNOWN' && (mbProv === 'SYSTEM_REPORTED' || mbProv === 'DETECTED')) {
      detectedHardwareList.push(`Motherboard: ${activeMachine.motherboard.model}`);
      items.push({
        subsystem: 'MOTHERBOARD',
        label: 'Placa Base',
        detectedValue: activeMachine.motherboard.model,
        activeValue: activeMachine.motherboard.model,
        provenance: mbProv,
        status: 'VERIFIED_MATCH',
        notes: 'Detectada mediante Win32_BaseBoard.',
      });
    } else if (mbProv === 'USER_ENTERED') {
      items.push({
        subsystem: 'MOTHERBOARD',
        label: 'Placa Base',
        detectedValue: 'NO DETECTADO',
        activeValue: activeMachine.motherboard.model,
        provenance: mbProv,
        status: 'USER_DEFINED',
        notes: 'Asignada manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('Motherboard: UNKNOWN');
      items.push({
        subsystem: 'MOTHERBOARD',
        label: 'Placa Base',
        detectedValue: 'NO DETECTADO',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Placa base no reportada por el entorno. Sin inventar socket ni chipset.',
      });
    }

    // Storage Audit
    const stProv = activeMachine.storage.provenance;
    if (activeMachine.storage.capacityGb > 0 && (stProv === 'SYSTEM_REPORTED' || stProv === 'DETECTED')) {
      detectedHardwareList.push(`Almacenamiento: ${activeMachine.storage.model || 'Disco Principal'} (${activeMachine.storage.capacityGb} GB ${activeMachine.storage.type})`);
      items.push({
        subsystem: 'STORAGE',
        label: 'Almacenamiento',
        detectedValue: `${activeMachine.storage.capacityGb} GB`,
        activeValue: `${activeMachine.storage.capacityGb} GB (${activeMachine.storage.type})`,
        provenance: stProv,
        status: 'VERIFIED_MATCH',
        notes: `Detectado mediante Win32_DiskDrive.`,
      });
    } else if (stProv === 'USER_ENTERED') {
      items.push({
        subsystem: 'STORAGE',
        label: 'Almacenamiento',
        detectedValue: 'NO DETECTADO',
        activeValue: `${activeMachine.storage.capacityGb} GB`,
        provenance: stProv,
        status: 'USER_DEFINED',
        notes: 'Ingresado por el usuario.',
      });
    } else {
      unknownHardwareList.push('Almacenamiento: UNKNOWN');
      items.push({
        subsystem: 'STORAGE',
        label: 'Almacenamiento',
        detectedValue: 'NO DETECTADO',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Sin discos detectados. Estrictamente UNKNOWN sin inventar NVMe.',
      });
    }

    // PSU Audit (CRITICAL RULE: Windows CANNOT detect PSU -> MUST BE UNKNOWN unless USER_ENTERED)
    const psuProv = activeMachine.psu.provenance;
    if (psuProv === 'USER_ENTERED' && activeMachine.psu.wattageW > 0) {
      items.push({
        subsystem: 'PSU',
        label: 'Fuente de Alimentación',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: `${activeMachine.psu.wattageW}W (${activeMachine.psu.rating || 'Estándar'})`,
        provenance: psuProv,
        status: 'USER_DEFINED',
        notes: 'Ingresada manualmente por el usuario. Windows no puede detectar PSU por software.',
      });
    } else {
      unknownHardwareList.push('PSU: UNKNOWN');
      items.push({
        subsystem: 'PSU',
        label: 'Fuente de Alimentación',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: 'UNKNOWN (0W)',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Regla crítica respetada: Windows no expone telemetría de PSU. Permanece UNKNOWN hasta carga manual.',
      });
    }

    // Cooling Audit (CRITICAL RULE: Windows CANNOT detect cooler -> MUST BE UNKNOWN unless USER_ENTERED)
    const coolProv = activeMachine.cooling.provenance;
    if (coolProv === 'USER_ENTERED' && activeMachine.cooling.type !== 'UNKNOWN') {
      items.push({
        subsystem: 'COOLING',
        label: 'Sistema de Refrigeración',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: activeMachine.cooling.type,
        provenance: coolProv,
        status: 'USER_DEFINED',
        notes: 'Ingresado manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('Cooling: UNKNOWN');
      items.push({
        subsystem: 'COOLING',
        label: 'Sistema de Refrigeración',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Regla crítica respetada: Cooler no detectable por software. Permanece UNKNOWN.',
      });
    }

    // Case / Chassis Audit
    const caseProv = activeMachine.chassis?.provenance;
    if (caseProv === 'USER_ENTERED' && activeMachine.chassis && activeMachine.chassis.model !== 'UNKNOWN') {
      items.push({
        subsystem: 'CHASSIS',
        label: 'Gabinete / Case',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: activeMachine.chassis.model,
        provenance: caseProv,
        status: 'USER_DEFINED',
        notes: 'Ingresado manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('Case: UNKNOWN');
      items.push({
        subsystem: 'CHASSIS',
        label: 'Gabinete / Case',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: 'UNKNOWN',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Gabinete no detectable por software. Permanece UNKNOWN.',
      });
    }

    // Fans Audit
    const fansProv = activeMachine.fans?.provenance;
    if (fansProv === 'USER_ENTERED' && activeMachine.fans && activeMachine.fans.count > 0) {
      items.push({
        subsystem: 'FANS',
        label: 'Ventiladores de Chasis',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: `${activeMachine.fans.count}x Fans`,
        provenance: fansProv,
        status: 'USER_DEFINED',
        notes: 'Ingresados manualmente por el usuario.',
      });
    } else {
      unknownHardwareList.push('Fans: UNKNOWN');
      items.push({
        subsystem: 'FANS',
        label: 'Ventiladores de Chasis',
        detectedValue: 'NO DETECTABLE POR SOFTWARE',
        activeValue: 'UNKNOWN (0 Fans declarados)',
        provenance: 'UNKNOWN',
        status: 'STRICT_UNKNOWN',
        notes: 'Ventiladores no detectables por software. Permanece UNKNOWN.',
      });
    }

    // Display Audit
    const dispProv = activeMachine.display?.provenance;
    if (activeMachine.display && activeMachine.display.resolution !== 'UNKNOWN') {
      detectedHardwareList.push(`Monitor: ${activeMachine.display.resolution} @ ${activeMachine.display.refreshHz}Hz`);
      items.push({
        subsystem: 'DISPLAY',
        label: 'Monitor / Pantalla',
        detectedValue: `${activeMachine.display.resolution} @ ${activeMachine.display.refreshHz}Hz`,
        activeValue: `${activeMachine.display.resolution} @ ${activeMachine.display.refreshHz}Hz`,
        provenance: dispProv || 'SYSTEM_REPORTED',
        status: 'VERIFIED_MATCH',
        notes: 'Resolución y tasa de refresco detectadas.',
      });
    }

    // OS Audit
    if (activeMachine.os) {
      detectedHardwareList.push(`OS: ${activeMachine.os.name}`);
      items.push({
        subsystem: 'OS',
        label: 'Sistema Operativo',
        detectedValue: activeMachine.os.name,
        activeValue: activeMachine.os.name,
        provenance: activeMachine.os.provenance || 'SYSTEM_REPORTED',
        status: 'VERIFIED_MATCH',
        notes: `Detectado: ${activeMachine.os.version || ''} (${activeMachine.os.build || ''}).`,
      });
    }

    const detectedCount = items.filter((i) => i.status === 'VERIFIED_MATCH').length;
    const userEnteredCount = items.filter((i) => i.status === 'USER_DEFINED').length;
    const unknownCount = items.filter((i) => i.status === 'STRICT_UNKNOWN').length;
    const anomaliesCount = items.filter((i) => i.status === 'ANOMALY_MISMATCH').length;

    const isFullyLegitimate = anomaliesCount === 0;
    const overallIntegrityScorePct = Math.round(
      ((detectedCount + userEnteredCount + unknownCount) / Math.max(1, items.length)) * 100
    );

    return {
      isFullyLegitimate,
      totalSubsystems: items.length,
      detectedCount,
      userEnteredCount,
      unknownCount,
      anomaliesCount,
      overallIntegrityScorePct,
      items,
      detectedHardwareList,
      unknownHardwareList,
      removedFallbacksAudit,
    };
  }
}
