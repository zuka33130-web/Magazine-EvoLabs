// TOMO 02: LA BIBLIA NEGRA DE WINDOWS
// SECTOR 17: RED // CUANDO “NO ANDA INTERNET” NO SIGNIFICA NADA TODAVÍA

export type RiskLevelSector17 = 'SAFE_READONLY' | 'LOW_RISK' | 'MODIFIES_STATE' | 'HIGH_RISK';

export interface Sector17Investigation {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  targetMechanism: string;
  targetComponent?: string;
  commandName: string;
  riskLevel: RiskLevelSector17;
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

export interface Sector17MiniCase {
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

export interface Sector17TestQuestion {
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

export const SECTOR_17_INVESTIGATIONS: Sector17Investigation[] = [
  {
    id: 'inv-17-01',
    code: '17.01',
    title: 'NIC',
    subtitle: 'La tarjeta de interfaz de red: el puente entre bits y electrones',
    targetMechanism: 'Network Interface Card & NDIS Miniport Driver',
    targetComponent: 'ndis.sys / PCIe NIC',
    commandName: 'Get-NetAdapter',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Mirás la parte de atrás de la PC y ves dos luces titilando en el conector Ethernet: una verde fija y una naranja intermitente. ¿Qué te están diciendo exactamente esos LEDs?',
      mythVsTruth: {
        mentira: 'Que las luces titilen significa que estás conectado a Internet y navegando.',
        verdad: 'Los LEDs solo indican el estado de enlace físico (Link) a nivel de Capa 1 y la presencia de tramas Ethernet en el medio (Activity), independientemente de si hay IP, DHCP o salida al exterior.',
        comprobalo: 'Desconectá el módem de la fibra óptica pero dejalo prendido: los LEDs seguirán titilando aunque no tengas un solo bit de Internet.',
      },
    },
    entende: {
      queEs: 'El controlador físico y lógico de red (NIC), mediado por la especificación NDIS (Network Driver Interface Specification) de Windows.',
      paraQueSirve: 'Convierte los paquetes IP del sistema operativo en tramas Ethernet de Capa 2 o señales de radiofrecuencia 802.11.',
      quePasaSiFalta: 'Si el driver de la NIC no carga, Windows muestra "No se encontró ningún adaptador de red" y desconecta toda la pila de red del kernel.',
    },
    interactua: {
      cliExample: 'netsh interface show interface',
      psExample: 'Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed',
      syntaxBreakdown: 'Muestra todas las tarjetas de red físicas y virtuales, su estado operativo y velocidad de enlace actual.',
      whatToLookFor: 'Status en "Up" y LinkSpeed coincidente con el puerto del switch (1 Gbps o 2.5 Gbps).',
      technicalMetrics: 'Velocidades estándar: 100 Mbps, 1 Gbps (1000BASE-T), 2.5 Gbps (2.5GBASE-T), 10 Gbps.',
    },
    alertaEVO: {
      reversibilityRule: 'Deshabilitar y habilitar el adaptador con Disable-NetAdapter / Enable-NetAdapter resetea la controladora.',
      safetyWarning: 'No deshabilites adaptadores de red de forma remota por SSH o RDP a menos que tengas acceso físico.',
    },
    evidenceBadge: {
      code: 'NIC_NDIS',
      label: 'NDIS MINIPORT',
    },
  },
  {
    id: 'inv-17-02',
    code: '17.02',
    title: 'MAC',
    subtitle: 'Media Access Control: la identidad imborrable en Capa 2',
    targetMechanism: '48-bit EUI-48 Physical Addressing & OUI Lookup',
    targetComponent: 'ARP Table / Frame Header',
    commandName: 'getmac /v /fo list',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Tu dirección IP cambia cada vez que vas a un bar o reiniciás el módem, pero tu dirección MAC permanece grabada a fuego en la ROM de tu placa de red.',
      mythVsTruth: {
        mentira: 'Tu dirección MAC viaja por todo Internet y los sitios web la usan para rastrearte.',
        verdad: 'La dirección MAC jamás sale de tu red local (Capa 2). El primer router que atraviesa tu paquete descarta la cabecera Ethernet original y la reemplaza por su propia MAC para el siguiente salto.',
        comprobalo: 'Ejecutá getmac /v y observá el formato de 6 pares hexadecimales (ej. A4-BB-6D-XX-XX-XX): los primeros 3 pares identifican al fabricante (OUI).',
      },
    },
    entende: {
      queEs: 'La dirección física única de 48 bits (IEEE 802) asignada de fábrica por el fabricante a cada transceptor de red.',
      paraQueSirve: 'Permite que el switch de tu red local sepa a qué puerto físico exacto enviar cada trama de datos.',
      quePasaSiFalta: 'Si dos dispositivos en la misma red local tienen la misma MAC (clonación accidental), se produce un colapso de la tabla CAM del switch.',
    },
    interactua: {
      cliExample: 'getmac /v',
      psExample: 'Get-NetAdapter | Select-Object Name, MacAddress',
      syntaxBreakdown: 'Muestra la dirección de control de acceso al medio asociada a cada interfaz de red activa.',
      whatToLookFor: 'Dirección MAC no nula y consistente con el hardware real del equipo.',
      technicalMetrics: 'Espacio de direcciones: 2^48 (281 billones de identificadores únicos posibles).',
    },
    alertaEVO: {
      reversibilityRule: 'La función de "Direcciones de hardware aleatorias" en Wi-Fi de Windows 11 puede modificarse en Configuración.',
      safetyWarning: 'En redes con filtrado por MAC o autenticación 802.1X, cambiar la MAC te dejará sin acceso a la red.',
    },
    evidenceBadge: {
      code: 'MAC_ADDR',
      label: 'LAYER 2 ADDR',
    },
  },
  {
    id: 'inv-17-03',
    code: '17.03',
    title: 'DHCP',
    subtitle: 'El ritual DORA: Discover, Offer, Request y Acknowledge',
    targetMechanism: 'Dynamic Host Configuration Protocol (UDP 67/68)',
    targetComponent: 'DhcpClient Service (dhcpcore.dll)',
    commandName: 'ipconfig /renew',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Llegás a una casa, te conectás al Wi-Fi e inmediatamente podés navegar. ¿Quién te asignó la IP, la máscara, la puerta de enlace y los DNS en menos de 200 milisegundos?',
      mythVsTruth: {
        mentira: 'Windows inventa una IP libre al azar cuando se conecta al Wi-Fi.',
        verdad: 'El servicio cliente DHCP de Windows grita un broadcast masivo al éter (DHCP Discover). El router le responde con una oferta (Offer), Windows solicita esa concesión (Request) y el router la confirma (ACK) por un tiempo determinado (Lease Time).',
        comprobalo: 'Hacé ipconfig /all y buscá las líneas "Concesión obtenida" y "La concesión expira": ese es el contrato temporal de tu IP con el router.',
      },
    },
    entende: {
      queEs: 'El protocolo cliente-servidor que automatiza la configuración de parámetros de red TCP/IP para nuevos nodos en una red.',
      paraQueSirve: 'Evita tener que configurar a mano una IP única, máscara y DNS en cada teléfono, notebook o PC de la red.',
      quePasaSiFalta: 'Si el servidor DHCP no responde o se agota su piscina de IPs (pool exhausted), Windows cae en el estado de emergencia APIPA (169.254.x.x).',
    },
    interactua: {
      cliExample: 'ipconfig /release && ipconfig /renew',
      psExample: 'Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway',
      syntaxBreakdown: 'Libera la concesión DHCP actual y solicita inmediatamente un nuevo handshake DORA completo.',
      whatToLookFor: 'Obtención de una dirección válida (ej. 192.168.1.x o 10.0.0.x) con Gateway presente.',
      technicalMetrics: 'Tiempo de negociación DORA < 300 ms; puertos UDP 67 (Servidor) y 68 (Cliente).',
    },
    alertaEVO: {
      reversibilityRule: 'Ejecutar ipconfig /renew restablece automáticamente la configuración provista por el router.',
      safetyWarning: 'Tener dos servidores DHCP activos en la misma red local (Rogue DHCP) genera caos de enrutamiento y cortes intermitentes.',
    },
    evidenceBadge: {
      code: 'DHCP_DORA',
      label: 'DORA HANDSHAKE',
    },
  },
  {
    id: 'inv-17-04',
    code: '17.04',
    title: 'IPv4',
    subtitle: 'La cuadrícula de 32 bits y el arte de la máscara de subred',
    targetMechanism: 'IPv4 Header Structure, Subnetting & CIDR',
    targetComponent: 'tcpip.sys / IPv4 Protocol Stack',
    commandName: 'ipconfig',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: '¿Por qué casi todos los routers del planeta te dan una IP que empieza con 192.168.x.x o 10.x.x.x y nunca con 8.8.8.8?',
      mythVsTruth: {
        mentira: 'Cualquier número de 4 cifras con puntos sirve como dirección para tu PC.',
        verdad: 'La RFC 1918 reservó tres rangos privados exclusivos (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) que los routers de Internet tienen prohibido enrutar, requiriendo NAT para salir a la web pública.',
        comprobalo: 'Mirá tu máscara de subred: 255.255.255.0 (/24) le indica a Windows que los primeros 24 bits son la red y los últimos 8 bits son los hosts (máximo 254 máquinas locales).',
      },
    },
    entende: {
      queEs: 'El protocolo de Internet versión 4, basado en direcciones de 32 bits divididas en 4 octetos decimales.',
      paraQueSirve: 'Es el sistema de direccionamiento fundamental que permite a los paquetes encontrar su destino en redes de computadoras.',
      quePasaSiFalta: 'Si la máscara de subred está mal calculada, Windows creerá que máquinas de tu propia oficina están en Internet y enviará el tráfico al router en lugar de contactarlas directamente.',
    },
    interactua: {
      cliExample: 'ipconfig /all',
      psExample: 'Get-NetIPAddress -AddressFamily IPv4 | Where-Object IPAddress -notlike "127.*"',
      syntaxBreakdown: 'Muestra todas las direcciones IPv4 asignadas y sus prefijos CIDR asociados.',
      whatToLookFor: 'Dirección IPv4 unicast con PrefixLength 24 (255.255.255.0).',
      technicalMetrics: 'Tamaño del paquete IPv4 típico: MTU 1500 bytes (cabecera de 20 bytes + 1480 de payload).',
    },
    alertaEVO: {
      reversibilityRule: 'Configurar una IP estática se revierte seleccionando "Obtener una dirección IP automáticamente".',
      safetyWarning: 'Poner una IP estática duplicada con otra máquina de la red causará una colisión de IP inmediata.',
    },
    evidenceBadge: {
      code: 'IPV4_CIDR',
      label: '32-BIT ADDR',
    },
  },
  {
    id: 'inv-17-05',
    code: '17.05',
    title: 'IPv6',
    subtitle: 'El océano de 128 bits: SLAAC, Link-Local y la muerte del NAT',
    targetMechanism: 'IPv6 Addressing, Stateless Autoconfiguration & fe80::',
    targetComponent: 'tcpip.sys / IPv6 Stack',
    commandName: 'Get-NetIPAddress -AddressFamily IPv6',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Abrís ipconfig y ves una cadena monstruosa como fe80::4a1b:88ff:fe21:9c12%14. ¿Qué es eso y por qué tu Windows tiene dos direcciones de Internet funcionando al mismo tiempo?',
      mythVsTruth: {
        mentira: 'Hay que desactivar IPv6 en Windows porque "hace más lenta la conexión y causa problemas".',
        verdad: 'Windows está diseñado con arquitectura dual-stack desde Windows Vista. Las direcciones fe80:: son Link-Local autogeneradas para comunicación de Capa 2. Desactivar IPv6 rompe funciones internas del sistema como DirectAccess, HomeGroup legacy y partes del firewall.',
        comprobalo: 'Hacé ping -6 ::1 para comprobar que la interfaz loopback de IPv6 responde en 0 ms de forma nativa.',
      },
    },
    entende: {
      queEs: 'El protocolo de Internet versión 6, diseñado con 128 bits hexadecimales para reemplazar el agotado espacio IPv4 sin necesidad de NAT.',
      paraQueSirve: 'Asigna direcciones públicas únicas y globales a cada dispositivo del planeta con autoconfiguración SLAAC.',
      quePasaSiFalta: 'En redes modernas que operan con IPv6-only o DS-Lite, deshabilitar IPv6 te dejará completamente desconectado.',
    },
    interactua: {
      cliExample: 'ping ::1',
      psExample: 'Get-NetIPAddress -AddressFamily IPv6 | Select-Object IPAddress, InterfaceAlias, Type',
      syntaxBreakdown: 'Verifica la salud de la pila IPv6 local y sus direcciones Global, LinkLocal y Loopback.',
      whatToLookFor: 'Dirección LinkLocal fe80:: activa y dirección Global 2000:: si tu ISP tiene IPv6 nativo.',
      technicalMetrics: 'Espacio de direcciones: 3.4 x 10^38 direcciones únicas (340 sextillones).',
    },
    alertaEVO: {
      reversibilityRule: 'Microsoft no recomienda desmarcar IPv6 en las propiedades de la tarjeta de red bajo ninguna circunstancia.',
      safetyWarning: 'Deshabilitar IPv6 en el registro de Windows puede retrasar el arranque del servicio de resolución de nombres.',
    },
    evidenceBadge: {
      code: 'IPV6_SLAAC',
      label: '128-BIT OCEAN',
    },
  },
  {
    id: 'inv-17-06',
    code: '17.06',
    title: 'Gateway',
    subtitle: 'La puerta de salida de la red: 0.0.0.0/0',
    targetMechanism: 'Default Gateway & Next-Hop Routing',
    targetComponent: 'Routing Table / Default Route',
    commandName: 'route print 0.0.0.0',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Tu PC sabe hablar perfectamente con tu impresora o el televisor de tu casa, pero cuando querés abrir google.com, ¿a quién le pide ayuda exactamente?',
      mythVsTruth: {
        mentira: 'Windows envía todos los paquetes directamente a los servidores de Google.',
        verdad: 'Windows compara la IP de destino con su máscara de subred. Si la IP no está en la red local, el kernel la envía ciegamente a la "Puerta de enlace predeterminada" (Default Gateway), que es la dirección IP interna de tu router.',
        comprobalo: 'Ejecutá route print: verás que la ruta 0.0.0.0 con máscara 0.0.0.0 apunta a la IP de tu router.',
      },
    },
    entende: {
      queEs: 'El Default Gateway es el router local que conoce cómo enrutar paquetes más allá de los límites de la subred local.',
      paraQueSirve: 'Es el puente obligado para que cualquier paquete con destino fuera de tu casa o trabajo pueda salir hacia Internet.',
      quePasaSiFalta: 'Si no tenés Gateway configurado, podés compartir archivos con las PCs de tu misma habitación, pero no podés cargar ni un solo byte de Internet.',
    },
    interactua: {
      cliExample: 'route print 0.0.0.0',
      psExample: 'Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Select-Object NextHop, RouteMetric, InterfaceAlias',
      syntaxBreakdown: 'Muestra la ruta por defecto en la tabla de enrutamiento del kernel de Windows.',
      whatToLookFor: 'NextHop con la IP del router y métrica de ruta más baja en la interfaz principal.',
      technicalMetrics: 'Latencia al Gateway en LAN: < 1 ms por Ethernet, < 3 ms por Wi-Fi.',
    },
    alertaEVO: {
      reversibilityRule: 'Tener dos gateways predeterminados con la misma métrica (ej. Ethernet y Wi-Fi activos a la vez) causa tráfico asimétrico.',
      safetyWarning: 'Nunca borres la ruta 0.0.0.0 sin tener una ruta alternativa, o perderás toda la conectividad remota.',
    },
    evidenceBadge: {
      code: 'GATEWAY',
      label: 'ROUTE 0.0.0.0',
    },
  },
  {
    id: 'inv-17-07',
    code: '17.07',
    title: 'DNS',
    subtitle: 'La guía telefónica de Internet y la trampa del puerto UDP 53',
    targetMechanism: 'Domain Name System Resolution & Client Cache',
    targetComponent: 'Dnscache Service / DNS Client Resolver',
    commandName: 'nslookup google.com',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'No te anda ninguna página web, pero si ponés 1.1.1.1 en la barra del navegador, la página carga al instante. ¿Qué está roto?',
      mythVsTruth: {
        mentira: 'Si no cargan las páginas web es porque se cortó la fibra óptica de tu proveedor de Internet.',
        verdad: 'En el 80% de los casos de "no anda Internet", la conexión física y de routing está intacta: lo que colapsó es el servidor DNS de tu proveedor, que no puede traducir "google.com" a su dirección IP.',
        comprobalo: 'Hacé ping 8.8.8.8 (funciona) y luego ping google.com (falla con "No se pudo encontrar el host"). El diagnóstico pericial es 100% fallo de DNS.',
      },
    },
    entende: {
      queEs: 'El protocolo que traduce nombres de dominio legibles para humanos (ej. evolabs.com) en direcciones IP numéricas requeridas por el protocolo IP.',
      paraQueSirve: 'Permite acceder a servicios sin tener que memorizar cadenas de números.',
      quePasaSiFalta: 'Sin DNS, todas las aplicaciones de red fallan al intentar resolver nombres, aunque la conexión IP subyacente esté activa al 100%.',
    },
    interactua: {
      cliExample: 'ipconfig /flushdns',
      psExample: 'Resolve-DnsName -Name google.com -Server 8.8.8.8',
      syntaxBreakdown: 'Resuelve un nombre consultando directamente a un servidor DNS específico saltando la caché local.',
      whatToLookFor: 'Registros tipo A o AAAA retornados con latencia menor a 50 ms.',
      technicalMetrics: 'Puerto UDP/TCP 53 estándar; DoH (DNS over HTTPS) usa puerto TCP 443.',
    },
    alertaEVO: {
      reversibilityRule: 'ipconfig /flushdns vacía la memoria caché local de nombres sin ningún efecto adverso.',
      safetyWarning: 'Configurar servidores DNS públicos no confiables expone a la máquina a ataques de DNS Hijacking y spoofing.',
    },
    evidenceBadge: {
      code: 'DNS_RESOLV',
      label: 'PORT 53 RESOLVER',
    },
  },
  {
    id: 'inv-17-08',
    code: '17.08',
    title: 'ARP',
    subtitle: 'Address Resolution Protocol: casando la IP con la MAC',
    targetMechanism: 'ARP Request/Reply & Neighbor Discovery Table',
    targetComponent: 'ARP Cache / tcpip.sys',
    commandName: 'arp -a',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Tu PC tiene un paquete para la IP 192.168.1.1, pero la placa de red solo entiende direcciones MAC. ¿Cómo se enteró de a qué hardware pertenece esa IP?',
      mythVsTruth: {
        mentira: 'El cable de red sabe a qué computadora va cada paquete por arte de magia.',
        verdad: 'Windows grita un paquete broadcast a toda la red: "¿Quién tiene la IP 192.168.1.1? Dígale a mi MAC". El router responde con su MAC y Windows guarda ese mapeo en su tabla ARP temporal.',
        comprobalo: 'Ejecutá arp -a en tu terminal: verás la tabla de traducción en vivo entre cada dirección IP y su dirección física MAC correspondiente.',
      },
    },
    entende: {
      queEs: 'El protocolo de Capa 2/3 que resuelve direcciones lógicas IP en direcciones físicas MAC en un enlace broadcast.',
      paraQueSirve: 'Construye la cabecera de la trama Ethernet antes de transmitirla por el cable o el aire.',
      quePasaSiFalta: 'Si una entrada ARP no se resuelve (ARP Timeout), Windows arroja el error "Host de destino inaccesible".',
    },
    interactua: {
      cliExample: 'arp -a',
      psExample: 'Get-NetNeighbor -AddressFamily IPv4 | Select-Object IPAddress, LinkLayerAddress, State',
      syntaxBreakdown: 'Muestra la tabla de vecinos ARP con su estado (Reachable, Stale, Permanent).',
      whatToLookFor: 'La IP del Default Gateway asociada a una MAC física real en estado "Reachable".',
      technicalMetrics: 'Expiración de caché ARP dinámica en Windows: entre 15 y 45 segundos para entradas inactivas.',
    },
    alertaEVO: {
      reversibilityRule: 'netsh interface ip delete arpcache vacía la tabla ARP sin reiniciar el equipo.',
      safetyWarning: 'Ataques de ARP Spoofing (Man In The Middle) manipulan esta tabla para interceptar tráfico de red en LANs públicas.',
    },
    evidenceBadge: {
      code: 'ARP_CACHE',
      label: 'ARP TABLE',
    },
  },
  {
    id: 'inv-17-09',
    code: '17.09',
    title: 'Routing',
    subtitle: 'La tabla de enrutamiento interna del kernel de Windows',
    targetMechanism: 'Kernel Forwarding Information Base (FIB) & Metrics',
    targetComponent: 'tcpip.sys / Route Table',
    commandName: 'route print',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Tenés conectada la PC por cable Ethernet al switch del trabajo y al mismo tiempo por Wi-Fi para safar. ¿Por cuál de los dos cables/antenas viaja tu llamada de Zoom?',
      mythVsTruth: {
        mentira: 'Windows divide los datos equitativamente mitad por cable y mitad por Wi-Fi automáticamente.',
        verdad: 'Windows evalúa su tabla de rutas interna y utiliza exclusivamente la interfaz que tenga la "Métrica de interfaz" más baja (menor costo). Ethernet suele tener métrica 25 y Wi-Fi 35, por lo que todo viaja por cable.',
        comprobalo: 'Ejecutá route print y compará la columna "Métrica" de tus dos adaptadores en la ruta 0.0.0.0.',
      },
    },
    entende: {
      queEs: 'La tabla de decisiones de enrutamiento del stack de red de Windows, que determina el próximo salto para cada paquete IP emitido.',
      paraQueSirve: 'Permite coexistir múltiples adaptadores de red (VPNs, Wi-Fi, Ethernet, Hyper-V) sin colisiones de destino.',
      quePasaSiFalta: 'Si la métrica automática de Windows asigna una métrica menor a una interfaz sin salida (ej. un adaptador virtual de máquina virtual), el equipo queda desconectado de Internet.',
    },
    interactua: {
      cliExample: 'route print',
      psExample: 'Get-NetRoute | Where-Object DestinationPrefix -eq "0.0.0.0/0" | Sort-Object RouteMetric',
      syntaxBreakdown: 'Ordena las rutas por defecto por su costo de métrica para saber qué adaptador tiene prioridad absoluta.',
      whatToLookFor: 'La interfaz con mejor velocidad física debe poseer la menor RouteMetric.',
      technicalMetrics: 'Métricas automáticas de Windows: 1 Gbps = 25, 100 Mbps = 35, Wi-Fi débil = 50.',
    },
    alertaEVO: {
      reversibilityRule: 'Revertir métricas manuales a automáticas con Set-NetIPInterface -InterfaceMetric $null.',
      safetyWarning: 'Agregar rutas estáticas permanentes con route add -p puede causar dolores de cabeza meses después si la topología de red cambia.',
    },
    evidenceBadge: {
      code: 'ROUTING',
      label: 'KERNEL FIB',
    },
  },
  {
    id: 'inv-17-10',
    code: '17.10',
    title: 'TCP',
    subtitle: 'Transmission Control Protocol: el apretón de manos SYN/ACK y la ventana deslizante',
    targetMechanism: '3-Way Handshake, Sequence Numbers & Sliding Window',
    targetComponent: 'tcpip.sys / TCP Engine',
    commandName: 'netstat -ano -p tcp',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Descargás un archivo de 10 GB y no se pierde ni un solo byte, a pesar de que atravesó 25 routers a través de un océano. ¿Quién garantiza esa perfección?',
      mythVsTruth: {
        mentira: 'Internet es perfecto y los cables submarinos nunca pierden paquetes.',
        verdad: 'Internet pierde millones de paquetes por segundo. Es el protocolo TCP el que numera cada segmento (Sequence Number), exige un acuse de recibo (ACK) y retransmite inmediatamente cualquier byte que no haya llegado.',
        comprobalo: 'Ejecutá netstat -ano -p tcp en tu terminal y observá los estados: ESTABLISHED, TIME_WAIT, CLOSE_WAIT y LISTENING.',
      },
    },
    entende: {
      queEs: 'El protocolo orientado a conexión de Capa 4 que proporciona entrega confiable, ordenada y con control de congestión de flujos de bytes.',
      paraQueSirve: 'Es la base de la navegación web (HTTP/HTTPS), transferencia de archivos, bases de datos y correo electrónico.',
      quePasaSiFalta: 'Si un firewall bloquea los paquetes TCP SYN o hay descarte masivo, las aplicaciones sufren timeouts de conexión permanentes.',
    },
    interactua: {
      cliExample: 'netstat -ano -p tcp | findstr "ESTABLISHED"',
      psExample: 'Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess',
      syntaxBreakdown: 'Muestra todas las conexiones TCP vivas, sus puertos de origen/destino y el PID del proceso dueño.',
      whatToLookFor: 'Conexiones en estado Established asociadas a procesos legítimos del sistema.',
      technicalMetrics: 'Handshake inicial de 3 vías: SYN -> SYN/ACK -> ACK (demora 1 RTT completo).',
    },
    alertaEVO: {
      reversibilityRule: 'Cerrar el proceso con Stop-Process -Id <PID> envía un paquete TCP FIN/RST y cierra el socket limpiamente.',
      safetyWarning: 'Un exceso masivo de conexiones en estado TIME_WAIT o SYN_SENT puede indicar saturación o ataque de denegación de servicio.',
    },
    evidenceBadge: {
      code: 'TCP_STACK',
      label: '3-WAY HANDSHAKE',
    },
  },
  {
    id: 'inv-17-11',
    code: '17.11',
    title: 'UDP',
    subtitle: 'User Datagram Protocol: dispara y olvida para gaming y streaming',
    targetMechanism: 'Connectionless Transport & Zero Overhead Datagrams',
    targetComponent: 'tcpip.sys / UDP Engine',
    commandName: 'netstat -ano -p udp',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'En un juego competitivo o en una llamada de Discord, si un paquete se pierde, a nadie le importa recuperarlo medio segundo tarde: el juego necesita el presente, no el pasado.',
      mythVsTruth: {
        mentira: 'UDP es un protocolo defectuoso porque no garantiza que los datos lleguen.',
        verdad: 'UDP fue diseñado expresamente sin acuse de recibo, sin handshake y sin retransmisión para ofrecer la mínima latencia física posible en comunicaciones de tiempo real.',
        comprobalo: 'Revisá los puertos de Discord o juegos online: todos usan sockets UDP donde el overhead de cabecera es de apenas 8 bytes frente a los 20-60 bytes de TCP.',
      },
    },
    entende: {
      queEs: 'El protocolo no orientado a conexión de Capa 4 que transmite datagramas directos sin verificación de entrega.',
      paraQueSirve: 'Es la espina dorsal del gaming multijugador, streaming de video en vivo (WebRTC/RTP), DNS y llamadas VoIP.',
      quePasaSiFalta: 'Si la red sufre jitter o descarte de UDP, la voz se entrecorta y los juegos sufren "teleports" o "rubberbanding".',
    },
    interactua: {
      cliExample: 'netstat -ano -p udp',
      psExample: 'Get-NetUDPEndpoint | Select-Object LocalAddress, LocalPort, OwningProcess',
      syntaxBreakdown: 'Lista todos los puertos UDP abiertos escuchando datagramas en la máquina.',
      whatToLookFor: 'Puertos UDP conocidos: 53 (DNS), 67/68 (DHCP), 123 (NTP Horario), 3702 (WSD).',
      technicalMetrics: 'Cabecera UDP ultra liviana: solo 8 bytes (Source Port, Dest Port, Length, Checksum).',
    },
    alertaEVO: {
      reversibilityRule: 'Cerrar el socket finaliza la recepción de datagramas de inmediato.',
      safetyWarning: 'El tráfico UDP puede ser usado para ataques de amplificación DNS o NTP reflection.',
    },
    evidenceBadge: {
      code: 'UDP_ZERO',
      label: 'ZERO OVERHEAD',
    },
  },
  {
    id: 'inv-17-12',
    code: '17.12',
    title: 'Wi-Fi',
    subtitle: '802.11: la física invisible de las frecuencias de 2.4 GHz, 5 GHz y 6 GHz',
    targetMechanism: 'WLAN 802.11a/b/g/n/ac/ax Protocol & Radio Bands',
    targetComponent: 'wlanapi.dll / Native Wi-Fi Service',
    commandName: 'netsh wlan show interfaces',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Estás al lado del router y volás a 800 Mbps en 5 GHz; caminás dos habitaciones más lejos, atravesás dos paredes de ladrillo, y de golpe caés a 30 Mbps inestables.',
      mythVsTruth: {
        mentira: '5 GHz es siempre mejor que 2.4 GHz en cualquier rincón de la casa.',
        verdad: 'Por física electromagnética, las frecuencias altas (5 GHz / 6 GHz) se atenúan mucho más rápido ante obstáculos sólidos. 2.4 GHz tiene menor ancho de banda pero mayor longitud de onda y poder de penetración en paredes.',
        comprobalo: 'Ejecutá netsh wlan show interfaces y compará la línea "Canal" y "Banda" con la "Señal" en distintos puntos de tu domicilio.',
      },
    },
    entende: {
      queEs: 'La especificación IEEE 802.11 para redes de área local inalámbricas (Wi-Fi 5 / Wi-Fi 6 / Wi-Fi 6E).',
      paraQueSirve: 'Conecta dispositivos a la red mediante modulación de radiofrecuencia digital.',
      quePasaSiFalta: 'Si la tarjeta de red Wi-Fi no soporta los canales DFS o Wi-Fi 6, quedará limitada a bandas congestionadas con alto ruido.',
    },
    interactua: {
      cliExample: 'netsh wlan show interfaces',
      psExample: 'netsh wlan show networks mode=bssid',
      syntaxBreakdown: 'Muestra todas las redes inalámbricas al alcance, su BSSID, canal de radio, cifrado y potencia de señal.',
      whatToLookFor: 'Señal > 75%, Canal en 5 GHz (ej. 36, 40, 149) y Protocolo 802.11ax (Wi-Fi 6).',
      technicalMetrics: 'Canales 2.4 GHz: 20 MHz de ancho; Canales 5 GHz: 80 o 160 MHz de ancho de banda.',
    },
    alertaEVO: {
      reversibilityRule: 'Reconectar a la banda de 5 GHz mediante un SSID separado garantiza la máxima velocidad.',
      safetyWarning: 'El uso de canales DFS (52-144) puede causar desconexiones automáticas si el router detecta radares meteorológicos o de aeropuerto.',
    },
    evidenceBadge: {
      code: 'WIFI_80211',
      label: 'IEEE 802.11AX',
    },
  },
  {
    id: 'inv-17-13',
    code: '17.13',
    title: 'Ethernet',
    subtitle: 'IEEE 802.3: el estándar invencible de par trenzado',
    targetMechanism: 'Baseband Ethernet Physical Layer & CSMA/CD',
    targetComponent: 'PCIe Ethernet Controller / RJ-45 PHY',
    commandName: 'Get-NetAdapter | Where-Object PhysicalMediaType -eq "802.3"',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'No importa si tu Wi-Fi es Wi-Fi 7 con 8 antenas: un simple cable de red de $5 dólares sigue teniendo menor latencia, cero jitter y cero interferencias de microondas.',
      mythVsTruth: {
        mentira: 'El cable Ethernet es solo un alambre que conduce electricidad.',
        verdad: 'Un cable Ethernet UTP tiene 4 pares trenzados con distinta cantidad de vueltas por pulgada para cancelar la diafonía (crosstalk) electromagnética y opera en Full-Duplex real (envío y recepción simultáneos sin colisiones).',
        comprobalo: 'Hacé un ping sostenido a tu router por cable: verás 0 ms o < 1 ms constante con variación de 0.0 ms.',
      },
    },
    entende: {
      queEs: 'El estándar de telecomunicaciones por cable para redes locales (IEEE 802.3).',
      paraQueSirve: 'Brinda el medio físico más confiable, veloz y seguro para transmisión de datos de alta velocidad.',
      quePasaSiFalta: 'En servidores, gaming competitivo o estaciones de producción, depender de Wi-Fi en lugar de Ethernet introduce microcortes y variación de frametime.',
    },
    interactua: {
      cliExample: 'wmic nic where "NetConnectionStatus=2" get Name,Speed',
      psExample: 'Get-NetAdapterHardwareInfo | Select-Object InterfaceDescription, BusType, SlotNumber',
      syntaxBreakdown: 'Muestra información de hardware de la controladora Ethernet y su bus de enlace.',
      whatToLookFor: 'Bus PCIe x1 activo con soporte de tramas gigantes (Jumbo Frames) y descarga de hardware (Offloads).',
      technicalMetrics: 'Latencia intrínseca del medio de cobre: ~5 nanosegundos por metro.',
    },
    alertaEVO: {
      reversibilityRule: 'Conectar un cable Ethernet deshabilita o relega automáticamente el Wi-Fi según la métrica.',
      safetyWarning: 'Tirar cables Ethernet paralelos a cables de 220V de alta tensión sin blindaje STP induce ruido electromagnético.',
    },
    evidenceBadge: {
      code: 'ETH_8023',
      label: '802.3 COPPER',
    },
  },
  {
    id: 'inv-17-14',
    code: '17.14',
    title: '100 Mbps / 1 Gbps / 2.5 Gbps',
    subtitle: 'La física de los pares: 2 pares vs 4 pares y la velocidad del enlace',
    targetMechanism: 'Link Negotiation Speeds & Twisted Pair Architecture',
    targetComponent: 'Ethernet PHY Chip / Switch Port',
    commandName: '(Get-NetAdapter -Name "Ethernet").LinkSpeed',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Contrataste 500 Mbps de fibra óptica, pero al hacer un test de velocidad la aguja se clava matemáticamente en 94 Mbps. ¿Por qué 94 y no más?',
      mythVsTruth: {
        mentira: 'Tu proveedor de Internet te está estafando con la velocidad.',
        verdad: '94 Mbps es el límite matemático exacto del throughput útil de un enlace físico de 100 Mbps descontando el overhead de tramas Ethernet e IP. Tu placa de red negoció a 100 Mbps en lugar de 1000 Mbps.',
        comprobalo: 'Abrí el estado de la conexión en Windows: si dice "Velocidad del vínculo: 100/100 (Mbps)", estás atrapado en Fast Ethernet.',
      },
    },
    entende: {
      queEs: 'Los tres escalones de velocidad física en redes locales: 100BASE-TX (Fast Ethernet), 1000BASE-T (Gigabit Ethernet) y 2.5GBASE-T (Multi-Gigabit).',
      paraQueSirve: 'Determina el ancho de banda bruto máximo que puede circular por el conector físico.',
      quePasaSiFalta: 'Si la placa queda en 100 Mbps, desperdiciás el 80% del ancho de banda contratado de tu fibra óptica.',
    },
    interactua: {
      cliExample: 'powershell -Command "(Get-NetAdapter).LinkSpeed"',
      psExample: 'Get-NetAdapter | Select-Object Name, LinkSpeed, Status',
      syntaxBreakdown: 'Consulta la propiedad LinkSpeed del adaptador de red activo en Windows.',
      whatToLookFor: 'LinkSpeed : 1 Gbps o 2.5 Gbps en lugar de 100 Mbps.',
      technicalMetrics: '100 Mbps requiere solo 2 pares (4 hilos); 1 Gbps y 2.5 Gbps requieren obligatoriamente los 4 pares (8 hilos) sanos.',
    },
    alertaEVO: {
      reversibilityRule: 'Reemplazar el cable o reconectar firmemente los conectores RJ-45 suele resolver la caída a 100 Mbps.',
      safetyWarning: 'Forzar "1.0 Gbps Full Duplex" en el driver si el cable está dañado causará la desconexión total del enlace (Cable desconectado).',
    },
    evidenceBadge: {
      code: 'SPEED_PHY',
      label: 'LINK SPEED PHY',
    },
  },
  {
    id: 'inv-17-15',
    code: '17.15',
    title: 'Autonegotiation',
    subtitle: 'El pulso FLP (Fast Link Pulse) y la degradación silenciosa',
    targetMechanism: 'IEEE 802.3u Auto-Negotiation & FLP Bursts',
    targetComponent: 'Ethernet Transceiver (PHY)',
    commandName: 'Get-NetAdapterAdvancedProperty -DisplayName "*Speed*"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Ayer tu PC conectaba a 1 Gbps, pero hoy sin tocar nada amaneció en 100 Mbps. ¿Cómo se negocia la velocidad entre la PC y el switch?',
      mythVsTruth: {
        mentira: 'La velocidad de la red la decide Windows según el uso que le estés dando.',
        verdad: 'Al conectar el cable, los chips de ambos extremos intercambian ráfagas eléctricas de pulsos rápidos (Fast Link Pulse - FLP) anunciando sus capacidades. Si un solo hilo de los 8 está quebrado o hace mal contacto, la autonegociación degrada a 100 Mbps por seguridad.',
        comprobalo: 'Mové suavemente la ficha RJ-45 detrás del gabinete: si la luz cambia de color o el enlace cae por un segundo, hay una pista rota o suciedad en los pines.',
      },
    },
    entende: {
      queEs: 'El protocolo a nivel de silicio que permite a dos dispositivos conectados por cable acordar automáticamente la máxima velocidad y modo dúplex comunes.',
      paraQueSirve: 'Garantiza interoperabilidad transparente entre equipos antiguos de 10/100 Mbps y equipos modernos de 1/2.5 Gbps.',
      quePasaSiFalta: 'Si un extremo está en "Autonegociación" y el otro está forzado a mano en "100 Mbps Full Duplex", se produce un "Duplex Mismatch" que llena la red de colisiones y caídas de rendimiento catastróficas.',
    },
    interactua: {
      cliExample: 'wmic nicconfig get Description,Speed',
      psExample: 'Get-NetAdapterAdvancedProperty -RegistryKeyword "*SpeedDuplex" | Select-Object DisplayValue, RegistryValue',
      syntaxBreakdown: 'Audita si el adaptador está configurado en Negociación Automática o tiene un valor manual rígido.',
      whatToLookFor: 'DisplayValue en "Auto Negotiation" (Negociación automática).',
      technicalMetrics: 'Tiempo de negociación FLP: 100 a 150 milisegundos tras la conexión física.',
    },
    alertaEVO: {
      reversibilityRule: 'Mantener siempre la propiedad Speed & Duplex en "Auto Negotiation".',
      safetyWarning: 'Nunca forces el modo Duplex en un extremo si no tenés control del switch al que está conectado.',
    },
    evidenceBadge: {
      code: 'AUTONEG',
      label: 'FLP BURST',
    },
  },
  {
    id: 'inv-17-16',
    code: '17.16',
    title: 'Cable',
    subtitle: 'Cat 5e, Cat 6, Cat 6a y la estafa del cable de aluminio con baño de cobre (CCA)',
    targetMechanism: 'Cable Category Standards, TIA/EIA-568-B & Solid Copper vs CCA',
    targetComponent: 'Physical UTP/STP Infrastructure',
    commandName: 'netsh interface ipv4 show subinterfaces',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Compraste un cable de red de 20 metros baratísimo por Internet. Funciona a 100 Mbps pero cuando querés pasar a 1 Gbps se corta a cada rato. ¿Por qué?',
      mythVsTruth: {
        mentira: 'Todos los cables de red son iguales por dentro.',
        verdad: 'Muchos cables baratos están fabricados con CCA (Copper-Clad Aluminium, aluminio bañado en una microcapa de cobre). El aluminio tiene mayor resistencia eléctrica, se quiebra con facilidad y es incapaz de sostener 1 Gbps o alimentación PoE en distancias medias.',
        comprobalo: 'Raspá con una tijera uno de los filamentos de cobre de un cable viejo: si por dentro aparece color plateado, es aluminio CCA.',
      },
    },
    entende: {
      queEs: 'Las categorías de cableado estructurado: Cat 5e (hasta 1 Gbps a 100 MHz), Cat 6 (hasta 10 Gbps a 250 MHz en tramos cortos) y Cat 6a (10 Gbps garantizados a 500 MHz en 100 metros).',
      paraQueSirve: 'Asegura la integridad física de las señales de alta frecuencia mediante cobre 100% puro (Bare Copper) y trenzado calibrado.',
      quePasaSiFalta: 'Cables aplastados por puertas o doblados a 90 grados sufren retorno de onda (Return Loss) y pérdida de paquetes masiva.',
    },
    interactua: {
      cliExample: 'netstat -e',
      psExample: 'Get-NetAdapterStatistics | Select-Object Name, ReceivedDiscardedPackets, OutboundDiscardedPackets',
      syntaxBreakdown: 'Audita errores y paquetes descartados a nivel de interfaz de red.',
      whatToLookFor: 'ReceivedDiscardedPackets : 0 y OutboundDiscardedPackets : 0.',
      technicalMetrics: 'Radio de curvatura mínimo: no doblar con un radio menor a 4 veces el diámetro del cable.',
    },
    alertaEVO: {
      reversibilityRule: 'Reemplazar cables CCA por cables Cat 6 con conductores 100% cobre 24 AWG.',
      safetyWarning: 'Evitá armar cables de red con conectores de mala calidad sin crimpadora profesional calibrada.',
    },
    evidenceBadge: {
      code: 'CABLE_CAT',
      label: 'CAT 6 COPPER',
    },
  },
  {
    id: 'inv-17-17',
    code: '17.17',
    title: 'Signal',
    subtitle: 'RSSI, dBm y la relación señal/ruido (SNR) en conexiones inalámbricas',
    targetMechanism: 'Received Signal Strength Indicator (RSSI) & Noise Floor',
    targetComponent: 'WLAN Radio Transceiver',
    commandName: 'netsh wlan show interfaces',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows te muestra 3 rayitas de Wi-Fi y parece que todo está bien, pero los juegos tienen lagazos insoportables. ¿Por qué las rayitas de Windows son un engaño?',
      mythVsTruth: {
        mentira: 'Las "rayitas" de Wi-Fi de Windows miden la velocidad de tu conexión.',
        verdad: 'Las barritas de Windows son una representación visual simplificada que puede indicar señal aceptable aun cuando el nivel de ruido ambiental (SNR) destruya los paquetes por interferencias de redes vecinas.',
        comprobalo: 'Ejecutá netsh wlan show interfaces y leé el porcentaje exacto de "Señal": si está por debajo del 75%, la tasa de modulación cae en picada.',
      },
    },
    entende: {
      queEs: 'El nivel de potencia de la señal de radiofrecuencia recibida, medido en decibelios-milivatio (dBm) o en porcentaje normalizado.',
      paraQueSirve: 'Determina qué esquema de modulación (MCS Index) puede usar la antena: a mejor señal, mayor número de bits por símbolo de radio.',
      quePasaSiFalta: 'Señales por debajo de -75 dBm provocan retransmisiones masivas de tramas 802.11 y aumentos bruscos de jitter.',
    },
    interactua: {
      cliExample: 'netsh wlan show interfaces',
      psExample: '(netsh wlan show interfaces) -match "Señal|Signal|Canal|Channel|Radio"',
      syntaxBreakdown: 'Filtra las propiedades clave de radiofrecuencia de la interfaz Wi-Fi.',
      whatToLookFor: 'Señal superior al 80% (equivalente a mejor que -65 dBm).',
      technicalMetrics: 'Escala dBm: -30 dBm (perfecto al lado del router), -65 dBm (bueno), -75 dBm (límite), -85 dBm (desconexión).',
    },
    alertaEVO: {
      reversibilityRule: 'Orientar las antenas del router o mover la antena externa del PC mejora la señal de 10 a 15 dBm.',
      safetyWarning: 'Poner el router dentro de un mueble cerrado o detrás de un televisor atenúa la señal en más de 20 dBm de golpe.',
    },
    evidenceBadge: {
      code: 'RSSI_DBM',
      label: 'RSSI METRICS',
    },
  },
  {
    id: 'inv-17-18',
    code: '17.18',
    title: 'IP 169.254',
    subtitle: 'APIPA: el grito desesperado de Windows cuando nadie le responde',
    targetMechanism: 'Automatic Private IP Addressing (APIPA) RFC 3927',
    targetComponent: 'DhcpClient / AutoConfigurationIPAddress',
    commandName: 'ipconfig | findstr "169.254"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Prendés la máquina, ves un triángulo amarillo de advertencia y al poner ipconfig ves una dirección que empieza con 169.254.x.x. ¿Quién te dio esa IP tan rara?',
      mythVsTruth: {
        mentira: 'Esa IP es un virus o un hacker que tomó el control de tu tarjeta de red.',
        verdad: '169.254.0.0/16 es el rango APIPA (Automatic Private IP Addressing). Es el propio Windows quien se autoasigna esa dirección cuando emitió solicitudes DHCP y ningún router le respondió.',
        comprobalo: 'Si tenés una IP 169.254, tu problema NO es de Windows: es que el cable está desconectado del router, el Wi-Fi no autenticó o el servicio DHCP del router colapsó.',
      },
    },
    entende: {
      queEs: 'Un mecanismo de emergencia estandarizado por la RFC 3927 para que dos computadoras conectadas punto a punto por un cable puedan comunicarse sin necesidad de router.',
      paraQueSirve: 'Permite compartir archivos o diagnosticar una máquina aislada sin configurar parámetros manuales.',
      quePasaSiFalta: 'En una red con conexión a Internet, tener una IP 169.254 confirma que estás en un limbo de Capa 3: no tenés Default Gateway y no podés salir a ningún lado.',
    },
    interactua: {
      cliExample: 'ipconfig /all | findstr /i "Autoconfiguración Autoconfiguration"',
      psExample: 'Get-NetIPAddress | Where-Object IPAddress -like "169.254.*"',
      syntaxBreakdown: 'Detecta si alguna interfaz del equipo está atrapada en el estado de fallo APIPA.',
      whatToLookFor: 'Cero interfaces con IP 169.254 en un sistema operativo en producción conectado a un router.',
      technicalMetrics: 'Tiempo de espera antes de activar APIPA: 4 reintentos de DHCP Discover (~60 segundos).',
    },
    alertaEVO: {
      reversibilityRule: 'Reiniciar el router o ejecutar ipconfig /renew una vez restablecido el enlace físico devuelve una IP legítima.',
      safetyWarning: 'No intentes configurar una IP estática en el rango 169.254 para trabajar normalmente: no tiene capacidad de enrutamiento.',
    },
    evidenceBadge: {
      code: 'APIPA_169',
      label: 'APIPA RFC 3927',
    },
  },
  {
    id: 'inv-17-19',
    code: '17.19',
    title: 'Connected without Internet',
    subtitle: 'NCSI: la sonda HTTP/DNS que decide el icono del mundito',
    targetMechanism: 'Network Connectivity Status Indicator (NCSI) Active Probing',
    targetComponent: 'NlaSvc (Network Location Awareness) / msftconnecttest.com',
    commandName: 'Get-NetConnectionProfile',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Tenés el icono del "globo terráqueo" o el cartel "Sin acceso a Internet", pero abrís una terminal, hacés ping a 8.8.8.8 y responde perfecto. ¿Por qué Windows miente?',
      mythVsTruth: {
        mentira: 'Windows sabe si hay Internet enviando pings continuos a los servidores de Microsoft.',
        verdad: 'Windows usa NCSI (Network Connectivity Status Indicator): intenta resolver el dominio dns.msftncsi.com y descargar el archivo ncsi.txt desde http://www.msftconnecttest.com/connecttest.txt esperando leer "Microsoft Connect Test". Si esa petición HTTP falla (por un portal cautivo o un proxy), marca "Sin Internet" aunque el resto de la red funcione.',
        comprobalo: 'Intentá abrir http://www.msftconnecttest.com/connecttest.txt en tu navegador para ver la prueba activa que realiza el kernel.',
      },
    },
    entende: {
      queEs: 'El subsistema de detección de estado de conectividad de Windows, integrado en el servicio NLA (Network Location Awareness).',
      paraQueSirve: 'Informa a aplicaciones como Outlook, OneDrive, Teams o Windows Update si deben intentar sincronizar o mantenerse en modo offline.',
      quePasaSiFalta: 'Si NCSI falla, aplicaciones de Microsoft como la Tienda o Teams se niegan a conectar, creyendo que la máquina está desconectada del mundo.',
    },
    interactua: {
      cliExample: 'curl -I http://www.msftconnecttest.com/connecttest.txt',
      psExample: 'Get-NetConnectionProfile | Select-Object Name, NetworkCategory, IPv4Connectivity',
      syntaxBreakdown: 'Consulta el estado de conectividad reportado por NCSI para cada perfil de red activo.',
      whatToLookFor: 'IPv4Connectivity : Internet en lugar de NoTraffic o LocalAccess.',
      technicalMetrics: 'Sonda activa NCSI: resolución DNS de dns.msftncsi.com (debe retornar 131.107.255.255).',
    },
    alertaEVO: {
      reversibilityRule: 'Habilitar EnableActiveProbing en HKLM\\SYSTEM\\CurrentControlSet\\Services\\NlaSvc\\Parameters\\Internet restaura NCSI.',
      safetyWarning: 'Desactivar NCSI por "privacidad" rompe la autenticación en portales cautivos de hoteles y aeropuertos.',
    },
    evidenceBadge: {
      code: 'NCSI_GLOBE',
      label: 'NCSI PROBE',
    },
  },
  {
    id: 'inv-17-20',
    code: '17.20',
    title: 'DNS failure',
    subtitle: 'NXDOMAIN, SERVFAIL y el bypass con 1.1.1.1 y 8.8.8.8',
    targetMechanism: 'DNS Query Lifecycle, Error Codes & Forwarders',
    targetComponent: 'DNS Resolver Client / UDP 53',
    commandName: 'Resolve-DnsName -Name google.com',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Querés entrar a una página web y el navegador te tira: DNS_PROBE_FINISHED_NXDOMAIN o ERR_NAME_NOT_RESOLVED. ¿Qué ocurrió en ese viaje de 50 milisegundos?',
      mythVsTruth: {
        mentira: 'El servidor web de la página que querés ver se cayó.',
        verdad: 'El servidor DNS que tiene configurado tu Windows (usualmente el de tu proveedor de cable) no pudo encontrar el registro de nombres o respondió con un código de error SERVFAIL/NXDOMAIN.',
        comprobalo: 'Cambiá temporalmente el servidor DNS en el comando: Resolve-DnsName google.com -Server 1.1.1.1. Si con Cloudflare responde y con el tuyo no, tu DNS local está colapsado.',
      },
    },
    entende: {
      queEs: 'El análisis de los códigos de respuesta del protocolo DNS ante solicitudes fallidas de traducción de nombres.',
      paraQueSirve: 'Permite diagnosticar instantáneamente si un problema de navegación es de resolución de nombres o de enrutamiento físico.',
      quePasaSiFalta: 'Si no se cambia el DNS defectuoso por servidores confiables (Cloudflare 1.1.1.1, Google 8.8.8.8, Quad9 9.9.9.9), la navegación se vuelve errática e insoportable.',
    },
    interactua: {
      cliExample: 'nslookup google.com 1.1.1.1',
      psExample: 'Resolve-DnsName -Name google.com -Server 8.8.8.8 | Select-Object Name, IPAddress',
      syntaxBreakdown: 'Consulta directa a Google DNS saltando el resolver local del proveedor.',
      whatToLookFor: 'Direcciones IP retornadas sin demoras ni errores de timeout.',
      technicalMetrics: 'Tiempo de respuesta DNS óptimo: < 20 ms; > 100 ms degrada visiblemente la carga web.',
    },
    alertaEVO: {
      reversibilityRule: 'Configurar servidores DNS en el adaptador con Set-DnsClientServerAddress se revierte a automático en un clic.',
      safetyWarning: 'Asegurate de configurar siempre un DNS primario y uno secundario de respaldo para evitar cortes.',
    },
    evidenceBadge: {
      code: 'DNS_FAIL',
      label: 'NXDOMAIN TRIAGE',
    },
  },
  {
    id: 'inv-17-21',
    code: '17.21',
    title: 'Packet loss',
    subtitle: 'La pérdida de paquetes: la verdadera asesina de la experiencia de usuario',
    targetMechanism: 'Packet Loss Measurement & ICMP Echo Sequence',
    targetComponent: 'tcpip.sys / Path Verification',
    commandName: 'ping 8.8.8.8 -n 50',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Podés tener 1000 Megas de velocidad simétrica, pero si tenés apenas un 2% de pérdida de paquetes, tu llamada de Teams se congela, los videos se traban y los juegos son injugables.',
      mythVsTruth: {
        mentira: 'Lo único que importa en una conexión a Internet es cuántos megas tenés contratados.',
        verdad: 'El ancho de banda solo determina cuántos datos pueden viajar por segundo; la pérdida de paquetes mide cuántos de esos datos son destruidos en el camino, obligando a retransmisiones continuas que destruyen la experiencia.',
        comprobalo: 'Tirá un ping prolongado con 50 o 100 paquetes: ping 1.1.1.1 -n 50. La línea final "paquetes perdidos" debe ser obligatoriamente 0% (0% perdidos).',
      },
    },
    entende: {
      queEs: 'El porcentaje de paquetes de datos transmitidos que no llegan a su destino o son descartados por routers intermedios saturados.',
      paraQueSirve: 'Es la métrica reina de calidad de enlace para diagnosticar problemas de cableado, ruido de Wi-Fi o congestión de fibra óptica.',
      quePasaSiFalta: 'Pérdidas de paquetes superiores al 1% degradan las transferencias TCP a una fracción de su velocidad real por culpa del algoritmo de control de congestión.',
    },
    interactua: {
      cliExample: 'ping 1.1.1.1 -n 30',
      psExample: 'Test-Connection -TargetName 1.1.1.1 -Count 30 | Measure-Object -Property ResponseTime -Average',
      syntaxBreakdown: 'Envía 30 paquetes consecutivos para obtener una muestra estadísticamente representativa de pérdida y latencia.',
      whatToLookFor: '0% de pérdida de paquetes (0% loss) en una conexión de calidad profesional.',
      technicalMetrics: 'Pérdida aceptable en LAN: 0.0%; Pérdida aceptable en WAN/Internet: < 0.1%.',
    },
    alertaEVO: {
      reversibilityRule: 'Prueba no invasiva y de solo lectura.',
      safetyWarning: 'Hacer ping a ciertos servidores con tamaños de paquete excesivos (-l 65500) puede ser bloqueado por firewalls perimetrales.',
    },
    evidenceBadge: {
      code: 'PKT_LOSS',
      label: 'ZERO PACKET LOSS',
    },
  },
  {
    id: 'inv-17-22',
    code: '17.22',
    title: 'Latency',
    subtitle: 'RTT: el viaje de ida y vuelta a la velocidad de la luz en la fibra',
    targetMechanism: 'Round Trip Time (RTT), Propagation Delay & Bufferbloat',
    targetComponent: 'ICMP / TCP ACK Timing',
    commandName: 'tracert 8.8.8.8',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'La luz en el vacío viaja a 300.000 km/s, pero adentro del vidrio de la fibra óptica viaja a 200.000 km/s. ¿Por qué la latencia a un servidor en Europa nunca va a poder ser menor a 120 ms?',
      mythVsTruth: {
        mentira: 'Un software o un "optimizador de ping" puede bajarte el ping a cero.',
        verdad: 'La latencia está limitada por las leyes inflexibles de la física (tiempo de propagación) más el tiempo de conmutación de cada router intermedio. Ningún programa de software puede hacer que los fotones viajen más rápido que la luz.',
        comprobalo: 'Hacé tracert 8.8.8.8: verás salto por salto cuántos milisegundos toma llegar a tu router local (1 ms), a la central de tu ISP (8 ms) y al nodo internacional.',
      },
    },
    entende: {
      queEs: 'El Round Trip Time (RTT), o tiempo en milisegundos que tarda un paquete de datos en ir desde tu equipo hasta un destino y volver con la respuesta.',
      paraQueSirve: 'Determina la capacidad de respuesta y fluidez en juegos online, escritorios remotos y transacciones financieras.',
      quePasaSiFalta: 'Si la latencia se dispara bajo carga de subida o bajada, la conexión sufre de Bufferbloat (colas de buffer saturadas en el router).',
    },
    interactua: {
      cliExample: 'tracert -d 8.8.8.8',
      psExample: 'Test-NetConnection -ComputerName 8.8.8.8 -TraceRoute',
      syntaxBreakdown: 'Mapea la ruta completa salto por salto sin demorarse resolviendo nombres inversos (-d).',
      whatToLookFor: 'Salto 1 (Router local) < 1 ms; Salto 2 (Gateway del ISP) < 10 ms.',
      technicalMetrics: 'Latencia típica: Fibra local 2-10 ms; Servidor regional 20-40 ms; Intercontinental 120-180 ms.',
    },
    alertaEVO: {
      reversibilityRule: 'Prueba pasiva de diagnóstico de ruta.',
      safetyWarning: 'Algunos routers troncales descartan paquetes ICMP Time Exceeded, mostrando asteriscos (*) sin que signifique un corte real.',
    },
    evidenceBadge: {
      code: 'RTT_DELAY',
      label: 'ROUND TRIP TIME',
    },
  },
  {
    id: 'inv-17-23',
    code: '17.23',
    title: 'Jitter',
    subtitle: 'La variación del retardo: cuando el ping baila el vals',
    targetMechanism: 'Packet Delay Variation (PDV) & Buffer Depletion',
    targetComponent: 'Audio/Video Jitter Buffer & Real-Time Engine',
    commandName: 'ping 1.1.1.1 -n 30',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Tener 50 ms de ping constante es un placer. Tener 20 ms que saltan a 150 ms cada 3 segundos es un desastre que te expulsa de los servidores. ¿Qué es esa variación?',
      mythVsTruth: {
        mentira: 'Tener jitter alto es lo mismo que tener ping alto.',
        verdad: 'El jitter es la varianza estadística del ping (Packet Delay Variation). Un ping estable permite a los buffers sincronizarse; un jitter alto vacía los buffers de audio y video, causando congelamiento y desincronización.',
        comprobalo: 'Calculá la diferencia entre tu ping mínimo y tu ping máximo en una serie de 30 paquetes: esa brecha es tu dispersión de jitter.',
      },
    },
    entende: {
      queEs: 'La fluctuación temporal en el tiempo de llegada de paquetes sucesivos de un mismo flujo de red.',
      paraQueSirve: 'Mide la consistencia y estabilidad del medio físico, especialmente en conexiones inalámbricas saturadas por interferencias.',
      quePasaSiFalta: 'Si el jitter supera los 20 ms en una llamada de voz o streaming, el receptor sufre cortes de audio continuos aunque la velocidad sea de 1000 Mbps.',
    },
    interactua: {
      cliExample: 'ping 8.8.8.8 -n 30',
      psExample: '$p = Test-Connection 8.8.8.8 -Count 30; ($p.ResponseTime | Measure-Object -Maximum).Maximum - ($p.ResponseTime | Measure-Object -Minimum).Minimum',
      syntaxBreakdown: 'Calcula el delta de dispersión máxima de latencia en milisegundos en PowerShell.',
      whatToLookFor: 'Varianza de jitter < 3 ms en Ethernet; < 8 ms en Wi-Fi de alta calidad.',
      technicalMetrics: 'Jitter > 30 ms clasifica la conexión como inadecuada para voz sobre IP (VoIP) profesional.',
    },
    alertaEVO: {
      reversibilityRule: 'Conectar por cable Ethernet o activar QoS (Quality of Service) en el router reduce el jitter a valores cercanos a cero.',
      safetyWarning: 'Subidas de archivos masivas sin limitación saturan el enlace ascendente, disparando el jitter al infinito.',
    },
    evidenceBadge: {
      code: 'JITTER_VAR',
      label: 'DELAY VARIATION',
    },
  },
  {
    id: 'inv-17-24',
    code: '17.24',
    title: 'netsh wlan',
    subtitle: 'El informe forense WLAN de Windows: wlanreport y perfiles ocultos',
    targetMechanism: 'Native Wi-Fi Diagnostic Logging & XML Profile Parser',
    targetComponent: 'netsh.exe wlan / wlanreport.html',
    commandName: 'netsh wlan show wlanreport',
    riskLevel: 'SAFE_READONLY',
    descubri: {
      hook: 'Windows tiene escondida una herramienta secreta que genera un reporte HTML interactivo con gráficos de cada segundo de tu Wi-Fi durante los últimos 3 días.',
      mythVsTruth: {
        mentira: 'Para diagnosticar problemas de Wi-Fi en Windows necesitás instalar programas de terceros.',
        verdad: 'El comando nativo netsh wlan show wlanreport genera un informe pericial exhaustivo en C:\\ProgramData\\Microsoft\\Windows\\WlanReport\\wlan-report-latest.html con desconexiones, cambios de canal y fallos de autenticación.',
        comprobalo: 'Ejecutá netsh wlan show wlanreport en tu terminal y abrí el archivo HTML generado en tu navegador: quedarás asombrado por el nivel de telemetría forense.',
      },
    },
    entende: {
      queEs: 'El motor de telemetría y perfiles de red inalámbrica del subsistema Native Wi-Fi de Microsoft.',
      paraQueSirve: 'Permite inspeccionar contraseñas guardadas, perfiles XML de conexión, eventos de roaming entre antenas y causas de desconexión.',
      quePasaSiFalta: 'Sin este reporte, diagnosticar microcortes intermitentes de Wi-Fi que ocurren una vez por hora es prácticamente imposible.',
    },
    interactua: {
      cliExample: 'netsh wlan show wlanreport',
      psExample: 'netsh wlan show profiles',
      syntaxBreakdown: 'Genera el informe HTML pericial de eventos de radio y lista todos los perfiles de redes Wi-Fi guardados.',
      whatToLookFor: 'Eventos de desconexión con código de razón (Reason Code) en el timeline del reporte.',
      technicalMetrics: 'Historial de eventos de los últimos 3 días registrado en el log del visor de eventos de Windows.',
    },
    alertaEVO: {
      reversibilityRule: 'El reporte se genera en disco como archivo estático de solo lectura.',
      safetyWarning: 'El comando netsh wlan show profile name="X" key=clear muestra la contraseña en texto plano; no lo ejecutes en pantallas compartidas.',
    },
    evidenceBadge: {
      code: 'WLAN_REP',
      label: 'WLAN REPORT',
    },
  },
  {
    id: 'inv-17-25',
    code: '17.25',
    title: 'Reset de red',
    subtitle: 'El botón nuclear: reconstrucción de Winsock, TCP/IP y adaptadores',
    targetMechanism: 'Winsock Catalog Reinitialization & TCP/IP Stack Rebuild',
    targetComponent: 'netsh winsock reset / netsh int ip reset',
    commandName: 'netsh winsock reset',
    riskLevel: 'HIGH_RISK',
    descubri: {
      hook: 'Desinstalaste un antivirus o una VPN rota y ahora ninguna aplicación puede conectar a Internet, aunque el adaptador tiene IP y ping. ¿Qué se rompió?',
      mythVsTruth: {
        mentira: 'Hay que formatear la máquina porque la pila de red quedó destruida para siempre.',
        verdad: 'El software de seguridad o VPN instaló un filtro en el catálogo Winsock (Layered Service Provider) que quedó huérfano al desinstalarlo. Restablecer el catálogo Winsock con netsh lo devuelve a su configuración de fábrica limpia.',
        comprobalo: 'El reseteo trifásico (netsh winsock reset + netsh int ip reset) purga todos los filtros huérfanos y restaura la comunicación de sockets de inmediato.',
      },
    },
    entende: {
      queEs: 'El procedimiento quirúrgico para restaurar los componentes de software de la pila de red de Windows a su estado original de fábrica.',
      paraQueSirve: 'Resuelve desastres de conectividad causados por malware, VPNs defectuosas o filtros de firewall de terceros mal desinstalados.',
      quePasaSiFalta: 'Si no se ejecuta, cualquier llamada a socket API de Windows (connect, send, recv) es interceptada por un puntero nulo en memoria.',
    },
    interactua: {
      cliExample: 'netsh winsock reset && netsh int ip reset',
      psExample: 'Restart-NetAdapter -Name "Ethernet"',
      syntaxBreakdown: 'Reconstruye el catálogo Winsock y restablece el archivo de registro TCP/IP requiriendo un reinicio de Windows.',
      whatToLookFor: '"El catálogo de Winsock se restableció correctamente. Debe reiniciar el equipo para completar el restablecimiento".',
      technicalMetrics: 'Elimina todas las claves de filtros LSP de terceros en HKLM\\SYSTEM\\CurrentControlSet\\Services\\Winsock2.',
    },
    alertaEVO: {
      reversibilityRule: 'Este procedimiento elimina perfiles de adaptadores de red y configuraciones manuales; requiere reiniciar el equipo.',
      safetyWarning: 'Si usás software de VPN corporativo o máquinas virtuales, tendrás que reinstalar sus adaptadores virtuales tras el reseteo.',
    },
    evidenceBadge: {
      code: 'WINSOCK_RST',
      label: 'WINSOCK NUCLEAR',
    },
  },
  {
    id: 'inv-17-26',
    code: '17.26',
    title: 'VPN',
    subtitle: 'Túneles virtuales: TAP, TUN, Wintun y el desvío del Default Gateway',
    targetMechanism: 'Virtual Network Adapters, Encapsulation & Split Tunneling',
    targetComponent: 'wintun.sys / rasman.dll',
    commandName: 'Get-NetAdapter | Where-Object InterfaceDescription -like "*VPN*|*TAP*|*WireGuard*"',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Prendés la VPN para trabajar y de repente ya no podés imprimir en tu impresora de red local ni acceder a tu NAS. ¿Por qué la VPN te aisló de tu propia casa?',
      mythVsTruth: {
        mentira: 'Las VPNs rompen la red local de tu casa por un fallo de Windows.',
        verdad: 'Por defecto, una VPN redirige la ruta por defecto (0.0.0.0/0) a través de su interfaz virtual TUN/TAP para que todo el tráfico sea cifrado. Si no tiene activado "Split Tunneling" (túnel dividido), los paquetes dirigidos a tu red local también se envían al túnel y se descartan.',
        comprobalo: 'Revisá tu tabla de rutas con route print mientras la VPN está conectada: verás una nueva ruta 0.0.0.0 con métrica ultra baja apuntando a la IP de la VPN.',
      },
    },
    entende: {
      queEs: 'Una Red Privada Virtual (VPN) que encapsula y cifra paquetes IP dentro de otro protocolo de transporte hacia un servidor remoto.',
      paraQueSirve: 'Brinda privacidad, acceso seguro a redes corporativas internas y evasión de censura geográfica.',
      quePasaSiFalta: 'Si la VPN tiene fugas de DNS (DNS Leak) o no tiene Kill Switch, tu IP real se filtra en la red cada vez que el túnel se reconecta.',
    },
    interactua: {
      cliExample: 'route print 0.0.0.0',
      psExample: 'Get-NetIPInterface | Where-Object InterfaceAlias -like "*VPN*" | Select-Object InterfaceAlias, InterfaceMetric',
      syntaxBreakdown: 'Audita las interfaces virtuales de VPN y su jerarquía de métricas frente a la conexión física.',
      whatToLookFor: 'Métrica de VPN inferior a la de Ethernet para que el túnel tome el tráfico de Internet.',
      technicalMetrics: 'MTU reducida en túneles VPN: típicamente 1420 bytes (WireGuard) o 1400 bytes (OpenVPN) por sobrecarga de cabecera.',
    },
    alertaEVO: {
      reversibilityRule: 'Desconectar la VPN restaura inmediatamente la ruta por defecto a tu router físico.',
      safetyWarning: 'Un Kill Switch de VPN mal configurado que queda trabado tras un cuelgue te dejará sin Internet hasta que reabras la app de VPN.',
    },
    evidenceBadge: {
      code: 'VPN_TUN',
      label: 'WINTUN / TAP',
    },
  },
  {
    id: 'inv-17-27',
    code: '17.27',
    title: 'Proxy',
    subtitle: 'El interceptor intermedio: PAC, WPAD y el fantasma de 127.0.0.1:8080',
    targetMechanism: 'WinINet / WinHTTP Proxy Configuration & WPAD Protocol',
    targetComponent: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings',
    commandName: 'netsh winhttp show proxy',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Chrome y Edge dicen "No se puede conectar al servidor proxy" y no carga nada, pero hacés ping a Google y responde. ¿Quién configuró un proxy si vos nunca lo pediste?',
      mythVsTruth: {
        mentira: 'Windows activa un proxy solo cuando se actualiza el sistema.',
        verdad: 'Muchos adwares, extensiones maliciosas o VPNs gratuitas configuran un proxy local (127.0.0.1:8080) en el registro para espiar tu tráfico. Cuando el programa se cierra o se desinstala mal, el proxy queda apuntando a la nada y bloquea todos los navegadores.',
        comprobalo: 'Ejecutá netsh winhttp show proxy y revisá en Configuración de Windows -> Red e Internet -> Proxy: si "Usar servidor proxy" está activado, estás sufriendo este secuestro.',
      },
    },
    entende: {
      queEs: 'Un servidor intermedio que actúa como intermediario para solicitudes de clientes que buscan recursos de otros servidores.',
      paraQueSirve: 'En empresas se usa para filtrado de contenido, auditoría de seguridad y aceleración por caché.',
      quePasaSiFalta: 'Si un proxy inexistente queda configurado en WinINet, todas las aplicaciones que usan la API web de Windows quedan ciegas.',
    },
    interactua: {
      cliExample: 'netsh winhttp show proxy',
      psExample: 'Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" | Select-Object ProxyEnable, ProxyServer',
      syntaxBreakdown: 'Inspecciona los valores de registro del subsistema WinINet para verificar si hay un proxy activo.',
      whatToLookFor: 'ProxyEnable : 0 para conexiones directas sin intermediarios.',
      technicalMetrics: 'WinINet gobierna navegadores de usuario; WinHTTP gobierna servicios del sistema y Windows Update.',
    },
    alertaEVO: {
      reversibilityRule: 'Desactivar el proxy en Configuración restaura la conexión directa instantáneamente.',
      safetyWarning: 'El protocolo WPAD (Web Proxy Auto-Discovery) puede ser explotado en redes Wi-Fi públicas para inyectar configuraciones proxy maliciosas.',
    },
    evidenceBadge: {
      code: 'PROXY_WIN',
      label: 'WINHTTP PROXY',
    },
  },
  {
    id: 'inv-17-28',
    code: '17.28',
    title: 'Network profile',
    subtitle: 'Red Pública vs Red Privada: el escudo que abre o cierra los puertos',
    targetMechanism: 'Network Location Awareness (NLA) & Firewall Profile Binding',
    targetComponent: 'mpssvc (Windows Firewall) / NLA Service',
    commandName: 'Get-NetConnectionProfile',
    riskLevel: 'MODIFIES_STATE',
    descubri: {
      hook: 'Conectás tu PC al Wi-Fi de tu casa y querés compartir una carpeta o jugar en red local con un amigo, pero tu máquina es invisible para el resto de la red. ¿Por qué?',
      mythVsTruth: {
        mentira: 'Compartir archivos en Windows solo funciona si tenés Windows Server.',
        verdad: 'Windows clasificó tu conexión como "Red Pública" por defecto. En el perfil Público, el Firewall de Windows bloquea automáticamente todas las conexiones entrantes (bloqueo de ping ICMP, bloqueo de SMB puerto 445 y descubrimiento de red).',
        comprobalo: 'Fijate en Get-NetConnectionProfile: si NetworkCategory dice "Public", tu PC está en modo búnker blindado.',
      },
    },
    entende: {
      queEs: 'Los tres perfiles de ubicación de red de Windows: Dominio (DomainAuthenticated), Privada (Private, para hogares y oficinas seguras) y Pública (Public, para aeropuertos y cafeterías).',
      paraQueSirve: 'Aplica automáticamente un conjunto de reglas de firewall según el nivel de confianza del entorno físico.',
      quePasaSiFalta: 'Tener una PC configurada como "Privada" en una cafetería expone tus recursos compartidos a todos los desconocidos conectados al mismo router.',
    },
    interactua: {
      cliExample: 'powershell -Command "Get-NetConnectionProfile"',
      psExample: 'Set-NetConnectionProfile -Name "NombreRed" -NetworkCategory Private',
      syntaxBreakdown: 'Cambia el perfil de red a Privado para habilitar el descubrimiento de red y el uso compartido de archivos e impresoras.',
      whatToLookFor: 'NetworkCategory : Private en redes hogareñas seguras; Public en cualquier red pública.',
      technicalMetrics: 'Perfil Público bloquea por defecto puertos TCP 139, 445 (SMB) y 3389 (RDP) entrantes.',
    },
    alertaEVO: {
      reversibilityRule: 'Set-NetConnectionProfile -NetworkCategory Public vuelve a activar el modo búnker en un segundo.',
      safetyWarning: 'Nunca pongas una red en "Privada" si estás conectado al Wi-Fi de un hotel, universidad o espacio público.',
    },
    evidenceBadge: {
      code: 'NET_PROFILE',
      label: 'PUBLIC VS PRIVATE',
    },
  },
  {
    id: 'inv-17-29',
    code: '17.29',
    title: 'Firewall',
    subtitle: 'Windows Defender Firewall: la inspección de paquetes con estado (Stateful)',
    targetMechanism: 'Stateful Packet Filtering & WFP (Windows Filtering Platform)',
    targetComponent: 'mpssvc / bfe.dll (Base Filtering Engine)',
    commandName: 'netsh advfirewall show allprofiles',
    riskLevel: 'LOW_RISK',
    descubri: {
      hook: 'Levantás un servidor de Minecraft o una página web local en el puerto 8080, pero nadie desde otra máquina puede entrar aunque estén en la misma red. ¿Quién lo frena?',
      mythVsTruth: {
        mentira: 'El firewall de Windows solo sirve para molestar y hay que desactivarlo por completo.',
        verdad: 'Windows Firewall es un filtro con estado (Stateful) de alto rendimiento integrado en el kernel (WFP). Desactivarlo deja expuestos todos los servicios del sistema operativo; lo correcto es crear una regla de entrada (Inbound Rule) específica para el puerto o aplicación deseada.',
        comprobalo: 'Creá una regla de entrada con New-NetFirewallRule para el puerto requerido y verás que el acceso se habilita sin vulnerar el resto del sistema.',
      },
    },
    entende: {
      queEs: 'El motor de filtrado de paquetes de Windows, basado en la Windows Filtering Platform (WFP), que controla todo el tráfico entrante y saliente del equipo.',
      paraQueSirve: 'Inspecciona cabeceras de paquetes, estados de conexión TCP y firmas de aplicaciones para prevenir accesos no autorizados.',
      quePasaSiFalta: 'Sin firewall, cualquier vulnerabilidad sin parchear en un servicio que escuche en la red (ej. RPC, SMB) puede ser explotada en segundos por gusanos de red.',
    },
    interactua: {
      cliExample: 'netsh advfirewall firewall show rule name=all',
      psExample: 'Get-NetFirewallRule -Enabled True -Direction Inbound | Select-Object -First 10 DisplayName, Action',
      syntaxBreakdown: 'Lista las primeras 10 reglas de entrada activas en el firewall de Windows.',
      whatToLookFor: 'Acción "Allow" para servicios deseados y estado de firewall en "ON" en los tres perfiles.',
      technicalMetrics: 'Tiempo de inspección de paquete en WFP: microsegundos imperceptibles en CPUs multinúcleo.',
    },
    alertaEVO: {
      reversibilityRule: 'netsh advfirewall reset restablece todas las reglas del firewall a los valores de fábrica de Microsoft.',
      safetyWarning: 'Desactivar el firewall por completo elimina la protección perimetral del equipo y no se recomienda en ningún entorno de producción.',
    },
    evidenceBadge: {
      code: 'WFP_FIREWALL',
      label: 'STATEFUL WFP',
    },
  },
];

