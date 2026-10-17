// TOMO 05: REDES // TRÁFICO, PROTOCOLOS & DIAGNÓSTICO PERICIAL
// Contenido Editorial Maestro, Capítulos Técnicos, Prácticas, Casos Reales y Fuentes Oficiales

export interface Tomo05Chapter {
  id: string;
  moduleNumber: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  readTime: string;
  topicsCovered: string[];
  capa1Explicacion: string;
  capa2DetalleTecnico: string;
  capa3PracticaMedicion: string;
  microformatos: {
    mito: string;
    errorComun: string;
    comprobalo: string;
    paraTecnicos: string;
    conclusionEvo: string;
  };
  decisionRule: string;
  benchTarget?: {
    labView: 'windows-matrix' | 'hotswap-lab';
    scenario: string;
    badgeLabel: string;
  };
}

export interface Tomo05CaseStudy {
  id: string;
  title: string;
  symptom: string;
  diagnosticLayer: string;
  telemetryMeasured: string;
  discardedHypothesis: string;
  rootCause: string;
  fixAction: string;
  verificationCmd: string;
}

export interface Tomo05GlossaryItem {
  term: string;
  rfcOrStandard: string;
  definition: string;
  practicalTip: string;
}

export const TOMO_05_META = {
  number: '05',
  volumeLabel: 'Tomo 05',
  title: 'REDES',
  subtitle: 'Entendé cómo se comunica tu PC, cómo viaja Internet y descubrí secretos PRO.',
  themeColor: '#06B6D4',
  secondaryColor: '#0891B2',
  badge: 'SISTEMAS DE TELECOMUNICACIONES & ANÁLISIS DE TRÁFICO',
  edition: 'Edición Técnica Profesional 2026',
  totalPages: 48,
  manifestoPhrase: 'UNA RED NO ES UN MISTERIO ETÉREO: ES UNA CADENA INMUTABLE DE TRAMAS, PAQUETES, BÚFERES Y TEMPORIZADORES.',
  description: 'Tratado técnico y pericial sobre redes cableadas, inalámbricas e infraestructura de Internet. Desde los voltajes del par trenzado y modulación QAM hasta la estructura de cabeceras TCP/IP, tablas de enrutamiento, negociación de DNS y análisis forense de paquetes con Wireshark.',
  sources: [
    'RFC 791 - Internet Protocol (IPv4)',
    'RFC 8200 - Internet Protocol, Version 6 (IPv6) Specification',
    'RFC 9293 - Transmission Control Protocol (TCP)',
    'RFC 768 - User Datagram Protocol (UDP)',
    'RFC 826 - An Ethernet Address Resolution Protocol (ARP)',
    'RFC 1035 - Domain Names - Implementation and Specification',
    'RFC 2131 - Dynamic Host Configuration Protocol (DHCP)',
    'RFC 3022 - Traditional IP Network Address Translator (Traditional NAT)',
    'IEEE 802.3 - IEEE Standard for Ethernet',
    'IEEE 802.11ax / 802.11be - High Efficiency and Extremely High Throughput Wireless LAN',
    'Bufferbloat Project - Jim Gettys & Kathleen Nichols (RFC 8290 CoDel)',
  ],
};

