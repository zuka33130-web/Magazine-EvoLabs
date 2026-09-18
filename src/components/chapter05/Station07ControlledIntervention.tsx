import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Layers,
} from 'lucide-react';
import {
  ControlledInterventionData,
  OptimizationInterventionType,
  OptimizationMetricsSnapshot,
} from '../../types';

const DEFAULT_INTERVENTION: ControlledInterventionData = {
  interventionType: 'CERRAR_LAUNCHER_SECUNDARIO',
  targetName: 'Epic Games Launcher + Sincronización en la nube',
  reason:
    'No se utiliza durante la partida. Consume 450 MB de memoria de trabajo y sondea periódicamente la red.',
  reversible: true,
  howToRevert:
    'Volver a abrir el launcher desde el menú de inicio y reanudar sincronización.',
  before: {
    processes: 108,
    ramGb: 5.4,
    fps: 171,
    onePctLow: 118,
  },
  after: {
    processes: 96,
    ramGb: 4.8,
    fps: 174,
    onePctLow: 132,
  },
  delta: {
    processes: 12,
    ramGb: 0.6,
    fps: 3,
    onePctLow: 14,
  },
  interpretation: 'MEJORA_PRINCIPALMENTE_ESTABILIDAD',
  decision: 'CONSERVAR_CAMBIO',
};

interface Station07ControlledInterventionProps {
  initialData?: ControlledInterventionData;
  onSaveIntervention: (data: ControlledInterventionData) => void;
  onNextStation: () => void;
}

