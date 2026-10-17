import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  HardDrive,
  Layers,
  Activity,
  Cpu,
  Database,
  FileSearch,
} from 'lucide-react';

interface Tomo02Sector14MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector14MissionView: React.FC<Tomo02Sector14MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'WINFR_REGULAR' | 'WINFR_EXTENSIVE' | 'VSS_SHADOWS' | 'TRIM_QUERY' | 'MFT_RECORD_SCAN' | 'FSUTIL_USN'
  >('WINFR_REGULAR');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'winfr C: D:\\Recovery /regular /n *.docx',
    targetComponent: 'Windows File Recovery Engine (winfr.exe)',
    data: `Windows File Recovery
Versión 0.4.12431
Directorio de origen: C:
Carpeta de destino: D:\\Recovery\\Recovery_20261014_052010
Modo de operación: Regular (Análisis MFT Index Scan)
Filtros aplicados: *.docx

[+] Escaneando Master File Table ($MFT)...
[+] 1,489,203 registros MFT analizados.
[+] Registros con flag 0x00 (Deleted) encontrados: 1,842
[+] Coincidencias de extensión *.docx: 3

Archivos recuperados exitosamente:
1. Contrato_Auditoria_EVO.docx [184 KB] -> Status: 100% Íntegro
2. Informe_Pericial_NTFS.docx  [512 KB] -> Status: 100% Íntegro
3. Minuta_Reunion_Octubre.docx [42 KB]  -> Status: 100% Íntegro

Operación finalizada. 3 archivos salvados en D:\\Recovery`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (
    mod: 'WINFR_REGULAR' | 'WINFR_EXTENSIVE' | 'VSS_SHADOWS' | 'TRIM_QUERY' | 'MFT_RECORD_SCAN' | 'FSUTIL_USN'
  ) => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'WINFR_REGULAR') {
      cmd = 'winfr C: D:\\Recovery /regular /n *.docx';
      target = 'Windows File Recovery Engine (winfr.exe)';
      resData = `Windows File Recovery
Versión 0.4.12431
Directorio de origen: C:
Carpeta de destino: D:\\Recovery\\Recovery_20261014_052010
Modo de operación: Regular (Análisis MFT Index Scan)
Filtros aplicados: *.docx

[+] Escaneando Master File Table ($MFT)...
[+] 1,489,203 registros MFT analizados.
[+] Registros con flag 0x00 (Deleted) encontrados: 1,842
[+] Coincidencias de extensión *.docx: 3

Archivos recuperados exitosamente:
1. Contrato_Auditoria_EVO.docx [184 KB] -> Status: 100% Íntegro
2. Informe_Pericial_NTFS.docx  [512 KB] -> Status: 100% Íntegro
3. Minuta_Reunion_Octubre.docx [42 KB]  -> Status: 100% Íntegro

Operación finalizada. 3 archivos salvados en D:\\Recovery`;
    } else if (mod === 'WINFR_EXTENSIVE') {
      cmd = 'winfr E: D:\\RecoveryExt /extensive /n *.jpg';
      target = 'Signature File Carving Engine';
      resData = `Windows File Recovery
Modo de operación: Extensive (File Carving sin MFT)
Unidad analizada: E: (Partición FAT32 corrupta / formateada)
Firmas buscadas: 0xFFD8FFE0 (JPEG)

[+] Leyendo clusters contiguos bloque por bloque...
[+] LBA 0x004F2100: Cabecera SOI (Start of Image) detectada
[+] LBA 0x004F28A0: Marcador EOI (End of Image 0xFFD9) detectado. Tamaño: 3.8 MB
[+] LBA 0x011A4000: Cabecera SOI detectada. Tamaño: 2.1 MB
[+] Reensamblaje completado: 14 imágenes extraídas por carving.`;
    } else if (mod === 'VSS_SHADOWS') {
      cmd = 'vssadmin list shadows /for=C:';
      target = 'Volume Shadow Copy Service (VSS.exe)';
      resData = `vssadmin 1.1 - Herramienta de línea de comandos de administración de Volume Shadow Copy
(C) Copyright 2001-2026 Microsoft Corp.

Contenido del conjunto de instantáneas id.: {4b12a819-21e1-4820-9171-88f62c019a11}
   Contiene 1 instantáneas en el momento de creación: 13/10/2026 21:00:15
     Id. de instantánea: {f8194a2b-9801-4972-bb21-729910aef012}
     Volumen de origen: \\\\?\\Volume{c10928f1-0000-0000-0000-100000000000}\\ (C:)
     Volumen de instantánea: \\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy3
     Equipo originario: EVO-LAB-STATION
     Equipo de servicio: EVO-LAB-STATION
     Proveedor: "Microsoft Software Shadow Copy provider 1.0"
     Atributos: Persistente, Con reconocimiento de cliente, Sin escritores`;
    } else if (mod === 'TRIM_QUERY') {
      cmd = 'fsutil behavior query DisableDeleteNotify';
      target = 'NTFS Driver & Storage Subsystem';
      resData = `Consulta de directiva del controlador de almacenamiento NTFS:
DisableDeleteNotify = 0  (El envío de TRIM a SSDs está HABILITADO)

Explicación del valor:
0 = Las notificaciones de desasignación TRIM/Deallocate se transmiten al SSD.
1 = TRIM desactivado a nivel de sistema operativo.

Impacto forense directo:
Los clusters liberados por borrado de archivos son comunicados al controlador SSD.
La sobreescritura interna o retorno de ceros ocurre de forma inminente por Garbage Collection.`;
    } else if (mod === 'MFT_RECORD_SCAN') {
      cmd = 'Get-ChildItem -Path C:\\$Recycle.Bin -Force -Recurse';
      target = 'PowerShell Forensic Parser';
      resData = `Directorio: C:\\$Recycle.Bin\\S-1-5-21-3982104921-201948192-1001

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a-h-         14/10/2026     03:15            544 $I91K2LM.docx  (Metadatos: C:\\Docs\\Informe.docx)
-a-h-         14/10/2026     03:15         184320 $R91K2LM.docx  (Payload real intacto)
-a-h-         13/10/2026     18:22            544 $I82XP01.pdf   (Metadatos: C:\\Users\\EVO\\Plano.pdf)
-a-h-         13/10/2026     18:22        4194304 $R82XP01.pdf   (Payload real intacto)

Estructura pericial:
El archivo $I almacena el tamaño original (8 bytes) y la ruta absoluta (520 bytes).
El archivo $R almacena el contenido binario sin alterar.`;
    } else {
      cmd = 'fsutil usn readjournal C: csv | Select-Object -First 5';
      target = 'USN Change Journal Engine';
      resData = `Usn,FileRefNumber,ParentFileRefNumber,Reason,Time,FileName
1048576,0x00010000000021A4,0x0002000000000005,0x80000200 (FILE_DELETE),14/10/2026 05:12:01,"Factura_Q3.pdf"
1048640,0x00010000000021A5,0x0002000000000005,0x00000002 (DATA_OVERWRITE),14/10/2026 05:14:22,"BaseDatos.db"
1048704,0x00010000000021A6,0x0002000000000005,0x00002000 (RENAME_NEW_NAME),14/10/2026 05:18:40,"Backup_Final.zip"`;
    }

    setConsoleOutput({
      query: cmd,
      targetComponent: target,
      data: resData,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(consoleOutput.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-200 py-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Temario Principal</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-mono text-[10px] font-bold">
              LABORATORIO PERICIAL 14
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              DATA RECOVERY SIMULATOR & AUDITORÍA FORENSE MFT
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Entorno interactivo de simulación para rescate pericial con winfr, vssadmin, fsutil y disección $Recycle.Bin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Picker */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 block font-bold">
            Protocolos de Rescate Forense
          </span>

          <button
            onClick={() => handleSelectModule('WINFR_REGULAR')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'WINFR_REGULAR'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">WINFR // REGULAR</span>
              <FileSearch className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Escaneo de Índice MFT Rápido</span>
            <span className="text-[11px] text-slate-400">Recuperación de punteros $DATA en discos no sobreescritos</span>
          </button>

          <button
            onClick={() => handleSelectModule('WINFR_EXTENSIVE')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'WINFR_EXTENSIVE'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">WINFR // EXTENSIVE</span>
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Carving por Firmas Binarias</span>
            <span className="text-[11px] text-slate-400">Búsqueda de cabeceras de archivos cuando la MFT fue dañada</span>
          </button>

          <button
            onClick={() => handleSelectModule('VSS_SHADOWS')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'VSS_SHADOWS'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">VSSADMIN // SHADOWS</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Auditoría de Instantáneas VSS</span>
            <span className="text-[11px] text-slate-400">Inspección de puntos de congelamiento CoW de volumen</span>
          </button>

          <button
            onClick={() => handleSelectModule('TRIM_QUERY')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'TRIM_QUERY'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">FSUTIL // TRIM CHECK</span>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Telemetría de TRIM / Deallocate</span>
            <span className="text-[11px] text-slate-400">Estado de notificación al subsistema NVMe/SATA</span>
          </button>

          <button
            onClick={() => handleSelectModule('MFT_RECORD_SCAN')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'MFT_RECORD_SCAN'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">RECYCLE.BIN // PERITAJE</span>
              <HardDrive className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Disección de Archivos $I y $R</span>
            <span className="text-[11px] text-slate-400">Extracción de payload y metadatos forenses SID</span>
          </button>

          <button
            onClick={() => handleSelectModule('FSUTIL_USN')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'FSUTIL_USN'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">USN JOURNAL // HISTÓRICO</span>
              <Database className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Diario de Cambios NTFS (USN)</span>
            <span className="text-[11px] text-slate-400">Trazabilidad de eventos de borrado y sobreescritura</span>
          </button>
        </div>

        {/* Live Simulator Console */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Top Bar */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 ml-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Consola Pericial // {consoleOutput.targetComponent}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCmd}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar Comando</span>
                </button>
              </div>
            </div>

            {/* Terminal Command Line */}
            <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 font-mono text-xs flex items-center gap-2 text-cyan-300">
              <span className="text-emerald-400">PS C:\WINDOWS\system32&gt;</span>
              <span className="text-slate-100 font-bold">{consoleOutput.query}</span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[320px] max-h-[460px] whitespace-pre selection:bg-cyan-500 selection:text-slate-900">
              {consoleOutput.data}
            </div>

            {/* Terminal Footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Timestamp: {consoleOutput.timestamp}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Salida de Consola Canónica Verificada
              </span>
            </div>
          </div>

          {/* Operational Safety Warning */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-mono block">REGLA DE ORO DE EVOLABS EN RECUPERACIÓN:</strong>
              Nunca guardes los archivos recuperados en la misma unidad que estás escaneando. Esto garantiza que no se sobreescriban los clusters aún pendientes de recuperación.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
