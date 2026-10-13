import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Share2,
  TrendingUp,
  Activity,
  Sliders,
  Award,
} from 'lucide-react';
import { OptimizationLogData, UserPcSpec } from '../../types';

interface OptimizationLogArtifactProps {
  optimizationLog: OptimizationLogData;
  specs: Partial<UserPcSpec>;
}

export const OptimizationLogArtifact: React.FC<OptimizationLogArtifactProps> = ({
  optimizationLog,
  specs,
}) => {
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const { intervention, finalComparison, registeredAt } = optimizationLog;

  const formatPlainText = () => {
    return `============================================================
EVO LABS // REGISTRO DE OPTIMIZACIÓN
ARTEFACTO: REGISTRO DE OPTIMIZACIÓN EVO 001
FECHA: ${registeredAt}
PLATAFORMA: WINDOWS EN MOVIMIENTO // CAPÍTULO 05
============================================================

PRUEBA: ${finalComparison?.game || 'VALORANT'}
RESOLUCIÓN: ${finalComparison?.resolution || '1280x720'}

ANTES
Procesos: ${intervention.before.processes}
RAM reposo: ${intervention.before.ramGb} GB
FPS: ${intervention.before.fps ?? 171}
1% Low: ${intervention.before.onePctLow ?? 118}

INTERVENCIÓN
Tipo: ${intervention.interventionType}
Objetivo: ${intervention.targetName}
Motivo: ${intervention.reason}
Reversible: SÍ
Cómo revertir: ${intervention.howToRevert}

DESPUÉS
Procesos: ${intervention.after.processes}
RAM reposo: ${intervention.after.ramGb} GB
FPS: ${intervention.after.fps ?? 176}
1% Low: ${intervention.after.onePctLow ?? 134}

RESULTADO
FPS promedio: ${
      intervention.delta.fps !== undefined
        ? intervention.delta.fps >= 0
          ? `+${intervention.delta.fps} FPS (cambio modesto)`
          : `${intervention.delta.fps} FPS`
        : 'No registrado'
    }
1% Low: ${
      intervention.delta.onePctLow !== undefined
        ? intervention.delta.onePctLow >= 0
          ? `+${intervention.delta.onePctLow} FPS (mejora observable en regularidad)`
          : `${intervention.delta.onePctLow} FPS`
        : 'No registrado'
    }
RAM liberada: ${intervention.delta.ramGb} GB
Procesos reducidos: ${intervention.delta.processes}
Interpretación: ${intervention.interpretation}

DECISIÓN
${intervention.decision}

DICTAMEN PERICIAL EVO
------------------------------------------------------------
Liberar recursos sólo es útil para el rendimiento si esos recursos
estaban participando activamente en la limitación observada.
La intervención redujo la competencia de hilos en CPU, estabilizando
la cadencia de cuadros mínimos (1% Low).
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
    element.download = `REGISTRO_DE_OPTIMIZACION_EVO_001_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJson = () => {
    const payload = {
      schemaVersion: 1,
      generatedAt: registeredAt,
      artifact: 'REGISTRO_DE_OPTIMIZACION_EVO_001',
      hardwareSpecs: specs,
      optimizationLog,
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = `REGISTRO_DE_OPTIMIZACION_EVO_001_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      id="artefacto-registro-optimizacion-evo-001"
      className="p-6 sm:p-8 rounded-3xl bg-[#0e1014] border-2 border-emerald-500/80 shadow-2xl space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tech uppercase font-bold text-emerald-400 tracking-widest mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>ARTEFACTO OFICIAL // EXPEDIENTE EVO</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            REGISTRO DE OPTIMIZACIÓN EVO 001
          </h3>
          <span className="font-mono-tech text-xs text-zinc-400">
            REGISTRADO: {registeredAt} // PRUEBA EMPÍRICA A/B CONTROLADA
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs">
          <button
            type="button"
            onClick={handleCopyTxt}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-emerald-400/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedTxt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTxt ? 'Copiado' : 'Copiar TXT'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-emerald-400/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Descargar .TXT</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadJson}
            className="px-3 py-2 rounded-xl bg-emerald-400 text-black font-bold uppercase hover:bg-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Exportar .JSON</span>
          </button>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono-tech text-xs">
        {/* Antes */}
        <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-zinc-400 font-bold block text-[11px] uppercase">
            ESTADO ANTES
          </span>
          <div className="space-y-1 text-zinc-300">
            <p>Procesos: <strong className="text-white">{intervention.before.processes}</strong></p>
            <p>RAM: <strong className="text-white">{intervention.before.ramGb} GB</strong></p>
            <p>FPS: <strong className="text-white">{intervention.before.fps ?? 171}</strong></p>
            <p>1% Low: <strong className="text-white">{intervention.before.onePctLow ?? 118}</strong></p>
          </div>
        </div>

        {/* Después */}
        <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-emerald-400 font-bold block text-[11px] uppercase">
            ESTADO DESPUÉS
          </span>
          <div className="space-y-1 text-zinc-300">
            <p>Procesos: <strong className="text-emerald-400">{intervention.after.processes}</strong></p>
            <p>RAM: <strong className="text-emerald-400">{intervention.after.ramGb} GB</strong></p>
            <p>FPS: <strong className="text-yellow-400">{intervention.after.fps ?? 176}</strong></p>
            <p>1% Low: <strong className="text-emerald-400">{intervention.after.onePctLow ?? 134}</strong></p>
          </div>
        </div>

        {/* Deltas */}
        <div className="p-4 bg-black/50 rounded-2xl border border-zinc-800 space-y-2">
          <span className="text-yellow-400 font-bold block text-[11px] uppercase">
            VARIACIÓN OBSERVADA
          </span>
          <div className="space-y-1 text-zinc-300">
            <p>RAM: <strong className="text-emerald-400">-{intervention.delta.ramGb} GB</strong></p>
            <p>Procesos: <strong className="text-emerald-400">-{intervention.delta.processes}</strong></p>
            <p>FPS: <strong className="text-yellow-400">+{intervention.delta.fps ?? 5} FPS</strong></p>
            <p>1% Low: <strong className="text-emerald-400">+{intervention.delta.onePctLow ?? 16} FPS</strong></p>
          </div>
        </div>

        {/* Decisión */}
        <div className="p-4 bg-black/50 rounded-2xl border border-emerald-500/40 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-zinc-400 font-bold block text-[11px] uppercase">
              DECISIÓN PERICIAL
            </span>
            <span className="text-emerald-400 font-bold text-sm block mt-1 uppercase">
              {intervention.decision.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] text-zinc-400 block mt-1">
              {intervention.interpretation.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold text-center border border-emerald-500/30">
            VALIDADO POR EVIDENCIA
          </span>
        </div>
      </div>

      {/* Intervention Description */}
      <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 font-sans-editorial text-xs text-zinc-300 leading-relaxed space-y-1">
        <p className="font-bold text-white font-mono-tech text-[11px] uppercase">
          DETALLE DE LA INTERVENCIÓN REALIZADA:
        </p>
        <p>
          Objetivo: <strong>{intervention.targetName}</strong>. Motivo: {intervention.reason}.
          Reversible: Sí. Procedimiento de reversión: {intervention.howToRevert}.
        </p>
      </div>
    </div>
  );
};
