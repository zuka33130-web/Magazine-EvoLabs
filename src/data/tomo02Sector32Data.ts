// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 32: WINDOWS POR DENTRO
// "La zona oscura"

export type RiskLevelSector32 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector32Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector32;
  descubri: {
    hook: string;
    mythVsTruth: {
      mentira: string;
      verdad: string;
      comprobalo: string;
    };
  };
  entende: {
    queEs: string;
    paraQueSirve: string;
    quePasaSiFalta: string;
  };
  interactua: {
    cliExample: string;
    psExample: string;
    syntaxBreakdown: string;
    whatToLookFor: string;
    technicalMetrics: string;
  };
  alertaEVO: {
    reversibilityRule: string;
    safetyWarning: string;
  };
  evidenceBadge: {
    code: string;
    label: string;
  };
}

export interface Sector32MiniCase {
  id: string;
  code: string;
  title: string;
  scenario: string;
  userStatement: string;
  initialMistake: string;
  diagnosticQuestion: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  technicalVerdict: string;
  lessonLearned: string;
}

export interface Sector32TestQuestion {
  id: string;
  questionNumber: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
}

export const SECTOR_32_INVESTIGATIONS: Sector32Investigation[] = [
  {
    id: "inv-32-01",
    code: "32.01",
    title: "Kernel",
    subtitle: "El microkernel ntoskrnl.exe, despacho de interrupciones y sincronización multiprocesador",
    targetMechanism: "NT Core Microkernel Architecture",
    targetComponent: "ntoskrnl.exe (Ke* API)",
    commandName: "kdbg / ntoskrnl",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el 'Kernel' estricto de Windows solo ocupa una fracción diminuta de ntoskrnl.exe y su único trabajo es despachar hilos y sincronizar procesadores?",
      mythVsTruth: {
        mentira: "El kernel de Windows se encarga de crear ventanas, guardar archivos y gestionar la red.",
        verdad: "Esas tareas pertenecen al Executive y subsistemas; el Kernel Ke* solo gestiona primitivas de sincronización (Spinlocks, Mutexes) y el Scheduler.",
        comprobalo: "Inspecciona los símbolos con prefijo Ke vs Ob/Mm/Io en ntoskrnl.exe: verás la estricta separación de capas."
      }
    },
    entende: {
      queEs: "El núcleo de bajo nivel de Windows NT responsable del despacho de interrupciones, conmutación de contexto de hilos y primitivas de multiprocesamiento simétrico (SMP).",
      paraQueSirve: "Garantizar que múltiples núcleos de CPU puedan coordinarse sin condiciones de carrera mediante primitivas atómicas de hardware.",
      quePasaSiFalta: "El hardware no podría alternar entre tareas concurrentes y el sistema se bloquearía en el primer bucle infinito."
    },
    interactua: {
      cliExample: "dumpbin /exports C:\\Windows\\System32\\ntoskrnl.exe | findstr \"KeInitialize\"",
      psExample: "Get-Item C:\\Windows\\System32\\ntoskrnl.exe | Select-Object VersionInfo, Length, LastWriteTime",
      syntaxBreakdown: "Lista las funciones exportadas por el microkernel que inician primitivas de sincronización del procesador.",
      whatToLookFor: "Llamadas KeAcquireSpinLockAtDpcLevel y KeWaitForSingleObject.",
      technicalMetrics: "Tiempo de despacho de interrupción típico: < 500 nanosegundos en arquitecturas x64 modernas."
    },
    alertaEVO: {
      reversibilityRule: "Operación de sólo lectura e inspección de metadatos de kernel.",
      safetyWarning: "Nunca intentes modificar ntoskrnl.exe en disco; PatchGuard (KPP) y Secure Boot invalidarán el arranque."
    },
    evidenceBadge: {
      code: "NT-CORE-KE",
      label: "Microkernel Verified"
    }
  },
  {
    id: "inv-32-02",
    code: "32.02",
    title: "Executive",
    subtitle: "Capa de servicios del sistema operativo: Ob, Ps, Mm, Io, Se y Cm",
    targetMechanism: "NT Executive Subsystems",
    targetComponent: "ntoskrnl.exe (Executive Layer)",
    commandName: "ntoskrnl.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Alguna vez te preguntaste qué significan los prefijos Nt, Zw, Mm, Ob e Io en las fallas del sistema? Representan los 6 gerentes invisibles del Executive.",
      mythVsTruth: {
        mentira: "Windows es un sistema monolítico sin arquitectura modular.",
        verdad: "Windows NT está estructurado en gerentes autónomos (Object, Process, Memory, I/O, Security, Config) que se comunican por contratos estrictos.",
        comprobalo: "Procesa los nombres de funciones de ntoskrnl: cada subsistema tiene su namespace de 2 letras."
      }
    },
    entende: {
      queEs: "La capa superior del modo kernel que envuelve al microkernel y expone los servicios del sistema operativo a las aplicaciones de usuario mediante System Calls.",
      paraQueSirve: "Gestionar memoria virtual (Mm), objetos (Ob), procesos (Ps), seguridad (Se) y el registro (Cm).",
      quePasaSiFalta: "Las aplicaciones no tendrían forma estandarizada de abrir archivos, reservar memoria ni autenticar usuarios."
    },
    interactua: {
      cliExample: "dumpbin /exports C:\\Windows\\System32\\ntoskrnl.exe | findstr \"NtCreate\"",
      psExample: "Get-Command -Module Microsoft.PowerShell.Management | Where-Object { $_.Name -match 'Process|Service|Item' }",
      syntaxBreakdown: "Inspecciona la tabla de system calls NtCreateFile, NtCreateProcess, NtCreateKey.",
      whatToLookFor: "Validación de parámetros y punteros de modo usuario antes de delegar en el kernel.",
      technicalMetrics: "Más de 450 system calls expuestas a través de la tabla SSDT (System Service Descriptor Table)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura conceptual.",
      safetyWarning: "La capa Executive impone cuotas de recursos; sobrecargarla agota el Nonpaged Pool."
    },
    evidenceBadge: {
      code: "NT-EXEC",
      label: "Executive Layer Inspected"
    }
  },
  {
    id: "inv-32-03",
    code: "32.03",
    title: "HAL",
    subtitle: "Hardware Abstraction Layer: hal.dll, ocultamiento de APIC/PIC, timers y buses",
    targetMechanism: "Platform Independence & Hardware Isolation",
    targetComponent: "hal.dll",
    commandName: "hal.dll",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué el mismo kernel de Windows puede correr tanto en una placa madre Intel como AMD con diferentes controladores de interrupción? La respuesta es la HAL.",
      mythVsTruth: {
        mentira: "El kernel de Windows habla directamente con los registros del chipset de la placa madre.",
        verdad: "El kernel nunca toca controladores de interrupción físicos; le pide a la HAL que enmascare líneas IRQ o configure temporizadores.",
        comprobalo: "Verifica C:\\Windows\\System32\\hal.dll: es la única DLL que conoce la topología física del chipset."
      }
    },
    entende: {
      queEs: "Una biblioteca dinámica en Ring 0 que aísla al resto del sistema operativo de las peculiaridades de hardware de la placa base (APIC, MSI-X, timers ACPI).",
      paraQueSirve: "Permitir que el código del kernel sea 100% idéntico entre distintos fabricantes y modelos de procesadores.",
      quePasaSiFalta: "Windows requeriría una compilación de kernel distinta para cada modelo de motherboard del mercado."
    },
    interactua: {
      cliExample: "dumpbin /exports C:\\Windows\\System32\\hal.dll | findstr \"Halp\"",
      psExample: "Get-Item C:\\Windows\\System32\\hal.dll | Format-List",
      syntaxBreakdown: "Lista las funciones de gestión de interrupciones y control de timers exportadas por la HAL.",
      whatToLookFor: "Exportaciones como HalRequestSoftwareInterrupt y HalCalibratePerformanceCounter.",
      technicalMetrics: "Capa de indirección de costo mínimo: llamadas resueltas mediante macros directas en tiempo de compilación."
    },
    alertaEVO: {
      reversibilityRule: "Operación de inspección pasiva.",
      safetyWarning: "Modificar la HAL produce el BSOD irrecuperable HAL_INITIALIZATION_FAILED."
    },
    evidenceBadge: {
      code: "HAL-NT",
      label: "HAL Isolation Active"
    }
  },
  {
    id: "inv-32-04",
    code: "32.04",
    title: "Object Manager",
    subtitle: "El namespace global, directorio de tipos de objetos y punteros con conteo de referencias",
    targetMechanism: "Unified Object Model & Namespace Hierarchy",
    targetComponent: "Ob* Subsystem / WinObj",
    commandName: "winobj.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que para Windows casi todo es un 'Objeto' con el mismo formato: un archivo, un proceso, una clave de registro y un semáforo comparten la misma cabecera?",
      mythVsTruth: {
        mentira: "C:\\ es la raíz de todo el almacenamiento en Windows.",
        verdad: "C: es solo un enlace simbólico dentro del namespace del Object Manager: \\GLOBAL??\\C: apunta a \\Device\\HarddiskVolume3.",
        comprobalo: "Abre WinObj de Sysinternals y navega por el directorio \\GLOBAL??: verás que las letras de unidad son alias de dispositivos."
      }
    },
    entende: {
      queEs: "El subsistema del Executive encargado de crear, rastrear, proteger y destruir todos los recursos del sistema operativo utilizando un espacio de nombres jerárquico.",
      paraQueSirve: "Aplicar seguridad unificada (DACLs) a cualquier recurso y prevenir memory leaks mediante conteo de referencias (PointerCount y HandleCount).",
      quePasaSiFalta: "Cada subsistema tendría que inventar su propio sistema de seguridad y nombres, generando caos e inseguridad."
    },
    interactua: {
      cliExample: "winobj.exe",
      psExample: "Get-CimInstance Win32_Volume | Select-Object DriveLetter, DeviceID",
      syntaxBreakdown: "Ejecuta WinObj para explorar el namespace de objetos o consulta el mapeo de volúmenes NT a letras de unidad.",
      whatToLookFor: "Directorio \\Device, \\Driver, \\Sessions y \\KernelObjects.",
      technicalMetrics: "Estructura OBJECT_HEADER de 48 bytes que precede a todo objeto alojado en el pool de kernel."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No alteres enlaces en \\GLOBAL??; romperás el acceso de los programas a sus rutas de disco."
    },
    evidenceBadge: {
      code: "OB-MGR",
      label: "Object Namespace Mapped"
    }
  },
  {
    id: "inv-32-05",
    code: "32.05",
    title: "Process Manager",
    subtitle: "EPROCESS, PEB, KPROCESS y ciclo de vida de procesos",
    targetMechanism: "Process Lifecycle & Security Boundaries",
    targetComponent: "Ps* Subsystem / EPROCESS Structure",
    commandName: "Get-Process",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que un proceso en Windows en realidad no ejecuta código? Un proceso es solo un contenedor de recursos (memoria y handles); quienes ejecutan código son sus hilos.",
      mythVsTruth: {
        mentira: "La CPU cambia de proceso cuando saltas de un programa a otro.",
        verdad: "La CPU solo conmuta entre hilos (Threads). Si dos hilos pertenecen a distintos procesos, el scheduler actualiza la tabla de páginas (CR3).",
        comprobalo: "Observa en Process Explorer que un proceso sin hilos (Threads = 0) no puede existir en Windows."
      }
    },
    entende: {
      queEs: "El gestor que administra la estructura de datos EPROCESS en Ring 0 y el Process Environment Block (PEB) en Ring 3, representando la identidad y recursos de un ejecutable.",
      paraQueSirve: "Asignar un espacio virtual privado de 128 TB (en x64), una tabla de handles y un token de seguridad a un conjunto de hilos.",
      quePasaSiFalta: "Un programa podría sobreescribir la memoria de otro programa o secuestrar sus descriptores de archivos."
    },
    interactua: {
      cliExample: "tasklist /fi \"PID eq 4\"",
      psExample: "Get-Process -Id 4 | Select-Object Id, ProcessName, HandleCount, WorkingSet64, Threads",
      syntaxBreakdown: "Consulta las propiedades del proceso System (PID 4), el contenedor de los hilos de kernel de Windows.",
      whatToLookFor: "Recuento de hilos, tiempo de CPU y volumen de descriptores abiertos en EPROCESS.",
      technicalMetrics: "Tamaño de la estructura EPROCESS: ~1.5 KB en memoria no paginada por proceso."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Terminar procesos con TerminateProcess no da oportunidad de limpiar buffers de disco pendientes."
    },
    evidenceBadge: {
      code: "PS-EPROC",
      label: "EPROCESS Context Verified"
    }
  },
  {
    id: "inv-32-06",
    code: "32.06",
    title: "Thread Scheduler",
    subtitle: "ETHREAD, TEB, Quantum, colas de prioridad 0-31 y balanceo de afinidad",
    targetMechanism: "Thread Dispatching & Preemptive Multitasking",
    targetComponent: "KeSetPriorityThread / KiSelectNextThread",
    commandName: "typeperf",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué cuando una app se congela el mouse sigue moviéndose suavemente a 144Hz? Porque el mouse corre en un hilo con prioridad de tiempo real por encima de la app.",
      mythVsTruth: {
        mentira: "Windows divide el procesador en partes exactamente iguales entre todos los programas.",
        verdad: "Windows usa un planificador apropiativo por prioridades dinámicas (0 a 31) donde el hilo con mayor prioridad ejecutable monopoliza el núcleo.",
        comprobalo: "Abre Process Explorer, mira las propiedades de un hilo: verás su Base Priority y Dynamic Priority oscilando en tiempo real."
      }
    },
    entende: {
      queEs: "El componente del microkernel que selecciona qué hilo listo para ejecutar (Ready state) recibe el siguiente intervalo de tiempo de CPU (Quantum).",
      paraQueSirve: "Garantizar interactividad inmediata al usuario (hilos de interfaz reciben boosts de prioridad al recibir clics o teclas) y prevenir inanición (starvation).",
      quePasaSiFalta: "Cualquier hilo con un bucle `while(true)` congelaría la computadora por completo."
    },
    interactua: {
      cliExample: "wmic process where \"Name='explorer.exe'\" get Priority",
      psExample: "Get-Process explorer | Select-Object -ExpandProperty PriorityClass",
      syntaxBreakdown: "Consulta la clase de prioridad del explorador de Windows (Normal = 8).",
      whatToLookFor: "Prioridades entre 16 y 31 (clase RealTime), que requieren privilegios de Administrador para asignarse.",
      technicalMetrics: "Duración de un Quantum estándar en Windows cliente: 2 o 3 ticks de reloj (~30 ms a 36 ms)."
    },
    alertaEVO: {
      reversibilityRule: "Las prioridades se recalculan dinámicamente; cambiar afinidad de CPU en Task Manager se pierde al cerrar la app.",
      safetyWarning: "Poner un programa pesado en prioridad Realtime puede congelar el teclado, el mouse y la pila de red."
    },
    evidenceBadge: {
      code: "TH-SCHED",
      label: "Quantum Dispatcher"
    }
  },
  {
    id: "inv-32-07",
    code: "32.07",
    title: "Memory Manager",
    subtitle: "VMM, Page Tables de 4 niveles, Commit Limit, VAD Tree y Working Sets",
    targetMechanism: "Virtual Memory Management & Paging Subsystem",
    targetComponent: "Mm* Subsystem / ntoskrnl.exe",
    commandName: "vmmap.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando una app reserva 1 GB con malloc(), Windows no gasta un solo byte de RAM física hasta que la app escribe en esa dirección?",
      mythVsTruth: {
        mentira: "La memoria virtual es el archivo pagefile.sys en el disco rígido.",
        verdad: "La memoria virtual es el direccionamiento completo de la CPU; pagefile.sys es solo un disco de respaldo temporal para páginas expulsadas.",
        comprobalo: "Inspecciona una app con VMMap de Sysinternals: verás la diferencia entre memoria Reservada (sin costo) y Comprometida (Committed)."
      }
    },
    entende: {
      queEs: "El subsistema del Executive que traduce direcciones virtuales de 64 bits en direcciones físicas usando tablas de páginas multinivel (PML4, PDPT, PD, PT) asistidas por hardware (MMU).",
      paraQueSirve: "Darle a cada proceso la ilusión de tener 128 TB de memoria contigua y proteger la memoria del kernel contra escrituras ilegales.",
      quePasaSiFalta: "Un error de puntero en una aplicación corrompería los datos de todos los demás programas de la computadora."
    },
    interactua: {
      cliExample: "wmic OS get TotalVirtualMemorySize, FreeVirtualMemory, SizeStoredInPagingFiles",
      psExample: "Get-CimInstance Win32_OperatingSystem | Select-Object TotalVirtualMemorySize, FreeVirtualMemory, TotalVisibleMemorySize, FreePhysicalMemory",
      syntaxBreakdown: "Compara el límite de compromiso de memoria virtual frente a la memoria RAM física visible.",
      whatToLookFor: "El ratio Commit Limit vs Committed Bytes; si se acerca al 100%, las aplicaciones fallarán por falta de memoria.",
      technicalMetrics: "Tablas de páginas x64 de 4 niveles con soporte de páginas estándar de 4 KB y Large Pages de 2 MB."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura e inspección de memoria virtual.",
      safetyWarning: "Desactivar el archivo de paginación no aumenta la velocidad y causa crashes cuando el Commit Limit toca techo."
    },
    evidenceBadge: {
      code: "MM-VMM",
      label: "Virtual Memory Paging"
    }
  },
  {
    id: "inv-32-08",
    code: "32.08",
    title: "I/O Manager",
    subtitle: "Paquetes IRP - I/O Request Packets, pila de drivers y modelos asíncronos",
    targetMechanism: "Packet-Driven Asynchronous Input/Output",
    targetComponent: "Io* Subsystem / IRP Architecture",
    commandName: "fltmc.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo viaja un archivo desde que haces clic en 'Guardar' hasta que llega a los chips del SSD? Viaja como un paquete de datos llamado IRP a través de una pila de drivers.",
      mythVsTruth: {
        mentira: "Windows lee del disco de forma síncrona esperando a que el disco responda.",
        verdad: "Todo el subsistema de I/O de NT es asíncrono basado en paquetes (IRP); el hilo continúa trabajando y recibe una notificación al terminar.",
        comprobalo: "Usa fltmc.exe para ver los filtros de antivirus y compresión que interceptan los IRPs antes de llegar al disco."
      }
    },
    entende: {
      queEs: "El subsistema que define una interfaz uniforme para todos los dispositivos de hardware, transformando solicitudes de lectura/escritura en estructuras IRP independientes del dispositivo.",
      paraQueSirve: "Permitir que capas de software (antivirus, cifrado BitLocker, RAID) filtren y transformen datos sin que la aplicación de usuario deba saberlo.",
      quePasaSiFalta: "Cada aplicación tendría que incluir drivers para cada modelo de disco y tarjeta existente en el mundo."
    },
    interactua: {
      cliExample: "fltmc.exe filters",
      psExample: "Get-Service -Name storahci, stornvme, disk | Format-Table Name, Status, StartType",
      syntaxBreakdown: "Lista los minifiltros del sistema de archivos cargados en la pila de I/O de Windows.",
      whatToLookFor: "Filtros con altitudes elevadas (ej. 320000 para antivirus) que puedan añadir latencia a las lecturas.",
      technicalMetrics: "Estructura IRP con MajorFunction (IRP_MJ_READ, IRP_MJ_WRITE) y pila de IO_STACK_LOCATION."
    },
    alertaEVO: {
      reversibilityRule: "fltmc.exe filters es un comando seguro de lectura.",
      safetyWarning: "Descargar un minifiltro con fltmc unload en caliente puede dejar archivos a medio escribir o desactivar la protección antivirus."
    },
    evidenceBadge: {
      code: "IO-IRP",
      label: "IRP Stack Verified"
    }
  },
  {
    id: "inv-32-09",
    code: "32.09",
    title: "Cache Manager",
    subtitle: "CcInitializeCacheMap, Lazy Writer y Read Ahead en páginas del sistema",
    targetMechanism: "Integrated File Caching Engine",
    targetComponent: "Cc* Subsystem / Cache Manager",
    commandName: "rammap.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué la segunda vez que abres un juego pesado tarda solo 3 segundos en vez de 30? El Cache Manager de Windows retuvo los archivos mapeados en memoria virtual.",
      mythVsTruth: {
        mentira: "La memoria caché de Windows es estática y fija.",
        verdad: "El Cache Manager trabaja en simbiosis con el Memory Manager; proyecta archivos directamente en el espacio de direcciones de kernel y crece dinámicamente.",
        comprobalo: "Monitorea con PerfMon el contador Memory\\Cache Bytes durante la copia de un archivo grande."
      }
    },
    entende: {
      queEs: "El subsistema especializado en optimizar el acceso a disco manteniendo copias de bloques de archivos frecuentemente accedidos en memoria.",
      paraQueSirve: "Agrupar escrituras en ráfagas eficientes (Lazy Writer) y predecir lecturas secuenciales antes de que la app las solicite (Read Ahead).",
      quePasaSiFalta: "Cada operación de lectura requeriría un acceso físico directo al bus de almacenamiento, volviendo a Windows 100 veces más lento."
    },
    interactua: {
      cliExample: "typeperf \"\\Memory\\Cache Bytes\" -sc 3",
      psExample: "Get-Counter -Counter \"\\Memory\\Cache Bytes\" | Select-Object -ExpandProperty CounterSamples",
      syntaxBreakdown: "Mide el tamaño actual de la memoria caché de archivos del sistema operativo en bytes.",
      whatToLookFor: "Fluctuaciones rápidas durante transferencias masivas de datos.",
      technicalMetrics: "Algoritmo de Lazy Writer con vaciado periódico cada 1 segundo para hilos sucios (dirty pages)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Forzar el vaciado de caché constante degrada la vida útil de unidades SSD por amplificación de escritura."
    },
    evidenceBadge: {
      code: "CC-CACHE",
      label: "System Cache Manager"
    }
  },
  {
    id: "inv-32-10",
    code: "32.10",
    title: "Configuration Manager",
    subtitle: "Cm - El motor interno del Registro de Windows, colmenas y log transaccional",
    targetMechanism: "Transactional Registry Database Engine",
    targetComponent: "Cm* Subsystem / Hive Files",
    commandName: "reg.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Sabías que el Registro de Windows no es un archivo único, sino un conjunto de bases de datos binarias llamadas 'Hives' sincronizadas con logs transaccionales .LOG?",
      mythVsTruth: {
        mentira: "El Registro de Windows es solo un archivo de texto gigante con formato .reg.",
        verdad: "Es un motor transaccional de alta concurrencia que escribe en celdas binarias (HCELLs) y utiliza logs journal para resistir cortes de energía sin corromperse.",
        comprobalo: "Mira la carpeta C:\\Windows\\System32\\config: verás SYSTEM, SOFTWARE y sus archivos .LOG transaccionales."
      }
    },
    entende: {
      queEs: "El gestor de base de datos interno del kernel que implementa el Registro de Windows (HKLM, HKCU, HKCR) y su persistencia en disco.",
      paraQueSirve: "Proveer almacenamiento centralizado, indexado y con control de acceso por listas de seguridad (DACLs) para toda la configuración del sistema.",
      quePasaSiFalta: "Windows tendría que parsear miles de archivos .INI en cada arranque, demorando minutos en iniciar."
    },
    interactua: {
      cliExample: "reg query \"HKLM\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0\" /v \"ProcessorNameString\"",
      psExample: "Get-ItemProperty -Path \"HKLM:\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0\" -Name \"ProcessorNameString\"",
      syntaxBreakdown: "Consulta el árbol de hardware volátil generado por la HAL y el kernel en cada arranque.",
      whatToLookFor: "Claves bajo HKLM\\HARDWARE: son 100% volátiles y se reconstruyen en RAM en cada inicio.",
      technicalMetrics: "Estructura de celdas binarias de 32 bytes agrupadas en bloques de 4 KB (HBLOCKs)."
    },
    alertaEVO: {
      reversibilityRule: "Hacer copia de respaldo con reg export antes de modificar cualquier valor de Registro.",
      safetyWarning: "Modificar claves en HKLM\\SYSTEM\\CurrentControlSet puede impedir que Windows vuelva a arrancar."
    },
    evidenceBadge: {
      code: "CM-HIVE",
      label: "Registry Engine Audited"
    }
  },
  {
    id: "inv-32-11",
    code: "32.11",
    title: "Security Reference Monitor",
    subtitle: "SRM - SeAccessCheck, Access Token, SIDs, privilegios y DACLs",
    targetMechanism: "Kernel-Level Access Control & Authorization",
    targetComponent: "Se* Subsystem / LSASS Integration",
    commandName: "whoami.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Quién decide realmente si tienes permiso para abrir un archivo o matar un proceso? El Security Reference Monitor (SRM), el único componente de Ring 0 que audita cada acceso.",
      mythVsTruth: {
        mentira: "El servicio LSASS comprueba los permisos de cada archivo que abres.",
        verdad: "LSASS solo autentica (quién eres); quien autoriza en cada milisegundo (qué puedes hacer) es el SRM en Ring 0 con SeAccessCheck.",
        comprobalo: "Usa whoami /all para ver tu Access Token completo con SIDs y privilegios asignados por el SRM."
      }
    },
    entende: {
      queEs: "El módulo central de seguridad del Executive de NT que evalúa el Security Descriptor de un objeto contra el Access Token del hilo solicitante.",
      paraQueSirve: "Garantizar que ningún proceso, ni siquiera con malware, pueda saltarse los permisos definidos en las listas de control de acceso (DACL).",
      quePasaSiFalta: "Cualquier usuario invitado podría leer los correos del administrador o desarmar las defensas del sistema."
    },
    interactua: {
      cliExample: "whoami /priv",
      psExample: "Get-Acl C:\\Windows\\System32 | Select-Object -ExpandProperty Access | Select-Object -First 3",
      syntaxBreakdown: "Lista los privilegios de seguridad asignados al token de la sesión activa del usuario.",
      whatToLookFor: "Privilegios como SeDebugPrivilege (permite depurar y leer memoria de otros procesos) o SeBackupPrivilege.",
      technicalMetrics: "Evaluación en tiempo O(1) de máscaras de bits ACCESS_MASK (GENERIC_READ, GENERIC_WRITE)."
    },
    alertaEVO: {
      reversibilityRule: "whoami es un comando de solo lectura.",
      safetyWarning: "Habilitar privilegios elevados en scripts desatendidos crea vectores de escalamiento de privilegios."
    },
    evidenceBadge: {
      code: "SE-SRM",
      label: "Security Monitor Validated"
    }
  },
  {
    id: "inv-32-12",
    code: "32.12",
    title: "Plug and Play Manager",
    subtitle: "Enumeración de devnodes, árboles PDO/FDO y dispatch de IRP_MN_START_DEVICE",
    targetMechanism: "Hardware Enumeration & Driver Binding",
    targetComponent: "PnP* Subsystem / devcon.exe",
    commandName: "pnputil.exe",
    riskLevel: "LOW_RISK",
    descubri: {
      hook: "¿Qué pasa en el kernel cuando conectas un pendrive USB? El PnP Manager detecta el cambio eléctrico, crea un devnode PDO y carga los drivers FDO en menos de 100 ms.",
      mythVsTruth: {
        mentira: "El Administrador de Dispositivos es quien instala los drivers.",
        verdad: "Device Manager es solo una interfaz gráfica; el PnP Manager en Ring 0 arbitra el árbol de devnodes e interrupciones.",
        comprobalo: "Ejecuta pnputil /enum-devices /connected: verás los devnodes activos gobernados por el PnP Manager."
      }
    },
    entende: {
      queEs: "El subsistema del kernel responsable de detectar dispositivos conectados, construir el árbol jerárquico de hardware y asignarles recursos (puertos I/O, IRQs, rangos DMA).",
      paraQueSirve: "Permitir conectar y desconectar periféricos en caliente sin reiniciar la computadora.",
      quePasaSiFalta: "Windows solo reconocería el hardware presente al momento exacto de arrancar y no soportaría USB ni Thunderbolt."
    },
    interactua: {
      cliExample: "pnputil /enum-devices /class DiskDrive",
      psExample: "Get-PnpDevice -Class DiskDrive | Select-Object Status, Class, FriendlyName, InstanceId",
      syntaxBreakdown: "Enumera los devnodes de almacenamiento físico reconocidos por la pila PnP.",
      whatToLookFor: "Dispositivos en estado 'Error' o con código de problema CM_PROB_* (ej. Código 10, Código 43).",
      technicalMetrics: "Manejo del ciclo de vida IRP_MN_START_DEVICE, IRP_MN_QUERY_REMOVE_DEVICE y IRP_MN_STOP_DEVICE."
    },
    alertaEVO: {
      reversibilityRule: "Desinstalar un driver con pnputil /delete-driver es permanente si no se respalda la tienda de drivers (DriverStore).",
      safetyWarning: "No deshabilites controladores raíz en el árbol PnP como ACPI\\PNP0A08."
    },
    evidenceBadge: {
      code: "PNP-DEV",
      label: "PnP Devnode Hierarchy"
    }
  },
  {
    id: "inv-32-13",
    code: "32.13",
    title: "Power Manager",
    subtitle: "Transiciones de estados de energía ACPI S0-S5, D0-D3 y Modern Standby",
    targetMechanism: "ACPI Power State Coordination",
    targetComponent: "Po* Subsystem / powercfg.exe",
    commandName: "powercfg.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué a veces tu laptop amanece caliente y sin batería dentro de la mochila? Por una transición fallida en el estado S0 Low Power Idle (Modern Standby).",
      mythVsTruth: {
        mentira: "Suspender la PC simplemente apaga los componentes uno tras otro sin avisarles.",
        verdad: "El Power Manager envía IRPs de energía (IRP_MN_SET_POWER) a toda la pila de drivers; si un solo driver no responde, la suspensión se aborta.",
        comprobalo: "Ejecuta powercfg /requests para ver qué programas o drivers están bloqueando el modo de reposo del procesador."
      }
    },
    entende: {
      queEs: "El gestor que coordina las políticas de consumo de energía del sistema operativo con el hardware mediante estándares ACPI y temporizadores de inactividad.",
      paraQueSirve: "Optimizar el consumo de batería, gestionar la hibernación (hiberfil.sys) y regular la frecuencia de los núcleos de CPU (P-States).",
      quePasaSiFalta: "La CPU funcionaría al 100% de voltaje constante, agotando la batería en menos de una hora y sobrecalentando el equipo."
    },
    interactua: {
      cliExample: "powercfg /requests",
      psExample: "Get-CimInstance -Namespace root\\cimv2\\power -ClassName Win32_PowerPlan",
      syntaxBreakdown: "Lista las solicitudes activas de aplicaciones y drivers que impiden que la pantalla o el sistema se apaguen.",
      whatToLookFor: "Bloqueos tipo DISPLAY, SYSTEM o AWAYMODE causados por reproductores o servicios de fondo.",
      technicalMetrics: "Estados globales de sistema ACPI S0 (Working) a S4 (Hibernate) y estados de dispositivo D0 (Full On) a D3 (Cold Off)."
    },
    alertaEVO: {
      reversibilityRule: "powercfg /requests es un diagnóstico no destructivo.",
      safetyWarning: "Desactivar la hibernación con powercfg /h off elimina hiberfil.sys y deshabilita la función de Inicio Rápido (Fast Startup)."
    },
    evidenceBadge: {
      code: "PO-ACPI",
      label: "Power State Engine"
    }
  },
  {
    id: "inv-32-14",
    code: "32.14",
    title: "System Calls",
    subtitle: "Transición de modo usuario a kernel mediante `syscall` en x64 y KiSystemCall64",
    targetMechanism: "Hardware Ring Transition & System Call Dispatcher",
    targetComponent: "KiSystemCall64 / MSR_LSTAR",
    commandName: "syscall",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo cruza una aplicación la barrera de seguridad de Ring 3 a Ring 0? Ejecuta la instrucción de ensamblador `syscall`, transfiriendo el control al vector KiSystemCall64.",
      mythVsTruth: {
        mentira: "Las llamadas al sistema son funciones normales en C que se enlazan con el programa.",
        verdad: "Son instrucciones privilegiadas que conmutan el nivel de CPU y cambian el puntero de pila (RSP) a la pila de kernel privada del hilo.",
        comprobalo: "Depura un programa en x64: verás que ntdll.dll carga el número de syscall en EAX y ejecuta la instrucción `syscall`."
      }
    },
    entende: {
      queEs: "El mecanismo de hardware y software que permite a una aplicación no privilegiada solicitar de forma segura un servicio al kernel de Windows.",
      paraQueSirve: "Impedir que el código de usuario salte a direcciones arbitrarias de kernel, forzando la entrada por un único punto verificado (MSR_LSTAR).",
      quePasaSiFalta: "No existiría ninguna forma de interactuar con hardware, pantalla o archivos sin dar acceso de control total a la app."
    },
    interactua: {
      cliExample: "dumpbin /disasm C:\\Windows\\System32\\ntdll.dll | findstr /i \"syscall\"",
      psExample: "# Desensamblado conceptual de stub de syscall en ntdll\n# mov r10, rcx; mov eax, <SyscallID>; syscall; ret",
      syntaxBreakdown: "Inspecciona el código máquina en ntdll.dll que prepara los registros antes de disparar la transición a Ring 0.",
      whatToLookFor: "Secuencia 'mov r10, rcx' seguido de 'syscall' y 'ret'.",
      technicalMetrics: "Latencia de conmutación de syscall en procesadores x64 modernos: ~15 a 30 nanosegundos."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura conceptual.",
      safetyWarning: "Las mitigaciones contra Meltdown/Spectre (KVA Shadowing) introducen sobrecarga deliberada en cada syscall para proteger la memoria de kernel."
    },
    evidenceBadge: {
      code: "SYS-CALL64",
      label: "Ring Transition Dispatcher"
    }
  },
  {
    id: "inv-32-15",
    code: "32.15",
    title: "Kernel Mode",
    subtitle: "Ejecución sin restricciones en Ring 0 y acceso a espacio de memoria superior",
    targetMechanism: "Supervisor Privilege Execution",
    targetComponent: "CPU Ring 0 / ntoskrnl.exe",
    commandName: "kdbg",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "En Kernel Mode no hay leyes ni árbitro: si una línea de código escribe en un puntero inválido, no sale una ventana de error; toda la computadora colapsa en un BSOD.",
      mythVsTruth: {
        mentira: "Los antivirus corren en modo usuario como los navegadores web.",
        verdad: "El motor de intercepción de un antivirus debe correr en Kernel Mode (como driver de Ring 0) para tener autoridad sobre otros procesos.",
        comprobalo: "Usa fltmc para ver los drivers de antivirus cargados en Ring 0."
      }
    },
    entende: {
      queEs: "El modo de ejecución de la CPU (CPL = 0) donde el código tiene acceso irrestricto a todas las instrucciones de procesador y al mapa de memoria completo.",
      paraQueSirve: "Ejecutar el sistema operativo, interactuar con el silicio de los componentes y proteger el funcionamiento de la máquina.",
      quePasaSiFalta: "Un sistema operativo no podría aislar la memoria de las aplicaciones ni arbitrar recursos físicos."
    },
    interactua: {
      cliExample: "driverquery /v",
      psExample: "Get-WmiObject Win32_SystemDriver | Where-Object { $_.State -eq 'Running' } | Select-Object -First 5 Name, PathName",
      syntaxBreakdown: "Lista los módulos de código de terceros que tienen permiso de ejecución en Ring 0 en tu equipo.",
      whatToLookFor: "Drivers obsoletos con fechas de compilación de más de 5 años operando en Ring 0.",
      technicalMetrics: "Espacio de memoria de 64 bits en Windows: 0xFFFF000000000000 a 0xFFFFFFFFFFFFFFFF reservado para Ring 0."
    },
    alertaEVO: {
      reversibilityRule: "driverquery es 100% lectura.",
      safetyWarning: "Cualquier fallo de un driver de terceros en Ring 0 tira abajo el sistema completo instantáneamente."
    },
    evidenceBadge: {
      code: "RING0-EXEC",
      label: "Kernel Privilege Map"
    }
  },
  {
    id: "inv-32-16",
    code: "32.16",
    title: "User Mode",
    subtitle: "Aislamiento de procesos en Ring 3 y espacio de direcciones virtuales privado",
    targetMechanism: "Sandboxed User Process Isolation",
    targetComponent: "CPU Ring 3 / Win32 Subsystem",
    commandName: "tasklist",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué cuando Google Chrome colapsa con '¡Oh, no!' tu Windows sigue funcionando y tu música no se detiene? Gracias a la barrera de User Mode.",
      mythVsTruth: {
        mentira: "Si un programa consume 100% de memoria, puede borrar los archivos del sistema operativo en RAM.",
        verdad: "En User Mode el hardware de la CPU deniega físicamente cualquier intento de leer o escribir en direcciones de memoria del kernel.",
        comprobalo: "Cualquier intento de desreferenciar un puntero de kernel desde User Mode lanza STATUS_ACCESS_VIOLATION (0xC0000005) y solo muere la app infractora."
      }
    },
    entende: {
      queEs: "El modo de procesador no privilegiado (CPL = 3) donde se ejecutan todas las aplicaciones de usuario y servicios no críticos.",
      paraQueSirve: "Confinar el impacto de bugs, errores de programación y crashes a un espacio seguro sin afectar la estabilidad global de Windows.",
      quePasaSiFalta: "El cuelgue de un procesador de texto o una pestaña del navegador congelaría la PC entera."
    },
    interactua: {
      cliExample: "tasklist /v",
      psExample: "Get-Process | Where-Object { $_.SessionId -gt 0 } | Select-Object -First 5 ProcessName, Id, SessionId",
      syntaxBreakdown: "Lista las aplicaciones que operan en las sesiones interactivas de Ring 3.",
      whatToLookFor: "Procesos de usuario interactivos aislados por sesión gráfica.",
      technicalMetrics: "Rango de direcciones virtuales privadas en x64: 0x0000000000000000 a 0x00007FFFFFFFFFFF (128 TB por proceso)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Matar un proceso en User Mode con /F puede perder cambios no guardados en ese documento."
    },
    evidenceBadge: {
      code: "RING3-ISOL",
      label: "User Isolation Verified"
    }
  },
  {
    id: "inv-32-17",
    code: "32.17",
    title: "Ring 0",
    subtitle: "Nivel de privilegio de CPU para código de núcleo, HAL y controladores",
    targetMechanism: "Current Privilege Level (CPL=0) Hardware Ring",
    targetComponent: "x86/x64 Architecture Protection Rings",
    commandName: "kdbg",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "Las CPUs modernas soportan 4 anillos de protección (Ring 0, 1, 2 y 3). ¿Por qué Windows solo usa el Ring 0 y el Ring 3?",
      mythVsTruth: {
        mentira: "Windows utiliza los 4 anillos de protección de los microprocesadores Intel.",
        verdad: "Windows NT fue diseñado para ser portable a procesadores Alpha, MIPS y PowerPC que solo tenían 2 niveles de privilegio (Supervisor y User). Por eso Windows ignora Ring 1 y 2.",
        comprobalo: "Consulta la arquitectura de seguridad de NT: solo existen dos dominios de protección de hardware."
      }
    },
    entende: {
      queEs: "El estado de mayor privilegio del microprocesador que permite ejecutar instrucciones como `cli`, `sti`, `lidt`, modificar registros de control (CR0, CR3, CR4) y configurar MSRs.",
      paraQueSirve: "Otorgar al kernel el control absoluto de la gestión de memoria y el despacho de interrupciones de hardware.",
      quePasaSiFalta: "Ningún software podría configurar la tabla de paginación ni encender las funciones de seguridad de la CPU."
    },
    interactua: {
      cliExample: "wmic cpu get Architecture, AddressWidth, DataWidth",
      psExample: "Get-CimInstance Win32_Processor | Select-Object Name, Architecture, NumberOfCores, NumberOfLogicalProcessors",
      syntaxBreakdown: "Consulta la arquitectura de procesamiento que implementa los anillos de protección.",
      whatToLookFor: "Arquitectura 9 (x64) con registros de 64 bits.",
      technicalMetrics: "El registro de segmento CS bits 0-1 codifican el Current Privilege Level (CPL = 00b)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Herramientas de terceros con drivers vulnerables en Ring 0 (BYOVD - Bring Your Own Vulnerable Driver) son el principal vector de malware moderno."
    },
    evidenceBadge: {
      code: "HW-RING0",
      label: "CPU Ring 0 Architecture"
    }
  },
  {
    id: "inv-32-18",
    code: "32.18",
    title: "Ring 3",
    subtitle: "Nivel de menor privilegio que protege al sistema contra fallos de aplicaciones",
    targetMechanism: "Hardware Ring 3 Sandboxing",
    targetComponent: "Current Privilege Level (CPL=3)",
    commandName: "whoami",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué le pasa a la CPU si una aplicación intenta ejecutar una instrucción prohibida de Ring 0 como `in` o `out`? La CPU dispara una interrupción por Excepción General de Protección (#GP).",
      mythVsTruth: {
        mentira: "La protección de Ring 3 es un programa de software de Windows que vigila a las apps.",
        verdad: "La protección de Ring 3 está grabada en los transistores de silicio de la CPU; el hardware rechaza la instrucción sin consumir un solo ciclo de software.",
        comprobalo: "Intenta ejecutar código privilegiado en C: el procesador lanza la excepción 0xC0000096 (Privileged Instruction)."
      }
    },
    entende: {
      queEs: "El nivel de ejecución restringido (CPL = 3) donde las instrucciones de manipulación de hardware están físicamente deshabilitadas por la microarquitectura de la CPU.",
      paraQueSirve: "Obligar a que cualquier interacción con el mundo real deba pasar obligatoriamente por una llamada al sistema supervisada por el kernel.",
      quePasaSiFalta: "Cualquier programa pirata o juego con un bug podría reescribir la BIOS o apagar la máquina al azar."
    },
    interactua: {
      cliExample: "whoami",
      psExample: "[System.Environment]::UserName",
      syntaxBreakdown: "Identifica el contexto de usuario que gobierna los procesos lanzados en Ring 3.",
      whatToLookFor: "Cuentas de usuario estándar sujetas a UAC y aislamiento de Ring 3.",
      technicalMetrics: "Segmento CS con CPL = 11b (Ring 3)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No intentes desactivar mecanismos de mitigación como DEP o ASLR que complementan la seguridad de Ring 3."
    },
    evidenceBadge: {
      code: "HW-RING3",
      label: "CPU Ring 3 Sandbox"
    }
  },
  {
    id: "inv-32-19",
    code: "32.19",
    title: "Handles",
    subtitle: "La tabla de descriptores de proceso: indexación a objetos con máscaras de acceso",
    targetMechanism: "Process Handle Table (HANDLE Index)",
    targetComponent: "Ob* / NtQuerySystemInformation",
    commandName: "handle.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué una función de Windows te devuelve un número como `0x000001A4` en vez de un puntero real de memoria? Porque es un Handle: un índice opaco y seguro.",
      mythVsTruth: {
        mentira: "Un Handle es una dirección de memoria directa del objeto en el kernel.",
        verdad: "Un Handle es un número de índice dentro de una tabla privada de descriptores; pasarle el Handle de un proceso a otro no sirve de nada porque cada proceso tiene su propia tabla.",
        comprobalo: "Mira dos procesos en Process Explorer: ambos pueden tener un handle con valor 0x4 que apunta a dos archivos totalmente distintos."
      }
    },
    entende: {
      queEs: "Un descriptor opaco de 32/64 bits que actúa como clave de acceso autorizada a un objeto gestionado por el Object Manager de NT.",
      paraQueSirve: "Proteger las direcciones reales del kernel contra fugas de información (KASLR) y asociar permisos específicos a esa sesión (ej. solo lectura).",
      quePasaSiFalta: "Las aplicaciones tendrían punteros directos a memoria de kernel y podrían corromper objetos con total facilidad."
    },
    interactua: {
      cliExample: "handle.exe -s",
      psExample: "Get-Process | Sort-Object HandleCount -Descending | Select-Object -First 5 ProcessName, HandleCount",
      syntaxBreakdown: "Lista los procesos con mayor número de descriptores abiertos en su tabla interna.",
      whatToLookFor: "Procesos con HandleCount en crecimiento constante sin estabilizarse (fuga de handles).",
      technicalMetrics: "Mapeo de Handle a puntero mediante tabla de descriptores de 3 niveles con máscara GrantedAccess."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Cerrar handles a la fuerza corrompe la lógica interna de la aplicación afectada."
    },
    evidenceBadge: {
      code: "OB-HANDLE",
      label: "Handle Table Audited"
    }
  },
  {
    id: "inv-32-20",
    code: "32.20",
    title: "Objects",
    subtitle: "Cabecera OBJECT_HEADER, cuerpo de objeto, métodos de tipo y seguridad",
    targetMechanism: "Object Model Internals",
    targetComponent: "OBJECT_HEADER Structure / Type Objects",
    commandName: "winobj.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué tienen en común un archivo, un hilo, una sección de memoria y un evento? Todos tienen exactamente la misma cabecera OBJECT_HEADER en el kernel de NT.",
      mythVsTruth: {
        mentira: "Cada componente de Windows implementa su propio sistema de creación y destrucción de recursos.",
        verdad: "Todos los recursos derivan del modelo unificado de objetos con punteros TypeObject que contienen métodos virtuales (Open, Close, Delete, Parse).",
        comprobalo: "En WinObj consulta la carpeta \\ObjectTypes: verás los 40 tipos canónicos de objetos registrados en Windows."
      }
    },
    entende: {
      queEs: "La unidad de encapsulamiento estándar de Windows NT que empaqueta datos, métodos y descriptores de seguridad en una estructura atómica.",
      paraQueSirve: "Centralizar la auditoría de seguridad, cuotas de memoria y recolección de basura mediante conteo de referencias.",
      quePasaSiFalta: "El kernel sufriría fugas de memoria catastróficas al no saber cuándo destruir un archivo o un hilo en desuso."
    },
    interactua: {
      cliExample: "winobj.exe",
      psExample: "# Inspección conceptual de tipos de objetos en el kernel de NT\n# ObjectTypes: Directory, Device, Driver, Process, Thread, Mutex, Section",
      syntaxBreakdown: "Visualiza los tipos de objetos del kernel y sus descriptores de seguridad con WinObj.",
      whatToLookFor: "Tipos de objetos de sincronización (Event, Mutex, Semaphore) y de memoria (Section).",
      technicalMetrics: "Campos OBJECT_HEADER: PointerCount (punteros en kernel) y HandleCount (descriptores en modo usuario)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Un objeto solo se destruye cuando PointerCount = 0 y HandleCount = 0."
    },
    evidenceBadge: {
      code: "OB-HEADER",
      label: "OBJECT_HEADER Layout"
    }
  },
  {
    id: "inv-32-21",
    code: "32.21",
    title: "Tokens",
    subtitle: "Estructura TOKEN: User SID, Group SIDs, Privileges array y Token Type",
    targetMechanism: "Access Token Security Principal",
    targetComponent: "Se* Subsystem / TOKEN Object",
    commandName: "whoami.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Qué es el 'escudo de Administrador' en Windows? Es un proceso que arranca con tu token completo en vez de tu token filtrado de usuario estándar.",
      mythVsTruth: {
        mentira: "Cuando inicias sesión como Administrador, todos tus programas corren como Administrador.",
        verdad: "Con UAC activo, Windows crea DOS tokens: uno limitado (con el SID de Admin desactivado) y uno elevado. Tus programas usan el limitado hasta que aceptas el cartel de UAC.",
        comprobalo: "Abre CMD normal y escribe whoami /groups: verás que el grupo Administradores figura con 'Grupo solo para denegar'."
      }
    },
    entende: {
      queEs: "La credencial de seguridad del kernel que identifica a un usuario, sus grupos, sus privilegios de sistema y su nivel de integridad (Mandatory Integrity Level).",
      paraQueSirve: "Acompañar a cada proceso e hilo para que el SRM decida instantáneamente si se le permite o deniega cada acción.",
      quePasaSiFalta: "Cualquier proceso podría fingir ser el usuario root o administrador sin ninguna prueba de identidad."
    },
    interactua: {
      cliExample: "whoami /groups",
      psExample: "whoami /all",
      syntaxBreakdown: "Vuelca la totalidad de SIDs de usuario, grupos y atributos de control de acceso del token.",
      whatToLookFor: "El SID especial S-1-16-8192 (Medium Mandatory Level) vs S-1-16-12288 (High Mandatory Level).",
      technicalMetrics: "Arreglo LUID_AND_ATTRIBUTES para privilegios (SE_PRIVILEGE_ENABLED, SE_PRIVILEGE_REMOVED)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No desactives el Control de Cuentas de Usuario (UAC); hacerlo elimina el aislamiento de tokens filtrados."
    },
    evidenceBadge: {
      code: "TOKEN-SEC",
      label: "Security Token Structure"
    }
  },
  {
    id: "inv-32-22",
    code: "32.22",
    title: "Sessions",
    subtitle: "Aislamiento de sesiones interactivas: Session 0 vs Session 1 con winlogon y dwm",
    targetMechanism: "Terminal Services Multi-Session Isolation",
    targetComponent: "Session Manager Subsystem (smss.exe)",
    commandName: "query session",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Por qué un servicio de Windows nunca puede mostrar una ventana emergente en tu pantalla? Por la 'Mitigación de Session 0 Isolation' introducida para frenar ataques de Shatter.",
      mythVsTruth: {
        mentira: "Todos los procesos de Windows corren en el mismo escritorio gráfico.",
        verdad: "Los servicios del sistema están aislados en Session 0 sin interfaz gráfica; los usuarios humanos inician sesión en Session 1, Session 2, etc.",
        comprobalo: "Ejecuta query session en CMD: verás la sesión Services (ID 0) y tu sesión activa (ID 1 o 2)."
      }
    },
    entende: {
      queEs: "El mecanismo de arquitectura que divide el sistema en múltiples entornos autónomos con su propio subsistema de ventanas (win32k), portapapeles y memoria de video.",
      paraQueSirve: "Impedir que un proceso malicioso en modo usuario inyecte mensajes de ventana a servicios de sistema con privilegios elevados.",
      quePasaSiFalta: "Un atacante podría secuestrar el escritorio de Windows enviando mensajes WM_SETTEXT a servicios en segundo plano."
    },
    interactua: {
      cliExample: "query session",
      psExample: "Get-Process | Group-Object SessionId | Select-Object Count, Name",
      syntaxBreakdown: "Agrupa los procesos en ejecución según el identificador de sesión en el que operan.",
      whatToLookFor: "Session 0 conteniendo servicios (svchost, services, spoolsv); Session 1 conteniendo explorer.exe y apps de usuario.",
      technicalMetrics: "Espacio de sesión de kernel privado (Session Space) mapeado dinámicamente según el proceso activo."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "No intentes saltar el aislamiento de Session 0 con hacks de Registro; expone el sistema a elevación local de privilegios."
    },
    evidenceBadge: {
      code: "SESS-ISOL",
      label: "Session 0 Isolation"
    }
  },
  {
    id: "inv-32-23",
    code: "32.23",
    title: "Context switches",
    subtitle: "Intercambio de registros de CPU, carga de CR3 y cambio de stack de kernel",
    targetMechanism: "Hardware Thread Context Switching",
    targetComponent: "KiSwapThread / SwapContext",
    commandName: "typeperf",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que tu procesador cambia de hilo más de 20.000 veces por segundo incluso cuando estás leyendo esta pantalla sin mover el mouse?",
      mythVsTruth: {
        mentira: "Cambiar de tarea en la CPU es una operación instantánea y sin costo.",
        verdad: "Cada cambio de contexto expulsa datos de la memoria caché L1/L2 de la CPU y vacía el Translation Lookaside Buffer (TLB), costando microsegundos valiosos.",
        comprobalo: "Monitorea con typeperf \"\\System\\Context Switches/sec\": verás decenas de miles de cambios por segundo."
      }
    },
    entende: {
      queEs: "La operación de bajísimo nivel mediante la cual el microkernel salva el estado completo de los registros de un hilo en su Kernel Stack y carga los registros del siguiente hilo.",
      paraQueSirve: "Proveer la ilusión de ejecución simultánea de cientos de programas en un número finito de núcleos de procesador.",
      quePasaSiFalta: "Solo podrías ejecutar tantos programas concurrentes como núcleos físicos tenga tu microprocesador."
    },
    interactua: {
      cliExample: "typeperf \"\\System\\Context Switches/sec\" -sc 3",
      psExample: "Get-Counter -Counter \"\\System\\Context Switches/sec\" | Select-Object -ExpandProperty CounterSamples",
      syntaxBreakdown: "Muestra la tasa instantánea de cambios de contexto por segundo en todos los núcleos de CPU.",
      whatToLookFor: "Tasas superiores a 100.000 cambios/segundo con bajo uso de CPU indican contención severa de bloqueos (Lock Contention).",
      technicalMetrics: "Actualización de registros RIP, RSP, RFLAGS, registros de propósito general y registro CR3 si cambia el espacio virtual."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Un exceso de hilos compitiendo (Thread Oversubscription) degrada el rendimiento de juegos y servidores por sobrecarga de cambio de contexto."
    },
    evidenceBadge: {
      code: "CTX-SW64",
      label: "Context Switch Metrics"
    }
  },
  {
    id: "inv-32-24",
    code: "32.24",
    title: "Scheduler internals",
    subtitle: "Planificador de hilos, boost de prioridad por I/O y balanceo multiprocesador",
    targetMechanism: "Thread Scheduling Algorithms & Heuristics",
    targetComponent: "Ke* Scheduler / IdealProcessor Engine",
    commandName: "procexp.exe",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Cómo sabe Windows en qué núcleo físico poner un hilo pesado y en qué núcleo eficiente (E-Core) poner una tarea de fondo? El planificador de NT calcula la topología híbrida.",
      mythVsTruth: {
        mentira: "El scheduler de Windows pone hilos en núcleos aleatorios al azar.",
        verdad: "Windows calcula el procesador ideal (Ideal Processor) basándose en afinidad de caché NUMA, arquitectura híbrida P/E-Cores y SMT.",
        comprobalo: "En Process Explorer mira la columna CPU Affinity de cualquier hilo: verás las máscaras de núcleos asignadas."
      }
    },
    entende: {
      queEs: "El conjunto de algoritmos heurísticos del kernel que deciden qué hilo de la cola de listos (Dispatcher Ready Queue) se ejecuta en qué procesador lógico.",
      paraQueSirve: "Maximizar la eficiencia energética, mantener datos calientes en la caché L3 y asegurar que las tareas de primer plano respondan al instante.",
      quePasaSiFalta: "Los juegos se ejecutarían en núcleos lentos y las tareas de fondo monopolizarían los núcleos de alta frecuencia."
    },
    interactua: {
      cliExample: "typeperf \"\\Processor Information(_Total)\\% Priority Time\" -sc 3",
      psExample: "Get-Process explorer | Select-Object -ExpandProperty Threads | Select-Object -First 5 Id, Priority, PriorityBoostEnabled",
      syntaxBreakdown: "Inspecciona los hilos de un proceso y verifica si tienen activado el 'Priority Boost' automático del kernel.",
      whatToLookFor: "Hilos que reciben aumentos temporales de prioridad tras completar una lectura de disco o recibir un evento de teclado.",
      technicalMetrics: "Colas de despacho de prioridad (32 run queues) y heurística de balanceo entre nodos NUMA."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura.",
      safetyWarning: "Fijar afinidades manuales en programas sin conocer la topología de la CPU suele reducir el rendimiento general."
    },
    evidenceBadge: {
      code: "SCHED-NT",
      label: "Scheduler Heuristics Mastered"
    }
  }
];

