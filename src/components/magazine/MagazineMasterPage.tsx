import React from 'react';

interface MagazineMasterPageProps {
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

export const MagazineMasterPage: React.FC<MagazineMasterPageProps> = ({
  pageNumber,
  totalPages = 46,
  sectionTitle = 'INFORME PERICIAL',
  subSlug = 'HARDWARE & ARQUITECTURA DE SILICIO',
  accentColor = '#EAB308',
  hideHeaderFooter = false,
  isCover = false,
  isBackCover = false,
  children,
  pageId,
}) => {
  return (
    <article
      id={pageId}
      className={`a4-magazine-page relative mx-auto bg-[#090A0E] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-200 border border-zinc-800/60 print:border-none print:shadow-none print:m-0 print:p-0 flex flex-col ${
        isCover ? 'bg-[#060709]' : isBackCover ? 'bg-[#050608]' : 'bg-[#0A0C10]'
      }`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Background Micro Grid for Technical Print Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid" />

      {/* Registration Marks / Print Alignment (Screen only) */}
      <div className="absolute top-2 left-2 text-[8px] font-mono-tech text-zinc-700 select-none pointer-events-none hidden sm:block print:hidden">
        + 210×297mm // A4 PORTRAIT
      </div>
      <div className="absolute top-2 right-2 text-[8px] font-mono-tech text-zinc-700 select-none pointer-events-none hidden sm:block print:hidden">
        EVO LABS EDITORIAL // 300 DPI +
      </div>

      {!hideHeaderFooter && (
        <header className="relative z-20 shrink-0 px-[16mm] pt-[8mm] pb-[2.5mm] border-b border-zinc-800/70 flex items-center justify-between text-[10px] font-mono-tech tracking-wider text-zinc-400 select-none">
          <div className="flex items-center gap-2.5">
            <span
              className="w-1.5 h-1.5 inline-block"
              style={{ backgroundColor: accentColor }}
            />
            <span className="font-bold text-white tracking-widest uppercase">
              EVO LABS MAGAZINE
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 hidden sm:inline uppercase tracking-widest">
              TOMO 01 // CONOCÉ TU PC
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500 uppercase tracking-widest text-[9px] hidden md:inline">
              {subSlug}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
              style={{
                backgroundColor: `${accentColor}1A`,
                color: accentColor,
                border: `1px solid ${accentColor}33`,
              }}
            >
              {sectionTitle}
            </span>
          </div>
        </header>
      )}

      {/* Main Page Editorial Body */}
      {hideHeaderFooter ? (
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      ) : (
        <div className="relative z-10 w-full flex-1 min-h-0 px-[16mm] py-[3mm] flex flex-col">
          <div className="flex-1 w-full flex flex-col justify-between">{children}</div>
        </div>
      )}

      {!hideHeaderFooter && (
        <footer className="relative z-20 shrink-0 px-[16mm] pt-[2.5mm] pb-[8mm] border-t border-zinc-800/70 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500 select-none">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-200">
              PÁG. {String(pageNumber).padStart(2, '0')}
            </span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-500">
              {String(totalPages).padStart(2, '0')}
            </span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="text-zinc-400 tracking-wider hidden sm:inline text-[9px] uppercase font-semibold">
              COLECCIÓN PERICIAL // TOMO 01
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-yellow-400/90 text-[9.5px] uppercase tracking-widest font-mono-tech hidden sm:inline">
              "HACEMOS MILAGROS, PERO LOS MEDIMOS."
            </span>
            <span className="text-zinc-600 text-[9px] uppercase tracking-widest hidden lg:inline">
              A4 PORTRAIT • 210×297 MM
            </span>
          </div>
        </footer>
      )}
    </article>
  );
};
