// ============================================================================
// EVO LABS // TOMO 02: MATRIX LAB
// WINDOWS SERVICES TELEMETRY DATA & DEPENDENCY ARCHITECTURE
// Simulated and Real-PC Dual Engine Data Model
// ============================================================================

import { WindowsServiceItem } from '../engine/types';

export interface ServiceDependencyNode {
  id: string;
  name: string;
  role: string;
  isParent: boolean;
  isActive: boolean;
  childrenIds: string[];
}

export const WINDOWS_SERVICES_DATABASE: WindowsServiceItem[] = [
  {
    id: 'svc-audiosrv',
    serviceName: 'Audiosrv',
    displayName: 'Audio de Windows',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 1420,
    account: 'LocalService',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k LocalServiceNetworkRestricted',
    dependencies: ['AudioEndpointBuilder', 'RpcSs'],
    dependents: ['Aplicaciones Win32', 'Navegadores', 'Juegos DirectX', 'Discord'],
    subsystemRole: 'Administrador central de flujos de audio y dispositivos de sonido para todas las aplicaciones.',
    simpleExplanation: 'Es el servicio que hace que salga sonido por tus parlantes o auriculares. Si lo apagás, la computadora queda muda.',
    functionalRisk: 'ALTO',
    functionalTestType: 'audio',
    telemetryImpact: {
      ramDeltaMb: -38,
      cpuDeltaPercent: -0.2,
      lostFunctionality: 'Sonido del sistema deshabilitado. Todas las apps reportan error "No audio output device found".',
      potentialSideEffect: 'Juegos y reproductores de video se congelan o fallan al intentar inicializar el endpoint de audio.'
    }
  },
  {
    id: 'svc-audioendpointbuilder',
    serviceName: 'AudioEndpointBuilder',
    displayName: 'Compilador de extremos de audio de Windows',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 1420,
    account: 'LocalSystem',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k LocalSystemNetworkRestricted',
    dependencies: ['RpcSs'],
    dependents: ['Audiosrv (Audio de Windows)'],
    subsystemRole: 'Enumera conectores jack de 3.5mm, dispositivos HDMI/DisplayPort y DACs USB para crear puntos finales de audio.',
    simpleExplanation: 'Detecta cuando conectás o desconectás auriculares o parlantes en la computadora.',
    functionalRisk: 'CRÍTICO',
    functionalTestType: 'audio',
    telemetryImpact: {
      ramDeltaMb: -18,
      cpuDeltaPercent: -0.1,
      lostFunctionality: 'Windows no detecta cuando enchufás auriculares o parlantes. Audiosrv entra en cascada de error.',
      potentialSideEffect: 'El icono de la barra de tareas muestra una X roja permanente.'
    }
  },
  {
    id: 'svc-dnscache',
    serviceName: 'Dnscache',
    displayName: 'Cliente DNS',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 960,
    account: 'NetworkService',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k NetworkService',
    dependencies: ['nsi'],
    dependents: ['Navegadores web', 'Discord', 'Steam', 'Windows Update', 'Servicios de red'],
    subsystemRole: 'Resuelve nombres de dominio en direcciones IP numéricas y mantiene una caché local para acelerar la navegación.',
    simpleExplanation: 'Es la guía telefónica de internet: traduce "google.com" al número IP que entiende la red.',
    functionalRisk: 'CRÍTICO',
    functionalTestType: 'network',
    telemetryImpact: {
      ramDeltaMb: -24,
      cpuDeltaPercent: -0.1,
      lostFunctionality: 'Navegación web imposible por nombre de dominio. Los programas no pueden conectar a internet.',
      potentialSideEffect: 'Pérdida inmediata de conectividad en toda la máquina (el icono de red muestra "Sin internet").'
    }
  },
  {
    id: 'svc-dhcp',
    serviceName: 'Dhcp',
    displayName: 'Cliente DHCP',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 960,
    account: 'LocalService',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k LocalServiceNetworkRestricted',
    dependencies: ['nsi', 'Afd', 'NetBT'],
    dependents: ['Toda la pila de red IP del sistema'],
    subsystemRole: 'Negocia y renueva automáticamente la dirección IP local de la computadora con el router o módem.',
    simpleExplanation: 'Pide permiso al router de tu casa para que le dé una dirección a tu PC para poder navegar.',
    functionalRisk: 'CRÍTICO',
    functionalTestType: 'network',
    telemetryImpact: {
      ramDeltaMb: -16,
      cpuDeltaPercent: -0.05,
      lostFunctionality: 'La computadora no recibe dirección IP del router y queda aislada con IP automática 169.254.x.x.',
      potentialSideEffect: 'Desconexión total de la red local y de internet.'
    }
  },
  {
    id: 'svc-wsearch',
    serviceName: 'WSearch',
    displayName: 'Windows Search',
    state: 'RUNNING',
    startupType: 'Automatic (Delayed)',
    pid: 2480,
    account: 'LocalSystem',
    binaryPath: 'C:\\Windows\\System32\\SearchIndexer.exe /Embedding',
    dependencies: ['RpcSs'],
    dependents: ['Búsqueda de Menú Inicio', 'Explorador de Archivos', 'Microsoft Outlook'],
    subsystemRole: 'Mantiene el índice de búsqueda de archivos, propiedades de documentos y aplicaciones del Menú Inicio.',
    simpleExplanation: 'Lee en silencio los nombres de tus archivos para que cuando escribas en el menú inicio aparezcan al instante.',
    functionalRisk: 'MEDIO',
    functionalTestType: 'search',
    telemetryImpact: {
      ramDeltaMb: -85,
      cpuDeltaPercent: -0.8,
      lostFunctionality: 'La búsqueda del Menú Inicio se vuelve muy lenta y requiere buscar archivo por archivo en el disco.',
      potentialSideEffect: 'Pérdida de indización instantánea en Outlook y carpetas del Explorador.'
    }
  },
  {
    id: 'svc-sysmain',
    serviceName: 'SysMain',
    displayName: 'SysMain (Superfetch)',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 1812,
    account: 'LocalSystem',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k LocalSystemNetworkRestricted',
    dependencies: ['RpcSs'],
    dependents: ['Prefetcher del Kernel', 'Standby Memory Cache'],
    subsystemRole: 'Pre-carga en memoria RAM libre los ejecutables y librerías que abrís con más frecuencia.',
    simpleExplanation: 'Aprovecha la memoria RAM que está vacía para precargar tus programas habituales y abrirlos más rápido.',
    functionalRisk: 'BAJO',
    telemetryImpact: {
      ramDeltaMb: -120,
      cpuDeltaPercent: -0.4,
      lostFunctionality: 'Elimina la precarga anticipada en memoria Standby. En discos HDD mecánicos empeora el tiempo de carga.',
      potentialSideEffect: 'En SSDs NVMe modernos el impacto es neutro o ligeramente beneficioso para la estabilidad de escrituras.'
    }
  },
  {
    id: 'svc-spooler',
    serviceName: 'Spooler',
    displayName: 'Cola de impresión (Print Spooler)',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 1940,
    account: 'LocalSystem',
    binaryPath: 'C:\\Windows\\System32\\spoolsv.exe',
    dependencies: ['RpcSs', 'http'],
    dependents: ['Impresoras físicas', 'Microsoft Print to PDF', 'Exportador PDF de Chrome'],
    subsystemRole: 'Almacena en cola temporal los trabajos de impresión enviados por los programas.',
    simpleExplanation: 'Permite enviar hojas a imprimir sin que el programa tenga que quedarse congelado esperando a la impresora.',
    functionalRisk: 'BAJO',
    functionalTestType: 'print',
    telemetryImpact: {
      ramDeltaMb: -18,
      cpuDeltaPercent: -0.05,
      lostFunctionality: 'Imposible imprimir o guardar como "Microsoft Print to PDF" desde cualquier aplicación.',
      potentialSideEffect: 'Los cuadros de diálogo de impresión arrojan error "El servicio de cola de impresión no está ejecutándose".'
    }
  },
  {
    id: 'svc-wuauserv',
    serviceName: 'wuauserv',
    displayName: 'Windows Update',
    state: 'RUNNING',
    startupType: 'Automatic (Delayed)',
    pid: 3120,
    account: 'LocalSystem',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k netsvcs -p',
    dependencies: ['RpcSs'],
    dependents: ['Microsoft Store', 'Windows Defender Update', 'Instalación de características opcionales'],
    subsystemRole: 'Comprueba, descarga e instala parches de seguridad acumulativos y controladores oficiales.',
    simpleExplanation: 'Mantiene Windows protegido descargando las actualizaciones mensuales de Microsoft.',
    functionalRisk: 'MEDIO',
    functionalTestType: 'update',
    telemetryImpact: {
      ramDeltaMb: -65,
      cpuDeltaPercent: -0.6,
      lostFunctionality: 'Microsoft Store no puede instalar ni actualizar aplicaciones. No se descargan parches de seguridad.',
      potentialSideEffect: 'Vulnerabilidades conocidas quedan sin mitigar a lo largo del tiempo.'
    }
  },
  {
    id: 'svc-windefend',
    serviceName: 'WinDefend',
    displayName: 'Servicio Antivirus de Microsoft Defender',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 3880,
    account: 'LocalSystem',
    binaryPath: 'C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\...\\MsMpEng.exe',
    dependencies: ['RpcSs'],
    dependents: ['Seguridad de Windows', 'WdFilter Minifilter', 'SmartScreen'],
    subsystemRole: 'Motor de análisis de firmas y protección heurística en tiempo real en memoria y almacenamiento.',
    simpleExplanation: 'Es el escudo antivirus que vigila cada programa o descarga para que no infecte tu sistema.',
    functionalRisk: 'CRÍTICO',
    telemetryImpact: {
      ramDeltaMb: -160,
      cpuDeltaPercent: -1.2,
      lostFunctionality: 'El sistema queda completamente desprotegido contra malware, ransomware y ejecutables maliciosos.',
      potentialSideEffect: 'El Centro de Seguridad muestra alertas rojas continuas y desactiva la protección de red.'
    }
  },
  {
    id: 'svc-eventlog',
    serviceName: 'EventLog',
    displayName: 'Registro de eventos de Windows',
    state: 'RUNNING',
    startupType: 'Automatic',
    pid: 960,
    account: 'LocalService',
    binaryPath: 'C:\\Windows\\System32\\svchost.exe -k LocalServiceNetworkRestricted',
    dependencies: ['RpcSs'],
    dependents: ['Visor de Eventos', 'Monitor de Confiabilidad', 'Diagnóstico del Kernel', 'Auditoría Forense'],
    subsystemRole: 'Recopila y almacena en archivos .evtx todos los sucesos del sistema, advertencias y caídas BSOD.',
    simpleExplanation: 'Es la caja negra de Windows: anota todo lo que pasa en la computadora por si algo se rompe.',
    functionalRisk: 'CRÍTICO',
    telemetryImpact: {
      ramDeltaMb: -32,
      cpuDeltaPercent: -0.1,
      lostFunctionality: 'El Visor de Eventos no puede abrir registros. Ningún técnico puede diagnosticar qué causó una pantalla azul.',
      potentialSideEffect: 'Imposibilidad total de realizar auditoría forense determinista.'
    }
  }
];

