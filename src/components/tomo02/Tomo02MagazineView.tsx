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
  Sparkles,
  Layers,
  Terminal,
  ShieldAlert,
  Search,
  BookOpen,
  Sliders,
  Check,
  Cpu,
  Database,
  Key,
} from 'lucide-react';
import { Tomo02MasterPage } from './Tomo02MasterPage';
import {
  TOMO_02_META,
  TOMO_02_FOLDERS,
  TOMO_02_MODULES,
  TOMO_02_CASES,
  TOMO_02_SECRETS,
  TOMO_02_GLOSSARY,
} from '../../data/tomo02Data';

interface Tomo02MagazineViewProps {
  onBackToApp?: () => void;
  onNavigateTomo?: (tomo: '01' | '02' | '03' | '04') => void;
  initialPage?: number;
}

type ViewMode = 'continuous' | 'single';

export const Tomo02MagazineView: React.FC<Tomo02MagazineViewProps> = ({
  onBackToApp,
  onNavigateTomo,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>('continuous');
  const [isPreparingPrint, setIsPreparingPrint] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalPages = TOMO_02_META.totalPages;

  // Environment check: whether running embedded inside an iframe (like AI Studio preview)
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
      u.searchParams.set('volume', '02');
      u.searchParams.set('mode', 'magazine');
      u.searchParams.set('print', 'true');
      return u.toString();
    } catch {
      return window.location.href;
    }
  };

  // Keyboard navigation
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
  <title>${TOMO_02_META.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #08090C; color: #E4E4E7; margin: 0; padding: 20px; }
    h1 { color: #00D2FF; font-size: 28px; border-bottom: 2px solid #00D2FF; padding-bottom: 8px; }
    h2 { color: #38BDF8; margin-top: 30px; }
    pre { background: #0F172A; padding: 12px; border-radius: 6px; border: 1px solid #1E293B; overflow-x: auto; color: #38BDF8; }
    .box { border: 1px solid #1E293B; background: #0D1117; padding: 16px; margin-bottom: 16px; border-radius: 8px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: rgba(0, 210, 255, 0.2); color: #00D2FF; }
  </style>
</head>
<body>
  <h1>${TOMO_02_META.title}</h1>
  <p><strong>${TOMO_02_META.subtitle}</strong></p>
  <p><em>${TOMO_02_META.manifestoPhrase}</em></p>
  <hr style="border-color: #1E293B;">
  ${TOMO_02_MODULES.map(
    (m) => `
    <div class="box">
      <span class="badge">MÓDULO ${m.moduleNumber} // ${m.categoryTag}</span>
      <h2>${m.title}</h2>
      <p><em>${m.subtitle}</em></p>
      <p>${m.forensicGoal || m.summary}</p>
      <pre><code>${m.powershellCommand || m.forensicCommand || m.practicalCommand || ''}</code></pre>
      <p><strong>Regla de Reversibilidad:</strong> ${m.reversibility || m.scientificFact || ''}</p>
      <p><strong>Falso Positivo:</strong> ${m.falsePositive || m.warningNotice || ''}</p>
    </div>`
  ).join('')}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EVO_LABS_TOMO_02_BIBLIA_NEGRA_WINDOWS.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col font-sans-editorial selection:bg-cyan-400 selection:text-black">
      {/* Top Floating Technical Editorial Toolbar (Screen Only) */}
      <nav
        aria-label="Barra de herramientas de la revista"
        className="sticky top-0 z-50 bg-[#080a0e]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech select-none print:hidden"
      >
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              type="button"
              onClick={onBackToApp}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-cyan-900/60 hover:border-cyan-400 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">VOLVER</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-none inline-block shadow-[0_0_8px_#00D2FF]" />
            <span className="font-black text-white tracking-widest hidden sm:inline">
              EVO LABS // TOMO 02
            </span>
            <span className="text-cyan-400 text-[11px] font-bold">
              LA BIBLIA NEGRA DE WINDOWS
            </span>
          </div>

          {/* Tomo Selector */}
          <div className="flex items-center gap-1 bg-zinc-950/90 p-1 rounded-xl border border-cyan-950 ml-2">
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
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech bg-cyan-500 text-black border border-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.4)] cursor-pointer"
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
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech text-purple-400 hover:bg-purple-950/40 border border-purple-500/30 transition-all cursor-pointer"
              title="Tomo 04: Microelectrónica y Portátiles"
            >
              T04
            </button>
          </div>
        </div>

        {/* Center: View mode toggles */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-lg border border-cyan-950">
          <button
            type="button"
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === 'continuous'
                ? 'bg-cyan-500 text-black shadow'
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
                ? 'bg-cyan-500 text-black shadow'
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
              <span className="px-1 text-cyan-300 font-bold">
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
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,210,255,0.4)] cursor-pointer"
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
          <Tomo02MasterPage
            pageId="t02-page-01"
            pageNumber={1}
            isCover
            hideHeaderFooter
            accentColor="#00D2FF"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#03070C] via-[#070C14] to-[#04060A] text-white">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
              
              {/* Cover Masthead */}
              <div className="relative z-10 border-b-2 border-cyan-400 pb-5">
                <div className="flex items-center justify-between text-[11px] font-mono-tech tracking-widest text-cyan-400 mb-2">
                  <span>EVO LABS // COLECCIÓN TÉCNICA MAESTRA</span>
                  <span>PUBLICACIÓN OFICIAL 2026 // VOL. 02</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-tighter text-white uppercase leading-none">
                    LA BIBLIA NEGRA<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      DE WINDOWS
                    </span>
                  </h1>
                  <span className="text-4xl font-mono-tech font-bold text-cyan-400 hidden sm:block">
                    02
                  </span>
                </div>
                <p className="mt-3 text-sm sm:text-base text-zinc-300 font-mono-tech uppercase tracking-wide">
                  EL MANUAL FORENSE DEFINITIVO DEL SISTEMA OPERATIVO
                </p>
              </div>

              {/* Cover Center Art / Technical Diagram */}
              <div className="relative z-10 my-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl p-6 rounded-2xl border border-cyan-900/60 bg-[#0A101D]/80 backdrop-blur-sm shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-950 text-xs font-mono-tech text-cyan-400">
                    <span>KERNEL RING 0 & USER MODE RING 3</span>
                    <span className="px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30 text-[10px]">
                      FORENSIC DEEP-DIVE
                    </span>
                  </div>

                  <div className="py-6 font-mono-tech text-xs text-zinc-300 space-y-2">
                    <div className="p-2.5 rounded bg-black/50 border border-cyan-950 flex items-center justify-between">
                      <span className="text-cyan-300 font-bold">15 CARPETAS MAESTRAS:</span>
                      <span className="text-zinc-400">System32, WinSxS, DriverStore, RegBack</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-cyan-950 flex items-center justify-between">
                      <span className="text-cyan-300 font-bold">REGISTRO INTERNO:</span>
                      <span className="text-zinc-400">SAM, SYSTEM, SOFTWARE, NTUSER.DAT</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/50 border border-cyan-950 flex items-center justify-between">
                      <span className="text-cyan-300 font-bold">HERRAMIENTAS SYSINTERNALS:</span>
                      <span className="text-zinc-400">Procmon, Procexp, Autoruns, LatencyMon</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-950 flex items-center justify-between text-[11px] font-mono-tech text-zinc-400">
                    <span>“TOCALO. PERO PRIMERO ENTENDAMOS QUÉ HACE.”</span>
                    <span className="text-cyan-400 font-bold">48 PÁGINAS A4</span>
                  </div>
                </div>
              </div>

              {/* Cover Footer & Barcode */}
              <div className="relative z-10 pt-4 border-t border-cyan-950/80 flex items-end justify-between text-xs font-mono-tech text-zinc-400">
                <div>
                  <p className="font-bold text-white uppercase text-sm">EDITORIAL EVO LABS</p>
                  <p className="text-[11px] text-zinc-400">Formato Revista A4 // Sin Placeholders // 100% Código Real</p>
                </div>
                <div className="text-right">
                  <div className="tracking-widest font-mono-tech text-sm text-cyan-400 font-bold">
                    |||||||| | |||| | |||||||
                  </div>
                  <span className="text-[9px] text-zinc-500">ISBN-EVO-T02-2026</span>
                </div>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 02: MANIFIESTO & PACTO CON EL LECTOR
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 2) && (
          <Tomo02MasterPage
            pageId="t02-page-02"
            pageNumber={2}
            sectionTitle="EDITORIAL & MANIFIESTO"
            subSlug="FILOSOFÍA DEL KERNEL"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400 mb-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400" />
                  <span>MANIFIESTO DEL SISTEMA OPERATIVO</span>
                </div>
                <h2 className="text-3xl font-display font-black text-white tracking-tight">
                  WINDOWS NO ES UNA CAJA NEGRA MÁGICA
                </h2>
                <p className="text-sm font-mono-tech text-cyan-300 mt-1">
                  Es un sistema determinístico de archivos, servicios, hilos, memoria virtual y registros.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans-editorial text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-2">
                  <h3 className="font-bold text-white font-mono-tech text-xs uppercase flex items-center gap-2 text-cyan-400">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    EL PACTO CON EL LECTOR
                  </h3>
                  <p>
                    <strong>1. Cero scripts misteriosos:</strong> Jamás te diremos “descargá este archivo .bat mágico”. Cada cambio se enseña con su comando nativo de PowerShell o clave de Registro visible.
                  </p>
                  <p>
                    <strong>2. Regla de Reversibilidad Absoluta:</strong> Todo lo que se toca tiene un comando exacto para volver al estado de fábrica en caso de incompatibilidad.
                  </p>
                  <p>
                    <strong>3. Verificación empírica:</strong> Si un tweak promete mejorar la latencia, te enseñamos a medirla en microsegundos con LatencyMon antes y después.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-2">
                  <h3 className="font-bold text-white font-mono-tech text-xs uppercase flex items-center gap-2 text-cyan-400">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    EL MÉTODO FORENSE EVO
                  </h3>
                  <p>
                    La mayoría de los usuarios intenta "arreglar" Windows a los golpes: reinstalando, pasando limpiadores de registro basura o siguiendo tutoriales de YouTube de 2017.
                  </p>
                  <p>
                    El método EVO propone un camino pericial:
                  </p>
                  <div className="p-2 rounded bg-black/60 border border-cyan-950 font-mono-tech text-[11px] text-cyan-300">
                    OBSERVÁ → MEDÍ → AISLÁ EL PROCESO → MODIFICÁ CON REGISTRO → VALIDÁ TELEMETRÍA.
                  </div>
                </div>
              </div>

              {/* Anatomy diagram */}
              <div className="p-4 rounded-xl bg-black/80 border border-cyan-900/50">
                <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider block mb-2">
                  ANATOMÍA ESTRUCTURAL // KERNEL RING 0 VS USER MODE RING 3
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-tech">
                  <div className="p-3 rounded bg-zinc-950 border border-cyan-950">
                    <span className="text-cyan-400 font-bold block mb-1">USER MODE (RING 3)</span>
                    <p className="text-[11px] text-zinc-400">
                      Explorer.exe, navegadores, juegos, servicios estándar. Si un proceso crashea, no arrastra al sistema completo.
                    </p>
                  </div>
                  <div className="p-3 rounded bg-zinc-950 border border-cyan-950">
                    <span className="text-blue-400 font-bold block mb-1">KERNEL MODE (RING 0)</span>
                    <p className="text-[11px] text-zinc-400">
                      ntoskrnl.exe, HAL.dll, controladores gráficos y de red. Acceso directo a hardware y memoria física.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 03: LAS 15 CARPETAS MAESTRAS DE WINDOWS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 3) && (
          <Tomo02MasterPage
            pageId="t02-page-03"
            pageNumber={3}
            sectionTitle="MAPA DE ALMACENAMIENTO"
            subSlug="LAS 15 CARPETAS MAESTRAS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  CARTOGRAFÍA FORENSE
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  LAS 15 CARPETAS CRÍTICAS DEL SISTEMA
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Qué contiene cada una, por qué crecen y cuáles podés depurar con seguridad total.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono-tech">
                {TOMO_02_FOLDERS.slice(0, 9).map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-lg bg-zinc-950/80 border border-cyan-950 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-cyan-400 font-bold">{f.path}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                            f.safetyBadge === 'VERDE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : f.safetyBadge === 'AMARILLO'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {f.safetyBadge}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-300 font-sans-editorial leading-tight mb-1">
                        {f.purpose}
                      </p>
                    </div>
                    <div className="text-[9px] text-zinc-500 border-t border-zinc-900 pt-1">
                      {f.dangerNotice || f.canDeleteOrClean}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/50 text-xs font-mono-tech text-cyan-300 flex items-center justify-between">
                <span>COMANDO PARA DEPURAR COMPONENTES OBSOLETOS EN WINSXS:</span>
                <code className="bg-black/60 px-2 py-1 rounded text-white border border-cyan-900">
                  dism.exe /online /cleanup-image /startcomponentcleanup
                </code>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 04: ÍNDICE MAESTRO DE LOS 26 MÓDULOS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 4) && (
          <Tomo02MasterPage
            pageId="t02-page-04"
            pageNumber={4}
            sectionTitle="SUMARIO EJECUTIVO"
            subSlug="ÍNDICE DE 26 MÓDULOS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  ESTRUCTURA DE CONSULTA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  ÍNDICE MAESTRO FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  26 áreas de conocimiento autónomas, desde el arranque EFI hasta la telemetría del Kernel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_02_MODULES.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (viewMode === 'single') {
                        setCurrentPage(5);
                      }
                      const el = document.getElementById(`t02-mod-${m.moduleNumber}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded bg-zinc-950/60 border border-cyan-950 hover:border-cyan-500/60 transition-all flex items-start gap-2.5 cursor-pointer group"
                  >
                    <span className="text-cyan-400 font-bold group-hover:text-cyan-300">
                      [{m.moduleNumber}]
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px] group-hover:text-cyan-200">
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
                HAZ CLIC EN CUALQUIER MÓDULO PARA NAVEGAR DIRECTO A SU INVESTIGACIÓN
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            MODULE PAGES: 26 TECHNICAL MODULES (A4 SPREADS)
        ======================================================== */}
        {TOMO_02_MODULES.map((mod, idx) => {
          const modPageNumber = 5 + idx;
          if (viewMode === 'single' && currentPage !== modPageNumber) {
            return null;
          }

          return (
            <Tomo02MasterPage
              key={mod.id}
              pageId={`t02-mod-${mod.moduleNumber}`}
              pageNumber={modPageNumber}
              sectionTitle={`MÓDULO ${mod.moduleNumber}`}
              subSlug={mod.categoryTag}
              accentColor="#00D2FF"
            >
              <div className="h-full flex flex-col justify-between space-y-3.5">
                {/* Module Header */}
                <div className="border-b border-cyan-950 pb-3">
                  <div className="flex items-center justify-between text-xs font-mono-tech text-cyan-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-[10px] font-bold">
                      {mod.categoryTag}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Lectura: {mod.readTime}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          (mod.safetyBadge || 'VERDE') === 'VERDE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : mod.safetyBadge === 'AMARILLO'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        NIVEL {mod.safetyBadge || 'VERDE'}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-display font-black text-white tracking-tight">
                    {mod.moduleNumber}. {mod.title}
                  </h2>
                  <p className="text-xs font-mono-tech text-cyan-300 mt-0.5">
                    {mod.subtitle}
                  </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Left Column: Forensic Goal & Decision Tree */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-zinc-950/70 border border-cyan-950">
                      <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-wider block mb-1">
                        OBJETIVO FORENSE
                      </span>
                      <p className="text-zinc-300 font-sans-editorial leading-relaxed">
                        {mod.forensicGoal || mod.summary}
                      </p>
                    </div>

                    {mod.decisionTree ? (
                      <div className="p-3 rounded-xl bg-black/60 border border-cyan-900/60 font-mono-tech text-xs">
                        <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-2">
                          ÁRBOL DEDUCTIVO // CRITERIO TÉCNICO
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
                    ) : (
                      <div className="p-3 rounded-xl bg-black/60 border border-cyan-900/60 font-mono-tech text-xs">
                        <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-2">
                          EVIDENCIA CIENTÍFICA / HALLAZGO KERNEL
                        </span>
                        <p className="text-cyan-200 text-[11px]">
                          {mod.scientificFact || mod.summary}
                        </p>
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 font-mono-tech text-[11px] text-zinc-400">
                      <span className="text-zinc-300 font-bold block mb-1">HERRAMIENTA SYSINTERNALS / NATIVA:</span>
                      <span className="text-cyan-400">{mod.sysinternalsTool || 'Sysinternals Suite / PowerShell'}</span>
                    </div>
                  </div>

                  {/* Right Column: Commands, False Positives & Reversibility */}
                  <div className="space-y-3">
                    {/* Command Box */}
                    <div className="p-3 rounded-xl bg-[#090D14] border border-cyan-900">
                      <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>COMANDO AUDITORÍA POWERSHELL</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySnippet(mod.powershellCommand || mod.forensicCommand || mod.practicalCommand || '')}
                          className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedSnippet === (mod.powershellCommand || mod.forensicCommand || mod.practicalCommand || '') ? (
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
                      <pre className="p-2.5 rounded bg-black/80 font-mono-tech text-[11px] text-cyan-300 overflow-x-auto border border-cyan-950 select-all">
                        <code>{mod.powershellCommand || mod.forensicCommand || mod.practicalCommand || '# Auditoría nativa de Windows'}</code>
                      </pre>
                    </div>

                    {/* Reversibility & False Positives */}
                    <div className="p-3 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-wider block">
                          REGLA DE REVERSIBILIDAD (EVO GUARANTEE)
                        </span>
                        <p className="text-zinc-300 text-[11px] font-sans-editorial">
                          {mod.reversibility || mod.scientificFact || 'Totalmente documentado y reversible con comando nativo o exportación de registro.'}
                        </p>
                      </div>

                      <div className="border-t border-zinc-900 pt-2">
                        <span className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-wider block">
                          FALSO POSITIVO TÍPICO DE INTERNET
                        </span>
                        <p className="text-zinc-400 text-[11px] font-sans-editorial">
                          {mod.falsePositive || mod.warningNotice || 'Evitar tocar claves sin respaldo previo .reg.'}
                        </p>
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    <div className="p-2.5 rounded-lg bg-black/50 border border-cyan-950 text-[11px] font-mono-tech text-zinc-300 space-y-1">
                      {mod.keyTakeaways.map((kt, kIdx) => (
                        <div key={kIdx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400">▸</span>
                          <span>{kt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Callout */}
                <div className="p-2 rounded bg-cyan-950/20 border border-cyan-900/40 text-[10px] font-mono-tech text-cyan-300 flex items-center justify-between">
                  <span>EVO LABS // VERIFICACIÓN FORENSE REPRODUCIBLE</span>
                  <span className="text-zinc-500">MÓDULO {mod.moduleNumber} / 26</span>
                </div>
              </div>
            </Tomo02MasterPage>
          );
        })}

        {/* ========================================================
            PAGE 32: CASOS FORENSES DE WINDOWS GUIADOS
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 32) && (
          <Tomo02MasterPage
            pageId="t02-page-32"
            pageNumber={32}
            sectionTitle="EXPEDIENTES FORENSES"
            subSlug="CASOS REALES DE TALLER"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  BANCO DE PRUEBAS RESUELTO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  CASOS FORENSES GUIADOS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  4 incidentes reales analizados con el método EVO: del síntoma a la causa raíz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tech">
                {TOMO_02_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-zinc-950/80 border border-cyan-950 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-zinc-900 pb-1 mb-1.5">
                        <span className="font-bold">{c.title}</span>
                        <span className="text-zinc-500">{c.toolUsed}</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 space-y-1">
                        <p><strong className="text-zinc-400">Síntoma:</strong> {c.symptom}</p>
                        <p><strong className="text-amber-400">Hipótesis falsa:</strong> {c.hypothesis}</p>
                        <p><strong className="text-cyan-400">Causa Raíz:</strong> {c.rootCause}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-zinc-900 text-[10px] text-emerald-400">
                      <strong>Acción pericial:</strong> {c.resolution}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-cyan-950 text-xs font-mono-tech text-zinc-300 flex items-center justify-between">
                <span>REGLA FORENSE N° 1:</span>
                <span className="text-cyan-400 font-bold">
                  “EL SÍNTOMA NUNCA ES LA CAUSA RAÍZ.”
                </span>
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 33: LOS 5 SECRETOS DEL KERNEL
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 33) && (
          <Tomo02MasterPage
            pageId="t02-page-33"
            pageNumber={33}
            sectionTitle="MICRO-ARQUITECTURA"
            subSlug="SECRETOS DEL KERNEL"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  DOCUMENTACIÓN AVANZADA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  LOS 5 SECRETOS FORENSES DEL KERNEL
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Conceptos que los cursos convencionales callan y la telemetría real desmiente.
                </p>
              </div>

              <div className="space-y-2.5 text-xs font-mono-tech">
                {TOMO_02_SECRETS.map((s, sIdx) => (
                  <div
                    key={s.id || sIdx}
                    className="p-3 rounded-xl bg-zinc-950/70 border border-cyan-950 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-cyan-400">
                      <span className="font-bold text-white text-[12px]">
                        SECRETO #{sIdx + 1}: {s.title || s.name}
                      </span>
                    </div>
                    <p className="text-zinc-300 font-sans-editorial text-[11px] leading-relaxed">
                      {s.explanation || s.description}
                    </p>
                    <div className="p-2 rounded bg-black/70 border border-cyan-950 text-[10px] text-cyan-300">
                      <strong>Impacto Técnico Real:</strong> {s.impact || s.whyItMatters}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded bg-cyan-950/20 border border-cyan-900/40 text-[10px] font-mono-tech text-zinc-400 text-center">
                DESARROLLADO A PARTIR DE LOS ESTÁNDARES DE MICROSOFT WINDOWS INTERNALS (RUSSINOVICH & SOLOMON).
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 34: GLOSARIO FORENSE A-Z
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 34) && (
          <Tomo02MasterPage
            pageId="t02-page-34"
            pageNumber={34}
            sectionTitle="DICCIONARIO TÉCNICO"
            subSlug="GLOSARIO FORENSE A-Z"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  TERMINOLOGÍA PRECISA
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  GLOSARIO FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Conceptos esenciales para hablar con rigor pericial y no con mitos de foro.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech overflow-y-auto max-h-[720px] pr-1">
                {TOMO_02_GLOSSARY.map((g, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-2.5 rounded-lg bg-zinc-950/70 border border-cyan-950 space-y-1"
                  >
                    <span className="text-cyan-300 font-bold text-[11px]">
                      {g.term}
                    </span>
                    <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                      {g.definition || g.technicalDefinition}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2 text-[10px] font-mono-tech text-zinc-500 text-center border-t border-zinc-900">
                TOTAL DE TÉRMINOS DEFINIDOS: {TOMO_02_GLOSSARY.length} CONCEPTOS CRÍTICOS
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 35: PASAPORTE / FICHA DE AUDITORÍA FORENSE IMPRIMIBLE
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === 35) && (
          <Tomo02MasterPage
            pageId="t02-page-35"
            pageNumber={35}
            sectionTitle="INSTRUMENTO DE TALLER"
            subSlug="FICHA DE AUDITORÍA DE WINDOWS"
            accentColor="#00D2FF"
          >
            <div className="h-full flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                  HERRAMIENTA DE CAMPO
                </span>
                <h2 className="text-2xl font-display font-black text-white tracking-tight">
                  HOJA DE AUDITORÍA FORENSE DE WINDOWS
                </h2>
                <p className="text-xs font-mono-tech text-zinc-400">
                  Completá esta ficha técnica antes y después de intervenir cualquier sistema.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/80 border-2 border-dashed border-cyan-900 space-y-4 font-mono-tech text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">FECHA DE PERITAJE:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">VERSIÓN DE WINDOWS:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">BUILD NUMBER:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TÉCNICO A CARGO:</span>
                    <div className="h-6 border-b border-zinc-700 mt-1"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-cyan-400 font-bold text-[11px] block">
                      LÍNEA BASE INICIAL (PRE-INTERVENCIÓN):
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>Latencia DPC máxima (µs): ______________</div>
                      <div>Cantidad de procesos en reposo: ________</div>
                      <div>Consumo de RAM en reposo (GB): _________</div>
                      <div>Tiempo de arranque LastBIOS (seg): _____</div>
                      <div>Servicios no Microsoft activos: ________</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-emerald-400 font-bold text-[11px] block">
                      LÍNEA BASE FINAL (POST-INTERVENCIÓN):
                    </span>
                    <div className="space-y-1.5 text-[11px] text-zinc-400">
                      <div>Latencia DPC máxima (µs): ______________</div>
                      <div>Cantidad de procesos en reposo: ________</div>
                      <div>Consumo de RAM en reposo (GB): _________</div>
                      <div>Tiempo de arranque LastBIOS (seg): _____</div>
                      <div>Delta de mejora verificado (%): ________</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block mb-1">
                    FIRMA DE CONFORMIDAD Y PUNTO DE RESTAURACIÓN CREADO:
                  </span>
                  <div className="h-10 border border-zinc-800 rounded bg-zinc-950/50 p-2 text-[10px] text-zinc-600">
                    Nombre del Restore Point: EVO_AUDIT_BASELINE_[FECHA] // SHA256 Registro Respaldado
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono-tech text-cyan-400 text-center">
                ESTA FICHA PUEDE IMPRIMIRSE DIRECTAMENTE EN HOJA A4 PARA INCORPORAR AL EXPEDIENTE DE TALLER.
              </div>
            </div>
          </Tomo02MasterPage>
        )}

        {/* ========================================================
            PAGE 36: BACK COVER / CONTRATAPA
        ======================================================== */}
        {(viewMode === 'continuous' || currentPage === totalPages) && (
          <Tomo02MasterPage
            pageId="t02-page-36"
            pageNumber={totalPages}
            isBackCover
            hideHeaderFooter
            accentColor="#00D2FF"
          >
            <div className="h-full w-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-[#030609] via-[#05080E] to-[#020305] text-white">
              <div className="border-b border-cyan-950 pb-4">
                <span className="text-xs font-mono-tech text-cyan-400 tracking-widest uppercase">
                  COLECCIÓN EDITORIAL EVO LABS // CIERRE DE EDICIÓN
                </span>
                <h2 className="text-3xl font-display font-black text-white mt-1">
                  TOMO 02 // LA BIBLIA NEGRA DE WINDOWS
                </h2>
              </div>

              <div className="my-auto max-w-lg space-y-4">
                <blockquote className="border-l-2 border-cyan-400 pl-4 text-base sm:text-lg text-zinc-300 font-sans-editorial italic">
                  “No hay magia en el software. Hay millones de instrucciones lógicas ejecutándose en nanosegundos. Quien domina la telemetría, domina la máquina.”
                </blockquote>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-cyan-950 space-y-2 text-xs font-mono-tech">
                  <span className="text-cyan-400 font-bold block">
                    COMPETENCIAS DESBLOQUEADAS:
                  </span>
                  <p className="text-zinc-400">
                    ✔ Diagnóstico pericial de servicios e hilos del Kernel.<br />
                    ✔ Auditoría de latencias DPC y audio en tiempo real.<br />
                    ✔ Depuración metódica sin dañar la integridad del sistema.<br />
                    ✔ Análisis forense de eventos y volcados de memoria (Minidumps).
                  </p>
                </div>
              </div>

              <div className="border-t border-cyan-950 pt-4 flex items-end justify-between text-xs font-mono-tech text-zinc-500">
                <div>
                  <span className="text-white font-bold">EVO LABS RESEARCH GROUP</span>
                  <p className="text-[10px]">Buenos Aires // Edición Pericial 2026</p>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold tracking-widest text-sm">
                    FIN DEL TOMO 02
                  </span>
                  <p className="text-[9px]">CONTINÚA EN TOMO 03: REPARÁ TU PC</p>
                </div>
              </div>
            </div>
          </Tomo02MasterPage>
        )}
      </main>

      {/* Export / PDF Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-[#0b0e14] border border-cyan-900/80 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl font-sans-editorial">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  Exportar Tomo 02 a PDF A4
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
                Para obtener un PDF de calidad editorial idéntico a una revista impresa:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-cyan-950 space-y-1.5 text-[11px]">
                <div>1. Destino: <strong>Guardar como PDF</strong></div>
                <div>2. Tamaño de papel: <strong>A4</strong></div>
                <div>3. Márgenes: <strong>Ninguno / 0 mm</strong></div>
                <div>4. Gráficos de fondo: <strong>Activado (Obligatorio)</strong></div>
              </div>

              {isInIframe && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900 text-cyan-300 text-[11px] space-y-2">
                  <p>
                    💡 Estás en una vista de previsualización. Para abrir el diálogo de impresión nativo sin restricciones del navegador:
                  </p>
                  <a
                    href={getStandalonePrintUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ABRIR EN PESTAÑA NUEVA PARA IMPRIMIR</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-cyan-950">
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
                className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,210,255,0.4)]"
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
