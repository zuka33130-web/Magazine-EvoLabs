import React from 'react';
import { Tomo10MasterPage } from './Tomo10MasterPage';

interface Tomo10MagazineViewProps {
  onBack?: () => void;
}

export const Tomo10MagazineView: React.FC<Tomo10MagazineViewProps> = ({ onBack }) => {
  return <Tomo10MasterPage onBack={onBack} />;
};
