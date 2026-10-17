/** Shared browser/agent contract. No Node imports, credentials or simulated data. */
export const EOE_SCHEMA_VERSION = '1.0' as const;
export const EOE_AGENT_VERSION = '1.1.0';
export const EOE_LIMITS = { minIntervalMs: 1000, maxIntervalMs: 10000, defaultIntervalMs: 2000, gamingIntervalMs: 5000, maxFrames: 300, maxBytes: 8 * 1024 * 1024, retentionMs: 15 * 60 * 1000, maxReadings: 512 } as const;
export type MetricUnit = '%' | 'bytes' | 'bytes/s' | 'ms';
export type SampleValidity = 'VALID' | 'UNKNOWN' | 'ERROR' | 'WARMUP';
export interface TelemetrySample {
  sessionId: string;
  metricId: string;
  timestampUtc: string;
  value: number | null;
  unit: MetricUnit;
  source: string;
  sampleIntervalMs: number;
  validity: SampleValidity;
  captureError: string | null;
  lost: boolean;
  late: boolean;
  agentVersion: string;
  schemaVersion: typeof EOE_SCHEMA_VERSION;
  counterEvidence?: { startTicks: string; endTicks: string; startBase: string; endBase: string; frequencyHz: string };
}
export interface ResourceProcess { pid: number; name: string; cpuPercent: number | null; workingSetBytes: number | null }
export interface ObservabilityFrame {
  schemaVersion: typeof EOE_SCHEMA_VERSION;
  agentVersion: string;
  sessionId: string;
  sequence: number;
  timestampUtc: string;
  platform: string;
  samples: TelemetrySample[];
  processes: ResourceProcess[];
  processError: string | null;
}
export const METRICS: Record<string, { label: string; unit: MetricUnit; source: string }> = {
  'cpu.total': { label: 'CPU total', unit: '%', source: 'node:os.cpus/windows-times-delta' },
  'memory.physical': { label: 'Memoria física', unit: 'bytes', source: 'node:os.totalmem' },
  'memory.available': { label: 'Memoria disponible', unit: 'bytes', source: 'node:os.freemem' },
  'memory.used': { label: 'Memoria utilizada', unit: 'bytes', source: 'node:os.totalmem-freemem' },
  'memory.pressure': { label: 'Ocupación física (no PSI)', unit: '%', source: 'derived:physical-used/total' },
  'memory.committed': { label: 'Memoria comprometida', unit: 'bytes', source: 'cim:Win32_PerfFormattedData_PerfOS_Memory.CommittedBytes' },
  'memory.commitLimit': { label: 'Límite de compromiso', unit: 'bytes', source: 'cim:Win32_PerfFormattedData_PerfOS_Memory.CommitLimit' },
  'disk.activity': { label: 'Actividad de disco agregada', unit: '%', source: 'cim:Win32_PerfFormattedData_PerfDisk_PhysicalDisk.PercentIdleTime' },
  'disk.read': { label: 'Lectura de disco', unit: 'bytes/s', source: 'cim:Win32_PerfFormattedData_PerfDisk_PhysicalDisk.DiskReadBytesPersec' },
  'disk.write': { label: 'Escritura de disco', unit: 'bytes/s', source: 'cim:Win32_PerfFormattedData_PerfDisk_PhysicalDisk.DiskWriteBytesPersec' },
  'disk.readLatency': { label: 'Latencia de lectura', unit: 'ms', source: 'cim:Win32_PerfRawData_PerfDisk_PhysicalDisk.AvgDisksecPerRead/delta-base/frequency' },
  'disk.writeLatency': { label: 'Latencia de escritura', unit: 'ms', source: 'cim:Win32_PerfRawData_PerfDisk_PhysicalDisk.AvgDisksecPerWrite/delta-base/frequency' },
  'network.receive': { label: 'Red recibida (suma de interfaces)', unit: 'bytes/s', source: 'cim:Win32_PerfFormattedData_Tcpip_NetworkInterface.BytesReceivedPersec' },
  'network.send': { label: 'Red enviada (suma de interfaces)', unit: 'bytes/s', source: 'cim:Win32_PerfFormattedData_Tcpip_NetworkInterface.BytesSentPersec' },
  'agent.cpu': { label: 'CPU del agente (100% = un hilo)', unit: '%', source: 'node:process.cpuUsage/monotonic-elapsed' },
  'agent.rss': { label: 'RAM residente del agente', unit: 'bytes', source: 'node:process.memoryUsage.rss' },
  'collector.duration': { label: 'Duración de consulta CIM', unit: 'ms', source: 'node:performance.now' },
  'collector.cpuTime': { label: 'CPU de consulta PowerShell', unit: 'ms', source: 'powershell:Get-Process.CurrentProcess.TotalProcessorTime' },
  'collector.rss': { label: 'RAM de consulta PowerShell (no pico)', unit: 'bytes', source: 'powershell:Get-Process.CurrentProcess.WorkingSet64' },
};
export function safeInterval(value: number): number {
  return Number.isFinite(value) ? Math.max(EOE_LIMITS.minIntervalMs, Math.min(EOE_LIMITS.maxIntervalMs, Math.round(value))) : EOE_LIMITS.defaultIntervalMs;
}

/** PERF_AVERAGE_TIMER: ((N1-N0)/frequency)/(B1-B0), seconds → ms.
 * No completed I/O is UNKNOWN; reset/unsafe counters are rejected. */
export function averageTimerMs(ticks: unknown, base: unknown, previousTicks: unknown, previousBase: unknown, frequency: unknown): number | null {
  try {
    if (![ticks, base, previousTicks, previousBase, frequency].every(v => typeof v === 'string' && /^\d{1,24}$/.test(v))) return null;
    const n = BigInt(String(ticks)) - BigInt(String(previousTicks));
    const b = BigInt(String(base)) - BigInt(String(previousBase));
    const f = BigInt(String(frequency));
    if (n < 0n || b <= 0n || f <= 0n || n > BigInt(Number.MAX_SAFE_INTEGER) || b > BigInt(Number.MAX_SAFE_INTEGER) || f > BigInt(Number.MAX_SAFE_INTEGER)) return null;
    const value = Number(n) / Number(f) / Number(b) * 1000;
    return Number.isFinite(value) && value >= 0 ? value : null;
  } catch { return null; }
}
