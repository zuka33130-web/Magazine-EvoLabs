/**
 * EVO LABS — Data Provenance & Epistemic Standard
 * 
 * Regla Canónica del Método EVO ("NO LO CREAS. COMPROBALO."):
 * 
 * CATEGORÍA A (DATO VERIFICADO):
 * Información respaldada por documentación técnica oficial, especificaciones del fabricante
 * o mediciones reproducibles mediante instrumental o sensores reales.
 * 
 * CATEGORÍA B (EJEMPLO DIDÁCTICO / SIMULACIÓN):
 * Datos modelados exclusivamente para enseñar un cálculo o procedimiento, identificados
 * expresamente como simulados. Ningún laboratorio debe presentar un ejemplo didáctico como real.
 * 
 * CATEGORÍA C (DATO VARIABLE):
 * Valores que dependen de la topología concreta del hardware, firmware, versión del SO,
 * controladores o condiciones ambientales del ensayo.
 */

export type EpistemologicalCategory = 'CATEGORIA_A' | 'CATEGORIA_B' | 'CATEGORIA_C';

export interface EpistemologicalCategoryDef {
  code: EpistemologicalCategory;
  shortTag: 'CAT A' | 'CAT B' | 'CAT C';
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
}

export const EPISTEMOLOGICAL_CATEGORIES: Record<EpistemologicalCategory, EpistemologicalCategoryDef> = {
  CATEGORIA_A: {
    code: 'CATEGORIA_A',
    shortTag: 'CAT A',
    title: 'CATEGORÍA A // DATO VERIFICADO',
    subtitle: 'DOCUMENTACIÓN OFICIAL & SENSORES REALES',
    description: 'Información respaldada por hojas de datos técnicas oficiales, especificaciones JEDEC/ATX/PCIe o mediciones físicas reproducibles en silicio.',
    color: '#10B981', // Emerald 500
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    textColor: '#34D399',
    iconName: 'ShieldCheck',
  },
  CATEGORIA_B: {
    code: 'CATEGORIA_B',
    shortTag: 'CAT B',
    title: 'CATEGORÍA B // EJEMPLO DIDÁCTICO',
    subtitle: 'MODELO NUMÉRICO / ENSAYO SIMULADO',
    description: 'Valores modelados exclusivamente para ilustrar un cálculo o procedimiento metódico. Expresamente etiquetado como simulación didáctica.',
    color: '#F59E0B', // Amber 500
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    textColor: '#FBBF24',
    iconName: 'Layers',
  },
  CATEGORIA_C: {
    code: 'CATEGORIA_C',
    shortTag: 'CAT C',
    title: 'CATEGORÍA C // DATO VARIABLE',
    subtitle: 'DEPENDIENTE DEL ENTORNO & HARDWARE',
    description: 'Valores no universales que varían según la topología concreta de la motherboard, versión de microcódigo/BIOS, controladores o temperatura ambiente.',
    color: '#06B6D4', // Cyan 500
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    textColor: '#22D3EE',
    iconName: 'Sliders',
  },
};

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
  epistemicCategory: EpistemologicalCategory;
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
    epistemicCategory: EpistemologicalCategory;
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
    epistemicCategory: 'CATEGORIA_A',
    label: 'MEDIDO EN SILICIO (CAT A)',
    description: 'Dato capturado directamente por sensor de hardware, API de sistema o instrumental físico real.',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    textColor: '#34D399',
    icon: 'Activity',
  },
  CALCULADO: {
    code: 'CALCULADO',
    epistemicCategory: 'CATEGORIA_A',
    label: 'CÁLCULO MATEMÁTICO (CAT A)',
    description: 'Resultado derivado mediante una fórmula física o aritmética comprobable sin adivinación.',
    color: '#06B6D4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    textColor: '#22D3EE',
    icon: 'Cpu',
  },
  SIMULADO: {
    code: 'SIMULADO',
    epistemicCategory: 'CATEGORIA_B',
    label: 'MODELO SIMULADO (CAT B)',
    description: 'Resultado basado en modelo de transferencia con parámetros de referencia y supuestos declarados.',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    textColor: '#FBBF24',
    icon: 'Layers',
  },
  DESCONOCIDO: {
    code: 'DESCONOCIDO',
    epistemicCategory: 'CATEGORIA_C',
    label: 'VARIABLE / ENTORNO (CAT C)',
    description: 'Valor condicionado a la configuración de prueba. EVO LABS prohíbe inventar o falsificar mediciones.',
    color: '#64748B',
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
    upper === 'DETECTED' ||
    upper === 'CATEGORIA_A'
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
    upper === 'AI_DISCOVERED' ||
    upper === 'CATEGORIA_B'
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
    epistemicCategory: baseDef.epistemicCategory,
    detailedType: detailed,
    label: baseDef.label,
    shortDesc: descriptions[detailed] || baseDef.description,
  };
}

