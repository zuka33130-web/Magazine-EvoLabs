import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page20Chapter05Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-20"
      pageNumber={20}
      totalPages={41}
      sectionTitle="CAPÍTULO 05"
      subSlug="INGENIERÍA DE SISTEMAS // KERNEL & CONTROLADORES"
      accentColor="#3B82F6"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 05"
        categoryTag="ARQUITECTURA DE SOFTWARE BASE // RING 0"
        title="Windows También es Hardware"
        subtitle="EL KERNEL, LOS CONTROLADORES Y LA BATALLA POR LOS ANILLOS DE PRIVILEGIO"
        leadParagraph="Solemos pensar en Windows como una interfaz visual con ventanas, íconos y botones, pero para los transistores del procesador, el sistema operativo no es más que el árbitro más poderoso y demandante que existe. Todo hardware físico depende ciegamente de un archivo de código especial llamado controlador (driver) que opera en el nivel más íntimo del procesador: el Anillo 0 (Ring 0)."
        keyQuestion="¿Por qué un mal driver de red Wi-Fi o de audio de diez líneas de código mal escritas puede paralizar por completo una PC de última generación con una GPU de alta gama?"
        imageSrc="/src/assets/images/cap_05_kernel_1789531884339.jpg"
        imageCaption="FIG 5.0 // Mapeo de llamadas de interrupción ISR/DPC en el kernel de Windows. Un único controlador defectuoso secuestra el bus de ejecución del micro."
        accentColor="#3B82F6"
        metricsPreview={[
          { label: 'NIVEL DE PRIVILEGIO', value: 'RING 0 KERNEL' },
          { label: 'OBJETIVO DPC', value: '< 500 MICROSEGUNDOS' },
        ]}
      />
    </MagazineMasterPage>
  );
};
