import React, { useState } from "react";
import {
  HardDrive,
  Database,
  FileText,
  Link2,
  FolderTree,
  Shield,
  Layers,
  CheckCircle2,
  Sliders,
} from "lucide-react";

export const Sector33VisualDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "MFT_RECORD_ANATOMY" | "ADS_ZONE_IDENTIFIER" | "HARDLINK_JUNCTION_SYMLINK"
  >("MFT_RECORD_ANATOMY");

  // MFT Resident vs Non-Resident toggle
  const [isResident, setIsResident] = useState<boolean>(true);

  // Link type selection
  const [selectedLinkType, setSelectedLinkType] = useState<"HARD_LINK" | "JUNCTION" | "SYM_LINK">("HARD_LINK");

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-[#080B10] p-5 my-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-cyan-400" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Laboratorio Forense Visual: Estructura de Bajo Nivel de NTFS
          </h4>
        </div>
        <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("MFT_RECORD_ANATOMY")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "MFT_RECORD_ANATOMY"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            1. Anatomía de Registro MFT (1 KB)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ADS_ZONE_IDENTIFIER")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "ADS_ZONE_IDENTIFIER"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            2. Flujos Alternativos (ADS)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("HARDLINK_JUNCTION_SYMLINK")}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-all cursor-pointer ${
              activeTab === "HARDLINK_JUNCTION_SYMLINK"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            3. Hard Link vs Junction vs Symlink
          </button>
        </div>
      </div>

      {/* TAB 1: MFT RECORD ANATOMY */}
      {activeTab === "MFT_RECORD_ANATOMY" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Registro MFT de 1024 Bytes: Residente vs No Residente
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Observa cómo conmuta la estructura cuando el archivo mide menos de 700 bytes vs cuando requiere clusters en disco:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResident(!isResident)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isResident
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              }`}
            >
              Modo: {isResident ? "RESIDENTE (<700 B, 0 clusters)" : "NO RESIDENTE (Data Runs en LCN)"}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
              <span>Offset 0x000 → 0x3FF (1024 Bytes de MFT Entry)</span>
              <span className="text-cyan-400 font-bold">Magic: 'FILE' (0x454C4946)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">0x00 - 0x30</span>
                <span className="text-white font-bold block">Cabecera FILE</span>
                <span className="text-[10px] text-zinc-400">SequenceNumber, LSN</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">Atributo 0x10</span>
                <span className="text-cyan-300 font-bold block">$STANDARD_INFO</span>
                <span className="text-[10px] text-zinc-400">Marcas de tiempo (MACB)</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-900/70 border border-zinc-800">
                <span className="text-zinc-500 block text-[9px]">Atributo 0x30</span>
                <span className="text-emerald-300 font-bold block">$FILE_NAME</span>
                <span className="text-[10px] text-zinc-400">Nombre Unicode, Parent MFT</span>
              </div>
              <div className={`p-2.5 rounded border ${isResident ? "bg-emerald-950/40 border-emerald-500 text-emerald-300" : "bg-cyan-950/40 border-cyan-500 text-cyan-300"}`}>
                <span className="text-zinc-500 block text-[9px]">Atributo 0x80</span>
                <span className="font-bold block">$DATA</span>
                <span className="text-[10px] block">
                  {isResident ? "Contenido IN-LINE en MFT" : "Puntero LCN a clusters"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
              <span className="text-cyan-400 font-bold">Interpretación Forense: </span>
              {isResident
                ? "El contenido completo del archivo está alojado en el espacio de 1 KB del registro. 'Tamaño en disco' reporta 0 KB en el Explorador porque no gasta ningún cluster de 4 KB."
                : "El archivo creció y no cabe en la MFT. Se asignó una cadena de clusters contiguos o fragmentados (Data Runs) direccionados por LCN (Logical Cluster Number)."}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADS ZONE IDENTIFIER */}
      {activeTab === "ADS_ZONE_IDENTIFIER" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
            <h5 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Flujos Alternativos (ADS) y la Marca de Seguridad Zone.Identifier
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed">
              En NTFS un archivo puede contener flujos secundarios independientes. El navegador web escribe la procedencia de Internet en el flujo <code>:Zone.Identifier:$DATA</code>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[10px] uppercase font-bold">Flujo Primario ($DATA no nombrado):</span>
                <span className="text-cyan-400 text-[10px]">Visible en Explorer</span>
              </div>
              <div className="p-2.5 rounded bg-black text-white text-xs">script.ps1 (14.250 bytes)</div>
              <p className="text-[10px] text-zinc-400">Contiene el código ejecutable de la aplicación.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F17] border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 text-[10px] uppercase font-bold">Flujo Secundario (ADS :Zone.Identifier):</span>
                <span className="text-amber-400 text-[10px]">Oculto para dir normal</span>
              </div>
              <div className="p-2.5 rounded bg-black text-amber-300 text-xs">
                [ZoneTransfer]<br />ZoneId=3 (Internet Zone)
              </div>
              <p className="text-[10px] text-zinc-400">Activa la advertencia de SmartScreen y el bloqueo de macros.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-cyan-500/30 font-mono text-xs flex items-center justify-between">
            <span className="text-zinc-400">
              Comando para revelar flujos ocultos: <span className="text-cyan-300 font-bold">dir /R</span> o <span className="text-cyan-300 font-bold">Get-Item * -Stream *</span>
            </span>
            <span className="text-[10px] text-zinc-500">Unblock-File</span>
          </div>
        </div>
      )}

      {/* TAB 3: HARDLINK JUNCTION SYMLINK */}
      {activeTab === "HARDLINK_JUNCTION_SYMLINK" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Comparador Estructural de Enlaces NTFS
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Selecciona una tecnología para ver sus diferencias de almacenamiento y comportamiento de kernel:
              </p>
            </div>
            <div className="flex rounded-lg bg-black p-1 border border-zinc-800 gap-1">
              {[
                { id: "HARD_LINK", label: "Hard Link (mklink /H)" },
                { id: "JUNCTION", label: "Junction (mklink /J)" },
                { id: "SYM_LINK", label: "Symbolic Link (mklink /D)" },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedLinkType(b.id as any)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                    selectedLinkType === b.id
                      ? "bg-cyan-500 text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0F17] border border-cyan-500/20 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-bold block">Apunta a:</span>
                <span className="text-white font-bold text-xs">
                  {selectedLinkType === "HARD_LINK"
                    ? "Mismo registro MFT existente"
                    : selectedLinkType === "JUNCTION"
                    ? "Directorio local de cualquier volumen"
                    : "Ruta de archivo/directorio local o red"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-bold block">Consumo en Disco:</span>
                <span className="text-emerald-400 font-bold text-xs">
                  {selectedLinkType === "HARD_LINK"
                    ? "0 Bytes adicionales (100% compartido)"
                    : "0 Bytes (Metadato Reparse Point)"}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase font-bold block">Cruzamiento de Volúmenes:</span>
                <span className={`font-bold text-xs ${selectedLinkType === "HARD_LINK" ? "text-red-400" : "text-emerald-400"}`}>
                  {selectedLinkType === "HARD_LINK" ? "NO (Solo mismo volumen)" : "SÍ (Permite cruzar unidades)"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black border border-zinc-800 text-[11px] text-zinc-300 leading-relaxed">
              <span className="text-cyan-400 font-bold">Caso de uso real: </span>
              {selectedLinkType === "HARD_LINK" &&
                "El almacén de componentes C:\\Windows\\WinSxS contiene las DLLs reales y crea Hard Links en System32, evitando duplicar 20 GB de archivos."}
              {selectedLinkType === "JUNCTION" &&
                "Mover la carpeta de perfiles de usuario o juegos de C:\\Juegos a D:\\Juegos manteniendo total compatibilidad sin romper rutas legadas."}
              {selectedLinkType === "SYM_LINK" &&
                "Desarrollo con Node.js/npm/git para enlazar librerías compartidas con compatibilidad de enlaces simbólicos tipo POSIX."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
