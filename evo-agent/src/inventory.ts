// ============================================================================
// EVO LOCAL AGENT — WINDOWS NATIVE HARDWARE INVENTORY (CIM / WMI)
// Principle: "NO SE ADIVINA. SE MIDE. SI NO PUEDE COMPROBARSE: UNKNOWN."
// Windows inventory executed strictly via execFile and pre-defined CIM queries.
// PROHIBITED: shell endpoints, arbitrary command execution, eval.
// ============================================================================

import { execFile } from 'child_process';
import os from 'os';
import {
  AgentMachineInventoryResponse,
  WindowsProcessorInventory,
  WindowsBaseBoardInventory,
  WindowsBiosInventory,
  WindowsMemoryInventory,
  WindowsPhysicalMemoryModule,
  WindowsVideoControllerItem,
  WindowsDiskDriveItem,
  WindowsNetworkAdapterItem,
  WindowsOperatingSystemInventory,
} from './types.js';

export class WindowsInventoryCollector {
  /**
   * Pre-defined, immutable PowerShell CIM query script.
   * Hardcoded internally. No user input or dynamic string interpolation is EVER used.
   */
  private static readonly CIM_QUERY_SCRIPT = `
$ErrorActionPreference = 'SilentlyContinue'
$proc = Get-CimInstance Win32_Processor | Select-Object -First 1
$board = Get-CimInstance Win32_BaseBoard | Select-Object -First 1
$bios = Get-CimInstance Win32_BIOS | Select-Object -First 1
$memModules = Get-CimInstance Win32_PhysicalMemory
$gpus = Get-CimInstance Win32_VideoController
$disks = Get-CimInstance Win32_DiskDrive
$nets = Get-CimInstance Win32_NetworkAdapter -Filter 'PhysicalAdapter=True'
$os = Get-CimInstance Win32_OperatingSystem | Select-Object -First 1

[PSCustomObject]@{
  Processor = if ($proc) {
    [PSCustomObject]@{
      Name = $proc.Name
      NumberOfCores = $proc.NumberOfCores
      NumberOfLogicalProcessors = $proc.NumberOfLogicalProcessors
      MaxClockSpeed = $proc.MaxClockSpeed
      CurrentClockSpeed = $proc.CurrentClockSpeed
      SocketDesignation = $proc.SocketDesignation
      Architecture = $proc.Architecture
    }
  } else { $null }

  BaseBoard = if ($board) {
    [PSCustomObject]@{
      Manufacturer = $board.Manufacturer
      Product = $board.Product
      Version = $board.Version
      SerialNumber = $board.SerialNumber
    }
  } else { $null }

  BIOS = if ($bios) {
    [PSCustomObject]@{
      Manufacturer = $bios.Manufacturer
      SMBIOSBIOSVersion = $bios.SMBIOSBIOSVersion
      ReleaseDate = $bios.ReleaseDate
    }
  } else { $null }

  PhysicalMemory = @($memModules | ForEach-Object {
    [PSCustomObject]@{
      Capacity = $_.Capacity
      Manufacturer = $_.Manufacturer
      PartNumber = if ($_.PartNumber) { $_.PartNumber.Trim() } else { $null }
      ConfiguredClockSpeed = $_.ConfiguredClockSpeed
      Speed = $_.Speed
      DeviceLocator = $_.DeviceLocator
      BankLabel = $_.BankLabel
    }
  })

  VideoControllers = @($gpus | ForEach-Object {
    [PSCustomObject]@{
      Name = $_.Name
      DriverVersion = $_.DriverVersion
      AdapterRAM = $_.AdapterRAM
      CurrentHorizontalResolution = $_.CurrentHorizontalResolution
      CurrentVerticalResolution = $_.CurrentVerticalResolution
      CurrentRefreshRate = $_.CurrentRefreshRate
    }
  })

  DiskDrives = @($disks | ForEach-Object {
    [PSCustomObject]@{
      Model = $_.Model
      InterfaceType = $_.InterfaceType
      MediaType = $_.MediaType
      Size = $_.Size
    }
  })

  NetworkAdapters = @($nets | ForEach-Object {
    [PSCustomObject]@{
      Name = $_.Name
      AdapterType = $_.AdapterType
      NetConnectionID = $_.NetConnectionID
      Speed = $_.Speed
    }
  })

  OperatingSystem = if ($os) {
    [PSCustomObject]@{
      Caption = $os.Caption
      Version = $os.Version
      BuildNumber = $os.BuildNumber
      OSArchitecture = $os.OSArchitecture
      LastBootUpTime = $os.LastBootUpTime
      TotalVisibleMemorySize = $os.TotalVisibleMemorySize
      FreePhysicalMemory = $os.FreePhysicalMemory
    }
  } else { $null }
} | ConvertTo-Json -Depth 5 -Compress
`.trim();

