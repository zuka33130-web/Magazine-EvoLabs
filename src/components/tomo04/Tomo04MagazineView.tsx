import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Compass,
  Download,
  HelpCircle,
  X,
  CheckCircle2,
  ExternalLink,
  FileDown,
  Copy,
  Wrench,
  ShieldAlert,
  Terminal,
  Activity,
  Check,
  Zap,
  Laptop,
  Flame,
  Maximize2,
} from 'lucide-react';
import { Tomo04MasterPage } from './Tomo04MasterPage';
import {
  TOMO_04_META,
  NOTEBOOK_BASE_KIT,
  TOMO_04_MODULES,
  TOMO_04_CASES,
  TOMO_04_GLOSSARY,
} from '../../data/tomo04Data';

interface Tomo04MagazineViewProps {
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04') => void;
  initialPage?: number;
}

type ViewMode = 'continuous' | 'single';

export const Tomo04MagazineView: React.FC<Tomo04MagazineViewProps> = ({
  onBackToApp,
  onNavigateTomo,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>('continuous');
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const totalPages = TOMO_04_META.totalPages;

  const isInIframe = (() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const getStandalonePrintUrl = () => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('volume', '04');
      u.searchParams.set('mode', 'magazine');
      u.searchParams.set('print', 'true');
      return u.toString();
    } catch {
      return window.location.href;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  const handleCopySnippet = (snippet: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
      setCopiedSnippet(snippet);
      setTimeout(() => setCopiedSnippet(null), 2200);
    }
  };

  const handleNativePrint = () => {
    setViewMode('continuous');
    setIsPreparingPrint(true);
    setTimeout(() => {
      window.print();
      setIsPreparingPrint(false);
    }, 300);
  };

  const handleDownloadOfflineHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${TOMO_04_META.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A070E; color: #E4E4E7; margin: 0; padding: 20px; }
    h1 { color: #A855F7; font-size: 28px; border-bottom: 2px solid #A855F7; padding-bottom: 8px; }
    h2 { color: #C084FC; margin-top: 30px; }
    pre { background: #3B0764; padding: 12px; border-radius: 6px; border: 1px solid #581C87; overflow-x: auto; color: #E9D5FF; }
    .box { border: 1px solid #3B0764; background: #1E0836; padding: 16px; margin-bottom: 16px; border-radius: 8px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: rgba(168, 85, 247, 0.2); color: #A855F7; }
  </style>
</head>
<body>
  <h1>${TOMO_04_META.title}</h1>
  <p><strong>${TOMO_04_META.subtitle}</strong></p>
  <p><em>${TOMO_04_META.manifestoPhrase}</em></p>
  <hr style="border-color: #3B0764;">
  ${TOMO_04_MODULES.map(
    (m) => `
    <div class="box">
      <span class="badge">MÓDULO ${m.moduleNumber} // ${m.categoryTag}</span>
      <h2>${m.title}</h2>
      <p><em>${m.subtitle}</em></p>
      <p><strong>Herramienta:</strong> ${m.portableTool}</p>
      <p><strong>Árbol Deductivo:</strong> ${m.decisionTree.question}</p>
      <p>Sí: ${m.decisionTree.yesAction} | No: ${m.decisionTree.noAction}</p>
      ${m.multimeterMeasurement ? `<p><strong>Medición con multímetro:</strong> ${m.multimeterMeasurement}</p>` : ''}
    </div>`
  ).join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO_LABS_TOMO_04_REPARA_TU_NOTEBOOK.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#08050C] text-zinc-100 flex flex-col font-sans-editorial selection:bg-purple-400 selection:text-black">
      {/* Top Floating Technical Editorial Toolbar (Screen Only) */}
      <nav
        aria-label="Barra de herramientas de la revista"
        className="sticky top-0 z-50 bg-[#0A0710]/95 backdrop-blur-md border-b border-purple-950/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech select-none print:hidden"
      >
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-purple-900/60 hover:border-purple-400 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-purple-400" />
              <span className="font-bold">VOLVER</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-purple-400 rounded-none inline-block shadow-[0_0_8px_#A855F7]" />
            <span className="font-black text-white tracking-widest hidden sm:inline">
              EVO LABS // TOMO 04
            </span>
            <span className="text-purple-400 text-[11px] font-bold">
              REPARÁ TU NOTEBOOK // MICROMECÁNICA
            </span>
          </div>

          {/* Tomo Selector */}
          <div className="flex items-center gap-1 bg-zinc-950/90 p-1 rounded-xl border border-purple-950 ml-2">
            <span className="text-[10px] font-mono-tech text-zinc-500 font-bold px-1.5 hidden lg:inline">COLECCIÓN:</span>
            <button
              type="button"
              onClick={() => onNavigateTomo ? onNavigateTomo('01') : onBackToApp?.()}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-amber-400 hover:bg-amber-950/40 border border-amber-500/30 transition-all cursor-pointer"
              title="Tomo 01: La Guía Definitiva del Hardware"
            >
              T01
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('02')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/30 transition-all cursor-pointer"
              title="Tomo 02: La Biblia Negra de Windows"
            >
              T02
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('03')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/30 transition-all cursor-pointer"
              title="Tomo 03: Repará tu Propia PC"
            >
              T03
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('04')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-purple-500 text-white border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)] cursor-pointer"
              title="Tomo 04: Microelectrónica y Portátiles"
            >
              T04
            </button>
          </div>
        </div>

        {/* Center: View mode toggles */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-purple-950">
          <button
            type="button"
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === 'continuous'
                ? 'bg-purple-500 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            VISTA COMPLETA A4
          </button>
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-purple-500 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            PÁGINA INDIVIDUAL
          </button>
        </div>

        {/* Right: Print / Download PDF actions */}
        <div className="flex items-center gap-2">
          {viewMode === 'single' && (
            <div className="flex items-center gap-1.5 mr-2 text-zinc-400">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-purple-300 font-bold">
                {String(currentPage).padStart(2, '0')} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-40 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DESCARGAR PDF A4</span>
          </button>
        </div>
      </nav>

      {/* Main Magazine Pages Container */}
      <main className="flex-1 py-8 px-2 sm:px-4 flex flex-col items-center gap-8 print:p-0 print:m-0 print:gap-0">
        {/* ========================================================
            PAGE 01: COVER
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 1) && (
          <Tomo04MasterPage
            pageId="t04-page-01"
            pageNumber={1}
            isCover
            hideHeaderFooter
            accentColor="#A855F7"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#050208] via-[#090510] to-[#040206] text-white">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

              {/* Cover Masthead */}
              <div className="relative z-10 border-b-2 border-purple-400 pb-5">
                <div className="flex items-center justify-between text-[11px] font-mono-tech tracking-widest text-purple-400 mb-2">
                  <span>EVO LABS // REPARACIÓN PORTÁTIL</span>
                  <span>PUBLICACIÓN OFICIAL 2026 // VOL. 04</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tighter text-white uppercase leading-none">
                    REPARÁ TU<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                      NOTEBOOK
                    </span>
                  </h1>
                  <span className="text-4xl font-mono-tech font-bold text-purple-400 hidden sm:block">
                    04
                  </span>
                </div>
                <p className="mt-3 text-sm sm:text-base text-zinc-300 font-mono-tech uppercase tracking-wide">
                  LA BIBLIA DEL REPARADOR DE COMPUTADORAS PORTÁTILES
                </p>
              </div>

              {/* Cover Center Art / Laptop Diagram */}
              <div className="relative z-10 my-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl p-6 rounded-2xl border border-purple-900/60 bg-[#12081E]/80 backdrop-blur-sm shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-950 text-xs font-mono-tech text-purple-400">
                    <span>MICROMECÁNICA & ECOSISTEMA TÉRMICO</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 rounded border border-purple-500/30 text-[10px]">
                      BANCO DE PORTÁTILES
                    </span>
                  </div>

                  <div className="py-6 font-mono-tech text-xs text-zinc-300 space-y-2">
                    <div className="p-2.5 rounded bg-black/50 border border-purple-950 flex items-center justify-between">
                      <span className="text-purple-300 font-bold">DESMONTAJE SEGURO:</span>
                      <span className="text-zinc-400">Spudgers, mapa de tornillos y regla de la batería</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-purple-950 flex items-center justify-between">
                      <span className="text-purple-300 font-bold">ENERGÍA & CARGADORES:</span>
                      <span className="text-zinc-400">Voltajes 19V/20V, pin ID Dell/HP, DC Jack y Type-C PD</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-purple-950 flex items-center justify-between">
                      <span className="text-purple-300 font-bold">PANTALLAS & FLEX eDP:</span>
                      <span className="text-zinc-400">30/40 pines, prueba de linterna, backlight y bisagras</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-purple-950 flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                    <span>“UNA NOTEBOOK ES UN ECOSISTEMA INTEGRADO.”</span>
                    <span className="text-purple-400 font-bold">50 PÁGINAS A4</span>
                  </div>
                </div>
              </div>

              {/* Cover Footer & Barcode */}
              <div className="relative z-10 pt-4 border-t border-purple-950/80 flex items-end justify-between text-xs font-mono-tech text-zinc-400">
                <div>
                  <p className="font-bold text-white uppercase text-sm">EDITORIAL EVO LABS</p>
                  <p className="text-[11px] text-zinc-400">Formato Revista A4 // Sin Placeholders // Protocolos de Laboratorio</p>
                </div>
                <div className="text-right">
                  <div className="tracking-widest font-mono-tech text-sm text-purple-400 font-bold">
                    |||||||| | |||| | |||||||
                  </div>
                  <span className="text-[9px] text-zinc-500">ISBN-EVO-T04-2026</span>
                </div>
              </div>
            </div>
          </Tomo04MasterPage>
        )}

        {/* ========================================================
            PAGE 02: MANIFIESTO & KIT DE PRECISIÓN DE PORTÁTILES
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 2) && (
          <Tomo04MasterPage
            pageId="t04-page-02"
            pageNumber={2}
            sectionTitle="EL BANCO PORTÁTIL"
            subSlug="KIT DE MICROMECÁNICA"
            accentColor="#A855F7"
          >
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tech text-purple-400 uppercase tracking-widest">
                  INSTRUMENTAL ESPECIALIZADO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  HERRAMIENTAS PARA DESARMAR SIN DESTRUIR
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  En notebooks la fuerza bruta rompe clips plásticos, arranca pistas y quema pantallas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono-tech">
                {NOTEBOOK_BASE_KIT.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-purple-950 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-purple-400 font-bold">{tool.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[9px] font-bold">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
                        <strong>Para qué sirve:</strong> {tool.whatItDoes}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[9px] text-zinc-500">
                      <strong>Riesgo:</strong> {tool.riskNotice}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs font-mono-tech text-purple-300 flex items-center justify-between">
                <span>REGLA CERO DE LA NOTEBOOK:</span>
                <span className="text-white font-bold">
                  “LO PRIMERO QUE SE DESCONECTA AL ABRIR ES LA BATERÍA INTERNA. NUNCA TOCAR PANTALLA NI FLEX CON BATERÍA PUESTA.”
                </span>
              </div>
            </div>
          </Tomo04MasterPage>
        )}

        {/* ========================================================
            PAGE 03: ÍNDICE DE LOS 33 MÓDULOS DE PORTÁTILES
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 3) && (
          <Tomo04MasterPage
            pageId="t04-page-03"
            pageNumber={3}
            sectionTitle="SUMARIO DE PORTÁTILES"
            subSlug="ÍNDICE DE 33 MÓDULOS"
            accentColor="#A855F7"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-purple-400 uppercase tracking-widest">
                  SECUENCIA COMPLETA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ÍNDICE MAESTRO DE NOTEBOOKS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  33 módulos ordenados: desde la identificación exterior hasta el chip EC y la micro-soldadura.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_04_MODULES.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (viewMode === 'single') {
                        setCurrentPage(4);
                      }
                      const el = document.getElementById(`t04-mod-${m.moduleNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded bg-zinc-950/60 border border-purple-950 hover:border-purple-500/60 transition-all flex items-start gap-2.5 cursor-pointer group"
                  >
                    <span className="text-purple-400 font-bold group-hover:text-purple-300">
                      [{m.moduleNumber}]
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] group-hover:text-purple-200">
                          {m.title}
                        </span>
                        <span className="text-[9px] text-zinc-500">{m.readTime}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] font-mono-tech text-zinc-500 text-center">
                HAZ CLIC EN CUALQUIER MÓDULO PARA ABRIR DIRECTAMENTE SU GUÍA DE MICROMECÁNICA
              </div>
            </div>
          </Tomo04MasterPage>
        )}

        {/* ========================================================
            MODULE PAGES: 33 LAPTOP REPAIR MODULES (A4 SPREADS)
        ======================================================== */}
        {TOMO_04_MODULES.map((mod, idx) => {
          const modPageNumber = 4 + idx;
          if (viewMode === 'single' && currentPage !== modPageNumber) {
            return null;
          }

          return (
            <Tomo04MasterPage
              key={mod.id}
              pageId={`t04-mod-${mod.moduleNumber}`}
              pageNumber={modPageNumber}
              sectionTitle={`MÓDULO ${mod.moduleNumber}`}
              subSlug={mod.categoryTag}
              accentColor="#A855F7"
            >
              <div className="h-full flex flex-col justify-between space-y-3.5">
                {/* Module Header */}
                <div className="border-b border-purple-950 pb-3">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-purple-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800 text-[10px] font-bold">
                      {mod.categoryTag}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Lectura: {mod.readTime}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          mod.safetyBadge === 'VERDE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : mod.safetyBadge === 'AMARILLO'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        NIVEL {mod.safetyBadge}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-display font-black text-white tracking-tight">
                    {mod.moduleNumber}. {mod.title}
                  </h2>
                  <p className="text-xs font-mono-tech text-purple-300 mt-0.5">
                    {mod.subtitle}
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Left Column: Summary & Decision Tree */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-zinc-950/70 border border-purple-950">
                      <span className="text-[10px] font-mono-tech text-purple-400 uppercase tracking-wider block mb-1">
                        ANATOMÍA & DIAGNÓSTICO
                      </span>
                      <p className="text-zinc-300 font-sans-editorial leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-purple-900/60 font-mono-tech text-xs">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider block mb-2">
                        ÁRBOL DEDUCTIVO // CAMINO CRÍTICO
                      </span>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="text-white font-semibold">
                          ❓ {mod.decisionTree.question}
                        </div>
                        <div className="text-emerald-400 pl-3 border-l-2 border-emerald-500">
                          ✔ SÍ: {mod.decisionTree.yesAction}
                        </div>
                        <div className="text-amber-400 pl-3 border-l-2 border-amber-500">
                          ✖ NO: {mod.decisionTree.noAction}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 font-mono-tech text-[11px] text-zinc-400">
                      <span className="text-zinc-300 font-bold block mb-1">HERRAMIENTA CLAVE:</span>
                      <span className="text-purple-400">{mod.portableTool}</span>
                    </div>
                  </div>

                  {/* Right Column: Multimeter & Practical Commands */}
                  <div className="space-y-3">
                    {mod.multimeterMeasurement && (
                      <div className="p-3 rounded-xl bg-[#1A0A2A] border border-purple-900 font-mono-tech text-xs">
                        <div className="flex items-center gap-1 text-[10px] text-purple-400 font-bold mb-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          <span>MEDICIÓN ELÉCTRICA EN NOTEBOOK</span>
                        </div>
                        <p className="text-purple-200 text-[11px] leading-relaxed">
                          {mod.multimeterMeasurement}
                        </p>
                      </div>
                    )}

                    {mod.practicalCommand && (
                      <div className="p-3 rounded-xl bg-black/80 border border-purple-900">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech text-purple-400 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>COMANDO TÉCNICO</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(mod.practicalCommand!)}
                            className="px-2 py-0.5 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            {copiedSnippet === mod.practicalCommand ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">COPIADO</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>COPIAR</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-2 rounded bg-black font-mono-tech text-[11px] text-purple-300 overflow-x-auto border border-purple-950 select-all">
                          <code>{mod.practicalCommand}</code>
                        </pre>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    <div className="p-3 rounded-xl bg-zinc-950/70 border border-purple-950 space-y-1.5 text-xs font-mono-tech">
                      <span className="text-[10px] text-purple-400 uppercase tracking-wider block">
                        REGLAS DE ORO DE MICROMECÁNICA
                      </span>
                      {mod.keyTakeaways.map((kt, kIdx) => (
                        <div key={kIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                          <span className="text-purple-400">▸</span>
                          <span>{kt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Callout */}
                <div className="p-2 rounded bg-purple-950/20 border border-purple-900/40 text-[10px] font-mono-tech text-purple-300 flex items-center justify-between">
                  <span>EVO LABS // GUÍA DE REPARACIÓN DE PORTÁTILES</span>
                  <span className="text-zinc-500">MÓDULO {mod.moduleNumber} / 33</span>
                </div>
              </div>
            </Tomo04MasterPage>
          );
        })}

        {/* ========================================================
            PAGE 38: CASOS GUIADOS DE TALLER DE NOTEBOOKS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 38) && (
          <Tomo04MasterPage
            pageId="t04-page-38"
            pageNumber={38}
            sectionTitle="EXPEDIENTES DE PORTÁTILES"
            subSlug="CASOS REALES DE BANCO"
            accentColor="#A855F7"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-purple-400 uppercase tracking-widest">
                  HISTORIAL CLÍNICO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  CASOS DE REPARACIÓN DE NOTEBOOKS RESUELTOS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Fallas engañosas resueltas aplicando descarte sistemático de componentes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
                {TOMO_04_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-purple-950 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-purple-400 border-b border-zinc-900 pb-1 mb-1.5">
                        <span className="font-bold">{c.title}</span>
                        <span className="text-zinc-500">{c.model}</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-1">
                        <p><strong className="text-zinc-400">Síntoma:</strong> {c.symptom}</p>
                        <p><strong className="text-amber-400">Hipótesis falsa:</strong> {c.hypothesis}</p>
                        <p><strong className="text-purple-400">Medición pericial:</strong> {c.measurement}</p>
                        <p><strong className="text-zinc-400">Descartado:</strong> {c.discarded}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[10px] text-emerald-400">
                      <strong>Causa Raíz & Reparación:</strong> {c.rootCause} → {c.repairAction}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-purple-950 text-xs font-mono-tech text-zinc-300 flex items-center justify-between">
                <span>LECCIÓN PERICIAL:</span>
                <span className="text-purple-400 font-bold">
                  “CONECTAR LA PANTALLA CON LA BATERÍA PUESTA ES EL ERROR N°1 QUE QUEMA EL FUSIBLE DE BACKLIGHT.”
                </span>
              </div>
            </div>
          </Tomo04MasterPage>
        )}

        {/* ========================================================
            PAGE 39: GLOSARIO DE MICROELECTRÓNICA Y PORTÁTILES
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 39) && (
          <Tomo04MasterPage
            pageId="t04-page-39"
            pageNumber={39}
            sectionTitle="DICCIONARIO DE PORTÁTILES"
            subSlug="GLOSARIO DE MICROELECTRÓNICA"
            accentColor="#A855F7"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-purple-400 uppercase tracking-widest">
                  TERMINOLOGÍA DE MICROMECÁNICA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  GLOSARIO DE MICROELECTRÓNICA & NOTEBOOKS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Conceptos de placas madre compactas, controladores embebidos, alimentación y flex de pantalla.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_04_GLOSSARY.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-2.5 rounded-lg bg-zinc-950/70 border border-purple-950 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-bold text-[11px]">
                        {g.term}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-900/60">
                        {g.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                      {g.definition}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2 text-[10px] font-mono-tech text-zinc-500 text-center border-t border-zinc-900">
                TOTAL DE CONCEPTOS CRÍTICOS DE PORTÁTILES: {TOMO_04_GLOSSARY.length} TÉRMINOS
              </div>
            </div>
          </Tomo04MasterPage>
        )}

        {/* ========================================================
            PAGE 40: PARTE DE SERVICIO DE NOTEBOOK IMPRIMIBLE
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 40) && (
          <Tomo04MasterPage
            pageId="t04-page-40"
            pageNumber={40}
            sectionTitle="PARTE DE SERVICIO"
            subSlug="FICHA TÉCNICA DE NOTEBOOK"
            accentColor="#A855F7"
          >
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tech text-purple-400 uppercase tracking-widest">
                  DOCUMENTACIÓN DE TALLER
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  PARTE DE SERVICIO // COMPUTADORAS PORTÁTILES
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Planilla imprimible para el ingreso e inspección pericial de notebooks.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border-2 border-dashed border-purple-900 space-y-4 font-mono-tech text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">MARCA Y MODELO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">N° SERIE / SERVICE TAG:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">¿DEJÓ CARGADOR ORIGINAL?:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">VOLTAJE / AMPERAJE:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-purple-400 font-bold text-[11px] block">
                      ESTADO ESTÉTICO Y MECÁNICO INICIAL:
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>[ ] Bisagras duras o carcasas abiertas</div>
                      <div>[ ] Rayas o manchas previas en panel LCD</div>
                      <div>[ ] Faltan tornillos en tapa inferior</div>
                      <div>[ ] Touchpad deformado (posible batería hinchada)</div>
                      <div>[ ] Teclas faltantes o pegajosas</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-pink-400 font-bold text-[11px] block">
                      MEDICIONES EN BANCO DE TALLER:
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>Voltaje del cargador medido: ________ V</div>
                      <div>Luz testigo de carga: [ ] Sí  [ ] No</div>
                      <div>Video por monitor externo HDMI: [ ] Sí  [ ] No</div>
                      <div>Salud de la batería (%): ___________ %</div>
                      <div>Temperatura máxima en test de 15 min: ____ °C</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">
                    DIAGNÓSTICO FINAL, TRABAJO REALIZADO Y GARANTÍA:
                  </span>
                  <div className="h-12 border border-zinc-800 rounded bg-zinc-950/50 p-2 text-[10px] text-zinc-600">
                    Detalle de limpieza de radiador, cambio de pasta térmica o reemplazo de componentes // Firma cliente: ____________________
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono-tech text-purple-400 text-center">
                PUEDE IMPRIMIRSE DIRECTAMENTE EN HOJA A4 PARA ADJUNTAR A LA NOTEBOOK INGRESADA.
              </div>
            </div>
          </Tomo04MasterPage>
        )}

        {/* ========================================================
            PAGE 41: BACK COVER / CONTRATAPA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === totalPages) && (
          <Tomo04MasterPage
            pageId="t04-page-41"
            pageNumber={totalPages}
            isBackCover
            hideHeaderFooter
            accentColor="#A855F7"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#050208] via-[#08040F] to-[#020104] text-white">
              <div className="border-b border-purple-950 pb-4">
                <span className="text-xs font-mono-tech text-purple-400 tracking-widest uppercase">
                  COLECCIÓN EDITORIAL EVO LABS // CIERRE DE EDICIÓN
                </span>
                <h2 className="text-3xl font-display font-black text-white mt-1">
                  TOMO 04 // REPARÁ TU NOTEBOOK
                </h2>
              </div>

              <div className="my-auto max-w-lg space-y-4">
                <blockquote className="border-l-2 border-purple-400 pl-4 text-base sm:text-lg text-zinc-300 font-sans-editorial italic">
                  “La micromecánica portátil exige paciencia, observación y precisión milimétrica. Quien respeta los clips, las tensiones y la física del calor, rescata cualquier equipo.”
                </blockquote>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-purple-950 space-y-2 text-xs font-mono-tech">
                  <span className="text-purple-400 font-bold block">
                    COMPETENCIAS DE MICROMECÁNICA CONSOLIDADAS:
                  </span>
                  <p className="text-zinc-400">
                    ✔ Apertura de carcasas sin romper clips ni tornillos ocultos.<br />
                    ✔ Diagnóstico pericial de circuitos de carga, DC Jack y baterías Li-Po.<br />
                    ✔ Prueba de linterna y reemplazo de paneles eDP y cables flex.<br />
                    ✔ Despeje de alfombras de pelusa y repasteo térmico de alta viscosidad.
                  </p>
                </div>
              </div>

              <div className="border-t border-purple-950 pt-4 flex items-end justify-between text-xs font-mono-tech text-zinc-500">
                <div>
                  <span className="text-white font-bold">EVO LABS PORTABLE RESEARCH</span>
                  <p className="text-[10px]">Manual Oficial de Portátiles // Edición 2026</p>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-bold tracking-widest text-sm">
                    FIN DEL TOMO 04
                  </span>
                  <p className="text-[9px]">COLECCIÓN COMPLETA DE 4 TOMOS EVO LABS</p>
                </div>
              </div>
            </div>
          </Tomo04MasterPage>
        )}
      </main>

      {/* Export / PDF Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-[#0e0716] border border-purple-900/80 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl font-sans-editorial">
            <div className="flex items-center justify-between border-b border-purple-950 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Exportar Tomo 04 a PDF A4
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 font-mono-tech">
              <p className="font-sans-editorial text-sm">
                Configuración recomendada para imprimir la biblia de notebooks en A4:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-purple-950 space-y-1.5 text-[11px]">
                <div>1. Destino: <strong>Guardar como PDF</strong></div>
                <div>2. Tamaño de papel: <strong>A4 (210 × 297 mm)</strong></div>
                <div>3. Márgenes: <strong>Ninguno / 0 mm</strong></div>
                <div>4. Gráficos de fondo: <strong>Activado (Obligatorio)</strong></div>
              </div>

              {isInIframe && (
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900 text-purple-300 text-[11px] space-y-2">
                  <p>
                    💡 Estás dentro del visor integrado. Si deseas imprimir sin marcos ni recortes:
                  </p>
                  <a
                    href={getStandalonePrintUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500 text-white font-bold hover:bg-purple-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ABRIR EN PESTAÑA NUEVA PARA IMPRIMIR</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-950">
              <button
                type="button"
                onClick={handleDownloadOfflineHtml}
                className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>DESCARGAR HTML OFFLINE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  handleNativePrint();
                }}
                className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-300 text-black font-extrabold text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.4)]"
              >
                <Printer className="w-4 h-4" />
                <span>IMPRIMIR AHORA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
