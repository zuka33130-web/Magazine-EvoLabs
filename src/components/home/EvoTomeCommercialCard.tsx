import React, { useState } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { EvoTomeExpandedItem } from '../../data/evoTomesExpandedData';
import { normalizeVisibleStatus } from '../../utils/statusNormalizer';

interface EvoTomeCommercialCardProps {
  tome: EvoTomeExpandedItem;
  onOpenTomo?: (tomoNumber: string) => void;
}

const TOMO_METADATA_ACCENTS: Record<
  string,
  {
    techCode: string;
    accentColor: string;
    borderAccent: string;
    glowColor: string;
    badgeBg: string;
    badgeText: string;
    accentGradients: string;
  }
> = {
  '01': {
    techCode: 'EVO-T01-SILICON',
    accentColor: '#F59E0B',
    borderAccent: 'border-amber-400/40 hover:border-amber-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    badgeBg: 'bg-amber-400/15 border-amber-400/40',
    badgeText: 'text-amber-300',
    accentGradients: 'from-amber-500/20 via-transparent to-transparent',
  },
  '02': {
    techCode: 'EVO-T02-NTKERNEL',
    accentColor: '#00D2FF',
    borderAccent: 'border-cyan-400/40 hover:border-cyan-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]',
    badgeBg: 'bg-cyan-400/15 border-cyan-400/40',
    badgeText: 'text-cyan-300',
    accentGradients: 'from-cyan-500/20 via-transparent to-transparent',
  },
  '03': {
    techCode: 'EVO-T03-ATXBENCH',
    accentColor: '#10B981',
    borderAccent: 'border-emerald-400/40 hover:border-emerald-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    badgeBg: 'bg-emerald-400/15 border-emerald-400/40',
    badgeText: 'text-emerald-300',
    accentGradients: 'from-emerald-500/20 via-transparent to-transparent',
  },
  '04': {
    techCode: 'EVO-T04-LAPTOPPWR',
    accentColor: '#A855F7',
    borderAccent: 'border-purple-400/40 hover:border-purple-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    badgeBg: 'bg-purple-400/15 border-purple-400/40',
    badgeText: 'text-purple-300',
    accentGradients: 'from-purple-500/20 via-transparent to-transparent',
  },
  '05': {
    techCode: 'EVO-T05-NETPACKET',
    accentColor: '#06B6D4',
    borderAccent: 'border-sky-400/40 hover:border-sky-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    badgeBg: 'bg-sky-400/15 border-sky-400/40',
    badgeText: 'text-sky-300',
    accentGradients: 'from-sky-500/20 via-transparent to-transparent',
  },
  '06': {
    techCode: 'EVO-T06-KERNELSEC',
    accentColor: '#EF4444',
    borderAccent: 'border-rose-400/40 hover:border-rose-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]',
    badgeBg: 'bg-rose-400/15 border-rose-400/40',
    badgeText: 'text-rose-300',
    accentGradients: 'from-rose-500/20 via-transparent to-transparent',
  },
  '07': {
    techCode: 'EVO-T07-METROLOGY',
    accentColor: '#F59E0B',
    borderAccent: 'border-amber-400/40 hover:border-amber-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    badgeBg: 'bg-amber-400/15 border-amber-400/40',
    badgeText: 'text-amber-300',
    accentGradients: 'from-amber-500/20 via-transparent to-transparent',
  },
  '08': {
    techCode: 'EVO-T08-BOOTFLOW',
    accentColor: '#10B981',
    borderAccent: 'border-emerald-400/40 hover:border-emerald-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    badgeBg: 'bg-emerald-400/15 border-emerald-400/40',
    badgeText: 'text-emerald-300',
    accentGradients: 'from-emerald-500/20 via-transparent to-transparent',
  },
  '09': {
    techCode: 'EVO-T09-DEVLOGIC',
    accentColor: '#22C55E',
    borderAccent: 'border-green-400/40 hover:border-green-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]',
    badgeBg: 'bg-green-400/15 border-green-400/40',
    badgeText: 'text-green-300',
    accentGradients: 'from-green-500/20 via-transparent to-transparent',
  },
  '10': {
    techCode: 'EVO-T10-AGENTPROMPT',
    accentColor: '#8B5CF6',
    borderAccent: 'border-violet-400/40 hover:border-violet-400',
    glowColor: 'group-hover:shadow-[0_0_25px_rgba(139,92,246,0.25)]',
    badgeBg: 'bg-violet-400/15 border-violet-400/40',
    badgeText: 'text-violet-300',
    accentGradients: 'from-violet-500/20 via-transparent to-transparent',
  },
};

