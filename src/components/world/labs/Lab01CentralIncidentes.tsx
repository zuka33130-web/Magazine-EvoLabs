import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  Search, 
  FileText, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Activity,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface BsodCase {
  code: string;
  hex: string;
  name: string;
  severity: 'CRÍTICO' | 'ALTO' | 'MEDIO';
  culpritDrivers: string[];
  rootCause: string;
  stackTraceSample: string;
  registers: {
    rax: string;
    rbx: string;
    rcx: string;
    rdx: string;
    rsi: string;
    rdi: string;
    rip: string;
    rsp: string;
    cr2?: string;
  };
  trapFrameInfo: string;
  rootCauseTree: {
    node: string;
    detail: string;
    subNodes?: string[];
  }[];
  protocol: string[];
  telemetryHook: string;
}

const BSOD_DATABASE: BsodCase[] = [
  {
    code: 'DPC_WATCHDOG_VIOLATION',
    hex: '0x00000133',
    name: 'Conflicto de Driver / Timeout en ISR & Cola de Rutina DPC',
    severity: 'ALTO',
    culpritDrivers: ['nvlddmkm.sys', 'storahci.sys', 'iaStorAfs.sys', 'rtwlanu.sys'],
    rootCause: 'Un controlador de dispositivo monopolizó el procesador en nivel DISPATCH_LEVEL (IRQL 2) durante más tiempo del límite de tiempo asignado por el temporizador watchdog del kernel de Windows (DPC timeout típicamente > 100 µs continuos o 500 µs acumulados), bloqueando la planificación normal de hilos.',
    stackTraceSample: `*******************************************************************************
*                        BUGCHECK_ANALYSIS                                    *
*******************************************************************************
DPC_WATCHDOG_VIOLATION (133)
The DPC watchdog detected a prolonged run time at an IRQL of DISPATCH_LEVEL
or above.
Arguments:
Arg1: 0000000000000001, The system cumulatively spent an extended period of time at DISPATCH_LEVEL or above.
Arg2: 0000000000001e00, The watchdog-considered DPC time-out interval in ticks.
Arg3: fffff80133c5b320, Watchdog timer block address.
Arg4: 0000000000000000

STACK_TEXT:
fffff801\`32867898 fffff801\`31e289f0     : 00000000\`00000133 00000000\`00000001 00000000\`00001e00 fffff801\`33c5b320 : nt!KeBugCheckEx
fffff801\`328678a0 fffff801\`31c7128c     : 00000000\`00000000 00000000\`00000001 00000000\`00000000 fffff801\`328679e0 : nt!KeAccumulateTicks+0x2f4
fffff801\`32867900 fffff801\`31c70e35     : fffff801\`32867aa0 fffff801\`31ca9220 00000000\`00000002 00000000\`00000000 : nt!KeClockInterruptNotify+0x31c
fffff801\`32867b60 fffff801\`31cf3182     : fffff801\`33d9c000 00000000\`00000000 00000000\`00000000 00000000\`00000000 : hal!HalpTimerClockInterrupt+0x102
fffff801\`32867b90 fffff801\`4a8712bc     : fffff801\`32867c20 00000000\`00000000 ffffd205\`83b19000 ffffd205\`83b19050 : nt!KiInterruptSubDispatchNoLock+0x12
fffff801\`32867bd0 fffff801\`4a82001e     : ffffd205\`83b19000 fffff801\`32867c80 ffffd205\`83b19000 fffff801\`4a81f3c0 : nvlddmkm!_osDelayUs+0x4c
fffff801\`32867c00 fffff801\`4a81e9f1     : ffffd205\`83b19000 ffffd205\`83b19000 00000000\`00000000 fffff801\`31ce55a2 : nvlddmkm!osWaitSignalDpc+0x12e
fffff801\`32867c50 fffff801\`31ca9048     : fffff801\`33d9c180 fffff801\`33d9f300 00000000\`00000000 ffffd205\`819bb080 : nt!KiExecuteAllDpcs+0x308

FAILURE_BUCKET_ID: 0x133_DPC_nvlddmkm!osWaitSignalDpc
MODULE_NAME: nvlddmkm
IMAGE_NAME: nvlddmkm.sys`,
    registers: {
      rax: '0000000000000133',
      rbx: 'ffffd20583b19000',
      rcx: '0000000000000001',
      rdx: '0000000000001e00',
      rsi: 'ffffd20583b19050',
      rdi: '0000000000000000',
      rip: 'fffff80131e289f0 (nt!KeAccumulateTicks+0x2f4)',
      rsp: 'fffff80132867898'
    },
    trapFrameInfo: 'TRAP_FRAME: fffff80132867b90 (.trap fffff80132867b90) -- Driver executing busy-wait loop inside high-priority DPC lock without releasing dispatch queue.',
    rootCauseTree: [
      {
        node: '1. Disparo de Interrupción de Hardware (Line/MSI IRQ)',
        detail: 'La controladora gráfica NVIDIA envió interrupción de completado de comando 3D.',
        subNodes: ['Interrupción servida por hal!HalpTimerClockInterrupt', 'Elevación a DISPATCH_LEVEL (IRQL 2)']
      },
      {
        node: '2. Encolamiento en Cola DPC de CPU Cores',
        detail: 'nvlddmkm!osWaitSignalDpc ingresa a la cola de deferred procedure calls.',
        subNodes: ['Entrada en bucle de polling _osDelayUs por falta de respuesta del hardware', 'Tiempo sostenido de ejecución excede 100µs sin retorno']
      },
      {
        node: '3. Expiración de Ticks en KeClockInterruptNotify',
        detail: 'El scheduler detecta que el hilo del kernel no cede el procesador.',
        subNodes: ['Watchdog timer incrementa contador a 0x1e00 ticks', 'KeBugCheckEx invocado con código 0x133']
      }
    ],
    protocol: [
      'Ejecutar LatencyMon en reposo y bajo carga para auditar el pico máximo de ISR/DPC de nvlddmkm.sys.',
      'Si se usan ratones o dispositivos USB con tasa de 4000Hz/8000Hz, reducir a 1000Hz para no asfixiar el scheduler.',
      'Desactivar ASPM (Active State Power Management) en el panel de control de PCIe si el fallo involucra storahci.sys.',
      'Reinstalar el controlador gráfico mediante DDU (Display Driver Uninstaller) en Modo Seguro sin drivers de audio redundantes.'
    ],
    telemetryHook: 'Get-WinEvent -FilterHashtable @{LogName="System"; ProviderName="Microsoft-Windows-Kernel-Power"} -MaxEvents 5'
  },
  {
    code: 'WHEA_UNCORRECTABLE_ERROR',
    hex: '0x00000124',
    name: 'Inestabilidad Física de Bus / Voltaje en Arquitectura (WHEA)',
    severity: 'CRÍTICO',
    culpritDrivers: ['hal.dll', 'ntoskrnl.exe', 'intelppm.sys / amdppm.sys'],
    rootCause: 'El hardware de la arquitectura del procesador (Machine Check Architecture - MCA) detectó un error físico no corregible de paridad o bus antes de que el software pudiera intervenir. Generalmente provocado por caídas de Vcore transitorio (vDroop), Curve Optimizer negativo excesivo o sobrecalentamiento en caché L2/L3.',
    stackTraceSample: `*******************************************************************************
*                        BUGCHECK_ANALYSIS                                    *
*******************************************************************************
WHEA_UNCORRECTABLE_ERROR (124)
A fatal hardware error has occurred. This BugCheck uses the error data that
was stored in the Machine Check Architecture (MCA) registers.
Arguments:
Arg1: 0000000000000000, Machine Check Exception
Arg2: ffffc387d825c028, Address of the WHEA_ERROR_RECORD structure
Arg3: 00000000be000000, MCi_STATUS High DWORD
Arg4: 0000000000800400, MCi_STATUS Low DWORD (L1/L2 Cache Hierarchy Error)

STACK_TEXT:
fffff802\`45617a28 fffff802\`44819d40     : 00000000\`00000124 00000000\`00000000 ffffc387\`d825c028 00000000\`be000000 : nt!KeBugCheckEx
fffff802\`45617a30 fffff802\`4410a821     : ffffc387\`d825c028 fffff802\`44819ca0 00000000\`00000000 fffff802\`45617b80 : hal!HalpMcaReportError+0x114
fffff802\`45617b00 fffff802\`44109765     : 00000000\`00000008 ffffc387\`d825c028 fffff802\`45617c00 00000000\`00000000 : hal!HalpMceHandlerCore+0xe5
fffff802\`45617b50 fffff802\`4409391b     : fffff802\`45617c60 fffff802\`44093840 00000000\`00000000 00000000\`00000000 : hal!HalHandleMcheck+0x65
fffff802\`45617b80 fffff802\`44093402     : 00000000\`00000000 00000000\`00000000 00000000\`00000000 00000000\`00000000 : nt!KiMcheckAbort+0x7b

FAILURE_BUCKET_ID: 0x124_GenuineIntel_PROCESSOR__CACHE_ERR_INFO_MCiStatus
MODULE_NAME: GenuineIntel / AuthenticAMD
IMAGE_NAME: hardware`,
    registers: {
      rax: '0000000000000124',
      rbx: 'ffffc387d825c028',
      rcx: '0000000000000000',
      rdx: '00000000be000000',
      rsi: '0000000000800400',
      rdi: 'ffffc387d825c000',
      rip: 'fffff80244819d40 (hal!HalpMcaReportError+0x114)',
      rsp: 'fffff80245617a28'
    },
    trapFrameInfo: 'TRAP_FRAME: MCA Handler Abort Frame. CPU Bank 0/Core Error: Cache hierarchy parity mismatch caused by instantaneous voltage drop under AVX load.',
    rootCauseTree: [
      {
        node: '1. Conmutación Rápida de Estados de Frecuencia P-State',
        detail: 'Procesador salta de reposo (800 MHz / 0.7V) a ráfaga Boost (5.4 GHz / 1.35V).',
        subNodes: ['Transitorio de alta demanda di/dt en inductores VRM', 'Curve Optimizer ajustado demasiado bajo (-30 mV)']
      },
      {
        node: '2. Caída vDroop y Pérdida de Bit en Búfer L2 Cache',
        detail: 'El circuito MCA de la CPU detecta bitflip por sub-voltaje momentáneo.',
        subNodes: ['Registro MCi_STATUS marca bit 63 (VAL) y bit 61 (UC - Uncorrected)', 'Interrupción Machine Check no enmascarable (NMI) hacia hal.dll']
      },
      {
        node: '3. Parada de Emergencia del Kernel',
        detail: 'Imposibilidad de asegurar integridad de datos en el espacio de ejecución.',
        subNodes: ['hal!HalHandleMcheck genera el volcado LiveDump', 'Parada de silicio inmediata']
      }
    ],
    protocol: [
      'Relajar el Curve Optimizer en BIOS: reducir el offset negativo de -30 a -15 o -10 en los núcleos preferentes (Best Cores).',
      'Configurar Load-Line Calibration (LLC) en nivel intermedio para mitigar el vDroop transitorio.',
      'Verificar temperatura en MOSFETs del VRM: el calor degrada la eficiencia de conmutación de voltaje.',
      'Aislar el núcleo defectuoso ejecutando CoreCycler con perfiles Prime95 Small FFTs o Y-Cruncher.'
    ],
    telemetryHook: 'Get-WinEvent -FilterHashtable @{LogName="System"; ProviderName="Microsoft-Windows-WHEA-Logger"} -MaxEvents 5'
  },
  {
    code: 'SYSTEM_SERVICE_EXCEPTION',
    hex: '0x0000003B',
    name: 'Falla en Transición de Privilegios Ring 3 -> Ring 0',
    severity: 'ALTO',
    culpritDrivers: ['win32kbase.sys', 'dxgkrnl.sys', 'cldflt.sys', 'ntfs.sys'],
    rootCause: 'Ocurrió una excepción durante la transición o ejecución de un servicio del sistema desde el espacio de usuario (Ring 3) al espacio del kernel (Ring 0). El procesador intentó ejecutar una rutina con un puntero nulo o buffer desalineado recibido a través de una llamada a la API nativa de Windows.',
    stackTraceSample: `*******************************************************************************
*                        BUGCHECK_ANALYSIS                                    *
*******************************************************************************
SYSTEM_SERVICE_EXCEPTION (3b)
An exception happened while executing a system service routine.
Arguments:
Arg1: 00000000c0000005, Exception code (STATUS_ACCESS_VIOLATION)
Arg2: fffff806509a25b0, Address of instruction causing the fault
Arg3: ffff928a34b2f810, Context Record address for the trap
Arg4: 0000000000000000

STACK_TEXT:
ffff928a\`34b2efc8 fffff806\`4cbca1e9     : 00000000\`0000003b 00000000\`c0000005 fffff806\`509a25b0 ffff928a\`34b2f810 : nt!KeBugCheckEx
ffff928a\`34b2efd0 fffff806\`4ca95b82     : ffff928a\`34b2f810 00000000\`00000000 00000000\`00000000 ffff928a\`34b2f810 : nt!KiBugCheckDispatch+0x69
ffff928a\`34b2f110 fffff806\`4ca89e6d     : fffff806\`4cb8c1e0 00000000\`00000000 ffff928a\`34b2f810 fffff806\`509a25b0 : nt!KiDispatchException+0x1cd
ffff928a\`34b2f7d0 fffff806\`4ca85b34     : 00000000\`00000000 00000000\`00000000 00000000\`00000000 00000000\`00000000 : nt!KiExceptionDispatch+0x114
ffff928a\`34b2f9b0 fffff806\`509a25b0     : 00000000\`00000000 ffffc180\`1249b010 ffff928a\`34b2fb40 fffff806\`4ca4a091 : nt!KiGeneralProtectionFault+0x334
ffff928a\`34b2fb40 fffff806\`5098b1e4     : ffffc180\`1249b010 00000000\`00000001 00000000\`00000000 00000000\`00000000 : win32kbase!GreCreateDIBitmapReal+0x80

FAILURE_BUCKET_ID: 0x3B_c0000005_win32kbase!GreCreateDIBitmapReal
MODULE_NAME: win32kbase
IMAGE_NAME: win32kbase.sys`,
    registers: {
      rax: '00000000c0000005',
      rbx: 'ffffc1801249b010',
      rcx: 'ffff928a34b2f810',
      rdx: '0000000000000000',
      rsi: '0000000000000001',
      rdi: '0000000000000000',
      rip: 'fffff806509a25b0 (win32kbase!GreCreateDIBitmapReal+0x80)',
      rsp: 'ffff928a34b2f9b0'
    },
    trapFrameInfo: 'TRAP_FRAME: ffff928a34b2f7d0 (.trap ffff928a34b2f7d0) -- User-mode GDI context passed invalid pointer to kernel graphical subsystem.',
    rootCauseTree: [
      {
        node: '1. Llamada al Sistema desde Ring 3 (Syscall)',
        detail: 'Una aplicación gráfica o cliente de juego solicitó creación de un bitmap nativo.',
        subNodes: ['Transición a través de instrucción SYSCALL/SYSENTER', 'Paso de puntero de búfer de usuario']
      },
      {
        node: '2. Verificación de Memoria y STATUS_ACCESS_VIOLATION',
        detail: 'win32kbase intenta desreferenciar una dirección fuera del espacio virtual asignado.',
        subNodes: ['Código 0xc0000005 de violación de acceso', 'El driver carecía de bloque try/except estructurado']
      },
      {
        node: '3. Parada del Kernel por Infracción de Seguridad',
        detail: 'El despachador de excepciones nt!KiDispatchException confirma falla irrecuperable.',
        subNodes: ['nt!KiBugCheckDispatch eleva el BugCheck 0x3B']
      }
    ],
    protocol: [
      'Desinstalar programas que inyectan librerías DLL en el subsistema de ventanas (overlays, modificadores de temas de Windows).',
      'Actualizar el controlador del subsistema gráfico DirectX (dxgkrnl.sys / driver de GPU).',
      'Comprobar la integridad de los archivos protegidos del sistema ejecutando: sfc /scannow y DISM.',
      'Si se produce al abrir juegos, desactivar la aceleración de hardware en Discord, Spotify y navegadores web.'
    ],
    telemetryHook: 'Get-ItemProperty HKLM:\\SYSTEM\\CurrentControlSet\\Control\\CrashControl'
  },
  {
    code: 'KMODE_EXCEPTION_NOT_HANDLED',
    hex: '0x0000001E',
    name: 'Acceso a Memoria No Válida en Rutina de Modo Kernel',
    severity: 'CRÍTICO',
    culpritDrivers: ['ntoskrnl.exe', 'usbport.sys', 'ndis.sys', 'anti-cheat.sys'],
    rootCause: 'Un programa en modo kernel (Ring 0) generó una excepción que el manejador de errores del kernel no pudo atrapar ni resolver. El caso más habitual es el código 0xC0000005 (violación de acceso) cuando un driver intenta escribir en una dirección de memoria protegida de solo lectura o nula.',
    stackTraceSample: `*******************************************************************************
*                        BUGCHECK_ANALYSIS                                    *
*******************************************************************************
KMODE_EXCEPTION_NOT_HANDLED (1e)
This is a very common BugCheck. Usually the exception address pinpoints
the driver/function that caused the problem.
Arguments:
Arg1: ffffffffc0000005, The exception code that was not handled
Arg2: fffff80072a441b0, The address that the exception occurred at
Arg3: 0000000000000000, Parameter 0 of the exception
Arg4: ffffffffffffffff, Parameter 1 of the exception (Memory accessed)

STACK_TEXT:
fffffb03\`1865e908 fffff800\`71a17bc8     : 00000000\`0000001e ffffffff\`c0000005 fffff800\`72a441b0 00000000\`00000000 : nt!KeBugCheckEx
fffffb03\`1865e910 fffff800\`71946022     : fffffb03\`1865f120 00000000\`00000000 fffffb03\`1865f120 fffff800\`71a17ae0 : nt!KiDispatchException+0x1cc
fffffb03\`1865efd0 fffff800\`71941df2     : 00000000\`00000000 00000000\`00000000 00000000\`00000000 00000000\`00000000 : nt!KiExceptionDispatch+0x112
fffffb03\`1865f1b0 fffff800\`72a441b0     : ffffe001\`84a21000 00000000\`00000000 00000000\`00000000 fffff800\`718a2450 : nt!KiPageFault+0x432
fffffb03\`1865f340 fffff800\`72a43320     : ffffe001\`84a21000 ffffe001\`84a21000 fffffb03\`1865f490 fffff800\`71911364 : ndis!ndisDummyFilterReceiveNetBufferLists+0x60

FAILURE_BUCKET_ID: 0x1E_c0000005_R_ndis!ndisDummyFilterReceiveNetBufferLists
MODULE_NAME: ndis
IMAGE_NAME: ndis.sys`,
    registers: {
      rax: 'ffffffffc0000005',
      rbx: 'ffffe00184a21000',
      rcx: 'fffff80072a441b0',
      rdx: '0000000000000000',
      rsi: 'ffffffffffffffff',
      rdi: '0000000000000000',
      rip: 'fffff80072a441b0 (ndis!ndisDummyFilterReceiveNetBufferLists+0x60)',
      rsp: 'fffffb031865f1b0',
      cr2: 'ffffffffffffffff'
    },
    trapFrameInfo: 'TRAP_FRAME: fffffb031865efd0 (.trap fffffb031865efd0) -- Page fault occurred at CR2: ffffffffffffffff while executing in Kernel Mode.',
    rootCauseTree: [
      {
        node: '1. Despacho de Paquetes en Nivel de Red (NDIS Stack)',
        detail: 'El controlador de red recibe tráfico y lo entrega a los filtros del kernel.',
        subNodes: ['Driver de red o VPN de terceros intercepta la lista de búferes', 'Puntero de memoria corrupto o no inicializado']
      },
      {
        node: '2. Disparo de Excepción de Fallo de Página (KiPageFault)',
        detail: 'La CPU intenta resolver la dirección virtual 0xFFFFFFFFFFFFFFFF en la MMU.',
        subNodes: ['Fallo de página fatal: la dirección no está mapeada en tablas de páginas', 'Excepción no controlada en modo KMODE']
      },
      {
        node: '3. Parada Pericial de Seguridad',
        detail: 'El kernel colapsa para proteger la memoria física de sobreescritura accidental.',
        subNodes: ['nt!KeBugCheckEx invocado con código 0x1E']
      }
    ],
    protocol: [
      'Desinstalar software antivirus de terceros, herramientas VPN o filtros de red que se acoplan al stack NDIS.',
      'Actualizar el driver de la tarjeta de red (WiFi / Ethernet) desde la web oficial del fabricante del chipset.',
      'Verificar estabilidad de la memoria RAM con TestMem5: los fallos de página aleatorios en kernel pueden ser causados por micro-corrupción en celdas DRAM.',
      'Activar el comprobador de controladores de Windows (verifier.exe) para atrapar el módulo exacto que corrompe el heap del kernel.'
    ],
    telemetryHook: 'Get-CimInstance Win32_PnPEntity | Where-Object { $_.ConfigManagerErrorCode -ne 0 }'
  }
];

