// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 15: DRIVERS Y DISPOSITIVOS // EL TRADUCTOR ENTRE WINDOWS Y EL SILICIO

export type RiskLevelSector15 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector15Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector15;
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

export interface Sector15MiniCase {
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

export interface Sector15TestQuestion {
  id: string;
  questionNumber: number;
  category: 'DEVICE_STACK_Y_ARQUITECTURA' | 'IDENTIFICADORES_PNP_Y_INF' | 'CODIGOS_ERROR_DEVICE_MANAGER' | 'HERRAMIENTAS_Y_GESTION_DRIVERS';
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  technicalExplanation: string;
  relatedInvestigationCode: string;
}

export const SECTOR_15_INVESTIGATIONS: Sector15Investigation[] = [
  {
    id: 'sec-15-01',
    code: '15.01',
    title: 'Device Manager',
    subtitle: 'Administrador de dispositivos (devmgmt.msc): la visualización jerárquica del árbol PnP',
    targetMechanism: 'Plug and Play Tree Enumeration / MMC Snap-in',
    targetComponent: 'devmgmt.msc / DevMgr.dll',
    commandName: 'devmgmt.msc / control hdwwiz.cpl',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El Administrador de Dispositivos no es una lista plana de componentes: es una representación gráfica de un grafo jerárquico de nodos de dispositivo (DevNodes) construidos por el kernel de Windows desde el bus raíz ACPI.',
      mythVsTruth: {
        mentira: 'Device Manager solo muestra los componentes de hardware que compraste y conectaste físicamente.',
        verdad: 'Muestra dispositivos físicos, dispositivos lógicos, controladores de bus virtuales, adaptadores de software (como túneles VPN) y dispositivos ocultos desconectados del sistema.',
        comprobalo: 'Abrí devmgmt.msc, menú "Ver" -> "Dispositivos por conexión": verás cómo cada GPU, disco o tarjeta de red cuelga estrictamente de un puente PCI Express conectado al bus ACPI raíz.',
      },
    },
    entende: {
      queEs: 'La consola de administración administrativa principal de Windows para inspeccionar, configurar, actualizar, deshabilitar y diagnosticar el hardware del sistema.',
      paraQueSirve: 'Verificar el estado operativo de cada componente, códigos de error devueltos por el kernel y resolver conflictos de controladores.',
      quePasaSiFalta: 'El diagnóstico de hardware requeriría inspeccionar directamente ramas de claves crudas en el registro del sistema bajo HKLM\\SYSTEM\\CurrentControlSet\\Enum.',
    },
    interactua: {
      cliExample: 'start devmgmt.msc',
      psExample: 'Get-PnpDevice | Where-Object { $_.Status -ne "OK" } | Format-Table -AutoSize',
      syntaxBreakdown: 'Get-PnpDevice consulta el subsistema PnP a través de WMI/CIM, exponiendo Class, FriendlyName, InstanceId y Status.',
      whatToLookFor: 'Íconos de advertencia: triángulo amarillo (código de error activo en el dispositivo), flecha hacia abajo (dispositivo deshabilitado manualmente).',
      technicalMetrics: 'Vista por contenedor (Device Pairing Container): agrupa múltiples funciones de un periférico multifunción bajo un único contenedor de hardware.',
    },
    alertaEVO: {
      reversibilityRule: 'Herramienta de diagnóstico de solo lectura a menos que se apliquen acciones explícitas de desinstalación o cambio de controlador.',
      safetyWarning: 'Deshabilitar dispositivos críticos del sistema como controladores de almacenamiento o bus PCI puede provocar pantallas azules (BSOD) inmediatas.',
    },
    evidenceBadge: {
      code: 'DEV-MGMT',
      label: 'DEVMGMT.MSC / ARBOL PNP',
    },
  },
  {
    id: 'sec-15-02',
    code: '15.02',
    title: 'Hardware ID',
    subtitle: 'Identificadores de hardware: VEN_xxxx, DEV_xxxx, SUBSYS y REV como huella digital del silicio',
    targetMechanism: 'PCI / USB Bus Specification Identification Strings',
    targetComponent: 'PnP Manager Hardware ID Match Engine',
    commandName: 'wmic path Win32_PnPEntity get DeviceID, HardwareID',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows no reconoce tu placa de video por su nombre comercial "RTX 4090", sino por un código hexadecimal inmutable grabado en su silicio: PCI\\VEN_10DE&DEV_2684&SUBSYS_xxxx1043.',
      mythVsTruth: {
        mentira: 'El nombre "NVIDIA GeForce RTX 4090" viene escrito en el chip físico y el sistema operativo lo lee tal cual.',
        verdad: 'El silicio solo entrega IDs de 16 bits: Vendor ID (10DE = NVIDIA) y Device ID (2684 = AD102). El nombre comercial es una simple cadena de texto traducida por el archivo INF del instalador.',
        comprobalo: 'En Device Manager, abrí las propiedades de tu GPU -> Detalles -> "Id. de hardware": verás la cadena canónica PCI\\VEN_xxxx&DEV_xxxx.',
      },
    },
    entende: {
      queEs: 'Una cadena de texto formateada según el estándar del bus (PCI, USB, HID, ACPI) que identifica de manera unívoca al fabricante, modelo de chip, ensamblador y revisión.',
      paraQueSirve: 'Permitir que el motor de instalación de Windows busque en el almacén de controladores (Driver Store) el archivo INF que contenga la coincidencia de hardware más precisa (Rank Match).',
      quePasaSiFalta: 'Windows no sabría qué driver cargar y el componente quedaría paralizado como "Dispositivo desconocido" con Código 28.',
    },
    interactua: {
      cliExample: 'wmic path Win32_PnPEntity where "Name like \'%Display%\'" get DeviceID, HardwareID',
      psExample: '(Get-PnpDevice -Class "Display").HardwareID',
      syntaxBreakdown: 'PCI\\VEN_10DE (Nvidia) &DEV_2684 (AD102 Core) &SUBSYS_16541043 (Subsystem: Asus ROG Strix) &REV_A1 (Revisión de silicio).',
      whatToLookFor: 'Jerarquía de coincidencias: el instalador intenta vincular primero la cadena más larga (con Subsystem y Rev); si no la halla, recurre a la cadena genérica corta (solo VEN y DEV).',
      technicalMetrics: 'Vendor IDs famosos: 8086 = Intel, 10DE = NVIDIA, 1002 = AMD, 10EC = Realtek, 14E4 = Broadcom.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura inmutable de registros de configuración PCI/USB de hardware.',
      safetyWarning: 'Si buscás drivers en Google usando el nombre comercial podés caer en sitios de malware; buscar por el Hardware ID exacto te lleva directo al paquete oficial.',
    },
    evidenceBadge: {
      code: 'HW-ID-CANON',
      label: 'VEN / DEV / SUBSYS',
    },
  },
  {
    id: 'sec-15-03',
    code: '15.03',
    title: 'Compatible ID',
    subtitle: 'Identificadores compatibles: el mecanismo de contingencia para drivers genéricos de clase',
    targetMechanism: 'Generic Class Fallback Matching / PCI Class Codes',
    targetComponent: 'PnP Driver Ranking Engine',
    commandName: 'Get-PnpDeviceProperty -KeyName DEVPKEY_Device_CompatibleIds',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Si conectás un mouse USB nuevo o formateás una PC sin el driver de video oficial, Windows funciona igual gracias a los "Compatible IDs", que cargan drivers genéricos estándar de Microsoft.',
      mythVsTruth: {
        mentira: 'Windows necesita el driver específico de cada fabricante para poder dar imagen en el monitor.',
        verdad: 'Si no encuentra el driver exacto de la GPU, Windows recurre al Compatible ID PCI\\CC_0300 (Clase Display Controller VGA) y carga el Microsoft Basic Display Adapter como red de seguridad.',
        comprobalo: 'Inspeccioná cualquier dispositivo USB genérico en Device Manager -> Detalles -> "Identificadores compatibles": verás cadenas como USB\\Class_03 (Human Interface Device).',
      },
    },
    entende: {
      queEs: 'Una lista secundaria de identificadores que un dispositivo expone para indicar a qué estándares o clases de la industria se ajusta, con menor especificidad que el Hardware ID.',
      paraQueSirve: 'Asegurar que el sistema operativo mantenga funcionalidad básica (pantalla a resolución mínima, mouse, teclado, almacenamiento masivo USB) antes de instalar el controlador optimizado del fabricante.',
      quePasaSiFalta: 'Si un hardware no expone Compatible IDs y no tiene driver específico instalado, queda totalmente inoperativo y el usuario no podría ni siquiera mover el cursor.',
    },
    interactua: {
      cliExample: 'powershell "Get-PnpDeviceProperty -InstanceId (Get-PnpDevice -Class Mouse)[0].InstanceId -KeyName DEVPKEY_Device_CompatibleIds"',
      psExample: 'Get-PnpDevice | Select FriendlyName, CompatibleID -First 5',
      syntaxBreakdown: 'USB\\CLASS_03&SUBCLASS_01 (Clase HID Boot Interface Mouse) permite que el driver de bandeja de entrada mouclass.sys lo controle sin saber el fabricante.',
      whatToLookFor: 'Rango de ranking: un driver matched por Compatible ID tiene un ranking inferior a un driver matched por Hardware ID exacto.',
      technicalMetrics: 'Códigos de clase PCI comunes: CC_0106 = SATA AHCI, CC_0108 = NVMe NVM Express, CC_0200 = Red Ethernet, CC_0300 = Controlador VGA.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de configuración PnP no destructiva.',
      safetyWarning: 'Usar permanentemente una GPU moderna con un driver genérico compatible (Basic Display Adapter) anula la aceleración por hardware 3D, soporte multimonitor y HDR.',
    },
    evidenceBadge: {
      code: 'COMPAT-ID',
      label: 'COMPATIBLE ID FALLBACK',
    },
  },
  {
    id: 'sec-15-04',
    code: '15.04',
    title: 'Instance Path',
    subtitle: 'Device Instance Path: la ruta jerárquica unívoca en el registro HKLM\\SYSTEM\\Enum',
    targetMechanism: 'Device Tree Registry Topology / Device Node Path Persistence',
    targetComponent: 'HKLM\\SYSTEM\\CurrentControlSet\\Enum',
    commandName: 'reg query HKLM\\SYSTEM\\CurrentControlSet\\Enum /s',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Si conectás dos pendrives idénticos de la misma marca y modelo, Windows no los confunde: cada uno recibe un "Device Instance Path" único basado en su número de serie físico o puerto USB.',
      mythVsTruth: {
        mentira: 'Windows asigna las configuraciones de hardware al número de puerto o al modelo del dispositivo.',
        verdad: 'Windows crea una clave única en el registro bajo Enum que combina el Enumerador (ej. USB o PCI), el Hardware ID y el Serial Number/Ubicación física en el bus.',
        comprobalo: 'Copia el "Device Instance Path" de tu placa de red en Device Manager y búscalo con regedit en HKLM\\SYSTEM\\CurrentControlSet\\Enum: verás toda su configuración persistente.',
      },
    },
    entende: {
      queEs: 'Una cadena de texto unívoca a nivel de sistema que define la ubicación exacta y la instancia individual de un hardware dentro del árbol de dispositivos de Windows.',
      paraQueSirve: 'Asociar configuraciones persistentes (como nombres de red, letras de unidad asignadas, parámetros de calibración o políticas de energía) a ese dispositivo específico.',
      quePasaSiFalta: 'Si conectás dos periféricos iguales, Windows mezclaría sus configuraciones y no podría recordar qué calibración pertenece a cada unidad.',
    },
    interactua: {
      cliExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USB" /f "VID_" /k',
      psExample: 'Get-PnpDevice | Select FriendlyName, InstanceId | Format-Table -Wrap',
      syntaxBreakdown: 'Formato: <Enumerador>\\<DeviceID>\\<InstanceSpecificID>. Ejemplo: USB\\VID_046D&PID_C52B\\5&1b3f94a&0&1.',
      whatToLookFor: 'Si el InstanceSpecificID no tiene ampersands (&), suele ser el número de serie de hardware en texto claro provisto por el descriptor del dispositivo.',
      technicalMetrics: 'La clave Enum en el registro está fuertemente protegida por permisos de seguridad del kernel (SYSTEM) y es la base de la auditoría forense USB.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura en el registro.',
      safetyWarning: 'Modificar manualmente claves dentro de Enum con permisos forzados de administrador puede corromper el subsistema PnP y obligar a reparar el sistema.',
    },
    evidenceBadge: {
      code: 'INST-PATH',
      label: 'DEVICE INSTANCE PATH',
    },
  },
  {
    id: 'sec-15-05',
    code: '15.05',
    title: 'Class GUID',
    subtitle: 'GUID de clase de dispositivo: la categorización en HKLM\\SYSTEM\\Control\\Class',
    targetMechanism: 'Device Setup Class / Class Installer Architecture',
    targetComponent: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{GUID}',
    commandName: 'Get-PnpDevice -Class Display / Net / Media',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Todas las tarjetas gráficas del mundo comparten el mismo identificador numérico secreto de 128 bits en Windows: {4d36e968-e325-11ce-bfc1-08002be10318}.',
      mythVsTruth: {
        mentira: 'Windows clasifica los dispositivos por el nombre de la carpeta donde están guardados sus archivos.',
        verdad: 'Windows utiliza identificadores globales únicos (Class GUIDs) estandarizados por Microsoft que definen el instalador de clase, iconos, filtros y propiedades comunes para cada tipo de hardware.',
        comprobalo: 'Ejecutá en PowerShell: Get-PnpDevice | Select-Object -Unique Class, ClassGuid. Verás que todos los adaptadores de red comparten el GUID {4d36e972-e325-11ce-bfc1-08002be10318}.',
      },
    },
    entende: {
      queEs: 'Un identificador GUID estandarizado que agrupa dispositivos que tienen el mismo instalador de clase (Class Installer) y comparten mecanismos de configuración y drivers de filtro.',
      paraQueSirve: 'Permitir al sistema aplicar directivas globales, inyectar filtros de seguridad o audio y definir la interfaz de usuario en el Administrador de Dispositivos.',
      quePasaSiFalta: 'El instalador de drivers no sabría qué asistente de configuración invocar ni qué subclave de registro utilizar para almacenar los ajustes del hardware.',
    },
    interactua: {
      cliExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}"',
      psExample: 'Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}" | Select Class, Provider',
      syntaxBreakdown: 'En esta subclave se encuentran los dispositivos instalados indexados con claves de cuatro dígitos: 0000, 0001, etc., conteniendo sus ajustes de registro.',
      whatToLookFor: 'Valores UpperFilters y LowerFilters en la raíz de la subclave de clase: los filtros aquí registrados se cargan para TODOS los dispositivos de esa clase.',
      technicalMetrics: 'GUIDs canónicos: Display = {4d36e968-...}, Net = {4d36e972-...}, DiskDrive = {4d36e967-...}, Audio = {4d36e96c-...}, Ports = {4d36e978-...}.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura segura.',
      safetyWarning: 'La corrupción de valores UpperFilters/LowerFilters en una clave de clase genera de inmediato el temido Código de Error 19 en todos los dispositivos de ese tipo.',
    },
    evidenceBadge: {
      code: 'CLASS-GUID',
      label: 'CLASS GUID CANON',
    },
  },
  {
    id: 'sec-15-06',
    code: '15.06',
    title: 'INF',
    subtitle: 'El archivo Setup Information (.inf): el plano de arquitectura y directivas de instalación',
    targetMechanism: 'Driver Setup Scripting / Sectional Directive Parser',
    targetComponent: 'setupapi.dev.log / C:\\Windows\\INF',
    commandName: 'pnputil /add-driver driver.inf /install',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Un archivo .INF no es un programa que se ejecuta: es un plano de arquitectura en texto plano estructurado que le dicta a Windows exactamente qué binarios copiar, qué claves crear y cómo registrar el servicio del controlador.',
      mythVsTruth: {
        mentira: 'El archivo .inf es un script o ejecutable que corre código dinámico en la máquina.',
        verdad: 'Es un archivo declarativo de información estructurado en secciones INI ([Version], [Manufacturer], [SourceDisksFiles], [DDInstall.Services]) parseado por SetupAPI.',
        comprobalo: 'Abrí cualquier archivo .inf ubicado en C:\\Windows\\INF con el Bloc de Notas: podrás leer en texto claro cada Hardware ID soportado y las rutas a los archivos .sys correspondientes.',
      },
    },
    entende: {
      queEs: 'El documento central de empaquetado de todo controlador en Windows que especifica los identificadores de hardware compatibles y las instrucciones de despliegue.',
      paraQueSirve: 'Guiar al instalador PnP durante el proceso de matching de drivers y registrar los binarios en el Almacén de Controladores (Driver Store).',
      quePasaSiFalta: 'Aunque tengas los binarios .sys y .dll perfectos en tu carpeta de descargas, sin un archivo .inf Windows no sabrá cómo instalarlos ni a qué hardware vincularlos.',
    },
    interactua: {
      cliExample: 'type C:\\Windows\\INF\\netrtwlanu.inf | more',
      psExample: 'Get-Content C:\\Windows\\INF\\oem*.inf | Select-String -Pattern "PCI\\\\VEN_" | Select-Object -First 5',
      syntaxBreakdown: 'Secciones clave: [Version] define Class y ClassGuid; [Manufacturer] define arquitecturas soportadas (NTamd64); [DDInstall.Services] crea la clave del servicio en el registro.',
      whatToLookFor: 'Los logs de instalación detallados en C:\\Windows\\inf\\setupapi.dev.log registran cada paso y error al parsear directivas del archivo INF.',
      technicalMetrics: 'Drivers DCH modernos: exigen archivos INF declarativos (declarative, componentized, hardware support app) sin instaladores interactivos ni copias de archivos a System32.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible desinstalando el paquete de driver con pnputil.',
      safetyWarning: 'Modificar manualmente el contenido de un archivo INF invalida de inmediato la firma digital del archivo de catálogo (.cat), bloqueando su instalación.',
    },
    evidenceBadge: {
      code: 'INF-PARSER',
      label: 'INF DECLARATIVO',
    },
  },
  {
    id: 'sec-15-07',
    code: '15.07',
    title: 'SYS',
    subtitle: 'El binario ejecutable de kernel (.sys): DriverEntry, rutinas IRP y ejecución en Ring 0',
    targetMechanism: 'Kernel Mode Execution (Ring 0) / Windows Driver Model (WDM/KMDF)',
    targetComponent: 'C:\\Windows\\System32\\drivers\\*.sys',
    commandName: 'sc query type= driver / driverquery /v',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Un archivo .sys no es una aplicación común: corre con los privilegios más absolutos de la CPU en Ring 0. Si un solo puntero de memoria falla dentro de un .sys, Windows se colapsa instantáneamente en un BSOD.',
      mythVsTruth: {
        mentira: 'Windows protege al sistema aislando los drivers para que no puedan congelar la computadora.',
        verdad: 'Los drivers de modo kernel (.sys) comparten el mismo espacio de direcciones virtual que el propio núcleo de Windows (ntoskrnl.exe). Un error de página en un driver produce un choque fatal de kernel.',
        comprobalo: 'Ejecutá "driverquery /v" en CMD: verás la dirección de memoria física y el estado de ejecución de cada binario .sys activo en tu memoria RAM.',
      },
    },
    entende: {
      queEs: 'Un binario ejecutable con formato PE (Portable Executable) compilado para ejecutarse en modo kernel, que contiene las rutinas de bajo nivel para comunicarse directamente con el silicio del hardware.',
      paraQueSirve: 'Manejar interrupciones de hardware (ISR/DPC), leer y escribir en registros I/O mapeados en memoria (MMIO) y procesar paquetes de petición de E/S (IRPs).',
      quePasaSiFalta: 'Sin el archivo .sys, Windows no puede interactuar con el bus ni con el chip, dejando el dispositivo en Código 31 o Código 39.',
    },
    interactua: {
      cliExample: 'driverquery /si | findstr /i "Kernel"',
      psExample: 'Get-WmiObject Win32_SystemDriver | Where-Object { $_.State -eq "Running" } | Select Name, PathName, Started | Format-Table -AutoSize',
      syntaxBreakdown: 'Punto de entrada canónico: DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath). Registra punteros a rutinas de despacho MajorFunction.',
      whatToLookFor: 'Mapeo en C:\\Windows\\System32\\drivers\\. El servicio asociado tiene una clave en HKLM\\SYSTEM\\CurrentControlSet\\Services\\<DriverName> con Type=1 (Kernel Driver).',
      technicalMetrics: 'Latencia DPC (Deferred Procedure Call): un driver mal optimizado puede acaparar la CPU en Ring 0 durante milisegundos, provocando stuttering y cortes de audio en juegos.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de estado de drivers en ejecución.',
      safetyWarning: 'Jamás reemplaces o borres un archivo .sys crítico en System32\\drivers manualmente, ya que podés provocar un bucle de pantalla azul INACCESSIBLE_BOOT_DEVICE.',
    },
    evidenceBadge: {
      code: 'SYS-RING0',
      label: 'SYS MODO KERNEL',
    },
  },
  {
    id: 'sec-15-08',
    code: '15.08',
    title: 'CAT',
    subtitle: 'El archivo de catálogo (.cat): la firma criptográfica WHQL y la firma de código de kernel',
    targetMechanism: 'Kernel-Mode Code Signing (KMCS) / WHQL Cryptographic Catalog',
    targetComponent: 'SignTool / WinVerifyTrust / C:\\Windows\\System32\\CatRoot',
    commandName: 'signtool verify /kp /v /c driver.cat driver.sys',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows de 64 bits rechaza rotundamente cargar un driver que no tenga una firma digital criptográfica válida: el archivo .cat contiene los hashes inmutables validados por los laboratorios de Microsoft (WHQL).',
      mythVsTruth: {
        mentira: 'Windows solo pide firmas digitales en los drivers para cobrarle dinero a los fabricantes de hardware.',
        verdad: 'La firma obligatoria (KMCS) garantiza que el driver no fue alterado por un virus tipo rootkit y que superó pruebas rigurosas de estabilidad de memoria en los laboratorios de compatibilidad de Microsoft.',
        comprobalo: 'Revisá la carpeta C:\\Windows\\System32\\CatRoot: verás miles de catálogos criptográficos firmados por "Microsoft Windows Hardware Compatibility Publisher".',
      },
    },
    entende: {
      queEs: 'Un archivo de catálogo criptográfico que contiene las huellas digitales (hashes SHA-256) de todos los archivos que componen el paquete del controlador (.inf, .sys, .dll).',
      paraQueSirve: 'Permitir que el subsistema de seguridad de Windows valide en microsegundos que ningún archivo del paquete fue modificado o corrompido desde su certificación oficial.',
      quePasaSiFalta: 'En Windows de 64 bits, un driver sin firma digital válida es bloqueado en el arranque, arrojando el Código de Error 52.',
    },
    interactua: {
      cliExample: 'pnputil /enum-drivers # Muestra el Signer Name de cada paquete instalado',
      psExample: 'Get-AuthenticodeSignature "C:\\Windows\\System32\\drivers\\ntoskrnl.exe"',
      syntaxBreakdown: 'El archivo .cat está firmado con un certificado digital emitido por la autoridad raíz de Microsoft (WHQL Certification) o un certificado Extended Validation (EV) con attestation signing.',
      whatToLookFor: 'Signer Name: "Microsoft Windows Hardware Compatibility Publisher" indica certificación WHQL oficial completa.',
      technicalMetrics: 'Prueba de validación: WinVerifyTrust procesa el catálogo contra las listas de revocación CRL y el almacén CatRoot2 del sistema.',
    },
    alertaEVO: {
      reversibilityRule: 'Inspección de firmas digitales segura y de solo lectura.',
      safetyWarning: 'Deshabilitar el chequeo obligatorio de firmas de controladores (bcdedit /set testsigning on) expone el kernel a malware de día cero y rootkits indetectables.',
    },
    evidenceBadge: {
      code: 'CAT-WHQL',
      label: 'CATÁLOGO WHQL',
    },
  },
  {
    id: 'sec-15-09',
    code: '15.09',
    title: 'Driver Store',
    subtitle: 'El almacén de controladores: aislamiento y repositorio inmutable en FileRepository',
    targetMechanism: 'Driver Staging & Component Store Isolation',
    targetComponent: 'C:\\Windows\\System32\\DriverStore\\FileRepository',
    commandName: 'dism /online /get-drivers /format:table',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows nunca instala un driver directamente en el hardware: primero lo copia de manera inmutable en una bóveda blindada llamada "Driver Store", asignándole un nombre como oem42.inf.',
      mythVsTruth: {
        mentira: 'Cuando actualizás un driver, Windows borra la versión vieja para ahorrar espacio en el disco.',
        verdad: 'Windows conserva las versiones anteriores archivadas en el Driver Store para permitirte hacer un "Rollback" instantáneo si la nueva versión tiene errores o pantallas azules.',
        comprobalo: 'Inspeccioná la carpeta C:\\Windows\\System32\\DriverStore\\FileRepository: verás subcarpetas para cada driver instalado junto a versiones históricas previas.',
      },
    },
    entende: {
      queEs: 'Un repositorio centralizado, seguro y protegido de paquetes de controladores válidos que han sido verificados por el subsistema PnP.',
      paraQueSirve: 'Permitir que cualquier usuario conecte un hardware previamente configurado y Windows lo instale en milisegundos sin solicitar privilegios de administrador ni discos de instalación.',
      quePasaSiFalta: 'Si la base de datos del Driver Store se corrompe, Windows no podrá instalar ningún periférico nuevo ni recuperarse de fallos de controladores.',
    },
    interactua: {
      cliExample: 'pnputil /enum-drivers',
      psExample: 'Get-ChildItem -Path "C:\\Windows\\System32\\DriverStore\\FileRepository" | Measure-Object',
      syntaxBreakdown: 'pnputil /enum-drivers lista el nombre publicado (ej. oem12.inf), el nombre original del INF (ej. nv_dispig.inf), proveedor, fecha y versión.',
      whatToLookFor: 'Tamaño del DriverStore: en sistemas con años de actualizaciones de GPU, la carpeta FileRepository puede acumular decenas de gigabytes de drivers viejos descartados.',
      technicalMetrics: 'Comando de limpieza: pnputil /delete-driver oemXX.inf /uninstall limpia paquetes huérfanos sin romper la integridad del almacén.',
    },
    alertaEVO: {
      reversibilityRule: 'Consulta de solo lectura segura.',
      safetyWarning: 'NUNCA borres archivos manualmente de FileRepository usando el Explorador de Windows: corromperás la base de datos indexada en el registro drvstore.dat.',
    },
    evidenceBadge: {
      code: 'DRIVER-STORE',
      label: 'DRIVER STORE REPO',
    },
  },
  {
    id: 'sec-15-10',
    code: '15.10',
    title: 'Bus driver',
    subtitle: 'El controlador de bus: enumeración física de hijos y creación de Physical Device Objects (PDO)',
    targetMechanism: 'Bus Enumeration & PDO Factory Architecture',
    targetComponent: 'pci.sys / usbhub3.sys / acpi.sys',
    commandName: 'devcon hwids =pci / =usb',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows no habla con una placa de video ni con un pendrive en el vacío: habla primero con el "Bus Driver" (el controlador de PCI Express o de USB) que actúa como padre y los detecta.',
      mythVsTruth: {
        mentira: 'El driver de la placa de video se encarga de detectar cuándo la conectás al slot PCIe de la motherboard.',
        verdad: 'Es el driver de bus (pci.sys) el que monitorea las líneas del bus, detecta la presencia del hardware, le asigna direcciones de memoria y crea el Physical Device Object (PDO) para representarlo ante el kernel.',
        comprobalo: 'Mirá el Administrador de dispositivos por conexión: verás que cada placa de red cuelga de un "Puerto raíz PCI Express" gobernado por pci.sys.',
      },
    },
    entende: {
      queEs: 'Un controlador especializado que maneja un bus de hardware (PCIe, USB, I2C, Thunderbolt) y tiene la responsabilidad de enumerar todos los dispositivos hijos conectados a él.',
      paraQueSirve: 'Detectar inserciones y desconexiones de hardware en tiempo real, asignar recursos de hardware (I/O ports, interrupciones IRQ, rangos MMIO) y notificar al PnP Manager.',
      quePasaSiFalta: 'Si el driver de bus falla (ej. pci.sys), ninguno de los dispositivos conectados a ese bus será visible para Windows.',
    },
    interactua: {
      cliExample: 'pnputil /enum-devices /bus PCI',
      psExample: 'Get-PnpDevice -Class System | Where-Object { $_.FriendlyName -like "*PCI Express*" }',
      syntaxBreakdown: 'El bus driver crea el objeto de kernel PDO (Physical Device Object) que representa la interfaz física del hardware en la base del stack de dispositivos.',
      whatToLookFor: 'Manejo de IRPs de tipo IRP_MN_QUERY_DEVICE_RELATIONS para devolver la lista de todos los PDOs presentes en el bus.',
      technicalMetrics: 'Drivers de bus principales: pci.sys (PCI Express), usbhub3.sys (USB 3.0/3.1 SuperSpeed), i2c.sys (I2C/HID), nvme.sys (NVMe Subsystem).',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de estado de bus segura.',
      safetyWarning: 'La deshabilitación de un bus driver apaga en cadena todos los dispositivos subordinados que dependen de él.',
    },
    evidenceBadge: {
      code: 'BUS-DRIVER',
      label: 'CONTROLADOR BUS',
    },
  },
  {
    id: 'sec-15-11',
    code: '15.11',
    title: 'Function driver',
    subtitle: 'El controlador de función: la lógica de control del hardware y creación de FDOs',
    targetMechanism: 'Functional Device Object (FDO) Operation / Hardware Operational Logic',
    targetComponent: 'nvlddmkm.sys / rt640x64.sys / storahci.sys',
    commandName: 'sc qc <ServiceName>',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El "driver principal" que instalás cuando bajás el paquete de tu placa gráfica o de audio es técnicamente el "Function Driver": se apila justo encima del PDO creado por el bus driver.',
      mythVsTruth: {
        mentira: 'Un dispositivo en Windows tiene un solo archivo ejecutable que hace todo el trabajo.',
        verdad: 'Windows utiliza una pila de dispositivos (Device Stack): el bus driver crea el objeto físico (PDO) y el function driver se conecta encima creando un Functional Device Object (FDO) que maneja las operaciones de usuario.',
        comprobalo: 'Inspeccioná las propiedades del controlador en Device Manager: verás el servicio principal (ej. nvlddmkm) configurado como el controlador de servicio de función del hardware.',
      },
    },
    entende: {
      queEs: 'El controlador principal de un dispositivo, desarrollado habitualmente por el fabricante del chip, que implementa la interfaz funcional y la lógica de control operativa del componente.',
      paraQueSirve: 'Traducir solicitudes genéricas de Windows (como "dibujar un triángulo 3D" o "enviar un paquete Ethernet TCP") en instrucciones y secuencias binarias específicas que el silicio comprende.',
      quePasaSiFalta: 'El hardware es detectado físicamente por el bus pero permanece mudo e inútil en el Administrador de Dispositivos con Código 28 (Falta controlador).',
    },
    interactua: {
      cliExample: 'sc qc nvlddmkm',
      psExample: 'Get-Service -Name "nvlddmkm" | Select-Object Name, DisplayName, Status',
      syntaxBreakdown: 'El function driver se asocia al dispositivo en la directiva AddService del archivo INF con el flag 0x00000002 (SPSVCINST_ASSOCSERVICE).',
      whatToLookFor: 'En el debugger de kernel WinDbg: comando "!devstack <PDO_Address>" muestra claramente el PDO en la base y el FDO en el nivel funcional.',
      technicalMetrics: 'Tipos de arquitectura: KMDF (Kernel-Mode Driver Framework) o UMDF (User-Mode Driver Framework para periféricos USB que no requieren latencia cero).',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible mediante reinstalación o rollback del driver.',
      safetyWarning: 'Los crashes en el function driver de la GPU provocan el clásico TDR (Timeout Detection and Recovery) o pantalla azul VIDEO_TDR_FAILURE.',
    },
    evidenceBadge: {
      code: 'FUNC-DRIVER',
      label: 'FUNCTION DRIVER FDO',
    },
  },
  {
    id: 'sec-15-12',
    code: '15.12',
    title: 'Filter driver',
    subtitle: 'Controladores de filtro Upper y Lower: interceptación de IRPs y origen clásico de fallas',
    targetMechanism: 'Device Stack Filter Injection (Upper/Lower Filters)',
    targetComponent: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\<ClassGUID>\\UpperFilters',
    commandName: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class" /v UpperFilters /s',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '¿Por qué los programas de grabación de CD o software de luces RGB rompían Windows? Porque inyectan "Filter Drivers" invisibles en el stack de dispositivos para espiar y modificar las órdenes del hardware.',
      mythVsTruth: {
        mentira: 'Los drivers de filtro son componentes oficiales de Microsoft que nunca causan problemas.',
        verdad: 'Antivirus, software de periféricos, emuladores y grabadores instalan UpperFilters y LowerFilters. Si desinstalás mal uno de estos programas, el filtro huérfano rompe todo el dispositivo con Código 19.',
        comprobalo: 'Revisá la subclave de la clase de unidades de disco o teclado en el registro: verás valores UpperFilters apuntando a kbdclass y a filtros de terceros.',
      },
    },
    entende: {
      queEs: 'Un controlador opcional que se inserta por encima (Upper Filter) o por debajo (Lower Filter) del Function Driver en el Device Stack para interceptar o modificar paquetes de I/O (IRPs).',
      paraQueSirve: 'Agregar funcionalidades adicionales como cifrado al vuelo (BitLocker), emulación de macros en teclados gamer, virtualización o inspección antimalware de paquetes de red.',
      quePasaSiFalta: 'El dispositivo funciona con normalidad; los drivers de filtro son puramente optativos salvo que formen parte de una suite de seguridad obligatoria.',
    },
    interactua: {
      cliExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e965-e325-11ce-bfc1-08002be10318}" /v UpperFilters',
      psExample: 'Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e96b-e325-11ce-bfc1-08002be10318}" | Select-Object UpperFilters, LowerFilters',
      syntaxBreakdown: 'UpperFilters: se cargan antes del Function Driver. LowerFilters: se cargan entre el Bus Driver y el Function Driver.',
      whatToLookFor: 'Si un driver listado en UpperFilters o LowerFilters fue borrado de System32\\drivers, Windows no puede armar el Device Stack y bloquea el dispositivo con Código 19.',
      technicalMetrics: 'Resolución de emergencia de Código 19: eliminar el nombre del driver huérfano de la cadena multilínea UpperFilters en el registro.',
    },
    alertaEVO: {
      reversibilityRule: 'La limpieza de valores huérfanos en el registro restaura de inmediato el funcionamiento del stack.',
      safetyWarning: 'Borrar un filtro esencial como volsnap o kbdclass puede dejar al sistema sin teclado o sin capacidad de arrancar la unidad de almacenamiento.',
    },
    evidenceBadge: {
      code: 'FILTER-STACK',
      label: 'UPPER/LOWER FILTERS',
    },
  },
  {
    id: 'sec-15-13',
    code: '15.13',
    title: 'PnP',
    subtitle: 'Plug and Play Manager: ciclo de vida de dispositivos, estados de energía y el IRP_MN_START_DEVICE',
    targetMechanism: 'Kernel PnP Subsystem Lifecycle State Machine',
    targetComponent: 'ntoskrnl.exe (PnP Manager) / ACPI subsystem',
    commandName: 'Get-PnpDevice | Measure-Object',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Cuando conectás un dispositivo, el PnP Manager ejecuta una sinfonía de estados de kernel milimétricos: DeviceAdded -> StartDevice -> Started -> QueryStop -> Stopped -> RemoveDevice.',
      mythVsTruth: {
        mentira: 'Plug and Play es simplemente la ventana emergente que aparece cuando conectás un pendrive.',
        verdad: 'Es uno de los subsistemas más masivos de ntoskrnl.exe: coordina la asignación de memoria, interrupciones, energía (estados D0-D3 de ACPI) y el orden de inicio de todo el hardware de la PC.',
        comprobalo: 'Inspeccioná el Visor de Eventos -> Registros de aplicaciones y servicios -> Microsoft -> Windows -> Kernel-PnP: verás cada transición de estado registrada con microsegundos.',
      },
    },
    entende: {
      queEs: 'El motor interno de Windows responsable de la detección automática, asignación de recursos, carga de controladores y gestión dinámica de hardware caliente (Hot-Plug).',
      paraQueSirve: 'Permitir que el usuario conecte periféricos USB, tarjetas PCIe o monitores sin reiniciar el sistema operativo ni configurar jumpers manuales de interrupciones.',
      quePasaSiFalta: 'Volveríamos a la era de MS-DOS y Windows 3.11, donde cada tarjeta de sonido requería configurar manualmente canales DMA e IRQ por hardware.',
    },
    interactua: {
      cliExample: 'pnputil /scan-devices',
      psExample: 'Get-WinEvent -ProviderName "Microsoft-Windows-Kernel-PnP" -MaxEvents 5 | Format-List',
      syntaxBreakdown: 'PnP despacha paquetes IRP_MJ_PNP con códigos menores: IRP_MN_START_DEVICE (arranque), IRP_MN_QUERY_REMOVE_DEVICE (petición de desconexión segura).',
      whatToLookFor: 'Transiciones de estado de energía: D0 (completamente encendido y funcionando), D1/D2 (ahorro intermedio), D3hot / D3cold (completamente apagado o sin alimentación).',
      technicalMetrics: 'Latencia de enumeración PnP: típicamente < 150 ms para dispositivos USB de alta velocidad.',
    },
    alertaEVO: {
      reversibilityRule: 'Lectura de telemetría PnP segura.',
      safetyWarning: 'Forzar la desconexión física de un dispositivo sin pasar por la rutina PnP de extracción segura puede provocar corrupción de datos si hay escrituras pendientes en caché.',
    },
    evidenceBadge: {
      code: 'PNP-CORE',
      label: 'PNP MANAGER KERNEL',
    },
  },
  {
    id: 'sec-15-14',
    code: '15.14',
    title: 'Code 10',
    subtitle: 'Código de error 10: "This device cannot start" - fallo en DriverEntry o en IRP_MN_START_DEVICE',
    targetMechanism: 'Device Start Failure / NTSTATUS Unsuccessful Initialization',
    targetComponent: 'Device Node Status Flags (DN_HAS_PROBLEM | CM_PROB_FAILED_START)',
    commandName: 'Get-PnpDevice -Status Error',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'El Código 10 es el error más común y frustrante de Windows: significa que el driver se cargó perfectamente en memoria, pero cuando intentó comunicarse con el chip, el hardware no respondió o devolvió un error fatal.',
      mythVsTruth: {
        mentira: 'El Código 10 significa que el archivo del controlador está roto o que Windows tiene virus.',
        verdad: 'Significa técnicamente que la rutina DriverEntry o el manejador de IRP_MN_START_DEVICE del controlador devolvió un código NTSTATUS de fallo (como STATUS_DEVICE_NOT_READY o STATUS_INSUFFICIENT_RESOURCES).',
        comprobalo: 'Provocá un conflicto de firmware o desconectá un dispositivo a medio inicializar: Device Manager reportará de inmediato "Este dispositivo no puede iniciar. (Código 10)".',
      },
    },
    entende: {
      queEs: 'Un estado de error del PnP Manager (CM_PROB_FAILED_START) que indica que el dispositivo no pudo completar con éxito su secuencia de inicialización básica.',
      paraQueSirve: 'Prevenir que Windows intente interactuar con un hardware que se encuentra en un estado inestable, evitando corrupciones de memoria o cuelgues del sistema.',
      quePasaSiFalta: 'El sistema intentaría mandar comandos a un dispositivo no inicializado, provocando bloqueos de hilos de ejecución en bucle infinito.',
    },
    interactua: {
      cliExample: 'powershell "Get-PnpDevice | Where-Object { $_.Problem -eq 10 }"',
      psExample: 'Get-PnpDevice | Where-Object { $_.Problem -eq 10 } | Select-Object FriendlyName, InstanceId, ProblemDescription',
      syntaxBreakdown: 'Causas típicas: 1. Firmware desincronizado (requiere drenar energía); 2. Incompatibilidad de versión de driver; 3. Fallo de suministro eléctrico en el puerto.',
      whatToLookFor: 'Procedimiento de resolución: Deshabilitar y volver a habilitar el dispositivo para forzar un nuevo ciclo IRP_MN_START_DEVICE; si persiste, apagar la PC y desconectar el cable de corriente 30 segundos (Cold Power Cycle).',
      technicalMetrics: 'Tasa de éxito del drenado de energía en Código 10: > 60% en tarjetas Wi-Fi/Bluetooth integradas en laptops.',
    },
    alertaEVO: {
      reversibilityRule: 'Totalmente reversible actualizando driver, drenando energía o reinsertando el hardware.',
      safetyWarning: 'Si el Código 10 persiste tras formatear y actualizar BIOS, el silicio del chip sufrió daño físico irreparable.',
    },
    evidenceBadge: {
      code: 'ERR-CODE-10',
      label: 'CÓDIGO 10 DIAGNÓSTICO',
    },
  },
  {
    id: 'sec-15-15',
    code: '15.15',
    title: 'Code 19',
    subtitle: 'Código de error 19: "Registry configuration incomplete or damaged" - filtros huérfanos en Class Key',
    targetMechanism: 'Filter Driver Registry Resolution Failure (CM_PROB_REGISTRY_ERROR)',
    targetComponent: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\<GUID>',
    commandName: 'reg query HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class /f UpperFilters',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Si de un día para el otro tu teclado o lectora de discos deja de funcionar con Código 19, no cambies el teclado: casi seguro desinstalaste un programa que dejó un nombre fantasma en el valor UpperFilters del registro.',
      mythVsTruth: {
        mentira: 'El Código 19 se soluciona comprando otro teclado o mouse porque el hardware se quemó.',
        verdad: 'El Código 19 es un problema 100% de software en el registro de Windows: el sistema operativo intenta cargar un driver de filtro declarado en la clave de clase, no lo encuentra en el disco y aborta la carga de todo el hardware.',
        comprobalo: 'Buscá en Google "Error Code 19 CD-ROM": la solución oficial de la base de conocimientos de Microsoft (KB) consiste en eliminar UpperFilters y LowerFilters huérfanos.',
      },
    },
    entende: {
      queEs: 'Un error PnP (CM_PROB_REGISTRY_ERROR) que ocurre cuando las entradas de configuración de un dispositivo en el registro contienen referencias a controladores inexistentes o valores corruptos.',
      paraQueSirve: 'Evitar que un dispositivo opere cuando su cadena de controladores requerida está incompleta.',
      quePasaSiFalta: 'Si Windows omitiera el fallo silenciosamente, los datos que debían ser filtrados por el software no se procesarían, causando fallas lógicas impredecibles.',
    },
    interactua: {
      cliExample: 'reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e96b-e325-11ce-bfc1-08002be10318}" /v UpperFilters',
      psExample: '(Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e96b-e325-11ce-bfc1-08002be10318}").UpperFilters',
      syntaxBreakdown: 'Clase de Teclado: {4d36e96b-e325-11ce-bfc1-08002be10318}. Valor UpperFilters por defecto: kbdclass. Si aparece otro valor (ej. kbdflt), ese es el causante del error si el archivo ya no existe.',
      whatToLookFor: 'Inspeccionar si los nombres listados en UpperFilters tienen su correspondiente archivo .sys en C:\\Windows\\System32\\drivers.',
      technicalMetrics: 'Solución quirúrgica: editar el valor UpperFilters con regedit y dejar únicamente el driver nativo de Microsoft (kbdclass para teclados, mouclass para ratones).',
    },
    alertaEVO: {
      reversibilityRule: 'Hacer una copia de seguridad (.reg) de la clave de clase antes de cualquier edición manual.',
      safetyWarning: 'Borrar la subclave de clase completa (Class GUID) en lugar de solo el valor UpperFilters dejará inutilizable la categoría entera de dispositivos.',
    },
    evidenceBadge: {
      code: 'ERR-CODE-19',
      label: 'CÓDIGO 19 FILTROS',
    },
  },
  {
    id: 'sec-15-16',
    code: '15.16',
    title: 'Code 28',
    subtitle: 'Código de error 28: "The drivers for this device are not installed" - ausencia de match en Driver Store',
    targetMechanism: 'Unmatched PnP Node / Missing INF Package (CM_PROB_FAILED_INSTALL)',
    targetComponent: 'Device Manager / Other Devices Node',
    commandName: 'pnputil /scan-devices / pnputil /add-driver <path> /install',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El Código 28 es el clásico "Dispositivo desconocido" con triángulo amarillo: Windows detectó el hardware, leyó su Hardware ID, buscó en toda su biblioteca de drivers y no encontró absolutamente ninguna coincidencia.',
      mythVsTruth: {
        mentira: 'Un dispositivo con Código 28 está roto físicamente o la placa madre no lo soporta.',
        verdad: 'El hardware está físicamente perfecto y listo para funcionar; simplemente carece de un archivo INF compatible instalado en el Almacén de Controladores (Driver Store).',
        comprobalo: 'Copia el Hardware ID de un dispositivo con Código 28 e instálale el paquete provisto por el fabricante: en 2 segundos el triángulo amarillo desaparece y pasa a estado OK.',
      },
    },
    entende: {
      queEs: 'El estado PnP por defecto (CM_PROB_FAILED_INSTALL) para cualquier pieza de hardware que fue enumerada en el bus pero para la cual no existe ningún controlador asociado en el sistema.',
      paraQueSirve: 'Alertar al usuario de que el componente requiere la provisión manual o automática de un paquete de controladores para poder ser utilizado.',
      quePasaSiFalta: 'El hardware permanece apagado o en un estado de reposo de bajo consumo, sin interactuar con el resto de las aplicaciones.',
    },
    interactua: {
      cliExample: 'pnputil /enum-devices /problem 28',
      psExample: 'Get-PnpDevice | Where-Object { $_.Problem -eq 28 } | Select-Object FriendlyName, InstanceId, Class',
      syntaxBreakdown: 'Flujo de resolución: 1. Obtener Hardware ID en Propiedades -> Detalles; 2. Descargar el instalador oficial; 3. Descomprimir o ejecutar pnputil /add-driver <inf> /install.',
      whatToLookFor: 'Dispositivos agrupados bajo el nodo "Otros dispositivos" en la vista raíz de Device Manager.',
      technicalMetrics: 'Fuentes de resolución: Catálogo de Microsoft Update (catalog.update.microsoft.com) o portal de soporte del fabricante del equipo (OEM).',
    },
    alertaEVO: {
      reversibilityRule: '100% reversible instalando el paquete de controladores correspondiente.',
      safetyWarning: 'Evitá programas automáticos de descarga masiva de drivers: suelen instalar versiones modificadas con adware o drivers incorrectos que generan pantallazos azules.',
    },
    evidenceBadge: {
      code: 'ERR-CODE-28',
      label: 'CÓDIGO 28 SIN DRIVER',
    },
  },
  {
    id: 'sec-15-17',
    code: '15.17',
    title: 'Code 31',
    subtitle: 'Código de error 31: "Cannot load the drivers required" - binarios .sys corruptos o dependencias caídas',
    targetMechanism: 'Driver Image Load Failure / NTSTATUS Unsuccessful Binary Load',
    targetComponent: 'ZwLoadDriver / C:\\Windows\\System32\\drivers\\*.sys',
    commandName: 'sc query <ServiceName> / pnputil /restart-device <InstanceId>',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'El Código 31 ocurre cuando Windows sabe exactamente qué archivo .sys debe cargar, pero cuando el kernel intenta levantarlo a la memoria RAM, el archivo está dañado en el disco o le falta una DLL de soporte.',
      mythVsTruth: {
        mentira: 'El Código 31 significa que el hardware falló por una sobrecarga de voltaje.',
        verdad: 'Es un fallo puramente lógico en el subsistema de carga de binarios del kernel: el archivo ejecutable del driver está ausente, truncado a 0 bytes por un corte de luz o corrupto a nivel de sistema de archivos.',
        comprobalo: 'Cambiá el nombre del archivo .sys de un driver de prueba en System32\\drivers y reiniciá el dispositivo: Device Manager devolverá de inmediato Código 31.',
      },
    },
    entende: {
      queEs: 'Un código de problema PnP (CM_PROB_FAILED_LOAD) emitido cuando el gestor de objetos del kernel no logra cargar la imagen ejecutable del controlador en el espacio de direcciones de kernel.',
      paraQueSirve: 'Notificar fallas de integridad en los binarios del controlador para evitar accesos a punteros inválidos en Ring 0.',
      quePasaSiFalta: 'Si Windows intentara saltar a la dirección de memoria de un binario no cargado, la CPU dispararía una excepción de violación de acceso de kernel instantánea.',
    },
    interactua: {
      cliExample: 'sfc /scanfile=C:\\Windows\\System32\\drivers\\<NombreDriver>.sys',
      psExample: 'Get-PnpDevice | Where-Object { $_.Problem -eq 31 } | Select-Object FriendlyName, InstanceId',
      syntaxBreakdown: 'Causas habituales: 1. Archivo .sys corrupto por sectores defectuosos; 2. Conflicto con software de virtualización; 3. DLL auxiliar ausente en System32.',
      whatToLookFor: 'Comprobación con sfc /scannow o reinstalación limpia del paquete de controladores desde el archivo original.',
      technicalMetrics: 'Códigos de estado NTSTATUS típicos subyacentes: STATUS_IMAGE_CHECKSUM_MISMATCH, STATUS_OBJECT_NAME_NOT_FOUND, STATUS_INSUFFICIENT_RESOURCES.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible reparando el archivo con SFC o reinstalando el controlador.',
      safetyWarning: 'Si el archivo .sys continúa corrompiéndose recurrentemente tras reinstalarlo, examiná la salud del SSD o la estabilidad de la memoria RAM.',
    },
    evidenceBadge: {
      code: 'ERR-CODE-31',
      label: 'CÓDIGO 31 LOAD ERROR',
    },
  },
  {
    id: 'sec-15-18',
    code: '15.18',
    title: 'Code 43',
    subtitle: 'Código de error 43: "Stopped because it reported problems" - bloqueo por falla de firmware o hardware',
    targetMechanism: 'Device Halt by Internal Failure / VRAM / Hardware Failure',
    targetComponent: 'CM_PROB_FAILED_POST_CHECK / Hardware Engine',
    commandName: 'Get-PnpDevice | Where-Object { $_.Problem -eq 43 }',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'En el 90% de los casos, ver Código 43 en una tarjeta gráfica de alta gama es una señal de alarma grave: significa que el firmware del chip o la memoria VRAM fallaron físicamente en las pruebas de inicio.',
      mythVsTruth: {
        mentira: 'El Código 43 siempre se soluciona reinstalando el driver más nuevo de la web.',
        verdad: 'El Código 43 indica que el controlador detuvo conscientemente el dispositivo porque el hardware reportó un fallo catastrófico (ej. soldaduras BGA agrietadas, chips de VRAM desoldados o puerto USB cortocircuitado).',
        comprobalo: 'En periféricos USB, un cable roto que provoca caída de tensión genera Código 43 en milisegundos porque el microcontrolador entra en estado de suspensión por falta de voltaje.',
      },
    },
    entende: {
      queEs: 'Un estado de protección PnP (CM_PROB_FAILED_POST_CHECK) donde el controlador le informa formalmente al sistema operativo que el hardware está defectuoso y debe suspenderse.',
      paraQueSirve: 'Blindar el sistema operativo contra cuelgues masivos y prevenir incendios o daños eléctricos mayores por sobrecalentamiento en componentes con fallas circuitales.',
      quePasaSiFalta: 'La tarjeta continuaría ejecutando instrucciones, provocando artefactos visuales, congelamiento de la PC cada 10 segundos o daños permanentes en la placa madre.',
    },
    interactua: {
      cliExample: 'powershell "Get-PnpDevice | Where-Object { $_.Problem -eq 43 } | Format-List"',
      psExample: 'Get-PnpDevice -Class "Display" | Select-Object FriendlyName, Status, Problem, ProblemDescription',
      syntaxBreakdown: 'Protocolo de descarte: 1. Limpieza total con DDU (Display Driver Uninstaller) en Modo Seguro; 2. Si persiste con driver limpio oficial, el fallo es 100% de hardware (reballing/VRAM).',
      whatToLookFor: 'En GPU: resolución bloqueada a 800x600 o líneas verticales de colores (artefactos) en el arranque del BIOS antes de que cargue Windows.',
      technicalMetrics: 'Tasa de falla de silicio en GPUs con Código 43 persistente tras DDU: > 95% atribuible a memoria de video GDDR o encapsulado BGA.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible en periféricos USB reconectando o cambiando de puerto; difícilmente reversible en GPUs sin reparación electrónica.',
      safetyWarning: 'Hacer "horneado" casero de placas con Código 43 es un mito peligroso que emite gases tóxicos y destruye permanentemente las pistas de cobre de la PCB.',
    },
    evidenceBadge: {
      code: 'ERR-CODE-43',
      label: 'CÓDIGO 43 HARDWARE',
    },
  },
  {
    id: 'sec-15-19',
    code: '15.19',
    title: 'Rollback',
    subtitle: 'Revertir al controlador anterior: la salvaguarda de Windows usando copias en el Driver Store',
    targetMechanism: 'Driver Rollback Mechanism / Previous Staged Version Activation',
    targetComponent: 'Device Manager -> Driver Tab -> Roll Back Driver',
    commandName: 'devcon update / pnputil /rollback',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Si una actualización de drivers te deja sin sonido o arruina los FPS en tu juego favorito, el botón "Revertir al controlador anterior" restaura la versión previa exacta en menos de 5 segundos.',
      mythVsTruth: {
        mentira: 'Revertir un controlador descarga la versión vieja desde los servidores de Microsoft a través de internet.',
        verdad: 'Windows nunca borra inmediatamente el driver previo: lo mantiene archivado en el Driver Store de tu disco local. El rollback es una operación local casi instantánea.',
        comprobalo: 'En Device Manager, abrí las propiedades de tu GPU -> solapa "Controlador": si el botón "Revertir al controlador anterior" está activo, Windows tiene la versión previa lista para conmutar.',
      },
    },
    entende: {
      queEs: 'Una función de seguridad del Administrador de Dispositivos que permite restaurar el paquete de controladores previamente instalado y configurado para ese dispositivo.',
      paraQueSirve: 'Recuperar de forma ágil la operatividad normal del sistema cuando una actualización de controladores introduce inestabilidad, bugs o regresiones de rendimiento.',
      quePasaSiFalta: 'El usuario tendría que recordar la versión exacta anterior, buscarla en foros de internet, desinstalar manualmente y reinstalar desde cero.',
    },
    interactua: {
      cliExample: 'rem En Device Manager: Propiedades del hardware -> Controlador -> Revertir al controlador anterior',
      psExample: '# Con pnputil podemos conmutar entre versiones staged en el FileRepository',
      syntaxBreakdown: 'Al ejecutar Rollback, Windows cambia la asociación del servicio en el registro para que apunte nuevamente al binario .sys de la versión archivada anterior.',
      whatToLookFor: 'Si el botón "Revertir al controlador anterior" está deshabilitado (en gris), significa que es el primer driver instalado para ese hardware o que las versiones previas fueron purgadas.',
      technicalMetrics: 'Tiempo de ejecución del rollback: típicamente entre 2 y 8 segundos.',
    },
    alertaEVO: {
      reversibilityRule: 'Completamente reversible. Podés volver a actualizar en cualquier momento.',
      safetyWarning: 'Tras hacer rollback, bloqueá temporalmente las actualizaciones automáticas de drivers de Windows Update para evitar que te vuelva a instalar la versión problemática esa misma noche.',
    },
    evidenceBadge: {
      code: 'DRIVER-ROLLBACK',
      label: 'REVERTIR DRIVER',
    },
  },
  {
    id: 'sec-15-20',
    code: '15.20',
    title: 'Disable/Enable',
    subtitle: 'Deshabilitar y volver a habilitar: forzado de IRP de parada/arranque sin reiniciar Windows',
    targetMechanism: 'PnP Stack Teardown & Reconstruction / IRP_MN_STOP & START Cycle',
    targetComponent: 'Device Manager / pnputil /disable-device & /enable-device',
    commandName: 'pnputil /disable-device "<InstanceId>" && pnputil /enable-device "<InstanceId>"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Deshabilitar y volver a habilitar un dispositivo en Device Manager no es una tontería: obliga al kernel a descargar el Function Driver de la memoria, resetear el silicio por hardware y reconstruir el Device Stack completo.',
      mythVsTruth: {
        mentira: 'Deshabilitar un dispositivo es exactamente lo mismo que silenciarlo o apagarlo en un programa.',
        verdad: 'El kernel le envía al hardware la instrucción IRP_MN_STOP_DEVICE, corta la asignación de buffers de memoria y recursos, y al habilitarlo vuelve a disparar IRP_MN_START_DEVICE desde cero.',
        comprobalo: 'Si tu Bluetooth o adaptador Wi-Fi se congela, deshabilitarlo y habilitarlo con un script de PowerShell lo revive en 3 segundos sin obligarte a reiniciar toda la computadora.',
      },
    },
    entende: {
      queEs: 'El procedimiento administrativo de suspender la operación de un nodo de dispositivo en el árbol PnP y reactivarlo bajo demanda sin reiniciar el sistema operativo.',
      paraQueSirve: 'Resetear adaptadores de red que sufrieron saturación de sockets, reiniciar controladores de audio con fallas de sincronización o apagar periféricos que no se usan para ahorrar batería.',
      quePasaSiFalta: 'Cualquier fallo menor de sincronización en un periférico exigiría reiniciar el equipo entero para restaurar su estado.',
    },
    interactua: {
      cliExample: 'pnputil /restart-device "PCI\\VEN_10DE&DEV_2684&SUBSYS_16541043&REV_A1\\4&1a2b3c4&0&0000"',
      psExample: 'Disable-PnpDevice -InstanceId "PCI\\VEN_xxxx..." -Confirm:$false; Enable-PnpDevice -InstanceId "PCI\\VEN_xxxx..." -Confirm:$false',
      syntaxBreakdown: 'pnputil /restart-device ejecuta atómicamente el ciclo de apagado y reencendido del dispositivo en una única instrucción.',
      whatToLookFor: 'Ícono de flecha negra hacia abajo: indica que el dispositivo está marcado explícitamente en el registro con la bandera de desactivación manual (CSCONFIGFLAG_DISABLED).',
      technicalMetrics: 'Tiempo de reinicio de stack: < 1.2 segundos para la mayoría de controladores de red y sonido.',
    },
    alertaEVO: {
      reversibilityRule: '100% reversible volviendo a habilitar el dispositivo.',
      safetyWarning: 'Nunca deshabilites el controlador de almacenamiento (ej. storahci o nvme) donde reside el sistema operativo en caliente, o provocarás un cuelgue inmediato.',
    },
    evidenceBadge: {
      code: 'DEV-RESET',
      label: 'RESET DE STACK',
    },
  },
  {
    id: 'sec-15-21',
    code: '15.21',
    title: 'Uninstall device',
    subtitle: 'Desinstalar dispositivo vs marcar "Eliminar el controlador": purga de FileRepository',
    targetMechanism: 'Device Node Removal & Driver Store Purge Execution',
    targetComponent: 'Device Manager Uninstall Dialog / pnputil /delete-driver /uninstall',
    commandName: 'pnputil /delete-driver oemXX.inf /uninstall /force',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Hay una diferencia abismal entre presionar "Desinstalar dispositivo" y marcar la casilla "Intentar eliminar el controlador de este dispositivo": uno solo desvincula el hardware; el otro borra los archivos del disco.',
      mythVsTruth: {
        mentira: 'Desinstalar un dispositivo en Device Manager borra automáticamente sus drivers de la computadora.',
        verdad: 'Si no marcás la casilla de eliminar software, al reiniciar Windows o hacer clic en "Buscar cambios de hardware", el sistema vuelve a instalar el mismo driver archivado en el Driver Store en 1 segundo.',
        comprobalo: 'Desinstalá tu mouse sin marcar la casilla y dale a "Buscar cambios de hardware": reaparece inmediatamente porque el paquete .inf sigue residiendo intacto en FileRepository.',
      },
    },
    entende: {
      queEs: 'El proceso de remover un nodo de dispositivo de la configuración activa del sistema operativo, con la opción de desinstalar y purgar de manera permanente el paquete de software asociado.',
      paraQueSirve: 'Limpiar instalaciones defectuosas, desinfectar drivers sospechosos o preparar el sistema para una instalación limpia desde cero (Clean Install).',
      quePasaSiFalta: 'Si un driver corrupto no se puede purgar del Driver Store, Windows continuará reinstalándolo de manera cíclica cada vez que detecte el hardware.',
    },
    interactua: {
      cliExample: 'pnputil /delete-driver oem15.inf /uninstall /force',
      psExample: 'Get-PnpDevice -FriendlyName "*Realtek*" | ForEach-Object { pnputil /delete-driver $_.InfName /uninstall /force }',
      syntaxBreakdown: 'El flag /uninstall desvincula el driver de todos los dispositivos que lo usan actualmente. El flag /force elimina el paquete incluso si está en uso.',
      whatToLookFor: 'Casilla en la interfaz gráfica: "Intentar quitar el controlador de este dispositivo" (Attempt to remove the driver for this device).',
      technicalMetrics: 'Eliminación atómica: elimina la subcarpeta de FileRepository y purga las referencias cruzadas en drvstore.dat.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible únicamente reinstalando el paquete de controladores oficial descargado de la web.',
      safetyWarning: 'Eliminar el controlador de red sin tener el archivo de instalación a mano te dejará sin conexión a internet para volver a descargarlo.',
    },
    evidenceBadge: {
      code: 'UNINSTALL-PURGE',
      label: 'DESINSTALAR / PURGA',
    },
  },
  {
    id: 'sec-15-22',
    code: '15.22',
    title: 'Scan hardware',
    subtitle: 'Buscar cambios de hardware: señal ACPI de re-enumeración y CM_Reenumerate_DevNode',
    targetMechanism: 'Asynchronous Bus Re-enumeration Trigger / devcon rescan',
    targetComponent: 'PnP Manager Root DevNode Rescan',
    commandName: 'pnputil /scan-devices / devcon rescan',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'El botón con la computadora y la lupa en Device Manager no "busca drivers en internet": le envía una señal de hardware a los controladores de bus para que vuelvan a escanear todos los puertos físicos en busca de silicio nuevo.',
      mythVsTruth: {
        mentira: 'El botón "Buscar cambios de hardware" se conecta a los servidores de Windows Update.',
        verdad: 'Ejecuta localmente una llamada a la función del kernel CM_Reenumerate_DevNode sobre el nodo raíz del árbol PnP, forzando a que cada bus driver vuelva a censar sus líneas de interrupción y puertos.',
        comprobalo: 'Desconectá y volvé a conectar un cable interno o periférico que no fue detectado: presioná "Buscar cambios de hardware" y verás cómo el árbol PnP parpadea y lo registra de inmediato.',
      },
    },
    entende: {
      queEs: 'El comando de reactivación que fuerza al gestor PnP a recorrer todos los controladores de bus registrados para detectar hardware recién insertado o retirado.',
      paraQueSirve: 'Descubrir componentes que no dispararon la interrupción automática de hot-plug o que fueron encendidos con posterioridad al arranque del sistema operativo.',
      quePasaSiFalta: 'Tendríamos que reiniciar la máquina cada vez que un periférico o disco externo secundario no es reconocido en primera instancia.',
    },
    interactua: {
      cliExample: 'pnputil /scan-devices',
      psExample: 'Start-Process -FilePath "pnputil.exe" -ArgumentList "/scan-devices" -NoNewWindow -Wait',
      syntaxBreakdown: 'pnputil /scan-devices solicita al gestor PnP una re-enumeración completa del árbol de hardware de forma asíncrona.',
      whatToLookFor: 'Parpadeo breve de la ventana del Administrador de Dispositivos mientras se reconstruyen las ramas del árbol.',
      technicalMetrics: 'Tiempo de re-escaneo: entre 500 ms y 2 segundos dependiendo de la cantidad de buses PCIe y concentradores USB encadenados.',
    },
    alertaEVO: {
      reversibilityRule: 'Operación no destructiva de solo sondeo.',
      safetyWarning: 'Escanear hardware continuamente con scripts en bucle puede saturar la CPU y ralentizar la respuesta de periféricos USB en tiempo real.',
    },
    evidenceBadge: {
      code: 'SCAN-HW',
      label: 'ESCANEO DE HARDWARE',
    },
  },
  {
    id: 'sec-15-23',
    code: '15.23',
    title: 'pnputil',
    subtitle: 'La herramienta oficial de línea de comandos pnputil.exe: gestión quirúrgica del almacén PnP',
    targetMechanism: 'Official PnP Administration Utility / Driver Store CLI Interface',
    targetComponent: 'C:\\Windows\\System32\\pnputil.exe',
    commandName: 'pnputil /enum-drivers /add-driver /export-driver',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Los verdaderos administradores de sistemas no usan la interfaz gráfica para gestionar drivers: usan pnputil.exe, la herramienta nativa más poderosa y quirúrgica incluida en todas las versiones de Windows.',
      mythVsTruth: {
        mentira: 'Para hacer un backup de todos los drivers de una PC necesitás programas de terceros con publicidad.',
        verdad: 'Con un único comando nativo oficial de Windows podés clonar todos los drivers de terceros instalados en una carpeta: pnputil /export-driver * C:\\BackupDrivers.',
        comprobalo: 'Creá la carpeta C:\\DriversBackup y ejecutá "pnputil /export-driver * C:\\DriversBackup": en 30 segundos tendrás cada INF, SYS y CAT respaldado a la perfección.',
      },
    },
    entende: {
      queEs: 'El ejecutable oficial de consola provisto por Microsoft para manipular directamente el repositorio de controladores PnP (Driver Store) y los dispositivos instalados.',
      paraQueSirve: 'Automatizar despliegues de controladores en empresas, exportar copias de seguridad de drivers de equipos antes de formatear y purgar paquetes viejos que ocupan espacio.',
      quePasaSiFalta: 'Habría que interactuar manualmente con asistentes gráficos uno por uno para cada uno de los 60 drivers que componen una PC moderna.',
    },
    interactua: {
      cliExample: 'pnputil /export-driver * D:\\BackupDrivers',
      psExample: 'pnputil /enum-drivers | Select-String -Pattern "oem[0-9]+\\.inf" -Context 0, 3',
      syntaxBreakdown: 'Comandos esenciales: /enum-drivers (listar paquetes en DriverStore), /add-driver <inf> /install (instalar nuevo driver), /delete-driver <oemXX.inf> (borrar paquete), /export-driver * <path> (respaldar todo).',
      whatToLookFor: 'Nombres publicados: los drivers agregados siempre reciben el alias oem<Número>.inf para distinguirlos de los drivers nativos de la bandeja de entrada de Windows (inbox drivers).',
      technicalMetrics: 'Tiempo de exportación completa de drivers de una laptop: ~25 segundos para respaldar ~120 paquetes de drivers.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible mediante reimportación con pnputil /add-driver D:\\BackupDrivers\\*.inf /subdirs /install.',
      safetyWarning: 'No uses el parámetro /delete-driver sin verificar antes qué dispositivo utiliza ese archivo oemXX.inf específico.',
    },
    evidenceBadge: {
      code: 'PNPUTIL-CLI',
      label: 'PNPUTIL OFICIAL CLI',
    },
  },
  {
    id: 'sec-15-24',
    code: '15.24',
    title: 'OEM vs fabricante del chip',
    subtitle: 'El dilema del controlador: laptop OEM (Dell/Lenovo/ASUS) vs Intel/AMD/Nvidia directo',
    targetMechanism: 'Vendor Specific Customizations vs Generic Reference Architectures',
    targetComponent: 'OEM ACPI Thermal Tables / Power Profiles / MUX Switching',
    commandName: 'dxdiag / msinfo32',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Si tenés una notebook gamer y descargás el driver de video directo de Nvidia, podés arruinar la duración de tu batería o romper el cambio automático de GPU híbrida si el fabricante personalizó el MUX Switch.',
      mythVsTruth: {
        mentira: 'El driver que publica Nvidia o Intel en su web siempre es 100% mejor que el que publica la marca de tu laptop (Lenovo, Dell, ASUS).',
        verdad: 'En computadoras portátiles, los fabricantes OEM inyectan perfiles térmicos, límites de vatios (TGP) y curvas de ventilación específicas en sus propios controladores. Un driver genérico de referencia puede ignorar estos ajustes.',
        comprobalo: 'Compará el tamaño del paquete de audio de Realtek provisto por ASUS con el genérico: el de ASUS incluye extensiones de software y filtros de cancelación de ruido certificados para sus micrófonos.',
      },
    },
    entende: {
      queEs: 'La dicotomía entre utilizar controladores genéricos de referencia publicados por los fabricantes de los chips de silicio o controladores validados y customizados por los ensambladores de las computadoras.',
      paraQueSirve: 'Elegir el equilibrio óptimo entre estabilidad, funciones propietarias de hardware y compatibilidad con las últimas optimizaciones para videojuegos o software profesional.',
      quePasaSiFalta: 'Si instalás un driver genérico en un equipo con arquitectura muy especializada (como una laptop con doble pantalla o refrigeración líquida integrada), podés perder el control de los ventiladores o las pantallas secundarias.',
    },
    interactua: {
      cliExample: 'wmic bios get serialnumber, smbiosbiosversion',
      psExample: 'Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer, Model',
      syntaxBreakdown: 'Regla de oro EVO: En PCs de escritorio armadas por componentes, usar SIEMPRE drivers directos del fabricante del chip (AMD/Intel/Nvidia). En notebooks, usar drivers OEM para energía, audio y touchpad, y directo de Nvidia/AMD solo para la GPU si buscás soporte de juegos del día 1.',
      whatToLookFor: 'Extensiones de software DCH: aplicaciones UWP de control propietarias provistas por el OEM en la tienda Microsoft Store.',
      technicalMetrics: 'Diferencia de consumo en reposo: hasta 8W extra de consumo en laptops usando drivers de chipset genéricos desalineados con la tabla ACPI.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible reinstalando el paquete OEM desde la web oficial de soporte del modelo.',
      safetyWarning: 'Nunca uses drivers de video de laptops de hace 5 años para jugar lanzamientos recientes: en ese caso particular, el driver directo de Nvidia/AMD es mandatorio a pesar de pequeñas anomalías.',
    },
    evidenceBadge: {
      code: 'OEM-VS-CHIP',
      label: 'OEM VS FABRICANTE',
    },
  },
  {
    id: 'sec-15-25',
    code: '15.25',
    title: 'Windows Update driver',
    subtitle: 'El canal automático WHQL de Windows Update: comodidades, sobreescrituras y políticas de bloqueo',
    targetMechanism: 'Driver Delivery via Windows Update / Quality Update Ring',
    targetComponent: 'USOClient.exe / HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate',
    commandName: 'Get-WindowsUpdate -Driver / gpedit.msc',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: '¿Te pasó que instalaste el último driver de tu placa gráfica y al otro día Windows Update te lo sobreescribió silenciosamente con una versión vieja de hace 6 meses? Es una directiva nativa que se puede desactivar.',
      mythVsTruth: {
        mentira: 'Windows Update siempre descarga la versión más moderna y con mayor rendimiento que existe.',
        verdad: 'Windows Update prioriza la estabilidad conservadora y certificaciones WHQL antiguas subidas por los fabricantes. Si detecta un driver con fecha diferente en su catálogo, suele sobreescribir el driver nuevo.',
        comprobalo: 'Mirá el historial de Windows Update -> "Actualizaciones de controladores": verás decenas de paquetes instalados sin tu consentimiento explícito.',
      },
    },
    entende: {
      queEs: 'El canal automatizado de distribución de controladores de Microsoft que busca e instala actualizaciones de hardware a través del servicio de Windows Update.',
      paraQueSirve: 'Mantener al 90% de los usuarios comunes con sus dispositivos funcionando sin necesidad de que sepan qué es un archivo INF ni visiten páginas web de fabricantes.',
      quePasaSiFalta: 'El usuario promedio nunca actualizaría los controladores de red o chipset de su equipo, quedando vulnerable a fallas de seguridad.',
    },
    interactua: {
      cliExample: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /v ExcludeWUDriversInQualityUpdate /t REG_DWORD /d 1 /f',
      psExample: 'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" -Name "ExcludeWUDriversInQualityUpdate" -Value 1 -Type DWord',
      syntaxBreakdown: 'La directiva "ExcludeWUDriversInQualityUpdate = 1" (No incluir controladores con las actualizaciones de Windows) bloquea de raíz que Windows Update toque tus drivers de video o sonido.',
      whatToLookFor: 'En gpedit.msc: Plantillas administrativas -> Componentes de Windows -> Windows Update -> "No incluir controladores con las actualizaciones de Windows".',
      technicalMetrics: 'Beneficio: Conservás el 100% del control sobre tus versiones de drivers de alto rendimiento sin sobreescrituras nocturnas sorpresa.',
    },
    alertaEVO: {
      reversibilityRule: 'Reversible cambiando el valor del registro a 0 o "No configurado" en gpedit.msc.',
      safetyWarning: 'Si bloqueás las actualizaciones automáticas de drivers, asumís la responsabilidad técnica de actualizar periódicamente drivers de Wi-Fi y Bluetooth ante vulnerabilidades críticas.',
    },
    evidenceBadge: {
      code: 'WU-DRIVER-POLICY',
      label: 'POLÍTICA DE BLOQUEO WU',
    },
  },
  {
    id: 'sec-15-26',
    code: '15.26',
    title: 'Por qué “más nuevo” no siempre es “mejor”',
    subtitle: 'La ingeniería de la estabilidad: regresiones de latencia DPC, bugs tempranos y el paradigma EVO',
    targetMechanism: 'Driver Regression Analysis / DPC Latency Metrology / Stability Paradigm',
    targetComponent: 'LatencyMon / Ring 0 Interrupt Handlers / Production Stability',
    commandName: 'latencymon.exe / xperf / WPA',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Actualizar compulsivamente cada driver el mismo día que sale es el error número 1 de los usuarios entusiastas: muchas versiones nuevas introducen picos monstruosos de latencia DPC y arruinan la estabilidad.',
      mythVsTruth: {
        mentira: 'Si salió una versión nueva de un driver, es obligatorio instalarla de inmediato porque siempre es superior.',
        verdad: 'Muchos drivers nuevos son versiones preliminares pensadas para dar soporte a un juego nuevo en particular, sacrificando estabilidad o introduciendo fugas de memoria (memory leaks) en escenarios comunes.',
        comprobalo: 'Medí tu sistema con LatencyMon antes y después de una actualización apresurada de driver de audio o GPU: notarás cómo el tiempo de ejecución de DPC puede multiplicarse por 10x.',
      },
    },
    entende: {
      queEs: 'El principio técnico de ingeniería que dicta que la idoneidad de un controlador de kernel se mide por su estabilidad comprobada, latencia de interrupción y ausencia de fallos, no por su número de compilación.',
      paraQueSirve: 'Proteger entornos de producción, servidores, estudios de grabación de audio en tiempo real y estaciones de trabajo de gaming competitivo contra regresiones de software.',
      quePasaSiFalta: 'Los sistemas viven en un estado crónico de inestabilidad, con pantallas azules aleatorias y caídas inexplicables de framerate (frametime spikes).',
    },
    interactua: {
      cliExample: 'rem Uso de LatencyMon para medir ISR/DPC execution time del driver en microsegundos',
      psExample: '# Protocolo EVO: "Si tu sistema está 100% estable, no actualices drivers salvo que necesites una función crítica o un parche de seguridad CVE"',
      syntaxBreakdown: 'Métricas de evaluación: Máxima latencia DPC por debajo de 500 microsegundos (µs); ausencia de eventos WHEA en el visor de eventos; cero cuelgues de TDR en sesiones prolongadas.',
      whatToLookFor: 'Drivers de audio (Realtek) y de red: una versión de hace 2 años perfectamente afinada suele ser infinitamente más estable que la última versión beta subida a internet.',
      technicalMetrics: 'Drivers certificados WHQL Studio / Enterprise: priorizan meses de validación estricta por encima de funciones experimentales rápidas.',
    },
    alertaEVO: {
      reversibilityRule: 'Mantener siempre respaldada la versión de oro (Gold Master Driver) que demostró funcionar a la perfección en tu máquina.',
      safetyWarning: 'La obsesión por los números de versión más altos es una de las mayores causas de formateos innecesarios en la informática moderna.',
    },
    evidenceBadge: {
      code: 'DRIVER-WISDOM',
      label: 'PARADIGMA ESTABILIDAD',
    },
  },
];

