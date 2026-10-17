import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
} from 'lucide-react';
import { EVO_TOMES_EXPANDED_DATA, EvoTomeExpandedItem } from '../../data/evoTomesExpandedData';
import { EvoTomeDetailModal } from './EvoTomeDetailModal';
import { EvoTomeCardExpanded } from '../world/EvoTomeCardExpanded';

interface EvoPublicTomosCatalogProps {
  onOpenTomo: (tomoNumber: string) => void;
  onOpenMagazine?: (tomoNumber?: string) => void;
  onOpenLab?: (labType: string) => void;
}

export const EvoPublicTomosCatalog: React.FC<EvoPublicTomosCatalogProps> = ({
  onOpenTomo,
  onOpenMagazine,
  onOpenLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HARDWARE' | 'WINDOWS' | 'REPARACION' | 'REDES' | 'SEGURIDAD' | 'RENDIMIENTO' | 'PROGRAMACION' | 'IA' | 'ELECTRONICA' | 'GAMEDEV'>('ALL');
  const [selectedTomeDetail, setSelectedTomeDetail] = useState<EvoTomeExpandedItem | null>(null);

  const filterCategoryMap: Record<string, string[]> = {
    HARDWARE: ['01', '03', '04', '11'],
    WINDOWS: ['02', '08'],
    REPARACION: ['03', '04', '08', '11'],
    REDES: ['05'],
    SEGURIDAD: ['06'],
    RENDIMIENTO: ['07'],
    PROGRAMACION: ['09', '12'],
    IA: ['10'],
    ELECTRONICA: ['11'],
    GAMEDEV: ['12'],
  };

  const filteredTomos = EVO_TOMES_EXPANDED_DATA.filter((tome) => {
    const matchesSearch =
      tome.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tome.number.includes(searchQuery) ||
      tome.valuePhrase.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'ALL') return true;

    const allowedNumbers = filterCategoryMap[selectedFilter] || [];
    return allowedNumbers.includes(tome.number);
  });

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-mono-tech select-none">
      
      {/* HEADER EDITORIAL DEL CATÁLOGO */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-mono-tech tracking-widest text-amber-400 uppercase font-black">
            CATÁLOGO OFICIAL EVO LABS (12 TOMOS)
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            DEMO // INCLUIDO EN PLAN GRATIS (TOMO 01)
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          LOS 12 TOMOS DE EVO LABS
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-sans-editorial max-w-2xl">
          Elegí el área que querés dominar. Cada tomo combina rigor científico, esquemáticos de silicio, bancos de simulación interactivos y exámenes periciales de acreditación.
        </p>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por número, título o concepto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono-tech text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Filtros por Categoría */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono-tech text-xs custom-scrollbar">
          {(['ALL', 'HARDWARE', 'WINDOWS', 'REPARACION', 'REDES', 'SEGURIDAD', 'RENDIMIENTO', 'PROGRAMACION', 'IA', 'ELECTRONICA', 'GAMEDEV'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat === 'ALL' ? 'TODOS (12)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* LISTADO DE LOS 12 TOMOS VERTICALES (UNO DEBAJO DEL OTRO // FORMATO EXPANDIDO 3 COLUMNAS) */}
      <div className="space-y-6">
        {filteredTomos.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono-tech text-sm">
            No se encontraron tomos con los criterios de búsqueda o filtro seleccionados.
          </div>
        ) : (
          filteredTomos.map((tome) => (
            <EvoTomeCardExpanded
              key={tome.id}
              tome={tome}
              isActiveStudy={tome.number === '01'}
              onOpenTomo={(tomeNum) => onOpenTomo(tomeNum)}
              onOpenLab={(actionKey) => {
                if (onOpenLab) {
                  onOpenLab(actionKey || 'lab-01');
                } else {
                  onOpenTomo(tome.number);
                }
              }}
              onOpenDossier={(tomeNum) => {
                const fullTome = EVO_TOMES_EXPANDED_DATA.find((t) => t.number === tomeNum);
                if (fullTome) setSelectedTomeDetail(fullTome);
              }}
              onOpenMagazine={(tomeNum) => {
                if (onOpenMagazine) {
                  onOpenMagazine(tomeNum);
                } else {
                  const fullTome = EVO_TOMES_EXPANDED_DATA.find((t) => t.number === tomeNum);
                  if (fullTome) setSelectedTomeDetail(fullTome);
                }
              }}
            />
          ))
        )}
      </div>

      {/* MODAL DETALLE DE TOMO ESTRICTO (10 PUNTOS EDITORIALES & TÉCNICOS) */}
      {selectedTomeDetail && (
        <EvoTomeDetailModal
          tome={selectedTomeDetail}
          onClose={() => setSelectedTomeDetail(null)}
          onOpenTomo={(tomeNum) => {
            setSelectedTomeDetail(null);
            onOpenTomo(tomeNum);
          }}
          onOpenSample={(tomeNum) => {
            setSelectedTomeDetail(null);
            if (onOpenMagazine) {
              onOpenMagazine(tomeNum);
            } else {
              onOpenTomo(tomeNum);
            }
          }}
        />
      )}

    </div>
  );
};
