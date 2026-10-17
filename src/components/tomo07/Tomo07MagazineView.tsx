import React from 'react';
import { Tomo07MasterPage } from './Tomo07MasterPage';

interface Tomo07MagazineViewProps {
  onBack?: () => void;
}

export const Tomo07MagazineView: React.FC<Tomo07MagazineViewProps> = ({ onBack }) => {
  return <Tomo07MasterPage onBack={onBack} />;
};
