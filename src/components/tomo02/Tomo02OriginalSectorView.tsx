import React, { useEffect } from 'react';
export const ORIGINAL_SECTOR_NUMBERS = Array.from({length:29},(_,index)=>String(index+11));
interface Props { number:string; onBack:()=>void; onNavigate:(number:string)=>void; onOpenAdvanced:(number:string)=>void }
/** Legacy entry point forwards to the single definitive reader. */
export const Tomo02OriginalSectorView:React.FC<Props> = ({number,onOpenAdvanced}) => {
  useEffect(()=>{onOpenAdvanced(number);},[number,onOpenAdvanced]);
  return <p role="status" className="p-8 text-cyan-300">Cargando Sector {number}…</p>;
};
