import React, { useState } from 'react';
import {
  Wifi,
  Globe,
  Radio,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Layers,
  Zap,
  ArrowRight,
  Shield,
  Server,
  Cable,
} from 'lucide-react';

export const Sector17VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'OSI_VS_TCPIP' | 'DHCP_DORA_FLOW' | 'NCSI_PROBE_ARCHITECTURE' | 'WIFI_FREQUENCY_COMPARISON'
  >('OSI_VS_TCPIP');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Globe className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 17</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE REDES, STACK TCP/IP, SONDAS NCSI Y RADIOFRECUENCIA
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Modelo OSI vs Windows Stack, ciclo de vida DHCP/APIPA, arquitectura de telemetría NCSI y bandas Wi-Fi
            </p>
          </div>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveDiagram('OSI_VS_TCPIP')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'OSI_VS_TCPIP'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              01. Modelo OSI vs Windows Stack
            </button>
            <button
              onClick={() => setActiveDiagram('DHCP_DORA_FLOW')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'DHCP_DORA_FLOW'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              02. Flujo DORA & Trampa APIPA
            </button>
            <button
              onClick={() => setActiveDiagram('NCSI_PROBE_ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'NCSI_PROBE_ARCHITECTURE'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              03. Sonda NCSI (El Mundito)
            </button>
            <button
              onClick={() => setActiveDiagram('WIFI_FREQUENCY_COMPARISON')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeDiagram === 'WIFI_FREQUENCY_COMPARISON'
                  ? 'bg-cyan-600 text-white font-semibold shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              04. Espectro Wi-Fi (2.4 vs 5 vs 6 GHz)
            </button>
          </div>
        </div>

        {/* Diagram 1: OSI vs Windows */}
        {activeDiagram === 'OSI_VS_TCPIP' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400">CAPAS 5-7: APP</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900 text-purple-200">User Mode</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans space-y-1">
                  <div><strong>HTTP, DNS, TLS, SMB</strong></div>
                  <div className="text-slate-400">Navegadores, Discord, OneDrive</div>
                  <div className="text-purple-300">WinINet, WinHTTP, cURL</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400">CAPA 4: TRANSPORTE</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900 text-cyan-200">Kernel Ring 0</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans space-y-1">
                  <div><strong>TCP (Conexión) vs UDP (Datagramas)</strong></div>
                  <div className="text-slate-400">Puertos 1-65535, Handshake SYN/ACK</div>
                  <div className="text-cyan-300">tcpip.sys (TCP Engine)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-400">CAPA 3: RED</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900 text-indigo-200">Routing</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans space-y-1">
                  <div><strong>IPv4 (32-bit) & IPv6 (128-bit)</strong></div>
                  <div className="text-slate-400">ICMP (ping), Next-Hop, Métricas</div>
                  <div className="text-indigo-300">FIB de Enrutamiento del Kernel</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">CAPAS 1-2: FÍSICA</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900 text-amber-200">Hardware</span>
                </div>
                <div className="text-[11px] text-slate-300 font-sans space-y-1">
                  <div><strong>Ethernet 802.3 & Wi-Fi 802.11</strong></div>
                  <div className="text-slate-400">MAC 48-bit, Tablas ARP, RJ-45 PHY</div>
                  <div className="text-amber-300">ndis.sys (Driver Miniport)</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-400 font-mono">Regla de Diagnóstico EVO Labs: </strong>
              El aislamiento de incidentes siempre se hace de abajo hacia arriba (Bottom-Up): 1) Link físico (L1) -&gt; 2) ARP y MAC (L2) -&gt; 3) Ping al Gateway (L3) -&gt; 4) Socket TCP o UDP (L4) -&gt; 5) Resolución DNS y HTTP (L7). Nunca toques el DNS si no tenés ping a tu propio router.
            </div>
          </div>
        )}

        {/* Diagram 2: DHCP DORA & APIPA */}
        {activeDiagram === 'DHCP_DORA_FLOW' && (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold pb-2 border-b border-slate-800">
                  <Server className="w-4 h-4" />
                  <span>EL CICLO DORA NORMAL (UDP 67/68)</span>
                </div>
                <div className="space-y-2 text-slate-300 text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-cyan-400 font-bold block">[1] DISCOVER:</span>
                    Cliente envía broadcast 255.255.255.255: "¿Hay algún router vivo?"
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold block">[2] OFFER:</span>
                    Router responde unicast: "Tengo la IP 192.168.1.100 para vos".
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold block">[3] REQUEST:</span>
                    Cliente confirma: "Acepto formalmente la IP 192.168.1.100".
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-cyan-300 font-bold block">[4] ACKNOWLEDGE:</span>
                    Router entrega máscara, gateway, DNS y tiempo de concesión.
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/40 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold pb-2 border-b border-slate-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>LA CAÍDA EN EL LIMBO APIPA (169.254.X.X)</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded border border-rose-900/40">
                    <span className="text-rose-400 font-bold block">Timeout de DHCP:</span>
                    El cliente envía 4 solicitudes Discover a lo largo de 60 segundos sin recibir respuesta (módem apagado, switch colgado o cable desconectado).
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold block">Autoconfiguración RFC 3927:</span>
                    Windows elige una IP al azar en 169.254.0.0/16 y verifica con un ARP probe que nadie la tenga.
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded border border-rose-900/40">
                    <span className="text-rose-300 font-bold block">Consecuencia Pericial:</span>
                    No hay Default Gateway. El equipo solo puede hablar con otras máquinas con IP 169.254 en el mismo cable físico; Internet queda en 0%.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagram 3: NCSI Probe */}
        {activeDiagram === 'NCSI_PROBE_ARCHITECTURE' && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 font-mono text-xs">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-3">
                ANATOMÍA DE LA SONDA NCSI (NETWORK CONNECTIVITY STATUS INDICATOR)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-cyan-400 font-bold text-xs block">PASO 1: SONDA DNS ACTIVA</span>
                  <p className="text-slate-300 text-[11px] font-sans">
                    El servicio <code>NlaSvc</code> envía una consulta DNS para resolver <code>dns.msftncsi.com</code>.
                  </p>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px]">
                    <span className="text-slate-400">Respuesta esperada fija:</span>
                    <div className="text-emerald-400 font-bold">131.107.255.255</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-cyan-400 font-bold text-xs block">PASO 2: SONDA HTTP GET</span>
                  <p className="text-slate-300 text-[11px] font-sans">
                    Windows ejecuta una petición HTTP GET contra <code>http://www.msftconnecttest.com/connecttest.txt</code>.
                  </p>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px]">
                    <span className="text-slate-400">Contenido esperado (200 OK):</span>
                    <div className="text-emerald-400 font-bold">"Microsoft Connect Test"</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-slate-300 font-sans text-xs">
                <strong className="text-rose-400 font-mono">El Origen del "Globo Terráqueo Sin Internet": </strong>
                Si estás en un hotel o aeropuerto con portal cautivo, la petición HTTP es interceptada y retorna la página de login en vez del archivo de texto. NCSI detecta el desvío y marca la red como "Acceso local sin Internet", disparando la apertura automática del navegador para autenticación.
              </div>
            </div>
          </div>
        )}

        {/* Diagram 4: Wi-Fi Frequencies */}
        {activeDiagram === 'WIFI_FREQUENCY_COMPARISON' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">BANDA 2.4 GHz</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">ALCANCE</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside font-sans">
                <li>Longitud de onda: 12.5 cm (gran poder de penetración).</li>
                <li>Solo 3 canales no superpuestos: 1, 6 y 11 (20 MHz).</li>
                <li>Altísima interferencia con microondas y Bluetooth.</li>
                <li>Velocidad típica: 30 a 90 Mbps reales.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400">BANDA 5 GHz</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">EQUILIBRIO</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside font-sans">
                <li>Longitud de onda: 6 cm (atenuación media en paredes).</li>
                <li>Más de 24 canales; canales anchos de 80 y 160 MHz.</li>
                <li>Incluye canales DFS (monitoreo de radares).</li>
                <li>Velocidad típica: 400 a 900 Mbps reales.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">BANDA 6 GHz (Wi-Fi 6E/7)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">VELOCIDAD PURA</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside font-sans">
                <li>Espectro virgen de 1200 MHz sin dispositivos legacy.</li>
                <li>Hasta 7 canales ultra anchos de 160 MHz o 320 MHz.</li>
                <li>Alcance limitado a la misma habitación o campo visual.</li>
                <li>Velocidad típica: 1.2 a 2.4 Gbps con latencia de 1-2 ms.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