export const TOMO_05_CHAPTERS: Tomo05Chapter[] = [
  {
    id: 't05-c01',
    moduleNumber: 'M01',
    chapterNumber: '01',
    title: 'Fundamentos de Comunicación & Modelo por Capas',
    subtitle: 'La pila TCP/IP vs Referencia OSI: de la señal física a la sesión de usuario',
    readTime: '12 min',
    topicsCovered: ['01 Fundamentos de comunicación', '02 LAN / WAN', '03 Modelo TCP/IP y referencia OSI', '34 Internet vs red local'],
    capa1Explicacion:
      'Cuando abrís una página web, tu computadora no "habla mágicamente con la nube". Divide tu solicitud en pequeños bloques de datos (paquetes), los encapsula como si fueran cartas dentro de sucesivos sobres y los envía a través de un medio físico (cobre, fibra o radiofrecuencia). La red local (LAN) abarca tus dispositivos conectados dentro del hogar u oficina, mientras que la red amplia (WAN) conecta tu router al proveedor de Internet (ISP) y al resto del planeta.',
    capa2DetalleTecnico:
      'La arquitectura se organiza en capas abstractas. El modelo OSI define 7 capas de referencia (Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación), mientras que la arquitectura pragmática de Internet usa la Pila TCP/IP de 4/5 capas: Enlace (L2), Red/Internet (L3 - IPv4/IPv6), Transporte (L4 - TCP/UDP) y Aplicación (L7 - HTTP/DNS/TLS). Cada nivel agrega su propia cabecera (Header Encapsulation) y asume que el nivel inferior entrega una unidad de datos de protocolo (PDU) intacta.',
    capa3PracticaMedicion:
      'Inspección en Windows PowerShell con `Get-NetIPConfiguration` y `Get-NetAdapter | Select-Object Name, Status, LinkSpeed`. En Linux: `ip -br link` e `ip -br addr`. Medir la frontera entre LAN y WAN determinando la dirección IP de tu interfaz (ej. 192.168.1.15) frente a tu dirección pública en el router.',
    microformatos: {
      mito: 'Mito: "Tener fibra óptica de 1000 Mbps hace que los juegos tengan 0 ms de ping."',
      errorComun: 'Confundir ancho de banda (capacidad de carga de un camión) con latencia (velocidad a la que viaja el camión).',
      comprobalo: 'Hacé un ping continuo hacia tu gateway local (192.168.1.1) y comprobá que responde en < 1 ms antes de culpar al servidor del juego.',
      paraTecnicos: 'El tiempo de propagación física en fibra óptica es de ~5 microsegundos por kilómetro (200.000 km/s en silicio). La distancia geográfica fija un límite físico infranqueable.',
      conclusionEvo: 'Si el enlace local tiene pérdida o jitter, ningún plan comercial de 10 Gbps resolverá la inestabilidad de la aplicación.',
    },
    decisionRule: 'Aislar siempre fallas de red desde la capa 1 hacia arriba (Bottom-Up): cable/medio → enlace L2 → dirección L3 → transporte L4 → servicio L7.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'scheduler-hybrid',
      badgeLabel: 'PILA DE PROTOCOLOS L2-L7',
    },
  },
  {
    id: 't05-c02',
    moduleNumber: 'M01',
    chapterNumber: '02',
    title: 'Ethernet & Enlace de Datos (L2)',
    subtitle: 'Direcciones MAC, tramas 802.3, negociación y conmutación de paquetes',
    readTime: '14 min',
    topicsCovered: ['04 Ethernet', '05 MAC', '11 ARP / Neighbor Discovery', '27 VLAN', '35 Fibra / ONT / router / switch / AP'],
    capa1Explicacion:
      'Dentro de tu casa o trabajo, las computadoras no se comunican entre sí mediante IPs directas en el cable: se comunican mediante su dirección MAC (Media Access Control), un identificador físico de 48 bits grabado en cada tarjeta de red. Un switch aprende qué MAC está conectada en cada uno de sus puertos físicos y envía cada mensaje solo a su destinatario, sin saturar a los demás.',
    capa2DetalleTecnico:
      'El protocolo Ethernet (IEEE 802.3) encapsula tramas con un preámbulo de sincronía, MAC destino (6 bytes), MAC origen (6 bytes), EtherType (ej. 0x0800 para IPv4, 0x86DD para IPv6) y un código de redundancia cíclica FCS (CRC-32). Para traducir una dirección IP lógica a una MAC física, se utiliza ARP (Address Resolution Protocol, RFC 826) mediante una difusión broadcast (`FF:FF:FF:FF:FF:FF`). En IPv6, esto se reemplaza por ICMPv6 Neighbor Discovery (RFC 4861) usando grupos multicast.',
    capa3PracticaMedicion:
      'Ejecutar en terminal: `arp -a` para ver la tabla de correspondencia IP-MAC en caché. Si una máquina no responde, verificar el estado de la negociación con `netsh interface show interface` o revisando si el conector negoció a 100 Mbps en vez de 1000 Mbps por cable dañado.',
    microformatos: {
      mito: 'Mito: "Cualquier cable de red transmite a Gigabit si los dos extremos son Gigabit."',
      errorComun: 'Utilizar cables Cat5 antiguos o cables con uno de los 8 hilos cortados: Ethernet 1000BASE-T requiere obligatoriamente los 4 pares (8 hilos) en buen estado; si falla 1 hilo, degrada silenciosamente a 100BASE-TX.',
      comprobalo: 'Verificá la velocidad de vínculo en Windows (Propiedades de Red). Si dice 100/100 Mbps en un router Gigabit, hay un par cortado o conector RJ45 mal crimpado.',
      paraTecnicos: 'La negociación L2 usa pulsos FLP (Fast Link Pulse). Si el auto-neg handshake falla por impedancia o ruido, la tarjeta conmuta a modo degradado para no interrumpir el enlace por completo.',
      conclusionEvo: 'Antes de diagnosticar drivers o el sistema operativo, medí la integridad física y la velocidad de enlace negociada en L2.',
    },
    decisionRule: 'Si el enlace negocia a 100 Mbps en puertos Gigabit, inspeccionar pines 4-5 y 7-8 con tester de continuidad RJ45 antes de modificar configuraciones de software.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'dpc-conflict',
      badgeLabel: 'AUTONEGOCIACIÓN & ARP CACHE',
    },
  },
  {
    id: 't05-c03',
    moduleNumber: 'M02',
    chapterNumber: '03',
    title: 'Capa de Red (L3): IPv4, IPv6 & Subnetting',
    subtitle: 'Direccionamiento lógico, máscaras de subred CIDR, gateways y NAT',
    readTime: '15 min',
    topicsCovered: ['06 IP', '07 IPv4', '08 IPv6', '09 Máscara y subnetting', '10 Gateway', '14 NAT', '18 Routing'],
    capa1Explicacion:
      'La dirección IP es el código postal que permite que los paquetes viajen entre diferentes redes alrededor del mundo. Una dirección IPv4 privada típica es `192.168.1.15`. La máscara de subred (ej. `255.255.255.0` o `/24`) le dice a tu máquina qué parte de esa dirección identifica a tu vecindario (la red local) y qué parte identifica a tu equipo específico. Si el destino está fuera de tu red, se lo entrega al Gateway (el router).',
    capa2DetalleTecnico:
      'IPv4 consta de 32 bits divididos en 4 octetos. CIDR (Classless Inter-Domain Routing, RFC 4632) define la porción de red mediante el prefijo `/N`. Dado el agotamiento de direcciones públicas IPv4, se utiliza NAT (Network Address Translation, RFC 3022) o NAPT/PAT, donde cientos de IPs privadas se mapean a una única IP pública compartida alterando los números de puerto en la tabla de estados del router. IPv6 expande el espacio a 128 bits expresados en 8 grupos hexadecimales (RFC 8200), eliminando la necesidad de NAT gracias a direcciones globales únicas para cada dispositivo.',
    capa3PracticaMedicion:
      'Calcular subredes: `/24` = 254 hosts útiles. `/28` = 14 hosts útiles. Inspeccionar tabla de rutas del kernel: `route print` en Windows o `ip route show` en Linux. Identificar la ruta por defecto `0.0.0.0/0` apuntando a tu gateway.',
    microformatos: {
      mito: 'Mito: "IPv6 es más rápido que IPv4 siempre."',
      errorComun: 'Colocar dos dispositivos en la misma red física pero con máscaras o subredes incompatibles (ej. 192.168.1.10/24 y 192.168.2.10/24 sin router intermedio) y asumir que están rotos porque no se ven.',
      comprobalo: 'Hacé `tracert 1.1.1.1` y observá el primer salto: debe ser exactamente tu gateway privado con < 2 ms.',
      paraTecnicos: 'El Doble NAT ocurre cuando un router neutro está detrás del módem/ONT de la operadora sin modo Bridge (DMZ o passthrough), fragmentando el mapeo de puertos UPnP y degradando sesiones P2P.',
      conclusionEvo: 'La máscara de subred define si el tráfico se resuelve localmente en capa 2 mediante ARP o si debe enviarse al router en capa 3.',
    },
    decisionRule: 'Si no hay acceso a Internet pero el ping al gateway (192.168.x.1) responde con éxito, el problema está en la conexión WAN del ISP o en la resolución DNS, nunca en la tarjeta de red local.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'scheduler-hybrid',
      badgeLabel: 'ROUTING TABLE & CIDR',
    },
  },
  {
    id: 't05-c04',
    moduleNumber: 'M02',
    chapterNumber: '04',
    title: 'Servicios de Red: DHCP & Resolución DNS',
    subtitle: 'El proceso DORA, servidores raíz, registros A/AAAA/PTR y TTL',
    readTime: '13 min',
    topicsCovered: ['12 DHCP', '13 DNS', '28 Firewall básico', '33 Problemas reales de red'],
    capa1Explicacion:
      'Nadie quiere configurar manualmente la IP de cada teléfono o televisor que entra a su casa: DHCP (Dynamic Host Configuration Protocol) lo hace automáticamente entregando IP, máscara, gateway y servidores DNS. Por su parte, DNS (Domain Name System) es la libreta de contactos de Internet: traduce nombres legibles para humanos como `google.com` a direcciones binarias como `142.250.190.46`.',
    capa2DetalleTecnico:
      'DHCP opera en UDP (puertos 67 servidor y 68 cliente) siguiendo la secuencia DORA: Discover (Broadcast cliente) → Offer (Unicast/Broadcast servidor) → Request (Petición de reserva) → Acknowledge (Confirmación con tiempo de concesión Lease Time). DNS opera en UDP puerto 53 (usando TCP 53 para transferencias de zona o respuestas > 512 bytes). Los resolvedores locales consultan cachés, luego servidores Root Hints, TLDs (.com) y finalmente servidores autoritativos. Cada respuesta contiene un TTL (Time To Live) que determina cuántos segundos puede almacenarse en caché antes de reconsultarse.',
    capa3PracticaMedicion:
      'Auditoría con terminal: `nslookup google.com` y `Resolve-DnsName google.com` en PowerShell. Comparar tiempos de respuesta de DNS entre el router ISP (muchas veces lento) y resolvedores globales (`1.1.1.1`, `8.8.8.8`, `9.9.9.9`). Vaciar caché con `ipconfig /flushdns`. Liberar y renovar concesión con `ipconfig /release` y `ipconfig /renew`.',
    microformatos: {
      mito: 'Mito: "Cambiar las DNS aumenta la velocidad de descarga en Steam o Netflix."',
      errorComun: 'Culpar al proveedor de Internet de que "se cayó la red" cuando en realidad el gateway funciona pero el servidor DNS asignado por el ISP dejó de responder solicitudes.',
      comprobalo: 'Si una página no abre, ejecutá `ping 8.8.8.8`. Si responde, tenés Internet perfecto y la falla es 100% de resolución DNS.',
      paraTecnicos: 'DNS over HTTPS (DoH) y DNS over TLS (DoT) cifran las consultas en el puerto 443/853, evitando la inspección y manipulación no autorizada de paquetes UDP 53 sin cifrar.',
      conclusionEvo: 'Distinguir entre fallo de transporte (enlace caído) y fallo de resolución (DNS muerto) ahorra horas de reinicios innecesarios de equipos.',
    },
    decisionRule: 'Ante fallos de navegación con ping exitoso a IPs públicas numéricas, reemplazar temporalmente el DNS primario por 1.1.1.1 o 8.8.8.8 en la interfaz para confirmar o descartar el resolver del ISP.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'telemetry-diagtrack',
      badgeLabel: 'DHCP DORA & DNS RESOLVER',
    },
  },
  {
    id: 't05-c05',
    moduleNumber: 'M03',
    chapterNumber: '05',
    title: 'Capa de Transporte (L4): TCP vs UDP & Sockets',
    subtitle: 'El 3-Way Handshake, control de congestión, ventana deslizante y puertos',
    readTime: '15 min',
    topicsCovered: ['15 TCP', '16 UDP', '17 Puertos y sockets', '22 Latencia', '23 Jitter', '24 Pérdida de paquetes'],
    capa1Explicacion:
      'Una vez que los paquetes saben a qué computadora van (IP), deben saber a qué aplicación exacta corresponden: para eso existen los puertos (números del 1 al 65535). Y existen dos grandes filosofías de entrega: TCP, que es como una carta certificada con acuse de recibo que garantiza que todo llegue completo y en orden; y UDP, que es como un megáfono que envía datos a máxima velocidad sin esperar confirmación, ideal para juegos o transmisiones en vivo.',
    capa2DetalleTecnico:
      'TCP (RFC 9293) establece conexión mediante el saludo de tres vías: `SYN` → `SYN-ACK` → `ACK`. Implementa números de secuencia, acuses de recibo acumulativos (ACK), ventana deslizante (Window Size / RFC 7323 Window Scale) y algoritmos de control de congestión (Cubic, BBR). Si un paquete se pierde, TCP lo retransmite obligatoriamente y reduce la ventana, introduciendo un retardo conocido como Head-of-Line Blocking. UDP (RFC 768) solo agrega 8 bytes de cabecera (puerto origen, puerto destino, longitud y checksum opcional), delegando cualquier recuperación de errores a la capa de aplicación (como hace QUIC / HTTP/3).',
    capa3PracticaMedicion:
      'Monitoreo de sockets activos en consola: `netstat -ano` en Windows o `ss -tulpn` en Linux. Identificar sockets en estado `ESTABLISHED`, `LISTEN`, `TIME_WAIT` o `CLOSE_WAIT` vinculados al PID del proceso que los abrió.',
    microformatos: {
      mito: 'Mito: "TCP es lento y obsoleto frente a UDP."',
      errorComun: 'Creer que un puerto abierto en el firewall de Windows es vulnerable si no hay ningún proceso real escuchando (`LISTEN`) en ese socket.',
      comprobalo: 'Con Wireshark, capturá la apertura de una conexión web y observá los flags `[SYN]`, `[SYN, ACK]`, `[ACK]` con sus tiempos delta medidos en microsegundos.',
      paraTecnicos: 'Un socket es la tupla matemática inmutable: `{IP Origen, Puerto Origen, IP Destino, Puerto Destino, Protocolo}`. Dos navegadores pueden conectarse al mismo servidor web puerto 443 porque sus puertos efímeros de origen son distintos.',
      conclusionEvo: 'Para descargas de archivos e integridad bancaria se usa TCP; para audio en tiempo real y posición de jugadores en multijugador se usa UDP.',
    },
    decisionRule: 'Si una aplicación reporta desconexiones intermitentes pero el ping promedio es bajo, auditar micro-pérdidas de paquetes (packet loss > 1%) que obligan a TCP a colapsar su ventana de congestión.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'timer-resolution',
      badgeLabel: 'TCP HANDSHAKE & SOCKETS',
    },
  },
  {
    id: 't05-c06',
    moduleNumber: 'M03',
    chapterNumber: '06',
    title: 'Redes Inalámbricas: Wi-Fi 2.4, 5 & 6 GHz',
    subtitle: 'Canales, ancho de banda espectral, atenuación, DFS y modulación QAM',
    readTime: '14 min',
    topicsCovered: ['19 Wi-Fi', '20 2.4 / 5 / 6 GHz', '21 Canales e interferencia', '25 Ancho de banda', '26 QoS'],
    capa1Explicacion:
      'El cable transmite luz o pulsos eléctricos encapsulados; el Wi-Fi comparte el aire como un salón lleno de gente hablando al mismo tiempo. La banda de 2.4 GHz tiene gran alcance pero atraviesa paredes con poca velocidad y mucho ruido (microondas, Bluetooth, vecinos). La banda de 5 GHz y 6 GHz tiene velocidades gigantescas pero sufre mucha mayor atenuación física ante paredes u obstáculos sólidos.',
    capa2DetalleTecnico:
      'Wi-Fi se rige por IEEE 802.11 (Half-Duplex mediante CSMA/CA con retroceso exponencial). En 2.4 GHz solo existen 3 canales no superpuestos de 20 MHz: canales 1, 6 y 11. El uso de anchos de 40 MHz en 2.4 GHz genera interferencia co-canal destructiva. En 5 GHz y 6 GHz (Wi-Fi 6E/7) se alcanzan canales de 80 y 160/320 MHz con modulaciones de hasta 4096-QAM y OFDMA (Orthogonal Frequency Division Multiple Access), pero requieren soportar canales DFS (Dynamic Frequency Selection) que deben desconectarse si detectan radares meteorológicos o militares.',
    capa3PracticaMedicion:
      'Auditar el entorno Wi-Fi desde PowerShell con `netsh wlan show interfaces` (medir intensidad de señal RSSI en dBm y tasa de transmisión `Receive rate / Transmit rate`) y `netsh wlan show networks mode=bssid` para ver los canales de los routers colindantes.',
    microformatos: {
      mito: 'Mito: "Configurar el router en canal de 40 MHz o 80 MHz en 2.4 GHz siempre duplica la velocidad."',
      errorComun: 'Usar canales 2, 3, 4 o 9 en 2.4 GHz: esto provoca interferencia adyacente con los canales 1 y 6 simultáneamente, reduciendo la relación señal/ruido (SNR) de toda la cuadra.',
      comprobalo: 'Medí tu RSSI: si estás por debajo de -75 dBm, la modulación cae a los escalones más bajos y el jitter se dispara aunque el speedtest marque números aceptables.',
      paraTecnicos: 'El roaming agresivo ocurre cuando el cliente Wi-Fi busca constantemente saltar entre 2.4 GHz y 5 GHz porque ambas bandas tienen exactamente el mismo nombre (SSID) y niveles de potencia no calibrados.',
      conclusionEvo: 'Para gaming y diagnóstico crítico, el cable Ethernet de 1000 Mbps siempre superará al mejor Wi-Fi debido a la naturaleza determinista Full-Duplex del cobre.',
    },
    decisionRule: 'En entornos residenciales congestionados, forzar los equipos fijos de alto rendimiento a 5/6 GHz en canal limpio o cable Ethernet directo, reservando 2.4 GHz exclusivamente para domótica IoT.',
    benchTarget: {
      labView: 'hotswap-lab',
      scenario: 'ab-bench',
      badgeLabel: 'ESPECTRO WI-FI & RSSI',
    },
  },
  {
    id: 't05-c07',
    moduleNumber: 'M04',
    chapterNumber: '07',
    title: 'Diagnóstico Pericial: Wireshark & Captura de Tráfico',
    subtitle: 'Filtros de captura BPF, análisis de flujos, RTT, retransmisiones y triage',
    readTime: '16 min',
    topicsCovered: ['29 Diagnóstico por capas', '30 Captura de paquetes', '31 Wireshark', '32 Herramientas Windows/Linux', '33 Problemas reales de red'],
    capa1Explicacion:
      'Cuando todos los tests comerciales fallan en explicar por qué una conexión se corta o un juego tiene tirones, la herramienta definitiva es Wireshark: el microscopio digital de las redes. Te permite ver cada byte individual que sale y entra por tu placa de red, revelando si los servidores remotos están descartando paquetes, si el router está saturado o si un programa en segundo plano está consumiendo tu ancho de banda.',
    capa2DetalleTecnico:
      'Wireshark utiliza bibliotecas de captura en modo promiscuo (Npcap en Windows, libpcap en Linux). Permite aplicar filtros de captura Berkeley Packet Filter (BPF) antes de guardar (ej. `host 192.168.1.1 and port 53`) y filtros de visualización (Display Filters) en tiempo real (ej. `tcp.analysis.retransmission`, `dns.flags.response == 0`, `tcp.time_delta > 0.1`). Permite reconstruir flujos TCP completos con "Follow TCP Stream" y graficar el tiempo de ida y vuelta (Round-Trip Time / RTT) de cada segmento.',
    capa3PracticaMedicion:
      'Capturar una descarga y filtrar por `tcp.analysis.flags`: si el ratio de retransmisiones supera el 2-3%, existe pérdida física de paquetes o congestión de buffer en el trayecto. Inspeccionar el tiempo de resolución DNS con `dns.time > 0.05` (más de 50 ms en responder la consulta).',
    microformatos: {
      mito: 'Mito: "Wireshark es una herramienta de hackers para robar contraseñas."',
      errorComun: 'Intentar leer contenido de páginas HTTPS en Wireshark sin tener las claves de sesión TLS: todo el payload viaja cifrado con AES-GCM o ChaCha20; Wireshark analiza metadatos, puertos, latencias y cabeceras.',
      comprobalo: 'Capturá 30 segundos mientras jugás o navegás, andá a Statistics → Capture File Properties y observá el Average Packet Rate y la tasa de pérdida de paquetes real.',
      paraTecnicos: 'El análisis de TCP Window Full indica que el emisor ha agotado la capacidad del búfer que el receptor le anunció, provocando pausas forzadas en la transmisión.',
      conclusionEvo: 'Los datos de Wireshark son inmutables: frente a un reclamo técnico a un ISP, un archivo `.pcapng` con retransmisiones documentadas es evidencia pericial irrefutable.',
    },
    decisionRule: 'Ante quejas de "lag misterioso", capturar 60 segundos de sesión activa en Wireshark y filtrar por `tcp.analysis.retransmission || icmp`: si hay retransmisiones repetitivas con ping bajo, el problema es micro-congestión en nodos intermedios.',
    benchTarget: {
      labView: 'windows-matrix',
      scenario: 'dpc-conflict',
      badgeLabel: 'WIRESHARK RAW TRACE',
    },
  },
];

