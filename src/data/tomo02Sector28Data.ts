// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 28: BSOD (BLUE SCREEN OF DEATH)
// "La pantalla azul no te está diciendo toda la verdad"

export type RiskLevelSector28 = "SAFE_READONLY" | "LOW_RISK" | "MODIFIES_STATE" | "HIGH_RISK";

export interface Sector28Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector28;
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

export interface Sector28MiniCase {
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

export interface Sector28TestQuestion {
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

export const SECTOR_28_INVESTIGATIONS: Sector28Investigation[] = [
  {
    id: "inv-28-01",
    code: "28.01",
    title: "BugCheck",
    subtitle: "El mecanismo de pánico del kernel de NT y KeBugCheckEx",
    targetMechanism: "Kernel Panic & Crash Handler (ntoskrnl.exe)",
    targetComponent: "KeBugCheckEx / HalReturnToFirmware",
    commandName: "windbg -k / Get-WinEvent -ProviderName Microsoft-Windows-Kernel-Power",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que la pantalla azul no es un error de Windows, sino una rutina deliberada de autoprotección para evitar que datos corruptos destruyan el sistema de archivos?",
      mythVsTruth: {
        mentira: "La BSOD ocurre cuando Windows colapsa por incompetencia y se rompe sin control.",
        verdad: "Windows ejecuta KeBugCheckEx de manera premeditada al detectar una violación de invariantes del kernel que, de continuar, destruiría la integridad del disco.",
        comprobalo: "Verificá en el Visor de Eventos el Event ID 1001 generado por el subsistema BugCheck de ntoskrnl."
      }
    },
    entende: {
      queEs: "La función interna del kernel NT que detiene todos los procesadores mediante IPIs (Inter-Processor Interrupts), congela la memoria y transfiere la ejecución a la rutina de volcado forense.",
      paraQueSirve: "Preserva la integridad del hardware y de las particiones de almacenamiento congelando el estado del sistema en el microsegundo exacto de la falla.",
      quePasaSiFalta: "Un puntero corrupto escribiría estructuras aleatorias en las tablas MFT de NTFS o registros de configuración, causando corrupción permanente de datos."
    },
    interactua: {
      cliExample: "wmic recoveros get DebugInfoType, AutoReboot",
      psExample: "Get-CimInstance Win32_OSRecoveryConfiguration | Select-Object DebugInfoType, AutoReboot, CrashDumpSetting",
      syntaxBreakdown: "Win32_OSRecoveryConfiguration expone cómo reaccionará el kernel ante KeBugCheckEx (si reinicia automáticamente y qué nivel de volcado genera).",
      whatToLookFor: "AutoReboot = True suele impedir ver el código en pantalla; DebugInfoType = 3 indica Small Memory Dump (Minidump).",
      technicalMetrics: "Latencia de activación del BugCheck: < 2 ms desde la detección de corrupción de PTE/IRQL hasta la emisión de IPIs a los núcleos."
    },
    alertaEVO: {
      reversibilityRule: "La lectura de configuraciones de crash dump es 100% de solo lectura y segura.",
      safetyWarning: "No desactives la generación de volcados en entornos de producción, o perderás la única evidencia física del crash."
    },
    evidenceBadge: {
      code: "EVO-2801-BUGCHK",
      label: "Kernel Panic Subsystem"
    }
  },
  {
    id: "inv-28-02",
    code: "28.02",
    title: "Stop Code",
    subtitle: "Anatomía del código de error hexadecimal y parámetros 1-4",
    targetMechanism: "BugCheck Parameter Quad (Arg1, Arg2, Arg3, Arg4)",
    targetComponent: "Crash Header / BugCheck Data Block",
    commandName: "Get-WinEvent -FilterHashtable @{LogName='System'; ID=1001}",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el nombre textual de la BSOD (como IRQL_NOT_LESS_OR_EQUAL) es solo un alias amigable y que la verdad absoluta reside en los 4 argumentos hexadecimales?",
      mythVsTruth: {
        mentira: "El código de texto de la pantalla azul basta para saber qué driver falló.",
        verdad: "El texto es genérico; los 4 parámetros (Arg1-Arg4) contienen la dirección virtual violada, el IRQL previo y el tipo de operación de memoria.",
        comprobalo: "Inspeccioná el Evento 1001 en PowerShell: el campo de datos contiene los 4 parámetros en orden exacto."
      }
    },
    entende: {
      queEs: "Un valor hexadecimal de 32/64 bits (ej. 0x0000000A) acompañado de cuatro punteros de contexto pasados directamente como argumentos a KeBugCheckEx.",
      paraQueSirve: "Permite aislar matemáticamente si el fallo fue una lectura a un puntero nulo, una página paginada referenciada en DISPATCH_LEVEL o un fallo de paridad de bus.",
      quePasaSiFalta: "El soporte técnico asume causas genéricas y reinstala Windows innecesariamente cuando un solo parámetro indicaba una falla física de un slot de RAM."
    },
    interactua: {
      cliExample: "wevtutil qe System /q:\"*[System[(EventID=1001)]]\" /c:1 /rd:true /f:text",
      psExample: "Get-WinEvent -LogName System | Where-Object { $_.ProviderName -match 'BugCheck' } | Select-Object -First 3 -Property TimeCreated, Message",
      syntaxBreakdown: "Filtra la bitácora del sistema extrayendo el mensaje canónico que registra StopCode y los 4 argumentos de memoria.",
      whatToLookFor: "La cadena hexadecimal: 'The computer has rebooted from a bugcheck. The bugcheck was: 0x0000000a (0x0000000000000010, ...)'.",
      technicalMetrics: "Estructura de 64 bits: Stop Code (ULONG) + 4x ULONG_PTR de contexto de registros del procesador."
    },
    alertaEVO: {
      reversibilityRule: "Operación de lectura de logs nativos, no invasiva.",
      safetyWarning: "Verificá siempre los 4 parámetros antes de aceptar cualquier solución genérica de foros de Internet."
    },
    evidenceBadge: {
      code: "EVO-2802-STOPCODE",
      label: "Parameter Quad Anatomy"
    }
  },
  {
    id: "inv-28-03",
    code: "28.03",
    title: "Minidump",
    subtitle: "%SystemRoot%\\Minidump: 256KB de contexto de pila e hilos",
    targetMechanism: "Small Memory Dump Generator (diskdump.sys / crashdmp.sys)",
    targetComponent: "C:\\Windows\\Minidump\\*.dmp",
    commandName: "dir C:\\Windows\\Minidump",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que un archivo de tan solo 256 a 512 Kilobytes puede decirte la línea de código exacta y el registro de CPU que disparó el colapso del sistema operativo?",
      mythVsTruth: {
        mentira: "El minidump es un log de texto que se puede abrir con el Bloc de notas.",
        verdad: "Es una imagen binaria estructurada según la especificación DUMP_HEADER64, legible exclusivamente con depuradores como WinDbg.",
        comprobalo: "Revisá los archivos con extensión .dmp en C:\\Windows\\Minidump y verificá su encabezado con PowerShell."
      }
    },
    entende: {
      queEs: "Un volcado ligero que almacena el Stop Code, los 4 parámetros, la lista de drivers cargados en memoria, el bloque de control del proceso actual y el Thread Context del hilo culpable.",
      paraQueSirve: "Diagnosticar la causa raíz del fallo en segundos sin requerir gigabytes de espacio en disco ni exponer contraseñas almacenadas en la RAM del usuario.",
      quePasaSiFalta: "Si el archivo de paginación está deshabilitado en C:, Windows no tiene dónde escribir el dump intermedio durante el pánico y el minidump jamás se genera."
    },
    interactua: {
      cliExample: "dir /O-D C:\\Windows\\Minidump",
      psExample: "Get-ChildItem -Path C:\\Windows\\Minidump -Filter *.dmp -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object Name, Length, LastWriteTime",
      syntaxBreakdown: "Lista los volcados pequeños ordenados cronológicamente con su peso exacto en bytes.",
      whatToLookFor: "Archivos con patrón 'MMDDYY-NNNNN-01.dmp' con peso entre 256 KB y 1.5 MB.",
      technicalMetrics: "Tiempo de escritura del Minidump a disco: típicamente < 150 ms utilizando el miniport de almacenamiento de emergencia."
    },
    alertaEVO: {
      reversibilityRule: "Inspección de directorio del sistema.",
      safetyWarning: "Nunca elimines la carpeta Minidump durante un proceso de soporte: destruye la escena del crimen."
    },
    evidenceBadge: {
      code: "EVO-2803-MINIDMP",
      label: "Small Memory Dump Forensics"
    }
  },
  {
    id: "inv-28-04",
    code: "28.04",
    title: "MEMORY.DMP",
    subtitle: "Full Dump del kernel vs Complete Dump, pagefile y crashdump.sys",
    targetMechanism: "Kernel & Complete Memory Dump Subsystem",
    targetComponent: "%SystemRoot%\\MEMORY.DMP",
    commandName: "Test-Path C:\\Windows\\MEMORY.DMP",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que para volcar la memoria durante un pánico, Windows reemplaza temporalmente el controlador de disco normal por una versión simplificada de emergencia llamada dump_disk.sys?",
      mythVsTruth: {
        mentira: "Windows guarda el archivo MEMORY.DMP directamente en el disco durante la pantalla azul.",
        verdad: "Windows escribe los bloques crudos de memoria dentro del archivo pagefile.sys; luego, al reiniciar, el proceso smss.exe / savedump extrae los datos y crea MEMORY.DMP.",
        comprobalo: "Verificá el tamaño de pagefile.sys en la raíz de C:; si es menor a la RAM, un Complete Dump fallará."
      }
    },
    entende: {
      queEs: "Un archivo de volcado que contiene toda la memoria del kernel (Kernel Dump) o absolutamente toda la memoria física del equipo (Complete Dump).",
      paraQueSirve: "Depurar corrupciones sutiles de estructuras complejas (I/O Request Packets colgados, buffers de red fragmentados, estados de sincronización de semáforos).",
      quePasaSiFalta: "Muchos crashes de drivers que corrompen memoria ajena solo pueden resolverse inspeccionando el historial completo de pools de memoria en un MEMORY.DMP."
    },
    interactua: {
      cliExample: "dir C:\\Windows\\MEMORY.DMP",
      psExample: "Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\CrashControl' | Select-Object CrashDumpEnabled, DumpFile, MinidumpDir",
      syntaxBreakdown: "Consulta las claves de registro maestras que rigen el comportamiento del crash dump en Windows NT.",
      whatToLookFor: "CrashDumpEnabled: 1 = Complete Dump, 2 = Kernel Dump, 3 = Small Dump (Minidump), 7 = Automatic Dump.",
      technicalMetrics: "Requisito de pagefile para Kernel Dump: Tamaño estimado de RAM en kernel (~2 a 8 GB) + 256 MB de margen de cabeceras."
    },
    alertaEVO: {
      reversibilityRule: "Lectura de propiedades de registro del kernel.",
      safetyWarning: "Configurar Complete Dump en equipos con 64GB de RAM requiere 65GB de pagefile en C:; no lo actives sin espacio suficiente."
    },
    evidenceBadge: {
      code: "EVO-2804-KRNLDMP",
      label: "Kernel Memory Dump Engine"
    }
  },
  {
    id: "inv-28-05",
    code: "28.05",
    title: "IRQL",
    subtitle: "Interrupt Request Levels: PASSIVE, APC, DISPATCH y HIGH_LEVEL",
    targetMechanism: "Hardware & Software Interrupt Prioritization",
    targetComponent: "HAL (Hardware Abstraction Layer) IRQL Architecture",
    commandName: "windbg -k \"!irql\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que más del 70% de las pantallas azules por drivers son causadas por una sola regla violada: tocar memoria paginable cuando la CPU está en DISPATCH_LEVEL?",
      mythVsTruth: {
        mentira: "IRQL es lo mismo que la prioridad de un proceso en el Administrador de Tareas.",
        verdad: "La prioridad de proceso (0-31) pertenece al scheduler en Ring 3; el IRQL (0-31 en x64) es un estado del hardware y la HAL que enmascara interrupciones.",
        comprobalo: "Comprobá en la documentación de Windows DDK cómo KeGetCurrentIrql() restringe qué APIs del kernel se pueden llamar."
      }
    },
    entende: {
      queEs: "Una escala jerárquica de niveles de prioridad de ejecución de la CPU. Niveles clave: 0 (PASSIVE_LEVEL, normal), 1 (APC_LEVEL, I/O completion), 2 (DISPATCH_LEVEL, scheduler y DPCs), 3+ (DIRQL, hardware interrupts).",
      paraQueSirve: "Garantizar que una rutina crítica de interrupción de hardware o el planificador de hilos no sean interrumpidos por código ordinario.",
      quePasaSiFalta: "En DISPATCH_LEVEL o superior, el scheduler no puede ejecutarse. Si un driver accede a una página en disco, el procesador se congela esperando la I/O, forzando IRQL_NOT_LESS_OR_EQUAL."
    },
    interactua: {
      cliExample: "echo Regla de oro: En IRQL >= DISPATCH_LEVEL nunca accedas a memoria paginada",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; ProviderName='Microsoft-Windows-Kernel-Power'} -MaxEvents 5 | Select-Object Id, LevelDisplayName, TimeCreated",
      syntaxBreakdown: "Identifica los colapsos originados por interrupciones y fallos de energía en la capa de abstracción HAL.",
      whatToLookFor: "Stop Code 0x0000000A: el Argumento 1 es la dirección referenciada, el Argumento 2 es el IRQL en el momento del fallo (ej. 0x02 = DISPATCH_LEVEL).",
      technicalMetrics: "Escala x64: PASSIVE (0), APC (1), DISPATCH (2), CMC (12), DIRQL (3-11), PROFILE (13), HIGH_LEVEL (15)."
    },
    alertaEVO: {
      reversibilityRule: "Análisis conceptual y forense pasivo.",
      safetyWarning: "Los drivers de terceros con fallas de sincronización son los violadores número 1 de la jerarquía IRQL."
    },
    evidenceBadge: {
      code: "EVO-2805-IRQL",
      label: "Interrupt Request Level Architecture"
    }
  },
  {
    id: "inv-28-06",
    code: "28.06",
    title: "MEMORY_MANAGEMENT",
    subtitle: "BugCheck 0x1A: Subcódigos de PTEs, PFN corrupto y transiciones",
    targetMechanism: "Virtual Memory Manager (ntoskrnl!Mi* Subsystem)",
    targetComponent: "Page Frame Database (PFN) & Page Table Entries (PTE)",
    commandName: "mdsched.exe / Get-WinEvent -ProviderName Microsoft-Windows-MemoryDiagnostics-Results",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el 0x1A MEMORY_MANAGEMENT tiene un primer parámetro secreto con más de 40 subtipos que distinguen si falló la RAM física, un driver corruptor o el archivo de paginación?",
      mythVsTruth: {
        mentira: "Cualquier BSOD MEMORY_MANAGEMENT significa que el módulo de memoria RAM está quemado.",
        verdad: "Si el subcódigo (Arg1) es 0x41792 o 0x61941, suele ser corrupción de estructuras por un driver defectuoso; si es 0x41284 o 0x8888, apunta con alta certeza a celdas de RAM defectuosas.",
        comprobalo: "Ejecutá mdsched.exe para programar el diagnóstico de memoria de Windows en el próximo arranque."
      }
    },
    entende: {
      queEs: "El BugCheck emitido cuando el Gestor de Memoria Virtual detecta una corrupción interna irreversible en su base de datos de marcos de página (PFN) o en sus tablas de traducción virtual-física.",
      paraQueSirve: "Previene que procesos de usuarios o hilos del kernel lean memoria perteneciente a otros procesos o escriban en páginas marcadas de solo lectura.",
      quePasaSiFalta: "Corrupción silenciosa de archivos de bases de datos, imágenes y código ejecutable sin previo aviso."
    },
    interactua: {
      cliExample: "mdsched.exe",
      psExample: "Get-WinEvent -LogName System | Where-Object { $_.ProviderName -match 'MemoryDiagnostics' } | Format-List TimeCreated, Message",
      syntaxBreakdown: "Recupera los resultados de la última prueba de integridad de memoria física realizada por el cargador de arranque.",
      whatToLookFor: "Mensajes que certifiquen: 'El Diagnóstico de memoria de Windows probó la memoria del equipo y no detectó ningún error'.",
      technicalMetrics: "Códigos críticos: 0x41284 (A page table entry has become corrupt), 0x41792 (A corrupted page frame number list)."
    },
    alertaEVO: {
      reversibilityRule: "Ejecución de mdsched requiere reinicio programado por el usuario.",
      safetyWarning: "Si 0x1A ocurre repetidamente con subcódigos dispares, retirá perfiles de overclocking XMP/EXPO antes de cambiar módulos de RAM."
    },
    evidenceBadge: {
      code: "EVO-2806-MEMMGT",
      label: "Page Frame Database Integrity"
    }
  },
  {
    id: "inv-28-07",
    code: "28.07",
    title: "DPC_WATCHDOG_VIOLATION",
    subtitle: "BugCheck 0x133: DPC starvation y cuelgues de microsegundos en drivers",
    targetMechanism: "Kernel DPC Watchdog Timer Subsystem",
    targetComponent: "ntoskrnl!KeAccumulatedDpcTime / storahci.sys / nvlddmkm.sys",
    commandName: "windbg -k \"!analyze -v\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows tiene un perro guardián (Watchdog) que mide los microsegundos exactos que pasa un driver en DISPATCH_LEVEL y le 'dispara' si tarda más de medio segundo?",
      mythVsTruth: {
        mentira: "DPC_WATCHDOG_VIOLATION es una falla del SSD de almacenamiento siempre.",
        verdad: "Aunque un firmware de SSD colgado en comandos AHCI/NVMe puede causarlo, cualquier driver gráfico o de red que monopolice la CPU en DISPATCH_LEVEL lo dispara.",
        comprobalo: "Mirá el Arg1 del 0x133: si vale 0x00, fue un DPC individual; si vale 0x01, fue la suma acumulada de DPCs continuos sin ceder la CPU."
      }
    },
    entende: {
      queEs: "Un mecanismo de detección que interrumpe la máquina cuando una rutina de procedimiento diferido (DPC) sobrepasa el límite temporal sin permitir que el despachador de hilos retome el control.",
      paraQueSirve: "Evitar que un driver mal programado deje congelado el cursor del mouse, el audio y todo el sistema operativo indefinidamente.",
      quePasaSiFalta: "El equipo sufriría microcongelamientos o cuelgues duros permanentes donde ni el reloj de pantalla avanza."
    },
    interactua: {
      cliExample: "powercfg /requests",
      psExample: "Get-PnpDevice -Class 'SCSIAdapter', 'DiskDrive' | Select-Object FriendlyName, Status, Problem",
      syntaxBreakdown: "Examina los controladores de almacenamiento y adaptadores SCSI en busca de estados anómalos de timeout.",
      whatToLookFor: "Status 'OK' o dispositivos con controladores genéricos antiguos propensos a bloqueos de cola de I/O.",
      technicalMetrics: "Límite del watchdog: ~500 ms acumulados en una sola CPU sin retorno al hilo pasivo, o ~100 ms en un solo DPC."
    },
    alertaEVO: {
      reversibilityRule: "Diagnóstico pasivo sin alteración de subsistemas.",
      safetyWarning: "Actualizar firmwares de SSDs y controladores NVMe resuelve el 80% de los errores 0x133 de origen de almacenamiento."
    },
    evidenceBadge: {
      code: "EVO-2807-DPCWD",
      label: "Watchdog Starvation Monitor"
    }
  },
  {
    id: "inv-28-08",
    code: "28.08",
    title: "VIDEO_TDR_FAILURE",
    subtitle: "BugCheck 0x116: Timeout Detection and Recovery en dxgkrnl.sys / GPU",
    targetMechanism: "DirectX Graphics Kernel TDR Engine",
    targetComponent: "dxgkrnl.sys / dxgmms2.sys / Vendor Graphics Driver",
    commandName: "Get-CimInstance Win32_VideoController",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando la pantalla parpadea en negro y Windows dice 'El controlador de pantalla se recuperó', acabás de esquivar un 0x116 gracias al sistema TDR?",
      mythVsTruth: {
        mentira: "VIDEO_TDR_FAILURE (0x116) significa que la placa de video se quemó.",
        verdad: "Indica que la GPU tardó más de 2 segundos en responder a un comando del scheduler gráfico; si tras 5 intentos no responde, el kernel lanza la BSOD.",
        comprobalo: "Buscá en el Visor de Eventos registros del origen 'Display' con Event ID 4101 (controlador se recuperó tras timeout)."
      }
    },
    entende: {
      queEs: "El mecanismo de Windows para detectar cuando el procesador gráfico (GPU) se queda en un bucle infinito o se bloquea por hardware/overclocking/shaders.",
      paraQueSirve: "Permite resetear el hardware gráfico sin reiniciar toda la computadora en fallos transitorios.",
      quePasaSiFalta: "Cualquier juego que compile shaders complejos o sufra un deadlock congelaría la máquina de forma irreversible."
    },
    interactua: {
      cliExample: "dxdiag /t %temp%\\\\dxinfo.txt & findstr /i \"driver version date\" %temp%\\\\dxinfo.txt",
      psExample: "Get-WinEvent -LogName System | Where-Object { $_.ProviderName -eq 'Display' -and $_.Id -eq 4101 } | Select-Object -First 5 TimeCreated, Message",
      syntaxBreakdown: "Rastrea eventos de advertencia de TDR que preceden a una BSOD 0x116 catastrófica.",
      whatToLookFor: "Eventos 4101 recurrentes en minutos previos al colapso: evidencia indiscutible de inestabilidad térmica o de clock de GPU.",
      technicalMetrics: "TdrDelay por defecto en registro: 2 segundos de timeout antes de intentar reinicializar el adaptador WDDM."
    },
    alertaEVO: {
      reversibilityRule: "Lectura de diagnósticos DirectX y logs de pantalla.",
      safetyWarning: "No alteres la clave TdrDelay en el registro para 'tapar' el error; solo provocará congelamientos totales en lugar de recuperación."
    },
    evidenceBadge: {
      code: "EVO-2808-TDR",
      label: "Graphics Subsystem TDR"
    }
  },
  {
    id: "inv-28-09",
    code: "28.09",
    title: "CRITICAL_PROCESS_DIED",
    subtitle: "BugCheck 0xEF: Colapso de csrss.exe, wininit.exe o ntoskrnl.exe",
    targetMechanism: "Process Termination Safeguard (EPROCESS!BreakOnTermination)",
    targetComponent: "csrss.exe / smss.exe / wininit.exe / services.exe",
    commandName: "Get-Process csrss, wininit, services",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que Windows marca ciertos procesos con un bit flag especial llamado 'BreakOnTermination', de modo que si se cierran por cualquier razón, la PC se apaga de golpe?",
      mythVsTruth: {
        mentira: "CRITICAL_PROCESS_DIED ocurre por un virus cualquiera que infectó Chrome.",
        verdad: "Ocurre cuando un proceso vital para la arquitectura de subsistemas (como el subsistema Win32 csrss.exe) es terminado por corrupción o fallo de disco.",
        comprobalo: "Verificá en la lista de procesos cómo los procesos del sistema tienen protección de aislamiento de sesión y token de SYSTEM."
      }
    },
    entende: {
      queEs: "La reacción inmediata del kernel cuando un proceso indispensable para la seguridad y la GUI es terminado de manera inesperada.",
      paraQueSirve: "Evitar que el sistema opere en un estado zombi donde no hay control de autenticación, ventanas ni gestión de hilos.",
      quePasaSiFalta: "Un atacante podría terminar csrss.exe o wininit.exe y el sistema quedaría en un estado vulnerable e inoperable."
    },
    interactua: {
      cliExample: "tasklist /fi \"imagename eq csrss.exe\"",
      psExample: "Get-CimInstance Win32_Process -Filter \"Name = 'csrss.exe' or Name = 'wininit.exe'\" | Select-Object ProcessId, Name, ExecutionState, HandleCount",
      syntaxBreakdown: "Inspecciona el estado de los procesos críticos del subsistema de sesión de Windows.",
      whatToLookFor: "En sistemas sanos, existen múltiples instancias de csrss.exe (una por cada sesión de escritorio activa).",
      technicalMetrics: "Flag de kernel: EPROCESS->BreakOnTermination = 1. Si el hilo termina (ExitProcess), se llama a KeBugCheckEx(0xEF)."
    },
    alertaEVO: {
      reversibilityRule: "Solo lectura de procesos del sistema.",
      safetyWarning: "Si 0xEF ocurre acompañado de fallos de I/O de disco, indica que los binarios del sistema no pudieron ser leídos de la unidad SSD."
    },
    evidenceBadge: {
      code: "EVO-2809-CRITPROC",
      label: "Subsystem Core Safeguard"
    }
  },
  {
    id: "inv-28-10",
    code: "28.10",
    title: "SYSTEM_SERVICE_EXCEPTION",
    subtitle: "BugCheck 0x3B: Código no capturado en Ring 0 y violación de acceso",
    targetMechanism: "Kernel Mode Structured Exception Handler",
    targetComponent: "ntoskrnl.exe / win32kfull.sys / Third-party drivers",
    commandName: "windbg -k \"r; kv\"",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el 0x3B suele ser exactamente el mismo error que un 'Access Violation' de un juego (c0000005), pero ocurrido adentro de las zonas con privilegios absolutos del procesador?",
      mythVsTruth: {
        mentira: "SYSTEM_SERVICE_EXCEPTION es un error de un servicio de Windows como Windows Update.",
        verdad: "Es una excepción de CPU no controlada (frecuentemente 0xC0000005) producida durante la transición de una llamada al sistema de Ring 3 a Ring 0.",
        comprobalo: "El parámetro 1 del 0x3B es casi siempre 0x00000000C0000005 (STATUS_ACCESS_VIOLATION)."
      }
    },
    entende: {
      queEs: "Una condición donde una rutina del kernel ejecutó una instrucción inválida, desreferenció un puntero nulo o intentó escribir en memoria protegida sin un bloque try/except adecuado.",
      paraQueSirve: "Aislar de inmediato la ejecución del procesador antes de que el puntero corrupto sobreescriba tablas de descriptores globales (GDT) o registros de control.",
      quePasaSiFalta: "El kernel ejecutaría código basura de forma impredecible, comprometiendo todo el aislamiento de seguridad del sistema."
    },
    interactua: {
      cliExample: "findstr /i \"SYSTEM_SERVICE_EXCEPTION\" C:\\\\Windows\\\\Logs\\\\*.log",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; ID=1001} -MaxEvents 1 | Select-Object -ExpandProperty Message",
      syntaxBreakdown: "Localiza la última excepción de servicio del sistema y sus 4 argumentos.",
      whatToLookFor: "Arg1 = Código de excepción (0xC0000005), Arg2 = Dirección de la instrucción fallida, Arg3 = Registro de contexto, Arg4 = 0.",
      technicalMetrics: "Excepción x86/x64 típica: Vector #GP (General Protection Fault) o #PF (Page Fault) dentro del contexto de syscall."
    },
    alertaEVO: {
      reversibilityRule: "Lectura pasiva de logs forenses.",
      safetyWarning: "En 0x3B, el driver reportado en la pila de llamadas (Call Stack) es el primer sospechoso a actualizar o desinstalar."
    },
    evidenceBadge: {
      code: "EVO-2810-SYSEXP",
      label: "Ring 0 Exception Trap"
    }
  },
  {
    id: "inv-28-11",
    code: "28.11",
    title: "WHEA",
    subtitle: "WHEA_UNCORRECTABLE_ERROR 0x124 y MCE / PCIe AER",
    targetMechanism: "Windows Hardware Error Architecture (WHEA)",
    targetComponent: "whea.dll / Machine Check Architecture (MCA) / PCIe AER",
    commandName: "Get-WinEvent -ProviderName Microsoft-Windows-WHEA-Logger",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando ves WHEA_UNCORRECTABLE_ERROR (0x124), no fue Windows ni ningún software quien falló: fue la propia CPU la que le avisó a Windows que sus transistores físicos fallaron?",
      mythVsTruth: {
        mentira: "WHEA es un bug de Windows 11 que se soluciona formateando.",
        verdad: "WHEA es la interfaz que lee los registros de error físicos de la CPU (MSRs) y buses PCIe; un 0x124 es 99% falla de hardware (voltaje, silicio degradado o calor).",
        comprobalo: "Filtra en el Visor de Eventos por el proveedor 'Microsoft-Windows-WHEA-Logger' para ver el volcado crudo del Machine Check Exception."
      }
    },
    entende: {
      queEs: "La arquitectura unificada de Windows para recolectar, registrar y responder a errores de hardware reportados por el CPU, la memoria ECC, el chipset y los carriles PCIe.",
      paraQueSirve: "Diferenciar con precisión milimétrica entre una falla lógica de software y una falla eléctrica/térmica de hardware.",
      quePasaSiFalta: "Un error de bit flip en la caché L2/L3 de la CPU corrompería archivos silenciosamente sin que el usuario sepa que su procesador está fallando."
    },
    interactua: {
      cliExample: "wevtutil qe System /q:\"*[System[Provider[@Name='Microsoft-Windows-WHEA-Logger']]]\" /c:3 /rd:true /f:text",
      psExample: "Get-WinEvent -LogName System -FilterXPath \"*[System[Provider[@Name='Microsoft-Windows-WHEA-Logger']]]\" -MaxEvents 5 -ErrorAction SilentlyContinue | Select-Object TimeCreated, Id, LevelDisplayName",
      syntaxBreakdown: "Recupera los eventos emitidos por el subsistema WHEA antes o durante el colapso.",
      whatToLookFor: "Event ID 18 (Error de hardware grave de CPU) con detalles de MCi_STATUS y Transaction Type.",
      technicalMetrics: "Parámetro 1 de 0x124: 0 = Machine Check Exception (CPU), 4 = PCIe Error (AER - Advanced Error Reporting)."
    },
    alertaEVO: {
      reversibilityRule: "Inspección de eventos de telemetría de hardware.",
      safetyWarning: "Si experimentás WHEA 0x124, revisá de inmediato perfiles de Curve Optimizer, voltajes de BIOS y temperaturas bajo carga."
    },
    evidenceBadge: {
      code: "EVO-2811-WHEA",
      label: "Hardware Error Architecture"
    }
  },
  {
    id: "inv-28-12",
    code: "28.12",
    title: "Dump analysis conceptual",
    subtitle: "!analyze -v, WinDbg, call stack y context record",
    targetMechanism: "WinDbg Debugger Engine & KDEXTS Extension",
    targetComponent: "DbgX.Shell.exe / !analyze -v / .trap / kv",
    commandName: "windbg -z C:\\Windows\\Minidump\\dump.dmp",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el comando '!analyze -v' ejecuta un motor heurístico de más de 500 reglas creadas por ingenieros de Microsoft para reconstruir el stack de llamadas del crash?",
      mythVsTruth: {
        mentira: "Para analizar un dump hay que ser un desarrollador con el código fuente del sistema.",
        verdad: "Cualquier técnico puede usar WinDbg con el servidor público de símbolos de Microsoft (srv*) y leer el MODULE_NAME y FAILURE_BUCKET_ID.",
        comprobalo: "Comprobá cómo WinDbg descarga símbolos oficiales desde https://msdl.microsoft.com/download/symbols de forma transparente."
      }
    },
    entende: {
      queEs: "El proceso forense de cargar un volcado de memoria en un depurador simbólico para inspeccionar los registros del CPU, la pila de llamadas (Call Stack) y las trampas de excepción.",
      paraQueSirve: "Descubrir la secuencia exacta de llamadas que precedieron al BugCheck: qué driver llamó a qué función con qué puntero.",
      quePasaSiFalta: "El soporte técnico recurre a adivinanzas, cambios innecesarios de componentes y formateos que no resuelven la causa raíz."
    },
    interactua: {
      cliExample: "echo Configurar símbolos: _NT_SYMBOL_PATH=srv*C:\\Symbols*https://msdl.microsoft.com/download/symbols",
      psExample: "[Environment]::GetEnvironmentVariable('_NT_SYMBOL_PATH', 'User')",
      syntaxBreakdown: "Verifica si el entorno tiene configurada la ruta canónica de descarga de símbolos para WinDbg.",
      whatToLookFor: "Secciones clave del reporte: BUCKET_ID, DEFAULT_BUCKET_ID, STACK_TEXT y PROCESS_NAME.",
      technicalMetrics: "STACK_TEXT: traza inversa de funciones desde KeBugCheckEx descendiendo por el driver culpable hasta el hilo invocador."
    },
    alertaEVO: {
      reversibilityRule: "Operación forense externa sobre archivos dump estáticos.",
      safetyWarning: "No confíes ciegamente en el campo 'Probably caused by'; siempre verificá los últimos 3 frames del STACK_TEXT."
    },
    evidenceBadge: {
      code: "EVO-2812-DUMPANL",
      label: "WinDbg Symbolic Engine"
    }
  },
  {
    id: "inv-28-13",
    code: "28.13",
    title: "Module ≠ causa automática",
    subtitle: "La falacia del driver apuntado vs memoria corrompida previa",
    targetMechanism: "Memory Corruption Blame Attribution Fallacy",
    targetComponent: "Pool Tracking / Driver Verifier Architecture",
    commandName: "verifier /querysettings",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que cuando WinDbg culpa a 'ntoskrnl.exe', es un 99.9% seguro de que el kernel NO es el culpable, sino que un driver tercero le ensució la memoria minutos antes?",
      mythVsTruth: {
        mentira: "Si el dump dice 'Probably caused by ntoskrnl.exe', Windows está corrupto y debo reinstalarlo.",
        verdad: "ntoskrnl.exe es quien detectó la corrupción de memoria causada por otro driver que ya terminó su ejecución y no figura en la foto final.",
        comprobalo: "Utilizá Driver Verifier (verifier.exe) para forzar que los drivers se ejecuten en pools especiales que atrapan la corrupción en el acto."
      }
    },
    entende: {
      queEs: "El fenómeno donde el hilo que se estrella es simplemente la víctima inocente que intentó leer una estructura de datos corrompida previamente por otro módulo.",
      paraQueSirve: "Comprender la diferencia entre el síntoma (la víctima) y el perpetrador (el driver corruptor silencioso).",
      quePasaSiFalta: "Se reemplazan archivos del kernel o se culpa a Microsoft cuando el culpable real es un driver anticheat o de periféricos RGB."
    },
    interactua: {
      cliExample: "verifier /query",
      psExample: "Get-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management' -Name 'VerifyDrivers' -ErrorAction SilentlyContinue",
      syntaxBreakdown: "Comprueba si Driver Verifier está activo vigilando drivers sospechosos de corrupción de pool.",
      whatToLookFor: "Lista de drivers bajo verificación con flags de Special Pool, Force IRQL Checking y Pool Tracking.",
      technicalMetrics: "Special Pool: asigna páginas protegidas con guard pages adyacentes para provocar un crash inmediato al primer byte sobrepasado."
    },
    alertaEVO: {
      reversibilityRule: "verifier /reset desactiva Driver Verifier en el siguiente reinicio.",
      safetyWarning: "Nunca actives Driver Verifier sobre TODOS los drivers simultáneamente o el equipo no podrá arrancar por sobrecarga."
    },
    evidenceBadge: {
      code: "EVO-2813-MODBLAME",
      label: "Blame Attribution Analysis"
    }
  },
  {
    id: "inv-28-14",
    code: "28.14",
    title: "Correlación con eventos",
    subtitle: "Event ID 1001 BugCheck, Event ID 41 Kernel-Power y Event Viewer",
    targetMechanism: "Windows Event Subsystem & Dirty Shutdown Tracker",
    targetComponent: "EventLog Service & Boot Status File (bootstat.dat)",
    commandName: "Get-WinEvent -FilterHashtable @{LogName='System'; ID=41, 1001}",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que el temido Evento 41 Kernel-Power 'El sistema se reinició sin apagar limpiamente' NO significa que haya fallado la fuente de poder?",
      mythVsTruth: {
        mentira: "Event ID 41 = Fuente de alimentación rota o corte de luz obligatoriamente.",
        verdad: "Solo significa que en el inicio actual, el kernel descubrió que la sesión anterior no marcó el bit de cierre limpio en bootstat.dat (lo que ocurre en cualquier BSOD o cuelgue).",
        comprobalo: "Verificá si unos milisegundos antes del Evento 41 existe un Evento 1001 (BugCheck): si existe, fue una BSOD; si no existe, fue corte eléctrico o botón de reset."
      }
    },
    entende: {
      queEs: "La técnica de triangulación temporal entre el registro de apagado sucio (Event ID 41) y el volcado de error del kernel (Event ID 1001).",
      paraQueSirve: "Determinar de forma incontestable si la máquina se apagó por pérdida de suministro eléctrico instantánea o si colapsó por una pantalla azul.",
      quePasaSiFalta: "Usuarios compran fuentes de alimentación costosas creyendo que el Evento 41 es hardware, cuando era un driver provocando BSOD con reinicio automático."
    },
    interactua: {
      cliExample: "wevtutil qe System /q:\"*[System[(EventID=41 or EventID=1001)]]\" /c:4 /rd:true /f:text",
      psExample: "Get-WinEvent -FilterHashtable @{LogName='System'; Id=@(41, 1001)} -MaxEvents 6 | Select-Object TimeCreated, Id, ProviderName",
      syntaxBreakdown: "Extrae de forma correlacionada los eventos 41 y 1001 más recientes para determinar la causa de apagado.",
      whatToLookFor: "Pares de eventos con marcas de tiempo idénticas: el 1001 contiene los detalles del BugCheck; el 41 es el aviso de reanudación.",
      technicalMetrics: "Bitflag en bootstat.dat: dirty shutdown bit se limpia solo tras la llamada exitosa de ExitWindowsEx."
    },
    alertaEVO: {
      reversibilityRule: "Consulta de registros pasiva y segura.",
      safetyWarning: "Si hay Event ID 41 sin ningún Event ID 1001 ni minidump, inspeccioná hardware: botón de power, térmico o fuente de alimentación."
    },
    evidenceBadge: {
      code: "EVO-2814-CORREV",
      label: "Dirty Shutdown Triangulation"
    }
  },
  {
    id: "inv-28-15",
    code: "28.15",
    title: "Hardware vs Software",
    subtitle: "Pruebas de aislamiento térmico, memtest86, driver verifier y stress",
    targetMechanism: "Dual Isolation Matrix: Logic Bug vs Silicon/Power Instability",
    targetComponent: "Comprehensive Hardware/Software Decision Matrix",
    commandName: "chkdsk C: & sfc /scannow",
    riskLevel: "SAFE_READONLY",
    descubri: {
      hook: "¿Sabías que un error que solo ocurre con una combinación de drivers y un juego específico puede ser en realidad una falla de un condensador de la placa madre que pierde estabilidad ante picos de corriente?",
      mythVsTruth: {
        mentira: "Si una BSOD ocurre solo jugando, el juego o su driver tienen la culpa absoluta.",
        verdad: "Cargas pesadas combinadas de GPU + CPU provocan caídas de voltaje (Vdroop) y temperaturas límite que revelan hardware físicamente inestable.",
        comprobalo: "Separar la carga: ejecutá primero stress solo de CPU (Prime95) y luego solo de GPU (FurMark); si solo falla con ambas, es fuente o VRMs."
      }
    },
    entende: {
      queEs: "El protocolo definitivo de descarte pericial que divide la causa de cualquier BSOD en dos cuadrantes: divergencia lógica de código o fallo electromecánico de silicio.",
      paraQueSirve: "Cerrar diagnósticos con certeza matemática sin caer en el ciclo interminable de reinstalar sistemas.",
      quePasaSiFalta: "Pérdida de semanas reemplazando drivers y reinstalando aplicaciones cuando un perfil de memoria EXPO requería 0.025V adicionales de VDDQ."
    },
    interactua: {
      cliExample: "perfmon /report",
      psExample: "Get-WmiObject -Namespace root\\wmi -Class MSAcpi_ThermalZoneTemperature | Select-Object @{N='Temp_C';E={($_.CurrentTemperature - 2732)/10}}",
      syntaxBreakdown: "Lee las zonas térmicas reportadas por ACPI para descartar throttling o colapsos térmicos de silicio.",
      whatToLookFor: "Valores sostenidos por encima de 90°C en correlación directa con la hora del volcado en Minidump.",
      technicalMetrics: "Matriz de decisión: Stop Codes 0x124/0x101/0x1A-0x41284 -> 90% Hardware; 0x3B/0x7E/0xD1/0x133 -> 85% Drivers/Software."
    },
    alertaEVO: {
      reversibilityRule: "Diagnóstico pericial no destructivo.",
      safetyWarning: "No reemplaces componentes de hardware costosos sin haber validado el stack de llamadas del minidump con símbolos completos."
    },
    evidenceBadge: {
      code: "EVO-2815-HWVSSW",
      label: "Diagnostic Final Decision Matrix"
    }
  }
];

