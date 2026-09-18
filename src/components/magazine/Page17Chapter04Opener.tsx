import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { ChapterHeroOpener } from './ChapterHeroOpener';

export const Page17Chapter04Opener: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-17"
      pageNumber={17}
      totalPages={41}
      sectionTitle="CAPÍTULO 04"
      subSlug="FÍSICA APLICADA // TERMODINÁMICA & ENERGÍA"
      accentColor="#F97316"
    >
      <ChapterHeroOpener
        chapterNumber="CAPÍTULO 04"
        categoryTag="METROLOGÍA TÉRMICA // DISIPACIÓN DE SILICIO"
        title="Encontrá el Límite"
        subtitle="CALOR, ESTRANGULAMIENTO (THROTTLING) Y FLUJO LAMINAR DE AIRE"
        leadParagraph="Toda la energía eléctrica que entra en tu computadora por el cable de la pared se convierte en calor disipado: un equipo que consume 500 Watts es termodinámicamente idéntico a una estufa de 500 Watts encendida en tu habitación. El desafío de ingeniería nunca consiste en evitar que el silicio se caliente, sino en evacuar esos watts a través del bloque de cobre con la menor resistencia térmica posible y sin turbulencias acústicas absurdas."
        keyQuestion="¿Por qué configurar ventiladores para acelerar al 100% ante el menor pico de 65°C genera un infierno de ruido sin enfriar absolutamente nada?"
        imageSrc="/src/assets/images/cap_04_thermal_1789531872467.jpg"
        imageCaption="FIG 4.0 // Termografía infrarroja de fases de alimentación VRM en placa madre sometida a 250W de carga sostenida."
        accentColor="#F97316"
        metricsPreview={[
          { label: 'LÍMITE TJMAX', value: '95°C - 105°C' },
          { label: 'RUIDO EVO', value: '33.6 dBA SILENCIOSO' },
        ]}
      />
    </MagazineMasterPage>
  );
};
