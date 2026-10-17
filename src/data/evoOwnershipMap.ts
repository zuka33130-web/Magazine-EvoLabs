import { getPracticeLab } from './evoCatalog';

// EVO LABS // MAPA DE PROPIEDAD CANÓNICA (FASE C)
// Define el dueño único de cada una de las 34 entradas del catálogo.

export type EvoCanonicalSection =
  | 'APRENDER'
  | 'PRACTICAR'
  | 'ANALIZAR MI PC'
  | 'HERRAMIENTAS'
  | 'MI EVO'
  | 'INTERNO';

export interface EvoToolOwnershipEntry {
  id: string;
  owner: EvoCanonicalSection;
  canonicalSurface: string;
  legacyTarget: string;
  legacyAccessPreserved: boolean;
}

export const EVO_CANONICAL_OWNERSHIP_MAP: Record<string, EvoCanonicalSection> = {
  // 1. PRACTICAR (20 entradas: Laboratorios, simuladores y prácticas guiadas)
  'diag-boot-seq': 'PRACTICAR',
  'diag-bsod-decoder': 'PRACTICAR',
  'diag-incident-events': 'PRACTICAR',
  'diag-atx-power-bench': 'PRACTICAR',
  'diag-case-resolver': 'PRACTICAR',
  'med-frametime-analyzer': 'PRACTICAR',
  'med-sensors-telemetry': 'PRACTICAR',
  'med-dpc-latency': 'PRACTICAR',
  'med-thermal-history': 'PRACTICAR',
  'inv-pcb-schematic': 'PRACTICAR',
  'inv-xray-kernel': 'PRACTICAR',
  'inv-cache-imc-flow': 'PRACTICAR',
  'inv-digital-twin': 'PRACTICAR',
  'inv-workstations-sectors': 'PRACTICAR',
  'rep-windows-repair': 'PRACTICAR',
  'rep-windows-install': 'PRACTICAR',
  'rep-hotswap-bench': 'PRACTICAR',
  'opt-nt-services': 'PRACTICAR',
  'opt-ab-comparison': 'PRACTICAR',
  'doc-transfer-challenge': 'PRACTICAR',

  // 2. ANALIZAR MI PC (7 entradas: Diagnóstico real sobre el hardware del usuario)
  'diag-bottleneck-calc': 'ANALIZAR MI PC',
  'diag-autodetect-pc': 'ANALIZAR MI PC',
  'diag-telemetry-integrity': 'ANALIZAR MI PC',
  'med-stress-stability': 'ANALIZAR MI PC',
  'rep-core-repair-view': 'ANALIZAR MI PC',
  'opt-core-optimization': 'ANALIZAR MI PC',
  'opt-upgrade-simulator': 'ANALIZAR MI PC',

  // 3. HERRAMIENTAS (2 entradas: Utilidades independientes)
  'med-latency-calc': 'HERRAMIENTAS',
  'opt-build-architect': 'HERRAMIENTAS',

  // 4. MI EVO (3 entradas: Historial pericial, pasaporte y expedientes)
  'doc-forensic-dossier': 'MI EVO',
  'doc-evidence-passport': 'MI EVO',
  'doc-technical-dossier': 'MI EVO',

  // 5. INTERNO (2 entradas: Herramientas de infraestructura)
  'inv-coverage-matrix': 'INTERNO',
  'doc-content-factory': 'INTERNO',
};

