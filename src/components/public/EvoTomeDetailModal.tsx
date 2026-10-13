import React from 'react';
import {
  X,
  BookOpen,
  Lock,
  Sparkles,
  Clock,
  Wrench,
  CheckCircle2,
  Terminal,
  Layers,
  FlaskConical,
  Eye,
  ShieldCheck,
  ChevronRight,
  Target,
  FileCheck,
} from 'lucide-react';
import { EvoTomeExpandedItem } from '../../data/evoTomesExpandedData';
import { TOME_DETAILED_CURRICULUM } from '../../data/tomeDetailedCurriculum';
import { EVO_MASTER_TOOLS_CATALOG, EvoToolDefinition } from '../../data/evoToolsData';
import { getTomeById } from '../../data/evoCatalog';

interface EvoTomeDetailModalProps {
  tome: EvoTomeExpandedItem;
  onClose: () => void;
  onOpenTomo: (tomeNumber: string) => void;
  onOpenSample?: (tomeNumber: string) => void;
}

export const EvoTomeDetailModal: React.FC<EvoTomeDetailModalProps> = ({
  tome,
  onClose,
  onOpenTomo,
  onOpenSample,
}) => {
  const curriculum = TOME_DETAILED_CURRICULUM[tome.number];
  const canonical = getTomeById(tome.number);

  const isFullReader = canonical?.runtimeStatus === 'FULL_READER';
  const isDossierOnly = canonical?.runtimeStatus === 'DOSSIER_ONLY';
  const isInDev = canonical?.editorialStatus === 'IN_DEVELOPMENT' || canonical?.runtimeStatus === 'LOCKED';

  // Map real associated tools from catalog
  const realTools: EvoToolDefinition[] = (curriculum?.associatedToolIds || [])
    .map((toolId) => EVO_MASTER_TOOLS_CATALOG.find((t) => t.id === toolId))
    .filter((t): t is EvoToolDefinition => Boolean(t));

  const hasTools = realTools.length > 0;
  const hasLab = Boolean(curriculum?.labName && curriculum.labName.trim() !== '');
  const hasSample = Boolean(curriculum?.hasRealSample);

  const handleOpenSampleAction = () => {
    if (onOpenSample) {
      onOpenSample(tome.number);
    } else {
      onOpenTomo(tome.number);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-4xl w-full rounded-2xl bg-[#090b10] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] font-mono-tech">
        {/* 1. MODAL TOP HEADER */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30">
              TOMO {tome.number}
            </span>
            <span className="text-zinc-600">/</span>
            <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight">
              {tome.title}
            </h3>
            <span className="hidden sm:inline-block text-zinc-600">•</span>
            <span className="hidden sm:inline-block text-[11px] text-zinc-400 uppercase font-mono-tech">
              {curriculum?.level || canonical?.levelName || 'NIVEL TÉCNICO OFICIAL'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-800"
            title="Cerrar ficha"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. PEDAGOGICAL PIPELINE RIBBON: TOMO → APRENDER → PRACTICAR → MEDIR → EVIDENCIA */}
        <div className="px-5 sm:px-6 py-2 bg-black border-b border-zinc-850 shrink-0">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider overflow-x-auto py-0.5 custom-scrollbar gap-2 text-zinc-500">
            <div className="flex items-center gap-1.5 text-amber-400 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>01. TOMO</span>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
            <div className="flex items-center gap-1.5 text-zinc-300 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
              <span>02. APRENDER</span>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
            <div className="flex items-center gap-1.5 text-zinc-300 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
              <span>03. LABORATORIOS</span>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
            <div className="flex items-center gap-1.5 text-zinc-300 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
              <span>04. MEDIR</span>
            </div>
            <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
            <div className="flex items-center gap-1.5 text-emerald-400 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>05. EVIDENCIA</span>
            </div>
          </div>
        </div>

        {/* 3. MODAL SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6 custom-scrollbar">
          {/* BLOQUE SUPERIOR: PORTADA + OVERVIEW EDITORIAL */}
          <div className="flex flex-col sm:flex-row gap-5 items-start bg-zinc-950/60 p-4 sm:p-5 rounded-xl border border-zinc-850">
            {/* Thumbnail Portada Vertical */}
            <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl overflow-hidden bg-black border border-zinc-800 shrink-0 relative shadow-lg mx-auto sm:mx-0">
              <img
                src={tome.coverImage}
                alt={tome.title}
                className="w-full h-full object-contain bg-zinc-950"
              />
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-mono-tech font-black text-amber-400 border border-amber-400/30">
                TOMO {tome.number}
              </span>
            </div>

            {/* Ficha Resumen */}
            <div className="space-y-3 flex-1 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block">
                  SUBTÍTULO & PROPÓSITO
                </span>
                <p className="text-zinc-200 font-sans-editorial text-sm font-semibold">
                  {tome.subtitle}
                </p>
                <p className="text-amber-300/90 font-sans-editorial text-xs italic mt-0.5">
                  “{tome.valuePhrase}”
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-850">
                {/* 7. PARA QUIÉN ES */}
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3 text-amber-400" />
                    7. PARA QUIÉN ES
                  </span>
                  <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed mt-0.5">
                    {curriculum?.targetAudience || 'Estudiantes, técnicos y entusiastas del hardware.'}
                  </p>
                </div>

                {/* 8. NIVEL */}
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3 text-amber-400" />
                    8. NIVEL & REQUISITOS
                  </span>
                  <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed mt-0.5">
                    {curriculum?.level || 'NIVEL GENERAL'}. Progresión modular sin requerir formación académica previa.
                  </p>
                </div>
              </div>

              {/* 9. RESULTADO FINAL & 10. QUÉ INCLUYE EL ACCESO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-850">
                {/* 9. RESULTADO FINAL */}
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    9. RESULTADO FINAL
                  </span>
                  <p className="text-zinc-300 font-sans-editorial text-xs leading-relaxed mt-0.5">
                    {curriculum?.finalResult || 'Acreditación técnica pericial al completar las prácticas y examen.'}
                  </p>
                </div>

                {/* 10. QUÉ INCLUYE EL ACCESO */}
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-amber-400" />
                    10. QUÉ INCLUYE EL ACCESO
                  </span>
                  <ul className="text-zinc-300 font-sans-editorial text-xs space-y-1 mt-0.5">
                    {(curriculum?.accessIncludes || [
                      'Lectura técnica completa sin recortes.',
                      'Acceso a bancos de simulación asociados.',
                      'Examen de acreditación y certificación.',
                    ]).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 text-[10px] mt-0.5">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 text-[10px] text-zinc-400 font-mono-tech">
                    Acceso permanente de por vida o incluido en suscripción EVO Complete.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID TÉCNICO DE 2 COLUMNAS: COGNITIVO VS INSTRUMENTAL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* COLUMNA IZQUIERDA: CONTENIDO COGNITIVO Y RESOLUTIVO */}
            <div className="space-y-4">
              {/* 1. QUÉ VAS A APRENDER */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    1. QUÉ VAS A APRENDER
                  </h4>
                </div>
                <ul className="space-y-2 pl-1 font-sans-editorial text-xs text-zinc-300">
                  {(curriculum?.whatYouWillLearn || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono-tech text-[10px] mt-0.5 font-bold">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. QUÉ PROBLEMAS VAS A SABER RESOLVER */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    2. QUÉ PROBLEMAS VAS A SABER RESOLVER
                  </h4>
                </div>
                <ul className="space-y-2 pl-1 font-sans-editorial text-xs text-zinc-300">
                  {(curriculum?.problemsYouWillSolve || []).map((prob, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono-tech text-[10px] mt-0.5 font-bold">
                        ✕
                      </span>
                      <span className="leading-relaxed">{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. QUÉ VAS A PODER HACER AL TERMINAR */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    3. QUÉ VAS A PODER HACER AL TERMINAR
                  </h4>
                </div>
                <ul className="space-y-2 pl-1 font-sans-editorial text-xs text-zinc-300">
                  {(curriculum?.whatYouWillBeAbleToDo || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-mono-tech text-[10px] mt-0.5 font-bold">
                        ▸
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* COLUMNA DERECHA: INSTRUMENTAL, LABORATORIOS Y PRÁCTICAS */}
            <div className="space-y-4">
              {/* 4. HERRAMIENTAS EVO INCLUIDAS */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      4. HERRAMIENTAS EVO INCLUIDAS
                    </h4>
                  </div>
                  {hasTools && (
                    <span className="text-[10px] text-zinc-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {realTools.length} {realTools.length === 1 ? 'HERRAMIENTA' : 'HERRAMIENTAS'}
                    </span>
                  )}
                </div>

                {hasTools ? (
                  <div className="space-y-1.5">
                    {realTools.map((tool) => (
                      <div
                        key={tool.id}
                        className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                          <span className="text-xs font-mono-tech text-zinc-200 truncate font-semibold">
                            {tool.name}
                          </span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-400/20 uppercase shrink-0 font-bold">
                          {tool.category}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-zinc-900/30 border border-dashed border-zinc-800 text-center">
                    <p className="text-zinc-500 font-mono-tech text-xs italic">
                      Sin herramienta específica asociada
                    </p>
                  </div>
                )}
              </div>

              {/* 5. LABORATORIOS / SIMULADORES INCLUIDOS */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      5. LABORATORIOS / SIMULADORES INCLUIDOS
                    </h4>
                  </div>
                  {hasLab && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                      DISPONIBLE
                    </span>
                  )}
                </div>

                {hasLab ? (
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                    <div className="text-xs font-bold text-white font-mono-tech flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>{curriculum?.labName}</span>
                    </div>
                    <p className="text-xs font-sans-editorial text-zinc-400 leading-relaxed">
                      {curriculum?.labDescription}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-zinc-900/30 border border-dashed border-zinc-800 text-center">
                    <p className="text-zinc-500 font-mono-tech text-xs italic">
                      Sin laboratorio específico asociado
                    </p>
                  </div>
                )}
              </div>

              {/* 6. PRÁCTICAS REALES */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    6. PRÁCTICAS REALES
                  </h4>
                </div>
                <ul className="space-y-2 pl-1 font-sans-editorial text-xs text-zinc-300">
                  {(curriculum?.realPractices || []).map((prac, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400 font-mono-tech text-[10px] mt-0.5 font-bold">
                        [{idx + 1}]
                      </span>
                      <span className="leading-relaxed">{prac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MODAL FOOTER BAR */}
        <div className="px-5 sm:px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* BOTÓN MUESTRA (SI EXISTE CONTENIDO DEMO O MUESTRA EDITORIAL REAL) */}
          <div className="flex items-center gap-2">
            {hasSample ? (
              <button
                type="button"
                onClick={handleOpenSampleAction}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-400/40 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>[ VER MUESTRA ]</span>
              </button>
            ) : (
              <span className="text-[11px] text-zinc-500 font-mono-tech hidden sm:inline-block">
                Acceso completo al módulo pericial
              </span>
            )}
          </div>

          {/* ACCIONES PRINCIPALES */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-bold transition-colors cursor-pointer"
            >
              CERRAR
            </button>

            {isFullReader ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTomo(tome.number);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>ENTRAR AL TOMO →</span>
              </button>
            ) : isDossierOnly ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTomo(tome.number);
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-zinc-700"
              >
                <span>VER DOSSIER CURRICULAR →</span>
              </button>
            ) : isInDev ? (
              <span className="px-4 py-2.5 rounded-xl bg-zinc-900 text-amber-400 text-xs font-bold uppercase border border-amber-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>EN PROCESO DE DESARROLLO</span>
              </span>
            ) : (
              <span className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 text-xs font-bold uppercase border border-zinc-800">
                NO DISPONIBLE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
