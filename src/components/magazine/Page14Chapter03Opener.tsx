import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page14Chapter03Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-14"
      pageNumber={14}
      totalPages={41}
      sectionTitle="CAPÍTULO 03"
      subSlug="TELEMETRÍA FORENSE // FRAMETIME & CONSISTENCIA"
      accentColor="#EF4444"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 03"
        categoryTag="METROLOGÍA DE FLUIDEZ // LATENCIA DE ENTRADA"
        title="Cuando los FPS Mienten"
        subtitle="LA FALACIA DE LOS PROMEDIOS: FRAMETIME, LATENCIA CLICK-TO-PHOTON Y PERCENTILES"
        leadParagraph="Durante más de dos décadas, la industria de la tecnología y el marketing de placas gráficas educaron a los usuarios para adorar un único número en la esquina de la pantalla: el promedio de FPS. Si el contador dice '144 FPS', el usuario asume que la experiencia es perfecta. Pero en el laboratorio pericial descubrimos a diario sistemas que promedian 160 cuadros por segundo y, sin embargo, se sienten toscos, gomosos y entrecortados al mover el mouse."
        keyQuestion="¿Por qué un sistema a 120 FPS puede sentirse significativamente peor y más lento que uno configurado a 80 FPS estables?"
        imageSrc="/src/assets/images/cap_03_frametime_1789531858625.jpg"
        imageCaption="FIG 3.0 // Registro osciloscópico de varianza de frametime. Los picos verticales representan micro-congelamientos invisibles para el contador de FPS promedio."
        accentColor="#EF4444"
        metricsPreview={[
          { label: 'LATENCIA BASE', value: '44.8 MILISEGUNDOS' },
          { label: 'LATENCIA EVO', value: '18.4 MILISEGUNDOS' },
        ]}
      />
    </MagazineMasterPage>
  );
};
