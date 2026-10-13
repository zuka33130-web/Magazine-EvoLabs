import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface ChapterHeroOpenerProps {
  chapterNumber: string;
  categoryTag?: string;
  title: string;
  subtitle: string;
  leadParagraph: string;
  keyQuestion: string;
  imageSrc: string;
  imageCaption: string;
  accentColor?: string;
  metricsPreview?: Array<{ label: string; value: string }>;
}

export const ChapterHeroOpener: React.FC<ChapterHeroOpenerProps> = ({
  chapterNumber,
  categoryTag = 'INFORME PERICIAL',
  title,
  subtitle,
  leadParagraph,
  keyQuestion,
  imageSrc,
  imageCaption,
  accentColor = '#EAB308',
  metricsPreview,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between space-y-4">
      {/* Top Chapter Metadata */}
      <div className="border-b border-zinc-800/80 pb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-mono-tech tracking-widest uppercase font-black px-2 py-0.5 rounded"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            {chapterNumber}
          </span>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-zinc-400">
            {categoryTag}
          </span>
        </div>
        <span className="text-[10px] font-mono-tech text-zinc-500 uppercase tracking-wider hidden sm:inline">
          DIVISIÓN DE METROLOGÍA & SILICIO
        </span>
      </div>

      {/* Main Title & Editorial Framing */}
      <div className="space-y-2">
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-[1.05]">
          {title}
        </h2>
        <p
          className="font-mono-tech text-xs sm:text-sm uppercase tracking-wider font-semibold"
          style={{ color: accentColor }}
        >
          {subtitle}
        </p>
      </div>

      {/* Hero Photographic Stage (occupies 40-50% of the visual weight) */}
      <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-[#07080b] shadow-2xl flex-1 min-h-[220px] max-h-[340px] group">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover filter brightness-[0.88] contrast-105 group-hover:scale-[1.02] transition-transform duration-700"
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

        {/* Technical Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-end justify-between backdrop-blur-[2px] bg-black/40 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 shrink-0 animate-pulse rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <span className="text-[10px] sm:text-[11px] font-mono-tech text-zinc-200 tracking-wide">
              {imageCaption}
            </span>
          </div>
          <span className="text-[9px] font-mono-tech text-zinc-400 uppercase tracking-widest hidden sm:inline">
            FOTOMACROGRAFÍA FORENSE
          </span>
        </div>
      </div>

      {/* Editorial Lead Paragraph + Key Provocative Question */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2 items-start">
        {/* Narrative Lead */}
        <div className="md:col-span-7">
          <p className="magazine-dropcap text-zinc-200 text-xs sm:text-sm font-sans-editorial leading-relaxed">
            {leadParagraph}
          </p>
        </div>

        {/* Provocative Question / Mystery Box */}
        <div className="md:col-span-5 space-y-3">
          <div className="p-3.5 bg-[#0e1118] border-l-3 border-yellow-400 rounded-r shadow-lg">
            <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-yellow-400 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>EL MISTERIO CENTRAL:</span>
            </div>
            <p className="font-display font-bold text-xs sm:text-[13px] text-white leading-snug">
              "{keyQuestion}"
            </p>
          </div>

          {metricsPreview && metricsPreview.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-tech">
              {metricsPreview.map((m, i) => (
                <div key={i} className="px-2.5 py-1.5 bg-[#12151e] border border-zinc-800/80 rounded">
                  <span className="text-zinc-500 block text-[9px] uppercase">{m.label}</span>
                  <span className="text-zinc-200 font-bold">{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
