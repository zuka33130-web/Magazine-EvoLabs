import React from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { EVO_PRICING, EvoPriceItem } from '../../data/evoPricing';

interface EvoPublicPricingProps {
  onSelectPlan: (planId: string) => void;
  onSelectTomoOption: () => void;
}

export const EvoPublicPricing: React.FC<EvoPublicPricingProps> = ({
  onSelectPlan,
  onSelectTomoOption,
}) => {
  const {
    singleTomo,
    tomoPack3,
    tomoPack5,
    complete1Month,
    complete3Months,
    complete6Months,
    complete12Months,
    lifetime,
  } = EVO_PRICING;

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-mono-tech select-none">
      
      {/* HEADER DE PRECIOS */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span className="text-xs tracking-widest text-amber-400 uppercase font-black">
            PLANES Y ACCESO TRANSPARENTE // MERCADO PAGO
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          ¿CÓMO QUERÉS ENTRAR A EVO?
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-2xl">
          Elegí compra permanente por tomo, packs personalizados o suscripción completa para acceder a todo el ecosistema pericial.
        </p>
      </div>

      {/* BLOQUE A: COMPRA PERMANENTE Y PACKS */}
      <div className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-400/30">
            A
          </span>
          <h2 className="text-lg sm:text-xl font-display font-black text-amber-300 uppercase tracking-tight">
            CONTENIDO ESPECÍFICO // COMPRA PERMANENTE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          
          {/* 1. Tomo Individual */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 shadow-lg group">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  TOMO INDIVIDUAL
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  PERMANENTE
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-white tracking-tight">
                    ${singleTomo.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-amber-400 font-bold uppercase">{singleTomo.currency}</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-sans-editorial block pt-1">
                  Duración: {singleTomo.duration}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                {singleTomo.description}
              </p>
              
              {/* Inclusiones / Exclusiones */}
              <div className="pt-3 border-t border-zinc-900 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>1 Tomo digital completo</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <XCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <span>No incluye otros tomos</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSelectTomoOption}
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold uppercase tracking-wider transition-all cursor-pointer border border-zinc-800 hover:border-zinc-700"
            >
              EXPLORAR Y ELEGIR TOMO →
            </button>
          </div>

          {/* 2. Pack 3 Tomos */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-400/50 hover:border-amber-400 transition-all flex flex-col justify-between space-y-6 shadow-xl relative group">
            <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
              ELEGÍ 3 TOMOS
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  PACK x3 TOMOS
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium uppercase">
                  PERMANENTE
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-white tracking-tight">
                    ${tomoPack3.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-amber-400 font-bold uppercase">{tomoPack3.currency}</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-sans-editorial block pt-1">
                  Duración: {tomoPack3.duration}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                {tomoPack3.description}
              </p>

              <div className="pt-3 border-t border-zinc-900 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Exactamente 3 Tomos a elección</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Laboratorios asociados</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan(tomoPack3.id)}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
            >
              <span>[ ELEGIR Y CONFIGURAR ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Pack 5 Tomos */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 shadow-lg group">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  PACK x5 TOMOS
                </span>
                <span className="text-[10px] text-amber-400 font-bold uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  ELEGÍ 5 TOMOS
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-black text-white tracking-tight">
                    ${tomoPack5.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-amber-400 font-bold uppercase">{tomoPack5.currency}</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-sans-editorial block pt-1">
                  Duración: {tomoPack5.duration}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed">
                {tomoPack5.description}
              </p>

              <div className="pt-3 border-t border-zinc-900 space-y-2">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Exactamente 5 Tomos a elección</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Máxima bonificación por lote</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan(tomoPack5.id)}
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold uppercase tracking-wider transition-all cursor-pointer border border-zinc-800 hover:border-zinc-700 flex items-center justify-center gap-2"
            >
              <span>[ ELEGIR Y CONFIGURAR ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* BLOQUE B: SUSCRIPCIONES Y ACCESO COMPLETO */}
      <div className="space-y-5 pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-400/30">
            B
          </span>
          <h2 className="text-lg sm:text-xl font-display font-black text-amber-300 uppercase tracking-tight">
            ACCESO COMPLETO // SUSCRIPCIONES Y LIFETIME
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-xs">
          
          {[complete1Month, complete3Months, complete6Months, complete12Months, lifetime].map((plan) => {
            const isPop = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl bg-zinc-950 transition-all flex flex-col justify-between space-y-5 shadow-lg relative group ${
                  isPop
                    ? 'border border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)] bg-gradient-to-b from-zinc-950 to-zinc-900/40'
                    : 'border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isPop && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider">
                    MÁS POPULAR
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {plan.name}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      PLAN FULL
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                        ${plan.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold uppercase">{plan.currency}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block pt-1">
                      Duración: {plan.duration}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 font-sans-editorial leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-900 space-y-1.5 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Acceso a los 12 Tomos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Labs & Herramientas</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer ${
                    isPop
                      ? 'bg-amber-400 hover:bg-amber-300 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  [ ELEGIR PLAN ]
                </button>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
};
