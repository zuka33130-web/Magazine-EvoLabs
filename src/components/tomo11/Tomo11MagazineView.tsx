import React from 'react';
import { Tomo11MasterPage } from './Tomo11MasterPage';

interface Tomo11MagazineViewProps {
  onBack?: () => void;
}

export const Tomo11MagazineView: React.FC<Tomo11MagazineViewProps> = ({ onBack }) => {
  return <Tomo11MasterPage onBack={onBack} />;
};