export const SECTOR_15_MINICASES: Sector15MiniCase[] = [
  {
    id: 'case-15-01',
    code: 'CASE-15.01',
    title: 'El teclado congelado con Código 19 tras desinstalar un emulador',
    scenario: 'Un usuario desinstaló un emulador de juegos retro que incluía un software de remapeo de botones de joystick. Al reiniciar la PC, ni el teclado integrado de su laptop ni ningún teclado USB que conecta responden. En el Administrador de Dispositivos, la categoría "Teclados" muestra un triángulo amarillo con el mensaje: "Windows no puede iniciar este dispositivo de hardware porque su información de configuración (en el registro) está incompleta o dañada. (Código 19)".',
    userStatement: 'Compré otro teclado USB y tampoco anda. El mouse sí funciona. ¿Por qué Windows no reconoce ningún teclado del mundo?',
    initialMistake: 'Comprar hardware nuevo y no entender que el fallo está en la clave de clase global de teclados en el registro.',
    diagnosticQuestion: '¿Cuál es la causa técnica exacta del Código 19 en todos los teclados y cómo se repara?',
    options: [
      {
        id: 'opt-a',
        text: 'El emulador desinstaló el archivo ntoskrnl.exe del sistema operativo y requiere formatear la computadora por completo.',
        isCorrect: false,
        explanation: 'Falso. Si ntoskrnl.exe faltara, Windows ni siquiera podría arrancar.',
      },
      {
        id: 'opt-b',
        text: 'El desinstalador del emulador borró su archivo .sys de System32 pero dejó el nombre del filtro registrado en la cadena UpperFilters de la clase de teclados {4d36e96b-e325-11ce-bfc1-08002be10318}. Al no encontrar el archivo, Windows rehúsa montar el stack de teclados.',
        isCorrect: true,
        explanation: '¡Exacto! Es el caso canónico de Código 19. El valor UpperFilters quedó huérfano apuntando a un driver inexistente. La solución es abrir regedit, navegar a la clave de clase y dejar en UpperFilters únicamente "kbdclass".',
      },
      {
        id: 'opt-c',
        text: 'La controladora USB de la placa madre se fundió por exceso de consumo eléctrico de los LEDs del teclado.',
        isCorrect: false,
        explanation: 'Falso. El mouse USB funciona con normalidad en los mismos puertos.',
      },
    ],
    technicalVerdict: 'Se eliminó la entrada huérfana de UpperFilters en la clave Class GUID correspondiente. Al reiniciar, el driver nativo kbdclass cargó sin interferencias y los teclados revivieron al 100%.',
    lessonLearned: 'El Código 19 en categorías enteras de hardware es casi siempre sinónimo de filtros UpperFilters/LowerFilters huérfanos dejados por software mal desinstalado.',
  },
  {
    id: 'case-15-02',
    code: 'CASE-15.02',
    title: 'La GPU gamer con Código 43: ¿Driver o silicio frito?',
    scenario: 'Un jugador compró una placa de video usada de alta gama para armar su PC. Al encenderla, Windows carga pero la resolución queda trabada en 1024x768 con artefactos horizontales verdes en la pantalla. En el Administrador de Dispositivos la GPU aparece con: "Windows detuvo este dispositivo porque informó de problemas. (Código 43)". El usuario ya formateó la PC dos veces e instaló 4 versiones distintas de drivers de Nvidia sin éxito.',
    userStatement: 'Ya instalé el driver más nuevo, uno viejo de 2023 y formateé dos veces con Windows 10 y 11. ¿Por qué sigue saliendo Código 43?',
    initialMistake: 'Creer que un fallo repetitivo de Código 43 acompañado de artefactos visuales es un problema que se soluciona instalando más software.',
    diagnosticQuestion: '¿Cuál es el veredicto técnico pericial ante este escenario?',
    options: [
      {
        id: 'opt-a',
        text: 'La placa de video tiene un daño físico irreversible en los módulos de memoria VRAM o fractura de soldaduras BGA debajo del chip gráfico. El controlador oficial no puede inicializar el silicio y activa la detención de emergencia.',
        isCorrect: true,
        explanation: '¡Brillante! El Código 43 tras formateos y con artefactos visuales en el arranque previo a Windows es el síntoma indiscutible de muerte de hardware (falla de VRAM o BGA). No es un problema de software.',
      },
      {
        id: 'opt-b',
        text: 'El cable HDMI está al revés y transmite los paquetes de video con polaridad invertida.',
        isCorrect: false,
        explanation: 'Absurdo. Los cables HDMI no tienen polaridad invertida que genere Código 43.',
      },
      {
        id: 'opt-c',
        text: 'El usuario debe desactivar el antivirus para que la GPU pueda iniciar su reloj interno.',
        isCorrect: false,
        explanation: 'Falso. Los antivirus no interfieren con la inicialización básica del reloj del procesador gráfico.',
      },
    ],
    technicalVerdict: 'Se corroboró mediante software de diagnóstico de VRAM en entorno Linux booteable (MODS/MATS) la presencia de errores masivos de lectura en el canal B0 de memoria GDDR. El componente requiere reemplazo de chip de VRAM por microelectrónica o garantía.',
    lessonLearned: 'Cuando un Código 43 persiste tras una instalación limpia y presenta artefactos en pantalla, insistir con drivers es perder el tiempo: el hardware está roto.',
  },
  {
    id: 'case-15-03',
    code: 'CASE-15.03',
    title: 'El misterio de los FPS que cayeron a la mitad tras una noche de updates',
    scenario: 'Un streamer de eSports tenía su computadora optimizada al milímetro con latencias bajísimas y 300 FPS estables. Una mañana enciende el equipo y nota microtirones (stuttering) insoportables y caídas a 120 FPS. Al revisar la versión del driver de video, nota que ya no tiene la versión que él instaló cuidadosamente, sino una versión genérica con fecha anterior.',
    userStatement: 'Yo jamás toqué nada ni actualicé drivers. ¿Cómo puede ser que mi placa gráfica se haya vuelto a una versión vieja sola mientras dormía?',
    initialMistake: 'No saber que Windows Update tiene habilitada por defecto la directiva de descarga e instalación automática de controladores de hardware en segundo plano.',
    diagnosticQuestion: '¿Cómo debe blindarse el sistema operativo para que Windows Update jamás vuelva a sobreescribir los drivers de video?',
    options: [
      {
        id: 'opt-a',
        text: 'Desinstalar la tarjeta gráfica físicamente y volver a colocarla en otro slot PCIe.',
        isCorrect: false,
        explanation: 'Falso. Cambiar el slot PCIe no altera las políticas de actualización de Windows Update.',
      },
      {
        id: 'opt-b',
        text: 'Habilitar la directiva de grupo (GPO) "No incluir controladores con las actualizaciones de Windows" o configurar el valor DWORD ExcludeWUDriversInQualityUpdate = 1 en HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate.',
        isCorrect: true,
        explanation: '¡Exacto! Esta directiva oficial de Microsoft prohíbe que el motor de Windows Update descargue o sobreescriba paquetes de controladores, preservando intactos los drivers afinados por el usuario.',
      },
      {
        id: 'opt-c',
        text: 'Borrar la carpeta System32 completa para que Windows no tenga dónde guardar las actualizaciones.',
        isCorrect: false,
        explanation: 'Totalmente destructivo. Destruiría el sistema operativo por completo.',
      },
    ],
    technicalVerdict: 'Se aplicó la directiva de exclusión de drivers en Windows Update, se reinstaló la versión oficial de alto rendimiento y se restauraron los 300 FPS estables.',
    lessonLearned: 'En estaciones de trabajo para gaming competitivo o producción audiovisual, desactivar la entrega automática de drivers por Windows Update es mandatorio.',
  },
  {
    id: 'case-15-04',
    code: 'CASE-15.04',
    title: 'El rescate de todos los drivers de una notebook china sin soporte web',
    scenario: 'Un técnico tiene que formatear una notebook importada de una marca genérica sin página web oficial ni sección de descargas. Si formatea la unidad sin respaldar los drivers de antemano, el touchpad, la pantalla táctil, el Wi-Fi y el audio quedarán muertos con Código 28 y no habrá forma humana de encontrarlos en internet.',
    userStatement: 'La marca no tiene página de soporte ni drivers para descargar. Si formateo de cero para sacar los virus, ¿cómo hago para no perder los controladores que están funcionando ahora mismo?',
    initialMistake: 'Formatear sin haber ejecutado una extracción forense nativa de los paquetes instalados en el Driver Store.',
    diagnosticQuestion: '¿Cuál es la instrucción nativa de Windows que permite extraer y clonar en un pendrive todos los drivers de terceros instalados en la máquina en 30 segundos?',
    options: [
      {
        id: 'opt-a',
        text: 'pnputil /export-driver * E:\\BackupDrivers',
        isCorrect: true,
        explanation: '¡Excelente! pnputil.exe con el modificador /export-driver * recorre el Driver Store y exporta cada carpeta completa con sus archivos .inf, .sys, .cat y .dll a la ruta indicada, listos para reinstalarse en un solo clic tras formatear.',
      },
      {
        id: 'opt-b',
        text: 'copy C:\\Windows\\System32\\drivers\\* E:\\Drivers',
        isCorrect: false,
        explanation: 'Falso e inútil: copiar solo los archivos .sys no incluye los archivos .inf ni .cat, por lo que Windows no sabrá cómo instalarlos en el nuevo sistema.',
      },
      {
        id: 'opt-c',
        text: 'msconfig /export-drivers:E:\\',
        isCorrect: false,
        explanation: 'Falso. msconfig es una herramienta de configuración de arranque, no tiene utilidades de exportación de drivers.',
      },
    ],
    technicalVerdict: 'pnputil exportó 48 paquetes OEM en 20 segundos. Luego del formateo limpio con ISO oficial, se ejecutó "pnputil /add-driver E:\\BackupDrivers\\*.inf /subdirs /install" y el 100% del hardware quedó operativo en 1 minuto.',
    lessonLearned: 'pnputil /export-driver * es el salvavidas definitivo de los técnicos e ingenieros ante equipos con soporte de fabricantes desaparecido o precario.',
  },
];