export const TOMO_05_CASES: Tomo05CaseStudy[] = [
  {
    id: 'case-01',
    title: 'Caso 1: Enlace contratado de 500 Mbps que solo descarga a 92 Mbps',
    symptom: 'El cliente contrató 500 Mbps de fibra óptica pero todas las pruebas de velocidad se clavan en exactamente 90-95 Mbps en su PC de escritorio conectada por cable.',
    diagnosticLayer: 'Capa 2 (Enlace de Datos / Físico)',
    telemetryMeasured: 'Velocidad de vínculo en Windows: 100/100 Mbps (Fast Ethernet) en vez de 1000/1000 Mbps.',
    discardedHypothesis: 'Se sospechó de saturación de la ONT del ISP o limitación de CPU de la computadora.',
    rootCause: 'El cable Cat5e de 15 metros que cruzaba la casa tenía el pin 8 (marrón) cortado por una puerta. Ethernet 100BASE-TX solo requiere 2 pares (pines 1, 2, 3, 6); al faltar el pin 8, el autonegotiation degradó a 100 Mbps simétricos (tope real 94 Mbps útiles por overhead).',
    fixAction: 'Se recrimpó la ficha RJ45 con estándar T568B verificando continuidad en los 8 pines con tester de red.',
    verificationCmd: '`Get-NetAdapter | Select-Object Name, LinkSpeed` confirmó 1 Gbps; speedtest superó los 510 Mbps inmediatamente.',
  },
  {
    id: 'case-02',
    title: 'Caso 2: Ping excelente en reposo pero picos de 800 ms al descargar o jugar',
    symptom: 'El ping a 8.8.8.8 es de 12 ms, pero en cuanto alguien abre un video o descarga una actualización, el ping sube a 600-900 ms y las llamadas de Discord se cortan.',
    diagnosticLayer: 'Capa 3 y Capa 4 (Encolamiento / Bufferbloat)',
    telemetryMeasured: 'Bufferbloat grade "F" en Waveform test: latencia en reposo 14 ms, latencia bajo carga de subida 740 ms.',
    discardedHypothesis: 'Se sospechó de malware subiendo datos en segundo plano o falla en la placa Wi-Fi.',
    rootCause: 'Búferes FIFO sobredimensionados en el router del proveedor sin control activo de colas. La cola de paquetes de subida se llena al máximo antes de descartar, introduciendo cientos de milisegundos de retardo de encolamiento.',
    fixAction: 'Se implementó un router con algoritmo SQM (Smart Queue Management) con disciplina Cake / FQ_CoDel limitando el ancho de banda al 95% del enlace máximo real.',
    verificationCmd: 'Test Bufferbloat alcanzó calificación A+; el ping bajo carga máxima se mantuvo en 16 ms.',
  },
  {
    id: 'case-03',
    title: 'Caso 3: Navegación caída pero servicios de chat y Steam siguen conectados',
    symptom: 'El usuario no puede abrir ninguna página en Chrome o Edge ("No se puede acceder a este sitio"), pero los mensajes de Discord siguen llegando y las descargas activas continúan.',
    diagnosticLayer: 'Capa 7 (Resolución DNS)',
    telemetryMeasured: 'Ping a 1.1.1.1 responde en 9 ms con 0% pérdida. Consulta `nslookup google.com` arroja "DNS request timed out tras 2 segundos".',
    discardedHypothesis: 'Se descartó corte físico de fibra óptica y falla de DHCP (el equipo tenía IP válida).',
    rootCause: 'El servidor DNS primario provisto por el router (192.168.1.1 que reenvía a las IPs del ISP) colapsó por sobrecarga de consultas en el nodo central del proveedor.',
    fixAction: 'Se configuraron manualmente servidores DNS confiables y cifrados (1.1.1.1 y 8.8.8.8) directamente en el adaptador de red.',
    verificationCmd: '`Resolve-DnsName google.com` resolvió en 11 ms y la navegación web volvió al instante.',
  },
  {
    id: 'case-04',
    title: 'Caso 4: Consola de juegos reporta "NAT Estricta / NAT Tipo 3" y no une a partidas',
    symptom: 'Un jugador con conexión de 300 Mbps no puede ser anfitrión de partidas y sufre desconexiones constantes en lobbies multijugador.',
    diagnosticLayer: 'Capa 3 / Capa 4 (Network Address Translation)',
    telemetryMeasured: 'La interfaz WAN del router del usuario tiene la IP `192.168.1.100` y el router del proveedor tiene la IP `192.168.1.1`. Ambas son direcciones privadas RFC 1918.',
    discardedHypothesis: 'Se descartó que los puertos estuvieran cerrados en la consola de juegos.',
    rootCause: 'Arquitectura de Doble NAT: el módem de fibra del ISP estaba actuando como router con NAT activo, y el router Wi-Fi propio del usuario también estaba haciendo NAT hacia la red interna 192.168.0.0/24.',
    fixAction: 'Se configuró el módem del ISP en modo Puente (Bridge / ONT pura) para que el router propio tome directamente la IP pública y gestione UPnP y reenvío de puertos.',
    verificationCmd: 'La consola pasó a NAT Tipo 2 (Abierta/Moderada) y las conexiones P2P funcionaron sin bloqueos.',
  },
];

