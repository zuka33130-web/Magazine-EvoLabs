import React, { useState } from "react";
import {
  Layers,
  HardDrive,
  Database,
  Link2,
  FileText,
  Shield,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  RotateCcw,
} from "lucide-react";

export const Sector34VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "HARDLINK_MAPPING" | "STORE_ANATOMY" | "DISM_ANALYSIS_CALCULATOR"
  >("HARDLINK_MAPPING");

  // Hardlink Interactive Demo
  const [selectedFile, setSelectedFile] = useState<"ntdll" | "kernel32" | "notepad">("ntdll");

  // DISM Calculator State
  const [withResetBase, setWithResetBase] = useState<boolean>(false);
  const [isCleaned, setIsCleaned] = useState<boolean>(false);

  const fileData = {
    ntdll: {
      name: "ntdll.dll",
      size: "2.1 MB",
      mftRecord: "114092",
      clusterOffset: "0x4A8F20",
      system32Path: "C:\\Windows\\System32\\ntdll.dll",
      winsxsPath: "C:\\Windows\\WinSxS\\amd64_microsoft-windows-ntdll_31bf3856ad364e35_10.0.22621.1_none_8f8e\\ntdll.dll",
      linkCount: 3,
    },
    kernel32: {
      name: "kernel32.dll",
      size: "1.8 MB",
      mftRecord: "114098",
      clusterOffset: "0x4B1E00",
      system32Path: "C:\\Windows\\System32\\kernel32.dll",
      winsxsPath: "C:\\Windows\\WinSxS\\amd64_microsoft-windows-kernel32_31bf3856ad364e35_10.0.22621.1_none_4b3c\\kernel32.dll",
      linkCount: 2,
    },
    notepad: {
      name: "notepad.exe",
      size: "0.4 MB",
      mftRecord: "89201",
      clusterOffset: "0x32A100",
      system32Path: "C:\\Windows\\System32\\notepad.exe",
      winsxsPath: "C:\\Windows\\WinSxS\\amd64_microsoft-windows-notepad_31bf3856ad364e35_10.0.22621.1_none_7d1a\\notepad.exe",
      linkCount: 2,
    },
  };

  const curr = fileData[selectedFile];

  return (
    <div className="rounded-2xl bg-[#080B10] border border-cyan-500/20 overflow-hidden font-mono text-xs">
      {/* Tab Header */}
      <div className="flex flex-wrap border-b border-cyan-500/20 bg-[#05070A] p-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("HARDLINK_MAPPING")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "HARDLINK_MAPPING"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>HARDLINK TOPOLOGY</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("STORE_ANATOMY")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "STORE_ANATOMY"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>CBS PIPELINE ARCHITECTURE</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("DISM_ANALYSIS_CALCULATOR")}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "DISM_ANALYSIS_CALCULATOR"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>DISM REAL VS APPARENT CALCULATOR</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {/* TAB 1: HARDLINK TOPOLOGY */}
        {activeTab === "HARDLINK_MAPPING" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0E17] p-3 rounded-xl border border-cyan-500/10">
              <div>
                <span className="text-zinc-400 block text-[11px]">Seleccionar Binario del Sistema:</span>
                <span className="text-white font-bold">Inspección de Punteros NTFS Hardlink</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(["ntdll", "kernel32", "notepad"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFile(key)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      selectedFile === key
                        ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700"
                    }`}
                  >
                    {key}.{key === "notepad" ? "exe" : "dll"}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual mapping schema */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: System32 Directory Entry */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/30 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Entrada en Directorio A</span>
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-bold text-white text-sm truncate">{curr.system32Path}</div>
                <div className="text-[11px] text-zinc-400">
                  Tamaño Reportado por Explorer: <span className="text-zinc-200 font-bold">{curr.size}</span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Tipo: Hard link pointer hacia MFT Record #{curr.mftRecord}
                </div>
                <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-cyan-300">
                  Puntero proyectado para el Loader de Windows (LdrpLoadDll).
                </div>
              </div>

              {/* Box 2: Physical MFT Record (SHARED) */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#111A2E] to-[#0A101D] border-2 border-cyan-400 space-y-2 relative shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Registro Físico NTFS Único</span>
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-bold text-white text-sm">MFT Record #{curr.mftRecord}</div>
                <div className="text-[11px] text-zinc-300">
                  Contador de Enlaces (Hardlinks): <span className="text-amber-300 font-bold">{curr.linkCount} referencias</span>
                </div>
                <div className="text-[10px] text-zinc-400">
                  Offset de Clusters Físicos: <span className="text-cyan-300 font-bold">{curr.clusterOffset}</span>
                </div>
                <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-200">
                  ¡Solo ocupa {curr.size} reales en los chips NAND del SSD! No hay duplicación de datos.
                </div>
              </div>

              {/* Box 3: WinSxS Directory Entry */}
              <div className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/30 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Entrada en Directorio B</span>
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="font-bold text-white text-xs truncate" title={curr.winsxsPath}>
                  {curr.winsxsPath}
                </div>
                <div className="text-[11px] text-zinc-400">
                  Tamaño Reportado por Explorer: <span className="text-zinc-200 font-bold">{curr.size}</span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Tipo: Hard link pointer hacia MFT Record #{curr.mftRecord}
                </div>
                <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-cyan-300">
                  Copia inmutable del Component Store protegida por TrustedInstaller.
                </div>
              </div>
            </div>

            {/* Explanatory callout */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-zinc-300 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Veredicto Forense de Punteros</span>
              </div>
              <p className="text-xs leading-relaxed">
                Si ejecutas <code className="text-cyan-200 bg-black/40 px-1 py-0.5 rounded">fsutil hardlink list {curr.system32Path}</code>,
                verificarás que ambas rutas comparten el mismo número de referencia en el registro de la Master File Table.
                Cuando un optimizador o usuario borra la versión de WinSxS, está desvinculando la entrada del directorio
                y corrompiendo la base criptográfica del CBS, pero no está liberando espacio si System32 aún mantiene el archivo abierto.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: CBS PIPELINE ARCHITECTURE */}
        {activeTab === "STORE_ANATOMY" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block">FASE 1</span>
                <span className="font-bold text-white text-xs block">Paquete .MSU / .CAB</span>
                <p className="text-[11px] text-zinc-400">Descarga criptográfica firmada con catálogo SHA256 desde Windows Update.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block">FASE 2</span>
                <span className="font-bold text-white text-xs block">TiWorker & CBS Engine</span>
                <p className="text-[11px] text-zinc-400">Crea transacción atómica en C:\Windows\Logs\CBS y descomprime en WinSxS.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block">FASE 3</span>
                <span className="font-bold text-white text-xs block">Hardlink Projection</span>
                <p className="text-[11px] text-zinc-400">NTFS proyecta punteros hard link a System32, SysWOW64 y Drivers.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block">FASE 4</span>
                <span className="font-bold text-white text-xs block">Superseded Archiving</span>
                <p className="text-[11px] text-zinc-400">Las versiones viejas quedan marcadas como 'Superseded' para permitir rollback.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/20 space-y-3">
              <span className="font-bold text-white text-xs uppercase block">Estructura Interna de C:\Windows\WinSxS:</span>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-black/40 border border-zinc-800 flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">amd64_microsoft-windows-..._[hash]_[version]</span>
                  <span className="text-zinc-400">Carpetas individuales por cada ensamblado Side-by-Side</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-zinc-800 flex items-center justify-between">
                  <span className="text-amber-300 font-bold">Manifests\ (*.manifest, *.mum, *.cat)</span>
                  <span className="text-zinc-400">Firmas criptográficas de seguridad y dependencias</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-zinc-800 flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">Catalogs\ (*.cat)</span>
                  <span className="text-zinc-400">Catálogos de seguridad verificados por el kernel en boot</span>
                </div>
                <div className="p-2 rounded bg-black/40 border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-300 font-bold">Temp\ (PendingRenames / InFlight)</span>
                  <span className="text-zinc-400">Archivos en tránsito procesados durante reinicios</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DISM REAL VS APPARENT CALCULATOR */}
        {activeTab === "DISM_ANALYSIS_CALCULATOR" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0E17] border border-cyan-500/20">
              <div>
                <span className="text-white font-bold block text-sm">Simulador DISM /AnalyzeComponentStore</span>
                <span className="text-zinc-400 text-xs">Observa la diferencia entre el tamaño aparente y el tamaño real en disco</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={withResetBase}
                    onChange={(e) => setWithResetBase(e.target.checked)}
                    className="rounded bg-black border-cyan-500/40 text-cyan-500 focus:ring-0"
                  />
                  <span>Incluir modificador /ResetBase</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCleaned(!isCleaned)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    isCleaned
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  }`}
                >
                  {isCleaned ? "Restaurar Estado Inicial" : "Ejecutar /StartComponentCleanup"}
                </button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0D121D] border border-red-500/30">
                <span className="text-[10px] text-zinc-400 uppercase block">Reporte Explorador (Ficticio)</span>
                <span className="text-xl font-bold text-red-400">
                  {isCleaned ? (withResetBase ? "16.8 GB" : "18.5 GB") : "22.4 GB"}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">Suma ingenua con hardlinks duplicados</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D121D] border border-cyan-500/30">
                <span className="text-[10px] text-zinc-400 uppercase block">Tamaño Real en Disco</span>
                <span className="text-xl font-bold text-cyan-300">
                  {isCleaned ? (withResetBase ? "5.4 GB" : "6.6 GB") : "8.1 GB"}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">Clusters físicos asignados</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D121D] border border-amber-500/30">
                <span className="text-[10px] text-zinc-400 uppercase block">Paquetes Reemplazados (Superseded)</span>
                <span className="text-xl font-bold text-amber-300">
                  {isCleaned ? (withResetBase ? "0.0 GB (0 packs)" : "0.4 GB (1 pack)") : "2.7 GB (5 packs)"}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">Recuperable mediante limpieza</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D121D] border border-green-500/30">
                <span className="text-[10px] text-zinc-400 uppercase block">Espacio Físico Liberado</span>
                <span className="text-xl font-bold text-green-400">
                  {isCleaned ? (withResetBase ? "2.7 GB" : "1.5 GB") : "0.0 GB"}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-1">Devuelto al pool libre de NTFS</span>
              </div>
            </div>

            {/* Output console preview */}
            <div className="p-4 rounded-xl bg-black border border-cyan-500/20 font-mono text-xs space-y-1 text-zinc-300">
              <div className="text-cyan-400 font-bold">$ dism.exe /Online /Cleanup-Image /AnalyzeComponentStore</div>
              <div className="text-zinc-500">Herramienta de administración y servicio de imágenes de implementación</div>
              <div className="text-zinc-500">Versión: 10.0.22621.1</div>
              <div className="pt-2 text-zinc-300">Información del almacén de componentes (WinSxS):</div>
              <div>Tamaño del almacén de componentes según el Explorador : <span className="text-red-400 font-bold">{isCleaned ? (withResetBase ? "16.80 GB" : "18.50 GB") : "22.40 GB"}</span></div>
              <div>Tamaño real del almacén de componentes : <span className="text-cyan-400 font-bold">{isCleaned ? (withResetBase ? "5.40 GB" : "6.60 GB") : "8.10 GB"}</span></div>
              <div className="pl-4 text-zinc-400">Compartido con Windows : 5.10 GB</div>
              <div className="pl-4 text-zinc-400">Copias de seguridad y funciones deshabilitadas : <span className="text-amber-400 font-bold">{isCleaned ? (withResetBase ? "0.30 GB" : "1.50 GB") : "3.00 GB"}</span></div>
              <div className="pl-4 text-zinc-400">Cachés y datos temporales : 0.00 GB</div>
              <div className="pt-1">Fecha de la última limpieza : {isCleaned ? "Hoy (Reciente)" : "2023-11-14"}</div>
              <div>Número de paquetes reemplazados : <span className="text-amber-400 font-bold">{isCleaned ? (withResetBase ? "0" : "1") : "5"}</span></div>
              <div className="font-bold text-white pt-1">
                Se recomienda la limpieza del almacén de componentes : {isCleaned ? <span className="text-green-400">No</span> : <span className="text-amber-400">Sí</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
