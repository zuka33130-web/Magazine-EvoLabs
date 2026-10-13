/**
 * EVO LABS — Canonical Pricing Source of Truth
 * Centralized pricing model for plans, tomos, and lifetime access.
 */

export interface EvoPriceItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  purchaseType: 'TOMO' | 'PACK' | 'PLAN_FULL' | 'LIFETIME';
  duration: string;
  selectionRule: { type: 'TOMES'; exact: number } | null;
  entitlementType: string;
  includedFeatures: string[];
  excludedFeatures: string[];
  description: string;
  isPopular?: boolean;
}

export const EVO_PRICING: Record<string, EvoPriceItem> = {
  singleTomo: {
    id: 'single-tomo',
    name: 'Tomo Individual',
    price: 19.90,
    currency: 'USD',
    purchaseType: 'TOMO' as const,
    duration: 'Acceso Permanente',
    selectionRule: null,
    entitlementType: 'TOMO',
    includedFeatures: [
      '1 Tomo digital completo a elección',
      'Laboratorios de silicio y software asociados',
      'Acceso pericial permanente'
    ],
    excludedFeatures: [
      'Acceso a los demás tomos del catálogo',
      'Actualizaciones futuras de otros tomos'
    ],
    description: 'Adquisición de un tomo técnico individual con su respectiva revista y labs.',
  },
  tomoPack3: {
    id: 'tomo-pack-3',
    name: 'Pack 3 Tomos',
    price: 39.90,
    currency: 'USD',
    purchaseType: 'PACK' as const,
    duration: 'Acceso Permanente',
    selectionRule: { type: 'TOMES' as const, exact: 3 },
    entitlementType: 'TOMO_PACK',
    includedFeatures: [
      'Elegí exactamente 3 Tomos canónicos a medida',
      'Laboratorios y simuladores de los 3 tomos',
      'Acceso pericial permanente'
    ],
    excludedFeatures: [
      'Acceso a los 12 tomos completos',
      'Soporte técnico dedicado 1on1'
    ],
    description: 'Elegí 3 tomos canónicos para armar tu propia ruta formativa personalizada.',
    isPopular: true,
  },
  tomoPack5: {
    id: 'tomo-pack-5',
    name: 'Pack 5 Tomos',
    price: 59.90,
    currency: 'USD',
    purchaseType: 'PACK' as const,
    duration: 'Acceso Permanente',
    selectionRule: { type: 'TOMES' as const, exact: 5 },
    entitlementType: 'TOMO_PACK',
    includedFeatures: [
      'Elegí exactamente 5 Tomos canónicos a medida',
      'Laboratorios y simuladores de los 5 tomos',
      'Acceso pericial permanente'
    ],
    excludedFeatures: [
      'Acceso a los 12 tomos completos'
    ],
    description: 'Lotes agrupados de 5 tomos especializados con mayor bonificación.',
  },
  complete1Month: {
    id: 'complete-1m',
    name: 'Complete 1 Mes',
    price: 9.90,
    currency: 'USD',
    purchaseType: 'PLAN_FULL' as const,
    duration: '1 Mes',
    selectionRule: null,
    entitlementType: 'PLAN_FULL',
    includedFeatures: [
      'Acceso completo a los 12 Tomos publicados',
      'Todos los laboratorios y herramientas',
      'Actualizaciones mensuales'
    ],
    excludedFeatures: [
      'Acceso vitalicio permanente'
    ],
    description: 'Acceso completo a todos los tomos publicados, laboratorios y herramientas por 1 mes.',
  },
  complete3Months: {
    id: 'complete-3m',
    name: 'Complete 3 Meses',
    price: 24.90,
    currency: 'USD',
    purchaseType: 'PLAN_FULL' as const,
    duration: '3 Meses',
    selectionRule: null,
    entitlementType: 'PLAN_FULL',
    includedFeatures: [
      'Acceso completo a los 12 Tomos publicados',
      'Todos los laboratorios y herramientas',
      'Optimizado para formación continua'
    ],
    excludedFeatures: [
      'Acceso vitalicio permanente'
    ],
    description: 'Acceso completo optimizado para formación técnica continua por 3 meses.',
  },
  complete6Months: {
    id: 'complete-6m',
    name: 'Complete 6 Meses',
    price: 44.90,
    currency: 'USD',
    purchaseType: 'PLAN_FULL' as const,
    duration: '6 Meses',
    selectionRule: null,
    entitlementType: 'PLAN_FULL',
    includedFeatures: [
      'Acceso completo a los 12 Tomos',
      'Laboratorios ilimitados',
      'Tarifa preferencial semestral'
    ],
    excludedFeatures: [
      'Acceso vitalicio'
    ],
    description: 'Acceso completo con tarifa preferencial por 6 meses.',
  },
  complete12Months: {
    id: 'complete-12m',
    name: 'Complete 12 Meses',
    price: 79.90,
    currency: 'USD',
    purchaseType: 'PLAN_FULL' as const,
    duration: '12 Meses',
    selectionRule: null,
    entitlementType: 'PLAN_FULL',
    includedFeatures: [
      'Acceso completo a todo el ecosistema EVO LABS',
      'Todos los tomos y laboratorios presentes y futuros',
      'Máxima bonificación anual'
    ],
    excludedFeatures: [],
    description: 'Acceso completo por 1 año con máxima bonificación.',
    isPopular: true,
  },
  lifetime: {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: 179.90,
    currency: 'USD',
    purchaseType: 'LIFETIME' as const,
    duration: 'Vitalicio',
    selectionRule: null,
    entitlementType: 'LIFETIME',
    includedFeatures: [
      'Acceso de por vida a todo el ecosistema actual y futuro',
      'Todos los tomos, laboratorios y herramientas',
      'Prioridad en nuevas ediciones y hardware labs'
    ],
    excludedFeatures: [],
    description: 'Acceso de por vida a todo el ecosistema actual y futuro de EVO LABS.',
  },
};

export function getPricingPlans(): EvoPriceItem[] {
  return [
    EVO_PRICING.singleTomo,
    EVO_PRICING.tomoPack3,
    EVO_PRICING.tomoPack5,
    EVO_PRICING.complete1Month,
    EVO_PRICING.complete3Months,
    EVO_PRICING.complete6Months,
    EVO_PRICING.complete12Months,
    EVO_PRICING.lifetime,
  ];
}

