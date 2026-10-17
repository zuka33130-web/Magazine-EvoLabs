// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 16: IMPRESORAS, USB, BLUETOOTH Y PERIFÉRICOS // TODO LO QUE ENCHUFÁS PUEDE FALLAR

export type RiskLevelSector16 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector16Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector16;
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

export interface Sector16MiniCase {
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

export interface Sector16TestQuestion {
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
  relatedInvestigationCode: string;
}

export const SECTOR_16_INVESTIGATIONS: Sector16Investigation[] = [
  {
    id: 'inv-16-01',
    code: '16.01',
    title: 'Instalar impresora USB',
    subtitle: 'La magia y los límites del PnP en impresión local',
    targetMechanism: 'USB Printing Support & Port Enumeration',
    targetComponent: 'usbprint.sys / spoolsv.exe',
    commandName: 'Get-Printer | Where-Object PortName -like "USB*"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Enchufás una impresora por USB, Windows hace el sonido característico, pero al darle "Imprimir" el documento desaparece en el éter sin salir por la bandeja.',
      mythVsTruth: {
        mentira: 'Windows instala automáticamente cualquier impresora USB sin necesidad de configuración adicional ni controladores dedicados.',
        verdad: 'Windows carga el driver de transporte usbprint.sys que crea un puerto lógico USB001, pero si no encuentra un INF con el Device ID exacto, asigna un driver genérico incapaz de comunicarse con el procesador de rasterizado de la impresora.',
        comprobalo: 'Abrí PowerShell y ejecutá Get-PrinterPort | Where-Object Name -like "USB*" para verificar si el puerto lógico está vinculado a un dispositivo vivo.',
      },
    },
    entende: {
      queEs: 'El protocolo por el cual el subsistema USB asigna la clase 07h (Printers) a usbprint.sys, creando un puerto virtual USB00x que el Print Spooler puede usar como destino de datos RAW.',
      paraQueSirve: 'Canaliza los flujos de impresión binarios (PCL, PostScript o EMF) desde las colas del Spooler hacia la interfaz endpoint física del cable USB.',
      quePasaSiFalta: 'Si usbprint.sys no se asocia al Hardware ID, la impresora queda en Administrador de Dispositivos con Código 28 ("Controlador no instalado") o en "Otros dispositivos".',
    },
    interactua: {
      cliExample: 'pnputil /enum-devices /class Printer',
      psExample: 'Get-Printer | Select-Object Name, PortName, DriverName, PrinterStatus',
      syntaxBreakdown: 'Get-Printer lista todas las colas lógicas instaladas, su puerto de enlace y el estado de comunicación actual.',
      whatToLookFor: 'Puerto USB001 o USB002 con PrinterStatus en "Normal" en lugar de "Error" o "Offline".',
      technicalMetrics: 'Latencia de enumeración USB < 150 ms; Endpoint BULK OUT 64 bytes/paquete (USB 2.0).',
    },
    alertaEVO: {
      reversibilityRule: 'Desconectar y reconectar en un puerto USB distinto recreará el puerto lógico (USB002), dejando huérfano el USB001 en la cola antigua.',
      safetyWarning: 'Evitá usar hubs USB sin alimentación externa para impresoras multifunción; las caídas de tensión corrompen paquetes a mitad del spooling.',
    },
    evidenceBadge: {
      code: 'USBPRINT',
      label: 'USB 07h CLASS',
    },
  },
  {
    id: 'inv-16-02',
    code: '16.02',
    title: 'Impresora Wi-Fi',
    subtitle: 'El infierno de WSD y las IPs dinámicas',
    targetMechanism: 'Web Services for Devices (WSD) vs Standard TCP/IP',
    targetComponent: 'wsdprint.sys / WSD Port Monitor',
    commandName: 'Get-PrinterPort | Where-Object Description -like "*WSD*"',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Ayer la impresora Wi-Fi imprimía perfecto; hoy prendés la máquina y Windows dice "Impresora sin conexión", aunque la impresora tiene luz azul fija y está en la red.',
      mythVsTruth: {
        mentira: 'WSD es la mejor forma de conectar una impresora de red moderna porque no requiere configurar nada.',
        verdad: 'El protocolo WSD de Microsoft depende de anuncios multicasting UDP (puerto 3702). Si el router bloquea multicast o cambia la IP por DHCP, el monitor WSD pierde el enlace y marca la impresora offline indefinidamente.',
        comprobalo: 'Fijate en las Propiedades de Impresora -> pestaña Puertos: si el puerto empieza con "WSD-", estás sufriendo la volatilidad de descubrimiento multicast.',
      },
    },
    entende: {
      queEs: 'WSD (Web Services for Devices) es un protocolo plug-and-play de red basado en SOAP y WS-Discovery para detectar periféricos sin configurar una dirección IP estática.',
      paraQueSirve: 'Permite que usuarios no técnicos descubran impresoras en la red local con un solo clic en la interfaz de Configuración.',
      quePasaSiFalta: 'Si se prescinde de WSD y se usa un puerto TCP/IP Estándar con IP fija, la estabilidad aumenta un 99%, eliminando para siempre el estado offline fantasma.',
    },
    interactua: {
      cliExample: 'netsh advfirewall firewall show rule name="Web Services on Devices (WSD-In)"',
      psExample: 'Get-PnpDevice -Class PrintQueue | Where-Object Status -ne "OK"',
      syntaxBreakdown: 'Verifica si los puertos del firewall para WS-Discovery están bloqueando los anuncios UDP 3702.',
      whatToLookFor: 'Reglas de firewall habilitadas para WSD en el perfil de red Privado.',
      technicalMetrics: 'Pérdida de paquetes multicast UDP > 0% provoca estado Offline en menos de 5 minutos.',
    },
    alertaEVO: {
      reversibilityRule: 'Cambiar el puerto de WSD a TCP/IP estándar requiere fijar la IP en la impresora mediante reserva DHCP en el router.',
      safetyWarning: 'No desactives el servicio de Detección SSDP si dependés de escaneo de red por WSD.',
    },
    evidenceBadge: {
      code: 'WSD_PORT',
      label: 'WS-DISCOVERY',
    },
  },
  {
    id: 'inv-16-03',
    code: '16.03',
    title: 'Impresora Ethernet',
    subtitle: 'La roca corporativa: RAW 9100 y LPR',
    targetMechanism: 'Standard TCP/IP Port Monitor & AppSocket',
    targetComponent: 'tcpmon.dll / Port 9100 RAW',
    commandName: 'Test-NetConnection -ComputerName <IP> -Port 9100',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'En empresas con 50 puestos nadie usa Wi-Fi ni USB: las impresoras tienen un cable RJ45 directo al switch y no fallan en años. ¿Cuál es el secreto?',
      mythVsTruth: {
        mentira: 'Una impresora cableada usa el mismo sistema que una Wi-Fi.',
        verdad: 'Las impresoras Ethernet corporativas usan el monitor estándar TCP/IP de Windows con el protocolo RAW en el puerto TCP 9100 (HP JetDirect / AppSocket), que establece un socket directo y bidireccional punto a punto con IP fija.',
        comprobalo: 'Hacé Test-NetConnection -Port 9100 hacia la IP de la impresora: si TcpTestSucceeded es True, la comunicación física y de transporte es perfecta.',
      },
    },
    entende: {
      queEs: 'La arquitectura de puerto TCP/IP estándar de Windows (`tcpmon.dll`), que envía flujos directos mediante sockets TCP sin intermediarios de descubrimiento.',
      paraQueSirve: 'Garantiza que la cola de impresión se comunique con una dirección IP y un socket específicos, inmune a caídas de Wi-Fi, cortes de radio o interferencias.',
      quePasaSiFalta: 'Si el puerto 9100 está cerrado por un firewall o un switch gestionado, la cola acumula trabajos hasta que el Spooler colapsa.',
    },
    interactua: {
      cliExample: 'ping 192.168.1.200 -t',
      psExample: 'Test-NetConnection -ComputerName 192.168.1.200 -Port 9100',
      syntaxBreakdown: 'Test-NetConnection comprueba el handshake TCP de 3 vías (SYN/ACK) contra el daemon AppSocket de la placa de red de la impresora.',
      whatToLookFor: 'TcpTestSucceeded : True y latencia menor a 2 ms en LAN.',
      technicalMetrics: 'Throughput de interfaz Ethernet 100BASE-TX; buffer de recepción de impresora 16-64 MB.',
    },
    alertaEVO: {
      reversibilityRule: 'Revertir a DHCP en la impresora provocará que el puerto TCP/IP pierda el destino si la concesión cambia.',
      safetyWarning: 'Asigná siempre la IP fuera del rango dinámico del servidor DHCP para evitar colisiones de IP con otros dispositivos de la red.',
    },
    evidenceBadge: {
      code: 'RAW9100',
      label: 'TCP/IP RAW 9100',
    },
  },
  {
    id: 'inv-16-04',
    code: '16.04',
    title: 'Print Spooler',
    subtitle: 'El servicio más antiguo y vulnerable del Ring 3 de Windows',
    targetMechanism: 'Spooler Subsystem Architecture & RPC Interface',
    targetComponent: 'spoolsv.exe / spoolss.dll',
    commandName: 'Get-Service Spooler',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'El Print Spooler fue diseñado en los días de Windows NT 3.1 y todavía hoy, si crashea, ninguna aplicación puede generar un PDF ni imprimir una factura.',
      mythVsTruth: {
        mentira: 'El Spooler solo sirve para enviar papel a la impresora física.',
        verdad: 'El Spooler maneja TODA la canalización de documentos, incluyendo Microsoft Print to PDF, controladores virtuales XPS, y la generación de vistas previas de impresión en navegadores y Office.',
        comprobalo: 'Detené el servicio con Stop-Service Spooler y abrí Chrome o Word: el botón "Imprimir" arrojará un error de sistema de inmediato.',
      },
    },
    entende: {
      queEs: '`spoolsv.exe` es el servicio de Windows que recibe llamadas GDI/DirectWrite, las convierte en archivos temporales `.SHD` (Shadow) y `.SPL` (Spool), y las despacha al Print Processor.',
      paraQueSirve: 'Desacopla la aplicación del hardware: la app envía el trabajo en milisegundos y se desentiende, mientras el Spooler entrega los datos a la velocidad del motor de impresión.',
      quePasaSiFalta: 'Cualquier fallo en una DLL de un driver de terceros (v3) dentro del proceso de `spoolsv.exe` tira abajo el servicio para todas las impresoras del sistema.',
    },
    interactua: {
      cliExample: 'sc query spooler',
      psExample: 'Get-Process spoolsv | Select-Object Id, Handles, WS, CPU',
      syntaxBreakdown: 'Audita el consumo de memoria y handles del servicio Spooler para detectar fugas de recursos por drivers defectuosos.',
      whatToLookFor: 'Handles < 800 y memoria de trabajo (WS) < 50 MB en reposo.',
      technicalMetrics: 'Tiempo de reinicio de servicio < 1.5 s; directorio de trabajo C:\\Windows\\System32\\spool\\PRINTERS.',
    },
    alertaEVO: {
      reversibilityRule: 'Reiniciar el Spooler restaura la cola sin reiniciar Windows.',
      safetyWarning: 'Vulnerabilidades históricas como PrintNightmare (CVE-2021-34527) exigen mantener aislados los drivers con el modelo V4 aislado de proceso.',
    },
    evidenceBadge: {
      code: 'SPOOLSV',
      label: 'SPOOLSS.DLL',
    },
  },
  {
    id: 'inv-16-05',
    code: '16.05',
    title: 'Cola bloqueada',
    subtitle: 'La anatomía de los archivos .SHD y .SPL huérfanos',
    targetMechanism: 'Spool File Deadlock & Corruption',
    targetComponent: 'C:\\Windows\\System32\\spool\\PRINTERS',
    commandName: 'Get-ChildItem C:\\Windows\\System32\\spool\\PRINTERS',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'Le diste "Cancelar documento" hace media hora y la cola sigue diciendo "Eliminando..." con el icono clavado en la barra de tareas. ¿Por qué Windows no lo borra?',
      mythVsTruth: {
        mentira: 'Windows está esperando que la impresora termine de vaciar su memoria interna.',
        verdad: 'El archivo .SPL está bloqueado con un handle abierto por el driver o un subproceso colgado. Mientras el archivo esté en uso por el kernel o spoolsv, el sistema de archivos NTFS prohíbe su eliminación física.',
        comprobalo: 'Navegá con permisos de administrador a C:\\Windows\\System32\\spool\\PRINTERS: verás los pares de archivos .SHD (metadatos) y .SPL (binario) que impiden que otros trabajos avancen.',
      },
    },
    entende: {
      queEs: 'Un estado de deadlock en el cual el Spooler no puede ni completar la transmisión al puerto ni liberar el lock de archivo para borrar los temporales.',
      paraQueSirve: 'Conocer este mecanismo permite ejecutar el protocolo canónico de desbloqueo: detener el servicio, purgar los archivos del directorio spool y reiniciar el servicio.',
      quePasaSiFalta: 'Sin una intervención quirúrgica en PRINTERS, la cola queda congelada de por vida, bloqueando todos los documentos posteriores de todos los usuarios.',
    },
    interactua: {
      cliExample: 'net stop spooler && del /Q /F C:\\Windows\\System32\\spool\\PRINTERS\\* && net start spooler',
      psExample: 'Stop-Service Spooler; Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\* -Force; Start-Service Spooler',
      syntaxBreakdown: 'Comando trifásico canónico: apaga el proceso para liberar handles NTFS, purga archivos corruptos y levanta el servicio limpio.',
      whatToLookFor: 'Directorio PRINTERS con 0 archivos y cola de impresión vacía en estado "0 documentos pendientes".',
      technicalMetrics: 'Eliminación forzada sin requerir reinicio del sistema operativo.',
    },
    alertaEVO: {
      reversibilityRule: 'Los documentos en la cola se perderán permanentemente y deberán ser reenviados desde la aplicación.',
      safetyWarning: 'Asegurate de detener el servicio antes de intentar borrar los archivos, de lo contrario recibirás error de "Acceso denegado" por bloqueo de handle.',
    },
    evidenceBadge: {
      code: 'DEADLOCK',
      label: 'SHD / SPL FLUSH',
    },
  },
  {
    id: 'inv-16-06',
    code: '16.06',
    title: 'Printer offline',
    subtitle: 'SNMP Status y detección de presencia por hardware',
    targetMechanism: 'SNMP Community & Bidi Status Queries',
    targetComponent: 'snmp.dll / Port Monitor Bidirectional Protocol',
    commandName: 'Get-PrinterProperty -PrinterName <Name>',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'La impresora responde al ping perfectamente, pero Windows insiste en que está "Sin conexión" (Offline) y rechaza enviar los trabajos a la cola.',
      mythVsTruth: {
        mentira: 'Windows usa comandos ICMP ping para saber si una impresora está online.',
        verdad: 'Windows interroga el agente SNMP de la impresora en el puerto UDP 161 buscando el estado del dispositivo. Si la comunidad SNMP configurada no coincide con "public" o el router descarta paquetes SNMP, Windows asume que la impresora está apagada.',
        comprobalo: 'En las propiedades del puerto TCP/IP, desmarcá la casilla "Estado SNMP habilitado": verás que la impresora pasa instantáneamente a estado Online.',
      },
    },
    entende: {
      queEs: 'El protocolo SNMP (Simple Network Management Protocol) empleado por el monitor de puertos de Windows para censar el estado de bandejas, tóner y errores de papel en vivo.',
      paraQueSirve: 'Muestra alertas enriquecidas como "Tóner bajo" o "Papel atascado" directamente en las notificaciones del escritorio.',
      quePasaSiFalta: 'Si SNMP falla o la impresora no implementa la RFC 1759 (Printer MIB) correctamente, causa falsos positivos de desconexión continua.',
    },
    interactua: {
      cliExample: 'cscript C:\\Windows\\System32\\Printing_Admin_Scripts\\es-ES\\prnport.vbs -l',
      psExample: 'Get-PrinterPort | Select-Object Name, HostAddress, SNMPEnabled, SNMPCommunity',
      syntaxBreakdown: 'Inspecciona la configuración del puerto TCP/IP para verificar si SNMPEnabled está en True y cuál es el community name.',
      whatToLookFor: 'SNMPEnabled : False para entornos problemáticos donde el firmware de la impresora no responde consultas MIB.',
      technicalMetrics: 'Timeout de consulta SNMP en Windows: 3 reintentos x 1000 ms antes de marcar Offline.',
    },
    alertaEVO: {
      reversibilityRule: 'Deshabilitar SNMP elimina las alertas de nivel de tinta pero devuelve la capacidad de impresión inmediata.',
      safetyWarning: 'No cambies la dirección IP del puerto sin antes verificar que no haya trabajos pendientes en la cola.',
    },
    evidenceBadge: {
      code: 'SNMP_MIB',
      label: 'PORT UDP 161',
    },
  },
  {
    id: 'inv-16-07',
    code: '16.07',
    title: 'Driver',
    subtitle: 'La batalla generacional: Type 3 (In-Process) vs Type 4 (Isolated)',
    targetMechanism: 'User-Mode Driver Framework (Type 4) vs Kernel/Spooler Mode (Type 3)',
    targetComponent: 'PrintIsolationHost.exe / C:\\Windows\\System32\\spool\\drivers',
    commandName: 'Get-PrinterDriver',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: '¿Por qué la instalación de un controlador de impresora viejo puede causar pantallazos azules o congelar toda la interfaz gráfica de Windows?',
      mythVsTruth: {
        mentira: 'Todos los controladores de impresora funcionan de la misma manera bajo Windows.',
        verdad: 'Los drivers Tipo 3 se cargan dentro del propio proceso de spoolsv.exe; si el driver tiene un memory leak o divide por cero, mata el spooler entero. Los drivers Tipo 4 corren aislados en PrintIsolationHost.exe, protegiendo al sistema operativo.',
        comprobalo: 'Ejecutá Get-PrinterDriver | Select-Object Name, MajorVersion y comprobá cuántos drivers de tu sistema son MajorVersion 3 vs MajorVersion 4.',
      },
    },
    entende: {
      queEs: 'La arquitectura de controladores de impresión de Windows, evolucionada desde el modelo GDI monolítico tradicional (V3) hacia el modelo basado en paquetes XPS y aislamiento de proceso (V4).',
      paraQueSirve: 'Los drivers V4 separan la interfaz de usuario (UWP/WinUI) de la lógica de renderizado, permitiendo actualizar Windows sin romper el soporte de hardware.',
      quePasaSiFalta: 'Si se fuerza el uso de drivers V3 genéricos mal programados en entornos de terminal server o multiusuario, el servidor sufre caídas periódicas de spoolsv.',
    },
    interactua: {
      cliExample: 'rundll32 printui.dll,PrintUIEntry /s /t2',
      psExample: 'Get-PrinterDriver | Format-Table Name, MajorVersion, DriverPath, Manufacturer',
      syntaxBreakdown: 'Abre la consola nativa de Propiedades del Servidor de Impresión mostrando todos los binarios de drivers registrados.',
      whatToLookFor: 'Drivers tipo "Aislado" o "Isolated" en la columna de configuración de aislamiento de proceso.',
      technicalMetrics: 'Drivers Tipo 4 consumen sandbox independiente con límite de privilegios de usuario estándar.',
    },
    alertaEVO: {
      reversibilityRule: 'Desinstalar un driver de impresora requiere eliminar previamente todas las colas asociadas y reiniciar el Spooler.',
      safetyWarning: 'No borres carpetas a mano dentro de spool\\drivers; utilizá siempre printui.dll o pnputil para no romper el registro del catálogo.',
    },
    evidenceBadge: {
      code: 'DRIVER_V4',
      label: 'TYPE 3 VS TYPE 4',
    },
  },
  {
    id: 'inv-16-08',
    code: '16.08',
    title: 'Port',
    subtitle: 'El switchboard invisible entre el Spooler y el bus',
    targetMechanism: 'Port Monitor Architecture & Registry Keys',
    targetComponent: 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors',
    commandName: 'Get-PrinterPort',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Podés tener el driver perfecto, la impresora prendida y el cable conectado, pero si el puerto apunta a COM1 o LPT1 en una máquina de 2026, nada va a pasar jamás.',
      mythVsTruth: {
        mentira: 'El puerto de una impresora es simplemente el conector físico donde está enchufada.',
        verdad: 'En Windows, un Printer Port es un objeto de software administrado por una DLL monitora (ej. tcpmon.dll, usbmon.dll, localmon.dll). Windows puede enviar el trabajo a un archivo (FILE:), a la nube, o a un puerto TCP/IP.',
        comprobalo: 'Fijate en HKLM\\SYSTEM\\CurrentControlSet\\Control\\Print\\Monitors para ver qué DLLs controlan cada tipo de puerto en tu equipo.',
      },
    },
    entende: {
      queEs: 'El Port Monitor es el componente de más bajo nivel del subsistema de impresión de Windows, encargado de abrir el canal de I/O final hacia el periférico.',
      paraQueSirve: 'Abstrae al Spooler de las diferencias entre un bus serie, paralelo, USB, Bluetooth o un socket TCP de red.',
      quePasaSiFalta: 'Si un monitor de puerto de terceros se corrompe en el Registro, spoolsv.exe entra en bucle de reinicio infinito durante el arranque de Windows.',
    },
    interactua: {
      cliExample: 'cscript C:\\Windows\\System32\\Printing_Admin_Scripts\\es-ES\\prnport.vbs -l',
      psExample: 'Get-PrinterPort | Select-Object Name, Description',
      syntaxBreakdown: 'Lista todos los puertos registrados en el servidor de impresión local.',
      whatToLookFor: 'Puertos huérfanos generados por reconexiones masivas de USB o puertos WSD fantasma.',
      technicalMetrics: 'Tiempo de respuesta del monitor de puerto < 10 ms por trabajo en cola.',
    },
    alertaEVO: {
      reversibilityRule: 'Crear un puerto TCP/IP Estándar nuevo no afecta los puertos existentes de otras impresoras.',
      safetyWarning: 'Nunca edites las subclaves de Monitors en el Registro con el servicio Spooler en ejecución.',
    },
    evidenceBadge: {
      code: 'PORTMON',
      label: 'PRINT MONITORS',
    },
  },
  {
    id: 'inv-16-09',
    code: '16.09',
    title: 'USB no reconocido',
    subtitle: 'Device Descriptor Request Failed y la tortura eléctrica',
    targetMechanism: 'USB Enumeration Handshake & Descriptor Failure',
    targetComponent: 'usbhub3.sys / usbccgp.sys',
    commandName: 'Get-PnpDevice | Where-Object Problem -eq "CM_PROB_FAILED_POST_START"',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Enchufás un pendrive o teclado y salta el temido cartel: "Dispositivo USB no reconocido (Error de solicitud de descriptor de dispositivo)". ¿Qué falló exactamente?',
      mythVsTruth: {
        mentira: 'Windows no tiene el driver del periférico y por eso no sabe qué es.',
        verdad: 'El error ocurre antes de cargar cualquier driver: el controlador de host USB intentó leer la estructura binaria Device Descriptor (18 bytes con el Vendor ID y Product ID) en el Endpoint 0 y el periférico no respondió o envió ruido eléctrico.',
        comprobalo: 'Abrí Administrador de Dispositivos -> Controladoras de bus serie universal: verás el nodo amarillo con Estado de dispositivo "Código 43: Error de solicitud de descriptor".',
      },
    },
    entende: {
      queEs: 'El fracaso del protocolo de enumeración USB en el bus físico (líneas de datos D+ y D-) durante la fase de asignación de dirección de hardware (Set Address).',
      paraQueSirve: 'Entender esto evita perder tiempo buscando drivers cuando el problema es una pista cortada, un cable USB desgastado, suciedad en los pines o falta de corriente (VBUS).',
      quePasaSiFalta: 'Si el host no puede leer el descriptor, no sabe si el dispositivo es un ratón de 100 mA o un disco externo de 900 mA, por lo que apaga el puerto por protección.',
    },
    interactua: {
      cliExample: 'devcon status "USB\\DEVICE_DESCRIPTOR_FAILURE"',
      psExample: 'Get-PnpDevice | Where-Object DeviceID -like "*DESCRIPTOR*" | Select-Object Status, Problem, FriendlyName',
      syntaxBreakdown: 'Busca dispositivos que hayan entrado en el estado canónico de fallo de descriptor USB.',
      whatToLookFor: 'CM_PROB_FAILED_POST_START (Error 43) en el objeto PDO del bus.',
      technicalMetrics: 'Tolerancia de señal D+/D-: nivel lógico alto 3.3V (Full Speed) o 400 mV diferencial (High Speed).',
    },
    alertaEVO: {
      reversibilityRule: 'Desconectar el periférico, limpiar el puerto con alcohol isopropílico o cambiar de puerto suele resolver fallos por resistencia parásita.',
      safetyWarning: 'Evitá forzar conectores USB torcidos: cortocircuitar VBUS (5V) con las líneas de datos puede quemar el puente sur o el chip PCH de la placa madre.',
    },
    evidenceBadge: {
      code: 'USB_DESC',
      label: 'DESCRIPTOR ERROR',
    },
  },
  {
    id: 'inv-16-10',
    code: '16.10',
    title: 'USB power management',
    subtitle: 'Suspensión selectiva y la muerte silenciosa de periféricos',
    targetMechanism: 'USB Selective Suspend & Device Power States (D2/D3)',
    targetComponent: 'USB Hub Power Management / SelectiveSuspendEnabled',
    commandName: 'powercfg /devicequery wake_armed',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Estás jugando o grabando audio, dejás la máquina quieta 2 minutos, y cuando tocás el mouse o la interfaz USB externa, tarda 3 segundos en responder o mete estallidos de estática.',
      mythVsTruth: {
        mentira: 'El periférico tiene un falso contacto en el cable.',
        verdad: 'Windows activó la función "Suspensión selectiva de USB", apagando la línea de alimentación y suspendiendo el controlador de host para ahorrar unos pocos milivatios de batería, desconectando el periférico en caliente.',
        comprobalo: 'Revisá en tu plan de energía avanzado -> Configuración de USB -> Configuración de suspensión selectiva de USB: si está en "Habilitado", Windows desactiva puertos inactivos.',
      },
    },
    entende: {
      queEs: 'Un mecanismo del subsistema ACPI y USB que conmuta hubs individuales o puertos de estado de trabajo D0 a estados de bajo consumo D2 o D3.',
      paraQueSirve: 'Extiende la duración de batería en notebooks apagando transceptores USB que no reportan actividad.',
      quePasaSiFalta: 'En computadoras de escritorio de alto rendimiento o workstations de audio/gaming, la suspensión selectiva provoca microcortes, latencias DPC extremas y cuelgues de periféricos.',
    },
    interactua: {
      cliExample: 'powercfg /SETACVALUEINDEX SCHEME_CURRENT 2a737441-1930-4402-86ee-b6bf43ed296c 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0',
      psExample: 'Get-CimInstance -ClassName Win32_USBHub | Select-Object Name, PowerManagementSupported',
      syntaxBreakdown: 'Deshabilita la suspensión selectiva de USB en corriente alterna para el esquema de energía actual mediante powercfg.',
      whatToLookFor: 'Valor 0 (Deshabilitado) para garantizar energía constante y latencia mínima en puertos USB.',
      technicalMetrics: 'Tiempo de transición D3 -> D0 de un puerto USB: de 10 a 100 ms de latencia agregada.',
    },
    alertaEVO: {
      reversibilityRule: 'Revertir el comando a 1 restablece el ahorro de batería en notebooks portátiles.',
      safetyWarning: 'En laptops con poca batería, deshabilitar la suspensión selectiva en todos los puertos puede aumentar el consumo en reposo en 1-2 Watts.',
    },
    evidenceBadge: {
      code: 'USB_SUSP',
      label: 'SELECTIVE SUSPEND',
    },
  },
  {
    id: 'inv-16-11',
    code: '16.11',
    title: 'Bluetooth desaparecido',
    subtitle: 'El colapso del controlador HCI por Inicio Rápido (Fast Startup)',
    targetMechanism: 'Bluetooth Host Controller Interface (HCI) State Machine',
    targetComponent: 'bthport.sys / bthserv',
    commandName: 'Get-Service bthserv',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Prendés la PC a la mañana y el botón de Bluetooth desapareció por completo de la barra de tareas y de Configuración; parece como si la máquina nunca hubiera tenido antena.',
      mythVsTruth: {
        mentira: 'Se quemó el módulo Wi-Fi/Bluetooth de la placa madre.',
        verdad: 'La interfaz USB interna que comunica el módulo Bluetooth con el chipset quedó en un estado de firmware zombi por culpa del Inicio Rápido de Windows (hibridación S4). El controlador de host no pudo inicializar el HCI y Windows ocultó la radio.',
        comprobalo: 'Desconectá la PC de la corriente durante 30 segundos (o hacé un Reinicio completo en lugar de Apagar) y el botón de Bluetooth volverá mágicamente.',
      },
    },
    entende: {
      queEs: 'La pila Bluetooth de Windows, compuesta por el protocolo HCI (Host Controller Interface), que envía comandos de control a la radio física a través de un bus PCIe o USB interno.',
      paraQueSirve: 'Gestiona la vinculación, perfiles de audio (A2DP), dispositivos de interfaz humana (HID) y puertos serie virtuales (RFCOMM).',
      quePasaSiFalta: 'Si el firmware del chip (Intel, MediaTek, Realtek) no se resetea eléctricamente tras un reinicio de Windows, el dispositivo queda marcado con Código 10 o desaparece del árbol PnP.',
    },
    interactua: {
      cliExample: 'sc query bthserv',
      psExample: 'Get-PnpDevice -Class Bluetooth | Select-Object Status, FriendlyName, InstanceId',
      syntaxBreakdown: 'Audita el estado de todos los nodos de radio y controladores de la pila Bluetooth.',
      whatToLookFor: 'Bluetooth Device (Personal Area Network) y Radio Bluetooth en estado OK.',
      technicalMetrics: 'Reiniciar el servicio bthserv toma < 500 ms; reseteo en frío del bus PCIe/USB purga microcódigo zombi.',
    },
    alertaEVO: {
      reversibilityRule: 'Desactivar Inicio Rápido (Fast Startup) en Opciones de Energía previene este error en el 95% de las placas madre modernas.',
      safetyWarning: 'No intentes reinstalar drivers de Bluetooth si el Administrador de Dispositivos ni siquiera muestra el nodo de hardware: primero hacé un drenaje eléctrico.',
    },
    evidenceBadge: {
      code: 'BTH_HCI',
      label: 'BLUETOOTH HCI',
    },
  },
  {
    id: 'inv-16-12',
    code: '16.12',
    title: 'Drivers de periféricos',
    subtitle: 'El software inflado (bloatware) vs los drivers de clase nativos',
    targetMechanism: 'Vendor Companion Software vs In-Box Class Drivers',
    targetComponent: 'Razer Synapse / iCUE / G HUB / Armory Crate',
    commandName: 'Get-Process | Where-Object ProcessName -match "Razer|Corsair|LGHUB"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Enchufás un mouse gamer o unos auriculares y Windows te instala 8 servicios en segundo plano, 2 interfaces web Chromium y 1.2 GB de memoria RAM ocupada solo para prender una luz RGB.',
      mythVsTruth: {
        mentira: 'Es obligatorio tener la aplicación del fabricante abierta para que el periférico funcione a su máxima tasa de sondeo (polling rate).',
        verdad: 'Windows incluye drivers de clase nativos (hidusb.sys, usbaudio2.sys) de bajísima latencia. La mayoría de periféricos guardan perfiles de DPI e iluminación en su memoria onboard integrada, haciendo innecesario el software residente.',
        comprobalo: 'Cerrá por completo el software de periféricos y medí tu latencia DPC con LatencyMon: notarás caídas drásticas de micro-stuttering en juegos competitivos.',
      },
    },
    entende: {
      queEs: 'La diferencia entre los controladores de clase in-box de Microsoft (que ejecutan en el kernel con mínima sobrecarga) y los suites de personalización de fabricantes que saturan el Ring 3 con telemetría.',
      paraQueSirve: 'Permite configurar funciones avanzadas (macros, ecualizaciones, RGB) una sola vez y luego prescindir del proceso en memoria.',
      quePasaSiFalta: 'Si no se audita este bloatware, 3 periféricos de marcas distintas pueden consumir más memoria y tiempo de CPU en segundo plano que el propio sistema operativo.',
    },
    interactua: {
      cliExample: 'wmic process where "name like \'%hub%\' or name like \'%synapse%\'" get name,workingsetsize',
      psExample: 'Get-Process | Where-Object { $_.Path -like "*Razer*" -or $_.Path -like "*Corsair*" } | Measure-Object -Property WorkingSet64 -Sum',
      syntaxBreakdown: 'Calcula el consumo total en bytes de memoria física retenida por suites de periféricos en tu sistema.',
      whatToLookFor: 'Suma total de memoria > 500 MB y procesos con hooks de teclado globales.',
      technicalMetrics: 'Reducción de consumo de RAM de 800 MB a 0 MB configurando la memoria onboard.',
    },
    alertaEVO: {
      reversibilityRule: 'Configurar los perfiles en la memoria integrada del periférico y desactivar el inicio automático de la app de control.',
      safetyWarning: 'Algunas macros complejas que combinan clics con pausas temporizadas dependen del software residente para ejecutarse.',
    },
    evidenceBadge: {
      code: 'BLOAT_RGB',
      label: 'IN-BOX VS BLOAT',
    },
  },
  {
    id: 'inv-16-13',
    code: '16.13',
    title: 'HID',
    subtitle: 'Human Interface Device: la arquitectura de teclados y ratones',
    targetMechanism: 'HID Specification, Reports & Polling Rate',
    targetComponent: 'hidclass.sys / hidusb.sys',
    commandName: 'Get-PnpDevice -Class "HIDClass"',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '¿Cómo sabe Windows instantáneamente si estás tocando la tecla "A", moviendo la rueda del ratón o subiendo el volumen desde un botón multimedia?',
      mythVsTruth: {
        mentira: 'Cada teclado requiere un protocolo de comunicación exclusivo inventado por su fabricante.',
        verdad: 'Todos los dispositivos de entrada usan el estándar USB-IF HID. El dispositivo envía un "HID Report Descriptor" que le dice al kernel: "envío paquetes de 4 bytes donde el byte 1 son botones y los bytes 2-3 son coordenadas X/Y".',
        comprobalo: 'Ejecutá Get-PnpDevice -Class "HIDClass" y verás cómo un solo teclado físico puede generar 4 o 5 dispositivos lógicos HID (teclado, control de volumen, panel táctil).',
      },
    },
    entende: {
      queEs: 'El protocolo HID (Human Interface Device), gobernado por `hidclass.sys`, que estandariza la comunicación de periféricos de interacción humana mediante interrupciones de polling periódico.',
      paraQueSirve: 'Garantiza compatibilidad universal: cualquier teclado o joystick HID funciona desde la BIOS/UEFI hasta en consolas y teléfonos sin drivers externos.',
      quePasaSiFalta: 'Si la pila HID se bloquea o tiene problemas de sondeo, se produce "input lag", clics perdidos o teclas que quedan virtualmente pegadas en pantalla.',
    },
    interactua: {
      cliExample: 'pnputil /enum-devices /class HIDClass',
      psExample: 'Get-PnpDevice -Class "HIDClass" | Select-Object Status, FriendlyName, HardwareID',
      syntaxBreakdown: 'Enumera todos los descriptores lógicos HID activos montados en el sistema.',
      whatToLookFor: 'Dispositivos con estado OK y prefijo HID\\VID_xxxx&PID_xxxx.',
      technicalMetrics: 'Frecuencia de muestreo típica: 125 Hz (8 ms), 1000 Hz (1 ms), 8000 Hz (0.125 ms).',
    },
    alertaEVO: {
      reversibilityRule: 'Desconectar periféricos HID conflictivos restaura inmediatamente el pooling rate estándar del bus.',
      safetyWarning: 'Tasas de sondeo de 8000 Hz en CPUs antiguas pueden saturar un núcleo completo con interrupciones DPC, bajando los FPS en juegos.',
    },
    evidenceBadge: {
      code: 'HID_CLASS',
      label: 'HID REPORTS',
    },
  },
  {
    id: 'inv-16-14',
    code: '16.14',
    title: 'Audio USB',
    subtitle: 'DACs, UAC 2.0 y el dilema de la latencia isócrona',
    targetMechanism: 'USB Audio Class (UAC 1.0/2.0) & Isochronous Transfers',
    targetComponent: 'usbaudio2.sys / AudioDG.exe',
    commandName: 'Get-AudioDevice -List (o sounddevice en WMI)',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Enchufás unos auriculares USB o un micrófono de estudio y en medio de una llamada o grabación escuchás chasquidos, crujidos o la voz en cámara lenta robótica.',
      mythVsTruth: {
        mentira: 'El micrófono o el cable están rotos.',
        verdad: 'El audio USB usa transferencias isócronas (Isochronous Transfers), donde no existe retransmisión de paquetes perdidos. Si el bus USB sufre una microrretención por otro dispositivo o latencia DPC en el kernel, la muestra de audio se pierde y el DAC emite un chasquido (buffer underrun).',
        comprobalo: 'Cambiá el dispositivo de un puerto USB 3.0 azul compartido a un puerto USB 2.0 negro directo del chipset trasero y los chasquidos desaparecerán.',
      },
    },
    entende: {
      queEs: 'El estándar USB Audio Class (UAC 2.0), implementado nativamente en Windows 10/11 por `usbaudio2.sys`, que permite transferir audio en alta resolución (24-bit/192 kHz) en tiempo real.',
      paraQueSirve: 'Permite conectar DACs externos, placas de sonido profesionales e interfaces de streaming sin controladores propietarios obligatorios.',
      quePasaSiFalta: 'Si hay conflicto de ancho de banda en el hub USB raíz (ej. una webcam 4K transmitiendo al mismo tiempo en el mismo canal), el flujo isócrono colapsa con cortes de audio continuos.',
    },
    interactua: {
      cliExample: 'powercfg /requests',
      psExample: 'Get-PnpDevice -Class "AudioEndpoint" | Select-Object Status, FriendlyName',
      syntaxBreakdown: 'Audita si hay endpoints de audio reteniendo estados de energía o bloqueando suspensiones.',
      whatToLookFor: 'No tener controladores USB compartiendo IRQ con la tarjeta gráfica en LatencyMon.',
      technicalMetrics: 'Tamaño de buffer de audio recomendado: 64 a 256 muestras a 48 kHz (1.33 ms a 5.33 ms de latencia).',
    },
    alertaEVO: {
      reversibilityRule: 'Ajustar el tamaño de buffer en el panel ASIO o cambiar la tasa de muestreo a 48000 Hz restablece la estabilidad.',
      safetyWarning: 'Evitá conectar placas de sonido en los puertos USB frontales del gabinete: sus cables internos largos son propensos a interferencias electromagnéticas (EMI) de la GPU.',
    },
    evidenceBadge: {
      code: 'UAC2_DAC',
      label: 'USB AUDIO 2.0',
    },
  },
];

