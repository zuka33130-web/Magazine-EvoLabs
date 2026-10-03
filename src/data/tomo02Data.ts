export interface TomoModuleItem {
  id: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  practicalCommand?: string;
  warningNotice?: string;
  scientificFact?: string;
  safetyBadge?: 'VERDE' | 'AMARILLO' | 'ROJO';
  forensicGoal?: string;
  decisionTree?: {
    question: string;
    yesAction: string;
    noAction: string;
  };
  sysinternalsTool?: string;
  powershellCommand?: string;
  forensicCommand?: string;
  reversibility?: string;
  falsePositive?: string;
}

export interface GlosaryItem {
  term: string;
  pronunciation?: string;
  analogy: string;
  technicalDefinition: string;
  definition?: string;
  practicalContext: string;
}

export interface GuidedCase {
  id: string;
  title: string;
  victimMachine?: string;
  symptom: string;
  initialHypothesis?: string;
  hypothesis?: string;
  testConducted?: string;
  scientificEvidence?: string;
  discardedCauses?: string[];
  definitiveResolution?: string;
  resolution?: string;
  rootCause?: string;
  toolUsed?: string;
  validationCheck?: string;
}

export interface SystemFolder {
  id: string;
  path: string;
  safetyBadge: 'VERDE' | 'AMARILLO' | 'ROJO';
  purpose: string;
  canDeleteOrClean: string;
  howToClean: string;
  dangerNotice?: string;
}

export interface TomoSecretItem {
  id?: string;
  title?: string;
  explanation?: string;
  impact?: string;
  name: string;
  shortcutOrPath: string;
  description: string;
  whyItMatters: string;
  rollbackNote?: string;
}

export const TOMO_02_FOLDERS: SystemFolder[] = [
  {
    id: 'f01',
    path: 'C:\\Windows\\System32',
    safetyBadge: 'ROJO',
    purpose: 'El núcleo de ejecutables binarios de 64 bits, librerías DLL del kernel y controladores esenciales.',
    canDeleteOrClean: 'JAMÁS borrar contenido manualmente.',
    howToClean: 'Se repara con comandos sfc /scannow y DISM, nunca tocando archivos a mano.',
  },
  {
    id: 'f02',
    path: 'C:\\Windows\\SysWOW64',
    safetyBadge: 'ROJO',
    purpose: 'Capa de compatibilidad "Windows on Windows 64" con ejecutables y librerías DLL de 32 bits.',
    canDeleteOrClean: 'INTOCABLE.',
    howToClean: 'Gestionado exclusivamente por los instaladores y el subsistema WOW64 del sistema.',
  },
  {
    id: 'f03',
    path: 'C:\\Windows\\WinSxS',
    safetyBadge: 'AMARILLO',
    purpose: 'Almacén de componentes nativos (Side-by-Side) para evitar el DLL Hell y posibilitar desinstalación de parches.',
    canDeleteOrClean: 'NO borrar archivos directamente.',
    howToClean: 'Limpieza segura oficial: Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase.',
  },
  {
    id: 'f04',
    path: 'C:\\Windows\\System32\\DriverStore',
    safetyBadge: 'AMARILLO',
    purpose: 'Repositorio seguro de paquetes de controladores firmados previamente instalados o listos para conectar hardware.',
    canDeleteOrClean: 'No tocar a mano.',
    howToClean: 'Usar herramienta gráfica libre Driver Store Explorer (RAPR) para purgar drivers obsoletos.',
  },
  {
    id: 'f05',
    path: 'C:\\Windows\\SoftwareDistribution',
    safetyBadge: 'VERDE',
    purpose: 'Caché temporal de descargas y base de datos local de Windows Update.',
    canDeleteOrClean: 'Se puede purgar si Windows Update falla o queda colgado.',
    howToClean: 'Detener servicio wuauserv, borrar contenido de \\Download y reiniciar el servicio.',
  },
  {
    id: 'f06',
    path: 'C:\\Windows\\Temp',
    safetyBadge: 'VERDE',
    purpose: 'Archivos temporales del sistema creados por servicios de Windows e instaladores a nivel administrador.',
    canDeleteOrClean: 'Generalmente seguro cuando no está en uso, pero cerrar aplicaciones y servicios correspondientes y conservar precauciones.',
    howToClean: 'Comando nativo: Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue.',
  },
  {
    id: 'f07',
    path: '%localappdata%\\Temp',
    safetyBadge: 'VERDE',
    purpose: 'Archivos de caché y temporales de programas en el espacio de usuario (navegadores, instaladores, editores).',
    canDeleteOrClean: 'Generalmente seguro de vaciar cuando los programas están cerrados.',
    howToClean: 'Ejecutar temp o vaciar desde el Sensor de Almacenamiento de Windows.',
  },
  {
    id: 'f08',
    path: 'C:\\Windows\\Prefetch',
    safetyBadge: 'AMARILLO',
    purpose: 'Trazas de inicio rápido que el administrador de memoria de Windows usa para precargar librerías en RAM.',
    canDeleteOrClean: 'Mito de internet: borrarla NO acelera la PC, ralentiza la apertura de apps durante 48hs.',
    howToClean: 'No borrar salvo para auditorías periciales de fecha de ejecución de malware.',
  },
  {
    id: 'f09',
    path: 'C:\\Windows\\System32\\config',
    safetyBadge: 'ROJO',
    purpose: 'Contiene los archivos de colmena (Hives) binarios del Registro de Windows: SAM, SYSTEM, SOFTWARE y SECURITY.',
    canDeleteOrClean: 'EL CORAZÓN DEL SISTEMA. Un cambio indebido aquí destruye el booteo.',
    howToClean: 'Solo accesible mediante copia de seguridad shadow copy (VSS) o copias de restauración.',
  },
  {
    id: 'f10',
    path: 'C:\\ProgramData',
    safetyBadge: 'AMARILLO',
    purpose: 'Configuraciones compartidas entre todos los usuarios para software instalado (antivirus, servicios, bases de datos).',
    canDeleteOrClean: 'Solo se pueden borrar carpetas huérfanas de programas previamente desinstalados.',
    howToClean: 'Inspeccionar manualmente tras desinstalar software que dejó basura residente.',
  },
  {
    id: 'f11',
    path: 'C:\\Windows\\Installer',
    safetyBadge: 'ROJO',
    purpose: 'Caché oculta de paquetes MSI y parches MSP necesarios para actualizar, reparar o desinstalar programas.',
    canDeleteOrClean: 'NUNCA borrar a ciegas.',
    howToClean: 'Si se borra a ciegas, programas como Office, Acrobat o drivers nunca más podrán desinstalarse.',
  },
  {
    id: 'f12',
    path: 'C:\\Windows\\Minidump',
    safetyBadge: 'VERDE',
    purpose: 'Volcados de memoria reducidos generados automáticamente cuando ocurre una Pantalla Azul (BSOD).',
    canDeleteOrClean: 'Se pueden borrar tras su análisis.',
    howToClean: 'Abrirlos con WinDbg Preview (!analyze -v) para hallar el driver culpable antes de borrarlos.',
  },
  {
    id: 'f13',
    path: 'C:\\Windows\\Logs\\CBS',
    safetyBadge: 'VERDE',
    purpose: 'Registros de mantenimiento basado en componentes (CBS) y reportes de auditoría de SFC y DISM.',
    canDeleteOrClean: 'Archivos .log rotados se pueden eliminar con seguridad.',
    howToClean: 'Revisar cbs.log para diagnosticar archivos corruptos antes de purgar historiales viejos.',
  },
  {
    id: 'f14',
    path: 'C:\\Windows\\LiveKernelReports',
    safetyBadge: 'VERDE',
    purpose: 'Informes y volcados de cuelgues leves generados en tiempo real por el Kernel sin causar BSOD completa.',
    canDeleteOrClean: 'Totalmente seguro de vaciar.',
    howToClean: 'Inspeccionar con WinDbg para detectar GPUs o drivers de red con cuelgues intermitentes.',
  },
  {
    id: 'f15',
    path: 'C:\\Windows\\Fonts',
    safetyBadge: 'AMARILLO',
    purpose: 'Repositorio del sistema de tipografías vectoriales TrueType y OpenType registradas en el subsistema GDI.',
    canDeleteOrClean: 'NO eliminar fuentes del sistema (Segoe UI, Arial, Tahoma).',
    howToClean: 'Desinstalar fuentes de terceros desde Configuración -> Personalización -> Fuentes.',
  },
];

