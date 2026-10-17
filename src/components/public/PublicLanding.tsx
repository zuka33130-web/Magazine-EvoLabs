import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Zap,
  CheckCircle2,
  Activity,
  ChevronRight,
} from 'lucide-react';

// Visual assets reales del proyecto
import { Evo3DBrandMark } from '../branding/Evo3DBrandMark';
import { EvoHeroInteractiveGrid } from '../home/EvoHeroInteractiveGrid';

interface PublicLandingProps {
  onExploreClick?: () => void;
  onMethodClick?: () => void;
  onOpenAuthPlaceholder?: (mode: 'login' | 'register') => void;
  onOpenTomo?: (tomoNumber: string) => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onExploreClick,
  onOpenAuthPlaceholder,
  onOpenTomo,
}) => {
  return (
    <div className="relative w-full bg-[#07080c] text-zinc-100 font-sans-editorial selection:bg-amber-400 selection:text-black overflow-x-hidden">
      {/* Fondo interactivo con cuadrícula técnica y deformación suave */}
      <EvoHeroInteractiveGrid />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14 space-y-16 sm:space-y-24">
        
        {/* =========================================================================
            01 // HERO PRINCIPAL (EDITORIAL SPLIT // ALINEADO A LA IZQUIERDA)
           ========================================================================= */}
        <section id="inicio" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Información Editorial */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Eyebrow sobrio y técnico */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="font-mono-tech text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
                EVO LABS // SISTEMA DE APRENDIZAJE TÉCNICO
              </span>
            </div>

            {/* Título Grande y Contundente */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white uppercase leading-[0.95]">
                NO LO CREAS.
                <br />
                <span className="text-amber-400">COMPROBALO.</span>
              </h1>
            </div>

            {/* Bajada Breve Canónica */}
            <p className="font-sans-editorial text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Aprendé cómo funciona una PC.
              <br />
              Experimentá. Medí. Diagnosticá con evidencia.
            </p>

            {/* Máximo 2 CTAs Limpios */}
            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono-tech text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAuthPlaceholder) onOpenAuthPlaceholder('register');
                  else onExploreClick?.();
                }}
                className="px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2"
              >
                <span>EXPLORAR EVO</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                type="button"
                onClick={() => onExploreClick?.()}
                className="px-6 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <span>VER TOMOS</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Únicamente la pieza 3D giratoria de alta calidad como protagonista visual */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-4 lg:-translate-x-12">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center mx-auto">
              <Evo3DBrandMark className="w-full h-full" />
            </div>
          </div>

        </section>

        {/* =========================================================================
            02 // QUÉ ES EVO LABS (ANCHO EXTENDIDO // 3 CONCEPTOS HORIZONTALES)
           ========================================================================= */}
        <section className="border-t border-zinc-800/50 pt-12 sm:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Columna Izquierda: Mensaje y Filosofía */}
            <div className="lg:col-span-4 space-y-3 text-left">
              <span className="font-mono-tech text-xs tracking-widest uppercase font-bold text-amber-400 block">
                PROPUESTA TÉCNICA
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight leading-tight">
                EVOLUCIÓN EN SISTEMAS INFORMÁTICOS
              </h2>
              <p className="font-sans-editorial text-zinc-400 text-sm leading-relaxed">
                EVO LABS combina contenido editorial, laboratorios interactivos y herramientas técnicas para aprender comprobando.
              </p>
            </div>

            {/* Columna Derecha: 3 Conceptos en Tarjetas Horizontales Más Anchas y Menos Altas */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              
              {/* Concepto 1: TOMOS */}
              <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    TOMOS
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                  Fundamentos de silicio, buses PCIe y sistemas operativos desde la física y la lógica de componentes.
                </p>
              </div>

              {/* Concepto 2: LABORATORIOS */}
              <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    LABORATORIOS
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                  Bancos de prueba interactivos para aislar fallas de arranque y procesos de kernel sin riesgo real.
                </p>
              </div>

              {/* Concepto 3: COMPROBAR */}
              <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-950/40 border border-zinc-850 hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                    COMPROBAR
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
                  Medición metrológica en nanosegundos y telemetría determinística para respaldar diagnósticos.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            04 // MÉTODO EVO (LÍNEA VISUAL CONCISA A TODO ANCHO)
           ========================================================================= */}
        <section className="space-y-5 text-left border-t border-zinc-800/50 pt-12 sm:pt-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono-tech text-xs tracking-widest uppercase font-bold text-cyan-400 block">
                MÉTODO CIENTÍFICO APLICADO
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                EL MÉTODO EVO
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-sans-editorial max-w-md">
              El aprendizaje técnico se consolida cuando cada hipótesis se somete a medición física y comprobación empírica.
            </p>
          </div>

          {/* Una sola línea visual de pasos extendida a todo el ancho */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 font-mono-tech text-xs">
            
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/70 space-y-1">
              <span className="text-[10px] text-zinc-500 block">01</span>
              <span className="font-bold text-white block">OBSERVAR</span>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">Síntoma sin prejuicio.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/70 space-y-1">
              <span className="text-[10px] text-zinc-500 block">02</span>
              <span className="font-bold text-cyan-400 block">MEDIR</span>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">Instrumental real.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/70 space-y-1">
              <span className="text-[10px] text-zinc-500 block">03</span>
              <span className="font-bold text-amber-400 block">EXPERIMENTAR</span>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">Cambio controlado.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/70 space-y-1">
              <span className="text-[10px] text-zinc-500 block">04</span>
              <span className="font-bold text-purple-400 block">COMPARAR</span>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">Contra línea de base.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/70 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-zinc-500 block">05</span>
              <span className="font-bold text-emerald-400 block">CONCLUIR</span>
              <p className="text-[11px] text-zinc-400 font-sans-editorial">Evidencia inmutable.</p>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};
