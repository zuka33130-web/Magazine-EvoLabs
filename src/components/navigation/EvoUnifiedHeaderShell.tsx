import React, { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { EvoMundoWordmark } from '../common/EvoMundoWordmark';

export interface EvoUnifiedHeaderShellProps {
  variant?: 'public' | 'app';
  activeSectionTitle?: string;
  onBrandClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  desktopNavItems?: React.ReactNode;
  rightActions?: React.ReactNode;
  mobileNavItems?: React.ReactNode;
  className?: string;
}

export const EvoUnifiedHeaderShell: React.FC<EvoUnifiedHeaderShellProps> = ({
  variant = 'app',
  activeSectionTitle,
  onBrandClick,
  showBackButton = false,
  onBackClick,
  desktopNavItems,
  rightActions,
  mobileNavItems,
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-50 w-full bg-[#07090e]/95 backdrop-blur-2xl border-b border-zinc-800/80 shadow-xl font-mono-tech select-none print:hidden ${className}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-15 sm:h-16 flex items-center justify-between gap-4">
        
        {/* Brand Area - Desplazado hacia el margen izquierdo */}
        <div className="flex items-center gap-4 shrink-0 pl-1">
          <button
            type="button"
            onClick={onBrandClick}
            className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-1 focus:ring-amber-400 rounded-lg p-1 transition-transform active:scale-95 cursor-pointer"
            aria-label="EVO LABS Inicio"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.55)] transition-all duration-300 flex items-center justify-center">
              <div className="w-full h-full bg-[#080a11] rounded-[11px] flex items-center justify-center relative overflow-hidden">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6L7.5 8.5V13.5L12 16L16.5 13.5V8.5L12 6Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="12" cy="11" r="1.5" fill="#fef08a" />
                </svg>
              </div>
            </div>

            <EvoMundoWordmark variant="compact" showUniverseBadge={false} />
          </button>

          {showBackButton && onBackClick && (
            <button
              type="button"
              onClick={onBackClick}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-800/90 bg-zinc-900/90 hover:bg-zinc-800 hover:border-amber-400/50 text-zinc-300 hover:text-white transition-all text-[11px] sm:text-xs font-mono-tech font-bold cursor-pointer shadow-sm group select-none shrink-0"
              title="Volver a la pantalla anterior"
              aria-label="Volver a la pantalla anterior"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>VOLVER</span>
            </button>
          )}

          {activeSectionTitle && (
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono-tech border-l border-zinc-800 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-zinc-400 font-bold uppercase tracking-wider">{activeSectionTitle}</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation links - Zona central equilibrada */}
        {desktopNavItems && (
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-auto">
            {desktopNavItems}
          </div>
        )}

        {/* Right Actions + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 shrink-0 pr-1">
          {rightActions}

          {/* Mobile Menu Hamburger button */}
          {mobileNavItems && (
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileNavItems && mobileMenuOpen && (
        <div className="lg:hidden bg-[#07090e] border-b border-zinc-800 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 pb-1 border-b border-zinc-800/80 flex items-center justify-between">
            <span>EVO LABS // NAVEGACIÓN {variant.toUpperCase()}</span>
            {showBackButton && onBackClick && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackClick();
                }}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3 text-amber-400" />
                <span>VOLVER</span>
              </button>
            )}
          </div>
          <div onClick={() => setMobileMenuOpen(false)}>
            {mobileNavItems}
          </div>
        </div>
      )}
    </header>
  );
};
