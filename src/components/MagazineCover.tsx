import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, HelpCircle, Compass } from 'lucide-react';
import { EditorialHeadline } from '../types';
import { TutorTomo01TourModal } from './tutor/TutorTomo01TourModal';
import { TutorTomo01WelcomeModal } from './tutor/TutorTomo01WelcomeModal';
import { useTutorEvo } from './tutor/TutorEvoContext';

interface MagazineCoverProps {
  headlines: EditorialHeadline[];
  onOpenEdition: () => void;
  onOpenA4Magazine?: () => void;
  onBackToWorldMap?: () => void;
}

export const MagazineCover: React.FC<MagazineCoverProps> = ({
  headlines,
  onOpenEdition,
  onOpenA4Magazine,
  onBackToWorldMap,
}) => {
  const { openTutorWithTab, setMode } = useTutorEvo();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  return (
    <section 
      id="contemporary-magazine-cover" 
      data-evo-tour="cover"
      className="w-full pt-6 sm:pt-10 lg:pt-14 pb-16 sm:pb-24 border-b border-zinc-800/40"
    >
      {/* Pure Editorial Meta Bar */}
      <div className="flex items-center justify-between text-xs font-mono-tech text-zinc-300 pb-5 mb-10 sm:mb-14 border-b border-zinc-800/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 bg-yellow-400 inline-block" />
          <span className="tracking-widest uppercase font-bold text-white">
            TOMO 01 // EDICIÓN 01
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="tracking-widest uppercase text-zinc-300 hidden sm:inline text-[11px]">
            ARQUITECTURA DE COMPUTADORAS // INVESTIGACIÓN TÉCNICA
          </span>

          {onBackToWorldMap && (
            <button
              type="button"
              onClick={onBackToWorldMap}
              className="inline-flex items-center gap-1.5 text-xs font-mono-tech uppercase text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← MAPA MUNDO</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Cover Grid: Asymmetrical layout with refined 58%/42% balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Big typography, punchy brief subtitle, generous air (7 cols ~ 58%) */}
        <div className="lg:col-span-7 flex flex-col space-y-12">
          
          {/* Main Title & Subtitle with high-end typographic hierarchy */}
          <div className="space-y-6">
            <h1 
              className="font-display uppercase tracking-tight leading-[0.95] max-w-[580px] flex flex-col"
              style={{ fontSize: 'clamp(34px, 4.2vw, 56px)' }}
            >
              <span className="font-black text-white">Tu PC no</span>
              <span className="font-extrabold text-zinc-400 text-[0.93em] tracking-wide">es lo que</span>
              <span className="font-bold text-white text-[0.93em]">dicen los</span>
              <span 
                className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.22)] animate-pulse inline-block"
                style={{ textShadow: '0 0 1px rgba(245,158,11,0.1)' }}
              >
                FPS
              </span>
            </h1>

            <p className="text-base sm:text-[18px] text-zinc-400 font-sans-editorial leading-relaxed max-w-[520px] pt-2">
              La velocidad real se define en el silicio mucho antes de que se dibuje un fotograma.
            </p>
          </div>

          {/* Secondary Headlines: Refined, elegant and distinctly secondary */}
          <div className="pt-8 border-t border-zinc-900/80 space-y-5 max-w-[540px]">
            <span className="text-[10px] font-mono-tech tracking-widest text-zinc-500 uppercase font-black block">
              EN ESTA EDICIÓN INTERACTIVA
            </span>

            <div className="space-y-4">
              {headlines.slice(0, 3).map((item, idx) => (
                <article 
                  key={idx} 
                  className="group cursor-default transition-transform duration-200 hover:translate-x-1"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono-tech text-[11px] text-zinc-500 font-bold">
                      0{idx + 1}.
                    </span>
                    <h2 className="font-display font-bold text-sm sm:text-base text-zinc-200 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs text-zinc-400 font-sans leading-relaxed">
                    {item.subtitle}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Action Buttons: Clear hierarchy (1 dominant + secondary) */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            {/* ACCIÓN PRINCIPAL DOMINANTE */}
            <button
              id="btn-abrir-edicion"
              type="button"
              onClick={onOpenEdition}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono-tech font-black text-xs sm:text-sm tracking-wider uppercase bg-amber-400 text-black hover:bg-amber-300 transition-all duration-200 cursor-pointer shadow-xl shadow-amber-400/10 hover:shadow-amber-400/20 group"
            >
              <span>COMENZAR TOMO 01</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            {/* ACCIÓN SECUNDARIA 1: GUÍA APRENDIZ CERO */}
            <button
              type="button"
              onClick={() => setIsWelcomeOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-400 hover:text-white border border-zinc-800/70 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>EMPEZAR DESDE CERO</span>
            </button>

            {/* ACCIÓN SECUNDARIA 2: REVISTA A4 */}
            {onOpenA4Magazine && (
              <button
                id="btn-abrir-revista-a4"
                type="button"
                onClick={onOpenA4Magazine}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/70 transition-all duration-200 cursor-pointer"
              >
                <span>📖 REVISTA EDITORIAL A4</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Original editorial image beautifully integrated (5 cols ~ 42%) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-2xl transition-all duration-300 hover:border-zinc-800">
            {/* Pure image: No technical labels, no badges, no overlays */}
            <img
              src="/src/assets/images/evo_silicon_hero_1789530430709.jpg"
              alt="Fotografía macro editorial de silicio de microprocesador y sustrato de placa madre"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/5] lg:aspect-[3/4] object-cover object-center filter contrast-[1.03] brightness-[0.94] transition-transform duration-500 hover:scale-[1.01]"
            />
          </div>
          <p className="mt-3.5 text-[10px] font-mono-tech text-zinc-500 text-right tracking-widest uppercase">
            Sustrato de Silicio // Laboratorio de Ensayo EVO
          </p>
        </div>

      </div>

      {/* Tutor Tour Modal */}
      <TutorTomo01TourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onFinishTour={() => setIsTourOpen(false)}
        onStartChapter01={onOpenEdition}
      />

      {/* Tutor Welcome Zero Knowledge Modal */}
      <TutorTomo01WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onStartZeroKnowledge={() => {
          setIsWelcomeOpen(false);
          setIsTourOpen(true);
        }}
        onExploreFreely={() => {
          setIsWelcomeOpen(false);
          setMode('libre');
          onOpenEdition();
        }}
        onStartChapter01={onOpenEdition}
      />
    </section>
  );
};
