import React from 'react';
import { Tomo09MasterPage } from './Tomo09MasterPage';

interface Tomo09MagazineViewProps {
  onBack?: () => void;
}

export const Tomo09MagazineView: React.FC<Tomo09MagazineViewProps> = ({ onBack }) => {
  return <Tomo09MasterPage onBack={onBack} />;
};
