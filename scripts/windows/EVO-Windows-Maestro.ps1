<#
.SYNOPSIS
EVO LABS | Windows 11 - Radiografía de rendimiento, inicio y seguridad.
.DESCRIPTION
Diagnóstico genuino, de sólo lectura, compatible con Windows PowerShell 5.1.
Por defecto sólo muestra datos locales por pantalla: NO crea archivos,
NO ejecuta tweaks, NO contacta redes y NO cambia el sistema.
Con -Save exporta a la carpeta local explícita indicada por el usuario.
El informe puede incluir nombres de procesos/tareas: revisalo antes de compartir.
.EXAMPLE
.\EVO-Windows-Maestro.ps1
.EXAMPLE
.\EVO-Windows-Maestro.ps1 -SampleSeconds 10 -Save
#>
[CmdletBinding()]
param(
  [ValidateRange(2,60)] [int] $SampleSeconds = 5,
  [switch] $Save,
  [string] $OutputDirectory = (Join-Path $env:USERPROFILE 'Documents\EVO-LABS-Auditorias')
)

$ErrorActionPreference = 'Continue'
$time = Get-Date
$os = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue
$computer = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue
$logical = @(Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' -ErrorAction SilentlyContinue)
$service = @(Get-CimInstance Win32_Service -ErrorAction SilentlyContinue)
$startup = @(Get-CimInstance Win32_StartupCommand -ErrorAction SilentlyContinue |
  Select-Object Name,Location,User)
$events = @(Get-WinEvent -FilterHashtable @{
  LogName='System';Level=2;StartTime=(Get-Date).AddDays(-1)
} -MaxEvents 30 -ErrorAction SilentlyContinue |
  Select-Object TimeCreated,ProviderName,Id)

# Doble muestra de CPU. Los PID que terminan entre muestras quedan excluidos.
$cpu0 = @{}
Get-Process -ErrorAction SilentlyContinue | Where-Object { $null -ne $_.CPU } |
  ForEach-Object {
    $cpu0["$($_.Id)|$($_.Name)"] = [double]$_.CPU
  }
$watch = [Diagnostics.Stopwatch]::StartNew()
Start-Sleep -Seconds $SampleSeconds
$watch.Stop()
$elapsed = $watch.Elapsed.TotalSeconds
$cores = [Math]::Max(1,[Environment]::ProcessorCount)
$cpu = @(Get-Process -ErrorAction SilentlyContinue |
  Where-Object { $cpu0.ContainsKey("$($_.Id)|$($_.Name)") -and $null -ne $_.CPU } |
  ForEach-Object {
    $key="$($_.Id)|$($_.Name)"
    [pscustomobject]@{
      Name=$_.Name
      PID=$_.Id
      CpuMeanPctOfSystem=[math]::Round((100.0 * ([double]$_.CPU - $cpu0[$key]) / $elapsed / $cores),2)
      PrivateMB=[math]::Round($_.PrivateMemorySize64 / 1MB,1)
    }
  } | Sort-Object CpuMeanPctOfSystem -Descending | Select-Object -First 20)

$disks = @($logical | ForEach-Object {
  [pscustomobject]@{
    Volume=$_.DeviceID
    CapacityGB=[math]::Round($_.Size / 1GB,2)
    FreeGB=[math]::Round($_.FreeSpace / 1GB,2)
    FreePercent=$(if($_.Size -gt 0){[math]::Round(100 * $_.FreeSpace / $_.Size,1)}else{0})
  }
})

$info = [pscustomobject]@{
  Moment=$time.ToString('yyyy-MM-dd HH:mm:ss')
  Version=$(if($os){$os.Caption}else{'No disponible'})
  Build=$(if($os){$os.BuildNumber}else{'No disponible'})
  LogicalProcessors=$cores
  RAMTotalGB=$(if($os){[math]::Round($os.TotalVisibleMemorySize / 1MB,2)}else{0})
  RAMAvailableGB=$(if($os){[math]::Round($os.FreePhysicalMemory / 1MB,2)}else{0})
  TotalProcesses=@(Get-Process -ErrorAction SilentlyContinue).Count
  RunningServices=@($service | Where-Object {$_.State -eq 'Running'}).Count
  SampleSeconds=[math]::Round($elapsed,2)
}
$sharedServices = @($service |
  Where-Object {$_.State -eq 'Running' -and $_.ProcessId -gt 0} |
  Group-Object ProcessId |
  Where-Object {$_.Count -gt 1} |
  Select-Object @{Name='PID';Expression={$_.Name}},Count)

$av = $null
try {
  $mp=Get-MpComputerStatus -ErrorAction Stop
  $av=[pscustomobject]@{
    AntivirusEnabled=$mp.AntivirusEnabled
    RealTimeProtectionEnabled=$mp.RealTimeProtectionEnabled
    AntivirusSignatureLastUpdated=$mp.AntivirusSignatureLastUpdated
  }
} catch {
  $av=[pscustomobject]@{
    AntivirusEnabled='No disponible'
    RealTimeProtectionEnabled='No disponible'
    AntivirusSignatureLastUpdated='No disponible'
  }
}

Write-Host ''
Write-Host 'EVO LABS // DIAGNOSTICO MAESTRO WINDOWS' -ForegroundColor Cyan
Write-Host 'SOLO LECTURA. NO ES UN OPTIMIZADOR AUTOMATICO.' -ForegroundColor Yellow
Write-Host ''
$info | Format-List
Write-Host 'UNIDADES LOCALES' -ForegroundColor Cyan
$disks | Format-Table -AutoSize
Write-Host 'CPU MEDIA POR PROCESO EN LA VENTANA OBSERVADA' -ForegroundColor Cyan
$cpu | Format-Table -AutoSize
Write-Host 'PID QUE COMPARTEN VARIOS SERVICIOS (NO SUMAR MEMORIAS)' -ForegroundColor Cyan
$sharedServices | Select-Object -First 20 | Format-Table -AutoSize
Write-Host 'ANTIVIRUS: ESTADO INFORMADO POR WINDOWS' -ForegroundColor Cyan
$av | Format-List
Write-Host 'EVENTOS DEL SISTEMA NIVEL ERROR EN 24 HORAS' -ForegroundColor Cyan
$events | Select-Object -First 15 | Format-Table -AutoSize
Write-Host 'IMPORTANTE: no asumir causa por coincidencia de PID, evento o hora.'
Write-Host 'Las medidas son aproximaciones. Para casos DPC/ISR usar WPR/WPA.' -ForegroundColor Yellow

if ($Save) {
  try {
    if (-not (Test-Path -LiteralPath $OutputDirectory)) {
      New-Item -ItemType Directory -Path $OutputDirectory -Force -ErrorAction Stop | Out-Null
    }
    $tag=$time.ToString('yyyyMMdd-HHmmss')
    $info | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutputDirectory "evo-sistema-$tag.csv")
    $disks | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutputDirectory "evo-unidades-$tag.csv")
    $cpu | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutputDirectory "evo-cpu-$tag.csv")
    $events | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutputDirectory "evo-eventos-$tag.csv")
    $startup | Export-Csv -NoTypeInformation -Encoding UTF8 -Path (Join-Path $OutputDirectory "evo-inicio-$tag.csv")
    Write-Host "CSV guardados localmente en: $OutputDirectory" -ForegroundColor Green
    Write-Host 'Revisa datos privados antes de compartirlos.' -ForegroundColor Yellow
  } catch {
    Write-Warning ('No se pudo guardar: ' + $_.Exception.Message)
  }
}
