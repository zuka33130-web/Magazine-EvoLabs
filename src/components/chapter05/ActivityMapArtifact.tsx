import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Share2,
  Sparkles,
  Layers,
  Activity,
  Cpu,
  Eye,
} from 'lucide-react';
import { ActivityMapData, UserPcSpec } from '../../types';

interface ActivityMapArtifactProps {
  activityMap: ActivityMapData;
  specs: Partial<UserPcSpec>;
}

export const ActivityMapArtifact: React.FC<ActivityMapArtifactProps> = ({
  activityMap,
  specs,
}) => {
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const formatPlainText = () => {
    return `============================================================
EVO LABS // EXPEDIENTE PERICIAL
ARTEFACTO: MAPA DE ACTIVIDAD EVO 001
FECHA DE EMISIÓN: ${activityMap.registeredAt}
PLATAFORMA: WINDOWS EN MOVIMIENTO // CAPÍTULO 05
============================================================

1. HARDWARE ASOCIADO (PASAPORTE EVO)
------------------------------------------------------------
CPU: ${specs.cpu || 'No especificado'} (${specs.cpuCores ?? 8}c/${specs.cpuThreads ?? 16}t)
GPU: ${specs.gpu || 'No especificada'} (${specs.vramGb ?? 'Compartida'} GB)
RAM: ${specs.ramGb ?? 16} GB (${specs.ramChannelMode || 'Dual Channel'})

2. LÍNEA BASE EN REPOSO OPERATIVO
------------------------------------------------------------
CPU en reposo: ${activityMap.baseline.cpuPct}%
RAM utilizada: ${activityMap.baseline.ramUsedGb} GB
Disco en reposo: ${activityMap.baseline.diskPct}%
GPU en reposo: ${activityMap.baseline.gpuPct}%
Procesos totales: ${activityMap.baseline.processCount}
Mayor consumidor: ${activityMap.baseline.topConsumer}
Top CPU: ${activityMap.baseline.topCpu.join(', ')}
Top RAM: ${activityMap.baseline.topRam.join(', ')}
Top Disco: ${activityMap.baseline.topDisk.join(', ')}
Estado: ${activityMap.baseline.status}

3. AUDITORÍA DE INICIO
------------------------------------------------------------
Total aplicaciones listadas: ${activityMap.startup.total}
Aplicaciones habilitadas en arranque: ${activityMap.startup.enabled}
Muestra auditada:
${activityMap.startup.auditedApps
  .map(
    (a) =>
      `- ${a.name} | Cat: ${a.category} | Impacto: ${a.impact} | Estado: ${a.state} | Uso al arrancar: ${a.userUsageOnBoot}`
  )
  .join('\n')}

4. FICHA DE IDENTIDAD: PROCESO INVESTIGADO
------------------------------------------------------------
Nombre: ${activityMap.investigatedProcess.name}
PID: ${activityMap.investigatedProcess.pid}
Consumo: ${activityMap.investigatedProcess.observedConsumption}
Ruta: ${activityMap.investigatedProcess.path}
Editor: ${activityMap.investigatedProcess.publisher}
Firma digital: ${activityMap.investigatedProcess.signature}
Dictamen: ${activityMap.investigatedProcess.identificationResult}
Observaciones: ${activityMap.investigatedProcess.observation}

5. SERVICIO DE WINDOWS INVESTIGADO
------------------------------------------------------------
Nombre visible: ${activityMap.investigatedService.visibleName}
Nombre de servicio: ${activityMap.investigatedService.serviceName}
Estado: ${activityMap.investigatedService.state}
Tipo de inicio: ${activityMap.investigatedService.startType}
Descripción: ${activityMap.investigatedService.description}

6. TAREA PROGRAMADA Y ACTIVIDAD DIFERIDA
------------------------------------------------------------
Tarea: ${activityMap.investigatedTask.taskName}
Origen: ${activityMap.investigatedTask.apparentOrigin}
Estado: ${activityMap.investigatedTask.state}
Vigilancia 2 minutos: ${activityMap.investigatedTask.twoMinWatchResult}
Detalles de actividad: ${activityMap.investigatedTask.detectedProcessOrActivity || 'Ninguno relevante'}

7. CONEXIÓN DE RED AUDITADA
------------------------------------------------------------
Evaluada: ${activityMap.investigatedNetwork.evaluated ? 'SÍ' : 'NO (Omitida deliberadamente)'}
Proceso: ${activityMap.investigatedNetwork.processName || 'N/A'} (PID: ${activityMap.investigatedNetwork.owningPid || 'N/A'})
Dirección remota: ${activityMap.investigatedNetwork.remoteAddress || 'N/A'}
Estado: ${activityMap.investigatedNetwork.status}
Notas: ${activityMap.investigatedNetwork.contextNotes || 'N/A'}

============================================================
PRINCIPIO EVO: OPTIMIZAR ES ELIMINAR TRABAJO INNECESARIO
SIN ROMPER EL TRABAJO NECESARIO.
============================================================`;
  };

  const handleCopyTxt = () => {
    navigator.clipboard.writeText(formatPlainText());
    setCopiedTxt(true);
    setTimeout(() => setCopiedTxt(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([formatPlainText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `MAPA_DE_ACTIVIDAD_EVO_001_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJson = () => {
    const payload = {
      schemaVersion: 1,
      generatedAt: activityMap.registeredAt,
      artifact: 'MAPA_DE_ACTIVIDAD_EVO_001',
      hardwareSpecs: specs,
      activityMap,
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = `MAPA_DE_ACTIVIDAD_EVO_001_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      id="artefacto-mapa-actividad-evo-001"
      className="p-6 sm:p-8 rounded-3xl bg-[#0e1014] border-2 border-yellow-400/80 shadow-2xl space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-yellow-400 tracking-widest mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span>ARTEFACTO OFICIAL // EXPEDIENTE EVO</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            MAPA DE ACTIVIDAD EVO 001
          </h3>
          <span className="font-mono-tech text-xs text-zinc-400">
            REGISTRADO: {activityMap.registeredAt} // WINDOWS EN MOVIMIENTO
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs">
          <button
            type="button"
            onClick={handleCopyTxt}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-yellow-400/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedTxt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTxt ? 'Copiado' : 'Copiar TXT'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-yellow-400/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-yellow-400" />
            <span>Descargar .TXT</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadJson}
            className="px-3 py-2 rounded-xl bg-yellow-400 text-black font-bold uppercase hover:bg-yellow-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Exportar .JSON</span>
          </button>
        </div>
      </div>

      {/* Grid of Synthesis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-tech text-xs">
        {/* 1. Línea Base */}
        <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-yellow-400 font-bold block text-[11px] uppercase">
            1. LÍNEA BASE REPOSO
          </span>
          <div className="space-y-1 text-zinc-300">
            <p>CPU: <strong className="text-white">{activityMap.baseline.cpuPct}%</strong></p>
            <p>RAM: <strong className="text-white">{activityMap.baseline.ramUsedGb} GB</strong></p>
            <p>Disco: <strong className="text-white">{activityMap.baseline.diskPct}%</strong></p>
            <p>Procesos: <strong className="text-white">{activityMap.baseline.processCount}</strong></p>
            <p className="text-[11px] text-zinc-400 truncate mt-1">
              Top: {activityMap.baseline.topConsumer}
            </p>
          </div>
        </div>

        {/* 2. Proceso y Servicio */}
        <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-sky-400 font-bold block text-[11px] uppercase">
            2. PERITAJE DE KERNEL
          </span>
          <div className="space-y-1 text-zinc-300">
            <p className="truncate">Proceso: <strong className="text-white">{activityMap.investigatedProcess.name}</strong></p>
            <p>PID: <strong className="text-yellow-400">{activityMap.investigatedProcess.pid}</strong></p>
            <p>Firma: <strong className="text-emerald-400">{activityMap.investigatedProcess.signature}</strong></p>
            <p className="truncate">Servicio: <strong className="text-white">{activityMap.investigatedService.visibleName}</strong></p>
            <p className="text-[11px] text-zinc-400">
              Inicio: {activityMap.investigatedService.startType}
            </p>
          </div>
        </div>

        {/* 3. Tarea y Red */}
        <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-emerald-400 font-bold block text-[11px] uppercase">
            3. DIFERIDO Y CONEXIÓN
          </span>
          <div className="space-y-1 text-zinc-300">
            <p className="truncate">Tarea: <strong className="text-white">{activityMap.investigatedTask.taskName}</strong></p>
            <p className="text-[11px]">Vigilancia: <strong className="text-white">{activityMap.investigatedTask.twoMinWatchResult}</strong></p>
            <p>Red: <strong className={activityMap.investigatedNetwork.evaluated ? 'text-emerald-400' : 'text-zinc-500'}>
              {activityMap.investigatedNetwork.evaluated ? activityMap.investigatedNetwork.status : 'NO EVALUADA'}
            </strong></p>
            <p className="text-[11px] text-zinc-400">
              Apps inicio activas: {activityMap.startup.enabled} de {activityMap.startup.total}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
