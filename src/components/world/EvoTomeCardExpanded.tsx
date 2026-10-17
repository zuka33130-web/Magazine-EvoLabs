import React, { useState } from 'react';
import { TOMO_01_COVER, TOMO_02_COVER } from '../../data/tomoCoversData';
import {
  BookOpen,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Lock,
  FileText,
} from 'lucide-react';
import { EvoTomeExpandedItem } from '../../data/evoTomesExpandedData';
import { useEvoAccess } from '../../auth/EvoAccessContext';

interface EvoTomeCardExpandedProps {
  tome: EvoTomeExpandedItem;
  isActiveStudy?: boolean;
  studyProgressPercentage?: number;
  studyProgressText?: string;
  onOpenTomo?: (tomoNumber: string) => void;
  onOpenLab?: (actionKey?: string, tomoNumber?: string) => void;
  onOpenDossier?: (tomoNumber: string) => void;
  onOpenMagazine?: (tomoNumber: string) => void;
}

export const EvoTomeCardExpanded: React.FC<EvoTomeCardExpandedProps> = ({
  tome,
  isActiveStudy = false,
  studyProgressPercentage = 0,
  studyProgressText,
  onOpenTomo,
  onOpenLab,
  onOpenDossier,
  onOpenMagazine,
}) => {
  const [imageError, setImageError] = useState(false);
  const { canAccess, openUpgradeModal, isFreeUser, entitlements } = useEvoAccess();
  const ownerCanPreviewTomo03 = tome.number === '03' && entitlements.isOwner;
  const isAvailableForContent = tome.technicalStatus === 'COMPLETE' || tome.commercialStatus === 'AVAILABLE';
  const isRealLab = tome.associatedLab.labRealStatus === 'REAL_FUNCTIONAL';

  const tomeAccess = canAccess({ type: 'tomo_reader', tomoNumber: tome.number });
  const isTomeGranted = tomeAccess.allowed;

  const handleReadClick = () => {
    if (ownerCanPreviewTomo03 && onOpenTomo) {
      onOpenTomo(tome.number);
      return;
    }
    if (!isTomeGranted && isFreeUser && tome.number !== '01') {
      openUpgradeModal(`Tomo ${tome.number} // ${tome.title}`);
      return;
    }
    if (isAvailableForContent && onOpenTomo) {
      onOpenTomo(tome.number);
    } else if (onOpenDossier) {
      onOpenDossier(tome.number);
    }
  };

  const handleLabClick = () => {
    if (isFreeUser) {
      openUpgradeModal(`Laboratorio asociado: ${tome.associatedLab.name}`);
      return;
    }
    if (isRealLab && onOpenLab) {
      onOpenLab(tome.associatedLab.actionKey, tome.number);
    } else if (onOpenDossier) {
      onOpenDossier(tome.number);
    }
  };

  const getCommercialBadge = () => {
    switch (tome.commercialStatus) {
      case 'AVAILABLE':
        return {
          label: 'DISPONIBLE',
          className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 font-black',
        };
      case 'COMING_SOON':
        return {
          label: 'PRÓXIMAMENTE',
          className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 font-bold',
        };
      case 'IN_DEVELOPMENT':
        return {
          label: 'EN DESARROLLO',
          className: 'text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold',
        };
      case 'NOT_FOR_SALE':
      default:
        return {
          label: 'NO DISPONIBLE',
          className: 'text-zinc-500 bg-zinc-900 border-zinc-800 font-bold',
        };
    }
  };

  const getLabBadge = () => {
    switch (tome.associatedLab.labRealStatus) {
      case 'REAL_FUNCTIONAL':
        return {
          label: 'LAB REAL DISPONIBLE',
          className: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30 font-black',
        };
      case 'IN_DEVELOPMENT':
        return {
          label: 'LAB EN DESARROLLO',
          className: 'text-purple-400 bg-purple-400/10 border-purple-400/30 font-bold',
        };
      case 'PLANNED':
      default:
        return {
          label: 'LAB PLANIFICADO',
          className: 'text-zinc-500 bg-zinc-900 border-zinc-800 font-bold',
        };
    }
  };

  const getPrimaryCta = () => {
    if (ownerCanPreviewTomo03) {
      return {
        label: 'ABRIR TOMO 03 EN DESARROLLO →',
        action: handleReadClick,
        className: 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold',
        disabled: false,
      };
    }
    switch (tome.commercialStatus) {
      case 'AVAILABLE':
        if (tome.number === '01') {
          return {
            label: 'INGRESAR AL TOMO (DEMO GRATIS) →',
            action: handleReadClick,
            className: 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_15px_rgba(245,158,11,0.25)]',
            disabled: false,
          };
        }
        if (!isTomeGranted && isFreeUser) {
          return {
            label: 'REQUIERE ACCESO // VER PLANES',
            action: handleReadClick,
            className: 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/50 shadow-md',
            disabled: false,
          };
        }
        return {
          label: isAvailableForContent ? 'INGRESAR AL TOMO →' : 'VER DETALLE',
          action: handleReadClick,
          className: 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          disabled: false,
        };
      case 'COMING_SOON':
        return {
          label: 'VER TEMARIO',
          action: () => onOpenDossier && onOpenDossier(tome.number),
          className: 'bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60',
          disabled: false,
        };
      case 'IN_DEVELOPMENT':
        return {
          label: 'VER ROADMAP',
          action: () => onOpenDossier && onOpenDossier(tome.number),
          className: 'bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800',
          disabled: false,
        };
      case 'NOT_FOR_SALE':
      default:
        return {
          label: 'SIN ACCIÓN COMERCIAL',
          action: () => onOpenDossier && onOpenDossier(tome.number),
          className: 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed',
          disabled: false,
        };
    }
  };

  const commBadge = getCommercialBadge();
  const labBadge = getLabBadge();
  const primaryCta = getPrimaryCta();

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-r from-zinc-950 via-[#0a0c12] to-zinc-950 border transition-all duration-300 overflow-hidden group select-none shadow-xl ${
        isActiveStudy
          ? 'border-amber-400/40 ring-1 ring-amber-400/20 shadow-[0_0_30px_rgba(245,158,11,0.06)]'
          : tome.commercialStatus === 'AVAILABLE'
          ? 'border-zinc-800/90 hover:border-zinc-700/90'
          : 'border-zinc-900/80 hover:border-zinc-800/80'
      }`}
    >
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ===================================================================
            A) COLUMNA 1: MINI PORTADA EDITORIAL (Portada Real & Branding)
           =================================================================== */}
        <div className="lg:col-span-3 flex flex-col items-center sm:items-start justify-between h-full gap-4">
          {tome.number === '01' || tome.number === '02' ? (
            <div className="relative w-full max-w-[200px] sm:max-w-[220px] aspect-[210/297] rounded-xl bg-zinc-950 border-2 border-zinc-800/80 group-hover:border-zinc-700 shadow-2xl overflow-hidden">
              <img
                src={tome.number === '01' ? TOMO_01_COVER : TOMO_02_COVER}
                alt={`Portada ${tome.title}`}
                className="block w-full h-full object-contain"
              />
            </div>
          ) : (
          <div className="relative w-full max-w-[200px] sm:max-w-[220px] aspect-[1/1.38] rounded-xl bg-zinc-950 border-2 border-zinc-800/80 group-hover:border-zinc-700 p-3.5 flex flex-col justify-between shadow-2xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
            
            {/* Background Cover Image with Editorial Dark Overlay */}
            {!imageError && tome.coverImage ? (
              <img
                src={tome.coverImage}
                alt={`Portada ${tome.title}`}
                onError={() => setImageError(true)}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"
              />
            ) : null}

            {/* Gradient protection overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

            {/* Ambient inner glow */}
            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-30 pointer-events-none"
              style={{ backgroundColor: tome.accentColor }}
            />

            {/* Cover Top Header */}
            <div className="relative z-10 flex items-center justify-between font-mono-tech text-[8.5px]">
              <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-zinc-300 border border-zinc-700/80 font-bold">
                TOMO {tome.number}
              </span>
              {tome.number === '01' ? (
                <span className="px-1.5 py-0.5 rounded uppercase text-[8px] border backdrop-blur-sm bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black">
                  DEMO // PLAN GRATIS
                </span>
              ) : isFreeUser ? (
                <span className="px-1.5 py-0.5 rounded uppercase text-[8px] border backdrop-blur-sm bg-zinc-900/90 text-amber-300 border-amber-400/40 font-bold flex items-center gap-0.5">
                  <Lock className="w-2 h-2 text-amber-400" />
                  PREMIUM
                </span>
              ) : (
                <span className={`px-1.5 py-0.5 rounded uppercase text-[8px] border backdrop-blur-sm ${commBadge.className}`}>
                  {commBadge.label}
                </span>
              )}
            </div>

            {/* Cover Center Title */}
            <div className="relative z-10 space-y-1 my-auto text-left">
              <span className="text-[9px] font-mono-tech text-amber-400 uppercase block tracking-wider font-bold">
                COLECCIÓN EVO
              </span>
              <h4 className="font-display font-black text-sm sm:text-base text-white uppercase leading-tight tracking-tight drop-shadow-md">
                {tome.title}
              </h4>
              <p className="text-[9.5px] font-sans-editorial text-zinc-300 italic line-clamp-2 leading-tight drop-shadow">
                “{tome.tagline}”
              </p>
            </div>

            {/* Cover Bottom Footer */}
            <div className="relative z-10 pt-2 border-t border-zinc-800/80 flex items-center justify-between font-mono-tech text-[8px] text-zinc-400 bg-black/40 px-1 rounded">
              <span>{tome.pagesCount} PÁG. A4</span>
              <span className="font-bold text-zinc-300">EDICIÓN 2026</span>
            </div>
          </div>
          )}

          {/* Quick Magazine / Covers Button */}
          <button
            type="button"
            onClick={() => onOpenMagazine && onOpenMagazine(tome.number)}
            className="w-full max-w-[220px] py-1.5 px-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono-tech text-[10px] uppercase font-bold border border-zinc-800/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-amber-400" />
            <span>VER PORTADA & ARTE →</span>
          </button>
        </div>

        {/* ===================================================================
            B & C & D) COLUMNA 2: INFORMACIÓN, EXPLICACIÓN Y QUÉ TRAE
           =================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Header & Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono-tech tracking-widest text-zinc-500 uppercase font-bold">
                TOMO {tome.number} // TRATADO TÉCNICO
              </span>
              {tome.number === '01' ? (
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-mono-tech font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 uppercase">
                  DEMO // INCLUIDO EN PLAN GRATIS
                </span>
              ) : isFreeUser ? (
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-mono-tech font-bold text-amber-300 bg-amber-400/10 border border-amber-400/40 uppercase inline-flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  CONTENIDO PREMIUM
                </span>
              ) : null}
              {isActiveStudy && (
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-mono-tech font-bold text-amber-400 bg-amber-400/10 border border-amber-400/40 uppercase">
                  ESTUDIO ACTIVO
                </span>
              )}
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight leading-tight">
              {tome.title}
            </h3>

            <p className="text-xs font-mono-tech text-zinc-400">
              {tome.subtitle}
            </p>
          </div>

          {/* Explicación Corta & Problema que resuelve (Directamente visible) */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
              {tome.shortExplanation}
            </p>
            <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-900 font-sans-editorial text-xs text-zinc-400 leading-normal">
              <strong className="text-zinc-300 font-mono-tech uppercase text-[10px] block mb-0.5">
                ¿Qué problema resuelve?
              </strong>
              {tome.solvesProblem}
            </div>
          </div>

          {/* Lista de Qué Trae */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono-tech text-zinc-500 uppercase font-bold block">
              QUÉ INCLUYE ESTE TOMO:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {tome.whatItIncludes.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono-tech">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="line-clamp-1">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Barra de progreso de estudio si aplica */}
          {isActiveStudy && (
            <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-500/20 space-y-1.5 font-mono-tech text-[10px]">
              <div className="flex justify-between text-zinc-300 uppercase">
                <span>Tu avance de estudio</span>
                <span className="font-bold text-amber-400">{studyProgressText || `${studyProgressPercentage}%`}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${studyProgressPercentage}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* ===================================================================
            E & F) COLUMNA 3: LABORATORIO ASOCIADO, PRECIO Y ACCIONES
           =================================================================== */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full gap-4 border-t lg:border-t-0 lg:border-l border-zinc-900 lg:pl-6 pt-4 lg:pt-0">
          
          {/* Card del Laboratorio Asociado */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2.5">
            <div className="flex items-center justify-between text-[9px] font-mono-tech">
              <span className="text-zinc-500 font-bold uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                LABORATORIO ASOCIADO
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] border uppercase ${labBadge.className}`}>
                {labBadge.label}
              </span>
            </div>

            <div>
              <h5 className="font-display font-bold text-sm text-white uppercase leading-snug">
                {tome.associatedLab.name}
              </h5>
              <span className="text-[10px] font-mono-tech text-zinc-500 block">
                Tipo: {tome.associatedLab.type}
              </span>
            </div>

            <p className="text-xs text-zinc-400 font-sans-editorial leading-relaxed">
              {tome.associatedLab.description}
            </p>

            {isRealLab && (
              <button
                type="button"
                onClick={handleLabClick}
                className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono-tech font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>ABRIR LABORATORIO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bloque Comercial y Acciones */}
          <div className="space-y-3 pt-2">
            
            {/* Precio Visible Estructural (100% Honesto: Sin Precios Oficiales Inventados) */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 flex items-center justify-between font-mono-tech">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block">ESTADO DE PRECIO</span>
                <span className="text-xs font-bold text-amber-400 tracking-tight">
                  {tome.priceStatus}
                </span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase">
                  {tome.labIncludedLabel}
                </span>
              </div>
            </div>

            {/* CTAs Principales Contextuales */}
            <div className="flex flex-col gap-2 font-mono-tech text-xs font-bold">
              <button
                type="button"
                onClick={primaryCta.action}
                className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${primaryCta.className}`}
              >
                <span>{primaryCta.label}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenDossier && onOpenDossier(tome.number)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 hover:text-white border border-amber-400/40 text-[11px] font-mono-tech font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/10"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>VER FICHA PEDAGÓGICA</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
