import React, { useState } from "react";
import {
  FolderOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Activity,
  Zap,
  Terminal,
  FileText,
} from "lucide-react";

export const Sector37VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "CASE_DECISION_TREE" | "UEFI_BOOT_FLOW" | "CASE_CATEGORIES_MATRIX"
  >("CASE_DECISION_TREE");

  const [selectedCase, setSelectedCase] = useState<
    "BOOT" | "UPDATE" | "DRIVER" | "POWER" | "DISK"
  >("BOOT");

  const casesSummary = {
    BOOT: {
      category: "UEFI / BCD Boot Recovery",
      symptom: "Pantalla azul de recuperación: Código 0xc000000e",
      hypothesis: "La partición ESP perdió el puntero al GUID del volumen del sistema operativo.",
      evidence: "El BCD contiene entradas corruptas o huérfanas tras clonación o corte de energía.",
      action: "bcdboot C:\\Windows /s S: /f UEFI",
      verdict: "Inicio UEFI reconstruido en 30 segundos sin reinstalación.",
      icon: Terminal,
      color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-300",
    },
    UPDATE: {
      category: "Windows Update Datastore",
      symptom: "Error 0x80070002 en descarga acumulativa al 99%",
      hypothesis: "Base de datos transaccional ESE (DataStore.edb) desincronizada.",
      evidence: "Hash mismatch en paquetes .cab descargados en SoftwareDistribution.",
      action: "net stop wuauserv & ren SoftwareDistribution SD.old & net start wuauserv",
      verdict: "Repositorio reconstruido limpiamente y actualización instalada.",
      icon: Activity,
      color: "border-blue-500/40 bg-blue-950/20 text-blue-300",
    },
    DRIVER: {
      category: "Kernel Crash Forensics",
      symptom: "BSOD DPC_WATCHDOG_VIOLATION (Bugcheck 0x133)",
      hypothesis: "Un driver de red retiene la cola DPC por más de 100 ticks.",
      evidence: "WinDbg !analyze -v señala módulo ndis.sys y driver de red rt640x64.sys.",
      action: "Instalación limpia de controlador firmado WHQL del fabricante.",
      verdict: "Latencia DPC estabilizada en < 300 µs y eliminación total del crash.",
      icon: Cpu,
      color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
    },
    POWER: {
      category: "Modern Standby S0ix",
      symptom: "Laptop caliente en mochila con batería agotada al 0%",
      hypothesis: "Plataforma no alcanza estados DRIPS profundos por telemetría o drivers.",
      evidence: "powercfg /sleepstudy muestra bloqueo continuo con HW Drips < 40%.",
      action: "Configurar acción de cierre de tapa en Hibernación S4 (corte 0W).",
      verdict: "Batería preservada al 100% y eliminación del riesgo térmico.",
      icon: Zap,
      color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
    },
    DISK: {
      category: "NVMe ASPM Power States",
      symptom: "SSD NVMe al 100% de tiempo activo con 0 KB/s de lectura/escritura",
      hypothesis: "Transición a subestado de bajo consumo PCIe L1 congela la cola de comandos.",
      evidence: "Tiempo de respuesta en Administrador de Tareas clavado en > 15.000 ms.",
      action: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS LINKSTATE 0",
      verdict: "Tiempo activo cae a 1% y latencia normalizada a < 0.5 ms.",
      icon: HardDrive,
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
    },
  };

  const current = casesSummary[selectedCase];
  const IconComp = current.icon;

  return (
    <div className="bg-[#0B0F17] border border-cyan-500/20 rounded-2xl p-6 font-mono text-xs text-zinc-300 my-8 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold block mb-1">
            SECTOR 37 // DIAGRAMAS DE FLUJO Y METODOLOGÍA PERICIAL
          </span>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
            <span>Biblioteca Forense: Protocolo de Diagnóstico Empírico</span>
          </h3>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("CASE_DECISION_TREE")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "CASE_DECISION_TREE"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Árbol de Decisión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("UEFI_BOOT_FLOW")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "UEFI_BOOT_FLOW"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Flujo UEFI vs BCD
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CASE_CATEGORIES_MATRIX")}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === "CASE_CATEGORIES_MATRIX"
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Matriz de Categorías
          </button>
        </div>
      </div>

      {activeTab === "CASE_DECISION_TREE" && (
        <div className="space-y-6">
          {/* Selector de Expedientes Clave */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              ["BOOT", "UPDATE", "DRIVER", "POWER", "DISK"] as const
            ).map((key) => {
              const item = casesSummary[key];
              const isSel = selectedCase === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCase(key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSel
                      ? `${item.color} shadow-[0_0_15px_rgba(6,182,212,0.15)]`
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">
                    Expediente
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {item.category.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expediente Interactivo Detallado */}
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                    ÁREA // {current.category}
                  </span>
                  <div className="text-sm font-bold text-white">{current.symptom}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300">
                METODOLOGÍA EVO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800">
                <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                  1. Hipótesis Causal
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {current.hypothesis}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800">
                <span className="text-[10px] text-blue-400 uppercase font-bold block mb-1">
                  2. Evidencia Empírica
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {current.evidence}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                  3. Acción Pericial Única
                </span>
                <p className="text-xs font-mono text-emerald-300 leading-relaxed bg-black/40 p-1.5 rounded border border-emerald-500/20">
                  {current.action}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                  4. Veredicto y Validación
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {current.verdict}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "UEFI_BOOT_FLOW" && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Arquitectura de la cadena de arranque UEFI en sistemas GPT y reconstrucción del BCD:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-cyan-400 font-bold mb-1">1. Firmware UEFI</div>
              <div className="text-[11px] text-zinc-400">
                Inicializa hardware y lee las variables de arranque NVRAM para localizar el Boot Manager.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-cyan-500/30">
              <div className="text-cyan-300 font-bold mb-1">2. Partición ESP (FAT32)</div>
              <div className="text-[11px] text-zinc-400">
                Carga <code className="text-white">\EFI\Microsoft\Boot\bootmgfw.efi</code> y lee el almacén BCD.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="text-cyan-400 font-bold mb-1">3. Windows OS Loader</div>
              <div className="text-[11px] text-zinc-400">
                Ejecuta <code className="text-white">winload.efi</code>, inicializa el subsistema VBS/Hypervisor y carga el Kernel.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold mb-1">4. Kernel NTOSKRNL</div>
              <div className="text-[11px] text-zinc-400">
                Inicia los drivers BOOT_START, monta el volumen C: y lanza <code className="text-white">smss.exe</code>.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-3">
            <Terminal className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Comando de Reparación Atómica:</span>
              <p className="font-mono text-zinc-300">
                diskpart &gt; select vol [ESP] &gt; assign letter=S: &gt; exit &gt; bcdboot C:\Windows /s S: /f UEFI
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "CASE_CATEGORIES_MATRIX" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Boot & Firmware", count: "37.01", desc: "UEFI, NVRAM y BCD stores corruptos" },
              { name: "Windows Update", count: "37.02", desc: "Datastore.edb, WUA y catroot2" },
              { name: "Drivers & Ring 0", count: "37.03", desc: "DPC watchdog, ndis.sys y colisiones" },
              { name: "Almacenamiento I/O", count: "37.04", desc: "PCIe ASPM, DevSleep y TRIM" },
              { name: "Memoria & Pools", count: "37.05", desc: "Leaks en svchost y NonPaged Pool" },
              { name: "CPU & Throttling", count: "37.06", desc: "PROCHOT#, VRM y disipación" },
              { name: "GPU & Render", count: "37.07", desc: "TDR timeout, dxgkrnl y clocks" },
              { name: "Redes & Winsock", count: "37.08", desc: "APIPA 169.254 y catálogo de sockets" },
            ].map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{cat.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{cat.count}</span>
                </div>
                <p className="text-[11px] text-zinc-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
