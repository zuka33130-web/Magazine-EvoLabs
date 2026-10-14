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
import { TOMO_02_COVER } from '../../data/tomoCoversData';

interface Tomo02OfficialPdfMagazineProps {
  onBackToCover: () => void;
  onOpenInteractive?: () => void;
  onOpenA4Magazine?: () => void;
  onOpenLab?: () => void;
  initialPage?: number;
}

export const Tomo02OfficialPdfMagazine: React.FC<Tomo02OfficialPdfMagazineProps> = ({
  onBackToCover,
  onOpenInteractive,
  onOpenA4Magazine,
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
              PDF HISTÓRICO / ARCHIVO DE REFERENCIA ({totalPages} PÁGS)
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

          {/* Download / Print button */}
          {pdfExists ? (
            <a
              href={activePdfUrl}
              download="EVO-LABS-TOMO-02-LA-BIBLIA-NEGRA-DE-WINDOWS.pdf"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.4)] cursor-pointer"
              title={`Descargar archivo oficial: ${officialFilename}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR PDF HISTÓRICO (67 PÁGS)</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onOpenA4Magazine) {
                  onOpenA4Magazine();
                } else {
                  window.print();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,210,255,0.4)] cursor-pointer"
              title="Abrir Revista A4 para exportar o guardar en PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR / IMPRIMIR PDF A4</span>
            </button>
          )}
        </div>
      </header>

      {/* ========================================================
          NOTIFICATION BAR: PHYSICAL PDF PATH STATUS
      ======================================================== */}
      {pdfExists === false && (
        <div className="bg-cyan-950/40 border-b border-cyan-500/40 px-4 py-2 flex items-center justify-between text-xs font-mono-tech text-cyan-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Edición Digital Activa:</strong> La edición web diagramada completa cuenta con 38 páginas consecutivas. (Referencia de archivo PDF histórico: 67 págs).
            </span>
          </div>
          {onOpenA4Magazine && (
            <button
              type="button"
              onClick={onOpenA4Magazine}
              className="px-3 py-1 rounded bg-cyan-400 text-black font-bold text-[10px] hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              VER EDICIÓN WEB (38 PÁGS) →
            </button>
          )}
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
                title={`Tomo 02 - Página ${currentPage}`}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            /* Standalone / Fallback Cover & Reading Deck when physical PDF is waiting */
            <div className="w-[820px] max-w-full min-h-[1100px] bg-[#03060B] border border-cyan-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl relative flex flex-col justify-between">
              {/* Atmospheric Background Tech Matrix */}
              {currentPage !== 1 && (
                <>
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-tech-grid" />
                  <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none" />
                </>
              )}

              {/* Page 1 Real Cover Display */}
              {currentPage === 1 ? (
                <img
                  src={TOMO_02_COVER}
                  alt="Portada definitiva de EVO LABS — Tomo 02: La Biblia Negra de Windows"
                  className="block w-full h-full object-contain"
                />
              ) : (
                /* Pages 2 through 67 preview card */
                <div className="h-full flex flex-col justify-between space-y-4">
                  <div className="border-b border-cyan-950 pb-3 flex items-center justify-between text-xs font-mono-tech text-cyan-400">
                    <span>EVO LABS MAGAZINE // TOMO 02</span>
                    <span className="text-zinc-500">PLIEGO EDITORIAL // PÁG. {String(currentPage).padStart(2, '0')} DE {totalPages}</span>
                  </div>

                  <div className="my-auto text-center space-y-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-display font-black text-white uppercase">
                      EDICIÓN WEB COMPLETA // 38 PÁGINAS A4
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono-tech">
                      La edición web diagramada cuenta con 38 páginas reales consecutivas con navegación fluida, casos y laboratorios.
                    </p>
                    <div className="p-4 rounded-xl bg-black/60 border border-cyan-900/40 text-xs font-mono-tech text-left space-y-2 text-zinc-300">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>EDICIÓN DISPONIBLE: MAGAZINE WEB A4</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        La edición facsimilar histórica en archivo PDF de 67 páginas se encuentra registrada como referencia de biblioteca. Para lectura directa e inmediata, utilizá la edición web diagramada.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {onOpenA4Magazine && (
                        <button
                          type="button"
                          onClick={onOpenA4Magazine}
                          className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs hover:bg-cyan-300 cursor-pointer shadow-lg shadow-cyan-400/25"
                        >
                          ABRIR MAGAZINE WEB (38 PÁGS) →
                        </button>
                      )}
                      {onOpenInteractive && (
                        <button
                          type="button"
                          onClick={onOpenInteractive}
                          className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-cyan-900 text-xs text-cyan-300 hover:text-white cursor-pointer"
                        >
                          ABRIR TOMO INTERACTIVO
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-cyan-950 pt-3 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500">
                    <span>COLECCIÓN FORENSE EVO // 38 PÁGINAS A4 WEB</span>
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
          <button
            type="button"
            onClick={onBackToCover}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
            <span>← VOLVER AL TOMO 02</span>
          </button>

          {onOpenA4Magazine && (
            <button
              type="button"
              onClick={onOpenA4Magazine}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>LEER REVISTA A4 WEB →</span>
            </button>
          )}

          {onOpenInteractive && (
            <button
              type="button"
              onClick={onOpenInteractive}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-cyan-900/60 hover:border-cyan-400 text-cyan-200 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>TOMO INTERACTIVO (27 MÓDULOS) →</span>
            </button>
          )}

          {onOpenLab && (
            <button
              type="button"
              onClick={onOpenLab}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>LABORATORIO →</span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
