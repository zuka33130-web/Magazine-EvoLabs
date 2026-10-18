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
                className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-mono-tech font-black text-xs sm:text-sm tracking-wider uppercase bg-gradient-to-r from-[#0078D4] to-[#00A4EF] hover:from-[#0067C0] hover:to-[#60CDFF] text-white transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(0,164,239,0.30)] group"
              >
                <span>ENTRAR A LA BIBLIA VIRTUAL · SECTORES 00–39</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
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
