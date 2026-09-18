import React, { useState } from 'react';
import {
  Cog,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  Layers,
  Zap,
} from 'lucide-react';
import { ServiceInvestigation } from '../../types';

const DEFAULT_SERVICE: ServiceInvestigation = {
  visibleName: 'Cola de impresión',
  serviceName: 'Spooler',
  state: 'RUNNING',
  startType: 'AUTOMATICO',
  description:
    'Carga los archivos en la memoria para imprimirlos más tarde en segundo plano.',
};

interface Station04ServicesDeepDiveProps {
  initialService?: ServiceInvestigation;
  onSaveService: (data: ServiceInvestigation) => void;
  onNextStation: () => void;
}

export const Station04ServicesDeepDive: React.FC<Station04ServicesDeepDiveProps> = ({
  initialService,
  onSaveService,
  onNextStation,
}) => {
  const [serviceData, setServiceData] = useState<ServiceInvestigation>({
    ...DEFAULT_SERVICE,
    ...(initialService || {}),
  });
  const [showPowerShell, setShowPowerShell] = useState(false);
  const [copiedGetCmd, setCopiedGetCmd] = useState(false);
  const [copiedCimCmd, setCopiedCimCmd] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [recognizedService, setRecognizedService] = useState('');

  const handleUpdate = (field: keyof ServiceInvestigation, value: any) => {
    setServiceData((prev) => ({ ...prev, [field]: value }));
  };

  const getServiceCmd = `Get-Service | Where-Object Status -eq 'Running' | Select-Object -First 15 Name,DisplayName,Status`;
  const cimServiceCmd = `Get-CimInstance Win32_Service | Select-Object -First 10 Name,DisplayName,State,StartMode,PathName`;

  const copyGetCmd = () => {
    navigator.clipboard.writeText(getServiceCmd);
    setCopiedGetCmd(true);
    setTimeout(() => setCopiedGetCmd(false), 2000);
  };

  const copyCimCmd = () => {
    navigator.clipboard.writeText(cimServiceCmd);
    setCopiedCimCmd(true);
    setTimeout(() => setCopiedCimCmd(false), 2000);
  };

  const handleSaveAndProceed = () => {
    onSaveService(serviceData);
    onNextStation();
  };

  return (
    <section
      id="estacion-04-servicios-bajo-la-superficie"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 04 // 08</span>
          <span>•</span>
          <span>SERVICIOS DE SISTEMA</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          04 // SERVICIOS BAJO LA SUPERFICIE
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “¿Cómo puede un programa trabajar silenciosamente sin tener ninguna ventana abierta?”
        </p>
      </div>

      {/* Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          Un <strong>servicio de Windows</strong> es un programa diseñado para ejecutarse en segundo
          plano sin interfaz gráfica de usuario. Se inician antes de que inicies sesión y a menudo
          operan bajo privilegios elevados del sistema.
        </p>
        <p className="text-white font-medium">
          Manejan la red, el sonido, la cola de impresión, la criptografía y las conexiones remotas.
          El mito de los “debloaters” afirma que desactivar 40 servicios al azar triplica los FPS. En
          la realidad física, la mayoría de los servicios duermen a la espera de eventos y consumen
          cero ciclos de procesador.
        </p>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-yellow-400 text-xs font-mono-tech flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-yellow-400 block uppercase tracking-wider">
            REGLA PERICIAL // INVESTIGACIÓN SIN MODIFICACIÓN A CIEGAS
          </span>
          <p className="text-zinc-300 font-sans-editorial leading-relaxed">
            En esta estación <strong>no vamos a desactivar servicios</strong>. Vamos a entender cómo se
            llaman, cómo arrancan y qué hacen. Desactivar servicios del núcleo de Windows puede dejar
            tu sistema sin red, sin audio o incapaz de autenticar tu cuenta.
          </p>
        </div>
      </div>

      {/* Observation Protocol: services.msc */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400">
          <Cog className="w-4 h-4" />
          <span>ACCESO Y REGISTRO DE UN SERVICIO</span>
        </div>

        <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">
          Presioná <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">Win</kbd> +{' '}
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">R</kbd>, escribí{' '}
          <code className="px-2 py-0.5 bg-black rounded text-yellow-400 font-mono-tech">services.msc</code> y
          presioná Enter. Elegí un servicio para inspeccionar sus propiedades.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
          {/* Nombre visible */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">NOMBRE VISIBLE (DISPLAY NAME)</label>
            <input
              type="text"
              value={serviceData.visibleName}
              onChange={(e) => handleUpdate('visibleName', e.target.value)}
              placeholder="Ej. Cola de impresión / Audio de Windows / Windows Search"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Nombre de servicio */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">NOMBRE DEL SERVICIO (INTERNO)</label>
            <input
              type="text"
              value={serviceData.serviceName}
              onChange={(e) => handleUpdate('serviceName', e.target.value)}
              placeholder="Ej. Spooler / Audiosrv / WSearch"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Estado */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">ESTADO ACTUAL</label>
            <select
              value={serviceData.state}
              onChange={(e) => handleUpdate('state', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="RUNNING">RUNNING // En ejecución</option>
              <option value="STOPPED">STOPPED // Detenido</option>
              <option value="PAUSED">PAUSED // En pausa</option>
              <option value="DESCONOCIDO">DESCONOCIDO</option>
            </select>
          </div>

          {/* Tipo de inicio */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">TIPO DE INICIO (START TYPE)</label>
            <select
              value={serviceData.startType}
              onChange={(e) => handleUpdate('startType', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="AUTOMATICO">AUTOMÁTICO (Inicia con Windows)</option>
              <option value="MANUAL">MANUAL (Inicia a petición de otro programa)</option>
              <option value="DESHABILITADO">DESHABILITADO (Bloqueado para arrancar)</option>
              <option value="DESCONOCIDO">DESCONOCIDO</option>
            </select>
          </div>
        </div>

        {/* Descripción oficial */}
        <div className="space-y-1.5 font-mono-tech text-xs">
          <label className="text-zinc-400 block font-bold">DESCRIPCIÓN OFICIAL REGISTRADA</label>
          <textarea
            value={serviceData.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            rows={2}
            placeholder="Ej. Carga los archivos en la memoria para imprimirlos más tarde..."
            className="w-full bg-black/60 border border-zinc-700 rounded-lg p-2.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400 font-sans-editorial"
          />
        </div>
      </div>

      {/* Cápsula Didáctica: Svchost.exe */}
      <div className="p-5 rounded-2xl bg-black/60 border border-sky-400/40 space-y-3 font-sans-editorial text-xs leading-relaxed text-zinc-300">
        <div className="flex items-center gap-2 font-mono-tech text-xs font-bold text-sky-400 uppercase">
          <Layers className="w-4 h-4" />
          <span>CÁPSULA ARQUITECTÓNICA // ¿POR QUÉ HAY TANTOS SVCHOST.EXE?</span>
        </div>
        <p>
          En tu Administrador de tareas es normal ver 50 o más instancias de <code>svchost.exe</code> (Service Host).
          Windows no crea un ejecutable independiente para cada servicio pequeño; en su lugar, agrupa
          servicios desarrollados en archivos DLL dentro de procesos anfitriones <code>svchost.exe</code>.
        </p>
        <p className="text-white">
          Desde Windows 10 (Creators Update), en equipos con suficiente memoria RAM (&gt; 3.5 GB),
          Windows deliberadamente <strong>separa cada servicio en su propio svchost individual</strong>.
          ¿La razón física? Si un servicio falla, sólo se cae ese hilo y no se derrumba toda la red ni el audio del sistema.
          Ver decenas de svchost.exe es una decisión deliberada de estabilidad y aislamiento de fallos, <strong>no un error</strong>.
        </p>
      </div>

      {/* PowerShell Deep Dive */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold uppercase">
            <Terminal className="w-4 h-4" />
            <span>COMANDOS POWERSHELL // AUDITORÍA DE SERVICIOS</span>
          </div>
          <span className="text-[11px] text-zinc-500">Inspección de kernel</span>
        </div>

        {/* Command 1: Get-Service */}
        <div className="space-y-1.5">
          <span className="text-zinc-400 text-[11px] block">1. Listar servicios activos:</span>
          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
              <code>{getServiceCmd}</code>
            </pre>
            <button
              type="button"
              onClick={copyGetCmd}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {copiedGetCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Command 2: Get-CimInstance */}
        <div className="space-y-1.5 pt-2">
          <span className="text-zinc-400 text-[11px] block">
            2. Inspeccionar ruta real del ejecutable asociado a cada servicio:
          </span>
          <div className="relative group">
            <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
              <code>{cimServiceCmd}</code>
            </pre>
            <button
              type="button"
              onClick={copyCimCmd}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {copiedCimCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* TIP EVO // SERVICIO */}
      <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono-tech space-y-1">
          <span className="font-bold text-yellow-400 block">
            TIP EVO // DETENIDO VS DESHABILITADO
          </span>
          <p className="text-zinc-300 font-sans-editorial leading-relaxed">
            <strong>DETENIDO</strong> significa que no está ejecutándose en este momento, pero otro
            programa puede solicitarle arrancar. <strong>DESHABILITADO</strong> significa que Windows
            tiene orden expresa de rechazar cualquier intento de inicio. No cambies a Deshabilitado
            sin conocer qué componentes dependen de él.
          </p>
        </div>
      </div>

      {/* Microdesafío Opcional */}
      <div className="p-4 rounded-xl bg-[#111319] border border-zinc-800/80 space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Zap className="w-4 h-4" />
            <span>MICRODESAFÍO // ENCONTRÁ UN SERVICIO QUE RECONOZCAS</span>
          </div>
          {challengeDone && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> REGISTRADO
            </span>
          )}
        </div>
        <p className="text-zinc-400 font-sans-editorial text-xs">
          Encontrá en la lista de services.msc un servicio que reconozcas (por ejemplo, el de tu antivirus, Steam, NVIDIA, o impresión) y anotá su nombre visible:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={recognizedService}
            onChange={(e) => {
              setRecognizedService(e.target.value);
              if (e.target.value.trim().length > 1) {
                setChallengeDone(true);
              }
            }}
            placeholder="Ej. NVIDIA Display Container LS, Windows Audio, etc."
            className="flex-1 bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
          />
          <button
            type="button"
            onClick={() => {
              if (recognizedService.trim().length > 0) {
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
          id="btn-guardar-servicio-deepdive"
          onClick={handleSaveAndProceed}
          className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
        >
          GUARDAR AUDITORÍA DE SERVICIOS // CONTINUAR A ESTACIÓN 05 →
        </button>
      </div>
    </section>
  );
};
