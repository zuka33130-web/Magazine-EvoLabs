// Teaching script, displayed only. The website never executes PowerShell.
export const WINDOWS_AUDIT_EXAMPLE = String.raw`[CmdletBinding(SupportsShouldProcess=$true)]
param([string]$OutputDirectory)

function Read-AuditSection {
  param([string]$Name, [scriptblock]$Query)
  try {
    $data = @(& $Query)
    [pscustomobject]@{ name=$Name; status='OK'; origin='SYSTEM_REPORTED'; data=$data }
  } catch {
    [pscustomobject]@{ name=$Name; status='ERROR'; origin='UNKNOWN'; error=$_.Exception.Message }
  }
}

$report = [pscustomobject]@{
  schema = 1
  timestamp = (Get-Date).ToString('o')
  limitations = 'Snapshot; not an automatic diagnosis. CPUSeconds is accumulated time. No integrity repair was executed.'
  sections = @(
    Read-AuditSection 'System' { Get-CimInstance Win32_OperatingSystem -ErrorAction Stop | Select-Object Caption,BuildNumber,OSArchitecture }
    Read-AuditSection 'Process' { Get-Process -ErrorAction Stop | Select-Object Id,ProcessName,@{n='CPUSeconds';e={$_.CPU}},WorkingSet64 }
    Read-AuditSection 'Memory' { Get-CimInstance Win32_OperatingSystem -ErrorAction Stop | Select-Object TotalVisibleMemorySize,FreePhysicalMemory }
    Read-AuditSection 'Services' { Get-Service -ErrorAction Stop | Select-Object Name,Status,StartType }
    Read-AuditSection 'Startup' { Get-ScheduledTask -ErrorAction Stop | Select-Object TaskPath,TaskName,State }
    Read-AuditSection 'Network' { Get-NetAdapter -ErrorAction Stop | Select-Object Name,Status,LinkSpeed }
    Read-AuditSection 'Driver' { Get-CimInstance Win32_PnPSignedDriver -ErrorAction Stop | Select-Object DeviceName,DriverVersion,DriverProviderName }
    Read-AuditSection 'Event' { Get-WinEvent -FilterHashtable @{LogName='System';Level=2;StartTime=(Get-Date).AddDays(-1)} -MaxEvents 20 -ErrorAction Stop | Select-Object TimeCreated,Id,ProviderName }
    Read-AuditSection 'Privacy' { Get-NetTCPConnection -State Established -ErrorAction Stop | Group-Object OwningProcess | Select-Object Name,Count }
    Read-AuditSection 'WindowsHealth' { Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' -ErrorAction Stop | Select-Object DeviceID,Size,FreeSpace }
  )
}
$json = $report | ConvertTo-Json -Depth 8
$json
# By default the audit only writes to the console.
# File export requires an explicit directory and respects -WhatIf.
if ($OutputDirectory -and $PSCmdlet.ShouldProcess($OutputDirectory, 'Create audit files')) {
  try {
    if (-not (Test-Path -LiteralPath $OutputDirectory)) {
      New-Item -ItemType Directory -Path $OutputDirectory -ErrorAction Stop | Out-Null
    }
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
    $json | Out-File -LiteralPath (Join-Path $OutputDirectory "audit-$stamp.json") -Encoding utf8 -NoClobber -ErrorAction Stop
    $report.sections | Select-Object name,status,origin | Export-Csv -LiteralPath (Join-Path $OutputDirectory "summary-$stamp.csv") -NoTypeInformation -NoClobber -Encoding UTF8 -ErrorAction Stop
  } catch { Write-Error ('Export failed: ' + $_.Exception.Message) }
}`;