export const EvoTomeCommercialCard: React.FC<EvoTomeCommercialCardProps> = ({
  tome,
  onOpenTomo,
}) => {
  const [imageError, setImageError] = useState(false);
  const meta = TOMO_METADATA_ACCENTS[tome.number] || TOMO_METADATA_ACCENTS['01'];

  const handleCardClick = () => {
    if (onOpenTomo) {
      onOpenTomo(tome.number);
    }
  };

  const visibleStatus = normalizeVisibleStatus(tome.number === '01' || tome.number === '02' ? 'AVAILABLE' : tome.number === '03' || tome.number === '04' ? 'IN_DEVELOPMENT' : 'LOCKED');

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#0b0e14] border border-zinc-800/90 ${meta.borderAccent} ${meta.glowColor} transition-all duration-300 p-3 sm:p-4 text-left overflow-hidden shadow-lg`}
    >
      {/* Glow de esquina sutil */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${meta.accentGradients}`}
      />

      <div className="space-y-3.5 relative z-10">
        {/* =================================================================== */}
        {/* 1 // CARÁTULA EDITORIAL DOMINANTE                                    */}
        {/* =================================================================== */}
        <div
          onClick={handleCardClick}
          className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black border border-zinc-800/80 group-hover:border-zinc-700 transition-all cursor-pointer shadow-md select-none"
        >
          {/* Imagen de fondo / render técnico */}
          {!imageError && tome.coverImage ? (
            <img
              src={tome.coverImage}
              alt={`${tome.number} ${tome.title}`}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-4">
              <BookOpen className="w-12 h-12 text-zinc-700 stroke-1" />
            </div>
          )}

          {/* Gradientes oscuros para lectura pericial de libro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

          {/* Borde izquierdo estilo lomo de tomo encuadernado */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1.5 opacity-80"
            style={{ backgroundColor: meta.accentColor }}
          />

          {/* Encabezado editorial superior */}
          <div className="absolute top-2.5 left-3.5 right-3 flex items-center justify-between text-[9px] font-mono-tech uppercase tracking-wider text-zinc-400">
            <span className="font-bold text-zinc-300">EVO LABS</span>
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-bold border ${meta.badgeBg} ${meta.badgeText}`}
            >
              TOMO {tome.number}
            </span>
          </div>

          {/* Información incrustada en la carátula inferior */}
          <div className="absolute bottom-3 left-3.5 right-3 space-y-1">
            <span className="text-[9px] font-mono-tech font-bold tracking-widest text-zinc-400 block uppercase">
              {meta.techCode}
            </span>
            <h4 className="font-display font-black text-sm sm:text-base text-white uppercase leading-tight tracking-tight drop-shadow-md">
              {tome.title}
            </h4>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2 // TÍTULO CANÓNICO & FRASE DE VALOR COMERCIAL                    */}
        {/* =================================================================== */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono-tech font-black text-zinc-400">
              {tome.number} //
            </span>
            <h3 className="font-display font-black text-sm text-white uppercase tracking-tight truncate">
              {tome.title}
            </h3>
          </div>

          {/* Frase de valor comercial breve */}
          <p className="font-sans-editorial text-xs text-zinc-300 leading-snug line-clamp-2 min-h-[32px]">
            “{tome.valuePhrase}”
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3 // PRECIO, ACCESO & CTA                                           */}
      {/* =================================================================== */}
      <div className="pt-3 border-t border-zinc-800/80 space-y-2.5 relative z-10 mt-3">
        <div className="flex items-center justify-between text-[10px] font-mono-tech">
          <span className="text-zinc-400 uppercase font-medium">COMPRA PERMANENTE</span>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
            visibleStatus === 'Disponible'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : visibleStatus === 'En desarrollo'
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-400'
          }`}>
            {visibleStatus}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCardClick}
          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 group-hover:bg-amber-400 group-hover:text-black text-zinc-200 border border-zinc-700/80 group-hover:border-amber-400 font-mono-tech text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>VER TOMO {tome.number}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