export const EVO_TOOL_TARGET_MAP: Record<string, { canonicalSurface: string; legacyTarget: string }> = {
  'diag-boot-seq': { canonicalSurface: 'Laboratorio de Arranque y POST', legacyTarget: 'boot-lab' },
  'diag-bsod-decoder': { canonicalSurface: 'Matriz de Windows // BSOD', legacyTarget: 'windows-matrix-lab // crash-repair' },
  'diag-incident-events': { canonicalSurface: 'Matriz de Windows // Eventos', legacyTarget: 'windows-matrix-lab // services' },
  'diag-bottleneck-calc': { canonicalSurface: 'EVO Core // Cuello de Botella', legacyTarget: 'lab-core // BOTTLENECK' },
  'diag-autodetect-pc': { canonicalSurface: 'EVO Core // Detección HW', legacyTarget: 'autodetect-modal / diagnosticar' },
  'diag-telemetry-integrity': { canonicalSurface: 'EVO Core // Integridad Live', legacyTarget: 'integrity-modal / diagnosticar' },
  'diag-atx-power-bench': { canonicalSurface: 'EVO Core // Rieles ATX 12V', legacyTarget: 'lab-core // REPAIR' },
  'diag-case-resolver': { canonicalSurface: 'Resolución de Casos Periciales', legacyTarget: 'case-resolver / diagnosticar' },
  'med-latency-calc': { canonicalSurface: 'Herramienta // Latencia RAM', legacyTarget: 'hotswap-lab // hardware' },
  'med-frametime-analyzer': { canonicalSurface: 'Laboratorio Telemetría // Frametimes', legacyTarget: 'hotswap-lab // telemetry' },
  'med-sensors-telemetry': { canonicalSurface: 'Laboratorio Telemetría // Sensores', legacyTarget: 'hotswap-lab // telemetry' },
  'med-dpc-latency': { canonicalSurface: 'Matriz de Windows // DPC/ISR', legacyTarget: 'windows-matrix-lab // services' },
  'med-stress-stability': { canonicalSurface: 'EVO Core // Pruebas de Estrés', legacyTarget: 'lab-core // TEST' },
  'med-thermal-history': { canonicalSurface: 'Laboratorio Telemetría // Térmico', legacyTarget: 'hotswap-lab // telemetry' },
  'inv-pcb-schematic': { canonicalSurface: 'Laboratorio Hardware // PCB VRM', legacyTarget: 'hotswap-lab // hardware' },
  'inv-xray-kernel': { canonicalSurface: 'Matriz de Windows // Scheduler NT', legacyTarget: 'windows-matrix-lab // scheduler' },
  'inv-cache-imc-flow': { canonicalSurface: 'Laboratorio Hardware // Flujo Caché', legacyTarget: 'hotswap-lab // hardware' },
  'inv-digital-twin': { canonicalSurface: 'Gemelo Digital // Silicio', legacyTarget: 'digital-twin / diagnosticar' },
  'inv-workstations-sectors': { canonicalSurface: 'Laboratorio Bench // 8 Sectores', legacyTarget: 'hotswap-lab // all' },
  'inv-coverage-matrix': { canonicalSurface: 'Infraestructura // Matriz Cobertura', legacyTarget: 'coverage-dashboard / lab-core' },
  'rep-windows-repair': { canonicalSurface: 'Matriz de Windows // SFC/DISM', legacyTarget: 'windows-matrix-lab // repair' },
  'rep-windows-install': { canonicalSurface: 'Matriz de Windows // ISO Clean', legacyTarget: 'windows-matrix-lab // install' },
  'rep-hotswap-bench': { canonicalSurface: 'Laboratorio Hot-Swap // Sandbox', legacyTarget: 'hotswap-lab // sandbox' },
  'rep-core-repair-view': { canonicalSurface: 'EVO Core // Reparación Bench', legacyTarget: 'lab-core // REPAIR' },
  'opt-nt-services': { canonicalSurface: 'Matriz de Windows // Servicios NT', legacyTarget: 'windows-matrix-lab // services' },
  'opt-core-optimization': { canonicalSurface: 'EVO Core // Optimización', legacyTarget: 'lab-core // OPTIMIZE' },
  'opt-ab-comparison': { canonicalSurface: 'Laboratorio Bench // Delta A/B', legacyTarget: 'hotswap-lab // sandbox' },
  'opt-upgrade-simulator': { canonicalSurface: 'EVO Core // ROI Upgrade', legacyTarget: 'lab-core // UPGRADE' },
  'opt-build-architect': { canonicalSurface: 'Herramienta // Arquitecto PC', legacyTarget: 'lab-core // BUILD_PC' },
  'doc-forensic-dossier': { canonicalSurface: 'Mi EVO // Informe Pericial', legacyTarget: 'forensic-report / diagnosticar' },
  'doc-evidence-passport': { canonicalSurface: 'Mi EVO // Pasaporte Evidencia', legacyTarget: 'discovery-modal / progreso' },
  'doc-technical-dossier': { canonicalSurface: 'Mi EVO // Dossier Técnico', legacyTarget: 'forensic-report / diagnosticar' },
  'doc-content-factory': { canonicalSurface: 'Infraestructura // Content Factory', legacyTarget: 'content-factory / diagnosticar' },
  'doc-transfer-challenge': { canonicalSurface: 'Laboratorio Guiado // Evaluación', legacyTarget: 'transfer-challenge / diagnosticar' },
};

/**
  * Obtiene el dueño único canónico de un ID de entrada.
  */
export function getToolOwnerSection(toolId: string): EvoCanonicalSection {
  return EVO_CANONICAL_OWNERSHIP_MAP[toolId] || 'PRACTICAR';
}

/**
  * Obtiene la ficha completa de propiedad canónica de una entrada.
  */
export function getToolOwnershipEntry(toolId: string): EvoToolOwnershipEntry {
  const owner = getToolOwnerSection(toolId);
  const targetInfo = EVO_TOOL_TARGET_MAP[toolId] || {
    canonicalSurface: `${owner} // Herramienta`,
    legacyTarget: 'world-map / diagnosticar',
  };

  return {
    id: toolId,
    owner,
    canonicalSurface: targetInfo.canonicalSurface,
    legacyTarget: targetInfo.legacyTarget,
    legacyAccessPreserved: true,
  };
}

/**
  * Lista todas las IDs de entradas pertenecientes a una sección canónica.
  */
export function getToolIdsByOwner(owner: EvoCanonicalSection): string[] {
  return Object.entries(EVO_CANONICAL_OWNERSHIP_MAP)
    .filter(([, section]) => section === owner)
    .map(([id]) => id);
}

/** Lab ownership is derived from the canonical catalog, never from its shared engine. */
export function getLabOwnerTomo(labId: string): string | null | undefined {
  return getPracticeLab(labId)?.tomo;
}
