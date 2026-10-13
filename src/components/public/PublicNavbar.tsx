import React, { useState } from 'react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { EvoUnifiedHeaderShell } from '../navigation/EvoUnifiedHeaderShell';
import { EvoAuthModal } from '../auth/EvoAuthModal';
import { useEvoAuth } from '../../auth/EvoAuthProvider';
import { EvoUserAccountMenu } from '../auth/EvoUserAccountMenu';

export type PublicSection = 'inicio' | 'catalogo' | 'laboratorios' | 'herramientas' | 'planes';

interface PublicNavbarProps {
  activeSection: PublicSection;
  onNavigateSection: (section: PublicSection) => void;
  onEnterPrivateApp?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  activeSection,
  onNavigateSection,
  onEnterPrivateApp,
  showBackButton = false,
  onBack,
}) => {
  const { user, emailVerified } = useEvoAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuth = () => {
    if (onEnterPrivateApp) {
      onEnterPrivateApp();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const navItems: { id: PublicSection; label: string }[] = [
    { id: 'catalogo', label: 'TOMOS' },
    { id: 'laboratorios', label: 'LABORATORIOS' },
    { id: 'herramientas', label: 'HERRAMIENTAS' },
    { id: 'planes', label: 'PLANES' },
  ];

  const desktopNav = (
    <nav className="flex items-center gap-6 text-xs text-zinc-400 font-bold tracking-wider" aria-label="Navegación pública">
      {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onNavigateSection(item.id)}
          aria-current={activeSection === item.id ? 'page' : undefined}
          className={`transition-colors cursor-pointer py-1 ${
            activeSection === item.id
              ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
              : 'hover:text-white'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  const rightActions = (
    <div className="flex items-center gap-4 font-mono-tech">
      {user && emailVerified ? (
        <>
          {/* Botón IR A MI CAMPUS primero */}
          {onEnterPrivateApp && (
            <button
              type="button"
              onClick={onEnterPrivateApp}
              className="px-3.5 sm:px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_22px_rgba(251,191,36,0.5)] cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IR A MI CAMPUS</span>
              <span className="sm:hidden">CAMPUS</span>
            </button>
          )}
          {/* Bloque de sesión (avatar + nombre + estado) después */}
          <div className="flex items-center ml-1">
            <EvoUserAccountMenu
              onNavigatePlans={() => onNavigateSection('planes')}
              onLogoutSuccess={() => {}}
            />
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={handleOpenAuth}
          className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_22px_rgba(251,191,36,0.5)] cursor-pointer flex items-center gap-1.5"
        >
          <span>ENTRAR</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  const mobileNav = (
    <div className="space-y-3">
      <div className="flex flex-col space-y-1 text-xs font-bold text-zinc-300">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigateSection(item.id)}
            className={`text-left px-3 py-2.5 rounded-lg transition-colors ${
              activeSection === item.id ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30' : 'hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={handleOpenAuth}
          className="w-full py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>ENTRAR A EVO LABS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <EvoUnifiedHeaderShell
        variant="public"
        showBackButton={showBackButton}
        onBackClick={onBack}
        onBrandClick={() => onNavigateSection('inicio')}
        desktopNavItems={desktopNav}
        rightActions={rightActions}
        mobileNavItems={mobileNav}
      />
      {!onEnterPrivateApp && (
        <EvoAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};
