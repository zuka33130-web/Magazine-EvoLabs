import React, { useState } from "react";
import {
  Layers,
  ArrowLeft,
  Copy,
  Check,
  Zap,
  Shield,
  Activity,
  Terminal,
  Database,
  HardDrive,
} from "lucide-react";

interface Tomo02Sector34MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector34MissionView: React.FC<Tomo02Sector34MissionViewProps> = ({
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
      title: "Misión 1: Auditoría Forense de Hardlinks en System32 vs WinSxS",
      badge: "AUDITORÍA DE PUNTEROS",
      difficulty: "Intermedio",
      description:
        "Verifica empíricamente que los binarios críticos del sistema operativo en System32 no ocupan almacenamiento adicional, sino que son proyecciones hardlink del Component Store.",
      steps: [
        {
          step: 1,
          label: "Listar los enlaces duros físicos de ntdll.dll",
          cmd: "fsutil hardlink list C:\\Windows\\System32\\ntdll.dll",
          explanation: "Obtiene todas las rutas en el volumen que apuntan al mismo número de registro MFT físico.",
        },
        {
          step: 2,
          label: "Verificar el número de referencia MFT del archivo",
          cmd: "fsutil file queryfileid C:\\Windows\\System32\\ntdll.dll",
          explanation: "Devuelve el File ID de 64 bits de NTFS para contrastarlo con la ruta de WinSxS.",
        },
        {
          step: 3,
          label: "Consultar el File ID en la ruta de WinSxS",
          cmd: "Get-ChildItem -Path C:\\Windows\\WinSxS -Filter ntdll.dll -Recurse | ForEach-Object { fsutil file queryfileid $_.FullName }",
          explanation: "Confirma que el File ID devuelto es idéntico al de System32.",
        },
      ],
    },
    {
      id: 2,
      title: "Misión 2: Auditoría Integral del Component Store con DISM",
      badge: "ANÁLISIS CBS",
      difficulty: "Avanzado",
      description:
        "Calcula la diferencia exacta entre el tamaño aparente informado por el Explorador de Windows y el espacio físico real ocupado por WinSxS.",
      steps: [
        {
          step: 1,
          label: "Ejecutar análisis en línea de componentes",
          cmd: "dism.exe /Online /Cleanup-Image /AnalyzeComponentStore",
          explanation: "DISM evalúa los paquetes reemplazados y determina si se recomienda la recolección de basura.",
        },
        {
          step: 2,
          label: "Filtrar paquetes superseded en PowerShell",
          cmd: "Get-WindowsPackage -Online | Where-Object { $_.PackageState -eq 'Superseded' } | Select-Object PackageName, ReleaseType",
          explanation: "Lista los nombres exactos de los parches acumulativos obsoletos que pueden ser purgados.",
        },
        {
          step: 3,
          label: "Auditar el registro de transacciones de CBS",
          cmd: "Get-Content C:\\Windows\\Logs\\CBS\\CBS.log -Tail 100 | Select-String -Pattern 'CBS_E_|TiWorker'",
          explanation: "Comprueba que no existan transacciones pendientes o errores de manifiesto abortados.",
        },
      ],
    },
    {
      id: 3,
      title: "Misión 3: Protocolo Seguro de Limpieza y Compactación Base",
      badge: "RECOLECCIÓN DE BASURA",
      difficulty: "Experto (Modifica Estado)",
      description:
        "Aplica el procedimiento oficial de limpieza de componentes obsoletos liberando espacio físico sin comprometer la estabilidad del sistema.",
      steps: [
        {
          step: 1,
          label: "Limpieza estándar conservando rollback",
          cmd: "dism.exe /Online /Cleanup-Image /StartComponentCleanup",
          explanation: "Elimina versiones superseded preservando la capacidad de desinstalar los parches vigentes.",
        },
        {
          step: 2,
          label: "Fijar nueva línea base inmutable (Opcional tras 14 días estable)",
          cmd: "dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase",
          explanation: "Purga la totalidad de copias históricas consolidando la versión actual como base definitiva.",
        },
        {
          step: 3,
          label: "Verificar la integridad del almacén resultante",
          cmd: "sfc.exe /scannow",
          explanation: "Asegura que todos los archivos protegidos del sistema coinciden bit a bit con los manifiestos de WinSxS.",
        },
      ],
    },
  ];

  const currentMission = missions.find((m) => m.id === selectedMission) || missions[0];

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-xs">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#080B10] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToReader}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                LABORATORIO PRÁCTICO · SECTOR 34
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              WinSxS & Component Store Auditor Bench
            </h2>
          </div>
        </div>

        {/* Mission selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {missions.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMission(m.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedMission === m.id
                  ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              Misión {m.id}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Details */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080B10] border border-cyan-500/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                {currentMission.badge}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 text-[11px]">Nivel: {currentMission.difficulty}</span>
            </div>
            <h3 className="text-base font-bold text-white uppercase">{currentMission.title}</h3>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed">{currentMission.description}</p>

        {/* Steps */}
        <div className="space-y-4">
          <span className="text-white font-bold uppercase text-[11px] block tracking-wider">
            Protocolo de Ejecución Paso a Paso:
          </span>
          <div className="space-y-3">
            {currentMission.steps.map((s) => (
              <div
                key={s.step}
                className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/20 space-y-2 relative group hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-xs">
                    PASO {s.step}: {s.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(s.cmd)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
                  >
                    {copiedCmd === s.cmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-green-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Comando</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/80 border border-zinc-800 text-cyan-300 font-mono text-xs overflow-x-auto">
                  <code>{s.cmd}</code>
                </div>
                <p className="text-[11px] text-zinc-400">{s.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Warning callout */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start gap-3">
          <Shield className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold uppercase block mb-1">Directiva Forense EVO:</span>
            <p className="text-xs leading-relaxed text-amber-200/90">
              Cualquier comando que limpie WinSxS debe ejecutarse siempre con permisos elevados de Administrador.
              No desconectes la alimentación durante la ejecución de /StartComponentCleanup; el motor CBS
              debe cerrar la transacción atómica para preservar la integridad de arranque.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
