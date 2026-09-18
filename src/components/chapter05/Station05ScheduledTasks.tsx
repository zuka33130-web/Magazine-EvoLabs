import React, { useState, useEffect } from 'react';
import {
  Clock,
  Terminal,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Sparkles,
  Zap,
  Eye,
} from 'lucide-react';
import { ScheduledTaskInvestigation } from '../../types';

const DEFAULT_TASK: ScheduledTaskInvestigation = {
  taskName: 'GoogleUpdateTaskMachineCore',
  taskPath: '\\Microsoft\\EdgeUpdate',
  state: 'READY',
  apparentOrigin: 'Google LLC / Software externo',
  functionDesc:
    'Mantiene el navegador actualizado comprobando versiones cuando el equipo está en reposo.',
  twoMinWatchResult: 'NO_SE_OBSERVO_ACTIVIDAD',
  detectedProcessOrActivity: 'Consumo plano sin ráfagas espontáneas observadas.',
};

interface Station05ScheduledTasksProps {
  initialTask?: ScheduledTaskInvestigation;
  onSaveTask: (data: ScheduledTaskInvestigation) => void;
  onNextStation: () => void;
}

export const Station05ScheduledTasks: React.FC<Station05ScheduledTasksProps> = ({
  initialTask,
  onSaveTask,
  onNextStation,
}) => {
  const [taskData, setTaskData] = useState<ScheduledTaskInvestigation>({
    ...DEFAULT_TASK,
    ...(initialTask || {}),
  });
  const [copiedTaskCmd, setCopiedTaskCmd] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [challengeTaskName, setChallengeTaskName] = useState('');

  // 2-minute surveillance timer
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerFinished(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const handleStartTimer = () => {
    setTimerFinished(false);
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(120);
    setTimerFinished(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUpdate = (field: keyof ScheduledTaskInvestigation, value: any) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  const taskCmd = `Get-ScheduledTask | Select-Object -First 20 TaskName,TaskPath,State`;

  const copyTaskCmd = () => {
    navigator.clipboard.writeText(taskCmd);
    setCopiedTaskCmd(true);
    setTimeout(() => setCopiedTaskCmd(false), 2000);
  };

  const handleSaveAndProceed = () => {
    onSaveTask(taskData);
    onNextStation();
  };

  return (
    <section
      id="estacion-05-lo-que-despierta-solo"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 05 // 08</span>
          <span>•</span>
          <span>DISPARADORES Y ACTIVIDAD DIFERIDA</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          05 // LO QUE DESPIERTA SOLO
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “Tu PC estaba completamente quieta. De pronto: 100% de disco, ráfaga de CPU y ventiladores al máximo. ¿Quién la despertó?”
        </p>
      </div>

      {/* Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          Muchas tareas en Windows no corren todo el tiempo. Esperan condiciones concretas: que la PC
          lleve 5 minutos en reposo (Windows Maintenance), que den las 03:00 AM, o que inicies sesión
          para sincronizar certificados y buscar parches.
        </p>
        <p className="text-white font-medium">
          El <strong>Programador de tareas</strong> es el relojero invisible del sistema. Saber qué
          tareas existen te permite comprender por qué a veces tu juego sufre un tirón repentino sin
          que hayas tocado nada.
        </p>
      </div>

      {/* Regla Central */}
      <div className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-yellow-400 text-xs font-mono-tech space-y-1">
        <span className="font-bold text-yellow-400 block uppercase">
          REGLA PERICIAL // TAREA DESCONOCIDA != MALWARE
        </span>
        <p className="text-zinc-300 font-sans-editorial leading-relaxed">
          Windows posee cientos de tareas internas de mantenimiento (desfragmentación automática de SSDs,
          limpieza de memoria caché, rotación de logs de errores). Borrar tareas arbitrariamente del
          programador puede provocar fallos silenciosos en subsistemas vitales.
        </p>
      </div>

      {/* Form: Investigación de Tarea Programada */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400">
          <Clock className="w-4 h-4" />
          <span>INSPECCIÓN // BIBLIOTECA DEL PROGRAMADOR DE TAREAS</span>
        </div>

        <p className="text-zinc-300 font-sans-editorial text-xs">
          Presioná <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">Win</kbd> +{' '}
          <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">R</kbd>, escribí{' '}
          <code className="px-2 py-0.5 bg-black rounded text-yellow-400 font-mono-tech">taskschd.msc</code> y
          explorá la <strong>Biblioteca del Programador de tareas</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono-tech text-xs">
          {/* Nombre de la tarea */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5 col-span-2">
            <label className="text-zinc-400 block font-bold">NOMBRE DE LA TAREA</label>
            <input
              type="text"
              value={taskData.taskName}
              onChange={(e) => handleUpdate('taskName', e.target.value)}
              placeholder="Ej. GoogleUpdateTaskMachineCore / Defrag / Adobe Acrobat Update Task"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Origen aparente */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">ORIGEN APARENTE</label>
            <input
              type="text"
              value={taskData.apparentOrigin}
              onChange={(e) => handleUpdate('apparentOrigin', e.target.value)}
              placeholder="Ej. Google / Microsoft / Fabricante"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Estado */}
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 space-y-1.5">
            <label className="text-zinc-400 block font-bold">ESTADO DE LA TAREA</label>
            <select
              value={taskData.state}
              onChange={(e) => handleUpdate('state', e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="READY">READY // Lista para dispararse</option>
              <option value="RUNNING">RUNNING // En ejecución ahora</option>
              <option value="DISABLED">DISABLED // Deshabilitada</option>
              <option value="UNKNOWN">UNKNOWN // No determinada</option>
            </select>
          </div>
        </div>

        {/* Función declarada */}
        <div className="space-y-1.5 font-mono-tech text-xs">
          <label className="text-zinc-400 block font-bold">FUNCIÓN O DISPARADOR OBSERVADO</label>
          <input
            type="text"
            value={taskData.functionDesc}
            onChange={(e) => handleUpdate('functionDesc', e.target.value)}
            placeholder="Ej. Se ejecuta al iniciar sesión y cada 1 hora para comprobar nuevas versiones en segundo plano."
            className="w-full bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* PowerShell Deep Dive */}
      <div className="p-5 rounded-2xl bg-black/50 border border-zinc-800 space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold uppercase">
            <Terminal className="w-4 h-4" />
            <span>COMANDO POWERSHELL // LISTAR TAREAS PROGRAMADAS</span>
          </div>
          <span className="text-[11px] text-zinc-500">PowerShell nativo</span>
        </div>

        <div className="relative group">
          <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
            <code>{taskCmd}</code>
          </pre>
          <button
            type="button"
            onClick={copyTaskCmd}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copiar comando"
          >
            {copiedTaskCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Experimento Activo: Vigilancia de 2 Minutos */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#151620] to-[#0c0d12] border border-yellow-400/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-yellow-400 font-bold font-mono-tech text-xs uppercase">
            <Eye className="w-4 h-4" />
            <span>EXPERIMENTO ACTIVO // VIGILANCIA DE 2 MINUTOS EN REPOSO</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono-tech text-xs font-bold">
            OBSERVACIÓN DE ACTIVIDAD DIFERIDA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center font-mono-tech text-xs">
          {/* Timer Display */}
          <div className="p-5 bg-black/60 rounded-2xl border border-zinc-800 text-center space-y-3">
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              CUENTA REGRESIVA DE VIGILANCIA
            </span>
            <div className="font-display font-black text-4xl sm:text-5xl text-white tracking-widest">
              {formatTime(secondsRemaining)}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              {!isTimerRunning ? (
                <button
                  type="button"
                  onClick={handleStartTimer}
                  className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-bold uppercase hover:bg-yellow-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{secondsRemaining === 120 ? 'Iniciar Vigilancia' : 'Reanudar'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-white font-bold uppercase hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleResetTimer}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar a 120 segundos"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="col-span-2 space-y-3 text-zinc-300 font-sans-editorial text-xs leading-relaxed">
            <p className="font-bold text-white font-mono-tech uppercase">
              PROCEDIMIENTO DE VIGILANCIA:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
              <li>Cerrá reproductores, juegos y pestañas con descargas activas.</li>
              <li>Mantené visible el Administrador de tareas (pestaña Rendimiento).</li>
              <li>
                <strong>No muevas el mouse ni toques el teclado</strong> durante los 2 minutos.
              </li>
              <li>
                Observá si el procesador o el disco registran un pico de actividad espontáneo.
              </li>
            </ol>
            {timerFinished && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono-tech text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tiempo de vigilancia completado. Registrá tus hallazgos abajo.</span>
              </div>
            )}
          </div>
        </div>

        {/* Results of the 2-minute surveillance */}
        <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-4 font-mono-tech text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-400 block font-bold mb-1.5">
                RESULTADO DE LA VIGILANCIA (2 MINUTOS)
              </label>
              <select
                value={taskData.twoMinWatchResult}
                onChange={(e) => handleUpdate('twoMinWatchResult', e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
              >
                <option value="ACTIVIDAD_DETECTADA">
                  ACTIVIDAD DETECTADA // Ráfaga de CPU o Disco observada
                </option>
                <option value="NO_SE_OBSERVO_ACTIVIDAD">
                  NO SE OBSERVÓ ACTIVIDAD // Consumo se mantuvo plano y silencioso
                </option>
                <option value="NO_DETERMINADO">NO DETERMINADO // No concluyente</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 block font-bold mb-1.5">
                PROCESO O TAREA OBSERVADA EN LA RÁFAGA (OPCIONAL)
              </label>
              <input
                type="text"
                value={taskData.detectedProcessOrActivity || ''}
                onChange={(e) => handleUpdate('detectedProcessOrActivity', e.target.value)}
                placeholder="Ej. TiWorker.exe, Microsoft Defender Antivirus, Ninguno"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Microdesafío Opcional */}
      <div className="p-4 rounded-xl bg-[#111319] border border-zinc-800/80 space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Zap className="w-4 h-4" />
            <span>MICRODESAFÍO // ENCONTRÁ UNA TAREA PROGRAMADA</span>
          </div>
          {challengeDone && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADO
            </span>
          )}
        </div>
        <p className="text-zinc-400 font-sans-editorial text-xs">
          Encontrá el nombre de una tarea en el Programador de tareas de tu PC y escribilo acá:
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={challengeTaskName}
            onChange={(e) => {
              setChallengeTaskName(e.target.value);
              if (e.target.value.trim().length > 1) {
                setChallengeDone(true);
              }
            }}
            placeholder="Ej. OneDrive Standalone Update Task, MicrosoftEdgeUpdateTaskMachineUA"
            className="flex-1 bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
          />
          <button
            type="button"
            onClick={() => {
              if (challengeTaskName.trim().length > 0) {
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
          id="btn-guardar-tareas-programadas"
          onClick={handleSaveAndProceed}
          className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
        >
          GUARDAR AUDITORÍA DE TAREAS // CONTINUAR A ESTACIÓN 06 →
        </button>
      </div>
    </section>
  );
};
