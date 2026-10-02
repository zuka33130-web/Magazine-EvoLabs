import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { TOMO_02_META } from '../../data/tomo02Data';
import { Tomo02CoverHeroVisual } from './Tomo02CoverHeroVisual';

interface Tomo02OfficialPdfMagazineProps {
  onBackToCover: () => void;
  onOpenInteractive?: () => void;
  onOpenLab?: () => void;
  initialPage?: number;
}

export const Tomo02OfficialPdfMagazine: React.FC<Tomo02OfficialPdfMagazineProps> = ({
  onBackToCover,
  onOpenInteractive,
  onOpenLab,
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = 67;
  const defaultPdfUrl = '/magazines/tomo02/EVO-LABS-TOMO-02-DOMINA-WINDOWS.pdf';
  const alternativePdfUrl = '/magazines/tomo02/EVO-LABS-MAGAZINE-TOMO-02-DOMINA-WINDOWS-6(4).pdf';
  const officialFilename = 'EVO-LABS-MAGAZINE-TOMO-02-DOMINA-WINDOWS-6(4).pdf';
  const [activePdfUrl, setActivePdfUrl] = useState<string>(defaultPdfUrl);

  // Check if PDF file exists in public directory under either name
  useEffect(() => {
    let isMounted = true;
    fetch(defaultPdfUrl, { method: 'HEAD' })
      .then((res) => {
        if (!isMounted) return;
        if (res.ok && res.status !== 404) {
          setActivePdfUrl(defaultPdfUrl);
          setPdfExists(true);
        } else {
          // Try alternative filename
          fetch(alternativePdfUrl, { method: 'HEAD' })
            .then((res2) => {
              if (!isMounted) return;
              if (res2.ok && res2.status !== 404) {
                setActivePdfUrl(alternativePdfUrl);
                setPdfExists(true);
              } else {
                setPdfExists(false);
              }
            })
            .catch(() => {
              if (isMounted) setPdfExists(false);
            });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        fetch(alternativePdfUrl, { method: 'HEAD' })
          .then((res2) => {
            if (!isMounted) return;
            if (res2.ok && res2.status !== 404) {
              setActivePdfUrl(alternativePdfUrl);
              setPdfExists(true);
            } else {
              setPdfExists(false);
            }
          })
          .catch(() => {
            if (isMounted) setPdfExists(false);
          });
      });
    return () => {
      isMounted = false;
    };
  }, [defaultPdfUrl, alternativePdfUrl]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Home') {
        setCurrentPage(1);
      } else if (e.key === 'End') {
        setCurrentPage(totalPages);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleZoomIn = () => setZoomLevel((z) => Math.min(200, z + 15));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(60, z - 15));
  const handleResetZoom = () => setZoomLevel(100);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#05070B] text-zinc-100 flex flex-col font-sans-editorial select-none"
    >
      {/* ========================================================
          TOP NAVIGATION & CONTROLS TOOLBAR
      ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#07090F]/95 backdrop-blur-xl border-b border-cyan-950/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCover}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← VOLVER AL TOMO 02</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#00D2FF]" />
            <span className="font-extrabold text-white uppercase tracking-wider">
              DOMINÁ WINDOWS
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-cyan-400 text-[11px]">
              REVISTA OFICIAL A4 ({totalPages} PÁGS)
            </span>
          </div>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-950/90 p-1 rounded-xl border border-cyan-950">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:bg-cyan-950/60 hover:text-cyan-300 transition-all cursor-pointer"
            title="Página anterior (←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-2 flex items-center gap-1 text-[11px]">
            <span className="text-zinc-400">Pág.</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="bg-black text-cyan-400 font-bold border border-cyan-900 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {String(p).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className="text-zinc-500">/ {totalPages}</span>
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:bg-cyan-950/60 hover:text-cyan-300 transition-all cursor-pointer"
            title="Página siguiente (→)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom, Fullscreen & Download */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-950/90 p-1 rounded-xl border border-cyan-950">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 60}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Reducir zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-1.5 text-[10px] font-bold text-zinc-300 hover:text-cyan-300 cursor-pointer"
              title="Restablecer zoom (100%)"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-cyan-950 text-zinc-300 hover:text-white cursor-pointer hidden sm:block"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Download PDF button */}
          <a
            href={activePdfUrl}
            download="EVO-LABS-TOMO-02-DOMINA-WINDOWS.pdf"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.4)] cursor-pointer"
            title={`Descargar archivo oficial: ${officialFilename}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>DESCARGAR PDF (67 PÁGS)</span>
          </a>
        </div>
      </header>

      {/* ========================================================
          NOTIFICATION BAR: PHYSICAL PDF PATH STATUS
      ======================================================== */}
      {pdfExists === false && (
        <div className="bg-amber-950/40 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs font-mono-tech text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Ruta preparada:</strong> <code className="bg-black/60 px-1.5 py-0.5 rounded text-cyan-300">public/magazines/tomo02/EVO-LABS-TOMO-02-DOMINA-WINDOWS.pdf</code>. Colocá el archivo físico para visualización directa en el lector.
            </span>
          </div>
          <span className="text-[10px] text-amber-400/80 uppercase tracking-widest hidden sm:inline">
            ARCHIVO ORIGINAL: {officialFilename}
          </span>
        </div>
      )}

      {/* ========================================================
          MAIN VIEWER AREA
      ======================================================== */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto">
        <div
          className="transition-transform duration-200 origin-top flex flex-col items-center max-w-full"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* If the physical PDF exists, embed it via iframe/object viewer */}
          {pdfExists ? (
            <div className="w-[210mm] max-w-full h-[297mm] min-h-[900px] bg-black rounded-2xl shadow-2xl border border-cyan-900/60 overflow-hidden">
              <iframe
                src={`${activePdfUrl}#page=${currentPage}&view=FitH`}
                title={`Revista Oficial Tomo 02 - Página ${currentPage}`}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            /* Standalone / Fallback Cover & Reading Deck when physical PDF is waiting */
            <div className="w-[820px] max-w-full min-h-[1100px] bg-[#03060B] border border-cyan-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col justify-between">
              {/* Atmospheric Background Tech Matrix */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-tech-grid" />
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />

              {/* Page 1 Real Cover Display */}
              {currentPage === 1 ? (
                <div className="h-full flex flex-col justify-between space-y-4">
                  {/* Top Bar */}
                  <div className="relative z-10 border-b border-cyan-950 pb-2 flex items-center justify-between text-[10px] font-mono-tech tracking-wider text-cyan-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-cyan-400 inline-block shadow-[0_0_8px_#00D2FF]" />
                      <span className="font-bold text-white uppercase tracking-widest">
                        COLECCIÓN PERICIAL // TOMO 02
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-400 uppercase tracking-widest hidden sm:inline">
                        ARQUITECTURA DE SISTEMAS & KERNEL NT
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-cyan-400 font-bold">
                      <span className="text-zinc-400 hidden sm:inline">EDICIÓN COLECCIONABLE // 2026</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[9px]">
                        A4 210×297mm
                      </span>
                    </div>
                  </div>

                  {/* Masthead */}
                  <div className="relative z-10 py-1 flex items-baseline justify-between border-b-2 border-cyan-400">
                    <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase leading-none">
                      EVO LABS
                    </h1>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-tech">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>INTERNET DICE // EVO MIDE</span>
                    </div>
                  </div>

                  {/* Sub-strip */}
                  <div className="relative z-10 py-1 flex items-center justify-between text-xs font-mono-tech border-b border-cyan-950">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-cyan-400 text-black font-extrabold text-[10px] tracking-wider">
                        MAGAZINE // TOMO 02
                      </span>
                      <span className="text-white font-bold tracking-widest uppercase text-[11px]">
                        INGENIERÍA DEL SISTEMA OPERATIVO
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono-tech uppercase tracking-widest">
                      DESMONTAJE DEL KERNEL NT
                    </div>
                  </div>

                  {/* Feature Frame */}
                  <div className="relative z-10 p-4 sm:p-5 rounded-2xl border border-cyan-900/60 bg-[#060A14]/85 backdrop-blur-md shadow-2xl flex flex-col justify-between my-auto">
                    <div className="flex items-center justify-between text-[10px] font-mono-tech pb-2 border-b border-cyan-950">
                      <span className="text-cyan-400 font-bold uppercase tracking-wider">
                        • INVESTIGACIÓN PRINCIPAL // TOMO 02
                      </span>
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px]">
                        DESMONTAJE DEL KERNEL NT
                      </span>
                    </div>

                    <div className="my-2">
                      <Tomo02CoverHeroVisual />
                    </div>

                    <div className="pt-2 border-t border-cyan-950/80">
                      <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter leading-none">
                        DOMINÁ WINDOWS
                      </h2>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-cyan-400 font-bold tracking-widest text-xs sm:text-sm uppercase font-mono-tech">
                          EL LADO OSCURO DE WINDOWS
                        </span>
                        <span className="text-zinc-500">/</span>
                        <span className="text-zinc-300 text-xs sm:text-sm font-sans-editorial italic">
                          Lo usás todos los días. Ahora descubrí qué hace cuando no estás mirando.
                        </span>
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-sans-editorial">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono-tech text-[11px] mb-1">
                          <span className="text-cyan-400">❄</span>
                          <span>WINDOWS HACE COSAS ANTES DE QUE ABRAS TU PRIMER PROGRAMA.</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-snug">
                          Procesos invisibles, servicios en segundo plano, la memoria virtual que nadie te explicó y la telemetría bajo escrutinio forense.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3 Pillars */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-tech border-t border-cyan-950">
                    <div className="space-y-1">
                      <span className="text-cyan-400 font-bold text-[10px] block tracking-wider uppercase">
                        • PROCESOS & SERVICIOS
                      </span>
                      <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                        Quién ejecuta qué, svchost compartido y disparadores por eventos.
                      </p>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-cyan-950 sm:pl-3 pt-1.5 sm:pt-0">
                      <span className="text-cyan-400 font-bold text-[10px] block tracking-wider uppercase">
                        • MEMORIA VIRTUAL
                      </span>
                      <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                        Dossier especial: Commit Charge, Working Set, Standby y Pagefile.
                      </p>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-cyan-950 sm:pl-3 pt-1.5 sm:pt-0">
                      <span className="text-cyan-400 font-bold text-[10px] block tracking-wider uppercase">
                        • REGISTRO & SEGURIDAD
                      </span>
                      <p className="text-[10px] text-zinc-400 font-sans-editorial leading-tight">
                        MenuShowDelay, supercompresión compact, hash SHA-256 y defensa activa.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 pt-2 border-t border-cyan-950/80 flex flex-wrap items-center justify-between text-[10px] font-mono-tech text-zinc-500">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <span>🛡️</span>
                      <span>REGLA DE ORO EVO: SI NO PODÉS REVERTIRLO, NO LO TOQUES.</span>
                    </div>
                    <div className="text-zinc-400">
                      INTERNET DICE // EVO MIDE • <span className="text-cyan-400 font-bold">PÁG. 01 // PORTADA</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Pages 2 through 67 preview card */
                <div className="h-full flex flex-col justify-between space-y-4">
                  <div className="border-b border-cyan-950 pb-3 flex items-center justify-between text-xs font-mono-tech text-cyan-400">
                    <span>EVO LABS MAGAZINE // TOMO 02</span>
                    <span className="text-zinc-500">PLIEGO EDITORIAL // PÁG. {String(currentPage).padStart(2, '0')} DE {totalPages}</span>
                  </div>

                  <div className="my-auto text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center">
                      <FileText className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-white uppercase">
                      PÁGINA {String(currentPage).padStart(2, '0')} // EDICIÓN OFICIAL 67 PÁGINAS
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono-tech">
                      Visualizador conectado a <code className="text-cyan-300">public/magazines/tomo02/EVO-LABS-TOMO-02-DOMINA-WINDOWS.pdf</code>.
                    </p>
                    <div className="p-4 rounded-xl bg-black/60 border border-cyan-900/40 text-xs font-mono-tech text-left space-y-2 text-zinc-300">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ARCHIVO ASOCIADO: {officialFilename}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Podés colocar el archivo PDF en la carpeta pública del proyecto para navegación vectorial nativa de las 67 páginas, o usar la descarga directa.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handlePrevPage}
                        className="px-4 py-2 rounded-xl bg-zinc-900 border border-cyan-900 text-xs text-cyan-300 hover:text-white cursor-pointer"
                      >
                        ← Página Anterior
                      </button>
                      <button
                        type="button"
                        onClick={handleNextPage}
                        className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 cursor-pointer"
                      >
                        Página Siguiente →
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-cyan-950 pt-3 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
                    <span>COLECCIÓN FORENSE EVO // 67 PÁGINAS A4</span>
                    <span>PÁGINA {currentPage} / {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          BOTTOM QUICK SWITCH DECK: 3 STAGES OF PRODUCT
      ======================================================== */}
      <footer className="border-t border-cyan-950/80 bg-[#07090F]/90 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>ETAPA 01: LEER & ENTENDER (MAGAZINE A4)</span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenInteractive && (
            <button
              type="button"
              onClick={onOpenInteractive}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-cyan-900/60 hover:border-cyan-400 text-cyan-200 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>IR A TOMO INTERACTIVO →</span>
            </button>
          )}

          {onOpenLab && (
            <button
              type="button"
              onClick={onOpenLab}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>LABORATORIO ASOCIADO →</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
