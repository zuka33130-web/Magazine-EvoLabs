import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

export type SemaforoNivel = 'verde' | 'amarillo' | 'rojo';

interface SemaforoEvoProps {
  nivel: SemaforoNivel;
  accion: string;
  descripcion: string;
  riesgo?: string;
  impacto?: string;
  criterio?: string;
  compact?: boolean;
}

export const SemaforoEvo: React.FC<SemaforoEvoProps> = ({
  nivel,
  accion,
  descripcion,
  riesgo,
  impacto,
  criterio,
  compact = false,
}) => {
  const configs = {
    verde: {
      border: 'border-emerald-500/40',
      bg: 'bg-[#08130e]',
      badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      label: 'VERDE // BAJO RIESGO & FÁCIL REVERSIÓN',
      dot: 'bg-emerald-400',
    },
    amarillo: {
      border: 'border-amber-500/40',
      bg: 'bg-[#151108]',
      badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
      label: 'AMARILLO // CONDICIONAL: MEDIR & BACKUP',
      dot: 'bg-amber-400',
    },
    rojo: {
      border: 'border-rose-500/40',
      bg: 'bg-[#160a0c]',
      badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
      label: 'ROJO // NO REALIZAR COMO OPTIMIZACIÓN RUTINARIA',
      dot: 'bg-rose-400',
    },
  };

  const config = configs[nivel];

  if (compact) {
    return (
      <div className={`p-1.5 rounded border ${config.border} ${config.bg} flex items-start gap-2 text-xs font-mono-tech`}>
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className={`text-[8px] font-bold uppercase px-1 py-0.2 rounded border ${config.badgeBg}`}>
            {nivel.toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-bold text-white text-[11px] block truncate">{accion}</span>
          <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight mt-0.5">{descripcion}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${config.border} ${config.bg} p-2.5 my-1.5 font-mono-tech`}>
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-white font-bold text-xs uppercase">{accion}</span>
        </div>
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${config.badgeBg}`}>
          {config.label}
        </span>
      </div>

      <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed mb-2">
        {descripcion}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9px] pt-1 border-t border-zinc-800/60">
        {impacto && (
          <div className="flex items-center gap-1 text-zinc-400">
            <span className="text-zinc-500">IMPACTO EN SISTEMA:</span>
            <span className="text-zinc-200 font-bold">{impacto}</span>
          </div>
        )}
        {riesgo && (
          <div className="flex items-center gap-1 text-zinc-400">
            <span className="text-zinc-500">RIESGO DE ROTURA:</span>
            <span className={nivel === 'rojo' ? 'text-rose-400 font-bold' : nivel === 'amarillo' ? 'text-amber-400' : 'text-emerald-400'}>
              {riesgo}
            </span>
          </div>
        )}
        {criterio && (
          <div className="sm:col-span-2 flex items-start gap-1 text-zinc-400 mt-0.5">
            <span className="text-yellow-400 shrink-0 font-bold">CRITERIO EVO:</span>
            <span className="text-zinc-300 font-sans-editorial text-[10px]">{criterio}</span>
          </div>
        )}
      </div>
    </div>
  );
};