export const SECTOR_32_MINICASES: Sector32MiniCase[] = [
  {
    id: "case-32-01",
    code: "MC-32.1",
    title: "El proceso que no podía matarse ni con Administrador ni con taskkill /F",
    scenario: "Un proceso de renderizado video_render.exe se colgó. El usuario abrió CMD como Administrador y ejecutó 'taskkill /F /PID 4210'. El comando devolvió 'Éxito: Se envió la señal de término', pero el proceso seguía consumiendo memoria y no desaparecía de la lista.",
    userStatement: "Ni como Administrador puedo matar el proceso. Windows no me hace caso.",
    initialMistake: "Asumir que falta permiso y probar herramientas agresivas de inyección o reiniciar el equipo de inmediato.",
    diagnosticQuestion: "¿Por qué un proceso no desaparece después de recibir TerminateProcess?",
    options: [
      {
        id: "opt-1",
        text: "Uno de sus hilos está esperando en modo Kernel (Ring 0) dentro de un driver que quedó colgado procesando un IRP síncrono que nunca completa.",
        isCorrect: true,
        explanation: "¡Exacto! TerminateProcess marca el proceso para destrucción en User Mode, pero Windows no puede liberar la estructura EPROCESS si un hilo está atrapado en Ring 0 esperando que un driver (ej. de placa de video o controladora de disco) complete una solicitud I/O bloqueada."
      },
      {
        id: "opt-2",
        text: "El proceso tiene el atributo 'Solo lectura' en el ejecutable.",
        isCorrect: false,
        explanation: "Los atributos de archivo no tienen ninguna relación con la terminación de procesos en memoria."
      },
      {
        id: "opt-3",
        text: "El firewall está bloqueando el cierre del proceso.",
        isCorrect: false,
        explanation: "El firewall solo filtra tráfico de red, no interviene en el ciclo de vida de procesos de NT."
      }
    ],
    technicalVerdict: "El hilo estaba bloqueado en un IRP de un driver de captura de video defectuoso. El proceso solo se limpiará cuando el driver retorne o se reinicie la máquina.",
    lessonLearned: "Un proceso 'inmortal' casi siempre es un hilo colgado en Ring 0 esperando a un driver de hardware."
  },
  {
    id: "case-32-02",
    code: "MC-32.2",
    title: "El servicio en segundo plano que no podía mostrar un diálogo interactivo",
    scenario: "Un desarrollador creó un servicio de Windows para enviar alertas automáticas en fábricas. En su máquina de pruebas ejecutaba como app y mostraba el cartel 'ALERTA DE SEGURIDAD', pero al instalarse como servicio de Windows, el cartel nunca aparecía en la pantalla del operador.",
    userStatement: "El servicio corre y no da error, pero los operadores nunca ven el mensaje emergente en pantalla.",
    initialMistake: "Pensar que era un fallo de código o que el servicio no tenía permisos de Administrador.",
    diagnosticQuestion: "¿Qué principio de arquitectura interna de Windows explica este comportamiento?",
    options: [
      {
        id: "opt-1",
        text: "Aislamiento de Session 0: los servicios de Windows corren en Session 0, la cual no tiene pantalla ni interactúa con la sesión gráfica del usuario (Session 1).",
        isCorrect: true,
        explanation: "¡Brillante! A partir de Windows Vista, los servicios corren exclusivamente en Session 0 para prevenir ataques de secuestro de ventanas (Shatter attacks). Para mostrar mensajes a usuarios se debe usar una aplicación cliente en la sesión de usuario comunicada por IPC."
      },
      {
        id: "opt-2",
        text: "El monitor estaba configurado a una tasa de refresco incompatible.",
        isCorrect: false,
        explanation: "La frecuencia de refresco no influye en la arquitectura de sesiones del sistema operativo."
      },
      {
        id: "opt-3",
        text: "Windows Defender bloquea todos los carteles emergentes de servicios.",
        isCorrect: false,
        explanation: "Es una restricción de diseño estructural del subsistema win32k en el kernel, no de un antivirus."
      }
    ],
    technicalVerdict: "Se desacopló la lógica de fondo (servicio en Session 0) de la interfaz de notificación (agente en Session 1).",
    lessonLearned: "Los servicios en Session 0 son ciegos por diseño: nunca deben intentar interactuar con el escritorio de usuario."
  },
  {
    id: "case-32-03",
    code: "MC-32.3",
    title: "La aplicación que congelaba el sistema por fuga masiva de descriptores",
    scenario: "Un servidor de monitoreo comenzaba a volverse inestable después de 3 días de actividad. El uso de CPU y de RAM parecía normal (apenas 20%), pero cualquier intento de abrir nuevos programas devolvía 'No hay recursos suficientes para completar la operación'.",
    userStatement: "El servidor tiene 32 GB de RAM libres y la CPU está al 10%, pero Windows dice que no hay recursos y no deja abrir ni el Bloc de notas.",
    initialMistake: "Agregar más memoria RAM física al servidor.",
    diagnosticQuestion: "¿Qué tabla interna del Executive se saturó?",
    options: [
      {
        id: "opt-1",
        text: "La tabla de Handles del proceso de monitoreo superó los 1.000.000 de descriptores abiertos, agotando el Nonpaged Pool del Object Manager del kernel.",
        isCorrect: true,
        explanation: "¡Exacto! El programa abría conexiones de registro o eventos y no llamaba a CloseHandle(). Aunque la RAM de usuario estaba libre, la tabla de handles consumió toda la memoria no paginada del kernel, impidiendo crear nuevos procesos u objetos."
      },
      {
        id: "opt-2",
        text: "El disco duro se quedó sin clusters libres.",
        isCorrect: false,
        explanation: "El síntoma se refería a recursos de kernel del sistema operativo, no a espacio de disco."
      },
      {
        id: "opt-3",
        text: "El cable de red estaba saturado.",
        isCorrect: false,
        explanation: "La saturación de red no impide abrir aplicaciones locales como el Bloc de notas."
      }
    ],
    technicalVerdict: "Handle Leak masivo en un agente de telemetría resuelto parcheando la llamada a CloseHandle().",
    lessonLearned: "Monitorea siempre la columna HandleCount: una fuga de handles agota el kernel aunque tengas 128 GB de RAM."
  }
];

