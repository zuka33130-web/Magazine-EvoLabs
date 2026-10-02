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

      {/* Main Cover Grid: Ample negative space, high editorial breath */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Big typography, punchy brief subtitle, generous air */}
        <div className="lg:col-span-6 flex flex-col space-y-10">
          
          {/* Main Title & Subtitle */}
          <div className="space-y-4">
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.93] uppercase">
              Tu PC no es lo que dicen los FPS
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-sans-editorial leading-snug max-w-md pt-2">
              La velocidad real se define en el silicio mucho antes de que se dibuje un fotograma.
            </p>
          </div>

          {/* Secondary Headlines: 3 clean editorial items */}
          <div className="pt-6 border-t border-zinc-800/40 space-y-4">
            <span className="text-[11px] font-mono-tech tracking-widest text-zinc-300 uppercase font-semibold block mb-2">
              EN ESTA EDICIÓN
            </span>

            <div className="space-y-4">
              {headlines.slice(0, 3).map((item, idx) => (
                <article 
                  key={idx} 
                  className="group cursor-default transition-transform duration-200 hover:translate-x-1.5"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-tech text-xs text-yellow-400 font-bold">
                      0{idx + 1}.
                    </span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-yellow-300 transition-colors">
                      {item.title}
                    </h2>
                  </div>
                  <p className="mt-0.5 pl-6 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    {item.subtitle}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="btn-abrir-edicion"
              type="button"
              onClick={onOpenEdition}
              className="inline-flex items-center gap-3.5 px-7 py-3.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-white text-black hover:bg-yellow-400 hover:text-black transition-all duration-200 cursor-pointer shadow-xl hover:shadow-yellow-400/20 group"
            >
              <span>ABRIR EDICIÓN INTERACTIVA</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => setIsWelcomeOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-500/40 transition-all duration-200 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>EMPEZAR DESDE CERO</span>
            </button>

            {onOpenA4Magazine && (
              <button
                id="btn-abrir-revista-a4"
                type="button"
                onClick={onOpenA4Magazine}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono-tech font-bold text-xs tracking-wider uppercase bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-yellow-400/30"
              >
                <span>📖 REVISTA EDITORIAL A4 (PDF)</span>
              </button>
            )}
          </div>

        </div>

        {/* Right Column: First base image (clean macro photography of CPU silicon & heatspreader substrate) */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl overflow-hidden bg-[#101115] border border-zinc-800/80 shadow-2xl transition-all duration-300 hover:border-zinc-700">
            {/* Pure image: No technical labels, no badges, no overlays */}
            <img
              src="/src/assets/images/evo_silicon_hero_1789530430709.jpg"
              alt="Fotografía macro editorial de silicio de microprocesador y sustrato de placa madre"
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover object-center filter contrast-[1.04] brightness-[0.97] transition-transform duration-500 hover:scale-[1.015]"
            />
          </div>
          <p className="mt-3 text-[11px] font-mono-tech text-zinc-300 text-right tracking-wider uppercase">
            Fotografía editorial // Arquitectura de silicio & geometría física
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
