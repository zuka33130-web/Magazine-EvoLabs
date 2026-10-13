import React from 'react';
import { Page07Index } from './Page07Index';

export const Page03Index: React.FC<{ onSelectPage?: (pageIndex: number) => void }> = ({ onSelectPage }) => {
  return <Page07Index onSelectPage={onSelectPage} />;
};
