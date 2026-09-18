import React from 'react';
import { MagazineMasterPage } from './MagazineMasterPage';
import { InternetDiceEvoMide } from './InternetDiceEvoMide';

export const Page08Chapter04: React.FC = () => {
  return (
    <MagazineMasterPage
      pageId="magazine-page-08"
      pageNumber={8}
      totalPages={24}
      sectionTitle="CAPÍTULO 04"
      subSlug="TERMODINÁMICA // LÍMITES FÍSICOS & ENERGÍA"
      accentColor="#F97316"
    >
      {/* Header */}
      <div className="mb-2 pb-1.5 border-b border-zinc-800/80 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] font-mono-tech tracking-widest text-orange-400 uppercase font-bold">
            CAPÍTULO 04 // FÍSICA APLICADA
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
            Encontrá el Límite
          </h2>
        </div>
        <span className="font-mono-tech text-[10px] text-zinc-500 uppercase tracking-wider hidden sm:inline">
          CALOR // THROTTLING // FLUJO LAMINAR
        </span>
      </div>

      {/* Hero Infographic: The 3 Physical Walls */}
      <div className="bg-[#0e0c0a] border border-orange-900/40 rounded-lg p-2.5 mb-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech text-zinc-400 border-b border-zinc-800/80 pb-1 mb-2">
          <span className="text-orange-400 font-bold uppercase">LOS TRES MUROS INFRANQUEABLES DEL SILICIO</span>
          <span>DISIPACIÓN EN WATTS (W) // LÍMITE TJUNCTION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-[#14100c] border border-orange-500/30 rounded flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-[9px] font-mono-tech mb-0.5">
                <span className="text-orange-400 font-bold">MURO 01</span>
                <span className="text-zinc-500">~ 95°C - 105°C</span>
              </div>
              <h4 className="font-display font-bold text-white uppercase text-[11px]">Thermal Throttling</h4>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-tight mt-0.5">
                Protección del silicio. Al alcanzar el TjMax, saltea ciclos y baja voltaje para no degradar las pistas.
              </p>
            </div>
            <span className="text-[8px] font-mono-tech text-orange-300 mt-1 bg-black/40 px-1 py-0.5 rounded">
              SÍNTOMA: CAÍDA BRUSCA DE RELOJ
            </span>
          </div>

          <div className="p-2 bg-[#14100c] border border-zinc-800 rounded flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-[9px] font-mono-tech mb-0.5">
                <span className="text-zinc-400 font-bold">MURO 02</span>
                <span className="text-zinc-500">PL1 / PL2 / TDP</span>
              </div>
              <h4 className="font-display font-bold text-white uppercase text-[11px]">Power Limit Throttling</h4>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-tight mt-0.5">
                Aun estando a 60°C, el CPU frena su frecuencia si agota su ventana temporal (Tau) de consumo en watts.
              </p>
            </div>
            <span className="text-[8px] font-mono-tech text-zinc-400 mt-1 bg-black/40 px-1 py-0.5 rounded">
              SÍNTOMA: FRECUENCIA ESTANCADA
            </span>
          </div>

          <div className="p-2 bg-[#14100c] border border-zinc-800 rounded flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-[9px] font-mono-tech mb-0.5">
                <span className="text-zinc-400 font-bold">MURO 03</span>
                <span className="text-zinc-500">VRM &gt; 110°C</span>
              </div>
              <h4 className="font-display font-bold text-white uppercase text-[11px]">VRM Thermal Throttling</h4>
              <p className="text-[9px] text-zinc-400 font-sans-editorial leading-tight mt-0.5">
                Las fases de poder de la placa madre hierven. Aunque el cooler sea líquido, la motherboard frena el micro.
              </p>
            </div>
            <span className="text-[8px] font-mono-tech text-zinc-400 mt-1 bg-black/40 px-1 py-0.5 rounded">
              SÍNTOMA: APAGADOS O FRENO TOTAL
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-zinc-300 font-sans-editorial leading-relaxed">
        <div className="md:col-span-7 space-y-1.5">
          <p className="magazine-dropcap text-zinc-200">
            Toda la energía eléctrica que entra en tu computadora se convierte en calor: un equipo que consume 500 Watts de la pared es equivalente a una estufa de 500 Watts encendida en tu habitación. El desafío no es evitar el calor, sino evacuarlo con la menor resistencia térmica posible.
          </p>
          <p className="text-zinc-400 text-[11px]">
            Muchos usuarios configuran curvas de ventilación histéricas: ante cualquier tarea de 1 segundo, las turbinas saltan al 100%, generando fatiga acústica y turbulencias sin enfriar más el bloque de cobre.
          </p>
        </div>

        <div className="md:col-span-5 bg-[#0e0c0a] border border-zinc-800 p-2.5 rounded-lg flex flex-col justify-between">
          <div className="space-y-1 text-[9px] font-mono-tech">
            <span className="text-orange-400 font-bold uppercase tracking-wider block border-b border-zinc-800 pb-0.5">
              PRESIÓN DE AIRE EN GABINETE
            </span>
            <div className="p-1.5 bg-black/40 border border-zinc-800/80 rounded">
              <strong className="text-zinc-200 block text-[10px]">PRESIÓN POSITIVA (IDEAL)</strong>
              <p className="text-zinc-400">Mayor caudal entrando filtrado que saliendo. Expulsa el polvo por las ranuras y alimenta de aire fresco directo a GPU y VRMs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section: INTERNET DICE // EVO MIDE (MITO-05) */}
      <InternetDiceEvoMide
        idMito="MITO-05"
        consejoPopular="Poné los ventiladores de gabinete y del CPU al 100% constante, o armá curvas que aceleren a fondo apenas toque 65°C para que la PC viva congelada."
        fuentePopular="Foros de overclock y memes de turbinas de avión"
        realidadTecnica="En nodos de fabricación modernos (4nm/5nm), la densidad de calor por milímetro cuadrado es extrema. Una carga monohilo momentánea eleva el silicio interno a 72°C en 200 milisegundos, pero la masa de cobre del disipador ni siquiera se entibió. Acelerar los ventiladores inmediatamente genera ruido insoportable sin bajar el pico. La solución pericial es configurar 'histéresis' (step-up delay) de 2 a 3 segundos para ignorar picos efímeros."
        experimento="Comparativa en banco térmico: A) Curva reactiva instantánea al 100% vs B) Histéresis de 3 segundos con Fan Control + Undervolt por Curve Optimizer de -20."
        herramientaMedicion="HWiNFO64 (CPU Die Sensor) + Sonómetro Clase 2 a 50 cm"
        resultado="mejoro"
        resultadoDetalle="Misma temperatura pico bajo estrés prolongado (79°C vs 81°C), pero el nivel sonoro cayó de 48.2 dBA a 33.6 dBA (-14.6 dBA). Cero aceleraciones molestas."
        riesgo="Si ponés una histéresis superior a 10 segundos, una carga pesada repentina puede alcanzar TjMax antes de que los ventiladores reaccionen."
        comoRevertirlo="Fijar un retardo de aceleración (step-up time) de entre 2 y 3 segundos en el software de control de ventiladores o en el BIOS."
      />
    </MagazineMasterPage>
  );
};
