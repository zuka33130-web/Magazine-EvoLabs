import React, { useState } from "react";
import {
  FolderOpen,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Activity,
  Terminal,
  HardDrive,
  Database,
  TrendingUp,
  Cpu,
} from "lucide-react";

interface Tomo02Sector37MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector37MissionView: React.FC<Tomo02Sector37MissionViewProps> = ({
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
      title: "Misión 1: Reconstrucción Pericial del Almacén BCD en UEFI (Error 0xc000000e)",
      badge: "RESCATE DE BOOTLOADER",
      objective: "Montar la partición del sistema EFI (ESP FAT32) en WinRE y reinyectar los archivos bootmgfw.efi y BCD apuntando al volumen correcto de Windows.",
      difficulty: "AVANZADO // CRÍTICO",
      commands: [
        {
          label: "1. Identificar la partición EFI FAT32 oculta",
          cmd: "diskpart\nlist disk\nselect disk 0\nlist partition\nselect partition 1\nassign letter=S:\nexit",
          desc: "Asigna la letra S: al volumen FAT32 de 100-260 MB del sistema EFI.",
        },
        {
          label: "2. Reconstruir los archivos de arranque para UEFI",
          cmd: "bcdboot C:\\Windows /s S: /f UEFI /v",
          desc: "Copia los binarios de arranque y genera un store BCD nuevo y limpio.",
        },
        {
          label: "3. Verificar la entrada NVRAM generada",
          cmd: "bcdedit /store S:\\EFI\\Microsoft\\Boot\\BCD /enum all",
          desc: "Confirma que el bootloader apunta a winload.efi y partition=C:.",
        },
      ],
      expectedEvidence: "Mensaje 'Boot files successfully created' y arranque exitoso sin error 0xc000000e.",
      riskMitigation: "No formatear el volumen C:; la partición ESP es independiente y puede recrearse infinidad de veces sin perder datos.",
    },
    {
      id: 2,
      title: "Misión 2: Saneamiento Atómico de Windows Update (Error 0x80070002)",
      badge: "SANEAMIENTO DE DATASTORE",
      objective: "Detener los servicios de actualización, purgar la base de datos transaccional ESE corrupta y forzar la recreación limpia del catálogo.",
      difficulty: "INTERMEDIO // OPERATIVO",
      commands: [
        {
          label: "1. Detener servicios bloqueantes",
          cmd: "net stop wuauserv & net stop bits & net stop cryptsvc & net stop trustedinstaller",
          desc: "Libera los bloqueos exclusivos sobre los archivos de base de datos.",
        },
        {
          label: "2. Renombrar SoftwareDistribution y Catroot2",
          cmd: "ren %systemroot%\\SoftwareDistribution SD.old & ren %systemroot%\\System32\\catroot2 cat2.old",
          desc: "Aísla las bases de datos con firmas desincronizadas sin destruirlas.",
        },
        {
          label: "3. Reiniciar el motor WUA e invocar detección",
          cmd: "net start wuauserv & net start bits & UsoClient StartScan",
          desc: "Regenera el catálogo limpio y lanza la verificación de parches pendientes.",
        },
      ],
      expectedEvidence: "La carpeta SoftwareDistribution se recrea limpia (<15 MB) y la actualización acumulativa instala al 100%.",
      riskMitigation: "Si alguna aplicación bancaria requería firmas previas en Catroot2, la carpeta original se preserva como cat2.old.",
    },
    {
      id: 3,
      title: "Misión 3: Resolución de Congelamientos por PCIe ASPM en SSD NVMe",
      badge: "LATENCIA DE ALMACENAMIENTO",
      objective: "Deshabilitar los estados de reposo PCIe L1 Substates que provocan 100% de ocupación con 0 KB/s de transferencia.",
      difficulty: "AVANZADO // HARDWARE-OS",
      commands: [
        {
          label: "1. Deshabilitar Link State Power Management en corriente alterna",
          cmd: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS LINKSTATE 0",
          desc: "Fuerza al bus PCIe a permanecer en estado L0 activo cuando el equipo está enchufado.",
        },
        {
          label: "2. Aplicar el esquema activo inmediatamente",
          cmd: "powercfg /setactive SCHEME_CURRENT",
          desc: "Aplica los cambios en el kernel sin necesidad de reiniciar el equipo.",
        },
        {
          label: "3. Medir el tiempo de respuesta del disco en reposo",
          cmd: "typeperf \"\\PhysicalDisk(_Total)\\Avg. Disk sec/Transfer\" -sc 5",
          desc: "Verifica que el tiempo de respuesta por transferencia sea < 0.001 segundos.",
        },
      ],
      expectedEvidence: "Tiempo de actividad de disco en Task Manager cae de 100% a 1% instantáneamente.",
      riskMitigation: "Aumento despreciable de consumo (<0.3W) a cambio de eliminar congelamientos de 30 segundos.",
    },
    {
      id: 4,
      title: "Misión 4: Aislamiento y Neutralización de Fuga de Memoria en svchost",
      badge: "MEMORY LEAK ISOLATION",
      objective: "Identificar cuál servicio específico dentro de un proceso compartido svchost.exe consume gigabytes de RAM y separarlo en su propio proceso independiente.",
      difficulty: "EXPERTO // SYSTEM INTERNALS",
      commands: [
        {
          label: "1. Identificar los servicios dentro del PID con leak",
          cmd: "tasklist /fi \"imagename eq svchost.exe\" /svc",
          desc: "Desglosa cada servicio hospedado en el contenedor saturado.",
        },
        {
          label: "2. Aislar el servicio sospechoso en su propio proceso",
          cmd: "sc config [NombreServicio] type= own",
          desc: "Indica al SCM que no comparta proceso svchost con otros servicios.",
        },
        {
          label: "3. Reiniciar el servicio aislado y medir consumo",
          cmd: "net stop [NombreServicio] & net start [NombreServicio]",
          desc: "Monitorea si la fuga de memoria ahora queda encapsulada sin afectar al resto del sistema.",
        },
      ],
      expectedEvidence: "El servicio culpable queda expuesto con su propio PID en Task Manager y se puede reportar o reemplazar.",
      riskMitigation: "Reversible en cualquier momento con `sc config [NombreServicio] type= share`.",
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
              <span>LABORATORIO PERICIAL // SECTOR 37</span>
              <span>•</span>
              <span>NIVEL V</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-cyan-400" />
              <span>EVO Forensic Case Library: Prácticas de Rescate</span>
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
            Expedientes de Laboratorio
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
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-bold">
                {current.difficulty}
              </span>
            </div>

            {/* Objective */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                Objetivo Técnico Pericial:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">{current.objective}</p>
            </div>

            {/* Commands sequence */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Secuencia Quirúrgica de Comandos:</span>
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
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-black/80 border border-zinc-900 text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">
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
                  Evidencia Pericial Esperada:
                </span>
                <p className="text-zinc-300">{current.expectedEvidence}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs">
                <span className="text-amber-400 font-bold uppercase block mb-1">
                  Mitigación de Riesgos EVO:
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
