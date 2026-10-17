import React, { useState } from 'react';
import {
  RotateCcw,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  Cpu,
  HardDrive,
  FileCode,
  FileCheck,
  Zap,
  ArrowRight,
  Database,
  Cloud,
} from 'lucide-react';

export const Sector14VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'MFT_LIFECYCLE' | 'TRIM_DESTRUCTION' | 'DECISION_TREE' | 'SHADOW_VS_CLOUD'
  >('MFT_LIFECYCLE');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <RotateCcw className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 14</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              MECÁNICAS DE ELIMINACIÓN Y RECUPERACIÓN PERICIAL DE ARCHIVOS
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Ciclo de vida del registro MFT, comando ATA/NVMe TRIM en SSDs y árbol de decisión de recuperación forense
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('MFT_LIFECYCLE')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'MFT_LIFECYCLE'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Ciclo de Vida MFT (Delete vs Sh+Del)
            </button>
            <button
              onClick={() => setActiveDiagram('TRIM_DESTRUCTION')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'TRIM_DESTRUCTION'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. SSD + TRIM vs HDD Mecánico
            </button>
            <button
              onClick={() => setActiveDiagram('DECISION_TREE')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'DECISION_TREE'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Árbol de Decisión de Rescate
            </button>
            <button
              onClick={() => setActiveDiagram('SHADOW_VS_CLOUD')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'SHADOW_VS_CLOUD'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. VSS vs File History vs Cloud
            </button>
          </div>
        </div>

        {/* Diagram 1: MFT Lifecycle */}
        {activeDiagram === 'MFT_LIFECYCLE' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {/* State 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">FASE 1: ACTIVO</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                    IN_USE (0x01)
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-slate-300">
                    <strong>Entrada MFT:</strong> Record #42109
                  </div>
                  <div className="text-slate-300">
                    <strong>Flags:</strong> 0x0001 (FILE_IN_USE)
                  </div>
                  <div className="text-slate-300">
                    <strong>$DATA:</strong> Apunta a Clusters 10842-10890
                  </div>
                  <div className="text-slate-300">
                    <strong>$BITMAP:</strong> Bits asignados marcados en 1
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  El archivo existe formalmente en el árbol de directorios del sistema de archivos.
                </p>
              </div>

              {/* State 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">FASE 2: ELIMINADO</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">
                    FREE (0x00)
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-slate-300">
                    <strong>Entrada MFT:</strong> Flags = 0x0000
                  </div>
                  <div className="text-slate-300">
                    <strong>Puntero $DATA:</strong> Metadatos INTACTOS
                  </div>
                  <div className="text-slate-300">
                    <strong>$BITMAP:</strong> Bits liberados marcados en 0
                  </div>
                  <div className="text-amber-300">
                    <strong>Clusters LBA:</strong> DATOS FÍSICOS PRESENTES
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Windows NO borra los bytes. Solo marca los clusters como disponibles para futuras escrituras.
                </p>
              </div>

              {/* State 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400">FASE 3: SOBRESCRITO</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px]">
                    PERMANENT LOST
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="text-slate-300">
                    <strong>Nuevo Proceso:</strong> Escribe archivo nuevo
                  </div>
                  <div className="text-slate-300">
                    <strong>LBA Reutilizados:</strong> Clusters 10842-10890
                  </div>
                  <div className="text-rose-400">
                    <strong>Flujo de Bytes:</strong> Reemplazado físicamente
                  </div>
                  <div className="text-rose-400">
                    <strong>Recuperación:</strong> 0% IMPOSIBLE
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Si otro proceso escribe sobre los sectores asignados, los datos originales son destruidos irreversiblemente.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-300 font-mono">Diferencia Forense: </strong>
                La tecla <code>Delete</code> mueve la entrada MFT al directorio oculto <code>$Recycle.Bin\&lt;UserSID&gt;</code>{' '}
                creando un archivo <code>$R...</code> (contenido) y <code>$I...</code> (metadatos originales). Por el contrario,{' '}
                <code>Shift + Delete</code> saltea la papelera y desasigna inmediatamente el registro MFT.
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: SSD TRIM vs HDD */}
        {activeDiagram === 'TRIM_DESTRUCTION' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              {/* HDD */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <HardDrive className="w-4 h-4" />
                    <span>DISCO MECÁNICO (HDD MAGNÉTICO)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                    RECUPERABLE DÍAS/MESES
                  </span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>1. Archivo eliminado:</span>
                    <span className="text-slate-400">Flags MFT = 0</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>2. Platos magnéticos:</span>
                    <span className="text-emerald-400">Imantación INTACTA</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>3. Comando TRIM:</span>
                    <span className="text-slate-500">NO EXISTE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>4. Software de rescate:</span>
                    <span className="text-cyan-300">File Carving 100% exitoso</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  En un HDD magnético, mientras no se escriban datos encima, la información puede sobrevivir durante meses o años en los sectores.
                </p>
              </div>

              {/* SSD with TRIM */}
              <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <Zap className="w-4 h-4" />
                    <span>UNIDAD DE ESTADO SÓLIDO (SSD + TRIM)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px]">
                    DESTRUCCIÓN EN SEGUNDOS
                  </span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>1. Archivo eliminado:</span>
                    <span className="text-slate-400">NTFS emite DataSetManagement</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>2. Comando ATA/NVMe:</span>
                    <span className="text-amber-400">TRIM / Deallocate enviado</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>3. Controlador SSD (FTL):</span>
                    <span className="text-rose-400">Retorna ceros (DZAT/RZAT)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span>4. Software pericial:</span>
                    <span className="text-rose-400">Lee bloques 0x00 limpios</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  En SSDs con TRIM activo, una vez que el controlador procesa el comando, el firmware desasocia las páginas NAND y cualquier intento de lectura retorna 0x00 absoluto.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-zinc-500 uppercase block text-[10px]">Comprobación del estado de TRIM en Windows:</span>
                <code className="text-cyan-300 text-xs">fsutil behavior query DisableDeleteNotify</code>
              </div>
              <span className="text-emerald-400 font-bold text-xs">0 = TRIM ACTIVO (Recomendado rendimiento)</span>
            </div>
          </div>
        )}

        {/* Diagram 3: Decision Tree */}
        {activeDiagram === 'DECISION_TREE' && (
          <div className="pt-6 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
              <div className="font-bold text-cyan-400 text-sm border-b border-slate-800 pb-2">
                PROTOCOLO DE ACTUACIÓN ANTE PÉRDIDA DE INFORMACIÓN CRÍTICA
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-rose-300 text-xs block">PASO 1: CONGELAMIENTO INMEDIATO DE ESCRITURAS</strong>
                    <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                      Si el archivo estaba en la unidad del sistema C:, apaga el equipo forzadamente o no descargues nada. Instalar software de recuperación en el mismo disco sobreescribe los propios clusters que intentas salvar.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-amber-300 text-xs block">PASO 2: DIAGNÓSTICO DEL MEDIO FÍSICO</strong>
                    <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                      ¿Es SSD o HDD? Si es SSD y ya pasaron varios minutos encendido, las probabilidades caen al 1-5% por TRIM. Si es HDD magnético, las probabilidades son de más del 90%.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-900/40 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-cyan-300 text-xs block">PASO 3: EXAMEN DE INSTANTÁNEAS DE VOLUMEN (VSS)</strong>
                    <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                      Antes de realizar escaneos profundos de bajo nivel, verifica si Volume Shadow Copy (Shadow Copies) contiene una copia congelada previa del archivo o directorio.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <strong className="text-emerald-300 text-xs block">PASO 4: EJECUCIÓN DE WINFR HACIA OTRA UNIDAD</strong>
                    <p className="text-slate-300 font-sans text-[11px] mt-0.5">
                      Ejecutar <code>winfr C: D:\Recuperados /regular</code> o <code>/extensive</code> extrayendo siempre hacia una unidad física o pendrive distinto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: VSS vs File History vs Cloud */}
        {activeDiagram === 'SHADOW_VS_CLOUD' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Layers className="w-4 h-4" />
                <span>VOLUME SHADOW COPY (VSS)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside font-sans">
                <li>Opera a nivel de bloque en el volumen NTFS.</li>
                <li>Usa la tecnología Copy-on-Write (CoW).</li>
                <li>Permite restaurar versiones anteriores en vivo sin detener el sistema.</li>
                <li>Almacena solo los deltas que han cambiado.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <FileCheck className="w-4 h-4" />
                <span>HISTORIAL DE ARCHIVOS (FILE HISTORY)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside font-sans">
                <li>Monitorea carpetas de usuario (Documentos, Escritorio).</li>
                <li>Copia copias completas de archivos modificados a una unidad externa.</li>
                <li>Requiere configuración previa explícita por el usuario.</li>
                <li>Excelente para deshacer ediciones erróneas de documentos.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Cloud className="w-4 h-4" />
                <span>CONTROL DE VERSIONES EN NUBE</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside font-sans">
                <li>OneDrive / SharePoint versioning.</li>
                <li>Inmune a comandos TRIM locales y formateos locales.</li>
                <li>Permite restaurar versiones anteriores directamente desde el navegador web.</li>
                <li>Posee su propia papelera de reciclaje independiente en la nube por 30 días.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
