import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page35Chapter06Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-35"
      pageNumber={35}
      totalPages={41}
      sectionTitle="CAPÍTULO 06"
      subSlug="METODOLOGÍA FORENSE // DIAGNÓSTICO CIENTÍFICO"
      accentColor="#10B981"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 06"
        categoryTag="DIAGNÓSTICO PERICIAL // EL MÉTODO DEDUCTIVO"
        title="El Método Deductivo"
        subtitle="CÓMO ENCONTRAR LA CAUSA RAÍZ ANTES DE TOCAR UN DESTORNILLADOR"
        leadParagraph="Cuando una computadora falla, la reacción instintiva del usuario promedio es el pánico o el reemplazo aleatorio de piezas: formatear el sistema operativo, cambiar la pasta térmica sin medirla o comprar una fuente nueva 'por las dudas'. En el laboratorio EVO aplicamos un principio estrictamente opuesto: el silicio y el sistema operativo dejan un rastro pericial imborrable en cada anomalía. Nuestra tarea no es adivinar, sino recolectar evidencia y descartar variables."
        keyQuestion="¿Por qué el 80% de los gastos en reparaciones son completamente innecesarios si la máquina ya registró la causa exacta en sus volcados de memoria?"
        imageSrc="/src/assets/images/cap_06_workshop_1789531894578.jpg"
        imageCaption="FIG 6.0 // Banco de diagnóstico metrológico EVO. Osciloscopio y multímetro digital midiendo el riel de +12V bajo carga transitoria."
        accentColor="#10B981"
        metricsPreview={[
          { label: 'REGLA DE ORO', value: '1 VARIABLE A LA VEZ' },
          { label: 'HERRAMIENTA', value: 'WHOCRASHED / DUMP' },
        ]}
      />
    </MagazineMasterPage>
  );
};
