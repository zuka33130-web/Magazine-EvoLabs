import React from 'react';
import { ALL_TOMO_COVERS } from '../../data/tomoCoversData';
import {
  FileText,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';

interface EvoPublicMagazinesCatalogProps {
  onOpenMagazineTomo01: () => void;
  onOpenMagazineTomo02: () => void;
  onOpenMagazineTomo03: () => void;
  onOpenMagazineTomo04: () => void;
  onOpenMagazineTomo08: () => void;
}

export const EvoPublicMagazinesCatalog: React.FC<EvoPublicMagazinesCatalogProps> = ({
  onOpenMagazineTomo01,
  onOpenMagazineTomo02,
  onOpenMagazineTomo03,
  onOpenMagazineTomo04,
  onOpenMagazineTomo08,
}) => {
  const magazines = [
    {
      id: 'mag-01',
      edition: 'EDICIÓN 01',
      tomoNum: '01',
      title: 'EVO MAGAZINE // CONOCÉ TU PC',
      subtitle: 'La anatomía pericial del silicio, buses y jerarquía de memorias.',
      coverImage: ALL_TOMO_COVERS['01'],
      color: 'border-amber-400/40 hover:border-amber-400',
      badgeColor: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
      btnColor: 'bg-amber-400 text-black hover:bg-amber-300',
      hasPdf: true,
      onOpen: onOpenMagazineTomo01,
    },
    {
      id: 'mag-02',
      edition: 'EDICIÓN 02',
      tomoNum: '02',
      title: 'EVO MAGAZINE // LA BIBLIA NEGRA DE WINDOWS',
      subtitle: 'Auditoría de Kernel NT, servicios en segundo plano y registro profundo.',
      coverImage: ALL_TOMO_COVERS['02'],
      color: 'border-cyan-400/40 hover:border-cyan-400',
      badgeColor: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
      btnColor: 'bg-cyan-400 text-black hover:bg-cyan-300',
      hasPdf: true,
      onOpen: onOpenMagazineTomo02,
    },
    {
      id: 'mag-03',
      edition: 'EDICIÓN 03',
      tomoNum: '03',
      title: 'EVO MAGAZINE // REPARACIÓN DE PC',
      subtitle: 'Diagnóstico de hardware, líneas de poder ATX y aislamiento de fallas.',
      coverImage: ALL_TOMO_COVERS['03'],
      color: 'border-emerald-400/40 hover:border-emerald-400',
      badgeColor: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
      btnColor: 'bg-emerald-400 text-black hover:bg-emerald-300',
      hasPdf: true,
      onOpen: onOpenMagazineTomo03,
    },
    {
      id: 'mag-04',
      edition: 'EDICIÓN 04',
      tomoNum: '04',
      title: 'EVO MAGAZINE // REPARACIÓN DE NOTEBOOKS',
      subtitle: 'Arquitectura móvil, etapas de alimentación, integrados y fallas térmicas.',
      coverImage: ALL_TOMO_COVERS['04'],
      color: 'border-purple-400/40 hover:border-purple-400',
      badgeColor: 'bg-purple-400/10 text-purple-300 border-purple-400/30',
      btnColor: 'bg-purple-400 text-black hover:bg-purple-300',
      hasPdf: true,
      onOpen: onOpenMagazineTomo04,
    },
    {
      id: 'mag-08',
      edition: 'EDICIÓN 08',
      tomoNum: '08',
      title: 'EVO MAGAZINE // ARRANQUE Y DIAGNÓSTICO',
      subtitle: 'Secuencia completa de encendido, POST, inicialización UEFI y kernel boot.',
      coverImage: ALL_TOMO_COVERS['08'],
      color: 'border-emerald-400/40 hover:border-emerald-400',
      badgeColor: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
      btnColor: 'bg-emerald-400 text-black hover:bg-emerald-300',
      hasPdf: true,
      onOpen: onOpenMagazineTomo08,
    },
  ];

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* HEADER DE MAGAZINE */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-800 pb-6">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono-tech tracking-widest text-cyan-400 uppercase font-black">
            PUBLICACIONES PERICIALES
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          EVO MAGAZINE // EDICIONES TÉCNICAS
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-2xl">
          Ediciones editoriales interactivas con dossiers de silicio de alta resolución, auditorías de kernel y guías de banco.
        </p>
      </div>

      {/* LISTA DE EDICIONES EDITORIALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazines.map((mag) => (
          <div
            key={mag.id}
            className="p-5 rounded-2xl bg-zinc-950 border evo-card-graphite flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Portada Vertical */}
              <div
                onClick={mag.onOpen}
                className="w-full h-56 rounded-xl overflow-hidden bg-black border border-zinc-800 relative cursor-pointer shadow-md"
              >
                <img
                  src={mag.coverImage}
                  alt={mag.title}
                  className="w-full h-full object-contain bg-zinc-950 opacity-90 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono-tech font-bold text-white border border-zinc-700">
                  {mag.edition}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-cyan-950/80 text-[10px] font-mono-tech font-bold text-cyan-200 border border-cyan-700/60">
                  TOMO {mag.tomoNum}
                </span>
              </div>

              <div className="space-y-1">
                <span className={`text-[9px] px-2 py-0.5 rounded font-mono-tech font-bold uppercase border ${mag.badgeColor}`}>
                  DOSSIER INTERACTIVO
                </span>
                <h3 className="font-display font-black text-base text-white uppercase pt-1">
                  {mag.title}
                </h3>
                <p className="font-sans-editorial text-xs text-zinc-300 leading-relaxed">
                  {mag.subtitle}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={mag.onOpen}
                className={`w-full py-2.5 rounded-xl ${mag.btnColor} font-mono-tech text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center`}
              >
                ABRIR MAGAZINE →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
