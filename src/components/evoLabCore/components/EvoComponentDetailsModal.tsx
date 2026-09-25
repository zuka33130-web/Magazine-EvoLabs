// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — PROFESSIONAL COMPONENT FICHA MODAL
// Principle: "FICHA TÉCNICA PROFESIONAL: EXACT SKU VS BASE MODEL, REVISIONES, FUENTES TIER 1"
// ============================================================================

import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Layers,
  Cpu,
  Info,
  Tag,
  Calendar,
  Sparkles,
  Box,
  Hash,
} from 'lucide-react';
import {
  BuildComponentItem,
  ComponentOwnershipState,
  CompatibilityCheck,
} from '../types';

interface EvoComponentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  component?: BuildComponentItem;
  compatibilityChecks?: CompatibilityCheck[];
  onToggleOwnership?: (newState: ComponentOwnershipState) => void;
  onRemoveComponent?: () => void;
  onChangeComponent?: () => void;
  onViewSource?: (url?: string) => void;
}

export const EvoComponentDetailsModal: React.FC<EvoComponentDetailsModalProps> = ({
  isOpen,
  onClose,
  component,
  compatibilityChecks = [],
  onToggleOwnership,
  onRemoveComponent,
  onChangeComponent,
  onViewSource,
}) => {
  if (!isOpen || !component) return null;

  const isExactSku = component.kind === 'EXACT_SKU';
  const isBaseModel = component.kind === 'BASE_MODEL';
  const isOwned = component.ownershipState === 'OWNED';
  const isSoldered = component.replaceability === 'SOLDERED';
  const isProprietary = component.replaceability === 'PROPRIETARY';

  const relevantChecks = compatibilityChecks.filter((c) =>
    c.subsystems.includes(component.subsystem)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono-tech animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0b0e14] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-[#0e121b] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {component.subsystem.toUpperCase()}
              </span>

              {/* Granularity badge */}
              {isExactSku ? (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  EXACT SKU // MODELO ESPECÍFICO
                </span>
              ) : isBaseModel ? (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  FAMILIA BASE // GENÉRICA
                </span>
              ) : null}

              {/* Lifecycle badge */}
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  component.lifecycle === 'CURRENT'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : component.lifecycle === 'DISCONTINUED'
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : component.lifecycle === 'LEGACY'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}
              >
                {component.lifecycle || 'CURRENT'}
              </span>

              {/* Replaceability badge */}
              {isSoldered && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500/20 text-red-300 border border-red-500/30">
                  SOLDADO A LA PLACA (BGA)
                </span>
              )}
              {isProprietary && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CONECTOR PROPIETARIO OEM
                </span>
              )}
            </div>

            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              {component.model}
            </h2>

            <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
              <span>Fabricante: <strong className="text-zinc-200">{component.manufacturer || 'Oficial'}</strong></span>
              {component.partNumber && (
                <span>Part Number / SKU: <strong className="text-zinc-200 font-mono">{component.partNumber}</strong></span>
              )}
              {component.revision && (
                <span>Revisión: <strong className="text-cyan-300 font-mono">{component.revision}</strong></span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0 border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin text-xs">
          {/* Base Model Physical Compatibility Warning */}
          {component.variantRequiredForPhysicalCompatibility && (
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block uppercase text-[11px]">
                  ADVERTENCIA DE PRECISIÓN MECÁNICA: VARIANT REQUIRED
                </span>
                <p className="text-[11px] text-amber-300/90 font-sans-editorial leading-relaxed">
                  Este componente está ingresado como <strong>Familia Base</strong> (ej: chip o referencia general). Para comprobar el clearance de milímetros en gabinete, disipación de triple slot o cables 12V-2x6 se recomienda especificar el modelo o Part Number exacto de ensamblador (ASUS, MSI, Gigabyte, etc.).
                </p>
              </div>
            </div>
          )}

          {/* Owned Status Selector */}
          <div className="p-4 rounded-2xl bg-[#111522] border border-purple-500/30 flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-purple-400 font-black uppercase tracking-wider block">
                ESTADO DE ADQUISICIÓN / PROPIEDAD
              </span>
              <span className="font-bold text-white text-sm">
                {isOwned ? 'YA TENGO ESTE COMPONENTE (OWNED)' : 'COMPONENTE A ADQUIRIR (TO_BUY)'}
              </span>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">
                {isOwned
                  ? 'Excluido del cálculo de presupuesto restante. Se considera pieza física ya en tu poder.'
                  : 'Se computa en el valor proyectado a comprar para esta Machine.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleOwnership && onToggleOwnership(isOwned ? 'TO_BUY' : 'OWNED')}
              className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                isOwned
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
              }`}
            >
              {isOwned ? 'MARCAR COMO "A COMPRAR"' : 'MARCAR: "YA LO TENGO"'}
            </button>
          </div>

          {/* Specifications Breakdown */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              <span>ESPECIFICACIONES TÉCNICAS OFICIALES</span>
            </h3>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <p className="text-zinc-200 leading-relaxed font-sans-editorial text-xs">
                {component.specsSummary}
              </p>

              {component.specifications && Object.keys(component.specifications).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-zinc-900">
                  {Object.entries(component.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-zinc-900/60 font-mono text-[11px]">
                      <span className="text-zinc-500 uppercase">{k}:</span>
                      <span className="text-zinc-200 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compatibility in current Machine */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>COMPATIBILIDAD CON LA MACHINE ACTUAL</span>
            </h3>

            {relevantChecks.length === 0 ? (
              <p className="text-zinc-500 text-xs italic">
                No hay comprobaciones directas requeridas para este subsistema en la configuración actual.
              </p>
            ) : (
              <div className="space-y-2">
                {relevantChecks.map((chk) => (
                  <div
                    key={chk.id}
                    className={`p-3 rounded-xl border space-y-1 ${
                      chk.status === 'INCOMPATIBLE'
                        ? 'border-red-500/40 bg-red-950/20 text-red-300'
                        : chk.status === 'COMPATIBLE_AFTER_BIOS_UPDATE'
                        ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                        : chk.status === 'WARNING'
                        ? 'border-yellow-500/40 bg-yellow-950/20 text-yellow-300'
                        : 'border-zinc-800 bg-zinc-950/50 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{chk.title}</span>
                      <span className="font-mono text-[10px] uppercase">{chk.status}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans-editorial leading-tight">
                      {chk.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sources and Verifications */}
          <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Nivel de Fuente:</span>
              <span className="font-bold text-cyan-400">TIER 1 (Fabricante Oficial / Whitepaper)</span>
            </div>
            {component.sources && component.sources.length > 0 && (
              <div className="flex items-start justify-between gap-4 text-zinc-400">
                <span>Fuente de Verificación:</span>
                <span className="font-mono text-zinc-300 text-right truncate max-w-xs">
                  {component.sources[0]}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-zinc-400">
              <span>Última Verificación:</span>
              <span className="font-mono text-zinc-300">
                {component.lastVerifiedAt ? new Date(component.lastVerifiedAt).toLocaleDateString() : 'Verificado Reciente'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-zinc-800 bg-[#0e121b] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {onRemoveComponent && !isSoldered && (
              <button
                type="button"
                onClick={() => {
                  onRemoveComponent();
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>QUITAR DE LA MACHINE</span>
              </button>
            )}

            {isSoldered && (
              <span className="text-[11px] text-zinc-500 italic">
                Componente soldado a placa base. No se permite desmonte.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onChangeComponent && !isSoldered && (
              <button
                type="button"
                onClick={() => {
                  onChangeComponent();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>CAMBIAR MODELO</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            >
              CERRAR FICHA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
