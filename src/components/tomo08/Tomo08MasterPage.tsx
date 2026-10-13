import React from 'react';

interface Tomo08MasterPageProps {
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

export const Tomo08MasterPage: React.FC<Tomo08MasterPageProps> = ({
  pageNumber,
  totalPages = 16,
  sectionTitle = 'SECUENCIA DE ARRANQUE',
  subSlug = 'DIAGNÓSTICO FORENSE DE POST A WINDOWS',
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
      className={`a4-magazine-page relative mx-auto bg-[#070b09] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-200 border border-emerald-950/60 print:border-none print:shadow-none print:m-0 print:p-0 ${
        isCover ? 'bg-[#030604]' : isBackCover ? 'bg-[#020403]' : 'bg-[#050907]'
      }`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Background Subtle Technical Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Alignment Marks */}
      <div className="absolute top-2 left-2 text-[8px] font-mono-tech text-emerald-900 select-none pointer-events-none hidden sm:block print:hidden">
        + 210×297mm // A4 TOMO 08 // DEL BOTÓN POWER A WINDOWS
      </div>
      <div className="absolute top-2 right-2 text-[8px] font-mono-tech text-emerald-900 select-none pointer-events-none hidden sm:block print:hidden">
        EVO LABS BOOT TRACER EDITION // DIAGNÓSTICO FÍSICO +
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
              TOMO 08 // DEL BOTÓN POWER A WINDOWS
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
                “CADA MILISEGUNDO RESPONDE A UNA CADENA DE CONDICIONES ELÉCTRICAS Y LÓGICAS.”
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-zinc-600 uppercase tracking-widest text-[9px]">
                ARQUITECTURA DE ARRANQUE
              </span>
              <span className="text-emerald-400 font-mono-tech text-[9px]">
                [EVO-T08-P{String(pageNumber).padStart(2, '0')}]
              </span>
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};
