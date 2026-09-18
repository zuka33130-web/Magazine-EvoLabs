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
  totalPages = 41,
  sectionTitle = 'INFORME PERICIAL',
  subSlug = 'HARDWARE & ARQUITECTURA DE SILICIO',
  accentColor = '#EAB308',
  hideHeaderFooter = false,
  isCover = false,
  isBackCover = false,
  children,
  pageId,
}) => {
  const isOdd = pageNumber % 2 !== 0;

  return (
    <article
      id={pageId}
      className={`a4-magazine-page relative mx-auto bg-[#090A0E] text-zinc-100 overflow-hidden shadow-2xl transition-all duration-200 border border-zinc-800/60 print:border-none print:shadow-none print:m-0 print:p-0 ${
        isCover ? 'bg-[#060709]' : isBackCover ? 'bg-[#050608]' : 'bg-[#0A0C10]'
      }`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Background Micro Grid for Technical Print Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-tech-grid" />

      {/* Registration Marks / Print Alignment Crosshairs (Screen only) */}
      <div className="absolute top-2 left-2 text-[8px] font-mono-tech text-zinc-700 select-none pointer-events-none hidden sm:block print:hidden">
        + 210x297mm // A4 PORTRAIT
      </div>
      <div className="absolute top-2 right-2 text-[8px] font-mono-tech text-zinc-700 select-none pointer-events-none hidden sm:block print:hidden">
        EVO LABS PUB // 300DPI +
      </div>

      {!hideHeaderFooter && (
        <>
          {/* Running Editorial Header */}
          <header className="relative z-20 px-8 pt-6 pb-3 border-b border-zinc-800/70 flex items-center justify-between text-[10px] font-mono-tech tracking-wider text-zinc-400 select-none">
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
        </>
      )}

      {/* Main Page Editorial Body */}
      <div
        className={`relative z-10 w-full flex flex-col justify-between ${
          hideHeaderFooter ? 'h-full p-0' : 'h-[calc(100%-78px)] px-7 sm:px-9 py-5'
        }`}
      >
        <div className="flex-1 w-full flex flex-col">{children}</div>

        {!hideHeaderFooter && (
          <footer className="mt-auto pt-3.5 border-t border-zinc-800/70 flex items-center justify-between text-[10px] font-mono-tech text-zinc-500 select-none">
            <div className="flex items-center gap-3">
              <span className="font-bold text-zinc-200">
                PÁG. {String(pageNumber).padStart(2, '0')}
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-500">
                {String(totalPages).padStart(2, '0')}
              </span>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="text-zinc-500 tracking-wider hidden sm:inline text-[9px]">
                ISSN 2953-4828 // EDICIÓN OFICIAL DE METROLOGÍA
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-[9px] uppercase tracking-widest hidden md:inline">
                "Hacemos milagros, pero los medimos"
              </span>
              <div
                className="flex items-center gap-[2px] h-3.5 opacity-60"
                title="EAN-13 METROLOGY ID"
              >
                {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2].map((w, i) => (
                  <span
                    key={i}
                    className="bg-zinc-400 h-full inline-block"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>
          </footer>
        )}
      </div>
    </article>
  );
};
