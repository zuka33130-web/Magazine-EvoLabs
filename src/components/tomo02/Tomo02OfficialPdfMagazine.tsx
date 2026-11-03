import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  BLOQUES_TOMO_02,
  EXPEDIENTES_TOMO_02,
  OFFICIAL_PDF_URL,
  type ExpedienteTomo02,
} from '../../data/tomo02BibliaNegra40Data';

interface Tomo02OfficialPdfMagazineProps {
  onBackToCover: () => void;
  onOpenA4Magazine?: () => void;
  onOpenInteractive?: () => void;
  onOpenLab?: () => void;
}

export const Tomo02OfficialPdfMagazine: React.FC<Tomo02OfficialPdfMagazineProps> = ({
  onBackToCover,
}) => {
  const [activeTab, setActiveTab] = useState<'reader' | 'pdf_native'>('reader');

  const scrollToExpediente = (numStr: string) => {
    setActiveTab('reader');
    setTimeout(() => {
      const el = document.getElementById(`expediente-${numStr}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePrintOrGenerate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#020204] text-zinc-100 flex flex-col font-sans-editorial selection:bg-rose-600 selection:text-white">
      {/* Print CSS to ensure exact A4 page breaks and clean printout */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 15mm 15mm;
          }
          body {
            background-color: #020204 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .pdf-page-leaf {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* =========================================================================
          TOP NAVIGATION BAR (no-print)
      ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#08080C]/95 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech no-print shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCover}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-rose-500 hover:text-rose-300 text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← VOLVER AL TOMO 02</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-800 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            <span className="font-bold text-white uppercase tracking-wider">LA BIBLIA NEGRA DE WINDOWS</span>
            <span>/</span>
            <span className="text-zinc-400">40 EXPEDIENTES</span>
          </div>
        </div>

        {/* Tab & Actions Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edición Digital</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf_native')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pdf_native'
                  ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Visor PDF Original</span>
            </button>
          </div>

          <a
            href={OFFICIAL_PDF_URL}
            download="Evolabs_Biblia_Negra_Windows_Tomo02.pdf"
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Descargar archivo PDF original de 43 páginas"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Descargar PDF</span>
          </a>

          <button
            type="button"
            onClick={handlePrintOrGenerate}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            title="Imprimir / Guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          VIEW MODE 1: NATIVE EMBEDDED PDF VIEWER (Direct file rendering)
      ========================================================================= */}
      {activeTab === 'pdf_native' ? (
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 text-xs font-mono-tech text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Documento Oficial PDF Cargado (43 páginas · 2.48 MB)
            </span>
            <a
              href={OFFICIAL_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 underline"
            >
              <span>Abrir en ventana completa</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="w-full h-[84vh] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
            <iframe
              src={`${OFFICIAL_PDF_URL}#toolbar=1&navpanes=1`}
              title="PDF Magazine Tomo 02"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      ) : (
        /* =====================================================================
            VIEW MODE 2: PIXEL-PERFECT DIGITAL RECREATION (Pages 1-43)
        ===================================================================== */
        <main className="flex-1 max-w-[210mm] mx-auto w-full px-3 sm:px-6 py-8 space-y-12">
          
          {/* ===================================================================
              PAGES 1 - 3: TABLA DE EXPEDIENTES / ÍNDICE COMPLETO
          =================================================================== */}
          <section className="pdf-page-leaf rounded-2xl bg-[#030305] border border-zinc-800/80 p-6 sm:p-10 shadow-2xl">
            {/* Header */}
            <div className="border-b border-zinc-900 pb-4 mb-6">
              <span className="text-rose-500 font-mono-tech text-[10px] tracking-[0.25em] uppercase font-black block mb-1">
                TABLA DE EXPEDIENTES
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                Índice completo
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                40 expedientes, 5 bloques temáticos. Cada título es un capítulo completo y desarrollado, listo para leer o exportar.
              </p>
            </div>

            {/* Blocks & Titles Matrix */}
            <div className="space-y-8">
              {BLOQUES_TOMO_02.map((bloque) => (
                <div key={bloque.id} className="space-y-3">
                  {/* Block Header */}
                  <div className="flex items-center gap-3 border-b border-zinc-900/90 pb-2">
                    <span className="w-6 h-6 rounded bg-rose-950/80 border border-rose-500/40 text-rose-400 font-mono-tech font-bold text-xs flex items-center justify-center">
                      {bloque.number}
                    </span>
                    <div>
                      <h2 className="text-xs font-mono-tech font-bold uppercase tracking-wider text-white">
                        {bloque.title}
                      </h2>
                      <span className="text-[10px] font-mono-tech text-zinc-400">
                        {bloque.expedientesRange}
                      </span>
                    </div>
                  </div>

                  {/* 2-Column List of Expedientes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                    {EXPEDIENTES_TOMO_02.filter((exp) => exp.blockNumber === bloque.number).map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => scrollToExpediente(exp.numberStr)}
                        className="group flex items-start justify-between text-left p-1.5 rounded hover:bg-zinc-900/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-baseline gap-2.5 pr-2">
                          <span className="font-mono-tech text-xs text-zinc-400 group-hover:text-rose-400 font-semibold shrink-0">
                            {exp.numberStr}
                          </span>
                          <span className="text-xs text-zinc-300 group-hover:text-white leading-snug line-clamp-2">
                            {exp.title}
                          </span>
                        </div>
                        <span className="font-mono-tech text-[10px] text-emerald-400 shrink-0 font-bold flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          LISTO
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================================
              PAGES 4 - 43: THE 40 EXPEDIENTES (Cards matched to PDF)
          =================================================================== */}
          {EXPEDIENTES_TOMO_02.map((exp, idx) => {
            // Determine if this expediente starts a new block
            const isFirstOfBlock =
              idx === 0 || EXPEDIENTES_TOMO_02[idx - 1].blockNumber !== exp.blockNumber;
            const currentBlock = BLOQUES_TOMO_02.find((b) => b.number === exp.blockNumber);

            return (
              <React.Fragment key={exp.id}>
                {/* Block Header Banner if first in block */}
                {isFirstOfBlock && currentBlock && (
                  <div className="pdf-page-leaf rounded-2xl bg-[#040407] border border-zinc-800 p-6 sm:p-8 text-center space-y-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400 font-mono-tech font-black text-sm flex items-center justify-center mx-auto">
                      {currentBlock.number}
                    </div>
                    <span className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-rose-400 block font-bold">
                      BLOQUE {currentBlock.number} · {currentBlock.expedientesRange}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                      {currentBlock.title}
                    </h2>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono-tech text-zinc-400">
                      {currentBlock.count} EXPEDIENTES
                    </span>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto font-sans-editorial leading-relaxed">
                      {currentBlock.description}
                    </p>
                  </div>
                )}

                {/* Individual Expediente Card (Matching exact screenshot styling) */}
                <article
                  id={`expediente-${exp.numberStr}`}
                  className="pdf-page-leaf rounded-2xl bg-[#06070B] border border-zinc-800/90 p-6 sm:p-9 shadow-xl space-y-5 transition-all hover:border-zinc-700 relative"
                >
                  {/* Top Bar: Number, Block and Level Badge */}
                  <div className="flex items-center justify-between font-mono-tech text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-rose-500 font-black text-sm">
                        {exp.numberStr}
                      </span>
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px]">
                        BLOQUE {exp.blockNumber} · {exp.blockTitle}
                      </span>
                    </div>

                    {/* Level Pill */}
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold flex items-center gap-1.5 border ${
                        exp.level === 'BÁSICO'
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                          : exp.level === 'INTERMEDIO'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{exp.level}</span>
                    </div>
                  </div>

                  {/* Title & Viral Hook */}
                  <div className="space-y-1.5 pt-1">
                    <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-snug">
                      {exp.title}
                    </h2>
                    <p className="text-rose-400 font-sans-editorial text-xs sm:text-sm leading-relaxed italic">
                      {exp.hook}
                    </p>
                  </div>

                  {/* Body Paragraphs */}
                  <div className="space-y-3 text-xs sm:text-sm text-zinc-300 font-sans-editorial leading-relaxed">
                    <p>{exp.paragraphs[0]}</p>
                    <p>{exp.paragraphs[1]}</p>
                  </div>

                  {/* DATO VERIFICABLE Box (Red outline box exactly like in PDF) */}
                  <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-1.5">
                    <span className="text-rose-500 font-mono-tech text-[10px] font-black tracking-widest uppercase block">
                      DATO VERIFICABLE
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 font-mono-tech leading-relaxed">
                      {exp.verifiableData}
                    </p>
                  </div>
                </article>
              </React.Fragment>
            );
          })}

          {/* ===================================================================
              PAGE 43: FINAL CLOSING BANNER & CTA
          =================================================================== */}
          <section className="pdf-page-leaf rounded-2xl bg-[#050508] border-2 border-rose-600/40 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                EXPEDIENTE CERRADO. EL CONOCIMIENTO, ABIERTO.
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto font-sans-editorial leading-relaxed">
                Compartí esta edición con tu comunidad y convertí cada expediente en una nueva razón para que lectores y clientes elijan a Evolabs como su fuente de confianza en Windows.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrintOrGenerate}
                className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all cursor-pointer"
              >
                GENERAR PDF DEL MAGAZINE
              </button>

              <a
                href={OFFICIAL_PDF_URL}
                download="Evolabs_Biblia_Negra_Windows_Tomo02.pdf"
                className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 font-mono-tech text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>DESCARGAR PDF ORIGINAL (2.48 MB)</span>
              </a>
            </div>
          </section>

        </main>
      )}

      {/* =========================================================================
          FOOTER (no-print)
      ========================================================================= */}
      <footer className="border-t border-zinc-900 bg-[#040406] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-tech text-zinc-400 no-print">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>EVO LABS // LA BIBLIA NEGRA DE WINDOWS (TOMO 02)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrintOrGenerate}
            className="text-rose-400 hover:text-white underline cursor-pointer"
          >
            Imprimir edición completa (Ctrl + P)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={onBackToCover}
            className="text-zinc-400 hover:text-rose-300 cursor-pointer"
          >
            Volver a Portada
          </button>
        </div>
      </footer>
    </div>
  );
};
