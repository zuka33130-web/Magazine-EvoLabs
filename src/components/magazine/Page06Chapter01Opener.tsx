import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page06Chapter01Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-10"
      pageNumber={10}
      totalPages={46}
      sectionTitle="CAPÍTULO 01"
      subSlug="PERITAJE FORENSE // AUDITORÍA DE COMPONENTES"
      accentColor="#EAB308"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 01"
        categoryTag="AUDITORÍA FORENSE // DESMONTE COMERCIAL"
        title="¿Qué PC Tenés Realmente?"
        subtitle="MÁS ALLÁ DEL FOLLETO: SILICIO REAL, STEPPING Y BUSES OCULTOS"
        leadParagraph="La inmensa mayoría de los usuarios cree saber con precisión qué computadora tiene porque leyó la caja del producto o la factura de la tienda: 'Core i7, 16 GB de memoria RAM, placa gráfica de 8 GB'. Sin embargo, en el banco de pruebas de un laboratorio metrológico, esas etiquetas comerciales son meras simplificaciones de marketing que ocultan deliberadamente las variables que determinan la estabilidad, el micro-tartamudeo y la vida útil de tus componentes."
        keyQuestion="¿Por qué dos procesadores con exactamente el mismo nombre comercial pueden tener un comportamiento térmico radicalmente diferente bajo carga continua?"
        imageSrc="/src/assets/images/cap_01_silicon_1789531835511.jpg"
        imageCaption="FIG 1.0 // Micrografía pericial de die de silicio. Interconexiones substrate y pistas de bus a nivel nanométrico."
        accentColor="#EAB308"
        metricsPreview={[
          { label: 'VARIABLES CRÍTICAS', value: '4 SUBSISTEMAS' },
          { label: 'IMPACTO EN RENDIMIENTO', value: 'HASTA -35%' },
        ]}
      />
    </MagazineMasterPage>
  );
};
