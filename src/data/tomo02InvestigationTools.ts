/** Educational PowerShell collectors and opt-in export examples. The UI displays code; it never runs it. */
export const INVESTIGATION_TOOL_CODE: Record<string, string> = {
  '38.01': String.raw`$os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
[pscustomobject]@{ Schema='EVO.System.v1'; CapturedAt=(Get-Date).ToString('o');
  Caption=$os.Caption; Version=$os.Version; Build=$os.BuildNumber;
  Architecture=$os.OSArchitecture; LastBoot=$os.LastBootUpTime }`,
  '38.02': String.raw`Get-Process -ErrorAction Stop |
  Select-Object Id,ProcessName,@{n='CPUSeconds';e={$_.CPU}},
    @{n='WorkingSetBytes';e={$_.WorkingSet64}} |
  Sort-Object CPUSeconds -Descending
# CPUSeconds is cumulative CPU time, NOT current utilization %.`,
  '38.03': String.raw`$os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
[pscustomobject]@{TotalGiB=[math]::Round($os.TotalVisibleMemorySize/1MB,2);
  FreeGiB=[math]::Round($os.FreePhysicalMemory/1MB,2);
  Limitations='CIM values are in KiB. Commit and paging are not measured here.'}`,
  '38.04': String.raw`Get-CimInstance Win32_Service -ErrorAction Stop |
  Select-Object Name,State,StartMode,StartName,PathName
# Review account names and paths before sharing the report.`,
  '38.05': String.raw`$commands = Get-CimInstance Win32_StartupCommand -ErrorAction Stop
$tasks = Get-ScheduledTask -ErrorAction Stop |
  Select-Object TaskName,TaskPath,State
[pscustomobject]@{StartupCommands=$commands; Tasks=$tasks;
  Limitations='Tasks are not all startup items; services and other persistence are separate.'}`,
  '38.06': String.raw`Get-NetAdapter -ErrorAction Stop |
  Select-Object Name,InterfaceDescription,Status,LinkSpeed
# Deliberately omits MAC/IP addresses. Does not measure Internet throughput.`,
  '38.07': String.raw`Get-CimInstance Win32_PnPSignedDriver -ErrorAction Stop |
  Select-Object DeviceName,DriverVersion,DriverDate,Manufacturer,IsSigned
# Inventory only. No update, uninstall or package download.`,
  '38.08': String.raw`$since = (Get-Date).AddHours(-2)
try {
  Get-WinEvent -FilterHashtable @{LogName='System';Level=2;StartTime=$since} -MaxEvents 50 -ErrorAction Stop |
    Select-Object TimeCreated,ProviderName,Id,LevelDisplayName
} catch { [pscustomobject]@{Status='UNAVAILABLE';Reason='No matching events or query unavailable';Detail=$_.Exception.GetType().Name} }
# Distinguish empty window from permission failure when integrating the collector.`,
  '38.09': String.raw`$connections = @(Get-NetTCPConnection -State Established -ErrorAction Stop)
[pscustomobject]@{EstablishedCount=$connections.Count;
  CapturedAt=(Get-Date).ToString('o');
  Limitations='TCP snapshot only; no payload, intent, UDP, IP export or remote transmission.'}`,
  '38.10': String.raw`Get-Volume -ErrorAction Stop |
  Select-Object DriveLetter,FileSystem,HealthStatus,Size,SizeRemaining
# Storage inventory. Does not run SFC/DISM, verify SMART, or certify hardware.`,
  '38.11': String.raw`[pscustomobject]@{
  Schema='EVO.SlowPC.Plan.v1'; Status='NEEDS_CONTEXT';
  RequiredEvidence=@('Symptom and duration','CPU per process','Commit and hard faults',
    'Disk latency and queue','Network latency','Repeatable workload');
  Verdict='INCONCLUSIVE'; NextStep='Collect a bounded series during the symptom'
}
# Planning module: does not manufacture sensor measurements or automatic repairs.`,
  '38.12': String.raw`$log = [System.Collections.Generic.List[object]]::new()
$log.Add([pscustomobject]@{At=(Get-Date).ToString('o');Module='System';Status='STARTED'})
try { $os=Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
  $log.Add([pscustomobject]@{At=(Get-Date).ToString('o');Module='System';Status='OK'})
} catch { $log.Add([pscustomobject]@{At=(Get-Date).ToString('o');Module='System';Status='ERROR';ErrorType=$_.Exception.GetType().Name}) }
$log # In-memory output. Avoid recording tokens, usernames or full private paths.`,
  '38.13': String.raw`$report=[pscustomobject]@{Schema='EVO.Audit.v1';CapturedAt=(Get-Date).ToString('o');
  Modules=@([pscustomobject]@{Name='Example';Status='SIMULATED';Data=@{Count=3}})}
$json=$report | ConvertTo-Json -Depth 8
$roundtrip=$json | ConvertFrom-Json
if ($roundtrip.Modules[0].Data.Count -ne 3) { throw 'Serialization lost a field' }
$json # Example values, not host measurements.`,
  '38.14': String.raw`$rows=@([pscustomobject]@{Module='System';Status='SIMULATED';Count=3},
  [pscustomobject]@{Module='Network';Status='SIMULATED';Count=2})
$csv=$rows | ConvertTo-Csv -NoTypeInformation
$roundtrip=$csv | ConvertFrom-Csv
if (@($roundtrip).Count -ne 2) { throw 'Row count mismatch' }
$csv # No file write. Numeric values may need explicit parsing when imported.`,
  '38.15': String.raw`$report=[pscustomobject]@{Schema='EVO.Text.v1';Provenance='SIMULATED';
  DurationMs=500;Limitations='Educational example, not a PC measurement'}
$report | Format-List | Out-String -Width 160
# Keep structured source too. Console formatting can truncate or lose types.`,
  '38.16': String.raw`function Export-EvoExample {
  [CmdletBinding(SupportsShouldProcess=$true)]
  param([Parameter(Mandatory)][string]$Path)
  if ($PSCmdlet.ShouldProcess($Path,'Create new educational JSON report')) {
    @{Schema='EVO.Example.v1';Provenance='SIMULATED'} |
      ConvertTo-Json | Out-File -LiteralPath $Path -Encoding utf8 -NoClobber -ErrorAction Stop
  }
}
# Example only. In a disposable VM use a NEW file under your own directory:
# Export-EvoExample -Path <new-path> -WhatIf
# No write occurs if ShouldProcess returns false.`,
  '38.17': String.raw`$plan=[pscustomobject]@{Effect='Optional new report file only';
  Preconditions=@('Own output folder','New path','NoClobber','Explicit consent');
  Rollback='Remove only the report created by this run, after checking its path';
  ConfigurationChanges=@();AutomaticDeletion=$false}
$plan # Recovery plan, not an executable delete command.`,
  '38.18': String.raw`function Get-EvoControlledExample {
  param([switch]$SimulateFailure)
  try {
    if ($SimulateFailure) { throw [System.UnauthorizedAccessException]::new('Educational failure') }
    $data=Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
    [pscustomobject]@{Status='OK';Data=$data.Version;ErrorType=$null}
  } catch {
    [pscustomobject]@{Status='ERROR';Data=$null;ErrorType=$_.Exception.GetType().Name}
  }
}
# Get-EvoControlledExample -SimulateFailure gives explicit ERROR, never fake data.`,
};