export const SECTOR_16_MINICASES: Sector16MiniCase[] = [
  {
    id: 'case-16-01',
    code: '16.A',
    title: 'El Deadlock Inmortal de la Impresora de Facturación',
    scenario: 'En un estudio contable, la impresora principal dejó de imprimir en pleno cierre de mes. La cola de Windows muestra un documento de Excel en estado "Eliminando..." desde hace dos horas. El usuario reinició la impresora 5 veces, desconectó el cable de red y reinició el PC, pero al encender, el documento sigue diciendo "Eliminando..." y ningún otro trabajo sale.',
    userStatement: 'Apagué la máquina y la prendí, pero el archivo sigue ahí trabado. ¡Windows tiene memoria de elefante!',
    initialMistake: 'Pensar que reiniciar el equipo borra la cola de impresión de Windows.',
    diagnosticQuestion: '¿Por qué reiniciar la PC no borró el trabajo atascado y cuál es el procedimiento técnico canónico para destrabarlo?',
    options: [
      {
        id: 'a',
        text: 'Porque el documento está guardado en la memoria CMOS de la placa madre y hay que sacar la pila de la BIOS.',
        isCorrect: false,
        explanation: 'La BIOS/CMOS no almacena trabajos de impresión del sistema operativo.',
      },
      {
        id: 'b',
        text: 'Porque el Spooler escribe archivos .SHD y .SPL en C:\\Windows\\System32\\spool\\PRINTERS que son persistentes en disco NTFS. Al reiniciar, spoolsv.exe lee los archivos de nuevo y reintenta el trabajo fallido. La solución es detener el servicio Spooler, vaciar esa carpeta a mano y volver a iniciar el servicio.',
        isCorrect: true,
        explanation: 'Exacto. La arquitectura del Spooler fue diseñada para tolerar cortes de energía, por lo que guarda el spool en archivos temporales NTFS. Si el archivo está corrupto, spoolsv se cuelga en cada arranque hasta que se purga manualmente la carpeta.',
      },
      {
        id: 'c',
        text: 'Hay que formatear la unidad C: completa porque el registro de Windows se rompió irreversiblemente.',
        isCorrect: false,
        explanation: 'Completamente desproporcionado. Es simplemente un archivo temporal huérfano bloqueado en disco.',
      },
      {
        id: 'd',
        text: 'Hay que cambiar el cable de red de la impresora por uno de categoría 8.',
        isCorrect: false,
        explanation: 'El problema reside en el spooler local del cliente, no en la física del cable.',
      },
    ],
    technicalVerdict: 'El Print Spooler implementa persistencia en disco mediante pares de archivos (.SHD de metadatos y .SPL de rasterizado binario). Cuando un trabajo sufre un error de comunicación irreversible y el usuario intenta cancelarlo, se produce un deadlock: el archivo queda bloqueado con handle abierto. Al reiniciar, el servicio vuelve a leer el archivo y reproduce el cuelgue. El comando canónico Stop-Service Spooler; Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\* -Force; Start-Service Spooler resuelve el 100% de los casos.',
    lessonLearned: 'Reiniciar Windows no limpia la cola de impresión porque los archivos de spool son persistentes en NTFS por diseño de tolerancia a fallos.',
  },
  {
    id: 'case-16-02',
    code: '16.B',
    title: 'La Impresora Wi-Fi Fantasma que se Desconecta a las 11:00 AM',
    scenario: 'En una oficina comercial, una impresora multifunción conectada por Wi-Fi funciona a primera hora de la mañana, pero todos los días alrededor de las 11:00 AM, las computadoras muestran el estado "Impresora sin conexión". Si imprimen una página de prueba desde el panel táctil de la impresora funciona, y si le hacen ping a su IP responde en 2 ms.',
    userStatement: 'La impresora anda perfecta cuando la toco, pero Windows se olvida de que existe todos los días.',
    initialMistake: 'Culpar al módulo Wi-Fi de la impresora y comprar un repetidor de señal.',
    diagnosticQuestion: '¿Cuál es la causa técnica raíz de que Windows marque la impresora como desconectada a pesar de responder al ping?',
    options: [
      {
        id: 'a',
        text: 'El puerto fue configurado mediante WSD con IP dinámica asignada por un router con lease time de DHCP corto, o el monitor TCP/IP tiene activado el censo de estado SNMP y los paquetes UDP 161 son bloqueados por el router o el firewall.',
        isCorrect: true,
        explanation: 'Brillante diagnóstico pericial. WSD es hipersensible a cambios de IP o pérdidas de paquetes multicast UDP 3702, y el censo SNMP en el puerto 161 marca la impresora offline si el agente de la impresora no responde.',
      },
      {
        id: 'b',
        text: 'Las ondas Wi-Fi se cansan después de varias horas de funcionamiento continuo.',
        isCorrect: false,
        explanation: 'Absurdo físico. Las ondas electromagnéticas no sufren fatiga.',
      },
      {
        id: 'c',
        text: 'Windows 11 solo permite imprimir 10 documentos por día en redes Wi-Fi sin licencia Pro.',
        isCorrect: false,
        explanation: 'Falso. No existe ninguna limitación de cuota de documentos en Windows.',
      },
      {
        id: 'd',
        text: 'El tóner de la impresora se enfría y apaga el chip de red.',
        isCorrect: false,
        explanation: 'El subsistema de red es independiente del fusor de la impresora.',
      },
    ],
    technicalVerdict: 'La resolución técnica profesional consiste en dos pasos: 1) Asignar una IP estática fija a la impresora fuera del rango dinámico del DHCP del router; 2) En Windows, cambiar el puerto de la impresora de WSD a un "Puerto TCP/IP estándar", configurando la IP fija y desmarcando la casilla "Estado SNMP habilitado". Con esto, la impresora jamás volverá a quedar en estado offline fantasma.',
    lessonLearned: 'WSD y SNMP son protocolos frágiles en redes Wi-Fi domésticas y corporativas sin multicast garantizado; el puerto TCP/IP Estándar es la única solución definitiva.',
  },
  {
    id: 'case-16-03',
    code: '16.C',
    title: 'El Mouse Gamer que se Desconecta en Plena Partida',
    scenario: 'Un usuario compró un mouse de gama alta de 8000 Hz. Mientras juega competitivamente, cada vez que deja el mouse quieto 5 segundos esperando en una esquina, al intentar moverlo sufre una congelación de casi medio segundo antes de que el cursor responda. Además, la PC emite el sonido de "desconexión de dispositivo USB".',
    userStatement: 'El mouse vino fallado de fábrica, el cable pierde contacto.',
    initialMistake: 'Tramitar la garantía del mouse asumiendo fallo de hardware en el cable trenzado.',
    diagnosticQuestion: '¿Qué mecanismo interno del subsistema de energía de Windows está provocando la desconexión del mouse?',
    options: [
      {
        id: 'a',
        text: 'La placa de video está consumiendo todos los watts de la fuente y apaga los USB.',
        isCorrect: false,
        explanation: 'La fuente suministra líneas separadas de 12V para GPU y 5V para USB.',
      },
      {
        id: 'b',
        text: 'El plan de energía de Windows tiene habilitada la "Suspensión selectiva de USB" y en el Administrador de Dispositivos el USB Root Hub tiene activado "Permitir que el equipo apague este dispositivo para ahorrar energía".',
        isCorrect: true,
        explanation: 'Exacto. Windows detecta falta de reportes HID durante unos segundos y pone el transceptor del puerto en estado de reposo D2/D3. Al mover el mouse, debe enviar una señal de reanudación (Resume K-state) que demora cientos de milisegundos.',
      },
      {
        id: 'c',
        text: 'El sensor óptico del mouse se queda ciego por culpa de la luz del monitor.',
        isCorrect: false,
        explanation: 'Los sensores ópticos modernos usan iluminación infrarroja/LED focalizada independiente.',
      },
      {
        id: 'd',
        text: 'Windows no soporta ningún mouse que supere los 500 Hz de polling rate.',
        isCorrect: false,
        explanation: 'Windows 11 soporta hasta 8000 Hz nativamente.',
      },
    ],
    technicalVerdict: 'Para periféricos de alta precisión y baja latencia, la suspensión selectiva es nefasta. Debe ejecutarse powercfg para desactivar USB Selective Suspend en el plan de energía activo y desmarcar el ahorro de energía en todos los concentradores raíz USB (USB Root Hub) en el Administrador de Dispositivos.',
    lessonLearned: 'El ahorro de energía agresivo de Windows en puertos USB degrada la latencia y genera microdesconexiones en periféricos de alto rendimiento.',
  },
  {
    id: 'case-16-04',
    code: '16.D',
    title: 'El Misterio del Bluetooth que Desaparece tras Apagar la PC',
    scenario: 'En una PC de escritorio con placa madre con Wi-Fi/Bluetooth integrado, el usuario apaga el equipo por la noche. Al día siguiente lo enciende y el icono de Bluetooth no está. En el Administrador de Dispositivos aparece un error con triángulo amarillo: "Dispositivo USB desconocido (Error de restablecimiento de puerto)". Si el usuario reinicia Windows no se arregla, pero si desconecta la zapatilla de la pared y la vuelve a enchufar, el Bluetooth reaparece al 100%.',
    userStatement: 'Tengo un fantasma eléctrico en mi casa: solo anda si desenchufo la zapatilla de la pared.',
    initialMistake: 'Creer que hay un problema de puesta a tierra en la instalación eléctrica de la casa.',
    diagnosticQuestion: '¿Por qué desconectar la corriente resuelve el problema pero reiniciar Windows no?',
    options: [
      {
        id: 'a',
        text: 'La zapatilla tiene un fusible térmico que se enfría al desenchufarla.',
        isCorrect: false,
        explanation: 'No tiene relación con la detección lógica del chip en la placa madre.',
      },
      {
        id: 'b',
        text: 'La radio Bluetooth está cableada internamente al bus USB del chipset. Con el Inicio Rápido (Fast Startup) de Windows, el equipo nunca se apaga del todo (entra en hibernación del kernel S4) y los rieles de 5VSB (Standby) de la fuente siguen alimentando el chip, dejando el firmware del controlador HCI colgado en un bucle zombi. Cortar la corriente drena los capacitores de la placa madre y fuerza un reinicio en frío (cold reset) del silicio.',
        isCorrect: true,
        explanation: 'Explicación técnica perfecta a nivel de ingeniería de hardware. El rail 5VSB mantiene alimentado el chip con microcódigo trabado. Al desenchufar la pared, se vacían los capacitores, el chip se queda sin voltaje y al arrancar carga el firmware limpio desde cero.',
      },
      {
        id: 'c',
        text: 'Porque el cable HDMI transmite electricidad negativa a la antena Bluetooth.',
        isCorrect: false,
        explanation: 'Totalmente infundado.',
      },
      {
        id: 'd',
        text: 'Porque Windows 11 requiere que el usuario pague una suscripción de Bluetooth mensual.',
        isCorrect: false,
        explanation: 'Bluetooth es un estándar libre y gratuito.',
      },
    ],
    technicalVerdict: 'La solución definitiva para evitar tener que desconectar la corriente consiste en: 1) Desactivar el "Inicio rápido" (Fast Startup) en Opciones de energía de Windows, forzando un apagado real S5 (G2 Soft Off); 2) Desactivar la alimentación USB en estado apagado (ErP Ready / Deep Sleep habilitado en la BIOS/UEFI) para que el riel de standby corte el suministro al apagarse.',
    lessonLearned: 'El Inicio Rápido de Windows combinado con el riel 5VSB de la fuente impide el reseteo de hardware de chips USB/Bluetooth colgados.',
  },
];

