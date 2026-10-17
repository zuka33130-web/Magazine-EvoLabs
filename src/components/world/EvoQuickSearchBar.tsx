import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Zap,
  FileCheck2,
  Wrench,
  X,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import {
  EVO_TOMES_PEDAGOGY,
  EVO_LAB_GUIDES,
  EVO_TOOLS_BY_INTENT,
  EvoToolCardDefinition,
} from '../../data/evoLearningPaths';
import { EvoCaseRepository } from '../evoLabCore/services/caseRepository';
import { EvoToolDefinition } from '../../data/evoToolsData';

export type SearchCategory = 'todos' | 'tomos' | 'laboratorios' | 'expedientes' | 'herramientas';

export interface SearchResultItem {
  id: string;
  type: 'tomo' | 'lab' | 'expediente' | 'herramienta';
  title: string;
  subtitle: string;
  badge: string;
  categoryLabel: string;
  actionKey?: string;
  subParam?: string;
  tomoNumber?: string;
  caseId?: string;
  toolDef?: EvoToolDefinition | EvoToolCardDefinition;
}

export interface EvoQuickSearchBarProps {
  onOpenTomo: (tomoNumber: string) => void;
  onOpenLab: (actionKey: string, subParam?: string) => void;
  onOpenCase: (caseId?: string) => void;
  onOpenTool: (tool: any) => void;
  className?: string;
}

