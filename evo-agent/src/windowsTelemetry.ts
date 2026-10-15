import { execFile } from 'node:child_process';

/** Constant read-only script. No request values, user command, service changes or elevation. */
const SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
$result = @{}
try { $m = Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory; $result.memory = @{ committed=$m.CommittedBytes; limit=$m.CommitLimit } } catch { $result.memoryError='MEMORY_COUNTER_UNAVAILABLE' }
try {
  $d = Get-CimInstance Win32_PerfFormattedData_PerfDisk_PhysicalDisk | Where-Object Name -eq '_Total'
  $r = Get-CimInstance Win32_PerfRawData_PerfDisk_PhysicalDisk | Where-Object Name -eq '_Total'
  if ($null -eq $d -or $null -eq $r) { throw 'NO_DISK_COUNTER' }
  $result.disk = @{ idle=$d.PercentIdleTime; read=$d.DiskReadBytesPersec; write=$d.DiskWriteBytesPersec; readTicks=[string]$r.AvgDisksecPerRead; readBase=[string]$r.AvgDisksecPerRead_Base; writeTicks=[string]$r.AvgDisksecPerWrite; writeBase=[string]$r.AvgDisksecPerWrite_Base; frequency=[string]$r.Frequency_PerfTime }
} catch { $result.diskError='DISK_COUNTER_UNAVAILABLE' }
try {
  $n = @(Get-CimInstance Win32_PerfFormattedData_Tcpip_NetworkInterface)
  $result.network = @($n | Select-Object -First 64 | ForEach-Object { @{ name=$_.Name; receive=$_.BytesReceivedPersec; send=$_.BytesSentPersec } })
  if ($n.Count -gt 64) { $result.networkError='INTERFACE_LIMIT_EXCEEDED' }
} catch { $result.networkError='NETWORK_COUNTER_UNAVAILABLE' }
try {
  $p = @(Get-CimInstance Win32_PerfFormattedData_PerfProc_Process | Where-Object { $_.IDProcess -gt 0 -and $_.Name -ne '_Total' })
  $topCpu = @($p | Sort-Object PercentProcessorTime -Descending | Select-Object -First 5)
  $topRam = @($p | Sort-Object WorkingSetPrivate -Descending | Select-Object -First 5)
  $result.processes = @(($topCpu + $topRam) | Sort-Object IDProcess -Unique | ForEach-Object { @{ pid=$_.IDProcess; name=$_.Name; cpuPercent=$_.PercentProcessorTime; workingSetBytes=$_.WorkingSetPrivate } })
} catch { $result.processError='PROCESS_COUNTER_UNAVAILABLE' }
$self = Get-Process -Id $PID
$result.collector = @{ cpuTimeMs=$self.TotalProcessorTime.TotalMilliseconds; rss=$self.WorkingSet64 }
$result.timestampUtc = [DateTime]::UtcNow.ToString('o')
$result | ConvertTo-Json -Depth 5 -Compress
`;
export interface WindowsCounterResult {
  memory?: { committed: unknown; limit: unknown }; memoryError?: string;
  disk?: { idle: unknown; read: unknown; write: unknown; readTicks: unknown; readBase: unknown; writeTicks: unknown; writeBase: unknown; frequency: unknown }; diskError?: string;
  network?: { name: string; receive: unknown; send: unknown }[]; networkError?: string;
  processes?: { pid: number; name: string; cpuPercent: unknown; workingSetBytes: unknown }[]; processError?: string;
  collector?: { cpuTimeMs: unknown; rss: unknown }; timestampUtc?: string; error?: string;
}
export async function readWindowsCounters(): Promise<WindowsCounterResult> {
  if (process.platform !== 'win32') return { error: 'PLATFORM_NOT_SUPPORTED: se requiere Windows nativo' };
  return new Promise(resolve => {
    execFile('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(SCRIPT, 'utf16le').toString('base64')],
      { windowsHide: true, timeout: 4000, maxBuffer: 512 * 1024, encoding: 'utf8' }, (error, stdout) => {
        if (error) { resolve({ error: error.killed ? 'CIM_CAPTURE_TIMEOUT' : 'CIM_CAPTURE_FAILED' }); return; }
        try { resolve(JSON.parse(stdout.replace(/^\uFEFF/, '').trim())); }
        catch { resolve({ error: 'CIM_INVALID_JSON' }); }
      });
  });
}
export { averageTimerMs } from './observabilityProtocol.js';
