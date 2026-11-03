import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';
import { MAGAZINE_IMAGES } from '../../data/magazineImages';

export const Page35Chapter06Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-39"
      pageNumber={39}
      totalPages={46}
      sectionTitle="0x06 CASO EVO"
      subSlug="AUTOPSIA DE UN GIGANTE // ESTACIÓN DE $4.000 USD"
      accentColor="#10B981"
    >
      <ChapterHeroOpener
        chapterNumber="0x06 CASO EVO"
        categoryTag="AUTOPSIA DE UN GIGANTE // PERITAJE DE BANCO"
        title="Autopsia de un Gigante"
        subtitle="EL FACTOR HUMANO QUE CASI DESTRUYE UN PROCESADOR EXTREMO"
        leadParagraph="Un análisis exhaustivo del caso más emblemático que pasó por las bancas del laboratorio: una estación de trabajo de $4.000 USD equipada con silicio de máxima categoría que presentaba fallos catastróficos y throttling severo a 100°C bajo carga de renderizado. Tras descartar metódicamente la fuente de poder y el controlador de memoria, la autopsia física reveló el insólito hallazgo: el film plástico protector transparente original aún adherido en la base del bloque AIO con la pasta térmica aplicada encima. Una lección pericial imborrable sobre la prioridad de la inspección física táctil antes de cualquier diagnóstico por software."
        keyQuestion="¿Por qué ningún software de diagnóstico puede advertirte que el disipador tiene un plástico separando el silicio del cobre?"
        imageSrc={MAGAZINE_IMAGES.thermalPlasticPeel}
        imageCaption="CASO FORENSE 0x06 // Base de cobre del bloque de refrigeración líquida retirada en banco: el film plástico de advertencia 'REMOVE PROTECTIVE FILM' permanecía sellado bajo la pasta térmica."
        accentColor="#10B981"
        metricsPreview={[
          { label: 'TEMP PRE-PERITAJE', value: '100°C TJMAX (COLAPSO)' },
          { label: 'TEMP POST-RETIRO', value: '62°C SOSTENIDA' },
        ]}
      />
    </MagazineMasterPage>
  );
};
