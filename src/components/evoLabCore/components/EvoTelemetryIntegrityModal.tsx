// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — TELEMETRY INTEGRITY AUDIT MODAL
// Real-time verification of /api/telemetry/live-scan against allowed components
// Displays all discrepancies marked as 'UNKNOWN'
// ============================================================================

import React from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, Cpu, Zap, RefreshCw, Activity } from 'lucide-react';
import { LiveScanIntegrityResult } from '../services/telemetryIntegrityService';

interface EvoTelemetryIntegrityModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrityResult: LiveScanIntegrityResult | null;
  isLoading: boolean;
  onReScan: () => void;
  onApplyMachine: () => void;
}

export const EvoTelemetryIntegrityModal: React.FC<EvoTelemetryIntegrityModalProps> = ({
  isOpen,
  onClose,
  integrityResult,
  isLoading,
  onReScan,
  onApplyMachine,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-700 bg-[#0c1017] shadow-2xl flex flex-col font-mono-tech overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 bg-[#080b10] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  AUDITORÍA DE INTEGRIDAD DE SILICIO
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-zinc-800 text-zinc-300 border border-zinc-700">
                  ENDPOINT /api/telemetry/live-scan
                </span>
              </div>
              <h2 className="font-display font-black text-white text-base sm:text-lg uppercase">
                COMPARACIÓN CONTRA COMPONENTES PERMITIDOS
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase">
                  CONSULTANDO ENDPOINT & EVALUANDO PERMISOS DE SILICIO...
                </p>
                <p className="text-xs text-zinc-400 font-sans-editorial">
                  Verificando cada subsistema contra el catálogo pericial y forzando UNKNOWN ante cualquier discrepancia.
                </p>
              </div>
            </div>
          ) : integrityResult ? (
            <>
              {/* Alert banner when autodetection failed */}
              {(!integrityResult.machine || integrityResult.status === 'AUTODETECTION_FAILED' || integrityResult.error === 'AUTODETECTION_FAILED') && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-amber-300 uppercase tracking-wide">
                      AUTODETECCIÓN NO DISPONIBLE — HARDWARE UNAVAILABLE / UNKNOWN
                    </p>
                    <p className="text-zinc-300 text-[11px] font-sans-editorial leading-relaxed">
                      {integrityResult.message || 'La autodetección de hardware en vivo no está disponible en este entorno o el host no es Windows nativo. No se creó ninguna Machine ficticia ni se utilizó hardware del host servidor. Para detectar tu hardware real de forma pericial, iniciá el EVO Local Agent en 127.0.0.1:43921.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Score banner */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs text-zinc-400 uppercase">RESULTADO DEL ANÁLISIS:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        integrityResult.machine
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {integrityResult.machine
                        ? `INTEGRIDAD ${integrityResult.integrityScore}%`
                        : 'UNAVAILABLE / UNKNOWN'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm">
                    {integrityResult.machine ? integrityResult.machine.alias : 'HARDWARE NO DISPONIBLE (UNKNOWN)'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onReScan}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs font-bold text-zinc-200 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RE-ESCANEAR</span>
                  </button>
                  <button
                    type="button"
                    onClick={onApplyMachine}
                    disabled={!integrityResult.machine}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      integrityResult.machine
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed border border-zinc-700/60'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{integrityResult.machine ? 'APLICAR A MÁQUINA ACTIVA' : 'MÁQUINA NO DISPONIBLE'}</span>
                  </button>
                </div>
              </div>

              {/* Discrepancies Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>REGISTRO DE DISCREPANCIAS Y HOMOLOGACIÓN</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {integrityResult.discrepancies.length} CAMPOS AUDITADOS
                  </span>
                </div>

                <div className="space-y-2">
                  {integrityResult.discrepancies.map((d, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                        d.status === 'VERIFIED'
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300'
                          : d.status === 'DISCREPANCY_MARKED_UNKNOWN'
                          ? 'bg-amber-950/20 border-amber-500/40 text-zinc-300'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono uppercase">
                            [{d.subsystem}] {d.field}
                          </span>
                          {d.status === 'VERIFIED' ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-400/20 text-emerald-400 border border-emerald-500/30">
                              HOMOLOGADO
                            </span>
                          ) : d.status === 'DISCREPANCY_MARKED_UNKNOWN' ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400/20 text-amber-400 border border-amber-500/30">
                              DISCREPANCIA ➔ UNKNOWN
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-zinc-800 text-zinc-400 border border-zinc-700">
                              NO DETECTABLE ➔ UNKNOWN
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-sans-editorial">{d.reason}</p>
                      </div>

                      <div className="sm:text-right shrink-0 font-mono text-[11px]">
                        <span className="text-zinc-500 block text-[9px]">VALOR ORIGINAL:</span>
                        <span className="text-zinc-200 font-bold truncate max-w-[200px] block">
                          {String(d.detectedValue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Hacé clic en Escanear para iniciar la auditoría de telemetría.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
