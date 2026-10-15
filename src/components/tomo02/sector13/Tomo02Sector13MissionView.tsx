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
  Layers,
  Activity,
  Cpu,
} from 'lucide-react';

interface Tomo02Sector13MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector13MissionView: React.FC<Tomo02Sector13MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'DISM_WIM_INFO' | 'REAGENTC_STATUS' | 'VSS_WRITERS' | 'EXPORT_DRIVERS' | 'OOBE_BYPASSNRO' | 'SRTTRAIL_LOG'
  >('DISM_WIM_INFO');
  const [cliCommand, setCliCommand] = useState<string>('dism /Get-WimInfo /WimFile:D:\\sources\\install.wim');
  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetStage: string;
    data: string;
    timestamp: string;
  }>({
    query: 'dism /Get-WimInfo /WimFile:D:\\sources\\install.wim',
    targetStage: 'Windows Image Servicing (DISM Engine)',
    data: `Herramienta de administración y mantenimiento de imágenes de implementación
Versión: 10.0.22621.1

Detalles para la imagen : D:\\sources\\install.wim

Índice: 1 -> Nombre: Windows 11 Home
Índice: 2 -> Nombre: Windows 11 Home N
Índice: 3 -> Nombre: Windows 11 Home Single Language
Índice: 4 -> Nombre: Windows 11 Education
Índice: 5 -> Nombre: Windows 11 Education N
Índice: 6 -> Nombre: Windows 11 Pro [Selección Canónica EVO]
Índice: 7 -> Nombre: Windows 11 Pro N

La operación se completó correctamente.`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (
    mod: 'DISM_WIM_INFO' | 'REAGENTC_STATUS' | 'VSS_WRITERS' | 'EXPORT_DRIVERS' | 'OOBE_BYPASSNRO' | 'SRTTRAIL_LOG'
  ) => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'DISM_WIM_INFO') {
      cmd = 'dism /Get-WimInfo /WimFile:D:\\sources\\install.wim';
      target = 'Windows Image Servicing (DISM Engine)';
      resData = `Herramienta de administración y mantenimiento de imágenes de implementación
Versión: 10.0.22621.1

Detalles para la imagen : D:\\sources\\install.wim

Índice: 1 -> Nombre: Windows 11 Home
Índice: 2 -> Nombre: Windows 11 Home N
Índice: 3 -> Nombre: Windows 11 Home Single Language
Índice: 4 -> Nombre: Windows 11 Education
Índice: 5 -> Nombre: Windows 11 Education N
Índice: 6 -> Nombre: Windows 11 Pro [Selección Canónica EVO]
Índice: 7 -> Nombre: Windows 11 Pro N

La operación se completó correctamente.`;
    } else if (mod === 'REAGENTC_STATUS') {
      cmd = 'reagentc /info';
      target = 'Windows Recovery Agent (ReAgent.xml)';
      resData = `Información de configuración del Entorno de recuperación de Windows (WinRE)
y de restablecimiento del sistema:

    Estado de WinRE:                        Enabled
    Ubicación de WinRE:                     \\\\?\\GLOBALROOT\\device\\harddisk0\\partition4\\Recovery\\WindowsRE
    Identificador de datos de BCD:          {b51f0430-681b-11ee-8e3d-f875a40954e6}
    Ubicación de imagen personalizada:      
    Índice de imagen personalizada:         0
    Ubicación de la imagen de recuperación: 
    Índice de la imagen de recuperación:    0

REAGENTC.EXE: operación correcta.`;
    } else if (mod === 'VSS_WRITERS') {
      cmd = 'vssadmin list writers';
      target = 'Volume Shadow Copy Service Coordinator';
      resData = `vssadmin 1.1 - Herramienta de línea de comandos de administración de VSS
(C) Microsoft Corporation. Todos los derechos reservados.

Nombre del escritor: 'System Writer'
   Id. de escritor: {e81069a3-c242-470f-80aa-410471768e80}
   Estado: [1] Estable
   Último error: No hay errores.

Nombre del escritor: 'Registry Writer'
   Id. de escritor: {afbab4a2-367d-4d15-a586-71dbb18f8485}
   Estado: [1] Estable
   Último error: No hay errores.`;
    } else if (mod === 'EXPORT_DRIVERS') {
      cmd = 'dism /online /export-driver /destination:D:\\DriversBackup';
      target = 'Driver Store Repository (FileRepository)';
      resData = `Exportando 1 de 42 - oem12.inf: Controlador de chipset Intel SPI/PCIe
Exportando 2 de 42 - oem15.inf: Controlador de audio Realtek High Definition
Exportando 3 de 42 - oem24.inf: Adaptador Ethernet Intel I225-V Gigabit
Exportando 4 de 42 - oem31.inf: Tarjeta inalámbrica Intel Wi-Fi 6E AX210
...
La operación de exportación de controladores se completó correctamente.`;
    } else if (mod === 'OOBE_BYPASSNRO') {
      cmd = 'oobe\\bypassnro';
      target = 'Out-of-Box Experience Provisioning Service';
      resData = `Ejecutando C:\\Windows\\System32\\oobe\\BypassNRO.cmd...
Escribiendo en Registro: HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\OOBE\\BypassNRO = 0x1 (DWORD)
Reiniciando subsistema NetworkSetupSvc...
Reiniciando OOBE...
[ESTADO: Opción "No tengo internet" ahora visible en pantalla de bienvenida]`;
    } else if (mod === 'SRTTRAIL_LOG') {
      cmd = 'type C:\\Windows\\System32\\LogFiles\\Srt\\SrtTrail.txt';
      target = 'Startup Repair Engine (StartRep.exe)';
      resData = `Registro de diagnóstico y reparación de inicio de Windows
Número de intentos de reparación: 1

Sesión de análisis:
---------------------------
Comprobación de metadatos de partición: Correcto. Código de error = 0x0
Prueba de archivos de sistema: Correcto. Código de error = 0x0
Prueba de BCD Store: Correcto. Código de error = 0x0
Análisis de controladores boot-start:
  Archivo detectado: C:\\Windows\\System32\\drivers\\bad_driver.sys
  Causa principal encontrada: Controlador crítico no firmado o dañado.
  Acción de reparación: Desvinculación de controlador completada.`;
    }

    setCliCommand(cmd);
    setConsoleOutput({
      query: cmd,
      targetStage: target,
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
            <span>Volver a las Investigaciones del Sector 13</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <RotateCcw className="w-4 h-4" />
            <span>Laboratorio Práctico // Sector 13</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            WINDOWS INSTALLATION & RECOVERY SIMULATOR
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulador de comandos para inspección de imágenes WIM, agentes WinRE, escritores VSS y bypass de red OOBE
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <button
          onClick={() => handleSelectModule('DISM_WIM_INFO')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'DISM_WIM_INFO'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">01. WIM INFO</div>
          <div className="text-[10px] text-slate-500">dism /Get-WimInfo</div>
        </button>

        <button
          onClick={() => handleSelectModule('REAGENTC_STATUS')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'REAGENTC_STATUS'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">02. WINRE</div>
          <div className="text-[10px] text-slate-500">reagentc /info</div>
        </button>

        <button
          onClick={() => handleSelectModule('VSS_WRITERS')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'VSS_WRITERS'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">03. VSS</div>
          <div className="text-[10px] text-slate-500">vssadmin writers</div>
        </button>

        <button
          onClick={() => handleSelectModule('EXPORT_DRIVERS')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'EXPORT_DRIVERS'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">04. DRIVERS</div>
          <div className="text-[10px] text-slate-500">export-driver</div>
        </button>

        <button
          onClick={() => handleSelectModule('OOBE_BYPASSNRO')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'OOBE_BYPASSNRO'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">05. BYPASSNRO</div>
          <div className="text-[10px] text-slate-500">oobe\bypassnro</div>
        </button>

        <button
          onClick={() => handleSelectModule('SRTTRAIL_LOG')}
          className={`p-3 rounded-xl border text-xs font-mono transition-all text-left cursor-pointer ${
            activeModule === 'SRTTRAIL_LOG'
              ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-md'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="font-bold">06. SRTTRAIL</div>
          <div className="text-[10px] text-slate-500">SrtTrail.txt</div>
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 ml-2 font-bold">
              SETUP & RECOVERY SIMULATION CONSOLE // SECTOR 13
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
            Fase: <span className="text-slate-300">{consoleOutput.targetStage}</span>
          </div>
        </div>

        <div className="p-5 space-y-3 bg-[#030712] min-h-[220px]">
          <div className="text-slate-500 text-[11px]">
            [{consoleOutput.timestamp}] Dispatching SetupHost / Recovery Agent Request:
          </div>
          <pre className="text-emerald-400/90 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
            {consoleOutput.data}
          </pre>
        </div>

        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulador de despliegue y rescate sin alteración de host.</span>
          </div>
          <span className="font-bold text-slate-500">EVO LABS CORE v4.13</span>
        </div>
      </div>
    </div>
  );
};
