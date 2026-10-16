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
  Award,
} from 'lucide-react';
import { Tomo03MasterPage } from './Tomo03MasterPage';
import { Tomo03WorkbenchView } from './Tomo03WorkbenchView';
import { EvoTomeExamEngine } from '../exam/EvoTomeExamEngine';
import {
  TOMO_03_META,
  WORKBENCH_BASE_KIT,
  TOMO_03_MODULES,
  TOMO_03_CASES,
  TOMO_03_GLOSSARY,
} from '../../data/tomo03Data';

interface Tomo03MagazineViewProps {
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04') => void;
  initialPage?: number;
}

type ViewMode = 'continuous' | 'single';

export const Tomo03MagazineView: React.FC<Tomo03MagazineViewProps> = ({
  onBackToApp,
  onNavigateTomo,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>('continuous');
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [isExamOpen, setIsExamOpen] = useState<boolean>(false);
  const [isWorkbenchOpen, setIsWorkbenchOpen] = useState<boolean>(false);

  const totalPages = TOMO_03_META.totalPages;

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
      u.searchParams.set('volume', '03');
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
  <title>${TOMO_03_META.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070A08; color: #E4E4E7; margin: 0; padding: 20px; }
    h1 { color: #10B981; font-size: 28px; border-bottom: 2px solid #10B981; padding-bottom: 8px; }
    h2 { color: #34D399; margin-top: 30px; }
    pre { background: #064E3B; padding: 12px; border-radius: 6px; border: 1px solid #047857; overflow-x: auto; color: #6EE7B7; }
    .box { border: 1px solid #064E3B; background: #052E16; padding: 16px; margin-bottom: 16px; border-radius: 8px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: rgba(16, 185, 129, 0.2); color: #10B981; }
  </style>
</head>
<body>
  <h1>${TOMO_03_META.title}</h1>
  <p><strong>${TOMO_03_META.subtitle}</strong></p>
  <p><em>${TOMO_03_META.manifestoPhrase}</em></p>
  <hr style="border-color: #064E3B;">
  ${TOMO_03_MODULES.map(
    (m) => `
    <div class="box">
      <span class="badge">MÓDULO ${m.moduleNumber} // ${m.categoryTag}</span>
      <h2>${m.title}</h2>
      <p><em>${m.subtitle}</em></p>
      <p><strong>Herramienta:</strong> ${m.bancoTool || m.workbenchTool || ''}</p>
      <p><strong>Árbol Deductivo:</strong> ${m.decisionTree.question}</p>
      <p>Sí: ${m.decisionTree.yesAction} | No: ${m.decisionTree.noAction}</p>
      ${m.multimeterMode || m.multimeterMeasurement ? `<p><strong>Medición con multímetro:</strong> ${m.multimeterMode || m.multimeterMeasurement}</p>` : ''}
    </div>`
  ).join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO_LABS_TOMO_03_REPARA_TU_PC.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050806] text-zinc-100 flex flex-col font-sans-editorial selection:bg-emerald-400 selection:text-black">
      {/* Top Floating Technical Editorial Toolbar (Screen Only) */}
      <nav
        aria-label="Barra de herramientas de la revista"
        className="sticky top-0 z-50 bg-[#070b09]/95 backdrop-blur-md border-b border-emerald-950/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech select-none print:hidden"
      >
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-emerald-900/60 hover:border-emerald-400 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">VOLVER</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-none inline-block shadow-[0_0_8px_#10B981]" />
            <span className="font-black text-white tracking-widest hidden sm:inline">
              EVO LABS // TOMO 03
            </span>
            <span className="text-emerald-400 text-[11px] font-bold">
              REPARÁ TU PC // MANUAL DE TALLER
            </span>
          </div>

          {/* Tomo Selector */}
          <div className="flex items-center gap-1 bg-zinc-950/90 p-1 rounded-xl border border-emerald-950 ml-2">
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
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)] cursor-pointer"
              title="Tomo 03: Repará tu Propia PC"
            >
              T03
            </button>
            <button
              type="button"
              onClick={() => onNavigateTomo?.('04')}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-purple-400 hover:bg-purple-950/40 border border-purple-500/30 transition-all cursor-pointer"
              title="Tomo 04: Microelectrónica y Portátiles"
            >
              T04
            </button>
          </div>
        </div>

        {/* Center: View mode toggles */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-emerald-950">
          <button
            type="button"
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === 'continuous'
                ? 'bg-emerald-500 text-black shadow'
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
                ? 'bg-emerald-500 text-black shadow'
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
              <span className="px-1 text-emerald-300 font-bold">
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
            onClick={() => { setIsWorkbenchOpen(true); setIsExamOpen(false); }}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400"
          >
            <Wrench className="w-3.5 h-3.5"/>
            <span>BANCO INTERACTIVO</span>
          </button>

          <button
            type="button"
            onClick={() => { setIsExamOpen(true); setIsWorkbenchOpen(false); }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-bold border border-emerald-500/40 text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>EXAMEN FINAL</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DESCARGAR PDF A4</span>
          </button>
        </div>
      </nav>

      {isExamOpen ? (
        <div className="flex-1 w-full">
          <EvoTomeExamEngine
            tomoId="tomo-03"
            onBackToTomoCover={() => setIsExamOpen(false)}
            onBackToIndex={() => setIsExamOpen(false)}
          />
        </div>
      ) : isWorkbenchOpen ? (
        <Tomo03WorkbenchView onBack={() => setIsWorkbenchOpen(false)} />
      ) : (
        /* Main Magazine Pages Container */
        <main className="flex-1 py-8 px-2 sm:px-4 flex flex-col items-center gap-8 print:p-0 print:m-0 print:gap-0">
        {/* ========================================================
            PAGE 01: COVER
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 1) && (
          <Tomo03MasterPage
            pageId="t03-page-01"
            pageNumber={1}
            isCover
            hideHeaderFooter
            accentColor="#10B981"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#020503] via-[#040A06] to-[#020403] text-white">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

              {/* Cover Masthead */}
              <div className="relative z-10 border-b-2 border-emerald-400 pb-5">
                <div className="flex items-center justify-between text-[11px] font-mono-tech tracking-widest text-emerald-400 mb-2">
                  <span>EVO LABS // SERVICIO TÉCNICO OFICIAL</span>
                  <span>PUBLICACIÓN DE TALLER 2026 // VOL. 03</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tighter text-white uppercase leading-none">
                    REPARÁ TU PC<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                      LA BIBLIA DEL TALLER
                    </span>
                  </h1>
                  <span className="text-4xl font-mono-tech font-bold text-emerald-400 hidden sm:block">
                    03
                  </span>
                </div>
                <p className="mt-3 text-sm sm:text-base text-zinc-300 font-mono-tech uppercase tracking-wide">
                  GUÍA PERICIAL DE DIAGNÓSTICO, HARDWARE DE ESCRITORIO Y BANCO DE PRUEBAS
                </p>
              </div>

              {/* Cover Center Art / Workbench Diagram */}
              <div className="relative z-10 my-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl p-6 rounded-2xl border border-emerald-900/60 bg-[#051109]/80 backdrop-blur-sm shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-950 text-xs font-mono-tech text-emerald-400">
                    <span>MÉTODO DEDUCTIVO // CERO ADIVINANZA</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/30 text-[10px]">
                      BANCO DE TRABAJO REAL
                    </span>
                  </div>

                  <div className="py-6 font-mono-tech text-xs text-zinc-300 space-y-2">
                    <div className="p-2.5 rounded bg-black/50 border border-emerald-950 flex items-center justify-between">
                      <span className="text-emerald-300 font-bold">MULTÍMETRO DIGITAL:</span>
                      <span className="text-zinc-400">Rieles +12V, +5V, +3.3V, +5VSB y Power Good</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-emerald-950 flex items-center justify-between">
                      <span className="text-emerald-300 font-bold">BUZZER & DIAGNÓSTICO:</span>
                      <span className="text-zinc-400">Códigos AMI/Award, Q-LEDs y tarjeta POST PCIe</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-emerald-950 flex items-center justify-between">
                      <span className="text-emerald-300 font-bold">BANCO DE MESA:</span>
                      <span className="text-zinc-400">Prueba de configuración mínima sobre superficie adecuada para ESD</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                    <span>“NO REEMPLACES A CIEGAS. MEDÍ PRIMERO.”</span>
                    <span className="text-emerald-400 font-bold">{totalPages} PÁGINAS A4</span>
                  </div>
                </div>
              </div>

              {/* Cover Footer & Barcode */}
              <div className="relative z-10 pt-4 border-t border-emerald-950/80 flex items-end justify-between text-xs font-mono-tech text-zinc-400">
                <div>
                  <p className="font-bold text-white uppercase text-sm">EDITORIAL EVO LABS</p>
                  <p className="text-[11px] text-zinc-400">Formato Revista A4 // Con Esquemas Eléctricos y Tablas Reales</p>
                </div>
                <div className="text-right">
                  <div className="tracking-widest font-mono-tech text-sm text-emerald-400 font-bold">
                    |||||||| | |||| | |||||||
                  </div>
                  <span className="text-[9px] text-zinc-500">EVO-T03-2026</span>
                </div>
              </div>
            </div>
          </Tomo03MasterPage>
        )}

        {/* ========================================================
            PAGE 02: MANIFIESTO & ARSENAL DE BANCO
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 2) && (
          <Tomo03MasterPage
            pageId="t03-page-02"
            pageNumber={2}
            sectionTitle="EL BANCO DE PRUEBAS"
            subSlug="ARSENAL DE HERRAMIENTAS"
            accentColor="#10B981"
          >
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tech text-emerald-400 uppercase tracking-widest">
                  INSTRUMENTAL PERICIAL
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  EL KIT DE SUPERVIVENCIA DEL TALLER
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Herramientas profesionales que separan a un técnico deductivo de un cambiador de piezas novato.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono-tech">
                {WORKBENCH_BASE_KIT.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-emerald-950 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-emerald-400 font-bold">{tool.name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight">
                        <strong>Para qué sirve:</strong> {tool.whatItDoes}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[9px] text-zinc-500">
                      <strong>Riesgo:</strong> {tool.associatedRisk || tool.riskNotice}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs font-mono-tech text-emerald-300 flex items-center justify-between">
                <span>REGLA DEL BANCO LIMPIO:</span>
                <span className="text-white font-bold">
                  “CERO PULSERAS METÁLICAS, CERO SUPERFICIES CONDUCTIVAS, FUENTE DESENCHUFADA AL MANIPULAR.”
                </span>
              </div>
            </div>
          </Tomo03MasterPage>
        )}

        {/* ========================================================
            PAGE 03: ÍNDICE DE LOS 35 MÓDULOS DE ESCRITORIO
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 3) && (
          <Tomo03MasterPage
            pageId="t03-page-03"
            pageNumber={3}
            sectionTitle="SUMARIO DE TALLER"
            subSlug="ÍNDICE DE 35 MÓDULOS"
            accentColor="#10B981"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-emerald-400 uppercase tracking-widest">
                  CARTOGRAFÍA DE REPARACIÓN
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ÍNDICE MAESTRO DE SERVICIO TÉCNICO
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  35 módulos estructurados según la cadena física de arranque de una PC de escritorio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_03_MODULES.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (viewMode === 'single') {
                        setCurrentPage(4 + TOMO_03_MODULES.indexOf(m));
                        return;
                      }
                      const el = document.getElementById(`t03-mod-${m.moduleNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded bg-zinc-950/60 border border-emerald-950 hover:border-emerald-500/60 transition-all flex items-start gap-2.5 cursor-pointer group"
                  >
                    <span className="text-emerald-400 font-bold group-hover:text-emerald-300">
                      [{m.moduleNumber}]
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] group-hover:text-emerald-200">
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
                HAZ CLIC EN CUALQUIER MÓDULO PARA ABRIR DIRECTAMENTE SU PROTOCOLO DE BANCO
              </div>
            </div>
          </Tomo03MasterPage>
        )}

        {/* ========================================================
            MODULE PAGES: 35 DESKTOP REPAIR MODULES (A4 SPREADS)
        ======================================================== */}
        {TOMO_03_MODULES.map((mod, idx) => {
          const modPageNumber = 4 + idx;
          if (viewMode === 'single' && currentPage !== modPageNumber) {
            return null;
          }

          return (
            <Tomo03MasterPage
              key={mod.id}
              pageId={`t03-mod-${mod.moduleNumber}`}
              pageNumber={modPageNumber}
              sectionTitle={`MÓDULO ${mod.moduleNumber}`}
              subSlug={mod.categoryTag}
              accentColor="#10B981"
            >
              <div className="h-full flex flex-col justify-between space-y-3.5">
                {/* Module Header */}
                <div className="border-b border-emerald-950 pb-3">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-emerald-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-[10px] font-bold">
                      {mod.categoryTag}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Lectura: {mod.readTime}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          mod.safetyLevel.includes('VERDE')
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : mod.safetyLevel.includes('AMARILLO')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        NIVEL {mod.safetyLevel.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-display font-black text-white tracking-tight">
                    {mod.moduleNumber}. {mod.title}
                  </h2>
                  <p className="text-xs font-mono-tech text-emerald-300 mt-0.5">
                    {mod.subtitle}
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Left Column: Summary & Decision Tree */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-zinc-950/70 border border-emerald-950">
                      <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider block mb-1">
                        DESCRIPCIÓN DEL PROCEDIMIENTO
                      </span>
                      <p className="text-zinc-300 font-sans-editorial leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-emerald-900/60 font-mono-tech text-xs">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-2">
                        ÁRBOL DEDUCTIVO // PASO A PASO
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
                      <span className="text-zinc-300 font-bold block mb-1">HERRAMIENTA RECOMENDADA:</span>
                      <span className="text-emerald-400">{mod.bancoTool || mod.workbenchTool}</span>
                    </div>
                  </div>

                  {/* Right Column: Multimeter & Practical Commands */}
                  <div className="space-y-3">
                    {(mod.multimeterMode || mod.multimeterMeasurement) && (
                      <div className="p-3 rounded-xl bg-[#06140D] border border-emerald-900 font-mono-tech text-xs">
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mb-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          <span>MEDICIÓN CON MULTÍMETRO DIGITAL</span>
                        </div>
                        <p className="text-emerald-200 text-[11px] leading-relaxed">
                          {mod.multimeterMode || mod.multimeterMeasurement}
                        </p>
                      </div>
                    )}

                    {mod.practicalCommand && (
                      <div className="p-3 rounded-xl bg-black/80 border border-emerald-900">
                        <div className="flex items-center justify-between text-[10px] font-mono-tech text-emerald-400 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>COMANDO TÉCNICO DE BANCO</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySnippet(mod.practicalCommand!)}
                            className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
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
                        <pre className="p-2 rounded bg-black font-mono-tech text-[11px] text-emerald-300 overflow-x-auto border border-emerald-950 select-all">
                          <code>{mod.practicalCommand}</code>
                        </pre>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    <div className="p-3 rounded-xl bg-zinc-950/70 border border-emerald-950 space-y-1.5 text-xs font-mono-tech">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">
                        PUNTOS CLAVE DE BANCO
                      </span>
                      {mod.keyTakeaways.map((kt, kIdx) => (
                        <div key={kIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                          <span className="text-emerald-400">▸</span>
                          <span>{kt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Callout */}
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/40 text-[10px] font-mono-tech text-emerald-300 flex items-center justify-between">
                  <span>EVO LABS // GUÍA DE SERVICIO TÉCNICO DE ESCRITORIO</span>
                  <span className="text-zinc-500">MÓDULO {mod.moduleNumber} / {TOMO_03_MODULES.length}</span>
                </div>
              </div>
            </Tomo03MasterPage>
          );
        })}

        {/* ========================================================
            PAGE 39: CASOS GUIADOS DE TALLER DE ESCRITORIO
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 39) && (
          <Tomo03MasterPage
            pageId="t03-page-39"
            pageNumber={39}
            sectionTitle="EXPEDIENTES DE BANCO"
            subSlug="CASOS DIDÁCTICOS SIMULADOS"
            accentColor="#10B981"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-emerald-400 uppercase tracking-widest">
                  CASUÍSTICA DE TALLER
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  CASOS DE REPARACIÓN DE ESCRITORIO RESUELTOS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Desmontaje analítico: cómo el método pericial evitó compras inútiles de hardware.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
                {TOMO_03_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-emerald-950 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 border-b border-zinc-900 pb-1 mb-1.5">
                        <span className="font-bold">{c.title}</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-1">
                        <p><strong className="text-zinc-400">Síntoma:</strong> {c.symptom}</p>
                        <p><strong className="text-amber-400">Hipótesis falsa:</strong> {c.hypothesis}</p>
                        <p><strong className="text-emerald-400">Medición clave:</strong> {c.measurement}</p>
                        <p><strong className="text-zinc-400">Descartado:</strong> {c.discarded}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[10px] text-emerald-400">
                      <strong>Causa Raíz & Reparación:</strong> {c.rootCause} → {c.repairAction}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-emerald-950 text-xs font-mono-tech text-zinc-300 flex items-center justify-between">
                <span>PRINCIPIO EVO DE BANCO:</span>
                <span className="text-emerald-400 font-bold">
                  “LAS CAUSAS SE DETERMINAN POR PRUEBAS, NO POR ESTADÍSTICAS INVENTADAS.”
                </span>
              </div>
            </div>
          </Tomo03MasterPage>
        )}

        {/* ========================================================
            PAGE 40: GLOSARIO DE TALLER Y ELECTRÓNICA BÁSICA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 40) && (
          <Tomo03MasterPage
            pageId="t03-page-40"
            pageNumber={40}
            sectionTitle="DICCIONARIO DE TALLER"
            subSlug="GLOSARIO ELECTRÓNICO & BANCO"
            accentColor="#10B981"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-emerald-400 uppercase tracking-widest">
                  TERMINOLOGÍA DE BANCO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  GLOSARIO DE TALLER & ELECTRÓNICA
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Conceptos fundamentales para comprender mediciones, componentes de potencia y señales de diagnóstico.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_03_GLOSSARY.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-2.5 rounded-lg bg-zinc-950/70 border border-emerald-950 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-bold text-[11px]">
                        {g.term}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/60">
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
                TOTAL DE CONCEPTOS CRÍTICOS DE BANCO: {TOMO_03_GLOSSARY.length} TÉRMINOS
              </div>
            </div>
          </Tomo03MasterPage>
        )}

        {/* ========================================================
            PAGE 41: PARTE DE SERVICIO DE TALLER IMPRIMIBLE
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 41) && (
          <Tomo03MasterPage
            pageId="t03-page-41"
            pageNumber={41}
            sectionTitle="PARTE DE SERVICIO"
            subSlug="PLANILLA TÉCNICA OFICIAL"
            accentColor="#10B981"
          >
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tech text-emerald-400 uppercase tracking-widest">
                  DOCUMENTACIÓN PERICIAL
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  PARTE DE SERVICIO DE TALLER // HARDWARE DE ESCRITORIO
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Planilla imprimible para recepción, diagnóstico y entrega de equipos de clientes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border-2 border-dashed border-emerald-900 space-y-4 font-mono-tech text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">N° ORDEN SERVICIO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">CLIENTE / TELÉFONO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">FECHA INGRESO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TÉCNICO ASIGNADO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-emerald-400 font-bold text-[11px] block">
                      CHECKLIST DE RECEPCIÓN (ESTADO VISUAL):
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>[ ] Enciende con botón frontal</div>
                      <div>[ ] Giran ventiladores de CPU y fuente</div>
                      <div>[ ] Emite beeps el buzzer interno</div>
                      <div>[ ] Da imagen por placa de video o HDMI de placa</div>
                      <div>[ ] Cables SATA y conexiones completas</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-teal-400 font-bold text-[11px] block">
                      MEDICIONES EN BANCO DE TRABAJO:
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>Línea +12V Fuente (Multímetro): _______ V</div>
                      <div>Línea +5V Fuente (Multímetro): ________ V</div>
                      <div>Línea +3.3V Fuente (Multímetro): ______ V</div>
                      <div>Pila CR2032 (Mínimo 3.0V): ____________ V</div>
                      <div>Temperatura CPU en reposo: ___________ °C</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">
                    DIAGNÓSTICO FINAL, TRABAJO REALIZADO Y GARANTÍA:
                  </span>
                  <div className="h-12 border border-zinc-800 rounded bg-zinc-950/50 p-2 text-[10px] text-zinc-600">
                    Detalle de componentes reemplazados o mantenimientos térmicos realizados // Firma cliente: ____________________
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono-tech text-emerald-400 text-center">
                PUEDE IMPRIMIRSE DIRECTAMENTE EN HOJA A4 PARA ADJUNTAR AL GABINETE DEL CLIENTE.
              </div>
            </div>
          </Tomo03MasterPage>
        )}

        {/* ========================================================
            PAGE 42: BACK COVER / CONTRATAPA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === totalPages) && (
          <Tomo03MasterPage
            pageId="t03-page-42"
            pageNumber={totalPages}
            isBackCover
            hideHeaderFooter
            accentColor="#10B981"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#020503] via-[#040805] to-[#010302] text-white">
              <div className="border-b border-emerald-950 pb-4">
                <span className="text-xs font-mono-tech text-emerald-400 tracking-widest uppercase">
                  COLECCIÓN EDITORIAL EVO LABS // CIERRE DE EDICIÓN
                </span>
                <h2 className="text-3xl font-display font-black text-white mt-1">
                  TOMO 03 // REPARÁ TU PC
                </h2>
              </div>

              <div className="my-auto max-w-lg space-y-4">
                <blockquote className="border-l-2 border-emerald-400 pl-4 text-base sm:text-lg text-zinc-300 font-sans-editorial italic">
                  “Cualquiera puede gastar dinero comprando piezas nuevas. Un verdadero técnico pericial encuentra la causa raíz midiendo y salvando el hardware existente.”
                </blockquote>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-950 space-y-2 text-xs font-mono-tech">
                  <span className="text-emerald-400 font-bold block">
                    HABILIDADES DE BANCO ADQUIRIDAS:
                  </span>
                  <p className="text-zinc-400">
                    ✔ Interpretación de tensiones ATX sin abrir la fuente.<br />
                    ✔ Decodificación pericial de beeps del BIOS y luces Q-LED.<br />
                    ✔ Montaje y prueba en banco aislado fuera del gabinete.<br />
                    ✔ Descarte de bucles de reinicio y falsos contactos de RAM.
                  </p>
                </div>
              </div>

              <div className="border-t border-emerald-950 pt-4 flex items-end justify-between text-xs font-mono-tech text-zinc-500">
                <div>
                  <span className="text-white font-bold">EVO LABS HARDWARE WORKSHOP</span>
                  <p className="text-[10px]">Manual Oficial de Banco // Edición 2026</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold tracking-widest text-sm">
                    FIN DEL TOMO 03
                  </span>
                  <p className="text-[9px]">CONTINÚA EN TOMO 04: REPARÁ TU NOTEBOOK</p>
                </div>
              </div>
            </div>
          </Tomo03MasterPage>
        )}
      </main>
      )}

      {/* Export / PDF Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-[#080e0a] border border-emerald-900/80 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl font-sans-editorial">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Exportar Tomo 03 a PDF A4
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
                Configuración recomendada para imprimir el manual de taller en A4:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-emerald-950 space-y-1.5 text-[11px]">
                <div>1. Destino: <strong>Guardar como PDF</strong></div>
                <div>2. Tamaño de papel: <strong>A4 (210 × 297 mm)</strong></div>
                <div>3. Márgenes: <strong>Ninguno / 0 mm</strong></div>
                <div>4. Gráficos de fondo: <strong>Activado (Indispensable)</strong></div>
              </div>

              {isInIframe && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900 text-emerald-300 text-[11px] space-y-2">
                  <p>
                    💡 Estás dentro del visor integrado. Si deseas imprimir sin marcos ni recortes:
                  </p>
                  <a
                    href={getStandalonePrintUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ABRIR EN PESTAÑA NUEVA PARA IMPRIMIR</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-emerald-950">
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
                className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)]"
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