export const TOMO_05_GLOSSARY: Tomo05GlossaryItem[] = [
  {
    term: 'MAC Address (Media Access Control)',
    rfcOrStandard: 'IEEE 802 / EUI-48',
    definition: 'Identificador único de 48 bits (6 pares hexadecimales) asignado al adaptador de red a nivel de capa de enlace.',
    practicalTip: 'Los primeros 24 bits corresponden al OUI (identificador del fabricante del chip, ej. Intel, Realtek).',
  },
  {
    term: 'Subnet Mask / CIDR',
    rfcOrStandard: 'RFC 4632',
    definition: 'Máscara binaria que delimita la frontera entre la porción de red y la porción de host en una dirección IP.',
    practicalTip: 'Un prefijo /24 permite 254 computadoras; un prefijo /25 divide el segmento en dos bloques de 126 computadoras cada uno.',
  },
  {
    term: 'Default Gateway (Puerta de Enlace)',
    rfcOrStandard: 'RFC 1122',
    definition: 'El dispositivo de enrutamiento al que un nodo envía todo el tráfico destinado a direcciones fuera de su subred local.',
    practicalTip: 'Si tu gateway no responde a un ping, es físicamente imposible que llegues a ningún servidor de Internet.',
  },
  {
    term: 'Bufferbloat',
    rfcOrStandard: 'RFC 8290 / CoDel',
    definition: 'Latencia artificialmente elevada causada por búferes de paquetes excesivamente grandes en routers que tardan en vaciarse bajo carga.',
    practicalTip: 'Se soluciona con algoritmos de gestión activa de colas (SQM) como Cake o FQ-CoDel, no aumentando el ancho de banda contratado.',
  },
  {
    term: 'MTU (Maximum Transmission Unit)',
    rfcOrStandard: 'RFC 791 / RFC 894',
    definition: 'El tamaño máximo en bytes de la PDU que una interfaz puede transmitir sin fragmentación (típicamente 1500 bytes en Ethernet).',
    practicalTip: 'En conexiones con túneles PPPoE, una MTU de 1492 o mal ajuste de MSS causa que páginas con certificados TLS no terminen de cargar.',
  },
  {
    term: 'Wireshark Display Filter',
    rfcOrStandard: 'Wireshark Foundation',
    definition: 'Sintaxis de consulta lógica aplicada sobre paquetes ya capturados en memoria para aislar eventos y anomalías.',
    practicalTip: 'El filtro `tcp.analysis.retransmission` aísla los paquetes que tuvieron que reenviarse debido a pérdidas en el trayecto.',
  },
];
