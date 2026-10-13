import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Monitor,
  Terminal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { BaselineMetrics } from '../../types';

const DEFAULT_BASELINE: BaselineMetrics = {
  cpuPct: 3,
  ramUsedGb: 5.4,
  diskPct: 0,
  gpuPct: 1,
  processCount: 108,
  topConsumer: 'EpicGamesLauncher.exe / Antivirus',
  topCpu: ['System (0.8%)', 'DWM.exe (0.5%)', 'SearchIndexer.exe (0.3%)'],
  topRam: ['EpicGamesLauncher.exe (450 MB)', 'Discord.exe (320 MB)', 'Antivirus (280 MB)'],
  topDisk: ['System (0.1 MB/s)', 'Windows Search (0 MB/s)'],
  status: 'OBSERVADO',
  observedDurationSeconds: 120,
};

interface Station01BaselineProps {
  baseline?: BaselineMetrics;
  initialMetrics?: BaselineMetrics;
  onSaveBaseline?: (data: BaselineMetrics) => void;
  onSaveMetrics?: (data: BaselineMetrics) => void;
  onNextStation: () => void;
}

export const Station01Baseline: React.FC<Station01BaselineProps> = ({
  baseline,
  initialMetrics,
  onSaveBaseline,
  onSaveMetrics,
  onNextStation,
}) => {
  const initial = baseline || initialMetrics || DEFAULT_BASELINE;
  const [formData, setFormData] = useState<BaselineMetrics>({
    ...DEFAULT_BASELINE,
    ...initial,
    topCpu: initial?.topCpu?.length ? initial.topCpu : DEFAULT_BASELINE.topCpu,
    topRam: initial?.topRam?.length ? initial.topRam : DEFAULT_BASELINE.topRam,
    topDisk: initial?.topDisk?.length ? initial.topDisk : DEFAULT_BASELINE.topDisk,
  });
  const [showPowerShell, setShowPowerShell] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [challengeProcess, setChallengeProcess] = useState('');

  const handleFieldChange = (field: keyof BaselineMetrics, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field: 'topCpu' | 'topRam' | 'topDisk', index: number, val: string) => {
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = val;
      return { ...prev, [field]: arr };
    });
  };

  const handleSaveAndProceed = () => {
    if (onSaveBaseline) onSaveBaseline(formData);
    if (onSaveMetrics) onSaveMetrics(formData);
    onNextStation();
  };

  const powerShellCode = `Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name,Id,CPU,WorkingSet`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(powerShellCode);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section
      id="estacion-01-la-pc-que-nunca-duerme"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Station Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 01 // 08</span>
          <span>•</span>
          <span>REPOSO OPERATIVO</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          01 // LA PC QUE NUNCA DUERME
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “¿Qué hace tu computadora cuando supuestamente no está haciendo nada?”
        </p>
      </div>

      {/* Editorial Hook Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-zinc-800/80 font-sans-editorial text-sm text-zinc-300 leading-relaxed space-y-3">
        <p>
          Cerraste los juegos. Cerraste el navegador. No estás descargando archivos. Y sin embargo,
          los ventiladores no se apagan por completo y el monitor de recursos registra hilos en
          ejecución permanente.
        </p>
        <p className="text-white font-medium">
          Windows no es un escenario estático; es un ecosistema de servicios, controladores,
          suscripciones de eventos y telemetría que compiten continuamente por los mismos núcleos de
          tu procesador y las mismas páginas de tu memoria RAM.
        </p>
      </div>

      {/* Observation Protocol */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400">
          <Activity className="w-4 h-4" />
          <span>PROTOCOLO DE OBSERVACIÓN // LÍNEA BASE</span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono-tech text-zinc-300">
          <li className="p-3 bg-black/50 rounded-xl border border-zinc-800">
            <span className="text-yellow-400 font-bold block mb-1">PASO 1</span>
            Presioná <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">Ctrl</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">Shift</kbd> +{' '}
            <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-white font-bold">Esc</kbd> para abrir el Administrador de tareas.
          </li>
          <li className="p-3 bg-black/50 rounded-xl border border-zinc-800">
            <span className="text-yellow-400 font-bold block mb-1">PASO 2</span>
            Hacé clic en la pestaña <strong>Rendimiento</strong> y luego en <strong>Procesos</strong>.
          </li>
          <li className="p-3 bg-black/50 rounded-xl border border-zinc-800">
            <span className="text-yellow-400 font-bold block mb-1">PASO 3</span>
            Dejá reposar la máquina entre <strong>30 y 60 segundos</strong> sin mover el mouse.
          </li>
          <li className="p-3 bg-black/50 rounded-xl border border-zinc-800">
            <span className="text-yellow-400 font-bold block mb-1">PASO 4</span>
            Registrá las métricas estables observadas a continuación.
          </li>
        </ol>
      </div>

      {/* Interactive Form: Línea Base */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
          <Database className="w-4 h-4 text-yellow-400" />
          REGISTRO DE MÉTRICAS EN REPOSO // LÍNEA BASE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono-tech text-xs">
          {/* CPU % */}
          <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
            <label className="text-zinc-400 block font-bold">CPU % REPOSO</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.cpuPct}
                onChange={(e) => handleFieldChange('cpuPct', Number(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-yellow-400"
              />
              <span className="text-zinc-500 font-bold">%</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">Habitual: 1% a 6%</span>
          </div>

          {/* RAM GB */}
          <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
            <label className="text-zinc-400 block font-bold">RAM EN USO (GB)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max="128"
                value={formData.ramUsedGb}
                onChange={(e) => handleFieldChange('ramUsedGb', Number(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-yellow-400"
              />
              <span className="text-zinc-500 font-bold">GB</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">Windows 10/11: 3.5 a 6.5 GB</span>
          </div>

          {/* DISCO % */}
          <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
            <label className="text-zinc-400 block font-bold">DISCO % REPOSO</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.diskPct}
                onChange={(e) => handleFieldChange('diskPct', Number(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-yellow-400"
              />
              <span className="text-zinc-500 font-bold">%</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">En SSDs debe rondar 0%–2%</span>
          </div>

          {/* GPU % */}
          <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
            <label className="text-zinc-400 block font-bold">GPU % REPOSO</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.gpuPct}
                onChange={(e) => handleFieldChange('gpuPct', Number(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-yellow-400"
              />
              <span className="text-zinc-500 font-bold">%</span>
            </div>
            <span className="text-[10px] text-zinc-500 block">Composición DWM: 0%–3%</span>
          </div>

          {/* PROCESOS TOTALES */}
          <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 space-y-2">
            <label className="text-zinc-400 block font-bold">CANTIDAD PROCESOS</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="500"
                value={formData.processCount}
                onChange={(e) => handleFieldChange('processCount', Number(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-yellow-400"
              />
            </div>
            <span className="text-[10px] text-zinc-500 block">Común: 80 a 160 procesos</span>
          </div>
        </div>

        {/* TOP Consumidores Audit */}
        <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono-tech text-xs font-bold text-white uppercase tracking-wider">
              ORDENAR Y AISLAR // TOP CONSUMIDORES DE FONDO
            </span>
            <span className="text-[11px] font-mono-tech text-zinc-400">
              Hacé clic en las columnas del Administrador de tareas para ordenar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tech text-xs">
            {/* Top CPU */}
            <div className="space-y-2 p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-yellow-400 font-bold block text-[11px]">
                TOP 3 PROCESOS EN CPU
              </span>
              {formData.topCpu.map((item, idx) => (
                <input
                  key={`top-cpu-${idx}`}
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('topCpu', idx, e.target.value)}
                  placeholder={`Ej. ${idx === 0 ? 'System' : idx === 1 ? 'DWM.exe' : 'Antivirus'}`}
                  className="w-full bg-black/60 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                />
              ))}
            </div>

            {/* Top RAM */}
            <div className="space-y-2 p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-yellow-400 font-bold block text-[11px]">
                TOP 3 PROCESOS EN RAM
              </span>
              {formData.topRam.map((item, idx) => (
                <input
                  key={`top-ram-${idx}`}
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('topRam', idx, e.target.value)}
                  placeholder={`Ej. ${idx === 0 ? 'Chrome / Browser' : idx === 1 ? 'Discord' : 'Explorer.exe'}`}
                  className="w-full bg-black/60 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                />
              ))}
            </div>

            {/* Top Disco */}
            <div className="space-y-2 p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <span className="text-yellow-400 font-bold block text-[11px]">
                TOP 3 PROCESOS EN DISCO
              </span>
              {formData.topDisk.map((item, idx) => (
                <input
                  key={`top-disk-${idx}`}
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange('topDisk', idx, e.target.value)}
                  placeholder={`Ej. ${idx === 0 ? 'System' : idx === 1 ? 'Windows Search' : 'Ninguno (0 MB/s)'}`}
                  className="w-full bg-black/60 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-zinc-400 text-xs font-mono-tech block mb-1.5 font-bold">
              MAYOR CONSUMIDOR INDIVIDUAL IDENTIFICADO EN REPOSO
            </label>
            <input
              type="text"
              value={formData.topConsumer}
              onChange={(e) => handleFieldChange('topConsumer', e.target.value)}
              placeholder="Ej. Antivirus / Windows Defender / Google Drive Sync / Steam Launcher"
              className="w-full bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* TIP EVO // Diferencia entre CPU acumulado e instantáneo */}
      <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono-tech space-y-1">
          <span className="font-bold text-yellow-400 block">
            TIP EVO // CPU ACUMULADO VS USO INSTANTÁNEO
          </span>
          <p className="text-zinc-300 font-sans-editorial leading-relaxed">
            Un proceso puede utilizar poco CPU en este instante exacto (0.1%), pero haber utilizado
            mucho cómputo en la última hora. Por eso el <strong>tiempo acumulado de procesador</strong>{' '}
            y el <strong>porcentaje de uso instantáneo</strong> son dos métricas complementarias con
            significados técnicos totalmente distintos.
          </p>
        </div>
      </div>

      {/* PowerShell Deep Dive Section */}
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-black/40">
        <button
          type="button"
          onClick={() => setShowPowerShell(!showPowerShell)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 font-mono-tech text-xs font-bold text-sky-400 uppercase">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>PROFUNDIZAR // POWERSHELL: AUDITAR PROCESOS EN CONSOLA</span>
          </div>
          {showPowerShell ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {showPowerShell && (
          <div className="p-5 border-t border-zinc-800 space-y-4 font-mono-tech text-xs">
            <div className="relative group">
              <pre className="p-3.5 rounded-xl bg-black border border-zinc-700 text-sky-300 overflow-x-auto text-[11px] leading-relaxed">
                <code>{powerShellCode}</code>
              </pre>
              <button
                type="button"
                onClick={copyToClipboard}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Copiar comando"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <strong className="text-yellow-400 block mb-1">QUÉ HACE</strong>
                <p className="text-zinc-400">
                  Consulta la lista viva de procesos del kernel, ordena por tiempo de CPU descendente y muestra los 10 primeros.
                </p>
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <strong className="text-sky-400 block mb-1">QUÉ DEVUELVE</strong>
                <p className="text-zinc-400">
                  Nombre, PID numérico, CPU (segundos acumulados de procesador) y WorkingSet (bytes de memoria en RAM).
                </p>
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <strong className="text-rose-400 block mb-1">QUÉ NO DEMUESTRA</strong>
                <p className="text-zinc-400">
                  No demuestra que un proceso esté ralentizando tu juego ahora mismo ni que sea un virus o sobrecarga perjudicial.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Microdesafío Opcional: Proceso con más RAM */}
      <div className="p-4 rounded-xl bg-[#111319] border border-zinc-800/80 space-y-3 font-mono-tech text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Zap className="w-4 h-4" />
            <span>MICRODESAFÍO // ENCONTRÁ TU PROCESO CON MÁS RAM</span>
          </div>
          {challengeCompleted && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETADO
            </span>
          )}
        </div>
        <p className="text-zinc-400 font-sans-editorial text-xs">
          Hacé clic en el encabezado “Memoria” en el Administrador de tareas. ¿Cuál es el proceso que más memoria retiene en este momento?
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={challengeProcess}
            onChange={(e) => {
              setChallengeProcess(e.target.value);
              if (e.target.value.trim().length > 1) {
                setChallengeCompleted(true);
              }
            }}
            placeholder="Nombre del proceso (ej. chrome.exe, msedge.exe, Discord.exe)"
            className="flex-1 bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-tech text-xs focus:outline-none focus:border-yellow-400"
          />
          <button
            type="button"
            onClick={() => {
              if (challengeProcess.trim().length > 0) {
                setChallengeCompleted(true);
              }
            }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-mono-tech text-xs uppercase font-bold transition-colors cursor-pointer"
          >
            Registrar Hallazgo
          </button>
        </div>
      </div>

      {/* Discovery 01 Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#14151b] to-black border border-yellow-400/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="font-mono-tech text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            DESCUBRIMIENTO 01 // LÍNEA BASE OBSERVADA
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-tech text-[10px] uppercase font-bold">
            ESTADO: {formData.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono-tech text-xs">
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">CPU REPOSO</span>
            <span className="text-white font-bold text-sm">{formData.cpuPct}%</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">RAM EN USO</span>
            <span className="text-white font-bold text-sm">{formData.ramUsedGb} GB</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">DISCO EN REPOSO</span>
            <span className="text-white font-bold text-sm">{formData.diskPct}%</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">PROCESOS ACTIVOS</span>
            <span className="text-white font-bold text-sm">{formData.processCount}</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-lg border border-zinc-800 col-span-2 sm:col-span-1">
            <span className="text-zinc-500 block text-[10px]">MAYOR CONSUMIDOR</span>
            <span className="text-yellow-400 font-bold text-xs truncate block">
              {formData.topConsumer || 'Identificado'}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            id="btn-guardar-linea-base"
            onClick={handleSaveAndProceed}
            className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
          >
            GUARDAR LÍNEA BASE // CONTINUAR A ESTACIÓN 02 →
          </button>
        </div>
      </div>
    </section>
  );
};
