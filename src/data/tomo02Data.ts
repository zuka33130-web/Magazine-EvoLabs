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
  { id: 'm01', moduleNumber: '01', title: 'WINDOWS NO ES EL ESCRITORIO', subtitle: 'Entendiendo la jerarquía: Usuario, App, Windows, Kernel, Driver, Hardware', categoryTag: 'ARQUITECTURA', readTime: '5 min', summary: 'El mapa mental del sistema operativo.', keyTakeaways: ['Windows como abstracción.', 'Capa de usuario vs Capa Kernel.'], },
  { id: 'm02', moduleNumber: '02', title: 'PROCESOS, HILOS Y SERVICIOS', subtitle: '¿Qué ejecuta realmente Windows?', categoryTag: 'PROCESOS', readTime: '6 min', summary: 'Diferencias críticas.', keyTakeaways: ['Proceso: Contenedor.', 'Thread: Ejecutor.', 'Servicio: Procesos en segundo plano.'], },
  { id: 'm03', moduleNumber: '03', title: 'MEMORIA', subtitle: 'RAM, virtual, commit y paginación', categoryTag: 'MEMORIA', readTime: '8 min', summary: 'Gestión de recursos.', keyTakeaways: ['RAM libre es RAM desperdiciada.', 'Commit Charge es el límite real.'], },
  { id: 'm04', moduleNumber: '04', title: 'ARRANQUE Y AUTOARRANQUE', subtitle: '¿Qué ocurre al iniciar Windows?', categoryTag: 'BOOT', readTime: '7 min', summary: 'Cadenas de inicio.', keyTakeaways: ['Fuentes de autoarranque.', 'Servicios, Tareas, Apps.'], },
  { id: 'm05', moduleNumber: '05', title: 'DRIVERS Y KERNEL', subtitle: 'Hardware ↔ Windows', categoryTag: 'DRIVERS', readTime: '9 min', summary: 'Interfaz crítica.', keyTakeaways: ['Drivers como puente.', 'Modo Kernel vs Usuario.'], },
  { id: 'm06', moduleNumber: '06', title: 'SCHEDULER', subtitle: 'Repartición de tiempo CPU', categoryTag: 'SCHEDULER', readTime: '8 min', summary: 'Planificación de procesos.', keyTakeaways: ['Context switch.', 'Prioridades.'], },
  { id: 'm07', moduleNumber: '07', title: 'INTERRUPCIONES', subtitle: 'ISR y DPC', categoryTag: 'KERNEL', readTime: '10 min', summary: 'Comunicación de bajo nivel.', keyTakeaways: ['ISR es respuesta inmediata.', 'DPC es trabajo diferido.'], },
  { id: 'm08', moduleNumber: '08', title: 'SEGUNDO PLANO', subtitle: '¿Qué hace Windows cuando no mirás?', categoryTag: 'ACTIVIDAD', readTime: '7 min', summary: 'Telemetría y mantenimiento.', keyTakeaways: ['Update, Defender.', 'Indexación.'], },
  { id: 'm09', moduleNumber: '09', title: 'REGISTRO Y CONFIG', subtitle: 'La base de datos central', categoryTag: 'REGISTRO', readTime: '12 min', summary: 'Configuración.', keyTakeaways: ['Hives.', 'Riesgos de modificación.'], },
  { id: 'm10', moduleNumber: '10', title: 'MEDIR ANTES DE TOCAR', subtitle: 'Diagnóstico metódico', categoryTag: 'DIAGNÓSTICO', readTime: '6 min', summary: 'Metrología.', keyTakeaways: ['Administrador de Tareas.', 'Monitor de Recursos.'], },
  { id: 'm11', moduleNumber: '11', title: '¿POR QUÉ LENTO?', subtitle: 'Diagnóstico de cuellos de botella', categoryTag: 'RENDIMIENTO', readTime: '8 min', summary: 'Síntomas.', keyTakeaways: ['CPU, RAM, Disco, Drivers.'], },
  { id: 'm12', moduleNumber: '12', title: 'DIAGNÓSTICO METÓDICO', subtitle: 'La metodología EVO', categoryTag: 'MÉTODO', readTime: '5 min', summary: 'Flujo de trabajo.', keyTakeaways: ['Síntoma->Hipótesis->Medición.'], },
  { id: 'm13', moduleNumber: '13', title: 'FORMATEAR/REINSTALAR', subtitle: 'Guía práctica completa', categoryTag: 'REINSTALACIÓN', readTime: '15 min', summary: 'La opción extrema.', keyTakeaways: ['Backup.', 'Instalación limpia.'], },
  { id: 'm14', moduleNumber: '14', title: 'CMD DESDE CERO', subtitle: 'Consola técnica', categoryTag: 'CMD', readTime: '10 min', summary: 'Automatización.', keyTakeaways: ['Comandos básicos.', 'Diagnóstico de red.'], },
  { id: 'm15', moduleNumber: '15', title: 'POWERSHELL', subtitle: 'Automatización avanzada', categoryTag: 'POWERSHELL', readTime: '12 min', summary: 'PowerShell técnico.', keyTakeaways: ['Pipeline.', 'Get-Command.'], },
  { id: 'm16', moduleNumber: '16', title: 'REGEDIT TÉCNICO', subtitle: 'Modificación segura', categoryTag: 'REGISTRO', readTime: '10 min', summary: 'Editor del registro.', keyTakeaways: ['Keys, Values.', 'Backup obligatorios.'], },
  { id: 'm17', moduleNumber: '17', title: 'ADMIN TAREAS', subtitle: 'Interpretación de datos', categoryTag: 'HERRAMIENTAS', readTime: '7 min', summary: 'Administración.', keyTakeaways: ['CPU, RAM, DISCO.'], },
  { id: 'm18', moduleNumber: '18', title: 'SERVICES.MSC', subtitle: 'Gestión de servicios', categoryTag: 'HERRAMIENTAS', readTime: '8 min', summary: 'Servicios.', keyTakeaways: ['Tipos de arranque.', 'Dependencias.'], },
  { id: 'm19', moduleNumber: '19', title: 'MSCONFIG/ARRANQUE', subtitle: 'Inicio controlado', categoryTag: 'HERRAMIENTAS', readTime: '6 min', summary: 'Inicio.', keyTakeaways: ['Modo seguro.', 'Inicio selectivo.'], },
  { id: 'm20', moduleNumber: '20', title: 'ADM DISCOS', subtitle: 'Particiones y volúmenes', categoryTag: 'ALMACENAMIENTO', readTime: '9 min', summary: 'Gestión de discos.', keyTakeaways: ['GPT, NTFS.', 'Particiones.'], },
  { id: 'm21', moduleNumber: '21', title: 'DISKPART', subtitle: 'Gestión avanzada', categoryTag: 'ALMACENAMIENTO', readTime: '10 min', summary: 'Comandos de disco.', keyTakeaways: ['Advertencia destructiva.', 'Uso técnico.'], },
  { id: 'm22', moduleNumber: '22', title: 'REPARACIÓN SISTEMA', subtitle: 'SFC/DISM/CHKDSK', categoryTag: 'REPARACIÓN', readTime: '8 min', summary: 'Reparación.', keyTakeaways: ['SFC, DISM, CHKDSK.'], },
  { id: 'm23', moduleNumber: '23', title: 'VISOR EVENTOS', subtitle: 'Auditoría crítica', categoryTag: 'DIAGNÓSTICO', readTime: '11 min', summary: 'Eventos.', keyTakeaways: ['Logs.', 'Event ID.'], },
  { id: 'm24', moduleNumber: '24', title: 'PROGRAMADOR TAREAS', subtitle: 'Automatización', categoryTag: 'AUTOMATIZACIÓN', readTime: '8 min', summary: 'Tareas.', keyTakeaways: ['Disparadores.'], },
  { id: 'm25', moduleNumber: '25', title: 'INICIO AUTOMÁTICO', subtitle: 'Fuentes de inicio', categoryTag: 'INICIO', readTime: '7 min', summary: 'Inicio.', keyTakeaways: ['DNA de Windows.'], },
  { id: 'm26', moduleNumber: '26', title: 'RED WINDOWS', subtitle: 'Diagnóstico práctico', categoryTag: 'REDES', readTime: '9 min', summary: 'Conectividad.', keyTakeaways: ['Ping, tracert.'], },
  { id: 'm27', moduleNumber: '27', title: 'VARIABLES Y RUTAS', subtitle: 'Dónde está todo', categoryTag: 'CONFIG', readTime: '6 min', summary: 'Rutas.', keyTakeaways: ['%TEMP%, %APPDATA%.'], },
  { id: 'm28', moduleNumber: '28', title: 'PERMISOS Y ACLs', subtitle: 'Seguridad básica', categoryTag: 'SEGURIDAD', readTime: '10 min', summary: 'Permisos.', keyTakeaways: ['Administrador.'], },
  { id: 'm29', moduleNumber: '29', title: 'RECUPERACIÓN', subtitle: 'Modo seguro/WinRE', categoryTag: 'RECUPERACIÓN', readTime: '12 min', summary: 'Rescate.', keyTakeaways: ['Modo seguro.'], },
  { id: 'm30', moduleNumber: '30', title: 'CASOS Y MITOS', subtitle: 'Diagnóstico final', categoryTag: 'CASOS', readTime: '15 min', summary: 'Conclusión.', keyTakeaways: ['Casos reales.', 'Mitos.'], },
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