export const TOMO_02_CASES: GuidedCase[] = [
  {
    id: 'c01',
    title: 'El Misterio del 100% de Disco con SSD NVMe',
    toolUsed: 'Procmon & Resource Monitor',
    symptom: 'Uso de disco al 100% permanente en administrador de tareas, la PC se congela 5 segundos al abrir cualquier app.',
    hypothesis: 'El SSD está dañado físicamente o hay un virus minando.',
    rootCause: 'El servicio Windows Search (SearchIndexer.exe) estaba corrompido en un bucle infinito reintentando indizar un archivo PST de Outlook de 45GB.',
    resolution: 'Reconstrucción del índice desde el Panel de Control y exclusión del archivo PST corrupto.',
  },
  {
    id: 'c02',
    title: 'Microcortes de Audio y Stuttering en Juegos',
    toolUsed: 'LatencyMon v7.3',
    symptom: 'Chasquidos de sonido y micro-congelamientos cada 20 segundos en juegos competitivos con tasa de cuadros alta.',
    hypothesis: 'Problema del procesador o temperatura alta de la placa madre.',
    rootCause: 'El controlador ndis.sys de la placa Wi-Fi ejecutaba Deferred Procedure Calls (DPCs) con picos de 4.800 microsegundos.',
    resolution: 'Desactivar el ahorro de energía agresivo en las propiedades del adaptador Wi-Fi e instalar driver WHQL nativo.',
  },
  {
    id: 'c03',
    title: 'El Arranque BCD Roto tras Actualización',
    toolUsed: 'WinRE & bcdedit',
    symptom: 'Error 0xc000000f en pantalla azul de recuperación apenas enciende el equipo. No inicia Windows.',
    hypothesis: 'Se rompió el sistema operativo por completo y hay que formatear.',
    rootCause: 'La partición EFI de 100MB perdió su letra de unidad asignada y el puntero al archivo BCD quedó huérfano.',
    resolution: 'Desde CMD en WinRE: diskpart, asignar letra S: a partición EFI, y ejecutar bcdboot C:\\Windows /s S: /f UEFI.',
  },
  {
    id: 'c04',
    title: 'Explosión de RAM por Fuga en Non-Paged Pool',
    toolUsed: 'Poolmon.exe & Process Explorer',
    symptom: 'La memoria RAM sube al 98% con solo 2 pestañas del navegador abiertas. Los procesos en el Administrador suman apenas 4GB.',
    hypothesis: 'Windows 11 consume demasiada RAM por culpa de la telemetría.',
    rootCause: 'Un driver de red Killer Network con fuga de memoria acumulaba 28GB en el Non-Paged Pool bajo el tag "Wfpn".',
    resolution: 'Actualizar driver desde el fabricante o desactivar el servicio de control de ancho de banda Killer Network Suite.',
  },
];

export const TOMO_02_META = {
  number: '02',
  volumeLabel: 'Tomo 02',
  title: 'DOMINÁ WINDOWS',
  subtitle: 'EL LADO OSCURO DE WINDOWS // DESMONTAJE DEL KERNEL NT',
  secondaryTitle: 'LA BIBLIA NEGRA DE WINDOWS',
  themeColor: '#00D2FF',
  secondaryColor: '#38BDF8',
  badge: 'INGENIERÍA DEL SISTEMA OPERATIVO',
  edition: 'Edición Digital 2026 // A4 210×297mm // 38 Páginas',
  totalPages: 38,
  pdfArchivePages: 67,
  manifestoPhrase: 'SI NO PODÉS REVERTIRLO, NO LO TOQUES.',
  description: 'Ingeniería del sistema operativo, desmontaje del Kernel NT, metrología de memoria, procesos, servicios y telemetría bajo escrutinio forense.',
};

