import React from 'react';
import { Tomo12MasterPage } from './Tomo12MasterPage';

interface Tomo12MagazineViewProps {
  onBack?: () => void;
}

export const Tomo12MagazineView: React.FC<Tomo12MagazineViewProps> = ({ onBack }) => {
  return <Tomo12MasterPage onBack={onBack} />;
};
