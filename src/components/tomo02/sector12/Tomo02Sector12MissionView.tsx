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
} from 'lucide-react';

interface Tomo02Sector12MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector12MissionView: React.FC<Tomo02Sector12MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'DISKPART_LIST' | 'PARTITION_TABLE' | 'VOLUME_MAPPING' | 'SHRINK_QUERYMAX' | 'FSUTIL_TRIM' | 'SMART_COUNTERS'
  >('DISKPART_LIST');
  const [cliCommand, setCliCommand] = useState<string>('diskpart /s list_disks.txt');
  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'diskpart -> list disk',
    targetComponent: 'Disk Management Engine (vds.exe)',
    data: `Microsoft DiskPart versión 10.0.22621.1

  Núm Disco  Estado      Tam.     Libre    Din.  Gpt
  ---------- ----------  -------  -------  ---   ---
* Disco 0    En línea    953 GB   1024 KB         *
  Disco 1    En línea     58 GB     0 B           *`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (
    mod: 'DISKPART_LIST' | 'PARTITION_TABLE' | 'VOLUME_MAPPING' | 'SHRINK_QUERYMAX' | 'FSUTIL_TRIM' | 'SMART_COUNTERS'
  ) => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'DISKPART_LIST') {
      cmd = 'diskpart -> list disk';
      target = 'Disk Management Engine (vds.exe)';
      resData = `Microsoft DiskPart versión 10.0.22621.1

  Núm Disco  Estado      Tam.     Libre    Din.  Gpt
  ---------- ----------  -------  -------  ---   ---
* Disco 0    En línea    953 GB   1024 KB         *
  Disco 1    En línea     58 GB     0 B           *`;
    } else if (mod === 'PARTITION_TABLE') {
      cmd = 'diskpart -> select disk 0 -> list partition';
      target = 'Disk 0 (GPT Header LBA 1)';
      resData = `Partición ###  Tipo              Tamaño   Desplazamiento
-------------  ----------------  -------  --------------
Partición 1    Sistema (EFI)      100 MB  1024 KB
Partición 2    Reservado (MSR)     16 MB   101 MB
Partición 3    Principal (C:)     952 GB   117 MB
Partición 4    Recuperación       650 MB   952 GB`;
    } else if (mod === 'VOLUME_MAPPING') {
      cmd = 'diskpart -> list volume';
      target = 'Mount Manager (\\GLOBAL??\\Volume)';
      resData = `Núm Vol  Ltr  Etiqueta     Fs     Tipo        Tamaño   Estado     Info
-------  ---  -----------  -----  ----------  -------  ---------  --------
Volumen 0   C   Windows      NTFS   Partición    952 GB  Correcto   Arranque
Volumen 1       SYSTEM       FAT32  Partición    100 MB  Correcto   Sistema
Volumen 2       Recovery     NTFS   Partición    650 MB  Correcto   Oculto
Volumen 3   D   EXT_BACKUP   exFAT  Extraíble     58 GB  Correcto`;
    } else if (mod === 'SHRINK_QUERYMAX') {
      cmd = 'diskpart -> select volume C -> shrink querymax';
      target = 'NTFS Unmovable Files Allocator';
      resData = `El número máximo de bytes que se puede reducir es: 148520 MB (145 GB)
[Diagnóstico: Paginación activa (pagefile.sys) y System Volume Info bloquean LBA posterior]`;
    } else if (mod === 'FSUTIL_TRIM') {
      cmd = 'fsutil behavior query DisableDeleteNotify';
      target = 'Kernel Storage Controller (storport.sys)';
      resData = `NTFS DisableDeleteNotify = 0  (Las notificaciones TRIM están HABILITADAS)
ReFS DisableDeleteNotify = 0  (Las notificaciones TRIM están HABILITADAS)`;
    } else if (mod === 'SMART_COUNTERS') {
      cmd = 'Get-PhysicalDisk | Get-StorageReliabilityCounter';
      target = 'Firmware SMART Telemetry (NVMe Controller)';
      resData = `DeviceId              : 0
Temperature           : 38 °C
Wear                  : 3 % (97% de vida útil restante de celdas NAND)
ReadErrorsTotal       : 0
WriteErrorsTotal      : 0
PowerOnHours          : 1420
FlushLatencyMax       : 2 ms`;
    }

    setCliCommand(cmd);
    setConsoleOutput({
      query: cmd,
      targetComponent: target,
      data: resData,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-200 py-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a las Investigaciones del Sector 12</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <HardDrive className="w-4 h-4" />
            <span>Laboratorio Práctico // Sector 12</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            VIRTUAL DISK LAB & DISKPART LOW-LEVEL SANDBOX
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulador de comandos de bajo nivel para topologías LBA, GPT, contracción de volúmenes y telemetría SMART
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <button
          onClick={() => handleSelectModule('DISKPART_LIST')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'DISKPART_LIST'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">01. DISKS</div>
          <div className="text-[10px] text-slate-500">list disk</div>
        </button>

        <button
          onClick={() => handleSelectModule('PARTITION_TABLE')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'PARTITION_TABLE'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">02. PARTITIONS</div>
          <div className="text-[10px] text-slate-500">list partition</div>
        </button>

        <button
          onClick={() => handleSelectModule('VOLUME_MAPPING')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'VOLUME_MAPPING'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">03. VOLUMES</div>
          <div className="text-[10px] text-slate-500">list volume</div>
        </button>

        <button
          onClick={() => handleSelectModule('SHRINK_QUERYMAX')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'SHRINK_QUERYMAX'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">04. SHRINK</div>
          <div className="text-[10px] text-slate-500">shrink querymax</div>
        </button>

        <button
          onClick={() => handleSelectModule('FSUTIL_TRIM')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'FSUTIL_TRIM'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">05. TRIM</div>
          <div className="text-[10px] text-slate-500">fsutil TRIM status</div>
        </button>

        <button
          onClick={() => handleSelectModule('SMART_COUNTERS')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'SMART_COUNTERS'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">06. SMART</div>
          <div className="text-[10px] text-slate-500">Wear & Sectors</div>
        </button>
      </div>

      {/* Terminal Sandbox Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 ml-2 font-bold">
              DISKPART & STORAGE TELEMETRY CONSOLE // SECTOR 12
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar Comando'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2 text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span className="text-slate-200 font-bold">{cliCommand}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Destino: <span className="text-slate-300">{consoleOutput.targetComponent}</span>
          </div>
        </div>

        <div className="p-5 space-y-3 bg-[#030712] min-h-[220px]">
          <div className="text-slate-500 text-[11px]">
            [{consoleOutput.timestamp}] Subsystem IOCTL DISK Dispatcher:
          </div>
          <pre className="text-emerald-400/90 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
            {consoleOutput.data}
          </pre>
        </div>

        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulador nativo en memoria de solo lectura. Entorno no destructivo.</span>
          </div>
          <span className="font-bold text-slate-500">EVO LABS CORE v4.12</span>
        </div>
      </div>
    </div>
  );
};
