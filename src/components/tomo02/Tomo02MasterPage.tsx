import React from 'react';

export interface Tomo02MasterPageProps {
  pageNumber: number;
  totalPages?: number;
  sectionTitle?: string;
  subSlug?: string;
  pageFooterRight?: string;
  accentColor?: string;
  hideHeaderFooter?: boolean;
  isCover?: boolean;
  isBackCover?: boolean;
  children: React.ReactNode;
  pageId?: string;
}

export const Tomo02MasterPage: React.FC<Tomo02MasterPageProps> = ({
  pageNumber,
  totalPages = 38,
  sectionTitle = 'INGENIERÍA DEL SISTEMA OPERATIVO',
  subSlug = 'DOMINÁ WINDOWS',
  pageFooterRight,
  accentColor = '#00D2FF',
  hideHeaderFooter = false,
  isCover = false,
  isBackCover = false,
  children,
  pageId,
}) => {
  return (
    <article
      id={pageId}
      className={`a4-magazine-page relative mx-auto bg-[#08090C] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-200 border border-cyan-950/60 print:border-none print:shadow-none print:m-0 print:p-0 ${
        isCover ? 'bg-[#040608]' : isBackCover ? 'bg-[#030406]' : 'bg-[#07090D]'
      }`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Background Subtle Cyber-Matrix Technical Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-tech-grid" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Alignment Marks */}
      <div className="absolute top-2 left-2 text-[8px] font-mono-tech text-cyan-900 select-none pointer-events-none hidden sm:block print:hidden">
        + 210×297mm // A4 TOMO 02 // DOMINÁ WINDOWS
      </div>
      <div className="absolute top-2 right-2 text-[8px] font-mono-tech text-cyan-900 select-none pointer-events-none hidden sm:block print:hidden">
        EVO LABS FORENSIC EDITION // DESMONTAJE DEL KERNEL NT +
      </div>

      {!hideHeaderFooter && (
        <header className="relative z-20 px-8 pt-4 pb-2.5 border-b border-cyan-950/70 flex items-center justify-between text-[10px] font-mono-tech tracking-wider text-zinc-400 select-none">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 inline-block shadow-[0_0_8px_#00D2FF]"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-bold text-cyan-400 tracking-widest uppercase">
              EVO LABS MAGAZINE // TOMO 02
            </span>
          </div>

          <div className="text-zinc-400 uppercase tracking-widest text-[9px] font-medium hidden sm:block">
            {subSlug || sectionTitle}
          </div>

          <div className="font-bold text-zinc-300 tracking-wider">
            PÁG. {String(pageNumber).padStart(2, '0')}
          </div>
        </header>
      )}

      {/* Page Content Body */}
      <div
        className={`relative z-10 w-full flex flex-col justify-between ${
          hideHeaderFooter ? 'h-full p-0' : 'h-[calc(100%-62px)] px-6 sm:px-8 py-3.5'
        }`}
      >
        <div className="flex-1 w-full flex flex-col justify-between min-h-0 overflow-hidden">{children}</div>

        {!hideHeaderFooter && (
          <footer className="mt-auto pt-2.5 border-t border-cyan-950/70 flex items-center justify-between text-[9.5px] font-mono-tech text-zinc-500 select-none">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider">
                EVO LABS // {sectionTitle || 'COLECCIÓN PERICIAL'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-right">
              <span className="text-cyan-400/90 font-medium tracking-wide uppercase">
                {pageFooterRight || 'LEMA: SI NO PODÉS REVERTIRLO, NO LO TOQUES'}
              </span>
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};
