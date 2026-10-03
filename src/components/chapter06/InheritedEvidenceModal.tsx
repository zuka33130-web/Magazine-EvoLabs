import React from 'react';
import { X, CheckCircle2, AlertCircle, FileText, Cpu, Activity, Gauge, Zap } from 'lucide-react';
import { UserPcSpec, FluidezProfileData, AbExperimentData, ActivityMapData, OptimizationLogData } from '../../types';

interface InheritedEvidenceModalProps {
  onClose: () => void;
  specs: Partial<UserPcSpec>;
  fluidezData: (FluidezProfileData & Record<string, any>) | null;
  limitationData: AbExperimentData | null;
  activityMap: ActivityMapData | null;
  optimizationLog: OptimizationLogData | null;
}

export const InheritedEvidenceModal: React.FC<InheritedEvidenceModalProps> = ({
  onClose,
  specs,
  fluidezData,
  limitationData,
  activityMap,
  optimizationLog,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="modal-evidencia-heredada"
        className="max-w-3xl w-full max-h-[90vh] flex flex-col rounded-3xl bg-[#0f1015] border border-zinc-700 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-black/40">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-yellow-400" />
            <div>
              <span className="font-mono-tech text-[10px] text-zinc-400 uppercase tracking-widest block">
                EXPEDIENTE ACUMULADO // TOMO 01
              </span>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                EVIDENCIA HEREDADA (CAPÍTULOS 01 A 05)
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono-tech text-xs text-zinc-300">
          <p className="font-sans-editorial text-sm text-zinc-400 leading-relaxed">
            En un taller profesional, la historia previa del equipo ahorra horas de diagnóstico a ciegas.
            Aquí tenés el resumen de lo que tu propia PC ya nos demostró en los capítulos anteriores:
          </p>

          {/* 1. Pasaporte EVO (Cap 01) */}
          <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-yellow-400" />
                CAPÍTULO 01 // PASAPORTE EVO (HARDWARE CONFIRMADO)
              </span>
              {specs?.cpu || specs?.gpu ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMADO
                </span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> PENDIENTE
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">CPU</span>
                <span className="text-white font-bold">{specs?.cpu || 'No registrado aún'}</span>
              </div>
              <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">RAM</span>
                <span className="text-white font-bold">{specs?.ram || 'No registrado aún'}</span>
              </div>
              <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">GPU</span>
                <span className="text-white font-bold">{specs?.gpu || 'No registrado aún'}</span>
              </div>
              <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">ALMACENAMIENTO</span>
                <span className="text-white font-bold">{specs?.storage || 'No registrado aún'}</span>
              </div>
            </div>
          </div>

          {/* 2. Perfil de Fluidez (Cap 03) */}
          <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-bold flex items-center gap-2">
                <Gauge className="w-4 h-4 text-yellow-400" />
                CAPÍTULO 03 // PERFIL DE FLUIDEZ EVO 001
              </span>
              {fluidezData ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMADO
                </span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> PENDIENTE
                </span>
              )}
            </div>

            {fluidezData ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">JUEGO BASE</span>
                  <span className="text-white font-bold">{fluidezData.game}</span>
                </div>
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">FPS PROMEDIO</span>
                  <span className="text-white font-bold">{fluidezData.fpsAvg || '—'}</span>
                </div>
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">1% LOW</span>
                  <span className="text-white font-bold">{fluidezData.onePctLow || '—'}</span>
                </div>
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">VARIABILIDAD</span>
                  <span className="text-yellow-400 font-bold">{fluidezData.variability || 'OBSERVADA'}</span>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-[11px]">No se completó la prueba de fluidez en Capítulo 03.</p>
            )}
          </div>

          {/* 3. Matriz de Limitación (Cap 04) */}
          <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                CAPÍTULO 04 // MATRIZ DE LIMITACIÓN EVO 001
              </span>
              {limitationData ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> IDENTIFICADA
                </span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> PENDIENTE
                </span>
              )}
            </div>

            {limitationData ? (
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-[11px] space-y-1">
                <span className="text-zinc-500 block text-[10px]">EXPERIMENTO A/B RESUELTO:</span>
                <p className="text-zinc-300">
                  Prueba controlada de resolución/frecuencia para aislar limitación de CPU vs GPU.
                </p>
              </div>
            ) : (
              <p className="text-zinc-500 text-[11px]">No se completó la prueba de limitación en Capítulo 04.</p>
            )}
          </div>

          {/* 4. Mapa de Actividad & Registro (Cap 05) */}
          <div className="p-4 rounded-2xl bg-black/50 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                CAPÍTULO 05 // MAPA DE ACTIVIDAD & REGISTRO DE OPTIMIZACIÓN
              </span>
              {activityMap || optimizationLog ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AUDITADO
                </span>
              ) : (
                <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> PENDIENTE
                </span>
              )}
            </div>

            {activityMap?.baseline ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">PROCESOS REPOSO</span>
                  <span className="text-white font-bold">{activityMap.baseline.processCount}</span>
                </div>
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">RAM REPOSO</span>
                  <span className="text-white font-bold">{activityMap.baseline.ramUsedGb} GB</span>
                </div>
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">CPU REPOSO</span>
                  <span className="text-white font-bold">{activityMap.baseline.cpuPct}%</span>
                </div>
                <div className="p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px]">TOP CONSUMIDOR</span>
                  <span className="text-yellow-400 font-bold truncate block">{activityMap.baseline.topConsumer || 'Identificado'}</span>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-[11px]">No se completó la auditoría de fondo de Windows en Capítulo 05.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-black/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            VOLVER AL TALLER
          </button>
        </div>
      </div>
    </div>
  );
};
