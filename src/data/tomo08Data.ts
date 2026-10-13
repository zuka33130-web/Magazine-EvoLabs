// TOMO 08: DEL BOTÓN POWER A WINDOWS // LA SECUENCIA COMPLETA DE ARRANQUE & DIAGNÓSTICO FORENSE
// Datos Editoriales Maestros para la Revista A4 y Plan de Estudio Técnico EVO LABS

export interface Tomo08ModuleItem {
  id: string;
  moduleNumber: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  readTime: string;
  summary: string;
  keySignals: string[];
  componentsInvolved: string[];
  workshopVerification: {
    instrument: string;
    measurement: string;
    expectedValue: string;
    anomalyIndicator: string;
  };
  commonFailures: string[];
  decisionRule: string;
  safetyLevel: 'USUARIO' | 'TÉCNICO' | 'BANCO';
  labStepTarget: number;
}

export interface BootDiagnosticCase {
  id: string;
  title: string;
  equipment: string;
  symptom: string;
  diagnosticStage: string;
  measuredData: string;
  discardedHypothesis: string;
  rootCause: string;
  fixAction: string;
  labStepTarget: number;
}

export const TOMO_08_META = {
  number: '08',
  volumeLabel: 'Tomo 08',
  title: 'SISTEMA EVO LABS DE ARRANQUE Y DIAGNÓSTICO',
  subtitle: 'Del botón POWER a Windows, paso a paso.',
  themeColor: '#10B981',
  secondaryColor: '#14B8A6',
  badge: 'ARQUITECTURA DE ARRANQUE & DIAGNÓSTICO',
  edition: 'Edición Maestra de Taller & Firmware 2026',
  totalPages: 16,
  manifestoPhrase: 'UNA COMPUTADORA NO ARRANCA POR MAGIA: CADA MILISEGUNDO RESPONDE A UNA CADENA INQUEBRANTABLE DE CONDICIONES ELÉCTRICAS Y LÓGICAS.',
  description: 'Tratado técnico y visual sobre el proceso de arranque de una PC moderna. Explora cada microsegundo desde la presión del pulsador de encendido, las señales de control de la fuente ATX, el despertar del CPU, el POST, el entrenamiento de RAM, la inicialización PCIe/GOP, el hand-off UEFI, winload.efi, el kernel NT y los subsistemas de Windows.',
};