export const AUDIO_DEPENDENCY_NODES: ServiceDependencyNode[] = [
  {
    id: 'node-driver',
    name: 'Hardware de Audio / Driver Realtek (RTKVHD64.sys)',
    role: 'Controlador de Anillo 0',
    isParent: true,
    isActive: true,
    childrenIds: ['node-endpoint']
  },
  {
    id: 'node-endpoint',
    name: 'AudioEndpointBuilder (Compilador de extremos)',
    role: 'Servicio de Sesión 0',
    isParent: false,
    isActive: true,
    childrenIds: ['node-audiosrv']
  },
  {
    id: 'node-audiosrv',
    name: 'Audiosrv (Audio de Windows)',
    role: 'Servicio Maestro de Sesión 0',
    isParent: false,
    isActive: true,
    childrenIds: ['node-mmdevice']
  },
  {
    id: 'node-mmdevice',
    name: 'MMDeviceAPI & Audio Engine',
    role: 'Subsistema de Mezcla de Audio Win32',
    isParent: false,
    isActive: true,
    childrenIds: ['node-apps']
  },
  {
    id: 'node-apps',
    name: 'Aplicaciones de Usuario (Juegos / Chrome / Spotify / Discord)',
    role: 'Clientes de Audio en Modo Usuario (Sesión 1)',
    isParent: false,
    isActive: true,
    childrenIds: []
  }
];
