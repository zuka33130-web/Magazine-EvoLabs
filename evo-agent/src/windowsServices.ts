// ============================================================================
// EVO LOCAL AGENT — WINDOWS SERVICES EXPERIMENT MANAGER
// Fixed-command, allowlisted service experiments only.
// NO arbitrary shell execution. NO startup-type mutation. NO critical-service control.
// ============================================================================

import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export type ServiceExperimentAction = 'STOP' | 'START';

export interface WindowsServiceSnapshot {
  name: string;
  displayName: string;
  state: string;
  startMode: string;
  processId: number;
  startName: string;
  workingSetMb: number;
  experimentAllowed: boolean;
}

export interface ServiceExperimentResult {
  success: boolean;
  action: ServiceExperimentAction;
  serviceName: string;
  before: WindowsServiceSnapshot | null;
  after: WindowsServiceSnapshot | null;
  timestamp: string;
  message: string;
}

const EXPERIMENT_ALLOWLIST: Record<string, { canonical: string; reason: string }> = {
  sysmain: {
    canonical: 'SysMain',
    reason: 'Experimento reversible de precarga. Detener no modifica el tipo de inicio.',
  },
  wsearch: {
    canonical: 'WSearch',
    reason: 'Experimento reversible del indexador de búsqueda. Detener no modifica el tipo de inicio.',
  },
  spooler: {
    canonical: 'Spooler',
    reason: 'Experimento reversible del subsistema de impresión. Detener afecta impresión mientras dure la prueba.',
  },
  diagtrack: {
    canonical: 'DiagTrack',
    reason: 'Experimento reversible de Connected User Experiences and Telemetry. Detener no modifica el tipo de inicio.',
  },
};

export class WindowsServicesExperimentManager {
  private static readonly MAX_BUFFER = 4 * 1024 * 1024;

  public static getAllowedExperimentServices(): string[] {
    return Object.values(EXPERIMENT_ALLOWLIST).map((item) => item.canonical);
  }

  public static isExperimentAllowed(serviceName: string): boolean {
    return Boolean(EXPERIMENT_ALLOWLIST[String(serviceName || '').trim().toLowerCase()]);
  }

  public async listServices(): Promise<WindowsServiceSnapshot[]> {
    if (process.platform !== 'win32') {
      throw new Error('PLATFORM_NOT_SUPPORTED: La auditoría de servicios requiere Windows nativo.');
    }

    const script = [
      "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8",
      "$ErrorActionPreference='Stop'",
      "$items = Get-CimInstance Win32_Service | ForEach-Object {",
      "  $proc = $null",
      "  if ($_.ProcessId -gt 0) { $proc = Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue }",
      "  [PSCustomObject]@{",
      "    Name=$_.Name",
      "    DisplayName=$_.DisplayName",
      "    State=$_.State",
      "    StartMode=$_.StartMode",
      "    ProcessId=[int]$_.ProcessId",
      "    StartName=$_.StartName",
      "    WorkingSetMb=if($proc){[math]::Round($proc.WorkingSet64/1MB,1)}else{0}",
      "  }",
      "}",
      "$items | Sort-Object DisplayName | ConvertTo-Json -Depth 3 -Compress",
    ].join('\n');

    const { stdout } = await execFileAsync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
      { windowsHide: true, maxBuffer: WindowsServicesExperimentManager.MAX_BUFFER }
    );

    const trimmed = String(stdout || '').trim();
    if (!trimmed) return [];

    const parsed = JSON.parse(trimmed);
    const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

    return items.map((item) => ({
      name: String(item.Name || ''),
      displayName: String(item.DisplayName || item.Name || ''),
      state: String(item.State || 'UNKNOWN'),
      startMode: String(item.StartMode || 'UNKNOWN'),
      processId: Number(item.ProcessId || 0),
      startName: String(item.StartName || 'UNKNOWN'),
      workingSetMb: Number(item.WorkingSetMb || 0),
      experimentAllowed: WindowsServicesExperimentManager.isExperimentAllowed(String(item.Name || '')),
    }));
  }

  public async applyExperiment(
    serviceName: string,
    action: ServiceExperimentAction
  ): Promise<ServiceExperimentResult> {
    if (process.platform !== 'win32') {
      throw new Error('PLATFORM_NOT_SUPPORTED: Los experimentos reales requieren Windows nativo.');
    }

    const normalized = String(serviceName || '').trim().toLowerCase();
    const allowed = EXPERIMENT_ALLOWLIST[normalized];
    if (!allowed) {
      throw new Error(
        'SERVICE_NOT_ALLOWLISTED: EVO bloqueó el cambio real. Sólo se permiten servicios opcionales incluidos explícitamente en el catálogo de experimentos.'
      );
    }

    if (action !== 'STOP' && action !== 'START') {
      throw new Error('INVALID_ACTION: Sólo se admite STOP o START.');
    }

    const canonical = allowed.canonical;
    const before = (await this.listServices()).find(
      (service) => service.name.toLowerCase() === canonical.toLowerCase()
    ) || null;

    const command =
      action === 'STOP'
        ? `Stop-Service -Name '${canonical}' -ErrorAction Stop`
        : `Start-Service -Name '${canonical}' -ErrorAction Stop`;

    const script = [
      "[Console]::OutputEncoding=[System.Text.Encoding]::UTF8",
      "$ErrorActionPreference='Stop'",
      command,
      "Start-Sleep -Milliseconds 350",
    ].join('; ');

    await execFileAsync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
      { windowsHide: true, maxBuffer: WindowsServicesExperimentManager.MAX_BUFFER }
    );

    const after = (await this.listServices()).find(
      (service) => service.name.toLowerCase() === canonical.toLowerCase()
    ) || null;

    return {
      success: true,
      action,
      serviceName: canonical,
      before,
      after,
      timestamp: new Date().toISOString(),
      message:
        action === 'STOP'
          ? `${canonical} fue detenido temporalmente. El tipo de inicio NO fue modificado.`
          : `${canonical} fue iniciado nuevamente. Se restauró la función del servicio sin modificar su tipo de inicio.`,
    };
  }
}
