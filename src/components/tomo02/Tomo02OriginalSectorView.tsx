import React from 'react';

type OriginalSectorProps = { onBackToMagazine: () => void; initialInvCode?: string } &
  Partial<Record<`onOpenSector${string}`, () => void>>;

const sectors: Record<string, React.ComponentType<OriginalSectorProps>> = {
  '11': React.lazy(() => import('./sector11/Tomo02Sector11View').then(m => ({ default: m.Tomo02Sector11View }))),
  '12': React.lazy(() => import('./sector12/Tomo02Sector12View').then(m => ({ default: m.Tomo02Sector12View }))),
  '13': React.lazy(() => import('./sector13/Tomo02Sector13View').then(m => ({ default: m.Tomo02Sector13View }))),
  '14': React.lazy(() => import('./sector14/Tomo02Sector14View').then(m => ({ default: m.Tomo02Sector14View }))),
  '15': React.lazy(() => import('./sector15/Tomo02Sector15View').then(m => ({ default: m.Tomo02Sector15View }))),
  '16': React.lazy(() => import('./sector16/Tomo02Sector16View').then(m => ({ default: m.Tomo02Sector16View }))),
  '17': React.lazy(() => import('./sector17/Tomo02Sector17View').then(m => ({ default: m.Tomo02Sector17View }))),
  '18': React.lazy(() => import('./sector18/Tomo02Sector18View').then(m => ({ default: m.Tomo02Sector18View }))),
  '19': React.lazy(() => import('./sector19/Tomo02Sector19View').then(m => ({ default: m.Tomo02Sector19View }))),
  '20': React.lazy(() => import('./sector20/Tomo02Sector20View').then(m => ({ default: m.Tomo02Sector20View }))),
  '21': React.lazy(() => import('./sector21/Tomo02Sector21View').then(m => ({ default: m.Tomo02Sector21View }))),
  '22': React.lazy(() => import('./sector22/Tomo02Sector22View').then(m => ({ default: m.Tomo02Sector22View }))),
  '23': React.lazy(() => import('./sector23/Tomo02Sector23View').then(m => ({ default: m.Tomo02Sector23View }))),
  '24': React.lazy(() => import('./sector24/Tomo02Sector24View').then(m => ({ default: m.Tomo02Sector24View }))),
  '25': React.lazy(() => import('./sector25/Tomo02Sector25View').then(m => ({ default: m.Tomo02Sector25View }))),
  '26': React.lazy(() => import('./sector26/Tomo02Sector26View').then(m => ({ default: m.Tomo02Sector26View }))),
  '27': React.lazy(() => import('./sector27/Tomo02Sector27View').then(m => ({ default: m.Tomo02Sector27View }))),
  '28': React.lazy(() => import('./sector28/Tomo02Sector28View').then(m => ({ default: m.Tomo02Sector28View }))),
  '29': React.lazy(() => import('./sector29/Tomo02Sector29View').then(m => ({ default: m.Tomo02Sector29View }))),
  '30': React.lazy(() => import('./sector30/Tomo02Sector30View').then(m => ({ default: m.Tomo02Sector30View }))),
  '31': React.lazy(() => import('./sector31/Tomo02Sector31View').then(m => ({ default: m.Tomo02Sector31View }))),
  '32': React.lazy(() => import('./sector32/Tomo02Sector32View').then(m => ({ default: m.Tomo02Sector32View }))),
  '33': React.lazy(() => import('./sector33/Tomo02Sector33View').then(m => ({ default: m.Tomo02Sector33View }))),
  '34': React.lazy(() => import('./sector34/Tomo02Sector34View').then(m => ({ default: m.Tomo02Sector34View }))),
  '35': React.lazy(() => import('./sector35/Tomo02Sector35View').then(m => ({ default: m.Tomo02Sector35View }))),
  '36': React.lazy(() => import('./sector36/Tomo02Sector36View').then(m => ({ default: m.Tomo02Sector36View }))),
  '37': React.lazy(() => import('./sector37/Tomo02Sector37View').then(m => ({ default: m.Tomo02Sector37View }))),
  '38': React.lazy(() => import('./sector38/Tomo02Sector38View').then(m => ({ default: m.Tomo02Sector38View }))),
  '39': React.lazy(() => import('./sector39/Tomo02Sector39View').then(m => ({ default: m.Tomo02Sector39View }))),
};

export const ORIGINAL_SECTOR_NUMBERS = Object.keys(sectors);

interface Props {
  number: string;
  onBack: () => void;
  onNavigate: (number: string) => void;
  onOpenAdvanced: (number: string) => void;
}

/** Adapter only: original sector content and its state remain untouched. */
export const Tomo02OriginalSectorView: React.FC<Props> = ({ number, onBack, onNavigate, onOpenAdvanced }) => {
  const Sector = sectors[number];
  if (!Sector) return null;
  const navigation = Object.fromEntries(Array.from({ length: 40 }, (_, index) => {
    const sector = String(index).padStart(2, '0');
    return [`onOpenSector${sector}`, () => onNavigate(sector)];
  }));
  return <div data-original-sector={number}>
    <nav aria-label="Versiones del sector" className="flex flex-wrap items-center gap-3 p-3 border-b border-sky-500/20 bg-[#080B10]">
      <button type="button" onClick={onBack} className="px-3 py-2 rounded-lg border border-sky-500/20 text-xs text-zinc-300">Volver al índice</button>
      <button type="button" onClick={() => onOpenAdvanced(number)} className="px-3 py-2 rounded-lg border border-sky-500/20 text-xs text-cyan-300">Investigaciones ampliadas del Sector {number}</button>
    </nav>
    <React.Suspense fallback={<p role="status" className="p-8 text-cyan-300">Cargando Sector {number}…</p>}>
      <Sector key={number} onBackToMagazine={onBack} {...navigation} />
    </React.Suspense>
  </div>;
};