export const EvoQuickSearchBar: React.FC<EvoQuickSearchBarProps> = ({
  onOpenTomo,
  onOpenLab,
  onOpenCase,
  onOpenTool,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('todos');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build static & dynamic search index
  const allSearchableItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. TOMOS (01 - 10)
    Object.values(EVO_TOMES_PEDAGOGY).forEach((t) => {
      items.push({
        id: `tomo-${t.tomoNumber}`,
        type: 'tomo',
        title: `Tomo ${t.tomoNumber}: ${t.title}`,
        subtitle: `${t.tagline} · Nivel ${t.levelNumber} (${t.levelName}) · ${t.whatYouWillLearn.slice(0, 2).join(' ')}`,
        badge: `TOMO ${t.tomoNumber}`,
        categoryLabel: 'Tomos',
        tomoNumber: t.tomoNumber,
      });
    });

    // 2. LABORATORIOS
    Object.values(EVO_LAB_GUIDES).forEach((lab) => {
      items.push({
        id: `lab-${lab.id}`,
        type: 'lab',
        title: lab.name,
        subtitle: `${lab.whatIsThisLab} · ${lab.whatYouWillPractice}`,
        badge: 'LABORATORIO',
        categoryLabel: 'Laboratorios',
        actionKey: lab.actionKey,
      });
    });

    // 3. EXPEDIENTES / CASOS FORENSES
    try {
      const cases = EvoCaseRepository.getAllCases();
      if (cases && cases.length > 0) {
        cases.forEach((c) => {
          items.push({
            id: `case-${c.id}`,
            type: 'expediente',
            title: `Caso: ${c.title}`,
            subtitle: `Expediente ${c.caseType} · Estado: ${c.isClosed ? 'Cerrado' : 'Abierto'} · ${c.summary || c.conclusionNotes || 'Investigación pericial'}`,
            badge: 'EXPEDIENTE',
            categoryLabel: 'Expedientes',
            caseId: c.id,
          });
        });
      } else {
        // Fallback default sample cases if repository empty
        const defaultCases = [
          { id: 'case-fps-01', title: 'Caso: Micro-stuttering en percentiles 1% low', type: 'Frametime & Latencia', desc: 'Investigación pericial de caídas de cuadros y latencia DPC' },
          { id: 'case-bsod-02', title: 'Caso: BSOD DPC Watchdog Violation', type: 'Kernel NT', desc: 'Análisis de volcado de memoria y conflicto de drivers' },
          { id: 'case-thermal-03', title: 'Caso: Thermal Throttling en VRM VCore', type: 'Hardware & Temperatura', desc: 'Estrangulamiento térmico y caída de reloj en CPU' },
        ];
        defaultCases.forEach((dc) => {
          items.push({
            id: dc.id,
            type: 'expediente',
            title: dc.title,
            subtitle: `${dc.type} · ${dc.desc}`,
            badge: 'EXPEDIENTE',
            categoryLabel: 'Expedientes',
            caseId: dc.id,
          });
        });
      }
    } catch {
      // ignore
    }

    // 4. HERRAMIENTAS
    EVO_TOOLS_BY_INTENT.forEach((tool) => {
      items.push({
        id: `tool-${tool.id}`,
        type: 'herramienta',
        title: tool.simpleName,
        subtitle: `${tool.whatItDoes} · ${tool.concepts.slice(0, 3).join(', ')}`,
        badge: 'HERRAMIENTA',
        categoryLabel: 'Herramientas',
        toolDef: tool,
        actionKey: tool.actionKey,
        subParam: tool.subParam,
      });
    });

    return items;
  }, []);

  // Filter items
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSearchableItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'todos' ||
        (activeCategory === 'tomos' && item.type === 'tomo') ||
        (activeCategory === 'laboratorios' && item.type === 'lab') ||
        (activeCategory === 'expedientes' && item.type === 'expediente') ||
        (activeCategory === 'herramientas' && item.type === 'herramienta');

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [allSearchableItems, query, activeCategory]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Global Keyboard Shortcut: ⌘K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');

    if (item.type === 'tomo' && item.tomoNumber) {
      onOpenTomo(item.tomoNumber);
    } else if (item.type === 'lab' && item.actionKey) {
      onOpenLab(item.actionKey, item.subParam);
    } else if (item.type === 'expediente') {
      onOpenCase(item.caseId);
    } else if (item.type === 'herramienta' && item.toolDef) {
      onOpenTool(item.toolDef);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  const getTypeIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'tomo':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'lab':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'expediente':
        return <FileCheck2 className="w-4 h-4 text-purple-400" />;
      case 'herramienta':
        return <Wrench className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getTypeBadgeStyle = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'tomo':
        return 'bg-amber-400/10 text-amber-300 border-amber-400/30';
      case 'lab':
        return 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30';
      case 'expediente':
        return 'bg-purple-400/10 text-purple-300 border-purple-400/30';
      case 'herramienta':
        return 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30';
    }
  };

  return (
    <div ref={containerRef} className={`relative font-sans-editorial ${className}`}>
      {/* Barra de entrada de búsqueda */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 pointer-events-none text-zinc-400 flex items-center">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Buscar tomo, laboratorio, expediente o herramienta... (⌘K)"
          className="w-full pl-10 pr-24 py-2 sm:py-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700 focus:border-amber-400/80 focus:bg-zinc-900/95 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 font-mono-tech transition-all outline-none shadow-inner"
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono-tech font-bold text-zinc-400 select-none">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Menú Desplegable Flotante de Resultados */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#090c13]/98 border border-zinc-800 backdrop-blur-2xl shadow-2xl overflow-hidden font-mono-tech animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Categorías de Filtro */}
          <div className="px-3 pt-3 pb-2 border-b border-zinc-800/80 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
            <div className="flex items-center gap-1.5 text-xs">
              {(['todos', 'tomos', 'laboratorios', 'expedientes', 'herramientas'] as SearchCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-zinc-500 shrink-0 hidden sm:inline">
              {filteredResults.length} resultado{filteredResults.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Lista de Resultados con animación suave fade-in */}
          <div
            key={`${query}-${activeCategory}`}
            className="max-h-80 sm:max-h-96 overflow-y-auto p-1.5 space-y-1 custom-scrollbar animate-in fade-in duration-200"
          >
            {filteredResults.length === 0 ? (
              <div className="py-8 text-center space-y-2 animate-in fade-in duration-150">
                <Search className="w-6 h-6 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400 font-sans-editorial">
                  No se encontraron resultados para <span className="text-amber-400 font-bold">"{query}"</span>
                </p>
                <span className="text-[10px] text-zinc-500 font-mono-tech block">
                  Probá buscando "Tomo 01", "Boot Lab", "BSOD", "FPS" o "Latencia".
                </span>
              </div>
            ) : (
              filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-zinc-800/90 border border-amber-400/40 shadow-md translate-x-0.5'
                        : 'hover:bg-zinc-900/70 border border-transparent hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                        {getTypeIcon(item.type)}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold tracking-wider ${getTypeBadgeStyle(item.type)}`}>
                            {item.badge}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {item.title}
                          </h4>
                        </div>

                        <p className="text-[11px] text-zinc-400 font-sans-editorial line-clamp-1">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 text-zinc-500">
                      {isSelected && (
                        <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-400 mr-1">
                          <span>Enter</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer de atajos */}
          <div className="p-2 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-[10px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span>↑ ↓ para navegar</span>
              <span>•</span>
              <span>Enter para abrir</span>
              <span>•</span>
              <span>Esc para cerrar</span>
            </div>
            <span className="text-amber-400 font-bold">EVO LABS // BÚSQUEDA RÁPIDA</span>
          </div>
        </div>
      )}
    </div>
  );
};
