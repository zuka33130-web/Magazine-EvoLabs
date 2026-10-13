import React from 'react';
import { Tomo05MasterPage } from './Tomo05MasterPage';

interface Tomo05MagazineViewProps {
  onBack?: () => void;
}

export const Tomo05MagazineView: React.FC<Tomo05MagazineViewProps> = ({ onBack }) => {
  return <Tomo05MasterPage onBack={onBack} />;
};
