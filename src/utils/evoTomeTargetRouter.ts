import type { PublicNavigationTarget } from '../components/public/PublicShell';

export function getTomeNumberFromTarget(
  target: PublicNavigationTarget | null | undefined
): string | null {
  if (!target || target.type !== 'TOME') return null;

  const candidate =
    'tomeNumber' in target && typeof target.tomeNumber === 'string'
      ? target.tomeNumber
      : 'id' in target && typeof (target as { id?: unknown }).id === 'string'
        ? (target as { id: string }).id
        : null;

  if (!candidate) return null;
  const cleaned = candidate.replace(/^tomo-/i, '').trim();
  const parsed = parseInt(cleaned, 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 12) return null;
  return String(parsed).padStart(2, '0');
}

export interface ResolvedTomeTarget {
  kind: 'reader' | 'dossier';
  view?: string;
  dossierId?: string;
  tomeNumber: string;
}

export function resolveTomeViewOrDossier(num: string): ResolvedTomeTarget | null {
  switch (num) {
    case '01':
      return { kind: 'reader', view: 'cover', tomeNumber: '01' };
    case '02':
      return { kind: 'reader', view: 'tomo-02', tomeNumber: '02' };
    case '03':
      return { kind: 'reader', view: 'tomo-03', tomeNumber: '03' };
    case '04':
      return { kind: 'reader', view: 'tomo-04', tomeNumber: '04' };
    case '05':
      return { kind: 'reader', view: 'tomo-05', tomeNumber: '05' };
    case '06':
      return { kind: 'reader', view: 'tomo-06', tomeNumber: '06' };
    case '07':
      return { kind: 'reader', view: 'tomo-07', tomeNumber: '07' };
    case '08':
      return { kind: 'reader', view: 'tomo-08', tomeNumber: '08' };
    case '09':
      return { kind: 'reader', view: 'tomo-09', tomeNumber: '09' };
    case '10':
      return { kind: 'reader', view: 'tomo-10', tomeNumber: '10' };
    case '11':
      return { kind: 'reader', view: 'tomo-11', tomeNumber: '11' };
    case '12':
      return { kind: 'reader', view: 'tomo-12', tomeNumber: '12' };
    default:
      return null;
  }
}
