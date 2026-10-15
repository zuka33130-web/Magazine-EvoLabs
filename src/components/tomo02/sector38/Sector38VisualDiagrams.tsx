import React, { useState } from "react";
import {
  Wrench,
  Terminal,
  Code,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Shield,
  Layers,
  FileText,
  Copy,
  Check,
} from "lucide-react";

export const Sector38VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "TOOL_PIPELINE" | "DRY_RUN_FLOW" | "INTERACTIVE_BUILDER"
  >("TOOL_PIPELINE");

  // Interactive Builder State
  const [targetAudit, setTargetAudit] = useState<"SYSTEM" | "PROCESS" | "MEMORY" | "NETWORK">("SYSTEM");
  const [outputFormat, setOutputFormat] = useState<"JSON" | "CSV" | "TXT">("JSON");
  const [includeDryRun, setIncludeDryRun] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const generateScript = () => {
    let queryCmd = "";
    if (targetAudit === "SYSTEM") {
      queryCmd = "Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber, OSArchitecture";
    } else if (targetAudit === "PROCESS") {
      queryCmd = "Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name, ExecutablePath";
    } else if (targetAudit === "MEMORY") {
      queryCmd = "Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory | Select-Object AvailableMBytes, PoolNonpagedBytes, PoolPagedBytes";
    } else {
      queryCmd = "Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess";
    }

    let exportCmd = "";
    if (outputFormat === "JSON") {
      exportCmd = "| ConvertTo-Json -Depth 4 | Out-File -FilePath 'C:\\EVO_Audit.json' -Encoding utf8";
    } else if (outputFormat === "CSV") {
      exportCmd = "| Export-Csv -Path 'C:\\EVO_Audit.csv' -NoTypeInformation -Encoding utf8";
    } else {
      exportCmd = "| Format-Table -AutoSize | Out-File -FilePath 'C:\\EVO_Audit.txt' -Encoding utf8";
    }

    const dryRunBinding = includeDryRun
      ? "[CmdletBinding(SupportsShouldProcess=$true)]\nparam()\nif ($PSCmdlet.ShouldProcess($env:COMPUTERNAME, 'Ejecutar Auditoria EVO')) {\n    "
      : "";

    const dryRunClose = includeDryRun ? "\n}" : "";

    return `<#
  .SYNOPSIS
    EVO Tool Studio - Auditor Autogenerado
    Sector 38: Dejá de descargar herramientas, fabricá las tuyas.
#>\nfunction Invoke-EVOCustomAudit {\n    ${dryRunBinding}Write-Output \"[$(Get-Date -Format 'o')] [INFO] Iniciando auditoria ${targetAudit}...\"\n    $data = ${queryCmd}\n    $data ${exportCmd}\n    Write-Output \"[$(Get-Date -Format 'o')] [SUCCESS] Exportado con exito en formato ${outputFormat}.\"${dryRunClose}\n}\n\n# Ejecucion (añadir -WhatIf si SupportsShouldProcess esta activo)\nInvoke-EVOCustomAudit${includeDryRun ? " -WhatIf" : ""}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0B0F17] border border-cyan-500/20 rounded-2xl p-6 font-mono text-xs text-zinc-300 my-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            SECTOR 38 // ARQUITECTURA DE HERRAMIENTAS Y SCRIPTS NATIVOS
          </span>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span>EVO Tool Studio: El Artefacto de Fabricación Propia</span>
          </h3>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("TOOL_PIPELINE")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "TOOL_PIPELINE"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Pipeline de una Tool
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DRY_RUN_FLOW")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "DRY_RUN_FLOW"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Ciclo WhatIf / Reversión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("INTERACTIVE_BUILDER")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "INTERACTIVE_BUILDER"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Generador de Scripts
          </button>
        </div>
      </div>

      {activeTab === "TOOL_PIPELINE" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Las 4 etapas obligatorias de cualquier herramienta nativa construida bajo la metodología EVO:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-cyan-400 font-bold mb-1">1. Fuente Nativa CIM</div>
              <div className="text-[11px] text-zinc-400">
                Extracción limpia de datos mediante WMI/CIM, EventLogs o contadores PDH sin ejecutables externos.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-purple-400 font-bold mb-1">2. Procesamiento Tipado</div>
              <div className="text-[11px] text-zinc-400">
                Transformación en objetos <code className="text-white">PSCustomObject</code> con tipos fuertes, filtros y métricas derivadas.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/30">
              <div className="text-amber-400 font-bold mb-1">3. Control Defensivo</div>
              <div className="text-[11px] text-zinc-400">
                Bloques <code className="text-white">try/catch</code> con códigos de salida HRESULT, soporte WhatIf y registro de auditoría ISO-8601.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold mb-1">4. Serialización Estándar</div>
              <div className="text-[11px] text-zinc-400">
                Exportación determinista en JSON para SIEM, CSV para Excel o TXT con membrete pericial.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "DRY_RUN_FLOW" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Flujo de Seguridad de Ejecución: Simulación vs Realidad</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-black/50 border border-zinc-800">
                <span className="text-cyan-400 font-bold block mb-1">
                  Modo Dry-Run (-WhatIf)
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Evalúa los parámetros, muestra en pantalla exactamente qué claves del registro o archivos se modificarían y calcula los riesgos sin tocar el disco.
                </p>
                <div className="mt-2 text-[10px] font-mono text-zinc-500">
                  Riesgo de fallo: 0.0%
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-black/50 border border-zinc-800">
                <span className="text-emerald-400 font-bold block mb-1">
                  Modo Real con Respaldo
                </span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Crea un snapshot de VSS (<code className="text-white">Checkpoint-Computer</code>), exporta la rama con <code className="text-white">reg export</code> y ejecuta la intervención única.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-400">
                  Rollback garantizado en &lt; 5s
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "INTERACTIVE_BUILDER" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Target Selector */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                1. Módulo de Auditoría
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                {(["SYSTEM", "PROCESS", "MEMORY", "NETWORK"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTargetAudit(t)}
                    className={`px-2 py-1.5 rounded text-left transition-colors cursor-pointer ${
                      targetAudit === t
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                        : "bg-black/40 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format Selector */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                2. Formato de Salida
              </span>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                {(["JSON", "CSV", "TXT"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setOutputFormat(f)}
                    className={`px-2 py-1.5 rounded text-center transition-colors cursor-pointer ${
                      outputFormat === f
                        ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40"
                        : "bg-black/40 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                3. Modo Defensivo
              </span>
              <button
                type="button"
                onClick={() => setIncludeDryRun(!includeDryRun)}
                className={`w-full px-3 py-2 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  includeDryRun
                    ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
                    : "bg-black/40 border border-zinc-800 text-zinc-400"
                }`}
              >
                <span>Soporte -WhatIf (Dry-run)</span>
                <span className="font-bold">{includeDryRun ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>

          {/* Generated Code Output */}
          <div className="relative">
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/90 rounded-t-xl border-t border-x border-zinc-800 text-xs">
              <span className="text-zinc-400 font-bold flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span>Script PowerShell Autogenerado Listo para Ejecutar</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copiado" : "Copiar Script"}</span>
              </button>
            </div>
            <pre className="p-4 rounded-b-xl bg-black border border-zinc-800 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
              {generateScript()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
