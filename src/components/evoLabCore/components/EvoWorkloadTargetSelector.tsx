// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — WORKLOAD TARGETS & SUITABILITY SELECTOR
// Principle: "¿PARA QUÉ LA QUERÉS? NO INVENTAR RENDIMIENTO. SEPARAR COMPATIBILIDAD DE IDONEIDAD."
// ============================================================================

import React from 'react';
import {
  Gamepad2,
  Video,
  Box,
  Layers,
  Terminal,
  Briefcase,
  Tv,
  Check,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
} from 'lucide-react';
import { WorkloadTarget, BuildComponentItem, MachineDisplayDetailed, CompatibilityReport } from '../types';
import {
  PRESET_WORKLOAD_TARGETS,
  WorkloadEngine,
  WorkloadAuditReport,
  CategorizedSystemEvaluation,
} from '../services/workloadEngine';

interface EvoWorkloadTargetSelectorProps {
  selectedTargets: WorkloadTarget[];
  onToggleTarget: (target: WorkloadTarget) => void;
  components: {
    cpu?: BuildComponentItem;
    gpu?: BuildComponentItem;
    ram?: BuildComponentItem;
    storage?: BuildComponentItem;
    motherboard?: BuildComponentItem;
    psu?: BuildComponentItem;
  };
  compatibility: CompatibilityReport;
  display?: MachineDisplayDetailed;
}

export const EvoWorkloadTargetSelector: React.FC<EvoWorkloadTargetSelectorProps> = ({
  selectedTargets,
  onToggleTarget,
  components,
  compatibility,
  display,
}) => {
  const auditReports = React.useMemo(() => {
    return WorkloadEngine.evaluateWorkloads(components, selectedTargets, display);
  }, [components, selectedTargets, display]);

  const categorizedEval: CategorizedSystemEvaluation = React.useMemo(() => {
    return WorkloadEngine.categorizeSystemEvaluation(compatibility, auditReports, components);
  }, [compatibility, auditReports, components]);

  const getTargetIcon = (cat: string) => {
    switch (cat) {
      case 'ESPORTS_GAMING':
      case 'AAA_GAMING':
        return <Gamepad2 className="w-4 h-4" />;
      case 'VIDEO_EDITING':
        return <Video className="w-4 h-4" />;
      case '3D_CAD':
        return <Box className="w-4 h-4" />;
      case 'PROGRAMMING':
        return <Terminal className="w-4 h-4" />;
      default:
        return <Briefcase className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 font-mono-tech select-none">
      {/* SECTION HEADER */}
      <div className="p-5 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
            ANÁLISIS PERICIAL DE IDONEIDAD
          </span>
          <span className="text-xs text-zinc-500 font-mono">WORKLOAD TARGETS ENGINE</span>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
          ¿PARA QUÉ VAS A USAR ESTA COMPUTADORA?
        </h2>
        <p className="text-xs text-zinc-400 font-sans-editorial">
          Elegí uno o múltiples objetivos de uso. EVO validará si el hardware seleccionado no solo enciende (compatibilidad física), sino si tiene la potencia real requerida para sostener la carga.
        </p>
      </div>

      {/* TARGETS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_WORKLOAD_TARGETS.map((target) => {
          const isSelected = selectedTargets.some((t) => t.id === target.id);
          return (
            <div
              key={target.id}
              onClick={() => onToggleTarget(target)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'border-zinc-800 bg-[#0d1017] hover:border-zinc-700 hover:bg-[#111520]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm">
                  <span className={isSelected ? 'text-cyan-400' : 'text-zinc-400'}>
                    {getTargetIcon(target.category)}
                  </span>
                  <span>{target.name}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500 text-black'
                      : 'border-zinc-700 bg-zinc-900 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-zinc-400 font-sans-editorial">
                <div className="flex justify-between">
                  <span>Meta de Salida:</span>
                  <span className="font-mono text-zinc-200 font-bold">
                    {target.targetResolution} @ {target.targetFps} FPS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Requisito Mínimo:</span>
                  <span className="font-mono text-zinc-300">
                    {target.minimumCpuCores}c • {target.minimumRamGb}GB RAM • {target.minimumVramGb}GB VRAM
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORIZED EVALUATION BREAKDOWN (PHYSICAL, ELECTRICAL, FIRMWARE, WORKLOAD, PERFORMANCE ESTIMATE) */}
      {selectedTargets.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              EVALUACIÓN PERICIAL CATEGORIZADA:
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {auditReports.length} Objetivo(s) Evaluado(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. PHYSICAL COMPATIBILITY */}
            <div className="p-4 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">
                  1. COMPATIBILIDAD FÍSICA
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                    categorizedEval.physicalCompatibility.status === 'COMPATIBLE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {categorizedEval.physicalCompatibility.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans-editorial leading-tight">
                {categorizedEval.physicalCompatibility.summary}
              </p>
            </div>

            {/* 2. ELECTRICAL COMPATIBILITY */}
            <div className="p-4 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">
                  2. COMPATIBILIDAD ELÉCTRICA
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                    categorizedEval.electricalCompatibility.status === 'COMPATIBLE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {categorizedEval.electricalCompatibility.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans-editorial leading-tight">
                {categorizedEval.electricalCompatibility.summary}
              </p>
            </div>

            {/* 3. FIRMWARE COMPATIBILITY */}
            <div className="p-4 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">
                  3. COMPATIBILIDAD FIRMWARE
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                    categorizedEval.firmwareCompatibility.status === 'COMPATIBLE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {categorizedEval.firmwareCompatibility.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-sans-editorial leading-tight">
                {categorizedEval.firmwareCompatibility.summary}
              </p>
            </div>
          </div>

          {/* AUDIT OF EACH SELECTED TARGET WITH ESTIMATED PERFORMANCE TIER */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              4. IDONEIDAD DE CARGA & ESTIMACIÓN DE DESEMPEÑO POR OBJETIVO:
            </span>

            {auditReports.map((report) => (
              <div
                key={report.target.id}
                className="p-4 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {report.target.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        ({report.target.targetResolution} @ {report.target.targetFps} FPS)
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-sans-editorial block">
                      Estimación: <strong className="text-cyan-300">{report.performanceEstimateLabel}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded font-black uppercase ${
                        report.suitabilityStatus === 'OPTIMAL'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : report.suitabilityStatus === 'MEETS_RECOMMENDED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : report.suitabilityStatus === 'MEETS_MINIMUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {report.suitabilityStatus} ({report.suitabilityScore}%)
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed pl-1 border-l-2 border-cyan-500/40">
                  {report.technicalJustification}
                </p>

                {/* Spec checks bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-zinc-900 text-[10px]">
                  {report.specChecks.map((chk, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl border space-y-0.5 ${
                        chk.passed
                          ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-300'
                          : 'border-red-500/30 bg-red-950/10 text-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{chk.name}</span>
                        {chk.passed ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <span className="text-[9px] block text-zinc-400 truncate" title={chk.present}>
                        {chk.present}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
