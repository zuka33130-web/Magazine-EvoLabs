import React from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Terminal,
  Shield,
  Zap,
  Activity,
  Award,
  ChevronRight,
  Download,
  FileText,
} from 'lucide-react';
import { TOMO_02_META } from '../../data/tomo02Data';
import { VOLUMES_COLLECTION } from '../../data/collections';
import { VolumeItem } from '../../types';
import { HorizontalCollection } from '../HorizontalCollection';

interface Tomo02CoverProps {
  onOpenMagazine: () => void;
  onOpenInteractive: () => void;
  onOpenLab: () => void;
  onOpenA4WebVersion?: () => void;
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04' | '08') => void;
  completedModulesCount?: number;
  totalModulesCount?: number;
}

export const Tomo02Cover: React.FC<Tomo02CoverProps> = ({
  onOpenMagazine,
  onOpenInteractive,
  onOpenLab,
  onOpenA4WebVersion,
  onBackToApp,
  onNavigateTomo,
  completedModulesCount = 0,
  totalModulesCount = 27,
}) => {
  const isStarted = completedModulesCount > 0;

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
          TOP SECTION: PURE EDITORIAL PRESENTATION (FICHA PRINCIPAL)
      ======================================================== */}
      <section
        id="tomo02-contemporary-cover"
        className="w-full pt-6 sm:pt-10 lg:pt-14 pb-16 sm:pb-24 border-b border-zinc-800/40"
      >
        {/* Pure Editorial Meta Bar */}
        <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-300 pb-5 mb-10 sm:mb-14 border-b border-cyan-950/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#00D2FF]" />
            <span className="tracking-widest uppercase font-bold text-white">
              TOMO 02 // EDICIÓN 02
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold uppercase tracking-wider hidden sm:inline text-[11px]">
              67 PÁGINAS A4 OFICIAL
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tracking-widest uppercase text-zinc-400 hidden sm:inline text-[11px]">
              ARQUITECTURA DE SISTEMAS & KERNEL NT // INVESTIGACIÓN TÉCNICA
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

        {/* Main Cover Grid: 2 Columns matching Tomo 01 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Big typography, 3 product accesses, generous editorial breath */}
          <div className="lg:col-span-6 flex flex-col space-y-8">
            {/* Volume Identifier Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech tracking-wider uppercase font-bold">
                TOMO 02 // LA BIBLIA NEGRA
              </span>
              <span className="text-zinc-500 text-xs font-mono-tech">EDICIÓN 2026</span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.92] uppercase">
                DOMINÁ WINDOWS
              </h1>

              <p className="text-xl sm:text-2xl text-cyan-300 font-sans-editorial italic font-semibold leading-snug pt-0.5">
                “La Biblia Negra de Windows — El lado oscuro del sistema.”
              </p>

              {/* Official Motto Banner */}
              <div className="p-3 rounded-xl bg-[#09111F] border border-cyan-500/40 text-xs font-mono-tech text-cyan-200 flex items-center gap-2.5 shadow-lg my-1">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong className="text-white font-bold uppercase tracking-wider block text-[10px]">LEMA DE REVERSIBILIDAD OBLIGATORIA:</strong>
                  <span className="text-cyan-300 font-extrabold tracking-tight">“SI NO PODÉS REVERTIRLO, NO LO TOQUES.”</span>
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial leading-relaxed max-w-xl pt-1">
                Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando. Del arranque UEFI y el Kernel NT a la memoria virtual, los procesos svchost compartidos y el diagnóstico pericial sin mitos.
              </p>
            </div>

            {/* The 3 Stage Methodological Ladder (LEER → PRACTICAR → EXPERIMENTAR) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#080C14] border border-cyan-900/60 shadow-xl space-y-3 font-mono-tech">
              <div className="flex items-center justify-between text-xs border-b border-cyan-950 pb-2">
                <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  CADENA METODOLÓGICA DE 3 ETAPAS
                </span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest hidden sm:inline">
                  LEER → PRACTICAR → EXPERIMENTAR
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Stage 1 */}
                <div 
                  onClick={onOpenMagazine}
                  className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors cursor-pointer group"
                >
                  <span className="text-cyan-400 font-bold block text-[10px] tracking-wider uppercase group-hover:text-cyan-300">
                    1. MAGAZINE A4
                  </span>
                  <p className="text-white font-sans-editorial font-bold text-sm mt-0.5">
                    “Leer y entender.”
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    Revista Editorial & PDF
                  </span>
                </div>

                {/* Stage 2 */}
                <div 
                  onClick={onOpenInteractive}
                  className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors cursor-pointer group"
                >
                  <span className="text-cyan-400 font-bold block text-[10px] tracking-wider uppercase group-hover:text-cyan-300">
                    2. TOMO INTERACTIVO
                  </span>
                  <p className="text-white font-sans-editorial font-bold text-sm mt-0.5">
                    “Practicar y diagnosticar.”
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    27 Módulos & Examen
                  </span>
                </div>

                {/* Stage 3 */}
                <div 
                  onClick={onOpenLab}
                  className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-colors cursor-pointer group"
                >
                  <span className="text-cyan-400 font-bold block text-[10px] tracking-wider uppercase group-hover:text-cyan-300">
                    3. LABORATORIO
                  </span>
                  <p className="text-white font-sans-editorial font-bold text-sm mt-0.5">
                    “Experimentar en vivo.”
                  </p>
                  <span className="text-[10px] text-zinc-400 block mt-1">
                    Windows Matrix Lab
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Headlines: 3 clean editorial items */}
            <div className="pt-2 border-t border-zinc-800/60 space-y-4">
              <span className="text-[11px] font-mono-tech tracking-widest text-zinc-400 uppercase font-semibold block">
                EN ESTA EDICIÓN // EJES TÉCNICOS
              </span>

              <div className="space-y-3.5">
                <article className="group cursor-default transition-transform duration-200 hover:translate-x-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-cyan-400 font-bold">01.</span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                      Procesos & Servicios en Segundo Plano
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    Quién ejecuta qué, svchost compartido, disparadores por eventos y la falacia de matar procesos a ciegas.
                  </p>
                </article>

                <article className="group cursor-default transition-transform duration-200 hover:translate-x-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-cyan-400 font-bold">02.</span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                      Memoria Virtual & Paginación Real
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    Commit Charge, Working Set, Standby List y Pagefile. Por qué la RAM libre es memoria desperdiciada.
                  </p>
                </article>

                <article className="group cursor-default transition-transform duration-200 hover:translate-x-1.5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-cyan-400 font-bold">03.</span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                      Registro Profundo & Ciberseguridad Defensiva
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    Permisos ACL, colmenas del Registro, telemetría bajo escrutinio forense y la regla suprema de reversibilidad.
                  </p>
                </article>
              </div>
            </div>

            {/* THREE PRIMARY ACTION BUTTONS */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              {/* Button 1: LEER / DESCARGAR MAGAZINE */}
              <button
                id="btn-leer-descargar-magazine-tomo02"
                type="button"
                onClick={onOpenMagazine}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-mono-tech font-extrabold text-xs tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-black hover:brightness-110 transition-all duration-200 cursor-pointer shadow-xl shadow-cyan-500/25 group"
              >
                <BookOpen className="w-4 h-4 text-black" />
                <span>LEER / DESCARGAR MAGAZINE</span>
              </button>

              {/* Button 2: ABRIR TOMO INTERACTIVO */}
              <button
                id="btn-abrir-tomo-interactivo-tomo02"
                type="button"
                onClick={onOpenInteractive}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-white text-black hover:bg-cyan-300 hover:text-black transition-all duration-200 cursor-pointer shadow-xl group"
              >
                <Sparkles className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                <span>ABRIR TOMO INTERACTIVO</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Button 3: LABORATORIO ASOCIADO */}
              <button
                id="btn-laboratorio-asociado-tomo02"
                type="button"
                onClick={onOpenLab}
                className="inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-[#09101E] border border-cyan-500/50 text-cyan-200 hover:bg-cyan-950 hover:border-cyan-400 hover:text-white transition-all duration-200 cursor-pointer shadow-lg"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>LABORATORIO ASOCIADO</span>
              </button>
            </div>
          </div>

          {/* Right Column: PORTADA REAL DEL TOMO 02 */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden bg-[#070B12] border-2 border-cyan-500/40 shadow-[0_0_70px_rgba(0,210,255,0.22)] transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_90px_rgba(0,210,255,0.3)] group">
              {/* Real Portada Image */}
              <img
                src="/src/assets/images/cover_tomo2_win_1789531499967.jpg"
                alt="Portada Real del Tomo 02: Dominá Windows — La Biblia Negra de Windows"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/5] object-cover object-center filter contrast-[1.03] brightness-[0.98] transition-transform duration-500 group-hover:scale-[1.015]"
              />

              {/* Overlaid Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-cyan-500/60 text-cyan-300 font-mono-tech text-[10px] font-bold tracking-wider uppercase shadow-lg">
                  REVISTA A4 EDITORIAL
                </span>
                <span className="px-3 py-1 rounded-lg bg-cyan-500 text-black font-mono-tech text-[10px] font-black tracking-wider uppercase shadow-lg">
                  EDICIÓN COLECCIÓN 2026
                </span>
              </div>

              {/* Quick Hover CTA Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 pt-12 flex items-center justify-between opacity-95 group-hover:opacity-100 transition-opacity">
                <div>
                  <span className="text-cyan-400 font-mono-tech text-[10px] font-bold uppercase tracking-wider block">
                    TOMO 02 // DOMINÁ WINDOWS
                  </span>
                  <span className="text-white font-display font-black text-sm uppercase">
                    LA BIBLIA NEGRA DE WINDOWS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenMagazine}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono-tech font-bold text-[11px] uppercase cursor-pointer transition-colors shadow-md"
                >
                  LEER MAGAZINE A4 →
                </button>
              </div>
            </div>

            <p className="mt-3 text-[11px] font-mono-tech text-zinc-400 text-right tracking-wider uppercase">
              Portada oficial // La Biblia Negra de Windows — Edición Coleccionable 67 Págs
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
