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
  RefreshCw,
  FolderTree,
  Activity,
  Layers,
  Shield,
  HardDrive,
} from 'lucide-react';

interface Tomo02Sector20MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector20MissionView: React.FC<Tomo02Sector20MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'RESET_SOFTDIST' | 'DISM_WINSXS' | 'CERTUTIL_HRESULT' | 'BLOCK_DRIVERS'
  >('RESET_SOFTDIST');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'net stop wuauserv && ren %windir%\\SoftwareDistribution SoftwareDistribution.old && net start wuauserv',
    targetComponent: 'Windows Update Service & Download Cache',
    data: `[+] Deteniendo servicio Windows Update (wuauserv)...
    El servicio de Windows Update se detuvo correctamente.
    [+] Renombrando almacén corrupto: C:\\Windows\\SoftwareDistribution -> SoftwareDistribution.old
    [+] Liberando base de datos ESE DataStore.edb...
    [+] Iniciando servicio Windows Update (wuauserv)...
    El servicio de Windows Update se inició correctamente.
    [OK] Carpeta de caché recreada limpia. Descargas trabadas resueltas.`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const handleRunCommand = (type: 'RESET_SOFTDIST' | 'DISM_WINSXS' | 'CERTUTIL_HRESULT' | 'BLOCK_DRIVERS') => {
    setActiveModule(type);
    const ts = new Date().toLocaleTimeString();

    if (type === 'RESET_SOFTDIST') {
      setConsoleOutput({
        query: 'net stop wuauserv & net stop bits & ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old & net start wuauserv',
        targetComponent: 'Windows Update Agent Cache Purgatory',
        data: `[+] Deteniendo wuauserv y BITS...
        [+] Purgando 4.2 GB de descargas parciales corruptas en SoftwareDistribution\\Download.
        [+] Recreando base de datos de índices DataStore.edb limpia.
        [+] Reiniciando servicios de actualización.
        [OK] Pipeline de descargas desbloqueado al 100%.`,
        timestamp: ts,
      });
    } else if (type === 'DISM_WINSXS') {
      setConsoleOutput({
        query: 'dism /online /cleanup-image /analyzecomponentstore && dism /online /cleanup-image /startcomponentcleanup',
        targetComponent: 'Component Store (C:\\Windows\\WinSxS)',
        data: `[+] Herramienta Administración y mantenimiento de imágenes de implementación (DISM)
        Versión: 10.0.22621.1
        [+] Tamaño del almacén de componentes reportado por el explorador: 18.42 GB
        [+] Tamaño real del almacén de componentes (restando Hard Links): 7.15 GB
        [+] Componentes obsoletos y paquetes reemplazados: 1.84 GB
        [+] Ejecutando /startcomponentcleanup...
        [OK] 1.84 GB de copias de seguridad de parches antiguos purgados exitosamente.`,
        timestamp: ts,
      });
    } else if (type === 'CERTUTIL_HRESULT') {
      setConsoleOutput({
        query: 'certutil -error 0x800f081f && certutil -error 0x80070002',
        targetComponent: 'Kernel HRESULT Error Translation Engine',
        data: `[+] Decodificando 0x800f081f:
        0x800f081f (CBS: -2146498529) -- 2146498529 (0x800f081f)
        Mensaje de error: CBS_E_SOURCE_MISSING (No se encontró el origen del paquete o archivo de manifiesto base).
        Causa: Componente faltante en WinSxS requerido para calcular el delta diferencial.
        Solución: DISM /Online /Cleanup-Image /RestoreHealth.

        [+] Decodificando 0x80070002:
        0x80070002 (WIN32: 2) -- 2 (0x2)
        Mensaje de error: ERROR_FILE_NOT_FOUND (El sistema no puede encontrar el archivo especificado).
        Causa: Archivo CAB corrupto en SoftwareDistribution.`,
        timestamp: ts,
      });
    } else if (type === 'BLOCK_DRIVERS') {
      setConsoleOutput({
        query: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f',
        targetComponent: 'Group Policy Windows Update Quality Channel',
        data: `[+] Estableciendo directiva de exclusión de controladores:
        Clave: HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate
        Valor: ExcludeWUDriversInQualityUpdate = 0x00000001 (Activado)
        [+] Windows Update tiene ahora terminantemente prohibido descargar drivers de GPU, audio o chipset.
        [OK] Tu controlador del fabricante no volverá a ser sobreescrito por versiones genéricas.`,
        timestamp: ts,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-zinc-100 font-sans pb-16">
      <header className="sticky top-0 z-30 bg-[#080B10]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={onBackToReader}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VOLVER A LA TEORÍA</span>
          </button>
          <div className="flex items-center gap-2 font-mono text-xs">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-300 font-bold">LAB // WINDOWS SERVICING &amp; CBS</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-6">
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-2">
          <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Laboratorio Interactivo de Servicing</div>
          <h2 className="text-2xl font-bold text-white">Consola de Mantenimiento y Forense de Windows Update</h2>
          <p className="text-xs text-zinc-400">
            Purga cachés corruptos de SoftwareDistribution, audita el almacén canónico WinSxS con DISM, traduce errores HRESULT con certutil y bloquea la sobreescritura de drivers por registro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <button
              onClick={() => handleRunCommand('RESET_SOFTDIST')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'RESET_SOFTDIST'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">1. Reset SoftwareDistribution</div>
              <div className="text-[11px] text-zinc-400">Destrabar descargas al 0% o 99%.</div>
            </button>

            <button
              onClick={() => handleRunCommand('DISM_WINSXS')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'DISM_WINSXS'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">2. Limpieza WinSxS con DISM</div>
              <div className="text-[11px] text-zinc-400">Purgar paquetes obsoletos de componentes.</div>
            </button>

            <button
              onClick={() => handleRunCommand('CERTUTIL_HRESULT')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'CERTUTIL_HRESULT'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">3. Decodificador HRESULT</div>
              <div className="text-[11px] text-zinc-400">Traducir 0x800f081f y 0x80070002.</div>
            </button>

            <button
              onClick={() => handleRunCommand('BLOCK_DRIVERS')}
              className={`w-full text-left p-4 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                activeModule === 'BLOCK_DRIVERS'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
              }`}
            >
              <div className="font-bold text-cyan-300 mb-1">4. Bloquear Drivers en Update</div>
              <div className="text-[11px] text-zinc-400">Evitar que Windows pise tu driver GPU.</div>
            </button>
          </div>

          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>TERMINAL FORENSE DE SALIDA // {consoleOutput.targetComponent}</span>
              </div>
              <span>{consoleOutput.timestamp}</span>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase">Comando ejecutado:</span>
              <div className="p-2.5 bg-zinc-900 rounded-lg text-cyan-300 font-bold border border-zinc-800">
                &gt; {consoleOutput.query}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase">Salida del Servicing Stack:</span>
              <pre className="p-4 bg-zinc-900/60 rounded-xl text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-zinc-800/80">
                {consoleOutput.data}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