export const TOMO_02_MODULES: TomoModuleItem[] = [
  {
    id: 'm00',
    moduleNumber: '00',
    title: 'APERTURA & MÉTODO EVO',
    subtitle: 'Manifiesto anti-miedo, bitácora del operador y las 15 carpetas maestras',
    categoryTag: 'FILOSOFÍA OPERATIVA',
    readTime: '6 min',
    summary: 'La regla fundamental contra el mito de "eso no lo toques porque vas a romper algo". Establecemos el pacto de reversibilidad y el baseline antes de cualquier cambio.',
    keyTakeaways: [
      'Si no podés revertirlo, no lo toques: todo cambio debe documentarse en una bitácora con hora, ruta exacta y valor previo.',
      'Las 15 carpetas maestras del Archivo EVO: arquitectura de carpetas para aislar logs, capturas, backups de registro y exportaciones de comandos.',
      'Medición de Baseline: Tomar tiempos de arranque (BIOS Time), consumo de Commit Charge en reposo y procesos activos antes de tocar una sola línea.',
    ],
    practicalCommand: 'Get-Date; (Get-CimInstance Win32_OperatingSystem).LastBootUpTime',
    scientificFact: 'Un sistema operativo no se vuelve lento por vejez física; se degrada por acumulación de dependencias huérfanas, controladores incompatibles y servicios en auto-arranque.',
  },
  {
    id: 'm01',
    moduleNumber: '01',
    title: 'EL DESPERTAR DEL SISTEMA',
    subtitle: 'De la energía en el silicio al primer píxel del Explorador de Windows',
    categoryTag: 'ARQUITECTURA DE BOOT',
    readTime: '9 min',
    summary: 'La cadena ininterrumpida de arranque: POST -> Firmware UEFI -> GPT/ESP -> Windows Boot Manager (bootmgfw.efi) -> BCD -> winload.efi -> ntoskrnl.exe -> smss.exe -> winlogon -> explorer.exe.',
    keyTakeaways: [
      'Diferencia entre UEFI nativo (GPT) y CSM/Legacy (MBR): tabla de partición moderna GUID contra límite de 4 particiones de 1982.',
      'Secure Boot y TPM 2.0: cómo se verifica la firma criptográfica de cada ejecutable antes de cederle el control del procesador.',
      'Particiones críticas: EFI System Partition (ESP, 100MB FAT32), MSR (Microsoft Reserved, 16MB) y Recovery (WinRE, 600MB+).',
    ],
    practicalCommand: 'bcdedit /enum {current}',
    warningNotice: 'Nunca asignes letra de unidad ni alteres archivos dentro de la partición ESP (FAT32) sin un medio USB de rescate a mano.',
  },
  {
    id: 'm02',
    moduleNumber: '02',
    title: 'INSTALACIÓN REAL DE WINDOWS',
    subtitle: 'Creación de medios legítimos, particionado manual y secuencia post-instalación',
    categoryTag: 'DESPLIEGUE LIMPIO',
    readTime: '10 min',
    summary: 'Descarga directa de ISO oficial de Microsoft, verificación de hash SHA-256, creación con Rufus/MCT en GPT UEFI, y el orden inquebrantable de instalación de drivers.',
    keyTakeaways: [
      'Verificación de integridad: comprobar hash SHA-256 de la ISO para garantizar que no contiene backdoors ni utilidades de terceros inyectadas.',
      'Desactivación de recolección en el OOBE: cuenta local y apagado metódico de telemetría publicitaria durante el primer arranque.',
      'Orden estricto de controladores: 1° Chipset / Management Engine, 2° Almacenamiento (IRST/NVMe), 3° Red LAN/Wi-Fi, 4° Gráficos (GPU WHQL), 5° Audio y periféricos.',
    ],
    practicalCommand: 'Get-FileHash -Algorithm SHA256 "Windows11_23H2_Spanish.iso"',
    scientificFact: 'Instalar controladores de GPU antes del INF de Chipset puede provocar asignaciones de interrupción IRQ subóptimas y micro-stuttering en el bus PCIe.',
  },
  {
    id: 'm03',
    moduleNumber: '03',
    title: 'ANATOMÍA DEL DISCO C:\\',
    subtitle: 'El mapa pericial de carpetas: System32, SysWOW64, WinSxS y AppData',
    categoryTag: 'SISTEMA DE ARCHIVOS',
    readTime: '12 min',
    summary: 'Descifrando el disco del sistema. Por qué System32 contiene binarios de 64 bits y SysWOW64 de 32 bits. Qué hace la carpeta WinSxS con sus hardlinks y qué rutas jamás se deben tocar.',
    keyTakeaways: [
      'La paradoja System32 / SysWOW64: SysWOW64 significa "Windows on Windows 64" y alberga librerías de compatibilidad para aplicaciones heredadas de 32 bits.',
      'WinSxS y Hardlinks: La carpeta no pesa lo que dice el Explorador; son enlaces duros que apuntan a una misma copia física en los clústeres del disco.',
      'AppData Local vs Roaming vs LocalLow: Dónde se guardan los perfiles de red, cachés locales de shaders y configuraciones persistentes.',
    ],
    practicalCommand: 'fsutil hardlink list "C:\\Windows\\System32\\notepad.exe"',
    warningNotice: 'Intentar eliminar la carpeta WinSxS o System Volume Information corrompe el almacén de componentes de Windows y destruye la capacidad de actualizar el sistema.',
  },
  {
    id: 'm04',
    moduleNumber: '04',
    title: 'ARCHIVOS, CARPETAS Y ALMACENAMIENTO',
    subtitle: 'MFT, Journaling NTFS, TRIM en NVMe, cleanmgr y compact.exe',
    categoryTag: 'ALMACENAMIENTO TÉCNICO',
    readTime: '11 min',
    summary: 'El motor NTFS: Master File Table (MFT), transacciones en Journal ($LogFile), mantenimiento de SSDs mediante TRIM y compresión algorítmica sin pérdida.',
    keyTakeaways: [
      'Cómo funciona el Journaling de NTFS: ante un corte de luz, el sistema no corrompe la estructura de asignación porque registra las transacciones atómicas pendientes.',
      'TRIM y Wear Leveling: Por qué un SSD nunca debe ser desfragmentado por bloques tradicionales y cómo Windows envía el comando ATA/NVMe TRIM.',
      'Compresión transparente con CompactOS: Diferencia entre la compresión arcaica NTFS (LZNT1) y los algoritmos modernos LZX y XPRESS16K de compact.exe.',
    ],
    practicalCommand: 'compact.exe /CompactOS:query ; fsutil behavior query DisableDeleteNotify',
    scientificFact: 'Un valor de DisableDeleteNotify = 0 confirma que el comando TRIM está habilitado y operativo hacia la controladora del SSD.',
  },
  {
    id: 'm05',
    moduleNumber: '05',
    title: 'QUÉ PASA CUANDO INSTALÁS UN PROGRAMA',
    subtitle: 'EXE vs MSI vs MSIX: del instalador al Registro, servicios y DLL Hell',
    categoryTag: 'CICLO DE VIDA DE SOFTWARE',
    readTime: '9 min',
    summary: 'Disección forense de una instalación: copiado a Program Files, escritura en HKLM\\Software, inyección de servicios, tareas programadas y por qué la desinstalación absoluta es una falacia.',
    keyTakeaways: [
      'Formatos de empaquetado: EXE (script ejecutable opaco), MSI (base de datos relacional transaccional de Windows Installer), MSIX (contenedor desacoplado y virtualizado).',
      'El mito del "desinstalador milagroso": Los programas dejan GUIDs huérfanos y claves de licencias en Registry por diseño de persistencia de sus propios desarrolladores.',
      'DLL Hell moderno: La solución Side-by-Side (WinSxS) para que aplicaciones con diferentes versiones de C++ Redistributable convivan pacíficamente.',
    ],
    practicalCommand: 'Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Select DisplayName, DisplayVersion',
  },
  {
    id: 'm06',
    moduleNumber: '06',
    title: 'PROCESOS, HILOS Y KERNEL',
    subtitle: 'User Mode vs Kernel Mode, PID, PPID, Handles y procesos del sistema',
    categoryTag: 'NÚCLEO DEL SISTEMA',
    readTime: '13 min',
    summary: 'La frontera sagrada entre Ring 3 y Ring 0. Cómo un proceso solicita operaciones al kernel mediante Syscalls, y la lista sagrada de procesos que jamás debés finalizar.',
    keyTakeaways: [
      'La jerarquía de procesos del sistema: smss.exe (Session Manager) inicia csrss.exe (Client Server Runtime) y wininit.exe, quien levanta services.exe y lsass.exe.',
      'PID, PPID y Handles: Cada proceso tiene un identificador y punteros protegidos a archivos, mutexes, sockets y claves de Registro.',
      'Uso pericial de Process Explorer y Sysinternals para auditar la firma digital de cada binario y su jerarquía en árbol.',
    ],
    practicalCommand: 'Get-Process | Sort-Object WorkingSet64 -Descending | Select -First 10 Id, ProcessName, Handles, @{N="RAM (MB)";E={[math]::round($_.WorkingSet64/1MB,1)}}',
    warningNotice: 'Finalizar csrss.exe, lsass.exe o wininit.exe provoca de inmediato un BSOD con código CRITICAL_PROCESS_DIED para proteger la integridad del kernel.',
  },
  {
    id: 'm07',
    moduleNumber: '07',
    title: 'MEMORIA: FÍSICA, VIRTUAL Y EL MITO DE LA RAM',
    subtitle: 'Working Set, Commit Charge, Standby, Cache y por qué la RAM libre es inútil',
    categoryTag: 'DOSSIER ESPECIAL MEMORIA',
    readTime: '15 min',
    summary: 'El análisis más profundo sobre gestión de memoria. Explicación de Pagefile, Compresión de memoria en RAM, Fallos de página (soft vs hard) y auditoría con RAMMap.',
    keyTakeaways: [
      'RAM Libre vs RAM en Standby/Caché: Windows utiliza la memoria que no usás para pre-cargar datos frecuentes; si una aplicación la requiere, se desaloja en microsegundos.',
      'Commit Limit y Pagefile: El archivo de paginación no es para cuando falta RAM; es el respaldo matemático de los compromisos de asignación de memoria virtual del kernel.',
      'Memory Compression: Cómo el proceso "System" comprime páginas en desuso dentro de la propia RAM física antes de gastar ciclos de I/O escribiéndolas al disco.',
    ],
    practicalCommand: 'Get-CimInstance Win32_OperatingSystem | Select TotalVisibleMemorySize, FreePhysicalMemory, TotalVirtualMemorySize, FreeVirtualMemory',
    scientificFact: 'Desactivar el Pagefile no hace la PC más rápida; genera crashes por Out-Of-Memory (OOM) e impide la creación de minidumps de volcado durante una pantalla azul.',
  },
  {
    id: 'm08',
    moduleNumber: '08',
    title: 'DRIVERS: EL LENGUAJE SECRETO DEL HARDWARE',
    subtitle: 'Hardware ID, INF, SYS, WHQL, DriverStore y la advertencia sobre DDU',
    categoryTag: 'SUBSISTEMA DE HARDWARE',
    readTime: '11 min',
    summary: 'Cómo Windows se comunica con los circuitos físicos. Decodificación de VEN_xxxx y DEV_xxxx, gestión con PnPUtil y por qué los actualizadores de drivers automáticos son software dañino.',
    keyTakeaways: [
      'Estructura de un Hardware ID: VEN = Vendor (fabricante asignado por PCI-SIG), DEV = Dispositivo, SUBSYS = Integrador de placa.',
      'El almacén DriverStore (FileRepository): Dónde residen todas las versiones instaladas y cómo purgar versiones obsoletas de forma limpia con PnPUtil.',
      'Uso adecuado de DDU (Display Driver Uninstaller): Solo debe emplearse ante fallas críticas de cambio de marca de GPU o corrupción severa, nunca como rutina periódica.',
    ],
    practicalCommand: 'pnputil /enum-drivers',
    warningNotice: 'Nunca descargues paquetes como "Driver Booster" o "DriverPack Solution": inyectan controladores modificados, adware y destruyen la estabilidad de las interrupciones del sistema.',
  },
  {
    id: 'm09',
    moduleNumber: '09',
    title: 'PERIFÉRICOS COTIDIANOS',
    subtitle: 'Almacenamiento USB, letras perdidas en diskmgmt.msc, Spooler y audio',
    categoryTag: 'DIAGNÓSTICO PERIFÉRICO',
    readTime: '8 min',
    summary: 'Resolución de conflictos habituales de periféricos: discos externos que no montan letra de volumen, colas de impresión atascadas en Spooler y el conflicto de audio Realtek vs Genérico.',
    keyTakeaways: [
      'Partición sin letra asignada: Cómo la utilidad Disk Management resuelve el 90% de los casos de pendrives que aparecen en Administrador de Dispositivos pero no en el Explorador.',
      'El servicio Spooler de impresión: Pasos para detener el servicio, purgar la carpeta C:\\Windows\\System32\\spool\\PRINTERS y reiniciar el servicio limpiamente.',
      'Protocolo MTP en smartphones: Por qué transferir fotos desde un celular a la PC no se comporta como una unidad de almacenamiento masivo tradicional.',
    ],
    practicalCommand: 'Get-Service Spooler | Restart-Service -Force',
  },
  {
    id: 'm10',
    moduleNumber: '10',
    title: 'REDES DESDE CERO: DE TU PC AL MUNDO',
    subtitle: 'IP, Gateway, DNS, Puertos, TCP/UDP y auditoría con netstat y TCPView',
    categoryTag: 'CONECTIVIDAD & AUDITORÍA',
    readTime: '12 min',
    summary: 'El viaje de un paquete de red desde el socket de tu navegador hasta el cable de fibra óptica. Cómo inspeccionar qué programa tiene puertos abiertos y qué conexiones son legítimas.',
    keyTakeaways: [
      'Diferencia entre IP local (192.168.x.x asignada por DHCP en tu router) e IP pública (asignada por tu ISP en la WAN).',
      'Resolución DNS: El archivo hosts local (C:\\Windows\\System32\\drivers\\etc\\hosts) contra la consulta al resolver DNS (8.8.8.8 o 1.1.1.1) por el puerto UDP 53.',
      'Auditoría de conexiones con netstat: Identificar el PID exacto que mantiene conexiones establecidas en el puerto 443 (HTTPS) o puertos de escucha sospechosos.',
    ],
    practicalCommand: 'Get-NetTCPConnection -State Established | Select LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess | Select -First 8',
    scientificFact: 'Tener decenas de conexiones en estado TIME_WAIT o CLOSE_WAIT es normal en el protocolo TCP y no indica la presencia de malware.',
  },
  {
    id: 'm11',
    moduleNumber: '11',
    title: 'QUÉ ARRANCA CON WINDOWS',
    subtitle: 'Task Manager Startup, llaves Run/RunOnce, Startup Folders y Autoruns',
    categoryTag: 'OPTIMIZACIÓN DE INICIO',
    readTime: '10 min',
    summary: 'La verdad sobre los programas de inicio. Los 7 lugares distintos donde el software se esconde para ejecutarse con Windows y cómo inspeccionarlos con Autoruns de Sysinternals.',
    keyTakeaways: [
      'Lugares de inicio: HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run, HKCU\\Software\\...\\Run, shell:startup y shell:common startup.',
      'Inicio con retardo (Delayed Start): Por qué deshabilitar todo a ciegas puede romper sincronizaciones de nube, software de periféricos o paneles de control de audio.',
      'Clasificación de impacto: Medir el tiempo de CPU que un programa consume durante el boot antes de decidir deshabilitarlo.',
    ],
    practicalCommand: 'Get-CimInstance Win32_StartupCommand | Select Name, Command, Location, User',
  },
  {
    id: 'm12',
    moduleNumber: '12',
    title: 'SERVICIOS DE WINDOWS',
    subtitle: 'services.msc, svchost, tipos de arranque, dependencias y el caso SysMain',
    categoryTag: 'SERVICIOS DEL KERNEL',
    readTime: '13 min',
    summary: 'Anatomía de los servicios en segundo plano. Cómo svchost agrupa servicios compartidos, cuentas de servicio (LocalSystem vs NetworkService) y protocolo de prueba para SysMain.',
    keyTakeaways: [
      'Tipos de arranque: Automático, Automático (Inicio retrasado), Manual y Deshabilitado. Qué es el mecanismo Trigger Start.',
      'El caso SysMain (antiguo SuperFetch): En discos mecánicos (HDD) puede generar 100% de uso de disco al arrancar; en SSDs NVMe modernos no tiene impacto negativo y ayuda a la carga predictiva.',
      'Regla de oro: Antes de deshabilitar un servicio, revisar siempre su pestaña "Dependencias" para no quebrar funciones de red, impresión o audio.',
    ],
    practicalCommand: 'Get-Service | Where-Object {$_.StartType -eq "Automatic" -and $_.Status -ne "Running"} | Select Name, DisplayName',
    warningNotice: 'Deshabilitar servicios de seguridad como Windows Defender, DCOM o RPC destruirá la capacidad del sistema para abrir ventanas y autenticar credenciales.',
  },
  {
    id: 'm13',
    moduleNumber: '13',
    title: 'TAREAS PROGRAMADAS',
    subtitle: 'Task Scheduler: desencadenadores, acciones, condiciones y auditoría limpia',
    categoryTag: 'AUTOMATIZACIÓN DEL SISTEMA',
    readTime: '9 min',
    summary: 'El Programador de Tareas (taskschd.msc). Cómo Windows ejecuta el mantenimiento automático nocturno, chequeos de actualizaciones y cómo auditar tareas añadidas por navegadores.',
    keyTakeaways: [
      'Estructura de una tarea: Triggers (hora, inicio de sesión, evento de log), Acciones (ejecutable con argumentos), Condiciones (solo si la PC está conectada a la corriente).',
      'Tareas de mantenimiento del sistema en Microsoft\\Windows: Defrag, DiskCleanup, UpdateOrchestrator y Customer Experience.',
      'Auditoría segura: Deshabilitar una tarea sospechosa en lugar de borrarla permite reactivarla instantáneamente si se pierde una función requerida.',
    ],
    practicalCommand: 'Get-ScheduledTask | Where-Object {$_.State -ne "Disabled" -and $_.TaskPath -notlike "\\Microsoft*"} | Select TaskName, TaskPath, State',
  },
  {
    id: 'm14',
    moduleNumber: '14',
    title: 'TERMINAL SIN MIEDO',
    subtitle: 'CMD vs PowerShell vs Windows Terminal: sintaxis, pipelines y scripts seguros',
    categoryTag: 'LÍNEA DE COMANDOS',
    readTime: '12 min',
    summary: 'Perdiendo el miedo a la consola. La diferencia entre el texto plano de CMD y los objetos fuertemente tipados de PowerShell. Cmdlets esenciales y exportación de auditorías.',
    keyTakeaways: [
      'CMD es un intérprete de comandos heredado de MS-DOS basado en flujo de texto; PowerShell es un entorno de automatización orientado a objetos .NET.',
      'El poder del pipeline (|): Cómo pasar la salida de Get-Process directamente a Where-Object y formatear con Select-Object sin lidiar con parsing de texto.',
      'Variables de entorno y la variable PATH: Qué significa que un comando no se reconozca y cómo Windows busca ejecutables en las rutas registradas.',
    ],
    practicalCommand: 'Get-CimInstance Win32_BIOS | Select Manufacturer, SMBIOSBIOSVersion, ReleaseDate',
    scientificFact: 'Ejecutar scripts no autorizados está bloqueado por defecto mediante ExecutionPolicy Restricted para proteger al usuario de descargas involuntarias.',
  },
  {
    id: 'm15',
    moduleNumber: '15',
    title: 'EL REGISTRO DE WINDOWS',
    subtitle: 'Hives, NTUSER.DAT, backup, rollback seguro y ajustes precisos',
    categoryTag: 'CONFIGURACIÓN CENTRAL',
    readTime: '14 min',
    summary: 'La base de datos jerárquica de configuración de Windows. Comprensión de HKLM, HKCU y HKCR. Tipos de datos (REG_SZ, REG_DWORD, REG_BINARY) y protocolo de respaldo antes de editar.',
    keyTakeaways: [
      'Estructura física: El Registro no es un solo archivo; son colmenas (hives) almacenadas en C:\\Windows\\System32\\config (SAM, SYSTEM, SOFTWARE) y el archivo NTUSER.DAT en cada perfil.',
      'HKCR es una vista combinada dinámica de HKLM\\Software\\Classes y HKCU\\Software\\Classes que define las extensiones y asociaciones de programas.',
      'Ajuste técnico MenuShowDelay: Modificar el retardo de despliegue de submenús de 400ms a 0ms sin romper la estabilidad del shell.',
    ],
    practicalCommand: 'reg.exe export "HKCU\\Control Panel\\Desktop" "$HOME\\Desktop\\backup_desktop.reg" /y',
    warningNotice: 'Nunca toques claves dentro de HKLM\\SYSTEM\\CurrentControlSet\\Services sin haber creado previamente un punto de restauración o backup del hive.',
  },
  {
    id: 'm16',
    moduleNumber: '16',
    title: 'TELEMETRÍA Y PRIVACIDAD',
    subtitle: 'Datos de diagnóstico requeridos vs opcionales, Diagnostic Data Viewer y debloaters',
    categoryTag: 'PRIVACIDAD RACIONAL',
    safetyBadge: 'VERDE',
    readTime: '10 min',
    summary: 'La verdad sobre los datos que Windows envía a Microsoft. Análisis objetivo de datos de diagnóstico, visor oficial y advertencia formal contra scripts de "debloat" destructivos de YouTube.',
    keyTakeaways: [
      'Niveles de diagnóstico: "Requerido" (datos de compatibilidad de hardware y volcados de cuelgues) vs "Opcional" (hábitos de navegación, escritura predictiva y uso detallado de apps).',
      'El peligro de los Debloaters mágicos: La mayoría de los scripts de GitHub eliminan dependencias del Microsoft Store, servicios de red y rompen futuras actualizaciones mensuales de seguridad.',
      'Configuración racional: Apagar el ID de publicidad, la experiencia personalizada y el feedback de escritura desde Configuración -> Privacidad y Seguridad sin romper el sistema.',
    ],
    practicalCommand: 'Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection" -Name "AllowTelemetry"',
  },
  {
    id: 'm17',
    moduleNumber: '17',
    title: 'WINDOWS UPDATE',
    subtitle: 'Staging, SoftwareDistribution, LCU, Delivery Optimization y orden SFC/DISM',
    categoryTag: 'MANTENIMIENTO DEL SISTEMA',
    safetyBadge: 'AMARILLO',
    readTime: '11 min',
    summary: 'Cómo se actualiza el sistema. Las fases de detección, descarga y ensamblado en SoftwareDistribution, actualización acumulativa (LCU) y el orden correcto de reparación con DISM y SFC.',
    keyTakeaways: [
      'La carpeta SoftwareDistribution: Dónde se descargan los parches y cómo limpiarla con seguridad si una actualización queda atascada en un bucle infinito de instalación.',
      'Delivery Optimization (WUDO): Optimización de entrega entre PCs de la misma red local para no saturar el ancho de banda del router.',
      'El orden inquebrantable de saneamiento: Primero DISM /Online /Cleanup-Image /RestoreHealth (repara la fuente local con servidores de MS), luego sfc /scannow (repara los binarios del disco con la fuente ya sana).',
    ],
    practicalCommand: 'DISM.exe /Online /Cleanup-Image /RestoreHealth ; sfc /scannow',
    scientificFact: 'Ejecutar SFC antes de DISM en un sistema con la imagen dañada resulta en el error "Archivos corruptos no pudieron ser reparados" porque la biblioteca de referencia misma está corrupta.',
  },
  {
    id: 'm18',
    moduleNumber: '18',
    title: 'SEGURIDAD PROFUNDA',
    subtitle: 'UAC token, Secure Desktop, Defender, SmartScreen y el archivo trampa',
    categoryTag: 'CIBERSEGURIDAD DEFENSIVA',
    safetyBadge: 'AMARILLO',
    readTime: '13 min',
    summary: 'Arquitectura de defensa de Windows. Por qué el UAC oscurece la pantalla (Secure Desktop), comprobación de firmas digitales y el caso forense del archivo que parece foto pero es un ejecutable.',
    keyTakeaways: [
      'El token de UAC: Aunque seas Administrador, tus aplicaciones corren con token de usuario estándar restringido hasta que una elevación explícita solicita el token completo.',
      'Secure Desktop: El oscurecimiento de pantalla corre en una sesión de escritorio aislada donde el software malicioso no puede simular clics del ratón ni capturar teclas.',
      'Anatomía del archivo camuflado: Doble extensión (informe.pdf.exe), iconos apócrifos y verificación mediante visualización forzada de extensiones en el Explorador y cálculo de hash SHA-256.',
    ],
    practicalCommand: 'Get-AuthenticodeSignature "C:\\Windows\\System32\\cmd.exe"',
    warningNotice: 'Nunca desactives la confirmación de elevación UAC en "No notificarme nunca": cualquier script descargado podrá tomar control de ring 0 silenciosamente.',
  },
  {
    id: 'm19',
    moduleNumber: '19',
    title: 'REPARACIÓN ANTES DE FORMATEAR',
    subtitle: 'WinRE, BCD, puntos de restauración, CBS.log y reparación in-place',
    categoryTag: 'RECUPERACIÓN AVANZADA',
    safetyBadge: 'AMARILLO',
    readTime: '14 min',
    summary: 'El arsenal de recuperación cuando Windows entra en bucle de reparación o falla al iniciar. Cómo reparar el BCD desde WinRE, diagnosticar con CBS.log y la instalación in-place no destructiva.',
    keyTakeaways: [
      'WinRE (Windows Recovery Environment): El sistema operativo de rescate mínimo basado en WinPE almacenado en la partición oculta de recuperación.',
      'Reconstrucción del almacén BCD: Comandos bootrec /fixmbr, bootrec /fixboot y bcdboot C:\\Windows /s S: /f UEFI para regenerar el sector de arranque dañado.',
      'Reparación In-Place (Upgrade sobre sí mismo): Ejecutar el setup de la misma versión desde Windows montando la ISO oficial para reinstalar todo el kernel conservando el 100% de archivos y programas.',
    ],
    practicalCommand: 'bcdboot C:\\Windows /l es-es',
  },
  {
    id: 'm20',
    moduleNumber: '20',
    title: 'OPTIMIZACIÓN ADAPTATIVA EVO',
    subtitle: 'Medir antes de tocar: BIOS time, latencia DPC, frametime y reversibilidad',
    categoryTag: 'MÉTRICA & RENDIMIENTO',
    safetyBadge: 'VERDE',
    readTime: '12 min',
    summary: 'La filosofía de la medición objetiva. Por qué no existen los "100 tweaks mágicos", cómo utilizar LatencyMon para cazar picos de latencia en controladores de audio y red, y medir tiempos reales.',
    keyTakeaways: [
      'Latencia DPC (Deferred Procedure Call): La principal causante de micro-cortes de audio y stuttering en juegos provocada habitualmente por controladores de red o energía deficientes.',
      'Planes de energía de Windows: Diferencias reales entre Equilibrado y Alto Rendimiento; cómo el plan equilibrado permite a la CPU bajar a estados C-State térmicamente fríos.',
      'Regla de una variable por vez: Aplicar un ajuste, someter el equipo al benchmark idéntico y registrar en la bitácora si hubo mejora medible o solo efecto placebo.',
    ],
    practicalCommand: 'powercfg /list',
  },
  {
    id: 'm21',
    moduleNumber: '21',
    title: 'PC DE BAJOS RECURSOS',
    subtitle: 'Diagnóstico en hardware limitado: HDD al 100%, 4GB RAM y optimización racional',
    categoryTag: 'SUPERVIVENCIA DE HARDWARE',
    safetyBadge: 'VERDE',
    readTime: '11 min',
    summary: 'Rescate de computadoras con procesadores de 2 núcleos, 4 a 8 GB de RAM y discos duros mecánicos. Solución al síntoma de disco al 100%, ajuste de efectos visuales y control de pestañas.',
    keyTakeaways: [
      'Por qué el disco mecánico se clava en 100%: Tiempos de acceso mecánicos (12ms) frente a lectura aleatoria masiva de Windows Update y Search.',
      'Efectos visuales en sysdm.cpl: Desactivar sombras de ventanas y animaciones de minimizado alivia el uso de memoria VRAM en placas de video integradas antiguas.',
      'Ajustes del navegador: Habilitar "Ahorro de memoria" (descarte de pestañas inactivas) para que el navegador no devore los escasos 4 u 8 GB de memoria física.',
    ],
    practicalCommand: 'systempropertiesperformance.exe',
  },
  {
    id: 'm22',
    moduleNumber: '22',
    title: 'EMERGENCIAS TÉCNICAS',
    subtitle: 'Protocolos de acción inmediata: pantalla negra con cursor, disco 100% y BSOD',
    categoryTag: 'PROTOCOLO DE CRISIS',
    safetyBadge: 'ROJO',
    readTime: '10 min',
    summary: 'Las fallas más temidas y la secuencia metódica de salvataje. El protocolo "NO HACER TODAVÍA...", reinicio del subsistema de video y recuperación de archivos borrados.',
    keyTakeaways: [
      'Pantalla negra con cursor: El kernel y el administrador de ventanas corren, pero explorer.exe falló. Atajo Win + Ctrl + Shift + B para reiniciar el driver de video o Ctrl+Shift+Esc para lanzar Explorer.',
      'Qué NO hacer ante una falla de disco: No ejecutar chkdsk /r repetitivamente en un disco mecánico con sectores dañados antes de clonar la información crítica a otra unidad.',
      'Recuperación de archivos eliminados de papelera: No instalar programas en la misma unidad C: para no sobrescribir los clústeres marcados como disponibles en la MFT.',
    ],
    practicalCommand: 'taskkill /f /im explorer.exe & start explorer.exe',
  },
  {
    id: 'm23',
    moduleNumber: '23',
    title: 'CASOS GUIADOS EVO',
    subtitle: '4 expedientes completos de taller: síntoma, evidencia, hipótesis y solución',
    categoryTag: 'INVESTIGACIÓN PERICIAL',
    safetyBadge: 'AMARILLO',
    readTime: '14 min',
    summary: 'Casos didácticos basados en situaciones reales de laboratorio: desde el juego que tartamudea por conflicto de antivirus hasta el misterio del archivo que desaparecía al reiniciar.',
    keyTakeaways: [
      'Caso 01: El misterio de los 60 FPS mentirosos con caídas a 15 FPS resuelto por límite de potencia de VRM en placa madre.',
      'Caso 02: El disco C:\\ que perdía 20 GB de espacio diariamente por volcados masivos de crash dump de un controlador de audio corrupto.',
      'Caso 03: Pérdida total de conexión a internet con IP válida resuelta por corrupción en la pila de Winsock.',
    ],
    practicalCommand: 'netsh winsock reset ; netsh int ip reset',
  },
  {
    id: 'm24',
    moduleNumber: '24',
    title: 'LOS SECRETOS EVO',
    subtitle: 'Atajos de élite, paneles directos de control y funciones ocultas del sistema',
    categoryTag: 'HERRAMIENTAS MAESTRAS',
    safetyBadge: 'VERDE',
    readTime: '8 min',
    summary: 'La recopilación selecta de accesos directos, atajos de teclado y comandos de ejecución inmediata que diferencian a un operador principiante de un especialista de laboratorio.',
    keyTakeaways: [
      'God Mode y accesos directos a paneles de control clásicos: ncpa.cpl, appwiz.cpl, devmgmt.msc, diskmgmt.msc y sysdm.cpl.',
      'Atajos de alta productividad: Win + X (menú rápido de administración), Win + V (historial de portapapeles), Win + Shift + S (captura de precisión con anotación).',
      'El visor de confiabilidad (perfmon /rel): La línea temporal gráfica que correlaciona fallas de software con instalaciones y caídas de controladores.',
    ],
    practicalCommand: 'perfmon /rel',
  },
  {
    id: 'm25',
    moduleNumber: '25',
    title: 'GLOSARIO MAESTRO A-Z',
    subtitle: 'Más de 50 términos explicados desde la analogía cotidiana hasta el rigor técnico',
    categoryTag: 'DICCIONARIO TÉCNICO',
    safetyBadge: 'VERDE',
    readTime: '16 min',
    summary: 'El diccionario definitivo de conceptos de Windows: desde ACL, BCD y Commit Charge hasta WinSxS, Working Set y Zero-Day. Explicado con analogías claras y contexto pericial.',
    keyTakeaways: [
      'Analogía antes que jerga: entender el concepto en el mundo real antes de memorizar la sigla técnica.',
      'Contexto práctico en cada término: cómo se manifiesta cada concepto en tu pantalla y cuándo debés prestarle atención.',
      'Referencia de consulta permanente para volver una y otra vez ante cualquier duda técnica futura.',
    ],
    practicalCommand: 'Get-Help * -Category Cmdlet',
  },
  {
    id: 'm26',
    moduleNumber: '26',
    title: 'PASAPORTE DEL INVESTIGADOR & CIERRE',
    subtitle: 'Auditoría final, checklist de competencias y fuentes oficiales Microsoft',
    categoryTag: 'CERTIFICACIÓN EDITORIAL',
    safetyBadge: 'VERDE',
    readTime: '6 min',
    summary: 'Cierre del Tomo 02: verificación de competencias adquiridas, organización final del Archivo EVO personal, bibliografía oficial de Microsoft Learn y Sysinternals, y contratapa coleccionable.',
    keyTakeaways: [
      'Checklist de peritaje: Saber diagnosticar memoria, investigar procesos sospechosos, reparar el arranque y optimizar con evidencia científica.',
      'El archivo EVO completo: Tus scripts, bitácoras y perfiles guardados y listos para respaldar cualquier intervención futura.',
      'Fuentes oficiales: Microsoft Learn, Windows Internals (Mark Russinovich), Sysinternals Suite y documentación oficial de PowerShell.',
    ],
    scientificFact: 'El mejor optimizador de Windows es un usuario con criterio que entiende qué hace cada servicio y mide antes de tocar.',
  },
];