export const SECTOR_15_TEST_BANK: Sector15TestQuestion[] = [
  {
    id: 'q15-01',
    questionNumber: 1,
    category: 'IDENTIFICADORES_PNP_Y_INF',
    question: 'En la cadena de Hardware ID "PCI\\VEN_10DE&DEV_2684&SUBSYS_16541043&REV_A1", ¿qué representa específicamente la sección "VEN_10DE"?',
    options: [
      { id: 'a', text: 'El código de versión del archivo INF del instalador.' },
      { id: 'b', text: 'El Vendor ID (Identificador de fabricante) asignado por el consorcio PCI-SIG, correspondiente en este caso a NVIDIA Corporation.' },
      { id: 'c', text: 'El número de voltaje que consume la tarjeta gráfica.' },
      { id: 'd', text: 'La velocidad de reloj en megahertz del procesador gráfico.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'VEN_10DE es el identificador oficial de 16 bits asignado por el consorcio PCI-SIG a NVIDIA. Cada fabricante de silicio del mundo posee su propio Vendor ID inmutable.',
    relatedInvestigationCode: '15.02',
  },
  {
    id: 'q15-02',
    questionNumber: 2,
    category: 'DEVICE_STACK_Y_ARQUITECTURA',
    question: 'En la pila de dispositivos (Device Stack) de Windows, ¿cuál es el controlador responsable de detectar la presencia física del hardware y crear el Physical Device Object (PDO)?',
    options: [
      { id: 'a', text: 'El Function Driver (FDO).' },
      { id: 'b', text: 'El Bus Driver (ej. pci.sys o usbhub3.sys).' },
      { id: 'c', text: 'El Upper Filter Driver.' },
      { id: 'd', text: 'El Explorador de archivos de Windows.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El Bus Driver gobierna el bus físico (PCI Express, USB, I2C). Detecta la conexión eléctrica del hardware, le asigna recursos y crea el PDO sobre el cual se apilarán los demás controladores.',
    relatedInvestigationCode: '15.10',
  },
  {
    id: 'q15-03',
    questionNumber: 3,
    category: 'CODIGOS_ERROR_DEVICE_MANAGER',
    question: '¿Qué causa típicamente el Código de Error 19 en el Administrador de Dispositivos ("La información de configuración en el registro está incompleta o dañada")?',
    options: [
      { id: 'a', text: 'Un cable de alimentación desconectado dentro de la fuente de poder.' },
      { id: 'b', text: 'La presencia de controladores de filtro huérfanos en los valores UpperFilters o LowerFilters de la clave de clase del registro, apuntando a binarios .sys que ya no existen en el disco.' },
      { id: 'c', text: 'Una sobrecarga de temperatura en la memoria RAM.' },
      { id: 'd', text: 'La falta de conexión a internet para validar la licencia de Windows.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El Código 19 se dispara cuando el subsistema PnP intenta armar la cadena de controladores definida en la subclave Class GUID del registro, pero uno de los filtros declarados en UpperFilters o LowerFilters fue borrado del disco.',
    relatedInvestigationCode: '15.15',
  },
  {
    id: 'q15-04',
    questionNumber: 4,
    category: 'HERRAMIENTAS_Y_GESTION_DRIVERS',
    question: '¿Cuál es el comando oficial de Windows para respaldar todos los paquetes de controladores de terceros instalados en una carpeta externa sin software de terceros?',
    options: [
      { id: 'a', text: 'driverquery /export C:\\Drivers' },
      { id: 'b', text: 'pnputil /export-driver * C:\\DriversBackup' },
      { id: 'c', text: 'xcopy C:\\Windows\\System32\\drivers C:\\DriversBackup' },
      { id: 'd', text: 'backup-drivers -All -Path C:\\Drivers' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'pnputil /export-driver * <Directorio> extrae todos los paquetes de controladores de terceros (oemXX.inf) con sus binarios, firmas y catálogos completos listos para su reutilización.',
    relatedInvestigationCode: '15.23',
  },
  {
    id: 'q15-05',
    questionNumber: 5,
    category: 'CODIGOS_ERROR_DEVICE_MANAGER',
    question: '¿Qué significa el Código de Error 28 en un componente en el Administrador de Dispositivos?',
    options: [
      { id: 'a', text: 'El hardware está roto físicamente y no tiene reparación.' },
      { id: 'b', text: 'No hay ningún controlador compatible instalado en el Driver Store para ese Hardware ID ("Los controladores para este dispositivo no están instalados").' },
      { id: 'c', text: 'El dispositivo está bloqueado por el cortafuegos de Windows Defender.' },
      { id: 'd', text: 'El hardware no tiene suficiente energía eléctrica en el bus.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El Código 28 es el estado de "Dispositivo desconocido": el hardware fue detectado pero Windows no tiene en su repositorio local ningún archivo INF que coincida con sus IDs.',
    relatedInvestigationCode: '15.16',
  },
  {
    id: 'q15-06',
    questionNumber: 6,
    category: 'DEVICE_STACK_Y_ARQUITECTURA',
    question: '¿En qué espacio de privilegios de la CPU se ejecutan los controladores de kernel con extensión .sys?',
    options: [
      { id: 'a', text: 'Ring 3 (Modo usuario aislado).' },
      { id: 'b', text: 'Ring 0 (Modo kernel con acceso total a memoria e instrucciones privilegiadas de CPU).' },
      { id: 'c', text: 'En la memoria caché L1 del procesador únicamente.' },
      { id: 'd', text: 'En el firmware del BIOS antes del arranque del sistema operativo.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Los controladores .sys se ejecutan en Ring 0 (Modo Kernel), compartiendo el espacio de memoria con el núcleo del sistema operativo. Por esta razón, un error de puntero en un .sys genera una pantalla azul (BSOD).',
    relatedInvestigationCode: '15.07',
  },
  {
    id: 'q15-07',
    questionNumber: 7,
    category: 'CODIGOS_ERROR_DEVICE_MANAGER',
    question: 'Si una tarjeta de video presenta artefactos en pantalla desde el encendido y el Administrador de Dispositivos reporta Código 43 incluso tras formatear, ¿cuál es el diagnóstico más certero?',
    options: [
      { id: 'a', text: 'Fallo físico irreparable a nivel de silicio (memoria VRAM dañada o soldaduras BGA fracturadas).' },
      { id: 'b', text: 'Conflicto de software con la versión de DirectX instalada.' },
      { id: 'c', text: 'Falta de activación de la licencia de Windows.' },
      { id: 'd', text: 'El monitor necesita una actualización de firmware por cable DisplayPort.' },
    ],
    correctOptionId: 'a',
    technicalExplanation: 'El Código 43 con artefactos visuales desde el arranque previo al sistema operativo denota un fallo irreversible en el hardware del procesador gráfico o en los módulos de memoria VRAM.',
    relatedInvestigationCode: '15.18',
  },
  {
    id: 'q15-08',
    questionNumber: 8,
    category: 'IDENTIFICADORES_PNP_Y_INF',
    question: '¿Qué función cumple el archivo con extensión .CAT en un paquete de controladores certificado?',
    options: [
      { id: 'a', text: 'Contiene las imágenes e iconos que se muestran en el Panel de Control.' },
      { id: 'b', text: 'Es el catálogo de seguridad criptográfico que contiene las firmas digitales WHQL de Microsoft y los hashes inmutables de los archivos del paquete.' },
      { id: 'c', text: 'Es un script de desinstalación automática programado en lenguaje C++.' },
      { id: 'd', text: 'Comprime los archivos del driver en formato ZIP de alta densidad.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El archivo .cat contiene la firma criptográfica WHQL validada por Microsoft. Permite al kernel de Windows comprobar que ningún binario fue modificado por malware o corrupción.',
    relatedInvestigationCode: '15.08',
  },
  {
    id: 'q15-09',
    questionNumber: 9,
    category: 'HERRAMIENTAS_Y_GESTION_DRIVERS',
    question: '¿Qué valor del registro en HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate bloquea que Windows Update sobreescriba los drivers del sistema?',
    options: [
      { id: 'a', text: 'DisableDriversAlways = 1' },
      { id: 'b', text: 'ExcludeWUDriversInQualityUpdate = 1' },
      { id: 'c', text: 'NoMoreUpdatesPlease = 1' },
      { id: 'd', text: 'StopHardwareScans = 1' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'ExcludeWUDriversInQualityUpdate con valor 1 es la directiva canónica de Windows para prohibir la inclusión de controladores en las actualizaciones de calidad de Windows Update.',
    relatedInvestigationCode: '15.25',
  },
  {
    id: 'q15-10',
    questionNumber: 10,
    category: 'DEVICE_STACK_Y_ARQUITECTURA',
    question: 'Desde la perspectiva de la metrología del rendimiento (EVO Labs), ¿por qué instalar compulsivamente la última versión de un driver de audio o GPU puede ser contraproducente?',
    options: [
      { id: 'a', text: 'Porque las versiones nuevas siempre ocupan más de 50 GB de espacio en disco.' },
      { id: 'b', text: 'Porque pueden introducir regresiones graves de latencia DPC (Deferred Procedure Call), provocando stuttering y cortes en audio en tiempo real y juegos competitivos.' },
      { id: 'c', text: 'Porque Windows 11 no admite drivers creados después de 2024.' },
      { id: 'd', text: 'Porque reduce la frecuencia de la memoria RAM del sistema a la mitad.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Las rutinas DPC de drivers inmaduros o mal depurados pueden bloquear los núcleos de la CPU en Ring 0 durante cientos de microsegundos, degradando el frametime y provocando cortes de audio.',
    relatedInvestigationCode: '15.26',
  },
];
