import React from 'react';
import { Lock, Sparkles, ArrowRight, X, Shield, CheckCircle2 } from 'lucide-react';
import { EVO_PRICING } from '../../data/evoPricing';

interface EvoPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTitle?: string | null;
  requiredPlan?: string;
  onSelectPlan?: (planId: string) => void;
}

export const EvoPaywallModal: React.FC<EvoPaywallModalProps> = ({
  isOpen,
  onClose,
  targetTitle = 'Recurso Premium EVO LABS',
  requiredPlan = 'Plan Complete o Adquisición del Tomo',
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none font-mono-tech">
      <div className="w-full max-w-xl rounded-2xl bg-[#090b12] border border-amber-400/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] space-y-6 relative flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                CONTENIDO PREMIUM
              </span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                ESTADO ACTUAL: PLAN GRATIS
              </span>
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
              REQUIERE ACCESO
            </h3>
          </div>
        </div>

        {/* Feature info */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">
            RECURSO SOLICITADO:
          </span>
          <p className="text-white font-bold text-sm">
            {targetTitle}
          </p>
          <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
            Tu estado actual corresponde al <strong>PLAN GRATIS</strong>. Para desbloquear este módulo, laboratorio o examen oficial se requiere {requiredPlan}.
          </p>
        </div>

        {/* Access benefits */}
        <div className="space-y-2 text-xs font-sans-editorial text-zinc-300 border-t border-zinc-900 pt-4">
          <span className="font-mono-tech text-[10px] text-zinc-400 uppercase font-bold block">
            CON TU MEMBRESÍA O COMPRA DE TOMO ACCEDÉS A:
          </span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Lectura integral de tomos en formato facsimilar interactivo</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Laboratorios en tiempo real con inyección de fallas y osciloscopio</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Acreditación formal, examen pericial y certificado verificado</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSelectPlan) onSelectPlan('planes');
            }}
            className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>VER PLANES Y OPCIONES DE COMPRA</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors cursor-pointer border border-zinc-800"
          >
            SEGUIR EN PLAN GRATIS (DEMO)
          </button>
        </div>
      </div>
    </div>
  );
};
