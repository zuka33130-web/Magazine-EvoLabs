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
  Printer,
  Usb,
  Bluetooth,
  Sliders,
  Activity,
  Layers,
} from 'lucide-react';

interface Tomo02Sector16MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector16MissionView: React.FC<Tomo02Sector16MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'SPOOLER_CLEANUP' | 'PRINT_ISOLATION' | 'USB_DESCRIPTOR_RESET' | 'SELECTIVE_SUSPEND_OFF' | 'BTH_STACK_RESET' | 'PRINTUI_DRIVER_CLEAN'
  >('SPOOLER_CLEANUP');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'net stop spooler && del /Q /F C:\\Windows\\System32\\spool\\PRINTERS\\* && net start spooler',
    targetComponent: 'Print Spooler Subsystem (spoolsv.exe)',
    data: `El servicio de Cola de impresión se está deteniendo.
El servicio de Cola de impresión se detuvo correctamente.

[+] Purgando directorio de spool: C:\\Windows\\System32\\spool\\PRINTERS
[+] Eliminado: 00014.SHD (Metadatos de trabajo huérfano)
[+] Eliminado: 00014.SPL (Rasterizado binario bloqueado - 48.2 MB)
[+] Eliminado: 00015.SHD
[+] Eliminado: 00015.SPL
Archivos purgados: 4 archivos temporales eliminados.

El servicio de Cola de impresión se está iniciando.
El servicio de Cola de impresión se inició correctamente.

Estado de colas: 0 trabajos pendientes. Deadlock resuelto al 100%.`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (
    mod: 'SPOOLER_CLEANUP' | 'PRINT_ISOLATION' | 'USB_DESCRIPTOR_RESET' | 'SELECTIVE_SUSPEND_OFF' | 'BTH_STACK_RESET' | 'PRINTUI_DRIVER_CLEAN'
  ) => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'SPOOLER_CLEANUP') {
      cmd = 'net stop spooler && del /Q /F C:\\Windows\\System32\\spool\\PRINTERS\\* && net start spooler';
      target = 'Print Spooler Subsystem (spoolsv.exe)';
      resData = `El servicio de Cola de impresión se está deteniendo.
El servicio de Cola de impresión se detuvo correctamente.

[+] Purgando directorio de spool: C:\\Windows\\System32\\spool\\PRINTERS
[+] Eliminado: 00014.SHD (Metadatos de trabajo huérfano)
[+] Eliminado: 00014.SPL (Rasterizado binario bloqueado - 48.2 MB)
[+] Eliminado: 00015.SHD
[+] Eliminado: 00015.SPL
Archivos purgados: 4 archivos temporales eliminados.

El servicio de Cola de impresión se está iniciando.
El servicio de Cola de impresión se inició correctamente.

Estado de colas: 0 trabajos pendientes. Deadlock resuelto al 100%.`;
    } else if (mod === 'PRINT_ISOLATION') {
      cmd = 'Get-PrinterDriver | Select-Object Name, MajorVersion, PrinterDriverAttributes';
      target = 'User-Mode Driver Framework & Print Isolation';
      resData = `Name                                  MajorVersion PrinterDriverAttributes
----                                  ------------ ----------------------
Microsoft Print to PDF                           4 PackageAware, Isolated
Microsoft XPS Document Writer v4                 4 PackageAware, Isolated
HP LaserJet Pro MFP M428f-M429f PCL-6            3 InProcess (Riesgo Spooler)
Brother HL-L2350DW series                        4 PackageAware, Isolated

Análisis pericial:
El driver HP (v3) corre en InProcess dentro de spoolsv.exe.
Recomendación EVO Labs: Ejecutar Set-PrinterDriver -Name "HP..." -PrinterDriverAttributes Isolated`;
    } else if (mod === 'USB_DESCRIPTOR_RESET') {
      cmd = 'pnputil /restart-device "USB\\ROOT_HUB30\\4&1f2e3d4c&0&0"';
      target = 'USB 3.0 xHCI Controller Driver';
      resData = `Microsoft PnP Utility

Reiniciando dispositivo...
Dispositivo: USB\\ROOT_HUB30\\4&1f2e3d4c&0&0 (Concentrador raíz USB xHCI)

[+] Enviando comando de apagado de puerto (Port Power Off)...
[+] Ráfaga de Reset eléctrico (SE0) despachada a transceptores.
[+] Re-enumeración de puertos completada exitosamente.
El dispositivo se reinició correctamente. Todos los descriptores USB refrescados.`;
    } else if (mod === 'SELECTIVE_SUSPEND_OFF') {
      cmd = 'powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-86ee-b6bf43ed296c 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0 && powercfg /SETACTIVE SCHEME_CURRENT';
      target = 'ACPI & Power Subsystem Coordinator';
      resData = `Directiva de energía USB actualizada:
Subgrupo: Configuración de USB (2a737441-1930-4402-86ee-b6bf43ed296c)
Parámetro: Suspensión selectiva de USB (48e6b7a6-50f5-4782-a5d4-53bb8f07e226)
Valor CA (Corriente alterna): 0 (DESHABILITADO)

Impacto de Metrología:
- Los transceptores USB permanecerán de forma continua en estado D0 (Fully Active).
- Latencia de reactivación Resume K-state eliminada (0 ms).
- Chasquidos en DACs de audio y microcongelamiento de periféricos HID resueltos.`;
    } else if (mod === 'BTH_STACK_RESET') {
      cmd = 'Stop-Service bthserv -Force; Start-Service bthserv';
      target = 'Bluetooth Support Service (bthserv / bthport.sys)';
      resData = `Servicio de soporte técnico de Bluetooth:
[+] Deteniendo servicio bthserv...
[+] Liberando sockets RFCOMM y perfiles de audio A2DP.
[+] Iniciando servicio bthserv...
Estado: Running (En ejecución)
Tipo de inicio: Automático (Automatic)

La pila de radio HCI ha reinicializado la detección de dispositivos vinculados.`;
    } else {
      cmd = 'rundll32 printui.dll,PrintUIEntry /s /t2';
      target = 'Print Management Server UI';
      resData = `Invocando consola de Propiedades del Servidor de Impresión:
DLL: printui.dll
Punto de entrada: PrintUIEntry
Argumentos: /s (Server Properties) /t2 (Tab: Controladores)

Consola abierta en pantalla.
Permite auditar, actualizar o remover paquetes de controladores sin tocar el registro a mano.`;
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
              LABORATORIO PERICIAL 16
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              PERIPHERAL &amp; SPOOLER TRIAGE CONSOLE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Entorno interactivo para resolución de deadlocks de impresión, reset de bus USB y auditoría de energía
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Picker */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 block font-bold">
            Protocolos de Rescate de Periféricos
          </span>

          <button
            onClick={() => handleSelectModule('SPOOLER_CLEANUP')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'SPOOLER_CLEANUP'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">SPOOLER // FLUSH</span>
              <Printer className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Destrabe Trifásico de Cola</span>
            <span className="text-[11px] text-slate-400">Purga de archivos .SHD y .SPL corruptos en disco</span>
          </button>

          <button
            onClick={() => handleSelectModule('PRINT_ISOLATION')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'PRINT_ISOLATION'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">DRIVERS // ISOLATION</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Auditoría Tipo 3 vs Tipo 4</span>
            <span className="text-[11px] text-slate-400">Detección de drivers que ejecutan dentro de spoolsv</span>
          </button>

          <button
            onClick={() => handleSelectModule('USB_DESCRIPTOR_RESET')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'USB_DESCRIPTOR_RESET'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">USB // ROOT HUB RESET</span>
              <Usb className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Reinicio de Controladora xHCI</span>
            <span className="text-[11px] text-slate-400">Reseteo de transceptores ante fallos de descriptor 43</span>
          </button>

          <button
            onClick={() => handleSelectModule('SELECTIVE_SUSPEND_OFF')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'SELECTIVE_SUSPEND_OFF'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">POWER // SUSPEND OFF</span>
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Anulación de Suspensión Selectiva</span>
            <span className="text-[11px] text-slate-400">Garantía de energía constante D0 para DACs y mouse gamer</span>
          </button>

          <button
            onClick={() => handleSelectModule('BTH_STACK_RESET')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'BTH_STACK_RESET'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">BLUETOOTH // RESTART</span>
              <Bluetooth className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Reinicio de Pila de Radio HCI</span>
            <span className="text-[11px] text-slate-400">Reactivación del servicio bthserv y endpoints A2DP</span>
          </button>

          <button
            onClick={() => handleSelectModule('PRINTUI_DRIVER_CLEAN')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'PRINTUI_DRIVER_CLEAN'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">PRINTUI // SERVER PROP</span>
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Consola Nativa printui.dll</span>
            <span className="text-[11px] text-slate-400">Eliminación quirúrgica de paquetes de drivers huérfanos</span>
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
                  Consola de Triage // {consoleOutput.targetComponent}
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
              <strong className="text-amber-300 font-mono block">REGLA CANÓNICA DE RECUPERACIÓN DE PERIFÉRICOS:</strong>
              Nunca elimines carpetas manualmente dentro de C:\Windows\System32\spool\drivers sin detener el Spooler. Usá printui.dll para evitar corromper la base de datos de catálogo del sistema.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
