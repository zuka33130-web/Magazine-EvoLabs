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
} from 'lucide-react';
import { UserPcSpec, Lab02ExperimentData, FluidezProfileData } from '../../types';

interface ExpedienteAcumuladoBannerProps {
  specs: Partial<UserPcSpec>;
  hasPassport: boolean;
  flowData: Lab02ExperimentData | null;
  hasFlowMap: boolean;
  fluidezData: FluidezProfileData | null;
  hasFluidez: boolean;
  onOpenChapter01?: () => void;
  onOpenChapter02?: () => void;
  onOpenChapter03?: () => void;
}

export const ExpedienteAcumuladoBanner: React.FC<ExpedienteAcumuladoBannerProps> = ({
  specs,
  hasPassport,
  flowData,
  hasFlowMap,
  fluidezData,
  hasFluidez,
  onOpenChapter01,
  onOpenChapter02,
  onOpenChapter03,
}) => {
  const [activeModal, setActiveModal] = useState<'passport' | 'flow' | 'fluidez' | null>(null);

  return (
    <>
      <div
        id="expediente-acumulado-banner"
        className="p-5 sm:p-6 rounded-2xl bg-[#121318] border border-yellow-400/40 shadow-xl space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-80" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-mono-tech uppercase font-bold tracking-widest text-yellow-400">
              EXPEDIENTE ACUMULADO // EVIDENCIA PREVIA VINCULADA
            </span>
          </div>
          <span className="text-[11px] font-mono-tech text-zinc-400 uppercase">
            CAPÍTULOS 01, 02 Y 03 SINTETIZADOS
          </span>
        </div>

        {/* 3 Dossier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
              <p className="font-mono-tech text-[11px] text-zinc-400 truncate">
                GPU: {specs.gpu || 'GPU no auditada'} • RAM: {specs.ram || '16 GB'}
              </p>
            </div>

            <button
              type="button"
              id="btn-ver-pasaporte-acumulado"
              onClick={() => setActiveModal('passport')}
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-zinc-300 hover:text-yellow-400 text-xs font-mono-tech transition-colors cursor-pointer"
            >
              <span>INSPECCIONAR PASAPORTE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* C02: Mapa de Flujo */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                <span className="text-yellow-400 font-bold">CAP 02 // COLABORACIÓN</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVO
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-yellow-400" />
                Mapa de Flujo 001
              </h4>
              <p className="font-mono-tech text-xs text-zinc-300 mt-1 truncate">
                Carga: {flowData?.loadCategory || 'JUEGO 3D'}
              </p>
              <p className="font-mono-tech text-[11px] text-zinc-400">
                Fase de actividad: CPU {flowData?.actividad.cpu || 'MEDIO'} • GPU {flowData?.actividad.gpu || 'ALTO'}
              </p>
            </div>

            <button
              type="button"
              id="btn-ver-mapa-flujo-acumulado"
              onClick={() => setActiveModal('flow')}
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-zinc-300 hover:text-yellow-400 text-xs font-mono-tech transition-colors cursor-pointer"
            >
              <span>INSPECCIONAR FLUJO</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* C03: Perfil de Fluidez */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 mb-1.5">
                <span className="text-yellow-400 font-bold">CAP 03 // TELEMETRÍA</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVO
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-white uppercase flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-yellow-400" />
                Perfil de Fluidez 001
              </h4>
              <p className="font-mono-tech text-xs text-zinc-300 mt-1 truncate">
                Juego: {fluidezData?.game === 'OTRO' ? fluidezData.customGameName || 'OTRO' : fluidezData?.game || 'VALORANT'}
              </p>
              <p className="font-mono-tech text-[11px] text-zinc-400 truncate">
                FPS: {fluidezData?.fpsHabituales ?? 144} • Caída: {fluidezData?.caidaObservada ?? 98} • {fluidezData?.sensacion || 'FLUIDA'}
              </p>
            </div>

            <button
              type="button"
              id="btn-ver-perfil-fluidez-acumulado"
              onClick={() => setActiveModal('fluidez')}
              className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-yellow-400/60 text-zinc-300 hover:text-yellow-400 text-xs font-mono-tech transition-colors cursor-pointer"
            >
              <span>INSPECCIONAR FLUIDEZ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 01: PASAPORTE EVO */}
      {activeModal === 'passport' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#121318] border border-yellow-400/60 rounded-2xl shadow-2xl p-6 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight">
                  PASAPORTE DE SILICIO // CAPÍTULO 01
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">PROCESADOR (CPU)</span>
                <span className="text-white font-bold">{specs.cpu || 'Auditado en Cap 01'}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">TARJETA GRÁFICA (GPU)</span>
                <span className="text-white font-bold">{specs.gpu || 'Auditada en Cap 01'}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">MEMORIA RAM</span>
                <span className="text-white font-bold">{specs.ram || '16 GB'}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">ALMACENAMIENTO</span>
                <span className="text-white font-bold">{specs.storage || 'SSD NVMe / SATA'}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">PLACA BASE</span>
                <span className="text-white font-bold">{specs.motherboard || 'Auditada'}</span>
              </div>
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">SISTEMA OPERATIVO</span>
                <span className="text-white font-bold">{specs.windows || 'Windows 11'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-mono-tech text-zinc-400">
                Base pericial consolidada en el Capítulo 01.
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold text-xs font-mono-tech cursor-pointer"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 02: MAPA DE FLUJO */}
      {activeModal === 'flow' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#121318] border border-yellow-400/60 rounded-2xl shadow-2xl p-6 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight">
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

            <div className="space-y-4">
              <p className="text-xs font-sans-editorial text-zinc-300">
                Registro del viaje de datos a través del bus PCIe, la memoria del sistema y la cola de renderizado.
              </p>

              <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-3 font-mono-tech text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400">CARGA ENSAYADA:</span>
                  <span className="text-yellow-400 font-bold">{flowData?.loadCategory || 'JUEGO / APLICACIÓN 3D'}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded bg-zinc-900">
                    <span className="text-zinc-400 block">CPU</span>
                    <span className="font-bold text-white">{flowData?.actividad.cpu || 'MEDIO'}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900">
                    <span className="text-zinc-400 block">RAM</span>
                    <span className="font-bold text-white">{flowData?.actividad.ram || 'ALTO'}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900">
                    <span className="text-zinc-400 block">GPU</span>
                    <span className="font-bold text-white">{flowData?.actividad.gpu || 'ALTO'}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-900">
                    <span className="text-zinc-400 block">DISCO</span>
                    <span className="font-bold text-white">{flowData?.actividad.disco || 'BAJO'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-mono-tech text-zinc-400">
                Evidencia de interacción multi-componente.
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold text-xs font-mono-tech cursor-pointer"
              >
                CERRAR VISOR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 03: PERFIL DE FLUIDEZ */}
      {activeModal === 'fluidez' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-[#121318] border border-yellow-400/60 rounded-2xl shadow-2xl p-6 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                <h3 className="font-display font-black text-lg uppercase tracking-tight">
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

            <div className="space-y-3 font-mono-tech text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">JUEGO SELECCIONADO</span>
                  <span className="text-yellow-400 font-bold">
                    {fluidezData?.game === 'OTRO' ? fluidezData.customGameName || 'OTRO' : fluidezData?.game || 'VALORANT'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">RESOLUCIÓN & CALIDAD</span>
                  <span className="text-white font-bold">
                    {fluidezData?.resolution || '1920×1080'} • {fluidezData?.quality || 'BAJA'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">FPS HABITUALES</span>
                  <span className="text-white font-bold">{fluidezData?.fpsHabituales ?? 144} FPS</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400 block text-[10px]">CAÍDA MÁS BAJA</span>
                  <span className="text-rose-400 font-bold">{fluidezData?.caidaObservada ?? 98} FPS</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] mb-1">SENSACIÓN REPORTADA & SÍNTOMAS</span>
                <span className="text-white font-bold block">{fluidezData?.sensacion || 'FLUIDA'}</span>
                <span className="text-zinc-400 text-[11px] block mt-1">
                  Síntomas: {fluidezData?.sintomas?.length ? fluidezData.sintomas.join(', ') : 'micro-stuttering'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-mono-tech text-zinc-400">
                Evidencia de cadencia de fotogramas y micro-stuttering.
              </span>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold text-xs font-mono-tech cursor-pointer"
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
