import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page11Chapter02Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-11"
      pageNumber={11}
      totalPages={41}
      sectionTitle="CAPÍTULO 02"
      subSlug="INTERCONEXIÓN // SISTEMA INTEGRADO"
      accentColor="#F59E0B"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 02"
        categoryTag="DINÁMICA DE SISTEMA // FLUJO DE BUSES"
        title="Cómo Trabajan Juntos"
        subtitle="CPU + RAM + GPU + BUSES EN SINCRONÍA ELECTROMAGNÉTICA"
        leadParagraph="Un computador no es una colección estática de componentes aislados atornillados a un chasis; es una coreografía electromagnética de alta velocidad donde ninguna pieza puede actuar en solitario. Cuando hacés un clic en un videojuego o renderizás un fotograma, el disco NVMe transfiere los datos al CPU por el bus PCIe, el CPU los aloja en la RAM, la memoria los entrega a la GPU por las líneas de video, y la GPU los procesa en sus núcleos de sombreado."
        keyQuestion="Si cualquiera de esas autopistas intermedias tiene un bache, ¿por qué el procesador más veloz del planeta se ve forzado a esperar en ciclos ociosos?"
        imageSrc="/src/assets/images/cap_02_interconnect_1789531847526.jpg"
        imageCaption="FIG 2.0 // Macrografía de pistas de interconexión diferencial de alta velocidad entre el socket y las ranuras DIMM."
        accentColor="#F59E0B"
        metricsPreview={[
          { label: 'VELOCIDAD L1', value: '1.0 NANOSEGUNDO' },
          { label: 'TIEMPO NVMe', value: '20.000 NANOSEGUNDOS' },
        ]}
      />
    </MagazineMasterPage>
  );
};
