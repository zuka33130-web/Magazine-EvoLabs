/**
 * EVO LABS — Helper Central de Progreso del Tomo 01
 * 
 * Centraliza la verdad sobre el estado de completitud de los capítulos del Tomo 01,
 * la aprobación del examen oficial y la certificación global del Tomo 01.
 */

export const REQUIRED_C01_SECTIONS = [
  'cpu',
  'ram',
  'gpu',
  'storage',
  'motherboard',
  'windows',
  'peripherals',
  'tu-pc',
] as const;

export type RequiredC01Section = typeof REQUIRED_C01_SECTIONS[number];

/**
 * Verifica si el Capítulo 01 está COMPLETAMENTE terminado.
 * Regla: Requiere que las 8 secciones ('cpu', 'ram', 'gpu', 'storage', 'motherboard', 'windows', 'peripherals', 'tu-pc')
 * estén registradas en el array JSON 'evo_c01_completed'.
 * 
 * Tener solo 'evo_c01_specs' o una lista parcial NO significa capítulo completado.
 */
export function isChapter01Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem('evo_c01_completed');
    if (!raw) return false;

    // Compatibilidad histórica: si fue guardado como booleano "true"
    if (raw === 'true') return true;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const sectionSet = new Set(parsed);
      return REQUIRED_C01_SECTIONS.every((sec) => sectionSet.has(sec));
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Verifica si el Capítulo 02 está completado.
 */
export function isChapter02Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('evo_c02_status') === 'completed';
  } catch {
    return false;
  }
}

/**
 * Verifica si el Capítulo 03 está completado.
 */
export function isChapter03Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('evo_c03_status') === 'completed';
  } catch {
    return false;
  }
}

/**
 * Verifica si el Capítulo 04 está completado.
 */
export function isChapter04Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('evo_c04_status') === 'completed';
  } catch {
    return false;
  }
}

/**
 * Verifica si el Capítulo 05 está completado.
 */
export function isChapter05Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('evo_c05_status') === 'completed';
  } catch {
    return false;
  }
}

/**
 * Verifica si el Capítulo 06 está completado.
 */
export function isChapter06Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('evo_c06_status') === 'completed') {
      return true;
    }
    const rawCases = localStorage.getItem('evo_c06_cases');
    if (rawCases) {
      const parsed = JSON.parse(rawCases);
      if (
        Array.isArray(parsed) &&
        parsed.some((c: any) => c && c.completed === true && c.status !== 'INVESTIGANDO')
      ) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Verifica si el Capítulo 07 está completado.
 */
export function isChapter07Complete(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      localStorage.getItem('evo_c07_status') === 'completed' ||
      Boolean(localStorage.getItem('evo_c07_report')) ||
      localStorage.getItem('evo_tome01_status') === 'completed'
    );
  } catch {
    return false;
  }
}

/**
 * Verifica si todos los 7 capítulos (01 al 07) están completados.
 */
export function areAllTomo01ChaptersComplete(): boolean {
  return (
    isChapter01Complete() &&
    isChapter02Complete() &&
    isChapter03Complete() &&
    isChapter04Complete() &&
    isChapter05Complete() &&
    isChapter06Complete() &&
    isChapter07Complete()
  );
}

/**
 * Retorna la cantidad de capítulos completados (0 a 7).
 */
export function getTomo01CompletedCount(): number {
  let count = 0;
  if (isChapter01Complete()) count++;
  if (isChapter02Complete()) count++;
  if (isChapter03Complete()) count++;
  if (isChapter04Complete()) count++;
  if (isChapter05Complete()) count++;
  if (isChapter06Complete()) count++;
  if (isChapter07Complete()) count++;
  return count;
}

/**
 * Verifica si el examen final del Tomo 01 fue aprobado utilizando la lógica
 * real del motor de examen ('evo_labs_tomo_theory_verified_tomo-01' o 'evo_theory_verified_01').
 * También mantiene compatibilidad con 'evo_tomo01_completed'.
 */
export function isTomo01ExamPassed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      localStorage.getItem('evo_labs_tomo_theory_verified_tomo-01') === 'true' ||
      localStorage.getItem('evo_theory_verified_01') === 'true' ||
      localStorage.getItem('evo_tomo01_completed') === 'true'
    );
  } catch {
    return false;
  }
}

/**
 * Verifica si el Tomo 01 completo está terminado con éxito:
 * Requiere que los 7 capítulos estén completados Y que el Examen Final esté aprobado.
 */
export function isTomo01Complete(): boolean {
  return areAllTomo01ChaptersComplete() && isTomo01ExamPassed();
}
