import React from 'react';
import { Lock, Sparkles, ArrowRight, Home, BookOpen, ShieldCheck } from 'lucide-react';
import { useEvoAccess } from '../../auth/EvoAccessContext';

interface EvoContentGateProps {
  title: string;
  subtitle?: string;
  requiredPlan?: string;
  onReturnHome?: () => void;
  onReturnToDemo?: () => void;
}

export const EvoContentGate: React.FC<EvoContentGateProps> = ({
  title,
  subtitle = 'Este contenido requiere una membresía técnica activa o la adquisición de este tomo.',
  requiredPlan = 'Plan Complete o Adquisición Individual',
  onReturnHome,
  onReturnToDemo,
}) => {
  const { openUpgradeModal } = useEvoAccess();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 select-none font-mono-tech animate-in fade-in duration-200">
      <div className="rounded-2xl bg-gradient-to-b from-[#0d0f18] via-[#090b12] to-[#07080d] border border-amber-400/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(245,158,11,0.12)] space-y-8 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              EVO ACCESS GATE // ACCESO RESTRINGIDO
            </span>
          </div>
          <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
            ESTADO: PLAN GRATIS
          </span>
        </div>

        {/* Main Title & Explanation */}
        <div className="space-y-3">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="font-sans-editorial text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          <div className="pt-2 text-xs text-amber-300/90 font-mono-tech">
            <span>Requisito de acceso: </span>
            <strong className="text-amber-400 font-bold uppercase">{requiredPlan}</strong>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>¿QUÉ TENÉS HABILITADO EN EL PLAN GRATIS (DEMO)?</span>
          </div>
          <p className="text-zinc-400 font-sans-editorial leading-relaxed">
            Tenés acceso completo a la exploración del Campus, Fichas curriculares y temarios de todos los Tomos,
            y los <strong>Capítulos 01 y 02 del Tomo 01 (Conocé tu PC)</strong> con telemetría interactiva y pasaporte de hardware.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => openUpgradeModal(title)}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>VER PLANES Y DESBLOQUEAR TODO →</span>
          </button>

          {onReturnToDemo && (
            <button
              type="button"
              onClick={onReturnToDemo}
              className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>IR AL TOMO 01 (DEMO)</span>
            </button>
          )}

          {onReturnHome && (
            <button
              type="button"
              onClick={onReturnHome}
              className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-zinc-400" />
              <span>VOLVER AL CAMPUS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