export const SECTOR_17_MINICASES: Sector17MiniCase[] = [
  {
    id: 'case-17-01',
    code: '17.A',
    title: 'El Misterio de la Conexión a 94 Mbps en una Fibra de 600 Megas',
    scenario: 'Un cliente contrató un servicio de fibra óptica de 600 Mbps simétricos. El técnico de la empresa instaló el módem y con su notebook conectada por cable midió 610 Mbps. Sin embargo, al conectar la PC de escritorio del cliente mediante un cable que pasa por dentro de la pared hasta su dormitorio, el test de velocidad se clava en exactamente 94 Mbps, sin subir ni un solo mega más.',
    userStatement: 'El técnico me mintió y me limitó la velocidad cuando se fue, o mi placa madre de 2.5 Gbps está fallada.',
    initialMistake: 'Reclamar al proveedor de Internet o culpar a la placa madre de la computadora.',
    diagnosticQuestion: '¿Por qué la velocidad se clava matemáticamente en 94 Mbps y cuál es el componente culpable?',
    options: [
      {
        id: 'a',
        text: 'Porque el cable que pasa por la pared tiene uno de sus 8 hilos cortado, quebrado o una ficha RJ-45 mal crimpada. 1 Gbps requiere obligatoriamente los 4 pares (8 hilos) sanos; si falla uno solo, la autonegociación física (FLP) degrada el enlace a 100BASE-TX (que usa solo 2 pares). En un enlace de 100 Mbps, el ancho de banda útil real descontando cabeceras Ethernet/IP/TCP es de exactamente 94.4 Mbps.',
        isCorrect: true,
        explanation: 'Diagnóstico técnico perfecto e indiscutible. El techo exacto de 94 Mbps es la firma canónica de un enlace degradado a Fast Ethernet (100 Mbps) por daño físico en los pares 4-5 o 7-8.',
      },
      {
        id: 'b',
        text: 'Porque Windows 11 tiene un virus que come 506 Mbps en segundo plano.',
        isCorrect: false,
        explanation: 'Ningún virus consume un ancho de banda tan matemáticamente exacto.',
      },
      {
        id: 'c',
        text: 'Porque la fibra óptica pierde velocidad si el cable de red es de color gris.',
        isCorrect: false,
        explanation: 'El color de la cubierta de PVC no tiene ningún impacto eléctrico.',
      },
      {
        id: 'd',
        text: 'Porque el disco duro de la PC no puede escribir a más de 94 Mbps.',
        isCorrect: false,
        explanation: 'Cualquier disco mecánico escribe a más de 100 MB/s (800 Mbps) y los tests de red miden tráfico en RAM, no en disco.',
      },
    ],
    technicalVerdict: 'Al revisar el estado del adaptador en Windows, la propiedad LinkSpeed marcaba 100 Mbps en lugar de 1 Gbps. Con un tester de cables de red se comprobó que el pin 7 (marrón-blanco) del jack de pared no hacía contacto. Se re-ponchó la ficha con la norma T568B, la placa autonegoció a 1.0 Gbps de inmediato y el test arrojó 615 Mbps.',
    lessonLearned: 'Un límite exacto de 94 Mbps en un test de velocidad siempre indica un enlace físico degradado a 100 Mbps por daño en alguno de los 8 hilos del cable UTP.',
  },
  {
    id: 'case-17-02',
    code: '17.B',
    title: 'El Limbo de la IP 169.254.x.x en la Sala de Servidores',
    scenario: 'Tras un corte de energía eléctrica en una empresa, un servidor secundario encendió y quedó sin red. El icono de red en la bandeja del sistema muestra el triángulo amarillo con el mensaje "Red no identificada - Sin acceso a Internet". El administrador ejecutó ipconfig y encontró que el adaptador tenía la IP 169.254.120.45 con máscara 255.255.0.0 y Puerta de enlace predeterminada en blanco.',
    userStatement: 'El switch quemó la placa de red con el golpe de tensión y le metió una IP loca.',
    initialMistake: 'Comprar una tarjeta de red nueva asumiendo daño de hardware por la sobretensión.',
    diagnosticQuestion: '¿Qué significa que la IP sea 169.254.x.x y por qué la puerta de enlace está vacía?',
    options: [
      {
        id: 'a',
        text: 'Es una IP asignada por Microsoft para rastrear licencias pirateadas.',
        isCorrect: false,
        explanation: 'Falso y absurdo.',
      },
      {
        id: 'b',
        text: 'Es una dirección APIPA (RFC 3927). Tras el corte de luz, el servidor arrancó más rápido que el router/servidor DHCP principal. Al no recibir respuesta a los mensajes DHCP Discover tras 60 segundos, Windows se autoasignó esa IP de emergencia para no quedar totalmente mudo. Al no haber DHCP, no hay Gateway.',
        isCorrect: true,
        explanation: 'Brillante lectura de la máquina de estados de red. El servidor arrancó en 20 segundos con su SSD, pero el switch PoE y el router tardaron 3 minutos en inicializar. Al no encontrar DHCP, Windows activó APIPA.',
      },
      {
        id: 'c',
        text: 'La tarjeta de red se desconfiguró y ahora solo habla en lenguaje binario antiguo.',
        isCorrect: false,
        explanation: 'No tiene sentido técnico.',
      },
      {
        id: 'd',
        text: 'El cable de red se magnetizó con el corte y hay que frotarlo contra un imán.',
        isCorrect: false,
        explanation: 'Completamente erróneo y peligroso para los componentes.',
      },
    ],
    technicalVerdict: 'Una vez que el router DHCP completó su arranque, bastó con ejecutar en el servidor el comando ipconfig /renew para que completara el handshake DORA y recibiera su IP corporativa legítima (10.0.10.50) con su Gateway y DNS correspondientes.',
    lessonLearned: 'La presencia de una IP 169.254.x.x certifica que la tarjeta de red funciona, pero ningún servidor DHCP respondió a sus solicitudes en el medio local.',
  },
  {
    id: 'case-17-03',
    code: '17.C',
    title: 'El Icono del Mundo "Sin Internet" con Ping 100% Funcional',
    scenario: 'En una estación de trabajo de diseño, el usuario no puede abrir Microsoft Teams ni la Tienda de Windows porque dicen "Comprueba tu conexión a Internet". El icono de la barra de tareas es el "globo terráqueo" sin conexión. Sin embargo, el usuario puede navegar por Google Chrome sin ningún problema, hacer ping a 8.8.8.8 y ver videos en YouTube a 4K.',
    userStatement: 'Windows está loco: estoy viendo un video en vivo en YouTube pero me dice que no tengo Internet y me bloquea el Teams.',
    initialMistake: 'Reinstalar Windows o formatear la máquina por un "error de software incorregible".',
    diagnosticQuestion: '¿Por qué Chrome navega perfectamente pero las aplicaciones nativas de Windows y el icono dicen que no hay Internet?',
    options: [
      {
        id: 'a',
        text: 'Porque Chrome usa satélites privados y Windows usa cables comunes.',
        isCorrect: false,
        explanation: 'Chrome usa el mismo hardware y los mismos paquetes que el resto del sistema.',
      },
      {
        id: 'b',
        text: 'Porque el subsistema NCSI (Network Connectivity Status Indicator) no pudo completar su sonda HTTP a http://www.msftconnecttest.com/connecttest.txt o la resolución de dns.msftncsi.com debido a un bloqueo en un archivo hosts, un firewall o un valor en el Registro (EnableActiveProbing en 0). Teams y las apps UWP consultan a NCSI antes de abrir sockets; si NCSI dice False, se niegan a conectar.',
        isCorrect: true,
        explanation: 'Explicación técnica canónica de la arquitectura NLA/NCSI de Windows. Chrome consulta sockets directamente; las aplicaciones modernas de Microsoft consultan la API de estado de red NLA. Si la sonda de Microsoft está bloqueada, las apps se declaran offline.',
      },
      {
        id: 'c',
        text: 'Porque la memoria RAM está llena de archivos PDF.',
        isCorrect: false,
        explanation: 'No tiene relación alguna con la pila de red.',
      },
      {
        id: 'd',
        text: 'Porque la tarjeta gráfica tiene los drivers desactualizados.',
        isCorrect: false,
        explanation: 'La GPU no interviene en la determinación del estado de red IP.',
      },
    ],
    technicalVerdict: 'Se detectó que un script de "optimización y telemetría" de terceros había modificado el registro HKLM\\SYSTEM\\CurrentControlSet\\Services\\NlaSvc\\Parameters\\Internet poniendo EnableActiveProbing en 0 y agregando msftconnecttest.com al archivo C:\\Windows\\System32\\drivers\\etc\\hosts. Se eliminó la línea del hosts y se reestableció EnableActiveProbing en 1. Al instante el icono del mundo se convirtió en el monitor de red y Teams conectó con éxito.',
    lessonLearned: 'Bloquear las sondas activas de NCSI genera falsos positivos de desconexión que inutilizan el ecosistema de aplicaciones nativas de Windows.',
  },
  {
    id: 'case-17-04',
    code: '17.D',
    title: 'El Proxy Fantasma que Bloqueó la Navegación tras Desinstalar una VPN',
    scenario: 'Un usuario instaló una aplicación de VPN gratuita para mirar un partido de fútbol. Al terminar, desinstaló la aplicación desde el Panel de Control y reinició la PC. Desde ese instante, ningún navegador (Edge, Chrome, Firefox) puede abrir ninguna página web, arrojando el error "ERR_PROXY_CONNECTION_FAILED". Sin embargo, Spotify sigue reproduciendo música y Steam sigue conectado.',
    userStatement: 'El desinstalador de la VPN me metió un virus que me rompió la web para siempre.',
    initialMistake: 'Pensar que hay que pagar por un software antivirus para limpiar el equipo.',
    diagnosticQuestion: '¿Por qué las páginas web no abren pero las aplicaciones como Spotify o Steam siguen funcionando?',
    options: [
      {
        id: 'a',
        text: 'Spotify y Steam no usan Internet; tienen toda la música y los juegos guardados en la memoria caché del procesador.',
        isCorrect: false,
        explanation: 'Falso. Spotify y Steam requieren conexión constante a servidores de Internet.',
      },
      {
        id: 'b',
        text: 'La VPN configuró un servidor proxy local (127.0.0.1:8080) en el subsistema WinINet de Windows para filtrar tráfico, pero su desinstalador deficiente olvidó desmarcar la casilla al eliminarse. Los navegadores web respetan la configuración del proxy del sistema y al no encontrar el proceso de la VPN escuchando en el puerto 8080, fallan. Spotify y Steam usan sockets directos sin proxy del sistema.',
        isCorrect: true,
        explanation: 'Diagnóstico forense impecable. Es el clásico fallo de desinstalación de adwares y VPNs baratas que dejan la directiva ProxyEnable = 1 en el Registro huérfana.',
      },
      {
        id: 'c',
        text: 'Porque el cable de red se quedó sin bytes para navegar.',
        isCorrect: false,
        explanation: 'Los cables no almacenan "bytes" consumibles.',
      },
      {
        id: 'd',
        text: 'Porque Windows 11 no admite navegar por Internet los fines de semana sin VPN paga.',
        isCorrect: false,
        explanation: 'Totalmente infundado.',
      },
    ],
    technicalVerdict: 'Bastó con ingresar a Configuración -> Red e Internet -> Proxy y desactivar la opción "Usar servidor proxy", o ejecutar el comando de registro para poner ProxyEnable en 0. Al instante todos los navegadores volvieron a cargar páginas web a máxima velocidad.',
    lessonLearned: 'El error ERR_PROXY_CONNECTION_FAILED siempre delata una configuración de proxy huérfana en WinINet tras la eliminación incompleta de una VPN o proxy local.',
  },
];

