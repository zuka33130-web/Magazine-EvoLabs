import React from 'react';

interface Tomo03MasterPageProps {
  pageNumber: number;
  totalPages?: number;
  sectionTitle?: string;
  subSlug?: string;
  accentColor?: string;
  hideHeaderFooter?: boolean;
  isCover?: boolean;
  isBackCover?: boolean;
  children: React.ReactNode;
  pageId: string;
}

export const Tomo03MasterPage: React.FC<Tomo03MasterPageProps> = ({
  pageNumber,
  totalPages = 48,
  sectionTitle = 'MANUAL DE BANCO PC',
  subSlug = 'DIAGNÓSTICO & HARDWARE DE ESCRITORIO',
  accentColor = '#10B981',
  hideHeaderFooter = false,
  isCover = false,
  isBackCover = false,
  children,
  pageId,
}) => {
  return (
    <article
      id={pageId}
      className={`a4-magazine-page relative mx-auto bg-[#070A08] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-200 border border-emerald-950/60 print:border-none print:shadow-none print:m-0 print:p-0 ${
        isCover ? 'bg-[#030504]' : isBackCover ? 'bg-[#020403]' : 'bg-[#060907]'
      }`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Background Subtle Workbench Technical Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-tech-grid" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Alignment Marks */}
      <div className="absolute top-2 left-2 text-[8px] font-mono-tech text-emerald-900 select-none pointer-events-none hidden sm:block print:hidden">
        + 210×297mm // A4 TOMO 03 // REPARÁ TU PC
      </div>
      <div className="absolute top-2 right-2 text-[8px] font-mono-tech text-emerald-900 select-none pointer-events-none hidden sm:block print:hidden">
        EVO LABS WORKBENCH EDITION // BANCO DE TALLER +
      </div>

      {!hideHeaderFooter && (
        <header className="relative z-20 px-8 pt-5 pb-3 border-b border-emerald-950/70 flex items-center justify-between text-[10px] font-mono-tech tracking-wider text-zinc-400 select-none">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 inline-block shadow-[0_0_8px_#10B981]"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-bold text-white tracking-widest uppercase">
              EVO LABS
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-emerald-400 font-semibold uppercase tracking-widest">
              TOMO 03 // REPARÁ TU PC
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500 uppercase tracking-widest text-[9px] hidden md:inline">
              {subSlug}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: accentColor,
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              {sectionTitle}
            </span>
          </div>
        </header>
      )}

      {/* Page Content Body */}
      <div
        className={`relative z-10 w-full flex flex-col justify-between ${
          hideHeaderFooter ? 'h-full p-0' : 'h-[calc(100%-74px)] px-7 sm:px-9 py-5'
        }`}
      >
        <div className="flex-1 w-full flex flex-col">{children}</div>

        {!hideHeaderFooter && (
          <footer className="mt-auto pt-3 border-t border-emerald-950/70 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500 select-none">
            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-300">
                PÁG. {String(pageNumber).padStart(2, '0')}
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-600">{String(totalPages).padStart(2, '0')}</span>
              <span className="text-zinc-800">|</span>
              <span className="text-zinc-500 tracking-wide">
                “NO REEMPLACES A CIEGAS. MEDÍ PRIMERO.”
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-zinc-600 uppercase tracking-widest text-[9px]">
                MÉTODO FORENSE HARDWARE
              </span>
              <span className="text-emerald-400 font-mono-tech text-[9px]">
                [EVO-T03-P{String(pageNumber).padStart(2, '0')}]
              </span>
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};
