import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sparkles, ChevronDown, ShieldCheck, Crown } from 'lucide-react';
import { useEvoAuth } from '../../auth/EvoAuthProvider';
import { EvoMyAccountModal } from './EvoMyAccountModal';

export interface EvoUserAccountMenuProps {
  onNavigatePlans?: () => void;
  onLogoutSuccess?: () => void;
  className?: string;
}

export const EvoUserAccountMenu: React.FC<EvoUserAccountMenuProps> = ({
  onNavigatePlans,
  onLogoutSuccess,
  className = '',
}) => {
  const { user, displayName, email, photoURL, isOwner, logout } = useEvoAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logout();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (err) {
      console.warn('[EvoUserAccountMenu] Error logging out:', err);
    }
  };

  const handleOpenMyAccount = () => {
    setIsOpen(false);
    setIsMyAccountOpen(true);
  };

  const handleViewPlans = () => {
    setIsOpen(false);
    if (onNavigatePlans) {
      onNavigatePlans();
    }
  };

  const cleanDisplayName = displayName || email?.split('@')[0] || 'Zudoka';
  const cleanEmail = email || '';
  const initials = cleanDisplayName.slice(0, 2).toUpperCase();

  return (
    <div className={`relative inline-block text-left font-mono-tech select-none ${className}`} ref={menuRef}>
      {/* Trigger Button: Visualización clara de avatar, nombre, email y estado de acceso */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800/90 hover:border-amber-400/40 text-left transition-all duration-200 cursor-pointer shadow-sm group"
        title="Menú de Cuenta // Mi Identidad y Acceso"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          {photoURL ? (
            <img
              src={photoURL}
              alt={cleanDisplayName}
              className="w-8 h-8 rounded-lg object-cover border border-amber-400/50 group-hover:border-amber-400 transition-colors"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold text-xs">
              {initials}
            </div>
          )}
          {isOwner && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-black rounded-full flex items-center justify-center shadow-sm">
              <Crown className="w-2 h-2 text-black" />
            </span>
          )}
        </div>

        {/* User Info (Nombre + Email + Estado de Acceso) */}
        <div className="hidden md:flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate max-w-[120px] font-sans-editorial">
              {cleanDisplayName}
            </span>
            {isOwner ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                OWNER
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                PLAN GRATIS
              </span>
            )}
          </div>
          {cleanEmail && (
            <span className="text-[10px] text-zinc-400 truncate max-w-[130px] font-mono">
              {cleanEmail}
            </span>
          )}
        </div>

        {/* Mobile / Compact Badge when info text is hidden */}
        <div className="md:hidden flex items-center">
          {isOwner ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
              OWNER
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
              PLAN GRATIS
            </span>
          )}
        </div>

        {/* Chevron icon */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : 'group-hover:text-white'
          }`}
        />
      </button>

      {/* Dropdown Floating Menu (MI CUENTA, VER PLANES, CERRAR SESIÓN) */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0b0e17] border border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
        >
          {/* User Summary Header inside Dropdown */}
          <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/50 flex items-center gap-3">
            {photoURL ? (
              <img
                src={photoURL}
                alt={cleanDisplayName}
                className="w-10 h-10 rounded-xl object-cover border border-amber-400/50 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate font-sans-editorial">
                {cleanDisplayName}
              </div>
              <div className="text-[10px] text-zinc-400 truncate font-mono">
                {cleanEmail}
              </div>
              <div className="mt-1">
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-amber-400/15 text-amber-300 border border-amber-400/40">
                    <Crown className="w-2.5 h-2.5 text-amber-400" />
                    OWNER
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                    <ShieldCheck className="w-2.5 h-2.5 text-zinc-400" />
                    PLAN GRATIS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Menu Items strictly according to specification */}
          <div className="p-1.5 space-y-0.5">
            {/* 1. MI CUENTA */}
            <button
              type="button"
              role="menuitem"
              onClick={handleOpenMyAccount}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span>MI CUENTA</span>
            </button>

            {/* 2. VER PLANES */}
            <button
              type="button"
              role="menuitem"
              onClick={handleViewPlans}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer text-left"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>VER PLANES</span>
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-zinc-800/80" />

            {/* 3. CERRAR SESIÓN */}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
              <span>CERRAR SESIÓN</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal MI CUENTA */}
      <EvoMyAccountModal
        isOpen={isMyAccountOpen}
        onClose={() => setIsMyAccountOpen(false)}
        onNavigatePlans={onNavigatePlans}
      />
    </div>
  );
};
