import React, { useState } from 'react';
import {
  Monitor,
  Shield,
  Network,
  Terminal,
  Activity,
  Server,
  Lock,
  Globe,
  ArrowRight,
  Cpu,
  Key,
  Layers,
  Zap,
} from 'lucide-react';

export const Sector25VisualDiagrams: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<
    'RDP_PROTOCOL_ARCHITECTURE' | 'NLA_AUTHENTICATION_FLOW' | 'LAN_VS_VPN_TUNNEL_RDP'
  >('RDP_PROTOCOL_ARCHITECTURE');

  return (
    <div className="space-y-8 my-8 text-slate-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <Monitor className="w-4 h-4" />
              <span>Diagramas Didácticos Canónicos // Sector 25</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              ARQUITECTURA DE ESCRITORIO REMOTO Y PROTOCOLO RDP
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Canales Virtuales RDP, Flujo de Autenticación NLA CredSSP y Túneles VPN de Protección
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveDiagram('RDP_PROTOCOL_ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeDiagram === 'RDP_PROTOCOL_ARCHITECTURE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              1. Arquitectura RDP
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('NLA_AUTHENTICATION_FLOW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeDiagram === 'NLA_AUTHENTICATION_FLOW'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              2. Flujo NLA CredSSP
            </button>
            <button
              type="button"
              onClick={() => setActiveDiagram('LAN_VS_VPN_TUNNEL_RDP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeDiagram === 'LAN_VS_VPN_TUNNEL_RDP'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
              }`}
            >
              3. VPN vs RDP Expuesto
            </button>
          </div>
        </div>

        <div className="pt-6">
          {activeDiagram === 'RDP_PROTOCOL_ARCHITECTURE' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">CLIENTE RDP</span>
                    <Monitor className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">mstsc.exe</h4>
                  <p className="text-xs text-slate-400 mt-2">
                    Genera eventos de teclado/mouse y renderiza primitivas gráficas GDI/DirectX recibidas del host.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                    <div>• Entradas: Teclado, Mouse, Audio</div>
                    <div>• Pantalla: Renderizador local</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-cyan-400 font-bold">CANAL DE RED</span>
                      <Network className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-200">Puerto 3389 (TCP/UDP)</h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Canales virtuales multiplexados (GDI Graphics, Audio, Clipboard, Printers, SmartCards).
                    </p>
                  </div>
                  <div className="mt-4 p-2 bg-slate-900 rounded border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
                    TCP: Control e Instrucciones
                    <br />
                    UDP: Aceleración de Video
                  </div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold">HOST SERVIDOR RDP</span>
                    <Server className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">TermService (svchost)</h4>
                  <p className="text-xs text-slate-400 mt-2">
                    Mantiene la sesión de usuario virtual aislada en modo sesión de terminal (`rdp-tcp#X`).
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                    <div>• RDPDR.sys (Redirección)</div>
                    <div>• Session 1+ (Procesos gráficos)</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-cyan-400">Nota Pericial EVO:</span> RDP utiliza compresión RDP6/8/10 y renderizado vectorial de comandos de dibujo, lo que permite fluidez gráfica con consumos de ancho de banda extremadamente bajos.
              </div>
            </div>
          )}

          {activeDiagram === 'NLA_AUTHENTICATION_FLOW' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-950/20 p-5 rounded-xl border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">CON NLA ACTIVO (CredSSP)</span>
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900/90 rounded border border-emerald-500/20 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">1</span>
                      <span>Cliente envía Handshake CredSSP + TLS antes del escritorio.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded border border-emerald-500/20 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">2</span>
                      <span>Servidor valida credenciales Kerberos/NTLMv2.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded border border-emerald-500/20 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">3</span>
                      <span>Si son correctas, se crea la sesión gráfica en memoria.</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-300 font-mono pt-2">
                    ✓ Cero consumo de RAM/CPU por usuarios no autenticados.
                  </p>
                </div>

                <div className="bg-rose-950/20 p-5 rounded-xl border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-bold">SIN NLA (VULNERABLE A DoS)</span>
                    <Zap className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900/90 rounded border border-rose-500/20 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">1</span>
                      <span>Cualquier IP se conecta al socket 3389.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded border border-rose-500/20 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">2</span>
                      <span>El host instancia en memoria la pantalla Winlogon completa.</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/90 rounded border border-rose-500/20 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">3</span>
                      <span>Un escáner puede agotar la CPU instanciando cientos de logins.</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-300 font-mono pt-2">
                    ⚠ Riesgo severo de Denegación de Servicio y exposición de memoria.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDiagram === 'LAN_VS_VPN_TUNNEL_RDP' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/80 p-5 rounded-xl border border-rose-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-bold">INSEGURO: RDP 3389 EXPUESTO A INTERNET</span>
                    <Globe className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-rose-500/30 text-xs font-mono text-slate-300 space-y-2">
                    <div className="text-rose-300 font-bold">[INTERNET PÚBLICA]</div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>Botnets / Scanners</span>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-rose-400 font-bold">IP:3389</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 font-sans">
                      Ataques continuos de fuerza bruta, exploits BlueKeep y riesgo directo de Ransomware.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold">BLINDADO: TÚNEL VPN + RDP INTERNO</span>
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-cyan-500/30 text-xs font-mono text-slate-300 space-y-2">
                    <div className="text-cyan-300 font-bold">[TÚNEL CIFRADO WEBRTC / WIREGUARD]</div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>Cliente Remoto</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-emerald-400 font-bold">10.0.0.X:3389 (Privado)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 font-sans">
                      El puerto 3389 permanece invisibilizado y cerrado en la interfaz WAN pública.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
