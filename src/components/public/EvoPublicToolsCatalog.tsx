import React, { useState, useMemo } from 'react';
import {
  Gauge,
  Search,
  ArrowRight,
  HelpCircle,
  Cpu,
  Terminal,
  Activity,
  Zap,
  HardDrive,
  Monitor,
  Shield,
  Layers,
  Wrench,
  FileText,
  Boxes,
  Compass,
  Sliders,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  EVO_MASTER_TOOLS_CATALOG,
  EvoToolDefinition,
  EvoToolCategory,
} from '../../data/evoToolsData';
import { EVO_TOOLS_BY_INTENT } from '../../data/evoLearningPaths';
import { normalizeVisibleStatus } from '../../utils/statusNormalizer';
import { getToolOwnerSection } from '../../data/evoOwnershipMap';
import { EvoLatencyCalculator } from '../tools/EvoLatencyCalculator';
import { EvoPcBuildArchitect } from '../tools/EvoPcBuildArchitect';

interface EvoPublicToolsCatalogProps {
  onExecuteToolAction: (tool: EvoToolDefinition) => void;
}

const HISTORIC_TOOL_NAMES: Record<string, string> = {
  'diag-boot-seq': 'CÓMO ARRANCA UNA PC',
  'diag-atx-power-bench': 'DIAGNOSTICAR UNA PC QUE NO INICIA',
  'diag-bsod-decoder': 'ANALIZAR UN PANTALLAZO AZUL',
  'diag-incident-events': 'ANALIZAR ERRORES',
  'diag-bottleneck-calc': 'ENCONTRÁ EL CUELLO DE BOTELLA',
  'diag-autodetect-pc': 'CONOCÉ LOS COMPONENTES DE TU PC',
  'diag-telemetry-integrity': 'VER QUÉ CONSUME MI PC',
  'diag-case-resolver': 'RESOLVER CASOS DIFÍCILES',
  'med-latency-calc': 'REVISÁ TU MEMORIA RAM',
  'med-frametime-analyzer': 'MEDIR FPS Y TIRONES',
  'med-sensors-telemetry': 'VER SENSORES EN TIEMPO REAL',
  'med-dpc-latency': 'ENCONTRAR LATENCIAS DE WINDOWS',
  'med-stress-stability': 'PROBAR UNA OPTIMIZACIÓN',
  'med-thermal-history': 'REVISAR TEMPERATURAS',
  'inv-pcb-schematic': 'EXPLORAR LA MOTHERBOARD',
  'inv-xray-kernel': 'CÓMO WINDOWS USA LA CPU',
  'inv-cache-imc-flow': 'CÓMO TRABAJA EL PROCESADOR',
  'inv-digital-twin': 'DIGITAL TWIN (GEMELO DIGITAL)',
  'inv-workstations-sectors': 'ELEGIR UN BANCO DE TRABAJO',
  'inv-coverage-matrix': 'REVISAR HARDWARE A FONDO',
  'rep-windows-repair': 'REPARAR WINDOWS',
  'rep-windows-install': 'INSTALAR WINDOWS',
  'rep-hotswap-bench': 'PROBAR COMPONENTES',
  'rep-core-repair-view': 'LAB CORE // REPARACIÓN DE BENCH',
  'opt-nt-services': 'SERVICIOS DE WINDOWS',
  'opt-core-optimization': 'OPTIMIZACIÓN CORE DE WINDOWS',
  'opt-ab-comparison': 'COMPARÁ ANTES Y DESPUÉS',
  'opt-upgrade-simulator': 'SIMULAR OTRO HARDWARE',
  'opt-build-architect': 'ARQUITECTO DE ARMADO DE PC',
  'doc-forensic-dossier': 'GENERADOR DE EXPEDIENTE PERICIAL',
  'doc-evidence-passport': 'PASAPORTE DE EVIDENCIA TÉCNICA',
  'doc-technical-dossier': 'INFORME TÉCNICO PERICIAL',
  'doc-content-factory': 'CONTENT FACTORY EDITORIAL',
  'doc-transfer-challenge': 'EVALUACIÓN DE TRANSFERENCIA',
};

