import React from 'react';
import { Tomo06MasterPage } from './Tomo06MasterPage';

interface Tomo06MagazineViewProps {
  onBack?: () => void;
}

export const Tomo06MagazineView: React.FC<Tomo06MagazineViewProps> = ({ onBack }) => {
  return <Tomo06MasterPage onBack={onBack} />;
};
