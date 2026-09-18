import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Cpu,
  Monitor,
  HardDrive,
  X,
  Gauge,
  Sliders,
  ShieldCheck,
  Target,
} from 'lucide-react';
import {
  UserPcSpec,
  Lab02ExperimentData,
  FluidezProfileData,
  LimitationMatrixData,
  AbExperimentData,
} from '../../types';

interface ExpedienteAcumuladoC05BannerProps {
  specs: Partial<UserPcSpec>;
  hasPassport: boolean;
  flowData: Lab02ExperimentData | null;
  hasFlowMap: boolean;
  fluidezData: FluidezProfileData | null;
  hasFluidez: boolean;
  matrixData: LimitationMatrixData | null;
  hasMatrix: boolean;
  abExperiment?: AbExperimentData | null;
  onOpenChapter01?: () => void;
  onOpenChapter02?: () => void;
  onOpenChapter03?: () => void;
  onOpenChapter04?: () => void;
}

export const ExpedienteAcumuladoC05Banner: React.FC<ExpedienteAcumuladoC05BannerProps> = ({
  specs,
  hasPassport,
  flowData,
  hasFlowMap,
  fluidezData,
  hasFluidez,
  matrixData,
  hasMatrix,
  abExperiment,
  onOpenChapter01,
  onOpenChapter02,
  onOpenChapter03,
  onOpenChapter04,
}) => {
  const [activeModal, setActiveModal] = useState<
    'passport' | 'flow' | 'fluidez' | 'matrix' | null
  >(null);

  return (
    <>
      <div
        id="expediente-acumulado-c05-banner"
        className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-yellow-400/40 shadow-xl space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-400 via-amber-500 to-sky-500 opacity-90" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-mono-tech uppercase font-bold tracking-widest text-yellow-400">
              EXPEDIENTE ACUMULADO // EVIDENCIA PREVIA VINCULADA
            </span>
          </div>
          <span className="text-[11px] font-mono-tech text-zinc-400 uppercase">
            CAPÍTULOS 01, 02, 03 Y 04 HEREDADOS
          </span>
        </div>

        {/* 4 Dossier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* C01: Pasaporte */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                <span className="text-yellow-400 font-bold">CAP 01 // HARDWARE</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVO
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-yellow-400" />
                Pasaporte EVO
              </h4>
              <p className="font-mono-tech text-xs text-zinc-300 mt-1 truncate">
                {specs.cpu || 'CPU no especificada'}
              </p>
              <p className="font-mono-tech text-[11px] text-zinc-500 truncate">
                GPU: {specs.gpu || 'GPU no especificada'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('passport')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white font-mono-tech text-[11px] font-bold uppercase transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Inspeccionar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* C02: Mapa de Flujo */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                <span className="text-yellow-400 font-bold">CAP 02 // BUS & FLUJO</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVO
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-yellow-400" />
                Mapa de Flujo 001
              </h4>
              <p className="font-mono-tech text-xs text-zinc-300 mt-1 truncate">
                Carga: {flowData?.workload || 'Carga general evaluada'}
              </p>
              <p className="font-mono-tech text-[11px] text-zinc-500 truncate">
                RAM observada: {flowData?.measurements?.activity?.ramUsedGb ?? '5.4'} GB
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('flow')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white font-mono-tech text-[11px] font-bold uppercase transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Inspeccionar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* C03: Perfil de Fluidez */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                <span className="text-yellow-400 font-bold">CAP 03 // CADENCIA</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVO
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-yellow-400" />
                Perfil de Fluidez 001
              </h4>
              <p className="font-mono-tech text-xs text-zinc-300 mt-1 truncate">
                {fluidezData?.game || 'Juego evaluado'} ({fluidezData?.resolution || '1080p'})
              </p>
              <p className="font-mono-tech text-[11px] text-zinc-500 truncate">
                FPS: {fluidezData?.fpsHabituales ?? 171} | 1% Low: {fluidezData?.telemetry?.onePercentLow ?? 118}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('fluidez')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white font-mono-tech text-[11px] font-bold uppercase transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Inspeccionar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* C04: Matriz de Limitación */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                <span className="text-yellow-400 font-bold">CAP 04 // LÍMITE</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVO
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-1.5">
                <Target className="w-4 h-4 text-yellow-400" />
                Matriz Límite 001
              </h4>
              <p className="font-mono-tech text-xs text-zinc-300 mt-1 truncate">
                Limitante: {matrixData?.primaryLimiter || 'GPU-BOUND / RENDERIZADO'}
              </p>
              <p className="font-mono-tech text-[11px] text-zinc-500 truncate">
                Confianza: {matrixData?.confidenceScore || 'ALTA'} (Ensayo A/B)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('matrix')}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white font-mono-tech text-[11px] font-bold uppercase transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Inspeccionar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Pasaporte Técnico */}
      {activeModal === 'passport' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#16171d] border border-yellow-400 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold text-lg text-white uppercase">
                  PASAPORTE TÉCNICO EVO // CAPÍTULO 01
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">PROCESADOR (CPU)</span>
                <span className="text-white font-bold">{specs.cpu || 'No registrada'}</span>
                <span className="text-zinc-400 block mt-1">
                  Núcleos: {specs.cpuCores ?? '8'} | Hilos: {specs.cpuThreads ?? '16'}
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">GRÁFICOS (GPU)</span>
                <span className="text-white font-bold">{specs.gpu || 'No registrada'}</span>
                <span className="text-zinc-400 block mt-1">
                  VRAM: {specs.vramGb ? `${specs.vramGb} GB` : 'Compartida / Dedicada'}
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">MEMORIA RAM</span>
                <span className="text-white font-bold">{specs.ramGb ? `${specs.ramGb} GB` : '16 GB'}</span>
                <span className="text-zinc-400 block mt-1">
                  Topología: {specs.ramChannelMode || 'Dual Channel'}
                </span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">MONITOR / RESOLUCIÓN</span>
                <span className="text-white font-bold">{specs.monitorResolution || '1920×1080'}</span>
                <span className="text-zinc-400 block mt-1">
                  Tasa de refresco: {specs.monitorRefreshRateHz ? `${specs.monitorRefreshRateHz} Hz` : '144 Hz'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Mapa de Flujo */}
      {activeModal === 'flow' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#16171d] border border-yellow-400 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold text-lg text-white uppercase">
                  MAPA DE FLUJO EVO 001 // CAPÍTULO 02
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono-tech text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block mb-1">CARGA AUDITADA</span>
                <span className="text-yellow-400 font-bold text-sm">
                  {flowData?.workload || 'Carga real del laboratorio'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block mb-1">RAM EN ACTIVIDAD</span>
                  <span className="text-white font-bold">
                    {flowData?.measurements?.activity?.ramUsedGb ?? '5.4'} GB
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <span className="text-zinc-500 block mb-1">CPU EN ACTIVIDAD</span>
                  <span className="text-white font-bold">
                    {flowData?.measurements?.activity?.cpuUsagePct ?? '38'} %
                  </span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 font-sans-editorial text-xs text-zinc-300 leading-relaxed italic">
                “En esta observación, la actividad del almacenamiento fue más visible durante la carga inicial. La memoria retuvo los activos de escena y la CPU coordinó el despacho continuo hacia la GPU.”
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Perfil de Fluidez */}
      {activeModal === 'fluidez' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#16171d] border border-yellow-400 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold text-lg text-white uppercase">
                  PERFIL DE FLUIDEZ EVO 001 // CAPÍTULO 03
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono-tech text-xs">
              <div className="p-3 bg-black/40 rounded-xl border border-zinc-800 flex justify-between items-center">
                <div>
                  <span className="text-zinc-500 block text-[10px]">ESCENARIO</span>
                  <span className="text-white font-bold text-sm">
                    {fluidezData?.game || 'VALORANT'} // {fluidezData?.resolution || '1280×720'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block text-[10px]">CALIDAD</span>
                  <span className="text-yellow-400 font-bold">{fluidezData?.quality || 'Baja / Competitiva'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-center">
                  <span className="text-zinc-500 block text-[10px]">FPS HABITUALES</span>
                  <span className="text-white font-bold text-base">
                    {fluidezData?.fpsHabituales ?? 171}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-center">
                  <span className="text-zinc-500 block text-[10px]">1% LOW</span>
                  <span className="text-emerald-400 font-bold text-base">
                    {fluidezData?.telemetry?.onePercentLow ?? 118}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-center">
                  <span className="text-zinc-500 block text-[10px]">FRAMETIME TEÓRICO</span>
                  <span className="text-yellow-400 font-bold text-base">
                    {fluidezData?.theoreticalFrametimeMs
                      ? `${fluidezData.theoreticalFrametimeMs.toFixed(2)} ms`
                      : '5.85 ms'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
                <span className="text-zinc-500 block mb-1 text-[10px]">SENSACIÓN PERCIBIDA</span>
                <span className="text-zinc-200">
                  {fluidezData?.sensation || 'Fluida con caídas leves en momentos de alta densidad de efectos.'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Matriz de Limitación */}
      {activeModal === 'matrix' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#16171d] border border-yellow-400 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-bold text-lg text-white uppercase">
                  MATRIZ DE LIMITACIÓN EVO 001 // CAPÍTULO 04
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono-tech text-xs">
              <div className="p-3.5 bg-black/40 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] mb-1">
                  FACTOR LIMITANTE PRINCIPAL OBSERVADO
                </span>
                <span className="text-yellow-400 font-bold text-base">
                  {matrixData?.primaryLimiter || 'GPU-BOUND // RENDERIZADO GRÁFICO'}
                </span>
                <span className="text-zinc-400 block mt-1 text-[11px]">
                  Confianza pericial: {matrixData?.confidenceScore || 'ALTA (Fundada en ensayo A/B)'}
                </span>
              </div>

              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-zinc-500 block text-[10px]">ENSAYO A/B CONTROLADO</span>
                <div className="flex justify-between text-zinc-300">
                  <span>
                    Escenario A ({abExperiment?.scenarioA?.resolution || '1080p'}): {abExperiment?.scenarioA?.fps || 144} FPS
                  </span>
                  <span>
                    Escenario B ({abExperiment?.scenarioB?.resolution || '720p'}): {abExperiment?.scenarioB?.fps || 215} FPS
                  </span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 font-sans-editorial text-xs text-zinc-300 leading-relaxed italic">
                “En esta configuración y bajo estas condiciones de prueba, reducir la carga de renderizado gráfico produjo una respuesta directa en la cadencia de cuadros. No obstante, en escenas competitivas con múltiples jugadores, el subsistema de CPU y procesos en segundo plano puede compartir la limitación.”
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-mono-tech font-bold text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