const TOOL_VISUAL_MAP: Record<string, { icon: React.ElementType; accent: string }> = {
  'diag-boot-seq': { icon: Zap, accent: '#10B981' },
  'diag-bsod-decoder': { icon: Terminal, accent: '#38BDF8' },
  'diag-incident-events': { icon: Activity, accent: '#A855F7' },
  'diag-bottleneck-calc': { icon: Cpu, accent: '#F59E0B' },
  'diag-autodetect-pc': { icon: Monitor, accent: '#EAB308' },
  'diag-telemetry-integrity': { icon: Shield, accent: '#06B6D4' },
  'diag-atx-power-bench': { icon: Zap, accent: '#EF4444' },
  'diag-case-resolver': { icon: FileText, accent: '#EC4899' },
  'med-latency-calc': { icon: Cpu, accent: '#10B981' },
  'med-frametime-analyzer': { icon: Activity, accent: '#EC4899' },
  'med-sensors-telemetry': { icon: Monitor, accent: '#06B6D4' },
  'med-dpc-latency': { icon: Terminal, accent: '#38BDF8' },
  'med-stress-stability': { icon: Activity, accent: '#F59E0B' },
  'med-thermal-history': { icon: Activity, accent: '#EF4444' },
  'inv-pcb-schematic': { icon: Layers, accent: '#A855F7' },
  'inv-xray-kernel': { icon: Terminal, accent: '#00D2FF' },
  'inv-cache-imc-flow': { icon: Cpu, accent: '#EAB308' },
  'inv-digital-twin': { icon: Boxes, accent: '#00D2FF' },
  'inv-workstations-sectors': { icon: Compass, accent: '#A855F7' },
  'inv-coverage-matrix': { icon: Layers, accent: '#10B981' },
  'rep-windows-repair': { icon: Wrench, accent: '#A855F7' },
  'rep-windows-install': { icon: HardDrive, accent: '#00D2FF' },
  'rep-hotswap-bench': { icon: Wrench, accent: '#F59E0B' },
  'rep-core-repair-view': { icon: Wrench, accent: '#EF4444' },
  'opt-nt-services': { icon: Sliders, accent: '#38BDF8' },
  'opt-core-optimization': { icon: Sliders, accent: '#10B981' },
  'opt-ab-comparison': { icon: Activity, accent: '#38BDF8' },
  'opt-upgrade-simulator': { icon: Cpu, accent: '#F59E0B' },
  'opt-build-architect': { icon: Boxes, accent: '#10B981' },
  'doc-forensic-dossier': { icon: FileText, accent: '#EC4899' },
  'doc-evidence-passport': { icon: Shield, accent: '#EAB308' },
  'doc-technical-dossier': { icon: FileText, accent: '#38BDF8' },
  'doc-content-factory': { icon: Layers, accent: '#A855F7' },
  'doc-transfer-challenge': { icon: CheckCircle2, accent: '#10B981' },
};

