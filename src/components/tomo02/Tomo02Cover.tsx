import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { TOMO_02_COVER as coverHeroImg } from '../../data/tomoCoversData';
import { VOLUMES_COLLECTION } from '../../data/collections';
import { VolumeItem } from '../../types';
import { HorizontalCollection } from '../HorizontalCollection';
import { Tomo02VisualAtlas } from './Tomo02VisualAtlas';

interface Tomo02CoverProps {
  onOpenInteractive: () => void;
  onOpenLab: () => void;
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04' | '08') => void;
  completedModulesCount?: number;
  totalModulesCount?: number;
}

export const Tomo02Cover: React.FC<Tomo02CoverProps> = ({
  onOpenInteractive,
  onOpenLab,
  onBackToApp,
  onNavigateTomo,
  completedModulesCount = 0,
  totalModulesCount = 27,
}) => {
  const handleOpenVolumeFromCollection = (volume: VolumeItem) => {
    if (onNavigateTomo) {
      if (volume.id === 'tomo-01') onNavigateTomo('01');
      else if (volume.id === 'tomo-02') onNavigateTomo('02');
      else if (volume.id === 'tomo-03') onNavigateTomo('03');
      else if (volume.id === 'tomo-04') onNavigateTomo('04');
    }
  };

  return (
    <div className="w-full">
      {/* ========================================================
          TOP SECTION: PURE EDITORIAL PRESENTATION (PORTADA PREMIUM)
      ======================================================== */}
      <section
        id="tomo02-contemporary-cover"
        className="w-full pt-6 sm:pt-10 lg:pt-14 pb-16 sm:pb-24 border-b border-zinc-800/40"
      >
        {/* Pure Editorial Meta Bar */}
        <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-300 pb-5 mb-10 sm:mb-14 border-b border-zinc-800/30">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-cyan-400 inline-block shadow-[0_0_8px_#00D2FF]" />
            <span className="tracking-widest uppercase font-bold text-white">
              TOMO 02 // EDICIÓN 02
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tracking-widest uppercase text-zinc-400 hidden sm:inline text-[11px]">
              ARQUITECTURA DE WINDOWS // INVESTIGACIÓN TÉCNICA
            </span>

            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← MAPA MUNDO</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Cover Grid: 2 Columns matching Tomo 01 quality */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Big typography, punchy brief subtitle, generous air */}
          <div className="lg:col-span-6 flex flex-col space-y-10">
            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono-tech tracking-widest text-[#60CDFF] uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00A4EF] inline-block shadow-[0_0_8px_#00A4EF]" />
                <span>TOMO 02 // INVESTIGACIÓN PERICIAL</span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[0.95] uppercase">
                LA BIBLIA NEGRA DE WINDOWS
              </h1>

              <div className="text-xl sm:text-2xl md:text-3xl font-black font-mono tracking-wider uppercase text-[#00A4EF] flex items-center gap-3">
                <span className="text-[#60CDFF]">MENTIRA</span>
                <span className="text-zinc-600">Y</span>
                <span className="text-[#00A4EF]">VERDAD</span>
              </div>

              <p className="text-base sm:text-lg text-zinc-300 font-sans-editorial leading-snug max-w-md pt-1">
                Descubrí qué hace Windows cuando vos no estás mirando.
              </p>

              <p className="text-xs font-mono-tech text-[#60CDFF]/90 tracking-wider uppercase font-semibold pt-1">
                “SI NO PODÉS REVERTIRLO, NO LO TOQUES.”
              </p>
            </div>

            {/* Secondary Headlines: 3 clean editorial items */}
            <div className="pt-6 border-t border-zinc-800/40 space-y-4">
              <span className="text-[11px] font-mono-tech tracking-widest text-zinc-300 uppercase font-semibold block mb-2">
                EN ESTA EDICIÓN
              </span>

              <div className="space-y-4">
                <article className="group cursor-default transition-transform duration-200 hover:translate-x-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                      01.
                    </span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                      Qué ocurre cuando Windows arranca
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    Secuencia UEFI, partición ESP, BCD y transferencia a Winload.
                  </p>
                </article>

                <article className="group cursor-default transition-transform duration-200 hover:translate-x-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                      02.
                    </span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                      Procesos, memoria y servicios
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    svchost compartido, Commit Charge y pools del Kernel NT.
                  </p>
                </article>

                <article className="group cursor-default transition-transform duration-200 hover:translate-x-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-cyan-400 font-bold">
                      03.
                    </span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                      Diagnóstico sin mitos ni cambios a ciegas
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    Registro binario, telemetría forense y reparación no destructiva.
                  </p>
                </article>
              </div>
            </div>

            {/* Una sola entrada a los 40 sectores de la Biblia Virtual (00–39). */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="btn-abrir-biblia-virtual-tomo02"
                type="button"
                onClick={onOpenInteractive}
                className="group relative isolate inline-flex min-h-14 w-full items-center justify-between gap-5 overflow-hidden rounded-2xl border border-[#80E3FF]/80 bg-gradient-to-r from-[#0059C8] via-[#0078D4] to-[#00D2FF] px-5 py-4 text-left font-mono-tech text-sm font-black uppercase tracking-wider text-white shadow-[0_12px_34px_rgba(0,120,212,0.38),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:from-[#0078D4] hover:via-[#009CEB] hover:to-[#60CDFF] hover:shadow-[0_18px_48px_rgba(0,210,255,0.40)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#60CDFF] sm:w-auto"
              >
                <span aria-hidden="true" className="pointer-events-none absolute -left-20 top-0 h-full w-14 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[460px]" />
                <span className="relative z-10 flex flex-col gap-1">
                  <span className="text-[13px] font-black sm:text-sm">ENTRAR A LA BIBLIA VIRTUAL</span>
                  <span className="text-[10px] font-semibold tracking-[0.14em] text-white/85">40 SECTORES · DEL 00 AL 39 · WINDOWS</span>
                </span>
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white/15 shadow-inner transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white/25">
                  <ArrowRight className="h-5 w-5 text-white" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Editorial Photography (Vite ESM local asset) */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden bg-[#101115] border border-zinc-800/80 shadow-2xl transition-all duration-300 hover:border-zinc-700">
              <img
                src={coverHeroImg}
                alt="Fotografía editorial // Dominá Windows — La Biblia Negra de Windows"
                className="block w-full h-auto object-contain"
              />
            </div>
            <p className="mt-3 text-[11px] font-mono-tech text-zinc-300 text-right tracking-wider uppercase">
              Fotografía editorial // Arquitectura de sistemas & Kernel NT
            </p>
          </div>
        </div>

        {/* Misma gramática visual del índice ilustrado del Tomo 01, adaptada a Windows. */}
        <Tomo02VisualAtlas variant="cover" />
      </section>

      {/* ========================================================
          BOTTOM SECTION: COLECCIÓN EDITORIAL HORIZONTAL
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HorizontalCollection
          volumes={VOLUMES_COLLECTION}
          onOpenVolume={handleOpenVolumeFromCollection}
        />
      </div>
    </div>
  );
};