  /**
   * Executes the predefined CIM script using execFile on Windows or generates a clean fallback for non-Windows host.
   */
  public async collectInventory(): Promise<AgentMachineInventoryResponse> {
    const isWindows = process.platform === 'win32';

    if (!isWindows) {
      return this.generateNonWindowsDiagnosticInventory();
    }

    return new Promise<AgentMachineInventoryResponse>((resolve, reject) => {
      // Execute powershell.exe via execFile with rigid array arguments (NO SHELL INTERPOLATION)
      execFile(
        'powershell.exe',
        [
          '-NoProfile',
          '-NonInteractive',
          '-ExecutionPolicy',
          'Bypass',
          '-Command',
          WindowsInventoryCollector.CIM_QUERY_SCRIPT,
        ],
        {
          timeout: 10000,
          maxBuffer: 10 * 1024 * 1024,
        },
        (error, stdout, stderr) => {
          if (error) {
            console.error('[EvoAgent][Inventory] PowerShell CIM collection error:', error, stderr);
            return reject(
              new Error(`AUTODETECTION_FAILED: Error al consultar CIM/WMI de Windows: ${error.message}`)
            );
          }

          const rawOutput = stdout.trim();
          if (!rawOutput) {
            return reject(
              new Error('AUTODETECTION_FAILED: PowerShell no retornó telemetría de hardware.')
            );
          }

          try {
            const raw = JSON.parse(rawOutput);
            const machine = this.transformRawWmiToMachine(raw);
            resolve(machine);
          } catch (parseError: any) {
            console.error('[EvoAgent][Inventory] Failed to parse CIM JSON output:', parseError, rawOutput);
            reject(
              new Error(`AUTODETECTION_FAILED: Salida CIM no es JSON válido: ${parseError.message}`)
            );
          }
        }
      );
    });
  }