export const EvoPublicToolsCatalog: React.FC<EvoPublicToolsCatalogProps> = ({
  onExecuteToolAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | EvoToolCategory>('ALL');
  const [activeToolModal, setActiveToolModal] = useState<'latency' | 'build' | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const canonicalTools = useMemo(() => {
    return EVO_MASTER_TOOLS_CATALOG.filter((t) => t.id !== 'diag-boot-seq');
  }, []);

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return canonicalTools.filter((t) => {
      if (selectedCategory !== 'ALL' && t.category.toUpperCase() !== selectedCategory.toUpperCase()) {
        return false;
      }
      const displayName = HISTORIC_TOOL_NAMES[t.id] || t.name;
      if (!q) return true;

      return (
        t.name.toLowerCase().includes(q) ||
        displayName.toLowerCase().includes(q) ||
        t.whatItDoes.toLowerCase().includes(q) ||
        t.whenToUse.toLowerCase().includes(q) ||
        t.inputRequired.toLowerCase().includes(q) ||
        t.outputDelivered.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.concepts.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [canonicalTools, searchQuery, selectedCategory]);

  const categoriesList: { id: 'ALL' | EvoToolCategory; label: string; count: number }[] = useMemo(() => [
    { id: 'ALL', label: 'TODAS', count: canonicalTools.length },
    { id: 'DIAGNOSTICAR', label: 'DIAGNÓSTICO', count: canonicalTools.filter(t => t.category.toUpperCase() === 'DIAGNOSTICAR').length },
    { id: 'MEDIR', label: 'MEDICIÓN', count: canonicalTools.filter(t => t.category.toUpperCase() === 'MEDIR').length },
    { id: 'INVESTIGAR', label: 'INVESTIGACIÓN', count: canonicalTools.filter(t => t.category.toUpperCase() === 'INVESTIGAR').length },
    { id: 'REPARAR', label: 'REPARACIÓN', count: canonicalTools.filter(t => t.category.toUpperCase() === 'REPARAR').length },
    { id: 'OPTIMIZAR', label: 'OPTIMIZACIÓN', count: canonicalTools.filter(t => t.category.toUpperCase() === 'OPTIMIZAR').length },
    { id: 'DOCUMENTAR', label: 'DOCUMENTACIÓN', count: canonicalTools.filter(t => t.category.toUpperCase() === 'DOCUMENTAR').length },
  ], [canonicalTools]);

  return (
    <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-mono-tech select-none text-zinc-100">
      
      {/* HEADER DE HERRAMIENTAS */}
      <div className="space-y-3 text-center sm:text-left border-b border-zinc-800/80 pb-6">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-mono-tech tracking-widest text-emerald-400 uppercase font-bold">
            UTILIDADES INDEPENDIENTES ({canonicalTools.length} HERRAMIENTAS CANÓNICAS)
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
          HERRAMIENTAS EVO LABS
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans-editorial max-w-3xl leading-relaxed">
          Catálogo de utilidades técnicas independientes. Soluciones autónomas para metrología de silicio, diagnóstico y optimización de sistemas.
        </p>
      </div>

      {/* BANNER DE ACCESO A OTRAS SECCIONES */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-zinc-300">
            ¿Buscás laboratorios interactivos de entrenamiento o análisis de tu PC real?
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-bold">
          <span className="text-zinc-500 uppercase text-[10px]">VER:</span>
          <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">LABORATORIOS</span>
          <span className="text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">ANALIZAR MI PC</span>
        </div>
      </div>

      {/* FILTROS Y BUSCADOR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar herramienta por nombre, función o concepto..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span>VISIBLES:</span>
            <strong className="text-emerald-400">{filteredTools.length}</strong>
            <span className="text-zinc-600">/</span>
            <span>{canonicalTools.length} CANÓNICAS</span>
          </div>
        </div>

        {/* Category Pills Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-400 text-black border-emerald-400 shadow-sm'
                    : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`ml-1.5 text-[10px] ${isSelected ? 'text-zinc-900 font-bold' : 'text-zinc-500'}`}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ESTADO VACÍO */}
      {filteredTools.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-300 font-bold uppercase">
            No se encontraron herramientas para "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold uppercase border border-zinc-800 transition-colors mt-2 cursor-pointer"
          >
            VER LAS {canonicalTools.length} HERRAMIENTAS
          </button>
        </div>
      )}

      {/* GRID DE TARJETAS COMPACTAS Y LIMPIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTools.map((tool) => {
          const displayName = HISTORIC_TOOL_NAMES[tool.id] || tool.name;
          const visual = TOOL_VISUAL_MAP[tool.id] || { icon: Gauge, accent: '#10B981' };
          const IconComp = visual.icon;
          const isExpanded = !!expandedCards[tool.id];

          return (
            <div
              key={tool.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div className="space-y-4">
                {/* Cabecera con categoría discreta y estado */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center border"
                      style={{
                        backgroundColor: `${visual.accent}15`,
                        borderColor: `${visual.accent}30`,
                        color: visual.accent,
                      }}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {tool.category} {tool.tomoId ? `• TOMO ${tool.tomoId}` : ''}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 font-bold">
                    ● {tool.status}
                  </span>
                </div>

                {/* Título claro de la herramienta */}
                <h3 className="font-display font-black text-lg text-white uppercase tracking-tight group-hover:text-emerald-300 transition-colors">
                  {displayName}
                </h3>

                {/* Beneficio en una frase / descripción directa */}
                <p className="text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                  {tool.whatItDoes}
                </p>

                {/* Acordeón de Detalles Técnicos (Oculto por defecto) */}
                {isExpanded && (
                  <div className="pt-3 pb-1 space-y-3 border-t border-zinc-900 text-xs text-zinc-400 font-mono-tech animate-fadeIn">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-1">
                        ¿Cuándo usarla?
                      </span>
                      <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed">{tool.whenToUse}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-900">
                      <div>
                        <span className="text-zinc-500 block uppercase font-bold text-[9px]">Entrada requerida:</span>
                        <span className="text-zinc-300 truncate block mt-0.5">{tool.inputRequired}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block uppercase font-bold text-[9px]">Salida entregada:</span>
                        <span className="text-emerald-400 font-bold truncate block mt-0.5">{tool.outputDelivered}</span>
                      </div>
                    </div>

                    {tool.concepts.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {tool.concepts.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botón de expansión y Botón de acción principal */}
              <div className="pt-4 mt-4 border-t border-zinc-900/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleCard(tool.id)}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase transition-colors cursor-pointer py-1"
                >
                  <span>{isExpanded ? 'Ocultar detalles' : 'Ver detalles'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (tool.id === 'med-latency-calc') setActiveToolModal('latency');
                    else if (tool.id === 'opt-build-architect') setActiveToolModal('build');
                    onExecuteToolAction(tool);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.15)] flex items-center gap-1.5"
                >
                  <span>USAR HERRAMIENTA</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Standalone Tool Modals */}
      {activeToolModal === 'latency' && (
        <EvoLatencyCalculator
          isModal={true}
          onClose={() => setActiveToolModal(null)}
        />
      )}

      {activeToolModal === 'build' && (
        <EvoPcBuildArchitect
          isModal={true}
          onClose={() => setActiveToolModal(null)}
        />
      )}

    </div>
  );
};
