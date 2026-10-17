// TOMO 02: LA BIBLIA NEGRA DE WINDOWS // MENTIRA Y VERDAD
// SECTOR 01: MINICASOS, TEST BANK (24 PREGUNTAS), LAB SCENARIOS Y ARTEFACTO

export interface Sector01MiniCase {
  id: string;
  code: string; // "CASO 01-01" to "CASO 01-08"
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

export interface Sector01TestQuestion {
  id: string;
  questionNumber: number;
  category: 'POST_FIRMWARE' | 'UEFI_NVRAM' | 'EFI_BCD' | 'KERNEL_DRIVERS' | 'DIAGNÓSTICO';
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    technicalJustification: string;
  }[];
}

export interface BootStageDefinition {
  stageNumber: number;
  id: string;
  name: string;
  actor: string;
  description: string;
  possibleFailure: string;
  firstCheckTool: string;
}

export const CANONICAL_BOOT_STAGES: BootStageDefinition[] = [
  {
    stageNumber: 1,
    id: 'stg-power',
    name: 'SEÑAL DE ALIMENTACIÓN (POWER & PWR_OK)',
    actor: 'Fuente ATX & Chipset',
    description: 'La fuente estabiliza voltajes y envía PWR_OK liberando el reset de la CPU.',
    possibleFailure: 'Sin energía, ventiladores apagados, falso contacto.',
    firstCheckTool: 'Multímetro en línea +12V / Cable PS_ON#.',
  },
  {
    stageNumber: 2,
    id: 'stg-post',
    name: 'POWER-ON SELF-TEST (POST)',
    actor: 'CPU & Firmware SPI ROM',
    description: 'Verificación y entrenamiento de CPU, memoria DRAM, bus PCIe y placa de video.',
    possibleFailure: 'Ventiladores al 100%, sin señal de video, pitidos de error / Debug LEDs.',
    firstCheckTool: 'Debug LEDs de la placa madre / Resentar RAM y GPU.',
  },
  {
    stageNumber: 3,
    id: 'stg-uefi',
    name: 'INICIALIZACIÓN DEL FIRMWARE UEFI',
    actor: 'Entorno UEFI (32/64-bit)',
    description: 'Carga de drivers pre-boot, inicialización de buses de almacenamiento y Secure Boot.',
    possibleFailure: 'Bucle en menú BIOS, cuelgue en pantalla de logo de placa.',
    firstCheckTool: 'Configuración UEFI / Verificar estado de Secure Boot y CSM.',
  },
  {
    stageNumber: 4,
    id: 'stg-boot-entry',
    name: 'SELECCIÓN DE ENTRADA (BOOT ORDER)',
    actor: 'Variables NVRAM del Firmware',
    description: 'Lectura de la variable BootOrder para priorizar Windows Boot Manager.',
    possibleFailure: 'Intento de arranque en pendrive vacío, mensaje "No bootable device".',
    firstCheckTool: 'Boot Menu (F11/F12) / Ajustar prioridad de arranque.',
  },
  {
    stageNumber: 5,
    id: 'stg-esp',
    name: 'LECTURA DE PARTICIÓN ESP (FAT32)',
    actor: 'Controlador FAT32 de UEFI',
    description: 'Montaje de la partición oculta de 100 MB y lectura de `\\EFI\\Microsoft\\Boot\\`.',
    possibleFailure: 'Partición ESP eliminada o corrupta tras formateo accidental.',
    firstCheckTool: 'WinRE USB / Comprobar partición ESP con `diskpart`.',
  },
  {
    stageNumber: 6,
    id: 'stg-bootmgr',
    name: 'EJECUCIÓN DE WINDOWS BOOT MANAGER',
    actor: 'bootmgfw.efi',
    description: 'Verificación de firmas criptográficas y desbloqueo de BitLocker vía TPM.',
    possibleFailure: 'Pantalla de solicitud de clave de recuperación de BitLocker por cambio de hardware.',
    firstCheckTool: 'Ingresar clave BitLocker / Comprobar estado de PCRs en TPM.',
  },
  {
    stageNumber: 7,
    id: 'stg-bcd',
    name: 'CONSULTA DE LA BASE BCD',
    actor: 'Almacén BCD ({bootmgr} & {current})',
    description: 'Lectura de punteros de partición de sistema (`osdevice`) y ruta del loader.',
    possibleFailure: 'Error de pantalla azul `0xc000000e` o `0xc0000034` (BCD missing).',
    firstCheckTool: 'Consola WinRE: `bootrec /rebuildbcd` o `bcdedit`.',
  },
  {
    stageNumber: 8,
    id: 'stg-winload',
    name: 'CARGADOR WINLOAD.EFI',
    actor: 'winload.efi en System32',
    description: 'Preparación de paginación de 64 bits, carga de ntoskrnl.exe, HAL y drivers de boot.',
    possibleFailure: 'Error de firma digital `0xc0000428` o archivo `winload.efi` corrupto.',
    firstCheckTool: 'WinRE: `sfc /scannow /offbootdir` o restaurar winload.efi.',
  },
  {
    stageNumber: 9,
    id: 'stg-kernel',
    name: 'NACIMIENTO DEL KERNEL NT (NTOSKRNL)',
    actor: 'ntoskrnl.exe & hal.dll',
    description: 'Fase 0 y Fase 1 de inicialización: gestor de memoria, hilos y subsistema I/O.',
    possibleFailure: 'Círculo de puntos congelado indefinidamente o BSOD KERNEL_SECURITY_CHECK.',
    firstCheckTool: 'Modo Seguro (F8 / WinRE) / Descartar memoria RAM inestable.',
  },
  {
    stageNumber: 10,
    id: 'stg-boot-drivers',
    name: 'CARGA DE BOOT DRIVERS',
    actor: 'stornvme.sys / storahci.sys / ntfs.sys',
    description: 'Inicialización de controladoras de disco para montar la unidad C: activa.',
    possibleFailure: 'Pantallazo azul `INACCESSIBLE_BOOT_DEVICE` (0x7B) al girar puntos.',
    firstCheckTool: 'Ajustar modo SATA/NVMe en BIOS / Cargar driver AHCI/VMD en WinRE.',
  },
  {
    stageNumber: 11,
    id: 'stg-services',
    name: 'SERVICIOS DE SISTEMA (SESIÓN 0)',
    actor: 'smss.exe, csrss.exe, wininit.exe, services.exe',
    description: 'Arranque del Service Control Manager, Plug and Play, Audio y Red en segundo plano.',
    possibleFailure: 'Cuelgue en servicio crítico con BSOD `CRITICAL_PROCESS_DIED`.',
    firstCheckTool: 'Modo Seguro / Deshabilitar servicios sospechosos con `sc.exe`.',
  },
  {
    stageNumber: 12,
    id: 'stg-logon',
    name: 'INICIO DE SESIÓN (WINLOGON & LOGONUI)',
    actor: 'winlogon.exe, LogonUI.exe, lsass.exe',
    description: 'Presentación del escritorio seguro, validación de credenciales y carga de NTUSER.DAT.',
    possibleFailure: 'Bucle en pantalla de login, mensaje "El servicio de perfil de usuario no pudo iniciar sesión".',
    firstCheckTool: 'Reparar colmena NTUSER.DAT / Iniciar con cuenta de administrador local.',
  },
  {
    stageNumber: 13,
    id: 'stg-explorer',
    name: 'LANZAMIENTO DEL SHELL (EXPLORER.EXE)',
    actor: 'explorer.exe & DWM',
    description: 'Renderizado de barra de tareas, escritorio, iconos y apps de inicio.',
    possibleFailure: 'Pantalla negra con cursor móvil visible tras ingresar contraseña.',
    firstCheckTool: 'Ctrl+Shift+Esc > Nueva tarea > `explorer.exe` / Limpiar extensiones de shell.',
  },
];

