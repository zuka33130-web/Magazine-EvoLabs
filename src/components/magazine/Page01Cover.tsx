import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { TOMO_01_COVER } from '../../data/tomoCoversData';

export const Page01Cover: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-01"
      pageNumber={1}
      totalPages={46}
      hideHeaderFooter={true}
      isCover={true}
    >
      <img
        src={TOMO_01_COVER}
        alt="Portada definitiva de EVO LABS — Tomo 01: Conocé tu PC"
        className="w-full h-full object-contain"
      />
    </MagazineMasterPage>
  );
};
