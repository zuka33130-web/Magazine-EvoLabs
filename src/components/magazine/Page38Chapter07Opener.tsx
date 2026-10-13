import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page38Chapter07Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-42"
      pageNumber={42}
      totalPages={46}
      sectionTitle="CAPÍTULO 07"
      subSlug="METROLOGÍA // EL MÉTODO CIENTÍFICO"
      accentColor="#06B6D4"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 07"
        categoryTag="METROLOGÍA EXPERIMENTAL // BANCO DE PRUEBAS"
        title="El Método Científico en tu PC"
        subtitle="ENSAYOS A/B RIGUROSOS: CÓMO MEDIR SIN ENGAÑARTE A TI MISMO"
        leadParagraph="El ser humano es extraordinariamente vulnerable a la sugestión psicológica. Si pasás tres horas configurando un ajuste misterioso o pagaste dinero por un software milagroso, tu cerebro te convencerá de que la computadora 'se siente más rápida y suave'. En el laboratorio EVO no aceptamos sensaciones ni intuiciones: solo aceptamos telemetría medible, repetible y registrada bajo condiciones térmicas controladas."
        keyQuestion="¿Por qué una sola corrida de prueba o benchmark puede engañarte por completo debido a la temperatura basal del encapsulado?"
        imageSrc="/src/assets/images/cap_07_lab_1789531904106.jpg"
        imageCaption="FIG 7.0 // Banco de calibración pericial EVO LABS. Registro continuo de voltaje Vcore y telemetría de bus a 1000 Hz."
        accentColor="#06B6D4"
        metricsPreview={[
          { label: 'CORRIDAS MÍNIMAS', value: '3 REPETICIONES' },
          { label: 'MARGEN DE ERROR', value: '< 1.0% TOLERANCIA' },
        ]}
      />
    </MagazineMasterPage>
  );
};

export default Page38Chapter07Opener;