export const TOMO_08_MODULES: Tomo08ModuleItem[] = [
  {
    id: 't08-m01',
    moduleNumber: 'M01',
    title: 'Standby, +5VSB & Circuito de Encendido',
    subtitle: 'El estado de reposo activo y la detección del pulso de panel frontal',
    categoryTag: 'ELECTRÓNICA DE ESPERA',
    readTime: '6 min',
    summary: 'Antes de tocar el botón de power, la fuente entrega permanentemente +5VSB (cable violeta, pin 9 de ATX 24p). Este voltaje alimenta al circuito RTC, al Super I/O (SIO) / EC y los pulsadores del panel frontal. Al presionar el botón se genera una caída a masa momentánea que el SIO detecta para iniciar la secuencia.',
    keySignals: ['+5VSB (Standby)', 'PWR_SW# (Front Panel)', 'SIO_PWRBTN#'],
    componentsInvolved: ['Fuente ATX (Conversor Flyback)', 'Super I/O / EC', 'Header Frontal F_PANEL'],
    workshopVerification: {
      instrument: 'Multímetro Digital en escala 20V DC',
      measurement: 'Pin 9 del conector ATX 24p (cable violeta) respecto a chasis (GND).',
      expectedValue: '+5.0V a +5.2V DC continuo con la fuente conectada a 220V/110V.',
      anomalyIndicator: '0V o voltaje fluctuante (< 4.75V) indica condensador de standby seco o flyback abierto en la PSU.',
    },
    commonFailures: [
      'PC no enciende absolutamente nada: LED de placa apagado, sin reacción a botón ni puente directo.',
      'Riel +5VSB con rizado excesivo que cuelga la lógica interna del Super I/O.',
      'Pulsador físico del gabinete con resistencia óhmica alta o sulfato.',
    ],
    decisionRule: 'Si no hay +5VSB en pin 9, no cambies la placa madre ni la memoria: el problema está en la fuente o en un corto severo en la línea de espera.',
    safetyLevel: 'TÉCNICO',
    labStepTarget: 1,
  },
  {
    id: 't08-m02',
    moduleNumber: 'M02',
    title: 'Arranque de PSU, PS_ON# & Rieles Principales',
    subtitle: 'Negociación entre la motherboard y la fuente para despertar los rieles de potencia',
    categoryTag: 'POTENCIA & ENERGÍA',
    readTime: '7 min',
    summary: 'El Super I/O pone a nivel bajo la señal PS_ON# (cable verde, pin 16 de ATX). Esto comanda a la fuente a encender sus osciladores principales y liberar los rieles de +12V, +5V y +3.3V. Una vez que las tensiones se estabilizan, la fuente emite la señal PWR_OK (Power Good, pin 8 gris) con un valor alto (+5V).',
    keySignals: ['PS_ON# (Pin 16 Verde, Low Active)', 'PWR_OK / Power Good (Pin 8 Gris, High Active)', '+12V / +5V / +3.3V'],
    componentsInvolved: ['Fuente ATX', 'Super I/O', 'VRM de Motherboard', 'Conector ATX 24p & EPS 12V'],
    workshopVerification: {
      instrument: 'Multímetro Digital / Tester ATX con pantalla de tiempo PG',
      measurement: 'Pin 16 (PS_ON#) al pulsar power; luego Pin 8 (PWR_OK) y tiempo de retardo en ms.',
      expectedValue: 'PS_ON# cae de ~3.3V/5V a < 0.8V. PWR_OK sube a +5V entre 100ms y 500ms tras encendido.',
      anomalyIndicator: 'Ventiladores giran medio segundo y se apagan (disparo de protección OCP/SCP por cortocircuito en MOSFETs de 12V).',
    },
    commonFailures: [
      'MOSFET de línea alta (high-side) en corto en el VRM de CPU: la fuente detecta sobrecorriente instantánea y corta rieles.',
      'PWR_OK nunca sube a +5V: los ventiladores giran continuamente pero la placa queda estancada sin dar señal de reset.',
    ],
    decisionRule: 'Un tester de fuente que muestra "PG 0ms" o "PG > 500ms" revela una fuente defectuosa que dañará la motherboard si se mantiene conectada.',
    safetyLevel: 'TÉCNICO',
    labStepTarget: 3,
  },
  {
    id: 't08-m03',
    moduleNumber: 'M03',
    title: 'Despertar del CPU, Vector de Reset & Lectura SPI',
    subtitle: 'La liberación del reset del procesador y las primeras instrucciones del firmware',
    categoryTag: 'MICROARQUITECTURA & FIRMWARE',
    readTime: '8 min',
    summary: 'Una vez recibido PWR_OK, el generador de reloj y el chipset desasertan el pin CPU_RESET# (pasa de 0V a nivel alto). El CPU salta a su vector de reset fijo en la arquitectura x86: dirección física 0xFFFFFFF0 (16 bytes antes de los 4GB de memoria mapeada). Allí encuentra una instrucción de salto directo a la memoria flash SPI donde reside el UEFI.',
    keySignals: ['CPU_RESET# / PLTRST#', 'BCLK (100 MHz Base Clock)', 'SPI Bus (CS#, CLK, MISO, MOSI)'],
    componentsInvolved: ['CPU (Core 0 / BSP)', 'Chipset / PCH', 'Chip Flash BIOS/UEFI SPI de 8 pines'],
    workshopVerification: {
      instrument: 'Osciloscopio / Analizador Lógico en pin CS# (Chip Select) del chip SPI',
      measurement: 'Verificar si el pin 1 (CS#) oscila a nivel bajo durante los primeros 50 ms del encendido.',
      expectedValue: 'Ráfaga de pulsos digitales de lectura continua a frecuencia de 25 a 50 MHz.',
      anomalyIndicator: 'Línea CS# en nivel alto continuo (+3.3V estático) indica que el CPU nunca se desresetó o el PCH no liberó el bus.',
    },
    commonFailures: [
      'BIOS SPI corrupta por flasheo interrumpido o caída de tensión: el CPU busca el vector pero lee datos basura (0x00 o 0xFF).',
      'Pin doblado en el socket LGA (líneas DMI o clocks de CPU): el CPU no sale de su estado de reset.',
    ],
    decisionRule: 'Si el CPU permanece completamente tibio o frío y los ventiladores giran al 100%, verificá la presencia de CPU_RESET# y la actividad en el bus SPI.',
    safetyLevel: 'BANCO',
    labStepTarget: 6,
  },
  {
    id: 't08-m04',
    moduleNumber: 'M04',
    title: 'Secuencia POST & Diagnóstico por Q-LED / Debug',
    subtitle: 'El escaneo secuencial de subsistemas críticos mediante el código de arranque',
    categoryTag: 'DIAGNÓSTICO & POST',
    readTime: '6 min',
    summary: 'El código SEC/PEI del UEFI ejecuta el POST (Power-On Self-Test). Las motherboards modernas cuentan con 4 LEDs de depuración secuenciales (CPU -> DRAM -> VGA -> BOOT). Si la placa se congela en un LED, significa que falló la prueba eléctrica o lógica del subsistema correspondiente antes de pasar al siguiente.',
    keySignals: ['LPC Bus / I2C Debug Port', 'Port 80h Hex Codes', 'Q-LED Status Lines'],
    componentsInvolved: ['Microcódigo UEFI (Fase SEC/PEI)', 'Display Debug Port 80h', 'Panel Q-LEDs'],
    workshopVerification: {
      instrument: 'Placa post / Tarjeta analizadora PCI-e / Lectura de 4 Q-LEDs integrados',
      measurement: 'Observar la secuencia visual de transición de los LEDs en el orden estricto de la arquitectura.',
      expectedValue: 'Encendido y apagado progresivo: Rojo (CPU) -> Ámbar (DRAM) -> Blanco (VGA) -> Verde (BOOT).',
      anomalyIndicator: 'Q-LED rojo clavado fijo: fallo de CPU o socket. Q-LED ámbar fijo: fallo de entrenamiento de memoria.',
    },
    commonFailures: [
      'Microcódigo ausente para la generación de CPU instalada (motherboard necesita actualización de BIOS flashback).',
      'Memoria RAM sucia en los contactos dorados o ranura con pelusa que interrumpe líneas de dirección.',
    ],
    decisionRule: 'Nunca asumas que "la placa no da video" es culpa de la GPU si el Q-LED de DRAM está encendido: la GPU ni siquiera ha sido encuestada.',
    safetyLevel: 'USUARIO',
    labStepTarget: 7,
  },
  {
    id: 't08-m05',
    moduleNumber: 'M05',
    title: 'Entrenamiento de Memoria RAM & Memory Reference Code',
    subtitle: 'El algoritmo MRC que calibra las fases de señal a nivel de picosegundos',
    categoryTag: 'MEMORIA & CONTROLADOR',
    readTime: '8 min',
    summary: 'El IMC (Integrated Memory Controller) dentro del procesador ejecuta el MRC (Memory Reference Code). Lee el chip EEPROM SPD de cada módulo por el bus SMBus/I2C, determina los perfiles JEDEC o XMP/EXPO, y realiza un ciclo de calibración eléctrica (Memory Training). Durante esta etapa, ajusta impedancias On-Die Termination (ODT), latencias CAS y retardos de trazas (trace length matching).',
    keySignals: ['SMBus (SCL / SDA)', 'Memory Clock (Differential CK/CK#)', 'DQ / DQS Data Strobe', 'VREF / VDDQ'],
    componentsInvolved: ['IMC (CPU)', 'Módulos DIMM DDR4/DDR5', 'Chip SPD EEPROM', 'Slots de Memoria'],
    workshopVerification: {
      instrument: 'Buzzer piezoeléctrico / Tarjeta Port 80h (Códigos 50h a 5Fh)',
      measurement: 'Verificar si tras encender el equipo ocurren 1 o 2 reinicios controlados de calibración.',
      expectedValue: 'Reinicio breve tras cambiar RAM (entrenamiento exitoso) y avance inmediato al código de VGA.',
      anomalyIndicator: 'Ciclo infinito de 3 pitidos largos o reinicio cada 15 segundos sin llegar a dar señal de video.',
    },
    commonFailures: [
      'Módulos instalados en slots incorrectos (por ejemplo A1/B1 en lugar de los prioritarios A2/B2 en topología Daisy Chain).',
      'Perfil XMP demasiado agresivo para la calidad del silicio del IMC del procesador.',
      'Voltaje VDDQ o VDDIO insuficiente bajo perfiles de alta frecuencia.',
    ],
    decisionRule: 'En casi todas las placas modernas Daisy Chain, instalar dos módulos en los slots 1 y 3 (A1/B1) causa reflexiones de señal fatales que impiden arrancar a más de 2133/4800 MHz.',
    safetyLevel: 'TÉCNICO',
    labStepTarget: 8,
  },
  {
    id: 't08-m06',
    moduleNumber: 'M06',
    title: 'Inicialización de Video, PCIe & GOP / VBIOS',
    subtitle: 'El handshake entre el bus PCI Express, el firmware gráfico y la salida de pantalla',
    categoryTag: 'GRÁFICOS & ENLACE PCIE',
    readTime: '7 min',
    summary: 'El firmware UEFI inicializa el subsistema PCIe. Numera los dispositivos y busca el adaptador gráfico primario (PEG - PCI Express Graphics o iGPU integrada). Al encontrar la GPU dedicada, carga el UEFI GOP (Graphics Output Protocol) o la ROM heredada VBIOS. En este instante exacto, la pantalla recibe la señal de sincronismo y muestra el primer cuadro de video: el logotipo del fabricante.',
    keySignals: ['PCIe Reference Clock (100 MHz HCSL)', 'PERST# (PCIe Reset)', 'Hot-Plug Detect (HPD)', 'DDC / EDID (Display Channel)'],
    componentsInvolved: ['Placa de Video (GPU)', 'Ranura PCIe x16', 'Monitor / Pantalla', 'Cable HDMI / DisplayPort'],
    workshopVerification: {
      instrument: 'Monitor de taller con indicador OSD de resolución y frecuencia',
      measurement: 'Conectar cable DisplayPort o HDMI directamente a la GPU dedicada y observar el LED del monitor.',
      expectedValue: 'El LED del monitor pasa de naranja (espera) a azul/blanco fijo y se sincroniza a 1024x768 o resolución nativa con logo.',
      anomalyIndicator: 'El monitor muestra "Sin Señal", o el Q-LED blanco de VGA queda encendido fijo tras apagarse el de DRAM.',
    },
    commonFailures: [
      'Cable de video enchufado erróneamente en los puertos de la motherboard cuando el CPU carece de gráficos integrados (ej: Intel serie F o Ryzen no-G antiguos).',
      'Conector PCIe auxiliar de 8 pines de la fuente flojo o sin alimentar la GPU.',
      'Monitor apagado o cable DisplayPort con pin 20 de alimentación en corto que causa retorno de 3.3V.',
    ],
    decisionRule: 'Si el teclado ya responde al bloqueo de mayúsculas (Bloq Mayús enciende su LED), el equipo YA ARTIÓ correctamente; el fallo es exclusivamente de la salida o cable de video.',
    safetyLevel: 'USUARIO',
    labStepTarget: 9,
  },
  {
    id: 't08-m07',
    moduleNumber: 'M07',
    title: 'Hand-off UEFI, Búsqueda de Disco & Partición ESP',
    subtitle: 'La transición desde el entorno de firmware hacia los medios de almacenamiento persistente',
    categoryTag: 'ALMACENAMIENTO & UEFI BOOT',
    readTime: '7 min',
    summary: 'El subsistema BDS (Boot Device Selection) del UEFI interroga a los controladores NVMe (PCIe) y SATA (AHCI). Lee la tabla de particiones GPT (GUID Partition Table) del disco prioritario definido en la NVRAM y busca la partición ESP (EFI System Partition, formateada en FAT32). En dicha partición localiza el binario ejecutable predeterminado: \\EFI\\Microsoft\\Boot\\bootmgfw.efi.',
    keySignals: ['NVMe PCIe Lanes / SATA D2H FIS', 'GPT Header Signature (EFI PART)', 'FAT32 Directory Table'],
    componentsInvolved: ['Unidad SSD NVMe M.2 / SATA', 'Partición ESP (100MB FAT32)', 'Variables NVRAM de UEFI'],
    workshopVerification: {
      instrument: 'Shell UEFI integrada / Visor de Boot Menu (F8 / F11 / F12)',
      measurement: 'Comprobar si el menú de arranque lista la entrada formal "Windows Boot Manager".',
      expectedValue: 'Aparición clara de la entrada con el UUID del disco correcto, sin tener que forzar modo Legacy/CSM.',
      anomalyIndicator: 'El equipo entra directamente a la BIOS en cada encendido o arroja "Reboot and Select proper Boot device".',
    },
    commonFailures: [
      'Partición ESP dañada o eliminada por una instalación errónea o formateo accidental.',
      'Modo CSM (Compatibility Support Module) activado en un disco que fue particionado en modo puro GPT UEFI.',
      'SSD M.2 con recalentamiento o falla en su chip controlador Phison/Silicon Motion que no inicializa el bus PCIe.',
    ],
    decisionRule: 'Si la BIOS entra sola y no ve ningún disco, no intentes reparar Windows: primero asegurate de que la unidad de almacenamiento aparezca en la lista física de hardware en la pestaña NVMe/SATA.',
    safetyLevel: 'TÉCNICO',
    labStepTarget: 10,
  },
  {
    id: 't08-m08',
    moduleNumber: 'M08',
    title: 'Bootloader Winload, BCD & Verificación Secure Boot',
    subtitle: 'El administrador de arranque de Windows y la validación criptográfica de firmas',
    categoryTag: 'BOOTLOADER & CRIPTOGRAFÍA',
    readTime: '8 min',
    summary: 'El Windows Boot Manager (bootmgfw.efi) lee el archivo BCD (Boot Configuration Data). Si Secure Boot está activo, valida la firma criptográfica digital del siguiente componente: winload.efi (ubicado en \\Windows\\System32). Winload activa el modo protegido/largo de 64 bits, habilita la paginación de memoria y lee el registro SYSTEM.',
    keySignals: ['TPM 2.0 PCR Registers (Medición de Integridad)', 'Certificados Secure Boot (DB / KEK / PK)', 'BCD Hive Entries'],
    componentsInvolved: ['Windows Boot Manager', 'winload.efi', 'Chip TPM 2.0 (fTPM / dTPM)', 'Hive BCD'],
    workshopVerification: {
      instrument: 'Herramienta de consola de recuperación `bcdedit /enum`',
      measurement: 'Verificar la ruta `device partition=\\Device\\HarddiskVolumeX` y `path \\windows\\system32\\winload.efi`.',
      expectedValue: 'Rutas canónicas completas con firmas digitales válidas emitidas por Microsoft Windows Production PCA.',
      anomalyIndicator: 'Pantalla azul de recuperación con código de error 0xc000000e, 0xc0000098 o 0xc0000428 (firma inválida).',
    },
    commonFailures: [
      'Corrupción del BCD tras una clonación de disco donde cambiaron los identificadores GUID de las particiones.',
      'Infección o manipulación por un Bootkit que intentó modificar winload.efi y fue bloqueado por Secure Boot.',
      'Clave BitLocker solicitada inesperadamente porque cambió la firma del firmware o se alteró el orden de booteo.',
    ],
    decisionRule: 'El error 0xc000000e casi siempre se resuelve reconstruyendo el BCD con `bootrec /rebuildbcd` o `bcdboot C:\\Windows /s S: /f UEFI`, sin necesidad de reinstalar Windows.',
    safetyLevel: 'TÉCNICO',
    labStepTarget: 10,
  },
  {
    id: 't08-m09',
    moduleNumber: 'M09',
    title: 'Carga del Kernel NT, HAL & Drivers Boot-Start',
    subtitle: 'El nacimiento del sistema operativo y la transición desde UEFI hacia el núcleo de Windows',
    categoryTag: 'KERNEL NT & SUBSISTEMAS',
    readTime: '9 min',
    summary: 'Winload carga en memoria el ejecutable del kernel (ntoskrnl.exe) y la HAL (Hardware Abstraction Layer - hal.dll). También carga todos los controladores con etiqueta BOOT_START (SYSTEM\\CurrentControlSet\\Services con Start=0), indispensables para acceder al disco del sistema. Finalmente ejecuta `ExitBootServices()`, cerrando el control del firmware UEFI y transfiriendo el control total al Kernel NT.',
    keySignals: ['ExitBootServices() Hand-off', 'HAL Dispatch Table', 'ELAM (Early Launch Anti-Malware) Driver'],
    componentsInvolved: ['ntoskrnl.exe', 'hal.dll', 'Controladores de Disco (iaStorAC, nvme.sys, storahci)', 'Memoria RAM'],
    workshopVerification: {
      instrument: 'Visor de eventos de arranque en modo seguro / Log de arranque `ntbtlog.txt`',
      measurement: 'Revisar la secuencia de carga de controladores en `%SystemRoot%\\ntbtlog.txt`.',
      expectedValue: 'Carga exitosa y ordenada de BOOT_START drivers seguida de la inicialización de Phase 0 y Phase 1 del Kernel.',
      anomalyIndicator: 'BSOD instantánea INACCESSIBLE_BOOT_DEVICE (0x0000007B) durante el giro de los puntos de carga.',
    },
    commonFailures: [
      'Falta del driver del controlador de almacenamiento (ejemplo: cambiar de modo AHCI a RAID/Intel VMD en la BIOS sin instalar el driver previo).',
      'Controlador defectuoso de antivirus de terceros o software antitrampas (EasyAntiCheat/Vanguard) corrupto en el arranque.',
      'RAM con errores intermitentes: se corrompen estructuras de páginas durante la inicialización de Phase 1 provocando KERNEL_SECURITY_CHECK_FAILURE.',
    ],
    decisionRule: 'Un pantallazo azul con los circulitos girando de Windows significa que el hardware, la fuente, el POST, la BIOS y el disco funcionan al 100%; el fallo es puramente de controladores o registro de Windows.',
    safetyLevel: 'BANCO',
    labStepTarget: 10,
  },
  {
    id: 't08-m10',
    moduleNumber: 'M10',
    title: 'Inicialización de Subsistemas, SMSS, Winlogon & Sesión',
    subtitle: 'Desde el primer proceso de usuario hasta la pantalla de bienvenida y el escritorio Explorer',
    categoryTag: 'SISTEMA & SESIÓN DE USUARIO',
    readTime: '8 min',
    summary: 'El kernel lanza el primer proceso en modo usuario: smss.exe (Session Manager Subsystem). Este inicia el registro en modo lectura/escritura, carga los subsistemas Win32 (csrss.exe) y de gráficos (win32k.sys), y lanza winlogon.exe. Winlogon a su vez inicia LogonUI.exe para solicitar credenciales de usuario. Tras la autenticación, se invoca a userinit.exe que finalmente levanta explorer.exe, renderizando el escritorio.',
    keySignals: ['LPC / ALPC Message Ports', 'SAM / LSASS Authentication Pipes', 'Explorer Shell Startup Hook'],
    componentsInvolved: ['smss.exe', 'csrss.exe', 'winlogon.exe', 'lsass.exe', 'explorer.exe (Shell)'],
    workshopVerification: {
      instrument: 'Administrador de Tareas / Sysinternals Process Explorer en sesión activa',
      measurement: 'Verificar la jerarquía estricta de procesos huérfanos y de sesión.',
      expectedValue: 'smss.exe crea las sesiones 0 (servicios) y 1 (usuario interactivo) y permanece pasivo. explorer.exe corre con privilegios de usuario.',
      anomalyIndicator: 'Pantalla negra con cursor móvil pero sin barra de tareas ni iconos (explorer.exe congelado o clave Shell manipulada).',
    },
    commonFailures: [
      'Clave de registro `HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\Shell` cambiada o apuntando a malware.',
      'Servicio de terceros corrupto que bloquea el inicio de sesión causando un bucle infinito en "Espere por favor...".',
      'Perfil de usuario corrupto que obliga a Windows a crear un perfil temporal.',
    ],
    decisionRule: 'Si tenés cursor en pantalla negra, pulsá CTRL+SHIFT+ESC: si abre el Administrador de Tareas, el sistema está vivo. Solo tenés que ir a Archivo -> Ejecutar nueva tarea -> escribir `explorer.exe` y presionar Enter.',
    safetyLevel: 'USUARIO',
    labStepTarget: 10,
  },
];

