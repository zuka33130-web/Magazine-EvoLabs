import React, { useState } from 'react';
import {
  HardDrive,
  Layers,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Cpu,
  Shield,
  FileCode,
  FolderTree,
} from 'lucide-react';

export const Sector12VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'GPT_MBR' | 'QUARTET' | 'NTFS_MFT' | 'SHRINK_EXTEND'
  >('QUARTET');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <HardDrive className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 12</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE ALMACENAMIENTO, GPT Y SISTEMAS DE ARCHIVOS
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Estructura de sectores LBA, cuarteto de particiones Windows 11, metadatos NTFS y operaciones de contigüidad
            </p>
          </div>

          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('QUARTET')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'QUARTET'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Cuarteto GPT de Windows
            </button>
            <button
              onClick={() => setActiveDiagram('GPT_MBR')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'GPT_MBR'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. GPT vs MBR (LBA 0 a LBA -1)
            </button>
            <button
              onClick={() => setActiveDiagram('NTFS_MFT')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'NTFS_MFT'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Estructura Interna NTFS & $MFT
            </button>
            <button
              onClick={() => setActiveDiagram('SHRINK_EXTEND')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeDiagram === 'SHRINK_EXTEND'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. Regla de Contigüidad Shrink/Extend
            </button>
          </div>
        </div>

        {/* DIAGRAM 1: QUARTET */}
        {activeDiagram === 'QUARTET' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-4">
                TOPOLOGÍA CANÓNICA EN DISCO NVME / SSD GPT (WINDOWS 10 / 11)
              </span>

              {/* Disk Bar Visualizer */}
              <div className="w-full flex flex-col md:flex-row gap-2 font-mono text-xs text-center select-none">
                <div className="flex-1 bg-amber-950/60 border border-amber-600/50 p-4 rounded-lg flex flex-col justify-between">
                  <div className="font-bold text-amber-300">ESP (EFI System)</div>
                  <div className="text-[11px] text-amber-400/80 my-1">100 - 260 MB // FAT32</div>
                  <div className="text-[10px] text-slate-400">bootmgfw.efi + BCD Store</div>
                </div>

                <div className="w-24 bg-purple-950/60 border border-purple-600/50 p-4 rounded-lg flex flex-col justify-between">
                  <div className="font-bold text-purple-300">MSR</div>
                  <div className="text-[11px] text-purple-400/80 my-1">16 MB // RAW</div>
                  <div className="text-[10px] text-slate-400">Reserva Kernel LDM</div>
                </div>

                <div className="flex-[4] bg-cyan-950/60 border border-cyan-500/50 p-4 rounded-lg flex flex-col justify-between">
                  <div className="font-bold text-cyan-300">Windows OS (C:)</div>
                  <div className="text-[11px] text-cyan-400/80 my-1">Resto del Disco // NTFS 4K</div>
                  <div className="text-[10px] text-slate-400">\Windows, \Program Files, \Users, $MFT</div>
                </div>

                <div className="flex-1 bg-rose-950/60 border border-rose-600/50 p-4 rounded-lg flex flex-col justify-between">
                  <div className="font-bold text-rose-300">Recovery (WinRE)</div>
                  <div className="text-[11px] text-rose-400/80 my-1">650 - 1000 MB // NTFS</div>
                  <div className="text-[10px] text-slate-400">winre.wim (Hidden/No-Letter)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs text-slate-300">
                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-cyan-400 font-bold font-mono">¿Por qué EFI debe ser FAT32?</div>
                  <p className="text-slate-400 leading-relaxed">
                    El microcódigo UEFI de las placas madre carece de soporte nativo para el journaling complejo de NTFS. La especificación UEFI exige lectura FAT32 en la partición ESP para ejecutar <code className="text-cyan-300">\EFI\Boot\bootx64.efi</code>.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-rose-400 font-bold font-mono">¿Por qué Recovery va al final?</div>
                  <p className="text-slate-400 leading-relaxed">
                    Colocar Recovery al final permite a Microsoft ampliar winre.wim sin romper la contigüidad de C:, aunque si no se dimensionó con margen, puede bloquear la extensión del volumen C: hacia la derecha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 2: GPT vs MBR */}
        {activeDiagram === 'GPT_MBR' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GPT Layout */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">GUID Partition Table (GPT)</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">UEFI Standard</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">LBA 0:</span>
                    <span className="text-amber-300">Protective MBR (Type 0xEE)</span>
                  </div>
                  <div className="p-2.5 bg-cyan-950/40 rounded border border-cyan-900/50 flex justify-between items-center">
                    <span className="text-cyan-400">LBA 1:</span>
                    <span className="text-cyan-200">Primary GPT Header (CRC32 Check)</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">LBA 2-33:</span>
                    <span className="text-slate-200">128 Partition Entries (128 bytes c/u)</span>
                  </div>
                  <div className="p-3 bg-emerald-950/30 rounded border border-emerald-900/40 text-center text-emerald-300 font-sans text-[11px]">
                    Sectores de Datos Lógicos (LBA 34 a N-34)
                  </div>
                  <div className="p-2.5 bg-cyan-950/40 rounded border border-cyan-900/50 flex justify-between items-center">
                    <span className="text-cyan-400">LBA -1:</span>
                    <span className="text-cyan-200">Backup GPT Header (Auto-recuperación)</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Soporta hasta 9.4 Zettabytes de direccionamiento de sectores.</div>
                  <div>• Sumas de comprobación CRC32 automáticas en cabeceras primaria y copia final.</div>
                </div>
              </div>

              {/* MBR Layout */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">Master Boot Record (MBR - 1983)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-mono">BIOS Legacy</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-amber-950/40 rounded border border-amber-900/50 flex justify-between items-center">
                    <span className="text-amber-400">Bytes 0-445:</span>
                    <span className="text-amber-200">Bootstrap Machine Code (446 bytes)</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-400">Bytes 446-509:</span>
                    <span className="text-slate-200">Tabla de Particiones (4x16 bytes = 64B)</span>
                  </div>
                  <div className="p-2.5 bg-rose-950/40 rounded border border-rose-900/50 flex justify-between items-center">
                    <span className="text-rose-400">Bytes 510-511:</span>
                    <span className="text-rose-200">Boot Signature 0x55AA (Magic Number)</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-center text-slate-400 font-sans text-[11px]">
                    Límite matemático: 2^32 sectores * 512 bytes = 2.19 TB máx.
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Máximo 4 particiones primarias (o 3 primarias + 1 extendida con EBRs encadenados).</div>
                  <div>• Sin redundancia ni checksum: un fallo en LBA 0 destruye el booteo.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 3: NTFS & $MFT */}
        {activeDiagram === 'NTFS_MFT' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                ARQUITECTURA INTERNA DE METADATOS NTFS (NEW TECHNOLOGY FILE SYSTEM)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-900 p-3 rounded-lg border border-cyan-800/40 space-y-1">
                  <div className="text-cyan-300 font-bold">$MFT</div>
                  <div className="text-[10px] text-slate-400">Registro maestro donde cada archivo tiene una ficha de 1024 bytes con sus atributos ($STANDARD_INFORMATION, $FILE_NAME, $DATA).</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-cyan-800/40 space-y-1">
                  <div className="text-cyan-300 font-bold">$LogFile</div>
                  <div className="text-[10px] text-slate-400">Journal transaccional de metadatos. Permite rollback y commit atómico ante caídas de tensión eléctrica repentinas.</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-cyan-800/40 space-y-1">
                  <div className="text-cyan-300 font-bold">$Bitmap</div>
                  <div className="text-[10px] text-slate-400">Mapa de bits binario donde cada bit representa el estado de asignación (libre=0, ocupado=1) de cada clúster del volumen.</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-cyan-800/40 space-y-1">
                  <div className="text-cyan-300 font-bold">$Volume & $Secure</div>
                  <div className="text-[10px] text-slate-400">Almacenan la versión del sistema de archivos, el identificador único del volumen y la base de datos de descriptores de seguridad (ACLs).</div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-amber-400 font-bold">Concepto de "Resident Data":</div>
                <p className="text-slate-400 leading-relaxed font-sans text-xs">
                  Si un archivo pesa menos de aproximadamente 700 bytes, NTFS no asigna ningún clúster de datos en el disco: guarda el contenido directamente DENTRO del registro de 1024 bytes de la <code className="text-cyan-300">$MFT</code> en el atributo <code className="text-cyan-300">$DATA</code> residente, reduciendo el I/O a cero.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAM 4: SHRINK & EXTEND CONTIGUITY */}
        {activeDiagram === 'SHRINK_EXTEND' && (
          <div className="pt-6 space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                LA REGLA DE CONTIGÜIDAD DERECHA EN DISK MANAGEMENT
              </span>

              {/* Blocked scenario */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-rose-400 font-mono">CASO BLOQUEADO: Partición intermedia impide extender C:</div>
                <div className="w-full flex gap-1 font-mono text-xs text-center">
                  <div className="flex-[3] bg-cyan-950/70 border border-cyan-500 p-3 rounded text-cyan-200">
                    <div>Windows C: (200 GB)</div>
                    <div className="text-[10px] text-slate-400">¿Extender? [BLOQUEADO]</div>
                  </div>
                  <div className="w-32 bg-rose-950/70 border border-rose-500 p-3 rounded text-rose-200">
                    <div>Recovery (500 MB)</div>
                    <div className="text-[10px] text-rose-400">Obstáculo Físico</div>
                  </div>
                  <div className="flex-[2] bg-slate-900 border border-dashed border-slate-600 p-3 rounded text-slate-400">
                    <div>Espacio sin Asignar (300 GB)</div>
                    <div className="text-[10px] text-slate-500">Inaccesible por contigüidad</div>
                  </div>
                </div>
              </div>

              {/* Resolved scenario */}
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-emerald-400 font-mono">CASO VÁLIDO: Espacio no asignado inmediatamente a la derecha</div>
                <div className="w-full flex gap-1 font-mono text-xs text-center">
                  <div className="flex-[3] bg-cyan-950/70 border border-cyan-500 p-3 rounded text-cyan-200">
                    <div>Windows C: (200 GB)</div>
                    <div className="text-[10px] text-emerald-400">Extender [HABILITADO]</div>
                  </div>
                  <div className="flex-[2] bg-emerald-950/40 border border-dashed border-emerald-500 p-3 rounded text-emerald-300">
                    <div>Espacio sin Asignar (300 GB)</div>
                    <div className="text-[10px] text-emerald-400">Contiguo a la derecha</div>
                  </div>
                  <div className="w-32 bg-slate-900 border border-slate-700 p-3 rounded text-slate-400">
                    <div>Recovery reubicada al final</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
