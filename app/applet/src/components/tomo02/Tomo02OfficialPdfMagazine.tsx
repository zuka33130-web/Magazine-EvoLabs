import React from 'react';
import { Tomo02Magazine40 } from './Tomo02Magazine40';

interface Tomo02OfficialPdfMagazineProps {
  onBackToCover: () => void;
  onOpenInteractive?: () => void;
  onOpenA4Magazine?: () => void;
  onOpenLab?: () => void;
  initialPage?: number;
}

/**
 * TOMO 02: LA BIBLIA NEGRA DE WINDOWS - UNIFIED PDF MAGAZINE (CREAR DESDE 0)
 * Un solo PDF, un solo índice, un solo desarrollo continuo tipo revista Hack x Crack.
 * Incluye los 50 títulos maestros, manuscritos, investigaciones perisorias y laboratorios de solo lectura.
 */
export const Tomo02OfficialPdfMagazine: React.FC<Tomo02OfficialPdfMagazineProps> = ({
  onBackToCover,
  onOpenBiblia,
}) => {
  return (
    <div className="min-h-screen bg-[#03060B] text-zinc-100 flex flex-col font-sans-editorial">
      <Tomo02Magazine40
        onBack={onBackToCover}
        onOpenBiblia={onOpenBiblia || onBackToCover}
      />
    </div>
  );
};
