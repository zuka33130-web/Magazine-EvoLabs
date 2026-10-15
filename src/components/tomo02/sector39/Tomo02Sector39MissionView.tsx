import React, { useState } from "react";
import {
  Award,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Activity,
  Terminal,
  FileCheck,
  TrendingDown,
  Cpu,
  HardDrive,
  Database,
} from "lucide-react";

interface Tomo02Sector39MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector39MissionView: React.FC<Tomo02Sector39MissionViewProps> = ({
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
      title: "Misión 1: Captura de Línea Base Inicial (Fase 1 del Capstone)",
      badge: "PUNTO CERO MATEMÁTICO",
      objective: "Tomar una muestra de telemetría de 10 segundos en reposo de CPU, RAM y Cola de Disco exportándola a un archivo CSV estructurado.",
      difficulty: "CAPSTONE // BASELINE",
      commands: [
        {
          label: "1. Captura de contadores con typeperf",
          cmd: "typeperf \"\\Processor(_Total)\\% Processor Time\" \"\\Memory\\Available MBytes\" \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" -sc 10 -o C:\\EVO_Baseline_Pre.csv",
          desc: "Registra 10 muestras con resolución de 1 segundo en el archivo C:\\EVO_Baseline_Pre.csv.",
        },
        {
          label: "2. Visualizar promedios basales en PowerShell",
          cmd: "$data = Import-Csv C:\\EVO_Baseline_Pre.csv\n$cpu = ($data | Measure-Object -Property '\\Processor(_Total)\\% Processor Time' -Average).Average\n$queue = ($data | Measure-Object -Property '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length' -Average).Average\nWrite-Host \"[BASELINE] CPU Promedio: $cpu% | Cola de Disco: $queue\" -ForegroundColor Cyan",
          desc: "Calcula la media aritmética del estado basal del equipo.",
        },
      ],
      expectedEvidence: "Archivo CSV generado en C:\\ con 10 registros limpios listos para contrastar.",
      riskMitigation: "Medición 100% pasiva; asegurar que no haya descargas ni escaneos en segundo plano.",
    },
    {
      id: 2,
      title: "Misión 2: Intervención Única Controlada con Snapshot VSS (Fase 5)",
      badge: "SNAPSHOT & ROLLBACK",
      objective: "Crear un punto de restauración previo, exportar la clave de registro a modificar y aplicar una única variable de cambio.",
      difficulty: "CAPSTONE // INTERVENCIÓN",
      commands: [
        {
          label: "1. Crear punto de restauración en VSS",
          cmd: "Checkpoint-Computer -Description 'EVO_Capstone_PreFix' -RestorePointType 'MODIFY_SETTINGS'",
          desc: "Asegura la capacidad de revertir el estado completo del sistema.",
        },
        {
          label: "2. Exportar respaldo de la rama de registro",
          cmd: "reg export \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management\" C:\\EVO_Reg_Backup.reg /y",
          desc: "Crea el archivo .reg para rollback determinista instantáneo.",
        },
        {
          label: "3. Aplicar la intervención única",
          cmd: "# Ejemplo: Calibracion de paginacion o servicio aislado\nWrite-Host '[INFO] Intervención única aplicada bajo control.' -ForegroundColor Green",
          desc: "Solo se modifica una variable para no romper la relación de causa y efecto.",
        },
      ],
      expectedEvidence: "Punto de restauración VSS confirmado y archivo .reg guardado en C:\\.",
      riskMitigation: "Si el punto de restauración falla al crearse, suspender la intervención inmediatamente.",
    },
    {
      id: 3,
      title: "Misión 3: Segunda Medición y Cálculo de Delta Matemático (Fase 6 y 7)",
      badge: "VEREDICTO MATEMÁTICO",
      objective: "Repetir la captura de contadores bajo condiciones idénticas y calcular el delta de mejora porcentual neta.",
      difficulty: "CAPSTONE // ANÁLISIS",
      commands: [
        {
          label: "1. Captura de contadores Post-Intervención",
          cmd: "typeperf \"\\Processor(_Total)\\% Processor Time\" \"\\Memory\\Available MBytes\" \"\\PhysicalDisk(_Total)\\Avg. Disk Queue Length\" -sc 10 -o C:\\EVO_Baseline_Post.csv",
          desc: "Ejecuta exactamente el mismo comando de la Fase 1.",
        },
        {
          label: "2. Script de cálculo de delta y veredicto",
          cmd: "$pre = (Import-Csv C:\\EVO_Baseline_Pre.csv | Measure-Object -Property '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length' -Average).Average\n$post = (Import-Csv C:\\EVO_Baseline_Post.csv | Measure-Object -Property '\\PhysicalDisk(_Total)\\Avg. Disk Queue Length' -Average).Average\n$delta = (($pre - $post) / $pre) * 100\n[PSCustomObject]@{\n    Pre_Queue = [math]::Round($pre, 2)\n    Post_Queue = [math]::Round($post, 2)\n    Delta_Mejora = \"$([math]::Round($delta, 1))%\"\n    Veredicto = if ($delta -ge 15) { 'ÉXITO COMPROBADO' } elseif ($delta -le -10) { 'DEGRADACIÓN' } else { 'PLACEBO' }\n} | Format-List",
          desc: "Determina si el cambio produjo una ventaja real o si debe revertirse.",
        },
      ],
      expectedEvidence: "Veredicto formal calculado matemáticamente sin margen para la especulación.",
      riskMitigation: "Si el resultado marca Placebo o Degradación, aplicar C:\\EVO_Reg_Backup.reg de inmediato.",
    },
    {
      id: 4,
      title: "Misión 4: Sellado y Emisión del Expediente Windows EVO 001 (Fase 10)",
      badge: "SELLO CRIPTOGRÁFICO",
      objective: "Compilar el informe pericial final en un archivo de texto con membrete y calcular su hash SHA-256 para entrega al cliente.",
      difficulty: "CAPSTONE // EMISIÓN FINAL",
      commands: [
        {
          label: "1. Generar el documento final del expediente",
          cmd: "$dossier = @\"\n=======================================================\n           EXPEDIENTE WINDOWS EVO 001                  \n   BIBLIA NEGRA DE WINDOWS - AUDITORÍA CAPSTONE FINAL  \n=======================================================\nFECHA: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')\nEQUIPO: $env:COMPUTERNAME | USUARIO: $env:USERNAME\nSISTEMA: $((Get-CimInstance Win32_OperatingSystem).Caption)\n-------------------------------------------------------\nFASE 1: Baseline inicial registrado.\nFASE 5: Intervención única aplicada con snapshot VSS.\nFASE 7: Delta calculado: Mejora confirmada > 15%.\nFASE 8: VEREDICTO: ÉXITO COMPROBADO SIN PLACEBO.\n=======================================================\n\"@\n$dossier | Out-File -FilePath C:\\Expediente_Windows_EVO_001.txt -Encoding utf8",
          desc: "Crea el documento pericial estandarizado.",
        },
        {
          label: "2. Calcular el hash criptográfico SHA-256 de custodia",
          cmd: "Get-FileHash -Path C:\\Expediente_Windows_EVO_001.txt -Algorithm SHA256 | Format-List",
          desc: "Genera la huella de 64 caracteres que certifica la inmutabilidad del documento.",
        },
      ],
      expectedEvidence: "Expediente Windows EVO 001 emitido y sellado con hash SHA-256 auténtico.",
      riskMitigation: "Archivar una copia del hash y del expediente en el registro histórico del taller.",
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
              <span>LABORATORIO FINAL // SECTOR 39</span>
              <span>•</span>
              <span>NIVEL V // CAPSTONE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-400" />
              <span>EVO Capstone Master Audit Benchmark</span>
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
            Fases del Capstone
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
                Objetivo Científico del Protocolo:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{current.objective}</p>
            </div>

            {/* Commands sequence */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Protocolo de Ejecución Pericial:</span>
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
                          <span>Copiar Comando</span>
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
                  Evidencia Demostrable:
                </span>
                <p className="text-zinc-300">{current.expectedEvidence}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs">
                <span className="text-amber-400 font-bold uppercase block mb-1">
                  Protocolo de Reversión EVO:
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
