import React, { useState } from "react";
import {
  Wrench,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Activity,
  Terminal,
  Code,
  FileCode,
  Database,
} from "lucide-react";

interface Tomo02Sector38MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector38MissionView: React.FC<Tomo02Sector38MissionViewProps> = ({
  onBackToReader,
}) => {
  const [selectedMission, setSelectedMission] = useState<number>(1);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const missions = [
    {
      id: 1,
      title: "Misión 1: Ensamblaje del Auditor de Identidad y Firmware (EVO System Audit)",
      badge: "CIM NATIVE TELEMETRY",
      objective: "Construir una función de PowerShell pura que consulte las tablas SMBIOS y el sistema operativo para generar un objeto técnico en memoria sin depender de software externo.",
      difficulty: "BÁSICO // ARQUITECTURA",
      commands: [
        {
          label: "1. Consulta de SMBIOS y Placa Base",
          cmd: "$mobo = Get-CimInstance Win32_BaseBoard | Select-Object Manufacturer, Product, SerialNumber\n$bios = Get-CimInstance Win32_BIOS | Select-Object SMBIOSBIOSVersion, ReleaseDate",
          desc: "Extrae los metadatos del silicio directamente desde el kernel en < 40 ms.",
        },
        {
          label: "2. Ensamblar el objeto pericial consolidado",
          cmd: "$evoSys = [PSCustomObject]@{\n    Host = $env:COMPUTERNAME\n    Motherboard = \"$($mobo.Manufacturer) $($mobo.Product)\"\n    BIOS_Version = $bios.SMBIOSBIOSVersion\n    OS = (Get-CimInstance Win32_OperatingSystem).Caption\n    Build = (Get-CimInstance Win32_OperatingSystem).BuildNumber\n}\n$evoSys | Format-List",
          desc: "Unifica los datos en una estructura formal para emisión de certificados.",
        },
      ],
      expectedEvidence: "Ficha técnica completa impresa en consola en menos de 100 ms con cero dependencias externas.",
      riskMitigation: "Operación de solo lectura sobre el repositorio CIM; no altera el registro ni el sistema de archivos.",
    },
    {
      id: 2,
      title: "Misión 2: Auditor Forense de Procesos No Firmados (EVO Process Audit)",
      badge: "SECURITY FORENSICS",
      objective: "Mapear cada proceso activo en memoria, obtener su ejecutable en disco, validar su firma criptográfica Authenticode e identificar binarios no firmados.",
      difficulty: "INTERMEDIO // RING 3",
      commands: [
        {
          label: "1. Script de validación de firmas y genealogía",
          cmd: "Get-CimInstance Win32_Process |\nWhere-Object { $_.Path } |\nSelect-Object ProcessId, ParentProcessId, Name, Path, @{N='Signature';E={(Get-AuthenticodeSignature $_.Path -ErrorAction SilentlyContinue).Status}} |\nWhere-Object { $_.Signature -ne 'Valid' } |\nFormat-Table -AutoSize",
          desc: "Detecta procesos en ejecución que carecen de firma digital válida o cuyos certificados expiraron.",
        },
      ],
      expectedEvidence: "Lista concisa de ejecutables sospechosos o de código abierto sin firma para su posterior análisis pericial.",
      riskMitigation: "No terminar procesos a ciegas; verificar siempre si pertenecen a utilidades portables legítimas.",
    },
    {
      id: 3,
      title: "Misión 3: Extractor de Telemetría a JSON para Ingesta SIEM (EVO JSON Engine)",
      badge: "DATA PIPELINE",
      objective: "Serializar métricas de rendimiento en formato JSON estructurado respetando la profundidad de anidamiento para su integración en tableros de monitoreo.",
      difficulty: "INTERMEDIO // AUTOMATION",
      commands: [
        {
          label: "1. Generación de payload JSON enriquecido",
          cmd: "$payload = [PSCustomObject]@{\n    Timestamp = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ')\n    Host = $env:COMPUTERNAME\n    Metrics = @{\n        CPU_Percent = (Get-Counter '\\Processor(_Total)\\% Processor Time').CounterSamples.CookedValue\n        RAM_Free_MB = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1024, 0)\n        Disk_Queue = (Get-Counter '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length').CounterSamples.CookedValue\n    }\n}\n$payload | ConvertTo-Json -Depth 5 | Out-File -FilePath 'C:\\EVO_Telemetry.json' -Encoding utf8",
          desc: "Serializa métricas numéricas a un documento JSON estándar compatible con SIEM o APIs.",
        },
      ],
      expectedEvidence: "Archivo `C:\\EVO_Telemetry.json` con sintaxis válida, marcas de tiempo UTC y números redondeados.",
      riskMitigation: "El flag `-Depth 5` previene que PowerShell trunque diccionarios anidados a strings genéricos.",
    },
    {
      id: 4,
      title: "Misión 4: Implementación de Intervención con Soporte WhatIf (Dry-run)",
      badge: "DEFENSIVE PROGRAMMING",
      objective: "Crear una función avanzada de mantenimiento que integre SupportsShouldProcess para permitir simulaciones previas seguras.",
      difficulty: "AVANZADO // ARCHITECTURE",
      commands: [
        {
          label: "1. Función con soporte nativo -WhatIf",
          cmd: "function Invoke-EVOSafeClean {\n    [CmdletBinding(SupportsShouldProcess=$true)]\n    param()\n    if ($PSCmdlet.ShouldProcess(\"$env:TEMP\", 'Purgar temporales del usuario')) {\n        Write-Host '[INFO] Ejecutando purga real...' -ForegroundColor Green\n        Remove-Item \"$env:TEMP\\*\" -Recurse -Force -ErrorAction SilentlyContinue\n    }\n}\n\n# Probar simulacion sin tocar archivos:\nInvoke-EVOSafeClean -WhatIf",
          desc: "Al ejecutarse con -WhatIf, Windows simula el borrado y notifica al usuario sin eliminar nada.",
        },
      ],
      expectedEvidence: "Salida 'What if: Realizando la operación...' demostrando que la herramienta soporta simulación determinista.",
      riskMitigation: "Cero riesgo operativo al evaluar scripts en computadoras de producción.",
    },
  ];

  const current = missions.find((m) => m.id === selectedMission) || missions[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-mono flex flex-col p-4 sm:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full mb-8 flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToReader}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 uppercase tracking-widest font-bold">
              <span>LABORATORIO DE FABRICACIÓN // SECTOR 38</span>
              <span>•</span>
              <span>NIVEL V</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-cyan-400" />
              <span>EVO Custom Tool Studio: Construí tus Propias Herramientas</span>
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToReader}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold transition-colors cursor-pointer"
        >
          Volver al Lector
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Mission selector */}
        <aside className="space-y-3">
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">
            Misiones de Fabricación
          </span>
          {missions.map((m) => {
            const isSel = m.id === selectedMission;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMission(m.id)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  isSel
                    ? "bg-cyan-950/40 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <div className="text-[10px] text-cyan-400 font-bold mb-1">{m.badge}</div>
                <div className="font-bold line-clamp-2">{m.title}</div>
              </button>
            );
          })}
        </aside>

        {/* Mission Detail */}
        <main className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-2xl bg-[#090D15] border border-cyan-500/30 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] text-cyan-300 font-bold uppercase tracking-wider">
                  {current.badge}
                </span>
                <h2 className="text-lg font-bold text-white mt-2">{current.title}</h2>
              </div>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-300 font-bold">
                {current.difficulty}
              </span>
            </div>

            {/* Objective */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                Objetivo del Módulo:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{current.objective}</p>
            </div>

            {/* Commands sequence */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Código Fuente PowerShell de la Herramienta:</span>
              </span>

              {current.commands.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300">{step.label}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(step.cmd)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedCmd === step.cmd ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/80 border border-zinc-900 text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {step.cmd}
                  </pre>
                  <p className="text-[11px] text-zinc-400">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Evidence & Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                <span className="text-emerald-400 font-bold uppercase block mb-1">
                  Salida Estructurada Verificada:
                </span>
                <p className="text-zinc-300">{current.expectedEvidence}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs">
                <span className="text-amber-400 font-bold uppercase block mb-1">
                  Patrón Defensivo EVO:
                </span>
                <p className="text-zinc-300">{current.riskMitigation}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