export const SECTOR_32_TEST_BANK: Sector32TestQuestion[] = [
  {
    id: "q32-01",
    questionNumber: 1,
    category: "Arquitectura NT",
    question: "¿Cuál es la función exacta de la HAL (Hardware Abstraction Layer) en el esquema de Windows NT?",
    options: [
      { id: "A", text: "Proveer los gráficos en 3D para DirectX." },
      { id: "B", text: "Aislar al microkernel y a los drivers de las variaciones físicas de placas madre, controladores de interrupción (APIC) y temporizadores de hardware." },
      { id: "C", text: "Gestionar las contraseñas de las cuentas de usuario de Active Directory." },
      { id: "D", text: "Controlar el formateo de discos en formato NTFS." }
    ],
    correctOptionId: "B",
    technicalExplanation: "La HAL es la delgada capa de bajo nivel en Ring 0 (hal.dll) que oculta las complejidades de hardware de la placa base, permitiendo que el mismo binario de ntoskrnl.exe funcione sin cambios en cualquier arquitectura x64."
  },
  {
    id: "q32-02",
    questionNumber: 2,
    category: "Procesos e Hilos",
    question: "En Windows NT, ¿cuál de las siguientes afirmaciones describe con precisión la relación entre un Proceso (EPROCESS) y un Hilo (ETHREAD)?",
    options: [
      { id: "A", text: "El proceso es quien ejecuta el código y los hilos son solo permisos de seguridad." },
      { id: "B", text: "El proceso es un contenedor inerte que provee espacio de direcciones virtuales, tabla de handles y token; el hilo es la unidad activa que el scheduler planifica y despacha en la CPU." },
      { id: "C", text: "Un proceso solo puede tener un único hilo en sistemas x64." },
      { id: "D", text: "Los hilos operan en Ring 0 y los procesos siempre en Ring 3." }
    ],
    correctOptionId: "B",
    technicalExplanation: "En NT, un proceso no tiene estado de ejecución en la CPU; es un contenedor pasivo de recursos. Los hilos son las entidades ejecutables con su propio contexto de registros (RIP, RSP) y pila que compiten por el tiempo de CPU."
  },
  {
    id: "q32-03",
    questionNumber: 3,
    category: "Seguridad y Tokens",
    question: "¿Qué componente del kernel de Windows es el único responsable de evaluar si un hilo tiene permiso para acceder a un objeto mediante SeAccessCheck?",
    options: [
      { id: "A", text: "El Security Reference Monitor (SRM) en modo kernel." },
      { id: "B", text: "El servicio LSASS en modo usuario." },
      { id: "C", text: "El explorador de Windows (explorer.exe)." },
      { id: "D", text: "El servicio de Windows Update." }
    ],
    correctOptionId: "A",
    technicalExplanation: "El SRM es el componente de Ring 0 del Executive que aplica las reglas de seguridad de NT. Cada vez que se abre un objeto, SeAccessCheck compara el Access Token del hilo con la DACL del objeto."
  },
  {
    id: "q32-04",
    questionNumber: 4,
    category: "System Calls",
    question: "¿Qué instrucción de microprocesador en arquitecturas x64 utiliza ntdll.dll para transferir la ejecución de Ring 3 a Ring 0?",
    options: [
      { id: "A", text: "int 0x80" },
      { id: "B", text: "syscall" },
      { id: "C", text: "call far" },
      { id: "D", text: "jmp kernel" }
    ],
    correctOptionId: "B",
    technicalExplanation: "En Windows de 64 bits se utiliza la instrucción nativa `syscall` (con soporte en el registro MSR_LSTAR apuntando a KiSystemCall64), reemplazando las lentas interrupciones por software del pasado."
  },
  {
    id: "q32-05",
    questionNumber: 5,
    category: "Object Manager",
    question: "¿Qué ocurre internamente en el kernel de Windows cuando el HandleCount de un objeto llega a cero pero su PointerCount sigue siendo mayor que cero?",
    options: [
      { id: "A", text: "El objeto se borra inmediatamente de la memoria RAM." },
      { id: "B", text: "El objeto ya no es accesible desde modo usuario por handles, pero permanece en memoria porque uno o más componentes del kernel mantienen punteros activos hacia él." },
      { id: "C", text: "Windows genera un pantallazo azul inmediato." },
      { id: "D", text: "Se bloquea el disco duro para evitar corrupción." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El Object Manager usa dos contadores: HandleCount (referencias por handles) y PointerCount (referencias de kernel directas). El cuerpo del objeto solo se desasigna de la memoria cuando PointerCount llega estrictamente a cero."
  }
];
