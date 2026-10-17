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
  Cpu,
  Layers,
  Activity,
  Sliders,
  FolderTree,
} from 'lucide-react';

interface Tomo02Sector15MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector15MissionView: React.FC<Tomo02Sector15MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'PNPUTIL_ENUM' | 'DEVCON_HWIDS' | 'GET_WMIOBJECT' | 'DRIVER_QUERY' | 'DEVCON_RESTART' | 'POWER_IRP'
  >('PNPUTIL_ENUM');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'pnputil /enum-drivers',
    targetComponent: 'PnP Utility Driver Store Enumerator',
    data: `Microsoft PnP Utility

Nombre publicado:     oem42.inf
Nombre de paquete:    nv_dispi.inf_amd64_8f1b2c3a4d5e6f7a
Nombre del proveedor: NVIDIA
Clase:                Adaptadores de pantalla
Versión de driver:    32.0.15.5244
Fecha de driver:      12/04/2026
Firmante:             Microsoft Windows Hardware Compatibility Publisher

Nombre publicado:     oem43.inf
Nombre de paquete:    rt640x64.inf_amd64_11a2b3c4d5e6f7a8
Nombre del proveedor: Realtek Semiconductor Corp.
Clase:                Adaptadores de red
Versión de driver:    10.071.0315.2026
Fecha de driver:      15/03/2026
Firmante:             Microsoft Windows Hardware Compatibility Publisher`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (
    mod: 'PNPUTIL_ENUM' | 'DEVCON_HWIDS' | 'GET_WMIOBJECT' | 'DRIVER_QUERY' | 'DEVCON_RESTART' | 'POWER_IRP'
  ) => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'PNPUTIL_ENUM') {
      cmd = 'pnputil /enum-drivers';
      target = 'PnP Utility Driver Store Enumerator';
      resData = `Microsoft PnP Utility

Nombre publicado:     oem42.inf
Nombre de paquete:    nv_dispi.inf_amd64_8f1b2c3a4d5e6f7a
Nombre del proveedor: NVIDIA
Clase:                Adaptadores de pantalla
Versión de driver:    32.0.15.5244
Fecha de driver:      12/04/2026
Firmante:             Microsoft Windows Hardware Compatibility Publisher

Nombre publicado:     oem43.inf
Nombre de paquete:    rt640x64.inf_amd64_11a2b3c4d5e6f7a8
Nombre del proveedor: Realtek Semiconductor Corp.
Clase:                Adaptadores de red
Versión de driver:    10.071.0315.2026
Fecha de driver:      15/03/2026
Firmante:             Microsoft Windows Hardware Compatibility Publisher`;
    } else if (mod === 'DEVCON_HWIDS') {
      cmd = 'devcon hwids =display';
      target = 'Device Console (devcon.exe) Architecture';
      resData = `PCI\\VEN_10DE&DEV_2704&SUBSYS_16C810DE&REV_A1\\4&1f2e3d4c&0&0008
    Name: NVIDIA GeForce RTX 4080
    Hardware IDs:
        PCI\\VEN_10DE&DEV_2704&SUBSYS_16C810DE&REV_A1
        PCI\\VEN_10DE&DEV_2704&SUBSYS_16C810DE
        PCI\\VEN_10DE&DEV_2704&CC_030000
        PCI\\VEN_10DE&DEV_2704&CC_0300
    Compatible IDs:
        PCI\\VEN_10DE&DEV_2704&REV_A1
        PCI\\VEN_10DE&DEV_2704
        PCI\\VEN_10DE&CC_030000
        PCI\\VEN_10DE&CC_0300
        PCI\\VEN_10DE
        PCI\\CC_030000
        PCI\\CC_0300
1 matching device(s) found.`;
    } else if (mod === 'GET_WMIOBJECT') {
      cmd = 'Get-PnpDevice -Status Error,Degraded,Unknown | Select-Object FriendlyName, InstanceId, Status, Problem';
      target = 'PowerShell PnP Subsystem Provider';
      resData = `FriendlyName                     InstanceId                                Status  Problem
------------                     ----------                                ------  -------
Intel(R) Smart Sound Technology  PCI\\VEN_8086&DEV_51C8&SUBSYS_00008086... Error   CM_PROB_FAILED_START (Code 10)
High Definition Audio Bus        HDAUDIO\\FUNC_01&VEN_10EC&DEV_1220...     Error   CM_PROB_REGISTRY_ERROR (Code 19)
PCI Simple Communications Ctrler PCI\\VEN_8086&DEV_7A60...                Error   CM_PROB_FAILED_INSTALL (Code 28)

Total de incidencias de hardware en bus: 3 dispositivos afectados.`;
    } else if (mod === 'DRIVER_QUERY') {
      cmd = 'driverquery /v /fo csv | ConvertFrom-Csv | Select-Object -First 4 ModuleName, DisplayName, DriverType, LinkDate';
      target = 'Kernel Driver Query Subsystem';
      resData = `ModuleName  DisplayName                             DriverType LinkDate
----------  -----------                             ---------- --------
nvlddmkm    NVIDIA Windows Kernel Mode Driver       Kernel     12/04/2026 04:15:22
rt640x64    Realtek RT640 Gigabit Ethernet Driver   Kernel     15/03/2026 11:20:01
FLTMGR      File System Filter Manager              File System 22/01/2026 02:40:19
storahci    Microsoft Standard SATA AHCI Driver     Kernel     18/02/2026 09:12:00`;
    } else if (mod === 'DEVCON_RESTART') {
      cmd = 'devcon rescan && devcon restart "PCI\\VEN_10DE*"';
      target = 'PnP Arbiter & Bus Enumerator';
      resData = `Scanning for new hardware...
Scanning completed.

PCI\\VEN_10DE&DEV_2704&SUBSYS_16C810DE&REV_A1\\4&1f2e3d4c&0&0008: Restarted
1 device(s) restarted.

PnP State Machine:
1. IRP_MN_QUERY_REMOVE_DEVICE enviado al Device Stack -> Aceptado.
2. IRP_MN_REMOVE_DEVICE -> FDO desvinculado de memoria Ring 0.
3. IRP_MN_START_DEVICE -> Asignación de recursos IRQ/MMIO refrescados.`;
    } else {
      cmd = 'powercfg /devicequery wake_armed';
      target = 'ACPI & Power Management Arbiter';
      resData = `Dispositivos autorizados para enviar eventos de reanudación (PME Wake Event) desde estados D3hot/D3cold:

HID Keyboard Device (001)
Razer DeathAdder V3 Pro (002)
Intel(R) Ethernet Controller I225-V

Análisis de latencia:
Los paquetes Wake-On-LAN o pulsaciones de teclado inician una transición D3 -> D0 mediante solicitud IRP_MN_SET_POWER.`;
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
              LABORATORIO PERICIAL 15
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              DEVICE MANAGER FORENSICS & PNP CONSOLE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Simulador interactivo de diagnóstico de controladores, Device Stacks, devcon, pnputil y sondeo de registros PnP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Picker */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 block font-bold">
            Comandos de Diagnóstico de Silicio
          </span>

          <button
            onClick={() => handleSelectModule('PNPUTIL_ENUM')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'PNPUTIL_ENUM'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">PNPUTIL // ENUM DRIVERS</span>
              <FolderTree className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Auditoría del Driver Store</span>
            <span className="text-[11px] text-slate-400">Inspección de archivos oemXX.inf y firmas digitales</span>
          </button>

          <button
            onClick={() => handleSelectModule('DEVCON_HWIDS')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'DEVCON_HWIDS'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">DEVCON // HWIDS</span>
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Jerarquía VEN/DEV & Subsystem</span>
            <span className="text-[11px] text-slate-400">Identificadores de silicio para coincidencia perfecta de INF</span>
          </button>

          <button
            onClick={() => handleSelectModule('GET_WMIOBJECT')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'GET_WMIOBJECT'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">POWERSHELL // GET-PNPDEVICE</span>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Detección de Dispositivos con Falla</span>
            <span className="text-[11px] text-slate-400">Filtro de hardware con Códigos 10, 19, 28, 43</span>
          </button>

          <button
            onClick={() => handleSelectModule('DRIVER_QUERY')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'DRIVER_QUERY'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">DRIVERQUERY // KERNEL</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Módulos Binarios en Memoria Ring 0</span>
            <span className="text-[11px] text-slate-400">Fechas de compilación LinkDate y tipos de kernel</span>
          </button>

          <button
            onClick={() => handleSelectModule('DEVCON_RESTART')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'DEVCON_RESTART'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">DEVCON // RESTART</span>
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Reinicio Limpio de Pila sin Reboot</span>
            <span className="text-[11px] text-slate-400">Disparo de IRP_MN_REMOVE e IRP_MN_START</span>
          </button>

          <button
            onClick={() => handleSelectModule('POWER_IRP')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'POWER_IRP'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">POWERCFG // WAKE ARMED</span>
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Estados de Energía D0-D3 & ACPI</span>
            <span className="text-[11px] text-slate-400">Control de dispositivos que pueden despertar el equipo</span>
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
                  Consola PnP Kernel // {consoleOutput.targetComponent}
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
              <strong className="text-amber-300 font-mono block">PRINCIPIO EVOLABS DE METROLOGÍA DE LATENCIA DPC:</strong>
              Un controlador nuevo no siempre es mejor. Utiliza LatencyMon para auditar si las rutinas ISR/DPC del controlador introducen latencia superior a 1000 µs antes de dejarlo como definitivo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
