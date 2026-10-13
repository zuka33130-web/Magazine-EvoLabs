// ============================================================================
// EVO LABS DIGITAL COMPUTER LAB — BUDGET PROFILE & COMPONENT OWNERSHIP BAR
// Principle: "BUDGET: DIFERENCIAR LO QUE YA TENGO DE LO QUE DEBO COMPRAR. CONTROL REAL."
// ============================================================================

import React from 'react';
import { DollarSign, ShieldCheck, Check, AlertTriangle, TrendingUp } from 'lucide-react';
import { BudgetProfile } from '../types';

interface EvoBudgetProfileBarProps {
  budget: BudgetProfile;
  onChangeBudget: (updated: BudgetProfile) => void;
  totalBuildCostUsd: number;
  ownedCostUsd: number;
  toBuyCostUsd: number;
}

export const EvoBudgetProfileBar: React.FC<EvoBudgetProfileBarProps> = ({
  budget,
  onChangeBudget,
  totalBuildCostUsd,
  ownedCostUsd,
  toBuyCostUsd,
}) => {
  // Conversion factors for display
  const currencyMultiplier =
    budget.currency === 'ARS' ? 1200 : budget.currency === 'EUR' ? 0.92 : budget.currency === 'BRL' ? 5.6 : 1;

  const currencySymbol =
    budget.currency === 'EUR' ? '€' : budget.currency === 'ARS' ? '$' : budget.currency === 'BRL' ? 'R$' : '$';

  const maxBudget = budget.maxBudget || 1500;
  const effectiveCost = budget.alreadyOwnedValueExcluded ? toBuyCostUsd : totalBuildCostUsd;
  const remainingBudget = maxBudget - effectiveCost;
  const pctUsed = Math.min(100, Math.max(0, Math.round((effectiveCost / maxBudget) * 100)));

  return (
    <div className="p-4 rounded-2xl bg-[#0d1017] border border-zinc-800 space-y-3 font-mono-tech select-none shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="font-display font-black text-xs text-white uppercase tracking-wider">
              PERFIL DE PRESUPUESTO & PROPIEDAD
            </span>
          </div>

          {/* Currency selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-[10px]">
            {(['USD', 'EUR', 'ARS', 'BRL'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => onChangeBudget({ ...budget, currency: curr })}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  budget.currency === curr
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Max budget input */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400 text-[11px]">Límite:</span>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1">
              <span className="text-zinc-500 text-[10px] mr-1">{currencySymbol}</span>
              <input
                type="number"
                value={budget.maxBudget || ''}
                placeholder="1500"
                onChange={(e) =>
                  onChangeBudget({
                    ...budget,
                    maxBudget: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                className="w-16 bg-transparent text-white font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Owned exclusion toggle */}
        <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={budget.alreadyOwnedValueExcluded}
            onChange={(e) =>
              onChangeBudget({ ...budget, alreadyOwnedValueExcluded: e.target.checked })
            }
            className="rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0"
          />
          <span className="text-[11px]">
            Excluir del gasto piezas que <strong className="text-emerald-400 font-mono">YA TENGO (OWNED)</strong>
          </span>
        </label>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 uppercase block font-mono">VALOR TOTAL EQUIPO</span>
          <span className="font-mono text-zinc-200 font-bold text-sm">
            {currencySymbol}
            {Math.round(totalBuildCostUsd * currencyMultiplier).toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] text-emerald-500/80 uppercase block font-mono">AHORRO // YA POSEÍDO</span>
          <span className="font-mono text-emerald-400 font-bold text-sm">
            {currencySymbol}
            {Math.round(ownedCostUsd * currencyMultiplier).toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] text-purple-400 uppercase block font-mono">A COMPRAR REAL</span>
          <span className="font-mono text-purple-300 font-bold text-sm">
            {currencySymbol}
            {Math.round(toBuyCostUsd * currencyMultiplier).toLocaleString()}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 uppercase block font-mono">PRESUPUESTO RESTANTE</span>
          <span
            className={`font-mono font-bold text-sm ${
              remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {currencySymbol}
            {Math.round(remainingBudget * currencyMultiplier).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>Uso de Presupuesto ({pctUsed}%)</span>
          <span>
            {effectiveCost > maxBudget ? '¡PRESUPUESTO EXCEDIDO!' : `${maxBudget - effectiveCost} de saldo`}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              pctUsed > 100
                ? 'bg-red-500'
                : pctUsed > 85
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
            }`}
            style={{ width: `${Math.min(100, pctUsed)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