export const SECTOR_28_MINICASES: Sector28MiniCase[] = [
  {
    id: "case-28-01",
    code: "MC-28.1",
    title: "El misterio de ntoskrnl.exe en equipos de oficina",
    scenario: "Cinco estaciones de trabajo en una empresa contable sufren pantallas azules diarias aleatorias con el Stop Code 0x0000000A (IRQL_NOT_LESS_OR_EQUAL). El técnico de soporte revisó el minidump con una herramienta genérica y concluyó que 'el archivo ntoskrnl.exe de Windows está dañado' y procedió a formatear dos equipos, los cuales volvieron a dar la misma pantalla azul al día siguiente.",
    userStatement: "\"Windows 11 viene fallado de f\u00e1brica, ya reinstal\u00e9 todo desde un pendrive nuevo y sigue diciendo que ntoskrnl.exe tira error.\"",
    initialMistake: "Asumir que el módulo nombrado como 'Probable cause' es el autor de la corrupción, ignorando que el kernel es simplemente la víctima donde se manifestó la excepción.",
    diagnosticQuestion: "¿Qué procedimiento técnico debe ejecutarse para descubrir al verdadero causante de este IRQL_NOT_LESS_OR_EQUAL?",
    options: [
      {
        id: "opt-1",
        text: "Descargar una ISO de Windows 10 y hacer downgrade en todas las estaciones de trabajo.",
        isCorrect: false,
        explanation: "No resuelve la causa raíz y degrada la infraestructura sin diagnóstico de soporte."
      },
      {
        id: "opt-2",
        text: "Abrir el minidump en WinDbg con símbolos oficiales, inspeccionar la pila de llamadas (kv/STACK_TEXT) y buscar el driver de terceros que llamó a una dirección paginable en DISPATCH_LEVEL.",
        isCorrect: true,
        explanation: "¡Exacto! El examen del STACK_TEXT revelará qué driver de antivirus corporativo, periférico o filtro de red invocó la dirección inválida que obligó a ntoskrnl a disparar KeBugCheckEx."
      },
      {
        id: "opt-3",
        text: "Cambiar la fuente de alimentación de las cinco computadoras de inmediato.",
        isCorrect: false,
        explanation: "Un error de IRQL con código 0x0A es una violación lógica de reglas de memoria del kernel, no un corte de suministro de la fuente."
      }
    ],
    technicalVerdict: "Al analizar el STACK_TEXT en WinDbg con el comando 'kv', se identificó que un driver de un software de seguridad para terminales bancarias (epfw.sys) llamaba a ExAllocatePoolWithTag en DISPATCH_LEVEL apuntando a memoria paginada. Una actualización del cliente de seguridad eliminó el 100% de los crashes.",
    lessonLearned: "El kernel de NT (ntoskrnl.exe) casi nunca es el perpetrador. Es el forense que descubre el crimen y detiene la máquina para evitar la catástrofe."
  },
  {
    id: "case-28-02",
    code: "MC-28.2",
    title: "La placa de video que 'moría' cada 2 horas",
    scenario: "Un usuario compró una tarjeta gráfica de gama alta para renderizado y juegos. A las 2 horas de cualquier sesión 3D exigente, la pantalla se congela 2 segundos, se vuelve negra y salta la BSOD 0x00000116 (VIDEO_TDR_FAILURE) apuntando a nvlddmkm.sys. En foros le dijeron que use DDU (Display Driver Uninstaller) e instale drivers anteriores. Lo hizo 4 veces con versiones distintas y el fallo persiste idéntico.",
    userStatement: "\"Prob\u00e9 4 versiones de drivers limpias con DDU y sigue fallando. La placa de video vino fallada, la voy a mandar a garant\u00eda.\"",
    initialMistake: "Asumir que si la pantalla azul apunta a nvlddmkm.sys, el problema es exclusivamente el archivo del software de video, ignorando las causas eléctricas y térmicas que impiden al chip GPU responder en menos de 2 segundos.",
    diagnosticQuestion: "¿Cuál es el diagnóstico pericial correcto de este escenario de TDR?",
    options: [
      {
        id: "opt-1",
        text: "La GPU deja de responder porque el sistema TDR de Windows tiene un bug con las placas modernas; hay que borrar la clave TDR del registro.",
        isCorrect: false,
        explanation: "Desactivar TDR solo transformará la BSOD en un congelamiento irreversible que obligará a desenchufar la PC de la pared."
      },
      {
        id: "opt-2",
        text: "Monitorear los sensores de temperatura del Hotspot de la GPU y la línea de 12V con telemetría en tiempo real bajo carga pesada.",
        isCorrect: true,
        explanation: "¡Correcto! Un 0x116 significa que la GPU no completó su tarea en 2 segundos. Esto suele ocurrir cuando el Hotspot alcanza los 105°C forzando throttling severo, o cuando la línea de 12V sufre una caída de tensión (Vdroop) que desestabiliza el núcleo gráfico."
      },
      {
        id: "opt-3",
        text: "Formatear el sistema operativo e instalar Windows en modo BIOS heredado MBR.",
        isCorrect: false,
        explanation: "La arquitectura de arranque no tiene relación alguna con los tiempos de respuesta del scheduler gráfico WDDM."
      }
    ],
    technicalVerdict: "La telemetría reveló que la temperatura general de la GPU era 72°C, pero el sensor de 'GPU Hotspot' tocaba los 107°C debido a pasta térmica desalineada de fábrica. Al alcanzar ese umbral, el silicio entraba en pánico térmico, se colgaba y el scheduler TDR lanzaba el 0x116.",
    lessonLearned: "VIDEO_TDR_FAILURE no es un bug del driver: es el cronómetro de Windows certificando que el hardware gráfico quedó sordo ante los comandos del sistema."
  },
  {
    id: "case-28-03",
    code: "MC-28.3",
    title: "WHEA 0x124 tras instalar perfiles de memoria de alta velocidad",
    scenario: "Un entusiasta armó una computadora con procesador de última generación y memoria DDR5 a 6400 MHz con perfil EXPO. El equipo arranca, navega perfecto, pero aleatoriamente al iniciar una llamada de Discord o un juego sufre un reinicio repentino con BSOD WHEA_UNCORRECTABLE_ERROR (0x124). En el Visor de Eventos figura el Event ID 18 de Microsoft-Windows-WHEA-Logger.",
    userStatement: "\"Windows 11 no soporta Discord ni mis auriculares, cada vez que abro la app me da pantalla azul WHEA.\"",
    initialMistake: "Culpar a la aplicación que estaba en primer plano durante el crash, ignorando que WHEA es un mecanismo de la arquitectura del procesador que reporta inestabilidad física del controlador de memoria.",
    diagnosticQuestion: "¿Cuál es la causa arquitectónica del WHEA 0x124 en este caso?",
    options: [
      {
        id: "opt-1",
        text: "Inestabilidad en el controlador de memoria integrado (IMC) de la CPU provocada por un perfil EXPO que exige una frecuencia de bus superior a la estabilidad del silicio sin ajuste de voltaje.",
        isCorrect: true,
        explanation: "¡Exacto! El perfil EXPO/XMP sobreexige el Memory Controller integrado en la CPU. Cuando la CPU cambia de estado de energía (como al abrir una app liviana), el voltaje cae levemente y la caché o el bus sufren un error de paridad de hardware reportado por el Machine Check Architecture (MCA)."
      },
      {
        id: "opt-2",
        text: "Un virus alojado en el archivo discord.exe que secuestra los permisos de Ring 0.",
        isCorrect: false,
        explanation: "Discord es una aplicación de Ring 3 sin privilegios de kernel; no puede disparar directamente un Machine Check de hardware."
      },
      {
        id: "opt-3",
        text: "El SSD NVMe está corrupto y debe formatearse a bajo nivel.",
        isCorrect: false,
        explanation: "El Event ID 18 de WHEA reporta explícitamente errores de núcleo de procesador y bus de memoria, no errores de I/O de almacenamiento."
      }
    ],
    technicalVerdict: "Al reducir la velocidad de la memoria de 6400 MHz a 6000 MHz (el 'sweet spot' del IMC) o incrementar ligeramente el voltaje SoC de 1.15V a 1.20V, el sistema pasó 24 horas continuas de pruebas de esfuerzo en MemTest86 y Prime95 con cero errores WHEA.",
    lessonLearned: "WHEA 0x124 nunca es un problema de software. Es el procesador levantando la mano y diciendo: 'mis transistores no pudieron calcular este bit por falta de voltaje o exceso de frecuencia'."
  }
];