export const WORKSHOP_BOOT_CASES: BootDiagnosticCase[] = [
  {
    id: 'case-boot-01',
    title: 'PC completamente inerte tras tormenta eléctrica',
    equipment: 'Gabinete ATX, Fuente 650W 80 Plus Bronze, Motherboard B550',
    symptom: 'Al pulsar el botón de encendido no hay luces, no hay ventiladores, nada hace ruido.',
    diagnosticStage: 'M01 / Standby (+5VSB)',
    measuredData: 'Multímetro en Pin 9 conector ATX: 0.0V. Tensión en toma de pared: 228V AC.',
    discardedHypothesis: 'Se creía que el botón del gabinete o la placa madre estaban quemados.',
    rootCause: 'El varistor y el fusible interno del circuito primario de la fuente se abrieron por un pico transitorio, cortando el transformador auxiliar de standby.',
    fixAction: 'Reemplazo de la fuente ATX de taller. La placa madre y el procesador sobrevivieron intactos gracias al aislamiento del fusible de entrada.',
    labStepTarget: 1,
  },
  {
    id: 'case-boot-02',
    title: 'Giro de medio segundo y corte con clic seco',
    equipment: 'Intel Core i7-13700K, Motherboard Z790, Fuente 850W Gold',
    symptom: 'Los ventiladores amagan a arrancar durante 300 ms, se escucha un "clic" en la fuente y todo se apaga de inmediato.',
    diagnosticStage: 'M02 / Rieles Principales & Protección OCP',
    measuredData: 'Medición de resistencia en conector EPS 12V de CPU con multímetro desenergizado: 0.4 Ohms (Corto Franco a Tierra).',
    discardedHypothesis: 'Se sospechaba de fuente defectuosa o pulsador de power trabado.',
    rootCause: 'Uno de los MOSFETs DrMOS de la fase superior del VRM de CPU sufrió una perforación en el silicio, uniendo la línea de +12V directamente con masa.',
    fixAction: 'Aislamiento de la placa en banco, desoldado del módulo DrMOS defectuoso mediante estación de aire caliente y reemplazo por componente nuevo.',
    labStepTarget: 3,
  },
  {
    id: 'case-boot-03',
    title: 'Bucle infinito con Q-LED ámbar en DRAM tras limpieza de PC',
    equipment: 'AMD Ryzen 5 5600X, 2x8GB DDR4 3200MHz, Motherboard B450',
    symptom: 'La PC enciende todos sus ventiladores y RGB pero nunca muestra imagen. Se reinicia sola cada 20 segundos con el Q-LED ámbar encendido.',
    diagnosticStage: 'M05 / Entrenamiento de Memoria RAM',
    measuredData: 'Tensión VDDQ en pin de slot de memoria: 1.20V correcta. Sin embargo, los módulos estaban colocados en las ranuras 1 y 3 (A1/B1).',
    discardedHypothesis: 'Se temía que los módulos de RAM se hubieran dañado por electricidad estática durante la limpieza.',
    rootCause: 'En topologías Daisy-Chain, los slots prioritarios son los extremos (2 y 4 / A2/B2). El instalador colocó las memorias en A1/B1, dejando los terminales vacíos actuando como antenas de reflexión de señal de alta frecuencia.',
    fixAction: 'Cambio de los módulos a los zócalos 2 y 4 (A2 y B2). El equipo entrenó la memoria en el primer arranque y cargó Windows con su perfil XMP a 3200MHz.',
    labStepTarget: 8,
  },
  {
    id: 'case-boot-04',
    title: 'Pantalla negra luego del logo de la BIOS con cursor estático',
    equipment: 'Kingston NV2 1TB NVMe PCIe 4.0, Windows 11 Pro 64-bit',
    symptom: 'El logo del fabricante aparece, pero cuando debería girar el círculo de Windows, la pantalla queda negra sin actividad en disco.',
    diagnosticStage: 'M08 / Bootloader & BCD',
    measuredData: 'En consola de rescate `diskpart`: partición ESP montada pero con el archivo BCD con tamaño 0 KB (archivo truncado por apagado forzado).',
    discardedHypothesis: 'Se sospechaba de fallo en el chip NAND flash del disco SSD.',
    rootCause: 'Corte de luz durante una actualización de Windows que dejó corrupto el almacén BCD en la partición oculta de sistema EFI.',
    fixAction: 'Ejecución del comando `bcdboot C:\\Windows /s S: /f UEFI` desde el pendrive de instalación de Windows. Restauró el bootloader en 10 segundos sin perder datos.',
    labStepTarget: 10,
  },
];
