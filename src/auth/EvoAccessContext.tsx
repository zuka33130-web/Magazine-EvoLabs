/**
 * EVO LABS — Capa Centralizada de Control de Acceso (RBAC / Entitlements)
 * SECURITY 2A.6F: AUTHENTICATED != PREMIUM
 * 
 * Principio rector:
 *   DEFAULT DENY — Sin compra comprobada o suscripción activa en servidor,
 *   un usuario con sesión válida (incluso Google o email verificado) tiene estado FREE.
 * 
 * Reglas de Acceso:
 *   - Tomo 01:
 *       • Capítulos 01 y 02: Acceso libre en modo demostración para usuarios FREE.
 *       • Capítulos 03 a 07 + Examen Final + Certificación: Requiere compra del Tomo 01 o suscripción Complete.
 *   - Tomos 02 al 12:
 *       • Acceso a lectores completos bloqueado para FREE (Requiere Tomo o Plan Complete).
 *       • Ficha / Temario / Dossier curricular: Disponible para consulta técnica.
 *   - Laboratorios:
 *       • Modo guiado básico en Tomo 01 (Estaciones 01 y 02) accesible.
 *       • Laboratorios independientes (Boot Lab, Windows Matrix, HotSwap Lab, Lab Core): Requieren Plan Complete o Tomo asociado adquirido.
 *   - Herramientas:
 *       • Metrología básica (Calculadora de latencia RAM, Calculadora de cuello de botella simplificada): Accesible.
 *       • Herramientas avanzadas (Kernel NT Deep X-Ray, Inyector de fallas, Reparador SFC/DISM, Arquitecto PC completo): Requiere suscripción.
 *   - Analizar Mi PC:
 *       • Lectura y reporte básico del hardware accesible.
 *       • Descarga de telemetría completa y sincronización persistente con bancos de prueba: Requiere cuenta y plan activo.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useEvoAuth } from './EvoAuthProvider';
import { EvoPaywallModal } from '../components/common/EvoPaywallModal';

export type EvoPlanId = 'FREE' | 'COMPLETE_MONTHLY' | 'COMPLETE_QUARTERLY' | 'COMPLETE_ANNUAL' | 'LIFETIME' | 'OWNER';

export interface EvoUserEntitlements {
  plan: EvoPlanId;
  isOwner: boolean;
  hasCompleteAccess: boolean; // true si es plan activo o OWNER
  ownedTomes: string[];        // ['01', '02', ...]
  expiresAt: string | null;
}

export type EvoAccessResource =
  | { type: 'tomo_reader'; tomoNumber: string }
  | { type: 'tomo_chapter'; tomoNumber: string; chapterNumber: string }
  | { type: 'tomo_exam'; tomoNumber: string }
  | { type: 'lab'; labId: string }
  | { type: 'tool'; toolId: string }
  | { type: 'telemetry_download' };

export interface EvoAccessDecision {
  allowed: boolean;
  reason?: string;
  requiredPlan?: string;
  isDemoAllowed?: boolean;
}

export interface EvoAccessContextValue {
  entitlements: EvoUserEntitlements;
  isFreeUser: boolean;
  canAccess: (resource: EvoAccessResource) => EvoAccessDecision;
  requestPlanUpgrade: (featureName?: string) => void;
  // Modal de upgrade o checkout modal
  isUpgradeModalOpen: boolean;
  upgradeTargetName: string | null;
  openUpgradeModal: (targetFeature?: string) => void;
  closeUpgradeModal: () => void;
}

const EvoAccessContext = createContext<EvoAccessContextValue | undefined>(undefined);

export const EvoAccessProvider: React.FC<{
  children: React.ReactNode;
  onNavigateToPlans?: () => void;
}> = ({ children, onNavigateToPlans }) => {
  const { user, emailVerified, isOwner } = useEvoAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState<boolean>(false);
  const [upgradeTargetName, setUpgradeTargetName] = React.useState<string | null>(null);

  // Default Deny: Todo usuario sin comprobante formal en backend es FREE
  // Role OWNER proviene EXCLUSIVAMENTE de Firebase Custom Claims ({ role: 'owner' })
  const entitlements: EvoUserEntitlements = useMemo(() => {
    // Si no hay usuario verificado -> no entitlements
    if (!user || !emailVerified) {
      return {
        plan: 'FREE',
        isOwner: false,
        hasCompleteAccess: false,
        ownedTomes: [],
        expiresAt: null,
      };
    }

    // Comprobación de rol de OWNER proveniente del Firebase Custom Claim verificado
    const isOwnerClaim = Boolean(isOwner);

    return {
      plan: isOwnerClaim ? 'OWNER' : 'FREE',
      isOwner: isOwnerClaim,
      hasCompleteAccess: isOwnerClaim,
      ownedTomes: [],
      expiresAt: null,
    };
  }, [user, emailVerified, isOwner]);

  const isFreeUser = entitlements.plan === 'FREE' && !entitlements.hasCompleteAccess;

  const canAccess = useMemo(() => {
    return (resource: EvoAccessResource): EvoAccessDecision => {
      // 1. Acceso total para OWNER o Plan Complete
      if (entitlements.hasCompleteAccess || entitlements.isOwner) {
        return { allowed: true };
      }

      // 2. DEFAULT DENY evaluado por recurso
      switch (resource.type) {
        case 'tomo_chapter': {
          const tomoNum = resource.tomoNumber.replace(/^tomo-?/i, '').padStart(2, '0');
          // Si compró el tomo específico:
          if (entitlements.ownedTomes.includes(tomoNum)) {
            return { allowed: true };
          }
          // Si es Tomo 01: capítulos 01 y 02 son DEMO FREE (INCLUIDO EN PLAN GRATIS)
          if (tomoNum === '01') {
            const chNum = parseInt(resource.chapterNumber, 10);
            if (chNum === 1 || chNum === 2) {
              return { allowed: true, isDemoAllowed: true };
            }
            return {
              allowed: false,
              reason: 'Los capítulos 03 a 07 del Tomo 01 requieren la adquisición del Tomo o Plan Complete.',
              requiredPlan: 'Tomo 01 o Plan Complete',
            };
          }
          return {
            allowed: false,
            reason: `El Tomo ${tomoNum} requiere adquisición individual o Plan Complete.`,
            requiredPlan: `Tomo ${tomoNum} o Plan Complete`,
          };
        }

        case 'tomo_reader': {
          const tomoNum = resource.tomoNumber.replace(/^tomo-?/i, '').padStart(2, '0');
          if (entitlements.ownedTomes.includes(tomoNum)) {
            return { allowed: true };
          }
          // Para Tomo 01, la portada y el índice son accesibles en demo
          if (tomoNum === '01') {
            return { allowed: true, isDemoAllowed: true };
          }
          return {
            allowed: false,
            reason: `La lectura completa del Tomo ${tomoNum} requiere adquisición o suscripción activa.`,
            requiredPlan: `Tomo ${tomoNum} o Plan Complete`,
          };
        }

        case 'tomo_exam': {
          const tomoNum = resource.tomoNumber.replace(/^tomo-?/i, '').padStart(2, '0');
          if (entitlements.ownedTomes.includes(tomoNum)) {
            return { allowed: true };
          }
          return {
            allowed: false,
            reason: `La certificación y examen oficial del Tomo ${tomoNum} requiere matrícula técnica activa.`,
            requiredPlan: `Tomo ${tomoNum} o Plan Complete`,
          };
        }

        case 'lab': {
          // Labs de investigación técnica avanzada requieren plan
          return {
            allowed: false,
            reason: 'El acceso a bancos de simulación e inyección de fallas en tiempo real requiere Plan Complete.',
            requiredPlan: 'Plan Complete',
          };
        }

        case 'tool': {
          // Herramientas libres de metrología básica
          const freeToolIds = ['med-latency-calc', 'diag-autodetect-pc', 'diag-bottleneck-calc'];
          if (freeToolIds.includes(resource.toolId)) {
            return { allowed: true, isDemoAllowed: true };
          }
          return {
            allowed: false,
            reason: 'Esta herramienta pericial de precisión requiere Plan Complete.',
            requiredPlan: 'Plan Complete',
          };
        }

        case 'telemetry_download': {
          return {
            allowed: false,
            reason: 'La exportación y sincronización de scripts de telemetría requiere membresía activa.',
            requiredPlan: 'Plan Complete',
          };
        }

        default:
          return {
            allowed: false,
            reason: 'Contenido premium restringido a suscriptores.',
            requiredPlan: 'Plan Complete',
          };
      }
    };
  }, [entitlements]);

  const openUpgradeModal = (targetFeature?: string) => {
    setUpgradeTargetName(targetFeature || 'Acceso Premium EVO LABS');
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setUpgradeTargetName(null);
  };

  const requestPlanUpgrade = (featureName?: string) => {
    if (onNavigateToPlans) {
      onNavigateToPlans();
    } else {
      openUpgradeModal(featureName);
    }
  };

  const contextValue: EvoAccessContextValue = {
    entitlements,
    isFreeUser,
    canAccess,
    requestPlanUpgrade,
    isUpgradeModalOpen,
    upgradeTargetName,
    openUpgradeModal,
    closeUpgradeModal,
  };

  return (
    <EvoAccessContext.Provider value={contextValue}>
      {children}
      <EvoPaywallModal
        isOpen={isUpgradeModalOpen}
        onClose={closeUpgradeModal}
        targetTitle={upgradeTargetName}
        onSelectPlan={(_planId) => {
          closeUpgradeModal();
          if (onNavigateToPlans) {
            onNavigateToPlans();
          }
        }}
      />
    </EvoAccessContext.Provider>
  );
};

export function useEvoAccess(): EvoAccessContextValue {
  const context = useContext(EvoAccessContext);
  if (!context) {
    throw new Error('useEvoAccess must be used within an EvoAccessProvider');
  }
  return context;
}