// 8 MINICASOS REALES DE TALLER DE SECTOR 01
export const SECTOR_01_MINICASES: Sector01MiniCase[] = [
  {
    id: 'case-01-01',
    code: 'CASO 01-01',
    title: 'La PC muda (No POST)',
    scenario: 'Un usuario limpia el interior de su computadora de escritorio. Al volver a conectar los cables y presionar POWER, los ventiladores giran a máxima velocidad pero el monitor dice "Sin señal", el teclado no enciende luces y no aparece el logo del fabricante.',
    userStatement: '“Windows se borró cuando limpié la computadora con el soplete.”',
    initialMistake: 'Culpar al sistema operativo cuando el hardware ni siquiera ha completado la fase POST.',
    diagnosticQuestion: '¿En qué etapa de la cadena de arranque se encuentra detenida la máquina?',
    options: [
      {
        id: 'c1_o1',
        text: 'Fase 2: POST de Hardware. La CPU o la RAM perdieron contacto físico o se desacomodaron durante la limpieza.',
        isCorrect: true,
        explanation: 'Sin superar el POST, la placa madre no inicializa el video ni busca el cargador de Windows.',
      },
      {
        id: 'c1_o2',
        text: 'Fase 13: El Explorador de Windows se colgó.',
        isCorrect: false,
        explanation: 'Explorer es el último paso, la PC ni siquiera ha iniciado el hardware.',
      },
      {
        id: 'c1_o3',
        text: 'EVIDENCIA INSUFICIENTE.',
        isCorrect: false,
        explanation: 'El síntoma de ventiladores al 100% sin señal ni luces en teclado es un caso clásico de POST fallido.',
      },
    ],
    technicalVerdict: 'Módulo de RAM mal asentado tras la limpieza. Al reacomodar los módulos en los zócalos DIMM, el POST se completó y Windows inició con normalidad.',
    lessonLearned: 'Sin video ni luces de teclado en el primer segundo, el diagnóstico es 100% de hardware/firmware, nunca de Windows.',
  },

  {
    id: 'case-01-02',
    code: 'CASO 01-02',
    title: 'El pendrive invasor (No Boot Device)',
    scenario: 'Una persona apaga su laptop por la noche dejando conectado un pendrive USB que utilizó para imprimir fotos. Por la mañana enciende la laptop y aparece un mensaje en texto blanco: "An operating system wasn\'t found. Try disconnecting any drives that don\'t contain an operating system. Press Ctrl+Alt+Del to restart".',
    userStatement: '“El disco de mi laptop se quemó durante la noche.”',
    initialMistake: 'Asumir falla física del almacenamiento sin verificar la prioridad de arranque del firmware.',
    diagnosticQuestion: '¿Qué ocurrió en la cadena de arranque?',
    options: [
      {
        id: 'c2_o1',
        text: 'Fase 4: El Boot Order del firmware tenía al puerto USB por encima del SSD interno. La UEFI intentó arrancar desde el pendrive de fotos y falló.',
        isCorrect: true,
        explanation: 'Al encontrar primero un medio sin cargador EFI válido, el firmware detiene el proceso.',
      },
      {
        id: 'c2_o2',
        text: 'El pendrive tenía un virus que borró Windows en 2 segundos.',
        isCorrect: false,
        explanation: 'El pendrive de fotos no ejecutó nada; simplemente carece de archivos de arranque.',
      },
    ],
    technicalVerdict: 'Conflicto de prioridad en el orden de arranque. Al desconectar el pendrive o configurar "Windows Boot Manager" como primera opción, la PC inició de inmediato.',
    lessonLearned: '“No boot device” suele ser un problema de prioridad en el Boot Order, no una muerte súbita del disco.',
  },

  {
    id: 'case-01-03',
    code: 'CASO 01-03',
    title: 'SSD visible pero Windows ausente',
    scenario: 'Un técnico conecta un SSD NVMe a una PC. Al entrar al menú de la UEFI, el modelo del SSD "Samsung 980 Pro 1TB" figura perfectamente detectado en la lista de puertos PCIe. Sin embargo, en la lista de opciones de arranque (Boot Priorities) no aparece la opción "Windows Boot Manager".',
    userStatement: '“Si la BIOS ve el disco, Windows tiene que arrancar sí o sí.”',
    initialMistake: 'Confundir la detección física de hardware con la existencia de una partición ESP y un cargador registrado en NVRAM.',
    diagnosticQuestion: '¿Por qué el firmware detecta el disco pero no muestra Windows Boot Manager?',
    options: [
      {
        id: 'c3_o1',
        text: 'Porque el disco carece de una partición del sistema EFI válida con `bootmgfw.efi`, o la variable NVRAM correspondiente no fue registrada.',
        isCorrect: true,
        explanation: 'UEFI busca una entrada lógica con firma digital, no solo el disco como bloque de metal.',
      },
      {
        id: 'c3_o2',
        text: 'Porque el SSD necesita pasta térmica.',
        isCorrect: false,
        explanation: 'La pasta térmica es para disipar calor, no guarda archivos de arranque.',
      },
    ],
    technicalVerdict: 'El disco era nuevo o había sido clonado de forma incompleta sin transferir la partición ESP. Se requirió crear la partición EFI con `bcdboot C:\\Windows /s S: /f UEFI`.',
    lessonLearned: 'Que la placa detecte el disco físico no demuestra que el sistema de arranque esté instalado.',
  },

  {
    id: 'case-01-04',
    code: 'CASO 01-04',
    title: 'La pantalla azul 0xc000000e tras clonar',
    scenario: 'Un usuario clona su disco duro viejo a un SSD nuevo de mayor capacidad. Al encender con el nuevo SSD, aparece una pantalla azul de Recuperación con el mensaje: "Your PC needs to be repaired. The application or operating system couldn\'t be loaded because a required file is missing or contains errors. File: \\Windows\\system32\\winload.efi. Error code: 0xc000000e".',
    userStatement: '“La clonación borró el archivo winload.efi de System32.”',
    initialMistake: 'Creer que el archivo físico fue eliminado cuando en realidad el identificador GUID de la partición cambió.',
    diagnosticQuestion: '¿En qué estructura se originó el error 0xc000000e?',
    options: [
      {
        id: 'c4_o1',
        text: 'Fase 7: En la base de datos BCD. La entrada `osdevice` apunta al GUID del disco anterior y no encuentra la partición en el nuevo SSD.',
        isCorrect: true,
        explanation: 'El BCD almacena las firmas únicas de disco; al cambiar de SSD, las firmas deben reconstruirse con bcdboot.',
      },
      {
        id: 'c4_o2',
        text: 'En la memoria RAM que se quedó sin espacio.',
        isCorrect: false,
        explanation: 'El error 0xc000000e es un código específico de puntero de BCD no resuelto.',
      },
    ],
    technicalVerdict: 'Punteros de disco desactualizados en el BCD. Se solucionó arrancando con un medio WinRE y ejecutando `bcdboot C:\\Windows /s S: /f UEFI`.',
    lessonLearned: 'El error 0xc000000e es el síntoma inequívoco de un BCD con rutas de partición rotas.',
  },

  {
    id: 'case-01-05',
    code: 'CASO 01-05',
    title: 'El cursor solitario tras el login',
    scenario: 'Un usuario introduce su contraseña en la pantalla de inicio de sesión de Windows 11. La pantalla de login desaparece, pero en lugar del escritorio aparece una pantalla completamente negra. El cursor del mouse es visible y se mueve con total fluidez. Al presionar Ctrl + Shift + Esc, el Administrador de Tareas se abre al instante.',
    userStatement: '“Se dañó el núcleo de Windows o la placa de video se quemó.”',
    initialMistake: 'Asumir una falla catastrófica de hardware o kernel cuando la máquina responde a comandos de teclado y dibuja el cursor.',
    diagnosticQuestion: '¿Qué componentes ya podemos confirmar que funcionan al 100% y cuál es el único proceso fallido?',
    options: [
      {
        id: 'c5_o1',
        text: 'Hardware, firmware, kernel, drivers de video y servicios de autenticación están 100% sanos. El único fallo es que el shell `explorer.exe` no se inició.',
        isCorrect: true,
        explanation: 'El cursor renderizado y el Administrador de Tareas demuestran que el kernel y el DWM funcionan perfectamente.',
      },
      {
        id: 'c5_o2',
        text: 'La placa de video está quemada a la mitad.',
        isCorrect: false,
        explanation: 'Si la GPU estuviera rota, no dibujaría el cursor ni el Administrador de Tareas.',
      },
    ],
    technicalVerdict: 'Fallo en la carga de explorer.exe provocado por una extensión de shell de terceros corrupta. Desde el Administrador de Tareas se ejecutó `explorer.exe` y el escritorio se recuperó al instante.',
    lessonLearned: 'La "pantalla negra con cursor móvil" es un fallo exclusivo de la Fase 13 (Explorer), nunca del kernel.',
  },

  {
    id: 'case-01-06',
    code: 'CASO 01-06',
    title: 'El emulador que no abre',
    scenario: 'Un estudiante de programación instala Docker y el emulador de Android en Windows 11. Ambos programas arrojan un error crítico: "Hardware-assisted virtualization is required but disabled on this machine". El usuario abre el Administrador de Tareas y en la pestaña Rendimiento > CPU lee: "Virtualización: Deshabilitado".',
    userStatement: '“Mi procesador Intel Core i7 no soporta virtualización.”',
    initialMistake: 'Confundir una opción deshabilitada en el firmware con una carencia física del silicio.',
    diagnosticQuestion: '¿Cómo se habilita la virtualización por hardware en esta máquina?',
    options: [
      {
        id: 'c6_o1',
        text: 'Fase 3: Entrar al menú de la UEFI de la placa madre y activar "Intel Virtualization Technology" (Intel VT-x) o "AMD SVM Mode".',
        isCorrect: true,
        explanation: 'Todos los procesadores modernos de los últimos 15 años incluyen la instrucción, pero puede venir desactivada de fábrica en la placa.',
      },
      {
        id: 'c6_o2',
        text: 'Instalando una actualización de Windows Update.',
        isCorrect: false,
        explanation: 'Windows Update no puede sobreescribir la configuración de seguridad del firmware.',
      },
    ],
    technicalVerdict: 'Opción Intel VT-x desactivada en la BIOS por configuración predeterminada del fabricante de la placa. Al activarla en UEFI, la virtualización pasó a "Habilitado" en Windows.',
    lessonLearned: 'Las capacidades del procesador como VT-x, TPM y ReBAR dependen del interruptor maestro del firmware.',
  },

  {
    id: 'case-01-07',
    code: 'CASO 01-07',
    title: 'La trampa de los dos discos viejos',
    scenario: 'Un técnico arma una PC instalando Windows en un SSD NVMe nuevo de 1 TB. Además, le conecta un disco rígido mecánico de 500 GB de una computadora vieja para almacenar archivos. Al encender la PC, arranca un Windows 10 viejo y desactualizado en lugar del Windows 11 del SSD nuevo.',
    userStatement: '“El instalador de Windows 11 instaló el sistema en el disco equivocado.”',
    initialMistake: 'No verificar el orden de prioridad de discos en la NVRAM de la UEFI tras conectar almacenamiento heredado.',
    diagnosticQuestion: '¿Qué ocurrió en el firmware?',
    options: [
      {
        id: 'c7_o1',
        text: 'Fase 4: La entrada de arranque del disco mecánico antiguo quedó en primer lugar en el Boot Order de la UEFI.',
        isCorrect: true,
        explanation: 'Al encontrar el gestor antiguo primero, la placa lo ejecuta fielmente.',
      },
      {
        id: 'c7_o2',
        text: 'El disco NVMe nuevo se borró por simpatía electromagnética.',
        isCorrect: false,
        explanation: 'Mito sin fundamento técnico.',
      },
    ],
    technicalVerdict: 'Conflicto de entradas de arranque. Se ingresó a la UEFI y se seleccionó el "Windows Boot Manager" del NVMe como primera prioridad (Boot Option #1).',
    lessonLearned: 'Al conectar discos con instalaciones antiguas previas, siempre verificá el Boot Order en el firmware.',
  },

  {
    id: 'case-01-08',
    code: 'CASO 01-08',
    title: 'El mito del reinicio que no reinicia',
    scenario: 'Un usuario aplica un parche de registro y apaga la computadora desde el menú Inicio > Apagar. Al presionar el botón de encendido minutos después, descubre que los controladores no se recargaron y el tiempo de actividad de la CPU en el Administrador de Tareas dice "Tiempo activo: 5 días 14 horas".',
    userStatement: '“Windows no me hace caso cuando le doy a Apagar.”',
    initialMistake: 'Desconocer el funcionamiento de la tecnología Fast Startup (Inicio Rápido) de Windows.',
    diagnosticQuestion: '¿Por qué la sesión de kernel no se reinició al apagar el equipo?',
    options: [
      {
        id: 'c8_o1',
        text: 'Fase 10: "Apagar" con Fast Startup activo no purga el kernel, sino que guarda la sesión en `hiberfil.sys`. Solo la opción "Reiniciar" realiza un reinicio limpio.',
        isCorrect: true,
        explanation: 'Fast Startup convierte el apagado en una hibernación híbrida del núcleo para acelerar el encendido posterior.',
      },
      {
        id: 'c8_o2',
        text: 'Porque el botón de encendido del gabinete tiene un virus.',
        isCorrect: false,
        explanation: 'Los botones físicos son interruptores mecánicos sin software.',
      },
    ],
    technicalVerdict: 'Comportamiento esperado de la función Inicio Rápido de Windows. Para purgar el kernel se instruyó al usuario a usar "Reiniciar" o el comando `shutdown /r /t 0`.',
    lessonLearned: 'Apagar ≠ Reiniciar en Windows moderno con Fast Startup habilitado.',
  },
];

