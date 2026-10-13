import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Folder,
  RefreshCw,
  Clock,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  GitCommit,
  HardDrive,
  Globe,
  ChevronRight,
  Sparkles,
  Server,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Sector06VisualDiagramsProps {
  code: string;
}

export const Sector06VisualDiagrams: React.FC<Sector06VisualDiagramsProps> = ({ code }) => {
  const [selectedCycleStep, setSelectedCycleStep] = useState<string>('scm');
  const [selectedStartType, setSelectedStartType] = useState<string>('automatic');

  // 06.01 PROCESS VS SERVICE
  if (code === '06.01') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 06.01 // PROCESO ESTÁNDAR VS SERVICIO WIN32
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            HEADLESS SERVICE ARCHITECTURE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#0F1520] border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Layers className="w-4 h-4" />
              <span>PROCESO ESTÁNDAR (APP DE USUARIO)</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Requiere sesión de usuario iniciada, crea marco de ventana GUI en Sesión 1 y cierra si el usuario cierra sesión.
            </p>
            <div className="p-2 rounded bg-black/50 text-zinc-300 text-[10px]">
              Estructura: Chrome.exe, Notepad.exe (Sesión &gt;= 1)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0F1520] border border-[#00A4EF]/20 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#60CDFF]">
              <Server className="w-4 h-4" />
              <span>SERVICIO WIN32 (SERVICES.MSC)</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Inicia al encender la PC antes del login, ejecuta sin ventana en Sesión 0 y es controlado por el SCM.
            </p>
            <div className="p-2 rounded bg-black/50 text-[#60CDFF] text-[10px] font-bold">
              Estructura: Dhcp, Dnscache, Spooler (Sesión 0)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 06.03 - 06.07 START TYPES COMPARISON
  if (['06.03', '06.04', '06.05', '06.06', '06.07'].includes(code)) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              MATRIZ DE TIPOS DE INICIO DE SERVICIO (START TYPES)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSelectedStartType('automatic')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${selectedStartType === 'automatic' || code === '06.03' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            Automático
          </button>
          <button
            type="button"
            onClick={() => setSelectedStartType('delayed')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${selectedStartType === 'delayed' || code === '06.04' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            Retrasado
          </button>
          <button
            type="button"
            onClick={() => setSelectedStartType('manual')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${selectedStartType === 'manual' || code === '06.05' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            Manual
          </button>
          <button
            type="button"
            onClick={() => setSelectedStartType('trigger')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${selectedStartType === 'trigger' || code === '06.06' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            Trigger
          </button>
          <button
            type="button"
            onClick={() => setSelectedStartType('disabled')}
            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${selectedStartType === 'disabled' || code === '06.07' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0E131D] border-zinc-800 text-zinc-400'}`}
          >
            Deshabilitado
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D121C] border border-sky-500/20 text-xs font-mono space-y-1.5">
          <div className="text-[#60CDFF] font-bold uppercase">
            COMPORTAMIENTO REGISTRADO EN SCM:
          </div>
          {(selectedStartType === 'automatic' || code === '06.03') && (
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>AUTOMÁTICO:</strong> Se arranca inmediatamente durante el boot de Windows. Indispensable para servicios de infraestructura básica.
            </p>
          )}
          {(selectedStartType === 'delayed' || code === '06.04') && (
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>AUTOMÁTICO (RETRASADO):</strong> Espera 2 minutos tras el login del usuario para cargar sin saturar la CPU/SSD en el encendido.
            </p>
          )}
          {(selectedStartType === 'manual' || code === '06.05') && (
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>MANUAL:</strong> Permanece detenido en 0 MB de RAM hasta que una app o el SO solicita su función. ¡SI SE PUEDE INICIAR SOLO!
            </p>
          )}
          {(selectedStartType === 'trigger' || code === '06.06') && (
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>TRIGGER START:</strong> Se activa únicamente ante eventos específicos de hardware o red (ej. conectar USB o Wi-Fi).
            </p>
          )}
          {(selectedStartType === 'disabled' || code === '06.07') && (
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>DESHABILITADO:</strong> Bloqueado de ejecución. Devuelve error 1058 si algún programa intenta invocarlo.
            </p>
          )}
        </div>
      </div>
    );
  }

  // 06.08 DEPENDENCY GRAPH
  if (code === '06.08') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              DIAGRAMA 06.08 // GRAFO DE DEPENDENCIAS DE SERVICIOS
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            EFECTO DOMINÓ
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1017] border border-zinc-800 font-mono text-xs space-y-3">
          <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-bold flex items-center justify-between">
            <span>SERVICIO RAIZ: RpcSs (Llamada a procedimiento remoto)</span>
            <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded">INTOCABLE</span>
          </div>

          <div className="pl-4 border-l-2 border-red-500/40 space-y-2">
            <div className="p-2 rounded bg-[#131A26] border border-zinc-800 text-zinc-300 flex items-center justify-between text-[11px]">
              <span>├── AudioEndpointBuilder (Generador de puntos finales de audio)</span>
              <span className="text-amber-400">Depende de RpcSs</span>
            </div>
            <div className="pl-4 border-l-2 border-sky-500/40 space-y-1">
              <div className="p-2 rounded bg-[#131A26] border border-zinc-800 text-zinc-300 flex items-center justify-between text-[11px]">
                <span>└── AudioSrv (Servicio de Audio de Windows)</span>
                <span className="text-[#60CDFF]">Depende de AudioEndpointBuilder</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-sans italic pt-2">
            Si deshabilitas RpcSs, los servicios AudioEndpointBuilder y AudioSrv colapsarán de inmediato dejando a la PC sin sonido.
          </p>
        </div>
      </div>
    );
  }

  // 06.10 - 06.13 IDENTITIES MATRIX
  if (['06.10', '06.11', '06.12', '06.13'].includes(code)) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-[#00A4EF]/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#60CDFF]" />
            <span className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              MATRIZ DE IDENTIDADES DE SERVICIO (LOG ON AS)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className={`p-3 rounded-xl border transition-all ${code === '06.11' ? 'bg-red-500/20 border-red-400 text-white font-bold' : 'bg-[#0E141F] border-zinc-800 text-zinc-400'}`}>
            <div className="text-red-400 font-bold text-[11px]">NT AUTHORITY\SYSTEM</div>
            <div className="text-[10px] text-zinc-300 mt-1 font-sans">
              Privilegios locales ilimitados. Acceso total a archivos del sistema y registro.
            </div>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${code === '06.12' ? 'bg-sky-500/20 border-sky-400 text-white font-bold' : 'bg-[#0E141F] border-zinc-800 text-zinc-400'}`}>
            <div className="text-sky-400 font-bold text-[11px]">NT AUTHORITY\LocalService</div>
            <div className="text-[10px] text-zinc-300 mt-1 font-sans">
              Privilegios locales reducidos. Sin acceso administrativo. Anónimo en red.
            </div>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${code === '06.13' ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold' : 'bg-[#0E141F] border-zinc-800 text-zinc-400'}`}>
            <div className="text-emerald-400 font-bold text-[11px]">NT AUTHORITY\NetworkService</div>
            <div className="text-[10px] text-zinc-300 mt-1 font-sans">
              Privilegios locales reducidos. Identidad de máquina autenticada en red.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 06.32 A/B TESTING METHODOLOGY
  if (code === '06.32') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090D14] border border-amber-500/30 font-sans space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              METODOLOGÍA PERICIAL A/B // DESMONTANDO EL PLACEBO
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
            SCIENTIFIC BENCHMARKING
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-[11px]">
          <div className="p-2.5 rounded-xl bg-[#0E131D] border border-zinc-800 space-y-1 text-center">
            <span className="text-[#60CDFF] font-bold block">PASO 1</span>
            <span className="text-zinc-300">Medir Baseline (FPS &amp; Frametime)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0E131D] border border-zinc-800 space-y-1 text-center">
            <span className="text-[#60CDFF] font-bold block">PASO 2</span>
            <span className="text-zinc-300">Aplicar UN solo cambio</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0E131D] border border-zinc-800 space-y-1 text-center">
            <span className="text-[#60CDFF] font-bold block">PASO 3</span>
            <span className="text-zinc-300">Medir nuevo estado</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0E131D] border border-zinc-800 space-y-1 text-center">
            <span className="text-[#60CDFF] font-bold block">PASO 4</span>
            <span className="text-zinc-300">Comparar datos duros</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 space-y-1 text-center text-emerald-300 font-bold">
            <span className="block">PASO 5</span>
            <span>Conservar o Revertir</span>
          </div>
        </div>
      </div>
    );
  }

  // GENERAL CENTRAL VISUAL: WINDOWS SERVICE LIFE CYCLE
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#080B10] border border-[#00A4EF]/30 font-sans space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#60CDFF]" />
            <h4 className="text-xs font-mono font-bold text-[#60CDFF] uppercase tracking-wider">
              VISUAL CENTRAL // WINDOWS SERVICE LIFE CYCLE
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400">
            El flujo completo de control de un servicio Win32 desde el evento de inicio hasta la recuperación ante fallos
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0078D4]/20 text-[#60CDFF] border border-[#00A4EF]/40 self-start sm:self-auto">
          SERVICE ARCHITECTURE MAP
        </span>
      </div>

      {/* Lifecycle Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => setSelectedCycleStep('trigger')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'trigger' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">01. EVENTO</div>
          <div className="text-[11px] truncate">Boot/App/Trigger</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCycleStep('scm')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'scm' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">02. CONTROL</div>
          <div className="text-[11px] truncate">services.exe (SCM)</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCycleStep('dep')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'dep' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">03. VERIFICA</div>
          <div className="text-[11px] truncate">Dependencias</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCycleStep('identity')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'identity' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">04. ASIGNA</div>
          <div className="text-[11px] truncate">Token / Log On As</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCycleStep('running')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'running' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">05. ESTADO</div>
          <div className="text-[11px] truncate">RUNNING (En ejec)</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCycleStep('stop')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'stop' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">06. PARADA</div>
          <div className="text-[11px] truncate">STOPPED / IDLE</div>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCycleStep('recovery')}
          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedCycleStep === 'recovery' ? 'bg-[#0078D4]/30 border-[#00A4EF] text-white font-bold' : 'bg-[#0D121B] border-zinc-800 text-zinc-400'}`}
        >
          <div className="text-[9px] text-[#60CDFF]">07. FALLO</div>
          <div className="text-[11px] truncate">Recovery Action</div>
        </button>
      </div>

      {/* Selected Step Description */}
      <div className="p-4 rounded-xl bg-[#0D121C] border border-[#00A4EF]/20 text-xs font-mono space-y-2">
        {selectedCycleStep === 'scm' && (
          <div className="space-y-1.5">
            <span className="text-[#60CDFF] font-bold block">ETAPA 02: SERVICE CONTROL MANAGER (SERVICES.EXE)</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              El SCM lee la configuración del servicio registrada en `HKLM\SYSTEM\CurrentControlSet\Services`, verifica el tipo de inicio (Automatic/Manual) y procesa la petición de arranque.
            </p>
          </div>
        )}
        {selectedCycleStep === 'dep' && (
          <div className="space-y-1.5">
            <span className="text-[#60CDFF] font-bold block">ETAPA 03: VERIFICACIÓN DE DEPENDENCIAS</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              El SCM consulta la lista `DependOnService`. Si algún servicio padre está detenido, el SCM lo iniciará primero antes de autorizar la carga de este servicio.
            </p>
          </div>
        )}
        {selectedCycleStep === 'running' && (
          <div className="space-y-1.5">
            <span className="text-emerald-400 font-bold block">ETAPA 05: ESTADO EN EJECUCIÓN (RUNNING)</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              El servicio está activo en la Sesión 0 alojado en su propio proceso o dentro de una instancia de `svchost.exe`.
            </p>
          </div>
        )}
        {selectedCycleStep === 'recovery' && (
          <div className="space-y-1.5">
            <span className="text-amber-400 font-bold block">ETAPA 07: RESPUESTA A FALLOS (RECOVERY ACTIONS)</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Si el proceso del servicio se cierra inesperadamente, el SCM aplica la directiva de la pestaña Recuperación (Reiniciar servicio automáticamente, ejecutar script o reiniciar equipo).
            </p>
          </div>
        )}
        {['trigger', 'identity', 'stop'].includes(selectedCycleStep) && (
          <div className="space-y-1.5">
            <span className="text-[#60CDFF] font-bold block">CICLO DE VIDA DE SERVICIO WIN32</span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              Gestión automatizada por eventos y privilegios asignados sin requerir sesión interactiva de usuario.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