// Each collector is callable independently and returns an explicit module result.
// A successful query is not a health verdict. Failures never substitute simulated readings.
const collectors = ['System','Process','Memory','Services','Startup','Network','Driver','Event','Privacy','WindowsHealth','SlowPCPlan'];
collectors.forEach((module,index)=>{
  const id=`38.${String(index+1).padStart(2,'0')}`;
  const body=INVESTIGATION_TOOL_CODE[id].split('\n').map(line=>`      ${line}`).join('\n');
  INVESTIGATION_TOOL_CODE[id]=`function Get-Evo${module}Audit {
  [CmdletBinding()]
  param()
  try {
    $data = & {
${body}
    }
    [pscustomobject]@{Schema='EVO.Module.v1';Module='${module}';
      CapturedAt=(Get-Date).ToString('o');Status='OK';Data=$data;ErrorType=$null;
      Limitations='Query or plan output only; not a diagnosis. Review scope before sharing.'}
  } catch {
    [pscustomobject]@{Schema='EVO.Module.v1';Module='${module}';
      CapturedAt=(Get-Date).ToString('o');Status='ERROR';Data=$null;
      ErrorType=$_.Exception.GetType().Name;Limitations='Unavailable, never fabricated.'}
  }
}
# In a disposable or authorized Windows session, call Get-Evo${module}Audit.
# No settings are changed and no file is written by this collector.`;
});