// BANCO DE 24 PREGUNTAS DEL TEST DE SECTOR 01
export const SECTOR_01_TEST_BANK: Sector01TestQuestion[] = [
  {
    id: 't01-q01',
    questionNumber: 1,
    category: 'POST_FIRMWARE',
    scenario: 'Presionás el botón POWER de una PC. Durante el primer segundo, los ventiladores giran pero no hay texto en pantalla ni luces en el teclado.',
    question: '¿Qué componente gobierna la máquina durante este primer segundo?',
    options: [
      { id: 'o1', text: 'El hardware eléctrico de la fuente (señal PWR_OK), el chipset y el firmware UEFI de la placa madre.', isCorrect: true, technicalJustification: 'Windows no tiene ningún control hasta que el hardware completa el POST y se ejecuta el cargador.' },
      { id: 'o2', text: 'El kernel de Windows (ntoskrnl.exe).', isCorrect: false, technicalJustification: 'El kernel aún no ha sido cargado en memoria RAM.' },
      { id: 'o3', text: 'El navegador Microsoft Edge.', isCorrect: false, technicalJustification: 'Aplicación de usuario que corre miles de pasos después.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El gobierno del hardware en el primer segundo está definido por la arquitectura de la placa madre.' },
    ],
  },
  {
    id: 't01-q02',
    questionNumber: 2,
    category: 'POST_FIRMWARE',
    scenario: 'Una computadora emite 1 pitido largo y 2 cortos durante el encendido y la pantalla queda en negro absoluto.',
    question: '¿Tiene sentido intentar reparar el archivo BCD de Windows para resolver este fallo?',
    options: [
      { id: 'o1', text: 'NO: El fallo ocurre durante la fase POST de hardware (típicamente fallo de inicialización de video); la PC ni siquiera ha intentado leer el disco.', isCorrect: true, technicalJustification: 'Los códigos sonoros de POST indican fallas físicas antes del acceso a disco.' },
      { id: 'o2', text: 'SÍ: El BCD repara los ventiladores.', isCorrect: false, technicalJustification: 'El BCD es una base de datos de software de arranque, no repara circuitos de video.' },
      { id: 'o3', text: 'SÍ: Porque todo error de pantalla negra es culpa de Windows.', isCorrect: false, technicalJustification: 'Mito de principiante.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE: Se requiere saber la marca del teclado.', isCorrect: false, technicalJustification: 'El teclado no tiene relación con el diagnóstico de POST de video.' },
    ],
  },
  {
    id: 't01-q03',
    questionNumber: 3,
    category: 'UEFI_NVRAM',
    scenario: 'Consultás `msinfo32` en una laptop moderna y observás "Modo de BIOS: UEFI" y "Estado de inicio seguro: Activado".',
    question: '¿Qué garantiza técnicamente la combinación de UEFI nativo y Secure Boot?',
    options: [
      { id: 'o1', text: 'Que el firmware solo ejecutará cargadores de arranque y controladores EFI firmados digitalmente por certificados de confianza, bloqueando bootkits en Ring 0.', isCorrect: true, technicalJustification: 'Secure Boot valida las firmas SHA-256 contra las bases de datos de claves en NVRAM.' },
      { id: 'o2', text: 'Que la computadora no se puede conectar a internet.', isCorrect: false, technicalJustification: 'No guarda relación con la red.' },
      { id: 'o3', text: 'Que la memoria RAM funciona al triple de velocidad.', isCorrect: false, technicalJustification: 'Mito sin fundamento.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La especificación de Secure Boot define con precisión este mecanismo de seguridad.' },
    ],
  },
  {
    id: 't01-q04',
    questionNumber: 4,
    category: 'EFI_BCD',
    scenario: 'Un usuario abrió el Administrador de Discos y vio una partición de 100 MB formateada en FAT32 sin letra asignada.',
    question: '¿Cuál es la función vital de esta partición (Partición del Sistema EFI / ESP)?',
    options: [
      { id: 'o1', text: 'Alojar los archivos del Windows Boot Manager (`bootmgfw.efi`) y la base de datos BCD que el firmware UEFI necesita para iniciar el sistema.', isCorrect: true, technicalJustification: 'La partición ESP es el estándar UEFI universal para almacenar cargadores de arranque.' },
      { id: 'o2', text: 'Guardar la papelera de reciclaje de Windows.', isCorrect: false, technicalJustification: 'La papelera se almacena en `$Recycle.Bin` dentro de cada volumen NTFS.' },
      { id: 'o3', text: 'Guardar los videos temporales de YouTube.', isCorrect: false, technicalJustification: 'Ubicación no relacionada.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La partición ESP es una estructura canónica documentada.' },
    ],
  },
  {
    id: 't01-q05',
    questionNumber: 5,
    category: 'EFI_BCD',
    scenario: 'Al encender la PC aparece una pantalla azul con el mensaje: "The Boot Configuration Data file is missing or contains errors. Error code: 0xc000000e".',
    question: '¿Qué herramienta oficial de línea de comandos de Windows permite reconstruir esta base de datos desde un medio de recuperación?',
    options: [
      { id: 'o1', text: '`bootrec /rebuildbcd` (o `bcdboot C:\\Windows /s S: /f UEFI`).', isCorrect: true, technicalJustification: 'bcdboot y bootrec reconstruyen los punteros y descriptores del almacén BCD en la partición ESP.' },
      { id: 'o2', text: '`format C: /q`', isCorrect: false, technicalJustification: 'Formatear borra todo el sistema operativo.' },
      { id: 'o3', text: '`calc.exe`', isCorrect: false, technicalJustification: 'Calculadora.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'bcdboot es la herramienta oficial documentada para reconstruir el BCD.' },
    ],
  },
  {
    id: 't01-q06',
    questionNumber: 6,
    category: 'KERNEL_DRIVERS',
    scenario: 'Windows comienza a cargar, los puntos giran en círculo durante 5 segundos y de repente aparece un pantallazo azul con el código `INACCESSIBLE_BOOT_DEVICE`.',
    question: '¿En qué fase de la cadena de arranque ocurrió la ruptura?',
    options: [
      { id: 'o1', text: 'Fase 10: En la carga de Boot Drivers. El kernel NT no dispone del controlador de almacenamiento (AHCI/NVMe) para leer la partición C:.', isCorrect: true, technicalJustification: 'El error 0x7B ocurre cuando el kernel pierde comunicación con la controladora de disco durante la inicialización.' },
      { id: 'o2', text: 'Fase 1: La fuente de poder se apagó.', isCorrect: false, technicalJustification: 'Si la fuente se apagara no habría pantalla azul con texto.' },
      { id: 'o3', text: 'Fase 13: El icono de la papelera está dañado.', isCorrect: false, technicalJustification: 'No tiene relación con el arranque de bajo nivel.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'INACCESSIBLE_BOOT_DEVICE tiene como causa raíz la pérdida de acceso al volumen de arranque.' },
    ],
  },
  {
    id: 't01-q07',
    questionNumber: 7,
    category: 'DIAGNÓSTICO',
    scenario: 'El usuario ingresa su PIN, desaparece la pantalla de inicio de sesión y queda una pantalla negra con el cursor del mouse visible y móvil.',
    question: '¿Cuál es el estado real del sistema operativo en este momento?',
    options: [
      { id: 'o1', text: 'El hardware, firmware, kernel, drivers y servicios están 100% operativos; el único fallo es que el proceso del shell `explorer.exe` no se ejecutó.', isCorrect: true, technicalJustification: 'El cursor activo y responsivo demuestra que el subsistema gráfico DWM y el kernel responden perfectamente.' },
      { id: 'o2', text: 'El disco duro se quemó físicamente.', isCorrect: false, technicalJustification: 'Si el disco estuviera quemado, la máquina no habría llegado a la pantalla de login.' },
      { id: 'o3', text: 'La placa madre no tiene procesador.', isCorrect: false, technicalJustification: 'Absurdo.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El síntoma de pantalla negra con cursor móvil aisla de forma concluyente la falla en explorer.exe.' },
    ],
  },
  {
    id: 't01-q08',
    questionNumber: 8,
    category: 'UEFI_NVRAM',
    scenario: 'Querés que tu equipo con Windows 11 se reinicie y abra de forma automática la interfaz de configuración del firmware sin presionar ninguna tecla.',
    question: '¿Qué comando de consola de Administrador realiza esta acción?',
    options: [
      { id: 'o1', text: '`shutdown /r /fw /t 0`', isCorrect: true, technicalJustification: 'El modificador /fw programa la variable NVRAM OsIndications para entrar a la UEFI en el próximo booteo.' },
      { id: 'o2', text: '`exit /bios`', isCorrect: false, technicalJustification: 'Comando inexistente.' },
      { id: 'o3', text: '`del /f /s C:\\Windows`', isCorrect: false, technicalJustification: 'Comando destructivo.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: '`shutdown /r /fw /t 0` es el comando oficial documentado por Microsoft.' },
    ],
  },
  {
    id: 't01-q09',
    questionNumber: 9,
    category: 'POST_FIRMWARE',
    scenario: 'Instalás módulos de memoria DDR5 que en la caja dicen "6000 MT/s", pero en el Administrador de Tareas figura "4800 MT/s".',
    question: '¿Por qué la memoria no funciona automáticamente a 6000 MT/s?',
    options: [
      { id: 'o1', text: 'Porque toda memoria RAM inicia por seguridad en el estándar base JEDEC; la velocidad de 6000 MT/s requiere activar el perfil XMP/EXPO en el firmware UEFI.', isCorrect: true, technicalJustification: 'Los perfiles de alto rendimiento XMP/EXPO residen en el SPD y deben ser habilitados en el firmware.' },
      { id: 'o2', text: 'Porque Windows 11 no soporta más de 4800 MT/s.', isCorrect: false, technicalJustification: 'Windows soporta cualquier velocidad de RAM que la placa y el procesador puedan manejar.' },
      { id: 'o3', text: 'Porque el cable de corriente es muy fino.', isCorrect: false, technicalJustification: 'No tiene relación con la frecuencia de la RAM.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El comportamiento de arranque en perfil JEDEC es la norma de la industria.' },
    ],
  },
  {
    id: 't01-q10',
    questionNumber: 10,
    category: 'UEFI_NVRAM',
    scenario: 'Un cliente te dice: "Desactivé el chip TPM en la BIOS y ahora Windows no me deja iniciar sesión con mi PIN".',
    question: '¿Por qué el PIN de Windows Hello depende del chip TPM?',
    options: [
      { id: 'o1', text: 'Porque el PIN de Windows Hello está sellado criptográficamente dentro de las llaves privadas del hardware TPM.', isCorrect: true, technicalJustification: 'Windows Hello utiliza el hardware TPM para garantizar que el PIN solo sea válido en esa placa madre física.' },
      { id: 'o2', text: 'Porque el TPM tiene la contraseña de su correo electrónico en un archivo de texto.', isCorrect: false, technicalJustification: 'El TPM no guarda contraseñas en texto plano.' },
      { id: 'o3', text: 'Porque el teclado necesita el TPM para enviar letras.', isCorrect: false, technicalJustification: 'El teclado no utiliza el TPM.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La arquitectura de Windows Hello y su dependencia del TPM está estandarizada.' },
    ],
  },
  {
    id: 't01-q11',
    questionNumber: 11,
    category: 'EFI_BCD',
    scenario: 'Se ejecuta la llamada `ExitBootServices()` durante el proceso de arranque.',
    question: '¿Qué hito fundamental marca esta llamada en la transición del sistema?',
    options: [
      { id: 'o1', text: 'El firmware UEFI libera el control de la memoria y la CPU se transfiere formalmente al kernel del sistema operativo.', isCorrect: true, technicalJustification: 'ExitBootServices es el límite arquitectónico donde finaliza el entorno pre-boot de UEFI y nace Windows.' },
      { id: 'o2', text: 'Se apaga la pantalla del monitor para siempre.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o3', text: 'Se borra el archivo winload.efi del disco.', isCorrect: false, technicalJustification: 'El archivo permanece intacto en disco.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'ExitBootServices es la función documentada en la especificación UEFI.' },
    ],
  },
  {
    id: 't01-q12',
    questionNumber: 12,
    category: 'KERNEL_DRIVERS',
    scenario: 'El archivo `ntoskrnl.exe` comienza su Fase 0 de inicialización.',
    question: '¿Qué estado tienen las interrupciones del procesador durante esta fase inicial?',
    options: [
      { id: 'o1', text: 'Las interrupciones de hardware están completamente desactivadas (CLI) mientras se configuran las tablas de descriptores y el gestor de memoria.', isCorrect: true, technicalJustification: 'El kernel no puede atender interrupciones hasta que su tabla IDT y sus manejadores básicos estén construidos.' },
      { id: 'o2', text: 'Las interrupciones atienden clics del mouse.', isCorrect: false, technicalJustification: 'El mouse aún no ha sido inicializado.' },
      { id: 'o3', text: 'Las interrupciones envían correos electrónicos.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La Fase 0 del kernel NT opera obligatoriamente con interrupciones enmascaradas.' },
    ],
  },
  {
    id: 't01-q13',
    questionNumber: 13,
    category: 'DIAGNÓSTICO',
    scenario: 'Una PC arranca, muestra el logo de la placa madre, pero en lugar de cargar Windows entra directamente y sin tocar nada al menú de configuración de la BIOS.',
    question: '¿Qué condición de fallo explica que la placa madre se quede en su propio menú?',
    options: [
      { id: 'o1', text: 'Fase 4: La UEFI no encontró ningún dispositivo de almacenamiento con una partición de arranque válida (o el SSD se desconectó/dañó).', isCorrect: true, technicalJustification: 'Cuando no existe ninguna entrada ejecutable en el Boot Order, el comportamiento por defecto de UEFI es abrir su menú.' },
      { id: 'o2', text: 'Windows decidió que es hora de jugar a la BIOS.', isCorrect: false, technicalJustification: 'Windows no tiene relación con esta decisión.' },
      { id: 'o3', text: 'El ventilador gira al revés.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El bucle a menú de BIOS es el síntoma canónico de ausencia de entrada de booteo.' },
    ],
  },
  {
    id: 't01-q14',
    questionNumber: 14,
    category: 'POST_FIRMWARE',
    scenario: 'Se activa la opción "Above 4G Decoding" y "Re-Size BAR Support" en el menú de la UEFI.',
    question: '¿Qué beneficio técnico obtiene la computadora durante la ejecución de videojuegos pesados?',
    options: [
      { id: 'o1', text: 'La CPU puede mapear y direccionar toda la memoria de video (VRAM) de la tarjeta gráfica en una sola transacción en lugar de bloques de 256 MB.', isCorrect: true, technicalJustification: 'Resizable BAR elimina el cuello de botella del búfer de apertura de 256 MB del bus PCIe.' },
      { id: 'o2', text: 'La pantalla cambia de 60 Hz a 5000 Hz.', isCorrect: false, technicalJustification: 'No altera los límites del panel del monitor.' },
      { id: 'o3', text: 'Se duplica la cantidad de memoria RAM física instalada.', isCorrect: false, technicalJustification: 'No crea memoria mágica.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El mecanismo de Resizable BAR está estandarizado por el consorcio PCI-SIG.' },
    ],
  },
  {
    id: 't01-q15',
    questionNumber: 15,
    category: 'UEFI_NVRAM',
    scenario: 'Un usuario quiere instalar Windows 11 en un equipo con tabla de particiones MBR antigua y modo Legacy activado.',
    question: '¿Por qué el instalador de Windows 11 rechaza la instalación?',
    options: [
      { id: 'o1', text: 'Porque Windows 11 requiere obligatoriamente firmware UEFI nativo con tabla de particiones GPT y arranque seguro Secure Boot.', isCorrect: true, technicalJustification: 'Microsoft estableció el estándar UEFI GPT como requisito arquitectónico indispensable para Windows 11.' },
      { id: 'o2', text: 'Porque el disco MBR tiene un color oscuro.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o3', text: 'Porque MBR solo funciona con Linux.', isCorrect: false, technicalJustification: 'Falso: MBR funcionó con todas las versiones previas de Windows.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El requisito de UEFI GPT para Windows 11 es oficial y explícito.' },
    ],
  },
  {
    id: 't01-q16',
    questionNumber: 16,
    category: 'DIAGNÓSTICO',
    scenario: 'Observás que el proceso `lsass.exe` se inicia durante el arranque de Windows.',
    question: '¿Qué función crítica de seguridad cumple este proceso?',
    options: [
      { id: 'o1', text: 'Verificar las credenciales de usuario, emitir los tokens de seguridad y gestionar las políticas de inicio de sesión locales y de dominio.', isCorrect: true, technicalJustification: 'lsass.exe (Local Security Authority Subsystem Service) es el responsable de la autenticación en Windows.' },
      { id: 'o2', text: 'Reproducir el sonido de inicio de Windows.', isCorrect: false, technicalJustification: 'El sonido lo gestiona el subsistema de audio.' },
      { id: 'o3', text: 'Comprimir imágenes JPG.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'lsass.exe es el componente de seguridad documentado por Microsoft.' },
    ],
  },
  {
    id: 't01-q17',
    questionNumber: 17,
    category: 'POST_FIRMWARE',
    scenario: 'Un disipador de CPU se suelta y la temperatura del procesador alcanza los 105°C durante el inicio de la PC.',
    question: '¿Qué mecanismo protege al procesador de fundirse físicamente?',
    options: [
      { id: 'o1', text: 'El sensor térmico interno del silicio activa la señal de corte de emergencia THERMTRIP# apagando la fuente por hardware de inmediato.', isCorrect: true, technicalJustification: 'La protección térmica es una salvaguarda de silicio y placa madre autónoma de cualquier software.' },
      { id: 'o2', text: 'El antivirus Windows Defender manda un mensaje de texto.', isCorrect: false, technicalJustification: 'Absurdo.' },
      { id: 'o3', text: 'El cable HDMI enfría el gabinete.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'THERMTRIP# es la especificación de protección térmica de Intel y AMD.' },
    ],
  },
  {
    id: 't01-q18',
    questionNumber: 18,
    category: 'EFI_BCD',
    scenario: 'En una máquina con arranque dual (Windows 11 y Windows 10), el usuario quiere cambiar cuál de los dos inicia por defecto.',
    question: '¿Qué herramienta oficial de Windows permite modificar el sistema operativo predeterminado de forma segura?',
    options: [
      { id: 'o1', text: '`msconfig` (Pestaña "Arranque") o el comando `bcdedit /default {ID}`.', isCorrect: true, technicalJustification: 'msconfig y bcdedit modifican de forma válida y segura la entrada predeterminada del BCD.' },
      { id: 'o2', text: 'El Bloc de Notas editando `boot.ini`.', isCorrect: false, technicalJustification: 'boot.ini no existe en sistemas UEFI modernos con BCD.' },
      { id: 'o3', text: 'Desinstalar la tarjeta de sonido.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'msconfig y bcdedit son las herramientas de administración de BCD.' },
    ],
  },
  {
    id: 't01-q19',
    questionNumber: 19,
    category: 'KERNEL_DRIVERS',
    scenario: 'El proceso `smss.exe` es el primer proceso en modo usuario creado por el kernel.',
    question: '¿Cuál es su tarea primordial al iniciar la arquitectura de sesiones?',
    options: [
      { id: 'o1', text: 'Crear las variables de entorno del sistema, iniciar los subsistemas win32k/csrss y lanzar la Sesión 0 de servicios y la Sesión 1 de usuario.', isCorrect: true, technicalJustification: 'smss.exe (Session Manager Subsystem) es el ancestro de todas las sesiones de usuario en Windows NT.' },
      { id: 'o2', text: 'Descargar juegos de Steam.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o3', text: 'Buscar virus en el pendrive.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'smss.exe es el Session Manager nativo documentado en Windows Internals.' },
    ],
  },
  {
    id: 't01-q20',
    questionNumber: 20,
    category: 'UEFI_NVRAM',
    scenario: 'Un técnico conecta un dispositivo Thunderbolt desconocido a una laptop y la laptop bloquea la transferencia DMA directa a la RAM.',
    question: '¿Qué subsistema de hardware y firmware ejecutó esta protección?',
    options: [
      { id: 'o1', text: 'La unidad IOMMU (Intel VT-d / AMD-Vi) y la función Kernel DMA Protection.', isCorrect: true, technicalJustification: 'IOMMU aísla los espacios de memoria asignados a puertos de acceso directo DMA.' },
      { id: 'o2', text: 'El conector USB con un fusible mecánico.', isCorrect: false, technicalJustification: 'No es un fusible mecánico.' },
      { id: 'o3', text: 'El protector de pantalla de Windows.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'IOMMU es el estándar de aislamiento de memoria para periféricos.' },
    ],
  },
  {
    id: 't01-q21',
    questionNumber: 21,
    category: 'DIAGNÓSTICO',
    scenario: 'La PC muestra el logo de la placa madre y se congela permanentemente sin que los puntos giratorios de Windows lleguen a aparecer jamás.',
    question: '¿Podemos asegurar con certeza que el archivo `ntoskrnl.exe` se colgó?',
    options: [
      { id: 'o1', text: 'EVIDENCIA INSUFICIENTE: La máquina está detenida en la fase de firmware UEFI o en la lectura de la partición ESP antes de que winload.efi transfiera el control a ntoskrnl.exe.', isCorrect: true, technicalJustification: 'Si los puntos giratorios nunca aparecieron, el kernel NT aún no ha recibido el control de la CPU.' },
      { id: 'o2', text: 'SÍ: El kernel siempre se cuelga en el logo de la placa.', isCorrect: false, technicalJustification: 'Falso: El logo de la placa pertenece a la fase de firmware y UEFI.' },
      { id: 'o3', text: 'SÍ: Porque ntoskrnl es el único software de la PC.', isCorrect: false, technicalJustification: 'Falso.' },
      { id: 'o4', text: 'NO: Porque los procesadores no usan kernel.', isCorrect: false, technicalJustification: 'Falso.' },
    ],
  },
  {
    id: 't01-q22',
    questionNumber: 22,
    category: 'POST_FIRMWARE',
    scenario: 'Se configura la opción "Fast Boot" en el firmware UEFI en modo "Ultra Fast".',
    question: '¿Qué consecuencia práctica puede experimentar el usuario al intentar entrar a la BIOS en el siguiente encendido?',
    options: [
      { id: 'o1', text: 'La placa madre omite la inicialización lenta de puertos USB durante el POST, lo que hace casi imposible presionar la tecla F2/Supr a tiempo con un teclado USB.', isCorrect: true, technicalJustification: 'Fast Boot reduce el tiempo de detección de teclados en el bus USB para acelerar el POST.' },
      { id: 'o2', text: 'La computadora consume el doble de electricidad.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o3', text: 'El teclado escribe en chino automáticamente.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'El efecto de omitir la enumeración de USB en Fast Boot es conocido y documentado.' },
    ],
  },
  {
    id: 't01-q23',
    questionNumber: 23,
    category: 'EFI_BCD',
    scenario: 'Un técnico ejecuta el comando `mountvol S: /s` en una consola de Administrador en Windows 11.',
    question: '¿Qué resultado produce este comando en el sistema de archivos?',
    options: [
      { id: 'o1', text: 'Asigna la letra de unidad temporal `S:` a la partición del sistema EFI (ESP) para permitir su inspección y mantenimiento forense.', isCorrect: true, technicalJustification: 'El modificador /s de mountvol monta la partición ESP del sistema en la letra especificada.' },
      { id: 'o2', text: 'Formatea la unidad C: en 1 segundo.', isCorrect: false, technicalJustification: 'mountvol no formatea discos.' },
      { id: 'o3', text: 'Apaga los ventiladores del gabinete.', isCorrect: false, technicalJustification: 'No.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'mountvol /s es la sintaxis nativa de Windows para montar la ESP.' },
    ],
  },
  {
    id: 't01-q24',
    questionNumber: 24,
    category: 'DIAGNÓSTICO',
    scenario: 'En un peritaje técnico se analiza una falla de arranque en una estación de trabajo de laboratorio.',
    question: '¿Cuál es la primera regla metrológica antes de aplicar cualquier cambio o reparación en Windows?',
    options: [
      { id: 'o1', text: 'Aislar en qué fase exacta de las 13 etapas de arranque se detiene la máquina (Física > Firmware > Loader > Kernel > Shell) y comparar contra una hipótesis verificable.', isCorrect: true, technicalJustification: 'El método pericial de EVO Labs exige diagnosticar la etapa de falla antes de intervenir el sistema.' },
      { id: 'o2', text: 'Reinstalar Windows y cambiar todas las piezas al azar.', isCorrect: false, technicalJustification: 'Práctica empírica no profesional que destruye evidencia.' },
      { id: 'o3', text: 'Dejar la PC desenchufada 3 días.', isCorrect: false, technicalJustification: 'No resuelve problemas de configuración.' },
      { id: 'o4', text: 'EVIDENCIA INSUFICIENTE.', isCorrect: false, technicalJustification: 'La metodología de aislamiento por etapas es la norma técnica de diagnóstico.' },
    ],
  },
];

// LAB SCENARIOS DEFINITIONS PARA EL UEFI + BOOT SEQUENCE LAB
export interface BootLabScenario {
  id: string;
  code: string; // 'A' to 'F'
  name: string;
  description: string;
  brokenStageNumber: number;
  brokenStageName: string;
  symptomText: string;
  simulatedVisual: 'BLACK_SCREEN_FAN' | 'NO_BOOT_DEVICE_SCREEN' | 'BCD_RECOVERY_BLUE' | 'INACCESSIBLE_BSOD' | 'BLACK_SCREEN_CURSOR' | 'UEFI_SETUP_LOOP';
  correctHypothesisOptionId: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    technicalDebrief: string;
  }[];
}

export const BOOT_LAB_SCENARIOS: BootLabScenario[] = [
  {
    id: 'scen-a',
    code: 'ESCENARIO A',
    name: 'El bucle del orden de arranque',
    description: 'La máquina enciende, muestra el logo del fabricante, pero inmediatamente entra en un bucle que dice "Reboot and Select proper Boot device or Insert Boot Media in selected Boot device".',
    brokenStageNumber: 4,
    brokenStageName: 'SELECCIÓN DE ENTRADA (BOOT ORDER)',
    symptomText: 'POST OK // DISCOS DETECTADOS // ERROR AL SELECCIONAR MEDIO',
    simulatedVisual: 'NO_BOOT_DEVICE_SCREEN',
    correctHypothesisOptionId: 'hyp_a1',
    options: [
      {
        id: 'hyp_a1',
        text: 'Fase 4 (Boot Order): La prioridad de arranque de la UEFI apunta a un dispositivo vacío o la entrada Windows Boot Manager fue desplazada.',
        isCorrect: true,
        technicalDebrief: '¡Correcto! El hardware está sano, pero la NVRAM no seleccionó el cargador correcto.',
      },
      {
        id: 'hyp_a2',
        text: 'Fase 13 (Explorer): El menú inicio está dañado.',
        isCorrect: false,
        technicalDebrief: 'Incorrecto: Windows ni siquiera ha comenzado a cargar.',
      },
    ],
  },
  {
    id: 'scen-b',
    code: 'ESCENARIO B',
    name: 'Partición ESP eliminada',
    description: 'La UEFI detecta el SSD físico NVMe en el puerto PCIe M.2, pero no encuentra ninguna entrada de arranque "Windows Boot Manager" y salta directamente al setup de la BIOS.',
    brokenStageNumber: 5,
    brokenStageName: 'LECTURA DE PARTICIÓN ESP (FAT32)',
    symptomText: 'SSD FÍSICO OK // PARTICIÓN FAT32 ESP NO ENCONTRADA',
    simulatedVisual: 'UEFI_SETUP_LOOP',
    correctHypothesisOptionId: 'hyp_b1',
    options: [
      {
        id: 'hyp_b1',
        text: 'Fase 5 (Partición ESP): Falta la partición FAT32 del sistema EFI con los archivos `bootmgfw.efi`.',
        isCorrect: true,
        technicalDebrief: '¡Exacto! Sin la partición ESP, el firmware no puede lanzar el gestor de arranque.',
      },
      {
        id: 'hyp_b2',
        text: 'Fase 1: La fuente de alimentación no entrega 5V.',
        isCorrect: false,
        technicalDebrief: 'Incorrecto: La PC enciende y navega en la BIOS con normalidad.',
      },
    ],
  },
  {
    id: 'scen-c',
    code: 'ESCENARIO C',
    name: 'BCD corrupto (Error 0xc000000e)',
    description: 'Aparece el gestor de arranque de Windows pero inmediatamente se detiene en una pantalla azul de recuperación que indica que el archivo BCD contiene errores.',
    brokenStageNumber: 7,
    brokenStageName: 'CONSULTA DE LA BASE BCD',
    symptomText: 'BOOTMGR ACTIVO // BCD CORRUPTO // ERROR 0xc000000e',
    simulatedVisual: 'BCD_RECOVERY_BLUE',
    correctHypothesisOptionId: 'hyp_c1',
    options: [
      {
        id: 'hyp_c1',
        text: 'Fase 7 (Base BCD): La colmena BCD tiene punteros de partición rotos o datos corruptos.',
        isCorrect: true,
        technicalDebrief: '¡Correcto! El código 0xc000000e localiza la falla en el archivo BCD.',
      },
      {
        id: 'hyp_c2',
        text: 'Fase 12: La contraseña del usuario expiró.',
        isCorrect: false,
        technicalDebrief: 'Incorrecto: La autenticación ocurre mucho después.',
      },
    ],
  },
  {
    id: 'scen-d',
    code: 'ESCENARIO D',
    name: 'Driver de almacenamiento incompatible (0x7B)',
    description: 'La máquina pasa el BCD, winload.efi entrega el control al kernel, el círculo de puntos gira durante 3 segundos y estalla un BSOD `INACCESSIBLE_BOOT_DEVICE`.',
    brokenStageNumber: 10,
    brokenStageName: 'CARGA DE BOOT DRIVERS',
    symptomText: 'KERNEL ACTIVO // CONTROLADORA DISCO NO RESPONDE // BSOD 0x7B',
    simulatedVisual: 'INACCESSIBLE_BSOD',
    correctHypothesisOptionId: 'hyp_d1',
    options: [
      {
        id: 'hyp_d1',
        text: 'Fase 10 (Boot Drivers): El kernel no dispone del controlador adecuado para comunicarse con la controladora de disco y montar el volumen C:.',
        isCorrect: true,
        technicalDebrief: '¡Brillante! El kernel pierde el disco de arranque durante la fase Boot Start.',
      },
      {
        id: 'hyp_d2',
        text: 'Fase 2: La memoria RAM está desconectada.',
        isCorrect: false,
        technicalDebrief: 'Incorrecto: La RAM permitió cargar el kernel y mostrar la pantalla azul.',
      },
    ],
  },
  {
    id: 'scen-e',
    code: 'ESCENARIO E',
    name: 'El cursor sobre fondo negro tras login',
    description: 'El usuario ingresa su contraseña en LogonUI, la pantalla de login desaparece y queda una pantalla negra. El cursor del mouse se mueve y Ctrl+Shift+Esc abre el Administrador de Tareas.',
    brokenStageNumber: 13,
    brokenStageName: 'LANZAMIENTO DEL SHELL (EXPLORER.EXE)',
    symptomText: 'KERNEL & LOGIN OK // SHELL EXPLORER.EXE NO INICIADO',
    simulatedVisual: 'BLACK_SCREEN_CURSOR',
    correctHypothesisOptionId: 'hyp_e1',
    options: [
      {
        id: 'hyp_e1',
        text: 'Fase 13 (Explorer Shell): El kernel y la sesión están sanos; el fallo está confinado al proceso `explorer.exe`.',
        isCorrect: true,
        technicalDebrief: '¡Impecable! Se soluciona ejecutando `explorer.exe` desde el Administrador de Tareas.',
      },
      {
        id: 'hyp_e2',
        text: 'Fase 3: Hay que resetear la BIOS.',
        isCorrect: false,
        technicalDebrief: 'Incorrecto: La BIOS ya completó su trabajo hace minutos.',
      },
    ],
  },
];
