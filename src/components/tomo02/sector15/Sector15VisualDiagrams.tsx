import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Shield,
  FileCode,
  FolderTree,
  HardDrive,
  Zap,
  ArrowRight,
  Database,
  Sliders,
} from 'lucide-react';

export const Sector15VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'DEVICE_STACK' | 'HARDWARE_ID' | 'DRIVER_STORE' | 'ERROR_CODES'
  >('DEVICE_STACK');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Cpu className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 15</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE CONTROLADORES, DEVICE STACK Y BUS DRIVERS
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Pila de dispositivos (PDO, FDO, FiDO), anatomía de Hardware IDs (VEN/DEV), Driver Store y códigos de error PnP
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('DEVICE_STACK')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'DEVICE_STACK'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Device Stack (PDO, FDO, FiDO)
            </button>
            <button
              onClick={() => setActiveDiagram('HARDWARE_ID')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'HARDWARE_ID'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. Anatomía Hardware ID (PCI/USB)
            </button>
            <button
              onClick={() => setActiveDiagram('DRIVER_STORE')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'DRIVER_STORE'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Driver Store & FileRepository
            </button>
            <button
              onClick={() => setActiveDiagram('ERROR_CODES')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'ERROR_CODES'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. Matriz de Códigos de Error (10, 19, 28, 43)
            </button>
          </div>
        </div>

        {/* Diagram 1: Device Stack */}
        {activeDiagram === 'DEVICE_STACK' && (
          <div className="pt-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-3 font-mono text-xs">
              {/* Upper Filter */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 text-xs">
                    [CAPA 1] UPPER FILTER DRIVER (UpperFiDO)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px]">
                    Opcional
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Modifica o inspecciona IRPs (I/O Request Packets) antes de que lleguen al driver principal. Ejemplo: drivers de macros de teclado o antivirus perimetral.
                </p>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Function Driver */}
              <div className="p-4 rounded-xl bg-cyan-950/40 border-2 border-cyan-500 space-y-1 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-xs">
                    [CAPA 2] FUNCTION DRIVER (FDO — Function Device Object)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-900 text-cyan-200 text-[10px] font-bold">
                    Principal (SYS)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  El controlador operativo del hardware (ej: nvlddmkm.sys para GPU NVIDIA, rt640x64.sys para Realtek Ethernet). Contiene la lógica operativa y maneja la mayoría de solicitudes I/O.
                </p>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Lower Filter */}
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400 text-xs">
                    [CAPA 3] LOWER FILTER DRIVER (LowerFiDO)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 text-[10px]">
                    Opcional
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Filtro inferior que intercepta la comunicación entre el FDO y el bus físico. Ajusta comportamientos eléctricos o adapta protocolos particulares.
                </p>
              </div>

              <div className="flex justify-center text-slate-500">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>

              {/* Bus Driver */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 text-xs">
                    [CAPA 4] BUS DRIVER (PDO — Physical Device Object)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 text-[10px]">
                    PCI.sys / USBHUB3.sys
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Controlador del bus (PCIe, USB, I2C, ACPI). Enumera qué dispositivos están conectados físicamente a las ranuras y crea el objeto de hardware básico PDO.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-cyan-300 font-mono">Causa Raíz de Pantallazos Azules (BSOD): </strong>
                Cualquier fallo de acceso indebido a memoria (ej: <code>DRIVER_IRQL_NOT_LESS_OR_EQUAL</code>) en cualquiera de estas capas del Device Stack ejecuta en Ring 0 (Kernel Mode) y provoca el colapso inmediato del kernel de Windows por seguridad.
              </div>
            </div>
          </div>
        )}

        {/* Diagram 2: Hardware ID */}
        {activeDiagram === 'HARDWARE_ID' && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 font-mono text-xs">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-3">
                ANATOMÍA DE UNA CADENA DE IDENTIFICACIÓN HARDWARE (PCI-EXPRESS)
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-base sm:text-lg font-bold text-slate-100 tracking-wider">
                <span className="text-purple-400">PCI\</span>
                <span className="text-cyan-400">VEN_10DE</span>&amp;
                <span className="text-emerald-400">DEV_2704</span>&amp;
                <span className="text-amber-400">SUBSYS_16C810DE</span>&amp;
                <span className="text-rose-400">REV_A1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
                  <span className="text-cyan-400 font-bold block text-[11px]">VEN_10DE</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Vendor ID</span>
                  <p className="text-[11px] text-slate-300 font-sans">
                    NVIDIA Corporation. Asignado formalmente por el PCI-SIG a nivel mundial.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
                  <span className="text-emerald-400 font-bold block text-[11px]">DEV_2704</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Device ID</span>
                  <p className="text-[11px] text-slate-300 font-sans">
                    GeForce RTX 4080. Código numérico específico del silicio fabricado.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1">
                  <span className="text-amber-400 font-bold block text-[11px]">SUBSYS_16C810DE</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Subsystem ID</span>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Identifica el ensamblador OEM particular (ASUS, MSI, Gigabyte, EVGA).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 space-y-1">
                  <span className="text-rose-400 font-bold block text-[11px]">REV_A1</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Revision Stepping</span>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Revisión física del die de silicio producido en la fundición de obleas.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 font-sans text-xs">
                <strong className="text-cyan-300 font-mono">Ranking de Coincidencia de Windows: </strong>
                El subsistema PnP busca primero en todos los archivos <code>.INF</code> del Driver Store una coincidencia idéntica que incluya <code>SUBSYS</code> y <code>REV</code> (coincidencia perfecta). Si no la encuentra, baja en la jerarquía buscando solo <code>VEN_xxxx&amp;DEV_xxxx</code> (coincidencia genérica), y si aún no hay, recurre a los <strong>Compatible IDs</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: Driver Store */}
        {activeDiagram === 'DRIVER_STORE' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
                  <FolderTree className="w-4 h-4" />
                  <span>C:\Windows\System32\DriverStore\FileRepository</span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  Es el repositorio central y blindado de paquetes de controladores de Windows. Cada paquete instalado se valida criptográficamente (firma digital WHQL o fabricante) y se aísla en una subcarpeta única con hash.
                </p>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1 text-[11px]">
                  <div className="text-slate-400">Ejemplo de estructura de carpeta:</div>
                  <div className="text-cyan-300 font-bold truncate">
                    nv_dispi.inf_amd64_8f1b2c3a4d5e6f7a
                  </div>
                  <div className="text-slate-400 pl-4">├── nv_dispi.inf (Directivas de instalación)</div>
                  <div className="text-slate-400 pl-4">├── nvlddmkm.sys (Binario Kernel)</div>
                  <div className="text-slate-400 pl-4">└── nv_dispi.cat (Catálogo con firmas)</div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold pb-2 border-b border-slate-800">
                  <Terminal className="w-4 h-4" />
                  <span>GESTIÓN CANÓNICA MEDIANTE PNPUTIL.EXE</span>
                </div>
                <div className="space-y-3 text-slate-300 text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 font-bold block text-[11px]">Listar drivers instalados:</span>
                    <code className="text-slate-200">pnputil /enum-drivers</code>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 font-bold block text-[11px]">Añadir e instalar paquete nuevo:</span>
                    <code className="text-slate-200">pnputil /add-driver C:\Driver\*.inf /install</code>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 font-bold block text-[11px]">Eliminar paquete viejo u obsoleto:</span>
                    <code className="text-rose-300">pnputil /delete-driver oem42.inf /uninstall /force</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: Error Codes */}
        {activeDiagram === 'ERROR_CODES' && (
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            {/* Code 10 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-sm">CÓDIGO 10</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">PnP Fail</span>
              </div>
              <strong className="text-slate-200 text-xs block font-sans">This device cannot start</strong>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                El hardware falló la inicialización a nivel de bus o no respondió al comando <code>IRP_MN_START_DEVICE</code>. Típico de sobrecalentamiento, firmware colgado o voltaje inestable.
              </p>
            </div>

            {/* Code 19 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400 text-sm">CÓDIGO 19</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300">Registry Corrupt</span>
              </div>
              <strong className="text-slate-200 text-xs block font-sans">Configuration corrupted in registry</strong>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Los valores <code>UpperFilters</code> o <code>LowerFilters</code> en el Registro apuntan a drivers <code>.sys</code> desinstalados o inexistentes, rompiendo la pila.
              </p>
            </div>

            {/* Code 28 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 text-sm">CÓDIGO 28</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">No Driver</span>
              </div>
              <strong className="text-slate-200 text-xs block font-sans">The drivers are not installed</strong>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                El bus driver detectó el hardware pero no existe ningún archivo INF compatible registrado en el Driver Store que coincida con el Hardware ID o Compatible ID.
              </p>
            </div>

            {/* Code 43 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 text-sm">CÓDIGO 43</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">Hardware Error</span>
              </div>
              <strong className="text-slate-200 text-xs block font-sans">Device reported problems (stopped)</strong>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                El controlador informó a Windows que el hardware físico falló. En GPUs suele indicar VRAM degradada o desoldada; en USB, cortocircuito en líneas D+/D-.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