export const SECTOR_17_TEST_BANK: Sector17TestQuestion[] = [
  {
    id: 'q17-01',
    questionNumber: 1,
    category: 'DHCP_Y_DIRECCIONAMIENTO',
    question: '¿Cuál es el orden cronológico canónico de los cuatro mensajes intercambiados entre un cliente y un servidor durante la asignación dinámica de una dirección IP (proceso DORA)?',
    options: [
      { id: 'a', text: 'Delete, Overwrite, Reset, Acknowledge' },
      { id: 'b', text: 'Discover (Broadcast del cliente), Offer (Oferta del servidor), Request (Solicitud formal del cliente), Acknowledge (Confirmación y concesión del servidor)' },
      { id: 'c', text: 'DNS, OUI, Routing, ARP' },
      { id: 'd', text: 'Download, Open, Read, Apply' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'DORA es el acrónimo universal de DHCP: el cliente inicia buscando servidores (Discover), recibe propuestas (Offer), pide la elegida (Request) y el servidor la bloquea en su tabla emitiendo la confirmación final (ACK).',
    relatedInvestigationCode: '17.03',
  },
  {
    id: 'q17-02',
    questionNumber: 2,
    category: 'APIPA_Y_ERRORES',
    question: 'Si una computadora con Windows muestra una dirección IPv4 dentro del rango 169.254.0.1 a 169.254.255.254 con máscara 255.255.0.0, ¿qué conclusión técnica indiscutible se desprende de este hallazgo?',
    options: [
      { id: 'a', text: 'Que la máquina está conectada a una red militar de alta seguridad.' },
      { id: 'b', text: 'Que el cliente DHCP de Windows no recibió respuesta de ningún servidor DHCP tras múltiples reintentos y se autoasignó una dirección de emergencia APIPA (RFC 3927).' },
      { id: 'c', text: 'Que la placa de red está quemada y no tiene reparación.' },
      { id: 'd', text: 'Que el proveedor de Internet aumentó la velocidad al doble.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El rango 169.254.0.0/16 está reservado exclusivamente para APIPA. Windows lo adopta de manera autónoma cuando el medio físico tiene enlace pero ningún servidor DHCP responde a sus solicitudes.',
    relatedInvestigationCode: '17.18',
  },
  {
    id: 'q17-03',
    questionNumber: 3,
    category: 'ETHERNET_Y_FISICA',
    question: 'En un cable de red Ethernet de par trenzado (UTP), ¿cuál es la diferencia fundamental en la cantidad de pares utilizados entre un enlace 100BASE-TX (100 Mbps) y un enlace 1000BASE-T (1 Gbps)?',
    options: [
      { id: 'a', text: 'No hay diferencia, ambos usan 1 solo cable de cobre grueso.' },
      { id: 'b', text: '100BASE-TX utiliza únicamente 2 pares (4 hilos: pines 1, 2, 3 y 6), mientras que 1000BASE-T requiere obligatoriamente los 4 pares (los 8 hilos completos) transmitiendo y recibiendo en simultáneo.' },
      { id: 'c', text: '100 Mbps usa electricidad y 1 Gbps usa rayos láser dentro del plástico.' },
      { id: 'd', text: '1 Gbps solo funciona si el cable es de fibra de carbono.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Fast Ethernet (100 Mbps) opera con solo 2 pares (uno de transmisión y uno de recepción). Gigabit Ethernet (1000 Mbps) modula en 5 niveles (PAM-5) sobre los 4 pares en paralelo full-duplex.',
    relatedInvestigationCode: '17.14',
  },
  {
    id: 'q17-04',
    questionNumber: 4,
    category: 'NCSI_Y_WINDOWS',
    question: '¿Qué mecanismo utiliza el indicador de conectividad de Windows (NCSI) para determinar si la conexión tiene acceso real a Internet y decidir si muestra el icono del "globo terráqueo" o el monitor de red?',
    options: [
      { id: 'a', text: 'Mide la temperatura del módem por infrarrojos.' },
      { id: 'b', text: 'Realiza una sonda activa intentando resolver el dominio dns.msftncsi.com y descargando el archivo ncsi.txt desde http://www.msftconnecttest.com/connecttest.txt esperando verificar el texto "Microsoft Connect Test".' },
      { id: 'c', text: 'Comprueba si la tarjeta de crédito del usuario tiene saldo para pagar Internet.' },
      { id: 'd', text: 'Envía 1000 correos electrónicos a Microsoft cada minuto.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'NCSI (Network Connectivity Status Indicator) ejecuta esta doble prueba de DNS y petición HTTP GET ligera. Si el resultado es el esperado, el sistema operativo declara conectividad completa a Internet.',
    relatedInvestigationCode: '17.19',
  },
  {
    id: 'q17-05',
    questionNumber: 5,
    category: 'DNS_Y_RESOLUCION',
    question: 'Si una computadora puede hacer ping a direcciones IP públicas como 8.8.8.8 o 1.1.1.1 con éxito, pero ningún navegador web puede cargar páginas como "google.com" o "wikipedia.org", ¿cuál es el componente exacto que presenta la falla?',
    options: [
      { id: 'a', text: 'El cable módem de fibra óptica está apagado.' },
      { id: 'b', text: 'El servicio de resolución de nombres de dominio (DNS) está fallando, no responde en el puerto UDP 53 o tiene configuradas IPs de servidores DNS inválidas o caídas.' },
      { id: 'c', text: 'El monitor de la computadora no soporta páginas web con texto.' },
      { id: 'd', text: 'El teclado tiene la tecla Enter desconectada.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'La capacidad de hacer ping a IPs numéricas demuestra que las Capas 1, 2 y 3 (Física, Enlace, Red/Routing) funcionan a la perfección. La imposibilidad de traducir nombres a IPs aísla el fallo al 100% en la Capa de Aplicación DNS.',
    relatedInvestigationCode: '17.07',
  },
  {
    id: 'q17-06',
    questionNumber: 6,
    category: 'CAPA_TRANSPORTE',
    question: '¿Por qué los juegos en línea competitivos y las llamadas de voz (Discord, Teams) utilizan el protocolo UDP en lugar del protocolo TCP para sus transmisiones en tiempo real?',
    options: [
      { id: 'a', text: 'Porque UDP es gratis y TCP cobra una comisión bancaria por paquete.' },
      { id: 'b', text: 'Porque UDP no tiene sobrecarga de handshake, ni control de congestión, ni retransmisión de paquetes perdidos: si un paquete se pierde, se descarta y se procesa el siguiente inmediatamente con la mínima latencia física posible.' },
      { id: 'c', text: 'Porque TCP solo puede transmitir letras y no sonidos.' },
      { id: 'd', text: 'Porque las placas de video modernas no tienen memoria para almacenar paquetes TCP.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'TCP retransmite cualquier byte perdido deteniendo la cola de recepción hasta que el paquete extraviado llegue (Head-of-Line blocking), lo que causaría congelamientos intolerables en aplicaciones de tiempo real.',
    relatedInvestigationCode: '17.11',
  },
  {
    id: 'q17-07',
    questionNumber: 7,
    category: 'FIREWALL_Y_PERFILES',
    question: '¿Cuál es la diferencia crítica en el comportamiento del Firewall de Windows cuando una red se configura como "Pública" frente a cuando se configura como "Privada"?',
    options: [
      { id: 'a', text: 'En Red Pública el navegador cambia de color a rojo.' },
      { id: 'b', text: 'En Red Pública el firewall bloquea por defecto todas las solicitudes entrantes no solicitadas (bloqueo de ping ICMP, bloqueo de carpetas compartidas SMB y deshabilitación del descubrimiento de red para proteger al equipo en entornos hostiles).' },
      { id: 'c', text: 'En Red Privada la computadora gasta el doble de electricidad.' },
      { id: 'd', text: 'En Red Pública no se puede reproducir música con auriculares.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El perfil Público está diseñado con postura de seguridad zero-trust para redes abiertas (aeropuertos, cafeterías), bloqueando puertos de compartición local para evitar ataques de vecinos de red.',
    relatedInvestigationCode: '17.28',
  },
  {
    id: 'q17-08',
    questionNumber: 8,
    category: 'METRICAS_Y_ROUTING',
    question: 'Si una computadora portátil está conectada simultáneamente por cable Ethernet (1 Gbps) y por Wi-Fi (5 GHz) al mismo router, ¿cómo determina el kernel de Windows por cuál de las dos interfaces enviará los paquetes a Internet?',
    options: [
      { id: 'a', text: 'Envía un paquete por cable y el siguiente por Wi-Fi de forma alternada.' },
      { id: 'b', text: 'Consulta su tabla de enrutamiento interna y utiliza la interfaz cuya ruta por defecto (0.0.0.0/0) posea la "Métrica de interfaz" más baja (menor costo numérico), que por defecto favorece a la conexión Ethernet.' },
      { id: 'c', text: 'Siempre usa el Wi-Fi porque las ondas de radio no tienen fricción con el cobre.' },
      { id: 'd', text: 'Pregunta al usuario mediante una notificación emergente cada 10 segundos.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'El subsistema de enrutamiento asigna métricas automáticas inversamente proporcionales a la velocidad del enlace. La interfaz más rápida obtiene menor métrica y gana la prioridad en la Forwarding Information Base (FIB).',
    relatedInvestigationCode: '17.09',
  },
  {
    id: 'q17-09',
    questionNumber: 9,
    category: 'DIAGNOSTICO_FORENSE',
    question: '¿Qué comando nativo de Windows genera un reporte forense completo en formato HTML interactivo detallando eventos de radio, caídas de señal y motivos de desconexión Wi-Fi de los últimos 3 días?',
    options: [
      { id: 'a', text: 'format C: /wlan' },
      { id: 'b', text: 'netsh wlan show wlanreport' },
      { id: 'c', text: 'ping localhost -t' },
      { id: 'd', text: 'ipconfig /allcompartir' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'netsh wlan show wlanreport compila registros del subsistema Native Wi-Fi, Visor de Eventos y métricas de radio en un documento HTML en ProgramData con gráficos temporales de conectividad.',
    relatedInvestigationCode: '17.24',
  },
  {
    id: 'q17-10',
    questionNumber: 10,
    category: 'METROLOGIA_RENDIMIENTO',
    question: 'Desde el punto de vista de la metrología del rendimiento de redes (EVO Labs), ¿cuál es la diferencia entre "Latencia" y "Jitter"?',
    options: [
      { id: 'a', text: 'La latencia se mide en metros y el jitter se mide en litros.' },
      { id: 'b', text: 'La latencia es el tiempo medio que tarda un paquete en completar el viaje de ida y vuelta (RTT), mientras que el jitter es la varianza estadística o fluctuación temporal en los tiempos de llegada de paquetes sucesivos.' },
      { id: 'c', text: 'El jitter solo ocurre en teléfonos móviles y nunca en computadoras.' },
      { id: 'd', text: 'Son exactamente la misma palabra en distintos idiomas.' },
    ],
    correctOptionId: 'b',
    technicalExplanation: 'Una conexión puede tener 40 ms de latencia con 1 ms de jitter (excelente para streaming y juegos) o 40 ms de latencia con 80 ms de jitter (inestable, provocando pérdidas de sincronización y cortes de buffer).',
    relatedInvestigationCode: '17.23',
  },
];