export const TOMO_02_GLOSSARY: GlosaryItem[] = [
  {
    term: 'ACL (Access Control List)',
    analogy: 'La lista de invitados en la puerta de un club exclusivo que define quién puede entrar y qué puede hacer.',
    technicalDefinition: 'Lista de entradas de control de acceso (ACE) asociadas a un objeto asegurable en NTFS (archivo, clave de registro, proceso) que especifica los permisos de usuarios y grupos.',
    practicalContext: 'Cuando Windows te dice "Acceso denegado" al intentar editar un archivo del sistema, la ACL de dicho archivo no otorga permisos de escritura a tu token de usuario.',
  },
  {
    term: 'BCD (Boot Configuration Data)',
    analogy: 'El plano maestro de navegación que la computadora lee apenas despierta para saber dónde vive el sistema operativo.',
    technicalDefinition: 'Base de datos independiente del firmware que contiene los parámetros de configuración de arranque de Windows, leída por bootmgr (BIOS) o bootmgfw.efi (UEFI).',
    practicalContext: 'Si se corrompe el BCD, la PC enciende pero muestra el temido mensaje "Recovery: Your PC/Device needs to be repaired. Error code: 0xc000000f".',
  },
  {
    term: 'Commit Charge',
    analogy: 'El límite total de crédito que el banco te aprobó, independientemente de cuánto dinero hayas gastado efectivamente hoy.',
    technicalDefinition: 'Cantidad total de memoria virtual privada que los procesos activos han solicitado y que el sistema operativo se ha comprometido a respaldar en RAM o en el Pagefile.',
    practicalContext: 'En el Administrador de Tareas (Pestaña Rendimiento -> Memoria), el valor "Confirmada" (Commit) muestra el uso actual y el límite máximo antes de sufrir un crash OOM.',
  },
  {
    term: 'DPC (Deferred Procedure Call)',
    analogy: 'El ayudante de cocina que anota una comanda urgente para que el chef principal no se detenga y pueda cocinarla apenas tenga 2 segundos libres.',
    technicalDefinition: 'Mecanismo del kernel de Windows que permite a los controladores de dispositivos diferir el procesamiento de tareas no críticas fuera de la rutina de interrupción de hardware (ISR).',
    practicalContext: 'Si un controlador de red o Wi-Fi defectuoso tarda más de 1ms en procesar un DPC, se producen microcortes de sonido y saltos en la imagen (stuttering).',
  },
  {
    term: 'Handle',
    analogy: 'El ticket numerado que te dan en el guardarropa para retirar tu campera sin necesidad de entrar a buscarla vos mismo.',
    technicalDefinition: 'Puntero indirecto opaco administrado por el kernel que representa una referencia abierta por un proceso hacia un recurso del sistema (archivo, mutex, hilo, evento o clave).',
    practicalContext: 'Cuando intentás borrar un archivo y Windows dice "El archivo está en uso por otro programa", significa que un proceso mantiene un Handle abierto hacia él.',
  },
  {
    term: 'Kernel Mode (Ring 0)',
    analogy: 'La cabina de mandos del avión: solo pilotos autorizados pueden tocar los comandos críticos del motor.',
    technicalDefinition: 'Modo de ejecución privilegiado de la CPU donde el código tiene acceso sin restricciones a todo el hardware de la máquina y a cualquier dirección de memoria física.',
    practicalContext: 'Los controladores de hardware (.sys) corren en Ring 0. Si un driver comete un error de puntero nulo, la CPU se detiene de golpe y genera una Pantalla Azul (BSOD).',
  },
  {
    term: 'MFT (Master File Table)',
    analogy: 'El índice alfabético y mapa de estantes de una biblioteca gigante que dice exactamente en qué pasillo y estante está cada libro.',
    technicalDefinition: 'Estructura central de datos de un volumen NTFS que almacena registros de 1024 bytes describiendo los atributos, nombre, tamaño y clústeres físicos de cada archivo.',
    practicalContext: 'Cuando formateás una unidad en "Formato rápido", Windows no borra los datos físicos de los archivos; simplemente limpia y regenera la MFT.',
  },
  {
    term: 'Pagefile (pagefile.sys)',
    analogy: 'El depósito auxiliar de una tienda donde se guardan cajas que no se van a exhibir en la vidriera principal hoy.',
    technicalDefinition: 'Archivo reservado en el disco del sistema que el Administrador de Memoria de Windows utiliza para respaldar páginas de memoria virtual modificadas que no están en uso activo.',
    practicalContext: 'Desactivar el Pagefile para "ahorrar espacio" es una mala práctica: priva al kernel de volcar páginas frías y rompe programas que solicitan grandes cuotas de Commit.',
  },
  {
    term: 'PID (Process Identifier)',
    analogy: 'El número de DNI o pasaporte único que identifica a cada persona dentro de una oficina pública.',
    technicalDefinition: 'Número entero único asignado por el kernel a cada proceso en el momento de su creación, utilizado por el sistema y el usuario para monitorearlo o finalizarlo.',
    practicalContext: 'Si una aplicación se congela y no responde a la X de cierre, podés matarla al instante desde la terminal con el comando taskkill /F /PID 1234.',
  },
  {
    term: 'SysWOW64',
    analogy: 'Un traductor simultáneo que le hace creer a un turista de 32 bits que está en su país natal, cuando en realidad está en una metrópolis de 64 bits.',
    technicalDefinition: 'Subsistema de Windows ("Windows 32-bit On Windows 64-bit") que proporciona emulación y librerías DLL de 32 bits para permitir la ejecución transparente de software legado en sistemas x64.',
    practicalContext: 'A pesar del número "64" en su nombre, C:\\Windows\\SysWOW64 contiene binarios de 32 bits, mientras que C:\\Windows\\System32 contiene los ejecutables nativos de 64 bits.',
  },
  {
    term: 'UAC (User Account Control)',
    analogy: 'El guardia de seguridad que te pide confirmación explícita con documento en mano cada vez que vas a abrir una caja fuerte.',
    technicalDefinition: 'Mecanismo de seguridad de Windows que garantiza que las aplicaciones se ejecuten por defecto con privilegios de usuario estándar, exigiendo elevación explícita para Ring 0.',
    practicalContext: 'Cuando aparece la ventana gris oscurecida preguntando "¿Desea permitir que esta aplicación haga cambios en el dispositivo?", estás interactuando con el UAC en el Secure Desktop.',
  },
  {
    term: 'WinSxS (Windows Side-by-Side)',
    analogy: 'Un almacén central de repuestos originales donde conviven pacíficamente piezas de 2015, 2018 y 2024 sin pisarse entre sí.',
    technicalDefinition: 'Almacén de componentes nativos de Windows que alberga múltiples versiones de librerías y componentes del sistema para resolver el "DLL Hell" y permitir rollbacks de parches.',
    practicalContext: 'La herramienta DISM /Online /Cleanup-Image /StartComponentCleanup se utiliza para purgar del WinSxS las versiones de parches viejos ya superadas por actualizaciones nuevas.',
  },
  {
    term: 'Working Set',
    analogy: 'Los papeles y carpetas que tenés físicamente abiertos arriba de tu escritorio de trabajo en este exacto minuto.',
    technicalDefinition: 'Cantidad de memoria RAM física asignada actualmente a un proceso específico para sus páginas de código y datos de ejecución activa.',
    practicalContext: 'En el Administrador de Tareas, la columna "Memoria" representa el Working Set privado. Si el proceso se minimiza, Windows puede reducir su Working Set y moverlo a Standby.',
  },
];

