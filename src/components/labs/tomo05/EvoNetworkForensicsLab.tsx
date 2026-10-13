// ============================================================================
// EVO LABS // TOMO 05: EVO NETWORK FORENSICS LAB
// 05A Mapa de Red | 05B Latency Path | 05C Bandwidth vs Latency
// 05D DNS Lab | 05E WiFi Spectrum | 05F Packet Inspector + 5 Casos Guiados
// ============================================================================

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe,
  HardDrive,
  Layers,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Router,
  Search,
  Server,
  Shield,
  Smartphone,
  Terminal,
  Wifi,
  Zap,
} from 'lucide-react';
import { EvoLabFramework } from '../framework/EvoLabFramework';
import {
  DataOrigin,
  GuidedCase,
  SubLabModule,
  VerdictType,
} from '../framework/types';

interface EvoNetworkForensicsLabProps {
  onClose?: () => void;
  initialSubLabId?: string;
}

const TOMO_05_SUBLABS: SubLabModule[] = [
  {
    id: '05a-map',
    code: '05A',
    title: 'MAPA DE TOPOLOGÍA & ROLES // L1-L3',
    subtitle: 'Modelado visual de infraestructura LAN/WAN y servicios de red',
    category: 'TOPOLOGÍA DE RED',
    description:
      'Convertí tu red en un sistema observable. Modelá y auditá la topología completa desde la conexión WAN de Internet hasta los nodos finales, identificando el Gateway, servidores DHCP, reenviadores DNS y tablas NAT.',
    standardReference: 'IEEE 802.3 Ethernet / RFC 1812 IPv4 Router Requirements',
    systemVariables: [
      { name: 'Tipo de Enlace WAN', description: 'Fibra Óptica GPON (ONT) vs DOCSIS vs Enlace Dedicado', isControlled: true },
      { name: 'Velocidad de Switch', description: 'Autonegociación 100BASE-TX (Fast) vs 1000BASE-T (Gigabit) vs 2.5GbE' },
      { name: 'Segmentación', description: 'Plano único vs VLANs 802.1Q aisladas' },
      { name: 'Capacidad de Concurrencia', description: 'Límite de tabla de estado NAT en el router doméstico' },
    ],
    metrics: [
      {
        key: 'link_speed',
        name: 'Velocidad de Vínculo L1/L2',
        unit: 'Mbps',
        whatIsIt: 'Velocidad física de transmisión negociada entre la tarjeta de red y el puerto del switch.',
        whereItComesFrom: 'Registro de autonegociación MII del chip PHY de red.',
        whatItMeans: 'Capacidad máxima teórica de bits por segundo en el cable de red.',
        whatItDoesNotMean: 'No significa la velocidad contratada con tu proveedor de Internet ni el throughput real en capa 7.',
        formulaOrDetail: 'Ethernet Auto-Negotiation (IEEE 802.3u / 802.3ab)',
        dataOrigin: 'SIMULATED',
      },
      {
        key: 'nat_table_usage',
        name: 'Ocupación de Tabla NAT',
        unit: 'sesiones',
        whatIsIt: 'Cantidad de traducciones de puertos IP activas simultáneamente en el router.',
        whereItComesFrom: 'Conntrack de Linux o tabla de estado SPI del firewall.',
        whatItMeans: 'Carga de concurrencia y memoria consumida por conexiones TCP/UDP abiertas.',
        whatItDoesNotMean: 'No significa ancho de banda ocupado en Megabytes.',
        formulaOrDetail: 'Stateful Session Tracking: Source IP:Port <-> Public IP:Port',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La jerarquía física de interconexión y la negociación de enlaces entre nodos.',
      whyItMatters: 'Un cable dañado que degrade el vínculo a 100 Mbps frenará una conexión de 600 Mbps sin dar ningún mensaje de error visible.',
      whatCanBeConcluded: 'Si el enlace negocia a 100 Mbps, ningún test de velocidad en esa máquina superará ~94 Mbps netos.',
      whatCannotBeConcluded: 'No se puede concluir que el router esté roto si el problema radica en un conector RJ45 crimpado con pares abiertos.',
      evoGoldenRule: 'REGLA EVO: Ante una baja de velocidad drástica, auditá primero la velocidad de vínculo L2 antes de culpar al ISP.',
    },
  },
  {
    id: '05b-latency',
    code: '05B',
    title: 'LATENCY PATH ANALYZER // RTT & JITTER',
    subtitle: 'Trazado salto a salto (Hop-by-Hop) y localización de degradación',
    category: 'MÉTRICAS TEMPORALES',
    description:
      'Medí el tiempo de ida y vuelta (RTT), fluctuación (Jitter) y pérdida de paquetes en cada tramo: desde tu PC hasta el Gateway, el salto al ISP y el nodo de destino final.',
    standardReference: 'RFC 792 ICMP / RFC 3393 Packet Delay Variation (Jitter)',
    systemVariables: [
      { name: 'Salto 1 (LAN Gateway)', description: 'Latencia entre PC y Router local (< 1.0 ms en cable, 2-15 ms en Wi-Fi)' },
      { name: 'Salto 2 (ISP Edge)', description: 'Latencia de acceso a la central del proveedor (OLT/CMTS)' },
      { name: 'Salto 3 (Tier 1 Transit)', description: 'Tránsito interurbano o submarino hacia el servidor remoto' },
      { name: 'Jitter de Tráfico', description: 'Desviación estándar de los tiempos sucesivos de respuesta' },
    ],
    metrics: [
      {
        key: 'rtt_avg',
        name: 'RTT Promedio (Round Trip Time)',
        unit: 'ms',
        whatIsIt: 'Tiempo que tarda un paquete en viajar al destino y regresar.',
        whereItComesFrom: 'Marcas de tiempo ICMP Echo Request / Echo Reply.',
        whatItMeans: 'Retardo total de propagación, cola y procesamiento en la ruta.',
        whatItDoesNotMean: 'No significa lentitud de descarga; podés tener 1 Gbps con 120 ms de RTT.',
        formulaOrDetail: 'RTT = t_reply - t_send (Muestreo n=10)',
        dataOrigin: 'SIMULATED',
      },
      {
        key: 'jitter_ms',
        name: 'Jitter de Red',
        unit: 'ms',
        whatIsIt: 'Variación estadística entre los tiempos de llegada de paquetes consecutivos.',
        whereItComesFrom: 'Diferencias sucesivas $|RTT_{i} - RTT_{i-1}|$.',
        whatItMeans: 'Inconsistencia temporal provocada por saturación de colas o interferencia inalámbrica.',
        whatItDoesNotMean: 'No significa desconexión total ni caída del enlace.',
        formulaOrDetail: 'RFC 3550: J(i) = J(i-1) + (|D(i-1,i)| - J(i-1))/16',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La acumulación de retardo a lo largo de cada salto individual de la ruta IP.',
      whyItMatters: 'Permite aislar con certeza matemática si el lag ocurre dentro de tu casa (Wi-Fi), en la red de tu proveedor o en el servidor del juego.',
      whatCanBeConcluded: 'Si el Salto 1 (Gateway) tiene 45 ms con 10% de pérdida, el problema es 100% de tu red interna.',
      whatCannotBeConcluded: 'No concluyas que el ISP tiene la culpa si tu ping al router ya es inestable.',
      evoGoldenRule: 'REGLA EVO: El salto donde se dispara el ping por primera vez es el origen de la degradación.',
    },
  },
  {
    id: '05c-bandwidth-latency',
    code: '05C',
    title: 'BANDWIDTH VS LATENCIA // BUFFERBLOAT',
    subtitle: 'Demostración experimental de que ancho de banda ≠ tiempo de respuesta',
    category: 'DINÁMICA DE COLAS',
    description:
      'Comprobá empíricamente la diferencia física entre ancho de banda (caudal de tubería) y latencia (velocidad del fluido). Simulá el fenómeno de Bufferbloat al saturar la subida sin gestión de colas (SQM/CAKE).',
    standardReference: 'RFC 8290 CoDel Active Queue Management / RFC 896 Nagle Algorithm',
    systemVariables: [
      { name: 'Ancho de Banda Contratado', description: 'Capacidad nominal de descarga y subida en Mbps' },
      { name: 'Carga de Subida Concurrente', description: 'Porcentaje de saturación del canal de subida (0% a 100%)' },
      { name: 'Gestor de Colas (AQM)', description: 'Cola FIFO Estándar (Bufferbloat) vs FQ-CoDel / CAKE (SQM)' },
      { name: 'Tamaño de Buffer en Router', description: 'Capacidad de almacenamiento temporal de paquetes en memoria' },
    ],
    metrics: [
      {
        key: 'loaded_latency',
        name: 'Latencia bajo Carga (Bufferbloat)',
        unit: 'ms',
        whatIsIt: 'Tiempo de respuesta medido mientras la conexión se encuentra saturada al 100% de subida/bajada.',
        whereItComesFrom: 'Medición de ping durante transferencia sostenida TCP saturada.',
        whatItMeans: 'Impacto que sufren las aplicaciones interactivas cuando alguien en la red descarga o sube un archivo.',
        whatItDoesNotMean: 'No significa que tu plan de Internet sea insuficiente.',
        formulaOrDetail: 'Bufferbloat Delta = RTT_loaded - RTT_idle',
        dataOrigin: 'SIMULATED',
      },
      {
        key: 'packet_queue_delay',
        name: 'Retardo de Encolamiento',
        unit: 'ms',
        whatIsIt: 'Tiempo que un paquete pasa esperando en la memoria del router antes de ser transmitido.',
        whereItComesFrom: 'Cálculo de profundidad de cola / velocidad de vaciado del enlace.',
        whatItMeans: 'Retención evitable provocada por buffers gigantescos sin descarte inteligente.',
        whatItDoesNotMean: 'No es distancia geográfica al servidor.',
        formulaOrDetail: 'Queue Delay = Buffer_Bytes / Link_ByteRate',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'El comportamiento de la latencia en reposo vs bajo saturación continua.',
      whyItMatters: 'Tener 1,000 Mbps de fibra no evita que tu ping suba de 20ms a 350ms en juegos si el router usa colas FIFO sin SQM.',
      whatCanBeConcluded: 'Activar SQM (Smart Queue Management) reduce drásticamente el jitter bajo carga a costa de reservar ~5-10% de ancho de banda.',
      whatCannotBeConcluded: 'Contratar más Megas no solucionará el Bufferbloat si el algoritmo de colas sigue siendo FIFO ciego.',
      evoGoldenRule: 'REGLA EVO: Ancho de banda es capacidad de transporte; latencia es inmediatez de respuesta.',
    },
  },
  {
    id: '05d-dns',
    code: '05D',
    title: 'DNS FORENSICS LAB // RESOLUCIÓN & CACHE',
    subtitle: 'Análisis de tiempos de respuesta DNS, caché local y diagnóstico de fallos',
    category: 'SERVICIOS DE NOMBRES',
    description:
      'Compará el tiempo de resolución entre DNS de ISP, Cloudflare (1.1.1.1), Google (8.8.8.8) y caché local. Explicá por qué "Internet funciona por IP pero las páginas no abren en el navegador".',
    standardReference: 'RFC 1035 Domain Names / RFC 8484 DNS over HTTPS (DoH)',
    systemVariables: [
      { name: 'Servidor DNS Primario', description: 'DNS de ISP vs 1.1.1.1 vs 8.8.8.8 vs 9.9.9.9 (Quad9)' },
      { name: 'Estado de Caché Local', description: 'Caché vacía (Cold Query) vs Caché residente (Warm Query)' },
      { name: 'TTL del Registro', description: 'Tiempo de vida en segundos del registro DNS A/AAAA' },
      { name: 'Modo de Protocolo', description: 'UDP 53 estándar vs DoH (TLS cifrado)' },
    ],
    metrics: [
      {
        key: 'dns_lookup_time',
        name: 'Tiempo de Resolución DNS',
        unit: 'ms',
        whatIsIt: 'Tiempo que tarda el resolver en responder con la dirección IP correspondiente al nombre de dominio.',
        whereItComesFrom: 'Medición de socket UDP/DoH en consulta `nslookup` / `dig`.',
        whatItMeans: 'Demora previa que sufre cada conexión antes de poder iniciar el handshake TCP.',
        whatItDoesNotMean: 'No afecta la velocidad de descarga una vez establecida la conexión.',
        formulaOrDetail: 'Query Time = t_response - t_query',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La velocidad con la que los nombres de dominio se traducen a direcciones IP enrutables.',
      whyItMatters: 'Si el servidor DNS falla o tiene 200 ms de latencia, navegar se siente sumamente lento aunque tu ancho de banda sea 1 Gbps.',
      whatCanBeConcluded: 'Si podés hacer `ping 8.8.8.8` pero falla `ping google.com`, el problema es 100% de resolución DNS.',
      whatCannotBeConcluded: 'Cambiar de DNS no aumentará tus fotogramas por segundo en juegos online.',
      evoGoldenRule: 'REGLA EVO: Distinguí siempre la conectividad IP (Capa 3) de la resolución de nombres (Capa 7).',
    },
  },
  {
    id: '05e-wifi-spectrum',
    code: '05E',
    title: 'WIFI SPECTRUM & INTERFERENCIA RF',
    subtitle: 'Planificador de canales en 2.4 GHz, 5 GHz y 6 GHz con atenuación física',
    category: 'RADIOFRECUENCIA EDUCATIVA',
    description:
      'Simulá la distribución espectral de señales inalámbricas. Observá el solapamiento destructivo en 2.4 GHz (canales 1, 6 y 11) y el impacto de los muros de hormigón en la atenuación de 5 GHz vs 2.4 GHz.',
    standardReference: 'IEEE 802.11ax (Wi-Fi 6) / ITU-R P.1238 Indoor Radio Propagation',
    systemVariables: [
      { name: 'Banda de Frecuencia', description: '2.4 GHz (mayor alcance, menor velocidad) vs 5 GHz vs 6 GHz (Wi-Fi 6E/7)' },
      { name: 'Ancho de Canal', description: '20 MHz vs 40 MHz vs 80 MHz vs 160 MHz' },
      { name: 'Canal Seleccionado', description: 'Canales no solapados (1, 6, 11) vs canales solapados (e.g. Canal 8)' },
      { name: 'Obstáculos Físicos', description: 'Línea de vista directa vs Pared de yeso (-4dB) vs Hormigón armado (-18dB)' },
    ],
    metrics: [
      {
        key: 'rssi_dbm',
        name: 'Potencia de Señal RSSI',
        unit: 'dBm',
        whatIsIt: 'Nivel de potencia de radiofrecuencia recibida por la antena.',
        whereItComesFrom: 'Cálculo de propagación Free-Space Path Loss (FSPL) + atenuación de obstáculos.',
        whatItMeans: 'Fuerza de la señal: -40 dBm (excelente), -70 dBm (límite aceptable), -85 dBm (degradación severa).',
        whatItDoesNotMean: 'No garantiza velocidad si hay interferencia cocanal severa.',
        formulaOrDetail: 'FSPL(dB) = 20*log10(d) + 20*log10(f) + 92.45 - Obstacles',
        dataOrigin: 'SIMULATED',
      },
      {
        key: 'retry_rate',
        name: 'Tasa de Retransmisión Wi-Fi',
        unit: '%',
        whatIsIt: 'Porcentaje de tramas que no reciben ACK y deben reenviarse por colisión o ruido.',
        whereItComesFrom: 'Contadores MAC 802.11 de tramas retransmitidas.',
        whatItMeans: 'Pérdida de eficiencia y causa directa de micro-cortes y spikes de jitter en Wi-Fi.',
        whatItDoesNotMean: 'No significa que el cable de fibra esté cortado.',
        formulaOrDetail: 'Retry Rate = (Retransmitted Frames / Total Frames) * 100',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La relación entre potencia de señal recibida (RSSI) e interferencia en el espectro inalámbrico.',
      whyItMatters: 'En 2.4 GHz, usar el canal 8 genera interferencia simultánea con las redes en los canales 6 y 11, arruinando ambas.',
      whatCanBeConcluded: 'En 2.4 GHz solo deben usarse los canales 1, 6 u 11; en 5 GHz los canales son independientes pero sufren mayor absorción en muros.',
      whatCannotBeConcluded: 'Tener "todas las barras de Wi-Fi" no garantiza baja latencia si el canal está saturado de tráfico de vecinos.',
      evoGoldenRule: 'REGLA EVO: Para baja latencia determinista, el cable Ethernet de cobre no tiene sustituto en radiofrecuencia.',
    },
  },
  {
    id: '05f-packet-inspector',
    code: '05F',
    title: 'PACKET INSPECTOR // AUDITORÍA L2-L7',
    subtitle: 'Decodificador educativo de tramas Ethernet, cabeceras IP, TCP Flags y payload',
    category: 'INSPECCIÓN DE PAQUETES',
    description:
      'Inspeccioná la anatomía de un paquete de red real o de muestra segura. Desglosá la dirección MAC L2, direccionamiento IP L3, puertos y flags TCP L4 (SYN, ACK, FIN, RST) y datos de aplicación L7.',
    standardReference: 'RFC 791 IPv4 / RFC 793 Transmission Control Protocol / RFC 1035 DNS',
    systemVariables: [
      { name: 'Protocolo de Transporte', description: 'TCP (Confiable, orientado a conexión) vs UDP (Sin conexión, baja sobrecarga)' },
      { name: 'Flags TCP Activas', description: 'SYN, SYN-ACK, ACK, PSH, FIN, RST' },
      { name: 'Tamaño de Ventana TCP', description: 'Window Size para control de flujo entre emisor y receptor' },
      { name: 'Tamaño de Payload', description: 'Bytes de datos transportados dentro de la MTU estándar (1500 bytes)' },
    ],
    metrics: [
      {
        key: 'header_overhead',
        name: 'Sobrecarga de Cabecera (Overhead)',
        unit: 'bytes',
        whatIsIt: 'Cantidad de bytes dedicados exclusivamente al control y enrutamiento del paquete.',
        whereItComesFrom: 'Suma de cabeceras: Ethernet (14B) + IP (20B) + TCP (20B-32B).',
        whatItMeans: 'Proporción de metadatos de control respecto al payload útil transportado.',
        whatItDoesNotMean: 'No significa datos corruptos; son necesarios para el protocolo.',
        formulaOrDetail: 'Total Frame = Eth(14) + IP(20) + TCP(20) + Payload + FCS(4)',
        dataOrigin: 'SIMULATED',
      },
    ],
    tutorAdvice: {
      whatYouAreMeasuring: 'La estructura de capas del paquete de red y el estado del protocolo de transporte.',
      whyItMatters: 'Ver un flag RST en Wireshark indica que el servidor remoto o un firewall cerró abruptamente el socket.',
      whatCanBeConcluded: 'Un paquete TCP requiere un Three-Way Handshake (SYN -> SYN-ACK -> ACK) antes de poder enviar cualquier dato.',
      whatCannotBeConcluded: 'No asumas que un paquete perdido significa malware; la congestión normal descarta paquetes de forma probabilística.',
      evoGoldenRule: 'REGLA EVO: Los paquetes no mienten; inspeccionar las cabeceras revela la causa exacta del rechazo de conexión.',
    },
  },
];

const TOMO_05_GUIDED_CASES: GuidedCase[] = [
  {
    id: 'case-05-01',
    caseNumber: 'CASO 01',
    title: 'Velocidad clavada en 94 Mbps en servicio de fibra de 600 Mbps',
    symptom: 'El cliente contrató 600 Mbps pero los tests de velocidad en su PC nunca superan los 93.8 Mbps.',
    evidence: 'En Windows, el adaptador Ethernet indica "Velocidad de vínculo: 100/100 (Mbps)".',
    hypothesis: 'El cable Cat5e tiene dañado al menos un hilo de los pares 4-5 o 7-8, forzando Fast Ethernet (100BASE-TX) de 2 pares.',
    testAction: 'Auditar el enlace L2 en el mapa de red y simular reemplazo de cable a 4 pares íntegros.',
    resultSummary: 'El vínculo autonegocia a 1000/1000 Mbps y la velocidad real alcanza los 602 Mbps.',
    conclusion: 'Gigabit Ethernet requiere los 4 pares trenzados intactos. Un conector dañado degrada la velocidad a 100 Mbps sin cortar la conexión.',
    targetSubLabId: '05a-map',
  },
  {
    id: 'case-05-02',
    caseNumber: 'CASO 02',
    title: 'Picos de 400 ms de Ping en juegos cuando se sube un video',
    symptom: 'El juego funciona a 22 ms, pero al iniciar una copia de seguridad en Google Drive, el ping se dispara a 380 ms con stuttering constante.',
    evidence: 'Ping al primer salto del ISP sube de 12 ms a 350 ms durante la subida continua.',
    hypothesis: 'Bufferbloat severo por colas FIFO sobredimensionadas en el router doméstico sin gestión activa de colas.',
    testAction: 'Activar algoritmo de gestión de colas SQM (CAKE / FQ-CoDel) en el banco Bufferbloat.',
    resultSummary: 'Latencia bajo carga máxima de subida desciende de 380 ms a 24 ms (+2 ms de delta).',
    conclusion: 'El problema no es falta de ancho de banda sino saturación de buffers. SQM prioriza paquetes pequeños (juegos/voz) sobre transferencias masivas.',
    targetSubLabId: '05c-bandwidth-latency',
  },
  {
    id: 'case-05-03',
    caseNumber: 'CASO 03',
    title: 'Páginas web no abren pero Discord y juegos online funcionan',
    symptom: 'El navegador muestra "ERR_NAME_NOT_RESOLVED", pero las llamadas de voz en Discord continúan activas.',
    evidence: 'Ping a 8.8.8.8 responde con 15 ms, pero `nslookup google.com` da timeout.',
    hypothesis: 'Fallo total del servidor DNS configurado en el router (Capa 7), mientras el enrutamiento IP (Capa 3) está 100% operativo.',
    testAction: 'Cambiar el resolver DNS primario a 1.1.1.1 / 8.8.8.8 en el DNS Forensics Lab.',
    resultSummary: 'Resolución de nombres restaurada en 12 ms; navegación web operativa.',
    conclusion: 'Distinguir Capa 3 de Capa 7 es esencial: la conectividad IP existía, pero el traductor de nombres estaba caído.',
    targetSubLabId: '05d-dns',
  },
  {
    id: 'case-05-04',
    caseNumber: 'CASO 04',
    title: 'Desconexiones periódicas en Wi-Fi 2.4 GHz cada 15 minutos',
    symptom: 'La señal Wi-Fi muestra 4 barras pero se producen caídas abruptas de throughput y 20% de pérdida de paquetes.',
    evidence: 'El router del usuario está configurado en Canal 8 en un vecindario denso con routers en Canales 6 y 11.',
    hypothesis: 'Interferencia cocanal y adyacente destructiva que provoca colisiones constantes y ráfagas de retransmisiones.',
    testAction: 'Mudar la red al Canal 1 o 6 no solapado en el planificador de espectro o migrar a 5 GHz.',
    resultSummary: 'Tasa de retransmisiones cae del 28% al 1.8%; jitter se reduce a 2 ms.',
    conclusion: 'Los canales solapados (2, 3, 4, 5, 7, 8, 9, 10) en 2.4 GHz violan la separación de 22 MHz, causando colisiones no detectables por CSMA/CA.',
    targetSubLabId: '05e-wifi-spectrum',
  },
  {
    id: 'case-05-05',
    caseNumber: 'CASO 05',
    title: 'Descargas HTTPS se congelan exactamente en el 5% inicial',
    symptom: 'Las páginas simples abren bien, pero descargar archivos grandes por HTTPS o VPN se congela sin error aparente.',
    evidence: 'Inspección de paquetes muestra tramas con flag DF (Don\'t Fragment) rechazadas con ICMP Type 3 Code 4 (Fragmentation Needed).',
    hypothesis: 'Discrepancia de MTU/MSS en túnel VPN o enlace PPPoE que descarta paquetes de más de 1492 bytes.',
    testAction: 'Ajustar TCP MSS Clamping a 1452 bytes en el Packet Inspector.',
    resultSummary: 'Transferencias fluidas sin congelamientos ni paquetes descartados.',
    conclusion: 'La sobrecarga de encapsulación de túneles reduce la MTU efectiva; el MSS Clamping adapta el tamaño máximo de segmento TCP.',
    targetSubLabId: '05f-packet-inspector',
  },
];

export const EvoNetworkForensicsLab: React.FC<EvoNetworkForensicsLabProps> = ({
  onClose,
  initialSubLabId,
}) => {
  const [activeSubLabId, setActiveSubLabId] = useState<string>(() => TOMO_05_SUBLABS.some((lab) => lab.id === initialSubLabId) ? initialSubLabId! : '05a-map');

  // Interactive state for 05A: Map
  const [linkSpeedMode, setLinkSpeedMode] = useState<'100M' | '1000M' | '2.5G'>('100M');
  const [vlanEnabled, setVlanEnabled] = useState<boolean>(false);

  // Interactive state for 05B: Latency
  const [selectedTarget, setSelectedTarget] = useState<'gateway' | 'isp' | 'google' | 'game_server'>('game_server');
  const [wifiHopActive, setWifiHopActive] = useState<boolean>(true);

  // Interactive state for 05C: Bandwidth vs Latency
  const [uploadLoadPercent, setUploadLoadPercent] = useState<number>(90);
  const [sqmEnabled, setSqmEnabled] = useState<boolean>(false);

  // Interactive state for 05D: DNS
  const [selectedDnsProvider, setSelectedDnsProvider] = useState<'isp_broken' | 'isp_slow' | 'cloudflare' | 'google'>('isp_broken');
  const [dnsCacheWarm, setDnsCacheWarm] = useState<boolean>(false);

  // Interactive state for 05E: WiFi
  const [wifiBand, setWifiBand] = useState<'2.4G' | '5G' | '6G'>('2.4G');
  const [wifiChannel, setWifiChannel] = useState<number>(8); // Bad channel
  const [wallObstacle, setWallObstacle] = useState<'none' | 'drywall' | 'concrete'>('concrete');

  // Interactive state for 05F: Packet
  const [selectedPacketType, setSelectedPacketType] = useState<'tcp_syn' | 'tcp_rst' | 'dns_query' | 'icmp_echo'>('tcp_syn');

  return (
    <EvoLabFramework
      tomeId="tomo-05"
      tomeNumber="05"
      tomeTitle="REDES // TRÁFICO, PROTOCOLOS & DIAGNÓSTICO PERICIAL"
      accentColor="#06b6d4"
      subLabs={TOMO_05_SUBLABS}
      guidedCases={TOMO_05_GUIDED_CASES}
      activeSubLabId={activeSubLabId}
      onSelectSubLab={setActiveSubLabId}
      onClose={onClose}
      renderExperimentStation={({ activeSubLab, isDeepMode, onRecordMeasurement }) => {
        // LAB 05A // MAPA DE RED
        if (activeSubLab.id === '05a-map') {
          const effectiveThroughput = linkSpeedMode === '100M' ? 94.2 : linkSpeedMode === '1000M' ? 940.5 : 2350.0;
          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    NEGOCIACIÓN FÍSICA (L1/L2)
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setLinkSpeedMode('100M')}
                      className={`w-full py-1.5 px-2 rounded font-mono-tech text-xs font-bold text-left transition-all ${
                        linkSpeedMode === '100M'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      100BASE-TX (2 Pares // 100 Mbps)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLinkSpeedMode('1000M')}
                      className={`w-full py-1.5 px-2 rounded font-mono-tech text-xs font-bold text-left transition-all ${
                        linkSpeedMode === '1000M'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      1000BASE-T (4 Pares // 1 Gbps)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLinkSpeedMode('2.5G')}
                      className={`w-full py-1.5 px-2 rounded font-mono-tech text-xs font-bold text-left transition-all ${
                        linkSpeedMode === '2.5G'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      2.5GBASE-T (Cat6 // 2.5 Gbps)
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    SEGMENTACIÓN L2
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={vlanEnabled}
                      onChange={(e) => setVlanEnabled(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    <span className="font-mono-tech text-zinc-200">VLAN 802.1Q Aislada</span>
                  </label>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial">
                    {vlanEnabled
                      ? 'Tráfico IoT y broadcast aislado del segmento de computadoras periciales.'
                      : 'Plano único: tormentas de broadcast visibles en todos los puertos.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2 font-mono-tech">
                  <div className="text-[10px] text-zinc-400 uppercase">THROUGHPUT L7 MEDIDO</div>
                  <div className="text-2xl font-black text-white">
                    {effectiveThroughput} <span className="text-xs text-amber-400 font-normal">Mbps</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Límite Físico: {linkSpeedMode === '100M' ? 'Cuello de botella en cable' : 'Óptimo'}
                  </div>
                </div>
              </div>

              {/* Visual Topology Diagram */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 space-y-3">
                <div className="text-[10px] font-mono-tech text-zinc-400 uppercase">
                  DIAGRAMA DE TOPOLOGÍA DETERMINISTA
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center font-mono-tech text-xs">
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700 w-full md:w-32">
                    <Globe className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <div className="font-bold text-white">INTERNET</div>
                    <div className="text-[9px] text-zinc-500">WAN IP Pública</div>
                  </div>
                  <span className="text-zinc-600 font-bold">──[GPON]──</span>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700 w-full md:w-36">
                    <Router className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <div className="font-bold text-white">ONT / ROUTER</div>
                    <div className="text-[9px] text-zinc-400">192.168.1.1 (NAT/DHCP)</div>
                  </div>
                  <span className="text-zinc-600 font-bold">
                    ──[{linkSpeedMode === '100M' ? '⚠️ 100M' : '1000M'}]──
                  </span>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700 w-full md:w-32">
                    <Layers className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <div className="font-bold text-white">SWITCH L2</div>
                    <div className="text-[9px] text-zinc-500">{vlanEnabled ? 'VLAN 10/20' : 'Plano 1'}</div>
                  </div>
                  <span className="text-zinc-600 font-bold">──[RJ45]──</span>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700 w-full md:w-32">
                    <Terminal className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="font-bold text-white">PC LAB</div>
                    <div className="text-[9px] text-zinc-400">192.168.1.100</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO: {linkSpeedMode === '100M' ? 'DEGRADACIÓN CONFIRMADA' : 'CAPACIDAD GIGABIT COMPROBADA'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Velocidad de Enlace Físico (${linkSpeedMode})`,
                      baselineValue: 94.2,
                      experimentValue: effectiveThroughput,
                      deltaValue: (effectiveThroughput - 94.2).toFixed(1),
                      metricKey: 'link_speed',
                      metricUnit: 'Mbps',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Simulación de negociación MII Ethernet IEEE 802.3ab.',
                      samples: [effectiveThroughput, effectiveThroughput, effectiveThroughput],
                      interpretation:
                        linkSpeedMode === '100M'
                          ? 'El enlace físico en 100 Mbps limita el throughput a ~94.2 Mbps netos debido al overhead de cabeceras Ethernet/IP.'
                          : 'Al disponer de los 4 pares íntegros, el canal negocia 1000BASE-T permitiendo alcanzar la totalidad del plan de 600 Mbps.',
                      verdict: linkSpeedMode !== '100M' ? 'MEJORA' : 'SIN CAMBIO',
                      conclusion:
                        linkSpeedMode !== '100M'
                          ? 'Vínculo Gigabit restaurado con 4 pares en cable de red.'
                          : 'Vínculo limitado por degradación de cableado.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR EVIDENCIA EN EXPEDIENTE →
                </button>
              </div>
            </div>
          );
        }

        // LAB 05B // LATENCY PATH ANALYZER
        if (activeSubLab.id === '05b-latency') {
          const hop1 = wifiHopActive ? 18.4 : 0.8;
          const hop2 = 12.1;
          const hop3 = selectedTarget === 'gateway' ? 0 : selectedTarget === 'isp' ? 0 : 34.5;
          const totalRtt = (hop1 + hop2 + hop3).toFixed(1);
          const jitter = wifiHopActive ? 8.2 : 0.4;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    DESTINO DEL TRAZADO (TRACEROUTE)
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTarget('gateway')}
                      className={`p-2 rounded font-mono-tech text-[11px] font-bold ${
                        selectedTarget === 'gateway' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      Gateway (192.168.1.1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTarget('isp')}
                      className={`p-2 rounded font-mono-tech text-[11px] font-bold ${
                        selectedTarget === 'isp' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      Central ISP (OLT)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTarget('google')}
                      className={`p-2 rounded font-mono-tech text-[11px] font-bold ${
                        selectedTarget === 'google' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      Cloudflare (1.1.1.1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTarget('game_server')}
                      className={`p-2 rounded font-mono-tech text-[11px] font-bold ${
                        selectedTarget === 'game_server' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      Game Server (DirectX)
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    MEDIO FÍSICO SALTO 1
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWifiHopActive(false)}
                      className={`flex-1 py-2 rounded font-mono-tech text-xs font-bold ${
                        !wifiHopActive ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      Ethernet Cable (&lt;1 ms)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWifiHopActive(true)}
                      className={`flex-1 py-2 rounded font-mono-tech text-xs font-bold ${
                        wifiHopActive ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      Wi-Fi 2.4G (~18 ms + Jitter)
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {wifiHopActive ? 'El salto 1 añade retardo y fluctuación antes de salir de la casa.' : 'Salto 1 determinista y despreciable (<1ms).'}
                  </p>
                </div>
              </div>

              {/* Hop Breakdown Table */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 font-mono-tech space-y-2">
                <div className="text-[10px] text-zinc-400 uppercase flex items-center justify-between">
                  <span>DESGLOSE SALTO A SALTO // LATENCIA ACUMULADA</span>
                  <span>RTT TOTAL: <strong className="text-amber-400 text-sm">{totalRtt} ms</strong> (Jitter: {jitter} ms)</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-zinc-950 flex items-center justify-between">
                    <span>Hop 1: PC → Router (LAN)</span>
                    <span className={wifiHopActive ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      {hop1} ms {wifiHopActive ? '(⚠️ Wi-Fi)' : '(Ethernet)'}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 flex items-center justify-between">
                    <span>Hop 2: Router → ISP OLT (Acceso Fibra)</span>
                    <span className="text-zinc-300">+{hop2} ms</span>
                  </div>
                  {selectedTarget !== 'gateway' && selectedTarget !== 'isp' && (
                    <div className="p-2 rounded bg-zinc-950 flex items-center justify-between">
                      <span>Hop 3: ISP → Tránsito Tier 1 → Servidor</span>
                      <span className="text-zinc-300">+{hop3} ms</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ORIGEN DE DEGRADACIÓN: {wifiHopActive ? 'LAN INALÁMBRICA (Salto 1)' : 'PROPAGACIÓN GEOGRÁFICA (Salto 3)'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Medio de Salto 1 (${wifiHopActive ? 'Wi-Fi' : 'Cable Ethernet'})`,
                      baselineValue: 64.9,
                      experimentValue: Number(totalRtt),
                      deltaValue: (Number(totalRtt) - 64.9).toFixed(1),
                      metricKey: 'rtt_avg',
                      metricUnit: 'ms',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Muestreo ICMP Hop-by-Hop RFC 792.',
                      samples: [Number(totalRtt), Number(totalRtt) + 0.3, Number(totalRtt) - 0.2],
                      interpretation: wifiHopActive
                        ? 'El enlace inalámbrico en el salto 1 aporta el 30% del retardo total y el 95% del jitter observado.'
                        : 'El uso de cable directo elimina la fluctuación en el Salto 1, aislando el retardo puramente a la distancia geográfica.',
                      verdict: !wifiHopActive ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Aislamiento pericial de la fuente de latencia completado con éxito.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  GUARDAR MEDICIÓN DE RTT →
                </button>
              </div>
            </div>
          );
        }

        // LAB 05C // BANDWIDTH VS LATENCY
        if (activeSubLab.id === '05c-bandwidth-latency') {
          const basePing = 18.0;
          const loadedPing = sqmEnabled
            ? (basePing + (uploadLoadPercent * 0.05)).toFixed(1)
            : (basePing + (Math.pow(uploadLoadPercent / 10, 2.3))).toFixed(1);
          const queueBuffer = sqmEnabled ? 4 : Math.round(uploadLoadPercent * 3.8);

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    <span>CARGA DE SUBIDA CONCURRENTE</span>
                    <span className="text-amber-400 text-xs">{uploadLoadPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={uploadLoadPercent}
                    onChange={(e) => setUploadLoadPercent(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[11px] text-zinc-400 font-sans-editorial">
                    Simula la subida de un stream de video o backup en la nube saturando la cola de salida.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    ALGORITMO DE GESTIÓN DE COLAS (AQM)
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSqmEnabled(false)}
                      className={`flex-1 py-2 rounded font-mono-tech text-xs font-bold ${
                        !sqmEnabled ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      FIFO Estándar (Bufferbloat)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSqmEnabled(true)}
                      className={`flex-1 py-2 rounded font-mono-tech text-xs font-bold ${
                        sqmEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      SQM (CAKE / FQ-CoDel)
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans-editorial">
                    {sqmEnabled
                      ? 'SQM aísla flujos y descarta paquetes antes de que llenen la memoria intermedia.'
                      : 'Cola FIFO almacena paquetes en buffers masivos generando retardo extremo.'}
                  </p>
                </div>
              </div>

              {/* Metrology Comparison Result */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-center">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">PING EN REPOSO</div>
                  <div className="text-xl font-bold text-white mt-0.5">{basePing} ms</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">PING BAJO CARGA</div>
                  <div className={`text-xl font-bold mt-0.5 ${Number(loadedPing) > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {loadedPing} ms
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">RETARDO DE ENCOLAMIENTO</div>
                  <div className="text-xl font-bold text-amber-400 mt-0.5">{queueBuffer} ms</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  CONCLUSIÓN: {sqmEnabled ? 'BUFFERBLOAT ELIMINADO CON SQM' : 'BUFFERBLOAT SEVERO PRESENTE (+ ' + (Number(loadedPing) - basePing).toFixed(0) + ' ms)'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Control de Colas AQM (${sqmEnabled ? 'SQM Activado' : 'FIFO Tradicional'})`,
                      baselineValue: 310.0,
                      experimentValue: Number(loadedPing),
                      deltaValue: (Number(loadedPing) - 310.0).toFixed(1),
                      metricKey: 'loaded_latency',
                      metricUnit: 'ms',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Simulación de algoritmos RFC 8290 CoDel.',
                      samples: [Number(loadedPing), Number(loadedPing) + 1.2, Number(loadedPing) - 0.8],
                      interpretation: sqmEnabled
                        ? 'La gestión de colas SQM mantiene el tiempo de respuesta interactivo en 22 ms a pesar del 90% de saturación de subida.'
                        : 'El buffer FIFO retiene paquetes en memoria generando 300+ ms de bufferbloat.',
                      verdict: sqmEnabled ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Demostración completada: ancho de banda no garantiza baja latencia sin gestión de colas.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  GUARDAR COMPARACIÓN A/B →
                </button>
              </div>
            </div>
          );
        }

        // LAB 05D // DNS LAB
        if (activeSubLab.id === '05d-dns') {
          const lookupTimes: Record<string, number> = {
            isp_broken: 9999, // Timeout
            isp_slow: 142.5,
            cloudflare: 8.2,
            google: 14.1,
          };
          const rawTime = lookupTimes[selectedDnsProvider];
          const finalTime = dnsCacheWarm ? 0.3 : rawTime;
          const isBroken = selectedDnsProvider === 'isp_broken';

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    RESOLVER DNS PRIMARIO
                  </div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedDnsProvider('isp_broken')}
                      className={`w-full p-2 rounded text-left font-mono-tech text-xs font-bold ${
                        selectedDnsProvider === 'isp_broken'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/60'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      DNS ISP Caído (Timeout // 0.0.0.0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDnsProvider('isp_slow')}
                      className={`w-full p-2 rounded text-left font-mono-tech text-xs font-bold ${
                        selectedDnsProvider === 'isp_slow'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      DNS ISP Lento (142 ms)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDnsProvider('cloudflare')}
                      className={`w-full p-2 rounded text-left font-mono-tech text-xs font-bold ${
                        selectedDnsProvider === 'cloudflare'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Cloudflare (1.1.1.1 // ~8 ms)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDnsProvider('google')}
                      className={`w-full p-2 rounded text-left font-mono-tech text-xs font-bold ${
                        selectedDnsProvider === 'google'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Google DNS (8.8.8.8 // ~14 ms)
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-3">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    CACHÉ DNS LOCAL (HOSTS / CLIENT)
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dnsCacheWarm}
                      onChange={(e) => setDnsCacheWarm(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    <span className="font-mono-tech text-zinc-200">Respuesta en Caché RAM Local (0.3 ms)</span>
                  </label>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans-editorial">
                    Cuando una dirección ya fue resuelta previamente y su TTL está vigente, el sistema operativo no consulta la red.
                  </p>
                  <div className="p-3 rounded-lg bg-zinc-950 font-mono-tech text-xs space-y-1">
                    <div className="text-zinc-500 text-[10px]">ESTADO DE CONECTIVIDAD:</div>
                    <div className="text-emerald-400">PING 8.8.8.8 → OK (12 ms)</div>
                    <div className={isBroken && !dnsCacheWarm ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      RESOLVER GOOGLE.COM → {isBroken && !dnsCacheWarm ? 'FALLA (ERR_NAME_NOT_RESOLVED)' : 'OK'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  TIEMPO DE RESOLUCIÓN: {isBroken && !dnsCacheWarm ? 'TIMEOUT (FALLO TOTAL)' : `${finalTime} ms`}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Servidor DNS (${selectedDnsProvider})`,
                      baselineValue: 142.5,
                      experimentValue: isBroken && !dnsCacheWarm ? 9999 : finalTime,
                      deltaValue: (finalTime - 142.5).toFixed(1),
                      metricKey: 'dns_lookup_time',
                      metricUnit: 'ms',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Muestreo de sockets UDP puerto 53 RFC 1035.',
                      samples: [finalTime, finalTime, finalTime],
                      interpretation:
                        isBroken && !dnsCacheWarm
                          ? 'El fallo del DNS impide abrir páginas a pesar de que la conexión a Internet por IP está 100% activa.'
                          : 'El cambio a resolvers públicos Anycast (1.1.1.1) redujo la demora de lookup a menos de 10 ms.',
                      verdict: !isBroken ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Diagnóstico DNS pericial completado.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR PRUEBA DNS →
                </button>
              </div>
            </div>
          );
        }

        // LAB 05E // WIFI SPECTRUM
        if (activeSubLab.id === '05e-wifi-spectrum') {
          const wallLoss = wallObstacle === 'none' ? 0 : wallObstacle === 'drywall' ? 4 : 18;
          const baseRssi = wifiBand === '2.4G' ? -52 : wifiBand === '5G' ? -64 : -72;
          const finalRssi = baseRssi - wallLoss;
          const isBadChannel = wifiBand === '2.4G' && (wifiChannel !== 1 && wifiChannel !== 6 && wifiChannel !== 11);
          const retryRate = isBadChannel ? 28.5 : wallObstacle === 'concrete' ? 14.2 : 2.1;

          return (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">BANDA DE FRECUENCIA</div>
                  <div className="space-y-1 font-mono-tech">
                    <button
                      type="button"
                      onClick={() => setWifiBand('2.4G')}
                      className={`w-full py-1.5 px-2 rounded text-xs font-bold text-left ${
                        wifiBand === '2.4G' ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      2.4 GHz (Mayor alcance)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWifiBand('5G')}
                      className={`w-full py-1.5 px-2 rounded text-xs font-bold text-left ${
                        wifiBand === '5G' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      5 GHz (Mayor ancho)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWifiBand('6G')}
                      className={`w-full py-1.5 px-2 rounded text-xs font-bold text-left ${
                        wifiBand === '6G' ? 'bg-purple-500 text-white' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      6 GHz (Wi-Fi 6E/7)
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">
                    CANAL ({wifiBand === '2.4G' ? '2.4 GHz' : '5 GHz'})
                  </div>
                  {wifiBand === '2.4G' ? (
                    <div className="grid grid-cols-4 gap-1 font-mono-tech text-xs">
                      {[1, 4, 6, 8, 11].map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setWifiChannel(ch)}
                          className={`p-1.5 rounded font-bold ${
                            wifiChannel === ch
                              ? ch === 1 || ch === 6 || ch === 11
                                ? 'bg-emerald-500 text-black'
                                : 'bg-rose-500 text-white'
                              : 'bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          Ch {ch}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-zinc-400 font-mono-tech text-[11px] pt-1">
                      Canales UNII-1/UNII-3 (36, 40, 44, 48, 149) no se solapan.
                    </div>
                  )}
                  {isBadChannel && (
                    <div className="text-rose-400 text-[10px] font-mono-tech">
                      ⚠️ Canal {wifiChannel} sufre solapamiento destructivo con Canales 6 y 11.
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-mono-tech text-cyan-400 font-bold uppercase">MUROS / OBSTÁCULOS</div>
                  <div className="space-y-1 font-mono-tech text-xs">
                    <button
                      type="button"
                      onClick={() => setWallObstacle('none')}
                      className={`w-full p-1.5 rounded text-left ${
                        wallObstacle === 'none' ? 'bg-emerald-500 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Línea de Vista Directa (0 dB)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWallObstacle('drywall')}
                      className={`w-full p-1.5 rounded text-left ${
                        wallObstacle === 'drywall' ? 'bg-amber-400 text-black font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Pared de Yeso (-4 dB)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWallObstacle('concrete')}
                      className={`w-full p-1.5 rounded text-left ${
                        wallObstacle === 'concrete' ? 'bg-rose-500 text-white font-bold' : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      Hormigón Armado (-18 dB)
                    </button>
                  </div>
                </div>
              </div>

              {/* Spectrum Telemetry Box */}
              <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 grid grid-cols-2 gap-4 font-mono-tech text-center">
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">POTENCIA DE SEÑAL (RSSI)</div>
                  <div className={`text-xl font-bold mt-0.5 ${finalRssi < -75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {finalRssi} dBm
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">RETRANSMISIÓN DE TRAMAS</div>
                  <div className={`text-xl font-bold mt-0.5 ${retryRate > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {retryRate}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  ESTADO RF: {isBadChannel ? 'INTERFERENCIA COCANAL SEVERA' : 'ESPECTRO LIMPIO'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Canal Wi-Fi (Canal ${wifiChannel} en ${wifiBand})`,
                      baselineValue: 28.5,
                      experimentValue: retryRate,
                      deltaValue: (retryRate - 28.5).toFixed(1),
                      metricKey: 'retry_rate',
                      metricUnit: '%',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Modelo de propagación en interiores ITU-R P.1238.',
                      samples: [retryRate, retryRate + 0.5, retryRate - 0.3],
                      interpretation: isBadChannel
                        ? 'El uso de un canal solapado eleva las retransmisiones al 28% por colisiones en el medio compartido.'
                        : 'El uso de canales no solapados (1/6/11) reduce las colisiones al mínimo operativo (~2%).',
                      verdict: !isBadChannel ? 'MEJORA' : 'EMPEORA',
                      conclusion: 'Planificación espectral verificada empíricamente.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR MÉTRICAS RF →
                </button>
              </div>
            </div>
          );
        }

        // LAB 05F // PACKET INSPECTOR
        if (activeSubLab.id === '05f-packet-inspector') {
          return (
            <div className="space-y-5 text-xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono-tech text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedPacketType('tcp_syn')}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    selectedPacketType === 'tcp_syn' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  TCP [SYN] (Handshake Inicial)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPacketType('tcp_rst')}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    selectedPacketType === 'tcp_rst' ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  TCP [RST] (Rechazo / Reset)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPacketType('dns_query')}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    selectedPacketType === 'dns_query' ? 'bg-purple-500 text-white' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  DNS Query (UDP 53)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPacketType('icmp_echo')}
                  className={`px-3 py-1.5 rounded-lg font-bold ${
                    selectedPacketType === 'icmp_echo' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-400'
                  }`}
                >
                  ICMP Echo Request (Ping)
                </button>
              </div>

              {/* Packet Hex/Dissector View */}
              <div className="p-4 rounded-xl bg-black/90 border border-zinc-800 font-mono-tech space-y-3">
                <div className="text-[10px] text-zinc-400 uppercase">ANATOMÍA DEL PAQUETE (CAPAS L2 - L7)</div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-zinc-950 border-l-2 border-emerald-400 flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-400">Capa 2 // Ethernet II:</strong> Src: 00:1A:2B:3C:4D:5E → Dst:
                      F0:9F:C2:11:22:33 (Type: 0x0800 IPv4)
                    </div>
                    <span className="text-zinc-500 text-[10px]">14 Bytes</span>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border-l-2 border-cyan-400 flex items-center justify-between">
                    <div>
                      <strong className="text-cyan-400">Capa 3 // IPv4:</strong> Src: 192.168.1.100 → Dst: 104.26.14.72
                      (TTL: 64, Protocol: {selectedPacketType.startsWith('tcp') ? '6 (TCP)' : '17 (UDP)'})
                    </div>
                    <span className="text-zinc-500 text-[10px]">20 Bytes</span>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border-l-2 border-amber-400 flex items-center justify-between">
                    <div>
                      <strong className="text-amber-400">Capa 4 // Transporte:</strong> Sport: 54321 → Dport:{' '}
                      {selectedPacketType === 'dns_query' ? '53' : '443'} (Flags:{' '}
                      {selectedPacketType === 'tcp_syn'
                        ? 'SYN=1, ACK=0'
                        : selectedPacketType === 'tcp_rst'
                        ? 'RST=1, ACK=0'
                        : 'UDP Datagram'}
                      )
                    </div>
                    <span className="text-zinc-500 text-[10px]">20 Bytes</span>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border-l-2 border-purple-400 flex items-center justify-between">
                    <div>
                      <strong className="text-purple-400">Capa 7 // Payload:</strong>{' '}
                      {selectedPacketType === 'dns_query'
                        ? 'Standard Query A evo-labs.local'
                        : '0 Bytes (Handshake Control Frame)'}
                    </div>
                    <span className="text-zinc-500 text-[10px]">0-512 Bytes</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono-tech text-zinc-400">
                  FLAG DE CONTROL: {selectedPacketType === 'tcp_rst' ? 'CONEXIÓN RECHAZADA POR FIREWALL' : 'TRAMA ESTÁNDAR'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onRecordMeasurement({
                      controlledVariable: `Inspección de Paquete (${selectedPacketType})`,
                      baselineValue: 54,
                      experimentValue: 54,
                      deltaValue: 0,
                      metricKey: 'header_overhead',
                      metricUnit: 'bytes',
                      dataOrigin: 'SIMULATED',
                      originDetail: 'Inspección de tramas RFC 791 / RFC 793.',
                      samples: [54, 54, 54],
                      interpretation: 'Desglose pericial de cabeceras completado sin anomalías de formato.',
                      verdict: 'SIN CAMBIO',
                      conclusion: 'Estructura de paquetes conforme a estándares RFC.',
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  REGISTRAR DECODIFICACIÓN →
                </button>
              </div>
            </div>
          );
        }

        return null;
      }}
    />
  );
};
