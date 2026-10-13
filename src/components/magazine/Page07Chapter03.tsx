import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';
import { AntesDespuesCompare } from './AntesDespuesCompare';

export const Page07Chapter03: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-07"
      pageNumber={7}
      totalPages={24}
      sectionTitle="CAPÍTULO 03"
      subSlug="TELEMETRÍA // FRAMETIME & CONSISTENCIA"
      accentColor="#EF4444"
    >
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-red-400 uppercase font-bold">
            CAPÍTULO 03 // TELEMETRÍA FORENSE
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Cuando los FPS Mienten
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          LA FALACIA DE LOS PROMEDIOS
        </span>
      </div>

      {/* Signature EVO LABS Before / After Comparison */}
      <AntesDespuesCompare
        title="EXPERIMENTO EVO // COLA DE RENDERIZADO AL 99% DE GPU"
        subtitle="MEDICIÓN CON NVIDIA LDAT & CAPFRAMEX"
        testCase="Apex Legends / Warzone en monitor de 144 Hz (GPU RTX 4070 / Ryzen 7)"
        beforeLabel="ESTADO ANTERIOR (FPS ILIMITADOS)"
        afterLabel="OPTIMIZACIÓN EVO (CAP 141 FPS + REFLEX)"
        metrics={[
          {
            label: 'Uso de GPU',
            beforeVal: '99% continuo',
            afterVal: '92% holgura',
            delta: '-7%',
            type: 'positive',
          },
          {
            label: 'Latencia periférica (Click-to-Photon)',
            beforeVal: '44.8 ms',
            afterVal: '18.4 ms',
            delta: '-59% tiempo de respuesta',
            type: 'positive',
          },
          {
            label: 'Percentil 1% Low',
            beforeVal: '88 FPS',
            afterVal: '138 FPS',
            delta: '+56% estabilidad',
            type: 'positive',
          },
        ]}
        verdictNote="Al evitar que la GPU sature su búfer interno al 99%, la cola de pre-renderizado del controlador se vacía instantáneamente, bajando la latencia de entrada a menos de la mitad."
      />

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-04) */}
      <InternetDiceEvoMide
        idMito="MITO-04"
        consejoPopular="Desactivá V-Sync, apagá G-Sync/FreeSync y dejá los FPS totalmente ilimitados: tener 240 FPS en un monitor de 144 Hz te da menor latencia."
        fuentePopular="Mito canónico en canales de esports y shooters"
        realidadTecnica="En DirectX 11/12, si la GPU corre al 99-100% sin límite, el driver acumula de 1 a 3 fotogramas en cola para mantener ocupados los núcleos CUDA/Compute Units. Esa acumulación genera un buffer que retiene el input de tu mouse entre 20 y 40 milisegundos. Además, superar la tasa del monitor genera 'screen tearing' (cortes de pantalla) y varianza de fotogramas errática."
        experimento="Comparativa en banco de pruebas: A) FPS desbloqueados (GPU al 99%) vs B) G-Sync activado + V-Sync de panel de control + Cap de FPS a 3 cuadros por debajo del refresco (o NVIDIA Reflex / AMD Anti-Lag)."
        herramientaMedicion="NVIDIA LDAT v2 (Hardware Mouse Sensor) + CapFrameX"
        resultado="mejoro"
        resultadoDetalle="La latencia del clic cae de 44.8 ms a 18.4 ms. El 1% Low sube de 88 a 138 FPS. Fluidez absoluta sin ningún corte de imagen."
        riesgo="Si limitás los FPS con un limitador externo de mala calidad (sin CPU busy sleep), podés sumar varianza. Usar siempre limitador in-game o RTSS."
        comoRevertirlo="Activar NVIDIA Reflex (Low Latency) en el menú del juego, o fijar el límite en RTSS (RivaTuner) exactamente a tu tasa de refresco menos 3."
      />
    </MagazineMasterPage>
  );
};
