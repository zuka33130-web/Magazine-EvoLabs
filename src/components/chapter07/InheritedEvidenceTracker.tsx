import React, { useState } from 'react';
import { CheckCircle2, Circle, Eye, X, Layers, Cpu, Activity, Gauge, Sliders, Wrench } from 'lucide-react';
import { UserPcSpec } from '../../types';

interface InheritedEvidenceTrackerProps {
  specs: Partial<UserPcSpec>;
  hasPassport?: boolean;
  hardwareEvidenceLevel?: string;
  hasFlowMap: boolean;
  hasFluidez: boolean;
  hasLimitMatrix: boolean;
  hasActivityMap: boolean;
  hasDiagnosticCase: boolean;
}

export const InheritedEvidenceTracker: React.FC<InheritedEvidenceTrackerProps> = ({
  specs,
  hasPassport,
  hardwareEvidenceLevel,
  hasFlowMap,
  hasFluidez,
  hasLimitMatrix,
  hasActivityMap,
  hasDiagnosticCase,
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Determine Hardware availability from real passport existence or specs
  const hasHardware = hasPassport !== undefined
    ? hasPassport
    : Boolean(specs.cpu || specs.ram || specs.gpu || specs.storage);

  // Preserve declared status without artificially upgrading it
  const hwEvidence =
    hardwareEvidenceLevel && hardwareEvidenceLevel !== 'NO DISPONIBLE'
      ? hardwareEvidenceLevel
      : hasHardware
      ? 'DECLARADA'
      : 'NO DISPONIBLE';

  const items = [
    {
      id: 'hw',
      label: 'Hardware',
      code: 'PASAPORTE EVO (C01)',
      completed: hasHardware,
      artifactStatus: hasHardware ? 'PASAPORTE EVO DISPONIBLE' : 'SIN PASAPORTE',
      evidenceLevel: hasHardware ? `EVIDENCIA: ${hwEvidence}` : 'EVIDENCIA: NO DISPONIBLE',
      detail: hasHardware && (specs.cpu || specs.ram || specs.gpu || specs.storage)
        ? [specs.cpu, specs.ram, specs.gpu, specs.storage].filter(Boolean).join(' • ')
        : hasHardware
        ? 'Pasaporte EVO de hardware registrado en Capítulo 01'
        : 'Sin datos de componentes registrados',
      icon: Cpu,
    },
    {
      id: 'fl',
      label: 'Fluidez',
      code: 'PERFIL DE FLUIDEZ (C03)',
      completed: hasFluidez,
      artifactStatus: hasFluidez ? 'PERFIL DE FLUIDEZ DISPONIBLE' : 'SIN PERFIL',
      evidenceLevel: hasFluidez ? 'EVIDENCIA: OBSERVADA' : 'EVIDENCIA: NO DISPONIBLE',
      detail: hasFluidez
        ? 'Métricas de FPS habituales, 1% Low y sensibilidad a frametime auditadas'
        : 'No registrado en C03',
      icon: Gauge,
    },
    {
      id: 'lim',
      label: 'Limitaciones',
      code: 'MATRIZ DE LIMITACIÓN (C04)',
      completed: hasLimitMatrix,
      artifactStatus: hasLimitMatrix ? 'MATRIZ DE CARGA DISPONIBLE' : 'SIN MATRIZ',
      evidenceLevel: hasLimitMatrix ? 'EVIDENCIA: EXPERIMENTAL' : 'EVIDENCIA: NO DISPONIBLE',
      detail: hasLimitMatrix
        ? 'Componente limitante y comportamiento bajo carga identificados'
        : 'No registrado en C04',
      icon: Sliders,
    },
    {
      id: 'win',
      label: 'Window / Actividad',
      code: 'MAPA DE ACTIVIDAD (C05)',
      completed: hasActivityMap,
      artifactStatus: hasActivityMap ? 'MAPA DE ACTIVIDAD DISPONIBLE' : 'SIN MAPA',
      evidenceLevel: hasActivityMap ? 'EVIDENCIA: AUDITADA' : 'EVIDENCIA: NO DISPONIBLE',
      detail: hasActivityMap
        ? 'Procesos de fondo, servicios de inicio y consumo en reposo medidos'
        : 'No registrado en C05',
      icon: Activity,
    },
    {
      id: 'diag',
      label: 'Diagnóstico / Casos',
      code: 'EXPEDIENTE PERICIAL (C06)',
      completed: hasDiagnosticCase,
      artifactStatus: hasDiagnosticCase ? 'EXPEDIENTE PERICIAL DISPONIBLE' : 'SIN EXPEDIENTE',
      evidenceLevel: hasDiagnosticCase ? 'EVIDENCIA: PERICIAL' : 'EVIDENCIA: NO DISPONIBLE',
      detail: hasDiagnosticCase
        ? 'Falla aislada con pruebas técnicas y metodología pericial completada'
        : 'No registrado en C06',
      icon: Wrench,
    },
  ];

  return (
    <>
      <div
        id="banner-evidencia-acumulada-c07"
        className="p-5 sm:p-6 rounded-3xl bg-[#0e0f14] border border-zinc-800 shadow-xl space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 font-mono-tech text-xs uppercase tracking-widest text-yellow-400 font-bold">
            <Layers className="w-4 h-4 text-yellow-400" />
            <span>TU INVESTIGACIÓN HASTA AHORA // EVIDENCIA ACUMULADA</span>
          </div>

          <button
            type="button"
            onClick={() => setShowDetailModal(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono-tech text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>CONSULTAR ARTEFACTOS PREVIOS</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono-tech text-xs">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all ${
                item.completed
                  ? 'bg-emerald-500/5 border-emerald-500/30 text-zinc-200 shadow-sm'
                  : 'bg-black/30 border-zinc-800/60 text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <item.icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      item.completed ? 'text-emerald-400' : 'text-zinc-600'
                    }`}
                  />
                  <span className="font-bold tracking-wider uppercase text-[11px] truncate">
                    {item.label}
                  </span>
                </div>
                {item.completed ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 shrink-0">
                    <span>✓</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                ) : (
                  <Circle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                )}
              </div>

              <div className="space-y-1 pt-1.5 border-t border-zinc-800/60">
                <div
                  className={`text-[10px] font-bold uppercase tracking-tight truncate ${
                    item.completed ? 'text-zinc-300' : 'text-zinc-600'
                  }`}
                >
                  {item.artifactStatus}
                </div>
                <div
                  className={`text-[9.5px] font-mono-tech uppercase tracking-tight truncate ${
                    item.completed ? 'text-yellow-400/90 font-semibold' : 'text-zinc-600'
                  }`}
                >
                  {item.evidenceLevel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detalle de Evidencia Previa */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#111218] border border-zinc-700 rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <span className="font-mono-tech text-[10px] text-yellow-400 uppercase font-bold tracking-widest block">
                  HISTORIAL ACUMULADO TOMO 01
                </span>
                <h3 className="font-display font-black text-xl uppercase">
                  EVIDENCIA TÉCNICA DE TU MÁQUINA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono-tech text-xs">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    item.completed
                      ? 'bg-zinc-900/60 border-emerald-500/30'
                      : 'bg-black/40 border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-white flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-yellow-400" />
                      <span>{item.code}</span>
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.completed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {item.completed ? 'ARTEFACTO DISPONIBLE ✓' : 'NO REGISTRADO'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.completed
                            ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30'
                            : 'bg-zinc-900 text-zinc-600'
                        }`}
                      >
                        {item.evidenceLevel}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-400 font-sans-editorial text-xs pt-1">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono-tech font-bold text-xs uppercase cursor-pointer"
              >
                VOLVER AL LABORATORIO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