export const Station07ControlledIntervention: React.FC<Station07ControlledInterventionProps> = ({
  initialData,
  onSaveIntervention,
  onNextStation,
}) => {
  const [data, setData] = useState<ControlledInterventionData>({
    ...DEFAULT_INTERVENTION,
    ...(initialData || {}),
    before: { ...DEFAULT_INTERVENTION.before, ...(initialData?.before || {}) },
    after: { ...DEFAULT_INTERVENTION.after, ...(initialData?.after || {}) },
    delta: { ...DEFAULT_INTERVENTION.delta, ...(initialData?.delta || {}) },
  });

  const handleUpdate = (field: keyof ControlledInterventionData, value: any) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto compute deltas
      const ramDelta = Number((next.before.ramGb - next.after.ramGb).toFixed(2));
      const procDelta = next.before.processes - next.after.processes;
      const fpsDelta =
        next.before.fps !== undefined && next.after.fps !== undefined
          ? next.after.fps - next.before.fps
          : undefined;
      const oneLowDelta =
        next.before.onePctLow !== undefined && next.after.onePctLow !== undefined
          ? next.after.onePctLow - next.before.onePctLow
          : undefined;

      next.delta = {
        ramGb: ramDelta,
        processes: procDelta,
        fps: fpsDelta,
        onePctLow: oneLowDelta,
      };

      return next;
    });
  };

  const handleBeforeChange = (key: keyof OptimizationMetricsSnapshot, value: any) => {
    setData((prev) => {
      const newBefore = { ...prev.before, [key]: value };
      const ramDelta = Number((newBefore.ramGb - prev.after.ramGb).toFixed(2));
      const procDelta = newBefore.processes - prev.after.processes;
      const fpsDelta =
        newBefore.fps !== undefined && prev.after.fps !== undefined
          ? prev.after.fps - newBefore.fps
          : undefined;
      const oneLowDelta =
        newBefore.onePctLow !== undefined && prev.after.onePctLow !== undefined
          ? prev.after.onePctLow - newBefore.onePctLow
          : undefined;

      return {
        ...prev,
        before: newBefore,
        delta: {
          ramGb: ramDelta,
          processes: procDelta,
          fps: fpsDelta,
          onePctLow: oneLowDelta,
        },
      };
    });
  };

  const handleAfterChange = (key: keyof OptimizationMetricsSnapshot, value: any) => {
    setData((prev) => {
      const newAfter = { ...prev.after, [key]: value };
      const ramDelta = Number((prev.before.ramGb - newAfter.ramGb).toFixed(2));
      const procDelta = prev.before.processes - newAfter.processes;
      const fpsDelta =
        prev.before.fps !== undefined && newAfter.fps !== undefined
          ? newAfter.fps - prev.before.fps
          : undefined;
      const oneLowDelta =
        prev.before.onePctLow !== undefined && newAfter.onePctLow !== undefined
          ? newAfter.onePctLow - prev.before.onePctLow
          : undefined;

      return {
        ...prev,
        after: newAfter,
        delta: {
          ramGb: ramDelta,
          processes: procDelta,
          fps: fpsDelta,
          onePctLow: oneLowDelta,
        },
      };
    });
  };

  const handleSaveAndProceed = () => {
    onSaveIntervention(data);
    onNextStation();
  };

  return (
    <section
      id="estacion-07-intervencion-controlada"
      className="p-6 sm:p-8 rounded-3xl bg-[#0f1015] border border-zinc-800 shadow-2xl space-y-8 relative overflow-hidden"
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-zinc-400">
          <span className="text-yellow-400 font-bold">ESTACIÓN 07 // 08</span>
          <span>•</span>
          <span>LABORATORIO EXPERIMENTAL</span>
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight">
          07 // INTERVENCIÓN CONTROLADA
        </h2>
        <p className="font-sans-editorial text-base sm:text-lg text-zinc-300 italic">
          “No vamos a 'optimizar Windows'. Vamos a modificar una sola cosa, medir el efecto exacto y decidir con evidencia.”
        </p>
      </div>

      {/* Nuevo Principio EVO */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-transparent border-l-4 border-yellow-400 space-y-2">
        <span className="font-mono-tech text-xs uppercase font-bold text-yellow-400 tracking-wider block">
          NUEVO PRINCIPIO EVO // OPTIMIZACIÓN CIENTÍFICA
        </span>
        <p className="font-sans-editorial text-base sm:text-lg text-white font-medium italic leading-relaxed">
          “Optimizar no es desactivar más cosas. Optimizar es eliminar trabajo innecesario sin romper el trabajo necesario.”
        </p>
        <p className="font-mono-tech text-xs text-zinc-400">
          Una optimización que no mejora tu propia medición no se convierte automáticamente en una buena optimización.
        </p>
      </div>

      {/* Permitido vs Prohibido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/30 space-y-2">
          <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> INTERVENCIONES VÁLIDAS Y SEGURAS
          </span>
          <ul className="list-disc pl-4 space-y-1 text-zinc-300 font-sans-editorial text-xs leading-relaxed">
            <li>Cerrar navegadores web con múltiples pestañas y consumo de memoria.</li>
            <li>Deshabilitar un launcher o actualizador secundario del inicio.</li>
            <li>Pausar la sincronización de archivos en la nube mientras jugás.</li>
            <li>Desactivar overlays de captura que no estés utilizando.</li>
          </ul>
        </div>

        <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/30 space-y-2">
          <span className="text-rose-400 font-bold uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> INTERVENCIONES PROHIBIDAS (RUPTURA)
          </span>
          <ul className="list-disc pl-4 space-y-1 text-zinc-300 font-sans-editorial text-xs leading-relaxed">
            <li>Desactivar Windows Defender o antivirus del sistema.</li>
            <li>Borrar servicios del núcleo de Windows o controladores de audio/red.</li>
            <li>Ejecutar archivos .reg de tweaks no verificados de internet.</li>
            <li>Usar 'debloaters' masivos que destruyen dependencias del sistema.</li>
          </ul>
        </div>
      </div>

      {/* Configuración de la Intervención */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/30 space-y-4 font-mono-tech text-xs">
        <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase">
          <Sliders className="w-4 h-4" />
          <span>DECLARACIÓN DE LA VARIABLE A MODIFICAR</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-zinc-400 block font-bold mb-1">TIPO DE INTERVENCIÓN</label>
            <select
              value={data.interventionType}
              onChange={(e) => handleUpdate('interventionType', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="CERRAR_LAUNCHER_SECUNDARIO">CERRAR LAUNCHER SECUNDARIO</option>
              <option value="DESHABILITAR_INICIO">DESHABILITAR APP PRESCINDIBLE DE INICIO</option>
              <option value="PAUSAR_SINCRONIZACION">PAUSAR SINCRONIZACIÓN EN NUBE</option>
              <option value="CERRAR_NAVEGADOR">CERRAR NAVEGADOR WEB (RAM/CPU)</option>
              <option value="DESACTIVAR_OVERLAY">DESACTIVAR OVERLAY SECUNDARIO</option>
              <option value="CERRAR_CAPTURA">CERRAR CAPTURA EN SEGUNDO PLANO</option>
              <option value="CERRAR_APP_USUARIO">CERRAR APLICACIÓN DE USUARIO</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block font-bold mb-1">ELEMENTO OBJETIVO</label>
            <input
              type="text"
              value={data.targetName}
              onChange={(e) => handleUpdate('targetName', e.target.value)}
              placeholder="Ej. Epic Games Launcher / Google Drive / Discord"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="text-zinc-400 block font-bold mb-1">CÓMO REVERTIR EL CAMBIO</label>
            <input
              type="text"
              value={data.howToRevert}
              onChange={(e) => handleUpdate('howToRevert', e.target.value)}
              placeholder="Ej. Volver a abrir la app o reanudar sincronización"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-emerald-400 text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div>
          <label className="text-zinc-400 block font-bold mb-1">MOTIVO TÉCNICO DE LA PRUEBA</label>
          <input
            type="text"
            value={data.reason}
            onChange={(e) => handleUpdate('reason', e.target.value)}
            placeholder="Ej. Liberar memoria RAM en reposo y evitar que verifique actualizaciones mientras juego."
            className="w-full bg-black/60 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      {/* Mediciones ANTES vs DESPUÉS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono-tech text-xs">
        {/* Panel ANTES */}
        <div className="p-5 rounded-2xl bg-black/40 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-zinc-300 uppercase">ESTADO ANTES (LÍNEA BASE)</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 font-bold">
              SIN INTERVENIR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">PROCESOS ACTIVOS</label>
              <input
                type="number"
                value={data.before.processes}
                onChange={(e) => handleBeforeChange('processes', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">RAM REPOSO (GB)</label>
              <input
                type="number"
                step="0.1"
                value={data.before.ramGb}
                onChange={(e) => handleBeforeChange('ramGb', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">FPS PROMEDIO (JUEGO)</label>
              <input
                type="number"
                value={data.before.fps ?? 171}
                onChange={(e) => handleBeforeChange('fps', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">1% LOW (ESTABILIDAD)</label>
              <input
                type="number"
                value={data.before.onePctLow ?? 118}
                onChange={(e) => handleBeforeChange('onePctLow', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Panel DESPUÉS */}
        <div className="p-5 rounded-2xl bg-[#14151c] border border-yellow-400/40 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-yellow-400 uppercase">ESTADO DESPUÉS (INTERVENIDO)</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-400/10 text-yellow-400 font-bold border border-yellow-400/30">
              MODIFICACIÓN ACTIVA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">PROCESOS ACTIVOS</label>
              <input
                type="number"
                value={data.after.processes}
                onChange={(e) => handleAfterChange('processes', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">RAM REPOSO (GB)</label>
              <input
                type="number"
                step="0.1"
                value={data.after.ramGb}
                onChange={(e) => handleAfterChange('ramGb', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">FPS PROMEDIO (JUEGO)</label>
              <input
                type="number"
                value={data.after.fps ?? 176}
                onChange={(e) => handleAfterChange('fps', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-yellow-400 font-bold text-lg focus:outline-none"
              />
            </div>
            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
              <label className="text-zinc-500 block text-[10px]">1% LOW (ESTABILIDAD)</label>
              <input
                type="number"
                value={data.after.onePctLow ?? 134}
                onChange={(e) => handleAfterChange('onePctLow', Number(e.target.value) || 0)}
                className="w-full bg-transparent text-emerald-400 font-bold text-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cálculo de Deltas */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121319] to-black border border-yellow-400/40 space-y-4 font-mono-tech text-xs">
        <span className="font-bold text-yellow-400 uppercase block tracking-wider">
          RESULTADOS EMPÍRICOS // DELTAS CALCULADOS
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">RAM LIBERADA</span>
            <span className="text-emerald-400 font-bold text-base block mt-0.5">
              {data.delta.ramGb > 0 ? `+${data.delta.ramGb}` : data.delta.ramGb} GB
            </span>
            <span className="text-[10px] text-zinc-500">
              {data.before.ramGb} GB → {data.after.ramGb} GB
            </span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">PROCESOS ELIMINADOS</span>
            <span className="text-emerald-400 font-bold text-base block mt-0.5">
              {data.delta.processes > 0 ? `-${data.delta.processes}` : data.delta.processes}
            </span>
            <span className="text-[10px] text-zinc-500">
              {data.before.processes} → {data.after.processes}
            </span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">DELTA FPS PROMEDIO</span>
            <span className="text-yellow-400 font-bold text-base block mt-0.5">
              {data.delta.fps !== undefined
                ? data.delta.fps >= 0
                  ? `+${data.delta.fps} FPS`
                  : `${data.delta.fps} FPS`
                : 'N/A'}
            </span>
            <span className="text-[10px] text-zinc-500">
              Cambio promedio modesto
            </span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block text-[10px]">DELTA 1% LOW (PULSO)</span>
            <span className="text-emerald-400 font-bold text-base block mt-0.5">
              {data.delta.onePctLow !== undefined
                ? data.delta.onePctLow >= 0
                  ? `+${data.delta.onePctLow} FPS`
                  : `${data.delta.onePctLow} FPS`
                : 'N/A'}
            </span>
            <span className="text-[10px] text-zinc-500">
              Mejora de cadencia mínima
            </span>
          </div>
        </div>
      </div>

      {/* Interpretación Honesta & Decisión */}
      <div className="p-5 rounded-2xl bg-[#14151c] border border-zinc-800 space-y-4 font-mono-tech text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-zinc-400 block font-bold mb-1.5">
              INTERPRETACIÓN TÉCNICA HONESTA
            </label>
            <select
              value={data.interpretation}
              onChange={(e) => handleUpdate('interpretation', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="MEJORA_MEDIBLE">MEJORA MEDIBLE // Beneficio comprobado</option>
              <option value="MEJORA_PRINCIPALMENTE_ESTABILIDAD">
                MEJORA EN ESTABILIDAD // 1% Low subió, FPS promedio cambió poco
              </option>
              <option value="CAMBIO_PEQUEÑO">CAMBIO PEQUEÑO // Margen de error</option>
              <option value="SIN_DIFERENCIA_RELEVANTE">SIN DIFERENCIA RELEVANTE OBSERVABLE</option>
              <option value="EMPEORO">EMPEORÓ // Rendimiento o estabilidad inferior</option>
              <option value="EVIDENCIA_INSUFICIENTE">EVIDENCIA INSUFICIENTE // Requiere más corridas</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block font-bold mb-1.5">
              DECISIÓN PERICIAL BASADA EN RESULTADOS
            </label>
            <select
              value={data.decision}
              onChange={(e) => handleUpdate('decision', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-yellow-400 font-bold text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="CONSERVAR_CAMBIO">CONSERVAR CAMBIO // Validado empíricamente</option>
              <option value="REVERTIR_CAMBIO">REVERTIR CAMBIO // Sin beneficio o molesto</option>
              <option value="SEGUIR_INVESTIGANDO">SEGUIR INVESTIGANDO // Prueba no concluyente</option>
            </select>
          </div>
        </div>
      </div>

      {/* TIP EVO // RAM */}
      <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono-tech space-y-1">
          <span className="font-bold text-yellow-400 block">
            TIP EVO // RAM LIBERADA != MÁS FPS DIRECTOS
          </span>
          <p className="text-zinc-300 font-sans-editorial leading-relaxed">
            Si un juego solicita 6 GB de memoria y tu equipo dispone de 16 GB, tener 10 GB libres en
            lugar de 9 GB no aumentará la velocidad de cálculo de la GPU. Sin embargo, cerrar procesos
            que despiertan esporádicamente evita que tu procesador sufra <em>interrupciones de contexto</em>{' '}
            (context switching), estabilizando directamente el <strong>1% Low</strong>.
          </p>
        </div>
      </div>

      {/* Action to proceed */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          id="btn-guardar-intervencion"
          onClick={handleSaveAndProceed}
          className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase transition-all shadow-lg hover:shadow-yellow-400/20 cursor-pointer"
        >
          GUARDAR INTERVENCIÓN CONTROLADA // CONTINUAR A ESTACIÓN 08 →
        </button>
      </div>
    </section>
  );
};
