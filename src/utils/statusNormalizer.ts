// NORMALIZADOR VISUAL DE ESTADOS EVO LABS
// Mapea cualquier estado interno a únicamente 3 labels visibles:
// 1. Disponible
// 2. En desarrollo
// 3. Próximamente

export type VisibleStatus = 'Disponible' | 'En desarrollo' | 'Próximamente';

export function normalizeVisibleStatus(internalStatus: string | boolean | null | undefined): VisibleStatus {
  if (internalStatus === null || internalStatus === undefined) {
    return 'Próximamente';
  }

  if (typeof internalStatus === 'boolean') {
    return internalStatus ? 'Disponible' : 'Próximamente';
  }

  const normalized = String(internalStatus).toUpperCase().trim();

  // 1. DISPONIBLE
  if (
    normalized === 'AVAILABLE' ||
    normalized === 'AVAILABLE_NOW' ||
    normalized === 'ACTIVE' ||
    normalized === 'COMPLETED' ||
    normalized === 'GOLD MASTER' ||
    normalized === 'READY' ||
    normalized === 'FULL_READER' ||
    normalized === 'DISPONIBLE'
  ) {
    return 'Disponible';
  }

  // 2. EN DESARROLLO
  if (
    normalized === 'IN_DEVELOPMENT' ||
    normalized === 'EN DESARROLLO' ||
    normalized === 'EN PROCESO' ||
    normalized === 'WIP' ||
    normalized === 'DOSSIER_ONLY' ||
    normalized === 'IN_PROGRESS'
  ) {
    return 'En desarrollo';
  }

  // 3. PRÓXIMAMENTE (fallback para LOCKED, UNDECIDED, COMING SOON, etc.)
  return 'Próximamente';
}
