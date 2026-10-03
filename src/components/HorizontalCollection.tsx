import React, { useRef } from 'react';
import { Lock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { VolumeItem } from '../types';

interface HorizontalCollectionProps {
  volumes: VolumeItem[];
  onOpenVolume: (volume: VolumeItem) => void;
}

export const HorizontalCollection: React.FC<HorizontalCollectionProps> = ({
  volumes,
  onOpenVolume,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="coleccion-horizontal" className="pt-14 sm:pt-20 pb-20">
      
      {/* Section Header: Airy & Editorial */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono-tech text-zinc-300 mb-2">
            <span className="w-1.5 h-1.5 bg-yellow-400" />
            <span className="uppercase tracking-widest text-zinc-300 font-semibold">
              COLECCIÓN EDITORIAL
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Serie de 10 tomos
          </h2>
          <p className="text-sm text-zinc-300 font-sans-editorial mt-1 max-w-xl">
            Diez tomos conectados por la metodología EVO: entender, practicar, comprobar y avanzar.
          </p>
        </div>

        {/* Scroll Navigation */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => handleScroll(-360)}
            className="p-3 rounded-xl border border-zinc-800 bg-[#121318] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Desplazar tomos a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll(360)}
            className="p-3 rounded-xl border border-zinc-800 bg-[#121318] hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Desplazar tomos a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track: Mini-portadas reales de cada tomo */}
      <div
        ref={scrollRef}
        className="flex gap-7 overflow-x-auto pb-6 scroll-smooth no-scrollbar select-none"
      >
        {volumes.map((volume) => {
          const isCurrent = !volume.isLocked;

          return (
            <article
              key={volume.id}
              id={`card-${volume.id}`}
              onClick={() => {
                if (isCurrent) {
                  onOpenVolume(volume);
                }
              }}
              className={`shrink-0 w-[280px] sm:w-[310px] md:w-[330px] rounded-2xl border transition-all duration-300 flex flex-col group overflow-hidden ${
                isCurrent
                  ? 'bg-[#121318] border-zinc-700/80 hover:border-yellow-400/80 hover:-translate-y-1.5 cursor-pointer shadow-xl'
                  : 'bg-[#0e0f13] border-zinc-800/80 hover:border-zinc-700 hover:-translate-y-1 opacity-90 cursor-default'
              }`}
            >
              {/* Real Mini Magazine Cover Visual */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0b0e] border-b border-zinc-800/80">
                <img
                  src={volume.coverImage}
                  alt={`Portada de ${volume.volumeLabel}: ${volume.title}`}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02] ${
                    isCurrent ? 'filter brightness-100 contrast-[1.02]' : 'filter brightness-75 contrast-95'
                  }`}
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f13] via-transparent to-black/30 pointer-events-none" />

                {/* Top status tag overlaid on mini cover */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="font-mono-tech text-xs font-black tracking-wider px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {volume.volumeLabel}
                  </span>

                  {isCurrent ? (
                    <span className="text-[10px] font-mono-tech uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-400 text-black shadow">
                      DISPONIBLE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-tech uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-zinc-300">
                      <Lock className="w-3 h-3 text-zinc-300" />
                      <span>BLOQUEADO</span>
                    </span>
                  )}
                </div>

                {/* Bottom title on the mini cover */}
                <div className="absolute bottom-3 left-3.5 right-3.5 pointer-events-none">
                  <span className="text-[10px] font-mono-tech uppercase tracking-widest text-zinc-300 block mb-0.5">
                    {volume.editionLabel}
                  </span>
                  <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-md">
                    {volume.title}
                  </h3>
                </div>
              </div>

              {/* Editorial Info under the mini-cover */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-mono-tech text-zinc-400 mb-2">
                    {volume.tagline}
                  </p>
                  <p className="text-xs text-zinc-300 font-sans-editorial leading-relaxed line-clamp-3">
                    {volume.description}
                  </p>
                </div>

                {/* Card Action or Unlock Condition */}
                <div className="pt-3 border-t border-zinc-800/60">
                  {isCurrent ? (
                    <div
                      className="flex items-center justify-between text-xs font-mono-tech font-bold transition-colors"
                      style={{ color: volume.themeColor || '#EAB308' }}
                    >
                      <span>
                        ABRIR {volume.volumeLabel ? volume.volumeLabel.toUpperCase() : `TOMO ${volume.number}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono-tech text-zinc-400 flex items-center gap-2">
                      <Lock className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span>{volume.unlockCondition}</span>
                    </div>
                  )}
                </div>
              </div>

            </article>
          );
        })}
      </div>

    </section>
  );
};