export const Lab01CentralIncidentes: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<BsodCase>(BSOD_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'triage' | 'timeline' | 'copypaste'>('triage');
  const [copiedScript, setCopiedScript] = useState(false);

  const filteredCases = BSOD_DATABASE.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.culpritDrivers.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Lab Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 via-[#0d1017] to-zinc-900 border-2 border-red-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <ShieldAlert className="w-40 h-40 text-red-500" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-400 font-mono-tech text-xs font-bold uppercase tracking-wider">
                ZONA 01 // MESA DE TRIAGE FORENSE
              </span>
              <span className="text-zinc-500 font-mono-tech text-xs">// LIVE INCIDENT ENGINE</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Central de Incidentes & Analizador de Crash Dumps
            </h2>
            <p className="text-zinc-300 font-sans-editorial text-sm mt-1 max-w-2xl leading-relaxed">
              No reinicies a ciegas. Cada pantalla azul (BSOD) deja una huella digital matemática en el kernel. Identificá el código Bugcheck, aislá el driver culpable en Ring 0 y ejecutá el protocolo de recuperación pericial.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl font-mono-tech text-center">
              <span className="text-[10px] text-zinc-500 block uppercase">CASOS CATALAGODADOS</span>
              <span className="text-lg font-black text-amber-400">5 PATRONES CRÍTICOS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 cols: Bugcheck Catalog & Search */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-[#0d0f17] border border-zinc-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-tech text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                SELECCIONAR PATRÓN BSOD
              </span>
              <span className="text-[10px] font-mono-tech text-zinc-500">
                {filteredCases.length} ENCONTRADOS
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar código (ej: WHEA, 0x133, nvlddmkm)..."
                className="w-full bg-black/70 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredCases.map((c) => {
                const isSelected = selectedCase.code === c.code;
                return (
                  <div
                    key={c.code}
                    onClick={() => setSelectedCase(c)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer select-none font-mono-tech ${
                      isSelected
                        ? 'bg-red-500/15 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : 'bg-zinc-950/80 border-zinc-800/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-amber-400 tracking-tight">
                        {c.code}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        c.severity === 'CRÍTICO' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                      }`}>
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-[10.5px] font-sans-editorial text-zinc-400 leading-snug line-clamp-2">
                      {c.name}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                      <span>HEX: {c.hex}</span>
                      <span className="text-zinc-400 hover:text-amber-400 flex items-center gap-0.5">
                        ANALIZAR →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 8 cols: Deep Forensic Workspace */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Case Workspace Card */}
          <div className="p-6 bg-[#0c0e15] border-2 border-zinc-800 rounded-xl space-y-5 shadow-2xl">
            
            {/* Case Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono-tech text-red-400 font-black">
                    BUGCHECK: {selectedCase.hex}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-mono-tech text-yellow-400 font-bold">
                    {selectedCase.code}
                  </span>
                </div>
                <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                  {selectedCase.name}
                </h3>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-zinc-800 text-xs font-mono-tech">
                <button
                  type="button"
                  onClick={() => setActiveTab('triage')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    activeTab === 'triage' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  TRIAGE PERICIAL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    activeTab === 'timeline' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  STACK TRACE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('copypaste')}
                  className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                    activeTab === 'copypaste' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  COMANDO FORENSE
                </button>
              </div>
            </div>

            {/* TAB 1: TRIAGE PERICIAL */}
            {activeTab === 'triage' && (
              <div className="space-y-4 font-sans-editorial">
                
                {/* Root Cause Card */}
                <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-lg space-y-1">
                  <span className="text-[10px] font-mono-tech text-red-400 font-bold uppercase tracking-wider block">
                    ETIOLOGÍA DE LA FALLA // CAUSA RAÍZ
                  </span>
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    {selectedCase.rootCause}
                  </p>
                </div>

                {/* Culprit Drivers Strip */}
                <div className="p-3.5 bg-black/60 border border-zinc-800 rounded-lg space-y-2">
                  <span className="text-[10.5px] font-mono-tech text-amber-400 font-bold uppercase tracking-wider block">
                    MÓDULOS Y CONTROLADORES SOSPECHOSOS EN RING 0:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.culpritDrivers.map((driver, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono-tech text-xs font-bold"
                      >
                        ⚡ {driver}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Recovery Protocol */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-tech text-zinc-400 font-bold uppercase tracking-wider block">
                    PROTOCOLO OFICIAL DE RESOLUCIÓN EVO (4 PASOS):
                  </span>
                  <div className="space-y-2">
                    {selectedCase.protocol.map((step, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-[#11141e] border border-zinc-800 rounded-lg flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 mt-0.5">
                          0{idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: WINDBG FORENSIC TERMINAL & STACK TRACE */}
            {activeTab === 'timeline' && (
              <div className="space-y-4 font-mono-tech">
                {/* WinDbg Terminal Window */}
                <div className="p-4 bg-[#05070b] border-2 border-zinc-700/80 rounded-xl space-y-4 shadow-2xl">
                  {/* WinDbg Window Header */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                      </div>
                      <span className="text-amber-400 font-bold ml-1">
                        WinDbg (x64) 10.0.26100.2454 // KERNEL MEMORY ANALYZER
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-cyan-400">
                        kd&gt; !analyze -v
                      </span>
                      <span>Dump: MEMORY.DMP</span>
                    </div>
                  </div>

                  {/* Registers Context Block (RAX, RBX, RIP, RSP...) */}
                  <div className="p-3 bg-black/80 rounded-lg border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-900 pb-1.5">
                      <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                        REGISTROS DE LA CPU AL MOMENTO DEL CRASH (TRAP FRAME CONTEXT):
                      </span>
                      <span className="text-zinc-500 text-[10px]">x86-64 REGISTER DUMP</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RAX</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{selectedCase.registers.rax}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RBX</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{selectedCase.registers.rbx}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RCX</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{selectedCase.registers.rcx}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RDX</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{selectedCase.registers.rdx}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RSI</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{selectedCase.registers.rsi}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RDI</span>
                        <span className="text-emerald-400 font-bold text-[11px]">{selectedCase.registers.rdi}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">RSP</span>
                        <span className="text-cyan-400 font-bold text-[11px]">{selectedCase.registers.rsp}</span>
                      </div>
                      <div className="bg-zinc-950 p-2 rounded border border-zinc-900">
                        <span className="text-zinc-500 block text-[10px]">CR2 / FAULT</span>
                        <span className="text-rose-400 font-bold text-[11px]">{selectedCase.registers.cr2 || 'N/A (NON-PAGED)'}</span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/90 p-2 rounded border border-amber-500/20 text-xs">
                      <span className="text-zinc-400 block text-[10px]">INSTRUCTION POINTER (RIP - DIRECCIÓN EXACTA DE EJECUCIÓN):</span>
                      <span className="text-amber-300 font-bold text-xs">{selectedCase.registers.rip}</span>
                    </div>

                    {/* TrapFrame Analysis */}
                    <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-300">
                      <span className="text-red-400 font-bold block mb-1">!trap analysis:</span>
                      {selectedCase.trapFrameInfo}
                    </div>
                  </div>

                  {/* Disassembly & Call Stack Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="text-cyan-400 font-bold">DESENSAMBLADO DE PILA (STACK TRACE DEPURADO):</span>
                      <button
                        onClick={() => handleCopy(selectedCase.stackTraceSample)}
                        className="text-[10px] text-amber-400 hover:text-white underline cursor-pointer"
                      >
                        Copiar Log Crudo
                      </button>
                    </div>
                    <pre className="text-[11px] text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto p-3.5 bg-black rounded-lg border border-zinc-800 font-mono-tech max-h-[300px]">
                      {selectedCase.stackTraceSample}
                    </pre>
                  </div>

                  {/* Root Cause Diagnostic Tree */}
                  <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      ÁRBOL DE DIAGNÓSTICO DE CAUSA RAÍZ (ROOT CAUSE TREE):
                    </span>

                    <div className="space-y-2 font-sans-editorial">
                      {selectedCase.rootCauseTree.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-[#0e111a] border border-zinc-800 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <strong className="text-white text-xs font-mono-tech">{item.node}</strong>
                          </div>
                          <p className="text-xs text-zinc-300 ml-4">{item.detail}</p>
                          {item.subNodes && (
                            <ul className="ml-6 space-y-0.5 list-disc text-[11px] text-zinc-400">
                              {item.subNodes.map((sub, sIdx) => (
                                <li key={sIdx}>{sub}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: COPYPASTE POWERSHELL HOOK */}
            {activeTab === 'copypaste' && (
              <div className="space-y-4 font-mono-tech">
                <div className="p-4 bg-[#11141e] border border-yellow-400/30 rounded-lg space-y-3">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                    COMANDO POWERSHELL PARA EXTRAER EL HISTORIAL DE ESTE INCIDENTE:
                  </span>
                  
                  <div className="p-3 bg-black/80 border border-zinc-800 rounded-lg flex items-center justify-between gap-3">
                    <code className="text-xs text-cyan-300 overflow-x-auto">
                      {selectedCase.telemetryHook}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedCase.telemetryHook)}
                      className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedScript ? '¡COPIADO!' : 'COPIAR'}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans-editorial">
                    Ejecutá este comando en tu consola PowerShell local para consultar los registros de eventos de Windows y confirmar si tu PC registró este código en las últimas 72 horas.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
