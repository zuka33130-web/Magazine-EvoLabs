/**
 * EVO LABS — Data Provenance & Epistemic Standard
 * 
 * Regla Canónica del Método EVO ("NO LO CREAS. COMPROBALO."):
 * - SYSTEM_REPORTED: información comunicada por el sistema/OS o navegador.
 * - MEASURED (MEDIDO): medición obtenida realmente mediante una fuente física o sensor real.
 * - CALCULATED (CALCULADO): resultado obtenido mediante una fórmula matemática explícita.
 * - ESTIMATED (ESTIMADO): estimación basada en supuestos declarados.
 * - SIMULATED (SIMULADO): resultado generado por un modelo numérico o simulación.
 * - UNKNOWN (DESCONOCIDO): procedencia no verificada (nunca se inventa).
 * - USER_ENTERED: datos ingresados manualmente por el usuario (no es medición).
 */

export type DetailedProvenance =
  | 'SYSTEM_REPORTED'
  | 'MEASURED'
  | 'CALCULATED'
  | 'ESTIMATED'
  | 'SIMULATED'
  | 'UNKNOWN'
  | 'USER_ENTERED';

export type MetricProvenance = 'MEDIDO' | 'CALCULADO' | 'SIMULADO' | 'DESCONOCIDO';

export interface ProvenanceMetadata {
  type: MetricProvenance;
  detailedType: DetailedProvenance;
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
    description: 'Dato capturado directamente por sensor de hardware, API de sistema o instrumental físico real.',
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
 * Normaliza cualquier procedencia (incluidas detalladas y legacy) a la categoría canónica.
 */
export function normalizeProvenance(legacyProvenance?: string): MetricProvenance {
  if (!legacyProvenance) return 'DESCONOCIDO';
  const upper = legacyProvenance.toUpperCase();

  if (
    upper === 'MEDIDO' ||
    upper === 'MEASURED' ||
    upper === 'SYSTEM_REPORTED' ||
    upper === 'BROWSER_REPORTED' ||
    upper === 'DETECTED'
  ) {
    return 'MEDIDO';
  }

  if (upper === 'CALCULADO' || upper === 'CALCULATED' || upper === 'DERIVED' || upper === 'CALIBRATED') {
    return 'CALCULADO';
  }

  if (
    upper === 'SIMULADO' ||
    upper === 'SIMULATED' ||
    upper === 'ESTIMATED' ||
    upper === 'ESTIMADO' ||
    upper === 'USER_ENTERED' ||
    upper === 'AI_DISCOVERED'
  ) {
    return 'SIMULADO';
  }

  return 'DESCONOCIDO';
}

/**
 * Mapea una procedencia detallada a su tipo canónico y descripción pericial.
 */
export function getDetailedProvenanceInfo(detailed: DetailedProvenance): ProvenanceMetadata {
  const type = normalizeProvenance(detailed);
  const baseDef = PROVENANCE_DEFINITIONS[type];

  const descriptions: Record<DetailedProvenance, string> = {
    SYSTEM_REPORTED: 'Dato comunicado por la API del sistema operativo o navegador.',
    MEASURED: 'Medición física capturada por sensor de hardware o multímetro en tiempo real.',
    CALCULATED: 'Resultado derivado matemáticamente a partir de fórmulas físicas verificables.',
    ESTIMATED: 'Estimación basada en modelos teóricos con supuestos declarados.',
    SIMULATED: 'Resultado generado por el motor de simulación numérica de EVO LABS.',
    USER_ENTERED: 'Dato introducido manualmente por el usuario. No constituye medición física.',
    UNKNOWN: 'Procedencia de datos no verificada.',
  };

  return {
    type,
    detailedType: detailed,
    label: baseDef.label,
    shortDesc: descriptions[detailed] || baseDef.description,
  };
}

