import React, { useState, useEffect } from 'react';
import { PublicNavbar, PublicSection } from './PublicNavbar';
import { PublicLanding } from './PublicLanding';
import { EvoPublicAprenderHub } from './EvoPublicAprenderHub';
import { EvoPublicLabsCatalog } from './EvoPublicLabsCatalog';
import { EvoPublicToolsCatalog } from './EvoPublicToolsCatalog';
import { EvoPublicPricing } from './EvoPublicPricing';
import { PublicFooter } from './PublicFooter';
import { EVO_PRICING, EvoPriceItem } from '../../data/evoPricing';
import { EvoPlanConfiguratorModal } from '../commerce/EvoPlanConfiguratorModal';
import { EvoOrderSummaryModal } from '../commerce/EvoOrderSummaryModal';

export type PublicNavigationTarget =
  | { type: 'PRACTICE_LAB'; labId: string }
  | { type: 'APP_HOME' }
  | { type: 'TOME'; tomeNumber: string }
  | { type: 'BOOT_LAB' }
  | { type: 'HOTSWAP'; subPanel?: string }
  | { type: 'WINDOWS_MATRIX'; scenario?: string }
  | { type: 'WINDOWS_XRAY'; scenario?: string }
  | { type: 'LAB_CORE'; phase?: string }
  | { type: 'CAMPUS_ZONE'; zoneId: string }
  | { type: 'TOOL'; toolId: string }
  | { type: 'APP_SECTION'; section: string };

interface PublicShellProps {
  initialSection?: PublicSection;
  onEnterPrivateApp?: (authContext?: string) => void;
  onNavigateTarget?: (target: PublicNavigationTarget) => void;
}

export const PublicShell: React.FC<PublicShellProps> = ({
  initialSection = 'inicio',
  onEnterPrivateApp,
  onNavigateTarget,
}) => {
  const [activeSection, setActiveSection] = useState<PublicSection>(initialSection);
  const [sectionHistory, setSectionHistory] = useState<PublicSection[]>([]);
  const isNavigatingBackRef = React.useRef(false);
  const prevSectionRef = React.useRef<PublicSection>(initialSection);

  // Commerce Modals State
  const [configuratorProduct, setConfiguratorProduct] = useState<EvoPriceItem | null>(null);
  const [summaryProduct, setSummaryProduct] = useState<EvoPriceItem | null>(null);
  const [summaryTomeIds, setSummaryTomeIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialSection && initialSection !== activeSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  useEffect(() => {
    if (isNavigatingBackRef.current) {
      isNavigatingBackRef.current = false;
      prevSectionRef.current = activeSection;
      return;
    }
    if (prevSectionRef.current !== activeSection) {
      setSectionHistory((prev) => [...prev, prevSectionRef.current]);
      prevSectionRef.current = activeSection;
    }
  }, [activeSection]);

  const handleBack = () => {
    if (sectionHistory.length > 0) {
      const nextHistory = [...sectionHistory];
      const previous = nextHistory.pop()!;
      setSectionHistory(nextHistory);
      isNavigatingBackRef.current = true;
      setActiveSection(previous);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      isNavigatingBackRef.current = true;
      setActiveSection('inicio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showBackButton = activeSection !== 'inicio';

  const handleSelectPlan = (planId: string) => {
    const product = Object.values(EVO_PRICING).find((p) => p.id === planId);
    if (!product) return;

    if (product.selectionRule) {
      setConfiguratorProduct(product);
    } else {
      setSummaryProduct(product);
      setSummaryTomeIds([]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] evo-global-ambient-bg text-zinc-100 flex flex-col relative font-sans-editorial select-none">
      {/* Fondo Global Unificado: #07090E con cuadrícula 26x26px estática compartida */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          backgroundColor: '#07090e',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '26px 26px',
        }}
      />
      
      {/* 1. Public Navbar */}
      <PublicNavbar
        activeSection={activeSection}
        showBackButton={showBackButton}
        onBack={handleBack}
        onNavigateSection={(section) => {
          setActiveSection(section);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEnterPrivateApp={() => onEnterPrivateApp?.()}
      />

      {/* 2. Public Content Stage */}
      <main className="relative z-10 flex-1 w-full">
        {activeSection === 'inicio' && (
          <PublicLanding
            onExploreClick={() => setActiveSection('catalogo')}
            onMethodClick={() => setActiveSection('inicio')}
            onOpenAuthPlaceholder={() => onEnterPrivateApp?.()}
            onOpenTomo={(tomeNum) => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: tomeNum });
              }
            }}
          />
        )}
        {activeSection === 'catalogo' && (
          <EvoPublicAprenderHub
            onOpenTomo={(tomeNum) => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: tomeNum });
              }
            }}
            onOpenMagazineTomo01={() => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: '01' });
              }
            }}
            onOpenMagazineTomo02={() => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: '02' });
              }
            }}
            onOpenMagazineTomo03={() => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: '03' });
              }
            }}
            onOpenMagazineTomo04={() => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: '04' });
              }
            }}
            onOpenMagazineTomo08={() => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOME', tomeNumber: '08' });
              }
            }}
          />
        )}
        {activeSection === 'laboratorios' && (
          <EvoPublicLabsCatalog
            onOpenRegisteredLab={(labId) => onNavigateTarget?.({ type: 'PRACTICE_LAB', labId })}
          />
        )}
        {activeSection === 'herramientas' && (
          <EvoPublicToolsCatalog
            onExecuteToolAction={(tool) => {
              if (onNavigateTarget) {
                onNavigateTarget({ type: 'TOOL', toolId: tool.id });
              }
            }}
          />
        )}
        {activeSection === 'planes' && (
          <EvoPublicPricing
            onSelectPlan={handleSelectPlan}
            onSelectTomoOption={() => setActiveSection('catalogo')}
          />
        )}
      </main>

      {/* 3. Public Footer */}
      <PublicFooter />

      {/* 4. Plan Configurator Modal (e.g. Pack 3 Tomos) */}
      {configuratorProduct && (
        <EvoPlanConfiguratorModal
          product={configuratorProduct}
          isOpen={true}
          onClose={() => setConfiguratorProduct(null)}
          onProceedToSummary={(tomeIds) => {
            const prod = configuratorProduct;
            setConfiguratorProduct(null);
            setSummaryProduct(prod);
            setSummaryTomeIds(tomeIds);
          }}
        />
      )}

      {/* 5. Order Summary Modal */}
      {summaryProduct && (
        <EvoOrderSummaryModal
          product={summaryProduct}
          selectedTomeIds={summaryTomeIds}
          isOpen={true}
          onClose={() => setSummaryProduct(null)}
          onChangeSelection={() => {
            const prod = summaryProduct;
            setSummaryProduct(null);
            if (prod.selectionRule) {
              setConfiguratorProduct(prod);
            } else {
              setActiveSection('planes');
            }
          }}
          onRequireAuthToCheckout={(_productId, _tomeIds) => {
            setSummaryProduct(null);
            onEnterPrivateApp?.("Creá tu cuenta o iniciá sesión para continuar con la compra.");
          }}
        />
      )}

    </div>
  );
};
