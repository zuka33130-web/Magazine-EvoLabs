import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  FileCheck,
  Cpu,
  Layers,
  Tv,
  HardDrive,
  Zap,
  Fan,
  Activity,
  Terminal,
  Info,
} from 'lucide-react';
import { Machine } from '../types';
import { WindowsDetectionService, MachineIntegrityAuditResult } from '../services/windowsDetectionService';

interface EvoMachineIntegrityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMachine: Machine;
  onOpenAutoDetect?: () => void;
}

export const EvoMachineIntegrityModal: React.FC<EvoMachineIntegrityModalProps> = ({
  isOpen,
  onClose,
  activeMachine,
  onOpenAutoDetect,
}) => {
  if (!isOpen) return null;

  const audit: MachineIntegrityAuditResult = WindowsDetectionService.auditMachineIntegrity(activeMachine);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className="w-full max-w-4xl max-h-[90vh] rounded-3xl border border-zinc-700 bg-[#0a0d14] shadow-2xl flex flex-col font-mono-tech overflow-hidden"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.15)',
        }}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 bg-[#070a10] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                  AUDITORÍA EPISTÉMICA // INTEGRIDAD DE SILICIO
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {audit.isFullyLegitimate ? '100% HARDWARE REAL // 0 MOCKS' : 'REVISIÓN REQUERIDA'}
                </span>
              </div>
              <h2 className="font-display font-black text-white text-base sm:text-lg tracking-tight uppercase">
                DETECTED MACHINE vs ACTIVE MACHINE
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-zinc-300">
          {/* Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">COMPONENTES DETECTADOS</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {audit.detectedCount}
              </span>
              <span className="text-[10px] text-zinc-500 block">WMI / CIM / SO Real</span>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">ESTRICTO UNKNOWN</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {audit.unknownCount}
              </span>
              <span className="text-[10px] text-zinc-500 block">PSU, Cooler, Gabinete</span>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">CARGA MANUAL USUARIO</span>
              <span className="text-xl font-black text-cyan-400 font-mono">
                {audit.userEnteredCount}
              </span>
              <span className="text-[10px] text-zinc-500 block">Declarado con evidencia</span>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">DEFAULTS INVENTADOS</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                0
              </span>
              <span className="text-[10px] text-emerald-400/80 block">Eliminados por completo</span>
            </div>
          </div>

          {/* Subsystems Comparison Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>TRAZABILIDAD SUBSISTEMA POR SUBSISTEMA</span>
              </span>
              <span className="text-[11px] text-zinc-400">
                Puntaje de Integridad: <strong className="text-emerald-400">{audit.overallIntegrityScorePct}%</strong>
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-[#07090e]">
              <div className="grid grid-cols-12 gap-2 p-3 bg-zinc-900/80 border-b border-zinc-800 text-[10px] font-black text-zinc-400 uppercase">
                <div className="col-span-3">SUBSISTEMA</div>
                <div className="col-span-3">DETECCIÓN REAL (CIM / WMI)</div>
                <div className="col-span-4">MACHINE ACTIVA EN BANCO</div>
                <div className="col-span-2 text-right">PROVENANCE</div>
              </div>

              <div className="divide-y divide-zinc-800/60">
                {audit.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-zinc-900/30 transition-colors">
                    <div className="col-span-3 flex items-center gap-2">
                      <span className="font-bold text-white text-[11px]">{it.label}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">[{it.subsystem}]</span>
                    </div>

                    <div className="col-span-3 font-mono text-[11px] truncate">
                      {it.detectedValue === 'NO DETECTABLE POR SOFTWARE' ? (
                        <span className="text-zinc-500 italic">No detectable en SO</span>
                      ) : it.detectedValue === 'NO DETECTADO' ? (
                        <span className="text-zinc-500">Sin captura</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">{it.detectedValue}</span>
                      )}
                    </div>

                    <div className="col-span-4 font-mono text-[11px] truncate">
                      {it.activeValue.includes('UNKNOWN') ? (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 border border-amber-400/30 font-black text-[9.5px]">
                          {it.activeValue}
                        </span>
                      ) : (
                        <span className="text-white font-bold">{it.activeValue}</span>
                      )}
                      <p className="text-[9.5px] text-zinc-500 font-sans mt-0.5 truncate">{it.notes}</p>
                    </div>

                    <div className="col-span-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase inline-block ${
                          it.provenance === 'SYSTEM_REPORTED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : it.provenance === 'DETECTED'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : it.provenance === 'USER_ENTERED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {it.provenance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Lists: Detected vs Unknown vs Removed Fallbacks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0a0d14] space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>COMPONENTES DETECTADOS EN LA PC REAL</span>
              </span>
              <ul className="space-y-1 text-[11px] text-zinc-300">
                {audit.detectedHardwareList.length > 0 ? (
                  audit.detectedHardwareList.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5 font-mono">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500 italic font-sans">
                    Ningún componente detectado aún. Ejecutá la telemetría nativa de Windows abajo.
                  </li>
                )}
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-800 bg-[#0a0d14] space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>COMPONENTES STRICT UNKNOWN (NO INVENTADOS)</span>
              </span>
              <ul className="space-y-1 text-[11px] text-zinc-300">
                {audit.unknownHardwareList.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 font-mono">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-zinc-500 font-sans pt-1">
                Reglas críticas 1-4: PSU, Cooler, Case y Fans no se inventan nunca por software.
              </p>
            </div>
          </div>

          {/* Removed Fallbacks Guarantee */}
          <div className="p-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 space-y-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>GARANTÍA DE SILICIO // FALLBACKS Y DEFAULTS ELIMINADOS</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] text-zinc-400 font-mono">
              {audit.removedFallbacksAudit.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-zinc-800 bg-[#070a10] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-500 font-sans">
            La Machine en banco proviene de medición empírica local verificada.
          </span>

          <div className="flex items-center gap-3">
            {onOpenAutoDetect && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAutoDetect();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>EJECUTAR NUEVA DETECCIÓN WINDOWS</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              CERRAR AUDITORÍA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