export const TOMO_02_SECRETS: TomoSecretItem[] = [
  {
    name: 'Menú de Administración Maestro (Win + X)',
    shortcutOrPath: 'Win + X',
    description: 'Acceso directo e instantáneo al Administrador de Dispositivos, Administración de Discos, Visor de Eventos, Terminal de Administrador y Configuración del Sistema.',
    whyItMatters: 'Ahorra 10 clics en el menú inicio y funciona incluso cuando la barra de tareas de Windows está respondiendo con lentitud.',
  },
  {
    name: 'Historial del Portapapeles con Persistencia',
    shortcutOrPath: 'Win + V',
    description: 'Habilita un portapapeles con historial de hasta 25 elementos previos (textos, códigos, enlaces e imágenes capturadas) con opción de anclado permanente.',
    whyItMatters: 'Permite copiar 5 comandos distintos de una guía y pegarlos sucesivamente sin tener que alternar entre ventanas una y otra vez.',
  },
  {
    name: 'Reinicio de Emergencia del Controlador Gráfico',
    shortcutOrPath: 'Win + Ctrl + Shift + B',
    description: 'Envía una señal de reinicio inmediata al subsistema DWM y al controlador de video de la GPU. La pantalla parpadea un segundo y emite un pitido breve.',
    whyItMatters: 'Recupera el control de la PC tras salir de un juego congelado en pantalla negra sin necesidad de forzar el botón de encendido del gabinete.',
  },
  {
    name: 'Monitor de Confiabilidad de Windows',
    shortcutOrPath: 'perfmon /rel (desde Ejecutar Win + R)',
    description: 'Genera una gráfica temporal de estabilidad con puntuación de 1 a 10, detallando en qué día y hora exacta falló un proceso, se instaló un parche o se colgó un driver.',
    whyItMatters: 'Descubre en 15 segundos si los problemas de la PC comenzaron tras la instalación de un juego en particular o una actualización de Windows.',
  },
  {
    name: 'Información del Sistema con Desglose Total',
    shortcutOrPath: 'msinfo32.exe',
    description: 'Muestra versión exacta de BIOS, estado de Secure Boot, modo de BIOS (UEFI), modelo de placa madre y configuración de virtualización basada en seguridad (VBS).',
    whyItMatters: 'Es la herramienta oficial pericial más rápida para verificar si la máquina está operando en GPT nativo o si el Secure Boot está activo.',
  },
  {
    name: 'Ajuste de Despliegue de Menús (MenuShowDelay)',
    shortcutOrPath: 'HKEY_CURRENT_USER\\Control Panel\\Desktop -> MenuShowDelay',
    description: 'Reduce el retardo artificial de 400 milisegundos que Windows espera antes de desplegar submenús en el entorno clásico.',
    whyItMatters: 'Configurarlo en 0 o 50 milisegundos hace que el sistema responda con inmediatez óptica sin alterar el rendimiento de la CPU ni consumir recursos.',
    rollbackNote: 'El valor por defecto original es 400 (cadena de texto REG_SZ). Se puede restaurar en cualquier momento.',
  },
  {
    name: 'Comando Directo de Conexiones de Red',
    shortcutOrPath: 'ncpa.cpl',
    description: 'Abre directamente el panel de adaptadores de red (Ethernet, Wi-Fi, VPNs) sin pasar por las pantallas lentas de la app de Configuración moderna.',
    whyItMatters: 'Permite cambiar DNS a 1.1.1.1 o renovar IP estática con tres clics exactos.',
  },
  {
    name: 'Herramienta de Diagnóstico de Memoria Integrada',
    shortcutOrPath: 'mdsched.exe',
    description: 'Programa una prueba exhaustiva de memoria RAM que se ejecuta fuera del entorno de Windows durante el siguiente reinicio de la máquina.',
    whyItMatters: 'Permite descartar módulos de memoria defectuosos sin necesidad de preparar un pendrive booteable con MemTest86.',
  },
];