export const SECTOR_16_TEST_BANK: Sector16TestQuestion[] = [
  {
    id: 'q16-01',
    questionNumber: 1,
    category: 'SPOOLER_Y_ARQUITECTURA',
    question: '¿Cuáles son los dos tipos de archivos temporales que genera el servicio Spooler (spoolsv.exe) en C:\\Windows\\System32\\spool\\PRINTERS para cada trabajo de impresión?',
    options: [
      { id: 'a', text: '.TMP y .BAK' },
      { id: 'b', text: '.SHD (Shadow file con metadatos y permisos) y .SPL (Spool file con los datos gráficos rasterizados)' },
      { id: 'c', text: '.PDF y .DOCX' },
      { id: 'd', text: '.RAW y .GDI' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El archivo .SHD contiene la cabecera con el dueño del trabajo, la impresora de destino y las opciones de copia, mientras que el .SPL almacena el payload con las instrucciones EMF, PCL o PostScript.',
    relatedInvestigationCode: '16.05',
  },
  {
    id: 'q16-02',
    questionNumber: 2,
    category: 'PUERTOS_Y_RED',
    question: '¿Por qué en entornos corporativos de alta disponibilidad se prefiere configurar un puerto "Standard TCP/IP Port" en lugar de un puerto "WSD (Web Services for Devices)"?',
    options: [
      { id: 'a', text: 'Porque WSD cobra licencia por cada página impresa.' },
      { id: 'b', text: 'Porque el puerto TCP/IP Estándar se comunica directamente con un socket fijo (puerto 9100 RAW) sin depender de anuncios multicasting UDP (puerto 3702) que son propensos a descartes de red y causan el estado "Offline" fantasma.' },
      { id: 'c', text: 'Porque WSD solo funciona con cables USB de menos de 1 metro.' },
      { id: 'd', text: 'Porque TCP/IP comprime las hojas de papel para que ocupen menos espacio.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'WSD depende de WS-Discovery mediante paquetes multicast UDP. Si la red corporativa segmenta VLANs o bloquea multicast, el estado de presencia se pierde. El socket TCP 9100 RAW establece una conexión punto a punto garantizada.',
    relatedInvestigationCode: '16.02',
  },
  {
    id: 'q16-03',
    questionNumber: 3,
    category: 'DRIVERS_Y_SEGURIDAD',
    question: '¿Cuál es la principal ventaja técnica del modelo de controladores de impresión Tipo 4 (V4) introducido en Windows frente al modelo tradicional Tipo 3 (V3)?',
    options: [
      { id: 'a', text: 'Los drivers V4 imprimen a mayor resolución óptica de DPI.' },
      { id: 'b', text: 'Los drivers V4 corren en procesos aislados (PrintIsolationHost.exe) fuera de spoolsv.exe, de modo que un fallo o cuelgue del driver no tumba el servicio de impresión de todo el sistema.' },
      { id: 'c', text: 'Los drivers V4 no requieren tinta en la impresora.' },
      { id: 'd', text: 'Los drivers V4 solo funcionan en computadoras portátiles.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El modelo V4 aísla la ejecución del driver en User Mode dentro de PrintIsolationHost.exe, protegiendo al spooler y eliminando la vulnerabilidad de colapso de servicio por DLLs corruptas de terceros.',
    relatedInvestigationCode: '16.07',
  },
  {
    id: 'q16-04',
    questionNumber: 4,
    category: 'USB_Y_HARDWARE',
    question: '¿Qué significa el error de Administrador de Dispositivos "Dispositivo USB desconocido (Error de solicitud de descriptor de dispositivo)" con Código 43?',
    options: [
      { id: 'a', text: 'Que Windows no tiene conexión a Internet para descargar el driver de Windows Update.' },
      { id: 'b', text: 'Que el controlador de host USB no pudo leer los primeros 18 bytes del Device Descriptor en el Endpoint 0 debido a problemas eléctricos, suciedad o fallo físico del periférico.' },
      { id: 'c', text: 'Que el puerto USB fue bloqueado por la policía informática.' },
      { id: 'd', text: 'Que el dispositivo tiene demasiados archivos y desbordó la memoria.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'La solicitud de descriptor ocurre durante el handshake de bajo nivel a través de las líneas D+/D-. Si el dispositivo no responde con su cabecera canónica de 18 bytes, el sistema operativo no puede identificar ni el Vendor ID ni el Product ID.',
    relatedInvestigationCode: '16.09',
  },
  {
    id: 'q16-05',
    questionNumber: 5,
    category: 'USB_ENERGIA',
    question: 'Desde el punto de vista de la metrología del rendimiento y audio profesional, ¿qué efecto indeseado provoca la "Suspensión selectiva de USB"?',
    options: [
      { id: 'a', text: 'Aumenta el volumen del sonido un 200% de golpe.' },
      { id: 'b', text: 'Apaga temporalmente puertos inactivos, provocando latencia de reactivación (Resume K-state), chasquidos en interfaces de audio por buffer underrun y microcongelamiento de periféricos HID.' },
      { id: 'c', text: 'Desmagnetiza los cables USB blindados.' },
      { id: 'd', text: 'Borra la clave de activación de Windows.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'La transición de energía de D3 a D0 toma entre 10 y 100 milisegundos. En interfaces de audio que usan transferencias isócronas sin retransmisión, esto vacía el buffer DMA y genera estallidos audibles.',
    relatedInvestigationCode: '16.10',
  },
  {
    id: 'q16-06',
    questionNumber: 6,
    category: 'BLUETOOTH_ARQUITECTURA',
    question: '¿Por qué un reinicio en caliente de Windows (o encender con Fast Startup activo) puede no recuperar un módulo Bluetooth colgado, pero cortar la energía eléctrica total sí lo hace?',
    options: [
      { id: 'a', text: 'Porque la antena Bluetooth necesita absorber humedad ambiental para sintonizar la frecuencia de 2.4 GHz.' },
      { id: 'b', text: 'Porque el módulo Bluetooth suele estar alimentado por el riel de 5V Standby (5VSB) de la placa madre; al desconectar la pared se drenan los capacitores, forzando un reinicio en frío (cold power cycle) del chip que limpia el estado zombi del microcódigo HCI.' },
      { id: 'c', text: 'Porque Windows reinstala todo el sistema operativo cuando se desconecta la corriente.' },
      { id: 'd', text: 'Porque el chip Bluetooth funciona únicamente con corriente continua de baterías externas.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El riel 5VSB mantiene energizados los transceptores USB internos incluso con la PC "apagada". Si el microcódigo del chip entra en bucle, solo una descarga completa de capacitores lo restablece a su estado de reset de fábrica.',
    relatedInvestigationCode: '16.11',
  },
  {
    id: 'q16-07',
    questionNumber: 7,
    category: 'HID_Y_PERIFERICOS',
    question: '¿Qué componente del kernel de Windows es el encargado de parsear los paquetes de datos normalizados de teclados, ratones y botones multimedia según el estándar de USB-IF?',
    options: [
      { id: 'a', text: 'explorer.exe' },
      { id: 'b', text: 'hidclass.sys junto con hidusb.sys' },
      { id: 'c', text: 'notepad.exe' },
      { id: 'd', text: 'winword.exe' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'hidclass.sys es el driver de clase de Windows que implementa la especificación HID Parser, traduciendo los Report Descriptors binarios en mensajes de Windows Input para el subsistema User32.',
    relatedInvestigationCode: '16.13',
  },
  {
    id: 'q16-08',
    questionNumber: 8,
    category: 'AUDIO_USB',
    question: '¿Por qué las transferencias isócronas utilizadas por los DACs USB (UAC 2.0) son susceptibles a chasquidos y cortes cuando hay alta latencia DPC en el sistema?',
    options: [
      { id: 'a', text: 'Porque las transferencias isócronas priorizan el tiempo real y no tienen retransmisión de paquetes: si una muestra de audio no se entrega a tiempo en su frame, se pierde irremediablemente.' },
      { id: 'b', text: 'Porque el cable USB se recalienta y derrite los datos digitales.' },
      { id: 'c', text: 'Porque Windows solo envía audio los días hábiles de la semana.' },
      { id: 'd', text: 'Porque los altavoces rechazan frecuencias mayores a 20 Hz por protocolo.' },
    ],
    correctOptionId: 'a',
    technicalExplanation: 'A diferencia de las transferencias BULK (usadas en pendrives donde los datos erróneos se reenvían), el audio y video en vivo usan transferencias Isochronous garantizando ancho de banda pero sin acuse de recibo ni reenvío.',
    relatedInvestigationCode: '16.14',
  },
  {
    id: 'q16-09',
    questionNumber: 9,
    category: 'SPOOLER_PROCEDIMIENTOS',
    question: '¿Cuál es la secuencia de comandos de consola correcta para destrabar una cola de impresión bloqueada sin reiniciar el equipo?',
    options: [
      { id: 'a', text: 'format C: /q' },
      { id: 'b', text: 'net stop spooler && del /Q /F %systemroot%\\System32\\spool\\PRINTERS\\* && net start spooler' },
      { id: 'c', text: 'shutdown /s /t 0' },
      { id: 'd', text: 'ipconfig /flushdns' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Esta secuencia trifásica canónica detiene spoolsv para soltar los bloqueos NTFS de archivo, purga todos los pares .SHD/.SPL corruptos y reinicia el servicio limpio.',
    relatedInvestigationCode: '16.05',
  },
  {
    id: 'q16-10',
    questionNumber: 10,
    category: 'RED_SNMP',
    question: 'Si una impresora de red conectada por puerto TCP/IP responde al ping pero figura "Offline" en Windows, ¿qué ajuste en la configuración del puerto suele solucionar el problema de inmediato?',
    options: [
      { id: 'a', text: 'Cambiar el cable de alimentación de 220V por uno de 110V.' },
      { id: 'b', text: 'Desmarcar la casilla "Estado SNMP habilitado" (SNMP Status Enabled) en las propiedades del puerto de la impresora.' },
      { id: 'c', text: 'Pintar la impresora de color negro para que combine con el gabinete.' },
      { id: 'd', text: 'Desinstalar la placa de video de la computadora.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Windows utiliza SNMP (puerto UDP 161) para censar si la impresora está viva. Si el firmware de la impresora no responde a la MIB de impresión o el router descarta paquetes SNMP, Windows la cataloga como desconectada.',
    relatedInvestigationCode: '16.06',
  },
];