export const SECTOR_28_TEST_BANK: Sector28TestQuestion[] = [
  {
    id: "q28-01",
    questionNumber: 1,
    category: "Arquitectura de Pánico",
    question: "¿Cuál es el propósito fundamental del mecanismo KeBugCheckEx en el kernel de Windows NT?",
    options: [
      { id: "A", text: "Reiniciar la máquina lo antes posible para no molestar al usuario con ventanas emergentes." },
      { id: "B", text: "Detener la ejecución del sistema de inmediato para prevenir la corrupción irreversible de datos en disco o hardware." },
      { id: "C", text: "Enviar un informe de telemetría a los servidores de Microsoft antes de apagar el equipo." },
      { id: "D", text: "Descargar automáticamente una actualización acumulativa de Windows Update." }
    ],
    correctOptionId: "B",
    technicalExplanation: "KeBugCheckEx es un freno de emergencia: si el kernel detecta que sus estructuras invariantes de memoria están rotas, prefiere detener la CPU antes de escribir datos basura sobre la Master File Table (MFT) de NTFS."
  },
  {
    id: "q28-02",
    questionNumber: 2,
    category: "Parámetros de Crash",
    question: "En una BSOD, ¿qué representan los cuatro valores hexadecimales entre paréntesis (Arg1 a Arg4)?",
    options: [
      { id: "A", text: "La clave de producto de Windows y el número de serie de la placa madre." },
      { id: "B", text: "Los parámetros de contexto específicos del BugCheck que indican direcciones de memoria, IRQL y códigos de excepción." },
      { id: "C", text: "La fecha, la hora, el minuto y el segundo del colapso del sistema." },
      { id: "D", text: "El porcentaje de uso de CPU, RAM, disco y red al momento del fallo." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Cada Stop Code define el significado exacto de sus 4 argumentos. En un 0x0A, por ejemplo, Arg1 es la dirección virtual a la que se intentó acceder y Arg2 es el IRQL del hilo."
  },
  {
    id: "q28-03",
    questionNumber: 3,
    category: "Archivos de Volcado",
    question: "¿Dónde se almacena temporalmente la información del volcado de memoria antes de que Windows reinicie y genere el archivo MEMORY.DMP o Minidump?",
    options: [
      { id: "A", text: "En la memoria caché L3 del procesador." },
      { id: "B", text: "En el archivo pagefile.sys mediante rutinas del miniport diskdump.sys." },
      { id: "C", text: "En el chip TPM de la placa madre." },
      { id: "D", text: "En la partición de recuperación de Windows (WinRE)." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Durante el pánico del kernel, el subsistema de crash escribe bloques de memoria crudos dentro del espacio de pagefile.sys. Al reiniciar, el subsistema de sesión lee ese bloque y escribe el archivo .dmp final."
  },
  {
    id: "q28-04",
    questionNumber: 4,
    category: "Jerarquía IRQL",
    question: "¿Qué ocurre si un driver intenta acceder a memoria paginada mientras se ejecuta en IRQL = DISPATCH_LEVEL (Nivel 2)?",
    options: [
      { id: "A", text: "Windows descarga la página del disco sin problema y la ejecución continúa con una pequeña demora." },
      { id: "B", text: "El sistema detiene el hilo y muestra un mensaje de advertencia en el Administrador de Tareas." },
      { id: "C", text: "Se produce una BSOD IRQL_NOT_LESS_OR_EQUAL (0x0A) porque el despachador de hilos no puede ejecutarse para atender el page fault." },
      { id: "D", text: "El procesador baja automáticamente su frecuencia a 800 MHz para ahorrar energía." }
    ],
    correctOptionId: "C",
    technicalExplanation: "En DISPATCH_LEVEL, el planificador de hilos no puede intervenir para suspender el hilo mientras el disco lee la página; como la página no está en RAM y no se puede esperar al disco, el kernel no tiene salida y lanza el BugCheck 0x0A."
  },
  {
    id: "q28-05",
    questionNumber: 5,
    category: "Diagnóstico TDR",
    question: "¿Cuál es el tiempo de espera por defecto (TdrDelay) que concede Windows al controlador gráfico antes de activar el reinicio del adaptador en un VIDEO_TDR_FAILURE (0x116)?",
    options: [
      { id: "A", text: "100 milisegundos." },
      { id: "B", text: "2 segundos." },
      { id: "C", text: "30 segundos." },
      { id: "D", text: "5 minutos." }
    ],
    correctOptionId: "B",
    technicalExplanation: "La clave TdrDelay estipula 2 segundos. Si el hardware de video no completa el paquete de comandos gráficos en ese lapso, el sistema operativo asume que la GPU quedó en un bucle infinito."
  },
  {
    id: "q28-06",
    questionNumber: 6,
    category: "Hardware Forensics",
    question: "El código de error WHEA_UNCORRECTABLE_ERROR (0x124) se caracteriza técnicamente por:",
    options: [
      { id: "A", text: "Ser originado por la arquitectura Machine Check del propio hardware físico (CPU/PCIe) que reporta una falla de silicio irrecuperable." },
      { id: "B", text: "Ser un fallo de software provocado exclusivamente por librerías corruptas de Microsoft Visual C++." },
      { id: "C", text: "Indicar que la licencia de Windows no ha sido activada en el servidor KMS." },
      { id: "D", text: "Ser un error de fragmentación excesiva del sistema de archivos FAT32." }
    ],
    correctOptionId: "A",
    technicalExplanation: "WHEA traduce los registros de error de hardware del procesador (MSRs) y buses PCI Express. El 0x124 certifica que el hardware físico detectó una inconsistencia de bits que no puede autocorregir."
  },
  {
    id: "q28-07",
    questionNumber: 7,
    category: "Análisis con WinDbg",
    question: "Al analizar un minidump con WinDbg, ¿por qué NO se debe concluir de inmediato que el archivo indicado en 'Probably caused by' es el culpable?",
    options: [
      { id: "A", text: "Porque WinDbg siempre culpa a programas de la competencia de Microsoft." },
      { id: "B", text: "Porque frecuentemente el módulo reportado es el código inocente que descubrió la memoria ya corrompida previamente por otro driver." },
      { id: "C", text: "Porque los archivos de minidump se encriptan con BitLocker al guardarse." },
      { id: "D", text: "Porque WinDbg solo funciona de manera precisa en versiones de Windows Server." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Es la falacia de atribución de módulos: si un driver 'X' corrompe una tabla y 10 segundos después el kernel 'ntoskrnl.exe' intenta leerla, el crash ocurrirá dentro de ntoskrnl, pero el verdadero causante fue 'X'."
  },
  {
    id: "q28-08",
    questionNumber: 8,
    category: "Correlación de Eventos",
    question: "¿Qué diferencia técnica existe entre el Event ID 41 (Kernel-Power) y el Event ID 1001 (BugCheck) en el Visor de Eventos?",
    options: [
      { id: "A", text: "El 41 indica que la fuente falló; el 1001 indica que el teclado falló." },
      { id: "B", text: "El 41 es el aviso posterior al arranque de que el sistema se apagó sin completar el cierre limpio; el 1001 contiene los detalles técnicos y parámetros de la BSOD que provocó dicho reinicio." },
      { id: "C", text: "Ambos eventos son idénticos y se duplican por redundancia de registro." },
      { id: "D", text: "El 1001 solo se genera si el usuario presionó Ctrl+Alt+Supr." }
    ],
    correctOptionId: "B",
    technicalExplanation: "El Evento 41 simplemente constata que el bit de apagado limpio no estaba puesto al encender. Si hubo BSOD, estará acompañada del Evento 1001 con el código de error y los 4 argumentos."
  },
  {
    id: "q28-09",
    questionNumber: 9,
    category: "Procesos Críticos",
    question: "¿Qué atributo interno del kernel de Windows hace que la terminación forzada de csrss.exe dispare inmediatamente un CRITICAL_PROCESS_DIED (0xEF)?",
    options: [
      { id: "A", text: "El flag BreakOnTermination activo en su estructura EPROCESS." },
      { id: "B", text: "El nombre del archivo ejecutable escrito en mayúsculas." },
      { id: "C", text: "La presencia del archivo en la carpeta System32." },
      { id: "D", text: "El certificado digital emitido por el fabricante de la BIOS." }
    ],
    correctOptionId: "A",
    technicalExplanation: "Windows marca procesos críticos con el bit BreakOnTermination. Si dicho proceso es cerrado (incluso por el administrador), el kernel asume un compromiso total de la sesión y detiene la máquina con el 0xEF."
  },
  {
    id: "q28-10",
    questionNumber: 10,
    category: "DPC Watchdog",
    question: "El código DPC_WATCHDOG_VIOLATION (0x133) se activa cuando:",
    options: [
      { id: "A", text: "Un programa de usuario pasa más de 10 minutos sin mover el mouse." },
      { id: "B", text: "Una rutina de driver en DISPATCH_LEVEL retiene la CPU por más tiempo del permitido por el temporizador watchdog del kernel." },
      { id: "C", text: "El antivirus detecta un archivo con extensión .exe sospechoso." },
      { id: "D", text: "La conexión Wi-Fi pierde paquetes durante más de 3 segundos." }
    ],
    correctOptionId: "B",
    technicalExplanation: "Las DPCs deben ser ultrarrápidas (fracciones de milisegundos). Si un driver retiene la CPU en DISPATCH_LEVEL por cientos de milisegundos, el watchdog del kernel salta para evitar el congelamiento total de la máquina."
  }
];
