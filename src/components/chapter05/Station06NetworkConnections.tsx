import React, { useState } from 'react';
import {
  Wifi,
  Terminal,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import { NetworkInvestigation } from '../../types';

const DEFAULT_NETWORK: NetworkInvestigation = {
  evaluated: true,
  processName: 'Discord.exe',
  owningPid: '10424',
  localAddress: '192.168.1.50:52410',
  remoteAddress: '162.159.130.233 (Cloudflare / Discord Voice Gateway)',
  remotePort: '443',
  state: 'ESTABLISHED',
  status: 'IDENTIFICADO',
  contextNotes:
    'Socket HTTPS permanente para presencia en línea y mensajes instantáneos. Tráfico normal.',
};

interface Station06NetworkConnectionsProps {
  initialNetwork?: NetworkInvestigation;
  onSaveNetwork: (data: NetworkInvestigation) => void;
  onNextStation: () => void;
}

export const Station06NetworkConnections: React.FC<Station06NetworkConnectionsProps> = ({
  initialNetwork,
  onSaveNetwork,
  onNextStation,
}) => {
  const [netData, setNetData] = useState<NetworkInvestigation>({
    ...DEFAULT_NETWORK,
    ...(initialNetwork || {}),
  });
  const [copiedNetCmd, setCopiedNetCmd] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [challengePid, setChallengePid] = useState('');

  const handleUpdate = (field: keyof NetworkInvestigation, value: any) => {
    setNetData((prev) => ({ ...prev, [field]: value }));
  };

  const netCmd = `Get-NetTCPConnection -State Established | Select-Object -First 10 LocalAddress,LocalPort,RemoteAddress,RemotePort,OwningProcess`;

  const copyNetCmd = () => {
    navigator.clipboard.writeText(netCmd);
    setCopiedNetCmd(true);
    setTimeout(() => setCopiedNetCmd(false), 2000);
  };

  const handleSaveAndProceed = () => {
    onSaveNetwork(netData);
    onNextStation();
  };

  return (
    <section
      id="estacion-06-quien-esta-usando-tu-red"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 06 // 08</span>
          <span>•</span>
          <span>SOCKETS Y CONEXIONES EXTERNAS</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          06 // ¿QUIÉN ESTÁ USANDO TU RED?
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “Una conexión de red siempre tiene dos extremos: tu procesador y un servidor en algún lugar del mundo.”
        </p>
      </div>

      {/* Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          En partidas multijugador competitivas, el ping, los paquetes perdidos (packet loss) y las
          variaciones de latencia (jitter) a menudo no son culpa de tu proveedor de fibra, sino de
          aplicaciones secundarias saturando tu búfer de red o sincronizando archivos mientras jugás.
        </p>
        <p className="text-white font-medium">
          Cada conexión establecida (Established) está ligada a un <strong>OwningProcess (PID)</strong>.
          Si sabés qué PID sostiene el socket, podés saber exactamente qué ejecutable está enviando o
          recibiendo bytes.
        </p>
      </div>

      {/* Cadena Forense Visual Diagram */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4 font-mono-tech text-xs">
        <div className="flex items-center gap-2 font-bold text-yellow-400 uppercase">
          <Radio className="w-4 h-4" />
          <span>CADENA FORENSE // DE LA CONEXIÓN AL BINARIO</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex flex-col justify-center items-center">
            <span className="text-zinc-500 block text-[9px] uppercase">1. RED</span>
            <span className="text-white font-bold mt-1">IP : PUERTO</span>
          </div>
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex flex-col justify-center items-center">
            <span className="text-zinc-500 block text-[9px] uppercase">2. KERNEL</span>
            <span className="text-yellow-400 font-bold mt-1">PID (Socket)</span>
          </div>
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex flex-col justify-center items-center">
            <span className="text-zinc-500 block text-[9px] uppercase">3. INSTANCIA</span>
            <span className="text-white font-bold mt-1">PROCESO</span>
          </div>
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex flex-col justify-center items-center">
            <span className="text-zinc-500 block text-[9px] uppercase">4. ARCHIVO</span>
            <span className="text-sky-300 font-bold mt-1">EJECUTABLE</span>
          </div>
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex flex-col justify-center items-center">
            <span className="text-zinc-500 block text-[9px] uppercase">5. ALMACENAMIENTO</span>
            <span className="text-white font-bold mt-1">RUTA REAL</span>
          </div>
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex flex-col justify-center items-center">
            <span className="text-zinc-500 block text-[9px] uppercase">6. CERTEZA</span>
            <span className="text-emerald-400 font-bold mt-1">FIRMA DIGITAL</span>
          </div>
        </div>
      </div>

      {/* PowerShell Deep Dive */}
      <div className="p-5 rounded-2xl bg-black/50 border border-zinc-800 space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold uppercase">
            <Terminal className="w-4 h-4" />
            <span>COMANDO POWERSHELL // AUDITAR CONEXIONES Y EXTRAER OWNINGPROCESS</span>
          </div>
          <span className="text-[11px] text-zinc-500">PowerShell nativo</span>
        </div>

        <div className="relative group">
          <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
            <code>{netCmd}</code>
          </pre>
          <button
            type="button"
            onClick={copyNetCmd}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copiar comando"
          >
            {copiedNetCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-zinc-400 text-[11px]">
          La columna <strong>OwningProcess</strong> te devuelve el PID. Luego ejecutás <code>Get-Process -Id &lt;PID&gt;</code> para conocer el programa exacto.
        </p>
      </div>

      {/* Regla: IP Desconocida */}
      <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-yellow-400 text-xs font-mono-tech space-y-1">
        <span className="font-bold text-yellow-400 block uppercase">
          PRINCIPIO // IP DESCONOCIDA = EVIDENCIA PENDIENTE DE CONTEXTO
        </span>
        <p className="text-zinc-300 font-sans-editorial leading-relaxed">
          Ver una IP como <code>52.178.17.243</code> o <code>104.16.85.20</code> no significa que te estén
          espiando: la enorme mayoría de los servicios modernos de Windows, Discord, Spotify o Riot Games
          utilizan redes de distribución de contenido (CDNs como Cloudflare, Fastly, Azure o AWS).
          No asumas intenciones maliciosas sin correlacionar con el proceso emisor.
        </p>
      </div>

      {/* Form: Registro de Conexión o Marca de "NO EVALUADA" */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
          <span className="text-white font-bold uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-yellow-400" />
            REGISTRO PERICIAL DE CONEXIÓN
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white">
              <input
                type="checkbox"
                checked={!netData.evaluated}
                onChange={(e) => {
                  const notEval = e.target.checked;
                  handleUpdate('evaluated', !notEval);
                  handleUpdate('status', notEval ? 'NO_EVALUADA' : 'IDENTIFICADO');
                }}
                className="w-4 h-4 accent-yellow-400 rounded"
              />
              <span className="text-[11px]">Marcar como "NO EVALUADA EN ESTA SESIÓN"</span>
            </label>
          </div>
        </div>

        {netData.evaluated ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-zinc-400 block font-bold mb-1">PROCESO RESPONSABLE</label>
                <input
                  type="text"
                  value={netData.processName}
                  onChange={(e) => handleUpdate('processName', e.target.value)}
                  placeholder="Ej. Discord.exe, msedge.exe, Valorant-Win64.exe"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block font-bold mb-1">OWNING PID</label>
                <input
                  type="text"
                  value={netData.owningPid}
                  onChange={(e) => handleUpdate('owningPid', e.target.value)}
                  placeholder="Ej. 10424"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block font-bold mb-1">DIRECCIÓN REMOTA (IP)</label>
                <input
                  type="text"
                  value={netData.remoteAddress}
                  onChange={(e) => handleUpdate('remoteAddress', e.target.value)}
                  placeholder="Ej. 162.159.130.233"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sky-300 text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-zinc-400 block font-bold mb-1">ESTADO DEL DICTAMEN</label>
                <select
                  value={netData.status}
                  onChange={(e) => handleUpdate('status', e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
                >
                  <option value="IDENTIFICADO">IDENTIFICADO // Servicio legítimo</option>
                  <option value="NO_DETERMINADO">NO DETERMINADO // Requiere seguimiento</option>
                  <option value="NO_EVALUADA">NO EVALUADA</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 block font-bold mb-1">NOTAS DE CONTEXTO</label>
              <textarea
                value={netData.contextNotes}
                onChange={(e) => handleUpdate('contextNotes', e.target.value)}
                rows={2}
                placeholder="Ej. Tráfico HTTPS estándar hacia servidores de voz/chat en la nube. Puerto 443."
                className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400 font-sans-editorial"
              />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 text-zinc-400 text-xs font-sans-editorial italic">
            Has seleccionado omitir la auditoría de red en esta sesión. Quedará registrada como{' '}
            <strong className="text-yellow-400">NO EVALUADA</strong> en tu Mapa de Actividad EVO 001
            sin obstaculizar la finalización de los peritajes del laboratorio.
          </div>
        )}
      </div>

      {/* TIP EVO // RED */}
      <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono-tech space-y-1">
          <span className="font-bold text-yellow-400 block">
            TIP EVO // CONEXIÓN ABIERTA != ROBO DE DATOS
          </span>
          <p className="text-zinc-300 font-sans-editorial leading-relaxed">
            Una conexión activa no demuestra actividad maliciosa. Casi cualquier juego moderno, cliente
            de chat o actualizador mantiene un socket TCP abierto en modo escucha para recibir notificaciones
            instantáneas sin necesidad de saturar tu conexión de consultas continuas.
          </p>
        </div>
      </div>

      {/* Microdesafío Opcional */}
      <div className="p-4 rounded-xl bg-[#111319] border border-zinc-800/80 space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Zap className="w-4 h-4" />
            <span>MICRODESAFÍO // RELACIONÁ UNA CONEXIÓN CON SU PID</span>
          </div>
          {challengeDone && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADO
            </span>
          )}
        </div>
        <p className="text-zinc-400 font-sans-editorial text-xs">
          Encontrá el OwningProcess (PID) de una conexión activa en tu Monitor de recursos o PowerShell y anotalo:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={challengePid}
            onChange={(e) => {
              setChallengePid(e.target.value);
              if (e.target.value.trim().length > 0) {
                setChallengeDone(true);
              }
            }}
            placeholder="PID numérico (ej. 8392)"
            className="flex-1 bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
          />
          <button
            type="button"
            onClick={() => {
              if (challengePid.trim().length > 0) {
                setChallengeDone(true);
              }
            }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-mono-tech text-xs uppercase font-bold transition-colors cursor-pointer"
          >
            Registrar Hallazgo
          </button>
        </div>
      </div>

      {/* Action to proceed */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          id="btn-guardar-red-forense"
          onClick={handleSaveAndProceed}
          className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
        >
          GUARDAR PERITAJE DE RED // CONTINUAR A ESTACIÓN 07 →
        </button>
      </div>
    </section>
  );
};
