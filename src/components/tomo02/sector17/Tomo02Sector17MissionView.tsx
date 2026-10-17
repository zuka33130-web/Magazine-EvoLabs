import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Globe,
  Wifi,
  Activity,
  Layers,
  Radio,
  Share2,
} from 'lucide-react';

interface Tomo02Sector17MissionViewProps {
  onBackToReader: () => void;
}

export const Tomo02Sector17MissionView: React.FC<Tomo02Sector17MissionViewProps> = ({
  onBackToReader,
}) => {
  const [activeModule, setActiveModule] = useState<
    'NET_TRIAGE_L3' | 'WIFI_REPORT' | 'NCSI_PROBE_TEST' | 'DNS_FLUSH_QUERY' | 'TCP_SOCKET_AUDIT' | 'NETWORK_STACK_RESET'
  >('NET_TRIAGE_L3');

  const [consoleOutput, setConsoleOutput] = useState<{
    query: string;
    targetComponent: string;
    data: string;
    timestamp: string;
  }>({
    query: 'ipconfig /all && ping 192.168.1.1 -n 4 && ping 1.1.1.1 -n 4',
    targetComponent: 'IP Routing & Physical Link Triage',
    data: `Configuración IP de Windows

Adaptador de Ethernet Ethernet 1:
   Sufijo DNS específico para la conexión. . : lan
   Descripción . . . . . . . . . . . . . . . : Intel(R) Ethernet Controller I225-V
   Dirección física. . . . . . . . . . . . . : 70-85-C2-A1-42-89
   DHCP habilitado . . . . . . . . . . . . . : Sí
   Dirección IPv4. . . . . . . . . . . . . . : 192.168.1.142 (Preferido)
   Máscara de subred . . . . . . . . . . . . : 255.255.255.0
   Concesión obtenida. . . . . . . . . . . . : martes, 14 de octubre de 2026 08:00:15
   Puerta de enlace predeterminada . . . . . : 192.168.1.1
   Servidor DHCP . . . . . . . . . . . . . . : 192.168.1.1
   Servidores DNS. . . . . . . . . . . . . . : 1.1.1.1, 8.8.8.8

Haciendo ping a 192.168.1.1 (Gateway Local) con 32 bytes de datos:
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos).

Haciendo ping a 1.1.1.1 (WAN Anycast Cloudflare) con 32 bytes de datos:
Respuesta desde 1.1.1.1: bytes=32 tiempo=12ms TTL=58
Respuesta desde 1.1.1.1: bytes=32 tiempo=11ms TTL=58
Respuesta desde 1.1.1.1: bytes=32 tiempo=12ms TTL=58
Respuesta desde 1.1.1.1: bytes=32 tiempo=11ms TTL=58
Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos).
[+] DICTAMEN CAPA 1-3: Enlace local y salida WAN 100% operativos.`,
    timestamp: new Date().toLocaleTimeString(),
  });

  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectModule = (
    mod: 'NET_TRIAGE_L3' | 'WIFI_REPORT' | 'NCSI_PROBE_TEST' | 'DNS_FLUSH_QUERY' | 'TCP_SOCKET_AUDIT' | 'NETWORK_STACK_RESET'
  ) => {
    setActiveModule(mod);
    let cmd = '';
    let target = '';
    let resData = '';

    if (mod === 'NET_TRIAGE_L3') {
      cmd = 'ipconfig /all && ping 192.168.1.1 -n 4 && ping 1.1.1.1 -n 4';
      target = 'IP Routing & Physical Link Triage';
      resData = `Configuración IP de Windows

Adaptador de Ethernet Ethernet 1:
   Sufijo DNS específico para la conexión. . : lan
   Descripción . . . . . . . . . . . . . . . : Intel(R) Ethernet Controller I225-V
   Dirección física. . . . . . . . . . . . . : 70-85-C2-A1-42-89
   DHCP habilitado . . . . . . . . . . . . . : Sí
   Dirección IPv4. . . . . . . . . . . . . . : 192.168.1.142 (Preferido)
   Máscara de subred . . . . . . . . . . . . : 255.255.255.0
   Concesión obtenida. . . . . . . . . . . . : martes, 14 de octubre de 2026 08:00:15
   Puerta de enlace predeterminada . . . . . : 192.168.1.1
   Servidor DHCP . . . . . . . . . . . . . . : 192.168.1.1
   Servidores DNS. . . . . . . . . . . . . . : 1.1.1.1, 8.8.8.8

Haciendo ping a 192.168.1.1 (Gateway Local) con 32 bytes de datos:
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Respuesta desde 192.168.1.1: bytes=32 tiempo<1ms TTL=64
Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos).

Haciendo ping a 1.1.1.1 (WAN Anycast Cloudflare) con 32 bytes de datos:
Respuesta desde 1.1.1.1: bytes=32 tiempo=12ms TTL=58
Respuesta desde 1.1.1.1: bytes=32 tiempo=11ms TTL=58
Respuesta desde 1.1.1.1: bytes=32 tiempo=12ms TTL=58
Respuesta desde 1.1.1.1: bytes=32 tiempo=11ms TTL=58
Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos).
[+] DICTAMEN CAPA 1-3: Enlace local y salida WAN 100% operativos.`;
    } else if (mod === 'WIFI_REPORT') {
      cmd = 'netsh wlan show wlanreport && netsh wlan show interfaces';
      target = 'WLAN Diagnostics Engine & wlanreport';
      resData = `El informe de red inalámbrica se guardó en:
C:\\ProgramData\\Microsoft\\Windows\\WlanReport\\wlan-report-latest.html

Detalles de interfaz Wi-Fi activa:
    Nombre                 : Wi-Fi
    Descripción            : Intel(R) Wi-Fi 6E AX211 160MHz
    GUID                   : {9f18a24c-11e2-4820-9171-88f62c019a11}
    Estado                 : Conectado
    SSID                   : EVO-LABS-5G
    BSSID                  : a4:bb:6d:42:19:f0
    Tipo de radio          : 802.11ax
    Autenticación          : WPA3-Personal
    Cifrado                : CCMP
    Canal                  : 36 (5 GHz, 160 MHz de ancho de banda)
    Velocidad de recepción : 2402 Mbps
    Velocidad de transmisión: 2402 Mbps
    Señal                  : 94% (-52 dBm)

[+] Métricas de radiofrecuencia: SNR excelente (> 40 dB). Cero interferencias en canal 36.`;
    } else if (mod === 'NCSI_PROBE_TEST') {
      cmd = 'Test-NetConnection -ComputerName www.msftconnecttest.com -Port 80';
      target = 'Network Location Awareness (NCSI)';
      resData = `ComputerName     : www.msftconnecttest.com
RemoteAddress    : 13.107.4.52
RemotePort       : 80
InterfaceAlias   : Ethernet 1
SourceAddress    : 192.168.1.142
TcpTestSucceeded : True

Auditoría de Registro NCSI:
HKLM\\SYSTEM\\CurrentControlSet\\Services\\NlaSvc\\Parameters\\Internet:
  EnableActiveProbing    = 1 (Habilitado)
  ActiveWebProbeHost     = www.msftconnecttest.com
  ActiveWebProbePath     = connecttest.txt
  ActiveWebProbeContent  = Microsoft Connect Test
  ActiveDnsProbeHost     = dns.msftncsi.com
  ActiveDnsProbeContent  = 131.107.255.255

Estado del Icono de Red: CONECTADO A INTERNET (Mundito inactivo).`;
    } else if (mod === 'DNS_FLUSH_QUERY') {
      cmd = 'ipconfig /flushdns && Resolve-DnsName google.com -Server 1.1.1.1';
      target = 'DNS Client Service (Dnscache)';
      resData = `Configuración IP de Windows

Se vació correctamente la caché de resolución de DNS.

Consultando servidor DNS 1.1.1.1 (Cloudflare Anycast):

Name                           Type   TTL   Section    IPAddress
----                           ----   ---   -------    ---------
google.com                     A      240   Answer     142.250.79.46
google.com                     A      240   Answer     142.250.79.14
google.com                     AAAA   240   Answer     2800:3f0:4002:807::200e

Latencia de respuesta DNS: 14 ms. Registros A y AAAA perfectamente autoritativos.`;
    } else if (mod === 'TCP_SOCKET_AUDIT') {
      cmd = 'Get-NetTCPConnection -State Established | Select-Object -First 5 LocalAddress, LocalPort, RemoteAddress, RemotePort';
      target = 'Kernel TCP Connection State Machine';
      resData = `LocalAddress    LocalPort RemoteAddress   RemotePort
------------    --------- -------------   ----------
192.168.1.142       54102 142.250.79.46          443 (HTTPS Google)
192.168.1.142       54108 104.16.132.229         443 (HTTPS Cloudflare)
192.168.1.142       54112 52.113.194.132         443 (HTTPS Teams MSFT)
192.168.1.142       54116 162.159.135.232        443 (HTTPS Discord)
192.168.1.142       54120 185.199.108.133        443 (HTTPS GitHub)

Todos los sockets en estado ESTABLISHED con control de flujo TCP Window Scaling activo.`;
    } else {
      cmd = 'netsh winsock reset && netsh int ip reset';
      target = 'TCP/IP Nuclear Reset Protocol';
      resData = `El catálogo de Winsock se restableció correctamente.
Debe reiniciar el equipo para completar el restablecimiento.

Restableciendo Protocolo de Internet (TCP/IP):
Restableciendo interfaz global... Correcto.
Restableciendo interfaz unicast... Correcto.
Restableciendo interfaz multidifusión... Correcto.
Restableciendo subredes... Correcto.
Reinicio completado correctamente.

Reinicie la computadora para completar esta acción.
Todos los filtros LSP, claves Winsock dañadas y proxies huérfanos han sido purgados.`;
    }

    setConsoleOutput({
      query: cmd,
      targetComponent: target,
      data: resData,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(consoleOutput.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-200 py-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBackToReader}
            className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Temario Principal</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50 font-mono text-[10px] font-bold">
              LABORATORIO PERICIAL 17
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              WI-FI DIAGNOSTIC TREE &amp; NETWORK TRIAGE CONSOLE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Simulador de triage de red en tiempo real con diagnóstico bottom-up, wlanreport, NCSI y resolución TCP/IP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Picker */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 block font-bold">
            Herramientas Canónicas de Triage
          </span>

          <button
            onClick={() => handleSelectModule('NET_TRIAGE_L3')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'NET_TRIAGE_L3'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">TRIAGE // L1-L3 BOTTOM-UP</span>
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Aislamiento de Gateway &amp; WAN</span>
            <span className="text-[11px] text-slate-400">Verificación de IP, máscara y ping al router local</span>
          </button>

          <button
            onClick={() => handleSelectModule('WIFI_REPORT')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'WIFI_REPORT'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">NETSH // WLANREPORT</span>
              <Wifi className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Telemetría Forense de Radio</span>
            <span className="text-[11px] text-slate-400">Informe HTML de eventos Wi-Fi y caídas de señal</span>
          </button>

          <button
            onClick={() => handleSelectModule('NCSI_PROBE_TEST')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'NCSI_PROBE_TEST'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">NCSI // PROBE AUDIT</span>
              <Globe className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Sonda Activa de Conectividad</span>
            <span className="text-[11px] text-slate-400">Diagnóstico del icono del globo terráqueo y NLA</span>
          </button>

          <button
            onClick={() => handleSelectModule('DNS_FLUSH_QUERY')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'DNS_FLUSH_QUERY'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">DNS // FLUSH &amp; QUERY</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Purga de Caché &amp; Bypass 1.1.1.1</span>
            <span className="text-[11px] text-slate-400">Resolución autoritativa de registros A y AAAA</span>
          </button>

          <button
            onClick={() => handleSelectModule('TCP_SOCKET_AUDIT')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'TCP_SOCKET_AUDIT'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">NETSTAT // TCP SOCKETS</span>
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Auditoría de Sockets Activos</span>
            <span className="text-[11px] text-slate-400">Inspección de puertos 443 en estado Established</span>
          </button>

          <button
            onClick={() => handleSelectModule('NETWORK_STACK_RESET')}
            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col gap-1 ${
              activeModule === 'NETWORK_STACK_RESET'
                ? 'bg-cyan-600/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-cyan-400">NETSH // NUCLEAR RESET</span>
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Restablecimiento Total Winsock</span>
            <span className="text-[11px] text-slate-400">Eliminación de filtros LSP corruptos y proxies huérfanos</span>
          </button>
        </div>

        {/* Live Simulator Console */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Top Bar */}
            <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 ml-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Consola de Redes // {consoleOutput.targetComponent}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCmd}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar Comando</span>
                </button>
              </div>
            </div>

            {/* Terminal Command Line */}
            <div className="p-3 bg-slate-900/40 border-b border-slate-800/80 font-mono text-xs flex items-center gap-2 text-cyan-300">
              <span className="text-emerald-400">PS C:\WINDOWS\system32&gt;</span>
              <span className="text-slate-100 font-bold">{consoleOutput.query}</span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[320px] max-h-[460px] whitespace-pre selection:bg-cyan-500 selection:text-slate-900">
              {consoleOutput.data}
            </div>

            {/* Terminal Footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Timestamp: {consoleOutput.timestamp}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Salida de Consola Canónica Verificada
              </span>
            </div>
          </div>

          {/* Operational Safety Warning */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-mono block">REGLA DE METROLOGÍA DE REDES EVOLABS:</strong>
              Nunca asumas un corte de proveedor sin antes verificar: 1) IP distinta a 169.254, 2) Ping al Gateway local &lt; 1 ms, y 3) Resolución DNS contra 1.1.1.1. Esa tríada aísla el 99% de los incidentes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
