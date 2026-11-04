/**
 * EVO LABS — Data Provenance & Epistemic Standard
 * 
 * Regla Canónica:
 * - MEDIDO: Dato obtenido de un sensor o fuente física real.
 * - CALCULADO: Resultado obtenido mediante una fórmula matemática verificable.
 * - SIMULADO: Resultado de un modelo numérico con supuestos declarados.
 * - DESCONOCIDO: Dato que no se pudo verificar (nunca se inventa).
 * 
 * "NO LO CREAS. COMPROBALO."
 */

export type MetricProvenance = 'MEDIDO' | 'CALCULADO' | 'SIMULADO' | 'DESCONOCIDO';

export interface ProvenanceMetadata {
  type: MetricProvenance;
  label: string;
  shortDesc: string;
  sourceOrFormula?: string;
  assumptions?: string[];
  confidencePct?: number; // 0 - 100
  sensorName?: string;
  measuredAt?: string;
  allowManualOverride?: boolean;
}

export const PROVENANCE_DEFINITIONS: Record<
  MetricProvenance,
  {
    code: MetricProvenance;
    label: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: string;
  }
> = {
  MEDIDO: {
    code: 'MEDIDO',
    label: 'MEDIDO EN SILICIO',
    description: 'Dato capturado directamente por sensor de hardware, API del navegador o telemetría de sistema real.',
    color: '#10B981', // Emerald 500
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    textColor: '#34D399',
    icon: 'Activity',
  },
  CALCULADO: {
    code: 'CALCULADO',
    label: 'CÁLCULO MATEMÁTICO',
    description: 'Resultado derivado mediante una fórmula física o aritmética comprobable sin adivinación.',
    color: '#06B6D4', // Cyan 500
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    textColor: '#22D3EE',
    icon: 'Cpu',
  },
  SIMULADO: {
    code: 'SIMULADO',
    label: 'MODELO SIMULADO',
    description: 'Resultado basado en modelo de transferencia con parámetros de referencia y supuestos declarados.',
    color: '#F59E0B', // Amber 500
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    textColor: '#FBBF24',
    icon: 'Layers',
  },
  DESCONOCIDO: {
    code: 'DESCONOCIDO',
    label: 'NO VERIFICADO',
    description: 'Sin telemetría ni evidencia suficiente. EVO LABS prohíbe inventar o falsificar mediciones.',
    color: '#64748B', // Slate 500
    bgColor: 'rgba(100, 116, 139, 0.12)',
    borderColor: 'rgba(100, 116, 139, 0.4)',
    textColor: '#94A3B8',
    icon: 'HelpCircle',
  },
};

/**
 * Normaliza cualquier procedencia heredada (legacy EpistemicProvenance) a los 4 pilares canónicos.
 */
export function normalizeProvenance(legacyProvenance?: string): MetricProvenance {
  if (!legacyProvenance) return 'DESCONOCIDO';
  const upper = legacyProvenance.toUpperCase();

  if (
    upper === 'MEDIDO' ||
    upper === 'MEASURED' ||
    upper === 'DETECTED' ||
    upper === 'SYSTEM_REPORTED' ||
    upper === 'BROWSER_REPORTED' ||
    upper === 'USER_ENTERED'
  ) {
    return 'MEDIDO';
  }

  if (upper === 'CALCULADO' || upper === 'DERIVED' || upper === 'CALIBRATED') {
    return 'CALCULADO';
  }

  if (upper === 'SIMULADO' || upper === 'SIMULATED' || upper === 'ESTIMATED' || upper === 'AI_DISCOVERED') {
    return 'SIMULADO';
  }

  return 'DESCONOCIDO';
}