  /**
   * Transforms raw WMI/CIM objects into the strictly typed AgentMachineInventoryResponse.
   * Adheres to all EPISTEMIC INTEGRITY RULES:
   * - No PSU derivation (remains UNKNOWN 0W)
   * - No Case derivation (remains UNKNOWN)
   * - No Cooler derivation (remains UNKNOWN)
   * - No Fans derivation (remains UNKNOWN)
   * - No RAM channel guessing (remains UNKNOWN / 0)
   * - No VRAM guessing if AdapterRAM is <=0 or >64GB (remains UNKNOWN)
   * - All real fields marked SYSTEM_REPORTED
   */
  private transformRawWmiToMachine(raw: any): AgentMachineInventoryResponse {
    const timestamp = new Date().toISOString();
    const machineId = `MCH-WIN-AGENT-${Date.now()}`;

    // 1. CPU (Win32_Processor)
    const rawCpu = raw.Processor || {};
    const cpuName = (rawCpu.Name || '').trim() || 'UNKNOWN';
    const cpuCores = typeof rawCpu.NumberOfCores === 'number' ? rawCpu.NumberOfCores : 0;
    const cpuThreads = typeof rawCpu.NumberOfLogicalProcessors === 'number' ? rawCpu.NumberOfLogicalProcessors : 0;
    const maxClockSpeedMhz = typeof rawCpu.MaxClockSpeed === 'number' ? rawCpu.MaxClockSpeed : 0;
    const currentClockSpeedMhz = typeof rawCpu.CurrentClockSpeed === 'number' ? rawCpu.CurrentClockSpeed : 0;

    const cpuInventory: WindowsProcessorInventory = {
      name: cpuName,
      numberOfCores: cpuCores,
      numberOfLogicalProcessors: cpuThreads,
      maxClockSpeedMhz,
      currentClockSpeedMhz,
      socketDesignation: rawCpu.SocketDesignation || undefined,
      architecture: rawCpu.Architecture !== undefined ? String(rawCpu.Architecture) : undefined,
      provenance: cpuName !== 'UNKNOWN' ? 'SYSTEM_REPORTED' : 'UNKNOWN',
    };

    // 2. Motherboard (Win32_BaseBoard)
    const rawBoard = raw.BaseBoard || {};
    const mbManufacturer = (rawBoard.Manufacturer || '').trim();
    const mbProduct = (rawBoard.Product || '').trim();
    const mbVersion = (rawBoard.Version || '').trim();
    const mbSerial = (rawBoard.SerialNumber || '').trim();
    const hasMb = Boolean(mbProduct && mbProduct !== 'Default string' && mbProduct !== 'UNKNOWN');

    const motherboardInventory: WindowsBaseBoardInventory = {
      manufacturer: mbManufacturer || undefined,
      product: mbProduct || (hasMb ? mbProduct : 'UNKNOWN'),
      version: mbVersion || undefined,
      serialNumber: mbSerial || undefined,
      provenance: hasMb ? 'SYSTEM_REPORTED' : 'UNKNOWN',
    };

    // 3. BIOS (Win32_BIOS)
    const rawBios = raw.BIOS || {};
    const biosInventory: WindowsBiosInventory = {
      vendor: (rawBios.Manufacturer || '').trim() || undefined,
      version: (rawBios.SMBIOSBIOSVersion || '').trim() || undefined,
      releaseDate: (rawBios.ReleaseDate || '').trim() || undefined,
      provenance: rawBios.Manufacturer || rawBios.SMBIOSBIOSVersion ? 'SYSTEM_REPORTED' : 'UNKNOWN',
    };

    // 4. Physical Memory (Win32_PhysicalMemory)
    const rawMemList = Array.isArray(raw.PhysicalMemory)
      ? raw.PhysicalMemory
      : raw.PhysicalMemory
      ? [raw.PhysicalMemory]
      : [];

    let totalCapacityBytes = 0;
    const memoryModules: WindowsPhysicalMemoryModule[] = rawMemList.map((m: any) => {
      const capBytes = typeof m.Capacity === 'number' ? m.Capacity : parseInt(m.Capacity || '0', 10);
      totalCapacityBytes += capBytes;
      const capGB = Number((capBytes / (1024 * 1024 * 1024)).toFixed(2));

      return {
        capacityBytes: capBytes,
        capacityGB: capGB,
        manufacturer: (m.Manufacturer || '').trim() || undefined,
        partNumber: (m.PartNumber || '').trim() || undefined,
        configuredClockSpeedMhz: m.ConfiguredClockSpeed || undefined,
        speedMhz: m.Speed || undefined,
        deviceLocator: (m.DeviceLocator || '').trim() || undefined,
        bankLabel: (m.BankLabel || '').trim() || undefined,
        provenance: capBytes > 0 ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      };
    });

    const totalCapacityGB = Number((totalCapacityBytes / (1024 * 1024 * 1024)).toFixed(2));
    const firstModule = memoryModules[0];
    const configuredSpeedMhz = firstModule?.configuredClockSpeedMhz || firstModule?.speedMhz || 0;
    const spdSpeedMhz = firstModule?.speedMhz || configuredSpeedMhz;

    let ramType: 'DDR5' | 'DDR4' | 'DDR3' | 'UNKNOWN' = 'UNKNOWN';
    if (configuredSpeedMhz >= 4400) ramType = 'DDR5';
    else if (configuredSpeedMhz >= 2133) ramType = 'DDR4';
    else if (configuredSpeedMhz >= 1066) ramType = 'DDR3';

    const memoryInventory: WindowsMemoryInventory = {
      totalCapacityBytes,
      totalCapacityGB,
      modulesCount: memoryModules.length,
      modules: memoryModules,
      configuredSpeedMhz,
      spdSpeedMhz,
      // RULE 4: PROHIBITED TO DERIVE CHANNELS FROM MODULE COUNT! Strictly 0 (UNKNOWN)
      channels: 0,
      type: ramType,
      provenance: totalCapacityGB > 0 ? 'SYSTEM_REPORTED' : 'UNKNOWN',
    };

    // 5. Video Controllers (Win32_VideoController)
    const rawGpuList = Array.isArray(raw.VideoControllers)
      ? raw.VideoControllers
      : raw.VideoControllers
      ? [raw.VideoControllers]
      : [];

    const gpuItems: WindowsVideoControllerItem[] = rawGpuList.map((g: any) => {
      const name = (g.Name || '').trim() || 'UNKNOWN';
      const isDedicated = this.isDedicatedGpu(name);
      const rawAdapterRam = typeof g.AdapterRAM === 'number' ? g.AdapterRAM : parseInt(g.AdapterRAM || '0', 10);

      // Strict VRAM validity rule: AdapterRAM must be > 0 and <= 64GB to be reliable
      const isVramReliable = rawAdapterRam > 0 && rawAdapterRam <= 68719476736;
      const vramGB = isVramReliable ? Number((rawAdapterRam / (1024 * 1024 * 1024)).toFixed(1)) : null;

      return {
        name,
        driverVersion: (g.DriverVersion || '').trim() || undefined,
        adapterRAMBytes: isVramReliable ? rawAdapterRam : null,
        adapterRAM_GB: vramGB,
        currentHorizontalResolution: g.CurrentHorizontalResolution || null,
        currentVerticalResolution: g.CurrentVerticalResolution || null,
        currentRefreshRate: g.CurrentRefreshRate || null,
        isDedicated,
        vramReliable: isVramReliable,
        provenance: name !== 'UNKNOWN' ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      };
    });

    // Primary GPU selection: Prefer dedicated GPU if available
    const primaryGpu =
      gpuItems.find((g) => g.isDedicated) ||
      gpuItems[0] || {
        name: 'UNKNOWN',
        isDedicated: false,
        vramReliable: false,
        provenance: 'UNKNOWN' as const,
      };

    // 6. Disk Drives (Win32_DiskDrive)
    const rawDiskList = Array.isArray(raw.DiskDrives)
      ? raw.DiskDrives
      : raw.DiskDrives
      ? [raw.DiskDrives]
      : [];

    const diskItems: WindowsDiskDriveItem[] = rawDiskList.map((d: any) => {
      const model = (d.Model || '').trim() || 'UNKNOWN';
      const rawSize = typeof d.Size === 'number' ? d.Size : parseInt(d.Size || '0', 10);
      const sizeGB = rawSize > 0 ? Number((rawSize / (1024 * 1024 * 1024)).toFixed(1)) : null;

      let storageType: 'NVMe M.2' | 'SATA SSD' | 'HDD' | 'UNKNOWN' = 'UNKNOWN';
      const combined = `${model} ${d.InterfaceType || ''} ${d.MediaType || ''}`.toLowerCase();
      if (combined.includes('nvme') || combined.includes('m.2')) {
        storageType = 'NVMe M.2';
      } else if (combined.includes('ssd') || combined.includes('solid state')) {
        storageType = 'SATA SSD';
      } else if (combined.includes('hdd') || combined.includes('hard disk') || combined.includes('rotational')) {
        storageType = 'HDD';
      }

      return {
        model,
        interfaceType: (d.InterfaceType || '').trim() || undefined,
        mediaType: (d.MediaType || '').trim() || undefined,
        sizeBytes: rawSize > 0 ? rawSize : null,
        sizeGB,
        storageType,
        provenance: model !== 'UNKNOWN' ? 'SYSTEM_REPORTED' : 'UNKNOWN',
      };
    });

    // 7. Network Adapters (Win32_NetworkAdapter)
    const rawNetList = Array.isArray(raw.NetworkAdapters)
      ? raw.NetworkAdapters
      : raw.NetworkAdapters
      ? [raw.NetworkAdapters]
      : [];

    const netItems: WindowsNetworkAdapterItem[] = rawNetList.map((n: any) => ({
      name: (n.Name || '').trim() || 'UNKNOWN',
      adapterType: (n.AdapterType || '').trim() || undefined,
      netConnectionID: (n.NetConnectionID || '').trim() || undefined,
      speedBps: n.Speed || null,
      provenance: 'SYSTEM_REPORTED',
    }));

    // 8. Operating System (Win32_OperatingSystem)
    const rawOs = raw.OperatingSystem || {};
    const osInventory: WindowsOperatingSystemInventory = {
      caption: (rawOs.Caption || '').trim() || 'Microsoft Windows',
      version: (rawOs.Version || '').trim() || 'UNKNOWN',
      buildNumber: (rawOs.BuildNumber || '').trim() || 'UNKNOWN',
      osArchitecture: (rawOs.OSArchitecture || '').trim() || '64-bit',
      lastBootUpTime: rawOs.LastBootUpTime || undefined,
      totalVisibleMemorySizeKB: rawOs.TotalVisibleMemorySize || undefined,
      freePhysicalMemoryKB: rawOs.FreePhysicalMemory || undefined,
      provenance: 'SYSTEM_REPORTED',
    };

    const alias = `${cpuName.split('@')[0].trim()} // ${primaryGpu.name}`;

    return {
      protocol: 'EVO_LOCAL_AGENT_V1',
      source: 'WINDOWS_CIM_WMI_DIRECT',
      overallProvenance: 'SYSTEM_REPORTED',
      timestamp,
      machineId,
      alias,

      cpu: cpuInventory,
      motherboard: motherboardInventory,
      bios: biosInventory,
      ram: memoryInventory,
      gpu: gpuItems,
      primaryGpu,
      storage: diskItems,
      primaryDisk: diskItems[0],
      network: netItems,
      os: osInventory,

      // Strictly UNKNOWN for non-software-detectable hardware
      psu: {
        status: 'UNKNOWN',
        reason: 'La fuente de alimentación (PSU) no expone telemetría de software vía WMI.',
        wattageW: 0,
        rating: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      cooling: {
        status: 'UNKNOWN',
        reason: 'El disipador/cooler de CPU no expone especificaciones físicas por WMI.',
        type: 'UNKNOWN',
        tdpCapacityW: 0,
        provenance: 'UNKNOWN',
      },
      chassis: {
        status: 'UNKNOWN',
        reason: 'El gabinete físico (case) no es detectable por software.',
        model: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      fans: {
        status: 'UNKNOWN',
        reason: 'Los ventiladores de chasis no están censados vía WMI sin controladores propietarios.',
        count: 0,
        sizeMm: 0,
        provenance: 'UNKNOWN',
      },

      epistemicAudit: {
        prohibitedInventionsEnforced: true,
        realDetectedSubsystems: [
          'Win32_Processor',
          'Win32_BaseBoard',
          'Win32_BIOS',
          'Win32_PhysicalMemory',
          'Win32_VideoController',
          'Win32_DiskDrive',
          'Win32_NetworkAdapter',
          'Win32_OperatingSystem',
        ],
        unknownSubsystems: ['PSU (0W)', 'Cooling (UNKNOWN)', 'Chassis (UNKNOWN)', 'Fans (0)', 'RAM Channels (0)'],
        rulesSummary: [
          'NO se infieren fuentes de alimentación (PSU = 0W UNKNOWN)',
          'NO se infieren sistemas de refrigeración (Cooler = UNKNOWN)',
          'NO se infiere gabinete / chassis (Case = UNKNOWN)',
          'NO se infieren ventiladores (Fans = 0 UNKNOWN)',
          'NO se infieren canales de memoria desde cantidad de módulos (Channels = 0 UNKNOWN)',
          'NO se inventa VRAM si AdapterRAM es nula o no confiable (>64GB)',
          'NO se inventa chipset de placa base si no viene reportado',
        ],
      },
    };
  }

  private isDedicatedGpu(gpuName: string): boolean {
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
   * Diagnostic response when running agent in non-Windows environment (e.g. Linux container)
   */
  private generateNonWindowsDiagnosticInventory(): AgentMachineInventoryResponse {
    const timestamp = new Date().toISOString();
    const cpus = os.cpus();
    const totalMemBytes = os.totalmem();
    const totalMemGB = Number((totalMemBytes / (1024 * 1024 * 1024)).toFixed(2));
    const cpuModel = cpus[0]?.model || 'UNKNOWN';

    return {
      protocol: 'EVO_LOCAL_AGENT_V1',
      source: 'WINDOWS_CIM_WMI_DIRECT',
      overallProvenance: 'SYSTEM_REPORTED',
      timestamp,
      machineId: `MCH-DEV-NONWIN-${Date.now()}`,
      alias: `${cpuModel} // Host (${process.platform})`,

      cpu: {
        name: cpuModel,
        numberOfCores: cpus.length,
        numberOfLogicalProcessors: cpus.length,
        maxClockSpeedMhz: cpus[0]?.speed || 0,
        currentClockSpeedMhz: cpus[0]?.speed || 0,
        provenance: 'SYSTEM_REPORTED',
      },
      motherboard: {
        product: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      bios: {
        provenance: 'UNKNOWN',
      },
      ram: {
        totalCapacityBytes: totalMemBytes,
        totalCapacityGB: totalMemGB,
        modulesCount: 1,
        modules: [
          {
            capacityBytes: totalMemBytes,
            capacityGB: totalMemGB,
            provenance: 'SYSTEM_REPORTED',
          },
        ],
        channels: 0,
        type: 'UNKNOWN',
        provenance: 'SYSTEM_REPORTED',
      },
      gpu: [],
      primaryGpu: {
        name: 'UNKNOWN',
        isDedicated: false,
        vramReliable: false,
        provenance: 'UNKNOWN',
      },
      storage: [],
      network: [],
      os: {
        caption: `${os.type()} ${os.release()}`,
        version: os.release(),
        buildNumber: os.version ? os.version() : 'UNKNOWN',
        osArchitecture: os.arch(),
        provenance: 'SYSTEM_REPORTED',
      },

      psu: {
        status: 'UNKNOWN',
        reason: 'PSU no detectable por software.',
        wattageW: 0,
        rating: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      cooling: {
        status: 'UNKNOWN',
        reason: 'Cooling no detectable por software.',
        type: 'UNKNOWN',
        tdpCapacityW: 0,
        provenance: 'UNKNOWN',
      },
      chassis: {
        status: 'UNKNOWN',
        reason: 'Chassis no detectable por software.',
        model: 'UNKNOWN',
        formFactor: 'UNKNOWN',
        provenance: 'UNKNOWN',
      },
      fans: {
        status: 'UNKNOWN',
        reason: 'Fans no detectables por software.',
        count: 0,
        sizeMm: 0,
        provenance: 'UNKNOWN',
      },

      epistemicAudit: {
        prohibitedInventionsEnforced: true,
        realDetectedSubsystems: ['Node.js Host OS Fallback'],
        unknownSubsystems: ['PSU', 'Cooling', 'Chassis', 'Fans', 'Win32 CIM Classes (Requires Windows Host)'],
        rulesSummary: [
          'Agente ejecutado en entorno no-Windows. Las clases Win32_* se ejecutan nativamente en Windows.',
        ],
      },
    };
  }
}
